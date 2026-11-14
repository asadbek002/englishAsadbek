import { go, Icon } from '../components/ui';
import { TARGET_BAND } from '../data/levels';
import { useAuth } from '../lib/api';
import { bandEstimate, nextTopic, stageInfo } from '../lib/progress';
import { dueWords, learnedCount, newWordsLeftToday, newWords } from '../lib/srs';
import { currentStreak, dayKey, useProgress } from '../lib/store';

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Xayrli tun' : h < 12 ? 'Xayrli tong' : h < 18 ? 'Xayrli kun' : 'Xayrli kech';
}

export default function Home() {
  const p = useProgress();
  const { auth } = useAuth();
  const est = bandEstimate(p);
  const todayXp = p.xp[dayKey()] ?? 0;
  const due = dueWords(p).length;
  const fresh = Math.min(newWordsLeftToday(p), newWords(p, 50).length);
  const topic = nextTopic(p);
  const info = stageInfo(p, p.stage);
  const pos = (v: number) => `${(v / 9) * 100}%`;

  return (
    <div className="stack" style={{ gap: 14 }}>
      <section className="hero" aria-label="IELTS darajangiz">
        <p className="greet">{greeting()}{auth ? `, ${auth.user.name}` : ''}</p>
        <h1>{est.stage.code === '0' ? 'Starter · Noldan' : `${est.stage.code} · ${est.stage.name}`}</h1>
        <div className="ruler">
          <div className="ruler-goal" style={{ left: pos(TARGET_BAND) }}><span>Maqsad {TARGET_BAND.toFixed(1)}</span><i /></div>
          <div className="ruler-me" style={{ left: `clamp(24px, ${pos(est.value)}, calc(100% - 24px))` }}><b>≈ {est.value.toFixed(1)}</b></div>
          <div className="ruler-track" style={{ marginTop: 8 }}><div className="ruler-fill" style={{ width: pos(est.value) }} /></div>
          <div className="ruler-ticks" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i}>{i}</span>)}</div>
        </div>
        <div className="hero-stats">
          <div><b>{currentStreak(p)}</b><span>kun ketma-ket</span></div>
          <div><b>{todayXp}/{p.settings.dailyGoal}</b><span>bugungi XP</span></div>
          <div><b>{learnedCount(p)}</b><span>so'z yodlandi</span></div>
        </div>
      </section>

      <h2 style={{ margin: '14px 0 2px' }}>Bugungi reja</h2>

      <a className="card tile" href="#/words/play/quiz">
        <div className="ico teal"><Icon name="cards" /></div>
        <div style={{ flex: 1 }}>
          <h3>So'z yodlash</h3>
          <p>{due + fresh === 0 ? "Bugungi so'zlar tugadi — erta yana keling" : `${due} ta takrorlash · ${fresh} ta yangi so'z`}</p>
        </div>
        <Icon name="next" />
      </a>

      {topic && (
        <a className="card tile" href={`#/grammar/${topic.id}`}>
          <div className="ico"><Icon name="book" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>{topic.title}</h3>
            <p>Keyingi grammatika darsi · {topic.ru}</p>
          </div>
          <Icon name="next" />
        </a>
      )}

      {info.examReady && !info.passed && (
        <a className="card tile" href={`#/exam/${p.stage}`} style={{ borderColor: 'var(--saffron)' }}>
          <div className="ico saffron"><Icon name="trophy" /></div>
          <div style={{ flex: 1 }}>
            <h3>{info.stage.code} bosqich imtihoni tayyor</h3>
            <p>80% va undan yuqori natija keyingi bosqichni ochadi</p>
          </div>
          <Icon name="next" />
        </a>
      )}

      <div className="grid-2">
        <a className="card tile" href="#/listen" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="ico saffron"><Icon name="ear" /></div>
          <div><h3>Tinglash</h3><p>Diktant mashqi</p></div>
        </a>
        <a className="card tile" href="#/tutor" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="ico rose"><Icon name="sparkle" /></div>
          <div><h3>AI ustoz</h3><p>Istalgan savol</p></div>
        </a>
        <a className="card tile" href="#/ielts/writing" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="ico"><Icon name="pen" /></div>
          <div><h3>Writing</h3><p>AI baholaydi</p></div>
        </a>
        <a className="card tile" href="#/ielts/speaking" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="ico teal"><Icon name="mic" /></div>
          <div><h3>Speaking</h3><p>Gapiring, AI baholaydi</p></div>
        </a>
      </div>

      <button className="card tile" onClick={() => go('ielts')}>
        <div className="ico"><Icon name="target" /></div>
        <div style={{ flex: 1 }}><h3>IELTS markazi</h3><p>Imtihon tuzilishi, mezonlar va 8.0 uchun nima kerak</p></div>
        <Icon name="next" />
      </button>
    </div>
  );
}
