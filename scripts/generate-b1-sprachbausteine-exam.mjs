#!/usr/bin/env node
/**
 * Writes curated B1 exam Sprachbausteine:
 *   - 20 standalone select-one (b1-sprach-051 … 070)
 *   - 10 long Leseverstehen texts as text-gaps (b1-lesen-2 … 11)
 *
 * Run: npm run questions:generate-b1-sprach-exam
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './b1-select-one-shared.mjs';
import { SPRACH_STANDALONE, LESEN_SERIES } from './b1-sprachbausteine-exam-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B1', 'SPRACHBAUSTEINEB1');

function mdTextGaps({ id, hint, text, gaps }) {
  const optLines = gaps.map((g) => `  - ${g.options.join(',')}`).join('\n');
  const corLines = gaps.map((g) => `  - ${g.correct}`).join('\n');
  return `---\nid: ${id}\ntype: text-gaps\nhint: "${hint}"\noptions:\n${optLines}\ncorrect:\n${corLines}\n---\n\n${text}\n`;
}

function assertQuestion(q, label) {
  if (!q.prompt.includes('___')) throw new Error(`${label}: prompt must contain ___`);
  if (q.options.length < 4) throw new Error(`${label}: need ≥4 options`);
  const correct = String(q.correct).trim();
  if (!q.options.some((o) => String(o).trim() === correct)) {
    throw new Error(`${label}: correct "${correct}" not in options`);
  }
  const seen = new Set();
  for (const o of q.options) {
    const t = String(o).trim();
    if (seen.has(t)) throw new Error(`${label}: duplicate option "${t}"`);
    seen.add(t);
  }
}

mkdirSync(ROOT, { recursive: true });

let total = 0;
const errors = [];

if (SPRACH_STANDALONE.length !== 20) {
  throw new Error(`Expected 20 standalone items, got ${SPRACH_STANDALONE.length}`);
}
if (LESEN_SERIES.length !== 10) {
  throw new Error(`Expected 10 Leseverstehen series, got ${LESEN_SERIES.length}`);
}

SPRACH_STANDALONE.forEach((q, i) => {
  const num = 51 + i;
  const id = `b1-sprach-${String(num).padStart(3, '0')}`;
  const path = join(ROOT, `${id}.md`);
  const label = id;
  try {
    assertQuestion(q, label);
  } catch (e) {
    errors.push(e.message);
    return;
  }
  if (existsSync(path)) return;
  writeFileSync(path, md({ id, ...q }), 'utf8');
  total += 1;
});

LESEN_SERIES.forEach((series, seriesIdx) => {
  const seriesNum = seriesIdx + 2;
  const id = `b1-lesen-${seriesNum}`;
  const path = join(ROOT, `${id}.md`);
  const gapCount = (series.text.match(/___/g) || []).length;
  if (gapCount !== series.gaps.length) {
    errors.push(`${id}: blank count mismatch`);
    return;
  }
  for (const g of series.gaps) {
    if (g.options.length !== 3) errors.push(`${id}: need 3 options per gap`);
    if (!g.options.includes(g.correct)) errors.push(`${id}: correct not in options`);
  }
  if (errors.length) return;
  if (existsSync(path)) return;
  writeFileSync(path, mdTextGaps({ id, hint: series.hint, text: series.text, gaps: series.gaps }), 'utf8');
  total += 1;
});

console.log(`SPRACHBAUSTEINEB1 exam content: +${total} new files`);
if (errors.length) {
  console.error('\nErrors:');
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}
