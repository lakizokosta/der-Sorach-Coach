/**
 * Grammatical context hints for fill-in questions (shown in parentheses).
 * Example: "Sie ___ nach Berlin. (Präteritumsform — ziehen)"
 */

import { BANK as A2_INPUT_BANK } from './a2-input-text-data.mjs';

/** @type {Record<string, string>} */
export const TOPIC_FORM_HINT = {
  VERBKONJUGATION: 'Präsensform',
  PRÄTERITUMA2: 'Präteritumsform',
  PERFEKTA2: 'Perfektform',
  PERFEKTB1: 'Perfektform',
  MODALVERBENA2: 'Modalverbform',
  REFLEXIVPRONOMEN: 'Reflexivform',
  TRENNBAREVERBEN: 'Trennbares Verb',
  TRENNBAREVERBENB1: 'Trennbares Verb',
  PASSIVB1: 'Passivform',
  PASSIVB2: 'Passivform',
  PASSIVERSATZ: 'Passiversatz',
  KONJUNKTIV2: 'Konjunktiv-II-Form',
  KONJUNKTIV2B2: 'Konjunktiv-II-Form',
  PARTIZIP1: 'Partizip-I-Form',
  PARTIZIP2: 'Partizip-II-Form',
  FUTURI: 'Futurform',
  VERBLASSEN: 'lassen-Form',
  ARTIKEL: 'Artikelform',
  AKKUSATIVA1: 'Akkusativform',
  AKKUSATIVA2: 'Akkusativform',
  AKKUSATIVB1: 'Akkusativform',
  'AKKUSATIV&DATIVOBJEKT': 'Akkusativ oder Dativ',
  DATIVA1: 'Dativform',
  DATIVA2: 'Dativform',
  GENITIVA2: 'Genitivform',
  GENITIVB2: 'Genitivform',
  POSSESSIVARTIKEL: 'Possessivartikelform',
  POSSESSIVARTIKELA2: 'Possessivartikelform',
  POSSESSIVARTIKELB1: 'Possessivartikelform',
  PLURAL: 'Pluralform',
  ADJEKTIVDEKLINATIONA1: 'Adjektivendung',
  ADJEKTIVDEKLINATIONA2: 'Adjektivendung',
  ADJEKTIVDEKLINATIONB1: 'Adjektivendung',
  KOMPARATIVA2: 'Komparativform',
  SUPERLATIVA2: 'Superlativform',
  NEGATION: 'Negation',
  VERNEINUNG: 'Verneinung',
  WECHSELPRÄPOSITIONEN: 'Dativ oder Akkusativ',
  WECHSELPRÄPOSITIONENA2: 'Dativ oder Akkusativ',
  LOKALPRÄPOSITIONENA2: 'Lokale Präposition',
  LOKALEPRÄPOSITIONENB1: 'Lokale Präposition',
  FESTEPRÄPOSITIONENA2: 'Feste Präposition',
  PRÄPOSITIONENB1: 'Präposition',
  PRÄPOSITIONENGENITIV: 'Genitiv-Präposition',
  PRÄPOSITIONENGENITIVB1: 'Genitiv-Präposition',
  PRÄPOSITIONALADVERBIEN: 'Pronominaladverb',
  PRÄPOSITIONALADVERBIENB2: 'Pronominaladverb',
  PRÄPOSITIONALERGÄNZUNG: 'Präpositionalergänzung',
  KONJUNKTIONENA2: 'Konjunktion',
  KONJUNKTIONALADVERBIEN: 'Konjunktionaladverb',
  KONDITIONALSATZ: 'Konditionalsatz',
  KAUSALSATZ: 'Kausalsatz',
  FINALSATZ: 'Finalsatz',
  TEMPORALSATZ: 'Temporalsatz',
  TEMPORALERNEBENSATZ: 'Temporalnebensatz',
  MODALSATZ: 'Modalsatz',
  KONZESSIVSATZB1: 'Konzessivsatz',
  KONZESSIVSATZB2: 'Konzessivsatz',
  KONSEKUTIVEKONJUNKTION: 'Konsekutivsatz',
  ERGÄNZUNGSSATZ: 'Ergänzungssatz',
  INDIREKTEFRAGESÄTZE: 'Indirekte Frage',
  INDIREKTEREDE: 'Indirekte Rede',
  RELATIVSATZB1: 'Relativpronomen',
  RELATIVSATZB2: 'Relativpronomen',
  'N-DEKLINATION': 'N-Deklination',
  INDEFINITPRONOMEN: 'Indefinitpronomen',
  DEMONSTRATIVARTIKEL: 'Demonstrativartikel',
  NOMENPRÄPOSITIONVERBINDUNGA2: 'Nomen mit Präposition',
  NOMENPRÄPOSITIONVERBINDUNGB1: 'Nomen mit Präposition',
  VERBPRÄPOSITIONVERBINDUNG: 'Verb mit Präposition',
  VERBNOMENVERBINDUNGB1: 'Verb-Nomen-Verbindung',
  SATZSTELLUNGA2: 'Satzstellung',
  TEKAMOLO: 'TeKaMoLo-Reihenfolge',
  ANTWORTPARTIKELN: 'Antwortpartikel',
  'W-FRAGEN': 'Fragewort',
  GEGENTEILE: 'Gegenteil',
  REDEWENDUNGEN: 'Redewendung',
  WORTSCHATZB1: 'Wortschatz',
};

const VERB_FORM_TOPICS = new Set([
  'PRÄTERITUMA2',
  'PERFEKTA2',
  'PERFEKTB1',
  'MODALVERBENA2',
  'VERBKONJUGATION',
  'REFLEXIVPRONOMEN',
  'TRENNBAREVERBEN',
  'TRENNBAREVERBENB1',
  'PASSIVB1',
  'PASSIVB2',
  'KONJUNKTIV2',
  'KONJUNKTIV2B2',
  'FUTURI',
]);

const POSSESSIV_TOPICS = new Set([
  'POSSESSIVARTIKEL',
  'POSSESSIVARTIKELA2',
  'POSSESSIVARTIKELB1',
]);

const PERSON_MARK = /^(ich|du|er|sie|wir|ihr|Sie|man|es)$/i;
const PARTICIPLE = /^ge\w+/i;
const IRREGULAR_INF = new Set(['sein', 'haben', 'werden', 'tun']);
const SEIN_FORMS = new Set(['bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren', 'wart', 'sei', 'seien']);
const HABEN_FORMS = new Set(['habe', 'hast', 'hat', 'haben', 'habt', 'hatte', 'hattest', 'hatten', 'hattet']);
/** Finite verb forms that end in -en but are not infinitives. */
const MODAL_FROM_FINITE = {
  darf: 'dürfen', darfst: 'dürfen', dürfen: 'dürfen', dürfte: 'dürfen', dürftest: 'dürfen',
  kann: 'können', kannst: 'können', können: 'können', könnte: 'können', könntest: 'können',
  muss: 'müssen', musst: 'müssen', müssen: 'müssen', müsste: 'müssen', müsstest: 'müssen',
  soll: 'sollen', sollst: 'sollen', sollen: 'sollen', sollte: 'sollen', solltest: 'sollen',
  will: 'wollen', willst: 'wollen', wollen: 'wollen', wollte: 'wollen', wolltest: 'wollen',
  mag: 'mögen', mögen: 'mögen', möglich: 'mögen',
  möchte: 'möchten', möchtest: 'möchten', möchten: 'möchten',
  hätte: 'möchten', hättest: 'möchten', hätten: 'möchten',
};

const SEPARABLE_PARTICLES = [
  'ab', 'an', 'auf', 'aus', 'bei', 'ein', 'mit', 'nach', 'vor', 'zu', 'zurück', 'weg', 'weiter', 'her', 'hin',
];

const FINITE_EN_FORMS = new Set([
  'waren', 'hatten', 'konnten', 'sollten', 'mussten', 'durften', 'wollten', 'standen',
  'fanden', 'brachten', 'dachten', 'kannten', 'mochten', 'wussten', 'wollten', 'gingen',
  'kamen', 'nahmen', 'gaben', 'hielten', 'ließen', 'sangen', 'fuhren', 'liefen',
]);

/** @param {string} word */
function isLikelyLemma(word) {
  const w = word.toLowerCase().trim();
  if (!w || PERSON_MARK.test(w) || /form$/i.test(w)) return false;
  if (IRREGULAR_INF.has(w)) return true;
  if (FINITE_EN_FORMS.has(w) || SEIN_FORMS.has(w) || HABEN_FORMS.has(w)) return false;
  return /(?:en|eln|ern)$/i.test(w);
}

/**
 * Extract verb lemma from bank hint, e.g. "Präteritum — ziehen/sie" → "ziehen".
 * @param {string} inner
 * @return {string}
 */
export function parseVerbLemmaFromInner(inner) {
  if (!inner) return '';

  const formOnly = inner.match(/^[\wäöüÄÖÜß-]+form\s*—\s*([\wäöüÄÖÜß-]+(?:\s+[\wäöüÄÖÜß-]+)?)\s*$/i);
  if (formOnly && isLikelyLemma(formOnly[1])) return formOnly[1].trim();

  const dash = inner.match(/—\s*([^/—,]+?)(?:\/[^/—,)]+)?\s*$/);
  if (dash) {
    const verb = dash[1].trim();
    if (isLikelyLemma(verb) && !/^(Präteritum|Perfekt|Modalverb|Reflexiv|Präsens)/i.test(verb)) {
      return verb;
    }
  }

  const parts = inner.split(',').map((s) => s.trim());
  if (parts.length >= 2 && !PERSON_MARK.test(parts[0]) && !/^verbkonjugation/i.test(parts[0])) {
    return parts[0];
  }

  return '';
}

/**
 * @param {string[]} options
 * @param {string|string[]} correct
 * @return {string}
 */
export function extractInfinitiveFromOptions(options, correct) {
  const answers = (Array.isArray(correct) ? correct : [correct]).map((c) => String(c).toLowerCase());
  const opts = (options || []).filter((o) => !answers.includes(String(o).toLowerCase()));

  for (const o of opts) {
    if (IRREGULAR_INF.has(o.toLowerCase())) return o.toLowerCase();
  }

  const infinitives = opts.filter((o) => isLikelyLemma(o));

  if (infinitives.length === 1) return infinitives[0].toLowerCase();
  if (infinitives.length > 1) {
    return infinitives.sort((a, b) => b.length - a.length)[0].toLowerCase();
  }
  return '';
}

/**
 * @param {string|string[]} correct
 * @return {string}
 */
function inferModalLemma(correct) {
  const c = String((Array.isArray(correct) ? correct[0] : correct) || '').toLowerCase();
  return MODAL_FROM_FINITE[c] || '';
}

/**
 * @param {string} body
 * @return {string}
 */
function inferSeparableLemma(body) {
  const line = body.split('\n').pop().replace(/\([^)]*\)\s*$/, '').trim();
  for (const particle of SEPARABLE_PARTICLES) {
    const re = new RegExp(`\\s${particle}[.?!]?$`, 'i');
    if (re.test(line)) {
      const stems = {
        auf: 'aufstehen', an: 'ankommen', aus: 'ausgehen', ein: 'einkaufen', ab: 'abfahren',
        mit: 'mitkommen', nach: 'nachmachen', vor: 'vorbereiten', zu: 'zumachen', zurück: 'zurückkommen',
        weg: 'weggehen', weiter: 'weitermachen', her: 'herkommen', hin: 'hingehen',
      };
      return stems[particle.toLowerCase()] || `${particle}…`;
    }
  }
  return '';
}

/**
 * @param {string} inner
 * @param {string|string[]} correct
 * @return {string}
 */
/**
 * @param {string} id
 * @param {string} topicKey
 * @return {string}
 */
function bankInnerForInputId(id, topicKey) {
  const m = id.match(/-in-(\d+)$/);
  if (!m) return '';
  const idx = parseInt(m[1], 10) - 1;
  const bank = A2_INPUT_BANK[topicKey];
  const item = bank?.[idx];
  if (!item) return '';
  const hint = String(item[0]).match(/\(([^)]*)\)\s*$/);
  return hint ? hint[1] : '';
}

/**
 * @param {string|string[]} correct
 * @return {string}
 */
function inferLemmaFromFinite(correct) {
  const c = String((Array.isArray(correct) ? correct[0] : correct) || '').toLowerCase();
  if (SEIN_FORMS.has(c)) return 'sein';
  if (HABEN_FORMS.has(c)) return 'haben';
  return inferModalLemma(correct);
}

function inferPerfektLemma(inner, correct) {
  const fromInner = parseVerbLemmaFromInner(inner);
  if (fromInner && IRREGULAR_INF.has(fromInner.toLowerCase())) return fromInner.toLowerCase();

  const c = String((Array.isArray(correct) ? correct[0] : correct) || '').toLowerCase();
  if (SEIN_FORMS.has(c)) return 'sein';
  if (HABEN_FORMS.has(c)) return 'haben';
  return fromInner;
}

/**
 * @param {string} topic
 * @param {string} [inner]
 * @param {string|string[]} [correct]
 * @param {string[]} [options]
 * @return {string}
 */
export function verbFormHint(topic, inner = '', correct = [], options = [], body = '', id = '') {
  const form = TOPIC_FORM_HINT[topic];
  if (!form) return '';

  let lemma = '';
  if (topic === 'PERFEKTA2' || topic === 'PERFEKTB1') {
    lemma = inferPerfektLemma(inner, correct);
  } else if (topic === 'MODALVERBENA2') {
    lemma = parseVerbLemmaFromInner(inner) || inferModalLemma(correct) || extractInfinitiveFromOptions(options, correct);
  } else if (topic === 'TRENNBAREVERBEN' || topic === 'TRENNBAREVERBENB1') {
    lemma = parseVerbLemmaFromInner(inner) || extractInfinitiveFromOptions(options, correct) || inferSeparableLemma(body);
  } else {
    lemma = parseVerbLemmaFromInner(inner);
    if (!lemma || !isLikelyLemma(lemma)) lemma = extractInfinitiveFromOptions(options, correct);
  }

  if (!lemma) lemma = parseVerbLemmaFromInner(bankInnerForInputId(id, topic));
  if (!lemma) lemma = inferLemmaFromFinite(correct);
  if (!lemma && topic === 'VERBKONJUGATION') lemma = inferSeparableLemma(body);
  if (!lemma && (topic === 'TRENNBAREVERBEN' || topic === 'TRENNBAREVERBENB1')) lemma = inferSeparableLemma(body);

  if (lemma && !isLikelyLemma(lemma) && topic !== 'MODALVERBENA2') lemma = '';
  if (!lemma && topic === 'MODALVERBENA2') lemma = inferModalLemma(correct);

  return lemma ? `${form} — ${lemma}` : form;
}

/**
 * @param {string} topic
 * @param {string} [inner]
 * @param {string[]} [correct]
 * @param {string[]} [options]
 * @return {string}
 */
export function contextHintForTopic(topic, inner = '', correct = [], options = [], body = '', id = '') {
  if (VERB_FORM_TOPICS.has(topic)) {
    return verbFormHint(topic, inner, correct, options, body, id);
  }

  if (POSSESSIV_TOPICS.has(topic) && inner) {
    const rest = inner.replace(/^Possessiv(?:artikel)?\s*—\s*/i, '').trim();
    if (rest && !/^Possessivartikel$/i.test(rest)) {
      return rest.startsWith('Possessiv') ? rest : `Possessivartikel — ${rest}`;
    }
    return 'Possessivartikelform';
  }

  if (topic === 'WECHSELPRÄPOSITIONEN' || topic === 'WECHSELPRÄPOSITIONENA2') {
    const wo = inner.match(/(Wo\?|Wohin\?)/i);
    if (wo) return `Dativ oder Akkusativ — ${wo[0]}`;
    return 'Dativ oder Akkusativ';
  }

  if (inner && !leaksAnswer(inner, correct)) {
    const cleaned = inner.replace(/^[^—]+—\s*/, '').trim();
    if (cleaned && cleaned.length < 60) return inner;
  }

  return TOPIC_FORM_HINT[topic] || inner.split(' — ')[0] || 'Grammatikform';
}

/** @param {string} inner @param {string[]} correct */
function leaksAnswer(inner, correct) {
  const h = inner.toLowerCase();
  for (const ans of correct) {
    const a = String(ans).toLowerCase().trim();
    if (a.length >= 2 && h.includes(a)) return true;
  }
  return false;
}

/**
 * @param {string} body
 * @param {string} hint
 * @return {string}
 */
export function applyHintToBody(body, hint) {
  const lines = body.trimEnd().split('\n');
  const lastIdx = lines.length - 1;
  const line = lines[lastIdx];
  const stripped = line.replace(/\s*\([^)]*\)\s*$/, '').trimEnd();
  lines[lastIdx] = `${stripped} (${hint})`;
  return `${lines.join('\n')}\n`;
}

/** @param {string} prompt @param {string} [hint] */
export function bodyWithHint(prompt, hint) {
  const text = String(prompt).trim();
  if (!hint || /\([^)]+\)\s*$/.test(text)) return prompt;
  return `${text} (${hint})`;
}
