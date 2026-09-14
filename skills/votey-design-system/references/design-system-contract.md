# Kontrakt Votey Design System

## Tożsamość i granica

- Pakiet: `@pleodigital/design-system-votey`, wersja zweryfikowana `1.0.153`,
  publiczny registry npm.
- Topologia: niezależne repozytorium, package root `.`; paczka nie importuje kodu
  konsumentów i blokuje lokalny mini-DS poza zadeklarowanym rootem.
- Publiczne entry pointy: `@pleodigital/design-system-votey/angular`,
  `@pleodigital/design-system-votey/ds-device-mixins` oraz output React pod
  `@pleodigital/design-system-votey/dist/assets/react` (w PWA zwykle przez alias
  `@votey/*`). Root paczki nie eksportuje runtime'u Angulara.
- Źródło skilla: `skills/votey-design-system`; publikacja `SHARED` nie zastępuje
  tej wersjonowanej ścieżki. Snapshot manifestu jest w
  `references/design-system-manifest.json`.

## Piny kontraktów firmowych

- `repository-boundary@1.0.0`
- `foundation-tokens@1.0.0`
- `semantic-theming@1.0.0`
- `svg-assets-source-driven@1.0.0`
- `responsive-device@1.0.0`
- `grid-layout@1.0.0`
- `component-authoring@1.0.0`
- `preview-documentation@1.0.0`
- `consumer-integration@1.0.0`
- `framework-isolation@1.0.0`

Piny muszą pozostać identyczne z `designSystemSkill.companyStandardContracts` w
snapshotcie. Kontrakt `block-on-stale` wymaga aktualizacji albo zatwierdzonego
wyjątku; `review-on-stale` wymaga zaplanowanej migracji przed zmianą znaczenia
skilla.

## Ownership

| Właściciel | Zakres |
| --- | --- |
| Figma Variables | Źródłowe wartości tokenów, collections, modes i aliasy |
| Paczka Votey | Tokeny, źródłowe SVG, generatory, Angular runtime/komponenty, publiczne eksporty i Storybook |
| Konsument Angular | Domena, lokalny layout, bootstrap providerów, kopiowanie SVG, theme runtime i smoke test |
| Konsument React/Next | Lokalne prymitywy, grid i `rv-*`, provider viewportu/theme, aliasy i smoke test |

`dist/**` i `angular/src/lib/votey-assets.ts` są artefaktami build-only. Nie edytuj
ich ręcznie. Zmiana package exports, peer dependencies, generatorów, nazw assetów
lub kontraktu Angular/React jest zmianą publiczną: oceń SemVer, consumer impact i
rollback przed publikacją.

## Wyjątki i migracja

Manifest nie zawiera zatwierdzonych wyjątków. Nie wpisuj odstępstwa do skilla jako
nowej normy; zapisz je w artefakcie właściwego procesu. Przy breaking change użyj
`.tmp/design-system-consumer-migration.md` konsumenta po zbudowaniu release
candidate i przed publikacją finalnego pakietu.
