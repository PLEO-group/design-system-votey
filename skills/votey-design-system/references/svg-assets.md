# SVG i assety Votey

## Źródło i generowanie

Źródłowe ikony są w `assets/icons`, ilustracje w `assets/illustrations`. Nazwa i
folder są kontraktem source-driven: generator `scripts/generate-asset-types.mjs`
tworzy typy i wpisy Angular registry w `angular/src/lib/votey-assets.ts`, a build
tworzy raw SVG dla Angulara i komponenty React. Użyj `npm run generate:asset-types`,
`npm run check:asset-types` oraz pełnego builda adekwatnego do zmiany.

Context, prefix, namespace, modyfikatory, słownictwo, bezpieczeństwo SVG, `viewBox`,
kolory, identyfikatory, duplikaty i literówki definiuje `votey-svg-assets`. Dla
add/audit/rename/move/remove uruchom ten skill jako właściciela workflow, walidacji
i Storybooka. Nie edytuj ręcznie generowanych typów, registry, React exportów ani
`dist`.

## Votey naming contract

Przed zmianą wczytaj `votey-svg-assets/references/icon-naming-system.md`. Folder,
prefix pliku i publiczny namespace muszą opisywać ten sam context — sprzeczność
jest błędem, nie wyjątkiem.

| Typ | Folder | Wzorzec źródła | Angular Registry | React |
| --- | --- | --- | --- | --- |
| Ikona menu | `assets/icons/menu` | `icon_menu_*.svg` | `menu-*` | `IconMenu*` |
| Ikona special | `assets/icons/special` | `icon_sp_*.svg` | `sp-*` | `IconSp*` |
| Ikona UI | `assets/icons/ui` | `icon_ui_*.svg` | `ui-*` | `IconUi*` |
| Logotyp ikony | `assets/icons/logotypes` | `logo_*.svg` | `logo-*` | `IconLogo*` |
| Ilustracja | `assets/illustrations/{background,info,logotypes,simple,spot}` | `illu_bg_`, `illu_info_`, `logo_`, `illu_simple_`, `illu_spot_` | `bg-*`, `info-*`, `logo-*`, `simple-*`, `spot-*` | `IlluBg*`, `IlluInfo*`, `Logo*`, `IlluSimple*`, `IlluSpot*` |

Nazwy są angielskie, lowercase; `_` oddziela segmenty techniczne, `-` słowa
descriptora, a `_thick` i `_v2` są utrzymywanymi modifierami. `simple` jest
contextem ilustracji, nie modifierem ikony. Nowy context, niejednoznaczny
descriptor, kolizja publicznej nazwy albo rename zmieniający znaczenie oznaczają
`STOP & ASK`.

Przed zapisem odrzuć aktywną zawartość SVG, zewnętrzne URL-e i niezweryfikowane
lokalne referencje `id`; potwierdź pojedynczy `<svg>`, `viewBox`, geometrię,
kolory, `clipPath`/mask/gradient, unikalność identyfikatorów i brak duplikatu
znaczenia. Nie recoloruj ani nie optymalizuj assetu bez jawnego polecenia.

Rename lub remove jest potencjalnie breaking: wyszukaj konsumentów, zaplanuj
deprecację/migrację, zbuduj release candidate i nie publikuj bez kompatybilności
zweryfikowanej w konsumentach.

## Użycie publicznego assetu

- Angular: użyj `vt-icon` dla elementu DOM; dla background/mask internali użyj
  publicznego pliku skopiowanego przez build zgodnie z `assetBaseUrl` registry.
  Bootstrapuje go `provideVoteySvgRegistry()` z entry pointu `./angular`.
- React: importuj wygenerowany SVG przez potwierdzony alias konsumenta, zwykle
  `@votey/icons/*` albo `@votey/illustrations/*`. Ikona używa `currentColor`,
  wielokolorowa ilustracja zachowuje fill'e.
- Lokalny SVG, inline SVG, data URI lub kopia publicznej geometrii są wyjątkiem:
  najpierw wskaż sprawdzony publiczny asset, zakres duplikacji, ryzyko i plan
  usunięcia; czekaj na jawną akceptację użytkownika.

Szczegóły integracji, `baseHref`, accessible name i CSS `url()` są w
`angular.md`, `react.md` oraz zachowanej referencji `assets.md`.
