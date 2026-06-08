/**
 * @fileoverview Daily training goal — answer N questions per day.
 *
 * Default target: 5 questions (matches the «5 Minuten täglich» promise).
 * When the goal is met we also record streak activity for the day.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON } from './useStorage.js';
import { markActiveDay, recordActivityToday } from './useStreak.js';

const KEY = 'lzd_daily_goal';
export const DAILY_GOAL_QUESTIONS = 5;

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function defaultState() {
  return { date: '', count: 0 };
}

const state = reactive(loadJSON(KEY, defaultState()));

function persist(options = {}) {
  saveJSON(KEY, { date: state.date, count: state.count });
  if (!options.silent) {
    import('@/composables/useProgressSync.js').then((m) => m.scheduleProgressPush());
  }
}

/**
 * @return {{date:string, count:number}}
 */
export function getDailyGoalSnapshot() {
  return { date: state.date, count: state.count };
}

/**
 * @param {{date?:string, count?:number}} data
 */
export function importDailyGoalData(data) {
  if (data.date != null) state.date = String(data.date);
  if (data.count != null) state.count = Math.max(0, Number(data.count) || 0);
  persist({ silent: true });
}

/** Resets the counter when the calendar day changes. */
function ensureToday() {
  const today = todayISO();
  if (state.date !== today) {
    state.date = today;
    state.count = 0;
  }
}

/**
 * Records one answered question toward today's goal.
 * Marks the day on the activity calendar and updates streak when met.
 */
export function recordQuestionAnswered() {
  ensureToday();
  state.count += 1;
  markActiveDay();
  persist();
  if (state.count >= DAILY_GOAL_QUESTIONS) {
    recordActivityToday();
  }
}

/**
 * @return {{state: typeof state, goal:number, todayCount:number,
 *   isMet:boolean, progressPct:number, recordQuestionAnswered:Function}}
 */
export function useDailyGoal() {
  const todayCount = computed(() => {
    const today = todayISO();
    if (state.date !== today) return 0;
    return state.count;
  });
  const isMet = computed(() => todayCount.value >= DAILY_GOAL_QUESTIONS);
  const progressPct = computed(() =>
    Math.min(100, Math.round((todayCount.value / DAILY_GOAL_QUESTIONS) * 100)),
  );

  return {
    state,
    goal: DAILY_GOAL_QUESTIONS,
    todayCount,
    isMet,
    progressPct,
    recordQuestionAnswered,
  };
}
