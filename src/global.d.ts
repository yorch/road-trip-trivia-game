// Global type declarations for window object

import type {
  Topic,
  Difficulty,
  CategoryAngles,
  TemplateSet,
  AnswerExamples,
  CuratedQuestions,
} from './types';

declare global {
  interface Window {
    topicList: Topic[];
    difficulties: Difficulty[];
    categoryAngles: CategoryAngles;
    promptTemplates: TemplateSet;
    answerTemplates: TemplateSet;
    answerExamples: AnswerExamples;
    curatedQuestions: CuratedQuestions;
  }
}
