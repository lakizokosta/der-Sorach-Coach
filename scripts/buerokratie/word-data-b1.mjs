/** B1 lemma specs — Bürokratie (Sie-Register) */

export const b1Words = [
  {
    lemma: 'Ausländerbehörde',
    hint: 'Wortschatz — Behörde für Aufenthalt und Ausländerangelegenheiten',
    so: {
      body: 'Für die Verlängerung Ihres Aufenthaltstitels wenden Sie sich an die ___.',
      options: ['Ausländerbehörde', 'Genehmigung', 'Zustellung'],
      correct: 'Ausländerbehörde',
    },
    ms: {
      body: 'Was macht die Ausländerbehörde? Wählen Sie alle richtigen Antworten.',
      options: ['Aufenthaltstitel prüfen', 'Termine vergeben', 'Unterlagen entgegennehmen', 'Leistungsantrag', 'Widerspruch'],
      correct: ['Aufenthaltstitel prüfen', 'Termine vergeben', 'Unterlagen entgegennehmen'],
    },
    dd: ['Ich', 'habe', 'einen', 'Termin', 'bei', 'der', 'Ausländerbehörde', '.'],
    in: {
      wordChoices: ['Ausländerbehörde', 'Genehmigung', 'Zustellung'],
      correct: ['Ausländerbehörde'],
      body: 'Ergänzen Sie:\n\nMorgen besuchen Sie die ___ wegen Ihres Aufenthaltstitels.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Aufenthaltstitel läuft bald ab. Sie brauchen einen Termin bei der zuständigen Behörde — keine Genehmigung per Post und keine Zustellung eines Bescheids.',
      dialog: 'Freund: Wohin gehen Sie?\nSie: Zur ___, um den Titel zu verlängern.',
      options: ['Ausländerbehörde,Genehmigung,Zustellung'],
      correct: ['Ausländerbehörde'],
    },
  },
  {
    lemma: 'Aufenthaltstitel',
    hint: 'Wortschatz — offizielles Dokument für den legalen Aufenthalt',
    so: {
      body: 'Ihr ___ läuft in drei Monaten ab.',
      options: ['Aufenthaltstitel', 'Bescheid', 'Vollmacht'],
      correct: 'Aufenthaltstitel',
    },
    ms: {
      body: 'Was gehört zum Aufenthaltstitel? Wählen Sie alle richtigen Antworten.',
      options: ['Gültigkeitsdauer', 'Verlängerung', 'Unterlagen', 'Leistungsantrag', 'Widerspruch'],
      correct: ['Gültigkeitsdauer', 'Verlängerung', 'Unterlagen'],
    },
    dd: ['Mein', 'Aufenthaltstitel', 'muss', 'verlängert', 'werden', '.'],
    in: {
      wordChoices: ['Aufenthaltstitel', 'Bescheid', 'Vollmacht'],
      correct: ['Aufenthaltstitel'],
      body: 'Ergänzen Sie:\n\nBitte legen Sie Ihren ___ beim Termin vor.',
    },
    tg: {
      story: 'Vorgeschichte: Auf dem Dokument steht das Ablaufdatum. Sie müssen es rechtzeitig verlängern — kein Bescheid vom Jobcenter und keine Vollmacht für einen Dritten.',
      dialog: 'Sachbearbeiter: Haben Sie Ihren ___ dabei?\nSie: Ja, hier ist er.',
      options: ['Aufenthaltstitel,Bescheid,Vollmacht'],
      correct: ['Aufenthaltstitel'],
    },
  },
  {
    lemma: 'Verlängerung',
    hint: 'Wortschatz — Gültigkeit eines Titels verlängern',
    so: {
      body: 'Sie beantragen die ___ Ihres Aufenthaltstitels.',
      options: ['Verlängerung', 'Ablehnung', 'Zustellung'],
      correct: 'Verlängerung',
    },
    ms: {
      body: 'Was brauchen Sie für die Verlängerung? Wählen Sie alle richtigen Antworten.',
      options: ['Unterlagen', 'Termin', 'Antrag', 'Widerspruch', 'Mitteilung'],
      correct: ['Unterlagen', 'Termin', 'Antrag'],
    },
    dd: ['Ich', 'beantrage', 'die', 'Verlängerung', 'meines', 'Titels', '.'],
    in: {
      wordChoices: ['Verlängerung', 'Ablehnung', 'Zustellung'],
      correct: ['Verlängerung'],
      body: 'Ergänzen Sie:\n\nDie ___ dauert mehrere Wochen.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Titel läuft ab und Sie reichen alle Papiere ein. Sie wollen ihn weiter nutzen — keine Ablehnung und keine Zustellung per Boten.',
      dialog: 'Sachbearbeiter: Worum geht es?\nSie: Um die ___ meines Aufenthaltstitels.',
      options: ['Verlängerung,Ablehnung,Zustellung'],
      correct: ['Verlängerung'],
    },
  },
  {
    lemma: 'Bescheid',
    hint: 'Wortschatz — offizielles Schreiben von der Behörde',
    so: {
      body: 'Vom Jobcenter erhalten Sie einen ___ per Post.',
      options: ['Bescheid', 'Vollmacht', 'Terminvereinbarung'],
      correct: 'Bescheid',
    },
    ms: {
      body: 'Was steht in einem Bescheid? Wählen Sie alle richtigen Antworten.',
      options: ['Entscheidung', 'Begründung', 'Aktenzeichen', 'Beglaubigung', 'Online-Portal'],
      correct: ['Entscheidung', 'Begründung', 'Aktenzeichen'],
    },
    dd: ['Der', 'Bescheid', 'kommt', 'nächste', 'Woche', '.'],
    in: {
      wordChoices: ['Bescheid', 'Vollmacht', 'Terminvereinbarung'],
      correct: ['Bescheid'],
      body: 'Ergänzen Sie:\n\nLesen Sie den ___ vom Jobcenter sorgfältig.',
    },
    tg: {
      story: 'Vorgeschichte: Das Jobcenter hat über Ihren Antrag entschieden. Die schriftliche Mitteilung kommt per Post — keine Vollmacht und keine Terminvereinbarung.',
      dialog: 'Berater: Haben Sie Post bekommen?\nSie: Ja, einen ___ vom Jobcenter.',
      options: ['Bescheid,Vollmacht,Terminvereinbarung'],
      correct: ['Bescheid'],
    },
  },
  {
    lemma: 'Widerspruch',
    hint: 'Wortschatz — formeller Einspruch gegen eine behördliche Entscheidung',
    so: {
      body: 'Gegen den Bescheid legen Sie ___ ein.',
      options: ['Widerspruch', 'Genehmigung', 'Nachreichung'],
      correct: 'Widerspruch',
    },
    ms: {
      body: 'Was gehört zum Widerspruch? Wählen Sie alle richtigen Antworten.',
      options: ['Frist beachten', 'schriftliche Form', 'Begründung', 'Terminvereinbarung', 'Beglaubigung'],
      correct: ['Frist beachten', 'schriftliche Form', 'Begründung'],
    },
    dd: ['Ich', 'lege', 'Widerspruch', 'gegen', 'den', 'Bescheid', 'ein', '.'],
    in: {
      wordChoices: ['Widerspruch', 'Genehmigung', 'Nachreichung'],
      correct: ['Widerspruch'],
      body: 'Ergänzen Sie:\n\nInnerhalb von vier Wochen können Sie ___ einlegen.',
    },
    tg: {
      story: 'Vorgeschichte: Der Bescheid gefällt Ihnen nicht. Sie haben vier Wochen Zeit und schreiben eine Begründung — keine Genehmigung und keine Nachreichung von Unterlagen.',
      dialog: 'Anwalt: Was planen Sie?\nSie: Ich lege ___ gegen den Bescheid ein.',
      options: ['Widerspruch,Genehmigung,Nachreichung'],
      correct: ['Widerspruch'],
    },
  },
  {
    lemma: 'Bearbeitung',
    hint: 'Wortschatz — Prüfung eines Antrags durch die Behörde',
    so: {
      body: 'Die ___ Ihres Antrags dauert mehrere Wochen.',
      options: ['Bearbeitung', 'Zustellung', 'Mitteilung'],
      correct: 'Bearbeitung',
    },
    ms: {
      body: 'Was passiert während der Bearbeitung? Wählen Sie alle richtigen Antworten.',
      options: ['Prüfung der Unterlagen', 'Sachbearbeitung', 'Entscheidung', 'Terminvereinbarung', 'Beglaubigung'],
      correct: ['Prüfung der Unterlagen', 'Sachbearbeitung', 'Entscheidung'],
    },
    dd: ['Die', 'Bearbeitung', 'kann', 'lange', 'dauern', '.'],
    in: {
      wordChoices: ['Bearbeitung', 'Zustellung', 'Mitteilung'],
      correct: ['Bearbeitung'],
      body: 'Ergänzen Sie:\n\nBitte haben Sie Geduld während der ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben alle Unterlagen abgegeben. Der Sachbearbeiter prüft Ihren Antrag — noch keine Zustellung und keine Mitteilung per E-Mail.',
      dialog: 'Sachbearbeiter: Wie ist der Stand?\nSie: Die ___ läuft noch.',
      options: ['Bearbeitung,Zustellung,Mitteilung'],
      correct: ['Bearbeitung'],
    },
  },
  {
    lemma: 'Aktenzeichen',
    hint: 'Wortschatz — Referenznummer für ein Behördenverfahren',
    so: {
      body: 'Bitte nennen Sie Ihr ___ am Telefon.',
      options: ['Aktenzeichen', 'Genehmigung', 'Verlängerung'],
      correct: 'Aktenzeichen',
    },
    ms: {
      body: 'Wofür brauchen Sie das Aktenzeichen? Wählen Sie alle richtigen Antworten.',
      options: ['Nachfragen', 'Schriftverkehr', 'Termin', 'Beglaubigung', 'Leistungsantrag'],
      correct: ['Nachfragen', 'Schriftverkehr', 'Termin'],
    },
    dd: ['Mein', 'Aktenzeichen', 'steht', 'oben', 'auf', 'dem', 'Bescheid', '.'],
    in: {
      wordChoices: ['Aktenzeichen', 'Genehmigung', 'Verlängerung'],
      correct: ['Aktenzeichen'],
      body: 'Ergänzen Sie:\n\nSchreiben Sie das ___ auf jede E-Mail.',
    },
    tg: {
      story: 'Vorgeschichte: Oben auf dem Bescheid steht eine Nummer. Damit findet die Behörde Ihren Fall — keine Genehmigung und keine Verlängerung des Titels.',
      dialog: 'Sachbearbeiter: Kennen Sie Ihr ___?\nSie: Ja, AZ-2024-12345.',
      options: ['Aktenzeichen,Genehmigung,Verlängerung'],
      correct: ['Aktenzeichen'],
    },
  },
  {
    lemma: 'Vollmacht',
    hint: 'Wortschatz — schriftliche Erlaubnis, für jemanden zu handeln',
    so: {
      body: 'Ohne ___ darf Ihre Anwältin nicht für Sie unterschreiben.',
      options: ['Vollmacht', 'Bescheid', 'Eingangsbestätigung'],
      correct: 'Vollmacht',
    },
    ms: {
      body: 'Was gehört zur Vollmacht? Wählen Sie alle richtigen Antworten.',
      options: ['Unterschrift', 'Vertretung', 'Beglaubigung', 'Widerspruch', 'Zustellung'],
      correct: ['Unterschrift', 'Vertretung', 'Beglaubigung'],
    },
    dd: ['Ich', 'gebe', 'meiner', 'Anwältin', 'eine', 'Vollmacht', '.'],
    in: {
      wordChoices: ['Vollmacht', 'Bescheid', 'Eingangsbestätigung'],
      correct: ['Vollmacht'],
      body: 'Ergänzen Sie:\n\nBitte reichen Sie eine ___ für Ihren Bevollmächtigten ein.',
    },
    tg: {
      story: 'Vorgeschichte: Sie können nicht persönlich erscheinen und bevollmächtigen Ihre Anwältin schriftlich. Unterschrift ist nötig — kein Bescheid und keine Eingangsbestätigung.',
      dialog: 'Sachbearbeiter: Wer unterschreibt für Sie?\nSie: Meine Anwältin, mit ___.',
      options: ['Vollmacht,Bescheid,Eingangsbestätigung'],
      correct: ['Vollmacht'],
    },
  },
  {
    lemma: 'Beglaubigung',
    hint: 'Wortschatz — amtliche Bestätigung der Echtheit',
    so: {
      body: 'Die Kopie Ihres Passes braucht eine ___.',
      options: ['Beglaubigung', 'Mitteilung', 'Ablehnung'],
      correct: 'Beglaubigung',
    },
    ms: {
      body: 'Was kann beglaubigt werden? Wählen Sie alle richtigen Antworten.',
      options: ['Kopie', 'Unterschrift', 'Übersetzung', 'Widerspruch', 'Terminvereinbarung'],
      correct: ['Kopie', 'Unterschrift', 'Übersetzung'],
    },
    dd: ['Die', 'Beglaubigung', 'kostet', 'zehn', 'Euro', '.'],
    in: {
      wordChoices: ['Beglaubigung', 'Mitteilung', 'Ablehnung'],
      correct: ['Beglaubigung'],
      body: 'Ergänzen Sie:\n\nOhne ___ akzeptiert die Behörde die Kopie nicht.',
    },
    tg: {
      story: 'Vorgeschichte: Sie reichen eine Kopie Ihres Passes ein. Die Behörde verlangt eine amtliche Bestätigung — keine Mitteilung per Brief und keine Ablehnung.',
      dialog: 'Sachbearbeiter: Ist die Kopie ___?\nSie: Ja, beim Notar.',
      options: ['Beglaubigung,Mitteilung,Ablehnung'],
      correct: ['Beglaubigung'],
    },
  },
  {
    lemma: 'Nachreichung',
    hint: 'Wortschatz — nachträgliches Einreichen fehlender Unterlagen',
    so: {
      body: 'Per E-Mail senden Sie die ___ der fehlenden Dokumente.',
      options: ['Nachreichung', 'Genehmigung', 'Zustellung'],
      correct: 'Nachreichung',
    },
    ms: {
      body: 'Was gehört zur Nachreichung? Wählen Sie alle richtigen Antworten.',
      options: ['fehlende Unterlagen', 'Frist', 'Eingangsbestätigung', 'Widerspruch', 'Leistungsantrag'],
      correct: ['fehlende Unterlagen', 'Frist', 'Eingangsbestätigung'],
    },
    dd: ['Die', 'Nachreichung', 'muss', 'bis', 'Freitag', 'erfolgen', '.'],
    in: {
      wordChoices: ['Nachreichung', 'Genehmigung', 'Zustellung'],
      correct: ['Nachreichung'],
      body: 'Ergänzen Sie:\n\nBitte veranlassen Sie die ___ der Gehaltsnachweise.',
    },
    tg: {
      story: 'Vorgeschichte: Der Sachbearbeiter schreibt, dass Gehaltsnachweise fehlen. Sie schicken sie bis Freitag — keine Genehmigung und keine Zustellung per Boten.',
      dialog: 'Sachbearbeiter: Was fehlt noch?\nSie: Ich mache die ___ der Unterlagen.',
      options: ['Nachreichung,Genehmigung,Zustellung'],
      correct: ['Nachreichung'],
    },
  },
  {
    lemma: 'Zustellung',
    hint: 'Wortschatz — offizielle Übergabe eines Schreibens an den Empfänger',
    so: {
      body: 'Die ___ des Bescheids erfolgt per Post.',
      options: ['Zustellung', 'Bearbeitung', 'Verlängerung'],
      correct: 'Zustellung',
    },
    ms: {
      body: 'Was gehört zur Zustellung? Wählen Sie alle richtigen Antworten.',
      options: ['Post', 'Einschreiben', 'Zustellungsnachweis', 'Terminvereinbarung', 'Beglaubigung'],
      correct: ['Post', 'Einschreiben', 'Zustellungsnachweis'],
    },
    dd: ['Die', 'Zustellung', 'erfolgt', 'per', 'Einschreiben', '.'],
    in: {
      wordChoices: ['Zustellung', 'Bearbeitung', 'Verlängerung'],
      correct: ['Zustellung'],
      body: 'Ergänzen Sie:\n\nNach der ___ beginnt die Widerspruchsfrist.',
    },
    tg: {
      story: 'Vorgeschichte: Der Bescheid kommt per Einschreiben. Erst dann läuft die Frist — keine Bearbeitung des Antrags und keine Verlängerung des Titels.',
      dialog: 'Berater: Wann kam der Brief?\nSie: Die ___ war gestern.',
      options: ['Zustellung,Bearbeitung,Verlängerung'],
      correct: ['Zustellung'],
    },
  },
  {
    lemma: 'Eingangsbestätigung',
    hint: 'Wortschatz — schriftlicher Nachweis, dass Unterlagen angekommen sind',
    so: {
      body: 'Nach dem Upload erhalten Sie eine ___.',
      options: ['Eingangsbestätigung', 'Ablehnung', 'Vollmacht'],
      correct: 'Eingangsbestätigung',
    },
    ms: {
      body: 'Was bestätigt die Eingangsbestätigung? Wählen Sie alle richtigen Antworten.',
      options: ['Empfang der Unterlagen', 'Datum', 'Aktenzeichen', 'Widerspruch', 'Genehmigung'],
      correct: ['Empfang der Unterlagen', 'Datum', 'Aktenzeichen'],
    },
    dd: ['Die', 'Eingangsbestätigung', 'kommt', 'sofort', 'per', 'E-Mail', '.'],
    in: {
      wordChoices: ['Eingangsbestätigung', 'Ablehnung', 'Vollmacht'],
      correct: ['Eingangsbestätigung'],
      body: 'Ergänzen Sie:\n\nBewahren Sie die ___ für Ihre Unterlagen auf.',
    },
    tg: {
      story: 'Vorgeschichte: Sie laden Dokumente im Portal hoch. Sofort kommt eine E-Mail mit Datum und Aktenzeichen — keine Ablehnung und keine Vollmacht.',
      dialog: 'Sachbearbeiter: Haben Sie einen Nachweis?\nSie: Ja, die ___ per E-Mail.',
      options: ['Eingangsbestätigung,Ablehnung,Vollmacht'],
      correct: ['Eingangsbestätigung'],
    },
  },
  {
    lemma: 'Sachbearbeiter',
    hint: 'Wortschatz — Mitarbeiter der Behörde für Ihr Anliegen',
    so: {
      body: 'Ihr ___ erklärt Ihnen die nächsten Schritte.',
      options: ['Sachbearbeiter', 'Leistungsantrag', 'Online-Portal'],
      correct: 'Sachbearbeiter',
    },
    ms: {
      body: 'Was macht ein Sachbearbeiter? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag prüfen', 'Unterlagen anfordern', 'Termin vergeben', 'Beglaubigung', 'Widerspruch'],
      correct: ['Antrag prüfen', 'Unterlagen anfordern', 'Termin vergeben'],
    },
    dd: ['Mein', 'Sachbearbeiter', 'ruft', 'mich', 'morgen', 'an', '.'],
    in: {
      wordChoices: ['Sachbearbeiter', 'Leistungsantrag', 'Online-Portal'],
      correct: ['Sachbearbeiter'],
      body: 'Ergänzen Sie:\n\nFragen Sie Ihren ___ nach dem Aktenzeichen.',
    },
    tg: {
      story: 'Vorgeschichte: Sie waren beim Termin und haben Ihren Ansprechpartner kennengelernt. Er prüft Anträge und vergibt Termine — kein Leistungsantrag und kein Online-Portal.',
      dialog: 'Empfang: Wen suchen Sie?\nSie: Meinen ___ für den Aufenthaltstitel.',
      options: ['Sachbearbeiter,Leistungsantrag,Online-Portal'],
      correct: ['Sachbearbeiter'],
    },
  },
  {
    lemma: 'Unterlagen',
    hint: 'Wortschatz — Dokumente für einen behördlichen Antrag',
    so: {
      body: 'Bringen Sie alle ___ zum Termin mit.',
      options: ['Unterlagen', 'Mitteilung', 'Zustellung'],
      correct: 'Unterlagen',
    },
    ms: {
      body: 'Was können Unterlagen sein? Wählen Sie alle richtigen Antworten.',
      options: ['Passkopie', 'Meldebescheinigung', 'Gehaltsnachweis', 'Widerspruch', 'Terminvereinbarung'],
      correct: ['Passkopie', 'Meldebescheinigung', 'Gehaltsnachweis'],
    },
    dd: ['Meine', 'Unterlagen', 'sind', 'vollständig', '.'],
    in: {
      wordChoices: ['Unterlagen', 'Mitteilung', 'Zustellung'],
      correct: ['Unterlagen'],
      body: 'Ergänzen Sie:\n\nPrüfen Sie Ihre ___ vor dem Termin.',
    },
    tg: {
      story: 'Vorgeschichte: Sie packen Passkopie, Meldebescheinigung und Gehaltsnachweise ein. Alles ist bereit — keine Mitteilung und keine Zustellung.',
      dialog: 'Sachbearbeiter: Haben Sie Ihre ___?\nSie: Ja, alles ist kopiert.',
      options: ['Unterlagen,Mitteilung,Zustellung'],
      correct: ['Unterlagen'],
    },
  },
  {
    lemma: 'Genehmigung',
    hint: 'Wortschatz — positive Entscheidung einer Behörde',
    so: {
      body: 'Im Bescheid steht die ___ Ihres Antrags.',
      options: ['Genehmigung', 'Ablehnung', 'Nachreichung'],
      correct: 'Genehmigung',
    },
    ms: {
      body: 'Was bedeutet eine Genehmigung? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag bewilligt', 'positiver Bescheid', 'Recht auf Leistung', 'Widerspruch', 'Beglaubigung'],
      correct: ['Antrag bewilligt', 'positiver Bescheid', 'Recht auf Leistung'],
    },
    dd: ['Die', 'Genehmigung', 'freut', 'mich', 'sehr', '.'],
    in: {
      wordChoices: ['Genehmigung', 'Ablehnung', 'Nachreichung'],
      correct: ['Genehmigung'],
      body: 'Ergänzen Sie:\n\nMit der ___ können Sie weiter arbeiten.',
    },
    tg: {
      story: 'Vorgeschichte: Das Jobcenter hat Ihren Antrag bewilligt. Der Bescheid ist positiv — keine Ablehnung und keine Nachreichung nötig.',
      dialog: 'Berater: Was steht im Brief?\nSie: Die ___ meines Leistungsantrags.',
      options: ['Genehmigung,Ablehnung,Nachreichung'],
      correct: ['Genehmigung'],
    },
  },
  {
    lemma: 'Ablehnung',
    hint: 'Wortschatz — negative Entscheidung einer Behörde',
    so: {
      body: 'Gegen die ___ können Sie Widerspruch einlegen.',
      options: ['Ablehnung', 'Genehmigung', 'Eingangsbestätigung'],
      correct: 'Ablehnung',
    },
    ms: {
      body: 'Was steht in einer Ablehnung? Wählen Sie alle richtigen Antworten.',
      options: ['Begründung', 'Rechtsmittelbelehrung', 'Aktenzeichen', 'Terminvereinbarung', 'Beglaubigung'],
      correct: ['Begründung', 'Rechtsmittelbelehrung', 'Aktenzeichen'],
    },
    dd: ['Die', 'Ablehnung', 'kam', 'gestern', 'per', 'Post', '.'],
    in: {
      wordChoices: ['Ablehnung', 'Genehmigung', 'Eingangsbestätigung'],
      correct: ['Ablehnung'],
      body: 'Ergänzen Sie:\n\nLesen Sie die ___ im Bescheid genau.',
    },
    tg: {
      story: 'Vorgeschichte: Der Bescheid vom Jobcenter ist negativ. Begründung und Rechtsmittelbelehrung stehen drin — keine Genehmigung und keine Eingangsbestätigung.',
      dialog: 'Anwalt: Was ist passiert?\nSie: Ich habe eine ___ erhalten.',
      options: ['Ablehnung,Genehmigung,Eingangsbestätigung'],
      correct: ['Ablehnung'],
    },
  },
  {
    lemma: 'Terminvereinbarung',
    hint: 'Wortschatz — festgelegter Termin bei der Behörde',
    so: {
      body: 'Für die ___ rufen Sie die Ausländerbehörde an.',
      options: ['Terminvereinbarung', 'Zustellung', 'Bearbeitung'],
      correct: 'Terminvereinbarung',
    },
    ms: {
      body: 'Was gehört zur Terminvereinbarung? Wählen Sie alle richtigen Antworten.',
      options: ['Datum', 'Uhrzeit', 'Online-Portal', 'Widerspruch', 'Leistungsantrag'],
      correct: ['Datum', 'Uhrzeit', 'Online-Portal'],
    },
    dd: ['Die', 'Terminvereinbarung', 'klappt', 'online', '.'],
    in: {
      wordChoices: ['Terminvereinbarung', 'Zustellung', 'Bearbeitung'],
      correct: ['Terminvereinbarung'],
      body: 'Ergänzen Sie:\n\nBitte bestätigen Sie Ihre ___ per E-Mail.',
    },
    tg: {
      story: 'Vorgeschichte: Sie buchen über das Portal einen Termin bei der Ausländerbehörde. Datum und Uhrzeit stehen fest — keine Zustellung und keine laufende Bearbeitung.',
      dialog: 'Freund: Haben Sie schon einen Termin?\nSie: Ja, die ___ war einfach online.',
      options: ['Terminvereinbarung,Zustellung,Bearbeitung'],
      correct: ['Terminvereinbarung'],
    },
  },
  {
    lemma: 'Mitteilung',
    hint: 'Wortschatz — schriftliche Information von der Behörde',
    so: {
      body: 'Per E-Mail erhalten Sie eine ___ über den Stand.',
      options: ['Mitteilung', 'Vollmacht', 'Beglaubigung'],
      correct: 'Mitteilung',
    },
    ms: {
      body: 'Was kann eine Mitteilung enthalten? Wählen Sie alle richtigen Antworten.',
      options: ['Status', 'Frist', 'fehlende Unterlagen', 'Widerspruch', 'Terminvereinbarung'],
      correct: ['Status', 'Frist', 'fehlende Unterlagen'],
    },
    dd: ['Die', 'Mitteilung', 'kam', 'heute', 'Morgen', '.'],
    in: {
      wordChoices: ['Mitteilung', 'Vollmacht', 'Beglaubigung'],
      correct: ['Mitteilung'],
      body: 'Ergänzen Sie:\n\nLesen Sie jede ___ der Behörde sofort.',
    },
    tg: {
      story: 'Vorgeschichte: Die Behörde informiert Sie per E-Mail über fehlende Dokumente und eine Frist — keine Vollmacht und keine Beglaubigung.',
      dialog: 'Sachbearbeiter: Haben Sie unsere E-Mail?\nSie: Ja, die ___ habe ich gelesen.',
      options: ['Mitteilung,Vollmacht,Beglaubigung'],
      correct: ['Mitteilung'],
    },
  },
  {
    lemma: 'Online-Portal',
    hint: 'Wortschatz — digitale Plattform für Anträge und Termine',
    so: {
      body: 'Über das ___ buchen Sie Ihren Termin.',
      options: ['Online-Portal', 'Bescheid', 'Aktenzeichen'],
      correct: 'Online-Portal',
    },
    ms: {
      body: 'Was können Sie im Online-Portal tun? Wählen Sie alle richtigen Antworten.',
      options: ['Termin buchen', 'Unterlagen hochladen', 'Status prüfen', 'Widerspruch', 'Zustellung'],
      correct: ['Termin buchen', 'Unterlagen hochladen', 'Status prüfen'],
    },
    dd: ['Ich', 'logge', 'mich', 'im', 'Online-Portal', 'ein', '.'],
    in: {
      wordChoices: ['Online-Portal', 'Bescheid', 'Aktenzeichen'],
      correct: ['Online-Portal'],
      body: 'Ergänzen Sie:\n\nRegistrieren Sie sich im ___ der Behörde.',
    },
    tg: {
      story: 'Vorgeschichte: Sie öffnen die Website der Ausländerbehörde und buchen einen Termin. Upload und Statuscheck sind möglich — kein Bescheid per Post und kein Aktenzeichen nötig.',
      dialog: 'Freund: Wie haben Sie den Termin gemacht?\nSie: Über das ___ der Behörde.',
      options: ['Online-Portal,Bescheid,Aktenzeichen'],
      correct: ['Online-Portal'],
    },
  },
  {
    lemma: 'Leistungsantrag',
    hint: 'Wortschatz — Antrag auf staatliche Leistung oder Unterstützung',
    so: {
      body: 'Beim Jobcenter stellen Sie einen ___.',
      options: ['Leistungsantrag', 'Widerspruch', 'Vollmacht'],
      correct: 'Leistungsantrag',
    },
    ms: {
      body: 'Was gehört zum Leistungsantrag? Wählen Sie alle richtigen Antworten.',
      options: ['Unterlagen', 'Bearbeitung', 'Bescheid', 'Beglaubigung', 'Terminvereinbarung'],
      correct: ['Unterlagen', 'Bearbeitung', 'Bescheid'],
    },
    dd: ['Mein', 'Leistungsantrag', 'liegt', 'beim', 'Jobcenter', '.'],
    in: {
      wordChoices: ['Leistungsantrag', 'Widerspruch', 'Vollmacht'],
      correct: ['Leistungsantrag'],
      body: 'Ergänzen Sie:\n\nFüllen Sie den ___ sorgfältig aus.',
    },
    tg: {
      story: 'Vorgeschichte: Sie reichen beim Jobcenter alle Formulare und Nachweise ein. Danach kommt ein Bescheid — kein Widerspruch und keine Vollmacht.',
      dialog: 'Berater: Was haben Sie eingereicht?\nSie: Einen ___ beim Jobcenter.',
      options: ['Leistungsantrag,Widerspruch,Vollmacht'],
      correct: ['Leistungsantrag'],
    },
  },
];
