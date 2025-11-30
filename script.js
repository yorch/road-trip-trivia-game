// Road Trip Trivia: lightweight data generator with 50+ topics and 80+ questions per difficulty.
// Static data (difficulties, topicList, categoryAngles, promptTemplates, answerTemplates, answerExamples)
// is loaded from data.js

// Constants
const QUESTION_BANK_SIZE = 80;
const MAX_SEED_VALUE = 2147483647; // 2^31-1, maximum value for linear congruential generator
const SEARCH_DEBOUNCE_MS = 300;
const RELOAD_SUCCESS_DISPLAY_MS = 2000;

// Question modes
const QUESTION_MODES = Object.freeze({
  ALL: 'all',
  CURATED: 'curated'
});

// Difficulty levels
const DIFFICULTY_LEVELS = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
});

// Error handling system
const ErrorHandler = {
  critical(msg, error) {
    console.error(`[CRITICAL] ${msg}`, error);
    this.showNotification(msg, 'error');
  },
  warn(msg, error) {
    console.warn(`[WARNING] ${msg}`, error);
    this.showNotification(msg, 'warning');
  },
  info(msg) {
    console.log(`[INFO] ${msg}`);
    this.showNotification(msg, 'info');
  },
  showNotification(message, type) {
    // Simple notification system - could be enhanced with toast UI
    if (type === 'error' || type === 'critical') {
      alert(`Error: ${message}`);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
};

// Security: HTML escaping helper to prevent XSS
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function buildAngles(topic) {
  const base = categoryAngles[topic.category] || [];
  const general = ["origin", "favorite", "legend", "rival", "surprise", "underdog"];
  return [...new Set([...topic.tags, ...base, ...general])];
}

function fillTemplate(template, topicName, angle, index) {
  return template
    .replaceAll("{topic}", topicName)
    .replaceAll("{angle}", angle)
    .replaceAll("{n}", index + 1);
}

function createQuestions(topic, difficulty, mode = "all") {
  const prompts = promptTemplates[difficulty];
  const answers = answerTemplates[difficulty];
  const allAngles = buildAngles(topic);
  const bank = [];

  // Get curated questions if available (with safety check for curatedQuestions global)
  const curated = (typeof curatedQuestions !== 'undefined' && curatedQuestions[topic.id]?.[difficulty]) || [];
  const examples = answerExamples[topic.id] || {};

  // If curated-only mode and no curated questions exist, return empty
  if (mode === "curated" && curated.length === 0) {
    return [];
  }

  // Add curated questions first
  curated.forEach((cq) => {
    bank.push({ prompt: cq.q, answer: cq.a, angle: cq.angle });
  });

  // If curated-only mode, return only curated questions
  if (mode === "curated") {
    return bank;
  }

  // For "all" mode, fill remaining slots with generated questions
  // Filter to only use angles that have real answer examples
  const anglesWithExamples = allAngles.filter(angle => examples[angle] && examples[angle].length > 0);

  // Use filtered angles if available, otherwise fall back to all angles
  const angles = anglesWithExamples.length > 0 ? anglesWithExamples : allAngles;

  // Fill remaining slots with generated questions
  const remaining = QUESTION_BANK_SIZE - curated.length;
  for (let i = 0; i < remaining; i += 1) {
    const angle = angles[i % angles.length];
    const prompt = fillTemplate(prompts[i % prompts.length], topic.name, angle, i);

    // Use real answer examples if available for this angle
    let answer;
    if (examples[angle] && examples[angle].length > 0) {
      answer = examples[angle][i % examples[angle].length];
    } else {
      answer = fillTemplate(answers[i % answers.length], topic.name, angle, i);
    }

    bank.push({ prompt, answer, angle });
  }

  return bank;
}

// Removed legacy buildQuestionBank() function - use getOrCreateQuestions() for lazy loading
// For debugging, call: getOrCreateQuestions(topicId, difficulty, mode) from browser console

// Lazy loading: Only generate questions when needed for a specific topic/difficulty/mode
function getOrCreateQuestions(topicId, difficulty, mode) {
  // Ensure topic exists in question bank
  if (!questionBank[topicId]) {
    questionBank[topicId] = {};
  }

  // Include mode in cache key to prevent stale cached questions after mode switch
  const cacheKey = `${difficulty}_${mode}`;

  // Lazily create questions for this difficulty and mode if not already created
  if (!questionBank[topicId][cacheKey]) {
    const topic = topicList.find(t => t.id === topicId);
    if (topic) {
      questionBank[topicId][cacheKey] = createQuestions(topic, difficulty, mode);
    } else {
      console.warn(`Topic ${topicId} not found, returning empty question bank`);
      questionBank[topicId][cacheKey] = [];
    }
  }

  return questionBank[topicId][cacheKey];
}

// Question bank is built in init() after data loads
let questionBank;

// Global cache for curated question counts
let globalCuratedCounts = null;

let progress = {};
const state = {
  topicId: null, // Will be set in init() or when user selects topic
  difficulty: DIFFICULTY_LEVELS.EASY,
  questionMode: QUESTION_MODES.ALL,
  score: 0,
  streak: 0,
  asked: 0,
  revealed: false,
  isChangingMode: false // Flag to prevent race conditions during mode/difficulty changes
};

// LocalStorage helpers
function saveLastTopic(topicId) {
  try {
    localStorage.setItem("lastTopicId", topicId);
  } catch (e) {
    ErrorHandler.warn("Failed to save last topic to localStorage", e);
  }
}

function loadLastTopic() {
  try {
    return localStorage.getItem("lastTopicId");
  } catch (e) {
    return null;
  }
}

function clearLastTopic() {
  try {
    localStorage.removeItem("lastTopicId");
  } catch (e) {
    ErrorHandler.warn("Failed to clear last topic from localStorage", e);
  }
}

function saveProgress() {
  try {
    localStorage.setItem("questionProgress", JSON.stringify(progress));
  } catch (e) {
    ErrorHandler.warn("Failed to save progress - your progress may not be preserved", e);
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem("questionProgress");
    const loaded = saved ? JSON.parse(saved) : {};

    // Validate and clean progress - remove topics that no longer exist
    const validTopicIds = new Set(topicList.map(t => t.id));
    Object.keys(loaded).forEach(topicId => {
      if (!validTopicIds.has(topicId)) {
        delete loaded[topicId];
      }
    });

    return loaded;
  } catch (e) {
    return {};
  }
}

function clearProgress() {
  try {
    localStorage.removeItem("questionProgress");
  } catch (e) {
    ErrorHandler.warn("Failed to clear progress from localStorage", e);
  }
}

function saveQuestionMode(mode) {
  try {
    localStorage.setItem("questionMode", mode);
  } catch (e) {
    ErrorHandler.warn("Failed to save question mode preference", e);
  }
}

function loadQuestionMode() {
  try {
    const saved = localStorage.getItem("questionMode");
    const validModes = ['all', 'curated'];
    return validModes.includes(saved) ? saved : "all";
  } catch (e) {
    return "all";
  }
}

function saveDifficulty(difficulty) {
  try {
    localStorage.setItem("difficulty", difficulty);
  } catch (e) {
    ErrorHandler.warn("Failed to save difficulty preference", e);
  }
}

function loadDifficulty() {
  try {
    const saved = localStorage.getItem("difficulty");
    return difficulties.includes(saved) ? saved : "easy";
  } catch (e) {
    return "easy";
  }
}

function saveScoreboard() {
  try {
    localStorage.setItem("scoreboard", JSON.stringify({
      score: state.score,
      streak: state.streak,
      asked: state.asked
    }));
  } catch (e) {
    ErrorHandler.warn("Failed to save scoreboard - scores may not be preserved", e);
  }
}

function loadScoreboard() {
  try {
    const saved = localStorage.getItem("scoreboard");
    if (saved) {
      const data = JSON.parse(saved);
      state.score = data.score || 0;
      state.streak = data.streak || 0;
      state.asked = data.asked || 0;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
}

function shuffleIndices(length, seedBase = 1) {
  if (length === 0) return [];
  const arr = Array.from({ length }, (_, i) => i);
  let seed = seedBase;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 16807) % MAX_SEED_VALUE;
    const rand = seed / MAX_SEED_VALUE;
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getProgress(topicId, difficulty) {
  if (!progress[topicId]) progress[topicId] = {};
  if (!progress[topicId][difficulty]) {
    // Lazy load: create questions only when needed
    const bank = getOrCreateQuestions(topicId, difficulty, state.questionMode);
    const bankSize = bank.length;
    if (bankSize === 0) {
      return { order: [], cursor: 0 };
    }
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    progress[topicId][difficulty] = { order: shuffleIndices(bankSize, seed), cursor: 0 };
    saveProgress();
  }

  // Handle lazy reshuffle from resetProgress()
  const prog = progress[topicId][difficulty];
  if (prog.needsReshuffle) {
    const bank = getOrCreateQuestions(topicId, difficulty, state.questionMode);
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    prog.order = shuffleIndices(bank.length, seed);
    prog.cursor = 0;
    delete prog.needsReshuffle;
    saveProgress();
  }

  return prog;
}


function updateDifficultyButtons() {
  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === state.difficulty);
  });
}

function updateQuestionModeButtons() {
  document.querySelectorAll(".question-mode").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === state.questionMode);
  });
}

function rebuildQuestionBank() {
  // Clear question bank - questions will be lazily regenerated with new mode
  questionBank = {};
  // Only clear current topic's progress when switching modes
  // This preserves progress in other topics
  if (progress[state.topicId]) {
    delete progress[state.topicId];
  }
  saveProgress();
}

function updateScoreboard() {
  document.getElementById("scoreValue").textContent = state.score;
  document.getElementById("streakValue").textContent = state.streak;
  document.getElementById("askedValue").textContent = state.asked;
  saveScoreboard();
}

function renderEndState(title, message) {
  const cardEl = document.querySelector(".card");
  const nextEl = document.querySelector(".next");
  const answerEl = document.getElementById("cardAnswer");

  cardEl.classList.add("card-complete");
  nextEl.style.display = "none";
  answerEl.classList.remove("visible");

  document.getElementById("cardTitle").textContent = title;
  document.getElementById("cardBody").textContent = message;
}

function renderCard(question) {
  const topic = topicList.find((t) => t.id === state.topicId);

  // Safety check: if topic not found, reset to first topic
  if (!topic) {
    ErrorHandler.warn(`Topic ${state.topicId} not found, attempting recovery`);

    // Attempt recovery by resetting to first available topic
    state.topicId = topicList[0]?.id || null;

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

function nextQuestion() {
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

function toggleAnswer(forceVisible) {
  const answerEl = document.getElementById("cardAnswer");
  const show = typeof forceVisible === "boolean" ? forceVisible : !state.revealed;
  state.revealed = show;
  answerEl.classList.toggle("visible", show);
  document.getElementById("toggleAnswer").textContent = show ? "Hide answer" : "Show answer";
}

function markCorrect() {
  state.score += 1;
  state.streak += 1;
  updateScoreboard();
  nextQuestion();
}

function skipQuestion() {
  state.streak = 0;
  updateScoreboard();
  nextQuestion();
}

function resetProgress() {
  // Don't pre-generate questions during reset - just mark for lazy reshuffle
  Object.keys(progress).forEach((topicId) => {
    difficulties.forEach((diff) => {
      if (progress[topicId][diff]) {
        // Mark progress as needing reshuffle instead of generating questions now
        progress[topicId][diff].cursor = 0;
        progress[topicId][diff].needsReshuffle = true;
      }
    });
  });
  state.score = 0;
  state.streak = 0;
  state.asked = 0;
  saveProgress();
  updateScoreboard();
  nextQuestion();
}

function populateTopicPicker(filterMode = 'all') {
  const container = document.getElementById("topicPickerContent");
  const categories = [...new Set(topicList.map((t) => t.category))].sort();

  // Use global cache for curated counts - only recalculate if cache is null
  if (!globalCuratedCounts) {
    globalCuratedCounts = new Map();
    topicList.forEach(topic => {
      // Safety check: ensure curatedQuestions exists
      let count = 0;
      if (typeof curatedQuestions !== 'undefined' && curatedQuestions[topic.id]) {
        const easy = curatedQuestions[topic.id].easy?.length || 0;
        const medium = curatedQuestions[topic.id].medium?.length || 0;
        const hard = curatedQuestions[topic.id].hard?.length || 0;
        count = easy + medium + hard;
      }
      globalCuratedCounts.set(topic.id, count);
    });
  }

  const curatedCounts = globalCuratedCounts;

  container.innerHTML = categories.map((category) => {
    let categoryTopics = topicList.filter((t) => t.category === category);

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
      const curatedCount = curatedCounts.get(topic.id);
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

function selectTopicAndStart(topicId) {
  state.topicId = topicId;
  state.streak = 0;
  updateScoreboard();
  saveLastTopic(topicId);
  hideTopicPicker();
  nextQuestion();
}

function showTopicPicker() {
  document.getElementById("topicPicker").classList.remove("hidden");
}

function hideTopicPicker() {
  document.getElementById("topicPicker").classList.add("hidden");
}

function handleTopicSearch(searchTerm) {
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

function bindEvents() {
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
    const random = topicList[Math.floor(Math.random() * topicList.length)];
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
      // Reload the curated-questions.js file
      const response = await fetch('curated-questions.js?' + Date.now());
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const text = await response.text();

      // Security: Validate content before execution
      // Expected format: const curatedQuestions = {...};
      if (!text.includes('curatedQuestions') || text.includes('<script')) {
        throw new Error('Invalid curated questions file format');
      }

      // Execute in controlled context with error handling
      // Note: This still executes arbitrary code from curated-questions.js
      // For production, consider converting to JSON format instead
      try {
        const script = document.createElement('script');
        script.textContent = text;
        document.body.appendChild(script);
        document.body.removeChild(script);
      } catch (execError) {
        throw new Error(`Script execution failed: ${execError.message}`);
      }

      // Clear cached curated counts to force recalculation
      globalCuratedCounts = null;

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
      ErrorHandler.info("Curated questions reloaded successfully");
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

function init() {
  // Comprehensive validation: ensure all required data.js dependencies loaded correctly
  const requiredGlobals = [
    { name: 'topicList', type: 'array' },
    { name: 'difficulties', type: 'array' },
    { name: 'categoryAngles', type: 'object' },
    { name: 'promptTemplates', type: 'object' },
    { name: 'answerTemplates', type: 'object' },
    { name: 'answerExamples', type: 'object' }
  ];

  const missing = [];
  const invalid = [];

  requiredGlobals.forEach(({ name, type }) => {
    if (typeof window[name] === 'undefined') {
      missing.push(name);
    } else if (type === 'array' && !Array.isArray(window[name])) {
      invalid.push(`${name} (expected array)`);
    } else if (type === 'object' && (typeof window[name] !== 'object' || Array.isArray(window[name]))) {
      invalid.push(`${name} (expected object)`);
    } else if (type === 'array' && window[name].length === 0) {
      invalid.push(`${name} (empty array)`);
    }
  });

  if (missing.length > 0 || invalid.length > 0) {
    const errorMsg = [
      "Failed to load required data from data.js:",
      missing.length > 0 ? `  Missing: ${missing.join(', ')}` : null,
      invalid.length > 0 ? `  Invalid: ${invalid.join(', ')}` : null,
      "Please ensure data.js is loaded before script.js and refresh the page."
    ].filter(Boolean).join('\n');

    ErrorHandler.critical(errorMsg);
    return;
  }

  // Load saved preferences from localStorage
  progress = loadProgress();
  state.questionMode = loadQuestionMode();
  state.difficulty = loadDifficulty();
  loadScoreboard();

  // Initialize empty question bank - questions will be lazy loaded as needed
  questionBank = {};

  updateDifficultyButtons();
  updateQuestionModeButtons();
  updateScoreboard();
  populateTopicPicker();
  bindEvents();

  // Show the UI now that preferences are loaded
  const controls = document.querySelector(".controls");
  const board = document.querySelector(".board");
  if (controls) { controls.style.opacity = "1"; }
  if (board) { board.style.opacity = "1"; }

  // Check if there's a saved topic from last session
  const lastTopic = loadLastTopic();
  if (lastTopic && topicList.find((t) => t.id === lastTopic)) {
    // Resume with saved topic
    state.topicId = lastTopic;
    nextQuestion();
  } else {
    // First visit or invalid saved topic - show picker
    showTopicPicker();
  }
}

document.addEventListener("DOMContentLoaded", init);
