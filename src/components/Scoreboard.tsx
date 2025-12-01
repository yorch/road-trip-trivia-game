import { askedSignal, scoreSignal, streakSignal } from '../state';

export function Scoreboard() {
  return (
    <div class="scoreboard">
      <div class="stat">
        <span class="label">Score</span>
        <span class="value" id="scoreValue">
          {scoreSignal}
        </span>
      </div>
      <div class="stat">
        <span class="label">Streak</span>
        <span class="value" id="streakValue">
          {streakSignal}
        </span>
      </div>
      <div class="stat">
        <span class="label">Asked</span>
        <span class="value" id="askedValue">
          {askedSignal}
        </span>
      </div>
    </div>
  );
}
