import { topicListSignal } from '../data/data';
import {
  currentQuestionSignal,
  difficultySignal,
  endStateSignal,
  revealedSignal,
  topicIdSignal,
} from '../state';
import {
  markCorrect,
  nextQuestion,
  resetProgress,
  skipQuestion,
} from '../state/game-logic';
import type { Topic } from '../types';

// --- Helper Components ---

const CardHeader = ({
  topic,
  title,
  meta,
  difficulty,
}: {
  topic?: Topic;
  title: string;
  meta?: string;
  difficulty?: string;
}) => (
  <div class="card-head">
    <div>
      <p class="card-kicker" id="cardTopic">
        {topic ? `${topic.name} • ${topic.category}` : 'Unknown Topic'}
      </p>
      <h2 id="cardTitle">{title}</h2>
      {meta && (
        <p class="card-meta" id="cardMeta">
          {meta}
        </p>
      )}
    </div>
    {difficulty && (
      <div class="chip" id="cardDifficulty">
        {difficulty}
      </div>
    )}
  </div>
);

const CardActions = ({
  revealed,
  disabled,
  onReveal,
  onSkip,
  onCorrect,
}: {
  revealed: boolean;
  disabled: boolean;
  onReveal: () => void;
  onSkip: () => void;
  onCorrect: () => void;
}) => (
  <div class="actions">
    <button
      type="button"
      id="toggleAnswer"
      class="ghost"
      disabled={disabled}
      onClick={onReveal}
    >
      {revealed ? 'Hide answer' : 'Show answer'}
    </button>
    <div class="spacer"></div>
    <button
      type="button"
      id="skipQuestion"
      class="ghost"
      disabled={disabled}
      onClick={onSkip}
    >
      Skip
    </button>
    <button
      type="button"
      id="markCorrect"
      class="primary"
      disabled={disabled}
      onClick={onCorrect}
    >
      I got it
    </button>
  </div>
);

const NextSection = ({ onNext }: { onNext: () => void }) => (
  <div class="next" style={{ display: 'flex' }}>
    <p>Ready for the next one?</p>
    <button type="button" id="nextQuestion" onClick={onNext}>
      Next question
    </button>
  </div>
);

export function QuestionCard() {
  const question = currentQuestionSignal.value;
  const endState = endStateSignal.value;
  const revealed = revealedSignal.value;
  const topicId = topicIdSignal.value;
  const difficulty = difficultySignal.value;

  // Find topic name
  const topic = topicListSignal.value?.find((t: Topic) => t.id === topicId);

  if (endState) {
    return (
      <main class="board">
        <div class="card card-complete">
          <div class="card-head">
            <div>
              <p class="card-kicker" id="cardTopic">
                {topic ? `${topic.name} • ${topic.category}` : 'Unknown Topic'}
              </p>
              <h2 id="cardTitle">{endState.title}</h2>
            </div>
          </div>
          <p class="card-body" id="cardBody">
            {endState.message}
          </p>
          <div class="actions">
            <button
              type="button"
              class="ghost"
              onClick={() => {
                window.location.hash = '/';
              }}
            >
              Back to Topics
            </button>
            <div class="spacer"></div>
            <button
              type="button"
              class="primary"
              onClick={() => resetProgress()}
            >
              Start Over
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!question) {
    // Initial state or loading
    return (
      <main class="board">
        <div class="card">
          <CardHeader
            title="Question will appear here"
            meta="Pick a topic to start"
            difficulty="Easy"
          />
          <p class="card-body" id="cardBody">
            Press “Next question” to kick things off.
          </p>
          <div class="answer" id="cardAnswer">
            <p class="answer-label">Answer</p>
            <p id="answerText">Hidden</p>
          </div>
          <CardActions
            revealed={false}
            disabled={true}
            onReveal={() => {}}
            onSkip={() => {}}
            onCorrect={() => {}}
          />
        </div>
        <NextSection onNext={() => nextQuestion()} />
      </main>
    );
  }

  return (
    <main class="board">
      <div class="card">
        <CardHeader
          topic={topic}
          title={question.prompt}
          meta={`Angle: ${question.angle}`}
          difficulty={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        />
        <p class="card-body" id="cardBody">
          Give a short, precise answer, then reveal.
        </p>

        <div class={`answer ${revealed ? 'visible' : ''}`} id="cardAnswer">
          <p class="answer-label">Answer</p>
          <p id="answerText">{question.answer}</p>
        </div>

        <CardActions
          revealed={revealed}
          disabled={false}
          onReveal={() => {
            revealedSignal.value = !revealed;
          }}
          onSkip={() => skipQuestion()}
          onCorrect={() => markCorrect()}
        />
      </div>

      <NextSection onNext={() => nextQuestion()} />
    </main>
  );
}
