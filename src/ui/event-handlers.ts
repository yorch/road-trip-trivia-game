// Event binding and handling
// Central event delegation and handler registration

import {
  rebuildQuestionBank,
  resetCuratedTopicIds,
  saveDifficulty,
  saveLastTopic,
  saveQuestionMode,
  state,
} from '../state';
import type { Difficulty, QuestionMode, Topic } from '../types';
import {
  ErrorHandler,
  MODE_CHANGE_DEBOUNCE_MS,
  QUESTION_MODES,
  RELOAD_SUCCESS_DISPLAY_MS,
} from '../utils';
import {
  setupCuratedListEvents,
  showCuratedListDialog,
} from './curated-list-dialog';
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

  // Setup curated list dialog events
  setupCuratedListEvents();

  // View curated list button
  const viewCuratedListBtn = document.getElementById('viewCuratedList');
  if (viewCuratedListBtn) {
    viewCuratedListBtn.addEventListener('click', showCuratedListDialog);
  }

  // Filter button events
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Repopulate with filter
      const filterMode = ((btn as HTMLElement).dataset.filter || 'quality') as
        | 'quality'
        | 'curated'
        | 'all';
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
        // Clear cached curated topic IDs to force reload from index
        resetCuratedTopicIds();

        // Repopulate the picker with updated data (will reload index)
        const activeBtn = document.querySelector(
          '.filter-btn.active',
        ) as HTMLElement;
        const activeFilter = (activeBtn?.dataset.filter || 'quality') as
          | 'quality'
          | 'curated'
          | 'all';
        await populateTopicPicker(activeFilter);

        // Rebuild question bank to incorporate new curated questions
        rebuildQuestionBank();

        // If currently playing in curated mode, refresh the current question
        if (state.topicId && state.questionMode === QUESTION_MODES.CURATED) {
          await nextQuestion();
        }

        btn.textContent = '✓ Reloaded';
        ErrorHandler.success('Curated questions index reloaded successfully');
        reloadButtonTimeout = window.setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          reloadButtonTimeout = null;
        }, RELOAD_SUCCESS_DISPLAY_MS);
      } catch (error) {
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
