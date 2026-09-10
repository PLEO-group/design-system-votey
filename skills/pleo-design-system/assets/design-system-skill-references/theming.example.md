# Theming

- Semantic light source: `<path>`
- Semantic dark source: `<path>`
- Generated Angular CSS/SCSS outputs: `<paths and public imports>`
- ThemeService: `<path and public import>`
- Theme contract SCSS: `<path and import>`
- Initial host: `<consumer index.html path with body data-theme="light">`
- Session storage: `sessionStorage["theme"]`
- Initialization: `<consumer startup path calling loadTheme()>`
- View Transitions: `<supported and tested>`

## Project rules

Podczas tworzenia tej referencji zastosuj przypięty kontrakt `semantic-theming`. Gotowy plik ma samodzielnie podawać konkretne ścieżki, publiczne importy, miejsca inicjalizacji w konsumentach, kolejność rutynowej zmiany i zatwierdzone odstępstwa; codzienny task nie może wymagać uruchomienia `pleo-design-system`.

## Validation

- Token parity command: `<command>`
- Build/test commands: `<commands>`
- Preview route/story: `<location>`
- Consumer checks: initial light, saved dark/light, no saved value, View Transitions and fallback
