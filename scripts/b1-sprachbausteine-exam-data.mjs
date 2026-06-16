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
    prompt: '___ weiteren Fragen steht Ihnen unsere Hotline werktags von 9 bis 17 Uhr zur Verfügung.',
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

/** @typedef {{ correct: string, options: string[] }} Gap */

/**
 * Long texts (>2 sentences): one task, 3 clickable gaps with popup (3 options each).
 * @type {{ hint: string, text: string, gaps: Gap[] }[]}
 */
export const LESEN_SERIES = [
  {
    hint: 'Leseverstehen: Bewerbung an die Universität',
    text: 'Sehr geehrte Damen und Herren, ich ___ mich hiermit um einen Studienplatz im Masterstudiengang Germanistik. Da ich bereits einen Bachelorabschluss ___ Medienwissenschaft habe, bringe ich die nötigen Vorkenntnisse mit. Für Rückfragen bin ich jederzeit ___ Sie erreichbar.',
    gaps: [
      { correct: 'bewerbe', options: ['bewerbe', 'bewerben', 'bewirbt'] },
      { correct: 'in', options: ['in', 'an', 'auf'] },
      { correct: 'für', options: ['für', 'an', 'mit'] },
    ],
  },
  {
    hint: 'Leseverstehen: Krankmeldung an den Arbeitgeber',
    text: 'Sehr geehrter Herr Becker, leider muss ich Ihnen ___ , dass ich heute arbeitsunfähig bin. Laut meines Arztes soll ich die nächsten drei Tage zu Hause ___ . Die Bescheinigung erhalten Sie im ___ .',
    gaps: [
      { correct: 'mitteilen', options: ['mitteilen', 'mitteilt', 'mitgeteilt'] },
      { correct: 'bleiben', options: ['bleiben', 'bleibt', 'blieb'] },
      { correct: 'Anhang', options: ['Anhang', 'Anhänge', 'Anhanges'] },
    ],
  },
  {
    hint: 'Leseverstehen: Kündigung der Wohnung',
    text: 'Sehr geehrte Frau Hoffmann, hiermit ___ ich meine Wohnung in der Lindenstraße 14 zum 31. März. Die Wohnung werde ich besenrein und in ___ Zustand übergeben. Bitte bestätigen Sie den ___ dieses Schreibens.',
    gaps: [
      { correct: 'kündige', options: ['kündige', 'kündigen', 'kündigt'] },
      { correct: 'ordentlichem', options: ['ordentlichem', 'ordentlichen', 'ordentliche'] },
      { correct: 'Erhalt', options: ['Erhalt', 'Erhaltung', 'Erhalten'] },
    ],
  },
  {
    hint: 'Leseverstehen: Anmeldung zum Sprachseminar',
    text: 'Guten Tag, ich möchte mich ___ Ihr B1-Seminar am 5. November anmelden. Da ich berufstätig bin, wäre ein Abendkurs für mich am besten ___. Über eine kurze Bestätigung würde ich mich ___.',
    gaps: [
      { correct: 'für', options: ['für', 'an', 'auf'] },
      { correct: 'geeignet', options: ['geeignet', 'geeignete', 'geeigneten'] },
      { correct: 'freuen', options: ['freuen', 'freut', 'freute'] },
    ],
  },
  {
    hint: 'Leseverstehen: Beschwerde an das Hotel',
    text: 'Sehr geehrte Damen und Herren, während meines Aufenthalts in Ihrem Hotel vom 3. bis 7. Mai musste ich leider ___ , dass mein Zimmer nicht ordnungsgemäß ___ war. Außerdem war die Heizung in der Nacht mehrfach ausgefallen. Ich bitte um eine ___ Lösung.',
    gaps: [
      { correct: 'feststellen', options: ['feststellen', 'feststellt', 'festgestellt'] },
      { correct: 'gereinigt', options: ['gereinigt', 'reinigen', 'reinigt'] },
      { correct: 'angemessene', options: ['angemessene', 'angemessenen', 'angemessenem'] },
    ],
  },
  {
    hint: 'Leseverstehen: Einladung zur Firmenveranstaltung',
    text: 'Liebe Mitarbeiterinnen und Mitarbeiter, wir laden Sie herzlich ___ unserer Jahresfeier am Freitag, den 18. Dezember, ein. Die Veranstaltung beginnt um 18 Uhr im ___ Konferenzsaal. Bitte geben Sie bis zum 10. Dezember ___, ob Sie teilnehmen.',
    gaps: [
      { correct: 'zu', options: ['zu', 'an', 'auf'] },
      { correct: 'großen', options: ['großen', 'großem', 'große'] },
      { correct: 'Bescheid', options: ['Bescheid', 'Bescheide', 'Bescheides'] },
    ],
  },
  {
    hint: 'Leseverstehen: Anfrage an die Krankenkasse',
    text: 'Sehr geehrte Damen und Herren, ich ___ mich an Sie, weil ich eine Frage zur Kostenübernahme eines Rehasportkurses habe. Mein Hausarzt hat mir diesen Kurs ___. Könnten Sie mir bitte ___, welche Unterlagen Sie benötigen?',
    gaps: [
      { correct: 'wende', options: ['wende', 'wenden', 'wendet'] },
      { correct: 'empfohlen', options: ['empfohlen', 'empfehlen', 'empfiehlt'] },
      { correct: 'mitteilen', options: ['mitteilen', 'mitteilt', 'mitgeteilt'] },
    ],
  },
  {
    hint: 'Leseverstehen: Einladung zum Elternabend',
    text: 'Sehr geehrte Eltern, wir laden Sie herzlich zum Elternabend ___ Klasse 8b ein. Die Veranstaltung findet am Donnerstag um 19 Uhr in der Aula ___. Bitte melden Sie sich bis Mittwoch bei der Klassenleitung ___.',
    gaps: [
      { correct: 'der', options: ['der', 'den', 'dem'] },
      { correct: 'statt', options: ['statt', 'an', 'vor'] },
      { correct: 'an', options: ['an', 'auf', 'zu'] },
    ],
  },
  {
    hint: 'Leseverstehen: Anfrage nach einem Praktikumsplatz',
    text: 'Sehr geehrter Herr Schneider, mit großem Interesse habe ich Ihre Stellenanzeige ___ Praktikantin im Marketing gelesen. Ich studiere im vierten Semester Betriebswirtschaft und suche ab Juli ein ___. Gerne würde ich mich persönlich ___ Ihnen vorstellen.',
    gaps: [
      { correct: 'als', options: ['als', 'für', 'an'] },
      { correct: 'Pflichtpraktikum', options: ['Pflichtpraktikum', 'Pflichtpraktikums', 'Pflichtpraktika'] },
      { correct: 'bei', options: ['bei', 'an', 'mit'] },
    ],
  },
  {
    hint: 'Leseverstehen: Dankesbrief nach dem Vorstellungsgespräch',
    text: 'Sehr geehrte Frau Krause, vielen Dank für das freundliche Gespräch am Montag. Ich habe den Eindruck gewonnen, dass meine Erfahrung gut ___ Ihren Anforderungen passt. Über eine ___ würde ich mich sehr ___.',
    gaps: [
      { correct: 'zu', options: ['zu', 'an', 'auf'] },
      { correct: 'Rückmeldung', options: ['Rückmeldung', 'Rückmeldungen', 'Rückmelden'] },
      { correct: 'freuen', options: ['freuen', 'freut', 'freute'] },
    ],
  },
];
