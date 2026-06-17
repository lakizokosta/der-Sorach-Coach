#!/usr/bin/env node
/**
 * Generates B2 input-text questions (in-001 … in-050).
 * Run: npm run questions:generate-b2-input
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './b1-input-text-shared.mjs';
import { getBank, INPUT_TOPICS } from './b2-input-text-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B2');

const FORCE = process.argv.includes('--force');
const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

const PREFIX = {
  GENITIVB2: 'b2-genit-in',
  FUTURI: 'b2-fut-in',
  KONJUNKTIV2B2: 'b2-konj2-in',
  INDIREKTEREDE: 'b2-ired-in',
  PARTIZIP1: 'b2-pt1-in',
  PARTIZIP2: 'b2-pt2-in',
  PASSIVB2: 'b2-pass-in',
  RELATIVSATZB2: 'b2-rel-in',
  PASSIVERSATZ: 'b2-passv-in',
};

let total = 0;
for (const folder of INPUT_TOPICS) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const prefix = PREFIX[folder];
  const bank = getBank(folder);
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((q, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (!FORCE && existsSync(path)) return;
    writeFileSync(path, md(`${prefix}-${num}`, q.prompt, q.correct), 'utf8');
    n += 1;
    total += 1;
  });
  console.log(`${folder}: ${FORCE ? 'regen ' : '+'}${n} input-text`);
}
console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} input-text files: ${total}`);
