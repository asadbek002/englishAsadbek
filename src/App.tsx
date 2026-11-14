import { useEffect } from 'react';
import { Icon, useRoute } from './components/ui';
import { useProgress } from './lib/store';
import Home from './pages/Home';
import Path from './pages/Path';
import { GrammarList, Tenses, TopicPage } from './pages/Grammar';
import { WordList, WordSession, WordsHub } from './pages/Words';
import Listen from './pages/Listen';
import { IeltsHub, Speaking, Writing } from './pages/Ielts';
import Tutor from './pages/Tutor';
import Profile from './pages/Profile';
import Exam from './pages/Exam';
import { PlacementTest, Welcome } from './pages/Placement';

const NAV = [
  { href: '', icon: 'home', label: 'Bosh', match: ['', 'listen', 'ielts', 'tutor'] },
  { href: 'path', icon: 'path', label: "Yo'l", match: ['path', 'exam'] },
  { href: 'grammar', icon: 'book', label: 'Grammatika', match: ['grammar', 'tenses'] },
  { href: 'words', icon: 'cards', label: "So'zlar", match: ['words'] },
  { href: 'profile', icon: 'user', label: 'Profil', match: ['profile'] },
];

function Screen({ r }: { r: string[] }) {
  const [a, b, c] = r;
  switch (a) {
    case undefined: return <Home />;
    case 'path': return <Path />;
    case 'grammar':
      if (b === 'stage') return <GrammarList focusStage={Number(c)} />;
      return b ? <TopicPage key={b} id={b} /> : <GrammarList />;
    case 'tenses': return <Tenses />;
    case 'words':
      if (b === 'play') return <WordSession key={c} mode={(c as 'cards' | 'quiz' | 'type') ?? 'quiz'} />;
      if (b === 'list') return <WordList />;
      return <WordsHub />;
    case 'listen': return <Listen />;
    case 'ielts':
      if (b === 'writing') return <Writing />;
      if (b === 'speaking') return <Speaking />;
      return <IeltsHub />;
    case 'tutor': return <Tutor />;
    case 'profile': return <Profile />;
    case 'exam': return <Exam key={b} stage={Number(b)} />;
    case 'placement': return b === 'test' ? <PlacementTest /> : <Welcome />;
    default: return <Home />;
  }
}

export default function App() {
  const r = useRoute();
  const p = useProgress();

  useEffect(() => {
    const el = document.documentElement;
    if (p.settings.theme === 'system') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', p.settings.theme);
  }, [p.settings.theme]);

  // Birinchi kirish: daraja testi yoki noldan boshlash
  const onboarding = !p.placement && r[0] !== 'profile' && r[0] !== 'placement';
  const inQuiz = (r[0] === 'placement' && r[1] === 'test') || r[0] === 'exam' || (r[0] === 'words' && r[1] === 'play');

  return (
    <div className="app">
      <main className="main">{onboarding ? <Welcome /> : <Screen r={r} />}</main>
      {!onboarding && !inQuiz && (
        <nav className="nav" aria-label="Asosiy menyu">
          {NAV.map((n) => (
            <a key={n.href} href={`#/${n.href}`} aria-current={n.match.includes(r[0] ?? '') ? 'page' : undefined}>
              <span className="nav-pill"><Icon name={n.icon} /></span>{n.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
