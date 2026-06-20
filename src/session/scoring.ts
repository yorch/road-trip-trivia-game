// Pure scoring rules. Difficulty-weighted points plus a streak bonus.

import type { Difficulty, EntrantScore } from '../types';

export const POINTS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};
export const STREAK_INTERVAL = 3; // bonus every Nth consecutive correct
export const STREAK_BONUS = 2;

export function basePoints(difficulty: Difficulty): number {
  return POINTS[difficulty];
}

// Bonus awarded when a streak reaches a multiple of STREAK_INTERVAL.
export function bonusForStreak(streak: number): number {
  return streak > 0 && streak % STREAK_INTERVAL === 0 ? STREAK_BONUS : 0;
}

export function emptyScore(): EntrantScore {
  return { score: 0, streak: 0, bestStreak: 0, correct: 0 };
}

export interface CorrectOutcome {
  next: EntrantScore;
  base: number;
  bonus: number;
  streak: number;
}

// Returns a NEW score state for an entrant who answered correctly.
export function applyCorrect(
  prev: EntrantScore,
  difficulty: Difficulty,
): CorrectOutcome {
  const streak = prev.streak + 1;
  const base = basePoints(difficulty);
  const bonus = bonusForStreak(streak);
  return {
    next: {
      score: prev.score + base + bonus,
      streak,
      bestStreak: Math.max(prev.bestStreak, streak),
      correct: prev.correct + 1,
    },
    base,
    bonus,
    streak,
  };
}
