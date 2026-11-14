import { topicsOfStage } from '../data/grammar';
import { STAGES } from '../data/levels';
import { wordsOfStage } from '../data/words';
import { learnedCount } from './srs';
import type { Progress } from './store';

export const PASS_LESSON = 80; // grammatika darsi: ≥80% → o'tildi
export const PASS_EXAM = 80;   // bosqich imtihoni: ≥80% → keyingi bosqich

export function stageInfo(p: Progress, s: number) {
  const topics = topicsOfStage(s);
  const done = topics.filter((t) => p.grammar[t.id]?.done).length;
  const words = wordsOfStage(s).length;
  const learned = learnedCount(p, s);
  const exam = p.exams[s] ?? 0;
  const unlocked = p.freeMode || s <= p.stage;
  const passed = exam >= PASS_EXAM || s < p.stage;
  return {
    stage: STAGES[s], topics, done, words, learned, exam, unlocked, passed,
    examReady: unlocked && done === topics.length,
    percent: Math.round(((done / Math.max(1, topics.length)) * 0.7 + (learned / Math.max(1, words)) * 0.3) * 100),
  };
}

/** Joriy bosqichdagi birinchi o'tilmagan dars. */
export const nextTopic = (p: Progress) => topicsOfStage(p.stage).find((x) => !p.grammar[x.id]?.done);

/** IELTS lentasidagi taxminiy o'rin. */
export function bandEstimate(p: Progress) {
  const st = STAGES[Math.min(p.stage, 6)];
  const info = stageInfo(p, st.id);
  const prev = st.id > 0 ? STAGES[st.id - 1].bandValue : 0;
  // Bosqich ichidagi o'zlashtirishga qarab oldingi va joriy qiymat orasida
  const value = prev + (st.bandValue - prev) * (info.percent / 100);
  return { value: Math.round(value * 2) / 2, label: st.band, stage: st };
}
