import type * as z from 'zod/v4';

export interface ChatTurn { role: 'user' | 'assistant'; content: string }

export interface AiTask {
  system: string;
  messages: ChatTurn[];
  effort: 'low' | 'medium' | 'high';
}

export type ProviderName = 'gemini' | 'claude';

export interface AiProvider {
  name: ProviderName;
  json<S extends z.ZodType>(task: AiTask, schema: S): Promise<z.infer<S>>;
  text(task: AiTask): Promise<string>;
}

export type ErrorKind = 'rate_limit' | 'auth' | 'api' | 'refusal' | 'bad_output';

export class ProviderError extends Error {
  provider: ProviderName;
  kind: ErrorKind;
  constructor(provider: ProviderName, kind: ErrorKind, message: string) {
    super(message);
    this.provider = provider;
    this.kind = kind;
  }
}
