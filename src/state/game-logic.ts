// Game business logic: navigation, scoring, and flow control

import { topicListSignal } from '../data/data';
import { ErrorHandler, MAX_SEED_VALUE, shuffleIndices } from '../utils';
import {
  askedSignal,
  currentQuestionSignal,
  difficultySignal,
  endStateSignal,
  getOrCreateQuestions,
  getProgress,
  questionModeSignal,
  revealedSignal,
  saveLastTopic,
  saveProgress,
  scoreSignal,
  showTopicPickerSignal,
  streakSignal,
  topicIdSignal,
} from './index';

// Get next question
export async function nextQuestion(): Promise<void> {
  const topicId = topicIdSignal.value;
  const difficulty = difficultySignal.value;
  const questionMode = questionModeSignal.value;

  if (!topicId) {
    ErrorHandler.critical('No topic selected');
    return;
  }

  // Loop to handle invalid index reset without recursion
  while (true) {
    const prog = await getProgress(topicId, difficulty, questionMode);
    // Lazy load: get or create questions for current topic/difficulty/mode
    const bank = await getOrCreateQuestions(topicId, difficulty, questionMode);

    // Check if topic has no questions in current mode
    if (!bank || bank.length === 0) {
      endStateSignal.value = {
        title: 'No curated questions available!',
        message:
          "This topic doesn't have curated questions yet. Switch to 'All questions' mode.",
      };
      currentQuestionSignal.value = null;
      return;
    }

    if (prog.cursor >= bank.length) {
      endStateSignal.value = {
        title: 'All questions used up!',
        message: 'Reset progress or switch difficulty to keep rolling.',
      };
      currentQuestionSignal.value = null;
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
      ErrorHandler.info(
        'Question bank changed - progress reset for this topic',
      );

      // Continue loop to retry with new progress
      continue;
    }

    prog.cursor += 1;
    askedSignal.value += 1;
    revealedSignal.value = false;
    saveProgress();

    endStateSignal.value = null;
    currentQuestionSignal.value = bank[idx];
    break;
  }
}

// Mark answer as correct
export function markCorrect(): void {
  scoreSignal.value += 1;
  streakSignal.value += 1;
  nextQuestion();
}

// Skip question
export function skipQuestion(): void {
  streakSignal.value = 0;
  nextQuestion();
}

// Reset progress
export function resetProgress(): void {
  const topicId = topicIdSignal.value;
  if (!topicId) return;

  // We don't actually clear the progress object, just mark it for reshuffle
  // This preserves the "seen" status if we wanted to track that later
  // For now, we just reset the cursor and generate a new shuffle order
  getProgress(topicId, difficultySignal.value, questionModeSignal.value).then(
    (prog) => {
      prog.cursor = 0;
      const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
      // We need the bank size to shuffle
      getOrCreateQuestions(
        topicId,
        difficultySignal.value,
        questionModeSignal.value,
      ).then((bank) => {
        prog.order = shuffleIndices(bank.length, seed);
        saveProgress();
        nextQuestion();
        ErrorHandler.success('Progress reset for this topic!');
      });
    },
  );
}

// Select topic and start
export function selectTopicAndStart(topicId: string): void {
  const topic = topicListSignal.value.find((t) => t.id === topicId);
  if (!topic) {
    ErrorHandler.critical(`Topic not found: ${topicId}`);
    return;
  }

  topicIdSignal.value = topicId;
  streakSignal.value = 0;
  showTopicPickerSignal.value = false;
  saveLastTopic(topicId);

  // Check if we have answer examples for this topic
  // If not, and we're in "All" mode, we might want to warn or switch to curated?
  // For now, just proceed - the generator will handle it
  nextQuestion();
}
