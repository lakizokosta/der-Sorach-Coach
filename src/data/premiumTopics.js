/**
 * @fileoverview Catalogue of premium grammar topics for each CEFR level.
 *
 * The structure mirrors the original Blogger trainer:
 *   PREMIUM_TOPICS[level] is an ordered array of `{ key, name, desc }`.
 *
 * - `key`  is the canonical topic identifier used everywhere else
 *          (matching, mastery tracking, grammar hint lookup).
 * - `name` is the human-readable German title shown in the topic grid.
 * - `desc` is a short German description shown under the title.
 */

export const PREMIUM_TOPICS = {
  A1: [
    { key: 'POSSESSIVARTIKEL',      name: 'Possessivartikel',     desc: 'mein/dein/sein/ihr/unser/euer + Endungen' },
    { key: 'PLURAL',                name: 'Plural',               desc: 'Pluralformen + Artikel im Plural' },
    { key: 'VERBKONJUGATION',       name: 'Verbkonjugation',      desc: 'Präsens: ich/du/er...' },
    { key: 'ADJEKTIVDEKLINATIONA1', name: 'Adjektivdeklination',  desc: 'ein kleiner Hund / der kleine Hund' },
    { key: 'WECHSELPRÄPOSITIONEN',  name: 'Wechselpräpositionen', desc: 'in/an/auf... + Akkusativ/Dativ' },
    { key: 'DATIVA1',               name: 'Dativ',                desc: 'Wem? Dativ-Artikel' },
    { key: 'AKKUSATIVA1',           name: 'Akkusativ',            desc: 'Wen/was? Akkusativ-Artikel' },
    { key: 'ARTIKEL',               name: 'Artikel',              desc: 'der/die/das, ein/eine, kein' },
    { key: 'W-FRAGEN',              name: 'W-Fragen',             desc: 'Wer, Was, Wo, Wann, Wie...' },
    { key: 'NEGATION',              name: 'Negation',             desc: 'nicht, kein, nie...' },
    { key: 'GEGENTEILE',            name: 'Gegenteile',           desc: 'groß ↔ klein, schnell ↔ langsam' },
  ],
  A2: [
    { key: 'ANTWORTPARTIKELN',              name: 'Antwortpartikeln',     desc: 'ja, nein, doch' },
    { key: 'ADJEKTIVDEKLINATIONA2',         name: 'Adjektivdeklination',  desc: 'Endungen im Kontext' },
    { key: 'FESTEPRÄPOSITIONENA2',          name: 'Feste Präpositionen',  desc: 'warten auf, denken an' },
    { key: 'AKKUSATIVA2',                   name: 'Akkusativ',            desc: 'Objekte + Präpositionen' },
    { key: 'DATIVA2',                       name: 'Dativ',                desc: 'Wem? typische Verben' },
    { key: 'POSSESSIVARTIKELA2',            name: 'Possessivartikel',     desc: 'mein/dein/sein/ihr erweitert' },
    { key: 'KONJUNKTIONENA2',               name: 'Konjunktionen',        desc: 'weil, dass, wenn' },
    { key: 'KOMPARATIVA2',                  name: 'Komparativ',           desc: 'größer, besser' },
    { key: 'WECHSELPRÄPOSITIONENA2',        name: 'Wechselpräpositionen', desc: 'wo / wohin' },
    { key: 'PERFEKTA2',                     name: 'Perfekt',              desc: 'haben/sein + Partizip II' },
    { key: 'REFLEXIVPRONOMEN',              name: 'Reflexivpronomen',     desc: 'sich waschen' },
    { key: 'INDEFINITPRONOMEN',             name: 'Indefinitpronomen',    desc: 'man, jemand, etwas' },
    { key: 'MODALVERBENA2',                 name: 'Modalverben',          desc: 'können, müssen, wollen' },
    { key: 'GENITIVA2',                     name: 'Genitiv',              desc: 'trotz, während' },
    { key: 'NOMENPRÄPOSITIONVERBINDUNGA2',  name: 'Nomen-Präposition',    desc: 'Interesse an' },
    { key: 'TRENNBAREVERBEN',               name: 'Trennbare Verben',     desc: 'anrufen, aufstehen' },
    { key: 'TEMPORALSATZ',                  name: 'Temporalsätze',        desc: 'als, wenn, während' },
    { key: 'SUPERLATIVA2',                  name: 'Superlativ',           desc: 'am größten' },
    { key: 'PRÄTERITUMA2',                  name: 'Präteritum',           desc: 'war, hatte' },
    { key: 'LOKALPRÄPOSITIONENA2',          name: 'Lokale Präpositionen', desc: 'in, auf, unter' },
    { key: 'N-DEKLINATION',                 name: 'N-Deklination',        desc: 'der Student → des Studenten' },
  ],
  B1: [
    { key: 'ADJEKTIVDEKLINATIONB1',         name: 'Adjektivdeklination',    desc: 'fortgeschrittene Endungen' },
    { key: 'AKKUSATIVB1',                   name: 'Akkusativ',              desc: 'Akkusativ vertieft' },
    { key: 'DEMONSTRATIVARTIKEL',           name: 'Demonstrativartikel',    desc: 'dieser, jener' },
    { key: 'ERGÄNZUNGSSATZ',                name: 'Ergänzungssätze',        desc: 'dass-Sätze' },
    { key: 'FINALSATZ',                     name: 'Finalsatz',              desc: 'um...zu, damit' },
    { key: 'INDIREKTEFRAGESÄTZE',           name: 'Indirekte Fragesätze',   desc: 'ob, w-Fragen' },
    { key: 'KAUSALSATZ',                    name: 'Kausalsatz',             desc: 'weil, da' },
    { key: 'KONJUNKTIV2',                   name: 'Konjunktiv II',          desc: 'Wünsche, Irreales' },
    { key: 'KONDITIONALSATZ',               name: 'Konditionalsatz',        desc: 'wenn-Sätze' },
    { key: 'KONZESSIVSATZB1',               name: 'Konzessivsatz',          desc: 'obwohl, trotzdem' },
    { key: 'KONJUNKTIONALADVERBIEN',        name: 'Konjunktionaladverbien', desc: 'deshalb, trotzdem' },
    { key: 'LOKALEPRÄPOSITIONENB1',         name: 'Lokale Präpositionen',   desc: 'Ort und Richtung' },
    { key: 'NOMENPRÄPOSITIONVERBINDUNGB1',  name: 'Nomen-Präposition',      desc: 'Interesse an' },
    { key: 'PASSIVB1',                      name: 'Passiv',                 desc: 'werden + Partizip II' },
    { key: 'PERFEKTB1',                     name: 'Perfekt',                desc: 'Vertiefung' },
    { key: 'PRÄPOSITIONENGENITIVB1',        name: 'Genitiv-Präpositionen',  desc: 'trotz, während' },
    { key: 'PRÄPOSITIONALERGÄNZUNG',        name: 'Präpositionalergänzung', desc: 'warten auf' },
    { key: 'PRÄPOSITIONALADVERBIEN',        name: 'Pronominaladverbien',    desc: 'darauf, daran' },
    { key: 'POSSESSIVARTIKELB1',            name: 'Possessivartikel',       desc: 'komplexe Formen' },
    { key: 'PRÄPOSITIONENB1',               name: 'Präpositionen',          desc: 'Vertiefung' },
    { key: 'RELATIVSATZB1',                 name: 'Relativsätze',           desc: 'der, die, das' },
    { key: 'TRENNBAREVERBENB1',             name: 'Trennbare Verben',       desc: 'komplexe Nutzung' },
    { key: 'VERBPRÄPOSITIONVERBINDUNG',     name: 'Verb + Präposition',     desc: 'denken an, warten auf' },
    { key: 'VERNEINUNG',                    name: 'Verneinung',             desc: 'kein, nicht' },
    { key: 'VERBNOMENVERBINDUNGB1',         name: 'Verb-Nomen-Verbindung',  desc: 'eine Entscheidung treffen' },
    { key: 'VERBLASSEN',                    name: 'Verben lassen',          desc: 'lassen + Infinitiv' },
    { key: 'WORTSCHATZB1',                  name: 'Wortschatz',             desc: 'B1 Wortfelder' },
    { key: 'SPRACHBAUSTEINEB1',             name: 'Sprachbausteine',        desc: 'Texte mit Lücken – B1 Prüfungsformat' },
  ],
  B2: [
    { key: 'AKKUSATIV&DATIVOBJEKT',         name: 'Akkusativ- und Dativobjekt', desc: 'Objekte sicher unterscheiden' },
    { key: 'GENITIVB2',                     name: 'Genitiv',                    desc: 'fortgeschrittene Genitivstrukturen' },
    { key: 'FUTURI',                        name: 'Futur I',                    desc: 'Vermutung und Zukunft' },
    { key: 'KONSEKUTIVEKONJUNKTION',        name: 'Konsekutive Konjunktionen',  desc: 'sodass, so dass' },
    { key: 'KONJUNKTIONALADVERBIEN',        name: 'Konjunktionaladverbien',     desc: 'folglich, dennoch, außerdem' },
    { key: 'KONJUNKTIV2B2',                 name: 'Konjunktiv II',              desc: 'komplexe irreale Aussagen' },
    { key: 'KONZESSIVSATZB2',               name: 'Konzessivsatz',              desc: 'obwohl, obgleich' },
    { key: 'LOKALEPRÄPOSITIONENB1',         name: 'Lokale Präpositionen',       desc: 'präzise Orts- und Richtungsangaben' },
    { key: 'MODALSATZ',                     name: 'Modalsatz',                  desc: 'indem, ohne dass, statt dass' },
    { key: 'INDEFINITPRONOMEN',             name: 'Indefinitpronomen',          desc: 'jemand, niemand, etwas' },
    { key: 'INDIREKTEREDE',                 name: 'Indirekte Rede',             desc: 'Konjunktiv I und Alternativen' },
    { key: 'PRÄPOSITIONENGENITIV',          name: 'Genitiv-Präpositionen',      desc: 'trotz, während, aufgrund' },
    { key: 'PRÄPOSITIONALADVERBIENB2',      name: 'Pronominaladverbien',        desc: 'daran, darauf, womit' },
    { key: 'PARTIZIP1',                     name: 'Partizip I',                 desc: 'laufend, singend' },
    { key: 'PARTIZIP2',                     name: 'Partizip II',                desc: 'geschrieben, gemacht' },
    { key: 'PASSIVB2',                      name: 'Passiv',                     desc: 'komplexe Passivformen' },
    { key: 'PASSIVERSATZ',                  name: 'Passiversatz',               desc: 'sich lassen, sein + zu' },
    { key: 'REDEWENDUNGEN',                 name: 'Redewendungen',              desc: 'idiomatische Ausdrücke' },
    { key: 'RELATIVSATZB2',                 name: 'Relativsätze',               desc: 'komplexe Relativkonstruktionen' },
    { key: 'TEKAMOLO',                      name: 'TeKaMoLo',                   desc: 'Temporal, Kausal, Modal, Lokal' },
    { key: 'TEMPORALERNEBENSATZ',           name: 'Temporale Nebensätze',       desc: 'nachdem, bevor, seitdem' },
    { key: 'QUIZ',                          name: 'Quiz',                       desc: 'gemischte B2-Aufgaben' },
    { key: 'SPRACHBAUSTEINEB2',             name: 'Sprachbausteine',            desc: 'Texte mit Lücken – B2 Prüfungsformat' },
  ],
};

/**
 * Returns the list of topics that belong to a given CEFR level.
 *
 * @param {string} level  Level code: 'A1', 'A2', 'B1', or 'B2'.
 * @return {!Array<{key: string, name: string, desc: string}>}
 */
export function getTopicsForLevel(level) {
  return PREMIUM_TOPICS[level] || [];
}

/**
 * Returns every topic across all levels as a flat list, with the level
 * code attached to each item. Useful for the profile mastery dashboard.
 *
 * @return {!Array<{key: string, name: string, desc: string, level: string}>}
 */
export function getAllTopics() {
  const result = [];
  for (const lvl of ['A1', 'A2', 'B1', 'B2']) {
    for (const t of PREMIUM_TOPICS[lvl]) {
      result.push({ ...t, level: lvl });
    }
  }
  return result;
}
