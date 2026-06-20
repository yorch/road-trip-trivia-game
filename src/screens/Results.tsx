import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { FlameIcon, TrophyIcon } from '../components/icons';
import {
  clearSession,
  sessionSignal,
  standings,
  startGame,
} from '../session/session';

export function Results() {
  const [, navigate] = useLocation();
  const session = sessionSignal.value;

  useEffect(() => {
    if (!session) navigate('/');
  }, [session, navigate]);

  if (!session) return null;

  const ranked = standings(session);
  const top = ranked[0];
  const winners = ranked.filter((r) => r.rank === 1);
  const isTie = winners.length > 1;

  const rematch = async () => {
    await startGame(session.config);
    navigate('/game');
  };

  return (
    <div class="screen results">
      <div class="results-crown">
        <TrophyIcon size={40} />
      </div>
      <h1 class="results-title">
        {isTie ? "It's a tie!" : `${top.entrant.name} wins!`}
      </h1>
      {!isTie && <p class="results-sub">{top.score.score} points</p>}

      <ol class="standings">
        {ranked.map((row) => (
          <li
            class={`standing ${row.rank === 1 ? 'first' : ''}`}
            key={row.entrant.id}
          >
            <span class="standing-rank">{row.rank}</span>
            <span class="standing-name">{row.entrant.name}</span>
            <span class="standing-stats">
              {row.score.bestStreak >= 2 && (
                <span class="standing-streak" title="Best streak">
                  <FlameIcon size={12} /> {row.score.bestStreak}
                </span>
              )}
              <span class="standing-correct">{row.score.correct} correct</span>
            </span>
            <span class="standing-score">{row.score.score}</span>
          </li>
        ))}
      </ol>

      <div class="results-actions">
        <button type="button" class="primary" onClick={rematch}>
          Rematch
        </button>
        <button type="button" class="ghost" onClick={() => navigate('/setup')}>
          New Game
        </button>
        <button
          type="button"
          class="ghost"
          onClick={() => {
            clearSession();
            navigate('/');
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
}
