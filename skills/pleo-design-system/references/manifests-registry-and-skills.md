# Manifesty, rejestr i skille DS

## Centralny rejestr

Używaj `design-system-skill-registry.json` jako cienkiej mapy paczka → skill. Nie zapisuj w rejestrze API ani reguł tokenów.

Waliduj go względem `design-system-skill-registry.schema.json` oraz skryptem `scripts/validate-design-system-registry.mjs`. Wpis musi określać frameworki, status i dystrybucję `SHARED`.

Po wykryciu nowej paczki automatycznie przygotuj wpis. Publikacja zaktualizowanego `pleo-design-system` wymaga osobnej zgody użytkownika.

## Manifest DS

Utwórz manifest na podstawie `assets/manifests/design-system.manifest.example.json` i waliduj go schematem. Manifest jest maszynowym źródłem kontraktu paczki.

### Kanoniczne lokalizacje i discovery

Manifest zawsze leży przy elemencie, który opisuje:

| Manifest | Kanoniczna lokalizacja |
| --- | --- |
| Design system | `<repository-root>/<repository.packageRoot>/design-system.manifest.json`, obok własnego `package.json` paczki DS |
| Rejestr konsumentów DS | `<repository-root>/<repository.packageRoot>/design-system-consumers.json`, obok manifestu DS; maszynowy snapshot kompletnej listy zaakceptowanej przez użytkownika |
| Konsument | `<repository-root>/<application.root>/design-system-consumer.manifest.json`, w katalogu głównym danej aplikacji |

Przykłady:

- osobne repo DS z `packageRoot: "."`: `/design-system.manifest.json` w root repo;
- DS współlokowany z `packageRoot: "packages/design-system-example"`: `/packages/design-system-example/design-system.manifest.json`;
- aplikacja z `application.root: "apps/admin"`: `/apps/admin/design-system-consumer.manifest.json`.

Używaj dokładnie tych nazw. Jeden konsument ma jeden manifest. Rejestr konsumentów musi obejmować także konsumentów zewnętrznych względem repo DS; aktualizuj go przy introduction, wycofaniu konsumenta i przed remediacją obejmującą migracje. Każdy wpis zawiera stabilne `id`, `repositoryId` (np. nazwę repo z hostingu, bez lokalnego dysku) i `applicationRoot` względny wobec tego repo. Nie zapisuj w rejestrze `repositoryRoot`; lokalna ścieżka należy wyłącznie do `.tmp` inventory bieżącego procesu. Root monorepo nie jest miejscem na manifest konkretnej paczki lub aplikacji, chyba że odpowiedni `packageRoot` albo `application.root` wynosi `.`. `.tmp` przechowuje raport albo plan procesu zgodny z `work-artifacts.md`, nigdy kanoniczny manifest ani rejestr.

`scripts/discover-project.mjs` przeszukuje repozytorium po stałych nazwach i zwraca `designSystemPaths` oraz `consumerPaths`. Dla rzeczywistego repo uruchamiaj walidator konsumenta z `--project`; wtedy błędna lokalizacja względem `application.root` jest `BLOCK`. Walidator granicy analogicznie blokuje błędną lokalizację manifestu DS względem `repository.packageRoot`.

### Powiązanie z Figmą

`designSource.projectUrl` wskazuje cały projekt lub plik Figma design systemu — fundamenty, dokumentację wizualną i ewentualne komponenty. Jest to stały punkt wejścia dla agenta i zespołu.

`tokens.sourceOfTruth.url` ma węższe znaczenie: wskazuje źródło Figma Variables używane do generowania tokenów. Może być bardziej precyzyjnym linkiem albo tym samym adresem co `designSource.projectUrl`. Nie zastępuj jednego pola drugim. Jeśli cały projekt nie jest prowadzony w Figmie, `designSource.type: "other"` wymaga uzasadnienia w `exceptionReason`.

Sekcja `repository` zapisuje topologię, package root, consumer roots i politykę granicy. Dla `migration-baseline` utwórz plik przez `scripts/create-mini-ds-baseline.mjs`, następnie waliduj granicę przez `scripts/validate-repository-boundary.mjs`. Dla `embedded-mini-ds` wymagaj niepustego `repository.boundaryPolicy.localMiniDs.justification`, które opisuje małą skalę i brak potrzeby niezależnej paczki. Nie wymagaj danych osób odpowiedzialnych ani akceptujących.

Minimalny zapis decyzji:

```json
{
  "repository": {
    "topology": "embedded-mini-ds",
    "packageRoot": ".",
    "consumerRoots": [],
    "boundaryPolicy": {
      "localMiniDs": {
        "mode": "forbid",
        "baselineFile": null,
        "heuristicFindings": "block",
        "justification": "Jedna mała aplikacja; brak planowanego reuse, niezależnego release'u i osobnego ownershipu DS; wydzielenie paczki byłoby nieproporcjonalne do zakresu."
      }
    }
  }
}
```

Sekcja `assets` zapisuje kanoniczne ścieżki generatora nazw SVG, jego projektowej konfiguracji, generowanych typów/registry i opcjonalnego React barrel. `commands.buildAssets` odtwarza outputy ze źródeł, a `commands.checkAssets` waliduje źródła i blokuje ich rozjazd z wygenerowanym kontraktem.

Sekcja `responsive` rozdziela wspólny kontrakt od opcjonalnego grida. `responsive.deviceBreakpointMap` jest top-level, ponieważ korzysta z niego skalowanie tokenów również przy `grid.enabled: false`; w `css-media` mapa, `deviceTypes`, mnożniki i fallbacki pozostają puste. `responsive.grid` przechowuje wyłącznie włączenie, warianty i lokalne źródło grid tokens.

### Schemy i typ TypeScript paczki DS

Utrzymuj `design-system.schema.json` i `design-system-consumer.schema.json` jako jedyne ręcznie edytowane źródła prawdy o strukturach manifestów. Wymagaj niepustego `description` przy każdym polu `properties` i każdej definicji `$defs`.

Z `design-system.schema.json` generuj `design-system-manifest.generated.ts` przez `scripts/generate-manifest-types.mjs`, jeśli paczka DS używa lub publicznie eksportuje `DesignSystemManifest`; opisy mają zostać przeniesione do komentarzy JSDoc. Oznacz typ jako generowany i zabroń jego ręcznej edycji.

`design-system-consumer.schema.json` jest samodzielnym kontraktem walidacji runtime dla aplikacji. Nie generuj z niej interfejsu TypeScript, nie twórz `design-system-consumer-manifest.generated.ts` w repo konsumenta ani paczki DS i nie wymagaj publicznego eksportu `DesignSystemConsumerManifest`. Waliduj opisy przez `scripts/generate-manifest-types.mjs --schema <consumer-schema> --validate-only`; ten tryb nie tworzy outputu. Po zmianie schemy DS odśwież jej typ i sprawdź parę schema–typ przez `--check`; po zmianie schemy konsumenta uruchom wyłącznie `--validate-only`.

## Manifest konsumenta

Utwórz osobny manifest w root każdej aplikacji z paczką, frameworkiem, entry pointem, integracją styles/assets/runtime oraz wyjątkami. `application.root` jest ścieżką względem root repozytorium i musi wskazywać katalog zawierający ten manifest.

## Skill konkretnego DS

Przed jego utworzeniem lub dużą aktualizacją zawsze uruchom `skill-creator`. Nie kopiuj do tego skilla ogólnych instrukcji tworzenia skilli.

Następnie zastosuj `design-system-skill-contract.md`. Każdy DS ma jeden główny skill z obowiązkowymi referencjami; osobne skille tokenów, SVG, responsywności lub preview są tylko przejściowymi aliasami migracyjnymi.

`designSystemSkill.sourcePath` wskazuje wersjonowane źródło skilla w repozytorium, zwykle `skills/<skill-name>`. Publikacja jako `SHARED` nie zastępuje tego źródła: CI musi umieć zweryfikować skill bez pobierania go z prywatnego komputera albo globalnego cache.

`designSystemSkill.companyStandardContracts` przypina dokładne wersje kontraktów z `company-standard-contracts.json`. Tę samą listę `id@version` wpisz do `references/design-system-contract.md` skilla. `validate-design-system-skill.mjs` sprawdza istnienie wersji, wymagany zestaw zależny od manifestu, zgodność snapshotu i stalenie względem `upgradePolicy`.

Brak skilla, brak wymaganej referencji, niezgodny snapshot albo stary kontrakt `block-on-stale` blokuje CI i release repo DS. Kontrakt `review-on-stale` tworzy finding wymagający zaplanowanej migracji. Zwykły PR w osobnym repo konsumenta nie musi pobierać źródła skilla DS, ale używa opublikowanej wersji skilla i własnego manifestu konsumenta.
