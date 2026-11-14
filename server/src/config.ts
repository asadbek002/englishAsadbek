import { randomBytes } from 'node:crypto';

const env = process.env;

function secret(): string {
  if (env.JWT_SECRET) return env.JWT_SECRET;
  console.warn("[config] JWT_SECRET o'rnatilmagan — vaqtinchalik kalit ishlatilmoqda. Server qayta ishga tushsa, hamma tizimdan chiqib ketadi.");
  return randomBytes(32).toString('hex');
}

export const config = {
  port: Number(env.PORT ?? 8787),
  host: env.HOST ?? '0.0.0.0',
  dbPath: env.DB_PATH ?? './data/app.db',
  jwtSecret: secret(),
  tokenTtlDays: Number(env.TOKEN_TTL_DAYS ?? 60),
  aiModel: env.CLAUDE_MODEL ?? 'claude-opus-5-5',
  aiDailyLimit: Number(env.AI_DAILY_LIMIT ?? 40),
  aiEnabled: Boolean(env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN),
  corsOrigin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : true,
  staticDir: env.STATIC_DIR ?? '../dist',
};
