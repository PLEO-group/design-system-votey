# Selektory hosta, geometria kontenera i stuba pipe’a

## Style i geometria

- Dla warunkowej klasy hosta zapisz samodzielny selektor `:host(.klasa)`. Mixin urządzenia umieść przy selektorze elementu, którego dotyczy korekta. Samodzielny selektor hosta nie wymaga `@at-root`.
- Gdy host komponentu Design Systemu używa `display: contents`, ustal element DOM, który faktycznie tworzy pudełko. Umieść pozycjonowanie na posiadanym przez aplikację kontenerze, który tworzy właściwy kontekst układu.

## Testy komponentu

- Gdy izolowany test wymaga stuba pipe’a, zadeklaruj na klasie `implements PipeTransform`, aby zachować jawny kontrakt `transform`.
