#!/usr/bin/env node
/**
 * Fix A1 W-FRAGEN per FIX-09 (select-one hints, in-040, dd-014 only).
 * Run: npm run questions:fix-wf-a1
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreWFragenSelectOne } from './generate-a1-select-one.mjs';
import { W_FRAGEN as DROPBOX_BANK } from './a1-dropbox-data-3.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'questions', 'A1', 'W-FRAGEN');

function loadWfInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf("  'W-FRAGEN': [");
  const end = src.indexOf('  NEGATION: [');
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
  return `${match[1].trimEnd()} (${match[2].trim()})`;
}

function dropboxMd(id, item) {
  const prefix = item.theme ? `[${item.theme}] ` : '';
  const lines = item.words.map((w) => `  - ${w}`).join('\n');
  const prompt = `${prefix}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
}

let n = 0;

n += restoreWFragenSelectOne();

const INPUT_BANK = loadWfInputBank();
const in040 = INPUT_BANK[39];
if (in040) {
  writeFileSync(
    join(DIR, 'a1-wf-in-040.md'),
    `---\nid: a1-wf-in-040\ntype: input-text\ncorrect:\n  - ${in040[1]}\n---\n\n${buildInputBody(in040)}\n`,
    'utf8',
  );
  n += 1;
}

const dd014 = DROPBOX_BANK[13];
if (dd014) {
  writeFileSync(join(DIR, 'a1-wf-dd-014.md'), dropboxMd('a1-wf-dd-014', dd014), 'utf8');
  n += 1;
}

console.log(`Updated ${n} A1 W-FRAGEN files.`);
