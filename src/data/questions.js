/**
 * @fileoverview Build-time question loader.
 *
 * Scans every Markdown file under `src/questions/<LEVEL>/<TOPIC>/` at
 * **build time** with `import.meta.glob`, parses each into a canonical
 * question object via `parseQuestionFile`, and exports level / topic
 * lookup helpers used by the rest of the SPA.
 *
 * Adding a new question is as simple as creating a new `.md` file in
 * the right folder and saving — Vite picks it up via hot module
 * reload during `npm run dev`, or bakes it into the production bundle
 * during `npm run build`. No JS code change is required.
 *
 * Validation errors (missing frontmatter fields, unknown type, etc.)
 * are surfaced as warnings on the developer console at startup so the
 * SPA can still boot. The offending file is skipped.
 */

import { parseQuestionFile } from '@/utils/markdownQuestion.js';

/**
 * Raw Markdown sources keyed by file path, e.g.
 *   '/src/questions/A1/ARTIKEL/001-tisch.md': '---\nid: 001…'
 *
 * `{ eager: true }` inlines every file into the bundle so the lookup
 * is synchronous; `{ query: '?raw' }` returns the file as a string.
 */
const RAW_SOURCES = import.meta.glob('/src/questions/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

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
 * Loads, validates, and returns every Markdown question on disk.
 *
 * @return {!Array<!Object>}
 */
function loadAll() {
  const all = [];
  for (const [path, raw] of Object.entries(RAW_SOURCES)) {
    const meta = parsePath(path);
    if (!meta) continue;
    try {
      const q = parseQuestionFile(raw, {
        level: meta.level,
        topic: meta.topic,
        path,
      });
      if (!q.id) q.id = `${meta.level}-${meta.topic}-${meta.slug}`;
      all.push(q);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[questions] skipping ${path}: ${err.message}`);
    }
  }
  return all;
}

/** Full question bank, frozen so callers can't accidentally mutate it. */
export const QUESTIONS = Object.freeze(loadAll());

/**
 * Returns every question for a given CEFR level.
 *
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @return {!Array<!Object>}
 */
export function getQuestionsByLevel(level) {
  const upper = String(level || '').toUpperCase();
  return QUESTIONS.filter((q) => q.level === upper);
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
 * @return {!Array<!Object>}
 */
export function getQuestionsByTopic(level, topicKey) {
  if (!topicKey) return getQuestionsByLevel(level);
  const target = String(topicKey).toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
  const upperLevel = String(level || '').toUpperCase();
  return QUESTIONS.filter((q) => {
    if (q.level !== upperLevel) return false;
    const qTopic = String(q.topic || '').toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
    return qTopic === target;
  });
}

/**
 * Returns a `{ level: { topic: count } }` summary — useful for the
 * Premium topic grid badges.
 *
 * @return {!Object<string, !Object<string, number>>}
 */
export function getTopicCounts() {
  const out = { A1: {}, A2: {}, B1: {}, B2: {} };
  for (const q of QUESTIONS) {
    if (!out[q.level]) out[q.level] = {};
    out[q.level][q.topic] = (out[q.level][q.topic] || 0) + 1;
  }
  return out;
}
