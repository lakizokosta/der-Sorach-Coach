/**
 * @fileoverview Free-mode daily time budget (10 minutes per calendar day).
 *
 * Stored in localStorage keyed by ISO date so the limit is shared across
 * tabs on the same device — unlike the old sessionStorage approach.
 */

import { loadJSON, saveJSON } from './useStorage.js';

const KEY = 'lzd_free_daily';
export const FREE_MINUTES_PER_DAY = 10;
export const FREE_SECONDS_PER_DAY = FREE_MINUTES_PER_DAY * 60;

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function readRow() {
  const row = loadJSON(KEY, { date: '', usedSeconds: 0 });
  const today = todayISO();
  if (row.date !== today) {
    return { date: today, usedSeconds: 0 };
  }
  return {
    date: today,
    usedSeconds: Math.max(0, Math.min(FREE_SECONDS_PER_DAY, Number(row.usedSeconds) || 0)),
  };
}

/**
 * Seconds left for today's free training.
 *
 * @return {number}
 */
export function getFreeSecondsRemaining() {
  const row = readRow();
  return Math.max(0, FREE_SECONDS_PER_DAY - row.usedSeconds);
}

/**
 * Adds training seconds to today's budget (capped at the daily limit).
 *
 * @param {number} seconds
 */
export function addFreeSecondsUsed(seconds) {
  const add = Math.max(0, Math.floor(Number(seconds) || 0));
  if (!add) return;
  const row = readRow();
  row.usedSeconds = Math.min(FREE_SECONDS_PER_DAY, row.usedSeconds + add);
  saveJSON(KEY, row);
}
