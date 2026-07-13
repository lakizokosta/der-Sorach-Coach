#!/usr/bin/env node
/**
 * Flags fill-in questions where the same modal verb appears twice
 * (finite Konjunktiv/indicative + infinitive), e.g.
 *   „Sie sagte, sie müsse den Termin verschieben müssen.“
 *
 * Run: npm run questions:audit-duplicate-modal
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/utils/markdownQuestion.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

/** @type {{ inf: string, finite: RegExp }[]} */
const MODAL_INFINITIVES = [
  { inf: 'können', finite: /\b(könne|könnt|kann|könnte|könnten|könntest|könntet)\b/i },
  { inf: 'müssen', finite: /\b(müsse|müsst|muss|müsste|müssten|müsstest|müsstet)\b/i },
  { inf: 'dürfen', finite: /\b(dürfe|dürft|darf|dürfte|dürften|dürftest|dürftet)\b/i },
  { inf: 'sollen', finite: /\b(solle|sollt|soll|sollte|sollten|solltest|solltet)\b/i },
  { inf: 'wollen', finite: /\b(wolle|wollt|will|wollte|wollten|wolltest|wolltet)\b/i },
  { inf: 'mögen', finite: /\b(möge|mögt|mag|möchte|möchten|möchtest|möchtet)\b/i },
];

/**
 * @param {string} prompt
 * @return {string}
 */
function sentenceBody(prompt) {
  return String(prompt)
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}

/**
 * @param {string} prompt
 * @param {string} correct
 * @return {string|null}
 */
export function duplicateModalIssue(prompt, correct) {
  if (!prompt?.includes('___')) return null;
  const filled = sentenceBody(prompt).replace('___', String(correct).trim());
  for (const { inf, finite } of MODAL_INFINITIVES) {
    const infRe = new RegExp(`\\b${inf}\\b`, 'i');
    const match = infRe.exec(filled);
    if (!match) continue;
    const before = filled.slice(0, match.index);
    if (finite.test(before)) {
      return `duplicate modal „${inf}“ (finite + infinitive): ${filled.replace(/\s+/g, ' ').trim()}`;
    }
  }
  return null;
}

/** @type {{ rel: string, id: string, msg: string }[]} */
function collectDuplicateModalIssues() {
  /** @type {{ rel: string, id: string, msg: string }[]} */
  const issues = [];

  function* walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('_')) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) yield* walk(full);
      else if (entry.endsWith('.md')) yield full;
    }
  }

  for (const path of walk(ROOT)) {
    const rel = relative(join(ROOT, '..'), path);
    let q;
    try {
      q = parseQuestionFile(readFileSync(path, 'utf8'), { path: rel });
    } catch {
      continue;
    }
    if (!q.prompt?.includes('___')) continue;

    const corrects =
      q.type === 'input-text'
        ? (q.correct || []).map(String)
        : q.correct != null
          ? [String(q.correct)]
          : [];

    for (const correct of corrects) {
      const msg = duplicateModalIssue(q.prompt, correct);
      if (msg) issues.push({ rel, id: q.id, msg });
    }
  }

  return issues;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const issues = collectDuplicateModalIssues();

  console.log('\n📋 Duplicate modal verb audit\n');
  if (issues.length === 0) {
    console.log('✅ No duplicate modal verbs found.\n');
    process.exit(0);
  }

  for (const i of issues) {
    console.log(`  [CRITICAL] ${i.id} ${i.rel}`);
    console.log(`    ${i.msg}`);
  }
  console.log(`\n  Total: ${issues.length}\n`);
  process.exit(1);
}
