/** A1 lemma specs for build-levels.mjs */

export const a1Words = [
  {
    lemma: "Hobby",
    hint: "Wortschatz — etwas, das dir Spaß macht",
    so: {
      body: "Was machst du gern in deiner Freizeit? Mein ___ ist Lesen.",
      options: [
        "Hobby",
        "Sport",
        "Film"
      ],
      correct: "Hobby"
    },
    ms: {
      body: "Was kann ein Hobby sein? Wähle alle richtigen Antworten.",
      options: [
        "lesen",
        "Fußball",
        "tanzen",
        "Hausaufgaben",
        "Hausaufgaben"
      ],
      correct: [
        "lesen",
        "Fußball",
        "tanzen"
      ]
    },
    dd: [
      "Mein",
      "Hobby",
      "ist",
      "Musik",
      "."
    ],
    in: {
      wordChoices: [
        "Hobby",
        "Sport",
        "Film"
      ],
      correct: [
        "Hobby"
      ],
      body: "Ergänze:\n\nMein ___ ist Fotografie."
    },
    tg: {
      story: "Vorgeschichte: In der Pause erzählst du von deiner Freizeit. Du liest gern — das ist deine Leidenschaft, kein Beruf.",
      dialog: "Freund: Was ist dein ___?\nDu: Lesen — jeden Abend.",
      options: [
        "Hobby,Sport,Film"
      ],
      correct: [
        "Hobby"
      ]
    }
  },
  {
    lemma: "Sport",
    hint: "Wortschatz — Bewegung und Training",
    so: {
      body: "Am Samstag mache ich gern ___.",
      options: [
        "Sport",
        "Kino",
        "Film"
      ],
      correct: "Sport"
    },
    ms: {
      body: "Was ist Sport? Wähle alle richtigen Antworten.",
      options: [
        "Fußball",
        "schwimmen",
        "tanzen",
        "Langeweile",
        "Schule"
      ],
      correct: [
        "Fußball",
        "schwimmen"
      ]
    },
    dd: [
      "Am",
      "Wochenende",
      "mache",
      "ich",
      "Sport",
      "."
    ],
    in: {
      wordChoices: [
        "Sport",
        "Kino",
        "Film"
      ],
      correct: [
        "Sport"
      ],
      body: "Ergänze:\n\nIm Verein mache ich viel ___."
    },
    tg: {
      story: "Vorgeschichte: Dein Freund fragt, was du montags im Park machst. Du rennst und spielst — nicht Kino und nicht kochen.",
      dialog: "Freund: Machst du ___?\nDu: Ja, zweimal pro Woche.",
      options: [
        "Sport,Kino,Kochen"
      ],
      correct: [
        "Sport"
      ]
    }
  },
  {
    lemma: "Fußball",
    hint: "Wortschatz — beliebtes Teamspiel",
    so: {
      body: "Im Verein spiele ich ___.",
      options: [
        "Fußball",
        "Gitarre",
        "Film"
      ],
      correct: "Fußball"
    },
    ms: {
      body: "Was brauchst du für Fußball? Wähle alle richtigen Antworten.",
      options: [
        "Ball",
        "Verein",
        "Freunde",
        "Hausaufgaben",
        "Langeweile"
      ],
      correct: [
        "Ball",
        "Verein",
        "Freunde"
      ]
    },
    dd: [
      "Wir",
      "spielen",
      "Fußball",
      "im",
      "Park",
      "."
    ],
    in: {
      wordChoices: [
        "Fußball",
        "Gitarre",
        "Film"
      ],
      correct: [
        "Fußball"
      ],
      body: "Ergänze:\n\nSonntags spielen wir ___."
    },
    tg: {
      story: "Vorgeschichte: Dein Team trifft sich am Platz. Ihr spielt mit dem Ball — nicht Klavier und nicht im Kino.",
      dialog: "Trainer: Heute wieder ___?\nDu: Klar, ich bin dabei!",
      options: [
        "Fußball,Konzert,Kino"
      ],
      correct: [
        "Fußball"
      ]
    }
  },
  {
    lemma: "Musik",
    hint: "Wortschatz — Töne, singen, Instrumente",
    so: {
      body: "Ich höre gern ___ und spiele Gitarre.",
      options: [
        "Musik",
        "Sport",
        "Film"
      ],
      correct: "Musik"
    },
    ms: {
      body: "Was passt zu Musik? Wähle alle richtigen Antworten.",
      options: [
        "Gitarre",
        "tanzen",
        "hören",
        "schwimmen",
        "Grillen"
      ],
      correct: [
        "Gitarre",
        "tanzen",
        "hören"
      ]
    },
    dd: [
      "Ich",
      "höre",
      "gern",
      "Musik",
      "."
    ],
    in: {
      wordChoices: [
        "Musik",
        "Sport",
        "Film"
      ],
      correct: [
        "Musik"
      ],
      body: "Ergänze:\n\nAbends höre ich leise ___."
    },
    tg: {
      story: "Vorgeschichte: Du übst zu Hause. Du spielst Gitarre und hörst Lieder — kein Fußball und kein Schwimmen.",
      dialog: "Schwester: Ist das ___?\nDu: Ja, meine Lieblingsband.",
      options: [
        "Musik,Langeweile,Sport"
      ],
      correct: [
        "Musik"
      ]
    }
  },
  {
    lemma: "lesen",
    hint: "Wortschatz — Bücher und Texte",
    so: {
      body: "Am Wochenende ___ ich gern Krimis.",
      options: [
        "lese",
        "tanze",
        "schwimme"
      ],
      correct: "lese"
    },
    ms: {
      body: "Was kannst du lesen? Wähle alle richtigen Antworten.",
      options: [
        "Buch",
        "Zeitung",
        "Comic",
        "Hausaufgaben",
        "Langeweile"
      ],
      correct: [
        "Buch",
        "Zeitung",
        "Comic"
      ]
    },
    dd: [
      "Ich",
      "lese",
      "gern",
      "am",
      "Abend",
      "."
    ],
    in: {
      wordChoices: [
        "lese",
        "tanze",
        "schwimme"
      ],
      correct: [
        "lese"
      ],
      body: "Ergänze:\n\nIm Park ___ ich ein Buch."
    },
    tg: {
      story: "Vorgeschichte: Es regnet. Du sitzt auf dem Sofa mit einem Krimi — du tanzt nicht und gehst nicht schwimmen.",
      dialog: "Freund: Was machst du?\nDu: Ich ___ einen spannenden Krimi.",
      options: [
        "lese,tanze,schwimme"
      ],
      correct: [
        "lese"
      ]
    }
  },
  {
    lemma: "spielen",
    hint: "Wortschatz — Freizeit mit anderen",
    so: {
      body: "Nach der Schule ___ ich mit Freunden.",
      options: [
        "spiele",
        "koche",
        "male"
      ],
      correct: "spiele"
    },
    ms: {
      body: "Womit kann man spielen? Wähle alle richtigen Antworten.",
      options: [
        "Fußball",
        "Gitarre",
        "Computer",
        "Rezept",
        "Schule"
      ],
      correct: [
        "Fußball",
        "Gitarre",
        "Computer"
      ]
    },
    dd: [
      "Wir",
      "spielen",
      "gern",
      "zusammen",
      "."
    ],
    in: {
      wordChoices: [
        "spiele",
        "koche",
        "male"
      ],
      correct: [
        "spiele"
      ],
      body: "Ergänze:\n\nIm Verein ___ ich Tennis."
    },
    tg: {
      story: "Vorgeschichte: Deine Freunde warten im Park. Ihr macht ein Ballspiel — ihr kocht nicht und lest kein Formular.",
      dialog: "Freund: Kommst du?\nDu: Ja, ich will auch ___!",
      options: [
        "spielen,kochen,schlafen"
      ],
      correct: [
        "spielen"
      ]
    }
  },
  {
    lemma: "tanzen",
    hint: "Wortschatz — sich zur Musik bewegen",
    so: {
      body: "Im Club ___ ich gern zu Popmusik.",
      options: [
        "tanze",
        "lese",
        "schwimme"
      ],
      correct: "tanze"
    },
    ms: {
      body: "Wo kann man tanzen? Wähle alle richtigen Antworten.",
      options: [
        "Club",
        "Party",
        "zu Musik",
        "Büroarbeit",
        "Apotheke"
      ],
      correct: [
        "Club",
        "Party",
        "zu Musik"
      ]
    },
    dd: [
      "Am",
      "Samstag",
      "tanze",
      "ich",
      "gern",
      "."
    ],
    in: {
      wordChoices: [
        "tanze",
        "lese",
        "schwimme"
      ],
      correct: [
        "tanze"
      ],
      body: "Ergänze:\n\nAuf dem Fest ___ ich mit Freunden."
    },
    tg: {
      story: "Vorgeschichte: Die Musik ist laut. Du bewegst dich im Takt — du schwimmst nicht und liest kein Buch.",
      dialog: "Freund: Willst du ___?\nDu: Klar, der Song ist super!",
      options: [
        "tanzen,schwimmen,lesen"
      ],
      correct: [
        "tanzen"
      ]
    }
  },
  {
    lemma: "schwimmen",
    hint: "Wortschatz — im Wasser",
    so: {
      body: "Im Sommer ___ ich im See.",
      options: [
        "schwimme",
        "male",
        "koche"
      ],
      correct: "schwimme"
    },
    ms: {
      body: "Was passt zum Schwimmen? Wähle alle richtigen Antworten.",
      options: [
        "See",
        "Schwimmbad",
        "Sommer",
        "Gitarre",
        "Langeweile"
      ],
      correct: [
        "See",
        "Schwimmbad",
        "Sommer"
      ]
    },
    dd: [
      "Im",
      "Sommer",
      "schwimme",
      "ich",
      "gern",
      "."
    ],
    in: {
      wordChoices: [
        "schwimme",
        "male",
        "koche"
      ],
      correct: [
        "schwimme"
      ],
      body: "Ergänze:\n\nIm Hallenbad ___ ich eine Stunde."
    },
    tg: {
      story: "Vorgeschichte: Es ist heiß. Du gehst ans Wasser und machst Bahnen — du malst nicht und tanzt nicht.",
      dialog: "Freund: Kommst du mit?\nDu: Ja, ich will ___ gehen.",
      options: [
        "schwimmen,malen,tanzen"
      ],
      correct: [
        "schwimmen"
      ]
    }
  },
  {
    lemma: "Kino",
    hint: "Wortschatz — Filme auf der Leinwand",
    so: {
      body: "Am Freitag gehen wir ins ___.",
      options: [
        "Kino",
        "Verein",
        "Fitnessstudio"
      ],
      correct: "Kino"
    },
    ms: {
      body: "Was machst du im Kino? Wähle alle richtigen Antworten.",
      options: [
        "Film sehen",
        "Popcorn",
        "Freunde treffen",
        "trainieren",
        "Grillen"
      ],
      correct: [
        "Film sehen",
        "Popcorn",
        "Freunde treffen"
      ]
    },
    dd: [
      "Wir",
      "gehen",
      "heute",
      "ins",
      "Kino",
      "."
    ],
    in: {
      wordChoices: [
        "Kino",
        "Verein",
        "Fitnessstudio"
      ],
      correct: [
        "Kino"
      ],
      body: "Ergänze:\n\nAm Wochenende gehe ich ins ___."
    },
    tg: {
      story: "Vorgeschichte: Der neue Actionfilm läuft. Ihr kauft Tickets und Popcorn — ihr trainiert nicht im Verein.",
      dialog: "Freund: Gehen wir ins ___?\nDu: Ja, um acht Uhr.",
      options: [
        "Kino,Verein,Park"
      ],
      correct: [
        "Kino"
      ]
    }
  },
  {
    lemma: "Film",
    hint: "Wortschatz — Geschichte auf der Leinwand",
    so: {
      body: "Der ___ war spannend und lustig.",
      options: [
        "Film",
        "Verein",
        "Sport"
      ],
      correct: "Film"
    },
    ms: {
      body: "Was passt zu einem Film? Wähle alle richtigen Antworten.",
      options: [
        "Kino",
        "Freunde",
        "Popcorn",
        "Hausaufgaben",
        "Langeweile"
      ],
      correct: [
        "Kino",
        "Freunde",
        "Popcorn"
      ]
    },
    dd: [
      "Der",
      "Film",
      "war",
      "sehr",
      "lustig",
      "."
    ],
    in: {
      wordChoices: [
        "Film",
        "Verein",
        "Sport"
      ],
      correct: [
        "Film"
      ],
      body: "Ergänze:\n\nGestern habe ich einen guten ___ gesehen."
    },
    tg: {
      story: "Vorgeschichte: Ihr seid im Kino. Die Geschichte dauert zwei Stunden — kein Fußballspiel und kein Konzert.",
      dialog: "Schwester: Wie war der ___?\nDu: Super — ich will ihn nochmal sehen.",
      options: [
        "Film,Konzert,Training"
      ],
      correct: [
        "Film"
      ]
    }
  },
  {
    lemma: "Freizeit",
    hint: "Wortschatz — Zeit nach Arbeit oder Schule",
    so: {
      body: "In meiner ___ lese ich oder treffe Freunde.",
      options: [
        "Freizeit",
        "Schule",
        "Arbeitstag"
      ],
      correct: "Freizeit"
    },
    ms: {
      body: "Was machst du in der Freizeit? Wähle alle richtigen Antworten.",
      options: [
        "Sport",
        "Kino",
        "kochen",
        "Gehalt überweisen",
        "Langeweile"
      ],
      correct: [
        "Sport",
        "Kino",
        "kochen"
      ]
    },
    dd: [
      "In",
      "meiner",
      "Freizeit",
      "habe",
      "ich",
      "Spaß",
      "."
    ],
    in: {
      wordChoices: [
        "Freizeit",
        "Schule",
        "Arbeitstag"
      ],
      correct: [
        "Freizeit"
      ],
      body: "Ergänze:\n\nIn der ___ gehe ich gern wandern."
    },
    tg: {
      story: "Vorgeschichte: Die Schule ist aus. Du hast Zeit für Hobbys — nicht für Bankgeschäfte.",
      dialog: "Freund: Was machst du in deiner ___?\nDu: Sport und Musik.",
      options: [
        "Freizeit,Arbeit,Schule"
      ],
      correct: [
        "Freizeit"
      ]
    }
  },
  {
    lemma: "Wochenende",
    hint: "Wortschatz — Samstag und Sonntag",
    so: {
      body: "Am ___ gehe ich wandern oder ins Kino.",
      options: [
        "Wochenende",
        "Montag",
        "Langeweile"
      ],
      correct: "Wochenende"
    },
    ms: {
      body: "Was machst du am Wochenende? Wähle alle richtigen Antworten.",
      options: [
        "schlafen",
        "Freunde treffen",
        "Sport",
        "TAN eingeben",
        "Hausaufgaben"
      ],
      correct: [
        "schlafen",
        "Freunde treffen",
        "Sport"
      ]
    },
    dd: [
      "Am",
      "Wochenende",
      "treffe",
      "ich",
      "Freunde",
      "."
    ],
    in: {
      wordChoices: [
        "Wochenende",
        "Montag",
        "Langeweile"
      ],
      correct: [
        "Wochenende"
      ],
      body: "Ergänze:\n\nAm ___ spiele ich Fußball."
    },
    tg: {
      story: "Vorgeschichte: Es ist Samstag. Du hast frei und triffst Freunde — kein Schalter und keine Schule.",
      dialog: "Mama: Pläne fürs ___?\nDu: Kino und Rad fahren!",
      options: [
        "Wochenende,Montag,Arbeitstag"
      ],
      correct: [
        "Wochenende"
      ]
    }
  },
  {
    lemma: "Verein",
    hint: "Wortschatz — Gruppe für Sport oder Hobby",
    so: {
      body: "Ich bin in einem ___ aktiv.",
      options: [
        "Verein",
        "Kino",
        "Film"
      ],
      correct: "Verein"
    },
    ms: {
      body: "Was gibt es in einem Verein? Wähle alle richtigen Antworten.",
      options: [
        "Training",
        "Team",
        "Freunde",
        "Hausaufgaben",
        "Rezept"
      ],
      correct: [
        "Training",
        "Team",
        "Freunde"
      ]
    },
    dd: [
      "Ich",
      "bin",
      "im",
      "Sportverein",
      "."
    ],
    in: {
      wordChoices: [
        "Verein",
        "Kino",
        "Film"
      ],
      correct: [
        "Verein"
      ],
      body: "Ergänze:\n\nUnser ___ trifft sich dienstags."
    },
    tg: {
      story: "Vorgeschichte: Du trainierst dienstags mit dem Team im Sportverein — nicht allein zu Hause.",
      dialog: "Trainer: Willkommen im ___!\nDu: Danke, ich freue mich.",
      options: [
        "Verein,Kino,Büro"
      ],
      correct: [
        "Verein"
      ]
    }
  },
  {
    lemma: "Gitarre",
    hint: "Wortschatz — Instrument mit Saiten",
    so: {
      body: "Ich spiele ___.",
      options: [
        "Gitarre",
        "Fußball",
        "Film"
      ],
      correct: "Gitarre"
    },
    ms: {
      body: "Was passt zur Gitarre? Wähle alle richtigen Antworten.",
      options: [
        "Musik",
        "üben",
        "lernen",
        "schwimmen",
        "Grillen"
      ],
      correct: [
        "Musik",
        "üben",
        "lernen"
      ]
    },
    dd: ['Ich', 'spiele', 'jeden', 'Tag', 'Gitarre', '.'],
    in: {
      wordChoices: [
        "Gitarre",
        "Fußball",
        "Film"
      ],
      correct: [
        "Gitarre"
      ],
      body: "Ergänze:\n\nMeine Schwester spielt ___."
    },
    tg: {
      story: "Vorgeschichte: Du nimmst das Instrument aus dem Koffer und übst ein Lied — kein Ball und kein Schwimmen.",
      dialog: "Freund: Spielst du ___?\nDu: Ja, seit einem Jahr.",
      options: [
        "Gitarre,Ball,Schwimmbad"
      ],
      correct: [
        "Gitarre"
      ]
    }
  },
  {
    lemma: "Rad fahren",
    hint: "Wortschatz — draußen unterwegs",
    so: {
      body: "Im Frühling ___ ich gern im Park.",
      options: [
        "fahre Rad",
        "gehe ins Kino",
        "koche"
      ],
      correct: "fahre Rad"
    },
    ms: {
      body: "Was brauchst du zum Rad fahren? Wähle alle richtigen Antworten.",
      options: [
        "Fahrrad",
        "Helm",
        "Weg",
        "Hausaufgaben",
        "Langeweile"
      ],
      correct: [
        "Fahrrad",
        "Helm",
        "Weg"
      ]
    },
    dd: [
      "Am",
      "Sonntag",
      "fahre",
      "ich",
      "Rad",
      "."
    ],
    in: {
      wordChoices: [
        "fahre Rad",
        "gehe ins Kino",
        "koche"
      ],
      correct: [
        "fahre Rad"
      ],
      body: "Ergänze:\n\nMit Freunden ___ wir an den See."
    },
    tg: {
      story: "Vorgeschichte: Das Wetter ist schön. Ihr nehmt die Fahrräder und fahrt los — ihr schwimmt nicht gleich.",
      dialog: "Freund: Wollen wir ___?\nDu: Ja, bis zum See!",
      options: [
        "Rad fahren,schwimmen,schlafen"
      ],
      correct: [
        "Rad fahren"
      ]
    }
  },
  {
    lemma: "wandern",
    hint: "Wortschatz — zu Fuß in der Natur",
    so: {
      body: "Am Wochenende ___ wir in den Bergen.",
      options: [
        "wandern",
        "tanzen",
        "kochen"
      ],
      correct: "wandern"
    },
    ms: {
      body: "Was passt zum Wandern? Wähle alle richtigen Antworten.",
      options: [
        "Berge",
        "Wald",
        "Schuhe",
        "Kino",
        "Büroarbeit"
      ],
      correct: [
        "Berge",
        "Wald",
        "Schuhe"
      ]
    },
    dd: [
      "Wir",
      "wandern",
      "gern",
      "im",
      "Wald",
      "."
    ],
    in: {
      wordChoices: [
        "wandern",
        "tanzen",
        "kochen"
      ],
      correct: [
        "wandern"
      ],
      body: "Ergänze:\n\nIm Herbst ___ ich mit dem Verein."
    },
    tg: {
      story: "Vorgeschichte: Ihr seid im Wald mit Rucksäcken. Ihr geht zu Fuß — kein Auto und kein Film.",
      dialog: "Guide: Heute ___ wir fünf Kilometer.\nDu: Super, frische Luft!",
      options: [
        "wandern,fahren,sitzen"
      ],
      correct: [
        "wandern"
      ]
    }
  },
  {
    lemma: "malen",
    hint: "Wortschatz — Bilder machen",
    so: {
      body: "In der Freizeit ___ ich Landschaften.",
      options: [
        "male",
        "schwimme",
        "tanze"
      ],
      correct: "male"
    },
    ms: {
      body: "Was brauchst du zum Malen? Wähle alle richtigen Antworten.",
      options: [
        "Farben",
        "Papier",
        "Pinsel",
        "Ball",
        "Hausaufgaben"
      ],
      correct: [
        "Farben",
        "Papier",
        "Pinsel"
      ]
    },
    dd: [
      "Ich",
      "male",
      "gern",
      "am",
      "Abend",
      "."
    ],
    in: {
      wordChoices: [
        "male",
        "schwimme",
        "tanze"
      ],
      correct: [
        "male"
      ],
      body: "Ergänze:\n\nAm Sonntag ___ ich ein Bild."
    },
    tg: {
      story: "Vorgeschichte: Du sitzt am Tisch mit Farben und Pinsel. Du machst ein Bild — du spielst kein Fußball.",
      dialog: "Freund: ___ du oft?\nDu: Ja, das entspannt mich.",
      options: [
        "malst,schwimmst,spielst"
      ],
      correct: [
        "malst"
      ]
    }
  },
  {
    lemma: "kochen",
    hint: "Wortschatz — Essen zubereiten",
    so: {
      body: "Am Samstag ___ ich mit Freunden.",
      options: [
        "koche",
        "lese",
        "schwimme"
      ],
      correct: "koche"
    },
    ms: {
      body: "Was passt zum Kochen mit Freunden? Wähle alle richtigen Antworten.",
      options: [
        "Rezept",
        "Küche",
        "Spaß",
        "Langeweile",
        "Langeweile"
      ],
      correct: [
        "Rezept",
        "Küche",
        "Spaß"
      ]
    },
    dd: [
      "Wir",
      "kochen",
      "zusammen",
      "Pizza",
      "."
    ],
    in: {
      wordChoices: [
        "koche",
        "lese",
        "schwimme"
      ],
      correct: [
        "koche"
      ],
      body: "Ergänze:\n\nHeute Abend ___ ich Pasta."
    },
    tg: {
      story: "Vorgeschichte: Deine Freunde kommen zum Essen. Ihr steht in der Küche — ihr geht nicht ins Kino.",
      dialog: "Freund: ___ wir zusammen?\nDu: Ja, ich habe Gemüse dabei.",
      options: [
        "Kochen,Schwimmen,Lesen"
      ],
      correct: [
        "Kochen"
      ]
    }
  },
  {
    lemma: "Freunde",
    hint: "Wortschatz — Personen, die dir wichtig sind",
    so: {
      body: "Am Wochenende treffe ich ___.",
      options: [
        "Freunde",
        "Hausaufgaben",
        "Schularbeiten"
      ],
      correct: "Freunde"
    },
    ms: {
      body: "Was machst du mit Freunden? Wähle alle richtigen Antworten.",
      options: [
        "Kino",
        "Sport",
        "kochen",
        "Hausaufgaben",
        "Hausaufgaben"
      ],
      correct: [
        "Kino",
        "Sport",
        "kochen"
      ]
    },
    dd: [
      "Ich",
      "treffe",
      "meine",
      "Freunde",
      "."
    ],
    in: {
      wordChoices: [
        "Freunde",
        "Hausaufgaben",
        "Schularbeiten"
      ],
      correct: [
        "Freunde"
      ],
      body: "Ergänze:\n\nIm Park treffe ich ___ aus der Schule."
    },
    tg: {
      story: "Vorgeschichte: Du schreibst deinen Klassenkameraden. Ihr wollt zusammen raus — nicht zur Bank.",
      dialog: "Du: Treffen wir uns mit ___?\nSchwester: Gute Idee!",
      options: [
        "Freunden,Lehrern,Schule"
      ],
      correct: [
        "Freunden"
      ]
    }
  },
  {
    lemma: "Spaß",
    hint: "Wortschatz — Freude und gute Stimmung",
    so: {
      body: "Fußball macht mir ___.",
      options: [
        "Spaß",
        "Langeweile",
        "Langeweile"
      ],
      correct: "Spaß"
    },
    ms: {
      body: "Was macht Spaß? Wähle alle richtigen Antworten.",
      options: [
        "tanzen",
        "spielen",
        "Freunde",
        "Hausaufgaben",
        "TAN"
      ],
      correct: [
        "tanzen",
        "spielen",
        "Freunde"
      ]
    },
    dd: [
      "Sport",
      "macht",
      "mir",
      "Spaß",
      "."
    ],
    in: {
      wordChoices: [
        "Spaß",
        "Langeweile",
        "Langeweile"
      ],
      correct: [
        "Spaß"
      ],
      body: "Ergänze:\n\nIm Verein habe ich viel ___."
    },
    tg: {
      story: "Vorgeschichte: Das Spiel ist vorbei. Alle lachen — niemand ist gelangweilt oder müde vom Formular.",
      dialog: "Freund: Hat es ___ gemacht?\nDu: Ja, total!",
      options: [
        "Spaß,Langeweile,Hausaufgaben"
      ],
      correct: [
        "Spaß"
      ]
    }
  }
];
