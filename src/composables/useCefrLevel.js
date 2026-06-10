/**
 * @fileoverview Stored CEFR placement level (A1–B2) from the Niveau-Test.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON } from './useStorage.js';

const KEY = 'lzd_cefr_level';

/** @typedef {'A1'|'A2'|'B1'|'B2'} CefrLevel */

/**
 * @return {{ level: CefrLevel, testedAt: string, scores: object, totalCorrect: number, totalAnswered: number }}
 */
function defaultState() {
  return {
    level: '',
    testedAt: '',
    scores: {},
    totalCorrect: 0,
    totalAnswered: 0,
  };
}

const state = reactive(loadJSON(KEY, defaultState()));

function persist(options = {}) {
  saveJSON(KEY, {
    level: state.level,
    testedAt: state.testedAt,
    scores: state.scores,
    totalCorrect: state.totalCorrect,
    totalAnswered: state.totalAnswered,
  });
}

/**
 * @return {{ level: string, testedAt: string, scores: object, totalCorrect: number, totalAnswered: number }}
 */
export function getCefrLevelSnapshot() {
  return {
    level: state.level,
    testedAt: state.testedAt,
    scores: { ...state.scores },
    totalCorrect: state.totalCorrect,
    totalAnswered: state.totalAnswered,
  };
}

/**
 * @param {Partial<typeof state>} data
 */
export function importCefrLevelData(data) {
  if (data.level != null) state.level = String(data.level).toUpperCase();
  if (data.testedAt != null) state.testedAt = String(data.testedAt);
  if (data.scores) state.scores = { ...data.scores };
  if (data.totalCorrect != null) state.totalCorrect = Number(data.totalCorrect) || 0;
  if (data.totalAnswered != null) state.totalAnswered = Number(data.totalAnswered) || 0;
  persist({ silent: true });
}

/**
 * @param {CefrLevel} level
 * @param {{ scores?: object, totalCorrect?: number, totalAnswered?: number }} [meta]
 */
export function setCefrLevel(level, meta = {}) {
  state.level = String(level).toUpperCase();
  state.testedAt = new Date().toISOString().split('T')[0];
  if (meta.scores) state.scores = { ...meta.scores };
  if (meta.totalCorrect != null) state.totalCorrect = meta.totalCorrect;
  if (meta.totalAnswered != null) state.totalAnswered = meta.totalAnswered;
  persist();
}

/** @return {CefrLevel|null} */
export function getCefrLevel() {
  const lvl = String(state.level || '').toUpperCase();
  return ['A1', 'A2', 'B1', 'B2'].includes(lvl) ? /** @type {CefrLevel} */ (lvl) : null;
}

export function hasCompletedPlacement() {
  return !!getCefrLevel();
}

/**
 * @return {{ state: typeof state, level: import('vue').ComputedRef<CefrLevel|null>, hasCompletedPlacement: Function, setCefrLevel: Function }}
 */
export function useCefrLevel() {
  const level = computed(() => getCefrLevel());
  return {
    state,
    level,
    hasCompletedPlacement,
    setCefrLevel,
    getCefrLevelSnapshot,
  };
}
