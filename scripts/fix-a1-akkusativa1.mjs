#!/usr/bin/env node
/**
 * Fix A1 AKKUSATIVA1 per manual review (select-one, input-text, dropbox).
 * Run: npm run questions:fix-akk-a1
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreAkkusativSelectOne } from './generate-a1-select-one.mjs';
import { AKKUSATIVA1 as DROPBOX_BANK } from './a1-dropbox-data-3.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'site', 'questions', 'A1', 'AKKUSATIVA1');

function loadAkkInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf('  AKKUSATIVA1: [');
  const end = src.indexOf('  ARTIKEL: [');
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
  const hint = inner.includes('Akk.') ? `Akkusativ — ${inner}` : inner;
  return `${match[1].trimEnd()} (${hint})`;
}

function dropboxMd(id, item) {
  const prefix = item.theme ? `[${item.theme}] ` : '';
  const lines = item.words.map((w) => `  - ${w}`).join('\n');
  const prompt = `${prefix}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
}

let n = 0;

n += restoreAkkusativSelectOne();

const INPUT_BANK = loadAkkInputBank();
const in041 = INPUT_BANK[40];
if (in041) {
  writeFileSync(
    join(DIR, 'a1-akk-in-041.md'),
    `---\nid: a1-akk-in-041\ntype: input-text\ncorrect:\n  - ${in041[1]}\n---\n\n${buildInputBody(in041)}\n`,
    'utf8',
  );
  n += 1;
}

for (const [idx, num] of [[43, '044'], [49, '050'], [36, '037']]) {
  const item = DROPBOX_BANK[idx];
  if (item) {
    writeFileSync(join(DIR, `a1-akk-dd-${num}.md`), dropboxMd(`a1-akk-dd-${num}`, item), 'utf8');
    n += 1;
  }
}

for (const orphan of ['a1-fill-1.md', 'a1-sort-2.md']) {
  const path = join(DIR, orphan);
  if (existsSync(path)) {
    unlinkSync(path);
    n += 1;
  }
}

console.log(`Updated ${n} A1 AKKUSATIVA1 files.`);
