import type { Entrant, EntrantScore } from '../types';
import { FlameIcon } from './icons';

interface Props {
  entrants: Entrant[];
  scores: Record<string, EntrantScore>;
  leaderId: string | null;
}

// Compact live scoreboard shown at the top of the game.
export function Scoreboard({ entrants, scores, leaderId }: Props) {
  return (
    <div class="hud-scoreboard">
      {entrants.map((e) => {
        const s = scores[e.id];
        const isLeader = e.id === leaderId && s.score > 0;
        return (
          <div class={`hud-entrant ${isLeader ? 'leader' : ''}`} key={e.id}>
            <span class="hud-name">{e.name}</span>
            <span class="hud-score">{s.score}</span>
            {s.streak >= 2 && (
              <span class="hud-streak" title={`${s.streak} in a row`}>
                <FlameIcon size={12} /> {s.streak}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
