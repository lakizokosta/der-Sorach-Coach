#!/usr/bin/env node
/**
 * Fix A1 DATIVA1 per manual review (select-one, input-text, dropbox).
 * Run: npm run questions:fix-dat-a1
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreDativSelectOne } from './generate-a1-select-one.mjs';
import { DATIVA1 as DROPBOX_BANK } from './a1-dropbox-data-3.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'questions', 'A1', 'DATIVA1');

function loadDatInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf('  DATIVA1: [');
  const end = src.indexOf('  AKKUSATIVA1: [');
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
  const hint = inner.includes('Dat.') ? `Dativ — ${inner}` : inner;
  return `${match[1].trimEnd()} (${hint})`;
}

function dropboxMd(id, item) {
  const prefix = item.theme ? `[${item.theme}] ` : '';
  const lines = item.words.map((w) => `  - ${w}`).join('\n');
  const prompt = `${prefix}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
}

let n = 0;

n += restoreDativSelectOne();

const INPUT_BANK = loadDatInputBank();
const in030 = INPUT_BANK[29];
if (in030) {
  writeFileSync(
    join(DIR, 'a1-dat-in-030.md'),
    `---\nid: a1-dat-in-030\ntype: input-text\ncorrect:\n  - ${in030[1]}\n---\n\n${buildInputBody(in030)}\n`,
    'utf8',
  );
  n += 1;
}

for (const [idx, num] of [[16, '017'], [22, '023'], [37, '038'], [39, '040']]) {
  const item = DROPBOX_BANK[idx];
  if (item) {
    writeFileSync(join(DIR, `a1-dat-dd-${num}.md`), dropboxMd(`a1-dat-dd-${num}`, item), 'utf8');
    n += 1;
  }
}

console.log(`Updated ${n} A1 DATIVA1 files.`);
