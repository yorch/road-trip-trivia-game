// Game session state machine. Owns the single active GameSession signal,
// persists it for Resume, and exposes the actions screens call.

import { signal } from '@preact/signals';
import { buildPool } from '../content/provider';
import { MAX_SEED_VALUE } from '../lib/shuffle';
import { readJSON, remove, writeJSON } from '../lib/storage';
import type {
  AwardResult,
  Entrant,
  EntrantScore,
  GameConfig,
  GameSession,
  Question,
} from '../types';
import { applyCorrect, emptyScore } from './scoring';

const SESSION_KEY = 'rtt-session';
const CONFIG_KEY = 'rtt-last-config';

export const sessionSignal = signal<GameSession | null>(null);

export function loadLastConfig(): GameConfig | null {
  return readJSON<GameConfig>(CONFIG_KEY);
}

function persist(s: GameSession | null): void {
  // Only an in-progress game is worth resuming.
  if (s && s.status === 'active') writeJSON(SESSION_KEY, s);
  else remove(SESSION_KEY);
}

function setSession(s: GameSession | null): void {
  sessionSignal.value = s;
  persist(s);
}

// Restore an in-progress game from a previous visit, if any.
export function resumeSession(): GameSession | null {
  const s = readJSON<GameSession>(SESSION_KEY);
  if (
    s &&
    s.status === 'active' &&
    Array.isArray(s.pool) &&
    s.pool.length > 0
  ) {
    sessionSignal.value = s;
    return s;
  }
  remove(SESSION_KEY);
  return null;
}

export async function startGame(config: GameConfig): Promise<void> {
  const seed = Math.floor(Math.random() * MAX_SEED_VALUE) || 1;
  const pool = await buildPool(config, seed);

  const scores: Record<string, EntrantScore> = {};
  for (const e of config.entrants) scores[e.id] = emptyScore();

  const startedAt = Date.now();
  setSession({
    config,
    seed,
    pool,
    cursor: 0,
    revealed: false,
    scores,
    status: 'active',
    startedAt,
    endsAt:
      config.endMode === 'timed' ? startedAt + config.target * 1000 : undefined,
    lastAward: null,
  });
  writeJSON(CONFIG_KEY, config);
}

export function currentQuestion(s: GameSession): Question | null {
  return s.pool[s.cursor] ?? null;
}

export function reveal(): void {
  const s = sessionSignal.value;
  if (!s || s.revealed) return;
  setSession({ ...s, revealed: true });
}

function isGameOver(
  s: GameSession,
  scores: Record<string, EntrantScore>,
  nextCursor: number,
): boolean {
  const { config } = s;
  switch (config.endMode) {
    case 'count':
      return nextCursor >= config.target || nextCursor >= s.pool.length;
    case 'race':
      return Object.values(scores).some((sc) => sc.score >= config.target);
    case 'timed':
      return Date.now() >= (s.endsAt ?? 0) || nextCursor >= s.pool.length;
    default: // endless
      return nextCursor >= s.pool.length;
  }
}

// Award the current question to an entrant (or null = nobody), then advance.
export function award(entrantId: string | null): void {
  const s = sessionSignal.value;
  if (s?.status !== 'active') return;
  const q = currentQuestion(s);
  if (!q) return;

  const scores: Record<string, EntrantScore> = { ...s.scores };
  let result: AwardResult = {
    entrantId,
    base: 0,
    bonus: 0,
    difficulty: q.difficulty,
    streak: 0,
  };

  if (entrantId && scores[entrantId]) {
    const outcome = applyCorrect(scores[entrantId], q.difficulty);
    scores[entrantId] = outcome.next;
    // A successful answer by one entrant breaks everyone else's streak.
    for (const id of Object.keys(scores)) {
      if (id !== entrantId) scores[id] = { ...scores[id], streak: 0 };
    }
    result = {
      entrantId,
      base: outcome.base,
      bonus: outcome.bonus,
      difficulty: q.difficulty,
      streak: outcome.streak,
    };
  }

  const nextCursor = s.cursor + 1;
  const finished = isGameOver(s, scores, nextCursor);
  setSession({
    ...s,
    scores,
    cursor: nextCursor,
    revealed: false,
    status: finished ? 'finished' : 'active',
    lastAward: result,
  });
}

// End the game now (timer expiry or manual "Finish").
export function finishGame(): void {
  const s = sessionSignal.value;
  if (!s) return;
  setSession({ ...s, status: 'finished' });
}

// Abandon the current game and clear it.
export function clearSession(): void {
  setSession(null);
}

export interface Standing {
  entrant: Entrant;
  score: EntrantScore;
  rank: number;
}

// Entrants sorted by score (desc), with ranks (ties share a rank).
export function standings(s: GameSession): Standing[] {
  const sorted = s.config.entrants
    .map((entrant) => ({
      entrant,
      score: s.scores[entrant.id] ?? emptyScore(),
    }))
    .sort((a, b) => b.score.score - a.score.score);

  let rank = 0;
  let prevScore = Number.NaN;
  return sorted.map((row, i) => {
    if (row.score.score !== prevScore) {
      rank = i + 1;
      prevScore = row.score.score;
    }
    return { ...row, rank };
  });
}
