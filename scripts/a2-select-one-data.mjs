/**
 * A2 select-one question banks — 50 items per grammar topic.
 * Communicative contexts follow syllabus Lektionen 1–14.
 */

import { options4, options5, shuffle, ensure50 } from './a2-select-one-shared.mjs';

/** @typedef {import('./a2-select-one-shared.mjs').Q} Q */

const PART_POOL = ['ja', 'nein', 'doch', 'aber', 'oder', 'vielleicht'];
// Capitalized pool for blanks at the start of a sentence/quoted answer.
const PART_POOL_CAPS = ['Ja', 'Nein', 'Doch', 'Aber', 'Oder', 'Vielleicht'];

export function genAntwortpartikeln() {
  const items = [
    ['„Kommst du mit?" — „___, ich habe keine Zeit."', 'Nein', PART_POOL_CAPS],
    ['„Hast du Hunger?" — „___, gern!"', 'Ja', PART_POOL_CAPS],
    ['„Warst du nicht in Berlin?" — „___, letztes Jahr."', 'Doch', PART_POOL_CAPS],
    ['„Ich mag Kaffee, ___ Tee mag ich lieber."', 'aber', PART_POOL],
    ['„Gehen wir ins Kino ___ nach Hause?"', 'oder', PART_POOL],
    ['„Ist das dein Auto?" — „___, das ist meins."', 'Ja', PART_POOL_CAPS],
    ['„Lernst du Deutsch?" — „___, seit einem Jahr."', 'Ja', PART_POOL_CAPS],
    ['„Warst du krank?" — „___, ich war nur müde."', 'Nein', PART_POOL_CAPS],
    ['„Kommst du nicht zur Party?" — „___, ich komme bestimmt."', 'Doch', PART_POOL_CAPS],
    ['„Magst du Sport?" — „___, ich mag Fußball."', 'Ja', PART_POOL_CAPS],
    ['„Ist das teuer?" — „___, es ist günstig."', 'Nein', PART_POOL_CAPS],
    ['„Trinkst du Kaffee?" — „___, ich trinke keinen."', 'Nein', PART_POOL_CAPS],
    ['„Hast du keine Zeit?" — „___, ich habe Zeit."', 'Doch', PART_POOL_CAPS],
    ['„Wir fahren morgen, ___ du bleibst?"', 'oder', PART_POOL],
    ['„Das Wetter ist schön, ___ es ist windig."', 'aber', PART_POOL],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 1), correct: c });
    }
    return out;
  });
}

export function genKonjunktionen() {
  const items = [
    ['Ich bleibe zu Hause, ___ ich krank bin.', 'weil', ['denn', 'aber', 'oder', 'und']],
    ['Ich glaube, ___ er morgen kommt.', 'dass', ['weil', 'wenn', 'oder', 'denn']],
    ['___ es regnet, nehme ich einen Schirm.', 'Wenn', ['Weil', 'Dass', 'Aber', 'Und']],
    ['Er lernt Deutsch, ___ er in Deutschland arbeiten will.', 'weil', ['dass', 'oder', 'aber', 'und']],
    ['Ich weiß nicht, ___ der Zug pünktlich ist.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['___ ich müde war, bin ich früh ins Bett gegangen.', 'Weil', ['Dass', 'Wenn', 'Oder', 'Aber']],
    ['Sie sagt, ___ sie nächste Woche Urlaub macht.', 'dass', ['weil', 'wenn', 'oder', 'denn']],
    ['___ du Zeit hast, ruf mich an.', 'Wenn', ['Weil', 'Dass', 'Aber', 'Und']],
    ['Ich bleibe, ___ ich noch viel zu tun habe.', 'weil', ['dass', 'wenn', 'oder', 'und']],
    ['Er fragt, ___ wir mitkommen.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Ich bin traurig, ___ ich meine Familie vermisse.', 'weil', ['dass', 'wenn', 'oder', 'aber']],
    ['Kommst du mit, ___ du Zeit hast?', 'wenn', ['weil', 'dass', 'oder', 'denn']],
    ['___ du müde bist, solltest du schlafen.', 'Wenn', ['Weil', 'Dass', 'Aber', 'Und']],
    ['Ich denke, ___ das eine gute Idee ist.', 'dass', ['weil', 'wenn', 'oder', 'denn']],
    ['Wir gehen spazieren, ___ das Wetter schön ist.', 'weil', ['dass', 'wenn', 'oder', 'aber']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 11), correct: c });
    }
    return out;
  });
}

export function genPerfekt() {
  const items = [
    ['Ich ___ gestern ins Kino gegangen.', 'bin', ['habe', 'war', 'hatte', 'wird']],
    ['Wir ___ Pizza gegessen.', 'haben', ['sind', 'hat', 'ist', 'sein']],
    ['Er ___ den ganzen Tag gearbeitet.', 'hat', ['ist', 'haben', 'war', 'bin']],
    ['Sie ___ nach Berlin gefahren.', 'ist', ['hat', 'haben', 'war', 'hatte']],
    ['Ich ___ meine Freunde getroffen.', 'habe', ['bin', 'ist', 'war', 'sind']],
    ['Wir ___ im Park spaziert.', 'sind', ['haben', 'hat', 'habt', 'war']],
    ['Du ___ schon viel gelernt.', 'hast', ['bist', 'ist', 'war', 'haben']],
    ['Er ___ Fußball gespielt.', 'hat', ['ist', 'bin', 'sind', 'war']],
    ['Ich ___ lange geschlafen.', 'habe', ['bin', 'ist', 'war', 'sind']],
    ['Sie ___ nach Hause gekommen.', 'ist', ['hat', 'haben', 'war', 'hatte']],
    ['Wir ___ ein neues Lied gesungen.', 'haben', ['sind', 'ist', 'war', 'bin']],
    ['Ich ___ schon einmal in Wien gewesen.', 'bin', ['habe', 'hat', 'war', 'hatte']],
    ['Er ___ seine Hausaufgaben gemacht.', 'hat', ['ist', 'bin', 'sind', 'war']],
    ['Ich ___ den Bus verpasst.', 'habe', ['bin', 'ist', 'war', 'sind']],
    ['Sie ___ sehr gut gekocht.', 'hat', ['ist', 'bin', 'sind', 'war']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 21), correct: c });
    }
    return out;
  });
}

export function genPraeteritum() {
  const items = [
    ['Als Kind ___ ich gern Fußball.', 'spielte', ['spiele', 'gespielt', 'spielen', 'spielst']],
    ['Gestern ___ ich zu Hause.', 'war', ['bin', 'ist', 'waren', 'sein']],
    ['Er ___ viel Wasser.', 'trank', ['trinkt', 'getrunken', 'trinken', 'trinkst']],
    ['Wir ___ in der Schule.', 'waren', ['sind', 'bin', 'war', 'sein']],
    ['Sie ___ ein Geschenk.', 'kaufte', ['kauft', 'gekauft', 'kaufen', 'kaufst']],
    ['Ich ___ müde und ging schlafen.', 'war', ['bin', 'ist', 'waren', 'sein']],
    ['Er ___ die ganze Nacht.', 'schlief', ['schläft', 'geschlafen', 'schlafen', 'schläfst']],
    ['Wir ___ nach Italien.', 'fuhren', ['fahren', 'gefahren', 'fährst', 'fahre']],
    ['Ich ___ das nicht.', 'wusste', ['weiß', 'gewusst', 'wissen', 'weißt']],
    ['Sie ___ sehr freundlich.', 'war', ['ist', 'bin', 'waren', 'sein']],
    ['Er ___ ein Buch.', 'las', ['liest', 'gelesen', 'lesen', 'liest']],
    ['Ich ___ Hunger.', 'hatte', ['habe', 'hat', 'haben', 'hast']],
    ['Wir ___ lange auf dich.', 'warteten', ['warten', 'gewartet', 'wartet', 'wartest']],
    ['Sie ___ nach Berlin.', 'zog', ['zieht', 'gezogen', 'ziehen', 'ziehst']],
    ['Ich ___ auf der Schule bleiben.', 'wollte', ['will', 'gewollt', 'wollen', 'willst']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 31), correct: c });
    }
    return out;
  });
}

export function genModalverben() {
  // Context must make exactly one modal correct among the options (AUTHORING §9).
  const items = [
['Der Arzt sagt: Du ___ mehr Wasser trinken.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Heute ist Feiertag. Laut Vertrag ___ ich nicht arbeiten.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Schild: „Parken verboten“. ___ ich hier trotzdem parken?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Unser Plan steht fest: Wir ___ morgen früh losfahren.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Nach drei Jahren Kurs ___ er schon sehr gut Deutsch.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Die Nachbarn schlafen. Du ___ leiser sprechen.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Ich bin krank. Ich ___ leider nicht zur Party kommen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Schild: „Fotografieren verboten!“ — ___ man hier fotografieren?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Für den Marathon ___ sie jeden Tag trainieren.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Wir haben Lust darauf: Wir ___ heute ins Schwimmbad gehen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Der Apotheker rät: Du ___ den Arzt anrufen.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Warte, ich habe Zeit — ich ___ dir helfen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Mir ist warm. ___ ich bitte das Fenster öffnen?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Im Arbeitsvertrag steht: Er ___ pünktlich sein.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Unser Wunsch fürs Wochenende: Wir ___ einfach ausruhen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Ohne Schlüssel ___ ich die Tür nicht öffnen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Für den Kurs ___ du Hausaufgaben machen.', 'musst', ['kannst', 'darfst', 'willst', 'sollst']],
    ['Mama erinnert dich: Du ___ höflich grüßen.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Wir ___ unbedingt nach Berlin — das ist unser Traum.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Im Museum: „Handy aus!“ — ___ man hier telefonieren?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Der Lehrer erklärt: Ihr ___ im Unterricht leise sein.', 'sollt', ['könnt', 'müsst', 'dürft', 'wollt']],
    ['Mit dem kaputten Auto ___ wir nicht fahren.', 'können', ['müssen', 'dürfen', 'wollen', 'sollen']],
    ['Vor der Prüfung ___ er noch zwei Stunden lernen.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Habt ihr Lust? ___ ihr mit uns ins Kino kommen?', 'Wollt', ['Könnt', 'Müsst', 'Dürft', 'Sollt']],
    ['Schild „Nur Personal“. ___ ich hier durch den Eingang?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Die Polizei sagt klar: Hier ___ man nicht parken.', 'darf', ['kann', 'muss', 'will', 'soll']],
    ['Tom spricht fünf Sprachen. Besonders gut ___ er Spanisch.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Der Bus fährt gleich. Wir ___ jetzt zur Haltestelle eilen.', 'müssen', ['können', 'dürfen', 'wollen', 'sollen']],
    ['Anna und Paul ___ nächsten Sommer heiraten — sie haben es beschlossen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Der Coach sagt: Du ___ mehr schlafen vor dem Wettkampf.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Ohne Führerschein ___ ich laut Gesetz kein Auto fahren.', 'darf', ['kann', 'muss', 'will', 'soll']],
    ['Ohne Brille ___ sie die Tafel nicht lesen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Laut Fahrplan ___ der Zug um acht abfahren.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Kinder, der Zahnarzt sagt: Ihr ___ jeden Abend die Zähne putzen!', 'sollt', ['könnt', 'müsst', 'dürft', 'wollt']],
    ['Wir essen kein Fleisch — wir ___ Vegetarier bleiben.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Er hat hohes Fieber. Deshalb ___ er heute im Bett bleiben.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Nach dem Intensivkurs ___ ich schon Briefe auf Deutsch schreiben.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Die Mutter zum Kind: Du ___ nicht mit dem Ball im Wohnzimmer spielen.', 'darfst', ['kannst', 'musst', 'willst', 'sollst']],
    ['Unser Ziel ist klar: Wir ___ bis Juni alle Prüfungen schaffen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Auf dem Campingplatz: „Kein Feuer!“ — ___ man hier grillen?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Ohne Internet ___ ich die E-Mail nicht senden.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Im Jobcenter sagt man: Sie ___ diese Formulare mitbringen.', 'müssen', ['können', 'dürfen', 'wollen', 'sollen']],
    ['Lisa hat den Wunsch: Sie ___ Sängerin werden.', 'will', ['kann', 'muss', 'darf', 'soll']],
    ['Der Zettel an der Tür: „Ruhe!“ — Ihr ___ leiser sein.', 'sollt', ['könnt', 'müsst', 'dürft', 'wollt']],
    ['Nur mit Ticket ___ man in den Zug einsteigen.', 'darf', ['kann', 'muss', 'will', 'soll']],
    ['Mein Bein ist verletzt. Ich ___ heute nicht Fußball spielen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Vor der Reise ___ wir noch die Koffer packen.', 'müssen', ['können', 'dürfen', 'wollen', 'sollen']],
    ['Die Freunde haben beschlossen: Wir ___ zusammen kochen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Die Lehrerin rät: Du ___ mehr üben.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Schild am Pool: „Nicht springen!“ — ___ man hier springen?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < items.length; i++) {
      const [p, c, pool] = items[i];
      out.push({ prompt: p, options: options4(c, pool, i + 41), correct: c });
    }
    return out;
  });
}

export function genReflexiv() {
  const items = [
    ['Ich ___ mich jeden Morgen.', 'wasche', ['wäscht', 'waschen', 'gewaschen', 'wäschst']],
    ['Er ___ sich für Musik.', 'interessiert', ['interessiere', 'interessierst', 'interessieren', 'interessierte']],
    ['Wir ___ uns um 8 Uhr.', 'treffen', ['trifft', 'traf', 'getroffen', 'triffst']],
    ['Sie ___ sich schnell.', 'beeilt', ['beeile', 'beeilen', 'beeilst', 'beeilt']],
    ['Ich ___ mich für Sport.', 'interessiere', ['interessiert', 'interessieren', 'interessierst', 'interessierte']],
    ['Es ist kalt — du ___ dich warm an.', 'ziehst', ['zieht', 'ziehe', 'waschen', 'wäschst']],
    ['Er ___ sich die Hände.', 'wäscht', ['wasche', 'waschen', 'gewaschen', 'wäschst']],
    ['Wir ___ uns auf das Konzert.', 'freuen', ['freut', 'freue', 'freust', 'gefreut']],
    ['Er ___ sich um die Hausaufgaben.', 'kümmert', ['kümmere', 'kümmern', 'kümmerst', 'gekümmert']],
    ['Sie ___ sich im Spiegel.', 'sieht', ['sehe', 'sehen', 'gesehen', 'siehst']],
    ['Nach der Arbeit ___ ich mich aus.', 'ruhe', ['ruht', 'ruhen', 'ruhst', 'ausgeruht']],
    ['Ich ___ mich auf den Urlaub.', 'freue', ['freut', 'freuen', 'gefreut', 'freust']],
    ['Er ___ sich den Rücken.', 'verletzt', ['verletze', 'verletzen', 'verletzest', 'verletzt']],
    ['Wir ___ uns jeden Tag.', 'sehen', ['sieht', 'sah', 'gesehen', 'siehst']],
    ['Sie ___ sich für das Fest.', 'bereitet', ['bereite', 'bereiten', 'bereitest', 'vorbereitet']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 51), correct: c });
    }
    return out;
  });
}

export function genKomparativ() {
  const pairs = [
    ['groß', 'größer', ['große', 'am groß', 'mehr groß', 'großer']],
    ['gut', 'besser', ['guter', 'mehr gut', 'am gut', 'gutest']],
    ['viel', 'mehr', ['vieler', 'mehrere', 'vielste', 'viel']],
    ['schnell', 'schneller', ['schnelle', 'am schnell', 'mehr schnell', 'schnellst']],
    ['alt', 'älter', ['alte', 'am alt', 'mehr alt', 'ältest']],
    ['jung', 'jünger', ['junge', 'am jung', 'mehr jung', 'jüngst']],
    ['teuer', 'teurer', ['teure', 'am teuer', 'mehr teuer', 'teuerst']],
    ['billig', 'billiger', ['billige', 'am billig', 'mehr billig', 'billigst']],
    ['hoch', 'höher', ['hohe', 'am hoch', 'mehr hoch', 'höchst']],
    ['nah', 'näher', ['nahe', 'am nah', 'mehr nah', 'nächst']],
    ['gern', 'lieber', ['gerne', 'am gern', 'mehr gern', 'liebst']],
    ['schön', 'schöner', ['schöne', 'am schön', 'mehr schön', 'schönst']],
    ['kalt', 'kälter', ['kalte', 'am kalt', 'mehr kalt', 'kältest']],
    ['warm', 'wärmer', ['warme', 'am warm', 'mehr warm', 'wärmst']],
    ['lang', 'länger', ['lange', 'am lang', 'mehr lang', 'längst']],
  ];
  const frames = [
    (a, b) => `Mein Auto ist ___ als deins. (${a})`,
    (a, b) => `Dieser Film ist ___ als der andere. (${a})`,
    (a, b) => `Heute ist es ___ als gestern. (${a})`,
    (a, b) => `Ich mag Tee ___. (${a})`,
    (a, b) => `Der ICE ist ___ als der Bus. (${a})`,
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [a, b, wrong] = pairs[i % pairs.length];
      const frame = frames[i % frames.length];
      out.push({
        prompt: frame(a, b),
        options: options4(b, [a, ...wrong], i + 61),
        correct: b,
      });
    }
    return out;
  });
}

export function genSuperlativ() {
  const items = [
    ['Der ICE ist der ___ Zug in Deutschland. (schnell)', 'schnellste', ['schneller', 'am schnellsten', 'schnellsten', 'schnell']],
    ['Das ist mein ___ Buch. (lieb)', 'liebstes', ['liebe', 'lieber', 'am liebsten', 'liebste']],
    ['Sie ist die ___ Schülerin in der Klasse. (gut)', 'beste', ['besser', 'am besten', 'guter', 'gutes']],
    ['Das war der ___ Tag im Urlaub. (schön)', 'schönste', ['schöner', 'am schönsten', 'schönsten', 'schön']],
    ['Er läuft am ___. (schnell)', 'schnellsten', ['schnellste', 'schneller', 'schnell', 'schnellstes']],
    ['Das ist das ___ Hotel hier. (billig)', 'billigste', ['billiger', 'am billigsten', 'billigen', 'billig']],
    ['Sie kocht am ___. (gut)', 'besten', ['beste', 'besser', 'gut', 'gutes']],
    ['Der Mount Everest ist der ___ Berg. (hoch)', 'höchste', ['höher', 'am höchsten', 'hohe', 'hoch']],
    ['Das ist mein ___ Freund. (gut)', 'bester', ['besser', 'am besten', 'gute', 'gutes']],
    ['Im Sommer ist es am ___. (warm)', 'wärmsten', ['wärmer', 'warme', 'warm', 'wärmste']],
    ['Das ist der ___ Film des Jahres. (bekannt)', 'bekannteste', ['bekannter', 'am bekanntesten', 'bekannten', 'bekannt']],
    ['Sie singt am ___. (laut)', 'lautesten', ['lauter', 'laute', 'laut', 'lauteste']],
    ['Das ist das ___ Zimmer in der Wohnung. (klein)', 'kleinste', ['kleiner', 'am kleinsten', 'kleinen', 'klein']],
    ['Er ist der ___ Spieler im Team. (jung)', 'jüngste', ['jünger', 'am jüngsten', 'junge', 'jung']],
    ['Das Essen schmeckt am ___. (lecker)', 'leckersten', ['leckerer', 'leckere', 'lecker', 'leckerste']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 71), correct: c });
    }
    return out;
  });
}

export function genWechsel() {
  const scenes = [
    { q: 'Wo hängt die Lampe? — Sie hängt ___ Decke.', c: 'an der', p: ['an die', 'auf der', 'in der', 'an den'] },
    { q: 'Wohin legst du das Buch? — ___ Tisch.', c: 'Auf den', p: ['Auf dem', 'In den', 'An den', 'Unter den'] },
    { q: 'Wo ist das Kind? — Es ist ___ Park.', c: 'im', p: ['in den', 'ins', 'am', 'auf dem'] },
    { q: 'Wohin gehst du? — ___ Schwimmbad.', c: 'Ins', p: ['Im', 'In das', 'Am', 'Auf das'] },
    { q: 'Wo steht der Bus? — ___ Straße.', c: 'auf der', p: ['auf die', 'in der', 'an der', 'auf den'] },
    { q: 'Wohin stellst du die Leiter? — ___ Wand.', c: 'An die', p: ['An der', 'In die', 'Auf die', 'An den'] },
    { q: 'Wo sitzt du? — ___ Küche.', c: 'in der', p: ['in die', 'ins', 'an der', 'auf der'] },
    { q: 'Wohin kommen die Gäste? — ___ Wohnung.', c: 'In die', p: ['In der', 'Ins', 'An die', 'Auf die'] },
    { q: 'Wo liegt der Teppich? — ___ Boden.', c: 'auf dem', p: ['auf den', 'in dem', 'an dem', 'unter dem'] },
    { q: 'Wohin hängst du das Bild? — ___ Wand.', c: 'An die', p: ['An der', 'In die', 'Auf die', 'An den'] },
    { q: 'Wo ist das Museum? — ___ Stadtmitte.', c: 'in der', p: ['in die', 'ins', 'an der', 'auf der'] },
    { q: 'Wohin fährst du? — ___ Berge.', c: 'In die', p: ['In den', 'Ins', 'An die', 'Auf die'] },
    { q: 'Wo bist du? — ___ Arbeit.', c: 'bei der', p: ['bei die', 'in der', 'an der', 'auf der'] },
    { q: 'Wohin gehst du nach der Schule? — ___ Hause.', c: 'Nach', p: ['In', 'Zu', 'Auf', 'An'] },
    { q: 'Wo wohnst du? — ___ kleinen Stadt.', c: 'in einer', p: ['in die', 'ins', 'an einer', 'auf einer'] },
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const s = scenes[i % scenes.length];
      out.push({ prompt: s.q, options: options4(s.c, s.p, i + 81), correct: s.c });
    }
    return out;
  });
}

export function genDativ() {
  const items = [
    ['Ich antworte ___ Freundin.', 'der', ['die', 'den', 'des', 'dem']],
    ['Er hilft ___ Kind.', 'dem', ['das', 'den', 'des', 'der']],
    ['Wir danken ___ Lehrerin.', 'der', ['die', 'den', 'des', 'dem']],
    ['Ich folge ___ Hund.', 'dem', ['den', 'der', 'des', 'die']],
    ['Sie gratuliert ___ Bruder.', 'dem', ['den', 'der', 'des', 'die']],
    ['Ich gebe ___ Mutter Blumen.', 'meiner', ['meine', 'meinen', 'meines', 'meinem']],
    ['Er schreibt ___ Freund.', 'seinem', ['sein', 'seinen', 'seine', 'seiner']],
    ['Wir fahren mit ___ Bus.', 'dem', ['den', 'der', 'des', 'die']],
    ['Ich wohne bei ___ Eltern.', 'meinen', ['meine', 'meiner', 'meines', 'meinem']],
    ['Sie arbeitet in ___ Firma.', 'einer', ['eine', 'einen', 'eines', 'einem']],
    ['Ich bin in ___ Schule.', 'der', ['die', 'den', 'des', 'dem']],
    ['Er sitzt auf ___ Stuhl.', 'dem', ['den', 'der', 'des', 'die']],
    ['Wir essen mit ___ Freunden.', 'unseren', ['unsere', 'unserer', 'unseres', 'unserem']],
    ['Ich kaufe ___ Schwester ein Geschenk.', 'meiner', ['meine', 'meinen', 'meines', 'meinem']],
    ['Er vertraut ___ Ärztin.', 'der', ['die', 'den', 'des', 'dem']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 91), correct: c });
    }
    return out;
  });
}

export function genAkkusativ() {
  const items = [
    ['Ich gehe ohne ___ Regenschirm.', 'den', ['dem', 'der', 'des', 'die']],
    ['Er läuft gegen ___ Wind.', 'den', ['dem', 'der', 'des', 'die']],
    ['Wir fahren durch ___ Park.', 'den', ['dem', 'der', 'des', 'die']],
    ['Das Geschenk ist für ___ Schwester.', 'deine', ['deiner', 'deinen', 'dein', 'deinem']],
    ['Ich suche ___ Schlüssel.', 'den', ['der', 'dem', 'das', 'die']],
    ['Sie freut sich auf ___ Wochenende.', 'das', ['der', 'dem', 'den', 'die']],
    ['Er geht ohne ___ Mantel.', 'seinen', ['sein', 'seiner', 'seine', 'seinem']],
    ['Ich brauche ___ neue Information.', 'eine', ['ein', 'einen', 'einer', 'einem']],
    ['Wir sehen ___ Film.', 'den', ['der', 'dem', 'das', 'die']],
    ['Sie kauft ___ Teppich.', 'einen', ['ein', 'eine', 'einer', 'einem']],
    ['Ich lese ___ Artikel.', 'den', ['der', 'dem', 'das', 'die']],
    ['Er nimmt ___ Medikament.', 'das', ['der', 'dem', 'den', 'die']],
    ['Wir besuchen ___ Museum.', 'das', ['der', 'dem', 'den', 'die']],
    ['Ich höre ___ Podcast.', 'den', ['der', 'dem', 'das', 'die']],
    ['Sie reserviert ___ Tisch.', 'einen', ['ein', 'eine', 'einer', 'einem']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 101), correct: c });
    }
    return out;
  });
}

export function genFestePraep() {
  const prepPool = ['auf', 'an', 'über', 'für', 'von', 'mit', 'nach', 'in', 'zu', 'bei'];
  const items = [
    ['Ich warte ___ eine Antwort vom Reisebüro.', 'auf', prepPool],
    ['Er denkt ___ seine Familie.', 'an', prepPool],
    ['Wir sprechen ___ die Reise.', 'über', prepPool],
    ['Sie freut sich ___ den Geburtstag.', 'auf', prepPool],
    ['Ich interessiere mich ___ klassische Musik.', 'für', prepPool],
    ['Er träumt ___ einem Urlaub.', 'von', prepPool],
    ['Wir diskutieren ___ das Problem.', 'über', prepPool],
    ['Sie ärgert sich ___ den Fehler.', 'über', prepPool],
    ['Ich hoffe ___ gutes Wetter.', 'auf', prepPool],
    ['Er erinnert sich ___ seine Kindheit.', 'an', prepPool],
    ['Wir sprechen ___ dem Chef.', 'mit', prepPool],
    ['Sie wartet ___ den Zug.', 'auf', prepPool],
    ['Ich danke ___ die Hilfe.', 'für', prepPool],
    ['Er fragt ___ dem Weg zum Hotel.', 'nach', prepPool],
    ['Wir lachen ___ den Witz.', 'über', prepPool],
    ['Ich freue mich ___ das Fest.', 'auf', prepPool],
    ['Er besteht ___ pünktliche Zahlung.', 'auf', prepPool],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 111), correct: c });
    }
    return out;
  });
}

export function genAdjDekl() {
  const items = [
    ['Ich kaufe einen ___ Computer.', 'neuen', ['neuer', 'neue', 'neues', 'neuem']],
    ['Das ist eine ___ Lampe.', 'alte', ['alter', 'alten', 'altes', 'altem']],
    ['Mit ___ Wetter bleibe ich drinnen.', 'kaltem', ['kalten', 'kalte', 'kaltes', 'kalter']],
    ['Er trägt einen ___ Mantel.', 'warmen', ['warme', 'warmer', 'warmes', 'warmem']],
    ['In ___ Stadt wohne ich gern.', 'großer', ['große', 'großen', 'großes', 'großem']],
    ['Sie liest ein ___ Buch.', 'interessantes', ['interessanter', 'interessante', 'interessanten', 'interessantem']],
    ['Ohne ___ Vorbereitung geht das nicht.', 'gute', ['guter', 'guten', 'gutes', 'gutem']],
    ['Der ___ Hund bellt laut.', 'kleine', ['kleiner', 'kleinen', 'kleines', 'kleinem']],
    ['Ich trinke ___ Tee.', 'heißen', ['heiße', 'heißer', 'heißes', 'heißem']],
    ['Mit ___ Auto fährt er gern.', 'neuem', ['neuen', 'neue', 'neues', 'neuer']],
    ['Sie sucht eine ___ Wohnung.', 'billige', ['billiger', 'billigen', 'billiges', 'billigem']],
    ['In ___ Straße wohnt sie.', 'ruhiger', ['ruhige', 'ruhigen', 'ruhiges', 'ruhigem']],
    ['Er isst ___ Brot.', 'frisches', ['frischer', 'frischen', 'frische', 'frischem']],
    ['Ich sehe einen ___ Turm.', 'hohen', ['hohe', 'hoher', 'hohes', 'hohem']],
    ['Das ist ein ___ Geschenk.', 'schönes', ['schöner', 'schöne', 'schönen', 'schönem']],
    ['Das ist ja eine ___ Wohnung!', 'tolle', ['toller', 'tollen', 'tolles', 'tollem']],
    ['Bei ___ Wind bleibe ich zu Hause.', 'starkem', ['starken', 'starke', 'starker', 'starkes']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 121), correct: c });
    }
    return out;
  });
}

export function genPossessiv() {
  const items = [
    ['Das ist das Auto ___ Vaters.', 'meines', ['mein', 'meinem', 'meinen', 'meine']],
    ['Die Idee ___ Kollegin ist gut.', 'meiner', ['meine', 'meinen', 'mein', 'meinem']],
    ['Wegen ___ Krankheit bleibt er zu Hause.', 'seiner', ['sein', 'seinen', 'seine', 'seinem']],
    ['Das Zimmer ___ Kindes ist klein.', 'des', ['der', 'dem', 'den', 'das']],
    ['Wir besuchen ___ Großeltern.', 'unsere', ['unser', 'unseren', 'unserer', 'unserem']],
    ['Er hilft ___ Nachbarin.', 'seiner', ['sein', 'seine', 'seinen', 'seinem']],
    ['Ich kenne ___ Bruder.', 'ihren', ['ihr', 'ihre', 'ihrer', 'ihrem']],
    ['Das ist die Tasche ___ Mutter.', 'meiner', ['meine', 'meinen', 'mein', 'meinem']],
    ['Wegen ___ Regens bleiben wir drinnen.', 'des', ['der', 'dem', 'den', 'das']],
    ['Die Wohnung ___ Freundes ist schön.', 'seines', ['sein', 'seinen', 'seine', 'seinem']],
    ['Ich liebe ___ Stadt.', 'meine', ['mein', 'meinen', 'meiner', 'meinem']],
    ['Er sucht ___ Schlüssel.', 'seinen', ['sein', 'seine', 'seiner', 'seinem']],
    ['Das Fahrrad ___ Schwester ist neu.', 'meiner', ['meine', 'meinen', 'mein', 'meinem']],
    ['Wir feiern ___ Geburtstag.', 'euren', ['euer', 'eure', 'eurer', 'eurem']],
    ['Das ist das Handy ___ Chefs.', 'ihres', ['ihr', 'ihren', 'ihre', 'ihrem']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 131), correct: c });
    }
    return out;
  });
}

export function genGenitiv() {
  const items = [
    ['Wegen ___ Regens bleiben wir zu Hause.', 'des', ['der', 'dem', 'den', 'das']],
    ['Während ___ Sommers freue ich mich auf Urlaub.', 'des', ['der', 'dem', 'den', 'das']],
    ['Wegen ___ Krankheit fehlt er in der Schule.', 'der', ['des', 'dem', 'den', 'das']],
    ['Während ___ Unterrichts lerne ich viel.', 'des', ['der', 'dem', 'den', 'das']],
    ['Trotz ___ Problems machen wir weiter.', 'des', ['der', 'dem', 'den', 'das']],
    ['Wegen ___ Sturms fällt das Fest aus.', 'des', ['der', 'dem', 'den', 'das']],
    ['Während ___ ganzen Tages war ich unterwegs.', 'des', ['der', 'dem', 'den', 'das']],
    ['Trotz ___ Kälte gehen wir spazieren.', 'der', ['des', 'dem', 'den', 'das']],
    ['Wegen ___ Verspätung verpassten wir den Zug.', 'der', ['des', 'dem', 'den', 'das']],
    ['Wegen ___ Prüfung lernt er viel.', 'der', ['des', 'dem', 'den', 'das']],
    ['Trotz ___ Müdigkeit arbeitet sie weiter.', 'der', ['des', 'dem', 'den', 'das']],
    ['Während ___ Ferien freuen sich die Kinder.', 'der', ['des', 'dem', 'den', 'das']],
    ['Wegen ___ Lärms kann ich nicht schlafen.', 'des', ['der', 'dem', 'den', 'das']],
    ['Trotz ___ Preises kaufe ich es.', 'des', ['der', 'dem', 'den', 'das']],
    ['Wegen ___ Arbeit ist er müde.', 'der', ['des', 'dem', 'den', 'das']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 141), correct: c });
    }
    return out;
  });
}

export function genIndefinit() {
  // 50 unique stems; jemand/niemand polarity pinned by context (AUTHORING §9).
  const items = [
    ['___ muss die Hausaufgaben machen — das ist die Regel.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Es ist spät und dunkel. Hier im Haus ist heute ___ zu Hause.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Ich habe ___ Wichtiges von der Liste vergessen.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['Kann ___ von euch mir bitte helfen?', 'jemand', ['niemand', 'etwas', 'man', 'alle']],
    ['___ von den Nachbarn an der Tür war sehr nett.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
    ['Ich sehe ___ von meinen Freunden auf der Straße.', 'niemanden', ['jemanden', 'etwas', 'alle', 'man']],
    ['Hast du ___ Interesse an Sport?', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['Laut Schild darf ___ hier nicht rauchen.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Es gibt ___ Neues im Radio heute.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ von den Nachbarn hat die Tür offen gelassen.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
    ['Ich kenne ___ von den Gästen hier.', 'niemanden', ['jemanden', 'etwas', 'alle', 'man']],
    ['Brauchst du noch ___ Hilfe von mir?', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ kann Fehler machen — auch Experten.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Die Straße ist voller Fremder.\nIch sehe ___ von meiner Familie.', 'niemanden', ['jemanden', 'etwas', 'alle', 'man']],
    ['Du suchst Hilfe im Kurs.\nKann ___ von den Teilnehmern mir helfen?', 'jemand', ['niemand', 'etwas', 'man', 'alle']],
    ['Es ist spät und das Licht ist aus.\nHier ist ___ zu Hause.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Du hast die Einkaufsliste vergessen.\nIch habe ___ vergessen.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['Ohne Ausweis darf ___ den Raum betreten.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['___ aus dem Team hat mir diese Nachricht geschickt.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
    ['Nach dem lauten Knall war plötzlich ___ im Raum.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Hast du schon ___ von deinen Nachbarn getroffen?', 'jemanden', ['jemand', 'niemanden', 'etwas', 'man']],
    ['Wir brauchen noch ___ Hilfe von dir.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['Im leeren Büro war heute Morgen ___ .', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Sie sucht ___ , der Italienisch spricht.', 'jemanden', ['jemand', 'niemanden', 'etwas', 'man']],
    ['Trotz der Einladung kam ___ zu der Feier.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Ich habe in dem Brief ___ Ungewöhnliches gelesen.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['Bei dieser Frage weiß leider ___ die Antwort.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Ist denn ___ von der Familie zu Hause?', 'jemand', ['niemand', 'etwas', 'alle', 'man']],
    ['Er hat uns ___ wirklich Interessantes berichtet.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ darf hier nicht fotografieren — so steht es auf dem Schild.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Du suchst deinen Bruder im Park.\nHast du ___ dort gesehen?', 'jemanden', ['jemand', 'niemanden', 'etwas', 'man']],
    ['Die Wohnung war dunkel und still.\n___ war zu Hause, als ich anrief.', 'Niemand', ['Jemand', 'Etwas', 'Man', 'Alles']],
    ['Du bist neu und kennst kaum Leute.\nKennst du ___ von den Kollegen hier?', 'jemanden', ['jemand', 'niemanden', 'etwas', 'man']],
    ['Es klopft, und du hörst Stimmen drinnen.\nIst ___ zu Hause?', 'jemand', ['niemand', 'etwas', 'alle', 'man']],
    ['Du erwartest eine Sendung und siehst den Zettel am Paket.\nHat ___ von den Nachbarn das Paket angenommen?', 'jemand', ['niemand', 'etwas', 'alle', 'man']],
    ['Nach dem Streit war die Küche leer.\n___ wollte noch sprechen.', 'Niemand', ['Jemand', 'Etwas', 'Man', 'Alles']],
    ['Du brauchst Hilfe beim Umzug.\nKann ___ von euch mir helfen?', 'jemand', ['niemand', 'etwas', 'man', 'alle']],
    ['Der Zeuge will niemanden belasten.\nEr hat ___ Verdächtiges gesehen.', 'nichts', ['etwas', 'jemand', 'niemand', 'alles']],
    ['Die Prüfung war unfair schwer.\n___ wusste die richtige Antwort.', 'Niemand', ['Jemand', 'Etwas', 'Man', 'Alles']],
    ['Du willst etwas Ungewöhnliches.\nMöchtest du ___ Neues testen?', 'etwas', ['nichts', 'jemand', 'niemand', 'alles']],
    ['Das Thema ist brandneu.\nIch habe ___ davon gehört.', 'nichts', ['etwas', 'jemand', 'niemand', 'alles']],
    ['Alles auf der Liste ist erledigt.\nSie hat ___ gefunden, was sie suchte.', 'alles', ['nichts', 'etwas', 'niemand', 'jemand']],
    ['Du fragst nach den Unterlagen.\nBrauchst du noch ___ davon?', 'etwas', ['nichts', 'jemand', 'niemand', 'alles']],
    ['Nach dem Alarm war der Flur leer.\n___ darf den Raum betreten.', 'Niemand', ['Jemand', 'Etwas', 'Man', 'Alles']],
    ['Eine anonyme Mail liegt im Postfach.\n___ hat mir diese Nachricht geschickt.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
    ['Sie will die Wahrheit sagen.\nSie hat ___ Falsches gesagt.', 'nichts', ['etwas', 'jemand', 'niemand', 'alles']],
    ['Du wartest auf Freunde.\nHast du ___ von ihnen gesehen?', 'jemanden', ['jemand', 'niemanden', 'etwas', 'man']],
    ['Im Konferenzraum ist es still.\n___ weiß die Antwort auf diese Frage.', 'Niemand', ['Jemand', 'Etwas', 'Man', 'Alles']],
    ['Nach dem Brand war das Gebäude geräumt.\n___ war noch im Gebäude.', 'Niemand', ['Jemand', 'Etwas', 'Man', 'Alles']],
    ['Laut Aushang muss ___ den Ausweis zeigen.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
  ];
  if (items.length !== 50) throw new Error(`Indefinit A2: expected 50, got ${items.length}`);
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i];
      out.push({ prompt: p, options: options4(c, pool, i + 151), correct: c });
    }
    return out;
  });
}

export function genNomenPraep() {
  const items = [
    ['Ich habe Interesse ___ Kunst.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Angst ___ Spinnen.', 'vor', ['an', 'auf', 'in', 'mit']],
    ['Sie hat Lust ___ Eis.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Wir denken ___ die Zukunft.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Respekt ___ Lehrern.', 'vor', ['an', 'auf', 'in', 'mit']],
    ['Ich habe Hoffnung ___ besseres Wetter.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Sie hat Freude ___ Musik.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat keine Zeit ___ Diskussionen.', 'für', ['an', 'auf', 'in', 'mit']],
    ['Wir haben Vertrauen ___ unser Team.', 'in', ['an', 'auf', 'mit', 'zu']],
    ['Ich habe Bedarf ___ Hilfe.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Erfolg ___ der Prüfung.', 'bei', ['an', 'auf', 'in', 'mit']],
    ['Sie hat Teilnahme ___ dem Kurs.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Ich habe Zweifel ___ der Idee.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Anspruch ___ eine Belohnung.', 'auf', ['an', 'in', 'mit', 'für']],
    ['Wir haben Spaß ___ dem Spiel.', 'an', ['auf', 'in', 'mit', 'zu']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 161), correct: c });
    }
    return out;
  });
}

export function genTrennbar() {
  const items = [
    ['Wann ___ du auf?', 'stehst', ['steht', 'stehen', 'aufstehst', 'stehst auf']],
    ['Er ___ mich heute an.', 'ruft', ['ruft an', 'anruft', 'rufe', 'rufen']],
    ['Ich ___ die Lampe an.', 'mache', ['mache an', 'anmache', 'macht', 'machen']],
    ['Wir ___ um 8 Uhr auf.', 'stehen', ['steht', 'stehst', 'aufstehen', 'stehen auf']],
    ['Sie ___ das Licht aus.', 'macht', ['macht aus', 'ausmacht', 'mache', 'machen']],
    ['Ich ___ den Bus ein.', 'steige', ['steige ein', 'einsteige', 'steigt', 'steigen']],
    ['Er ___ früh auf.', 'steht', ['steht auf', 'aufsteht', 'stehe', 'stehen']],
    ['Wir ___ das Fest vor.', 'bereiten', ['bereiten vor', 'vorbereiten', 'bereitet', 'bereiten']],
    ['Du ___ gut auf.', 'machst', ['machst auf', 'aufmachst', 'macht', 'machen']],
    ['Ich ___ meine Freundin an.', 'rufe', ['rufe an', 'anrufe', 'ruft', 'rufen']],
    ['Er ___ die Tür zu.', 'macht', ['macht zu', 'zumacht', 'mache', 'machen']],
    ['Wir ___ heute im Supermarkt ein.', 'kaufen', ['kaufen ein', 'einkaufen', 'kauft', 'kaufe']],
    ['Sie ___ um 7 Uhr auf.', 'steht', ['steht auf', 'aufsteht', 'stehe', 'stehen']],
    ['Ich ___ das Formular aus.', 'fülle', ['fülle aus', 'ausfülle', 'füllt', 'füllen']],
    ['Er ___ das Radio an.', 'macht', ['macht an', 'anmacht', 'mache', 'machen']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 171), correct: c });
    }
    return out;
  });
}

export function genTemporal() {
  const items = [
    ['___ ich klein war, wohnte ich auf dem Land.', 'Als', ['Wenn', 'Während', 'Weil', 'Dass']],
    ['___ es regnet, bleibe ich drinnen.', 'Wenn', ['Als', 'Während', 'Weil', 'Dass']],
    ['___ er kocht, höre ich Musik.', 'Während', ['Als', 'Wenn', 'Weil', 'Dass']],
    ['___ wir ankamen, war es schon dunkel.', 'Als', ['Wenn', 'Während', 'Weil', 'Dass']],
    ['___ du Zeit hast, komm vorbei.', 'Wenn', ['Als', 'Während', 'Weil', 'Dass']],
    ['___ des Essens sprechen wir über Arbeit.', 'Während', ['Als', 'Wenn', 'Weil', 'Dass']],
    ['___ ich in Berlin lebte, lernte ich viel.', 'Als', ['Wenn', 'Während', 'Weil', 'Dass']],
    ['___ die Sonne scheint, gehen wir raus.', 'Wenn', ['Als', 'Während', 'Weil', 'Dass']],
    ['___ der Fahrt lese ich ein Buch.', 'Während', ['Als', 'Wenn', 'Weil', 'Dass']],
    ['___ er anrief, war ich unterwegs.', 'Als', ['Wenn', 'Während', 'Weil', 'Dass']],
    ['___ du müde bist, solltest du schlafen.', 'Wenn', ['Als', 'Während', 'Weil', 'Dass']],
    ['___ des Unterrichts ist es still.', 'Während', ['Als', 'Wenn', 'Weil', 'Dass']],
    ['___ sie jung war, tanzte sie gern.', 'Als', ['Wenn', 'Während', 'Weil', 'Dass']],
    ['___ ich krank bin, bleibe ich zu Hause.', 'Wenn', ['Als', 'Während', 'Weil', 'Dass']],
    ['___ der Pause essen wir.', 'Während', ['Als', 'Wenn', 'Weil', 'Dass']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 181), correct: c });
    }
    return out;
  });
}

export function genLokal() {
  const items = [
    ['Auf derselben Straße, Schaufenster gegen Schaufenster: Die Bank ist ___ der Post.', 'gegenüber', ['neben', 'hinter', 'vor', 'zwischen']],
    ['Nicht im Park, sondern am Rand: Das Café ist ___ dem Park.', 'neben', ['gegenüber', 'hinter', 'vor', 'zwischen']],
    ['Geh ___ die Brücke!', 'über', ['unter', 'neben', 'hinter', 'durch']],
    ['Vom Bahnhofsplatz aus sieht man das Hotel nicht — es liegt ___ dem Bahnhof.', 'hinter', ['vor', 'neben', 'gegenüber', 'zwischen']],
    ['Wir warten ___ dem Eingang.', 'vor', ['hinter', 'neben', 'gegenüber', 'zwischen']],
    ['Das Geschäft ist ___ zwei Häusern.', 'zwischen', ['neben', 'hinter', 'vor', 'gegenüber']],
    ['Fahren Sie ___ den Tunnel!', 'durch', ['über', 'unter', 'neben', 'hinter']],
    ['Der Supermarkt ist ___ der Ecke.', 'an', ['auf', 'in', 'zu', 'nach']],
    ['Das Büro ist ___ der zweiten Etage.', 'auf', ['an', 'in', 'zu', 'nach']],
    ['Wir treffen uns ___ dem Platz.', 'auf', ['an', 'in', 'zu', 'nach']],
    ['Das Bild hängt ___ der Tür.', 'über', ['unter', 'neben', 'hinter', 'zwischen']],
    ['Der Hund liegt ___ dem Tisch.', 'unter', ['über', 'neben', 'hinter', 'vor']],
    ['Beim Einkaufen bleibt das Kind gern in der Nähe — es steht ___ der Mutter.', 'neben', ['gegenüber', 'hinter', 'vor', 'zwischen']],
    ['Wir gehen ___ die Straße.', 'über', ['unter', 'neben', 'hinter', 'durch']],
    ['Vom Eingang der Mall aus: Die Apotheke ist ___.', 'rechts', ['links', 'oben', 'unten', 'gegenüber']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 191), correct: c });
    }
    return out;
  });
}

export function genNdekl() {
  const items = [
    ['Ich helfe dem ___.', 'Studenten', ['Student', 'Students', 'Studentem', 'Studentin']],
    ['Das ist das Auto des ___.', 'Studenten', ['Student', 'Students', 'Studentem', 'Studentin']],
    ['Ich sehe einen ___.', 'Polizisten', ['Polizist', 'Poliziste', 'Polizists', 'Polizistin']],
    ['Er spricht mit einem ___.', 'Journalisten', ['Journalist', 'Journaliste', 'Journalists', 'Journalistin']],
    ['Wir besuchen den ___.', 'Präsidenten', ['Präsident', 'Präsidente', 'Präsidents', 'Präsidentin']],
    ['Das ist der Wagen des ___.', 'Nachbarn', ['Nachbar', 'Nachbars', 'Nachbarns', 'Nachbarin']],
    ['Ich kenne einen ___.', 'Jungen', ['Junge', 'Jung', 'Junges', 'Jungin']],
    ['Er ist ___ geworden.', 'Pilot', ['Piloten', 'Pilote', 'Pilots', 'Pilotin']],
    ['Wir fragen den ___.', 'Fotografen', ['Fotograf', 'Fotografe', 'Fotografs', 'Fotografin']],
    ['Ich grüße den ___.', 'Herrn', ['Herr', 'Herre', 'Herrs', 'Frau']],
    ['Das ist das Buch des ___.', 'Journalisten', ['Journalist', 'Journaliste', 'Journalists', 'Journalistin']],
    ['Er trifft einen ___.', 'Komponisten', ['Komponist', 'Komponiste', 'Komponists', 'Komponistin']],
    ['Ich sehe den ___.', 'Löwen', ['Löwe', 'Löw', 'Löwes', 'Löwin']],
    ['Wir helfen dem ___.', 'Kunden', ['Kunde', 'Kundes', 'Kunder', 'Kundens']],
    ['Das ist der Name des ___.', 'Studenten', ['Student', 'Students', 'Studentem', 'Studentin']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 201), correct: c });
    }
    return out;
  });
}
