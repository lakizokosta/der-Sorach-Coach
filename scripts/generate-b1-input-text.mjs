#!/usr/bin/env node
/**
 * Generates B1 input-text questions (in-001 … in-050) per Premium grammar topic.
 * Banks are derived from b1-select-one-data with topic-specific hints.
 * Run: npm run questions:generate-b1-input
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './b1-input-text-shared.mjs';
import * as G from './b1-select-one-data.mjs';
import { transformHint } from './fix-input-text-hints.mjs';
import { possessivWhoFromForm } from './topic-context-hints.mjs';
import { finiteToInfinitive } from './verb-hint-banks.mjs';

const FORCE = process.argv.includes('--force');
const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B1');

const TOPICS = {
  ADJEKTIVDEKLINATIONB1: { prefix: 'b1-adj-in', gen: G.genAdjektivdeklinationB1 },
  AKKUSATIVB1: { prefix: 'b1-akk-in', gen: G.genAkkusativB1 },
  DEMONSTRATIVARTIKEL: { prefix: 'b1-demo-in', gen: G.genDemonstrativartikel },
  ERGÄNZUNGSSATZ: { prefix: 'b1-erg-in', gen: G.genErgaenzungssatz },
  FINALSATZ: { prefix: 'b1-fin-in', gen: G.genFinalsatz },
  INDIREKTEFRAGESÄTZE: { prefix: 'b1-indfr-in', gen: G.genIndirekteFragesaetze },
  KAUSALSATZ: { prefix: 'b1-kaus-in', gen: G.genKausalsatz },
  KONJUNKTIV2: { prefix: 'b1-k2-in', gen: G.genKonjunktiv2 },
  KONDITIONALSATZ: { prefix: 'b1-kond-in', gen: G.genKonditionalsatz },
  KONZESSIVSATZB1: { prefix: 'b1-konz-in', gen: G.genKonzessivsatzB1 },
  KONJUNKTIONALADVERBIEN: { prefix: 'b1-kadv-in', gen: G.genKonjunktionaladverbien },
  LOKALEPRÄPOSITIONENB1: { prefix: 'b1-lokal-in', gen: G.genLokalePraepositionenB1 },
  NOMENPRÄPOSITIONVERBINDUNGB1: { prefix: 'b1-npv-in', gen: G.genNomenPraepositionB1 },
  PASSIVB1: { prefix: 'b1-pass-in', gen: G.genPassivB1 },
  PERFEKTB1: { prefix: 'b1-perf-in', gen: G.genPerfektB1 },
  PRÄPOSITIONENGENITIVB1: { prefix: 'b1-gen-in', gen: G.genPraepositionenGenitivB1 },
  PRÄPOSITIONALERGÄNZUNG: { prefix: 'b1-praeg-in', gen: G.genPraepositionaleErgaenzung },
  PRÄPOSITIONALADVERBIEN: { prefix: 'b1-pradv-in', gen: G.genPraepositionaleAdverbien },
  POSSESSIVARTIKELB1: { prefix: 'b1-poss-in', gen: G.genPossessivartikelB1 },
  PRÄPOSITIONENB1: { prefix: 'b1-praep-in', gen: G.genPraepositionenB1 },
  RELATIVSATZB1: { prefix: 'b1-rel-in', gen: G.genRelativsatzB1 },
  TRENNBAREVERBENB1: { prefix: 'b1-trenn-in', gen: G.genTrennbareVerbenB1 },
  VERNEINUNG: { prefix: 'b1-neg-in', gen: G.genVerneinung },
  VERBNOMENVERBINDUNGB1: { prefix: 'b1-vnv-in', gen: G.genVerbNomenVerbindungB1 },
  VERBLASSEN: { prefix: 'b1-lass-in', gen: G.genVerblassen },
  WORTSCHATZB1: { prefix: 'b1-ws-in', gen: G.genWortschatzB1 },
  // SPRACHBAUSTEINEB1: exam format only (select-one + lesen), no input-text
};

/** Default hint suffix per topic (inner part before transformHint). */
const HINT = {
  ADJEKTIVDEKLINATIONB1: 'Adjektivdeklination',
  AKKUSATIVB1: 'Akkusativ',
  DEMONSTRATIVARTIKEL: 'Demonstrativartikel',
  ERGÄNZUNGSSATZ: 'Ergänzungssatz',
  FINALSATZ: 'Finalsatz — um/damit',
  INDIREKTEFRAGESÄTZE: 'Indirekte Frage',
  KAUSALSATZ: 'Kausalsatz — weil/da/denn',
  KONJUNKTIV2: 'Konjunktiv II',
  KONDITIONALSATZ: 'Konditionalsatz — wenn/falls',
  KONZESSIVSATZB1: 'Konzessivsatz — obwohl/obschon/trotzdem',
  KONJUNKTIONALADVERBIEN: 'Konjunktionaladverb',
  LOKALEPRÄPOSITIONENB1: 'Lokale Präposition',
  NOMENPRÄPOSITIONVERBINDUNGB1: 'Nomen + Präposition',
  PASSIVB1: 'Passiv — werden',
  PERFEKTB1: 'Perfekt — haben/sein',
  PRÄPOSITIONENGENITIVB1: 'Genitiv-Präposition',
  PRÄPOSITIONALERGÄNZUNG: 'Verb + Präposition',
  PRÄPOSITIONALADVERBIEN: 'Pronominaladverb',
  POSSESSIVARTIKELB1: 'Possessivartikel',
  PRÄPOSITIONENB1: 'Präposition',
  RELATIVSATZB1: 'Relativpronomen',
  TRENNBAREVERBENB1: 'Trennbares Verb',
  VERNEINUNG: 'Verneinung — nicht/kein',
  VERBNOMENVERBINDUNGB1: 'Verb-Nomen-Verbindung',
  VERBLASSEN: 'lassen + Infinitiv',
  WORTSCHATZB1: 'Wortschatz B1',
};

const POSSESSIV_CASE = {
  // form → case
  mein: 'Nom.', meine: 'Nom./Akk.', meinen: 'Akk.', meinem: 'Dat.', meiner: 'Dat./Gen.', meines: 'Gen.',
  dein: 'Nom.', deine: 'Nom./Akk.', deinen: 'Akk.', deinem: 'Dat.', deiner: 'Dat./Gen.', deines: 'Gen.',
  sein: 'Nom.', seine: 'Nom./Akk.', seinen: 'Akk.', seinem: 'Dat.', seiner: 'Dat./Gen.', seines: 'Gen.',
  ihr: 'Nom.', ihre: 'Nom./Akk.', ihren: 'Akk.', ihrem: 'Dat.', ihrer: 'Dat./Gen.', ihres: 'Gen.',
  unser: 'Nom.', unsere: 'Nom./Akk.', unseren: 'Akk.', unserem: 'Dat.', unserer: 'Dat./Gen.', unseres: 'Gen.',
  euer: 'Nom.', eure: 'Nom./Akk.', euren: 'Akk.', eurem: 'Dat.', eurer: 'Dat./Gen.', eures: 'Gen.',
};

const DEMONSTRATIV_CASE = {
  dieser: 'mask., Nom.', diese: 'fem./Pl., Nom./Akk.', dieses: 'neutr., Nom./Akk. / mask./neutr., Gen.',
  diesen: 'mask., Akk. / Pl., Dat.', diesem: 'mask./neutr., Dat.',
  jener: 'mask., Nom.', jene: 'fem./Pl., Nom./Akk.', jenes: 'neutr., Nom./Akk.',
  jenen: 'mask., Akk. / Pl., Dat.', jenem: 'mask./neutr., Dat.',
  derjenige: 'mask., Nom.', diejenige: 'fem., Nom./Akk.', dasjenige: 'neutr., Nom./Akk.',
  denjenigen: 'mask., Akk. / Pl., Dat.', demjenigen: 'mask./neutr., Dat.',
  derselbe: 'mask., Nom.', dieselbe: 'fem., Nom./Akk.', dasselbe: 'neutr., Nom./Akk.',
};

const RELATIV_HINT = {
  der: 'mask., Nom.', die: 'fem./Pl., Nom./Akk.', das: 'neutr., Nom./Akk.',
  den: 'mask., Akk. / Pl., Dat.', dem: 'mask./neutr., Dat.',
  denen: 'Pl., Dat.', deren: 'fem./Pl., Gen.', dessen: 'mask./neutr., Gen.',
};

/** Per-prompt hints for Adjektivdeklination (blank = adjective ending). */
const ADJ_HINT = {
  'In einem ___ Büro': 'modern, mask., Dat.',
  'Der Chef präsentiert einen ___ Bericht': 'wichtig, mask., Akk.',
  'Der ___ Studiengang': 'neu, mask., Nom.',
  'Sie liest einen ___ Artikel': 'interessant, mask., Akk.',
  'Wegen ___ Wetters': 'schlecht, neutr., Gen.',
  'Er diskutiert mit einer ___ Politikerin': 'erfahren, fem., Dat.',
  'In einem ___ Krankenhaus': 'groß, neutr., Dat.',
  'Die Zeitung berichtet über eine ___ Entwicklung': 'aktuell, fem., Akk.',
  'Trotz ___ Preises': 'hoch, mask., Gen.',
  'Wir sprechen mit einem ___ Professor': 'neu, mask., Dat.',
  'Die ___ Konferenz': 'international, fem., Nom.',
  'Er hat einen ___ Rat': 'gut, mask., Akk.',
  'In einer ___ Gegend': 'ruhig, fem., Dat.',
  'Das ist ein ___ Thema': 'wichtig, neutr., Nom.',
  'Sie reist mit ___ Gepäck': 'klein, neutr., Dat.',
};

/**
 * Extract managed-preposition from a question body for Pronominaladverbien.
 *   `Interessierst du dich für den Kurs? — ...` → `für`
 *   `Freust du dich auf die Reise? — ...` → `auf`
 * @param {string} body
 */
function pronominaladverbPreposition(body) {
  const m = body.match(/\b(?:für|an|auf|über|von|mit|nach|bei|um|zu|aus|durch|gegen|in|vor|hinter|neben|unter|zwischen)\b/);
  return m?.[0] || '';
}

/** Trennbares Verb lemma from finite + body particle. */
function trennbarLemma(correct, body) {
  const inf = finiteToInfinitive(correct) || correct;
  // particle at the end of clause before `?` or `.` or `,`
  const part = body.match(/\b(an|ab|auf|aus|ein|los|mit|nach|vor|weg|zu|her|hin|um|zurück|zusammen|fort|wieder|fest|frei|hoch|nieder|wider)\b\s*[?.,!]/);
  if (part) return `${part[1]}${inf}`;
  return inf;
}

/**
 * @param {string} topic
 * @param {string} prompt
 * @param {string} correct
 * @return {string}
 */
function hintInner(topic, prompt, correct = '') {
  if (topic === 'ADJEKTIVDEKLINATIONB1') {
    for (const [key, spec] of Object.entries(ADJ_HINT)) {
      if (prompt.includes(key)) return `Adj. — ${spec}`;
    }
  }
  if (topic === 'POSSESSIVARTIKELB1') {
    const who = possessivWhoFromForm(correct);
    const caseInfo = POSSESSIV_CASE[String(correct).toLowerCase()] || '';
    const parts = [who, caseInfo].filter(Boolean).join(', ');
    return parts ? `Possessivartikel — ${parts}` : 'Possessivartikel';
  }
  if (topic === 'DEMONSTRATIVARTIKEL') {
    const c = String(correct).toLowerCase();
    const caseInfo = DEMONSTRATIV_CASE[c] || '';
    return caseInfo ? `Demonstrativartikel — ${caseInfo}` : 'Demonstrativartikel';
  }
  if (topic === 'RELATIVSATZB1') {
    const c = String(correct).toLowerCase().trim();
    const tokens = c.split(/\s+/);
    const tail = tokens[tokens.length - 1];
    const prep = tokens.length > 1 ? tokens[0] : '';
    const caseInfo = RELATIV_HINT[tail] || '';
    if (prep && caseInfo) return `Relativpronomen — Präp. ${prep} + ${tail}, ${caseInfo}`;
    return caseInfo ? `Relativpronomen — ${caseInfo}` : 'Relativpronomen';
  }
  if (topic === 'PRÄPOSITIONALADVERBIEN') {
    const prep = pronominaladverbPreposition(prompt);
    // correct is like 'dafür', 'darauf', 'daran' — strip leading 'da(r)?' to expose the prep
    const tail = String(correct).toLowerCase().replace(/^da(r)?/, '');
    return prep ? `Pronominaladverb — Präp. ${prep}` : (tail ? `Pronominaladverb — Präp. ${tail}` : 'Pronominaladverb');
  }
  if (topic === 'TRENNBAREVERBENB1') {
    const lemma = trennbarLemma(correct, prompt);
    return lemma ? `Trennbares Verb — ${lemma}` : 'Trennbares Verb';
  }
  return HINT[topic] || topic;
}

/** Build a closed-set hint listing correct + distractors so input-text matches the select-one alternatives. */
function closedSetHint(label, correct, options) {
  const all = [String(correct), ...((options || []).filter((o) => o !== correct))];
  // Sort alphabetically for stability; cap at 5 entries.
  const sorted = [...new Set(all.map((s) => String(s).trim()))].slice(0, 5).sort((a, b) => a.localeCompare(b, 'de'));
  return `${label} — ${sorted.join(' / ')}`;
}

/** Topics where input-text is essentially a lexical recall task — the hint
 *  must enumerate the candidate alternatives, otherwise the answer is unguessable.
 */
const CLOSED_SET_TOPICS = {
  WORTSCHATZB1: 'Wortschatz',
  VERBNOMENVERBINDUNGB1: 'Verb-Nomen-Verbindung',
  KONJUNKTIONALADVERBIEN: 'Konjunktionaladverb',
  PRÄPOSITIONENB1: 'Präposition',
  LOKALEPRÄPOSITIONENB1: 'Lokale Präposition',
  AKKUSATIVB1: 'Akkusativ',
  INDIREKTEFRAGESÄTZE: 'Indirekte Frage',
};

function writeTopic(folder, prefix, questions) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  questions.slice(0, 50).forEach((q, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, folder, `${id}.md`);
    if (!FORCE && existsSync(path)) return;
    let prompt;
    if (CLOSED_SET_TOPICS[folder]) {
      const hint = closedSetHint(CLOSED_SET_TOPICS[folder], q.correct, q.options || []);
      prompt = `${q.prompt} (${hint})`;
    } else {
      const inner = hintInner(folder, q.prompt, q.correct);
      const hint = transformHint(inner, folder, [q.correct], q.options || [], q.prompt, id);
      prompt = `${q.prompt} (${hint})`;
    }
    writeFileSync(path, md(id, prompt, q.correct), 'utf8');
    n += 1;
  });
  return n;
}

let total = 0;
for (const [folder, { prefix, gen }] of Object.entries(TOPICS)) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const qs = gen();
  const n = writeTopic(folder, prefix, qs);
  total += n;
  console.log(`${folder}: ${FORCE ? 'regen' : '+'}${n} input-text`);
}
console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} input-text files: ${total}`);
