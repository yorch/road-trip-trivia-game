// State management for Road Trip Trivia

import { type Signal, signal } from '@preact/signals-core';
import type {
  CuratedQuestions,
  Difficulty,
  Progress,
  ProgressData,
  Question,
  QuestionBank,
  QuestionMode,
  ScoreboardData,
  State,
  Topic,
} from '../types';
import {
  buildAngles,
  DIFFICULTY_LEVELS,
  ErrorHandler,
  fillTemplate,
  getCuratedQuestionsUrl,
  MAX_SEED_VALUE,
  QUESTION_MODES,
  shuffleIndices,
} from './utils';

// Reactive signals for scoreboard (automatically update UI)
export const scoreSignal: Signal<number> = signal(0);
export const streakSignal: Signal<number> = signal(0);
export const askedSignal: Signal<number> = signal(0);

// Global state with reactive properties
export const state: State = {
  topicId: null,
  difficulty: DIFFICULTY_LEVELS.EASY,
  questionMode: QUESTION_MODES.ALL,
  // Use getters/setters to sync with signals for backward compatibility
  get score(): number {
    return scoreSignal.value;
  },
  set score(val: number) {
    scoreSignal.value = val;
  },
  get streak(): number {
    return streakSignal.value;
  },
  set streak(val: number) {
    streakSignal.value = val;
  },
  get asked(): number {
    return askedSignal.value;
  },
  set asked(val: number) {
    askedSignal.value = val;
  },
  revealed: false,
};

// Progress tracking
export const progress: ProgressData = {};

// Question bank storage
export let questionBank: QuestionBank = {};

// Global cache for curated question counts
let _globalCuratedCounts: Map<string, number> | null = null;
let _calculationPromise: Promise<Map<string, number>> | null = null;

export function getCuratedCountsCache(): Map<string, number> | null {
  return _globalCuratedCounts;
}

export function setCuratedCountsCache(cache: Map<string, number>): void {
  _globalCuratedCounts = cache;
}

export function resetCuratedCountsCache(): void {
  _globalCuratedCounts = null;
  _calculationPromise = null;
}

// Atomic operation to get or calculate curated counts
export async function getOrCalculateCuratedCounts(): Promise<
  Map<string, number>
> {
  // Return cached value if available
  if (_globalCuratedCounts) {
    return _globalCuratedCounts;
  }

  // If calculation in progress, wait for it
  if (_calculationPromise) {
    return _calculationPromise;
  }

  // Start new calculation
  _calculationPromise = (async (): Promise<Map<string, number>> => {
    try {
      const curatedCounts = new Map<string, number>();

      window.topicList.forEach((topic: Topic) => {
        let count = 0;
        if (
          typeof window.curatedQuestions !== 'undefined' &&
          window.curatedQuestions[topic.id]
        ) {
          const easy = window.curatedQuestions[topic.id].easy?.length || 0;
          const medium = window.curatedQuestions[topic.id].medium?.length || 0;
          const hard = window.curatedQuestions[topic.id].hard?.length || 0;
          count = easy + medium + hard;
        }
        curatedCounts.set(topic.id, count);
      });

      _globalCuratedCounts = curatedCounts;
      return curatedCounts;
    } catch (error) {
      ErrorHandler.warn('Failed to calculate curated counts', error);
      _globalCuratedCounts = new Map();
      return _globalCuratedCounts;
    } finally {
      _calculationPromise = null;
    }
  })();

  return _calculationPromise;
}

export const globalCuratedCounts = {
  get value(): Map<string, number> | null {
    return _globalCuratedCounts;
  },
  set value(val: Map<string, number> | null) {
    _globalCuratedCounts = val;
  },
};

// LocalStorage helpers
export function saveLastTopic(topicId: string): void {
  try {
    localStorage.setItem('lastTopicId', topicId);
  } catch (e) {
    ErrorHandler.warn('Failed to save last topic to localStorage', e);
  }
}

export function loadLastTopic(): string | null {
  try {
    return localStorage.getItem('lastTopicId');
  } catch (_e) {
    return null;
  }
}

export function clearLastTopic(): void {
  try {
    localStorage.removeItem('lastTopicId');
  } catch (e) {
    ErrorHandler.warn('Failed to clear last topic from localStorage', e);
  }
}

export function saveProgress(): void {
  try {
    localStorage.setItem('questionProgress', JSON.stringify(progress));
  } catch (e) {
    ErrorHandler.warn(
      'Failed to save progress - your progress may not be preserved',
      e,
    );
  }
}

export function loadProgress(): ProgressData {
  try {
    const saved = localStorage.getItem('questionProgress');
    const loaded: ProgressData = saved ? JSON.parse(saved) : {};

    // Validate and clean progress - remove topics that no longer exist
    const validTopicIds = new Set(window.topicList.map((t: Topic) => t.id));
    Object.keys(loaded).forEach((topicId) => {
      if (!validTopicIds.has(topicId)) {
        delete loaded[topicId];
      }
    });

    return loaded;
  } catch (_e) {
    return {};
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem('questionProgress');
  } catch (e) {
    ErrorHandler.warn('Failed to clear progress from localStorage', e);
  }
}

export function saveQuestionMode(mode: QuestionMode): void {
  try {
    localStorage.setItem('questionMode', mode);
  } catch (e) {
    ErrorHandler.warn('Failed to save question mode preference', e);
  }
}

export function loadQuestionMode(): QuestionMode {
  try {
    const saved = localStorage.getItem('questionMode');
    const validModes: QuestionMode[] = [
      QUESTION_MODES.ALL,
      QUESTION_MODES.CURATED,
    ];
    return validModes.includes(saved as QuestionMode)
      ? (saved as QuestionMode)
      : QUESTION_MODES.ALL;
  } catch (_e) {
    return QUESTION_MODES.ALL;
  }
}

export function saveDifficulty(difficulty: Difficulty): void {
  try {
    localStorage.setItem('difficulty', difficulty);
  } catch (e) {
    ErrorHandler.warn('Failed to save difficulty preference', e);
  }
}

export function loadDifficulty(): Difficulty {
  try {
    const saved = localStorage.getItem('difficulty');
    return window.difficulties.includes(saved)
      ? (saved as Difficulty)
      : DIFFICULTY_LEVELS.EASY;
  } catch (_e) {
    return DIFFICULTY_LEVELS.EASY;
  }
}

export function loadScoreboard(): void {
  try {
    const saved = localStorage.getItem('scoreboard');
    if (saved) {
      const data: ScoreboardData = JSON.parse(saved);
      state.score = data.score || 0;
      state.streak = data.streak || 0;
      state.asked = data.asked || 0;
    }
  } catch (_e) {
    // Ignore localStorage errors
  }
}

// Get or create progress for a topic/difficulty
export function getProgress(topicId: string, difficulty: Difficulty): Progress {
  if (!progress[topicId]) progress[topicId] = {};
  if (!progress[topicId][difficulty]) {
    // Lazy load: create questions only when needed
    const bank = getOrCreateQuestions(topicId, difficulty, state.questionMode);
    const bankSize = bank.length;
    if (bankSize === 0) {
      return { order: [], cursor: 0 };
    }
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    progress[topicId][difficulty] = {
      order: shuffleIndices(bankSize, seed),
      cursor: 0,
    };
    saveProgress();
  }

  const prog = progress[topicId][difficulty];

  // Detect empty progress and rebuild if questions now available
  if (prog.order.length === 0) {
    const bank = getOrCreateQuestions(topicId, difficulty, state.questionMode);
    if (bank.length > 0) {
      // Questions available now, rebuild progress
      const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
      prog.order = shuffleIndices(bank.length, seed);
      prog.cursor = 0;
      saveProgress();
    }
  }

  // Handle lazy reshuffle from mode changes
  if (prog.needsReshuffle) {
    const bank = getOrCreateQuestions(topicId, difficulty, state.questionMode);
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    const newOrder = shuffleIndices(bank.length, seed);
    // Preserve cursor position if possible, otherwise reset
    prog.order = newOrder;
    if (prog.cursor >= newOrder.length) {
      prog.cursor = 0; // Reset only if cursor is out of bounds
    }
    delete prog.needsReshuffle;
    saveProgress();
  }

  return prog;
}

// Reset progress for all topics
export function resetProgressAll(): void {
  // Safety check: ensure difficulties are loaded
  if (!window.difficulties || !Array.isArray(window.difficulties)) {
    ErrorHandler.critical('Difficulties not loaded - cannot reset progress');
    return;
  }

  // Don't pre-generate questions during reset - just mark for lazy reshuffle
  Object.keys(progress).forEach((topicId) => {
    window.difficulties.forEach((diff: Difficulty) => {
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
export function getOrCreateQuestions(
  topicId: string,
  difficulty: Difficulty,
  mode: QuestionMode,
): Question[] {
  // Ensure topic exists in question bank
  if (!questionBank[topicId]) {
    questionBank[topicId] = {};
  }

  // Include mode in cache key to prevent stale cached questions after mode switch
  const cacheKey = `${difficulty}_${mode}`;

  // Lazily create questions for this difficulty and mode if not already created
  if (!questionBank[topicId][cacheKey]) {
    const topic = window.topicList.find((t: Topic) => t.id === topicId);
    if (topic) {
      questionBank[topicId][cacheKey] = createQuestions(
        topic,
        difficulty,
        mode,
      );
    } else {
      console.warn(`Topic ${topicId} not found, returning empty question bank`);
      questionBank[topicId][cacheKey] = [];
    }
  }

  return questionBank[topicId][cacheKey];
}

// Create questions for a topic
function createQuestions(
  topic: Topic,
  difficulty: Difficulty,
  mode: QuestionMode = QUESTION_MODES.ALL,
): Question[] {
  const prompts = window.promptTemplates[difficulty];
  const answers = window.answerTemplates[difficulty];
  const allAngles = buildAngles(topic);
  const bank: Question[] = [];

  // Get curated questions if available (with safety check for curatedQuestions global)
  const curated =
    (typeof window.curatedQuestions !== 'undefined' &&
      window.curatedQuestions[topic.id]?.[difficulty]) ||
    [];
  const examples = window.answerExamples[topic.id] || {};

  // If curated-only mode and no curated questions exist, return empty
  if (mode === QUESTION_MODES.CURATED && curated.length === 0) {
    return [];
  }

  // Add curated questions first
  curated.forEach((cq: CuratedQuestion) => {
    bank.push({ prompt: cq.q, answer: cq.a, angle: cq.angle, difficulty });
  });

  // If curated-only mode, return only curated questions
  if (mode === QUESTION_MODES.CURATED) {
    return bank;
  }

  // For "all" mode, fill remaining slots with generated questions
  // Filter to only use angles that have real answer examples
  const anglesWithExamples = allAngles.filter(
    (angle) => examples[angle] && examples[angle].length > 0,
  );

  // Use filtered angles if available, otherwise fall back to all angles
  const angles = anglesWithExamples.length > 0 ? anglesWithExamples : allAngles;

  // Fill remaining slots with generated questions
  const remaining = 80 - curated.length; // QUESTION_BANK_SIZE
  for (let i = 0; i < remaining; i += 1) {
    const angle = angles[i % angles.length];
    const prompt = fillTemplate(
      prompts[i % prompts.length],
      topic.name,
      angle,
      i,
    );

    // Use real answer examples if available for this angle
    let answer: string;
    if (examples[angle] && examples[angle].length > 0) {
      answer = examples[angle][i % examples[angle].length];
    } else {
      answer = fillTemplate(answers[i % answers.length], topic.name, angle, i);
    }

    bank.push({ prompt, answer, angle, difficulty });
  }

  return bank;
}

// Rebuild question bank (clears cache)
export function rebuildQuestionBank(): void {
  // Clear question bank - questions will be lazily regenerated with new mode
  questionBank = {};
  // Mark current topic's progress for reshuffle instead of deleting
  // This preserves the cursor position so users don't restart at question #1
  if (state.topicId && progress[state.topicId]) {
    Object.keys(progress[state.topicId]).forEach((difficulty) => {
      if (state.topicId) {
        progress[state.topicId][difficulty].needsReshuffle = true;
      }
      // Don't reset cursor - let user continue from same position
    });
  }
  saveProgress();
}

// AbortController for fetch requests
let curatedQuestionsController: AbortController | null = null;

// Load curated questions from JSON
// Returns true if successful, false if failed
export async function loadCuratedQuestions(): Promise<boolean> {
  try {
    // Cancel previous request if exists
    if (curatedQuestionsController) {
      curatedQuestionsController.abort();
    }

    curatedQuestionsController = new AbortController();
    const response = await fetch(getCuratedQuestionsUrl(false), {
      signal: curatedQuestionsController.signal,
    });

    if (!response.ok) {
      ErrorHandler.warn(
        'Curated questions file not found - using generated questions only',
      );
      window.curatedQuestions = {};
      return false;
    }
    const data: CuratedQuestions = await response.json();
    window.curatedQuestions = data;
    return true;
  } catch (error) {
    // Ignore abort errors - they're expected when cancelling
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    ErrorHandler.warn(
      'Failed to load curated questions - using generated questions only',
      error instanceof Error ? error : new Error(String(error)),
    );
    window.curatedQuestions = {};
    return false;
  }
}
