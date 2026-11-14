/**
 * CEFR so'z ro'yxatini AI yordamida o'zbek va rus tillariga tarjima qiladi.
 *
 *   docker compose exec app node --experimental-strip-types --no-warnings scripts/vocab.ts
 *
 * Natija: <DATA_DIR>/vocab.json. Skript to'xtab qolsa, qayta ishga tushiring —
 * tarjima qilinganlar saqlanadi va davom ettiriladi.
 */
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as z from 'zod/v4';
import { config } from '../src/config.ts';
import { claude } from '../src/providers/claude.ts';
import { gemini } from '../src/providers/gemini.ts';
import { ProviderError, type AiProvider } from '../src/providers/types.ts';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '../vocab/cefr-words.tsv');
const OUT = join(resolve(dirname(config.dbPath)), 'vocab.json');
const BATCH = Number(process.env.VOCAB_BATCH ?? 120);
const PAUSE_MS = Number(process.env.VOCAB_PAUSE_MS ?? 7000); // tekin tarifda daqiqasiga so'rov cheklovi bor

interface Entry { en: string; level: string; pos: string; uz: string; ru: string }

const source = readFileSync(SRC, 'utf8').split('\n')
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [en, level, pos] = l.split('\t'); return { en, level, pos }; });

const done: Record<string, Entry> = existsSync(OUT)
  ? Object.fromEntries((JSON.parse(readFileSync(OUT, 'utf8')).words as Entry[]).map((w) => [w.en, w]))
  : {};

function save() {
  const words = source.filter((s) => done[s.en]).map((s) => done[s.en]);
  const tmp = OUT + '.tmp';
  writeFileSync(tmp, JSON.stringify({ version: Date.now(), count: words.length, words }));
  renameSync(tmp, OUT);
}

const Batch = z.object({
  items: z.array(z.object({
    en: z.string(),
    uz: z.string().describe("O'zbekcha tarjima, lotin yozuvida, 1-3 ta asosiy ma'no vergul bilan"),
    ru: z.string().describe('Русский перевод, 1-3 основных значения через запятую'),
  })),
});

const SYSTEM = `You are a professional English–Uzbek–Russian lexicographer building flashcards for Uzbek learners of English.
For each English headword give its most common meanings (1-3, most frequent first), matching the given part(s) of speech.
Rules:
- Uzbek: Latin script with o' and g' (apostrophe), dictionary form (verbs end with -moq), no explanations.
- Russian: dictionary form (verbs in infinitive), no explanations.
- Keep each translation short (max ~40 characters). Separate meanings with ", ".
- Return exactly one item per input word, with "en" copied exactly as given.`;

const providers: AiProvider[] = config.aiProviders.map((n) => (n === 'gemini' ? gemini : claude));
if (!providers.length) {
  console.error("GEMINI_API_KEY yoki ANTHROPIC_API_KEY topilmadi (.env).");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function translate(batch: typeof source): Promise<z.infer<typeof Batch>['items']> {
  const list = batch.map((w) => `${w.en} (${w.pos})`).join('\n');
  for (let attempt = 0; attempt < 6; attempt++) {
    for (const p of providers) {
      try {
        const r = await p.json({ system: SYSTEM, effort: 'low', messages: [{ role: 'user', content: `Translate these ${batch.length} words:\n${list}` }] }, Batch);
        return r.items;
      } catch (err) {
        if (!(err instanceof ProviderError)) throw err;
        console.warn(`  ${p.name}: ${err.kind} — ${err.message.slice(0, 120)}`);
        if (err.kind === 'auth') {
          console.error(`${p.name} kaliti noto'g'ri. .env faylini tekshiring.`);
          process.exit(1);
        }
      }
    }
    const wait = 30_000 * (attempt + 1);
    console.warn(`  ${wait / 1000} soniya kutilmoqda…`);
    await sleep(wait);
  }
  throw new Error("Tarjima qilib bo'lmadi. Limit tugagan bo'lishi mumkin — keyinroq skriptni qayta ishga tushiring.");
}

const todo = source.filter((s) => !done[s.en]);
console.log(`Jami: ${source.length} · tayyor: ${source.length - todo.length} · qoldi: ${todo.length} · provayder: ${config.aiProviders.join(' → ')}`);

for (let i = 0; i < todo.length; i += BATCH) {
  const batch = todo.slice(i, i + BATCH);
  const items = await translate(batch);
  const byEn = new Map(items.map((x) => [x.en.trim().toLowerCase(), x]));
  let ok = 0;
  for (const w of batch) {
    const t = byEn.get(w.en.toLowerCase());
    if (t?.uz?.trim() && t?.ru?.trim()) { done[w.en] = { ...w, uz: t.uz.trim(), ru: t.ru.trim() }; ok++; }
  }
  save();
  const total = Object.keys(done).length;
  console.log(`[${total}/${source.length}] +${ok}${ok < batch.length ? ` (${batch.length - ok} tasi keyingi safar)` : ''}`);
  if (i + BATCH < todo.length) await sleep(PAUSE_MS);
}

console.log(`Tayyor: ${OUT}`);
