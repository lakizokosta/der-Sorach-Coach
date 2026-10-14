#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as D1 from './a1-dropbox-data.mjs';
import * as D2 from './a1-dropbox-data-2.mjs';
import * as D3 from './a1-dropbox-data-3.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'A1');

const DROPBOX_KEEP_THEME = new Set(['Transport', 'Reisen', 'Stadt', 'Sport', 'Wetter']);

const TOPICS = {
  POSSESSIVARTIKEL: { prefix: 'a1-poss-dd', bank: D1.POSSESSIVARTIKEL },
  PLURAL: { prefix: 'a1-pl-dd', bank: D1.PLURAL },
  VERBKONJUGATION: { prefix: 'a1-konj-dd', bank: D1.VERBKONJUGATION },
  ADJEKTIVDEKLINATIONA1: { prefix: 'a1-adj-dd', bank: D2.ADJEKTIVDEKLINATIONA1 },
  WECHSELPRÄPOSITIONEN: { prefix: 'a1-wech-dd', bank: D2.WECHSELPRÄPOSITIONEN },
  DATIVA1: { prefix: 'a1-dat-dd', bank: D3.DATIVA1 },
  AKKUSATIVA1: { prefix: 'a1-akk-dd', bank: D3.AKKUSATIVA1 },
  ARTIKEL: { prefix: 'a1-art-dd', bank: D3.ARTIKEL },
  'W-FRAGEN': { prefix: 'a1-wf-dd', bank: D3.W_FRAGEN },
  NEGATION: { prefix: 'a1-neg-dd', bank: D3.NEGATION },
  GEGENTEILE: { prefix: 'a1-geg-dd', bank: D3.GEGENTEILE },
};

function assertUnique(words, label) {
  const seen = new Set();
  for (const w of words) {
    if (seen.has(w)) throw new Error(`Duplicate word "${w}" in ${label}`);
    seen.add(w);
  }
}

function md(id, prompt, words) {
  const lines = words.map((w) => `  - ${w}`).join('\n');
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
}

let total = 0;
const errors = [];

for (const [folder, { prefix, bank }] of Object.entries(TOPICS)) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (existsSync(path)) return;
    try {
      assertUnique(item.words, `${folder} #${i + 1}`);
    } catch (e) {
      errors.push(e.message);
      return;
    }
    const themePrefix = DROPBOX_KEEP_THEME.has(item.theme) ? `[${item.theme}] ` : '';
    const prompt = `${themePrefix}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
    writeFileSync(path, md(`${prefix}-${num}`, prompt, item.words), 'utf8');
    n += 1;
    total += 1;
  });
  console.log(`${folder}: +${n}`);
}

if (errors.length) {
  console.error('\nSkipped due to duplicate words:');
  errors.forEach((e) => console.error(`  ${e}`));
}
console.log(`\nTotal new dropbox files: ${total}`);
