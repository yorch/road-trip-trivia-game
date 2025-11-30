// State management for Road Trip Trivia

import { DIFFICULTY_LEVELS, QUESTION_MODES, MAX_SEED_VALUE, ErrorHandler, shuffleIndices } from './utils.js';

// Global state
export const state = {
  topicId: null,
  difficulty: DIFFICULTY_LEVELS.EASY,
  questionMode: QUESTION_MODES.ALL,
  score: 0,
  streak: 0,
  asked: 0,
  revealed: false,
  isChangingMode: false
};

// Progress tracking
export let progress = {};

// Question bank storage
export let questionBank = {};

// Global cache for curated question counts
let _globalCuratedCounts = null;

export function getCuratedCountsCache() {
  return _globalCuratedCounts;
}

export function setCuratedCountsCache(cache) {
  _globalCuratedCounts = cache;
}

export function resetCuratedCountsCache() {
  _globalCuratedCounts = null;
}

export const globalCuratedCounts = {
  get value() { return _globalCuratedCounts; },
  set value(val) { _globalCuratedCounts = val; }
};

// LocalStorage helpers
export function saveLastTopic(topicId) {
  try {
    localStorage.setItem("lastTopicId", topicId);
  } catch (e) {
    ErrorHandler.warn("Failed to save last topic to localStorage", e);
  }
}

export function loadLastTopic() {
  try {
    return localStorage.getItem("lastTopicId");
  } catch (e) {
    return null;
  }
}

export function clearLastTopic() {
  try {
    localStorage.removeItem("lastTopicId");
  } catch (e) {
    ErrorHandler.warn("Failed to clear last topic from localStorage", e);
  }
}

export function saveProgress() {
  try {
    localStorage.setItem("questionProgress", JSON.stringify(progress));
  } catch (e) {
    ErrorHandler.warn("Failed to save progress - your progress may not be preserved", e);
  }
}

export function loadProgress() {
  try {
    const saved = localStorage.getItem("questionProgress");
    const loaded = saved ? JSON.parse(saved) : {};

    // Validate and clean progress - remove topics that no longer exist
    const validTopicIds = new Set(window.topicList.map(t => t.id));
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

export function clearProgress() {
  try {
    localStorage.removeItem("questionProgress");
  } catch (e) {
    ErrorHandler.warn("Failed to clear progress from localStorage", e);
  }
}

export function saveQuestionMode(mode) {
  try {
    localStorage.setItem("questionMode", mode);
  } catch (e) {
    ErrorHandler.warn("Failed to save question mode preference", e);
  }
}

export function loadQuestionMode() {
  try {
    const saved = localStorage.getItem("questionMode");
    const validModes = [QUESTION_MODES.ALL, QUESTION_MODES.CURATED];
    return validModes.includes(saved) ? saved : QUESTION_MODES.ALL;
  } catch (e) {
    return QUESTION_MODES.ALL;
  }
}

export function saveDifficulty(difficulty) {
  try {
    localStorage.setItem("difficulty", difficulty);
  } catch (e) {
    ErrorHandler.warn("Failed to save difficulty preference", e);
  }
}

export function loadDifficulty() {
  try {
    const saved = localStorage.getItem("difficulty");
    return window.difficulties.includes(saved) ? saved : DIFFICULTY_LEVELS.EASY;
  } catch (e) {
    return DIFFICULTY_LEVELS.EASY;
  }
}

export function saveScoreboard() {
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

export function loadScoreboard() {
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

// Get or create progress for a topic/difficulty
export function getProgress(topicId, difficulty) {
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

// Reset progress for all topics
export function resetProgressAll() {
  // Don't pre-generate questions during reset - just mark for lazy reshuffle
  Object.keys(progress).forEach((topicId) => {
    window.difficulties.forEach((diff) => {
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
}

// Lazy loading: Only generate questions when needed for a specific topic/difficulty/mode
export function getOrCreateQuestions(topicId, difficulty, mode) {
  // Ensure topic exists in question bank
  if (!questionBank[topicId]) {
    questionBank[topicId] = {};
  }

  // Include mode in cache key to prevent stale cached questions after mode switch
  const cacheKey = `${difficulty}_${mode}`;

  // Lazily create questions for this difficulty and mode if not already created
  if (!questionBank[topicId][cacheKey]) {
    const topic = window.topicList.find(t => t.id === topicId);
    if (topic) {
      questionBank[topicId][cacheKey] = createQuestions(topic, difficulty, mode);
    } else {
      console.warn(`Topic ${topicId} not found, returning empty question bank`);
      questionBank[topicId][cacheKey] = [];
    }
  }

  return questionBank[topicId][cacheKey];
}

// Create questions for a topic
function createQuestions(topic, difficulty, mode = QUESTION_MODES.ALL) {
  const prompts = window.promptTemplates[difficulty];
  const answers = window.answerTemplates[difficulty];
  const allAngles = buildAngles(topic);
  const bank = [];

  // Get curated questions if available (with safety check for curatedQuestions global)
  const curated = (typeof window.curatedQuestions !== 'undefined' && window.curatedQuestions[topic.id]?.[difficulty]) || [];
  const examples = window.answerExamples[topic.id] || {};

  // If curated-only mode and no curated questions exist, return empty
  if (mode === QUESTION_MODES.CURATED && curated.length === 0) {
    return [];
  }

  // Add curated questions first
  curated.forEach((cq) => {
    bank.push({ prompt: cq.q, answer: cq.a, angle: cq.angle });
  });

  // If curated-only mode, return only curated questions
  if (mode === QUESTION_MODES.CURATED) {
    return bank;
  }

  // For "all" mode, fill remaining slots with generated questions
  // Filter to only use angles that have real answer examples
  const anglesWithExamples = allAngles.filter(angle => examples[angle] && examples[angle].length > 0);

  // Use filtered angles if available, otherwise fall back to all angles
  const angles = anglesWithExamples.length > 0 ? anglesWithExamples : allAngles;

  // Fill remaining slots with generated questions
  const remaining = 80 - curated.length; // QUESTION_BANK_SIZE
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

// Import buildAngles and fillTemplate from utils (circular dependency handled)
import { buildAngles, fillTemplate } from './utils.js';

// Rebuild question bank (clears cache)
export function rebuildQuestionBank() {
  // Clear question bank - questions will be lazily regenerated with new mode
  questionBank = {};
  // Only clear current topic's progress when switching modes
  // This preserves progress in other topics
  if (progress[state.topicId]) {
    delete progress[state.topicId];
  }
  saveProgress();
}


// Load curated questions from JSON
export async function loadCuratedQuestions() {
  try {
    const response = await fetch('../data/curated-questions.json');
    if (!response.ok) {
      ErrorHandler.warn('Curated questions file not found - using generated questions only');
      window.curatedQuestions = {};
      return;
    }
    const data = await response.json();
    window.curatedQuestions = data;
  } catch (error) {
    ErrorHandler.warn('Failed to load curated questions - using generated questions only', error);
    window.curatedQuestions = {};
  }
}
