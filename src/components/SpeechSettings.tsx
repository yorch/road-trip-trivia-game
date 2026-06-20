import { useEffect, useRef, useState } from 'preact/hooks';
import {
  pitchSignal,
  rateSignal,
  speak,
  voiceNameSignal,
  voicesSignal,
} from '../state/speech';
import { GearIcon } from './icons';

export function SpeechSettings() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const voices = voicesSignal.value;
  const voiceName = voiceNameSignal.value;
  const rate = rateSignal.value;
  const pitch = pitchSignal.value;

  // Close when clicking outside the popover.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div class="speech-settings" ref={containerRef}>
      <button
        type="button"
        class={`settings-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Read-aloud settings"
        aria-expanded={open}
        title="Read-aloud settings"
      >
        <GearIcon size={16} />
      </button>

      {open && (
        <div
          class="settings-popover"
          role="dialog"
          aria-label="Read-aloud settings"
        >
          <p class="settings-title">Read-aloud</p>

          <label class="settings-row">
            <span>Voice</span>
            <select
              value={voiceName}
              onChange={(e) => {
                voiceNameSignal.value = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="">Default (system)</option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>

          <label class="settings-row">
            <span>
              Speed <em>{rate.toFixed(1)}×</em>
            </span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onInput={(e) => {
                rateSignal.value = Number.parseFloat(
                  (e.target as HTMLInputElement).value,
                );
              }}
            />
          </label>

          <label class="settings-row">
            <span>
              Pitch <em>{pitch.toFixed(1)}</em>
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onInput={(e) => {
                pitchSignal.value = Number.parseFloat(
                  (e.target as HTMLInputElement).value,
                );
              }}
            />
          </label>

          <button
            type="button"
            class="settings-preview"
            onClick={() =>
              speak('Here is a sample question to preview the voice.')
            }
          >
            Preview voice
          </button>
        </div>
      )}
    </div>
  );
}
