# Decyzje migracyjne dla istniejących skilli design systemowych

## Reguła decyzji

Docelowo BoxEs i Votey mają po jednym głównym skillu projektowym z referencjami zgodnymi z `design-system-skill-contract.md`. Wiedza wspólna trafia do wersjonowanych kontraktów `pleo-design-system`; nazwy, ścieżki, API, komponenty, wzorce, komendy i wyjątki zostają w skillu konkretnego DS.

Nie usuwaj starszego skilla przed przeniesieniem jego treści, forward-testem nowego routingu i okresem kompatybilności. Wyspecjalizowany skill może na czas migracji stać się cienkim aliasem kierującym do dokładnej referencji głównego skilla DS.

## BoxEs

| Obecne źródło | Istotna wiedza | Decyzja docelowa |
| --- | --- | --- |
| `boxes-design-system/SKILL.md` | dobór komponentu po roli, Figma → komponent, zakaz lokalnych duplikatów, wrapper vs brakujący wariant, potwierdzanie publicznego API, semantyczna typografia, smoke test | Zachować. Rdzeń routingu zostaje w `SKILL.md`; reguły i ownership w `components.md`. |
| `boxes-design-system/references/component-catalog.md` | katalog discovery komponentów, dyrektyw i usług | Zachować jako sekcję lub dodatkową referencję katalogową ładowaną przez `components.md`. Katalog nie może udawać dokumentacji API. |
| `boxes-design-system/references/examples.md` | realne przykłady konsumpcji w CRM/PWA | Zachować w `consumers.md` lub jako opcjonalne `component-examples.md`; ścieżki muszą być okresowo walidowane. |
| `boxes-responsive-styling-guide` | device vs breakpoint, Figma handoff, main/nested/form grid, overlay evidence, style-vs-behavior, `BoxesDeviceService`, tokeny spacing/typography | Zachować w `responsiveness.md`; wspólną metodę przenieść do kontraktów `responsive-device` i `grid-layout`, a BoxEs paths/patterns/overlay do warstwy projektowej. Osobny skill po migracji staje się aliasem albo jest wycofywany. |
| `token-management` | źródła tokenów, warstwy, generowanie, `--spacing-*` vs `--space-*`, komplet typografii, add/edit, theme/device validation | Zachować w `tokens.md` i `theming.md`; osobny trigger nie jest docelowo potrzebny. Wartości i ścieżki BoxEs pozostają lokalne. |
| `component-docs-builder` | dedykowana aplikacja preview, cztery strony dokumentacji, routing/menu, API extraction i przykłady | Zachować w `preview.md` jako customowy wariant `application`, a zasady autorowania komponentu w `components.md`. Nie narzucać tego formatu innym DS. |
| `design-system-svg-assets` | onboarding i operacje na źródłowych SVG | Zachować w `svg-assets.md`; przed zamknięciem migracji wykonać pełny diff z oryginalnym skillem. W bieżącym audycie katalog był widoczny, ale jego zawartość była niedostępna dla odczytu, więc usunięcie lub zastąpienie tego skilla jest zablokowane do czasu weryfikacji. |

### Dodatkowe decyzje BoxEs

- Rozróżnienie `device` i breakpoint pozostaje charakterystycznym kontraktem BoxEs; nie wolno spłaszczyć go do media queries.
- Globalny standard używa `device()`; alias legacy `respond-to()` może być opisany tylko lokalnie.
- Customowe form patterns, `admin/user`, overlay i dokumentacyjna aplikacja preview nie stają się automatycznie standardem wszystkich DS.
- Katalog komponentów, lokalne przykłady i TODO dla brakującego wariantu są wiedzą projektową, nie globalną.

## Votey

| Obecne źródło | Istotna wiedza | Decyzja docelowa |
| --- | --- | --- |
| `votey-design-system/SKILL.md` | routing Angular/React/source, izolacja frameworków, handoff Figmy, publiczne API i walidacja | Zachować jako rdzeń nowego `SKILL.md`, skrócić szczegóły do referencji i dodać piny kontraktów. |
| `references/angular-components.md` | granice prymitywu, `vt-*`, tokenization gate, CVA/signals, a11y/stany, public API, Storybook i testy | Zachować w `components.md` oraz `angular.md`. To ważna partia, której nie obejmowały wcześniejsze cztery minimalne referencje. |
| `references/angular.md` | integracja CSS, registry/provider, device runtime, mixin vs service, semantyczne kolory CRM i build konsumenta | Zachować w `angular.md`, `responsiveness.md`, `theming.md` i odpowiedniej sekcji `consumers.md`. |
| `references/react.md` | granica paczka vs lokalne prymitywy PWA, Tailwind, light/dark, asset exports, Next i walidacja | Zachować w `react.md`, `components.md`, `theming.md` i `consumers.md`. Jawnie dokumentować, że brak komponentów React w paczce nie oznacza braku lokalnych prymitywów. |
| `references/assets.md` | wybór publicznego mechanizmu Angular/React, zakaz kopiowania i bramka lokalnego wyjątku | Zachować w `svg-assets.md` oraz frameworkowych referencjach. |
| `votey-svg-assets` i `icon-naming-system.md` | add/audit/rename/move/remove, breaking changes, contexts, nazwy Angular/React, bezpieczeństwo SVG, build i Storybook | Zachować w całości w `svg-assets.md`, ewentualnie z dodatkową katalogową referencją nazewnictwa. Osobny skill po migracji staje się aliasem kompatybilności albo jest wycofywany. |

### Dodatkowe decyzje Votey

- Twarda izolacja Angular ↔ React staje się kontraktem firmowym, ale konkretne katalogi, entry pointy i buildy pozostają projektowe.
- Bramka tokenizacji całego SCSS komponentu, a nie tylko diffu, zostaje zachowana w `components.md`.
- Storybook `Playground`, montowanie hosta `vt-*` i lokalne grupy assetów są szczegółami Votey w `preview.md`.
- Rozdział ownership: paczka publikuje fundamenty/assety/Angular runtime, a PWA utrzymuje lokalne prymitywy, grid i providery, musi być jawny w `design-system-contract.md` i `react.md`.

## Elementy wcześniej pomijane, teraz obowiązkowe

Porównanie ujawniło obszary, których nie zabezpieczał wcześniejszy minimalny zestaw `tokens/svg/responsiveness/theming`:

- katalog i authoring komponentów, publiczne API oraz reguła lokalnego wrappera;
- środowisko preview i sposób dokumentowania komponentu;
- dokładna instrukcja per konsument wraz z lokalnymi prymitywami;
- framework isolation i klasyfikacja `angular-only/react-only/shared`;
- tokenization gate dla źródłowych komponentów;
- Figma handoff → role komponentów → potwierdzone API;
- accessibility i stany na poziomie istniejących lokalnych zabezpieczeń;
- rename/remove/deprecation oraz instrukcje breaking-change;
- przykłady pattern discovery, które nie są publicznym API.

Dlatego `components.md`, `preview.md` i `consumers.md` są teraz obowiązkowe nawet wtedy, gdy zapisują `enabled: false` albo `not-applicable`.

## Kolejność migracji istniejącego skilla

1. Zbuduj mapę wszystkich plików starego skilla i oznacz każdy rozdział jako `central`, `project`, `alias` albo `retire`.
2. Utwórz komplet nowych referencji i wpisz piny kontraktów do manifestu.
3. Uruchom testy scenariuszy: Figma → widok, komponent źródłowy, token, SVG, responsive/grid, preview i upgrade konsumenta.
4. Porównaj odpowiedzi starego i nowego routingu; każda utracona reguła wymaga decyzji, nie automatycznego usunięcia.
5. Przekształć stare wyspecjalizowane skille w aliasy na co najmniej jeden cykl publikacyjny.
6. Wycofaj alias dopiero po potwierdzeniu braku aktywnych odwołań w repozytoriach i rejestrze skilli.
