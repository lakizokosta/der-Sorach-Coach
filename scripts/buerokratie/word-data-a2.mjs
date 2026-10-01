/** A2 lemma specs — Bürokratie (Sie-Register) */

export const a2Words = [
  {
    lemma: 'Bürgeramt',
    hint: 'Wortschatz — städtische Behörde für Bürgerangelegenheiten',
    so: {
      body: 'Für Ihre Anmeldung gehen Sie zum ___.',
      options: ['Bürgeramt', 'Schalter', 'Formular'],
      correct: 'Bürgeramt',
    },
    ms: {
      body: 'Was macht man im Bürgeramt? Wählen Sie alle richtigen Antworten.',
      options: ['Anmeldung', 'Personalausweis', 'Meldebescheinigung', 'Schalter', 'Termin'],
      correct: ['Anmeldung', 'Personalausweis', 'Meldebescheinigung'],
    },
    dd: ['Ich', 'gehe', 'zum', 'Bürgeramt', 'für', 'die', 'Anmeldung', '.'],
    in: {
      wordChoices: ['Bürgeramt', 'Schalter', 'Behörde'],
      correct: ['Bürgeramt'],
      body: 'Ergänzen Sie:\n\nMorgen sind Sie im ___ für Ihre Anmeldung.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind neu in der Stadt und müssen sich melden. Sie brauchen einen Ort für die Anmeldung — kein Schalter allein und kein leeres Formular reichen.',
      dialog: 'Freund: Wo melden Sie sich?\nSie: Im ___ in der Innenstadt.',
      options: ['Bürgeramt,Schalter,Formular'],
      correct: ['Bürgeramt'],
    },
  },
  {
    lemma: 'Formular',
    hint: 'Wortschatz — Papier mit Feldern zum Ausfüllen',
    so: {
      body: 'Für die Anmeldung brauchen Sie ein ___.',
      options: ['Formular', 'Brief', 'Termin'],
      correct: 'Formular',
    },
    ms: {
      body: 'Was gehört zu einem Formular? Wählen Sie alle richtigen Antworten.',
      options: ['Felder', 'Unterschrift', 'Antrag', 'Wartenummer', 'Schalter'],
      correct: ['Felder', 'Unterschrift', 'Antrag'],
    },
    dd: ['Bitte', 'füllen', 'Sie', 'das', 'Formular', 'aus', '.'],
    in: {
      wordChoices: ['Formular', 'Brief', 'Antrag'],
      correct: ['Formular'],
      body: 'Ergänzen Sie:\n\nAuf dem Tisch liegt ein ___ für die Anmeldung.',
    },
    tg: {
      story: 'Vorgeschichte: Die Sachbearbeiterin legt Papier vor Sie hin. Sie sollen alle Felder eintragen — kein Brief per Post und kein Termin stehen auf dem Blatt.',
      dialog: 'Sachbearbeiterin: Haben Sie das ___ schon ausgefüllt?\nSie: Nein, ich mache es jetzt.',
      options: ['Formular,Brief,Termin'],
      correct: ['Formular'],
    },
  },
  {
    lemma: 'Antrag',
    hint: 'Wortschatz — offizielles Schreiben mit Bitte an die Behörde',
    so: {
      body: 'Sie stellen einen ___ auf Unterstützung.',
      options: ['Antrag', 'Brief', 'Termin'],
      correct: 'Antrag',
    },
    ms: {
      body: 'Was brauchen Sie für einen Antrag? Wählen Sie alle richtigen Antworten.',
      options: ['Formular', 'Unterschrift', 'Nachweis', 'Wartenummer', 'Schalter'],
      correct: ['Formular', 'Unterschrift', 'Nachweis'],
    },
    dd: ['Ich', 'stelle', 'einen', 'Antrag', 'beim', 'Jobcenter', '.'],
    in: {
      wordChoices: ['Antrag', 'Brief', 'Kopie'],
      correct: ['Antrag'],
      body: 'Ergänzen Sie:\n\nBis Freitag müssen Sie Ihren ___ einreichen.',
    },
    tg: {
      story: 'Vorgeschichte: Sie brauchen finanzielle Hilfe und füllen offizielle Unterlagen aus. Sie senden eine Bitte an die Stelle — kein normaler Brief und kein Termin allein.',
      dialog: 'Berater: Ist Ihr ___ schon fertig?\nSie: Ja, ich reiche ihn heute ein.',
      options: ['Antrag,Brief,Termin'],
      correct: ['Antrag'],
    },
  },
  {
    lemma: 'Termin',
    hint: 'Wortschatz — vereinbartes Treffen bei einer Behörde',
    so: {
      body: 'Ihr ___ beim Jobcenter ist am Mittwoch um zehn Uhr.',
      options: ['Termin', 'Frist', 'Wartezeit'],
      correct: 'Termin',
    },
    ms: {
      body: 'Was passt zu einem Termin? Wählen Sie alle richtigen Antworten.',
      options: ['Uhrzeit', 'Datum', 'pünktlich kommen', 'Formular ausfüllen', 'Kopie machen'],
      correct: ['Uhrzeit', 'Datum', 'pünktlich kommen'],
    },
    dd: ['Mein', 'Termin', 'beim', 'Jobcenter', 'ist', 'am', 'Mittwoch', '.'],
    in: {
      wordChoices: ['Termin', 'Frist', 'Wartezeit'],
      correct: ['Termin'],
      body: 'Ergänzen Sie:\n\nBitte bestätigen Sie Ihren ___ schriftlich.',
    },
    tg: {
      story: 'Vorgeschichte: Das Jobcenter schickt Ihnen eine Uhrzeit für nächste Woche. Sie sollen pünktlich erscheinen — keine Frist zum Einreichen und keine Wartezeit im Flur sind gemeint.',
      dialog: 'Sachbearbeiter: Ihr ___ ist am Donnerstag um neun.\nSie: Danke, ich komme pünktlich.',
      options: ['Termin,Frist,Wartezeit'],
      correct: ['Termin'],
    },
  },
  {
    lemma: 'Wartezeit',
    hint: 'Wortschatz — Dauer im Wartesaal vor dem Gespräch',
    so: {
      body: 'Die ___ am Schalter beträgt heute vierzig Minuten.',
      options: ['Wartezeit', 'Frist', 'Anmeldung'],
      correct: 'Wartezeit',
    },
    ms: {
      body: 'Was passt zur Wartezeit? Wählen Sie alle richtigen Antworten.',
      options: ['Schalter', 'Wartenummer', 'viele Menschen', 'Formular', 'Brief'],
      correct: ['Schalter', 'Wartenummer', 'viele Menschen'],
    },
    dd: ['Die', 'Wartezeit', 'am', 'Schalter', 'ist', 'sehr', 'lang', '.'],
    in: {
      wordChoices: ['Wartezeit', 'Frist', 'Termin'],
      correct: ['Wartezeit'],
      body: 'Ergänzen Sie:\n\nLeider ist die ___ heute über eine Stunde.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben eine Nummer gezogen und sitzen im Wartesaal. Viele Menschen warten vor dem Schalter — keine Frist und kein fester Termin sind das Problem.',
      dialog: 'Kollege: Wie lange ist die ___?\nSie: Schon dreißig Minuten, leider.',
      options: ['Wartezeit,Frist,Termin'],
      correct: ['Wartezeit'],
    },
  },
  {
    lemma: 'Personalausweis',
    hint: 'Wortschatz — offizieller Lichtbildausweis der Behörde',
    so: {
      body: 'Bitte legen Sie Ihren ___ vor.',
      options: ['Personalausweis', 'Formular', 'Brief'],
      correct: 'Personalausweis',
    },
    ms: {
      body: 'Was finden Sie auf einem Personalausweis? Wählen Sie alle richtigen Antworten.',
      options: ['Name', 'Foto', 'Geburtsdatum', 'Antrag', 'Frist'],
      correct: ['Name', 'Foto', 'Geburtsdatum'],
    },
    dd: ['Bitte', 'zeigen', 'Sie', 'Ihren', 'Personalausweis', '.'],
    in: {
      wordChoices: ['Personalausweis', 'Meldebescheinigung', 'Kopie'],
      correct: ['Personalausweis'],
      body: 'Ergänzen Sie:\n\nFür die Anmeldung brauchen Sie Ihren ___.',
    },
    tg: {
      story: 'Vorgeschichte: An der Anmeldung verlangt die Sachbearbeiterin ein amtliches Dokument mit Foto. Kein leeres Formular und kein Brief von zu Hause reichen.',
      dialog: 'Sachbearbeiterin: Haben Sie Ihren ___ dabei?\nSie: Ja, hier bitte.',
      options: ['Personalausweis,Meldebescheinigung,Kopie'],
      correct: ['Personalausweis'],
    },
  },
  {
    lemma: 'Meldebescheinigung',
    hint: 'Wortschatz — Dokument über den Wohnort',
    so: {
      body: 'Für die Wohnungssuche brauchen Sie eine ___.',
      options: ['Meldebescheinigung', 'Kopie', 'Wartenummer'],
      correct: 'Meldebescheinigung',
    },
    ms: {
      body: 'Wofür brauchen Sie eine Meldebescheinigung? Wählen Sie alle richtigen Antworten.',
      options: ['Wohnung', 'Antrag', 'Behörde', 'Formular', 'Schalter'],
      correct: ['Wohnung', 'Antrag', 'Behörde'],
    },
    dd: ['Ich', 'brauche', 'eine', 'Meldebescheinigung', 'für', 'die', 'Wohnung', '.'],
    in: {
      wordChoices: ['Meldebescheinigung', 'Personalausweis', 'Antrag'],
      correct: ['Meldebescheinigung'],
      body: 'Ergänzen Sie:\n\nBitte holen Sie sich eine ___ im Bürgeramt.',
    },
    tg: {
      story: 'Vorgeschichte: Der Vermieter will einen Nachweis über Ihren Wohnort. Sie holen ein Dokument aus dem Bürgeramt — kein Personalausweis allein und kein Antrag reichen.',
      dialog: 'Vermieter: Haben Sie die ___?\nSie: Ja, ich habe sie gestern bekommen.',
      options: ['Meldebescheinigung,Personalausweis,Antrag'],
      correct: ['Meldebescheinigung'],
    },
  },
  {
    lemma: 'Anmeldung',
    hint: 'Wortschatz — Meldung des Wohnorts bei der Behörde',
    so: {
      body: 'Nach dem Umzug machen Sie Ihre ___ im Bürgeramt.',
      options: ['Anmeldung', 'Frist', 'Wartezeit'],
      correct: 'Anmeldung',
    },
    ms: {
      body: 'Was brauchen Sie für die Anmeldung? Wählen Sie alle richtigen Antworten.',
      options: ['Personalausweis', 'Wohnungsgeber', 'Formular', 'Schalter', 'Termin'],
      correct: ['Personalausweis', 'Wohnungsgeber', 'Formular'],
    },
    dd: ['Nach', 'dem', 'Umzug', 'mache', 'ich', 'meine', 'Anmeldung', '.'],
    in: {
      wordChoices: ['Anmeldung', 'Antrag', 'Termin'],
      correct: ['Anmeldung'],
      body: 'Ergänzen Sie:\n\nInnerhalb von zwei Wochen müssen Sie Ihre ___ machen.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind gestern in die neue Wohnung gezogen. Sie müssen sich beim Bürgeramt melden — kein Antrag auf Hilfe und kein Termin beim Jobcenter.',
      dialog: 'Nachbar: Haben Sie schon die ___ gemacht?\nSie: Nein, ich gehe morgen ins Bürgeramt.',
      options: ['Anmeldung,Antrag,Termin'],
      correct: ['Anmeldung'],
    },
  },
  {
    lemma: 'Brief',
    hint: 'Wortschatz — Schreiben per Post von einer Stelle',
    so: {
      body: 'Sie bekommen einen ___ von der Behörde.',
      options: ['Brief', 'Termin', 'Schalter'],
      correct: 'Brief',
    },
    ms: {
      body: 'Was kann in einem Brief von der Behörde stehen? Wählen Sie alle richtigen Antworten.',
      options: ['Frist', 'Termin', 'Antrag', 'Wartenummer', 'Personalausweis'],
      correct: ['Frist', 'Termin', 'Antrag'],
    },
    dd: ['Ich', 'bekomme', 'einen', 'Brief', 'von', 'der', 'Behörde', '.'],
    in: {
      wordChoices: ['Brief', 'Formular', 'Antrag'],
      correct: ['Brief'],
      body: 'Ergänzen Sie:\n\nGestern kam ein ___ aus dem Jobcenter.',
    },
    tg: {
      story: 'Vorgeschichte: In Ihrem Briefkasten liegt Post von einer staatlichen Stelle. Sie lesen wichtige Informationen — kein Formular zum Ausfüllen und kein Antrag, den Sie selbst schreiben.',
      dialog: 'Partner: Was ist das?\nSie: Ein ___ vom Jobcenter mit einer Frist.',
      options: ['Brief,Formular,Antrag'],
      correct: ['Brief'],
    },
  },
  {
    lemma: 'Frist',
    hint: 'Wortschatz — letzter Tag für eine Abgabe',
    so: {
      body: 'Die ___ für den Antrag endet am Freitag.',
      options: ['Frist', 'Wartezeit', 'Anmeldung'],
      correct: 'Frist',
    },
    ms: {
      body: 'Was passt zur Frist? Wählen Sie alle richtigen Antworten.',
      options: ['Abgabefrist', 'Antrag einreichen', 'Formular abgeben', 'Schalter', 'Wartenummer'],
      correct: ['Abgabefrist', 'Antrag einreichen', 'Formular abgeben'],
    },
    dd: ['Die', 'Frist', 'endet', 'am', 'Freitag', '.'],
    in: {
      wordChoices: ['Frist', 'Termin', 'Wartezeit'],
      correct: ['Frist'],
      body: 'Ergänzen Sie:\n\nBitte beachten Sie die ___ in dem Brief.',
    },
    tg: {
      story: 'Vorgeschichte: Im Schreiben vom Jobcenter steht ein Datum. Sie müssen bis Freitag Unterlagen abgeben — kein Termin für ein Gespräch und keine Wartezeit sind gemeint.',
      dialog: 'Berater: Kennen Sie die ___?\nSie: Ja, bis Freitag muss alles da sein.',
      options: ['Frist,Termin,Wartezeit'],
      correct: ['Frist'],
    },
  },
  {
    lemma: 'ausfüllen',
    hint: 'Wortschatz — alle Felder in einem Dokument eintragen',
    so: {
      body: 'Bitte ___ Sie das Formular sorgfältig aus.',
      options: ['füllen', 'reichen', 'unterschreiben'],
      correct: 'füllen',
    },
    ms: {
      body: 'Was brauchen Sie zum Ausfüllen? Wählen Sie alle richtigen Antworten.',
      options: ['Formular', 'Stift', 'Angaben', 'Schalter', 'Wartenummer'],
      correct: ['Formular', 'Stift', 'Angaben'],
    },
    dd: ['Bitte', 'füllen', 'Sie', 'das', 'Formular', 'aus', '.'],
    in: {
      wordChoices: ['ausfüllen', 'einreichen', 'unterschreiben'],
      correct: ['ausfüllen'],
      body: 'Ergänzen Sie:\n\nBevor Sie kommen, sollten Sie das Formular ___.',
    },
    tg: {
      story: 'Vorgeschichte: Auf dem Tisch liegt ein leeres Dokument mit vielen Feldern. Sie sollen alle Angaben eintragen — nicht einreichen und nicht unterschreiben ist jetzt die Aufgabe.',
      dialog: 'Sachbearbeiterin: Können Sie das Formular ___?\nSie: Ja, ich mache es gleich hier.',
      options: ['ausfüllen,einreichen,unterschreiben'],
      correct: ['ausfüllen'],
    },
  },
  {
    lemma: 'einreichen',
    hint: 'Wortschatz — Dokumente bei der Behörde abgeben',
    so: {
      body: 'Sie ___ den Antrag bis Freitag ein.',
      options: ['reichen', 'füllen', 'unterschreiben'],
      correct: 'reichen',
    },
    ms: {
      body: 'Was können Sie einreichen? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag', 'Formular', 'Nachweis', 'Wartenummer', 'Schalter'],
      correct: ['Antrag', 'Formular', 'Nachweis'],
    },
    dd: ['Ich', 'reiche', 'den', 'Antrag', 'heute', 'ein', '.'],
    in: {
      wordChoices: ['einreichen', 'ausfüllen', 'unterschreiben'],
      correct: ['einreichen'],
      body: 'Ergänzen Sie:\n\nBitte ___ Sie alle Unterlagen bis zur Frist ein.',
    },
    tg: {
      story: 'Vorgeschichte: Das Formular ist fertig und unterschrieben. Sie geben alles beim Schalter ab — Sie füllen nichts mehr aus und unterschreiben nicht erneut.',
      dialog: 'Sachbearbeiter: Wann ___ Sie den Antrag ein?\nSie: Heute Nachmittag, pünktlich vor der Frist.',
      options: ['einreichen,ausfüllen,unterschreiben'],
      correct: ['einreichen'],
    },
  },
  {
    lemma: 'unterschreiben',
    hint: 'Wortschatz — den Namen unter ein Dokument setzen',
    so: {
      body: 'Bitte ___ Sie unten auf dem Formular.',
      options: ['unterschreiben', 'ausfüllen', 'einreichen'],
      correct: 'unterschreiben',
    },
    ms: {
      body: 'Wann müssen Sie unterschreiben? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag', 'Formular', 'Vertrag', 'Wartenummer', 'Termin'],
      correct: ['Antrag', 'Formular', 'Vertrag'],
    },
    dd: ['Bitte', 'unterschreiben', 'Sie', 'hier', '.'],
    in: {
      wordChoices: ['unterschreiben', 'ausfüllen', 'einreichen'],
      correct: ['unterschreiben'],
      body: 'Ergänzen Sie:\n\nAm Ende müssen Sie das Dokument ___.',
    },
    tg: {
      story: 'Vorgeschichte: Alle Felder sind ausgefüllt. Die Sachbearbeiterin zeigt auf die letzte Zeile — Sie sollen Ihren Namen darunter setzen, nicht ausfüllen und nicht einreichen.',
      dialog: 'Sachbearbeiterin: Bitte ___ Sie hier.\nSie: Gern, einen Moment.',
      options: ['unterschreiben,ausfüllen,einreichen'],
      correct: ['unterschreiben'],
    },
  },
  {
    lemma: 'Kopie',
    hint: 'Wortschatz — zweites Exemplar eines Dokuments',
    so: {
      body: 'Bitte bringen Sie eine ___ Ihres Passes mit.',
      options: ['Kopie', 'Frist', 'Wartenummer'],
      correct: 'Kopie',
    },
    ms: {
      body: 'Wofür brauchen Sie eine Kopie? Wählen Sie alle richtigen Antworten.',
      options: ['Antrag', 'Behörde', 'Nachweis', 'Termin', 'Schalter'],
      correct: ['Antrag', 'Behörde', 'Nachweis'],
    },
    dd: ['Bitte', 'bringen', 'Sie', 'eine', 'Kopie', 'mit', '.'],
    in: {
      wordChoices: ['Kopie', 'Brief', 'Antrag'],
      correct: ['Kopie'],
      body: 'Ergänzen Sie:\n\nFür die Anmeldung brauchen Sie eine ___ des Vertrags.',
    },
    tg: {
      story: 'Vorgeschichte: Auf der Liste steht, dass Sie ein zweites Exemplar mitbringen sollen. Das Original behalten Sie — kein Brief und kein neuer Antrag sind gemeint.',
      dialog: 'Sachbearbeiterin: Haben Sie eine ___?\nSie: Ja, hier ist sie.',
      options: ['Kopie,Brief,Antrag'],
      correct: ['Kopie'],
    },
  },
  {
    lemma: 'Nachweis',
    hint: 'Wortschatz — Dokument als Beleg für etwas',
    so: {
      body: 'Als ___ reichen Sie Ihre Meldebescheinigung ein.',
      options: ['Nachweis', 'Termin', 'Schalter'],
      correct: 'Nachweis',
    },
    ms: {
      body: 'Was kann ein Nachweis sein? Wählen Sie alle richtigen Antworten.',
      options: ['Meldebescheinigung', 'Kopie', 'Formular', 'Wartenummer', 'Wartezeit'],
      correct: ['Meldebescheinigung', 'Kopie', 'Formular'],
    },
    dd: ['Ich', 'bringe', 'einen', 'Nachweis', 'mit', '.'],
    in: {
      wordChoices: ['Nachweis', 'Brief', 'Termin'],
      correct: ['Nachweis'],
      body: 'Ergänzen Sie:\n\nBitte legen Sie einen ___ für Ihre Adresse vor.',
    },
    tg: {
      story: 'Vorgeschichte: Das Jobcenter verlangt einen Beleg für Ihren Wohnort. Sie zeigen ein offizielles Dokument — kein Termin und kein Schalter ersetzen das Papier.',
      dialog: 'Berater: Haben Sie einen ___?\nSie: Ja, hier ist meine Meldebescheinigung.',
      options: ['Nachweis,Brief,Termin'],
      correct: ['Nachweis'],
    },
  },
  {
    lemma: 'Schalter',
    hint: 'Wortschatz — Platz im Amt, wo man persönlich Hilfe bekommt',
    so: {
      body: 'Am ___ bekommen Sie die Meldebescheinigung.',
      options: ['Schalter', 'Termin', 'Brief'],
      correct: 'Schalter',
    },
    ms: {
      body: 'Was passiert am Schalter? Wählen Sie alle richtigen Antworten.',
      options: ['Dokumente abgeben', 'Fragen stellen', 'Formular holen', 'Antrag', 'Termin'],
      correct: ['Dokumente abgeben', 'Fragen stellen', 'Formular holen'],
    },
    dd: ['Am', 'Schalter', 'bekomme', 'ich', 'Hilfe', '.'],
    in: {
      wordChoices: ['Schalter', 'Amt', 'Behörde'],
      correct: ['Schalter'],
      body: 'Ergänzen Sie:\n\nBitte gehen Sie zum ___ Nummer drei.',
    },
    tg: {
      story: 'Vorgeschichte: Ihre Wartenummer wird aufgerufen. Sie gehen zu einer Person hinter der Theke — kein Termin zu Hause und kein Brief im Kasten helfen jetzt.',
      dialog: 'Mitarbeiterin: Bitte zum ___ drei.\nSie: Danke, ich komme sofort.',
      options: ['Schalter,Termin,Brief'],
      correct: ['Schalter'],
    },
  },
  {
    lemma: 'Wartenummer',
    hint: 'Wortschatz — Ticket mit Reihenfolge beim Betreten des Amtes',
    so: {
      body: 'Sie ziehen eine ___ und setzen sich hin.',
      options: ['Wartenummer', 'Frist', 'Kopie'],
      correct: 'Wartenummer',
    },
    ms: {
      body: 'Was passt zur Wartenummer? Wählen Sie alle richtigen Antworten.',
      options: ['Wartesaal', 'Schalter', 'Wartezeit', 'Formular', 'Antrag'],
      correct: ['Wartesaal', 'Schalter', 'Wartezeit'],
    },
    dd: ['Ich', 'ziehe', 'eine', 'Wartenummer', 'am', 'Eingang', '.'],
    in: {
      wordChoices: ['Wartenummer', 'Termin', 'Frist'],
      correct: ['Wartenummer'],
      body: 'Ergänzen Sie:\n\nAm Eingang holen Sie sich eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Im Bürgeramt ist viel los. An der Maschine neben der Tür bekommen Sie eine Nummer für die Reihe — kein Termin und keine Frist stehen auf dem Zettel.',
      dialog: 'Security: Haben Sie schon eine ___?\nSie: Ja, Nummer 47.',
      options: ['Wartenummer,Termin,Frist'],
      correct: ['Wartenummer'],
    },
  },
  {
    lemma: 'Behörde',
    hint: 'Wortschatz — staatliche Stelle mit Verwaltungsaufgaben',
    so: {
      body: 'Der ___ schickt Ihnen einen Brief mit einer Frist.',
      options: ['Behörde', 'Schalter', 'Wartenummer'],
      correct: 'Behörde',
    },
    ms: {
      body: 'Was macht eine Behörde? Wählen Sie alle richtigen Antworten.',
      options: ['Formulare ausgeben', 'Anträge bearbeiten', 'Termine vergeben', 'Brief', 'Kopie'],
      correct: ['Formulare ausgeben', 'Anträge bearbeiten', 'Termine vergeben'],
    },
    dd: ['Die', 'Behörde', 'schickt', 'mir', 'einen', 'Brief', '.'],
    in: {
      wordChoices: ['Behörde', 'Schalter', 'Amt'],
      correct: ['Behörde'],
      body: 'Ergänzen Sie:\n\nAntworten Sie bitte an die zuständige ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie bekommen Post von einer staatlichen Stelle. Dort bearbeiten Anträge und Formulare — kein Schalter und keine Wartenummer schreiben Ihnen.',
      dialog: 'Berater: Wer hat Ihnen geschrieben?\nSie: Die ___ für Soziales in unserer Stadt.',
      options: ['Behörde,Schalter,Amt'],
      correct: ['Behörde'],
    },
  },
  {
    lemma: 'Amt',
    hint: 'Wortschatz — öffentliche Einrichtung der Verwaltung',
    so: {
      body: 'Das ___ ist montags bis freitags geöffnet.',
      options: ['Amt', 'Brief', 'Termin'],
      correct: 'Amt',
    },
    ms: {
      body: 'Was finden Sie in einem Amt? Wählen Sie alle richtigen Antworten.',
      options: ['Schalter', 'Formulare', 'Sachbearbeiter', 'Antrag', 'Termin'],
      correct: ['Schalter', 'Formulare', 'Sachbearbeiter'],
    },
    dd: ['Das', 'Amt', 'ist', 'heute', 'geöffnet', '.'],
    in: {
      wordChoices: ['Amt', 'Behörde', 'Schalter'],
      correct: ['Amt'],
      body: 'Ergänzen Sie:\n\nUm neun Uhr öffnet das ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie suchen die öffentliche Verwaltung in Ihrer Straße. Dort gibt es Schalter und Formulare — kein Brief zu Hause und kein privater Termin.',
      dialog: 'Passant: Wo ist das ___?\nSie: Gleich um die Ecke, neben dem Bürgeramt.',
      options: ['Amt,Behörde,Schalter'],
      correct: ['Amt'],
    },
  },
  {
    lemma: 'Jobcenter',
    hint: 'Wortschatz — Stelle für Arbeitslose und Jobvermittlung',
    so: {
      body: 'Sie haben einen Termin beim ___.',
      options: ['Jobcenter', 'Bürgeramt', 'Schalter'],
      correct: 'Jobcenter',
    },
    ms: {
      body: 'Was macht man im Jobcenter? Wählen Sie alle richtigen Antworten.',
      options: ['Arbeit suchen', 'Antrag stellen', 'Termin vereinbaren', 'Anmeldung', 'Personalausweis'],
      correct: ['Arbeit suchen', 'Antrag stellen', 'Termin vereinbaren'],
    },
    dd: ['Ich', 'habe', 'einen', 'Termin', 'beim', 'Jobcenter', '.'],
    in: {
      wordChoices: ['Jobcenter', 'Bürgeramt', 'Amt'],
      correct: ['Jobcenter'],
      body: 'Ergänzen Sie:\n\nNächste Woche gehen Sie zum ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind arbeitslos und brauchen Unterstützung bei der Jobsuche. Sie gehen zur Stelle für Arbeit und Anträge — nicht zum Bürgeramt für die Anmeldung.',
      dialog: 'Berater: Waren Sie schon im ___?\nSie: Ja, ich habe dort einen Termin.',
      options: ['Jobcenter,Bürgeramt,Amt'],
      correct: ['Jobcenter'],
    },
  },
];
