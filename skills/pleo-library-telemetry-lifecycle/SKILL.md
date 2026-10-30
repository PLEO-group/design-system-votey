---
name: pleo-library-telemetry-lifecycle
description: Raportuje eventy cyklu życia dla realnie użytych skilli, których nazwa nie zaczyna się od `pleo-library-`. Używaj po target-only version preflight telemetryki i przed wykonaniem skilla docelowego spoza `pleo-library-*`; nie raportuj skilli `pleo-library-*`, version preflightu ani samej telemetryki.
version: 1.3.1
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
- `progress` tylko przy realnej zmianie etapu pracy nad skillem docelowym; w krótkim zadaniu bez takiej zmiany pomiń ten event.
- `finish` przy zakończeniu pracy z jawnym `--status success` tylko wtedy, gdy cel skilla został osiągnięty, albo `--status error`, gdy wykonanie lub wymagany wynik się nie powiódł.
- `interrupt` best effort przy przerwaniu pracy przed ustaleniem wyniku; domyślny status to `cancelled`.
- Nie wysyłaj heartbeatów; aktywna sesja bez terminalnej wiadomości zostanie automatycznie uznana za przerwaną po 30 minutach bez nowych eventów.
- Wysyłka wymaga niepustego `TELEMETRY_USER_ID`; skrypt dołącza je jako `telemetryUserId` i `libraryUserId`.
- Wywołania narzędzi MCP PleoAI są rejestrowane automatycznie przez backend, bez osobnej flagi. Fractools rejestruje także własne narzędzia MCP w wybranym kontekście organizacji. Nie wysyłaj dla narzędzi dodatkowych eventów lifecycle ani nie przedstawiaj nazwy narzędzia jako nazwy skilla. Ten skrypt raportuje użycie skilli.

## Zakres obowiązku

- Każdy realnie użyty skill spoza `pleo-library-*` raportuj osobno: `start`, opcjonalne `progress` wyłącznie przy zmianie etapu, a potem `finish` albo `interrupt`.
- Nie raportuj skilli `pleo-library-*`, w tym `pleo-library-prompt-model-triage`, `pleo-library-shared-skill-sync`, `pleo-library-skill-version-guard` i `pleo-library-telemetry-lifecycle`.
- Nie raportuj `pleo-library-skill-version-guard`, gdy działa jako target-only version preflight.
- W telemetryce podawaj nazwę skilla docelowego w argumencie `--skill`, a nie nazwę `pleo-library-telemetry-lifecycle`.

## Skrypt

Skrypt: `skills/pleo-library-telemetry-lifecycle/scripts/run.py`

Konfiguracja:

- `libraryBaseUrl` z `.agent-library.yaml` (wymagane)
- `--source` (wymagane, np. `codex`, `claude`, `gemini`)
- `--skill` (wymagane, nazwa śledzonego skilla docelowego)
- `--run-id` (wymagane; jeden unikalny UUID dla pojedynczego użycia skilla, ten sam we wszystkich jego eventach)
- `--project-slug` (opcjonalne; jawna flaga ma pierwszeństwo przed `projectSlug` z `.agent-library.yaml`; slug umożliwia heatmapy per projekt)
- `details.skillVersion` jest dołączana automatycznie z frontmatter lokalnego `SKILL.md` skilla docelowego, jeśli ten plik jest dostępny; nie zgaduj wersji. Skrypt zastępuje podaną ręcznie `details.skillVersion` rzeczywistą wersją albo pomija ją, gdy nie może jej ustalić.
- `--allow-pleo-library-skill` jest pozostawione tylko jako legacy flaga kompatybilności i nie odblokowuje raportowania skilli `pleo-library-*`
- `TELEMETRY_USER_ID` w env (wymagane do wysyłki; skrypt bez niego kończy się błędem przed wywołaniem API)
- `--dry-run` (waliduje i wyświetla payload bez połączenia z API oraz bez wymagania `TELEMETRY_USER_ID`; pola `libraryUserId`, `telemetryUserId` i `userId` są redagowane również w zagnieżdżonych `details`). Nie umieszczaj danych osobowych ani sekretów w `message` i pozostałych polach `details`; skrypt nie wykrywa dowolnego wrażliwego tekstu.
- Domyślne ponowienia: `--retries 2`, `--timeout-seconds 10`, `--retry-delay-seconds 1`. Limity to odpowiednio `0..3`, `(0..30]` i `0..5`, bez wartości NaN/Infinity. Ponawiane są przejściowe błędy sieciowe i HTTP `408`, `429`, `500`, `502`, `503`, `504`; trwałe błędy HTTP i błędy weryfikacji TLS kończą próbę od razu. Komunikat błędu nie wypisuje odpowiedzi serwera, URL ani treści wyjątku sieciowego.

Uwaga: skrypt zawsze używa endpointu:
`/api/agent-telemetry/events`

Uwaga: kolejność flag i komendy jest elastyczna. Działają zarówno:
`python .../run.py --source codex start ...`
jak i
`python .../run.py start --source codex ...`

## Workflow agenta

1. Jeśli skill docelowy zaczyna się od `pleo-library-`, nie uruchamiaj telemetryki.
2. Przed version preflightem telemetryki i przed wywołaniem skryptu sprawdź, czy `TELEMETRY_USER_ID` jest ustawione i niepuste. Nie wypisuj jego wartości. Jeśli go brakuje, pomiń całą wysyłkę jako best effort (również `start`, `progress`, `finish` i `interrupt`), kontynuuj pracę nad skillem docelowym i odnotuj brak telemetryki w podsumowaniu; nie ponawiaj wywołań skryptu bez zmiany środowiska.
3. Jeśli identyfikator jest dostępny, przed pierwszym eventem telemetrycznym w rozmowie wykonaj target-only version preflight `pleo-library-telemetry-lifecycle`. Gdy ten preflight się nie powiedzie, pomiń wszystkie eventy telemetryczne dla bieżącego użycia skilla, kontynuuj pracę nad skillem docelowym i odnotuj pominięcie oraz przyczynę w podsumowaniu. Nie ponawiaj eventów, dopóki przyczyna nie zostanie usunięta.
4. Tylko przy dostępnej telemetryce przygotuj osobny `runId` UUID dla każdego użycia skilla docelowego spoza `pleo-library-*`, np. `python -c "import uuid; print(uuid.uuid4())"`. Zachowaj go dla `start`, `progress`, `finish` lub `interrupt`; nowe użycie tego samego skilla otrzymuje nowy UUID. Nie używaj stałych identyfikatorów typu `run-123` poza przykładami.
5. Przy dostępnej telemetryce wyślij `start` przed realnym rozpoczęciem pracy nad skillem docelowym.
6. Jeśli skill docelowy nie był jeszcze sprawdzony w tej rozmowie ani w dziennym cache version guarda, wykonaj jego target-only version preflight niezależnie od stanu telemetryki: po `start`, jeśli został wysłany, albo bez niego, gdy telemetryka została pominięta.
7. Przy dostępnej telemetryce i realnej zmianie etapu wysyłaj `progress`. Jeśli etap się nie zmienił, przejdź bezpośrednio od `start` do `finish` albo `interrupt`; nie wysyłaj sztucznych heartbeatów.
8. Przy dostępnej telemetryce na końcu wyślij `finish` z jawnym statusem: `success` po osiągnięciu celu, `error` po nieudanym wykonaniu skilla lub nieosiągnięciu wymaganego wyniku. Skrypt odrzuca `finish` bez `--status`; nie zakładaj powodzenia na podstawie samego zakończenia pracy.
9. Jeśli praca została przerwana w sposób kontrolowany przed wynikiem, przy dostępnej telemetryce wyślij `interrupt` best effort zamiast `finish`.
10. Jeśli nie zostanie wysłana terminalna wiadomość, backend automatycznie uzna sesję za przerwaną po 30 minutach bez nowych eventów.

### Nieudana wysyłka eventu

Jeżeli wysłanie dowolnego eventu zakończy się błędem po wyczerpaniu dozwolonych ponowień (albo od razu dla błędu nieponawialnego), kontynuuj pracę nad skillem docelowym. Dla tego `runId` pomiń wszystkie pozostałe eventy, w tym `progress`, `finish` i `interrupt`; nie wykonuj dodatkowej próby terminalnej ani nie twórz zastępczego `runId`. Dotyczy to również sytuacji, gdy nie wiadomo, czy backend przyjął event przed zerwaniem odpowiedzi. W podsumowaniu odnotuj niepełną telemetrię i typ błędu bez danych osobowych ani sekretów. Błąd telemetryki nie zmienia wyniku pracy nad skillem docelowym.

Kolejne rzeczywiste użycie skilla otrzymuje nowy `runId` i może rozpocząć własną ograniczoną próbę wysyłki po sprawdzeniu wymaganej konfiguracji. Nie odtwarzaj automatycznie pominiętych eventów wcześniejszego użycia.

Ponowienia w obrębie jednego wywołania skryptu zachowują ten sam payload i `createdAt`, aby backend mógł rozpoznać duplikat. Po ich wyczerpaniu nie uruchamiaj kolejnego procesu w celu automatycznego ponowienia. Jeśli operator zleci diagnostyczne odtworzenie tej samej wiadomości po niepewnym wyniku, zachowaj jej oryginalne `--created-at` i pozostałe pola. Nie wysyłaj nowego `start` z nowym czasem jako substytutu ponowienia.

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

Finish po nieudanym wykonaniu skilla:

```bash
python skills/pleo-library-telemetry-lifecycle/scripts/run.py finish --source codex --run-id run-123 --skill aidock-rag-indexing-pgvector --project-slug gocouriers/aidock --status error
```

## Wymagany config repo

Skrypt odczytuje z `.agent-library.yaml` `libraryBaseUrl` oraz opcjonalny `projectSlug`:

```yaml
libraryBaseUrl: https://pleoai-69566.ondigitalocean.app
projectSlug: pleodigital/pleoai-be
```

Inne pola konfiguracji repo mogą być potrzebne pozostałym skillom, ale skrypt telemetryki ich nie odczytuje. Użyj jawnego `--project-slug`, gdy event dotyczy innego projektu niż domyślny.

## Weryfikacja offline

```bash
python -B -m unittest discover -s skills/pleo-library-telemetry-lifecycle/tests -v
python skills/pleo-library-telemetry-lifecycle/scripts/run.py start --source codex --run-id 04bc65a4-b01d-4d52-9f28-cf480451b305 --skill java-code-standards --dry-run
```

Testy i `--dry-run` nie wysyłają zdarzeń. Sprawdzają zachowanie klienta; nie potwierdzają dostępności API, uwierzytelnienia ani kompletności danych organizacji. Lifecycle skilla pozostaje raportowaniem best effort zależnym od wykonania instrukcji przez agenta.

## Ważne reguły

- Nie raportuj skilli `pleo-library-*`.
- Nie raportuj version preflightu wykonywanego przez `pleo-library-skill-version-guard`.
- Nie używaj nazwy `pleo-library-telemetry-lifecycle` w `--skill`, jeśli telemetryka ma opisywać użycie innego skilla.
- Nie używaj komendy `heartbeat`; została usunięta. Nie wysyłaj też sztucznych heartbeatów przez `progress`.
- Nie zgaduj `telemetryUserId` z maila, git config ani loginu systemowego; używaj wyłącznie niepustego `TELEMETRY_USER_ID`.
- Jeśli telemetryka nie może zostać wysłana, traktuj to jako best effort i jasno odnotuj brak pełnej weryfikacji w podsumowaniu.
