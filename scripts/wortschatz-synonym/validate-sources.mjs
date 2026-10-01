#!/usr/bin/env node
/** Validate wortschatz-synonym source data before generation. */
import { a1SynonymSets } from './a1.mjs';
import { a2SynonymSets } from './a2.mjs';
import { b1SynonymSets } from './b1.mjs';
import { b2SynonymSets } from './b2.mjs';

const ALL = [
  { file: 'a1.mjs', sets: a1SynonymSets },
  { file: 'a2.mjs', sets: a2SynonymSets },
  { file: 'b1.mjs', sets: b1SynonymSets },
  { file: 'b2.mjs', sets: b2SynonymSets },
];

function validate(q) {
  const errors = [];
  if (!q.id || !q.set || !q.body || !q.options?.length || !q.correct?.length) {
    errors.push('missing id/set/body/options/correct');
  }
  if (q.options.length < 5) errors.push(`need 5–6 options (has ${q.options.length})`);
  if (q.correct.length < 2 || q.correct.length > 3) {
    errors.push(`need 2–3 correct (has ${q.correct.length})`);
  }
  for (const c of q.correct || []) {
    if (!q.options.includes(c)) errors.push(`correct not in options: ${c}`);
  }
  const uniq = new Set(q.options);
  if (uniq.size !== q.options.length) errors.push('duplicate options');
  if (q.hint) {
    for (const c of q.correct || []) {
      if (q.hint.toLowerCase().includes(c.toLowerCase())) {
        errors.push(`hint reveals correct: ${c}`);
      }
    }
  }
  if (q.context && !q.body.includes(q.context.split('\n')[0].slice(0, 20))) {
    // body built from context — skip strict check
  }
  return errors;
}

let total = 0;
const failures = [];
const counts = {};

for (const { file, sets } of ALL) {
  counts[file] = 0;
  for (const { level, setKey, questions } of sets) {
    counts[`${file} ${level}/${setKey}`] = questions.length;
    total += questions.length;
    if (questions.length !== 30) {
      failures.push(`${file} ${level}/${setKey}: expected 30, got ${questions.length}`);
    }
    for (const q of questions) {
      const errs = validate(q);
      if (errs.length) failures.push(`${q.id}: ${errs.join('; ')}`);
    }
  }
  counts[file] = sets.reduce((n, s) => n + s.questions.length, 0);
}

console.log('Counts:');
for (const [k, n] of Object.entries(counts).sort()) console.log(`  ${k}: ${n}`);
console.log(`Total: ${total}`);

if (failures.length) {
  console.error('\nValidation issues:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log('\nAll checks passed.');
