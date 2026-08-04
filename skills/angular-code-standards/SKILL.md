---
name: angular-code-standards
description: >
  Standardy pisania kodu Angular 20 w tym zespole — SCSS, HTML, TypeScript.
  Wczytaj ZAWSZE gdy użytkownik prosi o: stworzenie lub modyfikację komponentu,
  serwisu, pipe'a, dyrektywy, modalu, formularza, animacji, pliku .ts / .html / .scss
  w projekcie Angular — nawet jeśli nie pada słowo "Angular". Dotyczy też
  próśb typu "dodaj komponent", "zmień styl", "napraw modal", "edytuj template",
  "popraw SCSS", refaktoryzacji, code review, implementacji feature'ów,
  debugowania i wszelkich pytań o styl kodu w tym projekcie. Zasady są
  obowiązkowe, nie opcjonalne.
  Wczytaj jako pierwszy krok przed generowaniem jakiegokolwiek kodu.
version: 1.8.0
author: n.koktysz@pleodigital.com
scope: SHARED
category: Angular
tags: []
---

# CHANGELOG

# 1.4.0 — Poprawiono opis triggerów, dodano referencje sekcji w checkliście,

# rozdzielono wielowarunkowe reguły na listy, dodano zakres skilla

# i instrukcję dla niejasnych wzorców.

# 1.5.0 — Dodano uogólniony kontrakt refaktoru UI bez regresji,

# zasady ograniczania override'ów Design System i reguły layoutu kolekcji/tabel.

# 1.6.0 — Dodano operacyjne triggery/antytriggery, priorytety konfliktów,

# generyczne odkrywanie wzorców repo, minimalną weryfikację,

# komunikaty dla brakujących tokenów i ujednolicono prompty agentów.

# 1.6.1 — Doprecyzowano zakaz wydzielania jednorazowych helperów dla krótkich

# warunków i prostych mapowań wartości.

# 1.6.2 — Dodano zasadę diagnozy stanu komponentów UI opartych o biblioteki

# przed zmianą stylów selected/hover/disabled.

# 1.7.0 — Wzmocniono zasadę dla nowych komponentów: domyślnie muszą używać

# Angular Signals API dla kontraktu komponentu, query i lokalnego state'u.

# 1.7.1 — Dodano zasadę unikania porównań do powtarzalnych stringów

# kontraktowych na rzecz enumów albo typowanych stałych.

# 1.8.0 — Dodano obowiązkowe discovery i ocenę reużywalności przed tworzeniem

# lokalnych validatorów, checkerów i podobnych mechanizmów sprawdzających.

# Standardy pisania kodu Angular — zasady zespołu

> Wczytaj ten skill przed napisaniem pierwszej linii kodu.
> Stosuj zasady od razu przy generowaniu.
> Nie cytuj ani nie przepisuj tego skilla w odpowiedzi do użytkownika, chyba że wprost o to poprosi.

---

## Zakres skilla

Dotyczy: komponenty, serwisy, pipe'y, dyrektywy, modale, formularze, pliki `.ts` / `.html` / `.scss`.

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
- "edytuj `.ts` / `.html` / `.scss`", "popraw template", "uzupełnij typy",
- "dodaj formularz", "zmień tabelę/listę/kafle", "napraw loader/empty state",
- "sprawdź UI w Angularze", "zrób refaktor komponentu", "review kodu Angular".

NIE wczytuj go dla pytań ogólnych niezwiązanych z lokalnym projektem, np. "jak działa Angular routing" bez pracy na kodzie projektu.
Jeśli kontekst jest niejasny, zapytaj krótko:

```text
Czy mam potraktować to jako zmianę kodu Angular w tym projekcie i zastosować angular-code-standards?
```

---

## Minimalna checklista

Przed wygenerowaniem kodu sprawdź reguły naruszane najczęściej:

- SCSS: hierarchia zgodna z HTML → [1.1], brak `__` → [1.3], tylko tokeny kolorów → [1.2].
- Design System: najpierw publiczne API komponentu, override internali tylko lokalnie i z powodem → [1.4].
- HTML: brak metod w szablonie → [2.3], statyczne inputy bez `[]` → [2.1], długie wyrażenia w `@let` → [2.4], `@for` z stabilnym `track` → [2.7], poprawna kolejność atrybutów → [2.6].
- TypeScript: brak `any` → [3.2], jawne typy publicznych i klasowych symboli → [3.2], brak porównań do powtarzalnych stringów kontraktowych → [3.16], nowe komponenty obowiązkowo na Signals API → [3.5], typed forms dla nowych modali → [3.3], sensowny reaktywny state → [3.4], parent/container buduje view model → [3.6], discovery przed lokalnymi mechanizmami sprawdzającymi → [3.17], ocena wpływu na testy → [3.11].
- Refaktor UI: przed podmianą widoku wypisz kontrakt danych, stanu i interakcji; zachowaj payload parity → [3.13].
- Komponenty UI bibliotek: przy regresji selected/hover/disabled sprawdź najpierw stabilność danych i stan komponentu, potem dopiero SCSS → [3.15].
- Animacje: dla nowego kodu CSS + `animate.enter` / `animate.leave`, bez nowych legacy triggerów → [4].

## Priorytet reguł przy konflikcie

Stosuj kolejność:

1. jawna decyzja użytkownika albo specyfikacja,
2. lokalny kontrakt danych, requestów i zachowania UI,
3. istniejący wzorzec w edytowanym module,
4. zasady tego skilla,
5. ogólne preferencje Angulara.

Jeśli lokalny wzorzec narusza ten skill, nie rób szerokiego refaktoru bez zgody. Nazwij konflikt i zaproponuj jedną z krótkich opcji:

```text
Widzę konflikt: lokalny wzorzec robi X, a standard skilla zaleca Y. W tej zmianie zachowuję lokalny wzorzec, bo minimalizuje ryzyko regresji.
```

```text
Widzę konflikt: lokalny wzorzec robi X, a standard skilla zaleca Y. Proponuję dostosować ten fragment do standardu; szerszy refaktor wymaga osobnego zadania.
```

## Minimalna weryfikacja po zmianach

Dobierz komendy do faktycznej zmiany i skryptów aktualnego projektu. Najpierw sprawdź `package.json`, `angular.json` i używany runner testów.

- type-check/build: preferuj lokalny build/type-check, np. `npm run build`, `npx ng build` albo dedykowany skrypt projektu,
- lint TS/HTML/SCSS: preferuj lokalny lint, np. `npm run lint`, `npx ng lint`, `npx eslint` albo `npx stylelint`,
- testy jednostkowe: uruchom najbliższy spec przez lokalny runner, np. Jest/Vitest/Karma przez `npm test`, `npx ng test` albo dedykowany skrypt projektu,
- wizualny smoke-test: dla zmian UI uruchom widok w przeglądarce i sprawdź screenshot, console errors, overflow oraz stany hover/disabled/selected/loading/empty.

Jeśli któregoś kroku nie da się wykonać, podaj konkretny powód i residual risk.

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

Nie używaj `__`.
Preferuj hierarchię klas zamiast BEM z podwójnym podkreślnikiem.

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

---

## 2. HTML

### [2.1] Statyczne inputy

Dla statycznych stringów używaj zwykłych atrybutów HTML.
Nie używaj `[input]="'wartość'"`.

Wyjątek: `[attr]="expression"` jest poprawne, gdy wartość pochodzi ze zmiennej lub wyrażenia.

### [2.2] Klasy CSS

Preferuj nazwy budujące hierarchię, np. `wrapper`, `main`, `sub`, `box`, `line`, `header`, `body`, `footer`, `inner`, `content`, `group`.
Unikaj powtarzania pełnej nazwy komponentu na każdym poziomie.

### [2.3] Metody w szablonie

Nigdy nie wywołuj metod bezpośrednio w szablonie.
Preferuj kolejno:

1. przygotowaną właściwość, `signal()` albo `computed()`,
2. `@let` dla długich lub powtarzanych wyrażeń,
3. czysty `pipe` dla reużywalnej transformacji,
4. `protected get` tylko dla trywialnego, niealokującego odczytu i gdy pasuje do istniejącego stylu pliku.

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

### [3.3] Modale

Przy otwieraniu modali preferuj wzorzec `const modal = ...`, aby zamykać modal przez referencję lokalną.

Nowe modale formularzowe muszą mieć typed form:

- `FormGroup<T>` dla formularza,
- jawne `FormControl<T>` dla kontrolek,
- payload budowany i normalizowany w TypeScript przed requestem,
- walidacje, disable/enable i stany zapisu prowadzone w TS, bez ad hoc kontrolek i warunków biznesowych rozproszonych po template,
- submit guard / in-flight guard, żeby szybkie wielokrotne kliknięcia nie wysyłały kolejnej mutacji.

### [3.4] Reaktywny state

Preferuj:

- `signal()` dla lokalnego stanu komponentu,
- `BehaviorSubject` dla stanu z wieloma subskrybentami lub historią,
- `Subject` dla zdarzeń jednorazowych,
- zwykłą właściwość tylko dla prostych, statycznych wartości.

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

Preferuj rozwinięcie istniejącego wzorca zamiast tworzenia równoległego flow.
Jeśli istniejący wzorzec narusza inne zasady tego skilla, poinformuj użytkownika zamiast automatycznie powielać albo refaktoryzować cały moduł.

Parent/container powinien budować view model, wykonywać requesty i obsługiwać flow widoku.
Child komponent powinien renderować przekazane dane i emitować intencje użytkownika.
Nie przenoś requestów do child komponentu tylko dlatego, że dane są w nim wyświetlane.

Jeśli komponent ma być reużywalną zawartością, nie dodawaj do niego API zależnego od konkretnego hosta, np.:

- `modalMode`,
- `closeProfiles`,
- lokalnego close buttona,
- lokalnej nawigacji kontenera.

Takie zachowania trzymaj w hoście: modalu, zakładkach, panelu albo kontenerze routingu.

### [3.7] `computed()` i `effect()`

Używaj `computed()` dla synchronicznych wartości pochodnych z signali.
Nie duplikuj wartości pochodnej w osobnym `signal()`, jeśli da się ją wyliczyć deterministycznie.

Używaj `effect()` tylko dla realnych efektów ubocznych, np. synchronizacji z zewnętrznym API, storage albo integracją nieangularową. Nie używaj `effect()`, gdy zachodzi którykolwiek z poniższych warunków:

- zwykłe mapowanie danych pod template (użyj `computed()`),
- chain RxJS odpowiadający za requesty, retry, cancelację albo obsługę błędów,
- ręczne przepychanie state'u między signalami, jeśli wystarczy `computed()`.

Nie zapisuj do signali wewnątrz `effect()` bez wyraźnego powodu i ochrony przed pętlą aktualizacji.

### [3.8] Czyszczenie subskrypcji i zasobów

Dla ręcznych subskrypcji RxJS preferuj `takeUntilDestroyed()` i `DestroyRef`.
Nie dodawaj nowego `destroy$`, jeśli można użyć standardowego mechanizmu Angulara.

Dla timerów, listenerów i integracji spoza Angulara pilnuj jawnego cleanupu.
Jeśli cleanup jest lokalny i prosty, trzymaj go blisko miejsca utworzenia zasobu.

### [3.9] Requesty i refresh flow

Dla jednej akcji użytkownika wybieraj jedno źródło odświeżenia danych:

- albo aktualizację lokalnego stanu z odpowiedzi mutacji,
- albo jeden kanoniczny refetch.

Nie rób obu naraz dla tego samego zasobu.

Nie dociągaj endpointu details, jeśli endpoint listy albo odpowiedź mutacji zwraca komplet danych potrzebnych do UI.

Guarduj akcje in-flight, żeby szybkie wielokrotne kliknięcia nie wysyłały drugiego requestu.

Przy pollingu utrzymuj tylko jeden aktywny timer albo subskrypcję dla danego zasobu.

Mocki w kodzie aplikacyjnym traktuj jako tymczasowy debt.
Jeśli musisz dodać mock z powodu brakującego backendu, trzymaj go jawnie za flagą środowiskową, domyślnie wyłączoną, i opisz warunek usunięcia.

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

Jeśli modyfikujesz plik `.ts`, sprawdź, czy obok istnieje `.spec.ts`.
Jeśli istnieje i zmiana dotyka logiki, stanu, inputów, outputów, requestów albo warunków w template, zaktualizuj test.
Nie wymagaj aktualizacji testów tylko dla czystej zmiany SCSS.

W odpowiedzi końcowej krótko zaznacz wpływ zmian `.ts` na testy:

- jeśli trzeba było zmienić testy, napisz czy zostały zmienione,
- jeśli testów nie ma, a zmiana zwiększa ryzyko regresji, zaproponuj ich dodanie,
- jeśli testów nie trzeba, napisz dlaczego.

Gotowy format:

```text
Testy: zaktualizowano `<plik>.spec.ts` / brak testów w pobliżu — rekomenduję dodać `<zakres>` / nie wymagało zmian, bo dotyczyło wyłącznie SCSS.
```

### [3.12] Tłumaczenia i nowe klucze

Nie dodawaj nowych wpisów do plików i18n/tłumaczeń podczas implementacji FE, chyba że użytkownik jawnie poprosi o edycję słowników.

Jeśli wdrożenie wymaga nowych etykiet, komunikatów, empty state, nazw akcji, tytułów modali albo błędów, użyj kluczy w kodzie zgodnie z lokalnym wzorcem i w odpowiedzi końcowej wypisz brakujące tłumaczenia w formacie:

```text
KLUCZ.TLUMACZENIA: Tłumaczenie po polsku
```

Dla błędów numerycznych z backendu używaj klasycznego wzorca `ERRORS.<numer>` i również wypisz brakujące tłumaczenia zamiast dopisywać je samodzielnie do plików i18n.

### [3.13] Refaktor UI bez regresji kontraktu

Gdy zastępujesz istniejący fragment UI nowym komponentem, modalem, formularzem, listą, tabelą albo innym widokiem, przed edycją odtwórz z kodu kontrakt zachowania:

- własność stanu: parent/container, child komponent, formularz, store albo serwis,
- inputy, outputy, kontrolki formularza, selektory, serwisy i eventy,
- shape danych zapisywanych do formularza, store, local state albo requestu,
- zasady enabled, disabled, readonly, selected, loading, empty, error i data,
- dokładny trigger interakcji: row, checkbox, radio, button, link, menu albo skrót klawiaturowy,
- redirecty, linki otwierane w nowym oknie, tooltipy, ikony, komunikaty i aria/keyboard behavior,
- kontrakt refreshu danych po mutacji albo zmianie filtrów.

Refaktor frontend-only nie może zmienić shape obiektu wysyłanego dalej do requestu ani wartości zapisanej w istniejącej kontrolce formularza, chyba że użytkownik jawnie tego chce.

Dla widoków kolekcji, niezależnie od prezentacji jako tabela, lista, kafle, drzewo, stepper albo virtual scroll:

- najpierw zachowaj model danych, selekcję, disabled rules, uprawnienia i nawigację,
- nie zmieniaj triggera wyboru ani zakresu klikalności bez jawnej decyzji,
- sprawdź zachowanie dla elementów enabled, disabled, pustych, ładowanych i po błędzie,
- po zmianie usuń martwe inputy, outputy, metody, helpery i style starego widoku.

Jeśli nowy projekt UI wymaga zmiany kontraktu interakcji, potraktuj to jako zmianę funkcjonalną i potwierdź ją ze specyfikacją albo użytkownikiem.

Edge case: dla list filtrowanych, sortowanych, przeładowywanych albo wirtualizowanych nie używaj `track $index`; wybierz stabilne `id`, `uuid`, slug albo inny niezmienny klucz domenowy.

### [3.14] Widoki tabelaryczne, listy i layout kolekcji

Domyślnie używaj komponentów tabel, list, paginacji, filtrów, sortowania i empty/loading state z Design System albo z istniejących wzorców projektu. Nie buduj własnego header/body grid, jeśli DS table pokrywa wymagania.

Dla tabel Design System:

- używaj publicznego API komponentu, definicji kolumn, slotów, inputów i eventów,
- trzymaj sortowanie, filtrowanie, paginację i akcje w modelu zgodnym z lokalnym wzorcem,
- nie nadpisuj internali wierszy, headerów, radio/checkboxów ani hoveru, jeśli da się użyć wariantu albo konfiguracji DS,
- stany initial, loading, empty, error i data realizuj wzorcem komponentu albo lokalnym komponentem stanu używanym w module.

Custom table-like layout, CSS grid albo `cdk-virtual-scroll-viewport` stosuj wtedy, gdy DS nie wspiera wymaganego zachowania, istniejący moduł ma taki wzorzec albo wymaganie interakcji tego potrzebuje. Wtedy jawnie ustal:

- szerokość kontenera, padding poziomy i model kolumn,
- zachowanie przy węższym kontenerze i długich treściach,
- `min-width: 0` dla komórek z tekstem,
- `align-items: center` dla wierszy,
- wysokość wiersza zgodną z `itemSize`,
- `flex: 1` / `min-height: 0` dla viewportu,
- czy ostatnia kolumna ma wystarczającą szerokość dla akcji.

W custom grid header i body muszą używać tego samego modelu kolumn oraz tego samego paddingu poziomego. Nie używaj twardych szerokości `px` dla całej siatki, jeśli realny kontener może być węższy niż frame z Figmy.

### [3.15] Istniejące komponenty UI oparte o biblioteki

Gdy zmieniasz zachowanie istniejącego komponentu UI opartego o bibliotekę, np. select, autocomplete, datepicker, table, tree, menu albo virtual scroll, najpierw rozdziel zmianę na:

- kontrakt danych i formularza,
- stan komponentu, np. selected, marked, disabled, readonly, loading,
- minimalny styl potrzebny dla nowego stanu.

Jeśli użytkownik prosi o zachowanie dotychczasowego wyglądu, nie przebudowuj template i nie zmieniaj stylów selected/hover/default tylko dlatego, że dodajesz disabled, readonly albo blokadę akcji.

Przed zmianą SCSS dla selected/hover/disabled sprawdź:

- czy lista `items` ma stabilne referencje i nie jest tworzona od nowa w getterze używanym w template,
- czy `bindValue`, `bindLabel`, `compareWith`, `trackBy` albo lokalny odpowiednik są zgodne z wartością formularza,
- czy stan selected/marked/disabled wynika z danych komponentu biblioteki, a nie z ręcznie odtworzonego template,
- czy nowy stan disabled nie nadpisuje istniejącego selected albo hover dla elementów, które nadal mają być aktywne.

Jeśli poprawka dotyczy tylko zablokowania opcji albo akcji, preferuj publiczny stan danych/API komponentu, np. `disabled: true`, `readonly`, `compareWith`, stabilną listę opcji albo konfigurację komponentu. Własny `ng-template`, ręczne klasy opcji albo override internali dodawaj dopiero wtedy, gdy publiczne API nie wystarcza.

Po zmianie sprawdź osobno:

- opcję aktywną i wybraną,
- opcję aktywną pod hoverem,
- opcję disabled,
- opcję jednocześnie selected i disabled, jeśli taki stan jest możliwy.

### [3.16] Powtarzalne stringi kontraktowe

Nie porównuj w kodzie do powtarzalnych stringów opisujących kontrakt FE/BE, stan domenowy, kod języka, status, typ, rolę, tryb, permission albo wartość słownikową.
Jeśli literal występuje w kilku miejscach albo może być częścią kontraktu z backendem, użyj istniejącego enuma, typowanej stałej `as const` albo union type z jednego źródła prawdy.

Preferowana kolejność:

1. użyj istniejącego enuma/modelu z `_models`, `enum`, `types` albo lokalnego kontraktu API,
2. jeśli go nie ma, dodaj mały enum albo typowaną stałą blisko domeny, w osobnym pliku modelu, jeśli taki wzorzec istnieje,
3. literal zostaw tylko dla jednorazowej wartości lokalnej, która nie jest kontraktem i nie powtarza się w logice.

Przykład niedopuszczalny dla powtarzalnego kontraktu:

```ts
if (normalizedLanguage !== "pl") {
  void this.loadLanguage("pl");
}
```

Preferuj:

```ts
if (normalizedLanguage !== LanguageEnum.polish) {
  void this.loadLanguage(LanguageEnum.polish);
}
```

Jeśli w skrajnym przypadku porównanie do pojedynczego stringa wydaje się dopuszczalne, ale wartość wygląda na kontraktową albo może wrócić w kolejnych miejscach, dopytaj użytkownika o decyzję zamiast samodzielnie utrwalać literal.

### [3.17] Discovery przed lokalnymi mechanizmami sprawdzającymi

Przed dodaniem własnego mechanizmu, który waliduje, sprawdza, klasyfikuje albo ogranicza dane, najpierw wykonaj discovery w projekcie i używanych bibliotekach. Dotyczy to między innymi validatorów formularzy, checkerów, predykatów, guardów wartości, funkcji normalizujących oraz pomocniczych reguł poprawności.

Szukaj po zachowaniu i regule biznesowej, nie tylko po planowanej nazwie. Sprawdź kolejno:

1. publiczne API frameworka, Design Systemu albo używanej biblioteki,
2. istniejące rozwiązania współdzielone w projekcie, takie jak validatory, utile, stałe, dyrektywy i helpery,
3. rozwiązania w tym samym feature lub domenie, które można bezpiecznie rozszerzyć bez zmiany ich obecnej semantyki,
4. czy reguła jest na tyle ogólna i prawdopodobna do ponownego użycia, że powinna trafić do współdzielonej lokalizacji zamiast do pojedynczego komponentu.

Stosuj następującą kolejność decyzji:

- użyj istniejącego rozwiązania, jeśli dokładnie pokrywa wymaganą semantykę,
- rozszerz istniejące rozwiązanie, jeśli da się zachować kompatybilność i czytelne API,
- utwórz rozwiązanie współdzielone, jeśli reguła jest niezależna od konkretnego widoku lub domeny i ma realny potencjał wielu konsumentów,
- zostaw implementację lokalną tylko wtedy, gdy reguła jest rzeczywiście specyficzna dla jednego flow albo współdzielona abstrakcja byłaby sztuczna i utrudniała zrozumienie kodu.

Nie twórz kilku prawie identycznych lokalnych sprawdzaczy. Nowe rozwiązanie współdzielone powinno mieć neutralną nazwę, minimalne API bez zależności od konkretnego komponentu oraz testy obejmujące wartości graniczne i niepoprawne dane.

Discovery nie oznacza automatycznego uogólniania. Nie używaj istniejącego rozwiązania o podobnej nazwie, jeśli ma inną semantykę, i nie przenoś jednorazowej prostej reguły do shared bez realnej korzyści z reużycia.

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
