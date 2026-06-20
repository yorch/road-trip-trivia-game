import { effect } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';
import { askedSignal, scoreSignal, streakSignal } from '../state';
import { FlameIcon, TrophyIcon } from './icons';

export function Scoreboard() {
  const [pop, setPop] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    let firstRun = true;
    const dispose = effect(() => {
      scoreSignal.value;
      if (firstRun) {
        firstRun = false;
        return;
      }
      setPop(true);
      const t = setTimeout(() => setPop(false), 320);
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
        <TrophyIcon size={16} class="stat-icon" />
        <span class={`value ${pop ? 'pop' : ''}`} id="scoreValue">
          {scoreSignal}
        </span>
        {pop && <span class="score-flash">+1</span>}
      </div>
      <div class="stat">
        <FlameIcon size={16} class="stat-icon" />
        <span class={`value ${shake ? 'shake' : ''}`} id="streakValue">
          {streakSignal}
        </span>
      </div>
      <div class="stat stat-asked">
        <span class="value" id="askedValue">
          {askedSignal} asked
        </span>
      </div>
    </div>
  );
}
