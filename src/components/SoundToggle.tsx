import { playCorrect, soundEnabledSignal } from '../sound';
import { BellIcon, BellOffIcon } from './icons';

// Toggles game sound effects (separate from read-aloud). Plays a short sample
// when switching on so the change is audible.
export function SoundToggle() {
  const on = soundEnabledSignal.value;
  return (
    <button
      type="button"
      class={`icon-btn ${on ? 'active' : ''}`}
      onClick={() => {
        soundEnabledSignal.value = !on;
        if (!on) playCorrect(2); // was off, now on — confirm audibly
      }}
      aria-pressed={on}
      aria-label={on ? 'Mute sound effects' : 'Enable sound effects'}
      title={on ? 'Sound effects on' : 'Sound effects off'}
    >
      {on ? <BellIcon size={18} /> : <BellOffIcon size={18} />}
    </button>
  );
}
