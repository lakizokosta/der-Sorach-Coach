#!/usr/bin/env node
/**
 * Fix A1 NEGATION per FIX-10 (neg-2, neg-020/035/050, dd-012).
 * Run: npm run questions:fix-neg-a1
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreNegationSelectOne } from './generate-a1-select-one.mjs';
import { NEGATION as DROPBOX_BANK } from './a1-dropbox-data-3.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'site', 'questions', 'A1', 'NEGATION');

function dropboxMd(id, item) {
  const prefix = item.theme ? `[${item.theme}] ` : '';
  const lines = item.words.map((w) => `  - ${w}`).join('\n');
  const prompt = `${prefix}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
}

let n = 0;

writeFileSync(
  join(DIR, 'a1-neg-2.md'),
  `---\nid: a1-neg-2\ntype: select-one\noptions:\n  - kein\n  - keine\n  - keinen\n  - nicht\ncorrect: keinen\n---\n\nIch habe ___ Hunger. (Negation)\n`,
  'utf8',
);
n += 1;

n += restoreNegationSelectOne();

const dd012 = DROPBOX_BANK[11];
if (dd012) {
  writeFileSync(join(DIR, 'a1-neg-dd-012.md'), dropboxMd('a1-neg-dd-012', dd012), 'utf8');
  n += 1;
}

console.log(`Updated ${n} A1 NEGATION files.`);
