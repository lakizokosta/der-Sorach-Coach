/**
 * @fileoverview Premium question loading via the Cloudflare Worker API.
 *
 * When a backend is configured, premium trainer modes fetch questions from
 * `/api/questions` (Worker → GAS verifyTrainingAccess). Free level sessions
 * still use the local lazy Markdown chunks.
 */

import { fetchQuestionsFromServer, hasBackend } from '@/utils/api.js';
import { refreshTrainingJwt } from '@/composables/usePremium.js';
import { getQuestionsByLevel, getQuestionsByTopic } from '@/data/questions.js';

/**
 * @param {{
 *   level: string,
 *   topic?: string,
 *   limit?: number,
 *   premiumCode?: string,
 *   basisCode?: string,
 *   email?: string,
 *   sessionToken?: string,
 *   trainingJwt?: string,
 * }} ctx
 * @return {Promise<!Array<!Object>>}
 */
export async function loadPremiumQuestions(ctx) {
  const level = String(ctx.level || '').toUpperCase();
  const topic = String(ctx.topic || '').trim();
  const limit = ctx.limit || 500;
  const code = String(ctx.premiumCode || '').trim().toUpperCase();

  if (!hasBackend()) {
    if (topic) return getQuestionsByTopic(level, topic);
    return getQuestionsByLevel(level);
  }

  const res = await fetchQuestionsFromServer({
    level,
    topic,
    limit,
    code,
    email: ctx.email || '',
    sessionToken: ctx.sessionToken || '',
    trainingJwt: ctx.trainingJwt || '',
    onTrainingJwt: refreshTrainingJwt,
  });

  if (!res || !res.ok || !Array.isArray(res.questions)) {
    throw new Error((res && res.error) || 'Questions could not be loaded.');
  }

  return res.questions;
}

/**
 * @param {!Array<{level:string, key:string}>} topics
 * @param {{premiumCode?:string, basisCode?:string, email?:string, sessionToken?:string}} ctx
 * @return {Promise<!Array<!Object>>}
 */
export async function loadWeakTopicsFromServer(topics, ctx) {
  const seen = new Set();
  const out = [];

  for (const t of topics) {
    const batch = await loadPremiumQuestions({
      level: t.level,
      topic: t.key,
      limit: 500,
      premiumCode: ctx.premiumCode,
      basisCode: ctx.basisCode,
      email: ctx.email,
      sessionToken: ctx.sessionToken,
    });
    for (const q of batch) {
      if (seen.has(q.id)) continue;
      seen.add(q.id);
      out.push(q);
    }
  }

  return out;
}

/**
 * @param {import('vue-router').LocationQuery|Record<string, unknown>} query
 * @return {boolean}
 */
export function shouldLoadQuestionsFromServer(query) {
  if (!hasBackend()) return false;
  const mode = String(query?.mode || '');
  return mode === 'schwaechen'
    || mode === 'placement'
    || mode === 'premium'
    || !!String(query?.topic || '').trim();
}
