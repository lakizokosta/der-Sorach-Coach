#!/usr/bin/env node
/**
 * Generates B2 dropbox questions (dd-001 … dd-050).
 * Run: npm run questions:generate-b2-dropbox
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md, assertUnique } from './b2-dropbox-shared.mjs';
import { BANK } from './b2-dropbox-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B2');

const FORCE = process.argv.includes('--force');
const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

const TOPICS = {
  TEKAMOLO: 'b2-tkml-dd',
};

let total = 0;
const errors = [];

for (const [folder, prefix] of Object.entries(TOPICS)) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const bank = BANK[folder];
  if (!bank) throw new Error(`Missing bank for ${folder}`);
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (!FORCE && existsSync(path)) return;
    try {
      assertUnique(item.words, `${folder} #${i + 1}`);
    } catch (e) {
      errors.push(e.message);
      return;
    }
    const prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
    writeFileSync(path, md(`${prefix}-${num}`, prompt, item.words, item.codes), 'utf8');
    n += 1;
    total += 1;
  });
  console.log(`${folder}: ${FORCE ? 'regen ' : '+'}${n}`);
}

if (errors.length) {
  console.error('\nSkipped due to duplicate words:');
  errors.forEach((e) => console.error(`  ${e}`));
}
console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} dropbox files: ${total}`);
if (errors.length) process.exit(1);
