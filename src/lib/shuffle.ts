// Deterministic shuffle using a Park-Miller linear congruential generator.
// A given seed always produces the same order, so a persisted game can be
// rebuilt identically on resume.

export const MAX_SEED_VALUE = 2147483647; // 2^31 - 1, the LCG modulus

// Fisher-Yates driven by a seeded LCG. A zero seed would collapse the generator
// to all-zeros, so it is normalized to a non-zero value.
export function shuffleInPlace<T>(arr: T[], seedBase = 1): T[] {
  let seed = seedBase % MAX_SEED_VALUE || 1;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 16807) % MAX_SEED_VALUE;
    const rand = seed / MAX_SEED_VALUE;
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Non-mutating shuffle returning a new array.
export function shuffled<T>(items: readonly T[], seed = 1): T[] {
  return shuffleInPlace([...items], seed);
}
