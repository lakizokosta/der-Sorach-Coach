/**
 * B2 Relativsätze II — Präpositionen, was, wo(r)-, Genitiv.
 * 50 select-one + 50 input-text (22 Genitiv insgesamt).
 */

import { options4, pickDistractors, shuffle } from './b2-select-one-shared.mjs';

/** @typedef {[string, string, string[]]} SO */

/** Genitiv dessen/deren — 11 unique for select-one (cycled to fill). */
const GENITIV_SO = /** @type {SO[]} */ ([
  ['Der Forscher, ___ Studie international zitiert wird, hält heute einen Vortrag.', 'dessen', ['deren', 'denen', 'dem', 'den']],
  ['Die Autorin, ___ Romane preisgekrönt sind, gibt ein Interview.', 'deren', ['dessen', 'denen', 'dem', 'den']],
  ['Das Unternehmen, ___ Umsatz stark gestiegen ist, expandiert.', 'dessen', ['deren', 'denen', 'dem', 'den']],
  ['Die Studierenden, ___ Ergebnisse überzeugen, erhalten ein Stipendium.', 'deren', ['dessen', 'denen', 'dem', 'den']],
  ['Der Politiker, ___ Vorschlag abgelehnt wurde, bleibt hartnäckig.', 'dessen', ['deren', 'denen', 'dem', 'den']],
  ['Die Expertin, ___ Analyse wir folgen, warnt vor Risiken.', 'deren', ['dessen', 'denen', 'dem', 'den']],
  ['Das Projekt, ___ Finanzierung unsicher ist, wird verschoben.', 'dessen', ['deren', 'denen', 'dem', 'den']],
  ['Die Kollegen, ___ Unterstützung entscheidend war, werden gelobt.', 'deren', ['dessen', 'denen', 'dem', 'den']],
  ['Der Anwalt, ___ Argumente überzeugen, plädiert für Freispruch.', 'dessen', ['deren', 'denen', 'dem', 'den']],
  ['Die Institution, ___ Ruf gefährdet ist, reagiert sofort.', 'deren', ['dessen', 'denen', 'dem', 'den']],
  ['Der Bericht, ___ Schlussfolgerungen klar sind, liegt vor.', 'dessen', ['deren', 'denen', 'dem', 'den']],
]);

/** Präposition + Relativpronomen */
const PREP_SO = /** @type {SO[]} */ ([
  ['Die Stadt, in ___ ich studiert habe, hat sich stark verändert.', 'der', ['die', 'dem', 'den', 'das']],
  ['Das Thema, über ___ wir debattieren, ist kontrovers.', 'das', ['die', 'der', 'dem', 'den']],
  ['Der Partner, mit ___ wir kooperieren, sitzt in Wien.', 'dem', ['den', 'der', 'die', 'das']],
  ['Die Firma, bei ___ Sie angestellt sind, expandiert.', 'der', ['die', 'dem', 'den', 'das']],
  ['Das Archiv, aus ___ die Akte stammt, ist digitalisiert.', 'dem', ['den', 'der', 'das', 'die']],
  ['Die Methode, mit ___ wir arbeiten, ist empirisch geprüft.', 'der', ['die', 'dem', 'den', 'das']],
  ['Der Bericht, auf ___ sie sich bezieht, ist veraltet.', 'den', ['dem', 'der', 'die', 'das']],
  ['Die Kollegin, zu ___ ich gehe, kennt den Fall.', 'der', ['die', 'dem', 'den', 'das']],
  ['Das Problem, an ___ wir arbeiten, ist komplex.', 'dem', ['den', 'der', 'die', 'das']],
  ['Die Menschen, für ___ wir uns einsetzen, brauchen Hilfe.', 'die', ['denen', 'deren', 'dem', 'den']],
  ['Der Kurs, an ___ Sie teilnehmen, beginnt montags.', 'dem', ['den', 'der', 'die', 'das']],
  ['Die Regeln, nach ___ wir uns richten, sind klar.', 'denen', ['deren', 'dessen', 'dem', 'die']],
  ['Das Dokument, von ___ die Rede ist, fehlt noch.', 'dem', ['den', 'der', 'die', 'das']],
  ['Die Entscheidung, gegen ___ er protestiert, bleibt bestehen.', 'die', ['der', 'dem', 'denen', 'das']],
]);

/** was-Relativsätze */
const WAS_SO = /** @type {SO[]} */ ([
  ['Alles, ___ Sie sagen, wird protokolliert.', 'was', ['das', 'welche', 'wo', 'worauf']],
  ['Nichts, ___ er verspricht, ist verbindlich.', 'was', ['das', 'welche', 'wo', 'womit']],
  ['Etwas, ___ uns überrascht hat, kam gestern heraus.', 'was', ['das', 'welche', 'wo', 'woran']],
  ['Das Einzige, ___ zählt, ist das Ergebnis.', 'was', ['das', 'welche', 'wo', 'wodurch']],
  ['Vieles, ___ früher galt, gilt heute nicht mehr.', 'was', ['das', 'welche', 'wo', 'wovon']],
  ['Das, ___ Sie vorschlagen, klingt realistisch.', 'was', ['das', 'welche', 'wo', 'worüber']],
  ['Alles, ___ wir besprochen haben, bleibt vertraulich.', 'was', ['das', 'welche', 'wo', 'womit']],
  ['Nichts, ___ sie behauptet, lässt sich belegen.', 'was', ['das', 'welche', 'wo', 'worauf']],
  ['Etwas, ___ ich nicht erwartet hatte, ist eingetreten.', 'was', ['das', 'welche', 'wo', 'wodurch']],
  ['Das Beste, ___ passieren konnte, ist eingetreten.', 'was', ['das', 'welche', 'wo', 'woran']],
  ['Vieles, ___ uns beschäftigt, betrifft die Finanzierung.', 'was', ['das', 'welche', 'wo', 'wovon']],
  ['Das Schlimmste, ___ passieren könnte, ist ein Ausfall.', 'was', ['das', 'welche', 'wo', 'worüber']],
]);

/** wo / wo(r)- Relativadverbien */
const WO_SO = /** @type {SO[]} */ ([
  ['Die Stadt, ___ ich aufgewachsen bin, liegt an der Küste.', 'wo', ['was', 'worin', 'wodurch', 'welche']],
  ['Das Thema, ___ wir uns oft streiten, ist heikel.', 'worüber', ['wo', 'was', 'womit', 'woran']],
  ['Der Punkt, ___ ich mich beziehe, steht auf Seite zehn.', 'worauf', ['wo', 'was', 'womit', 'wodurch']],
  ['Das Werkzeug, ___ wir die Analyse machen, ist neu.', 'womit', ['wo', 'was', 'worauf', 'woran']],
  ['Der Unfall, ___ mehrere Personen verletzt wurden, wird untersucht.', 'wodurch', ['wo', 'was', 'womit', 'worauf']],
  ['Das Problem, ___ wir uns noch nicht ausgetauscht haben, ist ernst.', 'worüber', ['wo', 'was', 'womit', 'woran']],
  ['Die Situation, ___ er sich befindet, ist schwierig.', 'worin', ['wo', 'was', 'wodurch', 'worauf']],
  ['Der Aspekt, ___ ich mich erinnere, war entscheidend.', 'woran', ['wo', 'was', 'womit', 'worauf']],
  ['Die Annahme, ___ unser Konzept ausgeht, ist umstritten.', 'wovon', ['wo', 'was', 'worüber', 'wodurch']],
  ['Das Ziel, ___ wir hinarbeiten, ist ambitioniert.', 'worauf', ['wo', 'was', 'womit', 'woran']],
  ['Die Stadt, ___ Sie umziehen möchten, ist teuer.', 'wohin', ['wo', 'woher', 'was', 'worin']],
  ['Die Region, ___ die Touristen anreisen, braucht Hotels.', 'woher', ['wo', 'wohin', 'was', 'worauf']],
  ['Das Verfahren, ___ wir vorgehen, ist standardisiert.', 'wonach', ['wo', 'was', 'womit', 'worauf']],
]);

/**
 * Build 50 select-one: 11 Gen + 14 Präp + 12 was + 13 wo = 50
 * Bei was immer Distraktor „das“ (klassische Falle).
 * @return {{prompt:string, options:string[], correct:string}[]}
 */
export function genRelativsatzErweitertB2SelectOne() {
  const items = [
    ...GENITIV_SO, // 11
    ...PREP_SO, // 14
    ...WAS_SO, // 12
    ...WO_SO, // 13
  ];
  if (items.length !== 50) throw new Error(`expected 50 SO items, got ${items.length}`);
  return items.map(([p, c, pool], i) => {
    const seed = i + 701;
    let options;
    if (c === 'was' && pool.includes('das')) {
      const rest = pool.filter((x) => x !== c && x !== 'das');
      options = shuffle([c, 'das', ...pickDistractors(rest, c, 2, seed)], seed);
    } else {
      options = options4(c, pool, seed);
    }
    return {
      prompt: `${p} (Relativsatz)`,
      options,
      correct: c,
    };
  });
}

/** Input-text banks: [promptWithoutHint, correct, hintLabel] */
const GENITIV_IN = [
  ['Der Forscher, ___ Studie zitiert wird, hält einen Vortrag.', 'dessen', 'Genitiv mask./neutr.'],
  ['Die Autorin, ___ Romane preisgekrönt sind, gibt ein Interview.', 'deren', 'Genitiv fem./Pl.'],
  ['Das Unternehmen, ___ Umsatz gestiegen ist, expandiert.', 'dessen', 'Genitiv mask./neutr.'],
  ['Die Studierenden, ___ Ergebnisse überzeugen, erhalten ein Stipendium.', 'deren', 'Genitiv fem./Pl.'],
  ['Der Politiker, ___ Vorschlag abgelehnt wurde, bleibt hartnäckig.', 'dessen', 'Genitiv mask./neutr.'],
  ['Die Expertin, ___ Analyse wir folgen, warnt vor Risiken.', 'deren', 'Genitiv fem./Pl.'],
  ['Das Projekt, ___ Finanzierung unsicher ist, wird verschoben.', 'dessen', 'Genitiv mask./neutr.'],
  ['Die Kollegen, ___ Unterstützung entscheidend war, werden gelobt.', 'deren', 'Genitiv fem./Pl.'],
  ['Der Anwalt, ___ Argumente überzeugen, plädiert für Freispruch.', 'dessen', 'Genitiv mask./neutr.'],
  ['Die Institution, ___ Ruf gefährdet ist, reagiert sofort.', 'deren', 'Genitiv fem./Pl.'],
  ['Der Bericht, ___ Schlussfolgerungen klar sind, liegt vor.', 'dessen', 'Genitiv mask./neutr.'],
];

const PREP_IN = [
  ['Die Stadt, in ___ ich studiert habe, hat sich verändert.', 'der', 'Präp. in + Dat. fem.'],
  ['Das Thema, über ___ wir debattieren, ist kontrovers.', 'das', 'Präp. über + Akk. neutr.'],
  ['Der Partner, mit ___ wir kooperieren, sitzt in Wien.', 'dem', 'Präp. mit + Dat. mask.'],
  ['Die Firma, bei ___ Sie angestellt sind, expandiert.', 'der', 'Präp. bei + Dat. fem.'],
  ['Das Archiv, aus ___ die Akte stammt, ist digitalisiert.', 'dem', 'Präp. aus + Dat. neutr.'],
  ['Die Methode, mit ___ wir arbeiten, ist geprüft.', 'der', 'Präp. mit + Dat. fem.'],
  ['Der Bericht, auf ___ sie sich bezieht, ist veraltet.', 'den', 'Präp. auf + Akk. mask.'],
  ['Die Kollegin, zu ___ ich gehe, kennt den Fall.', 'der', 'Präp. zu + Dat. fem.'],
  ['Das Problem, an ___ wir arbeiten, ist komplex.', 'dem', 'Präp. an + Dat. neutr.'],
  ['Die Menschen, für ___ wir uns einsetzen, brauchen Hilfe.', 'die', 'Präp. für + Akk. Pl.'],
  ['Der Kurs, an ___ Sie teilnehmen, beginnt montags.', 'dem', 'Präp. an + Dat. mask.'],
  ['Die Regeln, nach ___ wir uns richten, sind klar.', 'denen', 'Präp. nach + Dat. Pl.'],
  ['Das Dokument, von ___ die Rede ist, fehlt noch.', 'dem', 'Präp. von + Dat. neutr.'],
  ['Die Entscheidung, gegen ___ er protestiert, bleibt bestehen.', 'die', 'Präp. gegen + Akk. fem.'],
];

const WAS_IN = [
  ['Alles, ___ Sie sagen, wird protokolliert.', 'was', 'was nach alles'],
  ['Nichts, ___ er verspricht, ist verbindlich.', 'was', 'was nach nichts'],
  ['Etwas, ___ uns überrascht hat, kam gestern heraus.', 'was', 'was nach etwas'],
  ['Das Einzige, ___ zählt, ist das Ergebnis.', 'was', 'was nach Superlativ/Einzige'],
  ['Vieles, ___ früher galt, gilt heute nicht mehr.', 'was', 'was nach vieles'],
  ['Das, ___ Sie vorschlagen, klingt realistisch.', 'was', 'was nach das'],
  ['Alles, ___ wir besprochen haben, bleibt vertraulich.', 'was', 'was nach alles'],
  ['Nichts, ___ sie behauptet, lässt sich belegen.', 'was', 'was nach nichts'],
  ['Etwas, ___ ich nicht erwartet hatte, ist eingetreten.', 'was', 'was nach etwas'],
  ['Das Beste, ___ passieren konnte, ist eingetreten.', 'was', 'was nach Superlativ'],
  ['Vieles, ___ uns beschäftigt, betrifft die Finanzierung.', 'was', 'was nach vieles'],
  ['Das Schlimmste, ___ passieren könnte, ist ein Ausfall.', 'was', 'was nach Superlativ'],
  ['Alles, ___ im Vertrag steht, gilt verbindlich.', 'was', 'was nach alles'],
];

const WO_IN = [
  ['Die Stadt, ___ ich aufgewachsen bin, liegt an der Küste.', 'wo', 'wo (Ort)'],
  ['Das Thema, ___ wir uns oft streiten, ist heikel.', 'worüber', 'wo(r)+Präp.'],
  ['Der Punkt, ___ ich mich beziehe, steht auf Seite zehn.', 'worauf', 'wo(r)+Präp.'],
  ['Das Werkzeug, ___ wir die Analyse machen, ist neu.', 'womit', 'wo(r)+Präp.'],
  ['Der Unfall, ___ mehrere Personen verletzt wurden, wird untersucht.', 'wodurch', 'wo(r)+Präp.'],
  ['Das Problem, ___ wir uns noch nicht ausgetauscht haben, ist ernst.', 'worüber', 'wo(r)+Präp.'],
  ['Die Situation, ___ er sich befindet, ist schwierig.', 'worin', 'wo(r)+Präp.'],
  ['Der Aspekt, ___ ich mich erinnere, war entscheidend.', 'woran', 'wo(r)+Präp.'],
  ['Die Annahme, ___ unser Konzept ausgeht, ist umstritten.', 'wovon', 'wo(r)+Präp.'],
  ['Das Ziel, ___ wir hinarbeiten, ist ambitioniert.', 'worauf', 'wo(r)+Präp.'],
  ['Die Stadt, ___ Sie umziehen möchten, ist teuer.', 'wohin', 'wohin (Richtung)'],
  ['Die Region, ___ die Touristen anreisen, braucht Hotels.', 'woher', 'woher (Herkunft)'],
];

/**
 * 50 input-text: 11 Gen + 14 Präp + 13 was + 12 wo = 50
 * @return {{prompt:string, correct:string|string[], hint:string}[]}
 */
export function genRelativsatzErweitertB2InputText() {
  const items = [
    ...GENITIV_IN,
    ...PREP_IN,
    ...WAS_IN,
    ...WO_IN,
  ];
  if (items.length !== 50) throw new Error(`expected 50 IN items, got ${items.length}`);
  return items.map(([prompt, correct, hint]) => ({
    prompt: `Ergänzen Sie das Relativpronomen bzw. Relativadverb:\n\n${prompt}`,
    correct,
    hint,
  }));
}
