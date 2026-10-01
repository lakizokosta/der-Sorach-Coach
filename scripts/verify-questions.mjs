#!/usr/bin/env node
/**
 * Lints every Markdown question file in `src/questions/` through the
 * same parser the SPA uses at build time. Exits non-zero on the first
 * malformed file. Use as a pre-commit check.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/utils/markdownQuestion.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', 'src', 'questions');

/** Recursively yields every `.md` file under `dir` (skips `_` folders). */
function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

const counts = { 'select-one': 0, 'multi-select': 0, dropbox: 0, 'input-text': 0, 'text-gaps': 0 };
let errors = 0;
let total = 0;

/** @param {string[]} words */
function dropboxDialogueParticleBroken(words) {
  const particleRe = /^(ja|nein|doch|Ja|Nein|Doch)$/;
  const pIdx = words.findIndex((w, i) => i > 0 && particleRe.test(String(w)));
  if (pIdx < 0) return false;
  const qIdx = words.indexOf('?');
  const dotIdx = words.indexOf('.');
  const qBeforeParticle = qIdx >= 0 && qIdx < pIdx;
  const dotAfterParticle = dotIdx > pIdx;
  return !qBeforeParticle || !dotAfterParticle;
}

for (const file of walk(ROOT)) {
  total += 1;
  const rel = relative(ROOT, file);
  const [level, topic] = rel.split(/[\\/]/);
  try {
    const q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: rel });
    counts[q.type] = (counts[q.type] || 0) + 1;
    if (q.type === 'dropbox' && dropboxDialogueParticleBroken(q.words || [])) {
      errors += 1;
      // eslint-disable-next-line no-console
      console.error(
        `✘ ${rel}: dropbox mini-dialogue needs «?» before Ja/Nein/Doch and «.» after the answer`,
      );
    }
  } catch (err) {
    errors += 1;
    // eslint-disable-next-line no-console
    console.error(`✘ ${rel}: ${err.message}`);
  }
}

// eslint-disable-next-line no-console
console.log(`\n${total} files · select-one ${counts['select-one']}, multi-select ${counts['multi-select']}, dropbox ${counts.dropbox}, input-text ${counts['input-text']}, text-gaps ${counts['text-gaps'] || 0}`);
if (errors > 0) {
  // eslint-disable-next-line no-console
  console.error(`✘ ${errors} parse error(s)`);
  process.exit(1);
}
