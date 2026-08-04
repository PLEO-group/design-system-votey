# Migracja ikon — 4.08.26

Status: draft  
Zakres: zmiany ikon na bieżącym branchu `design-system-votey`  
Wersja paczki: do uzupełnienia przed wydaniem

## Breaking changes

Z paczki usunięto lub zmieniono poniższe nazwy publiczne. Konsumenci muszą
przejść na wskazane zamienniki.

| Framework | Usunięta nazwa | Zamiennik |
| --- | --- | --- |
| Angular Registry | `ui-chevron` | `ui-chevron-down` |
| Angular Registry | `ui-expand-arrow` | `ui-expand-arrow-right` |
| Angular Registry | `ui-preview` | `ui-search` |
| Angular Registry | `ui-countdown` | `ui-pending` |
| Angular Registry | `ui-exclamation-mark` | `sp-exclamation-mark` |
| Angular Registry | `ui-attachment` | `ui-attachment-thick` |
| Angular Registry | `ui-edit-v2` | `ui-edit-thick` |
| React | `IconUiChevron` | `IconUiChevronDown` |
| React | `IconUiExpandArrow` | `IconUiExpandArrowRight` |
| React | `IconUiPreview` | `IconUiSearch` |
| React | `IconUiCountdown` | `IconUiPending` |
| React | `IconUiExclamationMark` | `IconSpExclamationMark` |
| React | `IconUiAttachment` | `IconUiAttachmentThick` |
| React | `IconUiEditV2` | `IconUiEditThick` |

Usunięte źródła bez odpowiednika 1:1:

- `assets/icons/ui/icon_ui_chevron.svg`,
- `assets/icons/ui/icon_ui_expand_arrow.svg`,
- `assets/icons/ui/icon_ui_countdown.svg` — użyj istniejącego
  `assets/icons/ui/icon_ui_pending.svg`.

Źródła ze zmienioną nazwą albo contextem:

- `assets/icons/ui/icon_ui_preview.svg` → `assets/icons/ui/icon_ui_search.svg`,
- `assets/icons/ui/icon_ui_exclamation-mark.svg` →
  `assets/icons/special/icon_sp_exclamation-mark.svg`,
- `assets/icons/ui/icon_ui_attachment.svg` →
  `assets/icons/ui/icon_ui_attachment_thick.svg`,
- `assets/icons/ui/icon_ui_edit_v2.svg` →
  `assets/icons/ui/icon_ui_edit_thick.svg`.

`assets/icons/ui/icon_ui_close.svg` pozostaje w secie `ui`. Jego publiczny
kontrakt nie zmienia się: Angular Registry używa `ui-close`, a React eksportuje
`IconUiClose` z entry pointu `icons/ui`.

## Angular

Zmień nazwy przekazywane do `vt-icon` albo używane przy bezpośrednim odwołaniu
do Angular SVG Registry:

```html
<!-- przed -->
<vt-icon ico="ui-chevron" />
<vt-icon ico="ui-expand-arrow" />
<vt-icon ico="ui-preview" />
<vt-icon ico="ui-countdown" />
<vt-icon ico="ui-exclamation-mark" />
<vt-icon ico="ui-attachment" />
<vt-icon ico="ui-edit-v2" />

<!-- po -->
<vt-icon ico="ui-chevron-down" />
<vt-icon ico="ui-expand-arrow-right" />
<vt-icon ico="ui-search" />
<vt-icon ico="ui-pending" />
<vt-icon ico="sp-exclamation-mark" />
<vt-icon ico="ui-attachment-thick" />
<vt-icon ico="ui-edit-thick" />
```

Nowe warianty mają `viewBox="0 0 14 14"`. Stary `ui-chevron` miał rozmiar
`14 × 9`, a stary `ui-expand-arrow` `12 × 12`. Po migracji sprawdź wyrównanie,
rozmiar oraz kolor ikony w każdym użyciu.

`ui-countdown` miał rozmiar `33 × 33`, a zastępujący go `ui-pending` ma
`22 × 22`. `sp-exclamation-mark` zachowuje źródłowy rozmiar `14 × 14` i kolor,
ale jest teraz rejestrowany w namespace `sp`. Pozostałe rename zachowują
geometrię i `viewBox` dotychczasowych assetów.

## React

Zmień importy i JSX, zachowując dotychczasowy entry point ikon UI:

```tsx
// przed
import {
  IconUiChevron,
  IconUiExpandArrow,
  IconUiPreview,
  IconUiCountdown,
  IconUiExclamationMark,
  IconUiAttachment,
  IconUiEditV2,
} from "@pleodigital/design-system-votey/dist/assets/react/icons/ui";

// po
import {
  IconUiChevronDown,
  IconUiExpandArrowRight,
  IconUiSearch,
  IconUiPending,
  IconUiAttachmentThick,
  IconUiEditThick,
} from "@pleodigital/design-system-votey/dist/assets/react/icons/ui";
import { IconSpExclamationMark } from "@pleodigital/design-system-votey/dist/assets/react/icons/special";
```

```tsx
// przed
<IconUiChevron />
<IconUiExpandArrow />
<IconUiPreview />
<IconUiCountdown />
<IconUiExclamationMark />
<IconUiAttachment />
<IconUiEditV2 />

// po
<IconUiChevronDown />
<IconUiExpandArrowRight />
<IconUiSearch />
<IconUiPending />
<IconSpExclamationMark />
<IconUiAttachmentThick />
<IconUiEditThick />
```

Warianty UI nadal używają `currentColor`. Po przeniesieniu do `special`
`IconSpExclamationMark` zachowuje źródłowy kolor `#07064e` zamiast dziedziczyć
`currentColor`. `IconUiPending` ma `viewBox="0 0 22 22"`, podczas gdy usunięty
`IconUiCountdown` miał `viewBox="0 0 33 33"`. Po migracji sprawdź kolor, rozmiar
i wyrównanie ikon.

## Dostępne warianty kierunkowe

| Kierunek | Angular Registry | React |
| --- | --- | --- |
| dół | `ui-chevron-down` | `IconUiChevronDown` |
| lewo | `ui-chevron-left` | `IconUiChevronLeft` |
| prawo | `ui-chevron-right` | `IconUiChevronRight` |
| góra | `ui-chevron-up` | `IconUiChevronUp` |
| dół | `ui-expand-arrow-down` | `IconUiExpandArrowDown` |
| lewo | `ui-expand-arrow-left` | `IconUiExpandArrowLeft` |
| prawo | `ui-expand-arrow-right` | `IconUiExpandArrowRight` |
| góra | `ui-expand-arrow-up` | `IconUiExpandArrowUp` |

## Nowe ikony

| Źródło | Angular Registry | React |
| --- | --- | --- |
| `assets/icons/ui/icon_ui_option.svg` | `ui-option` | `IconUiOption` z `icons/ui` |

## Nowe ilustracje

Dodano context `info` dla większych, szczegółowych infografik. Pliki z prefiksem
`illu_info_` są publikowane w osobnym namespace i prezentowane w Storybooku na
powiększonych kafelkach.

| Źródło | Angular Registry | React |
| --- | --- | --- |
| `assets/illustrations/info/illu_info_subscription-calculator.svg` | `info-subscription-calculator` | `IlluInfoSubscriptionCalculator` z `illustrations/info` |

## Zmiany wizualne bez zmiany publicznej nazwy

- `menu-burger` / `IconMenuBurger`: kolor źródłowy zmieniono z `#06064D` na
  `#07064E`; nazwa i geometria pozostają bez zmian.
- `sp-arrow` / `IconSpArrow`: zaktualizowano geometrię i identyfikatory SVG;
  nazwa, rozmiar `12 × 12` i kolor `#07064E` pozostają bez zmian.

## Checklista konsumenta

- [ ] Wyszukaj usunięte nazwy w CRM i PWA.
- [ ] Zastąp nazwy zgodnie z tabelą breaking changes.
- [ ] Sprawdź rozmiar, wyrównanie i kolor w stanie default, hover i disabled.
- [ ] Uruchom build oraz testy Angulara albo Reacta właściwe dla aplikacji.
- [ ] Uzupełnij wersję paczki w tym dokumencie przed wydaniem.
