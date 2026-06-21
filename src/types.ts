// ─── Content types ───────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export interface Topic {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

export interface CuratedQuestion {
  q: string;
  a: string;
  angle: string;
}

export interface CuratedTopicFile {
  easy: CuratedQuestion[];
  medium: CuratedQuestion[];
  hard: CuratedQuestion[];
}

// A question as presented in a game. Carries its source topic so a mixed-topic
// session can show where each question came from.
export interface Question {
  id: string;
  prompt: string;
  answer: string;
  angle: string;
  difficulty: Difficulty;
  topicId: string;
  topicName: string;
  category: string;
}

// ─── Session / game types ────────────────────────────────────────────────

export type EntrantKind = 'players' | 'teams';

export interface Entrant {
  id: string;
  name: string;
}

// How a game ends.
export type EndMode = 'count' | 'race' | 'timed' | 'endless';

export type DifficultyChoice = 'mixed' | Difficulty;

export interface GameConfig {
  entrantKind: EntrantKind;
  entrants: Entrant[];
  topicIds: string[]; // empty = all topics
  difficulty: DifficultyChoice;
  endMode: EndMode;
  // Meaning depends on endMode: question count / target points / seconds.
  // Ignored for 'endless'.
  target: number;
}

export interface EntrantScore {
  score: number;
  streak: number;
  bestStreak: number;
  correct: number;
}

export type SessionStatus = 'active' | 'finished';

export interface AwardResult {
  entrantId: string | null; // null = nobody got it
  base: number;
  bonus: number;
  difficulty: Difficulty;
  streak: number;
}

export interface GameSession {
  config: GameConfig;
  seed: number;
  pool: Question[];
  cursor: number;
  revealed: boolean;
  scores: Record<string, EntrantScore>;
  status: SessionStatus;
  startedAt: number;
  endsAt?: number; // wall-clock deadline for 'timed' mode
  lastAward: AwardResult | null;
}
