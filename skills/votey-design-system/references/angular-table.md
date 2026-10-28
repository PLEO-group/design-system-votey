# Tabela Angularowa Votey

Czytaj tylko przy użyciu, migracji, debugowaniu lub zmianie `vt-table` w Angularze.
Nie dotyczy React/Next. To skrót decyzji; pełnego API nie duplikujemy tutaj.
Najpierw potwierdź API w zainstalowanej paczce — lokalne źródła mogą być nowsze.

## Wybór kolumn i szablonu

- Importuj `VoteyTableComponent`, `VoteyTableCellDirective` i typy wyłącznie
  z `@pleodigital/design-system-votey/angular`.
- Wymagane: `rows`, `rowKey`, `label`. Podaj `columns` albo włącz `autoColumns`.
- Preferuj jawne `columns`: stała kolejność i nagłówki także dla pustych danych.
  `id` identyfikuje kolumnę niezależnie od nazwy pola i klucza tłumaczenia.
- Podaj **albo** `field` (typowany bezpośredni klucz rekordu), **albo** `value(row)`
  (wartość wyliczana). Ścieżki z kropkami nie są interpretowane.
- Domyślny tekst: `body`; `0` i `false` pozostają widoczne, null/undefined są puste.
  Obiekty i tablice wymagają funkcji zwracającej prymityw lub własnego szablonu.
- Preferuj jeden wspólny `ng-template vtTableCell` z `@switch (column.id)`
  i własnym `@default`, zamiast wielu deklaracji szablonów.
- Kontekst: `$implicit` = rekord, `column`, `value`, `index` widocznego wiersza.
  `[vtTableCellOf]="table"` zapewnia typowanie kontekstu przez referencję komponentu.
- Pierwszeństwo: nazwany `vtTableCell="id"` > wspólny `vtTableCell` > tekst `body`.
  Szablon zmienia prezentację, nie wartość używaną do wyszukiwania.
- Akcje rekordu to ostatnia kolumna z `role: 'actions'`; akcje całej tabeli
  umieszczaj w projekcji `[vtTableToolbar]`, a wybranych rekordów w `selectionActions`.

```html
<vt-table #table label="LABEL.MEMBERS"
  [rows]="rows()" [columns]="columns" [rowKey]="rowKey">
  <ng-template vtTableCell [vtTableCellOf]="table"
    let-row let-column="column" let-value="value">
    @switch (column.id) {
      @case ('actions') {
        <vt-button text="BUTTON.EDIT" (pressed)="edit(row)" />
      }
      @default {
        <vt-text variant="body" [content]="'' + (value ?? '')" />
      }
    }
  </ng-template>
</vt-table>
```

## Opcjonalne autoColumns

- Domyślnie false. Generuje `id` i `field` z `Object.keys(rows[0])`, przed
  lokalnym wyszukiwaniem i stronicowaniem. Nagłówek: `headersPrefix + klucz`,
  cały klucz uppercase; prefiks domyślnie pusty.
- Definicja z `columns` o tym samym id zastępuje całą wygenerowaną definicję;
  dodatkowe definicje dopisywane są na końcu. `excludedColumns` usuwa id w obu trybach.
- Przy pustych danych pozostają tylko jawne definicje. Pola występujące dopiero
  w kolejnych rekordach nie są wykrywane; strony remote mogą mieć inne kolumny.
- Nowe pole API może pojawić się w UI. Dla kontrolowanego zestawu pól używaj
  jawnych columns. Wykluczenie kolumny nie jest kontrolą dostępu do danych.
- Generowane kolumny nie są searchable; włącza to jawne nadpisanie kolumny.

## Dane, requesty i zaznaczanie

- `rowKey` zwraca stabilne string/number; nie indeks ani referencję obiektu.
- Tabela nie wykonuje HTTP. `queryChange` przekazuje `{ page, size, search, filters }`.
  Aplikacja obsługuje request i aktualizuje kontrolowane inputy. `page` liczone od 0.
- `searchMode='remote'`: przekazuj bieżącą stronę rows i totalElements z backendu.
  `local`: pełny zbiór; tabela filtruje, liczy wyniki i opcjonalnie dzieli na strony.
  `none` nie dodaje wyszukiwarki; nie oznacza lokalnego stronicowania.
- FE search działa tylko po kolumnach z `searchable: true`, korzystając z field/value.
- Automatyczny search: 300 ms i minimum 3 znaki. 1–2 znaki zachowują poprzedni zbiór;
  X przywraca pełny zbiór. `search` to zastosowana fraza, nie szkic inputu.
- Przy zaznaczeniu search wymaga Enter/lupy, a X również potwierdzenia.
  Monit jest wbudowany; odmowa zachowuje zaznaczenie i zastosowane zapytanie.
- Filtry stosuj przez `await table.requestFilters(candidate)` — dopiero zaakceptowana
  zmiana emituje queryChange. Nie omijaj monitu przez bezpośrednią zmianę filters.
  `filtersCancelled` umożliwia przywrócenie szkicu formularza filtrów.
- `selectedKeys` / `selectedKeysChange` lub `[(selectedKeys)]` przechowuje klucze
  także innych stron. Zmiana strony ich nie czyści. Checkbox nagłówka dotyczy
  widocznych rekordów; checkboxy i Shift nie wymagają monitu.
- `selectionActions` otrzymuje wszystkie zaznaczone klucze jako `$implicit`.
- `loading` pokazuje skeleton (size przy paginacji, inaczej 5 wierszy) i blokuje
  kontrolki. Aplikacja obsługuje `retry`; własne akcje blokuje w swoim szablonie.
- Nagłówki: `caption-extrabold`, standard surface/primary, heavy inverse;
  header, zaznaczanie i kolumna akcji są sticky w przewijanym obszarze.
- Komponent składa istniejące vt-search/input/button/checkbox/pagination/text.
  Nie zastępuj ich lokalnymi kopiami; wyjątki wymagają zgody użytkownika.

## Gdzie zajrzeć dalej

Ścieżki względem repo `design-system-votey` (w konsumencie najpierw znajdź repo/paczkę):
- Specyfikacja, tłumaczenia i zakres odłożony: `docs/sdd/table/specification.md`.
- Instrukcja API: Storybook → Angular/Components/Table → API & Usage;
  źródło `storybook/components/TableApiGuide.jsx`, stories `storybook/stories/angular/Table.stories.jsx`.
- Publiczny eksport: `angular/src/public-api.ts`; kontrakt i implementacja: `angular/src/lib/table/`.
- Przykład konsumenta: repo `wyborek-crm`, `src/app/client/members/members-list/`.
- Po zmianie zachowania dobierz weryfikację: `npm run test:table-search`
  buduje Angular i uruchamia testy Search/Table, w tym rzeczywiste szablony TestBed/jsdom.
  Layout, sticky, motywy i overflow sprawdzaj w przeglądarce; jsdom nie mierzy geometrii.
- Przy zwykłej integracji zacznij od tej referencji i publicznych typów. Implementację
  czytaj przy debugowaniu, brakującym kontrakcie lub zmianie źródeł; nie wczytuj całej suity z góry.
