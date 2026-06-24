#!/usr/bin/env node
/**
 * Extract unique German tokens from the question bank for dictionary planning.
 * Run: node scripts/extract-dictionary-corpus.mjs
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseQuestionFile } from '../src/utils/markdownQuestion.js';
import { DICT_STOPWORDS } from '../src/data/stopwords.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'dictionary-corpus-stats.json');

const PRONOUNS = new Set([
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'man',
  'mir', 'dir', 'ihm', 'ihn', 'ihr', 'uns', 'euch', 'ihnen', 'ihm', 'ihnen',
  'mich', 'dich', 'sich', 'mein', 'dein', 'sein', 'unser', 'euer', 'ihr',
  'meine', 'deine', 'seine', 'ihre', 'unsere', 'eure',
  'meinen', 'deinen', 'seinen', 'ihren', 'meinem', 'deinem', 'seinem', 'ihrem',
  'meiner', 'deiner', 'seiner', 'ihrer', 'meines', 'deines', 'seines', 'ihres',
  'dieser', 'diese', 'dieses', 'diesen', 'diesem', 'dieser', 'jener', 'jene',
  'welcher', 'welche', 'welches', 'welchen', 'welchem', 'welcher',
  'wer', 'was', 'wem', 'wen', 'wessen',
  'jemand', 'jemanden', 'jemandem', 'niemand', 'niemanden', 'etwas', 'nichts',
  'alle', 'alles', 'beide', 'beiden', 'beider',
]);

const AUX_MODAL = new Set([
  'bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren', 'wart', 'gewesen', 'sei', 'seien',
  'habe', 'hast', 'hat', 'habt', 'haben', 'hatte', 'hattest', 'hatten', 'hattet', 'gehabt',
  'werde', 'wirst', 'wird', 'werdet', 'werden', 'wurde', 'wurdest', 'wurden', 'wurdet', 'worden',
  'kann', 'kannst', 'können', 'konnte', 'konntest', 'konnten', 'konntet', 'gekonnt',
  'muss', 'musst', 'müssen', 'musste', 'musstest', 'mussten', 'musstet', 'gemusst',
  'darf', 'darfst', 'dürfen', 'durfte', 'durftest', 'durften', 'durftet', 'gedurft',
  'soll', 'sollst', 'sollen', 'sollte', 'solltest', 'sollten', 'solltet', 'gesollt',
  'will', 'willst', 'wollen', 'wollte', 'wolltest', 'wollten', 'wolltet', 'gewollt',
  'mag', 'magst', 'mögen', 'mochte', 'mochtest', 'mochten', 'mochtet', 'gemocht',
  'möchte', 'möchtest', 'möchten', 'möchtet',
]);

const COMP_SUPER_SUFFIX = /(?:er|ste|sten|stem|tes|tem|ter)$/i;
const COMMON_SUPER = new Set([
  'besser', 'beste', 'besten', 'bestes', 'bestem', 'bester', 'best',
  'mehr', 'meiste', 'meisten', 'weniger', 'wenigste', 'wenigsten',
  'höher', 'höchste', 'höchsten', 'näher', 'nächste', 'nächsten',
  'älter', 'älteste', 'ältesten', 'größer', 'größte', 'größten',
  'kleiner', 'kleinste', 'kleinsten', 'schneller', 'schnellste', 'schnellsten',
]);

const INTERNATIONAL = new Set([
  'auto', 'bus', 'taxi', 'hotel', 'telefon', 'radio', 'video', 'internet', 'computer',
  'problem', 'programm', 'system', 'information', 'situation', 'station', 'operation',
  'café', 'restaurant', 'menu', 'team', 'sport', 'fitness', 'online', 'email', 'mail',
  'ticket', 'film', 'photo', 'foto', 'music', 'musik', 'doctor', 'doktor',
]);

const TOKEN_RE = /[A-Za-zÄÖÜäöüß]+/g;

/** @param {import('../src/utils/markdownQuestion.js').Question} q */
function collectStrings(q) {
  const parts = [q.prompt || '', q.hint || ''];
  if (q.options) parts.push(...q.options.map(String));
  if (q.words) parts.push(...q.words.map(String));
  if (q.correct) {
    const c = q.correct;
    if (Array.isArray(c)) parts.push(...c.map(String));
    else parts.push(String(c));
  }
  return parts.join(' ');
}

function tokenize(text) {
  const tokens = text.match(TOKEN_RE) || [];
  return tokens.map((t) => t.toLowerCase());
}

function classify(word) {
  if (word.length < 3) return 'too_short';
  if (DICT_STOPWORDS.has(word)) return 'stopword_current';
  if (PRONOUNS.has(word)) return 'pronoun';
  if (AUX_MODAL.has(word)) return 'aux_modal';
  if (COMMON_SUPER.has(word)) return 'comparative_superlative';
  if (INTERNATIONAL.has(word)) return 'internationalism';
  // heuristic: past participle
  if (/^(ge)[a-zäöüß]{3,}(t|en)$/i.test(word) && word.length > 5) return 'participle';
  // 2nd person / 3rd person verb endings
  if (/^(.*)(e|st|t)$/i.test(word) && word.length >= 4 && !word.endsWith('heit') && !word.endsWith('keit')) {
    if (/[bcdfghjklmnpqrstvwxzß]{2,}(e|st|t)$/i.test(word)) return 'likely_verb_form';
  }
  if (/en$/i.test(word) && word.length >= 5) return 'likely_verb_infinitive_or_form';
  if (/te$/i.test(word) && word.length >= 5) return 'likely_praeteritum';
  // adjective endings
  if (/^(.*)(er|es|em|en)$/i.test(word) && word.length >= 4) return 'likely_adj_or_noun_form';
  if (/^(.*)(e)$/i.test(word) && word.length >= 4) return 'likely_adj_form';
  return 'dictionary_candidate';
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

const freq = new Map();
let fileCount = 0;

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  const [level, topic] = rel.split(/[\\/]/);
  let q;
  try {
    q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: rel });
  } catch {
    continue;
  }
  fileCount += 1;
  for (const tok of tokenize(collectStrings(q))) {
    freq.set(tok, (freq.get(tok) || 0) + 1);
  }
}

const byClass = {};
for (const [word, count] of freq) {
  const cat = classify(word);
  if (!byClass[cat]) byClass[cat] = [];
  byClass[cat].push({ word, count });
}

for (const k of Object.keys(byClass)) {
  byClass[k].sort((a, b) => b.count - a.count);
}

const stats = {
  files: fileCount,
  uniqueTokens: freq.size,
  byCategory: Object.fromEntries(
    Object.entries(byClass).map(([k, arr]) => [k, { count: arr.length, top20: arr.slice(0, 20) }]),
  ),
  dictCandidates: (byClass.dictionary_candidate || []).length,
  likelyLemmaNeeded: {
    verbForms: (byClass.likely_verb_form || []).length + (byClass.likely_verb_infinitive_or_form || []).length + (byClass.likely_praeteritum || []).length + (byClass.participle || []).length,
    adjForms: (byClass.likely_adj_form || []).length + (byClass.likely_adj_or_noun_form || []).length,
  },
};

writeFileSync(OUT, JSON.stringify(stats, null, 2));

console.log('\n📚 Dictionary corpus analysis\n');
console.log(`  Question files:  ${fileCount}`);
console.log(`  Unique tokens:   ${freq.size}\n`);
for (const [cat, data] of Object.entries(stats.byCategory).sort((a, b) => b[1].count - a[1].count)) {
  console.log(`  ${cat.padEnd(28)} ${String(data.count).padStart(5)} types`);
}
console.log(`\n  Dictionary candidates (raw): ${stats.dictCandidates}`);
console.log(`  Verb-form heuristics:        ${stats.likelyLemmaNeeded.verbForms}`);
console.log(`  Adj/Noun-form heuristics:    ${stats.likelyLemmaNeeded.adjForms}`);
console.log(`\n  Full stats → docs/dictionary-corpus-stats.json\n`);
