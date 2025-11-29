// Road Trip Trivia: lightweight data generator with 50+ topics and 80+ questions per difficulty.
// Static data (difficulties, topicList, categoryAngles, promptTemplates, answerTemplates, answerExamples)
// is loaded from data.js

// Constants
const QUESTION_BANK_SIZE = 80;
const MAX_SEED_VALUE = 2147483647;
const SEARCH_DEBOUNCE_MS = 300;
const RELOAD_SUCCESS_DISPLAY_MS = 2000;

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

// Legacy function: Not used in production code (replaced by lazy loading via getOrCreateQuestions)
// Kept for manual debugging/testing - can be called from browser console to pre-generate all questions
function buildQuestionBank(mode = "all") {
  const bank = {};
  topicList.forEach((topic) => {
    bank[topic.id] = {};
    difficulties.forEach((diff) => {
      bank[topic.id][diff] = createQuestions(topic, diff, mode);
    });
  });
  return bank;
}

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

let progress = {};
const state = {
  topicId: null, // Will be set in init() or when user selects topic
  difficulty: "easy",
  questionMode: "all", // "all" or "curated"
  score: 0,
  streak: 0,
  asked: 0,
  revealed: false
};

// LocalStorage helpers
function saveLastTopic(topicId) {
  try {
    localStorage.setItem("lastTopicId", topicId);
  } catch (e) {
    // Ignore localStorage errors
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
    // Ignore localStorage errors
  }
}

function saveProgress() {
  try {
    localStorage.setItem("questionProgress", JSON.stringify(progress));
  } catch (e) {
    // Ignore localStorage errors
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
    // Ignore localStorage errors
  }
}

function saveQuestionMode(mode) {
  try {
    localStorage.setItem("questionMode", mode);
  } catch (e) {
    // Ignore localStorage errors
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
    // Ignore localStorage errors
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
    // Ignore localStorage errors
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

function renderCard(question) {
  const topic = topicList.find((t) => t.id === state.topicId);

  // Safety check: if topic not found, reset to first topic
  if (!topic) {
    console.error(`Topic ${state.topicId} not found, resetting to first topic`);
    state.topicId = topicList[0]?.id || null;
    if (!state.topicId) {
      console.error("No topics available");
      return;
    }
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
    const cardEl = document.querySelector(".card");
    const nextEl = document.querySelector(".next");
    const answerEl = document.getElementById("cardAnswer");
    cardEl.classList.add("card-complete");
    nextEl.style.display = "none";
    answerEl.classList.remove("visible");

    document.getElementById("cardTitle").textContent = "No curated questions available!";
    document.getElementById("cardBody").textContent = "This topic doesn't have curated questions yet. Switch to 'All questions' mode.";
    return;
  }

  if (prog.cursor >= bank.length) {
    const cardEl = document.querySelector(".card");
    const nextEl = document.querySelector(".next");
    const answerEl = document.getElementById("cardAnswer");
    cardEl.classList.add("card-complete");
    nextEl.style.display = "none";
    answerEl.classList.remove("visible");

    document.getElementById("cardTitle").textContent = "All questions used up!";
    document.getElementById("cardBody").textContent = "Reset progress or switch difficulty to keep rolling.";
    return;
  }

  const idx = prog.order[prog.cursor];

  // Validate index is within bounds (can be invalid after mode switch)
  if (idx >= bank.length) {
    console.warn(`Invalid question index ${idx} for bank size ${bank.length}. Resetting progress for this topic/difficulty.`);
    // Reset progress for this topic/difficulty
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    prog.order = shuffleIndices(bank.length, seed);
    prog.cursor = 0;
    saveProgress();
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

  // Helper function to count curated questions for a topic
  const getCuratedCount = (topicId) => {
    // Safety check: ensure curatedQuestions exists
    if (typeof curatedQuestions === 'undefined' || !curatedQuestions[topicId]) return 0;
    const easy = curatedQuestions[topicId].easy?.length || 0;
    const medium = curatedQuestions[topicId].medium?.length || 0;
    const hard = curatedQuestions[topicId].hard?.length || 0;
    return easy + medium + hard;
  };

  // Cache curated counts for all topics to avoid redundant calculations
  const curatedCounts = new Map();
  topicList.forEach(topic => {
    curatedCounts.set(topic.id, getCuratedCount(topic.id));
  });

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
      state.difficulty = btn.dataset.difficulty;
      state.streak = 0;
      saveDifficulty(state.difficulty);
      updateDifficultyButtons();
      updateScoreboard();
      nextQuestion();
    });
  });

  document.querySelectorAll(".question-mode").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.questionMode = btn.dataset.mode;
      state.streak = 0;
      saveQuestionMode(state.questionMode);
      updateQuestionModeButtons();
      rebuildQuestionBank();
      updateScoreboard();
      nextQuestion();
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
      const text = await response.text();

      // Execute the script to update curatedQuestions
      const script = document.createElement('script');
      script.textContent = text;
      document.body.appendChild(script);
      document.body.removeChild(script);

      // Repopulate the picker with updated data
      const activeBtn = document.querySelector(".filter-btn.active");
      const activeFilter = activeBtn?.dataset.filter || 'all';
      populateTopicPicker(activeFilter);

      // Rebuild question bank to incorporate new curated questions
      rebuildQuestionBank();

      // If currently playing in curated mode, refresh the current question
      if (state.topicId && state.questionMode === 'curated') {
        nextQuestion();
      }

      btn.textContent = "✓ Reloaded";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, RELOAD_SUCCESS_DISPLAY_MS);
    } catch (error) {
      console.error("Failed to reload curated questions:", error);
      btn.textContent = "✗ Failed";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, RELOAD_SUCCESS_DISPLAY_MS);
    }
  });
}

function init() {
  // Safety check: ensure data.js loaded correctly
  if (!topicList || topicList.length === 0) {
    console.error("Failed to load topic data. Please refresh the page.");
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
