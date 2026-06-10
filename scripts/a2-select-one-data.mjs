/**
 * A2 select-one question banks — 50 items per grammar topic.
 * Communicative contexts follow syllabus Lektionen 1–14.
 */

import { options4, options5, shuffle, ensure50 } from './a2-select-one-shared.mjs';

/** @typedef {import('./a2-select-one-shared.mjs').Q} Q */

const PART_POOL = ['ja', 'nein', 'doch', 'aber', 'oder', 'vielleicht'];

export function genAntwortpartikeln() {
  const items = [
    ['„Kommst du mit?" — „___, ich habe keine Zeit."', 'nein', PART_POOL],
    ['„Hast du Hunger?" — „___, gern!"', 'ja', PART_POOL],
    ['„Du warst doch in Berlin?" — „___, letztes Jahr."', 'doch', PART_POOL],
    ['„Ich mag Kaffee, ___ Tee mag ich lieber."', 'aber', PART_POOL],
    ['„Gehen wir ins Kino ___ nach Hause?"', 'oder', PART_POOL],
    ['„Ist das dein Auto?" — „___, das ist meins."', 'ja', PART_POOL],
    ['„Lernst du Deutsch?" — „___, seit einem Jahr."', 'ja', PART_POOL],
    ['„Warst du krank?" — „___, ich war nur müde."', 'nein', PART_POOL],
    ['„Du kommst doch zur Party?" — „___, ich komme bestimmt."', 'doch', PART_POOL],
    ['„Magst du Sport?" — „___, ich mag Fußball."', 'ja', PART_POOL],
    ['„Ist das teuer?" — „___, es ist günstig."', 'nein', PART_POOL],
    ['„Trinkst du Milch?" — „___, ich trinke keinen."', 'nein', PART_POOL],
    ['„Du hast doch Zeit?" — „___, ich habe Zeit."', 'doch', PART_POOL],
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
    ['Wir ___ Pizza gegessen.', 'haben', ['sind', 'hat', 'wurden', 'sein']],
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
  const items = [
    ['Du ___ mehr Wasser trinken.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Ich ___ heute nicht arbeiten.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['___ ich hier parken?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Wir ___ morgen früh losfahren.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Er ___ sehr gut Deutsch.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['Du ___ leiser sprechen.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Ich ___ leider nicht kommen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['___ man hier fotografieren?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Sie ___ jeden Tag trainieren.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Wir ___ heute ins Schwimmbad gehen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
    ['Du ___ den Arzt anrufen.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Ich ___ dir helfen.', 'kann', ['muss', 'darf', 'will', 'soll']],
    ['___ ich das Fenster öffnen?', 'Darf', ['Kann', 'Muss', 'Will', 'Soll']],
    ['Er ___ pünktlich sein.', 'muss', ['kann', 'darf', 'will', 'soll']],
    ['Wir ___ am Wochenende ausruhen.', 'wollen', ['können', 'müssen', 'dürfen', 'sollen']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 41), correct: c });
    }
    return out;
  });
}

export function genReflexiv() {
  const items = [
    ['Ich ___ mich jeden Morgen.', 'wasche', ['wäscht', 'waschen', 'gewaschen', 'wäschst']],
    ['Er ___ sich für die Prüfung.', 'freut', ['freue', 'freuen', 'gefreet', 'freust']],
    ['Wir ___ uns um 8 Uhr.', 'treffen', ['trifft', 'traf', 'getroffen', 'triffst']],
    ['Sie ___ sich schnell.', 'beeilt', ['beeile', 'beeilen', 'beeilst', 'beeilt']],
    ['Ich ___ mich für Sport.', 'interessiere', ['interessiert', 'interessieren', 'interessierst', 'interessiert']],
    ['Du ___ dich anziehen.', 'musst', ['kannst', 'sollst', 'darfst', 'willst']],
    ['Er ___ sich die Hände.', 'wäscht', ['wasche', 'waschen', 'gewaschen', 'wäschst']],
    ['Wir ___ uns freuen.', 'können', ['müssen', 'sollen', 'dürfen', 'wollen']],
    ['Ich ___ mich erkältet.', 'habe', ['bin', 'ist', 'hat', 'sind']],
    ['Sie ___ sich im Spiegel.', 'sieht', ['sehe', 'sehen', 'gesehen', 'siehst']],
    ['Du ___ dich ausruhen.', 'sollst', ['kannst', 'musst', 'darfst', 'willst']],
    ['Ich ___ mich auf den Urlaub.', 'freue', ['freut', 'freuen', 'gefreet', 'freust']],
    ['Er ___ sich den Rücken.', 'verletzt', ['verletze', 'verletzen', 'verletzest', 'verletzt']],
    ['Wir ___ uns jeden Tag.', 'sehen', ['sieht', 'sah', 'gesehen', 'siehst']],
    ['Ich ___ mich nicht gut.', 'fühle', ['fühlt', 'fühlen', 'gefühlt', 'fühlst']],
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
    { q: 'Wohin gehst du nach der Schule? — ___ Haus.', c: 'Nach', p: ['In', 'Zu', 'Auf', 'An'] },
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
    ['Ich antworte ___ Freundin.', 'der', ['die', 'den', 'dem', 'das']],
    ['Er hilft ___ Kind.', 'dem', ['den', 'der', 'das', 'die']],
    ['Wir danken ___ Lehrerin.', 'der', ['die', 'den', 'dem', 'das']],
    ['Ich folge ___ Hund.', 'dem', ['den', 'der', 'das', 'die']],
    ['Sie gratuliert ___ Bruder.', 'dem', ['den', 'der', 'die', 'das']],
    ['Ich gebe ___ Mutter Blumen.', 'meiner', ['meine', 'meinen', 'mein', 'meinem']],
    ['Er schreibt ___ Freund.', 'seinem', ['sein', 'seinen', 'seine', 'seiner']],
    ['Wir fahren mit ___ Bus.', 'dem', ['den', 'der', 'das', 'die']],
    ['Ich wohne bei ___ Eltern.', 'meinen', ['meine', 'meiner', 'mein', 'meinem']],
    ['Sie arbeitet in ___ Firma.', 'einer', ['eine', 'einen', 'ein', 'einem']],
    ['Ich bin in ___ Schule.', 'der', ['die', 'den', 'dem', 'das']],
    ['Er sitzt auf ___ Stuhl.', 'dem', ['den', 'der', 'das', 'die']],
    ['Wir essen mit ___ Freunden.', 'unseren', ['unsere', 'unserer', 'unser', 'unserem']],
    ['Ich kaufe ___ Schwester ein Geschenk.', 'meiner', ['meine', 'meinen', 'mein', 'meinem']],
    ['Er vertraut ___ Ärztin.', 'der', ['die', 'den', 'dem', 'das']],
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
    ['Ich warte auf ___ Bus.', 'den', ['der', 'dem', 'das', 'die']],
    ['Er denkt an ___ Urlaub.', 'den', ['der', 'dem', 'das', 'die']],
    ['Wir fahren durch ___ Park.', 'den', ['der', 'dem', 'das', 'die']],
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
  const items = [
    ['Ich warte auf ___ Antwort.', 'eine', ['ein', 'einen', 'einer', 'einem']],
    ['Er denkt an ___ Familie.', 'seine', ['sein', 'seinen', 'seiner', 'seinem']],
    ['Wir sprechen über ___ Reise.', 'die', ['der', 'dem', 'den', 'das']],
    ['Sie freut sich auf ___ Geburtstag.', 'den', ['der', 'dem', 'das', 'die']],
    ['Ich interessiere mich für ___ Musik.', 'klassische', ['klassischer', 'klassischen', 'klassisches', 'klassisch']],
    ['Er träumt von ___ Urlaub.', 'einem', ['ein', 'eine', 'einen', 'einer']],
    ['Wir diskutieren über ___ Problem.', 'das', ['der', 'dem', 'den', 'die']],
    ['Sie ärgert sich über ___ Fehler.', 'den', ['der', 'dem', 'das', 'die']],
    ['Ich hoffe auf ___ gutes Wetter.', 'gutes', ['guter', 'guten', 'gute', 'gutem']],
    ['Er erinnert sich an ___ Kindheit.', 'seine', ['sein', 'seinen', 'seiner', 'seinem']],
    ['Wir sprechen mit ___ Chef.', 'dem', ['den', 'der', 'das', 'die']],
    ['Sie wartet auf ___ Zug.', 'den', ['der', 'dem', 'das', 'die']],
    ['Ich danke für ___ Hilfe.', 'die', ['der', 'dem', 'den', 'das']],
    ['Er fragt nach ___ Weg.', 'dem', ['den', 'der', 'das', 'die']],
    ['Wir lachen über ___ Witz.', 'den', ['der', 'dem', 'das', 'die']],
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
    ['___ Regens wegen bleiben wir zu Hause.', 'Wegen des', ['Wegen der', 'Wegen dem', 'Wegen den', 'Wegen das']],
    ['___ Sommers freue ich mich auf Urlaub.', 'Während des', ['Während der', 'Während dem', 'Während den', 'Während das']],
    ['___ Krankheit wegen fehlt er.', 'Wegen der', ['Wegen des', 'Wegen dem', 'Wegen den', 'Wegen das']],
    ['___ Unterrichts lerne ich viel.', 'Während des', ['Während der', 'Während dem', 'Während den', 'Während das']],
    ['Trotz ___ Problems machen wir weiter.', 'des', ['der', 'dem', 'den', 'das']],
    ['Wegen ___ Sturms fällt das Fest aus.', 'des', ['der', 'dem', 'den', 'das']],
    ['___ ganzen Tages war ich unterwegs.', 'Während des', ['Während der', 'Während dem', 'Während den', 'Während das']],
    ['Trotz ___ Kälte gehen wir spazieren.', 'der', ['des', 'dem', 'den', 'das']],
    ['Wegen ___ Verspätung verpassten wir den Zug.', 'der', ['des', 'dem', 'den', 'das']],
    ['___ Prüfung wegen lernt er viel.', 'Wegen der', ['Wegen des', 'Wegen dem', 'Wegen den', 'Wegen das']],
    ['Trotz ___ Müdigkeit arbeitet sie weiter.', 'der', ['des', 'dem', 'den', 'das']],
    ['___ Ferien freuen sich die Kinder.', 'Während der', ['Während des', 'Während dem', 'Während den', 'Während das']],
    ['Wegen ___ Lärms kann ich nicht schlafen.', 'des', ['der', 'dem', 'den', 'das']],
    ['Trotz ___ Preises kaufe ich es.', 'des', ['der', 'dem', 'den', 'das']],
    ['___ Arbeit wegen ist er müde.', 'Wegen der', ['Wegen des', 'Wegen dem', 'Wegen den', 'Wegen das']],
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
  const items = [
    ['___ muss die Hausaufgaben machen.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Hier ist ___ zu Hause.', 'niemand', ['jemand', 'etwas', 'alle', 'man']],
    ['Ich habe ___ vergessen.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['Kann ___ mir helfen?', 'jemand', ['niemand', 'etwas', 'man', 'alle']],
    ['___ war sehr nett.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
    ['Ich sehe ___ auf der Straße.', 'niemanden', ['jemanden', 'etwas', 'alle', 'man']],
    ['Hast du ___ Interesse an Sport?', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ darf hier nicht rauchen.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Es gibt ___ Neues im Radio.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ hat die Tür offen gelassen.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
    ['Ich kenne ___ hier.', 'niemanden', ['jemanden', 'etwas', 'alle', 'man']],
    ['Brauchst du ___?', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ kann Fehler machen.', 'Man', ['Jemand', 'Niemand', 'Etwas', 'Alles']],
    ['Hier ist ___ falsch.', 'etwas', ['jemand', 'niemand', 'alle', 'man']],
    ['___ wartet vor der Tür.', 'Jemand', ['Niemand', 'Etwas', 'Man', 'Alles']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
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
    ['Er hat Recht ___ der Sache.', 'in', ['an', 'auf', 'mit', 'zu']],
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
    ['Wir ___ nach Hause ein.', 'fahren', ['fahren ein', 'einfahren', 'fährt', 'fahre']],
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
    ['Vom Eingang der Mall aus: Die Apotheke ist ___ .', 'auf der rechten Seite', ['auf der linken Seite', 'geradeaus', 'hinten', 'vorne']],
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
    ['Ich helfe ___ Studenten.', 'dem', ['den', 'der', 'das', 'die']],
    ['Das ist das Auto ___ Studenten.', 'des', ['der', 'dem', 'den', 'das']],
    ['Ich sehe einen ___.', 'Polizisten', ['Polizist', 'Poliziste', 'Polizists', 'Polizistin']],
    ['Er spricht mit einem ___.', 'Journalisten', ['Journalist', 'Journaliste', 'Journalists', 'Journalistin']],
    ['Wir besuchen den ___.', 'Präsidenten', ['Präsident', 'Präsidente', 'Präsidents', 'Präsidentin']],
    ['Das ist der Wagen ___ Nachbarn.', 'des', ['der', 'dem', 'den', 'das']],
    ['Ich kenne einen ___.', 'Italiener', ['Italienen', 'Italienens', 'Italienener', 'Italienisch']],
    ['Er ist ___ geworden.', 'Pilot', ['Piloten', 'Pilote', 'Pilots', 'Pilotin']],
    ['Wir fragen den ___.', 'Fotografen', ['Fotograf', 'Fotografe', 'Fotografs', 'Fotografin']],
    ['Ich grüße den ___.', 'Herrn', ['Herr', 'Herre', 'Herrs', 'Frau']],
    ['Das ist das Buch ___ Autors.', 'des', ['der', 'dem', 'den', 'das']],
    ['Er trifft einen ___.', 'Komponisten', ['Komponist', 'Komponiste', 'Komponists', 'Komponistin']],
    ['Ich sehe den ___.', 'Löwen', ['Löwe', 'Löw', 'Löwes', 'Löwin']],
    ['Wir helfen dem ___.', 'Kunden', ['Kunde', 'Kunden', 'Kundes', 'Kundin']],
    ['Das ist der Name ___ Studenten.', 'des', ['der', 'dem', 'den', 'das']],
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
