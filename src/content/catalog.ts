// Static catalog: the topic list, loaded once at startup, plus category helpers.

import { signal } from '@preact/signals';
import type { Topic } from '../types';

export const topicsSignal = signal<Topic[]>([]);

export async function loadTopics(): Promise<Topic[]> {
  const res = await fetch('data/topics.json');
  if (!res.ok) throw new Error('Failed to load topics');
  const topics = (await res.json()) as Topic[];
  topicsSignal.value = topics;
  return topics;
}

export function topicById(id: string): Topic | undefined {
  return topicsSignal.value.find((t) => t.id === id);
}

// Distinct category names, sorted.
export function categories(): string[] {
  return [...new Set(topicsSignal.value.map((t) => t.category))].sort();
}

// Topic IDs belonging to a category.
export function topicIdsForCategory(category: string): string[] {
  return topicsForCategory(category).map((t) => t.id);
}

// Topics belonging to a category, sorted by name.
export function topicsForCategory(category: string): Topic[] {
  return topicsSignal.value
    .filter((t) => t.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}
