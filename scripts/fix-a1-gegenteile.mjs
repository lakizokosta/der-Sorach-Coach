#!/usr/bin/env node
/**
 * Fix A1 GEGENTEILE per FIX-11 (geg-014/039, in-028, dd-012/032/036).
 * Run: npm run questions:fix-geg-a1
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreGegenteileSelectOne } from './generate-a1-select-one.mjs';
import { GEGENTEILE as DROPBOX_BANK } from './a1-dropbox-data-3.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'questions', 'A1', 'GEGENTEILE');

function loadGegInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf('  GEGENTEILE: [');
  const end = src.indexOf('\n};', start);
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

n += restoreGegenteileSelectOne();

const INPUT_BANK = loadGegInputBank();
const in028 = INPUT_BANK[27];
if (in028) {
  writeFileSync(
    join(DIR, 'a1-geg-in-028.md'),
    `---\nid: a1-geg-in-028\ntype: input-text\ncorrect:\n  - ${in028[1]}\n---\n\n${buildInputBody(in028)}\n`,
    'utf8',
  );
  n += 1;
}

for (const [idx, num] of [[11, '012'], [31, '032'], [35, '036']]) {
  const item = DROPBOX_BANK[idx];
  if (item) {
    writeFileSync(join(DIR, `a1-geg-dd-${num}.md`), dropboxMd(`a1-geg-dd-${num}`, item), 'utf8');
    n += 1;
  }
}

console.log(`Updated ${n} A1 GEGENTEILE files.`);
