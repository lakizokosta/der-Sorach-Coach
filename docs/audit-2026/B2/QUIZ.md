# QUIZ (B2)

**Файлов:** 50 (`b2-quiz-001..050.md`).
**Bank:** `genQuiz()` (`b2-select-one-data.mjs:470–482`).

## CRITICAL
— нет.

## MAJOR
— нет.

## MINOR
- **m5** — `genQuiz()` ре-использует первые 8/10 items из `genKonjunktiv2B2`, `genPassivB2`, `genRelativsatzB2`, `genFuturI`, `genKonjunktionaladverbien`, `genIndirekteRede` — без указания источника. Пользователь, проходя другие темы, **встретит те же items**. Это снижает учебную ценность Quiz.

  Возможные решения:
  - Сделать `genQuiz()` независимым банком (свои 17–30 items, смешанная грамматика).
  - Или в hint добавить пометку «(aus Thema X)».
  - Или take **последние** 8 items из других тем (если они там идут в конец, перекрытие меньше).

## Рекомендация
Опционально — независимый QUIZ-bank. Пока не блокер.
