import { topicList } from '../data/data';
import {
  currentQuestionSignal,
  difficultySignal,
  endStateSignal,
  revealedSignal,
  topicIdSignal,
} from '../state';
import { markCorrect, nextQuestion, skipQuestion } from '../state/game-logic';
import type { Topic } from '../types';

export function QuestionCard() {
  const question = currentQuestionSignal.value;
  const endState = endStateSignal.value;
  const revealed = revealedSignal.value;
  const topicId = topicIdSignal.value;
  const difficulty = difficultySignal.value;

  // Find topic name
  const topic = topicList?.find((t: Topic) => t.id === topicId);

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
        </div>
      </main>
    );
  }

  if (!question) {
    // Initial state or loading
    return (
      <main class="board">
        <div class="card">
          <div class="card-head">
            <div>
              <p class="card-kicker" id="cardTopic">
                Topic
              </p>
              <h2 id="cardTitle">Question will appear here</h2>
              <p class="card-meta" id="cardMeta">
                Pick a topic to start
              </p>
            </div>
            <div class="chip" id="cardDifficulty">
              Easy
            </div>
          </div>
          <p class="card-body" id="cardBody">
            Press “Next question” to kick things off.
          </p>
          <div class="answer" id="cardAnswer">
            <p class="answer-label">Answer</p>
            <p id="answerText">Hidden</p>
          </div>
          <div class="actions">
            <button type="button" id="toggleAnswer" class="ghost" disabled>
              Show answer
            </button>
            <div class="spacer"></div>
            <button type="button" id="skipQuestion" class="ghost" disabled>
              Skip
            </button>
            <button type="button" id="markCorrect" class="primary" disabled>
              I got it
            </button>
          </div>
        </div>
        <div class="next" style={{ display: 'flex' }}>
          <p>Ready for the next one?</p>
          <button
            type="button"
            id="nextQuestion"
            onClick={() => nextQuestion()}
          >
            Next question
          </button>
        </div>
      </main>
    );
  }

  return (
    <main class="board">
      <div class="card">
        <div class="card-head">
          <div>
            <p class="card-kicker" id="cardTopic">
              {topic ? `${topic.name} • ${topic.category}` : 'Unknown Topic'}
            </p>
            <h2 id="cardTitle">{question.prompt}</h2>
            <p class="card-meta" id="cardMeta">
              Angle: {question.angle}
            </p>
          </div>
          <div class="chip" id="cardDifficulty">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
        </div>
        <p class="card-body" id="cardBody">
          Give a short, precise answer, then reveal.
        </p>

        <div class={`answer ${revealed ? 'visible' : ''}`} id="cardAnswer">
          <p class="answer-label">Answer</p>
          <p id="answerText">{question.answer}</p>
        </div>

        <div class="actions">
          <button
            type="button"
            id="toggleAnswer"
            class="ghost"
            onClick={() => {
              revealedSignal.value = !revealed;
            }}
          >
            {revealed ? 'Hide answer' : 'Show answer'}
          </button>
          <div class="spacer"></div>
          <button
            type="button"
            id="skipQuestion"
            class="ghost"
            onClick={() => skipQuestion()}
          >
            Skip
          </button>
          <button
            type="button"
            id="markCorrect"
            class="primary"
            onClick={() => markCorrect()}
          >
            I got it
          </button>
        </div>
      </div>

      <div class="next" style={{ display: 'flex' }}>
        <p>Ready for the next one?</p>
        <button type="button" id="nextQuestion" onClick={() => nextQuestion()}>
          Next question
        </button>
      </div>
    </main>
  );
}
