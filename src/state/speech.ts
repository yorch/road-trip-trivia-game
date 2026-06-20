import { effect, signal } from '@preact/signals';
import { currentQuestionSignal } from './index';

export const isSpeakingSignal = signal(false);

// Track the utterance we're currently speaking. cancel() can fire the previous
// utterance's onend/onerror on a later tick — if that stale handler ran after a
// new speak() started, it would wrongly flip isSpeakingSignal to false. Gating
// the handlers on identity ignores events from utterances we've moved past.
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const clear = () => {
    if (activeUtterance !== utterance) return; // stale event — ignore
    activeUtterance = null;
    isSpeakingSignal.value = false;
  };
  utterance.onend = clear;
  utterance.onerror = clear;

  activeUtterance = utterance;
  isSpeakingSignal.value = true;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (!window.speechSynthesis) return;
  activeUtterance = null;
  window.speechSynthesis.cancel();
  isSpeakingSignal.value = false;
}

// Cancel speech whenever the question changes
effect(() => {
  currentQuestionSignal.value; // subscribe to changes
  stopSpeech();
});
