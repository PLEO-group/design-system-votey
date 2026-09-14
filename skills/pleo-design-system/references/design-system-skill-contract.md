# Kontrakt skilla konkretnego design systemu

## Cel i granica ze `skill-creator`

Każdy design system ma dokładnie jeden główny skill projektowy. Jest on codziennym właścicielem użycia i utrzymania konkretnej paczki: implementacji widoków z Figmy, tokenów, SVG, responsywności, komponentów, preview, publicznego API i integracji konsumentów.

`skill-creator` pozostaje jedynym źródłem zasad technicznych tworzenia skilla: nazwy, frontmatteru, `agents/openai.yaml`, progressive disclosure, inicjalizacji, walidacji i forward-testu. Ten dokument nie zastępuje ani nie kopiuje tych zasad; definiuje domenową zawartość skilla DS.

## Model wiedzy

Skill projektowy jest cienką, konkretną warstwą nałożoną na wersjonowane standardy firmy:

- globalny `pleo-design-system` przechowuje uniwersalne reguły i wzorce;
- manifest DS przypina dokładne wersje użytych kontraktów;
- `references/design-system-contract.md` powtarza te piny w czytelnej formie i wskazuje stan weryfikacji;
- pozostałe referencje przekładają kontrakty na realne ścieżki, komendy, API, wzorce i wyjątki danego DS;
- rutynowy task korzysta z lokalnych referencji i nie uruchamia globalnego orkiestratora.

Zmiana standardu centralnego nie może po cichu zmienić zachowania istniejącego projektu. Registry kontraktów określa politykę aktualizacji: `review-on-stale` wymaga zaplanowanej migracji, a `block-on-stale` blokuje walidację skilla do czasu aktualizacji albo jawnego odstępstwa.

## Obowiązkowa struktura

```text
<design-system-skill>/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── design-system-manifest.json
    ├── design-system-contract.md
    ├── tokens.md
    ├── theming.md
    ├── svg-assets.md
    ├── responsiveness.md
    ├── components.md
    ├── preview.md
    ├── consumers.md
    ├── angular.md       # wymagany, gdy Angular jest włączony
    └── react.md         # wymagany, gdy React jest włączony
```

Nie twórz osobnych skilli dla tokenów, SVG, responsywności, komponentów ani preview. Istniejący wyspecjalizowany skill może chwilowo pozostać jako alias migracyjny, ale główny skill DS musi przejąć jego kompletny kontrakt operacyjny.

## Wymagania dla `SKILL.md`

`SKILL.md` ma być krótkim routerem i zawierać:

1. precyzyjny trigger z nazwą paczki, obsługiwanymi repozytoriami/frameworkami, publicznymi entry pointami i typowymi zadaniami;
2. jawne wykluczenia dla innych DS i zadań niezwiązanych z tą paczką;
3. rozpoznanie kontekstu: źródło DS, konsument Angular, konsument React albo zmiana shared;
4. tabelę routingu do wymaganych referencji;
5. obowiązkową bramkę izolacji frameworków i publicznego API;
6. codzienny workflow implementacji z Figmy i zmian utrzymaniowych;
7. warunki eskalacji do `pleo-design-system`;
8. minimalną weryfikację i zakaz deklarowania wykonanych testów bez ich uruchomienia.

Nie wstawiaj do głównego pliku pełnych katalogów komponentów, list tokenów ani tutoriali. Umieść je w referencjach i ładuj tylko dla bieżącego zadania.

## Routing codziennego zadania

### Nowy widok albo zmiana UI z Figmy

1. Uruchom właściwy skill Figmy i odbierz neutralny handoff; nie zgaduj API DS z nazw warstw.
2. Odczytaj zainstalowaną wersję paczki i manifest konsumenta.
3. Wczytaj `consumers.md`, referencję frameworka oraz tylko potrzebne: `components.md`, `tokens.md`, `responsiveness.md`, `theming.md`, `svg-assets.md`.
4. Najpierw mapuj role UI na istniejące publiczne komponenty/prymitywy, potem tokeny, layout i assety.
5. Potwierdź selector, input/output, eksport, nazwę assetu i token w publicznym API zainstalowanej wersji. Katalog discovery nie jest dowodem API.
6. Lokalny wrapper może komponować DS i logikę domenową, ale nie może kopiować komponentu, tworzyć nowego mini-DS ani omijać publicznego entry pointu.
7. Dla różnicy wyłącznie wizualnej użyj mechanizmu stylowania; runtime frameworka stosuj dopiero, gdy zmienia się DOM, kolejność, obecność albo zachowanie.
8. Wykonaj walidację opisaną w referencji konsumenta i frameworka, w tym theme/viewport, runtime console, overflow i wymagane stany.

### Rutynowa zmiana tokenu, SVG, breakpointu albo komponentu

Wczytaj jedną właściwą referencję projektową i wykonaj zawarty w niej source-driven workflow. Nie uruchamiaj `pleo-design-system`, chyba że lokalna referencja jawnie wykryje lukę w przypiętym kontrakcie firmowym.

## Routing do globalnego skilla

Eskaluj do `pleo-design-system` w trybie `orchestrator` wyłącznie dla:

- onboardingu nowego konsumenta wymagającego pełnego planu;
- audytu całego DS względem standardu firmowego;
- tworzenia, wydzielania albo zmiany topologii paczki;
- dodania frameworka lub zmiany modelu dystrybucji;
- projektowania manifestów, polityki granicy albo nowych guardraili;
- ustanowienia lub zmiany standardu firmowego.

Eskaluj w trybie `contract-reference` tylko po dokładną regułę. Routing musi mieć format:

```text
pleo-design-system contract-reference
package: <npm-package>
contract: <contract-id>@<semver>
question: <konkretna luka>
return-to: references/<file>.md
```

Nie kieruj do globalnego skilla zwykłego dodania ikony, tokenu, stylu, komponentu, story ani eksportu. Jeśli projektowa referencja wymaga globalnego skilla przy każdej takiej zmianie, jest niekompletna.

## Obowiązkowa zawartość referencji

### `design-system-manifest.json`

Przenośny snapshot kanonicznego manifestu DS. Musi odpowiadać aktualnej wersji paczki. Nie jest drugim źródłem prawdy; aktualizuje się go z manifestu repozytorium i sprawdza deterministycznie.

### `design-system-contract.md`

- pakiet, registry, SemVer, topologia, package root i publiczne entry pointy;
- źródłowy katalog skilla zgodny z `designSystemSkill.sourcePath`; publikacja SHARED nie zastępuje wersjonowanego źródła w repo;
- wersja paczki i commit/data ostatniej weryfikacji;
- lista `contract-id@version` identyczna z manifestem;
- ownership matrix: co należy do paczki, konsumenta, Figmy i lokalnych prymitywów;
- artifact policy, granica repo i zakaz mini-DS;
- zatwierdzone wyjątki oraz link do instrukcji migracyjnych.

### `tokens.md`

- bezpośredni, rozwiązany URL projektu Figma i źródła Figma Variables albo
  dokładne wskazanie `references/design-system-manifest.json` →
  `designSource.projectUrl` i `tokens.sourceOfTruth.url`;
- wykonywana na żądanie weryfikacja zgodności 1:1: collections, modes, typy,
  scopes, rekurencyjnie rozwiązane aliasy, wartości, mapowanie nazw oraz raport
  tokenów brakujących, nadmiarowych i różniących się;
- źródłowe ścieżki core/semantic/light/dark i lokalnych grid tokens;
- Style Dictionary, import, generowanie i wszystkie outputy;
- `generate`, `autocomplete`, `allowedUsage` osobno dla Angulara i Reacta;
- kompletne add/edit/remove/rename, wyszukiwanie konsumentów i deprecacja;
- bramka surowych wartości w kategoriach objętych tokenizacją;
- zakaz ręcznej edycji outputów.

### `theming.md`

- modes i źródła semantic light/dark;
- publiczne importy per framework;
- host, persistence, initialization i testy runtime;
- dla niewspieranego runtime jawne `not-applicable`, nie brak dokumentu;
- konkretne miejsca inicjalizacji u każdego konsumenta.

### `svg-assets.md`

- foldery ikon i ilustracji, contexty, prefixy, namespace'y, modyfikatory i słownictwo;
- deterministyczne mapowanie nazwy pliku na typ TS, Angular Registry, React export i preview;
- generator, walidator, outputy i komendy;
- add/audit/rename/move/remove wraz z breaking-change i migracją konsumentów;
- bezpieczeństwo SVG, `viewBox`, kolory, identyfikatory, duplikaty treści i literówki;
- reguły użycia publicznego assetu w każdym frameworku.

### `responsiveness.md`

- dokładnie jeden model: `device-contract` albo `css-media`;
- breakpointy, device types, mapowanie, mnożniki i fallbacki zgodne z manifestem;
- grid jako pełny kontrakt albo jawne `enabled: false`;
- projektowe main/nested/form/card patterns i sposób wyboru z handoffu Figmy;
- granica style-vs-runtime behavior;
- overlay/runtime QA, macierz viewportów i dopuszczalna tolerancja.

### `components.md`

- `enabled: true/false`; dokument istnieje także bez komponentów;
- katalog discovery albo sposób jego generowania;
- source roots, selektory/prefixy, publiczne eksporty i zasady wariantów;
- reguły komponent vs lokalny wrapper vs brakujący wariant;
- tworzenie/migracja komponentu: tokenizacja, stan, dostępność, test, public API i preview;
- zasada potwierdzania API w zainstalowanej paczce;
- ownership lokalnych prymitywów konsumenta, jeśli paczka nie publikuje komponentów.

### `preview.md`

- Storybook albo aplikacja preview, ścieżki, routing i komendy;
- wymagany format dokumentacji komponentu, jeśli komponenty są włączone;
- automatyczne grupowanie assetów i zakaz ręcznych list, jeśli generator to obsługuje;
- minimalny zestaw stories/stron, theme, viewporty, stany i visual/runtime smoke test;
- build preview jako guardrail CI.

### `consumers.md`

- jedna sekcja per aplikacja: stabilne ID, root/repo, framework, wersja paczki i manifest;
- instalacja, publiczne importy, style, kopiowanie assetów, registry/provider/theme bootstrap;
- lokalne prymitywy i granica odpowiedzialności;
- komendy build/test oraz route/story do smoke testu;
- instrukcja aktualizacji paczki i migracji breaking changes.
- ścieżka do `.tmp/design-system-consumer-migration.md` podczas aktywnego procesu oraz zasada walidacji release candidate przed publikacją.

### `angular.md` i `react.md`

Każda włączona referencja zawiera entry point, frameworkowy output tokenów/assetów, integrację, izolację bundla, zasady komponentów i walidację. W systemie wieloframeworkowym zmiana `angular-only` nie może zmieniać zależności, bundla ani API Reacta i odwrotnie; zmiana `shared` wymaga walidacji obu.

## Tworzenie i aktualizacja

1. Uruchom `skill-creator` i przeczytaj jego kompletne instrukcje.
2. Odczytaj manifest DS, package exports, build, preview i manifesty konsumentów.
3. Zainicjalizuj jeden skill i skopiuj właściwe szablony z `assets/design-system-skill/` oraz `assets/design-system-skill-references/`.
4. Usuń wszystkie placeholdery i potwierdź treść w kodzie lub manifestach.
5. Potwierdź, że agent może z `references/tokens.md` natychmiast odnaleźć URL
   Figma Variables i wykonać porównanie 1:1 bez ponownego discovery.
6. Jeśli migrujesz starsze skille, użyj `project-skill-migration-decisions.md` jako checklisty zachowania wiedzy.
7. Uruchom `validate-company-standard-contracts.mjs`, `validate-design-system-skill.mjs` i walidację `skill-creator`.
8. Forward-testuj co najmniej: widok z Figmy, weryfikację zgodności tokenów z
   aktualną Figmą, zmianę tokenu, zmianę SVG i zmianę framework-specific.
9. Publikuj jako `SHARED` dopiero po zgodzie użytkownika.

## Zakaz duplikacji i stalenia

Nie kopiuj pełnych tutoriali centralnych. Lokalna referencja ma zawierać wynik zastosowania kontraktu: konkretne wybory, ścieżki, komendy, API, wzorce i wyjątki. Musi jednak być samowystarczalna dla rutynowego zadania.

Przy zmianie centralnego kontraktu:

1. utwórz nową wersję i nie nadpisuj znaczenia istniejącej;
2. walidator wskaże projekty z nieaktualnym pinem zgodnie z `upgradePolicy`;
3. zaktualizuj lokalną referencję i snapshot manifestu;
4. wykonaj adekwatny forward-test;
5. dopiero potem zmień pin w manifeście i opublikuj nową wersję skilla projektowego.
