#!/usr/bin/env node
/**
 * Coverage report: Premium topics vs questions on disk.
 *
 * Usage: npm run questions:stats
 */

import { readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PREMIUM_TOPICS } from '../src/data/premiumTopics.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', 'src', 'questions');

/** @type {Map<string, number>} key = "LEVEL/TOPIC" */
const counts = new Map();

// Count .md files per level/topic folder.
for (const level of readdirSync(ROOT)) {
  if (level.startsWith('_')) continue;
  const levelPath = join(ROOT, level);
  if (!statSync(levelPath).isDirectory()) continue;
  for (const topic of readdirSync(levelPath)) {
    const topicPath = join(levelPath, topic);
    if (!statSync(topicPath).isDirectory()) continue;
    const n = readdirSync(topicPath).filter((f) => f.endsWith('.md')).length;
    if (n > 0) counts.set(`${level.toUpperCase()}/${topic.toUpperCase()}`, n);
  }
}

const levels = ['A1', 'A2', 'B1', 'B2'];
let totalCatalog = 0;
let totalWithQuestions = 0;
let totalQuestions = 0;
const empty = [];
const filled = [];

for (const lvl of levels) {
  const topics = PREMIUM_TOPICS[lvl] || [];
  for (const t of topics) {
    totalCatalog += 1;
    const key = `${lvl}/${t.key}`;
    const n = counts.get(key) || 0;
    totalQuestions += n;
    if (n > 0) {
      totalWithQuestions += 1;
      filled.push({ lvl, key: t.key, name: t.name, n });
    } else {
      empty.push({ lvl, key: t.key, name: t.name });
    }
  }
}

// Folders on disk that don't match catalog (wrong level/topic).
const orphans = [];
for (const [path, n] of counts) {
  const [lvl, topic] = path.split('/');
  const catalog = (PREMIUM_TOPICS[lvl] || []).find((t) => t.key === topic);
  if (!catalog) orphans.push({ path, n });
}

console.log('\n📊 Question bank coverage\n');
console.log(`Premium topics in catalog: ${totalCatalog}`);
console.log(`Topics with ≥1 question:    ${totalWithQuestions} (${Math.round((totalWithQuestions / totalCatalog) * 100)}%)`);
console.log(`Total .md question files:   ${[...counts.values()].reduce((a, b) => a + b, 0)}`);
console.log('');

for (const lvl of levels) {
  const lvlEmpty = empty.filter((e) => e.lvl === lvl);
  const lvlFilled = filled.filter((e) => e.lvl === lvl);
  const lvlQs = lvlFilled.reduce((s, e) => s + e.n, 0);
  console.log(`── ${lvl} ── ${lvlFilled.length} topics · ${lvlQs} questions · Free pool mixes ALL ${lvl} topics`);
  for (const f of lvlFilled.sort((a, b) => b.n - a.n)) {
    console.log(`  ✅ ${f.key.padEnd(28)} ${String(f.n).padStart(3)}  ${f.name}`);
  }
  if (lvlEmpty.length) {
    console.log(`  ⬜ empty (${lvlEmpty.length}): ${lvlEmpty.map((e) => e.key).join(', ')}`);
  }
  console.log('');
}

if (orphans.length) {
  console.log('⚠️  Folders NOT in premium catalog (fix or move):');
  for (const o of orphans) {
    console.log(`   ${o.path} — ${o.n} file(s)`);
  }
  console.log('');
}

console.log('Free mode A1–B1: each level uses getQuestionsByLevel() → all topics shuffled together.');
console.log('Add files: src/questions/<LEVEL>/<TOPIC_KEY>/slug.md → npm run questions:verify\n');
