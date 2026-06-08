/**
 * @fileoverview XP and leveling composable.
 *
 * The XP system mirrors the original trainer:
 *   - Correct answer = 1 XP (Free) or 2 XP (Premium).
 *   - Every correct answer increments a per-topic counter; a topic is
 *     considered "mastered" once 50 correct answers are recorded for it.
 *   - Levels: 1 Anfänger → 5 Meister with the same XP thresholds.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON } from './useStorage.js';

const KEY_XP = 'lzd_xp';
const KEY_TOPICS = 'lzd_topic_correct';
const MASTERY_THRESHOLD = 50;

const state = reactive({
  totalXP: loadJSON(KEY_XP, 0),
  topicCorrect: loadJSON(KEY_TOPICS, {}),
});

/** Persists the current reactive state to localStorage. */
function persist(options = {}) {
  saveJSON(KEY_XP, state.totalXP);
  saveJSON(KEY_TOPICS, state.topicCorrect);
  if (!options.silent) {
    import('@/composables/useProgressSync.js').then((m) => m.scheduleProgressPush());
  }
}

/**
 * Returns a plain snapshot of the current XP state.
 *
 * @return {{totalXP:number, topicCorrect:object}}
 */
export function getXpSnapshot() {
  return {
    totalXP: state.totalXP,
    topicCorrect: { ...state.topicCorrect },
  };
}

/**
 * Replaces XP state (e.g. after a server merge) without triggering push.
 *
 * @param {{totalXP?:number, topicCorrect?:object}} data
 */
export function importXpData(data) {
  if (data.totalXP != null) state.totalXP = Number(data.totalXP) || 0;
  if (data.topicCorrect) state.topicCorrect = { ...data.topicCorrect };
  persist({ silent: true });
}

/**
 * Returns the level descriptor corresponding to a given XP amount.
 * Object shape: `{ num, name, color, prev, next|null }`. `next === null`
 * for the maximum level.
 *
 * @param {number} xp  Total XP accumulated by the learner.
 * @return {{num:number, name:string, color:string, prev:number, next:?number}}
 */
export function getLevel(xp) {
  if (xp >= 4000) return { num: 5, name: 'Meister',           color: '#AB4DBB', next: null, prev: 4000 };
  if (xp >= 1500) return { num: 4, name: 'Profi',             color: '#e6a800', next: 4000, prev: 1500 };
  if (xp >= 500)  return { num: 3, name: 'Fortgeschrittener', color: '#607d8b', next: 1500, prev: 500 };
  if (xp >= 100)  return { num: 2, name: 'Lernender',         color: '#a0522d', next: 500,  prev: 100 };
  return            { num: 1, name: 'Anfänger',                color: '#9e9e9e', next: 100,  prev: 0 };
}

/**
 * Adds XP to the running total and (optionally) credits correct-answer
 * counts to a specific topic.
 *
 * @param {number} amount        XP to add (positive integer).
 * @param {string} [topicKey]    Canonical topic key for mastery tracking.
 * @param {number} [correctCount] Number of correct answers in this batch.
 */
export function addXP(amount, topicKey, correctCount) {
  if (!amount || amount <= 0) return;
  state.totalXP += amount;
  if (topicKey && correctCount) {
    const key = String(topicKey).toUpperCase();
    state.topicCorrect[key] = (state.topicCorrect[key] || 0) + correctCount;
  }
  persist();
}

/**
 * Whether the topic has reached mastery (50 correct answers).
 *
 * @param {string} topicKey  Canonical topic key.
 * @return {boolean}
 */
export function isTopicMastered(topicKey) {
  const key = String(topicKey).toUpperCase();
  return (state.topicCorrect[key] || 0) >= MASTERY_THRESHOLD;
}

/**
 * Public hook exposing reactive XP state plus level computeds.
 *
 * @return {{state:object, level:object, addXP:Function,
 *           isTopicMastered:Function, MASTERY_THRESHOLD:number}}
 */
export function useXp() {
  const level = computed(() => getLevel(state.totalXP));
  return { state, level, addXP, isTopicMastered, MASTERY_THRESHOLD };
}
