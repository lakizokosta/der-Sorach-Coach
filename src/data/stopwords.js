/**
 * @fileoverview Words that should NOT trigger the dictionary popup.
 *
 * In the trainer text every running word is wrapped in a clickable span so
 * Premium users can look up its translation. To avoid polluting the UI with
 * popups for ubiquitous function words (articles, pronouns, conjunctions,
 * numerals, common verbs), we skip them via this set.
 */

export const DICT_STOPWORDS = new Set([
  // Pronouns
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr',
  'mir', 'dir', 'ihn', 'ihm', 'uns', 'mich', 'dich', 'euch',
  // Articles
  'der', 'die', 'das', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'den', 'dem', 'des',
  // Conjunctions / particles
  'ja', 'nein', 'und', 'oder', 'aber', 'auch', 'noch', 'schon', 'nur', 'sehr', 'nicht',
  'doch', 'also', 'nun', 'eben', 'mal', 'klar', 'gut', 'okay', 'bitte', 'danke',
  'halt', 'wohl', 'denn', 'zwar', 'sogar', 'bereits', 'immer', 'nie', 'oft',
  // Auxiliary verbs
  'ist', 'hat', 'bin', 'bist', 'sind', 'war', 'waren', 'haben', 'sein', 'wird', 'wurde',
  'kann', 'muss', 'darf', 'soll', 'will', 'mag',
  // Prepositions
  'zu', 'in', 'an', 'auf', 'mit', 'von', 'aus', 'bei', 'nach',
  'vor', 'für', 'über', 'unter', 'durch', 'um', 'bis', 'seit',
  'ohne', 'gegen', 'trotz', 'wegen', 'statt', 'als', 'wie',
  // Numerals
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun',
  'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn',
  'achtzehn', 'neunzehn', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig',
  'siebzig', 'achtzig', 'neunzig', 'hundert', 'tausend', 'million',
  'erste', 'zweite', 'dritte', 'vierte', 'fünfte',
  // Misc
  'uhr', 'jahre', 'jahr', 'kein', 'keine', 'keinen', 'keinem', 'keiner',
]);
