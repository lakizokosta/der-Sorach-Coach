#!/usr/bin/env node
/**
 * Generates B2 Relativsätze II (Präp / was / wo(r)- / Genitiv).
 * 50 select-one + 50 input-text under RELATIVSATZERWEITERTB2.
 *
 * Run: node scripts/generate-b2-relativ-erweitert.mjs
 *      node scripts/generate-b2-relativ-erweitert.mjs --force
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md as mdSelect } from './b2-select-one-shared.mjs';
import { md as mdInput } from './input-text-prompt-shared.mjs';
import {
  genRelativsatzErweitertB2SelectOne,
  genRelativsatzErweitertB2InputText,
} from './b2-relativ-erweitert-data.mjs';

const FORCE = process.argv.includes('--force');
const ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'questions',
  'B2',
  'RELATIVSATZERWEITERTB2',
);

mkdirSync(ROOT, { recursive: true });

const selectOnes = genRelativsatzErweitertB2SelectOne();
const inputs = genRelativsatzErweitertB2InputText();

let written = 0;

for (let i = 0; i < selectOnes.length; i++) {
  const num = String(i + 1).padStart(3, '0');
  const id = `b2-relx-${num}`;
  const file = join(ROOT, `${id}.md`);
  if (!FORCE && existsSync(file)) continue;
  const q = selectOnes[i];
  writeFileSync(file, mdSelect({ id, ...q }), 'utf8');
  written += 1;
}

for (let i = 0; i < inputs.length; i++) {
  const num = String(i + 1).padStart(3, '0');
  const id = `b2-relx-in-${num}`;
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

console.log(`RELATIVSATZERWEITERTB2: wrote ${written} file(s) → ${ROOT}`);
console.log('Mix: 22 Genitiv + Präposition + was + wo(r)- (50 select-one + 50 input-text).');
