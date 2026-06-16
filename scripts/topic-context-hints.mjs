/**
 * Grammatical context hints for fill-in questions (shown in parentheses).
 * Example: "Sie ___ nach Berlin. (Präteritum + Verb ziehen)"
 */

import {
  bankLemmaFromBody,
  bankLemmaFromId,
  finiteToInfinitive,
  infinitiveFromReflexivSentence,
  lemmaFromReflexivBankItem,
  normalizeQuestionBody,
} from './verb-hint-banks.mjs';

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

/** Short labels for verb-hint display (no person — subject is already in the sentence). */
const VERB_HINT_LABEL = {
  PRÄTERITUMA2: 'Präteritum',
  PERFEKTA2: 'Perfekt',
  PERFEKTB1: 'Perfekt',
  MODALVERBENA2: 'Modalverb',
  VERBKONJUGATION: 'Präsens',
  REFLEXIVPRONOMEN: 'Reflexiv',
  TRENNBAREVERBEN: 'Trennbares Verb',
  TRENNBAREVERBENB1: 'Trennbares Verb',
  PASSIVB1: 'Passiv',
  PASSIVB2: 'Passiv',
  KONJUNKTIV2: 'Konjunktiv II',
  KONJUNKTIV2B2: 'Konjunktiv II',
  FUTURI: 'Futur',
  VERBLASSEN: 'lassen',
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
  'VERBLASSEN',
]);

export const POSSESSIV_TOPICS = new Set([
  'POSSESSIVARTIKEL',
  'POSSESSIVARTIKELA2',
  'POSSESSIVARTIKELB1',
]);

const POSSESSIV_WHO = {
  mein: 'ich', meine: 'ich', meinen: 'ich', meinem: 'ich', meiner: 'ich',
  dein: 'du', deine: 'du', deinen: 'du', deinem: 'du', deiner: 'du',
  sein: 'er', seine: 'er', seinen: 'er', seinem: 'er', seiner: 'er',
  ihr: 'sie', ihre: 'sie', ihren: 'sie', ihrem: 'sie', ihrer: 'sie',
  Ihr: 'sie', Ihre: 'sie', Ihren: 'sie',
  unser: 'wir', unsere: 'wir', unseren: 'wir', unserem: 'wir', unserer: 'wir',
  Unser: 'wir', Unsere: 'wir',
  euer: 'ihr', eure: 'ihr', euren: 'ihr', eurem: 'ihr', eurer: 'ihr',
  Euer: 'ihr', Eure: 'ihr',
  meines: 'ich', meiner: 'ich', deines: 'du', deiner: 'du',
  seines: 'er', seiner: 'er', ihres: 'sie', ihrer: 'sie',
  unseres: 'wir', unserer: 'wir', eures: 'ihr', eurer: 'ihr',
};

/** @param {string} form */
export function possessivWhoFromForm(form) {
  const f = String(form).trim();
  return POSSESSIV_WHO[f] || POSSESSIV_WHO[f.toLowerCase()] || '';
}

/** @param {string} inner @param {string[]} correct */
export function possessivHintMatchesAnswer(inner, correct) {
  const whoHint = inner.match(/(?:Possessivartikel\s*—\s*)?(ich|du|er|sie|wir|ihr)\b/i)?.[1]?.toLowerCase();
  if (!whoHint) return true;
  const ans = correct[0] || '';
  const whoAns = possessivWhoFromForm(ans);
  return !whoAns || whoHint === whoAns;
}

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
  hätte: 'haben', hättest: 'haben', hätten: 'haben', hättet: 'haben',
  würde: 'werden', würdest: 'werden', würden: 'werden', würdet: 'werden',
  wäre: 'sein', wärst: 'sein', wären: 'sein', wäret: 'sein',
  wüsste: 'wissen', wüsstest: 'wissen', wüssten: 'wissen', wüsstet: 'wissen',
  könnte: 'können', könntest: 'können', könnten: 'können', könntet: 'können',
  sollte: 'sollen', solltest: 'sollen', sollten: 'sollen', solltet: 'sollen',
  müsste: 'müssen', müsstest: 'müssen', müssten: 'müssen', müsstet: 'müssen',
  dürfte: 'dürfen', dürftest: 'dürfen', dürften: 'dürfen', dürftet: 'dürfen',
  wollte: 'wollen', wolltest: 'wollen', wollten: 'wollen', wolltet: 'wollen',
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

  const slash = inner.match(/([\wäöüÄÖÜß-]+)\s*\/\s*(?:ich|du|er|sie|wir|ihr|Sie|man|es)\b/i);
  if (slash && isLikelyLemma(slash[1]) && !PERSON_MARK.test(slash[1])) {
    return slash[1].trim();
  }

  const dash = inner.match(/—\s*([^/—,]+?)(?:\/[^/—,)]+)?\s*$/);
  if (dash) {
    const verb = dash[1].trim();
    if (isLikelyLemma(verb) && !/^(Präteritum|Perfekt|Modalverb|Reflexiv|Präsens|Reflexivpronomen)/i.test(verb)) {
      return verb;
    }
  }

  const parts = inner.split(',').map((s) => s.trim());
  if (parts.length >= 2 && !PERSON_MARK.test(parts[0]) && !/^verbkonjugation/i.test(parts[0])) {
    return parts[0];
  }

  const single = inner.trim();
  if (/^[\wäöüÄÖÜß-]+$/.test(single) && isLikelyLemma(single)) {
    return single;
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

function inferSeparableLemma(body) {
  const line = body.split('\n').pop().replace(/\([^)]*\)\s*$/, '').trim();
  if (/\bmich\s+über\b/i.test(line) || /\buns\s+schon\s+auf\b/i.test(line)) {
    return 'sich freuen';
  }
  for (const particle of SEPARABLE_PARTICLES) {
    const re = new RegExp(`\\s${particle}[.?!]?$`, 'i');
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

/** @param {string} body */
function inferVerblassenLemma(body) {
  const line = body.replace(/\([^)]*\)\s*$/, '').trim();
  const m = line.match(/\b([\wäöüÄÖÜß]+en)\s*\.?\s*$/);
  if (m) return m[1];
  return 'lassen';
}

/** @param {string} body */
function inferPassivLemma(body) {
  const line = body.replace(/\([^)]*\)\s*$/, '').trim();
  const m = line.match(/\b(\w+(?:iert|ert|t|en))\s*\.?\s*$/);
  if (!m) return 'werden';
  const pp = m[1];
  if (pp.endsWith('iert')) return `${pp.slice(0, -3)}ieren`;
  if (pp.endsWith('ert')) return `${pp.slice(0, -2)}en`;
  if (pp.endsWith('t')) return `${pp.slice(0, -1)}en`;
  return 'werden';
}

/** @param {string} topic @param {string} lemma */
function formatVerbHint(topic, lemma) {
  const label = VERB_HINT_LABEL[topic];
  if (!label || !lemma) return TOPIC_FORM_HINT[topic] || '';
  if (topic === 'VERBLASSEN') {
    return `lassen + Verb ${lemma}`;
  }
  if ((topic === 'PERFEKTA2' || topic === 'PERFEKTB1') && IRREGULAR_INF.has(lemma.toLowerCase())) {
    return `${label} + Hilfsverb ${lemma}`;
  }
  if ((topic === 'PASSIVB1' || topic === 'PASSIVB2') && lemma.toLowerCase() !== 'werden') {
    return `${label} + Verb ${lemma}`;
  }
  if (topic === 'PASSIVB1' || topic === 'PASSIVB2') {
    return `${label} + Hilfsverb werden`;
  }
  if (topic === 'REFLEXIVPRONOMEN' && lemma.toLowerCase().startsWith('sich ')) {
    return `${label} + Verb ${lemma.replace(/^sich\s+/i, '')}`;
  }
  return `${label} + Verb ${lemma}`;
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

const REFLEXIV_PRONOUNS = new Set(['mich', 'mir', 'dich', 'dir', 'sich', 'uns', 'euch', 'ihn', 'ihm']);
const MODAL_ROOTS = /^(?:kann|kannst|könn|muss|musst|müss|soll|sollst|sollt|darf|darfst|dürf|will|willst|woll)/i;

/** @param {string[]} options @param {string} body */
function isReflexivPronounGap(options, body) {
  if ((options || []).length >= 2 && (options || []).every((o) => REFLEXIV_PRONOUNS.has(String(o).toLowerCase()))) {
    return true;
  }
  return /\w+\s+___\s+(?:auf|über|an|um|vor|bei|mit|nach|durch|in)\b/i.test(normalizeQuestionBody(body));
}

/** @param {string|string[]} correct */
function reflexivPronounCaseHint(correct) {
  const c = String((Array.isArray(correct) ? correct[0] : correct) || '').toLowerCase();
  if (['mir', 'dir', 'ihm', 'uns', 'euch'].includes(c)) return 'Reflexivpronomen — Dativ';
  return 'Reflexivpronomen — Akkusativ';
}

/** @param {string[]} options */
function isModalOptionSet(options) {
  return (options || []).length >= 2 && (options || []).every((o) => MODAL_ROOTS.test(String(o)));
}

/**
 * Dedicated hint logic for all REFLEXIVPRONOMEN question types.
 * @param {string} inner
 * @param {string|string[]} correct
 * @param {string[]} options
 * @param {string} body
 * @param {string} id
 * @return {string}
 */
function reflexivFormHint(inner, correct, options, body, id) {
  if (isReflexivPronounGap(options, body)) {
    return reflexivPronounCaseHint(correct);
  }

  const sentence = normalizeQuestionBody(body);
  const c = String((Array.isArray(correct) ? correct[0] : correct) || '').toLowerCase();

  if (isModalOptionSet(options) && options.length > 0) {
    const inf = infinitiveFromReflexivSentence(sentence) || '…';
    return `Modalverb + Verb ${inf}`;
  }

  if ((HABEN_FORMS.has(c) || SEIN_FORMS.has(c)) && /\b\w+mich\s+\w+(?:t|et|en)\b/i.test(sentence.replace('___', 'mich '))) {
    const pp = sentence.match(/\bmich\s+(\w+(?:t|et|en))\b/i);
    if (pp) {
      const inf = finiteToInfinitive(pp[1]) || pp[1].replace(/t$/, 'ten').replace(/et$/, 'eten');
      const aux = HABEN_FORMS.has(c) ? 'haben' : 'sein';
      if (inf && /(?:en|eln|ern)$/i.test(inf)) {
        return `Perfekt + Hilfsverb ${aux} + Verb ${inf}`;
      }
    }
  }

  const oldFinite = inner.match(/^Reflexiv\s*—\s*(\S+)/i);
  if (oldFinite) {
    const inf = finiteToInfinitive(oldFinite[1]);
    if (inf) return formatVerbHint('REFLEXIVPRONOMEN', inf);
  }

  let lemma = bankLemmaFromBody(body, 'REFLEXIVPRONOMEN')
    || bankLemmaFromId(id, 'REFLEXIVPRONOMEN')
    || lemmaFromReflexivBankItem(sentence, options, correct)
    || parseVerbLemmaFromInner(inner)
    || extractInfinitiveFromOptions(options, correct)
    || infinitiveFromReflexivSentence(sentence)
    || finiteToInfinitive(c);

  if (lemma && PERSON_MARK.test(lemma)) lemma = '';

  return formatVerbHint('REFLEXIVPRONOMEN', lemma);
}

/**
 * @param {string} topic
 * @param {string} [inner]
 * @param {string|string[]} [correct]
 * @param {string[]} [options]
 * @return {string}
 */
export function verbFormHint(topic, inner = '', correct = [], options = [], body = '', id = '') {
  if (topic === 'TRENNBAREVERBENB1') return 'Trennbares Verb';
  if (topic === 'VERBLASSEN') return 'Verben lassen';

  if (topic === 'REFLEXIVPRONOMEN') {
    const hint = reflexivFormHint(inner, correct, options, body, id);
    if (hint && !/^Reflexivform$/i.test(hint)) return hint;
  }

  let lemma = bankLemmaFromBody(body, topic) || bankLemmaFromId(id, topic) || '';

  if (!lemma) lemma = parseVerbLemmaFromInner(inner);

  if (!lemma) {
    if (topic === 'PERFEKTA2' || topic === 'PERFEKTB1') {
      lemma = inferPerfektLemma(inner, correct);
    } else if (topic === 'MODALVERBENA2') {
      lemma = inferModalLemma(correct) || extractInfinitiveFromOptions(options, correct);
    } else if (topic === 'TRENNBAREVERBEN' || topic === 'TRENNBAREVERBENB1') {
      lemma = separableInfinitiveFromOptions(options)
        || extractInfinitiveFromOptions(options, correct)
        || inferSeparableLemma(body);
    } else if (topic === 'VERBLASSEN') {
      lemma = inferVerblassenLemma(body);
    } else if (topic === 'PASSIVB1' || topic === 'PASSIVB2') {
      lemma = inferPassivLemma(body);
    } else if (topic === 'KONJUNKTIV2' || topic === 'KONJUNKTIV2B2' || topic === 'FUTURI') {
      lemma = inferModalLemma(correct) || inferLemmaFromFinite(correct);
    } else if (!lemma || !isLikelyLemma(lemma)) {
      lemma = extractInfinitiveFromOptions(options, correct);
    }
  }

  if (!lemma) lemma = inferLemmaFromFinite(correct);
  if (!lemma && topic === 'VERBKONJUGATION') {
    lemma = inferSeparableLemma(body) || separableInfinitiveFromOptions(options);
  }
  if (!lemma && (topic === 'TRENNBAREVERBEN' || topic === 'TRENNBAREVERBENB1')) {
    lemma = inferSeparableLemma(body) || separableInfinitiveFromOptions(options);
  }
  if (!lemma && topic === 'MODALVERBENA2') lemma = inferModalLemma(correct);
  if (!lemma && topic === 'VERBLASSEN') lemma = inferVerblassenLemma(body);
  if (!lemma && (topic === 'PASSIVB1' || topic === 'PASSIVB2')) lemma = inferPassivLemma(body);
  if (!lemma && (topic === 'KONJUNKTIV2' || topic === 'KONJUNKTIV2B2' || topic === 'FUTURI')) {
    lemma = inferModalLemma(correct) || inferLemmaFromFinite(correct) || 'werden';
  }

  const modalTopics = new Set(['MODALVERBENA2', 'KONJUNKTIV2', 'KONJUNKTIV2B2']);
  if (lemma && !isLikelyLemma(lemma) && !modalTopics.has(topic)) lemma = '';

  return formatVerbHint(topic, lemma);
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

  if (POSSESSIV_TOPICS.has(topic)) {
    if (inner && possessivHintMatchesAnswer(inner, correct)) {
      const rest = inner.replace(/^Possessiv(?:artikel)?\s*—\s*/i, '').trim();
      if (rest && !/^Possessivartikel$/i.test(rest)) {
        const hint = rest.startsWith('Possessiv') ? rest : `Possessivartikel — ${rest}`;
        if (!PERSON_MARK.test(rest) || rest.includes(',')) return hint;
        // Bare person only, e.g. "(ihr)" — add case label when known from inner
        return `Possessivartikel — ${rest}`;
      }
    }
    if (inner && PERSON_MARK.test(inner.trim()) && !inner.includes(',')) {
      return `Possessivartikel — ${inner.trim()}`;
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
