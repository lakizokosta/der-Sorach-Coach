/**
 * Group dropbox words into display chunks for long sentences (8+ words).
 * Validation still uses the flat word list; chunks are UI-only.
 */

const ARTICLES = new Set([
  'der', 'die', 'das', 'dem', 'den', 'des',
  'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
]);

const PREPOSITIONS = new Set([
  'in', 'an', 'auf', 'unter', 'über', 'hinter', 'vor', 'neben', 'zwischen',
  'gegenüber', 'durch', 'aus', 'bei', 'nach', 'von', 'um', 'mit', 'ohne', 'für',
]);

const CONTRACTED_PREPS = new Set([
  'vom', 'zum', 'zur', 'ins', 'ans', 'am', 'im', 'beim', 'aufs',
]);

const NUMERALS = new Set(['zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn']);

/** @param {string} w */
function lw(w) {
  return String(w).toLowerCase();
}

/** @param {string} w */
function isPrep(w) {
  const lower = lw(w);
  return PREPOSITIONS.has(lower) || CONTRACTED_PREPS.has(lower);
}

/** @param {string} w */
function isLikelyAdjective(w) {
  return w === lw(w) && w.length > 2;
}

/** @param {string} w */
function isLikelyNoun(w) {
  return /^[A-ZÄÖÜ]/.test(w);
}

/**
 * @param {string[]} words
 * @param {number} i
 * @return {string[]|null}
 */
function tryVomAus(words, i) {
  if (!/^Vom$/i.test(words[i])) return null;
  for (let j = i + 1; j < words.length; j++) {
    if (lw(words[j]) === 'aus') return words.slice(i, j + 1);
  }
  return null;
}

/**
 * @param {string[]} words
 * @param {number} i
 * @return {string[]|null}
 */
function tryPrepPhrase(words, i) {
  if (!isPrep(words[i])) return null;
  const parts = [words[i]];
  let j = i + 1;

  if (CONTRACTED_PREPS.has(lw(words[i]))) {
    if (j < words.length) parts.push(words[j]);
    return parts.length > 1 ? parts : null;
  }

  if (j < words.length && (ARTICLES.has(lw(words[j])) || NUMERALS.has(lw(words[j])))) {
    parts.push(words[j]);
    j += 1;
  }

  if (j >= words.length) return parts.length > 1 ? parts : null;

  if (j + 1 < words.length && isLikelyAdjective(words[j]) && isLikelyNoun(words[j + 1])) {
    parts.push(words[j], words[j + 1]);
    return parts;
  }

  parts.push(words[j]);
  return parts;
}

/**
 * @param {string[]} words
 * @param {number} i
 * @return {string[]|null}
 */
function tryArticlePhrase(words, i) {
  if (!ARTICLES.has(lw(words[i]))) return null;
  if (i + 1 >= words.length) return null;

  if (i + 2 < words.length && isLikelyAdjective(words[i + 1]) && isLikelyNoun(words[i + 2])) {
    return words.slice(i, i + 3);
  }

  return words.slice(i, i + 2);
}

/**
 * @param {string[]} words
 * @param {number} i
 * @return {string[]|null}
 */
function tryEsVerb(words, i) {
  if (lw(words[i]) !== 'es' || i + 1 >= words.length) return null;
  return words.slice(i, i + 2);
}

/**
 * @param {string[]} words
 * @param {number} i
 * @return {string[]|null}
 */
function tryVerbMan(words, i) {
  if (i + 1 >= words.length || lw(words[i + 1]) !== 'man') return null;
  return words.slice(i, i + 2);
}

/**
 * @param {string[]} words
 * @param {number} i
 * @return {string[]}
 */
function consumeChunk(words, i) {
  const candidates = [
    tryVomAus(words, i),
    tryPrepPhrase(words, i),
    tryArticlePhrase(words, i),
    tryEsVerb(words, i),
    tryVerbMan(words, i),
  ].filter(Boolean);

  const best = candidates.sort((a, b) => b.length - a.length)[0];
  return best ?? [words[i]];
}

/**
 * @typedef {{ id: string, text: string, words: string[], start: number }} DropboxChunk
 */

/**
 * @param {string[]} words
 * @param {{ minWords?: number }} [options]
 * @return {DropboxChunk[]}
 */
export function chunkifyDropboxWords(words, { minWords = 8 } = {}) {
  if (!Array.isArray(words) || words.length === 0) return [];

  const useGrouping = words.length >= minWords;
  /** @type {DropboxChunk[]} */
  const chunks = [];
  let i = 0;

  while (i < words.length) {
    const slice = useGrouping ? consumeChunk(words, i) : [words[i]];
    chunks.push({
      id: `c-${i}`,
      text: slice.join(' '),
      words: slice,
      start: i,
    });
    i += slice.length;
  }

  return chunks;
}

/**
 * @param {DropboxChunk[]} chunks
 * @return {string[]}
 */
export function flattenDropboxChunks(chunks) {
  return chunks.flatMap((c) => c.words);
}

/**
 * @param {DropboxChunk[]} chunks
 * @param {number} chunkIndex
 * @param {number[]} commaAfterWordIndices
 * @return {boolean}
 */
export function commaAfterChunk(chunks, chunkIndex, commaAfterWordIndices) {
  const endWordIdx =
    chunks.slice(0, chunkIndex + 1).reduce((sum, c) => sum + c.words.length, 0) - 1;
  return commaAfterWordIndices.includes(endWordIdx);
}
