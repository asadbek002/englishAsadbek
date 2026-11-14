import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, go, Icon, PageHead } from '../components/ui';
import { STAGES } from '../data/levels';
import { WORDS, type Word } from '../data/words';
import { applyAnswer, dueWords, LEARNED_BOX, learnedCount, newWords, newWordsLeftToday, unlockedStages } from '../lib/srs';
import { addXp, dayKey, getProgress, update, useProgress, type Dir } from '../lib/store';
import { canSpeak, normalize, sample, shuffle, speak, variants } from '../lib/util';

type Mode = 'cards' | 'quiz' | 'type';
/** x — o'zbekcha va ruscha birga */
type Lang = 'en' | 'x';

const DIRS: { id: Dir; label: string }[] = [
  { id: 'mix', label: 'Aralash' },
  { id: 'en-x', label: 'EN → UZ·RU' },
  { id: 'x-en', label: 'UZ·RU → EN' },
];
const FLAG: Record<Lang, string> = { en: 'English', x: "O'zbekcha · Русский" };

export function WordsHub() {
  const p = useProgress();
  const due = dueWords(p).length;
  const fresh = Math.min(newWordsLeftToday(p), newWords(p, 50).length);
  const max = unlockedStages(p);
  const total = WORDS.filter((w) => w.stage <= max).length;
  const learned = learnedCount(p);
  const setDir = (d: Dir) => update((x) => { x.settings.dir = d; });

  return (
    <div className="stack" style={{ gap: 14 }}>
      <PageHead title="So'zlar" sub="Spaced repetition" onBack={null} right={<a className="icon-btn" href="#/words/list" aria-label="Lug'at"><Icon name="search" /></a>} />

      <div className="card">
        <div className="row"><b className="band-big" style={{ fontSize: 40 }}>{learned}</b><span className="muted small">/ {total} so'z yodlangan<br />(8+ kun esda qolgan)</span></div>
        <div style={{ marginTop: 12 }}><Bar tone="teal" value={(learned / Math.max(1, total)) * 100} /></div>
        <div className="row small muted" style={{ marginTop: 12 }}>
          <span className="chip saffron">{due} ta takrorlash</span>
          <span className="chip">{fresh} ta yangi (bugun)</span>
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Tarjima yo'nalishi</div>
        <div className="row wrap" style={{ gap: 6 }}>
          {DIRS.map((d) => <button key={d.id} className="chip" aria-pressed={p.settings.dir === d.id} onClick={() => setDir(d.id)}>{d.label}</button>)}
        </div>
      </div>

      <a className="card tile" href="#/words/play/quiz">
        <div className="ico"><Icon name="target" /></div>
        <div style={{ flex: 1 }}><h3>Test</h3><p>4 variantdan to'g'risini tanlang</p></div><Icon name="next" />
      </a>
      <a className="card tile" href="#/words/play/cards">
        <div className="ico teal"><Icon name="cards" /></div>
        <div style={{ flex: 1 }}><h3>Kartochkalar</h3><p>O'zingizni tekshiring: bildim / bilmadim</p></div><Icon name="next" />
      </a>
      <a className="card tile" href="#/words/play/type">
        <div className="ico saffron"><Icon name="pen" /></div>
        <div style={{ flex: 1 }}><h3>Yozish</h3><p>O'zbekcha/ruscha ko'rib, inglizchasini yozing — eng samarali</p></div><Icon name="next" />
      </a>

      <div className="card tint small">
        <b>Qanday ishlaydi:</b> to'g'ri topgan so'zingiz 1 → 2 → 4 → 8 → 16 → 32 kundan keyin qayta so'raladi. Xato qilsangiz, so'z boshidan boshlanadi va ertaga yana chiqadi.
      </div>
    </div>
  );
}

interface Item { word: Word; from: Lang; to: Lang; intro: boolean }

function pickDir(dir: Dir, mode: Mode): [Lang, Lang] {
  let d = dir === 'mix' ? (Math.random() < 0.5 ? 'en-x' : 'x-en') : dir;
  if (mode === 'type') d = 'x-en'; // yozish rejimida doim inglizchasini yozasiz
  return d.split('-') as [Lang, Lang];
}

function buildSession(mode: Mode): Item[] {
  const p = getProgress();
  const due = dueWords(p).slice(0, 20);
  const fresh = newWords(p, Math.min(newWordsLeftToday(p), 10));
  let words = [...due, ...fresh];
  // Hammasi bajarilgan bo'lsa — eski so'zlardan erkin mashq
  if (words.length === 0) {
    const max = unlockedStages(p);
    words = sample(WORDS.filter((w) => w.stage <= max && p.words[w.id]?.seen), 10);
  }
  return shuffle(words).map((w) => {
    const [from, to] = pickDir(p.settings.dir, mode);
    return { word: w, from, to, intro: !p.words[w.id]?.seen };
  });
}

export function WordSession({ mode }: { mode: Mode }) {
  const [queue, setQueue] = useState<Item[]>(() => buildSession(mode));
  const [i, setI] = useState(0);
  const [stats, setStats] = useState({ ok: 0, bad: 0 });
  const total = queue.length;
  const item = queue[i];

  function answer(correct: boolean) {
    const w = item.word;
    update((p) => {
      p.words[w.id] = applyAnswer(p.words[w.id], correct);
    });
    if (correct) addXp(2);
    setStats((s) => ({ ok: s.ok + (correct ? 1 : 0), bad: s.bad + (correct ? 0 : 1) }));
    // Xato so'z sessiya oxirida yana bir marta so'raladi
    if (!correct && queue.filter((q) => q.word.id === w.id).length < 2) {
      setQueue((q) => [...q, { ...item, intro: false }]);
    }
  }

  function introduced() {
    update((p) => {
      const today = dayKey();
      p.newToday = { day: today, count: (p.newToday.day === today ? p.newToday.count : 0) + 1 };
    });
    setQueue((q) => q.map((x, k) => (k === i ? { ...x, intro: false } : x)));
  }

  if (total === 0) {
    return (
      <div>
        <PageHead title="So'zlar" />
        <div className="card center stack">
          <h3>Hozircha so'z yo'q</h3>
          <p className="muted">Yangi so'zlar uchun kunlik limit tugagan yoki hamma so'z o'rganilgan. Profilda kunlik limitni oshirishingiz mumkin.</p>
          <button className="btn" onClick={() => go('words')}>Orqaga</button>
        </div>
      </div>
    );
  }

  if (i >= total) {
    return (
      <div className="stack" style={{ gap: 14 }}>
        <PageHead title="Sessiya tugadi" onBack={() => go('words')} />
        <div className="card center stack">
          <div className="result-num" style={{ color: 'var(--teal)' }}>{stats.ok}</div>
          <div className="muted">to'g'ri javob · {stats.bad} ta xato · +{stats.ok * 2} XP</div>
        </div>
        <div className="grid-2">
          <button className="btn ghost" onClick={() => go('words')}>Tayyor</button>
          <button className="btn" onClick={() => { setQueue(buildSession(mode)); setI(0); setStats({ ok: 0, bad: 0 }); }}>Yana</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="quiz-top">
        <button className="icon-btn" onClick={() => go('words')} aria-label="Yopish"><Icon name="x" /></button>
        <Bar tone="teal" value={(i / total) * 100} />
        <span className="small muted">{i + 1}/{total}</span>
      </div>
      {item.intro && mode !== 'cards' ? (
        <Intro word={item.word} onDone={introduced} />
      ) : mode === 'cards' ? (
        <Flashcard key={i} item={item} onAnswer={(c) => { if (item.intro) introduced(); answer(c); setI(i + 1); }} />
      ) : mode === 'quiz' ? (
        <ChoiceQ key={i} item={item} onAnswer={answer} onNext={() => setI(i + 1)} />
      ) : (
        <TypeQ key={i} item={item} onAnswer={answer} onNext={() => setI(i + 1)} />
      )}
    </div>
  );
}

const SpeakBtn = ({ text }: { text: string }) =>
  canSpeak() ? <button className="icon-btn" onClick={(e) => { e.stopPropagation(); speak(text); }} aria-label="Talaffuz"><Icon name="sound" size={18} /></button> : null;

function Intro({ word, onDone }: { word: Word; onDone: () => void }) {
  useEffect(() => { speak(word.en); }, [word]);
  return (
    <div className="stack" style={{ gap: 16 }}>
      <span className="chip saffron" style={{ justifySelf: 'start' }}>Yangi so'z · {STAGES[word.stage].code}</span>
      <div className="card center stack" style={{ padding: 28 }}>
        <div className="row" style={{ justifyContent: 'center' }}><div className="q-word">{word.en}</div><SpeakBtn text={word.en} /></div>
        <div style={{ fontSize: 19 }}><b>{word.uz}</b></div>
        <div className="muted" style={{ fontSize: 17 }}>{word.ru}</div>
      </div>
      <button className="btn block" onClick={onDone} autoFocus>Eslab qoldim — tekshirish</button>
    </div>
  );
}

const text = (w: Word, l: Lang) => (l === 'en' ? w.en : `${w.uz} — ${w.ru}`);

/** Savol tomoni: inglizcha so'z yoki o'zbekcha (katta) + ruscha (ostida). */
function Face({ w, lang }: { w: Word; lang: Lang }) {
  if (lang === 'en') return <div className="q-word">{w.en}</div>;
  return (
    <div>
      <div className="q-word" style={{ fontSize: 28 }}>{w.uz}</div>
      <div className="muted" style={{ fontSize: 19, fontWeight: 600 }}>{w.ru}</div>
    </div>
  );
}

function Prompt({ item }: { item: Item }) {
  return (
    <div className="stack" style={{ gap: 4, marginBottom: 18 }}>
      <div className="eyebrow">{FLAG[item.from]} → {FLAG[item.to]}</div>
      <div className="row"><Face w={item.word} lang={item.from} />{item.from === 'en' && <SpeakBtn text={item.word.en} />}</div>
    </div>
  );
}

function Feedback({ ok, item, onNext }: { ok: boolean; item: Item; onNext: () => void }) {
  useEffect(() => { speak(item.word.en); }, [item]);
  return (
    <div className={`feedback ${ok ? 'ok' : 'bad'}`} role="status">
      <b>{ok ? "To'g'ri!" : "Noto'g'ri"}</b>
      <div><strong>{item.word.en}</strong> — {item.word.uz} · <span className="muted">{item.word.ru}</span></div>
      <button className="btn block" onClick={onNext} autoFocus>Davom etish</button>
    </div>
  );
}

function ChoiceQ({ item, onAnswer, onNext }: { item: Item; onAnswer: (c: boolean) => void; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = text(item.word, item.to);
  const options = useMemo(() => {
    const same = WORDS.filter((w) => w.stage === item.word.stage && w.id !== item.word.id);
    const pool = same.length >= 3 ? same : WORDS.filter((w) => w.id !== item.word.id);
    return shuffle([correct, ...sample(pool, 3).map((w) => text(w, item.to))]);
  }, [item, correct]);
  const pick = (o: string) => { if (picked) return; setPicked(o); onAnswer(o === correct); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { const k = Number(e.key) - 1; if (!picked && k >= 0 && k < 4) pick(options[k]); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div>
      <Prompt item={item} />
      <div className="options">
        {options.map((o, k) => (
          <button key={o + k} className={`opt ${picked ? (o === correct ? 'correct' : o === picked ? 'wrong' : '') : ''}`} disabled={!!picked} onClick={() => pick(o)}>
            <kbd>{k + 1}</kbd>{o}
          </button>
        ))}
      </div>
      {picked && <Feedback ok={picked === correct} item={item} onNext={onNext} />}
    </div>
  );
}

function TypeQ({ item, onAnswer, onNext }: { item: Item; onAnswer: (c: boolean) => void; onNext: () => void }) {
  const [val, setVal] = useState('');
  const [res, setRes] = useState<boolean | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const check = () => {
    if (res !== null || !val.trim()) return;
    const g = normalize(val).replace(/^to /, '');
    const ok = variants(item.word.en).some((a) => a.replace(/^to /, '') === g);
    setRes(ok); onAnswer(ok);
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); check(); }}>
      <Prompt item={item} />
      <input ref={ref} className={`input ${res === null ? '' : res ? 'correct' : 'wrong'}`} value={val} readOnly={res !== null}
        onChange={(e) => setVal(e.target.value)} placeholder="Inglizcha yozing…" autoCapitalize="off" autoCorrect="off" spellCheck={false} autoComplete="off" />
      {res === null && <button className="btn block" style={{ marginTop: 12 }} disabled={!val.trim()}>Tekshirish</button>}
      {res === null && <button type="button" className="btn ghost block" style={{ marginTop: 8 }} onClick={() => { setRes(false); onAnswer(false); }}>Bilmayman</button>}
      {res !== null && <Feedback ok={res} item={item} onNext={onNext} />}
    </form>
  );
}

function Flashcard({ item, onAnswer }: { item: Item; onAnswer: (c: boolean) => void }) {
  const [flipped, setFlipped] = useState(false);
  const flip = () => { if (!flipped) { setFlipped(true); speak(item.word.en); } };
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="eyebrow">{FLAG[item.from]} → {FLAG[item.to]}{item.intro && ' · yangi so\'z'}</div>
      <div className={`flash ${flipped ? 'flipped' : ''}`} onClick={flip} role="button" tabIndex={0} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && flip()} aria-label="Kartochkani ochish">
        <div className="flash-inner">
          <div className="flash-face"><div className="stack"><Face w={item.word} lang={item.from} /><div className="muted small">Bosing — javobni ko'rish</div></div></div>
          <div className="flash-face back">
            <div className="stack">
              <div className="q-word" style={{ fontSize: 28 }}>{item.word.en}</div>
              <div style={{ fontSize: 18 }}><b>{item.word.uz}</b></div>
              <div className="muted">{item.word.ru}</div>
            </div>
          </div>
        </div>
      </div>
      {flipped ? (
        <div className="grid-2">
          <button className="btn danger" onClick={() => onAnswer(false)}>Bilmadim</button>
          <button className="btn teal" onClick={() => onAnswer(true)}>Bildim</button>
        </div>
      ) : <button className="btn ghost block" onClick={flip}>Javobni ko'rish</button>}
    </div>
  );
}

export function WordList() {
  const p = useProgress();
  const [q, setQ] = useState('');
  const [stage, setStage] = useState<number | 'all'>('all');
  const list = WORDS.filter((w) => (stage === 'all' || w.stage === stage) &&
    (!q || [w.en, w.uz, w.ru].some((x) => normalize(x).includes(normalize(q)))));
  return (
    <div>
      <PageHead title="Lug'at" sub={`${WORDS.length} so'z`} />
      <input className="input" placeholder="Qidirish: inglizcha, o'zbekcha yoki ruscha" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="row wrap" style={{ gap: 6, margin: '12px 0' }}>
        <button className="chip" aria-pressed={stage === 'all'} onClick={() => setStage('all')}>Hammasi</button>
        {STAGES.map((s) => <button key={s.id} className="chip" aria-pressed={stage === s.id} onClick={() => setStage(s.id)}>{s.code === '0' ? 'Starter' : s.code}</button>)}
      </div>
      <div className="card" style={{ padding: '4px 16px' }}>
        {list.map((w) => {
          const box = p.words[w.id]?.box ?? 0;
          return (
            <div key={w.id} className="example" style={{ alignItems: 'center' }}>
              <SpeakBtn text={w.en} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="en">{w.en}</div>
                <div className="ru">{w.uz} · {w.ru}</div>
              </div>
              {box >= LEARNED_BOX ? <span className="chip teal"><Icon name="check" size={14} /></span>
                : box > 0 ? <span className="chip">{box}/{LEARNED_BOX}</span> : null}
            </div>
          );
        })}
        {list.length === 0 && <p className="muted">Hech narsa topilmadi.</p>}
      </div>
    </div>
  );
}
