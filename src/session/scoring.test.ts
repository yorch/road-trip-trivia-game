import { describe, expect, it } from 'vitest';
import {
  applyCorrect,
  basePoints,
  bonusForStreak,
  emptyScore,
} from './scoring';

describe('basePoints', () => {
  it('weights by difficulty', () => {
    expect(basePoints('easy')).toBe(1);
    expect(basePoints('medium')).toBe(2);
    expect(basePoints('hard')).toBe(3);
  });
});

describe('bonusForStreak', () => {
  it('awards a bonus every 3rd consecutive correct', () => {
    expect(bonusForStreak(1)).toBe(0);
    expect(bonusForStreak(2)).toBe(0);
    expect(bonusForStreak(3)).toBe(2);
    expect(bonusForStreak(6)).toBe(2);
    expect(bonusForStreak(4)).toBe(0);
  });
});

describe('applyCorrect', () => {
  it('adds base points and increments streak/correct', () => {
    const r = applyCorrect(emptyScore(), 'medium');
    expect(r.base).toBe(2);
    expect(r.bonus).toBe(0);
    expect(r.next.score).toBe(2);
    expect(r.next.streak).toBe(1);
    expect(r.next.correct).toBe(1);
    expect(r.next.bestStreak).toBe(1);
  });

  it('adds the streak bonus on the 3rd in a row', () => {
    let s = emptyScore();
    s = applyCorrect(s, 'easy').next; // streak 1, score 1
    s = applyCorrect(s, 'easy').next; // streak 2, score 2
    const third = applyCorrect(s, 'easy'); // streak 3 -> +1 base +2 bonus
    expect(third.bonus).toBe(2);
    expect(third.next.streak).toBe(3);
    expect(third.next.score).toBe(5); // 2 + 1 + 2
  });

  it('tracks best streak across a reset', () => {
    let s = emptyScore();
    s = applyCorrect(s, 'easy').next;
    s = applyCorrect(s, 'easy').next; // bestStreak 2
    s = { ...s, streak: 0 }; // simulate a steal resetting current streak
    s = applyCorrect(s, 'easy').next; // streak back to 1
    expect(s.streak).toBe(1);
    expect(s.bestStreak).toBe(2);
  });
});
