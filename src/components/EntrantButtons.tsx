import type { Entrant } from '../types';
import { XIcon } from './icons';

interface Props {
  entrants: Entrant[];
  onPick: (entrantId: string | null) => void;
}

// "Who got it?" — the host taps the entrant who answered correctly, or Nobody.
export function EntrantButtons({ entrants, onPick }: Props) {
  return (
    <div class="who-got-it">
      <p class="who-got-it-label">Who got it?</p>
      <div class="who-got-it-grid">
        {entrants.map((e) => (
          <button
            type="button"
            key={e.id}
            class="award-btn"
            onClick={() => onPick(e.id)}
          >
            {e.name}
          </button>
        ))}
        <button
          type="button"
          class="award-btn award-nobody"
          onClick={() => onPick(null)}
        >
          <XIcon size={14} class="btn-icon" /> Nobody
        </button>
      </div>
    </div>
  );
}
