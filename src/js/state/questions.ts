// Question generation and banking
// Handles question creation from templates and curated sources

import type {
  CuratedQuestion,
  CuratedQuestions,
  Difficulty,
  Question,
  QuestionBank,
  QuestionMode,
  Topic,
} from '../../types';
import {
  buildAngles,
  ErrorHandler,
  fillTemplate,
  getCuratedQuestionsUrl,
  QUESTION_MODES,
} from '../utils';

// Question bank storage
export let questionBank: QuestionBank = {};

// AbortController for fetch requests
let curatedQuestionsController: AbortController | null = null;

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
export function rebuildQuestionBank(
  currentTopicId: string | null,
  currentProgress: Record<string, Record<string, { needsReshuffle?: boolean }>>,
): void {
  // Clear question bank - questions will be lazily regenerated with new mode
  questionBank = {};
  // Mark current topic's progress for reshuffle instead of deleting
  // This preserves the cursor position so users don't restart at question #1
  if (currentTopicId && currentProgress[currentTopicId]) {
    Object.keys(currentProgress[currentTopicId]).forEach((difficulty) => {
      if (currentTopicId) {
        currentProgress[currentTopicId][difficulty].needsReshuffle = true;
      }
      // Don't reset cursor - let user continue from same position
    });
  }
}

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
