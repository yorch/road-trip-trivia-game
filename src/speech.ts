// Text-to-speech for reading questions aloud. Standalone — callers stop speech
// on question change (the Game screen does this on cursor change).

import { effect, signal } from '@preact/signals';
import { readString, writeString } from './lib/storage';

export const isSpeakingSignal = signal(false);

// English voices, populated async (Chrome returns [] until 'voiceschanged').
export const voicesSignal = signal<SpeechSynthesisVoice[]>([]);

const VOICE_KEY = 'speech-voice';
const RATE_KEY = 'speech-rate';
const PITCH_KEY = 'speech-pitch';

function num(key: string, fallback: number): number {
  const n = Number.parseFloat(readString(key) ?? '');
  return Number.isFinite(n) ? n : fallback;
}

export const voiceNameSignal = signal<string>(readString(VOICE_KEY) ?? '');
export const rateSignal = signal<number>(num(RATE_KEY, 1));
export const pitchSignal = signal<number>(num(PITCH_KEY, 1));

effect(() => writeString(VOICE_KEY, voiceNameSignal.value));
effect(() => writeString(RATE_KEY, String(rateSignal.value)));
effect(() => writeString(PITCH_KEY, String(pitchSignal.value)));

function loadVoices(): void {
  if (!window.speechSynthesis) return;
  const all = window.speechSynthesis.getVoices();
  const english = all.filter((v) => v.lang.toLowerCase().startsWith('en'));
  voicesSignal.value = english.length > 0 ? english : all;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

// Gate stale onend/onerror events: cancel() can fire a previous utterance's
// handler on a later tick, which would wrongly clear isSpeaking.
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const chosen = voicesSignal.value.find(
    (v) => v.name === voiceNameSignal.value,
  );
  if (chosen) utterance.voice = chosen;
  utterance.rate = rateSignal.value;
  utterance.pitch = pitchSignal.value;

  const clear = () => {
    if (activeUtterance !== utterance) return;
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
