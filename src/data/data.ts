import { signal } from '@preact/signals';
import type {
  AnswerExamples,
  CategoryAngles,
  Difficulty,
  TemplateSet,
  Topic,
} from '../types';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export const topicListSignal = signal<Topic[]>([]);
export const answerExamplesSignal = signal<AnswerExamples>({});

// Track if answer examples have been loaded
let answerExamplesLoaded = false;

// Async loader for topics from JSON file
// Populates topicListSignal and returns the data
async function loadStaticData(): Promise<{
  topics: Topic[];
}> {
  try {
    const topicsResponse = await fetch('data/topics.json');

    if (!topicsResponse.ok) {
      throw new Error('Failed to load topics file');
    }

    const topics = (await topicsResponse.json()) as Topic[];

    // Populate signal
    topicListSignal.value = topics;

    return { topics };
  } catch (error) {
    console.error('Error loading topics:', error);
    throw error;
  }
}

// Lazy loader for answer examples - only loads when needed
async function loadAnswerExamples(): Promise<AnswerExamples> {
  // Return cached if already loaded
  if (answerExamplesLoaded) {
    return answerExamplesSignal.value;
  }

  try {
    const examplesResponse = await fetch('data/answer-examples.json');

    if (!examplesResponse.ok) {
      throw new Error('Failed to load answer examples file');
    }

    const examples = (await examplesResponse.json()) as AnswerExamples;

    // Populate signal
    answerExamplesSignal.value = examples;
    answerExamplesLoaded = true;

    return examples;
  } catch (error) {
    console.error('Error loading answer examples:', error);
    throw error;
  }
}

// Force the next loadAnswerExamples() call to re-fetch. Used by "Reload".
function resetAnswerExamplesCache(): void {
  answerExamplesLoaded = false;
}

const categoryAngles: CategoryAngles = {
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

// Open-ended generation templates. These produce discussion-style prompts with
// NO single correct answer (the card shows several example answers). The angle
// is always quoted as a theme label — e.g. "houses", "quote" — so prompts read
// correctly regardless of whether the angle is singular or plural.
const promptTemplates: TemplateSet = {
  easy: [
    'In {topic}, name something connected to "{angle}".',
    'Name a {topic} example for the theme "{angle}".',
    'What comes to mind for "{angle}" in {topic}?',
    'Recall something from {topic} related to "{angle}".',
    'Name a well-known "{angle}" from {topic}.',
    'Spot one example of "{angle}" in {topic}.',
    'Quick #{n}: name an example of "{angle}" in {topic}.',
    'Warm-up #{n}: name something tied to "{angle}" in {topic}.',
    'Starter #{n}: what\'s a classic "{angle}" in {topic}?',
    'Roadside #{n}: call out an example of "{angle}" from {topic}.',
  ],
  medium: [
    'In {topic}, name a notable example of "{angle}".',
    'Name a memorable "{angle}" from {topic}.',
    'Which "{angle}" stands out in {topic}? Name one.',
    'Point to a defining example of "{angle}" in {topic}.',
    'Name an example of "{angle}" that shaped {topic}.',
    'Round #{n}: identify a key example of "{angle}" in {topic}.',
    'Checkpoint #{n}: name a significant "{angle}" in {topic}.',
    'Detail #{n}: name a standout example of "{angle}" in {topic}.',
  ],
  hard: [
    'In {topic}, name a lesser-known example of "{angle}".',
    'Name a rare or overlooked "{angle}" in {topic}.',
    'What\'s a more advanced example of "{angle}" in {topic}?',
    'Name an example of "{angle}" only superfans of {topic} would know.',
    'Expert #{n}: name a less obvious "{angle}" from {topic}.',
    'Deep dive #{n}: identify a niche "{angle}" in {topic}.',
    'Toughie #{n}: cite an obscure "{angle}" within {topic}.',
  ],
};

// Export as ES modules for Vite
export {
  categoryAngles,
  difficulties,
  loadAnswerExamples,
  loadStaticData,
  promptTemplates,
  resetAnswerExamplesCache,
};
