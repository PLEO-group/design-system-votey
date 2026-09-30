# WERSJA 1.0.0
# AUTOR n.koktysz@pleodigital.com & k.tryba@pleodigital.com

# Spec Driven Specification: Chip (AS-IS)

## 1. Metadane

- Data analizy: 2026-09-25 (Europe/Warsaw).
- Status: Draft AS-IS.
- Powiązane zgłoszenia: WYBOREK-3056.
- Feature slug: `chip`.
- Typ dokumentu: `specification`.
- Tryb pracy: `create`, profil `AS_IS`.
- Zidentyfikowany release / wersja wdrożenia: manifest biblioteki DS `1.0.174`; publikacja tej wersji i numer pakietu w działającym środowisku nie zostały potwierdzone.
- Środowiska objęte analizą: kod źródłowy `design-system-votey`; bez weryfikacji środowiska uruchomieniowego.
- Zakres feature: FE; BE nie uczestniczy w kontrakcie komponentu.
- Zakres stacku: biblioteka Angular 21, Angular Material i CSS custom properties.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Chip pokazuje krótką etykietę wybranej pozycji. Może zawierać przycisk usuwania albo pełnić tylko rolę informacyjną. W wielokrotnym `vt-select` prezentuje wybrane opcje pod polem wyboru; użytkownik może usunąć dostępną opcję przyciskiem na chipie. O tym, czy wybór rzeczywiście zmieni się w kontrolce formularza, decyduje `vt-select` jako komponent nadrzędny.

### 2.2 Opis Techniczny

`VoteyChipComponent` jest samodzielnym komponentem Angular o selektorze `vt-chip`, eksportowanym przez `@pleodigital/design-system-votey/angular`. Renderuje `VoteyTextComponent` oraz warunkowo `VoteyButtonComponent`. Przy naciśnięciu przycisku emituje `removed: void`; nie przechowuje ani nie modyfikuje wyboru. `VoteySelectComponent` przekazuje do Chip etykietę, tekst podpowiedzi usuwania i stan disabled, a po `removed` aktualizuje swój `FormControl`. Styl Chip korzysta z części semantycznych zmiennych CSS pakietu. Kontrakt nie obejmuje HTTP, backendu ani persystencji.

## 3. Zakres

### 3.1 Zakres Biznesowy

- Chip pokazuje etykietę; opcjonalny krzyżyk odpowiada za żądanie usunięcia. Kliknięcie etykiety nie uruchamia zdarzenia usunięcia.
- Gdy usuwanie jest ukryte, pozostaje sama nieinteraktywna etykieta.
- Gdy Chip jest disabled, widoczny przycisk usuwania jest wyłączony.
- W wielokrotnym `vt-select` Chip pojawia się tylko, gdy `showSelectionChips` jest włączone i istnieje co najmniej jedna wybrana opcja. Opcja disabled albo wymieniona w `nonRemovableValues` otrzymuje nieaktywny krzyżyk.
- Lista i zawijanie wielu chipów są odpowiedzialnością `vt-select`, nie samego Chip.

### 3.2 Zakres Techniczny

- Biblioteka DS: `VoteyChipComponent`, `VoteyButtonComponent`, `VoteyTextComponent`, `VoteySelectComponent`, rejestr SVG i semantyczny arkusz tokenów.
- Integracja Select: zaznaczone opcje pochodzą z `FormControl` i listy `options`; `removed` trafia do `removeSelection`, które usuwa odpowiadającą wartość, oznacza kontrolkę jako dirty i touched oraz emituje zmianę.

Publiczny kontrakt `VoteyChipComponent`:

| Element | Typ | Wymagalność / wartość domyślna |
| --- | --- | --- |
| `label` | wejście `string` | Wymagane |
| `removeTooltip` | wejście `string` | Wymagane |
| `showRemove` | wejście `boolean` | Opcjonalne; domyślnie `true` |
| `disabled` | wejście `boolean` | Opcjonalne; domyślnie `false` |
| `removed` | wyjście `void` | Zdarzenie bez payloadu |

### 3.3 Poza Zakresem

- Backend, API, baza danych, migracje i zdarzenia systemowe: Chip nie wykonuje takich operacji.
- Osobny `VoteyMultiSelectPopoverComponent`: zarządza własnym wyborem i nie renderuje Chip.
- Projektowanie docelowej geometrii, nowej ikony, tekstów lub innych zachowań z opisu Jiry; poniżej dokumentowany jest stan kodu.

## 4. Stan Obecny (AS-IS)

`vt-chip` istnieje w repozytorium DS i jest publicznie eksportowany. `vt-select` używa go w gałęzi wielokrotnego wyboru; `VoteyMultiSelectPopoverComponent` go nie używa. Bez opublikowanego artefaktu nie można stwierdzić, czy kod z badanego checkoutu jest identyczny z pakietem dostępnym w działającym środowisku.

Istotne różnice względem wskazówek z Jiry: aktualny szablon używa ikony `ui-close`, nie `ui-close-v2`; przycisk `small icon-button` ma w SCSS 28 × 28 px, a nie 24 × 24 px; `.chip` deklaruje wysokość treści 21 px oraz obrys 2 px (zewnętrznie 25 px przy standardowym `content-box`); styl używa `gap: 0` i tylko lewego `padding-left`; nie ma w Chip reguły `text-overflow: ellipsis` ani limitu szerokości etykiety. Nazwa dostępna przycisku pochodzi z przetłumaczonego `removeTooltip`, nie jest składana automatycznie w formacie „Usuń: [etykieta]”. Są to ograniczenia potwierdzonego stanu, nie wymagania zmiany.

## 5. Zaimplementowane Rozwiązanie (AS-IS)

### HLD Obecnego Rozwiązania

`design-system-votey` buduje pakiet npm zawierający moduł Angular, tokeny CSS i zasoby SVG. Kod biblioteki wykonuje się po stronie przeglądarki jako część aplikacji używającej pakietu. Chip jest komponentem prezentacyjnym. Dla użycia w Select właścicielem stanu wyboru pozostaje `FormControl` przekazany do `VoteySelectComponent`; wybór nie jest własnością Chip. W samym Chip nie występuje granica transakcji, autoryzacji, zapis trwały ani integracja serwerowa. Podgląd draw.io i PNG są wyłącznie pomocniczą wizualizacją; pełny kontrakt znajduje się w tym Markdownie.

### 5.1 Backend (BE)

N/A dla samego Chip. Komponent i jego integracja z Select nie wywołują endpointu, nie publikują eventu i nie mają modelu persystencji. Zdarzenie `removed` nie wykonuje zapisu danych.

### 5.2 Frontend (FE)

**Komponent Chip.** `label` i `removeTooltip` są wymaganymi sygnałami wejścia. Szablon przekazuje etykietę do `vt-text` w wariancie `caption`; kolor jest `primary` lub `muted` zależnie od disabled. `showRemove=false` usuwa `vt-button` z drzewa renderowania. W pozostałych przypadkach używany jest przycisk `ghost` / `small` z ikoną `ui-close`. `disabled` jest przekazywane do natywnego przycisku `button`; wyłączony przycisk nie emituje kliknięcia i nie jest osiągalny Tab. Tekst `removeTooltip` trafia do tooltipu oraz jako fallback nazwy dostępnej w `VoteyButtonComponent`, po przejściu przez `vtTranslate`. Gdy przycisk emituje `pressed`, Chip emituje `removed` bez payloadu. Natywny przycisk obsługuje aktywację klawiaturą Enter i spacją.

**Integracja Select.** Dla `multiple() && showSelectionChips() && selectedOptions.length` Select renderuje po Chip dla każdej wybranej opcji. Etykieta jest opcjonalnie tłumaczona. `selectDisabled`, `option.disabled` i `!isOptionRemovable(option)` sterują disabled Chip. `removeSelection` dodatkowo sprawdza te blokady, odfiltrowuje wartość opcji z tablicy kontrolki, aktualizuje `FormControl`, ustawia dirty/touched i emituje `selectionChange` oraz `change` przez wspólną metodę. `nonRemovableValues` są porównywane po normalizacji stringów (trim i małe litery) albo liczbowo. Przy `showSelectionChips=false` Select nie renderuje listy Chip. Osobny `VoteyMultiSelectPopoverComponent` renderuje checkboxy i ma własne `confirmed: readonly string[]`.

**Styl i motyw.** Chip ma `display:flex`, `white-space:nowrap`, `min-width:0`, lewy padding `--space-inset-xs`, promień `--radius-full`, obrys 2 px i wysokość treści 21 px. Stan podstawowy czyta `--color-accent-soft` i `--color-accent-hover`; disabled czyta `--color-bg-surface-tint` i `--color-border-subtle`. Kolor etykiety pochodzi z `VoteyTextComponent`. `VoteyButtonComponent` ma własny styl fokusa i disabled. Pakiet definiuje semantyczne warianty tokenów dla `:root` i `:root[data-theme="dark"]`; sam Chip nie ma kodu przełączania motywu. Źródłowy SVG `ui-close` ma wpisany kolor wypełnienia; styl disabled przycisku nadpisuje wypełnienie ścieżki na `--color-text-muted`.

**Rozmiar i przepełnienie.** `VoteyButtonComponent` określa mały przycisk z samą ikoną jako 28 × 28 px. Chip nie ustawia osobnego pola kliknięcia 24 × 24 px. `vt-text` nie dostaje z Chip `maxLines` ani klasy ellipsis, więc kod nie gwarantuje wielokropka dla długiej etykiety w wąskim kontenerze.

### 5.3 Design

Implementacja używa wariantu tekstu `caption` oraz semantycznych tokenów wyliczonych wyżej. [Chip w Figma — Wyborek | Design System](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1634-271&t=snUZacLc7XlGQoeb-4) jest materiałem odniesienia dla porównania, nie dowodem zachowania runtime. Część wskazówek Jiry (ikona v2, odstępy, ellipsis, automatyczna nazwa „Usuń: [etykieta]”) nie odpowiada aktualnemu kodowi; ich realizacja nie jest przedmiotem tej specyfikacji AS-IS.

## 6. Aktualne Zachowanie (AS-IS)

### 6.1 Zachowanie Pozytywne

1. Rodzic dostarcza etykietę i tekst usuwania; Chip renderuje tekst oraz domyślnie przycisk.
2. Aktywacja przycisku wywołuje `removed` dokładnie w miejscu wiązania `(pressed)`; Chip nie usuwa się samodzielnie.
3. W wielokrotnym Select zdarzenie uruchamia zmianę wartości kontrolki przez `removeSelection`.
4. `showRemove=false` pozostawia bez przycisku samą etykietę.
5. Zmiana `data-theme` wpływa na semantyczne kolory czytane przez CSS, bez zmiany kodu Chip.

### 6.2 Zachowanie Negatywne I Edge Case

1. Disabled pozostawia przycisk w DOM, lecz natywny `button:disabled` blokuje jego aktywację i Tab.
2. Select blokuje usuwanie opcji disabled oraz wartości z `nonRemovableValues`; sprawdza warunki także w `removeSelection`.
3. Brak zaznaczonych opcji, tryb pojedynczy albo `showSelectionChips=false` oznaczają brak listy Chip w Select.
4. Długa etykieta ma `white-space:nowrap`, ale brak gwarancji wielokropka; jej zachowanie przy ograniczonej szerokości zależy od kontenera.
5. `removeTooltip` jest wymagany przez API komponentu. Tłumaczenie klucza zależy od dostarczonego `VOTEY_TRANSLATOR`; komponent nie generuje tekstu z `label`.

### 6.3 Reguły Funkcjonalne

- Chip jest prezentacją danych i przekazuje intencję usunięcia jako `void`.
- Właściciel stanu wyboru decyduje o zmianie danych; dla `vt-select` jest to `FormControl`.
- Etykieta nie ma handlera kliknięcia. Interaktywność jest ograniczona do opcjonalnego przycisku.
- Styling Chip jest częściowo tokenizowany; `gap: 0`, obrys 2 px i wysokość 21 px są wartościami literalnymi w SCSS.

## 7. Kryteria Akceptacji Aktualnego Stanu

| ID | Obszar | Kryterium aktualnego stanu |
| --- | --- | --- |
| AC-01 | Publiczny kontrakt | Przy utworzeniu `VoteyChipComponent` domyślne `showRemove` wynosi `true`, `disabled` wynosi `false`, a `removed` jest zdarzeniem bez payloadu. Potwierdza to test pakietu. |
| AC-02 | Warianty renderowania | Gdy `showRemove=false`, szablon nie zawiera `vt-button`; gdy `showRemove=true`, zawiera przycisk `ghost` / `small` z `ui-close`. |
| AC-03 | Usunięcie | Kliknięcie lub aktywacja klawiaturą aktywnego przycisku emituje `removed`; kliknięcie samej etykiety nie ma przypisanego handlera. |
| AC-04 | Disabled | Gdy `disabled=true`, przekazany do `vt-button` stan wyłącza natywny przycisk i uniemożliwia `pressed`. |
| AC-05 | Użycie w Select | Dla wielokrotnego Select z zaznaczoną opcją i domyślnym `showSelectionChips=true` renderowany jest Chip. Ten przypadek pokrywa test `votey-select.component.spec.ts`. |
| AC-06 | Własność stanu | Usunięcie dozwolonej opcji z Select zmienia tablicę `FormControl`, oznacza ją dirty/touched i emituje zmianę; opcja disabled albo nieremowalna nie jest usuwana. |
| AC-07 | Motyw | CSS pakietu zawiera zmienne dla `:root[data-theme="dark"]`; sam Chip nie przełącza motywu. Jest to kryterium statycznie potwierdzone kodem, bez testu wizualnego uruchomionego środowiska. |

## 8. Kontrakty Techniczne I Wymagania Niefunkcjonalne

- **API Angular:** publiczny eksport `VoteyChipComponent` z `/angular`; wejścia i wyjście opisane w §3.2. Zdarzenie nie niesie identyfikatora opcji, więc konsument wiąże je z lokalną opcją w szablonie.
- **Kontrakt dostępności:** natywny `button` obsługuje fokus i klawiaturę; `aria-label` wybiera tekst przycisku, jawne `ariaLabel` albo tekst tooltipu. Chip przekazuje tooltip. `aria-disabled` na obramowaniu Chip odzwierciedla disabled. Nie ma gwarancji formatu nazwy „Usuń: [etykieta]”, chyba że taką treść poda rodzic.
- **Dane i transakcje:** brak encji, tabeli, migracji, lokalnego magazynu albo transakcji w Chip. W Select źródłem bieżącego wyboru jest kontrolka formularza.
- **Błędy i obserwowalność:** Chip nie ma własnego stanu loading/error, logowania, metryk ani retry. Ewentualny zapis danych i obsługa błędów należą do konsumenta kontrolki; nie są częścią zdarzenia `removed`.
- **Responsywność i ruch:** Chip nie definiuje breakpointów. Przejścia koloru i obrysu są wyłączane przy `prefers-reduced-motion: reduce`; zawijanie listy chipów ustawia `.chips` w Select.
- **Bezpieczeństwo:** Chip nie wykonuje autoryzacji ani operacji sieciowych. Wyłączony przycisk i walidacja `removeSelection` ograniczają usuwanie po stronie UI; nie stanowią mechanizmu uprawnień serwera.

## 9. Wpływ Na Inne Specyfikacje

Chip używa istniejącego Button i Text oraz jest używany przez Select, ale ten dokument nie zmienia ich kontraktów. Zdalne archiwum zawiera specyfikację Button, lecz nie stwierdzono potrzeby jej aktualizacji w trybie AS-IS. `affectedSpecifications: []`.

## 10. Wersjonowanie

- Wersja nowego dokumentu: `1.0.0`.
- Wpis lokalnego indeksu: `chip: 1.0.0` w `docs/sdd/versioning.md`.
- Wersja dokumentu nie oznacza wersji paczki npm. Manifest DS ma `1.0.174`.

## 11. Zaimplementowany Sposób Wdrożenia I Rollback

### 11.1 Dystrybucja i konfiguracja

Repozytorium DS udostępnia skrypt `build`, który waliduje i generuje tokeny, buduje SVG oraz paczkę Angular. Workflow `.github/workflows/npm-publish.yml` jest skonfigurowany dla push do `main` lub ręcznego uruchomienia; wykonuje `npm ci`, walidację i testy tokenów, build, podbicie patch oraz `npm publish`. To potwierdzenie konfiguracji pipeline, nie wykonania konkretnego release'u. Pakiet zawiera arkusz `dist/css/tokens.angular.css` i zasoby `dist/assets/angular/svg-raw`; `vt-chip` używa tokenów i ikony `ui-close`. Brak osobnej flagi Chip, migracji i backendowego kroku deploymentu.

### 11.2 Rollback i obserwowalność

Kod nie zawiera osobnego mechanizmu rollbacku Chip. Jednostką cofnięcia jest wersja zależności DS lub build aplikacji konsumenta; konkretna procedura środowiskowa nie jest potwierdzona. Kod Chip nie emituje telemetryki ani logów. Testy pakietu i test Select są dostępnymi dowodami na poziomie repozytorium; brak potwierdzonego monitoringu produkcyjnego specyficznego dla Chip.

## 12. Definition Of Done Opisu AS-IS

- [x] Zachowanie biznesowe i kontrakt FE zostały powiązane z kodem Chip i Select w DS.
- [x] Brak BE, danych trwałych i migracji został określony dla granicy samego komponentu.
- [x] Rozbieżności względem Jiry i granice dowodów środowiskowych są jawne.
- [x] Dokument opisuje niezależnie pełny kontrakt bez konieczności otwierania HLD.

## 13. Workflow Handoff I Akceptacji

Dokument pozostaje lokalnym draftem AS-IS do review przez PleoAI i osoby przypisane w workflow. Nie uruchomiono z tego dokumentu publikacji specyfikacji, review Phoebe ani deploymentu.

### Źródła dowodów

- `design-system-votey/angular/src/lib/chip/votey-chip.component.{ts,html,scss}`; `button`, `text`, `icon`, `select` i `multi-select-popover` w tym samym katalogu `lib`.
- `design-system-votey/angular/src/public-api.ts`, `tests/angular-package.test.js`, `angular/src/lib/select/votey-select.component.spec.ts`, `storybook/stories/angular/Chip.stories.jsx`.
- `design-system-votey/package.json`, `dist/css/tokens.angular.css`, `.github/workflows/npm-publish.yml`.

### Ograniczenia analizy

Nie porównywano kodu z opublikowaną zawartością npm `1.0.174`. Próba uruchomienia `node --test tests/angular-package.test.js` nie doszła do asercji z powodu braku `@angular/cdk` w lokalnych zależnościach; wnioski o testach opierają się na ich kodzie. Nie zweryfikowano geometrii i wyglądu w przeglądarce. Opis Jiry i linki Figma służyły do wykrycia rozbieżności, a nie jako źródło kontraktu AS-IS.
