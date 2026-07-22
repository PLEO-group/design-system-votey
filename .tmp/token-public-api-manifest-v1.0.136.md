# Manifest publicznego API tokenów — 1.0.136

Data pomiaru: 2026-07-22  
Commit bazowy: `dd614ce7371765222e13879e6798e0fae38e04d1`  
Źródło pomiaru: istniejący `dist`, bez ponownego uruchamiania builda  
Weryfikacja zawartości paczki: `npm pack --dry-run --json`

## Podsumowanie

| Obszar | Wynik |
|---|---:|
| Unikalne zmienne CSS runtime | 87 |
| Primitive/base color variables | 44 |
| Semantic color variables light | 43 |
| Semantic color variables dark | 43 |
| Klucze Tailwind `color` | 87 |
| Publikowane pliki CSS tokenów | 4 |
| Publikowane pliki SCSS tokenów | 2 |
| Wszystkie pliki `dist` | 175 |
| Wszystkie wpisy paczki npm | 177 |

Motywy light i dark wystawiają ten sam zestaw 43 nazw semantycznych. Wartości nie są częścią tego punktu checklisty; porównanie wartości i źródeł nastąpi w kolejnych punktach etapu 0.

## Zmienne CSS — primitives/base

Źródło publiczne: `dist/css/tokens.css`, selektor `:root`.

```text
--color-active-green-25
--color-active-green-300
--color-active-green-400
--color-active-green-500
--color-blue-100
--color-blue-25
--color-blue-300
--color-blue-400
--color-blue-70
--color-gray-100
--color-gray-400
--color-gray-500
--color-gray-700
--color-mint-green-100
--color-mint-green-300
--color-mint-green-400
--color-mint-green-50
--color-mint-green-500
--color-mint-green-600
--color-mint-green-70
--color-mint-green-800
--color-navy-blue-100
--color-navy-blue-200
--color-navy-blue-25
--color-navy-blue-400
--color-navy-blue-50
--color-navy-blue-600
--color-navy-blue-70
--color-navy-blue-700
--color-navy-blue-800
--color-navy-blue-900
--color-orange-100
--color-orange-300
--color-orange-400
--color-orange-50
--color-orange-500
--color-orange-70
--color-orange-800
--color-red-200
--color-red-400
--color-red-50
--color-white
--color-yellow-100
--color-yellow-400
```

## Zmienne CSS — semantic colors

Źródła publiczne:

- `dist/css/tokens.light.css`, selektor `:root`;
- `dist/css/tokens.dark.css`, selektor `:root[data-theme="dark"]`.

Oba pliki mają dokładnie ten sam zbiór nazw:

```text
--color-alert-strong
--color-alert-weak
--color-border-active
--color-border-bright
--color-border-contrast
--color-border-dark
--color-border-info
--color-border-primary
--color-button-background-active
--color-button-background-dark
--color-button-background-edit
--color-button-background-hover-active
--color-button-background-hover-dark
--color-button-background-hover-edit
--color-button-background-inactive
--color-button-border-hover-active
--color-button-border-hover-dark
--color-button-border-hover-edit
--color-button-text-active
--color-button-text-dark
--color-button-text-edit
--color-button-text-inactive
--color-gradient-dark
--color-gradient-light
--color-icon-dark
--color-icon-inactive
--color-surface-active
--color-surface-brand
--color-surface-bright
--color-surface-dynamic
--color-surface-highlight
--color-surface-inactive
--color-surface-info
--color-surface-mild
--color-surface-subtle
--color-text-active
--color-text-bright
--color-text-contrast
--color-text-dark
--color-text-dim
--color-text-highlight
--color-text-inactive
--color-text-inactive-dark
```

## Publiczne nazwy Tailwind

Źródło publiczne: `dist/css/tokens.tailwind.css`, blok `@theme`.

Plik wystawia 87 zmiennych w namespace `--color-*`: wszystkie 44 primitives i wszystkie 43 semantic colors wymienione powyżej. Publiczny klucz Tailwind powstaje przez usunięcie prefiksu `--color-`.

Przykłady dokładnego mapowania:

| CSS custom property / `@theme` | Klucz Tailwind | Przykładowe utility generowane przez Tailwind 4 |
|---|---|---|
| `--color-white` | `white` | `bg-white`, `text-white`, `border-white` |
| `--color-navy-blue-800` | `navy-blue-800` | `bg-navy-blue-800`, `text-navy-blue-800` |
| `--color-surface-brand` | `surface-brand` | `bg-surface-brand`, `text-surface-brand` |
| `--color-text-dark` | `text-dark` | `text-text-dark`, `bg-text-dark` |
| `--color-border-primary` | `border-primary` | `border-border-primary`, `bg-border-primary` |
| `--color-button-background-active` | `button-background-active` | `bg-button-background-active` |

Manifestuje się klucze `@theme`, a nie skończoną listę klas. Tailwind 4 generuje właściwe utility zależnie od użytych namespace'ów i klas wykrytych w aplikacji konsumenckiej.

## Publikowane pliki tokenów

| Plik | Rozmiar | Liczba nazw | SHA-256 |
|---|---:|---:|---|
| `dist/css/tokens.css` | 1547 B | 44 | `9ad13e9cb5325bec37e7225f4b8eb6fab3aa54a0787abfa314c458275374816f` |
| `dist/css/tokens.light.css` | 2370 B | 43 | `4086c31d7f1682fca5d0fb382a1da2c67fb710296bfea8e36b16d8ca4f170783` |
| `dist/css/tokens.dark.css` | 2470 B | 43 | `6392c60bc61266a080af96a4943edad2a235edfeb2ae7134d38329f3bf8d16d0` |
| `dist/css/tokens.tailwind.css` | 4805 B | 87 | `a07cff6daa5054d805a01c2e9e510bbed8714b6aedfb1ebefa6426ececc862cd` |
| `dist/scss/_variables_light.scss` | 2908 B | 87 | `b8d5136937398d5357a3995ba6f97c1711a7775d237bfe4aa0d0d06e3c9314c5` |
| `dist/scss/_variables_dark.scss` | 2908 B | 87 | `878825564bf3b501404af2ce7acc6503e82a3b2a92cdf10133434485fbe1930c` |

## Zawartość paczki npm

`package.json#files` publikuje cały katalog `dist`. Npm dodaje także wymagane `README.md` i `package.json`.

| Grupa | Liczba plików |
|---|---:|
| `README.md` | 1 |
| `package.json` | 1 |
| `dist/css` | 4 |
| `dist/scss` | 2 |
| `dist/assets/react/icons` | 81 |
| `dist/assets/react/illustrations` | 88 |
| **Razem** | **177** |

Parametry paczki potwierdzone przez dry-run:

- nazwa: `@pleodigital/design-system-votey`;
- wersja: `1.0.136`;
- rozmiar archiwum: 327269 B;
- rozmiar po rozpakowaniu: 1301829 B;
- liczba wpisów: 177.

## Wykryte problemy kontraktu

1. `package.json#main` wskazuje `dist/js/tailwind-preset.js`, ale taki plik nie istnieje w `dist` i nie trafiłby do paczki.
2. W aktualnym `dist` nie ma plików Angular raw SVG, mimo że skrypt builda deklaruje ich kopiowanie. Jest to poza tokenowym zakresem bieżącej pracy, ale wpływa na ogólną kompletność paczki.
3. Manifest opisuje zastany `dist`. Nie potwierdza jeszcze zgodności z JSON-ami źródłowymi — to osobny, następny punkt etapu 0.

## Polecenia odtworzenia pomiaru

```powershell
rg --files dist
npm.cmd pack --dry-run --json
```

Nazwy CSS zostały odczytane wyrażeniem `--[a-z0-9-]+(?=\s*:)` i znormalizowane przez sortowanie oraz usunięcie duplikatów.

