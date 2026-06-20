import { describe, expect, it } from 'vitest';
import type { Topic } from './types';
import { buildAngles, fillTemplate, shuffleIndices } from './utils';

describe('shuffleIndices', () => {
  it('returns an empty array for length 0', () => {
    expect(shuffleIndices(0, 1)).toEqual([]);
  });

  it('returns a permutation of 0..n-1', () => {
    const result = shuffleIndices(50, 12345);
    expect(result).toHaveLength(50);
    expect([...result].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 50 }, (_, i) => i),
    );
  });

  it('is deterministic for the same seed', () => {
    expect(shuffleIndices(30, 999)).toEqual(shuffleIndices(30, 999));
  });

  it('produces different orders for different seeds', () => {
    expect(shuffleIndices(30, 1)).not.toEqual(shuffleIndices(30, 2));
  });

  it('does not degenerate when seeded with 0', () => {
    const result = shuffleIndices(10, 0);
    // A zero seed used to collapse the LCG to all-zeros; guard keeps it valid.
    expect([...result].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 10 }, (_, i) => i),
    );
    expect(result).not.toEqual(Array.from({ length: 10 }, (_, i) => i));
  });
});

describe('fillTemplate', () => {
  it('substitutes topic, angle, and 1-based index', () => {
    expect(fillTemplate('{topic}: {angle} #{n}', 'History', 'date', 0)).toBe(
      'History: date #1',
    );
  });

  it('replaces every occurrence of a placeholder', () => {
    expect(fillTemplate('{topic} and {topic}', 'Music', 'hook', 4)).toBe(
      'Music and Music',
    );
  });
});

describe('buildAngles', () => {
  const topic: Topic = {
    id: 'demo',
    name: 'Demo',
    category: 'Music',
    tags: ['chorus', 'custom-tag'],
  };

  it('merges tags, category angles, and general angles without duplicates', () => {
    const angles = buildAngles(topic);
    // tag also present in category angles ('chorus') must appear only once
    expect(angles.filter((a) => a === 'chorus')).toHaveLength(1);
    expect(angles).toContain('custom-tag'); // tag preserved
    expect(angles).toContain('album'); // from category angles
    expect(angles).toContain('origin'); // from general angles
  });

  it('falls back to general angles for an unknown category', () => {
    const angles = buildAngles({ ...topic, category: 'Nonexistent' });
    expect(angles).toContain('legend');
    expect(angles).toContain('custom-tag');
  });
});
