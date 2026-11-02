#!/usr/bin/env node
/**
 * Generate «Wie würdest du es noch sagen?» multi-select tasks into
 * src/site/questions-vocab/<LEVEL>/<SET>/.
 *
 * Usage: node scripts/generate-wortschatz-synonym.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { a1SynonymSets } from './wortschatz-synonym/a1.mjs';
import { a2SynonymSets } from './wortschatz-synonym/a2.mjs';
import { b1SynonymSets } from './wortschatz-synonym/b1.mjs';
import { b2SynonymSets } from './wortschatz-synonym/b2.mjs';
import { renderSynonymQuestion } from './wortschatz-synonym/emit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outRoot = path.join(root, 'src', 'site', 'questions-vocab');

const ALL_SETS = [
  ...a1SynonymSets,
  ...a2SynonymSets,
  ...b1SynonymSets,
  ...b2SynonymSets,
];

function validate(q) {
  const errors = [];
  if (!q.id || !q.set || !q.body || !q.options?.length || !q.correct?.length) {
    errors.push('missing id/set/body/options/correct');
  }
  if (q.options.length < 4) errors.push('need at least 4 options');
  if (q.correct.length < 2 || q.correct.length > 3) errors.push('need 2–3 correct');
  for (const c of q.correct || []) {
    if (!q.options.includes(c)) errors.push(`correct not in options: ${c}`);
  }
  const uniq = new Set(q.options);
  if (uniq.size !== q.options.length) errors.push('duplicate options');
  return errors;
}

function main() {
  const counts = {};
  const failures = [];

  for (const { level, setKey, questions } of ALL_SETS) {
    const dir = path.join(outRoot, level, setKey);
    fs.mkdirSync(dir, { recursive: true });
    const key = `${level}/${setKey}`;
    counts[key] = 0;

    for (const q of questions) {
      const errs = validate(q);
      if (errs.length) {
        failures.push(`${q.id}: ${errs.join('; ')}`);
        continue;
      }
      const file = path.join(dir, `${q.id}.md`);
      fs.writeFileSync(file, renderSynonymQuestion(q), 'utf8');
      counts[key] += 1;
    }
  }

  if (failures.length) {
    console.error('Validation failed:');
    for (const f of failures) console.error(' -', f);
    process.exit(1);
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`Wrote ${total} synonym tasks → ${outRoot}`);
  for (const [k, n] of Object.entries(counts).sort()) {
    console.log(`  ${k}: ${n}`);
  }
}

main();
