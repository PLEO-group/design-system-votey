# Audyt responsive scaling z `angular-design-system`

Data: 2026-07-22  
Zakres: `ds-responsive-tokens`, breakpointy, device detection, semantic spacing, semantic typography i `ds-text`  
Tryb pracy: analiza read-only; bez zmian w `angular-design-system`, CRM i kodzie Design Systemu Votey

## Wniosek

Do Votey przenosimy mechanikę `ds-responsive-tokens.scss` **1:1**: funkcje, wzór interpolacji, mnożniki oraz selektory `body[data-device]`. Jest to świadoma decyzja wynikająca ze stabilności rozwiązania i potrzeby równoległego utrzymania obu projektów.

Model ma dwie niezależne osie:

1. **breakpoint/viewport** — płynna interpolacja wartości pomiędzy szerokościami referencyjnymi;
2. **device** — `mobile`, `tablet` albo `desktop`, wykryte z User Agenta i zapisane jako `data-device`.

Ten podział pasuje do sześciu trybów Figma Variables Votey. Zachowujemy istniejące zachowanie wzoru bez refaktoryzacji podczas portu. Wartości i role tokenów nadal pochodzą z Votey/Figmy — nie kopiujemy map typografii ani spacingu BoxEs. Różnice i problemy brzegowe traktujemy jako znany baseline odziedziczonego mechanizmu, a nie zakres pierwszego przeniesienia.

## Przeanalizowane pliki

### Mechanizm scalingu i tokenów

- `angular-design-system/libs/design-system/assets/styles/ds-responsive-tokens.scss`;
- `angular-design-system/libs/design-system/tokens/core.json`;
- `angular-design-system/libs/design-system/assets/styles/ds-theming.scss`;
- `angular-design-system/libs/design-system/assets/styles/_ds-device-mixins.scss`;
- `angular-design-system/libs/design-system/assets/tokens-sd/scss/_variables-core.scss` — tylko jako artefakt wygenerowany;
- konfiguracja stylów aplikacji preview w `apps/design-system-preview/project.json`.

### Runtime device

- `libs/design-system/src/lib/services/boxes-device.service.ts`;
- `libs/design-system/src/lib/services/boxes-device.service.spec.ts`;
- inicjalizacja i obsługa `window:resize` w `apps/design-system-preview/src/app/app.component.ts`.

### Typografia i `ds-text`

- `libs/design-system/src/lib/models/boxes-typography.ts`;
- `libs/design-system/src/lib/components/text/text.component.ts`;
- `text.component.html`, `text.component.scss`, `text.component.spec.ts`;
- foundation previews i calculator scalingu wraz z testami.

### Kontekst CRM

- `wyborek-crm/src/styles/texts.scss`;
- użycia `font-size`, `line-height`, inline styles i lokalnych media queries w CRM;
- konfiguracja paczek: CRM używa Angulara 21 i `@pleodigital/design-system-votey`.

## Przepływ wzorcowego systemu

```text
core.json
  ├─ breakpointy
  ├─ core spacing
  └─ primitives typografii
          │
          ▼
Style Dictionary → wygenerowane Sass variables
          │
          ├─ ds-theming.scss → stałe --spacing-* + manifest --space-*
          └─ ds-responsive-tokens.scss
                  ├─ mapy semantic typography
                  ├─ mapy semantic spacing
                  └─ calc(...) per breakpoint i per data-device
                              ▲
                              │
BoxesDeviceService → body[data-device="mobile|tablet|desktop"]
                              │
                              ▼
komponenty / ds-text → var(--space-*) i komplet var(--typo-<role>-*)
```

## Breakpointy

| Breakpoint wzorca | Szerokość | Tryb Figma Variables Votey | Zgodność |
|---|---:|---|---|
| `mobile-small` | 360 | `Mobile 360` | zgodne |
| `mobile` | 375 | `Mobile 375` | zgodne |
| `tablet-small` | 765 | `Tablet 768` | **różnica 3 px** |
| `tablet` | 1024 | `Tablet 1024` | zgodne |
| `laptop` | 1280 | `Laptop 1280` | zgodne |
| `desktop` | 1920 | `Desktop 1920` | zgodne |

W Votey mapowanie nazw jest naturalne:

```text
Mobile 360  → mobile-small
Mobile 375  → mobile
Tablet 768  → tablet-small
Tablet 1024 → tablet
Laptop 1280 → laptop
Desktop 1920 → desktop
```

Votey przyjmuje `tablet-small = 768`, ponieważ jest to rzeczywista szerokość makiety i trybu Variables. Nie narusza to kopiowania mechaniki SCSS 1:1: plik pobiera liczby breakpointów z core tokens, a konkretne wartości core pozostają Votey-specific.

## Jak działa interpolacja

Mixin `responsive-size-token`:

1. wybiera tylko breakpointy jawnie podane dla danego tokenu;
2. wymaga co najmniej dwóch punktów;
3. poniżej pierwszego punktu ustawia wartość pierwszego punktu;
4. pomiędzy każdą parą wylicza linię:

```text
slope = (maxSize - minSize) / (maxWidth - minWidth)
value = slope × viewportWidth + intercept
CSS   = calc(<slope × 100>vw + <intercept>px)
```

5. od ostatniego punktu ustawia wartość ostatniego punktu.

To jest interpolacja odcinkami, nie jeden globalny `clamp()`. Dzięki temu token może zmieniać trend na każdym kolejnym punkcie referencyjnym.

### Ile punktów naprawdę wykorzystuje wzorzec

Silnik obsługuje sześć breakpointów, a calculator dokumentacyjny pozwala podać sześć wartości. Obecne produkcyjne mapy typografii i spacingu podają jednak przeważnie tylko:

- `mobile`;
- `tablet`;
- `desktop`.

Wtedy CSS interpoluje tylko od `375 → 1024 → 1920`. `mobile-small`, `tablet-small` i `laptop` nie biorą udziału w obliczeniu, mimo że istnieją w `$breakpoints`.

W Votey wszystkie sześć wartości jest wejściem interpolacji. Są to breakpointy odpowiadające szerokościom ekranów, dla których istnieją makiety w Figmie: 360, 375, 768, 1024, 1280 i 1920. Nie redukujemy danych projektowych do trzech wartości.

## Jak działa device scaling

Wzorzec ma mnożniki:

| Device | Mnożnik |
|---|---:|
| desktop | `1` |
| tablet | `1.2` |
| mobile | `0.8` |

Dla każdego `body[data-device]` generowana jest osobna wersja tych samych custom properties. Breakpoint pozostaje zależny od szerokości viewportu, a `data-device` wybiera mnożnik.

Przykład konsekwencji:

- desktop z oknem 500 px nadal ma `data-device="desktop"`;
- fizyczny tablet z szerokim viewportem nadal ma `data-device="tablet"`;
- ten sam viewport może więc otrzymać inną wartość tokenu na różnych klasach urządzenia.

Wzorzec normalizuje punkty referencyjne:

- wartość `mobile` jest bazowo związana z mnożnikiem `0.8`;
- `tablet-small` i `tablet` z `1.2`;
- `laptop` i `desktop` są traktowane jako rodzina desktopowa;
- następnie wynik jest przeliczany mnożnikiem aktualnie wykrytego device.

Tryby Figmy są sześcioma punktami szerokości viewportu. Nazwa urządzenia w trybie opisuje makietę referencyjną dla danego breakpointu, ale techniczna klasyfikacja `data-device` pozostaje osobną osią i wybiera mnożnik dokładnie tak jak w `angular-design-system`.

Orientacja jest wykrywana i zapisywana jako `data-orientation`, ale **nie bierze udziału w obliczaniu wartości tokenów**. Może być używana osobno przez selektory komponentów.

## Device detection

`BoxesDeviceService`:

- używa `node-device-detector` i `navigator.userAgent`;
- rozpoznaje smartphone, phablet i feature phone jako `mobile`;
- rozpoznaje tablet oraz dotykowego Macintosha/iPada jako `tablet`;
- wszystko pozostałe klasyfikuje jako `desktop`;
- ustawia na `body`:
  - `data-device`;
  - `data-orientation`;
  - `data-grid-type`;
- przechowuje booleany `isMobileDevice`, `isTabletDevice`, `isDesktopDevice`;
- jest ręcznie wywoływany przez aplikację przy inicjalizacji i każdym `window:resize`.

Ważne: resize nie zmienia klasy urządzenia na podstawie szerokości — ponownie analizowany jest User Agent. Zmieniają się viewport, orientacja i wynik interpolacji CSS.

## Warstwy spacingu

Wzorzec rozdziela:

### Core spacing

- nazwy CSS: `--spacing-4`, `--spacing-8`, …;
- stałe wartości;
- wystawiane w `:root` przez `ds-theming.scss`;
- używane, gdy odstęp nie powinien zależeć od viewportu/device.

### Semantic responsive spacing

- nazwy CSS: `--space-card-padding-x`, `--space-field-gutter`, `--space-section-gap` itd.;
- każda rola ma mapę wartości per breakpoint;
- wynik powstaje w `ds-responsive-tokens.scss`;
- `ds-theming.scss` deklaruje je wcześniej jako `0px`, głównie dla manifestu/autocomplete.

Ten podział jest zgodny z naszym zatwierdzonym modelem Votey: core może być używane jako wartość stała, semantic opisuje rolę i może reagować responsywnie.

## Warstwy typografii

Każda semantic typography group generuje komplet:

- `--typo-<role>-font-size` — responsive;
- `--typo-<role>-line-height` — responsive;
- `--typo-<role>-font-weight` — stałe dla roli;
- `--typo-<role>-letter-spacing` — stałe dla roli.

Role są wpisane do mapy `$semantic-typography-tokens`. Przykłady: `header-xl`, `body`-podobne role danych, `field-label`, `button-label`, `table-header`.

Figma Variables Votey mają ten sam czteroelementowy model dla 14 ról. Brakuje im tylko `font-family`, które dla pierwszej iteracji CRM ma wskazywać Open Sans.

## Rola `ds-text`

`ds-text` nie liczy breakpointów i nie ustawia wartości responsive. Jego główna odpowiedzialność tokenowa to:

1. przyjęcie typowanej nazwy `group`;
2. dodanie klasy odpowiadającej grupie;
3. zastosowanie wszystkich czterech właściwości `--typo-<group>-*` razem.

Dodatkowo komponent obsługuje:

- kolor/italic przez `overwrite`;
- uppercase;
- wielowierszowy ellipsis;
- wrap;
- opcjonalny description tile;
- szczególne zachowanie description tile na mobile.

### Zalety wzorca

- nie da się przypadkiem połączyć font-size z jednej roli z line-height innej;
- TypeScript ogranicza `group` do `BoxesTypographyNames`;
- migracja roli odbywa się przez jedną nazwę;
- komponent może zapewnić wspólne zachowania tekstowe.

### Problemy wzorca

- nazwy grup są utrzymywane w trzech miejscach: TypeScript model, SCSS komponentu i mapa responsive tokens;
- komponent renderuje własne `div`/`span`, więc sam nie zapewnia semantycznych elementów `h1`, `p`, `label` itd.;
- łączy typografię z tooltipem, ellipsis, kolorami i logiką device;
- globalne reguły `h1`–`h4` w `ds-responsive-tokens.scss` dodatkowo nakładają typografię niezależnie od `ds-text`;
- model nie jest automatycznie generowany ze źródła tokenów.

## Propozycja analogicznego rozwiązania dla Votey

Przyjmujemy **typowaną dyrektywę Angular zamiast obowiązkowego komponentu tekstowego**.

Przykładowe docelowe użycie:

```html
<h1 voteyText="h1">Tytuł</h1>
<p voteyText="body">Treść</p>
<span voteyText="caption-s" voteyTextOverwrite="muted">
  Informacja pomocnicza
</span>
<label voteyText="label" voteyTextOverwrite="error">Nazwa pola</label>
```

Dyrektywa:

- zachowuje poprawną semantykę HTML;
- przyjmuje typowaną union wszystkich ról;
- ustawia klasę/atrybut roli;
- pozwala CSS zastosować komplet czterech właściwości;
- nie musi znać ani wykonywać wzoru scalingu;
- obsługuje osobny, typowany input `voteyTextOverwrite`, który nadpisuje kolor lub font-style bez zmiany grupy typograficznej;
- może być opcjonalnym ułatwieniem — tokeny i wygenerowane klasy pozostają używalne bez Angulara.

### Podpowiedzi i walidacja w IDE

Publiczne inputy dyrektywy nie mogą mieć typu ogólnego `string`. Ich wartości będą ograniczone typami union wygenerowanymi z tego samego manifestu ról, z którego powstają CSS custom properties i klasy:

```ts
type VoteyTextRole =
  | 'h1'
  | 'h2'
  | 'body'
  | 'caption-s';

type VoteyTextOverwrite =
  | 'muted'
  | 'error'
  | 'italic';
```

Przy włączonym Angular Language Service i `strictTemplates` IDE może dzięki temu:

- podpowiadać dostępne wartości `voteyText` i `voteyTextOverwrite`;
- zgłaszać literówki oraz wartości spoza kontraktu;
- sprawdzać bindingi przekazujące zmienną, a nie tylko literały w szablonie;
- korzystać z typów również po opublikowaniu biblioteki, o ile paczka dostarcza prawidłowe deklaracje `.d.ts`.

Najpewniejszą postać podpowiedzi daje binding Angulara:

```html
<h1 [voteyText]="'h1'">Tytuł</h1>
<span
  [voteyText]="'caption-s'"
  [voteyTextOverwrite]="'muted'"
>
  Informacja
</span>
```

Skrócona składnia `voteyText="h1"` i `voteyTextOverwrite="muted"` również pozostaje dozwolona i walidowana przez Angular, ale jakość listy podpowiedzi zależy wtedy bardziej od używanej wersji IDE/Angular Language Service. Dlatego dokumentacja może pokazywać krótszą składnię, a test kontraktu biblioteki powinien objąć obie postacie.

Rekomendowana publiczna nazwa to `voteyTextOverwrite`, a nie samo `overwrite`: jest jednoznaczna w szablonie, nie koliduje znaczeniowo z innymi dyrektywami i nadal zachowuje mechanikę znaną z `ds-text`.

Mechanikę `overwrite` z `ds-text` zachowujemy. Rozdział odpowiedzialności będzie następujący:

- `voteyText` wybiera pełną grupę font-size/line-height/font-weight/letter-spacing;
- `voteyTextOverwrite` wybiera semantic text color albo styl `italic`;
- overwrite nie może zmieniać części grupy typograficznej ani wskazywać koloru core;
- wartości inputu są mapowane na semantic color tokens Votey;
- dokładne mapowanie odpowiedników `typo-error`, `typo-valid`, `typo-action`, `typo-light`, `typo-main`, `typo-placeholder` zostanie zatwierdzone razem z konwencją semantic colors — obecny słownik Votey nie ma kompletnego 1:1 dla wszystkich nazw BoxEs.

Ellipsis, wrap i uppercase mogą pozostać osobnymi klasami/dyrektywami albo niezależnymi inputami. Description tile nie należy do podstawowego API typografii.

### Gdzie umieścić Angularową warstwę

Nie rekomenduję dodawania Angulara jako zwykłej zależności głównego entry pointu `@pleodigital/design-system-votey`, ponieważ ten sam pakiet konsumuje React.

Lepsze warianty:

1. secondary entry point `@pleodigital/design-system-votey/angular`; albo
2. osobna mała paczka `@pleodigital/design-system-votey-angular` zależna od bazowej paczki tokenów.

Framework-neutralna paczka nadal publikuje:

- źródła/generowane tokeny;
- `tokens.angular.css`;
- manifest ról i nazw;
- opcjonalne klasy CSS typografii.

Warstwa Angular publikuje jedynie:

- inicjalizację responsive context;
- device detector/service;
- dyrektywę `voteyText`;
- ewentualne mixiny device/orientation.

React nie dostaje nowych zależności Angular ani nie musi używać spacingu/typografii w tej iteracji.

## Co przenieść do Votey

- rozdzielenie `device` i `breakpoint`;
- sześć nazwanych breakpointów;
- liniową interpolację odcinkami;
- core fixed spacing vs semantic responsive spacing;
- czteroelementowe grupy semantic typography;
- `data-device` i `data-orientation` jako kontrakt runtime Angulara;
- typed listę ról generowaną z tego samego manifestu co CSS;
- calculator/podgląd wartości i testy computed style w Storybooku.

## Zakres kopiowania 1:1

Kopiujemy bez zmian funkcjonalnych:

1. `$breakpoints` odwołujące się do core tokens;
2. kolejność breakpointów;
3. mnożniki desktop/tablet/mobile;
4. `responsive-token-size()`;
5. `responsive-token-breakpoints()`;
6. `scaled-responsive-token-size()`;
7. `responsive-size-token()` wraz z obecnym clampem i interpolacją;
8. generowanie zestawów pod `body[data-device="desktop|tablet|mobile"]`.

Votey-specific pozostają:

- wartości breakpointów, w tym `tablet-small = 768`;
- mapy semantic typography i semantic spacing pochodzące z Figma Variables;
- nazwy custom properties;
- semantic text colors używane przez `voteyTextOverwrite`;
- sposób dostarczenia SCSS/CSS do `tokens.angular.css`;
- Angularowa dyrektywa i integracja runtime.

Nie wykorzystujemy map tokenów BoxEs jako źródła wartości Votey. Jeżeli równoległe utrzymanie mechaniki ma być trwałe, warto później ustalić kontrolowany sposób porównywania obu kopii funkcji, ale pierwsze przeniesienie nie zmienia ich treści.

## Znane zachowania brzegowe odziedziczone z formułą

Poniższe obserwacje pozostają udokumentowane, ale zgodnie z decyzją o kopii 1:1 nie poprawiamy ich podczas pierwszego portu. Ewentualna zmiana powinna być osobnym zadaniem wykonanym równolegle w obu projektach.

### 1. Ostatni clamp pomija device multiplier

W ostatnim `@media (min-width: desktop)` ustawiana jest surowa wartość desktop. Tuż przed breakpointem wartość końcowa jest przeskalowana mnożnikiem device. Dla `mobile` lub `tablet` może więc wystąpić skok na granicy 1920 px.

Calculator świadomie odwzorowuje to zachowanie, ale testuje jedynie wartość dla desktopu i nie ma testu ciągłości dla wszystkich device.

### 2. Potencjalna luka pomiędzy zakresami

Zakres kończy się przez `max-width: maxBreakpoint - 1px`, a kolejny zaczyna się od pełnego breakpointu. Przy ułamkowych CSS pixels może istnieć luka np. `1023.5px`.

### 3. Fallbacki breakpointów nie są używane przez aktualny wybór punktów

`responsive-token-size()` potrafi podstawiać `mobile`, `tablet` i `desktop` dla brakujących punktów pośrednich. Jednocześnie `responsive-token-breakpoints()` wybiera tylko klucze jawnie obecne w mapie. Brakujący punkt nie trafia więc do pętli i fallback nie jest wywoływany w normalnym przepływie.

### 4. Dwa źródła breakpointów

Breakpointy istnieją w `core.json`, ale `BoxesDeviceService.deviceDimensions` wpisuje 375/1024/1280/1920 ponownie na sztywno i pomija 360/765. W Votey powinniśmy generować zarówno CSS, jak i ewentualny manifest TypeScript z jednego źródła.

## Rekomendowany kontrakt Votey

```text
Figma Variables
  → synchronizowane źródła tokenów w repo
  → walidowany manifest responsive token
      - role
      - sześć wartości breakpoint
      - typ/jednostka
  → generator
      - tokens.angular.css
      - manifest JSON
      - opcjonalne typy/klasy Angular
  → Angular responsive context ustawia data-device/data-orientation
  → CRM konsumuje var(--space-*) i pełne grupy typography
```

Zasady:

- breakpointy są foundation/configuration tokens; mechanika mnożników pozostaje identyczna z plikiem wzorcowym;
- wartości z Figmy są jawne dla sześciu punktów;
- testy sprawdzają dokładne computed values po obu stronach każdej granicy dla każdego device, w tym odziedziczone zachowanie końcowego clampu;
- CSS ma bezpieczny fallback przed inicjalizacją JavaScript;
- nazwy ról, CSS custom properties i Angular union powstają z jednego manifestu;
- `tokens.angular.css` zawiera wynik scalingu, ale React nie musi go importować;
- device detection pozostaje dodatkiem konsumenta Angular, nie częścią core tokenów.

## Decyzje do podjęcia przed implementacją

- [x] `tablet-small` ma w Votey wartość `768`, zgodną z szerokością makiety i trybem Variables.
- [x] Mechanikę SCSS, w tym mnożniki `desktop=1`, `tablet=1.2`, `mobile=0.8`, przenosimy 1:1.
- [x] Wszystkie sześć wartości Figmy jest wejściem interpolacji.
- [x] Tryby Figmy opisują breakpointy/szerokości makiet; `data-device` pozostaje osobną osią wybierającą mnożnik.
- [ ] Czy device detector ma odwzorować dokładnie `node-device-detector`, czy zachowanie ma być zaimplementowane lżej i z guardem platformy?
- [x] Angular API przyjmuje postać dyrektywy `voteyText`; zachowujemy osobną mechanikę `overwrite` dla semantic text colors i italic.
- [ ] Zatwierdzić rekomendowaną publiczną nazwę inputu `voteyTextOverwrite`; jego wartości będą typowanym union generowanym ze wspólnego manifestu.
- [ ] Zatwierdzić mapowanie wartości `voteyTextOverwrite` na semantic color tokens Votey.
- [ ] Czy warstwa Angular będzie secondary entry pointem czy osobną paczką?
- [ ] Jaki bezpieczny fallback obowiązuje przed ustawieniem `data-device`?
