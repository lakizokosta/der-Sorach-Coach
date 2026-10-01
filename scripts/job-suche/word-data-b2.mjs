/** B2 lemma specs — Job suche (Sie-Register) */

export const b2Words = [
  {
    lemma: 'Arbeitsmarkt',
    hint: 'Wortschatz — Angebot und Nachfrage nach Arbeitskräften',
    so: {
      body: 'In der Analyse beschreiben Sie den aktuellen ___.',
      options: ['Arbeitsmarkt', 'Tarifvertrag', 'Betriebsrat'],
      correct: 'Arbeitsmarkt',
    },
    ms: {
      body: 'Was gehört zum Arbeitsmarkt? Wählen Sie alle richtigen Antworten.',
      options: ['Stellenangebote', 'Arbeitslosigkeit', 'Fachkräftemangel', 'Gehaltsverhandlung', 'Soft Skills'],
      correct: ['Stellenangebote', 'Arbeitslosigkeit', 'Fachkräftemangel'],
    },
    dd: ['Der', 'Arbeitsmarkt', 'ist', 'sehr', 'dynamisch', '.'],
    in: {
      wordChoices: ['Arbeitsmarkt', 'Tarifvertrag', 'Betriebsrat'],
      correct: ['Arbeitsmarkt'],
      body: 'Ergänzen Sie:\n\nIm Report lesen Sie über den regionalen ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie analysieren Stellenangebote und Arbeitslosigkeit in der Region — nicht Tarifverhandlungen im Betriebsrat.',
      dialog: 'Berater: Wie beurteilen Sie den ___?\nSie: Die Nachfrage nach Fachkräften steigt.',
      options: ['Arbeitsmarkt,Tarifvertrag,Betriebsrat'],
      correct: ['Arbeitsmarkt'],
    },
  },
  {
    lemma: 'Recruiting',
    hint: 'Wortschatz — gezielte Personalgewinnung',
    so: {
      body: 'Die HR-Abteilung optimiert das ___ für Fachkräfte.',
      options: ['Recruiting', 'Arbeitsrecht', 'Zeitarbeit'],
      correct: 'Recruiting',
    },
    ms: {
      body: 'Was gehört zum Recruiting? Wählen Sie alle richtigen Antworten.',
      options: ['Stellenausschreibung', 'Bewerbungsgespräch', 'Kandidatensuche', 'Tarifvertrag', 'Betriebsrat'],
      correct: ['Stellenausschreibung', 'Bewerbungsgespräch', 'Kandidatensuche'],
    },
    dd: ['Das', 'Recruiting', 'wird', 'digitaler', '.'],
    in: {
      wordChoices: ['Recruiting', 'Arbeitsrecht', 'Zeitarbeit'],
      correct: ['Recruiting'],
      body: 'Ergänzen Sie:\n\nIm Workshop verbessern Sie Ihr ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie planen Stellenausschreibungen und Gespräche mit Kandidaten — kein Arbeitsrechtsseminar.',
      dialog: 'Kollege: Wie läuft Ihr ___?\nSie: Wir nutzen neue Kanäle für Fachkräfte.',
      options: ['Recruiting,Arbeitsrecht,Zeitarbeit'],
      correct: ['Recruiting'],
    },
  },
  {
    lemma: 'Headhunter',
    hint: 'Wortschatz — Personalberater für Führungspositionen',
    so: {
      body: 'Ein ___ kontaktiert Sie wegen einer Führungsposition.',
      options: ['Headhunter', 'Betriebsrat', 'Freelancer'],
      correct: 'Headhunter',
    },
    ms: {
      body: 'Was macht ein Headhunter? Wählen Sie alle richtigen Antworten.',
      options: ['Kandidaten suchen', 'Führungskräfte ansprechen', 'Vermittlung', 'Tarifverhandlung', 'Zeitarbeit'],
      correct: ['Kandidaten suchen', 'Führungskräfte ansprechen', 'Vermittlung'],
    },
    dd: ['Der', 'Headhunter', 'ruft', 'Sie', 'an', '.'],
    in: {
      wordChoices: ['Headhunter', 'Betriebsrat', 'Freelancer'],
      correct: ['Headhunter'],
      body: 'Ergänzen Sie:\n\nEin ___ schlägt Ihnen eine neue Stelle vor.',
    },
    tg: {
      story: 'Vorgeschichte: Sie erhalten einen Anruf von einem Personalberater wegen einer Führungsrolle — nicht vom Betriebsrat.',
      dialog: 'Anrufer: Darf ich als ___ sprechen?\nSie: Ja, erzählen Sie mir von der Position.',
      options: ['Headhunter,Betriebsrat,Freelancer'],
      correct: ['Headhunter'],
    },
  },
  {
    lemma: 'Assessment Center',
    hint: 'Wortschatz — mehrstufiges Auswahlverfahren',
    so: {
      body: 'Nach dem Vorstellungsgespräch laden Sie zum ___ ein.',
      options: ['Assessment Center', 'Tarifvertrag', 'Arbeitsagentur'],
      correct: 'Assessment Center',
    },
    ms: {
      body: 'Was finden Sie im Assessment Center? Wählen Sie alle richtigen Antworten.',
      options: ['Gruppenaufgabe', 'Präsentation', 'Rollenspiel', 'Tarifvertrag', 'Recruiting'],
      correct: ['Gruppenaufgabe', 'Präsentation', 'Rollenspiel'],
    },
    dd: ['Das', 'Assessment Center', 'dauert', 'einen', 'Tag', '.'],
    in: {
      wordChoices: ['Assessment Center', 'Tarifvertrag', 'Arbeitsagentur'],
      correct: ['Assessment Center'],
      body: 'Ergänzen Sie:\n\nIm ___ zeigen Sie Ihre Soft Skills.',
    },
    tg: {
      story: 'Vorgeschichte: Sie absolvieren Gruppenaufgaben und Präsentationen beim Arbeitgeber — keine Tarifverhandlung.',
      dialog: 'Recruiter: Kommen Sie zum ___?\nSie: Ja, ich bereite die Aufgaben vor.',
      options: ['Assessment Center,Tarifvertrag,Arbeitsagentur'],
      correct: ['Assessment Center'],
    },
  },
  {
    lemma: 'Gehaltsverhandlung',
    hint: 'Wortschatz — Verhandlung über Vergütung',
    so: {
      body: 'Vor Vertragsabschluss führen Sie eine ___.',
      options: ['Gehaltsverhandlung', 'Vermittlung', 'Arbeitslosigkeit'],
      correct: 'Gehaltsverhandlung',
    },
    ms: {
      body: 'Was gehört zur Gehaltsverhandlung? Wählen Sie alle richtigen Antworten.',
      options: ['Gehaltsvorstellung', 'Benefits', 'Kompromiss', 'Kündigungsfrist', 'Betriebsratwahl'],
      correct: ['Gehaltsvorstellung', 'Benefits', 'Kompromiss'],
    },
    dd: ['Die', 'Gehaltsverhandlung', 'verläuft', 'konstruktiv', '.'],
    in: {
      wordChoices: ['Gehaltsverhandlung', 'Vermittlung', 'Arbeitslosigkeit'],
      correct: ['Gehaltsverhandlung'],
      body: 'Ergänzen Sie:\n\nIm Gespräch führen Sie eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie besprechen Gehalt und Zusatzleistungen mit dem Personalmanager — keine Vermittlung durch die Agentur.',
      dialog: 'HR: Wann machen wir die ___?\nSie: Gerne nächste Woche.',
      options: ['Gehaltsverhandlung,Vermittlung,Arbeitslosigkeit'],
      correct: ['Gehaltsverhandlung'],
    },
  },
  {
    lemma: 'Tarifvertrag',
    hint: 'Wortschatz — kollektive Arbeitsbedingungen',
    so: {
      body: 'Laut ___ haben Sie Anspruch auf Weihnachtsgeld.',
      options: ['Tarifvertrag', 'Headhunter', 'Networking'],
      correct: 'Tarifvertrag',
    },
    ms: {
      body: 'Was regelt ein Tarifvertrag? Wählen Sie alle richtigen Antworten.',
      options: ['Gehalt', 'Arbeitszeit', 'Urlaub', 'Bewerbung', 'Assessment Center'],
      correct: ['Gehalt', 'Arbeitszeit', 'Urlaub'],
    },
    dd: ['Der', 'Tarifvertrag', 'gilt', 'für', 'alle', 'Mitarbeiter', '.'],
    in: {
      wordChoices: ['Tarifvertrag', 'Headhunter', 'Networking'],
      correct: ['Tarifvertrag'],
      body: 'Ergänzen Sie:\n\nIm Betrieb gilt ein neuer ___.',
    },
    tg: {
      story: 'Vorgeschichte: Gewerkschaft und Arbeitgeber vereinbaren Gehalt und Arbeitszeit — kein Headhunter ist beteiligt.',
      dialog: 'Kollege: Kennen Sie den ___?\nSie: Ja, er wurde letzte Woche unterzeichnet.',
      options: ['Tarifvertrag,Headhunter,Networking'],
      correct: ['Tarifvertrag'],
    },
  },
  {
    lemma: 'Betriebsrat',
    hint: 'Wortschatz — Vertretung der Arbeitnehmer im Betrieb',
    so: {
      body: 'Bei Kündigungen konsultieren Sie den ___.',
      options: ['Betriebsrat', 'Headhunter', 'Freelancer'],
      correct: 'Betriebsrat',
    },
    ms: {
      body: 'Was macht der Betriebsrat? Wählen Sie alle richtigen Antworten.',
      options: ['Mitarbeiter vertreten', 'Arbeitsbedingungen prüfen', 'Anhörung', 'Recruiting', 'Zeitarbeit vermitteln'],
      correct: ['Mitarbeiter vertreten', 'Arbeitsbedingungen prüfen', 'Anhörung'],
    },
    dd: ['Der', 'Betriebsrat', 'schützt', 'Ihre', 'Rechte', '.'],
    in: {
      wordChoices: ['Betriebsrat', 'Headhunter', 'Freelancer'],
      correct: ['Betriebsrat'],
      body: 'Ergänzen Sie:\n\nVor der Entlassung hört der ___ Sie an.',
    },
    tg: {
      story: 'Vorgeschichte: Bei einer geplanten Kündigung wenden Sie sich an die gewählte Arbeitnehmervertretung — nicht an einen Headhunter.',
      dialog: 'Kollege: Haben Sie den ___ informiert?\nSie: Ja, das Gespräch ist terminiert.',
      options: ['Betriebsrat,Headhunter,Freelancer'],
      correct: ['Betriebsrat'],
    },
  },
  {
    lemma: 'Arbeitsrecht',
    hint: 'Wortschatz — gesetzliche Regeln für Arbeitnehmer',
    so: {
      body: 'Im Seminar lernen Sie Grundlagen des ___.',
      options: ['Arbeitsrechts', 'Recruitings', 'Networkings'],
      correct: 'Arbeitsrechts',
    },
    ms: {
      body: 'Was gehört zum Arbeitsrecht? Wählen Sie alle richtigen Antworten.',
      options: ['Kündigungsschutz', 'Arbeitsvertrag', 'Probezeit', 'Soft Skills', 'Arbeitgebermarke'],
      correct: ['Kündigungsschutz', 'Arbeitsvertrag', 'Probezeit'],
    },
    dd: ['Das', 'Arbeitsrecht', 'schützt', 'Arbeitnehmer', '.'],
    in: {
      wordChoices: ['Arbeitsrecht', 'Recruiting', 'Networking'],
      correct: ['Arbeitsrecht'],
      body: 'Ergänzen Sie:\n\nBei Unsicherheit prüfen Sie das ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie klären Kündigungsfristen und Vertragsregeln — kein Recruiting-Workshop.',
      dialog: 'Anwalt: Kennen Sie das ___?\nSie: Ich kenne die wichtigsten Regeln.',
      options: ['Arbeitsrecht,Recruiting,Networking'],
      correct: ['Arbeitsrecht'],
    },
  },
  {
    lemma: 'Freelancer',
    hint: 'Wortschatz — selbstständig ohne Festanstellung',
    so: {
      body: 'Als ___ arbeiten Sie projektbezogen für verschiedene Kunden.',
      options: ['Freelancer', 'Betriebsrat', 'Headhunter'],
      correct: 'Freelancer',
    },
    ms: {
      body: 'Was trifft auf Freelancer zu? Wählen Sie alle richtigen Antworten.',
      options: ['Selbstständigkeit', 'Projektarbeit', 'flexible Zeiten', 'Tarifvertrag', 'Betriebsrat'],
      correct: ['Selbstständigkeit', 'Projektarbeit', 'flexible Zeiten'],
    },
    dd: ['Als', 'Freelancer', 'rechnen', 'Sie', 'pro', 'Projekt', 'ab', '.'],
    in: {
      wordChoices: ['Freelancer', 'Betriebsrat', 'Headhunter'],
      correct: ['Freelancer'],
      body: 'Ergänzen Sie:\n\nSeit zwei Jahren arbeiten Sie als ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind selbstständig und übernehmen Projekte ohne Festanstellung — kein Betriebsratsmitglied.',
      dialog: 'Kunde: Arbeiten Sie als ___?\nSie: Ja, ich bin freiberuflich tätig.',
      options: ['Freelancer,Betriebsrat,Headhunter'],
      correct: ['Freelancer'],
    },
  },
  {
    lemma: 'Zeitarbeit',
    hint: 'Wortschatz — temporäre Arbeit über Agentur',
    so: {
      body: 'Über ___ finden Sie schnell eine Übergangslösung.',
      options: ['Zeitarbeit', 'Arbeitslosigkeit', 'Tarifvertrag'],
      correct: 'Zeitarbeit',
    },
    ms: {
      body: 'Was gehört zur Zeitarbeit? Wählen Sie alle richtigen Antworten.',
      options: ['Leiharbeit', 'befristeter Einsatz', 'Vermittlung', 'Betriebsrat', 'Assessment Center'],
      correct: ['Leiharbeit', 'befristeter Einsatz', 'Vermittlung'],
    },
    dd: ['Die', 'Zeitarbeit', 'bietet', 'flexible', 'Einsätze', '.'],
    in: {
      wordChoices: ['Zeitarbeit', 'Arbeitslosigkeit', 'Tarifvertrag'],
      correct: ['Zeitarbeit'],
      body: 'Ergänzen Sie:\n\nNach der Kündigung nutzen Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: Eine Agentur vermittelt Sie befristet an einen Betrieb — Sie sind nicht arbeitslos gemeldet.',
      dialog: 'Berater: Interessieren Sie sich für ___?\nSie: Ja, als Übergang passt das.',
      options: ['Zeitarbeit,Arbeitslosigkeit,Tarifvertrag'],
      correct: ['Zeitarbeit'],
    },
  },
  {
    lemma: 'Aufstiegschance',
    hint: 'Wortschatz — Möglichkeit zur Karriereentwicklung',
    so: {
      body: 'Die Stelle bietet Ihnen gute ___.',
      options: ['Aufstiegschancen', 'Arbeitslosigkeit', 'Zeitarbeit'],
      correct: 'Aufstiegschancen',
    },
    ms: {
      body: 'Was fördert Aufstiegschancen? Wählen Sie alle richtigen Antworten.',
      options: ['Weiterbildung', 'Leistung', 'Erfahrung', 'Kündigung', 'Arbeitslosigkeit'],
      correct: ['Weiterbildung', 'Leistung', 'Erfahrung'],
    },
    dd: ['Die', 'Aufstiegschance', 'ist', 'realistisch', '.'],
    in: {
      wordChoices: ['Aufstiegschance', 'Arbeitslosigkeit', 'Zeitarbeit'],
      correct: ['Aufstiegschance'],
      body: 'Ergänzen Sie:\n\nIm Gespräch fragen Sie nach der ___.',
    },
    tg: {
      story: 'Vorgeschichte: Der Arbeitgeber verspricht Karrierewege und Weiterbildung — keine befristete Zeitarbeit.',
      dialog: 'Recruiter: Welche ___ sehen Sie?\nSie: Ich möchte ins Management wachsen.',
      options: ['Aufstiegschance,Arbeitslosigkeit,Zeitarbeit'],
      correct: ['Aufstiegschance'],
    },
  },
  {
    lemma: 'Arbeitsbedingungen',
    hint: 'Wortschatz — Rahmenbedingungen am Arbeitsplatz',
    so: {
      body: 'Vor der Unterschrift prüfen Sie die ___.',
      options: ['Arbeitsbedingungen', 'Recruiting', 'Headhunter'],
      correct: 'Arbeitsbedingungen',
    },
    ms: {
      body: 'Was gehört zu Arbeitsbedingungen? Wählen Sie alle richtigen Antworten.',
      options: ['Gehalt', 'Arbeitszeit', 'Urlaub', 'Bewerbungsfoto', 'Assessment Center'],
      correct: ['Gehalt', 'Arbeitszeit', 'Urlaub'],
    },
    dd: ['Die', 'Arbeitsbedingungen', 'sind', 'fair', '.'],
    in: {
      wordChoices: ['Arbeitsbedingungen', 'Recruiting', 'Headhunter'],
      correct: ['Arbeitsbedingungen'],
      body: 'Ergänzen Sie:\n\nIm Vertrag stehen die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie vergleichen Gehalt, Arbeitszeit und Urlaubstage — kein Recruiting-Prozess.',
      dialog: 'Berater: Wie sind die ___?\nSie: Sie entsprechen meinen Erwartungen.',
      options: ['Arbeitsbedingungen,Recruiting,Headhunter'],
      correct: ['Arbeitsbedingungen'],
    },
  },
  {
    lemma: 'Arbeitgebermarke',
    hint: 'Wortschatz — Image des Unternehmens als Arbeitgeber',
    so: {
      body: 'Eine starke ___ zieht Talente an.',
      options: ['Arbeitgebermarke', 'Arbeitslosigkeit', 'Zeitarbeit'],
      correct: 'Arbeitgebermarke',
    },
    ms: {
      body: 'Was stärkt die Arbeitgebermarke? Wählen Sie alle richtigen Antworten.',
      options: ['Mitarbeiterzufriedenheit', 'Benefits', 'Transparenz', 'Kündigung', 'Fachkräftemangel'],
      correct: ['Mitarbeiterzufriedenheit', 'Benefits', 'Transparenz'],
    },
    dd: ['Die', 'Arbeitgebermarke', 'ist', 'sehr', 'attraktiv', '.'],
    in: {
      wordChoices: ['Arbeitgebermarke', 'Arbeitslosigkeit', 'Zeitarbeit'],
      correct: ['Arbeitgebermarke'],
      body: 'Ergänzen Sie:\n\nIm Ranking verbessert sich die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Das Unternehmen investiert in Benefits und gute Bewertungen — kein Thema Arbeitslosigkeit.',
      dialog: 'Marketing: Wie ist unsere ___?\nSie: Bewerber kennen uns als Top-Arbeitgeber.',
      options: ['Arbeitgebermarke,Arbeitslosigkeit,Zeitarbeit'],
      correct: ['Arbeitgebermarke'],
    },
  },
  {
    lemma: 'Networking',
    hint: 'Wortschatz — berufliche Kontakte knüpfen',
    so: {
      body: 'Auf der Jobmesse nutzen Sie ___ für neue Kontakte.',
      options: ['Networking', 'Arbeitsrecht', 'Tarifvertrag'],
      correct: 'Networking',
    },
    ms: {
      body: 'Was hilft beim Networking? Wählen Sie alle richtigen Antworten.',
      options: ['Visitenkarten', 'LinkedIn', 'Branchenevents', 'Kündigung', 'Arbeitslosigkeit'],
      correct: ['Visitenkarten', 'LinkedIn', 'Branchenevents'],
    },
    dd: ['Gutes', 'Networking', 'öffnet', 'Türen', '.'],
    in: {
      wordChoices: ['Networking', 'Arbeitsrecht', 'Tarifvertrag'],
      correct: ['Networking'],
      body: 'Ergänzen Sie:\n\nBeim Branchentreffen betreiben Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie tauschen Visitenkarten aus und sprechen mit Recruitern — kein Arbeitsrechtsseminar.',
      dialog: 'Kollege: Nutzen Sie ___?\nSie: Ja, oft höre ich von offenen Stellen.',
      options: ['Networking,Arbeitsrecht,Tarifvertrag'],
      correct: ['Networking'],
    },
  },
  {
    lemma: 'Soft Skills',
    hint: 'Wortschatz — soziale und persönliche Kompetenzen',
    so: {
      body: 'Im Gespräch betonen Sie Ihre ___.',
      options: ['Soft Skills', 'Tarifvertrag', 'Zeitarbeit'],
      correct: 'Soft Skills',
    },
    ms: {
      body: 'Was zählt zu Soft Skills? Wählen Sie alle richtigen Antworten.',
      options: ['Teamfähigkeit', 'Kommunikation', 'Empathie', 'Gehaltsabrechnung', 'Betriebsrat'],
      correct: ['Teamfähigkeit', 'Kommunikation', 'Empathie'],
    },
    dd: ['Meine', 'Soft Skills', 'überzeugen', 'den', 'Arbeitgeber', '.'],
    in: {
      wordChoices: ['Soft Skills', 'Tarifvertrag', 'Zeitarbeit'],
      correct: ['Soft Skills'],
      body: 'Ergänzen Sie:\n\nIm Lebenslauf listen Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie erklären Teamfähigkeit und Kommunikation — kein Tarifvertrag ist Thema.',
      dialog: 'Recruiter: Welche ___ bringen Sie mit?\nSie: Kommunikation und Problemlösung.',
      options: ['Soft Skills,Tarifvertrag,Zeitarbeit'],
      correct: ['Soft Skills'],
    },
  },
  {
    lemma: 'Fachkräftemangel',
    hint: 'Wortschatz — zu wenig qualifizierte Arbeitskräfte',
    so: {
      body: 'In der IT-Branche herrscht ___.',
      options: ['Fachkräftemangel', 'Arbeitslosigkeit', 'Quereinstieg'],
      correct: 'Fachkräftemangel',
    },
    ms: {
      body: 'Was folgt aus Fachkräftemangel? Wählen Sie alle richtigen Antworten.',
      options: ['Recruiting', 'höhere Gehälter', 'Vermittlung', 'Betriebsrat', 'Arbeitslosigkeit'],
      correct: ['Recruiting', 'höhere Gehälter', 'Vermittlung'],
    },
    dd: ['Der', 'Fachkräftemangel', 'betrifft', 'viele', 'Branchen', '.'],
    in: {
      wordChoices: ['Fachkräftemangel', 'Arbeitslosigkeit', 'Quereinstieg'],
      correct: ['Fachkräftemangel'],
      body: 'Ergänzen Sie:\n\nIm Report lesen Sie über den ___.',
    },
    tg: {
      story: 'Vorgeschichte: Unternehmen suchen dringend qualifizierte Mitarbeiter — Arbeitslosigkeit ist in der Branche niedrig.',
      dialog: 'Experte: Wie stark ist der ___?\nSie: Er verschärft die Stellensuche.',
      options: ['Fachkräftemangel,Arbeitslosigkeit,Quereinstieg'],
      correct: ['Fachkräftemangel'],
    },
  },
  {
    lemma: 'Quereinstieg',
    hint: 'Wortschatz — Berufswechsel in neue Branche',
    so: {
      body: 'Nach der Umschulung planen Sie einen ___.',
      options: ['Quereinstieg', 'Tarifvertrag', 'Betriebsrat'],
      correct: 'Quereinstieg',
    },
    ms: {
      body: 'Was erleichtert den Quereinstieg? Wählen Sie alle richtigen Antworten.',
      options: ['Weiterbildung', 'Praktikum', 'Transferable Skills', 'Arbeitslosigkeit', 'Assessment Center'],
      correct: ['Weiterbildung', 'Praktikum', 'Transferable Skills'],
    },
    dd: ['Der', 'Quereinstieg', 'gelingt', 'mit', 'Vorbereitung', '.'],
    in: {
      wordChoices: ['Quereinstieg', 'Tarifvertrag', 'Betriebsrat'],
      correct: ['Quereinstieg'],
      body: 'Ergänzen Sie:\n\nIm Coaching bereiten Sie Ihren ___ vor.',
    },
    tg: {
      story: 'Vorgeschichte: Sie wechseln nach Umschulung in eine neue Branche — kein Tarifvertrag aus dem alten Betrieb.',
      dialog: 'Berater: Wie planen Sie den ___?\nSie: Mit Praktikum und Networking.',
      options: ['Quereinstieg,Tarifvertrag,Betriebsrat'],
      correct: ['Quereinstieg'],
    },
  },
  {
    lemma: 'Arbeitslosigkeit',
    hint: 'Wortschatz — fehlende Beschäftigung',
    so: {
      body: 'Die Statistik zeigt sinkende ___.',
      options: ['Arbeitslosigkeit', 'Aufstiegschance', 'Arbeitgebermarke'],
      correct: 'Arbeitslosigkeit',
    },
    ms: {
      body: 'Was gehört zur Arbeitslosigkeit? Wählen Sie alle richtigen Antworten.',
      options: ['Arbeitslosengeld', 'Jobsuche', 'Arbeitsagentur', 'Gehaltsverhandlung', 'Betriebsrat'],
      correct: ['Arbeitslosengeld', 'Jobsuche', 'Arbeitsagentur'],
    },
    dd: ['Die', 'Arbeitslosigkeit', 'ist', 'regional', 'unterschiedlich', '.'],
    in: {
      wordChoices: ['Arbeitslosigkeit', 'Aufstiegschance', 'Arbeitgebermarke'],
      correct: ['Arbeitslosigkeit'],
      body: 'Ergänzen Sie:\n\nIm Bericht analysieren Sie die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie werten Arbeitslosenzahlen und Meldungen bei der Agentur aus — keine Gehaltsverhandlung.',
      dialog: 'Analyst: Wie entwickelt sich die ___?\nSie: Sie sinkt leicht in unserer Region.',
      options: ['Arbeitslosigkeit,Aufstiegschance,Arbeitgebermarke'],
      correct: ['Arbeitslosigkeit'],
    },
  },
  {
    lemma: 'Arbeitsagentur',
    hint: 'Wortschatz — staatliche Stellen für Arbeitsvermittlung',
    so: {
      body: 'Sie melden sich bei der ___ arbeitslos.',
      options: ['Arbeitsagentur', 'Headhunter', 'Betriebsrat'],
      correct: 'Arbeitsagentur',
    },
    ms: {
      body: 'Was bietet die Arbeitsagentur? Wählen Sie alle richtigen Antworten.',
      options: ['Vermittlung', 'Beratung', 'Arbeitslosengeld', 'Assessment Center', 'Tarifvertrag'],
      correct: ['Vermittlung', 'Beratung', 'Arbeitslosengeld'],
    },
    dd: ['Die', 'Arbeitsagentur', 'vermittelt', 'passende', 'Stellen', '.'],
    in: {
      wordChoices: ['Arbeitsagentur', 'Headhunter', 'Betriebsrat'],
      correct: ['Arbeitsagentur'],
      body: 'Ergänzen Sie:\n\nNächste Woche haben Sie einen Termin bei der ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie registrieren sich und suchen Beratung zu offenen Stellen — kein privater Headhunter.',
      dialog: 'Sachbearbeiter: Wann kommen Sie zur ___?\nSie: Am Montag um zehn Uhr.',
      options: ['Arbeitsagentur,Headhunter,Betriebsrat'],
      correct: ['Arbeitsagentur'],
    },
  },
  {
    lemma: 'Vermittlung',
    hint: 'Wortschatz — Zuordnung von Bewerbern und Stellen',
    so: {
      body: 'Die Agentur übernimmt die ___ für Sie.',
      options: ['Vermittlung', 'Gehaltsverhandlung', 'Arbeitsrecht'],
      correct: 'Vermittlung',
    },
    ms: {
      body: 'Was gehört zur Vermittlung? Wählen Sie alle richtigen Antworten.',
      options: ['Stellenangebot', 'Profilabgleich', 'Kontaktaufnahme', 'Betriebsrat', 'Tarifvertrag'],
      correct: ['Stellenangebot', 'Profilabgleich', 'Kontaktaufnahme'],
    },
    dd: ['Die', 'Vermittlung', 'dauert', 'nur', 'zwei', 'Wochen', '.'],
    in: {
      wordChoices: ['Vermittlung', 'Gehaltsverhandlung', 'Arbeitsrecht'],
      correct: ['Vermittlung'],
      body: 'Ergänzen Sie:\n\nNach der Bewerbung folgt die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Die Arbeitsagentur schlägt Ihnen passende Stellen vor — keine Gehaltsverhandlung steht an.',
      dialog: 'Berater: Wünschen Sie ___?\nSie: Ja, bitte schicken Sie mir passende Angebote.',
      options: ['Vermittlung,Gehaltsverhandlung,Arbeitsrecht'],
      correct: ['Vermittlung'],
    },
  },
];
