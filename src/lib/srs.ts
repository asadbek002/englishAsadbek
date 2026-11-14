import { WORDS, type Word } from '../data/words';
import { dayKey, type Progress, type WordState } from './store';

/**
 * Leitner tizimi. Quti raqami = necha marta ketma-ket to'g'ri topilgan.
 * Quti → keyingi takrorlashgacha kunlar.
 */
export const INTERVAL_DAYS = [0, 1, 2, 4, 8, 16, 32];
export const LEARNED_BOX = 4; // 8+ kun eslab qolingan so'z — "yodlangan"
const DAY = 86_400_000;

export function applyAnswer(s: WordState | undefined, correct: boolean, now = Date.now()): WordState {
  const cur = s ?? { box: 0, due: now, seen: 0, ok: 0, bad: 0 };
  if (correct) {
    const box = Math.min(cur.box + 1, INTERVAL_DAYS.length - 1);
    return { ...cur, box, due: now + INTERVAL_DAYS[box] * DAY, seen: cur.seen + 1, ok: cur.ok + 1 };
  }
  // Xato: 1-qutiga qaytadi va ertaga yana so'raladi
  return { ...cur, box: 1, due: now + DAY, seen: cur.seen + 1, bad: cur.bad + 1 };
}

export const unlockedStages = (p: Progress) => (p.freeMode ? 6 : p.stage);

export function dueWords(p: Progress, now = Date.now()): Word[] {
  const max = unlockedStages(p);
  return WORDS.filter((w) => w.stage <= max && p.words[w.id]?.seen && p.words[w.id].due <= now)
    .sort((a, b) => p.words[a.id].due - p.words[b.id].due);
}

export function newWordsLeftToday(p: Progress): number {
  const used = p.newToday.day === dayKey() ? p.newToday.count : 0;
  return Math.max(0, p.settings.newPerDay - used);
}

/** Yangi so'zlar: avval joriy bosqichdan, keyin pastki bosqichlardagi o'rganilmaganlar. */
export function newWords(p: Progress, limit: number): Word[] {
  const cur = Math.min(p.stage, 6);
  const order = [cur, ...Array.from({ length: cur }, (_, i) => cur - 1 - i)];
  if (p.freeMode) for (let s = cur + 1; s <= 6; s++) order.push(s);
  const out: Word[] = [];
  for (const s of order) {
    for (const w of WORDS) {
      if (out.length >= limit) return out;
      if (w.stage === s && !p.words[w.id]?.seen) out.push(w);
    }
  }
  return out;
}

export function learnedCount(p: Progress, stage?: number) {
  return WORDS.filter((w) => (stage === undefined || w.stage === stage) && (p.words[w.id]?.box ?? 0) >= LEARNED_BOX).length;
}
