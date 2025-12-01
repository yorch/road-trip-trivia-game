// Question generation and banking
// Handles question creation from templates and curated sources

import {
  answerExamples,
  loadAnswerExamples,
  promptTemplates,
  topicList,
} from '../data/data';
import type {
  CuratedQuestion,
  Difficulty,
  Question,
  QuestionBank,
  QuestionMode,
  Topic,
} from '../types';
import { buildAngles, fillTemplate, QUESTION_MODES } from '../utils';

// Question bank storage
export let questionBank: QuestionBank = {};

// Cache for loaded curated questions per topic
const curatedQuestionsCache: Record<
  string,
  {
    easy: CuratedQuestion[];
    medium: CuratedQuestion[];
    hard: CuratedQuestion[];
  }
> = {};

// AbortController for fetch requests
let curatedQuestionsController: AbortController | null = null;

// Lazy load curated questions for a specific topic
async function loadTopicCuratedQuestions(topicId: string): Promise<{
  easy: CuratedQuestion[];
  medium: CuratedQuestion[];
  hard: CuratedQuestion[];
}> {
  // Return cached if already loaded
  if (curatedQuestionsCache[topicId]) {
    return curatedQuestionsCache[topicId];
  }

  try {
    // Cancel previous request if exists
    if (curatedQuestionsController) {
      curatedQuestionsController.abort();
    }

    curatedQuestionsController = new AbortController();

    const response = await fetch(`/curated/${topicId}.json`, {
      signal: curatedQuestionsController.signal,
    });

    if (!response.ok) {
      // Topic doesn't have curated questions - return empty
      return { easy: [], medium: [], hard: [] };
    }

    const data = await response.json();

    // Validate structure
    if (!data.easy || !data.medium || !data.hard) {
      console.warn(
        `Invalid structure in ${topicId}.json - missing difficulty levels`,
      );
      return { easy: [], medium: [], hard: [] };
    }

    // Cache for future use
    curatedQuestionsCache[topicId] = data;
    return data;
  } catch (error) {
    // Ignore abort errors - they're expected when cancelling
    if (error instanceof Error && error.name === 'AbortError') {
      return { easy: [], medium: [], hard: [] };
    }
    // Silently return empty on other errors
    return { easy: [], medium: [], hard: [] };
  }
}

// Lazy loading: Only generate questions when needed for a specific topic/difficulty/mode
export async function getOrCreateQuestions(
  topicId: string,
  difficulty: Difficulty,
  mode: QuestionMode,
): Promise<Question[]> {
  // Ensure topic exists in question bank
  if (!questionBank[topicId]) {
    questionBank[topicId] = {};
  }

  // Include mode in cache key to prevent stale cached questions after mode switch
  const cacheKey = `${difficulty}_${mode}`;

  // Lazily create questions for this difficulty and mode if not already created
  if (!questionBank[topicId][cacheKey]) {
    const topic = topicList.find((t: Topic) => t.id === topicId);
    if (topic) {
      questionBank[topicId][cacheKey] = await createQuestions(
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
async function createQuestions(
  topic: Topic,
  difficulty: Difficulty,
  mode: QuestionMode = QUESTION_MODES.ALL,
): Promise<Question[]> {
  const prompts = promptTemplates[difficulty];
  const allAngles = buildAngles(topic);
  const bank: Question[] = [];

  // Lazy load curated questions for this specific topic and answer examples
  const [topicCurated] = await Promise.all([
    loadTopicCuratedQuestions(topic.id),
    loadAnswerExamples(),
  ]);

  const curated = topicCurated[difficulty] || [];
  const examples = answerExamples?.[topic.id] || {};

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

  // For "all" mode, generate questions ONLY for angles with real answer examples
  // This ensures we never show placeholder answers
  const anglesWithExamples = allAngles.filter(
    (angle) => examples[angle] && examples[angle].length > 0,
  );

  // If no angles have examples, return only curated questions (if any)
  if (anglesWithExamples.length === 0) {
    return bank;
  }

  // Fill remaining slots with generated questions using real answer examples
  const remaining = 80 - curated.length; // QUESTION_BANK_SIZE
  for (let i = 0; i < remaining; i += 1) {
    const angle = anglesWithExamples[i % anglesWithExamples.length];
    const prompt = fillTemplate(
      prompts[i % prompts.length],
      topic.name,
      angle,
      i,
    );

    // Use real answer example (guaranteed to exist since we filtered for it)
    const answer = examples[angle][i % examples[angle].length];

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

// Load curated questions index (just the list of topic IDs, not the actual questions)
// This is used by the topic picker to show which topics have curated content
// The actual questions are lazy loaded per-topic when needed
export async function loadCuratedQuestionsIndex(): Promise<string[]> {
  try {
    const indexResponse = await fetch('/curated/index.json');
    if (indexResponse.ok) {
      return await indexResponse.json();
    }
    return [];
  } catch {
    return [];
  }
}
