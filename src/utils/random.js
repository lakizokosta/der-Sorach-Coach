/**
 * @fileoverview Tiny helpers for randomness — Fisher-Yates shuffle and a
 * "varied queue" builder that interleaves multiple-choice questions with
 * the more engaging special question types (drag-and-drop, fill-in,
 * Lückentext, Sprachbausteine).
 */

/**
 * Returns a new array containing the same items as `arr` in a random order.
 * Uses the unbiased Fisher–Yates / Knuth shuffle.
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

/**
 * Builds a question queue that guarantees at least one "special" question
 * (drag-and-drop, fill-in, Lückentext or Sprachbausteine) appears in every
 * five-question block. Multiple-choice and special questions are shuffled
 * independently and then woven together.
 *
 * Original behaviour from the Blogger trainer; preserved here so the
 * training pace stays varied even with the smaller offline dataset.
 *
 * @param {!Array<Object>} questions  All available questions for the level.
 * @return {!Array<Object>}           A new array in playable order.
 */
export function buildVariedQueue(questions) {
  const mc = [];
  const special = [];
  for (const q of questions) {
    if (q.type === 'mc') mc.push(q);
    else special.push(q);
  }
  const mcShuffled = shuffle(mc);
  const spShuffled = shuffle(special);
  if (spShuffled.length === 0) return mcShuffled;

  const result = [];
  let mcIdx = 0;
  let spIdx = 0;
  while (mcIdx < mcShuffled.length || spIdx < spShuffled.length) {
    const spPos = Math.floor(Math.random() * 5);
    for (let i = 0; i < 5; i++) {
      if (i === spPos && spIdx < spShuffled.length) {
        result.push(spShuffled[spIdx++]);
      } else if (mcIdx < mcShuffled.length) {
        result.push(mcShuffled[mcIdx++]);
      } else if (spIdx < spShuffled.length) {
        result.push(spShuffled[spIdx++]);
      }
    }
  }
  return result;
}
