// Main entry point for Road Trip Trivia
// This file orchestrates the initialization of all modules

// Import CSS (Vite will process this)
import '../css/style.css';

import { effect } from '@preact/signals-core';
import {
  answerExamples,
  answerTemplates,
  categoryAngles,
  difficulties,
  promptTemplates,
  topicList,
} from '../data/data';
import type { ScoreboardData } from '../types';
import {
  askedSignal,
  loadCuratedQuestions,
  loadDifficulty,
  loadLastTopic,
  loadProgress,
  loadQuestionMode,
  loadScoreboard,
  progress,
  scoreSignal,
  state,
  streakSignal,
} from './state';
import {
  bindEvents,
  nextQuestion,
  populateTopicPicker,
  showTopicPicker,
  updateDifficultyButtons,
  updateQuestionModeButtons,
} from './ui';
import { ErrorHandler, ToastManager } from './utils';

// Track if localStorage warning has been shown this session
let localStorageWarningShown = false;

async function init(): Promise<void> {
  // Show loading state
  document.body.classList.add('loading');

  // Initialize toast notification system
  ToastManager.init();

  // Set up reactive scoreboard updates (automatic UI sync)
  effect(() => {
    const scoreEl = document.getElementById('scoreValue');
    if (scoreEl) {
      scoreEl.textContent = String(scoreSignal.value);
    }
  });

  effect(() => {
    const streakEl = document.getElementById('streakValue');
    if (streakEl) {
      streakEl.textContent = String(streakSignal.value);
    }
  });

  effect(() => {
    const askedEl = document.getElementById('askedValue');
    if (askedEl) {
      askedEl.textContent = String(askedSignal.value);
    }
  });

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
          e,
        );
        localStorageWarningShown = true;
      }
      console.error('localStorage save failed:', e);
    }
  });

  // Load curated questions first (async)
  const curatedLoaded = await loadCuratedQuestions();

  // Notify user if curated questions failed to load
  if (!curatedLoaded) {
    ErrorHandler.info(
      'Curated questions unavailable - using generated questions only',
    );
  }

  // Comprehensive validation: ensure all required data.js dependencies loaded correctly
  const requiredData = [
    { name: 'topicList', data: topicList, type: 'array' },
    { name: 'difficulties', data: difficulties, type: 'array' },
    { name: 'categoryAngles', data: categoryAngles, type: 'object' },
    { name: 'promptTemplates', data: promptTemplates, type: 'object' },
    { name: 'answerTemplates', data: answerTemplates, type: 'object' },
    { name: 'answerExamples', data: answerExamples, type: 'object' },
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
  window.answerTemplates = answerTemplates;
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

  // Update UI to reflect loaded state
  updateDifficultyButtons();
  updateQuestionModeButtons();
  await populateTopicPicker();
  bindEvents();

  // Remove no-js class to show UI (CSS will handle opacity)
  document.documentElement.classList.remove('no-js');

  // Remove loading state
  document.body.classList.remove('loading');

  // Check if there's a saved topic from last session
  const lastTopic = loadLastTopic();
  if (lastTopic && window.topicList.find((t) => t.id === lastTopic)) {
    // Resume with saved topic
    state.topicId = lastTopic;
    nextQuestion();
  } else {
    // First visit or invalid saved topic - show picker
    showTopicPicker();
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
