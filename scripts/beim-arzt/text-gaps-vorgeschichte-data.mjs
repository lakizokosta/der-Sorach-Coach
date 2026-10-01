/** text-gaps bodies with Vorgeschichte — unique answers from context */

export const TG = {
  'a2-arzt-tg-001': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Kopfschmerzen,Fieber,Husten'],
    correct: ['Kopfschmerzen'],
    body: `Vorgeschichte: Seit heute Morgen tut nur Ihr Kopf weh. Sie haben keine hohe Temperatur und keinen Husten.

Arzt: Was fehlt Ihnen?
Patient: Ich habe ___.`,
  },
  'a2-arzt-tg-002': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Fieber,Husten,Schnupfen', 'drei,zehn,zwölf'],
    correct: ['Fieber', 'drei'],
    body: `Vorgeschichte: Sie fühlen sich heiß und schwach. Die Beschwerden begannen am Montag. Heute ist Donnerstag.

Arzt: Welches Hauptproblem haben Sie — ___?
Patient: Und das schon seit ___ Tagen.`,
  },
  'a2-arzt-tg-003': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Termin,Rezept,Attest'],
    correct: ['Termin'],
    body: `Vorgeschichte: Sie möchten den Arzt erst morgen sehen. Sie brauchen noch kein Rezept und kein Attest.

Patient: Können Sie mir einen ___ geben?
Rezeption: Ja, morgen um zehn.`,
  },
  'a2-arzt-tg-004': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Rezept,Termin,Impfung', 'Apotheke,Praxis,Rezeption'],
    correct: ['Rezept', 'Apotheke'],
    body: `Vorgeschichte: Der Arzt gibt Ihnen ein Papier für Medikamente. Medikamente holt man nicht an der Rezeption.

Arzt: Hier ist Ihr ___.
Patient: Danke, ich gehe in die ___.`,
  },
  'a2-arzt-tg-005': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Husten,Fieber,Kopfschmerzen'],
    correct: ['Husten'],
    body: `Vorgeschichte: Nachts müssen Sie oft husten. Der Kopf tut nicht weh, und die Temperatur ist normal.

Arzt: Was haben Sie genau?
Patient: Ich habe starken ___.`,
  },
  'a2-arzt-tg-006': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Wartezimmer,Untersuchungszimmer,Apotheke'],
    correct: ['Wartezimmer'],
    body: `Vorgeschichte: Der Arzt ist noch beschäftigt. Sie sollen zuerst sitzen und warten — nicht in die Apotheke gehen.

Rezeption: Bitte warten Sie im ___.
Patient: Gut, danke.`,
  },
  'a2-arzt-tg-007': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Versicherungskarte,Rezept,Attest'],
    correct: ['Versicherungskarte'],
    body: `Vorgeschichte: An der Anmeldung braucht man die Karte der Krankenkasse — nicht das Rezept und nicht das Attest.

Rezeption: Haben Sie Ihre ___ dabei?
Patient: Ja, einen Moment bitte.`,
  },
  'a2-arzt-tg-008': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['dreimal,einmal,nie', 'Tablette,Salbe,Tropfen'],
    correct: ['dreimal', 'Tablette'],
    body: `Vorgeschichte: Das Medikament ist zum Schlucken, nicht für die Haut und nicht für die Augen. Der Arzt sagt: morgens, mittags und abends.

Arzt: Nehmen Sie ___ am Tag eine ___.
Patient: Verstehe, danke.`,
  },
  'a2-arzt-tg-009': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Halsschmerzen,Zahnschmerzen,Fieber'],
    correct: ['Halsschmerzen'],
    body: `Vorgeschichte: Beim Schlucken tut der Hals weh. Die Zähne sind in Ordnung, die Temperatur ist normal.

Arzt: Wo tut es weh?
Patient: Ich habe ___.`,
  },
  'a2-arzt-tg-010': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Schnupfen,Fieber,Ausschlag', 'Husten,Fieber,Kopfschmerzen'],
    correct: ['Schnupfen', 'Husten'],
    body: `Vorgeschichte: Sie haben eine Erkältung: die Nase läuft, und Sie husten. Kein Ausschlag, kein Fieber.

Arzt: Welche Symptome haben Sie?
Patient: ___ und ___.`,
  },
  'a2-arzt-tg-011': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Bauchschmerzen,Tablette,Rezept'],
    correct: ['Bauchschmerzen'],
    body: `Vorgeschichte: Nach dem Essen tut der Bauch weh. Sie brauchen gerade kein Rezept und keine Tablette vom Arzt.

Arzt: Seit wann ist das so?
Patient: Die ___ habe ich seit gestern.`,
  },
  'a2-arzt-tg-012': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Allergie,Impfung,Infektion', 'Penicillin,Aspirin,Vitamin'],
    correct: ['Allergie', 'Penicillin'],
    body: `Vorgeschichte: Früher bekamen Sie nach Penicillin Hautausschlag. Es geht nicht um eine Impfung und nicht um Vitamine.

Arzt: Haben Sie eine ___?
Patient: Ja, gegen ___.`,
  },
  'a2-arzt-tg-013': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Salbe,Tablette,Tropfen'],
    correct: ['Salbe'],
    body: `Vorgeschichte: Das Mittel ist für die Haut, nicht zum Schlucken und nicht für die Augen.

Arzt: Streichen Sie die ___ auf die Haut.
Patient: Gut, mache ich.`,
  },
  'a2-arzt-tg-014': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Zahnschmerzen,Halsschmerzen,Fieber'],
    correct: ['Zahnschmerzen'],
    body: `Vorgeschichte: Ein Zahn tut stark weh. Der Hals ist frei, die Temperatur ist normal. Sie sind beim Zahnarzt.

Patient: Ich habe starke ___.
Arzt: Dann schaue ich mir den Zahn an.`,
  },
  'a2-arzt-tg-015': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Krankenkasse,Apotheke,Praxis'],
    correct: ['Krankenkasse'],
    body: `Vorgeschichte: Die Rezeption fragt nach Ihrer Versicherung — nicht nach der Apotheke und nicht nach einer anderen Praxis.

Rezeption: Bei welcher ___ sind Sie?
Patient: Bei der AOK.`,
  },
  'a2-arzt-tg-016': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Tropfen,Tablette,Salbe'],
    correct: ['Tropfen'],
    body: `Vorgeschichte: Das Mittel ist flüssig für die Augen — keine Tablette und keine Salbe für die Haut.

Arzt: Für die Augen bekommen Sie ___.
Patient: Wie oft soll ich sie nehmen?`,
  },
  'a2-arzt-tg-017': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Rückenschmerzen,Fieber,Husten', 'weh,gut,kalt'],
    correct: ['Rückenschmerzen', 'weh'],
    body: `Vorgeschichte: Nach der Arbeit tut der Rücken weh. Sie haben kein Fieber und keinen Husten.

Arzt: Was ist das Problem?
Patient: Ich habe ___. Der Rücken tut mir ___.`,
  },
  'a2-arzt-tg-018': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Rezeption,Apotheke,Wartezimmer'],
    correct: ['Rezeption'],
    body: `Vorgeschichte: Zuerst müssen Sie sich anmelden. Das Wartezimmer kommt danach, die Apotheke ist woanders.

Schild: Bitte melden Sie sich zuerst an der ___.
Patient: Gut, ich gehe dorthin.`,
  },
  'a2-arzt-tg-019': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Praxis,Apotheke,Notaufnahme', 'acht,zwölf,drei'],
    correct: ['Praxis', 'acht'],
    body: `Vorgeschichte: Ihr Hausarzt öffnet morgens um 8:00. Sie fragen nicht nach der Apotheke und nicht nach der Notaufnahme.

Patient: Wann öffnet die ___?
Rezeption: Um ___ Uhr.`,
  },
  'a2-arzt-tg-020': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Ruhe,Medikamente,Sport', 'trinken,laufen,rauchen'],
    correct: ['Ruhe', 'trinken'],
    body: `Vorgeschichte: Bei Erkältung rät der Arzt: zu Hause bleiben, sich schonen und viel Flüssigkeit. Kein Sport und nicht rauchen.

Arzt: Bleiben Sie zu Hause und halten Sie ___.
Patient: Soll ich auch viel ___?
Arzt: Ja, bitte.`,
  },

  'b1-arzt-tg-001': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Untersuchung,Überweisung,Krankschreibung'],
    correct: ['Untersuchung'],
    body: `Vorgeschichte: Der Arzt will Sie jetzt untersuchen. Eine Überweisung und eine Krankschreibung kommen später.

Arzt: Ich beginne mit der ___.
Patient: Gut, ich bin bereit.`,
  },
  'b1-arzt-tg-002': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Überweisung,Krankschreibung,Attest', 'Facharzt,Hausarzt,Zahnarzt'],
    correct: ['Überweisung', 'Facharzt'],
    body: `Vorgeschichte: Ihr Hausarzt schickt Sie zu einem Spezialisten für Haut. Sie brauchen kein Attest für die Schule.

Arzt: Ich stelle Ihnen eine ___ zum ___ aus.
Patient: Danke, das hilft mir.`,
  },
  'b1-arzt-tg-003': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Krankschreibung,Überweisung,Rezept', 'drei,zehn,zwölf'],
    correct: ['Krankschreibung', 'drei'],
    body: `Vorgeschichte: Sie können Freitag, Samstag und Sonntag nicht arbeiten — also drei Tage. Sie brauchen kein Rezept und keine Überweisung.

Patient: Ich brauche eine ___ für ___ Tage.
Arzt: In Ordnung, ich stelle sie aus.`,
  },
  'b1-arzt-tg-004': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Blutdruck,Blutuntersuchung,Fieber'],
    correct: ['Blutdruck'],
    body: `Vorgeschichte: Die Messung am Arm zeigt zu hohe Werte. Es geht nicht um Fieber und nicht um das Labor.

Arzt: Ihr ___ ist erhöht.
Patient: Was soll ich tun?`,
  },
  'b1-arzt-tg-005': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Nebenwirkungen,Überweisungen,Impfungen'],
    correct: ['Nebenwirkungen'],
    body: `Vorgeschichte: Nach den neuen Tabletten ist Ihnen übel. Der Arzt fragt nach unerwünschten Wirkungen — nicht nach Impfungen.

Arzt: Haben Sie ___ bemerkt?
Patient: Ja, leichte Übelkeit.`,
  },
  'b1-arzt-tg-006': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Atemnot,Schwindel,Husten'],
    correct: ['Atemnot'],
    body: `Vorgeschichte: Beim Laufen fehlt Ihnen die Luft. Sie haben keinen Schwindel und keinen Husten.

Patient: Beim Sport bekomme ich ___.
Arzt: Das müssen wir abklären.`,
  },
  'b1-arzt-tg-007': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Ausschlag,Schwellung,Fieber', 'juckt,brennt,heilt'],
    correct: ['Ausschlag', 'juckt'],
    body: `Vorgeschichte: Am Arm sind viele rote Punkte. Es ist keine Schwellung und kein Fieber. Die Stelle juckt stark.

Patient: Ich habe einen ___ am Arm.
Arzt: ___ er stark?`,
  },
  'b1-arzt-tg-008': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Impfung,Untersuchung,Überweisung'],
    correct: ['Impfung'],
    body: `Vorgeschichte: Es ist Grippesaison. Sie möchten den Schutz gegen Grippe — keine Überweisung.

Rezeption: Möchten Sie heute die Grippe-___?
Patient: Ja, bitte.`,
  },
  'b1-arzt-tg-009': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Röntgen,Impfung,Attest'],
    correct: ['Röntgen'],
    body: `Vorgeschichte: Der Arzt will ein Bild von der Lunge. Es geht nicht um eine Impfung und nicht um ein Attest.

Arzt: Wir brauchen ein ___ der Lunge.
Patient: Wann kann ich kommen?`,
  },
  'b1-arzt-tg-010': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Schwellung,Ausschlag,Atemnot'],
    correct: ['Schwellung'],
    body: `Vorgeschichte: Der Knöchel ist dick nach dem Umknicken. Kein Ausschlag, keine Atemnot.

Arzt: Die ___ am Knöchel ist noch sichtbar.
Patient: Soll ich kühlen?`,
  },
  'b1-arzt-tg-011': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['chronisch,akut,nüchtern'],
    correct: ['chronisch'],
    body: `Vorgeschichte: Die Schmerzen kommen seit Monaten immer wieder. Das ist kein einmaliger akuter Fall und nicht das Thema „nüchtern“.

Arzt: Die Beschwerden wirken ___.
Patient: Ja, seit Monaten.`,
  },
  'b1-arzt-tg-012': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Blutuntersuchung,Röntgen,Impfung', 'nüchtern,chronisch,allergisch'],
    correct: ['Blutuntersuchung', 'nüchtern'],
    body: `Vorgeschichte: Morgen soll Blut abgenommen werden. Dafür dürfen Sie vorher nichts essen.

Arzt: Kommen Sie zur ___ bitte ___.
Patient: Also ohne Frühstück?`,
  },
  'b1-arzt-tg-013': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Attest,Rezept,Überweisung'],
    correct: ['Attest'],
    body: `Vorgeschichte: Die Schule verlangt eine ärztliche Bescheinigung. Sie brauchen kein Rezept und keine Überweisung.

Patient: Für die Schule brauche ich ein ___.
Arzt: Das bekommen Sie gleich.`,
  },
  'b1-arzt-tg-014': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['stechend,nüchtern,ambulant'],
    correct: ['stechend'],
    body: `Vorgeschichte: Der Schmerz kommt plötzlich wie ein Stich, besonders rechts. „Nüchtern“ und „ambulant“ beschreiben den Schmerz nicht.

Arzt: Wie fühlt sich der Schmerz an?
Patient: Eher ___, besonders rechts.`,
  },
  'b1-arzt-tg-015': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Notfall,Termin,Kontrolle'],
    correct: ['Notfall'],
    body: `Vorgeschichte: Plötzlich starke Brustschmerzen — das ist dringend, kein normaler Termin und keine Routinekontrolle.

Arzt: Bei Brustschmerzen ist das ein ___.
Patient: Soll ich den Rettungsdienst rufen?`,
  },
  'b1-arzt-tg-016': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['verschreibe,untersuche,überweise', 'Antibiotikum,Schmerzmittel,Vitamin'],
    correct: ['verschreibe', 'Antibiotikum'],
    body: `Vorgeschichte: Es liegt eine bakterielle Infektion vor. Der Arzt gibt ein Mittel gegen Bakterien auf Rezept — kein Vitamin.

Arzt: Ich ___ Ihnen ein ___.
Patient: Wie lange soll ich es nehmen?`,
  },
  'b1-arzt-tg-017': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Hausarzt,Facharzt,Zahnarzt'],
    correct: ['Hausarzt'],
    body: `Vorgeschichte: Ihr erster Arzt hat Sie hierhergeschickt. Es war nicht der Zahnarzt und noch kein Termin bei einem Spezialisten.

Rezeption: Haben Sie schon Ihren ___ gefragt?
Patient: Ja, er hat mich hergeschickt.`,
  },
  'b1-arzt-tg-018': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Verlauf,Befund,Therapie'],
    correct: ['Verlauf'],
    body: `Vorgeschichte: Der Arzt will wissen, wie sich die Symptome entwickelt haben — zuerst leicht, dann stärker. Noch kein Befund und keine Therapie.

Arzt: Beschreiben Sie den ___ der Symptome.
Patient: Zuerst leicht, dann stärker.`,
  },
  'b1-arzt-tg-019': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Facharzt,Hausarzt,Notarzt', 'Wartezeit,Untersuchungszeit,Öffnungszeit'],
    correct: ['Facharzt', 'Wartezeit'],
    body: `Vorgeschichte: Der Spezialist hat erst in vier Wochen einen freien Termin. Es geht um die Wartezeit, nicht um die Öffnungszeit der Praxis.

Patient: Der ___ hat eine lange ___.
Rezeption: Ja, etwa vier Wochen.`,
  },
  'b1-arzt-tg-020': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['dumpf,stechend,chronisch', 'anhaltend,plötzlich,selten'],
    correct: ['dumpf', 'anhaltend'],
    body: `Vorgeschichte: Der Schmerz ist nicht wie ein Stich. Er fühlt sich schwer und druckartig an und bleibt den ganzen Tag.

Arzt: Ist der Schmerz stechend oder ___?
Patient: Eher so, und er ist ___.`,
  },

  'b2-arzt-tg-001': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Anamnese,Diagnose,Therapie'],
    correct: ['Anamnese'],
    body: `Vorgeschichte: Am Anfang der Konsultation erhebt die Ärztin die Krankengeschichte. Diagnose und Therapie kommen danach.

Ärztin: Zuerst führen wir die ___ durch.
Patient: Selbstverständlich.`,
  },
  'b2-arzt-tg-002': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Befund,Verordnung,Aufnahme', 'unauffällig,kritisch,chronisch'],
    correct: ['Befund', 'unauffällig'],
    body: `Vorgeschichte: Das Röntgenbild zeigt nichts Auffälliges. Es geht um das Untersuchungsergebnis, nicht um eine Verordnung oder Aufnahme.

Arzt: Der ___ ist ___.
Patient: Das beruhigt mich.`,
  },
  'b2-arzt-tg-003': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Diagnose,Anamnese,Nachsorge'],
    correct: ['Diagnose'],
    body: `Vorgeschichte: Die Befunde liegen vor. Der Arzt benennt jetzt die Erkrankung — die Anamnese ist schon fertig.

Arzt: Die ___ besprechen wir anhand der Befunde.
Patient: Bitte erklären Sie es mir klar.`,
  },
  'b2-arzt-tg-004': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['ambulant,stationär,chronisch', 'stationär,ambulant,nüchtern'],
    correct: ['ambulant', 'stationär'],
    body: `Vorgeschichte: Der kleine Eingriff braucht keine Übernachtung im Krankenhaus. Sie gehen am selben Tag nach Hause.

Arzt: Der Eingriff erfolgt ___. Sie müssen nicht ___ aufgenommen werden.
Patient: Gut, dann kann ich abends nach Hause.`,
  },
  'b2-arzt-tg-005': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Notaufnahme,Rezeption,Apotheke'],
    correct: ['Notaufnahme'],
    body: `Vorgeschichte: Die Schmerzen sind akut und stark. In der Klinik gehen Sie nicht zuerst in die Apotheke, sondern in die Notfallambulanz.

Rezeption Klinik: Bei akuten Schmerzen melden Sie sich in der ___.
Patient: Verstehe, danke.`,
  },
  'b2-arzt-tg-006': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Wechselwirkung,Nebenwirkung,Verträglichkeit'],
    correct: ['Wechselwirkung'],
    body: `Vorgeschichte: Ihr neues Medikament verändert die Wirkung Ihres Blutverdünners. Es geht um die Interaktion zweier Mittel.

Arzt: Es gibt eine ___ mit Ihrem anderen Medikament.
Patient: Soll ich es absetzen?`,
  },
  'b2-arzt-tg-007': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Überweisungsschein,Rezept,Attest'],
    correct: ['Überweisungsschein'],
    body: `Vorgeschichte: Für die Ambulanz brauchen Sie das Formular vom Hausarzt. Ein Rezept für Tabletten oder ein Attest reichen hier nicht.

Ambulanz: Haben Sie den ___ dabei?
Patient: Ja, vom Hausarzt.`,
  },
  'b2-arzt-tg-008': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Einweisung,Entlassung,Nachsorge', 'heute,morgen,sofort'],
    correct: ['Einweisung', 'heute'],
    body: `Vorgeschichte: Der Zustand ist so ernst, dass Sie noch am selben Tag ins Krankenhaus müssen — nicht entlassen werden und nicht auf Nachsorge warten.

Arzt: Ich veranlasse die ___ für ___.
Patient: Muss ich Toilettenartikel mitbringen?`,
  },
  'b2-arzt-tg-009': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Therapie,Anamnese,Aufnahme'],
    correct: ['Therapie'],
    body: `Vorgeschichte: Die Diagnose steht. Nächste Woche beginnt die Behandlung. Die Anamnese ist schon vorbei.

Arzt: Wir starten die ___ nächste Woche.
Patient: Welche Nebenwirkungen sind möglich?`,
  },
  'b2-arzt-tg-010': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Genesung,Einweisung,Verordnung'],
    correct: ['Genesung'],
    body: `Vorgeschichte: Nach der OP brauchen Sie Ruhe, damit Sie wieder gesund werden. Es geht nicht um eine neue Einweisung.

Arzt: Für Ihre ___ vermeiden Sie bitte Belastung.
Patient: Wie lange ungefähr?`,
  },
  'b2-arzt-tg-011': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Indikation,Kontraindikation,Diagnose'],
    correct: ['Indikation'],
    body: `Vorgeschichte: Der Nutzen der Operation ist klar begründet. Es liegt keine Gegenanzeige vor; die Diagnose kennen Sie schon.

Arzt: Die ___ für den Eingriff ist klar.
Patient: Welche Risiken gibt es?`,
  },
  'b2-arzt-tg-012': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Kontraindikation,Indikation,Verträglichkeit'],
    correct: ['Kontraindikation'],
    body: `Vorgeschichte: Wegen Ihrer Allergie darf dieses Medikament nicht gegeben werden. Das ist eine Gegenanzeige.

Arzt: Leider liegt eine ___ vor.
Patient: Welche Alternative gibt es?`,
  },
  'b2-arzt-tg-013': {
    hint: 'Lesen Sie die Situation',
    options: ['Vorgeschichte,Nachsorge,Verordnung', 'Operationen,Impfungen,Allergien'],
    correct: ['Vorgeschichte', 'Operationen'],
    body: `Situation: Vor zwei Jahren wurden Sie schon einmal operiert. Der Arzt fragt nach früheren Eingriffen in Ihrer medizinischen Historie.

Arzt: In Ihrer ___ gab es bereits ___?
Patient: Ja, vor zwei Jahren.`,
  },
  'b2-arzt-tg-014': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Beschwerden,Befunde,Verordnungen'],
    correct: ['Beschwerden'],
    body: `Vorgeschichte: Seit zehn Tagen geht es Ihnen schlecht. Der Arzt fragt nach Ihren Symptomen — noch nicht nach Laborbefunden.

Arzt: Seit wann bestehen die ___?
Patient: Etwa seit zehn Tagen.`,
  },
  'b2-arzt-tg-015': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Aufnahme,Entlassung,Nachsorge', 'Station,Ambulanz,Apotheke'],
    correct: ['Aufnahme', 'Station'],
    body: `Vorgeschichte: Sie kommen heute ins Krankenhaus und bekommen ein Bett auf einer Station — nicht in die Ambulanz und nicht in die Apotheke.

Pflege: Nach der ___ kommen Sie auf die ___.
Patient: Welche Nummer?`,
  },
  'b2-arzt-tg-016': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Entlassung,Aufnahme,Einweisung', 'Medikationsplan,Therapieplan,Terminplan'],
    correct: ['Entlassung', 'Medikationsplan'],
    body: `Vorgeschichte: Morgen dürfen Sie die Klinik verlassen. Sie bekommen schriftlich, welche Medikamente Sie wie einnehmen sollen.

Arzt: Vor der ___ erhalten Sie den ___.
Patient: Danke, das brauche ich.`,
  },
  'b2-arzt-tg-017': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Nachsorge,Anamnese,Einweisung'],
    correct: ['Nachsorge'],
    body: `Vorgeschichte: Nach dem Eingriff folgen Kontrollen ambulant. Es geht nicht um eine neue Einweisung und nicht um die erste Anamnese.

Arzt: Die ___ übernehmen wir ambulant.
Patient: Wann ist der Termin?`,
  },
  'b2-arzt-tg-018': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Verordnung,Überweisung,Anamnese'],
    correct: ['Verordnung'],
    body: `Vorgeschichte: Der Arzt hat die Dosis genau festgelegt. Sie sollen den Plan nicht selbst ändern — es geht nicht um eine Überweisung.

Arzt: Ändern Sie die ___ bitte nicht selbst.
Patient: Verstanden.`,
  },
  'b2-arzt-tg-019': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['Verträglichkeit,Wechselwirkung,Nebenwirkung', 'Nebenwirkungen,Wechselwirkungen,Beschwerden'],
    correct: ['Verträglichkeit', 'Nebenwirkungen'],
    body: `Vorgeschichte: Das neue Mittel vertragen Sie gut: keine Übelkeit, kein Hautausschlag. Der Arzt fragt nach der Verträglichkeit.

Arzt: Wie ist die ___?
Patient: Gut, ohne ___.`,
  },
  'b2-arzt-tg-020': {
    hint: 'Lesen Sie die Vorgeschichte',
    options: ['stationär,ambulant,nüchtern'],
    correct: ['stationär'],
    body: `Vorgeschichte: Wegen einer Komplikation müssen Sie im Krankenhaus bleiben und übernachten — nicht ambulant nach Hause.

Arzt: Wegen der Komplikation behandeln wir Sie ___.
Patient: Wie lange bleibe ich?`,
  },
};
