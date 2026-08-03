/**
 * Per-sentence accepted answers and contextual hints for B1 conjunction input-text.
 * Avoids listing syntactically invalid synonyms and accepts interchangeable forms at runtime.
 */

/** @param {string} primary */
function weilDaAccepted(primary) {
  const p = String(primary).trim();
  if (/^weil$/i.test(p)) return ['weil', 'Weil', 'da', 'Da'];
  if (/^da$/i.test(p)) return ['da', 'Da', 'weil', 'Weil'];
  return [p];
}

/** @param {string} primary */
function obwohlObschonAccepted(primary) {
  const p = String(primary).trim();
  if (/^obwohl$/i.test(p)) return ['obwohl', 'Obwohl', 'obschon', 'Obschon'];
  if (/^obschon$/i.test(p)) return ['obschon', 'Obschon', 'obwohl', 'Obwohl'];
  return [p];
}

/** @param {string} primary */
function wennFallsAccepted(primary) {
  return ['wenn', 'Wenn', 'falls', 'Falls'];
}

/**
 * Kausalsatz: denn = Hauptsatz; weil/da = Nebensatz (often interchangeable).
 * @param {string} correct
 */
function kausalsatzAccepted(correct) {
  const c = String(correct).trim();
  if (/^denn$/i.test(c)) return [c];
  return weilDaAccepted(c);
}

/** @param {string} correct */
function kausalsatzHint(correct) {
  const c = String(correct).trim();
  if (/^denn$/i.test(c)) return 'Kausalsatz — denn';
  return 'Kausalsatz — weil/da';
}

/** @param {string} correct */
function konzessivAccepted(correct) {
  const c = String(correct).trim();
  if (/^trotzdem$/i.test(c)) return [c];
  return obwohlObschonAccepted(c);
}

/** @param {string} correct */
function konzessivHint(correct) {
  const c = String(correct).trim();
  if (/^trotzdem$/i.test(c)) return 'Konzessivsatz — trotzdem';
  return 'Konzessivsatz — obwohl/obschon';
}

/** @param {string} correct */
function finalsatzAccepted(correct) {
  return [String(correct).trim()];
}

/** @param {string} correct */
function finalsatzHint(correct) {
  const c = String(correct).trim().toLowerCase();
  if (c === 'um') return 'Finalsatz — um';
  if (c === 'damit') return 'Finalsatz — damit';
  return 'Finalsatz';
}

/** @param {string} correct */
function konditionalsatzAccepted(correct) {
  const c = String(correct).trim();
  if (/^sobald$/i.test(c)) return [c, c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()];
  if (/^(wenn|falls)$/i.test(c)) return wennFallsAccepted(c);
  return [c];
}

/** @param {string} correct */
function konditionalsatzHint(correct) {
  const c = String(correct).trim().toLowerCase();
  if (c === 'sobald') return 'Konditionalsatz — sobald';
  if (c === 'wenn' || c === 'falls') return 'Konditionalsatz — wenn/falls';
  return 'Konditionalsatz';
}

const HANDLERS = {
  KAUSALSATZ: { accepted: kausalsatzAccepted, hint: kausalsatzHint },
  KONZESSIVSATZB1: { accepted: konzessivAccepted, hint: konzessivHint },
  FINALSATZ: { accepted: finalsatzAccepted, hint: finalsatzHint },
  KONDITIONALSATZ: { accepted: konditionalsatzAccepted, hint: konditionalsatzHint },
};

/**
 * @param {string} topic
 * @param {string} correct
 * @return {string[]}
 */
export function inputTextAccepted(topic, correct) {
  const h = HANDLERS[topic];
  if (!h) return [String(correct).trim()];
  return [...new Set(h.accepted(correct))];
}

/**
 * @param {string} topic
 * @param {string} correct
 * @return {string}
 */
export function inputTextConjunctionHint(topic, correct) {
  const h = HANDLERS[topic];
  if (!h) return '';
  return h.hint(correct);
}
