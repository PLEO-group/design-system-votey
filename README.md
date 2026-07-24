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

## Font families

Foundation font families są zdefiniowane w `tokens/type/core/value.json`:

- `font-family.open-sans` — font produktu CRM;
- `font-family.satoshi` — font produktu PWA oraz interfejsu Storybooka.

Build Angular publikuje je jako `--font-family-open-sans` i `--font-family-satoshi`. Responsywne role `--typo-*` CRM wskazują na `--font-family-open-sans`. Storybook używa `--font-family-satoshi` globalnie. Istniejąca zmienna `--font-satoshi` w `votey-user-app` pozostaje bez zmian.

## Runtime Angulara

Kod Angulara jest publikowany przez osobne wejście, dzięki czemu nie trafia do aplikacji Reactowej:

```ts
import { provideVoteyDeviceDetection } from "@pleodigital/design-system-votey/angular";

export const appConfig: ApplicationConfig = {
  providers: [provideVoteyDeviceDetection()],
};
```

Provider inicjalizuje `VoteyDeviceService`, reaguje na zmianę rozmiaru okna i ustawia na `body` atrybuty `data-device` oraz `data-orientation`. Ustawia również zmienną `--vh`. Atrybut `data-device` aktywuje reguły responsive z `dist/css/tokens.angular.css`.

Mixiny Sass mają taki sam kontrakt jak w `angular-design-system`:

```scss
@use "@pleodigital/design-system-votey/ds-device-mixins" as device-mixins;

.example {
  @include device-mixins.device("mobile") {
    display: block;
  }

  @include device-mixins.orientation("vertical") {
    flex-direction: column;
  }
}
```

Dostępne są `device`, `orientation` i `theme`.

Build wejścia Angulara:

```bash
npm run build:angular
```
