# Tokeny Votey

## Źródło i parity z Figmą

Projekt Figma oraz Figma Variables: https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1613-221&t=ViF6g6Dlpkr5k5mY-0

Ten sam rozwiązany URL jest zapisany w `references/design-system-manifest.json`
polach `designSource.projectUrl` oraz `tokens.sourceOfTruth.url`. Na żądanie
porównaj z Figmą 1:1: collections, modes, typy, scopes, rekurencyjnie rozwiązane
aliasy, wartości i mapowanie nazw. Raportuj osobno tokeny brakujące, nadmiarowe i
różne (mismatch); screenshot nie jest dowodem wartości tokenu.

Przy pełnej synchronizacji lub audycie względem eksportu Figma Variables stosuj
[figma-token-sync.md](figma-token-sync.md). Procedura rozszerza rutynową zmianę
pojedynczego tokenu o dwa eksporty JSON, walidację aliasów i mapowania tożsamości
oraz zgodę na wdrożenie w zakresie tokenów.

## Źródła, generator i outputy

- Core: `tokens/base/`, m.in. `tokens/base/colors.json`; semantic CRM light/dark:
  `tokens/color/semantic-CRM/Light.json` i `Dark.json`.
- Spacing, typografia i radius: `tokens/space/semantic`, `tokens/type/` i
  `tokens/radius/`; grid Angulara: `tokens/grid/angular.json`.
- Generator: Style Dictionary przez `build-style-dictionary.mjs`.
- Weryfikacja i generowanie: `npm run validate:tokens`, `npm run test:tokens`,
  `npm run build:tokens`. Nie edytuj ręcznie `dist/css/*` ani `dist/scss/*`.

Polityka manifestu dla `color`, `spacing`, `typography` i `radius` to
`generate`, `autocomplete` i `allowedUsage` dla core oraz semantic; `opacity`
jest core-only. Angular publikuje SCSS i CSS variables, React SCSS i Tailwind.
Nowy kod preferuje właściwą rolę semantic; core pozostaje tylko tam, gdzie jest
świadomym, istniejącym kontraktem.

## Zmiana tokenu

Jeżeli zmiana wynika z pełnego eksportu Variables albo obejmuje wiele tokenów,
ten skrócony flow zastępuje procedura [figma-token-sync.md](figma-token-sync.md).

1. Potwierdź collection, mode, scope, alias i wartość w Figma Variables.
2. Znajdź użycia w paczce i konsumentach; określ Angular-only, React-only lub
   shared oraz wpływ light/dark i responsive.
3. Dodaj, edytuj, zmień nazwę lub usuń źródłowy token. Przy rename/remove przygotuj
   deprecację i plan migracji, nie alias ad hoc w konsumencie.
4. Zbuduj tokeny, sprawdź outputy frameworków i nie zostawiaj ręcznej poprawki
   wygenerowanego pliku.
5. W SCSS/JSX/HTML nie zastępuj brakującej roli raw HEX/RGB ani lokalnym tokenem.
   Zgłoś `gap` albo zaproponuj zmianę w paczce.

Źródłowy komponent Angular musi dodatkowo przejść pełną bramkę tokenizacji z
`angular-components.md`; PWA stosuje wyłącznie własne, potwierdzone utilities i
role opisane w `react.md`.
