// Curated question counts cache management
// Atomic cache operations to prevent race conditions

import type { Topic } from '../types';
import { ErrorHandler } from '../utils';

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

// Proxy object for backward compatibility
export const globalCuratedCounts = {
  get value(): Map<string, number> | null {
    return _globalCuratedCounts;
  },
  set value(val: Map<string, number> | null) {
    _globalCuratedCounts = val;
  },
};
