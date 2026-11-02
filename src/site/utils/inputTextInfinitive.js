/**
 * Resolves the verb infinitive shown as a learner hint on input-text gaps.
 * Only shown when the gap is clearly a verb (topic, prompt tag, or lemma).
 * Sources (in order): frontmatter `lemma`, YAML/prompt «Verb …» hint,
 * `verbLemmas.json`, trailing `(Verb …)` in the prompt body,
 * separable-verb particle + finite `correct` answer (verb topics only).
 */

import verbLemmas from '../data/verbLemmas.json' with { type: 'json' };

function stripTrailingPromptHint(text) {
  return String(text || '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}

const PERSON = /^(ich|du|er|sie|es|wir|ihr|Sie|man)$/i;

const SEPARABLE_PARTICLES = [
  'zurück', 'zusammen', 'wieder', 'fort', 'nieder', 'wider', 'fest', 'frei', 'hoch',
  'an', 'ab', 'auf', 'aus', 'bei', 'ein', 'mit', 'nach', 'vor', 'zu', 'weg', 'weiter',
  'her', 'hin', 'um', 'durch',
];

/** Topics where the blank is never a verb infinitive hint unless `lemma` / `(Verb …)`. */
const NON_VERB_TOPIC_RE = /ARTIKEL|NOMEN|SUBSTANTIV|ADJEKTIV|PRÄPOS|PRAEPOS|PRÄPOSITION|KASUS|AKKUSATIV|DATIV|GENITIV|NOMINATIV|POSSESSIV|DEMONSTRATIV|RELATIV|INTERROGATIV|KONJUNktion|ADVERSATIV|TEMPORAL|LOKAL|KAUSAL|KONZESSIV|FINAL|KONDITIONAL|VERNEINUNG|WFRAGE|W-FRAGE|FRAGE|GEGENTEIL|KOMPARATIV|SUPERLATIV|STEIGERUNG|WORTSCHATZ|ZAHL|NUMBER|PLURAL/i;

/** Topics where deriving an infinitive from the answer is allowed. */
const VERB_TOPIC_RE = /VERB(?:EN|FORM)?|KONJUG|MODAL|PERFEKT|PASSIV|PRÄTER|PRATER|KONJUNKTIV|IMPERATIV|REFLEXIV|TRENNBAR|HILFSVERB|ZUSAMMEN|PARTIZIP|INFINITIV|FUTUR/i;

/** Function words that must never become pseudo-infinitives (die → dien, etc.). */
const NON_VERB_WORDS = new Set([
  'die', 'der', 'das', 'den', 'dem', 'des',
  'ein', 'eine', 'einer', 'einem', 'einen', 'eines',
  'mein', 'meine', 'meiner', 'meinem', 'meinen', 'meines',
  'dein', 'deine', 'deiner', 'deinem', 'deinen', 'deines',
  'sein', 'seine', 'seiner', 'seinem', 'seinen', 'seines',
  'ihr', 'ihre', 'ihrer', 'ihrem', 'ihren', 'ihres',
  'unser', 'unsere', 'euer', 'eure',
  'mir', 'dir', 'ihm', 'ihr', 'uns', 'euch', 'ihnen', 'mich', 'dich', 'sich',
  'auf', 'in', 'an', 'aus', 'bei', 'mit', 'nach', 'von', 'zu', 'um', 'für', 'vor', 'über', 'unter', 'durch',
  'nicht', 'kein', 'keine', 'keinen', 'keiner', 'keinem', 'keines',
  'und', 'oder', 'aber', 'denn', 'weil', 'dass', 'wenn', 'als', 'ob',
]);

const FINITE_TO_INF = {
  bereite: 'vorbereiten', bereitest: 'vorbereiten', bereitet: 'vorbereiten',
  freue: 'freuen', freust: 'freuen', freut: 'freuen',
  melde: 'melden', meldest: 'melden', meldet: 'melden',
  kaufe: 'kaufen', kaufst: 'kaufen', kauft: 'kaufen',
  mache: 'machen', machst: 'machen', macht: 'machen',
  gehe: 'gehen', gehst: 'gehen', geht: 'gehen',
  stehe: 'stehen', stehst: 'stehen', steht: 'stehen',
  komme: 'kommen', kommst: 'kommen', kommt: 'kommen',
  nehme: 'nehmen', nimmst: 'nehmen', nimmt: 'nehmen',
  lese: 'lesen', liest: 'lesen', lest: 'lesen', las: 'lesen', lasst: 'lesen',
  laufe: 'laufen', läufst: 'laufen', läuft: 'laufen', lief: 'laufen',
  bin: 'sein', bist: 'sein', ist: 'sein', sind: 'sein', seid: 'sein', war: 'sein',
  habe: 'haben', hast: 'haben', hat: 'haben', haben: 'haben', habt: 'haben', hatte: 'haben',
  werde: 'werden', wirst: 'werden', wird: 'werden', werdet: 'werden', wurde: 'werden',
  kann: 'können', kannst: 'können', können: 'können', könnt: 'können', konnte: 'können',
  muss: 'müssen', musst: 'müssen', müssen: 'müssen', müsst: 'müssen',   musste: 'müssen',
  darf: 'dürfen', darfst: 'dürfen', dürfen: 'dürfen', dürft: 'dürfen', durfte: 'dürfen',
  will: 'wollen', willst: 'wollen', wollen: 'wollen', wollt: 'wollen', wollte: 'wollen',
  soll: 'sollen', sollst: 'sollen', sollen: 'sollen', sollt: 'sollen', sollte: 'sollen',
  wusste: 'wissen', wusstest: 'wissen', wussten: 'wissen', wusstet: 'wissen',
  weiß: 'wissen', weißt: 'wissen', wisst: 'wissen',
  war: 'sein', warst: 'sein', waren: 'sein', wart: 'sein',
  wäre: 'sein', wärest: 'sein', wären: 'sein', wäret: 'sein',
};

/**
 * @param {string} word
 * @return {boolean}
 */
function looksLikeInfinitive(word) {
  const w = String(word || '').toLowerCase().trim();
  if (!w || /\s/.test(w) || PERSON.test(w)) return false;
  if (/^(?:sein|haben|werden|tun|wissen|können|müssen|sollen|dürfen|wollen|mögen|möchten)$/.test(w)) {
    return true;
  }
  if (NON_VERB_WORDS.has(w)) return false;
  return /(?:en|eln|ern)$/i.test(w) && w.length >= 4;
}

/**
 * @param {string} word
 * @return {boolean}
 */
function isBlockedNonVerb(word) {
  const w = String(word || '').toLowerCase().trim();
  return !w || NON_VERB_WORDS.has(w);
}

/**
 * @param {string} word
 * @return {string}
 */
function finiteToInfinitive(word) {
  const w = String(word || '').toLowerCase().trim();
  if (!w || isBlockedNonVerb(w)) return '';
  if (FINITE_TO_INF[w]) return FINITE_TO_INF[w];
  if (/(?:en|eln|ern)$/i.test(w) && looksLikeInfinitive(w)) return w;
  // 2nd person -st (kaufst, machst) — not 3rd person liest (handled in map).
  if (/[a-zäöüß]{3,}st$/i.test(w) && w.length >= 6) {
    const stem = w.slice(0, -2);
    return stem.endsWith('e') ? `${stem}n` : `${stem}en`;
  }
  if (/[a-zäöüß]{3,}t$/i.test(w)) {
    const stem = w.slice(0, -1);
    return stem.endsWith('e') ? `${stem}n` : `${stem}en`;
  }
  if (/[a-zäöüß]{3,}e$/i.test(w)) return `${w.slice(0, -1)}en`;
  return '';
}

/**
 * @param {string} inner  Text inside trailing parentheses.
 * @return {string}
 */
function infinitiveFromParenInner(inner) {
  const text = String(inner || '').trim();
  if (!text) return '';

  if (/Artikel|Adjektiv|Präposition|Präpos|Genitiv|Gegenteil|Komparativ|Frage nach|Nom\.|Dat\.|Akk\.|Gen\./i.test(text)
    && !/\bVerb\b/i.test(text)) {
    return '';
  }

  const reflexiv = text.match(/Reflexiv\s*\+\s*Verb\s+([\wäöüÄÖÜß-]+)/i);
  if (reflexiv) {
    const verb = reflexiv[1].toLowerCase();
    if (verb.startsWith('sich ')) return verb;
    if (looksLikeInfinitive(verb)) return `sich ${verb}`;
    return verb;
  }

  const verbTag = text.match(/(?:Trennbares\s+Verb\s*\+\s*)?Verb\s+([\wäöüÄÖÜß-]+)/i);
  if (verbTag) {
    const verb = verbTag[1].toLowerCase();
    if (looksLikeInfinitive(verb)) return verb;
    const derived = finiteToInfinitive(verb);
    if (derived && looksLikeInfinitive(derived)) return derived;
  }

  const dash = text.match(/—\s*([\wäöüÄÖÜß-]+)/);
  if (dash) {
    const verb = dash[1].trim().toLowerCase();
    if (looksLikeInfinitive(verb)) return verb;
  }

  const parts = text.split(',').map((s) => s.trim());
  if (parts.length >= 2 && looksLikeInfinitive(parts[0]) && !PERSON.test(parts[0])) {
    return parts[0].toLowerCase();
  }

  if (looksLikeInfinitive(text)) return text.toLowerCase();

  return '';
}

/**
 * @param {string} promptBody
 * @return {string}
 */
function infinitiveFromTrailingParen(promptBody) {
  const match = String(promptBody || '').match(/\(([^)]*)\)\s*$/);
  if (!match) return '';
  return infinitiveFromParenInner(match[1]);
}

/**
 * @param {string} hint  Frontmatter or trailing hint (e.g. «Präteritum + Verb wissen»).
 * @return {string}
 */
function infinitiveFromQuestionHint(hint) {
  const m = String(hint || '').match(/\bVerb\s+([a-zäöüß-]+)/i);
  if (!m) return '';
  const v = m[1].toLowerCase();
  return looksLikeInfinitive(v) ? v : '';
}

/** Passiv hints: «Passiv + Verb prüfen» or «Passiv + Hilfsverb werden». */
function infinitiveFromPassivHint(hint) {
  const h = String(hint || '');
  const hilfs = h.match(/^Passiv\s*\+\s*Hilfsverb\s+([a-zäöüß-]+)/i);
  if (hilfs) {
    const v = hilfs[1].toLowerCase();
    return looksLikeInfinitive(v) ? v : '';
  }
  const m = h.match(/^Passiv\s*\+\s*Verb\s+([a-zäöüß-]{4,})/i);
  if (!m) return '';
  const v = m[1].toLowerCase();
  return looksLikeInfinitive(v) ? v : '';
}

/**
 * @param {{ prompt?: string, correct?: string[], topic?: string, lemma?: string }} question
 * @return {boolean}
 */
function isVerbGapContext(question) {
  const topic = String(question.topic || '').toUpperCase();
  const prompt = String(question.prompt || '');

  if (String(question.lemma || '').trim()) return true;
  if (/\bVerb\b/i.test(prompt) || /Reflexiv\s*\+\s*Verb/i.test(prompt)) return true;
  if (NON_VERB_TOPIC_RE.test(topic)) return false;
  return VERB_TOPIC_RE.test(topic);
}

/**
 * @param {string} correct
 * @param {string} promptBody
 * @return {string}
 */
function infinitiveFromSeparableVerb(correct, promptBody) {
  const stem = finiteToInfinitive(correct);
  if (!stem) return '';

  const sentence = stripTrailingPromptHint(promptBody);
  const particleRe = new RegExp(
    `\\b(${SEPARABLE_PARTICLES.join('|')})\\s*[?.,!]`,
    'i',
  );
  const particle = sentence.match(particleRe);
  if (!particle) return stem;

  const prefix = particle[1].toLowerCase();
  if (stem.startsWith(prefix)) return stem;
  return `${prefix}${stem}`;
}

/**
 * @param {{ prompt?: string, correct?: string[], topic?: string, lemma?: string }} question
 * @return {string}  Lower-case infinitive for display, or empty string.
 */
export function resolveInputTextInfinitive(question) {
  const lemma = String(question.lemma || '').trim().toLowerCase();
  const focusWord = String(question.focus || '').toLowerCase() === 'word';
  const correctRaw = Array.isArray(question.correct) ? question.correct[0] : '';
  const correct = String(correctRaw || '').trim();
  const correctLc = correct.toLowerCase();

  if (lemma) {
    if (focusWord) {
      // Vocab identity gaps (lemma ≈ answer): never show Infinitiv.
      // Nouns like Husten/Niesen end in -en and would spoil the answer
      // as «Infinitiv: husten».
      if (!correct || correctLc === lemma) return '';
      // Conjugation-style vocab only: infinitive lemma + finite answer.
      if (!looksLikeInfinitive(lemma)) return '';
      const fromAnswer = finiteToInfinitive(correct);
      if (fromAnswer && fromAnswer === lemma) return lemma;
      return '';
    }
    // Non-vocab lemma: still hide when it equals the gap answer (same leak).
    if (correctLc && correctLc === lemma) return '';
    return lemma;
  }

  const hintLine = question.hint || '';
  const hintVerb = infinitiveFromQuestionHint(hintLine) || infinitiveFromPassivHint(hintLine);
  if (hintVerb && isVerbGapContext(question)) return hintVerb;

  const fromParen = infinitiveFromTrailingParen(question.prompt || '');
  if (fromParen && isVerbGapContext(question)) return fromParen;

  if (!isVerbGapContext(question)) return '';

  if (correctLc && verbLemmas[correctLc]) {
    const fromDict = String(verbLemmas[correctLc]).toLowerCase();
    if (looksLikeInfinitive(fromDict)) return fromDict;
  }

  const topic = String(question.topic || '').toUpperCase();
  if (/TRENNBAREVERBEN/.test(topic)) {
    const sep = infinitiveFromSeparableVerb(correct, question.prompt || '');
    if (sep) return sep;
  }

  const fromAnswer = finiteToInfinitive(correct);
  if (fromAnswer && looksLikeInfinitive(fromAnswer)) return fromAnswer;

  return '';
}
