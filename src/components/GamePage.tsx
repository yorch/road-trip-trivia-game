import { topicListSignal } from '../data/data';
import {
  difficultySignal,
  questionModeSignal,
  rebuildQuestionBank,
  saveDifficulty,
  saveQuestionMode,
  streakSignal,
} from '../state';
import { nextQuestion } from '../state/game-logic';
import type { Difficulty, QuestionMode } from '../types';
import { QuestionCard } from './QuestionCard';
import { Scoreboard } from './Scoreboard';
import { ThemeToggle } from './ThemeToggle';

export function GamePage() {
  const difficulty = difficultySignal.value;
  const questionMode = questionModeSignal.value;

  const handleDifficultyChange = (diff: Difficulty) => {
    difficultySignal.value = diff;
    streakSignal.value = 0;
    saveDifficulty(diff);
    nextQuestion();
  };

  const handleModeChange = (mode: QuestionMode) => {
    questionModeSignal.value = mode;
    streakSignal.value = 0;
    saveQuestionMode(mode);
    rebuildQuestionBank();
    nextQuestion();
  };

  const handleRandomTopic = () => {
    const topicList = topicListSignal.value;
    if (topicList && topicList.length > 0) {
      const randomTopic =
        topicList[Math.floor(Math.random() * topicList.length)];
      window.location.hash = `/topic/${randomTopic.id}`;
    }
  };

  return (
    <div class="page">
      <header class="app-header">
        <h1 class="app-title">Road Trip Trivia</h1>
        <div class="header-right">
          <Scoreboard />
          <ThemeToggle />
        </div>
      </header>

      <div class="hero-actions">
        <button
          type="button"
          class="pill ghost"
          id="chooseTopic"
          onClick={() => {
            window.location.hash = '/';
          }}
        >
          ← Change topic
        </button>
        <button
          type="button"
          class="pill ghost"
          id="randomTopic"
          onClick={handleRandomTopic}
        >
          Surprise me
        </button>
      </div>

      {/* Question card is now PRIMARY — shown before controls */}
      <QuestionCard />

      {/* Controls are secondary — below the question */}
      <section class="controls">
        <div class="control difficulty-control">
          <span>Difficulty</span>
          <div class="difficulty-buttons">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                type="button"
                key={d}
                class={`difficulty ${difficulty === d ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div class="control question-mode-control">
          <span>Questions</span>
          <div class="question-mode-buttons">
            <button
              type="button"
              class={`question-mode ${questionMode === 'all' ? 'active' : ''}`}
              onClick={() => handleModeChange('all')}
            >
              All
            </button>
            <button
              type="button"
              class={`question-mode ${questionMode === 'curated' ? 'active' : ''}`}
              onClick={() => handleModeChange('curated')}
            >
              Curated only
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
