import { useState } from 'react';
import Quiz, { type QuizResult } from '../components/Quiz';
import { go, Icon, PageHead, Rich } from '../components/ui';
import { TOPIC_BY_ID, topicsOfStage } from '../data/grammar';
import { STAGES } from '../data/levels';
import { TENSES } from '../data/ielts';
import { PASS_LESSON, stageInfo } from '../lib/progress';
import { addXp, update, useProgress } from '../lib/store';
import { canSpeak, pct, speak } from '../lib/util';

/** Grammatika ro'yxati: bosqichlar bo'yicha. */
export function GrammarList({ focusStage }: { focusStage?: number }) {
  const p = useProgress();
  const stages = focusStage !== undefined ? [STAGES[focusStage]] : STAGES;
  return (
    <div>
      <PageHead
        title={focusStage !== undefined ? `${STAGES[focusStage].code} · ${STAGES[focusStage].name}` : 'Grammatika'}
        sub="Объяснения на русском"
        onBack={focusStage !== undefined ? undefined : null}
      />
      {focusStage === undefined && (
        <a className="card tile" href="#/tenses" style={{ marginBottom: 8 }}>
          <div className="ico saffron"><Icon name="table" /></div>
          <div style={{ flex: 1 }}><h3>Таблица времён</h3><p>12 zamon bir sahifada</p></div>
          <Icon name="next" />
        </a>
      )}
      {stages.map((st) => {
        const info = stageInfo(p, st.id);
        return (
          <section key={st.id}>
            <h2 className="row"><span className="level-code">{st.code}</span> {st.name}
              {!info.unlocked && <span className="chip" style={{ marginLeft: 'auto' }}><Icon name="lock" size={14} /> yopiq</span>}
            </h2>
            <div className="stack" style={{ gap: 8 }}>
              {topicsOfStage(st.id).map((t) => {
                const g = p.grammar[t.id];
                return (
                  <a key={t.id} className="card tile flat" href={info.unlocked ? `#/grammar/${t.id}` : undefined}
                    style={{ padding: 14, opacity: info.unlocked ? 1 : .55 }}
                    onClick={(e) => { if (!info.unlocked) e.preventDefault(); }}>
                    <div className={`ico ${g?.done ? 'teal' : ''}`} style={{ width: 38, height: 38, borderRadius: 12 }}>
                      <Icon name={g?.done ? 'check' : 'book'} size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 15 }}>{t.title}</h3>
                      <p>{t.ru}</p>
                    </div>
                    {g && <span className={`chip ${g.done ? 'teal' : ''}`}>{g.best}%</span>}
                  </a>
                );
              })}
            </div>
            {info.unlocked && (
              <a className={`btn ${info.examReady ? '' : 'ghost'} block`} style={{ marginTop: 12 }}
                href={info.examReady ? `#/exam/${st.id}` : undefined}
                onClick={(e) => { if (!info.examReady) e.preventDefault(); }}
                aria-disabled={!info.examReady}>
                <Icon name="trophy" />
                {info.examReady ? `${st.code} bosqich imtihoni${info.exam ? ` · ${info.exam}%` : ''}` : `Imtihon: avval ${info.topics.length - info.done} ta dars qoldi`}
              </a>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function TopicPage({ id }: { id: string }) {
  const t = TOPIC_BY_ID.get(id);
  const p = useProgress();
  const [mode, setMode] = useState<'learn' | 'practice' | 'done'>('learn');
  const [res, setRes] = useState<QuizResult | null>(null);
  const [run, setRun] = useState(0);

  if (!t) return <div><PageHead title="Topilmadi" /><p>Bunday mavzu yo'q.</p></div>;
  const st = STAGES[t.stage];
  const prevBest = p.grammar[t.id]?.best ?? 0;
  const list = topicsOfStage(t.stage);
  const nextT = list[list.indexOf(t) + 1];

  function finish(r: QuizResult) {
    const score = pct(r.correct, r.total);
    const wasDone = p.grammar[t!.id]?.done;
    update((d) => {
      const g = d.grammar[t!.id];
      d.grammar[t!.id] = { best: Math.max(g?.best ?? 0, score), done: Boolean(g?.done) || score >= PASS_LESSON, at: Date.now() };
    });
    addXp(r.correct * 2 + (score >= PASS_LESSON && !wasDone ? 20 : 0));
    setRes(r);
    setMode('done');
  }

  if (mode === 'practice') {
    return <Quiz key={run} questions={t.exercises} onFinish={finish} onClose={() => setMode('learn')} />;
  }

  if (mode === 'done' && res) {
    const score = pct(res.correct, res.total);
    const passed = score >= PASS_LESSON;
    return (
      <div className="stack" style={{ gap: 14 }}>
        <PageHead title={t.title} sub="Natija" onBack={() => setMode('learn')} />
        <div className="card center stack">
          <div className="result-num" style={{ color: passed ? 'var(--teal)' : 'var(--rose)' }}>{score}%</div>
          <div>{passed ? 'Dars o\'tildi! +20 XP' : `O'tish uchun ${PASS_LESSON}% kerak. Qoidani yana bir ko'rib chiqing.`}</div>
        </div>
        {res.wrong.length > 0 && (
          <div className="card stack">
            <h3>Xatolar ustida ishlash</h3>
            {res.wrong.map((w, i) => (
              <div key={i} className="mistake">
                <div>{w.q.q}</div>
                <div><s>{w.given}</s> → <ins>{w.q.kind === 'choice' ? w.q.answer : w.q.answers[0]}</ins></div>
              </div>
            ))}
            <a className="btn soft sm" href={`#/tutor?q=${encodeURIComponent(`Объясни, пожалуйста, тему «${t.title}». Я ошибся в: ${res.wrong.map((w) => w.q.q).join(' | ')}`)}`}>
              <Icon name="sparkle" size={18} /> AI ustozdan tushuntirish so'rash
            </a>
          </div>
        )}
        <div className="grid-2">
          <button className="btn ghost" onClick={() => { setRun(run + 1); setMode('practice'); }}><Icon name="refresh" />Qayta</button>
          {passed && nextT ? <button className="btn" onClick={() => { setMode('learn'); go(`grammar/${nextT.id}`); }}>Keyingi dars</button>
            : <button className="btn" onClick={() => go(`grammar/stage/${t.stage}`)}>Darslar ro'yxati</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 14 }}>
      <PageHead title={t.title} sub={`${st.code} · ${t.ru}`} />
      <div className="card theory">
        {t.theory.map((para, i) => <Rich key={i} text={para} />)}
        {t.formula && (
          <div className="formula">{t.formula.map((f) => <code key={f}>{f}</code>)}</div>
        )}
      </div>
      <div className="card">
        <h3>Примеры</h3>
        {t.examples.map(([en, ru]) => (
          <div key={en} className="example">
            {canSpeak() && <button className="icon-btn" onClick={() => speak(en)} aria-label="Tinglash"><Icon name="sound" size={18} /></button>}
            <div><div className="en">{en}</div><div className="ru">{ru}</div></div>
          </div>
        ))}
      </div>
      {t.tip && <div className="tip"><b>Совет: </b>{t.tip}</div>}
      <button className="btn block" onClick={() => setMode('practice')}>
        Mashq qilish · {t.exercises.length} savol{prevBest ? ` · eng yaxshi ${prevBest}%` : ''}
      </button>
      <a className="btn ghost block" href={`#/tutor?q=${encodeURIComponent(`Объясни подробнее тему «${t.title}» с примерами.`)}`}>
        <Icon name="sparkle" size={18} /> AI ustozdan so'rash
      </a>
    </div>
  );
}

export function Tenses() {
  const groups = ['Present', 'Past', 'Future'];
  return (
    <div>
      <PageHead title="Таблица времён" sub="12 zamon" />
      {groups.map((g) => (
        <div key={g} className="card" style={{ marginBottom: 12 }}>
          <h3>{g}</h3>
          <table className="tenses"><tbody>
            {TENSES.filter((t) => t.group === g).map((t) => (
              <tr key={t.name}>
                <td>{t.name}<div className="muted small" style={{ fontWeight: 400 }}>{t.ru}</div></td>
                <td><code>{t.f}</code><div className="small">{t.ex}</div></td>
              </tr>
            ))}
          </tbody></table>
        </div>
      ))}
      <div className="tip">Simple — факт/результат · Continuous — процесс · Perfect — завершённость к моменту · Perfect Continuous — длительность до момента.</div>
    </div>
  );
}
