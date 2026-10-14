#!/usr/bin/env node
/**
 * Regenerates all existing dropbox .md files from source banks.
 * Run: node scripts/restore-all-dropbox.mjs
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md as b1md, assertUnique as b1assert } from './b1-dropbox-shared.mjs';
import { BANK as B1_BANK } from './b1-dropbox-data.mjs';
import { md as a2md, assertUnique as a2assert } from './a2-dropbox-shared.mjs';
import { BANK as A2_BANK } from './a2-dropbox-data.mjs';
import * as D1 from './a1-dropbox-data.mjs';
import * as D2 from './a1-dropbox-data-2.mjs';
import * as D3 from './a1-dropbox-data-3.mjs';
import { resolveDropboxCommas } from '../src/site/utils/dropboxCommas.js';
import { md as b2md, assertUnique as b2assert } from './b2-dropbox-shared.mjs';
import { BANK as B2_BANK } from './b2-dropbox-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');

const B1_TOPICS = {
  ADJEKTIVDEKLINATIONB1: 'b1-adj-dd',
  AKKUSATIVB1: 'b1-akk-dd',
  DEMONSTRATIVARTIKEL: 'b1-demo-dd',
  ERGÄNZUNGSSATZ: 'b1-erg-dd',
  FINALSATZ: 'b1-fin-dd',
  INDIREKTEFRAGESÄTZE: 'b1-indfr-dd',
  KAUSALSATZ: 'b1-kaus-dd',
  KONJUNKTIV2: 'b1-k2-dd',
  KONDITIONALSATZ: 'b1-kond-dd',
  KONZESSIVSATZB1: 'b1-konz-dd',
  KONJUNKTIONALADVERBIEN: 'b1-kadv-dd',
  LOKALEPRÄPOSITIONENB1: 'b1-lokal-dd',
  NOMENPRÄPOSITIONVERBINDUNGB1: 'b1-npv-dd',
  PASSIVB1: 'b1-pass-dd',
  PERFEKTB1: 'b1-perf-dd',
  PRÄPOSITIONENGENITIVB1: 'b1-gen-dd',
  PRÄPOSITIONALERGÄNZUNG: 'b1-praeg-dd',
  PRÄPOSITIONALADVERBIEN: 'b1-pradv-dd',
  POSSESSIVARTIKELB1: 'b1-poss-dd',
  PRÄPOSITIONENB1: 'b1-praep-dd',
  RELATIVSATZB1: 'b1-rel-dd',
  TRENNBAREVERBENB1: 'b1-trenn-dd',
  VERNEINUNG: 'b1-neg-dd',
  VERBNOMENVERBINDUNGB1: 'b1-vnv-dd',
  VERBLASSEN: 'b1-lass-dd',
  WORTSCHATZB1: 'b1-ws-dd',
};

const A2_TOPICS = {
  ANTWORTPARTIKELN: 'a2-part-dd',
  KONJUNKTIONENA2: 'a2-konj-dd',
  PERFEKTA2: 'a2-perf-dd',
  PRÄTERITUMA2: 'a2-prät-dd',
  MODALVERBENA2: 'a2-modal-dd',
  REFLEXIVPRONOMEN: 'a2-refl-dd',
  KOMPARATIVA2: 'a2-komp-dd',
  SUPERLATIVA2: 'a2-sup-dd',
  WECHSELPRÄPOSITIONENA2: 'a2-wech-dd',
  DATIVA2: 'a2-dat-dd',
  AKKUSATIVA2: 'a2-akk-dd',
  FESTEPRÄPOSITIONENA2: 'a2-fest-dd',
  ADJEKTIVDEKLINATIONA2: 'a2-adj-dd',
  POSSESSIVARTIKELA2: 'a2-poss-dd',
  GENITIVA2: 'a2-gen-dd',
  INDEFINITPRONOMEN: 'a2-ind-dd',
  NOMENPRÄPOSITIONVERBINDUNGA2: 'a2-npv-dd',
  TRENNBAREVERBEN: 'a2-trenn-dd',
  TEMPORALSATZ: 'a2-temp-dd',
  LOKALPRÄPOSITIONENA2: 'a2-lokal-dd',
  'N-DEKLINATION': 'a2-n-dd',
};

const A1_TOPICS = {
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

const DROPBOX_KEEP_THEME = new Set(['Transport', 'Reisen', 'Stadt', 'Sport', 'Wetter']);

function a1md(id, prompt, words, hint = '') {
  const lines = words.map((w) => `  - ${w}`).join('\n');
  const resolvedCommas = resolveDropboxCommas({
    words,
    hint: hint || String(prompt || '').match(/\(([^)]+)\)\s*$/)?.[1] || '',
  });
  const commaBlock = resolvedCommas.length
    ? `\ncommas:\n${resolvedCommas.map((c) => `  - ${c}`).join('\n')}`
    : '';
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}${commaBlock}\n---\n\n${prompt}\n`;
}

function restoreLevel(level, topics, bank, mdFn, assertFn, extra = {}) {
  let total = 0;
  const errors = [];
  const base = join(ROOT, level);

  for (const [folder, prefix] of Object.entries(topics)) {
    const items = bank[folder] ?? extra[folder]?.bank;
    if (!items) continue;
    mkdirSync(join(base, folder), { recursive: true });

    for (let i = 0; i < 50; i++) {
      const item = items[i];
      const num = String(i + 1).padStart(3, '0');
      const pre = typeof prefix === 'string' ? prefix : prefix.prefix;
      const path = join(base, folder, `${pre}-${num}.md`);
      if (!existsSync(path)) continue;
      try {
        assertFn(item.words, `${level}/${folder}#${num}`);
      } catch (e) {
        errors.push(e.message);
        continue;
      }
      let prompt;
      if (level === 'A1') {
        const theme = DROPBOX_KEEP_THEME.has(item.theme) ? `[${item.theme}] ` : '';
        prompt = `${theme}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
        writeFileSync(path, a1md(`${pre}-${num}`, prompt, item.words, item.hint), 'utf8');
      } else if (level === 'B2') {
        prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
        writeFileSync(path, mdFn(`${pre}-${num}`, prompt, item.words, item.codes), 'utf8');
      } else if (level === 'B1') {
        prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
        writeFileSync(path, mdFn(`${pre}-${num}`, prompt, item.words, item.alternatives, item.commas, item.hint), 'utf8');
      } else {
        prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
        writeFileSync(path, mdFn(`${pre}-${num}`, prompt, item.words, item.hint), 'utf8');
      }
      total += 1;
    }
    console.log(`${level}/${folder}: restored`);
  }

  return { total, errors };
}

let grand = 0;
const allErrors = [];

const b1 = restoreLevel('B1', B1_TOPICS, B1_BANK, b1md, b1assert);
grand += b1.total;
allErrors.push(...b1.errors);

const a2 = restoreLevel('A2', A2_TOPICS, A2_BANK, a2md, a2assert);
grand += a2.total;
allErrors.push(...a2.errors);

for (const [folder, { prefix, bank }] of Object.entries(A1_TOPICS)) {
  mkdirSync(join(ROOT, 'A1', folder), { recursive: true });
  for (let i = 0; i < 50; i++) {
    const item = bank[i];
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, 'A1', folder, `${prefix}-${num}.md`);
    if (!existsSync(path)) continue;
    try {
      const seen = new Set();
      for (const w of item.words) {
        if (seen.has(w)) throw new Error(`Duplicate word "${w}" in A1/${folder}#${num}`);
        seen.add(w);
      }
    } catch (e) {
      allErrors.push(e.message);
      continue;
    }
    const theme = DROPBOX_KEEP_THEME.has(item.theme) ? `[${item.theme}] ` : '';
    const prompt = `${theme}Ordne die Wörter zum richtigen Satz: (${item.hint})`;
    writeFileSync(path, a1md(`${prefix}-${num}`, prompt, item.words, item.hint), 'utf8');
    grand += 1;
  }
  console.log(`A1/${folder}: restored`);
}

const b2 = restoreLevel('B2', {
  TEKAMOLO: 'b2-tkml-dd',
  'AKKUSATIV&DATIVOBJEKT': 'b2-obj-dd',
}, B2_BANK, b2md, b2assert);
grand += b2.total;
allErrors.push(...b2.errors);

if (allErrors.length) {
  console.error('\nErrors:');
  allErrors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}

console.log(`\nRestored ${grand} dropbox files.`);
