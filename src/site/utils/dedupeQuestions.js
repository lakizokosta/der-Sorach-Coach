/**
 * @fileoverview Removes fully identical questions within the same task type.
 *
 * Duplicates are detected by a content fingerprint (prompt, answers, word
 * banks, …) — not by question id. Different types with the same sentence
 * (e.g. select-one vs input-text) are kept separate.
 */

import { normalizeGapAnswer, stripTrailingPromptHint } from '@/utils/markdownQuestion.js';
import { shuffle } from '@/utils/random.js';

/**
 * @param {string} text
 * @return {string}
 */
function normPrompt(text) {
  return stripTrailingPromptHint(text)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * @param {string} value
 * @return {string}
 */
function normToken(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * Builds a stable fingerprint for duplicate detection within one type.
 *
 * @param {!Object} q
 * @return {string}
 */
export function questionContentFingerprint(q) {
  const type = String(q.type || '');

  switch (type) {
    case 'select-one':
      return [type, normPrompt(q.prompt), normToken(q.correct)].join('\x00');
    case 'multi-select': {
      const correct = (Array.isArray(q.correct) ? q.correct : [q.correct])
        .map(normToken)
        .sort()
        .join('\x00');
      return [type, normPrompt(q.prompt), correct].join('\x00');
    }
    case 'dropbox': {
      const words = (q.words || []).join('\x00');
      const commas = (q.commas || []).join(',');
      const codes = (q.codes || []).join(',');
      return [type, words, commas, codes].join('\x00');
    }
    case 'input-text': {
      const correct = [...(q.correct || [])]
        .map((c) => normalizeGapAnswer(c))
        .sort()
        .join('\x00');
      return [type, normPrompt(q.prompt), correct].join('\x00');
    }
    case 'text-gaps': {
      const corrects = (q.gaps || []).map((g) => normToken(g.correct)).join('\x00');
      return [type, normPrompt(q.prompt), corrects].join('\x00');
    }
    default:
      return `${type}\x00${q.id}`;
  }
}

/**
 * Keeps one random survivor per identical content group (same type only).
 *
 * @param {!Array<!Object>} questions
 * @return {!Array<!Object>}
 */
export function dedupeIdenticalQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return [];

  const seen = new Set();
  const out = [];

  for (const q of shuffle(questions)) {
    const key = questionContentFingerprint(q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }

  return out;
}
