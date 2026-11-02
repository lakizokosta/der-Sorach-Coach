#!/usr/bin/env node
/**
 * Final QA gate — extended checks beyond individual audit scripts.
 * Run: npm run questions:audit-final
 *
 * Expects all other audit scripts to pass first (or run via CI chain).
 * Exits 1 if CRITICAL/MAJOR issues found.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';
import { duplicateModalIssue } from './audit-duplicate-modal.mjs';
import { collectAmbiguousDistractorIssues } from './audit-ambiguous-distractors.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');
const LEVELS = new Set(['A1', 'A2', 'B1', 'B2']);

/** @type {{ sev: string, rel: string, id: string, cat: string, msg: string }[]} */
const issues = [];

function add(sev, rel, id, cat, msg) {
  issues.push({ sev, rel, id, cat, msg });
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

function fillAccepts(correctList, input) {
  const acc = correctList.map((s) => String(s).toLowerCase());
  return acc.includes(String(input).trim().toLowerCase());
}

function extractHint(prompt) {
  return (prompt.match(/\(([^)]+)\)\s*$/) || [])[1] || '';
}

function hasDoubleArticle(text) {
  return /\b(im dem|am dem|zum dem|beim dem|vom dem|zur der|ins das|ans das)\b/i.test(text);
}

const CONJ_RULES = {
  KAUSALSATZ: { 'weil/da': ['weil', 'da'], denn: ['denn'] },
  KONZESSIVSATZB1: { 'obwohl/obschon': ['obwohl', 'obschon'], trotzdem: ['trotzdem'] },
  FINALSATZ: { um: ['um'], damit: ['damit'] },
  KONDITIONALSATZ: { 'wenn/falls': ['wenn', 'falls'], sobald: ['sobald'] },
};

function checkConjunctionHint(topic, hint, correctList) {
  const h = hint.toLowerCase();
  const accepted = correctList.map((c) => String(c).trim().toLowerCase());
  const rules = CONJ_RULES[topic];
  if (!rules) return false;

  for (const [hintKey, allowed] of Object.entries(rules)) {
    const parts = hintKey.split('/');
    if (!parts.every((p) => h.includes(p))) continue;

    for (const syn of allowed) {
      if (!accepted.includes(syn)) return true;
    }
    if (hintKey === 'weil/da' && h.includes('denn')) return true;
    if (hintKey === 'denn' && (h.includes('weil') || h.includes('/da'))) return true;
    if (hintKey === 'trotzdem' && (h.includes('obwohl') || h.includes('obschon'))) return true;
    if (hintKey === 'obwohl/obschon' && h.includes('trotzdem')) return true;
    if (hintKey === 'um' && h.includes('damit')) return true;
    if (hintKey === 'damit' && h.includes('um')) return true;
    if (hintKey === 'sobald' && (h.includes('wenn') || h.includes('falls'))) return true;
    if (hintKey === 'wenn/falls' && h.includes('sobald')) return true;
    return false;
  }
  return false;
}

const ids = new Map();

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  const [level, topic] = rel.split(/[\\/]/);
  if (!LEVELS.has(level)) continue;

  let q;
  try {
    q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: rel });
  } catch (e) {
    add('CRITICAL', rel, '?', 'structure', e.message);
    continue;
  }

  if (ids.has(q.id)) {
    add('CRITICAL', rel, q.id, 'structure', `duplicate id, also in ${ids.get(q.id)}`);
  } else {
    ids.set(q.id, rel);
  }

  const hint = extractHint(q.prompt || '');

  if (q.type === 'input-text') {
    const corrects = q.correct || [];
    if (!corrects.length || corrects.some((c) => !String(c).trim())) {
      add('CRITICAL', rel, q.id, 'correct', 'empty correct');
    }
    if (!q.prompt?.includes('___')) {
      add('CRITICAL', rel, q.id, 'structure', 'input-text without ___');
    }

    for (const c of corrects) {
      if (!fillAccepts(corrects, c)) {
        add('CRITICAL', rel, q.id, 'runtime', `correct "${c}" rejected by FillBlank logic`);
      }
    }

    if (q.prompt?.includes('___')) {
      const filled = q.prompt.replace('___', String(corrects[0] || ''));
      if (hasDoubleArticle(filled)) add('CRITICAL', rel, q.id, 'grammar', 'Doppelartikel when filled');
      const dupModal = duplicateModalIssue(q.prompt, corrects[0] || '');
      if (dupModal) add('CRITICAL', rel, q.id, 'grammar', dupModal);
    }

    if (/^\s*adjektivendung\s*$/i.test(hint)) {
      add('CRITICAL', rel, q.id, 'hint', 'only (Adjektivendung) without lemma');
    }
    if (/^\s*präsensform\s*$/i.test(hint)) {
      add('CRITICAL', rel, q.id, 'hint', 'only (Präsensform) without verb lemma');
    }
    if (/^\s*grammatikform\s*$/i.test(hint)) {
      add('CRITICAL', rel, q.id, 'hint', 'only (Grammatikform)');
    }
    if (/sien/i.test(hint)) add('MINOR', rel, q.id, 'hint', 'typo sien in hint');

    if (checkConjunctionHint(topic, hint, corrects)) {
      add('MAJOR', rel, q.id, 'runtime', `hint/correct mismatch: (${hint})`);
    }
  }

  if (q.type === 'select-one') {
    const cv = String(q.correct ?? '').trim();
    if (!q.options?.some((o) => String(o).trim() === cv)) {
      add('CRITICAL', rel, q.id, 'correct', `correct "${cv}" not in options`);
    }
    if (q.prompt?.includes('___')) {
      const dupModal = duplicateModalIssue(q.prompt, cv);
      if (dupModal) add('CRITICAL', rel, q.id, 'grammar', dupModal);
    }
    for (const amb of collectAmbiguousDistractorIssues([{ rel, q, level, topic }])) {
      add('MAJOR', rel, q.id, 'distractor', amb.msg);
    }
  }
}

const bySev = { CRITICAL: 0, MAJOR: 0, MINOR: 0 };
for (const i of issues) bySev[i.sev] = (bySev[i.sev] || 0) + 1;

console.log('\n📋 Final QA extended audit\n');
console.log(`  CRITICAL: ${bySev.CRITICAL}`);
console.log(`  MAJOR:    ${bySev.MAJOR}`);
console.log(`  MINOR:    ${bySev.MINOR}\n`);

if (issues.length === 0) {
  console.log('✅ All extended checks passed.\n');
  process.exit(0);
}

for (const i of issues.slice(0, 30)) {
  console.log(`  [${i.sev}] [${i.cat}] ${i.id} ${i.rel}`);
  console.log(`    ${i.msg}`);
}
if (issues.length > 30) console.log(`  … and ${issues.length - 30} more\n`);
process.exit(bySev.CRITICAL + bySev.MAJOR > 0 ? 1 : 0);
