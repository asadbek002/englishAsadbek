import { useMemo, useState } from 'react';
import Quiz, { type QuizResult } from '../components/Quiz';
import { go, PageHead } from '../components/ui';
import { topicsOfStage } from '../data/grammar';
import { STAGES } from '../data/levels';
import { c, type Question } from '../data/types';
import { WORDS, wordsOfStage } from '../data/words';
import { PASS_EXAM, stageInfo } from '../lib/progress';
import { addXp, update, useProgress } from '../lib/store';
import { pct, sample } from '../lib/util';

/** Bosqich imtihoni: 12 ta grammatika + 8 ta so'z savoli. */
function buildExam(stage: number): Question[] {
  const grammar = sample(topicsOfStage(stage).flatMap((t) => t.exercises), 12);
  const words = sample(wordsOfStage(stage), 8).map((w) => {
    const pool = WORDS.filter((x) => x.id !== w.id);
    const toEn = Math.random() < 0.5;
    return toEn
      ? c(`«${w.uz}» / «${w.ru}» inglizchada:`, w.en, ...sample(pool, 3).map((x) => x.en))
      : c(`«${w.en}» so'zining tarjimasi:`, `${w.uz} — ${w.ru}`, ...sample(pool, 3).map((x) => `${x.uz} — ${x.ru}`));
  });
  return [...grammar, ...words];
}

export default function Exam({ stage }: { stage: number }) {
  const p = useProgress();
  const info = stageInfo(p, stage);
  const questions = useMemo(() => buildExam(stage), [stage]);
  const [res, setRes] = useState<QuizResult | null>(null);
  const st = STAGES[stage];

  if (!info.examReady) {
    return (
      <div>
        <PageHead title={`${st.code} imtihoni`} />
        <div className="notice">Imtihon uchun avval bu bosqichdagi barcha grammatika darslarini o'ting ({info.done}/{info.topics.length}).</div>
      </div>
    );
  }

  function finish(r: QuizResult) {
    const score = pct(r.correct, r.total);
    update((d) => {
      d.exams[stage] = Math.max(d.exams[stage] ?? 0, score);
      if (score >= PASS_EXAM && d.stage === stage && stage < 6) d.stage = stage + 1;
    });
    addXp(r.correct * 2 + (score >= PASS_EXAM ? 100 : 0));
    setRes(r);
  }

  if (res) {
    const score = pct(res.correct, res.total);
    const ok = score >= PASS_EXAM;
    const next = STAGES[stage + 1];
    return (
      <div className="stack" style={{ gap: 14 }}>
        <PageHead title={`${st.code} imtihoni`} sub="Natija" onBack={() => go('path')} />
        <div className="card center stack">
          <div className="result-num" style={{ color: ok ? 'var(--teal)' : 'var(--rose)' }}>{score}%</div>
          {ok ? (
            <div>{next ? <>Tabriklaymiz! <b>{next.code} · {next.name}</b> bosqichi ochildi. +100 XP</> : "Siz eng yuqori bosqichni tugatdingiz! Endi IELTS markazida Writing va Speaking'ni mashq qiling."}</div>
          ) : (
            <div>O'tish uchun {PASS_EXAM}% kerak. Xato qilgan mavzularni takrorlab, qayta urinib ko'ring.</div>
          )}
        </div>
        <button className="btn block" onClick={() => go('path')}>O'quv yo'liga qaytish</button>
      </div>
    );
  }

  return <Quiz questions={questions} onFinish={finish} onClose={() => go('path')} />;
}
