// Progress tracking for Road Trip Trivia
// Manages question order shuffling and cursor position

import type {
  Difficulty,
  Progress,
  ProgressData,
  QuestionMode,
} from '../../types';
import { ErrorHandler, MAX_SEED_VALUE, shuffleIndices } from '../utils';
import { saveProgress as persistProgress } from './persistence';
import { getOrCreateQuestions } from './questions';

// Progress tracking
export const progress: ProgressData = {};

// Get or create progress for a topic/difficulty
export function getProgress(
  topicId: string,
  difficulty: Difficulty,
  questionMode: QuestionMode,
): Progress {
  if (!progress[topicId]) progress[topicId] = {};
  if (!progress[topicId][difficulty]) {
    // Lazy load: create questions only when needed
    const bank = getOrCreateQuestions(topicId, difficulty, questionMode);
    const bankSize = bank.length;
    if (bankSize === 0) {
      return { order: [], cursor: 0 };
    }
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    progress[topicId][difficulty] = {
      order: shuffleIndices(bankSize, seed),
      cursor: 0,
    };
    persistProgress(progress);
  }

  const prog = progress[topicId][difficulty];

  // Detect empty progress and rebuild if questions now available
  if (prog.order.length === 0) {
    const bank = getOrCreateQuestions(topicId, difficulty, questionMode);
    if (bank.length > 0) {
      // Questions available now, rebuild progress
      const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
      prog.order = shuffleIndices(bank.length, seed);
      prog.cursor = 0;
      persistProgress(progress);
    }
  }

  // Handle lazy reshuffle from mode changes
  if (prog.needsReshuffle) {
    const bank = getOrCreateQuestions(topicId, difficulty, questionMode);
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    const newOrder = shuffleIndices(bank.length, seed);
    // Preserve cursor position if possible, otherwise reset
    prog.order = newOrder;
    if (prog.cursor >= newOrder.length) {
      prog.cursor = 0; // Reset only if cursor is out of bounds
    }
    delete prog.needsReshuffle;
    persistProgress(progress);
  }

  return prog;
}

// Reset progress for all topics
export function resetProgressAll(difficulties: Difficulty[]): void {
  // Safety check: ensure difficulties are loaded
  if (!difficulties || !Array.isArray(difficulties)) {
    ErrorHandler.critical('Difficulties not loaded - cannot reset progress');
    return;
  }

  // Don't pre-generate questions during reset - just mark for lazy reshuffle
  Object.keys(progress).forEach((topicId) => {
    difficulties.forEach((diff: Difficulty) => {
      if (progress[topicId][diff]) {
        // Mark progress as needing reshuffle instead of generating questions now
        progress[topicId][diff].cursor = 0;
        progress[topicId][diff].needsReshuffle = true;
      }
    });
  });
  persistProgress(progress);
}

// Load progress from persistence layer
export function loadProgressData(loadedProgress: ProgressData): void {
  Object.assign(progress, loadedProgress);
}
