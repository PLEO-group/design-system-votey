# Kontrakt React

- Publikuj React wyłącznie przez `/react`.
- Nie eksportuj Angular runtime ani zależności przez entry point Reacta.
- Generuj Tailwind preset/integration zgodnie z manifestem.
- Stosuj frameworkową politykę `generate`, `autocomplete` i `allowedUsage`; nie zakładaj, że jest identyczna z Angularową.
- Dla kolorów preferuj semantic-only utilities, jeśli manifest nie stanowi inaczej.
- Publikuj komponenty SVG/React z typowanymi nazwami i zachowaniem kolorów zgodnym z kategorią assetu. Generuj komponenty przez SVGR oraz barrel z tego samego inwentarza nazw plików co typy i Angular Registry; nie dopisuj eksportów ręcznie.
- Waliduj tree-shaking, exports, peer dependencies, build Storybooka i integrację przykładowego konsumenta.

Instrukcja konsumenta musi wskazać dokładnie: instalację, import presetów/styles, theme, assety, build/test i przykład użycia.

