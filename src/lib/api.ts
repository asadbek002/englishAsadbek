import { useSyncExternalStore } from 'react';
import { getProgress, onChange, replaceProgress, type Progress } from './store';

/** Backend manzili. Bir xil domenda bo'lsa bo'sh qoldiring; aks holda .env da VITE_API_URL. */
export const API = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export interface User { id: number; username: string; name: string; createdAt: number }
interface Auth { token: string; user: User }
export type SyncStatus = 'offline' | 'idle' | 'syncing' | 'synced' | 'error';

const AUTH_KEY = 'lapis.auth';
let auth: Auth | null = (() => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? 'null'); } catch { return null; }
})();
let syncStatus: SyncStatus = auth ? 'idle' : 'offline';
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let snapshot: { auth: Auth | null; syncStatus: SyncStatus } = { auth, syncStatus };
const refreshSnapshot = () => { snapshot = { auth, syncStatus }; emit(); };

export function useAuth() {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => snapshot);
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) { super(message); }
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API + path, {
      method: opts.method ?? (opts.body ? 'POST' : 'GET'),
      headers: {
        ...(opts.body ? { 'content-type': 'application/json' } : {}),
        ...(auth ? { authorization: `Bearer ${auth.token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Serverga ulanib bo'lmadi. Internetni tekshiring.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) logout();
    throw new ApiError(res.status, (data as { error?: string }).error ?? `Xatolik (${res.status})`, data);
  }
  return data as T;
}

function setAuth(a: Auth | null) {
  auth = a;
  if (a) localStorage.setItem(AUTH_KEY, JSON.stringify(a));
  else localStorage.removeItem(AUTH_KEY);
  syncStatus = a ? 'idle' : 'offline';
  refreshSnapshot();
}

export async function login(username: string, password: string) {
  setAuth(await api<Auth>('/api/auth/login', { body: { username, password } }));
  await pullProgress();
}

export async function register(name: string, username: string, password: string) {
  setAuth(await api<Auth>('/api/auth/register', { body: { name, username, password } }));
  await pullProgress();
}

export function logout() { setAuth(null); }

// ───────────── Progress sync ─────────────

function setStatus(s: SyncStatus) { syncStatus = s; refreshSnapshot(); }

/** Serverdagi va qurilmadagi nusxani solishtirib, yangirog'ini qoldiradi. */
export async function pullProgress() {
  if (!auth) return;
  setStatus('syncing');
  try {
    const remote = await api<{ data: Progress | null; updatedAt: number }>('/api/progress');
    const local = getProgress();
    if (remote.data && remote.updatedAt > local.updatedAt) {
      replaceProgress({ ...remote.data, updatedAt: remote.updatedAt });
      setStatus('synced');
    } else if (local.updatedAt > remote.updatedAt) {
      await pushProgress();
    } else setStatus('synced');
  } catch {
    setStatus('error');
  }
}

async function pushProgress() {
  if (!auth) return;
  const p = getProgress();
  setStatus('syncing');
  try {
    await api('/api/progress', { method: 'PUT', body: { data: p, updatedAt: p.updatedAt } });
    setStatus('synced');
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      const body = e.body as { data: Progress; updatedAt: number };
      replaceProgress({ ...body.data, updatedAt: body.updatedAt });
      setStatus('synced');
    } else setStatus('error');
  }
}

let timer: ReturnType<typeof setTimeout> | undefined;
onChange(() => {
  if (!auth) return;
  clearTimeout(timer);
  timer = setTimeout(pushProgress, 1500);
});

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => pullProgress());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pullProgress();
  });
}

// ───────────── AI ─────────────

export interface Criterion { name: string; band: number; comment_uz: string }
export interface Mistake { original: string; correction: string; explanation_ru: string }
export interface WritingResult {
  overall: number; criteria: Criterion[]; word_count: number; summary_uz: string; strengths_uz: string[];
  mistakes: Mistake[]; vocabulary_upgrades: { basic: string; better: string; example: string }[];
  improved_version: string; next_steps_uz: string[];
}
export interface SpeakingResult {
  overall: number; criteria: Criterion[]; summary_uz: string; mistakes: Mistake[];
  useful_phrases: string[]; model_answer: string; next_steps_uz: string[];
}

export const ai = {
  health: () => api<{ ok: boolean; ai: boolean; model: string | null }>('/api/health'),
  writing: (task: 'task1' | 'task2', prompt: string, text: string) =>
    api<WritingResult>('/api/ai/writing', { body: { task, prompt, text } }),
  speaking: (part: number, question: string, transcript: string, seconds: number) =>
    api<SpeakingResult>('/api/ai/speaking', { body: { part, question, transcript, seconds } }),
  tutor: (level: string, messages: { role: 'user' | 'assistant'; content: string }[]) =>
    api<{ reply: string }>('/api/ai/tutor', { body: { level, messages } }),
};
