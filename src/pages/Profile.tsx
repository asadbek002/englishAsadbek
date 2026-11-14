import { useRef, useState } from 'react';
import { go, Icon, PageHead } from '../components/ui';
import { STAGES } from '../data/levels';
import { TOPICS } from '../data/grammar';
import { ApiError, login, logout, pullProgress, register, useAuth, type SyncStatus } from '../lib/api';
import { learnedCount } from '../lib/srs';
import { currentStreak, initialProgress, replaceProgress, totalXp, update, useProgress, type Progress } from '../lib/store';

const SYNC_LABEL: Record<SyncStatus, string> = {
  offline: 'Faqat shu qurilmada', idle: 'Kutilmoqda', syncing: 'Sinxronlanmoqda…', synced: 'Serverga saqlandi', error: "Sinxronlab bo'lmadi",
};

function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (mode === 'login') await login(username, password);
      else await register(name, username, password);
    } catch (e) { setErr(e instanceof ApiError ? e.message : 'Xatolik'); }
    finally { setBusy(false); }
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <div className="segmented">
        <button type="button" aria-pressed={mode === 'login'} onClick={() => setMode('login')}>Kirish</button>
        <button type="button" aria-pressed={mode === 'register'} onClick={() => setMode('register')}>Ro'yxatdan o'tish</button>
      </div>
      <p className="small muted" style={{ margin: 0 }}>Hisob bilan progressingiz serverda saqlanadi va telefon/kompyuter o'rtasida sinxronlanadi. AI funksiyalari ham hisob talab qiladi.</p>
      {mode === 'register' && <label className="field">Ismingiz<input className="input" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>}
      <label className="field">Login<input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required autoCapitalize="off" autoComplete="username" /></label>
      <label className="field">Parol<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {err && <div className="error">{err}</div>}
      <button className="btn block" disabled={busy}>{busy ? <span className="spinner" /> : mode === 'login' ? 'Kirish' : 'Hisob yaratish'}</button>
    </form>
  );
}

export default function Profile() {
  const p = useProgress();
  const { auth, syncStatus } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Progress['settings']>(k: K, v: Progress['settings'][K]) => update((d) => { d.settings[k] = v; });

  function exportData() {
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `lapis-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  }
  async function importData(f: File) {
    try {
      const data = JSON.parse(await f.text()) as Progress;
      if (data.v !== 1) throw new Error();
      replaceProgress({ ...data, updatedAt: Date.now() });
      update(() => {}); // serverga yuborish
      alert('Progress tiklandi.');
    } catch { alert("Fayl noto'g'ri."); }
  }

  return (
    <div className="stack" style={{ gap: 14 }}>
      <PageHead title="Profil" onBack={null} />

      {auth ? (
        <div className="card tile">
          <div className="ico"><Icon name="user" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>{auth.user.name}</h3>
            <p>@{auth.user.username} · <Icon name="cloud" size={14} /> {SYNC_LABEL[syncStatus]}</p>
          </div>
          <button className="btn ghost sm" onClick={() => pullProgress()} aria-label="Sinxronlash"><Icon name="refresh" size={18} /></button>
        </div>
      ) : <AuthForm />}

      <div className="grid-2">
        <div className="card"><div className="eyebrow">Daraja</div><h3 style={{ marginTop: 6 }}>{STAGES[p.stage].code === '0' ? 'Starter' : STAGES[p.stage].code} · {STAGES[p.stage].name}</h3></div>
        <div className="card"><div className="eyebrow">Jami XP</div><h3 style={{ marginTop: 6 }}>{totalXp(p)}</h3></div>
        <div className="card"><div className="eyebrow">So'zlar</div><h3 style={{ marginTop: 6 }}>{learnedCount(p)} yodlangan</h3></div>
        <div className="card"><div className="eyebrow">Darslar</div><h3 style={{ marginTop: 6 }}>{Object.values(p.grammar).filter((g) => g.done).length}/{TOPICS.length}</h3></div>
      </div>
      <div className="small muted center">🔥 {currentStreak(p)} kun ketma-ket</div>

      <h2>Sozlamalar</h2>
      <div className="card">
        <div className="setting"><span>Mavzu</span>
          <select className="input" value={p.settings.theme} onChange={(e) => set('theme', e.target.value as Progress['settings']['theme'])}>
            <option value="system">Tizim</option><option value="light">Yorug'</option><option value="dark">Qorong'u</option>
          </select></div>
        <div className="setting"><span>Kunlik XP maqsadi</span>
          <select className="input" value={p.settings.dailyGoal} onChange={(e) => set('dailyGoal', Number(e.target.value))}>
            {[30, 50, 100, 150, 200].map((n) => <option key={n} value={n}>{n} XP</option>)}
          </select></div>
        <div className="setting"><span>Kuniga yangi so'zlar</span>
          <select className="input" value={p.settings.newPerDay} onChange={(e) => set('newPerDay', Number(e.target.value))}>
            {[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n} ta</option>)}
          </select></div>
        <div className="setting"><span>Talaffuz</span>
          <select className="input" value={p.settings.accent} onChange={(e) => set('accent', e.target.value as 'en-GB' | 'en-US')}>
            <option value="en-GB">Britaniya (IELTS)</option><option value="en-US">Amerika</option>
          </select></div>
        <div className="setting"><span>Ovoz tezligi</span>
          <select className="input" value={p.settings.rate} onChange={(e) => set('rate', Number(e.target.value))}>
            {[0.7, 0.85, 0.95, 1, 1.15].map((n) => <option key={n} value={n}>{n}×</option>)}
          </select></div>
        <div className="setting">
          <span>Erkin rejim<div className="small muted">Barcha bosqichlarni ochadi</div></span>
          <input type="checkbox" checked={p.freeMode} onChange={(e) => update((d) => { d.freeMode = e.target.checked; })} style={{ width: 22, height: 22 }} />
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <button className="btn ghost block" onClick={() => go('placement/test')}><Icon name="target" size={18} />Daraja testini qayta topshirish</button>
        <div className="grid-2">
          <button className="btn ghost" onClick={exportData}>Eksport</button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()}>Import</button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
        {auth && <button className="btn ghost block" onClick={logout}>Hisobdan chiqish</button>}
        <button className="btn danger block" onClick={() => {
          if (confirm("Barcha progress o'chiriladi. Ishonchingiz komilmi?")) { replaceProgress(initialProgress()); update(() => {}); go(''); }
        }}>Progressni nolga qaytarish</button>
      </div>
    </div>
  );
}
