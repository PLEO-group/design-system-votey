# Tryby pracy i artefakty `.tmp`

## Zasada rozdzielenia

Wybierz tryb przed utworzeniem pliku. Jeden artefakt ma jeden cel. Raport audytu opisuje fakty i luki; plan wykonawczy opisuje przyszłe zmiany i ich akceptację. Nie łącz obu dokumentów tylko dlatego, że audyt może później prowadzić do remediacji.

| Tryb | Plik | Cel | Mutacje produktu |
| --- | --- | --- | --- |
| `design-system-audit` | `.tmp/design-system-audit.md` | Stan całego DS, zgodność i rozbieżności | zabronione |
| `design-system-implementation` | `.tmp/design-system-implementation.md` | Utworzenie, przebudowa albo zaakceptowana remediacja DS | dopiero po akceptacji etapu |
| `design-system-consumer-audit` | `.tmp/design-system-consumer-audit.md` | Stan integracji konkretnego konsumenta | zabronione |
| `design-system-introduction` | `.tmp/design-system-introduction.md` | Podłączenie istniejącej paczki DS do aplikacji | dopiero po akceptacji etapu |
| `design-system-consumer-migration` | `.tmp/design-system-consumer-migration.md` | Migracja istniejącego konsumenta do release candidate powstałego w remediacji DS | dopiero po akceptacji etapów; samo utworzenie wymaga wcześniejszej zgody w planie DS |

Nie używaj nazwy `design-sysytem-introduction.md`; poprawna, kanoniczna nazwa to `design-system-introduction.md`.

## Tożsamość, własność i inicjalizacja

Każdy artefakt ma YAML frontmatter z obowiązkowymi polami: `artifactSchemaVersion`, `runId`, `mode`, `status`, `targetKind`, `targetId`, `repositoryRoot`, `scopeRoot`, `startCommit`, `sourceArtifact`, `createdAt`, `updatedAt`. Nie duplikuj statusu ani identyfikatorów w treści dokumentu.

- Artefakt dotyczący paczki należy do repo DS i używa `targetKind: design-system-package`.
- Artefakt dotyczący integracji albo migracji aplikacji należy do application root konsumenta i używa `targetKind: consumer-application`. Dzięki temu kilka aplikacji w jednym monorepo może równolegle posiadać własny plik `<application-root>/.tmp/<artifact>.md`.
- Gdy jeden proces wymaga zmian w obu repo, utwórz dwa plany w repo ich właścicieli, przekaż im ten sam `runId` i ustaw `sourceArtifact` na raport źródłowy. Nie twórz trzeciego master planu.
- `startCommit` identyfikuje stan początkowy; `scopeRoot` wskazuje package root albo application root.

```bash
node <skill-root>/scripts/initialize-work-artifact.mjs --project <owner-root> --mode <work-mode> --target-kind <design-system-package|consumer-application> --target-id <id> --scope-root <scope-root> --start-commit <commit> [--run-id <shared-run-id>] [--source-artifact <absolute-source-path>]
```

Stała nazwa oznacza bieżący proces danego trybu. Initializer:

1. kontynuuje aktywny plik tylko przy zgodnych `mode`, `targetKind`, `targetId` i `scopeRoot`;
2. zatrzymuje się, jeżeli plik należy do innego aktywnego procesu;
3. automatycznie przenosi terminalny plik do `.tmp/design-system-history/<timestamp>-<mode>-<runId>.md` przed utworzeniem nowego;
4. odmawia działania dla starego pliku bez nagłówka maszynowego, dopóki nie zostanie świadomie sklasyfikowany i zmigrowany;
5. wymaga przy kontynuacji jawnego, zgodnego `runId` i pierwotnego `startCommit`;
6. dla planu implementacji/introduction waliduje `sourceArtifact` tylko wtedy, gdy proces rzeczywiście pochodzi z audytu: plik musi istnieć, być ukończonym raportem audytowym i mieć ten sam `runId`;
7. nie obsługuje destrukcyjnego `--force`.

### Trzy kontrakty źródła planu

- Bezpośrednie utworzenie lub przebudowa DS bez poprzedzającego audytu: nie podawaj `--source-artifact`; plan ma `sourceArtifact: none` i własny nowy `runId`.
- Bezpośrednie introduction istniejącego DS: nie podawaj `--source-artifact`; prerequisite stanowi poprawny manifest DS, a plan ma własny nowy `runId`. Jeśli introduction powstaje z audytu konsumenta, podaj ukończony raport i jego `runId`.
- Remediacja po audycie DS lub konsumenta: `--source-artifact` i wspólny `--run-id` są obowiązkowe. Initializer odrzuca raport nieukończony, niewłaściwego typu albo z innym `runId`.

Dla `design-system-consumer-migration` źródłem nie jest raport, lecz plan `design-system-implementation` o tym samym `runId`. Initializer wymaga kanonicznych markerów `contract-stabilization`=`completed` oraz `consumer-migration-plan-generation`=`approved`, wersji SemVer release candidate, istniejącego lokalnego `.tgz`, jego SHA-256 i zgodnego inventory konsumentów.

## Statusy i przejścia

Aktualizuj status deterministycznie:

```bash
node <skill-root>/scripts/update-work-artifact-status.mjs --artifact <artifact-path> --status <next-status>
```

- Audyt: `in-progress → awaiting-input → in-progress`; z `in-progress` można zakończyć jako `completed`, `incomplete` albo `cancelled`.
- Plan: `draft → awaiting-approval → approved → in-progress → completed`; powrót `awaiting-approval → draft` służy korekcie, a `in-progress → awaiting-approval` kolejnej akceptacji etapu. `cancelled` kończy proces.
- Etap planu: `pending → awaiting-approval → approved → in-progress → completed | blocked | skipped`.

Każdy etap ma unikalny marker `<!-- work-stage {"id":"<stage-id>","status":"<status>"} -->`. Nie używaj checkboxa ani opisowego tekstu jako źródła statusu. Aktualizuj marker przez:

```bash
node <skill-root>/scripts/update-work-artifact-stage.mjs --artifact <artifact-path> --stage <stage-id> --status <next-status>
```

Skrypt dopuszcza zmianę etapu tylko wtedy, gdy cały plan ma status `in-progress`. Dla ukończenia `consumer-migration-plan-generation` wymagaj dodatkowo `--inventory <consumer-migration-inventory.json>`; updater uruchamia wtedy walidator kompletności przed zapisaniem statusu `completed`.

Cały plan wykonawczy może przejść na `completed` wyłącznie wtedy, gdy wszystkie jego markery etapów mają status `completed` albo `skipped`. Dla implementacji z ukończonym etapem generowania planów konsumentów przekaż także `--inventory`; dla planu migracji konsumenta updater pobiera inventory z frontmatter. W obu przypadkach status updater ponownie uruchamia walidator, więc nie można ominąć bramki przez ręczne zamknięcie planu.

Brak dostępu ustawia audyt na `awaiting-input`. Agent przerywa, prosi o dostęp i kontynuuje ten sam proces po jego uzyskaniu. Nie zamykaj wtedy raportu jako `completed` ani `incomplete`. `Incomplete` stosuj tylko wtedy, gdy użytkownik świadomie kończy niepełny audyt z przyczyny innej niż tymczasowo brakujący dostęp.

## Raport audytu DS

Pisz od stanu zastanego do wniosku:

1. zakres i identyfikacja audytowanego release/commitu;
2. fakty i dowody;
3. zastosowane kontrakty;
4. elementy zgodne;
5. rozbieżności `BLOCK`, `REVIEW_REQUIRED`, `WARN`;
6. ewentualny zakres wstrzymany przez brak dostępu, który uniemożliwia zamknięcie;
7. wyniki komend walidacyjnych;
8. rekomendowane kierunki, bez szczegółowej checklisty implementacji;
9. decyzje potrzebne do zamknięcia raportu;
10. konkluzja o stanie zgodności.

Finding musi wskazywać standard, dowód stanu zastanego, konkretną rozbieżność i wpływ. Nie nazywaj brakiem czegoś, czego dany manifest/tryb nie wymaga.

## Plan implementacji DS

Pisz od celu do wykonania:

1. cel i źródło prac, w tym link do raportu audytu, jeżeli istnieje;
2. decyzje użytkownika i architektura docelowa;
3. projekt kontraktów i manifestów;
4. dokładne pliki i operacje;
5. osobno akceptowane etapy;
6. kryteria akceptacji, walidacja, ryzyka, rollback i rollout;
7. dowody wykonania.

Nie kopiuj wszystkich findingów z raportu. Linkuj raport i mapuj tylko findingi objęte zaakceptowanym zakresem.

## Raport audytu konsumenta

Ogranicz zakres do jednej aplikacji i zainstalowanej wersji DS. Sprawdź instalację, publiczne importy, tokeny/style, theme bootstrap, assety/registry, responsive/grid, lokalne mini-DS, manifest, build/test i runtime smoke. Nie oceniaj źródeł paczki, chyba że finding konsumenta wymaga potwierdzenia publicznego API.

## Plan wprowadzenia istniejącego DS

Rozpocznij ten tryb wyłącznie wtedy, gdy źródłowa paczka ma poprawny manifest DS w kanonicznej lokalizacji. Opisz jego read-only kontrakt i docelową integrację konsumenta: instalację, entry point, style/tokeny, asset copy, registry/provider, theme bootstrap, responsive/grid, manifest konsumenta, konflikt z lokalnym mini-DS, rollback, rollout i smoke test. Nie twórz ani nie naprawiaj manifestu DS i nie modyfikuj repo paczki w tym trybie.

## Plan migracji istniejącego konsumenta

Jest pochodnym planem wykonywanym w application root konsumenta. Powstaje po stabilizacji kontraktu paczki, zbudowaniu release candidate, analizie wpływu i osobnej zgodzie użytkownika, lecz przed publikacją finalnego release’u. Twórz jeden plik per istniejący konsument, również gdy wpływ wynosi `none`; taki plik dokumentuje analizę i walidację candidate. Szczegółowy workflow: `consumer-migration-after-remediation.md`.

## Przejścia między trybami

- `design-system-audit` → `design-system-implementation`: obowiązkowo utwórz draft planu, gdy raport zawiera co najmniej jeden `BLOCK`; plan linkuje raport, ale nie upoważnia do zmian.
- `design-system-consumer-audit` → `design-system-introduction`: dla każdego `BLOCK`, którego właścicielem jest aplikacja.
- `design-system-consumer-audit` → `design-system-implementation`: dla każdego `BLOCK`, którego właścicielem jest źródłowy DS.
- `design-system-consumer-audit` → oba plany: gdy blokery dotyczą obu repo; użyj wspólnego `runId`, osobnych owner roots i linku do raportu.
- `design-system-introduction` → `design-system-implementation`: tylko gdy integracja ujawni konieczność rozszerzenia paczki; wymaga rozszerzenia zakresu.

Zachowaj oba pliki po przejściu. Nie przepisuj raportu na plan i nie zmieniaj historycznego wyniku audytu na checklistę.
