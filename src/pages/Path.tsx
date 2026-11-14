import { Bar, Girih, PageHead } from '../components/ui';
import { STAGES } from '../data/levels';
import { PASS_EXAM, stageInfo } from '../lib/progress';
import { useProgress } from '../lib/store';

export default function Path() {
  const p = useProgress();
  return (
    <div>
      <PageHead title="O'quv yo'li" sub="0 → IELTS 8.0" onBack={null} />
      <p className="muted small" style={{ marginTop: -6 }}>
        Har bosqichda: barcha grammatika darslarini ≥80% bilan o'ting, so'nggida bosqich imtihonini ≥{PASS_EXAM}% bilan topshiring — keyingi bosqich ochiladi.
      </p>
      <div className="path" style={{ marginTop: 18 }}>
        {STAGES.map((st) => {
          const info = stageInfo(p, st.id);
          const state = !info.unlocked ? 'locked' : info.passed ? 'done' : st.id === p.stage ? 'current' : 'open';
          return (
            <div key={st.id} className={`stage-row ${info.passed ? 'done' : ''}`}>
              <div className="stage-rail">
                <Girih label={st.code === '0' ? '0' : st.code} state={state} />
                <div className="line" />
              </div>
              <div className="stage-body">
                <a className="card" href={info.unlocked ? `#/grammar/stage/${st.id}` : undefined}
                  style={{ opacity: info.unlocked ? 1 : .6 }} aria-disabled={!info.unlocked}>
                  <div className="row">
                    <h3 style={{ margin: 0 }}>{st.name}</h3>
                    <div className="spacer" />
                    <span className="chip">IELTS {st.band}</span>
                  </div>
                  <div className="small muted" style={{ margin: '4px 0 12px' }}>{st.goal}</div>
                  {info.unlocked ? (
                    <div className="stack" style={{ gap: 8 }}>
                      <div className="row small"><span style={{ width: 92 }}>Grammatika</span><div style={{ flex: 1 }}><Bar value={(info.done / info.topics.length) * 100} /></div><span className="muted">{info.done}/{info.topics.length}</span></div>
                      <div className="row small"><span style={{ width: 92 }}>So'zlar</span><div style={{ flex: 1 }}><Bar tone="teal" value={(info.learned / info.words) * 100} /></div><span className="muted">{info.learned}/{info.words}</span></div>
                      {info.exam > 0 && <div className="small muted">Imtihon: eng yaxshi natija {info.exam}%</div>}
                    </div>
                  ) : (
                    <div className="small muted">Oldingi bosqich imtihonini topshirgandan so'ng ochiladi.</div>
                  )}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
