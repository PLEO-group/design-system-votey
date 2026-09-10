# Angular: grid i theming

## Routing

Wczytaj tę referencję tylko dla Angulara, gdy `responsive.grid.enabled: true` albo gdy wdrażasz light/dark runtime. Najpierw przeczytaj uniwersalne reguły stylowania w `responsive-layout-and-grid.md`, a tutaj stosuj wyłącznie adapter Angulara. React nie ma jeszcze firmowych assetów runtime dla tych obszarów; nie kopiuj angularowych providerów do Reacta. Do czasu dodania osobnego wariantu zapisz React jako brakujący zakres lub rozwiązanie projektowe wymagające akceptacji.

## Grid

Grid jest opcjonalny. Po odpowiedzi `tak` ustal z Figmy i zapisz w planie oraz skillu konkretnego DS:

- warianty gridu i wariant domyślny;
- uporządkowane nazwy wszystkich breakpointów i odpowiadające im core tokens;
- dla `device-contract`: wspólne top-level `responsive.deviceBreakpointMap` każdego device type na breakpoint referencyjny, istniejące niezależnie od grida;
- dla breakpointów używanych przez grid: liczbę kolumn, gutter, margin i margin-extra;
- czy klasyfikacja ma wynikać z rodzaju urządzenia, czy szerokości viewportu;
- aplikacje używające poszczególnych wariantów;
- czy potrzebny jest debug overlay.

Użyj `assets/angular/grid/grid.tokens.example.json` jako źródłowego modelu tokenów i przepuść go przez Style Dictionary. `columns`, `gutter`, `margin` i `margin-extra` zapisuj jako liczby w pikselach referencyjnej ramki, nie jako CSS dimensions. Format `pleo/responsive-scss-config` generuje z manifestu, breakpointów i grid tokens jedną mapę SCSS pod `responsive.generatedConfigScssPath`; ścieżka musi wskazywać katalog źródłowy kompilowany z adapterami, nie `dist`. Nie wpisuj wartości drugi raz ręcznie. Publiczne aliasy runtime to `--grid-columns`, `--grid-column-width`, `--grid-column-gap`, `--grid-margin` i `--grid-margin-extra`.

Wybierz dokładnie jeden adapter zgodny z `responsive.mode`:

- `device-contract` → `device-grid-contract.example.scss`; `data-device` wybiera breakpoint referencyjny z manifestu, a gutter/margin/margin-extra są płynnie przeliczane na `vw`; szerokość kolumny wynika z szerokości viewportu pomniejszonej o marginesy i wszystkie guttery;
- `css-media` → `breakpoint-grid-contract.example.scss`; adapter przechodzi po uporządkowanych breakpointach i emituje media query dla każdego punktu, dla którego istnieją tokeny danego wariantu.

Nie mieszaj adapterów. Nazwy `deviceTypes` oznaczają rodzaj urządzenia w pierwszym wariancie, a profile viewportu w drugim. Skopiuj `grid.provider.example.ts`, ustaw `data-grid-type` na tym samym hoście co kontrakt i zarejestruj `provideDesignSystemGrid({ variant })` w konsumencie. Nazwa wariantu musi odpowiadać tokenom.

Preferuj CSS Grid i `grid-column` zamiast ręcznego obliczania szerokości kolumn. Komponenty DS mogą używać `--grid-column-gap` i `--grid-margin`, ale nie mogą zawierać projektowych wartości liczbowych ani importować konfiguracji aplikacji.

Testy gridu muszą pokryć każdy wariant i tryb, obecność wymaganych tokenów, liczbę kolumn oraz brak jednoczesnego adaptera device/media. Preview powinno używać `grid-overlay.component.example.ts` albo równoważnego overlayu dla każdej konfiguracji.

## Theming

Theming Angular jest jednym firmowym kontraktem:

1. Style Dictionary generuje identyczne publiczne nazwy semantic tokens dla light i dark, zmieniając wyłącznie ich aliasy lub wartości.
2. Wygenerowane Angular CSS variables są selektorami `body[data-theme="light"]` i `body[data-theme="dark"]`; nie utrzymuj ręcznie dwóch list aliasów.
3. `index.html` zaczyna od `<body data-theme="light">`.
4. `DesignSystemThemeService.loadTheme()` jawnie odtwarza preferencję z `sessionStorage["theme"]` podczas startu aplikacji.
5. `setTheme(isDark: boolean)` zapisuje wybór tylko dla bieżącej sesji i aktualizuje `body`; jeśli przeglądarka wspiera View Transitions, stosuje zmianę wewnątrz `document.startViewTransition()`.

Źródłami startowymi są `assets/tokens/semantic.light.example.json`, `assets/tokens/semantic.dark.example.json` i `assets/style-dictionary/config.example.mjs`. Użyj `assets/angular/theming/theme-contract.example.scss` tylko do bazowego `color-scheme` i stylów hosta; nie duplikuj w nim wygenerowanej listy tokenów.

Skopiuj `theme.service.example.ts`, `theme.service.example.spec.ts`, `theme-contract.example.scss` oraz fragment `theme-host.example.html`. Wyeksportuj service przez publiczne Angular API. W konsumencie wstrzyknij service i wywołaj `loadTheme()` dokładnie raz podczas startu aplikacji; komponent przełącznika może użyć zwróconego boolean jako stanu początkowego.

Nie dodawaj providera inicjalizującego, `APP_INITIALIZER`, `provideAppInitializer`, `localStorage`, hosta `html`, `prefers-color-scheme` ani osobnego skryptu bootstrapującego. Są to inne warianty architektoniczne, a nie firmowy Angular default. Nowy wariant może wejść do bazy scenariuszy dopiero po jawnej decyzji dewelopera skonsultowanej z szefem.

Testy muszą pokryć light, dark, zapis i odczyt sesji, brak zapisanej preferencji, fallback bez View Transitions oraz ścieżkę z View Transitions. Weryfikuj identyczny zestaw ścieżek semantic tokenów między modes: każdy publiczny token zależny od theme musi istnieć w obu trybach. Komponent nie może odwoływać się bezpośrednio do core colors, jeśli polityka manifestu dopuszcza wyłącznie semantic colors.
