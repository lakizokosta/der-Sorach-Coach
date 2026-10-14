#!/usr/bin/env node
/**
 * Converts long B1 Leseverstehen series (2–11) to text-gaps format.
 * Removes old split files b1-lesen-N-0/1/2.md.
 *
 * Run: node scripts/migrate-b1-lesen-text-gaps.mjs
 */

import { writeFileSync, unlinkSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LESEN_SERIES } from './b1-sprachbausteine-exam-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'B1', 'SPRACHBAUSTEINEB1');

function mdTextGaps({ id, hint, text, gaps }) {
  const optLines = gaps.map((g) => `  - ${g.options.join(',')}`).join('\n');
  const corLines = gaps.map((g) => `  - ${g.correct}`).join('\n');
  return `---\nid: ${id}\ntype: text-gaps\nhint: "${hint}"\noptions:\n${optLines}\ncorrect:\n${corLines}\n---\n\n${text}\n`;
}

let written = 0;
let removed = 0;

LESEN_SERIES.forEach((series, idx) => {
  const seriesNum = idx + 2;
  const id = `b1-lesen-${seriesNum}`;
  const gapCount = (series.text.match(/___/g) || []).length;
  if (gapCount !== series.gaps.length) {
    throw new Error(`${id}: ${gapCount} blanks vs ${series.gaps.length} gaps`);
  }
  for (const g of series.gaps) {
    if (g.options.length !== 3) throw new Error(`${id}: gap needs 3 options`);
    if (!g.options.includes(g.correct)) throw new Error(`${id}: correct missing in options`);
  }
  writeFileSync(join(ROOT, `${id}.md`), mdTextGaps({ id, ...series }), 'utf8');
  written += 1;

  for (let q = 0; q < 3; q++) {
    const old = join(ROOT, `${id}-${q}.md`);
    if (existsSync(old)) {
      unlinkSync(old);
      removed += 1;
    }
  }
});

// Remove any leftover split files for series 2–11
for (const f of readdirSync(ROOT)) {
  if (/^b1-lesen-(?:[2-9]|1[01])-\d\.md$/.test(f)) {
    unlinkSync(join(ROOT, f));
    removed += 1;
  }
}

console.log(`text-gaps: wrote ${written}, removed ${removed} old split files`);
