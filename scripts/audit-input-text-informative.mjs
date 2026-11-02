#!/usr/bin/env node
/**
 * Audit: input-text questions that don't give the learner enough context
 * (the answer cannot be uniquely inferred from sentence + hint).
 *
 * Heuristic: an input-text question is "uninformative" if neither the
 * sentence body nor the parenthetical hint contains any 3+ letter prefix
 * of the correct answer. Pure functional words (articles, prepositions,
 * conjunctions, particles) are exempt because they form a small closed set.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e.startsWith('_')) continue;
    const f = join(dir, e);
    if (statSync(f).isDirectory()) yield* walk(f);
    else if (e.endsWith('.md')) yield f;
  }
}

const TRIVIAL = new Set([
  'ja','nein','nicht','kein','keine','keinen','keiner','keinem','keines',
  'doch','schon','noch','sehr','nur','auch','aber','und','oder','denn',
  'weil','dass','wenn','als','wie','wo','was','wer','wann','warum','ob','damit','obwohl','obgleich','wenngleich','sobald','sodass','sofern','solange','seitdem','während','bevor','nachdem',
  'er','sie','es','ich','du','wir','ihr',
  'der','die','das','den','dem','des','ein','eine','einen','einem','einer','eines',
  'am','im','zum','zur','beim','vom','ins','ans','aufs','fürs',
  'an','auf','in','mit','bei','von','zu','nach','vor','über','unter','neben','zwischen','aus','seit','für','um','durch','ohne','gegen','bis','entlang','außerhalb','innerhalb','oberhalb','unterhalb','diesseits','jenseits','wegen','trotz','statt','infolge','während','dank','dort','hier','heute','morgen','gestern','dann','danach','sofort','jetzt','immer','manchmal','oft','selten','nie',
  'mir','dir','mich','dich','ihm','ihn','uns','euch','sich','ihnen','ihrer','ihres','ihrem','ihren',
  'hin','her','rüber','runter','rauf','rein','raus',
]);

function parseListBlock(fm, key) {
  const inline = fm.match(new RegExp(`^${key}:[ \\t]*(\\S.*)$`, 'm'));
  if (inline) return [inline[1].trim()];
  const list = fm.match(new RegExp(`^${key}:\\n((?:[ \\t]*- .*\\n?)*)`, 'm'));
  if (!list) return [];
  return [...list[1].matchAll(/^\s*-\s+(.+)$/gm)].map((x) => x[1].trim());
}

const stats = {};

for (const f of walk(ROOT)) {
  const content = readFileSync(f, 'utf8');
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) continue;
  const fm = m[1];
  const body = m[2].trimEnd();
  if (!/^type:\s*input-text/m.test(fm)) continue;
  const corrects = parseListBlock(fm, 'correct');
  if (!corrects.length) continue;
  const correct = corrects[0].toLowerCase().trim();
  if (!correct) continue;

  const topic = basename(dirname(f));
  const lastLine = body.split('\n').pop() || '';
  const hint = (lastLine.match(/\(([^)]*)\)\s*$/)?.[1] || '').toLowerCase();
  const sentence = lastLine.replace(/\s*\([^)]*\)\s*$/, '').toLowerCase();

  // 1) Trivial answer? (functional/closed-class word) → exempt
  if (TRIVIAL.has(correct)) continue;
  if (/^(noch nie|ja, .+|nein, .+)$/i.test(correct)) continue;

  // Normalize umlauts for substring matching (Mann ↔ Männer)
  const deumlaut = (s) => s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
  const correctNu = deumlaut(correct);
  const hintNu = deumlaut(hint);
  const sentenceNu = deumlaut(sentence);

  // 2) Stem search — any 3+ letter prefix of `correct` present in hint or sentence?
  //    For multi-word answers, also try the last token (e.g. `wie lange` → check `lange`).
  let informative = false;
  // 2a) Whole-word check for short answers (`ab`, `ob`, `in`) — use word boundary.
  const wholeWordRe = new RegExp(`\\b${correctNu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  if (wholeWordRe.test(sentenceNu) || wholeWordRe.test(hintNu)) informative = true;
  // 2b) Stem search for longer answers.
  if (!informative) {
    const tokens = correctNu.split(/\s+/);
    const candidates = [correctNu, ...tokens];
    for (const cand of candidates) {
      if (informative) break;
      if (cand.length < 3) continue;
      if (sentenceNu.includes(cand) || hintNu.includes(cand)) { informative = true; break; }
      const stem = cand.replace(/[^a-z-]+$/, '');
      for (let len = stem.length; len >= 3; len--) {
        const sub = stem.slice(0, len);
        if (sub.length < 3) break;
        if (hintNu.includes(sub) || sentenceNu.includes(sub)) { informative = true; break; }
      }
    }
  }

  // 2b) German vowel/consonant alternations in irregular adjectives:
  //   hoch → hoh- (hoher, hohen, hohem)
  //   nah  → näh- (näher, nähe)
  if (!informative) {
    if (/^hoh/.test(correct) && /\bhoch\b/.test(hint)) informative = true;
    if (/^näh/.test(correct) && /\bnah\b/.test(hint)) informative = true;
  }

  // 3) Topic-specific informative hints (semantic — not catchable via stem heuristic).
  if (!informative) {
    // Verb-form hints: `... + Verb X` / `... + Hilfsverb X` / `... + Modalverb X`
    //   X is the infinitive lemma → enough to derive any conjugated form.
    //   Also covers `Reflexiv + Verb X`, `Trennbares Verb`, `lassen + Verb X`.
    if (/\b(?:verb|hilfsverb|modalverb)\s+[a-zäöüß]{3,}/i.test(hint)) informative = true;
    if (/\blassen\s*\+\s*verb\s+[a-zäöüß]{3,}/i.test(hint)) informative = true;
    // Inline lemma in sentence body: `___ (lemma)` — bank inline cue
    if (/___\s*\([a-zäöüß-]+\)/i.test(sentence)) informative = true;
    // GEGENTEILE: `Gegenteil von X` — X is the antonym lemma cue.
    if (/gegenteil\s+von\s+\w+/.test(hint)) informative = true;
    // POSSESSIVARTIKEL: person cue (`ich/du/er/sie/wir/ihr`) is sufficient.
    if (/\b(ich|du|er|sie|wir|ihr|man|es)\b/.test(hint) && /possessiv/i.test(hint)) informative = true;
    // WECHSELPRÄPOSITIONEN: Wo?/Wohin? or Ort/Bewegung cue
    if (/\bwo\?|\bwohin\?|\bort\b|\bbewegung\b/.test(hint)) informative = true;
    // W-FRAGEN: `Frage nach X` or contextual cue
    if (/frage nach \w+/i.test(hint)) informative = true;
    // KOMPARATIV / SUPERLATIV — `Komparativ — adj` or `Superlativ — adj`
    if (/(komparativ|superlativ)\s*—\s*[a-zäöüß]+/i.test(hint)) informative = true;
    // PLURAL — `Plural: X` / `Plural von X` cue
    if (/plural\s*[:—von]+\s*\w+/i.test(hint)) informative = true;
    // PRÄPOSITIONALADVERBIEN — `Pronominaladverb — Präp. X`
    if (/pronominaladverb\s*—\s*präp\.?\s+[a-zäöüß]+/i.test(hint)) informative = true;
    // RELATIVSATZB1 — `Relativpronomen — Präp. X, Y (case)`
    if (/relativpronomen\s*—\s*präp\.?\s+[a-zäöüß]+/i.test(hint)) informative = true;
    // RELATIVSATZB1 — `Relativpronomen — Gen./Dat./Pl.` is enough to derive `dessen/deren/denen`
    if (/relativpronomen/i.test(hint) && /(gen\.|dat\.|pl\.|nom\.|akk\.)/i.test(hint)) {
      if (/^(dessen|deren|denen|der|die|das|den|dem)$/i.test(correct)) informative = true;
    }
    // DEMONSTRATIVARTIKEL — gender+case is sufficient (always `dies-` stem)
    if (/demonstrativ/i.test(hint) && /\b(mask|fem|neutr|pl)\.?/.test(hint)) informative = true;
    // closed-class article answer with full gender+case cue
    if (/(akkusativ|dativ|genitiv|nominativ)/i.test(hint) && /\b(mask|fem|neutr|pl)\.?/.test(hint)) {
      if (/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|keinen|keinem|keiner|keines|mein|meine|meinen|meinem|meiner|meines|dein|sein|ihr|unser|euer)/.test(correct)) informative = true;
    }
  }

  if (!informative) {
    if (!stats[topic]) stats[topic] = [];
    stats[topic].push({
      file: f.replace(`${ROOT}/`, ''),
      correct: corrects[0],
      hint,
      sentence: lastLine.replace(/\s*\([^)]*\)\s*$/, '').trim(),
    });
  }
}

const entries = Object.entries(stats).sort((a, b) => b[1].length - a[1].length);
let total = 0;
for (const [topic, items] of entries) {
  console.log(`\n[${items.length}] ${topic}`);
  total += items.length;
  for (const s of items.slice(0, 3)) {
    console.log(`  ${s.file}`);
    console.log(`    correct=${JSON.stringify(s.correct)} hint="${s.hint}" sent="${s.sentence}"`);
  }
  if (items.length > 3) console.log(`  … and ${items.length - 3} more`);
}
console.log(`\nTOTAL uninformative input-text questions: ${total}`);
process.exit(total ? 1 : 0);
