# Firmowe kontrakty nazewnictwa

Stosuj te neutralne wzorce jako rekomendowaną bazę nowego design systemu. Skill konkretnego DS może wybrać własne nazwy i strukturę tokenów core/semantic. Samo odejście od poniższych propozycji nie jest podstawą do `BLOCK`, `WARN`, `REVIEW_REQUIRED` ani wyjątku w manifeście.

## Tokeny: `pleo-design-system-tokens-v1`

### Warstwy i źródła

- Rozdziel tokeny na `core` i `semantic`.
- Core opisuje skalę lub wartość bazową. Semantic opisuje rolę w interfejsie i aliasuje core.
- Light i dark są trybami semantycznych tokenów zależnych od motywu, nie trzecią warstwą obok core/semantic.
- Rekomenduj nazwę pliku zawierającą `core`, np. `core.json`, `color-core.json` albo `typography-core.tokens.json`, ponieważ ułatwia discovery. Projekt może użyć innej nazwy lub klasyfikować warstwę katalogiem, kolekcją, manifestem albo konfiguracją generatora.
- Dla plików semantic dopuszczaj zarówno nazwy zawierające `semantic`, jak i nazwy opisujące theme/mode, np. `light-theme.json`, `dark-theme.json` albo `mobile-375.json`.
- Nie wyprowadzaj findingu z samej obecności, braku ani kolejności segmentów `core` i `semantic` w basename pliku, ścieżce tokenu lub publicznej zmiennej.
- Jako przenośny default proponuj angielskie nazwy zapisane małymi literami i segmenty wielowyrazowe w kebab-case.
- Jako przenośny default nie umieszczaj w nazwie wartości (`blue`, `16px`) ani nazwy produktu/komponentu, jeśli token opisuje rolę współdzieloną.

Znormalizowana logiczna postać używana w przykładach firmowego kontraktu i przy tłumaczeniu między projektami:

```text
<category>.core.<scale-or-primitive>
<category>.semantic.<role>[.<state-or-property>]
```

Przykłady:

```text
color.core.neutral.900
spacing.core.16
color.semantic.background.surface
color.semantic.text.primary
spacing.semantic.content-gap
typography.semantic.body.font-size
```

Fizyczna ścieżka w JSON może zachować strukturę istniejącego DS, np. `core.spacing.16`, `bg.surface` albo `typo.body.font-size`, o ile pipeline potrafi deterministycznie rozróżnić warstwy i zbudować wymagane outputy. Nie wymagaj migracji, wyjątku ani findingu tylko po to, aby ujednolicić nazwy plików lub dodać segment `core`/`semantic` do ścieżki tokenu.

W audycie oceniaj rozdzielenie odpowiedzialności core/semantic, aliasy, modes, deterministyczność generatora i politykę użycia. Jeżeli pipeline nie potrafi jednoznacznie rozpoznać warstw, zgłoś brak maszynowej klasyfikacji lub source of truth — nie wybór nazwy.

Dozwolone bazowe kategorie to `color`, `spacing`, `typography`, `radius` i `opacity`; `grid` jest warunkowy. Nową kategorię dodaj dopiero po potwierdzeniu, że nie mieści się w istniejącej.

### Proponowane publiczne nazwy

Jeżeli projekt przyjmuje poniższy default, generuj nazwy publiczne deterministycznie ze ścieżki źródłowej, normalizując segmenty do kebab-case. Warstwa `core`/`semantic` pozostaje wtedy metadanym kontraktu i nie jest segmentem publicznej nazwy.

```text
color.core.<palette>.<scale>        -> --color-<palette>-<scale>
color.semantic.<role>.<descriptor> -> --color-<role>-<descriptor>
spacing.core.<scale>                -> --spacing-<scale>
spacing.semantic.<role>             -> --space-<role>
typography.semantic.<role>.<prop>   -> --typo-<role>-<prop>
radius.core.<scale>                 -> --radius-<scale>
radius.semantic.<role>              -> --radius-<role>
opacity.core.<scale>                -> --opacity-<scale>
opacity.semantic.<role>             -> --opacity-<role>
```

W tym proponowanym wariancie zmienne SCSS używają tej samej nazwy bez prefiksu `--`, poprzedzonej `$`. Projekt może przyjąć inny deterministyczny kontrakt publiczny bez wyjątku, findingu i migracji do powyższych nazw. Mapowanie do postaci logicznej dokumentuj tylko wtedy, gdy jest potrzebne do integracji między narzędziami lub projektami; nie traktuj go jako warunku zgodności. Migracji wymagaj dopiero przy faktycznej zmianie już opublikowanego API danego projektu, a nie z powodu różnicy względem propozycji firmowej.

### Semantyka i motywy

- Nazwa semantic pozostaje taka sama w light i dark; zmienia się alias/wartość.
- Stan umieszczaj po roli, np. `color.semantic.border.control.disabled`.
- Dla typografii traktuj `font-family`, `font-size`, `font-weight`, `line-height` i `letter-spacing` jako właściwości jednej nazwanej roli.
- Jeden koncept ma jeden kanoniczny token. Przed dodaniem sprawdź duplikaty semantyczne, nie tylko identyczne ścieżki.

## SVG: `pleo-design-system-assets-v1`

### Zasady bazowe

- Rozdziel źródła na `assets/icons/**` i `assets/illustrations/**`.
- Nazywaj po angielsku, małymi literami; używaj tylko liter ASCII, cyfr, `_` i `-`.
- `_` oddziela segmenty techniczne, a `-` słowa w descriptorze.
- Nazwa opisuje znaczenie/funkcję, nie nazwę warstwy z narzędzia projektowego ani sam wygląd.
- Folder, context w nazwie i publiczny namespace muszą być zgodne.
- Jeden koncept ma jeden kanoniczny asset. Redesign bez zmiany znaczenia nie zmienia nazwy.

Kanoniczne wzorce plików:

```text
icon_<context>_<descriptor>[_<modifier>].svg
illu_<context>_<descriptor>[_<modifier>].svg
logo_<brand>_<descriptor>[_<modifier>].svg
```

Przykłady neutralne:

```text
icon_ui_search.svg
icon_ui_visibility-off.svg
icon_menu_dashboard.svg
illu_info_subscription-calculator.svg
illu_empty_no-results.svg
logo_product_sygnet.svg
```

`context` opisuje przeznaczenie i namespace. Globalna baza nie narzuca pełnej listy contextów: zatwierdzoną listę, foldery i dozwolone modyfikatory definiuje skill konkretnego DS. Nowy context wymaga aktualizacji generatora, preview oraz tego skilla projektowego.

### Mapowanie publiczne

Angular Registry:

1. Ustal namespace z zatwierdzonego contextu/folderu.
2. Usuń techniczny prefiks `icon_<context>_`, `illu_<context>_` albo `logo_`.
3. Zamień pozostałe `_` na `-` i znormalizuj do lowercase kebab-case.
4. Dodaj namespace; wynik musi być unikalny w typowanej liście registry.

React:

1. Zamień stem pliku na PascalCase.
2. Dla ikon dodaj `Icon`, dla ilustracji `Illu`, a dla logo `Logo`, o ile prefiks nie wynika już jednoznacznie ze stemu.
3. Eksport musi być generowany ze źródłowego SVG i unikalny w publicznym entry poincie.

Nie naprawiaj nazw ręcznie w `dist`. Rename lub usunięcie publicznego assetu jest zmianą kontraktu i wymaga klasyfikacji SemVer oraz mapowania migracyjnego dla konsumentów.

## Walidacja

Guardraile mają sprawdzać co najmniej:

- jednoznaczną, deterministyczną klasyfikację warstw w pipeline niezależnie od przyjętych nazw;
- dozwolone znaki i zgodność z wzorcem zadeklarowanym przez dany projekt, jeśli taki wzorzec istnieje;
- zgodność folderu, contextu, prefiksu i namespace;
- unikalność źródłowej oraz publicznej nazwy;
- duplikaty semantyczne wymagające review;
- deterministyczne mapowanie nazw Angular/React;
- brak ręcznych aliasów i zmian wygenerowanego outputu.
