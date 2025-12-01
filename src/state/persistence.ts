// LocalStorage persistence operations
// Pure localStorage operations with error handling

import type {
  Difficulty,
  ProgressData,
  QuestionMode,
  ScoreboardData,
  Topic,
} from '../types';
import { DIFFICULTY_LEVELS, ErrorHandler, QUESTION_MODES } from '../utils';

// Last topic persistence
export function saveLastTopic(topicId: string): void {
  try {
    localStorage.setItem('lastTopicId', topicId);
  } catch (e) {
    ErrorHandler.warn('Failed to save last topic to localStorage', e as Error);
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
    ErrorHandler.warn(
      'Failed to clear last topic from localStorage',
      e as Error,
    );
  }
}

// Progress persistence
export function saveProgress(progress: ProgressData): void {
  try {
    localStorage.setItem('questionProgress', JSON.stringify(progress));
  } catch (e) {
    ErrorHandler.warn(
      'Failed to save progress - your progress may not be preserved',
      e as Error,
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
    ErrorHandler.warn('Failed to clear progress from localStorage', e as Error);
  }
}

// Question mode persistence
export function saveQuestionMode(mode: QuestionMode): void {
  try {
    localStorage.setItem('questionMode', mode);
  } catch (e) {
    ErrorHandler.warn('Failed to save question mode preference', e as Error);
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

// Difficulty persistence
export function saveDifficulty(difficulty: Difficulty): void {
  try {
    localStorage.setItem('difficulty', difficulty);
  } catch (e) {
    ErrorHandler.warn('Failed to save difficulty preference', e as Error);
  }
}

export function loadDifficulty(): Difficulty {
  try {
    const saved = localStorage.getItem('difficulty');
    return saved && window.difficulties.includes(saved as Difficulty)
      ? (saved as Difficulty)
      : DIFFICULTY_LEVELS.EASY;
  } catch (_e) {
    return DIFFICULTY_LEVELS.EASY;
  }
}

// Scoreboard persistence
export function loadScoreboard(): ScoreboardData {
  try {
    const saved = localStorage.getItem('scoreboard');
    if (saved) {
      const data: ScoreboardData = JSON.parse(saved);
      return {
        score: data.score || 0,
        streak: data.streak || 0,
        asked: data.asked || 0,
      };
    }
    return { score: 0, streak: 0, asked: 0 };
  } catch (_e) {
    return { score: 0, streak: 0, asked: 0 };
  }
}
