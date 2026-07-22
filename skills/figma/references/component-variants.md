# Figma Component Variants

## Cel

Komponenty typu `ButtonCommon` mają w Figmie **component set** z wieloma property (np. `Color`, `Size`, `State`). Zadanie "zmień hover dla color-quaternary" dotyczy konkretnej komórki tej macierzy — ale bez kontekstu pozostałych komórek łatwo wprowadzić niespójność (hover łamie konwencję innych colorów, disabled nie pasuje do reszty itp.).

Ten dokument opisuje workflow, w którym **zawsze budujesz pełną macierz wariantów przed kodowaniem**, nawet jeśli zmieniasz tylko jedną komórkę.

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

### Krok 2 — doprecyzuj zakres zadania z userem

Z userem ustal dokładnie **którą komórkę** macierzy modyfikujesz. Nie zakładaj — zapytaj jeśli nie wynika jednoznacznie z promptu.

### Krok 3 — odczytaj TYLKO zmienianą komórkę + sąsiedztwo

Nie czytaj całego component setu (jest zbyt duży i zużywa tokeny). Odczytaj:

1. **Target** — dokładnie komórkę, którą zmieniasz (nodeId z URL).
2. **Baseline** — default state tej samej kolumny (np. `color-quaternary / default`) dla porównania.
3. **Peer** — analogiczny stan w innym kolorze (np. `color-primary / hover`) jeśli musisz zweryfikować wzorzec.

Wywołuj `get_design_context` **równolegle** dla tych 2–3 nodeIds.

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

**Tabela musi być pełna** — jeśli z Figmy nie wynika jakaś wartość, zapytaj usera zamiast zgadywać.

### Krok 5 — weryfikacja spójności z resztą macierzy

Zanim napiszesz CSS, sprawdź istniejące hovery dla innych colorów (szybki Grep w `.css`). **Pytanie:** czy zmiana pasuje do konwencji? Jeśli nie — potwierdź z userem że to celowe.

### Krok 6 — edytuj tylko właściwy blok CSS

Używaj wzorca per-variant custom properties opisanego w `styling-guide`. Edytuj tylko blok odpowiadający zmienianej komórce — nie ruszaj reszty.

## Zasady

- **Nie zmieniaj wartości, które nie wynikają z tabeli w kroku 4.**
- **Nie duplikuj wartości, które są takie same jak default.**
- **Zawsze pokaż userowi tabelę** przed edycją kodu.
- **Zachowuj konwencję nazw** (kolejność wymiarów w selektorach, kolejność colorów w palecie itp.).

## Integracja z innymi skillami

- **Po tym skillu**: `styling-guide` (tokeny kolorów, pattern custom properties), `engineering-rules` (jakość kodu).
