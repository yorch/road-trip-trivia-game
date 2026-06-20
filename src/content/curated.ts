// Curated question loading. The index lists which topics have curated content
// and how many per difficulty; topic files are fetched lazily and cached.

import { signal } from '@preact/signals';
import type { CuratedTopicFile, Difficulty } from '../types';

export interface CuratedStats {
  easy: number;
  medium: number;
  hard: number;
}
export type CuratedIndex = Record<string, CuratedStats>;

const EMPTY: CuratedTopicFile = { easy: [], medium: [], hard: [] };

export const curatedIndexSignal = signal<CuratedIndex>({});

const fileCache: Record<string, CuratedTopicFile> = {};
let indexLoaded = false;

export async function loadCuratedIndex(): Promise<CuratedIndex> {
  if (indexLoaded) return curatedIndexSignal.value;
  try {
    const res = await fetch('data/curated/index.json');
    if (!res.ok) return {};
    const index = (await res.json()) as CuratedIndex;
    curatedIndexSignal.value = index;
    indexLoaded = true;
    return index;
  } catch {
    return {};
  }
}

export function hasCurated(topicId: string): boolean {
  return topicId in curatedIndexSignal.value;
}

export function curatedStats(topicId: string): CuratedStats | null {
  return curatedIndexSignal.value[topicId] ?? null;
}

export async function loadCuratedTopic(
  topicId: string,
): Promise<CuratedTopicFile> {
  if (fileCache[topicId]) return fileCache[topicId];
  try {
    const res = await fetch(`data/curated/${topicId}.json`);
    if (!res.ok) return EMPTY;
    const data = (await res.json()) as Partial<CuratedTopicFile>;
    if (!data.easy || !data.medium || !data.hard) return EMPTY;
    const file = data as CuratedTopicFile;
    fileCache[topicId] = file;
    return file;
  } catch {
    return EMPTY;
  }
}

export function curatedByDifficulty(file: CuratedTopicFile, d: Difficulty) {
  return file[d] ?? [];
}
