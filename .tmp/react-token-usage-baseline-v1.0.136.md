# Baseline użyć tokenów w `votey-user-app` — 1.0.136

Data pomiaru: 2026-07-22  
Commit React: `2cb65c668a91d25e4b1a1fe61cfacea248068846`  
Branch: `main`  
Zakres skanu: 980 plików `css`, `ts`, `tsx`, `js`, `jsx` i `mdx` w `src`  
Stan repo podczas pomiaru: clean

## Importy stanowiące kontrakt

`src/styles/globals.css` importuje w tej kolejności:

```css
@import "tailwindcss";
@import "@pleodigital/design-system-votey/dist/css/tokens.css";
@import "@pleodigital/design-system-votey/dist/css/tokens.light.css";
@import "@pleodigital/design-system-votey/dist/css/tokens.dark.css";
@import "@pleodigital/design-system-votey/dist/css/tokens.tailwind.css";
@import "./tokens.samsung.css";
```

Lokalne `breakpoints.css` i `responsive.css` są importowane później. Nie są częścią tokenów kolorów i pozostają niezmienianym kontraktem Reacta.

## Podsumowanie użyć

| Zbiór | Używane nazwy | Bezpośrednie `var(--color-*)` | Użycia przez utility Tailwind | Razem odwołań |
|---|---:|---:|---:|---:|
| Nazwy publikowane w obecnym `dist` | 76 z 87 | 80 | 1085 | 1165 |
| Nazwy istniejące w źródłach DS, ale brakujące w `dist` | 142 ze 160 | 24 | 339 | 363 |
| **Łącznie chroniony kontrakt używanych nazw DS** | **218** | **104** | **1424** | **1528** |

Najważniejszy wniosek: React używa już 142 nazw istniejących w aktualnych źródłach Design Systemu, których paczka `1.0.136` nie publikuje w zastanym `dist`. W szczególności `tokens.tailwind.css` nie może obecnie wygenerować utility dla tych nazw. Naprawa zgodności source → dist jest więc również naprawą realnego kontraktu Reacta, ale musi przejść regresję.

## Najczęściej używane nazwy publikowane w `dist`

| Klucz | Direct | Tailwind | Razem |
|---|---:|---:|---:|
| `text-dark` | 12 | 242 | 254 |
| `surface-bright` | 4 | 135 | 139 |
| `surface-dynamic` | 3 | 86 | 89 |
| `surface-mild` | 2 | 57 | 59 |
| `white` | 1 | 51 | 52 |
| `mint-green-400` | 6 | 37 | 43 |
| `red-400` | 2 | 31 | 33 |
| `border-active` | 2 | 30 | 32 |
| `icon-dark` | 1 | 31 | 32 |
| `navy-blue-800` | 0 | 31 | 31 |
| `border-primary` | 2 | 26 | 28 |
| `surface-subtle` | 1 | 26 | 27 |
| `border-dark` | 1 | 21 | 22 |
| `gray-100` | 3 | 14 | 17 |
| `text-contrast` | 0 | 17 | 17 |

## Najczęściej używane nazwy brakujące w `dist`

| Klucz | Direct | Tailwind | Razem |
|---|---:|---:|---:|
| `surface-attention` | 0 | 25 | 25 |
| `text-on-accent` | 2 | 19 | 21 |
| `text-subtle` | 0 | 16 | 16 |
| `border-neutral-strong` | 0 | 14 | 14 |
| `surface-light-navy` | 0 | 14 | 14 |
| `red-500` | 0 | 9 | 9 |
| `alert-decent` | 0 | 7 | 7 |
| `surface-neutral-emphasis` | 0 | 7 | 7 |
| `text-muted` | 0 | 7 | 7 |
| `border-thumb-disabled` | 0 | 5 | 5 |
| `border-emphasis` | 1 | 3 | 4 |
| `border-interactive-hover` | 0 | 4 | 4 |
| `button-text-hover-soft-dark` | 4 | 0 | 4 |
| `surface-accent-strong` | 0 | 4 | 4 |
| `surface-mild-mint` | 0 | 4 | 4 |
| `surface-on-contrast` | 0 | 4 | 4 |
| `surface-thumb-active-green` | 1 | 3 | 4 |
| `text-bright-strong` | 0 | 4 | 4 |
| `text-lighter-navy` | 0 | 4 | 4 |
| `text-tertiary` | 0 | 4 | 4 |

## Pełność zbioru

Z 87 nazw publikowanych w obecnym `dist` React nie używa 11:

```text
alert-strong
blue-300
blue-70
icon-inactive
mint-green-70
navy-blue-700
orange-100
orange-800
surface-active
text-highlight
yellow-100
```

Ze 160 nazw obecnych w źródłach, ale nieobecnych w `dist`, React nie używa tylko 18:

```text
blue-600
blue-900
border-interactive-active
border-interactive-emphasis
border-interactive-subtle
border-strong
border-subtle-contrast
button-text-strong
controls-disconnect-border-subtle-accent
mint-green-900
surface-ashy-gray
surface-base-strong
surface-interactive-active
surface-neutral-strong
surface-success
text-action-subtle
text-info-soft
yellow-600
```

Oznacza to, że pozostałe 142 nazwy niepublikowane w `dist` są częścią faktycznego kontraktu kodu React.

## Brand override — `tokens.samsung.css`

Plik zawiera:

- 26 deklaracji;
- 25 unikalnych nazw;
- 22 unikalne nadpisania nazw publikowanych w obecnym `dist`;
- dwie nazwy obecne w źródłach, ale brakujące w `dist`: `--color-surface-active-selected` i `--color-text-brand`;
- jedną nazwę lokalną, nieobecną w źródłach DS: `--color-input-border-idle`;
- `--color-input-border-idle` jest zdefiniowane dwukrotnie w różnych zakresach pliku.

Kolejność importów powoduje, że brand override jest nakładany po base/light/dark/Tailwind. Ta kolejność musi pozostać chroniona do czasu zaprojektowania formalnego mechanizmu brand theme.

## Szczególnie ryzykowna zmiana wartości

React używa `--color-button-background-inactive` dwa razy bezpośrednio w `src/components/button/button.css`. Aktualne źródło i `dist` mają różne referencje tego tokenu w light i dark. Pierwszy rebuild zgodny ze źródłami zmieni więc istniejący wygląd przycisku, jeśli zmiana nie zostanie świadomie wycofana albo zaakceptowana.

## Kontrakt ochronny dla dalszych prac

1. Nie usuwać ani nie zmieniać nazw 76 używanych tokenów publikowanych w obecnym `dist`.
2. Naprawa pipeline'u musi opublikować 142 używane nazwy już obecne w źródłach.
3. Nie uznawać wygenerowania większego `tokens.tailwind.css` za wystarczającą walidację — wymagany jest build i regresja Reacta.
4. Zachować kolejność importów oraz możliwość brand override.
5. Każdą zmianę wartości istniejącego tokenu testować osobno od addytywnego uzupełnienia brakujących nazw.
6. Nie dodawać w tym etapie nowych tokenów spacingu/typografii ani nowego scalingu do Reacta.

## Metoda skanu

- bezpośrednie odwołania liczono przez `var(--color-*)`;
- użycia Tailwind liczono dla namespace'ów color, m.in. `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`, gradient, ring i outline;
- warianty typu `hover:`/`dark:` są liczone, ponieważ zachowują właściwą nazwę utility;
- definicje w `tokens.samsung.css` analizowano oddzielnie od użyć;
- dynamicznie konstruowane nazwy, których pełna wartość nie występuje w kodzie, nie są możliwe do zagwarantowania przez statyczny skan.

