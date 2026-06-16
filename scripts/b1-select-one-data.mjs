/**
 * B1 select-one question banks — 50 items per grammar topic.
 * Communicative contexts: work, university, news, health, environment, politics, travel.
 */

import { options4, ensure50 } from './b1-select-one-shared.mjs';

/** @typedef {import('./b1-select-one-shared.mjs').Q} Q */

export function genAdjektivdeklinationB1() {
  const items = [
    ['In einem ___ Büro arbeiten viele junge Kollegen.', 'modernen', ['moderne', 'moderner', 'modernes', 'modernem']],
    ['Der Chef präsentiert einen ___ Bericht vor der Abteilung.', 'wichtigen', ['wichtige', 'wichtiger', 'wichtiges', 'wichtigem']],
    ['Der ___ Studiengang an der Universität ist sehr beliebt.', 'neue', ['neuer', 'neuen', 'neues', 'neuem']],
    ['Sie liest einen ___ Artikel über Umweltschutz.', 'interessanten', ['interessante', 'interessanter', 'interessantes', 'interessantem']],
    ['Wegen ___ Wetters fällt die Reise aus.', 'schlechten', ['schlechte', 'schlechter', 'schlechtes', 'schlechtem']],
    ['Er diskutiert mit einer ___ Politikerin.', 'erfahrenen', ['erfahrene', 'erfahrener', 'erfahrenes', 'erfahrenem']],
    ['In einem ___ Krankenhaus gibt es moderne Geräte.', 'großen', ['große', 'großer', 'großes', 'großem']],
    ['Die Zeitung berichtet über eine ___ Entwicklung.', 'aktuelle', ['aktuellen', 'aktueller', 'aktuelles', 'aktuellem']],
    ['Trotz ___ Preises buchen viele die Reise.', 'hohen', ['hohe', 'hoher', 'hohes', 'hohem']],
    ['Wir sprechen mit einem ___ Professor über das Projekt.', 'neuen', ['neue', 'neuer', 'neues', 'neuem']],
    ['Die ___ Konferenz beginnt morgen.', 'internationale', ['internationalen', 'internationaler', 'internationales', 'internationalem']],
    ['Er hat einen ___ Rat für meine Bewerbung.', 'guten', ['gute', 'guter', 'gutes', 'gutem']],
    ['In einer ___ Gegend der Stadt wohnt die Familie.', 'ruhigen', ['ruhige', 'ruhiger', 'ruhiges', 'ruhigem']],
    ['Das ist ein ___ Thema in der Politik.', 'wichtiges', ['wichtige', 'wichtiger', 'wichtigen', 'wichtigem']],
    ['Sie reist mit ___ Gepäck nach Italien.', 'kleinem', ['kleinen', 'kleine', 'kleiner', 'kleines']],
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

export function genAkkusativB1() {
  const items = [
    ['Der Journalist recherchiert ___ komplexen Fall.', 'einen', ['ein', 'eine', 'einer', 'einem']],
    ['Ich warte auf ___ Antwort der Personalabteilung.', 'die', ['der', 'dem', 'den', 'das']],
    ['Sie bereitet ___ Prüfung an der Universität vor.', 'eine', ['ein', 'einen', 'einer', 'einem']],
    ['Er informiert ___ Kollegen über die neue Regelung.', 'seine', ['sein', 'seinen', 'seiner', 'seinem']],
    ['Wir lesen ___ Bericht über die Klimakonferenz.', 'den', ['der', 'dem', 'das', 'die']],
    ['Die Ärztin verschreibt ___ Medikament.', 'ein', ['eine', 'einen', 'einer', 'einem']],
    ['Ich interessiere mich für ___ Stelle im Ausland.', 'eine', ['ein', 'einen', 'einer', 'einem']],
    ['Er denkt an ___ wichtige Entscheidung.', 'eine', ['ein', 'einen', 'einer', 'einem']],
    ['Wir besuchen ___ Ausstellung über erneuerbare Energien.', 'eine', ['ein', 'einen', 'einer', 'einem']],
    ['Sie reserviert ___ Zimmer im Hotel.', 'ein', ['eine', 'einen', 'einer', 'einem']],
    ['Der Minister erklärt ___ neue Politik.', 'die', ['der', 'dem', 'den', 'das']],
    ['Ich suche ___ geeigneten Kurs für B1.', 'einen', ['ein', 'eine', 'einer', 'einem']],
    ['Er freut sich auf ___ Geschäftsreise.', 'die', ['der', 'dem', 'den', 'das']],
    ['Wir diskutieren ___ Problem im Team.', 'das', ['der', 'dem', 'den', 'die']],
    ['Sie kauft ___ Ticket für den Zug.', 'ein', ['eine', 'einen', 'einer', 'einem']],
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

export function genDemonstrativartikel() {
  const items = [
    ['___ Projekt gefällt mir besser als das andere.', 'Dieses', ['Diese', 'Dieser', 'Diesen', 'Diesem']],
    ['___ Kollegin aus der Abteilung hilft mir oft.', 'Diese', ['Dieser', 'Dieses', 'Diesen', 'Diesem']],
    ['___ Professor erklärt das Thema sehr verständlich.', 'Dieser', ['Diese', 'Dieses', 'Diesen', 'Diesem']],
    ['Ich habe ___ Nachrichten schon gelesen.', 'diese', ['dieser', 'dieses', 'diesen', 'diesem']],
    ['___ Hotel war deutlich teurer als jenes.', 'Jenes', ['Jene', 'Jener', 'Jenen', 'Jenem']],
    ['___ Artikel in der Zeitung ist sehr aktuell.', 'Dieser', ['Diese', 'Dieses', 'Diesen', 'Diesem']],
    ['Wir wählen ___ Kandidaten für das Amt.', 'diesen', ['dieser', 'diese', 'dieses', 'diesem']],
    ['___ Studiengang passt besser zu meinen Interessen.', 'Dieser', ['Diese', 'Dieses', 'Diesen', 'Diesem']],
    ['Er vertraut ___ Meinung seines Chefs.', 'jener', ['jene', 'jenes', 'jenen', 'jenem']],
    ['___ Reiseziel empfehle ich dir besonders.', 'Dieses', ['Diese', 'Dieser', 'Diesen', 'Diesem']],
    ['___ Patienten müssen länger warten.', 'Diese', ['Dieser', 'Dieses', 'Diesen', 'Diesem']],
    ['Ich kenne ___ Politiker aus dem Fernsehen.', 'jenen', ['jene', 'jenes', 'jener', 'jenem']],
    ['___ Gesetz wurde gestern verabschiedet.', 'Dieses', ['Diese', 'Dieser', 'Diesen', 'Diesem']],
    ['___ Vorlesung war interessanter als die andere.', 'Diese', ['Dieser', 'Dieses', 'Diesen', 'Diesem']],
    ['Wir diskutieren ___ Vorschlag im Meeting.', 'diesen', ['dieser', 'diese', 'dieses', 'diesem']],
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

export function genErgaenzungssatz() {
  const items = [
    ['Ich finde, ___ die neue Regelung sinnvoll ist.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Der Chef sagt, ___ das Meeting verschoben wird.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Sie hofft, ___ sie die Prüfung besteht.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Es ist klar, ___ wir mehr Zeit brauchen.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Der Arzt meint, ___ du mehr schlafen solltest.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Ich glaube, ___ die Nachrichten übertreiben.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Er behauptet, ___ er alles richtig gemacht hat.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Wir sind überzeugt, ___ das Projekt gelingt.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Die Professorin erklärt, ___ der Kurs anspruchsvoll ist.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Man hört, ___ die Preise steigen.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Ich finde es gut, ___ du mitkommst.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Sie bestätigt, ___ der Flug pünktlich startet.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Es stimmt, ___ Umweltschutz wichtig ist.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Er merkt, ___ er einen Fehler gemacht hat.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
    ['Wir wissen, ___ die Entscheidung schwer war.', 'dass', ['weil', 'wenn', 'ob', 'denn']],
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

export function genFinalsatz() {
  const items = [
    ['Er lernt Deutsch, ___ in Berlin arbeiten zu können.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Sie spart Geld, ___ nächstes Jahr reisen zu können.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Ich nehme Medikamente, ___ die Schmerzen lindern.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Er informiert die Kollegen, ___ alle Bescheid wissen.', 'damit', ['um', 'weil', 'dass', 'wenn']],
    ['Wir fahren früh los, ___ den Zug nicht zu verpassen.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Die Firma schult das Personal, ___ die Qualität steigt.', 'damit', ['um', 'weil', 'dass', 'wenn']],
    ['Sie liest Fachliteratur, ___ die Prüfung zu bestehen.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Er erklärt alles genau, ___ niemand etwas missversteht.', 'damit', ['um', 'weil', 'dass', 'wenn']],
    ['Ich trinke Wasser, ___ gesund zu bleiben.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Die Regierung investiert, ___ die Wirtschaft wächst.', 'damit', ['um', 'weil', 'dass', 'wenn']],
    ['Wir melden uns rechtzeitig an, ___ einen Platz zu bekommen.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Sie schreibt eine Zusammenfassung, ___ der Chef sie schnell liest.', 'damit', ['um', 'weil', 'dass', 'wenn']],
    ['Er macht Sport, ___ fit zu bleiben.', 'um', ['damit', 'weil', 'dass', 'wenn']],
    ['Die Universität bietet Tutorien an, ___ die Studierenden besser lernen.', 'damit', ['um', 'weil', 'dass', 'wenn']],
    ['Ich packe warme Kleidung ein, ___ mich nicht zu erkälten.', 'um', ['damit', 'weil', 'dass', 'wenn']],
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

export function genIndirekteFragesaetze() {
  const items = [
    ['Ich weiß nicht, ___ der Termin stattfindet.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Kannst du mir sagen, ___ der Zug ankommt?', 'wann', ['weil', 'dass', 'ob', 'denn']],
    ['Er fragt, ___ wir morgen kommen.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Ich interessiere mich dafür, ___ die neue Regelung bedeutet.', 'was', ['weil', 'dass', 'ob', 'denn']],
    ['Sie möchte wissen, ___ der Kurs beginnt.', 'wann', ['weil', 'dass', 'ob', 'denn']],
    ['Wir sind uns nicht sicher, ___ das stimmt.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Er erkundigt sich, ___ viel die Behandlung kostet.', 'wie', ['weil', 'dass', 'ob', 'denn']],
    ['Ich frage mich, ___ er recht hat.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Kannst du prüfen, ___ das Medikament verfügbar ist?', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Sie will wissen, ___ der Minister gesagt hat.', 'was', ['weil', 'dass', 'ob', 'denn']],
    ['Ich bin gespannt, ___ die Reise dauert.', 'wie lange', ['weil', 'dass', 'ob', 'denn']],
    ['Er fragt, ___ wir schon gebucht haben.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Wir wissen nicht, ___ das Problem gelöst wird.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Sie erkundigt sich, ___ der Professor heute da ist.', 'ob', ['weil', 'dass', 'wenn', 'denn']],
    ['Ich möchte wissen, ___ du denkst.', 'was', ['weil', 'dass', 'ob', 'denn']],
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

export function genKausalsatz() {
  const items = [
    ['Ich bleibe zu Hause, ___ ich krank bin.', 'weil', ['denn', 'deshalb', 'obwohl', 'dass']],
    ['___ er viel gelernt hat, hat er die Prüfung bestanden.', 'Weil', ['Denn', 'Deshalb', 'Obwohl', 'Dass']],
    ['Er kommt nicht mit, ___ er noch arbeiten muss.', 'weil', ['denn', 'deshalb', 'obwohl', 'dass']],
    ['Ich bin müde, ___ ich habe wenig geschlafen.', 'denn', ['weil', 'deshalb', 'obwohl', 'da']],
    ['___ die Nachfrage steigt, werden die Preise höher.', 'Da', ['Denn', 'Deshalb', 'Obwohl', 'Dass']],
    ['Sie kündigt, ___ sie eine bessere Stelle gefunden hat.', 'weil', ['denn', 'deshalb', 'obwohl', 'dass']],
    ['Das Flugzeug hat Verspätung, ___ es stürmt.', 'weil', ['denn', 'deshalb', 'obwohl', 'dass']],
    ['Er ist gestresst, ___ er hat zu viel zu tun.', 'denn', ['weil', 'deshalb', 'obwohl', 'da']],
    ['___ das Wetter schlecht ist, fällt das Fest aus.', 'Weil', ['Denn', 'Deshalb', 'Obwohl', 'Dass']],
    ['Wir fahren mit dem Zug, ___ das Auto kaputt ist.', 'weil', ['denn', 'deshalb', 'obwohl', 'dass']],
    ['Die Straßen sind nass, ___ es geregnet hat.', 'denn', ['weil', 'deshalb', 'obwohl', 'da']],
    ['___ die Politik sich ändert, reagieren viele Bürger.', 'Da', ['Denn', 'Deshalb', 'Obwohl', 'Dass']],
    ['Ich trinke Tee, ___ ich Halsweh habe.', 'weil', ['denn', 'deshalb', 'obwohl', 'dass']],
    ['Er ist pünktlich, ___ er den frühen Bus genommen hat.', 'denn', ['weil', 'deshalb', 'obwohl', 'da']],
    ['___ die Heizung defekt ist, ist es im Büro kalt.', 'Weil', ['Denn', 'Deshalb', 'Obwohl', 'Dass']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 61), correct: c });
    }
    return out;
  });
}

export function genKonjunktiv2() {
  const items = [
    ['Wenn ich mehr Zeit ___, würde ich ein Praktikum machen.', 'hätte', ['habe', 'hatte', 'haben', 'hätten']],
    ['An deiner Stelle ___ ich den Arzt anrufen.', 'würde', ['werde', 'wurde', 'worden', 'wird']],
    ['Wenn das Wetter besser ___, könnten wir wandern gehen.', 'wäre', ['ist', 'war', 'wird', 'sein']],
    ['Ich ___ gern weniger arbeiten.', 'würde', ['werde', 'wurde', 'worden', 'wird']],
    ['Wenn ich reich ___, würde ich um die Welt reisen.', 'wäre', ['bin', 'war', 'wird', 'sein']],
    ['Du ___ mehr Wasser trinken.', 'solltest', ['sollst', 'soll', 'sollten', 'sollt']],
    ['Wenn er hier ___, könnte er uns helfen.', 'wäre', ['ist', 'war', 'wird', 'sein']],
    ['Ich ___ das gern machen, aber ich habe keine Zeit.', 'würde', ['werde', 'wurde', 'worden', 'wird']],
    ['Wenn sie früher gekommen ___, hätten wir noch Platz gehabt.', 'wäre', ['ist', 'war', 'wird', 'sein']],
    ['An deiner Stelle ___ ich mich bewerben.', 'würde', ['werde', 'wurde', 'worden', 'wird']],
    ['Wenn ich das ___, wüsste ich die Antwort.', 'wüsste', ['weiß', 'wusste', 'wissen', 'wisst']],
    ['Er ___ gern Professor werden.', 'würde', ['werde', 'wurde', 'worden', 'wird']],
    ['Wenn das möglich ___, würden wir sofort starten.', 'wäre', ['ist', 'war', 'wird', 'sein']],
    ['Ich ___ dir gern helfen, wenn ich könnte.', 'würde', ['werde', 'wurde', 'worden', 'wird']],
    ['Wenn ich den Job ___, würde ich sofort anfangen.', 'hätte', ['habe', 'hatte', 'haben', 'hätten']],
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

export function genKonditionalsatz() {
  const items = [
    ['___ du morgen Zeit hast, treffen wir uns.', 'Wenn', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ es regnet, nehmen wir einen Schirm mit.', 'Falls', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ der Zug ankommt, fahren wir los.', 'Sobald', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ ich die Stelle bekomme, ziehe ich um.', 'Wenn', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ die Prüfung schwer ist, bleibe ich ruhig.', 'Wenn', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ du Fragen hast, schreib mir.', 'Falls', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ der Arzt kommt, warten wir im Wartezimmer.', 'Sobald', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ das Gesetz verabschiedet wird, ändert sich vieles.', 'Wenn', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ du dich erkältest, bleib zu Hause.', 'Falls', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ wir eingecheckt haben, gehen wir essen.', 'Sobald', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ die Sonne scheint, machen wir einen Ausflug.', 'Wenn', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ der Termin ausfällt, informiere ich dich.', 'Falls', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ die Ergebnisse da sind, rufe ich an.', 'Sobald', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ du pünktlich bist, beginnen wir.', 'Wenn', ['Weil', 'Obwohl', 'Dass', 'Damit']],
    ['___ etwas schiefgeht, melde dich sofort.', 'Falls', ['Weil', 'Obwohl', 'Dass', 'Damit']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 81), correct: c });
    }
    return out;
  });
}

export function genKonzessivsatzB1() {
  const items = [
    ['___ er wenig schläft, arbeitet er sehr produktiv.', 'Obwohl', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Sie geht joggen, ___ es kalt ist.', 'obwohl', ['weil', 'deshalb', 'dass', 'damit']],
    ['___ das Essen teuer war, hat es gut geschmeckt.', 'Obschon', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Er ist müde; ___ hat er Überstunden gemacht.', 'trotzdem', ['weil', 'obwohl', 'dass', 'damit']],
    ['___ die Prüfung schwer war, hat sie bestanden.', 'Obwohl', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Das Projekt ist schwierig; ___ geben wir nicht auf.', 'trotzdem', ['weil', 'obwohl', 'dass', 'damit']],
    ['___ er kein Auto hat, kommt er immer pünktlich.', 'Obwohl', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Die Nachrichten sind negativ, ___ bleibt er optimistisch.', 'trotzdem', ['weil', 'obwohl', 'dass', 'damit']],
    ['___ das Medikament teuer ist, kauft er es.', 'Obschon', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Es regnet, ___ fahren wir in den Urlaub.', 'trotzdem', ['weil', 'obwohl', 'dass', 'damit']],
    ['___ die Politik umstritten ist, diskutieren viele Menschen.', 'Obwohl', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Sie hat wenig Zeit, ___ hilft sie uns.', 'trotzdem', ['weil', 'obwohl', 'dass', 'damit']],
    ['___ die Vorlesung lang war, war sie interessant.', 'Obschon', ['Weil', 'Deshalb', 'Dass', 'Damit']],
    ['Der Verkehr ist schlimm, ___ kommt er rechtzeitig an.', 'trotzdem', ['weil', 'obwohl', 'dass', 'damit']],
    ['___ die Umwelt belastet ist, reisen viele weiter viel.', 'Obwohl', ['Weil', 'Deshalb', 'Dass', 'Damit']],
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

export function genKonjunktionaladverbien() {
  const items = [
    ['Es regnete den ganzen Tag. ___, sind wir spazieren gegangen.', 'Trotzdem', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Er hat viel gelernt. ___, hat er die Prüfung bestanden.', 'Deshalb', ['Trotzdem', 'Weil', 'Dennoch', 'Denn']],
    ['Sie spricht fließend Englisch. ___, kann sie auch Französisch.', 'Außerdem', ['Deshalb', 'Trotzdem', 'Weil', 'Denn']],
    ['Das Projekt ist teuer. ___, lohnt es sich.', 'Dennoch', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Ich war krank. ___, habe ich die Vorlesung verpasst.', 'Deshalb', ['Trotzdem', 'Weil', 'Außerdem', 'Denn']],
    ['Der Arzt riet zur Ruhe. ___, arbeitet er weiter.', 'Trotzdem', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Die Nachrichten sind alarmierend. ___, bleiben viele ruhig.', 'Dennoch', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Er hat Überstunden gemacht. ___, ist er müde.', 'Deshalb', ['Trotzdem', 'Weil', 'Außerdem', 'Denn']],
    ['Sie studiert Medizin. ___, jobbt sie nebenbei.', 'Außerdem', ['Deshalb', 'Trotzdem', 'Weil', 'Denn']],
    ['Das Hotel war laut. ___, haben wir gut geschlafen.', 'Trotzdem', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Die Politik ändert sich. ___, reagieren die Bürger.', 'Deshalb', ['Trotzdem', 'Weil', 'Außerdem', 'Denn']],
    ['Das Essen war teuer. ___, war die Qualität hoch.', 'Dennoch', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Er spart Energie. ___, senkt er seine Kosten.', 'Deshalb', ['Trotzdem', 'Weil', 'Außerdem', 'Denn']],
    ['Sie hat wenig Erfahrung. ___, bekommt sie die Stelle.', 'Trotzdem', ['Deshalb', 'Weil', 'Außerdem', 'Denn']],
    ['Wir brauchen Hilfe. ___, rufen wir einen Experten.', 'Deshalb', ['Trotzdem', 'Weil', 'Außerdem', 'Denn']],
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

export function genLokalePraepositionenB1() {
  const items = [
    ['Das Büro liegt direkt ___ dem Bahnhof.', 'gegenüber', ['neben', 'hinter', 'unter', 'zwischen']],
    ['Die Apotheke ist ___ der Ecke.', 'an', ['auf', 'in', 'zu', 'nach']],
    ['Wir treffen uns ___ dem Eingang der Universität.', 'vor', ['hinter', 'neben', 'unter', 'zwischen']],
    ['Das Krankenhaus befindet sich ___ der Stadtmitte.', 'in', ['an', 'auf', 'zu', 'nach']],
    ['Geh ___ die Brücke und dann links!', 'über', ['unter', 'neben', 'hinter', 'durch']],
    ['Das Café ist ___ dem Park.', 'neben', ['gegenüber', 'hinter', 'unter', 'zwischen']],
    ['Fahren Sie ___ den Tunnel!', 'durch', ['über', 'unter', 'neben', 'hinter']],
    ['Das Hotel liegt ___ dem Fluss.', 'an', ['in', 'auf', 'zu', 'nach']],
    ['Wir warten ___ dem Rathaus.', 'vor', ['hinter', 'neben', 'unter', 'zwischen']],
    ['Die Klinik ist ___ der dritten Etage.', 'auf', ['an', 'in', 'zu', 'nach']],
    ['Das Museum ist ___ zwei Gebäuden.', 'zwischen', ['neben', 'hinter', 'vor', 'gegenüber']],
    ['Er wohnt ___ dem Land.', 'auf', ['an', 'in', 'zu', 'nach']],
    ['Das Reisebüro ist ___ der Hauptstraße.', 'in', ['an', 'auf', 'zu', 'nach']],
    ['Wir gehen ___ die Straße.', 'über', ['unter', 'neben', 'hinter', 'durch']],
    ['Der Park liegt ___ dem Wohnviertel.', 'hinter', ['vor', 'neben', 'gegenüber', 'zwischen']],
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

export function genNomenPraepositionB1() {
  const items = [
    ['Sie hat großes Interesse ___ dem neuen Studiengang.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Angst ___ der Operation.', 'vor', ['an', 'auf', 'in', 'mit']],
    ['Wir haben Hoffnung ___ bessere Arbeitsbedingungen.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Die Firma hat Bedarf ___ Fachkräften.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Respekt ___ erfahrenen Kollegen.', 'vor', ['an', 'auf', 'in', 'mit']],
    ['Sie hat Lust ___ einer Reise nach Spanien.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Ich habe Vertrauen ___ unser Team.', 'in', ['an', 'auf', 'mit', 'zu']],
    ['Er hat Erfolg ___ der Prüfung.', 'bei', ['an', 'auf', 'in', 'mit']],
    ['Wir haben Zweifel ___ der neuen Politik.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Sie hat Freude ___ ihrer Arbeit.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Er hat Anteil ___ dem Erfolg des Teams.', 'an', ['am', 'auf', 'in', 'mit']],
    ['Die Patientin hat Schmerzen ___ Rücken.', 'im', ['am', 'auf', 'an', 'mit']],
    ['Wir haben Einfluss ___ die Entscheidung.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Er hat Erfahrung ___ diesem Bereich.', 'in', ['an', 'auf', 'mit', 'zu']],
    ['Sie hat Angst ___ großen Hunden.', 'vor', ['an', 'auf', 'in', 'mit']],
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

export function genPassivB1() {
  const items = [
    ['Das neue Gesetz ___ morgen verabschiedet.', 'wird', ['ist', 'wurde', 'hat', 'war']],
    ['Der Bericht ___ gestern veröffentlicht.', 'wurde', ['wird', 'ist', 'hat', 'war']],
    ['Die Patienten ___ regelmäßig untersucht.', 'werden', ['wird', 'wurde', 'ist', 'hat']],
    ['Das Projekt ___ gerade diskutiert.', 'wird', ['ist', 'wurde', 'hat', 'war']],
    ['Die Tickets ___ online verkauft.', 'werden', ['wird', 'wurde', 'ist', 'hat']],
    ['Die Straße ___ letztes Jahr renoviert.', 'wurde', ['wird', 'ist', 'hat', 'war']],
    ['Das Medikament ___ in Apotheken angeboten.', 'wird', ['ist', 'wurde', 'hat', 'war']],
    ['Alle Bewerbungen ___ bis Freitag geprüft.', 'werden', ['wird', 'wurde', 'ist', 'hat']],
    ['Die Nachricht ___ sofort gesendet.', 'wurde', ['wird', 'ist', 'hat', 'war']],
    ['Der Termin ___ verschoben.', 'wird', ['ist', 'wurde', 'hat', 'war']],
    ['Die Ergebnisse ___ nächste Woche bekannt gegeben.', 'werden', ['wird', 'wurde', 'ist', 'hat']],
    ['Das Haus ___ früher als Schule genutzt.', 'wurde', ['wird', 'ist', 'hat', 'war']],
    ['Die Prüfung ___ in zwei Räumen durchgeführt.', 'wird', ['ist', 'wurde', 'hat', 'war']],
    ['Die Abfälle ___ getrennt gesammelt.', 'werden', ['wird', 'wurde', 'ist', 'hat']],
    ['Der Vertrag ___ gestern unterzeichnet.', 'wurde', ['wird', 'ist', 'hat', 'war']],
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

export function genPerfektB1() {
  const items = [
    ['Der Minister ___ die neue Regelung erklärt.', 'hat', ['ist', 'haben', 'wird', 'war']],
    ['Wir ___ pünktlich am Flughafen angekommen.', 'sind', ['haben', 'hat', 'wird', 'war']],
    ['Sie ___ sich für den Kurs angemeldet.', 'hat', ['ist', 'haben', 'wird', 'war']],
    ['Ich ___ den Artikel gestern gelesen.', 'habe', ['bin', 'ist', 'wird', 'war']],
    ['Die Studierenden ___ lange über das Thema diskutiert.', 'haben', ['sind', 'hat', 'wird', 'war']],
    ['Er ___ nach Berlin gefahren.', 'ist', ['hat', 'haben', 'wird', 'war']],
    ['Wir ___ die Rechnung schon bezahlt.', 'haben', ['sind', 'hat', 'wird', 'war']],
    ['Sie ___ sich beim Sport verletzt.', 'hat', ['ist', 'haben', 'wird', 'war']],
    ['Ich ___ die ganze Nacht gearbeitet.', 'habe', ['bin', 'ist', 'wird', 'war']],
    ['Die Politiker ___ eine Einigung erzielt.', 'haben', ['sind', 'hat', 'wird', 'war']],
    ['Er ___ das Medikament eingenommen.', 'hat', ['ist', 'haben', 'wird', 'war']],
    ['Wir ___ den ganzen Tag gereist.', 'sind', ['haben', 'hat', 'wird', 'war']],
    ['Sie ___ ein wichtiges Gespräch geführt.', 'hat', ['ist', 'haben', 'wird', 'war']],
    ['Ich ___ mich über das Ergebnis gefreut.', 'habe', ['bin', 'ist', 'wird', 'war']],
    ['Die Firma ___ viele neue Mitarbeiter eingestellt.', 'hat', ['ist', 'haben', 'wird', 'war']],
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

export function genPraepositionenGenitivB1() {
  const items = [
    ['___ des schlechten Wetters fällt die Veranstaltung aus.', 'Wegen', ['Trotz', 'Während', 'Statt', 'Ohne']],
    ['___ der Erkrankung bleibt er zu Hause.', 'Wegen', ['Trotz', 'Während', 'Statt', 'Ohne']],
    ['___ des Unterrichts ist es im Gebäude ruhig.', 'Während', ['Wegen', 'Trotz', 'Statt', 'Ohne']],
    ['___ der Ferien arbeitet sie in einem Café.', 'Während', ['Wegen', 'Trotz', 'Statt', 'Ohne']],
    ['___ der hohen Kosten gehen wir trotzdem auf Reisen.', 'Trotz', ['Wegen', 'Während', 'Statt', 'Ohne']],
    ['___ der Warnung fahren viele zu schnell.', 'Trotz', ['Wegen', 'Während', 'Statt', 'Ohne']],
    ['___ des Sturms bleiben die Schiffe im Hafen.', 'Wegen', ['Trotz', 'Während', 'Statt', 'Ohne']],
    ['___ der Debatte dürfen Zuschauer nicht sprechen.', 'Während', ['Wegen', 'Trotz', 'Statt', 'Ohne']],
    ['___ der guten Vorbereitung war sie nervös.', 'Trotz', ['Wegen', 'Während', 'Statt', 'Ohne']],
    ['___ der Reparatur kann man die Straße nicht benutzen.', 'Während', ['Wegen', 'Trotz', 'Statt', 'Ohne']],
    ['___ der Verspätung verpassten wir den Anschlusszug.', 'Wegen', ['Trotz', 'Während', 'Statt', 'Ohne']],
    ['___ des Regens gehen wir spazieren.', 'Trotz', ['Wegen', 'Während', 'Statt', 'Ohne']],
    ['___ der Sitzung ist das Büro geschlossen.', 'Während', ['Wegen', 'Trotz', 'Statt', 'Ohne']],
    ['___ der hohen Nachfrage steigen die Preise.', 'Wegen', ['Trotz', 'Während', 'Statt', 'Ohne']],
    ['___ der Kritik setzt die Regierung das Projekt fort.', 'Trotz', ['Wegen', 'Während', 'Statt', 'Ohne']],
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

export function genPraepositionaleErgaenzung() {
  const items = [
    ['Ich warte ___ die Antwort der Personalabteilung.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Er denkt oft ___ seine Zukunft.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Wir sprechen ___ das neue Gesetz.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Sie freut sich ___ die Reise.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Er interessiert sich ___ Politik.', 'für', ['an', 'auf', 'in', 'mit']],
    ['Ich erinnere mich ___ unseren letzten Urlaub.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Sie ärgert sich ___ den Fehler.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Wir hoffen ___ gutes Wetter.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Er fragt ___ dem Weg zum Krankenhaus.', 'nach', ['an', 'auf', 'in', 'mit']],
    ['Ich danke ___ deine Hilfe.', 'für', ['an', 'auf', 'in', 'mit']],
    ['Sie träumt ___ einer Stelle im Ausland.', 'von', ['an', 'auf', 'in', 'mit']],
    ['Wir diskutieren ___ dem Projekt.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Er wartet ___ dem Arzt.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Ich bestehe ___ einer klaren Antwort.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Sie achtet ___ ihre Gesundheit.', 'auf', ['an', 'in', 'mit', 'zu']],
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

export function genPraepositionaleAdverbien() {
  const items = [
    ['Interessierst du dich für den Kurs? — Ja, ich interessiere mich ___.', 'dafür', ['darauf', 'daran', 'darüber', 'damit']],
    ['Wann denkst du an den Termin? — Ich denke ___.', 'daran', ['darauf', 'dafür', 'darüber', 'damit']],
    ['Freust du dich auf die Reise? — Ich freue mich ___.', 'darauf', ['daran', 'dafür', 'darüber', 'damit']],
    ['Sprichst du über das Problem? — Ja, wir sprechen ___.', 'darüber', ['darauf', 'daran', 'dafür', 'damit']],
    ['Hoffst du auf bessere Zeiten? — Ich hoffe ___.', 'darauf', ['daran', 'dafür', 'darüber', 'damit']],
    ['Erinnerst du dich an die Vorlesung? — Ich erinnere mich ___.', 'daran', ['darauf', 'dafür', 'darüber', 'damit']],
    ['Wartest du auf die Ergebnisse? — Ich warte ___.', 'darauf', ['daran', 'dafür', 'darüber', 'damit']],
    ['Kümmerst du dich um die Patienten? — Ja, ich kümmere mich ___.', 'darum', ['darauf', 'daran', 'dafür', 'damit']],
    ['Ärgerst du dich über die Nachricht? — Ich ärgere mich ___.', 'darüber', ['darauf', 'daran', 'dafür', 'damit']],
    ['Hilfst du bei dem Projekt? — Ja, ich helfe ___.', 'dabei', ['darauf', 'daran', 'dafür', 'damit']],
    ['Bestehst du auf deiner Meinung? — Ich bestehe ___.', 'darauf', ['daran', 'dafür', 'darüber', 'damit']],
    ['Vertraust du in das Team? — Ich vertraue ___.', 'darin', ['darauf', 'daran', 'dafür', 'damit']],
    ['Teilnimmst du an der Konferenz? — Ich nehme ___.', 'daran teil', ['darauf', 'dafür', 'darüber', 'damit']],
    ['Informierst du dich über das Gesetz? — Ich informiere mich ___.', 'darüber', ['darauf', 'daran', 'dafür', 'damit']],
    ['Was hältst du von dem Vorschlag? — Ich halte nichts ___.', 'davon', ['darauf', 'daran', 'dafür', 'damit']],
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

export function genPossessivartikelB1() {
  const items = [
    ['Wegen ___ schweren Erkrankung bleibt er zu Hause.', 'seiner', ['sein', 'seine', 'seinen', 'seinem']],
    ['Das ist die Meinung ___ Kollegen.', 'meines', ['mein', 'meine', 'meinen', 'meinem']],
    ['Sie hilft ___ neuen Chefin bei der Einarbeitung.', 'ihrer', ['ihr', 'ihre', 'ihren', 'ihrem']],
    ['Wir feiern ___ zehnjähriges Firmenjubiläum.', 'unser', ['unsere', 'unseren', 'unserer', 'unserem']],
    ['Trotz ___ geringen Erfahrung bekommt er die Stelle.', 'seiner', ['sein', 'seine', 'seinen', 'seinem']],
    ['Das ist das Auto ___ Professors.', 'meines', ['mein', 'meine', 'meinen', 'meinem']],
    ['Er kennt ___ Nachbarn schon lange.', 'seine', ['sein', 'seinen', 'seiner', 'seinem']],
    ['Während ___ Studiums arbeitete sie nebenbei.', 'ihres', ['ihr', 'ihre', 'ihren', 'ihrem']],
    ['Wir diskutieren ___ gemeinsame Zukunft.', 'unsere', ['unser', 'unseren', 'unserer', 'unserem']],
    ['Das ist die Entscheidung ___ Ministers.', 'seines', ['sein', 'seine', 'seinen', 'seinem']],
    ['Sie besucht ___ Eltern am Wochenende.', 'ihre', ['ihr', 'ihren', 'ihrer', 'ihrem']],
    ['Wegen ___ Verspätung verpasste ich den Termin.', 'meiner', ['mein', 'meine', 'meinen', 'meinem']],
    ['Er vertraut ___ Instinkt.', 'seinem', ['sein', 'seine', 'seinen', 'seiner']],
    ['Das ist das Ziel ___ Partei.', 'unserer', ['unser', 'unsere', 'unseren', 'unserem']],
    ['Wir unterstützen ___ jüngeren Kollegen.', 'unseren', ['unser', 'unsere', 'unserer', 'unserem']],
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

export function genPraepositionenB1() {
  const items = [
    ['Die Besprechung findet ___ Montag statt.', 'am', ['im', 'um', 'an', 'in']],
    ['Er arbeitet ___ 8 Uhr.', 'ab', ['von', 'bis', 'seit', 'nach']],
    ['Wir warten ___ den Arzt.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Sie ist ___ der Universität.', 'an', ['in', 'auf', 'zu', 'nach']],
    ['Das Gesetz gilt ___ nächsten Monat.', 'ab', ['von', 'bis', 'seit', 'nach']],
    ['Er fährt ___ Berlin nach Hamburg.', 'von', ['aus', 'in', 'zu', 'nach']],
    ['Wir treffen uns ___ halb neun.', 'um', ['am', 'im', 'an', 'in']],
    ['Sie wohnt ___ dem Land.', 'auf', ['an', 'in', 'zu', 'nach']],
    ['Ich bin ___ 2020 hier.', 'seit', ['von', 'bis', 'ab', 'nach']],
    ['Das Büro ist ___ 18 Uhr geöffnet.', 'bis', ['von', 'seit', 'ab', 'nach']],
    ['Er reist ___ Italien.', 'nach', ['in', 'zu', 'an', 'auf']],
    ['Wir diskutieren ___ den neuen Plan.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Sie kommt ___ der Türkei.', 'aus', ['von', 'in', 'zu', 'nach']],
    ['Das Hotel liegt ___ der Küste.', 'an', ['in', 'auf', 'zu', 'nach']],
    ['Er ist ___ dem Geschäft.', 'in', ['auf', 'an', 'zu', 'nach']],
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

export function genRelativsatzB1() {
  const items = [
    ['Der Kollege, ___ neben mir sitzt, ist neu.', 'der', ['die', 'das', 'den', 'dem']],
    ['Die Professorin, ___ ich gestern traf, war nett.', 'die', ['der', 'das', 'den', 'dem']],
    ['Das Projekt, ___ wir planen, ist ambitioniert.', 'das', ['der', 'die', 'den', 'dem']],
    ['Der Patient, ___ der Arzt behandelt, fühlt sich besser.', 'den', ['der', 'die', 'das', 'dem']],
    ['Die Stadt, ___ ich wohne, ist klein.', 'in der', ['in die', 'in dem', 'in den', 'in das']],
    ['Der Minister, ___ Entscheidung umstritten ist, spricht heute.', 'dessen', ['deren', 'dem', 'den', 'die']],
    ['Die Studierenden, ___ die Prüfung bestanden haben, feiern.', 'die', ['der', 'das', 'den', 'dem']],
    ['Das Medikament, ___ er braucht, ist teuer.', 'das', ['der', 'die', 'den', 'dem']],
    ['Der Artikel, ___ in der Zeitung stand, war interessant.', 'der', ['die', 'das', 'den', 'dem']],
    ['Die Firma, ___ er arbeitet, wächst schnell.', 'für die', ['für der', 'für das', 'für den', 'für dem']],
    ['Der Arzt, ___ ich vertraue, ist erfahren.', 'dem', ['der', 'die', 'das', 'den']],
    ['Die Reise, ___ wir gebucht haben, beginnt morgen.', 'die', ['der', 'das', 'den', 'dem']],
    ['Das Gesetz, ___ gestern verabschiedet wurde, tritt bald in Kraft.', 'das', ['der', 'die', 'den', 'dem']],
    ['Die Kollegen, ___ ich danke, haben mir geholfen.', 'denen', ['der', 'die', 'das', 'dem']],
    ['Der Politiker, ___ Rede lange dauerte, ist bekannt.', 'dessen', ['deren', 'dem', 'den', 'die']],
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

export function genTrennbareVerbenB1() {
  const items = [
    ['Wann ___ du dich für den Kurs an?', 'meldest', ['meldet', 'melden', 'anmeldest', 'meldest an']],
    ['Er ___ die wichtige E-Mail sofort ab.', 'schickt', ['schickt ab', 'abschickt', 'schicke', 'schicken']],
    ['Ich ___ morgen früh um sechs auf.', 'stehe', ['steht', 'stehen', 'aufstehe', 'stehe auf']],
    ['Wir ___ das Meeting auf nächste Woche vor.', 'verlegen', ['verlegen vor', 'vorverlegen', 'verlegt', 'verlegen']],
    ['Sie ___ das Licht aus, wenn sie geht.', 'macht', ['macht aus', 'ausmacht', 'mache', 'machen']],
    ['Er ___ den Termin leider ab.', 'sagt', ['sagt ab', 'absagt', 'sage', 'sagen']],
    ['Ich ___ mich über das Ergebnis.', 'freue', ['freut', 'freuen', 'freust', 'gefreet']],
    ['Wir ___ uns schon auf die Reise.', 'freuen', ['freut', 'freue', 'freust', 'gefreet']],
    ['Du ___ das Formular online aus.', 'füllst', ['füllt', 'füllen', 'ausfüllst', 'füllst aus']],
    ['Er ___ die Nachrichten jeden Morgen durch.', 'geht', ['geht durch', 'durchgeht', 'gehe', 'gehen']],
    ['Sie ___ um 22 Uhr ein.', 'checkt', ['checkt ein', 'eincheckt', 'checke', 'checken']],
    ['Ich ___ den Kollegen später an.', 'rufe', ['ruft', 'rufen', 'anrufe', 'rufe an']],
    ['Wir ___ das Problem im Team an.', 'sprechen', ['spricht', 'spreche', 'ansprechen', 'sprechen an']],
    ['Er ___ die Präsentation gut vor.', 'bereitet', ['bereitet vor', 'vorbereitet', 'bereite', 'bereiten']],
    ['Sie ___ die Rechnung sofort ein.', 'reicht', ['reicht ein', 'einreicht', 'reiche', 'reichen']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 211), correct: c });
    }
    return out;
  });
}

export function genVerbPraeposition() {
  const items = [
    ['Er denkt oft ___ seine Karriere.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Ich warte ___ die Genehmigung.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Sie interessiert sich ___ Umweltschutz.', 'für', ['an', 'auf', 'in', 'mit']],
    ['Wir sprechen ___ die neue Strategie.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Er erinnert sich ___ das Gespräch.', 'an', ['auf', 'in', 'mit', 'zu']],
    ['Ich hoffe ___ eine schnelle Lösung.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Sie ärgert sich ___ die Verspätung.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Er fragt ___ dem Weg.', 'nach', ['an', 'auf', 'in', 'mit']],
    ['Wir bestehen ___ klaren Regeln.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Sie träumt ___ einem Job im Ausland.', 'von', ['an', 'auf', 'in', 'mit']],
    ['Ich danke ___ deiner Unterstützung.', 'für', ['an', 'auf', 'in', 'mit']],
    ['Er achtet ___ Details.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Wir diskutieren ___ dem Vorschlag.', 'über', ['an', 'auf', 'in', 'mit']],
    ['Sie wartet ___ dem Ergebnis.', 'auf', ['an', 'in', 'mit', 'zu']],
    ['Er informiert sich ___ dem Thema.', 'über', ['an', 'auf', 'in', 'mit']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 221), correct: c });
    }
    return out;
  });
}

export function genVerneinung() {
  const items = [
    ['Ich habe ___ Zeit für ein langes Meeting.', 'keine', ['nicht', 'nie', 'kein', 'nichts']],
    ['Er kommt heute ___.', 'nicht', ['kein', 'keine', 'nie', 'nichts']],
    ['Wir haben ___ Interesse an dem Angebot.', 'kein', ['nicht', 'nie', 'keine', 'nichts']],
    ['Sie trinkt ___ Kaffee mehr.', 'keinen', ['nicht', 'nie', 'keine', 'nichts']],
    ['Das ist ___ gute Idee.', 'keine', ['nicht', 'nie', 'kein', 'nichts']],
    ['Er hat ___ auf die Nachricht geantwortet.', 'nicht', ['kein', 'keine', 'nie', 'nichts']],
    ['Ich sehe ___ Problem.', 'kein', ['nicht', 'nie', 'keine', 'nichts']],
    ['Sie arbeitet ___ am Wochenende.', 'nie', ['nicht', 'kein', 'keine', 'nichts']],
    ['Wir haben ___ Geld übrig.', 'kein', ['nicht', 'nie', 'keine', 'nichts']],
    ['Er ist ___ krank, sondern müde.', 'nicht', ['kein', 'keine', 'nie', 'nichts']],
    ['Das Medikament hat ___ geholfen.', 'nicht', ['kein', 'keine', 'nie', 'nichts']],
    ['Ich habe ___ Verständnis für diese Entscheidung.', 'kein', ['nicht', 'nie', 'keine', 'nichts']],
    ['Sie isst weder Fleisch ___ Fisch.', 'noch', ['nicht', 'kein', 'nie', 'nichts']],
    ['Er hat ___ Erfahrung in diesem Bereich.', 'keine', ['nicht', 'nie', 'kein', 'nichts']],
    ['Wir fahren ___ mit dem Auto.', 'nicht', ['kein', 'keine', 'nie', 'nichts']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 231), correct: c });
    }
    return out;
  });
}

export function genVerbNomenVerbindungB1() {
  const items = [
    ['Wir müssen heute eine wichtige Entscheidung ___.', 'treffen', ['machen', 'nehmen', 'geben', 'stellen']],
    ['Er ___ eine sorgfältige Untersuchung.', 'führt durch', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Sie ___ ein großes Interesse an dem Thema.', 'zeigt', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Die Firma ___ Kontakt mit neuen Kunden.', 'knüpft', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Er ___ eine klare Meinung zu der Frage.', 'äußert', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Wir ___ Rücksicht auf die Kollegen.', 'nehmen', ['machen', 'treffen', 'geben', 'stellen']],
    ['Sie ___ ein Praktikum in einer Klinik.', 'absolviert', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Der Minister ___ eine Rede.', 'hält', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Ich ___ ein Gespräch mit dem Chef.', 'führe', ['mache', 'nehme', 'gebe', 'stelle']],
    ['Er ___ eine Bewerbung ein.', 'reicht', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Wir ___ ein Meeting.', 'haben', ['machen', 'treffen', 'geben', 'stellen']],
    ['Sie ___ eine Diagnose.', 'stellt', ['macht', 'nimmt', 'gibt', 'trifft']],
    ['Er ___ Verantwortung für das Projekt.', 'übernimmt', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Die Universität ___ einen Kurs an.', 'bietet', ['macht', 'nimmt', 'gibt', 'stellt']],
    ['Ich ___ eine Pause.', 'mache', ['treffe', 'nehme', 'gebe', 'stelle']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 241), correct: c });
    }
    return out;
  });
}

export function genVerblassen() {
  const items = [
    ['Ich ___ das Auto reparieren.', 'lasse', ['lasst', 'lassen', 'ließ', 'gelassen']],
    ['Er ___ sich von einem Spezialisten beraten.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Wir ___ unsere Dokumente übersetzen.', 'lassen', ['lasse', 'lasst', 'ließ', 'gelassen']],
    ['Sie ___ die Haare schneiden.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Du ___ dir die Zähne kontrollieren.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Ich ___ mir den Vertrag erklären.', 'lasse', ['lasst', 'lassen', 'ließ', 'gelassen']],
    ['Er ___ das Paket nach Hause bringen.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Wir ___ uns im Hotel einchecken.', 'lassen', ['lasse', 'lasst', 'ließ', 'gelassen']],
    ['Sie ___ den Bericht Korrektur lesen.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Ich ___ mir eine zweite Meinung geben.', 'lasse', ['lasst', 'lassen', 'ließ', 'gelassen']],
    ['Er ___ sich impfen.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Wir ___ das Problem nicht ruhen.', 'lassen', ['lasse', 'lasst', 'ließ', 'gelassen']],
    ['Sie ___ die Kinder von der Oma abholen.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Du ___ dir Zeit zum Ausruhen.', 'lässt', ['lasse', 'lassen', 'ließ', 'gelassen']],
    ['Ich ___ mich nicht unter Druck setzen.', 'lasse', ['lasst', 'lassen', 'ließ', 'gelassen']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 251), correct: c });
    }
    return out;
  });
}

export function genWortschatzB1() {
  const items = [
    ['Nach der Operation braucht der Patient eine ___.', 'Rehabilitation', ['Renovierung', 'Reservation', 'Reklamation', 'Rezension']],
    ['Die ___ der Arbeitsplätze ist ein wichtiges Thema.', 'Sicherheit', ['Sicherlichkeit', 'Sicherheitssystem', 'Sicheres', 'Sichern']],
    ['Der ___ berichtet über internationale Ereignisse.', 'Journalist', ['Jurnalist', 'Journal', 'Journalismus', 'Journale']],
    ['Wir müssen den ___ senken, um die Umwelt zu schützen.', 'Ausstoß', ['Ausstoßment', 'Ausstoßen', 'Ausstoßung', 'Ausstoßer']],
    ['Die ___ hat eine neue Regelung beschlossen.', 'Regierung', ['Regiering', 'Regierend', 'Regierer', 'Regierbar']],
    ['Er hat eine ___ für nächsten Monat gebucht.', 'Unterkunft', ['Unterkunftung', 'Unterkommen', 'Unterkunftbar', 'Unterkünft']],
    ['Die ___ an der Universität ist sehr hoch.', 'Nachfrage', ['Nachfragen', 'Nachfragend', 'Nachfrager', 'Nachfragebar']],
    ['Sie hat eine ___ gegen Grippe bekommen.', 'Impfung', ['Impff', 'Impfen', 'Impfer', 'Impft']],
    ['Der ___ zeigt, dass die Wirtschaft wächst.', 'Bericht', ['Berichten', 'Berichter', 'Berichtung', 'Berichtbar']],
    ['Wir diskutieren über ___ Energiequellen.', 'erneuerbare', ['erneuerbar', 'erneuert', 'erneuernd', 'erneuerbarer']],
    ['Er hat eine ___ Stellung in der Firma.', 'verantwortliche', ['verantwortlich', 'verantwortet', 'verantwortend', 'verantwortbar']],
    ['Die ___ beginnt morgen früh.', 'Konferenz', ['Konferenzierung', 'Konferierend', 'Konferenzbar', 'Konferenzler']],
    ['Sie sucht eine ___ Lösung für das Problem.', 'nachhaltige', ['nachhaltig', 'nachgehalten', 'nachhaltend', 'nachhaltbar']],
    ['Der Arzt verschreibt ein ___.', 'Medikament', ['Medikamentierung', 'Medikamentier', 'Medikamentbar', 'Medikamentler']],
    ['Die ___ nach dem Unfall war lang.', 'Genesung', ['Genesend', 'Genesungbar', 'Genesungler', 'Genes']],
  ];
  return ensure50(() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const [p, c, pool] = items[i % items.length];
      out.push({ prompt: p, options: options4(c, pool, i + 261), correct: c });
    }
    return out;
  });
}

export function genSprachbausteineB1() {
  const items = [
    ['Liebe Kolleginnen und Kollegen, hiermit möchte ich Sie über die ___ Verschiebung informieren.', 'bevorstehende', ['bevorstehend', 'bevorstehenden', 'bevorstehendem', 'bevorstehender']],
    ['Bitte reichen Sie Ihre Unterlagen ___ spätestens Freitag ein.', 'bis', ['für', 'seit', 'ab', 'von']],
    ['___ der hohen Nachfrage können wir leider nicht alle Termine anbieten.', 'Aufgrund', ['Trotz', 'Während', 'Wegen', 'Ohne']],
    ['Die Prüfungsergebnisse werden Ihnen ___ E-Mail zugesandt.', 'per', ['mit', 'auf', 'an', 'in']],
    ['Wir bitten Sie, pünktlich ___ dem Seminarraum zu erscheinen.', 'vor', ['in', 'an', 'auf', 'mit']],
    ['Für Rückfragen stehe ich Ihnen gerne ___ Verfügung.', 'zur', ['in', 'an', 'auf', 'mit']],
    ['Die Bewerbungsfrist endet am 15. März; danach können wir ___ Bewerbungen nicht mehr berücksichtigen.', 'eingehende', ['eingehend', 'eingehenden', 'eingehendem', 'eingehender']],
    ['___ freue ich mich auf eine positive Rückmeldung.', 'Darauf', ['Dafür', 'Daran', 'Damit', 'Hierfür']],
    ['Bitte beachten Sie, dass eine Anmeldung ___ ist.', 'verbindlich', ['verbindliche', 'verbindlichen', 'verbindlichem', 'verbindlicher']],
    ['Die Veranstaltung findet ___ der aktuellen Hygienevorschriften statt.', 'gemäß', ['ohne', 'trotz', 'während', 'wegen']],
    ['Wir empfehlen, frühzeitig ___ Hotel zu buchen.', 'ein', ['eine', 'einen', 'einer']],
    ['___ weitere Informationen besuchen Sie unsere Website.', 'Für', ['Mit', 'An', 'Auf', 'In']],
    ['Die Teilnahme ist kostenlos, eine Anmeldung ist jedoch ___.', 'erforderlich', ['erforderliche', 'erforderlichen', 'erforderlichem', 'erforderlicher']],
    ['Bitte bringen Sie ___ Ausweis und Stift mit.', 'Ihren', ['Ihre', 'Ihr', 'Ihrem']],
    ['Wir danken Ihnen ___ Ihr Interesse an unserem Programm.', 'für', ['an', 'auf', 'mit', 'zu']],
  ];
  return items.map(([prompt, correct, pool], i) => ({
    prompt,
    options: options4(correct, pool, i + 271),
    correct,
  }));
}
