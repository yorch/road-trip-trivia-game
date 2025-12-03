import { topicListSignal } from '../data/data';
import {
  currentQuestionSignal,
  difficultySignal,
  endStateSignal,
  revealedSignal,
  topicIdSignal,
} from '../state';
import { markCorrect, resetProgress, skipQuestion } from '../state/game-logic';
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
  onMissed,
  onCorrect,
}: {
  revealed: boolean;
  disabled: boolean;
  onReveal: () => void;
  onMissed: () => void;
  onCorrect: () => void;
}) => (
  <div class="actions">
    {!revealed ? (
      <button
        type="button"
        id="toggleAnswer"
        class="primary"
        disabled={disabled}
        onClick={onReveal}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Show answer
      </button>
    ) : (
      <>
        <button
          type="button"
          id="markMissed"
          class="ghost"
          disabled={disabled}
          onClick={onMissed}
        >
          Missed it
        </button>
        <div class="spacer"></div>
        <button
          type="button"
          id="markCorrect"
          class="primary"
          disabled={disabled}
          onClick={onCorrect}
        >
          I got it
        </button>
      </>
    )}
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
            onMissed={() => {}}
            onCorrect={() => {}}
          />
        </div>
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
            revealedSignal.value = true;
          }}
          onMissed={() => skipQuestion()}
          onCorrect={() => markCorrect()}
        />
      </div>
    </main>
  );
}
