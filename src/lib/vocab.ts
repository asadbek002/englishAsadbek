import { useSyncExternalStore } from 'react';
import type { StageId } from '../data/levels';
import { setExtraWords, type Word } from '../data/words';
import { API } from './api';

type Tuple = [en: string, uz: string, ru: string, level: string];
interface Payload { version: number; words: Tuple[] }

const KEY = 'lapis.vocab.v1';
const STAGE: Record<string, StageId> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

let version = 0;
const listeners = new Set<() => void>();

function apply(p: Payload) {
  const words: Word[] = p.words
    .filter(([en, uz, ru, lvl]) => en && uz && ru && STAGE[lvl] !== undefined)
    .map(([en, uz, ru, lvl]) => ({ id: en, en, uz, ru, stage: STAGE[lvl] }));
  setExtraWords(words);
  version = p.version;
  listeners.forEach((l) => l());
}

// 1) Qurilmadagi nusxa — darhol (offline ham ishlaydi)
try {
  const raw = localStorage.getItem(KEY);
  if (raw) apply(JSON.parse(raw));
} catch { /* yo'q yoki buzilgan */ }

// 2) Serverdan yangilanishni tekshirish
export async function refreshVocab() {
  try {
    const res = await fetch(`${API}/api/vocab`, { headers: version ? { 'if-none-match': `"v${version}"` } : {} });
    if (res.status !== 200) return;
    const p = (await res.json()) as Payload;
    if (!p.words?.length || p.version === version) return;
    apply(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* xotira to'la */ }
  } catch { /* offline */ }
}

/** Lug'at yangilanganda komponentlarni qayta chizish uchun. */
export const useVocabVersion = () =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => version);
