// Curated question index cache management
// Manages the list of topics that have curated questions available

import { type CuratedIndex, loadCuratedQuestionsIndex } from './questions';

// Set of topic IDs that have curated questions (loaded from index.json)
let _curatedTopicIds: Set<string> | null = null;
let _curatedStats: CuratedIndex | null = null;
let _loadPromise: Promise<Set<string>> | null = null;

export function getCuratedTopicIds(): Set<string> | null {
  return _curatedTopicIds;
}

export function getCuratedTopicStats(): CuratedIndex | null {
  return _curatedStats;
}

export function resetCuratedTopicIds(): void {
  _curatedTopicIds = null;
  _curatedStats = null;
  _loadPromise = null;
}

// Load the curated questions index (just topic IDs, not actual questions)
export async function loadCuratedTopicIndex(): Promise<Set<string>> {
  // Return cached value if available
  if (_curatedTopicIds) {
    return _curatedTopicIds;
  }

  // If load in progress, wait for it
  if (_loadPromise) {
    return _loadPromise;
  }

  // Start new load
  _loadPromise = (async (): Promise<Set<string>> => {
    try {
      const indexData = await loadCuratedQuestionsIndex();
      _curatedStats = indexData;
      _curatedTopicIds = new Set(Object.keys(indexData));
      return _curatedTopicIds;
    } catch {
      _curatedTopicIds = new Set();
      _curatedStats = {};
      return _curatedTopicIds;
    } finally {
      _loadPromise = null;
    }
  })();

  return _loadPromise;
}

// Check if a topic has curated questions
export function hasCuratedQuestions(topicId: string): boolean {
  return _curatedTopicIds?.has(topicId) ?? false;
}
