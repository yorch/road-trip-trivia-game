// UI rendering and DOM manipulation for Road Trip Trivia

import type {
  CuratedQuestions,
  Difficulty,
  Question,
  QuestionMode,
  Topic,
} from '../types';
import {
  getOrCalculateCuratedCounts,
  getOrCreateQuestions,
  getProgress,
  rebuildQuestionBank,
  resetCuratedCountsCache,
  resetProgressAll,
  saveDifficulty,
  saveLastTopic,
  saveProgress,
  saveQuestionMode,
  state,
} from './state';

import {
  ErrorHandler,
  escapeHtml,
  getCuratedQuestionsUrl,
  MAX_SEED_VALUE,
  MODE_CHANGE_DEBOUNCE_MS,
  QUESTION_MODES,
  RELOAD_SUCCESS_DISPLAY_MS,
  SEARCH_DEBOUNCE_MS,
  shuffleIndices,
} from './utils';

// AbortController for reload curated questions fetch
let reloadCuratedController: AbortController | null = null;

// Timeout for reload button state reset
let reloadButtonTimeout: number | null = null;

// WeakMap for element-specific search debounce timeouts
const searchTimeouts = new WeakMap<HTMLElement, number>();

// Track focus for modal accessibility
let previousFocus: Element | null = null;

// Track last mode change for better debouncing
let lastModeChange: { type: string | null; timestamp: number } = {
  type: null,
  timestamp: 0,
};

// Update difficulty buttons
export function updateDifficultyButtons(): void {
  document.querySelectorAll('.difficulty').forEach((btn) => {
    btn.classList.toggle(
      'active',
      (btn as HTMLElement).dataset.difficulty === state.difficulty,
    );
  });
}

// Update question mode buttons
export function updateQuestionModeButtons(): void {
  document.querySelectorAll('.question-mode').forEach((btn) => {
    btn.classList.toggle(
      'active',
      (btn as HTMLElement).dataset.mode === state.questionMode,
    );
  });
}

// Render end state (no questions or all used up)
export function renderEndState(title: string, message: string): void {
  const cardEl = document.querySelector('.card');
  const nextEl = document.querySelector('.next') as HTMLElement;
  const answerEl = document.getElementById('cardAnswer');

  if (cardEl) cardEl.classList.add('card-complete');
  if (nextEl) nextEl.style.display = 'none';
  if (answerEl) answerEl.classList.remove('visible');

  const cardTitle = document.getElementById('cardTitle');
  const cardBody = document.getElementById('cardBody');
  if (cardTitle) cardTitle.textContent = title;
  if (cardBody) cardBody.textContent = message;
}

// Render a question card
export function renderCard(question: Question): void {
  const topic = window.topicList.find((t: Topic) => t.id === state.topicId);

  // Safety check: if topic not found, reset to first topic
  if (!topic) {
    ErrorHandler.warn(`Topic ${state.topicId} not found, attempting recovery`);

    // Attempt recovery by resetting to first available topic
    state.topicId = window.topicList[0]?.id || null;

    if (!state.topicId) {
      // Critical failure: no topics available at all
      ErrorHandler.critical('No topics available - cannot render question');
      renderEndState(
        'No Topics Available',
        'The topic list is empty. Please check data.js and refresh the page.',
      );
      return;
    }

    // Successfully recovered - save and continue
    saveLastTopic(state.topicId);
    // Use setTimeout to break recursion chain and prevent stack overflow
    setTimeout(() => nextQuestion(), 0);
    return;
  }

  const cardEl = document.querySelector('.card');
  const nextEl = document.querySelector('.next') as HTMLElement;

  // Remove end-state class and show next button for regular questions
  if (cardEl) cardEl.classList.remove('card-complete');
  if (nextEl) nextEl.style.display = 'flex';

  const cardTopic = document.getElementById('cardTopic');
  const cardDifficulty = document.getElementById('cardDifficulty');
  const cardTitle = document.getElementById('cardTitle');
  const cardMeta = document.getElementById('cardMeta');
  const cardBody = document.getElementById('cardBody');
  const answerText = document.getElementById('answerText');

  if (cardTopic) cardTopic.textContent = `${topic.name} • ${topic.category}`;
  if (cardDifficulty)
    cardDifficulty.textContent =
      state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
  if (cardTitle) cardTitle.textContent = question.prompt;
  if (cardMeta) cardMeta.textContent = `Angle: ${question.angle}`;
  if (cardBody)
    cardBody.textContent = 'Give a short, precise answer, then reveal.';
  if (answerText) answerText.textContent = question.answer;
  toggleAnswer(false);
}

// Get next question
export function nextQuestion(): void {
  if (!state.topicId) {
    ErrorHandler.critical('No topic selected');
    return;
  }

  const prog = getProgress(state.topicId, state.difficulty);
  // Lazy load: get or create questions for current topic/difficulty/mode
  const bank = getOrCreateQuestions(
    state.topicId,
    state.difficulty,
    state.questionMode,
  );

  // Check if topic has no questions in current mode
  if (!bank || bank.length === 0) {
    renderEndState(
      'No curated questions available!',
      "This topic doesn't have curated questions yet. Switch to 'All questions' mode.",
    );
    return;
  }

  if (prog.cursor >= bank.length) {
    renderEndState(
      'All questions used up!',
      'Reset progress or switch difficulty to keep rolling.',
    );
    return;
  }

  const idx = prog.order[prog.cursor];

  // Validate index is within bounds (can be invalid after mode switch)
  if (idx >= bank.length) {
    ErrorHandler.warn(
      `Invalid question index ${idx} for bank size ${bank.length}. Progress reset for current topic.`,
    );

    // Reset progress for this topic/difficulty
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    prog.order = shuffleIndices(bank.length, seed);
    prog.cursor = 0;
    saveProgress();

    // Notify user about the reset
    ErrorHandler.info('Question bank changed - progress reset for this topic');

    // Use setTimeout to break recursion chain and prevent stack overflow
    setTimeout(() => nextQuestion(), 0);
    return;
  }

  prog.cursor += 1;
  state.asked += 1;
  state.revealed = false;
  saveProgress();
  renderCard(bank[idx]);
}

// Toggle answer visibility
export function toggleAnswer(forceVisible?: boolean): void {
  const answerEl = document.getElementById('cardAnswer');
  const show =
    typeof forceVisible === 'boolean' ? forceVisible : !state.revealed;
  state.revealed = show;
  if (answerEl) answerEl.classList.toggle('visible', show);

  const toggleAnswerBtn = document.getElementById('toggleAnswer');
  if (toggleAnswerBtn) {
    toggleAnswerBtn.textContent = show ? 'Hide answer' : 'Show answer';
  }
}

// Mark answer as correct
export function markCorrect(): void {
  state.score += 1;
  state.streak += 1;
  nextQuestion();
}

// Skip question
export function skipQuestion(): void {
  state.streak = 0;
  nextQuestion();
}

// Reset progress
export function resetProgress(): void {
  resetProgressAll();
  nextQuestion();
}

// Populate topic picker
export async function populateTopicPicker(
  filterMode: 'all' | 'curated' = 'all',
): Promise<void> {
  const container = document.getElementById('topicPickerContent');
  if (!container) return;

  const categories = [
    ...new Set(window.topicList.map((t: Topic) => t.category)),
  ].sort() as string[];

  // Use atomic cache operation to prevent race conditions
  const curatedCounts = await getOrCalculateCuratedCounts();

  container.innerHTML = categories
    .map((category: string) => {
      let categoryTopics = window.topicList.filter(
        (t: Topic) => t.category === category,
      );

      // Filter by curated if needed (using cached counts)
      if (filterMode === 'curated') {
        categoryTopics = categoryTopics.filter(
          (t: Topic) => (curatedCounts.get(t.id) || 0) > 0,
        );
      }

      // Skip empty categories
      if (categoryTopics.length === 0) return '';

      return `
      <div class="topic-category" data-category="${escapeHtml(category)}">
        <div class="topic-category-header">
          <h3>${escapeHtml(category)}</h3>
          <span class="topic-category-count">${categoryTopics.length}</span>
        </div>
        <div class="topic-grid">
          ${categoryTopics
            .map((topic: Topic) => {
              const curatedCount = curatedCounts.get(topic.id) || 0;
              const hasCurated = curatedCount > 0;
              return `
              <div class="topic-card"
                   data-topic-id="${escapeHtml(topic.id)}"
                   data-topic-name="${escapeHtml(topic.name.toLowerCase())}"
                   data-has-curated="${hasCurated}">
                <div class="topic-card-name">
                  ${escapeHtml(topic.name)}
                  ${hasCurated ? `<span class="curated-count">${curatedCount} curated</span>` : ''}
                </div>
                <div class="topic-card-tags">
                  ${topic.tags
                    .slice(0, 3)
                    .map(
                      (tag) =>
                        `<span class="topic-tag">${escapeHtml(tag)}</span>`,
                    )
                    .join('')}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
    })
    .join('');

  // Note: Click handlers are set up once via event delegation in bindEvents()
}

// Select topic and start
export function selectTopicAndStart(topicId: string): void {
  state.topicId = topicId;
  state.streak = 0;
  saveLastTopic(topicId);
  hideTopicPicker();
  nextQuestion();
}

// Focus trap for modal accessibility
function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;

  const modal = document.getElementById('topicPicker');
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  if (e.shiftKey && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

// Show topic picker
export function showTopicPicker(): void {
  previousFocus = document.activeElement;
  const modal = document.getElementById('topicPicker');
  if (modal) {
    modal.classList.remove('hidden');

    // Move focus to search input
    const searchInput = document.getElementById(
      'topicSearch',
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }

    // Add focus trap and escape key handler
    modal.addEventListener('keydown', trapFocus);
  }
}

// Hide topic picker
export function hideTopicPicker(): void {
  const modal = document.getElementById('topicPicker');

  // Clear search timeout if picker is being hidden
  const searchInput = document.getElementById('topicSearch');
  if (searchInput) {
    const existingTimeout = searchTimeouts.get(searchInput);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      searchTimeouts.delete(searchInput);
    }
  }

  if (modal) {
    modal.classList.add('hidden');
    modal.removeEventListener('keydown', trapFocus);
  }

  // Restore focus to element that opened modal
  if (previousFocus && 'focus' in previousFocus) {
    (previousFocus as HTMLElement).focus();
    previousFocus = null;
  }
}

// Handle topic search
export function handleTopicSearch(searchTerm: string): void {
  const term = searchTerm.toLowerCase();
  const allCards = document.querySelectorAll('.topic-card');
  const allCategories = document.querySelectorAll('.topic-category');

  allCards.forEach((card) => {
    const topicName = (card as HTMLElement).dataset.topicName || '';
    const matches = topicName.includes(term);
    card.classList.toggle('hidden', !matches);
  });

  // Hide categories with no visible topics
  allCategories.forEach((category) => {
    const visibleCards = category.querySelectorAll('.topic-card:not(.hidden)');
    (category as HTMLElement).style.display =
      visibleCards.length > 0 ? 'block' : 'none';
  });
}

// Bind all event listeners
export function bindEvents(): void {
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

  // Debounced search to avoid running on every keystroke
  const topicSearchInput = document.getElementById(
    'topicSearch',
  ) as HTMLInputElement;
  if (topicSearchInput) {
    topicSearchInput.addEventListener('input', (e) => {
      const element = e.target as HTMLInputElement;
      const existingTimeout = searchTimeouts.get(element);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = window.setTimeout(() => {
        handleTopicSearch(element.value);
      }, SEARCH_DEBOUNCE_MS);

      searchTimeouts.set(element, timeout);
    });
  }

  // Event delegation for topic cards (prevents memory leaks from repeated repopulation)
  const topicPickerContent = document.getElementById('topicPickerContent');
  if (topicPickerContent) {
    topicPickerContent.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest(
        '.topic-card',
      ) as HTMLElement;
      if (card) {
        const topicId = card.dataset.topicId;
        if (topicId) selectTopicAndStart(topicId);
      }
    });
  } else {
    ErrorHandler.warn('Topic picker content container not found in DOM');
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
