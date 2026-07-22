# design-system-votey
Repository for handling tokens (Votey app)

## Walidacja tokenów

```bash
npm run validate:tokens
npm run test:tokens
```

`validate:tokens` sprawdza `tokens/base/colors.json` przed uruchomieniem Style Dictionary. Core colors muszą być nieprzezroczyste; validator odrzuca alpha HEX, `rgba()`/`hsla()`, `transparent`, `color-mix(... transparent)` oraz obiektowe kolory z alpha mniejszym niż `1`.

Build tokenów wymaga Node.js 22 lub nowszego. Pipeline używa Style Dictionary `5.5.0` oraz `@tokens-studio/sd-transforms` `2.0.3`:

```bash
npm run build:tokens
```

`npm run build:tokens` uruchamia walidację automatycznie przed zapisem plików do `dist`. Te same testy działają w CI dla zmian tokenów, skryptów walidacyjnych oraz merge requestów tworzonych przez workflow Tokens Studio.
