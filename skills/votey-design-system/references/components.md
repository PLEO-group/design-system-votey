# Komponenty Votey

## Status i discovery

Komponenty są `enabled: true` dla Angulara; katalog źródeł to
`angular/src/lib`, selektory mają prefix `vt-`, a publiczne eksporty są wyłącznie
w `angular/src/public-api.ts`. Potwierdź selector, input/output, typ i wariant w
zbudowanej lub zainstalowanej paczce — katalog jest tylko discovery. React nie ma
publicznego katalogu komponentów UI: Button, Text, input, modal, toast i wrappery
assetów należą do lokalnych prymitywów PWA.

## Decyzja komponent / wrapper / gap

1. Najpierw sprawdź publiczny komponent i jeden najbliższy przykład konsumenta.
2. Lokalny wrapper jest poprawny wyłącznie dla kompozycji publicznego API i logiki
   domenowej; nie duplikuje HTML, stylów, SVG ani publicznego wariantu.
3. Gdy brak kontraktu, oznacz `gap`, opisz brakujący wariant i nie wymuszaj go
   selektorami prywatnej struktury lub lokalnym mini-DS.

## Authoring i weryfikacja

Angularowy komponent ma być reużywalny, tokenizowany, dostępny, testowalny i
wyeksportowany; szczegółowy kontrakt signals, CVA, a11y, stanów oraz pełna bramka
tokenizacji SCSS znajduje się w `angular-components.md`. Public API, wrapper,
token, preview i test są obowiązkowymi punktami decyzji.

Przy zmianie wariantu zachowaj compatibility inputów/outputów, zachowanie formularza
i payload. Sprawdź co najmniej stany właściwe dla komponentu (m.in. focus,
disabled, error, selected/checked lub loading), test zachowania oraz publiczny
import bez deep importu. Do dokumentacji i smoke testu użyj `preview.md`.
