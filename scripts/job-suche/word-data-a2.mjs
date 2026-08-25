/** A2 lemma specs — Job suche (Sie-Register) */

export const a2Words = [
  {
    lemma: 'Beruf',
    hint: 'Wortschatz — Tätigkeit, die man erlernt und ausübt',
    so: {
      body: 'Nach der Schule suchen Sie einen passenden ___.',
      options: ['Beruf', 'Gehalt', 'Urlaub'],
      correct: 'Beruf',
    },
    ms: {
      body: 'Was gehört zu einem Beruf? Wählen Sie alle richtigen Antworten.',
      options: ['Ausbildung', 'Arbeitsplatz', 'Kollegen', 'Bewerbung', 'Stellenanzeige'],
      correct: ['Ausbildung', 'Arbeitsplatz', 'Kollegen'],
    },
    dd: ['Nach', 'der', 'Schule', 'suche', 'ich', 'einen', 'Beruf', '.'],
    in: {
      wordChoices: ['Beruf', 'Gehalt', 'Bewerbung'],
      correct: ['Beruf'],
      body: 'Ergänzen Sie:\n\nWelchen ___ möchten Sie lernen?',
    },
    tg: {
      story: 'Vorgeschichte: In der Berufsberatung sprechen Sie über Ihre Zukunft. Sie suchen eine Ausbildung — kein Gehalt und keine Bewerbung stehen jetzt im Fokus.',
      dialog: 'Beraterin: Welchen ___ interessiert Sie?\nSie: Ich möchte im Büro arbeiten.',
      options: ['Beruf,Gehalt,Bewerbung'],
      correct: ['Beruf'],
    },
  },
  {
    lemma: 'Arbeit',
    hint: 'Wortschatz — bezahlte Tätigkeit im Unternehmen',
    so: {
      body: 'Sie suchen eine neue ___ in der Stadt.',
      options: ['Arbeit', 'Bewerbung', 'Freizeit'],
      correct: 'Arbeit',
    },
    ms: {
      body: 'Was passt zur Arbeit? Wählen Sie alle richtigen Antworten.',
      options: ['Gehalt', 'Kollegen', 'Arbeitsplatz', 'Stellenanzeige', 'Lebenslauf'],
      correct: ['Gehalt', 'Kollegen', 'Arbeitsplatz'],
    },
    dd: ['Ich', 'suche', 'eine', 'neue', 'Arbeit', '.'],
    in: {
      wordChoices: ['Arbeit', 'Bewerbung', 'Praktikum'],
      correct: ['Arbeit'],
      body: 'Ergänzen Sie:\n\nSeit Januar suchen Sie eine feste ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind arbeitslos und schauen jeden Tag Stellenanzeigen. Sie brauchen eine feste Stelle — keine Bewerbung ohne Job und kein Praktikum allein reicht.',
      dialog: 'Berater: Finden Sie schon ___?\nSie: Nein, aber ich schicke viele Bewerbungen.',
      options: ['Arbeit,Bewerbung,Praktikum'],
      correct: ['Arbeit'],
    },
  },
  {
    lemma: 'Stellenanzeige',
    hint: 'Wortschatz — Inserat für eine offene Stelle',
    so: {
      body: 'In der Zeitung lesen Sie eine ___ für eine Bürokraft.',
      options: ['Stellenanzeige', 'Lebenslauf', 'Gehalt'],
      correct: 'Stellenanzeige',
    },
    ms: {
      body: 'Was finden Sie in einer Stellenanzeige? Wählen Sie alle richtigen Antworten.',
      options: ['Beruf', 'Firma', 'Kontakt', 'Bewerbungsgespräch', 'Kollege'],
      correct: ['Beruf', 'Firma', 'Kontakt'],
    },
    dd: ['Ich', 'lese', 'eine', 'Stellenanzeige', 'in', 'der', 'Zeitung', '.'],
    in: {
      wordChoices: ['Stellenanzeige', 'Lebenslauf', 'Gehalt'],
      correct: ['Stellenanzeige'],
      body: 'Ergänzen Sie:\n\nOnline finden Sie eine interessante ___.',
    },
    tg: {
      story: 'Vorgeschichte: Auf der Jobseite steht ein Inserat für eine Bürokraft. Sie lesen die Details — kein Lebenslauf und kein Gehalt stehen in der Anzeige.',
      dialog: 'Kollege: Haben Sie die ___ schon gelesen?\nSie: Ja, ich schicke gleich meine Bewerbung.',
      options: ['Stellenanzeige,Lebenslauf,Gehalt'],
      correct: ['Stellenanzeige'],
    },
  },
  {
    lemma: 'Bewerbung',
    hint: 'Wortschatz — Unterlagen für eine Stelle schicken',
    so: {
      body: 'Sie schicken Ihre ___ per E-Mail an die Firma.',
      options: ['Bewerbung', 'Stellenanzeige', 'Gehalt'],
      correct: 'Bewerbung',
    },
    ms: {
      body: 'Was gehört zu einer Bewerbung? Wählen Sie alle richtigen Antworten.',
      options: ['Lebenslauf', 'Anschreiben', 'E-Mail', 'Arbeitsplatz', 'Chef'],
      correct: ['Lebenslauf', 'Anschreiben', 'E-Mail'],
    },
    dd: ['Ich', 'schicke', 'meine', 'Bewerbung', 'heute', '.'],
    in: {
      wordChoices: ['Bewerbung', 'Stellenanzeige', 'Gehalt'],
      correct: ['Bewerbung'],
      body: 'Ergänzen Sie:\n\nBis Freitag müssen Sie Ihre ___ abschicken.',
    },
    tg: {
      story: 'Vorgeschichte: Der Lebenslauf ist fertig. Sie packen alles in eine E-Mail — keine Stellenanzeige und kein Gehalt schicken Sie mit.',
      dialog: 'Arbeitgeber: Haben Sie Ihre ___ schon geschickt?\nSie: Ja, gestern Abend per E-Mail.',
      options: ['Bewerbung,Stellenanzeige,Gehalt'],
      correct: ['Bewerbung'],
    },
  },
  {
    lemma: 'Lebenslauf',
    hint: 'Wortschatz — wichtiges Dokument bei der Bewerbung',
    so: {
      body: 'Bitte senden Sie uns Ihren ___ mit.',
      options: ['Lebenslauf', 'Stellenanzeige', 'Gehalt'],
      correct: 'Lebenslauf',
    },
    ms: {
      body: 'Was steht im Lebenslauf? Wählen Sie alle richtigen Antworten.',
      options: ['Ausbildung', 'Erfahrung', 'Name', 'Bewerbungsgespräch', 'Teilzeit'],
      correct: ['Ausbildung', 'Erfahrung', 'Name'],
    },
    dd: ['Mein', 'Lebenslauf', 'ist', 'zwei', 'Seiten', 'lang', '.'],
    in: {
      wordChoices: ['Lebenslauf', 'Stellenanzeige', 'Bewerbung'],
      correct: ['Lebenslauf'],
      body: 'Ergänzen Sie:\n\nAktualisieren Sie bitte Ihren ___.',
    },
    tg: {
      story: 'Vorgeschichte: In der Bewerbung fehlt noch ein Dokument. Sie schicken Ihre Berufserfahrung auf Papier — keine Stellenanzeige und keine neue Bewerbung als Ganzes.',
      dialog: 'Personalabteilung: Schicken Sie uns Ihren ___.\nSie: Gern, er ist schon fertig.',
      options: ['Lebenslauf,Stellenanzeige,Bewerbung'],
      correct: ['Lebenslauf'],
    },
  },
  {
    lemma: 'Bewerbungsgespräch',
    hint: 'Wortschatz — persönliches Gespräch mit dem Arbeitgeber',
    so: {
      body: 'Nächste Woche haben Sie ein ___ in der Firma.',
      options: ['Bewerbungsgespräch', 'Praktikum', 'Gehalt'],
      correct: 'Bewerbungsgespräch',
    },
    ms: {
      body: 'Was passiert im Bewerbungsgespräch? Wählen Sie alle richtigen Antworten.',
      options: ['Fragen beantworten', 'Chef treffen', 'Stelle besprechen', 'Lebenslauf schreiben', 'Stellenanzeige lesen'],
      correct: ['Fragen beantworten', 'Chef treffen', 'Stelle besprechen'],
    },
    dd: ['Nächste', 'Woche', 'habe', 'ich', 'ein', 'Bewerbungsgespräch', '.'],
    in: {
      wordChoices: ['Bewerbungsgespräch', 'Praktikum', 'Gehalt'],
      correct: ['Bewerbungsgespräch'],
      body: 'Ergänzen Sie:\n\nAm Dienstag um zehn Uhr ist Ihr ___.',
    },
    tg: {
      story: 'Vorgeschichte: Die Firma hat Ihre Bewerbung gelesen und lädt Sie ein. Sie treffen den Chef persönlich — kein Praktikum beginnt noch und kein Gehalt wird sofort ausgezahlt.',
      dialog: 'Personalabteilung: Ihr ___ ist am Montag.\nSie: Danke, ich komme pünktlich.',
      options: ['Bewerbungsgespräch,Praktikum,Gehalt'],
      correct: ['Bewerbungsgespräch'],
    },
  },
  {
    lemma: 'Arbeitgeber',
    hint: 'Wortschatz — Person oder Firma, die Arbeit gibt',
    so: {
      body: 'Der ___ sucht neue Mitarbeiter.',
      options: ['Arbeitgeber', 'Arbeitnehmer', 'Praktikum'],
      correct: 'Arbeitgeber',
    },
    ms: {
      body: 'Was macht ein Arbeitgeber? Wählen Sie alle richtigen Antworten.',
      options: ['Stellen anbieten', 'Gehalt zahlen', 'einstellen', 'sich bewerben', 'arbeitslos sein'],
      correct: ['Stellen anbieten', 'Gehalt zahlen', 'einstellen'],
    },
    dd: ['Der', 'Arbeitgeber', 'sucht', 'neue', 'Mitarbeiter', '.'],
    in: {
      wordChoices: ['Arbeitgeber', 'Arbeitnehmer', 'Kollege'],
      correct: ['Arbeitgeber'],
      body: 'Ergänzen Sie:\n\nDer ___ bietet eine Stelle in Teilzeit an.',
    },
    tg: {
      story: 'Vorgeschichte: In der Firma fehlen Leute. Die Geschäftsführung sucht Personal und zahlt Gehalt — kein Arbeitnehmer und kein Kollege stellt ein.',
      dialog: 'Berater: Wer ist Ihr ___?\nSie: Eine mittelgroße Firma in der Innenstadt.',
      options: ['Arbeitgeber,Arbeitnehmer,Kollege'],
      correct: ['Arbeitgeber'],
    },
  },
  {
    lemma: 'Arbeitnehmer',
    hint: 'Wortschatz — Person, die in einem Betrieb arbeitet',
    so: {
      body: 'Als ___ arbeiten Sie acht Stunden täglich.',
      options: ['Arbeitnehmer', 'Arbeitgeber', 'Chef'],
      correct: 'Arbeitnehmer',
    },
    ms: {
      body: 'Was trifft auf einen Arbeitnehmer zu? Wählen Sie alle richtigen Antworten.',
      options: ['Gehalt bekommen', 'Arbeitsplatz haben', 'Kollegen haben', 'einstellen', 'Stellenanzeige schreiben'],
      correct: ['Gehalt bekommen', 'Arbeitsplatz haben', 'Kollegen haben'],
    },
    dd: ['Als', 'Arbeitnehmer', 'arbeite', 'ich', 'Vollzeit', '.'],
    in: {
      wordChoices: ['Arbeitnehmer', 'Arbeitgeber', 'Chef'],
      correct: ['Arbeitnehmer'],
      body: 'Ergänzen Sie:\n\nSeit März sind Sie ___ in der Werkstatt.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben den Job bekommen und arbeiten täglich. Sie bekommen Gehalt — Sie sind kein Arbeitgeber und kein Chef.',
      dialog: 'Kollege: Sind Sie schon ___ hier?\nSie: Ja, seit dem ersten April.',
      options: ['Arbeitnehmer,Arbeitgeber,Chef'],
      correct: ['Arbeitnehmer'],
    },
  },
  {
    lemma: 'Gehalt',
    hint: 'Wortschatz — Betrag auf der Lohnabrechnung',
    so: {
      body: 'Das ___ beträgt 2.500 Euro im Monat.',
      options: ['Gehalt', 'Bewerbung', 'Lebenslauf'],
      correct: 'Gehalt',
    },
    ms: {
      body: 'Was passt zum Gehalt? Wählen Sie alle richtigen Antworten.',
      options: ['monatlich', 'Arbeit', 'Vertrag', 'Stellenanzeige', 'Praktikum'],
      correct: ['monatlich', 'Arbeit', 'Vertrag'],
    },
    dd: ['Mein', 'Gehalt', 'ist', '2.500', 'Euro', '.'],
    in: {
      wordChoices: ['Gehalt', 'Bewerbung', 'Lebenslauf'],
      correct: ['Gehalt'],
      body: 'Ergänzen Sie:\n\nIm Vertrag steht Ihr monatliches ___.',
    },
    tg: {
      story: 'Vorgeschichte: Im Bewerbungsgespräch sprechen Sie über Geld. Sie fragen nach 2.500 Euro — keine Bewerbung und kein Lebenslauf sind das Thema.',
      dialog: 'Arbeitgeber: Welches ___ erwarten Sie?\nSie: Mindestens 2.500 Euro netto.',
      options: ['Gehalt,Bewerbung,Lebenslauf'],
      correct: ['Gehalt'],
    },
  },
  {
    lemma: 'Teilzeit',
    hint: 'Wortschatz — nicht das volle Wochenpensum',
    so: {
      body: 'Sie möchten ___ arbeiten — nur vier Stunden am Tag.',
      options: ['Teilzeit', 'Vollzeit', 'Praktikum'],
      correct: 'Teilzeit',
    },
    ms: {
      body: 'Was passt zu Teilzeit? Wählen Sie alle richtigen Antworten.',
      options: ['weniger Stunden', 'flexible Zeiten', 'neben dem Studium', 'acht Stunden täglich', 'nur Praktikum'],
      correct: ['weniger Stunden', 'flexible Zeiten', 'neben dem Studium'],
    },
    dd: ['Ich', 'möchte', 'in', 'Teilzeit', 'arbeiten', '.'],
    in: {
      wordChoices: ['Teilzeit', 'Vollzeit', 'Praktikum'],
      correct: ['Teilzeit'],
      body: 'Ergänzen Sie:\n\nDie Stelle ist in ___ — zwanzig Stunden pro Woche.',
    },
    tg: {
      story: 'Vorgeschichte: Sie studieren noch und brauchen freie Nachmittage. Sie suchen weniger Stunden — keine Vollzeit und kein Praktikum ohne Gehalt.',
      dialog: 'Arbeitgeber: Können Sie in ___ arbeiten?\nSie: Ja, zwanzig Stunden pro Woche passen gut.',
      options: ['Teilzeit,Vollzeit,Praktikum'],
      correct: ['Teilzeit'],
    },
  },
  {
    lemma: 'Vollzeit',
    hint: 'Wortschatz — ganze Arbeitswoche mit vollem Pensum',
    so: {
      body: 'Die Stelle ist in ___ — acht Stunden täglich.',
      options: ['Vollzeit', 'Teilzeit', 'Praktikum'],
      correct: 'Vollzeit',
    },
    ms: {
      body: 'Was passt zu Vollzeit? Wählen Sie alle richtigen Antworten.',
      options: ['acht Stunden', 'fünf Tage pro Woche', 'festes Gehalt', 'nur vier Stunden', 'ohne Vertrag'],
      correct: ['acht Stunden', 'fünf Tage pro Woche', 'festes Gehalt'],
    },
    dd: ['Die', 'Stelle', 'ist', 'in', 'Vollzeit', '.'],
    in: {
      wordChoices: ['Vollzeit', 'Teilzeit', 'Praktikum'],
      correct: ['Vollzeit'],
      body: 'Ergänzen Sie:\n\nAb September arbeiten Sie in ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie suchen eine feste Stelle mit vollem Pensum. Acht Stunden täglich sind möglich — kein Teilzeitmodell und kein Praktikum.',
      dialog: 'Personalabteilung: Die Stelle ist in ___.\nSie: Das passt gut zu meinem Plan.',
      options: ['Vollzeit,Teilzeit,Praktikum'],
      correct: ['Vollzeit'],
    },
  },
  {
    lemma: 'Praktikum',
    hint: 'Wortschatz — erste Erfahrung in einem Betrieb sammeln',
    so: {
      body: 'Ab September machen Sie ein ___ in einer Marketing-Agentur.',
      options: ['Praktikum', 'Gehalt', 'Bewerbungsgespräch'],
      correct: 'Praktikum',
    },
    ms: {
      body: 'Was passt zum Praktikum? Wählen Sie alle richtigen Antworten.',
      options: ['Erfahrung sammeln', 'Betrieb kennenlernen', 'lernen am Arbeitsplatz', 'Vollzeitgehalt', 'Chef sein'],
      correct: ['Erfahrung sammeln', 'Betrieb kennenlernen', 'lernen am Arbeitsplatz'],
    },
    dd: ['Im', 'Sommer', 'mache', 'ich', 'ein', 'Praktikum', '.'],
    in: {
      wordChoices: ['Praktikum', 'Gehalt', 'Bewerbungsgespräch'],
      correct: ['Praktikum'],
      body: 'Ergänzen Sie:\n\nFür drei Monate machen Sie ein ___ bei der Firma.',
    },
    tg: {
      story: 'Vorgeschichte: Nach der Schule wollen Sie praktische Erfahrung. Sie arbeiten drei Monate im Betrieb — kein festes Gehalt und kein finales Bewerbungsgespräch für eine Feststelle.',
      dialog: 'Ausbilder: Wann beginnt Ihr ___?\nSie: Am ersten September, für drei Monate.',
      options: ['Praktikum,Gehalt,Bewerbungsgespräch'],
      correct: ['Praktikum'],
    },
  },
  {
    lemma: 'Erfahrung',
    hint: 'Wortschatz — was man im Beruf gelernt hat',
    so: {
      body: 'Sie haben drei Jahre ___ im Büro.',
      options: ['Erfahrung', 'Gehalt', 'Urlaub'],
      correct: 'Erfahrung',
    },
    ms: {
      body: 'Wo sammeln Sie Berufserfahrung? Wählen Sie alle richtigen Antworten.',
      options: ['Praktikum', 'Arbeit', 'Ausbildung', 'Stellenanzeige', 'Bewerbung schreiben'],
      correct: ['Praktikum', 'Arbeit', 'Ausbildung'],
    },
    dd: ['Ich', 'habe', 'drei', 'Jahre', 'Erfahrung', '.'],
    in: {
      wordChoices: ['Erfahrung', 'Gehalt', 'Bewerbung'],
      correct: ['Erfahrung'],
      body: 'Ergänzen Sie:\n\nIm Lebenslauf steht Ihre ___ im Verkauf.',
    },
    tg: {
      story: 'Vorgeschichte: Im Bewerbungsgespräch fragen Sie nach Ihrer Vergangenheit. Sie haben drei Jahre im Büro gearbeitet — Gehalt allein und eine Bewerbung sind keine Praxis.',
      dialog: 'Chef: Haben Sie ___ im Büro?\nSie: Ja, drei Jahre bei einer Versicherung.',
      options: ['Erfahrung,Gehalt,Bewerbung'],
      correct: ['Erfahrung'],
    },
  },
  {
    lemma: 'Qualifikation',
    hint: 'Wortschatz — Fähigkeiten und Nachweise für eine Stelle',
    so: {
      body: 'Ihre ___ passen gut zu dieser Stelle.',
      options: ['Qualifikationen', 'Gehälter', 'Stellenanzeigen'],
      correct: 'Qualifikationen',
    },
    ms: {
      body: 'Was sind Qualifikationen? Wählen Sie alle richtigen Antworten.',
      options: ['Ausbildung', 'Sprachkenntnisse', 'Erfahrung', 'Arbeitslosigkeit', 'Urlaub'],
      correct: ['Ausbildung', 'Sprachkenntnisse', 'Erfahrung'],
    },
    dd: ['Meine', 'Qualifikation', 'passt', 'zur', 'Stelle', '.'],
    in: {
      wordChoices: ['Qualifikation', 'Gehalt', 'Stellenanzeige'],
      correct: ['Qualifikation'],
      body: 'Ergänzen Sie:\n\nIhre ___ sind genau richtig für den Job.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben die Ausbildung und sprechen gut Englisch. Das passt zur Stelle — kein Gehalt und keine Stellenanzeige sind Ihre Fähigkeiten.',
      dialog: 'Arbeitgeber: Ihre ___ sind perfekt.\nSie: Danke, ich habe auch Praxis im Büro.',
      options: ['Qualifikation,Gehalt,Stellenanzeige'],
      correct: ['Qualifikation'],
    },
  },
  {
    lemma: 'Arbeitsplatz',
    hint: 'Wortschatz — Ort, an dem man arbeitet',
    so: {
      body: 'Der neue ___ ist im dritten Stock.',
      options: ['Arbeitsplatz', 'Gehalt', 'Bewerbung'],
      correct: 'Arbeitsplatz',
    },
    ms: {
      body: 'Was finden Sie am Arbeitsplatz? Wählen Sie alle richtigen Antworten.',
      options: ['Schreibtisch', 'Computer', 'Kollegen', 'Lebenslauf', 'Stellenanzeige'],
      correct: ['Schreibtisch', 'Computer', 'Kollegen'],
    },
    dd: ['Mein', 'Arbeitsplatz', 'ist', 'im', 'dritten', 'Stock', '.'],
    in: {
      wordChoices: ['Arbeitsplatz', 'Gehalt', 'Bewerbung'],
      correct: ['Arbeitsplatz'],
      body: 'Ergänzen Sie:\n\nAm Montag sehen Sie Ihren neuen ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie beginnen den neuen Job. Ihr Schreibtisch steht im dritten Stock — weder Gehalt noch Bewerbung sind ein Ort im Büro.',
      dialog: 'Kollege: Wo ist Ihr ___?\nSie: Im dritten Stock, in Büro 312.',
      options: ['Arbeitsplatz,Gehalt,Bewerbung'],
      correct: ['Arbeitsplatz'],
    },
  },
  {
    lemma: 'Kollege',
    hint: 'Wortschatz — Person, die mit Ihnen im Betrieb arbeitet',
    so: {
      body: 'Ihr ___ hilft Ihnen am ersten Arbeitstag.',
      options: ['Kollege', 'Chef', 'Arbeitgeber'],
      correct: 'Kollege',
    },
    ms: {
      body: 'Was macht ein Kollege? Wählen Sie alle richtigen Antworten.',
      options: ['zusammen arbeiten', 'helfen', 'im Team sein', 'Gehalt zahlen', 'einstellen'],
      correct: ['zusammen arbeiten', 'helfen', 'im Team sein'],
    },
    dd: ['Mein', 'Kollege', 'hilft', 'mir', 'heute', '.'],
    in: {
      wordChoices: ['Kollege', 'Chef', 'Arbeitgeber'],
      correct: ['Kollege'],
      body: 'Ergänzen Sie:\n\nEin ___ zeigt Ihnen das Büro.',
    },
    tg: {
      story: 'Vorgeschichte: Am ersten Tag sind Sie neu in der Firma. Eine Person aus dem Team erklärt alles — nicht der Chef allein und nicht der Arbeitgeber persönlich.',
      dialog: 'Personalabteilung: Ihr ___ wartet schon auf Sie.\nSie: Danke, ich freue mich auf das Team.',
      options: ['Kollege,Chef,Arbeitgeber'],
      correct: ['Kollege'],
    },
  },
  {
    lemma: 'Chef',
    hint: 'Wortschatz — Leiter oder Vorgesetzter im Betrieb',
    so: {
      body: 'Der ___ lädt Sie zum Gespräch ein.',
      options: ['Chef', 'Kollege', 'Praktikant'],
      correct: 'Chef',
    },
    ms: {
      body: 'Was macht ein Chef? Wählen Sie alle richtigen Antworten.',
      options: ['Anweisungen geben', 'Mitarbeiter führen', 'Entscheidungen treffen', 'sich bewerben', 'arbeitslos sein'],
      correct: ['Anweisungen geben', 'Mitarbeiter führen', 'Entscheidungen treffen'],
    },
    dd: ['Der', 'Chef', 'lädt', 'mich', 'zum', 'Gespräch', 'ein', '.'],
    in: {
      wordChoices: ['Chef', 'Kollege', 'Arbeitnehmer'],
      correct: ['Chef'],
      body: 'Ergänzen Sie:\n\nMorgen sprechen Sie mit dem ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie bekommen eine Einladung vom Vorgesetzten. Er will mit Ihnen sprechen — kein Kollege auf gleicher Ebene und kein normaler Arbeitnehmer führt die Firma.',
      dialog: 'Sekretärin: Der ___ erwartet Sie um zehn.\nSie: Danke, ich komme pünktlich.',
      options: ['Chef,Kollege,Arbeitnehmer'],
      correct: ['Chef'],
    },
  },
  {
    lemma: 'arbeitslos',
    hint: 'Wortschatz — ohne festen Job und auf Stelle suchend',
    so: {
      body: 'Seit zwei Monaten sind Sie ___ und suchen eine Stelle.',
      options: ['arbeitslos', 'angestellt', 'im Praktikum'],
      correct: 'arbeitslos',
    },
    ms: {
      body: 'Was tun arbeitslose Menschen? Wählen Sie alle richtigen Antworten.',
      options: ['Stellen suchen', 'Bewerbungen schreiben', 'zum Arbeitsamt gehen', 'Gehalt bekommen', 'Kollegen einstellen'],
      correct: ['Stellen suchen', 'Bewerbungen schreiben', 'zum Arbeitsamt gehen'],
    },
    dd: ['Seit', 'zwei', 'Monaten', 'bin', 'ich', 'arbeitslos', '.'],
    in: {
      wordChoices: ['arbeitslos', 'angestellt', 'beschäftigt'],
      correct: ['arbeitslos'],
      body: 'Ergänzen Sie:\n\nLeider sind Sie seit Januar ___.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Vertrag ist ausgelaufen. Sie haben keinen Job und suchen täglich Stellen — Sie sind nicht angestellt und nicht im Praktikum.',
      dialog: 'Berater: Sind Sie noch ___?\nSie: Ja, aber ich habe schon drei Bewerbungen geschickt.',
      options: ['arbeitslos,angestellt,beschäftigt'],
      correct: ['arbeitslos'],
    },
  },
  {
    lemma: 'sich bewerben',
    hint: 'Wortschatz — um eine Stelle bei einer Firma nachfragen',
    so: {
      body: 'Sie ___ bei drei Firmen online.',
      options: ['bewerben sich', 'stellen ein', 'arbeiten'],
      correct: 'bewerben sich',
    },
    ms: {
      body: 'Was brauchen Sie, um sich zu bewerben? Wählen Sie alle richtigen Antworten.',
      options: ['Lebenslauf', 'Stellenanzeige', 'E-Mail', 'Gehalt', 'Arbeitsplatz'],
      correct: ['Lebenslauf', 'Stellenanzeige', 'E-Mail'],
    },
    dd: ['Ich', 'bewerbe', 'mich', 'online', 'bei', 'der', 'Firma', '.'],
    in: {
      wordChoices: ['bewerben sich', 'stellen ein', 'arbeiten'],
      correct: ['bewerben sich'],
      body: 'Ergänzen Sie:\n\nHeute ___ Sie um die Stelle als Bürokraft.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben eine Stellenanzeige gefunden. Sie schicken Lebenslauf und Anschreiben — Sie stellen niemanden ein und arbeiten dort noch nicht.',
      dialog: 'Berater: Wo ___ Sie sich?\nSie: Online, bei drei Firmen in der Stadt.',
      options: ['bewerben,stellen ein,arbeiten'],
      correct: ['bewerben'],
    },
  },
  {
    lemma: 'einstellen',
    hint: 'Wortschatz — jemanden für eine Stelle annehmen',
    so: {
      body: 'Die Firma will Sie ___.',
      options: ['einstellen', 'bewerben', 'kündigen'],
      correct: 'einstellen',
    },
    ms: {
      body: 'Was passiert, wenn eine Firma einstellt? Wählen Sie alle richtigen Antworten.',
      options: ['neuer Job', 'Vertrag', 'Arbeitsplatz', 'Bewerbung schreiben', 'arbeitslos sein'],
      correct: ['neuer Job', 'Vertrag', 'Arbeitsplatz'],
    },
    dd: ['Die', 'Firma', 'stellt', 'mich', 'nächste', 'Woche', 'ein', '.'],
    in: {
      wordChoices: ['einstellen', 'bewerben', 'kündigen'],
      correct: ['einstellen'],
      body: 'Ergänzen Sie:\n\nAb Mai will die Firma Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: Das Bewerbungsgespräch war gut. Die Personalabteilung ruft an und nimmt Sie an — Sie bewerben sich nicht mehr und kündigen nicht.',
      dialog: 'Arbeitgeber: Wir wollen Sie ___.\nSie: Vielen Dank, ich freue mich sehr!',
      options: ['einstellen,bewerben,kündigen'],
      correct: ['einstellen'],
    },
  },
];
