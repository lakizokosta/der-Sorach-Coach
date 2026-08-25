/** B1 lemma specs — Job suche (Sie-Register) */

export const b1Words = [
  {
    lemma: 'Stellenmarkt',
    hint: 'Wortschatz — Angebot und Nachfrage nach Arbeitsplätzen',
    so: {
      body: 'Auf dem ___ finden Sie viele offene Positionen.',
      options: ['Stellenmarkt', 'Arbeitsvertrag', 'Probezeit'],
      correct: 'Stellenmarkt',
    },
    ms: {
      body: 'Was finden Sie auf dem Stellenmarkt? Wählen Sie alle richtigen Antworten.',
      options: ['Stellenangebote', 'Jobportale', 'Bewerbungsfristen', 'Kündigung', 'Arbeitszeugnis'],
      correct: ['Stellenangebote', 'Jobportale', 'Bewerbungsfristen'],
    },
    dd: ['Auf', 'dem', 'Stellenmarkt', 'suche', 'ich', 'einen', 'Job', '.'],
    in: {
      wordChoices: ['Stellenmarkt', 'Arbeitsvertrag', 'Probezeit'],
      correct: ['Stellenmarkt'],
      body: 'Ergänzen Sie:\n\nSeit Wochen durchsuchen Sie den ___ online.',
    },
    tg: {
      story: 'Vorgeschichte: Sie suchen eine neue Stelle und vergleichen Angebote auf Jobportalen. Sie lesen Stellenangebote — kein Arbeitsvertrag und keine Probezeit.',
      dialog: 'Berater: Wo suchen Sie?\nSie: Auf dem ___ und in der Branche IT.',
      options: ['Stellenmarkt,Arbeitsvertrag,Probezeit'],
      correct: ['Stellenmarkt'],
    },
  },
  {
    lemma: 'Bewerbungsunterlagen',
    hint: 'Wortschatz — Dokumente für eine Bewerbung',
    so: {
      body: 'Bitte senden Sie Ihre ___ per E-Mail.',
      options: ['Bewerbungsunterlagen', 'Kündigung', 'Überstunden'],
      correct: 'Bewerbungsunterlagen',
    },
    ms: {
      body: 'Was gehört zu Bewerbungsunterlagen? Wählen Sie alle richtigen Antworten.',
      options: ['Lebenslauf', 'Anschreiben', 'Arbeitszeugnis', 'Mindestlohn', 'Homeoffice'],
      correct: ['Lebenslauf', 'Anschreiben', 'Arbeitszeugnis'],
    },
    dd: ['Meine', 'Bewerbungsunterlagen', 'sind', 'vollständig', '.'],
    in: {
      wordChoices: ['Bewerbungsunterlagen', 'Kündigung', 'Überstunden'],
      correct: ['Bewerbungsunterlagen'],
      body: 'Ergänzen Sie:\n\nVor dem Gespräch prüfen Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie bereiten eine Bewerbung vor: Lebenslauf, Anschreiben und Zeugnisse liegen bereit — keine Kündigung und keine Überstundenliste.',
      dialog: 'Personalabteilung: Haben Sie Ihre ___ dabei?\nSie: Ja, alles ist ausgedruckt.',
      options: ['Bewerbungsunterlagen,Kündigung,Überstunden'],
      correct: ['Bewerbungsunterlagen'],
    },
  },
  {
    lemma: 'Anschreiben',
    hint: 'Wortschatz — persönlicher Begleittext zur Bewerbung',
    so: {
      body: 'In Ihrem ___ erklären Sie, warum Sie sich bewerben.',
      options: ['Anschreiben', 'Arbeitsvertrag', 'Mindestlohn'],
      correct: 'Anschreiben',
    },
    ms: {
      body: 'Was gehört ins Anschreiben? Wählen Sie alle richtigen Antworten.',
      options: ['Motivation', 'Qualifikationen', 'Anrede', 'Probezeit', 'Überstunden'],
      correct: ['Motivation', 'Qualifikationen', 'Anrede'],
    },
    dd: ['Mein', 'Anschreiben', 'ist', 'fertig', '.'],
    in: {
      wordChoices: ['Anschreiben', 'Arbeitsvertrag', 'Mindestlohn'],
      correct: ['Anschreiben'],
      body: 'Ergänzen Sie:\n\nHeute schreiben Sie Ihr ___ für die Marketingstelle.',
    },
    tg: {
      story: 'Vorgeschichte: Sie formulieren, warum die Stelle zu Ihnen passt. Motivation und Qualifikationen stehen im Text — kein Arbeitsvertrag und kein Mindestlohn.',
      dialog: 'Coach: Ist Ihr ___ überzeugend?\nSie: Ja, ich habe es dreimal überarbeitet.',
      options: ['Anschreiben,Arbeitsvertrag,Mindestlohn'],
      correct: ['Anschreiben'],
    },
  },
  {
    lemma: 'Arbeitszeugnis',
    hint: 'Wortschatz — schriftliche Bewertung durch den Arbeitgeber',
    so: {
      body: 'Ihr letztes ___ liegt der Bewerbung bei.',
      options: ['Arbeitszeugnis', 'Stellenangebot', 'Homeoffice'],
      correct: 'Arbeitszeugnis',
    },
    ms: {
      body: 'Was steht in einem Arbeitszeugnis? Wählen Sie alle richtigen Antworten.',
      options: ['Aufgaben', 'Leistung', 'Verhalten', 'Bewerbungsfrist', 'Branche'],
      correct: ['Aufgaben', 'Leistung', 'Verhalten'],
    },
    dd: ['Mein', 'Arbeitszeugnis', 'ist', 'sehr', 'gut', '.'],
    in: {
      wordChoices: ['Arbeitszeugnis', 'Stellenangebot', 'Homeoffice'],
      correct: ['Arbeitszeugnis'],
      body: 'Ergänzen Sie:\n\nDie Personalabteilung verlangt ein aktuelles ___.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr früherer Chef hat Ihre Leistung schriftlich bestätigt. Aufgaben und Verhalten sind dokumentiert — kein Stellenangebot und kein Homeoffice.',
      dialog: 'Recruiter: Haben Sie ein ___?\nSie: Ja, mit sehr guter Note.',
      options: ['Arbeitszeugnis,Stellenangebot,Homeoffice'],
      correct: ['Arbeitszeugnis'],
    },
  },
  {
    lemma: 'Referenz',
    hint: 'Wortschatz — Empfehlung durch Vorgesetzten oder Kollegen',
    so: {
      body: 'Ihr ehemaliger Chef gibt Ihnen eine ___.',
      options: ['Referenz', 'Kündigung', 'Überstunden'],
      correct: 'Referenz',
    },
    ms: {
      body: 'Was kann eine Referenz bestätigen? Wählen Sie alle richtigen Antworten.',
      options: ['Zuverlässigkeit', 'Fachkenntnisse', 'Teamarbeit', 'Mindestlohn', 'Probezeit'],
      correct: ['Zuverlässigkeit', 'Fachkenntnisse', 'Teamarbeit'],
    },
    dd: ['Mein', 'Chef', 'gibt', 'mir', 'eine', 'Referenz', '.'],
    in: {
      wordChoices: ['Referenz', 'Kündigung', 'Überstunden'],
      correct: ['Referenz'],
      body: 'Ergänzen Sie:\n\nIm Vorstellungsgespräch nennen Sie eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Vorgesetzter bestätigt Ihre Zuverlässigkeit am Telefon. Er empfiehlt Sie — keine Kündigung und keine Überstunden.',
      dialog: 'HR: Können Sie eine ___ vorlegen?\nSie: Ja, mein Projektleiter bestätigt das gern.',
      options: ['Referenz,Kündigung,Überstunden'],
      correct: ['Referenz'],
    },
  },
  {
    lemma: 'Probezeit',
    hint: 'Wortschatz — erste Monate in einem neuen Job',
    so: {
      body: 'In der ___ zeigen Sie, was Sie können.',
      options: ['Probezeit', 'Bewerbungsfrist', 'Branche'],
      correct: 'Probezeit',
    },
    ms: {
      body: 'Was gehört zur Probezeit? Wählen Sie alle richtigen Antworten.',
      options: ['Einarbeitung', 'Feedback', 'Leistungsprüfung', 'Stellenmarkt', 'Anschreiben'],
      correct: ['Einarbeitung', 'Feedback', 'Leistungsprüfung'],
    },
    dd: ['Meine', 'Probezeit', 'dauert', 'sechs', 'Monate', '.'],
    in: {
      wordChoices: ['Probezeit', 'Bewerbungsfrist', 'Branche'],
      correct: ['Probezeit'],
      body: 'Ergänzen Sie:\n\nNach der ___ unterschreiben Sie den Festvertrag.',
    },
    tg: {
      story: 'Vorgeschichte: Sie sind neu in der Firma und werden eingearbeitet. Feedback und Leistungsprüfung laufen — keine Bewerbungsfrist und kein Anschreiben.',
      dialog: 'Vorgesetzter: Wie läuft Ihre ___?\nSie: Gut, ich lerne schnell.',
      options: ['Probezeit,Bewerbungsfrist,Anschreiben'],
      correct: ['Probezeit'],
    },
  },
  {
    lemma: 'Kündigung',
    hint: 'Wortschatz — Beendigung eines Arbeitsverhältnisses',
    so: {
      body: 'Ihre ___ muss schriftlich erfolgen.',
      options: ['Kündigung', 'Stellenangebot', 'Weiterbildung'],
      correct: 'Kündigung',
    },
    ms: {
      body: 'Was gehört zur Kündigung? Wählen Sie alle richtigen Antworten.',
      options: ['Kündigungsfrist', 'schriftliche Form', 'Arbeitszeugnis', 'Karriere', 'Teamarbeit'],
      correct: ['Kündigungsfrist', 'schriftliche Form', 'Arbeitszeugnis'],
    },
    dd: ['Meine', 'Kündigung', 'reiche', 'ich', 'nächste', 'Woche', 'ein', '.'],
    in: {
      wordChoices: ['Kündigung', 'Stellenangebot', 'Weiterbildung'],
      correct: ['Kündigung'],
      body: 'Ergänzen Sie:\n\nNach zehn Jahren geben Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie beenden Ihr Arbeitsverhältnis schriftlich und beachten die Frist. Danach brauchen Sie ein Arbeitszeugnis — kein Stellenangebot und keine Weiterbildung.',
      dialog: 'Personalabteilung: Wann kommt Ihre ___?\nSie: Am Freitag per Post.',
      options: ['Kündigung,Stellenangebot,Weiterbildung'],
      correct: ['Kündigung'],
    },
  },
  {
    lemma: 'Arbeitsvertrag',
    hint: 'Wortschatz — schriftliche Vereinbarung zwischen Arbeitgeber und Arbeitnehmer',
    so: {
      body: 'Vor dem ersten Tag unterschreiben Sie den ___.',
      options: ['Arbeitsvertrag', 'Anschreiben', 'Stellenmarkt'],
      correct: 'Arbeitsvertrag',
    },
    ms: {
      body: 'Was steht im Arbeitsvertrag? Wählen Sie alle richtigen Antworten.',
      options: ['Gehalt', 'Arbeitszeit', 'Probezeit', 'Referenz', 'Bewerbungsfrist'],
      correct: ['Gehalt', 'Arbeitszeit', 'Probezeit'],
    },
    dd: ['Ich', 'unterschreibe', 'den', 'Arbeitsvertrag', 'heute', '.'],
    in: {
      wordChoices: ['Arbeitsvertrag', 'Anschreiben', 'Stellenmarkt'],
      correct: ['Arbeitsvertrag'],
      body: 'Ergänzen Sie:\n\nBitte lesen Sie Ihren ___ sorgfältig durch.',
    },
    tg: {
      story: 'Vorgeschichte: HR erklärt Gehalt, Arbeitszeit und Probezeit. Sie unterschreiben die Vereinbarung — kein Anschreiben und kein Stellenmarkt.',
      dialog: 'Personalabteilung: Haben Sie den ___ gelesen?\nSie: Ja, alles ist klar.',
      options: ['Arbeitsvertrag,Anschreiben,Stellenmarkt'],
      correct: ['Arbeitsvertrag'],
    },
  },
  {
    lemma: 'Branche',
    hint: 'Wortschatz — Wirtschaftsbereich oder Industriezweig',
    so: {
      body: 'Sie möchten in der IT-___ arbeiten.',
      options: ['Branche', 'Probezeit', 'Kündigung'],
      correct: 'Branche',
    },
    ms: {
      body: 'Was ist eine Branche? Wählen Sie alle richtigen Antworten.',
      options: ['Automobil', 'Gesundheitswesen', 'Finanzwesen', 'Überstunden', 'Homeoffice'],
      correct: ['Automobil', 'Gesundheitswesen', 'Finanzwesen'],
    },
    dd: ['Ich', 'suche', 'eine', 'Stelle', 'in', 'der', 'IT-Branche', '.'],
    in: {
      wordChoices: ['Branche', 'Probezeit', 'Kündigung'],
      correct: ['Branche'],
      body: 'Ergänzen Sie:\n\nNach zehn Jahren wechseln Sie die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie haben Erfahrung im Gesundheitswesen, wollen aber in die IT wechseln. Branchenwechsel ist Ihr Ziel — keine Probezeit und keine Kündigung.',
      dialog: 'Berater: In welcher ___ arbeiten Sie?\nSie: Bisher im Einzelhandel, jetzt suche ich IT.',
      options: ['Branche,Probezeit,Kündigung'],
      correct: ['Branche'],
    },
  },
  {
    lemma: 'Karriere',
    hint: 'Wortschatz — beruflicher Werdegang und Entwicklung',
    so: {
      body: 'Für Ihre ___ planen Sie den nächsten Schritt.',
      options: ['Karriere', 'Kündigung', 'Überstunden'],
      correct: 'Karriere',
    },
    ms: {
      body: 'Was fördert die Karriere? Wählen Sie alle richtigen Antworten.',
      options: ['Weiterbildung', 'Verantwortung', 'Kompetenz', 'Mindestlohn', 'Bewerbungsfrist'],
      correct: ['Weiterbildung', 'Verantwortung', 'Kompetenz'],
    },
    dd: ['Meine', 'Karriere', 'entwickelt', 'sich', 'gut', '.'],
    in: {
      wordChoices: ['Karriere', 'Kündigung', 'Überstunden'],
      correct: ['Karriere'],
      body: 'Ergänzen Sie:\n\nMit dieser Stelle starten Sie eine neue ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie besprechen Ihren beruflichen Werdegang. Weiterbildung und Verantwortung helfen Ihnen — keine Kündigung und keine Überstunden.',
      dialog: 'Coach: Wo steht Ihre ___?\nSie: Ich bin bereit für eine Führungsrolle.',
      options: ['Karriere,Kündigung,Überstunden'],
      correct: ['Karriere'],
    },
  },
  {
    lemma: 'Weiterbildung',
    hint: 'Wortschatz — zusätzliche Qualifikation während der Karriere',
    so: {
      body: 'Der Arbeitgeber unterstützt Ihre ___.',
      options: ['Weiterbildung', 'Kündigung', 'Überstunden'],
      correct: 'Weiterbildung',
    },
    ms: {
      body: 'Was kann Weiterbildung sein? Wählen Sie alle richtigen Antworten.',
      options: ['Sprachkurs', 'Zertifikat', 'Seminar', 'Stellenmarkt', 'Anschreiben'],
      correct: ['Sprachkurs', 'Zertifikat', 'Seminar'],
    },
    dd: ['Meine', 'Weiterbildung', 'beginnt', 'im', 'Herbst', '.'],
    in: {
      wordChoices: ['Weiterbildung', 'Kündigung', 'Überstunden'],
      correct: ['Weiterbildung'],
      body: 'Ergänzen Sie:\n\nFür die neue Stelle brauchen Sie eine ___.',
    },
    tg: {
      story: 'Vorgeschichte: Ihr Chef bezahlt einen Kurs für Projektmanagement. Sie qualifizieren sich weiter — keine Kündigung und keine Überstunden.',
      dialog: 'Personalabteilung: Interessiert Sie ___?\nSie: Ja, besonders im Bereich IT.',
      options: ['Weiterbildung,Kündigung,Überstunden'],
      correct: ['Weiterbildung'],
    },
  },
  {
    lemma: 'Kompetenz',
    hint: 'Wortschatz — Fähigkeit oder Qualifikation für eine Aufgabe',
    so: {
      body: 'Ihre ___ in Excel überzeugt den Arbeitgeber.',
      options: ['Kompetenz', 'Kündigung', 'Mindestlohn'],
      correct: 'Kompetenz',
    },
    ms: {
      body: 'Was sind berufliche Kompetenzen? Wählen Sie alle richtigen Antworten.',
      options: ['Fremdsprachen', 'Führung', 'Fachwissen', 'Homeoffice', 'Bewerbungsfrist'],
      correct: ['Fremdsprachen', 'Führung', 'Fachwissen'],
    },
    dd: ['Meine', 'Kompetenz', 'in', 'Projektmanagement', 'ist', 'stark', '.'],
    in: {
      wordChoices: ['Kompetenz', 'Kündigung', 'Mindestlohn'],
      correct: ['Kompetenz'],
      body: 'Ergänzen Sie:\n\nIm Gespräch betonen Sie Ihre ___ in der Branche.',
    },
    tg: {
      story: 'Vorgeschichte: Sie nennen Fachwissen und Fremdsprachen als Stärken. Der Recruiter ist beeindruckt — keine Kündigung und kein Mindestlohn.',
      dialog: 'Interviewer: Welche ___ bringen Sie mit?\nSie: Projektmanagement und Englisch.',
      options: ['Kompetenz,Kündigung,Mindestlohn'],
      correct: ['Kompetenz'],
    },
  },
  {
    lemma: 'Verantwortung',
    hint: 'Wortschatz — Pflicht und Zuständigkeit im Job',
    so: {
      body: 'In der neuen Rolle übernehmen Sie mehr ___.',
      options: ['Verantwortung', 'Überstunden', 'Bewerbungsfrist'],
      correct: 'Verantwortung',
    },
    ms: {
      body: 'Was gehört zur Verantwortung? Wählen Sie alle richtigen Antworten.',
      options: ['Entscheidungen treffen', 'Team führen', 'Ergebnisse liefern', 'Stellenmarkt', 'Anschreiben'],
      correct: ['Entscheidungen treffen', 'Team führen', 'Ergebnisse liefern'],
    },
    dd: ['Ich', 'übernehme', 'gern', 'Verantwortung', '.'],
    in: {
      wordChoices: ['Verantwortung', 'Überstunden', 'Bewerbungsfrist'],
      correct: ['Verantwortung'],
      body: 'Ergänzen Sie:\n\nAls Teamleiter tragen Sie große ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie leiten ein kleines Team und treffen Entscheidungen. Ergebnisse liefern ist Ihre Aufgabe — keine Überstunden und keine Bewerbungsfrist.',
      dialog: 'Chef: Sind Sie bereit für ___?\nSie: Ja, das motiviert mich.',
      options: ['Verantwortung,Überstunden,Bewerbungsfrist'],
      correct: ['Verantwortung'],
    },
  },
  {
    lemma: 'Teamarbeit',
    hint: 'Wortschatz — gemeinsames Arbeiten im Kollegium',
    so: {
      body: 'In der Stellenanzeige steht: ___ ist uns wichtig.',
      options: ['Teamarbeit', 'Kündigung', 'Mindestlohn'],
      correct: 'Teamarbeit',
    },
    ms: {
      body: 'Was zeigt gute Teamarbeit? Wählen Sie alle richtigen Antworten.',
      options: ['Kommunikation', 'Zusammenarbeit', 'gegenseitige Hilfe', 'Arbeitsvertrag', 'Probezeit'],
      correct: ['Kommunikation', 'Zusammenarbeit', 'gegenseitige Hilfe'],
    },
    dd: ['Teamarbeit', 'ist', 'in', 'unserer', 'Firma', 'wichtig', '.'],
    in: {
      wordChoices: ['Teamarbeit', 'Kündigung', 'Mindestlohn'],
      correct: ['Teamarbeit'],
      body: 'Ergänzen Sie:\n\nIm Vorstellungsgespräch betonen Sie Ihre ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie arbeiten eng mit Kollegen zusammen und helfen sich gegenseitig. Kommunikation ist zentral — keine Kündigung und kein Mindestlohn.',
      dialog: 'Recruiter: Wie stehen Sie zur ___?\nSie: Sehr positiv, ich arbeite gern im Team.',
      options: ['Teamarbeit,Kündigung,Mindestlohn'],
      correct: ['Teamarbeit'],
    },
  },
  {
    lemma: 'Bewerbungsfrist',
    hint: 'Wortschatz — letzter Tag für die Einreichung einer Bewerbung',
    so: {
      body: 'Die ___ endet am Freitag um Mitternacht.',
      options: ['Bewerbungsfrist', 'Probezeit', 'Kündigung'],
      correct: 'Bewerbungsfrist',
    },
    ms: {
      body: 'Was gilt für die Bewerbungsfrist? Wählen Sie alle richtigen Antworten.',
      options: ['Enddatum', 'pünktliche Einreichung', 'keine Verspätung', 'Arbeitsvertrag', 'Homeoffice'],
      correct: ['Enddatum', 'pünktliche Einreichung', 'keine Verspätung'],
    },
    dd: ['Die', 'Bewerbungsfrist', 'läuft', 'am', 'Freitag', 'ab', '.'],
    in: {
      wordChoices: ['Bewerbungsfrist', 'Probezeit', 'Kündigung'],
      correct: ['Bewerbungsfrist'],
      body: 'Ergänzen Sie:\n\nAchten Sie auf die ___ in der Stellenanzeige.',
    },
    tg: {
      story: 'Vorgeschichte: In der Anzeige steht: Bewerbungen bis Freitag. Sie reichen pünktlich ein — keine Probezeit und keine Kündigung.',
      dialog: 'Kollege: Wann ist die ___?\nSie: Noch drei Tage, ich sende heute alles.',
      options: ['Bewerbungsfrist,Probezeit,Kündigung'],
      correct: ['Bewerbungsfrist'],
    },
  },
  {
    lemma: 'Personalabteilung',
    hint: 'Wortschatz — Abteilung für Personal und Bewerbungen',
    so: {
      body: 'Ihre Bewerbung geht an die ___.',
      options: ['Personalabteilung', 'Branche', 'Überstunden'],
      correct: 'Personalabteilung',
    },
    ms: {
      body: 'Was macht die Personalabteilung? Wählen Sie alle richtigen Antworten.',
      options: ['Bewerbungen prüfen', 'Verträge vorbereiten', 'Einstellungsgespräche', 'Stellenmarkt', 'Mindestlohn'],
      correct: ['Bewerbungen prüfen', 'Verträge vorbereiten', 'Einstellungsgespräche'],
    },
    dd: ['Ich', 'schicke', 'alles', 'an', 'die', 'Personalabteilung', '.'],
    in: {
      wordChoices: ['Personalabteilung', 'Branche', 'Überstunden'],
      correct: ['Personalabteilung'],
      body: 'Ergänzen Sie:\n\nNach dem Gespräch kontaktieren Sie die ___.',
    },
    tg: {
      story: 'Vorgeschichte: Sie rufen an und fragen nach Ihrer Bewerbung. HR prüft Unterlagen und plant Gespräche — keine Branche und keine Überstunden.',
      dialog: 'Empfang: Wollen Sie zur ___?\nSie: Ja, ich habe einen Termin zum Gespräch.',
      options: ['Personalabteilung,Branche,Überstunden'],
      correct: ['Personalabteilung'],
    },
  },
  {
    lemma: 'Stellenangebot',
    hint: 'Wortschatz — ausgeschriebene freie Arbeitsstelle',
    so: {
      body: 'Auf dem Portal finden Sie ein passendes ___.',
      options: ['Stellenangebot', 'Arbeitszeugnis', 'Kündigung'],
      correct: 'Stellenangebot',
    },
    ms: {
      body: 'Was enthält ein Stellenangebot? Wählen Sie alle richtigen Antworten.',
      options: ['Aufgaben', 'Anforderungen', 'Bewerbungsfrist', 'Probezeit', 'Referenz'],
      correct: ['Aufgaben', 'Anforderungen', 'Bewerbungsfrist'],
    },
    dd: ['Das', 'Stellenangebot', 'passt', 'zu', 'mir', '.'],
    in: {
      wordChoices: ['Stellenangebot', 'Arbeitszeugnis', 'Kündigung'],
      correct: ['Stellenangebot'],
      body: 'Ergänzen Sie:\n\nGestern haben Sie ein interessantes ___ gelesen.',
    },
    tg: {
      story: 'Vorgeschichte: Sie lesen eine Anzeige mit Aufgaben und Anforderungen. Die Bewerbungsfrist ist klar — kein Arbeitszeugnis und keine Kündigung.',
      dialog: 'Freund: Haben Sie ein ___ gefunden?\nSie: Ja, Marketing in München.',
      options: ['Stellenangebot,Arbeitszeugnis,Kündigung'],
      correct: ['Stellenangebot'],
    },
  },
  {
    lemma: 'Mindestlohn',
    hint: 'Wortschatz — gesetzlich festgelegter unterer Lohn',
    so: {
      body: 'Ihr Gehalt liegt über dem ___.',
      options: ['Mindestlohn', 'Stellenangebot', 'Anschreiben'],
      correct: 'Mindestlohn',
    },
    ms: {
      body: 'Was gilt zum Mindestlohn? Wählen Sie alle richtigen Antworten.',
      options: ['gesetzliche Untergrenze', 'pro Stunde', 'für alle Branchen', 'Probezeit', 'Homeoffice'],
      correct: ['gesetzliche Untergrenze', 'pro Stunde', 'für alle Branchen'],
    },
    dd: ['Mein', 'Gehalt', 'liegt', 'über', 'dem', 'Mindestlohn', '.'],
    in: {
      wordChoices: ['Mindestlohn', 'Stellenangebot', 'Anschreiben'],
      correct: ['Mindestlohn'],
      body: 'Ergänzen Sie:\n\nIm Vertrag steht ein Gehalt über dem ___.',
    },
    tg: {
      story: 'Vorgeschichte: HR erklärt, dass das Gehalt die gesetzliche Untergrenze überschreitet. Pro Stunde zahlt die Firma fair — kein Stellenangebot und kein Anschreiben.',
      dialog: 'Personalabteilung: Kennen Sie den ___?\nSie: Ja, mein Gehalt liegt darüber.',
      options: ['Mindestlohn,Stellenangebot,Anschreiben'],
      correct: ['Mindestlohn'],
    },
  },
  {
    lemma: 'Überstunden',
    hint: 'Wortschatz — Arbeitszeit über die vereinbarte Stundenzahl',
    so: {
      body: 'Bei viel Arbeit machen Sie manchmal ___.',
      options: ['Überstunden', 'Weiterbildung', 'Bewerbungsfrist'],
      correct: 'Überstunden',
    },
    ms: {
      body: 'Was gilt zu Überstunden? Wählen Sie alle richtigen Antworten.',
      options: ['Vergütung', 'Ausgleich', 'Dokumentation', 'Stellenmarkt', 'Karriere'],
      correct: ['Vergütung', 'Ausgleich', 'Dokumentation'],
    },
    dd: ['Letzte', 'Woche', 'hatte', 'ich', 'Überstunden', '.'],
    in: {
      wordChoices: ['Überstunden', 'Weiterbildung', 'Bewerbungsfrist'],
      correct: ['Überstunden'],
      body: 'Ergänzen Sie:\n\nIm Vertrag steht, wie ___ vergütet werden.',
    },
    tg: {
      story: 'Vorgeschichte: Das Projekt ist dringend und Sie bleiben länger. Vergütung und Ausgleich sind geregelt — keine Weiterbildung und keine Bewerbungsfrist.',
      dialog: 'Chef: Sind ___ möglich?\nSie: Ja, aber nur mit Vergütung.',
      options: ['Überstunden,Weiterbildung,Bewerbungsfrist'],
      correct: ['Überstunden'],
    },
  },
  {
    lemma: 'Homeoffice',
    hint: 'Wortschatz — Arbeiten von zu Hause aus',
    so: {
      body: 'Zweimal pro Woche arbeiten Sie im ___.',
      options: ['Homeoffice', 'Stellenmarkt', 'Kündigung'],
      correct: 'Homeoffice',
    },
    ms: {
      body: 'Was gehört zum Homeoffice? Wählen Sie alle richtigen Antworten.',
      options: ['Computer', 'Videokonferenz', 'flexible Zeiten', 'Arbeitszeugnis', 'Bewerbungsfrist'],
      correct: ['Computer', 'Videokonferenz', 'flexible Zeiten'],
    },
    dd: ['Ich', 'arbeite', 'zweimal', 'pro', 'Woche', 'im', 'Homeoffice', '.'],
    in: {
      wordChoices: ['Homeoffice', 'Stellenmarkt', 'Kündigung'],
      correct: ['Homeoffice'],
      body: 'Ergänzen Sie:\n\nLaut Vertrag dürfen Sie im ___ arbeiten.',
    },
    tg: {
      story: 'Vorgeschichte: Sie arbeiten montags und freitags von zu Hause. Computer und Videokonferenz sind eingerichtet — kein Stellenmarkt und keine Kündigung.',
      dialog: 'Vorgesetzter: Nutzen Sie ___?\nSie: Ja, zweimal wöchentlich.',
      options: ['Homeoffice,Stellenmarkt,Kündigung'],
      correct: ['Homeoffice'],
    },
  },
];
