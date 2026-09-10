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

# Raport audytu design systemu

Status procesu wynika wyłącznie z pola `status` w nagłówku maszynowym.

Repozytorium: `{{PROJECT_ROOT}}`

Utworzono: `{{CREATED_AT}}`

Ten plik opisuje stan zastany i rozbieżności ze standardami. Nie jest planem implementacji i nie stanowi zgody na zmianę kodu. Remediację rozpocznij dopiero w trybie `design-system-implementation` i zapisz ją w `.tmp/design-system-implementation.md`.

## Zakres audytu

| Pole | Wartość |
| --- | --- |
| Audytowany DS/paczka | do ustalenia |
| Package root | do ustalenia |
| Wersja/commit | do ustalenia |
| Frameworki | do ustalenia |
| Znani konsumenci | do ustalenia |
| Obszary poza zakresem | brak / do ustalenia |

## Stan zastany

{{DISCOVERY}}

## Zastosowane standardy

| Kontrakt/obszar | Wersja lub referencja | Dotyczy | Uwagi |
| --- | --- | --- | --- |
| Oczekuje na uzupełnienie | — | do ustalenia | — |

## Podsumowanie zgodności

| Klasyfikacja | Liczba | Znaczenie dla audytu |
| --- | ---: | --- |
| `BLOCK` | 0 | Deterministyczna rozbieżność ze standardem |
| `REVIEW_REQUIRED` | 0 | Wymaga decyzji człowieka i kontekstu projektowego |
| `WARN` | 0 | Nie blokuje zgodności, ale wymaga odnotowania |

## Elementy zgodne ze standardem

- Oczekują na udokumentowanie.

## Rozbieżności

### BLOCK

| ID | Standard | Stan zastany i dowód | Rozbieżność | Wpływ |
| --- | --- | --- | --- | --- |

### REVIEW_REQUIRED

| ID | Obszar | Stan zastany i dowód | Decyzja potrzebna | Wpływ |
| --- | --- | --- | --- | --- |

### WARN

| ID | Obszar | Dowód | Konsekwencja |
| --- | --- | --- | --- |

## Zakres wstrzymany przez brak dostępu

Brak dostępu nie jest findingiem i nie pozwala zamknąć audytu. Ustaw status `awaiting-input`, przerwij pracę, poproś o dostęp i kontynuuj ten sam `runId` po jego uzyskaniu.

| Obszar | Brakujący dostęp/dowód | Co jest potrzebne |
| --- | --- | --- |

## Dowody walidacji

| Kontrola | Komenda/źródło | Wynik | Uwagi |
| --- | --- | --- | --- |

## Rekomendowane kierunki remediacji

To jest kolejność rekomendacji, a nie zaakceptowany plan prac.

| Priorytet | Kierunek | Findingi | Oczekiwany rezultat |
| --- | --- | --- | --- |

## Decyzje potrzebne do zamknięcia audytu

1. Oczekują na uzupełnienie.

## Konkluzja audytu

- Ogólny stan: do ustalenia.
- Następny krok: uzupełnić dowody albo — jeśli istnieje co najmniej jeden `BLOCK` — utworzyć osobny plan remediacji w tym samym przebiegu.

## Historia raportu

| Data | Zmiana | Autor/źródło |
| --- | --- | --- |
| {{CREATED_AT}} | Utworzenie raportu | `pleo-design-system` |
