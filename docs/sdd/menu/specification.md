# WERSJA 1.0.0
# AUTOR n.koktysz@pleodigital.com & k.tryba@pleodigital.com

# Spec Driven Specification: Menu — stan obecny (AS-IS)

## 1. Metadane

- Data analizy: 2026-09-25 (Europe/Warsaw).
- Status dokumentu: Draft AS-IS, do przeglądu.
- Powiązane zgłoszenia: WYBOREK-3052.
- Feature slug: `menu`.
- Typ dokumentu: `specification`.
- Tryb pracy: `create`, profil `AS_IS MULTI_REPO`.
- Zidentyfikowana wersja paczki: repozytorium biblioteki deklaruje `@pleodigital/design-system-votey` 1.0.174. Sama obecność numeru w repozytorium nie potwierdza publikacji tej wersji.
- Środowiska objęte analizą: kod źródłowy i konfiguracja biblioteki oraz lokalny artefakt `dist/`; nie wykonano inspekcji rejestru npm.
- Zakres feature: FE — komponent biblioteki Angular. W sprawdzonym przekroju Menu nie wykonuje operacji BE.
- Zakres stacku: FE Angular 21, SCSS, Style Dictionary i Storybook; BE nie dotyczy samego Menu.

Markdown jest kompletnym opisem stanu objętego review. `as-is-hld.drawio` i jego PNG są opcjonalnym podglądem.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Menu przedstawia użytkownikowi listę nazwanych pozycji do pojedynczego wyboru. Może pokazać pozycję odpowiadającą przekazanej wartości oraz pozycje niedostępne. Użytkownik może wskazać dostępną pozycję kliknięciem; nawigacja strzałkami oraz klawiszami Home i End przenosi fokus między dostępnymi pozycjami. Escape i Tab sygnalizują zamiar opuszczenia menu. Sam komponent nie otwiera i nie zamyka wyskakującego panelu — odbiorca sygnału decyduje o skutku.

### 2.2 Opis Techniczny

`VoteyMenuComponent` (`vt-menu`) jest samodzielnym komponentem biblioteki Angular, eksportowanym wraz z typem `VoteyMenuItem` przez publiczne API paczki. Otrzymuje listę pozycji i identyfikator wyboru przez inputy; emituje obiekt klikniętej pozycji albo sygnał opuszczenia. Lokalny indeks aktywny steruje fokusem i `tabindex`. Widok tworzy natywne przyciski wewnątrz listy o rolach `menu` / `menuitem`, tekst renderuje przez `VoteyTextComponent` i `VoteyTranslatePipe`, a wygląd częściowo czerpie z tokenów CSS.

Podgląd Storybook tworzy instancję komponentu z publicznego eksportu. `VoteySelectComponent` i `VoteyMultiSelectPopoverComponent` mają własne implementacje list; nie importują `VoteyMenuComponent`.

## 3. Zakres

### 3.1 Zakres Biznesowy

- Lista pokazuje etykiety przekazanych pozycji w ustalonej kolejności.
- Kliknięcie dostępnej pozycji przekazuje ją konsumentowi; pozycja niedostępna nie reaguje na kliknięcie.
- Pozycja o identyfikatorze równym bieżącemu wyborowi otrzymuje wyróżnienie wizualne. Zmiana tego inputu nie jest równoznaczna z przesunięciem fokusu.
- Strzałki góra/dół oraz Home/End przenoszą fokus po dostępnych pozycjach; przejście przez koniec listy zawija się. Escape i Tab wysyłają sygnał opuszczenia.
- Pusta lista renderuje pusty kontener. Komponent nie dostarcza własnego komunikatu „Brak opcji”.
- Menu ma szerokość 240 px ograniczoną szerokością rodzica. W aktualnym stylu nie ma ograniczenia wysokości ani przewijania długiej listy.

### 3.2 Zakres Techniczny

- Biblioteka `design-system-votey`: `angular/src/lib/menu/*`, `angular/src/public-api.ts`, `angular/src/lib/text/*`, tokeny generowane do `dist/css/tokens.angular.css`, podgląd `storybook/stories/angular/Menu.stories.jsx` i test kontraktu eksportu/emisji w `tests/angular-package.test.js`.
- Kontrakt komponentu jest lokalny dla Angulara; Menu nie wywołuje HTTP, nie emituje eventu sieciowego i nie zapisuje trwałych danych.

### 3.3 Poza Zakresem

- Implementacja `VoteySelectComponent` i `VoteyMultiSelectPopoverComponent`; dokument odnotowuje wyłącznie ich aktualny brak zależności od Menu.
- Pozycjonowanie, otwieranie i rzeczywiste zamykanie panelu przez komponent nadrzędny; `vt-menu` wystawia tylko sygnał `dismissed`.
- API, baza danych, migracje, kolejki i uprawnienia backendowe dla samego Menu — żaden z tych mechanizmów nie występuje w analizowanym komponencie.
- Projektowanie docelowego przewijania, dostępności albo integracji z Selectem; ten dokument zapisuje stan obecny.

## 4. Stan Obecny (AS-IS)

Biblioteka udostępnia działający kontrakt wejścia/wyjścia Menu oraz podgląd w Storybooku. Kod zawiera obsługę kliknięcia, klawiszy ArrowUp/ArrowDown/Home/End/Escape/Tab, stan `disabled` i wizualne `selected`. Nie zawiera obsługi `Enter` w `handleKeydown`; natywny element `button` może uruchamiać kliknięcie z klawiatury, ale nie ma osobnego testu tego scenariusza. Menu nie ma `max-height`, `overflow-y: auto`, `scrollIntoView`, automatycznego ustawienia fokusu na `selectedId`, `aria-selected` ani jawnej reguły wielokropka dla długiej etykiety. Cień jest zapisany w SCSS z wartościami liczbowymi; nie odwołuje się do nazwanego stylu `Elevation/Overlay`.

Opis Jiry wymienia więcej zachowań niż obecna implementacja. Rozbieżności są ograniczeniem stanu obecnego, nie obietnicą działania komponentu.

## 5. Zaimplementowane Rozwiązanie (AS-IS)

### HLD Obecnego Rozwiązania

1. **Granica biblioteki.** Źródłem komponentu jest `design-system-votey`. `VoteyMenuComponent` i typ pozycji są eksportowane przez `angular/src/public-api.ts`, budowane przez `ng-packagr` do podścieżki paczki `@pleodigital/design-system-votey/angular`. Storybook jest osobnym konsumentem tego eksportu i prezentuje interakcje bez zapisu danych.
2. **Granica wykonania.** W przeglądarce host przekazuje `items` i `selectedId`; komponent renderuje listę. Kliknięcie dostępnej pozycji emituje `itemSelected` z całym obiektem pozycji. Escape lub Tab emituje `dismissed`; host musi sam rozstrzygnąć zamknięcie panelu. Fokus i aktywny indeks są stanem lokalnym instancji. Nie ma żądania BE ani transakcji.
3. **Granica stylowania.** Menu używa wygenerowanych zmiennych CSS kolorów, odstępów i promienia. Storybook importuje `tokens.angular.css`. Cień Menu zawiera stałe liczbowe w SCSS.
4. **Granica komponentów Design Systemu.** `VoteyMenuComponent` korzysta z `VoteyTextComponent` i `VoteyTranslatePipe`. `VoteySelectComponent` używa `MatSelect`/`MatOption`, a `VoteyMultiSelectPopoverComponent` renderuje własne checkboxy; żaden z nich nie importuje Menu.

### 5.1 Backend (BE)

N/A dla samego `vt-menu`: typ pozycji, wybór i aktywny indeks istnieją w pamięci FE. Komponent nie definiuje endpointu, eventu, tabeli, migracji ani reguły autoryzacji BE.

### 5.2 Frontend (FE)

#### Wejście, stan i wyjście

| Element | Aktualny kontrakt |
| --- | --- |
| `items` | Opcjonalna lista `readonly VoteyMenuItem[]`, domyślnie pusta. Pozycja ma wymagane `id: string`, `label: string` oraz opcjonalne `disabled?: boolean`. Komponent nie sprawdza unikalności `id`; `@for` śledzi po `id`. |
| `selectedId` | `string | null`, domyślnie `null`; równość z `item.id` ustawia klasę `selected` i kolor tekstu `accent`. Nie przenosi fokusu. |
| `dataCy` | `string | null`, domyślnie `null`; jest przekazywany jako atrybut `data-cy` listy. |
| `itemSelected` | `OutputEmitterRef<VoteyMenuItem>`; kliknięcie dostępnego przycisku emituje cały obiekt, nie samo `id` ani pole `value`. |
| `dismissed` | `OutputEmitterRef<void>`; emitowany przy `Escape` i `Tab`, bez samodzielnego ukrycia Menu. |

`activeIndex` zaczyna od 0. `resolvedActiveIndex` wskazuje tę pozycję, jeśli jest dostępna, w przeciwnym razie pierwszą dostępną; przy braku dostępnych pozycji zwraca -1. Tylko odpowiadający jej przycisk ma `tabindex="0"`, pozostałe `-1`. `focusFirst()` i `focusLast()` są publicznymi metodami, lecz komponent nie wywołuje ich automatycznie przy montażu. ArrowUp/ArrowDown przesuwają fokus, pomijają `disabled` i zawijają indeks; Home/End skaczą do pierwszej/ostatniej dostępnej pozycji. Każdy fokus przycisku aktualizuje `activeIndex`.

Widok ma `ul role="menu"`, `li role="none"` i natywne `button role="menuitem"`. Przycisk niedostępny otrzymuje natywne `disabled`; nie ma osobnego `aria-disabled`. Wybrana pozycja nie ma `aria-selected`. Tytuł pozycji przechodzi przez `VoteyTranslatePipe`, a `VoteyTextComponent` używa wariantu `body`; kolory to `primary`, `muted` lub `accent`. Warunek koloru sprawdza `selected` przed `disabled`, więc pozycja jednocześnie wybrana i niedostępna zachowuje kolor `accent` i tło `selected`, mimo natywnego wyłączenia.

Styl kontenera określa szerokość 240 px, `max-width: 100%`, pionowy padding `--space-icon-gap`, tło `--color-bg-surface`, promień `--radius-3xl` oraz obrys uzyskany wewnętrznym cieniem z `--color-border-subtle`. Każdy przycisk ma wysokość 44 px i padding oparty na `--space-control-padding-y/x`. Hover dostępnej pozycji i klasa `selected` używają `--color-bg-surface-tint`; fokus widoczny ma obrys z `--color-border-focus`. Zewnętrzny cień ma zapisane w SCSS wymiary `0 8px 24px -4px` i kolor mieszany z tokenu. Kontener używa `overflow: hidden`; brak limitu wysokości i wewnętrznego przewijania. `vt-text` nie dostaje `maxLines` ani `wrap`, więc Menu nie ustanawia jawnego kontraktu pojedynczej linii z wielokropkiem.

Nie ma routingu, resolvera, loading, error ani permission state wewnątrz Menu: inputy są synchroniczne, a komponent nie pobiera danych. Stan empty to pusta lista bez komunikatu. Stan validation nie występuje; komponent nie waliduje danych pozycji poza pominięciem `disabled` przy obsłudze kliknięcia i fokusu.

### 5.3 Design

Potwierdzony w kodzie wygląd to opisane style SCSS oraz semantyczne zmienne CSS dla tła, tekstu, obramowania, odstępów i promienia. Style jasne i ciemne pochodzą z generatora `tokens.angular.css`; Storybook importuje ten plik. Linki Figmy z WYBOREK-3052 są materiałem kontekstowym, nie dowodem wdrożenia konkretnych wartości. W szczególności kod Menu nie stosuje nazwanego efektu `Elevation/Overlay`.

- [Figma — węzeł 1633:575](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1633-575&t=snUZacLc7XlGQoeb-4)
- [Figma — węzeł 1633:573](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1633-573&t=snUZacLc7XlGQoeb-4)

## 6. Aktualne Zachowanie (AS-IS)

### 6.1 Zachowanie Pozytywne

1. Host przekazuje listę; Menu renderuje dla każdej pozycji przycisk z przetłumaczoną etykietą.
2. Kliknięcie dostępnej pozycji aktualizuje indeks aktywny i emituje `itemSelected` z tym obiektem. Sam komponent nie zmienia `selectedId`.
3. ArrowDown/ArrowUp, Home/End przesuwają fokus po dostępnych pozycjach, z pominięciem wyłączonych i zawijaniem na końcach.
4. Równość `selectedId` z `item.id` ustawia wygląd `selected`; hover dostępnego przycisku ustawia tint tła.
5. Escape i Tab emitują `dismissed`; efekt zamknięcia zależy od hosta.

### 6.2 Zachowanie Negatywne I Edge Case

1. Kliknięcie pozycji `disabled` nie emituje wyboru; przycisk jest natywnie wyłączony. Nawigacja klawiaturą ją pomija.
2. Pusta lista daje `ul` bez pozycji; `focusFirst()` / `focusLast()` nie przenoszą fokusu. Gdy wszystkie pozycje są niedostępne, żadna nie ma `tabindex="0"`.
3. `selectedId` nie powoduje ustawienia fokusu ani przewinięcia. Długa lista nie ma wewnętrznego scrolla, a zawartość wykraczająca poza kontener może zostać ukryta przez `overflow: hidden`.
4. Nie ma osobnego handlera `Enter` ani testu aktywacji z klawiatury. Natywna semantyka `button` pozostaje jedynym źródłem takiej aktywacji.
5. Dla pozycji jednocześnie `selected` i `disabled` wizualny priorytet `selected` wyprzedza kolor `muted`; natywne `disabled` nadal blokuje interakcję.

### 6.3 Reguły Funkcjonalne

- Identyfikator służy do porównania wyboru i śledzenia renderowanych wierszy. Typ nie gwarantuje unikalności; komponent nie ma jawnej obsługi duplikatów.
- Emisja zdarzenia nie jest trwałym zapisem. Menu nie kontroluje wartości przechowywanej przez hosta.
- Stan aktywny i stan wybrany są niezależne. Fokus może znajdować się na innej pozycji niż `selectedId`.
- Dostępność klawiaturowa opiera się na natywnych przyciskach i `tabindex`; kod nie ogłasza wybranego elementu przez `aria-selected`.

## 7. Kryteria Akceptacji Aktualnego Stanu

| ID | Kryterium |
| --- | --- |
| AC-01 — wejście i wybór | Given lista z dostępną pozycją, when użytkownik klika jej przycisk, then `itemSelected` emituje odpowiadający obiekt `VoteyMenuItem`, bez lokalnej zmiany `selectedId`. |
| AC-02 — niedostępność | Given pozycja `disabled`, when użytkownik próbuje ją kliknąć albo przejść do niej strzałką, then Menu nie emituje jej wyboru i fokus przechodzi tylko po dostępnych pozycjach. |
| AC-03 — opuszczenie | Given fokus na pozycji, when naciśnięto Escape albo Tab, then Menu emituje `dismissed`; samo nie usuwa widoku. |
| AC-04 — wybór i fokus | Given `selectedId` równe `id` pozycji, when renderuje się lista, then pozycja ma klasę `selected` i kolor `accent`, ale komponent nie przenosi na nią fokusu i nie nadaje `aria-selected`. |
| AC-05 — krótka i długa lista | Given odpowiednio 3 albo 20 pozycji, when renderuje się Menu, then przyciski mają wysokość 44 px i kontener nie ma reguły `max-height` ani `overflow-y: auto`; nie obowiązuje potwierdzony limit 288 px. |
| AC-06 — pusta lista | Given `items=[]`, when renderuje się Menu, then istnieje pusty kontener `ul` bez automatycznego komunikatu i bez aktywnego przycisku. |
| AC-07 — granica komponentów DS | Given źródła Design Systemu, when sprawdza się zależności Selecta i MultiSelectPopover, then nie importują one `VoteyMenuComponent`. |

## 8. Rozszerzenia Stackowe I Kontrakty Techniczne: Angular

### 8.1 Struktura FE I Integracja Z Danymi

- Jednostka biblioteczna: komponent `vt-menu` oraz publiczny eksport Angular. Jednostka demonstracyjna: Storybook `ANGULAR COMPONENTS/Menu`.
- Routing, guards, resolvers, serwisy FE, endpointy, DTO BE, cache i odświeżanie: N/A dla Menu; nie ma ich w jego kodzie.
- Dane pozycji pochodzą od hosta jako input. Dla instancji Storybook są statycznymi argumentami podglądu. Nie ma źródła danych ani trwałego ownershipu w samym Menu.
- Tekst jest przekazywany przez `VoteyTranslatePipe`; wynik zależy od tłumacza dostarczonego przez aplikację. Brak lokalnych komunikatów błędu i pustej listy.

### 8.2 Dostępność, Tematy I Ograniczenia

- Role `menu` / `menuitem` i natywne `disabled` są obecne; nie ma `aria-selected` ani inputu `ariaLabel` dla Menu (brak potwierdzony również testem eksportu).
- Fokus z klawiatury otrzymuje styl `focus-visible`; styl Hover nie jest przyznawany samej pozycji aktywnej klawiaturą.
- Kolory i typografia korzystają ze zmiennych CSS, ale zewnętrzny cień oraz wysokość 44 px i szerokość 240 px mają wartości w kodzie. Nie ma dowodu spełnienia wymogu Jiry „żadna wartość literalna”.
- Token `--space-overlay-max` istnieje w wygenerowanym CSS, lecz Menu go nie używa. Brak potwierdzonego zachowania limitu sześciu pozycji i izolacji przewijania strony.

### 8.3 Testy I Dowody

| Zakres | Istniejący dowód | Granica dowodu |
| --- | --- | --- |
| Publiczny eksport, inputy i outputy | `tests/angular-package.test.js` sprawdza selektor `vt-menu`, `items`, `selectedId`, `itemSelected`, `dismissed` oraz brak `ariaLabel`. | Test nie sprawdza wizualnej dostępności ani przewijania. |
| Emisja wyboru i opuszczenia | Ten sam test wywołuje wybór pozycji dostępnej/niedostępnej oraz Escape. | Brak testu klawiaturowego fokusu, Tab, Enter i renderu DOM. |
| Podgląd | `storybook/stories/angular/Menu.stories.jsx` przekazuje pozycje, `selectedId` i subskrybuje oba outputy. | Jest demonstracją komponentu, nie dowodem jego użycia w aplikacji. |

Próba uruchomienia `node --test tests/angular-package.test.js` w analizowanym workspace zakończyła się przed asercjami błędem `ERR_MODULE_NOT_FOUND` dla `@angular/cdk` importowanego przez Angular Material. Nie jest to wynik testu zachowania Menu.

## 9. Wpływ Na Inne Specyfikacje

- Specyfikacja główna: ten dokument `docs/sdd/menu/specification.md`.
- Inne zaktualizowane specyfikacje: brak.
- Brak dodatkowego wpływu: tak, w zakresie dokumentowania stanu Menu. Select i MultiSelectPopover pozostają osobnymi implementacjami; nie ma potwierdzonego wspólnego kontraktu wymagającego aktualizacji ich specyfikacji.
- `affectedSpecifications`: `[]`.

## 10. Wersjonowanie

- Pierwsza pełna wersja tej specyfikacji AS-IS: `1.0.0`; bez sztucznego bumpa za wypełnienie nowego dokumentu.
- Rejestr: `docs/sdd/versioning.md`, wpis `menu: 1.0.0`.
- Wersja dokumentu nie jest wersją paczki npm.

## 11. Zaimplementowany Sposób Wdrożenia I Rollback

### 11.1 Build I Dystrybucja

`package.json` biblioteki udostępnia `build:tokens` (Style Dictionary), `build:angular` (`ng-packagr`) i zbiorcze `build`, które przygotowuje `dist/`. Eksport `./angular` wskazuje na wynik w `dist/angular`, a `dist/css/tokens.angular.css` jest osobnym artefaktem stylów. Workflow `.github/workflows/npm-publish.yml` jest skonfigurowany na push do `main` albo ręczne uruchomienie: instaluje zależności, waliduje i buduje paczkę, podbija patch przez `npm version patch --no-git-tag-version`, publikuje przez `npm publish` i zapisuje commit wersji. Jest to konfiguracja procesu, a nie dowód, że konkretna wersja trafiła do npm.

Nie znaleziono flagi sterującej Menu, migracji danych ani kolejki; nie ma też kolejności wdrożeń FE/BE wynikającej z kodu tego komponentu.

### 11.2 Obserwowalność I Rollback

Menu nie ma własnego logowania, metryk ani śledzenia zdarzeń poza outputami Angular. Repozytoryjne testy oraz podgląd Storybook służą do weryfikacji podczas rozwoju, ale nie stanowią monitoringu produkcyjnego. Nie znaleziono procedury automatycznego rollbacku specyficznej dla Menu. To granica dowodów, nie instrukcja operacyjna.

## 12. Definition Of Done Dla Dokumentu AS-IS

- [x] Opis biznesowy i techniczny odpowiadają potwierdzonemu kodowi, a rozbieżności z Jira są oznaczone jako ograniczenia.
- [x] Kontrakt inputów, outputów, fokusu, stylów i granica z innymi komponentami Design Systemu są opisane bez wymagania podglądu HLD.
- [x] BE, trwałe dane, migracje, obserwowalność i rollback są opisane zgodnie z dostępnymi dowodami lub jawnym N/A.
- [x] Kryteria akceptacji opisują tylko aktualnie obserwowalny stan; istniejące testy i luka środowiskowa są odróżnione.
- [x] Wersja dokumentu i wpis w rejestrze są zgodne.

## 13. Workflow Handoff I Akceptacji

- Status: lokalny draft AS-IS przygotowany do pokazania developerom przez PleoAI.
- Obieg typu `specification`: `BE -> FE -> TESTER` według skilla SdD; dla tego komponentu sekcja BE jest `N/A`.
- Następny krok: przegląd przez developerów i dalszy workflow po ich reakcji. W ramach tego zadania dokument nie został samodzielnie opublikowany ani zgłoszony do review.

### Źródła I Ograniczenia Analizy

- `design-system-votey`: `angular/src/lib/menu/*`, `angular/src/lib/text/*`, `angular/src/lib/select/*`, `angular/src/lib/multi-select-popover/*`, `angular/src/public-api.ts`, `storybook/stories/angular/Menu.stories.jsx`, `tests/angular-package.test.js`, `build-style-dictionary.mjs`, `package.json`, `.github/workflows/npm-publish.yml`.
- Jira WYBOREK-3052 posłużyła jako lista twierdzeń do sprawdzenia. Nie zastępuje źródeł implementacji. Nie sprawdzano faktycznej publikacji npm.
