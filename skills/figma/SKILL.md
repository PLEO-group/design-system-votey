---
name: figma
description: >
  Kompletny pipeline pracy z Figmą: sprawdzenie połączenia MCP, odczyt makiet pixel-perfect,
  projektowy routing implementacji Angular/SCSS i React/Next/Tailwind dla Boxes i Votey,
  praca z macierzą wariantów komponentów i orkiestracja tworzenia wpisów CMS na podstawie Figmy.
  Używaj ZAWSZE gdy zaczynasz pracę nad nowym modułem lub komponentem i masz linki do Figmy,
  przed napisaniem jakichkolwiek klas CSS/Tailwind, przy pracy z wariantami komponentów
  (color/size/state) lub gdy chcesz stworzyć wpis CMS na podstawie makiety.
  Triggery: link do Figmy, pixel-perfect, "odczytaj z Figmy", "zmień hover", "dodaj wariant",
  "stwórz wpis na podstawie speca", "component set", "macierz wariantów", figma-to-code,
  get_design_context, get_screenshot, get_metadata. Pomiń przy zmianach niezwiązanych z Figmą,
  gdy użytkownik nie oczekuje zgodności z makietą, odczytu wariantów ani treści z Figmy.
version: 1.16.0
author: s.stawowy@pleodigital.com
scope: SHARED
category: Frontend
tags: [FE]
---

# Figma

Skill obejmuje cały pipeline pracy z Figmą: od sprawdzenia połączenia, przez odczyt makiet, po tworzenie wpisów CMS.

# CHANGELOG
# 1.16.0 — Rozdzielono reference’y implementacyjne dla Boxes, Angular Votey i React Votey PWA; ujednolicono zakres odczytu, baseline discovery i walidację.
# 1.15.0 — Dodano obowiązkowy handoff do grid contractu dla sekcji implementowanych z Figmy.
# 1.14.0 — Dodano route placement, macierz kolekcji, szybki follow-up, bounded tuning i preflight credentiali Sanity.
# 1.13.0 — Dodano topologię i allowlistę mutacji CMS oraz ledger sekwencyjnej akceptacji breakpointów runtime.
# 1.12.0 — Dodano target scope verification i follow-up breakpoint diff dla iteracyjnych poprawek layoutu z Figmy.
# 1.11.0 — Dodano Sanity workflow dla content-to-CMS: target preflight, Unicode-safe mutation i read-after-write audit.
# 1.10.0 — Dodano commit-aware mutacje CMS, deterministyczny fallback JSONL dla bridge'a Codex oraz freshness contract runtime.
# 1.9.0 — Runtime pixel-perfect loop wymaga pełnego preflightu chrome-debug: dev server reuse, route status i sandbox-aware Playwright CLI.
# 1.8.0 — Dodano runtime pixel-perfect loop z chrome-debug, route contract i stabilnymi selektorami modułów.
# 1.7.0 — Dodano obowiązkowy kontrakt struktury layoutu przed kodowaniem.
# 1.6.0 — Dodano zbiorczy status odczytu Figmy i fallback dla częściowo niedostępnych danych.
# 1.5.1 — Doprecyzowano Angular/Design System reference i obowiązek walidacji runtime dla implementacji UI z Figmy.
# 1.5.0 — Dodano Angular/Design System reference i obowiązek walidacji runtime dla implementacji UI z Figmy.

## Obowiązkowy pre-check: MCP Guard

**Przed każdą operacją Figma** wczytaj i wykonaj `references/mcp-guard.md`. Nie pomijaj tego kroku nawet gdy URL Figmy jest oczywisty.

## Referencje — decision tree

Wczytaj **tylko** te referencje, które pasują do bieżącego zadania:

```
Dowolna operacja Figma
  → ZAWSZE wczytaj references/mcp-guard.md (pre-check)

Odczyt makiety → implementacja CSS/komponentu (pixel-perfect)
  → Instrukcje są w tym SKILL.md (poniżej)

Odczyt makiety → implementacja CSS/komponentu + runtime walidacja / pixel-perfect loop
  → Wczytaj references/runtime-pixel-perfect-loop.md po MCP Guardzie i przed edycją kodu

Odczyt makiety → implementacja Angular / SCSS / Design System
  → Najpierw rozpoznaj rodzinę projektu:
    - angular-design-system / Boxes / @design-system/design-system
      → Wczytaj references/angular-boxes-implementation.md po MCP Guardzie i przed edycją kodu
    - design-system-votey / wyborek-crm / Angular + @pleodigital/design-system-votey
      → Wczytaj references/angular-votey-implementation.md po MCP Guardzie i przed edycją kodu
    - inny albo niejednoznaczny projekt Angular
      → Odczytaj AGENTS.md i package.json; nie stosuj reference Boxes ani Votey na ślepo

Odczyt makiety → implementacja React / Next.js / Tailwind
  → Najpierw rozpoznaj rodzinę projektu:
    - votey-user-app / React lub Next.js + @pleodigital/design-system-votey
      → Wczytaj references/react-votey-implementation.md po MCP Guardzie i przed edycją kodu
    - inny albo niejednoznaczny projekt React
      → Odczytaj AGENTS.md, package.json i konfigurację stylów; nie stosuj reference Votey PWA na ślepo

Komponent z macierzą wariantów (color × size × state)
  → Wczytaj references/component-variants.md

Tworzenie albo aktualizacja wpisu CMS na podstawie Figmy
  → Wczytaj references/content-to-cms.md
```

Nie ładuj wszystkich referencji naraz.

---

## Priorytet: najpierw Figma, potem kod

Nigdy nie zgaduj wartości paddingów, marginów, gapów ani rozmiarów. Każda wartość musi pochodzić z makiety.
Jeśli nie możesz odczytać danych — powiedz o tym użytkownikowi i poczekaj na instrukcje.

Po odczycie danych z Figmy rozpoznaj framework i rodzinę Design Systemu po ścieżce repo, `package.json`, importowanej paczce, konfiguracji stylów i `AGENTS.md`.

- Rozpoznany Boxes / `@design-system/design-system` → wczytaj tylko `references/angular-boxes-implementation.md`.
- Rozpoznany Angular Votey / `@pleodigital/design-system-votey` → wczytaj tylko `references/angular-votey-implementation.md`.
- Rozpoznany React/Next Votey PWA / `@pleodigital/design-system-votey` → wczytaj tylko `references/react-votey-implementation.md`.
- Inny albo niejednoznaczny projekt Angular → nie wczytuj żadnego z tych dwóch reference; stosuj lokalne `AGENTS.md`, `package.json`, istniejący kod i publiczne API używanej biblioteki.
- Inny albo niejednoznaczny projekt React → nie wczytuj reference Votey PWA; stosuj lokalne `AGENTS.md`, konfigurację stylów, istniejące prymitywy i publiczne API używanej biblioteki.

Nie przenoś nazw tokenów, breakpointów, komponentów ani ścieżek importu pomiędzy Boxes i Votey.
Nie przenoś Angularowego runtime’u Votey ani `tokens.angular.css` do Reacta. Nie przenoś lokalnych klas `rv-*`, providerów device/viewport ani arkuszy light/dark PWA do CRM.
Nie implementuj layoutu Angular/SCSS z użyciem domyślnych założeń React/Next ani klas Tailwind, jeśli projekt używa SCSS i Design Systemu.

## Twarda zasada jakości danych

Jeśli dane z Figmy dzielą się na:

- **potwierdzone** — odczytane jawnie z metadanych, auto-layoutu, typografii albo stylów,
- **inferowane** — wyliczone z pozycji `x/y`, offsetów dzieci, zrzutu ekranu albo "na oko",
- **brakujące** — niedostępne mimo próby odczytu,

to do implementacji pixel-perfect kwalifikują się wyłącznie wartości **potwierdzone**.

Jeśli lista `inferowane` albo `brakujące` nie jest pusta dla właściwości krytycznych **dla żądanego zakresu**:

- padding
- gap
- width / height elementów layout-driving
- hierarchy / parent-child layout
- state-specific colors

to **nie wolno** przechodzić do implementacji jako "pixel-perfect". Zatrzymaj się i zgłoś brak danych.

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

Dla każdego breakpointu porównaj tylko właściwości istniejące i istotne dla danego komponentu:

- liczbę kolumn / rzędów, kolejność, wrapping i hierarchię,
- padding, gap, alignment oraz horizontal bounds kontenera,
- rozmiar i zachowanie elementów layout-driving,
- typografię i stany, jeśli zmieniają się między breakpointami,
- dla modułu krokowego: układ kroków, linie i markery `KROK`,
- dla modułu z ilustracją i CTA: fit/wysokość ilustracji oraz spacing obraz → tekst → CTA.

Jeśli którykolwiek punkt różni się między breakpointami:

- NIE dziedzicz layoutu z innego breakpointu "na oko"
- implementuj osobny wariant layoutu dla breakpointu z różnicą

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

Raport dotyczy wyłącznie odczytu Figmy. Nie dopisuj sekcji o implementacji w repo, finalnym CSS, lokalnych prymitywach ani mapowaniu kodu, chyba że użytkownik wyraźnie prosi o przejście do implementacji.

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

Przed edycją CSS wypisz:

```text
Target scope verification:
- target node:
- layout-driving scope: target node | parent node | missing
- missing scope data:
- screenshot role: none | visual context | measurement source
```

Jeśli `layout-driving scope` to `missing`, nie deklaruj pixel-perfect i nie zgaduj wymiarów komponentu z kontekstu strony. Wróć do odczytu parenta albo poproś o właściwy node.

### Krok 0.8 — Grid contract handoff dla sekcji z Figmy (OBOWIĄZKOWY)

Jeśli implementujesz całą sekcję, moduł strony albo content block na podstawie Figmy, przed pierwszą klasą CSS ustal, czy potrzebny jest grid contract per breakpoint.

Figma odpowiada tu za odczyt kontekstu layoutu: scope sekcji, właściwy breakpoint, relację target node'a do parenta oraz to, czy szerokość wynika z kolumn, content boxa, full-bleed czy stałej wartości. Nie traktuj szerokości root node'a jako automatycznej klasy `w-*` / `rv-w-*`.

`figma` nie jest źródłem prawdy dla składni klas projektu;

Minimum handoffu z Figmy:

- `section scope`: target node, parent node albo missing,
- breakpointy wymagające osobnego kontraktu,
- horizontal bounds z makiety: full-bleed, content box albo kolumny,
- źródło wartości: metadata targeta, parent node, projektowy grid albo inference,
- status runtime validation: gotowe do sprawdzenia, screenshot-only albo blocked.

### Krok 1 — preferowana kolejność odczytu narzędzi

W Codexie i podobnych klientach nie każde narzędzie Figma jest tak samo stabilne.

Używaj tej kolejności:

1. `whoami` albo najlżejszy check połączenia
2. `get_metadata`
3. `get_design_context`
4. dopiero na końcu `use_figma`, jeśli poprzednie narzędzia nie wystarczyły

Jeśli `use_figma` zawodzi, ale `get_metadata` i `get_design_context` działają, kontynuuj odczyt nimi. Nie traktuj awarii `use_figma` jako automatycznej blokady całej pracy.

### Krok 2 — wczytaj wszystkie potrzebne node'y, ale nie szerzej niż trzeba

Zakres z Kroku 0 jest nadrzędny:

- jeden podany nodeId bez jawnych wariantów breakpointowych → czytaj tylko ten node,
- kilka podanych linków lub jawny zakres breakpointów w specyfikacji → czytaj wszystkie **podane** node'y równolegle,
- nie wyszukuj i nie inferuj niepodanych breakpointów tylko dlatego, że implementowany jest moduł responsywny.

Dla każdego node'a objętego zakresem wywołaj `get_design_context`:

```
fileKey: wyciągnij z URL figma.com/design/<fileKey>/...
nodeId: wyciągnij z ?node-id=XXXX-YYYY → zamień "-" na ":"
```

Jeśli wskazany node:

- jest zwykłym komponentem / frame z auto-layoutem, czytaj tylko jego,
- jest grupą bez jawnego auto-layoutu, czytaj ten node **oraz najbliższy layout-driving parent albo kluczowy child subtree**, ale wyłącznie w obrębie wskazanego komponentu.

Nie rozszerzaj zakresu do całego ekranu tylko dlatego, że target node ma słabe metadane.

### Krok 3 — zgłoś problemy z dostępem

Jeśli `get_design_context` zawiedzie, rozróżnij rodzaj błędu:

- 403 / błąd autoryzacji obejmujący wszystkie narzędzia Figma → natychmiast zgłoś problem i oznacz zależny target jako `blocked`,
- timeout, pusty albo niekompletny wynik → najpierw wykonaj fallback dla tego samego node'a z Kroku 0.6, a potem pokaż zbiorczy status `verified` / `partial` / `blocked`.

Komunikat dla zablokowanego targetu:

```
⚠️ Nie mogę odczytać danych z Figmy dla [desktop/tablet/mobile]:
- Link: <url>
- Błąd: <opis błędu>
Czy możesz sprawdzić uprawnienia lub podać dane ręcznie?
```

Nie próbuj kodować z pamięci ani zgadywać wartości. Zatrzymaj całą implementację tylko wtedy, gdy zablokowany jest jedyny żądany target albo brakuje danych krytycznych dla bieżącej edycji. Przy kilku niezależnych zakresach kontynuuj wyłącznie zakresy `verified`, zgodnie z Krokiem 0.6.

### Krok 4 — przełącz na tryb developerski jeśli potrzeba

Jeśli `get_design_context` zwraca kod bez szczegółowych wymiarów, spróbuj `get_metadata` dla konkretnych node'ów. Jeśli masz uprawnienia do trybu developerskiego w Figmie — użyj go. Zgłoś użytkownikowi jeśli dane są nadal niekompletne.

### Krok 5 — wypisz zebrane wartości przed kodowaniem

Zanim napiszesz pierwszą klasę CSS, wypisz dane w trzech sekcjach:

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

Jeśli sekcja `inferowane` albo `brakujące` nie jest pusta dla wartości krytycznych dla żądanego zakresu, nie implementuj bez dodatkowej weryfikacji. Braki niekrytyczne zaznacz `?` i zaraportuj, ale nie blokuj nimi niezależnej części zadania.

### Krok 5.1 — Lista krytycznych wartości (max 8, obowiązkowa)

Przed pierwszą edycją kodu wypisz do 8 wartości krytycznych dobranych do typu komponentu i żądanego zakresu. Gdy komponent ma co najmniej 5 istotnych właściwości, wybierz 5–8. Dla węższego zadania wypisz wszystkie istotne właściwości, ale nie dodawaj nieistniejących pozycji tylko po to, aby osiągnąć minimum.

Przykładowe zestawy:

- button / pojedynczy stan: state-specific bg, border, text, icon, wysokość/padding, radius, typografia,
- formularz: układ pól, gap, wysokość i padding inputu, label/error typography, border/radius, kolory stanów,
- moduł krokowy z ilustracją: wysokość i fit ilustracji, linie, badge `KROK`, spacing obraz → tekst → CTA, typografia,
- sekcja layoutowa: horizontal bounds, grid/kolumny, padding, gap, hierarchy, rozmiary elementów layout-driving.

Każdą pozycję oznacz jako:

- [P] potwierdzona
- [I] inferowana
- [B] brakująca

Jeśli którakolwiek **wybrana wartość krytyczna potrzebna do żądanego zakresu** ma status [I] lub [B], zatrzymaj tylko zależną od niej część implementacji i dopytaj usera. Nie blokuj niezależnych, potwierdzonych części zadania.

## Tłumaczenie wartości Figma na klasy

Konwersja konkretnych jednostek (px → klasy projektu, vw dla ilustracji itp.) jest opisana w skillu `styling-guide` — przeczytaj go jeśli nie wiesz jak tłumaczyć wartości z Figmy na klasy.

## Stany interaktywne (hover / active / focus / disabled)

Komponenty w Figmie mają najczęściej osobne warianty per stan (property `State` w component set: `Default`, `Hover`, `Active`, `Focus`, `Disabled`). Każdy stan ma inny nodeId — **nie zgaduj kolorów hover na podstawie default**.

### Workflow dla stanu interaktywnego

1. Jeśli user wskazał konkretny stan (np. "zmień hover") — wywołaj `get_design_context` na nodeId tego wariantu.
2. Jeśli user nie wskazał wprost, ale zadanie dotyczy interakcji — poproś o link do wariantu stanu lub do całego component setu.
3. Dobierz tabelę do zakresu:
   - pojedynczy stan/wariant → target + baseline tego samego wariantu; opcjonalnie peer tylko do sprawdzenia konwencji,
   - kilka wskazanych stanów lub wariantów → wszystkie i tylko wskazane komórki,
   - pełna macierz → wyłącznie gdy user prosi o audyt całego component setu albo dodanie wariantu wpływa na wiele stanów.
4. Jeśli user podał tylko node targetu, znajdź baseline przez metadata-only discovery:
   - odczytaj `get_metadata` targetu i najbliższego parenta typu `COMPONENT_SET`,
   - znajdź sibling node z tymi samymi wartościami pozostałych properties i `State=Default`,
   - dopiero dla znalezionego nodeId wywołaj `get_design_context`,
   - jeśli metadata nie pozwala jednoznacznie ustalić baseline'u, poproś o link do baseline'u albo component setu; nie zgaduj nodeId.
5. Wypisz tabelę żądanego zakresu przed kodowaniem:

```
Komponent: ButtonCommon (color-quaternary, size-regular)
Stan      | bg          | border              | text               | icon-bg
default   | transparent | navy-blue-800       | navy-blue-800      | navy-blue-800
hover     | ?           | ?                   | ?                  | ?
disabled  | gray-100    | gray-100            | gray-500           | white
```

6. Dopiero po uzupełnieniu komórek potrzebnych do żądanego zakresu pisz CSS — nie zgaduj brakujących wartości.

Jeśli masz tylko `default`, nie wolno implementować `hover`, `active`, `focus` ani `disabled` na podstawie intuicji albo istniejącego kodu.

### Mapowanie stanów Figma → CSS

| Variant property w Figmie | Selector CSS |
|---|---|
| `State=Default` | (baza, bez selektora stanu) |
| `State=Hover` | `&:hover` (owiń w `@media (pointer: fine)` jeśli projekt tak robi) |
| `State=Active` / `Pressed` | `&:active` |
| `State=Focus` | `&:focus-visible` |
| `State=Disabled` | `&:disabled, &[aria-disabled="true"]` |
| `State=Loading` | `&[aria-busy="true"]` |

### Zasada hover-only-on-pointer-fine

Najpierw sprawdź `AGENTS.md` i istniejący kod komponentu:

- jeśli projekt używa `@media (pointer: fine)`, zachowaj ten wzorzec dla każdego nowego `&:hover`,
- jeśli projekt ma inny, świadomie ustanowiony wzorzec obsługi hover, stosuj lokalną konwencję zamiast ją nadpisywać,
- jeśli lokalnej reguły nie ma, użyj `@media (pointer: fine) { ... }` jako bezpiecznego defaultu, aby hover nie uruchamiał się na urządzeniach dotykowych.

## Analiza mechaniki layoutu — NIE tylko wartości wizualne

Przy odczytywaniu Figmy analizuj zawsze **dwie warstwy**:

### Warstwa 1: wartości wizualne (co jest widoczne)
Padding, gap, font-size, **font-weight**, kolory, border-radius, border-width — odczytane z makiety.

**Grubość czcionki (font-weight)** to subtelna właściwość którą łatwo przeoczyć. Zawsze odczytuj ją jawnie z Figmy — nie zakładaj domyślnej wartości.

| Wartość Figma | Klasa Tailwind |
|---|---|
| Thin 100 | `font-thin` |
| ExtraLight 200 | `font-extralight` |
| Light 300 | `font-light` |
| Regular 400 | `font-normal` |
| Medium 500 | `font-medium` |
| SemiBold 600 | `font-semibold` |
| Bold 700 | `font-bold` |
| ExtraBold 800 | `font-extrabold` |
| Black 900 | `font-black` |

### Warstwa 2: mechanika layoutu (jak to jest zbudowane)

Dla każdego elementu zadaj sobie pytanie:
**"Dlaczego ten element jest tam gdzie jest — dzięki jakiemu mechanizmowi CSS?"**

| Obserwacja w Figmie | Pytanie do zadania | Mechanizm CSS |
|---|---|---|
| Element "przyklejony" do dołu kontenera | Czy rodzic jest flex-col? | `mt-auto` na elemencie lub `justify-between` na rodzicu |
| Kilka elementów w rzędzie | Auto-layout horizontal czy ręczna pozycja? | `flex items-center gap-*` |
| Element wewnątrz karty/panelu | Czy tag/label jest wewnątrz czy poza kontenerem karty? | Sprawdź hierarchię nodów w Figmie |
| Elementy jeden pod drugim z równymi odstępami | Auto-layout vertical? | `flex flex-col gap-*` |
| Element rozciągnięty do pełnej szerokości | Fill container? | `w-full` |

**Zasada:** absolutna pozycja w Figmie (`top: X, left: Y`) to tylko wynik końcowy — Twój kod musi osiągnąć ten sam efekt przez poprawny flow CSS, nie przez `position: absolute` (chyba że element jest dekoracyjny).

### Checklist mechaniki layoutu przed kodowaniem

- [ ] Który element jest rodzicem (kontenerem) którego? Zweryfikuj hierarchię nodów
- [ ] Gdzie dokładnie w hierarchii DOM żyje każdy element?
- [ ] Jaka jest grubość borderu?
- [ ] Czy element ma `fill` (rozciąga się) czy `fixed size`?

### Kontrakt struktury layoutu przed kodowaniem

Zanim zaczniesz pisać JSX albo klasy CSS, zapisz krótki kontrakt struktury layoutu dla głównych obszarów makiety.
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
2. Przelicz na odpowiednie klasy projektu

Nie używaj tej techniki do odtwarzania głównego flow layoutu, jeśli element powinien być rozwiązany przez auto-layout / flex.

## Kolory i grubość borderu

Nie używaj wartości hex z Figmy bezpośrednio — mapuj na tokeny projektu. Jeśli napotkasz hex którego nie znasz — sprawdź plik z tokenami kolorów w projekcie i zapytaj użytkownika jeśli nadal nie znajdziesz.

**Zawsze sprawdzaj grubość borderu.** W Figmie może być `border-2` (2px) lub `border` (1px) — to widoczna różnica.

## Reużycie istniejących komponentów projektu

Przed napisaniem nowego JSX albo HTML sprawdź publiczne API biblioteki oraz istniejące komponenty i prymitywy projektu. W `votey-user-app` stosuj routing z `references/react-votey-implementation.md` i lokalny skill `project-primitives`; nie zakładaj, że paczka Votey publikuje gotowy komponent tylko dlatego, że podobny element istnieje w Figmie.

## Weryfikacja po implementacji

Po zakończeniu implementacji modułu zawsze:

1. Wymień wszystkie wartości które **nie** były dostępne w Figmie.
2. Wymień osobno wartości **inferowane** i osobno **brakujące**.
3. Zaznacz w kodzie komentarzem `// TODO: verify in Figma` tylko te miejsca, które naprawdę wymagają późniejszej weryfikacji.
4. Nie nazywaj implementacji pixel-perfect, jeśli krytyczne wartości layoutowe nie były potwierdzone.
5. Dla każdej zmiany uruchom najwęższą właściwą walidację repo, np. lint, typecheck, test albo build obejmujący zmieniony zakres. Jeśli środowisko jej nie umożliwia, jawnie wymień pominiętą komendę i powód.
6. Dla zmian wizualnych zweryfikuj runtime, jeśli jest dostępny. Dla Angular/Design System użyj `chrome-debug`: screenshot, console errors, overflow, interakcje stanów i computed styles krytycznych elementów.
