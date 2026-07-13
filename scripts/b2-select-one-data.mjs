/**
 * B2 select-one question banks — 50 items per grammar topic (cycled).
 * Contexts: work, university, media, politics, health, law, culture.
 */

import { bank } from './b2-select-one-shared.mjs';

export function genAkkusativDativobjekt() {
  return bank([
    ['Der Anwalt erklärt ___ die rechtliche Lage.', 'seinem Mandanten', ['seinen Mandanten', 'sein Mandant', 'seinem Mandant', 'seine Mandantin']],
    ['Die Richterin verurteilt ___ zu einer Geldstrafe.', 'den Angeklagten', ['der Angeklagte', 'dem Angeklagten', 'den Angeklagte', 'des Angeklagten']],
    ['Der Professor stellt ___ eine schwierige Frage.', 'den Studierenden', ['der Studierende', 'das Studierenden', 'die Studierenden', 'des Studierenden']],
    ['Die Ärztin verschreibt ___ ein neues Medikament.', 'der Patientin', ['die Patientin', 'den Patienten', 'der Patient']],
    ['Der Minister übermittelt ___ die wichtigsten Informationen.', 'dem Journalisten', ['der Journalist', 'den Journalisten', 'des Journalisten', 'die Journalistin']],
    ['Ich schenke ___ zum Geburtstag ein Buch.', 'meiner Kollegin', ['meine Kollegin', 'meiner Kollege', 'meinen Kollegin', 'meinem Kollegin']],
    ['Sie zeigt ___ die neuen Unterlagen.', 'ihrem Chef', ['ihren Chef', 'ihre Chef', 'ihres Chefs', 'ihrem Chefin']],
    ['Der Autor widmet ___ sein neues Werk.', 'seiner Mutter', ['seine Mutter', 'seinen Mutter', 'seiner Muttern', 'seines Mutter']],
    ['Wir empfehlen ___ einen erfahrenen Anwalt.', 'unseren Mandanten', ['unser Mandant', 'unserer Mandanten', 'unserer Mandant', 'unseres Mandanten']],
    ['Er erzählt ___ von seiner Reise.', 'uns', ['wir', 'unsere', 'unser', 'unseren']],
    ['Die Behörde erteilt ___ eine Genehmigung.', 'dem Unternehmen', ['das Unternehmen', 'den Unternehmen', 'des Unternehmens', 'die Unternehmen']],
    ['Sie bringt ___ jeden Morgen zur Schule.', 'ihre Kinder', ['ihren Kinder', 'ihrer Kinder', 'ihrem Kinder', 'ihres Kinder']],
    ['Der Trainer erklärt ___ die neue Taktik.', 'dem Team', ['das Team', 'den Team', 'des Teams', 'die Team']],
    ['Ich schreibe ___ eine lange E-Mail.', 'meinem Freund', ['meinen Freund', 'meine Freund', 'meines Freundes', 'meinem Freunde']],
    ['Die Kommission überreicht ___ die Auszeichnung.', 'der Forscherin', ['die Forscherin', 'den Forscherin', 'des Forscherin', 'die Forscherinnen']],
    ['Er leiht ___ sein Auto für das Wochenende.', 'seinem Bruder', ['seinen Bruder', 'seine Bruder', 'seines Bruders', 'seinem Brudern']],
    ['Die Redaktion schickt ___ die Korrekturen.', 'dem Autor', ['der Autor', 'den Autor', 'des Autors', 'die Autor']],
  ], 1);
}

export function genGenitivB2() {
  return bank([
    ['___ des Ministers lösten eine Debatte aus.', 'Die Äußerungen', ['Die Äußerung', 'Der Äußerungen', 'Den Äußerungen', 'Des Ministers']],
    ['Trotz ___ Bemühungen blieb das Ergebnis unbefriedigend.', 'seiner', ['sein', 'seinen', 'seine', 'seinem']],
    ['Während ___ Urlaubs übernahm die Stellvertreterin.', 'des Direktors', ['der Direktor', 'dem Direktor', 'den Direktor', 'die Direktor']],
    ['Aufgrund ___ Fehlers musste die Prüfung wiederholt werden.', 'eines schwerwiegenden', ['ein schwerwiegenden', 'einer schwerwiegenden', 'eines schwerwiegende', 'einem schwerwiegenden']],
    ['Innerhalb ___ Fristen muss die Arbeit abgeschlossen sein.', 'der vereinbarten', ['die vereinbarten', 'den vereinbarten', 'dem vereinbarten', 'das vereinbarten']],
    ['___ einer langen Tradition folgt die Universität diesem Brauch.', 'Infolge', ['Aus', 'Mit', 'Von', 'Nach']],
    ['Statt ___ Hilfe lehnte er jede Unterstützung ab.', 'jeder', ['jede', 'jeden', 'jedem', 'jedes']],
    ['Wegen ___ schlechten Wetters wurde das Konzert abgesagt.', 'des', ['der', 'dem', 'den', 'das']],
    ['Unweit ___ Hauses steht ein alter Brunnen.', 'des', ['der', 'dem', 'den', 'die']],
    ['Sie bedarf ___ besonderen Schutzes.', 'eines', ['ein', 'einen', 'einem', 'einer']],
    ['___ aller Erwartungen gelang das Experiment.', 'Entgegen', ['Gegenüber', 'Wegen', 'Trotz', 'Ohne']],
    ['Anlässlich ___ Jubiläums fand eine Feier statt.', 'des', ['der', 'dem', 'den', 'das']],
    ['___ der Verhandlungen einigte man sich auf einen Kompromiss.', 'Während', ['Trotz', 'Wegen', 'Infolge', 'Statt']],
    ['Ungeachtet ___ Proteste wurde das Gesetz verabschiedet.', 'der', ['die', 'den', 'dem', 'das']],
    ['___ des Vorfalls wurde eine Untersuchung eingeleitet.', 'Anlässlich', ['Während', 'Trotz', 'Wegen', 'Innerhalb']],
    ['Die Bedeutung ___ Entscheidung ist enorm.', 'dieser', ['diese', 'diesen', 'diesem', 'dieses']],
    ['___ des Sturms blieben viele Häuser ohne Strom.', 'Infolge', ['Wegen', 'Trotz', 'Während', 'Aufgrund']],
  ], 11);
}

export function genFuturI() {
  return bank([
    ['Er ___ wohl erst morgen an der Konferenz teilnehmen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Die Experten ___ die Ergebnisse nächste Woche veröffentlichen.', 'werden', ['würden', 'wollten', 'sollten', 'könnten']],
    ['Das ___ sicher Konsequenzen für die Wirtschaft haben.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Sie ___ vermutlich die Prüfung mit Auszeichnung bestehen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Die Temperaturen ___ in den nächsten Tagen sinken.', 'werden', ['würden', 'wollten', 'sollten', 'könnten']],
    ['Er ___ wohl nicht mehr kommen — es ist schon so spät.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Die Partei ___ bei der Wahl wahrscheinlich zulegen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Man ___ die Reform bis Ende des Jahres umsetzen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Du ___ dich sicher über die Nachricht freuen.', 'wirst', ['würdest', 'wärst', 'hättest', 'könntest']],
    ['Die Verhandlungen ___ vermutlich länger dauern als geplant.', 'werden', ['würden', 'wollten', 'sollten', 'könnten']],
    ['Es ___ morgen regnen, sagt der Wetterbericht.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Die Firma ___ nächstes Jahr neue Stellen schaffen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Ihr ___ das Problem sicher lösen können.', 'werdet', ['würdet', 'wäret', 'hättet', 'könntet']],
    ['Der Zug ___ in zehn Minuten in Berlin ankommen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Wir ___ wohl bis Freitag auf eine Antwort warten müssen.', 'werden', ['würden', 'wollten', 'sollten', 'könnten']],
    ['Das ___ keine einfachen Lösungen bringen.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
    ['Sie ___ sicher Recht behalten.', 'wird', ['würde', 'wäre', 'hätte', 'könnten']],
  ], 21);
}

export function genKonsekutiveKonjunktion() {
  return bank([
    ['Er sprach so leise, ___ niemand ihn verstehen konnte.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Das Problem war so komplex, ___ selbst Experten ratlos waren.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Sie arbeitete so schnell, ___ sie pünktlich fertig wurde.', 'dass', ['damit', 'weil', 'obwohl']],
    ['Er war so müde, ___ er sofort einschlief.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Die Nachfrage war so groß, ___ die Preise stiegen.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Er übte so intensiv, ___ er die Prüfung bestand.', 'dass', ['damit', 'weil', 'obwohl']],
    ['Es war so kalt, ___ die Heizung nicht ausreichte.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Sie war so überzeugend, ___ alle zustimmten.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Der Bericht war so detailliert, ___ er lange dauerte.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Er fuhr so schnell, ___ er geblitzt wurde.', 'dass', ['damit', 'weil', 'obwohl']],
    ['Die Lage war so ernst, ___ Sofortmaßnahmen nötig waren.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Er erklärte es so deutlich, ___ jeder es verstand.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Sie sang so schön, ___ das Publikum begeistert applaudierte.', 'dass', ['damit', 'weil', 'obwohl']],
    ['Das Essen war so gut, ___ wir noch einmal bestellten.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Er war so nervös, ___ er seinen Namen vergaß.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Die Aufgabe war so schwer, ___ niemand sie lösen konnte.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
    ['Sie lachte so laut, ___ alle aufblickten.', 'dass', ['damit', 'weil', 'obwohl', 'wenn']],
  ], 31);
}

export function genKonjunktionaladverbien() {
  return bank([
    ['Die Kosten sind gestiegen; ___ müssen wir sparen.', 'deshalb', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Er war müde; ___ arbeitete er weiter.', 'dennoch', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Sie hat viel gelernt; ___ bestand sie die Prüfung.', 'folglich', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Das Wetter war schlecht; ___ fand das Fest statt.', 'trotzdem', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Er spricht drei Sprachen; ___ spielt er Klavier.', 'außerdem', ['dennoch', 'trotzdem', 'deshalb', 'folglich']],
    ['Die Lage ist ernst; ___ bleiben wir optimistisch.', 'dennoch', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Sie hat sich verspätet; ___ verpasste sie den Anfang.', 'daher', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Er hat Fehler gemacht; ___ wurde er kritisiert.', 'infolgedessen', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Das Angebot ist attraktiv; ___ prüfen wir es genau.', 'jedoch', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Die Nachfrage steigt; ___ erhöhen wir die Produktion.', 'demzufolge', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Er war krank; ___ nahm er am Meeting teil.', 'trotzdem', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Sie hat Erfahrung; ___ fehlt ihr das nötige Zertifikat.', 'hingegen', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Die Daten sind unvollständig; ___ ist die Analyse schwierig.', 'somit', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Er hat recht; ___ sollten wir zuhören.', 'daher', ['dennoch', 'trotzdem', 'außerdem', 'dagegen']],
    ['Die Chancen sind gering; ___ geben wir nicht auf.', 'gleichwohl', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Das Projekt ist teuer; ___ lohnt es sich.', 'dennoch', ['deshalb', 'folglich', 'außerdem', 'dann']],
    ['Sie hat gewarnt; ___ ignorierte man ihre Hinweise.', 'dennoch', ['deshalb', 'folglich', 'außerdem', 'dann']],
  ], 41);
}

export function genKonjunktiv2B2() {
  return bank([
    ['Er tut so, ___ er alles wüsste.', 'als ob', ['wenn', 'damit', 'obwohl', 'weil']],
    ['Wenn ich an seiner Stelle ___, würde ich ablehnen.', 'wäre', ['bin', 'war', 'werde', 'würde']],
    ['Hätte ich das gewusst, ___ ich anders gehandelt.', 'hätte', ['habe', 'hatte', 'werde', 'würde']],
    ['An deiner Stelle ___ ich vorsichtiger.', 'wäre', ['bin', 'war', 'werde', 'würde']],
    ['Wenn sie mehr Zeit ___, könnte sie das Projekt abschließen.', 'hätte', ['hat', 'hatte', 'haben', 'habe']],
    ['Er benimmt sich, als ___ er der Chef.', 'wäre', ['ist', 'war', 'wird', 'würde']],
    ['Wenn das möglich ___, würden wir sofort helfen.', 'wäre', ['ist', 'war', 'wird', 'würde']],
    ['Ich ___ gern früher kommen, aber der Zug hatte Verspätung.', 'wäre', ['bin', 'war', 'werde', 'würde']],
    ['Wenn ich du ___, würde ich die Stelle annehmen.', 'wäre', ['bin', 'bist', 'war', 'würde']],
    ['Sie spricht, als ob sie alles ___.', 'wüsste', ['weiß', 'wusste', 'wissen', 'gewusst']],
    ['Wenn er nicht so stur ___, ginge alles leichter.', 'wäre', ['ist', 'war', 'wird', 'würde']],
    ['___ du mir helfen, wäre ich sehr dankbar.', 'Könntest', ['Kannst', 'Konntest', 'Könnten', 'Kann']],
    ['Wenn das Wetter besser ___, würden wir wandern gehen.', 'wäre', ['ist', 'war', 'wird', 'würde']],
    ['Er ___ lieber zu Hause bleiben, aber er muss arbeiten.', 'würde', ['wird', 'war', 'wäre', 'wurde']],
    ['Wenn ich reich ___, würde ich viel reisen.', 'wäre', ['bin', 'war', 'werde', 'würde']],
    ['Sie tut so, als ___ sie nichts davon.', 'wüsste', ['weiß', 'wusste', 'wissen', 'gewusst']],
    ['Wenn das nicht so teuer ___, würde ich es kaufen.', 'wäre', ['ist', 'war', 'wird', 'würde']],
  ], 51);
}

export function genKonzessivsatzB2() {
  return bank([
    ['___ die Chancen gering waren, versuchte er es.', 'Obgleich', ['Obwohl', 'Wenngleich', 'Weil', 'Damit']],
    ['Sie arbeitet weiter, ___ sie erschöpft ist.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ er Recht hatte, blieb er unhöflich.', 'Wenngleich', ['Obwohl', 'Obgleich', 'Weil', 'Damit']],
    ['Er ging spazieren, ___ es regnete.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ die Kritik berechtigt war, verteidigte er sein Konzept.', 'Obgleich', ['Obwohl', 'Wenngleich', 'Weil', 'Damit']],
    ['Sie lachte, ___ ihr nichts lustig vorkam.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ er müde war, leitete er die Sitzung.', 'Obwohl', ['Obgleich', 'Wenngleich', 'Weil', 'Damit']],
    ['Er bestand die Prüfung, ___ er kaum gelernt hatte.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ die Kosten hoch sind, lohnt sich die Investition.', 'Wenngleich', ['Obwohl', 'Obgleich', 'Weil', 'Damit']],
    ['Sie blieb ruhig, ___ alle nervös waren.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ er gewarnt worden war, fuhr er zu schnell.', 'Obgleich', ['Obwohl', 'Wenngleich', 'Weil', 'Damit']],
    ['Er nahm den Job an, ___ das Gehalt niedrig war.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ die Beweise fehlten, wurde er verurteilt.', 'Obwohl', ['Obgleich', 'Wenngleich', 'Weil', 'Damit']],
    ['Sie reiste trotz Warnung, ___ das Risiko hoch war.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ die Meinungen auseinandergingen, einigte man sich.', 'Wenngleich', ['Obwohl', 'Obgleich', 'Weil', 'Damit']],
    ['Er lief weiter, ___ er einen Muskelfaserriss hatte.', 'obwohl', ['weil', 'damit', 'dass', 'wenn']],
    ['___ die Nachfrage sinkt, erhöht die Firma die Produktion.', 'Obgleich', ['Obwohl', 'Wenngleich', 'Weil', 'Damit']],
  ], 61);
}

export function genLokalePraepositionenB2() {
  return bank([
    ['Das Büro befindet sich direkt ___ Marktplatz.', 'am', ['im', 'zum', 'vom', 'beim']],
    ['Er ging die Treppe ___ .', 'hinauf', ['hinauf die', 'die hinauf', 'auf die', 'hoch die']],
    ['Die Universität liegt ___ Stadtgrenze.', 'an der', ['in der', 'auf der', 'bei der', 'zur']],
    ['Wir treffen uns ___ Ecke Hauptstraße und Parkweg.', 'an der', ['in der', 'auf der', 'bei der', 'zur']],
    ['Das Hotel liegt ___ See.', 'am', ['im', 'zum', 'vom', 'beim']],
    ['Er wohnt ___ anderen Seite der Brücke.', 'auf der', ['an der', 'in der', 'bei der', 'zur']],
    ['Die Fabrik steht ___ Flussufer.', 'am', ['im', 'zum', 'vom', 'beim']],
    ['Sie ging den Gang ___ bis zum Ende.', 'entlang', ['entlang den', 'den entlang', 'am entlang', 'zum entlang']],
    ['Das Geschäft ist ___ Fußgängerzone.', 'in der', ['an der', 'auf der', 'bei der', 'zur']],
    ['Er stellte das Fahrrad ___ das Haus.', 'vor', ['vors', 'vorm', 'vor dem', 'zu']],
    ['Die Kinder spielen ___ Hof.', 'auf dem', ['an dem', 'in dem', 'bei dem', 'zum']],
    ['Wir fahren ___ Autobahn Richtung Süden.', 'auf die', ['an die', 'in die', 'durch die', 'zur']],
    ['Das Bild hängt ___ Wand über dem Sofa.', 'an der', ['in der', 'auf der', 'bei der', 'zur']],
    ['Er ging ___ das Gebäude herum.', 'um', ['ums', 'um dem', 'beim', 'in das']],
    ['Die Apotheke ist gleich ___ Post.', 'neben der', ['neben die', 'bei der', 'an der', 'zur']],
    ['Sie wohnt ___ des Stadtzentrums in einem ruhigen Viertel.', 'außerhalb', ['innerhalb', 'oberhalb', 'unterhalb', 'diesseits']],
    ['Das Dorf liegt ___ Bergen.', 'zwischen den', ['unter den', 'über den', 'an den', 'bei den']],
  ], 71);
}

export function genModalsatz() {
  return bank([
    ['Er verbesserte sein Deutsch, ___ er jeden Tag las.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['___ zu kündigen, suchte er ein Gespräch mit dem Chef.', 'Anstatt', ['Ohne', 'Indem', 'Weil', 'Obwohl']],
    ['Sie lernte schwimmen, ___ sie es im See übte.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['Er ging, ___ er sich verabschiedete.', 'ohne dass', ['indem', 'statt dass', 'weil', 'obwohl']],
    ['___ dass er fragte, nahm er einfach das Buch.', 'Anstatt', ['Ohne', 'Statt', 'Indem', 'Weil']],
    ['Er spart Geld, ___ er weniger ausgeht.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['Sie aß Obst, ___ ihr Bruder Gemüse aß.', 'anstatt dass', ['indem', 'ohne dass', 'weil', 'obwohl']],
    ['Er löste das Problem, ___ er kreativ dachte.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['___ zu warten, verließ er das Meeting.', 'Anstatt', ['Ohne', 'Indem', 'Weil', 'Obwohl']],
    ['Sie schrieb den Bericht, ___ sie die Daten auswertete.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['Er kaufte online, ___ er ins Geschäft ging.', 'anstatt dass', ['indem', 'ohne dass', 'weil', 'obwohl']],
    ['___ dass er es wusste, sagte er nichts.', 'Ohne', ['Anstatt', 'Indem', 'Weil', 'Obwohl']],
    ['Sie trainierte hart, ___ sie ihre Ausdauer steigerte.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['Er antwortete, ___ er nachdachte.', 'ohne dass', ['indem', 'statt dass', 'weil', 'obwohl']],
    ['___ ein Taxi zu nehmen, fuhr er mit der U-Bahn.', 'Anstatt', ['Ohne', 'Indem', 'Weil', 'Obwohl']],
    ['Er überzeugte sie, ___ er ruhig argumentierte.', 'indem', ['ohne dass', 'statt dass', 'weil', 'obwohl']],
    ['Sie verließ das Haus, ___ jemand es bemerkte.', 'ohne dass', ['indem', 'statt dass', 'weil', 'obwohl']],
  ], 81);
}

export function genIndefinitpronomen() {
  return bank([
    ['Hast du ___ in der Menge gesehen?', 'jemanden', ['jemand', 'niemand', 'niemanden', 'etwas']],
    ['Das Thema ist mir völlig neu; ich habe ___ davon gehört.', 'nichts', ['etwas', 'niemand', 'jemand', 'alles']],
    ['___ hat die Tür offengelassen.', 'Jemand', ['Niemand', 'Etwas', 'Nichts', 'Alles']],
    ['Sie möchte ___ Neues ausprobieren.', 'etwas', ['nichts', 'niemand', 'jemand', 'alles']],
    ['___ war zu Hause, als ich anrief.', 'Niemand', ['Jemand', 'Etwas', 'Nichts', 'Alles']],
    ['Kennst du ___ hier?', 'jemanden', ['jemand', 'niemand', 'niemanden', 'etwas']],
    ['Er hat ___ Interessantes berichtet.', 'etwas', ['nichts', 'niemand', 'jemand', 'alles']],
    ['___ darf den Raum betreten.', 'Niemand', ['Jemand', 'Etwas', 'Nichts', 'Alles']],
    ['Brauchst du ___ von mir?', 'etwas', ['nichts', 'niemand', 'jemand', 'alles']],
    ['___ hat mir diese Nachricht geschickt.', 'Jemand', ['Niemand', 'Etwas', 'Nichts', 'Alles']],
    ['Sie hat ___ Falsches gesagt.', 'nichts', ['etwas', 'niemand', 'jemand', 'alles']],
    ['Ist ___ zu Hause?', 'jemand', ['niemand', 'etwas', 'nichts', 'alles']],
    ['Er vertraut ___ , das ist seine Schwäche.', 'jemandem', ['jemanden', 'jemand', 'etwas', 'niemandem']],
    ['Sie hat ___ gefunden, was sie suchte.', 'alles', ['nichts', 'etwas', 'niemand', 'jemand']],
    ['Ich hoffe, ___ von euch kann mir helfen.', 'jemand', ['niemand', 'etwas', 'nichts', 'alles']],
    ['Ich habe ___ Besonderes erwartet.', 'etwas', ['nichts', 'niemand', 'jemand', 'alles']],
    ['___ weiß die Antwort auf diese Frage.', 'Niemand', ['Jemand', 'Etwas', 'Nichts', 'Alles']],
  ], 91);
}

export function genIndirekteRede() {
  return bank([
    ['Er behauptete, er ___ unschuldig.', 'sei', ['ist', 'war', 'wäre', 'wird']],
    ['Die Ministerin betonte, die Reform ___ notwendig.', 'sei', ['ist', 'war', 'wäre', 'wird']],
    ['Er sagte, er ___ morgen ankommen.', 'werde', ['wird', 'würde', 'wäre', 'war']],
    ['Sie erklärte, sie ___ keine Zeit.', 'habe', ['hat', 'hätte', 'hatte', 'haben']],
    ['Der Arzt meinte, der Patient ___ bald genesen.', 'werde', ['wird', 'würde', 'wäre', 'war']],
    ['Er behauptete, er ___ nichts davon gewusst.', 'habe', ['hat', 'hätte', 'hatte', 'haben']],
    ['Die Zeitung schrieb, die Lage ___ ernst.', 'sei', ['ist', 'war', 'wäre', 'wird']],
    ['Sie sagte, sie ___ den Vertrag unterschreiben.', 'werde', ['wird', 'würde', 'wäre', 'war']],
    ['Er erklärte, er ___ die Aufgabe bereits erledigt.', 'habe', ['hat', 'hätte', 'hatte', 'haben']],
    ['Der Experte meinte, das ___ ein Fehler.', 'sei', ['ist', 'war', 'wäre', 'wird']],
    ['Sie behauptete, sie ___ nie dort gewesen.', 'sei', ['ist', 'war', 'wäre', 'wird']],
    ['Er sagte, er ___ das nicht tun.', 'könne', ['kann', 'könnte', 'konnte', 'können']],
    ['Die Lehrerin erklärte, die Prüfung ___ schwierig.', 'sei', ['ist', 'war', 'wäre', 'wird']],
    ['Er meinte, er ___ morgen früher kommen.', 'werde', ['wird', 'würde', 'wäre', 'war']],
    ['Sie sagte, sie ___ den Termin verschieben.', 'müsse', ['muss', 'müsste', 'musste', 'müssen']],
    ['Der Zeuge behauptete, er ___ alles genau gesehen.', 'habe', ['hat', 'hätte', 'hatte', 'haben']],
    ['Er erklärte, das Problem ___ bald gelöst.', 'werde', ['wird', 'würde', 'wäre', 'war']],
  ], 101);
}

export function genPraepositionenGenitiv() {
  return bank([
    ['___ des schlechten Wetters fand die Veranstaltung statt.', 'Trotz', ['Wegen', 'Bei', 'Mit', 'Durch']],
    ['___ der Krise wurden neue Maßnahmen beschlossen.', 'Aufgrund', ['Trotz', 'Während', 'Bei', 'Mit']],
    ['___ des Meetings konnte er nicht telefonieren.', 'Während', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ technischer Probleme verzögerte sich der Start.', 'Wegen', ['Inmitten', 'Während', 'Bei', 'Mit']],
    ['___ der Verhandlungen einigte man sich.', 'Im Laufe', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ der Feiertage bleibt das Büro geschlossen.', 'Während', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ mangelnder Erfahrung wurde er abgelehnt.', 'Wegen', ['Trotz', 'Während', 'Bei', 'Mit']],
    ['___ aller Warnungen setzte er das Projekt fort.', 'Trotz', ['Wegen', 'Während', 'Bei', 'Mit']],
    ['___ der Umstrukturierung gab es viele Kündigungen.', 'Im Zuge', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ des Umbaus ist das Museum geschlossen.', 'Während', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ der hohen Nachfrage stiegen die Preise.', 'Aufgrund', ['Trotz', 'Während', 'Bei', 'Mit']],
    ['___ der Prüfung durfte er nicht sprechen.', 'Während', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ der Erkrankung fehlte er zwei Wochen.', 'Wegen', ['Trotz', 'Während', 'Bei', 'Mit']],
    ['___ der Schwierigkeiten gelang das Projekt.', 'Trotz', ['Wegen', 'Während', 'Bei', 'Mit']],
    ['___ der Sommerferien ist weniger Verkehr.', 'Während', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ der guten Vorbereitung bestand sie die Prüfung.', 'Dank', ['Trotz', 'Wegen', 'Bei', 'Mit']],
    ['___ der Inflation sank die Kaufkraft.', 'Infolge', ['Trotz', 'Während', 'Bei', 'Mit']],
  ], 111);
}

export function genPraepositionaleAdverbienB2() {
  return bank([
    ['Worauf ___ sich Ihre Kritik?', 'bezieht', ['beziehen', 'beziehst', 'bezog', 'bezogen']],
    ['Ich denke oft daran, wie es ___ war.', 'früher', ['früh', 'frühest', 'frühe', 'frühes']],
    ['Womit ___ du dein Studium?', 'finanzierst', ['finanzier', 'finanziert', 'finanzierte', 'finanzieren']],
    ['Darauf ___ ich mich schon lange.', 'freue', ['freuen', 'freust', 'freute', 'gefreut']],
    ['Worüber ___ ihr gestern gesprochen?', 'habt', ['hat', 'haben', 'hattet', 'hättet']],
    ['Damit ___ ich nichts anfangen.', 'kann', ['können', 'konntet', 'könnte', 'gekonnt']],
    ['Hieran ___ man die Qualität.', 'erkennt', ['erkennen', 'erkennst', 'erkannte', 'erkannt']],
    ['Daran ___ ich mich noch gut.', 'erinnere', ['erinnern', 'erinnerst', 'erinnerte', 'erinnert']],
    ['Worin ___ der Unterschied?', 'besteht', ['bestehen', 'bestehst', 'bestand', 'bestanden']],
    ['Darauf ___ wir uns geeinigt.', 'haben', ['hat', 'hatte', 'hätten', 'habt']],
    ['Woran ___ du bei der Entscheidung?', 'denkst', ['denken', 'denke', 'dachte', 'gedacht']],
    ['Hierauf ___ die ganze Argumentation.', 'baut', ['bauen', 'baust', 'baute', 'gebaut']],
    ['Damit ___ er sein ganzes Leben.', 'hat', ['haben', 'hatte', 'hätte', 'habt']],
    ['Worauf ___ Sie besonders?', 'achten', ['achtet', 'achte', 'achtete', 'geachtet']],
    ['Daran ___ nichts zu ändern.', 'ist', ['sind', 'war', 'wäre', 'sein']],
    ['Womit ___ man das Problem?', 'löst', ['lösen', 'löstest', 'löste', 'gelöst']],
    ['Darauf ___ ich nicht.', 'warte', ['warten', 'wartest', 'wartete', 'gewartet']],
  ], 121);
}

export function genPartizip1() {
  return bank([
    ['Die ___ Kinder spielten fröhlich im Garten.', 'lachenden', ['lachende', 'lachender', 'lachendes', 'lachendem']],
    ['Der ___ Mann nickte nachdenklich.', 'nachdenkende', ['nachdenkenden', 'nachdenkendet', 'nachdenkendes', 'nachdenkender']],
    ['Die ___ Sonnenstrahlen erhellten den Raum.', 'scheinenden', ['scheinende', 'scheinender', 'scheinendes', 'scheinendem']],
    ['Ein ___ Bach floss durch das Tal.', 'plätschernder', ['plätschernde', 'plätschernden', 'plätscherndes', 'plätscherndem']],
    ['Die ___ Zuschauer applaudierten begeistert.', 'jubelnden', ['jubelnde', 'jubelnder', 'jubelndes', 'jubelndem']],
    ['Der ___ Hund wartete vor der Tür.', 'wedelnde', ['wedelnden', 'wedelnder', 'wedelndes', 'wedelndem']],
    ['Die ___ Vögel zogen nach Süden.', 'ziehenden', ['ziehende', 'ziehender', 'ziehendes', 'ziehendem']],
    ['Ein ___ Feuer brannte im Kamin.', 'knisterndes', ['knisternde', 'knisternder', 'knisternden', 'knisterndem']],
    ['Die ___ Studenten diskutierten lebhaft.', 'debattierenden', ['debattierende', 'debattierender', 'debattierendes', 'debattierendem']],
    ['Der ___ Wind wehte durch die Straßen.', 'heulende', ['heulenden', 'heulender', 'heulendes', 'heulendem']],
    ['Die ___ Wellen schlugen gegen die Küste.', 'brandenden', ['brandende', 'brandender', 'brandendes', 'brandendem']],
    ['Ein ___ Kind schlief im Arm der Mutter.', 'schlafendes', ['schlafende', 'schlafender', 'schlafenden', 'schlafendem']],
    ['Die ___ Musik erfüllte den Saal.', 'erschallende', ['erschallenden', 'erschallender', 'erschallendes', 'erschallendem']],
    ['Der ___ Regen prasselte auf das Dach.', 'niederprasselnde', ['niederprasselnden', 'niederprasselnder', 'niederprasselndes', 'niederprasselndem']],
    ['Die ___ Gäste verließen das Restaurant.', 'gehenden', ['gehende', 'gehender', 'gehendes', 'gehendem']],
    ['Ein ___ Auto hielt an der Ampel.', 'anhaltendes', ['anhaltende', 'anhaltender', 'anhaltenden', 'anhaltendem']],
    ['Die ___ Menschenmenge füllte den Platz.', 'wogende', ['wogenden', 'wogender', 'wogendes', 'wogendem']],
  ], 131);
}

export function genPartizip2() {
  return bank([
    ['Die ___ Briefe lagen auf dem Schreibtisch.', 'geschriebenen', ['geschriebene', 'geschriebener', 'geschriebenes', 'geschriebenem']],
    ['Das ___ Haus wurde für eine Million verkauft.', 'renovierte', ['renovierten', 'renovierter', 'renoviertes', 'renoviertem']],
    ['Die ___ Entscheidung war endgültig.', 'getroffene', ['getroffenen', 'getroffener', 'getroffenes', 'getroffenem']],
    ['Ein ___ Buch liegt auf dem Tisch.', 'gelesenes', ['gelesene', 'gelesener', 'gelesenen', 'gelesenem']],
    ['Die ___ Aufgabe war besonders schwierig.', 'gelöste', ['gelösten', 'gelöster', 'gelöstes', 'gelöstem']],
    ['Das ___ Essen schmeckte ausgezeichnet.', 'gekochte', ['gekochten', 'gekochter', 'gekochtes', 'gekochtem']],
    ['Die ___ Fenster ließen viel Licht herein.', 'geöffneten', ['geöffnete', 'geöffneter', 'geöffnetes', 'geöffnetem']],
    ['Ein ___ Problem wurde endlich gelöst.', 'kompliziertes', ['komplizierte', 'komplizierten', 'kompliziertem', 'komplizierter']],
    ['Die ___ Daten wurden veröffentlicht.', 'ausgewerteten', ['ausgewertete', 'ausgewerteter', 'ausgewertetes', 'ausgewertetem']],
    ['Das ___ Gebäude steht unter Denkmalschutz.', 'restaurierte', ['restaurierten', 'restaurierter', 'restauriertes', 'restauriertem']],
    ['Die ___ Fragen blieben unbeantwortet.', 'gestellten', ['gestellte', 'gestellter', 'gestelltes', 'gestelltem']],
    ['Ein ___ Vertrag wurde unterzeichnet.', 'abgeschlossenes', ['abgeschlossene', 'abgeschlossener', 'abgeschlossenen', 'abgeschlossenem']],
    ['Die ___ Straße war wegen Bauarbeiten gesperrt.', 'gesperrte', ['gesperrten', 'gesperrter', 'gesperrtes', 'gesperrtem']],
    ['Das ___ Paket kam pünktlich an.', 'bestellte', ['bestellten', 'bestellter', 'bestelltes', 'bestelltem']],
    ['Die ___ Ergebnisse übertrafen alle Erwartungen.', 'erzielten', ['erzielte', 'erzielter', 'erzieltes', 'erzieltem']],
    ['Ein ___ Zimmer wurde freigegeben.', 'reserviertes', ['reservierte', 'reservierter', 'reservierten', 'reserviertem']],
    ['Die ___ Maschine läuft seit Jahren zuverlässig.', 'gewartete', ['gewarteten', 'gewarteter', 'gewartetes', 'gewartetem']],
  ], 141);
}

export function genPassivB2() {
  return bank([
    ['Das Gesetz ___ gestern vom Parlament verabschiedet.', 'wurde', ['wird', 'worden', 'würde', 'geworden']],
    ['Die Entscheidung ___ bereits getroffen worden.', 'ist', ['wird', 'wurde', 'wäre', 'war']],
    ['Neue Regeln ___ derzeit diskutiert.', 'werden', ['wurden', 'worden', 'würden', 'geworden']],
    ['Der Bericht ___ bis Freitag fertiggestellt werden.', 'wird', ['wurde', 'worden', 'würde', 'geworden']],
    ['Das Problem ___ leider nicht gelöst.', 'wurde', ['wird', 'worden', 'würde', 'geworden']],
    ['Die Brücke ___ im nächsten Jahr renoviert.', 'wird', ['wurde', 'worden', 'würde', 'geworden']],
    ['Alle Gäste ___ rechtzeitig informiert worden.', 'sind', ['werden', 'wurden', 'wären', 'waren']],
    ['Der Termin ___ verschoben.', 'wurde', ['wird', 'worden', 'würde', 'geworden']],
    ['Die Daten ___ sorgfältig ausgewertet.', 'werden', ['wurden', 'worden', 'würden', 'geworden']],
    ['Das Projekt ___ von der EU gefördert.', 'wird', ['wurde', 'worden', 'würde', 'geworden']],
    ['Die Verhandlungen ___ erfolgreich abgeschlossen.', 'wurden', ['werden', 'worden', 'würden', 'geworden']],
    ['Ein Kompromiss ___ gefunden worden.', 'ist', ['wird', 'wurde', 'wäre', 'war']],
    ['Die Straße ___ wegen Bauarbeiten gesperrt.', 'wird', ['wurde', 'worden', 'würde', 'geworden']],
    ['Der Antrag ___ abgelehnt.', 'wurde', ['wird', 'worden', 'würde', 'geworden']],
    ['Die Ergebnisse ___ morgen bekannt gegeben.', 'werden', ['wurden', 'worden', 'würden', 'geworden']],
    ['Das Gebäude ___ 1920 erbaut.', 'wurde', ['wird', 'worden', 'würde', 'geworden']],
    ['Die Kandidaten ___ bereits benachrichtigt worden.', 'sind', ['werden', 'wurden', 'wären', 'waren']],
  ], 151);
}

export function genPassiversatz() {
  return bank([
    ['Das Problem ___ sich leicht lösen.', 'lässt', ['lassen', 'ist', 'wird', 'hat']],
    ['Die Aufgabe ist zu ___ .', 'erledigen', ['erledigt', 'erledigend', 'erledigte', 'erledigtes']],
    ['Das Buch ___ sich gut lesen.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Der Bericht ist noch zu ___ .', 'überarbeiten', ['überarbeitet', 'überarbeitend', 'überarbeitete', 'überarbeitetes']],
    ['Das Rätsel ___ sich nicht lösen.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Die Frage ist schwer zu ___ .', 'beantworten', ['beantwortet', 'beantwortend', 'beantwortete', 'beantwortetes']],
    ['Das Fenster ___ sich nicht öffnen.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Diese Frage ist nicht zu ___ .', 'beantworten', ['beantwortet', 'beantwortend', 'beantwortete', 'beantwortetes']],
    ['Das Ergebnis ___ sich nicht vorhersagen.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Die Daten sind leicht zu ___ .', 'auswerten', ['ausgewertet', 'auswertend', 'auswertete', 'auswertetes']],
    ['Der Fehler ___ sich schnell beheben.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Die Maschine ist leicht zu ___ .', 'bedienen', ['bedient', 'bedienend', 'bediente', 'bedientes']],
    ['Die Tür ___ sich nicht schließen.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Der Antrag ist noch zu ___ .', 'prüfen', ['geprüft', 'prüfend', 'prüfte', 'prüftes']],
    ['Das Problem ___ sich vermeiden.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
    ['Die Lösung ist schwer zu ___ .', 'finden', ['gefunden', 'findend', 'fand', 'findetes']],
    ['Das Gerät ___ sich einfach bedienen.', 'lässt', ['ist', 'wird', 'hat', 'wurde']],
  ], 161);
}

export function genRedewendungen() {
  return bank([
    ['Bleib auf dem ___ — informiere dich regelmäßig!', 'Laufenden', ['Laufende', 'Laufender', 'Laufendes', 'Laufendem']],
    ['Er hat den Nagel auf den ___ getroffen.', 'Kopf', ['Kopfe', 'Köpfen', 'Kopfs', 'Kopfen']],
    ['Wir müssen den Stein ins ___ bringen.', 'Rollen', ['Rollens', 'Rolle', 'Roller', 'Rollende']],
    ['Sie hat von der Arbeit die Nase ___ .', 'voll', ['vollen', 'voller', 'volles', 'vollem']],
    ['Er spricht ___ aus, was er denkt.', 'offen', ['offenen', 'offener', 'offenes', 'offenem']],
    ['Das geht mir ___ die Nerven.', 'auf', ['an', 'in', 'über', 'unter']],
    ['Er hat ein ___ Auge auf Details.', 'scharfes', ['scharfen', 'scharfer', 'scharfem', 'scharf']],
    ['Wir sind ___ einer Meinung.', 'einer', ['eine', 'einen', 'einem', 'eines']],
    ['Er hat den ___ im Griff.', 'Überblick', ['Überblicks', 'Überblicken', 'Überblicke', 'Überblick']],
    ['Das war ein Schuss ins ___ .', 'Blaue', ['Blauen', 'Blauer', 'Blaues', 'Blauem']],
    ['Sie hat alles ___ den Kopf gestellt.', 'auf', ['an', 'in', 'über', 'unter']],
    ['Er redet um den ___ herum.', 'heißen Brei', ['heiße Brei', 'heißen Breie', 'heißer Brei', 'heißen Topf']],
    ['Das ist nicht mein ___ .', 'Bier', ['Wein', 'Kaffee', 'Tee', 'Saft']],
    ['Du bist heute wohl mit dem falschen ___ aufgestanden.', 'Bein', ['Beine', 'Beinen', 'Beines', 'Beins']],
    ['Sie hat den Ball ___ gehalten.', 'flach', ['flachen', 'flacher', 'flaches', 'flachem']],
    ['Er ist ins kalte Wasser ___ .', 'gesprungen', ['gesprang', 'springen', 'springt', 'sprang']],
    ['Wir müssen die Sache auf den Punkt ___ .', 'bringen', ['brachte', 'gebracht', 'bringt', 'bringen']],
  ], 171);
}

export function genRelativsatzB2() {
  return bank([
    ['Der Autor, ___ Werk weltberühmt ist, lebt zurückgezogen.', 'dessen', ['deren', 'denen', 'dem', 'den']],
    ['Die Stadt, in ___ ich aufgewachsen bin, hat sich verändert.', 'der', ['die', 'dem', 'den', 'das']],
    ['Die Kollegin, ___ ich vertraue, hat recht.', 'der', ['die', 'den', 'dem', 'das']],
    ['Das Unternehmen, für ___ er arbeitet, expandiert.', 'das', ['die', 'der', 'dem', 'den']],
    ['Der Professor, von ___ ich gelernt habe, ist pensioniert.', 'dem', ['den', 'der', 'das', 'die']],
    ['Die Frau, ___ Mann Arzt ist, kennt sich aus.', 'deren', ['dessen', 'denen', 'dem', 'den']],
    ['Das Buch, ___ ich suche, ist vergriffen.', 'das', ['die', 'der', 'dem', 'den']],
    ['Die Studenten, mit ___ wir diskutierten, waren engagiert.', 'denen', ['deren', 'dessen', 'dem', 'den']],
    ['Der Mann, ___ Auto vor der Tür steht, ist mein Nachbar.', 'dessen', ['deren', 'denen', 'dem', 'den']],
    ['Die Firma, bei ___ ich Praktikum machte, stellt ein.', 'der', ['die', 'dem', 'den', 'das']],
    ['Das Thema, über ___ wir sprachen, war komplex.', 'das', ['die', 'der', 'dem', 'den']],
    ['Die Ärztin, zu ___ ich gehe, ist sehr kompetent.', 'der', ['die', 'dem', 'den', 'das']],
    ['Der Bericht, auf ___ er sich bezieht, ist veraltet.', 'den', ['die', 'der', 'dem', 'das']],
    ['Die Menschen, ___ Leben er rettete, dankten ihm.', 'deren', ['dessen', 'denen', 'dem', 'den']],
    ['Das Land, aus ___ er stammt, liegt in Südamerika.', 'dem', ['den', 'der', 'das', 'die']],
    ['Die Methode, mit ___ wir arbeiten, ist bewährt.', 'der', ['die', 'dem', 'den', 'das']],
    ['Der Experte, ___ Meinung zählt, hat zugestimmt.', 'dessen', ['deren', 'denen', 'dem', 'den']],
  ], 181);
}

export function genTekamolo() {
  // Distractor pool: only TKML-violations in the middle field (no valid Vorfeld permutations).
  // Default order: Subject + Verb + Te + Ka + Mo + Lo. Distractors permute Te/Ka/Mo/Lo so that
  // the order in the middle field breaks the default schema while keeping V2.
  return bank([
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er fährt morgen wegen der Konferenz mit dem Zug nach Berlin.', ['Er fährt wegen der Konferenz morgen mit dem Zug nach Berlin.', 'Er fährt nach Berlin morgen wegen der Konferenz mit dem Zug.', 'Er fährt mit dem Zug morgen wegen der Konferenz nach Berlin.', 'Er fährt morgen mit dem Zug nach Berlin wegen der Konferenz.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Sie arbeitet heute aus beruflichen Gründen besonders sorgfältig im Labor.', ['Sie arbeitet im Labor heute aus beruflichen Gründen besonders sorgfältig.', 'Sie arbeitet aus beruflichen Gründen heute besonders sorgfältig im Labor.', 'Sie arbeitet besonders sorgfältig heute aus beruflichen Gründen im Labor.', 'Sie arbeitet heute besonders sorgfältig aus beruflichen Gründen im Labor.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Wir treffen uns morgen wegen des Termins pünktlich im Büro.', ['Wir treffen uns im Büro morgen wegen des Termins pünktlich.', 'Wir treffen uns wegen des Termins morgen pünktlich im Büro.', 'Wir treffen uns pünktlich morgen im Büro wegen des Termins.', 'Wir treffen uns morgen pünktlich im Büro wegen des Termins.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er liest abends aus Interesse an der Politik regelmäßig im Sessel.', ['Er liest im Sessel abends aus Interesse an der Politik regelmäßig.', 'Er liest aus Interesse an der Politik abends regelmäßig im Sessel.', 'Er liest regelmäßig abends im Sessel aus Interesse an der Politik.', 'Er liest abends regelmäßig im Sessel aus Interesse an der Politik.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Sie fährt nächste Woche wegen der Messe geschäftlich nach Hamburg.', ['Sie fährt nach Hamburg nächste Woche wegen der Messe geschäftlich.', 'Sie fährt wegen der Messe nächste Woche geschäftlich nach Hamburg.', 'Sie fährt geschäftlich nächste Woche nach Hamburg wegen der Messe.', 'Sie fährt nächste Woche geschäftlich nach Hamburg wegen der Messe.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er schreibt heute wegen der Deadline besonders schnell am Schreibtisch.', ['Er schreibt am Schreibtisch heute wegen der Deadline besonders schnell.', 'Er schreibt wegen der Deadline heute besonders schnell am Schreibtisch.', 'Er schreibt besonders schnell heute am Schreibtisch wegen der Deadline.', 'Er schreibt heute besonders schnell am Schreibtisch wegen der Deadline.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Wir essen heute Abend aus Zeitgründen schnell zu Hause.', ['Wir essen zu Hause heute Abend aus Zeitgründen schnell.', 'Wir essen aus Zeitgründen heute Abend schnell zu Hause.', 'Wir essen schnell heute Abend zu Hause aus Zeitgründen.', 'Wir essen heute Abend schnell zu Hause aus Zeitgründen.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Sie lernt täglich wegen der Prüfung intensiv im Selbststudium.', ['Sie lernt im Selbststudium täglich wegen der Prüfung intensiv.', 'Sie lernt wegen der Prüfung täglich intensiv im Selbststudium.', 'Sie lernt intensiv täglich im Selbststudium wegen der Prüfung.', 'Sie lernt täglich intensiv im Selbststudium wegen der Prüfung.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er kommt morgen wegen des Meetings früh ins Büro.', ['Er kommt ins Büro morgen wegen des Meetings früh.', 'Er kommt wegen des Meetings morgen früh ins Büro.', 'Er kommt früh morgen ins Büro wegen des Meetings.', 'Er kommt morgen früh ins Büro wegen des Meetings.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Sie telefoniert heute aus beruflichen Gründen viel mit Kunden.', ['Sie telefoniert mit Kunden heute aus beruflichen Gründen viel.', 'Sie telefoniert aus beruflichen Gründen heute viel mit Kunden.', 'Sie telefoniert viel heute mit Kunden aus beruflichen Gründen.', 'Sie telefoniert heute viel mit Kunden aus beruflichen Gründen.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Wir fahren am Wochenende wegen des Wetters lieber nach Süden.', ['Wir fahren nach Süden am Wochenende wegen des Wetters lieber.', 'Wir fahren wegen des Wetters am Wochenende lieber nach Süden.', 'Wir fahren lieber am Wochenende nach Süden wegen des Wetters.', 'Wir fahren am Wochenende lieber nach Süden wegen des Wetters.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er trainiert morgens aus gesundheitlichen Gründen regelmäßig im Park.', ['Er trainiert im Park morgens aus gesundheitlichen Gründen regelmäßig.', 'Er trainiert aus gesundheitlichen Gründen morgens regelmäßig im Park.', 'Er trainiert regelmäßig morgens im Park aus gesundheitlichen Gründen.', 'Er trainiert morgens regelmäßig im Park aus gesundheitlichen Gründen.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Sie reist nächsten Monat wegen des Projekts beruflich nach Wien.', ['Sie reist nach Wien nächsten Monat wegen des Projekts beruflich.', 'Sie reist wegen des Projekts nächsten Monat beruflich nach Wien.', 'Sie reist beruflich nächsten Monat nach Wien wegen des Projekts.', 'Sie reist nächsten Monat beruflich nach Wien wegen des Projekts.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er kocht heute wegen der Gäste besonders aufwendig in der Küche.', ['Er kocht in der Küche heute wegen der Gäste besonders aufwendig.', 'Er kocht wegen der Gäste heute besonders aufwendig in der Küche.', 'Er kocht besonders aufwendig heute in der Küche wegen der Gäste.', 'Er kocht heute besonders aufwendig in der Küche wegen der Gäste.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Wir diskutieren heute wegen der Krise ausführlich im Team.', ['Wir diskutieren im Team heute wegen der Krise ausführlich.', 'Wir diskutieren wegen der Krise heute ausführlich im Team.', 'Wir diskutieren ausführlich heute im Team wegen der Krise.', 'Wir diskutieren heute ausführlich im Team wegen der Krise.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Sie schläft nachts wegen des Lärms schlecht im Hotelzimmer.', ['Sie schläft im Hotelzimmer nachts wegen des Lärms schlecht.', 'Sie schläft wegen des Lärms nachts schlecht im Hotelzimmer.', 'Sie schläft schlecht nachts im Hotelzimmer wegen des Lärms.', 'Sie schläft nachts schlecht im Hotelzimmer wegen des Lärms.']],
    ['Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?', 'Er präsentiert morgen wegen der Konferenz professionell die Ergebnisse.', ['Er präsentiert die Ergebnisse morgen wegen der Konferenz professionell.', 'Er präsentiert wegen der Konferenz morgen professionell die Ergebnisse.', 'Er präsentiert professionell morgen die Ergebnisse wegen der Konferenz.', 'Er präsentiert morgen professionell die Ergebnisse wegen der Konferenz.']],
  ], 191);
}

export function genTemporaleNebensatz() {
  return bank([
    ['___, er gegessen hatte, ging er spazieren.', 'Nachdem', ['Bevor', 'Während', 'Bis', 'Seitdem']],
    ['___, sie ankommt, rufe ich dich an.', 'Sobald', ['Obwohl', 'Bevor', 'Während', 'Bis']],
    ['Er wartete, ___ der Zug abfuhr.', 'bis', ['nachdem', 'bevor', 'während', 'seitdem']],
    ['___, ich studierte, arbeitete ich nebenbei.', 'Während', ['Nachdem', 'Bevor', 'Bis', 'Seitdem']],
    ['___, er das Buch gelesen hatte, verstand er alles.', 'Nachdem', ['Bevor', 'Während', 'Bis', 'Seitdem']],
    ['___, du gehst, schließe bitte die Tür.', 'Bevor', ['Nachdem', 'Während', 'Bis', 'Seitdem']],
    ['Sie wohnt hier, ___ sie ein Kind war.', 'seitdem', ['nachdem', 'bevor', 'während', 'bis']],
    ['___, der Film begann, kamen noch viele Zuschauer.', 'Bevor', ['Nachdem', 'Während', 'Bis', 'Seitdem']],
    ['___, er krank war, blieb er zu Hause.', 'Solange', ['Nachdem', 'Bevor', 'Bis', 'Seitdem']],
    ['Er ruhte sich aus, ___ er gearbeitet hatte.', 'nachdem', ['bevor', 'während', 'bis', 'seitdem']],
    ['___, sie den Vertrag unterschrieb, beriet sie sich.', 'Bevor', ['Nachdem', 'Während', 'Bis', 'Seitdem']],
    ['___, wir redeten, klingelte das Telefon.', 'Während', ['Nachdem', 'Bevor', 'Bis', 'Seitdem']],
    ['___, das Meeting zu Ende war, gingen alle.', 'Sobald', ['Bis', 'Bevor', 'Während', 'Seitdem']],
    ['Er lernte Deutsch, ___ er in Deutschland lebte.', 'während', ['nachdem', 'bevor', 'bis', 'seitdem']],
    ['___, ich angekommen bin, melde ich mich.', 'Sobald', ['Nachdem', 'Bevor', 'Während', 'Bis']],
    ['___, der Kurs begann, kannten sich alle.', 'Bevor', ['Nachdem', 'Während', 'Bis', 'Seitdem']],
    ['Sie arbeitet dort, ___ sie ihren Abschluss machte.', 'seitdem', ['nachdem', 'bevor', 'während', 'bis']],
  ], 201);
}

export function genQuiz() {
  // Take items from the back half of each topic's cycled bank to minimise overlap with
  // the individual topic folders (those show items 1..50 i.e. base order 0..16; the tail
  // contains the second cycle, starting at base item 17 → 0, so picking .slice(-8) gives
  // base items 8..15 — visually distinct from the first page of each topic.
  const items = [
    ...genKonjunktiv2B2().slice(-8),
    ...genPassivB2().slice(-8),
    ...genRelativsatzB2().slice(-8),
    ...genFuturI().slice(-8),
    ...genKonjunktionaladverbien().slice(-8),
    ...genIndirekteRede().slice(-10),
  ];
  const out = [];
  for (let i = 0; i < 50; i++) out.push(items[i % items.length]);
  return out;
}
