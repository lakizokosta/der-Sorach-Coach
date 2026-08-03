import { describe, it, expect } from 'vitest';
import { shuffle } from '@/utils/random.js';

describe('shuffle', () => {
  it('returns array of same length without mutating input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = input.slice();
    const out = shuffle(input);
    expect(out).toHaveLength(5);
    expect(input).toEqual(copy);
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([42])).toEqual([42]);
  });
});
