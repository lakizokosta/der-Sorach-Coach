/**
 * @fileoverview Words that should NOT trigger the dictionary popup.
 *
 * Function words: pronouns, articles, prepositions, aux/modals, numerals.
 * See also `dictMeta.js` for grammar labels and exercise boilerplate.
 */

export const DICT_STOPWORDS = new Set([
  // Personal pronouns
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'man',
  'mir', 'dir', 'ihm', 'ihn', 'uns', 'euch', 'ihnen',
  'mich', 'dich', 'sich',
  // Possessives
  'mein', 'dein', 'sein', 'unser', 'euer', 'ihr',
  'meine', 'deine', 'seine', 'ihre', 'unsere', 'eure',
  'meinen', 'deinen', 'seinen', 'ihren', 'meinem', 'deinem', 'seinem', 'ihrem',
  'meiner', 'deiner', 'seiner', 'ihrer', 'meines', 'deines', 'seines', 'ihres',
  // Demonstratives / interrogatives
  'dieser', 'diese', 'dieses', 'diesen', 'diesem',
  'jener', 'jene', 'jenes', 'jenen', 'jenem',
  'welcher', 'welche', 'welches', 'welchen', 'welchem',
  'wer', 'was', 'wem', 'wen', 'wessen', 'wo', 'wohin', 'woher', 'wann', 'warum', 'wie',
  'jemand', 'jemanden', 'jemandem', 'niemand', 'niemanden', 'niemandem',
  'etwas', 'nichts', 'alle', 'alles', 'beide', 'beiden', 'beider', 'beides',
  'manch', 'manche', 'mancher', 'manches', 'viele', 'vieler', 'vieles', 'wenige',
  // Articles
  'der', 'die', 'das', 'den', 'dem', 'des',
  'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'kein', 'keine', 'keinen', 'keinem', 'keiner', 'keines',
  // Particles / adverbs (function)
  'ja', 'nein', 'und', 'oder', 'aber', 'auch', 'noch', 'schon', 'nur', 'sehr', 'nicht',
  'doch', 'also', 'nun', 'eben', 'mal', 'klar', 'gut', 'okay', 'bitte', 'danke',
  'halt', 'wohl', 'denn', 'zwar', 'sogar', 'bereits', 'immer', 'nie', 'oft', 'meist',
  'schon', 'erst', 'gar', 'selbst', 'etwa', 'ca', 'circa', 'pro', 'je', 'bis', 'ab',
  // Auxiliary & modal verbs (all common forms)
  'bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren', 'wart', 'gewesen', 'sei', 'seien',
  'habe', 'hast', 'hat', 'habt', 'haben', 'hatte', 'hattest', 'hatten', 'hattet', 'gehabt',
  'werde', 'wirst', 'wird', 'werdet', 'werden', 'wurde', 'wurdest', 'wurden', 'wurdet', 'worden',
  'kann', 'kannst', 'können', 'konnte', 'konntest', 'konnten', 'konntet', 'gekonnt',
  'muss', 'musst', 'müssen', 'musste', 'musstest', 'mussten', 'musstet', 'gemusst',
  'darf', 'darfst', 'dürfen', 'durfte', 'durftest', 'durften', 'durftet', 'gedurft',
  'soll', 'sollst', 'sollen', 'sollte', 'solltest', 'sollten', 'solltet', 'gesollt',
  'will', 'willst', 'wollen', 'wollte', 'wolltest', 'wollten', 'wolltet', 'gewollt',
  'mag', 'magst', 'mögen', 'mochte', 'mochtest', 'mochten', 'mochtet', 'gemocht',
  'möchte', 'möchtest', 'möchten', 'möchtet',
  'sein', 'haben',
  // Prepositions
  'zu', 'in', 'an', 'auf', 'mit', 'von', 'aus', 'bei', 'nach',
  'vor', 'für', 'über', 'unter', 'durch', 'um', 'seit',
  'ohne', 'gegen', 'trotz', 'wegen', 'statt', 'als', 'wie',
  'hinter', 'neben', 'zwischen', 'innerhalb', 'außerhalb', 'gegenüber', 'entlang',
  // Numerals
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun',
  'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn',
  'achtzehn', 'neunzehn', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig',
  'siebzig', 'achtzig', 'neunzig', 'hundert', 'tausend', 'million',
  'erste', 'zweite', 'dritte', 'vierte', 'fünfte', 'sechste', 'siebte', 'achte',
  // Misc
  'uhr', 'jahre', 'jahr', 'jahren', 'tag', 'tage', 'tagen', 'woche', 'monat', 'monats',
]);

/**
 * @param {string} word
 * @return {boolean}
 */
export function isDictStopword(word) {
  return DICT_STOPWORDS.has(String(word || '').toLowerCase());
}
