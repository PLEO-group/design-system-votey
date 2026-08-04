# System nazewnictwa ikon Votey

Ta referencja definiuje nazwy źródłowych plików SVG oraz wynikowe nazwy
publiczne dla Angular Registry i React. Używaj jej przy dodawaniu, przenoszeniu,
zmianie nazwy i audycie ikon w `design-system-votey`.

## Spis treści

1. [Zasady bazowe](#zasady-bazowe)
2. [Struktura nazwy](#struktura-nazwy)
3. [Context](#context)
4. [Descriptor](#descriptor)
5. [Usunięty wyjątek legacy](#usunięty-wyjątek-legacy)
6. [Modifier](#modifier)
7. [Mapowanie na Angular Registry](#mapowanie-na-angular-registry)
8. [Mapowanie na React](#mapowanie-na-react)
9. [Duplikaty i zmiana znaczenia](#duplikaty-i-zmiana-znaczenia)
10. [Raw SVG, React i Storybook](#raw-svg-react-i-storybook)
11. [Najczęstsze błędy](#najczęstsze-błędy)
12. [Kiedy zatrzymać się i zapytać](#kiedy-zatrzymać-się-i-zapytać)
13. [Walidacja po zmianie nazwy](#walidacja-po-zmianie-nazwy)

## Zasady bazowe

- Nazywaj ikony po angielsku.
- W nazwie pliku używaj wyłącznie małych liter, cyfr, `_` i `-`.
- Nie używaj spacji, camelCase, polskich nazw ani nazw warstw z Figmy.
- Nazwa ma opisywać znaczenie ikony bez otwierania SVG.
- `_` oddziela techniczne segmenty nazwy.
- `-` oddziela słowa w descriptorze semantycznym.
- Jeden koncept ma jeden kanoniczny asset. Nie dodawaj duplikatu pod inną nazwą.
- Nie zmieniaj nazwy przy samym redesignie, jeśli znaczenie ikony pozostaje takie samo.

## Struktura nazwy

Podstawowy wzorzec:

```text
icon_<set-prefix>_<descriptor>[_<modifier>].svg
```

Wyjątek dla logotypów:

```text
logo_<brand>_<descriptor>.svg
```

Segmenty:

| Segment | Wymagany | Rola |
| --- | --- | --- |
| `icon` / `logo` | tak | Typ assetu |
| `set-prefix` | dla ikon | Techniczny prefix setu: `menu`, `sp` albo `ui` |
| `descriptor` | tak | Znaczenie ikony |
| `modifier` | nie | Wariant wizualny tego samego znaczenia |

Przykłady:

```text
icon_menu_burger.svg
icon_sp_flag-united-kingdom.svg
icon_ui_file-pdf.svg
icon_ui_full-screen_v2.svg
icon_ui_proxy_thick.svg
logo_wyborek_sygnet.svg
```

## Context

Context opisuje przeznaczenie ikony, nie jej wygląd. Nazwa contextu w strukturze
repo i Storybooku nie zawsze jest identyczna z technicznym prefixem pliku.

| Context | Folder | Prefix pliku / namespace | Zastosowanie | Przykład |
| --- | --- | --- | --- | --- |
| `logotypes` | `assets/icons/logotypes/` | `logo` | Znaki i logotypy | `logo_wyborek_sygnet.svg` |
| `menu` | `assets/icons/menu/` | `menu` | Główna nawigacja i sidebar | `icon_menu_dashboard.svg` |
| `special` | `assets/icons/special/` | `sp` | Statusy, flagi i ikony specjalne | `icon_sp_incorrect.svg` |
| `ui` | `assets/icons/ui/` | `ui` | Ogólne akcje i elementy interfejsu | `icon_ui_search.svg` |

Utrzymywany wyjątek: `assets/icons/menu/icon_ui_close.svg` pozostaje w grupie
`menu` z nazwą pliku `icon_ui_close.svg`. Generator publikuje go jako
`menu-ui-close` w Angular Registry oraz `IconUiClose` z entry pointu React
`icons/menu`. Nie przenoś go do `ui` i nie zmieniaj na `icon_menu_close.svg`.

Contexty ilustracji mają analogiczny kontrakt folderu, prefixu i publicznego
namespace'u:

| Context | Folder | Prefix pliku | Angular Registry | Przykład React |
| --- | --- | --- | --- | --- |
| `background` | `assets/illustrations/background/` | `illu_bg_` | `bg-*` | `IlluBgVotingResults` |
| `logotypes` | `assets/illustrations/logotypes/` | `logo_` | `logo-*` | `LogoVotey` |
| `spot` | `assets/illustrations/spot/` | `illu_spot_` | `spot-*` | `IlluSpotResultsOn` |
| `simple` | `assets/illustrations/simple/` | `illu_simple_` | `simple-*` | `IlluSimpleNotification` |

Nie przenoś słownictwa domenowego BoxEs, np. `couriers`, `suppliers`, `fleet`,
do Votey bez potwierdzonego znaczenia w produkcie Votey.

Nowy context wprowadzaj tylko po jawnej decyzji i aktualizacji tej referencji,
generatora typów oraz Storybooka.

## Descriptor

Descriptor odpowiada na pytanie: co ikona znaczy albo jaką akcję uruchamia?

Musi być:

- po angielsku,
- jednoznaczny w obrębie contextu,
- zapisany słowami oddzielonymi `-`,
- uporządkowany od ogółu do szczegółu,
- wolny od zbędnych słów technicznych, np. `button`, `asset`, `vector`.

Preferuj nazwę funkcji lub rezultatu nad nazwą historyczną albo wyglądem:

| Unikaj | Preferuj | Powód |
| --- | --- | --- |
| `anuluj` | `close` | Angielska, publiczna akcja |
| `not-saved` | `save` | Nazwa akcji zamiast negacji |
| `observer` | `visibility-on` | Jednoznaczny stan funkcji |
| `no-limit` | `unlimited` | Kanoniczne pojęcie |
| `report-problem` | `problem` | Bez zbędnego czasownika |
| `list-of-participants` | `participants-list` | Najpierw encja, potem typ |

### Stany

Jeżeli stan jest częścią znaczenia, umieszczaj go na końcu descriptora:

```text
icon_ui_camera-on.svg
icon_ui_camera-off.svg
icon_ui_visibility-on.svg
icon_ui_visibility-off.svg
icon_ui_event-completed.svg
```

Nie traktuj `on`, `off`, `pending`, `completed` ani `new` automatycznie jako
modifierów. Są częścią descriptora, gdy opisują stan funkcji lub obiektu.

### Typy plików

Ikony formatów plików mają wspólny segment `file-`:

```text
icon_ui_file-csv.svg
icon_ui_file-doc.svg
icon_ui_file-pdf.svg
icon_ui_file-xls.svg
icon_ui_file-zip.svg
```

Nie dodawaj nowych skróconych nazw typu `icon_ui_pdf.svg`.

### Wersje tej samej funkcji

Jeżeli kilka ikon ma to samo ogólne znaczenie, ale różne zastosowanie lub
ustaloną wersję, zachowaj wspólny rdzeń:

```text
icon_ui_close.svg
icon_ui_close_v2.svg

icon_ui_time.svg
icon_ui_time_v2.svg

icon_ui_participants-list.svg
icon_ui_participants-list_v2.svg
```

Nie twórz `_v2` tylko dlatego, że plik został ponownie wyeksportowany. Modifier
oznacza utrzymywany wariant publiczny.

## Usunięty wyjątek legacy

Plik legacy usunięty 4.08.26:

```text
icon_ui_expand_arrow.svg
```

Usunięte publiczne nazwy:

```text
Angular Registry: ui-expand-arrow
React: IconUiExpandArrow
```

Nie przywracaj tego wyjątku ani underscore w descriptorze nowych ikon. Konsumenci
muszą przejść na kierunkowy wariant `icon_ui_expand-arrow-right.svg`:

```text
Angular Registry: ui-expand-arrow-right
React: IconUiExpandArrowRight
```

Pełne mapowanie dla Angulara i Reacta opisuje
`docs/migrations/icons-4.08.26.md`.

## Modifier

Modifier opisuje wariant wizualny, a nie stan domenowy.

| Modifier | Znaczenie |
| --- | --- |
| `thick` | Wariant o większej grubości |
| `v2` | Drugi utrzymywany wariant tej samej funkcji |

Modifier dodawaj po `_`:

```text
icon_ui_proxy_thick.svg
icon_ui_voting_thick.svg
icon_ui_full-screen_v2.svg
```

W Votey wariant `thick` może istnieć bez ikony bazowej. Brak bazy nie jest
błędem dla:

```text
icon_ui_show-graph_thick.svg
icon_ui_turn-on_thick.svg
```

Nie twórz sztucznego wariantu bazowego i nie usuwaj `thick` z nazwy.

`simple` nie jest modifierem ikon Votey. Jest osobnym contextem ilustracji,
z folderem `assets/illustrations/simple/`, prefiksem `illu_simple_` i publicznym
namespace'em `simple-*`. Nie nazywaj ikon `icon_ui_*_simple.svg` ani ilustracji
`illu_spot_*_simple.svg`.

## Mapowanie na Angular Registry

Folder jest źródłem namespace'u publicznego. Prefix pliku musi zgadzać się
z folderem; przy sprzeczności zatrzymaj workflow zamiast polegać na samym
prefixie.

Reguła generatora:

1. ustal namespace z folderu: `menu`, `sp`, `ui` albo `logo`,
2. usuń techniczny prefix `icon_<context>_` albo `logo_`,
3. zamień `_` w descriptorze i modifierze na `-`,
4. znormalizuj wynik do lowercase kebab-case,
5. dodaj namespace z folderu.

Przykłady:

```text
icon_menu_burger.svg          -> menu-burger
icon_sp_flag-poland.svg       -> sp-flag-poland
icon_ui_proxy_thick.svg       -> ui-proxy-thick
icon_ui_full-screen_v2.svg    -> ui-full-screen-v2
logo_wyborek_sygnet.svg       -> logo-wyborek-sygnet
```

Publiczna nazwa musi być unikalna w `VoteyIconNames`.

Dla ilustracji stosuj namespace wynikający z folderu i usuń odpowiadający mu
prefix pliku:

```text
illu_bg_voting-results.svg       -> bg-voting-results
illu_spot_results-on.svg         -> spot-results-on
illu_simple_notification.svg     -> simple-notification
logo_votey.svg                   -> logo-votey
```

Publiczna nazwa ilustracji musi być unikalna w `VoteyIllustrationNames`.

## Mapowanie na React

Reguła:

1. zamień cały stem pliku na PascalCase,
2. zachowaj context, descriptor i modifier,
3. dodaj `Icon` na początku, również dla logotypu znajdującego się w zbiorze ikon.

Przykłady:

```text
icon_menu_burger.svg          -> IconMenuBurger
icon_sp_flag-poland.svg       -> IconSpFlagPoland
icon_ui_proxy_thick.svg       -> IconUiProxyThick
icon_ui_full-screen_v2.svg    -> IconUiFullScreenV2
logo_wyborek_sygnet.svg       -> IconLogoWyborekSygnet
```

Nie poprawiaj ręcznie nazw w `dist`. Generator React i
`scripts/normalize-react-icon-names.mjs` muszą odtworzyć nazwę z pliku źródłowego.

Dla ilustracji React zachowaj prefix wynikający z nazwy pliku:

```text
illu_bg_voting-results.svg       -> IlluBgVotingResults
illu_spot_results-on.svg         -> IlluSpotResultsOn
illu_simple_notification.svg     -> IlluSimpleNotification
logo_votey.svg                   -> LogoVotey
```

## Duplikaty i zmiana znaczenia

Przed dodaniem albo rename:

1. sprawdź descriptor w tym samym contexcie,
2. sprawdź publiczną nazwę Angular,
3. sprawdź publiczną nazwę React,
4. porównaj wygląd i zastosowanie z istniejącymi assetami,
5. wybierz istniejący asset, jeżeli znaczenie jest to samo.

Jeżeli rename zmienia znaczenie, przygotuj mapowanie starej nazwy do nowej dla
PWA i CRM. Nie usuwaj starego kontraktu bez planu migracji konsumentów.

## Raw SVG, React i Storybook

- Źródłem nazwy jest plik w `assets/icons/**`.
- Angular publikuje raw SVG z `dist/assets/angular/svg-raw/icons/**`.
- React publikuje komponenty z `dist/assets/react/icons/**`.
- Źródłem ilustracji jest plik w `assets/illustrations/**`.
- Angular publikuje raw ilustracje z
  `dist/assets/angular/svg-raw/illustrations/**`.
- React publikuje ilustracje z `dist/assets/react/illustrations/**`.
- Storybook pokazuje źródłowy raw SVG, ale opisuje także wynikowe nazwy Angular i React.
- Poprawny podgląd raw SVG nie gwarantuje poprawnego wyniku SVGR. Dla ikon
  `special` osobno sprawdź kolory w wygenerowanym komponencie React.

Nie rozwiązuj problemu nazwy przez ręczną edycję `dist` ani lokalny alias w jednej
aplikacji.

## Najczęstsze błędy

| Błędnie | Poprawnie | Powód |
| --- | --- | --- |
| `icon_UI_Close.svg` | `icon_ui_close.svg` | Lowercase |
| `iconUiClose.svg` | `icon_ui_close.svg` | Bez camelCase |
| `icon-ui-close.svg` | `icon_ui_close.svg` | `_` oddziela segmenty techniczne |
| `icon_close.svg` | `icon_ui_close.svg` | Brak contextu |
| `icon_ui_share_screen.svg` | `icon_ui_share-screen.svg` | `-` wewnątrz descriptora |
| `icon_ui_pdf.svg` | `icon_ui_file-pdf.svg` | Wspólna rodzina `file-*` |
| `icon_ui_proxy_simple.svg` | `icon_ui_proxy_thick.svg` | `simple` nie jest wariantem ikon |
| `icon_ui_show-graph.svg` | `icon_ui_show-graph_thick.svg` | Nie usuwaj jawnego wariantu |
| `illu_spot_notification_simple.svg` | `illu_simple_notification.svg` | `simple` jest contextem ilustracji |

## Kiedy zatrzymać się i zapytać

Zatrzymaj workflow, jeżeli:

- potrzebny jest nowy context,
- nie wiadomo, czy ikona należy do `menu`, `special` czy `ui`,
- descriptor może oznaczać dwie różne akcje,
- proponowana nazwa koliduje z istniejącą nazwą Angular albo React,
- nie wiadomo, czy słowo jest stanem descriptora czy modifierem,
- rename zmienia znaczenie publicznego assetu,
- trzeba usunąć asset używany przez PWA lub CRM,
- nazwa z Figmy jest opisowa, robocza albo zawiera polskie słowa.

Nie zatrzymuj workflow wyłącznie dlatego, że `thick` nie ma wariantu bazowego.

## Walidacja po zmianie nazwy

- [ ] plik znajduje się w folderze odpowiadającym contextowi,
- [ ] nazwa pliku spełnia wzorzec,
- [ ] Angular Registry ma oczekiwaną nazwę kebab-case,
- [ ] React ma oczekiwaną nazwę `Icon...`,
- [ ] publiczne nazwy są unikalne,
- [ ] nie powstał duplikat semantyczny,
- [ ] `npm run check:asset-types` przechodzi,
- [ ] `npm run transform:icons` generuje oczekiwane pliki,
- [ ] `npm run test:tokens` przechodzi,
- [ ] `npm run build-storybook` pokazuje ikonę w poprawnym contexcie,
- [ ] zmiana łamiąca ma instrukcję migracji dla PWA i CRM.
