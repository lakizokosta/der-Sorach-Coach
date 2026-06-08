# Trial test mode — патч для живого Apps Script

> **Временно.** После завершения тестов установите `TRIAL_TEST_MODE = false`.

## Зачем

Позволяет многократно запрашивать trial-коды с одного устройства, если email
содержит `+test` (например `lakizo.kosta+test@gmail.com`).

Обычные адреса по-прежнему: **один trial на пару (email, device)**.

## Куда вставить (ваш живой скрипт в Google)

1. Откройте [script.google.com](https://script.google.com) → ваш проект.
2. **Сделайте резервную копию** `Code.gs` (см. `docs/TECHNICAL-AUDIT.md`).
3. В начало файла (рядом с другими константами) добавьте:

```javascript
/** TEMPORARY — set false before production. */
const TRIAL_TEST_MODE = true;
```

4. Добавьте функцию (перед `requestTrial`):

```javascript
function isTrialTestBypassEmail_(email) {
  if (!TRIAL_TEST_MODE) return false;
  return String(email || '').toLowerCase().includes('+test');
}
```

5. В функции `requestTrial` оберните проверку Trial-таблицы:

```javascript
const testBypass = isTrialTestBypassEmail_(email);

if (!testBypass) {
  // … существующий цикл проверки email/device в Trial sheet …
}

// … генерация кода …

if (!testBypass) {
  // … существующий trialSheet.appendRow(…) …
}

return { ok: true, testMode: testBypass };
```

6. **Deploy → Управление развертываниями → ⚙ → Изменить → Новая версия → Развернуть**

## Как тестировать

1. Откройте https://lernziel-deutsch.de/premium
2. Введите email: `ваш+test@gmail.com` (Gmail доставляет на `ваш@gmail.com`)
3. Нажмите «Gratis-Code anfordern»
4. Повторяйте сколько нужно — блокировка по device не сработает

## Отключить после тестов

```javascript
const TRIAL_TEST_MODE = false;
```

→ Новая версия → Deploy.
