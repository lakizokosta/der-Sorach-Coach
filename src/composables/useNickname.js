/**
 * @fileoverview Learner display name for profile and share cards.
 * Stored locally (max 24 chars); defaults to "Lernender".
 */

import { reactive, computed } from 'vue';

import { loadJSON, saveJSON } from './useStorage.js';

const KEY = 'lzd_nickname';
const MAX_LEN = 24;

const stored = loadJSON(KEY, {});
const state = reactive({
  nickname: String(stored.nickname || '').trim().slice(0, MAX_LEN),
});

const displayName = computed(() => state.nickname.trim() || 'Lernender');

/**
 * @param {string} value
 */
function setNickname(value) {
  state.nickname = String(value || '').trim().slice(0, MAX_LEN);
  saveJSON(KEY, { nickname: state.nickname });
}

export function useNickname() {
  return { state, displayName, setNickname };
}
