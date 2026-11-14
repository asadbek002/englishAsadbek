import { ApiError, GoogleGenAI, type Content } from '@google/genai';
import * as z from 'zod/v4';
import { config } from '../config.ts';
import { ProviderError, type AiProvider, type AiTask } from './types.ts';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

const toContents = (task: AiTask): Content[] =>
  task.messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

async function generate(task: AiTask, json?: unknown): Promise<string> {
  try {
    const res = await client.models.generateContent({
      model: config.geminiModel,
      contents: toContents(task),
      config: {
        systemInstruction: task.system,
        maxOutputTokens: 16000,
        ...(json ? { responseMimeType: 'application/json', responseJsonSchema: json } : {}),
      },
    });
    const text = res.text;
    if (!text) throw new ProviderError('gemini', 'refusal', 'Gemini bo\'sh javob qaytardi');
    return text;
  } catch (err) {
    if (err instanceof ApiError) {
      // 429 — tekin tarif limiti tugagan
      throw new ProviderError('gemini', err.status === 429 ? 'rate_limit' : err.status === 401 || err.status === 403 ? 'auth' : 'api', err.message);
    }
    if (err instanceof ProviderError) throw err;
    throw new ProviderError('gemini', 'api', String(err)); // tarmoq xatosi va h.k.
  }
}

export const gemini: AiProvider = {
  name: 'gemini',

  async json<S extends z.ZodType>(task: AiTask, schema: S): Promise<z.infer<S>> {
    const { $schema: _, ...jsonSchema } = z.toJSONSchema(schema) as Record<string, unknown>;
    const raw = await generate(task, jsonSchema);
    try {
      return schema.parse(JSON.parse(raw));
    } catch {
      throw new ProviderError('gemini', 'bad_output', 'Gemini javobi kutilgan formatda emas');
    }
  },

  text: (task) => generate(task),
};
