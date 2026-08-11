#!/usr/bin/env node
/**
 * Replace off-topic distractors with health-themed ones that do NOT
 * also fit the gap (single correct answer).
 *
 * Patches scripts/beim-arzt/{a2,b1,b2}.mjs then regenerate drafts separately.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, {options?: string[], wordChoices?: string[], gapOptions?: string[]}>} */
const PATCH = {
  // ——— A2 select-one ———
  'a2-arzt-so-001': { options: ['Kopfschmerzen', 'Fieber', 'Husten'] }, // starke ___ → only pl. Kopfschmerzen
  'a2-arzt-so-002': { options: ['Fieber', 'Husten', 'Schnupfen'] }, // Grad ___
  'a2-arzt-so-003': { options: ['Termin', 'Rezept', 'Attest'] }, // einen ___ (Rezept/Attest ≠ Akk m)
  'a2-arzt-so-004': { options: ['Rezept', 'Termin', 'Impfung'] }, // ein ___ für die Tabletten
  'a2-arzt-so-005': { options: ['Apotheke', 'Praxis', 'Rezeption'] }, // Medizin holen → Apotheke
  'a2-arzt-so-006': { options: ['Husten', 'Fieber', 'Kopfschmerzen'] }, // starken ___
  'a2-arzt-so-007': { options: ['Wartezimmer', 'Untersuchungszimmer', 'Apotheke'] },
  'a2-arzt-so-008': { options: ['Versicherungskarte', 'Rezept', 'Attest'] },
  'a2-arzt-so-009': { options: ['Bauchschmerzen', 'Fieber', 'Husten'] }, // Bauchschmerzen after übel
  'a2-arzt-so-010': { options: ['Tablette', 'Salbe', 'Tropfen'] }, // nehmen … eine ___
  'a2-arzt-so-011': { options: ['Halsschmerzen', 'Zahnschmerzen', 'Fieber'] }, // kaum sprechen
  'a2-arzt-so-012': { options: ['Schnupfen', 'Fieber', 'Ausschlag'] }, // Erkältung: Husten und ___
  'a2-arzt-so-013': { options: ['Praxis', 'Apotheke', 'Notaufnahme'] }, // geöffnet 8–12
  'a2-arzt-so-014': { options: ['Rückenschmerzen', 'Kopfschmerzen', 'Husten'] }, // nach Sport
  'a2-arzt-so-015': { options: ['Krankenkasse', 'Apotheke', 'Praxis'] }, // versichert
  'a2-arzt-so-016': { options: ['Tropfen', 'Tablette', 'Salbe'] }, // für die Augen
  'a2-arzt-so-017': { options: ['Zahnschmerzen', 'Halsschmerzen', 'Fieber'] }, // zum Zahnarzt
  'a2-arzt-so-018': { options: ['Allergie', 'Impfung', 'Infektion'] }, // gegen Penicillin
  'a2-arzt-so-019': { options: ['Rezeption', 'Apotheke', 'Wartezimmer'] }, // melden an der ___
  'a2-arzt-so-020': { options: ['Salbe', 'Tablette', 'Tropfen'] }, // auf die Haut

  // ——— A2 input-text (same principle) ———
  'a2-arzt-in-001': { wordChoices: ['Kopfschmerzen', 'Fieber', 'Husten'] },
  'a2-arzt-in-002': { wordChoices: ['Fieber', 'Husten', 'Schnupfen'] },
  'a2-arzt-in-003': { wordChoices: ['Termin', 'Rezept', 'Attest'] },
  'a2-arzt-in-004': { wordChoices: ['Rezept', 'Termin', 'Impfung'] },
  'a2-arzt-in-005': { wordChoices: ['Apotheke', 'Praxis', 'Rezeption'] },
  'a2-arzt-in-006': { wordChoices: ['Husten', 'Fieber', 'Kopfschmerzen'] },
  'a2-arzt-in-007': { wordChoices: ['Wartezimmer', 'Untersuchungszimmer', 'Apotheke'] },
  'a2-arzt-in-008': { wordChoices: ['Tablette', 'Salbe', 'Tropfen'] },
  'a2-arzt-in-009': { wordChoices: ['Halsschmerzen', 'Zahnschmerzen', 'Fieber'] },
  'a2-arzt-in-010': { wordChoices: ['Schnupfen', 'Fieber', 'Ausschlag'] },
  'a2-arzt-in-011': { wordChoices: ['Versicherungskarte', 'Rezept', 'Attest'] },
  'a2-arzt-in-012': { wordChoices: ['Bauchschmerzen', 'Kopfschmerzen', 'Husten'] },
  'a2-arzt-in-013': { wordChoices: ['Allergie', 'Impfung', 'Infektion'] },
  'a2-arzt-in-014': { wordChoices: ['Rezeption', 'Apotheke', 'Wartezimmer'] },
  'a2-arzt-in-015': { wordChoices: ['Salbe', 'Tablette', 'Tropfen'] },
  'a2-arzt-in-016': { wordChoices: ['Zahnschmerzen', 'Halsschmerzen', 'Fieber'] },
  'a2-arzt-in-017': { wordChoices: ['Krankenkasse', 'Apotheke', 'Praxis'] },
  'a2-arzt-in-018': { wordChoices: ['Tropfen', 'Tablette', 'Salbe'] },
  'a2-arzt-in-019': { wordChoices: ['Rückenschmerzen', 'Kopfschmerzen', 'Husten'] },
  'a2-arzt-in-020': { wordChoices: ['Praxis', 'Apotheke', 'Notaufnahme'] },

  // ——— A2 text-gaps ———
  'a2-arzt-tg-001': { gapOptions: ['Kopfschmerzen,Fieber,Husten'] },
  'a2-arzt-tg-002': { gapOptions: ['Fieber,Husten,Schnupfen', 'drei,zehn,zwölf'] },
  'a2-arzt-tg-003': { gapOptions: ['Termin,Rezept,Attest'] },
  'a2-arzt-tg-004': { gapOptions: ['Rezept,Termin,Impfung', 'Apotheke,Praxis,Rezeption'] },
  'a2-arzt-tg-005': { gapOptions: ['Husten,Fieber,Kopfschmerzen'] },
  'a2-arzt-tg-006': { gapOptions: ['Wartezimmer,Untersuchungszimmer,Apotheke'] },
  'a2-arzt-tg-007': { gapOptions: ['Versicherungskarte,Rezept,Attest'] },
  'a2-arzt-tg-008': { gapOptions: ['dreimal,einmal,nie', 'Tablette,Salbe,Tropfen'] },
  'a2-arzt-tg-009': { gapOptions: ['Halsschmerzen,Zahnschmerzen,Fieber'] },
  'a2-arzt-tg-010': { gapOptions: ['Schnupfen,Fieber,Ausschlag', 'Husten,Fieber,Kopfschmerzen'] },
  'a2-arzt-tg-011': { gapOptions: ['Bauchschmerzen,Kopfschmerzen,Husten'] },
  'a2-arzt-tg-012': { gapOptions: ['Allergie,Impfung,Infektion', 'Penicillin,Aspirin,Vitamin'] },
  'a2-arzt-tg-013': { gapOptions: ['Salbe,Tablette,Tropfen'] },
  'a2-arzt-tg-014': { gapOptions: ['Zahnschmerzen,Halsschmerzen,Fieber'] },
  'a2-arzt-tg-015': { gapOptions: ['Krankenkasse,Apotheke,Praxis'] },
  'a2-arzt-tg-016': { gapOptions: ['Tropfen,Tablette,Salbe'] },
  'a2-arzt-tg-017': { gapOptions: ['Rückenschmerzen,Kopfschmerzen,Husten', 'weh,gut,kalt'] },
  'a2-arzt-tg-018': { gapOptions: ['Rezeption,Apotheke,Wartezimmer'] },
  'a2-arzt-tg-019': { gapOptions: ['Praxis,Apotheke,Notaufnahme', 'acht,zwölf,drei'] },
  'a2-arzt-tg-020': { gapOptions: ['Ruhe,Medikamente,Sport', 'trinken,laufen,rauchen'] },

  // ——— A2 multi-select: replace off-topic false options ———
  'a2-arzt-ms-001': { options: ['Kopfschmerzen', 'Fieber', 'Husten', 'Rezept', 'Termin'], correct: ['Kopfschmerzen', 'Fieber', 'Husten'] },
  'a2-arzt-ms-002': { options: ['Rezept', 'Tablette', 'Tropfen', 'Wartezimmer', 'Termin'], correct: ['Rezept', 'Tablette', 'Tropfen'] },
  'a2-arzt-ms-003': { options: ['Wartezimmer', 'Rezeption', 'Versicherungskarte', 'Apotheke', 'Salbe'], correct: ['Wartezimmer', 'Rezeption', 'Versicherungskarte'] },
  'a2-arzt-ms-004': { options: ['Bauchschmerzen', 'Halsschmerzen', 'Zahnschmerzen', 'Fieber', 'Rezept'], correct: ['Bauchschmerzen', 'Halsschmerzen', 'Zahnschmerzen'] },
  'a2-arzt-ms-005': { options: ['Schnupfen', 'Husten', 'Halsschmerzen', 'Ausschlag', 'Bruch'], correct: ['Schnupfen', 'Husten', 'Halsschmerzen'] },
  'a2-arzt-ms-006': { options: ['Termin vereinbaren', 'im Wartezimmer warten', 'Versicherungskarte zeigen', 'Salbe auftragen', 'Röntgen machen'], correct: ['Termin vereinbaren', 'im Wartezimmer warten', 'Versicherungskarte zeigen'] },
  'a2-arzt-ms-007': { options: ['Kopf', 'Hals', 'Bauch', 'Rezept', 'Tablette'], correct: ['Kopf', 'Hals', 'Bauch'] },
  'a2-arzt-ms-008': { options: ['Tablette', 'Salbe', 'Tropfen', 'Termin', 'Praxis'], correct: ['Tablette', 'Salbe', 'Tropfen'] },
  'a2-arzt-ms-009': { options: ['Seit wann haben Sie das?', 'Wo tut es weh?', 'Haben Sie Fieber?', 'Haben Sie Hunger?', 'Spielen Sie Tennis?'], correct: ['Seit wann haben Sie das?', 'Wo tut es weh?', 'Haben Sie Fieber?'] },
  'a2-arzt-ms-010': { options: ['Ich habe Kopfschmerzen.', 'Es tut mir im Rücken weh.', 'Ich brauche ein Rezept.', 'Ich habe keinen Termin.', 'Ich bin Apotheker.'], correct: ['Ich habe Kopfschmerzen.', 'Es tut mir im Rücken weh.', 'Ich brauche ein Rezept.'] },
  'a2-arzt-ms-011': { options: ['Medikamente holen', 'Rezept abgeben', 'Beratung bekommen', 'Blutdruck messen', 'Krankschreibung holen'], correct: ['Medikamente holen', 'Rezept abgeben', 'Beratung bekommen'] },
  'a2-arzt-ms-012': { options: ['Temperatur messen', 'viel trinken', 'im Bett bleiben', 'Sport machen', 'kalt duschen oft'], correct: ['Temperatur messen', 'viel trinken', 'im Bett bleiben'] },
  'a2-arzt-ms-013': { options: ['Rücken', 'Bein', 'Arm', 'Schulter', 'Rezept'], correct: ['Rücken', 'Bein', 'Arm', 'Schulter'] },
  'a2-arzt-ms-014': { options: ['vom Arzt bekommen', 'in der Apotheke abgeben', 'Medikamente bekommen', 'im Wartezimmer essen', 'ohne Untersuchung'], correct: ['vom Arzt bekommen', 'in der Apotheke abgeben', 'Medikamente bekommen'] },
  'a2-arzt-ms-015': { options: ['gegen Penicillin', 'gegen Nüsse', 'Hautausschlag möglich', 'gegen Husten', 'gegen Termine'], correct: ['gegen Penicillin', 'gegen Nüsse', 'Hautausschlag möglich'] },
  'a2-arzt-ms-016': { options: ['für morgen früh', 'um 10 Uhr', 'an der Rezeption', 'ohne Versicherungskarte', 'in der Apotheke schlafen'], correct: ['für morgen früh', 'um 10 Uhr', 'an der Rezeption'] },
  'a2-arzt-ms-017': { options: ['Mir ist übel.', 'Ich muss mich übergeben.', 'Mir ist schwindelig.', 'Ich habe Zahnschmerzen.', 'Ich brauche einmal Impfung.'], correct: ['Mir ist übel.', 'Ich muss mich übergeben.', 'Mir ist schwindelig.'] },
  'a2-arzt-ms-018': { options: ['auf die Haut streichen', 'zweimal täglich', 'bei Hautproblemen', 'schlucken wie eine Tablette', 'in die Augen tropfen'], correct: ['auf die Haut streichen', 'zweimal täglich', 'bei Hautproblemen'] },
  'a2-arzt-ms-019': { options: ['Zahnschmerzen', 'Kontrolle', 'Zähne putzen', 'Füllung', 'Schnupfen'], correct: ['Zahnschmerzen', 'Kontrolle', 'Zähne putzen', 'Füllung'] },
  'a2-arzt-ms-020': { options: ['Versicherungskarte', 'versichert sein', 'Rechnung oft bezahlt', 'Rezept selbst drucken', 'ohne Anmeldung operieren'], correct: ['Versicherungskarte', 'versichert sein', 'Rechnung oft bezahlt'] },

  // ——— B1 select-one ———
  'b1-arzt-so-001': { options: ['Untersuchung', 'Überweisung', 'Krankschreibung'] },
  'b1-arzt-so-002': { options: ['Überweisung', 'Krankschreibung', 'Attest'] },
  'b1-arzt-so-003': { options: ['Krankschreibung', 'Überweisung', 'Rezept'] },
  'b1-arzt-so-004': { options: ['Blutdruck', 'Blutuntersuchung', 'Fieber'] },
  'b1-arzt-so-005': { options: ['Nebenwirkung', 'Wechselwirkung', 'Verträglichkeit'] },
  'b1-arzt-so-006': { options: ['Facharzt', 'Hausarzt', 'Notarzt'] },
  'b1-arzt-so-007': { options: ['Atemnot', 'Schwindel', 'Husten'] },
  'b1-arzt-so-008': { options: ['Ausschlag', 'Schwellung', 'Fieber'] },
  'b1-arzt-so-009': { options: ['Impfung', 'Untersuchung', 'Überweisung'] },
  'b1-arzt-so-010': { options: ['Röntgen', 'Impfung', 'Attest'] },
  'b1-arzt-so-011': { options: ['Hausarzt', 'Facharzt', 'Zahnarzt'] },
  'b1-arzt-so-012': { options: ['Schwellung', 'Ausschlag', 'Atemnot'] },
  'b1-arzt-so-013': { options: ['chronisch', 'akut', 'nüchtern'] },
  'b1-arzt-so-014': { options: ['Blutuntersuchung', 'Röntgen', 'Impfung'] },
  'b1-arzt-so-015': { options: ['Attest', 'Rezept', 'Überweisung'] },
  'b1-arzt-so-016': { options: ['stechend', 'dumpf', 'chronisch'] },
  'b1-arzt-so-017': { options: ['Notfall', 'Termin', 'Kontrolle'] },
  'b1-arzt-so-018': { options: ['verschreiben', 'untersuchen', 'überweisen'] },
  'b1-arzt-so-019': { options: ['nüchtern', 'chronisch', 'allergisch'] },
  'b1-arzt-so-020': { options: ['Verlauf', 'Befund', 'Therapie'] },

  // ——— B1 input-text ———
  'b1-arzt-in-001': { wordChoices: ['Untersuchung', 'Überweisung', 'Krankschreibung'] },
  'b1-arzt-in-002': { wordChoices: ['Überweisung', 'Krankschreibung', 'Attest'] },
  'b1-arzt-in-003': { wordChoices: ['Krankschreibung', 'Überweisung', 'Rezept'] },
  'b1-arzt-in-004': { wordChoices: ['Blutdruck', 'Blutuntersuchung', 'Fieber'] },
  'b1-arzt-in-005': { wordChoices: ['Nebenwirkung', 'Wechselwirkung', 'Verträglichkeit'] },
  'b1-arzt-in-006': { wordChoices: ['Atemnot', 'Schwindel', 'Husten'] },
  'b1-arzt-in-007': { wordChoices: ['Ausschlag', 'Schwellung', 'Fieber'] },
  'b1-arzt-in-008': { wordChoices: ['Impfung', 'Untersuchung', 'Überweisung'] },
  'b1-arzt-in-009': { wordChoices: ['Röntgen', 'Impfung', 'Attest'] },
  'b1-arzt-in-010': { wordChoices: ['Schwellung', 'Ausschlag', 'Atemnot'] },
  'b1-arzt-in-011': { wordChoices: ['chronisch', 'akut', 'nüchtern'] },
  'b1-arzt-in-012': { wordChoices: ['Blutuntersuchung', 'Röntgen', 'Impfung'] },
  'b1-arzt-in-013': { wordChoices: ['Attest', 'Rezept', 'Überweisung'] },
  'b1-arzt-in-014': { wordChoices: ['stechend', 'dumpf', 'chronisch'] },
  'b1-arzt-in-015': { wordChoices: ['Notfall', 'Termin', 'Kontrolle'] },
  'b1-arzt-in-016': { wordChoices: ['verschreiben', 'untersuchen', 'überweisen'] },
  'b1-arzt-in-017': { wordChoices: ['nüchtern', 'chronisch', 'allergisch'] },
  'b1-arzt-in-018': { wordChoices: ['Verlauf', 'Befund', 'Therapie'] },
  'b1-arzt-in-019': { wordChoices: ['Hausarzt', 'Facharzt', 'Zahnarzt'] },
  'b1-arzt-in-020': { wordChoices: ['Facharzt', 'Hausarzt', 'Notarzt'] },

  // ——— B1 text-gaps ———
  'b1-arzt-tg-001': { gapOptions: ['Untersuchung,Überweisung,Krankschreibung'] },
  'b1-arzt-tg-002': { gapOptions: ['Überweisung,Krankschreibung,Attest', 'Facharzt,Hausarzt,Zahnarzt'] },
  'b1-arzt-tg-003': { gapOptions: ['Krankschreibung,Überweisung,Rezept', 'drei,zehn,zwölf'] },
  'b1-arzt-tg-004': { gapOptions: ['Blutdruck,Blutuntersuchung,Fieber'] },
  'b1-arzt-tg-005': { gapOptions: ['Nebenwirkungen,Wechselwirkungen,Verträglichkeiten'] },
  'b1-arzt-tg-006': { gapOptions: ['Atemnot,Schwindel,Husten'] },
  'b1-arzt-tg-007': { gapOptions: ['Ausschlag,Schwellung,Fieber', 'juckt,brennt,heilt'] },
  'b1-arzt-tg-008': { gapOptions: ['Impfung,Untersuchung,Überweisung'] },
  'b1-arzt-tg-009': { gapOptions: ['Röntgen,Impfung,Attest'] },
  'b1-arzt-tg-010': { gapOptions: ['Schwellung,Ausschlag,Atemnot'] },
  'b1-arzt-tg-011': { gapOptions: ['chronisch,akut,nüchtern'] },
  'b1-arzt-tg-012': { gapOptions: ['Blutuntersuchung,Röntgen,Impfung', 'nüchtern,chronisch,allergisch'] },
  'b1-arzt-tg-013': { gapOptions: ['Attest,Rezept,Überweisung'] },
  'b1-arzt-tg-014': { gapOptions: ['stechend,dumpf,chronisch'] },
  'b1-arzt-tg-015': { gapOptions: ['Notfall,Termin,Kontrolle'] },
  'b1-arzt-tg-016': { gapOptions: ['verschreibe,untersuche,überweise', 'Antibiotikum,Schmerzmittel,Vitamin'] },
  'b1-arzt-tg-017': { gapOptions: ['Hausarzt,Facharzt,Zahnarzt'] },
  'b1-arzt-tg-018': { gapOptions: ['Verlauf,Befund,Therapie'] },
  'b1-arzt-tg-019': { gapOptions: ['Facharzt,Hausarzt,Notarzt', 'Wartezeit,Untersuchungszeit,Öffnungszeit'] },
  'b1-arzt-tg-020': { gapOptions: ['dumpf,stechend,chronisch', 'anhaltend,plötzlich,selten'] },

  // ——— B1 multi-select false options on-theme ———
  'b1-arzt-ms-001': { options: ['Blutdruck messen', 'abhören', 'Röntgen machen', 'Rezept abholen', 'Termin absagen'], correct: ['Blutdruck messen', 'abhören', 'Röntgen machen'] },
  'b1-arzt-ms-002': { options: ['Attest', 'für den Arbeitgeber', 'Arbeitsunfähigkeit', 'Überweisung', 'Impfung'], correct: ['Attest', 'für den Arbeitgeber', 'Arbeitsunfähigkeit'] },
  'b1-arzt-ms-003': { options: ['Übelkeit', 'Hautausschlag', 'Müdigkeit', 'Termin', 'Rezept'], correct: ['Übelkeit', 'Hautausschlag', 'Müdigkeit'] },
  'b1-arzt-ms-004': { options: ['Hautarzt', 'Augenarzt', 'Zahnarzt', 'Hausmeister', 'Apotheker'], correct: ['Hautarzt', 'Augenarzt', 'Zahnarzt'] },
  'b1-arzt-ms-005': { options: ['Atemnot', 'Schwellung', 'stechender Schmerz', 'Rezept', 'Termin'], correct: ['Atemnot', 'Schwellung', 'stechender Schmerz'] },
  'b1-arzt-ms-006': { options: ['vom Hausarzt', 'zum Facharzt', 'für Spezialuntersuchung', 'für die Apotheke', 'ohne Untersuchung'], correct: ['vom Hausarzt', 'zum Facharzt', 'für Spezialuntersuchung'] },
  'b1-arzt-ms-007': { options: ['nüchtern kommen', 'Laborwerte', 'Blut abnehmen', 'Salbe auftragen', 'Zähne putzen'], correct: ['nüchtern kommen', 'Laborwerte', 'Blut abnehmen'] },
  'b1-arzt-ms-008': { options: ['Grippe', 'Schutz', 'Nebenwirkungen möglich', 'Rezeptpflicht', 'Wartezimmer'], correct: ['Grippe', 'Schutz', 'Nebenwirkungen möglich'] },
  'b1-arzt-ms-009': { options: ['stechend', 'dumpf', 'anhaltend', 'nüchtern', 'ambulant'], correct: ['stechend', 'dumpf', 'anhaltend'] },
  'b1-arzt-ms-010': { options: ['Die Beschwerden sind chronisch.', 'Ich brauche eine Krankschreibung.', 'Ich habe Atemnot beim Sport.', 'Ich hole nur Vitamine.', 'Ich habe keinen Hausarzttermin.'], correct: ['Die Beschwerden sind chronisch.', 'Ich brauche eine Krankschreibung.', 'Ich habe Atemnot beim Sport.'] },
  'b1-arzt-ms-011': { options: ['starke Brustschmerzen', 'plötzliche Atemnot', 'hohes Fieber bei Kind', 'leichter Schnupfen', 'kleine Schramme'], correct: ['starke Brustschmerzen', 'plötzliche Atemnot', 'hohes Fieber bei Kind'] },
  'b1-arzt-ms-012': { options: ['jucken', 'rot', 'auf der Haut', 'im Hals', 'im Ohr'], correct: ['jucken', 'rot', 'auf der Haut'] },
  'b1-arzt-ms-013': { options: ['erster Ansprechpartner', 'Überweisung ausstellen', 'Krankschreibung', 'Operation planen', 'Intensivstation leiten'], correct: ['erster Ansprechpartner', 'Überweisung ausstellen', 'Krankschreibung'] },
  'b1-arzt-ms-014': { options: ['Knochen', 'Lunge', 'Bild', 'Salbe', 'Tropfen'], correct: ['Knochen', 'Lunge', 'Bild'] },
  'b1-arzt-ms-015': { options: ['seit wann', 'besser oder schlechter', 'wann stärker', 'Lieblingsmedikament', 'Schuhgröße'], correct: ['seit wann', 'besser oder schlechter', 'wann stärker'] },
  'b1-arzt-ms-016': { options: ['Antibiotikum', 'Schmerzmittel', 'Rezept', 'Termin', 'Wartezimmer'], correct: ['Antibiotikum', 'Schmerzmittel', 'Rezept'] },
  'b1-arzt-ms-017': { options: ['Knöchel', 'Handgelenk', 'angeschwollen', 'Fieber', 'Husten'], correct: ['Knöchel', 'Handgelenk', 'angeschwollen'] },
  'b1-arzt-ms-018': { options: ['kein Frühstück', 'Blutabnahme', 'morgens', 'volles Frühstück', 'schweres Training vorher'], correct: ['kein Frühstück', 'Blutabnahme', 'morgens'] },
  'b1-arzt-ms-019': { options: ['lange andauernd', 'immer wieder', 'nicht nur einmal', 'nur fünf Minuten', 'nur nach dem Sport einmal'], correct: ['lange andauernd', 'immer wieder', 'nicht nur einmal'] },
  'b1-arzt-ms-020': { options: ['schwer atmen', 'Treppensteigen', 'Brustenge möglich', 'leichter Juckreiz', 'trockene Haut'], correct: ['schwer atmen', 'Treppensteigen', 'Brustenge möglich'] },

  // ——— B2 select-one ———
  'b2-arzt-so-001': { options: ['Anamnese', 'Diagnose', 'Therapie'] },
  'b2-arzt-so-002': { options: ['Befund', 'Diagnose', 'Verordnung'] },
  'b2-arzt-so-003': { options: ['Diagnose', 'Anamnese', 'Nachsorge'] },
  'b2-arzt-so-004': { options: ['ambulant', 'stationär', 'chronisch'] },
  'b2-arzt-so-005': { options: ['stationär', 'ambulant', 'nüchtern'] },
  'b2-arzt-so-006': { options: ['Notaufnahme', 'Rezeption', 'Apotheke'] },
  'b2-arzt-so-007': { options: ['Verträglichkeit', 'Wechselwirkung', 'Nebenwirkung'] },
  'b2-arzt-so-008': { options: ['Wechselwirkung', 'Nebenwirkung', 'Verträglichkeit'] },
  'b2-arzt-so-009': { options: ['Überweisungsschein', 'Rezept', 'Attest'] },
  'b2-arzt-so-010': { options: ['Einweisung', 'Entlassung', 'Nachsorge'] },
  'b2-arzt-so-011': { options: ['Therapie', 'Anamnese', 'Aufnahme'] },
  'b2-arzt-so-012': { options: ['Genesung', 'Einweisung', 'Verordnung'] },
  'b2-arzt-so-013': { options: ['Indikation', 'Kontraindikation', 'Diagnose'] },
  'b2-arzt-so-014': { options: ['Kontraindikation', 'Indikation', 'Verträglichkeit'] },
  'b2-arzt-so-015': { options: ['Vorgeschichte', 'Nachsorge', 'Verordnung'] },
  'b2-arzt-so-016': { options: ['Beschwerden', 'Befunde', 'Verordnungen'] },
  'b2-arzt-so-017': { options: ['Aufnahme', 'Entlassung', 'Nachsorge'] },
  'b2-arzt-so-018': { options: ['Entlassung', 'Aufnahme', 'Einweisung'] },
  'b2-arzt-so-019': { options: ['Nachsorge', 'Anamnese', 'Einweisung'] },
  'b2-arzt-so-020': { options: ['Verordnung', 'Überweisung', 'Anamnese'] },

  // ——— B2 input-text ———
  'b2-arzt-in-001': { wordChoices: ['Anamnese', 'Diagnose', 'Therapie'] },
  'b2-arzt-in-002': { wordChoices: ['Befund', 'Diagnose', 'Verordnung'] },
  'b2-arzt-in-003': { wordChoices: ['Diagnose', 'Anamnese', 'Nachsorge'] },
  'b2-arzt-in-004': { wordChoices: ['ambulant', 'stationär', 'chronisch'] },
  'b2-arzt-in-005': { wordChoices: ['stationär', 'ambulant', 'nüchtern'] },
  'b2-arzt-in-006': { wordChoices: ['Notaufnahme', 'Rezeption', 'Apotheke'] },
  'b2-arzt-in-007': { wordChoices: ['Verträglichkeit', 'Wechselwirkung', 'Nebenwirkung'] },
  'b2-arzt-in-008': { wordChoices: ['Wechselwirkung', 'Nebenwirkung', 'Verträglichkeit'] },
  'b2-arzt-in-009': { wordChoices: ['Überweisungsschein', 'Rezept', 'Attest'] },
  'b2-arzt-in-010': { wordChoices: ['Einweisung', 'Entlassung', 'Nachsorge'] },
  'b2-arzt-in-011': { wordChoices: ['Therapie', 'Anamnese', 'Aufnahme'] },
  'b2-arzt-in-012': { wordChoices: ['Genesung', 'Einweisung', 'Verordnung'] },
  'b2-arzt-in-013': { wordChoices: ['Indikation', 'Kontraindikation', 'Diagnose'] },
  'b2-arzt-in-014': { wordChoices: ['Kontraindikation', 'Indikation', 'Verträglichkeit'] },
  'b2-arzt-in-015': { wordChoices: ['Vorgeschichte', 'Nachsorge', 'Verordnung'] },
  'b2-arzt-in-016': { wordChoices: ['Beschwerden', 'Befunde', 'Verordnungen'] },
  'b2-arzt-in-017': { wordChoices: ['Aufnahme', 'Entlassung', 'Nachsorge'] },
  'b2-arzt-in-018': { wordChoices: ['Entlassung', 'Aufnahme', 'Einweisung'] },
  'b2-arzt-in-019': { wordChoices: ['Nachsorge', 'Anamnese', 'Einweisung'] },
  'b2-arzt-in-020': { wordChoices: ['Verordnung', 'Überweisung', 'Anamnese'] },

  // ——— B2 text-gaps ———
  'b2-arzt-tg-001': { gapOptions: ['Anamnese,Diagnose,Therapie'] },
  'b2-arzt-tg-002': { gapOptions: ['Befund,Diagnose,Verordnung', 'unauffällig,kritisch,chronisch'] },
  'b2-arzt-tg-003': { gapOptions: ['Diagnose,Anamnese,Nachsorge'] },
  'b2-arzt-tg-004': { gapOptions: ['ambulant,stationär,chronisch', 'stationär,ambulant,nüchtern'] },
  'b2-arzt-tg-005': { gapOptions: ['Notaufnahme,Rezeption,Apotheke'] },
  'b2-arzt-tg-006': { gapOptions: ['Wechselwirkung,Nebenwirkung,Verträglichkeit'] },
  'b2-arzt-tg-007': { gapOptions: ['Überweisungsschein,Rezept,Attest'] },
  'b2-arzt-tg-008': { gapOptions: ['Einweisung,Entlassung,Nachsorge', 'heute,morgen,sofort'] },
  'b2-arzt-tg-009': { gapOptions: ['Therapie,Anamnese,Aufnahme'] },
  'b2-arzt-tg-010': { gapOptions: ['Genesung,Einweisung,Verordnung'] },
  'b2-arzt-tg-011': { gapOptions: ['Indikation,Kontraindikation,Diagnose'] },
  'b2-arzt-tg-012': { gapOptions: ['Kontraindikation,Indikation,Verträglichkeit'] },
  'b2-arzt-tg-013': { gapOptions: ['Vorgeschichte,Nachsorge,Verordnung', 'Operationen,Impfungen,Allergien'] },
  'b2-arzt-tg-014': { gapOptions: ['Beschwerden,Befunde,Verordnungen'] },
  'b2-arzt-tg-015': { gapOptions: ['Aufnahme,Entlassung,Nachsorge', 'Station,Ambulanz,Apotheke'] },
  'b2-arzt-tg-016': { gapOptions: ['Entlassung,Aufnahme,Einweisung', 'Medikationsplan,Therapieplan,Terminplan'] },
  'b2-arzt-tg-017': { gapOptions: ['Nachsorge,Anamnese,Einweisung'] },
  'b2-arzt-tg-018': { gapOptions: ['Verordnung,Überweisung,Anamnese'] },
  'b2-arzt-tg-019': { gapOptions: ['Verträglichkeit,Wechselwirkung,Nebenwirkung', 'Nebenwirkungen,Wechselwirkungen,Beschwerden'] },
  'b2-arzt-tg-020': { gapOptions: ['stationär,ambulant,nüchtern'] },

  // ——— B2 multi-select ———
  'b2-arzt-ms-001': { options: ['Vorgeschichte', 'Medikamente nennen', 'Allergien angeben', 'Hobby nennen', 'Urlaubsziel nennen'], correct: ['Vorgeschichte', 'Medikamente nennen', 'Allergien angeben'] },
  'b2-arzt-ms-002': { options: ['Laborwerte', 'Röntgenbild', 'Untersuchungsnotiz', 'Visitenkarte', 'Fahrkarte'], correct: ['Laborwerte', 'Röntgenbild', 'Untersuchungsnotiz'] },
  'b2-arzt-ms-003': { options: ['ohne Übernachtung', 'Tagesklinik möglich', 'nach Hause am selben Tag', 'mehrwöchige Bettlägerigkeit', 'Intensivstation Pflicht'], correct: ['ohne Übernachtung', 'Tagesklinik möglich', 'nach Hause am selben Tag'] },
  'b2-arzt-ms-004': { options: ['Krankenhausbett', 'Übernachtung', 'Station', 'Apotheke', 'Rezept'], correct: ['Krankenhausbett', 'Übernachtung', 'Station'] },
  'b2-arzt-ms-005': { options: ['zwei Medikamente', 'Wirkung verändert sich.', 'Arzt informieren', 'nur Vitamine', 'ohne Rezept'], correct: ['zwei Medikamente', 'Wirkung verändert sich.', 'Arzt informieren'] },
  'b2-arzt-ms-006': { options: ['akute Beschwerden', 'Rettungsdienst', 'Triage', 'Routinekontrolle', 'Impftermin'], correct: ['akute Beschwerden', 'Rettungsdienst', 'Triage'] },
  'b2-arzt-ms-007': { options: ['Medikamente', 'Physiotherapie', 'OP möglich', 'Kinobesuch', 'Urlaubspflicht'], correct: ['Medikamente', 'Physiotherapie', 'OP möglich'] },
  'b2-arzt-ms-008': { options: ['medizinischer Grund', 'Nutzen überwiegt', 'ärztliche Entscheidung', 'Modeentscheidung', 'Zufall'], correct: ['medizinischer Grund', 'Nutzen überwiegt', 'ärztliche Entscheidung'] },
  'b2-arzt-ms-009': { options: ['Risiko zu hoch', 'Maßnahme ungeeignet', 'z. B. Schwangerschaft', 'immer empfohlen', 'nur Geschmackssache'], correct: ['Risiko zu hoch', 'Maßnahme ungeeignet', 'z. B. Schwangerschaft'] },
  'b2-arzt-ms-010': { options: ['Medikationsplan', 'Nachsorgetermin', 'Arztbrief', 'Urlaubsantrag', 'Sportfreigabe ohne Kontrolle'], correct: ['Medikationsplan', 'Nachsorgetermin', 'Arztbrief'] },
  'b2-arzt-ms-011': { options: ['Nebenwirkungen prüfen', 'Dosis anpassen', 'Patient beobachten', 'Termin absagen', 'Rezept ignorieren'], correct: ['Nebenwirkungen prüfen', 'Dosis anpassen', 'Patient beobachten'] },
  'b2-arzt-ms-012': { options: ['vom Hausarzt', 'zur Ambulanz', 'mitbringen', 'in der Apotheke lassen', 'nach der OP werfen'], correct: ['vom Hausarzt', 'zur Ambulanz', 'mitbringen'] },
  'b2-arzt-ms-013': { options: ['ins Krankenhaus', 'ärztlich veranlasst', 'bei schweren Fällen', 'in die Apotheke', 'zum Optiker'], correct: ['ins Krankenhaus', 'ärztlich veranlasst', 'bei schweren Fällen'] },
  'b2-arzt-ms-014': { options: ['Ruhe', 'Medikation einhalten', 'Kontrolltermine', 'Dauerlauf sofort', 'Schlaf weglassen'], correct: ['Ruhe', 'Medikation einhalten', 'Kontrolltermine'] },
  'b2-arzt-ms-015': { options: ['Lokalisation', 'Intensität', 'Auslöser', 'Lieblingsfarbe', 'Schuhgröße'], correct: ['Lokalisation', 'Intensität', 'Auslöser'] },
  'b2-arzt-ms-016': { options: ['Kontrolluntersuchung', 'Wundkontrolle', 'Medikamentenanpassung', 'Partyplanung', 'Autokauf'], correct: ['Kontrolluntersuchung', 'Wundkontrolle', 'Medikamentenanpassung'] },
  'b2-arzt-ms-017': { options: ['Befunde zusammenführen', 'Krankheit benennen', 'Therapie planen', 'Termin vergessen', 'Rezept verlieren'], correct: ['Befunde zusammenführen', 'Krankheit benennen', 'Therapie planen'] },
  'b2-arzt-ms-018': { options: ['Dosis', 'Einnahmezeit', 'Dauer', 'Lieblingsessen', 'Hobbyliste'], correct: ['Dosis', 'Einnahmezeit', 'Dauer'] },
  'b2-arzt-ms-019': { options: ['Personalien', 'Armband', 'Station zuweisen', 'Kinoticket', 'Urlaubsbuch'], correct: ['Personalien', 'Armband', 'Station zuweisen'] },
  'b2-arzt-ms-020': { options: ['frühere OPs', 'chronische Krankheiten', 'Dauermedikation', 'Lieblingsessen', 'Hobbyliste'], correct: ['frühere OPs', 'chronische Krankheiten', 'Dauermedikation'] },
};

function fmtList(arr) {
  return `[${arr.map((s) => `'${String(s).replace(/'/g, "\\'")}'`).join(', ')}]`;
}

function fmtGapOptions(arr) {
  return `[${arr.map((s) => `'${String(s).replace(/'/g, "\\'")}'`).join(', ')}]`;
}

function patchFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  for (const [id, patch] of Object.entries(PATCH)) {
    if (!src.includes(`id: '${id}'`)) continue;

    const re = new RegExp(
      `(id: '${id}',[\\s\\S]*?)(?=\\n  \\{\\n    id: '|\\n\\];\\s*$)`,
    );
    const m = src.match(re);
    if (!m) {
      console.warn('block not found', id);
      continue;
    }
    let block = m[1];

    if (patch.options && block.includes("type: 'select-one'")) {
      block = block.replace(/options: \[[^\]]*\]/, `options: ${fmtList(patch.options)}`);
    }
    if (patch.options && block.includes("type: 'multi-select'")) {
      block = block.replace(/options: \[[^\]]*\]/, `options: ${fmtList(patch.options)}`);
      if (patch.correct) {
        block = block.replace(/correct: \[[^\]]*\]/, `correct: ${fmtList(patch.correct)}`);
      }
    }
    if (patch.wordChoices) {
      block = block.replace(/wordChoices: \[[^\]]*\]/, `wordChoices: ${fmtList(patch.wordChoices)}`);
    }
    if (patch.gapOptions) {
      block = block.replace(/options: \[[^\]]*\]/, `options: ${fmtGapOptions(patch.gapOptions)}`);
    }

    src = src.replace(m[1], block);
    count += 1;
  }

  fs.writeFileSync(filePath, src);
  console.log(path.basename(filePath), 'patched blocks:', count);
}

for (const name of ['a2.mjs', 'b1.mjs', 'b2.mjs']) {
  patchFile(path.join(__dirname, name));
}
