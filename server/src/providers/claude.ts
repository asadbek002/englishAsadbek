import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type * as z from 'zod/v4';
import { config } from '../config.ts';
import { ProviderError, type AiProvider, type AiTask } from './types.ts';

const client = new Anthropic();

function base() {
  const model = config.claudeModel;
  // Haiku'da server-side fallback yo'q — parametr faqat qo'llab-quvvatlaydigan modellarga yuboriladi.
  const fallback = model.startsWith('claude-haiku')
    ? {}
    : { betas: ['server-side-fallback-2026-07-01'] as Anthropic.Beta.AnthropicBeta[], fallbacks: 'default' as const };
  return { model, max_tokens: 16000, ...fallback };
}

function wrap(err: unknown): never {
  if (err instanceof Anthropic.APIError) {
    throw new ProviderError('claude', err.status === 429 ? 'rate_limit' : err.status === 401 ? 'auth' : 'api', err.message);
  }
  throw new ProviderError('claude', 'api', String(err));
}

export const claude: AiProvider = {
  name: 'claude',

  async json<S extends z.ZodType>(task: AiTask, schema: S): Promise<z.infer<S>> {
    const res = await client.beta.messages.parse({
      ...base(),
      output_config: { effort: task.effort, format: betaZodOutputFormat(schema) },
      system: task.system,
      messages: task.messages,
    }).catch(wrap);
    if (res.stop_reason === 'refusal' || !res.parsed_output) throw new ProviderError('claude', 'refusal', 'Javob olinmadi');
    return res.parsed_output as z.infer<S>;
  },

  async text(task: AiTask): Promise<string> {
    const res = await client.beta.messages.create({
      ...base(),
      output_config: { effort: task.effort },
      system: task.system,
      messages: task.messages,
    }).catch(wrap);
    if (res.stop_reason === 'refusal') throw new ProviderError('claude', 'refusal', 'Javob olinmadi');
    return res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n').trim();
  },
};
