export type Question =
  | { kind: 'choice'; q: string; options: string[]; answer: string; note?: string }
  | { kind: 'input'; q: string; answers: string[]; note?: string };

/** Variantli savol: birinchi variant — to'g'ri javob (ko'rsatishda aralashtiriladi). */
export const c = (q: string, correct: string, ...wrong: string[]): Question => ({
  kind: 'choice', q, options: [correct, ...wrong], answer: correct,
});
/** Yozma savol: bir nechta to'g'ri javob "/" bilan ajratiladi. */
export const w = (q: string, answers: string): Question => ({
  kind: 'input', q, answers: answers.split('/').map((s) => s.trim()),
});
