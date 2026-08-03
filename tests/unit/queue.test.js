import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdaptiveQueue } from '@/utils/queue.js';

function makeQuestion(id, promptSuffix = id) {
  return {
    id,
    type: 'select-one',
    prompt: `Unique prompt ${promptSuffix}`,
    options: ['a', 'b'],
    correct: 'a',
  };
}

describe('AdaptiveQueue', () => {
  it('tracks total unique questions', () => {
    const q = new AdaptiveQueue([makeQuestion('1'), makeQuestion('2')], { shuffle: false });
    expect(q.total).toBe(2);
    expect(q.hasNext()).toBe(true);
  });

  it('consumeCorrect advances and marks solved', () => {
    const q = new AdaptiveQueue([makeQuestion('only')], { shuffle: false });
    expect(q.peek()?.id).toBe('only');
    q.consumeCorrect();
    expect(q.solvedCount).toBe(1);
    expect(q.hasNext()).toBe(false);
    expect(q.progressPct).toBe(100);
  });

  it('consumeWrong re-inserts until MAX_ATTEMPTS then drops', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const q = new AdaptiveQueue([makeQuestion('retry')], { shuffle: false });

    q.consumeWrong();
    expect(q.remaining).toBe(1);
    expect(q.solvedCount).toBe(0);

    q.consumeWrong();
    expect(q.remaining).toBe(1);

    q.consumeWrong();
    expect(q.remaining).toBe(0);
  });

  it('deduplicates identical content at construction', () => {
    const base = makeQuestion('a', 'shared');
    const dup2 = { ...makeQuestion('b', 'shared'), correct: 'a' };
    const q = new AdaptiveQueue([base, dup2], { shuffle: false });
    expect(q.total).toBe(1);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
