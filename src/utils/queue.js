/**
 * @fileoverview Adaptive question queue with repeat-on-wrong.
 *
 * Behaviour mirrors a spaced-recall flashcard pile:
 *
 *   1. Identical questions within the same task type are collapsed to one
 *      random survivor (by content, not id).
 *   2. The pile is shuffled once at construction.
 *   3. `peek()` returns the next question without consuming it.
 *   4. `consumeCorrect()` removes the head card. The question is
 *      considered solved.
 *   5. `consumeWrong()` removes the head card and re-inserts it
 *      `2–5` positions deeper in the pile so the user has to revisit
 *      it before the session ends.
 *   6. After `MAX_ATTEMPTS` wrong attempts a question is dropped to
 *      avoid an infinite loop on a question the user can't solve.
 *
 * Progress is reported against the original unique-question count
 * (`total`) — re-queued items do not inflate the displayed total.
 */

import { dedupeIdenticalQuestions } from '@/utils/dedupeQuestions.js';
import { shuffle } from '@/utils/random.js';

const MAX_ATTEMPTS = 3;
const REINSERT_MIN_OFFSET = 2;
const REINSERT_MAX_OFFSET = 5;

/**
 * Adaptive queue over a snapshot of questions.
 */
export class AdaptiveQueue {
  /**
   * @param {!Array<!Object>} questions  Unique questions; the caller
   *   must filter / dedupe before constructing.
   * @param {{ shuffle?: boolean }} [options]
   */
  constructor(questions, options = {}) {
    const initial = dedupeIdenticalQuestions(
      Array.isArray(questions) ? questions : [],
    );
    const doShuffle = options.shuffle !== false;
    this._queue = doShuffle ? shuffle(initial) : initial.slice();
    this._original = initial.slice();
    this._attempts = new Map();
    this._solved = new Set();
  }

  /**
   * @return {boolean} True while there is at least one question to ask.
   */
  hasNext() {
    return this._queue.length > 0;
  }

  /**
   * @return {?Object} The next question without consuming it.
   */
  peek() {
    return this._queue[0] || null;
  }

  /**
   * Marks the head question as correctly answered and advances.
   */
  consumeCorrect() {
    const q = this._queue.shift();
    if (q) this._solved.add(q.id);
  }

  /**
   * Marks the head question as wrong, re-queues it for another try
   * (up to MAX_ATTEMPTS), and advances.
   */
  consumeWrong() {
    const q = this._queue.shift();
    if (!q) return;
    const attempts = (this._attempts.get(q.id) || 0) + 1;
    this._attempts.set(q.id, attempts);
    if (attempts >= MAX_ATTEMPTS) return;
    const range = REINSERT_MAX_OFFSET - REINSERT_MIN_OFFSET + 1;
    const offset = REINSERT_MIN_OFFSET + Math.floor(Math.random() * range);
    const insertAt = Math.min(this._queue.length, offset);
    this._queue.splice(insertAt, 0, q);
  }

  /** @return {number} Total unique questions in this session. */
  get total() {
    return this._original.length;
  }

  /** @return {number} Number of unique questions answered correctly. */
  get solvedCount() {
    return this._solved.size;
  }

  /** @return {number} Number of items still pending (with repeats). */
  get remaining() {
    return this._queue.length;
  }

  /** @return {number} 0–100 percentage of unique questions solved. */
  get progressPct() {
    return this._original.length === 0
      ? 0
      : Math.round((this._solved.size / this._original.length) * 100);
  }
}
