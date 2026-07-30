/**
 * @fileoverview Lazy loader for Wortschatz questions (`src/questions-vocab/`).
 *
 * Kept separate from grammar questions so vocab sets never appear in the
 * free random pool or the grammar topic grid.
 */

import { parseQuestionFile } from '@/utils/markdownQuestion.js';

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

/** @type {Record<string, Record<string, () => Promise<string>>>} */
const LEVEL_LOADERS = {
  A1: import.meta.glob('/src/questions-vocab/A1/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
  A2: import.meta.glob('/src/questions-vocab/A2/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
  B1: import.meta.glob('/src/questions-vocab/B1/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
  B2: import.meta.glob('/src/questions-vocab/B2/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
};

/**
 * @param {string} path
 * @return {?{level:string, set:string, slug:string}}
 */
function parsePath(path) {
  const match = path.match(/\/questions-vocab\/([^/]+)\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return null;
  return {
    level: match[1].toUpperCase(),
    set: match[2].toUpperCase(),
    slug: match[3],
  };
}

/**
 * @param {string} setKey
 * @return {string}
 */
function normalizeSetKey(setKey) {
  return String(setKey || '').toUpperCase();
}

/**
 * @param {Record<string, () => Promise<string>>} loaders
 * @return {Promise<!Array<!Object>>}
 */
async function parseLoaderEntries(loaders) {
  const entries = Object.entries(loaders);
  const parsed = await Promise.all(
    entries.map(async ([path, load]) => {
      const meta = parsePath(path);
      if (!meta) return null;
      try {
        const raw = await load();
        const q = parseQuestionFile(raw, {
          level: meta.level,
          topic: meta.set,
          path,
        });
        if (!q.id) q.id = `${meta.level}-${meta.set}-${meta.slug}`;
        q.set = meta.set;
        return q;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[questions-vocab] skipping ${path}: ${err.message}`);
        return null;
      }
    }),
  );
  return parsed.filter(Boolean);
}

/**
 * @return {!Object<string, !Object<string, number>>}
 */
function buildSetCountsManifest() {
  const out = { A1: {}, A2: {}, B1: {}, B2: {} };
  for (const [level, loaders] of Object.entries(LEVEL_LOADERS)) {
    for (const path of Object.keys(loaders)) {
      const meta = parsePath(path);
      if (!meta) continue;
      if (!out[level]) out[level] = {};
      out[level][meta.set] = (out[level][meta.set] || 0) + 1;
    }
  }
  return out;
}

const SET_COUNTS = buildSetCountsManifest();

/** @type {Record<string, !Array<!Object>|null>} */
const levelCache = {
  A1: null,
  A2: null,
  B1: null,
  B2: null,
};

/** @type {Record<string, Promise<!Array<!Object>>>} */
const levelLoads = {};

/**
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @return {Promise<!Array<!Object>>}
 */
export async function ensureVocabQuestionsLoaded(level) {
  const upper = String(level || '').toUpperCase();
  if (levelCache[upper]) return levelCache[upper];

  if (!levelLoads[upper]) {
    const loaders = LEVEL_LOADERS[upper];
    levelLoads[upper] = loaders
      ? parseLoaderEntries(loaders)
      : Promise.resolve([]);
  }

  const questions = await levelLoads[upper];
  levelCache[upper] = Object.freeze(questions);
  return levelCache[upper];
}

/**
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @param {string} setKey
 * @return {Promise<!Array<!Object>>}
 */
export async function getQuestionsByVocabSet(level, setKey) {
  const target = normalizeSetKey(setKey);
  if (!target) return [];
  const upperLevel = String(level || '').toUpperCase();
  const all = await ensureVocabQuestionsLoaded(upperLevel);
  return all.filter((q) => normalizeSetKey(q.set || q.topic) === target);
}

/**
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @param {string} setKey
 * @return {number}
 */
export function getVocabSetQuestionCount(level, setKey) {
  const target = normalizeSetKey(setKey);
  const upperLevel = String(level || '').toUpperCase();
  return SET_COUNTS[upperLevel]?.[target] || 0;
}

/**
 * @return {!Object<string, !Object<string, number>>}
 */
export function getVocabSetCounts() {
  return SET_COUNTS;
}

export { LEVELS as VOCAB_LEVELS };
