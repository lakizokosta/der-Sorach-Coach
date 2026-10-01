/**
 * Shared input-text prompt layout:
 *   1. Visible task instruction (first line)
 *   2. Sentence with ___
 *   3. Grammar hint in YAML frontmatter (💡 Tipp) — not in parentheses
 */

export function md(id, prompt, correct, hint = '') {
  const ans = (Array.isArray(correct) ? correct : [correct]).map((c) => `  - ${c}`).join('\n');
  const hintLine = hint ? `hint: ${hint}\n` : '';
  return `---\nid: ${id}\ntype: input-text\n${hintLine}correct:\n${ans}\n---\n\n${prompt}\n`;
}

/** Strip theme prefix and trailing parenthetical hint. */
export function bareSentence(raw) {
  return String(raw || '')
    .replace(/^\[[^\]]+]\s+/, '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}

/** @return {{ sentence: string, inner: string }} */
export function extractParentheticalHint(raw) {
  const stripped = String(raw || '').replace(/^\[[^\]]+]\s+/, '');
  const m = stripped.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  if (!m) return { sentence: stripped.trim(), inner: '' };
  return { sentence: m[1].trimEnd(), inner: m[2].trim() };
}

export function formatInputTextPrompt(instruction, sentence) {
  const s = String(sentence || '').trim();
  return instruction ? `${instruction}\n\n${s}` : s;
}

export function closedSetHint(label, correct, options, max = 5) {
  const all = [String(correct), ...((options || []).filter((o) => o !== correct))];
  const sorted = [...new Set(all.map((s) => String(s).trim()))]
    .slice(0, max)
    .sort((a, b) => a.localeCompare(b, 'de'));
  return `${label} — ${sorted.join(' / ')}`;
}

/** Visible task line per grammar topic. */
export const TASK_INSTRUCTION = {
  AKKUSATIVA1: 'Ergänze die Akkusativform:',
  AKKUSATIVA2: 'Ergänze die Akkusativform:',
  AKKUSATIVB1: 'Ergänze die Akkusativform:',
  DATIVA1: 'Ergänze die Dativform:',
  DATIVA2: 'Ergänze die Dativform:',
  GENITIVA2: 'Ergänze die Genitivform:',
  GENITIVB2: 'Ergänze die Genitivform:',
  ARTIKEL: 'Ergänze den Artikel:',
  POSSESSIVARTIKEL: 'Ergänze den Possessivartikel:',
  POSSESSIVARTIKELA2: 'Ergänze den Possessivartikel:',
  POSSESSIVARTIKELB1: 'Ergänze den Possessivartikel:',
  PLURAL: 'Ergänze die Pluralform:',
  VERBKONJUGATION: 'Ergänze die Präsensform des Verbs:',
  ADJEKTIVDEKLINATIONA1: 'Ergänze die Adjektivendung:',
  ADJEKTIVDEKLINATIONA2: 'Ergänze die Adjektivendung:',
  ADJEKTIVDEKLINATIONB1: 'Ergänze die Adjektivendung:',
  WECHSELPRÄPOSITIONEN: 'Ergänze die Präposition (Akkusativ oder Dativ):',
  WECHSELPRÄPOSITIONENA2: 'Ergänze die Präposition (Akkusativ oder Dativ):',
  'W-FRAGEN': 'Ergänze das Fragewort:',
  NEGATION: 'Ergänze die Verneinung:',
  GEGENTEILE: 'Ergänze das Gegenteil:',
  ANTWORTPARTIKELN: 'Ergänze die Antwortpartikel:',
  KONJUNKTIONENA2: 'Ergänze die Konjunktion:',
  PERFEKTA2: 'Ergänze die Perfektform:',
  PRÄTERITUMA2: 'Ergänze die Präteritumsform:',
  MODALVERBENA2: 'Ergänze die Modalverbform:',
  REFLEXIVPRONOMEN: 'Ergänze die Reflexivform:',
  KOMPARATIVA2: 'Ergänze die Komparativform:',
  SUPERLATIVA2: 'Ergänze die Superlativform:',
  FESTEPRÄPOSITIONENA2: 'Ergänze die feste Präposition:',
  INDEFINITPRONOMEN: 'Ergänze das Indefinitpronomen:',
  NOMENPRÄPOSITIONVERBINDUNGA2: 'Ergänze die passende Präposition:',
  TRENNBAREVERBEN: 'Ergänze die Verbform (trennbares Verb):',
  TEMPORALSATZ: 'Ergänze die Konjunktion (Temporal):',
  LOKALPRÄPOSITIONENA2: 'Ergänze die Lokalpräposition:',
  'N-DEKLINATION': 'Ergänze die N-Deklination-Form:',
  PASSIVB1: 'Ergänze die Passivform:',
  PASSIVB2: 'Ergänze die Passivform:',
  PASSIVERSATZ: 'Ergänze die Passiv-Ersatzform:',
  KONJUNKTIV2: 'Ergänze die Konjunktiv-II-Form:',
  KONJUNKTIV2B2: 'Ergänze die Konjunktiv-II-Form:',
  FUTURI: 'Ergänze die Futurform:',
  PARTIZIP1: 'Ergänze das Partizip I:',
  PARTIZIP2: 'Ergänze das Partizip II:',
  INDIREKTEREDE: 'Ergänze die Form (Indirekte Rede):',
  RELATIVSATZB1: 'Ergänze das Relativpronomen:',
  RELATIVSATZB2: 'Ergänze das Relativpronomen:',
  RELATIVSATZERWEITERTB2: 'Ergänzen Sie das Relativpronomen bzw. Relativadverb:',
  KAUSALSATZ: 'Ergänze die Konjunktion (Kausal):',
  KONDITIONALSATZ: 'Ergänze die Konjunktion (Konditional):',
  KONZESSIVSATZB1: 'Ergänze die Konjunktion (Konzessiv):',
  KONZESSIVSATZB2: 'Ergänze die Konjunktion (Konzessiv):',
  FINALSATZ: 'Ergänze die Konjunktion (Final):',
  ERGÄNZUNGSSATZ: 'Ergänze die Konjunktion (Ergänzung):',
  INDIREKTEFRAGESÄTZE: 'Ergänze das Fragewort (indirekte Frage):',
  KONJUNKTIONALADVERBIEN: 'Ergänze das Konjunktionaladverb:',
  KONSEKUTIVEKONJUNKTION: 'Ergänze die konsekutive Konjunktion:',
  PRÄPOSITIONENGENITIVB1: 'Ergänze die Genitiv-Präposition:',
  PRÄPOSITIONENGENITIV: 'Ergänze die Genitiv-Präposition:',
  PRÄPOSITIONALERGÄNZUNG: 'Ergänze die Präposition (Verb + Präposition):',
  PRÄPOSITIONALADVERBIEN: 'Ergänze das Pronominaladverb:',
  PRÄPOSITIONALADVERBIENB2: 'Ergänze das Pronominaladverb:',
  PRÄPOSITIONENB1: 'Ergänze die Präposition:',
  LOKALEPRÄPOSITIONENB1: 'Ergänze die Lokalpräposition:',
  LOKALEPRÄPOSITIONENB2: 'Ergänze die Lokalpräposition:',
  NOMENPRÄPOSITIONVERBINDUNGB1: 'Ergänze die passende Präposition:',
  DEMONSTRATIVARTIKEL: 'Ergänze den Demonstrativartikel:',
  PERFEKTB1: 'Ergänze die Perfektform:',
  PLUSQUAMPERFEKTB1: 'Ergänze die Plusquamperfektform bzw. Konjunktion:',
  TRENNBAREVERBENB1: 'Ergänze die Verbform (trennbares Verb):',
  VERNEINUNG: 'Ergänze die Verneinung:',
  VERBNOMENVERBINDUNGB1: 'Ergänze die Verb-Nomen-Verbindung:',
  VERBLASSEN: 'Ergänze die lassen-Form:',
  WORTSCHATZB1: 'Ergänze das passende Wort:',
  MODALSATZ: 'Ergänze die Konjunktion (Modal):',
  REDEWENDUNGEN: 'Ergänze die Redewendung:',
  TEMPORALERNEBENSATZ: 'Ergänze die Konjunktion (Temporal):',
};

export function taskInstruction(topic, { caseLabel } = {}) {
  if (caseLabel === 'Dativ') return 'Ergänze das Dativobjekt (Wem?):';
  if (caseLabel === 'Akkusativ') return 'Ergänze das Akkusativobjekt (Wen?):';
  return TASK_INSTRUCTION[topic] || 'Ergänze die Lücke:';
}

/**
 * @param {object} p
 * @param {string} p.topic
 * @param {string} p.rawPrompt  Bank line (may include theme + parentheses)
 * @param {string} [p.caseLabel]  Dativ | Akkusativ (B2 Objekt)
 * @param {string} p.hint  Frontmatter hint for 💡 Tipp
 * @return {{ prompt: string, hint: string }}
 */
export function buildInputTextPrompt({ topic, rawPrompt, caseLabel, hint }) {
  const { sentence } = extractParentheticalHint(rawPrompt);
  const instruction = taskInstruction(topic, { caseLabel });
  return {
    prompt: formatInputTextPrompt(instruction, sentence),
    hint: hint || '',
  };
}
