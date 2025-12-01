import type {
  AnswerExamples,
  CategoryAngles,
  Difficulty,
  TemplateSet,
  Topic,
} from '../types';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const topicList: Topic[] = [];
const answerExamples: AnswerExamples = {};

// Track if answer examples have been loaded
let answerExamplesLoaded = false;

// Async loader for topics from JSON file
// Populates topicList in-place and returns the data
async function loadStaticData(): Promise<{
  topics: Topic[];
}> {
  try {
    const topicsResponse = await fetch('/data/topics.json');

    if (!topicsResponse.ok) {
      throw new Error('Failed to load topics file');
    }

    const topics = (await topicsResponse.json()) as Topic[];

    // Populate module-level variables in-place
    topicList.length = 0;
    topicList.push(...topics);

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
    return answerExamples;
  }

  try {
    const examplesResponse = await fetch('/data/answer-examples.json');

    if (!examplesResponse.ok) {
      throw new Error('Failed to load answer examples file');
    }

    const examples = (await examplesResponse.json()) as AnswerExamples;

    // Clear and repopulate answerExamples
    for (const key in answerExamples) {
      delete answerExamples[key];
    }
    Object.assign(answerExamples, examples);
    answerExamplesLoaded = true;

    return answerExamples;
  } catch (error) {
    console.error('Error loading answer examples:', error);
    throw error;
  }
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

const promptTemplates: TemplateSet = {
  easy: [
    // Recognition-based (10)
    "What's a famous {angle} from {topic}?",
    'Name any {angle} you know from {topic}.',
    'Which {angle} would you recognize from {topic}?',
    'Give an example of a {angle} in {topic}.',
    'What {angle} is {topic} known for?',
    'Recall a popular {angle} from {topic}.',
    'Which {angle} stands out in {topic}?',
    'What {angle} do most people know from {topic}?',
    'Think of one {angle} associated with {topic}.',
    "What's a classic {angle} from {topic}?",
    // Quick-fire style (10)
    'Quick #{n}: Which {angle} is iconic in {topic}?',
    'Starter #{n}: Name a key {angle} for {topic}.',
    'Warm-up #{n}: What common {angle} fits {topic}?',
    'Roadside #{n}: Pick one well-known {angle} in {topic}.',
    'Spotlight #{n}: Call out a famous {angle} of {topic}.',
    'Soundbite #{n}: Give one signature {angle} from {topic}.',
    'Trivia #{n}: What {angle} appears in {topic}?',
    'Fast #{n}: Name a memorable {angle} from {topic}.',
    'Basic #{n}: Which {angle} is essential to {topic}?',
    'Easy #{n}: What {angle} defines {topic}?',
  ],
  medium: [
    // Context-requiring (8)
    'Which {angle} plays a pivotal role in {topic}?',
    'What {angle} is unique to {topic}?',
    'Name the {angle} that changed {topic}.',
    'Which {angle} is debated among {topic} fans?',
    'What {angle} connects different parts of {topic}?',
    'Which {angle} represents the theme of {topic}?',
    'What {angle} evolved throughout {topic}?',
    'Name a {angle} that surprised audiences in {topic}.',
    // Numbered style (7)
    'Round #{n}: Name a pivotal {angle} tied to {topic}.',
    'Challenge #{n}: Which defining {angle} marks {topic}?',
    'Checkpoint #{n}: Identify a memorable {angle} in {topic}.',
    'Explain #{n}: Point to a standout {angle} in {topic}.',
    'Describe #{n}: Choose a notable {angle} from {topic}.',
    'Detail #{n}: What significant {angle} shaped {topic}?',
    'Focus #{n}: Which {angle} received critical acclaim in {topic}?',
  ],
  hard: [
    // Deep knowledge (8)
    'Which lesser-known {angle} influenced {topic}?',
    'What {angle} was modified during production of {topic}?',
    'Name the {angle} that created controversy in {topic}.',
    'Which {angle} was inspired by real events in {topic}?',
    'What {angle} differs between versions of {topic}?',
    'Compare two {angle} interpretations in {topic}.',
    'Which {angle} references another work in {topic}?',
    'What {angle} only appears in extended content of {topic}?',
    // Numbered expert style (7)
    'Deep dive #{n}: Which debated {angle} sits in {topic}?',
    'Expert #{n}: Name a lesser-known {angle} of {topic}.',
    'Toughie #{n}: Cite a contested {angle} within {topic}.',
    'Brain burn #{n}: Call out a tricky {angle} of {topic}.',
    'Stretch #{n}: Identify a rare {angle} linked to {topic}.',
    'Advanced #{n}: Which obscure {angle} exists in {topic}?',
    'Challenge #{n}: What hidden {angle} did creators add to {topic}?',
  ],
};

// Export as ES modules for Vite
export {
  difficulties,
  topicList,
  categoryAngles,
  promptTemplates,
  answerExamples,
  loadStaticData,
  loadAnswerExamples,
};
