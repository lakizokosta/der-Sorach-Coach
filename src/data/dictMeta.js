/**
 * @fileoverview Extra skip rules for the dictionary (grammar labels, exercise boilerplate).
 *
 * Used by `wrapWordsForDictionary` and `scripts/build-dictionary.mjs`.
 */

/** Grammar / exercise meta-words from hints — not learner vocabulary. */
export const DICT_GRAMMAR_TERMS = new Set([
  'präposition', 'praesens', 'präsens', 'praeteritum', 'präteritum', 'perfekt', 'passiv',
  'akkusativ', 'dativ', 'genitiv', 'nominativ', 'nom', 'akk', 'dat', 'gen',
  'grammatikform', 'adjektivendung', 'adjektivdeklination', 'possessivartikel',
  'hilfsverb', 'reflexiv', 'modalverb', 'infinitiv', 'partizip', 'partizipii',
  'relativsatz', 'kausalsatz', 'finalsatz', 'konditionalsatz', 'konzessivsatz',
  'temporalsatz', 'indirekterede', 'sprachbausteine', 'wortschatz', 'quiz',
  'mask', 'fem', 'neut', 'pl', 'sing', 'komparativ', 'superlativ', 'grundform',
  'trennbares', 'untrennbares', 'verb', 'adjektiv', 'nomen', 'artikel',
  'wechselpräposition', 'feste', 'lokal', 'temporal', 'kausal', 'konjunktional',
]);

/** Instruction boilerplate in prompts — not vocabulary. */
export const DICT_INSTRUCTION_WORDS = new Set([
  'ordne', 'ordnen', 'wörter', 'wörter', 'satz', 'sätze', 'richtigen', 'richtige',
  'richtig', 'wähle', 'wählen', 'setze', 'setzen', 'ergänze', 'ergänzen',
  'schreib', 'schreiben', 'klicke', 'klicken', 'markiere', 'markieren',
  'verbinde', 'verbinden', 'bilde', 'bilden', 'form', 'formen', 'lücke', 'lücken',
]);

/** Preposition + article contractions — grammar, not lexicon. */
export const DICT_CONTRACTIONS = new Set([
  'zum', 'zur', 'im', 'am', 'beim', 'vom', 'ins', 'ans', 'aufs', 'durchs', 'fürs', 'ums',
]);

/** Subordinating / coordinating conjunctions & discourse markers. */
export const DICT_CONJUNCTIONS = new Set([
  'weil', 'dass', 'daß', 'wenn', 'falls', 'obwohl', 'obschon', 'damit', 'während',
  'bevor', 'nachdem', 'seitdem', 'sobald', 'solange', 'ob', 'indem', 'sodass',
  'trotzdem', 'außerdem', 'deshalb', 'deswegen', 'darum', 'dann', 'danach',
  'davor', 'dafür', 'dagegen', 'darüber', 'darauf', 'darin', 'dazu', 'davon',
  'dazu', 'hier', 'dort', 'da', 'dort', 'heute', 'gestern', 'morgen',
  'vielleicht', 'vielleicht', 'natürlich', 'eigentlich', 'ziemlich', 'ganz',
]);

/** Comparative / superlative — no separate translation (see DICTIONARY-PLAN). */
export const DICT_DEGREE_FORMS = new Set([
  'besser', 'beste', 'besten', 'bestes', 'bestem', 'bester', 'best',
  'mehr', 'meiste', 'meisten', 'weniger', 'wenigste', 'wenigsten',
  'höher', 'höchste', 'höchsten', 'höchstem', 'höchster', 'höchstes',
  'näher', 'nächste', 'nächsten', 'nächstem', 'nächster', 'nächstes',
  'älter', 'älteste', 'ältesten', 'ältestem', 'ältester', 'ältestes',
  'größer', 'größte', 'größten', 'größtem', 'größter', 'größtes',
  'kleiner', 'kleinste', 'kleinsten', 'kleinstem', 'kleinster', 'kleinstes',
  'schneller', 'schnellste', 'schnellsten', 'schnellstem', 'schnellster',
  'weiter', 'weiteste', 'weitesten', 'lieber', 'liebste', 'liebsten',
]);

/** Transparent internationalisms — optional skip (RU audience). */
export const DICT_INTERNATIONALISMS = new Set([
  'auto', 'bus', 'taxi', 'hotel', 'telefon', 'radio', 'video', 'internet', 'computer',
  'problem', 'programm', 'system', 'information', 'situation', 'station', 'operation',
  'café', 'restaurant', 'team', 'sport', 'online', 'email', 'ticket', 'film', 'foto',
]);

/** Corpus artifacts / instruction fragments — not dictionary entries. */
export const DICT_SKIP_LEMMAS = new Set([
  'hause',       // «zu Hause» — not a standalone noun
  'richtigen', 'richtige', 'richtig',
  'ordne', 'wörter', 'worter',
  'grammatikform', 'adjektivendung',
  'tekamolo', 'wechselpräp', 'satzstellung', 'plural',
  'studentem', 'annam', 'annan', 'annas', 'jurnalist', 'herre',
  'teams', 'ice', 'mount',
]);

/**
 * @param {string} word  Lowercase token.
 * @return {boolean}
 */
export function isDictMetaSkipped(word) {
  const w = String(word || '').toLowerCase();
  if (!w) return true;
  return (
    DICT_GRAMMAR_TERMS.has(w) ||
    DICT_INSTRUCTION_WORDS.has(w) ||
    DICT_CONTRACTIONS.has(w) ||
    DICT_CONJUNCTIONS.has(w) ||
    DICT_DEGREE_FORMS.has(w) ||
    DICT_INTERNATIONALISMS.has(w) ||
    DICT_SKIP_LEMMAS.has(w)
  );
}
