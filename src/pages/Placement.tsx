import { useMemo, useState } from 'react';
import Quiz, { type QuizResult } from '../components/Quiz';
import { Bar, go, Icon, PageHead } from '../components/ui';
import { STAGES } from '../data/levels';
import { PASS_PER_BLOCK, PLACEMENT, startStageFrom } from '../data/placement';
import { addXp, update, useProgress } from '../lib/store';

const BLOCK = 6;

export function Welcome() {
  const startZero = () => {
    update((p) => { p.placement = { passed: 0, stage: 0, scores: [], skipped: true, at: Date.now() }; p.stage = 0; });
    go('');
  };
  return (
    <div className="stack" style={{ gap: 18, paddingTop: 12 }}>
      <div className="hero">
        <p className="greet">Lapis English</p>
        <h1 style={{ fontSize: 28 }}>Ingliz tili: noldan IELTS 8.0 gacha</h1>
        <p style={{ margin: 0, opacity: .9 }}>
          Avval darajangizni aniqlaymiz. Natijaga qarab o'quv yo'lingizning qaysi bosqichidan boshlashingiz belgilanadi.
        </p>
      </div>
      <div className="card stack">
        <h3>Daraja testi qanday ishlaydi</h3>
        <div className="small muted">
          A1 dan C2 gacha 6 ta daraja, har birida 6 ta savol. Blokdan kamida {PASS_PER_BLOCK} ta to'g'ri topsangiz, keyingi darajaga o'tasiz.
          Qiyinlashganda test o'zi to'xtaydi. Odatda 5–10 daqiqa oladi.
        </div>
        <button className="btn block" onClick={() => go('placement/test')}><Icon name="target" />Testni boshlash</button>
        <button className="btn ghost block" onClick={startZero}>Ingliz tilini umuman bilmayman — noldan boshlash</button>
      </div>
      <div className="small muted center">Hisobingiz bormi? <a href="#/profile">Kirish</a></div>
    </div>
  );
}

export function PlacementTest() {
  const progress = useProgress();
  const flat = useMemo(() => PLACEMENT.flatMap((b) => b.questions.map((q) => ({ q, level: b.level }))), []);
  const [result, setResult] = useState<null | { scores: number[]; passed: number; start: number }>(null);

  function finish(r: QuizResult) {
    const blockScores: number[] = [];
    for (let b = 0; b * BLOCK < r.answers.length; b++) {
      blockScores.push(r.answers.slice(b * BLOCK, (b + 1) * BLOCK).filter(Boolean).length);
    }
    let passed = 0;
    for (const s of blockScores) { if (s >= PASS_PER_BLOCK) passed++; else break; }
    const start = startStageFrom(passed, blockScores[0] ?? 0);
    const prevStage = progress.placement ? progress.stage : 0;
    update((p) => {
      p.placement = { passed, stage: start, scores: blockScores, at: Date.now() };
      p.stage = Math.max(prevStage, start);
    });
    addXp(30);
    setResult({ scores: blockScores, passed, start });
  }

  if (result) {
    const st = STAGES[result.start];
    const level = result.passed > 0 ? STAGES[result.passed] : null;
    return (
      <div className="stack" style={{ gap: 16 }}>
        <PageHead title="Natija" sub="Daraja testi" onBack={null} />
        <div className="card center stack">
          <div className="eyebrow">Sizning darajangiz</div>
          <div className="result-num">{level ? level.code : 'Starter'}</div>
          <div className="muted">Taxminiy IELTS: <b style={{ color: 'var(--ink)' }}>{level ? level.band : '0–2.0'}</b></div>
        </div>
        <div className="card stack">
          <h3>Darajalar bo'yicha</h3>
          {PLACEMENT.map((b, i) => {
            const s = result.scores[i];
            return (
              <div key={b.level} className="row">
                <span className="level-code" style={{ minWidth: 38, textAlign: 'center' }}>{STAGES[b.level].code}</span>
                <div style={{ flex: 1 }}><Bar value={s === undefined ? 0 : (s / BLOCK) * 100} tone={s !== undefined && s >= PASS_PER_BLOCK ? 'teal' : undefined} /></div>
                <span className="small muted" style={{ width: 64, textAlign: 'right' }}>{s === undefined ? 'yetilmadi' : `${s}/${BLOCK}`}</span>
              </div>
            );
          })}
        </div>
        <div className="card tint stack">
          <div className="eyebrow">Boshlanish nuqtasi</div>
          <h3><span className="level-code">{st.code}</span> {st.name} — {st.uz}</h3>
          <div className="small">{st.goal}</div>
          <div className="small muted">Oldingi bosqichlar ham ochiq — xohlasangiz takrorlashingiz mumkin.</div>
        </div>
        <button className="btn block" onClick={() => go('')}>O'qishni boshlash</button>
      </div>
    );
  }

  return (
    <Quiz
      questions={flat.map((f) => f.q)}
      label={(i) => STAGES[flat[i].level].code}
      onClose={() => go('')}
      shouldStop={(i, res) => {
        if ((i + 1) % BLOCK !== 0) return false;
        const block = res.slice(i + 1 - BLOCK, i + 1);
        return block.filter(Boolean).length < PASS_PER_BLOCK;
      }}
      onFinish={finish}
    />
  );
}
