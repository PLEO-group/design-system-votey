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
sourceStage: "{{SOURCE_STAGE}}"
generationApprovalStage: "{{APPROVAL_STAGE}}"
releaseCandidate: "{{RELEASE_CANDIDATE}}"
packageArtifact: "{{PACKAGE_ARTIFACT}}"
packageArtifactSha256: "{{PACKAGE_ARTIFACT_SHA256}}"
migrationInventory: "{{MIGRATION_INVENTORY}}"
createdAt: "{{CREATED_AT}}"
updatedAt: "{{UPDATED_AT}}"
---

# Plan migracji konsumenta design systemu

Status procesu wynika wyłącznie z pola `status` w nagłówku maszynowym. Utworzenie tego pliku zostało zaakceptowane w źródłowym planie DS; nie jest zgodą na wykonanie migracji aplikacji.

## Źródło migracji

| Pole | Wartość |
| --- | --- |
| Paczka DS | do ustalenia |
| Wersja obecna w aplikacji | do ustalenia |
| Release candidate | pole `releaseCandidate` z nagłówka |
| Artefakt `npm pack`/candidate | pole `packageArtifact` z nagłówka |
| Źródłowy plan DS | pole `sourceArtifact` z nagłówka |
| Ukończony etap stabilizacji | pole `sourceStage` z nagłówka |

## Stan konsumenta

{{DISCOVERY}}

## Macierz wpływu

| Obszar | Zmiana w DS | Użycie w konsumencie | Wpływ | Dowód |
| --- | --- | --- | --- | --- |
| Publiczne API/importy | do ustalenia | do ustalenia | `none/compatible/breaking` | — |
| Tokeny i theme | do ustalenia | do ustalenia | `none/compatible/breaking` | — |
| SVG i assety | do ustalenia | do ustalenia | `none/compatible/breaking` | — |
| Responsive/grid | do ustalenia | do ustalenia | `none/compatible/breaking` | — |
| Komponenty | do ustalenia | do ustalenia | `none/compatible/breaking` | — |

Jeżeli wpływ wynosi `none`, zachowaj plik jako dowód analizy i zaplanuj tylko walidację wersji release candidate. Nie wymyślaj zmian kodu.

## Etapy migracji

### Walidacja release candidate

<!-- work-stage {"id":"validate-release-candidate","status":"pending"} -->

- Zainstaluj wskazany artefakt `npm pack` albo równoważny candidate bez publikowania finalnego release’u.
- Uruchom walidator manifestu konsumenta, build/test i adekwatny runtime smoke.
- Status etapu wynika wyłącznie z markera `work-stage`.

### Migracja kodu aplikacji

<!-- work-stage {"id":"migrate-consumer","status":"pending"} -->

- Zakres plików i zmian: do ustalenia z macierzy wpływu.
- Kryteria akceptacji: do ustalenia.
- Każda mutacja wymaga osobnej akceptacji tego etapu.
- Dla wpływu `none` oznacz etap jako `skipped` po zapisaniu dowodu.

### Upgrade i rollout po publikacji

<!-- work-stage {"id":"upgrade-and-rollout","status":"pending"} -->

- Docelowa wersja i registry: do ustalenia.
- Kolejność wdrożenia: do ustalenia.
- Warunki monitorowania i rollbacku: do ustalenia.

## Rollback

| Etap | Sygnał wycofania | Poprzednia wersja/stan | Procedura | Weryfikacja |
| --- | --- | --- | --- | --- |

## Dowody

| Data | Etap | Komenda/źródło | Wynik |
| --- | --- | --- | --- |
