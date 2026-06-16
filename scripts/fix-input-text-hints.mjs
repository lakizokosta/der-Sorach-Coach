#!/usr/bin/env node
/**
 * Removes answer-leaking parenthetical hints from input-text questions.
 * Run: node scripts/fix-input-text-hints.mjs
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVerbLemmaFromInner, verbFormHint } from './topic-context-hints.mjs';

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
  VERBPRÄPOSITIONVERBINDUNG: 'Verb + Präposition',
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

/** @param {string} inner */
export function transformHint(inner, topic, correct, options = [], body = '', id = '') {
  if (topic === 'NEGATION') return 'Negation';
  if (topic === 'GEGENTEILE') return 'Gegenteile';
  if (topic === 'PLURAL') return 'Plural';
  if (topic === 'W-FRAGEN') return inner;

  // Antwortpartikel — keep subtype only
  if (topic === 'ANTWORTPARTIKELN') {
    const sub = inner.replace(/^Antwortpartikel\s*—\s*/i, '').trim();
    return sub && sub !== 'Antwortpartikel' ? `Antwortpartikel — ${sub}` : 'Antwortpartikel';
  }

  // Possessiv: person (ich/du/er …) is required — it does not leak the ending.
  if (topic === 'POSSESSIVARTIKEL' || topic === 'POSSESSIVARTIKELA2' || topic === 'POSSESSIVARTIKELB1') {
    let rest = inner.replace(/^Possessiv(?:artikel)?\s*—\s*/i, '').trim();
    if (!rest) rest = inner.replace(/^Possessiv\s*—\s*/i, '').trim();
    const parts = rest.split(',').map((s) => s.trim());
    if (parts.length && PERSON_MARK.test(parts[0])) {
      return `Possessivartikel — ${parts.join(', ')}`;
    }
    return rest ? `Possessivartikel — ${rest}` : 'Possessivartikel';
  }

  // Adjektivdeklination — drop adjective stem
  if (topic === 'ADJEKTIVDEKLINATIONA1' || topic === 'ADJEKTIVDEKLINATIONA2') {
    let rest = inner.replace(/^Adj\.?\s*—\s*|^Adjektivdeklination\s*—\s*/i, '').trim();
    const parts = rest.split(',').map((s) => s.trim());
    if (parts.length >= 2 && !CASE_MARK.test(parts[0]) && !/^ein\b/i.test(parts[0])) {
      rest = parts.slice(1).join(', ');
    }
    return `Adjektivdeklination — ${rest}`;
  }

  // Artikel — drop noun + article word
  if (topic === 'ARTIKEL') {
    const nounPhrase = inner.match(
      /^(?:(?:der|die|das|ein|eine|einen|kein|keine|keinen|keinem|keiner)\s+[^,]+),\s*(.+)$/i,
    );
    if (nounPhrase) return `Artikel — ${nounPhrase[1]}`;
    if (inner.startsWith('Artikel')) return inner;
    return 'Artikel';
  }

  // Akkusativ / Dativ — drop noun, keep case info
  if (topic === 'AKKUSATIVA1' || topic === 'AKKUSATIVA2' || topic === 'DATIVA1' || topic === 'DATIVA2') {
    const label = topic.startsWith('AKK') ? 'Akkusativ' : 'Dativ';
    let rest = inner.replace(/^(?:Akkusativ|Dativ|Possessiv)\s*—\s*/i, '').trim();
    const noun = rest.match(/^(?:(?:der|die|das|den|dem|des|ein|eine|einen|kein|keine|keinen)\s+[^,]+),\s*(.+)$/i);
    if (noun) rest = noun[1];
    const parts = rest.split(',').map((s) => s.trim());
    if (parts.length >= 2 && !CASE_MARK.test(parts[0]) && !PERSON_MARK.test(parts[0])) {
      const art = parts[0].toLowerCase();
      if (GENDER_FROM_ART[art]) rest = `${GENDER_FROM_ART[art]}, ${parts.slice(1).join(', ')}`;
    }
    if (parts.length && PERSON_MARK.test(parts[0])) {
      rest = parts.slice(1).join(', ');
    }
    return `${label} — ${rest}`;
  }

  // Verb — Präsens + Verb (not person)
  if (topic === 'VERBKONJUGATION') {
    const hint = verbFormHint(topic, inner, correct, options, body, id);
    if (hint) return hint;
  }

  // Wechselpräpositionen — drop example preposition
  if (topic === 'WECHSELPRÄPOSITIONEN' || topic === 'WECHSELPRÄPOSITIONENA2') {
    const wo = inner.match(/(Wo\?|Wohin\?|Ort|Bewegung)/i);
    if (wo) return `Wechselpräpositionen — ${wo[0]}`;
    return 'Wechselpräpositionen';
  }

  if (['PRÄTERITUMA2', 'PERFEKTA2', 'PERFEKTB1', 'MODALVERBENA2', 'REFLEXIVPRONOMEN', 'TRENNBAREVERBEN', 'TRENNBAREVERBENB1', 'PASSIVB1', 'PASSIVB2', 'KONJUNKTIV2', 'KONJUNKTIV2B2', 'FUTURI', 'VERBLASSEN'].includes(topic)) {
    let hint = verbFormHint(topic, inner, correct, options, body, id);
    if (topic === 'REFLEXIVPRONOMEN' && (!hint?.includes('+ Verb'))) {
      hint = verbFormHint(topic, '', correct, options, body, id);
    }
    if (hint) return hint;
  }

  // Superlativ — drop adjective stem
  if (topic === 'SUPERLATIVA2' || /^Superlativ\s*—/i.test(inner)) {
    let rest = inner.replace(/^Superlativ\s*—\s*/i, '').trim();
    const parts = rest.split(',').map((s) => s.trim());
    if (parts.length >= 2 && !CASE_MARK.test(parts[0]) && !/^am\b/i.test(parts[0])) {
      rest = parts.slice(1).join(', ');
    }
    return `Superlativ — ${rest}`;
  }

  // N-Deklination — drop noun lemma
  if (topic === 'N-DEKLINATION' || /^N-Deklination\s*—/i.test(inner)) {
    let rest = inner.replace(/^N-Deklination\s*—\s*/i, '').trim();
    const parts = rest.split(',').map((s) => s.trim());
    if (parts.length === 2 && !/^(Dativ|Genitiv|Akk|Nom)/i.test(parts[0])) {
      return `N-Deklination — ${parts[1]}`;
    }
    return inner.startsWith('N-Deklination') ? inner : `N-Deklination — ${rest}`;
  }

  // Konjunktion, Genitiv, etc. — keep if no leak
  if (!hintLeaksAnswer(inner, correct)) return inner;

  return TOPIC_LABEL[topic] || inner.split(' — ')[0] || topic;
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

    const lines = parsed.body.split('\n');
    const lastIdx = lines.length - 1;
    const line = lines[lastIdx];
    const hintMatch = line.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
    if (!hintMatch) continue;

    const sentence = hintMatch[1].trimEnd();
    const oldInner = hintMatch[2];
    const options = siblingSelectOneOptions(full, parsed.id);
    const newInner = transformHint(oldInner, topic, parsed.correct, options, parsed.body, parsed.id);

    if (newInner === oldInner && !hintLeaksAnswer(oldInner, parsed.correct)) continue;

    lines[lastIdx] = `${sentence} (${newInner})`;
    const newBody = `${lines.join('\n')}\n`;
    writeFileSync(full, `---\n${parsed.fm}\n---\n\n${newBody}`, 'utf8');
    changed += 1;
  }

  console.log(`Scanned ${scanned} input-text files, updated ${changed}.`);
}
