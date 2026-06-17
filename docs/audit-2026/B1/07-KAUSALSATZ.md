# KAUSALSATZ

**Файлов:** 150

## CRITICAL
| № | Item | Проблема | Фикс |
| --- | --- | --- | --- |
| C1 | dropbox #5 | `Da die Nachfrage steigt, werden Preise höher` — **нет артикля** | `werden die Preise höher` (но `die` уже в #5 → `assertUnique` fail; нужно `werden Preise zwangsläufig höher`) |
| C2 | dropbox #9 | `Weil das Wetter schlecht ist, fällt Fest aus` — **нет артикля** | `fällt unser Fest aus` (избежать дубля `das`) |
| C3 | dropbox #2 | `Weil er fleißig war, bestand seine Prüfung` — нет subject в главной части; `seine Prüfung bestand` (Prüfung как subject) — нелогично | `Weil er fleißig war, bestand er die Prüfung` (но `er` дублируется → `Weil sie fleißig war, bestand sie die Prüfung`) |
| C4 | dropbox #8 | `Er ist gestresst, denn zu viel Arbeit wartet` — после `denn` нужен V2 с явным subject | `denn er hat zu viel Arbeit` |
| C5 | dropbox #14 | `Er ist pünktlich, denn er hat den frühen Bus genommen` — **дубликат `er`** → `assertUnique` fail | `Er ist pünktlich, denn der frühe Bus war schnell` или другая переформулировка |

## MAJOR
— нет (после фиксов C1-C5).

## MINOR
| № | Item | Замечание |
| --- | --- | --- |
| m1 | select-one items 1-15 | Pool везде одинаковый `['denn/weil', 'deshalb', 'obwohl', 'dass']` — нет дифференциации по семантике |

## Дополнительно
Items методологически различают `weil` (Nebensatz), `denn` (Hauptsatz V2), `da` (formal). Это хорошо.
