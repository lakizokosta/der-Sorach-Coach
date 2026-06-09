#!/usr/bin/env node
/** Repairs frontmatter broken by an earlier theme-tag script run. */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'A1');

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e.startsWith('_')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.md')) yield p;
  }
}

let fixed = 0;
for (const file of walk(ROOT)) {
  let raw = readFileSync(file, 'utf8');
  if (!raw.includes('---\n\n') && !/  - .+---/.test(raw) && !/correct: .+---/.test(raw)) continue;
  const next = raw
    .replace(/(\n  - [^\n]+)---\n\n/g, '$1\n---\n\n')
    .replace(/(correct: [^\n]+)---\n\n/g, '$1\n---\n\n');
  if (next !== raw) {
    writeFileSync(file, next, 'utf8');
    fixed += 1;
  }
}
console.log(`Repaired ${fixed} file(s).`);
