#!/usr/bin/env node
/**
 * Writes telc B2 Sprachbausteine exam tasks:
 *   - 20× Teil 1 grammar (b2-sb1-01 … 20) — text-gaps
 *   - 20× Teil 2 vocabulary (b2-sb2-01 … 20) — text-gaps
 *
 * Run: npm run questions:generate-b2-sprach-exam
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TEIL1, TEIL2, validateTasks } from './b2-sprachbausteine-exam-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B2', 'SPRACHBAUSTEINEB2');

function mdTextGaps({ id, hint, text, gaps }) {
  const optLines = gaps.map((g) => `  - ${g.options.join(',')}`).join('\n');
  const corLines = gaps.map((g) => `  - ${g.correct}`).join('\n');
  const safeHint = hint.replace(/"/g, '\\"');
  return `---\nid: ${id}\ntype: text-gaps\nhint: "${safeHint}"\noptions:\n${optLines}\ncorrect:\n${corLines}\n---\n\n${text}\n`;
}

validateTasks(TEIL1, 'TEIL1');
validateTasks(TEIL2, 'TEIL2');

mkdirSync(ROOT, { recursive: true });

let total = 0;
const errors = [];

function writeSeries(list, prefix) {
  list.forEach((task, i) => {
    const num = String(i + 1).padStart(2, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, `${id}.md`);
    if (existsSync(path)) return;
    try {
      writeFileSync(path, mdTextGaps({ id, ...task }), 'utf8');
      total += 1;
    } catch (e) {
      errors.push(`${id}: ${e.message}`);
    }
  });
}

writeSeries(TEIL1, 'b2-sb1');
writeSeries(TEIL2, 'b2-sb2');

console.log(`SPRACHBAUSTEINEB2: +${total} text-gaps (Teil 1 + Teil 2)`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
