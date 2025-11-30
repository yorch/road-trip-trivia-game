// UI rendering and DOM manipulation for Road Trip Trivia

import {
  state,
  progress,
  getCuratedCountsCache,
  setCuratedCountsCache,
  resetCuratedCountsCache,
  saveLastTopic,
  saveDifficulty,
  saveQuestionMode,
  saveProgress,
  saveScoreboard,
  getProgress,
  getOrCreateQuestions,
  rebuildQuestionBank,
  resetProgressAll
} from './state.js';

import {
  QUESTION_MODES,
  SEARCH_DEBOUNCE_MS,
  RELOAD_SUCCESS_DISPLAY_MS,
  MAX_SEED_VALUE,
  ErrorHandler,
  escapeHtml,
  shuffleIndices
} from './utils.js';

// Update scoreboard display
export function updateScoreboard() {
  document.getElementById("scoreValue").textContent = state.score;
  document.getElementById("streakValue").textContent = state.streak;
  document.getElementById("askedValue").textContent = state.asked;
  saveScoreboard();
}

// Update difficulty buttons
export function updateDifficultyButtons() {
  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === state.difficulty);
  });
}

// Update question mode buttons
export function updateQuestionModeButtons() {
  document.querySelectorAll(".question-mode").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === state.questionMode);
  });
}

// Render end state (no questions or all used up)
export function renderEndState(title, message) {
  const cardEl = document.querySelector(".card");
  const nextEl = document.querySelector(".next");
  const answerEl = document.getElementById("cardAnswer");

  cardEl.classList.add("card-complete");
  nextEl.style.display = "none";
  answerEl.classList.remove("visible");

  document.getElementById("cardTitle").textContent = title;
  document.getElementById("cardBody").textContent = message;
}

// Render a question card
export function renderCard(question) {
  const topic = window.topicList.find((t) => t.id === state.topicId);

  // Safety check: if topic not found, reset to first topic
  if (!topic) {
    ErrorHandler.warn(`Topic ${state.topicId} not found, attempting recovery`);

    // Attempt recovery by resetting to first available topic
    state.topicId = window.topicList[0]?.id || null;

    if (!state.topicId) {
      // Critical failure: no topics available at all
      ErrorHandler.critical("No topics available - cannot render question");
      renderEndState(
        "No Topics Available",
        "The topic list is empty. Please check data.js and refresh the page."
      );
      return;
    }

    // Successfully recovered - save and continue
    saveLastTopic(state.topicId);
    nextQuestion();
    return;
  }

  const cardEl = document.querySelector(".card");
  const nextEl = document.querySelector(".next");

  // Remove end-state class and show next button for regular questions
  cardEl.classList.remove("card-complete");
  nextEl.style.display = "flex";

  document.getElementById("cardTopic").textContent = `${topic.name} • ${topic.category}`;
  document.getElementById("cardDifficulty").textContent = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
  document.getElementById("cardTitle").textContent = question.prompt;
  document.getElementById("cardMeta").textContent = `Angle: ${question.angle}`;
  document.getElementById("cardBody").textContent = "Give a short, precise answer, then reveal.";
  document.getElementById("answerText").textContent = question.answer;
  toggleAnswer(false);
}

// Get next question
export function nextQuestion() {
  const prog = getProgress(state.topicId, state.difficulty);
  // Lazy load: get or create questions for current topic/difficulty/mode
  const bank = getOrCreateQuestions(state.topicId, state.difficulty, state.questionMode);

  // Check if topic has no questions in current mode
  if (!bank || bank.length === 0) {
    renderEndState(
      "No curated questions available!",
      "This topic doesn't have curated questions yet. Switch to 'All questions' mode."
    );
    return;
  }

  if (prog.cursor >= bank.length) {
    renderEndState(
      "All questions used up!",
      "Reset progress or switch difficulty to keep rolling."
    );
    return;
  }

  const idx = prog.order[prog.cursor];

  // Validate index is within bounds (can be invalid after mode switch)
  if (idx >= bank.length) {
    ErrorHandler.warn(
      `Invalid question index ${idx} for bank size ${bank.length}. Progress reset for current topic.`
    );

    // Reset progress for this topic/difficulty
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    prog.order = shuffleIndices(bank.length, seed);
    prog.cursor = 0;
    saveProgress();

    // Notify user about the reset
    ErrorHandler.info("Question bank changed - progress reset for this topic");

    // Retry with reset progress
    nextQuestion();
    return;
  }

  prog.cursor += 1;
  state.asked += 1;
  state.revealed = false;
  saveProgress();
  updateScoreboard();
  renderCard(bank[idx]);
}

// Toggle answer visibility
export function toggleAnswer(forceVisible) {
  const answerEl = document.getElementById("cardAnswer");
  const show = typeof forceVisible === "boolean" ? forceVisible : !state.revealed;
  state.revealed = show;
  answerEl.classList.toggle("visible", show);
  document.getElementById("toggleAnswer").textContent = show ? "Hide answer" : "Show answer";
}

// Mark answer as correct
export function markCorrect() {
  state.score += 1;
  state.streak += 1;
  updateScoreboard();
  nextQuestion();
}

// Skip question
export function skipQuestion() {
  state.streak = 0;
  updateScoreboard();
  nextQuestion();
}

// Reset progress
export function resetProgress() {
  resetProgressAll();
  updateScoreboard();
  nextQuestion();
}

// Populate topic picker
export function populateTopicPicker(filterMode = 'all') {
  const container = document.getElementById("topicPickerContent");
  const categories = [...new Set(window.topicList.map((t) => t.category))].sort();

  // Use global cache for curated counts - only recalculate if cache is null
  let curatedCounts = getCuratedCountsCache();

  if (!curatedCounts) {
    curatedCounts = new Map();
    window.topicList.forEach(topic => {
      // Safety check: ensure curatedQuestions exists
      let count = 0;
      if (typeof window.curatedQuestions !== 'undefined' && window.curatedQuestions[topic.id]) {
        const easy = window.curatedQuestions[topic.id].easy?.length || 0;
        const medium = window.curatedQuestions[topic.id].medium?.length || 0;
        const hard = window.curatedQuestions[topic.id].hard?.length || 0;
        count = easy + medium + hard;
      }
      curatedCounts.set(topic.id, count);
    });
    // Update the global cache
    setCuratedCountsCache(curatedCounts);
  }

  container.innerHTML = categories.map((category) => {
    let categoryTopics = window.topicList.filter((t) => t.category === category);

    // Filter by curated if needed (using cached counts)
    if (filterMode === 'curated') {
      categoryTopics = categoryTopics.filter(t => curatedCounts.get(t.id) > 0);
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
          ${categoryTopics.map((topic) => {
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
                  ${topic.tags.slice(0, 3).map((tag) => `<span class="topic-tag">${escapeHtml(tag)}</span>`).join("")}
                </div>
              </div>
            `;
    }).join("")}
        </div>
      </div>
    `;
  }).join("");

  // Note: Click handlers are set up once via event delegation in bindEvents()
}

// Select topic and start
export function selectTopicAndStart(topicId) {
  state.topicId = topicId;
  state.streak = 0;
  updateScoreboard();
  saveLastTopic(topicId);
  hideTopicPicker();
  nextQuestion();
}

// Show topic picker
export function showTopicPicker() {
  document.getElementById("topicPicker").classList.remove("hidden");
}

// Hide topic picker
export function hideTopicPicker() {
  document.getElementById("topicPicker").classList.add("hidden");
}

// Handle topic search
export function handleTopicSearch(searchTerm) {
  const term = searchTerm.toLowerCase();
  const allCards = document.querySelectorAll(".topic-card");
  const allCategories = document.querySelectorAll(".topic-category");

  allCards.forEach((card) => {
    const topicName = card.dataset.topicName;
    const matches = topicName.includes(term);
    card.classList.toggle("hidden", !matches);
  });

  // Hide categories with no visible topics
  allCategories.forEach((category) => {
    const visibleCards = category.querySelectorAll(".topic-card:not(.hidden)");
    category.style.display = visibleCards.length > 0 ? "block" : "none";
  });
}

// Bind all event listeners
export function bindEvents() {
  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Prevent race conditions from rapid clicking
      if (state.isChangingMode) {
        ErrorHandler.info("Please wait for current operation to complete");
        return;
      }

      state.isChangingMode = true;
      state.difficulty = btn.dataset.difficulty;
      state.streak = 0;
      saveDifficulty(state.difficulty);
      updateDifficultyButtons();
      updateScoreboard();
      nextQuestion();
      // Reset flag after a brief delay to allow nextQuestion to complete
      setTimeout(() => { state.isChangingMode = false; }, 100);
    });
  });

  document.querySelectorAll(".question-mode").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Prevent race conditions from rapid clicking
      if (state.isChangingMode) {
        ErrorHandler.info("Please wait for current operation to complete");
        return;
      }

      state.isChangingMode = true;
      state.questionMode = btn.dataset.mode;
      state.streak = 0;
      saveQuestionMode(state.questionMode);
      updateQuestionModeButtons();
      rebuildQuestionBank();
      updateScoreboard();
      nextQuestion();
      // Reset flag after a brief delay to allow rebuild and nextQuestion to complete
      setTimeout(() => { state.isChangingMode = false; }, 100);
    });
  });

  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
  document.getElementById("toggleAnswer").addEventListener("click", () => toggleAnswer());
  document.getElementById("markCorrect").addEventListener("click", markCorrect);
  document.getElementById("skipQuestion").addEventListener("click", skipQuestion);
  document.getElementById("randomTopic").addEventListener("click", () => {
    const random = window.topicList[Math.floor(Math.random() * window.topicList.length)];
    state.topicId = random.id;
    state.streak = 0;
    saveLastTopic(random.id);
    updateScoreboard();
    nextQuestion();
  });
  document.getElementById("resetProgress").addEventListener("click", () => {
    if (confirm("Reset all progress? This will clear your score, streak, and question history for all topics. This cannot be undone.")) {
      resetProgress();
    }
  });

  // Topic picker events
  document.getElementById("chooseTopic").addEventListener("click", showTopicPicker);
  document.getElementById("closePicker").addEventListener("click", hideTopicPicker);

  // Debounced search to avoid running on every keystroke
  let searchTimeout;
  document.getElementById("topicSearch").addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleTopicSearch(e.target.value);
    }, SEARCH_DEBOUNCE_MS);
  });

  // Event delegation for topic cards (prevents memory leaks from repeated repopulation)
  document.getElementById("topicPickerContent").addEventListener("click", (e) => {
    const card = e.target.closest(".topic-card");
    if (card) {
      const topicId = card.dataset.topicId;
      selectTopicAndStart(topicId);
    }
  });

  // Filter button events
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Repopulate with filter
      const filterMode = btn.dataset.filter;
      populateTopicPicker(filterMode);
    });
  });

  // Reload curated questions button
  document.getElementById("reloadCurated").addEventListener("click", async () => {
    const btn = document.getElementById("reloadCurated");
    const originalText = btn.textContent;
    btn.textContent = "Loading...";
    btn.disabled = true;

    try {
      // Reload the curated-questions.json file (secure JSON format)
      const response = await fetch('../data/curated-questions.json?' + Date.now());
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse JSON safely - no code execution risk
      const data = await response.json();

      // Validate basic structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid curated questions format - expected object');
      }

      // Update global curatedQuestions variable
      window.curatedQuestions = data;

      // Clear cached curated counts to force recalculation
      resetCuratedCountsCache();

      // Repopulate the picker with updated data
      const activeBtn = document.querySelector(".filter-btn.active");
      const activeFilter = activeBtn?.dataset.filter || QUESTION_MODES.ALL;
      populateTopicPicker(activeFilter);

      // Rebuild question bank to incorporate new curated questions
      rebuildQuestionBank();

      // If currently playing in curated mode, refresh the current question
      if (state.topicId && state.questionMode === QUESTION_MODES.CURATED) {
        nextQuestion();
      }

      btn.textContent = "✓ Reloaded";
      ErrorHandler.success("Curated questions reloaded successfully");
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, RELOAD_SUCCESS_DISPLAY_MS);
    } catch (error) {
      ErrorHandler.critical("Failed to reload curated questions", error);
      btn.textContent = "✗ Failed";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, RELOAD_SUCCESS_DISPLAY_MS);
    }
  });
}
