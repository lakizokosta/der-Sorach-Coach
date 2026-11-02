/**
 * @fileoverview Reactive countdown / count-up timer used by the trainer.
 *
 * Two modes:
 *   - `mode === 'down'` : counts down from `initialSeconds` to 0 and
 *     invokes `onExpire` once it reaches zero.
 *   - `mode === 'up'`   : counts up from 0 indefinitely.
 *
 * The timer uses real wall-clock time (`Date.now()`) instead of relying on
 * the `setInterval` tick to remain accurate when the tab is throttled
 * by the browser.
 */

import { ref, onBeforeUnmount } from 'vue';

/**
 * Formats a number of seconds as MM:SS.
 *
 * @param {number} secs  Non-negative number of seconds.
 * @return {string}
 */
export function formatMmSs(secs) {
  const s = Math.max(0, secs | 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/**
 * Creates a reactive timer.
 *
 * @param {Object}   [options]
 * @param {'down'|'up'} [options.mode='up']
 * @param {number}   [options.initialSeconds=0]
 * @param {Function} [options.onExpire]  Called when a down-timer hits zero.
 * @return {{value:object, start:Function, stop:Function, reset:Function}}
 */
export function useTimer({ mode = 'up', initialSeconds = 0, onExpire } = {}) {
  const value = ref(initialSeconds);
  let startWall = 0;
  let intervalId = null;

  /** Stops the running interval (if any). */
  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  /** Starts (or restarts) the timer from its current `value`. */
  function start() {
    if (intervalId !== null) return;
    startWall = Date.now();
    const startVal = value.value;
    intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startWall) / 1000);
      if (mode === 'up') {
        value.value = startVal + elapsed;
      } else {
        const next = Math.max(0, startVal - elapsed);
        value.value = next;
        if (next <= 0) {
          stop();
          if (typeof onExpire === 'function') onExpire();
        }
      }
    }, 1000);
  }

  /**
   * Resets the timer to a given value and (optionally) keeps it running.
   *
   * @param {number} secs    New value in seconds.
   * @param {boolean} resume Whether to immediately resume ticking.
   */
  function reset(secs = initialSeconds, resume = false) {
    stop();
    value.value = secs;
    if (resume) start();
  }

  onBeforeUnmount(stop);

  return { value, start, stop, reset };
}
