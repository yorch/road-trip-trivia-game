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
} from '../types';
import {
  buildAngles,
  ErrorHandler,
  fillTemplate,
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

// Load curated questions from individual topic files
// Returns true if successful, false if failed
export async function loadCuratedQuestions(): Promise<boolean> {
  try {
    // Cancel previous request if exists
    if (curatedQuestionsController) {
      curatedQuestionsController.abort();
    }

    curatedQuestionsController = new AbortController();

    // Load from per-topic structure
    const loadedFromTopics = await loadCuratedQuestionsFromTopics(
      curatedQuestionsController.signal,
    );

    if (!loadedFromTopics) {
      ErrorHandler.warn(
        'Failed to load curated questions - using generated questions only',
      );
      window.curatedQuestions = {};
      return false;
    }

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

// Load curated questions from individual topic files
async function loadCuratedQuestionsFromTopics(
  signal: AbortSignal,
): Promise<boolean> {
  try {
    const curatedData: CuratedQuestions = {};
    let successCount = 0;

    // First, try to load the index file to know which topics have curated questions
    let availableTopicIds: string[] = [];
    try {
      const indexResponse = await fetch('/curated/index.json', { signal });
      if (indexResponse.ok) {
        availableTopicIds = await indexResponse.json();
      }
    } catch {
      // Index file not found or failed to load - will try all topics
    }

    // Determine which topics to load
    const topicsToLoad =
      availableTopicIds.length > 0
        ? window.topicList.filter((topic) =>
            availableTopicIds.includes(topic.id),
          )
        : window.topicList; // Fallback: try all topics if no index

    // Load curated questions for available topics
    const loadPromises = topicsToLoad.map(async (topic) => {
      try {
        const response = await fetch(`/curated/${topic.id}.json`, { signal });
        if (!response.ok) {
          // Silently ignore 404s - not all topics have curated questions
          // Only warn on other errors (server errors, network issues, etc.)
          if (response.status !== 404) {
            console.warn(`Failed to load ${topic.id}.json: ${response.status}`);
          }
          return null;
        }
        const data = await response.json();
        // Files are structured as { easy, medium, hard }
        if (!data.easy || !data.medium || !data.hard) {
          console.warn(
            `Invalid structure in ${topic.id}.json - missing difficulty levels`,
          );
          return null;
        }
        return { topicId: topic.id, data };
      } catch {
        // Silently ignore fetch errors (file not found is expected)
        return null;
      }
    });

    const results = await Promise.all(loadPromises);

    // Merge successful loads
    results.forEach((result) => {
      if (result?.data) {
        curatedData[result.topicId] = result.data;
        successCount++;
      }
    });

    if (successCount > 0) {
      console.log(
        `Loaded curated questions for ${successCount} topic${successCount !== 1 ? 's' : ''}`,
      );
    }

    // Only use topic-based loading if we successfully loaded at least one topic
    if (successCount > 0) {
      window.curatedQuestions = curatedData;
      return true;
    }

    return false;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    console.error('Error in loadCuratedQuestionsFromTopics:', error);
    return false;
  }
}
