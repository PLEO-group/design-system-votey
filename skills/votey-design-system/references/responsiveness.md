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

### CRM admin grid — odrębny kontrakt od BoxEs

Nie przenoś mechaniki gridu z BoxEs ani starszego `angular-design-system` do Votey.
W CRM **liczba kolumn zależy wyłącznie od `device`** (`mobile` 4, `tablet` 8,
`desktop` 12), które `VoteyDeviceService` rozpoznaje z urządzenia, nie z szerokości
okna. Szerokość viewportu wybiera za to dwa ciągłe tokeny geometryczne:
`--grid-margin` i `--grid-column-gap`. Są interpolowane liniowo między sześcioma
punktami referencyjnymi i ograniczone do wartości brzegowych poza zakresem.
Nie skaluj ich pojedynczym współczynnikiem `wartość / referencja * 100vw`
przypisanym do device — ta dawna metoda nie odtwarza wszystkich sześciu makiet.

| Szerokość referencyjna | Margines | Gutter |
| --- | ---: | ---: |
| 360 i 375 px | 16 px | 16 px |
| 768 px | 24 px | 24 px |
| 1024 px | 42 px | 24 px |
| 1280 px | 32 px | 24 px |
| 1920 px | 64 px | 40 px |

Sidebar jest **trzecią, dyskretną osią**. Poniżej 1024 px aplikacja ma menu górne,
a obie szerokości sidebaru wynoszą 0 px. Od 1024 px menu boczne ma 80 px w stanie
`collapsed` i 140 px w stanie `expanded`; od 1920 px szerokość `expanded` to
183 px. Te wartości pozostają stałe w swoich przedziałach, nie są interpolowane.
Tokeny `--grid-sidebar-width-collapsed` i `--grid-sidebar-width-expanded` są
wartościami projektu, a `--grid-sidebar-width` jest aktywną rezerwą layoutu.
Stan menu należy do konsumenta: ustawia on na `body` atrybut
`data-votey-sidebar-state="collapsed"` lub `"expanded"`. Bez tego atrybutu
rezerwa wynosi 0 px, np. na stronach bez shellu CRM. Na małym ekranie wysuwane
menu może nakładać się na treść, ale nie zmienia rezerwy grida.

Grid treści i debug overlay muszą używać tej samej szerokości
`--grid-content-width = 100vw - --grid-sidebar-width`, symetrycznych marginesów
`--grid-margin` **wewnątrz obszaru treści** i guttera `--grid-column-gap`.
`--grid-column-width` jest wyliczany z tego obszaru, nie z pełnego viewportu.
Nie używaj `--grid-margin-extra`: ten token i dekoracyjne pasy zostały usunięte
z kontraktu DS i Storybooka. Istniejący overlay w CRM trzeba zmigrować osobno;
do czasu tej migracji nie deklaruj zgodności runtime. Przykład kontrolny:
desktopowa przeglądarka zwężona do 768 px nadal
może mieć 12 kolumn, lecz margines i gutter wyniosą po 24 px, a sidebar 0 px.

## Walidacja

Porównaj style z behavior, sprawdź overlay/grid i wymagane viewporty: każdy
z handoffu oraz co najmniej jeden między punktami referencyjnymi. W runtime sprawdź
theme, console, overflow, device/orientation i computed values. Zmiana shared
wymaga walidacji Angulara i React/PWA; nie deklaruj visual parity bez dowodu.
