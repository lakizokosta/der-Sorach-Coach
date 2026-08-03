# Системный анализ Der SprachCoach

**Дата:** 2026-08-01  
**Объект:** репозиторий `der-Sorach-Coach` (Vue 3 SPA + Cloudflare Worker + Google Apps Script)  
**Продакшен:** https://lernziel-deutsch.de  
**Методология:** статический аудит кодовой базы, конфигурации деплоя и CI/CD без нагрузочного тестирования

---

## Содержание

| Документ | Описание |
| -------- | -------- |
| [00-executive-summary.md](./00-executive-summary.md) | Краткие выводы, матрица рисков, приоритеты |
| [01-architecture.md](./01-architecture.md) | Архитектура, потоки данных, точки отказа |
| [02-security.md](./02-security.md) | Аудит безопасности |
| [03-performance-scalability.md](./03-performance-scalability.md) | Узкие места и масштабируемость |
| [04-resilience.md](./04-resilience.md) | Отказоустойчивость и деградация сервиса |
| [05-remediation-plan.md](./05-remediation-plan.md) | План исправлений по фазам |
| [06-backend-outage-investigation.md](./06-backend-outage-investigation.md) | **Периодические отвалы GAS — root cause analysis** |

---

## Контекст проекта

Der SprachCoach — тренажёр немецкого языка (CEFR A1–B2):

- **~11 000** грамматических вопросов (Markdown → Vite chunks)
- **~180** vocab-вопросов (растёт)
- **Freemium:** бесплатный режим (10 мин/день) + Premium/Basis через Stripe/PayPal
- **Backend:** Google Apps Script + Google Sheets (единственное хранилище)
- **Premium API:** Cloudflare Worker с JWT-авторизацией

## Общая оценка зрелости

| Область | Оценка | Комментарий |
| ------- | ------ | ----------- |
| Безопасность | ⚠️ Средняя | Секреты в git, GAS публично доступен, grace period на клиенте |
| Масштабируемость | ⚠️ Ограничена | GAS/Sheets — потолок ~сотни активных пользователей |
| Отказоустойчивость | ✅ Частичная | Grace 72h, retries, health check; SPOF — GAS |
| Производительность | ⚠️ Растущий риск | dist ~52 MB, 11k JS-чанков |
| DevOps / CI | ⚠️ Минимальный | Только hourly health check, нет deploy CI |

## Связанные документы

- [apps-script/README.md](../../apps-script/README.md) — деплой бэкенда
- [docs/audit-2026/](../audit-2026/) — QA аудит вопросов
