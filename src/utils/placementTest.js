/**
 * Niveau-Test (Premium): progressive A1→B2 sampling from the full trainer bank.
 *
 * Per level: 15 random questions (unique per session, all types from the bank).
 * Order (60 total, new every session):
 *   • Starts with A1 only.
 *   • After 7 A1 questions, A2 is mixed in (A1 + A2 until A1 quota is done).
 *   • After 7 A2 questions, B1 is mixed in — and so on through B2.
 *
 * Trainer keeps shuffle off so this order is preserved.
 */

import { ensureQuestionsLoaded } from '@/data/questions.js';
import { loadPremiumQuestions } from '@/utils/premiumQuestions.js';
import { hasBackend } from '@/utils/api.js';
import { shuffle } from '@/utils/random.js';

export const PLACEMENT_LEVELS = ['A1', 'A2', 'B1', 'B2'];
export const PLACEMENT_PER_LEVEL = 15;
export const PLACEMENT_PURE_INTRO = 7;
export const PLACEMENT_MIX_COUNT = 8;
export const PLACEMENT_TOTAL = PLACEMENT_PER_LEVEL * PLACEMENT_LEVELS.length;
export const PLACEMENT_PASS_RATIO = 0.6;

/**
 * @param {!Array<!Object>} pool
 * @param {number} count
 * @return {!Array<!Object>}
 */
function pickRandomFromPool(pool, count) {
  const shuffled = shuffle(pool.slice());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * @param {string} level
 * @param {number} count
 * @return {Promise<!Array<!Object>>}
 */
async function pickRandomForLevelLocal(level, count) {
  const questions = await ensureQuestionsLoaded(level);
  return pickRandomFromPool(questions.filter((q) => q.level === level), count);
}

/**
 * Merges two question lists into one random interleaving.
 *
 * @param {!Array<!Object>} a
 * @param {!Array<!Object>} b
 * @return {!Array<!Object>}
 */
export function interleaveRandom(a, b) {
  const tagged = [
    ...a.map((q) => ({ q, g: 0 })),
    ...b.map((q) => ({ q, g: 1 })),
  ];
  return shuffle(tagged).map((t) => t.q);
}

/**
 * @param {Record<string, !Array<!Object>>} pools
 * @return {!Array<!Object>}
 */
export function buildProgressiveOrder(pools) {
  /** @type {Record<string, !Array<!Object>>} */
  const remaining = Object.fromEntries(
    PLACEMENT_LEVELS.map((lvl) => [lvl, pools[lvl].slice()]),
  );
  /** @type {Record<string, number>} */
  const shown = Object.fromEntries(PLACEMENT_LEVELS.map((lvl) => [lvl, 0]));
  /** @type {!Array<!Object>} */
  const order = [];

  /** @param {string} lvl */
  const canShow = (lvl) => {
    if (!remaining[lvl].length) return false;
    const idx = PLACEMENT_LEVELS.indexOf(lvl);
    if (idx <= 0) return true;
    const prev = PLACEMENT_LEVELS[idx - 1];
    return shown[prev] >= PLACEMENT_PURE_INTRO;
  };

  while (order.length < PLACEMENT_TOTAL) {
    const eligible = PLACEMENT_LEVELS.filter(canShow);
    if (!eligible.length) {
      throw new Error('placement order deadlock — not enough questions per level');
    }
    const lvl = eligible[Math.floor(Math.random() * eligible.length)];
    const pool = remaining[lvl];
    const pick = Math.floor(Math.random() * pool.length);
    order.push(pool.splice(pick, 1)[0]);
    shown[lvl] += 1;
  }

  return order;
}

/**
 * @param {{
 *   premiumCode?: string,
 *   basisCode?: string,
 *   email?: string,
 *   sessionToken?: string,
 * }|null} [authCtx]
 * @return {Promise<!Array<!Object>>}
 */
export async function buildPlacementQuestions(authCtx = null) {
  if (hasBackend() && authCtx) {
    const pools = Object.fromEntries(
      await Promise.all(
        PLACEMENT_LEVELS.map(async (lvl) => {
          const questions = await loadPremiumQuestions({
            level: lvl,
            limit: PLACEMENT_PER_LEVEL + 40,
            premiumCode: authCtx.premiumCode,
            basisCode: authCtx.basisCode,
            email: authCtx.email,
            sessionToken: authCtx.sessionToken,
          });
          return [lvl, pickRandomFromPool(questions, PLACEMENT_PER_LEVEL)];
        }),
      ),
    );
    return buildProgressiveOrder(pools);
  }

  const pools = Object.fromEntries(
    await Promise.all(
      PLACEMENT_LEVELS.map(async (lvl) => [
        lvl,
        await pickRandomForLevelLocal(lvl, PLACEMENT_PER_LEVEL),
      ]),
    ),
  );
  return buildProgressiveOrder(pools);
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
