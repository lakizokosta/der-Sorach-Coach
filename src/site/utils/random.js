/**
 * @fileoverview Tiny randomness helpers — Fisher-Yates shuffle.
 *
 * The Trainer no longer needs a hand-rolled "weave special questions
 * into every 5-block" helper because:
 *   1. Question variety is implicit (the MD bank contains many types).
 *   2. The `AdaptiveQueue` shuffles once at construction and re-queues
 *      wrong answers, which already produces a varied learner cadence.
 */

/**
 * Returns a new array containing the same items as `arr` in a random
 * order. Uses the unbiased Fisher–Yates / Knuth shuffle.
 *
 * @template T
 * @param {!Array<T>} arr  Input array (not mutated).
 * @return {!Array<T>}     New, shuffled array.
 */
export function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
