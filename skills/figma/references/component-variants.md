# Figma Component Variants

## Cel

Komponenty typu `ButtonCommon` mają w Figmie **component set** z wieloma property (np. `Color`, `Size`, `State`). Zadanie "zmień hover dla color-quaternary" dotyczy konkretnej komórki tej macierzy — ale bez kontekstu pozostałych komórek łatwo wprowadzić niespójność (hover łamie konwencję innych colorów, disabled nie pasuje do reszty itp.).

Ten dokument opisuje workflow, w którym najpierw identyfikujesz pełne **wymiary** macierzy, a następnie odczytujesz i tabelaryzujesz tylko komórki potrzebne do żądanego zakresu. Pełną macierz wartości budujesz wyłącznie przy audycie całego component setu albo zmianie obejmującej wiele stanów i wariantów.

## Kiedy używać

- Komponent ma ≥2 wymiary wariantowości (color × state, size × state, itd.).
- Zadanie modyfikuje **pojedynczą komórkę** macierzy (np. tylko hover w color-quaternary).
- Zadanie **dodaje nowy wariant** do istniejącego komponentu (np. `color-octonary`).
- Zadanie **weryfikuje spójność** między wariantami.

Nie używaj gdy:
- Tworzysz komponent bez wariantów (bazowy skill `figma` wystarcza).
- Zmieniasz wartość, która nie zależy od wariantu (np. globalny padding, font-family).

## Jak rozpoznać, że komponent ma macierz wariantów

### Sygnały w kodzie

Wystarczy jeden, żeby uznać komponent za wielowariantowy:

- Selektory CSS z prefiksami wariantu — `&.color-*`, `&.size-*`, `&.variant-*`, `&.type-*`, `&.state-*` — szczególnie gdy jest ≥2 selektory z tego samego prefiksu.
- Typy TS/JSX z unionami typu `color: "primary" | "secondary" | ...` lub enumy ze Strapi (`Enum_Componentsharedbuttoncommon_Color_Variant`, `Enum_*_Size`).
- Funkcja `cn()` składająca klasy z wielu template stringów: `` `color-${colorVariant}` ``, `` `size-${size}` ``, `` `type-${type}` ``.
- Pattern per-variant custom properties (`--btn-*`, `--card-*`) nadpisywanych w blokach `&.color-*`, `&.size-*` itp.
- Plik komponentu ma dedykowany `*.css` z wieloma blokami wariantów (nie tylko Tailwind).

### Sygnały w Figmie

- URL usera wskazuje na **Component Set** — `get_metadata` zwraca `type: "COMPONENT_SET"` (nie `COMPONENT`).
- `get_design_context` zwraca listę `componentProperties` z wieloma property typu `VARIANT` (np. `Color`, `Size`, `State`).
- Kilka wariantów widocznych obok siebie w tym samym frame (wizualna macierz w Figmie).

### Sygnały w prompcie usera

- Wspomnienie konkretnej komórki macierzy: „color-quaternary", „size-mini", „hover", „disabled", „focus".
- Słowa-klucze: „wariant", „variant", „state", „tylko dla [coloru/rozmiaru]", „wszystkie kolory", „wszystkie rozmiary", „component set".

### Zasada triggera

**Jeśli którykolwiek sygnał jest obecny → użyj tego dokumentu.** W razie wątpliwości: sprawdź kod komponentu (istniejące selektory CSS + typ propsa) **zanim** zapytasz usera.

---

## Workflow

### Krok 1 — zidentyfikuj wymiary macierzy

Przed jakąkolwiek operacją Figma, przeczytaj istniejący kod komponentu i wypisz wymiary wariantowości.

```
ButtonCommon:
- Color: primary | secondary | tertiary | quaternary | quinary | senary | septenary | octonary
- Size: mini | regular | menu
- State: default | hover | disabled
- Type: button | icon-button | underlined-button
- Variant: (none) | ghost
```

### Krok 2 — wybierz tryb zakresu

Ustal zakres z promptu i podanych nodeId. Pytaj tylko wtedy, gdy nie wynika jednoznacznie:

- `CELL` — jedna komórka, np. `color-quaternary / hover`,
- `ROW_OR_COLUMN` — kilka jawnie wskazanych stanów albo wariantów,
- `NEW_VARIANT` — nowy wariant i wszystkie stany, które ma faktycznie obsługiwać,
- `FULL_AUDIT` — pełna spójność component setu na jawne żądanie usera.

### Krok 3 — odczytaj tylko komórki wynikające z trybu

Nie czytaj całego component setu, jeśli zadanie ma węższy zakres.

Dla `CELL` odczytaj:

1. **Target** — dokładnie zmienianą komórkę (nodeId z URL).
2. **Baseline** — default state tej samej kolumny, jeśli target nie jest defaultem.
3. **Peer** — analogiczny stan w innym wariancie tylko wtedy, gdy trzeba zweryfikować wzorzec.

Jeśli user podał tylko nodeId targetu:

1. Wywołaj `get_metadata` dla targetu i najbliższego parenta typu `COMPONENT_SET`.
2. W indeksie siblingów znajdź komponent z tymi samymi wartościami pozostałych properties i `State=Default`.
3. Analogicznie znajdź peer tylko wtedy, gdy wymaga go kontrola konwencji.
4. Wywołaj `get_design_context` równolegle wyłącznie dla targetu oraz odnalezionego baseline'u i peer'a.
5. Jeśli metadata nie ujawnia parenta, sibling nodeId albo wartości properties, poproś usera o link do baseline'u lub component setu. Nie zgaduj nodeId i nie blokuj targetu danymi spoza żądanego zakresu.

Jeśli user podał target i baseline, pomiń discovery i wywołaj `get_design_context` **równolegle** dla podanych nodeIds.

Dla `ROW_OR_COLUMN` i `NEW_VARIANT` odczytaj wszystkie i tylko komórki należące do wskazanego wiersza/kolumny oraz potrzebne baseline'y.

Dla `FULL_AUDIT`:

1. Użyj `get_metadata` do zbudowania indeksu wymiarów i nodeId bez pobierania całego ciężkiego design contextu.
2. Odczytuj komórki przez `get_design_context` w ograniczonych partiach.
3. Oznacz komórki nieodczytane jako `partial` albo `blocked`; nigdy nie uzupełniaj ich z intuicji.

### Krok 4 — zbuduj tabelę przed kodowaniem

Wypisz jawnie co się zmienia:

```
ButtonCommon, type-button, size-regular, color-quaternary
Property  | default           | hover (odczytane z Figmy)
bg        | transparent       | navy-blue-800
border    | navy-blue-800     | navy-blue-800 (bez zmian)
text      | navy-blue-800     | mint-green-400
icon-bg   | navy-blue-800     | navy-blue-800 (bez zmian)
icon-color| mint-green-400    | mint-green-400 (bez zmian)
```

**Tabela musi być pełna dla wybranego trybu i żądanego zakresu.** Nie dodawaj komórek spoza zakresu jako `?`. Jeśli brakuje wartości potrzebnej do implementacji targetu, zapytaj usera zamiast zgadywać.

### Krok 5 — weryfikacja spójności z resztą macierzy

Zanim napiszesz CSS, sprawdź istniejące odpowiedniki dla innych wariantów w kodzie (szybki Grep w `.css`). Traktuj je jako kontrolę konwencji, nie jako źródło wartości z Figmy. **Pytanie:** czy zmiana pasuje do konwencji? Jeśli nie — potwierdź z userem, że to celowe.

### Krok 6 — edytuj tylko właściwy blok CSS

Używaj wzorca per-variant custom properties opisanego w `styling-guide`. Edytuj tylko blok odpowiadający zmienianej komórce — nie ruszaj reszty.

## Zasady

- **Nie zmieniaj wartości, które nie wynikają z tabeli w kroku 4.**
- **Nie duplikuj wartości, które są takie same jak default.**
- **Zawsze pokaż userowi tabelę** przed edycją kodu.
- **Zachowuj konwencję nazw** (kolejność wymiarów w selektorach, kolejność colorów w palecie itp.).

## Integracja z innymi skillami

- **Po tym skillu**: `styling-guide` (tokeny kolorów, pattern custom properties), `engineering-rules` (jakość kodu).
