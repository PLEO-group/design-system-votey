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

Aktualny eksport Figma Variables nie zawiera już tokenów `font-family`. Generator
nie publikuje więc `--font-family-*` ani `--typo-*-font-family`; wybór fontu
pozostaje tymczasowo po stronie komponentu lub aplikacji i będzie migrowany
razem z komponentami do nowego kontraktu tokenów.

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
renderuje gotowe teksty i pozostaje niezależny od mechanizmu tłumaczeń.
Ikonę z publicznego rejestru SVG przekazuje się przez input `ico`:

```ts
import { Component } from "@angular/core";
import { VoteyButtonComponent } from "@pleodigital/design-system-votey/angular";

@Component({
  imports: [VoteyButtonComponent],
  template: `
    <vt-button
      variant="secondary"
      text="Pobierz raport"
      ico="ui-download"
      tooltipText="Pobierz raport PDF"
      (pressed)="downloadReport()"
    />
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

### Angular Icon

Standalone `VoteyIconComponent` publikuje selector `vt-icon` i input `ico`.
Przyjmuje wyłącznie nazwy ikon i ilustracji eksportowane przez paczkę jako
typy `VoteyIcon` oraz `VoteyIllustration`:

```ts
import { Component } from "@angular/core";
import { VoteyIconComponent } from "@pleodigital/design-system-votey/angular";

@Component({
  imports: [VoteyIconComponent],
  template: `<vt-icon ico="ui-plus" ariaLabel="Dodaj" />`,
})
export class AddIconComponent {}
```

Ikona znacząca powinna dostać dostępny opis przez `ariaLabel`. Ikonę wyłącznie
dekoracyjną pozostaw bez opisu; komponent ukryje ją wtedy przed czytnikami ekranu.

Zarówno `vt-icon`, jak i korzystający z niego `vt-button`, wymagają
skonfigurowania `provideVoteySvgRegistry()` oraz skopiowania publicznych SVG do
`assets/votey`, zgodnie z opisem rejestru SVG powyżej.

Wszystkie komponenty Angular publikowane przez paczkę muszą używać selectorów
elementowych z prefiksem `vt-`. Kontrakt jest sprawdzany automatycznie w testach.

### Angular Checkbox

Standalone `VoteyCheckboxComponent` opakowuje checkbox Angular Material i
publikuje selector `vt-checkbox`. Obsługuje Angular Forms, stany `checked`,
`indeterminate`, `disabled` i `error`, pozycję etykiety oraz projekcję bogatej
treści etykiety.

```ts
import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { VoteyCheckboxComponent } from "@pleodigital/design-system-votey/angular";

@Component({
  imports: [ReactiveFormsModule, VoteyCheckboxComponent],
  template: `
    <vt-checkbox
      label="Akceptuję regulamin"
      [formControl]="termsControl"
      [required]="true"
    />
  `,
})
export class TermsComponent {
  protected readonly termsControl = new FormControl<boolean>(false, {
    nonNullable: true,
  });
}
```

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

### Angular DatePicker i TimePicker

Publiczny entry point `@pleodigital/design-system-votey/angular` udostępnia
`VoteyDatePickerComponent` (`vt-date-picker`) i `VoteyTimePickerComponent`
(`vt-time-picker`). Kalendarz jest elementem wewnętrznym biblioteki. Pickery
wymagają zgodnej wersji `@angular/cdk` oraz arkusza tokenów Angulara.
Panel ma stałe 320 px, dzień 40 × 40 px, a ikony 24 × 24 px; te wymiary
nie są zmiennymi Figmy i są zapisane bezpośrednio w SCSS pickerów.

```ts
import { FormControl } from "@angular/forms";
import {
  VoteyDatePickerComponent,
  VoteyTimePickerComponent,
} from "@pleodigital/design-system-votey/angular";

const date = new FormControl<string | null>(null);
const time = new FormControl<string | null>(null);
```

```html
<vt-date-picker label="Data" [control]="date" mode="Date" />
<vt-time-picker label="Godzina" [control]="time" [stepMinutes]="30" />
```

`Date` zapisuje `YYYY-MM-DD`, `DateTime` zapisuje kanoniczne UTC ISO
`YYYY-MM-DDTHH:mm:00.000Z`, a `TimePicker` zapisuje `HH:mm`. Puste opcjonalne
pole daje `null`. `min` i `max` w trybie `Date` są datami `YYYY-MM-DD`, a w
`DateTime` chwilami ISO z offsetem lub `Z`. Krok godzin wynosi domyślnie
30 minut; `timeEntryPolicy="listOnly"` ogranicza **nowe** wybory do listy.
Nieedytowana wartość historyczna spoza listy pozostaje poprawna. Kontrolka
formularza ustala `required`, a aplikacja mapuje wartość do własnego API.

Picker dodaje do `control.errors` tylko własne klucze: `voteyPickerFormat`,
`voteyPickerDate`, `voteyPickerTime`, `voteyPickerRange`, `voteyPickerPolicy`
i `voteyPickerConfig`. Tłumacz aplikacji (`VOTEY_TRANSLATOR`) powinien obsłużyć
`ERRORS.VOTEYPICKERFORMAT`, `ERRORS.VOTEYPICKERDATE`,
`ERRORS.VOTEYPICKERTIME`, `ERRORS.VOTEYPICKERRANGE`,
`ERRORS.VOTEYPICKERPOLICY`, `ERRORS.VOTEYPICKERCONFIG` oraz etykiety akcji
`BUTTON.CLEAR`, `BUTTON.PREVIOUS_MONTH` i `BUTTON.NEXT_MONTH`.
