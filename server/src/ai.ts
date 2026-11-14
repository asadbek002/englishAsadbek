import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import * as z from 'zod/v4';
import { config } from './config.ts';

const client = new Anthropic();

/** Barcha so'rovlar uchun umumiy parametrlar: model rad etsa, server-side fallback ishlaydi. */
function base() {
  return {
    model: config.aiModel,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'] as Anthropic.Beta.AnthropicBeta[],
    fallbacks: 'default' as const,
  };
}

const LANG_RULES = `Language rules (very important):
- The learner is an Uzbek speaker. Write all general feedback in Uzbek (Latin script).
- The learner does NOT know grammar terminology in Uzbek. Whenever you explain a GRAMMAR rule or mistake, explain it in Russian.
- Keep English examples and corrections in English.`;

export class AIRefusal extends Error {}

// ───────────── Writing ─────────────

const WritingResult = z.object({
  overall: z.number().describe('Overall IELTS band, rounded to the nearest 0.5'),
  criteria: z.array(z.object({
    name: z.string().describe('Task Achievement / Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy'),
    band: z.number(),
    comment_uz: z.string(),
  })),
  word_count: z.number(),
  summary_uz: z.string(),
  strengths_uz: z.array(z.string()),
  mistakes: z.array(z.object({
    original: z.string(),
    correction: z.string(),
    explanation_ru: z.string(),
  })),
  vocabulary_upgrades: z.array(z.object({ basic: z.string(), better: z.string(), example: z.string() })),
  improved_version: z.string().describe('The same essay rewritten at roughly one band higher, keeping the learner\'s ideas'),
  next_steps_uz: z.array(z.string()),
});
export type WritingResult = z.infer<typeof WritingResult>;

export async function evaluateWriting(task: 'task1' | 'task2', prompt: string, text: string): Promise<WritingResult> {
  const res = await client.beta.messages.parse({
    ...base(),
    output_config: { effort: 'high', format: betaZodOutputFormat(WritingResult) },
    system: `You are a strict, experienced IELTS Academic Writing examiner and a kind teacher.
Score using the official public IELTS band descriptors. Be realistic: do not inflate bands.
For Task 1 the minimum is 150 words, for Task 2 it is 250 words; penalise under-length answers as the descriptors require.
List the most important mistakes first (max 10). Give 3-6 vocabulary upgrades.
${LANG_RULES}`,
    messages: [{
      role: 'user',
      content: `IELTS Writing ${task === 'task1' ? 'Task 1' : 'Task 2'}\n\nQuestion:\n${prompt}\n\nCandidate's answer:\n${text}`,
    }],
  });
  if (res.stop_reason === 'refusal' || !res.parsed_output) throw new AIRefusal('AI javob bera olmadi.');
  return res.parsed_output;
}

// ───────────── Speaking ─────────────

const SpeakingResult = z.object({
  overall: z.number(),
  criteria: z.array(z.object({
    name: z.string().describe('Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation'),
    band: z.number(),
    comment_uz: z.string(),
  })),
  summary_uz: z.string(),
  mistakes: z.array(z.object({ original: z.string(), correction: z.string(), explanation_ru: z.string() })),
  useful_phrases: z.array(z.string()),
  model_answer: z.string().describe('A Band 8 sample answer to the same question'),
  next_steps_uz: z.array(z.string()),
});
export type SpeakingResult = z.infer<typeof SpeakingResult>;

export async function evaluateSpeaking(part: number, question: string, transcript: string, seconds: number): Promise<SpeakingResult> {
  const res = await client.beta.messages.parse({
    ...base(),
    output_config: { effort: 'medium', format: betaZodOutputFormat(SpeakingResult) },
    system: `You are an experienced IELTS Speaking examiner.
You receive an automatic speech-to-text transcript, so punctuation may be missing and some words may be mis-recognised.
Pronunciation can only be estimated from the transcript: say so briefly in that criterion's comment and do not over-penalise recognition errors.
Judge fluency partly from length versus speaking time.
${LANG_RULES}`,
    messages: [{
      role: 'user',
      content: `IELTS Speaking Part ${part}\nQuestion: ${question}\nSpeaking time: ${seconds} seconds\n\nTranscript:\n${transcript}`,
    }],
  });
  if (res.stop_reason === 'refusal' || !res.parsed_output) throw new AIRefusal('AI javob bera olmadi.');
  return res.parsed_output;
}

// ───────────── Tutor chat ─────────────

export interface ChatTurn { role: 'user' | 'assistant'; content: string }

export async function tutorReply(history: ChatTurn[], level: string): Promise<string> {
  const res = await client.beta.messages.create({
    ...base(),
    output_config: { effort: 'medium' },
    system: `You are a friendly personal English teacher inside a learning app called Lapis English.
The learner's current level is ${level}. Their goal is IELTS 8.0.
Answer concisely (usually under 200 words), use simple formatting (short paragraphs, "-" bullets, **bold**).
Give English examples with translations. If the learner writes in English, also gently correct their mistakes.
${LANG_RULES}`,
    messages: history.slice(-12),
  });
  if (res.stop_reason === 'refusal') throw new AIRefusal('AI bu savolga javob bera olmadi.');
  return res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n').trim();
}
