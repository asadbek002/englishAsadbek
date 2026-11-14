import { randomBytes } from 'node:crypto';

const env = process.env;

function secret(): string {
  if (env.JWT_SECRET) return env.JWT_SECRET;
  console.warn("[config] JWT_SECRET o'rnatilmagan — vaqtinchalik kalit ishlatilmoqda. Server qayta ishga tushsa, hamma tizimdan chiqib ketadi.");
  return randomBytes(32).toString('hex');
}

type ProviderName = 'gemini' | 'claude';

/**
 * AI_PROVIDER:
 *   auto   — (standart) kaliti bor provayderlar: avval Gemini, ishlamasa Claude
 *   gemini — faqat Gemini
 *   claude — faqat Claude
 */
function providers(): ProviderName[] {
  const has = { gemini: Boolean(env.GEMINI_API_KEY), claude: Boolean(env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN) };
  const mode = (env.AI_PROVIDER ?? 'auto').toLowerCase();
  const order: ProviderName[] = mode === 'claude' ? ['claude'] : mode === 'gemini' ? ['gemini'] : ['gemini', 'claude'];
  return order.filter((p) => has[p]);
}

export const config = {
  port: Number(env.PORT ?? 8787),
  host: env.HOST ?? '0.0.0.0',
  dbPath: env.DB_PATH ?? './data/app.db',
  jwtSecret: secret(),
  tokenTtlDays: Number(env.TOKEN_TTL_DAYS ?? 60),
  aiProviders: providers(),
  geminiModel: env.GEMINI_MODEL ?? 'gemini-2.5-flash',
  claudeModel: env.CLAUDE_MODEL ?? 'claude-opus-5-5',
  aiDailyLimit: Number(env.AI_DAILY_LIMIT ?? 40),
  corsOrigin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : true,
  staticDir: env.STATIC_DIR ?? '../dist',
};

export const aiEnabled = () => config.aiProviders.length > 0;
