// Main entry point for Road Trip Trivia
// This file orchestrates the initialization of all modules

// Import CSS (Vite will process this)
import '../css/style.css';

import {
  answerExamples,
  answerTemplates,
  categoryAngles,
  difficulties,
  promptTemplates,
  topicList,
} from '../data/data.js';
import {
  loadCuratedQuestions,
  loadDifficulty,
  loadLastTopic,
  loadProgress,
  loadQuestionMode,
  loadScoreboard,
  progress,
  state,
} from './state.js';
import {
  bindEvents,
  nextQuestion,
  populateTopicPicker,
  showTopicPicker,
  updateDifficultyButtons,
  updateQuestionModeButtons,
  updateScoreboard,
} from './ui.js';
import { ErrorHandler, ToastManager } from './utils.js';

async function init() {
  // Show loading state
  document.body.classList.add('loading');

  // Initialize toast notification system
  ToastManager.init();

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

  const missing = [];
  const invalid = [];

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
  loadScoreboard();

  // Update UI to reflect loaded state
  updateDifficultyButtons();
  updateQuestionModeButtons();
  updateScoreboard();
  await populateTopicPicker();
  bindEvents();

  // Show the UI now that preferences are loaded
  const controls = document.querySelector('.controls');
  const board = document.querySelector('.board');
  if (controls) {
    controls.style.opacity = '1';
  }
  if (board) {
    board.style.opacity = '1';
  }

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

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
