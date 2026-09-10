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

# Plan implementacji design systemu

Status procesu wynika wyłącznie z pola `status` w nagłówku maszynowym.

Repozytorium: `{{PROJECT_ROOT}}`

Utworzono: `{{CREATED_AT}}`

## Bramka akceptacji

- [ ] Użytkownik zapoznał się z planem.
- [ ] Użytkownik jawnie zaakceptował pierwszy etap implementacji.

Nie modyfikuj kodu produktu przed akceptacją właściwego etapu.

## Cel i źródło prac

- Oczekiwany rezultat: do ustalenia.
- Źródłowy raport audytu: pole `sourceArtifact` z nagłówka; `none` dla bezpośredniej implementacji albo ścieżka do ukończonego audytu DS/konsumenta dla remediacji.
- Zakres implementacji: do ustalenia.
- Zakres odłożony: do ustalenia.

## Fakty wykryte automatycznie

{{DISCOVERY}}

## Decyzje użytkownika

| Pytanie | Odpowiedź | Źródło/data |
| --- | --- | --- |

## Architektura docelowa

### Topologia i granica paczki

- Topologia: do ustalenia.
- Package root: do ustalenia.
- Konsumenci: do ustalenia.
- Dystrybucja i registry: do ustalenia.
- Polityka mini-DS: do ustalenia.

### Kontrakty i manifesty

- Manifest DS: do ustalenia.
- Manifesty konsumentów: do ustalenia.
- Frameworki i entry pointy: do ustalenia.
- Figma i źródło tokenów: do ustalenia.
- Artifact policy: do ustalenia.
- Skill konkretnego DS: do ustalenia.

## Plan zmian w plikach

| Plik/katalog | Operacja | Cel | Etap |
| --- | --- | --- | --- |

## Etapy implementacji

### Stabilizacja kontraktu paczki

<!-- work-stage {"id":"contract-stabilization","status":"pending"} -->

- Zakres: do ustalenia.
- Zależności: brak / do ustalenia.
- Ryzyka: do ustalenia.
- Kryteria akceptacji: do ustalenia.
- Walidacja: do ustalenia.
- Status etapu wynika wyłącznie z markera `work-stage`.

### Zgoda na wygenerowanie planów migracji konsumentów

<!-- work-stage {"id":"consumer-migration-plan-generation","status":"pending"} -->

- Uruchom dopiero po ukończeniu `contract-stabilization`, zbudowaniu paczki release candidate i analizie wpływu na wszystkich istniejących konsumentów.
- Przed przejściem do `approved` pokaż użytkownikowi listę konsumentów, wpływ, repozytoria docelowe i ścieżki plików migracyjnych.
- Zgoda pozwala wyłącznie utworzyć plany migracji; nie pozwala wdrażać zmian w aplikacjach.
- Status etapu wynika wyłącznie z markera `work-stage`.

## Guardraile

| Guardrail | Najpierw raportowy | Warunek włączenia blokera | Etap |
| --- | --- | --- | --- |

## Rollback i rollout

| Etap | Warunek przerwania | Procedura rollbacku | Sposób rolloutu | Weryfikacja po wdrożeniu |
| --- | --- | --- | --- | --- |

## Walidacja końcowa

- [ ] Manifest DS i jego wygenerowany typ są zgodne; manifesty konsumentów przechodzą walidację JSON Schema bez generowania lokalnych typów TypeScript.
- [ ] Tokeny, SVG i responsive config są deterministyczne, jeśli dotyczą zakresu.
- [ ] Build, testy, preview i pack przechodzą.
- [ ] Każdy konsument ma zweryfikowaną integrację.
- [ ] Skill konkretnego DS jest zgodny z manifestem.
- [ ] Publikacja uzyskała osobną zgodę.

## Ryzyka i wyjątki

| ID | Ryzyko/wyjątek | Właściciel decyzji | Mitigacja/status |
| --- | --- | --- | --- |

## Dowody wykonania

| Data | Etap | Kontrola | Wynik |
| --- | --- | --- | --- |
