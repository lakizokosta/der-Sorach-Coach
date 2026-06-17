#!/usr/bin/env node
/**
 * Generates A2 input-text questions (in-001 … in-050) per Premium grammar topic.
 * Run: npm run questions:generate-a2-input
 * Restore: node scripts/generate-a2-input-text.mjs --restore-hints --topic=LOKALPRÄPOSITIONENA2
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './a2-input-text-shared.mjs';
import { BANK } from './a2-input-text-data.mjs';
import { transformHint } from './fix-input-text-hints.mjs';
import { bodyWithHint, verbFormHint } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'A2');

const TOPICS = {
  ANTWORTPARTIKELN: 'a2-part-in',
  KONJUNKTIONENA2: 'a2-konj-in',
  PERFEKTA2: 'a2-perf-in',
  PRÄTERITUMA2: 'a2-prät-in',
  MODALVERBENA2: 'a2-modal-in',
  REFLEXIVPRONOMEN: 'a2-refl-in',
  KOMPARATIVA2: 'a2-komp-in',
  SUPERLATIVA2: 'a2-sup-in',
  WECHSELPRÄPOSITIONENA2: 'a2-wech-in',
  DATIVA2: 'a2-dat-in',
  AKKUSATIVA2: 'a2-akk-in',
  FESTEPRÄPOSITIONENA2: 'a2-fest-in',
  ADJEKTIVDEKLINATIONA2: 'a2-adj-in',
  POSSESSIVARTIKELA2: 'a2-poss-in',
  GENITIVA2: 'a2-gen-in',
  INDEFINITPRONOMEN: 'a2-ind-in',
  NOMENPRÄPOSITIONVERBINDUNGA2: 'a2-npv-in',
  TRENNBAREVERBEN: 'a2-trenn-in',
  TEMPORALSATZ: 'a2-temp-in',
  LOKALPRÄPOSITIONENA2: 'a2-lokal-in',
  'N-DEKLINATION': 'a2-n-in',
};

function buildPrompt(item, folder) {
  const raw = item[0].replace(/^\[[^\]]+]\s+/, '');
  const m = raw.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  const ans = Array.isArray(item[1]) ? item[1] : [item[1]];
  if (m) return `${m[1].trimEnd()} (${transformHint(m[2], folder, ans)})`;
  return bodyWithHint(raw, verbFormHint(folder, '', ans));
}

function writeTopic(folder, prefix, items) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (existsSync(path)) return;
    writeFileSync(path, md(`${prefix}-${num}`, buildPrompt(item, folder), item[1]), 'utf8');
    n += 1;
  });
  return n;
}

function restoreTopicHints(topicKey) {
  const prefix = TOPICS[topicKey];
  const items = BANK[topicKey];
  if (!prefix || !items) return 0;
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, topicKey, `${prefix}-${num}.md`);
    if (!existsSync(path)) return;
    writeFileSync(path, md(`${prefix}-${num}`, buildPrompt(item, topicKey), item[1]), 'utf8');
    n += 1;
  });
  return n;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  if (process.argv.includes('--restore-all')) {
    let total = 0;
    for (const topic of Object.keys(TOPICS)) {
      const n = restoreTopicHints(topic);
      total += n;
      console.log(`${topic}: restored ${n} input-text files`);
    }
    console.log(`\nTotal restored: ${total}`);
    process.exit(0);
  }

  if (process.argv.includes('--restore-hints')) {
    const topic = process.argv.find((a) => a.startsWith('--topic='))?.slice(8) || 'LOKALPRÄPOSITIONENA2';
    const n = restoreTopicHints(topic);
    console.log(`Restored hints in ${n} ${topic} input-text files.`);
    process.exit(0);
  }

  let total = 0;
  for (const [folder, prefix] of Object.entries(TOPICS)) {
    const items = BANK[folder];
    if (!items) throw new Error(`Missing bank for ${folder}`);
    const n = writeTopic(folder, prefix, items);
    total += n;
    console.log(`${folder}: +${n} input-text`);
  }
  console.log(`\nTotal new input-text files: ${total}`);
}

export { buildPrompt, restoreTopicHints };
