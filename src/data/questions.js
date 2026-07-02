/**
 * @fileoverview Lazy question loader (per CEFR level).
 *
 * Markdown under `src/questions/<LEVEL>/<TOPIC>/` is split into async
 * Vite chunks — one per level — instead of one giant eager bundle.
 * Topic counts for the Premium grid come from glob paths only (no fetch).
 *
 * Call `ensureQuestionsLoaded(level)` or `getQuestionsByLevel(level)` before
 * training; premium-only modes should verify entitlements first.
 */

import { parseQuestionFile } from '@/utils/markdownQuestion.js';

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

/** @type {Record<string, Record<string, () => Promise<string>>>} */
const LEVEL_LOADERS = {
  A1: import.meta.glob('/src/questions/A1/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
  A2: import.meta.glob('/src/questions/A2/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
  B1: import.meta.glob('/src/questions/B1/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
  B2: import.meta.glob('/src/questions/B2/**/*.md', {
    query: '?raw',
    import: 'default',
  }),
};

/**
 * Extracts the level + topic + filename slug from an absolute import
 * path. Example: `/src/questions/A1/ARTIKEL/001-tisch.md`
 *   → { level: 'A1', topic: 'ARTIKEL', slug: '001-tisch' }
 *
 * @param {string} path
 * @return {?{level:string, topic:string, slug:string}}
 */
function parsePath(path) {
  const match = path.match(/\/questions\/([^/]+)\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return null;
  return {
    level: match[1].toUpperCase(),
    topic: match[2].toUpperCase(),
    slug: match[3],
  };
}

/**
 * @param {string} topicKey
 * @return {string}
 */
function normalizeTopicKey(topicKey) {
  return String(topicKey || '').toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
}

/**
 * @param {Record<string, () => Promise<string>>} loaders
 * @return {Promise<!Array<!Object>>}
 */
async function parseLoaderEntries(loaders) {
  const questions = [];
  for (const [path, load] of Object.entries(loaders)) {
    const meta = parsePath(path);
    if (!meta) continue;
    try {
      const raw = await load();
      const q = parseQuestionFile(raw, {
        level: meta.level,
        topic: meta.topic,
        path,
      });
      if (!q.id) q.id = `${meta.level}-${meta.topic}-${meta.slug}`;
      questions.push(q);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[questions] skipping ${path}: ${err.message}`);
    }
  }
  return questions;
}

/**
 * @return {!Object<string, !Object<string, number>>}
 */
function buildTopicCountsManifest() {
  const out = { A1: {}, A2: {}, B1: {}, B2: {} };
  for (const [level, loaders] of Object.entries(LEVEL_LOADERS)) {
    for (const path of Object.keys(loaders)) {
      const meta = parsePath(path);
      if (!meta) continue;
      if (!out[level]) out[level] = {};
      out[level][meta.topic] = (out[level][meta.topic] || 0) + 1;
    }
  }
  return out;
}

/** Topic counts from glob paths — no Markdown fetch. */
const TOPIC_COUNTS = buildTopicCountsManifest();

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
 * Loads and caches every question for a CEFR level (idempotent).
 *
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @return {Promise<!Array<!Object>>}
 */
export async function ensureQuestionsLoaded(level) {
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
 * Returns every question for a given CEFR level.
 *
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @return {Promise<!Array<!Object>>}
 */
export async function getQuestionsByLevel(level) {
  return ensureQuestionsLoaded(level);
}

/**
 * Returns every question for a given CEFR level filtered by topic.
 *
 * The match is case-insensitive and also strips a trailing CEFR
 * suffix (A1/A2/B1/B2) so a base topic key (e.g. `AKKUSATIV`) also
 * matches level-specific keys (e.g. `AKKUSATIVA1`).
 *
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @param {string} topicKey
 * @return {Promise<!Array<!Object>>}
 */
export async function getQuestionsByTopic(level, topicKey) {
  if (!topicKey) return getQuestionsByLevel(level);
  const target = normalizeTopicKey(topicKey);
  const upperLevel = String(level || '').toUpperCase();
  const all = await ensureQuestionsLoaded(upperLevel);
  return all.filter((q) => {
    if (q.level !== upperLevel) return false;
    return normalizeTopicKey(q.topic) === target;
  });
}

/**
 * Loads all four levels (e.g. placement test).
 *
 * @return {Promise<!Array<!Object>>}
 */
export async function loadAllQuestions() {
  await Promise.all(LEVELS.map((lvl) => ensureQuestionsLoaded(lvl)));
  return LEVELS.flatMap((lvl) => levelCache[lvl] || []);
}

/**
 * Returns a `{ level: { topic: count } }` summary — useful for the
 * Premium topic grid badges (no Markdown fetch).
 *
 * @return {!Object<string, !Object<string, number>>}
 */
export function getTopicCounts() {
  return TOPIC_COUNTS;
}

/**
 * Question count for a topic key from the path manifest.
 *
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @param {string} topicKey
 * @return {number}
 */
export function getTopicQuestionCount(level, topicKey) {
  const target = normalizeTopicKey(topicKey);
  const upperLevel = String(level || '').toUpperCase();
  const levelTopics = TOPIC_COUNTS[upperLevel] || {};
  let total = 0;
  for (const [topic, count] of Object.entries(levelTopics)) {
    if (normalizeTopicKey(topic) === target) total += count;
  }
  return total;
}
