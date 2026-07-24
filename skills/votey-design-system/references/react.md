# React / Next Votey PWA

Wczytaj tę referencję dla `votey-user-app` albo innego potwierdzonego konsumenta
React/Next używającego `@pleodigital/design-system-votey`.
Nie stosuj jej do Angularowego CRM ani projektów bez tej paczki.

## Źródła prawdy

| Zakres | Źródło |
|---|---|
| geometria, hierarchia, typografia i stany | handoff ze skilla `figma` |
| core colors, semantic light/dark i ekspozycja Tailwind | zainstalowana paczka Votey |
| ikony i ilustracje | wygenerowane React SVG z paczki |
| Button, Text, inputy, modale, toast i wrappery assetów | lokalne `src/components` i `project-primitives` |
| grid, breakpointy, `rv-*`, device/viewport i font loading | lokalny kod PWA |
| i18n, Server/Client Components i testy | `AGENTS.md` oraz najbliższy feature |

Jeżeli źródła są sprzeczne, nie uśredniaj ich. Ustal, czy zadanie zmienia
Design System, kontrakt aplikacji czy pojedynczy widok.

## Publiczny kontrakt

- Paczka publikuje core color CSS, semantic colors light/dark, ekspozycję
  kolorów dla Tailwind oraz wygenerowane komponenty React SVG.
- Nie publikuje gotowych Reactowych Button, Text, Input, Modal ani Toast.
- Nie jest źródłem PWA gridu, klas `rv-*`, breakpointów, font loadera,
  `DeviceProvider` ani `ViewportProvider`.
- `votey-user-app` mapuje `@votey/*` na
  `node_modules/@pleodigital/design-system-votey/dist/assets/react/*`.
- `next.config.ts` transpiluje paczkę przez `transpilePackages`.
- Nie importuj `@pleodigital/design-system-votey/angular` ani
  `tokens.angular.css`.

W innym konsumencie potwierdź jego aliasy i konfigurację. Nie kopiuj
automatycznie lokalnego kontraktu `votey-user-app`.

## Tokeny CSS i theme

Zachowaj kolejność globalnych importów w `votey-user-app`:

1. Tailwind CSS,
2. `tokens.css`,
3. `tokens.light.css`,
4. `tokens.dark.css`,
5. `tokens.tailwind.css`,
6. lokalne overlaye i style projektu.

- `tokens.samsung.css` jest wąskim overlayem aplikacji, nie źródłem DS.
- Nowe widoki mapuj przede wszystkim na semantic light/dark.
- Przed użyciem klasy potwierdź ekspozycję roli w `tokens.tailwind.css`.
- Nie używaj semantic colors CRM, surowych HEX/RGB ani lokalnego duplikatu
  istniejącego tokenu.
- Brak dokładnej pary light/dark zgłoś jako gap; nie dobieraj przybliżenia
  tylko po nazwie.
- Theme aktywuje `data-theme` na `html`; komponent nie powinien utrzymywać
  równoległego theme w lokalnym stanie.

## Spacing, typography i responsive

- Klasy `rv-*`, `grid-cont*`, `px-main` oraz warianty `tablet`,
  `tablet-landscape`, `desktop` są lokalnym kontraktem PWA.
- Nie kopiuj Angularowych `--space-*`, `--radius-*`, `--typo-*` ani
  sześciopunktowej interpolacji `tokens.angular.css`.
- Satoshi jest ładowany lokalnie przez `next/font/local` jako
  `--font-satoshi`; nie importuj Angularowego font-family tokenu.
- Dla spacingu, rozmiaru, radiusu i typografii najpierw użyj istniejącego
  prymitywu lub utility. Brak roli zgłoś jako gap.
- Scaling PWA używa lokalnych `--origin-vw`, `--rpx`, `--rvw` oraz `rv-*`.
- Nie mapuj automatycznie szerokości Figmy na identyczne breakpointy kodu.
  Odczytaj bieżące media queries z repo i wykonaj breakpoint diff.
- Do layoutu preferuj CSS. `useDevice` stosuj dla zachowania zależnego od
  urządzenia/media query, a `useViewport` dla rzeczywistych pomiarów.
- Nie dodawaj `data-device`, `data-orientation`, `--vh` ani
  `provideVoteyDeviceDetection()`.

## React, Next i lokalne prymitywy

- Zachowaj Server Component jako domyślny. Dodaj `"use client"` tylko dla
  hooków, stanu, eventów albo API przeglądarki.
- Teksty prowadź przez `useTranslations` albo `getTranslations`.
- Przed nowym komponentem sprawdź lokalne Button, Text, Input, IconWrapper,
  IllustrationWrapper, Modal i inne prymitywy wskazane przez `project-primitives`.
- Nie obchodź API prymitywu kruchymi selektorami strukturalnymi. Jeżeli
  potrzebujesz klas per slot, rozszerz wąski kontrakt i zaktualizuj test.
- Nie zakładaj, że `tailwind-merge` rozpoznaje `rv-*`; przy override rozmiaru
  zastąp cały bazowy zestaw albo użyj jawnego slotu.

## Assety React

- Importuj asset przez potwierdzony alias `@votey/icons/...` lub
  `@votey/illustrations/...`; w innym konsumencie użyj jego aliasu albo
  publicznej ścieżki `dist/assets/react/...`.
- Potwierdź dokładną nazwę pliku lub eksportu w zainstalowanej paczce.
- Ikony używają `currentColor`; koloruj je semantycznie zgodnie z IconWrapper.
- Ilustracje zachowują wielokolorowe fill’e i są dekoracyjne. Nie zamieniaj
  wszystkich kolorów na `currentColor`.
- Reużyj `IllustrationWrapper`, gdy feature opiera się na stanach lub
  selektorach grup SVG.
- Nie edytuj wygenerowanych plików w paczce. Zmień źródłowy SVG w DS, przebuduj
  paczkę i zweryfikuj konsumenta.
- Nie wymyślaj assetu z nazwy warstwy Figmy.

## Walidacja

1. Uruchom najwęższy lint i testy obejmujące zmienione pliki.
2. Uruchom `npm run build` dla zmian Server/Client boundary, globalnych styli,
   importów paczki, assetów albo konfiguracji Next.
3. Sprawdź target route, viewport, console, hydration errors, overflow oraz
   computed colors i spacing.
4. Dla theme sprawdź light i dark; dla responsive wszystkie wskazane warianty
   oraz istotną granicę lokalnego media query.
5. Dla assetu sprawdź rozmiar SVG, `currentColor`/fill, kolizje `id`/`clipPath`
   i accessible name albo `aria-hidden`.
6. Po zmianie źródeł DS uruchom jego testy tokenów i build przed instalacją PWA.

Nie deklaruj pixel-perfect bez screenshotu runtime i potwierdzonych wartości
krytycznych z handoffu Figmy.
