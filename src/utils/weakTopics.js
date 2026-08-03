/**
 * @fileoverview Helpers for the Schwächen-Modus (weakest-topic training).
 */

import { getAllTopics } from '@/data/premiumTopics.js';
import { getQuestionsByTopic, getTopicQuestionCount } from '@/data/questions.js';

/**
 * Returns the N weakest topics ranked by wrong-answer count.
 * Tie-breaker: fewer correct answers wins (less practice on the topic).
 *
 * @param {Object<string, number>} topicWrong
 * @param {Object<string, number>} topicCorrect
 * @param {number} [limit=3]
 * @return {!Array<{key:string, name:string, level:string, wrongCount:number,
 *   correctCount:number, questionCount:number}>}
 */
export function getWeakestTopics(topicWrong, topicCorrect, limit = 3) {
  const candidates = [];

  for (const t of getAllTopics()) {
    const key = t.key.toUpperCase();
    const wrong = Number(topicWrong[key]) || 0;
    if (wrong <= 0) continue;

    const questionCount = getTopicQuestionCount(t.level, t.key);
    if (questionCount === 0) continue;

    const correct = Number(topicCorrect[key]) || 0;
    candidates.push({
      key: t.key,
      name: t.name,
      level: t.level,
      wrongCount: wrong,
      correctCount: correct,
      questionCount,
      rank: wrong * 1000 - correct,
    });
  }

  candidates.sort((a, b) => b.rank - a.rank);
  return candidates.slice(0, limit).map(({ rank, ...rest }) => rest);
}

/**
 * Collects questions for the given weak-topic descriptors (deduped by id).
 *
 * @param {!Array<{level:string, key:string}>} topics
 * @return {Promise<!Array<!Object>>}
 */
export async function getQuestionsForWeakTopics(topics) {
  const seen = new Set();
  const out = [];

  for (const t of topics) {
    for (const q of await getQuestionsByTopic(t.level, t.key)) {
      if (seen.has(q.id)) continue;
      seen.add(q.id);
      out.push(q);
    }
  }
  return out;
}
