import { effect, signal } from '@preact/signals';
import { currentQuestionSignal } from './index';

export const isSpeakingSignal = signal(false);

// Available voices, filtered to English. Populated asynchronously: Chrome
// returns [] from getVoices() until it fires `voiceschanged`.
export const voicesSignal = signal<SpeechSynthesisVoice[]>([]);

// Persisted preferences. Voice is stored by name (the voice object itself
// isn't serializable, and names are how we re-match on the next load — a
// device that lacks the saved voice simply falls back to the system default).
const VOICE_KEY = 'speech-voice';
const RATE_KEY = 'speech-rate';
const PITCH_KEY = 'speech-pitch';

function readStored(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function readStoredNumber(key: string, fallback: number): number {
  const raw = readStored(key, '');
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

export const voiceNameSignal = signal<string>(readStored(VOICE_KEY, ''));
export const rateSignal = signal<number>(readStoredNumber(RATE_KEY, 1));
export const pitchSignal = signal<number>(readStoredNumber(PITCH_KEY, 1));

// Persist preference changes (silent — storage may be unavailable).
effect(() => {
  const v = voiceNameSignal.value;
  try {
    localStorage.setItem(VOICE_KEY, v);
  } catch {
    // ignore
  }
});
effect(() => {
  const r = rateSignal.value;
  try {
    localStorage.setItem(RATE_KEY, String(r));
  } catch {
    // ignore
  }
});
effect(() => {
  const p = pitchSignal.value;
  try {
    localStorage.setItem(PITCH_KEY, String(p));
  } catch {
    // ignore
  }
});

function loadVoices(): void {
  if (!window.speechSynthesis) return;
  const all = window.speechSynthesis.getVoices();
  const english = all.filter((v) => v.lang.toLowerCase().startsWith('en'));
  // Fall back to the full list if a device exposes no English voices.
  voicesSignal.value = english.length > 0 ? english : all;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

// Track the utterance we're currently speaking. cancel() can fire the previous
// utterance's onend/onerror on a later tick — if that stale handler ran after a
// new speak() started, it would wrongly flip isSpeakingSignal to false. Gating
// the handlers on identity ignores events from utterances we've moved past.
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
