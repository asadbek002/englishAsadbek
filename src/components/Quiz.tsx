import { useEffect, useMemo, useRef, useState } from 'react';
import type { Question } from '../data/types';
import { normalize, shuffle } from '../lib/util';
import { Bar, Icon } from './ui';

export interface QuizResult { correct: number; total: number; answers: boolean[]; wrong: { q: Question; given: string }[] }

interface Props {
  questions: Question[];
  onFinish: (r: QuizResult) => void;
  onAnswer?: (q: Question, correct: boolean) => void;
  onClose?: () => void;
  /** Har bir savolga yorliq (masalan "B1"). */
  label?: (index: number) => string | undefined;
  /** Har javobdan keyin testni to'xtatish kerakmi (daraja testi uchun). */
  shouldStop?: (index: number, results: boolean[]) => boolean;
}

export function isCorrect(q: Question, given: string) {
  if (q.kind === 'choice') return given === q.answer;
  const g = normalize(given);
  return q.answers.some((a) => normalize(a) === g);
}

export default function Quiz({ questions, onFinish, onAnswer, onClose, label, shouldStop }: Props) {
  const [i, setI] = useState(0);
  const [given, setGiven] = useState<string | null>(null);
  const [text, setText] = useState('');
  const results = useRef<boolean[]>([]);
  const wrong = useRef<QuizResult['wrong']>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = questions[i];
  const options = useMemo(() => (q?.kind === 'choice' ? shuffle(q.options) : []), [q]);
  const answered = given !== null;
  const ok = answered && isCorrect(q, given);

  useEffect(() => { if (q?.kind === 'input') inputRef.current?.focus(); }, [q]);

  function submit(value: string) {
    if (answered || !value.trim()) return;
    const correct = isCorrect(q, value);
    setGiven(value);
    results.current.push(correct);
    if (!correct) wrong.current.push({ q, given: value });
    onAnswer?.(q, correct);
  }

  function next() {
    const n = results.current.length;
    const done = i + 1 >= questions.length || shouldStop?.(i, results.current);
    if (done) {
      onFinish({ correct: results.current.filter(Boolean).length, total: n, answers: [...results.current], wrong: wrong.current });
      return;
    }
    setI(i + 1);
    setGiven(null);
    setText('');
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && !answered) return;
      if (answered && e.key === 'Enter') {
        if (e.target instanceof HTMLButtonElement) return; // tugmaning o'zi bosiladi
        e.preventDefault(); next(); return;
      }
      if (!answered && q?.kind === 'choice') {
        const idx = Number(e.key) - 1;
        if (idx >= 0 && idx < options.length) submit(options[idx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!q) return null;
  const correctText = q.kind === 'choice' ? q.answer : q.answers[0];
  const parts = q.q.split('___');

  return (
    <div>
      <div className="quiz-top">
        {onClose && <button className="icon-btn" onClick={onClose} aria-label="Yopish"><Icon name="x" /></button>}
        <Bar value={(i / questions.length) * 100} />
        <span className="small muted">{i + 1}/{questions.length}</span>
      </div>
      {label?.(i) && <span className="level-code">{label(i)}</span>}
      <p className="q-text">
        {parts.map((p, k) => (
          <span key={k}>{p}{k < parts.length - 1 && <span style={{ color: 'var(--lapis)', fontWeight: 700 }}>{answered ? (ok ? given : '____') : '____'}</span>}</span>
        ))}
      </p>

      {q.kind === 'choice' ? (
        <div className="options">
          {options.map((o, k) => {
            const cls = answered ? (o === q.answer ? 'correct' : o === given ? 'wrong' : '') : '';
            return (
              <button key={o} className={`opt ${cls}`} disabled={answered} onClick={() => submit(o)}>
                <kbd>{k + 1}</kbd>{o}
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); submit(text); }} className="stack">
          <input
            ref={inputRef}
            className={`input ${answered ? (ok ? 'correct' : 'wrong') : ''}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            readOnly={answered}
            placeholder="Javobni yozing…"
            autoCapitalize="off" autoCorrect="off" spellCheck={false} autoComplete="off"
          />
          {!answered && <button className="btn block" disabled={!text.trim()}>Tekshirish</button>}
        </form>
      )}

      {answered && (
        <div className={`feedback ${ok ? 'ok' : 'bad'}`} role="status">
          <b>{ok ? "To'g'ri!" : "Noto'g'ri"}</b>
          {!ok && <div>To'g'ri javob: <strong>{correctText}</strong></div>}
          {q.note && <div className="small">{q.note}</div>}
          <button className="btn block" onClick={next} autoFocus>Davom etish</button>
        </div>
      )}
    </div>
  );
}
