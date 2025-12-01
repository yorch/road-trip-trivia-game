// State management barrel export
// Maintains backward compatibility while organizing code into focused modules

import { type Signal, signal } from '@preact/signals';
import type { Difficulty, Question, QuestionMode, State } from '../types';
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

export const showTopicPickerSignal: Signal<boolean> = signal(false);
export const showCuratedListSignal: Signal<boolean> = signal(false);

// Global state with reactive properties
export const state: State = {
  get topicId(): string | null {
    return topicIdSignal.value;
  },
  set topicId(val: string | null) {
    topicIdSignal.value = val;
  },
  get difficulty(): Difficulty {
    return difficultySignal.value;
  },
  set difficulty(val: Difficulty) {
    difficultySignal.value = val;
  },
  get questionMode(): QuestionMode {
    return questionModeSignal.value;
  },
  set questionMode(val: QuestionMode) {
    questionModeSignal.value = val;
  },
  get revealed(): boolean {
    return revealedSignal.value;
  },
  set revealed(val: boolean) {
    revealedSignal.value = val;
  },
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
};

// Wrapper for saveProgress to maintain existing API
export function saveProgress(): void {
  persistProgress(progress);
}

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
