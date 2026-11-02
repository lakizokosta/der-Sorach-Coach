/**
 * @fileoverview Ensures direct questions show «?» in trainer content.
 *
 * Dropbox: interrogative word order gets a fixed `?` (and Q+A mini-dialogues
 * get `?` after the question + `.` after the answer). DragDrop peels these
 * marks out of the chip bank so learners only arrange real words.
 */

import {
  extractFixedPunctuation,
  rebuildWordsWithPunctuation,
} from './dropboxPunctuation.js';

const TRAILING_PUNCT = new Set(['.', '?', '!']);

/** W-question starters (case-insensitive match on first token). */
const W_STARTERS = new Set([
  'was', 'wer', 'wen', 'wem', 'wessen',
  'wo', 'wohin', 'woher', 'worauf', 'worüber', 'worum', 'woran', 'woraus', 'wobei', 'womit', 'wonach', 'wofür',
  'wann', 'warum', 'weshalb', 'wieso', 'weswegen', 'wozu',
  'wie', 'wieviel', 'wieviele',
  'welch', 'welche', 'welcher', 'welches', 'welchen', 'welchem',
]);

/** Finite forms that open a yes/no question (V1) in learner materials. */
const V1_QUESTION_VERBS = new Set([
  'bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren',
  'habe', 'hast', 'hat', 'haben', 'habt', 'hatte', 'hattest', 'hatten',
  'werde', 'wirst', 'wird', 'werden', 'werdet', 'wurde', 'wurden',
  'kann', 'kannst', 'können', 'könnt', 'konnte', 'konntest', 'konnten',
  'muss', 'musst', 'müssen', 'müsst', 'musste', 'mussten',
  'soll', 'sollst', 'sollen', 'sollt', 'sollte', 'sollten',
  'will', 'willst', 'wollen', 'wollt', 'wollte', 'wollten',
  'mag', 'magst', 'mögen', 'mögt', 'mochte', 'mochten',
  'darf', 'darfst', 'dürfen', 'dürft', 'durfte', 'durften',
  'möchte', 'möchtest', 'möchten', 'möchtet',
  'kommst', 'kommt', 'kommen', 'kam', 'kamen',
  'gehst', 'geht', 'gehen', 'ging', 'gingen',
  'fährst', 'fährt', 'fahren', 'fahrt', 'fuhr', 'fuhren',
  'lernst', 'lernt', 'lernen',
  'wohnst', 'wohnt', 'wohnen',
  'spielst', 'spielt', 'spielen',
  'arbeitest', 'arbeitet', 'arbeiten',
  'bleibst', 'bleibt', 'bleiben',
  'brauchst', 'braucht', 'brauchen',
  'weißt', 'weiß', 'wissen', 'wisst',
  'verstehst', 'versteht', 'verstehen',
  'sprichst', 'spricht', 'sprechen', 'sprecht',
  'siehst', 'sieht', 'sehen', 'seht',
  'hörst', 'hört', 'hören',
  'nimmst', 'nimmt', 'nehmen', 'nehmt',
  'gibst', 'gibt', 'geben', 'gebt',
  'sagst', 'sagt', 'sagen',
  'machst', 'macht', 'machen',
  'hast', 'habt',
  'warst',
  'findest', 'findet', 'finden',
  'interessierst', 'interessiert',
  'kennst', 'kennt', 'kennen',
  'kennengelernt', // not a starter; ignored
]);

const ANSWER_PARTICLES = new Set(['ja', 'nein', 'doch']);

const PRONOUN_SECONDS = new Set([
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'man',
]);

/**
 * @param {Object} question
 * @return {boolean}
 */
export function isInterrogativeQuestion(question) {
  const topic = String(question.topic || '').toUpperCase();
  if (topic === 'W-FRAGEN') return true;

  const prompt = String(question.prompt || '');
  if (/\bW-Frage\b/i.test(prompt)) return true;
  if (/\bFragewort\b/i.test(prompt)) return true;
  if (/\bFrage nach\b/i.test(prompt)) return true;

  if (question.type === 'dropbox' && Array.isArray(question.words)) {
    return dropboxLooksInterrogative(question.words);
  }

  return false;
}

/**
 * @param {string} token
 * @return {string}
 */
function lw(token) {
  return String(token || '').toLowerCase();
}

/**
 * @param {string[]} words
 * @return {boolean}
 */
export function dropboxLooksInterrogative(words) {
  const { coreWords } = extractFixedPunctuation(words);
  if (coreWords.length < 2) return false;

  const first = lw(coreWords[0]);
  if (W_STARTERS.has(first) || first.startsWith('welch')) return true;
  if (!V1_QUESTION_VERBS.has(first)) return false;

  const second = lw(coreWords[1]);
  // "Nehmen Sie …" imperatives stay statements; modals + Sie stay questions.
  if (second === 'sie' && coreWords[1] === 'Sie') {
    return isModalForm(first);
  }
  return PRONOUN_SECONDS.has(second) || second === 'jemand' || second === 'man';
}

/**
 * @param {string} verbLower
 * @return {boolean}
 */
function isModalForm(verbLower) {
  return (
    /^(kann|kannst|können|könnt|darf|darfst|dürfen|dürft|muss|musst|müssen|müsst|soll|sollst|sollen|sollt|will|willst|wollen|wollt|mag|magst|mögen|mögt|möchte|möchtest|möchten|möchtet)/.test(
      verbLower,
    )
  );
}

/**
 * @param {string} prompt
 * @return {string}
 */
function ensurePromptQuestionMark(prompt) {
  if (!prompt || prompt.includes('?')) return prompt;

  const emIdx = prompt.indexOf(' — ');
  const parenIdx = prompt.indexOf(' (');
  let cut = prompt.length;
  if (emIdx !== -1) cut = Math.min(cut, emIdx);
  if (parenIdx !== -1) cut = Math.min(cut, parenIdx);

  const sentence = prompt.slice(0, cut).trimEnd();
  const rest = prompt.slice(cut);
  if (!sentence) return prompt;

  return `${sentence}?${rest}`;
}

/**
 * Capitalise Antwortpartikel after a direct question.
 * @param {string} token
 * @return {string}
 */
function capitaliseParticle(token) {
  const lower = lw(token);
  if (!ANSWER_PARTICLES.has(lower)) return token;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Insert dialogue / question punctuation into dropbox words when missing.
 *
 * Q+A: Kann ich … legen ja gern → Kann ich … legen ? Ja gern .
 * Pure Q: Kannst du mir helfen → Kannst du mir helfen ?
 *
 * @param {string[]} words
 * @return {string[]}
 */
export function ensureDropboxInterrogativePunctuation(words) {
  if (!Array.isArray(words) || words.length < 2) return words;
  if (!dropboxLooksInterrogative(words)) return words;

  const { coreWords, punctAfter } = extractFixedPunctuation(words);
  const rebuilt = rebuildWordsWithPunctuation(coreWords, punctAfter);
  if (rebuilt.some((w) => TRAILING_PUNCT.has(w))) {
    // Already has at least one mark — leave authoring as-is.
    return words;
  }

  const partIdx = coreWords.findIndex(
    (w, i) => i >= 1 && ANSWER_PARTICLES.has(lw(w)),
  );

  if (partIdx > 0) {
    const next = [...coreWords];
    next[partIdx] = capitaliseParticle(next[partIdx]);
    /** @type {Record<number, string>} */
    const marks = { ...punctAfter, [partIdx - 1]: '?' };
    // Full stop after the answer, unless already present.
    marks[next.length - 1] = `${marks[next.length - 1] || ''}.`;
    return rebuildWordsWithPunctuation(next, marks);
  }

  return [...coreWords, '?'];
}

/**
 * Mutates the parsed question so direct questions show «?» in the trainer UI.
 *
 * @param {Object} question
 * @return {Object}
 */
export function applyInterrogativePunctuation(question) {
  if (question.type === 'dropbox' && Array.isArray(question.words)) {
    question.words = ensureDropboxInterrogativePunctuation(question.words);
    if (Array.isArray(question.alternatives)) {
      question.alternatives = question.alternatives.map((alt) =>
        ensureDropboxInterrogativePunctuation(alt),
      );
    }
    return question;
  }

  if (!isInterrogativeQuestion(question)) return question;

  if (question.prompt) {
    question.prompt = ensurePromptQuestionMark(question.prompt);
  }

  return question;
}
