#!/usr/bin/env node
/** Generates 50 input-text questions per A1 topic (in-001 … in-050). */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { transformHint } from './fix-input-text-hints.mjs';
import { BANK } from './a1-input-text-data.mjs';
import {
  md,
  buildInputTextPrompt,
  extractParentheticalHint,
} from './input-text-prompt-shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'A1');

const TOPICS = {
  POSSESSIVARTIKEL: 'a1-poss-in',
  PLURAL: 'a1-pl-in',
  VERBKONJUGATION: 'a1-konj-in',
  ADJEKTIVDEKLINATIONA1: 'a1-adj-in',
  WECHSELPRÄPOSITIONEN: 'a1-wech-in',
  DATIVA1: 'a1-dat-in',
  AKKUSATIVA1: 'a1-akk-in',
  ARTIKEL: 'a1-art-in',
  'W-FRAGEN': 'a1-wf-in',
  NEGATION: 'a1-neg-in',
  GEGENTEILE: 'a1-geg-in',
};

function buildPrompt(raw, topic, correct, id = '') {
  const { inner } = extractParentheticalHint(raw);
  const ans = Array.isArray(correct) ? correct : [correct];
  const hint = inner
    ? transformHint(inner, topic, ans, [], extractParentheticalHint(raw).sentence, id)
    : '';
  return buildInputTextPrompt({ topic, rawPrompt: raw, hint });
}

function writeTopic(folder, prefix, items, force = false) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, folder, `${id}.md`);
    if (!force && existsSync(path)) return;
    const { prompt, hint } = buildPrompt(item[0], folder, item[1], id);
    writeFileSync(path, md(id, prompt, item[1], hint), 'utf8');
    n += 1;
  });
  return n;
}

/** Re-apply prompts to existing files (e.g. after hint policy change). */
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
    const { prompt, hint } = buildPrompt(item[0], topicKey, item[1], id);
    writeFileSync(path, md(id, prompt, item[1], hint), 'utf8');
    n += 1;
  });
  return n;
}

export { BANK, restoreTopicHints };

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  if (process.argv.includes('--restore-hints')) {
    const topic = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);
    if (topic) {
      console.log(`Restored ${restoreTopicHints(topic)} ${topic} input-text files.`);
    } else {
      let total = 0;
      for (const t of Object.keys(TOPICS)) total += restoreTopicHints(t);
      console.log(`Restored ${total} A1 input-text files.`);
    }
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
