/**
 * Infer comma positions (0-based word indices) for dropbox sentence-building tasks.
 * Commas mark boundaries before/after subordinate clauses (Nebensätze).
 */

const SUBORD_AT_0 = new Set([
  'wenn', 'falls', 'sobald', 'als', 'während', 'nachdem', 'bevor', 'bis', 'seit', 'seitdem',
  'obwohl', 'obschon', 'obgleich', 'weil', 'da', 'dass', 'ob',
]);

const K2_V1_STARTERS = new Set([
  'wäre', 'wären', 'hätte', 'hätten', 'könnte', 'könnten', 'würde', 'würden',
]);

const SUBORD_EMBEDDED = new Set([
  'wenn', 'falls', 'sobald', 'als', 'während', 'nachdem', 'bevor', 'bis', 'seit', 'seitdem',
  'obwohl', 'obschon', 'obgleich', 'weil', 'da', 'dass', 'ob', 'damit', 'um', 'sofern', 'indem',
]);

const INDIRECT_Q = new Set([
  'ob', 'wann', 'wo', 'warum', 'wie', 'was', 'wer', 'wem', 'wen', 'wieso',
  'welche', 'welcher', 'welches',
]);

const REL_PRON = new Set(['der', 'die', 'das', 'den', 'dem', 'dessen', 'deren', 'denen']);

const MAIN_FINITE = new Set([
  'würde', 'würden', 'würdest', 'könnte', 'könnten', 'könntest', 'hätte', 'hätten', 'hättest',
  'müsste', 'müssten', 'sollte', 'sollten', 'wäre', 'wären', 'wärst',
  'bin', 'bist', 'ist', 'sind', 'war', 'waren', 'wird', 'werden', 'wurde', 'wurden', 'worden',
  'habe', 'hast', 'hat', 'haben', 'hatte', 'hatten',
  'kann', 'kannst', 'können', 'konnte', 'konnten', 'konntest',
  'muss', 'musst', 'müssen', 'musste', 'mussten',
  'soll', 'sollst', 'sollen', 'sollte', 'sollten',
  'will', 'willst', 'wollen', 'wollte', 'wollten',
  'mag', 'mögen', 'mochte', 'darf', 'dürfen', 'durfte',
  'bleibe', 'bleibt', 'bleiben', 'gehe', 'geht', 'gehen', 'ging', 'komme', 'kommt', 'kommen', 'kam',
  'fahre', 'fährt', 'fahren', 'fuhr', 'mache', 'macht', 'machen', 'nahm', 'nehme', 'nimmt', 'nehmen',
  'gebe', 'gibt', 'geben', 'gab', 'finde', 'findet', 'finden', 'fand',
  'arbeite', 'arbeitet', 'arbeiten', 'lerne', 'lernt', 'lernen', 'kaufe', 'kauft', 'kaufen',
  'bestand', 'besteht', 'bestehen', 'fällt', 'fiel', 'reagieren', 'beginnt', 'beginnen', 'beginne',
  'informiere', 'informiert', 'rufe', 'ruft', 'melde', 'meldet', 'schreib', 'schreibt', 'schreiben',
  'treffen', 'trifft', 'warte', 'wartet', 'warten', 'fahr',
  'ruf', 'bleib', 'komm', 'geh', 'iss', 'essen', 'wandern',
  'vorbei', 'anfangen', 'starten', 'bestanden', 'gelingt', 'gelingen', 'steigen', 'wächst', 'wachsen',
  'genesen', 'dauert', 'dauern', 'stattfindet', 'stattfinden', 'verfügbar', 'bedeutet', 'kostet',
  'denkt', 'denken', 'glaube', 'glaubt', 'sagt', 'sagte', 'meint', 'hofft', 'behauptet', 'bestätigt',
  'merkt', 'hört', 'weiß', 'wissen', 'fragt', 'fragen', 'erkundigt', 'prüfen', 'prüft', 'möchte',
  'gibt', 'geben', 'trinke', 'trinkt', 'spart', 'informiert', 'schult', 'liest',
  'erklärt', 'packt', 'verschreibt', 'investiert', 'melden', 'bietet', 'diskutiert', 'zeigt',
  'kündigt', 'bleibe', 'geht', 'kommt', 'arbeitet', 'kocht', 'schläft', 'präsentiert',
  'diskutieren', 'telefoniert', 'trainiert', 'reist', 'sitzt', 'traf', 'planen', 'behandelt',
  'wohne', 'vertraue', 'gebucht', 'verabschiedet', 'danke', 'dauerte', 'stand', 'gibt',
]);

/** @param {string} w */
function lw(w) {
  return String(w).toLowerCase();
}

/** @param {string} w */
function isMainFinite(w) {
  return MAIN_FINITE.has(lw(w));
}

/**
 * @param {string[]} words
 * @return {number|null}
 */
function commaAfterV1Subordinate(words) {
  for (let i = 1; i < words.length; i++) {
    if (!isMainFinite(words[i])) continue;
    if (i + 1 < words.length && isMainFinite(words[i + 1])) continue;
    if (i >= 2) return i - 1;
    if (i === 1 && K2_V1_STARTERS.has(lw(words[0]))) return i - 1;
  }
  for (let i = 2; i < words.length; i++) {
    if (isMainFinite(words[i])) return i - 1;
  }
  return null;
}

/**
 * @param {string[]} words
 * @return {number[]|null}
 */
function inferRelativsatzCommas(words) {
  for (let i = 1; i < words.length - 1; i++) {
    if (!REL_PRON.has(lw(words[i]))) continue;
    const before = words[i - 1];
    if (!before || before === before.toLowerCase()) continue;

    const firstComma = i - 1;
    let relVerbIdx = -1;
    for (let j = i + 1; j < words.length; j++) {
      if (isMainFinite(words[j])) {
        relVerbIdx = j;
        break;
      }
    }
    if (relVerbIdx === -1) continue;

    for (let k = relVerbIdx + 1; k < words.length; k++) {
      if (isMainFinite(words[k])) {
        return [firstComma, relVerbIdx];
      }
    }
    return [firstComma, relVerbIdx];
  }
  return null;
}

/**
 * @param {string[]} words
 * @param {string} [hint]
 * @param {number[]} [explicit]
 * @return {number[]}
 */
export function inferDropboxCommas(words, hint = '', explicit) {
  if (Array.isArray(explicit) && explicit.length) {
    return [...explicit].map(Number).filter((n) => Number.isInteger(n) && n >= 0).sort((a, b) => a - b);
  }
  if (!Array.isArray(words) || words.length < 3) return [];

  const ws = words.map(String);
  const h = lw(hint);
  const commas = new Set();

  if (h.includes('relativsatz')) {
    const rel = inferRelativsatzCommas(ws);
    if (rel?.length) return rel;
  }

  const first = lw(ws[0]);
  if (SUBORD_AT_0.has(first) || K2_V1_STARTERS.has(first)) {
    const c = commaAfterV1Subordinate(ws);
    if (c !== null && c >= 0) commas.add(c);
  }

  for (let i = 1; i < ws.length; i++) {
    const w = lw(ws[i]);
    if (w === 'denn' || w === 'trotzdem' || w === 'aber' || w === 'dann') continue;
    if (SUBORD_EMBEDDED.has(w) || INDIRECT_Q.has(w)) {
      commas.add(i - 1);
    }
  }

  return [...commas].sort((a, b) => a - b);
}

/**
 * @param {{ words?: string[], hint?: string, commas?: number[], prompt?: string }} question
 * @return {number[]}
 */
export function resolveDropboxCommas(question) {
  const hint =
    question?.hint ||
    String(question?.prompt || '').match(/\(([^)]+)\)\s*$/)?.[1] ||
    '';
  return inferDropboxCommas(question?.words, hint, question?.commas);
}
