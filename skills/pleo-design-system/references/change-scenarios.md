# Scenariusze zmian tokenów i responsywności

Ta referencja definiuje firmowy przebieg zmian. Nie jest dodatkową bramką uruchomienia `pleo-design-system`: zwykłą zmianę obsługuje skill konkretnego DS. Wczytaj tę referencję po jawnym uruchomieniu globalnego skilla albo po bezpośrednim routingu z tego skilla projektowego.

## Preflight każdej zmiany

1. Odczytaj `design-system.manifest.json`, skill konkretnego DS oraz jego `references/tokens.md` i `references/responsiveness.md`.
2. Ustal źródło prawdy, operację `edit/add/remove/rename`, dotknięte frameworki, outputy i konsumentów. Nie pytaj o konfigurację widoczną w manifeście lub repo.
3. Sprawdź warunki zastosowania: `responsive.mode`, `responsive.scaling.enabled` i `responsive.grid.enabled`. Nie twórz konfiguracji opcjonalnego systemu tylko dlatego, że istnieje scenariusz jego obsługi.
4. Przy usunięciu lub rename przeszukaj paczkę, publiczne API, preview i wszystkie znane consumer roots. Najpierw usuń lub zmigruj użycia; rename traktuj jako remove + add.
5. Nie edytuj plików generowanych. Po zmianie uruchom generatory z manifestu, guardraile, build, testy i preview.
6. Jeśli aktywny jest wykonawczy proces `pleo-design-system`, zapisz zakres i wyniki w `.tmp/design-system-implementation.md` oraz uzyskaj wymaganą akceptację etapu. W trybie audytu tylko opisz zastany mechanizm i rozbieżność w odpowiednim raporcie. Rutynowy task prowadzony wyłącznie przez skill konkretnego DS nie uruchamia automatycznie globalnego planu.

## Edycja mnożników urządzeń

Stosuj tylko dla `responsive.mode: device-contract` i `responsive.scaling.enabled: true`. Dla `css-media` mnożniki muszą pozostać pustym obiektem; nie twórz ich w celu zmiany zachowania breakpointu.

1. Potwierdź, że device type istnieje w `responsive.deviceTypes` i ma wpis w `responsive.deviceBreakpointMap`.
2. Edytuj wyłącznie `responsive.scaling.deviceMultipliers.<device>` w manifeście.
3. Nie zmieniaj breakpoint JSON, grid JSON ani `_responsive-config.generated.scss`.
4. Uruchom `commands.buildTokens`, `validate-design-system.mjs` i `verify-responsive-config.mjs`.
5. Zweryfikuj responsive typography/spacing dla zmienionego urządzenia oraz przejścia do sąsiednich urządzeń. Grid testuj tylko, gdy `responsive.grid.enabled: true`.
6. Zaktualizuj projektowe `references/responsiveness.md`, snapshot manifestu w skillu DS i ocenę SemVer.

## Edycja, dodanie, usunięcie lub rename breakpointu

Wartość liczbowa breakpointu jest core tokenem w pliku `responsive.breakpoints.tokenFile`. Nazwa i kolejność są kontraktem manifestu w `responsive.breakpoints.names`.

### Edycja szerokości

1. Edytuj wartość wyłącznie w breakpoint token JSON.
2. Zachowaj ściśle rosnącą kolejność szerokości zgodną z `responsive.breakpoints.names`.
3. Nie zmieniaj manifestu, jeśli nazwa i kolejność pozostają bez zmian.
4. Sprawdź wszystkie media queries, interpolację responsive tokenów oraz – tylko gdy grid jest włączony – konfiguracje gridu korzystające z tego breakpointu.

### Dodanie

1. Dodaj token liczbowy do breakpoint JSON.
2. Dodaj nazwę w odpowiednim miejscu `responsive.breakpoints.names`.
3. Dla `device-contract` zdecyduj, czy breakpoint jest referencyjny dla któregoś device type; jeśli tak, zaktualizuj top-level `responsive.deviceBreakpointMap`. Jeśli responsive token nie ma w tym punkcie jawnej wartości, dodaj poprawny fallback.
4. Dla `css-media` pozostaw `deviceTypes`, `deviceBreakpointMap`, mnożniki i fallbacki urządzeń puste.
5. Jeśli grid jest włączony, dodaj grid tokens tylko wtedy, gdy dany wariant ma zmieniać konfigurację w tym punkcie. Nie twórz grid JSON, gdy `grid.enabled: false`.
6. Uzupełnij odpowiednie wartości tokenów responsive w ich kanonicznym źródle, jeśli nowy punkt ma być jawny.

### Usunięcie lub rename

1. Znajdź użycia nazwy w mixinach, tokenach responsive, fallbackach, `responsive.deviceBreakpointMap`, grid tokens, preview i konsumentach.
2. Usuń lub zmigruj użycia. Nie usuwaj breakpointu wskazywanego przez mapowanie lub fallback.
3. Usuń nazwę z manifestu i powiązane wpisy z konfiguracji opcjonalnych systemów.
4. Usuń wartość z breakpoint JSON jako ostatni krok źródłowy.
5. Rename wykonaj jako kontrolowane dodanie nowej nazwy, migrację użyć i dopiero usunięcie starej.

Po każdej operacji uruchom `commands.buildTokens`, walidator manifestu, `verify-responsive-config.mjs`, build/test/preview i smoke test każdego konsumenta. Generator ma blokować brak tokenu zadeklarowanego w manifeście oraz osierocony breakpoint lub wariant pozostawiony w JSON-ie po usunięciu go z manifestu. Dodanie publicznego breakpointu zwykle oznacza MINOR, a rename/usunięcie publicznego breakpointu MAJOR; edycję szerokości sklasyfikuj według rzeczywistej kompatybilności zachowania.

## Edycja, dodanie lub usunięcie tokenu zarządzanego w Figmie

Stosuj dla kategorii, których źródłem prawdy są Figma Variables. Nie stosuj do grid tokens, jeśli manifest wskazuje lokalny `responsive.grid.tokenFile`.

1. Odczytaj Figma Variables przez dostępny skill Figma i porównaj collection, modes, aliases, scopes oraz nazwę z kontraktem.
2. Jeśli żądana zmiana już istnieje w Figmie, wygeneruj/wyeksportuj źródłowy JSON ustalonym pipeline'em. Jeśli nie istnieje, nie poprawiaj ręcznie JSON-u: zmień Figmę tylko po jawnym upoważnieniu do tej zewnętrznej mutacji albo poproś właściciela Figmy o zmianę.
3. Dla semantic tokenu zachowaj alias do core. Dla tokenu zależnego od theme zapewnij tę samą ścieżkę w light i dark. Theme-independent semantic token umieść w kanonicznym common source.
4. Przy dodaniu nowej kategorii lub warstwy zaktualizuj manifestowe `generate`, `autocomplete` i `allowedUsage` osobno dla Angulara i Reacta. Nie poszerzaj dostępności automatycznie przy dodaniu pojedynczego tokenu.
5. Przy usunięciu przeskanuj wszystkie outputy i konsumentów. Usuń semantic token ze wszystkich modes; core usuń dopiero, gdy nie jest aliasowany ani używany. Preferuj deprecację przed usunięciem publicznego tokenu.
6. Uruchom import/export Figmy, Style Dictionary, kontrolę zgodności light/dark, build/test/preview i integracje konsumentów.

Nie implementuj nowej wartości na podstawie screenshotu ani nie poprawiaj generowanych SCSS/CSS/Tailwind ręcznie. Dodanie publicznego tokenu zwykle oznacza MINOR, rename/usunięcie MAJOR, a korekta wartości PATCH, o ile nie łamie uzgodnionego kontraktu wizualnego.

## Edycja, dodanie lub usunięcie grid tokenu spoza Figmy

Stosuj wyłącznie, gdy `responsive.grid.enabled: true`. Kanonicznym źródłem jest JSON wskazany przez `responsive.grid.tokenFile`; brak gridu w Figma Variables nie jest odstępstwem.

1. Potwierdź wariant i breakpoint, którego dotyczy zmiana.
2. Edytuj `columns`, `gutter`, `margin` lub `margin-extra` wyłącznie w grid token JSON. Zachowaj liczby w pikselach referencyjnej ramki bez jednostki.
3. Przy dodaniu wariantu zaktualizuj `grid.variants` i `grid.defaultVariant`, jeśli potrzebne, oraz zapewnij komplet wymaganych pól dla używanych breakpointów.
4. Przy usunięciu wartości lub wariantu sprawdź provider, `data-grid-type`, adapter, overlay, preview i wszystkich konsumentów. Nie zostawiaj manifestu wskazującego usunięty wariant.
5. Uruchom `commands.buildTokens`, `verify-responsive-config.mjs`, test adaptera wybranego przez `responsive.mode` i walidację overlayem.

Jeśli `responsive.grid.enabled: false`, zakończ ten wariant jako `not-applicable`: nie twórz grid token file, providera, adaptera ani overlayu.

## Minimalny zapis wyniku

Zapisz źródło prawdy, operację, zmienione ścieżki, dotknięte publiczne nazwy, wyniki wyszukania użyć, wygenerowane outputy, walidacje konsumentów i proponowany SemVer. W skillu konkretnego DS zaktualizuj jego charakterystyczne ścieżki/komendy oraz snapshot manifestu, jeśli kontrakt lub wersja się zmieniły.
