#!/usr/bin/env node
/**
 * Generate Job suche Wortschatz questions into src/site/questions-vocab/
 * and merge new lemmas into vocabulary.json.
 *
 * Usage: node scripts/generate-job-suche.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { a2Questions } from './job-suche/a2.mjs';
import { b1Questions } from './job-suche/b1.mjs';
import { b2Questions } from './job-suche/b2.mjs';
import { newVocabEntries } from './job-suche/vocab.mjs';
import { renderQuestion } from './job-suche/emit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outRoot = path.join(root, 'src', 'site', 'questions-vocab');

function levelOf(id) {
  if (id.startsWith('a2-')) return 'A2';
  if (id.startsWith('b1-')) return 'B1';
  if (id.startsWith('b2-')) return 'B2';
  throw new Error(`Unknown level for id ${id}`);
}

function validate(q) {
  const errors = [];
  if (!q.id || !q.type || !q.body) errors.push('missing id/type/body');
  if (q.type === 'select-one') {
    if (!q.options?.length || !q.options.includes(q.correct)) errors.push('select-one correct∉options');
  }
  if (q.type === 'multi-select') {
    if (!q.options?.length || !q.correct?.length) errors.push('multi-select incomplete');
    for (const c of q.correct || []) {
      if (!q.options.includes(c)) errors.push(`multi-select correct missing: ${c}`);
    }
  }
  if (q.type === 'dropbox') {
    if (!q.words || q.words.length < 2) errors.push('dropbox words');
  }
  if (q.type === 'input-text') {
    const corrects = Array.isArray(q.correct) ? q.correct : [q.correct];
    if (!corrects.length) errors.push('input-text correct');
  }
  if (q.type === 'text-gaps') {
    const gaps = (q.body.match(/___/g) || []).length;
    if (gaps !== q.correct.length) errors.push(`text-gaps gap count ${gaps}≠${q.correct.length}`);
    if (gaps !== q.options.length) errors.push('text-gaps options count');
    q.options.forEach((row, i) => {
      const parts = String(row).split(',');
      if (parts.length !== 3) errors.push(`text-gaps options[${i}] need 3`);
      if (!parts.includes(q.correct[i])) errors.push(`text-gaps correct[${i}]∉options`);
    });
  }
  return errors;
}

function mergeVocabulary() {
  const vocabPath = path.join(root, 'src/site/data/vocabulary.json');
  const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
  let added = 0;
  let enriched = 0;
  for (const [lemma, entry] of Object.entries(newVocabEntries)) {
    const key = lemma.toLowerCase();
    if (!vocab[key]) {
      vocab[key] = entry;
      added += 1;
      continue;
    }
    const cur = vocab[key];
    let changed = false;
    for (const field of ['pos', 'ru', 'en', 'gender']) {
      if (entry[field] && !cur[field]) {
        cur[field] = entry[field];
        changed = true;
      }
    }
    if (changed) enriched += 1;
  }
  const sorted = Object.fromEntries(
    Object.entries(vocab).sort(([a], [b]) => a.localeCompare(b, 'de')),
  );
  fs.writeFileSync(vocabPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  return { added, enriched };
}

function main() {
  const all = [...a2Questions, ...b1Questions, ...b2Questions];
  const counts = { A2: 0, B1: 0, B2: 0, grand: 0 };
  const failures = [];

  for (const q of all) {
    const errs = validate(q);
    if (errs.length) {
      failures.push(`${q.id}: ${errs.join('; ')}`);
      continue;
    }
    const level = levelOf(q.id);
    const dir = path.join(outRoot, level, 'JOB_SUCHE');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${q.id}.md`), renderQuestion(q), 'utf8');
    counts[level] += 1;
    counts.grand += 1;
  }

  if (failures.length) {
    console.error('Validation failed:');
    for (const f of failures) console.error(' -', f);
    process.exit(1);
  }

  const vocabStats = mergeVocabulary();
  console.log(`Wrote ${counts.grand} questions → ${outRoot}/<LEVEL>/JOB_SUCHE/`);
  console.log(`Vocabulary: +${vocabStats.added} new, ${vocabStats.enriched} enriched`);
  for (const level of ['A2', 'B1', 'B2']) {
    console.log(`  ${level}: ${counts[level]}`);
  }
}

main();
