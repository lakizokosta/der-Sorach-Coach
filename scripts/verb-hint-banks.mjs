/**
 * Unified question banks for verb-hint lookup (A1, A2, B1, B2).
 */

import { BANK as A2_BANK } from './a2-input-text-data.mjs';
import { BANK as A1_BANK } from './generate-a1-input-text.mjs';
import { BANK as B2_BANK } from './b2-input-text-data.mjs';
import {
  genKonjunktiv2,
  genPassivB1,
  genPerfektB1,
  genTrennbareVerbenB1,
  genVerblassen,
} from './b1-select-one-data.mjs';

const SEPARABLE_PARTICLES = [
  'ab', 'an', 'auf', 'aus', 'bei', 'ein', 'mit', 'nach', 'vor', 'zu', 'zurück', 'weg', 'weiter', 'her', 'hin', 'durch',
];

/** @type {Record<string, [string, string|string[], string[]?][]>} */
const B1_BANK = {
  KONJUNKTIV2: genKonjunktiv2().map((q) => [q.prompt, q.correct]),
  PASSIVB1: genPassivB1().map((q) => [q.prompt, q.correct]),
  PERFEKTB1: genPerfektB1().map((q) => [q.prompt, q.correct]),
  TRENNBAREVERBENB1: genTrennbareVerbenB1().map((q) => [q.prompt, q.correct, q.options]),
  VERBLASSEN: genVerblassen().map((q) => [q.prompt, q.correct]),
};

/** @type {Record<string, [string, string|string[]][]>} */
export const ALL_VERB_BANKS = {
  ...A1_BANK,
  ...A2_BANK,
  ...B2_BANK,
  ...B1_BANK,
};

/** @param {string} prompt */
export function normalizeBankPrompt(prompt) {
  return String(prompt)
    .replace(/^\[[^\]]+]\s+/, '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {string} body */
export function normalizeQuestionBody(body) {
  const line = body.split('\n').pop() || '';
  return line.replace(/\s*\([^)]*\)\s*$/, '').replace(/\s+/g, ' ').trim();
}

/**
 * Extract verb lemma from bank prompt parenthetical.
 * Handles (spielen, ich), (Präteritum — ziehen/sie), (werden), (sein).
 * @param {string} prompt
 * @return {string}
 */
export function lemmaFromBankPrompt(prompt) {
  const text = String(prompt);

  const trailing = text.match(/\(([^)]*)\)\s*$/);
  if (trailing) {
    const lemma = parseBankInner(trailing[1]);
    if (lemma) return lemma;
  }

  const afterGap = text.match(/___\s*\(([^)]+)\)/);
  if (afterGap) {
    const lemma = parseBankInner(afterGap[1]);
    if (lemma) return lemma;
  }

  for (const m of text.matchAll(/\(([^)]+)\)/g)) {
    const lemma = parseBankInner(m[1]);
    if (lemma) return lemma;
  }

  return '';
}

const PERSON_MARK = /^(ich|du|er|sie|wir|ihr|Sie|man|es)$/i;
const IRREGULAR_INF = new Set(['sein', 'haben', 'werden', 'tun', 'wissen', 'können', 'müssen', 'sollen', 'dürfen', 'wollen', 'mögen', 'möchten']);

/** @param {string} inner */
function parseBankInner(inner) {
  if (!inner) return '';

  const dash = inner.match(/—\s*([^/—,]+?)(?:\/[^/—,)]+)?\s*$/);
  if (dash) {
    const verb = dash[1].trim();
    if (isLemmaWord(verb)) return verb;
  }

  const parts = inner.split(',').map((s) => s.trim());
  if (parts.length >= 2 && !PERSON_MARK.test(parts[0])) {
    return parts[0];
  }

  const single = inner.trim();
  if (/^[\wäöüÄÖÜß-]+$/.test(single) && isLemmaWord(single)) {
    return single;
  }

  return '';
}

/** @param {string} word */
function isLemmaWord(word) {
  const w = word.toLowerCase().trim();
  if (!w || PERSON_MARK.test(w)) return false;
  if (IRREGULAR_INF.has(w)) return true;
  return /(?:en|eln|ern)$/i.test(w);
}

/**
 * @param {string} id
 * @param {string} topicKey
 * @return {[string, string|string[]] | null}
 */
export function getBankItemById(id, topicKey) {
  const bank = ALL_VERB_BANKS[topicKey];
  if (!bank) return null;
  const m = id.match(/-(\d+)$/);
  if (!m) return null;
  const idx = parseInt(m[1], 10) - 1;
  return bank[idx] || null;
}

/** @param {string[]} options */
function separableInfinitiveFromOptions(options) {
  for (const raw of options || []) {
    const o = String(raw).toLowerCase().replace(/\s+/g, '');
    for (const particle of SEPARABLE_PARTICLES) {
      if (!o.startsWith(particle) || o.length <= particle.length + 2) continue;
      const rest = o.slice(particle.length);
      if (/^[a-zäöüß]+(?:en|eln|ern)$/.test(rest)) return `${particle}${rest}`;
      if (/^[a-zäöüß]+(?:st|t)$/.test(rest)) {
        return `${particle}${rest.replace(/(?:st|t)$/, 'en')}`;
      }
    }
  }
  return '';
}

/** @param {string} prompt @param {string[]} [options] @param {string|string[]} [correct] */
function lemmaFromTrennbarBankItem(prompt, options = [], correct = '') {
  const fromOpts = separableInfinitiveFromOptions(options);
  if (fromOpts) return fromOpts;

  const answer = String((Array.isArray(correct) ? correct[0] : correct) || '').toLowerCase();
  if (/(?:en|eln|ern)$/i.test(answer) && !PERSON_MARK.test(answer)) return answer;

  const line = normalizeBankPrompt(prompt);
  if (/\bmich\s+über\b/i.test(line) || /\buns\s+schon\s+auf\b/i.test(line) || /\bsich\s+.*\s+auf\b/i.test(line)) {
    return 'sich freuen';
  }

  for (const particle of SEPARABLE_PARTICLES) {
    const re = new RegExp(`\\s${particle}\\s*\\.?$`, 'i');
    if (re.test(line)) {
      const stems = {
        auf: 'aufstehen', an: 'anmelden', aus: 'ausmachen', ein: 'einchecken', ab: 'absagen',
        mit: 'mitkommen', nach: 'nachmachen', vor: 'vorbereiten', zu: 'zumachen', zurück: 'zurückkommen',
        weg: 'weggehen', weiter: 'weitermachen', her: 'herkommen', hin: 'hingehen', durch: 'durchgehen',
      };
      return stems[particle.toLowerCase()] || '';
    }
  }

  return '';
}

/** @param {string} prompt */
function lemmaFromVerblassenBankItem(prompt) {
  const line = normalizeBankPrompt(prompt);
  const m = line.match(/\b([\wäöüÄÖÜß]+en)\s*\.?\s*$/);
  return m ? m[1] : 'lassen';
}

/** @param {[string, string|string[], string[]?]} item @param {string} topicKey */
function lemmaFromBankItem(item, topicKey) {
  const lemma = lemmaFromBankPrompt(item[0]);
  if (lemma) return lemma;

  if (topicKey === 'TRENNBAREVERBENB1') {
    return lemmaFromTrennbarBankItem(item[0], item[2], item[1]);
  }
  if (topicKey === 'VERBLASSEN') {
    return lemmaFromVerblassenBankItem(item[0]);
  }
  if (topicKey === 'PASSIVB1') {
    const line = normalizeBankPrompt(item[0]);
    const m = line.match(/\b(\w+(?:iert|ert|t|en))\s*\.?\s*$/);
    if (!m) return 'werden';
    const pp = m[1];
    if (pp.endsWith('iert')) return `${pp.slice(0, -3)}ieren`;
    if (pp.endsWith('ert')) return `${pp.slice(0, -2)}en`;
    if (pp.endsWith('t')) return `${pp.slice(0, -1)}en`;
  }

  return '';
}

/**
 * Match question sentence to bank entry (robust when file index ≠ bank index).
 * @param {string} body
 * @param {string} topicKey
 * @return {string}
 */
export function bankLemmaFromBody(body, topicKey) {
  const bank = ALL_VERB_BANKS[topicKey];
  if (!bank) return '';

  const normalized = normalizeQuestionBody(body);
  if (!normalized) return '';

  for (const item of bank) {
    const bankNorm = normalizeBankPrompt(item[0]);
    if (bankNorm === normalized) {
      const lemma = lemmaFromBankItem(item, topicKey);
      if (lemma) return lemma;
    }
  }

  for (const item of bank) {
    const bankNorm = normalizeBankPrompt(item[0]);
    if (bankNorm.includes(normalized) || normalized.includes(bankNorm)) {
      const lemma = lemmaFromBankItem(item, topicKey);
      if (lemma) return lemma;
    }
  }

  return '';
}

/**
 * @param {string} id
 * @param {string} topicKey
 * @return {string}
 */
export function bankLemmaFromId(id, topicKey) {
  const item = getBankItemById(id, topicKey);
  if (!item) return '';
  return lemmaFromBankItem(item, topicKey);
}
