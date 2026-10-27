# Responsywność i grid Votey

## Kontrakt

`responsive.mode` to wyłącznie `device-contract`: są trzy typy urządzeń
(`mobile`, `tablet`, `desktop`) i sześć szerokości referencyjnych
(`mobile-small`, `mobile`, `tablet-small`, `tablet`, `laptop`, `desktop`).
Pierwsza para należy do kontraktu mobile, druga do tablet, trzecia do desktop.
Szerokości referencyjne służą interpolacji tokenów; **nie są warunkami wykrywania
device**. Zwężenie okna desktopowej przeglądarki nie zmienia automatycznie
`data-device="desktop"` na `mobile` albo `tablet`. Nie dokładaj równoległego
`css-media` modelu ani lokalnego detectora device.

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

W Angularowym Wyborek CRM jedynym wyjątkiem dla responsywnego `@media` opartego
na szerokości jest `max-width: 1023px`: przełącza shell z menu bocznego na górne.
Wewnątrz tego zakresu wspólne style widoku z topbarem mogą korzystać z tego
warunku, ale różnice między mobile, tablet i desktop nadal wymagają `device()`
lub `VoteyDeviceService` zgodnie z rodzajem zmiany. Nie używaj np.
`@media (max-width: 767px)` ani `@media (min-width: 768px)` do wybierania wariantu
mobile/tablet; to myli breakpoint z device. Nie dotyczy to zapytań o cechy
środowiska, takich jak `prefers-reduced-motion` czy `pointer`.

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
