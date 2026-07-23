---
name: pleo-library-telemetry-lifecycle
description: Raportuje eventy cyklu życia dla realnie użytych skilli, których nazwa nie zaczyna się od `pleo-library-`. Używaj po target-only version preflight telemetryki i przed wykonaniem skilla docelowego spoza `pleo-library-*`; nie raportuj skilli `pleo-library-*`, version preflightu ani samej telemetryki.
version: 1.2.3
author: p.karas@pleodigital.com
scope: SHARED
category: Library
tags: []
---
# Pleo Library Telemetry Lifecycle

Używaj tego skilla jako wspólnego kontraktu telemetrycznego dla innych skilli.
Ten skill podlega target-only version preflight przez `pleo-library-skill-version-guard` przed pierwszym eventem telemetrycznym w rozmowie.
Raportuj wyłącznie skill docelowy spoza prefiksu `pleo-library-`.
Nie raportuj telemetrycznie skilli `pleo-library-*`, samego version preflightu ani użycia `pleo-library-telemetry-lifecycle`.

## Co raportować

- `start` na początku użycia skilla docelowego.
- `progress` przy realnej zmianie etapu pracy nad skillem docelowym.
- `finish` przy normalnym zakończeniu (`success` albo `error`).
- `interrupt` best effort przy przerwaniu kontrolowanym.
- Nie wysyłaj heartbeatów; aktywna sesja bez terminalnej wiadomości zostanie automatycznie uznana za przerwaną po 30 minutach bez nowych eventów.
- Jeśli w środowisku istnieje `TELEMETRY_USER_ID`, skrypt ma dołączać je do payloadu jako `telemetryUserId`.

## Zakres obowiązku

- Każdy realnie użyty skill spoza `pleo-library-*` raportuj osobno: `start`, `progress`, a potem `finish` albo `interrupt`.
- Nie raportuj skilli `pleo-library-*`, w tym `pleo-library-prompt-model-triage`, `pleo-library-shared-skill-sync`, `pleo-library-skill-version-guard` i `pleo-library-telemetry-lifecycle`.
- Nie raportuj `pleo-library-skill-version-guard`, gdy działa jako target-only version preflight.
- W telemetryce podawaj nazwę skilla docelowego w argumencie `--skill`, a nie nazwę `pleo-library-telemetry-lifecycle`.

## Skrypt

Skrypt: `skills/pleo-library-telemetry-lifecycle/scripts/run.py`

Konfiguracja:

- `libraryBaseUrl` z `.agent-library.yaml` (wymagane)
- `--source` (wymagane, np. `codex`, `claude`, `gemini`)
- `--skill` (wymagane, nazwa śledzonego skilla docelowego)
- `--project-slug` (opcjonalne, ale zalecane przy raportowaniu do heatmap per projekt)
- `--allow-pleo-library-skill` jest pozostawione tylko jako legacy flaga kompatybilności i nie odblokowuje raportowania skilli `pleo-library-*`
- `TELEMETRY_USER_ID` w env (opcjonalne; gdy ustawione, jest wysyłane jako `telemetryUserId`)

Uwaga: skrypt zawsze używa endpointu:
`/api/agent-telemetry/events`

Uwaga: kolejność flag i komendy jest elastyczna. Działają zarówno:
`python .../run.py --source codex start ...`
jak i
`python .../run.py start --source codex ...`

## Workflow agenta

1. Przed pierwszym eventem telemetrycznym w rozmowie upewnij się, że `pleo-library-telemetry-lifecycle` przeszedł target-only version preflight.
2. Jeśli skill docelowy zaczyna się od `pleo-library-`, nie uruchamiaj telemetryki.
3. Dla każdego skilla docelowego spoza `pleo-library-*` przygotuj osobny `runId`.
4. Wyślij `start` przed realnym rozpoczęciem pracy nad skillem docelowym.
5. Jeśli skill docelowy nie był jeszcze sprawdzony w tej rozmowie ani w dziennym cache version guarda, po `start` wykonaj target-only version preflight dla niego.
6. Przy realnej zmianie etapu wysyłaj `progress`. Nie wysyłaj sztucznych heartbeatów.
7. Na końcu wyślij `finish`.
8. Jeśli praca została przerwana w sposób kontrolowany, wyślij `interrupt` best effort.
9. Jeśli nie zostanie wysłana terminalna wiadomość, backend automatycznie uzna sesję za przerwaną po 30 minutach bez nowych eventów.

## Przykładowe wywołania

Start:

```bash
python skills/pleo-library-telemetry-lifecycle/scripts/run.py start --source codex --run-id run-123 --skill aidock-rag-indexing-pgvector --project-slug gocouriers/aidock
```

Progress:

```bash
python skills/pleo-library-telemetry-lifecycle/scripts/run.py --source codex progress --run-id run-123 --skill aidock-rag-indexing-pgvector --project-slug gocouriers/aidock --stage analysis --message "Collecting context"
```

Finish:

```bash
python skills/pleo-library-telemetry-lifecycle/scripts/run.py --source codex finish --run-id run-123 --skill aidock-rag-indexing-pgvector --project-slug gocouriers/aidock --status success
```

## Wymagany config repo

Plik `.agent-library.yaml` musi zawierać:

```yaml
libraryBaseUrl: https://pleoai-69566.ondigitalocean.app
projectSlug: edukurier-2.0/edukurier-frontend

paths:
  agents: AGENTS.md
  claude: CLAUDE.md
  gemini: GEMINI.md
  skillsDir: skills

publish:
  defaultScope: PROJECT
```

## Ważne reguły

- Nie raportuj skilli `pleo-library-*`.
- Nie raportuj version preflightu wykonywanego przez `pleo-library-skill-version-guard`.
- Nie używaj nazwy `pleo-library-telemetry-lifecycle` w `--skill`, jeśli telemetryka ma opisywać użycie innego skilla.
- Nie używaj komendy `heartbeat`; została usunięta. Nie wysyłaj też sztucznych heartbeatów przez `progress`.
- Nie zgaduj `telemetryUserId` z maila, git config ani loginu systemowego; używaj wyłącznie `TELEMETRY_USER_ID`, jeśli jest ustawione.
- Jeśli telemetryka nie może zostać wysłana, traktuj to jako best effort i jasno odnotuj brak pełnej weryfikacji w podsumowaniu.
