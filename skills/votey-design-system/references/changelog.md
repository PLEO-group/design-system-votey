# Changelog

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
