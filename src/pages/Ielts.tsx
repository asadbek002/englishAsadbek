import { useEffect, useRef, useState } from 'react';
import { go, Icon, PageHead } from '../components/ui';
import { BAND_GUIDE, IELTS_PARTS, SPEAKING_QUESTIONS, WRITING_CRITERIA, WRITING_TASKS } from '../data/ielts';
import { ai, ApiError, useAuth, type Mistake, type SpeakingResult, type WritingResult, type Criterion } from '../lib/api';
import { addXp } from '../lib/store';

export function IeltsHub() {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <PageHead title="IELTS markazi" sub="Academic" />
      <div className="grid-2">
        <a className="card tile" href="#/ielts/writing" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="ico"><Icon name="pen" /></div><div><h3>Writing</h3><p>Esse yozing — AI baholaydi</p></div>
        </a>
        <a className="card tile" href="#/ielts/speaking" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="ico teal"><Icon name="mic" /></div><div><h3>Speaking</h3><p>Gapiring — AI baholaydi</p></div>
        </a>
      </div>
      <h2>Imtihon tuzilishi</h2>
      {IELTS_PARTS.map((x) => (
        <div key={x.name} className="card stack" style={{ gap: 6 }}>
          <div className="row"><h3 style={{ margin: 0 }}>{x.name}</h3><div className="spacer" /><span className="chip">{x.time}</span></div>
          <div className="small">{x.what}</div>
          <div className="tip small">{x.tip}</div>
        </div>
      ))}
      <h2>Qaysi ball uchun nima kerak</h2>
      <div className="card">
        {BAND_GUIDE.map((b) => (
          <div key={b.band} className="crit"><b>{b.band}</b><span /><p>{b.text}</p></div>
        ))}
      </div>
      <h2>Writing mezonlari</h2>
      <div className="card">
        {WRITING_CRITERIA.map(([n, d]) => <div key={n} className="crit"><span style={{ fontWeight: 700 }}>{n}</span><span /><p>{d}</p></div>)}
        <p className="small muted" style={{ margin: '10px 0 0' }}>Umumiy ball — 4 mezonning o'rtachasi (0.5 ga yaxlitlanadi).</p>
      </div>
    </div>
  );
}

function NeedLogin() {
  const { auth } = useAuth();
  if (auth) return null;
  return <div className="notice">AI baholashi uchun hisobga kiring. <a href="#/profile">Kirish / ro'yxatdan o'tish</a></div>;
}

function useTimer(running: boolean) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  return [sec, setSec] as const;
}
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Criteria({ list }: { list: Criterion[] }) {
  return <>{list.map((c) => <div key={c.name} className="crit"><span style={{ fontWeight: 700 }}>{c.name}</span><b>{c.band.toFixed(1)}</b><p>{c.comment_uz}</p></div>)}</>;
}
function Mistakes({ list }: { list: Mistake[] }) {
  if (!list.length) return null;
  return (
    <div className="card">
      <h3>Xatolar (объяснения на русском)</h3>
      {list.map((m, i) => (
        <div key={i} className="mistake">
          <div><s>{m.original}</s></div>
          <div>→ <ins>{m.correction}</ins></div>
          <div className="small muted">{m.explanation_ru}</div>
        </div>
      ))}
    </div>
  );
}

export function Writing() {
  const [taskIdx, setTaskIdx] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<WritingResult | null>(null);
  const [sec] = useTimer(taskIdx !== null && !res);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  if (taskIdx === null) {
    return (
      <div className="stack" style={{ gap: 10 }}>
        <PageHead title="Writing" sub="Mavzu tanlang" />
        <NeedLogin />
        {WRITING_TASKS.map((t, i) => (
          <button key={i} className="card" onClick={() => { setTaskIdx(i); setText(''); setRes(null); }}>
            <div className="row"><span className="chip">{t.task === 'task1' ? 'Task 1' : 'Task 2'}</span><b>{t.title}</b></div>
            <p className="small muted" style={{ margin: '8px 0 0' }}>{t.prompt.slice(0, 140)}…</p>
          </button>
        ))}
      </div>
    );
  }

  const task = WRITING_TASKS[taskIdx];
  const min = task.task === 'task1' ? 150 : 250;
  const limit = task.task === 'task1' ? 20 * 60 : 40 * 60;

  async function submit() {
    setBusy(true); setErr('');
    try {
      const r = await ai.writing(task.task, task.prompt, text);
      setRes(r);
      addXp(30);
    } catch (e) { setErr(e instanceof ApiError ? e.message : 'Xatolik'); }
    finally { setBusy(false); }
  }

  if (res) {
    return (
      <div className="stack" style={{ gap: 14 }}>
        <PageHead title="Natija" sub={`Writing ${task.task === 'task1' ? 'Task 1' : 'Task 2'}`} onBack={() => setRes(null)} />
        <div className="card center"><div className="eyebrow">Taxminiy band</div><div className="band-big">{res.overall.toFixed(1)}</div><div className="small muted">{res.word_count} so'z</div></div>
        <div className="card"><p style={{ marginTop: 0 }}>{res.summary_uz}</p><Criteria list={res.criteria} /></div>
        {res.strengths_uz.length > 0 && <div className="card"><h3>Yaxshi tomonlar</h3><ul>{res.strengths_uz.map((s) => <li key={s}>{s}</li>)}</ul></div>}
        <Mistakes list={res.mistakes} />
        {res.vocabulary_upgrades.length > 0 && (
          <div className="card"><h3>So'z boyligini oshirish</h3>
            {res.vocabulary_upgrades.map((v) => <div key={v.basic} className="mistake"><s>{v.basic}</s> → <ins>{v.better}</ins><div className="small muted">{v.example}</div></div>)}
          </div>
        )}
        <div className="card"><h3>Yaxshilangan variant</h3><p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{res.improved_version}</p></div>
        <div className="card tint"><h3>Keyingi qadamlar</h3><ul style={{ margin: 0 }}>{res.next_steps_uz.map((s) => <li key={s}>{s}</li>)}</ul></div>
        <div className="grid-2">
          <button className="btn ghost" onClick={() => setRes(null)}>Matnga qaytish</button>
          <button className="btn" onClick={() => setTaskIdx(null)}>Boshqa mavzu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PageHead title={task.title} sub={task.task === 'task1' ? 'Task 1 · 20 daqiqa' : 'Task 2 · 40 daqiqa'} onBack={() => setTaskIdx(null)}
        right={<span className={`chip ${sec > limit ? 'rose' : ''}`}>{mmss(sec)}</span>} />
      <div className="card small">{task.prompt}</div>
      <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Javobingizni ingliz tilida yozing…" spellCheck={false} />
      <div className="row small">
        <span className={`chip ${words >= min ? 'teal' : ''}`}>{words} / {min}+ so'z</span>
        <div className="spacer" />
      </div>
      <NeedLogin />
      {err && <div className="error">{err}</div>}
      <button className="btn block" onClick={submit} disabled={busy || words < 30}>
        {busy ? <><span className="spinner" /> AI tekshirmoqda…</> : <><Icon name="sparkle" size={18} /> AI bilan baholash</>}
      </button>
    </div>
  );
}

// ───────────── Speaking ─────────────

type SR = { start: () => void; stop: () => void; lang: string; continuous: boolean; interimResults: boolean; onresult: (e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void; onend: () => void; onerror: (e: { error: string }) => void };
const SRClass = (window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition
  ?? (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition;

export function Speaking() {
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [qIdx, setQIdx] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<SpeakingResult | null>(null);
  const [sec, setSec] = useTimer(recording);
  const rec = useRef<SR | null>(null);
  const media = useRef<MediaRecorder | null>(null);
  const finalText = useRef('');

  const list = SPEAKING_QUESTIONS.filter((q) => q.part === part);
  const q = qIdx !== null ? list[qIdx] : null;

  async function start() {
    setErr(''); setTranscript(''); setInterim(''); finalText.current = ''; setSec(0); setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType }))); stream.getTracks().forEach((t) => t.stop()); };
      mr.start();
      media.current = mr;
    } catch {
      setErr("Mikrofonga ruxsat berilmadi. Matnni qo'lda yozishingiz mumkin.");
    }
    if (SRClass) {
      const r = new SRClass();
      r.lang = 'en-GB'; r.continuous = true; r.interimResults = true;
      r.onresult = (e) => {
        let inter = '';
        for (let k = e.resultIndex; k < e.results.length; k++) {
          const res = e.results[k];
          if (res.isFinal) finalText.current += res[0].transcript + ' ';
          else inter += res[0].transcript;
        }
        setTranscript(finalText.current.trim()); setInterim(inter);
      };
      r.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') setErr(`Nutqni aniqlashda xato: ${e.error}`); };
      r.onend = () => { if (rec.current === r && media.current?.state === 'recording') r.start(); };
      rec.current = r;
      r.start();
    }
    setRecording(true);
  }

  function stop() {
    const r = rec.current; rec.current = null; r?.stop();
    media.current?.state === 'recording' && media.current.stop();
    setRecording(false);
    setTranscript((t) => (t + ' ' + interim).trim()); setInterim('');
  }

  async function submit() {
    if (!q) return;
    setBusy(true); setErr('');
    try {
      const r = await ai.speaking(part, q.q, transcript, Math.max(sec, 1));
      setRes(r); addXp(30);
    } catch (e) { setErr(e instanceof ApiError ? e.message : 'Xatolik'); }
    finally { setBusy(false); }
  }

  if (res && q) {
    return (
      <div className="stack" style={{ gap: 14 }}>
        <PageHead title="Natija" sub={`Speaking Part ${part}`} onBack={() => setRes(null)} />
        <div className="card center"><div className="eyebrow">Taxminiy band</div><div className="band-big">{res.overall.toFixed(1)}</div></div>
        <div className="card"><p style={{ marginTop: 0 }}>{res.summary_uz}</p><Criteria list={res.criteria} /></div>
        <Mistakes list={res.mistakes} />
        {res.useful_phrases.length > 0 && <div className="card"><h3>Foydali iboralar</h3><ul style={{ margin: 0 }}>{res.useful_phrases.map((s) => <li key={s}>{s}</li>)}</ul></div>}
        <div className="card"><h3>Band 8 namunaviy javob</h3><p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{res.model_answer}</p></div>
        <div className="card tint"><h3>Keyingi qadamlar</h3><ul style={{ margin: 0 }}>{res.next_steps_uz.map((s) => <li key={s}>{s}</li>)}</ul></div>
        <button className="btn block" onClick={() => { setRes(null); setQIdx(null); }}>Boshqa savol</button>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="stack" style={{ gap: 12 }}>
        <PageHead title="Speaking" sub="Savol tanlang" />
        <div className="segmented">
          {([1, 2, 3] as const).map((n) => <button key={n} aria-pressed={part === n} onClick={() => setPart(n)}>Part {n}</button>)}
        </div>
        <NeedLogin />
        {list.map((x, i) => (
          <button key={i} className="card" onClick={() => { setQIdx(i); setTranscript(''); setAudioUrl(null); setSec(0); }}>{x.q}</button>
        ))}
        {!SRClass && <div className="notice">Brauzeringiz nutqni matnga aylantirmaydi (Chrome tavsiya etiladi). Javobni yozib yuborishingiz mumkin.</div>}
      </div>
    );
  }

  const target = part === 2 ? '1–2 daqiqa' : part === 1 ? '20–40 soniya' : '40–60 soniya';
  return (
    <div className="stack" style={{ gap: 12 }}>
      <PageHead title={`Part ${part}`} sub={`Tavsiya: ${target}`} onBack={() => { stop(); setQIdx(null); }} right={<span className="chip">{mmss(sec)}</span>} />
      <div className="card" style={{ fontSize: 17 }}>{q.q}</div>
      {part === 2 && <div className="tip small">Part 2: avval 1 daqiqa o'ylab, qisqa reja tuzing. Keyin 2 daqiqa to'xtamasdan gapiring.</div>}
      <div className="center">
        {!recording ? (
          <button className="btn teal" style={{ minWidth: 200 }} onClick={start}><Icon name="mic" />{transcript ? 'Qayta yozish' : 'Gapirishni boshlash'}</button>
        ) : (
          <button className="btn danger" style={{ minWidth: 200 }} onClick={stop}><span className="rec-dot" />To'xtatish</button>
        )}
      </div>
      {audioUrl && <audio src={audioUrl} controls style={{ width: '100%' }} />}
      <label className="field">
        Matn (avtomatik; kerak bo'lsa tuzating)
        <textarea className="input" style={{ minHeight: 140 }} value={transcript + (interim ? ' ' + interim : '')}
          onChange={(e) => setTranscript(e.target.value)} readOnly={recording} placeholder="Gapirganingiz shu yerda paydo bo'ladi…" />
      </label>
      {err && <div className="error">{err}</div>}
      <button className="btn block" onClick={submit} disabled={busy || recording || transcript.trim().split(/\s+/).length < 5}>
        {busy ? <><span className="spinner" /> AI tekshirmoqda…</> : <><Icon name="sparkle" size={18} /> AI bilan baholash</>}
      </button>
      <button className="btn ghost block" onClick={() => go('ielts')}>IELTS markazi</button>
    </div>
  );
}
