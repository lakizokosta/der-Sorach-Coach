/** B2 lemma specs — Bürokratie (Sie-Register) */

export const b2Words = [
  {
    lemma: 'Verwaltungsakt',
    hint: 'Wortschatz — formaler Akt der Verwaltung',
    so: {
      body: 'Gegen den ___ können Sie Widerspruch einlegen.',
      options: ['Verwaltungsakt', 'Integrationskurs', 'Bearbeitungsstand'],
      correct: 'Verwaltungsakt',
    },
    ms: {
      body: 'Was kennzeichnet einen Verwaltungsakt? Wählen Sie alle richtigen Antworten.',
      options: ['behördliche Entscheidung', 'Rechtswirkung', 'Zustellung', 'Formular', 'Antrag'],
      correct: ['behördliche Entscheidung', 'Rechtswirkung', 'Zustellung'],
    },
    dd: ['Der', 'Verwaltungsakt', 'wird', 'Ihnen', 'zugestellt', '.'],
    in: {
      wordChoices: ['Verwaltungsakt', 'Integrationskurs', 'Bearbeitungsstand'],
      correct: ['Verwaltungsakt'],
      body: 'Ergänzen Sie:\n\nIm Schreiben erhalten Sie einen ___.',
    },
    tg: {
      story: 'Vorgeschichte: Die Behörde entscheidet formal über Ihren Antrag und stellt Ihnen die Entscheidung zu — kein Integrationskurs und kein Bearbeitungsstand.',
      dialog: 'Sachbearbeiter: Kennen Sie den ___?\nSie: Ja, ich lege Widerspruch ein.',
      options: ['Verwaltungsakt,Integrationskurs,Bearbeitungsstand'],
      correct: ['Verwaltungsakt'],
    },
  },
  {
    lemma: 'Rechtsmittel',
    hint: 'Wortschatz — rechtlicher Weg gegen eine Entscheidung',
    so: {
      body: 'Nach dem Bescheid prüfen Sie Ihre ___.',
      options: ['Rechtsmittel', 'Amtssprache', 'E-Akte'],
      correct: 'Rechtsmittel',
    },
    ms: {
      body: 'Was gehört zu Rechtsmitteln? Wählen Sie alle richtigen Antworten.',
      options: ['Widerspruch', 'Klage', 'Beschwerde', 'Integrationskurs', 'Legitimationsprüfung'],
      correct: ['Widerspruch', 'Klage', 'Beschwerde'],
    },
    dd: ['Welche', 'Rechtsmittel', 'stehen', 'Ihnen', 'offen', '?'],
    in: {
      wordChoices: ['Rechtsmittel', 'Amtssprache', 'E-Akte'],
      correct: ['Rechtsmittel'],
      body: 'Ergänzen Sie:\n\nIm Beratungsgespräch klären Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Nach einem Leistungsbescheid fragen Sie nach Widerspruch und Klage — nicht nach der Amtssprache.',
      dialog: 'Anwalt: Welche ___ kommen infrage?\nSie: Zuerst Widerspruch, danach Klage.',
      options: ['Rechtsmittel,Amtssprache,E-Akte'],
      correct: ['Rechtsmittel'],
    },
  },
  {
    lemma: 'Widerspruchsverfahren',
    hint: 'Wortschatz — formales Einspruchsverfahren bei der Behörde',
    so: {
      body: 'Ihr Antrag löst ein ___ aus.',
      options: ['Widerspruchsverfahren', 'Integrationskurs', 'Legitimationsprüfung'],
      correct: 'Widerspruchsverfahren',
    },
    ms: {
      body: 'Was gehört zum Widerspruchsverfahren? Wählen Sie alle richtigen Antworten.',
      options: ['Einspruch', 'Sachverhalt', 'Bescheid', 'Aktenzeichen', 'Schalter'],
      correct: ['Einspruch', 'Sachverhalt', 'Bescheid'],
    },
    dd: ['Das', 'Widerspruchsverfahren', 'beginnt', 'mit', 'Ihrem', 'Schreiben', '.'],
    in: {
      wordChoices: ['Widerspruchsverfahren', 'Integrationskurs', 'Legitimationsprüfung'],
      correct: ['Widerspruchsverfahren'],
      body: 'Ergänzen Sie:\n\nNach dem Bescheid starten Sie ein ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie legen fristgerecht Einspruch gegen den Leistungsbescheid ein — kein Integrationskurs steht an.',
      dialog: 'Behörde: Wie läuft Ihr ___?\nSie: Ich habe alle Unterlagen eingereicht.',
      options: ['Widerspruchsverfahren,Integrationskurs,Legitimationsprüfung'],
      correct: ['Widerspruchsverfahren'],
    },
  },
  {
    lemma: 'Aufenthaltsgesetz',
    hint: 'Wortschatz — Gesetz zur Regelung des Aufenthalts',
    so: {
      body: 'Im Seminar erläutern Sie das ___.',
      options: ['Aufenthaltsgesetz', 'Leistungsbescheid', 'Bearbeitungsstand'],
      correct: 'Aufenthaltsgesetz',
    },
    ms: {
      body: 'Was regelt das Aufenthaltsgesetz? Wählen Sie alle richtigen Antworten.',
      options: ['Aufenthaltstitel', 'Aufenthaltserlaubnis', 'Integrationspflicht', 'Arbeitsvertrag', 'Mietvertrag'],
      correct: ['Aufenthaltstitel', 'Aufenthaltserlaubnis', 'Integrationspflicht'],
    },
    dd: ['Das', 'Aufenthaltsgesetz', 'ändert', 'sich', 'regelmäßig', '.'],
    in: {
      wordChoices: ['Aufenthaltsgesetz', 'Leistungsbescheid', 'Bearbeitungsstand'],
      correct: ['Aufenthaltsgesetz'],
      body: 'Ergänzen Sie:\n\nFür die Beratung lesen Sie das ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie bereiten eine Infoveranstaltung zu Aufenthaltstiteln vor — kein Leistungsbescheid ist Thema.',
      dialog: 'Kollege: Kennen Sie das ___?\nSie: Ja, die wichtigsten Paragraphen.',
      options: ['Aufenthaltsgesetz,Leistungsbescheid,Bearbeitungsstand'],
      correct: ['Aufenthaltsgesetz'],
    },
  },
  {
    lemma: 'Integrationskurs',
    hint: 'Wortschatz — Pflichtkurs für neue Einwanderer',
    so: {
      body: 'Die Ausländerbehörde verlangt einen ___.',
      options: ['Integrationskurs', 'Verwaltungsakt', 'Verwaltungsgericht'],
      correct: 'Integrationskurs',
    },
    ms: {
      body: 'Was gehört zum Integrationskurs? Wählen Sie alle richtigen Antworten.',
      options: ['Sprachkurs', 'Orientierungskurs', 'Teilnahmebescheinigung', 'Widerspruchsverfahren', 'Akteneinsicht'],
      correct: ['Sprachkurs', 'Orientierungskurs', 'Teilnahmebescheinigung'],
    },
    dd: ['Der', 'Integrationskurs', 'ist', 'verpflichtend', '.'],
    in: {
      wordChoices: ['Integrationskurs', 'Verwaltungsakt', 'Verwaltungsgericht'],
      correct: ['Integrationskurs'],
      body: 'Ergänzen Sie:\n\nFür die Aufenthaltserlaubnis absolvieren Sie einen ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie melden sich für Sprach- und Orientierungsunterricht an — kein Verwaltungsakt liegt vor.',
      dialog: 'Sachbearbeiter: Haben Sie den ___?\nSie: Ja, die Bescheinigung reiche ich ein.',
      options: ['Integrationskurs,Verwaltungsakt,Verwaltungsgericht'],
      correct: ['Integrationskurs'],
    },
  },
  {
    lemma: 'Leistungsbescheid',
    hint: 'Wortschatz — behördliche Entscheidung über Sozialleistungen',
    so: {
      body: 'Gegen den ___ legen Sie Widerspruch ein.',
      options: ['Leistungsbescheid', 'Integrationskurs', 'Amtssprache'],
      correct: 'Leistungsbescheid',
    },
    ms: {
      body: 'Was enthält ein Leistungsbescheid? Wählen Sie alle richtigen Antworten.',
      options: ['Bewilligung', 'Ablehnung', 'Begründung', 'Widerspruch', 'Genehmigung'],
      correct: ['Bewilligung', 'Ablehnung', 'Begründung'],
    },
    dd: ['Der', 'Leistungsbescheid', 'kommt', 'per', 'Post', '.'],
    in: {
      wordChoices: ['Leistungsbescheid', 'Integrationskurs', 'Amtssprache'],
      correct: ['Leistungsbescheid'],
      body: 'Ergänzen Sie:\n\nGestern erhielten Sie den ___.',
    },
    tg: {
      story: 'Vorgeschichte: Das Jobcenter lehnt Ihren Antrag ab und begründet die Entscheidung schriftlich — kein Integrationskurs.',
      dialog: 'Berater: Haben Sie den ___ gelesen?\nSie: Ja, ich widerspreche der Ablehnung.',
      options: ['Leistungsbescheid,Integrationskurs,Amtssprache'],
      correct: ['Leistungsbescheid'],
    },
  },
  {
    lemma: 'Mitwirkungspflicht',
    hint: 'Wortschatz — Pflicht, der Behörde Informationen zu geben',
    so: {
      body: 'Bei der Antragstellung beachten Sie Ihre ___.',
      options: ['Mitwirkungspflicht', 'Akteneinsicht', 'E-Akte'],
      correct: 'Mitwirkungspflicht',
    },
    ms: {
      body: 'Was gehört zur Mitwirkungspflicht? Wählen Sie alle richtigen Antworten.',
      options: ['Unterlagen einreichen', 'Auskunft geben', 'Fristen einhalten', 'Beglaubigung', 'Schalter'],
      correct: ['Unterlagen einreichen', 'Auskunft geben', 'Fristen einhalten'],
    },
    dd: ['Ihre', 'Mitwirkungspflicht', 'ist', 'gesetzlich', 'geregelt', '.'],
    in: {
      wordChoices: ['Mitwirkungspflicht', 'Akteneinsicht', 'E-Akte'],
      correct: ['Mitwirkungspflicht'],
      body: 'Ergänzen Sie:\n\nOhne Erfüllung der ___ kann der Antrag abgelehnt werden.',
    },
    tg: {
      story: 'Vorgeschichte: Die Behörde fordert fehlende Nachweise an — Sie beantragen noch keine Akteneinsicht.',
      dialog: 'Sachbearbeiter: Kennen Sie Ihre ___?\nSie: Ja, ich reiche die Dokumente nach.',
      options: ['Mitwirkungspflicht,Akteneinsicht,E-Akte'],
      correct: ['Mitwirkungspflicht'],
    },
  },
  {
    lemma: 'Datenschutz',
    hint: 'Wortschatz — Schutz personenbezogener Daten bei Behörden',
    so: {
      body: 'Im Gespräch klären Sie den ___ bei der Behörde.',
      options: ['Datenschutz', 'Bearbeitungsstand', 'Integrationskurs'],
      correct: 'Datenschutz',
    },
    ms: {
      body: 'Was gehört zum Datenschutz bei Behörden? Wählen Sie alle richtigen Antworten.',
      options: ['Datensparsamkeit', 'Zugriffskontrolle', 'Löschfristen', 'Bearbeitungsstand', 'Schalter'],
      correct: ['Datensparsamkeit', 'Zugriffskontrolle', 'Löschfristen'],
    },
    dd: ['Der', 'Datenschutz', 'hat', 'hohe', 'Priorität', '.'],
    in: {
      wordChoices: ['Datenschutz', 'Bearbeitungsstand', 'Integrationskurs'],
      correct: ['Datenschutz'],
      body: 'Ergänzen Sie:\n\nVor der Datenweitergabe prüfen Sie den ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie fragen, wer Ihre Daten in der E-Akte sehen darf — nicht nach dem Bearbeitungsstand.',
      dialog: 'Datenschutzbeauftragter: Wie ist der ___ geregelt?\nSie: Nur berechtigte Mitarbeiter haben Zugriff.',
      options: ['Datenschutz,Bearbeitungsstand,Integrationskurs'],
      correct: ['Datenschutz'],
    },
  },
  {
    lemma: 'Akteneinsicht',
    hint: 'Wortschatz — Einsicht in behördliche Unterlagen',
    so: {
      body: 'Für Ihren Widerspruch beantragen Sie ___.',
      options: ['Akteneinsicht', 'Integrationskurs', 'Leistungsbescheid'],
      correct: 'Akteneinsicht',
    },
    ms: {
      body: 'Was gehört zur Akteneinsicht? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag', 'Termin', 'E-Akte', 'Bescheid', 'Schalter'],
      correct: ['Antrag', 'Termin', 'E-Akte'],
    },
    dd: ['Die', 'Akteneinsicht', 'ist', 'für', 'Montag', 'terminiert', '.'],
    in: {
      wordChoices: ['Akteneinsicht', 'Integrationskurs', 'Leistungsbescheid'],
      correct: ['Akteneinsicht'],
      body: 'Ergänzen Sie:\n\nIm Widerspruchsverfahren beantragen Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie möchten die Behördenunterlagen vor Gericht prüfen — kein Integrationskurs.',
      dialog: 'Sachbearbeiter: Wünschen Sie ___?\nSie: Ja, bitte terminieren Sie einen Termin.',
      options: ['Akteneinsicht,Integrationskurs,Leistungsbescheid'],
      correct: ['Akteneinsicht'],
    },
  },
  {
    lemma: 'Verwaltungsgericht',
    hint: 'Wortschatz — Gericht für Streitigkeiten mit Behörden',
    so: {
      body: 'Nach dem Widerspruch ziehen Sie das ___ hinzu.',
      options: ['Verwaltungsgericht', 'Integrationskurs', 'Bearbeitungsstand'],
      correct: 'Verwaltungsgericht',
    },
    ms: {
      body: 'Was gehört zum Verwaltungsgericht? Wählen Sie alle richtigen Antworten.',
      options: ['Klage', 'Urteil', 'Anwalt', 'Integrationskurs', 'Amtssprache'],
      correct: ['Klage', 'Urteil', 'Anwalt'],
    },
    dd: ['Das', 'Verwaltungsgericht', 'prüft', 'den', 'Bescheid', '.'],
    in: {
      wordChoices: ['Verwaltungsgericht', 'Integrationskurs', 'Bearbeitungsstand'],
      correct: ['Verwaltungsgericht'],
      body: 'Ergänzen Sie:\n\nNach erfolglosem Widerspruch klagen Sie beim ___.',
    },
    tg: {
      story: 'Vorgeschichte: Der Widerspruch gegen den Verwaltungsakt blieb erfolglos — Sie planen eine Klage.',
      dialog: 'Anwalt: Gehen wir zum ___?\nSie: Ja, die Frist läuft bald ab.',
      options: ['Verwaltungsgericht,Integrationskurs,Bearbeitungsstand'],
      correct: ['Verwaltungsgericht'],
    },
  },
  {
    lemma: 'fristwahrend',
    hint: 'Wortschatz — Einreichung vor Ablauf der Einspruchsfrist',
    so: {
      body: 'Ihr Widerspruch ging ___ ein.',
      options: ['fristwahrend', 'verspätet', 'formlos'],
      correct: 'fristwahrend',
    },
    ms: {
      body: 'Was bedeutet fristwahrend? Wählen Sie alle richtigen Antworten.',
      options: ['rechtzeitig', 'innerhalb der Frist', 'wirksam eingegangen', 'ohne Begründung', 'ohne Unterschrift'],
      correct: ['rechtzeitig', 'innerhalb der Frist', 'wirksam eingegangen'],
    },
    dd: ['Der', 'Widerspruch', 'wurde', 'fristwahrend', 'eingereicht', '.'],
    in: {
      wordChoices: ['fristwahrend', 'verspätet', 'formlos'],
      correct: ['fristwahrend'],
      body: 'Ergänzen Sie:\n\nDas Schreiben ging ___ bei der Behörde ein.',
    },
    tg: {
      story: 'Vorgeschichte: Sie reichen den Widerspruch einen Tag vor Ablauf der Einspruchsfrist ein — nicht verspätet.',
      dialog: 'Sachbearbeiter: War die Einreichung ___?\nSie: Ja, noch innerhalb der Frist.',
      options: ['fristwahrend,verspätet,formlos'],
      correct: ['fristwahrend'],
    },
  },
  {
    lemma: 'Zustellungsurkunde',
    hint: 'Wortschatz — Nachweis der behördlichen Zustellung',
    so: {
      body: 'Als Nachweis erhalten Sie eine ___.',
      options: ['Zustellungsurkunde', 'Akteneinsicht', 'Integrationskurs'],
      correct: 'Zustellungsurkunde',
    },
    ms: {
      body: 'Was gehört zur Zustellungsurkunde? Wählen Sie alle richtigen Antworten.',
      options: ['Zustellungsdatum', 'Empfänger', 'Zustellungsart', 'Gebühr', 'Schalter'],
      correct: ['Zustellungsdatum', 'Empfänger', 'Zustellungsart'],
    },
    dd: ['Die', 'Zustellungsurkunde', 'liegt', 'in', 'der', 'Akte', '.'],
    in: {
      wordChoices: ['Zustellungsurkunde', 'Akteneinsicht', 'Integrationskurs'],
      correct: ['Zustellungsurkunde'],
      body: 'Ergänzen Sie:\n\nFür die Fristen berechnen Sie ab der ___.',
    },
    tg: {
      story: 'Vorgeschichte: Der Verwaltungsakt wurde Ihnen zugestellt — Sie brauchen den Nachweis für die Einspruchsfrist.',
      dialog: 'Sachbearbeiter: Haben Sie die ___?\nSie: Ja, das Datum steht darauf.',
      options: ['Zustellungsurkunde,Akteneinsicht,Integrationskurs'],
      correct: ['Zustellungsurkunde'],
    },
  },
  {
    lemma: 'Legitimationsprüfung',
    hint: 'Wortschatz — Kontrolle des Ausweises am Schalter',
    so: {
      body: 'Am Schalter erfolgt eine ___.',
      options: ['Legitimationsprüfung', 'Akteneinsicht', 'Beschwerde'],
      correct: 'Legitimationsprüfung',
    },
    ms: {
      body: 'Was gehört zur Legitimationsprüfung? Wählen Sie alle richtigen Antworten.',
      options: ['Ausweis', 'Identität', 'Vollmacht', 'Widerspruchsverfahren', 'Verwaltungsgericht'],
      correct: ['Ausweis', 'Identität', 'Vollmacht'],
    },
    dd: ['Die', 'Legitimationsprüfung', 'dauert', 'nur', 'wenige', 'Minuten', '.'],
    in: {
      wordChoices: ['Legitimationsprüfung', 'Akteneinsicht', 'Beschwerde'],
      correct: ['Legitimationsprüfung'],
      body: 'Ergänzen Sie:\n\nVor der Beratung erfolgt eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie legen Ihren Personalausweis am Schalter vor — keine Akteneinsicht.',
      dialog: 'Mitarbeiter: Beginnen wir mit der ___?\nSie: Gerne, hier ist mein Ausweis.',
      options: ['Legitimationsprüfung,Akteneinsicht,Beschwerde'],
      correct: ['Legitimationsprüfung'],
    },
  },
  {
    lemma: 'Beschwerde',
    hint: 'Wortschatz — formelle Rüge bei Behörden',
    so: {
      body: 'Wegen der Wartezeit reichen Sie eine ___ ein.',
      options: ['Beschwerde', 'Akteneinsicht', 'Aufenthaltserlaubnis'],
      correct: 'Beschwerde',
    },
    ms: {
      body: 'Was gehört zur Beschwerde? Wählen Sie alle richtigen Antworten.',
      options: ['Sachverhalt', 'Antrag', 'Antwort der Behörde', 'Integrationskurs', 'Leistungsbescheid'],
      correct: ['Sachverhalt', 'Antrag', 'Antwort der Behörde'],
    },
    dd: ['Ihre', 'Beschwerde', 'wird', 'schriftlich', 'bearbeitet', '.'],
    in: {
      wordChoices: ['Beschwerde', 'Akteneinsicht', 'Aufenthaltserlaubnis'],
      correct: ['Beschwerde'],
      body: 'Ergänzen Sie:\n\nWegen der langen Wartezeit reichen Sie eine ___ ein.',
    },
    tg: {
      story: 'Vorgeschichte: Sie warten monatelang auf eine Antwort und rügen das Verfahren — kein Antrag auf Akteneinsicht.',
      dialog: 'Ombudsstelle: Haben Sie eine ___?\nSie: Ja, ich habe sie gestern eingereicht.',
      options: ['Beschwerde,Akteneinsicht,Aufenthaltserlaubnis'],
      correct: ['Beschwerde'],
    },
  },
  {
    lemma: 'Bearbeitungsstand',
    hint: 'Wortschatz — aktuelle Lage eines behördlichen Vorgangs',
    so: {
      body: 'Am Telefon erfragen Sie den ___.',
      options: ['Bearbeitungsstand', 'Verwaltungsakt', 'Integrationskurs'],
      correct: 'Bearbeitungsstand',
    },
    ms: {
      body: 'Was gehört zum Bearbeitungsstand? Wählen Sie alle richtigen Antworten.',
      options: ['Status', 'Vorgangsnummer', 'voraussichtliche Dauer', 'Bescheid', 'Formular'],
      correct: ['Status', 'Vorgangsnummer', 'voraussichtliche Dauer'],
    },
    dd: ['Der', 'Bearbeitungsstand', 'ist', 'noch', 'offen', '.'],
    in: {
      wordChoices: ['Bearbeitungsstand', 'Verwaltungsakt', 'Integrationskurs'],
      correct: ['Bearbeitungsstand'],
      body: 'Ergänzen Sie:\n\nNach vier Wochen fragen Sie nach dem ___.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Antrag liegt seit Wochen bei der Behörde — Sie wollen wissen, wie weit die Prüfung ist.',
      dialog: 'Hotline: Kennen Sie den ___?\nSie: Nein, deshalb rufe ich an.',
      options: ['Bearbeitungsstand,Verwaltungsakt,Integrationskurs'],
      correct: ['Bearbeitungsstand'],
    },
  },
  {
    lemma: 'Verfahrensfrist',
    hint: 'Wortschatz — gesetzliche Frist für das Verfahren',
    so: {
      body: 'Die Behörde muss die ___ einhalten.',
      options: ['Verfahrensfrist', 'Integrationskurs', 'Amtssprache'],
      correct: 'Verfahrensfrist',
    },
    ms: {
      body: 'Was gehört zur Verfahrensfrist? Wählen Sie alle richtigen Antworten.',
      options: ['Bearbeitungsdauer', 'Fristablauf', 'Verzögerung', 'Widerspruch', 'Bescheid'],
      correct: ['Bearbeitungsdauer', 'Fristablauf', 'Verzögerung'],
    },
    dd: ['Die', 'Verfahrensfrist', 'läuft', 'in', 'drei', 'Monaten', 'ab', '.'],
    in: {
      wordChoices: ['Verfahrensfrist', 'Integrationskurs', 'Amtssprache'],
      correct: ['Verfahrensfrist'],
      body: 'Ergänzen Sie:\n\nBei Überschreitung der ___ können Sie Beschwerde einlegen.',
    },
    tg: {
      story: 'Vorgeschichte: Die gesetzliche Bearbeitungszeit ist fast abgelaufen — kein Integrationskurs steht zur Debatte.',
      dialog: 'Anwalt: Wann endet die ___?\nSie: Laut Gesetz in zwei Wochen.',
      options: ['Verfahrensfrist,Integrationskurs,Amtssprache'],
      correct: ['Verfahrensfrist'],
    },
  },
  {
    lemma: 'Amtssprache',
    hint: 'Wortschatz — offizielle Sprache der Behörde',
    so: {
      body: 'Alle Schreiben verfassen Sie in ___.',
      options: ['Amtssprache', 'Akteneinsicht', 'Bearbeitungsstand'],
      correct: 'Amtssprache',
    },
    ms: {
      body: 'Was gehört zur Amtssprache? Wählen Sie alle richtigen Antworten.',
      options: ['Deutsch', 'formeller Stil', 'behördliche Korrespondenz', 'Widerspruch', 'Frist'],
      correct: ['Deutsch', 'formeller Stil', 'behördliche Korrespondenz'],
    },
    dd: ['Die', 'Amtssprache', 'ist', 'Deutsch', '.'],
    in: {
      wordChoices: ['Amtssprache', 'Akteneinsicht', 'Bearbeitungsstand'],
      correct: ['Amtssprache'],
      body: 'Ergänzen Sie:\n\nIhr Widerspruch muss in ___ formuliert sein.',
    },
    tg: {
      story: 'Vorgeschichte: Sie formulieren den Widerspruch formal auf Deutsch — keine Akteneinsicht.',
      dialog: 'Sachbearbeiter: In welcher ___ schreiben Sie?\nSie: In deutscher Amtssprache.',
      options: ['Amtssprache,Akteneinsicht,Bearbeitungsstand'],
      correct: ['Amtssprache'],
    },
  },
  {
    lemma: 'E-Akte',
    hint: 'Wortschatz — elektronische Verwaltungsakte',
    so: {
      body: 'Ihre Unterlagen liegen in der ___.',
      options: ['E-Akte', 'Zustellungsurkunde', 'Integrationskurs'],
      correct: 'E-Akte',
    },
    ms: {
      body: 'Was gehört zur E-Akte? Wählen Sie alle richtigen Antworten.',
      options: ['digitale Speicherung', 'Zugriffsrechte', 'Datenschutz', 'Bescheid', 'Schalter'],
      correct: ['digitale Speicherung', 'Zugriffsrechte', 'Datenschutz'],
    },
    dd: ['Die', 'E-Akte', 'ist', 'passwortgeschützt', '.'],
    in: {
      wordChoices: ['E-Akte', 'Zustellungsurkunde', 'Integrationskurs'],
      correct: ['E-Akte'],
      body: 'Ergänzen Sie:\n\nAlle Dokumente finden Sie in der ___.',
    },
    tg: {
      story: 'Vorgeschichte: Die Behörde speichert Ihren Vorgang digital — kein Papier aus dem Integrationskurs.',
      dialog: 'IT-Beauftragter: Wer darf in die ___?\nSie: Nur autorisierte Sachbearbeiter.',
      options: ['E-Akte,Zustellungsurkunde,Integrationskurs'],
      correct: ['E-Akte'],
    },
  },
  {
    lemma: 'Einspruchsfrist',
    hint: 'Wortschatz — Frist für Widerspruch gegen Bescheid',
    so: {
      body: 'Beachten Sie die ___ im Bescheid.',
      options: ['Einspruchsfrist', 'Verfahrensfrist', 'Bearbeitungsstand'],
      correct: 'Einspruchsfrist',
    },
    ms: {
      body: 'Was gehört zur Einspruchsfrist? Wählen Sie alle richtigen Antworten.',
      options: ['Fristbeginn', 'Fristende', 'Zustellung', 'Bearbeitungsstand', 'Verfahrensfrist'],
      correct: ['Fristbeginn', 'Fristende', 'Zustellung'],
    },
    dd: ['Die', 'Einspruchsfrist', 'beträgt', 'einen', 'Monat', '.'],
    in: {
      wordChoices: ['Einspruchsfrist', 'Verfahrensfrist', 'Bearbeitungsstand'],
      correct: ['Einspruchsfrist'],
      body: 'Ergänzen Sie:\n\nNach Zustellung beginnt die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Der Leistungsbescheid wurde zugestellt — Sie prüfen, bis wann Widerspruch möglich ist.',
      dialog: 'Berater: Kennen Sie die ___?\nSie: Ja, sie endet in zwei Wochen.',
      options: ['Einspruchsfrist,Verfahrensfrist,Bearbeitungsstand'],
      correct: ['Einspruchsfrist'],
    },
  },
  {
    lemma: 'Aufenthaltserlaubnis',
    hint: 'Wortschatz — befristete Erlaubnis zum Aufenthalt',
    so: {
      body: 'Sie verlängern Ihre ___.',
      options: ['Aufenthaltserlaubnis', 'Leistungsbescheid', 'Zustellungsurkunde'],
      correct: 'Aufenthaltserlaubnis',
    },
    ms: {
      body: 'Was gehört zur Aufenthaltserlaubnis? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag', 'Verlängerung', 'Ausländerbehörde', 'Widerspruchsverfahren', 'Verwaltungsgericht'],
      correct: ['Antrag', 'Verlängerung', 'Ausländerbehörde'],
    },
    dd: ['Die', 'Aufenthaltserlaubnis', 'läuft', 'bald', 'ab', '.'],
    in: {
      wordChoices: ['Aufenthaltserlaubnis', 'Leistungsbescheid', 'Zustellungsurkunde'],
      correct: ['Aufenthaltserlaubnis'],
      body: 'Ergänzen Sie:\n\nBei der Ausländerbehörde verlängern Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Aufenthaltstitel endet nächsten Monat — Sie bereiten Unterlagen für die Ausländerbehörde vor.',
      dialog: 'Sachbearbeiter: Wann läuft Ihre ___ ab?\nSie: Am 30. September.',
      options: ['Aufenthaltserlaubnis,Leistungsbescheid,Zustellungsurkunde'],
      correct: ['Aufenthaltserlaubnis'],
    },
  },
];
