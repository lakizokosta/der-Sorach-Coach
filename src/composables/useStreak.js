/**
 * @fileoverview Streak tracking composable.
 *
 * Mirrors the original Blogger trainer's streak rules:
 *   - The streak increases by 1 when the user finishes at least one
 *     answered question on a new day that is exactly the day after the
 *     last active day.
 *   - If the gap is two days, Premium users may spend a freeze to keep
 *     the streak alive. Otherwise the streak resets to 1.
 *   - Every 7 streak days a Premium user automatically earns a freeze
 *     (capped at 3 freezes).
 *   - `activeDays` keeps up to 42 most recent ISO dates for the calendar.
 */

import { reactive } from 'vue';
import { loadJSON, saveJSON } from './useStorage.js';
import { usePremium } from './usePremium.js';

const KEY = 'lzd_streak';

/**
 * Default streak shape used when storage is empty.
 *
 * @return {{currentStreak:number, longestStreak:number, freezes:number,
 *           lastActiveDate:string, activeDays:Array<string>}}
 */
function defaultState() {
  return {
    currentStreak: 0,
    longestStreak: 0,
    freezes: 0,
    lastActiveDate: '',
    activeDays: [],
  };
}

const state = reactive(loadJSON(KEY, defaultState()));

/** Persists the current reactive `state` to localStorage. */
function persist(options = {}) {
  saveJSON(KEY, {
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    freezes: state.freezes,
    lastActiveDate: state.lastActiveDate,
    activeDays: state.activeDays,
  });
  if (!options.silent) {
    import('@/composables/useProgressSync.js').then((m) => m.scheduleProgressPush());
  }
}

/**
 * Returns a plain snapshot of the current streak state.
 *
 * @return {typeof state}
 */
export function getStreakSnapshot() {
  return {
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    freezes: state.freezes,
    lastActiveDate: state.lastActiveDate,
    activeDays: [...state.activeDays],
  };
}

/**
 * Replaces streak state (e.g. after a server merge) without triggering push.
 *
 * @param {Partial<typeof state>} data
 */
export function importStreakData(data) {
  Object.assign(state, defaultState(), data);
  persist({ silent: true });
}

/**
 * Returns today's date in ISO YYYY-MM-DD form (local timezone).
 *
 * @return {string}
 */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns yesterday's date in ISO YYYY-MM-DD form (local timezone).
 *
 * @return {string}
 */
function yesterdayISO() {
  return new Date(Date.now() - 86400000).toISOString().split('T')[0];
}

/**
 * Records that the user finished a training session today. Idempotent —
 * called multiple times on the same day it will only count once.
 *
 * Side effects: mutates the reactive state and persists it.
 */
export function recordActivityToday() {
  const today = todayISO();
  if (state.lastActiveDate === today) return;
  const { isPremium } = usePremium();
  const yesterday = yesterdayISO();

  if (state.lastActiveDate === yesterday) {
    state.currentStreak += 1;
  } else if (state.lastActiveDate) {
    const diffDays = Math.round((Date.parse(today) - Date.parse(state.lastActiveDate)) / 86400000);
    if (isPremium.value && state.freezes > 0 && diffDays <= 2) {
      state.freezes -= 1;
      state.currentStreak += 1;
    } else {
      state.currentStreak = 1;
    }
  } else {
    state.currentStreak = 1;
  }

  if (state.currentStreak > state.longestStreak) {
    state.longestStreak = state.currentStreak;
  }
  if (isPremium.value && state.currentStreak % 7 === 0 && state.freezes < 3) {
    state.freezes += 1;
  }
  state.lastActiveDate = today;
  if (!state.activeDays.includes(today)) state.activeDays.push(today);
  if (state.activeDays.length > 42) state.activeDays = state.activeDays.slice(-42);
  persist();
}

/**
 * Spend one freeze (Premium-only). Returns true if successful.
 *
 * @return {boolean}
 */
export function spendFreeze() {
  if (state.freezes <= 0) return false;
  state.freezes -= 1;
  persist();
  return true;
}

/**
 * Returns a string of medal emojis corresponding to the longest streak.
 * Bronze/Silver/Gold/Diamond/Crown/Star plus empty placeholders.
 *
 * @param {number} longest  Longest streak in days.
 * @return {string}
 */
export function medalsFor(longest) {
  let medals = '';
  if (longest >= 3) medals += '🥉';
  if (longest >= 7) medals += '🥈';
  if (longest >= 14) medals += '🥇';
  if (longest >= 30) medals += '💎';
  if (longest >= 60) medals += '👑';
  if (longest >= 100) medals += '🌟';
  const totalMedals = 6;
  const earned = [...medals].length;
  let result = medals;
  for (let i = earned; i < totalMedals; i++) result += ' ⬜';
  return result || '⬜ ⬜ ⬜ ⬜ ⬜ ⬜';
}

/**
 * Public hook exposing reactive streak state plus mutator helpers.
 *
 * @return {{state:object, recordActivityToday:Function,
 *           spendFreeze:Function, medalsFor:Function}}
 */
export function useStreak() {
  return { state, recordActivityToday, spendFreeze, medalsFor };
}
