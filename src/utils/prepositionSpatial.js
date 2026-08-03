/**
 * Maps local- and Wechsel-preposition questions to a spatial scene id for the cube hint.
 */

const SPATIAL_TOPICS = new Set([
  'LOKALPRÄPOSITIONENA2',
  'LOKALEPRÄPOSITIONENB1',
  'LOKALEPRÄPOSITIONENB2',
  'WECHSELPRÄPOSITIONEN',
  'WECHSELPRÄPOSITIONENA2',
]);

const WECHSEL_TOPICS = new Set([
  'WECHSELPRÄPOSITIONEN',
  'WECHSELPRÄPOSITIONENA2',
]);

/** @type {Record<string, string>} */
const LOKAL_ANSWER_SCENE = {
  hinter: 'hinter',
  vor: 'vor',
  neben: 'neben',
  gegenüber: 'gegenüber',
  zwischen: 'zwischen',
  unter: 'unter',
  auf: 'auf',
  an: 'an',
  durch: 'durch',
  aus: 'aus',
  links: 'links',
  rechts: 'rechts',
  geradeaus: 'geradeaus',
  hinten: 'hinten',
  vorne: 'vorne',
  'auf der rechten seite': 'rechte-seite',
  'auf der linken seite': 'linke-seite',
};

const WECHSEL_PREPS = [
  'zwischen',
  'hinter',
  'neben',
  'unter',
  'über',
  'vor',
  'auf',
  'an',
  'in',
];

/**
 * @param {string} raw
 * @return {string}
 */
function norm(raw) {
  return String(raw ?? '').trim().toLowerCase();
}

/**
 * @param {string} prompt
 * @return {'über-above'|'über-across'}
 */
function disambiguateUeber(prompt) {
  const p = norm(prompt);
  if (/hängt|liegt\s+über|über\s+der\s+tür/i.test(p)) return 'über-above';
  if (/brücke|straße|geh|gehen|fahr/i.test(p)) return 'über-across';
  return 'über-above';
}

/**
 * @param {string} prompt
 * @return {boolean|undefined}
 */
function movementFromPrompt(prompt) {
  const p = norm(prompt);
  const wohin = /wohin|bewegung|akk|legst du|stellst du|hängst du|gehst du|fährst du|kommen die|wohin\s/i.test(
    p,
  );
  const wo = /wo\?|\bwo\s+(ist|sind|hängt|steht|liegt|sitzt|befindet|arbeitest|wohnst|bist|wartest)|\bort\b|ort\s*—|ort\)|dativ/i.test(
    p,
  );
  if (wohin && !wo) return true;
  if (wo && !wohin) return false;
  return undefined;
}

/**
 * @param {string} article
 * @return {boolean|undefined}
 */
function movementFromArticle(article) {
  if (['den', 'die', 'das'].includes(article)) return true;
  if (['dem', 'der'].includes(article)) return false;
  if (article === 'einer' || article === 'einem') return false;
  return undefined;
}

/**
 * @param {string} answer
 * @param {string} prompt
 * @return {?string}
 */
function resolveWechselScene(answer, prompt) {
  const a = norm(answer);
  const p = norm(prompt);
  if (!a) return null;

  if (a === 'nach' || a.startsWith('nach ')) return 'nach-hin';
  if (a.startsWith('bei ')) return 'bei-wo';

  /** @type {Record<string, string>} */
  const contracted = {
    ins: 'in-hin',
    im: 'in-wo',
    aufs: 'auf-hin',
    ans: 'an-hin',
    am: 'an-wo',
  };
  if (contracted[a]) return contracted[a];

  const promptMove = movementFromPrompt(prompt);

  for (const prep of WECHSEL_PREPS) {
    if (a === prep) {
      const move = promptMove ?? false;
      return `${prep}-${move ? 'hin' : 'wo'}`;
    }
  }

  const m = a.match(
    /^(in|auf|an|über|unter|hinter|vor|neben|zwischen)\s+(den|dem|der|die|das|einer|einem)\b/,
  );
  if (m) {
    const prep = m[1];
    const art = m[2];
    let move = promptMove ?? movementFromArticle(art);
    if (move === undefined) move = ['den', 'die', 'das'].includes(art);
    if (prep === 'in' && art === 'den' && /wo\?|ort/i.test(p)) move = false;
    return `${prep}-${move ? 'hin' : 'wo'}`;
  }

  return null;
}

/**
 * @param {?{ topic?: string, prompt?: string, correct?: string|string[] }} question
 * @return {?string}
 */
export function resolveSpatialScene(question) {
  if (!question?.topic || !SPATIAL_TOPICS.has(question.topic)) return null;

  const correct = Array.isArray(question.correct)
    ? question.correct[0]
    : question.correct;
  const key = norm(correct);
  if (!key) return null;

  if (WECHSEL_TOPICS.has(question.topic)) {
    return resolveWechselScene(correct, question.prompt || '');
  }

  if (key === 'über') return disambiguateUeber(question.prompt || '');

  return LOKAL_ANSWER_SCENE[key] || null;
}

export function hasSpatialHint(question) {
  return resolveSpatialScene(question) != null;
}
