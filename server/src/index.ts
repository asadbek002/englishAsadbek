import Fastify from 'fastify';
import cors from '@fastify/cors';
import fstatic from '@fastify/static';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import * as z from 'zod/v4';
import { aiEnabled, config } from './config.ts';
import { db, type UserRow } from './db.ts';
import { hashPassword, issueToken, requireAuth, verifyPassword } from './auth.ts';
import { AIUnavailable, evaluateSpeaking, evaluateWriting, tutorReply } from './ai.ts';

const app = Fastify({ logger: { level: 'info' }, bodyLimit: 2 * 1024 * 1024 });
await app.register(cors, { origin: config.corsOrigin });

const publicUser = (u: UserRow) => ({ id: u.id, username: u.username, name: u.name, createdAt: u.created_at });

function parse<T extends z.ZodType>(schema: T, body: unknown): z.infer<T> {
  const r = schema.safeParse(body);
  if (!r.success) {
    const err = new Error(r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
    (err as Error & { statusCode: number }).statusCode = 400;
    throw err;
  }
  return r.data;
}

// ───────────── Health ─────────────
app.get('/api/health', async () => ({ ok: true, ai: aiEnabled(), providers: config.aiProviders }));

// ───────────── Vocabulary (scripts/vocab.ts yaratadi) ─────────────
const VOCAB_FILE = join(resolve(dirname(config.dbPath)), 'vocab.json');
let vocabCache: { mtime: number; etag: string; body: string } | null = null;

app.get('/api/vocab', async (req, reply) => {
  if (!existsSync(VOCAB_FILE)) return { version: 0, words: [] };
  const mtime = statSync(VOCAB_FILE).mtimeMs;
  if (!vocabCache || vocabCache.mtime !== mtime) {
    const data = JSON.parse(readFileSync(VOCAB_FILE, 'utf8')) as { version: number; words: { en: string; level: string; uz: string; ru: string }[] };
    // Ixcham format: [en, uz, ru, level]
    const body = JSON.stringify({ version: data.version, words: data.words.map((w) => [w.en, w.uz, w.ru, w.level]) });
    vocabCache = { mtime, etag: `"v${data.version}"`, body };
  }
  reply.header('etag', vocabCache.etag).header('cache-control', 'no-cache');
  if (req.headers['if-none-match'] === vocabCache.etag) return reply.code(304).send();
  return reply.type('application/json').send(vocabCache.body);
});

// ───────────── Auth ─────────────
const Credentials = z.object({
  username: z.string().trim().min(3, 'Login kamida 3 belgi').max(32).regex(/^[a-zA-Z0-9_.]+$/, 'Login faqat lotin harflari, raqam, _ va .'),
  password: z.string().min(6, 'Parol kamida 6 belgi').max(128),
});

app.post('/api/auth/register', async (req, reply) => {
  const body = parse(Credentials.extend({ name: z.string().trim().min(1).max(60) }), req.body);
  const exists = db.prepare('SELECT 1 FROM users WHERE username = ?').get(body.username);
  if (exists) return reply.code(409).send({ error: 'Bu login band. Boshqasini tanlang.' });
  const hash = await hashPassword(body.password);
  const r = db.prepare('INSERT INTO users (username, name, pass_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(body.username, body.name, hash, Date.now());
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(r.lastInsertRowid) as unknown as UserRow;
  return { token: issueToken(user.id), user: publicUser(user) };
});

app.post('/api/auth/login', async (req, reply) => {
  const body = parse(Credentials, req.body);
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(body.username) as unknown as UserRow | undefined;
  if (!user || !(await verifyPassword(body.password, user.pass_hash))) {
    return reply.code(401).send({ error: "Login yoki parol noto'g'ri." });
  }
  return { token: issueToken(user.id), user: publicUser(user) };
});

app.get('/api/me', { preHandler: requireAuth }, async (req, reply) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId!) as unknown as UserRow | undefined;
  if (!user) return reply.code(401).send({ error: 'Foydalanuvchi topilmadi.' });
  return { user: publicUser(user) };
});

// ───────────── Progress sync (last-write-wins) ─────────────
app.get('/api/progress', { preHandler: requireAuth }, async (req) => {
  const row = db.prepare('SELECT data, updated_at FROM progress WHERE user_id = ?').get(req.userId!) as
    | { data: string; updated_at: number } | undefined;
  return row ? { data: JSON.parse(row.data), updatedAt: row.updated_at } : { data: null, updatedAt: 0 };
});

app.put('/api/progress', { preHandler: requireAuth }, async (req, reply) => {
  const body = parse(z.object({ data: z.record(z.string(), z.unknown()), updatedAt: z.number() }), req.body);
  const row = db.prepare('SELECT updated_at FROM progress WHERE user_id = ?').get(req.userId!) as { updated_at: number } | undefined;
  if (row && row.updated_at > body.updatedAt) {
    // Serverdagi nusxa yangiroq — mijozga qaytaramiz.
    const cur = db.prepare('SELECT data, updated_at FROM progress WHERE user_id = ?').get(req.userId!) as { data: string; updated_at: number };
    return reply.code(409).send({ data: JSON.parse(cur.data), updatedAt: cur.updated_at });
  }
  db.prepare(`INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?)
              ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`)
    .run(req.userId!, JSON.stringify(body.data), body.updatedAt);
  return { ok: true, updatedAt: body.updatedAt };
});

// ───────────── AI ─────────────
const today = () => new Date().toISOString().slice(0, 10);

function useAiQuota(userId: number): { ok: boolean; left: number } {
  const row = db.prepare('SELECT count FROM ai_usage WHERE user_id = ? AND day = ?').get(userId, today()) as { count: number } | undefined;
  const used = row?.count ?? 0;
  if (used >= config.aiDailyLimit) return { ok: false, left: 0 };
  db.prepare(`INSERT INTO ai_usage (user_id, day, count) VALUES (?, ?, 1)
              ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1`).run(userId, today());
  return { ok: true, left: config.aiDailyLimit - used - 1 };
}

app.register(async (ai) => {
  ai.addHook('preHandler', requireAuth);
  ai.addHook('preHandler', async (req, reply) => {
    if (!aiEnabled()) return reply.code(503).send({ error: "AI serverda sozlanmagan (GEMINI_API_KEY yoki ANTHROPIC_API_KEY yo'q)." });
    const q = useAiQuota(req.userId!);
    if (!q.ok) return reply.code(429).send({ error: `Bugungi AI limiti (${config.aiDailyLimit} ta) tugadi. Ertaga davom eting.` });
    reply.header('x-ai-left', String(q.left));
  });

  ai.post('/api/ai/writing', async (req, reply) => {
    const b = parse(z.object({
      task: z.enum(['task1', 'task2']),
      prompt: z.string().min(10).max(3000),
      text: z.string().min(20, 'Javob juda qisqa').max(12000),
    }), req.body);
    const { data: result, provider } = await evaluateWriting(b.task, b.prompt, b.text);
    reply.header('x-ai-provider', provider);
    db.prepare('INSERT INTO submissions (user_id, kind, prompt, answer, result, band, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(req.userId!, 'writing', b.prompt, b.text, JSON.stringify(result), result.overall, Date.now());
    return result;
  });

  ai.post('/api/ai/speaking', async (req, reply) => {
    const b = parse(z.object({
      part: z.number().int().min(1).max(3),
      question: z.string().min(3).max(2000),
      transcript: z.string().min(5, 'Gapirilgan matn topilmadi').max(8000),
      seconds: z.number().min(1).max(600),
    }), req.body);
    const { data: result, provider } = await evaluateSpeaking(b.part, b.question, b.transcript, b.seconds);
    reply.header('x-ai-provider', provider);
    db.prepare('INSERT INTO submissions (user_id, kind, prompt, answer, result, band, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(req.userId!, 'speaking', b.question, b.transcript, JSON.stringify(result), result.overall, Date.now());
    return result;
  });

  ai.post('/api/ai/tutor', async (req, reply) => {
    const b = parse(z.object({
      level: z.string().max(20).default('A1'),
      messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(4000) })).min(1).max(40),
    }), req.body);
    const { data, provider } = await tutorReply(b.messages, b.level);
    reply.header('x-ai-provider', provider);
    return { reply: data, provider };
  });
});

app.get('/api/submissions', { preHandler: requireAuth }, async (req) => {
  const rows = db.prepare('SELECT id, kind, prompt, answer, result, band, created_at FROM submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 30')
    .all(req.userId!) as Array<{ id: number; kind: string; prompt: string; answer: string; result: string; band: number; created_at: number }>;
  return rows.map((r) => ({ ...r, result: JSON.parse(r.result) }));
});

// ───────────── Errors ─────────────
app.setErrorHandler((err, _req, reply) => {
  if (err instanceof AIUnavailable) {
    app.log.warn({ providers: err.kinds }, 'all AI providers failed');
    const limited = err.kinds.every((k) => k.endsWith(':rate_limit'));
    return reply.code(503).send({ error: limited ? "AI'ning bugungi bepul limiti tugadi. Keyinroq urinib ko'ring." : err.message });
  }
  const status = (err as { statusCode?: number }).statusCode ?? 500;
  if (status >= 500) app.log.error(err);
  return reply.code(status).send({ error: status >= 500 ? 'Server xatosi.' : (err as Error).message });
});

// ───────────── Frontend (agar build qilingan bo'lsa) ─────────────
const staticRoot = resolve(config.staticDir);
if (existsSync(staticRoot)) {
  await app.register(fstatic, { root: staticRoot });
  app.setNotFoundHandler((req, reply) =>
    req.url.startsWith('/api/') ? reply.code(404).send({ error: 'Topilmadi' }) : reply.sendFile('index.html'));
}

await app.listen({ port: config.port, host: config.host });
