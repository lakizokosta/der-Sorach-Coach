#!/usr/bin/env node
/**
 * Flags select-one questions where a wrong option is also grammatically valid
 * (e.g. den Patienten = Dativ Pl. when correct is der Patientin = Dativ Sg.).
 *
 * Run: npm run questions:audit-ambiguous-distractors
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseQuestionFile } from '../src/utils/markdownQuestion.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');
const LEVELS = new Set(['A1', 'A2', 'B1', 'B2']);

/** Verbs: only Akkusativ object (person) — dem X is NOT a valid alternative to den X. */
const ACCUSATIVE_ONLY_VERBS =
  /\b(verurteilt|verurteilen|überführt|überführen|ruft|rief|besucht|besuchte|lobt|lobte|kritisiert|kritisierte|grüßt|grüßte)\b/i;

/** Verbs: Dativ (person) + Akkusativ (thing) — blank is the person. */
const DATIV_PERSON_VERBS =
  /\b(erklärt|erklärte|zeigt|zeigte|schenkt|schenkte|verschreibt|verschrieb|empfiehlt|empfehlen|übermittelt|übermittelte|überreicht|überreichte|schickt|schickte|widmet|widmete|leiht|leihte|bringt|brachte|schreibt|schrieb|erteilt|erteilte|stellt|stellte|gibt|gab|erzählt|erzählte|bietet|bot|kauft|kaufte|verkauft|verkaufte|empfehlen|wir empfehlen)\b/i;

const ARTICLE_NOUN =
  /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|meines|dein|deine|deinen|deinem|deiner|deines|sein|seine|seinen|seinem|seiner|seines|ihr|ihre|ihren|ihrem|ihrer|ihres|unser|unsere|unseren|unserem|unserer|unseres|euer|eure|euren|eurem|eurer|eures|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\s+(.+)$/i;

/** Articles that often introduce Dativ singular (person). */
const DATIV_SG_ARTICLES = new Set([
  'der', 'dem', 'die', 'einer', 'einem', 'meiner', 'meinem', 'deiner', 'deinem',
  'seiner', 'seinem', 'ihrer', 'ihrem', 'unserer', 'unserem', 'eurer', 'eurem',
]);

/** den/einen/seinen + n-stem noun → Akk. Sg. OR Dat. Pl. (n-Deklination). */
const ACC_OR_DAT_PL_ARTICLES = new Set([
  'den', 'einen', 'seinen', 'ihren', 'unseren', 'meinen', 'deinen', 'euren',
]);

/** Known n-Deklination / heteroclitic stems (lowercase). */
const N_DECL_STEMS = new Set([
  'patient', 'patienten', 'patientin', 'patientinnen',
  'student', 'studenten', 'studierende', 'studierenden',
  'angeklagte', 'angeklagten',
  'mandant', 'mandanten', 'mandantin',
  'journalist', 'journalisten', 'journalistin',
  'menschen', 'menschen', 'mensch',
  'jungen', 'junge',
  'namen', 'name',
  'herren', 'herr',
  'fahrer', 'fahrer',
  'nachbarn', 'nachbar',
  'unternehmen', // das Unternehmen, den Unternehmen (Pl.)
  'kunden', 'kunde',
  'kollegen', 'kollege',
  'arzt', 'ärzte', 'arzten',
  'forscher', 'forscherin', 'forschern',
]);

function parsePhrase(s) {
  const t = String(s ?? '').trim();
  const m = t.match(ARTICLE_NOUN);
  if (!m) return null;
  return { article: m[1].toLowerCase(), noun: m[2].toLowerCase(), raw: t };
}

function nounStem(noun) {
  return noun
    .replace(/innen$/, 'in')
    .replace(/innen\b/, 'in')
    .replace(/en$/, '')
    .replace(/e$/, '')
    .replace(/in$/, '');
}

function sameNounFamily(a, b) {
  if (!a || !b) return false;
  const sa = nounStem(a);
  const sb = nounStem(b);
  if (sa === sb) return true;
  if (N_DECL_STEMS.has(a) && N_DECL_STEMS.has(b)) {
    return sa.startsWith(sb) || sb.startsWith(sa) || a.includes(sb) || b.includes(sa);
  }
  return a === b || a.startsWith(b) || b.startsWith(a);
}

function stripHint(prompt) {
  return String(prompt || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function afterBlankIsAccusativeObject(prompt) {
  const body = stripHint(prompt);
  const after = body.split('___')[1] || '';
  // "ein/eine/einen …" or definite acc object after person slot
  return /^\s*(ein|eine|einen|das|die|den|einem|einer)\s+\w+/i.test(after);
}

function isDativPersonContext(prompt) {
  return DATIV_PERSON_VERBS.test(stripHint(prompt)) && afterBlankIsAccusativeObject(prompt);
}

function isWeakNounDativPluralForm(article, noun) {
  if (!ACC_OR_DAT_PL_ARTICLES.has(article)) return false;
  const n = noun.split(/\s+/)[0];
  if (N_DECL_STEMS.has(n)) return true;
  return /^(patienten|studenten|studierenden|angeklagten|mandanten|journalisten|menschen|jungen|namen|kunden|kollegen|forschern|unternehmen)$/i.test(n);
}

/**
 * @param {string} correct
 * @param {string} option
 * @param {string} prompt
 */
function ambiguousDativDistractor(correct, option, prompt) {
  if (!isDativPersonContext(prompt)) return null;

  const c = parsePhrase(correct);
  const o = parsePhrase(option);
  if (!c || !o) return null;

  // Correct = Dativ Sg., option = den+stem → valid Dativ Pl. (n-Deklination only)
  if (DATIV_SG_ARTICLES.has(c.article) && isWeakNounDativPluralForm(o.article, o.noun)) {
    if (sameNounFamily(c.noun, o.noun)) {
      return `«${option}» kann Dativ Pl. sein, korrekt ist Dativ Sg. «${correct}»`;
    }
  }

  // Correct = Dativ Sg. (dem/der), option = den+X (n-Dekl. Dat. Pl.)
  if ((c.article === 'dem' || c.article === 'der' || c.article === 'einem' || c.article === 'einer' ||
       c.article.endsWith('em') || c.article.endsWith('er')) &&
      isWeakNounDativPluralForm(o.article, o.noun)) {
    const stemMatch = sameNounFamily(c.noun.replace(/en$/, ''), o.noun) ||
      c.noun.includes(o.noun.slice(0, -2)) || o.noun.includes(c.noun.slice(0, -3));
    if (stemMatch) {
      return `«${option}» = Dativ Pl., ebenfalls grammatisch möglich neben «${correct}»`;
    }
  }

  return null;
}

/**
 * Correct is den/einen (intended Akk. Sg. n-Dekl.), option is dem/einem (Dat. Sg.) — both valid for some verbs.
 */
function ambiguousAccusativeDistractor(correct, option, prompt) {
  const body = stripHint(prompt);
  if (ACCUSATIVE_ONLY_VERBS.test(body)) return null;
  if (DATIV_PERSON_VERBS.test(body) && afterBlankIsAccusativeObject(prompt)) return null;

  const c = parsePhrase(correct);
  const o = parsePhrase(option);
  if (!c || !o) return null;

  if (ACC_OR_DAT_PL_ARTICLES.has(c.article) && (o.article === 'dem' || o.article === 'einem' || o.article.endsWith('em'))) {
    if (sameNounFamily(c.noun, o.noun) && (c.noun.endsWith('en') || c.noun.endsWith('n'))) {
      return `«${option}» (Dat. Sg.) ist bei Akk.-Antwort «${correct}» oft ebenfalls plausibel`;
    }
  }
  return null;
}

/** @type {{ sev: string, rel: string, id: string, msg: string, option: string }[]} */
export function collectAmbiguousDistractorIssues(files) {
  const issues = [];

  for (const { rel, q, level, topic } of files) {
    if (q.type !== 'select-one' || !q.prompt?.includes('___')) continue;

    const correct = String(q.correct ?? '').trim();
    const options = q.options || [];
    const seen = new Set();

    for (const opt of options) {
      const o = String(opt).trim();
      if (o === correct || seen.has(o)) continue;
      seen.add(o);

      const msg =
        ambiguousDativDistractor(correct, o, q.prompt) ||
        ambiguousAccusativeDistractor(correct, o, q.prompt);
      if (msg) {
        issues.push({ sev: 'MAJOR', rel, id: q.id, msg, option: o });
      }
    }
  }

  const unique = new Map();
  for (const i of issues) {
    const key = `${i.id.split('-').slice(0, -1).join('-')}|${i.option}|${i.msg.slice(0, 40)}`;
    if (!unique.has(key)) unique.set(key, i);
  }
  return [...unique.values()];
}

function main() {
  /** @type {{ sev: string, rel: string, id: string, msg: string, option: string }[]} */
  const issues = [];

  for (const file of walk(ROOT)) {
    const rel = relative(join(ROOT, '..'), file);
    const parts = rel.split('/');
    const level = parts[1];
    const topic = parts[2];
    if (!LEVELS.has(level)) continue;

    let q;
    try {
      q = parseQuestionFile(readFileSync(file, 'utf8'), { level, topic, path: rel });
    } catch {
      continue;
    }

    issues.push(...collectAmbiguousDistractorIssues([{ rel, q, level, topic }]));
  }

  console.log('\n📋 Ambiguous distractor audit\n');
  console.log(`  Issues: ${issues.length}\n`);

  if (issues.length === 0) {
    console.log('✅ No ambiguous distractors found.\n');
    process.exit(0);
  }

  for (const i of issues) {
    console.log(`  [${i.sev}] ${i.id} — ${i.rel}`);
    console.log(`    ${i.msg}\n`);
  }

  process.exit(1);
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
