// Curated question index cache management
// Manages the list of topics that have curated questions available

import { loadCuratedQuestionsIndex } from './questions';

// Set of topic IDs that have curated questions (loaded from index.json)
let _curatedTopicIds: Set<string> | null = null;
let _loadPromise: Promise<Set<string>> | null = null;

export function getCuratedTopicIds(): Set<string> | null {
  return _curatedTopicIds;
}

export function resetCuratedTopicIds(): void {
  _curatedTopicIds = null;
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
      const topicIds = await loadCuratedQuestionsIndex();
      _curatedTopicIds = new Set(topicIds);
      return _curatedTopicIds;
    } catch {
      _curatedTopicIds = new Set();
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
