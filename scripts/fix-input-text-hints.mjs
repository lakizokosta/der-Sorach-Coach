#!/usr/bin/env node
/**
 * Removes answer-leaking parenthetical hints from input-text questions.
 * Run: node scripts/fix-input-text-hints.mjs
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVerbLemmaFromInner, verbFormHint } from './topic-context-hints.mjs';
import {
  buildInputTextPrompt,
  extractParentheticalHint,
  taskInstruction,
} from './input-text-prompt-shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

function* walkMd(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkMd(full);
    else if (entry.endsWith('.md') && entry.includes('-in-')) yield full;
  }
}

const TOPIC_LABEL = {
  NEGATION: 'Negation',
  GEGENTEILE: 'Gegenteile',
  PLURAL: 'Plural',
  POSSESSIVARTIKEL: 'Possessivartikel',
  POSSESSIVARTIKELA2: 'Possessivartikel',
  VERBKONJUGATION: 'Verbkonjugation',
  ADJEKTIVDEKLINATIONA1: 'Adjektivdeklination',
  ADJEKTIVDEKLINATIONA2: 'Adjektivdeklination',
  WECHSELPRÄPOSITIONEN: 'Wechselpräpositionen',
  WECHSELPRÄPOSITIONENA2: 'Wechselpräpositionen',
  DATIVA1: 'Dativ',
  DATIVA2: 'Dativ',
  AKKUSATIVA1: 'Akkusativ',
  AKKUSATIVA2: 'Akkusativ',
  ARTIKEL: 'Artikel',
  'W-FRAGEN': 'W-Fragen',
  ANTWORTPARTIKELN: 'Antwortpartikel',
  KONJUNKTIONENA2: 'Konjunktion',
  PERFEKTA2: 'Perfekt',
  PRÄTERITUMA2: 'Präteritum',
  MODALVERBENA2: 'Modalverb',
  REFLEXIVPRONOMEN: 'Reflexivpronomen',
  KOMPARATIVA2: 'Komparativ',
  SUPERLATIVA2: 'Superlativ',
  FESTEPRÄPOSITIONENA2: 'Feste Präpositionen',
  GENITIVA2: 'Genitiv',
  INDEFINITPRONOMEN: 'Indefinitpronomen',
  NOMENPRÄPOSITIONVERBINDUNGA2: 'Nomen-Präposition',
  TRENNBAREVERBEN: 'Trennbare Verben',
  TEMPORALSATZ: 'Temporalsatz',
  LOKALPRÄPOSITIONENA2: 'Lokale Präpositionen',
  'N-DEKLINATION': 'N-Deklination',
  PASSIVB1: 'Passiv',
  KONJUNKTIV2: 'Konjunktiv II',
  RELATIVSATZB1: 'Relativsatz',
  KAUSALSATZ: 'Kausalsatz',
  KONDITIONALSATZ: 'Konditionalsatz',
  KONZESSIVSATZB1: 'Konzessivsatz',
  FINALSATZ: 'Finalsatz',
  ERGÄNZUNGSSATZ: 'Ergänzungssatz',
  INDIREKTEFRAGESÄTZE: 'Indirekte Frage',
  KONJUNKTIONALADVERBIEN: 'Konjunktionaladverb',
  PRÄPOSITIONENGENITIVB1: 'Genitiv-Präposition',
  PRÄPOSITIONALERGÄNZUNG: 'Präpositionalergänzung',
  PRÄPOSITIONALADVERBIEN: 'Pronominaladverb',
  POSSESSIVARTIKELB1: 'Possessivartikel',
  VERNEINUNG: 'Verneinung',
  VERBNOMENVERBINDUNGB1: 'Verb-Nomen-Verbindung',
  VERBLASSEN: 'Verben lassen',
  ADJEKTIVDEKLINATIONB1: 'Adjektivdeklination',
  AKKUSATIVB1: 'Akkusativ',
  DEMONSTRATIVARTIKEL: 'Demonstrativartikel',
  LOKALEPRÄPOSITIONENB1: 'Lokale Präposition',
  LOKALEPRÄPOSITIONENB2: 'Lokale Präposition',
  NOMENPRÄPOSITIONVERBINDUNGB1: 'Nomen-Präposition',
  PERFEKTB1: 'Perfekt',
  PRÄPOSITIONENB1: 'Präposition',
  TRENNBAREVERBENB1: 'Trennbares Verb',
  WORTSCHATZB1: 'Wortschatz',
  SPRACHBAUSTEINEB1: 'Sprachbaustein',
};

const GENDER_FROM_ART = {
  der: 'mask.', den: 'mask.', des: 'mask.', dem: 'mask.',
  ein: 'mask.', einen: 'mask.', kein: 'mask.', keinen: 'mask.',
  die: 'fem.', eine: 'fem.', keine: 'fem.', keiner: 'fem.',
  das: 'neutr.', keinem: 'neutr.',
};

const CASE_MARK = /^(mask|fem|neutr|Pl)\.?$/i;
const PERSON_MARK = /^(ich|du|er|sie|wir|ihr|Sie|man)$/i;

/** @param {string[]} correct */
function hintLeaksAnswer(inner, correct) {
  const h = inner.toLowerCase();
  for (const ans of correct) {
    const a = String(ans).toLowerCase().trim();
    if (a.length >= 2 && h.includes(a)) return true;
  }
  if (correct.some((a) => /^kein/i.test(a)) && /\bkein/i.test(h)) return true;
  if (correct.some((a) => a.toLowerCase() === 'nicht') && /\bnicht\b/i.test(h)) return true;
  if (correct.some((a) => a.toLowerCase() === 'noch nie') && /noch nie/i.test(h)) return true;
  return false;
}

/**
 * Methodological rule for input-text:
 *   The hint MUST give the learner enough info to derive the answer:
 *   verb lemma, adjective stem, noun lemma, person, gender/case, etc.
 *   We never drop lemmata; we only normalize the wrapper label.
 *
 *   For lexical/categorical answers (functional words, particles) the
 *   raw inner from the bank already encodes the needed info.
 * @param {string} inner
 */
export function transformHint(inner, topic, correct, options = [], body = '', id = '') {
  if (topic === 'NEGATION') return 'Negation';
  if (topic === 'GEGENTEILE') return inner && /\(/.test(inner) ? inner : (inner || 'Gegenteil');
  if (topic === 'W-FRAGEN') return inner;

  // Antwortpartikel — keep subtype only
  if (topic === 'ANTWORTPARTIKELN') {
    const sub = inner.replace(/^Antwortpartikel\s*—\s*/i, '').trim();
    return sub && sub !== 'Antwortpartikel' ? `Antwortpartikel — ${sub}` : 'Antwortpartikel';
  }

  // Possessiv: person (ich/du/er …) is the required cue, keep verbatim.
  if (topic === 'POSSESSIVARTIKEL' || topic === 'POSSESSIVARTIKELA2' || topic === 'POSSESSIVARTIKELB1') {
    let rest = inner.replace(/^Possessiv(?:artikel)?\s*—\s*/i, '').trim();
    if (!rest) rest = inner.replace(/^Possessiv\s*—\s*/i, '').trim();
    return rest ? `Possessivartikel — ${rest}` : 'Possessivartikel';
  }

  // Adjektivdeklination — KEEP adjective stem. Without it, input-text is unguessable.
  if (topic === 'ADJEKTIVDEKLINATIONA1' || topic === 'ADJEKTIVDEKLINATIONA2' || topic === 'ADJEKTIVDEKLINATIONB1') {
    const rest = inner.replace(/^Adj\.?\s*—\s*|^Adjektivdeklination\s*—\s*/i, '').trim();
    return `Adjektivdeklination — ${rest}`;
  }

  // Artikel — keep noun phrase (Artikel form depends on noun gender)
  if (topic === 'ARTIKEL') {
    if (inner.startsWith('Artikel')) return inner;
    return inner ? `Artikel — ${inner}` : 'Artikel';
  }

  // Akkusativ / Dativ / Genitiv — keep all info from bank (incl. noun & case)
  if (topic === 'AKKUSATIVA1' || topic === 'AKKUSATIVA2' || topic === 'AKKUSATIVB1') {
    const rest = inner.replace(/^Akkusativ\s*(?:—\s*)?/i, '').trim();
    return rest && rest.toLowerCase() !== 'akkusativ' ? `Akkusativ — ${rest}` : 'Akkusativ';
  }
  if (topic === 'DATIVA1' || topic === 'DATIVA2') {
    const rest = inner.replace(/^Dativ\s*(?:—\s*)?/i, '').trim();
    return rest && rest.toLowerCase() !== 'dativ' ? `Dativ — ${rest}` : 'Dativ';
  }
  if (topic === 'GENITIVA2' || topic === 'GENITIVB2') {
    const rest = inner.replace(/^Genitiv(?:form)?\s*(?:—\s*)?/i, '').trim();
    return rest && rest.toLowerCase() !== 'genitiv' ? `Genitiv — ${rest}` : 'Genitiv';
  }

  // Verb — Präsens + Verb (not person)
  if (topic === 'VERBKONJUGATION') {
    const hint = verbFormHint(topic, inner, correct, options, body, id);
    if (hint) return hint;
  }

  // Wechselpräpositionen — Wo?/Wohin? cue is the canonical hint.
  if (topic === 'WECHSELPRÄPOSITIONEN' || topic === 'WECHSELPRÄPOSITIONENA2') {
    const wo = inner.match(/(Wo\?|Wohin\?|Ort|Bewegung)/i);
    if (wo) return `Wechselpräpositionen — ${wo[0]}`;
    return inner || 'Wechselpräpositionen';
  }

  if (['PRÄTERITUMA2', 'PERFEKTA2', 'PERFEKTB1', 'MODALVERBENA2', 'REFLEXIVPRONOMEN', 'TRENNBAREVERBEN', 'TRENNBAREVERBENB1', 'PASSIVB1', 'PASSIVB2', 'KONJUNKTIV2', 'KONJUNKTIV2B2', 'FUTURI', 'VERBLASSEN', 'PASSIVERSATZ', 'PARTIZIP1', 'PARTIZIP2', 'INDIREKTEREDE'].includes(topic)) {
    let hint = verbFormHint(topic, inner, correct, options, body, id);
    if (topic === 'REFLEXIVPRONOMEN' && (!hint?.includes('+ Verb'))) {
      hint = verbFormHint(topic, '', correct, options, body, id);
    }
    if (hint && hint !== 'Grammatikform') return hint;
  }

  // Superlativ / Komparativ — KEEP adjective stem.
  if (topic === 'SUPERLATIVA2' || /^Superlativ\s*—/i.test(inner)) {
    const rest = inner.replace(/^Superlativ\s*—\s*/i, '').trim();
    return rest ? `Superlativ — ${rest}` : 'Superlativ';
  }
  if (topic === 'KOMPARATIVA2' || /^Komparativ\s*—/i.test(inner)) {
    const rest = inner.replace(/^Komparativ\s*—\s*/i, '').trim();
    return rest ? `Komparativ — ${rest}` : 'Komparativ';
  }

  // N-Deklination — KEEP noun lemma & case info.
  if (topic === 'N-DEKLINATION' || /^N-Deklination\s*—/i.test(inner)) {
    const rest = inner.replace(/^N-Deklination\s*—\s*/i, '').trim();
    return rest ? `N-Deklination — ${rest}` : 'N-Deklination';
  }

  // Default — keep inner as-is when it carries any info.
  if (inner && inner.trim()) return inner;
  return TOPIC_LABEL[topic] || topic;
}

function parseListBlock(fm, key) {
  const inline = fm.match(new RegExp(`^${key}:[ \\t]*(\\S.*)$`, 'm'));
  if (inline) return [inline[1].trim()];
  const list = fm.match(new RegExp(`^${key}:\\n((?:[ \\t]*- .*\\n?)*)`, 'm'));
  if (!list) return [];
  return [...list[1].matchAll(/^\s*-\s+(.+)$/gm)].map((x) => x[1].trim());
}

function parseOptions(fm) {
  return parseListBlock(fm, 'options');
}

function parseMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const body = m[2].trimEnd();
  const id = fm.match(/^id:\s*(.+)$/m)?.[1]?.trim();
  const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim();
  const correct = parseListBlock(fm, 'correct');
  const options = parseOptions(fm);
  return { fm, body, id, type, correct, options };
}

function siblingSelectOneOptions(filePath, id) {
  if (!id?.includes('-in-')) return [];
  const candidate = join(dirname(filePath), `${id.replace('-in-', '-')}.md`);
  if (!existsSync(candidate)) return [];
  const parsed = parseMd(readFileSync(candidate, 'utf8'));
  return parsed?.options || [];
}

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  let changed = 0;
  let scanned = 0;

  for (const full of walkMd(ROOT)) {
    const topic = full.split(/[/\\]/).slice(-2, -1)[0];
    const parsed = parseMd(readFileSync(full, 'utf8'));
    if (!parsed || parsed.type !== 'input-text') continue;
    scanned += 1;

    const body = parsed.body.trimEnd();
    const lines = body.split('\n');
    const hasInstruction = lines.length > 1 && !lines[0].includes('___');
    const hintLine = parsed.fm.match(/^hint:\s*(.+)$/m)?.[1]?.trim() || '';

    let sentence;
    let inner = '';
    if (hasInstruction) {
      const sentenceLine = lines.find((l) => l.includes('___')) || lines[lines.length - 1];
      sentence = sentenceLine.trim();
      const hintMatch = sentence.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
      if (hintMatch) {
        sentence = hintMatch[1].trimEnd();
        inner = hintMatch[2].trim();
      }
    } else {
      const hintMatch = body.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
      if (!hintMatch && hintLine) continue;
      if (hintMatch) {
        sentence = hintMatch[1].trimEnd();
        inner = hintMatch[2].trim();
      } else {
        sentence = body;
      }
    }

    const options = siblingSelectOneOptions(full, parsed.id);
    const newHint = inner
      ? transformHint(inner, topic, parsed.correct, options, body, parsed.id)
      : hintLine;
    const instruction = taskInstruction(topic);
    const { prompt: newBody } = buildInputTextPrompt({
      topic,
      rawPrompt: sentence,
      hint: newHint,
    });

    if (newBody === body && hintLine === newHint) continue;

    const hintFm = newHint ? `hint: ${newHint}\n` : '';
    const correctBlock = parsed.correct.map((c) => `  - ${c}`).join('\n');
    const newFile = `---\nid: ${parsed.id}\ntype: input-text\n${hintFm}correct:\n${correctBlock}\n---\n\n${newBody}\n`;
    writeFileSync(full, newFile, 'utf8');
    changed += 1;
  }

  console.log(`Scanned ${scanned} input-text files, updated ${changed}.`);
}
