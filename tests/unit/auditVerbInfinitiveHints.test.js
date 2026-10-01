import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import verbLemmas from '../../src/data/verbLemmas.json';
import { parseQuestionFile } from '../../src/utils/markdownQuestion.js';

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

const CORE_INF = /^(?:sein|haben|werden|tun|wissen|können|müssen|sollen|dürfen|wollen|mögen|möchten)$/;

/** @param {string} w */
function looksLikeGermanInfinitive(w) {
  const x = String(w || '').toLowerCase().trim();
  if (!x || x.includes(' ')) return false;
  if (CORE_INF.test(x)) return true;
  return /(?:en|eln|ern)$/i.test(x) && x.length >= 4;
}

/** @param {string} hint */
function expectedFromHint(hint) {
  const h = String(hint || '');
  const hilfs = h.match(/^Passiv\s*\+\s*Hilfsverb\s+([a-zäöüß-]+)/i);
  if (hilfs) return hilfs[1].toLowerCase();
  const pass = h.match(/^Passiv\s*\+\s*Verb\s+([a-zäöüß-]{4,})/i);
  if (pass) return pass[1].toLowerCase();
  const m = h.match(/\bVerb\s+([a-zäöüß-]+)/i);
  return m ? m[1].toLowerCase() : '';
}

/** @param {string} prompt */
function expectedFromPromptParen(prompt) {
  const m = String(prompt || '').match(/\(([^)]*)\)\s*$/);
  if (!m) return '';
  const inner = m[1];
  const v = inner.match(/\bVerb\s+([a-zäöüß-]+)/i);
  return v ? v[1].toLowerCase() : '';
}

/**
 * Best authoritative infinitive for Tipp, when the task declares one.
 *
 * @param {!Object} q
 * @return {string}
 */
function authoritativeInfinitive(q) {
  const fromHint = expectedFromHint(q.hint || '');
  if (fromHint && looksLikeGermanInfinitive(fromHint)) return fromHint;

  const fromParen = expectedFromPromptParen(q.prompt || '');
  if (fromParen && looksLikeGermanInfinitive(fromParen)) return fromParen;

  const lemma = String(q.lemma || '').trim().toLowerCase();
  if (lemma && looksLikeGermanInfinitive(lemma)) {
    const focusWord = String(q.focus || '').toLowerCase() === 'word';
    const correct = String(q.correct?.[0] || '').trim().toLowerCase();
    if (focusWord && correct && correct === lemma) return '';
    if (correct && correct === lemma) return '';
    return lemma;
  }

  const correct = String(q.correct?.[0] || '').trim().toLowerCase();
  const fromDict = correct ? String(verbLemmas[correct] || '').toLowerCase() : '';
  if (fromDict && looksLikeGermanInfinitive(fromDict)) return fromDict;

  return '';
}

/** Collect every input-text that shows a Tipp infinitive. */
function collectInfinitiveHints() {
  const roots = [resolve('src/questions'), resolve('src/questions-vocab')];
  /** @type {!Array<{ path: string, shown: string, expected: string, correct: string, hint: string }>} */
  const rows = [];

  for (const root of roots) {
    for (const file of walk(root)) {
      const rel = relative(process.cwd(), file);
      const parts = rel.split(/[/\\]/);
      const level = parts[2];
      const topic = parts[3];
      let q;
      try {
        q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: rel });
      } catch {
        continue;
      }
      if (q.type !== 'input-text') continue;

      const shown = String(q.verbInfinitive || '').trim().toLowerCase();
      if (!shown) continue;

      rows.push({
        path: rel,
        shown,
        expected: authoritativeInfinitive(q),
        correct: String(q.correct?.[0] || ''),
        hint: String(q.hint || ''),
      });
    }
  }
  return rows;
}

describe('audit verbInfinitive hints (bank-wide)', () => {
  it('scans every grammar + vocab input-text that exposes Tipp «Infinitive»', () => {
    const rows = collectInfinitiveHints();
    expect(rows.length).toBeGreaterThan(200);
  });

  it('shows a real German infinitive (never a finite form like wussten / wären)', () => {
    const bad = collectInfinitiveHints().filter((r) => !looksLikeGermanInfinitive(r.shown));
    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
  });

  it('does not show the gap answer when it is not an infinitive', () => {
    const bad = collectInfinitiveHints().filter((r) => {
      const c = r.correct.toLowerCase();
      return c && r.shown === c && !looksLikeGermanInfinitive(c);
    });
    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
  });

  it('matches authoritative Verb … / Passiv … / lemma / verbLemmas when declared', () => {
    const mismatches = collectInfinitiveHints().filter(
      (r) => r.expected && r.shown !== r.expected,
    );
    expect(mismatches, JSON.stringify(mismatches, null, 2)).toEqual([]);
  });
});
