// DOM rendering and button state updates
// Pure rendering logic without side effects

import type { Question, Topic } from '../../types';
import { state } from '../state';
import { ErrorHandler } from '../utils';

// Update difficulty buttons
export function updateDifficultyButtons(): void {
  document.querySelectorAll('.difficulty').forEach((btn) => {
    btn.classList.toggle(
      'active',
      (btn as HTMLElement).dataset.difficulty === state.difficulty,
    );
  });
}

// Update question mode buttons
export function updateQuestionModeButtons(): void {
  document.querySelectorAll('.question-mode').forEach((btn) => {
    btn.classList.toggle(
      'active',
      (btn as HTMLElement).dataset.mode === state.questionMode,
    );
  });
}

// Render end state (no questions or all used up)
export function renderEndState(title: string, message: string): void {
  const cardEl = document.querySelector('.card');
  const nextEl = document.querySelector('.next') as HTMLElement;
  const answerEl = document.getElementById('cardAnswer');

  if (cardEl) cardEl.classList.add('card-complete');
  if (nextEl) nextEl.style.display = 'none';
  if (answerEl) answerEl.classList.remove('visible');

  const cardTitle = document.getElementById('cardTitle');
  const cardBody = document.getElementById('cardBody');
  if (cardTitle) cardTitle.textContent = title;
  if (cardBody) cardBody.textContent = message;
}

// Render a question card
export function renderCard(question: Question): void {
  const topic = window.topicList.find((t: Topic) => t.id === state.topicId);

  // Safety check: if topic not found, handle error
  if (!topic) {
    ErrorHandler.warn(`Topic ${state.topicId} not found during render`);
    renderEndState(
      'Topic Error',
      'The selected topic could not be found. Please choose a different topic.',
    );
    return;
  }

  const cardEl = document.querySelector('.card');
  const nextEl = document.querySelector('.next') as HTMLElement;

  // Remove end-state class and show next button for regular questions
  if (cardEl) cardEl.classList.remove('card-complete');
  if (nextEl) nextEl.style.display = 'flex';

  const cardTopic = document.getElementById('cardTopic');
  const cardDifficulty = document.getElementById('cardDifficulty');
  const cardTitle = document.getElementById('cardTitle');
  const cardMeta = document.getElementById('cardMeta');
  const cardBody = document.getElementById('cardBody');
  const answerText = document.getElementById('answerText');

  if (cardTopic) cardTopic.textContent = `${topic.name} • ${topic.category}`;
  if (cardDifficulty)
    cardDifficulty.textContent =
      state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
  if (cardTitle) cardTitle.textContent = question.prompt;
  if (cardMeta) cardMeta.textContent = `Angle: ${question.angle}`;
  if (cardBody)
    cardBody.textContent = 'Give a short, precise answer, then reveal.';
  if (answerText) answerText.textContent = question.answer;
}

// Toggle answer visibility
export function toggleAnswer(forceVisible?: boolean): void {
  const answerEl = document.getElementById('cardAnswer');
  const show =
    typeof forceVisible === 'boolean' ? forceVisible : !state.revealed;
  state.revealed = show;
  if (answerEl) answerEl.classList.toggle('visible', show);

  const toggleAnswerBtn = document.getElementById('toggleAnswer');
  if (toggleAnswerBtn) {
    toggleAnswerBtn.textContent = show ? 'Hide answer' : 'Show answer';
  }
}
