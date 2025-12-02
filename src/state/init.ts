import { effect } from '@preact/signals';
import {
  categoryAngles,
  difficulties,
  loadStaticData,
  promptTemplates,
  topicListSignal,
} from '../data/data';
import type { ScoreboardData } from '../types';
import { ErrorHandler, ToastManager } from '../utils';
import {
  askedSignal,
  difficultySignal,
  loadDifficulty,
  loadProgress,
  loadQuestionMode,
  loadScoreboard,
  progress,
  questionModeSignal,
  scoreSignal,
  streakSignal,
} from './index';

let localStorageWarningShown = false;

export async function initGame(): Promise<void> {
  // Show loading state
  document.body.classList.add('loading');

  // Initialize toast notification system
  ToastManager.init();

  // Load topics (answer examples loaded lazily when needed)
  try {
    await loadStaticData();
  } catch (error) {
    ErrorHandler.critical(
      'Failed to load game data. Please check your internet connection and refresh the page.',
      error instanceof Error ? error : undefined,
    );
    console.error('Topics loading failed:', error);
    return;
  }

  // Auto-save scoreboard to localStorage when any value changes
  effect(() => {
    const score = scoreSignal.value;
    const streak = streakSignal.value;
    const asked = askedSignal.value;

    try {
      const scoreboardData: ScoreboardData = { score, streak, asked };
      localStorage.setItem('scoreboard', JSON.stringify(scoreboardData));
      localStorageWarningShown = false; // Reset on success
    } catch (e) {
      // Only show warning once per session to avoid toast spam
      if (!localStorageWarningShown) {
        ErrorHandler.warn(
          'Unable to save progress - localStorage unavailable',
          e instanceof Error ? e : undefined,
        );
        localStorageWarningShown = true;
      }
      console.error('localStorage save failed:', e);
    }
  });

  // Comprehensive validation: ensure all required data.js dependencies loaded correctly
  const requiredData = [
    { name: 'topicList', data: topicListSignal.value, type: 'array' },
    { name: 'difficulties', data: difficulties, type: 'array' },
    { name: 'categoryAngles', data: categoryAngles, type: 'object' },
    { name: 'promptTemplates', data: promptTemplates, type: 'object' },
  ];

  const missing: string[] = [];
  const invalid: string[] = [];

  requiredData.forEach(({ name, data, type }) => {
    if (typeof data === 'undefined') {
      missing.push(name);
    } else if (type === 'array' && Array.isArray(data) && data.length === 0) {
      invalid.push(`${name} (empty array)`);
    } else if (type === 'array' && !Array.isArray(data)) {
      invalid.push(`${name} (expected array)`);
    } else if (
      type === 'object' &&
      (typeof data !== 'object' || Array.isArray(data))
    ) {
      invalid.push(`${name} (expected object)`);
    }
  });

  if (missing.length > 0 || invalid.length > 0) {
    const errorMsg = [
      'Failed to load required data from data.js:',
      missing.length > 0 ? `  Missing: ${missing.join(', ')}` : null,
      invalid.length > 0 ? `  Invalid: ${invalid.join(', ')}` : null,
      'Please ensure data.js is imported correctly and refresh the page.',
    ]
      .filter(Boolean)
      .join('\n');

    ErrorHandler.critical(errorMsg);
    return;
  }

  // Load saved preferences from localStorage
  questionModeSignal.value = loadQuestionMode();
  difficultySignal.value = loadDifficulty();

  // Load progress and scoreboard
  const loadedProgress = loadProgress();
  Object.assign(progress, loadedProgress);
  loadScoreboard(); // Will trigger reactive effects automatically

  // Remove no-js class to show UI (CSS will handle opacity)
  document.documentElement.classList.remove('no-js');

  // Remove loading state
  document.body.classList.remove('loading');
}
