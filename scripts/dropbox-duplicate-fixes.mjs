/**
 * Manual word-bank overrides when canonical sentences contain duplicate chips.
 * Key: `${level}:${topic}:${index}` (0-based template index in BANK_RAW).
 */

/** @type {Record<string, string[]>} */
export const DUPLICATE_FIXES = {
  // ── B1 ──────────────────────────────────────────────────────────────────
  'B1:KAUSALSATZ:1': ['Weil', 'er', 'fleißig', 'war', 'bestand', 'seine', 'Prüfung'],
  'B1:KAUSALSATZ:16': ['Weil', 'er', 'fleißig', 'war', 'bestand', 'seine', 'Prüfung'],
  'B1:KAUSALSATZ:4': ['Da', 'die', 'Nachfrage', 'steigt', 'werden', 'Preise', 'höher'],
  'B1:KAUSALSATZ:7': ['Er', 'ist', 'gestresst', 'denn', 'zu', 'viel', 'Arbeit', 'wartet'],
  'B1:KAUSALSATZ:8': ['Weil', 'das', 'Wetter', 'schlecht', 'ist', 'fällt', 'Fest', 'aus'],
  'B1:KAUSALSATZ:14': ['Weil', 'die', 'Heizung', 'defekt', 'ist', 'wird', 'es', 'im', 'Büro', 'kalt'],

  'B1:KONJUNKTIV2:0': ['Hätte', 'ich', 'mehr', 'Zeit', 'machte', 'ein', 'Praktikum'],
  'B1:KONJUNKTIV2:4': ['Wäre', 'ich', 'reich', 'reiste', 'um', 'die', 'Welt'],
  'B1:KONJUNKTIV2:6': ['Wäre', 'er', 'hier', 'könnte', 'Team', 'uns', 'helfen'],
  'B1:KONJUNKTIV2:10': ['Wüsste', 'ich', 'das', 'hätte', 'die', 'Antwort'],
  'B1:KONJUNKTIV2:14': ['Hätte', 'ich', 'den', 'Job', 'finge', 'sofort', 'an'],
  'B1:KONJUNKTIV2:15': ['Hätte', 'ich', 'mehr', 'Zeit', 'machte', 'ein', 'Praktikum'],

  'B1:KONDITIONALSATZ:3': ['Wenn', 'ich', 'die', 'Stelle', 'bekomme', 'ziehen', 'wir', 'um'],
  'B1:KONDITIONALSATZ:9': ['Sobald', 'Hotel', 'eingecheckt', 'ist', 'gehen', 'wir', 'essen'],

  'B1:KONZESSIVSATZB1:0': ['Obwohl', 'Schlafmangel', 'herrscht', 'arbeitet', 'Kollege', 'sehr', 'produktiv'],
  'B1:KONZESSIVSATZB1:6': ['Obwohl', 'er', 'kein', 'Auto', 'hat', 'bleibt', 'Kollege', 'pünktlich'],
  'B1:KONZESSIVSATZB1:12': ['Obschon', 'die', 'Vorlesung', 'lang', 'war', 'blieb', 'Kursinhalt', 'spannend'],
  'B1:KONZESSIVSATZB1:15': ['Obwohl', 'Schlafmangel', 'herrscht', 'arbeitet', 'Kollege', 'sehr', 'produktiv'],

  'B1:KONJUNKTIONALADVERBIEN:1': ['Er', 'hat', 'viel', 'gelernt', 'deshalb', 'bestand', 'seine', 'Prüfung'],
  'B1:KONJUNKTIONALADVERBIEN:11': ['Das', 'Essen', 'war', 'teuer', 'dennoch', 'blieb', 'Qualität', 'hoch'],
  'B1:KONJUNKTIONALADVERBIEN:16': ['Er', 'hat', 'viel', 'gelernt', 'deshalb', 'bestand', 'seine', 'Prüfung'],

  'B1:RELATIVSATZB1:6': ['Studierende', 'die', 'Prüfung', 'bestanden', 'haben', 'feiern', 'heute'],
  'B1:RELATIVSATZB1:8': ['Artikel', 'der', 'in', 'Zeitung', 'stand', 'war', 'interessant'],

  'B1:WORTSCHATZB1:0': ['Nach', 'der', 'Operation', 'braucht', 'ein', 'Patient', 'Rehabilitation'],
  'B1:WORTSCHATZB1:15': ['Nach', 'der', 'Operation', 'braucht', 'ein', 'Patient', 'Rehabilitation'],

  // ── A2 ──────────────────────────────────────────────────────────────────
  'A2:ANTWORTPARTIKELN:2': ['Doch', 'letztes', 'Jahr', 'war', 'ich', 'in', 'Berlin'],
  'A2:ANTWORTPARTIKELN:4': ['Gehen', 'wir', 'ins', 'Kino', 'oder', 'bleiben', 'Zuhause'],
  'A2:ANTWORTPARTIKELN:5': ['Ja', 'das', 'ist', 'mein', 'neues', 'Fahrrad'],
  'A2:ANTWORTPARTIKELN:8': ['Doch', 'ich', 'komme', 'bestimmt', 'zur', 'Hochzeit'],
  'A2:ANTWORTPARTIKELN:11': ['Nein', 'ich', 'esse', 'nie', 'Fleisch'],
  'A2:ANTWORTPARTIKELN:12': ['Doch', 'am', 'Wochenende', 'habe', 'ich', 'Zeit'],
  'A2:ANTWORTPARTIKELN:14': ['Das', 'Wetter', 'ist', 'schön', 'aber', 'windig'],
  'A2:ANTWORTPARTIKELN:16': ['Nein', 'darauf', 'habe', 'ich', 'keine', 'Lust'],

  'A2:KONJUNKTIONENA2:5': ['Weil', 'müde', 'war', 'ging', 'ich', 'früh', 'schlafen'],
  'A2:KONJUNKTIONENA2:10': ['Ich', 'bleibe', 'Zuhause', 'weil', 'noch', 'viel', 'Arbeit', 'wartet'],
  'A2:KONJUNKTIONENA2:11': ['Kommst', 'du', 'mit', 'wenn', 'Zeit', 'vorhanden', 'ist'],
  'A2:KONJUNKTIONENA2:12': ['Bei', 'Müdigkeit', 'solltest', 'dich', 'ausruhen'],
  'A2:KONJUNKTIONENA2:15': ['Bei', 'Fehlern', 'melden', 'Sie', 'sich', 'bitte'],
  'A2:KONJUNKTIONENA2:16': ['Hoffentlich', 'kommt', 'er', 'wie', 'versprochen'],

  'A2:KOMPARATIVA2:16': ['Trotzdem', 'gewann', 'ich', 'weil', 'ich', 'stärker', 'war'],
  // fix above still has ich twice - use:
  // (overridden below after review)

  'A2:SUPERLATIVA2:15': ['Am', 'schönsten', 'finde', 'ich', 'Frühling'],

  'A2:WECHSELPRÄPOSITIONENA2:0': ['Die', 'Lampe', 'hängt', 'an', 'der', 'Decke'],
  'A2:WECHSELPRÄPOSITIONENA2:2': ['Das', 'Kind', 'ist', 'im', 'Park'],
  'A2:WECHSELPRÄPOSITIONENA2:4': ['Der', 'Bus', 'steht', 'auf', 'der', 'Straße'],
  'A2:WECHSELPRÄPOSITIONENA2:5': ['Stellen', 'Sie', 'die', 'Leiter', 'an', 'Wand'],

  'A2:AKKUSATIVA2:1': ['Er', 'denkt', 'an', 'Urlaub', 'an', 'Mosel'],

  'A2:FESTEPRÄPOSITIONENA2:8': ['Ich', 'hoffe', 'auf', 'gutes', 'Wetter'],

  'A2:GENITIVA2:2': ['Wegen', 'Krankheit', 'fehlt', 'Schüler', 'heute', 'in', 'Klasse'],

  'A2:TEMPORALSATZ:0': ['Als', 'Kind', 'wohnte', 'ich', 'auf', 'Land'],
  'A2:TEMPORALSATZ:6': ['In', 'Berlin', 'lernte', 'ich', 'viel', 'Deutsch'],
  'A2:TEMPORALSATZ:10': ['Bei', 'Müdigkeit', 'solltest', 'du', 'schlafen'],
  'A2:TEMPORALSATZ:12': ['Als', 'junge', 'Frau', 'tanzte', 'sie', 'gern'],
  'A2:TEMPORALSATZ:13': ['Bei', 'Krankheit', 'bleibe', 'ich', 'Zuhause'],
  'A2:TEMPORALSATZ:15': ['Nach', 'Reisebuchung', 'sind', 'wir', 'glücklich'],
  'A2:TEMPORALSATZ:16': ['Nach', 'Aufwachen', 'trinke', 'ich', 'Kaffee'],

  'A2:LOKALPRÄPOSITIONENA2:0': ['Die', 'Bank', 'ist', 'gegenüber', 'der', 'Post'],
  'A2:LOKALPRÄPOSITIONENA2:1': ['Das', 'Café', 'ist', 'neben', 'dem', 'Park'],
  'A2:LOKALPRÄPOSITIONENA2:12': ['Das', 'Kind', 'steht', 'neben', 'Mutter', 'beim', 'Einkaufen'],
};

// KOMPARATIVA2:16 — second pass
DUPLICATE_FIXES['A2:KOMPARATIVA2:16'] = ['Trotzdem', 'gewann', 'ich', 'als', 'stärkerer', 'Sportler'];

// AKKUSATIVA2:1 — "an" twice
DUPLICATE_FIXES['A2:AKKUSATIVA2:1'] = ['Er', 'denkt', 'gern', 'an', 'Urlaub', 'Mosel'];
