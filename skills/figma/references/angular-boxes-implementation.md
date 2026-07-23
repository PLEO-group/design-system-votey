# Angular Boxes / Design System Implementation From Figma

Wczytuj ten plik po `references/mcp-guard.md`, gdy Figma ma prowadzić do zmian w `angular-design-system`, projekcie Boxes albo konsumencie `@design-system/design-system`.
Nie stosuj wartości, tokenów ani ścieżek z tego pliku w `design-system-votey` ani `wyborek-crm`.
Nie używaj tej referencji do React/Next.

## Pipeline

1. Odczytaj dokładny node wskazany przez użytkownika, a nie cały ekran, jeśli `node-id` wskazuje konkretny element.
2. Zbierz potwierdzone wartości: rozmiary, paddingi, gapy, typography, kolory, border, radius, auto-layout i pozycję dzieci względem parenta.
3. Zmapuj wartości na istniejący Angular/SCSS/Design System, nie na Tailwind ani Reactowe komponenty.
4. Sprawdź, czy widok ma istniejący komponent DS albo lokalny komponent projektowy, który powinien być rozszerzony zamiast odtwarzany ręcznie.
5. Przed edycją kodu wypisz kontrakt layoutu i interakcji: kontener, dzieci, display model, szerokości/wysokości, overflow, stany, trigger kliknięć i payload.
6. Po edycji uruchom walidację runtime przez `chrome-debug` albo uczciwie opisz, że dostępny był tylko fallback.

## Standardy Angular w tym projekcie

- Nowe API komponentów opieraj na signalach: `input()`, `input.required<T>()`, `output()`.
- W template używaj Angular control flow: `@if`, `@for`, `@switch`; dla list dawaj stabilny `track`.
- Nie wywołuj metod bezpośrednio w template; przygotuj view model, `computed()` albo pipe.
- Dane do widoku mapuj w TypeScript, nie w HTML.
- Dla formularzy używaj typed forms i przekazuj istniejące `FormControl`, jeśli komponent ma być frontend-only wrapperem nad obecnym flow.
- Zachowuj kontrakty requestów i payloadów 1:1, jeśli refaktor dotyczy tylko prezentacji.

## Design System i tokeny

- Najpierw sprawdź, czy istnieje komponent Design System dla radio, input, search, button, icon, tooltip, link, table state albo placeholdera.
- Nie odtwarzaj ręcznie komponentów DS, jeśli mają publiczne API albo wariant używany w projekcie.
- Kolory mapuj na tokeny z `node_modules/@design-system/design-system/assets/styles/ds-theming.scss`; nie wpisuj hexów z Figmy do SCSS.
- Override internali Design System przez `::ng-deep`, `.mdc-*` albo prywatne klasy jest ostatnią opcją. Jeśli jest konieczny, ogranicz go do lokalnego wrappera komponentu.
- Nie zmieniaj globalnych styli DS przy dopasowaniu jednego widoku.

## Layout Angular/SCSS

- SCSS zagnieżdżaj zgodnie ze strukturą HTML.
- Najpierw odwzoruj mechanikę layoutu z Figmy: flex/grid/auto-layout/fixed/fill/hug, potem wpisuj wartości.
- Przy widokach kolekcji domyślnie użyj komponentu tabeli/listy z Design Systemu albo istniejącego lokalnego wzorca.
- Custom grid, ręczny header/body albo `cdk-virtual-scroll-viewport` stosuj tylko wtedy, gdy DS nie obsługuje wymaganego zachowania albo istniejący moduł już działa w tym wzorcu.
- Jeśli custom layout jest konieczny, unikaj twardych `px` przeniesionych z Figmy 1:1, gdy kontener może być responsywny; utrzymaj proporcje przez `fr`, `minmax(0, ...)`, `min-width: 0` i jawny overflow model.
- Elementy akcji, toolbar, header i footer trzymaj poza scrollowaną listą, chyba że makieta i istniejący wzorzec świadomie mówią inaczej.

## Stany i interakcje

- Porównaj z Figmą wszystkie stany widoczne w flow: initial, loading, empty, data, disabled, selected, hover.
- Hover owijaj w `@media (pointer: fine)`.
- Nie zmieniaj triggera interakcji z makiety albo legacy flow, np. z dedykowanego kontrolera na cały wiersz, bez jawnej decyzji.
- Jeśli refaktorujesz istniejący widok, przed zmianą UI wypisz reguły legacy: kiedy element jest disabled, kiedy można kliknąć, co emituje komponent i jaki obiekt idzie dalej do requestu.

## Walidacja Runtime

Po implementacji Angular/Design System sprawdź przez `chrome-debug`:

- screenshot target route i target viewport,
- console errors po reloadzie,
- poziomy overflow,
- zgodność najważniejszych spacingów, rozmiarów i display modelu z Figmą,
- czy `selected`, `disabled`, `hover`, `loading` i `empty` nie nachodzą na siebie,
- czy komponenty DS nie dostały niezamierzonych globalnych override'ów.

Nie deklaruj pixel-perfect bez screenshotu albo bez jasnego ograniczenia, że walidacja runtime nie była dostępna.
