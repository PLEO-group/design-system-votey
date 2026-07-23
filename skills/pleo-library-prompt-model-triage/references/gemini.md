# Gemini / Google AI — Provider Reference

- `doc_date`: `2026-07-22`
- `stale_after_days`: `14`
- `source_scope`: oficjalne dokumenty Google AI

Czytaj ten plik, gdy użytkownik korzysta z Gemini API, Google AI Studio, Vertex AI, JetBrains AI Chat albo innego runtime z modelami Google.

## Aktualny Katalog Do Routingu

- `gemini-3.6-flash` — status `GA`; najnowszy model Flash, balans szybkości i inteligencji dla agentowych, codingowych i multimodalnych zadań.
- `gemini-3.5-flash-lite` — status `GA`; najtańszy model do high-volume, ekstrakcji, klasyfikacji i subagentów.
- `gemini-3.1-pro-preview` — status `preview`; najmocniejsza aktualnie linia Pro do software engineering i precyzyjnego tool use.

`gemini-3.5-flash` pozostaje stabilnym modelem, lecz Google rekomenduje migrację do tańszego wyjściowo `gemini-3.6-flash`. `gemini-3-pro-preview` został wyłączony; nie rekomenduj go.

## Ważne Reguły

- Nie rekomenduj modelu ani thinking level, którego nie pokazuje runtime użytkownika.
- Dla produkcji domyślnie preferuj GA `gemini-3.6-flash`; wybór Pro Preview wymaga akceptacji ryzyka preview albo jawnej dostępności w runtime.
- Gemini 3.x używa `thinkingLevel` / `thinking_level`; nie mieszaj go z legacy `thinkingBudget` z Gemini 2.5.
- Dla abonamentu Gemini, AI Studio albo IDE nie przedstawiaj stawek API jako bezpośredniego kosztu sesji.

## Rozsądny Ladder

- `cheap`
  - `gemini-3.5-flash-lite` + `minimal` lub `low`
- `balanced`
  - `gemini-3.6-flash` + `medium`
- `deep`
  - `gemini-3.6-flash` + `high` dla stabilnego workloadu
  - `gemini-3.1-pro-preview` + `high`, gdy preview jest akceptowalne i capability Pro jest potrzebna
- `max`
  - `gemini-3.1-pro-preview` + `high`; Gemini nie dokumentuje poziomu ponad `high`
  - jeśli preview jest niedopuszczalne, `gemini-3.6-flash` + `high`

## Thinking Levels

### Gemini 3.6 Flash

Aktualny migration guide dokumentuje `medium` (default) i `high`. Nie zakładaj `minimal` ani `low`, jeśli runtime lub dokładna strona modelu ich nie pokazuje.

### Gemini 3.5 Flash-Lite

Obsługuje `minimal`, `low`, `medium` i `high`; default to `minimal`.

- `minimal` — routing, ekstrakcja, klasyfikacja i maksymalny throughput.
- `low` — proste tool use z małym kosztem.
- `medium` — standardowe subtaski agentowe.
- `high` — wieloetapowe subtaski i trudniejsze reasoning.

### Gemini 3.1 Pro Preview

Obsługuje `low`, `medium` i `high`; default to dynamiczne `high`. `minimal` nie jest wspierane i thinking nie da się całkowicie wyłączyć.

## Publiczne Stawki API

| Model                         | Input $/1M tok. | Output $/1M tok. | Reasoning w kosztorysie |
| ----------------------------- | --------------- | ---------------- | ----------------------- |
| gemini-3.6-flash              | $1.50           | $7.50            | zawarte w output        |
| gemini-3.5-flash-lite         | $0.30           | $2.50            | zawarte w output        |
| gemini-3.1-pro-preview <=200k | $2.00           | $12.00           | zawarte w output        |
| gemini-3.1-pro-preview >200k  | $4.00           | $18.00           | zawarte w output        |

Google podaje output price łącznie z thinking tokens. Przy estymacji nie dodawaj drugi raz pełnego outputu. Ceny dotyczą standardowego paid tier; Batch/Flex/Priority mają inne stawki.

## Szybkie Reguły

- Rewrite, routing, klasyfikacja: `gemini-3.5-flash-lite` + `minimal`.
- Typowy coding task: `gemini-3.6-flash` + `medium`.
- Trudny debugging i agentic workflow: `gemini-3.6-flash` + `high`.
- Najtrudniejsze software engineering: `gemini-3.1-pro-preview` + `high`, tylko gdy preview jest akceptowalne.
- Gdy runtime używa starej linii 2.5, załaduj aktualne docs i stosuj `thinkingBudget`, nie `thinkingLevel`.

## Źródła

- https://ai.google.dev/gemini-api/docs/latest-model
- https://ai.google.dev/gemini-api/docs/models
- https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview
- https://ai.google.dev/gemini-api/docs/generate-content/thinking
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/deprecations
