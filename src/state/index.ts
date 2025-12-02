// State management barrel export
// Maintains backward compatibility while organizing code into focused modules

import { type Signal, signal } from '@preact/signals';
import { difficulties } from '../data/data';
import type { Difficulty, Question, QuestionMode } from '../types';
import { DIFFICULTY_LEVELS, QUESTION_MODES } from '../utils';

export * from './curated-cache';
// Re-export from submodules
export * from './persistence';
export * from './progress';
export * from './questions';

import {
  loadProgress,
  loadScoreboard as loadScoreboardData,
  saveProgress as persistProgress,
} from './persistence';
// Import for internal use
import {
  loadProgressData,
  progress,
  resetProgressAll as resetAllProgress,
} from './progress';
import { rebuildQuestionBank as rebuildBank } from './questions';

// Reactive signals for scoreboard (automatically update UI)
export const scoreSignal: Signal<number> = signal(0);
export const streakSignal: Signal<number> = signal(0);
export const askedSignal: Signal<number> = signal(0);

// Reactive signals for app state
export const topicIdSignal: Signal<string | null> = signal(null);
export const difficultySignal: Signal<Difficulty> = signal(
  DIFFICULTY_LEVELS.EASY,
);
export const questionModeSignal: Signal<QuestionMode> = signal(
  QUESTION_MODES.ALL,
);
export const revealedSignal: Signal<boolean> = signal(false);

export const currentQuestionSignal: Signal<Question | null> = signal(null);
export const endStateSignal: Signal<{ title: string; message: string } | null> =
  signal(null);

export const showCuratedListSignal: Signal<boolean> = signal(false);

// Wrapper for saveProgress to maintain existing API
export function saveProgress(): void {
  persistProgress(progress);
}

// Wrapper for rebuildQuestionBank to maintain existing API
export function rebuildQuestionBank(): void {
  rebuildBank(topicIdSignal.value, progress);
  persistProgress(progress);
}

// Wrapper for resetProgressAll to maintain existing API
export function resetProgressAll(): void {
  resetAllProgress(difficulties);
  scoreSignal.value = 0;
  streakSignal.value = 0;
  askedSignal.value = 0;
  persistProgress(progress);
}

// Re-export loadScoreboard but make it update state for backward compatibility
export function loadScoreboard(): void {
  const data = loadScoreboardData();
  scoreSignal.value = data.score;
  streakSignal.value = data.streak;
  askedSignal.value = data.asked;
}

// Initialize progress from persistence
export function initializeProgress(): void {
  const loadedProgress = loadProgress();
  loadProgressData(loadedProgress);
}
