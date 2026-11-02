#!/usr/bin/env node
/**
 * Lints every Wortschatz question in `src/site/questions-vocab/` through the same
 * parser the SPA uses. Also checks that hints do not reveal the answer.
 * Exits non-zero on errors. Run after every new vocab set or question batch.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', 'src', 'site', 'questions-vocab');

/** @param {string} dir */
function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

/**
 * Returns true when a hint likely reveals the correct answer (whole-word match).
 *
 * @param {string} hint
 * @param {string} token
 * @return {boolean}
 */
function hintContainsAnswerToken(hint, token) {
  const t = String(token || '').trim().toLowerCase();
  if (t.length < 3) return false;
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(hint);
}

/**
 * Returns true when a hint likely reveals the correct answer.
 *
 * @param {!Object} q
 * @return {boolean}
 */
function hintRevealsAnswer(q) {
  const hint = String(q.hint || '').trim().toLowerCase();
  if (!hint) return false;

  if (q.type === 'select-one' || q.type === 'multi-select') {
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
    return correct.some((c) => hintContainsAnswerToken(hint, c));
  }

  if (q.type === 'input-text') {
    return (q.correct || []).some((c) => hintContainsAnswerToken(hint, c));
  }

  return false;
}

const counts = { 'select-one': 0, 'multi-select': 0, dropbox: 0, 'input-text': 0, 'text-gaps': 0 };
const setCounts = {};
let parseErrors = 0;
let hintErrors = 0;
let metaErrors = 0;
let total = 0;

for (const file of walk(ROOT)) {
  total += 1;
  const rel = relative(ROOT, file);
  const [level, setKey] = rel.split(/[\\/]/);

  try {
    const q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic: setKey, path: rel });
    counts[q.type] = (counts[q.type] || 0) + 1;

    const manifestKey = `${level}/${setKey}`;
    setCounts[manifestKey] = (setCounts[manifestKey] || 0) + 1;

    if (!q.set && !q.topic) {
      metaErrors += 1;
      console.error(`✘ ${rel}: missing "set" in frontmatter`);
    }

    if (hintRevealsAnswer(q)) {
      hintErrors += 1;
      console.error(`✘ ${rel}: hint may reveal the answer ("${q.hint}")`);
    }
  } catch (err) {
    parseErrors += 1;
    console.error(`✘ ${rel}: ${err.message}`);
  }
}

console.log(`\n${total} vocab files · select-one ${counts['select-one']}, multi-select ${counts['multi-select']}, dropbox ${counts.dropbox}, input-text ${counts['input-text']}, text-gaps ${counts['text-gaps'] || 0}`);
console.log('Sets:', Object.entries(setCounts).map(([k, n]) => `${k} (${n})`).join(', '));

const errors = parseErrors + hintErrors + metaErrors;
if (errors > 0) {
  console.error(`✘ ${parseErrors} parse, ${hintErrors} hint, ${metaErrors} meta error(s)`);
  process.exit(1);
}

console.log('✔ All vocab questions valid');
