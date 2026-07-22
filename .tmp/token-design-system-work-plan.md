# Plan wykonawczy — tokeny Design System Votey

Status dokumentu: aktywna checklista projektu  
Zakres: tokeny, Style Dictionary, Figma, Storybook i integracja konsumentów  
Główny konsument nowych tokenów: `wyborek-crm` (Angular)  
Konsument wymagający ochrony przed regresją: `votey-user-app` (React)

## Jak prowadzimy ten dokument

- Zadanie niezaczęte: `- [ ]`.
- Zadanie zakończone i zweryfikowane: `- [x]`.
- Nie oznaczamy zadania jako wykonane tylko dlatego, że kod został napisany — musi przejść walidację wskazaną w danym etapie.
- Po każdym etapie uzupełniamy sekcję **Notatki po etapie**: datę, wynik, decyzje, dowody i dalsze zadania.
- Jeżeli w trakcie pracy zmieni się zakres, aktualizujemy najpierw ten dokument, a dopiero potem implementację.
- Następny etap zaczynamy po spełnieniu bramki zakończenia poprzedniego etapu albo po zapisaniu jawnej decyzji o wyjątku.

## Ustalony zakres

- Obecne tokeny kolorów nadal obsługują React i zostaną ujednolicone z CRM.
- Nowe tokeny spacingu i typografii będą na razie używane wyłącznie w CRM.
- Scaling zainspirowany `angular-design-system` wdrażamy najpierw dla CRM.
- React zachowuje obecne spacing, typografię i scaling `rv-*`. Nie migrujemy ich w tym projekcie.
- CRM docelowo nie przechowuje własnych plików będących źródłem tokenów.
- CRM importuje do buildu jeden wygenerowany plik CSS z paczki Design Systemu, przed `src/styles.scss`.
- `src/styles/colors.scss` w CRM ma zostać usunięty po zakończeniu migracji.
- Core color tokens pozostają nieprzezroczyste; kanał alpha jest składany dopiero w semantic tokens z opaque core + osobnej skali opacity.
- Semantic alpha colors są nazywane według roli (`shadow`, `overlay`, `border`, `surface`), a nie według procentu opacity.
- Lokalne definicje tokenów spacingu i typografii w CRM także mają zostać usunięte. Nietokenowe style aplikacyjne mogą pozostać.
- Ikony, ilustracje, pozostałe SVG i komponenty UI są poza zakresem.

## Checklista główna

- [x] Etap 0 — zamrożenie stanu wyjściowego i decyzje
- [ ] Etap 1 — kontrakt tokenów i pipeline Style Dictionary
- [ ] Etap 2 — audyt i mapowanie Figmy
- [ ] Etap 3 — ujednolicenie tokenów kolorów
- [ ] Etap 4 — pojedynczy CSS Design Systemu w buildzie CRM
- [ ] Etap 5 — tokeny spacingu dla CRM
- [ ] Etap 6 — tokeny typografii dla CRM
- [ ] Etap 7 — scaling system dla CRM
- [ ] Etap 8 — usunięcie lokalnych tokenów i aliasów z CRM
- [ ] Etap 9 — Storybook, testy konsumentów i publikacja

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
- [x] Zatwierdzić przepływ kolorów: Tokens Studio/Figma jest źródłem authoringu tokenów core i semantic oraz generuje merge request; po przeglądzie i scaleniu pliki tokenów w repo Design Systemu są źródłem builda i publikowanego kontraktu.
- [x] Zdecydować o foncie CRM dla pierwszej iteracji: pozostaje Open Sans; podłączenie tokenów typografii nie zmienia rodziny fontu.
- [x] Umieścić przejściowe aliasy `--app-color-*` w publikowanym adapterze CRM/Angular paczki Design Systemu, poza wspólnymi core i semantic tokens; aliasy mają wskazywać na docelowe tokeny, być deprecated i zostać usunięte po migracji ostatniego użycia.
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

- Podjęte decyzje:
  - Zachowujemy istniejący workflow kolorów zespołu React: Tokens Studio/Figma → automatycznie utworzony merge request → review i merge do repo → Style Dictionary → artefakty paczki. Zmiana w Figmie nie staje się kontraktem aplikacji bez przejścia przez merge request.
  - W pierwszej iteracji CRM pozostaje przy Open Sans.
  - Przejściowe aliasy `--app-color-*` będą generowane w adapterze CRM/Angular publikowanym przez paczkę, a nie utrzymywane lokalnie w CRM ani dodawane do wspólnych warstw core/semantic.
  - Pojedynczym publicznym entry pointem tokenów dla CRM będzie `dist/css/tokens.angular.css`.
  - Podczas migracji każde napotkane użycie aliasu, np. `--app-color-background`, zastępujemy bezpośrednio zatwierdzonym tokenem semantic, np. `--color-surface-primary`. Aliasy zabezpieczają wyłącznie jeszcze niezmigrowany kod i nie są stanem pośrednim dla migrowanego ani nowego kodu.
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
  - **Etap 2:** wykonać pełną inwentaryzację Tokens Studio i natywnych Figma Variables/styles oraz przygotować mapowanie Figma → token repo → CSS custom property.
  - **Etap 3:** przez Tokens Studio/Figma dodać zaakceptowane core colors `color/yellow-25: #fffcf1` i `color/yellow-50: #fff5e1`, a następnie wdrożyć zatwierdzone mapowania kolorów CRM, zaprojektować brakujące semantic colors oraz tokeny opacity/shadow/overlay, zachowując istniejący kontrakt kolorów Reacta.
  - **Etap 4:** wygenerować i opublikować `dist/css/tokens.angular.css`; umieścić przejściowe `--app-color-*` wyłącznie w adapterze CRM/Angular jako deprecated referencje do docelowych tokenów semantic.
  - **Etapy 5–7:** dodać spacing, typografię z Open Sans i scaling przeznaczone na razie wyłącznie dla CRM; nie zmieniać spacingu, typografii ani `rv-*` w React.
  - **Etap 8:** w każdym migrowanym miejscu CRM zastępować `--app-color-*` bezpośrednio tokenem semantic, a po osiągnięciu zera użyć usunąć lokalne źródła tokenów; aliasy w paczce wygasić zgodnie z ustalonym okresem deprecacji.
  - **Przez kolejne etapy:** zachować zastane, niezacommitowane modyfikacje `wyborek-crm/package.json` i `package-lock.json` oraz nie przypisywać ich do prac migracyjnych bez osobnej weryfikacji.

---

## Etap 1 — kontrakt tokenów i pipeline Style Dictionary

Cel: zbudować deterministyczne źródło tokenów i generator obsługujący wszystkie potrzebne kategorie.

### Checklista

- [ ] Zdefiniować warstwy tokenów:
  - [ ] primitives/core;
  - [ ] semantic tokens;
  - [ ] light/dark/brand;
  - [ ] artefakty konsumenckie.
- [ ] Zatwierdzić konwencję nazw niezależną od Angulara, Reacta i konkretnych wartości.
- [ ] Zatwierdzić typy oraz jednostki dla color, dimension, font family, font weight, font size, line height i letter spacing.
- [ ] Zdefiniować foundation opacity i sposób składania semantic colors z opaque core + opacity.
- [ ] Dodać walidację zabraniającą wartości alpha w core color tokens.
- [ ] Ustalić reprezentację kompozycji core + opacity w Style Dictionary oraz rozwiązanie wartości RGBA dla Figmy.
- [ ] Zdecydować, czy publikujemy tylko semantic shadow colors, czy również tokeny całej elewacji: color + offset + blur + spread.
- [ ] Zdefiniować zasady referencji i zakaz cykli.
- [ ] Uogólnić filtry Style Dictionary, które obecnie rozpoznają głównie `color.*`.
- [ ] Rozdzielić generowanie źródeł od adapterów konsumenckich.
- [ ] Zapewnić deterministyczny build source → dist.
- [ ] Dodać walidację schema tokenów.
- [ ] Dodać test brakujących i cyklicznych referencji.
- [ ] Dodać test identycznego zestawu ścieżek semantycznych light/dark.
- [ ] Dodać test manifestu publicznego API paczki.
- [ ] Sprawdzić i poprawić publikowanie wszystkich wymaganych plików w `package.json`.
- [ ] Udokumentować lokalne komendy build/test dla tokenów.

### Bramka zakończenia

- [ ] Dwa kolejne buildy z tego samego źródła dają identyczne artefakty.
- [ ] `dist` jest zgodny ze źródłami.
- [ ] Usunięcie publicznego tokenu powoduje kontrolowany błąd testu.
- [ ] Pipeline jest gotowy na color, spacing, typography i scaling.

### Notatki po etapie

- Data:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 2 — audyt i mapowanie Figmy

Cel: ustalić, które wartości i role pochodzą z Figmy oraz gdzie występują rozbieżności z kodem.

### Checklista

- [x] Potwierdzić działanie połączenia Figma MCP i uwierzytelnienie konta.
- [x] Potwierdzić dostęp do właściwego pliku/biblioteki Figma po otrzymaniu jego URL-a.
- [x] Potwierdzić read-only dostęp do danych Tokens Studio zapisanych w pliku Figma.
- [x] Przed bieżącym pre-checkiem użyć repozytoryjnego skilla `figma` i wykonać jego MCP Guard.
- [ ] Powtórzyć MCP Guard przed kolejną sesją operacji Figma, jeśli zmieni się sesja lub środowisko MCP.
- [ ] Zinwentaryzować collections, modes, variables i style typograficzne.
- [ ] Odczytać wartości spacingu, typografii, kolorów i breakpointów bez zgadywania ich ze screenshotów.
- [ ] Przygotować tabelę: Figma variable/style → token repo → CSS custom property.
- [ ] Oznaczyć każde mapowanie jako:
  - [ ] exact;
  - [ ] alias;
  - [ ] missing;
  - [ ] product-specific;
  - [ ] wymagające decyzji projektowej.
- [ ] Dla kolorów walidować pary light/dark, nie pojedyncze wartości.
- [ ] Dla typografii zapisać pełny komplet: family, size, weight, line height i letter spacing.
- [ ] Dla spacingu oddzielić wartości fixed od semantycznych/responsywnych.
- [ ] Potwierdzić w Tokens Studio/Figma, czy zaakceptowane kandydaty `color/yellow-25: #fffcf1` i `color/yellow-50: #fff5e1` są rzeczywiście brakujące i nie występują pod inną nazwą.
- [ ] Zatwierdzić listę tokenów, które trzeba dodać do Design Systemu.

### Bramka zakończenia

- [ ] Wszystkie tokeny planowane dla CRM mają potwierdzone źródło albo zapisaną decyzję o wyjątku.
- [ ] Brakujące wartości nie są inferowane „na oko”.
- [ ] Tabela mapowania jest gotowa do aktualizowania przy kolejnych zmianach.

### Notatki po etapie

- Data: 2026-07-22 — pre-check połączenia, pliku i Tokens Studio.
- Wynik: konektor Figma działa; `whoami` zwróciło uwierzytelnione konto z pełnym dostępem do planów PLEO. Potwierdzono odczyt pliku `Wyborek | Design System` (`voF94kJ9mqgENbzJBuw2Iv`) oraz dostęp do danych Tokens Studio w namespace `tokens`. Dokument zawiera 15 współdzielonych kluczy Tokens Studio, w tym niechunkowane `values` i `themes`, oraz 8 lokalnych kolekcji obejmujących łącznie 211 natywnych Variables.
- Podjęte decyzje:
- Dowody / raporty / linki: poprawne wywołania read-only `whoami`, `get_metadata`, wyszukiwania variables/styles oraz Plugin API dla pliku [Wyborek | Design System](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=0-1); Tokens Studio udostępnia klucze `values_meta`, `values`, `themes_meta`, `themes` i konfigurację eksportu.
- Otwarte problemy:
- Zadania przeniesione dalej: zinwentaryzować pełne wartości i aliasy Tokens Studio oraz natywne collections, modes, variables i styles; następnie przygotować mapowanie Figma → token repo → CSS custom property.

---

## Etap 3 — ujednolicenie tokenów kolorów

Cel: zachować działający kontrakt Reacta i doprowadzić CRM do tych samych semantycznych nazw.

### Checklista

- [ ] Wyrównać zestaw ścieżek tokenów light/dark.
- [ ] Potwierdzić znaczenie wszystkich używanych tokenów semantycznych Reacta.
- [ ] Nie zmieniać istniejących nazw ani wartości Reacta bez osobnej, zaakceptowanej migracji.
- [ ] Zweryfikować kolejność i zakres nadpisań `tokens.samsung.css`.
- [ ] Przejść przez tabelę `--app-color-*` z CRM.
- [ ] Dodać przez Tokens Studio/Figma core token `color/yellow-25` o wartości `#fffcf1`, wygenerować merge request i po review scalić go do repo.
- [ ] Dodać przez Tokens Studio/Figma core token `color/yellow-50` o wartości `#fff5e1`, wygenerować merge request i po review scalić go do repo.
- [ ] Po buildzie potwierdzić obecność `--color-yellow-25: #fffcf1` i `--color-yellow-50: #fff5e1` w artefaktach oraz użyć ich w zaakceptowanych mapowaniach CRM.
- [ ] Sklasyfikować wszystkie przezroczyste kolory CRM:
  - [ ] 4 alpha hex primitives;
  - [ ] 65 wystąpień `rgba()` / 22 unikalne wartości;
  - [ ] 18 wystąpień `color-mix(... transparent)` / 10 unikalnych formuł;
  - [ ] rozdzielić role shadow, overlay, border, surface i gradient.
- [ ] Zdeduplikować powtarzające się cienie i zaprojektować semantic shadow tokens, w tym robocze `color.shadow.soft` oraz `color.shadow.event-filter`.
- [ ] Zaprojektować semantic overlay tokens, w tym robocze `color.overlay.loader`, `color.overlay.loader-soft` i gradient accent overlay.
- [ ] Zweryfikować lokalne przezroczyste cienie/overlays w React przed rozszerzeniem wspólnego kontraktu.
- [ ] Dla każdego `--app-color-*` wskazać:
  - [ ] istniejący odpowiednik semantyczny DS;
  - [ ] nowy potrzebny token semantyczny DS;
  - [ ] wyjątek wyłącznie produktowy;
  - [ ] token nieużywany, przeznaczony do usunięcia.
- [ ] Dodać zaakceptowane brakujące tokeny do źródeł Design Systemu.
- [ ] Wygenerować aktualne artefakty base/light/dark/Tailwind.
- [ ] Jeżeli migracja CRM nie będzie atomowa, wygenerować jawnie deprecated aliasy `--app-color-*` po stronie paczki.
- [ ] Dodać testy pokrycia mapowania CRM.
- [ ] Dodać/uzupełnić dokumentację kolorów w Storybooku.
- [ ] Uruchomić regresję kolorów w React.

### Bramka zakończenia

- [ ] Każdy używany token kolorystyczny CRM ma odpowiednik albo udokumentowany wyjątek.
- [ ] Light i dark mają zgodny kontrakt.
- [ ] React nie ma niezamierzonych zmian wizualnych.
- [ ] CRM nie potrzebuje już ręcznie rozwijanej lokalnej palety.

### Notatki po etapie

- Data:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 4 — pojedynczy CSS Design Systemu w buildzie CRM

Cel: podłączyć Design System jako jedyne zewnętrzne źródło zmiennych tokenowych CRM.

### Checklista

- [ ] Wygenerować jeden CSS entry point dla CRM/Angulara.
- [ ] Umieścić w nim w wymaganej kolejności:
  - [ ] primitives;
  - [ ] domyślny motyw;
  - [ ] selektory dodatkowych motywów, jeżeli CRM ich potrzebuje;
  - [ ] przejściowe aliasy CRM, jeżeli zostały zatwierdzone.
- [ ] Opublikować plik w paczce i zabezpieczyć jego ścieżkę testem eksportów.
- [ ] Dodać CSS w `wyborek-crm/angular.json` w sekcji `styles` przed `src/styles.scss`.
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

- Data:
- Wynik:
- Nazwa i ścieżka CSS:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 5 — tokeny spacingu dla CRM

Cel: dodać skalę spacingu i rozpocząć migrację wartości CRM bez zmian w React.

### Checklista

- [ ] Na podstawie Figmy i audytu CRM zatwierdzić skalę primitives `spacing.*`.
- [ ] Porównać skalę z `angular-design-system`; zapisać świadome różnice.
- [ ] Zdefiniować fixed spacing do konstrukcji komponentów.
- [ ] Zdefiniować semantic/responsive spacing wyłącznie tam, gdzie istnieje potwierdzona rola.
- [ ] Ustalić nazwy CSS custom properties.
- [ ] Dodać tokeny do źródeł Design Systemu.
- [ ] Wygenerować je do tego samego CSS entry pointu używanego przez CRM.
- [ ] Nie generować ani nie wdrażać teraz Tailwind/`rv-*` dla nowego spacingu.
- [ ] Dodać testy wartości fixed i responsive.
- [ ] Dodać dokumentację spacingu w Storybooku.
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

- Data:
- Wynik:
- Wybrany obszar pilotażowy:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 6 — tokeny typografii dla CRM

Cel: przenieść wartości typograficzne CRM do pełnych, semantycznych ról Design Systemu.

### Checklista

- [ ] Na podstawie Figmy i audytu CRM zatwierdzić primitives typografii.
- [ ] Potwierdzić font family CRM; podłączenie tokenów samo w sobie nie zmienia fontu.
- [ ] Zdefiniować role, np. display, heading, body, label i caption.
- [ ] Dla każdej roli zdefiniować komplet:
  - [ ] font family;
  - [ ] font size;
  - [ ] font weight;
  - [ ] line height;
  - [ ] letter spacing.
- [ ] Zdefiniować warianty responsywne tylko dla ról potwierdzonych przez Figmę/produkt.
- [ ] Dodać tokeny do źródeł Design Systemu.
- [ ] Wygenerować CSS custom properties do tego samego entry pointu CRM.
- [ ] Nie dodawać teraz mapowania typografii do Reacta ani Tailwinda.
- [ ] Dodać testy kompletu właściwości każdej roli.
- [ ] Dodać specimen i macierz responsywną w Storybooku.
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

- Data:
- Wynik:
- Wybrany obszar pilotażowy:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 7 — scaling system dla CRM

Cel: przenieść mechanizm skalowania z `angular-design-system` w formie dopasowanej do CRM i wspólnego pipeline'u tokenów.

### Checklista

- [ ] Spisać specyfikację scalingu z `angular-design-system`:
  - [ ] breakpointy;
  - [ ] wzór interpolacji/clamp;
  - [ ] rozdzielenie breakpoint/device;
  - [ ] responsive spacing;
  - [ ] responsive typography.
- [ ] Spisać obecne breakpointy i zachowanie CRM.
- [ ] Udokumentować różnice i wpływ na ekrany CRM.
- [ ] Zaprojektować parametry scalingu jako tokeny/primitives Design Systemu.
- [ ] Wygenerować wynikowe custom properties/reguły do tego samego CSS-a CRM.
- [ ] Nie uzależniać podstawowej semantyki layoutu wyłącznie od user agenta.
- [ ] Nie zmieniać mechanizmu `rv-*` w React.
- [ ] Zbudować kalkulator/podgląd scalingu w Storybooku.
- [ ] Dodać testy computed style dla reprezentatywnych spacingów i ról typograficznych.
- [ ] Wybrać ekran CRM do proof of concept.
- [ ] Porównać ekran przed/po na wszystkich obsługiwanych szerokościach.
- [ ] Uzyskać akceptację różnic wizualnych albo doprowadzić do zgodności.
- [ ] Rozpisać migrację scalingu CRM obszarami.

### Bramka zakończenia

- [ ] Scaling działa w proof of concept CRM i pochodzi z CSS Design Systemu.
- [ ] W CRM nie skopiowano ręcznie wzorów ani wartości scalingu.
- [ ] Testy computed style i zaakceptowana regresja wizualna przechodzą.
- [ ] React nadal korzysta z niezmienionego `rv-*`.

### Notatki po etapie

- Data:
- Wynik:
- Wybrany ekran proof of concept:
- Zaakceptowane różnice:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 8 — usunięcie lokalnych tokenów i aliasów z CRM

Cel: osiągnąć stan docelowy, w którym CRM nie ma własnego systemu tokenów.

### Checklista

- [ ] Migrować użycia kolorów obszarami na semantyczne nazwy Design Systemu.
- [ ] W każdym migrowanym miejscu zastępować `--app-color-*` bezpośrednio docelowym tokenem semantic; nie wprowadzać aliasów do nowego ani już migrowanego kodu.
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
  - [ ] primitive i semantic colors;
  - [ ] opacity foundations oraz semantic shadows/overlays;
  - [ ] przykłady elewacji, jeśli zostaną wprowadzone jako composite tokens;
  - [ ] light/dark/brand;
  - [ ] fixed i responsive spacing;
  - [ ] specimen typografii;
  - [ ] breakpointy i kalkulator scalingu;
  - [ ] przykłady użycia CSS w Angularze;
  - [ ] status deprecated aliases;
  - [ ] raport pokrycia Figma ↔ tokeny.
- [ ] Potwierdzić, że Storybook czyta wygenerowane artefakty i nie jest drugim źródłem wartości.
- [ ] Uruchomić walidację schema, referencji, light/dark i publicznego API.
- [ ] Uruchomić pełny build paczki.
- [ ] Uruchomić build/testy CRM w wymaganych konfiguracjach.
- [ ] Uruchomić końcową regresję wizualną CRM.
- [ ] Uruchomić smoke build Reacta.
- [ ] Zweryfikować w React light/dark, Samsung override i brak zmian `rv-*`.
- [ ] Przygotować changelog i manifest różnic tokenów.
- [ ] Przygotować instrukcję integracji/migracji dla zespołu Angular.
- [ ] Opisać wyraźnie, że spacing i typografia nie są jeszcze wdrażane w React.
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

- Data:
- Wersja paczki:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania do kolejnej iteracji:

---

## Rejestr decyzji przekrojowych

| Data | Decyzja | Uzasadnienie | Wpływ | Osoba/zespół |
|---|---|---|---|---|
| 2026-07-22 | W pierwszej iteracji CRM pozostaje przy Open Sans. | Migracja tokenów ma uporządkować kontrakt bez równoczesnej zmiany wizualnej i ryzyka zmian łamania tekstu. | Tokeny typografii CRM użyją Open Sans; ewentualna zmiana fontu będzie osobnym zadaniem i decyzją projektową. | Design + Angular |
| 2026-07-22 | Zachowujemy workflow Tokens Studio/Figma → merge request → repo dla tokenów kolorów core i semantic. | Jest to działający proces zespołu React i pozwala zachować Figmę jako miejsce authoringu przy jednoczesnym review zmian przed publikacją. | Scalony stan repo pozostaje wejściem do Style Dictionary i źródłem publikowanych artefaktów; nie wprowadzamy równoległego ręcznego procesu dla CRM. | Design + React + Design System |
| 2026-07-22 | Przejściowe aliasy `--app-color-*` będą żyły w adapterze CRM/Angular publikowanym przez paczkę Design Systemu. | CRM może być migrowany etapami bez zachowywania lokalnego źródła tokenów i bez zanieczyszczania wspólnych warstw core/semantic nazwami produktowymi. | W każdym migrowanym miejscu alias jest od razu zastępowany docelowym tokenem semantic; alias zabezpiecza tylko jeszcze niezmigrowany kod. | Angular + Design System |
| 2026-07-22 | Publiczny entry point tokenów CRM będzie publikowany jako `dist/css/tokens.angular.css`. | Jedna stabilna ścieżka upraszcza konfigurację buildu Angulara i pozwala testować kompletność eksportu paczki. | CRM zaimportuje ten plik przed `src/styles.scss`; zmiana ścieżki będzie zmianą publicznego API. | Angular + Design System |
| 2026-07-22 | Przyjmujemy politykę SemVer, deprecacji i wygaszania aliasów. | Konsumenci muszą móc rozpoznać kompatybilne rozszerzenie i zmianę łamiącą kontrakt oraz mieć kontrolowany czas na migrację. | Patch nie zmienia publicznego kontraktu; minor dodaje kompatybilne API; major usuwa lub łamie API. Deprecated alias pozostaje do zera użyć w CRM oraz przez jedno kolejne wydanie minor, a następnie może zostać usunięty w majorze. | React + Angular + Design System |

## Rejestr ryzyk i blockerów

| Status | Ryzyko / blocker | Właściciel | Plan działania | Etap |
|---|---|---|---|---|
| Otwarte | `dist` jest obecnie niespójny ze źródłami tokenów | Design System | Naprawić i zabezpieczyć testem w etapie 1 | 1 |
| Otwarte | React intensywnie używa obecnego kontraktu kolorów i `rv-*` | React + Design System | Zamrozić API i wykonywać regresję; nie migrować spacingu/typografii/scalingu | 0, 3, 9 |
| Otwarte | CRM ma dużą liczbę lokalnych użyć `--app-color-*` | Angular + Design System | Tabela mapowania, przejściowe aliasy i migracja obszarami | 0, 3, 8 |
| Zamknięte | Font CRM dla pierwszej iteracji | Design + Angular | Pozostawić Open Sans; ewentualną zmianę fontu prowadzić jako osobną decyzję i migrację | 0, 6 |

## Kryteria zakończenia całej pierwszej iteracji

- [ ] Design System jest jedynym źródłem tokenów używanych przez CRM.
- [ ] CRM importuje jeden CSS z paczki w konfiguracji buildu.
- [ ] `src/styles/colors.scss` został usunięty z CRM.
- [ ] Spacing, typografia i scaling CRM pochodzą z Design Systemu.
- [ ] React zachował dotychczasowe spacing, typografię i scaling `rv-*`.
- [ ] Istniejące kolory Reacta nie mają niezaakceptowanych regresji.
- [ ] Figma, pliki tokenów, wygenerowany CSS i Storybook mają udokumentowane mapowanie.
- [ ] Pipeline automatycznie wykrywa niespójności źródło → dist, light → dark i usunięcia publicznego API.
- [ ] Wszystkie tymczasowe aliasy zostały usunięte albo mają właściciela i termin usunięcia.
