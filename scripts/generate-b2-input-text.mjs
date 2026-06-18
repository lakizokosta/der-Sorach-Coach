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
import { transformHint } from './fix-input-text-hints.mjs';

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

const CLOSED_SET_TOPICS = {
  PASSIVERSATZ: 'Passiv-Ersatz',
};

const CLOSED_SET_CACHE = new Map();
function closedSetForTopic(folder) {
  if (CLOSED_SET_CACHE.has(folder)) return CLOSED_SET_CACHE.get(folder);
  const bank = getBank(folder) || [];
  const all = new Set();
  for (const q of bank) {
    const ans = Array.isArray(q.correct) ? q.correct : [q.correct];
    for (const a of ans) all.add(String(a).trim());
  }
  const sorted = [...all].sort((a, b) => a.localeCompare(b, 'de'));
  CLOSED_SET_CACHE.set(folder, sorted);
  return sorted;
}

function buildPrompt(rawPrompt, folder, correct, id) {
  // If prompt ends with `(...)` — that is the hint; pass through transformHint.
  const m = rawPrompt.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  const ans = Array.isArray(correct) ? correct : [correct];
  if (!m && !CLOSED_SET_TOPICS[folder]) return rawPrompt;
  const sentence = m ? m[1].trimEnd() : rawPrompt;
  if (CLOSED_SET_TOPICS[folder]) {
    const set = closedSetForTopic(folder);
    return `${sentence} (${CLOSED_SET_TOPICS[folder]} — ${set.join(' / ')})`;
  }
  const inner = m[2].trim();
  const hint = transformHint(inner, folder, ans, [], sentence, id);
  return `${sentence} (${hint})`;
}

let total = 0;
for (const folder of INPUT_TOPICS) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const prefix = PREFIX[folder];
  const bank = getBank(folder);
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((q, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, folder, `${id}.md`);
    if (!FORCE && existsSync(path)) return;
    const prompt = buildPrompt(q.prompt, folder, q.correct, id);
    writeFileSync(path, md(id, prompt, q.correct), 'utf8');
    n += 1;
    total += 1;
  });
  console.log(`${folder}: ${FORCE ? 'regen ' : '+'}${n} input-text`);
}
console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} input-text files: ${total}`);
