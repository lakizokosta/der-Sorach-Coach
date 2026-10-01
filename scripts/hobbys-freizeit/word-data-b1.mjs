/** B1 lemma specs — Hobbys & Freizeit (Sie-Register) */

export const b1Words = [
  {
    lemma: 'Leidenschaft',
    hint: 'Wortschatz — starke Begeisterung für ein Hobby',
    so: {
      body: 'Für Fotografie empfinden Sie echte ___.',
      options: ['Leidenschaft', 'Langeweile', 'Mitgliedschaft'],
      correct: 'Leidenschaft',
    },
    ms: {
      body: 'Was kann eine Leidenschaft sein? Wählen Sie alle richtigen Antworten.',
      options: ['Theater', 'Klettern', 'Musik', 'Kreativität', 'Erholung'],
      correct: ['Theater', 'Klettern', 'Musik'],
    },
    dd: ['Meine', 'Leidenschaft', 'ist', 'Theater', '.'],
    in: {
      wordChoices: ['Leidenschaft', 'Langeweile', 'Mitgliedschaft'],
      correct: ['Leidenschaft'],
      body: 'Ergänzen Sie:\n\nSeit Jahren verfolgen Sie Ihre ___ für Volleyball.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sprechen im Vereinsgespräch über Ihre Motivation. Theater und Klettern begeistern Sie — Langeweile kennen Sie nicht.',
      dialog: 'Trainer: Was treibt Sie an?\nSie: Meine ___ für den Sport.',
      options: ['Leidenschaft,Langeweile,Mitgliedschaft'],
      correct: ['Leidenschaft'],
    },
  },
  {
    lemma: 'ausüben',
    hint: 'Wortschatz — ein Hobby oder Sport regelmäßig betreiben',
    so: {
      body: 'Im Verein ___ Sie Volleyball aus.',
      options: ['üben', 'basteln', 'joggen'],
      correct: 'üben',
    },
    ms: {
      body: 'Was kann man ausüben? Wählen Sie alle richtigen Antworten.',
      options: ['Yoga', 'Klettern', 'Chor', 'Theater', 'Turnier'],
      correct: ['Yoga', 'Klettern', 'Chor'],
    },
    dd: ['Im', 'Verein', 'übe', 'ich', 'Yoga', 'aus', '.'],
    in: {
      wordChoices: ['ausüben', 'basteln', 'joggen'],
      correct: ['ausüben'],
      body: 'Ergänzen Sie:\n\nSeit drei Jahren ___ Sie ehrenamtlich im Chor.',
    },
    tg: {
      story: 'Vorgeschichte: Der Trainer fragt nach Ihrer Routine. Sie trainieren regelmäßig Yoga — Sie basteln nicht nur und joggen nicht nur sporadisch ohne Plan.',
      dialog: 'Berater: Welchen Sport ___ Sie?\nSie: Volleyball, zweimal wöchentlich.',
      options: ['üben,basteln,schlafen'],
      correct: ['üben'],
    },
  },
  {
    lemma: 'Mitgliedschaft',
    hint: 'Wortschatz — Zugehörigkeit zu einem Verein',
    so: {
      body: 'Für die ___ im Sportverein zahlen Sie einen Beitrag.',
      options: ['Mitgliedschaft', 'Auszeit', 'Unternehmung'],
      correct: 'Mitgliedschaft',
    },
    ms: {
      body: 'Was gehört zur Mitgliedschaft? Wählen Sie alle richtigen Antworten.',
      options: ['Beitrag', 'Training', 'Vereinsausweis', 'Turnier', 'Theater'],
      correct: ['Beitrag', 'Training', 'Vereinsausweis'],
    },
    dd: ['Die', 'Mitgliedschaft', 'kostet', 'fünfzig', 'Euro', 'im', 'Jahr', '.'],
    in: {
      wordChoices: ['Mitgliedschaft', 'Auszeit', 'Langeweile'],
      correct: ['Mitgliedschaft'],
      body: 'Ergänzen Sie:\n\nIhre ___ im Chor beginnt im Januar.',
    },
    tg: {
      story: 'Vorgeschichte: Am Empfang des Vereins unterschreiben Sie einen Vertrag und zahlen Beitrag — keine Auszeit und kein spontanes Turnier.',
      dialog: 'Mitarbeiter: Möchten Sie die ___ verlängern?\nSie: Ja, gern für ein weiteres Jahr.',
      options: ['Mitgliedschaft,Auszeit,Unternehmung'],
      correct: ['Mitgliedschaft'],
    },
  },
  {
    lemma: 'Engagement',
    hint: 'Wortschatz — aktiver Einsatz in Verein oder Hobby',
    so: {
      body: 'Ihr ___ im Chor ist vorbildlich.',
      options: ['Engagement', 'Langeweile', 'Auszeit'],
      correct: 'Engagement',
    },
    ms: {
      body: 'Was zeigt Engagement? Wählen Sie alle richtigen Antworten.',
      options: ['ehrenamtlich helfen', 'regelmäßig üben', 'Veranstaltungen organisieren', 'nichts tun', 'absagen'],
      correct: ['ehrenamtlich helfen', 'regelmäßig üben', 'Veranstaltungen organisieren'],
    },
    dd: ['Ihr', 'Engagement', 'im', 'Verein', 'ist', 'groß', '.'],
    in: {
      wordChoices: ['Engagement', 'Langeweile', 'Auszeit'],
      correct: ['Engagement'],
      body: 'Ergänzen Sie:\n\nOhne Ihr ___ gäbe es kein Sommerfest.',
    },
    tg: {
      story: 'Vorgeschichte: Sie helfen beim Turnier und üben extra — Sie nehmen keine Auszeit und zeigen keine Langeweile.',
      dialog: 'Vorsitzender: Danke für Ihr ___!\nSie: Gern, der Verein ist mir wichtig.',
      options: ['Engagement,Langeweile,Auszeit'],
      correct: ['Engagement'],
    },
  },
  {
    lemma: 'Auszeit',
    hint: 'Wortschatz — bewusste Pause vom Alltag',
    so: {
      body: 'Nach dem Stress brauchen Sie eine ___.',
      options: ['Auszeit', 'Mitgliedschaft', 'Turnier'],
      correct: 'Auszeit',
    },
    ms: {
      body: 'Was passt zu einer Auszeit? Wählen Sie alle richtigen Antworten.',
      options: ['Erholung', 'Wandern', 'Spa', 'Wettkampf', 'Training'],
      correct: ['Erholung', 'Wandern', 'Spa'],
    },
    dd: ['Ich', 'brauche', 'eine', 'Auszeit', 'vom', 'Job', '.'],
    in: {
      wordChoices: ['Auszeit', 'Turnier', 'Engagement'],
      correct: ['Auszeit'],
      body: 'Ergänzen Sie:\n\nAm Wochenende nehmen Sie sich eine ___ in der Natur.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind erschöpft und fahren ans Meer. Sie wollen Erholung — kein Turnier und kein hartes Training.',
      dialog: 'Kollege: Brauchen Sie eine ___?\nSie: Ja, nur ein Wochenende reicht.',
      options: ['Auszeit,Turnier,Training'],
      correct: ['Auszeit'],
    },
  },
  {
    lemma: 'Erholung',
    hint: 'Wortschatz — Kraft tanken nach Anstrengung',
    so: {
      body: 'Nach dem Marathon brauchen Sie ___.',
      options: ['Erholung', 'Turnier', 'Engagement'],
      correct: 'Erholung',
    },
    ms: {
      body: 'Was fördert Erholung? Wählen Sie alle richtigen Antworten.',
      options: ['schlafen', 'Spazieren', 'Yoga', 'Wettkampf', 'Chorprobe'],
      correct: ['schlafen', 'Spazieren', 'Yoga'],
    },
    dd: ['Nach', 'dem', 'Sport', 'brauche', 'ich', 'Erholung', '.'],
    in: {
      wordChoices: ['Erholung', 'Turnier', 'Engagement'],
      correct: ['Erholung'],
      body: 'Ergänzen Sie:\n\nAm Sonntag gönnen Sie sich pure ___.',
    },
    tg: {
      story: 'Vorgeschichte: Das Training war hart. Sie ruhen sich aus und machen leichtes Yoga — kein neues Turnier und kein Chor.',
      dialog: 'Physio: Planen Sie ___ ein.\nSie: Ja, zwei Ruhetage helfen mir.',
      options: ['Erholung,Turnier,Engagement'],
      correct: ['Erholung'],
    },
  },
  {
    lemma: 'Kreativität',
    hint: 'Wortschatz — beim Basteln wichtig',
    so: {
      body: 'Beim Basteln zeigen Sie viel ___.',
      options: ['Kreativität', 'Langeweile', 'Mitgliedschaft'],
      correct: 'Kreativität',
    },
    ms: {
      body: 'Was braucht Kreativität? Wählen Sie alle richtigen Antworten.',
      options: ['Ideen', 'Material', 'Zeit', 'Turnier', 'Beitrag'],
      correct: ['Ideen', 'Material', 'Zeit'],
    },
    dd: ['Beim', 'Basteln', 'brauche', 'ich', 'Kreativität', '.'],
    in: {
      wordChoices: ['Kreativität', 'Langeweile', 'Turnier'],
      correct: ['Kreativität'],
      body: 'Ergänzen Sie:\n\nIm Workshop fördern Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Im Kurs entstehen bunte Projekte. Sie basteln originelle Dinge — keine Langeweile und kein Turnier.',
      dialog: 'Lehrerin: Woher kommt Ihre ___?\nSie: Ich probiere gern Neues aus.',
      options: ['Kreativität,Langeweile,Turnier'],
      correct: ['Kreativität'],
    },
  },
  {
    lemma: 'Theater',
    hint: 'Wortschatz — Bühnenkunst mit Schauspielern',
    so: {
      body: 'Am Samstag besuchen Sie das ___.',
      options: ['Theater', 'Turnier', 'Fitnessstudio'],
      correct: 'Theater',
    },
    ms: {
      body: 'Was finden Sie im Theater? Wählen Sie alle richtigen Antworten.',
      options: ['Schauspieler', 'Premiere', 'Pause', 'Volleyball', 'Joggen'],
      correct: ['Schauspieler', 'Premiere', 'Pause'],
    },
    dd: ['Am', 'Samstag', 'gehen', 'wir', 'ins', 'Theater', '.'],
    in: {
      wordChoices: ['Theater', 'Turnier', 'Chor'],
      correct: ['Theater'],
      body: 'Ergänzen Sie:\n\nNächste Woche sehen Sie ein Stück im ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben Karten für eine Premiere. Schauspieler stehen auf der Bühne — kein Volleyball und kein Turnier.',
      dialog: 'Freund: Gehen wir ins ___?\nSie: Ja, das Stück bekommt gute Kritiken.',
      options: ['Theater,Turnier,Volleyball'],
      correct: ['Theater'],
    },
  },
  {
    lemma: 'Volleyball',
    hint: 'Wortschatz — im Verein auf dem Platz',
    so: {
      body: 'Im Verein spielen Sie ___.',
      options: ['Volleyball', 'Theater', 'Basteln'],
      correct: 'Volleyball',
    },
    ms: {
      body: 'Was brauchen Sie für Volleyball? Wählen Sie alle richtigen Antworten.',
      options: ['Netz', 'Ball', 'Team', 'Pinsel', 'Klavier'],
      correct: ['Netz', 'Ball', 'Team'],
    },
    dd: ['Im', 'Verein', 'spielen', 'wir', 'Volleyball', '.'],
    in: {
      wordChoices: ['Volleyball', 'Theater', 'Basteln'],
      correct: ['Volleyball'],
      body: 'Ergänzen Sie:\n\nDienstags trainieren Sie ___.',
    },
    tg: {
      story: 'Vorgeschichte: In der Halle steht ein Netz. Ihr Team trainiert — kein Theater und kein Basteln.',
      dialog: 'Trainer: Heute wieder ___?\nSie: Ja, wir wollen fürs Turnier üben.',
      options: ['Volleyball,Theater,Basteln'],
      correct: ['Volleyball'],
    },
  },
  {
    lemma: 'Joggen',
    hint: 'Wortschatz — regelmäßig laufen zur Fitness',
    so: {
      body: 'Morgens ___ Sie eine Runde im Park.',
      options: ['joggen', 'basteln', 'klettern'],
      correct: 'joggen',
    },
    ms: {
      body: 'Was passt zum Joggen? Wählen Sie alle richtigen Antworten.',
      options: ['Laufschuhe', 'Park', 'Frühling', 'Theater', 'Chor'],
      correct: ['Laufschuhe', 'Park', 'Frühling'],
    },
    dd: ['Morgens', 'jogge', 'ich', 'im', 'Park', '.'],
    in: {
      wordChoices: ['joggen', 'basteln', 'klettern'],
      correct: ['joggen'],
      body: 'Ergänzen Sie:\n\nVor der Arbeit ___ Sie drei Kilometer.',
    },
    tg: {
      story: 'Vorgeschichte: Der Wecker klingelt früh. Sie ziehen Laufschuhe an — Sie basteln nicht und gehen nicht klettern.',
      dialog: 'Partner: ___ Sie heute?\nSie: Ja, das Wetter ist ideal.',
      options: ['Joggen,Basteln,Klettern'],
      correct: ['Joggen'],
    },
  },
  {
    lemma: 'Klettern',
    hint: 'Wortschatz — an Felsen oder Wänden hochsteigen',
    so: {
      body: 'Am Wochenende ___ Sie in der Kletterhalle.',
      options: ['klettern', 'joggen', 'basteln'],
      correct: 'klettern',
    },
    ms: {
      body: 'Was brauchen Sie zum Klettern? Wählen Sie alle richtigen Antworten.',
      options: ['Seil', 'Gurt', 'Kletterwand', 'Popcorn', 'Theaterkarte'],
      correct: ['Seil', 'Gurt', 'Kletterwand'],
    },
    dd: ['Am', 'Wochenende', 'klettere', 'ich', 'in', 'der', 'Halle', '.'],
    in: {
      wordChoices: ['klettern', 'joggen', 'basteln'],
      correct: ['klettern'],
      body: 'Ergänzen Sie:\n\nMit Freunden ___ Sie an Felsen in den Alpen.',
    },
    tg: {
      story: 'Vorgeschichte: Sie schnallen Gurt und Seil an. Die Wand ist hoch — kein Joggen im Park und kein Basteln.',
      dialog: 'Guide: Wollen Sie heute ___?\nSie: Ja, die Route ist neu für mich.',
      options: ['klettern,joggen,basteln'],
      correct: ['klettern'],
    },
  },
  {
    lemma: 'Basteln',
    hint: 'Wortschatz — mit Material kreative Dinge herstellen',
    so: {
      body: 'Mit den Kindern ___ Sie am Nachmittag.',
      options: ['basteln', 'joggen', 'klettern'],
      correct: 'basteln',
    },
    ms: {
      body: 'Was brauchen Sie zum Basteln? Wählen Sie alle richtigen Antworten.',
      options: ['Papier', 'Schere', 'Kleber', 'Volleyball', 'Laufschuhe'],
      correct: ['Papier', 'Schere', 'Kleber'],
    },
    dd: ['Am', 'Nachmittag', 'basteln', 'wir', 'gern', '.'],
    in: {
      wordChoices: ['basteln', 'joggen', 'klettern'],
      correct: ['basteln'],
      body: 'Ergänzen Sie:\n\nIm Workshop ___ Sie Lampen aus Holz.',
    },
    tg: {
      story: 'Vorgeschichte: Auf dem Tisch liegen Papier und Kleber. Sie machen Dekoration — kein Sport und kein Klettern.',
      dialog: 'Lehrer: ___ Sie oft?\nSie: Ja, besonders mit Recycling-Material.',
      options: ['Basteln,Joggen,Klettern'],
      correct: ['Basteln'],
    },
  },
  {
    lemma: 'ehrenamtlich',
    hint: 'Wortschatz — ohne Bezahlung für die Gemeinschaft arbeiten',
    so: {
      body: 'Im Verein engagieren Sie sich ___.',
      options: ['ehrenamtlich', 'professionell', 'langweilig'],
      correct: 'ehrenamtlich',
    },
    ms: {
      body: 'Was kann ehrenamtlich sein? Wählen Sie alle richtigen Antworten.',
      options: ['Trainer helfen', 'Fest organisieren', 'Chor leiten', 'Gehalt', 'Sponsoring'],
      correct: ['Trainer helfen', 'Fest organisieren', 'Chor leiten'],
    },
    dd: ['Im', 'Verein', 'helfe', 'ich', 'ehrenamtlich', '.'],
    in: {
      wordChoices: ['ehrenamtlich', 'professionell', 'langweilig'],
      correct: ['ehrenamtlich'],
      body: 'Ergänzen Sie:\n\nSeit fünf Jahren arbeiten Sie ___ im Jugendchor.',
    },
    tg: {
      story: 'Vorgeschichte: Sie organisieren das Vereinsfest ohne Geld zu bekommen. Das ist freiwillig — kein Profijob.',
      dialog: 'Vorsitzender: Machen Sie das ___?\nSie: Ja, der Verein liegt mir am Herzen.',
      options: ['ehrenamtlich,professionell,bezahlt'],
      correct: ['ehrenamtlich'],
    },
  },
  {
    lemma: 'Work-Life-Balance',
    hint: 'Wortschatz — Balance zwischen Job und Freizeit',
    so: {
      body: 'Sport hilft Ihnen bei der ___.',
      options: ['Work-Life-Balance', 'Mitgliedschaft', 'Turnier'],
      correct: 'Work-Life-Balance',
    },
    ms: {
      body: 'Was verbessert die Work-Life-Balance? Wählen Sie alle richtigen Antworten.',
      options: ['Sport', 'Auszeit', 'Hobbys', 'Überstunden', 'Stress'],
      correct: ['Sport', 'Auszeit', 'Hobbys'],
    },
    dd: ['Sport', 'verbessert', 'meine', 'Work-Life-Balance', '.'],
    in: {
      wordChoices: ['Work-Life-Balance', 'Mitgliedschaft', 'Turnier'],
      correct: ['Work-Life-Balance'],
      body: 'Ergänzen Sie:\n\nYoga und Theater fördern Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie arbeiten viel, aber nehmen sich Zeit für Hobbys. Sport und Auszeit helfen — kein Dauerstress.',
      dialog: 'Coach: Wie ist Ihre ___?\nSie: Besser, seit ich wieder jogge.',
      options: ['Work-Life-Balance,Mitgliedschaft,Turnier'],
      correct: ['Work-Life-Balance'],
    },
  },
  {
    lemma: 'Freizeitgestaltung',
    hint: 'Wortschatz — wie man die freie Zeit plant und nutzt',
    so: {
      body: 'In der Beratung sprechen Sie über Ihre ___.',
      options: ['Freizeitgestaltung', 'Mitgliedschaft', 'Übernachtung'],
      correct: 'Freizeitgestaltung',
    },
    ms: {
      body: 'Was gehört zur Freizeitgestaltung? Wählen Sie alle richtigen Antworten.',
      options: ['Sport', 'Kultur', 'Freunde', 'Langeweile', 'Schichtdienst'],
      correct: ['Sport', 'Kultur', 'Freunde'],
    },
    dd: ['Meine', 'Freizeitgestaltung', 'ist', 'vielfältig', '.'],
    in: {
      wordChoices: ['Freizeitgestaltung', 'Mitgliedschaft', 'Turnier'],
      correct: ['Freizeitgestaltung'],
      body: 'Ergänzen Sie:\n\nIm Kurs lernen Sie eine neue ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie planen Sport, Theater und Treffen mit Freunden. Ihre Woche ist abwechslungsreich — kein reines Arbeiten.',
      dialog: 'Berater: Wie sieht Ihre ___ aus?\nSie: Sport montags, Theater freitags.',
      options: ['Freizeitgestaltung,Mitgliedschaft,Übernachtung'],
      correct: ['Freizeitgestaltung'],
    },
  },
  {
    lemma: 'Stammkneipe',
    hint: 'Wortschatz — Lieblingslokal, das man oft besucht',
    so: {
      body: 'Freitags treffen Sie Freunde in Ihrer ___.',
      options: ['Stammkneipe', 'Kletterhalle', 'Theater'],
      correct: 'Stammkneipe',
    },
    ms: {
      body: 'Was passt zur Stammkneipe? Wählen Sie alle richtigen Antworten.',
      options: ['Freunde', 'Gespräche', 'Stammgäste', 'Training', 'Turnier'],
      correct: ['Freunde', 'Gespräche', 'Stammgäste'],
    },
    dd: ['Freitags', 'gehen', 'wir', 'in', 'unsere', 'Stammkneipe', '.'],
    in: {
      wordChoices: ['Stammkneipe', 'Kletterhalle', 'Theater'],
      correct: ['Stammkneipe'],
      body: 'Ergänzen Sie:\n\nNach dem Chor singen gehen Sie in Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Jeden Freitag sitzen Sie am gleichen Tisch mit Freunden. Das Lokal kennt Sie — kein Training und kein Theater.',
      dialog: 'Freund: Treffen wir uns in der ___?\nSie: Klar, wie immer um acht.',
      options: ['Stammkneipe,Kletterhalle,Theater'],
      correct: ['Stammkneipe'],
    },
  },
  {
    lemma: 'Chor',
    hint: 'Wortschatz — Gruppe, die gemeinsam singt',
    so: {
      body: 'Seit einem Jahr singen Sie im ___.',
      options: ['Chor', 'Turnier', 'Theater'],
      correct: 'Chor',
    },
    ms: {
      body: 'Was gehört zum Chor? Wählen Sie alle richtigen Antworten.',
      options: ['Singen', 'Probe', 'Noten', 'Volleyball', 'Klettern'],
      correct: ['Singen', 'Probe', 'Noten'],
    },
    dd: ['Ich', 'singe', 'seit', 'einem', 'Jahr', 'im', 'Chor', '.'],
    in: {
      wordChoices: ['Chor', 'Turnier', 'Volleyball'],
      correct: ['Chor'],
      body: 'Ergänzen Sie:\n\nAm Mittwoch proben Sie mit dem ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie stehen mit anderen auf der Bühne und singen — kein Volleyball und kein Turnier.',
      dialog: 'Leiter: Kommen Sie zum ___?\nSie: Ja, ich liebe gemeinsames Singen.',
      options: ['Chor,Turnier,Volleyball'],
      correct: ['Chor'],
    },
  },
  {
    lemma: 'Turnier',
    hint: 'Wortschatz — nächsten Monat mit Verein',
    so: {
      body: 'Nächsten Monat nehmen Sie an einem ___ teil.',
      options: ['Turnier', 'Chor', 'Theater'],
      correct: 'Turnier',
    },
    ms: {
      body: 'Was gehört zu einem Turnier? Wählen Sie alle richtigen Antworten.',
      options: ['Teams', 'Spiele', 'Sieger', 'Probe', 'Premiere'],
      correct: ['Teams', 'Spiele', 'Sieger'],
    },
    dd: ['Nächsten', 'Monat', 'spielen', 'wir', 'ein', 'Turnier', '.'],
    in: {
      wordChoices: ['Turnier', 'Chor', 'Theater'],
      correct: ['Turnier'],
      body: 'Ergänzen Sie:\n\nIhr Volleyballteam fährt zum ___.',
    },
    tg: {
      story: 'Vorgeschichte: Mehrere Mannschaften treffen sich zum Wettkampf. Es gibt Spiele und einen Sieger — keine Theaterpremiere.',
      dialog: 'Trainer: Sind Sie bereit fürs ___?\nSie: Ja, wir haben trainiert.',
      options: ['Turnier,Chor,Theater'],
      correct: ['Turnier'],
    },
  },
  {
    lemma: 'Übernachtung',
    hint: 'Wortschatz — eine Nacht woanders verbringen',
    so: {
      body: 'Beim Vereinsausflug buchen Sie eine ___.',
      options: ['Übernachtung', 'Mitgliedschaft', 'Leidenschaft'],
      correct: 'Übernachtung',
    },
    ms: {
      body: 'Was brauchen Sie für eine Übernachtung? Wählen Sie alle richtigen Antworten.',
      options: ['Hotel', 'Schlafsack', 'Reservierung', 'Volleyball', 'Chor'],
      correct: ['Hotel', 'Schlafsack', 'Reservierung'],
    },
    dd: ['Für', 'den', 'Ausflug', 'buchen', 'wir', 'eine', 'Übernachtung', '.'],
    in: {
      wordChoices: ['Übernachtung', 'Mitgliedschaft', 'Turnier'],
      correct: ['Übernachtung'],
      body: 'Ergänzen Sie:\n\nNach der Radtour organisieren Sie eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Der Verein plant eine zweitägige Unternehmung. Sie brauchen ein Hotel — kein Turnier am selben Tag.',
      dialog: 'Organisator: Wer braucht eine ___?\nSie: Ich, bitte ein Einzelzimmer.',
      options: ['Übernachtung,Turnier,Chor'],
      correct: ['Übernachtung'],
    },
  },
  {
    lemma: 'Unternehmung',
    hint: 'Wortschatz — Sonntag mit Freunden',
    so: {
      body: 'Am Sonntag planen Sie eine ___ mit Freunden.',
      options: ['Unternehmung', 'Mitgliedschaft', 'Langeweile'],
      correct: 'Unternehmung',
    },
    ms: {
      body: 'Was kann eine Unternehmung sein? Wählen Sie alle richtigen Antworten.',
      options: ['Ausflug', 'Kino', 'Radtour', 'Schlafen', 'Langeweile'],
      correct: ['Ausflug', 'Kino', 'Radtour'],
    },
    dd: ['Am', 'Sonntag', 'planen', 'wir', 'eine', 'Unternehmung', '.'],
    in: {
      wordChoices: ['Unternehmung', 'Mitgliedschaft', 'Langeweile'],
      correct: ['Unternehmung'],
      body: 'Ergänzen Sie:\n\nDer Verein organisiert eine ___ ans Meer.',
    },
    tg: {
      story: 'Vorgeschichte: Sie laden Freunde ein und planen einen Tag voller Aktivitäten — kein langweiliges Zuhausebleiben.',
      dialog: 'Freundin: Haben Sie eine ___ geplant?\nSie: Ja, Wandern und danach Grillen.',
      options: ['Unternehmung,Mitgliedschaft,Langeweile'],
      correct: ['Unternehmung'],
    },
  },
];
