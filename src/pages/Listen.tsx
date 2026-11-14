import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, PageHead } from '../components/ui';
import { TOPICS } from '../data/grammar';
import { unlockedStages } from '../lib/srs';
import { addXp, update, useProgress } from '../lib/store';
import { canSpeak, diffWords, normalize, sample, speak } from '../lib/util';

/** Diktant: grammatika misollaridan (ochilgan bosqichlar) gap eshittiriladi. */
export default function Listen() {
  const p = useProgress();
  const pool = useMemo(() => {
    const max = unlockedStages(p);
    // Joriy bosqich va undan bitta pastki — darajaga mos gaplar
    return TOPICS.filter((t) => t.stage <= max && t.stage >= Math.max(0, max - 1)).flatMap((t) => t.examples)
      .filter(([en]) => !en.includes('→') && en.split(' ').length >= 3);
  }, [p.stage, p.freeMode]); // eslint-disable-line react-hooks/exhaustive-deps
  const [round, setRound] = useState(0);
  const [en, ru] = useMemo(() => sample(pool, 1)[0] ?? ['', ''], [pool, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [val, setVal] = useState('');
  const [checked, setChecked] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (en) setTimeout(() => speak(en), 300); setVal(''); setChecked(false); ref.current?.focus(); }, [en]);

  if (!canSpeak()) {
    return <div><PageHead title="Tinglash" /><div className="notice">Brauzeringiz ovozli o'qishni qo'llab-quvvatlamaydi. Chrome yoki Safari'ning yangi versiyasidan foydalaning.</div></div>;
  }

  const diff = checked ? diffWords(en, val) : [];
  const perfect = checked && normalize(en) === normalize(val);
  const okWords = diff.filter((d) => d.status === 'ok').length;
  const total = normalize(en).split(' ').length;

  function check() {
    if (!val.trim()) return;
    setChecked(true);
    const good = normalize(en) === normalize(val);
    update((d) => { d.listening = { done: d.listening.done + 1, correct: d.listening.correct + (good ? 1 : 0) }; });
    addXp(good ? 5 : 1);
  }

  return (
    <div className="stack" style={{ gap: 14 }}>
      <PageHead title="Tinglash" sub="Diktant" right={<span className="chip">{p.listening.correct}/{p.listening.done}</span>} />
      <div className="card center stack" style={{ padding: 24 }}>
        <div className="row" style={{ justifyContent: 'center', gap: 14 }}>
          <button className="btn" style={{ width: 72, height: 72, borderRadius: '50%', padding: 0 }} onClick={() => speak(en)} aria-label="Eshitish"><Icon name="sound" size={30} /></button>
          <button className="btn soft" style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }} onClick={() => speak(en, 0.6)} aria-label="Sekin eshitish">0.6×</button>
        </div>
        <div className="small muted">Gapni eshiting va aynan yozing. Kerak bo'lsa, qayta tinglang.</div>
      </div>
      <textarea ref={ref} className="input" style={{ minHeight: 100 }} value={val} onChange={(e) => setVal(e.target.value)} readOnly={checked}
        placeholder="Eshitganingizni yozing…" autoCapitalize="sentences" spellCheck={false}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); checked ? setRound(round + 1) : check(); } }} />
      {!checked ? (
        <button className="btn block" onClick={check} disabled={!val.trim()}>Tekshirish</button>
      ) : (
        <div className={`feedback ${perfect ? 'ok' : 'bad'}`}>
          <b>{perfect ? 'Mukammal!' : `${okWords}/${total} so'z to'g'ri`}</b>
          <div className="diff">{diff.map((d, k) => <span key={k} className={d.status}>{d.word}</span>)}</div>
          <div><strong>{en}</strong><div className="small muted">{ru}</div></div>
          <button className="btn block" onClick={() => setRound(round + 1)} autoFocus>Keyingi gap</button>
        </div>
      )}
    </div>
  );
}
