// This file orchestrates the initialization of all modules

// Import CSS (Vite will process this)
import './css/style.css';

import { effect } from '@preact/signals';
import { render } from 'preact';
import { App } from './components/App';
import {
  answerExamples,
  categoryAngles,
  difficulties,
  loadStaticData,
  promptTemplates,
  topicList,
} from './data/data';
import {
  askedSignal,
  loadDifficulty,
  loadLastTopic,
  loadProgress,
  loadQuestionMode,
  loadScoreboard,
  progress,
  scoreSignal,
  showTopicPickerSignal,
  state,
  streakSignal,
} from './state';
import type { ScoreboardData } from './types';
import { nextQuestion } from './ui/question-flow';
import { ErrorHandler, ToastManager } from './utils';

// Track if localStorage warning has been shown this session
let localStorageWarningShown = false;

async function init(): Promise<void> {
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
    { name: 'topicList', data: topicList, type: 'array' },
    { name: 'difficulties', data: difficulties, type: 'array' },
    { name: 'categoryAngles', data: categoryAngles, type: 'object' },
    { name: 'promptTemplates', data: promptTemplates, type: 'object' },
  ];

  const missing: string[] = [];
  const invalid: string[] = [];

  requiredData.forEach(({ name, data, type }) => {
    if (typeof data === 'undefined') {
      missing.push(name);
    } else if (type === 'array' && !Array.isArray(data)) {
      invalid.push(`${name} (expected array)`);
    } else if (
      type === 'object' &&
      (typeof data !== 'object' || Array.isArray(data))
    ) {
      invalid.push(`${name} (expected object)`);
    } else if (type === 'array' && data.length === 0) {
      invalid.push(`${name} (empty array)`);
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

  // Expose to window for backward compatibility with existing code
  window.topicList = topicList;
  window.difficulties = difficulties;
  window.categoryAngles = categoryAngles;
  window.promptTemplates = promptTemplates;
  window.answerExamples = answerExamples;

  // Load saved preferences from localStorage
  Object.assign(state, {
    questionMode: loadQuestionMode(),
    difficulty: loadDifficulty(),
  });

  // Load progress and scoreboard
  const loadedProgress = loadProgress();
  Object.assign(progress, loadedProgress);
  loadScoreboard(); // Will trigger reactive effects automatically

  // Remove no-js class to show UI (CSS will handle opacity)
  document.documentElement.classList.remove('no-js');

  // Remove loading state
  document.body.classList.remove('loading');

  // Render App
  const appRoot = document.getElementById('app');
  if (!appRoot) throw new Error('Root element #app not found');
  render(<App />, appRoot);

  // Check if there's a saved topic from last session
  const lastTopic = loadLastTopic();
  if (lastTopic && topicList.find((t) => t.id === lastTopic)) {
    // Resume with saved topic
    state.topicId = lastTopic; // This updates the signal
    nextQuestion();
  } else {
    // First visit or invalid saved topic - show picker
    showTopicPickerSignal.value = true;
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
