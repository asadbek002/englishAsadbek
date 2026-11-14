import { useSyncExternalStore } from 'react';

export type Dir = 'en-uz' | 'en-ru' | 'uz-en' | 'ru-en' | 'mix';

export interface WordState { box: number; due: number; seen: number; ok: number; bad: number }

export interface Progress {
  v: 1;
  placement: null | { passed: number; stage: number; scores: number[]; skipped?: boolean; at: number };
  stage: number; // eng yuqori ochilgan bosqich
  freeMode: boolean;
  grammar: Record<string, { best: number; done: boolean; at: number }>;
  words: Record<string, WordState>;
  exams: Record<string, number>; // stage → eng yaxshi %
  xp: Record<string, number>; // 'YYYY-MM-DD' → XP
  streak: { count: number; last: string };
  newToday: { day: string; count: number };
  listening: { done: number; correct: number };
  settings: {
    theme: 'system' | 'light' | 'dark';
    dailyGoal: number;
    newPerDay: number;
    rate: number;
    accent: 'en-GB' | 'en-US';
    dir: Dir;
  };
  updatedAt: number;
}

const KEY = 'lapis.progress.v1';

export const initialProgress = (): Progress => ({
  v: 1,
  placement: null,
  stage: 0,
  freeMode: false,
  grammar: {},
  words: {},
  exams: {},
  xp: {},
  streak: { count: 0, last: '' },
  newToday: { day: '', count: 0 },
  listening: { done: 0, correct: 0 },
  settings: { theme: 'system', dailyGoal: 50, newPerDay: 10, rate: 0.95, accent: 'en-GB', dir: 'mix' },
  updatedAt: 0,
});

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const base = initialProgress();
      return { ...base, ...p, settings: { ...base.settings, ...p.settings } };
    }
  } catch { /* yangi foydalanuvchi */ }
  return initialProgress();
}

let state: Progress = load();
const listeners = new Set<() => void>();
const changeHooks = new Set<(p: Progress) => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* xotira to'la */ }
}

export const getProgress = () => state;

/** O'zgartirish: draft'ni mutatsiya qiling yoki yangi obyekt qaytaring. */
export function update(fn: (draft: Progress) => void | Progress) {
  const draft: Progress = structuredClone(state);
  const next = fn(draft) ?? draft;
  next.updatedAt = Date.now();
  state = next;
  persist();
  listeners.forEach((l) => l());
  changeHooks.forEach((h) => h(state));
}

/** Serverdan kelgan nusxani o'rnatish (sync hook chaqirilmaydi). */
export function replaceProgress(p: Progress) {
  const base = initialProgress();
  state = { ...base, ...p, settings: { ...base.settings, ...p.settings } };
  persist();
  listeners.forEach((l) => l());
}

export function onChange(fn: (p: Progress) => void) {
  changeHooks.add(fn);
  return () => changeHooks.delete(fn);
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
  );
}

// ───────────── Helpers ─────────────

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** XP qo'shish va streakni yangilash. */
export function addXp(amount: number) {
  update((p) => {
    const today = dayKey();
    p.xp[today] = (p.xp[today] ?? 0) + amount;
    if (p.streak.last !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      p.streak = { count: p.streak.last === dayKey(y) ? p.streak.count + 1 : 1, last: today };
    }
  });
}

export function currentStreak(p: Progress): number {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return p.streak.last === dayKey() || p.streak.last === dayKey(y) ? p.streak.count : 0;
}

export const totalXp = (p: Progress) => Object.values(p.xp).reduce((a, b) => a + b, 0);
