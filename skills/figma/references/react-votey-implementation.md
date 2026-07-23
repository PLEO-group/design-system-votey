# React Votey / PWA Implementation From Figma

Wczytuj ten plik po `references/mcp-guard.md`, gdy Figma ma prowadzić do zmian w `votey-user-app` albo innym konsumencie React/Next.js używającym `@pleodigital/design-system-votey`.
Nie stosuj tej referencji do `wyborek-crm`, Angularowego runtime’u Votey ani do projektów React, które nie używają tej paczki i lokalnych wzorców PWA.
W innym konsumencie React stosuj tylko potwierdzony publiczny kontrakt paczki; lokalne aliasy, klasy, providery i breakpointy PWA wymagają osobnego potwierdzenia w jego repo.

## Obowiązujące instrukcje projektu

1. Odczytaj `AGENTS.md`, `package.json`, `tsconfig.json` oraz globalny plik CSS repo przed zmianą kodu.
2. W `votey-user-app` przed edycją UI wczytaj lokalne skille wymagane przez `AGENTS.md`, w szczególności `engineering-rules` i `styling-guide`; dla prymitywów, assetów, providerów i danych użyj `project-primitives`.
3. Gdy zakres obejmuje parę makiet light/dark albo mapowanie kolorów, użyj również lokalnego `figma-theme-token-mapping`.
4. W `design-system-votey` nie edytuj ręcznie `dist`; zmieniaj tokeny lub źródłowe SVG i uruchamiaj właściwy build.

## Pipeline

1. Odczytaj dokładny node wskazany przez użytkownika; nie rozszerzaj zakresu bez potrzeby.
2. Zbierz potwierdzone rozmiary, paddingi, gapy, typografię, kolory light/dark, border, radius, auto-layout, hierarchię, breakpointy oraz stany.
3. Rozdziel dane z Figmy od decyzji implementacyjnych: wartość z makiety nie jest automatycznie klasą Tailwind, tokenem, breakpointem ani klasą `rv-*`.
4. Zmapuj makietę na publiczny kontrakt paczki Votey i lokalny kontrakt PWA opisane poniżej.
5. Przed edycją wypisz kontrakt layoutu i interakcji: granice sekcji/gridu, rodziców, dzieci, display model, server/client boundary, stany, triggery oraz payload.
6. Po zmianie wykonaj testy statyczne i runtime na wskazanym route, theme i viewportcie.

## Macierz źródeł prawdy

| Zakres | Źródło prawdy |
|---|---|
| geometria, hierarchia, typografia i stany | wskazany node Figmy oraz jego layout-driving scope |
| core colors, semantyczne kolory light/dark i ekspozycja Tailwind | zainstalowana wersja `@pleodigital/design-system-votey` |
| ikony i ilustracje Votey | wygenerowane React SVG z paczki, importowane przez projektowy alias |
| Button, Text, inputy, modale, toast, wrappery assetów | lokalne `src/components` i skill `project-primitives` |
| grid, breakpointy, `rv-*`, device/viewport i font loading | lokalny kod `votey-user-app` |
| i18n, granice Server/Client Components i testy | `AGENTS.md` oraz istniejący kod najbliższego feature’u |

Jeśli źródła są sprzeczne, nie uśredniaj ich. Zgłoś różnicę i ustal, czy task zmienia Design System, kontrakt aplikacji czy tylko konkretny widok.

## Rzeczywisty zakres paczki Votey dla Reacta

- Paczka publikuje core color CSS, semantyczne kolory light/dark, ekspozycję tokenów kolorów dla Tailwind oraz wygenerowane komponenty React SVG.
- Paczka nie publikuje gotowych Reactowych komponentów Button, Text, Input, Modal ani Toast. Te prymitywy są lokalne w PWA.
- Paczka nie jest źródłem PWA gridu, klas `rv-*`, breakpointów, font loadera, `DeviceProvider` ani `ViewportProvider`.
- Publiczny wildcard paczki udostępnia `dist/*`; `votey-user-app` mapuje `@votey/*` na `node_modules/@pleodigital/design-system-votey/dist/assets/react/*` w `tsconfig.json`.
- `next.config.ts` transpiluje paczkę przez `transpilePackages`. Nie usuwaj tego przy zmianach importów assetów.
- Nie importuj niczego z `@pleodigital/design-system-votey/angular` i nie dołączaj `tokens.angular.css` w React/Next.

## CSS i kolejność tokenów

W `votey-user-app` zachowaj kolejność globalnych importów:

1. Tailwind CSS,
2. `tokens.css` z core colors,
3. `tokens.light.css`,
4. `tokens.dark.css`,
5. `tokens.tailwind.css`,
6. dopiero potem lokalne overlaye i style projektu.

`tokens.samsung.css` jest wąskim overlayem aplikacji dla Samsung Internet, nie kanonicznym źródłem Design Systemu. Nie przenoś jego hardcoded wartości do komponentów ani do wspólnych tokenów bez osobnego zakresu.

## Kolory i theme

- Nowe widoki i redesigny PWA mapuj przede wszystkim na semantyczne role z `tokens.light.css` i `tokens.dark.css`.
- Przed użyciem klasy Tailwind potwierdź, że rola istnieje również w `tokens.tailwind.css`; samo istnienie CSS variable w jednym theme nie oznacza dostępnej klasy.
- Nie używaj semantic colors CRM w PWA.
- Nie dodawaj surowych HEX, `rgb()`, lokalnego duplikatu tokenu ani paletowego core coloru, jeśli istnieje właściwa rola semantyczna.
- Jeżeli nie ma dokładnego mapowania pary light/dark, zapisz gap tokenu. Nie wybieraj przybliżenia tylko na podstawie nazwy lub jednego theme.
- Theme jest aktywowany przez `data-theme` na elemencie `html`. Komponent nie powinien równolegle ustawiać theme ani kopiować wartości light/dark do lokalnego stanu.

## Tailwind, spacing, radius i typografia PWA

- `tokens.tailwind.css` eksponuje kolory Design Systemu przez Tailwindowy `@theme`; sprawdź wygenerowaną klasę zamiast wymyślać jej nazwę.
- Klasy `rv-*`, `grid-cont*`, `px-main` i warianty `tablet`, `tablet-landscape`, `desktop` są lokalnym kontraktem `votey-user-app`, a nie publicznym API paczki.
- Nie kopiuj do PWA Angularowych `--space-*`, `--radius-*`, `--typo-*` ani sześciopunktowej interpolacji z `tokens.angular.css`.
- Satoshi jest ładowany lokalnie przez `next/font/local` jako `--font-satoshi`. Zachowaj istniejący loader i role typograficzne projektu; nie importuj Angularowego `--font-family-satoshi`.
- Dla wartości spacingu, rozmiaru, radiusu albo typografii najpierw użyj istniejącego prymitywu lub utility projektu. Jeśli roli brakuje, zgłoś gap zamiast tworzyć przypadkowy lokalny token.

## Responsive i runtime

- Bazowy PWA scaling używa lokalnego `--origin-vw`, `--rpx`, `--rvw` oraz klas `rv-*`; jego punkty odniesienia nie są breakpointami Angular Votey.
- W `votey-user-app` layout jest rozdzielany lokalnymi wariantami CSS: mobile jako baza oraz `tablet`, `tablet-landscape` i `desktop`. Przed implementacją odczytaj ich bieżące media queries z repo.
- Nie mapuj automatycznie Figma 360/375/768/1024/1280/1920 na identyczne breakpointy kodu. Dla każdego podanego node’a ustal właściwy lokalny wariant i wykonaj breakpoint diff.
- Do czysto prezentacyjnego layoutu preferuj CSS. `useDevice` służy zachowaniu zależnemu od rodzaju urządzenia/media query, a `useViewport` rzeczywistym pomiarom viewportu; nie używaj ich tylko do zastąpienia możliwej reguły CSS.
- Nie dodawaj `data-device`, `data-orientation`, `--vh` ani `provideVoteyDeviceDetection()` — to kontrakt Angulara, nie PWA.
- Hover stosuj tylko zgodnie z lokalnym wariantem pointer/device; nie zakładaj, że sam szeroki viewport oznacza urządzenie z precyzyjnym wskaźnikiem.

## React, Next.js i lokalne prymitywy

- Zachowaj Server Component jako domyślny. Dodaj `"use client"` tylko gdy komponent faktycznie potrzebuje hooków, stanu, eventów albo API przeglądarki.
- Teksty użytkownika prowadź przez `useTranslations` albo `getTranslations`; nie hardcoduj copy z Figmy.
- Przed nowym komponentem sprawdź lokalne Button, Text, Input, IconWrapper, IllustrationWrapper, Modal i inne prymitywy wskazane przez `project-primitives`.
- Nie obchodź API prymitywu kruchymi selektorami strukturalnymi. Jeśli potrzebujesz klas per slot, rozszerz wąski kontrakt prymitywu i zaktualizuj test.
- Nie zakładaj, że `tailwind-merge` rozpoznaje projektowe klasy `rv-*`; przy override rozmiaru zastąp cały bazowy zestaw klas albo użyj jawnego slotu.

## Ikony i ilustracje React

- W `votey-user-app` importuj asset przez istniejący alias `@votey/icons/...` lub `@votey/illustrations/...`; potwierdź dokładną nazwę pliku albo eksportu w zainstalowanej paczce.
- W innym konsumencie użyj jego potwierdzonego aliasu albo publicznej ścieżki `@pleodigital/design-system-votey/dist/assets/react/...`. Nie kopiuj aliasu `@votey/*`, jeśli nie istnieje w jego `tsconfig.json`.
- Ikony są generowane jako komponenty SVG używające `currentColor`; koloruj je semantyczną klasą tekstu albo świadomie przekazanym propsem, zgodnie z lokalnym `IconWrapper`.
- Ilustracje zachowują wielokolorowe fill’e i są dekoracyjne (`aria-hidden`). Nie zamieniaj wszystkich ich kolorów na `currentColor`.
- Reużyj lokalnego `IllustrationWrapper`, jeśli feature polega na stanach lub selektorach grup SVG, takich jak `#background`.
- Nie edytuj plików wygenerowanych w `node_modules` ani `dist`. Zmiana assetu należy do źródłowego SVG w `design-system-votey`, po czym trzeba przebudować paczkę.
- Nie wymyślaj assetu na podstawie nazwy warstwy Figmy. Jeśli odpowiednika nie ma w paczce, zgłoś gap albo dodaj go w Design Systemie w osobnym, jawnym zakresie.

## Stany i interakcje

- Porównaj wszystkie stany wymagane przez flow: initial, loading, empty, data, disabled, selected, hover, focus, error oraz oba theme’y, jeśli są w zakresie.
- Nie projektuj brakującego stanu na podstawie intuicji; odczytaj właściwy wariant Figmy albo zgłoś brak.
- Przy refaktorze zapisz przed zmianą, kiedy element jest aktywny/disabled, co emituje, jaki payload trafia dalej i czy interakcja wymaga Client Component.
- Nie rozszerzaj obszaru kliknięcia, nie zmieniaj elementu semantycznego i nie ukrywaj dostępnej nazwy assetu bez jawnej decyzji.

## Walidacja

Po implementacji:

1. Uruchom najwęższy lint i testy jednostkowe obejmujące zmienione pliki; przy zmianie zachowania albo publicznego API prymitywu zaktualizuj test.
2. Uruchom `npm run build`, jeśli zmiana dotyka granic Server/Client Components, globalnych styli, importów paczki, assetów albo konfiguracji Next.
3. Sprawdź target route i viewport, błędy konsoli, hydration errors, overflow oraz computed colors i spacing.
4. Dla zmiany theme sprawdź co najmniej light i dark. Dla zmiany responsive sprawdź każdy wskazany wariant oraz szerokość graniczną istotną dla lokalnego media query.
5. Dla zmiany assetu sprawdź rozmiar SVG, `currentColor`/fill, brak kolizji `id`/`clipPath` oraz accessible name albo `aria-hidden`.
6. Jeśli zmieniły się źródła `design-system-votey`, uruchom jego testy tokenów i właściwy build przed instalacją paczki w PWA.

Nie deklaruj pixel-perfect bez runtime screenshotu i potwierdzonych wartości krytycznych z Figmy.
