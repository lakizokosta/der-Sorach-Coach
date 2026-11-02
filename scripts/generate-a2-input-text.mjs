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
import { verbFormHint } from './topic-context-hints.mjs';
import {
  buildInputTextPrompt,
  closedSetHint,
  extractParentheticalHint,
} from './input-text-prompt-shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'A2');

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

/** Topics where the hint must enumerate the closed candidate set (built from bank). */
const CLOSED_SET_TOPICS = {
  LOKALPRÄPOSITIONENA2: 'Lokalpräposition',
  FESTEPRÄPOSITIONENA2: 'Feste Präposition',
};

const CLOSED_SET_CACHE = new Map();
function closedSetForTopic(folder) {
  if (CLOSED_SET_CACHE.has(folder)) return CLOSED_SET_CACHE.get(folder);
  const items = BANK[folder] || [];
  const all = new Set();
  for (const it of items) {
    const ans = Array.isArray(it[1]) ? it[1] : [it[1]];
    for (const a of ans) all.add(String(a).trim());
  }
  const sorted = [...all].sort((a, b) => a.localeCompare(b, 'de'));
  CLOSED_SET_CACHE.set(folder, sorted);
  return sorted;
}

function buildPrompt(item, folder, id) {
  const raw = item[0].replace(/^\[[^\]]+]\s+/, '');
  const ans = Array.isArray(item[1]) ? item[1] : [item[1]];
  const { sentence, inner } = extractParentheticalHint(raw);
  let hint;
  if (CLOSED_SET_TOPICS[folder]) {
    const set = closedSetForTopic(folder);
    hint = `${CLOSED_SET_TOPICS[folder]} — ${set.join(' / ')}`;
  } else if (inner) {
    hint = transformHint(inner, folder, ans, [], sentence, id);
  } else {
    hint = verbFormHint(folder, '', ans, [], raw, id);
  }
  return buildInputTextPrompt({ topic: folder, rawPrompt: raw, hint });
}

function writeTopic(folder, prefix, items, force = false) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, folder, `${id}.md`);
    if (!force && existsSync(path)) return;
    const { prompt, hint } = buildPrompt(item, folder, id);
    writeFileSync(path, md(id, prompt, item[1], hint), 'utf8');
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
    const id = `${prefix}-${num}`;
    const path = join(ROOT, topicKey, `${id}.md`);
    if (!existsSync(path)) return;
    const { prompt, hint } = buildPrompt(item, topicKey, id);
    writeFileSync(path, md(id, prompt, item[1], hint), 'utf8');
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

  const FORCE = process.argv.includes('--force');
  const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

  let total = 0;
  for (const [folder, prefix] of Object.entries(TOPICS)) {
    if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
    const items = BANK[folder];
    if (!items) throw new Error(`Missing bank for ${folder}`);
    const n = writeTopic(folder, prefix, items, FORCE);
    total += n;
    console.log(`${folder}: ${FORCE ? 'regen' : '+'}${n} input-text`);
  }
  console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} input-text files: ${total}`);
}

export { buildPrompt, restoreTopicHints };
