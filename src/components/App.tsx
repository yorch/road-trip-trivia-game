import { topicList } from '../data/data';
import {
  difficultySignal,
  questionModeSignal,
  rebuildQuestionBank,
  saveDifficulty,
  saveQuestionMode,
  showTopicPickerSignal,
  streakSignal,
} from '../state';
import {
  nextQuestion,
  resetProgress,
  selectTopicAndStart,
} from '../state/game-logic';
import type { Difficulty, QuestionMode } from '../types';
import { CuratedListDialog } from './CuratedListDialog';
import { QuestionCard } from './QuestionCard';
import { Scoreboard } from './Scoreboard';
import { TopicPicker } from './TopicPicker';

export function App() {
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
    if (topicList && topicList.length > 0) {
      const randomTopic =
        topicList[Math.floor(Math.random() * topicList.length)];
      selectTopicAndStart(randomTopic.id);
    }
  };

  return (
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Road Trip Game</p>
          <h1>Trivia Drive</h1>
          <p class="lede">
            Pick a topic, choose your difficulty, and keep the car buzzing with
            rapid-fire questions everyone can enjoy.
          </p>
          <div class="hero-actions">
            <button
              type="button"
              class="pill"
              id="chooseTopic"
              onClick={() => {
                showTopicPickerSignal.value = true;
              }}
            >
              Choose topic
            </button>
            <button
              type="button"
              class="pill ghost"
              id="randomTopic"
              onClick={handleRandomTopic}
            >
              Surprise me
            </button>
            <button
              type="button"
              class="pill ghost"
              id="resetProgress"
              onClick={() => resetProgress()}
            >
              Reset progress
            </button>
          </div>
        </div>
        <Scoreboard />
      </header>

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
          <span>Question Type</span>
          <div class="question-mode-buttons">
            <button
              type="button"
              class={`question-mode ${questionMode === 'all' ? 'active' : ''}`}
              onClick={() => handleModeChange('all')}
            >
              All questions
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

      <QuestionCard />

      <TopicPicker />
      <CuratedListDialog />
    </div>
  );
}
