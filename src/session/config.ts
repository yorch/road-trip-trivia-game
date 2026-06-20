// Game config helpers: id generation and a sensible default config.

import type { GameConfig } from '../types';

export function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID)
    return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}

export function defaultConfig(): GameConfig {
  return {
    entrantKind: 'teams',
    entrants: [
      { id: genId(), name: 'Front Seat' },
      { id: genId(), name: 'Back Seat' },
    ],
    topicIds: [],
    contentMode: 'curated',
    difficulty: 'mixed',
    endMode: 'count',
    target: 15,
  };
}

// Default name for a freshly added entrant.
export function defaultEntrantName(
  kind: GameConfig['entrantKind'],
  index: number,
): string {
  return kind === 'teams' ? `Team ${index + 1}` : `Player ${index + 1}`;
}
