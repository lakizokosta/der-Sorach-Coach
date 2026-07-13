/**
 * B2 AKKUSATIV&DATIVOBJEKT — word-order exercises (25 dropbox + 25 select-one).
 * Rules: Nomen → Dativ vor Akkusativ; Pronomen → Akkusativ vor Dativ.
 */

import { options4 } from './b2-select-one-shared.mjs';

const PROMPT = 'Welche Wortstellung ist korrekt?';

/** @param {[string, string, string, string, string][]} items [hint, correct, wrong1, wrong2, wrong3] */
function selectOneBank(items, seed = 51) {
  const out = [];
  for (let i = 0; i < 25; i++) {
    const [hint, correct, w1, w2, w3] = items[i % items.length];
    const pool = [correct, w1, w2, w3];
    out.push({
      prompt: PROMPT,
      options: options4(correct, pool, i + seed),
      correct,
      hint,
    });
  }
  return out;
}

const SELECT_ONE_RAW = [
  [
    'Dativ-Pronomen + Akkusativ-Nomen',
    'Sie gibt ihm den Vertrag.',
    'Sie gibt den Vertrag ihm.',
    'Ihm gibt sie den Vertrag.',
    'Den Vertrag gibt sie ihm.',
  ],
  [
    'Dativ-Pronomen + Akkusativ-Nomen',
    'Der Anwalt erklärt ihm die rechtliche Lage.',
    'Der Anwalt erklärt die rechtliche Lage ihm.',
    'Ihm erklärt der Anwalt die rechtliche Lage.',
    'Die rechtliche Lage erklärt der Anwalt ihm.',
  ],
  [
    'Dativ-Pronomen + Akkusativ-Nomen',
    'Er zeigt ihr die neuen Unterlagen.',
    'Er zeigt die neuen Unterlagen ihr.',
    'Ihr zeigt er die neuen Unterlagen.',
    'Die neuen Unterlagen zeigt er ihr.',
  ],
  [
    'Dativ-Pronomen + Akkusativ-Nomen',
    'Der Professor stellt ihm eine schwierige Frage.',
    'Der Professor stellt eine schwierige Frage ihm.',
    'Ihm stellt der Professor eine schwierige Frage.',
    'Eine schwierige Frage stellt der Professor ihm.',
  ],
  [
    'Dativ-Pronomen + Akkusativ-Nomen',
    'Die Redaktion schickt ihm die Korrekturen.',
    'Die Redaktion schickt die Korrekturen ihm.',
    'Ihm schickt die Redaktion die Korrekturen.',
    'Die Korrekturen schickt die Redaktion ihm.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Nomen',
    'Der Chef erklärt es dem Team.',
    'Der Chef erklärt dem Team es.',
    'Dem Team erklärt der Chef es.',
    'Es erklärt der Chef dem Team.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Nomen',
    'Ich gebe es dem Minister.',
    'Ich gebe dem Minister es.',
    'Dem Minister gebe ich es.',
    'Es gebe ich dem Minister.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Nomen',
    'Wir empfehlen es unserem Mandanten.',
    'Wir empfehlen unserem Mandanten es.',
    'Unserem Mandanten empfehlen wir es.',
    'Es empfehlen wir unserem Mandanten.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Nomen',
    'Die Ärztin verschreibt es der Patientin.',
    'Die Ärztin verschreibt der Patientin es.',
    'Der Patientin verschreibt die Ärztin es.',
    'Es verschreibt die Ärztin der Patientin.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Nomen',
    'Er leiht es seinem Bruder.',
    'Er leiht seinem Bruder es.',
    'Seinem Bruder leiht er es.',
    'Es leiht er seinem Bruder.',
  ],
  [
    'Dativ-Nomen + Akkusativ-Nomen',
    'Wir schicken dem Kunden das Angebot.',
    'Wir schicken das Angebot dem Kunden.',
    'Dem Kunden schicken wir das Angebot.',
    'Das Angebot schicken wir dem Kunden.',
  ],
  [
    'Dativ-Nomen + Akkusativ-Nomen',
    'Die Ärztin verschreibt der Patientin das Medikament.',
    'Die Ärztin verschreibt das Medikament der Patientin.',
    'Der Patientin verschreibt die Ärztin das Medikament.',
    'Das Medikament verschreibt die Ärztin der Patientin.',
  ],
  [
    'Dativ-Nomen + Akkusativ-Nomen',
    'Der Trainer erklärt dem Team die neue Taktik.',
    'Der Trainer erklärt die neue Taktik dem Team.',
    'Dem Team erklärt der Trainer die neue Taktik.',
    'Die neue Taktik erklärt der Trainer dem Team.',
  ],
  [
    'Dativ-Nomen + Akkusativ-Nomen',
    'Ich schreibe meinem Freund eine lange E-Mail.',
    'Ich schreibe eine lange E-Mail meinem Freund.',
    'Meinem Freund schreibe ich eine lange E-Mail.',
    'Eine lange E-Mail schreibe ich meinem Freund.',
  ],
  [
    'Dativ-Nomen + Akkusativ-Nomen',
    'Die Kommission überreicht der Forscherin die Auszeichnung.',
    'Die Kommission überreicht die Auszeichnung der Forscherin.',
    'Der Forscherin überreicht die Kommission die Auszeichnung.',
    'Die Auszeichnung überreicht die Kommission der Forscherin.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Ich gebe es ihm.',
    'Ich gebe ihm es.',
    'Ihm gebe ich es.',
    'Es gebe ich ihm.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Er schickt sie ihr.',
    'Er schickt ihr sie.',
    'Ihr schickt er sie.',
    'Sie schickt er ihr.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Kannst du es mir geben?',
    'Kannst du mir es geben?',
    'Mir kannst du es geben?',
    'Es kannst du mir geben?',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Wir zeigen es euch.',
    'Wir zeigen euch es.',
    'Euch zeigen wir es.',
    'Es zeigen wir euch.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Der Chef gibt es Ihnen.',
    'Der Chef gibt Ihnen es.',
    'Ihnen gibt der Chef es.',
    'Es gibt der Chef Ihnen.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Sie erklärt es uns.',
    'Sie erklärt uns es.',
    'Uns erklärt sie es.',
    'Es erklärt sie uns.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Er schenkt es ihr.',
    'Er schenkt ihr es.',
    'Ihr schenkt er es.',
    'Es schenkt er ihr.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Du gibst es ihm.',
    'Du gibst ihm es.',
    'Ihm gibst du es.',
    'Es gibst du ihm.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Ich schicke es dir.',
    'Ich schicke dir es.',
    'Dir schicke ich es.',
    'Es schicke ich dir.',
  ],
  [
    'Akkusativ-Pronomen + Dativ-Pronomen',
    'Wir geben es ihnen.',
    'Wir geben ihnen es.',
    'Ihnen geben wir es.',
    'Es geben wir ihnen.',
  ],
];

export function genAkkusativDativobjektWordOrder() {
  return selectOneBank(SELECT_ONE_RAW);
}

/** @param {{ hint: string, words: string[] }[]} items */
function cycle25(items) {
  const out = [];
  for (let i = 0; i < 25; i++) out.push(items[i % items.length]);
  return out;
}

export const DROPBOX_RAW = [
  {
    hint: 'Dativ-Pronomen + Akkusativ-Nomen',
    words: ['Sie', 'gibt', 'ihm', 'den', 'Vertrag'],
  },
  {
    hint: 'Dativ-Pronomen + Akkusativ-Nomen',
    words: ['Der', 'Anwalt', 'erklärt', 'ihm', 'die', 'rechtliche', 'Lage'],
  },
  {
    hint: 'Dativ-Pronomen + Akkusativ-Nomen',
    words: ['Er', 'zeigt', 'ihr', 'die', 'neuen', 'Unterlagen'],
  },
  {
    hint: 'Dativ-Pronomen + Akkusativ-Nomen',
    words: ['Der', 'Professor', 'stellt', 'ihm', 'eine', 'schwierige', 'Frage'],
  },
  {
    hint: 'Dativ-Pronomen + Akkusativ-Nomen',
    words: ['Die', 'Redaktion', 'schickt', 'ihm', 'die', 'Korrekturen'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Nomen',
    words: ['Der', 'Chef', 'erklärt', 'es', 'dem', 'Team'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Nomen',
    words: ['Ich', 'gebe', 'es', 'dem', 'Minister'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Nomen',
    words: ['Wir', 'empfehlen', 'es', 'unserem', 'Mandanten'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Nomen',
    words: ['Die', 'Ärztin', 'verschreibt', 'es', 'der', 'Patientin'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Nomen',
    words: ['Er', 'leiht', 'es', 'seinem', 'Bruder'],
  },
  {
    hint: 'Dativ-Nomen + Akkusativ-Nomen',
    words: ['Wir', 'schicken', 'dem', 'Kunden', 'das', 'Angebot'],
  },
  {
    hint: 'Dativ-Nomen + Akkusativ-Nomen',
    words: ['Die', 'Ärztin', 'verschreibt', 'der', 'Patientin', 'das', 'Medikament'],
  },
  {
    hint: 'Dativ-Nomen + Akkusativ-Nomen',
    words: ['Der', 'Trainer', 'erklärt', 'dem', 'Team', 'die', 'neue', 'Taktik'],
  },
  {
    hint: 'Dativ-Nomen + Akkusativ-Nomen',
    words: ['Ich', 'schreibe', 'meinem', 'Freund', 'eine', 'lange', 'E-Mail'],
  },
  {
    hint: 'Dativ-Nomen + Akkusativ-Nomen',
    words: ['Die', 'Kommission', 'überreicht', 'der', 'Forscherin', 'die', 'Auszeichnung'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Ich', 'gebe', 'es', 'ihm'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Er', 'schickt', 'sie', 'ihr'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Kannst', 'du', 'es', 'mir', 'geben', '?'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Wir', 'zeigen', 'es', 'euch'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Der', 'Chef', 'gibt', 'es', 'Ihnen'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Sie', 'erklärt', 'es', 'uns'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Er', 'schenkt', 'es', 'ihr'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Du', 'gibst', 'es', 'ihm'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Ich', 'schicke', 'es', 'dir'],
  },
  {
    hint: 'Akkusativ-Pronomen + Dativ-Pronomen',
    words: ['Wir', 'geben', 'es', 'ihnen'],
  },
];

export const DROPBOX_BANK = cycle25(DROPBOX_RAW);
