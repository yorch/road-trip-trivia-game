// Global type declarations for window object

import type {
  AnswerExamples,
  CategoryAngles,
  CuratedQuestions,
  Difficulty,
  TemplateSet,
  Topic,
} from './types';

declare global {
  interface Window {
    topicList: Topic[];
    difficulties: Difficulty[];
    categoryAngles: CategoryAngles;
    promptTemplates: TemplateSet;
    answerExamples: AnswerExamples;
    curatedQuestions: CuratedQuestions;
  }
}
