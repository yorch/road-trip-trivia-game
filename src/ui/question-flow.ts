// Question navigation and flow logic
// Handles question progression, scoring, and skipping

import {
  getOrCreateQuestions,
  getProgress,
  resetProgressAll as resetAllProgress,
  saveLastTopic,
  saveProgress,
  state,
} from '../state';
import { ErrorHandler, MAX_SEED_VALUE, shuffleIndices } from '../utils';
import { renderCard, renderEndState, toggleAnswer } from './renderer';

// Get next question
export async function nextQuestion(): Promise<void> {
  if (!state.topicId) {
    ErrorHandler.critical('No topic selected');
    return;
  }

  const prog = await getProgress(
    state.topicId,
    state.difficulty,
    state.questionMode,
  );
  // Lazy load: get or create questions for current topic/difficulty/mode
  const bank = await getOrCreateQuestions(
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
  resetAllProgress();
  nextQuestion();
}

// Select topic and start
export function selectTopicAndStart(topicId: string): void {
  // Check if topic has answer examples or curated questions
  const hasAnswerExamples = window.answerExamples?.[topicId];
  const hasCuratedQuestions =
    typeof window.curatedQuestions !== 'undefined' &&
    window.curatedQuestions[topicId];

  // Warn if topic has neither answer examples nor curated questions
  if (!hasAnswerExamples && !hasCuratedQuestions) {
    const topic = window.topicList.find((t) => t.id === topicId);
    const topicName = topic ? topic.name : topicId;
    ErrorHandler.warn(
      `"${topicName}" has limited content. Questions use generic templates and may be less refined.`,
    );
  }

  state.topicId = topicId;
  state.streak = 0;
  saveLastTopic(topicId);
  nextQuestion();
}

// Export toggleAnswer from renderer for convenience
export { toggleAnswer };
