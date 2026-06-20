// Static catalog: topics, answer examples, category angles, and the open-ended
// generation templates. Topics load once at startup; answer examples lazily.

import { signal } from '@preact/signals';
import type {
  AnswerExamples,
  CategoryAngles,
  TemplateSet,
  Topic,
} from '../types';

export const topicsSignal = signal<Topic[]>([]);
export const answerExamplesSignal = signal<AnswerExamples>({});

let answerExamplesLoaded = false;

export async function loadTopics(): Promise<Topic[]> {
  const res = await fetch('data/topics.json');
  if (!res.ok) throw new Error('Failed to load topics');
  const topics = (await res.json()) as Topic[];
  topicsSignal.value = topics;
  return topics;
}

export async function loadAnswerExamples(): Promise<AnswerExamples> {
  if (answerExamplesLoaded) return answerExamplesSignal.value;
  try {
    const res = await fetch('data/answer-examples.json');
    if (!res.ok) throw new Error('Failed to load answer examples');
    const data = (await res.json()) as AnswerExamples;
    answerExamplesSignal.value = data;
    answerExamplesLoaded = true;
    return data;
  } catch (err) {
    console.error('Error loading answer examples:', err);
    return {};
  }
}

export function topicById(id: string): Topic | undefined {
  return topicsSignal.value.find((t) => t.id === id);
}

// Combine a topic's own tags with its category angles and a few general angles.
export function buildAngles(topic: Topic): string[] {
  const base = categoryAngles[topic.category] ?? [];
  const general = [
    'origin',
    'favorite',
    'legend',
    'rival',
    'surprise',
    'underdog',
  ];
  return [...new Set([...topic.tags, ...base, ...general])];
}

// Fill a template: {topic}, {angle}, and {n} (1-based index).
export function fillTemplate(
  template: string,
  topicName: string,
  angle: string,
  index: number,
): string {
  return template
    .replaceAll('{topic}', topicName)
    .replaceAll('{angle}', angle)
    .replaceAll('{n}', String(index + 1));
}

export const categoryAngles: CategoryAngles = {
  'Movies & TV': [
    'iconic scene',
    'quote',
    'director',
    'soundtrack',
    'plot twist',
    'sidekick',
  ],
  'Books & Lore': [
    'author',
    'chapter',
    'magic system',
    'creature',
    'library',
    'prophecy',
  ],
  Music: ['chorus', 'hook', 'era', 'genre', 'album', 'tour moment'],
  Theater: [
    'character',
    'stagecraft',
    'ensemble',
    'overture',
    'spotlight',
    'intermission',
  ],
  History: [
    'date',
    'turning point',
    'leader',
    'movement',
    'document',
    'milestone',
  ],
  'Science & Nature': [
    'experiment',
    'habitat',
    'cycle',
    'discovery',
    'phenomenon',
    'pattern',
  ],
  'Sports & Games': [
    'rule',
    'position',
    'championship',
    'record',
    'legend',
    'rival',
  ],
  'Travel & Places': [
    'landmark',
    'tradition',
    'food',
    'route',
    'landscape',
    'custom',
  ],
  'Lifestyle & Fun': [
    'gear',
    'ritual',
    'hack',
    'daily move',
    'myth',
    'tiny win',
  ],
};

// Open-ended prompts: the angle is quoted as a theme label so prompts read
// correctly whether the angle is singular or plural. No single correct answer —
// the card reveals several example answers.
export const promptTemplates: TemplateSet = {
  easy: [
    'In {topic}, name something connected to "{angle}".',
    'Name a {topic} example for the theme "{angle}".',
    'What comes to mind for "{angle}" in {topic}?',
    'Recall something from {topic} related to "{angle}".',
    'Name a well-known "{angle}" from {topic}.',
    'Spot one example of "{angle}" in {topic}.',
    'Quick #{n}: name an example of "{angle}" in {topic}.',
    'Starter #{n}: what\'s a classic "{angle}" in {topic}?',
  ],
  medium: [
    'In {topic}, name a notable example of "{angle}".',
    'Name a memorable "{angle}" from {topic}.',
    'Which "{angle}" stands out in {topic}? Name one.',
    'Point to a defining example of "{angle}" in {topic}.',
    'Name an example of "{angle}" that shaped {topic}.',
    'Round #{n}: identify a key example of "{angle}" in {topic}.',
  ],
  hard: [
    'In {topic}, name a lesser-known example of "{angle}".',
    'Name a rare or overlooked "{angle}" in {topic}.',
    'What\'s a more advanced example of "{angle}" in {topic}?',
    'Name an example of "{angle}" only superfans of {topic} would know.',
    'Expert #{n}: name a less obvious "{angle}" from {topic}.',
  ],
};
