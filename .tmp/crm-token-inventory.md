# Inwentaryzacja tokenów i wartości w `wyborek-crm`

Data pomiaru: 2026-07-22  
Commit bazowy CRM: `dfc969e217bb5b2ff9c75205c20c6117e966cc3b`  
Branch: `test`  
Zakres: `src`, bez `node_modules` i bez uruchamiania builda  
Pliki SCSS: 153

## 1. Kolory

### Architektura zastana

`src/styles.scss` ładuje `styles/colors` jako pierwszy lokalny moduł SCSS. `src/styles/colors.scss` definiuje dwie warstwy:

1. 100 primitives nazwanych wartością hex, np. `--color-07064e`;
2. 110 aliasów aplikacyjnych `--app-color-*`, np. `--app-color-brand-primary`.

| Metryka | Wynik |
|---|---:|
| Definicje `--color-*` | 100 |
| Definicje `--app-color-*` | 110 |
| Wszystkie definicje kolorów | 210 |
| Referencje do `--color-*` | 94 |
| Referencje do `--app-color-*` | 1466 |
| Aliasy app używane poza `colors.scss` | 96 |
| Primitives używane bezpośrednio poza `colors.scss` | 0 |

Wniosek: komponenty są już w większości odseparowane od hex primitives. Najważniejszą warstwą migracyjną jest `--app-color-*`; 100 primitives można usunąć razem z `colors.scss`, gdy aliasy zostaną zastąpione tokenami Design Systemu.

### Kategorie aliasów aplikacyjnych

| Kategoria | Liczba tokenów |
|---|---:|
| `bg` | 19 |
| `border` | 18 |
| `text` | 15 |
| `event` | 12 |
| `button` | 7 |
| `status` | 7 |
| `brand` | 6 |
| `gradient` | 6 |
| `timepicker` | 4 |
| `pagination` | 3 |
| `overlay` | 2 |
| `loader` | 2 |
| `primary` | 2 |
| pozostałe pojedyncze kategorie | 7 |

### Najczęściej używane aliasy

Liczby poniżej nie obejmują referencji wewnątrz `colors.scss`.

| Token | Użycia poza `colors.scss` |
|---|---:|
| `--app-color-bg-surface` | 276 |
| `--app-color-brand-accent` | 234 |
| `--app-color-brand-primary` | 214 |
| `--app-color-status-danger` | 54 |
| `--app-color-bg-surface-muted` | 52 |
| `--app-color-brand-accent-hover` | 50 |
| `--app-color-bg-page` | 42 |
| `--app-color-border-default` | 41 |
| `--app-color-brand-primary-dark` | 38 |
| `--app-color-status-warning` | 35 |
| `--app-color-text-soft` | 34 |
| `--app-color-border-muted` | 32 |
| `--app-color-border-chart-divider` | 25 |
| `--app-color-button-secondary-hover-bg` | 16 |
| `--app-color-text-secondary` | 15 |
| `--app-color-bg-accent-soft` | 15 |
| `--app-color-bg-neutral-200` | 14 |
| `--app-color-brand-accent-active` | 13 |
| `--app-color-text-muted` | 13 |
| `--app-color-text-tertiary` | 13 |

Trzy szerokie tokeny — surface, brand accent i brand primary — odpowiadają za 724 użycia. `brand-primary` i `brand-accent` pełnią jednocześnie wiele ról wizualnych, dlatego nie mają bezpiecznego mapowania 1:1 na pojedynczy semantic token DS.

### Przezroczyste kolory, shadows i overlays

Uzupełniający pomiar SCSS po usunięciu komentarzy wykazał:

| Forma | Wystąpienia | Unikalne wartości/formuły |
|---|---:|---:|
| 8-cyfrowy hex `#RRGGBBAA` | 4 | 4 |
| `rgba()` | 65 | 22 |
| `color-mix(... transparent)` | 18 | 10 |

Cztery alpha primitives w `colors.scss` nie są jedną kategorią semantyczną:

- `#1517524d` i `#00000014` są kolorami cieni;
- `#29fa7f4e` i `#157d4000` są przystankami gradientu overlay;
- dodatkowe aliasy loadera składają surface z alpha `78%` i `68%`;
- inline `rgba()` i `color-mix(... transparent)` realizują shadows, overlays/backgrounds, borders, outlines oraz efekty loadera.

Decyzja robocza: core colors pozostają nieprzezroczyste. Przezroczystość jest komponowana w semantic tokens z opaque core + osobnej skali opacity, a nazwy rozróżniają role `shadow`, `overlay`, `border` i `surface`. Pełna klasyfikacja oraz deduplikacja inline wartości należy do etapu 3.

### Nieużywane definicje

Osiem primitives nie zasila żadnego aliasu:

```text
--color-191c63
--color-515182
--color-24dba6
--color-2bf5ba
--color-dcdcdc
--color-1d1b64
--color-27cc9c
--color-25e0a9
```

Czternaście aliasów nie ma użyć poza `colors.scss`:

```text
--app-color-bg-shell
--app-color-bg-shell-dark
--app-color-border-accent
--app-color-border-danger
--app-color-button-primary-bg
--app-color-button-primary-bg-hover
--app-color-button-primary-text
--app-color-button-secondary-bg
--app-color-button-secondary-text
--app-color-primary
--app-color-accent
--app-color-primary-dark
--app-color-surface
--app-color-background
```

Ostatnie pięć jest jawnie oznaczone w pliku jako backward compatibility aliases.

### Niezdefiniowane odwołania

- `--app-color-text-primary-white` — jedno użycie bez fallbacku w `translations-configurator.component.scss`; realny błąd kontraktu.
- `--app-color-text-body` — jedno użycie w `csv-modal.component.scss`, ale z fallbackiem do `--app-color-brand-primary`.

### Pokrycie przez Design System

| Warstwa CRM | Liczba | Exact-value match w źródłach DS | Bez exact match |
|---|---:|---:|---:|
| Hex primitives | 100 | 15 | 85 |
| Aliasy app | 110 | 26 semantic matches | 82 + 2 expressions `color-mix()` |

Exact-value match nie jest jeszcze akceptacją semantyczną. Pełne mapowanie wszystkich 210 definicji znajduje się w [crm-color-token-mapping.md](./crm-color-token-mapping.md).

## 2. Spacing

Analiza aktywnych deklaracji margin, padding, gap, row-gap i column-gap po usunięciu komentarzy:

| Metryka | Wynik |
|---|---:|
| Deklaracje spacingu | 1650 |
| Unikalne pełne wartości deklaracji | 354 |
| Unikalne atomy długości | 134 |
| Deklaracje korzystające z `--spacing-*` lub `--space-*` | 0 |
| Deklaracje spacingu z `calc()` | 5 |

### Deklaracje według właściwości

| Właściwość | Liczba |
|---|---:|
| `padding` | 372 |
| `margin-bottom` | 257 |
| `margin-top` | 245 |
| `margin` | 218 |
| `gap` | 126 |
| `margin-left` | 113 |
| `margin-right` | 92 |
| `padding-top` | 81 |
| `padding-left` | 49 |
| `padding-right` | 46 |
| `padding-bottom` | 43 |
| `column-gap` | 7 |
| `row-gap` | 1 |

### Najczęstsze atomy spacingu

Wartości z shorthandów są liczone osobno, np. `padding: 10px 20px` zwiększa licznik `10px` i `20px`.

| Wartość | Wystąpienia |
|---|---:|
| `20px` | 179 |
| `10px` | 137 |
| `30px` | 135 |
| `40px` | 94 |
| `15px` | 75 |
| `50px` | 74 |
| `60px` | 70 |
| `8px` | 70 |
| `12px` | 58 |
| `16px` | 50 |
| `25px` | 37 |
| `14px` | 36 |
| `24px` | 36 |
| `5px` | 34 |
| `18px` | 31 |
| `0px` | 27 |
| `32px` | 25 |
| `6px` | 25 |
| `70px` | 25 |
| `7px` | 25 |

Widać dominującą skalę opartą o 5/10 px, ale obok niej wiele wartości pośrednich i layoutowych, np. 7, 14, 18, 19, 25, 26, 33, 44, 70, 115, 120 i 170 px. Nie należy automatycznie zamieniać wszystkich wartości na najbliższy stopień skali: część opisuje wymiary/layout, a nie semantic spacing.

Zakres nie obejmuje `width`, `height`, `top/right/bottom/left` ani border radius. Będą analizowane tylko wtedy, gdy okażą się potrzebne dla scalingu lub konkretnego komponentu.

## 3. Typografia

CRM nie ma tokenów typograficznych. Wartości są zapisane bezpośrednio w globalnym `texts.scss` oraz w stylach komponentów.

Globalne `styles.scss` wymusza `"Open Sans", sans-serif !important` na `body *`; Angular Material także otrzymuje Open Sans. `texts.scss` definiuje m.in. klasy `title__24/30/35/40/50`, `extra-bold`, `medium-bold`, `fs-15` i `title__bar`.

| Właściwość | Deklaracje | Unikalne wartości |
|---|---:|---:|
| `font-size` | 621 | 38 |
| `font-weight` | 426 | 13 |
| `line-height` | 222 | 41 |
| shorthand `font` | 138 | 64 |
| `letter-spacing` | 70 | 15 |
| `font-family` | 8 | 3 |

### Najczęstsze font sizes

| Wartość | Wystąpienia |
|---|---:|
| `14px` | 101 |
| `12px` | 72 |
| `16px` | 62 |
| `13px` | 49 |
| `32px` | 48 |
| `18px` | 46 |
| `15px` | 35 |
| `24px` | 35 |
| `17px` | 31 |
| `26px` | 27 |
| `20px` | 25 |
| `11px` | 17 |
| `10px` | 13 |
| `22px` | 11 |
| `28px` | 9 |

Dodatkowo występują cztery różne formuły `clamp()` dla font size oraz pojedyncze wartości do 80 px.

### Najczęstsze weights

| Wartość | Wystąpienia |
|---|---:|
| `800` | 120 |
| `600` | 84 |
| `900` | 71 |
| `700` | 53 |
| `300` | 37 |
| `bold` | 32 |
| `500` | 12 |
| `400` | 11 |

`bold` i `700` powinny zostać znormalizowane do jednej reprezentacji w tokenach.

### Najczęstsze line heights

| Wartość | Wystąpienia |
|---|---:|
| `45px` | 34 |
| `22px` | 24 |
| `30px` | 19 |
| `38px` | 16 |
| `27px` | 10 |
| `25px` | 9 |
| `28px` | 9 |
| `16px` | 7 |
| `19px` | 7 |
| `20px` | 7 |
| `24px` | 7 |

Line height miesza wartości pikselowe i bezjednostkowe. Kontrakt typografii musi jawnie ustalić, gdzie zachowujemy px dla zgodności wizualnej, a gdzie dopuszczamy wartości bez jednostki.

Letter spacing zawiera m.in. `0`, `0px`, `-0.5px`, `-0.54px`, `-0.42px`, `1px`, `2.6px` oraz `-0.03em`. Każda rola typograficzna musi przechowywać tę właściwość jawnie.

## 4. Breakpointy i istniejące mechanizmy skalowania

### Media queries

| Metryka | Wynik |
|---|---:|
| Wszystkie aktywne media queries | 310 |
| Unikalne pełne warunki | 53 |
| Unikalne progi szerokości | 32 |
| Unikalne progi wysokości | 19 |

Najczęstsze warunki:

| Warunek | Wystąpienia |
|---|---:|
| `(max-width: 1600px)` | 186 |
| `(max-width: 1350px)` | 13 |
| `(max-width: 1500px)` | 8 |
| `(max-height: 780px)` | 7 |
| `(max-height: 680px)` | 6 |
| `(max-width: 1400px)` | 6 |
| `(max-width: 1300px)` | 5 |
| `(max-width: 920px)` | 5 |
| `(max-width: 1100px)` | 4 |
| `(min-width: 1555px)` | 4 |
| `(max-height: 760px)` | 4 |
| `(max-height: 800px)` | 4 |

Pozostałe progi szerokości obejmują m.in. 440, 500, 550, 760, 768, 900, 1080, 1231, 1250, 1285, 1355, 1365/1366, 1450, 1650, 1660, 1700, 1706, 1740, 1770, 1800, 1900 i 2520 px.

Dominujący breakpoint 1600 px nie jest centralnym tokenem — jest powtórzony w kodzie około 190 razy. Istnieją także liczne wysokościowe poprawki layoutu.

### Runtime i płynne wartości

| Mechanizm | Wystąpienia | Liczba plików |
|---|---:|---:|
| `transform: scale*()` | 42 | 24 |
| `clamp()` | 16 | 4 |
| `calc()` | 84 | 53 |
| wartości `vw` | 73 | 33 |
| wartości `vh` | 59 | 32 |
| wartości `rem` | 2 | 1 |
| wartości `em` | 1 | 1 |

Większość `transform: scale()` to lokalne zmniejszanie elementów lub animacje, a nie wspólny scaling system. `clamp()` występuje głównie w kalkulatorze i widokach subskrypcji.

Jedyny znaleziony mechanizm TypeScript zależny od viewportu to `LowResInfoComponent`: nasłuchuje `window:resize` i pokazuje warstwę ostrzegawczą poniżej 1200 px. Nie ma `BreakpointObserver`, `matchMedia`, `data-device`, centralnej usługi urządzeń ani breakpoint tokens.

Nie znaleziono:

- zmiennych `--spacing-*` / `--space-*`;
- zmiennych typograficznych;
- zmiennych breakpoint/scaling;
- SCSS mixinów lub funkcji do responsive scalingu;
- centralnej mapy breakpointów.

## 5. Wnioski migracyjne

1. CRM ma już semantyczną warstwę kolorów, ale jest ona lokalna, zbyt szeroka i niezgodna nazwami/wartościami z DS.
2. Najpierw migrujemy `--app-color-*`; primitives nazwane hexami znikną razem z `colors.scss`.
3. 15 primitives oraz 26 aliasów mają exact-value candidates w DS, ale każda rola wymaga potwierdzenia semantycznego.
4. Nie kopiujemy automatycznie 85 brakujących primitives do Design Systemu.
5. Spacing wymaga wyodrębnienia małej skali primitives i osobnego rozpoznania wartości layoutowych.
6. Typografia wymaga pełnych ról z family, size, weight, line height i letter spacing; nie wolno zmienić Open Sans w ramach samego podłączenia.
7. Scaling nie może polegać na prostym przepisaniu 53 istniejących media queries. Najpierw potrzebny jest kontrakt breakpointów i proof of concept na reprezentatywnym ekranie.
8. Punkt startowy migracji powinien mieć niewielki zakres, ale obejmować reprezentatywne kolory, spacing i typografię oraz breakpoint 1600 px.

## Metoda pomiaru

- komentarze blokowe i pełnoliniowe komentarze SCSS zostały pominięte;
- deklaracje spacingu i typografii liczono na aktywnych liniach właściwości;
- wartości shorthand rozbito na atomy tylko dla statystyk częstości;
- użycia kolorów liczono w `scss`, `css`, `html` i `ts` pod `src`;
- dopasowanie kolorów do DS porównuje rozwiązane wartości light theme i nie zastępuje oceny semantycznej.
