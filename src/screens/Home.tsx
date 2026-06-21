import { useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import {
  ArrowLeftIcon,
  BoltIcon,
  PlayIcon,
  PlusIcon,
} from '../components/icons';
import { SoundToggle } from '../components/SoundToggle';
import { SpeechSettings } from '../components/SpeechSettings';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  categories,
  topicIdsForCategory,
  topicsForCategory,
} from '../content/catalog';
import { defaultConfig } from '../session/config';
import {
  loadLastConfig,
  sessionSignal,
  standings,
  startGame,
} from '../session/session';
import type { GameConfig, GameSession } from '../types';

function modeSummary(c: GameConfig): string {
  const who = `${c.entrants.length} ${c.entrantKind === 'teams' ? 'teams' : 'players'}`;
  switch (c.endMode) {
    case 'count':
      return `${who} · ${c.target} questions`;
    case 'race':
      return `${who} · race to ${c.target}`;
    case 'timed':
      return `${who} · ${Math.round(c.target / 60)} min`;
    default:
      return `${who} · endless`;
  }
}

function resumeSubtitle(s: GameSession): string {
  const [top] = standings(s);
  if (!top || top.score.score === 0) return 'In progress';
  return `${top.entrant.name} leads with ${top.score.score}`;
}

export function Home() {
  const [, navigate] = useLocation();
  const session = sessionSignal.value;
  const resumable = session?.status === 'active';
  const lastConfig = loadLastConfig();

  // Quick Play drill-down: closed → category chips → topic chips for a category.
  const [picking, setPicking] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Start a quick game, overriding only the topic scope (empty = all topics).
  const quickStart = async (topicIds: string[]) => {
    const base = lastConfig ?? defaultConfig();
    await startGame({ ...base, topicIds });
    navigate('/game');
  };

  const togglePicking = () => {
    setActiveCategory(null);
    setPicking((v) => !v);
  };

  const quickSubtitle = () => {
    if (activeCategory) return `Pick a topic in ${activeCategory}`;
    if (picking) return 'Pick a category, or drill into topics';
    return lastConfig ? modeSummary(lastConfig) : '2 teams · 15 questions';
  };

  return (
    <div class="screen home">
      <header class="home-header">
        <h1 class="home-title">Road Trip Trivia</h1>
        <div class="header-right">
          <SoundToggle />
          <SpeechSettings />
          <ThemeToggle />
        </div>
      </header>

      <p class="home-tagline">
        Quizmaster mode — one phone, the whole car plays.
      </p>

      <div class="home-actions">
        {resumable && session && (
          <button
            type="button"
            class="home-btn resume"
            onClick={() => navigate('/game')}
          >
            <span class="home-btn-main">
              <PlayIcon size={18} /> Resume game
            </span>
            <span class="home-btn-sub">{resumeSubtitle(session)}</span>
          </button>
        )}

        <button
          type="button"
          class={`home-btn quick ${picking ? 'open' : ''}`}
          aria-expanded={picking}
          onClick={togglePicking}
        >
          <span class="home-btn-main">
            <BoltIcon size={18} /> Quick Play
            <span
              class={`quick-caret ${picking ? 'open' : ''}`}
              aria-hidden="true"
            >
              ›
            </span>
          </span>
          <span class="home-btn-sub">{quickSubtitle()}</span>
        </button>

        {picking && !activeCategory && (
          <div class="category-chips">
            <button
              type="button"
              class="chip-btn all"
              onClick={() => quickStart([])}
            >
              All categories
            </button>
            {categories().map((cat) => (
              <button
                type="button"
                class="chip-btn"
                key={cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} ›
              </button>
            ))}
          </div>
        )}

        {picking && activeCategory && (
          <div class="category-chips">
            <button
              type="button"
              class="chip-btn back"
              onClick={() => setActiveCategory(null)}
            >
              <ArrowLeftIcon size={13} class="btn-icon" /> Categories
            </button>
            <button
              type="button"
              class="chip-btn all"
              onClick={() => quickStart(topicIdsForCategory(activeCategory))}
            >
              All {activeCategory}
            </button>
            {topicsForCategory(activeCategory).map((t) => (
              <button
                type="button"
                class="chip-btn"
                key={t.id}
                onClick={() => quickStart([t.id])}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          class="home-btn new"
          onClick={() => navigate('/setup')}
        >
          <span class="home-btn-main">
            <PlusIcon size={18} /> New Game
          </span>
          <span class="home-btn-sub">Set up players, topics &amp; mode</span>
        </button>
      </div>
    </div>
  );
}
