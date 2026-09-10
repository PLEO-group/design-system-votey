# Components

- Enabled in package: `<true/false>`
- Source roots: `<paths or not-applicable>`
- Selector/name prefixes: `<values or not-applicable>`
- Public API/barrels: `<paths or not-applicable>`
- Catalog discovery: `<generated catalog/path/search command>`
- Missing variant marker/process: `<rule>`

## Consumer selection

Mapuj rolę UI z handoffu na istniejący komponent albo lokalny prymityw. Katalog jest
narzędziem discovery; selector, input/output, directive i wariant potwierdź w
zainstalowanej wersji paczki. Opisz dozwolony wrapper oraz zabronione lokalne duplikaty.

## Source component workflow

Opisz granicę komponentu, warianty, tokenization gate całego SCSS, istotne stany,
dostępność, framework API, publiczny eksport, testy i preview. Jeśli komponenty są
wyłączone, wpisz ownership lokalnych prymitywów i `not-applicable` dla authoringu.

## Validation

- `<component tests>`
- `<public API/build>`
- `<preview/story>`
- `<consumer smoke test>`
