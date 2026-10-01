# Schreiben (free-write) — отложено

Черновики формата и промптов **сохранены**, UI в приложении пока **выключен**.

## Что остаётся в docs
- Шаблон: `docs/question-templates/free-write.md`
- Примеры: `docs/new-questions/SCHREIBEN/A2/BEIM_ARZT/`
- Идея: свободное письмо в контексте темы + `pflicht` (обязательные слова)

## Корректура (на потом, не в MVP)
После Pflicht-check планировалось добавить проверку **грамматики и опечаток**
(например LanguageTool через Worker), плюс Musterlösung для самосравнения.
LLM — опциональный следующий шаг.

## Когда вернём в продукт
1. Снова вкладка Schreiben в TrainingHubPanel  
2. Банк в `src/questions-schreiben/`  
3. Сессия `/schreiben` + 1 free-проба / Premium  
4. Затем слой корректуры
