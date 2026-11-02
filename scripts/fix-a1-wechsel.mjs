#!/usr/bin/env node
/**
 * Fix A1 WECHSELPRÄPOSITIONEN per FIX-5 (Wo/Wohin, dd-031).
 * Run: npm run questions:fix-wech-a1
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreWechselSelectOne } from './generate-a1-select-one.mjs';
import { WECHSELPRÄPOSITIONEN as DROPBOX_BANK } from './a1-dropbox-data-2.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'site', 'questions', 'A1', 'WECHSELPRÄPOSITIONEN');

/** @param {{ id: string, theme: string, sent: string, correct: string, options: string[], hint: string }} q */
function selectMd(q) {
  const opts = q.options.map((o) => `  - ${o}`).join('\n');
  return `---\nid: ${q.id}\ntype: select-one\noptions:\n${opts}\ncorrect: ${q.correct}\n---\n\n${q.sent} (${q.hint})\n`;
}

const SELECT_OVERRIDES = {
  'a1-wech-007': {
    theme: 'Zuhause',
    sent: 'Das Bild hängt ___ Wand.',
    correct: 'an der',
    options: ['an der', 'an die', 'am', 'auf der'],
    hint: 'Dativ oder Akkusativ?',
  },
  'a1-wech-009': {
    theme: 'Essen',
    sent: 'Das Buch liegt ___ Tisch.',
    correct: 'auf dem',
    options: ['auf dem', 'auf den', 'auf der', 'auf die'],
    hint: 'Dativ oder Akkusativ?',
  },
  'a1-wech-010': {
    theme: 'Essen',
    sent: 'Ich lege das Buch ___ Tisch.',
    correct: 'auf den',
    options: ['auf den', 'auf dem', 'auf der', 'auf die'],
    hint: 'Dativ oder Akkusativ?',
  },
  'a1-wech-024': {
    theme: 'Zuhause',
    sent: 'Ich setze mich ___ Stuhl.',
    correct: 'auf den',
    options: ['auf den', 'auf dem', 'auf die', 'auf der'],
    hint: 'Dativ oder Akkusativ?',
  },
};

function loadWechInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf('  WECHSELPRÄPOSITIONEN: [');
  const end = src.indexOf('  DATIVA1: [');
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

n += restoreWechselSelectOne();

for (const [id, q] of Object.entries(SELECT_OVERRIDES)) {
  writeFileSync(join(DIR, `${id}.md`), selectMd({ id, ...q }), 'utf8');
  n += 1;
}

const INPUT_BANK = loadWechInputBank();
for (const [idx, num] of [[8, '009'], [9, '010'], [23, '024']]) {
  const item = INPUT_BANK[idx];
  if (item) {
    writeFileSync(
      join(DIR, `a1-wech-in-${num}.md`),
      `---\nid: a1-wech-in-${num}\ntype: input-text\ncorrect:\n  - ${item[1]}\n---\n\n${buildInputBody(item)}\n`,
      'utf8',
    );
    n += 1;
  }
}

const dd031 = DROPBOX_BANK[30];
if (dd031) {
  writeFileSync(join(DIR, 'a1-wech-dd-031.md'), dropboxMd('a1-wech-dd-031', dd031), 'utf8');
  n += 1;
}

console.log(`Updated ${n} A1 WECHSELPRÄPOSITIONEN files.`);
