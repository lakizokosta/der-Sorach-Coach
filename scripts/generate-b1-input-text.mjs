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
  KONDITIONALSATZ: 'Konditionalsatz — wenn',
  KONZESSIVSATZB1: 'Konzessivsatz — obwohl',
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
 * @param {string} topic
 * @param {string} prompt
 * @return {string}
 */
function hintInner(topic, prompt) {
  if (topic === 'ADJEKTIVDEKLINATIONB1') {
    for (const [key, spec] of Object.entries(ADJ_HINT)) {
      if (prompt.includes(key)) return `Adj. — ${spec}`;
    }
  }
  return HINT[topic] || topic;
}

function writeTopic(folder, prefix, questions) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  questions.slice(0, 50).forEach((q, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (!FORCE && existsSync(path)) return;
    const inner = hintInner(folder, q.prompt);
    const hint = transformHint(inner, folder, [q.correct]);
    const prompt = `${q.prompt} (${hint})`;
    writeFileSync(path, md(`${prefix}-${num}`, prompt, q.correct), 'utf8');
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
