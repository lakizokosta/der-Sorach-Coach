/** B2 lemma specs — Hobbys & Freizeit (Sie-Register) */

export const b2Words = [
  {
    lemma: 'Freizeitverhalten',
    hint: 'Wortschatz — wie Menschen ihre Freizeit nutzen',
    so: {
      body: 'In der Studie analysieren Sie das ___ der Teilnehmer.',
      options: ['Freizeitverhalten', 'Sponsoring', 'Wettkampf'],
      correct: 'Freizeitverhalten',
    },
    ms: {
      body: 'Was gehört zum Freizeitverhalten? Wählen Sie alle richtigen Antworten.',
      options: ['Sport', 'Kultur', 'Erholung', 'Büroarbeit', 'Langeweile'],
      correct: ['Sport', 'Kultur', 'Erholung'],
    },
    dd: ['Das', 'Freizeitverhalten', 'ändert', 'sich', 'mit', 'dem', 'Alter', '.'],
    in: {
      wordChoices: ['Freizeitverhalten', 'Sponsoring', 'Wettkampf'],
      correct: ['Freizeitverhalten'],
      body: 'Ergänzen Sie:\n\nIm Interview erklären Sie Ihr ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie beantworten Fragen zu Sport, Kultur und Erholung in Ihrer Freizeit — nicht zu Finanzen.',
      dialog: 'Forscher: Beschreiben Sie Ihr ___?\nSie: Ich kombiniere Sport und Kulturangebote.',
      options: ['Freizeitverhalten,Sponsoring,Wettkampf'],
      correct: ['Freizeitverhalten'],
    },
  },
  {
    lemma: 'ausgleichen',
    hint: 'Wortschatz — Stress durch Freizeit kompensieren',
    so: {
      body: 'Yoga hilft Ihnen, den Alltag ___.',
      options: ['auszugleichen', 'zu verlieren', 'zu vergessen'],
      correct: 'auszugleichen',
    },
    ms: {
      body: 'Was hilft beim Ausgleichen? Wählen Sie alle richtigen Antworten.',
      options: ['Sport', 'Regeneration', 'Auszeit', 'Überstunden', 'Stress'],
      correct: ['Sport', 'Regeneration', 'Auszeit'],
    },
    dd: ['Sport', 'hilft', 'mir', 'den', 'Alltag', 'auszugleichen', '.'],
    in: {
      wordChoices: ['ausgleichen', 'verlieren', 'vergessen'],
      correct: ['ausgleichen'],
      body: 'Ergänzen Sie:\n\nMit Outdoor-Aktivitäten ___ Sie Berufsstress.',
    },
    tg: {
      story: 'Vorgeschichte: Nach einer anstrengenden Woche machen Sie Sport und ruhen sich aus — Sie arbeiten nicht weiter.',
      dialog: 'Coach: Wie können Sie ___?\nSie: Mit Workout und Regeneration.',
      options: ['ausgleichen,verlieren,vergessen'],
      correct: ['ausgleichen'],
    },
  },
  {
    lemma: 'Vereinsleben',
    hint: 'Wortschatz — Aktivitäten und Gemeinschaft im Verein',
    so: {
      body: 'Im ___ engagieren Sie sich seit zehn Jahren.',
      options: ['Vereinsleben', 'Festival', 'Sponsoring'],
      correct: 'Vereinsleben',
    },
    ms: {
      body: 'Was gehört zum Vereinsleben? Wählen Sie alle richtigen Antworten.',
      options: ['Training', 'Fest', 'Netzwerk', 'Langeweile', 'Hausaufgaben'],
      correct: ['Training', 'Fest', 'Netzwerk'],
    },
    dd: ['Das', 'Vereinsleben', 'ist', 'sehr', 'aktiv', '.'],
    in: {
      wordChoices: ['Vereinsleben', 'Festival', 'Sponsoring'],
      correct: ['Vereinsleben'],
      body: 'Ergänzen Sie:\n\nIm Bericht beschreiben Sie das ___ Ihres Sportvereins.',
    },
    tg: {
      story: 'Vorgeschichte: Sie erzählen von Training, Festen und Kontakten im Verein — kein Sponsoringvertrag und kein Festival allein.',
      dialog: 'Reporter: Wie ist Ihr ___?\nSie: Abwechslungsreich und sozial.',
      options: ['Vereinsleben,Festival,Sponsoring'],
      correct: ['Vereinsleben'],
    },
  },
  {
    lemma: 'Freizeitmarkt',
    hint: 'Wortschatz — Marktbereich für Freizeitprodukte',
    so: {
      body: 'Die Firma analysiert den ___ für Outdoor-Sport.',
      options: ['Freizeitmarkt', 'Wettkampf', 'Chor'],
      correct: 'Freizeitmarkt',
    },
    ms: {
      body: 'Was gehört zum Freizeitmarkt? Wählen Sie alle richtigen Antworten.',
      options: ['Produkte', 'Trends', 'Kunden', 'Büroarbeit', 'Krankheit'],
      correct: ['Produkte', 'Trends', 'Kunden'],
    },
    dd: ['Der', 'Freizeitmarkt', 'wächst', 'stark', '.'],
    in: {
      wordChoices: ['Freizeitmarkt', 'Wettkampf', 'Regeneration'],
      correct: ['Freizeitmarkt'],
      body: 'Ergänzen Sie:\n\nIm Report lesen Sie über den ___ für Fitness.',
    },
    tg: {
      story: 'Vorgeschichte: In der Präsentation zeigen Sie Marktdaten für Freizeitprodukte — kein Wettkampfbericht.',
      dialog: 'Kollege: Welchen ___ interessiert Sie?\nSie: Outdoor und Nachhaltigkeit.',
      options: ['Freizeitmarkt,Wettkampf,Regeneration'],
      correct: ['Freizeitmarkt'],
    },
  },
  {
    lemma: 'Nachhaltigkeit',
    hint: 'Wortschatz — umweltfreundliche Freizeitgestaltung',
    so: {
      body: 'Bei Ausflügen achten Sie auf ___.',
      options: ['Nachhaltigkeit', 'Sponsoring', 'Wettkampf'],
      correct: 'Nachhaltigkeit',
    },
    ms: {
      body: 'Was fördert Nachhaltigkeit in der Freizeit? Wählen Sie alle richtigen Antworten.',
      options: ['Radtour', 'Recycling', 'Regional einkaufen', 'Flugreise', 'Plastikmüll'],
      correct: ['Radtour', 'Recycling', 'Regional einkaufen'],
    },
    dd: ['Bei', 'Ausflügen', 'achte', 'ich', 'auf', 'Nachhaltigkeit', '.'],
    in: {
      wordChoices: ['Nachhaltigkeit', 'Sponsoring', 'Wettkampf'],
      correct: ['Nachhaltigkeit'],
      body: 'Ergänzen Sie:\n\nIhr Verein setzt auf ___ bei Events.',
    },
    tg: {
      story: 'Vorgeschichte: Sie fahren mit dem Rad und vermeiden Müll — kein Sponsoring und kein reiner Wettkampf.',
      dialog: 'Moderator: Wie wichtig ist ___?\nSie: Sehr — ich wähle umweltfreundliche Aktivitäten.',
      options: ['Nachhaltigkeit,Sponsoring,Wettkampf'],
      correct: ['Nachhaltigkeit'],
    },
  },
  {
    lemma: 'Kulturangebot',
    hint: 'Wortschatz — kulturelle Veranstaltungen in einer Stadt',
    so: {
      body: 'In München ist das ___ sehr vielfältig.',
      options: ['Kulturangebot', 'Workout', 'Sponsoring'],
      correct: 'Kulturangebot',
    },
    ms: {
      body: 'Was gehört zum Kulturangebot? Wählen Sie alle richtigen Antworten.',
      options: ['Theater', 'Museum', 'Festival', 'Fitnessstudio', 'Volleyball'],
      correct: ['Theater', 'Museum', 'Festival'],
    },
    dd: ['Das', 'Kulturangebot', 'in', 'Berlin', 'ist', 'reich', '.'],
    in: {
      wordChoices: ['Kulturangebot', 'Workout', 'Wettkampf'],
      correct: ['Kulturangebot'],
      body: 'Ergänzen Sie:\n\nIm Prospekt finden Sie das ___ der Stadt.',
    },
    tg: {
      story: 'Vorgeschichte: Sie stöbern im Programmheft: Theater, Museen und Festivals — kein reines Workout.',
      dialog: 'Tourist: Kennen Sie das ___?\nSie: Ja, besonders im Sommer.',
      options: ['Kulturangebot,Workout,Sponsoring'],
      correct: ['Kulturangebot'],
    },
  },
  {
    lemma: 'Sportverein',
    hint: 'Wortschatz — seit Jahren aktiv',
    so: {
      body: 'Seit fünf Jahren sind Sie im ___ aktiv.',
      options: ['Sportverein', 'Festival', 'Event'],
      correct: 'Sportverein',
    },
    ms: {
      body: 'Was finden Sie im Sportverein? Wählen Sie alle richtigen Antworten.',
      options: ['Training', 'Wettkampf', 'Trainer', 'Theater', 'Chor'],
      correct: ['Training', 'Wettkampf', 'Trainer'],
    },
    dd: ['Ich', 'bin', 'seit', 'Jahren', 'im', 'Sportverein', '.'],
    in: {
      wordChoices: ['Sportverein', 'Festival', 'Sponsoring'],
      correct: ['Sportverein'],
      body: 'Ergänzen Sie:\n\nIhr Kind trainiert im lokalen ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie trainieren regelmäßig mit Trainer und Team — kein Festivalbesuch allein.',
      dialog: 'Trainer: Bleiben Sie im ___?\nSie: Ja, das Vereinsleben gefällt mir.',
      options: ['Sportverein,Festival,Event'],
      correct: ['Sportverein'],
    },
  },
  {
    lemma: 'Wettkampf',
    hint: 'Wortschatz — sportlicher Wettstreit',
    so: {
      body: 'Vor dem ___ trainieren Sie besonders hart.',
      options: ['Wettkampf', 'Festival', 'Chor'],
      correct: 'Wettkampf',
    },
    ms: {
      body: 'Was gehört zum Wettkampf? Wählen Sie alle richtigen Antworten.',
      options: ['Regeln', 'Gegner', 'Sieger', 'Probe', 'Premiere'],
      correct: ['Regeln', 'Gegner', 'Sieger'],
    },
    dd: ['Vor', 'dem', 'Wettkampf', 'trainiere', 'ich', 'hart', '.'],
    in: {
      wordChoices: ['Wettkampf', 'Festival', 'Chor'],
      correct: ['Wettkampf'],
      body: 'Ergänzen Sie:\n\nIhr Team gewinnt den ___.',
    },
    tg: {
      story: 'Vorgeschichte: Am Sonntag treten Sie gegen andere Mannschaften an — kein Chor und kein Festival.',
      dialog: 'Coach: Sind Sie bereit für den ___?\nSie: Ja, wir wollen gewinnen.',
      options: ['Wettkampf,Festival,Chor'],
      correct: ['Wettkampf'],
    },
  },
  {
    lemma: 'Regeneration',
    hint: 'Wortschatz — körperliche Erholung nach Belastung',
    so: {
      body: 'Nach dem Marathon brauchen Sie ___.',
      options: ['Regeneration', 'Wettkampf', 'Sponsoring'],
      correct: 'Regeneration',
    },
    ms: {
      body: 'Was fördert Regeneration? Wählen Sie alle richtigen Antworten.',
      options: ['Schlaf', 'leichtes Training', 'Massage', 'Wettkampf', 'Event'],
      correct: ['Schlaf', 'leichtes Training', 'Massage'],
    },
    dd: ['Nach', 'dem', 'Sport', 'brauche', 'ich', 'Regeneration', '.'],
    in: {
      wordChoices: ['Regeneration', 'Wettkampf', 'Sponsoring'],
      correct: ['Regeneration'],
      body: 'Ergänzen Sie:\n\nIhr Trainer plant Tage der ___.',
    },
    tg: {
      story: 'Vorgeschichte: Das harte Training ist vorbei. Sie schlafen und massieren — kein neuer Wettkampf sofort.',
      dialog: 'Physio: Wann beginnt die ___?\nSie: Morgen, zwei Tage Pause.',
      options: ['Regeneration,Wettkampf,Event'],
      correct: ['Regeneration'],
    },
  },
  {
    lemma: 'Lifestyle',
    hint: 'Wortschatz — persönlicher Lebensstil und Gewohnheiten',
    so: {
      body: 'Sport und Kultur prägen Ihren ___.',
      options: ['Lifestyle', 'Wettkampf', 'Sponsoring'],
      correct: 'Lifestyle',
    },
    ms: {
      body: 'Was beeinflusst den Lifestyle? Wählen Sie alle richtigen Antworten.',
      options: ['Freizeit', 'Ernährung', 'Sport', 'Langeweile', 'Hausaufgaben'],
      correct: ['Freizeit', 'Ernährung', 'Sport'],
    },
    dd: ['Mein', 'Lifestyle', 'ist', 'aktiv', 'und', 'gesund', '.'],
    in: {
      wordChoices: ['Lifestyle', 'Wettkampf', 'Sponsoring'],
      correct: ['Lifestyle'],
      body: 'Ergänzen Sie:\n\nIm Magazin lesen Sie über einen gesunden ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie erklären, wie Sport und Kultur Ihren Alltag prägen — kein reiner Wettkampf.',
      dialog: 'Journalist: Beschreiben Sie Ihren ___?\nSie: Aktiv, mit viel Outdoor-Aktivität.',
      options: ['Lifestyle,Wettkampf,Sponsoring'],
      correct: ['Lifestyle'],
    },
  },
  {
    lemma: 'Zeitmanagement',
    hint: 'Wortschatz — Freizeit und Job sinnvoll planen',
    so: {
      body: 'Gutes ___ hilft Ihnen, Hobbys einzuplanen.',
      options: ['Zeitmanagement', 'Sponsoring', 'Wettkampf'],
      correct: 'Zeitmanagement',
    },
    ms: {
      body: 'Was verbessert Zeitmanagement? Wählen Sie alle richtigen Antworten.',
      options: ['Kalender', 'Prioritäten', 'Pausen', 'Chaos', 'Stress'],
      correct: ['Kalender', 'Prioritäten', 'Pausen'],
    },
    dd: ['Gutes', 'Zeitmanagement', 'spart', 'mir', 'Stress', '.'],
    in: {
      wordChoices: ['Zeitmanagement', 'Sponsoring', 'Wettkampf'],
      correct: ['Zeitmanagement'],
      body: 'Ergänzen Sie:\n\nIm Seminar lernen Sie effektives ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie nutzen einen Kalender für Sport und Erholung — kein chaotischer Alltag.',
      dialog: 'Coach: Wie ist Ihr ___?\nSie: Ich blocke feste Zeiten für Hobbys.',
      options: ['Zeitmanagement,Sponsoring,Wettkampf'],
      correct: ['Zeitmanagement'],
    },
  },
  {
    lemma: 'Netzwerk',
    hint: 'Wortschatz — im Verein knüpfen',
    so: {
      body: 'Im Verein bauen Sie ein starkes ___.',
      options: ['Netzwerk', 'Wettkampf', 'Workout'],
      correct: 'Netzwerk',
    },
    ms: {
      body: 'Was bringt ein Netzwerk in der Freizeit? Wählen Sie alle richtigen Antworten.',
      options: ['Kontakte', 'Freundschaften', 'Hilfe', 'Langeweile', 'Isolation'],
      correct: ['Kontakte', 'Freundschaften', 'Hilfe'],
    },
    dd: ['Im', 'Verein', 'baue', 'ich', 'ein', 'Netzwerk', 'auf', '.'],
    in: {
      wordChoices: ['Netzwerk', 'Wettkampf', 'Workout'],
      correct: ['Netzwerk'],
      body: 'Ergänzen Sie:\n\nBeim Festival erweitern Sie Ihr ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie lernen beim Sport und bei Events neue Leute kennen — keine Isolation.',
      dialog: 'Kollege: Nutzen Sie Ihr ___?\nSie: Ja, oft entstehen neue Projekte.',
      options: ['Netzwerk,Wettkampf,Workout'],
      correct: ['Netzwerk'],
    },
  },
  {
    lemma: 'Sponsoring',
    hint: 'Wortschatz — finanzielle Unterstützung für Events',
    so: {
      body: 'Das Festival sucht neues ___.',
      options: ['Sponsoring', 'Regeneration', 'Amateur'],
      correct: 'Sponsoring',
    },
    ms: {
      body: 'Was gehört zum Sponsoring? Wählen Sie alle richtigen Antworten.',
      options: ['Geld', 'Partner', 'Werbung', 'Training', 'Chor'],
      correct: ['Geld', 'Partner', 'Werbung'],
    },
    dd: ['Das', 'Event', 'sucht', 'neues', 'Sponsoring', '.'],
    in: {
      wordChoices: ['Sponsoring', 'Regeneration', 'Amateur'],
      correct: ['Sponsoring'],
      body: 'Ergänzen Sie:\n\nDer Sportverein sichert ___ für das Turnier.',
    },
    tg: {
      story: 'Vorgeschichte: Der Veranstalter sucht Firmen, die Geld geben — kein Amateurturnier ohne Budget.',
      dialog: 'Organisator: Haben Sie ___?\nSie: Ja, zwei Partner sind dabei.',
      options: ['Sponsoring,Regeneration,Amateur'],
      correct: ['Sponsoring'],
    },
  },
  {
    lemma: 'Amateur',
    hint: 'Wortschatz — aus Leidenschaft, nicht für Geld',
    so: {
      body: 'Als ___ spielen Sie aus Leidenschaft, nicht für Geld.',
      options: ['Amateur', 'Profi', 'Sponsor'],
      correct: 'Amateur',
    },
    ms: {
      body: 'Was trifft auf Amateure zu? Wählen Sie alle richtigen Antworten.',
      options: ['Hobby', 'Verein', 'Freizeit', 'Millionengehalt', 'Sponsoring-Vertrag'],
      correct: ['Hobby', 'Verein', 'Freizeit'],
    },
    dd: ['Als', 'Amateur', 'spiele', 'ich', 'aus', 'Leidenschaft', '.'],
    in: {
      wordChoices: ['Amateur', 'Profi', 'Sponsor'],
      correct: ['Amateur'],
      body: 'Ergänzen Sie:\n\nIm lokalen Verein sind die meisten ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie spielen ohne Gehalt im Verein — kein Profi mit Millionenvertrag.',
      dialog: 'Reporter: Sind Sie ___ oder Profi?\nSie: Amateur — Sport ist mein Hobby.',
      options: ['Amateur,Profi,Sponsor'],
      correct: ['Amateur'],
    },
  },
  {
    lemma: 'Profi',
    hint: 'Wortschatz — Berufssportler',
    so: {
      body: 'Als ___ trainieren Sie täglich mehrere Stunden.',
      options: ['Profi', 'Amateur', 'Sponsor'],
      correct: 'Profi',
    },
    ms: {
      body: 'Was trifft auf Profis zu? Wählen Sie alle richtigen Antworten.',
      options: ['Gehalt', 'Wettkampf', 'Training', 'Hobby ohne Bezahlung', 'Chor'],
      correct: ['Gehalt', 'Wettkampf', 'Training'],
    },
    dd: ['Als', 'Profi', 'trainiere', 'ich', 'täglich', '.'],
    in: {
      wordChoices: ['Profi', 'Amateur', 'Sponsor'],
      correct: ['Profi'],
      body: 'Ergänzen Sie:\n\nDer ___ gewinnt den internationalen Wettkampf.',
    },
    tg: {
      story: 'Vorgeschichte: Der Athlet lebt vom Sport und trainiert professionell — kein Amateurhobby.',
      dialog: 'Moderator: Arbeiten Sie als ___?\nSie: Ja, seit zehn Jahren.',
      options: ['Profi,Amateur,Sponsor'],
      correct: ['Profi'],
    },
  },
  {
    lemma: 'Event',
    hint: 'Wortschatz — geplante Veranstaltung',
    so: {
      body: 'Im Sommer organisiert der Verein ein großes ___.',
      options: ['Event', 'Regeneration', 'Amateur'],
      correct: 'Event',
    },
    ms: {
      body: 'Was gehört zu einem Event? Wählen Sie alle richtigen Antworten.',
      options: ['Programm', 'Gäste', 'Location', 'Schlaf', 'Langeweile'],
      correct: ['Programm', 'Gäste', 'Location'],
    },
    dd: ['Der', 'Verein', 'organisiert', 'ein', 'großes', 'Event', '.'],
    in: {
      wordChoices: ['Event', 'Regeneration', 'Amateur'],
      correct: ['Event'],
      body: 'Ergänzen Sie:\n\nNächsten Samstag findet das ___ statt.',
    },
    tg: {
      story: 'Vorgeschichte: Der Verein plant Gäste, Programm und Location — kein Ruhetag allein.',
      dialog: 'Organisator: Kommen Sie zum ___?\nSie: Ja, ich helfe beim Aufbau.',
      options: ['Event,Regeneration,Amateur'],
      correct: ['Event'],
    },
  },
  {
    lemma: 'Festival',
    hint: 'Wortschatz — großes mehrtägiges Kultur- oder Sportfest',
    so: {
      body: 'Im Juli besuchen Sie ein ___.',
      options: ['Festival', 'Wettkampf', 'Workout'],
      correct: 'Festival',
    },
    ms: {
      body: 'Was finden Sie auf einem Festival? Wählen Sie alle richtigen Antworten.',
      options: ['Künstler', 'Bühnen', 'Besucher', 'Training', 'Regeneration'],
      correct: ['Künstler', 'Bühnen', 'Besucher'],
    },
    dd: ['Im', 'Sommer', 'besuche', 'ich', 'ein', 'Festival', '.'],
    in: {
      wordChoices: ['Festival', 'Wettkampf', 'Workout'],
      correct: ['Festival'],
      body: 'Ergänzen Sie:\n\nDas Outdoor-___ dauert drei Tage.',
    },
    tg: {
      story: 'Vorgeschichte: Mehrere Tage Musik und Künstler auf Bühnen — kein einzelnes Workout.',
      dialog: 'Freund: Fahren Sie zum ___?\nSie: Ja, ich habe Tickets für Samstag.',
      options: ['Festival,Wettkampf,Workout'],
      correct: ['Festival'],
    },
  },
  {
    lemma: 'Outdoor-Aktivität',
    hint: 'Wortschatz — Sport und Freizeit an der frischen Luft',
    so: {
      body: 'Wandern ist eine beliebte ___.',
      options: ['Outdoor-Aktivität', 'Regeneration', 'Sponsoring'],
      correct: 'Outdoor-Aktivität',
    },
    ms: {
      body: 'Was ist eine Outdoor-Aktivität? Wählen Sie alle richtigen Antworten.',
      options: ['Wandern', 'Radtour', 'Klettern', 'Kino', 'Theater'],
      correct: ['Wandern', 'Radtour', 'Klettern'],
    },
    dd: ['Wandern', 'ist', 'eine', 'Outdoor-Aktivität', '.'],
    in: {
      wordChoices: ['Outdoor-Aktivität', 'Regeneration', 'Sponsoring'],
      correct: ['Outdoor-Aktivität'],
      body: 'Ergänzen Sie:\n\nIm Urlaub planen Sie eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind draußen in der Natur: wandern, radeln oder klettern — kein Kino.',
      dialog: 'Guide: Welche ___ wünschen Sie?\nSie: Eine Radtour am See.',
      options: ['Outdoor-Aktivität,Regeneration,Sponsoring'],
      correct: ['Outdoor-Aktivität'],
    },
  },
  {
    lemma: 'Workout',
    hint: 'Wortschatz — intensives Fitnesstraining',
    so: {
      body: 'Montags machen Sie ein hartes ___.',
      options: ['Workout', 'Festival', 'Sponsoring'],
      correct: 'Workout',
    },
    ms: {
      body: 'Was gehört zum Workout? Wählen Sie alle richtigen Antworten.',
      options: ['Übungen', 'Schwitzen', 'Fitnessstudio', 'Chor', 'Theater'],
      correct: ['Übungen', 'Schwitzen', 'Fitnessstudio'],
    },
    dd: ['Montags', 'mache', 'ich', 'ein', 'Workout', '.'],
    in: {
      wordChoices: ['Workout', 'Festival', 'Sponsoring'],
      correct: ['Workout'],
      body: 'Ergänzen Sie:\n\nNach dem ___ fühlen Sie sich erschöpft.',
    },
    tg: {
      story: 'Vorgeschichte: Im Studio machen Sie intensive Übungen und schwitzen — kein Festival und kein Theater.',
      dialog: 'Trainer: Starten wir das ___?\nSie: Ja, ich bin bereit.',
      options: ['Workout,Festival,Sponsoring'],
      correct: ['Workout'],
    },
  },
  {
    lemma: 'Durchhaltevermögen',
    hint: 'Wortschatz — Ausdauer und Willenskraft',
    so: {
      body: 'Beim Marathon brauchen Sie viel ___.',
      options: ['Durchhaltevermögen', 'Sponsoring', 'Langeweile'],
      correct: 'Durchhaltevermögen',
    },
    ms: {
      body: 'Was trainiert Durchhaltevermögen? Wählen Sie alle richtigen Antworten.',
      options: ['Laufen', 'Klettern', 'Wettkampf', 'Aufgeben', 'Pause'],
      correct: ['Laufen', 'Klettern', 'Wettkampf'],
    },
    dd: ['Beim', 'Marathon', 'brauche', 'ich', 'Durchhaltevermögen', '.'],
    in: {
      wordChoices: ['Durchhaltevermögen', 'Sponsoring', 'Langeweile'],
      correct: ['Durchhaltevermögen'],
      body: 'Ergänzen Sie:\n\nIhr Trainer lobt Ihr ___.',
    },
    tg: {
      story: 'Vorgeschichte: Die Strecke ist lang, aber Sie geben nicht auf. Ausdauer zählt — kein Sponsoring hilft auf der Strecke.',
      dialog: 'Coach: Haben Sie ___?\nSie: Ja, ich laufe bis zum Ziel.',
      options: ['Durchhaltevermögen,Sponsoring,Langeweile'],
      correct: ['Durchhaltevermögen'],
    },
  },
];
