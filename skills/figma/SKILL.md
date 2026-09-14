---
name: figma
description: >
  Pipeline odczytu makiet Figma do pixel-perfect implementacji frontendowej,
  w tym sprawdzenie połączenia MCP i praca z macierzą wariantów komponentów.
  Używaj ZAWSZE gdy zaczynasz pracę nad nowym modułem lub komponentem i masz linki do Figmy,
  przed napisaniem jakiegokolwiek kodu UI albo stylów, przy pracy z wariantami komponentów
  (color/size/state).
  Triggery: link do Figmy, pixel-perfect, "odczytaj z Figmy", "zmień hover", "dodaj wariant",
  "component set", "macierz wariantów", figma-to-code,
  get_design_context, get_screenshot, get_metadata.
version: 1.25.2
author: s.stawowy@pleodigital.com
scope: SHARED
category: Frontend
tags:
  - FE
---

# Figma

Skill obejmuje odczyt makiet Figma i wdrożenie zgodnego UI frontendowego. Nie obejmuje programowej edycji canvasu Figmy.
## Obowiązkowy pre-check: MCP Guard

**Przed każdą operacją Figma** wczytaj i wykonaj `references/mcp-guard.md`. Nie pomijaj tego kroku nawet gdy URL Figmy jest oczywisty.
Jeśli guard został już skutecznie wykonany w tej samej sesji i środowisko MCP się nie zmieniło, kolejne operacje Figma wymagają potwierdzenia aktywnego połączenia, nie powtarzania pełnego flow inicjalizacyjnego. Stosuj skrócony tryb opisany w `references/mcp-guard.md`.

## Kiedy pominąć ten skill

Pomiń `figma`, jeżeli zadanie frontendowe nie zawiera linku do Figmy, danych z Figmy, nodeId, screenshotu makiety ani wymagania odczytu / porównania z Figmą. Samo "dodaj komponent", "zmień komponent" albo "nowy moduł" bez makiety nie uruchamia MCP Guard; wtedy użyj właściwych skilli frontendowych, np. `styling-guide`, `engineering-rules` albo `forms`.

## Referencje — decision tree

Wczytaj **tylko** te referencje, które pasują do bieżącego zadania:

```
Dowolna operacja Figma
  → ZAWSZE wczytaj references/mcp-guard.md (pre-check)

Odczyt makiety → implementacja UI/komponentu (pixel-perfect)
  → Instrukcje są w tym SKILL.md (poniżej)

Odczyt makiety → implementacja UI/komponentu + runtime walidacja / pixel-perfect loop
  → Wczytaj references/runtime-pixel-perfect-loop.md po MCP Guardzie i przed edycją kodu

Odczyt makiety → implementacja w projekcie Angular
  → Wczytaj references/angular-implementation.md po MCP Guardzie i przed edycją kodu

Odczyt makiety → implementacja z użyciem Design Systemu w innym stacku
  → Zostań przy neutralnych regułach z tego SKILL.md i wczytaj lokalny guide projektu / Design Systemu, jeśli istnieje;
    nie ładuj references/angular-implementation.md bez potwierdzonego Angulara

Komponent z macierzą wariantów (color × size × state)
  → Wczytaj references/component-variants.md

Tworzenie albo aktualizacja wpisu CMS na podstawie Figmy
  → Tylko wtedy wczytaj references/content-to-cms.md; nie wczytuj jej dla implementacji UI ani zwykłego odczytu makiety
```

Nie ładuj wszystkich referencji naraz.

---

## Priorytet: najpierw Figma, potem kod

Nigdy nie zgaduj wartości paddingów, marginów, gapów ani rozmiarów. Każda wartość musi pochodzić z makiety.
Jeśli nie możesz odczytać danych krytycznych dla całego wymaganego zakresu albo krytycznych wartości zakresu, który masz implementować — powiedz o tym użytkownikowi i poczekaj na instrukcje. Możesz kontynuować implementację zakresów oznaczonych jako `verified`; zakresy `partial` i `blocked` pomiń albo nazwij fallbackiem, zgodnie z Krokiem 0.6.

### Korekta bez zmiany designu

Odczyt Figmy nie blokuje zmiany, która wyłącznie usuwa lokalne nadpisanie albo zbędny kod, gdy jednocześnie:

- nie wybierasz ani nie zmieniasz wartości wizualnej,
- zachowujesz istniejący wariant komponentu Design Systemu i projektowe tokeny,
- nie dodajesz klasy, stylu inline ani fallbacku wizualnego,
- zakres potwierdzają obecny kod i API komponentu.

Przykłady: usunięcie ręcznego nadpisania typografii przy zachowaniu wariantu, usunięcie wrappera bez zmiany layoutu albo zastąpienie ręcznego typu typem generowanym.

Jeśli korekta wymaga wyboru wariantu, tokenu, koloru, spacingu, rozmiaru lub zachowania responsywnego, wróć do odczytu Figmy przed edycją.

Jeśli repo ma dedykowaną referencję stackową w tym skillu, po odczycie danych z Figmy wczytaj ją przed implementacją.
`references/angular-implementation.md` jest wyłącznie dla projektów Angular; sam fakt użycia Design Systemu nie jest triggerem tej referencji.
Nie przenoś założeń składniowych ani utility z jednego stacku do drugiego; bazowy skill opisuje kontrakt Figmy, a konkretna referencja projektu decyduje o sposobie zapisu kodu.

## Twarda zasada jakości danych

Jeśli dane z Figmy dzielą się na:

- **potwierdzone** — odczytane jawnie z metadanych, auto-layoutu, typografii albo stylów,
- **inferowane** — wyliczone z pozycji `x/y`, offsetów dzieci, zrzutu ekranu albo "na oko",
- **brakujące** — niedostępne mimo próby odczytu,

to do implementacji pixel-perfect kwalifikują się wyłącznie wartości **potwierdzone**.

Jeśli lista `inferowane` albo `brakujące` nie jest pusta dla właściwości krytycznych:

- padding
- gap
- width / height elementów layout-driving
- hierarchy / parent-child layout
- state-specific colors

to **nie wolno** przechodzić do implementacji jako "pixel-perfect". Zatrzymaj się i zgłoś brak danych.

## Figma UI Implementation Gate

Przed pierwszą edycją komponentu, template'u, stylów, klas Design Systemu albo treści widocznej w UI z linku do Figmy agent musi
wypisać krótki kontrakt wejściowy. Brak kontraktu oznacza, że nie wolno kodować implementacji z makiety.

Kontrakt musi zawierać tylko pola istotne dla realnego zakresu zmiany:

- `Status odczytu Figmy`: zakresy `verified`, `partial`, `blocked` zgodnie z Krokiem 0.6.
- `Target scope verification`: wynik z Kroku 0.7, jeśli layout zależy od szerokości, paddingu, tła albo pozycji w gridzie.
- `Layout contract`: struktura DOM/flow dla głównych obszarów, jeśli implementacja zmienia układ.
- `Critical values`: 4-8 krytycznych wartości z Kroku 5.1 z oznaczeniem `[P]`, `[I]`, `[B]`, jeśli zmiana dotyczy layoutu, stylu, wariantu komponentu albo stanu wizualnego.
- `Token mapping`: kolory, typografia, border/radius/shadow z Figmy zmapowane na token albo klasę projektu, jeśli zmiana dotyczy stylu.
- `Class mapping`: wartości spacingu/size z Figmy zmapowane na utility albo prymitywy właściwe dla projektu, np. grid/container, responsive helpers albo komponent DS, jeśli zmiana dotyczy layoutu albo rozmiaru.
- `DS mapping gate`: jeśli projekt używa Design Systemu, potwierdź dla każdego krytycznego elementu mapowanie `Figma value -> DS token/grid/component/asset`; brak mapowania oznacza gap albo fallback bez deklaracji pixel-perfect.
- `Icon asset mapping`: nazwy ikon, wariant rozmiaru i źródło assetu z Figmy zmapowane na publiczny asset projektu albo DS, jeśli UI zawiera ikony.
- `Visible text parity`: widoczne teksty/CTA/tab labels z Figmy porównane z CMS, specem albo aktualnym kodem.
- `Runtime validation plan`: route, breakpointy i sposób screenshot/DOM validation albo jawny status `blocked`.

Jeśli zadanie dotyczy wyłącznie zmiany treści widocznej, np. tekstu CTA, nagłówka, labela albo opisu, nie wymagaj `Critical values`, `Token mapping` ani `Class mapping`. W takim zakresie wystarczy `Status odczytu Figmy`, `Visible text parity`, źródło treści docelowej i minimalny plan walidacji, że zmiana nie narusza istniejącego layoutu.

Jeśli `Token mapping`, `Class mapping` albo `Visible text parity` ma braki dla elementu, który implementujesz, nie zgaduj.
Zatrzymaj się albo oznacz wynik jako fallback z jasnym zakresem, bez deklaracji pixel-perfect.

Minimalny format:

```text
Figma UI implementation gate:
- figma read: desktop verified, tablet verified, mobile partial
- target scope: parent node
- layout contract: root panel -> header/content/actions, actions as sibling group
- critical values: padding [P], gap [P], title type [P], body type [P], bg color [P], CTA order [P]
- token mapping: #07064E -> text/bg token ..., font style -> DS variant ...
- class mapping: 24px padding -> project spacing utility, 48px height -> project size utility, content bounds -> grid/container primitive
- ds mapping: grid=user 4/8/16, spacing token ..., typo token ..., status color token ...
- icon assets: calendar-small -> public DS asset ..., city-small -> public DS asset ...
- visible text parity: CTA labels from CMS match Figma / mismatch listed
- runtime validation: /pl route, desktop/tablet/mobile screenshots
```

### Bramka Design System Przed Implementacją Stylów

Jeśli repo używa Design Systemu, po odczycie Figmy i przed pierwszą edycją kodu UI albo stylów wykonaj krótkie mapowanie:

```text
Figma -> Design System:
- layout: <auto-layout/grid/bounds> -> <grid/container/component>
- spacing: <wartości z Figmy> -> <tokeny spacingu albo gap>
- typography: <style/size/weight/line-height> -> <token/variant>
- colors: <rola/status/stan> -> <semantic token>
- icons/assets: <nazwa i rozmiar z Figmy> -> <publiczny asset/variant>
```

Nie przenoś wartości pixelowych z Figmy bezpośrednio do implementacji stylów, jeśli istnieje token, grid primitive, komponent albo wariant
assetu. Gdy nie ma jednoznacznego mapowania, wpisz to jako `gap` i wybierz jedną z dwóch ścieżek: zatrzymaj zakres
krytyczny albo zastosuj jawnie opisany fallback bez deklaracji pixel-perfect. W projektach z Design Systemem ta bramka ma
pierwszeństwo przed mechanicznym kopiowaniem wygenerowanych stylów z Figmy.

## Zakres odczytu: target dokładnie tego co user pokazał

URL Figmy od użytkownika zawiera `node-id=XXXX-YYYY` — to dokładny element/wariant/stan, który user chce zmienić. **Nie czytaj całego screenu ani całego component set** jeśli user wskazał konkretny node.

```
✅ User: "zmień hover dla color-quaternary" + link z node-id=4221-17065
→ get_design_context(nodeId="4221:17065") — dokładnie ten wariant hover

❌ User: link z node-id=4221-17065 (konkretny wariant)
→ czytam cały frame z całym component setem, pytam usera o kolory które są w makiecie
```

**Zasada:** zanim zapytasz użytkownika o jakąkolwiek wartość z makiety, sprawdź czy nie odczytałeś zbyt szerokiego zakresu. Jeśli user dał precyzyjny nodeId — wywołaj `get_design_context` na tym dokładnym nodzie.

## Jak odczytywać dane z Figmy

### Krok 0 — ustal, czy zadanie naprawdę ma breakpointy

Nie zakładaj automatycznie, że każdy link Figmy oznacza komplet desktop / tablet / mobile.

- Jeśli user podał **jeden konkretny nodeId** i nie dał osobnych linków per breakpoint, czytaj dokładnie ten jeden node.
- Jeśli user podał osobne linki per breakpoint albo spec jawnie wskazuje warianty layoutu, wtedy czytaj wszystkie breakpointy równolegle.

### Krok 0.5 — Breakpoint diff checklist (OBOWIĄZKOWY przy >=2 breakpointach)

Jeśli task obejmuje mobile/tablet/desktop albo user podaje kolejne nodeId dla breakpointów, zrób porównanie różnic przed kodowaniem.

Dla każdego breakpointu wypisz:

- liczbę kolumn / rzędów
- układ kroków (np. 1 rząd x4 vs 2 rzędy x2)
- pozycję i styl linii między krokami
- rozmiar i pozycję markerów `KROK`
- wysokość i zachowanie kontenera ilustracji
- spacing: obraz->tytuł, tytuł->opis, opis->CTA

Jeśli którykolwiek punkt różni się między breakpointami:

- NIE dziedzicz layoutu z innego breakpointu "na oko"
- implementuj osobny wariant layoutu dla breakpointu z różnicą

#### Kontrakt zachowania responsywnego

Breakpoint diff interaktywnego komponentu obejmuje też `orientation`, `pointer`, trigger, przejście stanu, DOM owner,
focus target oraz skutek zamknięcia lub nawigacji. Użyj `Interaction Acceptance Contract` z
`references/runtime-pixel-perfect-loop.md`.

Wspólny DOM stosuj dla różnic layoutowych. Przy różnej semantyce, tab order, interakcji lub mount/unmount rozważ osobną
kompozycję. Nie dziedzicz desktop hovera na touch. Motion wymaga ustalonych primary action, keyboard flow i focus target.

#### Tryb follow-up breakpoint

Jeśli user po wdrożeniu albo po wcześniejszej iteracji dosyła kolejny link do Figmy dla mobile/tablet/desktop, potraktuj to jako follow-up breakpoint diff.

Przed edycją kodu porównaj tylko zakres, który zmienia nowy node:

- nowy breakpoint z Figmy,
- obecny kod dla tego breakpointu,
- poprzednio wdrożony breakpoint tylko wtedy, gdy klasy albo struktura są współdzielone.

Nie nadpisuj wspólnych klas ani struktury DOM, dopóki nie wypiszesz, które różnice są:

- breakpoint-specific,
- wspólne dla wszystkich breakpointów,
- konfliktem wynikającym z obecnej struktury kodu.

Minimalny raport przed kodowaniem:

```text
Follow-up breakpoint diff:
- breakpoint: tablet
- różnice layoutu: ...
- różnice spacingu: ...
- różnice bounds / warstw: ...
- wpływ na wspólne klasy: tak/nie
```

### Krok 0.6 — Zbiorczy status odczytu / partial read fallback

Jeśli task wymaga odczytu kilku zakresów z Figmy i część z nich timeoutuje albo zwraca błąd, nie traktuj tego automatycznie jako blokady całego wdrożenia.

Raportuj tylko zakresy, które wynikały z promptu, specyfikacji albo planu odczytu. Nie dopisuj `blocked` dla rzeczy, których użytkownik nie podał i których nie miałeś obowiązku pobrać, np. responsywności, stanów interaktywnych albo wariantów, jeśli task dotyczył jednego konkretnego node'a.

Zakresem może być m.in.:

- breakpoint, jeśli user podał osobne linki desktop/tablet/mobile,
- wariant komponentu,
- stan interaktywny,
- sekcja ekranu,
- layout-driving parent albo child node,
- wpis CMS tworzony na podstawie makiety.

Najpierw wypisz po polsku zbiorczo, co udało się pobrać, a czego nie. Każdy zakres sklasyfikuj jako:

- `verified` — odczytane metadane / design context wystarczają do implementacji tego zakresu,
- `partial` — dostępny jest screenshot albo część danych, ale brakuje wartości krytycznych,
- `blocked` — zakres miał zostać pobrany, ale brakuje danych przez timeout, permissions, pusty wynik albo błąd narzędzia.

Przed oznaczeniem zakresu jako `blocked` wykonaj fallback narzędziowy dla tego samego node'a:

1. spróbuj `get_design_context`,
2. jeśli timeoutuje albo zwraca za mało danych, spróbuj `get_metadata`,
3. jeśli node jest zbyt ciężki, spróbuj screenshot albo najbliższy layout-driving parent / child w obrębie wskazanego komponentu,
4. dopiero wtedy oznacz zakres jako `blocked`.

Możesz kontynuować implementację tylko dla zakresu `verified`.

Dla zakresów `partial` i `blocked`:

- nie deklaruj pixel-perfect,
- nie zgaduj wartości krytycznych,
- nie dziedzicz różniących się wartości z innego zakresu jako danych z Figmy,
- jeśli implementujesz fallback z istniejącego kodu albo z innego verified zakresu, nazwij go fallbackiem, nie odtworzeniem makiety,
- w raporcie końcowym wypisz nieweryfikowane zakresy i powód.

Przed kodowaniem wypisz krótki status po polsku w generycznym formacie. Statusy techniczne `verified`, `partial`, `blocked` zostaw bez tłumaczenia.

Raport dotyczy wyłącznie odczytu Figmy. Nie dopisuj sekcji o implementacji w repo, finalnych stylach, lokalnych prymitywach ani mapowaniu kodu, chyba że użytkownik wyraźnie prosi o przejście do implementacji.

Nie wypisuj osobno każdego narzędzia ani oczywistych szczegółów technicznych, jeśli nie wpływają na jakość odczytu Figmy:

```text
Status odczytu Figmy:
- <nazwa zakresu>: <verified|partial|blocked>, <krótki powód jeśli potrzebny>

Deklaracja pixel-perfect:
- <nazwa zakresu>: <tak|nie>
```

Jeśli zakresami są breakpointy, możesz użyć nazw typu `desktop breakpoint`, `tablet breakpoint`, `mobile breakpoint`. To tylko przykład podziału, a nie wymagany format dla każdego zadania Figma.

### Krok 0.7 — Target scope verification

Jeśli wynik implementacji zależy od szerokości, paddingów, tła, położenia w gridzie albo relacji do sąsiednich sekcji, sprawdź czy wskazany node w Figmie zawiera pełny layout-driving scope.

Nie rozszerzaj automatycznie targetu do całej strony. Najpierw ustal, czy:

- wskazany node jest właściwym komponentem,
- node zawiera paddingi, kontener i bounds potrzebne do implementacji,
- brakujące wartości są w najbliższym parent node,
- screenshot całej podstrony jest tylko kontekstem wizualnym, a nie źródłem wymiarów komponentu.

Jeśli target node jest zbyt wąski, odczytaj najbliższy layout-driving parent albo poproś o właściwy node. Nie implementuj full-width, paddingów ani background bandów na podstawie samego fill target node.

Przed edycją kodu layoutu lub stylów wypisz:

```text
Target scope verification:
- target node:
- layout-driving scope: target node | parent node | missing
- missing scope data:
- screenshot role: none | visual context | measurement source
```

Jeśli `layout-driving scope` to `missing`, nie deklaruj pixel-perfect i nie zgaduj wymiarów komponentu z kontekstu strony. Wróć do odczytu parenta albo poproś o właściwy node.

### Krok 0.8 — Grid contract handoff dla sekcji z Figmy (OBOWIĄZKOWY)

Jeśli implementujesz całą sekcję, moduł strony albo content block na podstawie Figmy, przed pierwszą zmianą kodu UI lub stylów ustal, czy potrzebny jest grid contract per breakpoint.

Figma odpowiada tu za odczyt kontekstu layoutu: scope sekcji, właściwy breakpoint, relację target node'a do parenta oraz to, czy szerokość wynika z kolumn, content boxa, full-bleed czy stałej wartości. Nie traktuj szerokości root node'a jako automatycznej klasy szerokości albo stałej wartości w stylach.

`figma` nie jest źródłem prawdy dla składni klas projektu;

Minimum handoffu z Figmy:
.
- `section scope`: target node, parent node albo missing,
- breakpointy wymagające osobnego kontraktu,
- horizontal bounds z makiety: full-bleed, content box albo kolumny,
- źródło wartości: metadata targeta, parent node, projektowy grid albo inference,
- status runtime validation: gotowe do sprawdzenia, screenshot-only albo blocked.

### Krok 1 — preferowana kolejność odczytu narzędzi

W Codexie i podobnych klientach nie każde narzędzie Figma jest tak samo stabilne.

Używaj tej kolejności:

1. `whoami` albo najlżejszy check połączenia
2. `get_metadata` — działa dla dowolnego `fileKey`, również gdy plik nie jest otwartą zakładką Figma Desktop; preferuj je przy odczycie kilku plików lub breakpointów
3. `get_design_context`
4. dopiero na końcu `use_figma`, jeśli poprzednie narzędzia nie wystarczyły

Jeśli `use_figma` zawodzi, ale `get_metadata` i `get_design_context` działają, kontynuuj odczyt nimi. Nie traktuj awarii `use_figma` jako automatycznej blokady całej pracy.
### Warunek mostu `use_figma` w Figma Desktop

Most pluginowy `use_figma` działa tylko dla pliku otwartego w aktywnej zakładce Figma Desktop. Próba użycia go dla innego pliku zwykle kończy się timeoutem po około 300 sekundach, a nie czytelnym błędem uprawnień.

Przed użyciem `use_figma` poproś użytkownika o przełączenie na właściwą zakładkę i potwierdź target. Przy samym odczycie innych plików, breakpointów albo wariantów nie wymagaj przełączania zakładek — najpierw użyj `get_metadata` po `fileKey`.

### Krok 2 — wczytaj wszystkie potrzebne node'y, ale nie szerzej niż trzeba

Stosuj ten krok tylko dla zakresów, które rzeczywiście wynikają z promptu, specyfikacji albo planu odczytu z Kroku 0. Jeżeli task zawiera jeden precyzyjny `nodeId` bez breakpointów, wczytaj wyłącznie ten node.

Jeżeli specyfikacja zawiera linki do Figmy dla desktop, tablet i mobile albo user podał osobne node'y per breakpoint, wczytaj wymagane breakpointy naraz (równolegle) przez `get_design_context`:

```
fileKey: wyciągnij z URL figma.com/design/<fileKey>/...
nodeId: wyciągnij z ?node-id=XXXX-YYYY → zamień "-" na ":"
```

Jeśli wskazany node:

- jest zwykłym komponentem / frame z auto-layoutem, czytaj tylko jego,
- jest grupą bez jawnego auto-layoutu, czytaj ten node **oraz najbliższy layout-driving parent albo kluczowy child subtree**, ale wyłącznie w obrębie wskazanego komponentu.

Nie rozszerzaj zakresu do całego ekranu tylko dlatego, że target node ma słabe metadane.

### Krok 3 — fallback i zgłoszenie problemów z dostępem

Jeśli `get_design_context` zwróci błąd 403, błąd autoryzacji, pusty wynik albo niepełne dane, nie zatrzymuj się przed wykonaniem fallbacku z Kroku 0.6 dla tego samego zakresu.

Najpierw:

1. spróbuj `get_metadata` dla tego samego node'a,
2. jeśli metadata nie wystarcza, spróbuj screenshot albo najbliższy layout-driving parent / child w obrębie wskazanego komponentu,
3. sklasyfikuj zakres jako `verified`, `partial` albo `blocked` według Kroku 0.6.

Zgłoś użytkownikowi problem dopiero po fallbacku, z rozróżnieniem zakresu:

```
⚠️ Nie mogę odczytać danych z Figmy dla [desktop/tablet/mobile]:
- Link: <url>
- Błąd: <opis błędu>
- Fallback: <co próbowano>
- Status zakresu: <partial|blocked>
Czy możesz sprawdzić uprawnienia lub podać dane ręcznie?
```

Nie próbuj kodować z pamięci ani zgadywać wartości. Możesz kontynuować wyłącznie dla zakresów `verified`; zakresy `partial` i `blocked` pomiń albo oznacz jako fallback, bez deklaracji pixel-perfect. Jeżeli cały wymagany zakres zadania jest `partial` albo `blocked`, zatrzymaj implementację i poproś o dane / uprawnienia.

### Krok 4 — przełącz na tryb developerski jeśli potrzeba

Jeśli `get_design_context` zwraca kod bez szczegółowych wymiarów, spróbuj `get_metadata` dla konkretnych node'ów. Jeśli masz uprawnienia do trybu developerskiego w Figmie — użyj go. Zgłoś użytkownikowi jeśli dane są nadal niekompletne.

### Krok 5 — wypisz zebrane wartości przed kodowaniem

Zanim napiszesz pierwszy kod UI lub stylów, wypisz dane w trzech sekcjach:

```text
Potwierdzone
- root width: 351
- title font-size: 24
- title font-weight: 900

Inferowane
- tile left/right padding: 13 / 22 (z pozycji dzieci)

Brakujące
- root auto-layout gap
```

Dopiero pod tym pokaż tabelę roboczą:

```text
Komponent: ContactTile
Breakpoint  | padding           | gap   | font-size (label/value/sub) | font-weight (label/value/sub)
desktop     | pt-30 px-36 pb-40 | 26px  | 10 / 20 / 14                | 500 / 700 / 400
tablet      | pt-25 px-58 pb-34 | ?     | 10 / 20 / 14                | 500 / 700 / 400
mobile      | pt-28 pr-25 ...   | 15px  | 10 / 22 / 14                | 500 / 700 / 400
```

Jeśli sekcja `inferowane` nie jest pusta dla wartości krytycznych, nie implementuj bez dodatkowej weryfikacji. Jeśli sekcja `brakujące` nie jest pusta, zaznacz `?` i wróć do usera.

### Krok 5.1 — Checklist krytycznych wartości dobrana do modułu (max 8, obowiązkowa)

Przed pierwszą edycją kodu wypisz 4-8 krytycznych wartości dobranych do typu modułu. Nie wymagaj danych o elementach, których dany moduł nie ma.

Dobierz checklistę według realnej struktury:

- **Przycisk / link / prosty control**: padding, gap ikona->tekst, height/min-height, border width/radius, typografia labela, kolory per stan.
- **Karta / tile / panel**: padding, gap sekcji, border/radius/shadow, media bounds jeśli występuje, typografia tytułu i opisu, pozycja CTA.
- **Sekcja z ilustracją**: wysokość/bounds kontenera ilustracji, proporcja/fit ilustracji, gap obraz->tekst, padding sekcji, typografia, zachowanie breakpointów.
- **Stepper / proces / timeline**: układ kroków, linia między krokami, marker/badge, gap opis->CTA, typografia, różnice breakpointów.
- **Formularz**: wysokość pól, padding pól, gap label->field i field->error, border/focus state, typografia label/error, layout breakpointów.

Każdą pozycję oznacz jako:

- [P] potwierdzona
- [I] inferowana
- [B] brakująca

Jeśli pozycja jest krytyczna dla layoutu albo stanu, który implementujesz, i ma status [I] lub [B], zatrzymaj implementację pixel-perfect dla tego zakresu i dopytaj usera. Nie zgłaszaj blockerów dla ilustracji, linii kroków, badge `KROK` ani innych elementów, które nie występują w module.

## Tłumaczenie wartości Figma na prymitywy projektu

Przed implementacją stylów, utility classes albo Design System z Figmy wczytaj właściwy styling/design-system guide, jeśli jest dostępny w projekcie. Figma
daje wartości i strukturę, ale `styling-guide` decyduje, jak przełożyć je na lokalne utility, tokeny, breakpointy,
grid/container i helpery typu `cn()`.

Jeśli projekt ma własne responsive utilities, design tokens, spacing scale, grid/container albo komponenty Design Systemu,
wartości px z Figmy mapuj najpierw na te lokalne prymitywy. Użycie frameworkowych defaultów, arbitralnych px albo stylu
inline wymaga krótkiego uzasadnienia w kontrakcie `Class mapping`.

Kolory, typografia, radius, border i shadow muszą przejść przez `Token mapping`. Nie wybieraj tokenu po podobieństwie
"na oko", jeśli istnieje semantyczny token albo wariant DS. Jeśli nie ma mapowania, zgłoś brak tokenu albo użyj jawnie
opisanego fallbacku bez deklaracji pixel-perfect.

Ikony traktuj jak wariant komponentu/assetu, nie jak dekoracyjny szczegół. Odczytaj z Figmy nazwę lub semantyczną rolę
ikony, jej rozmiar i stan, a następnie użyj publicznej nazwy assetu projektu. Jeżeli Design System rozróżnia warianty
rozmiaru, np. `small`, `regular`, `large` albo suffix w nazwie assetu, wariant musi znaleźć się w `Icon asset mapping`
przed edycją template'u, komponentu albo stylów.

## Stany interaktywne (hover / active / focus / disabled)

Komponenty w Figmie mają najczęściej osobne warianty per stan (property `State` w component set: `Default`, `Hover`, `Active`, `Focus`, `Disabled`). Każdy stan ma inny nodeId — **nie zgaduj kolorów hover na podstawie default**.

### Workflow dla stanu interaktywnego

1. Jeśli user wskazał konkretny stan (np. "zmień hover") — wywołaj `get_design_context` na nodeId tego wariantu.
2. Jeśli user nie wskazał wprost, ale zadanie dotyczy interakcji — poproś o link do wariantu stanu lub do całego component setu.
3. Wypisz tabelę roboczą przed kodowaniem. Dla prostych zmian stanu bez osobnej referencji wystarczy tabela zakresu, który implementujesz. Dla komponentów z macierzą wariantów użyj `references/component-variants.md`: tabela ma być kompletna dla odczytanych komórek target / baseline / peer, a nie dla całego component setu, chyba że user jawnie prosi o pełny audyt macierzy.

```
Komponent: ButtonCommon (color-quaternary, size-regular)
Stan      | bg          | border              | text               | icon-bg
default   | transparent | navy-blue-800       | navy-blue-800      | navy-blue-800
hover     | ?           | ?                   | ?                  | ?
disabled  | gray-100    | gray-100            | gray-500           | white
```

4. Dopiero po uzupełnieniu tabeli implementuj stan — nie zgaduj brakujących komórek.

Jeśli masz tylko `default`, nie wolno implementować `hover`, `active`, `focus` ani `disabled` na podstawie intuicji albo istniejącego kodu.

### Mapowanie stanów Figma → Semantyka UI

| Variant property w Figmie | Semantyka implementacyjna |
|---|---|
| `State=Default` | stan bazowy komponentu |
| `State=Hover` | hover tylko dla urządzeń z precyzyjnym wskaźnikiem, jeśli projekt tak robi |
| `State=Active` / `Pressed` | stan naciśnięcia/aktywacji |
| `State=Focus` | widoczny focus klawiaturowy |
| `State=Disabled` | stan niedostępny semantycznie i wizualnie |
| `State=Loading` | stan zajętości/ładowania |

### Zasada hover-only-on-pointer-fine

Hover nie powinien odpalać się na urządzeniach dotykowych, jeśli projekt rozdziela pointer coarse/fine. Sprawdź istniejący wzorzec projektu i zachowaj jego semantykę zamiast narzucać konkretną składnię selektora.

## Analiza mechaniki layoutu — NIE tylko wartości wizualne

Przy odczytywaniu Figmy analizuj zawsze **dwie warstwy**:

### Warstwa 1: wartości wizualne (co jest widoczne)
Padding, gap, font-size, **font-weight**, kolory, border-radius, border-width — odczytane z makiety.

**Grubość czcionki (font-weight)** to subtelna właściwość którą łatwo przeoczyć. Zawsze odczytuj ją jawnie z Figmy — nie zakładaj domyślnej wartości.

| Wartość Figma | Przykładowy token/utility |
|---|---|
| Thin 100 | token/utility dla thin |
| ExtraLight 200 | token/utility dla extra-light |
| Light 300 | token/utility dla light |
| Regular 400 | token/utility dla regular |
| Medium 500 | token/utility dla medium |
| SemiBold 600 | token/utility dla semi-bold |
| Bold 700 | token/utility dla bold |
| ExtraBold 800 | token/utility dla extra-bold |
| Black 900 | token/utility dla black |

### Warstwa 2: mechanika layoutu (jak to jest zbudowane)

Dla każdego elementu zadaj sobie pytanie:
**"Dlaczego ten element jest tam gdzie jest — dzięki jakiemu mechanizmowi layoutu?"**

| Obserwacja w Figmie | Pytanie do zadania | Mechanizm layoutu |
|---|---|---|
| Element "przyklejony" do dołu kontenera | Czy rodzic jest flex-col? | `mt-auto` na elemencie lub `justify-between` na rodzicu |
| Kilka elementów w rzędzie | Auto-layout horizontal czy ręczna pozycja? | `flex items-center gap-*` |
| Element wewnątrz karty/panelu | Czy tag/label jest wewnątrz czy poza kontenerem karty? | Sprawdź hierarchię nodów w Figmie |
| Elementy jeden pod drugim z równymi odstępami | Auto-layout vertical? | `flex flex-col gap-*` |
| Element rozciągnięty do pełnej szerokości | Fill container? | `w-full` |

**Zasada:** absolutna pozycja w Figmie (`top: X, left: Y`) to tylko wynik końcowy — Twój kod musi osiągnąć ten sam efekt przez właściwy flow/layout projektu, nie przez pozycjonowanie absolutne, chyba że element jest dekoracyjny.

### Checklist mechaniki layoutu przed kodowaniem

- [ ] Który element jest rodzicem (kontenerem) którego? Zweryfikuj hierarchię nodów
- [ ] Gdzie dokładnie w hierarchii DOM żyje każdy element?
- [ ] Jaka jest grubość borderu?
- [ ] Czy element ma `fill` (rozciąga się) czy `fixed size`?

### Kontrakt struktury layoutu przed kodowaniem

Zanim zaczniesz pisać komponent, template albo style, zapisz krótki kontrakt struktury layoutu dla głównych obszarów makiety.
Kontrakt ma opisywać strukturę, nie wartości wizualne:

```text
Layout contract:
- Root: section z dwoma obszarami: formularz + panel stanu
- Panel wyniku: górny rząd zawiera formułę i kartę średniego kosztu jako rodzeństwo
- Breakdown: osobny blok pod górnym rzędem, nie rodzic karty średniego kosztu
```

Reguły:

- jeśli element w Figmie jest rodzeństwem, nie chowaj go w innym bloku tylko dlatego, że łatwiej ułożyć grid,
- jeśli element w Figmie zmienia miejsce między breakpointami, opisz tę różnicę w kontrakcie przed implementacją,
- nie próbuj naprawiać błędnej struktury DOM samymi paddingami, gapami ani `order`,
- jeśli obecny kod ma inną strukturę niż Figma, najpierw popraw kompozycję komponentów, dopiero potem spacingi.

## Obsługa inset/pozycji absolutnych

Figma często podaje pozycję elementów jako `inset` lub jako `left/top` względem rodzica. Przy absolutnie pozycjonowanych elementach (ilustracje, dekoracje):

1. Oblicz offset od krawędzi rodzica na podstawie danych inset
2. Przelicz na odpowiednie tokeny, utility albo właściwości projektu

Nie używaj tej techniki do odtwarzania głównego flow layoutu, jeśli element powinien być rozwiązany przez auto-layout / flex.

## Kolory i grubość borderu

Nie używaj wartości hex z Figmy bezpośrednio — mapuj na tokeny projektu. Jeśli napotkasz hex którego nie znasz — sprawdź plik z tokenami kolorów w projekcie i zapytaj użytkownika jeśli nadal nie znajdziesz.

**Zawsze sprawdzaj grubość borderu.** W Figmie może być `border-2` (2px) lub `border` (1px) — to widoczna różnica.

## Reużycie istniejących komponentów projektu

Przed napisaniem nowego komponentu sprawdź, czy projekt ma już gotowy komponent lokalny albo komponent Design Systemu. Patrz właściwy skill/przewodnik dla prymitywów projektu, jeśli istnieje.

## Zgodność treści widocznej

W implementacji UI z Figmy sprawdź teksty, które użytkownik widzi: headingi, opisy, CTA, etykiety tabów, komunikaty,
placeholdery i aria-labels, jeśli wynikają z makiety. Nie zastępuj ich przykładowym copy ani parafrazą, jeśli treść
ma pochodzić z CMS/speca.

Przed końcem zadania wypisz różnice:

```text
Visible text parity:
- heading: Figma == CMS
- primary CTA: Figma "Akceptuj" / CMS "Accept" -> mismatch, wymaga decyzji albo aktualizacji CMS
```

Jeśli treści są zarządzane przez CMS i nie wolno ich lokalnie zmienić, oznacz rozbieżność jako content issue. Nie
maskuj jej zmianą layoutu ani typografii.

## Weryfikacja po implementacji

Po zakończeniu implementacji modułu zawsze:

1. Wymień wszystkie wartości które **nie** były dostępne w Figmie.
2. Wymień osobno wartości **inferowane** i osobno **brakujące**.
3. Zaznacz w kodzie komentarzem `// TODO: verify in Figma` tylko te miejsca, które naprawdę wymagają późniejszej weryfikacji.
4. Nie nazywaj implementacji pixel-perfect, jeśli krytyczne wartości layoutowe nie były potwierdzone.
5. Uruchom najwęższą dostępną walidację techniczną dla dotkniętych plików: dedykowany test, typecheck, lint dla changed files albo najbliższy command z repo. Jeśli repo nie ma sensownego commandu albo środowisko blokuje uruchomienie, zgłoś to jawnie w podsumowaniu.
6. Dla zmian React/Next, Angular albo Design System opartych o Figmę zweryfikuj runtime przez `chrome-debug` albo
   Playwright: screenshot, console errors, overflow, interakcje stanów i computed styles krytycznych elementów.
7. Dla bannerów, modali, dialogów, toastów i overlayów z Figmy waliduj wszystkie breakpointy podane w zadaniu. Jeśli
   walidacja runtime jest niemożliwa, wpisz `blocked` i nie deklaruj pixel-perfect.
