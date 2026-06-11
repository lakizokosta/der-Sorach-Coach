#!/usr/bin/env node
/**
 * Fix A1 ADJEKTIVDEKLINATIONA1 per manual review (select-one, input-text, dropbox).
 * Run: npm run questions:fix-adj-a1
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreAdjektivSelectOne } from './generate-a1-select-one.mjs';
import { ADJEKTIVDEKLINATIONA1 as DROPBOX_BANK } from './a1-dropbox-data-2.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'questions', 'A1', 'ADJEKTIVDEKLINATIONA1');

function loadAdjInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf('  ADJEKTIVDEKLINATIONA1: [');
  const end = src.indexOf('  WECHSELPRÄPOSITIONEN: [');
  const block = src.slice(start, end);
  const items = [];
  const re = /\['((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)'\]/g;
  let m;
  while ((m = re.exec(block))) {
    items.push([m[1].replace(/\\'/g, "'"), m[2].replace(/\\'/g, "'")]);
  }
  return items;
}

function buildInputBody(item) {
  const raw = item[0].replace(/^\[[^\]]+]\s+/, '');
  const match = raw.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  if (!match) return raw;
  const inner = match[2].trim();
  const hint = inner.includes(',')
    ? `Adjektivdeklination — ${inner}`
    : inner;
  return `${match[1].trimEnd()} (${hint})`;
}

function dropboxMd(id, item) {
  const prefix = item.theme ? `[${item.theme}] ` : '';
  const lines = item.words.map((w) => `  - ${w}`).join('\n');
  const prompt = `${prefix}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
}

let n = 0;

n += restoreAdjektivSelectOne();

const INPUT_BANK = loadAdjInputBank();
const in033 = INPUT_BANK[32];
if (in033) {
  writeFileSync(
    join(DIR, 'a1-adj-in-033.md'),
    `---\nid: a1-adj-in-033\ntype: input-text\ncorrect:\n  - ${in033[1]}\n---\n\n${buildInputBody(in033)}\n`,
    'utf8',
  );
  n += 1;
}

const dd009 = DROPBOX_BANK[8];
if (dd009) {
  writeFileSync(join(DIR, 'a1-adj-dd-009.md'), dropboxMd('a1-adj-dd-009', dd009), 'utf8');
  n += 1;
}

console.log(`Updated ${n} A1 ADJEKTIVDEKLINATIONA1 files.`);
