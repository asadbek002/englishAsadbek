import { getProgress } from './store';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const sample = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n);

/** Javoblarni solishtirish uchun: kichik harf, apostroflar va ortiqcha bo'shliqlar bir xil. */
export function normalize(s: string): string {
  return s.toLowerCase()
    .replace(/[’`ʼ‘]/g, "'")
    .replace(/[.,!?;:"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "aka, uka" → ["aka", "uka"] */
export const variants = (s: string) => s.split(',').map((x) => normalize(x.replace(/\(.*?\)/g, ''))).filter(Boolean);

// ───────────── Speech ─────────────

let voices: SpeechSynthesisVoice[] = [];
if (typeof speechSynthesis !== 'undefined') {
  const loadVoices = () => { voices = speechSynthesis.getVoices(); };
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

export const canSpeak = () => typeof speechSynthesis !== 'undefined';

export function speak(text: string, rate?: number) {
  if (!canSpeak()) return;
  const { accent, rate: r } = getProgress().settings;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = accent;
  u.rate = rate ?? r;
  const v = voices.find((x) => x.lang === accent) ?? voices.find((x) => x.lang.startsWith('en'));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// ───────────── Word diff (diktant uchun) ─────────────

export interface DiffToken { word: string; status: 'ok' | 'missing' | 'extra' }

/** LCS asosida so'zma-so'z solishtirish. */
export function diffWords(expected: string, actual: string): DiffToken[] {
  const a = normalize(expected).split(' ').filter(Boolean);
  const b = normalize(actual).split(' ').filter(Boolean);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffToken[] = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { out.push({ word: a[i], status: 'ok' }); i++; j++; }
    else if (j < b.length && (i === a.length || dp[i][j + 1] >= dp[i + 1][j])) { out.push({ word: b[j], status: 'extra' }); j++; }
    else { out.push({ word: a[i], status: 'missing' }); i++; }
  }
  return out;
}

export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
