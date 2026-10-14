#!/usr/bin/env node
/**
 * Grammar + structure audit for the entire question bank.
 * Run: npm run questions:audit
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');
const LEVELS = new Set(['A1', 'A2', 'B1', 'B2']);

/** @type {{ rel: string, code: string, msg: string }[]} */
const issues = [];
const ids = new Map();

function add(rel, code, msg) {
  issues.push({ rel, code, msg });
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

const FUSED = {
  dem: new Set(['im', 'am', 'zum', 'beim', 'vom']),
  der: new Set(['zur']),
  das: new Set(['ins', 'ans']),
};

const ARTICLES = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des',
  'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'Der', 'Die', 'Das', 'Den', 'Dem', 'Des',
  'Ein', 'Eine', 'Einen', 'Einem', 'Einer', 'Eines',
]);

function hasDoubleArticle(text) {
  return /\b(im dem|am dem|zum dem|beim dem|vom dem|zur der|ins das|ans das)\b/i.test(text);
}

function auditFusedAtGap(prompt, correct, rel, gapLabel = '') {
  const re = /___\s+(dem|der|den|das|die)\b/gi;
  let m;
  const label = gapLabel || rel;
  while ((m = re.exec(prompt)) !== null) {
    const art = m[1].toLowerCase();
    if (FUSED[art]?.has(String(correct).toLowerCase())) {
      add(label, 'FUSED+ARTICLE', `„${correct}" vor „${m[1]}" → Doppelartikel`);
    }
  }
}

function fillGaps(prompt, answers) {
  let t = prompt;
  for (const a of answers) t = t.replace('___', a);
  return t;
}

function auditPromptText(rel, prompt, correct, topic) {
  if (!prompt?.includes('___')) return;

  auditFusedAtGap(prompt, correct, rel);

  const filled = prompt.replace('___', String(correct));
  if (hasDoubleArticle(filled)) {
    add(rel, 'FUSED+ARTICLE', `ausgefüllt: Doppelartikel`);
  }

  if (/weiterer Fragen/i.test(prompt)) {
    add(rel, 'ADJ_PLURAL', '„weiterer Fragen“ → „weiteren Fragen“');
  }
  if (/weiteren Informationen/i.test(prompt)) {
    add(rel, 'ADJ_PLURAL', '„weiteren Informationen“ → „weitere Informationen“');
  }

  if (/überweisen.*___\s+das/i.test(prompt) && correct !== 'auf') {
    add(rel, 'PRÄP', `„überweisen auf das …“, nicht „${correct}"`);
  }

  if (/___\s+Verfügung/i.test(prompt) && String(correct).toLowerCase() === 'in') {
    add(rel, 'PRÄP', '„___ Verfügung“ → „zur“, nicht „in“');
  }

  // Adjektivdeklination: Lücke vor Artikel statt vor Adjektivendung
  if (/ADJ/i.test(topic)) {
    const m = prompt.match(/___\s+(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+\w/i);
    if (m && ARTICLES.has(String(correct))) {
      add(rel, 'ADJ_DEKL', `Lücke vor Artikel „${m[1]}" — Endung des Adjektivs wählen, nicht Artikel „${correct}"`);
    }
    const m2 = prompt.match(/(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+___\s+\w/i);
    if (m2 && ARTICLES.has(String(correct))) {
      add(rel, 'ADJ_DEKL', `Lücke nach Artikel — Adjektivendung wählen, nicht „${correct}"`);
    }
  }
}

function auditQuestion(rel, level, topic, q) {
  if (!LEVELS.has(level)) {
    add(rel, 'PATH', `unbekanntes Level „${level}"`);
  }

  if (!q.prompt?.trim()) {
    add(rel, 'EMPTY_PROMPT', 'leerer Fragetext');
  }

  if (ids.has(q.id)) {
    add(rel, 'DUPLICATE_ID', `id „${q.id}" auch in ${ids.get(q.id)}`);
  } else {
    ids.set(q.id, rel);
  }

  switch (q.type) {
    case 'select-one': {
      if (!q.options?.includes(q.correct)) {
        add(rel, 'CORRECT_NOT_IN_OPTIONS', `correct="${q.correct}"`);
      }
      const seen = new Set();
      for (const o of q.options || []) {
        const t = String(o).trim();
        if (seen.has(t)) add(rel, 'DUPLICATE_OPTION', `doppelte Option „${t}"`);
        seen.add(t);
      }
      if ((q.options || []).length < 2) add(rel, 'OPTIONS', 'weniger als 2 Optionen');
      auditPromptText(rel, q.prompt, q.correct, topic);
      break;
    }
    case 'multi-select': {
      const corrects = Array.isArray(q.correct) ? q.correct : [q.correct];
      for (const c of corrects) {
        if (!q.options?.includes(c)) add(rel, 'CORRECT_NOT_IN_OPTIONS', `correct="${c}"`);
      }
      break;
    }
    case 'input-text': {
      const corrects = Array.isArray(q.correct) ? q.correct : [q.correct];
      if (!corrects.length || corrects.some((c) => !String(c).trim())) {
        add(rel, 'EMPTY_CORRECT', 'leerer correct-Wert');
      }
      if (!q.prompt?.includes('___')) {
        add(rel, 'NO_BLANK', 'input-text ohne ___');
      }
      for (const c of corrects) auditPromptText(rel, q.prompt, c, topic);
      break;
    }
    case 'dropbox': {
      const words = q.words || [];
      const seen = new Set();
      for (const w of words) {
        if (seen.has(w)) add(rel, 'DUPLICATE_WORD', `doppeltes Wort „${w}"`);
        seen.add(w);
      }
      if (words.length < 2) add(rel, 'WORDS', 'weniger als 2 Wörter');
      break;
    }
    case 'text-gaps': {
      const gaps = q.gaps || [];
      const blanks = (q.prompt.match(/___/g) || []).length;
      if (blanks !== gaps.length) {
        add(rel, 'GAP_COUNT', `${blanks} ___ vs ${gaps.length} Lücken`);
      }
      const answers = [];
      let from = 0;
      for (let i = 0; i < gaps.length; i++) {
        const g = gaps[i];
        if (g.options?.length !== 3) {
          add(rel, 'GAP_OPTIONS', `Lücke ${i + 1}: braucht genau 3 Optionen`);
        }
        if (!g.options?.includes(g.correct)) {
          add(rel, 'CORRECT_NOT_IN_OPTIONS', `Lücke ${i + 1}: correct="${g.correct}"`);
        }
        const idx = q.prompt.indexOf('___', from);
        if (idx >= 0) {
          auditFusedAtGap(q.prompt.slice(idx), g.correct, rel, `${rel} [Lücke ${i + 1}]`);
          from = idx + 3;
        }
        answers.push(g.correct);
      }
      const filled = fillGaps(q.prompt, answers);
      if (hasDoubleArticle(filled)) add(rel, 'FUSED+ARTICLE', 'ausgefüllter Text: Doppelartikel');
      if (/weiterer Fragen|weiteren Informationen/i.test(filled)) {
        add(rel, 'ADJ_PLURAL', 'Adjektiv-Deklination prüfen');
      }
      break;
    }
    default:
      add(rel, 'UNKNOWN_TYPE', `Typ „${q.type}"`);
  }
}

let total = 0;
for (const file of walk(ROOT)) {
  total += 1;
  const rel = relative(ROOT, file);
  const [level, topic] = rel.split(/[\\/]/);
  const raw = readFileSync(file, 'utf8');
  let q;
  try {
    q = parseQuestionFile(raw, { level, topic, path: rel });
  } catch (e) {
    add(rel, 'PARSE', e.message);
    continue;
  }
  auditQuestion(rel, level, topic, q);
}

// Summary by code
const byCode = new Map();
for (const i of issues) {
  byCode.set(i.code, (byCode.get(i.code) || 0) + 1);
}

console.log(`\n📋 Question bank audit — ${total} files\n`);

if (issues.length === 0) {
  console.log('✅ Keine Probleme gefunden.\n');
  process.exit(0);
}

console.log(`⚠️  ${issues.length} issue(s) in ${new Set(issues.map((i) => i.rel)).size} file(s):\n`);
for (const [code, n] of [...byCode.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${code}: ${n}`);
}
console.log('');

const shown = new Set();
for (const i of issues) {
  const key = `${i.rel}|${i.code}|${i.msg}`;
  if (shown.has(key)) continue;
  shown.add(key);
  console.log(`  [${i.code}] ${i.rel}`);
  console.log(`    ${i.msg}`);
}
console.log('');
process.exit(1);
