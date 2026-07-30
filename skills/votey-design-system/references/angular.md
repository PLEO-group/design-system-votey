# Angular Votey / CRM

Wczytaj tę referencję dla `design-system-votey`, `wyborek-crm` albo innego
potwierdzonego konsumenta Angular używającego `@pleodigital/design-system-votey`.
Nie stosuj jej do BoxEs ani Reactowego `votey-user-app`.

## Źródła prawdy

| Zakres | Źródło |
|---|---|
| geometria, hierarchia i stany | handoff ze skilla `figma` |
| tokeny i eksporty Angular | zainstalowana wersja `@pleodigital/design-system-votey` |
| standardy Angular/SCSS | `AGENTS.md` i `angular-code-standards` konsumenta |
| zachowanie domenowe, requesty i formularze | istniejący kod najbliższego flow |

W `design-system-votey` zmieniaj źródła tokenów i uruchamiaj właściwy build.
Nie edytuj `dist`. Jeżeli zakres obejmuje źródłowe SVG, przerwij ten workflow
i użyj `votey-svg-assets`; wróć tutaj dopiero po jego buildzie i walidacji.

## Publiczny kontrakt

- Angular runtime importuj z `@pleodigital/design-system-votey/angular`.
- CSS CRM pochodzi z
  `@pleodigital/design-system-votey/dist/css/tokens.angular.css` i powinien być
  dołączony przez konfigurację builda aplikacji.
- Dla Angulara używaj surowych SVG z `dist/assets/angular/svg-raw` zgodnie
  z mechanizmem konsumenta. Nie importuj komponentów React z `dist/assets/react`.
- Nie zakładaj, że paczka publikuje gotowe komponenty radio, input, button,
  tooltip, table albo modal. Sprawdź entry point i kod CRM.

## Kolory

- Wspólną warstwą CRM i PWA są nieprzezroczyste core color tokens.
- Nowe widoki i redesigny CRM mapuj przede wszystkim na semantic colors CRM
  z `tokens/color/semantic-CRM`.
- Nie używaj semantic colors PWA w CRM ani surowych HEX/RGB.
- Legacy core colors mogą pozostać w istniejącym kodzie, ale nie rozszerzaj
  tego wzorca bez świadomej decyzji migracyjnej.
- Brakującą rolę semantic zgłoś jako gap. Nie pożyczaj podobnej roli PWA.
- Shadow i overlay modeluj semantycznie; alpha należy do tokenu semantic,
  a core color pozostaje opaque.

## Spacing, radius i typografia

- Mapuj na publiczne `--space-*`, `--radius-*` i `--typo-*`, gdy istnieje
  właściwa rola.
- Nie kopiuj wartości ani nazw z BoxEs.
- Fontem CRM jest Open Sans; role `--typo-*` wskazują na
  `--font-family-open-sans`.
- Satoshi należy do PWA i UI Storybooka, nie do CRM.
- Nie twórz lokalnego tokenu tylko dla jednej makiety. Brak roli zapisz jako gap.

## Responsive runtime

- Votey Angular używa szerokości referencyjnych `360`, `375`, `768`, `1024`,
  `1280`, `1920`.
- Wartości pomiędzy punktami interpoluje wygenerowane `calc(...)`; nie kopiuj
  reguł z `tokens.angular.css` i nie zastępuj ich ręcznymi media queries.
- Kontekst urządzenia pochodzi z
  `body[data-device="mobile|tablet|desktop"]` i jest niezależny od samej
  szerokości viewportu.
- Przed użyciem responsive tokenów potwierdź `provideVoteyDeviceDetection()`
  w root `ApplicationConfig`. Jeżeli go brakuje, dodaj provider w jawnym
  zakresie zadania i zweryfikuj bootstrap.
- Nie ustawiaj `data-device`, `data-orientation` ani `--vh` równolegle w feature.
- Dla kilku szerokości z handoffu sprawdź wszystkie wskazane tryby oraz jedną
  szerokość pomiędzy punktami referencyjnymi.

### Różnice między urządzeniami

Wybierz mechanizm według rodzaju różnicy:

- Gdy różni się wyłącznie wygląd lub layout tego samego DOM, użyj mixinów SCSS
  z publicznego entry pointu paczki. Nie dodawaj do komponentu TypeScript tylko
  po to, aby przełączać klasy albo style.
- Gdy urządzenie zmienia strukturę DOM, obecność komponentu, kolejność renderowania
  albo zachowanie, wstrzyknij `VoteyDeviceService` i użyj jego pól
  `isMobileDevice`, `isTabletDevice` lub `isDesktopDevice` w Angular control flow.
- Gdy zmiana obejmuje oba poziomy, użyj serwisu wyłącznie do decyzji strukturalnej,
  a mixinów do stylowania renderowanych elementów. Nie twórz równoległej lokalnej
  detekcji urządzenia ani własnych breakpointów.

SCSS:

```scss
@use "@pleodigital/design-system-votey/ds-device-mixins" as device-mixins;

.content {
  display: grid;

  @include device-mixins.device("mobile") {
    display: block;
  }
}
```

TypeScript:

```ts
import { inject } from "@angular/core";
import { VoteyDeviceService } from "@pleodigital/design-system-votey/angular";

protected readonly voteyDeviceService: VoteyDeviceService =
  inject(VoteyDeviceService);
```

HTML:

```html
@if (voteyDeviceService.isMobileDevice) {
  <app-mobile-content />
} @else {
  <app-desktop-content />
}
```

Nie wywołuj metod serwisu w template. Czytaj istniejące pola stanu bezpośrednio
i nie kopiuj ich do lokalnych flag, jeżeli komponent nie ma dodatkowej logiki.
Ten kontrakt dotyczy wyłącznie konsumentów Angulara; nie przenoś go do
Reactowego `votey-user-app`.

## Implementacja Angular/SCSS

- Najpierw wczytaj lokalny `angular-code-standards`.
- Zachowuj signals, Angular control flow, typed forms i mapowanie danych
  wymagane przez konsumenta.
- Odwzoruj strukturę i mechanikę layoutu przed spacingiem.
- Nie zmieniaj requestów, payloadów ani reguł legacy, jeżeli zakres jest wizualny.
- Nie rozszerzaj obszaru kliknięcia ani triggera interakcji bez decyzji.
- Nie twórz globalnego override’u dla jednego widoku.
- Nie zakładaj istnienia komponentu lub dyrektywy typograficznej bez
  potwierdzenia w publicznym API paczki.

## Walidacja

1. Po zmianie źródeł Design Systemu uruchom jego testy tokenów i właściwy build.
2. W `wyborek-crm` uruchom co najmniej `npm run build:dev`; dla zmiany kontraktu
   paczki także production build.
3. Sprawdź target route i viewport, console errors, overflow oraz computed values.
4. Dla responsive sprawdź punkt referencyjny i szerokość pomiędzy punktami.
5. Potwierdź wymagane stany oraz brak niezamierzonych globalnych override’ów.

Nie deklaruj pixel-perfect bez screenshotu runtime i potwierdzonych wartości
krytycznych z handoffu Figmy.
