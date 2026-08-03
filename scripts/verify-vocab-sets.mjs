#!/usr/bin/env node
/**
 * Ensures `src/data/vocabularySets.js` matches the filesystem under
 * `src/questions-vocab/`. Exits non-zero on mismatch.
 */

import { readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VOCAB_SETS } from '../src/data/vocabularySets.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', 'src', 'questions-vocab');
const LEVELS = ['A1', 'A2', 'B1', 'B2'];

/**
 * @param {string} level
 * @return {string[]}
 */
function foldersForLevel(level) {
  const dir = join(ROOT, level);
  try {
    return readdirSync(dir)
      .filter((name) => {
        const full = join(dir, name);
        return statSync(full).isDirectory() && !name.startsWith('_');
      })
      .sort();
  } catch {
    return [];
  }
}

let errors = 0;

for (const level of LEVELS) {
  const registered = (VOCAB_SETS[level] || []).map((s) => s.key).sort();
  const onDisk = foldersForLevel(level);

  for (const key of registered) {
    if (!onDisk.includes(key)) {
      errors += 1;
      console.error(`✘ ${level}: catalogue entry "${key}" has no folder in questions-vocab/`);
    }
  }

  for (const folder of onDisk) {
    if (!registered.includes(folder)) {
      errors += 1;
      console.error(`✘ ${level}: folder "${folder}" is not registered in vocabularySets.js`);
    }
  }

  console.log(`${level}: ${registered.length} registered, ${onDisk.length} on disk — ${registered.join(', ') || '(none)'}`);
}

if (errors > 0) {
  console.error(`\n✘ ${errors} vocab set mismatch(es)`);
  process.exit(1);
}

console.log('\n✔ Vocab catalogue matches filesystem');
