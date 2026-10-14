#!/usr/bin/env node
/**
 * Exports parsed question objects per CEFR level for the premium
 * `/api/questions` Worker (not shipped in the public SPA bundle).
 *
 * Output: `server-questions/{A1,A2,B1,B2}.json`
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', 'src', 'site', 'questions');
const OUT_DIR = resolve(__dirname, '..', 'server-questions');

/** @param {string} dir @return {string[]} */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

/** @param {string} topicKey @return {string} */
function normalizeTopicKey(topicKey) {
  return String(topicKey || '').toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
}

mkdirSync(OUT_DIR, { recursive: true });

/** @type {Record<string, !Array<!Object>>} */
const byLevel = { A1: [], A2: [], B1: [], B2: [] };

for (const file of walk(ROOT)) {
  const match = file.match(/[/\\]questions[/\\]([^/\\]+)[/\\]([^/\\]+)[/\\]/);
  if (!match) continue;
  const level = match[1].toUpperCase();
  const topic = match[2].toUpperCase();
  if (!byLevel[level]) continue;
  try {
    const q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: file });
    if (!q.topicKey) q.topicKey = normalizeTopicKey(topic);
    byLevel[level].push(q);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`skip ${file}: ${err.message}`);
  }
}

for (const [level, questions] of Object.entries(byLevel)) {
  const path = join(OUT_DIR, `${level}.json`);
  writeFileSync(path, JSON.stringify(questions));
  // eslint-disable-next-line no-console
  console.log(`${level}: ${questions.length} questions → ${path}`);
}
