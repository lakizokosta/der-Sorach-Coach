/**
 * Curated B1 Sprachbausteine — exam-style «Texte mit Lücken».
 * 20 standalone select-one + 10 connected texts × 3 questions (Leseverstehen).
 */

/** @typedef {{ prompt: string, options: string[], correct: string }} Q */

/** @type {Q[]} */
export const SPRACH_STANDALONE = [
  {
    prompt: 'Sehr geehrte Damen und Herren, hiermit bestätigen wir den Erhalt Ihrer ___ vom 12. Mai.',
    correct: 'Anfrage',
    options: ['Anfrage', 'Bewerbung', 'Nachricht', 'Mitteilung'],
  },
  {
    prompt: 'Bitte überweisen Sie den Betrag ___ das auf der Rechnung genannte Konto.',
    correct: 'auf',
    options: ['auf', 'an', 'in', 'bei'],
  },
  {
    prompt: '___ weiterer Fragen steht Ihnen unsere Hotline werktags von 9 bis 17 Uhr zur Verfügung.',
    correct: 'Bei',
    options: ['Bei', 'Für', 'Mit', 'An'],
  },
  {
    prompt: 'Die Anmeldung zum Integrationskurs ist noch bis zum 30. Juni ___.',
    correct: 'möglich',
    options: ['möglich', 'mögliche', 'möglichen', 'möglichem'],
  },
  {
    prompt: 'Wir weisen darauf hin, dass die Eintrittskarten im Voraus ___ werden müssen.',
    correct: 'reserviert',
    options: ['reserviert', 'reservieren', 'reservierte', 'reservierend'],
  },
  {
    prompt: 'Der Leistungsnachweis wird Ihnen nach bestandener Prüfung automatisch ___ E-Mail zugesandt.',
    correct: 'per',
    options: ['per', 'mit', 'auf', 'an'],
  },
  {
    prompt: 'Wir bitten um Ihr Verständnis ___ der kurzfristigen Terminverschiebung.',
    correct: 'wegen',
    options: ['wegen', 'trotz', 'während', 'ohne'],
  },
  {
    prompt: 'Die mündliche Prüfung findet am Dienstag um 10 Uhr im Raum B12 ___.',
    correct: 'statt',
    options: ['statt', 'an', 'vor', 'nach'],
  },
  {
    prompt: 'Sollten Sie den Termin nicht wahrnehmen können, teilen Sie uns dies bitte ___ mit.',
    correct: 'rechtzeitig',
    options: ['rechtzeitig', 'rechtzeitige', 'rechtzeitigen', 'rechtzeitigem'],
  },
  {
    prompt: 'Hiermit ___ ich Sie herzlich zu unserer Informationsveranstaltung am 20. Oktober ein.',
    correct: 'lade',
    options: ['lade', 'laden', 'lädt', 'lud'],
  },
  {
    prompt: 'Die Kursgebühr kann ___ Antrag von der Agentur für Arbeit übernommen werden.',
    correct: 'auf',
    options: ['auf', 'mit', 'an', 'bei'],
  },
  {
    prompt: 'Bitte füllen Sie das Anmeldeformular sorgfältig aus und schicken es uns ___ E-Mail zu.',
    correct: 'per',
    options: ['per', 'mit', 'durch', 'zu'],
  },
  {
    prompt: 'Auf Wunsch stellen wir Ihnen ein offizielles Zertifikat nach Kursende ___.',
    correct: 'aus',
    options: ['aus', 'an', 'zu', 'mit'],
  },
  {
    prompt: 'Das Seminar wurde trotz der Ferienzeit ___ großem Interesse wahrgenommen.',
    correct: 'bei',
    options: ['bei', 'mit', 'nach', 'zu'],
  },
  {
    prompt: 'Bitte verlassen Sie den Veranstaltungsraum in ___ Zustand.',
    correct: 'aufgeräumtem',
    options: ['aufgeräumtem', 'aufgeräumten', 'aufgeräumte', 'aufgeräumter'],
  },
  {
    prompt: 'Die Frist für die Einreichung der Hausarbeit wurde auf den 15. November ___.',
    correct: 'verlängert',
    options: ['verlängert', 'verlängern', 'verlängerte', 'verlängernd'],
  },
  {
    prompt: 'Für die Teilnahme an der Exkursion ist eine vorherige ___ erforderlich.',
    correct: 'Anmeldung',
    options: ['Anmeldung', 'Anmeldungen', 'Anmelden', 'Anmeldend'],
  },
  {
    prompt: 'Die Bibliothek bleibt ___ der Renovierungsarbeiten bis Ende des Monats geschlossen.',
    correct: 'wegen',
    options: ['wegen', 'trotz', 'während', 'aufgrund'],
  },
  {
    prompt: 'Bitte beachten Sie, dass Rauchen im gesamten Gebäude streng ___.',
    correct: 'verboten',
    options: ['verboten', 'verbieten', 'verbietet', 'verbotene'],
  },
  {
    prompt: 'Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bewerbung ___ wurde.',
    correct: 'angenommen',
    options: ['angenommen', 'annehmen', 'nimmt an', 'angenommene'],
  },
];

/**
 * Connected texts: shared hint label + 3 questions on the same E-Mail/Brief.
 * @type {{ hint: string, questions: Q[] }[]}
 */
export const LESEN_SERIES = [
  {
    hint: 'Leseverstehen: Bewerbung an die Universität',
    questions: [
      {
        prompt: 'Sehr geehrte Damen und Herren, ich ___ mich hiermit um einen Studienplatz im Masterstudiengang Germanistik. Da ich bereits einen Bachelorabschluss in Medienwissenschaft habe, bringe ich die nötigen Vorkenntnisse mit. Für Rückfragen bin ich jederzeit für Sie erreichbar.',
        correct: 'bewerbe',
        options: ['bewerbe', 'bewerben', 'bewirbt', 'beworben'],
      },
      {
        prompt: 'Sehr geehrte Damen und Herren, ich bewerbe mich hiermit um einen Studienplatz im Masterstudiengang Germanistik. Da ich bereits einen Bachelorabschluss ___ Medienwissenschaft habe, bringe ich die nötigen Vorkenntnisse mit. Für Rückfragen bin ich jederzeit für Sie erreichbar.',
        correct: 'in',
        options: ['in', 'an', 'auf', 'bei'],
      },
      {
        prompt: 'Sehr geehrte Damen und Herren, ich bewerbe mich hiermit um einen Studienplatz im Masterstudiengang Germanistik. Da ich bereits einen Bachelorabschluss in Medienwissenschaft habe, bringe ich die nötigen Vorkenntnisse mit. Für Rückfragen bin ich jederzeit ___ Sie erreichbar.',
        correct: 'für',
        options: ['für', 'an', 'mit', 'zu'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Krankmeldung an den Arbeitgeber',
    questions: [
      {
        prompt: 'Sehr geehrter Herr Becker, leider muss ich Ihnen ___ , dass ich heute arbeitsunfähig bin. Laut meines Arztes soll ich die nächsten drei Tage zu Hause bleiben. Die Bescheinigung erhalten Sie im Anhang.',
        correct: 'mitteilen',
        options: ['mitteilen', 'mitteilt', 'mitgeteilt', 'mitteilend'],
      },
      {
        prompt: 'Sehr geehrter Herr Becker, leider muss ich Ihnen mitteilen, dass ich heute arbeitsunfähig bin. Laut meines Arztes soll ich die nächsten drei Tage zu Hause ___ . Die Bescheinigung erhalten Sie im Anhang.',
        correct: 'bleiben',
        options: ['bleiben', 'bleibt', 'blieb', 'geblieben'],
      },
      {
        prompt: 'Sehr geehrter Herr Becker, leider muss ich Ihnen mitteilen, dass ich heute arbeitsunfähig bin. Laut meines Arztes soll ich die nächsten drei Tage zu Hause bleiben. Die Bescheinigung erhalten Sie im ___ .',
        correct: 'Anhang',
        options: ['Anhang', 'Anhänge', 'Anhanges', 'Anhängen'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Kündigung der Wohnung',
    questions: [
      {
        prompt: 'Sehr geehrte Frau Hoffmann, hiermit ___ ich meine Wohnung in der Lindenstraße 14 zum 31. März. Die Wohnung werde ich besenrein und in ordentlichem Zustand übergeben. Bitte bestätigen Sie den Erhalt dieses Schreibens.',
        correct: 'kündige',
        options: ['kündige', 'kündigen', 'kündigt', 'gekündigt'],
      },
      {
        prompt: 'Sehr geehrte Frau Hoffmann, hiermit kündige ich meine Wohnung in der Lindenstraße 14 zum 31. März. Die Wohnung werde ich besenrein und in ___ Zustand übergeben. Bitte bestätigen Sie den Erhalt dieses Schreibens.',
        correct: 'ordentlichem',
        options: ['ordentlichem', 'ordentlichen', 'ordentliche', 'ordentlicher'],
      },
      {
        prompt: 'Sehr geehrte Frau Hoffmann, hiermit kündige ich meine Wohnung in der Lindenstraße 14 zum 31. März. Die Wohnung werde ich besenrein und in ordentlichem Zustand übergeben. Bitte bestätigen Sie den ___ dieses Schreibens.',
        correct: 'Erhalt',
        options: ['Erhalt', 'Erhaltung', 'Erhalten', 'Erhaltens'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Anmeldung zum Sprachseminar',
    questions: [
      {
        prompt: 'Guten Tag, ich möchte mich ___ Ihr B1-Seminar am 5. November anmelden. Da ich berufstätig bin, wäre ein Abendkurs für mich am besten geeignet. Über eine kurze Bestätigung würde ich mich freuen.',
        correct: 'für',
        options: ['für', 'an', 'auf', 'zu'],
      },
      {
        prompt: 'Guten Tag, ich möchte mich für Ihr B1-Seminar am 5. November anmelden. Da ich berufstätig bin, wäre ein Abendkurs für mich am besten ___. Über eine kurze Bestätigung würde ich mich freuen.',
        correct: 'geeignet',
        options: ['geeignet', 'geeignete', 'geeigneten', 'geeignetem'],
      },
      {
        prompt: 'Guten Tag, ich möchte mich für Ihr B1-Seminar am 5. November anmelden. Da ich berufstätig bin, wäre ein Abendkurs für mich am besten geeignet. Über eine kurze Bestätigung würde ich mich ___.',
        correct: 'freuen',
        options: ['freuen', 'freut', 'freute', 'gefreut'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Beschwerde an das Hotel',
    questions: [
      {
        prompt: 'Sehr geehrte Damen und Herren, während meines Aufenthalts in Ihrem Hotel vom 3. bis 7. Mai musste ich leider ___ , dass mein Zimmer nicht ordnungsgemäß gereinigt war. Außerdem war die Heizung in der Nacht mehrfach ausgefallen. Ich bitte um eine angemessene Lösung.',
        correct: 'feststellen',
        options: ['feststellen', 'feststellt', 'festgestellt', 'feststellend'],
      },
      {
        prompt: 'Sehr geehrte Damen und Herren, während meines Aufenthalts in Ihrem Hotel vom 3. bis 7. Mai musste ich leider feststellen, dass mein Zimmer nicht ordnungsgemäß ___ war. Außerdem war die Heizung in der Nacht mehrfach ausgefallen. Ich bitte um eine angemessene Lösung.',
        correct: 'gereinigt',
        options: ['gereinigt', 'reinigen', 'reinigt', 'reinigend'],
      },
      {
        prompt: 'Sehr geehrte Damen und Herren, während meines Aufenthalts in Ihrem Hotel vom 3. bis 7. Mai musste ich leider feststellen, dass mein Zimmer nicht ordnungsgemäß gereinigt war. Außerdem war die Heizung in der Nacht mehrfach ausgefallen. Ich bitte um eine ___ Lösung.',
        correct: 'angemessene',
        options: ['angemessene', 'angemessenen', 'angemessenem', 'angemessener'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Einladung zur Firmenveranstaltung',
    questions: [
      {
        prompt: 'Liebe Mitarbeiterinnen und Mitarbeiter, wir laden Sie herzlich ___ unserer Jahresfeier am Freitag, den 18. Dezember, ein. Die Veranstaltung beginnt um 18 Uhr im großen Konferenzsaal. Bitte geben Sie bis zum 10. Dezember Bescheid, ob Sie teilnehmen.',
        correct: 'zu',
        options: ['zu', 'an', 'auf', 'in'],
      },
      {
        prompt: 'Liebe Mitarbeiterinnen und Mitarbeiter, wir laden Sie herzlich zu unserer Jahresfeier am Freitag, den 18. Dezember, ein. Die Veranstaltung beginnt um 18 Uhr im ___ Konferenzsaal. Bitte geben Sie bis zum 10. Dezember Bescheid, ob Sie teilnehmen.',
        correct: 'großen',
        options: ['großen', 'großem', 'große', 'großer'],
      },
      {
        prompt: 'Liebe Mitarbeiterinnen und Mitarbeiter, wir laden Sie herzlich zu unserer Jahresfeier am Freitag, den 18. Dezember, ein. Die Veranstaltung beginnt um 18 Uhr im großen Konferenzsaal. Bitte geben Sie bis zum 10. Dezember ___, ob Sie teilnehmen.',
        correct: 'Bescheid',
        options: ['Bescheid', 'Bescheide', 'Bescheides', 'Bescheiden'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Anfrage an die Krankenkasse',
    questions: [
      {
        prompt: 'Sehr geehrte Damen und Herren, ich ___ mich an Sie, weil ich eine Frage zur Kostenübernahme eines Rehasportkurses habe. Mein Hausarzt hat mir diesen Kurs empfohlen. Könnten Sie mir bitte mitteilen, welche Unterlagen Sie benötigen?',
        correct: 'wende',
        options: ['wende', 'wenden', 'wendet', 'gewandt'],
      },
      {
        prompt: 'Sehr geehrte Damen und Herren, ich wende mich an Sie, weil ich eine Frage zur Kostenübernahme eines Rehasportkurses habe. Mein Hausarzt hat mir diesen Kurs ___. Könnten Sie mir bitte mitteilen, welche Unterlagen Sie benötigen?',
        correct: 'empfohlen',
        options: ['empfohlen', 'empfehlen', 'empfiehlt', 'empfehlend'],
      },
      {
        prompt: 'Sehr geehrte Damen und Herren, ich wende mich an Sie, weil ich eine Frage zur Kostenübernahme eines Rehasportkurses habe. Mein Hausarzt hat mir diesen Kurs empfohlen. Könnten Sie mir bitte ___, welche Unterlagen Sie benötigen?',
        correct: 'mitteilen',
        options: ['mitteilen', 'mitteilt', 'mitgeteilt', 'mitteilend'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Einladung zum Elternabend',
    questions: [
      {
        prompt: 'Sehr geehrte Eltern, wir laden Sie herzlich zum Elternabend ___ Klasse 8b ein. Die Veranstaltung findet am Donnerstag um 19 Uhr in der Aula statt. Bitte melden Sie sich bis Mittwoch bei der Klassenleitung an.',
        correct: 'der',
        options: ['der', 'den', 'dem', 'die'],
      },
      {
        prompt: 'Sehr geehrte Eltern, wir laden Sie herzlich zum Elternabend der Klasse 8b ein. Die Veranstaltung findet am Donnerstag um 19 Uhr in der Aula ___. Bitte melden Sie sich bis Mittwoch bei der Klassenleitung an.',
        correct: 'statt',
        options: ['statt', 'an', 'vor', 'nach'],
      },
      {
        prompt: 'Sehr geehrte Eltern, wir laden Sie herzlich zum Elternabend der Klasse 8b ein. Die Veranstaltung findet am Donnerstag um 19 Uhr in der Aula statt. Bitte melden Sie sich bis Mittwoch bei der Klassenleitung ___.',
        correct: 'an',
        options: ['an', 'auf', 'zu', 'mit'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Anfrage nach einem Praktikumsplatz',
    questions: [
      {
        prompt: 'Sehr geehrter Herr Schneider, mit großem Interesse habe ich Ihre Stellenanzeige ___ Praktikantin im Marketing gelesen. Ich studiere im vierten Semester Betriebswirtschaft und suche ab Juli ein Pflichtpraktikum. Gerne würde ich mich persönlich bei Ihnen vorstellen.',
        correct: 'als',
        options: ['als', 'für', 'an', 'bei'],
      },
      {
        prompt: 'Sehr geehrter Herr Schneider, mit großem Interesse habe ich Ihre Stellenanzeige als Praktikantin im Marketing gelesen. Ich studiere im vierten Semester Betriebswirtschaft und suche ab Juli ein ___ Praktikum. Gerne würde ich mich persönlich bei Ihnen vorstellen.',
        correct: 'Pflicht',
        options: ['Pflicht', 'Pflichten', 'Pflichtes', 'Pflichtend'],
      },
      {
        prompt: 'Sehr geehrter Herr Schneider, mit großem Interesse habe ich Ihre Stellenanzeige als Praktikantin im Marketing gelesen. Ich studiere im vierten Semester Betriebswirtschaft und suche ab Juli ein Pflichtpraktikum. Gerne würde ich mich persönlich ___ Ihnen vorstellen.',
        correct: 'bei',
        options: ['bei', 'an', 'mit', 'zu'],
      },
    ],
  },
  {
    hint: 'Leseverstehen: Dankesbrief nach dem Vorstellungsgespräch',
    questions: [
      {
        prompt: 'Sehr geehrte Frau Krause, vielen Dank für das freundliche Gespräch am Montag. Ich habe den Eindruck gewonnen, dass meine Erfahrung gut ___ Ihren Anforderungen passt. Über eine Rückmeldung würde ich mich sehr freuen.',
        correct: 'zu',
        options: ['zu', 'an', 'auf', 'mit'],
      },
      {
        prompt: 'Sehr geehrte Frau Krause, vielen Dank für das freundliche Gespräch am Montag. Ich habe den Eindruck gewonnen, dass meine Erfahrung gut zu Ihren Anforderungen passt. Über eine ___ würde ich mich sehr freuen.',
        correct: 'Rückmeldung',
        options: ['Rückmeldung', 'Rückmeldungen', 'Rückmeldend', 'Rückmelden'],
      },
      {
        prompt: 'Sehr geehrte Frau Krause, vielen Dank für das freundliche Gespräch am Montag. Ich habe den Eindruck gewonnen, dass meine Erfahrung gut zu Ihren Anforderungen passt. Über eine Rückmeldung würde ich mich sehr ___.',
        correct: 'freuen',
        options: ['freuen', 'freut', 'freute', 'gefreut'],
      },
    ],
  },
];
