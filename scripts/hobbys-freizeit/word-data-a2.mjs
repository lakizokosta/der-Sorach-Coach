/** A2 lemma specs — Hobbys & Freizeit (Sie-Register) */

export const a2Words = [
  {
    lemma: 'Interesse',
    hint: 'Wortschatz — Neugier für ein Thema oder eine Aktivität',
    so: {
      body: 'Für Fotografie habe ich großes ___.',
      options: ['Interesse', 'Langeweile', 'Konzert'],
      correct: 'Interesse',
    },
    ms: {
      body: 'Was kann Interesse zeigen? Wählen Sie alle richtigen Antworten.',
      options: ['Sport', 'lesen', 'Konzert', 'Grillen', 'Yoga'],
      correct: ['Sport', 'lesen', 'Konzert'],
    },
    dd: ['Ich', 'habe', 'großes', 'Interesse', 'an', 'Sport', '.'],
    in: {
      wordChoices: ['Interesse', 'Langeweile', 'Konzert'],
      correct: ['Interesse'],
      body: 'Ergänzen Sie:\n\nFür Wandern habe ich viel ___.',
    },
    tg: {
      story: 'Vorgeschichte: In der Freizeitberatung erzählen Sie von Ihren Hobbys. Sie mögen Fotografie und lesen gern — Langeweile haben Sie selten.',
      dialog: 'Beraterin: Haben Sie ___ an einem Verein?\nSie: Ja, an Fotografie und Sport.',
      options: ['Interesse,Langeweile,Konzert'],
      correct: ['Interesse'],
    },
  },
  {
    lemma: 'trainieren',
    hint: 'Wortschatz — körperlich üben und fit bleiben',
    so: {
      body: 'Im Fitnessstudio ___ Sie dreimal pro Woche.',
      options: ['trainieren', 'entspannen', 'grillen'],
      correct: 'trainieren',
    },
    ms: {
      body: 'Wo können Sie trainieren? Wählen Sie alle richtigen Antworten.',
      options: ['Fitnessstudio', 'Sportverein', 'Park', 'Kino', 'Konzert'],
      correct: ['Fitnessstudio', 'Sportverein', 'Park'],
    },
    dd: ['Im', 'Fitnessstudio', 'trainiere', 'ich', 'regelmäßig', '.'],
    in: {
      wordChoices: ['trainieren', 'entspannen', 'grillen'],
      correct: ['trainieren'],
      body: 'Ergänzen Sie:\n\nDienstags und donnerstags ___ Sie im Verein.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Trainer fragt nach Ihrem Plan. Sie gehen ins Fitnessstudio — Sie grillen nicht und entspannen nicht nur auf dem Sofa.',
      dialog: 'Trainer: Wollen Sie weiter ___?\nSie: Ja, zweimal pro Woche reicht mir.',
      options: ['trainieren,entspannen,grillen'],
      correct: ['trainieren'],
    },
  },
  {
    lemma: 'Konzert',
    hint: 'Wortschatz — am Samstag in der Halle',
    so: {
      body: 'Am Samstag gehen wir auf ein ___.',
      options: ['Konzert', 'Fitnessstudio', 'Freizeitpark'],
      correct: 'Konzert',
    },
    ms: {
      body: 'Was passt zu einem Konzert? Wählen Sie alle richtigen Antworten.',
      options: ['Musik', 'Künstler', 'Publikum', 'Radtour', 'Yoga'],
      correct: ['Musik', 'Künstler', 'Publikum'],
    },
    dd: ['Wir', 'gehen', 'heute', 'auf', 'ein', 'Konzert', '.'],
    in: {
      wordChoices: ['Konzert', 'Fitnessstudio', 'Freizeitpark'],
      correct: ['Konzert'],
      body: 'Ergänzen Sie:\n\nNächste Woche besuchen Sie ein ___ in der Halle.',
    },
    tg: {
      story: 'Vorgeschichte: Ihre Kollegin hat Tickets. Sie hören Live-Musik — kein Training und kein Wandern.',
      dialog: 'Kollegin: Kommen Sie zum ___ mit?\nSie: Gern, ich liebe Live-Musik.',
      options: ['Konzert,Kino,Ausflug'],
      correct: ['Konzert'],
    },
  },
  {
    lemma: 'Kino',
    hint: 'Wortschatz — Filme auf der großen Leinwand',
    so: {
      body: 'Am Freitagabend gehen Sie ins ___.',
      options: ['Kino', 'Fitnessstudio', 'Freizeitpark'],
      correct: 'Kino',
    },
    ms: {
      body: 'Was machen Sie im Kino? Wählen Sie alle richtigen Antworten.',
      options: ['Film sehen', 'Popcorn', 'Freunde treffen', 'trainieren', 'Grillen'],
      correct: ['Film sehen', 'Popcorn', 'Freunde treffen'],
    },
    dd: ['Am', 'Freitag', 'gehen', 'wir', 'ins', 'Kino', '.'],
    in: {
      wordChoices: ['Kino', 'Fitnessstudio', 'Konzert'],
      correct: ['Kino'],
      body: 'Ergänzen Sie:\n\nHeute Abend gehen Sie mit Kollegen ins ___.',
    },
    tg: {
      story: 'Vorgeschichte: Der neue Film läuft. Sie kaufen Tickets — Sie trainieren heute nicht und gehen nicht wandern.',
      dialog: 'Freund: Gehen wir ins ___?\nSie: Ja, der Film beginnt um acht.',
      options: ['Kino,Konzert,Fitnessstudio'],
      correct: ['Kino'],
    },
  },
  {
    lemma: 'wandern',
    hint: 'Wortschatz — zu Fuß in der Natur unterwegs sein',
    so: {
      body: 'Am Wochenende ___ Sie gern in den Bergen.',
      options: ['wandern', 'grillen', 'entspannen'],
      correct: 'wandern',
    },
    ms: {
      body: 'Was brauchen Sie zum Wandern? Wählen Sie alle richtigen Antworten.',
      options: ['Wanderschuhe', 'Rucksack', 'Wasser', 'Klavier', 'Computer'],
      correct: ['Wanderschuhe', 'Rucksack', 'Wasser'],
    },
    dd: ['Am', 'Sonntag', 'wandern', 'wir', 'im', 'Wald', '.'],
    in: {
      wordChoices: ['wandern', 'grillen', 'entspannen'],
      correct: ['wandern'],
      body: 'Ergänzen Sie:\n\nIm Herbst ___ Sie oft mit dem Verein.',
    },
    tg: {
      story: 'Vorgeschichte: Das Wetter ist klar. Sie packen Rucksäcke und gehen zu Fuß — Sie grillen nicht zu Hause.',
      dialog: 'Guide: Wollen Sie heute ___?\nSie: Ja, fünf Kilometer sind perfekt.',
      options: ['wandern,grillen,entspannen'],
      correct: ['wandern'],
    },
  },
  {
    lemma: 'Fotografie',
    hint: 'Wortschatz — hobbyhaft festhalten',
    so: {
      body: 'Seit zwei Jahren ist ___ Ihr Hobby.',
      options: ['Fotografie', 'Langeweile', 'Mannschaftssport'],
      correct: 'Fotografie',
    },
    ms: {
      body: 'Was gehört zur Fotografie? Wählen Sie alle richtigen Antworten.',
      options: ['Kamera', 'Landschaft', 'Licht', 'Konzert', 'Yoga'],
      correct: ['Kamera', 'Landschaft', 'Licht'],
    },
    dd: ['Meine', 'Leidenschaft', 'ist', 'Fotografie', '.'],
    in: {
      wordChoices: ['Fotografie', 'Langeweile', 'Grillen'],
      correct: ['Fotografie'],
      body: 'Ergänzen Sie:\n\nAm Wochenende machen Sie ___ in der Stadt.',
    },
    tg: {
      story: 'Vorgeschichte: Sie zeigen Fotos auf dem Handy. Sie fotografieren Landschaften — kein Mannschaftssport und keine Langeweile.',
      dialog: 'Freundin: Ist ___ Ihr Hobby?\nSie: Ja, ich gehe oft raus mit der Kamera.',
      options: ['Fotografie,Langeweile,Mannschaftssport'],
      correct: ['Fotografie'],
    },
  },
  {
    lemma: 'Fitnessstudio',
    hint: 'Wortschatz — Ort zum Trainieren mit Geräten',
    so: {
      body: 'Sie gehen dreimal pro Woche ins ___.',
      options: ['Fitnessstudio', 'Kino', 'Konzert'],
      correct: 'Fitnessstudio',
    },
    ms: {
      body: 'Was finden Sie im Fitnessstudio? Wählen Sie alle richtigen Antworten.',
      options: ['Geräte', 'Trainer', 'Yoga-Kurs', 'Popcorn', 'Klavier'],
      correct: ['Geräte', 'Trainer', 'Yoga-Kurs'],
    },
    dd: ['Ich', 'gehe', 'ins', 'Fitnessstudio', '.'],
    in: {
      wordChoices: ['Fitnessstudio', 'Kino', 'Freizeitpark'],
      correct: ['Fitnessstudio'],
      body: 'Ergänzen Sie:\n\nMontags und mittwochs besuchen Sie das ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben eine Mitgliedschaft. Sie trainieren mit Geräten — Sie gehen nicht ins Kino und nicht auf ein Konzert.',
      dialog: 'Trainer: Kommen Sie ins ___?\nSie: Ja, ich bin dienstags immer da.',
      options: ['Fitnessstudio,Kino,Konzert'],
      correct: ['Fitnessstudio'],
    },
  },
  {
    lemma: 'Klavier',
    hint: 'Wortschatz — großes Tasteninstrument',
    so: {
      body: 'Seit Kindheit spielen Sie ___.',
      options: ['Klavier', 'Volleyball', 'Fußball'],
      correct: 'Klavier',
    },
    ms: {
      body: 'Was passt zum Klavierspiel? Wählen Sie alle richtigen Antworten.',
      options: ['üben', 'Noten', 'Musik', 'Radtour', 'Grillen'],
      correct: ['üben', 'Noten', 'Musik'],
    },
    dd: ['Ich', 'spiele', 'jeden', 'Tag', 'Klavier', '.'],
    in: {
      wordChoices: ['Klavier', 'Konzert', 'Yoga'],
      correct: ['Klavier'],
      body: 'Ergänzen Sie:\n\nAbends üben Sie eine Stunde ___.',
    },
    tg: {
      story: 'Vorgeschichte: In der Wohnung steht ein Instrument. Sie üben ein Stück — kein Sport und kein Grillen.',
      dialog: 'Nachbar: Spielen Sie ___?\nSie: Ja, seit zehn Jahren.',
      options: ['Klavier,Volleyball,Grillen'],
      correct: ['Klavier'],
    },
  },
  {
    lemma: 'Computer spielen',
    hint: 'Wortschatz — digitale Spiele am PC',
    so: {
      body: 'Am Abend ___ Sie gern am Computer mit Freunden.',
      options: ['spielen', 'wandern', 'grillen'],
      correct: 'spielen',
    },
    ms: {
      body: 'Was brauchen Sie zum Computer spielen? Wählen Sie alle richtigen Antworten.',
      options: ['Computer', 'Internet', 'Freunde', 'Wanderschuhe', 'Grill'],
      correct: ['Computer', 'Internet', 'Freunde'],
    },
    dd: ['Am', 'Abend', 'spielen', 'wir', 'Computer', '.'],
    in: {
      wordChoices: ['spielen', 'wandern', 'grillen'],
      correct: ['spielen'],
      body: 'Ergänzen Sie:\n\nSamstags ___ Sie gern online mit Ihrem Team.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Freund ruft an. Sie spielen online zusammen — Sie wandern nicht und grillen nicht.',
      dialog: 'Freund: Wollen Sie heute ___?\nSie: Klar, ich bin in zehn Minuten online.',
      options: ['Computer spielen,wandern,grillen'],
      correct: ['Computer spielen'],
    },
  },
  {
    lemma: 'Ausflug',
    hint: 'Wortschatz — kurze Reise oder Trip am Tag',
    so: {
      body: 'Am Sonntag machen wir einen ___ an den See.',
      options: ['Ausflug', 'Konzert', 'Training'],
      correct: 'Ausflug',
    },
    ms: {
      body: 'Was passt zu einem Ausflug? Wählen Sie alle richtigen Antworten.',
      options: ['Picknick', 'Radtour', 'Wandern', 'Klavier', 'Langeweile'],
      correct: ['Picknick', 'Radtour', 'Wandern'],
    },
    dd: ['Wir', 'machen', 'einen', 'Ausflug', 'ans', 'Meer', '.'],
    in: {
      wordChoices: ['Ausflug', 'Konzert', 'Langeweile'],
      correct: ['Ausflug'],
      body: 'Ergänzen Sie:\n\nNächsten Samstag planen Sie einen ___ in die Berge.',
    },
    tg: {
      story: 'Vorgeschichte: Das Wetter ist schön. Sie fahren mit Freunden raus — kein Konzert und kein Training im Studio.',
      dialog: 'Kollege: Machen wir einen ___?\nSie: Gern, ich packe schon den Rucksack.',
      options: ['Ausflug,Konzert,Training'],
      correct: ['Ausflug'],
    },
  },
  {
    lemma: 'entspannen',
    hint: 'Wortschatz — zur Ruhe kommen und abschalten',
    so: {
      body: 'Nach der Arbeit ___ Sie gern mit Yoga.',
      options: ['entspannen', 'trainieren', 'grillen'],
      correct: 'entspannen',
    },
    ms: {
      body: 'Wie können Sie sich entspannen? Wählen Sie alle richtigen Antworten.',
      options: ['Yoga', 'lesen', 'Musik hören', 'Wettkampf', 'Turnier'],
      correct: ['Yoga', 'lesen', 'Musik hören'],
    },
    dd: ['Nach', 'der', 'Arbeit', 'entspanne', 'ich', 'mich', '.'],
    in: {
      wordChoices: ['entspannen', 'trainieren', 'grillen'],
      correct: ['entspannen'],
      body: 'Ergänzen Sie:\n\nAm Abend ___ Sie sich mit einem Buch.',
    },
    tg: {
      story: 'Vorgeschichte: Der Tag war stressig. Sie machen Yoga und lesen — Sie grillen nicht und trainieren nicht intensiv.',
      dialog: 'Partner: Wollen Sie sich ___?\nSie: Ja, ich mache jetzt Yoga.',
      options: ['entspannen,trainieren,grillen'],
      correct: ['entspannen'],
    },
  },
  {
    lemma: 'Mannschaftssport',
    hint: 'Wortschatz — Sport mit Team und Mitspielern',
    so: {
      body: 'Fußball ist ein beliebter ___.',
      options: ['Mannschaftssport', 'Konzert', 'Ausflug'],
      correct: 'Mannschaftssport',
    },
    ms: {
      body: 'Was ist Mannschaftssport? Wählen Sie alle richtigen Antworten.',
      options: ['Fußball', 'Volleyball', 'Handball', 'Fotografie', 'lesen'],
      correct: ['Fußball', 'Volleyball', 'Handball'],
    },
    dd: ['Fußball', 'ist', 'ein', 'Mannschaftssport', '.'],
    in: {
      wordChoices: ['Mannschaftssport', 'Konzert', 'Langeweile'],
      correct: ['Mannschaftssport'],
      body: 'Ergänzen Sie:\n\nIm Verein betreiben Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: Im Sportverein spielen Sie mit anderen zusammen — kein Solo-Hobby wie Fotografie allein.',
      dialog: 'Trainer: Mögen Sie ___?\nSie: Ja, ich spiele gern im Team.',
      options: ['Mannschaftssport,Fotografie,Langeweile'],
      correct: ['Mannschaftssport'],
    },
  },
  {
    lemma: 'Yoga',
    hint: 'Wortschatz — Kurs im Studio',
    so: {
      body: 'Montags machen Sie ___ im Studio.',
      options: ['Yoga', 'Grillen', 'Konzert'],
      correct: 'Yoga',
    },
    ms: {
      body: 'Was passt zu Yoga? Wählen Sie alle richtigen Antworten.',
      options: ['Matte', 'Entspannung', 'Atmung', 'Popcorn', 'Radtour'],
      correct: ['Matte', 'Entspannung', 'Atmung'],
    },
    dd: ['Montags', 'mache', 'ich', 'Yoga', '.'],
    in: {
      wordChoices: ['Yoga', 'Grillen', 'Konzert'],
      correct: ['Yoga'],
      body: 'Ergänzen Sie:\n\nNach der Arbeit machen Sie ___ zur Entspannung.',
    },
    tg: {
      story: 'Vorgeschichte: Sie brauchen Ruhe nach der Arbeit. Sie machen Übungen auf der Matte — kein Grillen und kein Konzert.',
      dialog: 'Kursleiterin: Kommen Sie zum ___?\nSie: Ja, das hilft mir sehr.',
      options: ['Yoga,Grillen,Konzert'],
      correct: ['Yoga'],
    },
  },
  {
    lemma: 'lesen',
    hint: 'Wortschatz — Bücher und Texte verstehen',
    so: {
      body: 'Abends ___ Sie gern Krimis.',
      options: ['lesen', 'trainieren', 'grillen'],
      correct: 'lesen',
    },
    ms: {
      body: 'Was können Sie lesen? Wählen Sie alle richtigen Antworten.',
      options: ['Roman', 'Zeitung', 'Magazin', 'Grill', 'Fitnessstudio'],
      correct: ['Roman', 'Zeitung', 'Magazin'],
    },
    dd: ['Abends', 'lese', 'ich', 'gern', 'Romane', '.'],
    in: {
      wordChoices: ['lesen', 'trainieren', 'grillen'],
      correct: ['lesen'],
      body: 'Ergänzen Sie:\n\nIm Urlaub ___ Sie gern am Strand.',
    },
    tg: {
      story: 'Vorgeschichte: Es regnet. Sie sitzen mit einem Buch auf dem Sofa — Sie trainieren nicht und grillen nicht.',
      dialog: 'Partner: Haben Sie Zeit zum ___?\nSie: Ja, der Krimi ist spannend.',
      options: ['Lesen,Trainieren,Grillen'],
      correct: ['Lesen'],
    },
  },
  {
    lemma: 'zeichnen',
    hint: 'Wortschatz — in der Freizeit',
    so: {
      body: 'In der Freizeit ___ Sie gern Landschaften.',
      options: ['zeichnen', 'trainieren', 'grillen'],
      correct: 'zeichnen',
    },
    ms: {
      body: 'Was brauchen Sie zum Zeichnen? Wählen Sie alle richtigen Antworten.',
      options: ['Stift', 'Papier', 'Radiergummi', 'Grill', 'Volleyball'],
      correct: ['Stift', 'Papier', 'Radiergummi'],
    },
    dd: ['Ich', 'zeichne', 'gern', 'Landschaften', '.'],
    in: {
      wordChoices: ['zeichnen', 'trainieren', 'grillen'],
      correct: ['zeichnen'],
      body: 'Ergänzen Sie:\n\nAm Sonntag ___ Sie Porträts von Freunden.',
    },
    tg: {
      story: 'Vorgeschichte: Am Tisch liegen Stifte und Papier. Sie machen Skizzen — kein Sport und kein Grillen.',
      dialog: 'Freundin: ___ Sie oft?\nSie: Ja, besonders am Wochenende.',
      options: ['Zeichnen,Trainieren,Grillen'],
      correct: ['Zeichnen'],
    },
  },
  {
    lemma: 'Vereinsmitglied',
    hint: 'Wortschatz — Person in einem Sport- oder Hobbyverein',
    so: {
      body: 'Seit Januar sind Sie ___ im Tennisverein.',
      options: ['Vereinsmitglied', 'Langeweile', 'Konzert'],
      correct: 'Vereinsmitglied',
    },
    ms: {
      body: 'Was gehört zum Vereinsmitglied? Wählen Sie alle richtigen Antworten.',
      options: ['Training', 'Team', 'Beitrag', 'Popcorn', 'Kino'],
      correct: ['Training', 'Team', 'Beitrag'],
    },
    dd: ['Ich', 'bin', 'Vereinsmitglied', 'im', 'Tennisverein', '.'],
    in: {
      wordChoices: ['Vereinsmitglied', 'Langeweile', 'Konzert'],
      correct: ['Vereinsmitglied'],
      body: 'Ergänzen Sie:\n\nAls ___ nehmen Sie an allen Trainingsteil.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben sich angemeldet und zahlen Beitrag. Sie trainieren im Verein — Sie sind kein Konzertgast.',
      dialog: 'Trainer: Willkommen als ___!\nSie: Danke, ich freue mich auf das Team.',
      options: ['Vereinsmitglied,Konzertbesucher,Langeweile'],
      correct: ['Vereinsmitglied'],
    },
  },
  {
    lemma: 'Freizeitpark',
    hint: 'Wortschatz — Ort mit Fahrgeschäften und Attraktionen',
    so: {
      body: 'Mit den Kindern besuchen Sie den ___.',
      options: ['Freizeitpark', 'Fitnessstudio', 'Konzert'],
      correct: 'Freizeitpark',
    },
    ms: {
      body: 'Was finden Sie im Freizeitpark? Wählen Sie alle richtigen Antworten.',
      options: ['Achterbahn', 'Spaß', 'Essen', 'Yoga-Kurs', 'Klavier'],
      correct: ['Achterbahn', 'Spaß', 'Essen'],
    },
    dd: ['Wir', 'besuchen', 'den', 'Freizeitpark', '.'],
    in: {
      wordChoices: ['Freizeitpark', 'Fitnessstudio', 'Konzert'],
      correct: ['Freizeitpark'],
      body: 'Ergänzen Sie:\n\nAm Samstag fahren Sie in den ___.',
    },
    tg: {
      story: 'Vorgeschichte: Die Familie plant einen Tag voller Attraktionen. Sie fahren Achterbahn — kein Training und kein Konzert.',
      dialog: 'Kind: Gehen wir in den ___?\nSie: Ja, wir nehmen genug Zeit mit.',
      options: ['Freizeitpark,Fitnessstudio,Konzert'],
      correct: ['Freizeitpark'],
    },
  },
  {
    lemma: 'Grillen',
    hint: 'Wortschatz — im Sommer im Garten',
    so: {
      body: 'Im Sommer ___ Sie gern mit Nachbarn.',
      options: ['grillen', 'trainieren', 'wandern'],
      correct: 'grillen',
    },
    ms: {
      body: 'Was brauchen Sie zum Grillen? Wählen Sie alle richtigen Antworten.',
      options: ['Grill', 'Fleisch', 'Gemüse', 'Klavier', 'Yoga-Matte'],
      correct: ['Grill', 'Fleisch', 'Gemüse'],
    },
    dd: ['Im', 'Sommer', 'grillen', 'wir', 'im', 'Garten', '.'],
    in: {
      wordChoices: ['grillen', 'trainieren', 'wandern'],
      correct: ['grillen'],
      body: 'Ergänzen Sie:\n\nAm Sonntag ___ Sie mit Freunden im Park.',
    },
    tg: {
      story: 'Vorgeschichte: Die Sonne scheint. Sie laden Freunde ein und der Grill ist heiß — kein Wandern und kein Training.',
      dialog: 'Nachbar: Wollen wir ___?\nSie: Gern, ich bringe Salat mit.',
      options: ['Grillen,Wandern,Trainieren'],
      correct: ['Grillen'],
    },
  },
  {
    lemma: 'Radtour',
    hint: 'Wortschatz — längere Tour am Sonntag',
    so: {
      body: 'Am Sonntag machen Sie eine ___ ans Meer.',
      options: ['Radtour', 'Langeweile', 'Konzert'],
      correct: 'Radtour',
    },
    ms: {
      body: 'Was brauchen Sie für eine Radtour? Wählen Sie alle richtigen Antworten.',
      options: ['Fahrrad', 'Helm', 'Wasser', 'Klavier', 'Popcorn'],
      correct: ['Fahrrad', 'Helm', 'Wasser'],
    },
    dd: ['Am', 'Sonntag', 'machen', 'wir', 'eine', 'Radtour', '.'],
    in: {
      wordChoices: ['Radtour', 'Langeweile', 'Konzert'],
      correct: ['Radtour'],
      body: 'Ergänzen Sie:\n\nMit Freunden planen Sie eine ___ durch den Wald.',
    },
    tg: {
      story: 'Vorgeschichte: Das Wetter ist perfekt. Sie fahren mit dem Rad los — keine Langeweile und kein Konzert.',
      dialog: 'Freund: Machen wir eine ___?\nSie: Ja, bis zum See sind es dreißig Kilometer.',
      options: ['Radtour,Langeweile,Konzert'],
      correct: ['Radtour'],
    },
  },
  {
    lemma: 'Langeweile',
    hint: 'Wortschatz — wenn nichts Interessantes passiert',
    so: {
      body: 'Ohne Hobby haben Sie oft ___.',
      options: ['Langeweile', 'Interesse', 'Spaß'],
      correct: 'Langeweile',
    },
    ms: {
      body: 'Was hilft gegen Langeweile? Wählen Sie alle richtigen Antworten.',
      options: ['Sport', 'lesen', 'Ausflug', 'nichts tun', 'schlafen den ganzen Tag'],
      correct: ['Sport', 'lesen', 'Ausflug'],
    },
    dd: ['Ohne', 'Hobby', 'habe', 'ich', 'Langeweile', '.'],
    in: {
      wordChoices: ['Langeweile', 'Interesse', 'Spaß'],
      correct: ['Langeweile'],
      body: 'Ergänzen Sie:\n\nAm regnerischen Sonntag haben Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sitzen zu Hause ohne Plan. Nichts ist los — kein Sport und kein Ausflug geplant.',
      dialog: 'Freund: Haben Sie ___?\nSie: Ja, deshalb suche ich ein neues Hobby.',
      options: ['Langeweile,Interesse,Spaß'],
      correct: ['Langeweile'],
    },
  },
];
