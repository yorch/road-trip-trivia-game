export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionMode = 'all' | 'curated';

export interface Topic {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

export interface Question {
  prompt: string;
  answer: string;
  angle: string;
  difficulty: Difficulty;
}

export interface CuratedQuestion {
  q: string;
  a: string;
  angle: string;
}

export interface CuratedQuestions {
  [topicId: string]: {
    easy: CuratedQuestion[];
    medium: CuratedQuestion[];
    hard: CuratedQuestion[];
  };
}

export interface TemplateSet {
  [key: string]: string[];
}

export interface CategoryAngles {
  [category: string]: string[];
}

export interface AnswerExamples {
  [topicId: string]: {
    [angle: string]: string[];
  };
}

export interface Progress {
  order: number[];
  cursor: number;
  needsReshuffle?: boolean;
}

export interface ProgressData {
  [topicId: string]: {
    [difficulty: string]: Progress;
  };
}

export interface State {
  topicId: string | null;
  difficulty: Difficulty;
  questionMode: QuestionMode;
  score: number;
  streak: number;
  asked: number;
  revealed: boolean;
}

export interface QuestionBank {
  [topicId: string]: {
    [difficulty: string]: Question[];
  };
}

export interface ScoreboardData {
  score: number;
  streak: number;
  asked: number;
}
