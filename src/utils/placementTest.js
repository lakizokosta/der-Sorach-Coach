/**
 * Niveau-Test (Premium): sample questions per CEFR band and evaluate result.
 */

import { QUESTIONS } from '@/data/questions.js';
import { shuffle } from '@/utils/random.js';

export const PLACEMENT_LEVELS = ['A1', 'A2', 'B1', 'B2'];
export const PLACEMENT_PER_LEVEL = 5;
export const PLACEMENT_PASS_RATIO = 0.6;

/**
 * @param {number} [perLevel]
 * @return {!Array<!Object>}
 */
export function buildPlacementQuestions(perLevel = PLACEMENT_PER_LEVEL) {
  const out = [];
  for (const lvl of PLACEMENT_LEVELS) {
    const pool = shuffle(QUESTIONS.filter((q) => q.level === lvl));
    out.push(...pool.slice(0, perLevel));
  }
  return out;
}

/**
 * Highest band with pass ratio; defaults to A1.
 *
 * @param {Record<string, { correct: number, total: number }>} scores
 * @return {'A1'|'A2'|'B1'|'B2'}
 */
export function evaluatePlacementLevel(scores) {
  let result = 'A1';
  for (const lvl of PLACEMENT_LEVELS) {
    const s = scores[lvl];
    if (!s || !s.total) continue;
    if (s.correct / s.total >= PLACEMENT_PASS_RATIO) {
      result = lvl;
    }
  }
  return result;
}

/**
 * @param {Record<string, { correct: number, total: number }>} scores
 * @return {!Array<{ level: string, correct: number, total: number, pct: number }>}
 */
export function placementBreakdown(scores) {
  return PLACEMENT_LEVELS.map((lvl) => {
    const s = scores[lvl] || { correct: 0, total: 0 };
    const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    return { level: lvl, correct: s.correct, total: s.total, pct };
  });
}
