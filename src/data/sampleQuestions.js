/**
 * @fileoverview Local sample question bank for Der SprachCoach.
 *
 * The original Blogger build pulled questions from the Blogger feeds API.
 * To make this Vue rebuild fully self-contained and runnable offline we
 * ship a representative dataset that exercises every supported question
 * type:
 *
 *   - 'mc'       : Multiple choice (one correct answer of 4).
 *   - 'sort'     : Drag & drop word order (with optional TeKaMoLo codes).
 *   - 'fill'     : Lückentext — type the missing word.
 *   - 'lesen'    : Reading comprehension with several gaps under one text.
 *   - 'sprach'   : Sprachbausteine — inline dropdowns inside a paragraph.
 *
 * Each entry mirrors the shape consumed by `<QuestionRenderer>`:
 *   {
 *     id:      string,         // stable id (used as Vue :key)
 *     level:   'A1'|'A2'|'B1'|'B2',
 *     topic:   string,         // canonical topic key (same as PREMIUM_TOPICS)
 *     type:    'mc'|'sort'|'fill'|'lesen'|'sprach',
 *     title:   string,         // shown above the question
 *     options? : Array<{text, correct}>,        // for 'mc'
 *     words?   : string[],                      // ordered solution for 'sort'
 *     codes?   : string[],                      // optional TeKaMoLo codes
 *     sentence?: string,                        // for 'fill' / 'lesen' / 'sprach' (contains ___ or [n])
 *     correct? : string[],                      // for 'fill' (any matches)
 *     hint?    : string,                        // for 'fill'
 *     gaps?    : { [n: string]: { o: string[], c: string } }, // 'lesen' / 'sprach'
 *   }
 */

export const SAMPLE_QUESTIONS = [
  // ─────────────────────────────────────────────────────────────────────────
  //  A1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a1-art-1', level: 'A1', topic: 'ARTIKEL', type: 'mc',
    title: '___ Tisch ist neu.',
    options: [
      { text: 'Der', correct: true },
      { text: 'Die', correct: false },
      { text: 'Das', correct: false },
      { text: 'Den', correct: false },
    ],
  },
  {
    id: 'a1-art-2', level: 'A1', topic: 'ARTIKEL', type: 'mc',
    title: '___ Lampe leuchtet hell.',
    options: [
      { text: 'Die', correct: true },
      { text: 'Der', correct: false },
      { text: 'Das', correct: false },
      { text: 'Den', correct: false },
    ],
  },
  {
    id: 'a1-akk-1', level: 'A1', topic: 'AKKUSATIVA1', type: 'mc',
    title: 'Ich sehe ___ Mann.',
    options: [
      { text: 'den', correct: true },
      { text: 'der', correct: false },
      { text: 'dem', correct: false },
      { text: 'des', correct: false },
    ],
  },
  {
    id: 'a1-dat-1', level: 'A1', topic: 'DATIVA1', type: 'mc',
    title: 'Ich helfe ___ Mann.',
    options: [
      { text: 'dem', correct: true },
      { text: 'den', correct: false },
      { text: 'der', correct: false },
      { text: 'des', correct: false },
    ],
  },
  {
    id: 'a1-konj-1', level: 'A1', topic: 'VERBKONJUGATION', type: 'mc',
    title: 'Du ___ heute Brot.',
    options: [
      { text: 'kaufst', correct: true },
      { text: 'kaufe', correct: false },
      { text: 'kauft', correct: false },
      { text: 'kaufen', correct: false },
    ],
  },
  {
    id: 'a1-pl-1', level: 'A1', topic: 'PLURAL', type: 'mc',
    title: 'Plural von "das Kind"?',
    options: [
      { text: 'die Kinder', correct: true },
      { text: 'die Kinde', correct: false },
      { text: 'die Kinds', correct: false },
      { text: 'die Kindern', correct: false },
    ],
  },
  {
    id: 'a1-neg-1', level: 'A1', topic: 'NEGATION', type: 'mc',
    title: 'Ich habe ___ Zeit.',
    options: [
      { text: 'keine', correct: true },
      { text: 'nicht', correct: false },
      { text: 'kein', correct: false },
      { text: 'keinen', correct: false },
    ],
  },
  {
    id: 'a1-wf-1', level: 'A1', topic: 'W-FRAGEN', type: 'mc',
    title: '___ kommst du? — Aus Berlin.',
    options: [
      { text: 'Woher', correct: true },
      { text: 'Wo', correct: false },
      { text: 'Wohin', correct: false },
      { text: 'Wer', correct: false },
    ],
  },
  {
    id: 'a1-poss-1', level: 'A1', topic: 'POSSESSIVARTIKEL', type: 'mc',
    title: 'Das ist ___ Vater. (ich)',
    options: [
      { text: 'mein', correct: true },
      { text: 'meine', correct: false },
      { text: 'meinen', correct: false },
      { text: 'meiner', correct: false },
    ],
  },
  {
    id: 'a1-geg-1', level: 'A1', topic: 'GEGENTEILE', type: 'mc',
    title: 'Gegenteil von "groß"?',
    options: [
      { text: 'klein', correct: true },
      { text: 'lang', correct: false },
      { text: 'kurz', correct: false },
      { text: 'dünn', correct: false },
    ],
  },
  {
    id: 'a1-fill-1', level: 'A1', topic: 'AKKUSATIVA1', type: 'fill',
    sentence: 'Ich kaufe ___ Apfel.',
    correct: ['einen'],
    hint: 'Akkusativ mask. für "ein"',
  },
  {
    id: 'a1-fill-2', level: 'A1', topic: 'VERBKONJUGATION', type: 'fill',
    sentence: 'Er ___ jeden Tag um 7 Uhr auf. (aufstehen)',
    correct: ['steht'],
    hint: 'Trennbares Verb — Präfix ans Ende!',
  },
  {
    id: 'a1-sort-1', level: 'A1', topic: 'SATZSTELLUNGA2', type: 'sort',
    words: ['Heute', 'gehe', 'ich', 'ins', 'Kino'],
  },
  {
    id: 'a1-sort-2', level: 'A1', topic: 'AKKUSATIVA1', type: 'sort',
    words: ['Ich', 'kaufe', 'einen', 'roten', 'Apfel'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  A2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a2-perf-1', level: 'A2', topic: 'PERFEKTA2', type: 'mc',
    title: 'Ich ___ gestern ins Kino gegangen.',
    options: [
      { text: 'bin', correct: true },
      { text: 'habe', correct: false },
      { text: 'war', correct: false },
      { text: 'hatte', correct: false },
    ],
  },
  {
    id: 'a2-modal-1', level: 'A2', topic: 'MODALVERBENA2', type: 'mc',
    title: 'Ich ___ heute arbeiten.',
    options: [
      { text: 'muss', correct: true },
      { text: 'musst', correct: false },
      { text: 'müsst', correct: false },
      { text: 'müssen', correct: false },
    ],
  },
  {
    id: 'a2-konj-1', level: 'A2', topic: 'KONJUNKTIONENA2', type: 'mc',
    title: 'Ich bleibe zu Hause, ___ ich krank bin.',
    options: [
      { text: 'weil', correct: true },
      { text: 'denn', correct: false },
      { text: 'aber', correct: false },
      { text: 'oder', correct: false },
    ],
  },
  {
    id: 'a2-komp-1', level: 'A2', topic: 'KOMPARATIVA2', type: 'mc',
    title: 'Anna ist ___ als Tom.',
    options: [
      { text: 'größer', correct: true },
      { text: 'groß', correct: false },
      { text: 'am größten', correct: false },
      { text: 'gross', correct: false },
    ],
  },
  {
    id: 'a2-refl-1', level: 'A2', topic: 'REFLEXIVPRONOMEN', type: 'mc',
    title: 'Ich freue ___ auf die Ferien.',
    options: [
      { text: 'mich', correct: true },
      { text: 'mir', correct: false },
      { text: 'sich', correct: false },
      { text: 'dich', correct: false },
    ],
  },
  {
    id: 'a2-trenn-1', level: 'A2', topic: 'TRENNBAREVERBEN', type: 'mc',
    title: 'Er ___ mich morgen ___.',
    options: [
      { text: 'ruft ... an', correct: true },
      { text: 'anruft', correct: false },
      { text: 'ruftan', correct: false },
      { text: 'rufen an', correct: false },
    ],
  },
  {
    id: 'a2-part-1', level: 'A2', topic: 'ANTWORTPARTIKELN', type: 'mc',
    title: '"Hast du keinen Hunger?" — "___, ich habe Hunger!"',
    options: [
      { text: 'Doch', correct: true },
      { text: 'Ja', correct: false },
      { text: 'Nein', correct: false },
      { text: 'Schon', correct: false },
    ],
  },
  {
    id: 'a2-sup-1', level: 'A2', topic: 'SUPERLATIVA2', type: 'mc',
    title: 'Der ICE ist ___ Zug in Deutschland.',
    options: [
      { text: 'der schnellste', correct: true },
      { text: 'der schneller', correct: false },
      { text: 'am schnellsten', correct: false },
      { text: 'der schnellsten', correct: false },
    ],
  },
  {
    id: 'a2-fill-1', level: 'A2', topic: 'PRÄTERITUMA2', type: 'fill',
    sentence: 'Als Kind ___ ich oft im Park gespielt. (haben)',
    correct: ['habe'],
    hint: 'Perfekt mit haben — ich-Form.',
  },
  {
    id: 'a2-fill-2', level: 'A2', topic: 'KONJUNKTIONENA2', type: 'fill',
    sentence: 'Ich glaube, ___ er recht hat.',
    correct: ['dass'],
    hint: 'Verb am Ende → welche Konjunktion?',
  },
  {
    id: 'a2-sort-1', level: 'A2', topic: 'SATZSTELLUNGA2', type: 'sort',
    words: ['Morgen', 'fahre', 'ich', 'mit', 'dem', 'Bus', 'nach', 'Berlin'],
    codes: ['T', '_', '_', 'M', 'M', 'M', 'L', 'L'],
  },
  {
    id: 'a2-sort-2', level: 'A2', topic: 'PERFEKTA2', type: 'sort',
    words: ['Wir', 'sind', 'gestern', 'ins', 'Kino', 'gegangen'],
  },
  {
    id: 'a2-sprach-1', level: 'A2', topic: 'SPRACHBAUSTEINEB1', type: 'sprach',
    title: 'Sprachbaustein: Wegbeschreibung',
    sentence: 'Gehen Sie [0] zur Ampel und biegen Sie dann [1] ab. Das Restaurant ist [2] rechten Seite.',
    gaps: {
      0: { o: ['geradeaus', 'gerade aus', 'gleich', 'sofort'], c: 'geradeaus' },
      1: { o: ['links', 'linke', 'die Links', 'linken'],       c: 'links' },
      2: { o: ['auf der', 'auf dem', 'auf das', 'an die'],      c: 'auf der' },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  B1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'b1-rel-1', level: 'B1', topic: 'RELATIVSATZB1', type: 'mc',
    title: 'Der Mann, ___ dort steht, ist mein Lehrer.',
    options: [
      { text: 'der', correct: true },
      { text: 'den', correct: false },
      { text: 'dem', correct: false },
      { text: 'dessen', correct: false },
    ],
  },
  {
    id: 'b1-rel-2', level: 'B1', topic: 'RELATIVSATZB1', type: 'mc',
    title: 'Das Buch, ___ ich gelesen habe, war spannend.',
    options: [
      { text: 'das', correct: true },
      { text: 'der', correct: false },
      { text: 'dem', correct: false },
      { text: 'dessen', correct: false },
    ],
  },
  {
    id: 'b1-pass-1', level: 'B1', topic: 'PASSIVB1', type: 'mc',
    title: 'Das Auto ___ gerade repariert.',
    options: [
      { text: 'wird', correct: true },
      { text: 'ist', correct: false },
      { text: 'wurde', correct: false },
      { text: 'hat', correct: false },
    ],
  },
  {
    id: 'b1-konj2-1', level: 'B1', topic: 'KONJUNKTIV2', type: 'mc',
    title: 'Wenn ich Zeit ___, würde ich verreisen.',
    options: [
      { text: 'hätte', correct: true },
      { text: 'habe', correct: false },
      { text: 'hatte', correct: false },
      { text: 'haben würde', correct: false },
    ],
  },
  {
    id: 'b1-kon-1', level: 'B1', topic: 'KONZESSIVSATZB1', type: 'mc',
    title: 'Er ging spazieren, ___ es regnete.',
    options: [
      { text: 'obwohl', correct: true },
      { text: 'trotzdem', correct: false },
      { text: 'deshalb', correct: false },
      { text: 'weil', correct: false },
    ],
  },
  {
    id: 'b1-gen-1', level: 'B1', topic: 'PRÄPOSITIONENGENITIVB1', type: 'mc',
    title: '___ des Regens blieben wir zu Hause.',
    options: [
      { text: 'Wegen', correct: true },
      { text: 'Mit', correct: false },
      { text: 'Bei', correct: false },
      { text: 'Trotz', correct: false },
    ],
  },
  {
    id: 'b1-finale-1', level: 'B1', topic: 'FINALSATZ', type: 'mc',
    title: 'Sie lernt viel, ___ die Prüfung zu bestehen.',
    options: [
      { text: 'um', correct: true },
      { text: 'damit', correct: false },
      { text: 'weil', correct: false },
      { text: 'dass', correct: false },
    ],
  },
  {
    id: 'b1-fill-1', level: 'B1', topic: 'KONJUNKTIV2', type: 'fill',
    sentence: 'An deiner Stelle ___ ich nicht so viel arbeiten.',
    correct: ['würde'],
    hint: 'Konjunktiv II Höflichkeit — würde + Infinitiv.',
  },
  {
    id: 'b1-fill-2', level: 'B1', topic: 'PASSIVB1', type: 'fill',
    sentence: 'Das Haus ___ von Architekten gebaut.',
    correct: ['wurde'],
    hint: 'Vorgangspassiv im Präteritum.',
  },
  {
    id: 'b1-sort-1', level: 'B1', topic: 'RELATIVSATZB1', type: 'sort',
    words: ['Die', 'Frau,', 'die', 'dort', 'steht,', 'ist', 'meine', 'Tante'],
  },
  {
    id: 'b1-lesen-1', level: 'B1', topic: 'SPRACHBAUSTEINEB1', type: 'lesen',
    title: 'Leseverstehen: E-Mail an den Vermieter',
    sentence:
      'Sehr geehrter Herr Müller, ich [0] mich an Sie, weil in meiner Wohnung seit drei Tagen die Heizung [1]. Ich bitte Sie [2], jemanden zur Reparatur zu schicken.',
    gaps: {
      0: { o: ['wende', 'gehe', 'sehe', 'mache'], c: 'wende' },
      1: { o: ['ausgefallen ist', 'gefallen ist', 'ist abgefallen', 'ist nicht'], c: 'ausgefallen ist' },
      2: { o: ['darum', 'davon', 'damit', 'darauf'], c: 'darum' },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  B2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'b2-gen-1', level: 'B2', topic: 'PRÄPOSITIONENGENITIV', type: 'mc',
    title: '___ des schlechten Wetters fand die Veranstaltung statt.',
    options: [
      { text: 'Trotz', correct: true },
      { text: 'Wegen', correct: false },
      { text: 'Bei', correct: false },
      { text: 'Mit', correct: false },
    ],
  },
  {
    id: 'b2-konj2-1', level: 'B2', topic: 'KONJUNKTIV2B2', type: 'mc',
    title: 'Er tut so, ___ er alles wüsste.',
    options: [
      { text: 'als ob', correct: true },
      { text: 'wenn', correct: false },
      { text: 'damit', correct: false },
      { text: 'obwohl', correct: false },
    ],
  },
  {
    id: 'b2-pass-1', level: 'B2', topic: 'PASSIVB2', type: 'mc',
    title: 'Die Brücke ist 2010 ___ ___.',
    options: [
      { text: 'gebaut worden', correct: true },
      { text: 'gebaut geworden', correct: false },
      { text: 'bauen worden', correct: false },
      { text: 'gebaut gewesen', correct: false },
    ],
  },
  {
    id: 'b2-modal-1', level: 'B2', topic: 'MODALSATZ', type: 'mc',
    title: 'Sie verbessert ihre Aussprache, ___ sie täglich übt.',
    options: [
      { text: 'indem', correct: true },
      { text: 'ohne dass', correct: false },
      { text: 'damit', correct: false },
      { text: 'während', correct: false },
    ],
  },
  {
    id: 'b2-konsek-1', level: 'B2', topic: 'KONSEKUTIVEKONJUNKTION', type: 'mc',
    title: 'Es war so kalt, ___ wir zu Hause blieben.',
    options: [
      { text: 'dass', correct: true },
      { text: 'weil', correct: false },
      { text: 'obwohl', correct: false },
      { text: 'damit', correct: false },
    ],
  },
  {
    id: 'b2-tekamolo-1', level: 'B2', topic: 'TEKAMOLO', type: 'sort',
    words: ['Er', 'fährt', 'morgen', 'wegen', 'der', 'Konferenz', 'mit', 'dem', 'Zug', 'nach', 'Berlin'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'M', 'M', 'L', 'L'],
  },
  {
    id: 'b2-fill-1', level: 'B2', topic: 'INDIREKTEREDE', type: 'fill',
    sentence: 'Er sagte, er ___ keine Zeit. (haben — Konjunktiv I)',
    correct: ['habe'],
    hint: 'Konjunktiv I, 3. Person Singular.',
  },
  {
    id: 'b2-fill-2', level: 'B2', topic: 'PARTIZIP2', type: 'fill',
    sentence: 'Das von allen ___ Buch liegt auf dem Tisch. (lesen)',
    correct: ['gelesene'],
    hint: 'Partizip II als Adjektiv (-e Endung nach das).',
  },
  {
    id: 'b2-sprach-1', level: 'B2', topic: 'SPRACHBAUSTEINEB2', type: 'sprach',
    title: 'Sprachbaustein: Bewerbung',
    sentence:
      'Hiermit bewerbe ich [0] um die Stelle als Projektleiter. Ich habe [1] Ihrer Anzeige in der Zeitung erfahren. [2] meiner mehrjährigen Erfahrung bringe ich die nötigen Qualifikationen mit.',
    gaps: {
      0: { o: ['mich', 'mir', 'ich', 'sich'], c: 'mich' },
      1: { o: ['aus', 'von', 'durch', 'bei'], c: 'aus' },
      2: { o: ['Aufgrund', 'Wegen', 'Trotz', 'Während'], c: 'Aufgrund' },
    },
  },
  {
    id: 'b2-lesen-1', level: 'B2', topic: 'SPRACHBAUSTEINEB2', type: 'lesen',
    title: 'Leseverstehen: formelle Mitteilung',
    sentence:
      'Die Geschäftsleitung [0] mit, dass aufgrund von Bauarbeiten der Eingang vorübergehend [1] wird. Wir bitten unsere Kunden [2] Ihr Verständnis.',
    gaps: {
      0: { o: ['teilt', 'sagt', 'spricht', 'erzählt'], c: 'teilt' },
      1: { o: ['verlegt', 'gelegt', 'gelegen', 'verlogen'], c: 'verlegt' },
      2: { o: ['um', 'für', 'bei', 'an'], c: 'um' },
    },
  },
];

/**
 * Returns all questions for a given CEFR level.
 *
 * @param {string} level  Level code: 'A1' | 'A2' | 'B1' | 'B2'.
 * @return {!Array<Object>} Matching question objects.
 */
export function getQuestionsByLevel(level) {
  return SAMPLE_QUESTIONS.filter((q) => q.level === level);
}

/**
 * Returns all questions for a given CEFR level filtered by topic key.
 * Uses the topic key in a loose match (canonical comparison with
 * A1/A2/B1/B2 suffix stripped) so questions labelled with the base topic
 * (e.g. AKKUSATIV) also match level-specific keys (e.g. AKKUSATIVA1).
 *
 * @param {string} level     Level code: 'A1' | 'A2' | 'B1' | 'B2'.
 * @param {string} topicKey  Canonical topic key (case-insensitive).
 * @return {!Array<Object>} Matching question objects.
 */
export function getQuestionsByTopic(level, topicKey) {
  if (!topicKey) return getQuestionsByLevel(level);
  const target = String(topicKey).toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
  return SAMPLE_QUESTIONS.filter((q) => {
    if (q.level !== level) return false;
    const qTopic = String(q.topic || '').toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
    return qTopic === target;
  });
}
