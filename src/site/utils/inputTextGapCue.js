/**
 * Always-visible base form for input-text gaps (shown as (…) after the sentence).
 * Pedagogical details (case, gender, …) stay in `hint` / Tipp.
 */

const TOPIC_LABEL_RE =
  /^(N-Deklination|Adjektivdeklination|Akkusativ|Dativ|Genitiv|Nominativ|Relativsatz|Passiv|Perfekt|Präteritum|Konjunktiv|Artikel|Plural|Possessiv|Konjugation|Modalverben|Infinitiv|Futur|Komparativ|Superlativ|Wechselpräposition|Präposition|Partizip|Konzessiv|Finalsatz|Kausalsatz|Temporalsatz|Konditionalsatz|Negation)(\b|$)/i;

function firstLexicalSegment(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  const afterDash = s.includes('—') ? s.split('—').slice(1).join('—').trim() : s;
  const m = afterDash.match(/^([^,(]+)/);
  return (m ? m[1] : afterDash).trim().replace(/\s+/g, ' ');
}

function isTopicOnlyLabel(s) {
  const t = String(s || '').trim();
  if (!t || t.includes('—')) return false;
  return TOPIC_LABEL_RE.test(t);
}

/**
 * Capitalise N-Deklination noun lemmas that were stored lowercase (e.g. junge → Junge).
 * @param {string} cue
 * @param {string} hint
 * @return {string}
 */
function formatCue(cue, hint) {
  const c = String(cue || '').trim();
  if (!c) return '';
  if (
    /^N-Deklination/i.test(String(hint || '')) &&
    !/\s/.test(c) &&
    /^[a-zäöü]/.test(c)
  ) {
    return c.charAt(0).toUpperCase() + c.slice(1);
  }
  return c;
}

/**
 * @param {{ lemma?: string, hint?: string, prompt?: string }} question
 * @returns {string} cue to show in parentheses, or ''
 */
export function resolveInputTextGapCue(question = {}) {
  const hint = String(question.hint || '').trim();
  const lemma = String(question.lemma || '').trim();
  if (lemma) return formatCue(lemma, hint);

  // "Thema — lemma, Akk." / "Komparativ — groß" / "Artikel — Negation: kein, neutr."
  if (hint.includes('—')) {
    let fromHint = firstLexicalSegment(hint);
    // "… — Negation: kein" → lexical part after colon
    if (fromHint && isTopicOnlyLabel(fromHint) && fromHint.includes(':')) {
      const afterColon = fromHint.split(':').slice(1).join(':').trim();
      fromHint = firstLexicalSegment(afterColon) || afterColon;
    }
    if (fromHint && !isTopicOnlyLabel(fromHint)) return formatCue(fromHint, hint);
  }

  // "Gegenteil von groß"
  const gegenteil = hint.match(/^Gegenteil von\s+(.+)$/i);
  if (gegenteil) return formatCue(gegenteil[1].trim(), hint);

  // "Plural: Kind"
  const plural = hint.match(/^Plural:\s*(.+)$/i);
  if (plural) return formatCue(firstLexicalSegment(plural[1]), hint);

  // "Präsens + Verb spielen" / "Perfekt + Verb gehen"
  const verb = hint.match(/\bVerb\s+([a-zäöüß]+)\b/i);
  if (verb) return formatCue(verb[1], hint);

  // Trailing (…) still on prompt (parser usually strips into hint)
  const prompt = String(question.prompt || '');
  const m = prompt.match(/\(\s*([^)]+?)\s*\)\s*$/);
  if (m) {
    const trailing = firstLexicalSegment(m[1]);
    if (trailing && !isTopicOnlyLabel(trailing)) return formatCue(trailing, hint || m[1]);
  }

  return '';
}
