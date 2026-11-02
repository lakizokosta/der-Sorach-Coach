/**
 * Fixed punctuation in dropbox `words` (not learner chips).
 *
 * Example: ['Kann', 'ich', 'kommen', '?', 'Ja', 'gern', '.']
 * → coreWords: ['Kann', 'ich', 'kommen', 'Ja', 'gern']
 * → punctAfter: { 2: '?', 4: '.' }
 */

const PUNCT = new Set(['.', '?', '!']);

/**
 * @param {string[]} words
 * @return {{ coreWords: string[], punctAfter: Record<number, string> }}
 */
export function extractFixedPunctuation(words) {
  if (!Array.isArray(words) || words.length === 0) {
    return { coreWords: [], punctAfter: {} };
  }

  /** @type {string[]} */
  const coreWords = [];
  /** @type {Record<number, string>} */
  const punctAfter = {};

  for (const raw of words) {
    const w = String(raw);
    if (PUNCT.has(w)) {
      if (coreWords.length === 0) continue;
      const idx = coreWords.length - 1;
      punctAfter[idx] = `${punctAfter[idx] || ''}${w}`;
      continue;
    }
    coreWords.push(w);
  }

  return { coreWords, punctAfter };
}

/**
 * Rebuild full `words` including fixed punctuation (for checks / display).
 *
 * @param {string[]} coreWords
 * @param {Record<number, string>} punctAfter
 * @return {string[]}
 */
export function rebuildWordsWithPunctuation(coreWords, punctAfter = {}) {
  /** @type {string[]} */
  const out = [];
  for (let i = 0; i < coreWords.length; i++) {
    out.push(coreWords[i]);
    const mark = punctAfter[i];
    if (mark) {
      for (const ch of mark) out.push(ch);
    }
  }
  return out;
}

/**
 * @param {number} coreIndex
 * @param {Record<number, string>} punctAfter
 * @return {string}
 */
export function punctAfterIndex(coreIndex, punctAfter = {}) {
  return punctAfter[coreIndex] || '';
}
