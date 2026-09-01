/**
 * @fileoverview Static grammar hints for every supported topic.
 *
 * Each entry is keyed by the canonical topic key (uppercase, no diacritics)
 * and exposes three localized variants:
 *   - DE: German explanation (default).
 *   - RU: Russian explanation.
 *   - EN: English explanation.
 *
 * The hints intentionally stay short (one rich paragraph) so they can be
 * displayed inline below a wrong answer without overwhelming the learner.
 */

export const GRAMMAR_HINTS = {
  // ─── A1 ───────────────────────────────────────────────────────────────────
  ARTIKEL: {
    DE: 'Jedes Nomen hat ein festes Genus — lerne es immer mit dem Artikel: der Tisch (mask.), die Lampe (fem.), das Buch (neutr.). Erkennungshilfen: -ung/-heit/-keit/-ion → die; -chen/-lein/-ment → das; Berufe/Wochentage oft → der. Im Zweifel: Wörterbuch!',
    RU: 'Род существительного фиксированный — учи всегда вместе с артиклем: der Tisch (муж.), die Lampe (жен.), das Buch (ср.). Ориентиры: -ung/-heit/-keit/-ion → die; -chen/-lein/-ment → das; профессии/дни недели → часто der. Не угадывай — смотри в словарь!',
    EN: 'Every noun has a fixed gender — always learn it with the article: der Tisch (masc.), die Lampe (fem.), das Buch (neut.). Clues: -ung/-heit/-keit/-ion → die; -chen/-lein/-ment → das; professions/weekdays → often der. When in doubt: check the dictionary!',
  },
  NOMINATIVA1: {
    DE: 'Nominativ = Subjekt (Wer/Was macht etwas?). Test: Wer/Was + Verb → das ist der Nominativ. Artikel: der (mask.), die (fem.), das (neutr.), die (Pl.). Achtung: Verb steht IMMER auf Position 2.',
    RU: 'Nominativ = подлежащее (кто/что совершает действие?). Тест: задай Wer?/Was? к глаголу. Артикли: der/die/das/die. Внимание: глагол ВСЕГДА на 2-м месте.',
    EN: 'Nominative = subject (who/what does the action?). Test: ask Wer?/Was? + verb. Articles: der/die/das/die. Note: verb is ALWAYS in position 2.',
  },
  AKKUSATIVA1: {
    DE: 'Akkusativ = direktes Objekt (Wen/Was?). Nur Maskulin ändert sich: der→den, ein→einen, kein→keinen. Pronomen: ich→mich, du→dich, er→ihn. Verben: kaufen, sehen, haben, nehmen, brauchen.',
    RU: 'Akkusativ = прямое дополнение (кого/что?). Меняется ТОЛЬКО мужской род: der→den, ein→einen. Местоимения: ich→mich, du→dich, er→ihn. Глаголы: kaufen, sehen, haben, nehmen.',
    EN: 'Accusative = direct object (whom/what?). Only masculine changes: der→den, ein→einen. Pronouns: ich→mich, du→dich, er→ihn. Verbs: kaufen, sehen, haben, nehmen.',
  },
  DATIVA1: {
    DE: 'Dativ = indirektes Objekt (Wem?). Artikel: dem (mask./neutr.), der (fem.), einem/einer. Präpositionen IMMER mit Dativ: mit, bei, nach, seit, von, zu, aus. Verben: helfen, gefallen, gehören.',
    RU: 'Dativ = косвенное дополнение (кому?). Артикли: dem (муж./ср.), der (жен.). Предлоги ВСЕГДА с Dativ: mit, bei, nach, seit, von, zu, aus. Глаголы: helfen, gefallen, gehören.',
    EN: 'Dative = indirect object (to whom?). Articles: dem (masc./neut.), der (fem.). Prepositions ALWAYS dative: mit, bei, nach, seit, von, zu, aus. Verbs: helfen, gefallen, gehören.',
  },
  POSSESSIVARTIKEL: {
    DE: 'Possessivartikel: mein, dein, sein, ihr, unser, euer, ihr/Ihr. Endungen wie ein/kein. Nom. mask. ohne Endung, fem. -e, neutr. ohne. Akk. mask. -en. Dativ mask./neutr. -em, fem. -er.',
    RU: 'Притяжательные: mein, dein, sein, ihr, unser, euer. Окончания как у ein/kein. Nom. муж. без, жен. -e. Akk. муж. -en. Dativ муж./ср. -em, жен. -er.',
    EN: 'Possessives: mein, dein, sein, ihr, unser, euer. Endings like ein/kein. Nom. masc. no ending, fem. -e. Acc. masc. -en. Dat. masc./neut. -em, fem. -er.',
  },
  PLURAL: {
    DE: 'Plural-Formen kann man nicht ableiten — sie müssen mit dem Wort gelernt werden! Typen: -e, -er, -(e)n, -s, Umlaut. Plural-Artikel ist immer die.',
    RU: 'Формы мн.ч. нельзя вывести из правила — учи вместе с каждым словом! Типы: -e, -er, -(e)n, -s, умлаут. Артикль мн.ч. всегда die.',
    EN: 'Plural forms cannot be derived from a rule — memorize with each word! Types: -e, -er, -(e)n, -s, umlaut. Plural article always die.',
  },
  VERBKONJUGATION: {
    DE: 'Präsens: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Vokalwechsel NUR bei du/er: a→ä, e→ie, e→i. sein und haben sind unregelmäßig.',
    RU: 'Настоящее: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie -en. Изменение гласной ТОЛЬКО у du/er: a→ä, e→ie, e→i. sein и haben нерегулярные.',
    EN: 'Present tense: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie -en. Vowel change ONLY in du/er: a→ä, e→ie, e→i. Sein and haben are irregular.',
  },
  'W-FRAGEN': {
    DE: 'W-Fragen: Wer?(Nom.), Wen?(Akk.), Wem?(Dat.), Was?, Wo?, Wohin?, Woher?, Wann?, Wie?, Warum?. Verb steht direkt nach dem Fragewort auf Position 2.',
    RU: 'W-вопросы: Wer?, Wen?, Wem?, Was?, Wo?, Wohin?, Woher?, Wann?, Wie?, Warum?. Глагол на 2-й позиции после вопросительного слова.',
    EN: 'W-questions: Wer?, Wen?, Wem?, Was?, Wo?, Wohin?, Woher?, Wann?, Wie?, Warum?. Verb in position 2 after the question word.',
  },
  NEGATION: {
    DE: 'kein negiert Nomen (kein Auto, keine Zeit). nicht negiert alles andere. Verb → ans Satzende; Adjektiv/Adverb → direkt davor; Präpositionalgruppe → direkt davor.',
    RU: 'kein отрицает существительное (kein Auto). nicht — всё остальное. Глагол → в конец; прилагательное/наречие → перед ним; предложная группа → перед ней.',
    EN: 'kein negates nouns (kein Auto). nicht negates everything else. Verb → to end; adjective/adverb → right before; prepositional phrase → right before.',
  },
  GEGENTEILE: {
    DE: 'Antonyme — Vokabeln, keine Grammatik. Lerne paarweise: groß↔klein, schnell↔langsam, warm↔kalt, teuer↔billig. jung (Mensch) ≠ neu (Sache).',
    RU: 'Антонимы — лексика. Учи парами: groß↔klein, schnell↔langsam, warm↔kalt, teuer↔billig. jung (человек) ≠ neu (предмет).',
    EN: 'Antonyms — vocabulary. Learn in pairs: groß↔klein, schnell↔langsam, warm↔kalt, teuer↔billig. jung (person) ≠ neu (thing).',
  },
  WECHSELPRÄPOSITIONEN: {
    DE: '9 Wechselpräpositionen: an, auf, hinter, in, neben, über, unter, vor, zwischen. Wo? → Dativ. Wohin? → Akkusativ. Verben: liegen/stehen (Wo?) vs. legen/stellen (Wohin?).',
    RU: '9 двойных предлогов: an, auf, hinter, in, neben, über, unter, vor, zwischen. Wo? → Dativ. Wohin? → Akkusativ. Глаголы: liegen/stehen vs. legen/stellen.',
    EN: '9 two-way prepositions: an, auf, hinter, in, neben, über, unter, vor, zwischen. Wo? → Dative. Wohin? → Accusative. Verbs: liegen/stehen vs. legen/stellen.',
  },
  ADJEKTIVDEKLINATIONA1: {
    DE: 'Typ 1 (nach der/die/das): Nom. -e, sonst -en. Typ 2 (nach ein/kein/mein): Nom. mask. -er, fem. -e, neutr. -es, Rest -en. Typ 3 (ohne Artikel): wie der-Endungen.',
    RU: 'Тип 1 (после der/die/das): Им. -e, остальные -en. Тип 2 (после ein/kein): Им. муж. -er, жен. -e, ср. -es. Тип 3 (без артикля): как у определённого артикля.',
    EN: 'Type 1 (after der/die/das): nom. -e, rest -en. Type 2 (after ein/kein): nom. masc. -er, fem. -e, neut. -es. Type 3 (no article): like definite article.',
  },

  // ─── A2 ───────────────────────────────────────────────────────────────────
  AKKUSATIVA2: {
    DE: 'Präpositionen IMMER mit Akkusativ: durch, für, gegen, ohne, um, bis, entlang. Merksatz: durch-für-gegen-ohne-um. Pronomen: mich, dich, ihn, sie, es, uns, euch.',
    RU: 'Предлоги ВСЕГДА с Akkusativ: durch, für, gegen, ohne, um, bis, entlang. Запомни: durch-für-gegen-ohne-um. Местоимения: mich, dich, ihn, sie, es.',
    EN: 'Prepositions ALWAYS with accusative: durch, für, gegen, ohne, um, bis, entlang. Pronouns: mich, dich, ihn, sie, es, uns, euch.',
  },
  DATIVA2: {
    DE: 'Präpositionen mit Dativ: mit, bei, nach, seit, von, zu, aus, gegenüber. mit + Verkehrsmittel, nach + Städte ohne Artikel, zu + Personen/Institutionen.',
    RU: 'Предлоги с Dativ: mit, bei, nach, seit, von, zu, aus. mit + транспорт, nach + города без артикля, zu + люди/учреждения.',
    EN: 'Prepositions with dative: mit, bei, nach, seit, von, zu, aus. mit + transport, nach + cities without article, zu + persons/institutions.',
  },
  PERFEKTA2: {
    DE: 'Perfekt = haben/sein + Partizip II. Schwache: ge-+t. Starke: ge-+en. -ieren: ohne ge-. sein: Bewegung (fahren), Zustandswechsel (aufwachen), bleiben, sein.',
    RU: 'Perfekt = haben/sein + Partizip II. Слабые: ge-+t. Сильные: ge-+en. -ieren: без ge-. sein: движение, смена состояния, bleiben, sein.',
    EN: 'Perfect = haben/sein + Partizip II. Weak: ge-+t. Strong: ge-+en. -ieren: no ge-. sein: motion, change of state, bleiben, sein.',
  },
  KONJUNKTIONENA2: {
    DE: 'Unterordnende → Verb ans Ende: weil, da, dass, wenn, obwohl, damit, bevor, nachdem. Nebenordnende (Verb Pos. 2): aber, oder, und, denn, sondern.',
    RU: 'Подчинительные → глагол в конец: weil, da, dass, wenn, obwohl, damit, bevor. Сочинительные (Pos. 2): aber, oder, und, denn, sondern.',
    EN: 'Subordinating → verb to end: weil, da, dass, wenn, obwohl, damit, bevor. Coordinating (pos. 2): aber, oder, und, denn, sondern.',
  },
  KOMPARATIVA2: {
    DE: 'Komparativ: Adjektiv + -er. Umlaut bei a/o/u (kalt→kälter). Unregelmäßig: gut→besser, viel→mehr, gern→lieber. als beim Vergleich, wie bei Gleichheit.',
    RU: 'Сравнительная: + -er. Умлаут у a/o/u (kalt→kälter). Нерегулярные: gut→besser, viel→mehr, gern→lieber. als при сравнении, wie при равенстве.',
    EN: 'Comparative: + -er. Umlaut with a/o/u (kalt→kälter). Irregular: gut→besser, viel→mehr, gern→lieber. als for comparison, wie for equality.',
  },
  SUPERLATIVA2: {
    DE: 'Superlativ: am + Adjektiv + -(e)sten (am schnellsten). Vor Nomen: der/die/das + -(e)ste. Unregelmäßig: am besten, am meisten, am liebsten, am höchsten.',
    RU: 'Превосходная: am + прил. + -(e)sten. Перед существительным: der/die/das + -(e)ste. Нерегулярные: am besten, am meisten, am liebsten.',
    EN: 'Superlative: am + adjective + -(e)sten. Before noun: der/die/das + -(e)ste. Irregular: am besten, am meisten, am liebsten, am höchsten.',
  },
  MODALVERBENA2: {
    DE: 'können, müssen, dürfen, wollen, sollen, möchten. Position 2, Infinitiv ans Ende. ich/er/sie/es OHNE Endung! nicht dürfen = Verbot; nicht müssen = keine Pflicht.',
    RU: 'können, müssen, dürfen, wollen, sollen, möchten. Поз. 2, инфинитив в конец. ich/er/sie/es БЕЗ окончания! nicht dürfen = запрет; nicht müssen = не обязательно.',
    EN: 'können, müssen, dürfen, wollen, sollen, möchten. Pos. 2, infinitive to end. ich/er/sie/es NO ending! nicht dürfen = prohibition; nicht müssen = not obligatory.',
  },
  PRÄTERITUMA2: {
    DE: 'Schwache: Stamm + -(e)te. Starke: unregelmäßig (gehen→ging, kommen→kam). sein/haben IMMER im Präteritum, auch im Gespräch (war/waren, hatte/hatten).',
    RU: 'Слабые: основа + -(e)te. Сильные: нерегулярно (ging, kam, sah). sein/haben ВСЕГДА в Präteritum даже в речи (war, hatte).',
    EN: 'Weak: stem + -(e)te. Strong: irregular (ging, kam, sah). sein/haben ALWAYS in Präteritum even in speech (war, hatte).',
  },
  WECHSELPRÄPOSITIONENA2: {
    DE: '9 Wechselpräpositionen. Wo? → Dativ. Wohin? → Akkusativ. Kurzformen: im, ins, am, ans. Paare: liegen/legen, stehen/stellen.',
    RU: '9 двойных предлогов. Wo? → Dativ. Wohin? → Akkusativ. Сокращения: im, ins, am, ans. Пары: liegen/legen, stehen/stellen.',
    EN: '9 two-way prepositions. Wo? → Dative. Wohin? → Accusative. Contractions: im, ins, am, ans. Pairs: liegen/legen, stehen/stellen.',
  },
  TRENNBAREVERBEN: {
    DE: 'Trennbare Präfixe: auf-, an-, aus-, ein-, mit-, vor-, zu-, ab-, weg-, zurück-. Präfix ans Satzende im Hauptsatz. Partizip II: ge- zwischen Präfix und Stamm (angerufen).',
    RU: 'Отделяемые приставки: auf-, an-, aus-, ein-, mit-, vor-, zu-, ab-, weg-. Приставка в конец главного. Partizip II: ge- между приставкой и корнем (angerufen).',
    EN: 'Separable prefixes: auf-, an-, aus-, ein-, mit-, vor-, zu-, ab-, weg-. Prefix to end of main clause. Partizip II: ge- between prefix and stem (angerufen).',
  },
  REFLEXIVPRONOMEN: {
    DE: 'Akk.: mich, dich, sich, uns, euch, sich. Dat.: mir, dir, sich, uns, euch, sich. Akk. wenn kein Akk.-Objekt; Dat. wenn Akk.-Objekt vorhanden (sich die Hände waschen).',
    RU: 'Akk.: mich, dich, sich. Dat.: mir, dir, sich. Akk. если нет Akk.-объекта; Dat. если Akk.-объект уже есть (sich die Hände waschen).',
    EN: 'Acc.: mich, dich, sich. Dat.: mir, dir, sich. Acc. if no acc. object; dat. if acc. object present (sich die Hände waschen).',
  },
  ANTWORTPARTIKELN: {
    DE: 'ja bestätigt Positives, nein verneint, doch widerspricht einer Verneinung! "Kommst du nicht?" → "Doch, ich komme!" (NICHT ja).',
    RU: 'ja подтверждает, nein отрицает, doch — опровергает отрицание! "Kommst du nicht?" → "Doch, ich komme!" (НЕ ja).',
    EN: 'ja confirms, nein denies, doch contradicts a negation! "Kommst du nicht?" → "Doch, ich komme!" (NOT ja).',
  },
  FESTEPRÄPOSITIONENA2: {
    DE: 'warten auf (Akk.), denken an (Akk.), sich freuen über/auf (Akk.), teilnehmen an (Dat.), fragen nach (Dat.). Sachen → da(r)+Präp. Personen → Präp.+Pronomen.',
    RU: 'warten auf, denken an, sich freuen über/auf, teilnehmen an, fragen nach. Предметы → da(r)+предлог. Люди → предлог+местоимение.',
    EN: 'warten auf, denken an, sich freuen über/auf, teilnehmen an, fragen nach. Things → da(r)+prep. Persons → prep.+pronoun.',
  },
  POSSESSIVARTIKELA2: {
    DE: 'Dativ: mask./neutr. -em, fem. -er, Pl. -en. Genitiv: mask./neutr. -es, fem./Pl. -er. Merke: Dat. fem. immer -er; Gen. mask./neutr. immer -es.',
    RU: 'Dativ: муж./ср. -em, жен. -er, мн. -en. Genitiv: муж./ср. -es, жен./мн. -er. Запомни: Dat. жен. всегда -er; Gen. муж./ср. всегда -es.',
    EN: 'Dative: masc./neut. -em, fem. -er, pl. -en. Genitive: masc./neut. -es, fem./pl. -er. Note: dat. fem. always -er; gen. masc./neut. always -es.',
  },
  SATZSTELLUNGA2: {
    DE: 'Hauptsatz: Verb auf Pos. 2. Nebensatz: Verb ans Ende. Nach Nebensatz → Inversion. Reihenfolge: TeKaMoLo (Temporal, Kausal, Modal, Lokal).',
    RU: 'Главное: глагол на Pos. 2. Придаточное: глагол в конец. После придаточного → инверсия. Порядок: TeKaMoLo.',
    EN: 'Main clause: verb pos. 2. Subclause: verb to end. After subclause → inversion. Order: TeKaMoLo (Temporal, Causal, Modal, Local).',
  },
  ADJEKTIVDEKLINATIONA2: {
    DE: 'Typ 1 (nach der/die/das): Nom. -e, sonst -en. Typ 2 (nach ein/kein): Nom. mask. -er, fem. -e, neutr. -es. Plural nach Artikel: immer -en.',
    RU: 'Тип 1: Им. -e, остальные -en. Тип 2: Им. муж. -er, жен. -e, ср. -es. Мн.ч. после артикля: всегда -en.',
    EN: 'Type 1: nom. -e, rest -en. Type 2: nom. masc. -er, fem. -e, neut. -es. Plural after article: always -en.',
  },
  INDEFINITPRONOMEN: {
    DE: 'man (wie er/sie/es). jemand/niemand (jemanden/jemandem). etwas/nichts. alle/viele/einige + Plural-Verb.',
    RU: 'man (как er/sie/es). jemand/niemand. etwas/nichts. alle/viele + глагол во мн.ч.',
    EN: 'man (like er/sie/es). jemand/niemand. etwas/nichts. alle/viele + plural verb.',
  },
  GENITIVA2: {
    DE: 'Mask./Neutr.: des + Nomen+(e)s. Fem./Plural: der. Präpositionen: wegen, trotz, während, statt. Alltagssprache oft: von + Dativ.',
    RU: 'Муж./ср.: des + сущ.+(e)s. Жен./мн.ч.: der. Предлоги: wegen, trotz, während, statt. В разговоре: von + Dativ.',
    EN: 'Masc./neut.: des + noun+(e)s. Fem./pl.: der. Prepositions: wegen, trotz, während, statt. In speech often: von + dative.',
  },
  NOMENPRÄPOSITIONVERBINDUNGA2: {
    DE: 'Interesse an (Dat.), Angst vor (Dat.), Freude über (Akk.), Grund für (Akk.), Antwort auf (Akk.), Problem mit (Dat.).',
    RU: 'Interesse an, Angst vor, Freude über, Grund für, Antwort auf, Problem mit.',
    EN: 'Interesse an, Angst vor, Freude über, Grund für, Antwort auf, Problem mit.',
  },
  TEMPORALSATZ: {
    DE: 'als: einmaliges Ereignis in Vergangenheit. wenn: Wiederholung/Zukunft. während: Gleichzeitigkeit. bevor: vorher. nachdem: danach + Plusquamperfekt.',
    RU: 'als: однократно в прошлом. wenn: повторение/будущее. während: одновременность. bevor: до. nachdem: после + Plusquamperfekt.',
    EN: 'als: single past event. wenn: repeated/future. während: simultaneous. bevor: before. nachdem: after + Plusquamperfekt.',
  },
  LOKALPRÄPOSITIONENA2: {
    DE: 'Wo? → Dativ. Wohin? → Akkusativ. in/auf/an. bei (nur Dativ). nach + Städte ohne Artikel. zu + Personen/Institutionen.',
    RU: 'Wo? → Dativ. Wohin? → Akkusativ. in/auf/an. bei (только Dativ). nach + города без артикля. zu + люди/учреждения.',
    EN: 'Wo? → Dat. Wohin? → Acc. in/auf/an. bei (dat. only). nach + cities without article. zu + persons/institutions.',
  },
  'N-DEKLINATION': {
    DE: 'Maskuline Nomen: -n/-en in allen Kasus außer Nom. Erkennung: Endung -e (Junge→Jungen), -ent/-ist/-at (Student→Studenten). Ausnahme: der Herr → den Herrn.',
    RU: 'Муж. существительные: -n/-en во всех падежах кроме Nom. Признаки: -e, -ent/-ist/-at. Исключение: der Herr → den Herrn.',
    EN: 'Masculine nouns: -n/-en in all cases except nom. Clues: -e, -ent/-ist/-at. Exception: der Herr → den Herrn.',
  },

  // ─── B1 ───────────────────────────────────────────────────────────────────
  RELATIVSATZB1: {
    DE: 'Genus/Numerus = Bezugsnomen; Kasus = Funktion im Relativsatz. Nom. der/die/das/die | Akk. den/die/das/die | Dat. dem/der/dem/denen | Gen. dessen/deren/dessen/deren.',
    RU: 'Род/число = существительное; падеж = функция. Nom. der/die/das/die | Akk. den/die/das/die | Dat. dem/der/dem/denen | Gen. dessen/deren.',
    EN: 'Gender/number = noun; case = role in clause. Nom. der/die/das/die | Acc. den/die/das/die | Dat. dem/der/dem/denen | Gen. dessen/deren.',
  },
  KAUSALSATZ: {
    DE: 'weil/da: Nebensatz → Verb ans Ende. denn: Hauptsatz → Verb Pos. 2. deshalb/daher/deswegen: Konjunktionaladverb → Inversion.',
    RU: 'weil/da: придаточное → V в конец. denn: главное → V на Pos. 2. deshalb/daher: союзное наречие → инверсия.',
    EN: 'weil/da: subclause → verb to end. denn: main clause → verb pos. 2. deshalb/daher: conjunctional adverb → inversion.',
  },
  KONZESSIVSATZ: {
    DE: 'obwohl + Nebensatz → Verb ans Ende. trotzdem/dennoch → Inversion. NICHT mischen: obwohl ≠ trotzdem.',
    RU: 'obwohl + придаточное → V в конец. trotzdem/dennoch → инверсия. НЕ мешать.',
    EN: 'obwohl + subclause → verb to end. trotzdem/dennoch → inversion. Do not mix.',
  },
  KONZESSIVSATZB1: {
    DE: 'obwohl + Nebensatz → Verb ans Ende. trotzdem/dennoch → Inversion. NICHT mischen: obwohl ≠ trotzdem.',
    RU: 'obwohl + придаточное → V в конец. trotzdem/dennoch → инверсия.',
    EN: 'obwohl + subclause → verb to end. trotzdem/dennoch → inversion.',
  },
  FINALSATZ: {
    DE: 'Gleiche Subjekte → um...zu + Infinitiv. Verschiedene Subjekte → damit + Nebensatz.',
    RU: 'Одно подлежащее → um...zu. Разные → damit.',
    EN: 'Same subject → um...zu. Different subjects → damit.',
  },
  DEMONSTRATIVARTIKEL: {
    DE: 'dieser/diese/dieses (nah). Wie bestimmte Artikel deklinieren. jener/jene/jenes (fern, formal/literarisch).',
    RU: 'dieser/diese/dieses (близкий). Склонение как у определённого артикля. jener (далёкий, формально).',
    EN: 'dieser/diese/dieses (near). Declined like definite article. jener (far, formal/literary).',
  },
  PASSIVB1: {
    DE: 'werden + Partizip II. Präs.: wird repariert. Prät.: wurde repariert. Perf.: ist repariert worden (NICHT geworden!). Agens: von + Dativ.',
    RU: 'werden + Partizip II. Präs.: wird repariert. Prät.: wurde. Perf.: ist repariert worden (НЕ geworden!). Деятель: von + Dativ.',
    EN: 'werden + Partizip II. Pres.: wird repariert. Past: wurde. Perf.: ist repariert worden (NOT geworden!). Agent: von + dative.',
  },
  PRÄPOSITIONENB1: {
    DE: 'Genitiv-Präpositionen: wegen, trotz, während, statt, aufgrund, innerhalb, außerhalb. Bei B1/B2: Genitiv bevorzugen!',
    RU: 'Предлоги с Genitiv: wegen, trotz, während, statt, aufgrund, innerhalb. На B1/B2: предпочитай Genitiv!',
    EN: 'Genitive prepositions: wegen, trotz, während, statt, aufgrund, innerhalb. At B1/B2 prefer genitive!',
  },
  INDIREKTEFRAGESÄTZE: {
    DE: 'Verb ans Ende! W-Fragen behalten Fragewort: Ich weiß nicht, wann er kommt. Ja/Nein-Fragen → ob.',
    RU: 'Глагол в конец! W-вопросы сохраняют слово: Ich weiß nicht, wann er kommt. Да/нет → ob.',
    EN: 'Verb to end! W-questions keep word: Ich weiß nicht, wann er kommt. Yes/no → ob.',
  },
  PRÄPOSITIONALADVERBIEN: {
    DE: 'Pronominaladverbien für Sachen: da(r)+Präp. (darauf, daran, davon). Für Personen: Präp.+Pronomen. Frage: wo(r)+Präp.',
    RU: 'Прономинальные наречия для предметов: da(r)+предлог. Для людей: предлог+местоимение. Вопрос: wo(r)+предлог.',
    EN: 'Pronominal adverbs for things: da(r)+prep. For persons: prep.+pronoun. Question: wo(r)+prep.',
  },
  SPRACHBAUSTEINEB1: {
    DE: 'Formelle Texte: seit + Dauer, ab + Datum, bis + Termin. Kasus prüfen. Formell: möchten, bitten. Verb ans Ende nach dass/weil/obwohl.',
    RU: 'Формальные тексты: seit + длительность, ab + дата, bis + срок. Проверяй падеж. Формально: möchten, bitten.',
    EN: 'Formal texts: seit + duration, ab + date, bis + deadline. Check case. Formal: möchten, bitten.',
  },
  ADJEKTIVDEKLINATIONB1: {
    DE: 'Typ 1 (der/die/das): Nom. -e, sonst -en. Typ 2 (ein/kein/mein): Nom. mask. -er, fem. -e, neutr. -es. Typ 3 (ohne Artikel): wie der-Endungen.',
    RU: 'Тип 1: Nom. -e, остальные -en. Тип 2: муж. -er, жен. -e, ср. -es. Тип 3: как у определённого артикля.',
    EN: 'Type 1: nom. -e, rest -en. Type 2: masc. -er, fem. -e, neut. -es. Type 3: like definite article.',
  },
  AKKUSATIVB1: {
    DE: '2 Objekte: Nomen → Dativ vor Akkusativ. Pronomen → Akkusativ vor Dativ. Pronomen + Nomen → Pronomen zuerst.',
    RU: '2 дополнения: существительные → Dativ перед Akkusativ. Местоимения → Akkusativ перед Dativ.',
    EN: '2 objects: nouns → dative before accusative. Pronouns → accusative before dative.',
  },
  ERGÄNZUNGSSATZ: {
    DE: 'dass/ob: Verb ans Ende. zu + Infinitiv bei gleichem Subjekt. Bei verschiedenen Subjekten nur dass.',
    RU: 'dass/ob: V в конец. zu + Infinitiv при одном подлежащем. При разных — только dass.',
    EN: 'dass/ob: verb to end. zu + infinitive same subject. Different subjects only dass.',
  },
  KONDITIONALSATZ: {
    DE: 'Real: Wenn es regnet, bleibe ich. Irreal (KII): Wenn ich Zeit hätte, würde ich reisen. Ohne wenn → Inversion: Hätte ich Zeit...',
    RU: 'Реальное: Wenn es regnet... Нереальное (KII): Wenn ich Zeit hätte, würde ich reisen. Без wenn → инверсия.',
    EN: 'Real: Wenn es regnet... Unreal (KII): Wenn ich Zeit hätte, würde ich reisen. Without wenn → inversion.',
  },
  KONJUNKTIONALADVERBIEN: {
    DE: 'deshalb/daher/deswegen (folglich), trotzdem/dennoch (aber), außerdem, jedoch, sonst, schließlich. Pos. 1 → Inversion.',
    RU: 'deshalb/daher (поэтому), trotzdem/dennoch (тем не менее), außerdem, jedoch, sonst. Pos. 1 → инверсия.',
    EN: 'deshalb/daher (therefore), trotzdem/dennoch (nevertheless), außerdem, jedoch, sonst. Pos. 1 → inversion.',
  },
  LOKALEPRÄPOSITIONENB1: {
    DE: 'Wohin? nach (Länder ohne Artikel), in (mit Artikel), zu (Personen/Institutionen). Wo? bei. Woher? aus, von.',
    RU: 'Куда? nach (без артикля), in (с артиклем), zu (люди/учреждения). Где? bei. Откуда? aus, von.',
    EN: 'Where to? nach, in, zu. Where? bei. Where from? aus, von.',
  },
  LOKALEPRÄPOSITIONENB2: {
    DE: 'Wo? am/an der, im/in der. Wohin? auf die, vor das. Wo? außerhalb/innerhalb + Genitiv. Richtung: hinauf, entlang, herum (Akk.).',
    RU: 'Wo? am/an der. Wohin? auf die. außerhalb/innerhalb + Genitiv. hinauf, entlang, um … herum (Akk.).',
    EN: 'Wo? am/an der. Wohin? auf die. außerhalb/innerhalb + genitive. hinauf, entlang, um … herum (acc.).',
  },
  NOMENPRÄPOSITIONVERBINDUNGB1: {
    DE: 'Interesse an, Angst vor, Freude über, Einfluss auf, Reaktion auf, Meinung zu, Beziehung zu, Kritik an, Wunsch nach.',
    RU: 'Interesse an, Angst vor, Freude über, Einfluss auf, Reaktion auf, Meinung zu.',
    EN: 'Interesse an, Angst vor, Freude über, Einfluss auf, Reaktion auf, Meinung zu.',
  },
  PERFEKTB1: {
    DE: 'Trennbare: ge- zwischen Präfix und Stamm (angerufen). Untrennbare (be-, er-, ver-, zer-, ent-, ge-, miss-): KEIN ge-. -ieren: KEIN ge-.',
    RU: 'Отделяемые: ge- между приставкой и корнем. Неотделяемые: БЕЗ ge-. -ieren: БЕЗ ge-.',
    EN: 'Separable: ge- between prefix and stem. Non-separable: NO ge-. -ieren: NO ge-.',
  },
  PRÄPOSITIONENGENITIVB1: {
    DE: 'wegen, trotz, während, statt, aufgrund, innerhalb, außerhalb. Mask./neutr.: des+(e)s. Fem./pl.: der.',
    RU: 'wegen, trotz, während, statt, aufgrund. Муж./ср.: des+(e)s. Жен./мн.: der.',
    EN: 'wegen, trotz, während, statt, aufgrund. Masc./neut.: des+(e)s. Fem./pl.: der.',
  },
  PRÄPOSITIONALERGÄNZUNG: {
    DE: 'warten auf, sich freuen über/auf, denken an, sich erinnern an, sich ärgern über, sprechen über/von, teilnehmen an, bitten um.',
    RU: 'warten auf, sich freuen über/auf, denken an, sich erinnern an, sprechen über, teilnehmen an.',
    EN: 'warten auf, sich freuen über/auf, denken an, sich erinnern an, sprechen über, teilnehmen an.',
  },
  POSSESSIVARTIKELB1: {
    DE: 'Als Pronomen (ohne Nomen): meiner/meins/meine. Akk. mask. meinen. Dat. mask./neutr. meinem, fem. meiner, Pl. meinen.',
    RU: 'Как местоимения: meiner/meins/meine. Akk. муж. meinen. Dat. муж./ср. meinem.',
    EN: 'As pronouns: meiner/meins/meine. Acc. masc. meinen. Dat. masc./neut. meinem.',
  },
  TRENNBAREVERBENB1: {
    DE: 'Untrennbare Präfixe: be-, er-, ver-, zer-, ent-, ge-, miss-. Trennbare: an-, auf-, aus-, ein-. Betonung entscheidet bei gleicher Vorsilbe.',
    RU: 'Неотделяемые: be-, er-, ver-, zer-, ent-, ge-, miss-. Отделяемые: an-, auf-, aus-, ein-.',
    EN: 'Non-separable: be-, er-, ver-, zer-, ent-, ge-, miss-. Separable: an-, auf-, aus-, ein-.',
  },
  VERNEINUNG: {
    DE: 'nicht: Verben, Adjektive, Adverbien, Präpositionalgruppen. kein: Nomen. Keine doppelte Verneinung! nicht müssen ≠ darf nicht.',
    RU: 'nicht: глаголы, прилагательные, наречия. kein: существительные. Двойное отрицание невозможно!',
    EN: 'nicht: verbs, adjectives, adverbs, prep. phrases. kein: nouns. No double negation! nicht müssen ≠ darf nicht.',
  },
  VERBNOMENVERBINDUNGB1: {
    DE: 'eine Entscheidung treffen, einen Antrag stellen, zur Verfügung stehen, in Betracht kommen, Rücksicht nehmen auf.',
    RU: 'eine Entscheidung treffen, einen Antrag stellen, zur Verfügung stehen.',
    EN: 'eine Entscheidung treffen, einen Antrag stellen, zur Verfügung stehen.',
  },
  VERBLASSEN: {
    DE: 'lassen + Infinitiv: kausal (Auto reparieren lassen), permissiv (schlafen lassen), Passiversatz (Das lässt sich lösen). Perfekt: hat ... lassen (nicht gelassen!).',
    RU: 'lassen + Infinitiv: каузатив, разрешение, замена пассива. Perfekt: hat ... lassen.',
    EN: 'lassen + infinitive: causative, permissive, passive substitute. Perfect: hat ... lassen.',
  },
  KONJUNKTIV2: {
    DE: 'Eigene KII-Form wenn vom Präteritum verschieden (wäre, hätte, könnte, müsste). Sonst würde + Infinitiv. Höflichkeit, Wunsch, Irreales.',
    RU: 'Собственная форма KII если отличается от Präteritum. Иначе würde + Infinitiv. Вежливость, желание, нереальность.',
    EN: 'Own KII form if different from Präteritum. Otherwise würde + infinitive. Politeness, wish, unreal.',
  },
  KONJUNKTIVB1: {
    DE: 'KII Höflichkeit: Könnten Sie...? Würden Sie...? Wunsch: Ich wünschte, ich hätte Zeit. Irreal: Wenn ich Zeit hätte, würde ich kommen.',
    RU: 'KII: вежливость (Könnten Sie...?), желание, нереальность.',
    EN: 'KII: politeness (Könnten Sie...?), wish, unreal.',
  },
  WORTSCHATZB1: {
    DE: 'Vorsilben: ver- (falsch/weg), be- (transitiv), zer- (kaputt), ent- (Beginn/weg). Komposita: letztes Wort bestimmt Genus.',
    RU: 'Приставки: ver- (ошибка), be- (переходность), zer- (разрушение), ent- (начало). Сложные: последнее слово определяет род.',
    EN: 'Prefixes: ver- (wrong/away), be- (transitive), zer- (broken), ent- (start/away). Compounds: last word determines gender.',
  },

  // ─── B2 ───────────────────────────────────────────────────────────────────
  'AKKUSATIV&DATIVOBJEKT': {
    DE: 'Nomen → Dativ vor Akkusativ. Pronomen → Akkusativ vor Dativ. Pronomen schlägt Nomen.',
    RU: 'Существительные → Dativ перед Akkusativ. Местоимения → Akkusativ перед Dativ.',
    EN: 'Nouns → dative before accusative. Pronouns → accusative before dative.',
  },
  PRÄPOSITIONENGENITIV: {
    DE: 'aufgrund, mithilfe, angesichts, hinsichtlich, infolge, laut, mangels, zwecks — alle + Genitiv.',
    RU: 'aufgrund, mithilfe, angesichts, hinsichtlich, infolge, laut — все + Genitiv.',
    EN: 'aufgrund, mithilfe, angesichts, hinsichtlich, infolge, laut — all + genitive.',
  },
  GENITIVB2: {
    DE: 'Genitivattribut: das Ergebnis der Studie. Formell: Genitiv statt von+Dativ. Wendungen: meiner Meinung nach, im Laufe der Zeit.',
    RU: 'Атрибут: das Ergebnis der Studie. Формально: Genitiv вместо von+Dativ.',
    EN: 'Attribute: das Ergebnis der Studie. Formal: genitive instead of von+dative.',
  },
  FUTURI: {
    DE: 'werden + Infinitiv. Zukunft oder Vermutung (mit wohl). Futur II: wird + Partizip II + haben/sein.',
    RU: 'werden + Infinitiv. Будущее или предположение (с wohl). Futur II: wird + Partizip II + haben/sein.',
    EN: 'werden + infinitive. Future or assumption (with wohl). Futur II: wird + Partizip II + haben/sein.',
  },
  KONSEKUTIVEKONJUNKTION: {
    DE: 'so...dass (Grad): Es war so kalt, dass... sodass (ein Wort, Gesamthandlung). Verb ans Ende des Nebensatzes.',
    RU: 'so...dass (степень). sodass (одно слово, всё действие). Глагол в конец.',
    EN: 'so...dass (degree). sodass (one word, whole action). Verb to end.',
  },
  KONJUNKTIV2B2: {
    DE: 'als ob/als wenn + KII. Vergangenheit: wäre/hätte + Partizip II (wäre gegangen, hätte gemacht).',
    RU: 'als ob/als wenn + KII. Прошлое: wäre/hätte + Partizip II.',
    EN: 'als ob/als wenn + KII. Past: wäre/hätte + Partizip II.',
  },
  KONZESSIVSATZB2: {
    DE: 'obwohl/obgleich/wenngleich → V ans Ende. trotzdem/dennoch/gleichwohl → Inversion. trotz + Genitiv (Nominalphrase).',
    RU: 'obwohl/obgleich → V в конец. trotzdem/dennoch → инверсия. trotz + Genitiv.',
    EN: 'obwohl/obgleich → V to end. trotzdem/dennoch → inversion. trotz + genitive.',
  },
  MODALSATZ: {
    DE: 'indem (Mittel): Er lernt, indem er Karteikarten benutzt. ohne...zu / ohne dass. anstatt...zu / statt dass.',
    RU: 'indem (посредством). ohne...zu / ohne dass. anstatt...zu / statt dass.',
    EN: 'indem (by doing). ohne...zu / ohne dass. anstatt...zu / statt dass.',
  },
  INDIREKTEREDE: {
    DE: 'Konjunktiv I: er sage, sie habe, sie seien. Wenn KI = Indikativ → KII. Vergangenheit → KI Perfekt: habe gesagt.',
    RU: 'Konjunktiv I: er sage, sie habe. Если KI = Indikativ → KII. Прошлое → KI Perfekt.',
    EN: 'Konjunktiv I: er sage, sie habe. If KI = indicative → KII. Past → KI Perfekt.',
  },
  PRÄPOSITIONALADVERBIENB2: {
    DE: 'In Relativsätzen: Das, woran ich denke... Nach alles/nichts/etwas/das/Superlativ → was. Für Personen: Präp.+wer/wen/wem.',
    RU: 'В относительных: das, woran... После alles/nichts/etwas → was. Для людей: предлог+wer/wen/wem.',
    EN: 'In relative clauses: das, woran... After alles/nichts/etwas → was. For persons: prep.+wer/wen/wem.',
  },
  PARTIZIP1: {
    DE: 'Infinitiv + -d (laufend, singend). Aktiv + gleichzeitig. Vor Nomen mit Adjektivendung: das laufende Kind.',
    RU: 'Инфинитив + -d. Активное + одновременное. Перед существительным с окончанием: das laufende Kind.',
    EN: 'Infinitive + -d. Active + simultaneous. Before noun with adjective ending: das laufende Kind.',
  },
  PARTIZIP2: {
    DE: 'Partizip II als Adjektiv: passiv + abgeschlossen. das geschriebene Buch. Erweitert: Das von allen gelesene Buch...',
    RU: 'Partizip II как прилагательное: пассивное + завершённое. das geschriebene Buch.',
    EN: 'Partizip II as adjective: passive + completed. das geschriebene Buch.',
  },
  PASSIVB2: {
    DE: 'Präs.: wird gemacht. Prät.: wurde. Perf.: ist gemacht worden. Futur: wird gemacht werden. Mit Modal: muss gemacht werden.',
    RU: 'Präs.: wird. Prät.: wurde. Perf.: ist gemacht worden. Futur: wird gemacht werden.',
    EN: 'Pres.: wird. Past: wurde. Perf.: ist gemacht worden. Future: wird gemacht werden.',
  },
  PASSIVERSATZ: {
    DE: 'sich lassen + Infinitiv (Möglichkeit). sein + zu + Infinitiv (Pflicht/Möglichkeit). man + Aktiv. bekommen-Passiv.',
    RU: 'sich lassen + Infinitiv. sein + zu + Infinitiv. man + Aktiv. bekommen-пассив.',
    EN: 'sich lassen + infinitive. sein + zu + infinitive. man + active. bekommen passive.',
  },
  REDEWENDUNGEN: {
    DE: 'auf den Zahn fühlen (befragen), das Handtuch werfen (aufgeben), auf die lange Bank schieben (verzögern), auf dem Laufenden bleiben.',
    RU: 'auf den Zahn fühlen, das Handtuch werfen, auf die lange Bank schieben.',
    EN: 'auf den Zahn fühlen, das Handtuch werfen, auf die lange Bank schieben.',
  },
  RELATIVSATZB2: {
    DE: 'was nach alles/nichts/etwas/das/Superlativ. wer/wen/wem ohne Bezugsnomen. wo für Orte. wo(r)+Präp. für Sachen.',
    RU: 'was после alles/nichts/etwas. wer/wen/wem без антецедента. wo для мест. wo(r)+предлог.',
    EN: 'was after alles/nichts/etwas. wer/wen/wem without antecedent. wo for places. wo(r)+prep.',
  },
  RELATIVSATZERWEITERTB2: {
    DE: 'Präp. + Relativpronomen (mit dem, in der…). was nach alles/nichts/etwas/Superlativ. wo / wohin / woher / worauf / womit / wodurch… Genitiv: dessen / deren.',
    RU: 'Предлог + относительное местоимение. was после alles/nichts/etwas. wo / worauf / womit… Genitiv: dessen / deren.',
    EN: 'Prep. + relative pronoun. was after alles/nichts/etwas. wo / worauf / womit… Genitive: dessen / deren.',
  },
  TEKAMOLO: {
    DE: 'Reihenfolge: Temporal, Kausal, Modal, Lokal. Zeit VOR Ort! Pronomen stehen davor.',
    RU: 'Порядок: Temporal, Kausal, Modal, Lokal. ВРЕМЯ перед МЕСТОМ!',
    EN: 'Order: Temporal, Causal, Modal, Local. TIME before PLACE!',
  },
  TEMPORALERNEBENSATZ: {
    DE: 'nachdem + Plusquamperfekt. sobald (sofort), seitdem (seit), solange (während dieser Zeit), kaum dass (kaum...als).',
    RU: 'nachdem + Plusquamperfekt. sobald, seitdem, solange, kaum dass.',
    EN: 'nachdem + Plusquamperfekt. sobald, seitdem, solange, kaum dass.',
  },
  QUIZ: {
    DE: 'B2-Fehlerquellen: KI vs. KII, worden ≠ geworden, Genitiv-Präpositionen, was vs. der/die/das, TeKaMoLo Zeit vor Ort.',
    RU: 'B2-ошибки: KI vs. KII, worden ≠ geworden, Genitiv-предлоги, was vs. der/die/das, TeKaMoLo.',
    EN: 'B2 errors: KI vs. KII, worden ≠ geworden, genitive prepositions, was vs. der/die/das, TeKaMoLo.',
  },
  SPRACHBAUSTEINEB2: {
    DE: 'Kasus prüfen, Konjunktiv prüfen, formelle Alternativen: im Hinblick auf, in Bezug auf, im Rahmen von, angesichts, infolge.',
    RU: 'Падеж, наклонение, формально: im Hinblick auf, in Bezug auf, im Rahmen von.',
    EN: 'Check case, mood, formal: im Hinblick auf, in Bezug auf, im Rahmen von.',
  },
};

/**
 * Returns the hint for `topicKey` in the requested language, with fallback
 * to the German variant when the requested language is missing.
 *
 * Accepts any-cased keys and normalises them; also tries the base key with
 * the A1/A2/B1/B2 suffix removed (e.g. "AKKUSATIVA1" → "AKKUSATIV").
 *
 * @param {string} topicKey  The topic key (case-insensitive).
 * @param {string} lang      Two-letter language code: 'DE', 'RU', or 'EN'.
 * @return {?string} The localized hint text, or `null` when not found.
 */
export function getStaticHint(topicKey, lang) {
  if (!topicKey) return null;
  const upper = String(topicKey).toUpperCase();
  const base = upper.replace(/(A1|A2|B1|B2)$/, '');
  const hint = GRAMMAR_HINTS[upper] || GRAMMAR_HINTS[base];
  if (!hint) return null;
  return hint[lang] || hint.DE;
}
