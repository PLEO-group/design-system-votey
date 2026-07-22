# Etap 1 — decyzje kontraktu tokenów

Status dokumentu: aktywny panel decyzji  
Powiązany plan: [token-design-system-work-plan.md](./token-design-system-work-plan.md)  
Zakres bieżący: etap 1, punkt 1 — warstwy tokenów

## Jak pracujemy z tym dokumentem

- Przechodzimy przez jedną warstwę naraz.
- Decyzję oznaczamy jako zatwierdzoną dopiero po akceptacji.
- Nie zmieniamy jeszcze źródeł tokenów, generatora ani `dist`.
- Nazewnictwo ścieżek tokenów i plików rozstrzygamy osobno w punkcie 2 etapu 1.
- Typy, jednostki i szczegóły kompozycji rozstrzygamy w kolejnych punktach etapu 1.
- `angular-design-system` jest wyłącznie wzorcem struktury, pipeline'u i mechanik. Nie kopiujemy z niego nazw, wartości, palet, ról semantic ani liczby tokenów; zawartość Votey wynika z jego Figmy, istniejących konsumentów i decyzji projektowych.

## Punkt 1 — podział na warstwy

### Kolejność decyzji

- [x] 1A — primitives/core
- [x] 1B — semantic tokens
- [x] 1C — light/dark/brand
- [x] 1D — artefakty konsumenckie
- [x] Zamknąć punkt 1 w głównym planie po zatwierdzeniu 1A–1D.

## Stan zastany

| Obszar | Obecny stan |
|---|---|
| Repo Votey — core/base | `tokens/base/colors.json`: 51 tokenów kolorystycznych; brak spacingu, typografii, opacity, radius i parametrów scalingu w źródłach repo |
| Repo Votey — semantic | `tokens/light.json`: 193 tokeny kolorystyczne; `tokens/dark.json`: 194 tokeny kolorystyczne |
| Figma — Variables | 8 kolekcji i 211 Variables, m.in. `base/colors`, `space/core`, `space/semantic`, `type/core`, `type/semantic`, `color/semantic`, `radius/core`, `radius/semantic` |
| Wzorzec `angular-design-system` | przykład działającego podziału na core oraz osobne light/dark, pipeline'u Style Dictionary i publikowanych artefaktów; jego konkretne tokeny nie są wejściem do projektowania Votey |

### Wniosek ze stanu zastanego

Logiczny podział `core → semantic → theme → output` już częściowo istnieje w Votey i Figmie. `angular-design-system` potwierdza jedynie, że taki model może działać w praktyce; nie służy do porównywania ani uzupełniania wartości. Najpierw ustalamy znaczenie warstw. Migracja nazw i struktury plików będzie osobną decyzją, aby nie zepsuć workflow Tokens Studio/Figma → merge request.

---

## Decyzja 1A — primitives/core

### Proponowana definicja

`Core` jest najniższą, niesemantyczną warstwą wartości. Odpowiada na pytanie **„jaka to wartość?”**, a nie **„do czego jej używamy?”**.

Przykłady:

- `color.yellow-25 = #fffcf1`;
- `spacing.16 = 16px`;
- `font.family.open-sans = "Open Sans"`;
- `font.weight.semibold = 600`;
- `opacity.30 = 0.3`;
- `radius.8 = 8px`.

Nazwy w przykładach pokazują znaczenie warstwy, ale nie zatwierdzają jeszcze ostatecznej składni nazw.

### Co należy do core

- nieprzezroczyste palety kolorów;
- osobna skala opacity;
- stałe wartości spacingu;
- primitives typografii: family, weight, size, line height i letter spacing;
- radius;
- parametry potrzebne przez scaling, jeżeli są wartościami technicznymi, a nie rolami UI;
- ewentualne inne surowe wartości wymagane później przez semantic tokens.

### Co nie należy do core

- role UI, np. `surface-primary`, `text-danger`, `button-background-hover`;
- nazwy ekranów, modułów lub produktów CRM/React;
- selektory light/dark/brand;
- aliasy legacy `--app-color-*`;
- gotowe pliki CSS/SCSS/Tailwind;
- kolory z kanałem alpha — kolor core pozostaje opaque, a opacity jest osobnym foundation tokenem.

### Zasady zależności

- semantic tokens mogą wskazywać na core;
- core nie może wskazywać na semantic ani na artefakty konsumenckie;
- light/dark/brand nie zmienia wartości core — zmienia wyłącznie przypisania semantic → core;
- adapter CRM może wystawiać alias legacy wskazujący na semantic, ale alias nie staje się częścią core;
- fizyczna nazwa obecnego zestawu `base/colors` pozostaje na razie bez zmian, dopóki nie sprawdzimy wpływu na Tokens Studio i generowane merge requesty.

### Zasady użycia przez zespoły

- nowy i redesignowany kod powinien preferować semantic tokens;
- CRM może tymczasowo używać core podczas migracji, jeżeli nie istnieje jeszcze zatwierdzony odpowiednik semantic;
- takie użycie core w CRM musi być widoczne w mapowaniu jako dług do późniejszej zamiany;
- React zachowuje obecny kontrakt i nie jest mechanicznie migrowany w tej iteracji;
- bezpośrednie użycie core nie może być sposobem na omijanie decyzji o brakującym semantic tokenie.

### Decyzje do zatwierdzenia

- [x] Używamy nazwy **core** jako oficjalnej nazwy logicznej najniższej warstwy; „primitive” pozostaje synonimem opisowym.
- [x] Core obejmuje color, opacity, spacing, typography primitives, radius oraz techniczne parametry scalingu.
- [x] Core nie zawiera ról UI, motywów, aliasów produktowych ani artefaktów builda.
- [x] Core colors są zawsze nieprzezroczyste; alpha powstaje ponad core przez osobną skalę opacity.
- [x] Semantic może zależeć od core, ale core nigdy nie zależy od semantic.
- [x] W nowym/redesignowanym kodzie preferujemy semantic; bezpośrednie core jest dozwolone w CRM jako jawnie śledzony etap migracji lub uzasadniony wyjątek.
- [x] Nie zmieniamy jeszcze fizycznej nazwy `tokens/base/colors.json` ani zestawu `base/colors`; decyzja wymaga audytu workflow Tokens Studio i należy do konwencji/struktury źródeł.

### Rekomendacja

Zatwierdzić wszystkie powyższe zasady 1A. Wykorzystują sprawdzony wzorzec rozdzielenia warstw, ale ich zawartość pozostaje specyficzna dla Votey. Zachowują obecny workflow kolorów zespołu React i pozwalają migrować CRM stopniowo bez uznawania core za docelowe API dla kodu produktowego.

### Notatki po decyzji

- Data: 2026-07-22
- Status: zatwierdzona
- Uwagi: wszystkie zasady 1A zaakceptowane bez wyjątków.

---

## Decyzja 1B — semantic tokens

### Proponowana definicja

`Semantic` jest warstwą znaczenia i zastosowania. Odpowiada na pytanie **„jaką rolę ta wartość pełni w interfejsie?”**, bez ujawniania konkretnego koloru, liczby ani frameworka.

Przykłady:

- `color.surface.warning`;
- `color.text.danger`;
- `color.border.interactive-hover`;
- `color.icon.inactive`;
- `spacing.layout.section-gap`;
- `typography.heading.medium`.

Przykłady pokazują role, ale nie zatwierdzają jeszcze ostatecznej składni nazw.

### Co należy do semantic

- role ogólne UI, np. surface, text, border, icon, status i action;
- stabilne role komponentowe, jeżeli opisują kontrakt komponentu, np. button background/hover/disabled;
- role spacingu i typografii tylko wtedy, gdy mają potwierdzone znaczenie, a nie są kopią wartości core;
- role shadow, overlay, border i surface wykorzystujące opacity;
- tokeny, których znaczenie pozostaje takie samo niezależnie od light/dark/brand, nawet jeśli ich wartość core zmienia się między motywami.

### Co nie należy do semantic

- nazwy wartości, np. `blue-400`, `16px`, `opacity-30`;
- nazwy technologii lub frameworków, np. Angular, React, SCSS, Tailwind;
- nazwy konkretnego ekranu lub jednorazowego miejsca użycia;
- aliasy legacy `--app-color-*`;
- wygenerowane pliki i selektory motywów;
- token utworzony wyłącznie dlatego, że w kodzie wystąpiła nowa surowa wartość — najpierw trzeba potwierdzić jego rolę.

### Zasady zależności

- semantic wskazuje na core;
- w pierwszej iteracji semantic nie tworzy łańcuchów semantic → semantic; każdy token ma bezpośrednie, możliwe do audytu przypisanie do core;
- light/dark/brand dostarcza różne przypisania tej samej semantic identity do core;
- ścieżka semantic opisuje rolę, dlatego nie zawiera nazwy motywu ani wartości;
- aliasy CRM wskazują na semantic w adapterze konsumenckim, ale nie są częścią semantic layer.

### Zasady projektowania ról

- najpierw sprawdzamy, czy istniejący semantic token rzeczywiście ma tę samą rolę; zgodność samej wartości nie wystarcza;
- nowy semantic token powstaje, gdy istnieje trwała, powtarzalna rola UI albo świadomie publiczny kontrakt komponentu;
- role ogólne preferujemy przed komponentowymi, ale nie zmuszamy dwóch różnych znaczeń do wspólnego tokenu tylko dlatego, że dziś mają tę samą wartość;
- token używany początkowo tylko w CRM może wejść do wspólnej warstwy semantic, jeśli jego nazwa i znaczenie są produktowo neutralne i potencjalnie reużywalne;
- jednorazowy, produktowy wyjątek pozostaje jawnie opisanym wyjątkiem/adapterem, a nie „wspólnym” semantic tokenem;
- semantic alpha colors nazywamy według roli, np. shadow lub overlay, nie według procentu opacity.

### Zasady użycia przez zespoły

- semantic jest domyślnym API dla nowego i redesignowanego kodu Angular i React;
- w bieżącej iteracji nie migrujemy mechanicznie istniejącego Reacta ani jego spacingu, typografii i `rv-*`;
- migrowane użycie CRM przechodzi z `--app-color-*` bezpośrednio na właściwy semantic token;
- jeżeli semantic tokenu brakuje, można tymczasowo użyć core zgodnie z decyzją 1A, ale użycie musi być zapisane jako dług i nie może automatycznie tworzyć przypadkowej roli semantic.

### Decyzje do zatwierdzenia

- [x] Semantic jest oficjalną warstwą znaczenia i domyślnym API dla kodu produktowego.
- [x] Semantic obejmuje role ogólne UI oraz stabilne role komponentowe, a nie nazwy wartości, technologii czy jednorazowych ekranów.
- [x] W pierwszej iteracji każdy semantic token wskazuje bezpośrednio na core; nie tworzymy łańcuchów semantic → semantic.
- [x] Ta sama semantic identity istnieje niezależnie od motywu; light/dark/brand zmienia jedynie jej przypisanie do core.
- [x] Zgodność wartości nie wystarcza do współdzielenia tokenu — musi zgadzać się rola.
- [x] Token tylko dla CRM może wejść do semantic, jeśli ma neutralną, trwałą i potencjalnie reużywalną rolę; jednorazowe wyjątki produktowe nie trafiają do wspólnej warstwy.
- [x] Semantic alpha colors nazywamy według roli (`shadow`, `overlay`, `border`, `surface`), a nie według procentu opacity.
- [x] Nowy i redesignowany kod używa semantic; tymczasowe użycie core jest śledzonym wyjątkiem zgodnie z 1A.

### Rekomendacja

Zatwierdzić wszystkie zasady 1B. Chronią one przed utożsamianiem „ten sam hex” z „tym samym znaczeniem”, utrzymują czytelne referencje core → semantic i pozwalają zachować obecne API Reacta podczas stopniowej migracji CRM.

### Notatki po decyzji

- Data: 2026-07-22
- Status: zatwierdzona
- Uwagi: wszystkie zasady 1B zaakceptowane bez wyjątków.

## Decyzja 1C — light/dark/brand

### Proponowana definicja

Light, dark i ewentualne brand variants są **zestawami przypisań semantic → core**, a nie osobnymi słownikami nazw. Semantic identity pozostaje stała, a zmienia się jej wartość wynikowa.

Przykład logiczny:

```text
color.surface.primary
  light → color.white
  dark  → color.navy-blue-900
```

Przykład nie zatwierdza ostatecznej nazwy tokenu ani wartości.

### Stan zastany istotny dla decyzji

- `tokens/light.json` i `tokens/dark.json` są źródłami semantic colors;
- obecnie light ma 193 ścieżki, a dark 194, więc kontrakt nie jest identyczny — to defekt do naprawienia i zabezpieczenia testem;
- build publikuje light pod `:root`, a dark pod `:root[data-theme="dark"]`;
- React importuje oba pliki i przełącza `data-theme`;
- React ma lokalny `tokens.samsung.css`, aktywowany przez `data-wyborek-browser="samsung"`, który wymusza light i nadpisuje wybrane zmienne;
- Samsung override jest profilem kompatybilności konkretnej przeglądarki, a nie wariantem brand.

### Zasady light/dark

- light jest domyślnym appearance mode;
- dark nadpisuje wartości tych samych semantic identities;
- light i dark muszą mieć identyczny zestaw ścieżek, typów i ról;
- theme source zawiera referencje do core, nie powielone surowe wartości;
- dodanie semantic tokenu wymaga zdefiniowania go we wszystkich wspieranych appearance modes w tym samym merge requeście;
- brak wartości dla jednego mode jest błędem builda, nie fallbackiem do przypadkowej wartości;
- selektor dark pozostaje kompatybilny z obecnym Reactem: `:root[data-theme="dark"]`;
- domyślny light pozostaje kompatybilny z obecnym Reactem: `:root`.

### Zasady brand variants

- brand jest opcjonalnym, niezależnym wymiarem przypisań semantic → core;
- nie tworzymy brand variant bez potwierdzonej potrzeby produktowej i kompletnego mapowania;
- brand zachowuje ten sam semantic contract; nie dodaje nazw specyficznych dla frameworka ani aplikacji do wspólnej warstwy;
- jeżeli brand ma wspierać light i dark, każda wspierana kombinacja musi być jawna i testowana — nie składamy jej przez niekontrolowaną kolejność CSS;
- obecnie nie dodajemy nowego brand mode tylko po to, aby odwzorować Samsung override.

### Zasady Samsung compatibility override

- w pierwszej iteracji zachowujemy istniejące zachowanie Reacta bez zmian wizualnych;
- nie klasyfikujemy `tokens.samsung.css` jako brand theme;
- nie przenosimy go automatycznie do core ani semantic source;
- w etapie 3 audytujemy jego wartości i kolejność nadpisań względem light/dark;
- ewentualne przeniesienie do paczki wymaga osobnej decyzji po regresji Reacta;
- wybór motywu Design Systemu nie powinien zależeć od user agenta; Samsung pozostaje jawnie opisanym wyjątkiem kompatybilności konsumenta.

### Zakres innych kategorii tokenów

- light/dark/brand dotyczy przede wszystkim semantic colors i innych wartości rzeczywiście zależnych od appearance/brand;
- fixed core spacing, font family, font weight i radius nie zmieniają się przez light/dark;
- responsive spacing, typography i scaling są osobnym wymiarem breakpoint/mode, a nie częścią light/dark/brand.

### Decyzje do zatwierdzenia

- [x] Light/dark/brand są zestawami przypisań semantic → core; nie zmieniają semantic identity.
- [x] Light i dark muszą mieć identyczne ścieżki, typy oraz role; różnica 193/194 jest defektem do usunięcia i zabezpieczenia testem.
- [x] Light pozostaje domyślnym `:root`, a dark używa `:root[data-theme="dark"]`, aby zachować kontrakt Reacta.
- [x] Nowy semantic token musi otrzymać jawne przypisanie we wszystkich wspieranych appearance modes w tym samym merge requeście.
- [x] Brand jest opcjonalnym, niezależnym wymiarem; dodajemy go dopiero dla potwierdzonej potrzeby, z tym samym semantic contract i testami wszystkich wspieranych kombinacji.
- [x] `tokens.samsung.css` nie jest brand theme; w pierwszej iteracji pozostaje wyjątkiem kompatybilności Reacta i podlega osobnemu audytowi/regresji.
- [x] Fixed spacing, typograficzne core i radius nie zależą od light/dark; responsive spacing/typography/scaling korzystają z osobnego wymiaru breakpoint/mode.
- [x] Brak wartości w jednym wspieranym mode jest błędem builda, a nie niejawnym fallbackiem.

### Rekomendacja

Zatwierdzić wszystkie zasady 1C. Zachowują obecne selektory Reacta, formalizują identyczny kontrakt light/dark i nie mieszają prawdziwych brand variants z technicznym obejściem dla Samsung Internet.

### Notatki po decyzji

- Data: 2026-07-22
- Status: zatwierdzona
- Uwagi: wszystkie zasady 1C zaakceptowane bez wyjątków.

## Decyzja 1D — artefakty konsumenckie

### Proponowana definicja

Artefakty konsumenckie są **wyłącznie wygenerowanymi wynikami** dopasowanymi do sposobu integracji danego konsumenta. Nie są źródłem tokenów i nie wolno ich edytować ręcznie.

```text
Tokens Studio/Figma → merge request → źródłowe JSON-y → Style Dictionary
  → artefakty React
  → jeden artefakt CRM/Angular
  → artefakty dokumentacji i walidacji
```

### Stan zastany

React importuje publiczne ścieżki:

- `dist/css/tokens.css` — obecne core colors;
- `dist/css/tokens.light.css` — light semantic colors;
- `dist/css/tokens.dark.css` — dark semantic colors;
- `dist/css/tokens.tailwind.css` — obecne mapowanie Tailwind;
- lokalny `src/styles/tokens.samsung.css` — wyjątek kompatybilności poza paczką.

Paczka publikuje również:

- `dist/scss/_variables_light.scss`;
- `dist/scss/_variables_dark.scss`.

`package.json#main` wskazuje dziś nieistniejący `dist/js/tailwind-preset.js`; żaden z analizowanych konsumentów nie importuje takiego presetu.

CRM docelowo ma importować jedną uzgodnioną ścieżkę:

- `dist/css/tokens.angular.css`.

### Artefakty React — kontrakt chroniony

- w pierwszej iteracji zachowujemy cztery istniejące ścieżki CSS i ich selektory;
- nie zmieniamy nazw istniejących custom properties ani wartości używanych przez React bez osobnej, zaakceptowanej migracji;
- nowe spacing, typography i scaling dla CRM nie są dodawane do Tailwind/`rv-*` Reacta;
- lokalny Samsung override pozostaje po stronie Reacta do czasu osobnej decyzji;
- obecne SCSS traktujemy jako opublikowane artefakty kompatybilności i nie usuwamy ich bez audytu użyć oraz właściwego SemVer.

### Artefakt CRM/Angular

`dist/css/tokens.angular.css` jest jednym wygenerowanym entry pointem i w pierwszej iteracji zawiera, w kontrolowanej kolejności:

1. core colors potrzebne do migracji;
2. core opacity, spacing, typography, radius i parametry scalingu wymagane przez CRM;
3. domyślne light semantic colors;
4. semantic spacing, typography, shadow/overlay i inne role wdrażane w CRM;
5. reguły/scaling wymagane do obliczenia responsywnych wartości;
6. przejściowe aliasy `--app-color-*` wskazujące na semantic tokens.

Zasady:

- CRM importuje ten jeden plik w konfiguracji buildu przed `src/styles.scss`;
- plik nie zawiera Reactowego Tailwind/`rv-*`;
- plik nie zawiera dark mode w pierwszej iteracji, ponieważ CRM nie ma obecnie potwierdzonego mechanizmu dark theme; dodanie dark będzie kompatybilnym rozszerzeniem dopiero po osobnej decyzji;
- aliasy CRM są sekcją adaptera, nie częścią core ani semantic source;
- plik jest generowany deterministycznie i nie może zawierać ręcznych poprawek.

### Artefakty dokumentacji i walidacji

- Storybook czyta wygenerowane artefakty, a nie osobne ręcznie utrzymywane wartości;
- build tworzy machine-readable manifest publicznych nazw, typów, źródeł i statusu deprecated;
- test manifestu wykrywa usunięcie/zmianę publicznego kontraktu;
- dwa buildy z tego samego źródła muszą wygenerować identyczne pliki;
- paczka publikuje wyłącznie jawnie zadeklarowane pliki z `dist` i weryfikuje ich istnienie przed publikacją.

### Kontrakt paczki npm

- źródłowe JSON-y nie są importowane przez aplikacje jako runtime API;
- publiczne subpathy artefaktów muszą być stabilne i testowane;
- nie tworzymy pustego lub fikcyjnego pliku tylko po to, aby spełnić błędny wpis `main`;
- w etapie 1 naprawiamy `package.json#main` i definiujemy jawny kontrakt eksportów zgodny z rzeczywistymi artefaktami;
- zmiana lub usunięcie publicznej ścieżki podlega przyjętej polityce SemVer.

### Decyzje do zatwierdzenia

- [x] Artefakty konsumenckie są wyłącznie generowane z zatwierdzonych źródeł i nigdy nie są edytowane ręcznie.
- [x] W pierwszej iteracji zachowujemy cztery istniejące pliki CSS Reacta oraz ich publiczne ścieżki i selektory.
- [x] Nie dodajemy CRM-owego spacingu, typografii ani scalingu do Tailwind/`rv-*` Reacta.
- [x] CRM importuje tylko `dist/css/tokens.angular.css`, wygenerowany przed `src/styles.scss` i zawierający pełny potrzebny kontrakt wraz z adapterem aliasów.
- [x] `tokens.angular.css` jest w pierwszej iteracji light-only; dark dla CRM dodamy dopiero po potwierdzeniu potrzeby i mechanizmu motywu.
- [x] Opublikowanych plików SCSS nie usuwamy bez audytu użyć i właściwego SemVer, ale CRM nie integruje się przez SCSS.
- [x] Storybook i testy korzystają z wygenerowanych wyników; dodajemy machine-readable manifest publicznego API i test deterministyczności.
- [x] Nie tworzymy fikcyjnego `dist/js/tailwind-preset.js`; naprawiamy błędny `main` i definiujemy jawne, testowane eksporty rzeczywistych artefaktów.
- [x] Źródłowe JSON-y nie są runtime API aplikacji; stabilnym kontraktem konsumentów są zadeklarowane artefakty `dist`.

### Rekomendacja

Zatwierdzić wszystkie zasady 1D. Chronią działający import Reacta, dają CRM jeden kontrolowany CSS i rozdzielają źródła tokenów od wyników publikowanych dla frameworków.

### Notatki po decyzji

- Data: 2026-07-22
- Status: zatwierdzona
- Uwagi: wszystkie zasady 1D zaakceptowane bez wyjątków.

---

## Podsumowanie zamkniętego punktu 1

Przyjęty przepływ warstw:

```text
core
  ↓
semantic identity + przypisania light/dark/ewentualny brand
  ↓
wygenerowane, stabilne artefakty konsumenckie
```

- Core przechowuje surowe, niesemantyczne wartości i opaque colors.
- Semantic jest domyślnym API ról UI i wskazuje bezpośrednio na core.
- Light/dark/brand zmienia przypisania semantic → core, nie nazwy ani znaczenie semantic tokens.
- React zachowuje dotychczasowe artefakty; CRM otrzymuje jeden light-only `dist/css/tokens.angular.css`.
- Źródła i wygenerowane artefakty mają rozdzielone odpowiedzialności; `dist` nie jest edytowany ręcznie.
- Szczegóły nazw, typów, jednostek, kompozycji opacity oraz implementacji pipeline'u pozostają do kolejnych punktów etapu 1.

---

## Punkt 2 — konwencja nazw

Status: zakończony — zinwentaryzowano konwencję repo oraz wszystkie 211 natywnych Figma Variables i zatwierdzono decyzje 2A–2E.

Pełny raport: [figma-variable-naming-audit.md](./figma-variable-naming-audit.md).

### Obecna konwencja core

Core istnieje w repo obecnie tylko dla kolorów.

| Reprezentacja | Wzorzec | Przykład |
|---|---|---|
| Token set / plik | `base/colors` | `tokens/base/colors.json` |
| Ścieżka źródłowa JSON | `color.<family>-<step>` | `color.navy-blue-800` |
| Potwierdzona nazwa Figma Variable | `color/<family>-<step>` | `color/blue-25` |
| CSS custom property | `--color-<family>-<step>` | `--color-navy-blue-800` |
| SCSS variable | `$color-<family>-<step>` | `$color-navy-blue-800` |

Właściwości obecnego core:

- pierwszy segment określa kategorię: `color`;
- rodzina i stopień są połączone w jednym segmencie, np. `navy-blue-800`;
- nazwy są prawie zawsze lowercase kebab-case;
- wartości są literalnymi kolorami, bez referencji do semantic;
- skala używa kroków takich jak `25`, `50`, `70`, `100`, `200` itd., ale nie każda rodzina ma te same stopnie;
- `white` jest wyjątkiem bez numeru;
- `active-green` jest nazwą częściowo semantyczną w warstwie core i wymaga późniejszej oceny;
- repo nie ma jeszcze źródłowej konwencji nazw dla core opacity, spacing, typography, radius ani scalingu;
- Figma używa obecnie mieszanych nazw kolekcji, m.in. `base/colors`, `space/core`, `type/core`, `radius/core`, więc nie ma jeszcze jednej wspólnej składni kategorii.
- native Variables wnoszą robocze konwencje dla spacingu, typografii i radius, ale nie są jeszcze zapisane w źródłowych JSON-ach repo ani połączone z publicznym kontraktem CSS.

### Obecna konwencja semantic

Semantic colors są rozdzielone na osobne pliki wartości light i dark, ale ścieżka tokenu nie zawiera nazwy motywu.

| Reprezentacja | Wzorzec | Przykład |
|---|---|---|
| Token set / plik | osobny plik per appearance mode | `tokens/light.json`, `tokens/dark.json` |
| Ścieżka ogólnej roli | `color.<category>.<role>` | `color.surface.warning` |
| Ścieżka złożonej roli | `color.<category>.<role-or-state>...` | `color.button.background.hover.active` |
| CSS custom property | spłaszczona ścieżka kebab-case | `--color-button-background-hover-active` |

Obecne główne grupy semantic:

- `color.surface.*`;
- `color.alert.*`;
- `color.text.*`;
- `color.border.*`;
- `color.icon.*`;
- `color.button.*`;
- `color.gradient.*`;
- `color.controls.*`.

Właściwości obecnego semantic:

- każda wartość semantic wskazuje bezpośrednio na token `color.*` z core;
- nie ma obecnie łańcuchów semantic → semantic;
- nazwy są niezależne od Angulara, Reacta, CSS i Tailwinda;
- token identity nie zawiera `light` ani `dark`; tryb wynika z pliku/token setu;
- Style Dictionary spłaszcza wszystkie segmenty do kebab-case w CSS/SCSS;
- ścieżki mają różną głębokość: od 3 do 5 segmentów;
- role ogólne i komponentowe są wymieszane w jednej warstwie;
- light i dark nie mają obecnie identycznego zestawu nazw: 2 ścieżki występują tylko w light, a 3 tylko w dark.

### Niespójności i wyjątki obecnego nazewnictwa

- camelCase występuje w segmentach `activeHover` i `handUp`, mimo dominującego kebab-case;
- część nazw opisuje wartość lub wygląd zamiast roli, np. `dark`, `navy`, `purple`, `blueish`, `ashy-gray`, `lighter-navy`, `plain-navy`;
- występują nieprecyzyjne lub problematyczne nazwy, np. `lavenda`;
- kolejność wariantu i stanu nie jest jednolita, np. wielosegmentowe `button.background.hover.active` oraz pojedyncze `controls.*.border.activeHover`;
- segment `brand` wewnątrz semantic path oznacza dziś rolę UI, nie brand mode, co może być mylące bez jawnej reguły;
- `dark` wewnątrz semantic path oznacza czasem wygląd/rolę, a nie dark mode;
- nazwa kategorii w Figmie (`space`, `type`) nie jest jeszcze zbieżna z terminami używanymi w planie (`spacing`, `typography`);
- fizyczne `base/colors` i logiczne `core` używają różnych nazw warstwy;
- prefiks kategorii jest stosowany nierówno: istnieje w `color/*` core i `space/*`, ale nie występuje w nazwach Variables kolekcji `color/semantic` i `type/semantic`;
- pojedyncze tryby mają trzy konwencje nazwy: `base/colors`, `value` i `Default`;
- wszystkie 211 Variables mają `ALL_SCOPES` i pusty `codeSyntax`, więc Figma nie koduje jeszcze precyzyjnego zakresu użycia ani publicznej nazwy CSS;
- `color/semantic` w native Variables ma 26 nazw, z których tylko 3 mają identyczną ścieżkę w istniejącym light; nie jest to obecnie zamiennik kontraktu 193/194 semantic colors repo;
- `base/colors` ma w native Variables dodatkowy `color/mint-green-1300`, którego nie ma w repo; planowane `color/yellow-25` i `color/yellow-50` nie istnieją jeszcze w żadnym z tych dwóch miejsc;
- typografia nie zawiera `font-family`, a `font-weight` jest przechowywany jako nazwa stylu STRING, nie numeryczna wartość CSS;
- płaskie CSS custom properties tracą informację o granicach segmentów, dlatego różne ścieżki źródłowe mogłyby wygenerować tę samą nazwę — pipeline nie ma jeszcze jawnej walidacji takich kolizji;
- opublikowany `dist` jest niepełny względem źródeł, ale zachowuje ten sam mechanizm transformacji nazw.

### Co już można uznać za działającą regułę

- kategoria tokenu jest pierwszym segmentem;
- core opisuje rodzinę/wartość, semantic opisuje rolę;
- tokeny są framework-neutral;
- źródła używają hierarchii, a CSS/SCSS używa kebab-case;
- appearance mode nie jest częścią semantic identity;
- publiczne nazwy CSS zaczynają się obecnie od `--color-`.

### Panel decyzji punktu 2

W kolumnie **Decyzja** wpisz `approved` albo opisz zmianę. Do zamknięcia punktu 2 potrzebujemy zatwierdzić wszystkie wiersze 2A–2E.

| ID | Co zatwierdzamy | Rekomendowana propozycja | Skutek / przykład | Decyzja                                                                                                    |
|---|---|---|---|------------------------------------------------------------------------------------------------------------|
| **2A** | Format i separatory nazw | Nowe nazwy wyłącznie lowercase kebab-case. Figma używa `/`, JSON zachowuje hierarchię obiektów, a CSS spłaszcza ścieżkę myślnikami. Zakaz nowych segmentów camelCase. | `color/button/background/primary/hover` → `color.button.background.primary.hover` → `--color-button-background-primary-hover`. | **APPROVED** |
| **2B** | Nazwy kategorii spacingu i typografii | Rozróżnić stały core spacing jako `spacing/<wartość>` od responsive semantic spacing jako `space/<rola>`. Core typografii pozostawić w kategoriach właściwości (`font-size`, `line-height`, `letter-spacing`, `font-weight`, `font-family`), a pełne role semantic zapisywać jako `typography/<rola>/<właściwość>`. Publiczny CSS semantic typography używa krótszego prefiksu `--typo-*`. | `spacing/16` → `--spacing-16`; `space/page-margin` → `--space-page-margin`; `typography/h1/font-size` → `--typo-h1-font-size`. Pasuje to do mechaniki przenoszonej 1:1 z `angular-design-system`, bez kopiowania jego wartości. | **APPROVED** |
| **2C** | Pełna ścieżka i miejsce informacji o warstwie | Nazwa tokenu zawiera pełną kategorię niezależnie od nazwy kolekcji. `core`/`semantic` oraz `light`/`dark` wynikają z token setu lub kolekcji i nie są częścią token identity. Core color zachowuje obecną składnię `<family>-<step>`, aby nie łamać kontraktu. | `base/colors` + `color/navy-blue-800`; `color/semantic` + `color/text/primary`. Nie tworzymy nazw typu `semantic/color/text/primary` ani `dark/color/text/primary`. | **APPROVED** |
| **2D** | Budowa nazw semantic | Zalecana kolejność: `kategoria → element/rola → właściwość → wariant → stan`, maksymalnie pięć segmentów bez uzasadnionego wyjątku. Nazwa opisuje użycie, nie wartość, framework, ekran ani appearance mode. Role ogólne mają pierwszeństwo; komponentowe dodajemy, gdy znaczenia nie da się bezpiecznie współdzielić. | `color/button/background/primary/hover`; `color/text/error`; `radius/table-row`; bez nazw typu `blueish`, `angular-*`, `crm-dashboard-*` czy `*-dark` opisującego motyw. | **APPROVED** — przygotować mapę zmian `votey-user-app`: obecna nazwa → nowa skorygowana nazwa. |
| **2E** | Istniejące nazwy Reacta i legacy | Nie wykonujemy masowego rename istniejącego publicznego API Reacta. Nowa reguła obowiązuje nowe tokeny i kontrolowane migracje. Istniejącej identity nie duplikujemy tylko po to, aby poprawić nazwę. Rename wymaga mapowania, okresu migracji, testów konsumenta i decyzji SemVer. | `activeHover`, `handUp`, `lavenda` i inne wyjątki pozostają chronionym legacy do osobnej migracji; nie tworzymy automatycznie równoległych synonimów. | **APPROVED** — przygotować zbiorczy plik zmian do przekazania zespołowi React. |

### Checklista zatwierdzenia punktu 2

- [x] 2A — format i separatory nazw.
- [x] 2B — nazwy kategorii spacingu i typografii.
- [x] 2C — pełna ścieżka oraz rozdzielenie identity od warstwy/mode.
- [x] 2D — budowa nazw semantic.
- [x] 2E — zasady kompatybilności i legacy.
- [x] Po zatwierdzeniu 2A–2E zamknąć punkt 2 w głównym planie.

### Artefakt wymagany przez decyzje 2D–2E

Przed zmianą istniejącej nazwy używanej przez React powstanie [react-color-token-renaming-map.md](./react-color-token-renaming-map.md). Dokument ma zawierać co najmniej:

- obecną ścieżkę tokenu i publiczną nazwę CSS;
- proponowaną canonical identity i nową nazwę CSS;
- powód zmiany oraz klasyfikację niezgodności z 2A–2D;
- liczbę i lokalizacje użyć w `votey-user-app`;
- wpływ na light/dark i ewentualny alias przejściowy;
- status decyzji zespołu React, wersję migracyjną i status wdrożenia.

Mapa jest materiałem do uzgodnienia migracji, a nie zgodą na automatyczny rename. Do czasu akceptacji konkretnego wiersza istniejąca nazwa pozostaje chronionym kontraktem zgodnie z 2E.

### Tematy świadomie poza decyzją punktu 2

Poniższe kwestie są już rozpoznane, ale nie blokują zatwierdzenia konwencji nazw:

- dokładne typy i jednostki — punkt 3 etapu 1;
- nazwy i kompozycja opacity oraz shadow/elevation — kolejne punkty etapu 1;
- kierunek synchronizacji Tokens Studio ↔ native Figma Variables ↔ repo — prace nad pipeline’em;
- mapowanie 26 native semantic colors na kontrakt Reacta — etapy 2–3;
- scope’y i WEB `codeSyntax` Variables — etap 2;
- dokładne mapowanie `voteyTextOverwrite` na semantic colors — etap kolorów i scalingu.

---

## Punkt 3 — typy i jednostki

Status: zakończony — zatwierdzono decyzje 3A–3I; nie zmieniono jeszcze źródeł tokenów, Variables ani `dist`.

### Kontekst

- Repo używa obecnie Style Dictionary `3.9.2` i formatu Tokens Studio z polami `value`/`type`; dokładną migrację składni źródeł ustalimy podczas prac nad pipeline’em.
- Native Figma Variables przechowują kolory jako `COLOR`, wartości wymiarowe jako `FLOAT`, a obecne font-weight jako `STRING`.
- Sam `FLOAT` w Figmie nie niesie jednostki, dlatego mapowanie Variable → token repo musi mieć jawny kontrakt jednostki.
- Poniższe decyzje dotyczą znaczenia i publicznego wyniku tokenu. Nie przesądzają jeszcze technicznej składni DTCG ani wersji Style Dictionary.

### Panel decyzji punktu 3

W kolumnie **Decyzja** wpisz `approved` albo opisz zmianę. Do zamknięcia punktu 3 potrzebujemy zatwierdzić wiersze 3A–3I.

| ID | Typ / zakres | Rekomendowana propozycja | Skutek / przykład | Decyzja           |
|---|---|---|---|-------------------|
| **3A** | Color | Typ `color`. Opaque core zapisujemy jako lowercase 6-digit HEX `#rrggbb`; semantic color jest referencją zachowującą typ `color`. Alpha nie trafia do core i zostanie zdefiniowana w kolejnych punktach. | Core: `#1e795f`; semantic: `{color.mint-green-1300}`. Nie używamy skrótu `#fff`, uppercase ani alpha HEX w core. | **APPROVED** |
| **3B** | Ogólny dimension | Wszystkie wielkości fizyczne mają typ `dimension` i jawną jednostkę `px` w źródle kodowym. Dotyczy to spacingu, radiusu, breakpointów, font-size, line-height i letter-spacing. Figma `FLOAT` jest interpretowany jako px tylko przez jawne mapowanie kolekcji. | `16` w Figma `space/core` ↔ `16px` w kontrakcie repo/CSS. Nie publikujemy bezjednostkowego `16` jako CSS dimension. | **APPROVED** |
| **3C** | Font family | Typ `fontFamily`; pierwszy core token to `font-family/open-sans`. Wartość projektowa to `Open Sans`, a fallbacki przeglądarkowe są odpowiedzialnością adaptera CSS, nie nazwą rodziny w Figmie. | Figma: `Open Sans`; CSS może wygenerować `--font-family-open-sans: "Open Sans", Arial, sans-serif`. | **APPROVED** |
| **3D** | Font weight | Typ `fontWeight`; canonical value jest liczbą CSS, nie nazwą stylu: light `300`, regular `400`, semibold `600`, bold `700`, extrabold `800`. Adapter Figmy mapuje liczby na nazwy stylów fontu. | `font-weight/semibold = 600`; Figma może prezentować `SemiBold`, ale repo i CSS publikują `600`. | **APPROVED** |
| **3E** | Font size | Typ `dimension`, jednostka `px`; tokeny core reprezentują jawne, stałe wartości. Semantic role ma w każdym z 6 trybów Figmy jawny alias do wybranego core `font-size/*`; nie jest on dobierany automatycznie. | `font-size/16 = 16px`; sześć aliasów `typography/body/font-size` tworzy punkty referencyjne, pomiędzy którymi generator wylicza płynną interpolację responsive. | **APPROVED** |
| **3F** | Line height | Typ `dimension`, jednostka `px`, ponieważ obecne wartości Figmy są absolutne i uczestniczą w responsive scalingu. Nie przechodzimy teraz na unitless ratio. | `line-height/22 = 22px`; wynik responsive może być `calc(...)` w px. | **APPROVED** |
| **3G** | Letter spacing | Typ `dimension`, jednostka `px`, włącznie z zerem zapisywanym jako `0px`. Nie używamy teraz `%` ani `em`, aby nie zmieniać znaczenia obecnych Variables. | `letter-spacing/0 = 0px`. | **APPROVED** |
| **3H** | Liczby bez jednostki | Typ `number` rezerwujemy dla rzeczywiście bezjednostkowych parametrów, np. mnożników device scalingu. Nie używamy go dla spacingu ani typografii wymiarowej. | `scaling/device/mobile = 0.8`; nie `spacing/16 = 16`. | **APPROVED** |
| **3I** | Semantic typography group | Każda rola jest grupą osobnych, typowanych tokenów: `font-family`, `font-size`, `line-height`, `font-weight`, `letter-spacing`. Nie zapisujemy jej jako jednego niepodzielnego composite, ponieważ rozmiar i line-height są generowane responsywnie, a pozostałe właściwości są stałe. | `typography/h1/*` generuje komplet `--typo-h1-*`; `voteyText="h1"` stosuje cały komplet razem. | **APPROVED** |

### Checklista zatwierdzenia punktu 3

- [x] 3A — color.
- [x] 3B — ogólny dimension i jednostka px.
- [x] 3C — font family.
- [x] 3D — font weight.
- [x] 3E — font size.
- [x] 3F — line height.
- [x] 3G — letter spacing.
- [x] 3H — number bez jednostki.
- [x] 3I — struktura semantic typography group.
- [x] Po zatwierdzeniu 3A–3I zamknąć punkt 3 w głównym planie.

### Tematy świadomie poza decyzją punktu 3

- skala opacity i składanie core color + opacity — następne punkty etapu 1;
- reprezentacja alpha/RGBA pomiędzy Figmą, Tokens Studio i Style Dictionary — osobny punkt etapu 1;
- pełny token shadow/elevation — osobny punkt etapu 1;
- dokładna składnia DTCG, upgrade Style Dictionary i transformy — prace implementacyjne nad pipeline’em;
- responsive wzór `calc(...)` i device detection — etap 7;
- wartości poszczególnych tokenów — audyt i mapowanie Figmy w etapie 2.

---

## Punkt 4 — foundation opacity i semantic alpha colors

Status: zakończony — zatwierdzono decyzje 4A–4H; bez zmian w źródłach, Figmie i `dist`.

### Stan wejściowy

W CRM potwierdzono:

- 4 primitives zapisane jako 8-digit alpha HEX;
- 65 wystąpień `rgba()` reprezentujących 22 unikalne wartości;
- 18 wystąpień `color-mix(... transparent)` reprezentujących 10 unikalnych formuł;
- role obejmujące shadow, overlay, border, outline, surface, gradient i loader;
- alpha używane w kodzie obejmuje m.in. `0`, `2`, `5`, `6`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `20`, `30`, `35`, `50`, `68`, `78` i `90%`.

Nie każda znaleziona wartość automatycznie stanie się foundation tokenem. Najpierw musi należeć do zatwierdzonej semantic recipe albo do uzasadnionego wyjątku migracyjnego.

### Panel decyzji punktu 4

W kolumnie **Decyzja** wpisz `approved` albo opisz zmianę. Punkt 4 definiuje model logiczny; dokładny zapis techniczny jest przedmiotem punktu 6.

| ID | Co zatwierdzamy | Rekomendowana propozycja | Skutek / przykład | Decyzja |
|---|---|---|---|---|
| **4A** | Typ, nazwa i zakres wartości opacity | Foundation używa ścieżek `opacity/<procent>`, typu `number` i canonical values od `0` do `1`. Liczba w nazwie oznacza procent dla człowieka. Wartości są bezjednostkowe. | `opacity/8 = 0.08`, `opacity/30 = 0.3`, `opacity/100 = 1`. CSS alpha otrzymuje `0.08`, a nie `8px` ani osobny kolor. | **APPROVED** |
| **4B** | Sposób budowania skali | Nie tworzymy z góry sztucznej pełnej skali. Dodajemy poziom dopiero, gdy jest użyty przez zatwierdzony semantic token albo konieczny do kontrolowanej migracji. Pełna inwentaryzacja CRM jest listą kandydatów, nie automatycznym API. | Powtarzające się `5`, `8`, `10`, `15%` są mocnymi kandydatami; jednorazowe `11` lub `13%` najpierw podlegają klasyfikacji i próbie konsolidacji. | **APPROVED** |
| **4C** | Normalizacja alpha HEX | Wartości wynikające z kanału 8-bit normalizujemy do czytelnego procentu, jeśli różnica jest wizualnie zaakceptowana. Legacy exact pozostaje możliwym wyjątkiem migracyjnym, ale nie tworzymy nazw `opacity/7-843`. | `#00000014` (`7.843%`) → kandydat `opacity/8`; `#1517524d` (`30.196%`) i `#29fa7f4e` (`30.588%`) → kandydat `opacity/30`; `#157d4000` → `opacity/0`. | **APPROVED** |
| **4D** | Logiczna kompozycja semantic alpha color | Semantic alpha color składa się z dokładnie dwóch jawnych referencji: opaque core color + foundation opacity. Nie wskazuje na alpha HEX primitive ani na inny semantic token. | `color.shadow.soft = color.black + opacity.8`; `color.overlay.loader = color.surface-core + opacity.78`. Dokładna serializacja zostanie wybrana w punkcie 6. | **APPROVED** |
| **4E** | Nazewnictwo i użycie przez aplikacje | Nazwa semantic opisuje rolę (`shadow`, `overlay`, `border`, `surface`, `gradient`), nigdy procent. Kod produktowy używa wynikowego semantic color tokenu, a nie składa core + opacity samodzielnie. | `--color-shadow-soft`, nie `--color-black-8` ani `color-mix(var(--color-black), ...)` wpisany lokalnie w komponencie. | **APPROVED** |
| **4F** | Light/dark i brand | Ta sama semantic identity istnieje we wszystkich wspieranych appearance modes. Każdy mode jawnie wybiera core i opacity; oba składniki mogą się różnić, ale brak któregoś jest błędem builda. | `color.overlay.loader` może użyć innego surface core w light i dark, zachowując tę samą nazwę publiczną. CRM nadal publikuje w pierwszej iteracji tylko light zgodnie z 1D. | **APPROVED** |
| **4G** | Transparentne stopnie gradientu | Kolor z opacity `0` nadal zachowuje identity bazowego RGB w recipe. Nie zastępujemy go bezwarunkowo ogólnym `transparent`, ponieważ może to zmienić interpolację gradientu. | `color.overlay.accent.end = color.<green> + opacity.0`; adapter Figmy otrzymuje RGBA z zachowanymi kanałami RGB i alpha `0`. | **APPROVED** |
| **4H** | Granica semantic alpha colors | Do tego modelu trafiają tylko przezroczyste kolory. `opacity` ustawione na całym elemencie, tonalne `color-mix(color, surface)` bez transparent oraz kompletne `box-shadow` nie są automatycznie semantic alpha colors. | Najpierw klasyfikujemy użycie jako color alpha, element opacity, tonal mix albo elevation; dopiero potem wybieramy typ tokenu. | **APPROVED** |

### Checklista zatwierdzenia punktu 4

- [x] 4A — typ, nazwa i zakres opacity.
- [x] 4B — sposób budowania skali.
- [x] 4C — normalizacja wartości legacy.
- [x] 4D — logiczna kompozycja core + opacity.
- [x] 4E — nazewnictwo i API konsumentów.
- [x] 4F — zachowanie light/dark/brand.
- [x] 4G — transparentne stopnie gradientów.
- [x] 4H — granica semantic alpha colors.
- [x] Po zatwierdzeniu 4A–4H zamknąć punkt 4 w głównym planie.

---

## Punkt 5 — walidacja zakazująca alpha w core colors

Status: zakończony — validator opaque core colors działa lokalnie, przed Style Dictionary i w obu workflowach CI/publish.

### Dlaczego punkt 5 wdrażamy przed punktem 6

Zakaz alpha w core nie zależy od wybranego formatu semantic recipe. Możemy najpierw zabezpieczyć nieprzezroczystą paletę, a dopiero później ustalić, jak generować wynik core + opacity dla CSS i Figmy. Obecne `tokens/base/colors.json` nie zawiera alpha, więc walidacja powinna wejść jako bezpieczny guard bez migracji istniejących tokenów.

### Plan wdrożenia

1. **Po zatwierdzeniu 4A–4H:** spisać formalną definicję opaque core color i listę zabronionych reprezentacji.
2. **Pierwszy krok implementacyjny etapu 1:** dodać niezależny validator źródeł uruchamiany przed Style Dictionary.
3. Validator ma odrzucać w core co najmniej:
   - 4- i 8-digit HEX zawierający kanał alpha;
   - `rgba()`/`hsla()` z alpha mniejszym niż `1`;
   - słowo `transparent`;
   - `color-mix(... transparent)` i inne formuły w core;
   - obiektowy kolor z alpha mniejszym niż `1` po przyjęciu formatu DTCG.
4. Dodać testy pozytywne dla 6-digit lowercase HEX i test negatywny dla każdej zabronionej reprezentacji.
5. Podłączyć validator do `build:tokens` **przed** generowaniem `dist`, aby build nie mógł opublikować błędnej palety.
6. Podłączyć tę samą komendę do CI/MR, w tym merge requestów inicjowanych przez workflow Figma/Tokens Studio.
7. Po ustaleniu punktu 6 rozszerzyć schema/validator o kontrolę poprawności semantic recipe, bez osłabiania zakazu core.

### Bramka wykonania punktu 5

- [x] Obecne opaque core przechodzi walidację bez zmiany wartości.
- [x] Każdy obsługiwany zapis alpha w core powoduje czytelny błąd z nazwą tokenu.
- [x] Błąd zatrzymuje build przed zapisem `dist`.
- [x] Semantic alpha recipe nie jest błędnie klasyfikowana jako core color — validator obejmuje wyłącznie źródło `tokens/base/colors.json`; schema recipe zostanie dodana po punkcie 6.
- [x] Ta sama walidacja działa lokalnie i w CI/workflow synchronizacji tokenów.

### Wynik implementacji punktu 5

- validator: `scripts/validate-core-colors.js`;
- testy: `tests/validate-core-colors.test.js`;
- komendy: `npm run validate:tokens` oraz `npm run test:tokens`;
- `build:tokens` uruchamia validator przez `&&` przed `build-style-dictionary.mjs`;
- workflowy `tokens-ci.yml` i `npm-publish.yml` uruchamiają walidację oraz testy jako osobny krok;
- CI reaguje również na zmiany `scripts/**`, `tests/**`, `package*.json` i konfiguracji builda;
- obecne core przechodzi bez zmiany wartości; 18 legacy opaque HEX zapisanych uppercase pozostaje do późniejszej walidacji canonical format z punktu 3A, ponieważ nie zawierają alpha i nie należą do zakresu punktu 5;
- test integracyjny `npm run build:tokens` przeszedł. Wygenerował znane różnice source → `dist`, dlatego sześć artefaktów przywrócono do ich wcześniejszego, czystego stanu — punkt 5 nie publikuje regeneracji kontraktu Reacta.

---

## Punkt 6 — reprezentacja core color + opacity w Style Dictionary i Figmie

Status: decyzje 6A–6E zatwierdzone, a 6E wdrożona. Do zamknięcia punktu pozostaje kontrolny round-trip Tokens Studio; implementacja zatwierdzonego kontraktu jest kolejnym zadaniem pipeline’u. Produkcyjnych tokenów ani Variables jeszcze nie zmieniono.

### Problem do rozwiązania

Chcemy zachować jednocześnie trzy własności:

1. canonical source pamięta dwie niezależne referencje: opaque core color i foundation opacity;
2. CSS dostaje prawidłowy kolor możliwy do użycia w `box-shadow`, `background`, `border` i gradientach;
3. Figma dostaje równoważną wartość `RGBA`, mimo że zwykły alias Figma Variable wskazuje na całą wartość innej Variable i nie składa samodzielnie aliasu COLOR z aliasem FLOAT.

Spike wykonano na wcześniejszym pipeline Style Dictionary `3.9.2`. Po wdrożeniu decyzji 6E repo używa Style Dictionary `5.5.0`, ale istniejący filtr semantic nadal wybiera wyłącznie string rozpoczynający się od `{color.`. Obsługa recipe z dwiema referencjami wymaga teraz implementacji zatwierdzonych decyzji 6A–6D i osobnej zmiany filtra. Native Figma Variables mogą przechować literalne RGBA albo alias do całej COLOR Variable, ale w obecnym modelu pliku nie ma potwierdzonej formuły łączącej osobno color i opacity.

### Zasada architektoniczna

Canonical source przechowuje relację core + opacity. RGBA, alpha HEX, `rgb(... / ...)` albo `color-mix(...)` są wynikami adapterów, nie ręcznie utrzymywanym drugim źródłem prawdy.

```text
semantic alpha recipe
  ├─ color:   reference → opaque core color
  └─ opacity: reference → foundation opacity
              │
              ├─ CSS adapter   → wynikowa wartość CSS
              ├─ Figma adapter → rozwiązane RGBA per mode
              └─ manifest      → zachowane obie referencje i resolved value
```

### Wynik spike’a

Powtarzalny skrypt: [point-6-alpha-composition-spike.js](./point-6-alpha-composition-spike.js).

| Sprawdzony obszar | Wynik |
|---|---|
| `rgba({core-color}, {number})` | Style Dictionary 3.9.2 rozwiązał obie referencje do `rgba(#000000, 0.08)`. Jest to składnia oficjalnie wspierana przez Tokens Studio dla reduced-opacity Color Token. |
| Recipe object `{ color, opacity }` | SD 3.9.2 rozwiązał referencje wewnątrz obiektu, ale domyślny CSS formatter nie zamienia obiektu na kolor, a format nie jest udokumentowanym formatem authoringu Tokens Studio. |
| DTCG `$value`/`$type` | SD 3.9.2 nie rozpoznał tych obiektów jako tokenów (`allProperties = 0`). First-class DTCG wymaga nowszego Style Dictionary. |
| CSS output | Lokalny adapter poprawnie utworzył `rgba(0, 0, 0, 0.08)` oraz `rgba(21, 125, 64, 0)`. |
| Figma output | Lokalny adapter utworzył poprawne wartości `{r,g,b,a}` z kanałami `0–1`; zielony RGB został zachowany przy alpha `0`. |
| Brakująca referencja | SD 3.9.2 zatrzymał przetwarzanie błędem. |
| Cykl referencji | SD 3.9.2 wykrył cykl i zatrzymał przetwarzanie błędem. |
| Deterministyczność | Dwa uruchomienia spike’a dają identyczny manifest dla tych samych źródeł. |
| Filtr w `build-style-dictionary.mjs` | Nie opublikuje jeszcze recipe: `getSemanticTokens()` wybiera tylko wartości zaczynające się od `{color.`, więc `rgba(...)` zostałoby pominięte. |
| Native Figma Variables | COLOR Variable może otrzymać resolved RGBA, ale nie zachowa dwóch dynamicznych aliasów COLOR + FLOAT/NUMBER. Jest artefaktem wynikowym dla semantic alpha color. |
| Tokens Studio round-trip | Oficjalna składnia jest potwierdzona dokumentacją; test rzeczywistego zapisu → GitHub MR → ponownego odczytu w naszej konfiguracji pozostaje bramką implementacji po zatwierdzeniu decyzji. |

### Ocena wariantów po spike’u

| Wariant | Opis | Zaleta | Ryzyko / ograniczenie | Wstępna ocena |
|---|---|---|---|---|
| **A — recipe object + custom transform** | Wartość semantic zawiera pola `color` i `opacity`, oba jako referencje; custom transform rozwiązuje je per platform. | SD 3.9.2 potrafi rozwiązać obie referencje. | Brak potwierdzonego authoringu/round-trip w Tokens Studio i konieczność własnego formatu. | Technicznie możliwy, ale **nierekomendowany**. |
| **B — Tokens Studio RGBA formula** | Color Token ma wartość `rgba({core-color}, {opacity-number})`. | Oficjalnie wspierany przez Tokens Studio, zachowuje obie referencje i odpowiada zatwierdzonemu typowi `number` dla opacity foundation. | Wymaga transformu `rgba(#hex, alpha)` → finalne RGBA oraz eksportu resolved value do Variables. | **Rekomendowany canonical format.** |
| **C — tylko resolved RGBA w źródle** | Semantic przechowuje gotową wartość RGBA. | Najprostsze dla Figmy i CSS. | Traci jawne zależności core + opacity i utrudnia zmianę theme. | **Odrzucony jako canonical source; dozwolony jako artefakt.** |
| **D — DTCG color object/property-level references** | Użyć obiektowego color i referencji na poziomie właściwości po modernizacji toolchainu. | Standardowy model ma wartość długoterminową. | SD 3.9.2 go nie rozpoznaje, a wsparcie property-level reference musi być zgodne także z Tokens Studio i Variables. | Kierunek przyszły, nie blokuje pierwszego wdrożenia formuły B. |

### Wykonany zakres spike’a

Na dwóch reprezentatywnych tokenach:

- `color.shadow.soft = black + opacity.8`;
- `color.overlay.accent.end = green + opacity.0`;

sprawdzić:

1. zapis i ponowny odczyt przez Tokens Studio bez utraty referencji;
2. rozwiązywanie referencji i wykrywanie błędów/cykli;
3. output CSS jako resolved RGBA oraz manifest zachowujący oryginalną formułę;
4. wygenerowanie danych RGBA zgodnych z modelem Figma COLOR Variable bez zapisu testowych Variables do produkcyjnego pliku;
5. zachowanie kanałów RGB przy alpha `0` w gradiencie;
6. deterministyczność dwóch kolejnych buildów;
7. możliwość wygenerowania manifestu zawierającego recipe i resolved value.

### Panel decyzji punktu 6

Decyzje zatwierdzono 2026-07-22. Wynikają ze spike’a i z istniejącej zasady, że kolory są authorowane przez Tokens Studio i trafiają do repo przez merge request.

| ID | Co zatwierdzamy | Rekomendowana propozycja | Skutek / przykład | Decyzja |
|---|---|---|---|---|
| **6A** | Canonical serializacja core + opacity | Semantic alpha Color Token zapisujemy jako wspieraną przez Tokens Studio formułę `rgba({opaque-core-color}, {opacity-number})`. Obie referencje pozostają w źródle; nie używamy własnego recipe object. | `color.shadow.soft.value = "rgba({color.black}, {opacity.8})"`; `opacity.8` ma typ `number` i wartość `0.08`. | _APPROVED_ |
| **6B** | Publiczny format CSS | Generator publikuje resolved `rgba(r, g, b, a)`. Manifest zachowuje osobno canonical recipe i resolved value. W pierwszej iteracji nie publikujemy `color-mix()` ani runtime composition z core/opacity CSS variables. | `--color-shadow-soft: rgba(0, 0, 0, 0.08)`; dla alpha `0`: `rgba(21, 125, 64, 0)`, bez utraty bazowego RGB. | _APPROVED_ |
| **6C** | Native Figma Variables | Tokens Studio/adapter eksportuje semantic alpha token jako resolved RGBA COLOR Variable per mode. Taka Variable jest artefaktem pochodnym i nie zachowuje osobnych aliasów color + opacity. Nie edytujemy jej ręcznie jako canonical recipe. | Figma widzi kolor z alpha i może go użyć w fill/stroke/shadow; źródłowa formuła nadal żyje w Tokens Studio/repo. | _APPROVED_ |
| **6D** | Source of truth i round-trip | Dla kolorów canonical authoring pozostaje w Tokens Studio, a GitHub JSON/MR jest wersjonowanym źródłem pipeline’u. Native semantic alpha Variables są generowane. Przed produkcyjnym wdrożeniem designer wykonuje kontrolowany test formula → GitHub MR → pull → export Variable; wynik zapisujemy w raporcie. | Edycja resolved RGBA wyłącznie w native Variable nie może nadpisać recipe. Spacing/typography Variables pozostają osobnym strumieniem synchronizacji. | _APPROVED_ |
| **6E** | Wersja toolchainu | Przed produkcyjnym wdrożeniem alpha/spacing/typography aktualizujemy Style Dictionary `3.9.2 → 5.5.0` i dodajemy `@tokens-studio/sd-transforms 2.0.3`. Nie dopisujemy nowego rozwiązania do legacy API SD3. | Wdrożono ESM builder `build-style-dictionary.mjs`; CI używa Node 22. Trzy własne artefakty tematyczne CSS są identyczne z baseline’em SD3, a w bazowym CSS i dwóch SCSS zmienił się wyłącznie automatyczny komentarz generatora. Stały snapshot/manifest i test deterministyczności pozostają zadaniami pipeline’u poniżej. | **approved — wdrożone 2026-07-22** |

### Checklista zamknięcia punktu 6

- [x] Wykonać lokalny spike na shadow alpha `8%` i gradient stop alpha `0%`.
- [x] Potwierdzić zachowanie referencji, błędów, cykli, CSS, RGBA i deterministycznego manifestu.
- [x] Potwierdzić ograniczenie native Variables bez zapisywania testowych tokenów do produkcyjnego pliku.
- [x] 6A — zatwierdzić canonical serializację recipe.
- [x] 6B — zatwierdzić publiczny format CSS.
- [x] 6C — zatwierdzić model native Figma Variables.
- [x] 6D — zatwierdzić source of truth i wymaganie kontrolnego round-trip Tokens Studio.
- [x] 6E — upgrade Style Dictionary i `sd-transforms`.
- [ ] Wykonać kontrolny test w Tokens Studio na gałęzi testowej: formula → GitHub MR → pull → export native RGBA Variable.
- [ ] Zapisać wynik round-trip w raporcie, w tym potwierdzenie zachowania obu referencji w canonical JSON.
- [ ] Po udanym round-trip zamknąć punkt 6 w głównym planie.

### Wynik wdrożenia decyzji 6E

- Style Dictionary: `3.9.2 → 5.5.0`;
- Tokens Studio transforms: dodano `@tokens-studio/sd-transforms` `2.0.3` i transform `ts/color/css/hexrgba`;
- builder przeniesiono z CommonJS do ESM: `build-style-dictionary.js → build-style-dictionary.mjs`;
- `npm run build:tokens`, walidacja core oraz 16 testów tokenów przechodzą;
- porównanie z baseline’em SD3 potwierdziło brak zmian nazw i wartości tokenów: `tokens.tailwind.css`, `tokens.dark.css` i `tokens.light.css` są identyczne; `tokens.css` oraz dwa pliki SCSS różnią się tylko standardowym nagłówkiem wygenerowanym przez SD5;
- `dist` nie jest publikowany ani aktualizowany w ramach samego upgrade’u; pełna regeneracja pozostaje kontrolowanym krokiem po zamknięciu kontraktu i testów pipeline’u.

### Źródła techniczne do spike’a

- [Style Dictionary — transforms](https://styledictionary.com/reference/hooks/transforms/): custom i transitive transforms dla wartości zawierających referencje;
- [Style Dictionary — references](https://styledictionary.com/reference/utils/references/): rozwiązywanie referencji i przykład koloru `rgba({base}, 12%)`;
- [DTCG Format 2025.10](https://www.designtokens.org/TR/2025.10/format/): typed values, aliases i property-level references;
- [Figma Variables REST API](https://developers.figma.com/docs/rest-api/variables-endpoints/): wartość COLOR/RGBA albo alias całej Variable jako wartość trybu.
- [Tokens Studio — reduced opacity colors](https://docs.tokens.studio/manage-tokens/token-types/color/): formuła `rgba({color}, {unitless-number})` i ograniczenia Opacity Token Type.
- [Tokens Studio `sd-transforms`](https://github.com/tokens-studio/sd-transforms): kompatybilność wersji i `ts/color/css/hexrgba`.

---

## Punkt 7 — zakres tokenów shadow

Status: decyzja zatwierdzona 2026-07-22.

W pierwszej iteracji publikujemy **wyłącznie semantic shadow colors**. Nie tworzymy jeszcze złożonych tokenów całej elewacji zawierających `offset-x`, `offset-y`, `blur`, `spread` i `color`.

Przykładowy kontrakt:

```css
--color-shadow-soft: rgba(0, 0, 0, 0.08);
--color-shadow-event-filter: rgba(21, 23, 82, 0.30);
```

Geometria cienia pozostaje na tym etapie po stronie komponentu. Nazwa semantic opisuje rolę cienia, a nie bazowy kolor ani procent opacity. Pełne elevation tokens możemy dodać później jako osobną, świadomą warstwę bez zmiany kontraktu shadow colors.

---

## Punkt 8 — zasady referencji i zakaz cykli

Status: propozycja do zatwierdzenia.

### Panel decyzji punktu 8

W kolumnie **Decyzja** wpisz `approved` albo opisz zmianę.

| ID | Co ustalamy | Rekomendowana propozycja | Dlaczego / skutek | Decyzja |
|---|---|---|---|---|
| **8A** | Kierunek zależności | Dozwolony graf to `core/foundation → semantic → adapter/output`, gdzie strzałka oznacza „jest używany przez”. Core i foundation nie mogą zależeć od semantic, theme, aliasów CRM ani artefaktów `dist`. | Jednoznaczny, acykliczny kierunek zależności i brak przecieków z aplikacji do źródła tokenów. | _do uzupełnienia_ |
| **8B** | Referencje semantic | Semantic wskazuje bezpośrednio na core/foundation. W pierwszej iteracji zakazujemy `semantic → semantic`. Wyjątkiem nie jest formuła alpha: nadal zawiera bezpośrednio core color i foundation opacity. | Krótkie, łatwe do audytu zależności; zmiana jednego semantic nie wywołuje ukrytego łańcucha zmian. | _do uzupełnienia_ |
| **8C** | Theme i tryby responsive | Light/dark/brand oraz sześć trybów responsive mogą zmieniać przypisanie semantic do core/foundation, ale nie mogą zmieniać identity ani typu tokenu. Każdy wymagany mode musi mieć kompletną wartość lub alias. | Ta sama publiczna nazwa działa w każdym motywie i breakpointcie, a brak wartości zatrzymuje build. | _do uzupełnienia_ |
| **8D** | Zgodność typów | Referencja musi prowadzić do zgodnego typu: color → color, dimension → dimension, font family → font family itd. Formula semantic alpha może łączyć wyłącznie opaque core `color` z foundation opacity typu `number`. | Zapobiega poprawnym składniowo, ale błędnym znaczeniowo aliasom. | _do uzupełnienia_ |
| **8E** | Aliasy migracyjne CRM | Aliasy `--app-*` istnieją wyłącznie w `tokens.angular.css` i wskazują bezpośrednio na docelowy semantic CSS custom property. Nie wolno używać aliasu jako źródła innego tokenu ani w nowym kodzie CRM. | Adapter pozostaje jednokierunkową warstwą kompatybilności i można go później usunąć bez naruszania canonical source. | _do uzupełnienia_ |
| **8F** | Brakujące referencje i cykle | Brak targetu, self-reference i każdy cykl pośredni są błędem blokującym. Komunikat zawiera token źródłowy oraz pełny łańcuch, np. `a → b → c → a`. Nie rozwiązujemy błędu fallbackiem ani literalem. | Błędy są widoczne w MR i nie trafiają do aplikacji jako częściowo poprawny build. | _do uzupełnienia_ |
| **8G** | Moment walidacji | Osobny preflight buduje i waliduje cały graf wszystkich aktywnych token setów/modes **przed** uruchomieniem generatorów i przed zapisem do `dist`. Ta sama walidacja działa lokalnie, w CI i w MR z Tokens Studio. | Style Dictionary nie powinien zdążyć zapisać części artefaktów, zanim błąd zostanie wykryty na innej platformie. | _do uzupełnienia_ |
| **8H** | Kontrola outputu | Po transformacji w publikowanych CSS/SCSS/manifestach nie może pozostać nierozwiązana składnia `{...}`. Test sprawdza też identyczny zestaw semantic identities w light/dark oraz kompletność sześciu trybów dla tokenów responsive. | Chroni konsumentów przed cichym opublikowaniem nierozwiązanego aliasu albo niepełnego motywu. | _do uzupełnienia_ |

### Proponowana checklista implementacyjna po decyzji

- [ ] Zbudować preflight grafu referencji niezależny od kolejności platform Style Dictionary.
- [ ] Dodać test poprawnego grafu core/foundation → semantic.
- [ ] Dodać test brakującego targetu, self-reference i cyklu pośredniego.
- [ ] Dodać test niezgodnych typów i niedozwolonego `semantic → semantic`.
- [ ] Dodać test kompletności light/dark i sześciu responsive modes.
- [ ] Dodać test braku nierozwiązanych `{...}` w outputach.
- [ ] Uruchamiać preflight przed każdym buildem lokalnym i w CI.
