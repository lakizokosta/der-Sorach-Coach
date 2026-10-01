#!/usr/bin/env node
/**
 * Generates B1 Plusquamperfekt (50 select-one + 50 input-text + 50 dropbox).
 *
 * Run: node scripts/generate-b1-plusquamperfekt.mjs
 *      node scripts/generate-b1-plusquamperfekt.mjs --force
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md as mdSelect } from './b1-select-one-shared.mjs';
import { md as mdInput } from './input-text-prompt-shared.mjs';
import { md as mdDropbox } from './b1-dropbox-shared.mjs';
import {
  genPlusquamperfektB1SelectOne,
  genPlusquamperfektB1InputText,
  genPlusquamperfektB1Dropbox,
} from './b1-plusquamperfekt-data.mjs';

const FORCE = process.argv.includes('--force');
const ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'questions',
  'B1',
  'PLUSQUAMPERFEKTB1',
);

mkdirSync(ROOT, { recursive: true });

const selectOnes = genPlusquamperfektB1SelectOne();
const inputs = genPlusquamperfektB1InputText();
const dropboxes = genPlusquamperfektB1Dropbox();

let written = 0;

for (let i = 0; i < selectOnes.length; i++) {
  const num = String(i + 1).padStart(3, '0');
  const id = `b1-plq-${num}`;
  const file = join(ROOT, `${id}.md`);
  if (!FORCE && existsSync(file)) continue;
  writeFileSync(file, mdSelect({ id, ...selectOnes[i] }), 'utf8');
  written += 1;
}

for (let i = 0; i < inputs.length; i++) {
  const num = String(i + 1).padStart(3, '0');
  const id = `b1-plq-in-${num}`;
  const file = join(ROOT, `${id}.md`);
  if (!FORCE && existsSync(file)) continue;
  const q = inputs[i];
  writeFileSync(
    file,
    mdInput(id, q.prompt, Array.isArray(q.correct) ? q.correct : [q.correct], q.hint),
    'utf8',
  );
  written += 1;
}

for (let i = 0; i < dropboxes.length; i++) {
  const num = String(i + 1).padStart(3, '0');
  const id = `b1-plq-dd-${num}`;
  const file = join(ROOT, `${id}.md`);
  if (!FORCE && existsSync(file)) continue;
  const q = dropboxes[i];
  writeFileSync(
    file,
    mdDropbox(id, `Ordne die Wörter zum richtigen Satz: (${q.hint})`, q.words, undefined, q.commas, q.hint),
    'utf8',
  );
  written += 1;
}

console.log(`PLUSQUAMPERFEKTB1: wrote ${written} file(s) → ${ROOT}`);
console.log('Mix: 50 select-one + 50 input-text + 50 dropbox (nachdem / bevor / als).');
