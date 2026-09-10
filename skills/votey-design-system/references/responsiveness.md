# Responsywność i grid Votey

## Kontrakt

`responsive.mode` to wyłącznie `device-contract`: device types `mobile`, `tablet`,
`desktop` mapują na breakpointy o tych samych nazwach. Referencyjne nazwy to
`mobile-small`, `mobile`, `tablet-small`, `tablet`, `laptop`, `desktop`; fallbacki
to odpowiednio mobile, tablet i desktop. Nie dokładaj równoległego `css-media`
modelu ani lokalnego detectora device.

Angular ma responsywne outputy w `tokens.angular.css`; `VoteyDeviceService` i
`provideVoteyDeviceDetection()` ustawiają `body[data-device]`, orientację i `--vh`.
Styl tego samego DOM używa publicznego mixinu `device()` z
`@pleodigital/design-system-votey/ds-device-mixins`; zmiana DOM, kolejności,
obecności albo behavior korzysta z serwisu. PWA nie dziedziczy tego runtime'u:
jej `rv-*`, viewport i media queries są lokalne, opisane w `react.md`.

`@pleodigital/design-system-votey/ds-device-mixins` jest równorzędnym publicznym
entry pointem Sass, a nie deep importem ani wyjątkiem od izolacji frameworków.
Jeżeli responsywność zmienia wyłącznie style lub layout tego samego DOM, wybierz
mixin `device()`; jeżeli zmienia DOM, kolejność, obecność elementu lub behavior,
użyj `VoteyDeviceService`. Nie wybieraj mechanizmu na podstawie samej szerokości
viewportu ani nie stosuj obu dla tej samej decyzji.

## Grid i patterns

Grid jest włączony z wariantem `default`, źródło `tokens/grid/angular.json`,
ścieżka `grid`. Przy handoffie rozróżnij pattern main, nested, form i card; nie
kopiuj wartości z Figmy do lokalnej siatki. Przed zmianą gridu, device map,
mnożnika lub fallbacku przeczytaj manifest i uruchom
`verify-responsive-config.mjs`, gdy konfiguracja generatora jest dostępna.

## Walidacja

Porównaj style z behavior, sprawdź overlay/grid i wymagane viewporty: każdy
z handoffu oraz co najmniej jeden między punktami referencyjnymi. W runtime sprawdź
theme, console, overflow, device/orientation i computed values. Zmiana shared
wymaga walidacji Angulara i React/PWA; nie deklaruj visual parity bez dowodu.
