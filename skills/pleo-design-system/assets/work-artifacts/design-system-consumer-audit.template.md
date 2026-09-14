---
artifactSchemaVersion: 1
runId: "{{RUN_ID}}"
mode: "{{WORK_MODE}}"
status: "in-progress"
targetKind: "{{TARGET_KIND}}"
targetId: "{{TARGET_ID}}"
repositoryRoot: "{{PROJECT_ROOT}}"
scopeRoot: "{{SCOPE_ROOT}}"
startCommit: "{{START_COMMIT}}"
sourceArtifact: "{{SOURCE_ARTIFACT}}"
createdAt: "{{CREATED_AT}}"
updatedAt: "{{UPDATED_AT}}"
---

# Raport audytu konsumenta design systemu

Status procesu wynika wyłącznie z pola `status` w nagłówku maszynowym.

Repozytorium/aplikacja: `{{PROJECT_ROOT}}`

Utworzono: `{{CREATED_AT}}`

Ten plik opisuje wyłącznie stan integracji aplikacji konsumującej z konkretną wersją paczki. Nie audytuje całej implementacji źródłowej design systemu i nie jest planem zmian.

## Zakres konsumenta

| Pole | Wartość |
| --- | --- |
| Application root | do ustalenia |
| Framework | do ustalenia |
| Paczka DS | do ustalenia |
| Zainstalowana wersja | do ustalenia |
| Projektowy skill DS | do ustalenia |
| Manifest konsumenta | brak / ścieżka |

## Stan zastany integracji

{{DISCOVERY}}

## Macierz integracji

| Obszar | Stan zastany i dowód | Oczekiwany kontrakt | Status |
| --- | --- | --- | --- |
| Instalacja i wersja | do ustalenia | manifest/paczka | `UNKNOWN` |
| Publiczne importy | do ustalenia | bez deep importów | `UNKNOWN` |
| Style i tokeny | do ustalenia | polityka frameworka | `UNKNOWN` |
| Theme bootstrap | do ustalenia | kontrakt projektowy | `UNKNOWN` |
| Assety i registry | do ustalenia | copy/provider/registry | `UNKNOWN` |
| Responsywność i grid | do ustalenia | jeden model z manifestu | `UNKNOWN` |
| Lokalne UI/mini-DS | do ustalenia | forbid albo baseline | `UNKNOWN` |
| Build/test/smoke | do ustalenia | komendy konsumenta | `UNKNOWN` |

## Elementy zgodne

- Oczekują na udokumentowanie.

## Rozbieżności

### BLOCK

| ID | Obszar | Dowód | Rozbieżność | Wpływ |
| --- | --- | --- | --- | --- |

### REVIEW_REQUIRED

| ID | Obszar | Dowód | Decyzja potrzebna |
| --- | --- | --- | --- |

### WARN

| ID | Obszar | Dowód | Konsekwencja |
| --- | --- | --- | --- |

## Podejrzenia mini-DS

| Ścieżka/pattern | Dowód | Klasyfikacja | Decyzja |
| --- | --- | --- | --- |

## Dowody walidacji

| Kontrola | Komenda/źródło | Wynik | Uwagi |
| --- | --- | --- | --- |

## Zakres wstrzymany przez brak dostępu

Brak dostępu nie jest findingiem i nie pozwala zamknąć audytu. Ustaw status `awaiting-input`, przerwij pracę, poproś o dostęp i kontynuuj ten sam `runId` po jego uzyskaniu.

| Obszar | Brakujący dostęp/dowód | Co jest potrzebne |
| --- | --- | --- |

## Rekomendowane kierunki

| Priorytet | Kierunek | Findingi | Oczekiwany rezultat |
| --- | --- | --- | --- |

## Konkluzja audytu konsumenta

- Ogólny stan integracji: do ustalenia.
- Następny krok: uzupełnić dowody albo — jeśli istnieje co najmniej jeden `BLOCK` — utworzyć osobny plan lub plany naprawcze według właściciela zmiany.
