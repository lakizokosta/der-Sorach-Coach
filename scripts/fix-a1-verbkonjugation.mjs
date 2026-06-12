#!/usr/bin/env node
/**
 * Fix A1 VERBKONJUGATION hints (select-one, input-text, dropbox).
 * Run: node scripts/fix-a1-verbkonjugation.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VERBKONJUGATION as DROPBOX_BANK } from './a1-dropbox-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'questions', 'A1', 'VERBKONJUGATION');

const IRREGULAR_INF = new Set(['sein', 'haben', 'werden', 'tun']);

/** @param {string} lemma */
function präsensHint(lemma) {
  return lemma ? `Präsens + Verb ${lemma}` : 'Präsensform';
}

/** @param {string} inner */
function hintFromInputInner(inner) {
  const verb = inner.match(/^([\wäöüÄÖÜß-]+)/)?.[1];
  const base = verb ? präsensHint(verb) : inner;
  if (/\bsie Pl\b/i.test(inner)) return `${base} — sie (Pl.)`;
  if (/\bsie Fem\b/i.test(inner)) return `${base} — sie (Fem.)`;
  return base;
}

/** @param {string} bankHint */
function dropboxHint(bankHint) {
  const m = bankHint.match(/Verb — ([\wäöüÄÖÜß-]+)/);
  return m ? präsensHint(m[1]) : bankHint;
}

function isLikelyLemma(w) {
  const s = String(w).toLowerCase();
  if (IRREGULAR_INF.has(s)) return true;
  return /^[\wäöüß-]+$/.test(s) && (s.endsWith('en') || s.endsWith('ern'));
}

/** @param {string[]} options @param {string} correct */
function infinitiveFromOptions(options, correct) {
  if (isLikelyLemma(correct)) return String(correct).toLowerCase();
  const answers = new Set([String(correct).toLowerCase()]);
  const opts = (options || []).filter((o) => !answers.has(String(o).toLowerCase()));
  for (const o of opts) {
    if (IRREGULAR_INF.has(String(o).toLowerCase())) return String(o).toLowerCase();
  }
  const infs = opts.filter((o) => isLikelyLemma(o));
  if (infs.length === 1) return infs[0].toLowerCase();
  if (infs.length > 1) return infs.sort((a, b) => b.length - a.length)[0].toLowerCase();
  return '';
}

/** Separable verb from sentence with detached prefix. */
function separableFromBody(body) {
  const m = body.match(/\b\w+\s+___\s+[\wäöüÄÖÜß-]*\s+(an|auf|ab|aus|ein|mit|vor|zu|weg|her|hin)\b/i);
  if (!m) return '';
  const prefix = m[1].toLowerCase();
  const before = body.slice(0, body.indexOf('___')).trim().split(/\s+/).pop()?.toLowerCase() || '';
  const stems = { steh: 'stehen', pack: 'packen', ruf: 'rufen', mach: 'machen', komm: 'kommen', geh: 'gehen' };
  for (const [stem, inf] of Object.entries(stems)) {
    if (before.startsWith(stem) || before.includes(stem)) return `${prefix}${inf}`;
  }
  return '';
}

function loadKonjInputBank() {
  const src = readFileSync(join(__dirname, 'generate-a1-input-text.mjs'), 'utf8');
  const start = src.indexOf('  VERBKONJUGATION: [');
  const end = src.indexOf('  ADJEKTIVDEKLINATIONA1: [');
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
  return `${match[1].trimEnd()} (${hintFromInputInner(match[2].trim())})`;
}

function parseMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const body = m[2].trimEnd();
  const id = fm.match(/^id:\s*(.+)$/m)?.[1]?.trim() || '';
  const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim() || '';
  const correctInline = fm.match(/^correct:\s*(.+)$/m)?.[1]?.trim();
  const correctList = fm.includes('correct:\n')
    ? [...fm.matchAll(/^\s*-\s+(.+)$/gm)].map((x) => x[1].trim())
    : correctInline ? [correctInline] : [];
  const options = [...fm.matchAll(/^  - (.+)$/gm)]
    .map((x) => x[1].trim())
    .filter((_, i, arr) => {
      const optsStart = fm.indexOf('options:');
      const corrStart = fm.indexOf('correct:');
      const pos = fm.indexOf(`- ${arr[i]}`);
      return optsStart >= 0 && pos > optsStart && (corrStart < 0 || pos < corrStart);
    });
  return { fm, body, id, type, correct: correctList, options };
}

const INPUT_BANK = loadKonjInputBank();
const DROPBOX_KEEP_THEME = new Set(['Transport', 'Reisen', 'Stadt', 'Sport', 'Wetter']);

let n = 0;

// --- Dropbox ---
DROPBOX_BANK.slice(0, 50).forEach((item, i) => {
  const num = String(i + 1).padStart(3, '0');
  const id = `a1-konj-dd-${num}`;
  const prefix = DROPBOX_KEEP_THEME.has(item.theme) ? `[${item.theme}] ` : '';
  const hint = dropboxHint(item.hint);
  const prompt = `${prefix}Ordne die Wörter zum richtigen Satz: (${hint})`;
  const lines = item.words.map((w) => `  - ${w}`).join('\n');
  writeFileSync(join(DIR, `${id}.md`), `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`, 'utf8');
  n += 1;
});

// --- Input-text ---
const inputOverrides = {
  'a1-fill-2': {
    fm: `---\nid: a1-fill-2\ntype: input-text\ncorrect: steht\nhint: "Trennbares Verb — Präfix ans Ende!"\n---\n\n`,
    body: 'Er ___ jeden Tag um 7 Uhr auf. (Präsens + Verb aufstehen)\n',
  },
  'a1-konj-4': {
    fm: `---\nid: a1-konj-4\ntype: input-text\ncorrect:\n  - gehe\n---\n\n`,
    body: 'Ich ___ morgen zur Schule. (Präsens + Verb gehen)\n',
  },
};

INPUT_BANK[23] = ['[Freunde] Ihr ___ mir im Garten. (helfen, ihr)', 'helft'];

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md') && (f.includes('-in-') || f === 'a1-fill-2.md' || f === 'a1-konj-4.md'))) {
  const path = join(DIR, file);
  const parsed = parseMd(readFileSync(path, 'utf8'));
  if (!parsed || parsed.type !== 'input-text') continue;

  if (inputOverrides[parsed.id]) {
    const o = inputOverrides[parsed.id];
    writeFileSync(path, o.fm + o.body, 'utf8');
    n += 1;
    continue;
  }

  const idx = parseInt(parsed.id.match(/-in-(\d+)/)?.[1] || '0', 10) - 1;
  const item = INPUT_BANK[idx];
  if (!item) continue;
  writeFileSync(path, `---\n${parsed.fm}\n---\n\n${buildInputBody(item)}\n`, 'utf8');
  n += 1;
}

// --- Select-one ---
const selectOverrides = {
  'a1-konj-019': {
    sentence: 'Wir ___ Obst zum Frühstück.',
    correct: 'essen',
    options: ['isst', 'essen', 'esse', 'esst'],
  },
};

for (const file of readdirSync(DIR).filter((f) => /^a1-konj-\d+\.md$/.test(f) || /^a1-konj-0/.test(f))) {
  const path = join(DIR, file);
  const parsed = parseMd(readFileSync(path, 'utf8'));
  if (!parsed || parsed.type !== 'select-one') continue;

  // Strip the entire trailing hint parenthetical (handles nested parens like "sie (Fem.)")
  let sentence = parsed.body.replace(/\s*\(.*\)\s*$/, '').trim();
  let correct = parsed.correct[0];
  let options = parsed.options;

  if (selectOverrides[parsed.id]) {
    const o = selectOverrides[parsed.id];
    sentence = o.sentence;
    correct = o.correct;
    options = o.options;
  }

  const lemma = infinitiveFromOptions(options, correct) || separableFromBody(sentence);
  let hint = präsensHint(lemma);
  // When subject is "Sie" (capital), clarify Fem. vs Pl. ambiguity
  if (/^Sie\s/.test(sentence)) {
    const correctLower = String(correct).toLowerCase();
    const lemmaLower = (lemma || '').toLowerCase();
    const isPl = correctLower === lemmaLower
      || correctLower.endsWith('ern')
      || (correctLower.endsWith('en') && correctLower !== lemmaLower + 't');
    hint += isPl ? ' — sie (Pl.)' : ' — sie (Fem.)';
  }
  const opts = options.map((o) => `  - ${o}`).join('\n');
  writeFileSync(
    path,
    `---\nid: ${parsed.id}\ntype: select-one\noptions:\n${opts}\ncorrect: ${correct}\n---\n\n${sentence} (${hint})\n`,
    'utf8',
  );
  n += 1;
}

console.log(`Updated ${n} A1 VERBKONJUGATION files.`);
