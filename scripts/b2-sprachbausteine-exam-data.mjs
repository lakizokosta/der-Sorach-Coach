/**
 * telc B2 Sprachbausteine — 20× Teil 1 (Grammatik) + 20× Teil 2 (Wortschatz).
 * Each text: 5 gaps, 3 popup options per gap. Short formal letters for mobile.
 */

/** @typedef {{ options: string[], correct: string }} Gap */
/** @typedef {{ hint: string, text: string, gaps: Gap[] }} TextGapsTask */

/** @type {TextGapsTask[]} */
export const TEIL1 = [
  {
    hint: 'Teil 1: Rückfrage zur Bewerbung',
    text: 'Sehr geehrte Damen und Herren,\nich habe mich am 3. Juni auf Ihre Stelle als Laborant beworben. Da ich bisher weder eine Eingangsbestätigung noch eine Antwort erhalten habe, möchte ich nachfragen, ___ meine Unterlagen angekommen sind. Falls etwas fehlt, sende ich es ___ zu. Auch ___ die Bearbeitung noch nicht abgeschlossen ist, wäre ich ___ einen kurzen Hinweis dankbar. Für Rückfragen stehe ich Ihnen ___ zur Verfügung.\nMit freundlichen Grüßen\nMario Czesnik',
    gaps: [
      { options: ['ob', 'wann', 'denn'], correct: 'ob' },
      { options: ['sofort', 'später', 'gestern'], correct: 'sofort' },
      { options: ['wenn', 'weil', 'damit'], correct: 'wenn' },
      { options: ['für', 'über', 'ohne'], correct: 'für' },
      { options: ['gerne', 'nie', 'selten'], correct: 'gerne' },
    ],
  },
  {
    hint: 'Teil 1: Beschwerde — verspätete Lieferung',
    text: 'Sehr geehrte Damen und Herren,\nmeine Bestellung vom 12. April sollte innerhalb von fünf Tagen geliefert werden, ___ bis heute ist nichts angekommen. Ich habe Sie bereits telefonisch kontaktiert, ___ ohne Erfolg. ___ Sie die Ware nicht bis Freitag versenden, werde ich den Kauf ___ . Eine kurze Bestätigung würde ___ helfen.\nMit freundlichen Grüßen\nSandra Keller',
    gaps: [
      { options: ['doch', 'denn', 'sondern'], correct: 'doch' },
      { options: ['jedoch', 'deshalb', 'außerdem'], correct: 'jedoch' },
      { options: ['Wenn', 'Weil', 'Obwohl'], correct: 'Wenn' },
      { options: ['stornieren', 'stornierte', 'storniert'], correct: 'stornieren' },
      { options: ['mir', 'mich', 'sich'], correct: 'mir' },
    ],
  },
  {
    hint: 'Teil 1: Antwort der Firma auf Beschwerde',
    text: 'Sehr geehrte Frau Keller,\nvielen Dank für Ihre Nachricht. Wir bedauern die Verzögerung, ___ durch einen Systemausfall verursacht wurde. Die Sendung wurde heute auf den Weg gebracht, ___ Sie die Sendungsnummer per E-Mail erhalten. ___ weitere Fragen haben, stehen wir ___ gerne zur Verfügung. Wir hoffen, ___ die Lieferung Sie zufriedenstellt.\nMit freundlichen Grüßen\nJens Scherer',
    gaps: [
      { options: ['die', 'das', 'den'], correct: 'die' },
      { options: ['sobald', 'während', 'bevor'], correct: 'sobald' },
      { options: ['Sollten', 'Würden', 'Hätten'], correct: 'Sollten' },
      { options: ['Ihnen', 'Sie', 'Ihre'], correct: 'Ihnen' },
      { options: ['dass', 'ob', 'wenn'], correct: 'dass' },
    ],
  },
  {
    hint: 'Teil 1: Terminanfrage beim Bürgeramt',
    text: 'Sehr geehrte Damen und Herren,\nich möchte einen Termin zur Anmeldung meines Wohnsitzes vereinbaren. Könnten Sie mir mitteilen, ___ freien Termine in den nächsten zwei Wochen verfügbar sind? Da ich berufstätig bin, wäre ein Termin am Nachmittag für ___ besonders hilfreich. Ich ___ mich über eine kurze Rückmeldung. ___ Sie mich bitte an, ___ dies einfacher ist.\nMit freundlichen Grüßen\nAhmed Hassan',
    gaps: [
      { options: ['welche', 'wann', 'ob'], correct: 'welche' },
      { options: ['mich', 'mir', 'sich'], correct: 'mich' },
      { options: ['freue', 'freuen', 'freut'], correct: 'freue' },
      { options: ['Rufen', 'Bitte', 'Fragen'], correct: 'Rufen' },
      { options: ['falls', 'weil', 'obwohl'], correct: 'falls' },
    ],
  },
  {
    hint: 'Teil 1: Reklamation — defektes Gerät',
    text: 'Sehr geehrte Damen und Herren,\ndas am 5. Mai gelieferte Gerät funktioniert leider nicht ordnungsgemäß, ___ der Bildschirm nach wenigen Minuten ausgeht. Ich bitte Sie, mir ___ Ersatzgerät zuzusenden oder den Kaufpreis zu erstatten. Die Rechnung habe ich ___ E-Mail bereits mitgeschickt, ___ Sie alle Daten haben. Ich ___ auf Ihre schnelle Antwort.\nMit freundlichen Grüßen\nThomas Berger',
    gaps: [
      { options: ['weil', 'obwohl', 'damit'], correct: 'weil' },
      { options: ['ein', 'eine', 'einen'], correct: 'ein' },
      { options: ['per', 'mit', 'auf'], correct: 'per' },
      { options: ['damit', 'weil', 'obwohl'], correct: 'damit' },
      { options: ['freue', 'freuen', 'freut'], correct: 'freue' },
    ],
  },
  {
    hint: 'Teil 1: Höfliche Absage auf Bewerbung',
    text: 'Sehr geehrter Herr Weber,\nvielen Dank für Ihre Bewerbung und das persönliche Gespräch. ___ Ihre Qualifikationen beeindruckt haben, haben wir uns für eine andere Kandidatin entschieden. Wir wünschen Ihnen alles Gute und ___ , dass Sie uns bei einer künftigen Ausschreibung wieder kontaktieren. ___ Sie Fragen haben, melden Sie sich ___ . Wir ___ Ihnen weiterhin viel Erfolg.\nMit freundlichen Grüßen\nDr. Lisa Hartmann',
    gaps: [
      { options: ['Obwohl', 'Weil', 'Damit'], correct: 'Obwohl' },
      { options: ['hoffen', 'hofft', 'hoffte'], correct: 'hoffen' },
      { options: ['Sollten', 'Würden', 'Hätten'], correct: 'Sollten' },
      { options: ['gerne', 'nie', 'selten'], correct: 'gerne' },
      { options: ['wünschen', 'wünscht', 'wünschte'], correct: 'wünschen' },
    ],
  },
  {
    hint: 'Teil 1: Beschwerde — Lärmbelästigung',
    text: 'Sehr geehrte Damen und Herren,\nseit mehreren Wochen ist die Lärmbelästigung deutlich gestiegen, ___ Bauarbeiten bis spät in die Nacht dauern. Wir bitten Sie, die Ruhezeiten zu überprüfen und ___ Maßnahmen zu ergreifen. ___ sich die Situation nicht bessert, werden wir erneut Stellung nehmen, ___ dies rechtlich erforderlich ist. Wir zählen ___ Ihre Unterstützung.\nMit freundlichen Grüßen\nDie Anwohner',
    gaps: [
      { options: ['weil', 'obwohl', 'damit'], correct: 'weil' },
      { options: ['geeignete', 'geeigneten', 'geeigneter'], correct: 'geeignete' },
      { options: ['Wenn', 'Obwohl', 'Sobald'], correct: 'Wenn' },
      { options: ['falls', 'weil', 'obwohl'], correct: 'falls' },
      { options: ['auf', 'über', 'gegen'], correct: 'auf' },
    ],
  },
  {
    hint: 'Teil 1: Anfrage Gehaltsbescheinigung',
    text: 'Sehr geehrte Frau Meier,\nfür die Anmietung einer Wohnung benötige ich eine aktuelle Gehaltsbescheinigung. Könnten Sie mir diese ___ Ende der Woche ausstellen? Ich ___ Ihnen die nötigen Unterlagen bereits im Intranet hochgeladen. Vielen Dank ___ Ihre Unterstützung. ___ Sie noch Angaben brauchen, ___ ich mich kurz.\nMit freundlichen Grüßen\nJonas Richter',
    gaps: [
      { options: ['bis', 'seit', 'während'], correct: 'bis' },
      { options: ['habe', 'hätte', 'hatte'], correct: 'habe' },
      { options: ['für', 'über', 'mit'], correct: 'für' },
      { options: ['Sollten', 'Würden', 'Hätten'], correct: 'Sollten' },
      { options: ['melde', 'melden', 'meldet'], correct: 'melde' },
    ],
  },
  {
    hint: 'Teil 1: Bestätigung Seminaranmeldung',
    text: 'Sehr geehrte Teilnehmerin, sehr geehrter Teilnehmer,\nhiermit bestätigen wir Ihre Anmeldung zum Seminar „Digitale Kommunikation“. Bitte ___ Sie sich am 14. Oktober zehn Minuten vor Beginn ein. ___ Sie verhindert sind, teilen Sie uns dies rechtzeitig mit, ___ wir einen Ersatzteilnehmer benennen können. Materialien erhalten Sie ___ Kursbeginn ___ E-Mail.\nMit freundlichen Grüßen\nDas Akademie-Team',
    gaps: [
      { options: ['finden', 'kommen', 'gehen'], correct: 'finden' },
      { options: ['Sollten', 'Würden', 'Könnten'], correct: 'Sollten' },
      { options: ['damit', 'weil', 'obwohl'], correct: 'damit' },
      { options: ['vor', 'nach', 'während'], correct: 'vor' },
      { options: ['per', 'mit', 'auf'], correct: 'per' },
    ],
  },
  {
    hint: 'Teil 1: Rückfrage Stellenangebot',
    text: 'Sehr geehrte Frau Schneider,\nIhr Stellenangebot interessiert mich sehr. Bevor ich mich bewerbe, möchte ich wissen, ___ die Stelle ab Oktober zu besetzen ist und ___ Homeoffice möglich ist. Über eine kurze Information ___ ich mich sehr. ___ Sie mir zusätzliche Unterlagen schicken können, ___ ich mich noch diese Woche.\nMit freundlichen Grüßen\nElena Popov',
    gaps: [
      { options: ['ob', 'wann', 'weil'], correct: 'ob' },
      { options: ['ob', 'wenn', 'dass'], correct: 'ob' },
      { options: ['freue', 'freuen', 'freut'], correct: 'freue' },
      { options: ['Sollten', 'Würden', 'Hätten'], correct: 'Sollten' },
      { options: ['melde', 'melden', 'meldet'], correct: 'melde' },
    ],
  },
  {
    hint: 'Teil 1: Beschwerde Hotel',
    text: 'Sehr geehrte Damen und Herren,\nwährend meines Aufenthalts vom 8. bis 10. Juni war das Zimmer nicht sauber, ___ die Heizung in der Nacht ausfiel. Trotz Reklamation wurde ___ unternommen. Ich erwarte eine Preisreduzierung, ___ ich andernfalls eine Bewertung veröffentlichen werde. Eine Antwort ___ Ende der Woche wäre ___ .\nMit freundlichen Grüßen\nClaudia Brandt',
    gaps: [
      { options: ['weil', 'und', 'oder'], correct: 'weil' },
      { options: ['nichts', 'etwas', 'alles'], correct: 'nichts' },
      { options: ['sonst', 'deshalb', 'außerdem'], correct: 'sonst' },
      { options: ['bis', 'seit', 'während'], correct: 'bis' },
      { options: ['hilfreich', 'überflüssig', 'unmöglich'], correct: 'hilfreich' },
    ],
  },
  {
    hint: 'Teil 1: Antwort Versicherung',
    text: 'Sehr geehrter Herr Fischer,\nIhr Schadensfall wurde von uns geprüft. ___ alle Unterlagen vollständig sind, überweisen wir den Betrag innerhalb von zehn Tagen. ___ Sie weitere Belege erhalten, senden Sie diese bitte umgehend. Wir ___ Ihnen für Ihr Verständnis und bleiben ___ weitere Fragen erreichbar. Antworten erfolgen in der Regel ___ von zwei Werktagen.\nMit freundlichen Grüßen\nSabine Krüger',
    gaps: [
      { options: ['Sobald', 'Während', 'Bevor'], correct: 'Sobald' },
      { options: ['Sollten', 'Wären', 'Hätten'], correct: 'Sollten' },
      { options: ['danken', 'dankt', 'dankte'], correct: 'danken' },
      { options: ['für', 'gegen', 'ohne'], correct: 'für' },
      { options: ['innerhalb', 'außerhalb', 'oberhalb'], correct: 'innerhalb' },
    ],
  },
  {
    hint: 'Teil 1: Anfrage Flugumbuchung',
    text: 'Sehr geehrte Damen und Herren,\naufgrund einer Terminverschiebung muss ich meinen Flug vom 22. auf den 24. Juli umbuchen. Bitte teilen Sie mir mit, ___ zusätzliche Kosten entstehen und ___ eine Umbuchung online möglich ist. Ich bin ___ telefonisch erreichbar, ___ Sie mich nicht per E-Mail erreichen. Vielen Dank ___ Ihre Hilfe.\nMit freundlichen Grüßen\nMarkus Lehmann',
    gaps: [
      { options: ['ob', 'wann', 'weil'], correct: 'ob' },
      { options: ['ob', 'wenn', 'dass'], correct: 'ob' },
      { options: ['jederzeit', 'irgendwann', 'niemals'], correct: 'jederzeit' },
      { options: ['falls', 'weil', 'obwohl'], correct: 'falls' },
      { options: ['für', 'über', 'gegen'], correct: 'für' },
    ],
  },
  {
    hint: 'Teil 1: Beschwerde Online-Shop',
    text: 'Sehr geehrte Damen und Herren,\ndie gelieferte Jacke entspricht nicht der Beschreibung, ___ die Farbe deutlich abweicht. Ich habe das Produkt zurückgeschickt, ___ der Kaufpreis bis heute nicht erstattet wurde. Bitte veranlassen Sie die Rückzahlung umgehend, ___ ich sonst rechtliche Schritte prüfe. Die Sendungsnummer habe ich ___ mitgeschickt. Ich bitte ___ eine baldige Bearbeitung.\nMit freundlichen Grüßen\nNina Vogel',
    gaps: [
      { options: ['weil', 'obwohl', 'damit'], correct: 'weil' },
      { options: ['doch', 'denn', 'sondern'], correct: 'doch' },
      { options: ['falls', 'weil', 'obwohl'], correct: 'falls' },
      { options: ['bereits', 'nie', 'selten'], correct: 'bereits' },
      { options: ['um', 'ohne', 'gegen'], correct: 'um' },
    ],
  },
  {
    hint: 'Teil 1: Dank nach Vorstellungsgespräch',
    text: 'Sehr geehrte Frau Dr. Braun,\nherzlichen Dank für das informative Gespräch gestern. Meine Erfahrung passt gut zum Team, und ich ___ mich sehr über eine positive Rückmeldung freuen. ___ Sie weitere Fragen haben, stehe ich gerne zur Verfügung. Referenzen sende ich ___ auf Wunsch ___ . Ich ___ mich auf Ihre Antwort.\nMit freundlichen Grüßen\nPaul Schmitt',
    gaps: [
      { options: ['würde', 'werde', 'wäre'], correct: 'würde' },
      { options: ['Sollten', 'Würden', 'Hätten'], correct: 'Sollten' },
      { options: ['gern', 'nie', 'kaum'], correct: 'gern' },
      { options: ['zu', 'von', 'gegen'], correct: 'zu' },
      { options: ['freue', 'freuen', 'freut'], correct: 'freue' },
    ],
  },
  {
    hint: 'Teil 1: Mahnung offene Rechnung',
    text: 'Sehr geehrte Damen und Herren,\nunsere Rechnung Nr. 4582 vom 3. Mai ist noch offen, ___ wir Sie bereits einmal erinnert haben. Wir bitten Sie, den Betrag innerhalb von sieben Tagen zu überweisen, ___ Mahngebühren anfallen können. Bei Zahlungsschwierigkeiten setzen Sie sich bitte mit ___ in Verbindung, ___ wir eine Lösung finden. Wir ___ auf Ihre Zahlung.\nMit freundlichen Grüßen\nBuchhaltung Müller GmbH',
    gaps: [
      { options: ['obwohl', 'weil', 'wenn'], correct: 'obwohl' },
      { options: ['sonst', 'deshalb', 'außerdem'], correct: 'sonst' },
      { options: ['uns', 'wir', 'sich'], correct: 'uns' },
      { options: ['damit', 'weil', 'obwohl'], correct: 'damit' },
      { options: ['zählen', 'zählt', 'zählte'], correct: 'zählen' },
    ],
  },
  {
    hint: 'Teil 1: Antwort auf Mahnung',
    text: 'Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Erinnerung. Die Überweisung wurde heute veranlasst, ___ Sie den Eingang in den nächsten Tagen sehen werden. Die Verzögerung entstand, ___ unsere Bankdaten geändert wurden. Wir entschuldigen uns für die Unannehmlichkeiten und ___ Ihnen, ___ dies nicht früher geschah. Wir ___ auf eine zügige Bearbeitung.\nMit freundlichen Grüßen\nLaura Stein',
    gaps: [
      { options: ['sodass', 'weil', 'obwohl'], correct: 'sodass' },
      { options: ['weil', 'obwohl', 'damit'], correct: 'weil' },
      { options: ['bedauern', 'bedauert', 'bedauerte'], correct: 'bedauern' },
      { options: ['dass', 'ob', 'wenn'], correct: 'dass' },
      { options: ['hoffen', 'hofft', 'hoffte'], correct: 'hoffen' },
    ],
  },
  {
    hint: 'Teil 1: Anfrage Elternzeit',
    text: 'Sehr geehrte Frau Hoffmann,\nich plane, ab Januar nächsten Jahres Elternzeit zu nehmen. Könnten Sie mir mitteilen, ___ ich die Unterlagen einreichen muss und ___ meine Vertretung geregelt werden soll? Ich ___ mich auf Ihre Rückmeldung und ___ Sie, mir die Fristen schriftlich zu bestätigen, ___ alles rechtzeitig geklärt ist.\nMit freundlichen Grüßen\nDaniel Krause',
    gaps: [
      { options: ['wann', 'ob', 'weil'], correct: 'wann' },
      { options: ['wie', 'was', 'wo'], correct: 'wie' },
      { options: ['freue', 'freuen', 'freut'], correct: 'freue' },
      { options: ['bitte', 'bat', 'bitten'], correct: 'bitte' },
      { options: ['damit', 'weil', 'obwohl'], correct: 'damit' },
    ],
  },
  {
    hint: 'Teil 1: Beschwerde Behörde Wartezeit',
    text: 'Sehr geehrte Damen und Herren,\nich warte seit acht Wochen auf die Bearbeitung meines Antrags, ___ ich alle Formulare eingereicht habe. Trotz Nachfrage erhielt ich ___ Auskunft. Ich bitte um eine schriftliche Stellungnahme, ___ ich meine Rechte wahrnehmen kann. Eine Antwort ___ Ende des Monats wäre ___ .\nMit freundlichen Grüßen\nFatima Al-Rashid',
    gaps: [
      { options: ['obwohl', 'weil', 'wenn'], correct: 'obwohl' },
      { options: ['keine', 'keinen', 'keiner'], correct: 'keine' },
      { options: ['damit', 'weil', 'obwohl'], correct: 'damit' },
      { options: ['bis', 'seit', 'während'], correct: 'bis' },
      { options: ['dringend', 'unwichtig', 'selten'], correct: 'dringend' },
    ],
  },
  {
    hint: 'Teil 1: Kündigung Mietvertrag',
    text: 'Sehr geehrte Frau Wagner,\nhiermit kündige ich meinen Mietvertrag zum nächstmöglichen Termin. Die Wohnung werde ich sauber ___ übergeben, ___ ich bereits eine Nachmieterin gefunden habe. Bitte bestätigen Sie mir den ___ schriftlich, ___ Unklarheiten vermieden werden. Für Rückfragen bin ich ___ erreichbar.\nMit freundlichen Grüßen\nStefan Wolf',
    gaps: [
      { options: ['zurück', 'weg', 'hin'], correct: 'zurück' },
      { options: ['weil', 'sobald', 'bevor'], correct: 'weil' },
      { options: ['Eingang', 'Ausgang', 'Umgang'], correct: 'Eingang' },
      { options: ['damit', 'weil', 'obwohl'], correct: 'damit' },
      { options: ['jederzeit', 'niemals', 'selten'], correct: 'jederzeit' },
    ],
  },
];

/** @type {TextGapsTask[]} */
export const TEIL2 = [
  {
    hint: 'Teil 2: Geschäftsangebot Monitore',
    text: 'Sehr geehrte Frau Kreisner,\nvielen Dank für Ihre Anfrage vom 10. August. Gerne unterbreiten wir Ihnen ___ . Die Preise verstehen sich inklusive ___ . Wir gewährleisten ___ innerhalb von zwei Wochen. Bei Unzufriedenheit übernehmen wir ___ . Wir freuen uns auf ___ .\nMit freundlichen Grüßen\nJens Scherer',
    gaps: [
      { options: ['das folgende Angebot', 'den gewünschten Auftrag', 'die beiliegende Bestätigung'], correct: 'das folgende Angebot' },
      { options: ['der gesetzlichen Mehrwertsteuer', 'der gewährten Rabatte', 'möglicher Nachlässe'], correct: 'der gesetzlichen Mehrwertsteuer' },
      { options: ['eine schnelle Lieferung', 'eine pünktliche Bezahlung', 'eine sorgfältige Bestellung'], correct: 'eine schnelle Lieferung' },
      { options: ['alle Kosten der Rücksendung', 'die passenden Ersatzmodelle', 'die angefallenen Preise'], correct: 'alle Kosten der Rücksendung' },
      { options: ['Erteilung eines Auftrags', 'Erledigung Ihrer Nachfrage', 'Abwicklung unserer Geschäftsbedingungen'], correct: 'Erteilung eines Auftrags' },
    ],
  },
  {
    hint: 'Teil 2: Antwort auf Reklamation',
    text: 'Sehr geehrter Herr Berger,\nwir haben Ihre Reklamation geprüft und bestätigen den Mangel. Wir senden Ihnen umgehend ___ zu. Alternativ erstatten wir Ihnen ___ auf Ihr Konto. Für Rückfragen stehen wir Ihnen jederzeit ___ . Wir bitten um ___ für die entstandenen Unannehmlichkeiten und um ___ .\nMit freundlichen Grüßen\nKundenservice TechPro',
    gaps: [
      { options: ['ein Ersatzgerät', 'eine Gutschrift', 'eine Mahnung'], correct: 'ein Ersatzgerät' },
      { options: ['den vollen Betrag', 'die Versandkosten', 'die Bearbeitungsgebühr'], correct: 'den vollen Betrag' },
      { options: ['zur Verfügung', 'am Apparat', 'zu erreichen'], correct: 'zur Verfügung' },
      { options: ['Ihr Verständnis', 'Ihre Geduld', 'Ihre Kündigung'], correct: 'Ihr Verständnis' },
      { options: ['eine kurze Rückmeldung', 'eine erneute Bestellung', 'eine Vertragsverlängerung'], correct: 'eine kurze Rückmeldung' },
    ],
  },
  {
    hint: 'Teil 2: Bestellbestätigung',
    text: 'Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Bestellung. Hiermit bestätigen wir ___ und die Bearbeitung Ihres Auftrags. Die Lieferung erfolgt innerhalb von fünf Werktagen. Die Rechnung erhalten Sie ___ mit der Sendung. Zahlungen sind ___ fällig. Bei Fragen wenden Sie sich an unseren ___ . ___ finden Sie auf unserer Website.\nMit freundlichen Grüßen\nLogistik-Team Nord',
    gaps: [
      { options: ['den Erhalt', 'die Kündigung', 'die Strafe'], correct: 'den Erhalt' },
      { options: ['zusammen', 'vorab', 'nachträglich'], correct: 'zusammen' },
      { options: ['innerhalb von 14 Tagen', 'sofort bei Bestellung', 'nach Ablauf der Garantie'], correct: 'innerhalb von 14 Tagen' },
      { options: ['Kundendienst', 'Vorstand', 'Lieferanten'], correct: 'Kundendienst' },
      { options: ['Die Sendungsverfolgung', 'Die Werbeaktion', 'Die Strafe'], correct: 'Die Sendungsverfolgung' },
    ],
  },
  {
    hint: 'Teil 2: Stellenangebot — Details',
    text: 'Sehr geehrte Bewerberin, sehr geehrter Bewerber,\nwir suchen zum nächstmöglichen Zeitpunkt eine erfahrene Projektleiterin. Zu Ihren Aufgaben gehören die Koordination des Teams und die ___ mit Kunden. Wir bieten ein attraktives Gehalt und ___ . Ihre vollständigen Unterlagen senden Sie bitte ___ . Wir freuen uns auf Ihre ___ und einen baldigen ___ .\nMit freundlichen Grüßen\nPersonalabteilung',
    gaps: [
      { options: ['Kommunikation', 'Kündigung', 'Reklamation'], correct: 'Kommunikation' },
      { options: ['flexible Arbeitszeiten', 'unbezahlte Überstunden', 'eingeschränkte Weiterbildung'], correct: 'flexible Arbeitszeiten' },
      { options: ['per E-Mail', 'per Fax', 'mündlich'], correct: 'per E-Mail' },
      { options: ['Rückmeldung', 'Vorauszahlung', 'Mahnung'], correct: 'Rückmeldung' },
      { options: ['Kontakt', 'Konflikt', 'Kündigung'], correct: 'Kontakt' },
    ],
  },
  {
    hint: 'Teil 2: Seminar-Einladung',
    text: 'Sehr geehrte Damen und Herren,\nhiermit laden wir Sie herzlich zu unserem Fachseminar am 18. November ein. Der Workshop behandelt aktuelle Themen der digitalen Transformation. Die Teilnahme ist für Mitglieder ___. Eine Anmeldung ist bis zum 1. November ___ . Das Programm finden Sie ___ . Wir freuen uns auf Ihre ___ zum ___ .\nMit freundlichen Grüßen\nInstitut für Weiterbildung',
    gaps: [
      { options: ['kostenfrei', 'verbindlich', 'strafbar'], correct: 'kostenfrei' },
      { options: ['erforderlich', 'verboten', 'unwichtig'], correct: 'erforderlich' },
      { options: ['im Anhang', 'im Vorraum', 'im Archiv'], correct: 'im Anhang' },
      { options: ['die Einladung', 'die Mahnung', 'die Strafe'], correct: 'die Einladung' },
      { options: ['den Workshop', 'den Streik', 'den Urlaub'], correct: 'den Workshop' },
    ],
  },
  {
    hint: 'Teil 2: Mietvertrag Verlängerung',
    text: 'Sehr geehrter Herr Wolf,\nIhr Mietvertrag läuft am 31. Dezember aus. Wir würden uns freuen, wenn Sie die Wohnung ___ verlängern. Die monatliche Miete beträgt ab Januar ___ Euro. Nebenkosten werden wie bisher ___ abgerechnet. Bitte teilen Sie uns Ihre Entscheidung bis zum 15. November ___ . Den neuen Vertrag senden wir Ihnen ___ .\nMit freundlichen Grüßen\nHausverwaltung Berger',
    gaps: [
      { options: ['weiterhin', 'sofort', 'rückwirkend'], correct: 'weiterhin' },
      { options: ['850', '85', '8500'], correct: '850' },
      { options: ['jährlich', 'einmalig', 'stündlich'], correct: 'jährlich' },
      { options: ['schriftlich', 'mündlich', 'telepathisch'], correct: 'schriftlich' },
      { options: ['per Post', 'per Fax', 'mündlich'], correct: 'per Post' },
    ],
  },
  {
    hint: 'Teil 2: Versicherungsangebot',
    text: 'Sehr geehrte Frau Brandt,\naufgrund Ihrer Anfrage übersenden wir Ihnen ___ für eine Haftpflichtversicherung. Der Beitrag richtet sich nach Ihrem Beruf. Im Schadensfall übernehmen wir die ___ bis zur vereinbarten Summe. Der Vertrag kann zum Jahresende ___ werden. Für Beratung stehen wir Ihnen ___ . Die ___ erhalten Sie im Anhang.\nMit freundlichen Grüßen\nVersicherung Sicher AG',
    gaps: [
      { options: ['ein Angebot', 'eine Strafe', 'eine Mahnung'], correct: 'ein Angebot' },
      { options: ['Kosten', 'Strafen', 'Gewinne'], correct: 'Kosten' },
      { options: ['gekündigt', 'gekauft', 'gestohlen'], correct: 'gekündigt' },
      { options: ['gerne zur Verfügung', 'nicht erreichbar', 'ohne Termin'], correct: 'gerne zur Verfügung' },
      { options: ['Police', 'Rechnung', 'Quittung'], correct: 'Police' },
    ],
  },
  {
    hint: 'Teil 2: Widerrufsbelehrung',
    text: 'Sehr geehrte Kundin, sehr geehrter Kunde,\nSie haben das Recht, ___ innerhalb von 14 Tagen zu widerrufen. Die Frist beginnt mit Erhalt der ___ . Bei Ausübung des Widerrufs erstatten wir alle Zahlungen ___ . Die Kosten der Rücksendung trägt ___ , sofern nichts anderes vereinbart wurde. Der ___ gilt ab dem Datum des Erhalts.\nMit freundlichen Grüßen\nShop24 GmbH',
    gaps: [
      { options: ['den Vertrag', 'den Urlaub', 'den Streik'], correct: 'den Vertrag' },
      { options: ['Ware', 'Werbung', 'Garantie'], correct: 'Ware' },
      { options: ['unverzüglich', 'niemals', 'jährlich'], correct: 'unverzüglich' },
      { options: ['der Kunde', 'der Nachbar', 'der Staat'], correct: 'der Kunde' },
      { options: ['Widerruf', 'Vertrag', 'Strafe'], correct: 'Widerruf' },
    ],
  },
  {
    hint: 'Teil 2: Projektvorschlag',
    text: 'Sehr geehrte Damen und Herren,\nwir möchten Ihnen unser ___ für die Digitalisierung vorstellen. In der ersten Phase analysieren wir die Abläufe und erstellen einen ___ . Die Umsetzung erfolgt mit Ihrem ___ . Kosten und Zeitplan legen wir ___ . Eine erste ___ senden wir mit dieser Nachricht.\nMit freundlichen Grüßen\nConsulting Plus',
    gaps: [
      { options: ['Konzept', 'Strafe', 'Mahnung'], correct: 'Konzept' },
      { options: ['Maßnahmenplan', 'Kündigungsschreiben', 'Strafantrag'], correct: 'Maßnahmenplan' },
      { options: ['Projektteam', 'Nachbarschaft', 'Lieferantennetz'], correct: 'Projektteam' },
      { options: ['dar', 'weg', 'hinweg'], correct: 'dar' },
      { options: ['Analyse', 'Werbung', 'Pause'], correct: 'Analyse' },
    ],
  },
  {
    hint: 'Teil 2: Kooperationsanfrage',
    text: 'Sehr geehrte Frau Dr. Hartmann,\nunser Unternehmen plant eine ___ mit Forschungseinrichtungen. Wir schlagen ein gemeinsames ___ zur nachhaltigen Energieversorgung vor. Gern besprechen wir die Details in einem persönlichen ___ . Für einen Termin ___ wir uns bei Ihnen. Eine erste Skizze finden Sie ___ .\nMit freundlichen Grüßen\nGreenTech Solutions',
    gaps: [
      { options: ['Kooperation', 'Trennung', 'Strafe'], correct: 'Kooperation' },
      { options: ['Projekt', 'Streik', 'Feiertag'], correct: 'Projekt' },
      { options: ['Gespräch', 'Mahnung', 'Rechnung'], correct: 'Gespräch' },
      { options: ['melden', 'beschweren', 'kündigen'], correct: 'melden' },
      { options: ['im Anhang', 'im Keller', 'im Urlaub'], correct: 'im Anhang' },
    ],
  },
  {
    hint: 'Teil 2: Zusage Rückerstattung',
    text: 'Sehr geehrte Frau Vogel,\nwir bestätigen den Eingang Ihrer ___ . Nach Prüfung erstatten wir Ihnen ___ von 89 Euro. Die Überweisung erfolgt innerhalb von zehn Werktagen auf Ihr ___ . Wir entschuldigen uns und hoffen auf ___ und auf Ihr weiteres ___ .\nMit freundlichen Grüßen\nModeOnline',
    gaps: [
      { options: ['Rücksendung', 'Werbung', 'Anzeige'], correct: 'Rücksendung' },
      { options: ['den Betrag', 'die Strafe', 'die Mahnung'], correct: 'den Betrag' },
      { options: ['Konto', 'Büro', 'Lager'], correct: 'Konto' },
      { options: ['Ihr Verständnis', 'Ihre Kündigung', 'Ihre Strafe'], correct: 'Ihr Verständnis' },
      { options: ['Ihr Vertrauen', 'Ihren Ärger', 'Ihre Abwesenheit'], correct: 'Ihr Vertrauen' },
    ],
  },
  {
    hint: 'Teil 2: Terminbestätigung Arztpraxis',
    text: 'Sehr geehrter Herr Richter,\nhiermit bestätigen wir Ihren ___ am 9. Oktober um 10:30 Uhr in unserer ___ . Bitte bringen Sie Ihre Versichertenkarte und Medikamentenliste ___ . Bei Verhinderung bitten wir um rechtzeitige ___ . Der Eingang befindet sich ___ der Straßenbahnhaltestelle.\nMit freundlichen Grüßen\nPraxis Dr. Neumann',
    gaps: [
      { options: ['Termin', 'Strafe', 'Mahnung'], correct: 'Termin' },
      { options: ['Praxis', 'Apotheke', 'Bank'], correct: 'Praxis' },
      { options: ['mit', 'ohne', 'gegen'], correct: 'mit' },
      { options: ['Absage', 'Bestellung', 'Kündigung'], correct: 'Absage' },
      { options: ['gegenüber', 'innerhalb', 'oberhalb'], correct: 'gegenüber' },
    ],
  },
  {
    hint: 'Teil 2: Preisanpassung',
    text: 'Sehr geehrte Kundin, sehr geehrter Kunde,\naufgrund gestiegener Materialkosten passen wir unsere ___ ab 1. Januar an. Die Erhöhung beträgt fünf Prozent. Bestehende ___ bleiben bis zum Vertragsablauf ___ gültig. Ausführliche Informationen zur ___ erhalten Sie ___ unserer Website.\nMit freundlichen Grüßen\nEnergie Süd GmbH',
    gaps: [
      { options: ['Preise', 'Strafen', 'Geschenke'], correct: 'Preise' },
      { options: ['Verträge', 'Strafen', 'Geschenke'], correct: 'Verträge' },
      { options: ['unverändert', 'sofort', 'rückwirkend'], correct: 'unverändert' },
      { options: ['Anpassung', 'Werbung', 'Pause'], correct: 'Anpassung' },
      { options: ['auf', 'unter', 'hinter'], correct: 'auf' },
    ],
  },
  {
    hint: 'Teil 2: Stellungnahme Qualitätsmängel',
    text: 'Sehr geehrte Damen und Herren,\nwir nehmen Ihre Kritik an der ___ sehr ernst. Eine interne ___ wurde eingeleitet. Sollte sich der Mangel bestätigen, erfolgt ein ___ oder eine ___ . Unsere Qualitätskontrolle wird die Prozesse ___ überprüfen.\nMit freundlichen Grüßen\nProduktion West',
    gaps: [
      { options: ['Qualität', 'Werbung', 'Pause'], correct: 'Qualität' },
      { options: ['Untersuchung', 'Party', 'Reise'], correct: 'Untersuchung' },
      { options: ['Austausch', 'Streik', 'Urlaub'], correct: 'Austausch' },
      { options: ['Rückerstattung', 'Strafe', 'Kündigung'], correct: 'Rückerstattung' },
      { options: ['umgehend', 'niemals', 'sporadisch'], correct: 'umgehend' },
    ],
  },
  {
    hint: 'Teil 2: Anforderung Bewerbungsunterlagen',
    text: 'Sehr geehrter Herr Schmitt,\nvielen Dank für Ihr Interesse an unserer ___ . Für die weitere Bearbeitung benötigen wir noch Ihre Zeugnisse und ein Foto. Bitte senden Sie diese ___ bis zum 20. Oktober ___ . Nach Eingang laden wir Sie gern zu einem zweiten ___ ___ .\nMit freundlichen Grüßen\nHR-Team',
    gaps: [
      { options: ['Stelle', 'Pause', 'Werbung'], correct: 'Stelle' },
      { options: ['Unterlagen', 'Strafe', 'Mahnung'], correct: 'Unterlagen' },
      { options: ['zu', 'von', 'gegen'], correct: 'zu' },
      { options: ['Gespräch', 'Kündigung', 'Strafe'], correct: 'Gespräch' },
      { options: ['ein', 'aus', 'an'], correct: 'ein' },
    ],
  },
  {
    hint: 'Teil 2: Zahlungserinnerung',
    text: 'Sehr geehrte Damen und Herren,\nzu unserer ___ Nr. 7721 liegt noch keine ___ vor. Wir bitten Sie, den offenen ___ von 420 Euro bis zum 30. September zu begleichen. Andernfalls behalten wir uns ___ vor. Bei bereits erfolgter Überweisung betrachten Sie dieses Schreiben als ___ .\nMit freundlichen Grüßen\nFinanzbuchhaltung',
    gaps: [
      { options: ['Rechnung', 'Werbung', 'Pause'], correct: 'Rechnung' },
      { options: ['Zahlung', 'Strafe', 'Einladung'], correct: 'Zahlung' },
      { options: ['Betrag', 'Urlaub', 'Streik'], correct: 'Betrag' },
      { options: ['rechtliche Schritte', 'ein Geschenk', 'eine Einladung'], correct: 'rechtliche Schritte' },
      { options: ['gegenstandslos', 'verbindlich', 'strafbar'], correct: 'gegenstandslos' },
    ],
  },
  {
    hint: 'Teil 2: Servicevertrag',
    text: 'Sehr geehrter Herr Lehmann,\nanbei erhalten Sie unseren Entwurf für einen ___ Ihrer Heizungsanlage. Der Vertrag umfasst jährliche ___ und einen ___ bei Ausfall. Die Kosten betragen 240 Euro pro Jahr, zahlbar ___ Vierteljahr. Für Rückfragen steht Ihnen unser Techniker ___ .\nMit freundlichen Grüßen\nHeizung Pro',
    gaps: [
      { options: ['Wartungsvertrag', 'Strafvertrag', 'Werbevertrag'], correct: 'Wartungsvertrag' },
      { options: ['Inspektionen', 'Werbung', 'Pausen'], correct: 'Inspektionen' },
      { options: ['Notdienst', 'Strafservice', 'Werbepaket'], correct: 'Notdienst' },
      { options: ['pro', 'ohne', 'gegen'], correct: 'pro' },
      { options: ['zur Verfügung', 'im Urlaub', 'im Streik'], correct: 'zur Verfügung' },
    ],
  },
  {
    hint: 'Teil 2: Schulungsangebot',
    text: 'Sehr geehrte Damen und Herren,\nwir bieten ab November ein ___ für Führungskräfte an. Der Kurs vermittelt Kommunikationsstrategien. Die Teilnahmegebühr beträgt 690 Euro, ___ Verpflegung. Absolventen erhalten ein anerkanntes ___ . ___ nehmen wir bis zum 25. Oktober ___ .\nMit freundlichen Grüßen\nAkademie Führung',
    gaps: [
      { options: ['Intensivseminar', 'Strafseminar', 'Pausenseminar'], correct: 'Intensivseminar' },
      { options: ['inklusive', 'ausschließlich', 'ohne jede'], correct: 'inklusive' },
      { options: ['Zertifikat', 'Strafzettel', 'Mahnbescheid'], correct: 'Zertifikat' },
      { options: ['Anmeldungen', 'Kündigungen', 'Strafen'], correct: 'Anmeldungen' },
      { options: ['entgegen', 'mit', 'entgegennehmen'], correct: 'entgegen' },
    ],
  },
  {
    hint: 'Teil 2: Eingangsbestätigung Beschwerde',
    text: 'Sehr geehrte Frau Keller,\nwir bestätigen den Eingang Ihrer ___ vom 18. Juni. Ihr Anliegen wurde an die zuständige Abteilung ___ . Sie erhalten innerhalb von zehn Werktagen eine ausführliche ___ . Vielen Dank, dass Sie uns Ihr ___ ___ haben.\nMit freundlichen Grüßen\nQualitätsmanagement',
    gaps: [
      { options: ['Beschwerde', 'Strafe', 'Werbung'], correct: 'Beschwerde' },
      { options: ['weitergeleitet', 'verworfen', 'ignoriert'], correct: 'weitergeleitet' },
      { options: ['Antwort', 'Mahnung', 'Rechnung'], correct: 'Antwort' },
      { options: ['Feedback', 'Strafe', 'Kündigung'], correct: 'Feedback' },
      { options: ['mitgeteilt', 'verborgen', 'gelöscht'], correct: 'mitgeteilt' },
    ],
  },
  {
    hint: 'Teil 2: Behördenantwort Wartezeit',
    text: 'Sehr geehrte Frau Al-Rashid,\nwir haben Ihre Nachricht vom 4. Mai erhalten. Aufgrund eines erhöhten Aufkommens kann die Bearbeitung bis zu zwölf Wochen dauern. Ihr ___ wird jedoch prioritär ___ . Sobald eine ___ vorliegt, informieren wir Sie ___ . Wir bitten um ___ .\nMit freundlichen Grüßen\nBürgeramt Mitte',
    gaps: [
      { options: ['Antrag', 'Urlaub', 'Streik'], correct: 'Antrag' },
      { options: ['bearbeitet', 'gelöscht', 'ignoriert'], correct: 'bearbeitet' },
      { options: ['Entscheidung', 'Werbung', 'Pause'], correct: 'Entscheidung' },
      { options: ['schriftlich', 'mündlich', 'telepathisch'], correct: 'schriftlich' },
      { options: ['Ihre Geduld', 'Ihre Strafe', 'Ihre Kündigung'], correct: 'Ihre Geduld' },
    ],
  },
];

/** @param {TextGapsTask[]} list @param {string} label */
export function validateTasks(list, label) {
  if (list.length !== 20) throw new Error(`${label}: expected 20, got ${list.length}`);
  list.forEach((task, i) => {
    const n = (task.text.match(/___/g) || []).length;
    if (n !== 5) throw new Error(`${label}[${i}] (${task.hint}): expected 5 blanks, got ${n}`);
    if (task.gaps.length !== 5) throw new Error(`${label}[${i}]: gaps array length ${task.gaps.length}`);
    task.gaps.forEach((g, j) => {
      if (g.options.length !== 3) throw new Error(`${label}[${i}] gap ${j}: need 3 options`);
      if (!g.options.includes(g.correct)) throw new Error(`${label}[${i}] gap ${j}: correct not in options`);
    });
  });
}
