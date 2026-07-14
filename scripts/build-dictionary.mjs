#!/usr/bin/env node
/**
 * Build local dictionary assets from the question bank.
 *
 * Outputs:
 *   src/data/verbLemmas.json   — inflected verb form → infinitive
 *   src/data/adjLemmas.json    — inflected adj form → positiv
 *   src/data/vocabulary.json   — lemma → { pos, ru, en, gender? }
 *   docs/dictionary-wordlist.csv — review list (lemma, pos, freq, status)
 *
 * Usage:
 *   node scripts/build-dictionary.mjs
 *   node scripts/build-dictionary.mjs --fetch-translations   # draft RU/EN via MyMemory (slow)
 */

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseQuestionFile, stripTrailingPromptHint } from '../src/utils/markdownQuestion.js';
import { isDictStopword } from '../src/data/stopwords.js';
import { isDictMetaSkipped } from '../src/data/dictMeta.js';
import { NOUN_FORM_LEMMAS } from '../src/data/nounLemmaForms.js';
import { VERB_FORM_LEMMAS } from '../src/data/verbLemmaForms.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QROOT = join(ROOT, 'src', 'questions');
const SEED_PATH = join(ROOT, 'src', 'data', 'vocabulary-seed.json');
const SEED_EN_PATH = join(ROOT, 'src', 'data', 'vocabulary-seed-en.json');

const fetchTranslations = process.argv.includes('--fetch-translations');
const fetchLimitArg = process.argv.find((a) => a.startsWith('--fetch-limit='));
const fetchLimit = fetchLimitArg ? Number(fetchLimitArg.split('=')[1]) : 0;
const MEMORY_URL = 'https://api.mymemory.translated.net/get';
const VOCAB_PATH = join(ROOT, 'src', 'data', 'vocabulary.json');

const TOKEN_RE = /[A-Za-zÄÖÜäöüß]+/g;

/** @param {string} word */
function shouldSkipToken(word) {
  const w = word.toLowerCase();
  if (w.length < 3) return true;
  if (isDictStopword(w)) return true;
  if (isDictMetaSkipped(w)) return true;
  return false;
}

/** Strip trailing hint in parentheses from prompt body. */
function stripHint(text) {
  return stripTrailingPromptHint(text);
}

/** Extract hint text from trailing `(…)`. */
function extractHint(text) {
  const m = String(text || '').match(/\(([^)]+)\)\s*$/);
  return m ? m[1].trim() : '';
}

/**
 * @param {string} hint
 * @return {{ pos: string, lemma: string } | null}
 */
function parseHintLemma(hint) {
  if (!hint) return null;

  let m = hint.match(/Verb\s+(.+)$/i);
  if (m) return { pos: 'verb', lemma: m[1].trim().toLowerCase() };

  m = hint.match(/Adjektivdeklination\s*—\s*([a-zäöüß]+)/i);
  if (m) return { pos: 'adj', lemma: m[1].toLowerCase() };

  m = hint.match(/Adjektiv\s*—\s*([a-zäöüß]+)/i);
  if (m) return { pos: 'adj', lemma: m[1].toLowerCase() };

  m = hint.match(/Komparativ\s*—\s*([a-zäöüß]+)/i);
  if (m) return { pos: 'adj', lemma: m[1].toLowerCase() };

  return null;
}

/** @param {import('../src/utils/markdownQuestion.js').Question} q */
function collectCorrectForms(q) {
  if (!q.correct) return [];
  return Array.isArray(q.correct) ? q.correct.map(String) : [String(q.correct)];
}

/** Capitalized tokens in German text → noun candidates. */
function extractNounCandidates(text) {
  const nouns = [];
  for (const m of text.matchAll(/(?<![A-Za-zÄÖÜäöüß])([A-ZÄÖÜ][a-zäöüß]+)/g)) {
    const w = m[1];
    if (!shouldSkipToken(w)) nouns.push(w.toLowerCase());
  }
  return nouns;
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

const verbLemmas = { ...VERB_FORM_LEMMAS };
const adjLemmas = {};
const nounLemmas = { ...NOUN_FORM_LEMMAS };
/** @type {Map<string, { pos: string, freq: number, gender?: string }>} */
const vocab = new Map();
let fileCount = 0;

function bumpLemma(lemma, pos, n = 1) {
  const key = lemma.toLowerCase();
  if (shouldSkipToken(key)) return;
  const row = vocab.get(key) || { pos, freq: 0 };
  row.pos = row.pos || pos;
  row.freq += n;
  vocab.set(key, row);
}

/** Load existing RU/EN when re-fetching (resume / partial runs). */
function mergeExistingVocabulary() {
  if (!existsSync(VOCAB_PATH)) return;
  try {
    const existing = JSON.parse(readFileSync(VOCAB_PATH, 'utf8'));
    for (const [lemma, entry] of Object.entries(existing)) {
      if (shouldSkipToken(lemma)) continue;
      const row = vocab.get(lemma) || { pos: entry.pos || 'noun', freq: 0 };
      if (entry.ru) row.ru = cleanFetchedTranslation(entry.ru);
      if (entry.en) row.en = cleanFetchedTranslation(entry.en);
      if (entry.gender) row.gender = entry.gender;
      vocab.set(lemma, row);
    }
  } catch {
    /* ignored */
  }
}

for (const file of walk(QROOT)) {
  const rel = relative(QROOT, file);
  const [level, topic] = rel.split(/[\\/]/);
  let q;
  try {
    q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: rel });
  } catch {
    continue;
  }
  fileCount += 1;

  const fullPrompt = q.prompt || '';
  const hint = extractHint(fullPrompt) || q.hint || '';
  const body = stripHint(fullPrompt);
  const parsed = parseHintLemma(hint);

  if (parsed && q.type === 'input-text') {
    for (const form of collectCorrectForms(q)) {
      const f = form.trim().toLowerCase();
      if (!f) continue;
      if (parsed.pos === 'verb') {
        verbLemmas[f] = parsed.lemma;
        bumpLemma(parsed.lemma, 'verb');
      } else if (parsed.pos === 'adj') {
        adjLemmas[f] = parsed.lemma;
        bumpLemma(parsed.lemma, 'adj');
      }
    }
  }

  const textParts = [body];
  if (q.options) textParts.push(...q.options.map(String));
  if (q.words) textParts.push(...q.words.map(String));

  for (const part of textParts) {
    for (const noun of extractNounCandidates(part)) {
      bumpLemma(noun, 'noun');
    }
    for (const tok of part.match(TOKEN_RE) || []) {
      const low = tok.toLowerCase();
      if (shouldSkipToken(low)) continue;
      if (/^[A-ZÄÖÜ]/.test(tok)) {
        bumpLemma(low, 'noun');
      }
    }
  }
}

function cleanFetchedTranslation(raw) {
  const t = String(raw || '').replace(/[\r\n]+/g, ' ').trim();
  if (!t) return '';
  if (/MYMEMORY WARNING/i.test(t)) return '';
  if (t.toLowerCase() === 'undefined') return '';
  return t;
}

// Merge existing vocabulary (resume / prior fetch) before seed overrides.
mergeExistingVocabulary();

// Manual seed translations always win over fetched drafts.
function mergeSeedFile(path) {
  if (!existsSync(path)) return;
  const seed = JSON.parse(readFileSync(path, 'utf8'));
  for (const [lemma, entry] of Object.entries(seed)) {
    const key = lemma.toLowerCase();
    const row = vocab.get(key) || { pos: entry.pos || 'noun', freq: 0 };
    row.pos = entry.pos || row.pos;
    if (entry.ru) row.ru = entry.ru;
    if (entry.en) row.en = entry.en;
    if (entry.gender) row.gender = entry.gender;
    vocab.set(key, row);
  }
}

mergeSeedFile(SEED_PATH);
mergeSeedFile(SEED_EN_PATH);

async function fetchTranslation(word, lang) {
  const langpair = lang === 'en' ? 'de|en' : 'de|ru';
  const url = `${MEMORY_URL}?q=${encodeURIComponent(word)}&langpair=${langpair}`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const raw = data?.responseData?.translatedText || '';
      const t = raw.replace(/[\r\n]+/g, ' ').trim();
      if (!t || t.toLowerCase() === word.toLowerCase()) return '';
      return cleanFetchedTranslation(t);
    } catch {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return '';
}

function writeVocabularyOutputs() {
  /** @type {Record<string, { pos: string, ru?: string, en?: string, gender?: string }>} */
  const vocabularyOut = {};
  for (const [lemma, row] of [...vocab.entries()].sort((a, b) => b[1].freq - a[1].freq)) {
    const ru = cleanFetchedTranslation(row.ru);
    const en = cleanFetchedTranslation(row.en);
    vocabularyOut[lemma] = {
      pos: row.pos,
      ...(ru ? { ru } : {}),
      ...(en ? { en } : {}),
      ...(row.gender ? { gender: row.gender } : {}),
    };
  }

  writeFileSync(join(ROOT, 'src', 'data', 'verbLemmas.json'), JSON.stringify(verbLemmas, null, 0));
  writeFileSync(join(ROOT, 'src', 'data', 'adjLemmas.json'), JSON.stringify(adjLemmas, null, 0));
  writeFileSync(join(ROOT, 'src', 'data', 'nounLemmas.json'), JSON.stringify(nounLemmas, null, 0));
  writeFileSync(VOCAB_PATH, JSON.stringify(vocabularyOut, null, 2));

  const csvLines = [
    'lemma,pos,freq,ru,en,status',
    ...[...vocab.entries()]
      .sort((a, b) => b[1].freq - a[1].freq)
      .map(([lemma, row]) => {
        const ru = (row.ru || '').replace(/"/g, '""');
        const en = (row.en || '').replace(/"/g, '""');
        const status = row.ru && row.en ? 'done' : 'pending';
        return `"${lemma}",${row.pos},${row.freq},"${ru}","${en}",${status}`;
      }),
  ];
  writeFileSync(join(ROOT, 'docs', 'dictionary-wordlist.csv'), csvLines.join('\n'));
  return vocabularyOut;
}

if (fetchTranslations) {
  let entries = [...vocab.entries()]
    .filter(([, row]) => !row.ru || !row.en)
    .sort((a, b) => b[1].freq - a[1].freq);
  if (fetchLimit > 0) entries = entries.slice(0, fetchLimit);

  console.log(`Fetching draft translations for ${entries.length} lemmas…`);
  let i = 0;
  for (const [lemma, row] of entries) {
    i += 1;
    if (i % 25 === 0) {
      console.log(`  ${i}/${entries.length}…`);
      writeVocabularyOutputs();
    }
    if (!row.ru) {
      row.ru = await fetchTranslation(lemma, 'ru');
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!row.en) {
      row.en = await fetchTranslation(lemma, 'en');
      await new Promise((r) => setTimeout(r, 100));
    }
  }
}

const vocabularyOut = writeVocabularyOutputs();

console.log('\n📖 Dictionary build complete\n');
console.log(`  Question files:     ${fileCount}`);
console.log(`  Verb form → lemma:  ${Object.keys(verbLemmas).length}`);
console.log(`  Adj form → lemma:   ${Object.keys(adjLemmas).length}`);
console.log(`  Vocabulary lemmas:  ${Object.keys(vocabularyOut).length}`);
console.log(`  Wordlist CSV:       docs/dictionary-wordlist.csv`);
if (!fetchTranslations) {
  console.log('\n  Tip: run with --fetch-translations for draft RU/EN (slow).\n');
}
