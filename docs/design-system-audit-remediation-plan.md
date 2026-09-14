---
artifactSchemaVersion: 1
runId: votey-svg-base-path-remediation-20260910
sourceAudit: docs/audits/design-system-audit.md
status: in-progress
---

# Plan naprawczy: konfigurowalna ścieżka SVG checkboxa

## Cel

Naprawić finding `VDS-01`: checkmark `vt-checkbox` ma korzystać z tej samej
konfiguracji `assetBaseUrl`, co publiczny `VoteySvgRegistryService`, bez
zmiany neutralności root paczki ani kontraktu Reacta.

## Podejście rekomendowane

Rozszerzyć Angularowy kontrakt assetów, nie dodawać nowego inputu checkboxa.
`provideVoteySvgRegistry({ assetBaseUrl })` pozostaje jedyną konfiguracją po
stronie konsumenta.

## Postęp wdrożenia

- 2026-09-10 — ukończono etap paczki Angular: registry i `vt-checkbox` używają
  wspólnego helpera URL, a test kontraktowy obejmuje niestandardowy
  `assetBaseUrl` z końcowym ukośnikiem.
- Pozostaje smoke test konsumenta `wyborek-crm` z `baseHref` oraz ręczna kontrola
  stanów Checkbox w Storybooku.
- Bramka tokenizacji SCSS: istniejące `border-radius: 1px` dla mixedmarka nie
  ma równoważnego tokenu (najbliższy to `--radius-3`); pozostawiono je bez
  zmiany, aby nie rozszerzać naprawy ścieżki assetu o zmianę wyglądu.

1. Wydzielić w `votey-svg-registry.service.ts` publiczny lub wewnętrzny helper
   normalizujący base URL i budujący URL assetu. Registry oraz checkbox muszą
   korzystać z tej samej funkcji i domyślnej wartości `assets/votey`.
2. Wstrzyknąć istniejący `VOTEY_SVG_REGISTRY_CONFIG` do
   `VoteyCheckboxComponent` i wyprowadzić URL
   `icons/special/icon_sp_check.svg` z helpera.
3. Przekazać wynik do scoped CSS custom property na elemencie `mat-checkbox`,
   np. `--votey-checkbox-checkmark-url`. Arkusz checkboxa powinien używać
   `mask` i `-webkit-mask` z tą właściwością zamiast literalu
   `/assets/votey/...`.
4. Zachować ograniczenie styli do hosta `vt-checkbox` i istniejące override’y
   Angular Material; nie rozszerzać `ViewEncapsulation.None` poza adapter
   Materiala.

## Kryteria akceptacji

- Przy domyślnej konfiguracji checkbox ładuje
  `assets/votey/icons/special/icon_sp_check.svg` jako ścieżkę względną, bez
  początkowego `/`.
- Przy `provideVoteySvgRegistry({ assetBaseUrl: 'portal/assets/votey' })`
  registry SVG i checkmark checkboxa używają tej samej bazy.
- Kod checkboxa nie zawiera literalnego `/assets/votey/`.
- Root paczki nadal nie eksportuje Angulara ani nie deklaruje
  `@angular/cdk`; zmiana pozostaje pod `./angular`.
- Istniejące stany checkboxa (checked, indeterminate, disabled, error) oraz
  dostępność nie zmieniają zachowania.

## Testy i weryfikacja

1. Dodać test jednostkowy helpera URL dla domyślnej i niestandardowej bazy,
   w tym usuwania końcowego ukośnika.
2. Dodać test komponentu lub test kontraktowy szablonu potwierdzający, że
   checkbox przekazuje URL przez CSS custom property.
3. Uruchomić `npm run validate:manifest`, `npm run check:asset-types` oraz
   testy obejmujące checkbox i registry.
4. W `wyborek-crm` wykonać smoke test aplikacji pod prefiksem (`baseHref`) i
   potwierdzić w Network brak 404 dla checkmarka.
5. Uruchomić build Angulara oraz Storybook; w historii Checkbox sprawdzić
   stany default, checked, indeterminate, disabled i error.

## Ryzyka i rollback

- CSS custom property musi zawierać kompletną funkcję `url(...)`; nie należy
  składać `var(...)` wewnątrz `url()`, bo jest to mniej przenośne między
  przeglądarkami.
- Wartość `assetBaseUrl` pochodzi z konfiguracji aplikacji, dlatego helper
  powinien normalizować wyłącznie ścieżkę i nie budować URL-i z danych
  użytkownika.
- Rollback jest prosty: cofnięcie zmian helpera, szablonu i SCSS bez zmiany
  publicznego API poza już istniejącym `assetBaseUrl`.
