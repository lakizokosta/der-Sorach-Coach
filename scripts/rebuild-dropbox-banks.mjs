#!/usr/bin/env node
/**
 * Rebuilds B1/A2 dropbox BANK_RAW word arrays from canonical input-text / select-one sentences.
 * Run: node scripts/rebuild-dropbox-banks.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as B1G from './b1-select-one-data.mjs';
import { BANK as A2_INPUT_BANK } from './a2-input-text-data.mjs';
import { DUPLICATE_FIXES } from './dropbox-duplicate-fixes.mjs';
import { assertUnique } from './b1-dropbox-shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const B1_GEN = {
  ADJEKTIVDEKLINATIONB1: B1G.genAdjektivdeklinationB1,
  AKKUSATIVB1: B1G.genAkkusativB1,
  DEMONSTRATIVARTIKEL: B1G.genDemonstrativartikel,
  ERGÄNZUNGSSATZ: B1G.genErgaenzungssatz,
  FINALSATZ: B1G.genFinalsatz,
  INDIREKTEFRAGESÄTZE: B1G.genIndirekteFragesaetze,
  KAUSALSATZ: B1G.genKausalsatz,
  KONJUNKTIV2: B1G.genKonjunktiv2,
  KONDITIONALSATZ: B1G.genKonditionalsatz,
  KONZESSIVSATZB1: B1G.genKonzessivsatzB1,
  KONJUNKTIONALADVERBIEN: B1G.genKonjunktionaladverbien,
  LOKALEPRÄPOSITIONENB1: B1G.genLokalePraepositionenB1,
  NOMENPRÄPOSITIONVERBINDUNGB1: B1G.genNomenPraepositionB1,
  PASSIVB1: B1G.genPassivB1,
  PERFEKTB1: B1G.genPerfektB1,
  PRÄPOSITIONENGENITIVB1: B1G.genPraepositionenGenitivB1,
  PRÄPOSITIONALERGÄNZUNG: B1G.genPraepositionaleErgaenzung,
  PRÄPOSITIONALADVERBIEN: B1G.genPraepositionaleAdverbien,
  POSSESSIVARTIKELB1: B1G.genPossessivartikelB1,
  PRÄPOSITIONENB1: B1G.genPraepositionenB1,
  RELATIVSATZB1: B1G.genRelativsatzB1,
  TRENNBAREVERBENB1: B1G.genTrennbareVerbenB1,
  VERNEINUNG: B1G.genVerneinung,
  VERBNOMENVERBINDUNGB1: B1G.genVerbNomenVerbindungB1,
  VERBLASSEN: B1G.genVerblassen,
  WORTSCHATZB1: B1G.genWortschatzB1,
};

/** @param {string} s */
function tokenize(s) {
  return s
    .replace(/[„“"'—]/g, ' ')
    .replace(/[.,!?;:]/g, '')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

/**
 * @param {string} prompt
 * @param {string} answer
 */
function wordsFromPrompt(prompt, answer) {
  let p = prompt.replace(/\s*\([^)]*\)\s*$/, '').trim();
  p = p.replace('___', answer);
  return tokenize(p);
}

/**
 * @param {string} prompt
 * @param {string} answer
 * @param {string[]} words
 */
function a2Hint(prompt, answer, words) {
  const m = prompt.match(/\(([^)]*)\)/);
  if (!m) return `Satz — ${answer}`;
  const raw = m[1].trim();
  const cat = raw.split('—')[0].trim();
  if (raw.includes('Perfekt')) {
    const part = words.find((w) => /^(ge|be|ver|er|ent|gegangen|gessen|gearbeitet|gefahren|getroffen|spaziert|gelernt|gespielt|geschlafen|gekommen|gesungen|gewesen|gemacht|verpasst|gekocht|gebucht|interessiert)/.test(w))
      || words.at(-1);
    return part && part !== answer ? `Perfekt — ${answer} ${part}` : `Perfekt — ${answer}`;
  }
  if (raw.includes('Präteritum')) {
    const verb = words.find((w, i) => i > 0 && /^[a-zäöüß]+te$|^[a-zäöüß]+en$/.test(w));
    return verb ? `Präteritum — ${verb}` : `Präteritum — ${answer}`;
  }
  if (raw.includes('Modalverb')) {
    return `Modalverb — ${answer}`;
  }
  if (raw.includes('Konjunktion')) {
    return `Konjunktion — ${answer.toLowerCase() === answer ? answer : answer}`;
  }
  return `${cat} — ${answer}`;
}

/**
 * @param {string} level
 * @param {string} topic
 * @param {number} index
 * @param {string[]} words
 */
function applyFix(level, topic, index, words) {
  const key = `${level}:${topic}:${index}`;
  if (DUPLICATE_FIXES[key]) return DUPLICATE_FIXES[key];
  try {
    assertUnique(words, 'check');
    return words;
  } catch {
    const seen = new Set();
    const dups = new Set();
    for (const w of words) {
      if (seen.has(w)) dups.add(w);
      seen.add(w);
    }
    for (const [fixKey, fixWords] of Object.entries(DUPLICATE_FIXES)) {
      if (!fixKey.startsWith(`${level}:${topic}:`)) continue;
      try {
        assertUnique(fixWords, fixKey);
        if (dups.size === 0) return fixWords;
      } catch {
        /* skip */
      }
    }
    return words;
  }
}

/** @param {string} s */
function sq(s) {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** @param {{ hint: string, words: string[] }} item */
function serializeItem(item) {
  const words = `[${item.words.map(sq).join(', ')}]`;
  return `    { hint: ${sq(item.hint)}, words: ${words} }`;
}

/** @param {string} key */
function serializeKey(key) {
  return /^[A-Z_][A-Z0-9_]*$/.test(key) ? key : `'${key.replace(/'/g, "\\'")}'`;
}

/** @param {Record<string, { hint: string, words: string[] }[]>} bankRaw */
function serializeBankRaw(bankRaw) {
  const blocks = Object.entries(bankRaw).map(([topic, items]) => {
    const lines = items.map(serializeItem).join(',\n');
    return `  ${serializeKey(topic)}: [\n${lines},\n  ]`;
  });
  return `const BANK_RAW = {\n${blocks.join(',\n\n')},\n\n};\n`;
}

function rebuildB1(existingRaw) {
  /** @type {Record<string, { hint: string, words: string[] }[]>} */
  const out = {};
  const errors = [];

  for (const [topic, gen] of Object.entries(B1_GEN)) {
    const items = gen();
    const prev = existingRaw[topic] ?? [];
    const rebuilt = [];

    for (let i = 0; i < prev.length; i++) {
      const src = items[i % items.length];
      let words = wordsFromPrompt(src.prompt, src.correct);
      words = applyFix('B1', topic, i, words);
      try {
        assertUnique(words, `B1/${topic}#${i + 1}`);
      } catch (e) {
        errors.push(`${topic}#${i + 1}: ${e.message} | ${words.join(' ')}`);
      }
      rebuilt.push({ hint: prev[i].hint, words });
    }
    out[topic] = rebuilt;
  }

  return { out, errors };
}

function rebuildA2(existingRaw) {
  /** @type {Record<string, { hint: string, words: string[] }[]>} */
  const out = {};
  const errors = [];

  for (const [topic, templates] of Object.entries(A2_INPUT_BANK)) {
    const prev = existingRaw[topic] ?? [];
    const rebuilt = [];
    const unique = [];
    const seen = new Set();
    for (const tpl of templates) {
      const key = `${tpl[0]}|${tpl[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(tpl);
      }
      if (unique.length >= prev.length) break;
    }

    for (let i = 0; i < prev.length; i++) {
      const [prompt, answer] = unique[i % unique.length];
      let words = wordsFromPrompt(prompt, answer);
      words = applyFix('A2', topic, i, words);
      const hint = a2Hint(prompt, answer, words);
      try {
        assertUnique(words, `A2/${topic}#${i + 1}`);
      } catch (e) {
        errors.push(`${topic}#${i + 1}: ${e.message} | ${words.join(' ')}`);
      }
      rebuilt.push({ hint, words });
    }
    out[topic] = rebuilt;
  }

  return { out, errors };
}

function patchDataFile(relPath, newBankRaw) {
  const path = join(ROOT, relPath);
  const src = readFileSync(path, 'utf8');
  const start = src.indexOf('const BANK_RAW = {');
  const end = src.indexOf('export const BANK');
  if (start < 0 || end < 0) throw new Error(`Cannot patch ${relPath}`);
  const head = src.slice(0, start);
  const tail = src.slice(end);
  writeFileSync(path, head + serializeBankRaw(newBankRaw) + '\n' + tail, 'utf8');
}

function loadExistingRaw(relPath) {
  const mod = readFileSync(join(ROOT, relPath), 'utf8');
  const m = mod.match(/const BANK_RAW = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error(`BANK_RAW not found in ${relPath}`);
  // eslint-disable-next-line no-eval
  return eval(`(${m[1]})`);
}

const b1Path = 'scripts/b1-dropbox-data.mjs';
const a2Path = 'scripts/a2-dropbox-data.mjs';

const b1Existing = loadExistingRaw(b1Path);
const a2Existing = loadExistingRaw(a2Path);

const b1 = rebuildB1(b1Existing);
const a2 = rebuildA2(a2Existing);

const allErrors = [...b1.errors, ...a2.errors];
if (allErrors.length) {
  console.error('Duplicate-word errors after fixes:');
  allErrors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}

patchDataFile(b1Path, b1.out);
patchDataFile(a2Path, a2.out);

let b1Changed = 0;
let a2Changed = 0;
for (const [topic, items] of Object.entries(b1.out)) {
  items.forEach((item, i) => {
    if (item.words.join(' ') !== b1Existing[topic][i].words.join(' ')) b1Changed += 1;
  });
}
for (const [topic, items] of Object.entries(a2.out)) {
  items.forEach((item, i) => {
    if (item.words.join(' ') !== a2Existing[topic][i].words.join(' ')) a2Changed += 1;
    if (item.hint !== a2Existing[topic][i].hint) a2Changed += 1;
  });
}

console.log(`Updated ${b1Path}: ${b1Changed} word arrays changed.`);
console.log(`Updated ${a2Path}: ${a2Changed} entries changed (words/hints).`);
