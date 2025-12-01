// Event binding and handling
// Central event delegation and handler registration

import type {
  CuratedQuestions,
  Difficulty,
  QuestionMode,
  Topic,
} from '../../types';
import {
  rebuildQuestionBank,
  resetCuratedCountsCache,
  saveDifficulty,
  saveLastTopic,
  saveQuestionMode,
  state,
} from '../state';
import {
  ErrorHandler,
  getCuratedQuestionsUrl,
  MODE_CHANGE_DEBOUNCE_MS,
  QUESTION_MODES,
  RELOAD_SUCCESS_DISPLAY_MS,
} from '../utils';
import {
  markCorrect,
  nextQuestion,
  resetProgress,
  skipQuestion,
  toggleAnswer,
} from './question-flow';
import { updateDifficultyButtons, updateQuestionModeButtons } from './renderer';
import {
  hideTopicPicker,
  populateTopicPicker,
  setupSearchHandler,
  setupTopicPickerEvents,
  showTopicPicker,
} from './topic-picker';

// AbortController for reload curated questions fetch
let reloadCuratedController: AbortController | null = null;

// Timeout for reload button state reset
let reloadButtonTimeout: number | null = null;

// Track last mode change for better debouncing
let lastModeChange: { type: string | null; timestamp: number } = {
  type: null,
  timestamp: 0,
};

// Bind all event listeners
export function bindEvents(): void {
  // Difficulty button handlers
  document.querySelectorAll('.difficulty').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Prevent race conditions from rapid clicking of same type
      const now = Date.now();
      if (
        lastModeChange.type === 'difficulty' &&
        now - lastModeChange.timestamp < MODE_CHANGE_DEBOUNCE_MS
      ) {
        ErrorHandler.info('Please wait for current operation to complete');
        return;
      }

      lastModeChange = { type: 'difficulty', timestamp: now };
      const difficulty = (btn as HTMLElement).dataset.difficulty as Difficulty;
      state.difficulty = difficulty;
      state.streak = 0;
      saveDifficulty(state.difficulty);
      updateDifficultyButtons();
      nextQuestion();
    });
  });

  // Question mode button handlers
  document.querySelectorAll('.question-mode').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Prevent race conditions from rapid clicking of same type
      const now = Date.now();
      if (
        lastModeChange.type === 'questionMode' &&
        now - lastModeChange.timestamp < MODE_CHANGE_DEBOUNCE_MS
      ) {
        ErrorHandler.info('Please wait for current operation to complete');
        return;
      }

      lastModeChange = { type: 'questionMode', timestamp: now };
      const mode = (btn as HTMLElement).dataset.mode as QuestionMode;
      state.questionMode = mode;
      state.streak = 0;
      saveQuestionMode(state.questionMode);
      updateQuestionModeButtons();
      rebuildQuestionBank();
      nextQuestion();
    });
  });

  // Question control buttons with null checks
  const nextQuestionBtn = document.getElementById('nextQuestion');
  const toggleAnswerBtn = document.getElementById('toggleAnswer');
  const markCorrectBtn = document.getElementById('markCorrect');
  const skipQuestionBtn = document.getElementById('skipQuestion');

  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', nextQuestion);
  } else {
    ErrorHandler.warn('Next question button not found in DOM');
  }

  if (toggleAnswerBtn) {
    toggleAnswerBtn.addEventListener('click', () => toggleAnswer());
  } else {
    ErrorHandler.warn('Toggle answer button not found in DOM');
  }

  if (markCorrectBtn) {
    markCorrectBtn.addEventListener('click', markCorrect);
  } else {
    ErrorHandler.warn('Mark correct button not found in DOM');
  }

  if (skipQuestionBtn) {
    skipQuestionBtn.addEventListener('click', skipQuestion);
  } else {
    ErrorHandler.warn('Skip question button not found in DOM');
  }

  // Random topic and reset progress buttons
  const randomTopicBtn = document.getElementById('randomTopic');
  if (randomTopicBtn) {
    randomTopicBtn.addEventListener('click', () => {
      const topicList = window.topicList as Topic[];
      const random = topicList[Math.floor(Math.random() * topicList.length)];
      state.topicId = random.id;
      state.streak = 0;
      saveLastTopic(random.id);
      nextQuestion();
    });
  }

  const resetProgressBtn = document.getElementById('resetProgress');
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (
        confirm(
          'Reset all progress? This will clear your score, streak, and question history for all topics. This cannot be undone.',
        )
      ) {
        resetProgress();
      }
    });
  }

  // Topic picker events
  const chooseTopicBtn = document.getElementById('chooseTopic');
  const closePickerBtn = document.getElementById('closePicker');

  if (chooseTopicBtn) {
    chooseTopicBtn.addEventListener('click', showTopicPicker);
  } else {
    ErrorHandler.warn('Choose topic button not found in DOM');
  }

  if (closePickerBtn) {
    closePickerBtn.addEventListener('click', hideTopicPicker);
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const picker = document.getElementById('topicPicker');
      if (picker && !picker.classList.contains('hidden')) {
        hideTopicPicker();
      }
    }
  });

  // Setup search handler from topic-picker module
  setupSearchHandler();

  // Setup topic picker click delegation from topic-picker module
  setupTopicPickerEvents();

  // Filter button events
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Repopulate with filter
      const filterMode = ((btn as HTMLElement).dataset.filter || 'all') as
        | 'all'
        | 'curated';
      populateTopicPicker(filterMode);
    });
  });

  // Reload curated questions button
  const reloadCuratedBtn = document.getElementById(
    'reloadCurated',
  ) as HTMLButtonElement;
  if (reloadCuratedBtn) {
    reloadCuratedBtn.addEventListener('click', async () => {
      const btn = reloadCuratedBtn;
      const originalText = btn.textContent || '';
      btn.textContent = 'Loading...';
      btn.disabled = true;

      // Clear any pending timeout
      if (reloadButtonTimeout) {
        clearTimeout(reloadButtonTimeout);
        reloadButtonTimeout = null;
      }

      try {
        // Cancel previous request if exists
        if (reloadCuratedController) {
          reloadCuratedController.abort();
        }

        // Reload the curated-questions.json file (secure JSON format)
        reloadCuratedController = new AbortController();
        const response = await fetch(getCuratedQuestionsUrl(true), {
          signal: reloadCuratedController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse JSON safely - no code execution risk
        const data: CuratedQuestions = await response.json();

        // Validate basic structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid curated questions format - expected object');
        }

        // Update global curatedQuestions variable
        window.curatedQuestions = data;

        // Clear cached curated counts to force recalculation
        resetCuratedCountsCache();

        // Repopulate the picker with updated data
        const activeBtn = document.querySelector(
          '.filter-btn.active',
        ) as HTMLElement;
        const activeFilter = (activeBtn?.dataset.filter ||
          QUESTION_MODES.ALL) as 'all' | 'curated';
        populateTopicPicker(activeFilter);

        // Rebuild question bank to incorporate new curated questions
        rebuildQuestionBank();

        // If currently playing in curated mode, refresh the current question
        if (state.topicId && state.questionMode === QUESTION_MODES.CURATED) {
          nextQuestion();
        }

        btn.textContent = '✓ Reloaded';
        ErrorHandler.success('Curated questions reloaded successfully');
        reloadButtonTimeout = window.setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          reloadButtonTimeout = null;
        }, RELOAD_SUCCESS_DISPLAY_MS);
      } catch (error) {
        // Ignore abort errors - they're expected when cancelling
        if (error instanceof Error && error.name === 'AbortError') {
          btn.textContent = originalText;
          btn.disabled = false;
          return;
        }

        ErrorHandler.critical(
          'Failed to reload curated questions',
          error instanceof Error ? error : new Error(String(error)),
        );
        btn.textContent = '✗ Failed';
        reloadButtonTimeout = window.setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          reloadButtonTimeout = null;
        }, RELOAD_SUCCESS_DISPLAY_MS);
      }
    });
  }
}
