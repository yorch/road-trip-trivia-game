import type { ComponentChildren } from 'preact';
import type { Question } from '../types';
import { SpeakerIcon, SpeakerOffIcon } from './icons';

interface Props {
  question: Question;
  revealed: boolean;
  speaking: boolean;
  onSpeak: () => void;
  onStopSpeak: () => void;
  actions: ComponentChildren;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function QuestionCard({
  question,
  revealed,
  speaking,
  onSpeak,
  onStopSpeak,
  actions,
}: Props) {
  return (
    <div class="card">
      <div class="card-head">
        <div>
          <p class="card-kicker">
            {question.topicName} • {question.category}
          </p>
          <h2 class="card-title">{question.prompt}</h2>
        </div>
        <div class="card-head-right">
          <span class={`chip chip-${question.difficulty}`}>
            {cap(question.difficulty)}
          </span>
          <button
            type="button"
            class={`speaker-btn ${speaking ? 'speaking' : ''}`}
            onClick={speaking ? onStopSpeak : onSpeak}
            aria-label={speaking ? 'Stop reading' : 'Read question aloud'}
            title={speaking ? 'Stop reading' : 'Read question aloud'}
          >
            {speaking ? (
              <SpeakerOffIcon size={16} />
            ) : (
              <SpeakerIcon size={16} />
            )}
          </button>
        </div>
      </div>

      <p class="card-body">Say your answer out loud, then reveal.</p>

      {/* Answer is only rendered once revealed, so it never leaks to the
          accessibility tree or devtools beforehand. */}
      <div
        class={`answer ${revealed ? 'visible' : ''}`}
        aria-hidden={!revealed}
      >
        <p class="answer-label">Answer</p>
        <p class="answer-text">{revealed ? question.answer : ''}</p>
      </div>

      <div class="actions">{actions}</div>
    </div>
  );
}
