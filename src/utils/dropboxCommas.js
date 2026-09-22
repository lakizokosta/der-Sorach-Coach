/**
 * Infer comma positions (0-based word indices) for dropbox sentence-building tasks.
 * Commas mark boundaries between Hauptsätze / before Nebensätze.
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
  'sodass', 'so dass', 'ehe', 'wohingegen',
]);

const INDIRECT_Q = new Set([
  'ob', 'wann', 'wo', 'warum', 'wie', 'was', 'wer', 'wem', 'wen', 'wieso',
  'welche', 'welcher', 'welches',
]);

/** Coordinating connectors: always comma when not sentence-initial. */
const COORD_COMMA = new Set(['aber', 'denn', 'sondern', 'doch']);

/**
 * Antwortpartikeln Ja / Nein — always comma when more words follow
 * (Nein, die Wohnung ist günstig. / Ja, gern.).
 * Doch as answer particle only at clause start (index 0); mid-sentence
 * adversative doch uses COORD_COMMA (comma before, not after).
 */
const ANSWER_PARTICLE_JA_NEIN = new Set(['ja', 'nein']);

/**
 * Konjunktionaladverbien that open a second Hauptsatz with V2
 * (…, trotzdem fahren wir …). Mid-clause use (Wir fahren trotzdem …) has no comma.
 */
const KONJ_ADV_V2 = new Set([
  'trotzdem', 'dennoch', 'jedoch', 'allerdings', 'stattdessen', 'hingegen',
  'deshalb', 'daher', 'deswegen', 'darum',
  'außerdem', 'zudem', 'ferner',
  'somit', 'folglich', 'demnach', 'infolgedessen',
  'dann', 'danach', 'sonst', 'immerhin', 'nichtsdestotrotz',
]);

const REL_PRON = new Set(['der', 'die', 'das', 'den', 'dem', 'dessen', 'deren', 'denen']);

const REL_PREPS = new Set([
  'in', 'an', 'auf', 'für', 'mit', 'von', 'bei', 'aus', 'nach', 'zu',
  'über', 'unter', 'durch', 'ohne', 'um', 'gegen', 'seit',
]);

const PERSON = /^(ich|du|er|sie|es|wir|ihr|Sie|man)$/i;

const MAIN_FINITE = new Set([
  'würde', 'würden', 'würdest', 'könnte', 'könnten', 'könntest', 'hätte', 'hätten', 'hättest',
  'müsste', 'müssten', 'sollte', 'sollten', 'solltet', 'wäre', 'wären', 'wärst',
  'bin', 'bist', 'ist', 'sind', 'seid', 'sei', 'seien', 'war', 'waren', 'warst', 'wart', 'wird', 'werden', 'wurde', 'wurden', 'worden',
  'habe', 'hast', 'hat', 'haben', 'hatte', 'hatten',
  'kann', 'kannst', 'können', 'konnte', 'konnten', 'konntest',
  'muss', 'musst', 'müssen', 'musste', 'mussten',
  'soll', 'sollst', 'sollen', 'sollte', 'sollten', 'solltet',
  'will', 'willst', 'wollen', 'wollte', 'wollten',
  'mag', 'mögen', 'mochte', 'darf', 'dürfen', 'durfte',
  'bleibe', 'bleibt', 'bleiben', 'gehe', 'geht', 'gehen', 'ging', 'komme', 'kommt', 'kommen', 'kam',
  'fahre', 'fährt', 'fahren', 'fuhr', 'mache', 'macht', 'machen', 'nahm', 'nehme', 'nimmt', 'nehmen',
  'gebe', 'gibt', 'geben', 'gab', 'finde', 'findet', 'finden', 'fand',
  'arbeite', 'arbeitet', 'arbeiten', 'lerne', 'lernt', 'lernen', 'lernte', 'kaufe', 'kauft', 'kaufen',
  'bestand', 'besteht', 'bestehen', 'fällt', 'fiel', 'reagieren', 'beginnt', 'beginnen', 'beginne',
  'informiere', 'informiert', 'rufe', 'ruft', 'melde', 'meldet', 'schreib', 'schreibt', 'schreiben',
  'treffen', 'trifft', 'warte', 'wartet', 'warten', 'fahr',
  'ruf', 'bleib', 'komm', 'geh', 'iss', 'essen', 'wandern',
  'vorbei', 'anfangen', 'starten', 'bestanden', 'gelingt', 'gelingen', 'steigen', 'wächst', 'wachsen',
  'genesen', 'dauert', 'dauern', 'stattfindet', 'stattfinden', 'verfügbar', 'bedeutet', 'kostet',
  'denkt', 'denken', 'glaube', 'glaubt', 'sagt', 'sagte', 'meint', 'hofft', 'behauptet', 'bestätigt',
  'merkt', 'hört', 'höre', 'weiß', 'wissen', 'fragt', 'fragen', 'erkundigt', 'prüfen', 'prüft', 'möchte',
  'gibt', 'geben', 'trinke', 'trinkt', 'spart', 'informiert', 'schult', 'liest',
  'erklärt', 'packt', 'verschreibt', 'investiert', 'melden', 'bietet', 'diskutiert', 'zeigt',
  'kündigt', 'bleibe', 'geht', 'kommt', 'arbeitet', 'kocht', 'schläft', 'präsentiert',
  'diskutieren', 'telefoniert', 'trainiert', 'reist', 'sitzt', 'traf', 'planen', 'behandelt',
  'wohne', 'vertraue', 'gebucht', 'verabschiedet', 'danke', 'dauerte', 'stand', 'gibt',
  'regnet', 'regnete', 'scheint', 'schneit', 'funktioniert', 'klappt', 'stimmt', 'passt',
  'hilft', 'helfen', 'half', 'bekommt', 'bekommen', 'bekam', 'nimmt', 'nehmen',
  'ruft', 'ruft', 'läuft', 'lief', 'schläft', 'schlafen', 'gewinnt', 'verliert',
  'blieb', 'bleiben', 'sah', 'lag', 'saß', 'sprach', 'schrieb', 'hielt', 'rief', 'anrief',
  'begann', 'gewann', 'verlor', 'trank', 'flog', 'zog', 'wuchs', 'schien',
  'lebte', 'lebten', 'tanzte', 'tanzten', 'spielte', 'spielten', 'wohnte', 'wohnten',
  'eintrat', 'betrat', 'betreten',
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
 * Broad finite-verb guess for Konjunktionaladverb V2 (hilft, bleibt, blieb …).
 * @param {string} w
 * @return {boolean}
 */
function looksLikeFiniteVerb(w) {
  if (isMainFinite(w)) return true;
  const raw = String(w || '');
  const s = lw(raw);
  if (!s || PERSON.test(s)) return false;
  // Mid-sentence capitals are nouns/names (Vollzeit, Land), not finite verbs
  if (/^[A-ZÄÖÜ]/.test(raw)) return false;
  // Short strong-past / sein forms
  if (/^(kam|gab|las|aß|sah|tat|lag|saß|warf|sang|trank|flog|zog|wuchs|schien|blieb|ging|fand|half|rief|seid|warst|wart)$/.test(s)) {
    return true;
  }
  if (s.length < 4) return false;
  if (/^(nicht|mit|seit|laut|wert|erst|oft|jetzt|dort|hier|sonst|etwas|nichts|manchmal|heute|morgen|gestern|gern|gerne|schon|noch|auch|nur|sehr|fast|bald|dann|denn|aber|oder|und)$/.test(s)) {
    return false;
  }
  if (/^(der|die|das|den|dem|des|ein|eine|einer|einem|einen|eines)$/.test(s)) return false;
  if (REL_PREPS.has(s)) return false;
  // Strong past: anrief, eintrat, betrat, … (avoid *and/*ang — Land, Gang)
  if (/(?:ief|ahm|ong|uss|ieß|traf|trat|rief)$/i.test(s)) return true;
  return /(?:en|eln|ern|t|st|te|ten|test|tet)$/i.test(s)
    && !/(?:heit|keit|ung|schaft|tion|ität|nis)$/i.test(s);
}

/** @param {string} w */
function isFiniteGuess(w) {
  return isMainFinite(w) || looksLikeFiniteVerb(w);
}

/**
 * True when sentence-initial als/seit/… opens a Nebensatz (not Als Abgeordneter / Seit dem …).
 * @param {string[]} words
 * @return {boolean}
 */
function opensWithSubordinateClause(words) {
  const first = lw(words[0] || '');
  if (K2_V1_STARTERS.has(first)) return true;
  if (!SUBORD_AT_0.has(first)) return false;

  const second = String(words[1] || '');
  const secondLw = lw(second);

  // Seit dem Konzert … / Bis zum … — preposition + article
  if ((first === 'seit' || first === 'seitdem' || first === 'bis' || first === 'während')
    && /^(der|die|das|dem|den|des|einem|einer|eines|zum|zur)$/i.test(secondLw)) {
    return false;
  }

  // Als Abgeordneter / Als Kind … — role; Als Maria anrief, … — temporal (≥2 finites)
  if (first === 'als' && second && second[0] === second[0].toUpperCase() && !PERSON.test(second)) {
    let finites = 0;
    for (let i = 1; i < words.length; i++) {
      if (isFiniteGuess(words[i])) finites += 1;
    }
    return finites >= 2;
  }

  return true;
}

/**
 * Comma after the first Nebensatz finite when a second finite opens the Hauptsatz.
 * @param {string[]} words
 * @return {number|null}
 */
function commaAfterV1Subordinate(words) {
  const k2 = K2_V1_STARTERS.has(lw(words[0]));
  const finites = [];
  for (let i = k2 ? 0 : 1; i < words.length; i++) {
    if (isFiniteGuess(words[i])) finites.push(i);
  }

  // Wäre ich reich, würde ich … — comma before the second finite
  if (k2 && finites.length >= 2) {
    return finites[1] - 1;
  }

  // Wenn ihr müde seid, solltet … / Als wir lebten, lernte …
  if (finites.length >= 2) {
    return finites[0];
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
    if (!before) continue;

    let firstComma = -1;
    // Die Stadt, in der ich wohne, …
    if (REL_PREPS.has(lw(before)) && i >= 2) {
      firstComma = i - 2;
    } else if (before !== before.toLowerCase()) {
      // Der Minister, dessen … / Die Professorin, die …
      firstComma = i - 1;
    } else {
      continue;
    }

    let relVerbIdx = -1;
    for (let j = i + 1; j < words.length; j++) {
      if (looksLikeFiniteVerb(words[j])) {
        relVerbIdx = j;
        break;
      }
    }
    if (relVerbIdx === -1) continue;

    for (let k = relVerbIdx + 1; k < words.length; k++) {
      if (looksLikeFiniteVerb(words[k])) {
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
  if (opensWithSubordinateClause(ws)) {
    const c = commaAfterV1Subordinate(ws);
    if (c !== null && c >= 0) commas.add(c);
  }

  for (let i = 0; i < ws.length; i++) {
    const w = lw(ws[i]);

    // Ja, … / Nein, … when not the last token (incl. after „?“ in mini-dialogues)
    if (ANSWER_PARTICLE_JA_NEIN.has(w) && i < ws.length - 1) {
      commas.add(i);
    }
    // Doch, ich … — Antwortpartikel (capitalized); mid adversative „doch“ uses COORD_COMMA
    if (w === 'doch' && i < ws.length - 1 && String(ws[i])[0] === 'D') {
      commas.add(i);
    }

    if (i === 0) continue;

    if (COORD_COMMA.has(w)) {
      commas.add(i - 1);
      continue;
    }

    // Es regnet, trotzdem fahren/hilft … — not: Wir fahren trotzdem …
    if (KONJ_ADV_V2.has(w) && i + 1 < ws.length && looksLikeFiniteVerb(ws[i + 1])) {
      commas.add(i - 1);
      continue;
    }

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
  // Infer on core words (`.`/`?`/`!` are fixed punct, not chips) — same as DragDrop.
  const raw = Array.isArray(question?.words) ? question.words : [];
  const core = raw.filter((w) => !/^[.?!]$/.test(String(w)));
  return inferDropboxCommas(core, hint, question?.commas);
}
