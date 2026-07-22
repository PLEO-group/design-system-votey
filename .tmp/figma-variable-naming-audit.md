# Audyt nazewnictwa Figma Variables

Data odczytu: 2026-07-22  
Plik: [Wyborek | Design System](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=0-1)  
Zakres: wszystkie lokalne Figma Variables oraz metadane Tokens Studio  
Tryb pracy: wyłącznie odczyt; w Figmie i źródłach tokenów nie wprowadzono zmian

## Najważniejszy wniosek

W pliku istnieją obecnie dwa równoległe mechanizmy authoringu:

1. Tokens Studio, używane dotąd dla kolorów i połączone z repozytorium GitHub;
2. natywne Figma Variables, zawierające kolory oraz nowe spacing, typography i radius.

Natywne Variables są wewnętrznie dość konsekwentne: core zawiera literały, a semantic wyłącznie aliasy do core. Nie są jednak jeszcze zsynchronizowane z obecnym kontraktem repo. Największa rozbieżność dotyczy semantic colors: Figma Variables mają nowy, mały słownik 26 nazw, podczas gdy repo/Tokens Studio publikuje istniejący kontrakt 193/194 nazw używany przez React.

Nie należy więc eksportować wszystkich native Variables bezpośrednio do repo jako zamiennika obecnych tokenów. Najpierw trzeba ustalić mapowanie i jeden kontrolowany kierunek synchronizacji.

## Podsumowanie ilościowe

| Kolekcja | Warstwa | Tryby | Liczba | Typy |
|---|---|---|---:|---|
| `base/colors` | core | `base/colors` | 52 | COLOR |
| `space/core` | core | `value` | 14 | FLOAT |
| `space/semantic` | semantic/responsive | 6 szerokości | 11 | FLOAT |
| `type/core` | core | `value` | 32 | 27 FLOAT, 5 STRING |
| `type/semantic` | semantic/responsive | 6 szerokości | 56 | 42 FLOAT, 14 STRING |
| `color/semantic` | semantic/theme | `Light`, `Dark` | 26 | COLOR |
| `radius/core` | core | `value` | 10 | FLOAT |
| `radius/semantic` | semantic | `Default` | 10 | FLOAT |
| **Razem** |  |  | **211** | 78 COLOR, 114 FLOAT, 19 STRING |

Wspólne właściwości wszystkich 211 Variables:

- każda ma scope `ALL_SCOPES`;
- żadna nie ma ustawionego `codeSyntax` dla WEB/CSS;
- core ma wyłącznie wartości literalne;
- semantic ma wyłącznie aliasy do core — bez literałów i bez łańcuchów semantic → semantic.

## Pełny katalog nazw

Poniższe listy obejmują wszystkie 211 natywnych Variables. Kolekcja nie jest automatycznie częścią nazwy Variable — pokazuję oba poziomy osobno.

### `base/colors` — 52

Wzorzec Variable: `color/<family>-<step>`, wyjątek: `color/white`.

| Rodzina | Nazwy Variables |
|---|---|
| white | `color/white` |
| gray | `color/gray-100`, `color/gray-400`, `color/gray-500`, `color/gray-700` |
| navy-blue | `color/navy-blue-25`, `color/navy-blue-50`, `color/navy-blue-70`, `color/navy-blue-100`, `color/navy-blue-200`, `color/navy-blue-400`, `color/navy-blue-600`, `color/navy-blue-700`, `color/navy-blue-800`, `color/navy-blue-900` |
| mint-green | `color/mint-green-50`, `color/mint-green-70`, `color/mint-green-100`, `color/mint-green-300`, `color/mint-green-400`, `color/mint-green-500`, `color/mint-green-600`, `color/mint-green-800`, `color/mint-green-900`, `color/mint-green-1300` |
| active-green | `color/active-green-25`, `color/active-green-100`, `color/active-green-300`, `color/active-green-400`, `color/active-green-500` |
| blue | `color/blue-25`, `color/blue-70`, `color/blue-100`, `color/blue-300`, `color/blue-400`, `color/blue-600`, `color/blue-900` |
| red | `color/red-50`, `color/red-200`, `color/red-400`, `color/red-500`, `color/red-600` |
| orange | `color/orange-50`, `color/orange-70`, `color/orange-100`, `color/orange-300`, `color/orange-400`, `color/orange-500`, `color/orange-800` |
| yellow | `color/yellow-100`, `color/yellow-400`, `color/yellow-600` |

Porównanie z `tokens/base/colors.json`:

- 51 nazw jest zgodnych 1:1;
- tylko w native Variables istnieje `color/mint-green-1300` = `#1e795f`;
- zatwierdzone do późniejszego dodania `color/yellow-25` = `#fffcf1` oraz `color/yellow-50` = `#fff5e1` nie istnieją jeszcze ani w repo, ani w native Variables;
- `active-green` brzmi semantycznie mimo umieszczenia w core.

### `space/core` — 14

Wzorzec: `space/<literal-px>`.

`space/2`, `space/4`, `space/8`, `space/12`, `space/16`, `space/20`, `space/24`, `space/32`, `space/40`, `space/48`, `space/56`, `space/64`, `space/80`, `space/96`.

Nazwa zawiera bezpośrednią wartość liczbową. Jednostka nie występuje w nazwie; wszystkie wartości są FLOAT i obecnie odpowiadają pikselom.

### `space/semantic` — 11

Wzorzec: `space/<role>` lub `space/<role>-<axis|size>`.

`space/page-margin`, `space/section-gap`, `space/card-padding`, `space/card-gap`, `space/stack-gap-l`, `space/stack-gap-m`, `space/stack-gap-s`, `space/control-padding-x`, `space/control-padding-y`, `space/table-row-padding-y`, `space/icon-gap`.

Każda nazwa ma alias do `space/core` w sześciu trybach:

`Desktop 1920`, `Laptop 1280`, `Tablet 1024`, `Tablet 768`, `Mobile 375`, `Mobile 360`.

Konwencja miesza role ogólne (`page-margin`, `section-gap`) i komponentowe (`card-*`, `control-*`, `table-row-*`). Rozmiary są zapisane skrótami `s`, `m`, `l`, a osie jako `x`, `y`.

### `type/core` — 32

| Podgrupa | Nazwy Variables |
|---|---|
| font-size | `font-size/11`, `font-size/12`, `font-size/13`, `font-size/14`, `font-size/15`, `font-size/16`, `font-size/18`, `font-size/20`, `font-size/22`, `font-size/24`, `font-size/26`, `font-size/28`, `font-size/32` |
| line-height | `line-height/15`, `line-height/16`, `line-height/17`, `line-height/18`, `line-height/20`, `line-height/22`, `line-height/25`, `line-height/27`, `line-height/30`, `line-height/33`, `line-height/35`, `line-height/38`, `line-height/45` |
| letter-spacing | `letter-spacing/0` |
| font-weight | `font-weight/light`, `font-weight/regular`, `font-weight/semibold`, `font-weight/bold`, `font-weight/extrabold` |

Uwagi:

- nazwy `font-size`, `line-height` i `letter-spacing` opisują właściwość oraz literalną wartość;
- wartości font-weight są STRING: `Light`, `Regular`, `SemiBold`, `Bold`, `ExtraBold`, a nie numery CSS `300/400/600/700/800`;
- w core brakuje `font-family`; zaakceptowany dla CRM Open Sans nie jest jeszcze Variable;
- wartości `SemiBold` i `ExtraBold` nie mają spacji. Trzeba sprawdzić zgodność dokładnych nazw stylów z rodziną Open Sans podczas projektowania eksportu.

### `type/semantic` — 56

Wzorzec: `<text-role>/<property>`.

Role:

`h1`, `h2`, `h3`, `h4`, `h5`, `body-l`, `body`, `body-s`, `caption`, `caption-s`, `micro`, `button`, `table-header`, `label`.

Każda z 14 ról ma dokładnie cztery Variables:

`<role>/font-size`, `<role>/line-height`, `<role>/letter-spacing`, `<role>/font-weight`.

Daje to komplet 14 × 4 = 56 nazw. Każda właściwość aliasuje bezpośrednio do odpowiedniej podgrupy `type/core` w tych samych sześciu trybach responsywnych co spacing.

Rozbieżności strukturalne:

- kolekcja nazywa się `type/semantic`, ale sama Variable nie zaczyna się od `type/` ani `typography/`;
- role HTML-owe `h1`–`h5` są wymieszane z rolami znaczeniowymi i komponentowymi;
- `button` i `table-header` są rolami komponentowymi, a `body`, `caption`, `label` — ogólnymi;
- nie ma `font-family`, więc semantic typography nie jest jeszcze pełnym kontraktem stylu tekstowego;
- oznaczenia rozmiaru stosują suffixy `-s`/`-l`, bez `-m` dla wariantu bazowego.

### `color/semantic` — 26

Wzorzec: `<group>/<role>`. Nazwa Variable nie zaczyna się od `color/`; kategorię przeniesiono wyłącznie do nazwy kolekcji.

| Grupa | Nazwy Variables |
|---|---|
| bg | `bg/page`, `bg/surface`, `bg/surface-raised`, `bg/surface-tint`, `bg/sidebar`, `bg/hero`, `bg/inverse` |
| text | `text/primary`, `text/secondary`, `text/muted`, `text/inverse`, `text/accent`, `text/on-sidebar` |
| accent | `accent/primary`, `accent/strong`, `accent/on-accent`, `accent/hover`, `accent/soft` |
| border | `border/subtle`, `border/strong`, `border/focus` |
| state | `state/error`, `state/error-bg`, `state/success`, `state/warning`, `state/info` |

Każda Variable ma alias do `base/colors` w trybach `Light` i `Dark`.

Porównanie z istniejącym repo:

- native Variables mają 26 semantic color identities;
- repo ma 193 w light i 194 w dark;
- po dodaniu logicznego prefiksu `color.` tylko 3 ścieżki są identyczne z repo: `color.text.secondary`, `color.text.muted`, `color.border.subtle`;
- `bg/*`, `accent/*` i `state/*` wprowadzają słownik inny od istniejących grup repo (`surface`, `alert`, `icon`, `button`, `gradient`, `controls`);
- podobna wartość lub rola nie oznacza jeszcze zgodnej identity, np. native `bg/page` nie jest automatycznie tym samym co dowolny obecny `color.surface.*`;
- bez jawnego mapowania eksport tej kolekcji utworzyłby drugie API semantic colors i mógłby naruszyć kontrakt Reacta.

### `radius/core` — 10

Wzorzec: `radius/<literal-px>`, z wyjątkiem wartości specjalnej `pill`.

`radius/3`, `radius/6`, `radius/8`, `radius/10`, `radius/12`, `radius/16`, `radius/20`, `radius/24`, `radius/30`, `radius/pill`.

`pill` jest nazwą znaczeniową/kształtową w kolekcji core, podczas gdy pozostałe nazwy opisują wartości. To świadomy kandydat do ujednolicenia: albo pozostaje udokumentowanym wyjątkiem core, albo semantic role wskazują na liczbowy/max core token.

### `radius/semantic` — 10

Wzorzec: `radius/<component-or-role>`, tryb `Default`.

| Variable | Alias core |
|---|---|
| `radius/button` | `radius/pill` |
| `radius/input` | `radius/10` |
| `radius/control` | `radius/10` |
| `radius/badge` | `radius/6` |
| `radius/card` | `radius/30` |
| `radius/card-s` | `radius/16` |
| `radius/modal` | `radius/30` |
| `radius/tooltip` | `radius/8` |
| `radius/table-row` | `radius/12` |
| `radius/avatar` | `radius/pill` |

Konwencja ponownie miesza role komponentowe i wariant wielkości `-s`.

## Jak obecnie wygląda konwencja

### Reguły, które są już spójne

- nazwy są lowercase i używają kebab-case;
- slash `/` buduje grupy widoczne w panelu Variables;
- core opisuje literalną wartość lub surowy wariant;
- semantic opisuje rolę i wskazuje aliasem bezpośrednio do core;
- appearance mode nie występuje w nazwie Variable;
- responsive mode nie występuje w nazwie Variable;
- nazwy nie zawierają frameworka ani produktu;
- osie używają `x`/`y`, a rozmiary skrótów `s`/`m`/`l`.

### Rozbieżności wymagające uporządkowania

1. **Nazwa kategorii:** kolekcje używają `space` i `type`, a plan/terminologia repo `spacing` i `typography`.
2. **Położenie kategorii:** `color/` i `space/` są powtórzone w nazwach Variables, ale `type/semantic` nie zawiera `type/`, a `color/semantic` nie zawiera `color/`.
3. **Nazwa warstwy:** kolory core są w `base/colors`, pozostałe primitives w kolekcjach `*/core`.
4. **Nazwy pojedynczych trybów:** używane są trzy różne wzorce: `base/colors`, `value`, `Default`.
5. **Różne rodzaje semantyki:** role ogólne, layoutowe, tekstowe i komponentowe są mieszane bez jawnej reguły głębokości.
6. **Wartość w nazwie:** spacing, font-size, line-height i radius używają wartości jako nazwy; font-weight używa nazw stylów; `pill` jest wyjątkiem znaczeniowym w core.
7. **Typografia nie jest kompletna:** brak `font-family`; weight jest STRING zamiast liczby CSS.
8. **Brak kontraktu z kodem:** wszystkie 211 Variables mają pusty `codeSyntax`, więc nie da się jednoznacznie odczytać docelowej nazwy CSS.
9. **Nieprecyzyjne scope’y:** wszystkie 211 Variables używają `ALL_SCOPES`, przez co primitives i role pojawiają się w nieadekwatnych pickerach Figmy.
10. **Semantic colors dublują istniejący system:** 26 nowych nazw nie odpowiada kontraktowi 193/194 nazw w repo.
11. **Stan core color nie jest identyczny:** native Variables mają dodatkowy `mint-green-1300`; nadal nie mają zatwierdzonych `yellow-25` i `yellow-50`.

## Stan Tokens Studio i synchronizacji

Z danych pluginu w tym pliku można potwierdzić:

- namespace Tokens Studio `tokens` jest dostępny;
- plugin zapisuje dane w formacie skompresowanym (`isCompressed: true`), dlatego wartości nie są czytelnym JSON-em bez dekodera Tokens Studio;
- wersja danych pluginu: `2.11.10`;
- format tokenów: `dtcg`;
- storage: GitHub, repo `PLEO-group/design-system-votey`, branch `feature/token-sync`, katalog `tokens`;
- wybrany eksportowany theme wskazuje `base/colors`;
- repozytorium ma token sets `base/colors`, `light`, `dark`;
- `$themes.json` zawiera obecnie referencje Variables tylko dla dwóch testowych nazw `test-mint-green-100` i `test-mint-green-70` — nie dla nowych 211 Variables.

Wniosek: samo współistnienie obu mechanizmów w jednym pliku nie oznacza synchronizacji. Native spacing/type/radius i native `color/semantic` nie mają jeszcze wykazanego połączenia z plikami tokenów generującymi merge requesty.

Metadane pluginu zawierają także pole `fileKey` inne niż key otwartego dokumentu. Nie przypisuję mu znaczenia bez dokumentacji Tokens Studio — może być identyfikatorem konfiguracji/storage, a nie kluczem dokumentu. Warto je zweryfikować podczas projektowania automatyzacji, ale nie jest dowodem błędnego połączenia.

## Rekomendacja do decyzji w punkcie 2

Na tym etapie najbezpieczniej przyjąć:

- istniejące nazwy kolorów publikowane dla Reacta pozostają chronionym kontraktem;
- native Variables są źródłem informacji o nowych spacing/type/radius, ale jeszcze nie publicznym API;
- przed eksportem ustalamy jeden canonical path synchronizacji, np. native Variables → kontrolowana konwersja/import do Tokens Studio → MR → repo, albo Tokens Studio jako wspólny authoring także dla tych kategorii;
- nie utrzymujemy docelowo dwóch niezależnie edytowanych kopii tych samych tokenów;
- docelowe nazwy CSS zapisujemy jawnie przez regułę/manifest i `codeSyntax`, a nie wyłącznie przez mechaniczne spłaszczenie slashy;
- zmianę nazwy `space`/`type`, scope’ów i trybów traktujemy jako migrację Figmy; nie wykonujemy jej przed zatwierdzeniem kontraktu i sposobu synchronizacji.

### Zatwierdzona interpretacja trybów responsive

- sześć trybów spacingu i typografii to breakpointy odpowiadające szerokościom makiet: `360`, `375`, `768`, `1024`, `1280`, `1920`;
- wszystkie sześć wartości jest wejściem interpolacji, nie tylko mobile/tablet/desktop;
- `data-device="mobile|tablet|desktop"` jest osobną osią runtime i wybiera mnożnik mechanizmu skopiowanego 1:1 z `angular-design-system`;
- szczegóły mechanizmu i decyzji opisuje [angular-design-system-responsive-scaling-audit.md](./angular-design-system-responsive-scaling-audit.md).

### Kontrakt nazw dla Angularowej dyrektywy typograficznej

Role z `type/semantic` mają docelowo zasilać jeden współdzielony manifest, z którego będą generowane zarówno nazwy CSS, jak i typ union inputu `voteyText`. Analogicznie wartości mechanizmu nadpisania koloru/stylu będą generować typ inputu `voteyTextOverwrite`.

Dzięki temu Angular Language Service przy `strictTemplates` będzie mógł podpowiadać dostępne role i zgłaszać niepoprawne wartości. Nie tworzymy osobnej, ręcznie utrzymywanej listy tylko dla dyrektywy. Szczegóły i przykłady API zapisano w [angular-design-system-responsive-scaling-audit.md](./angular-design-system-responsive-scaling-audit.md).

## Otwarte decyzje dla zespołu

- [ ] Czy oficjalną kategorią będzie `space` czy `spacing`?
- [ ] Czy oficjalną kategorią będzie `type` czy `typography`?
- [ ] Czy prefiks kategorii zawsze występuje w Variable, czy tylko w nazwie kolekcji?
- [ ] Czy semantic colors z native Variables są propozycją nowego systemu, czy tylko roboczym zestawem dla CRM?
- [ ] Jak mapujemy 26 native semantic colors na istniejący kontrakt Reacta bez tworzenia drugiego API?
- [ ] Czy `font-weight` w źródłach kodowych ma być liczbą CSS, mimo że Figma przechowuje nazwę stylu jako STRING?
- [ ] Gdzie dodajemy `font-family/open-sans`, aby typography była kompletna?
- [ ] Czy `radius/pill` pozostaje wyjątkiem core?
- [ ] Który mechanizm jest canonical source i jak drugi jest z niego automatycznie odświeżany?
- [ ] Jakie docelowe scope’y i WEB `codeSyntax` przypisujemy poszczególnym kategoriom?
