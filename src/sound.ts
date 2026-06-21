// Game sound effects, synthesized with the Web Audio API so there are no audio
// assets to ship or fetch (works fully offline). Gated by a persisted toggle
// that defaults to off. Distinct from read-aloud (TTS) in speech.ts.

import { effect, signal } from '@preact/signals';
import { readString, writeString } from './lib/storage';

const KEY = 'sound-enabled';

// Default OFF — opt in via the toggle.
export const soundEnabledSignal = signal<boolean>(readString(KEY) === 'true');

effect(() => writeString(KEY, String(soundEnabledSignal.value)));

let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!ctx) ctx = new AudioContext();
  // Autoplay policy: the context may start suspended until a user gesture.
  // Our sounds fire from click handlers, so resuming here is allowed.
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

// One short enveloped tone.
function tone(
  freq: number,
  delay: number,
  duration: number,
  type: OscillatorType = 'triangle',
  peak = 0.18,
): void {
  const ac = audioContext();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// A correct answer: a short ascending arpeggio, brighter for harder questions.
export function playCorrect(difficultyPoints: number): void {
  if (!soundEnabledSignal.value) return;
  const base = 440 + (difficultyPoints - 1) * 50;
  tone(base, 0, 0.12);
  tone(base * 1.26, 0.07, 0.12);
  tone(base * 1.5, 0.14, 0.16);
}

// A streak bonus: a sparkly high triad layered on top.
export function playStreak(): void {
  if (!soundEnabledSignal.value) return;
  tone(988, 0.18, 0.1, 'sine', 0.14);
  tone(1319, 0.25, 0.12, 'sine', 0.14);
  tone(1760, 0.32, 0.18, 'sine', 0.14);
}

// End of game: a brief triumphant rise.
export function playGameOver(): void {
  if (!soundEnabledSignal.value) return;
  const notes = [523, 659, 784, 1047];
  for (let i = 0; i < notes.length; i += 1) {
    tone(notes[i], i * 0.13, 0.28, 'triangle', 0.2);
  }
}
