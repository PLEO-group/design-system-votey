---
artifactSchemaVersion: 1
runId: "{{RUN_ID}}"
mode: "{{WORK_MODE}}"
status: "draft"
targetKind: "{{TARGET_KIND}}"
targetId: "{{TARGET_ID}}"
repositoryRoot: "{{PROJECT_ROOT}}"
scopeRoot: "{{SCOPE_ROOT}}"
startCommit: "{{START_COMMIT}}"
sourceArtifact: "{{SOURCE_ARTIFACT}}"
createdAt: "{{CREATED_AT}}"
updatedAt: "{{UPDATED_AT}}"
---

# Plan wprowadzenia istniejącego design systemu do aplikacji

Status procesu wynika wyłącznie z pola `status` w nagłówku maszynowym.

Repozytorium/aplikacja: `{{PROJECT_ROOT}}`

Utworzono: `{{CREATED_AT}}`

## Bramka akceptacji

- [ ] Użytkownik zapoznał się z planem integracji.
- [ ] Użytkownik jawnie zaakceptował pierwszy etap integracji.

Nie modyfikuj aplikacji przed akceptacją właściwego etapu. Nie modyfikuj paczki DS, jej manifestu, skilla ani wpisu rejestru w tym trybie.

## Źródłowy design system

| Pole | Wartość |
| --- | --- |
| Paczka | do ustalenia |
| Wersja | do ustalenia |
| Registry | do ustalenia |
| Frameworkowy entry point | do ustalenia |
| Skill konkretnego DS | do ustalenia |
| Manifest DS | do ustalenia |

Brak poprawnego manifestu DS blokuje rozpoczęcie tego trybu. Nie twórz ani nie naprawiaj manifestu DS w planie introduction.

## Źródło procesu

- Źródłowy raport audytu konsumenta: pole `sourceArtifact` z nagłówka; `none` dla bezpośredniego introduction albo ścieżka do ukończonego raportu, gdy plan wynika z audytu.

## Aplikacja konsumująca — stan zastany

{{DISCOVERY}}

## Decyzje integracyjne

| Pytanie | Odpowiedź | Źródło/data |
| --- | --- | --- |
| Application root | do ustalenia | — |
| Framework | do ustalenia | — |
| Istniejący mini-DS | do ustalenia | — |
| Strategia migracji | do ustalenia | — |
| Theme | do ustalenia | — |
| Responsywność/grid | do ustalenia | — |

## Docelowy kontrakt konsumenta

- Manifest: `<application.root>/design-system-consumer.manifest.json`.
- Instalacja i wersja: do ustalenia.
- Publiczne importy: do ustalenia.
- Style/tokeny: do ustalenia.
- Asset copy i registry/provider: do ustalenia.
- Theme bootstrap: do ustalenia.
- Instrukcja integracji w skillu DS: do ustalenia.

## Konflikty ze stanem zastanym

| ID | Lokalny wzorzec/mini-DS | Konflikt z DS | Decyzja migracyjna |
| --- | --- | --- | --- |

## Plan zmian

### Etap 1 — do nazwania

<!-- work-stage {"id":"stage-1","status":"pending"} -->

- Pliki/obszar: do ustalenia.
- Zmiana: do ustalenia.
- Kryterium akceptacji: do ustalenia.
- Walidacja: do ustalenia.
- Status etapu wynika wyłącznie z markera `work-stage`.

## Walidacja integracji

- [ ] Walidator manifestu konsumenta przechodzi.
- [ ] Nie ma względnych ani prywatnych importów DS.
- [ ] Style, tokeny, theme i assety działają zgodnie z wersją paczki.
- [ ] Build/test aplikacji przechodzą.
- [ ] Runtime smoke test obejmuje theme, viewporty, konsolę i overflow.
- [ ] Nowy mini-DS nie powstał; baseline nie wzrósł, jeśli istnieje legacy; zatwierdzony `embedded-mini-ds` ma decyzję i uzasadnienie w manifeście.

## Rollout i wycofanie

- Sposób wdrożenia: do ustalenia.
- Kolejność migracji widoków: do ustalenia.
- Warunek wycofania: do ustalenia.
- Publikacja/upgrade paczki: wymaga osobnej zgody, jeśli dotyczy.

## Dowody wykonania

| Data | Kontrola | Wynik | Uwagi |
| --- | --- | --- | --- |
