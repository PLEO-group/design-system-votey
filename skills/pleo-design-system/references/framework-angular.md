# Kontrakt Angular

- Publikuj Angular wyłącznie przez `/angular`.
- Nie eksportuj Angular DI, Material, komponentów ani typów przez entry point React/root przeznaczony dla Reacta.
- Generuj CSS custom properties zgodnie z frameworkową polityką manifestu.
- Preferuj `var(--token)` w kodzie konsumenta; SCSS traktuj jako artefakt pipeline'u i zaawansowaną integrację.
- Jeśli manifest wybiera `responsive.mode: device-contract`, użyj `assets/responsive/system-responsiveness.scss`: kanoniczny `device()` działa po `data-device` ustawianym przez runtime detector/provider.
- Jeśli manifest wybiera `responsive.mode: css-media`, użyj `assets/responsive/breakpoint-responsiveness.scss`: `breakpoint()` działa przez media queries i nie wymaga runtime detectora.
- Nie publikuj ani nie używaj `device()` i `breakpoint()` w jednym design systemie. Wybrany `responsive.mode` jest wyłączny, a drugi asset pomiń.
- W `css-media` wyprowadzaj media queries z jednego kanonicznego źródła breakpointów. `device-contract` nie klasyfikuje urządzenia na podstawie szerokości, ale może używać breakpointów referencyjnych do skalowania tokenów i opcjonalnego gridu.
- Runtime detector klasyfikuje rodzaj urządzenia na podstawie informacji o urządzeniu/user agenta, a nie szerokości viewportu. Zmiana rozmiaru okna może aktualizować orientację i jednostkę wysokości, ale nie może przeklasyfikować desktopu na urządzenie mobilne.
- Dla wariantu z `assets/angular/device-detector.example.ts` dodaj `node-device-detector` do zależności paczki i testy klasyfikacji smartphone/phablet/feature phone, tablet, dotykowy Macintosh oraz desktop. Zapewnij bezpieczne zachowanie SSR.
- Gdy `responsive.grid.enabled: true`, przeczytaj `angular-grid-and-theming.md`, wygeneruj grid tokens i responsive SCSS config przez Style Dictionary, dodaj angularowy provider wariantu i wybierz wyłącznie adapter device albo breakpoint zgodny z `responsive.mode`.
- Dla light/dark runtime użyj `ThemeService` i kontraktu z `assets/angular/theming/`: `body[data-theme]`, `sessionStorage["theme"]`, początkowy light i jawne `loadTheme()`. Nie dodawaj providera ani nie duplikuj semantic values w ręcznym SCSS.
- Dla ikon i ilustracji publikuj typowane nazwy, standalone icon component/provider registry i kontrakt kopiowania raw SVG.
- Importuj wpisy registry wyłącznie z generowanego pliku wskazanego przez `assets.generatedTypesPath`; provider nie może przyjmować ręcznie utrzymywanej listy pojedynczych SVG.
- Używaj selectorów z prefiksem zadeklarowanym w manifeście.
- Waliduj publiczne entry pointy, brak przecieku Reacta, peer dependencies, build biblioteki i integrację przykładowego konsumenta.

Instrukcja konsumenta musi wskazać dokładnie: instalację, importy, arkusz tokenów, assets copy rule, providery, theme, build/test oraz przykład użycia.

