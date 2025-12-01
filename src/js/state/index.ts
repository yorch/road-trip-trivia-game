// State management barrel export for Road Trip Trivia
// Maintains backward compatibility while organizing code into focused modules

import { type Signal, signal } from '@preact/signals-core';
import type { Difficulty, State } from '../../types';
import { DIFFICULTY_LEVELS, QUESTION_MODES } from '../utils';

export * from './curated-cache';
// Re-export from submodules
export * from './persistence';
export * from './progress';
export * from './questions';

import {
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

// Global state with reactive properties
export const state: State = {
  topicId: null,
  difficulty: DIFFICULTY_LEVELS.EASY,
  questionMode: QUESTION_MODES.ALL,
  // Use getters/setters to sync with signals for backward compatibility
  get score(): number {
    return scoreSignal.value;
  },
  set score(val: number) {
    scoreSignal.value = val;
  },
  get streak(): number {
    return streakSignal.value;
  },
  set streak(val: number) {
    streakSignal.value = val;
  },
  get asked(): number {
    return askedSignal.value;
  },
  set asked(val: number) {
    askedSignal.value = val;
  },
  revealed: false,
};

// Wrapper for rebuildQuestionBank to maintain existing API
export function rebuildQuestionBank(): void {
  rebuildBank(state.topicId, progress);
  persistProgress(progress);
}

// Wrapper for resetProgressAll to maintain existing API
export function resetProgressAll(): void {
  resetAllProgress(window.difficulties as Difficulty[]);
  state.score = 0;
  state.streak = 0;
  state.asked = 0;
  persistProgress(progress);
}

// Re-export loadScoreboard but make it update state for backward compatibility
export function loadScoreboard(): void {
  const data = loadScoreboardData();
  state.score = data.score;
  state.streak = data.streak;
  state.asked = data.asked;
}

// Initialize progress from persistence
export function initializeProgress(): void {
  const loadedProgress = require('./persistence').loadProgress();
  loadProgressData(loadedProgress);
}
