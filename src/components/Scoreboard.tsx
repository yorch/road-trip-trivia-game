import { effect } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';
import { askedSignal, scoreSignal, streakSignal } from '../state';

export function Scoreboard() {
  const [pop, setPop] = useState(false);
  const [shake, setShake] = useState(false);

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

  useEffect(() => {
    let firstRun = true;
    const dispose = effect(() => {
      const s = streakSignal.value;

      if (firstRun) {
        firstRun = false;
        return;
      }

      if (s === 0) {
        setShake(true);
        const t = setTimeout(() => setShake(false), 400);
        return () => clearTimeout(t);
      }
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
        <span class={`value ${shake ? 'shake' : ''}`} id="streakValue">
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
