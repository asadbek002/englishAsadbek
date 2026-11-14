import { useEffect, useRef, useState } from 'react';
import { Icon, PageHead, Rich } from '../components/ui';
import { STAGES } from '../data/levels';
import { ai, ApiError, useAuth } from '../lib/api';
import { useProgress } from '../lib/store';

type Msg = { role: 'user' | 'assistant'; content: string };
const KEY = 'lapis.tutor';

const SUGGESTIONS = [
  'Present Perfect va Past Simple farqi nima?',
  "«make» va «do» qachon ishlatiladi?",
  'Check my sentence: Yesterday I have went to the shop.',
  "IELTS Writing Task 2 uchun kirish qismini qanday yozaman?",
];

export default function Tutor() {
  const p = useProgress();
  const { auth } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>(() => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? '[]'); } catch { return []; } });
  const [input, setInput] = useState(() => new URLSearchParams(location.hash.split('?')[1] ?? '').get('q') ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs)); } catch { /* */ } end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  async function send(text = input) {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: t }];
    setMsgs(next); setInput(''); setBusy(true); setErr('');
    try {
      const r = await ai.tutor(STAGES[p.stage].code, next);
      setMsgs([...next, { role: 'assistant', content: r.reply }]);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Xatolik');
      setMsgs(msgs); setInput(t);
    } finally { setBusy(false); }
  }

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PageHead title="AI ustoz" sub="Claude" right={msgs.length > 0 && <button className="btn ghost sm" onClick={() => setMsgs([])}>Tozalash</button>} />
      {!auth && <div className="notice">AI ustoz bilan gaplashish uchun hisobga kiring. <a href="#/profile">Kirish</a></div>}
      {msgs.length === 0 && (
        <div className="stack" style={{ gap: 8 }}>
          <p className="muted small" style={{ margin: 0 }}>Grammatika, so'zlar, IELTS — istalgan savol bering. Grammatik qoidalar rus tilida tushuntiriladi.</p>
          {SUGGESTIONS.map((s) => <button key={s} className="card flat small" style={{ padding: 12 }} onClick={() => send(s)}>{s}</button>)}
        </div>
      )}
      <div className="chat">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role === 'user' ? 'me' : 'ai'}`}>
            {m.role === 'assistant' ? <Rich text={m.content} /> : m.content}
          </div>
        ))}
        {busy && <div className="bubble ai"><span className="spinner" /></div>}
        <div ref={end} />
      </div>
      {err && <div className="error">{err}</div>}
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Savolingizni yozing…" rows={1}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="btn sm" disabled={!input.trim() || busy} aria-label="Yuborish"><Icon name="next" /></button>
      </form>
    </div>
  );
}
