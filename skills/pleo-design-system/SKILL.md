---
name: pleo-design-system
description: 'Orkiestruje audyt całego design systemu, implementację lub remediację DS, audyt integracji konsumenta oraz wprowadzenie istniejącej paczki do aplikacji; udostępnia też wersjonowane standardy skillom konkretnych DS. Uruchamiaj wyłącznie, gdy użytkownik jawnie prosi o taką pracę nad design systemem, jawnie wymienia pleo-design-system z nazwy albo aktywny skill konkretnego DS bezpośrednio kieruje po dokładny kontrakt firmowy. Nie jest domyślnym właścicielem bieżącego utrzymania ani pojedynczych zmian implementacyjnych.'
version: 1.2.1
author: n.koktysz@pleodigital.com
scope: SHARED
category: Frontend
tags:
  - design-system
  - frontend
  - angular
  - react
---

# Pleo Design System

Prowadź proces od discovery do zweryfikowanego wdrożenia. Wszystkie obowiązujące reguły i wzorce muszą być dostępne w tym skillu bez zależności od repozytoriów wzorcowych.

Historię zmian wczytuj tylko na żądanie z `references/history.md`.

## Bramka uruchomienia

Przed discovery potwierdź co najmniej jedną bramkę:

1. Użytkownik jawnie prosi o wprowadzenie, utworzenie, migrację albo audyt design systemu jako systemu w projekcie.
2. Użytkownik jawnie podaje nazwę `pleo-design-system` albo `$pleo-design-system`.
3. Aktywny skill konkretnego DS zawiera bezpośredni routing do `pleo-design-system` dla brakującego standardu lub procesu globalnego.

Jeśli żadna bramka nie jest spełniona, natychmiast zakończ użycie tego skilla. Nie uruchamiaj discovery, nie twórz artefaktu w `.tmp` i nie projektuj manifestów. Kontynuuj według instrukcji projektu albo skilla konkretnego DS.

Nie uznawaj za spełnienie bramki rutynowego polecenia, takiego jak dodanie lub zmiana ikony, ilustracji, tokenu, komponentu, stylu, story, testu lub eksportu. Sam fakt, że repo korzysta z DS albo zadanie dotyka jego plików, nie uruchamia globalnego orkiestratora.

## Wybór trybu po przejściu bramki

Wybierz dokładnie jeden tryb przed wykonaniem jakiejkolwiek akcji:

### `orchestrator`

Użyj dla wdrożenia, utworzenia, wydzielenia, migracji topologii, dodania frameworka, audytu całego DS albo audytu integracji konsumenta. Wykonaj pełny workflow poniżej, wybierz jeden tryb pracy i utwórz odpowiadający mu artefakt `.tmp` zgodnie z `references/work-artifacts.md`.

### `contract-reference`

Użyj tylko wtedy, gdy skill konkretnego DS kieruje po dokładny kontrakt firmowy albo użytkownik jawnie pyta o taki standard w ramach wąskiego zadania. Routing ze skilla projektowego musi podać:

- identyfikator i wersję, np. `responsive-device@1.0.0`;
- konkretną lukę lub pytanie;
- nazwę paczki i framework/konsumenta;
- referencję projektową, która ma przejąć wynik.

W tym trybie przeczytaj `references/company-standard-contracts.json`, rozwiąż dokładną wersję i wczytaj wyłącznie wskazaną centralną referencję. Nie uruchamiaj discovery, nie twórz planu, nie zadaj puli pytań i nie przejmuj całego zadania. Zwróć rozstrzygnięcie do aktywnego skilla projektowego. Jeżeli routing nie zawiera dokładnego kontraktu albo problem wymaga zmiany standardu firmowego, przerwij tryb referencyjny i poproś o jawne przejście do `orchestrator`.

Pozostała część obowiązkowego workflow dotyczy wyłącznie trybu `orchestrator`.

## Niezmienniki

- Domyślnie traktuj design system jako niezależną paczkę npm gotową na wielu konsumentów, nawet jeśli dziś istnieje tylko jeden.
- Ustal jako pierwszą decyzję `standalone-repository`, `colocated-workspace-package` albo wyjątkowo `embedded-mini-ds`. Wybierz `embedded-mini-ds` wyłącznie dla szczególnie małego projektu: jednej małej aplikacji, bez realnego scenariusza ponownego użycia, niezależnego release'u lub osobnego właściciela DS. W manifeście wymagaj konkretnego `localMiniDs.justification`; bez uzasadnienia decyzja jest `BLOCK`.
- Stosuj Figma Variables jako domyślne źródło prawdy, Style Dictionary jako obowiązkowy generator i SemVer dla release.
- Generuj warstwy core i semantic. Dla semantycznych tokenów zależnych od motywu wymagaj co najmniej trybów light i dark. Domyślnie pozwalaj konsumentom używać wyłącznie semantic colors.
- Eksportuj integracje przez `/angular` i `/react`; nie twórz publicznego `/tokens`.
- Generuj SCSS zawsze. Dla Angulara preferuj CSS variables; dla Reacta zapewnij Tailwind.
- Oddziel ikony od ilustracji, utrzymuj jawne publiczne API i instrukcję integracji per aplikacja.
- Wymagaj manifestu DS, manifestu każdego konsumenta, skilla konkretnego DS i deterministycznych guardraili CI.
- Nie wdrażaj komponentów ani gridu automatycznie; wynikają z decyzji użytkownika.
- Traktuj dostępność jako odłożony obszar v1, ale nie usuwaj lokalnych zabezpieczeń.

Pełny kontrakt znajduje się w `references/company-standard.md`.

## Obowiązkowy workflow

### 1. Zrób minimalny preflight bez mutacji

Wykonaj ten krok dopiero po przejściu bramki uruchomienia.

Przeczytaj instrukcje repozytorium. Ustal z polecenia cel i tryb, właściciela artefaktu, target, scope root oraz commit startowy. Nie wykonuj jeszcze pełnego discovery. Dla `design-system-introduction` najpierw odnajdź i zweryfikuj kanoniczny manifest istniejącego DS. Jeśli go nie ma albo jest niepoprawny, nie rozpoczynaj introduction i nie twórz jego artefaktu; zaproponuj audyt albo implementację/remediację DS.

### 2. Wybierz tryb pracy i załóż właściwy artefakt

Na podstawie jawnego celu użytkownika wybierz dokładnie jeden tryb:

- `design-system-audit` — raport stanu całego DS i rozbieżności;
- `design-system-implementation` — plan utworzenia, przebudowy albo remediacji DS;
- `design-system-consumer-audit` — raport stanu integracji jednej aplikacji konsumującej;
- `design-system-introduction` — plan podłączenia istniejącej paczki do aplikacji.

`design-system-consumer-migration` jest trybem pochodnym. Nie wybieraj go jako scenariusza startowego użytkownika; twórz go wyłącznie dla istniejących konsumentów podczas zaakceptowanej remediacji po audycie DS, zgodnie z `references/consumer-migration-after-remediation.md`.

Jeżeli cel nie jest rozstrzygnięty przez polecenie, zapytaj o niego przed utworzeniem pliku. Nie twórz generycznego artefaktu `pending`. Umieść artefakt DS w repo paczki, a artefakt konsumenta w repo aplikacji. Dla zmian w obu repo prowadź dwa powiązane plany o wspólnym `runId`, bez trzeciego master planu. Przeczytaj `references/work-artifacts.md`, a następnie uruchom:

```bash
node <skill-root>/scripts/initialize-work-artifact.mjs --project <owner-root> --mode <work-mode> --target-kind <design-system-package|consumer-application> --target-id <package-or-application-id> --scope-root <package-or-application-root> --start-commit <commit>
```

Dla bezpośredniego `design-system-implementation` albo `design-system-introduction` nie podawaj `--source-artifact`; initializer zapisze `sourceArtifact: none`. Gdy plan jest remediacją po audycie, podaj `--source-artifact <completed-audit.md>` oraz jego `--run-id`; oba argumenty są wtedy obowiązkowe. `design-system-consumer-migration` ma odrębny, zawsze obowiązkowy kontrakt źródła opisany w `references/consumer-migration-after-remediation.md`.

Initializer kontynuuje wyłącznie aktywny artefakt o tej samej tożsamości. Zakończony artefakt archiwizuje do `.tmp/design-system-history/`; przy aktywnym procesie dla innego targetu zatrzymuje pracę. Uzupełniaj wybrany plik po każdej odpowiedzi, decyzji i walidacji. Zawsze pokaż użytkownikowi dokładną, klikalną ścieżkę.

Zmieniaj status wyłącznie przez dozwolone przejścia:

```bash
node <skill-root>/scripts/update-work-artifact-status.mjs --artifact <artifact-path> --status <next-status>
```

W planach zmieniaj status każdego etapu wyłącznie przez jego marker `work-stage`:

```bash
node <skill-root>/scripts/update-work-artifact-stage.mjs --artifact <artifact-path> --stage <stage-id> --status <next-status>
```

### 3. Zrób pełne discovery i zbierz tylko brakujące decyzje

Uruchom discovery po utworzeniu artefaktu, aby od razu zachować wynik:

```bash
node <skill-root>/scripts/discover-project.mjs --project <project-root> --registry <skill-root>/references/design-system-skill-registry.json
```

Jeśli praca dotyczy kilku repozytoriów, wykonaj discovery każdego z nich i zapisz dowody w artefakcie należącym do repo, którego dotyczą. Nie pytaj o fakty możliwe do wykrycia.

Zadaj pytania z `references/workflow-and-discovery.md` małymi pulami. Najpierw ustal topologię repozytorium, następnie tryb pracy, frameworki i konsumentów, link do całego projektu Figma, źródło tokenów, responsywność/grid, zakres komponentów, preview, registry oraz politykę tokenów per framework i kategoria (`generate`, `autocomplete`, `allowedUsage`). Dla responsywności zapisz jeden wyłączny wybór: `device-contract` z runtime `device()` albo `css-media` z `breakpoint()`; nigdy oba. W planie wykonawczym zaprojektuj w manifeście uporządkowane nazwy breakpointów, ich źródłowy plik/token path, device types, top-level mapowanie device → breakpoint, mnożniki i fallbacki; w audycie porównaj istniejący manifest i kod z tym kontraktem. Dla gridu zapisz osobno tylko jego włączenie, warianty i źródło grid tokens.

Jeśli Figma Variables są źródłem prawdy, użyj dostępnego skilla Figma do odczytu pliku; jeśli nie jest dostępny, poproś użytkownika o jego dołączenie. Nie implementuj wartości tokenów z samego zrzutu ekranu.

Jeśli zakres Angular obejmuje grid albo runtime light/dark, przeczytaj `references/angular-grid-and-theming.md`. Dla gridu wybierz dokładnie jeden adapter zgodny z `responsive.mode`; dla theme połącz wygenerowane semantic tokens z obowiązkowym kontraktem `body[data-theme]`, `sessionStorage["theme"]` i jawnym `ThemeService.loadTheme()`.

### 4. Wczytaj referencję właściwą dla trybu

- `design-system-introduction`: przeczytaj `references/scenario-connect-existing.md`.
- `design-system-audit`: przeczytaj `references/scenario-audit-and-complete.md`.
- `design-system-consumer-audit`: przeczytaj `references/scenario-consumer-audit.md`.
- `design-system-implementation`: dla nowego DS przeczytaj `references/scenario-create-new.md`; dla remediacji wczytaj źródłowy `.tmp/design-system-audit.md` i sekcję remediacji z `references/scenario-audit-and-complete.md`.

Następnie wczytaj wyłącznie referencje potrzebne dla wykrytych frameworków i obszarów z tabeli routingu poniżej.

### 5. Zaprojektuj kontrakty maszynowe

W `design-system-implementation` zaprojektuj manifest DS z `assets/manifests/design-system.manifest.example.json` oraz manifesty konsumentów objęte zakresem. W `design-system-introduction` istniejący, poprawny manifest DS jest obowiązkowym read-only prerequisite; projektuj i twórz wyłącznie manifest bieżącego konsumenta. Brak lub błąd manifestu DS przerywa introduction i wymaga osobnego procesu dla paczki. Utwórz kanoniczne pliki dopiero po akceptacji właściwego etapu. W audycie nie twórz brakującego manifestu: zgłoś brak jako finding i waliduj istniejące pliki raportowo. W manifeście DS zapisuj osobne polityki Angular i React. Używaj schematów z `assets/manifests/schemas/`.

Stosuj jedyne kanoniczne lokalizacje:

- `<repository-root>/<repository.packageRoot>/design-system.manifest.json`, zawsze obok `package.json` paczki DS;
- `<repository-root>/<application.root>/design-system-consumer.manifest.json`, osobno w katalogu głównym każdej aplikacji konsumującej.

Dla ścieżki `.` plik leży w root repozytorium. W monorepo nie umieszczaj manifestu zbiorczo w root, jeśli opisuje paczkę lub aplikację w podkatalogu. Nie trzymaj kanonicznych manifestów w `.tmp`, `docs` ani dowolnym katalogu konfiguracyjnym. Discovery ma szukać obu stałych nazw w repozytorium, a walidacja granicy ma blokować lokalizację niezgodną z `packageRoot` lub `application.root`.

W `designSource.projectUrl` zapisz link do całego projektu/pliku Figma zawierającego fundamenty i komponenty. Traktuj go niezależnie od `tokens.sourceOfTruth.url`, który może prowadzić precyzyjnie do źródła Figma Variables; oba pola mogą mieć ten sam URL.

Projektowy `references/tokens.md` musi umożliwiać natychmiastową weryfikację
zgodności tokenów z Figmą: zawierać bezpośrednie, rozwiązane URL-e albo wskazać
dokładnie `references/design-system-manifest.json` → `designSource.projectUrl`
i `tokens.sourceOfTruth.url`. Musi też opisywać porównanie collections, modes,
typów, scopes, aliasów i wartości 1:1. Nie publikuj skilla z placeholderem URL.

Traktuj `design-system.schema.json` i `design-system-consumer.schema.json` jako jedyne źródła prawdy o strukturach manifestów. Każde pole `properties` i każda definicja `$defs` muszą mieć niepuste `description`. Typ TypeScript generuj wyłącznie z `design-system.schema.json` i utrzymuj go w repo paczki DS, jeśli jest częścią jej kontraktu. Dla manifestu konsumenta zachowaj wyłącznie JSON Schema: nie generuj `design-system-consumer-manifest.generated.ts`, nie dodawaj go do aplikacji i nie eksportuj `DesignSystemConsumerManifest`. W CI waliduj opisy schemy konsumenta przez `scripts/generate-manifest-types.mjs --validate-only`, bez tworzenia outputu. W audycie wyłącznie sprawdź stan i zapisz finding.

Uruchom odpowiednie walidatory:

```bash
node <skill-root>/scripts/validate-design-system.mjs --manifest <design-system.manifest.json>
node <skill-root>/scripts/validate-design-system-consumer.mjs --project <repository-root> --manifest <application-root>/design-system-consumer.manifest.json
node <skill-root>/scripts/generate-manifest-types.mjs --schema <design-system.schema.json> --output <design-system-manifest.generated.ts> --check
node <skill-root>/scripts/generate-manifest-types.mjs --schema <design-system-consumer.schema.json> --validate-only
node <skill-root>/scripts/verify-responsive-config.mjs --project <repository-root> --manifest <design-system.manifest.json>
node <skill-root>/scripts/validate-repository-boundary.mjs --project <repository-root> --manifest <design-system.manifest.json>
```

W zaakceptowanym trybie wykonawczym dla zastanego mini-DS ustaw najpierw `migration-baseline` i uruchom:

```bash
node <skill-root>/scripts/create-mini-ds-baseline.mjs --project <repository-root> --manifest <design-system.manifest.json>
```

Nie używaj baseline w czystym projekcie: ustaw `localMiniDs.mode: forbid` i `heuristicFindings: block` od pierwszego etapu. Wyjątkiem jest zatwierdzona topologia `embedded-mini-ds`, która nadal używa `localMiniDs.mode: forbid`, aby blokować drugi, konkurencyjny mini-DS poza zadeklarowanym rootem. W trybie audytu nie twórz baseline; oceń, czy istnieje i czy jest potrzebny.

### 6. Przedstaw właściwy rezultat i zatrzymaj mutacje

W `design-system-audit` i `design-system-consumer-audit` przedstaw raport stanu, elementy zgodne, findingi z dowodami i rekomendowane kierunki. Nie zamieniaj raportu w checklistę wdrożenia. Jeśli brakuje dostępu do dowodu należącego do zakresu, ustaw status `awaiting-input`, przerwij audyt, poproś o dostęp i po jego uzyskaniu kontynuuj ten sam `runId`; nie klasyfikuj braku dostępu jako findingu i nie zamykaj raportu.

Po zakończeniu audytu zawierającego co najmniej jeden `BLOCK` obowiązkowo utwórz osobny plan naprawczy jako `draft`, bez rozpoczynania zmian. Dla audytu DS utwórz `design-system-implementation` w repo paczki. Dla audytu konsumenta wybierz właściciela każdego blokera: zmiany aplikacji kieruj do `design-system-introduction`, zmiany paczki do `design-system-implementation`, a przy obu właścicielach utwórz dwa plany o wspólnym `runId`. Każdy plan musi wskazywać raport przez `--source-artifact`. Plan `design-system-introduction` wolno wygenerować tylko po ponownej weryfikacji poprawnego manifestu DS; jeśli prerequisite nie przechodzi, wygeneruj wyłącznie plan `design-system-implementation` dla paczki i pozostaw blokery aplikacji powiązane jako zależne. Brak `BLOCK` nie tworzy planu automatycznie.

W `design-system-implementation` i `design-system-introduction` plan ma zawierać zakres, decyzje, architekturę, pliki, kolejność, kryteria akceptacji, guardraile, testy, ryzyka, wyjątki, rollback i rollout. Pokaż ścieżkę i poproś o jawną akceptację. Nie zmieniaj kodu produktu przed akceptacją. W każdym procesie wykonawczym wymagaj osobnej akceptacji każdego etapu.

### 7. Implementuj wyłącznie w trybie wykonawczym

Nie wykonuj tego kroku w trybie audytu. Najpierw przejdź do `design-system-implementation` albo `design-system-introduction` i uzyskaj akceptację.

Kopiuj wzorce z `assets/` jako punkt startowy, a następnie dopasuj nazwy i ścieżki do manifestu. Nie kopiuj przykładów bez usunięcia placeholderów. Po każdym etapie:

1. uruchom adekwatny build, testy i preview;
2. uruchom walidatory manifestów i guardraile;
3. zapisz dowody i stan checklisty we właściwym planie;
4. poproś o akceptację następnego etapu wyłącznie we właściwym planie wykonawczym; raport audytowy pozostaje read-only i nie służy do wykonywania ani akceptowania etapów zmian.

Dla SVG przeczytaj `references/svg-asset-pipeline.md`. Utrzymuj ręcznie wyłącznie źródłowe pliki i projektową konfigurację contextów/słownictwa; generuj typy TypeScript, Angular Registry i frameworkowe eksporty z nazw plików. Dla złożonego gridu przeczytaj `references/responsive-layout-and-grid.md` przed adapterem frameworkowym i wymagaj walidacji overlayem. Przy edycji/dodaniu/usunięciu mnożnika, breakpointu albo tokenu przeczytaj `references/change-scenarios.md` i zastosuj wyłącznie gałęzie zgodne z manifestem. Po zmianie breakpointów, grid tokens, device types, mnożników, fallbacków albo mapowania uruchom `verify-responsive-config.mjs`; nigdy nie edytuj `responsive.generatedConfigScssPath` ręcznie.

Jeżeli `design-system-implementation` jest planem remediacji wygenerowanym po audycie i DS ma istniejących konsumentów, przeczytaj `references/consumer-migration-after-remediation.md`. Po ukończeniu etapu `contract-stabilization`, zbudowaniu lokalnego `.tgz` release candidate i analizie wpływu pokaż użytkownikowi kompletny, kanoniczny `design-system-consumers.json`, inventory oraz listę planów migracji. Dopiero po osobnej akceptacji etapu `consumer-migration-plan-generation` utwórz w application root każdego konsumenta `.tmp/design-system-consumer-migration.md` ze wspólnym `runId`. Utworzenie planu nie pozwala na migrację aplikacji. Nie publikuj finalnego release’u, dopóki `validate-consumer-migration-plans.mjs` nie potwierdzi dokładnej zgodności rejestru i inventory, `.tgz`, checksumy, wszystkich planów i ukończonego etapu generacji.

### 8. Zapewnij i zweryfikuj skill konkretnego DS

Rozwiąż mapowanie paczka → skill:

```bash
node <skill-root>/scripts/validate-design-system-registry.mjs --registry <skill-root>/references/design-system-skill-registry.json
node <skill-root>/scripts/resolve-design-system-skill.mjs --package <package-name> --registry <skill-root>/references/design-system-skill-registry.json
```

Jeśli skill nie istnieje lub jest nieaktualny, w audycie zapisz finding i dowody bez tworzenia plików. W `design-system-introduction` zatrzymaj proces i utwórz albo wskaż osobny `design-system-implementation` dla repo paczki; introduction nie może zmieniać skilla DS. Wyłącznie w zaakceptowanym etapie `design-system-implementation` najpierw uruchom `skill-creator` i zastosuj jego pełne instrukcje. Dopiero potem użyj domenowego kontraktu z `references/design-system-skill-contract.md`. Nie duplikuj zasad technicznych `skill-creator`.

W audycie sprawdź przypięcie wersji kontraktów oraz kompletność skilla projektowego i zapisz findingi bez mutacji. Wyłącznie w zaakceptowanym etapie `design-system-implementation` przypnij w manifeście wersje zastosowanych kontraktów z `references/company-standard-contracts.json` i utwórz lub zaktualizuj skill. W introduction tylko zweryfikuj istniejące przypięcia i skill jako prerequisite. Skill projektowy ma zawierać jeden główny `SKILL.md` i komplet referencji wymaganych przez kontrakt; nie rozbijaj zwykłej obsługi tokenów, SVG, responsywności, komponentów ani preview na dodatkowe skille. Istniejące wyspecjalizowane skille mogą pozostać wyłącznie jako przejściowe aliasy kompatybilności, dopóki ich wiedza nie zostanie przeniesiona i zweryfikowana.

Zweryfikuj wynik:

```bash
node <skill-root>/scripts/validate-design-system-skill.mjs --skill <ds-skill-root> --manifest <design-system.manifest.json>
node <skill-root>/scripts/validate-company-standard-contracts.mjs --registry <skill-root>/references/company-standard-contracts.json
node <skill-root>/scripts/generate-manifest-types.mjs --schema <skill-root>/references/company-standard-contracts.schema.json --output <skill-root>/references/company-standard-contracts.generated.ts --check
```

W audycie i introduction jedynie sprawdź centralny rejestr. Wyłącznie w zaakceptowanym etapie `design-system-implementation` przygotuj automatycznie wpis do rejestru, ale publikuj zmianę globalnego skilla dopiero po jawnej zgodzie użytkownika. Skill konkretnego DS ma być docelowo `SHARED`; `.tmp` służy tylko do budowy.

### 9. Domknij proces

Zastosuj kryteria końcowe właściwe dla trybu z `references/workflow-and-discovery.md`. Audyt kończy się raportem i może pozostać niezgodny ze standardem. Implementację/wprowadzenie/migrację kończ dopiero po spełnieniu zaakceptowanych kryteriów. Przed `npm publish`, opublikowaniem skilla lub zmianą współdzielonego rejestru uzyskaj osobną zgodę. Dla remediacji po audycie zastosuj dodatkową bramkę planów migracji istniejących konsumentów. Zaproponuj zmianę SemVer na podstawie conventional commits/release notes i pozwól deweloperowi ją skorygować.

## Routing wiedzy

| Potrzeba | Wczytaj |
|---|---|
| Pełny standard i antywzorce | `references/company-standard.md` |
| Osobne repo, współlokowana paczka, mini-DS | `references/repository-topology-and-boundaries.md` |
| Pytania, akceptacje, zakończenie | `references/workflow-and-discovery.md` |
| Tryby pracy i artefakty `.tmp` | `references/work-artifacts.md` |
| Tokeny, Figma, theme, polityki IDE | `references/tokens-figma-and-theming.md` |
| Edycja/dodanie/usunięcie tokenu, breakpointu lub mnożnika | `references/change-scenarios.md` |
| Nazewnictwo tokenów i SVG | `references/naming-contracts.md` |
| Generator, walidacja i publikacja SVG | `references/svg-asset-pipeline.md` |
| Uniwersalne stylowanie responsive/grid | `references/responsive-layout-and-grid.md` |
| Angular, CSS variables, registry SVG | `references/framework-angular.md` |
| Angular grid i runtime light/dark | `references/angular-grid-and-theming.md` |
| React, Tailwind, entry point | `references/framework-react.md` |
| Assety, publiczne API, konsumenci | `references/assets-public-api-and-consumers.md` |
| Manifesty, rejestr, per-DS skill | `references/manifests-registry-and-skills.md` |
| Guardraile, CI, artifact policy, release | `references/guardrails-ci-release.md` |
| Plany migracji istniejących konsumentów po remediacji | `references/consumer-migration-after-remediation.md` |
| Wersjonowane kontrakty dla skilli projektowych | `references/company-standard-contracts.json` |
| Decyzje migracyjne dla istniejących skilli DS | `references/project-skill-migration-decisions.md` |

## Interpretacja wyników

- `BLOCK`: zatrzymaj etap/release i napraw albo zapisz aktywny, prawidłowo zatwierdzony wyjątek.
- `REVIEW_REQUIRED`: pokaż dowody deweloperowi; decyzję po konsultacji z szefem zapisz we właściwym raporcie albo planie. Do `exceptions` manifestu wpisz ją tylko w zaakceptowanym trybie wykonawczym i tylko wtedy, gdy zatwierdza aktywne odstępstwo wymagane przez walidatory.
- `WARN`: zapisz we właściwym artefakcie i kontynuuj, jeśli nie narusza kryteriów etapu.

Nie uznawaj samej dokumentacji za guardrail, jeśli regułę można sprawdzić deterministycznie w CI.
