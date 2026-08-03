# design-system-votey

Repository for handling tokens (Votey app)

## Pełny build paczki

Cały Design System można zbudować jedną komendą:

```bash
npm run build
```

Komenda najpierw czyści `dist`, a następnie generuje:

- tokeny CSS i SCSS dla PWA oraz Angulara,
- komponenty React dla ikon i ilustracji,
- surowe SVG dla Angulara,
- typowane nazwy assetów i paczkę Angulara,
- publiczne entry pointy Sass.

Po zakończeniu `dist` zawiera wyłącznie artefakty odtworzone z aktualnych źródeł.
Węższe komendy `build:tokens`, `build:angular`, `transform:icons`,
`transform:illustrations` i `copy:angular-svg` pozostają dostępne do pracy nad
pojedynczym obszarem.

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

### Angular Button

Entry point Angulara eksportuje standalone `VoteyButtonComponent`. Komponent
renderuje gotowe teksty i pozostaje niezależny od mechanizmu tłumaczeń oraz
registry ikon aplikacji. Ikonę należy przekazać przez slot
`voteyButtonIcon` i ustawić `hasIcon`:

```ts
import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { VoteyButtonComponent } from "@pleodigital/design-system-votey/angular";

@Component({
  imports: [MatIcon, VoteyButtonComponent],
  template: `
    <votey-button
      variant="secondary"
      text="Pobierz raport"
      tooltipText="Pobierz raport PDF"
      [hasIcon]="true"
      (pressed)="downloadReport()"
    >
      <mat-icon voteyButtonIcon svgIcon="ui-download" />
    </votey-button>
  `,
})
export class ReportActionsComponent {
  protected downloadReport(): void {
    // akcja aplikacji
  }
}
```

Dostępne warianty to `primary`, `secondary`, `link`, `danger`, `ghost` i
`orange`, a rozmiary to `large` oraz `small`. Teksty, tooltipy i etykiety ARIA
powinny zostać przetłumaczone po stronie aplikacji przed przekazaniem ich do
komponentu.

### Typowane nazwy assetów

Entry point Angulara eksportuje generowane typy nazw ikon i ilustracji:

```ts
import type {
  VoteyIcon,
  VoteyIllustration,
} from "@pleodigital/design-system-votey/angular";

const icon: VoteyIcon = "ui-agenda";
const illustration: VoteyIllustration = "spot-chat";
```

Tablice dostępne w runtime są eksportowane jako `VoteyIconNames` i
`VoteyIllustrationNames`. `npm run build:angular` odświeża je na podstawie
`assets/icons` i `assets/illustrations`. Generator nie modyfikuje plików SVG,
konfiguracji SVGR ani artefaktów React.

### Angular SVG Registry

Entry point Angulara eksportuje `provideVoteySvgRegistry()`, który przy
bootstrapie rejestruje wszystkie publiczne ikony i ilustracje w
`MatIconRegistry`:

```ts
import { ApplicationConfig } from "@angular/core";
import { provideVoteySvgRegistry } from "@pleodigital/design-system-votey/angular";

export const appConfig: ApplicationConfig = {
  providers: [provideVoteySvgRegistry()],
};
```

Domyślny URL assetów to `assets/votey`. Aplikacja powinna skopiować zawartość
`dist/assets/angular/svg-raw` z paczki do tego katalogu przez konfigurację
`assets` w `angular.json`. Inny URL można przekazać jako
`provideVoteySvgRegistry({ assetBaseUrl: "..." })`.
