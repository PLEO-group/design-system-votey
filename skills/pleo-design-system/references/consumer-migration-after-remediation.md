# Migracja istniejących konsumentów po remediacji DS

## Moment generacji

Generuj plany migracji po ukończeniu i zweryfikowaniu etapu stabilizacji kontraktu paczki, ale przed publikacją finalnego release’u. Wymagaj zbudowanego artefaktu release candidate (`npm pack` albo odpowiednik), aby konsument mógł zweryfikować realną paczkę, a nie deklarowany plan.

## Obowiązkowy przebieg

1. Zbuduj kompletny inventory istniejących konsumentów z `repository.consumerRoots`, manifestów konsumentów, projektowego `references/consumers.md` i dostępnego rejestru użyć paczki. Zapisz uzgodniony wynik w kanonicznym `<package-root>/design-system-consumers.json`, używając `assets/manifests/design-system-consumers.example.json`. Rejestr przechowuje przenośny `repositoryId` i względny `applicationRoot`, nigdy lokalną ścieżkę z komputera dewelopera. Potwierdź z użytkownikiem stabilne ID i repository IDs; ten rejestr jest maszynowym snapshotem zaakceptowanej kompletnej listy. Jeśli nie da się potwierdzić kompletności, zatrzymaj etap i poproś o brakujące dane/dostęp.
2. Zakończ w planie DS etap `contract-stabilization`.
3. Zbuduj, przetestuj i spakuj release candidate do lokalnego pliku `.tgz`; zapisz jego SHA-256 w inventory.
4. Sporządź macierz wpływu per konsument: API/importy, tokeny/theme, SVG, responsive/grid i komponenty.
5. Pokaż użytkownikowi listę wszystkich plików, które mają powstać, ich repozytoria, wpływ i release candidate.
6. Uzyskaj osobną zgodę i ustaw etap `consumer-migration-plan-generation` na `approved`.
7. W application root każdego istniejącego konsumenta utwórz `.tmp/design-system-consumer-migration.md` ze wspólnym `runId`. Dzięki lokalizacji pod application root wiele aplikacji w jednym monorepo ma niezależne aktywne plany. Nawet wpływ `none` wymaga pliku z dowodem analizy i walidacją candidate.
8. Po utworzeniu wszystkich plików oznacz etap generacji jako `in-progress`, a następnie uruchom `update-work-artifact-stage.mjs ... --status completed --inventory <inventory.json>`. Updater zapisze `completed` tylko wtedy, gdy inventory zawiera dokładnie ten sam zbiór ID, `repositoryId` i application roots co kanoniczny rejestr oraz przejdą pozostałe walidacje. `repositoryRoot` występuje wyłącznie w tymczasowym inventory jako lokalna ścieżka rozwiązana dla bieżącego uruchomienia. Brak dostępu do któregokolwiek repo zatrzymuje etap i publikację.
9. Nie wykonuj migracji aplikacji bez osobnych akceptacji etapów w jej planie.

Initializer waliduje źródłowy plan, wspólny `runId`, ukończony etap stabilizacji i zaakceptowany etap generacji:

```bash
node <skill-root>/scripts/initialize-work-artifact.mjs --project <consumer-repository-root> --mode design-system-consumer-migration --target-kind consumer-application --target-id <application-id> --scope-root <application-root> --start-commit <consumer-commit> --run-id <implementation-run-id> --source-artifact <design-system-implementation.md> --source-stage contract-stabilization --approval-stage consumer-migration-plan-generation --release-candidate <semver-candidate> --package-artifact <local-tarball.tgz> --inventory <consumer-migration-inventory.json>
```

## Bramka release

Przed publikacją uruchom `node <skill-root>/scripts/validate-consumer-migration-plans.mjs --inventory <consumer-migration-inventory.json>`. Nie publikuj finalnej paczki, dopóki walidator nie potwierdzi dokładnej zgodności inventory z `design-system-consumers.json`, istniejącym `.tgz`, checksumą, planem każdego konsumenta i ukończonym etapem `consumer-migration-plan-generation`. Wykonanie migracji może korzystać z candidate przed publikacją oraz z docelowej wersji po publikacji; szczegółowa kolejność rolloutów pozostaje decyzją release’ową.
