import { useMemo, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { ArrowLeftIcon, PlayIcon, PlusIcon, XIcon } from '../components/icons';
import { topicsSignal } from '../content/catalog';
import { curatedStats, hasCurated } from '../content/curated';
import { defaultConfig, defaultEntrantName, genId } from '../session/config';
import { loadLastConfig, startGame } from '../session/session';
import type {
  Difficulty,
  DifficultyChoice,
  EndMode,
  Entrant,
  EntrantKind,
  GameConfig,
  Topic,
} from '../types';

const END_MODES: { id: EndMode; label: string }[] = [
  { id: 'count', label: 'Questions' },
  { id: 'race', label: 'Race to N' },
  { id: 'timed', label: 'Timed' },
  { id: 'endless', label: 'Endless' },
];

const DIFFICULTY_CHOICES: { id: DifficultyChoice; label: string }[] = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

function defaultTarget(mode: EndMode): number {
  if (mode === 'race') return 10;
  if (mode === 'timed') return 300; // seconds
  return 15; // questions
}

export function Setup() {
  const [, navigate] = useLocation();
  const [config, setConfig] = useState<GameConfig>(
    () => loadLastConfig() ?? defaultConfig(),
  );
  const [pickMode, setPickMode] = useState(config.topicIds.length > 0);
  const [busy, setBusy] = useState(false);

  const topics = topicsSignal.value;
  const grouped = useMemo(() => {
    const groups: Record<string, Topic[]> = {};
    for (const t of topics) {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }, [topics]);

  const update = (patch: Partial<GameConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  // ── entrants ──
  const setEntrantName = (id: string, name: string) =>
    update({
      entrants: config.entrants.map((e) => (e.id === id ? { ...e, name } : e)),
    });
  const addEntrant = () =>
    update({
      entrants: [
        ...config.entrants,
        {
          id: genId(),
          name: defaultEntrantName(config.entrantKind, config.entrants.length),
        },
      ],
    });
  const removeEntrant = (id: string) =>
    update({ entrants: config.entrants.filter((e) => e.id !== id) });
  const setKind = (kind: EntrantKind) => update({ entrantKind: kind });

  // ── topics ──
  const toggleTopic = (id: string) => {
    const set = new Set(config.topicIds);
    set.has(id) ? set.delete(id) : set.add(id);
    update({ topicIds: [...set] });
  };

  const selectedTopics = new Set(config.topicIds);
  const noTopicsPicked = pickMode && config.topicIds.length === 0;
  const canStart = config.entrants.length >= 1 && !noTopicsPicked && !busy;

  const start = async () => {
    setBusy(true);
    const finalConfig: GameConfig = {
      ...config,
      topicIds: pickMode ? config.topicIds : [],
    };
    await startGame(finalConfig);
    navigate('/game');
  };

  return (
    <div class="screen setup">
      <header class="setup-header">
        <button
          type="button"
          class="icon-btn"
          onClick={() => navigate('/')}
          aria-label="Back"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <h1>New Game</h1>
      </header>

      {/* Competitors */}
      <section class="setup-section">
        <div class="setup-section-head">
          <h2>Players</h2>
          <div class="segmented sm">
            {(['teams', 'players'] as EntrantKind[]).map((k) => (
              <button
                type="button"
                key={k}
                class={`seg ${config.entrantKind === k ? 'active' : ''}`}
                onClick={() => setKind(k)}
              >
                {k === 'teams' ? 'Teams' : 'Individuals'}
              </button>
            ))}
          </div>
        </div>
        <div class="entrant-list">
          {config.entrants.map((e: Entrant) => (
            <div class="entrant-row" key={e.id}>
              <input
                type="text"
                value={e.name}
                onInput={(ev) =>
                  setEntrantName(e.id, (ev.target as HTMLInputElement).value)
                }
                placeholder="Name"
              />
              <button
                type="button"
                class="icon-btn"
                disabled={config.entrants.length <= 1}
                onClick={() => removeEntrant(e.id)}
                aria-label={`Remove ${e.name}`}
              >
                <XIcon size={16} />
              </button>
            </div>
          ))}
          <button type="button" class="ghost add-entrant" onClick={addEntrant}>
            <PlusIcon size={14} class="btn-icon" /> Add{' '}
            {config.entrantKind === 'teams' ? 'team' : 'player'}
          </button>
        </div>
      </section>

      {/* Topics */}
      <section class="setup-section">
        <h2>Topics</h2>
        <div class="segmented">
          <button
            type="button"
            class={`seg ${!pickMode ? 'active' : ''}`}
            onClick={() => setPickMode(false)}
          >
            Everything
          </button>
          <button
            type="button"
            class={`seg ${pickMode ? 'active' : ''}`}
            onClick={() => setPickMode(true)}
          >
            Pick topics
          </button>
        </div>
        {pickMode && (
          <div class="topic-select">
            {Object.keys(grouped)
              .sort()
              .map((category) => (
                <div class="topic-select-group" key={category}>
                  <h3>{category}</h3>
                  {grouped[category].map((t) => {
                    const stats = curatedStats(t.id);
                    const total = stats
                      ? stats.easy + stats.medium + stats.hard
                      : 0;
                    return (
                      <label class="topic-check" key={t.id}>
                        <input
                          type="checkbox"
                          checked={selectedTopics.has(t.id)}
                          onChange={() => toggleTopic(t.id)}
                        />
                        <span class="topic-check-name">{t.name}</span>
                        {hasCurated(t.id) && (
                          <span class="topic-check-count">{total}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ))}
          </div>
        )}
        {noTopicsPicked && (
          <p class="setup-hint">
            Pick at least one topic, or choose Everything.
          </p>
        )}
      </section>

      {/* Difficulty */}
      <section class="setup-section">
        <h2>Difficulty</h2>
        <div class="segmented">
          {DIFFICULTY_CHOICES.map(({ id, label }) => (
            <button
              type="button"
              key={id}
              class={`seg ${config.difficulty === id ? 'active' : ''}`}
              onClick={() => update({ difficulty: id as Difficulty | 'mixed' })}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Mode */}
      <section class="setup-section">
        <h2>Game length</h2>
        <div class="segmented">
          {END_MODES.map(({ id, label }) => (
            <button
              type="button"
              key={id}
              class={`seg ${config.endMode === id ? 'active' : ''}`}
              onClick={() => update({ endMode: id, target: defaultTarget(id) })}
            >
              {label}
            </button>
          ))}
        </div>
        {config.endMode !== 'endless' && (
          <TargetStepper
            mode={config.endMode}
            target={config.target}
            onChange={(t) => update({ target: t })}
          />
        )}
      </section>

      <button
        type="button"
        class="primary start-btn"
        disabled={!canStart}
        onClick={start}
      >
        <PlayIcon size={16} class="btn-icon" />{' '}
        {busy ? 'Starting…' : 'Start game'}
      </button>
    </div>
  );
}

function TargetStepper({
  mode,
  target,
  onChange,
}: {
  mode: EndMode;
  target: number;
  onChange: (t: number) => void;
}) {
  // For 'timed' the config stores seconds but we edit in minutes.
  const isTimed = mode === 'timed';
  const value = isTimed ? Math.round(target / 60) : target;
  const step = isTimed ? 1 : mode === 'race' ? 1 : 5;
  const min = isTimed ? 2 : 5;
  const max = isTimed ? 20 : mode === 'race' ? 30 : 50;
  const unit = isTimed ? 'min' : mode === 'race' ? 'points' : 'questions';

  const set = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    onChange(isTimed ? clamped * 60 : clamped);
  };

  return (
    <div class="stepper">
      <button
        type="button"
        class="stepper-btn"
        onClick={() => set(value - step)}
        aria-label="Decrease"
      >
        −
      </button>
      <span class="stepper-value">
        {value} <em>{unit}</em>
      </span>
      <button
        type="button"
        class="stepper-btn"
        onClick={() => set(value + step)}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
