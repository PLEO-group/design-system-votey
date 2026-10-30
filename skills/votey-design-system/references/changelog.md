# Changelog

- 1.18.0 — Dodano `angular-table.md` i routing tylko dla pracy z `vt-table`
  w Angularze. Referencja zbiera wybór field/value i autoColumns, wspólny szablon
  @switch, kontrakt requestów i zaznaczania, pułapki oraz ścieżki do pełnego API i testów.

- 1.17.1 — Zaktualizowano snapshot manifestu do Votey `1.0.186` i prywatnego
  dostępu npm; opisano wymagany token `NPM_TOKEN` oraz weryfikację dostępu
  w instalacji konsumentów.

- 1.17.0 — Doprecyzowano obsługę akcji nieblokujących w `LocalLoadingState`:
  zapisy na tym samym kanale mogą działać równolegle, a stan kanału pozostaje aktywny
  do zakończenia ostatniej operacji. Przykład blokowania kontrolki używa `computed()`
  w komponencie zamiast wywoływać predykat bezpośrednio w szablonie.

- 1.16.0 — Ujednolicono obsługę loaderów requestów w CRM: usunięto `withApiLoader`,
  opt-in interceptor, API contextu i oczekiwanie bootstrapowego loadera na stare
  liczniki API. Referencja wskazuje `LocalLoadingState` z `app-loading-region` jako
  standard dla requestów HTTP; ręczne hosty `LoaderService`/`ngx-ui-loader` pozostają
  wyłącznie dla istniejących integracji kontrolek. Doprecyzowano zakres blokowania
  formularza przez `action()` i dodano `isActionPending(channel)` dla blokowania tylko
  kontrolek kolidujących z zapisem.

- 1.15.0 — Dodano migrację `vt-tabs` do `mat-tab-group`, deklaratywne szablony
  `vtTabContent`, izolację danych paneli i usunięcie autorskiej animacji treści tabów.
  Ustanowiono jedno źródło kolejności nawigacji, role stałych warstw i rozszerzono
  polską referencję przejść CRM, rozdzielając animacje routera od lokalnych tabów
  obsługiwanych przez Angular Material i usuwając nieaktualny kontrakt autorskich
  animacji tabów. Rozszerzono kontrakt loaderów CRM o
  `LocalLoadingState`, wrapper, obsługę błędów, retry, anulowanie i zakres blokowania.
  Doprecyzowano routing skilla tak, by odróżniał zmiany w konsumencie od zmian źródła
  paczki oraz zmian wspólnych dla Angular i React.

- 1.14.0 — Dodano kontrakt loaderów dla konsumentów Angular: zakres odpowiedzialności,
  nazewnictwo, stany loading/empty/error i zasady unikania nakładających się loaderów.

- 1.12.1 — Rozdzielono trzy typy urządzeń od sześciu szerokości referencyjnych
  i doprecyzowano jedyny wyjątek szerokościowy dla topbara Wyborek CRM (1023 px).
- 1.12.0 — Doprecyzowano semantykę wymaganych signal inputs dla nazw dostępnych
  kontrolek oraz obowiązek jawnego priorytetu i walidacji złożonych stanów UI.
- 1.11.0 — Przeniesiono historię zmian do osobnej referencji `references/changelog.md`.
- 1.10.0 — Dodano zasadę aktualizacji najbliższych testów przy zmianie kontraktu
  lub zachowania kodu, bez obowiązku uruchamiania testów przy każdym prompcie.
- 1.9.0 — Doprecyzowano hierarchię walidacji: tryb `light` ogranicza opcjonalną
  eksplorację, ale nie omija obowiązkowego minimum z `angular.md` po implementacji.
- 1.8.0 — Dodano tryb `light` i bramki decyzji użytkownika przed kosztownym
  baseline'em historycznym, szerokim skanem SCSS, buildem paczki, testami i runtime.
- 1.7.0 — Dodano referencję migracji istniejących konsumentów Angular/CRM:
  baseline historyczny, mapowanie legacy API, zachowanie formularzy, audyt wycieków
  SCSS oraz przepływ świeżości artefaktów `dist` → tarball → konsument.
- 1.6.0 — Dodano wspólny kontrakt komponentów formularzowych, bramkę zachowania
  overlayów oraz macierz obowiązkowych stanów i interakcji w Storybooku.
- 1.5.1 — Dodano preferowany kontrakt `VoteyFormControlApplyDirective` dla
  Angularowych kontrolek formularzowych oraz ograniczony wyjątek dla natywnego
  inputu pliku.
- 1.5.0 — Dodano referencję synchronizacji tokenów Figma Variables: źródło URL z
  manifestu, dwa eksporty JSON, walidację w pamięci bieżącego zadania oraz
  wdrożenie po poprawnym eksporcie; dodano obowiązkowy routing do `assets.md` dla
  źródłowych SVG i integracji opublikowanych assetów.
- 1.4.0 — Dodano kontraktowy router, snapshot manifestu i wspólne referencje dla
  tokenów, theme, SVG, responsywności, komponentów, preview i konsumentów Angular/React;
  doprecyzowano publiczny Sass entry point `ds-device-mixins` dla responsywności Angulara.
- 1.3.2 — Dodano preflight publicznych komponentów i lokalnych prymitywów przed implementacją UI.
- 1.3.1 — Udokumentowano publiczny context ilustracji `info` dla szczegółowych infografik.
- 1.3.0 — Dodano obowiązkową bramkę izolacji Angular ↔ React/PWA oraz walidację właściwych entry pointów i buildów.
- 1.2.0 — Dodano wybór sposobu użycia publicznych assetów w Angularze i React oraz obowiązkową bramkę lokalnego osadzania SVG.
- 1.1.0 — Dodano publiczny Angular SVG registry, provider bootstrapu i kontrakt migracji konsumentów z lokalnych rejestrów.
