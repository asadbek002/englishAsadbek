import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from './config.ts';

function scrypt(pw: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCb(pw, salt, 64, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt);
  return ['scrypt', salt.toString('hex'), key.toString('hex')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, keyHex] = stored.split('$');
  if (algo !== 'scrypt' || !saltHex || !keyHex) return false;
  const key = await scrypt(password, Buffer.from(saltHex, 'hex'));
  const expected = Buffer.from(keyHex, 'hex');
  return expected.length === key.length && timingSafeEqual(expected, key);
}

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (data: string) => createHmac('sha256', config.jwtSecret).update(data).digest('base64url');

/** HS256 JWT. */
export function issueToken(userId: number): string {
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64(JSON.stringify({ sub: userId, iat: now, exp: now + config.tokenTtlDays * 86400 }));
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

export function readToken(token: string): number | null {
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) return null;
  const expected = Buffer.from(sign(`${h}.${p}`));
  const got = Buffer.from(s);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (typeof payload.sub !== 'number' || payload.exp < Date.now() / 1000) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

declare module 'fastify' {
  interface FastifyRequest { userId?: number }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const header = req.headers.authorization ?? '';
  const id = header.startsWith('Bearer ') ? readToken(header.slice(7)) : null;
  if (!id) return reply.code(401).send({ error: 'Avval tizimga kiring.' });
  req.userId = id;
}
