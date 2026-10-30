---
name: angular-code-standards
description: >
  Standardy pisania kodu Angular 20 w tym zespole — SCSS, HTML, TypeScript.
  Wczytaj ZAWSZE gdy użytkownik prosi o: stworzenie lub modyfikację komponentu,
  serwisu, pipe'a, dyrektywy, modalu, formularza, animacji, pliku .ts z kodem
  aplikacyjnym Angulara albo pliku .html / .scss w projekcie Angular — nawet jeśli
  nie pada słowo "Angular". Dotyczy też
  próśb typu "dodaj komponent", "zmień styl", "napraw modal", "edytuj template",
  "popraw SCSS", refaktoryzacji, code review, implementacji feature'ów,
  debugowania i wszelkich pytań o styl kodu w tym projekcie. Zasady są
  obowiązkowe, nie opcjonalne.
  Wczytaj jako pierwszy krok przed generowaniem jakiegokolwiek kodu.
version: 1.28.0
author: n.koktysz@pleodigital.com
scope: SHARED
category: Angular
tags: []
---

Historia zmian jest w [references/history.md](references/history.md). Wczytuj ją tylko przy audycie wersji, analizie regresji zachowania skilla albo przygotowaniu publikacji.

# Standardy pisania kodu Angular — zasady zespołu

> Wczytaj ten skill przed napisaniem pierwszej linii kodu.
> Stosuj zasady od razu przy generowaniu.
> Nie cytuj ani nie przepisuj tego skilla w odpowiedzi do użytkownika, chyba że wprost o to poprosi.

---

## Zakres skilla

Dotyczy: komponenty, serwisy, pipe'y, dyrektywy, modale, formularze i pliki `.ts`
z kodem aplikacyjnym Angulara, a także pliki `.html` / `.scss` tych obszarów.

Nie dotyczy: `angular.json`, `tsconfig.json`, skryptów buildowych, testów E2E, plików konfiguracyjnych poza kodem aplikacyjnym.

Zanim założysz strukturę katalogów, odkryj lokalny układ projektu:

- sprawdź `package.json`, `angular.json` i aliasy importów, jeśli zmiana dotyczy nowego obszaru,
- znajdź najbliższe komponenty, kontenery, modale, formularze, serwisy, modele i testy przez `rg --files`,
- szukaj najpierw w tym samym feature/module/domain co edytowany plik, dopiero potem w katalogach shared/common/libs,
- traktuj nazwy katalogów takie jak `components`, `containers`, `pages`, `features`, `shared`, `common`, `ui`, `modals`, `services`, `models`, `styles` i `libs` jako wskazówki, nie jako wymagany standard,
- tokenów i globalnych stylów szukaj w lokalnych plikach stylów projektu oraz w paczce Design System używanej przez dany projekt.

---

## Triggery i antytriggery

MUSISZ wczytać skill przy promptach typu:

- "dodaj komponent", "wydziel komponent", "zmień styl buttona", "napraw modal",
- "edytuj plik `.ts` kodu aplikacyjnego Angulara", "edytuj `.html` / `.scss`", "popraw template", "uzupełnij typy",
- "dodaj formularz", "zmień tabelę/listę/kafle", "napraw loader/empty state",
- "sprawdź UI w Angularze", "zrób refaktor komponentu", "review kodu Angular".

NIE wczytuj go dla pytań ogólnych niezwiązanych z lokalnym projektem, np. "jak działa Angular routing" bez pracy na kodzie projektu.
Nie uruchamiaj go tylko dlatego, że prompt dotyczy skryptu `.ts` do builda lub
narzędzi albo pliku konfiguracyjnego; te pliki pozostają poza zakresem skilla.
Jeśli kontekst jest niejasny, zapytaj krótko:

```text
Czy mam potraktować to jako zmianę kodu Angular w tym projekcie i zastosować angular-code-standards?
```

---

## Minimalna checklista

- Zmienne pomocnicze: najpierw próba SCSS; własne `--...` tylko po wykazaniu ograniczenia SCSS i wyjaśnieniu wyjątku użytkownikowi → [1.5].

Po uwadze z CR albo korekcie użytkownika sprawdź ten sam wzorzec wyłącznie w plikach rzeczywiście ruszonych w bieżącym tasku, także we wskazanych przez użytkownika poprawkach ręcznych. Ustal tę listę z zakresu zadania i diffa; jeśli workspace zawiera cudze lub niezwiązane zmiany, cały niezacommitowany diff nie jest automatycznie zakresem taska. Nie skanuj całego projektu ani repozytorium. Popraw równoważne przypadki w tym zakresie i krótko podaj wynik przeglądu; szerszy audyt wymaga osobnego polecenia. Nie dopisuj kolejnego zakazu, jeżeli istniejąca reguła wystarcza — zastosuj ją konsekwentnie do tej listy plików.

Przed wygenerowaniem kodu sprawdź reguły naruszane najczęściej:

- Koszt rozwiązania: gdy planowana zmiana mnoży requesty przez elementy kolekcji, pobiera duże zbiory dla prostej decyzji albo powtarza pobrania, oceń koszt i przedstaw tańsze podejście przed implementacją; rozważ rozszerzenie istniejącego kontraktu BE → [3.20](references/conditional-playbooks.md#320-koszt-pobierania-danych-pomocniczych). Nie wymaga to rutynowego sprawdzania repo BE.
- SCSS: hierarchia zgodna z HTML → [1.1], nazwy klas wyłącznie w kebab-case → [1.3], tylko tokeny kolorów → [1.2].
- Wymiary: nie składaj stałych px z przypadkowych tokenów; zachowaj prostą wartość, gdy brak odpowiedniego tokenu → [1.6].
- Design System: najpierw publiczne API komponentu, override internali tylko lokalnie i z powodem → [1.4].
- HTML: brak stylów inline i klasy wyłącznie w kebab-case → [2.2], brak logiki wywoływanej podczas renderowania oraz audyt wywołań → [2.3], statyczne inputy bez `[]` → [2.1], długie wyrażenia w `@let` → [2.4], `@for` z stabilnym `track` → [2.7], poprawna kolejność atrybutów → [2.6].
- TypeScript: brak `any` → [3.2], jawne typy publicznych i klasowych symboli → [3.2], brak porównań do powtarzalnych stringów kontraktowych → [playbook 3.16](references/conditional-playbooks.md#316-powtarzalne-stringi-kontraktowe), nowe komponenty obowiązkowo na Signals API → [3.5], typed forms dla nowych modali → [3.3], sensowny reaktywny state → [3.4], parent/container buduje view model → [3.6], przed validatorem lub checkerem potwierdź konieczność reguły i osiągalność błędnego stanu, dopiero potem wykonaj discovery → [playbook 3.17](references/conditional-playbooks.md#317-discovery-przed-lokalnymi-mechanizmami-sprawdzającymi), ocena wpływu na testy → [3.11].
- Tłumaczenia: w każdym edytowanym pliku usuń zauważone, nietłumaczone polskie teksty UI; użyj wyłącznie istniejących prefiksów grup i wypisz użytkownikowi klucze z polskimi tekstami → [3.12].
- Refaktor UI: przed podmianą widoku wypisz kontrakt danych, stanu i interakcji; zachowaj payload parity → [playbook 3.13](references/conditional-playbooks.md#313-refaktor-ui-bez-regresji-kontraktu).
- Refaktor istniejącego widoku: jeśli użytkownik wskazuje wersję historyczną, porównaj najpierw commit bazowy z bieżącym kodem i oddziel zmiany domenowe od prezentacyjnych; nie przenoś przypadkowych zmian do reguł UI.
- Kolejna iteracja poprawki: sprawdź zaakceptowane wcześniej zachowanie tego obszaru; konflikt nowej zmiany z takim zachowaniem nazwij przed edycją, zamiast po cichu wycofywać poprzednią poprawkę → [3.13](references/conditional-playbooks.md#313-refaktor-ui-bez-regresji-kontraktu).
- Migracja kontrolek: przed podmianą komponentu zinwentaryzuj jego inputy, outputy, walidację, stan disabled/touched/error, reset, tryb edycji i selektory testowe; po podmianie sprawdź payload parity i kontrakt interakcji → [playbook 3.13](references/conditional-playbooks.md#313-refaktor-ui-bez-regresji-kontraktu).
- Style po migracji: przeskanuj zmienione pliki pod kątem globalnych selektorów (`label`, `.input`, `.select`), klas legacy, utility classes i magicznych wartości; style komponentu muszą być lokalne, zgodne z hierarchią HTML i oparte na dostępnych tokenach → [playbook 3.13](references/conditional-playbooks.md#313-refaktor-ui-bez-regresji-kontraktu).
- Komponenty UI bibliotek: przy regresji selected/hover/disabled sprawdź najpierw stabilność danych i stan komponentu, potem dopiero SCSS → [playbook 3.15](references/conditional-playbooks.md#315-istniejące-komponenty-ui-oparte-o-biblioteki).
- Inicjalizacja komponentu: krótki constructor rejestruje efekty, `ngOnInit` uruchamia jednorazowe procesy przez nazwane metody → [3.6a]; zależności efektu i cleanup zasobów → [3.7]–[3.8].
- Animacje: dla nowego kodu CSS + `animate.enter` / `animate.leave`, bez nowych legacy triggerów → [4].

## Warunkowe playbooki i twarde bramki

Nie wczytuj [pełnych playbooków](references/conditional-playbooks.md) przy prostej zmianie SCSS albo typów, jeśli żaden z poniższych warunków nie zachodzi. Gdy warunek zachodzi, wczytaj wyłącznie wskazaną sekcję przed edycją.

| Warunek | Twarda bramka pozostająca zawsze w mocy | Referencja |
| --- | --- | --- |
| Zastępujesz lub istotnie przebudowujesz komponent, modal, formularz, listę, tabelę albo inny widok. | Najpierw odtwórz kontrakt danych, stanu i interakcji. Refaktor frontend-only nie może zmienić payloadu ani wartości formularza bez jawnej decyzji. | [3.13 Refaktor UI](references/conditional-playbooks.md#313-refaktor-ui-bez-regresji-kontraktu) |
| Zmieniasz tabelę, listę, layout kolekcji, paginację, virtual scroll albo zachowanie przy węższym kontenerze. | Najpierw użyj publicznego API Design System i zachowaj wspólny model kolumn, stany oraz kontrakt interakcji. | [3.14 Tabele i kolekcje](references/conditional-playbooks.md#314-widoki-tabelaryczne-listy-i-layout-kolekcji) |
| Naprawiasz stan `selected`, `hover`, `disabled`, `readonly` albo `loading` komponentu bibliotecznego. | Najpierw sprawdź stabilność danych, wartość formularza i publiczne API komponentu; SCSS jest ostatnim krokiem. | [3.15 Komponenty bibliotek](references/conditional-playbooks.md#315-istniejące-komponenty-ui-oparte-o-biblioteki) |
| Dodajesz lub zmieniasz string kontraktowy FE/BE, status, typ, rolę, permission, kod języka albo wartość słownikową. | Użyj istniejącego enuma/modelu lub jednego typowanego źródła prawdy; nie utrwalaj powtarzalnego literalu. | [3.16 Stringi kontraktowe](references/conditional-playbooks.md#316-powtarzalne-stringi-kontraktowe) |
| Dodajesz validator, checker, predykat, guard wartości, normalizator albo podobny mechanizm sprawdzający. | Najpierw potwierdź, że reguła wynika z realnego kontraktu i że błędny stan jest osiągalny. Następnie wykonaj discovery publicznego API, shared utils i rozwiązań domenowych; nie duplikuj istniejącej semantyki. | [3.17 Discovery validatorów](references/conditional-playbooks.md#317-discovery-przed-lokalnymi-mechanizmami-sprawdzającymi) |
| Dodajesz nowy typ, tryb lub wariant do istniejącej funkcjonalności. | Odtwórz wspólny kontrakt i konieczne różnice; wskaż dotknięte stare warianty i ich weryfikację. | [3.18 Rozszerzanie o wariant](references/conditional-playbooks.md#318-rozszerzanie-istniejącej-funkcjonalności-o-wariant) |
| Operacja czeka na request lub modal, a zasób, uprawnienia albo widok mogą się zmienić. | Zachowaj tożsamość zasobu i sprawdź aktualny kontekst przed mutacją oraz zastosowaniem wyniku. | [3.19 Kontekst operacji](references/conditional-playbooks.md#319-kontekst-operacji-asynchronicznych) |
| Widok pobiera listy pomocnicze, opcje selektorów, szczegóły elementów kolekcji albo odświeża dane do walidacji lub akcji użytkownika. | Oceń lokalnie koszt requestów i zakres odświeżenia. Gdy rozwiązanie jest kosztowne, przedstaw koszt i tańszą alternatywę, w tym ewentualną zmianę kontraktu BE, przed jego wdrożeniem. | [3.20 Dane pomocnicze](references/conditional-playbooks.md#320-koszt-pobierania-danych-pomocniczych) |

## Priorytet reguł przy konflikcie

Stosuj kolejność:

1. jawna decyzja użytkownika albo specyfikacja,
2. lokalny kontrakt danych, requestów i zachowania UI,
3. istniejący wzorzec w edytowanym module, po potwierdzeniu jego poprawności,
4. zasady tego skilla,
5. ogólne preferencje Angulara.

### Reuse poprzedzony weryfikacją

Preferuj istniejące schematy projektu i Design Systemu zamiast nowych poziomów abstrakcji. Dotyczy to również obsługi dat, plików i komponentów typografii.

1. Przed dodaniem własnego rozwiązania znajdź najbliższy schemat projektu lub publiczne API DS i sprawdź, czy pokrywa wymaganie.
2. Nie uznawaj istniejącego użycia za poprawne tylko dlatego, że występuje w projekcie. Sprawdź kontrakt, wartości domyślne oraz działanie istotne dla zmiany; gdy deklaracja API nie wystarcza, zajrzyj do implementacji, testu lub runtime.
3. Jeśli schemat jest poprawny i wystarczający, użyj go bez dodatkowych adapterów, wrapperów i równoległych mechanizmów.
4. Jeśli wykryjesz nieścisłość albo brak możliwości, wskaż użytkownikowi dowód, wpływ na zadanie i najmniejszą propozycję rozwiązania. Nie przebudowuj mechanizmu ani nie twórz obejścia bez uzgodnienia obejmującego tę zmianę. Wcześniejsze wyraźne zlecenie takiego rozszerzenia pozostaje ważne; ogólne polecenie poprawy widoku nie oznacza zgody na przebudowę wspólnych mechanizmów.
5. Po wdrożeniu sprawdź zachowanie, którego dotyczyła zmiana, oraz kompatybilność dotkniętych użyć. Wyraźnie oddziel weryfikację kodu od sprawdzenia działania.

## Minimalna weryfikacja po zmianach

Ta sekcja pomaga dobrać właściwą weryfikację, ale sama nie daje zgody na
uruchomienie komend ani narzędzi runtime. Najpierw sprawdź instrukcje projektu i
zakres jawnie zlecony przez użytkownika. Nie uruchamiaj automatycznie builda,
type-checka, lintu, testów ani Chrome/runtime, jeżeli projekt lub użytkownik nie
udzielił takiej zgody. Bardziej restrykcyjna instrukcja projektu ma pierwszeństwo.

Po uzyskaniu wymaganej zgody dobierz najwęższy zakres do faktycznej zmiany i
skryptów aktualnego projektu. Najpierw sprawdź `package.json`, `angular.json` i
używany runner:

- type-check/build: preferuj lokalny build/type-check, np. `npm run build`, `npx ng build` albo dedykowany skrypt projektu,
- lint TS/HTML/SCSS: preferuj lokalny lint, np. `npm run lint`, `npx ng lint`, `npx eslint` albo `npx stylelint`,
- testy jednostkowe: wybierz najbliższy spec i lokalny runner Jest/Vitest/Karma zamiast pełnej suity,
- wizualny smoke-test: dla zmian UI sprawdź screenshot, console errors, overflow oraz istotne stany komponentu.

Aktualizacja pliku testowego w ramach implementacji nie oznacza zgody na jego
uruchomienie. Jeśli weryfikacja nie została zlecona albo nie można jej wykonać,
nie uruchamiaj jej i w odpowiedzi podaj ten fakt, rekomendowaną komendę oraz
residual risk.

---

## 1. SCSS

### [1.1] Hierarchia

Zawsze zagnieżdżaj SCSS zgodnie ze strukturą HTML.

### [1.2] Kolory

Nigdy nie używaj `#hex`, `rgb()` ani `rgba()`.
Zawsze używaj tokenów z lokalnego źródła prawdy Design System danego projektu.
Jeśli projekt używa `@design-system/design-system`, typowym miejscem jest `node_modules/@design-system/design-system/assets/styles/ds-theming.scss`; jeśli używa innej paczki albo lokalnych tokenów, znajdź właściwy plik przez importy SCSS i istniejące użycia tokenów.
Jeśli potrzebnego tokenu nie ma, nie zgaduj wartości z Figmy ani z inspektora. Zrób jedno z poniższych:

- zaproponuj najbliższy istniejący token i poproś o potwierdzenie,
- zasugeruj dodanie brakującego tokenu do Design System,
- zatrzymaj się, jeśli kolor jest krytyczny dla brandu albo statusu.

Gotowy komunikat:

```text
Nie widzę pasującego tokenu dla tego koloru. Najbliższy wygląda na `<token>`, ale nie użyję go bez potwierdzenia, bo w projekcie nie zapisujemy surowych hex/rgb.
```

### [1.3] Nazwy klas

Wszystkie własne klasy CSS zapisuj wyłącznie w kebab-case: małymi literami, z segmentami oddzielonymi pojedynczym `-`.
Nie używaj `_`, `__`, camelCase, PascalCase ani modyfikatorów BEM z `--`.
Reguła obejmuje HTML, SCSS, klasy przekazywane przez inputy oraz klasy tworzone dynamicznie.
Nie zmieniaj nazw klas bibliotek zewnętrznych, których projekt nie kontroluje.
Preferuj krótkie, semantyczne nazwy i hierarchię SCSS zamiast powtarzania pełnej nazwy komponentu.

### [1.4] Design System i override budget

Najpierw używaj publicznego API komponentów Design System i istniejących wariantów.
Nie odtwarzaj ręcznie komponentów Design System, jeśli DS ma gotowy komponent albo publiczne API pasujące do zadania. Dotyczy to zwłaszcza komponentów formularzowych, tabelarycznych, nawigacyjnych, overlayowych, ikon, linków i akcji.

Override internali Design System (`::ng-deep`, `.mdc-*`, prywatne klasy DS, style zagnieżdżone w komponentach bibliotek) traktuj jako ostatnią opcję.
Jeśli override jest konieczny:

- ogranicz selector do lokalnego wrappera komponentu,
- zmieniaj najmniejszą możliwą liczbę właściwości,
- nie zmieniaj globalnego zachowania komponentu DS,
- nie nadpisuj rozmiaru, paddingu albo tła komponentu DS, jeśli ten sam efekt da się osiągnąć przez input, wariant, `customClass` albo istniejący token,
- po zmianie sprawdź przynajmniej stan default, hover, disabled i selected, jeśli komponent te stany posiada.

Nie używaj `!important` poza wąskim override'em internala biblioteki, gdy publiczne API komponentu nie pozwala osiągnąć wymaganego efektu.

### [1.5] Zmienne pomocnicze: SCSS przed CSS

Własne pomocnicze wartości komponentu zapisuj jako zmienne SCSS (`$...`),
parametry mixinów lub mapy SCSS. Nie twórz CSS custom properties (`--...`) tylko
po to, by skrócić deklarację, przekazać stałą do potomka albo wygodniej opisać wariant.

Obowiązkowa kolejność przed dodaniem własnej zmiennej CSS:

1. Najpierw przygotuj rozwiązanie SCSS: zmienną, mixin albo mapę oraz selektory
   stanów/rozmiarów. Sprawdź, czy pokrywa wymagane kombinacje bez zmiany kaskady.
2. Dopiero gdy konkretne wymaganie nie może być spełnione przez to rozwiązanie,
   możesz wypróbować CSS custom property. Sama krótsza implementacja, preferencja
   autora ani brak pierwszej próby SCSS nie uzasadniają odstępstwa.
3. Wyjaśnij użytkownikowi, którą próbę SCSS wykonałeś, dlaczego nie spełniła
   wymagania oraz dlaczego CSS rozwiązuje ten problem. Zapisz krótkie uzasadnienie
   przy deklaracji lub w dokumentacji kontraktu. Bez tego wyjątek nie przechodzi review.
4. Weryfikuj zakres dziedziczenia, właściciela wartości i konsumentów zmiennej;
   sprawdź stany, rozmiary i kolejność selektorów objętych zmianą. Nie deklaruj
   powodzenia runtime na podstawie samej analizy kodu. Wymagane zgody projektu
   na kompilację/testy/runtime nadal obowiązują.

Ta bramka dotyczy **własnych zmiennych pomocniczych**. Korzystaj nadal z istniejących
semantic tokenów DS przez `var(--...)`: theme, responsive mode i runtime override
są częścią ich publicznego kontraktu. Zmienna SCSS może przechowywać `var(--token)`;
nie zamrażaj jego aktualnej wartości px/koloru i nie dodawaj aliasu CSS.
Nie przepisuj istniejącego publicznego API CSS biblioteki bez sprawdzenia jego użyć.
Nowe tokeny DS podlegają osobnemu uzgodnieniu; lokalny alias nie staje się tokenem
przez samą zmianę nazwy.

### [1.6] Wymiary bez sztucznego składania tokenów

Używaj odpowiedniego istniejącego tokenu dla danej wartości i roli. Jeśli takiego
tokenu nie ma, istniejący wymiar może pozostać w `px`. Nie zaokrąglaj go do
najbliższego tokenu i nie zastępuj sumą, różnicą ani wielokrotnością przypadkowych
tokenów tylko po to, żeby usunąć piksele: `130px` jest czytelniejsze niż
`calc(var(--spacing-128) + var(--spacing-2))`. Analogicznie zostaw
`calc(100% - 175px)`, zamiast składać `175px` z kilku tokenów.

Zachowuj obliczenia opisujące rzeczywistą zależność layoutu, np. rozmiar ikony
plus dwukrotność paddingu albo pozostałą szerokość po odjęciu szerokości panelu.
Nie zamieniaj na px tokenów semantycznych zależnych od motywu, responsywności
lub runtime. Ta zasada nie zmienia wymogu używania tokenów kolorów.

---

## 2. HTML

### [2.1] Statyczne inputy

Dla statycznych stringów używaj zwykłych atrybutów HTML.
Nie używaj `[input]="'wartość'"`.

Wyjątek: `[attr]="expression"` jest poprawne, gdy wartość pochodzi ze zmiennej lub wyrażenia.

### [2.2] Klasy CSS

Preferuj nazwy budujące hierarchię, np. `wrapper`, `main`, `sub`, `box`, `line`, `header`, `body`, `footer`, `inner`, `content`, `group`.
Unikaj powtarzania pełnej nazwy komponentu na każdym poziomie.
Stosuj wyłącznie kebab-case zgodnie z [1.3].
Nie używaj stylów inline: `style="..."`, `[style]`, `[style.*]` ani `[ngStyle]`.
Stałe reguły przenoś do SCSS komponentu, a warianty prezentacji wyrażaj przez semantyczne klasy i bindingi `[class.nazwa-wariantu]`.

### [2.3] Metody w szablonie

Nie wywołuj w szablonie metod komponentu, serwisu ani obiektu, które podczas change detection:

- mapują, filtrują, sortują albo formatują dane,
- sprawdzają predykat lub permission,
- tworzą `Observable`, kolekcję albo inny nowy obiekt,
- wykonują odczyt, który można przygotować raz w TypeScript, np. `asObservable()`.

Preferuj kolejno:

1. przygotowaną właściwość, `signal()` albo `computed()`,
2. `@let` dla długich lub powtarzanych wyrażeń,
3. czysty `pipe` dla reużywalnej transformacji,
4. `protected get` tylko dla trywialnego, niealokującego odczytu i gdy pasuje do istniejącego stylu pliku.

Nie traktuj składni wywołania jako automatycznego naruszenia. Dozwolone są:

- odczyty `signal()` i `computed()`, ponieważ są reaktywnym kontraktem template'u,
- handlery uruchamiane wyłącznie przez output lub zdarzenie użytkownika, np. `(buttonClick)="submit()"`,
- intrinsics kompilatora Angulara, np. `$any()`, jeśli istniejący kontrakt naprawdę ich wymaga.

Handler zdarzenia powinien delegować do logiki w TypeScript i nie zawierać rozbudowanego wyrażenia w HTML. Nie zastępuj signala getterem tylko po to, aby usunąć nawiasy.

Po zmianie template'u przeskanuj zmienione pliki pod kątem składni wywołań i sklasyfikuj wyniki, zamiast wykonywać ślepy refaktor. Przykładowy skan kandydatów:

```text
rg -n "[A-Za-z_$][A-Za-z0-9_$]*\\s*\\(" <zmienione-pliki-html>
```

W raporcie lub review traktuj jako finding wyłącznie logikę renderowania, a nie poprawne odczyty signali i handlery zdarzeń.

### [2.4] `@let`

Używaj `@let`, gdy wyrażenie jest długie, zagnieżdżone albo powtarza się w szablonie.

### [2.5] Mapowanie danych

Dane do wyświetlenia przygotowuj w TypeScript.
Nie przenoś logiki transformacji do szablonu ani do metod wywoływanych z szablonu.

Dla nowych integracji FE-BE trzymaj nazwy pól i kontrakt możliwie 1:1 z DTO backendowym.
Nie twórz mapperów, adapterów ani lokalnych aliasów tylko po to, żeby zmieniać nazwy pól po stronie frontu.

Nowe pola FE dodawaj tylko wtedy, gdy są naprawdę potrzebne do:

- wartości pochodnych lub prezentacyjnych,
- normalizacji danych,
- scalania wielu źródeł danych.

### [2.6] Kolejność atrybutów komponentu

W szablonach Angular zachowuj stałą kolejność atrybutów:

1. dyrektywy
2. `class="..."`
3. statyczne inputy bez `[]`
4. inputy z `[]`
5. outputy z `()`
6. animacje, np. `animate.enter` i `animate.leave`

### [2.7] Control flow

Dla nowego kodu preferuj wbudowany control flow Angulara: `@if`, `@for`, `@switch`.

Dla każdego `@for` dodawaj stabilny `track`.
Nie używaj `track $index`, jeśli lista może być filtrowana, sortowana, przeładowana z backendu albo elementy mogą zmieniać kolejność.

Używaj `@empty`, gdy widok ma jawny stan pustej listy.

---

## 3. TypeScript

### Czytelne odstępy między metodami i funkcjami

W nowym i zmienianym kodzie TypeScript zostawiaj jedną pustą linię między metodami klasy, getterami, setterami, konstruktorem i hookami lifecycle oraz między samodzielnymi deklaracjami funkcji. Oddziel też ostatnie pole klasy od pierwszej metody. Komentarz lub JSDoc pozostaje przy deklaracji, którą opisuje; pustą linię umieść przed nim.

Zasada obejmuje komponenty, serwisy, dyrektywy, helpery, mocki oraz klasy stubów i harnessów w testach. Nie dodawaj pustej linii między każdym polem klasy ani każdą instrukcją wewnątrz metody. Zachowaj zwarte, logiczne grupy instrukcji.

Przed oddaniem zmiany przeczytaj dotknięte deklaracje pod kątem zlewających się metod. Samo uruchomienie Prettiera nie gwarantuje dodania tych odstępów. Przy poprawce wyłącznie formatowania potwierdź, że diff nie zmienia zachowania; audyt ogranicz do plików bieżącego zadania i zachowaj ręczne poprawki użytkownika.

### [3.1] Jednorazowe callbacki

Jeśli callback jest `private`, używany tylko raz i prosty, trzymaj go inline zamiast wydzielać osobną metodę.

Przed wydzieleniem nowej metody upewnij się, że metoda nazywa realny krok domenowy, transformację danych albo reużywalny fragment logiki.
Nie twórz mechanicznych metod tylko po to, żeby ukryć pojedynczą instrukcję UI, jeśli przez to komponent dostaje sztuczne API albo traci czytelny przepływ.
Nie wydzielaj prywatnych helperów używanych tylko raz dla krótkich warunków, prostych ternary albo mapowania dwóch kluczy/etykiet.
W takim przypadku użyj krótkiego `if` albo ternary bezpośrednio w miejscu użycia.
Helper ma sens dopiero, gdy logika jest reużywana, opisuje realny krok domenowy, ogranicza istotną złożoność albo ma własną wartość testową.

### [3.2] Typowanie

Nie używaj `any`, jeśli da się podać lepszy typ.
Preferuj `unknown`, generyki albo jawny interfejs.
Nie usuwaj istniejących poprawnych typów.

W zmienianym i nowym kodzie TypeScript zawsze dodawaj jawne typy dla:

- właściwości klas, zwłaszcza pól reaktywnych i strumieni, np. `public suppliers$: Observable<Supplier[]>`,
- metod klas, w tym metod `private`, np. `private getLoadedSelector(): Observable<boolean>`,
- funkcji pomocniczych eksportowanych z pliku,
- callbacków RxJS i NgRx, jeśli IDE sugeruje typ parametru lub zwracanej wartości,
- lokalnych zmiennych przechowujących strumienie albo wynik selectorów.

Nie zostawiaj typu do samej inferencji, jeśli symbol jest częścią klasy, serwisu, effectu, komponentu, selectora, factory kolumn albo helpera używanego poza lokalnym callbackiem.

### [3.2a] Błędy typów w API frameworka i bibliotek

Gdy TypeScript zgłasza błąd dla wywołania API frameworka lub biblioteki, nie usuwaj ani nie podmieniaj argumentu, opcji albo query tylko po to, by błąd zniknął. Najpierw:

1. odczytaj publiczną deklarację z faktycznie zainstalowanej wersji paczki i ustal właściwy overload, generyki oraz obsługiwane opcje;
2. potwierdź, jaki obiekt i zachowanie runtime zapewnia każde rozważane wywołanie;
3. zachowaj dotychczasową semantykę albo nazwij użytkownikowi świadomą zmianę zachowania przed jej wprowadzeniem.

Dotyczy to w szczególności query, referencji do elementów, callbacków, eventów i opcji API. Błąd typów jest sygnałem do sprawdzenia kontraktu, nie zgodą na uproszczenie go kosztem działania widoku.

### [3.3] Modale

Przy otwieraniu modali preferuj wzorzec `const modal = ...`, aby zamykać modal przez referencję lokalną.

Nowe modale formularzowe muszą mieć typed form:

- `FormGroup<T>` dla formularza,
- jawne `FormControl<T>` dla kontrolek,
- payload budowany i normalizowany w TypeScript przed requestem,
- walidacje, disable/enable i stany zapisu prowadzone w TS, bez ad hoc kontrolek i warunków biznesowych rozproszonych po template,
- submit guard / in-flight guard, żeby szybkie wielokrotne kliknięcia nie wysyłały kolejnej mutacji.

### [3.4] Reaktywny state

Dobieraj strukturę stanu do rzeczywistej liczby i tożsamości zasobów. Dla kilku stałych źródeł danych preferuj nazwane sygnały lub strumienie; mapę statusów stosuj dla kolekcji zasobów identyfikowanych kluczem, gdy widok rzeczywiście obsługuje wiele takich zasobów. Sama możliwość wystąpienia różnych urządzeń albo wariantów nie uzasadnia mapy, jeżeli aktywny widok korzysta z jednego z nich. Odczyt istniejącego sygnału serwisu nie wymaga tworzenia i synchronizowania drugiej kopii stanu. Stan zbiorczy wyliczaj przez `computed()` albo pipeline RxJS.

Preferuj:

- `signal()` dla lokalnego stanu komponentu,
- `BehaviorSubject` dla stanu z wieloma subskrybentami lub historią,
- `Subject` dla zdarzeń jednorazowych,
- zwykłą właściwość tylko dla prostych, statycznych wartości.

Globalne zdarzenia środowiska, takie jak viewport albo device type, obsługuj w
właścicielu infrastruktury i udostępniaj przez publiczny `Observable` albo signal.
Komponent potomny ma konsumować ten stan; nie dodawaj równoległego `HostListener`
do `window`/`document`, chyba że serwis nie udostępnia potrzebnego kontraktu.

Operacje zależne od zmiennej tożsamości zasobu prowadź według [3.19](references/conditional-playbooks.md#319-kontekst-operacji-asynchronicznych); stan pochodny wyliczaj zamiast synchronizować kopie flag.

### [3.5] Nowoczesne API komponentów

Dla nowych komponentów ZAWSZE używaj signalowego API Angulara jako domyślnego kontraktu komponentu:

- `input()` dla wejść komponentu,
- `input.required<T>()` dla obowiązkowych wejść,
- `output()` dla zdarzeń komponentu,
- `model()` tylko dla świadomego two-way bindingu,
- `viewChild()` / `viewChildren()` / `contentChild()` / `contentChildren()` dla query,
- `signal()` dla lokalnego mutowalnego state'u,
- `computed()` dla wartości pochodnych.

Typuj `input()`, `input.required<T>()`, `output()` i `model()` jawnie.
Aliasy stosuj tylko wtedy, gdy wynikają z istniejącego publicznego API albo kompatybilności wstecznej.
Pola inicjalizowane przez `input()`, `output()`, `model()` i query oznaczaj jako `readonly`, jeśli lokalny wzorzec pliku temu nie przeczy.
Właściwości używane tylko przez template preferuj jako `protected`, żeby nie poszerzać publicznego API klasy.

Nie używaj w nowych komponentach `@Input()`, `@Output() EventEmitter`, `@ViewChild`, `@ViewChildren`, `@ContentChild` ani `@ContentChildren`, jeśli nie ma konkretnego powodu kompatybilności.
Odstępstwo od Signals API jest dopuszczalne tylko wtedy, gdy wymusza je istniejący publiczny kontrakt, dziedziczenie, API zewnętrznej biblioteki, test harness albo etapowa migracja legacy kodu. Jeśli odstępujesz od tej zasady, nazwij powód w odpowiedzi.

W istniejących komponentach migruj dotykany fragment do Signals API tylko wtedy, gdy nie poszerza to zakresu zmiany i nie zwiększa ryzyka regresji. Nie rób szerokiej migracji dekoratorów przy okazji małej poprawki.

Preferuj `standalone` komponenty i lokalne `imports`, jeśli plik lub moduł w okolicy już działa w tym stylu.
Angular 20 traktuje standalone jako domyślny kierunek, ale istniejące projekty mogą mieć jawne `standalone: true`, NgModules albo mieszany etap migracji; zachowaj lokalną konwencję w edytowanym obszarze zamiast robić migrację przy okazji.
Nie mieszaj nowego stylu z legacy wzorcem tylko po to, żeby refaktoryzować niepowiązany kod.

Preferuj `inject()` dla nowych zależności w komponentach, dyrektywach, pipe'ach i serwisach.
Zostań przy constructor injection, jeśli zachodzi którykolwiek z poniższych warunków:

- plik już konsekwentnie używa konstruktora,
- klasa dziedziczy po bazie wymagającej konstruktora,
- zmiana wymagałaby szerszego refaktoru niepowiązanego z bieżącym zadaniem.

Edge case: jeśli legacy komponent używa constructor injection, nie migruj go do `inject()` tylko dlatego, że dotykasz jednego inputu, stylu albo małej metody.

### [3.6] Pattern discovery i odpowiedzialności komponentów

Przed dodaniem nowego komponentu w istniejącym module sprawdź lokalne wzorce:

- sąsiednie komponenty i kontenery,
- istniejące modale/formularze/listy w tym samym obszarze,
- obecny sposób pobierania danych, routingu, loaderów i testów,
- istniejące modele albo view modele w module.

Sprawdź też projektową konwencję osobnych plików TS, HTML i SCSS oraz dopuszczalne wyjątki dla template/styles inline. Stosuj ją od pierwszej wersji komponentu; nie zakładaj, że mały rozmiar komponentu sam uzasadnia odstępstwo. Nie narzucaj jednej konwencji plików wszystkim projektom korzystającym z tego współdzielonego skilla.

Preferuj rozwinięcie istniejącego wzorca zamiast tworzenia równoległego flow.
Jeśli istniejący wzorzec narusza inne zasady tego skilla, poinformuj użytkownika zamiast automatycznie powielać albo refaktoryzować cały moduł.

Przed dodaniem komponentu pomocniczego lub innej warstwy abstrakcji porównaj ją z prostym rozwiązaniem w istniejącym komponencie. Wydzielaj wspólny komponent, gdy upraszcza odpowiedzialność, kontrakt albo utrzymanie; samo podobieństwo kilku krótkich fragmentów HTML nie wystarcza. Uwzględnij koszt nowych plików, inputów, outputów i przekazywania zdarzeń przez pośredników. Krótkie lokalne powtórzenie może być czytelniejsze; nie oznacza to zakazu reużywalnych komponentów ani map stanu.

Domyślnie parent/container buduje view model, wykonuje requesty i obsługuje flow widoku, a child prezentacyjny renderuje przekazane dane i emituje intencje użytkownika. Nie przenoś requestów do child komponentu tylko dlatego, że dane są w nim wyświetlane.

Rozróżniaj child prezentacyjny od samodzielnego widgetu funkcjonalnego. Widget może odczytywać współdzielone dane i status oraz obsługiwać retry bezpośrednio przez istniejący serwis, jeśli odpowiada to jego odpowiedzialności i lokalnej architekturze. Nie przekazuj technicznych statusów i retry przez komponenty pośrednie, które ich nie wykorzystują; nie zmieniaj jednak komponentu prezentacyjnego w zależny od serwisu wyłącznie dla skrócenia bindingów. Zachowaj jednego właściciela pobierania i cache: samo utworzenie widgetu nie powinno ponownie pobierać danych już współdzielonych przez widok, a retry powinno ponawiać tylko nieudane źródło. Rodzic może nadal odczytywać stan potrzebny do układu lub widoczności; nie duplikuj przy tym stanu requestu.

Jeśli komponent ma być reużywalną zawartością, nie dodawaj do niego API zależnego od konkretnego hosta, np.:

- `modalMode`,
- `closeProfiles`,
- lokalnego close buttona,
- lokalnej nawigacji kontenera.

Takie zachowania trzymaj w hoście: modalu, zakładkach, panelu albo kontenerze routingu.

### [3.6a] Constructor, `ngOnInit` i metody inicjalizacyjne

W nowych i przebudowywanych komponentach stosuj domyślny podział:

- constructor: wstrzykiwanie zależności, jeśli wymaga go istniejący styl, oraz rejestracja efektów i operacji wymagających injection context;
- `ngOnInit`: jednorazowe uruchomienie pobierania danych i subskrypcji formularza/zdarzeń, które nie wymagają ponownej rejestracji po zmianie sygnałów;
- prywatne metody: implementacja odrębnych procesów, np. `observeSurveyChanges()`, `observeAssignmentChanges()` i `observeOptionSearch()`.

Constructor i `ngOnInit` mają pozostać krótkimi punktami orkiestracji. Nie przenoś rozbudowanego konstruktora w całości do `ngOnInit`: wydziel długie pipeline'y, pętle rejestrujące subskrypcje i logikę domenową do metod nazwanych według odpowiedzialności. Zachowaj kolejność inicjalizacji i jedno miejsce rejestracji każdego procesu. Krótkie callbacki pozostaw inline zgodnie z [3.1]; nie twórz mechanicznych helperów dla pojedynczych instrukcji.

To konwencja czytelności i cyklu życia, nie optymalizacja wydajności ani bezwzględny zakaz subskrypcji w constructorze. Constructor i `ngOnInit` wykonują się raz na instancję; callback efektu może wykonywać się wielokrotnie. Zachowaj uzasadniony lokalny wzorzec, gdy przeniesienie zmieniałoby wymagany moment rejestracji albo zachowanie synchronicznych emisji.

W `ngOnInit` początkowe inputy są ustawione, ale hook nie obsługuje ich późniejszych zmian ani nie gwarantuje gotowego DOM/query widoku. Nie odczytuj wymaganego inputu bezpośrednio w constructorze. `ngOnInit` nie zapewnia injection context: przechwyć `DestroyRef`/`Injector` przez `inject()` w polu lub constructorze i przekazuj je jawnie do API, które ich potrzebuje, np. `takeUntilDestroyed(this.destroyRef)`. Metoda wywołana synchronicznie z constructora nadal działa w jego injection context; ta sama metoda wywołana z `ngOnInit` już go nie otrzymuje.

Przed dodaniem lub przeniesieniem efektów/subskrypcji wczytaj [inicjalizację i efekty](references/initialization-and-effects.md), zwłaszcza zasady śledzenia odczytów w wydzielonych metodach i cleanupu między wykonaniami.

`ngOnChanges` jest niezalecane i dopuszczalne wyłącznie w ostateczności, gdy istniejący kontrakt lub kompatybilność wyklucza prostsze rozwiązanie. Dla stanu pochodnego preferuj signalowe inputy i `computed()`; w dotykanym legacy kodzie rozważ wąskie settery inputów, jeżeli szeroka migracja zwiększa ryzyko. Skutki uboczne obsługuj zgodnie z [3.7], a requesty przez właściwy pipeline. Jeśli `ngOnChanges` jest konieczne, nazwij konkretny powód i ogranicz reakcję do istotnych zmian inputów. Nie wymieniaj go mechanicznie na efekt synchronizujący kopie stanu ani nie migruj niepowiązanego kodu.

### [3.7] `computed()` i `effect()`

Używaj `computed()` dla synchronicznych wartości pochodnych z signali.
Nie duplikuj wartości pochodnej w osobnym `signal()`, jeśli da się ją wyliczyć deterministycznie.
Nie opakowuj zmiennych zwykłych pól w `computed()` bez reaktywnego źródła: ich zmiany nie unieważniają cache. Dla tanich getterów nie deklaruj poprawy performance bez pomiaru.

Efekt śledzi wszystkie faktycznie wykonane synchroniczne odczyty sygnałów, także w wywołanych metodach; pierwsza linijka i deklaracje `const` nie mają specjalnego znaczenia. Zależności są dynamiczne. Używaj `untracked()` tylko dla celowo pomocniczych odczytów, których zmiany nie powinny uruchamiać efektu; nie maskuj nim pętli ani brakującej reaktywności. Szczegóły i przykłady: [inicjalizacja i efekty](references/initialization-and-effects.md).

Używaj `effect()` tylko dla realnych efektów ubocznych, np. synchronizacji z zewnętrznym API, storage albo integracją nieangularową. Nie używaj `effect()`, gdy zachodzi którykolwiek z poniższych warunków:

- zwykłe mapowanie danych pod template (użyj `computed()`),
- chain RxJS odpowiadający za requesty, retry, cancelację albo obsługę błędów,
- ręczne przepychanie state'u między signalami, jeśli wystarczy `computed()`.

Nie zapisuj do signali wewnątrz `effect()` bez wyraźnego powodu i ochrony przed pętlą aktualizacji.

Wyjątek: gdy komponent ma lokalny, mutowalny signal reprezentujący wybór lub
stan interakcji, a wartość źródłowa przychodzi z `input()`, użyj `effect()` do
resetowania albo synchronizacji lokalnego stanu po zmianie inputu. Taki efekt
jest uzasadniony tylko wtedy, gdy użytkownik może zmieniać lokalny signal
niezależnie od inputu i samo `computed()` nie wystarcza. W callbacku efektu
odczytaj aktualny input, ustaw lokalny stan na wartość pochodną od tego inputu
i nie modyfikuj inputu ani źródła rodzica.

Przed zapisaniem do signala w `effect()` sprawdź:

- czy signal jest lokalnym stanem interakcji, a nie tylko wartością do
  wyświetlenia,
- czy input może zmienić się po utworzeniu komponentu,
- czy synchronizacja nie tworzy pętli aktualizacji,
- czy efekt powinien reagować tylko na input źródłowy, a nie na własny signal.

Przykładowy wzorzec:

```ts
protected readonly selectedId = signal<number | null>(null);

public constructor() {
  effect((): void => {
    this.selectedId.set(this.valueFromParent()?.id ?? null);
  });
}
```

Nie stosuj tego wyjątku do zwykłego mapowania danych pod template — tam nadal
preferuj `computed()`.

### [3.7a] Obserwatory i pomiary DOM

Przy dodawaniu lub zmianie obserwatora albo powtarzalnych pomiarów layoutu stosuj [zasady zakresu obserwacji i pomiarów](references/initialization-and-effects.md#zakres-obserwacji-i-pomiary-dom). Ustal realne zdarzenia wyzwalające, ogranicz obszar obserwacji i współdziel odczyty w jednym przebiegu; nie uznawaj samego RAF ani pracy poza strefą Angulara za dowód optymalizacji.

### [3.8] Czyszczenie subskrypcji i zasobów

Dla ręcznych subskrypcji RxJS preferuj `takeUntilDestroyed()` i `DestroyRef`.
Nie dodawaj nowego `destroy$`, jeśli można użyć standardowego mechanizmu Angulara.

Zasoby tworzone przy każdym wykonaniu efektu sprzątaj przez `onCleanup` przed kolejnym przebiegiem i przy zniszczeniu efektu. Samo `takeUntilDestroyed()` nie zamyka subskrypcji między przebiegami; niezależne subskrypcje rejestruj raz poza callbackiem efektu. Przykład i dobór RxJS: [inicjalizacja i efekty](references/initialization-and-effects.md#subskrypcje-i-cleanup).

Dla timerów, listenerów i integracji spoza Angulara pilnuj jawnego cleanupu.
Jeśli cleanup jest lokalny i prosty, trzymaj go blisko miejsca utworzenia zasobu.

### [3.9] Requesty i refresh flow

W SkillBox i GoCouriers napotkany podczas pracy select z opcjami pobieranymi przez `noPaginationParams`, `MapPaginatedContent` albo równoważny fetch-all przełącz na paginowany loader DS według [guide’a migracji selectów](../boxes-design-system/references/select-pagination-migration.md). Wczytaj go tylko w tym przypadku, przed edycją; zachowaj kontrakt formularza i zgłoś konkretny blocker API, jeśli bezpieczna migracja nie jest możliwa. Nie obejmuj tą regułą statycznych list ani pozostałych zastosowań pełnej kolekcji.

Dla jednej akcji użytkownika wybieraj jedno źródło odświeżenia danych:

- albo aktualizację lokalnego stanu z odpowiedzi mutacji,
- albo jeden kanoniczny refetch.

Nie rób obu naraz dla tego samego zasobu.

Nie dociągaj endpointu details, jeśli endpoint listy albo odpowiedź mutacji zwraca komplet danych potrzebnych do UI.

Guarduj akcje in-flight, żeby szybkie wielokrotne kliknięcia nie wysyłały drugiego requestu.

Przy pollingu utrzymuj tylko jeden aktywny timer albo subskrypcję dla danego zasobu.

Mocki w kodzie aplikacyjnym traktuj jako tymczasowy debt.
Jeśli musisz dodać mock z powodu brakującego backendu, trzymaj go jawnie za flagą środowiskową, domyślnie wyłączoną, i opisz warunek usunięcia.

Dla list pomocniczych i selektorów zastosuj [3.20](references/conditional-playbooks.md#320-koszt-pobierania-danych-pomocniczych). Sam `switchMap` nie usuwa zbędnych requestów uruchamianych na wejściu.

### [3.10] Sprzątanie po refaktorze

Po zmianie API komponentu albo przepływu danych usuń martwe elementy:

- nieużywane metody,
- nieużywane inputy i outputy,
- nieużywane parametry `ngTemplateOutletContext`,
- nieużywane importy,
- pola pochodne, które przestały być czytane,
- testowe dane albo mocki niepodpięte do aktualnego flow.

Nie zostawiaj pozostałości "na później", jeśli nie są celowym TODO związanym z blokadą zewnętrzną.

### [3.11] Wpływ zmian `.ts` na testy

Przed utworzeniem albo aktualizacją pliku testowego ustal faktycznie używany runner,
komendę uruchamiającą test oraz to, czy konfiguracja obejmuje dany plik. Sama obecność
`*.spec.ts` obok komponentu nie jest dowodem, że test jest wykonywany. Jeżeli projekt
nie ma działającego runnera dla tego pliku, rozszerz istniejący wykonywalny harness
albo jawnie zgłoś brak uruchamialnego pokrycia; nie deklaruj takiego testu jako
zweryfikowanego.

Jeśli modyfikujesz plik `.ts`, sprawdź, czy obok istnieje `.spec.ts`.
Jeśli istnieje i zmiana dotyka logiki, stanu, inputów, outputów, requestów albo warunków w template, zaktualizuj test.
Nie wymagaj aktualizacji testów tylko dla czystej zmiany SCSS.

Nie uruchamiaj testów jednostkowych automatycznie po aktualizacji speca. Wykonaj je
wyłącznie na wyraźne polecenie użytkownika, w najwęższym wskazanym zakresie. Pełna
suita wymaga osobnego uprzedzenia o koszcie czasu i tokenów oraz potwierdzenia.
Walidacja runtime/Chrome Debug również wymaga jawnej zgody zgodnie z instrukcją projektu.
Ta bramka autoryzacji ma pierwszeństwo nad przykładami komend z sekcji
„Minimalna weryfikacja po zmianach”.

W odpowiedzi końcowej krótko zaznacz wpływ zmian `.ts` na testy:

- jeśli trzeba było zmienić testy, napisz czy zostały zmienione,
- jeśli testów nie ma, a zmiana zwiększa ryzyko regresji, zaproponuj ich dodanie,
- jeśli testów nie trzeba, napisz dlaczego.

Gotowy format:

```text
Testy: zaktualizowano `<plik>.spec.ts` / brak testów w pobliżu — rekomenduję dodać `<zakres>` / nie wymagało zmian, bo dotyczyło wyłącznie SCSS.
```

### [3.12] Tłumaczenia i nowe klucze

Jeżeli po handoffie użytkownik prosi o kompletne query, INSERT, UPSERT albo
migrację tłumaczeń dla GoCouriers, wczytaj
`skills/gocouriers-translation-query/SKILL.md`. Ten skill pozostaje właścicielem
generowania wielojęzycznego SQL i jego walidacji; nie rozszerzaj zasad Angulara o
schemat bazy ani samodzielnie nie stosuj angielskich fallbacków.

Nie dodawaj nowych wpisów do plików i18n/tłumaczeń podczas implementacji FE, chyba że użytkownik jawnie poprosi o edycję słowników.

Jeżeli projekt ma potwierdzony proces dodawania tłumaczeń przez osobne UI, CMS albo panel administracyjny, pełny nowy klucz użyty w kodzie nie musi jeszcze istnieć w słownikach trzymanych w repo. Traktuj listę kluczy z polskimi tekstami przekazaną użytkownikowi jako prawidłowy handoff do tego procesu.

W takim projekcie nie klasyfikuj samego braku wpisu słownikowego jako blockera implementacji, błędu runtime ani findingu blokującego code review lub publikację skilla. Nie wymagaj też dopisania wpisu do repo w tym samym zadaniu. Zgłoś brak wyłącznie informacyjnie w formacie wymaganym niżej. Blocker występuje dopiero wtedy, gdy projekt nie ma potwierdzonego zewnętrznego procesu uzupełniania tłumaczeń albo użytkownik jawnie wymaga kompletnego słownika przed wdrożeniem.

W każdym pliku edytowanym podczas bieżącej pracy sprawdź zauważone literały w języku polskim, które są wyświetlane użytkownikowi albo przekazywane do komponentu UI, np. etykiety, tooltipy, placeholdery, komunikaty, tytuły, teksty przycisków i opisy `aria`.

Jeśli taki tekst nie korzysta z mechanizmu tłumaczeń:

1. Obowiązkowo zastąp go kluczem tłumaczenia w tym samym edytowanym pliku.
2. Znajdź właściwy, już istniejący prefiks grupy w tym samym feature, sąsiednich użyciach albo słownikach projektu.
3. Nie twórz nowego prefiksu grupy i nie zgaduj go na podstawie nazwy komponentu. Jeżeli nie istnieje jednoznacznie pasujący prefiks, zatrzymaj tę część zmiany i poproś użytkownika o wskazanie grupy.
4. Zastosuj lokalny mechanizm tłumaczeń, np. pipe, dyrektywę albo serwis, bez wprowadzania równoległego wzorca.
5. W odpowiedzi końcowej wypisz każdy wprowadzony klucz wraz z polskim tekstem, który trzeba dodać przez obowiązujący w projekcie proces zarządzania tłumaczeniami.

Nie traktuj jako tekstów wymagających tłumaczenia komentarzy w HTML, TypeScript i SCSS — komentarze mogą pozostać po polsku. Nie zmieniaj też automatycznie danych testowych, wartości kontraktowych FE/BE ani treści technicznych, które nie są prezentowane użytkownikowi.

Jeśli wdrożenie wymaga nowych etykiet, komunikatów, empty state, nazw akcji, tytułów modali albo błędów, użyj kluczy w kodzie zgodnie z lokalnym wzorcem i w odpowiedzi końcowej wypisz brakujące tłumaczenia w formacie:

```text
KLUCZ.TLUMACZENIA: Tłumaczenie po polsku
```

Dla błędów numerycznych z backendu używaj klasycznego wzorca `ERRORS.<numer>` i również wypisz brakujące tłumaczenia zamiast dopisywać je samodzielnie do plików i18n.

---

## 4. Animacje

Dla nowego kodu preferuj natywne animacje Angulara przez CSS oraz `animate.enter` i `animate.leave`.
Nie dodawaj nowych triggerów z `@angular/animations`, `trigger()`, `transition()` ani `animate()`, jeśli efekt da się zrobić przez CSS.

Klasy animacji trzymaj w SCSS komponentu i nazywaj zgodnie ze strukturą HTML.
Dla wejścia elementu używaj `animate.enter`, dla usunięcia z DOM używaj `animate.leave`.

Dla list animuj element, który faktycznie pojawia się albo znika z DOM.
Jeśli sąsiednie elementy mają płynnie zmieniać pozycję, dodaj przejście na właściwościach layoutu lub transformacji w klasie elementu listy.

Nie mieszaj `animate.enter` / `animate.leave` z legacy `@angular/animations` w tym samym komponencie.

---

## 5. Zasoby projektowe

### Tokeny kolorów

Przy pierwszej zmianie SCSS w tej turze znajdź i wczytaj raz lokalne źródło tokenów kolorów: Design System, globalne SCSS variables, CSS custom properties albo plik theme używany przez projekt.
Nie zakładaj jednej ścieżki w każdym repo; potwierdź ją importami i istniejącymi użyciami.

### Pipe'y

Przed stworzeniem nowego pipe'a upewnij się, że taki już nie istnieje.
