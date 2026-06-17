#!/usr/bin/env node
/** Generates 50 input-text questions per A1 topic (in-001 … in-050). */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { transformHint } from './fix-input-text-hints.mjs';
import { BANK } from './a1-input-text-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'A1');

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

function md(id, prompt, correct) {
  const ans = (Array.isArray(correct) ? correct : [correct]).map((c) => `  - ${c}`).join('\n');
  return `---\nid: ${id}\ntype: input-text\ncorrect:\n${ans}\n---\n\n${prompt}\n`;
}

function fixPrompt(raw, topic, correct) {
  const stripped = raw.replace(/^\[[^\]]+]\s+/, '');
  const m = stripped.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  if (!m) return stripped;
  const ans = Array.isArray(correct) ? correct : [correct];
  const hint = transformHint(m[2], topic, ans);
  return `${m[1].trimEnd()} (${hint})`;
}

function writeTopic(folder, prefix, items, force = false) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (!force && existsSync(path)) return;
    const prompt = fixPrompt(item[0], folder, item[1]);
    writeFileSync(path, md(`${prefix}-${num}`, prompt, item[1]), 'utf8');
    n += 1;
  });
  return n;
}

/** Re-apply fixPrompt() to existing files (e.g. after hint policy change). */
function restoreTopicHints(topicKey) {
  const prefix = TOPICS[topicKey];
  const items = BANK[topicKey];
  if (!prefix || !items) return 0;
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, topicKey, `${prefix}-${num}.md`);
    if (!existsSync(path)) return;
    const prompt = fixPrompt(item[0], topicKey, item[1]);
    writeFileSync(path, md(`${prefix}-${num}`, prompt, item[1]), 'utf8');
    n += 1;
  });
  return n;
}


export { BANK, fixPrompt, md, restoreTopicHints };

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  if (process.argv.includes('--restore-hints')) {
    const topic = process.argv.find((a) => a.startsWith('--topic='))?.slice(8) || 'VERBKONJUGATION';
    const n = restoreTopicHints(topic);
    console.log(`Restored hints in ${n} ${topic} files.`);
    process.exit(0);
  }
  const force = process.argv.includes('--force');
  const topicArg = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);
  let total = 0;
  for (const [folder, prefix] of Object.entries(TOPICS)) {
    if (topicArg && folder !== topicArg) continue;
    const n = writeTopic(folder, prefix, BANK[folder], force);
    total += n;
    console.log(`${folder}: ${force ? '~' : '+'}${n}`);
  }
  console.log(`\nTotal ${force ? 'updated' : 'new'} input-text files: ${total}`);
}
