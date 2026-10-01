/**
 * B1 Plusquamperfekt — hatte/war + Partizip II; nachdem / bevor / als.
 * 50 select-one + 50 input-text + 50 dropbox (eine Komma-Struktur: NS, HS).
 *
 * Rules (audit 2026-09-01):
 * - Real Plusquamperfekt = Hilfsverb + Partizip II (not bare hatte + NP).
 * - Full articles in gap + dropbox words.
 * - Conj distractors: no competing temporal (Bevor≠Als≠Nachdem).
 * - Dropbox words unique (no duplicate chips); subjects differ across clauses.
 */

import { options4 } from './b1-select-one-shared.mjs';

/** Non-competing conj distractors (not nachdem/bevor/als). */
const CONJ_DIST = ['Weil', 'Obwohl', 'Damit', 'Während'];

/**
 * @typedef {{
 *   signal: 'nachdem'|'bevor'|'als',
 *   focus: 'conj'|'aux'|'part',
 *   gap: string,
 *   correct: string,
 *   pool: string[],
 *   hint: string,
 *   words: string[],
 *   commaAfter: number,
 * }} Item
 */

/** @type {Item[]} */
const ITEMS = [
  // —— nachdem + Plusquamperfekt im Nebensatz (20) ——
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem Anna gegessen ___, schrieb sie eine E-Mail.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Nachdem', 'Anna', 'gegessen', 'hatte', 'schrieb', 'sie', 'eine', 'E-Mail'],
    commaAfter: 3,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem Tom angekommen ___, begann die Sitzung.',
    correct: 'war', pool: ['ist', 'hatte', 'hat', 'waren'],
    hint: 'Plusquamperfekt — Hilfsverb sein',
    words: ['Nachdem', 'Tom', 'angekommen', 'war', 'begann', 'die', 'Sitzung'],
    commaAfter: 3,
  },
  {
    signal: 'nachdem', focus: 'part',
    gap: 'Nachdem Lisa den Vertrag ___ hatte, freute sich Markus.',
    correct: 'unterschrieben', pool: ['unterschreibt', 'unterschrieb', 'unterschreiben', 'unterschreibend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Nachdem', 'Lisa', 'den', 'Vertrag', 'unterschrieben', 'hatte', 'freute', 'sich', 'Markus'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem wir die Prüfung bestanden ___, feierten alle.',
    correct: 'hatten', pool: ['haben', 'waren', 'hat', 'hatte'],
    hint: 'Plusquamperfekt — Hilfsverb Pl.',
    words: ['Nachdem', 'wir', 'die', 'Prüfung', 'bestanden', 'hatten', 'feierten', 'alle'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'conj',
    gap: '___ Paul angerufen hatte, antwortete Maria sofort.',
    correct: 'Nachdem', pool: CONJ_DIST,
    hint: 'Konjunktion — Vorzeitigkeit',
    words: ['Nachdem', 'Paul', 'angerufen', 'hatte', 'antwortete', 'Maria', 'sofort'],
    commaAfter: 3,
  },
  {
    signal: 'nachdem', focus: 'part',
    gap: 'Nachdem der Chef die Unterlagen ___ hatte, unterschrieb er.',
    correct: 'geprüft', pool: ['prüft', 'prüfte', 'prüfen', 'prüfend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Nachdem', 'der', 'Chef', 'die', 'Unterlagen', 'geprüft', 'hatte', 'unterschrieb', 'er'],
    commaAfter: 6,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem Lena das Formular ausgefüllt ___, gab sie es ab.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Nachdem', 'Lena', 'das', 'Formular', 'ausgefüllt', 'hatte', 'gab', 'sie', 'es', 'ab'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'part',
    gap: 'Nachdem Max den Zug ___ hatte, suchte er ein Taxi.',
    correct: 'verpasst', pool: ['verpasstet', 'verpasste', 'verpassen', 'verpasstest'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Nachdem', 'Max', 'den', 'Zug', 'verpasst', 'hatte', 'suchte', 'er', 'ein', 'Taxi'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'conj',
    gap: '___ Nora eingecheckt hatte, ging sie zum Gate.',
    correct: 'Nachdem', pool: CONJ_DIST,
    hint: 'Konjunktion — Vorzeitigkeit',
    words: ['Nachdem', 'Nora', 'eingecheckt', 'hatte', 'ging', 'sie', 'zum', 'Gate'],
    commaAfter: 3,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem die Gäste eingetroffen ___, begann das Essen.',
    correct: 'waren', pool: ['sind', 'hatten', 'war', 'haben'],
    hint: 'Plusquamperfekt — sein Pl.',
    words: ['Nachdem', 'die', 'Gäste', 'eingetroffen', 'waren', 'begann', 'das', 'Essen'],
    commaAfter: 4,
  },
  {
    signal: 'nachdem', focus: 'part',
    gap: 'Nachdem Jonas die Rechnung ___ hatte, verließ er das Café.',
    correct: 'bezahlt', pool: ['bezahltet', 'bezahlte', 'bezahlen', 'bezahltst'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Nachdem', 'Jonas', 'die', 'Rechnung', 'bezahlt', 'hatte', 'verließ', 'er', 'das', 'Café'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem ich die Nachricht gelesen ___, rief Karl zurück.',
    correct: 'hatte', pool: ['habe', 'war', 'bin', 'hat'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Nachdem', 'ich', 'die', 'Nachricht', 'gelesen', 'hatte', 'rief', 'Karl', 'zurück'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'conj',
    gap: '___ unser Team trainiert hatte, startete das Finale.',
    correct: 'Nachdem', pool: CONJ_DIST,
    hint: 'Konjunktion — Vorzeitigkeit',
    words: ['Nachdem', 'unser', 'Team', 'trainiert', 'hatte', 'startete', 'das', 'Finale'],
    commaAfter: 4,
  },
  {
    signal: 'nachdem', focus: 'part',
    gap: 'Nachdem Lara den Termin ___ hatte, kam sie pünktlich.',
    correct: 'vereinbart', pool: ['vereinbartet', 'vereinbarte', 'vereinbaren', 'vereinbartest'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Nachdem', 'Lara', 'den', 'Termin', 'vereinbart', 'hatte', 'kam', 'sie', 'pünktlich'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem die Kinder eingeschlafen ___, las der Vater ein Buch.',
    correct: 'waren', pool: ['sind', 'hatten', 'war', 'haben'],
    hint: 'Plusquamperfekt — sein Pl.',
    words: ['Nachdem', 'die', 'Kinder', 'eingeschlafen', 'waren', 'las', 'der', 'Vater', 'ein', 'Buch'],
    commaAfter: 4,
  },
  {
    signal: 'nachdem', focus: 'part',
    gap: 'Nachdem Sam die E-Mails ___ hatte, schaltete er den Laptop aus.',
    correct: 'beantwortet', pool: ['beantwortete', 'beantworten', 'beantwortest', 'beantwortend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Nachdem', 'Sam', 'die', 'E-Mails', 'beantwortet', 'hatte', 'schaltete', 'er', 'den', 'Laptop', 'aus'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'conj',
    gap: '___ Nina umgezogen war, richtete sie die Wohnung ein.',
    correct: 'Nachdem', pool: CONJ_DIST,
    hint: 'Konjunktion — Vorzeitigkeit',
    words: ['Nachdem', 'Nina', 'umgezogen', 'war', 'richtete', 'sie', 'die', 'Wohnung', 'ein'],
    commaAfter: 3,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem Max den Antrag gestellt ___, wartete er monatelang.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Nachdem', 'Max', 'den', 'Antrag', 'gestellt', 'hatte', 'wartete', 'er', 'monatelang'],
    commaAfter: 5,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem die Firma expandiert ___, stellte sie Personal ein.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Nachdem', 'die', 'Firma', 'expandiert', 'hatte', 'stellte', 'sie', 'Personal', 'ein'],
    commaAfter: 4,
  },
  {
    signal: 'nachdem', focus: 'aux',
    gap: 'Nachdem wir angekommen ___, holte uns ein Taxi ab.',
    correct: 'waren', pool: ['sind', 'hatten', 'war', 'haben'],
    hint: 'Plusquamperfekt — sein Pl.',
    words: ['Nachdem', 'wir', 'angekommen', 'waren', 'holte', 'uns', 'ein', 'Taxi', 'ab'],
    commaAfter: 3,
  },

  // —— bevor (Plusquamperfekt im Hauptsatz) (15) ——
  {
    signal: 'bevor', focus: 'aux',
    gap: 'Bevor Tim ankam, ___ Lisa schon gekocht.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Vorzeitigkeit',
    words: ['Bevor', 'Tim', 'ankam', 'hatte', 'Lisa', 'schon', 'gekocht'],
    commaAfter: 2,
  },
  {
    signal: 'bevor', focus: 'conj',
    gap: '___ Markus eintrat, hatte Sara bereits gedeckt.',
    correct: 'Bevor', pool: CONJ_DIST,
    hint: 'Konjunktion — bevor',
    words: ['Bevor', 'Markus', 'eintrat', 'hatte', 'Sara', 'bereits', 'gedeckt'],
    commaAfter: 2,
  },
  {
    signal: 'bevor', focus: 'part',
    gap: 'Bevor der Kurs begann, hatte Emma die Texte schon ___.',
    correct: 'gelesen', pool: ['liest', 'las', 'lesen', 'lesend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Bevor', 'der', 'Kurs', 'begann', 'hatte', 'Emma', 'die', 'Texte', 'schon', 'gelesen'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'aux',
    gap: 'Bevor Lena ausging, ___ sie die Tür abgeschlossen.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Bevor', 'Lena', 'ausging', 'hatte', 'sie', 'die', 'Tür', 'abgeschlossen'],
    commaAfter: 2,
  },
  {
    signal: 'bevor', focus: 'conj',
    gap: '___ das Meeting startete, hatte Jan die Folien geprüft.',
    correct: 'Bevor', pool: CONJ_DIST,
    hint: 'Konjunktion — bevor',
    words: ['Bevor', 'das', 'Meeting', 'startete', 'hatte', 'Jan', 'die', 'Folien', 'geprüft'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'part',
    gap: 'Bevor die Gäste kamen, hatte Pia alles ___.',
    correct: 'vorbereitet', pool: ['vorbereitetet', 'vorbereitete', 'vorbereiten', 'vorbereitest'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Bevor', 'die', 'Gäste', 'kamen', 'hatte', 'Pia', 'alles', 'vorbereitet'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'aux',
    gap: 'Bevor die Familie abreiste, ___ sie ihre Schlüssel abgegeben.',
    correct: 'hatte', pool: ['hat', 'waren', 'hatten', 'war'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Bevor', 'die', 'Familie', 'abreiste', 'hatte', 'sie', 'ihre', 'Schlüssel', 'abgegeben'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'conj',
    gap: '___ der Zug abfuhr, hatte Lea ihr Gepäck verstaut.',
    correct: 'Bevor', pool: CONJ_DIST,
    hint: 'Konjunktion — bevor',
    words: ['Bevor', 'der', 'Zug', 'abfuhr', 'hatte', 'Lea', 'ihr', 'Gepäck', 'verstaut'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'part',
    gap: 'Bevor Ben schlief, hatte er die Lichter ___.',
    correct: 'ausgeschaltet', pool: ['ausschaltet', 'schaltete', 'ausschalten', 'ausschaltete'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Bevor', 'Ben', 'schlief', 'hatte', 'er', 'die', 'Lichter', 'ausgeschaltet'],
    commaAfter: 2,
  },
  {
    signal: 'bevor', focus: 'aux',
    gap: 'Bevor die Prüfung begann, ___ alle Kandidaten gewartet.',
    correct: 'hatten', pool: ['haben', 'waren', 'hatte', 'war'],
    hint: 'Plusquamperfekt — Hilfsverb Pl.',
    words: ['Bevor', 'die', 'Prüfung', 'begann', 'hatten', 'alle', 'Kandidaten', 'gewartet'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'conj',
    gap: '___ Clara telefonierte, hatte sie die Notizen gemacht.',
    correct: 'Bevor', pool: CONJ_DIST,
    hint: 'Konjunktion — bevor',
    words: ['Bevor', 'Clara', 'telefonierte', 'hatte', 'sie', 'die', 'Notizen', 'gemacht'],
    commaAfter: 2,
  },
  {
    signal: 'bevor', focus: 'part',
    gap: 'Bevor das Geschäft schloss, hatte Omar noch Brot ___.',
    correct: 'gekauft', pool: ['kauft', 'kaufte', 'kaufen', 'kaufend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Bevor', 'das', 'Geschäft', 'schloss', 'hatte', 'Omar', 'noch', 'Brot', 'gekauft'],
    commaAfter: 3,
  },
  {
    signal: 'bevor', focus: 'aux',
    gap: 'Bevor Mia und Tom heirateten, ___ sie lange zusammengewohnt.',
    correct: 'hatten', pool: ['haben', 'waren', 'hatte', 'war'],
    hint: 'Plusquamperfekt — Hilfsverb Pl.',
    words: ['Bevor', 'Mia', 'und', 'Tom', 'heirateten', 'hatten', 'sie', 'lange', 'zusammengewohnt'],
    commaAfter: 4,
  },
  {
    signal: 'bevor', focus: 'conj',
    gap: '___ Felix kündigte, hatte er schon eine neue Stelle gefunden.',
    correct: 'Bevor', pool: CONJ_DIST,
    hint: 'Konjunktion — bevor',
    words: ['Bevor', 'Felix', 'kündigte', 'hatte', 'er', 'schon', 'eine', 'neue', 'Stelle', 'gefunden'],
    commaAfter: 2,
  },
  {
    signal: 'bevor', focus: 'aux',
    gap: 'Bevor der Regen kam, ___ wir die Wäsche reingeholt.',
    correct: 'hatten', pool: ['haben', 'waren', 'hatte', 'war'],
    hint: 'Plusquamperfekt — Hilfsverb Pl.',
    words: ['Bevor', 'der', 'Regen', 'kam', 'hatten', 'wir', 'die', 'Wäsche', 'reingeholt'],
    commaAfter: 3,
  },

  // —— als + Plusquamperfekt (15) ——
  {
    signal: 'als', focus: 'aux',
    gap: 'Als Maria anrief, ___ Tom schon gegessen.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Vorzeitigkeit',
    words: ['Als', 'Maria', 'anrief', 'hatte', 'Tom', 'schon', 'gegessen'],
    commaAfter: 2,
  },
  {
    signal: 'als', focus: 'conj',
    gap: '___ Julia kam, hatte Boris bereits bestellt.',
    correct: 'Als', pool: CONJ_DIST,
    hint: 'Konjunktion — als (Vergangenheit)',
    words: ['Als', 'Julia', 'kam', 'hatte', 'Boris', 'bereits', 'bestellt'],
    commaAfter: 2,
  },
  {
    signal: 'als', focus: 'part',
    gap: 'Als der Film anfing, hatte Anna schon Popcorn ___.',
    correct: 'gekauft', pool: ['kauft', 'kaufte', 'kaufen', 'kaufend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Als', 'der', 'Film', 'anfing', 'hatte', 'Anna', 'schon', 'Popcorn', 'gekauft'],
    commaAfter: 3,
  },
  {
    signal: 'als', focus: 'aux',
    gap: 'Als wir ankamen, ___ das Konzert schon begonnen.',
    correct: 'hatte', pool: ['hat', 'war', 'ist', 'haben'],
    hint: 'Plusquamperfekt — Hilfsverb',
    words: ['Als', 'wir', 'ankamen', 'hatte', 'das', 'Konzert', 'schon', 'begonnen'],
    commaAfter: 2,
  },
  {
    signal: 'als', focus: 'conj',
    gap: '___ David eintrat, hatte jemand die Lichter ausgeschaltet.',
    correct: 'Als', pool: CONJ_DIST,
    hint: 'Konjunktion — als',
    words: ['Als', 'David', 'eintrat', 'hatte', 'jemand', 'die', 'Lichter', 'ausgeschaltet'],
    commaAfter: 2,
  },
  {
    signal: 'als', focus: 'part',
    gap: 'Als sie nach Hause kam, hatte jemand die Tür ___.',
    correct: 'aufgebrochen', pool: ['bricht', 'brach', 'aufbrechen', 'brechend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Als', 'sie', 'nach', 'Hause', 'kam', 'hatte', 'jemand', 'die', 'Tür', 'aufgebrochen'],
    commaAfter: 4,
  },
  {
    signal: 'als', focus: 'aux',
    gap: 'Als die Polizei kam, ___ alle Diebe schon geflohen.',
    correct: 'waren', pool: ['sind', 'hatten', 'war', 'haben'],
    hint: 'Plusquamperfekt — sein Pl.',
    words: ['Als', 'die', 'Polizei', 'kam', 'waren', 'alle', 'Diebe', 'schon', 'geflohen'],
    commaAfter: 3,
  },
  {
    signal: 'als', focus: 'conj',
    gap: '___ Ina die Küche betrat, hatte Leo schon gekocht.',
    correct: 'Als', pool: CONJ_DIST,
    hint: 'Konjunktion — als',
    words: ['Als', 'Ina', 'die', 'Küche', 'betrat', 'hatte', 'Leo', 'schon', 'gekocht'],
    commaAfter: 4,
  },
  {
    signal: 'als', focus: 'part',
    gap: 'Als er aufwachte, hatte der Sturm schon ___.',
    correct: 'nachgelassen', pool: ['lässt', 'ließ', 'nachlassen', 'lassend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Als', 'er', 'aufwachte', 'hatte', 'der', 'Sturm', 'schon', 'nachgelassen'],
    commaAfter: 2,
  },
  {
    signal: 'als', focus: 'aux',
    gap: 'Als ihr anrieft, ___ wir bereits entschieden.',
    correct: 'hatten', pool: ['haben', 'waren', 'hatte', 'war'],
    hint: 'Plusquamperfekt — Hilfsverb Pl.',
    words: ['Als', 'ihr', 'anrieft', 'hatten', 'wir', 'bereits', 'entschieden'],
    commaAfter: 2,
  },
  {
    signal: 'als', focus: 'conj',
    gap: '___ die Sonne aufging, waren alle Wanderer schon aufgebrochen.',
    correct: 'Als', pool: CONJ_DIST,
    hint: 'Konjunktion — als',
    words: ['Als', 'die', 'Sonne', 'aufging', 'waren', 'alle', 'Wanderer', 'schon', 'aufgebrochen'],
    commaAfter: 3,
  },
  {
    signal: 'als', focus: 'part',
    gap: 'Als sie den Raum betrat, hatte jemand das Fenster ___.',
    correct: 'geöffnet', pool: ['öffnet', 'öffnete', 'öffnen', 'öffnend'],
    hint: 'Plusquamperfekt — Partizip II',
    words: ['Als', 'sie', 'den', 'Raum', 'betrat', 'hatte', 'jemand', 'das', 'Fenster', 'geöffnet'],
    commaAfter: 4,
  },
  {
    signal: 'als', focus: 'aux',
    gap: 'Als der Arzt kam, ___ die Patientin schon eingeschlafen.',
    correct: 'war', pool: ['ist', 'hatte', 'hat', 'waren'],
    hint: 'Plusquamperfekt — sein',
    words: ['Als', 'der', 'Arzt', 'kam', 'war', 'die', 'Patientin', 'schon', 'eingeschlafen'],
    commaAfter: 3,
  },
  {
    signal: 'als', focus: 'conj',
    gap: '___ die Nachricht kam, hatte unsere Firma schon reagiert.',
    correct: 'Als', pool: CONJ_DIST,
    hint: 'Konjunktion — als',
    words: ['Als', 'die', 'Nachricht', 'kam', 'hatte', 'unsere', 'Firma', 'schon', 'reagiert'],
    commaAfter: 3,
  },
  {
    signal: 'als', focus: 'aux',
    gap: 'Als du mich suchtest, ___ ich schon nach Hause gegangen.',
    correct: 'war', pool: ['bin', 'hatte', 'hat', 'ist'],
    hint: 'Plusquamperfekt — sein',
    words: ['Als', 'du', 'mich', 'suchtest', 'war', 'ich', 'schon', 'nach', 'Hause', 'gegangen'],
    commaAfter: 3,
  },
];

if (ITEMS.length !== 50) {
  throw new Error(`expected 50 Plusquamperfekt items, got ${ITEMS.length}`);
}

/** @return {{prompt:string, options:string[], correct:string}[]} */
export function genPlusquamperfektB1SelectOne() {
  return ITEMS.map((it, i) => ({
    prompt: `${it.gap} (Plusquamperfekt)`,
    options: options4(it.correct, it.pool, i + 901),
    correct: it.correct,
  }));
}

/** @return {{prompt:string, correct:string, hint:string}[]} */
export function genPlusquamperfektB1InputText() {
  return ITEMS.map((it) => ({
    prompt: `Ergänze die Plusquamperfektform bzw. Konjunktion:\n\n${it.gap}`,
    correct: it.correct,
    hint: it.hint,
  }));
}

/** @return {{words:string[], commas:number[], hint:string}[]} */
export function genPlusquamperfektB1Dropbox() {
  return ITEMS.map((it) => {
    const seen = new Set();
    for (const w of it.words) {
      if (seen.has(w)) throw new Error(`duplicate word "${w}" in: ${it.words.join(' ')}`);
      seen.add(w);
    }
    if (it.commaAfter < 0 || it.commaAfter >= it.words.length - 1) {
      throw new Error(`bad commaAfter ${it.commaAfter} for: ${it.words.join(' ')}`);
    }
    return {
      words: it.words,
      commas: [it.commaAfter],
      hint: 'Plusquamperfekt — eine Komma-Stelle',
    };
  });
}
