import { Fragment, useEffect, useState, type ReactNode } from 'react';

// ───────────── Hash router ─────────────

const readHash = () => window.location.hash.replace(/^#\/?/, '').split('?')[0];

export function useRoute(): string[] {
  const [h, setH] = useState(readHash);
  useEffect(() => {
    const on = () => { setH(readHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return h.split('/').filter(Boolean);
}

export const go = (path: string) => { window.location.hash = '/' + path.replace(/^\//, ''); };
export const back = () => (history.length > 1 ? history.back() : go(''));

export function PageHead({ title, sub, onBack = back, right }: { title: string; sub?: string; onBack?: (() => void) | null; right?: ReactNode }) {
  return (
    <header className="page-head">
      {onBack && (
        <button className="back" onClick={onBack} aria-label="Orqaga"><Icon name="back" /></button>
      )}
      <div style={{ minWidth: 0 }}>
        {sub && <div className="eyebrow">{sub}</div>}
        <h1>{title}</h1>
      </div>
      {right && <><div className="spacer" />{right}</>}
    </header>
  );
}

// ───────────── Icons (stroke, 24px) ─────────────

const PATHS: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  path: 'M6 3v18M6 5h11l-2 3.5L17 12H6',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7',
  cards: 'M7 4h11a2 2 0 0 1 2 2v11M4 8h11a2 2 0 0 1 2 2v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  sound: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12',
  ear: 'M7 10a5 5 0 1 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0M10 10a2 2 0 1 1 4 0',
  pen: 'M4 20h4L20 8l-4-4L4 16zM14 6l4 4',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  chat: 'M4 5h16v11H9l-5 4z',
  flame: 'M12 3s5 4.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3 1-6 1-8.5z',
  star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
  check: 'M5 12.5l4.5 4.5L19 7',
  x: 'M6 6l12 12M18 6 6 18',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 20h8',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2 2.2.8-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  table: 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14',
  play: 'M7 4v16l13-8z',
  stop: 'M6 6h12v12H6z',
  refresh: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
  cloud: 'M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
};

export function Icon({ name, size = 22 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? ''} />
    </svg>
  );
}

/** 8 qirrali girih yulduzi — bosqich belgisi. */
export function Girih({ label, state }: { label: string; state: 'locked' | 'open' | 'done' | 'current' }) {
  return (
    <div className={`girih ${state === 'current' ? 'open current' : state}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <g fill="currentColor">
          <rect x="12" y="12" width="40" height="40" rx="6" />
          <rect x="12" y="12" width="40" height="40" rx="6" transform="rotate(45 32 32)" />
        </g>
      </svg>
      <b>{state === 'locked' ? <Icon name="lock" size={18} /> : label}</b>
    </div>
  );
}

/** Juda oddiy markdown: **qalin**, satr boshidagi "- " ro'yxat, paragraflar. */
export function Rich({ text }: { text: string }) {
  const bold = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>);
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*[-•*]\s/.test(l))) {
          return <ul key={i} style={{ margin: '0 0 10px', paddingLeft: 20 }}>{lines.map((l, j) => <li key={j}>{bold(l.replace(/^\s*[-•*]\s/, ''))}</li>)}</ul>;
        }
        return <p key={i} style={{ margin: '0 0 10px' }}>{lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{bold(l)}</Fragment>)}</p>;
      })}
    </>
  );
}

export function Bar({ value, tone }: { value: number; tone?: 'teal' | 'saffron' }) {
  return <div className={`bar ${tone ?? ''}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
