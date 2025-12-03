import { effect } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';
import { askedSignal, scoreSignal, streakSignal } from '../state';

export function Scoreboard() {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    let firstRun = true;
    const dispose = effect(() => {
      // Access value to track changes
      scoreSignal.value;

      if (firstRun) {
        firstRun = false;
        return;
      }

      setPop(true);
      const t = setTimeout(() => setPop(false), 300);
      return () => clearTimeout(t);
    });
    return dispose;
  }, []);

  return (
    <div class="scoreboard">
      <div class="stat" style={{ position: 'relative' }}>
        <span class="label">Score</span>
        <span class={`value ${pop ? 'pop' : ''}`} id="scoreValue">
          {scoreSignal}
        </span>
        {pop && <span class="score-flash">+1</span>}
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
