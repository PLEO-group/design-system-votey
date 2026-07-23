# Angular Votey / CRM Implementation From Figma

Wczytuj ten plik po `references/mcp-guard.md`, gdy Figma ma prowadzić do zmian w `design-system-votey`, `wyborek-crm` albo konsumencie `@pleodigital/design-system-votey`.
Nie stosuj tej referencji do `angular-design-system`/Boxes ani do Reactowego `votey-user-app`.

## Obowiązujące instrukcje projektu

1. Odczytaj `AGENTS.md` repo przed zmianą kodu.
2. W `wyborek-crm` przed edycją `.ts`, `.html` albo `.scss` wczytaj lokalny `skills/angular-code-standards/SKILL.md`. Ten reference go uzupełnia, ale nie zastępuje.
3. W `design-system-votey` nie edytuj ręcznie `dist`; zmieniaj źródła i uruchamiaj właściwy build.

## Pipeline

1. Odczytaj dokładny node wskazany przez użytkownika; nie rozszerzaj zakresu bez potrzeby.
2. Zbierz potwierdzone rozmiary, paddingi, gapy, typografię, kolory, border, radius, auto-layout, hierarchię oraz stany.
3. Rozdziel dane z Figmy od decyzji implementacyjnych: wartość z makiety nie jest automatycznie nazwą tokenu ani breakpointem kodu.
4. Zmapuj wartości na publiczny kontrakt Votey/CRM opisany poniżej.
5. Przed edycją wypisz kontrakt layoutu i interakcji: rodziców, dzieci, display model, overflow, stany, triggery oraz payload.
6. Po zmianie wykonaj build i walidację runtime na wskazanym viewportcie.

## Rzeczywisty zakres Design Systemu Votey

- Design System publikuje tokeny, assety SVG oraz Angular responsive runtime.
- Nie zakładaj, że publikuje gotowy komponent radio, input, button, tooltip, table albo modal. Najpierw sprawdź publiczne API paczki i kod CRM.
- Nie importuj komponentów ani tokenów z Boxes.
- Angular runtime importuj wyłącznie z `@pleodigital/design-system-votey/angular`.
- CSS tokenów CRM pochodzi z `@pleodigital/design-system-votey/dist/css/tokens.angular.css` i jest dołączany przez konfigurację buildu aplikacji.

## Kolory

- Wspólną warstwą PWA i CRM są wyłącznie nieprzezroczyste core color tokens.
- Nowe widoki i redesigny CRM mapuj przede wszystkim na semantic colors CRM z `tokens/color/semantic-CRM`.
- Nie używaj semantic colors PWA w CRM.
- Nie dodawaj surowych HEX, `rgb()` ani lokalnych `--app-color-*`.
- Core color w kodzie produktu stosuj tylko jako świadomy wyjątek albo etap zaakceptowanej migracji.
- Jeśli nie istnieje właściwa rola semantic, zgłoś brak tokenu. Nie zgaduj nazwy i nie pożyczaj podobnej roli PWA.
- Shadow i overlay mają być semantic colors z alpha złożoną w tokenie; core pozostaje opaque.

## Spacing, radius i typografia CRM

- Spacing, radius i typografię mapuj na publiczne `--space-*`, `--radius-*` i `--typo-*`, jeśli istnieje właściwa rola.
- Nie kopiuj wartości ani nazw tokenów z `angular-design-system`; jego mechanika jest wzorcem, ale dane należą do Votey.
- Fontem produktu CRM jest Open Sans. Role `--typo-*` wskazują na `--font-family-open-sans`.
- Satoshi jest fontem PWA i interfejsu Storybooka, nie typografią CRM.
- Nie twórz lokalnego odpowiednika tokenu tylko po to, aby odwzorować jedną makietę. Brakującą rolę zapisz jako gap kontraktu.

## Responsive scaling

- Votey używa sześciu szerokości referencyjnych: `360`, `375`, `768`, `1024`, `1280`, `1920`.
- Wartości pomiędzy punktami są interpolowane przez wygenerowane `calc(...)`; nie zastępuj ich ręcznymi media queries w komponencie.
- Kontekst urządzenia jest niezależny od szerokości viewportu i pochodzi z `body[data-device="mobile|tablet|desktop"]`.
- W CRM zarejestruj `provideVoteyDeviceDetection()` przed użyciem responsive tokenów. Nie ustawiaj `data-device`, `data-orientation` ani `--vh` równolegle w kodzie feature.
- Nie kopiuj wygenerowanych reguł z `dist/css/tokens.angular.css` do SCSS komponentu.
- Gdy Figma podaje wartości dla kilku szerokości, porównaj wszystkie wskazane tryby i sprawdź wynik również pomiędzy breakpointami.

## Angular i SCSS

- Zachowuj projektowe standardy sygnałów, control flow, typed forms i mapowania danych z lokalnego skilla CRM.
- SCSS zagnieżdżaj zgodnie ze strukturą HTML; najpierw odwzoruj flex/grid/auto-layout/fixed/fill/hug.
- Nie wywołuj metod bezpośrednio z template i nie przenoś mapowania danych do HTML.
- Nie zmieniaj requestów, payloadów ani reguł legacy, jeśli zadanie dotyczy wyłącznie prezentacji.
- Hover owijaj w `@media (pointer: fine)`.
- Nie twórz globalnego override'u dla dopasowania jednego widoku.
- Nie zakładaj istnienia dyrektywy albo komponentu typograficznego, dopóki nie ma go w publicznym API zainstalowanej wersji paczki.

## Stany i interakcje

- Porównaj wszystkie stany wymagane przez flow: initial, loading, empty, data, disabled, selected, hover, focus i error.
- Nie projektuj brakującego stanu na podstawie intuicji; odczytaj właściwy wariant Figmy albo zgłoś brak.
- Przy refaktorze zapisz przed zmianą, kiedy element jest aktywny/disabled, co emituje i jaki payload trafia dalej.
- Nie rozszerzaj obszaru kliknięcia ani nie zmieniaj triggera bez jawnej decyzji.

## Walidacja

Po implementacji:

1. Uruchom odpowiedni build Design Systemu, jeśli zmieniły się jego źródła.
2. W `wyborek-crm` uruchom co najmniej `npm run build:dev`; dla zmian kontraktu paczki również production build.
3. Sprawdź screenshot target route i target viewport, błędy konsoli, overflow oraz computed values użytych tokenów.
4. Sprawdź co najmniej jeden viewport referencyjny i jedną szerokość pomiędzy breakpointami dla zmian responsive.
5. Potwierdź działanie stanów i brak niezamierzonych globalnych override'ów.

Nie deklaruj pixel-perfect bez runtime screenshotu i potwierdzonych wartości krytycznych z Figmy.
