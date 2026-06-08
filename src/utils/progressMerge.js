/**
 * @fileoverview Merge helpers for local vs server progress payloads.
 *
 * Mirrors the original Blogger trainer: never discard the learner's
 * best streak / XP when syncing across devices.
 */

/**
 * @param {object} local
 * @param {object} server
 * @return {object}
 */
export function mergeStreak(local, server) {
  const a = local || {};
  const b = server || {};
  const localDate = String(a.lastActiveDate || '');
  const serverDate = String(b.lastActiveDate || '');
  return {
    currentStreak: Math.max(Number(a.currentStreak) || 0, Number(b.currentStreak) || 0),
    longestStreak: Math.max(Number(a.longestStreak) || 0, Number(b.longestStreak) || 0),
    freezes: Math.max(Number(a.freezes) || 0, Number(b.freezes) || 0),
    lastActiveDate: localDate > serverDate ? localDate : serverDate,
    activeDays: Array.from(
      new Set([...(a.activeDays || []), ...(b.activeDays || [])]),
    )
      .sort()
      .slice(-42),
  };
}

/**
 * @param {{totalXP:number, topicCorrect:object}} local
 * @param {{totalXP:number, topicCorrect:object}} server
 * @return {{totalXP:number, topicCorrect:object}}
 */
export function mergeXp(local, server) {
  const a = local || { totalXP: 0, topicCorrect: {} };
  const b = server || { totalXP: 0, topicCorrect: {} };
  const topicCorrect = { ...(b.topicCorrect || {}) };
  Object.entries(a.topicCorrect || {}).forEach(([key, val]) => {
    topicCorrect[key] = Math.max(Number(topicCorrect[key]) || 0, Number(val) || 0);
  });
  return {
    totalXP: Math.max(Number(a.totalXP) || 0, Number(b.totalXP) || 0),
    topicCorrect,
  };
}

/**
 * @param {{date:string, count:number}} local
 * @param {{date:string, count:number}} server
 * @return {{date:string, count:number}}
 */
export function mergeDailyGoal(local, server) {
  const today = new Date().toISOString().split('T')[0];
  const a = local || { date: '', count: 0 };
  const b = server || { date: '', count: 0 };
  if (a.date === today && b.date === today) {
    return { date: today, count: Math.max(a.count, b.count) };
  }
  if (a.date === today) return { ...a };
  if (b.date === today) return { ...b };
  return { date: today, count: 0 };
}

/**
 * Safely parses a JSON progress blob from the server.
 *
 * @param {string} raw
 * @param {*} fallback
 * @return {*}
 */
export function parseProgressJson(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
