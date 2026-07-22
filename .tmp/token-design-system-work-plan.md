# Plan wykonawczy — tokeny Design System Votey

Status dokumentu: aktywna checklista projektu  
Zakres: tokeny, Style Dictionary, Figma, Storybook i integracja konsumentów  
Wspólni konsumenci color core: `wyborek-crm` (Angular) i `votey-user-app` (React/PWA)
Konsumenci osobnych semantic colors: CRM oraz PWA
Jedyny konsument spacingu, typografii i scalingu w tej iteracji: `wyborek-crm`

## Jak prowadzimy ten dokument

- Zadanie niezaczęte: `- [ ]`.
- Zadanie zakończone i zweryfikowane: `- [x]`.
- Nie oznaczamy zadania jako wykonane tylko dlatego, że kod został napisany — musi przejść walidację wskazaną w danym etapie.
- Po każdym etapie uzupełniamy sekcję **Notatki po etapie**: datę, wynik, decyzje, dowody i dalsze zadania.
- Jeżeli w trakcie pracy zmieni się zakres, aktualizujemy najpierw ten dokument, a dopiero potem implementację.
- Następny etap zaczynamy po spełnieniu bramki zakończenia poprzedniego etapu albo po zapisaniu jawnej decyzji o wyjątku.

## Ustalony zakres i architektura po warsztacie

- Wspólną warstwą obu produktów są wyłącznie core color tokens.
- Semantic colors są rozdzielone produktowo na cztery token sety: `PWA-light`, `PWA-dark`, `CRM-light` i `CRM-dark`.
- PWA i CRM mogą mieć podobnie nazwane role, ale nie współdzielą semantic source ani nie referują semantic tokenów drugiego produktu.
- Obecne semantic colors Reacta stają się warstwą PWA i muszą zachować kompatybilność `votey-user-app`.
- CRM otrzymuje własny kontrakt semantic colors projektowany na podstawie audytu CRM i Figmy, bez dopasowywania go na siłę do semantyki PWA.
- Nowe tokeny spacingu i typografii będą na razie używane wyłącznie w CRM.
- Scaling zainspirowany `angular-design-system` wdrażamy najpierw dla CRM.
- React zachowuje obecne spacing, typografię i scaling `rv-*`. Nie migrujemy ich w tym projekcie.
- Tokens Studio pozostaje pośrednikiem w przepływie Figma → token JSON/MR → repo Design Systemu. Nie odpinamy istniejącego workflow.
- Po review i merge repozytorium jest wersjonowanym wejściem do Style Dictionary oraz źródłem publikowanych artefaktów; nie edytujemy wygenerowanego `dist` ręcznie.
- CRM docelowo nie przechowuje własnych plików będących źródłem tokenów.
- CRM importuje do buildu jeden wygenerowany plik CSS z paczki Design Systemu, przed `src/styles.scss`.
- `src/styles/colors.scss` w CRM ma zostać usunięty po zakończeniu migracji.
- Core color tokens pozostają wspólne i nieprzezroczyste; kanał alpha jest składany dopiero w semantic tokenach danego produktu. Ewentualny Number używany w recipe opacity jest detalem authoringu/pipeline’u, a nie wspólnym niekolorystycznym API PWA i CRM.
- Semantic alpha colors są nazywane według roli w obrębie produktu (`shadow`, `overlay`, `border`, `surface`), a nie według procentu opacity.
- Lokalne definicje tokenów spacingu i typografii w CRM także mają zostać usunięte. Nietokenowe style aplikacyjne mogą pozostać.
- Ikony, ilustracje, pozostałe SVG i komponenty UI są poza zakresem.

## Checklista główna

- [x] Etap 0 — zamrożenie stanu wyjściowego i decyzje
- [ ] Etap 1 — kontrakt tokenów i pipeline Style Dictionary
- [ ] Etap 2 — audyt i mapowanie Figmy
- [ ] Etap 3 — wspólny color core i osobne semantic PWA/CRM
- [ ] Etap 4 — pojedynczy CSS Design Systemu w buildzie CRM
- [ ] Etap 5 — tokeny spacingu dla CRM
- [ ] Etap 6 — tokeny typografii dla CRM
- [ ] Etap 7 — scaling system dla CRM
- [ ] Etap 8 — usunięcie lokalnych tokenów i aliasów z CRM
- [ ] Etap 9 — Storybook, testy konsumentów i publikacja

---

## Priorytet wykonawczy — najpierw działający pipeline Design System → CRM

Ta ścieżka jest bieżącym priorytetem i ma pierwszeństwo przed dodatkami z dalszych etapów. Szczegółowe etapy poniżej pozostają rejestrem całego projektu, ale nie blokują pierwszego używalnego przepływu.

### Definicja pierwszego używalnego pipeline’u

```text
Tokens Studio / zmergowane JSON-y
  → build target Angular w Design Systemie
  → dist/css/tokens.angular.css
  → paczka @pleodigital/design-system-votey
  → angular.json w wyborek-crm
  → build CRM
  → pilotażowe użycie tokenu w CRM
```

### Checklista ścieżki krytycznej

- [x] Zaimportowane JSON-y są zmergowane; istniejące źródła i artefakty PWA nie zostały zmienione przez import ani przez target Angular.
- [x] Dodać izolowany target `npm run build:tokens:angular`, który nie regeneruje artefaktów PWA.
- [x] Generować `dist/css/tokens.angular.css` ze wspólnych core colors i `tokens/color/semantic-CRM/Light.json`.
- [x] Dodać do tego samego pliku bezpieczne tokeny niewymagające responsive runtime: fixed spacing oraz core/semantic radius.
- [x] Zachować aliasy semantic color/radius jako referencje `var(--core-token)`, a wartości fizyczne publikować z jednostką `px`.
- [x] Dodać test deterministyczności targetu Angular i izolacji od semantic PWA; 19/19 testów tokenów przechodzi.
- [x] Potwierdzić przez `npm pack`, że `tokens.angular.css` trafia do publikowanej paczki.
- [x] Dodać import paczki w obu tablicach `styles` w `wyborek-crm/angular.json`, przed `src/styles.scss`.
- [x] Zainstalować lokalnie spakowaną paczkę i potwierdzić, że Angular rozwiązuje ścieżkę `tokens.angular.css`.
- [ ] Doprowadzić build development i production CRM do stanu PASS. Obecnie integracja CSS jest rozwiązywana poprawnie, ale build development zatrzymują zastane błędy typów/template type-checkingu niezwiązane z tokenami.
- [x] Znormalizować importowane tokeny typography i responsive spacing do zatwierdzonego kontraktu CSS (`px`, numeryczne font weights, `--typo-*`, `--space-*`).
- [x] Przenieść mechanikę responsive scalingu z `angular-design-system` 1:1 i zasilić ją sześcioma trybami zaimportowanymi do repo.
- [x] Dołączyć wynik responsive spacing/typography do tego samego `tokens.angular.css` i rozszerzyć test deterministyczności.
- [x] Dodać w warstwie Angular runtime ustawiający `body[data-device="mobile|tablet|desktop"]`: `VoteyDeviceService` jest publikowany z izolowanego wejścia `@pleodigital/design-system-votey/angular`, ustawia również orientację i `--vh` oraz reaguje na resize. Pozostaje podłączyć provider w CRM.
- [ ] Wybrać jedno małe użycie CRM i zastąpić lokalny token docelowym semantic/fixed tokenem z paczki jako proof of consumption.
- [ ] Po przejściu buildów i pilotażu uznać podstawowy pipeline za zamknięty.

### Dodatki realizowane dopiero po ścieżce krytycznej

- CRM dark mode;
- pełny adapter deprecated `--app-color-*` i masowa migracja;
- manifesty, dalsza rozbudowa dokumentacji Storybooka (podstawowe widoki tokenów i assetów są już gotowe);
- porządki nazw/rename w PWA;
- pełny audyt Figmy niewymagany przez zmergowane źródła;
- kompletne schema validation i pozostałe hardening checks wykraczające poza test pierwszego artefaktu.

### Stan po pierwszym vertical slice — 2026-07-22

- `tokens.angular.css` zawiera 193 unikalne custom properties: wcześniejsze 111 oraz 11 semantic responsive spacing, 70 właściwości 14 grup typografii i `--font-family-open-sans`. Wartości responsive są powtarzane w regułach dla 6 breakpointów × 3 device contexts.
- `npm run build:tokens:angular` i `npm run test:tokens` przechodzą.
- Lokalny tarball zawiera nowy CSS; Angular przestał zgłaszać błąd rozwiązania importu po instalacji tarballa.
- Silnik responsive jest kompilowany przez Sass z mechaniki skopiowanej z `angular-design-system`; mapy wartości powstają automatycznie z sześciu plików `tokens/space/semantic/*` oraz `tokens/type/semantic/*`.
- Design System zawiera już Angular runtime ustawiający `data-device`; następnym krokiem ścieżki krytycznej jest podłączenie `provideVoteyDeviceDetection()` w CRM przed pilotażowym użyciem `--space-*` i `--typo-*`.
- Build CRM nie jest jeszcze zielony z powodów niezależnych od tokenów. Przykładowe zastane błędy: niezgodne typy eventów w `add-event-view`, `agenda-logo-cropper` i uploadach CSV oraz niezgodne modele wejściowe komponentów wyników/selectów.
- Lokalne `src/styles/colors.scss` pozostaje bez zmian i nadal zabezpiecza istniejący CRM; na tym kroku niczego nie usuwamy.

### Podsumowanie prac wykonanych dzisiaj — 2026-07-22

- Build tokenów CRM jest działający: `build:tokens:angular` generuje jeden `dist/css/tokens.angular.css` zawierający wspólne core colors, CRM semantic light, fixed/responsive spacing, radius i responsive typography. Output ma 193 unikalne custom properties.
- Mechanika `ds-responsive-tokens.scss` została przeniesiona 1:1 z `angular-design-system`; wartości pochodzą z sześciu trybów Votey, a mnożniki urządzeń pozostają utrzymywane w SCSS.
- Dodano izolowane, opcjonalne wejście Angular Package Format `@pleodigital/design-system-votey/angular`, aby kod Angulara nie trafiał do aplikacji React. Publikuje ono `VoteyDeviceService` i `provideVoteyDeviceDetection()`.
- Runtime biblioteki rozpoznaje mobile/tablet/desktop, orientację, aktualizuje `body[data-device]`, `body[data-orientation]` i `--vh` oraz reaguje na resize. Provider nie został jeszcze podłączony w `wyborek-crm`.
- Storybook uporządkowano w grupy `CRM Tokens`, `PWA Tokens` i `Assets`. Powstały spójne karty dla wspólnych core colors, semantic CRM light, semantic PWA light/dark, core/semantic radius, responsive spacing i typografii oraz bibliotek ikon i ilustracji.
- Widok responsive pokazuje sześć viewportów, ręczny wybór urządzenia, bieżący kontrakt DOM, formułę `calc(...)`, rozwiązaną wartość w `px` i aktualne mnożniki mobile/tablet/desktop odczytywane bezpośrednio z pliku SCSS.
- PWA semantic colors mają działający przełącznik light/dark. CRM dark nie jest jeszcze częścią outputu Angular ani dokumentacji Storybooka.
- Ujednolicono nagłówki i typografię kart Storybooka wspólnym komponentem prezentacyjnym; sekcja kolorów została usunięta z karty responsive, ponieważ ma osobne stories.
- Weryfikacja: `npm run build:angular` PASS, `npm run test:tokens` 19/19 PASS, produkcyjny build Storybooka PASS, a `npm pack --dry-run` potwierdza obecność CSS i wejścia Angular w paczce.
- Najbliższa ścieżka krytyczna: zainstalować aktualny tarball w CRM, zarejestrować `provideVoteyDeviceDetection()`, sprawdzić computed styles na reprezentatywnych szerokościach, wykonać mały pilotaż migracji i dopiero po zielonych buildach opublikować wersję.

---

## Etap 0 — zamrożenie stanu wyjściowego i decyzje

Cel: zapisać obecny kontrakt, aby późniejsze zmiany były mierzalne i bezpieczne.

### Checklista

- [x] Zapisać aktualną wersję `@pleodigital/design-system-votey` używaną przez React i CRM.
- [x] Zapisać aktualny stan zmian Git we wszystkich trzech repozytoriach, aby nie nadpisać cudzej pracy.
- [x] Wygenerować manifest obecnych zmiennych CSS, nazw Tailwind i plików publikowanych w paczce.
- [x] Porównać źródłowe JSON-y tokenów z aktualnym `dist`.
- [x] Zapisać różnice light/dark i brakujące tokeny.
- [x] Zapisać użycia tokenów w React jako kontrakt chroniony przed regresją.
- [x] Zinwentaryzować w CRM:
  - [x] definicje `--color-*`;
  - [x] definicje i użycia `--app-color-*`;
  - [x] wartości spacingu;
  - [x] style i wartości typograficzne;
  - [x] breakpointy i istniejące mechanizmy skalowania.
- [x] Przygotować tabelę: lokalny token CRM → obecny token Design Systemu → brakujący token.
- [x] Zatwierdzić przepływ kolorów: Figma → Tokens Studio → automatyczny merge request; po review i merge pliki tokenów w repo Design Systemu są wejściem builda i publikowanego kontraktu.
- [x] Zatwierdzić po warsztacie wspólną warstwę core colors oraz oddzielne semantic token sety `PWA-light`, `PWA-dark`, `CRM-light`, `CRM-dark`.
- [x] Potwierdzić po warsztacie, że wszystkie tokeny inne niż color są w tej iteracji przeznaczone wyłącznie dla CRM.
- [x] Zdecydować o foncie CRM dla pierwszej iteracji: pozostaje Open Sans; podłączenie tokenów typografii nie zmienia rodziny fontu.
- [x] Umieścić przejściowe aliasy `--app-color-*` w publikowanym adapterze CRM/Angular paczki Design Systemu, poza wspólnym core i źródłowym zbiorem `CRM-*`; aliasy mają wskazywać na docelowe CRM semantic tokens, być deprecated i zostać usunięte po migracji ostatniego użycia.
- [x] Publikować pojedynczy CSS dla CRM pod ścieżką `dist/css/tokens.angular.css`.
- [x] Ustalić politykę SemVer, deprecacji i minimalny czas utrzymywania aliasów: patch dla zmian bez wpływu na publiczny kontrakt, minor dla kompatybilnych rozszerzeń, major dla usunięć/zmian łamiących kontrakt; alias pozostaje do zera użyć w CRM i przez jedno kolejne wydanie minor.

### Bramka zakończenia

- [x] Mamy zapisany baseline Reacta, CRM i paczki.
- [x] Wszystkie decyzje blokujące format artefaktów są podjęte albo oznaczone jako jawny blocker.
- [x] Nie rozpoczęliśmy jeszcze migracji konsumentów.

### Notatki po etapie

- Data: 2026-07-22 — wykonano punkty 1–8 etapu 0.
- Wynik:

  **Baseline wersji paczki**

  | Repozytorium | Deklaracja w `package.json` | Wersja w lockfile | Wersja w `node_modules` |
  |---|---:|---:|---:|
  | `design-system-votey` | wersja paczki `1.0.136` | nie dotyczy | nie dotyczy |
  | `votey-user-app` | `^1.0.136` | `1.0.136` | brak lokalnej instalacji `node_modules` |
  | `wyborek-crm` | `^1.0.136` | `1.0.136` | `1.0.136` |

  W CRM wpis zależności `@pleodigital/design-system-votey` oraz odpowiadający mu wpis lockfile są częścią niezacommitowanych zmian obecnych przed rozpoczęciem naszych prac.

  **Baseline Git przed aktualizacją tej checklisty**

  | Repozytorium | Branch | Commit | Stan working tree |
  |---|---|---|---|
  | `design-system-votey` | `WYBOREK-2915` | `dd614ce7371765222e13879e6798e0fae38e04d1` | clean |
  | `votey-user-app` | `main` | `2cb65c668a91d25e4b1a1fe61cfacea248068846` | clean |
  | `wyborek-crm` | `test` | `dfc969e217bb5b2ff9c75205c20c6117e966cc3b` | modified: `package.json`, `package-lock.json` |

- Podjęte decyzje: Tokens Studio pozostaje pośrednikiem pomiędzy Figmą a repo; mapowanie kolorów musi rozdzielać wspólny core od semantic PWA/CRM; spacing, typografia i scaling są oznaczane jako CRM-only.
  - Zachowujemy workflow Figma → Tokens Studio → automatycznie utworzony merge request → review i merge do repo → Style Dictionary → artefakty paczki. Tokens Studio jest pośrednikiem dla obu produktów, a zmiana w Figmie nie staje się kontraktem aplikacji bez przejścia przez merge request.
  - Wspólna dla PWA i CRM jest wyłącznie warstwa core colors. Semantic colors są rozdzielone na `PWA-light`, `PWA-dark`, `CRM-light` i `CRM-dark`.
  - Spacing, typografia, opacity foundations używane poza color recipes oraz scaling są w tej iteracji kontraktem CRM; PWA nie jest do nich podłączane.
  - W pierwszej iteracji CRM pozostaje przy Open Sans.
  - Przejściowe aliasy `--app-color-*` będą generowane w adapterze CRM/Angular publikowanym przez paczkę, a nie utrzymywane lokalnie w CRM ani dodawane do wspólnego core lub semantic source CRM/PWA.
  - Pojedynczym publicznym entry pointem tokenów dla CRM będzie `dist/css/tokens.angular.css`.
  - Podczas migracji każde napotkane użycie aliasu, np. `--app-color-background`, zastępujemy bezpośrednio zatwierdzonym CRM semantic tokenem, np. `--color-surface-primary` z `CRM-light`/`CRM-dark`. Aliasy zabezpieczają wyłącznie jeszcze niezmigrowany kod i nie są stanem pośrednim dla migrowanego ani nowego kodu.
  - Polityka wydań: patch obejmuje zmiany bez wpływu na publiczny kontrakt; minor — kompatybilne rozszerzenia, takie jak nowe tokeny lub artefakty; major — usunięcia, zmiany nazw, ścieżek albo inne zmiany łamiące kontrakt. Deprecation zapisujemy w changelogu, dokumentacji/Storybooku, manifeście i tabeli migracyjnej wraz z zamiennikiem.
  - Alias może zostać usunięty dopiero po osiągnięciu zera użyć w CRM i pozostawieniu go przez jeszcze jedno wydanie minor; jego usunięcie jest zmianą major.
- Dowody / raporty / linki: odczyt `package.json`, wpisów `package-lock.json`, zainstalowanej paczki oraz `git branch`, `git rev-parse HEAD` i `git status --short` dla trzech repozytoriów.
- Manifest publicznego API: [token-public-api-manifest-v1.0.136.md](./token-public-api-manifest-v1.0.136.md) — 87 zmiennych CSS/Tailwind, sześć tokenowych artefaktów CSS/SCSS i 177 wpisów paczki npm.
- Raport zgodności źródło → `dist`: [token-source-dist-parity-v1.0.136.md](./token-source-dist-parity-v1.0.136.md) — brakuje 7 primitives, 150 light semantic i 151 dark semantic; wykryto jedną niezgodną wartość wspólnej nazwy oraz pięć różnic strukturalnych light/dark.
- Baseline Reacta: [react-token-usage-baseline-v1.0.136.md](./react-token-usage-baseline-v1.0.136.md) — 76 używanych nazw publikowanych oraz 142 używane nazwy obecne w źródłach, ale brakujące w `dist`.
- Inwentaryzacja CRM: [crm-token-inventory.md](./crm-token-inventory.md) — kolory, 1650 deklaracji spacingu, typografia, 310 media queries i zastane mechanizmy skalowania.
- Tabela mapowania CRM → DS: [crm-color-token-mapping.md](./crm-color-token-mapping.md) — komplet 100 primitives i 110 aliasów aplikacyjnych wraz z użyciami, exact-value candidates i statusem decyzji.
- Punkty 7–8 etapu 0 są zamknięte: inwentaryzacja jest kompletna, a tabela mapowania rozdziela decyzje zaakceptowane, exact/automatyczne, implementacyjne i jawnie odłożone do etapów Figma/semantic. `D-COLOR-01` zamknięto mapowaniem `#f4f9ff` → `blue-25`; `D-COLOR-02` mapowaniem `#e0eefc` → `blue-70`.
- Otwarte problemy: przed kolejnymi zmianami w zależnościach CRM zachować istniejące modyfikacje `package.json` i `package-lock.json`; nie traktować ich jako zmian wykonanych w ramach dalszych etapów. `package.json#main` Design Systemu wskazuje nieistniejący `dist/js/tailwind-preset.js`; naprawa należy do etapu 1. `dist` jest znacząco niezgodny ze źródłami, a rebuild zmieni wartość używanego przez React tokenu `button-background-inactive`; wymaga to osobnej akceptacji i regresji.
- Zadania przeniesione dalej:
  - **Etap 1:** naprawić niespójność źródła z `dist`, brakujący `dist/js/tailwind-preset.js` wskazany przez `package.json#main` oraz zabezpieczyć publiczny kontrakt testami, zgodnie z przyjętą polityką SemVer.
  - **Etap 1/3:** przed pierwszym pełnym rebuildem rozstrzygnąć zmianę wartości używanego przez React tokenu `button-background-inactive`; nie publikować jej bez akceptacji i regresji konsumenta React.
  - **Etap 1:** uaktualnić kontrakt i testy pipeline’u do struktury: wspólny core + cztery produktowe token sety semantic. Wcześniejsze decyzje zakładające wspólną semantic identity są zastąpione wynikiem warsztatu.
  - **Etap 2:** wykonać pełną inwentaryzację Tokens Studio i natywnych Figma Variables/styles oraz przygotować mapowanie Figma → Tokens Studio → token repo → produktowy CSS custom property.
  - **Etap 3:** przez Figma/Tokens Studio dodać zaakceptowane wspólne core colors `color/yellow-25: #fffcf1` i `color/yellow-50: #fff5e1`; zachować obecny kontrakt Reacta jako `PWA-light`/`PWA-dark`; zaprojektować osobne `CRM-light`/`CRM-dark`, w tym CRM opacity/shadow/overlay.
  - **Etap 4:** wygenerować i opublikować `dist/css/tokens.angular.css`; umieścić przejściowe `--app-color-*` wyłącznie w adapterze CRM/Angular jako deprecated referencje do docelowych tokenów semantic.
  - **Etapy 5–7:** dodać spacing, typografię z Open Sans i scaling przeznaczone na razie wyłącznie dla CRM; nie zmieniać spacingu, typografii ani `rv-*` w React.
  - **Etap 8:** w każdym migrowanym miejscu CRM zastępować `--app-color-*` bezpośrednio tokenem semantic, a po osiągnięciu zera użyć usunąć lokalne źródła tokenów; aliasy w paczce wygasić zgodnie z ustalonym okresem deprecacji.
  - **Przez kolejne etapy:** zachować zastane, niezacommitowane modyfikacje `wyborek-crm/package.json` i `package-lock.json` oraz nie przypisywać ich do prac migracyjnych bez osobnej weryfikacji.

---

## Etap 1 — kontrakt tokenów i pipeline Style Dictionary

Cel: zbudować deterministyczne źródło tokenów i generator obsługujący wszystkie potrzebne kategorie.

Panel decyzji etapu: [stage-1-token-contract-decisions.md](./stage-1-token-contract-decisions.md)

### Checklista

- [x] Zdefiniować warstwy tokenów:
  - [x] wspólne primitives/core colors;
  - [x] produktowe semantic colors: `PWA-light`, `PWA-dark`, `CRM-light`, `CRM-dark`;
  - [x] tokeny spacingu, typografii i scalingu tylko dla CRM;
  - [x] osobne artefakty konsumenckie PWA i CRM.
- [ ] Zaktualizować panel [stage-1-token-contract-decisions.md](./stage-1-token-contract-decisions.md), ponieważ decyzje zakładające wspólną semantic identity zostały zastąpione wynikiem warsztatu.
- [x] Ustalić docelowe nazwy plików źródłowych i selektory/outputy dla PWA oraz CRM, zachowując kompatybilność obecnych importów Reacta: PWA pozostaje w `tokens/light.json` i `tokens/dark.json`, CRM używa `tokens/color/semantic-CRM/Light.json`, a pierwszym outputem CRM jest light-only `dist/css/tokens.angular.css` pod `:root`.
- [x] Zatwierdzić konwencję nazw niezależną od Angulara, Reacta i konkretnych wartości.
- [x] Zatwierdzić typy oraz jednostki dla color, dimension, font family, font weight, font size, line height i letter spacing.
- [x] Zdefiniować foundation opacity i sposób składania semantic colors z opaque core + opacity.
  - [ ] Po warsztacie doprecyzować ownership opacity recipes: nie publikować opacity jako wspólnego API PWA/CRM; publiczne tokeny niekolorystyczne pozostają CRM-only.
- [x] Dodać walidację zabraniającą wartości alpha w core color tokens.
  - [x] Wdrożyć podstawowy guard po zatwierdzeniu punktu 4, przed pierwszym nowym semantic alpha tokenem i migracją przezroczystości CRM.
  - [x] Uruchamiać guard przed Style Dictionary lokalnie oraz w CI/MR z workflow Figma/Tokens Studio.
  - [ ] Po decyzji punktu 6 rozszerzyć walidację o schema semantic alpha recipe.
- [x] Ustalić reprezentację kompozycji core + opacity w Tokens Studio i Style Dictionary.
  - [x] Zaktualizować toolchain do Style Dictionary `5.5.0` i `@tokens-studio/sd-transforms` `2.0.3`, zachowując zgodność istniejących nazw i wartości outputu.
  - [x] Zatwierdzić canonical formułę Tokens Studio oraz resolved RGBA w CSS.
  - [x] Potwierdzić kontrolny round-trip Tokens Studio → GitHub MR → pull bez spłaszczenia referencji.
  - [x] Zrezygnować z eksportu testu do native Figma Variables; po warsztacie Tokens Studio pozostaje pośrednikiem i taki eksport nie jest bramką pipeline’u.
  - [ ] Zapisać raport z wykonanego round-trip i usunąć tymczasowe tokeny/MR.
- [x] Zdecydować, czy publikujemy tylko semantic shadow colors, czy również tokeny całej elewacji: color + offset + blur + spread.
  - [x] Decyzja: w pierwszej iteracji publikujemy wyłącznie semantic shadow colors; nie tworzymy tokenów całej elewacji.
- [ ] Zdefiniować zasady referencji i zakaz cykli.
  - [ ] Zatwierdzić propozycje 8A–8H z pliku decyzji etapu 1.
- [ ] Uogólnić filtry Style Dictionary, które obecnie rozpoznają głównie `color.*`.
- [x] Rozdzielić generowanie źródeł od adapterów konsumenckich: builder ma izolowane targety `angular` i `legacy`; target Angular nie regeneruje PWA.
- [ ] Zapewnić deterministyczny build source → dist.
  - [x] Target Angular jest deterministyczny w dwóch kolejnych buildach.
  - [ ] Domknąć deterministyczność oraz source → dist dla legacy PWA bez zmiany chronionego kontraktu.
- [ ] Dodać walidację schema tokenów.
- [ ] Dodać test brakujących i cyklicznych referencji.
- [ ] Dodać osobne testy identycznego zestawu ścieżek w parach `PWA-light` ↔ `PWA-dark` oraz `CRM-light` ↔ `CRM-dark`; nie porównywać kontraktu PWA z CRM.
- [ ] Dodać osobne manifesty publicznego API PWA i CRM oraz wspólny manifest core colors.
- [ ] Sprawdzić i poprawić publikowanie wszystkich wymaganych plików w `package.json`.
  - [x] `npm pack` zawiera `dist/css/tokens.angular.css` dzięki istniejącemu wpisowi `files: ["dist"]`.
  - [ ] Naprawić niezależny, zastany `package.json#main` wskazujący nieistniejący plik.
- [x] Udokumentować lokalne komendy build/test dla tokenów w `README.md`.

### Jak zamknąć punkt 6 — round-trip Tokens Studio krok po kroku

Cel testu: potwierdzić na rzeczywistym workflow, że formuła semantic alpha color zachowuje dwie referencje w przepływie Tokens Studio → GitHub MR → pull. Po decyzji warsztatowej eksport do native Figma Variables nie należy do testu ani do bramki zamknięcia.

#### 1. Przygotować test w obecnym Tokens Studio

- [x] Pracować w obecnym pliku Figma i istniejącej konfiguracji Tokens Studio — bez osobnego sandboxa.
- [x] Utworzyć tymczasowe tokeny możliwe do jednoznacznego wskazania i późniejszego usunięcia: `test-opacity-8` oraz `color.seethrough.navy`.
- [x] Standardowy workflow pluginu utworzył MR zamiast zapisywać zmianę bezpośrednio do `main`.

Odpowiedzialność: designer wykonujący test w Tokens Studio.

#### 2. Utworzyć tymczasowe tokeny kontrolne w Tokens Studio

W istniejącym token secie utworzono jeden tymczasowy semantic color oraz tymczasową opacity:

| Token | Typ | Wartość |
|---|---|---|
| `test-opacity-8` | `number` | `0.08` |
| `color.seethrough.navy` — light | `color` | `rgba({color.navy-blue-200}, {test-opacity-8})` |
| `color.seethrough.navy` — dark | `color` | `rgba({color.mint-green-600}, {test-opacity-8})` |

Tokeny są wyłącznie testowe i po zapisaniu dowodów zostaną usunięte. Zachowanie kanałów RGB przy alpha `0` zostało już potwierdzone lokalnym spike’em i nie wymaga drugiego testowego koloru w pluginie.

- [x] Utworzyć `test-opacity-8` jako unitless `number`, nie jako token typu `opacity`.
- [x] Utworzyć semantic color w light i dark z referencją do core color oraz `test-opacity-8`.
- [x] Potwierdzić w podglądzie Tokens Studio prawidłowe resolved color z alpha `0.08`.

#### 3. Wysłać zmianę z Tokens Studio do repo

- [x] Wykonać push/sync standardową ścieżką używaną przez zespół React; plugin utworzył merge request.
- [x] Nie poprawiać wygenerowanego JSON-u ręcznie przed weryfikacją — zweryfikowano serializację pluginu ze screenshota diffu.
- [ ] Zapisać link do MR w raporcie punktu 6.

#### 4. Sprawdzić canonical JSON w merge requeście

W diffie MR muszą pozostać:

- [x] typ semantic tokenu jest równy `color`;
- [x] `test-opacity-8` ma typ `number` i unitless wartość `0.08` (w obecnym formacie Tokens Studio serializowaną jako string);
- [x] formuły zawierają obie referencje, a nie spłaszczony HEX/RGBA;
- [x] core color tokens nie otrzymały alpha HEX ani `rgba()`;
- [x] diff obejmuje tymczasowy `test-opacity-8`, semantic `color.seethrough.navy` w light/dark oraz metadane workflow.

Kryterium PASS dla przykładowej formuły:

```text
rgba({color.navy-blue-200}, {test-opacity-8})
```

Kryterium FAIL: plugin zapisuje wyłącznie resolved RGBA/alpha HEX albo usuwa jedną z referencji. Na sprawdzonym diffie kryterium ma wynik **PASS**.

Odpowiedzialność: przegląd diffu po stronie repo/Design System.

#### 5. Wykonać pull z GitHub z powrotem do Tokens Studio

- [x] W obecnym pliku Figma pobrać tokeny z gałęzi utworzonej przez standardowy workflow pluginu.
- [x] Po pullu otworzyć `color.seethrough.navy` i potwierdzić, że nadal pokazuje formułę z referencją do core oraz `test-opacity-8`.
- [x] Potwierdzić resolved preview po pullu: light rozwiązuje się do `rgba(#5250DF, 0.08)` bez ręcznej zmiany formuły.

Kryterium PASS: push → GitHub → pull nie spłaszcza ani nie zrywa referencji. **PASS — potwierdzone screenshotem po pullu 2026-07-22.**

#### 6. Zakończyć test bez eksportu do native Figma Variables

- [x] Zatrzymać się przed eksportem do native Variables, aby nie modyfikować niepotrzebnie biblioteki Figma.
- [x] Zapisać decyzję warsztatową: dla pipeline’u tokenów pozostaje przepływ Figma → Tokens Studio → MR → repo; native Variables nie zastępują Tokens Studio jako źródło kolorów.
- [x] Uznać poprawny resolved preview w Tokens Studio oraz zachowane referencje po pullu za wystarczający dowód techniczny punktu 6.

#### 7. Zapisać dowody w raporcie

- [ ] Utworzyć `.tmp/point-6-tokens-studio-roundtrip-report.md`.
- [ ] Zapisać datę, osobę wykonującą test, nazwę gałęzi utworzonej przez plugin i link do MR.
- [ ] Wkleić fragment canonical JSON semantic tokenu po push oraz po pull.
- [ ] Zapisać resolved preview z Tokens Studio oraz wynik PASS/FAIL push/pull.
- [ ] Dołączyć screenshot diffu MR i screenshot tokenu po pullu, jeżeli są dostępne.
- [ ] Po sprzątnięciu jawnie potwierdzić, że `test-opacity-8` i `color.seethrough.navy` nie pozostały w Tokens Studio i nic nie zostało zmergowane do `main`.

#### 8. Posprzątać test i zamknąć punkt

- [ ] Po zebraniu dowodów usunąć `color.seethrough.navy` oraz `test-opacity-8`.
- [ ] Zamknąć testowy MR bez mergowania do `main` i usunąć jego gałąź, jeżeli workflow jej automatycznie nie sprząta.
- [ ] W `stage-1-token-contract-decisions.md` oznaczyć round-trip i raport jako zakończone.
- [ ] W tym planie oznaczyć kontrolny round-trip jako zakończony.
- [ ] Zamknąć punkt 6. Implementację produkcyjnych recipe, filtra builda, manifestu i schema validatora realizować w kolejnych zadaniach pipeline’u.

#### Warunek zamknięcia punktu 6

Punkt można zamknąć, gdy wszystkie trzy warunki mają wynik PASS:

1. canonical JSON po round-trip zachowuje core reference i opacity reference;
2. Tokens Studio po pullu poprawnie rozwiązuje semantic color z alpha;
3. raport zawiera dowody, a testowe tokeny zostały usunięte bez mergowania do `main`.

### Bramka zakończenia

- [ ] Dwa kolejne buildy z tego samego źródła dają identyczne artefakty.
- [ ] `dist` jest zgodny ze źródłami.
- [ ] Usunięcie publicznego tokenu powoduje kontrolowany błąd testu.
- [ ] Pipeline generuje wspólny color core oraz osobne, izolowane artefakty semantic PWA i CRM.
- [ ] Manifesty i testy light/dark działają osobno dla PWA i CRM.
- [ ] Pipeline jest gotowy na color, spacing, typography i scaling.

### Notatki po etapie

- Data: 2026-07-22 — zamknięto punkty 1–5 etapu 1; lokalny spike punktu 6 zakończono i przygotowano decyzje 6A–6E.
- Wynik: zatwierdzono canonical formułę Tokens Studio `rgba({core-color}, {opacity-number})`, resolved RGBA dla CSS oraz zmodernizowano toolchain do Style Dictionary `5.5.0` i `@tokens-studio/sd-transforms` `2.0.3`. Testowy push → MR → pull zachował obie referencje i poprawny resolved preview. Eksport do native Variables został świadomie zatrzymany po decyzji o pozostawieniu Tokens Studio jako pośrednika.
- Podjęte decyzje: warsztat zastąpił wcześniejsze założenie wspólnej semantic identity modelem wspólny color core + osobne `PWA-light`, `PWA-dark`, `CRM-light`, `CRM-dark`. Panel [stage-1-token-contract-decisions.md](./stage-1-token-contract-decisions.md) wymaga osobnej aktualizacji przed implementacją.
- Dowody / raporty / linki: porównanie obecnych źródeł i artefaktów Votey, importów Reacta, planowanego adaptera CRM oraz strukturalnego wzorca `angular-design-system`; pełny odczyt Variables i Tokens Studio opisano w [figma-variable-naming-audit.md](./figma-variable-naming-audit.md).
- Otwarte problemy: trzeba zapisać raport i posprzątać testowy MR/tokeny; obecny filtr builda nadal pomija recipe `rgba(...)`. Należy też rozdzielić istniejące źródła semantic na PWA/CRM, ustalić outputy i selektory obu produktów, wdrożyć stałe manifesty oraz test deterministyczności. Ponadto 18 opaque core HEX używa uppercase, nadal brak `codeSyntax` i precyzyjnych scope’ów.
- Zadania przeniesione dalej: przed zmianą istniejących nazw kolorów Reacta przygotować [react-color-token-renaming-map.md](./react-color-token-renaming-map.md) i przekazać ją zespołowi React do decyzji; wdrożenie zatwierdzonego kontraktu nastąpi dopiero w odpowiednich punktach implementacyjnych, bez bieżących zmian źródeł ani `dist`.

---

## Etap 2 — audyt i mapowanie Figmy

Cel: ustalić, które wartości i role pochodzą z Figmy oraz gdzie występują rozbieżności z kodem.

### Checklista

- [x] Potwierdzić działanie połączenia Figma MCP i uwierzytelnienie konta.
- [x] Potwierdzić dostęp do właściwego pliku/biblioteki Figma po otrzymaniu jego URL-a.
- [x] Potwierdzić read-only dostęp do danych Tokens Studio zapisanych w pliku Figma.
- [x] Przed bieżącym pre-checkiem użyć repozytoryjnego skilla `figma` i wykonać jego MCP Guard.
- [ ] Powtórzyć MCP Guard przed kolejną sesją operacji Figma, jeśli zmieni się sesja lub środowisko MCP.
- [ ] Zinwentaryzować collections, modes, variables, dane Tokens Studio i style typograficzne.
- [ ] Odczytać wartości spacingu, typografii, kolorów i breakpointów bez zgadywania ich ze screenshotów.
- [ ] Przygotować tabelę: Figma → Tokens Studio token/set → token repo → produktowy CSS custom property.
- [ ] Oznaczyć każde mapowanie jako:
  - [ ] exact;
  - [ ] alias;
  - [ ] missing;
  - [ ] product-specific;
  - [ ] wymagające decyzji projektowej.
- [ ] Dla kolorów rozdzielić klasyfikację na:
  - [ ] wspólne core colors;
  - [ ] `PWA-light` i `PWA-dark`;
  - [ ] `CRM-light` i `CRM-dark`.
- [ ] Walidować light/dark osobno w obrębie PWA i CRM; nie wymagać identycznych semantic paths pomiędzy produktami.
- [ ] Dla typografii zapisać pełny komplet: family, size, weight, line height i letter spacing oraz oznaczyć cały zakres jako CRM-only.
- [ ] Dla spacingu oddzielić wartości fixed od semantycznych/responsywnych i oznaczyć cały zakres jako CRM-only.
- [ ] Potwierdzić mapowanie typów i trybów przy przejściu z Figmy przez Tokens Studio do repo, szczególnie dla sześciu trybów responsive CRM.
- [ ] Potwierdzić w Tokens Studio/Figma, czy zaakceptowane kandydaty `color/yellow-25: #fffcf1` i `color/yellow-50: #fff5e1` są rzeczywiście brakujące i nie występują pod inną nazwą.
- [ ] Zatwierdzić listę tokenów, które trzeba dodać do Design Systemu.

### Bramka zakończenia

- [ ] Wszystkie wspólne core colors oraz tokeny planowane dla PWA/CRM mają potwierdzone źródło albo zapisaną decyzję o wyjątku.
- [ ] Każdy semantic color jest jednoznacznie przypisany do PWA albo CRM.
- [ ] Każdy token niekolorystyczny jest oznaczony jako CRM-only.
- [ ] Brakujące wartości nie są inferowane „na oko”.
- [ ] Tabela mapowania jest gotowa do aktualizowania przy kolejnych zmianach.

### Notatki po etapie

- Data: 2026-07-22 — pre-check połączenia, pliku i Tokens Studio.
- Wynik: konektor Figma działa; `whoami` zwróciło uwierzytelnione konto z pełnym dostępem do planów PLEO. Potwierdzono odczyt pliku `Wyborek | Design System` (`voF94kJ9mqgENbzJBuw2Iv`) oraz dostęp do danych Tokens Studio w namespace `tokens`. Dokument zawiera 15 współdzielonych kluczy Tokens Studio, w tym niechunkowane `values` i `themes`, oraz 8 lokalnych kolekcji obejmujących łącznie 211 natywnych Variables.
- Podjęte decyzje: Tokens Studio pozostaje pośrednikiem pomiędzy Figmą a repo; mapowanie kolorów musi rozdzielać wspólny core od semantic PWA/CRM; spacing, typografia i scaling są oznaczane jako CRM-only.
- Dowody / raporty / linki: poprawne wywołania read-only `whoami`, `get_metadata`, wyszukiwania variables/styles oraz Plugin API dla pliku [Wyborek | Design System](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=0-1); Tokens Studio udostępnia klucze `values_meta`, `values`, `themes_meta`, `themes` i konfigurację eksportu.
- Otwarte problemy: pełna inwentaryzacja musi zostać przefiltrowana ponownie według ownership PWA/CRM; native Variables nie zastępują workflow Tokens Studio, ale nadal wymagają mapowania dla CRM spacingu/typografii.
- Zadania przeniesione dalej: zinwentaryzować pełne wartości i aliasy Tokens Studio oraz natywne collections, modes, variables i styles; następnie przygotować mapowanie Figma → Tokens Studio → token repo → wspólny core lub produktowy kontrakt PWA/CRM.

---

## Etap 3 — wspólny color core i osobne semantic PWA/CRM

Cel: zbudować jedną, współdzieloną paletę core colors oraz dwa niezależne kontrakty semantic: PWA i CRM, każdy z własnym light/dark.

### Checklista

- [ ] Ustalić docelową strukturę źródeł/token setów: wspólny color core, `PWA-light`, `PWA-dark`, `CRM-light`, `CRM-dark`.
- [ ] Zapewnić, że semantic PWA i CRM referują wspólne core colors, nigdy semantic drugiego produktu. Pomocnicze Number używane w alpha recipe nie stają się wspólnym publicznym API konsumentów.
- [ ] Potwierdzić znaczenie wszystkich używanych semantic colors Reacta i przypisać je do warstwy PWA.
- [ ] Wyrównać zestaw semantic paths wyłącznie w parze `PWA-light` ↔ `PWA-dark`.
- [ ] Nie zmieniać istniejących nazw ani wartości Reacta bez osobnej, zaakceptowanej migracji.
- [ ] Przygotować zbiorczą mapę `obecny token/CSS → proponowany canonical token/CSS → użycia w votey-user-app → status decyzji` w `react-color-token-renaming-map.md`.
- [ ] Przekazać mapę zespołowi React i zapisać jego decyzję dla każdej proponowanej zmiany przed utworzeniem aliasu lub rename.
- [ ] Zweryfikować kolejność i zakres nadpisań `tokens.samsung.css`.
- [ ] Przejść przez tabelę `--app-color-*` z CRM i zaprojektować niezależny kontrakt `CRM-light`/`CRM-dark`.
- [ ] Wyrównać zestaw semantic paths wyłącznie w parze `CRM-light` ↔ `CRM-dark`; brak odpowiednika PWA nie jest błędem.
- [ ] Dodać przez Tokens Studio/Figma core token `color/yellow-25` o wartości `#fffcf1`, wygenerować merge request i po review scalić go do repo.
- [ ] Dodać przez Tokens Studio/Figma core token `color/yellow-50` o wartości `#fff5e1`, wygenerować merge request i po review scalić go do repo.
- [ ] Po buildzie potwierdzić obecność `--color-yellow-25: #fffcf1` i `--color-yellow-50: #fff5e1` we wspólnym core output oraz użyć ich w zaakceptowanych mapowaniach CRM.
- [ ] Sklasyfikować wszystkie przezroczyste kolory CRM:
  - [ ] 4 alpha hex primitives;
  - [ ] 65 wystąpień `rgba()` / 22 unikalne wartości;
  - [ ] 18 wystąpień `color-mix(... transparent)` / 10 unikalnych formuł;
  - [ ] rozdzielić role shadow, overlay, border, surface i gradient.
- [ ] Zdeduplikować powtarzające się cienie CRM i zaprojektować CRM semantic shadow colors, w tym robocze `color.shadow.soft` oraz `color.shadow.event-filter`.
- [ ] Zaprojektować CRM semantic overlay colors, w tym robocze `color.overlay.loader`, `color.overlay.loader-soft` i gradient accent overlay.
- [ ] Nie dodawać CRM shadow/overlay do `PWA-*`. PWA otrzymuje własny token tylko wtedy, gdy wynika to z potrzeb `votey-user-app` i osobnej decyzji zespołu PWA.
- [ ] Dla każdego `--app-color-*` wskazać:
  - [ ] istniejący odpowiednik w `CRM-light`/`CRM-dark`;
  - [ ] nowy potrzebny CRM semantic color;
  - [ ] wyjątek wyłącznie produktowy;
  - [ ] token nieużywany, przeznaczony do usunięcia.
- [ ] Dodać zaakceptowane brakujące core colors do wspólnego źródła, a semantic colors do właściwego produktu i trybu.
- [ ] Ustalić i wygenerować osobne artefakty: wspólny core, PWA light/dark/Tailwind oraz CRM light/dark/Angular CSS.
- [ ] Jeżeli migracja CRM nie będzie atomowa, wygenerować jawnie deprecated aliasy `--app-color-*` po stronie paczki.
- [ ] Dodać testy pokrycia mapowania CRM.
- [ ] Dodać test zakazujący referencji `PWA semantic → CRM semantic` i `CRM semantic → PWA semantic`.
- [ ] Dodać test parytetu nazw osobno dla PWA light/dark i CRM light/dark.
- [ ] Dodać/uzupełnić dokumentację kolorów w Storybooku.
  - [x] Wspólne core colors.
  - [x] Semantic colors PWA light/dark z przełącznikiem trybu.
  - [x] Semantic colors CRM light.
  - [ ] Semantic colors CRM dark po dołączeniu ich do artefaktu Angular.
  - [ ] Semantic shadow/overlay colors po zaprojektowaniu kontraktu.
- [ ] Uruchomić regresję kolorów w React.

### Bramka zakończenia

- [ ] Wszystkie wspólne core colors są używalne przez oba produkty i nie zawierają ról produktowych.
- [ ] Każdy używany token kolorystyczny CRM ma odpowiednik w `CRM-*` albo udokumentowany wyjątek.
- [ ] `PWA-light` i `PWA-dark` mają zgodny kontrakt między sobą.
- [ ] `CRM-light` i `CRM-dark` mają zgodny kontrakt między sobą.
- [ ] PWA i CRM nie zależą od semantic source drugiego produktu.
- [ ] React nie ma niezamierzonych zmian wizualnych.
- [ ] CRM nie potrzebuje już ręcznie rozwijanej lokalnej palety.

### Notatki po etapie

- Data: 2026-07-22 — zaktualizowano zakres po warsztacie React + Angular + Design i uruchomiono pierwszy produkcyjny vertical slice dla CRM.
- Wynik: źródła są rozdzielone na wspólny color core, istniejące `tokens/light.json`/`tokens/dark.json` dla PWA oraz `tokens/color/semantic-CRM/Light.json` i `Dark.json` dla CRM. Target Angular wykorzystuje obecnie CRM Light; PWA pozostaje bez zmian.
- Podjęte decyzje: token sety docelowe to `PWA-light`, `PWA-dark`, `CRM-light`, `CRM-dark`; wszystkie zmiany przechodzą przez Tokens Studio i MR; tokeny niekolorystyczne pozostają CRM-only.
- Dowody / raporty / linki:
- Otwarte problemy: dołączyć CRM Dark dopiero w iteracji dark mode, zaprojektować manifesty PWA/CRM, testy kompletności par light/dark i zakaz cross-product references. Brakujące dwa odcienie żółtego nadal oczekują na dodanie przez workflow Tokens Studio.
- Zadania przeniesione dalej: zaktualizować przestarzałe założenia w panelu decyzji etapu 1, domknąć reguły referencji 8A–8H, manifesty i pełne testy rozdzielenia kontraktów.

---

## Etap 4 — pojedynczy CSS Design Systemu w buildzie CRM

Cel: podłączyć Design System jako jedyne zewnętrzne źródło zmiennych tokenowych CRM.

### Checklista

- [x] Wygenerować jeden CSS entry point dla CRM/Angulara: `dist/css/tokens.angular.css`.
- [ ] Umieścić w nim w wymaganej kolejności:
  - [x] wspólne core colors;
  - [x] `CRM-light` jako domyślny semantic color set;
  - [ ] selektor `CRM-dark`;
  - [x] spacing, typografię i buildową część scalingu przeznaczone wyłącznie dla CRM;
    - [x] fixed spacing;
    - [x] core i semantic radius;
    - [x] responsive semantic spacing;
    - [x] responsive typography;
    - [x] scaling CSS dla 6 breakpointów × 3 device contexts;
  - [ ] przejściowe aliasy CRM, jeżeli zostały zatwierdzone.
- [x] Nie dołączać semantic colors PWA do entry pointu CRM.
- [ ] Opublikować plik w paczce i zabezpieczyć jego ścieżkę testem eksportów.
  - [x] Potwierdzić obecność pliku w lokalnym `npm pack`.
  - [ ] Opublikować nową wersję paczki i dodać test publicznej ścieżki po instalacji z registry.
- [x] Dodać CSS w `wyborek-crm/angular.json` w sekcji `styles` przed `src/styles.scss` (build aplikacji i konfiguracja testowa).
- [ ] Usunąć import lokalnego `styles/colors` dopiero po potwierdzeniu, że wszystkie potrzebne zmienne dostarcza paczka lub warstwa przejściowa.
- [ ] Zbudować CRM w konfiguracji development.
- [ ] Zbudować CRM w konfiguracji production.
- [ ] Sprawdzić kolejność CSS i computed values w runtime.
- [ ] Przejść smoke test głównych ekranów CRM.

### Bramka zakończenia

- [ ] CRM pobiera tokeny z jednego pliku CSS paczki.
- [ ] Build development i production przechodzą.
- [ ] Nie ma błędów brakujących custom properties.
- [ ] `src/styles.scss` zawiera style aplikacji i ewentualne jawne override'y, a nie kopię tokenów.

### Notatki po etapie

- Data: 2026-07-22 — wykonano pierwszy vertical slice builda i integracji CRM.
- Wynik: target Angular generuje deterministyczny plik zawierający color core, CRM light, fixed spacing, radius oraz responsive spacing i typografię; plik trafia do tarballa i jest rozwiązywany przez Angular CLI po lokalnej instalacji paczki.
- Nazwa i ścieżka CSS: `dist/css/tokens.angular.css`; import konsumenta: `./node_modules/@pleodigital/design-system-votey/dist/css/tokens.angular.css`.
- Podjęte decyzje: target Angular jest odseparowany od legacy PWA; responsive spacing i typografia są generowane razem ze scalingiem 1:1, a wartości pochodzą bezpośrednio z sześciu trybów Votey.
- Dowody / raporty / linki: `npm run build:tokens:angular` PASS, `npm run build:angular` PASS, `npm run test:tokens` 19/19 PASS, `npm pack --dry-run` zawiera CSS i wejście Angular, Angular CLI po instalacji tarballa nie zgłasza błędu resolution CSS.
- Otwarte problemy: runtime `VoteyDeviceService` istnieje już w bibliotece, ale CRM nie rejestruje jeszcze `provideVoteyDeviceDetection()`. Build CRM zatrzymują też zastane błędy TypeScript/template type-checkingu niezwiązane z tokenami. Nie wykonano production builda, ponieważ development kończy się na tym samym wcześniejszym blockerze aplikacji.
- Zadania przeniesione dalej: zainstalować aktualny tarball zawierający wejście Angular, podłączyć provider w CRM, sprawdzić computed styles, wykonać pilotażowe użycie, naprawić lub potwierdzić baseline błędów CRM i opublikować nową wersję paczki.

---

## Etap 5 — tokeny spacingu wyłącznie dla CRM

Cel: dodać skalę spacingu i rozpocząć migrację wartości CRM bez zmian w React.

### Checklista

- [x] Na podstawie importu z Figmy/Tokens Studio i audytu CRM zatwierdzić skalę primitives `spacing.*`.
- [x] Użyć `angular-design-system` jako wzorca struktury skali i mechaniki; wartości spacingu ustalić wyłącznie na podstawie Figmy Votey i audytu CRM, bez kopiowania tokenów z drugiego Design Systemu.
- [x] Zdefiniować fixed spacing do konstrukcji komponentów: 14 wartości źródłowych.
- [x] Zdefiniować semantic/responsive spacing wyłącznie tam, gdzie istnieje potwierdzona rola: 11 ról w sześciu trybach.
- [x] Ustalić nazwy CSS custom properties `--space-*`.
- [x] Dodać tokeny do źródeł Design Systemu w `tokens/space/core` i `tokens/space/semantic`.
- [x] Wygenerować je do tego samego CSS entry pointu używanego przez CRM.
- [x] Nie generować ani nie wdrażać teraz Tailwind/`rv-*` dla nowego spacingu.
- [x] Nie dodawać spacingu do artefaktów ani kontraktu PWA.
- [x] Dodać testy wartości fixed i responsive na poziomie deterministycznego outputu i reprezentatywnych formuł dla 3 device contexts.
- [ ] Dodać dokumentację spacingu w Storybooku.
  - [x] Responsive spacing z formułą i rozwiązaną wartością `px`.
  - [ ] Pełna plansza 14 fixed spacing primitives.
- [ ] Wybrać pierwszy, mały obszar CRM do migracji pilotażowej.
- [ ] Zmigrować pilotaż bez zmiany wyglądu.
- [ ] Zweryfikować pilotaż w obsługiwanych szerokościach.
- [ ] Rozpisać pozostałą migrację CRM obszarami.

### Bramka zakończenia

- [ ] Spacing jest publikowany w CSS Design Systemu i używany w pilotażu CRM.
- [ ] Nie powstał lokalny plik tokenów spacingu w CRM.
- [ ] React nie został zmieniony.
- [ ] Testy breakpointów i regresja pilotażu przechodzą.

### Notatki po etapie

- Data: 2026-07-22 — fixed i semantic responsive spacing podłączono do targetu Angular.
- Wynik: 14 fixed spacing tokens jest publikowanych jako `--spacing-*`; 11 ról semantic z sześciu trybów jest publikowanych jako `--space-*` w regułach `body[data-device]`.
- Wybrany obszar pilotażowy:
- Podjęte decyzje:
- Dowody / raporty / linki: `npm run build:tokens:angular` PASS; test deterministyczności i reprezentatywnych formuł responsive PASS.
- Otwarte problemy: runtime jest gotowy w bibliotece, ale provider nie jest jeszcze podłączony w CRM; brak pilotażowego użycia.
- Zadania przeniesione dalej: podłączenie providera Angular w CRM, pilotaż i test computed style.

---

## Etap 6 — tokeny typografii wyłącznie dla CRM

Cel: przenieść wartości typograficzne CRM do pełnych, semantycznych ról Design Systemu.

### Checklista

- [x] Na podstawie importu z Figmy/Tokens Studio i audytu CRM zatwierdzić primitives typografii.
- [x] Potwierdzić font family CRM; pozostaje Open Sans, publikowane przez adapter jako `--font-family-open-sans`.
- [x] Zdefiniować 14 ról typograficznych zgodnie z zaimportowanym kontraktem Votey.
- [x] Dla każdej z 14 zaimportowanych ról wygenerować komplet:
  - [x] font family;
  - [x] font size;
  - [x] font weight;
  - [x] line height;
  - [x] letter spacing.
- [x] Zdefiniować warianty responsywne na podstawie sześciu zaimportowanych trybów.
- [x] Dodać tokeny do źródeł Design Systemu — źródłami są zmergowane pliki `tokens/type/core` i `tokens/type/semantic`.
- [x] Wygenerować CSS custom properties do tego samego entry pointu CRM.
- [x] Nie dodawać teraz mapowania typografii do Reacta ani Tailwinda.
- [x] Nie dodawać typografii do artefaktów ani kontraktu PWA.
- [x] Dodać test kompletu 5 właściwości każdej roli oraz normalizacji font weight i jednostek w outputcie.
- [x] Dodać specimen i macierz responsywną w Storybooku, wraz z formułą i rozwiązaną wartością `px`.
- [ ] Wybrać pierwszy obszar CRM do migracji pilotażowej.
- [ ] Zmigrować tokenowe wartości z odpowiedniej części `texts.scss` i komponentów.
- [ ] Oddzielić nietokenowe utility od definicji wartości.
- [ ] Zweryfikować brak zmian wymiarów i łamania tekstu na ekranach pilotażowych.
- [ ] Rozpisać pozostałą migrację CRM obszarami.

### Bramka zakończenia

- [ ] Pełne role typograficzne są publikowane w CSS i używane w pilotażu CRM.
- [ ] CRM nie ma nowego lokalnego źródła tokenów typografii.
- [ ] Font i layout pilotażu nie zmieniły się bez zaakceptowanej decyzji.
- [ ] React nie został zmieniony.

### Notatki po etapie

- Data: 2026-07-22 — 14 responsive grup typografii podłączono do targetu Angular.
- Wynik: każda grupa publikuje `--typo-<rola>-font-family`, `font-size`, `font-weight`, `line-height` i `letter-spacing`; tekstowe wagi z importu są mapowane na 300/400/600/700/800.
- Wybrany obszar pilotażowy:
- Podjęte decyzje:
- Dowody / raporty / linki: build i 19/19 testów tokenów PASS; wszystkie sześć trybów ma zgodny zestaw 56 właściwości źródłowych; specimen i macierz responsive działają w produkcyjnym buildzie Storybooka.
- Otwarte problemy: runtime istnieje w bibliotece, ale provider nie jest jeszcze podłączony w CRM; nie powstała jeszcze dyrektywa `voteyText` ani pilotażowa migracja.
- Zadania przeniesione dalej: podłączenie providera w CRM, decyzja i implementacja dyrektywy tekstowej oraz pilotaż.

---

## Etap 7 — scaling system wyłącznie dla CRM

Cel: przenieść mechanizm skalowania z `angular-design-system` w formie dopasowanej do CRM i wspólnego pipeline'u tokenów.

### Checklista

- [x] Spisać specyfikację scalingu z `angular-design-system`:
  - [x] breakpointy;
  - [x] wzór interpolacji/clamp;
  - [x] rozdzielenie breakpoint/device;
  - [x] responsive spacing;
  - [x] responsive typography.
- [x] Spisać obecne breakpointy i zachowanie CRM.
- [x] Udokumentować różnice i wpływ na ekrany CRM.
- [x] Utrzymać parametry scalingu w skopiowanej 1:1 warstwie SCSS Design Systemu; sześć szerokości referencyjnych pochodzi z trybów Votey, a mnożniki device z map SCSS.
- [x] Wygenerować wynikowe custom properties/reguły do tego samego CSS-a CRM.
- [ ] Nie uzależniać podstawowej semantyki layoutu wyłącznie od user agenta. Obecny port 1:1 klasyfikuje device przez `node-device-detector`; resize aktualizuje wymiary, orientację i `--vh`, ale nie wprowadza niezależnego fallbacku klasyfikującego device po szerokości.
- [x] Nie zmieniać mechanizmu `rv-*` w React.
- [x] Nie publikować nowego scalingu jako API PWA.
- [x] Zbudować kalkulator/podgląd scalingu w Storybooku: story `CRM Tokens/Foundations/Responsive tokens` pokazuje computed typography/spacing, sześć viewportów referencyjnych, formuły i rozwiązane wartości `px`, mnożniki odczytane z SCSS oraz ręczny podgląd kontraktu `data-device`/orientacji/`--vh`.
- [ ] Dodać testy computed style dla reprezentatywnych spacingów i ról typograficznych.
  - [x] Dodać testy statycznego outputu dla granic, mnożników i reprezentatywnych formuł wszystkich 3 device contexts.
  - [ ] Dodać testy computed style po wdrożeniu runtime `data-device`.
- [ ] Wybrać ekran CRM do proof of concept.
- [ ] Porównać ekran przed/po na wszystkich obsługiwanych szerokościach.
- [ ] Uzyskać akceptację różnic wizualnych albo doprowadzić do zgodności.
- [ ] Rozpisać migrację scalingu CRM obszarami.

### Bramka zakończenia

- [ ] Scaling działa w proof of concept CRM i pochodzi z CSS Design Systemu.
- [x] Mechanika `ds-responsive-tokens.scss` została przeniesiona 1:1 i ma udokumentowane pochodzenie; wartości tokenów są pobierane z sześciu zmergowanych trybów Votey, a nie z map BoxEs.
- [ ] Testy computed style i zaakceptowana regresja wizualna przechodzą.
- [ ] React nadal korzysta z niezmienionego `rv-*`.

### Notatki po etapie

- Data: 2026-07-22 — wykonano analizę, build, angularowy runtime i dokumentacyjny podgląd portu scalingu.
- Wynik: skopiowano funkcje, breakpointy, interpolację odcinkami, mnożniki i selektory `body[data-device]` do `styles/angular/_responsive-token-engine.scss`. Builder tworzy mapy z 6 trybów spacingu i typografii Votey, kompiluje je przez Sass i dołącza do `tokens.angular.css`. Osobny entry point Angular dostarcza runtime kontraktu DOM, a Storybook pokazuje computed values, surowe formuły, wartości `px`, mnożniki i sześć viewportów odpowiadających trybom Figmy.
- Wybrany ekran proof of concept:
- Zaakceptowane różnice:
- Podjęte decyzje:
- Dowody / raporty / linki: [angular-design-system-responsive-scaling-audit.md](./angular-design-system-responsive-scaling-audit.md), `npm run build:angular` PASS, `npm run test:tokens` 19/19 PASS i produkcyjny build Storybooka PASS.
- Otwarte problemy: runtime jest gotowy w paczce, ale CRM nie rejestruje jeszcze `provideVoteyDeviceDetection()`; pozostają fallback przed inicjalizacją JS, semantic color mapping inputu overwrite oraz testy computed style. Znane zachowania brzegowe formuły nie są poprawiane podczas portu 1:1.
- Zadania przeniesione dalej: podłączyć provider runtime w CRM, potem wykonać test computed style i proof of concept; dyrektywę `voteyText` realizować po aktywacji tokenów runtime.

---

## Etap 8 — usunięcie lokalnych tokenów i aliasów z CRM

Cel: osiągnąć stan docelowy, w którym CRM nie ma własnego systemu tokenów.

### Checklista

- [ ] Migrować użycia kolorów obszarami na semantyczne nazwy Design Systemu.
- [ ] W każdym migrowanym miejscu zastępować `--app-color-*` bezpośrednio docelowym CRM semantic tokenem; nie używać semantic PWA i nie wprowadzać aliasów do nowego ani już migrowanego kodu.
- [ ] Migrować użycia spacingu obszarami na tokeny Design Systemu.
- [ ] Migrować użycia typografii obszarami na role Design Systemu.
- [ ] Migrować zaakceptowane obszary na scaling Design Systemu.
- [ ] Po każdym obszarze uruchomić wyszukiwanie pozostałych użyć legacy.
- [ ] Po każdym obszarze wykonać build i odpowiednią regresję wizualną.
- [ ] Usunąć nieużywane `--app-color-*`.
- [ ] Usunąć nieużywane surowe `--color-*`.
- [ ] Usunąć `@use "styles/colors"` z `src/styles.scss`.
- [ ] Usunąć `src/styles/colors.scss`, gdy liczba używanych definicji wyniesie zero.
- [ ] Usunąć lokalne definicje tokenów spacingu.
- [ ] Usunąć lokalne definicje tokenów typografii; zachować tylko jawnie nietokenowe utility.
- [ ] Usunąć przejściowe aliasy CRM z paczki/adaptera po migracji ostatniego użycia.
- [ ] Przeszukać repo CRM pod kątem osieroconych lub zduplikowanych wartości.
- [ ] Udokumentować świadome wyjątki produktowe.

### Bramka zakończenia

- [ ] CRM importuje jeden CSS z paczki Design Systemu.
- [ ] CRM nie zawiera lokalnych plików będących źródłem tokenów.
- [ ] `colors.scss` nie istnieje.
- [ ] Nie ma użyć przejściowych aliasów `--app-color-*`.
- [ ] Pozostałe wyjątki są nazwane, udokumentowane i nie dublują wspólnego systemu.

### Notatki po etapie

- Data:
- Wynik:
- Usunięte pliki/aliasy:
- Pozostawione wyjątki i uzasadnienie:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 9 — Storybook, testy konsumentów i publikacja

Cel: zamknąć pierwsze wdrożenie udokumentowanym i bezpiecznie opublikowanym kontraktem.

### Checklista

- [ ] Uzupełnić Storybook o:
  - [x] wspólne core colors w sekcjach CRM i PWA;
  - [x] osobne semantic colors `PWA-light`/`PWA-dark` z działającym przełącznikiem;
  - [x] semantic colors `CRM-light`;
  - [ ] semantic colors `CRM-dark` po włączeniu tego trybu do artefaktu Angular;
  - [ ] CRM opacity foundations oraz produktowo przypisane semantic shadow/overlay colors;
  - [ ] przykłady elewacji, jeśli zostaną wprowadzone jako composite tokens;
  - [ ] light/dark osobno dla PWA i CRM (PWA gotowe, CRM dark odłożony);
  - [ ] fixed i responsive spacing (responsive gotowe, pełna plansza fixed pozostaje);
  - [x] core radius i semantic radius na osobnej karcie `CRM Tokens/Foundations/Radius`, wraz z wizualnym preview oraz wartościami `px`;
  - [x] specimen typografii;
  - [x] breakpointy i kalkulator scalingu;
  - [ ] przykłady użycia CSS w Angularze;
  - [ ] status deprecated aliases;
  - [ ] raport pokrycia Figma ↔ tokeny.
- [x] Potwierdzić, że Storybook czyta wygenerowane artefakty i nie jest drugim źródłem wartości: wartości CSS pochodzą z `tokens.angular.css`, aliasy z JSON-ów źródłowych, a mnożniki scalingu są odczytywane bezpośrednio z SCSS przez `?raw`.
- [ ] Uruchomić walidację schema, referencji, rozdzielenia semantic PWA/CRM, obu par light/dark i publicznego API każdego konsumenta.
- [ ] Uruchomić pełny build paczki.
- [ ] Uruchomić build/testy CRM w wymaganych konfiguracjach.
- [ ] Uruchomić końcową regresję wizualną CRM.
- [ ] Uruchomić smoke build Reacta.
- [ ] Zweryfikować w React light/dark, Samsung override i brak zmian `rv-*`.
- [ ] Przygotować changelog i manifest różnic tokenów.
- [ ] Przygotować instrukcję integracji/migracji dla zespołu Angular.
- [ ] Opisać wyraźnie, że spacing, typografia i scaling są kontraktem CRM-only i nie są wdrażane w React/PWA.
- [ ] Wybrać wersję zgodnie z SemVer.
- [ ] Opublikować paczkę.
- [ ] Zaktualizować przypiętą wersję w CRM.
- [ ] Wykonać smoke test CRM na opublikowanej paczce, a nie tylko na lokalnym buildzie.
- [ ] Zaktualizować tę checklistę i zamknąć lub przepisać wszystkie otwarte zadania.

### Bramka zakończenia

- [ ] Opublikowana paczka działa w CRM.
- [ ] React nie ma regresji po wydaniu paczki.
- [ ] Dokumentacja odpowiada rzeczywistym artefaktom.
- [ ] Nie ma nieopisanych blockerów ani tymczasowych aliasów bez terminu usunięcia.

### Notatki po etapie

- Data: 2026-07-22 — wykonano pierwszą dużą iterację dokumentacji Storybooka; etap publikacyjny pozostaje otwarty.
- Wersja paczki:
- Wynik: nawigacja ma trzy spójne grupy `CRM Tokens`, `PWA Tokens` i `Assets`; udokumentowano core/semantic colors, core/semantic radius, responsive spacing, typography i scaling oraz odświeżono galerie ikon i ilustracji.
- Podjęte decyzje: wspólny header zapewnia identyczną typografię kart; wybór device w Storybooku emuluje kontrakt DOM tylko dla preview, natomiast produkcyjny CRM będzie używać angularowego providera.
- Dowody / raporty / linki: produkcyjny build Storybooka PASS; ręcznie sprawdzono karty i przełącznik PWA light/dark; responsive story pokazuje również przeliczone wartości `px` i aktualne mnożniki device.
- Otwarte problemy: brak CRM dark, shadow/overlay, planszy fixed spacing, przykładu integracji Angular i raportu pokrycia Figma; nie wykonano jeszcze pełnego builda wszystkich konsumentów ani publikacji.
- Zadania do kolejnej iteracji: najpierw zamknąć pipeline w CRM (provider, computed styles, pilotaż, build), potem uzupełniać dodatki dokumentacyjne.

---

## Rejestr decyzji przekrojowych

| Data | Decyzja | Uzasadnienie | Wpływ | Osoba/zespół |
|---|---|---|---|---|
| 2026-07-22 | Jedyną wspólną warstwą obu produktów są core color tokens. | Warsztat React + Angular + Design rozdzielił decyzje paletowe od ról produktowych. | Core colors nie mogą zawierać ról PWA ani CRM i są publikowane jako wspólna baza obu kontraktów. | Design + React/PWA + Angular/CRM + Design System |
| 2026-07-22 | Semantic colors są rozdzielone na `PWA-light`, `PWA-dark`, `CRM-light`, `CRM-dark`. | PWA i CRM mają różne role, historię oraz tempo migracji; wymuszanie wspólnej semantyki zwiększałoby ryzyko regresji Reacta i sztucznych nazw CRM. | Każda para light/dark ma własny test kompletności; zakazane są referencje semantic pomiędzy produktami. | Design + React/PWA + Angular/CRM + Design System |
| 2026-07-22 | Wszystkie tokeny poza colors są w tej iteracji używane wyłącznie przez CRM. | PWA jest w większości ukończona i zachowuje własny spacing, typografię oraz `rv-*`. | Spacing, typografia i scaling trafiają tylko do entry pointu CRM; nie rozszerzamy nimi API PWA. | Design + React/PWA + Angular/CRM |
| 2026-07-22 | Tokens Studio pozostaje pośrednikiem pomiędzy Figmą a repozytorium Design Systemu. | Zespół zachowuje działający workflow generowania MR i nie przenosi source of truth kolorów wyłącznie do native Figma Variables. | Obowiązuje przepływ Figma → Tokens Studio → MR/review → repo → Style Dictionary; eksport testowego alpha color do native Variables nie jest bramką. | Design + React/PWA + Angular/CRM + Design System |
| 2026-07-22 | W pierwszej iteracji CRM pozostaje przy Open Sans. | Migracja tokenów ma uporządkować kontrakt bez równoczesnej zmiany wizualnej i ryzyka zmian łamania tekstu. | Tokeny typografii CRM użyją Open Sans; ewentualna zmiana fontu będzie osobnym zadaniem i decyzją projektową. | Design + Angular |
| 2026-07-22 | Zachowujemy workflow Figma/Tokens Studio → merge request → repo dla wspólnych core colors i obu produktowych warstw semantic. | Jest to działający proces zespołu React i po warsztacie staje się wspólną ścieżką zmian PWA/CRM. | Scalony stan repo pozostaje wejściem do Style Dictionary; każdy semantic token musi trafić do właściwego produktu i trybu. | Design + React/PWA + Angular/CRM + Design System |
| 2026-07-22 | Przejściowe aliasy `--app-color-*` będą żyły w adapterze CRM/Angular publikowanym przez paczkę Design Systemu. | CRM może być migrowany etapami bez zachowywania lokalnego źródła tokenów i bez zanieczyszczania wspólnego core ani źródeł semantic PWA/CRM nazwami migracyjnymi. | W każdym migrowanym miejscu alias jest od razu zastępowany docelowym CRM semantic tokenem; alias zabezpiecza tylko jeszcze niezmigrowany kod. | Angular + Design System |
| 2026-07-22 | Publiczny entry point tokenów CRM będzie publikowany jako `dist/css/tokens.angular.css`. | Jedna stabilna ścieżka upraszcza konfigurację buildu Angulara i pozwala testować kompletność eksportu paczki. | CRM zaimportuje ten plik przed `src/styles.scss`; zmiana ścieżki będzie zmianą publicznego API. | Angular + Design System |
| 2026-07-22 | Przyjmujemy politykę SemVer, deprecacji i wygaszania aliasów. | Konsumenci muszą móc rozpoznać kompatybilne rozszerzenie i zmianę łamiącą kontrakt oraz mieć kontrolowany czas na migrację. | Patch nie zmienia publicznego kontraktu; minor dodaje kompatybilne API; major usuwa lub łamie API. Deprecated alias pozostaje do zera użyć w CRM oraz przez jedno kolejne wydanie minor, a następnie może zostać usunięty w majorze. | React + Angular + Design System |
| 2026-07-22 | Kod runtime Angular jest publikowany przez osobne wejście `@pleodigital/design-system-votey/angular`. | React nie może ładować zależności Angulara, a CRM potrzebuje wspólnego serwisu urządzenia dla responsive tokens. | `VoteyDeviceService` i provider są opcjonalne dla PWA, a CRM musi jawnie zarejestrować provider. | Angular + Design System |
| 2026-07-22 | Storybook może emulować wybór urządzenia w preview, ale produkcyjny kontrakt DOM ustawia `VoteyDeviceService`. | Pozwala testować sześć trybów bez udawania, że toolbar Storybooka jest runtime aplikacji. | Dokumentacja i runtime korzystają z tych samych custom properties, lecz odpowiedzialność za `data-device`, orientację i `--vh` w CRM należy do providera. | Angular + Design System |

## Rejestr ryzyk i blockerów

| Status | Ryzyko / blocker | Właściciel | Plan działania | Etap |
|---|---|---|---|---|
| Częściowo zamknięte | `dist` może być niespójny ze źródłami tokenów | Design System | Target Angular jest deterministyczny i testowany; pozostaje domknąć source → dist oraz parytet dla legacy PWA | 1 |
| Otwarte | React intensywnie używa obecnego kontraktu kolorów i `rv-*` | React + Design System | Zamrozić API i wykonywać regresję; nie migrować spacingu/typografii/scalingu | 0, 3, 9 |
| Częściowo zamknięte | Źródła semantic wymagają formalnego rozdzielenia PWA i CRM | Design System + Design | Fizyczny podział już istnieje: `light.json`/`dark.json` pozostają PWA, a CRM ma `semantic-CRM/Light.json` i `Dark.json`; pozostają manifesty, testy par i cross-product references | 1, 3 |
| Otwarte | Podobne nazwy semantic PWA i CRM mogą kolidować w outputach | Design System | Ustalić osobne entry pointy/selektory i test zakazujący cross-product references przed implementacją | 1, 3, 4 |
| Otwarte | CRM ma dużą liczbę lokalnych użyć `--app-color-*` | Angular + Design System | Tabela mapowania, przejściowe aliasy i migracja obszarami | 0, 3, 8 |
| Zamknięte | Font CRM dla pierwszej iteracji | Design + Angular | Pozostawić Open Sans; ewentualną zmianę fontu prowadzić jako osobną decyzję i migrację | 0, 6 |
| Otwarte | Runtime responsive z paczki nie jest jeszcze aktywny w CRM | Angular | Zainstalować aktualny tarball, zarejestrować `provideVoteyDeviceDetection()` i sprawdzić computed styles na reprezentatywnych szerokościach | 4, 7 |
| Otwarte | `package.json#main` wskazuje nieistniejący legacy plik | Design System | Naprawić niezależnie od nowego eksportu `/angular` i zabezpieczyć testem publicznego API | 1, 9 |

## Kryteria zakończenia całej pierwszej iteracji

- [ ] Wspólne core colors są jedyną współdzieloną warstwą PWA i CRM.
- [ ] Semantic colors są rozdzielone na kompletne pary PWA-light/dark i CRM-light/dark bez zależności międzyproduktowych.
- [ ] Design System jest jedynym źródłem tokenów używanych przez CRM.
- [ ] CRM importuje jeden CSS z paczki w konfiguracji buildu.
- [ ] `src/styles/colors.scss` został usunięty z CRM.
- [ ] Spacing, typografia i scaling CRM pochodzą z Design Systemu.
- [ ] React zachował dotychczasowe spacing, typografię i scaling `rv-*`.
- [ ] Żaden token spacingu, typografii ani nowego scalingu CRM nie został dodany do kontraktu PWA.
- [ ] Istniejące kolory Reacta nie mają niezaakceptowanych regresji.
- [ ] Figma, Tokens Studio, pliki tokenów, produktowe CSS-y i Storybook mają udokumentowane mapowanie.
- [ ] Pipeline automatycznie wykrywa niespójności źródło → dist, PWA light → dark, CRM light → dark, cross-product references i usunięcia publicznego API.
- [ ] Wszystkie tymczasowe aliasy zostały usunięte albo mają właściciela i termin usunięcia.
