import { effect, signal } from '@preact/signals';
import { currentQuestionSignal } from './index';

export const isSpeakingSignal = signal(false);

export function speak(text: string): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = () => {
    isSpeakingSignal.value = false;
  };
  utterance.onerror = () => {
    isSpeakingSignal.value = false;
  };
  isSpeakingSignal.value = true;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  isSpeakingSignal.value = false;
}

// Cancel speech whenever the question changes
effect(() => {
  currentQuestionSignal.value; // subscribe to changes
  stopSpeech();
});
