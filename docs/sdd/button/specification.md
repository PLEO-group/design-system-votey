# WERSJA 1.0.0
# AUTOR k.tryba@pleodigital.com & n.koktysz@pleodigital.com

# Spec Driven Specification: Button — stan zaimplementowany

## 1. Metadane

- Data analizy: 2026-09-22; weryfikacja uwag reviewera: 2026-09-23, Europe/Warsaw.
- Status: Draft.
- Powiązane zgłoszenia: [WYBOREK-3049](https://pleogroup.atlassian.net/browse/WYBOREK-3049).
- Feature slug: `button`.
- Typ dokumentu: `specification`.
- Profil: `AS_IS MULTI_REPO`.
- Tryb pracy: `create`.
- Repozytorium kanoniczne: `design-system-votey`, project slug `PLEO-group/design-system-votey`.
- Repozytorium kontekstowe: `wyborek-crm`, project slug `pleodigital/wyborek-crm`, tylko odczyt.
- Wersje w źródłach: manifest DS `1.0.168`; bazowa gałąź CRM `master` deklaruje `1.0.140`, natomiast nowsza gałąź `test` deklaruje i przypina w lockfile `1.0.170`. Wersji uruchomionej na produkcji nie ustalono.
- Rewizje źródeł: DS `ab66acebfeabc839ee8bbbe4b2896eb988f35631`; CRM `master` `1b8943bc55d22409918434c46aae0d85a431e6a4`, CRM `test` `a349c0edac78fd060815bf43406b8a083dc8c9bc`. Opis bieżącej integracji CRM oparto na gałęzi `test`.
- Środowiska objęte analizą: lokalne źródła, zapisane artefakty `dist`, konfiguracja buildów, Storybooka i CI; bez pomiarów aplikacji produkcyjnej.
- Zakres feature: komponent frontendowy Button i jego integracja z aplikacją hosta.
- Zakres stacku: Angular 21, Angular Material, TypeScript, SCSS, CSS custom properties; Style Dictionary 5 i ng-packagr; Storybook 8 React/Vite jako host podglądu komponentu Angular.

Markdown jest samowystarczalnym i jedynym wiążącym materiałem review tego opisu AS-IS. Pliki `button-as-is.drawio` i `button-as-is.png` są opcjonalnymi wizualizacjami pomocniczymi. Ich otwarcie nie jest wymagane do zrozumienia ani oceny specyfikacji.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Przycisk pozwala użytkownikowi uruchomić akcję udostępnioną przez ekran lub inną kontrolkę. Może prezentować etykietę, ikonę przed etykietą albo samą ikonę. W bibliotece dostępne są dwa rozmiary i sześć stylów wizualnych. Użytkownik może zobaczyć dodatkowy badge oraz podpowiedź, a przy niedostępnej akcji — osobny opis przyczyny niedostępności.

Aktywny przycisk obsługuje standardową interakcję myszą i klawiaturą poprzez natywny element przeglądarki. Wyłączenie blokuje jego zwykłą aktywację; decyzję, czy akcja jest dostępna, podejmuje używający go ekran. Przycisk przekazuje aktywację do rodzica; nie prezentuje automatycznie wyniku jego akcji.

Komponent biblioteki DS jest wykorzystywany przez jej kontrolki i podgląd Storybook. W sprawdzonej gałęzi CRM `test` występuje także w widokach aplikacji, między innymi na ekranie potwierdzenia rejestracji i w modalu ostrzegawczym. W `src/app` tej gałęzi nie ma już lokalnego `app-button`.

### 2.2 Opis Techniczny

DS eksportuje standalone `VoteyButtonComponent` z selektorem `vt-button` przez `@pleodigital/design-system-votey/angular`. Komponent używa signal inputs, obliczanych klas, `ChangeDetectionStrategy.OnPush` i outputu `pressed: void`. Renderuje natywny `<button>` otoczony wrapperem tooltipu. Zależności prezentacyjne to `VoteyIconComponent`, `VoteyTextComponent`, `MatTooltip` i `VoteyTranslatePipe`.

Wygląd wynika z lokalnego SCSS oraz globalnego `tokens.angular.css`. Część geometrii jest literalna. Kolory semantyczne zmieniają się przez selektory motywu CSS; spacing i typografia zależą również od kontekstu urządzenia na `body`.

CRM na gałęzi `test` importuje `VoteyButtonComponent`, renderuje `vt-button` i obsługuje jego output `pressed`. Konfiguracja aplikacji dostarcza adapter tłumaczeń oraz rejestr SVG DS, a build kopiuje pliki ikon do zasobów SPA. Starsza gałąź `master` nadal zawiera lokalny `app-button`; nie stanowi podstawy opisu bieżącej integracji.

## 3. Zakres

### 3.1 Zakres Biznesowy

Opis obejmuje następujące istniejące zachowania:

- uruchomienie akcji rodzica przez aktywny przycisk oraz blokadę zwykłej aktywacji wyłączonego przycisku;
- prezentację etykiety, ikony z etykietą albo samej ikony; o trybie ikonowym decyduje obecność ikony i brak niepustej etykiety;
- sześć wariantów DS: `primary`, `secondary`, `link`, `danger`, `ghost`, `orange`, oraz rozmiary `large` i `small`;
- pojedynczą linię etykiety bez lokalnego limitu długości i bez lokalnego skracania wielokropkiem;
- opcjonalny badge, również o wartości zero, bez narzuconej semantyki licznika;
- podpowiedź zwykłą lub podpowiedź dla niedostępnej akcji;
- nawigację klawiaturą i wskaźnik fokusa w DS, nadanie nazwy dostępnej według rzeczywistego fallbacku oraz przekazanie atrybutów opisujących powiązanie z popupem;
- zmianę kolorów semantycznych przez motyw hosta i odtwarzanie preferencji motywu w CRM;
- użycie `vt-button` przez aplikację CRM na sprawdzonej gałęzi `test`, z akcjami obsługiwanymi przez komponenty ekranów.

### 3.2 Zakres Techniczny

Zakres zawiera publiczne API `vt-button`, strukturę DOM, zależności SVG/i18n/tooltip/badge, reguły SCSS, źródła tokenów, eksport paczki, istniejących konsumentów wewnętrznych, Playground Storybook oraz konfigurację publikacji npm i podglądu Vercel. Po stronie CRM obejmuje użycia bibliotecznego przycisku, kopiowanie SVG DS, adapter tłumaczeń, import CSS DS, inicjalizację kontekstu urządzenia i mechanizm motywu.

Nie są wprowadzane zmiany kodu, kontraktów aplikacyjnych, danych ani pipeline'ów. Wersjonowany jest dokument stanu obecnego. Wszystkie opisane niezgodności lub ograniczenia dotyczą badanego stanu i nie ustanawiają wymagań naprawczych.

### 3.3 Poza Zakresem

- Dalsze zmiany przycisków w widokach CRM oraz aktualizacja zależności DS w ramach tej dokumentacji.
- Projektowanie nowych wariantów, focus ringa, loadingu, button group lub menu w komponencie Button.
- Zachowanie ekranów po odebraniu aktywacji przycisku. Zakres komponentu kończy się na output, callbacku lub zdarzeniu DOM.
- Pełna specyfikacja Select, Chip, FilePicker, MultiSelectPopover, i18n, silnika responsywności i rejestru wszystkich ikon; poniżej opisano ich zależności niezbędne dla Button.
- Potwierdzenie zgodności pikselowej z Figmą, certyfikacja dostępności, pomiary przeglądarkowe wszystkich kombinacji oraz ustalenie aktualnej wersji produkcyjnej.
- Publikacja paczki, deployment aplikacji, uruchomienie workflow review i modyfikacja repozytorium CRM w ramach authoringu.

## 4. Stan Obecny (AS-IS)

### 4.1 Stan implementacji

| Obszar | Potwierdzony stan |
| --- | --- |
| DS | Jeden komponent `vt-button` obsługuje etykietę i tryb ikonowy. Nie ma oddzielnego komponentu icon-button. |
| Wariant i typ | `variant` określa wygląd; `type` oznacza natywne `button`, `submit` lub `reset`. |
| Stany | Brak inputu `state`; hover/active/focus-visible są pseudoklasami, a disabled jest inputem i atrybutem natywnym. |
| Wymiary | Deklaracje SCSS: standardowo 44 px, small 28 px; link ma wysokość auto. Szczegóły i wyjątki w §5.1.3. |
| Tokeny | Semantyczne kolory i część odstępów/typografii korzystają z CSS vars; istnieją też literały. |
| Konsumenci DS | Chip, Select, FilePicker, MultiSelectPopover oraz Angular Button Playground w Storybooku. |
| CRM `test` | `vt-button` jest używany w widokach, a `VoteyButtonComponent` importowany przez komponenty Angular; w `src/app` nie ma `app-button`. |
| Wersje | CRM `test` przypina DS 1.0.170; CRM `master` nadal przypina 1.0.140. Źródła DS 1.0.168 nie stanowią dowodu zawartości paczki 1.0.170. |

### 4.2 Ograniczenia analizy

Treść Jiry opisuje zamierzenia; nie potwierdza pełnej zgodności implementacji. Faktyczne nazwy rozmiarów, warianty, wymiary, API i tokenizacja wynikają z kodu. Nie deklaruje się realizacji wszystkich kryteriów pierwotnego zadania ani gotowości wszystkich kombinacji wizualnych.

Nie uruchomiono aplikacji CRM ani pełnego Playground w przeglądarce. Zbadano źródła i zapisane artefakty DS 1.0.168 oraz kod CRM z `master` i nowszej gałęzi `test`; nie pobierano paczki DS 1.0.170 do porównania z aktualnym źródłem biblioteki. Konfiguracja pipeline'u dowodzi sposobu publikacji, ale nie jej ostatniego sukcesu. README DS opisuje teksty jako tłumaczone przed przekazaniem; bieżący kod dodatkowo używa adaptera `VOTEY_TRANSLATOR`, co jest kontraktem opisanym w §5.1.5.

Test eksportów Angular w tej sesji analizy zatrzymał się przed asercjami na `ERR_MODULE_NOT_FOUND` dla `@angular/cdk`, importowanego przez Material. Wyniku nie traktuje się jako zaliczenia testów ani dowodu błędu samego Button. Zakres faktycznie wykonanych kontroli i istniejących testów rozdziela §8.3.

## 5. Zaimplementowane Rozwiązanie (AS-IS)

### HLD Obecnego Rozwiązania

Biblioteka DS jest artefaktem npm. Jej komponenty wykonują się w procesie aplikacji Angular hosta. Źródła tokenów JSON przechodzą przez Style Dictionary i silnik SCSS do globalnego CSS; źródłowe SVG są kopiowane do dystrybucji, a ng-packagr buduje publiczny entry point Angular. Paczka dostarcza także assety React, lecz nie dowodzi to istnienia Reactowego komponentu Button.

| Granica / komponent | Odpowiedzialność i kontrakt |
| --- | --- |
| Aplikacja hosta | Importuje komponent, udostępnia CSS i zasoby, podaje inputs, obsługuje `pressed`, decyduje o dostępności akcji. |
| `VoteyButtonComponent` | Wylicza klasy, wybiera tryb ikonowy i tooltip, renderuje przycisk; nie przechowuje wyniku operacji rodzica. |
| Natywny button | Obsługuje fokus, klawiaturę, disabled i typ formularza. Listener kliknięcia emituje `pressed`. |
| `vtTranslate` / `VOTEY_TRANSLATOR` | Synchronicznie zamienia tekst/klucz na string; domyślnie zwraca wejście. |
| `vt-icon` / `MatIconRegistry` | Renderuje ikonę według publicznej nazwy; rejestr wiąże nazwę z URL-em statycznego SVG. |
| Wrapper / `MatTooltip` | Utrzymuje podpowiedź niezależnie od wyłączenia wewnętrznego przycisku. |
| `vt-text` | Renderuje zawartość badge w wariancie `micro`, kolorze `primary`. |
| Storybook React/Vite | Tworzy aplikację Angular i instancję komponentu, aktualizuje inputs oraz odbiera `pressed`. Udostępnia zasoby statyczne. |
| CRM `test` | Buduje SPA z CSS i SVG DS 1.0.170, renderuje `vt-button` w widokach i dostarcza adapter tłumaczeń. Własny serwis przechowuje preferencję motywu. |
| GitHub Actions / npm / Vercel | Build i publikacja paczki oraz osobny podgląd Storybook; szczegóły w §11. |

Prezentacja ikon korzysta ze statycznych SVG pobieranych przez mechanizmy Material. Host udostępnia zasoby i obsługuje zdarzenie aktywacji przycisku.

### 5.1 Frontend (FE)

#### 5.1.1 Publiczne API `vt-button`

Wszystkie poniższe inputs są opcjonalne przy tworzeniu komponentu; domyślne wartości pochodzą z deklaracji `input`. `null` jest częścią kontraktu tylko tam, gdzie wymieniono go w typie. Typy są kontraktem TypeScript/Angular, nie osobnym walidatorem runtime. Komponent nie implementuje transformacji boolean ani walidacji biznesowej inputs.

| Input | Typ / wartości | Domyślnie | Efekt |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Klasa `disabled`, właściwość `disabled`, `aria-disabled`; wybór `disabledNote`. |
| `type` | `button`, `submit`, `reset` | `button` | Typ wewnętrznego elementu HTML; brak preventDefault w listenerze DS. |
| `variant` | `primary`, `secondary`, `link`, `danger`, `ghost`, `orange` | `primary` | Klasa stylu wizualnego. |
| `size` | `large`, `small` | `large` | Klasa rozmiaru. |
| `text` | `string` | pusty string | Tekst/klucz tłumaczenia; surowa niepusta wartość decyduje o obecności etykiety. |
| `ico` | `VoteyIcon` lub pusty string | pusty string | Nazwa z generowanego katalogu ikon; brak nazwy usuwa element ikony. |
| `badge` | `string`, `number`, `null` | `null` | Badge renderowany, gdy wartość nie jest `null` ani pustym stringiem. |
| `tooltipText` | `string` | pusty string | Podpowiedź, gdy przycisk jest aktywny. |
| `disabledNote` | `string` | pusty string | Podpowiedź, gdy przycisk jest wyłączony; bez fallbacku do `tooltipText`. |
| `ariaExpanded` | `boolean` lub `null` | `null` | Atrybut `aria-expanded` albo jego brak. |
| `ariaHasPopup` | `dialog`, `grid`, `listbox`, `menu`, `tree`, `boolean` lub `null` | `null` | Atrybut `aria-haspopup` albo jego brak. |
| `ariaControls` | `string` lub `null` | `null` | Atrybut `aria-controls`; identyfikator istniejącego elementu pochodzi od hosta. |

Output `pressed` ma payload `void`. Każde kliknięcie dostarczone do listenera natywnego buttona wywołuje `pressed.emit()`. Listener nie weryfikuje ponownie `disabled`; blokada normalnej aktywacji wynika z natywnego atrybutu i CSS. Ręczne wywołanie emitera nie jest blokowane przez ten mechanizm.

Nie ma inputów `hasIcon`, `iconOnly`, `state`, `loading` ani `ariaLabel`. Nie ma odrębnego outputu dla sukcesu/błędu, modelu formularza Button ani automatycznego zamknięcia popupu. Przekazane ARIA opisuje relację, ale jej nie tworzy i nie zarządza fokusem panelu.

#### 5.1.2 DOM, zawartość i dostępność

Wrapper oraz host mają `display: inline-flex`. Wewnątrz jest natywny button, a w nim kolejno: opcjonalna ikona, opcjonalny `span.label` i opcjonalny badge. Brak ikony usuwa jej węzeł; `gap` nie tworzy odstępu po nieistniejącym elemencie. Badge jest pozycjonowany absolutnie i nie stanowi dodatkowej kolumny normalnego układu.

Tryb ikonowy to dokładnie `Boolean(ico) && !text`. Puste oba pola pozostawiają przycisk bez etykiety i bez klasy `icon-button`. `text` nie jest przycinany, więc same spacje są wartością niepustą. Tłumaczenie na pusty string nie zmienia decyzji o trybie — decyduje surowy input. Kod nie ogranicza trybu ikonowego do primary/secondary i nie odrzuca połączenia z link.

Nazwa dostępna to pierwsza niepusta w sensie truthiness wartość: przetłumaczony `text`, przetłumaczona wybrana podpowiedź, surowe `ico`, a następnie `null` usuwający `aria-label`. Badge nie uczestniczy w tym fallbacku. Dla pustych pól komponent nie wymusza nadania nazwy; nazwa techniczna ikony może stać się nazwą dostępną. To opis ograniczenia stanu zastanego, nie deklaracja zgodności każdego użycia z wymaganiami dostępności.

`vt-icon` otrzymuje tylko `ico`, bez swojego `ariaLabel`; jego wewnętrzny `mat-icon` jest więc dekoracyjny (`aria-hidden=true`). Etykieta jest interpolowanym tekstem, nie HTML-em. Aktywny natywny button jest standardowo fokusowalny, a disabled pomijany w kolejności Tab. Brak lokalnego nadpisania `tabindex`.

`:focus-visible` ustawia cień `0 0 0 var(--spacing-2) var(--color-border-focus)`. Styl ghost w hover również ustawia `box-shadow`; przy równoczesnym hover i focus-visible jego późniejsza reguła może zastąpić ring cieniem hover. Dokument nie obiecuje niezależnego ringa dla każdej kombinacji pseudoklas.

#### 5.1.3 Geometria, typografia i kolory

Poniższa tabela opisuje deklaracje CSS, nie wykonany pomiar pikselowy. Rodzic i globalny arkusz mogą wpływać na wynikowy layout. Przycisk ma `box-sizing: border-box`, centrowanie flex, `white-space: nowrap`, bez zdefiniowanej maksymalnej szerokości, ellipsis ani lokalnego limitu tekstu. Ograniczenie szerokości lub overflow przez rodzica pozostaje poza komponentem.

| Tryb | Wysokość / szerokość | Padding | Typografia / ikona |
| --- | --- | --- | --- |
| `large`, poza link | Wysokość 44 px, szerokość z treści | `--space-control-padding-y`, `--space-control-padding-x` | `--typo-button-*`; slot ikony 20 × 20 px |
| `small`, poza link | Wysokość 28 px, szerokość z treści | 0 pionowo, `--spacing-12` poziomo | Nadal `--typo-button-*`; przy etykiecie slot ikony nadal 20 × 20 px |
| `link` z etykietą | Wysokość auto, szerokość z treści | 0 | `--typo-body-s-*`; obrys 0 i promień 0, również dla small |
| Icon-only `large`, poza link | 44 × 44 px | 0 | Slot ikony 20 × 20 px |
| Icon-only `small` | 28 × 28 px | 0 | Slot ikony 16 × 16 px |
| Icon-only `link large` | Szerokość 44 px, wysokość auto | 0 | Nie ma gwarancji koła: link zeruje promień i ustawia wysokość auto |

Domyślny promień to `--radius-button`; domyślny obrys to 1 px solid transparent. `danger` usuwa obrys, a `link` zeruje go. `gap` to `--space-icon-gap` dla obu rozmiarów. Small nie przełącza się na istniejące tokeny `--typo-button-small-*`.

W tabeli kolorów użyto skrótów: `accent/primary` oznacza `var(--color-accent-primary)` i analogicznie pozostałe nazwy. Kolumna treści odnosi się do koloru CSS buttona/etykiety. SVG może zawierać własne wypełnienia; nie jest automatycznie recolorowane w każdym stanie.

| Wariant | Default: tło / obrys / treść | Hover | Active | Disabled |
| --- | --- | --- | --- | --- |
| primary | accent/primary / accent/hover / accent/on-accent | accent/hover / accent/strong / accent/on-accent | accent/strong / accent/strong / accent/on-accent | border/subtle / border/subtle / text/muted |
| secondary | bg/surface / accent/primary / text/primary | bg/surface-tint / accent/primary / text/primary | bg/surface-tint / accent/strong / text/primary | bg/surface / border/subtle / text/muted |
| link | transparent / brak / accent/primary | Treść accent/hover | Treść accent/strong | Treść text/muted; nadal bez tła i obrysu |
| ghost | transparent / transparent / text/primary | Ten sam kolor, cień `0 --spacing-2 --spacing-8 shadow/soft` dla aktywnego przycisku | Tło i obrys transparent; cień hover może pozostać | text/muted, brak cienia |
| orange | yellow/50 / orange/300 / text/primary | Brak osobnej reguły kolorystycznej | Brak osobnej reguły kolorystycznej | Brak dedykowanych kolorów disabled; obowiązuje blokada wspólna |
| danger | red/400 / brak / bazowy text/primary | Biała warstwa `::before`, opacity 0.6, animowana od prawej połowy; promień warstwy `--radius-20` | Brak osobnej reguły kolorystycznej | Brak dedykowanych kolorów disabled; obowiązuje blokada wspólna |

Wspólna reguła `:active:not(:disabled)` skaluje przycisk do 0.98. Przejścia tła, obrysu, treści i cienia trwają 180 ms, transformacji 120 ms. Warstwa danger ma własne `transition: all 0.5s`. `prefers-reduced-motion: reduce` usuwa transition buttona, ale nie usuwa jego transformacji ani osobnej deklaracji transition pseudoelementu danger.

Disabled ustawia klasę i atrybut, `pointer-events: none` oraz `cursor: not-allowed` na buttonie. SCSS dodatkowo nadpisuje fill ścieżek SVG bez `fill="none"` oraz niepuste stroke ikon na `--color-text-muted`. Nie zmienia w ten sposób badge. Nie należy rozszerzać czterostanowej macierzy primary/secondary na orange/danger bez uwzględnienia ich opisanych wyjątków.

Badge ma min-width i wysokość 22 px, padding `--spacing-2`, pozycję top/right −7 px, obrys 2 px `--color-bg-surface`, promień `--radius-pill` i tło `--color-accent-primary`. Jego treść używa `vt-text micro primary`; nie ma lokalnego ograniczenia długości, skrótu `99+`, automatycznej pluralizacji ani live regionu.

#### 5.1.4 Tokeny, motyw i kontekst urządzenia

`tokens.angular.css` zawiera wspólny color core, semantykę CRM Light/Dark, radius, stałe `--spacing-*` oraz wygenerowane spacing/typografię. Generator używa m.in. `tokens/color/semantic-CRM/Light.json`, `Dark.json`, `tokens/space/semantic/*` i `tokens/type/semantic/*`.

Domyślna semantyka kolorów znajduje się na `:root`. Dark ma selektory `:root[data-theme="dark"]` oraz `[data-votey-theme="dark"]`. Przełączenie tych atrybutów zmienia zmienne, bez rozgałęzienia TS w Button. Nie oznacza to, że każda ikona z literalnym kolorem albo każdy wariant używający core colors zmienia wszystkie kolory.

Responsywne deklaracje są przypięte do `body[data-device=desktop|tablet|mobile]` i media queries. Źródła opisują tryby 360, 375, 768, 1024, 1280 i 1920 px; wynik uwzględnia interpolację i skalowanie w silniku `styles/angular/_responsive-token-engine.scss`. Nie należy zastępować tego kontraktu jednym stałym paddingiem lub font-size z Jiry. Zapisany CSS ma na `:root` zapasowe wartości `--space-* = 0px`; właściwe wartości nadpisuje kontekst urządzenia. To fallback generatora, nie dowód zerowych odstępów w poprawnie skonfigurowanym hoście.

CRM inicjalizuje `provideVoteyDeviceDetection()`, który ustawia atrybuty urządzenia/orientacji. Storybook ustawia `data-device` z globalnego toolbaru (domyślnie desktop), orientację z viewportu i aktualizuje kontekst przy resize. Komponent Button nie importuje tego providera samodzielnie. Host odpowiada za globalny CSS, kontekst i dostępność fontu; sama deklaracja font-family nie pobiera pliku fontu.

#### 5.1.5 Tłumaczenia, tooltip i SVG

`VoteyTranslatePipe` jest nieczysty (`pure: false`) i wywołuje synchronicznie `VoteyTranslator.translate(key, params?)`; dla pustego wejścia zwraca pusty string. Typ parametrów adaptera to rekord string → string lub number. Button nie przekazuje parametrów tłumaczenia. Token DI `VOTEY_TRANSLATOR` ma domyślną implementację identity: tekst wyświetlany jest bez zmiany. Badge jest przekazywany do `vt-text` bez tego pipe'a.

Wybrana treść tooltipu jest najpierw przycinana przez `trim()`, a następnie tłumaczona. Przy disabled wybierane jest wyłącznie `disabledNote`, w innym przypadku `tooltipText`. Wrapper wyłącza tooltip, gdy wynik tłumaczenia jest pusty, ustawia pozycję above i show delay 500 ms. Umieszczenie tooltipu na wrapperze pozwala niezależnie obsłużyć podpowiedź, mimo `pointer-events: none` na buttonie. Button nie implementuje własnego timera ani stanu oczekiwania.

`ico` jest nazwą z generowanego `VoteyIcon`, a nie dowolnym URL-em. `VoteySvgRegistryService` rejestruje publiczne ikony i ilustracje w `MatIconRegistry` jeden raz dla instancji serwisu, używając `DomSanitizer.bypassSecurityTrustResourceUrl`. Domyślna baza zasobów to `assets/votey`; `assetBaseUrl` z konfiguracji providera może ją zmienić. Końcowe slashe bazy są usuwane, a pusta baza pozostawia samą ścieżkę assetu.

Storybook mapuje `dist/assets/angular/svg-raw` na `/assets/votey`. Wywołanie `provideVoteySvgRegistry()` rejestruje URL-e przy inicjalizacji aplikacji; dostarczenie odpowiednich plików i zależności Material należy do hosta. Nie ma w Button własnego placeholdera, komunikatu ani retry dla błędu załadowania ikony. Nie opisuje się domyślnej reakcji biblioteki Material jako lokalnej gwarancji Button.

#### 5.1.6 Istniejący konsumenci DS i Storybook

| Konsument | Wykorzystanie Button i odpowiedzialność rodzica |
| --- | --- |
| Chip | Ghost/small z ikoną zamknięcia; przekazuje disabled i tooltip usuwania, a `pressed` zamienia na `removed`. |
| Select | Przyciski anulowania i aktualizacji wyboru, gdy aktywny jest tryb akcji wyboru. Rodzic wykonuje odpowiednią operację. |
| FilePicker | Ghost otwiera wybór pliku; opcjonalny ghost/small z ikoną usuwa plik. Rodzic oblicza efektywne disabled i własny loading. |
| MultiSelectPopover | Przycisk otwiera panel i przekazuje ARIA; osobne przyciski anulują/zatwierdzają. Potwierdzenie jest disabled przy braku elementów. Stan panelu należy do rodzica. |
| Playground Storybook | `createApplication` i `createComponent` tworzą rzeczywisty komponent Angular w hoście React. Props przechodzą przez `setInput`, `pressed` wywołuje akcję Storybook. Cleanup odpina subskrypcję/widok i niszczy instancje. |

Kontrolka Storybook o nazwie `icon` jest adapterem podglądu: `none` mapuje na pusty `ico`, `plus` na `ui-plus`, a pozostałe opcje na publiczne nazwy. Nie jest dodatkowym inputem publicznego komponentu. Historia `Playground` nie zawiera automatycznego scenariusza `play` pokrywającego całą macierz stanów.

#### 5.1.7 Integracja przycisku w CRM

W sprawdzonej gałęzi `test` komponenty CRM importują `VoteyButtonComponent` z publicznego entry pointu DS i używają `<vt-button>`. `src/app/auth/registration-confirmation/registration-confirmation.component.html` renderuje przycisk z kluczem `BUTTON.GO_TO_WYBOREK_PAGE` wewnątrz odsyłacza do `https://wyborek.pl`. `src/app/shared/warning-modal/warning-modal.component.ts` importuje komponent DS; jego template używa wariantów `secondary` i `danger`, podaje tekst lub ikonę przez inputs i obsługuje `(pressed)` w metodach zamknięcia oraz potwierdzenia. Logika callbacków i zamknięcia dialogu pozostaje w komponencie modalu.

`app.config.ts` dostarcza `provideVoteySvgRegistry()`, `provideVoteyDeviceDetection()` i `{ provide: VOTEY_TRANSLATOR, useExisting: AppTranslationService }`. Angular build kopiuje `**/*.svg` z `node_modules/@pleodigital/design-system-votey/dist/assets/angular/svg-raw` do `assets/votey` zarówno dla builda aplikacji, jak i konfiguracji testowej. Globalne style ładują `tokens.angular.css` paczki. W `src/app` gałęzi `test` nie znaleziono `app-button` ani katalogu lokalnego komponentu `shared/button`.

### 5.2 Design

Pomocniczym kontekstem z Jiry są [Button](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1608-108) i [icon_button](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1752-450). Bieżącej zawartości Figmy ani stanu publikacji biblioteki nie weryfikowano. Linki nie ustanawiają wiążącej zależności review; pełny opis zachowania zaimplementowanego znajduje się w tym Markdownie.

Nazwy, geometria, warianty i focus w §5.1 opisują kod, nawet gdy różnią się od opisu zadania. Nie przepisuje się do AS-IS niepotwierdzonych 24/16 kombinacji, wymiarów 45/42/35 px, osobnego przełącznika icon-only ani pełnej tokenizacji.

## 6. Aktualne Zachowanie (AS-IS)

### 6.1 Zachowanie Pozytywne

1. Host importuje publiczny komponent, udostępnia CSS i kontekst, a dla ikon — rejestr i pliki SVG. Ustawia inputs; klasy i podpowiedź aktualizują się z ich wartości.
2. Etykieta jest tłumaczona adapterem; ikonę, label i badge renderują warunki template'u. Ikona poprzedza etykietę.
3. Przeglądarka steruje hover, active i focus-visible. Zwykłe kliknięcie aktywnego buttona emituje `pressed` bez payloadu. Rodzic decyduje o dalszej akcji i jej stanie.
4. Dla `type=submit/reset` pozostaje natywne zachowanie formularza; DS go nie anuluje. Domyślny `button` nie deklaruje akcji submit.
5. Zmiana motywu hosta przełącza kolory semantyczne CSS; Button nie zmienia inputs ani własnego TS z tego powodu.

### 6.2 Zachowanie Negatywne I Edge Case

- Disabled blokuje zwykłą aktywację natywnego buttona i jego Tab focus, ale nie blokuje programowego emitowania outputu.
- Brak ikony usuwa slot, a brak tekstu i obecna ikona włącza `icon-button`. Brak obu nie tworzy zastępczej etykiety ani ikony.
- Spacje w `text` nie są przycinane. Tłumaczenie na pusty wynik nie zmienia warunku icon-only opartego na surowym wejściu.
- Badge `null` lub pusty string jest ukryty; `0` jest widoczne. Długi tekst badge nie ma lokalnego limitu.
- Puste `disabledNote` nie przywraca zwykłego tooltipu; może też zmienić fallback nazwy dostępnej na `ico`.
- Nie ma lokalnego stanu loading, error, empty, walidacji formularza ani permission state, poza samym inputem disabled i opcjonalną podpowiedzią. Sukces/błąd działania nie wpływa automatycznie na Button.
- Brak zasobu SVG, providera lub zależności runtime nie ma lokalnej ścieżki odzyskiwania w Button; nie obiecuje się zastępczej ikony.
- Link z samą ikoną nie jest odrzucany; `large` zachowuje wysokość auto i promień 0. Orange/danger nie otrzymują automatycznie szarej palety pozostałych wariantów.

### 6.3 Reguły Funkcjonalne I Cykl Życia

Button nie zapisuje danych trwałych ani historii kliknięć. Rodzic posiada dane wejściowe i akcję; pseudoklasy są ulotnym stanem przeglądarki. Komponent nie śledzi cyklu wykonania akcji rodzica.

Kontekstowy `CrmThemeService` jest właścicielem jednej preferencji w `localStorage` pod kluczem `WyborekCrmTheme`. Wartości odczytane z magazynu są akceptowane tylko jako `light` lub `dark`. Serwis ustawia `html.dataset.theme`, `html.style.colorScheme` i signal motywu.

| Stan wejściowy / trigger | Efekt w runtime | Persystencja / błąd |
| --- | --- | --- |
| Start aplikacji, zapisane light/dark | Zastosowanie zapisanej wartości | Inicjalizacja nie zapisuje ponownie wartości |
| Start, brak/niepoprawna wartość lub wyjątek odczytu | Zastosowanie light | Bez propagacji błędu i bez zapisu domyślnej preferencji |
| `setTheme(light/dark)` | Najpierw DOM i signal, potem próba zapisu | Zapis preferencji; wyjątek nie cofa widocznego motywu |
| `toggleTheme()` | Light ↔ dark przez setTheme | Ta sama semantyka zapisu |
| Ponowny start po nieudanym zapisie | Odczyt faktycznej wartości magazynu albo fallback light | Brak retry i brak odroczonej synchronizacji |

To lokalna preferencja przeglądarki. W analizowanym serwisie nie ma synchronizacji między kartami ani historii motywu. Brak dostępu do storage nie wyłącza bieżącego motywu. Button nie odczytuje tego klucza samodzielnie.

## 7. Kryteria Akceptacji (Given/When/Then)

Poniższe kryteria opisują odtworzony kontrakt AS-IS, nie wynik wykonania kompletnego zestawu testów. Stan pokrycia określa §8.3.

| ID | Given / When | Then |
| --- | --- | --- |
| AC-01 | Given import publicznego entry pointu; When odczytane są eksporty Button | Then selektor to vt-button, warianty i rozmiary odpowiadają §5.1.1. |
| AC-02 | Given aktywny button type=button; When otrzyma jedno kliknięcie przeglądarki | Then emituje jedno pressed bez payloadu. |
| AC-03 | Given disabled=true; When użytkownik próbuje aktywacji natywnego buttona lub nawigacji Tab | Then button pozostaje disabled i nie emituje pressed przez zwykłą aktywację, a Tab go pomija. |
| AC-04 | Given text i ico; When renderowane są oba, tylko ico albo żadne | Then kolejność to ikona–etykieta; tylko ico z pustym text włącza icon-button, a brak obu nie włącza tej klasy. |
| AC-05 | Given ico niepuste i text zawierający spacje lub klucz tłumaczony na pusty string; When obliczany jest tryb | Then surowy text pozostaje niepusty, więc icon-only nie jest włączony. |
| AC-06 | Given etykieta 40 znaków i host bez ograniczenia szerokości; When renderowany jest przycisk | Then etykieta pozostaje jedną linią, bez lokalnego ellipsis i limitu długości; geometria wynika z §5.1.3. |
| AC-07 | Given badge kolejno null, pusty string i 0; When zmienia się input | Then pierwsze dwie wartości ukrywają badge, a 0 jest renderowane przez vt-text micro primary. |
| AC-08 | Given tooltipText i disabledNote; When disabled zmienia się false → true | Then źródło tooltipu zmienia się na disabledNote, jest trimowane i tłumaczone; pusty wynik wyłącza tooltip bez fallbacku, niepusty ma above i delay 500 ms. |
| AC-09 | Given przetłumaczony text, tooltip i ico; When kolejne źródła nazwy są puste | Then aria-label wybiera pierwszą truthy wartość w tej kolejności, a brak wszystkich usuwa atrybut. Ikona pozostaje dekoracyjna. |
| AC-10 | Given nullable inputs ARIA; When podano wartość albo null | Then atrybut jest odpowiednio ustawiony albo usunięty; komponent nie tworzy ani nie otwiera powiązanego panelu samodzielnie. |
| AC-11 | Given primary/secondary/link/ghost i aktywny kontekst CSS; When zmieniają się hover, active i disabled | Then stosowane są reguły macierzy §5.1.3, w tym transformacja tylko dla active bez disabled. |
| AC-12 | Given orange/danger albo link icon-only; When następuje disabled lub zmiana rozmiaru | Then zachowane są wyjątki §5.1.3: brak dedykowanej palety disabled orange/danger, link large height:auto, small icon-only 28 × 28 px. |
| AC-13 | Given focus-visible; When nie działa późniejsza reguła ghost hover | Then button ma cień z tokenem border-focus; w kombinacji ghost hover obowiązuje opisana kaskada box-shadow. Reduced motion usuwa transition buttona, nie transition warstwy danger. |
| AC-14 | Given globalny tokens.angular.css; When host ustawi selektor dark | Then zmienia się semantyka kolorów, bez warunku TS w Button. Kontekst data-device steruje responsywnymi odstępami i typografią. |
| AC-15 | Given domyślny lub podmieniony VOTEY_TRANSLATOR; When renderowane są text i tooltip | Then identity zwraca wejście, a adapter hosta dostarcza wynik translate; badge nie przechodzi przez ten pipe. |
| AC-16 | Given publiczna nazwa ico i skonfigurowany rejestr; When vt-icon żąda ikony | Then nazwa wskazuje na URL z bazy i ścieżki assetu; ponowna rejestracja tej samej instancji serwisu nie dodaje ponownie wpisów. |
| AC-17 | Given widok potwierdzenia rejestracji i modal ostrzegawczy na gałęzi CRM `test`; When renderują swoje przyciski | Then używają `vt-button` z biblioteki; modal obsługuje `pressed` dla zamknięcia i potwierdzenia. |
| AC-18 | Given zapisany motyw albo brak/niepoprawna wartość; When CRM inicjalizuje serwis | Then stosuje poprawny motyw albo light, bez zapisu przy inicjalizacji. |
| AC-19 | Given CrmThemeService i dostępny lub niedostępny storage; When następuje toggle/setTheme | Then DOM i signal zmieniają się przed zapisem; wyjątek zapisu nie cofa motywu i nie jest propagowany. |
| AC-20 | Given manifesty, konfiguracja Angular i `src/app` CRM na gałęzi `test`; When sprawdzana jest integracja | Then DS jest przypięty do 1.0.170, CSS i SVG paczki są włączone w build, a w `src/app` występuje `vt-button` bez lokalnego `app-button`. |
| AC-21 | Given Button type=submit lub reset w formularzu; When nastąpi natywna aktywacja | Then listener DS emituje pressed bez preventDefault; zachowanie formularza pozostaje natywne. |

## 8. Rozszerzenia Stackowe I Weryfikacja

### 8.1 Kontrakty Techniczne: Angular

Kontrakt UI–UI zawiera inputs/output z §5.1.1, integrację CRM z §5.1.7 oraz adaptery z §5.1.5. Komponent otrzymuje wartości prezentacyjne przez inputs i przekazuje aktywację do rodzica.

Wartości ARIA controls, teksty, badge i decyzja disabled są własnością hosta. Nazwy SVG mają źródło w generowanym katalogu assetów paczki; URL buduje rejestr. Komponent nie waliduje istnienia elementu wskazanego przez ariaControls ani biznesowego znaczenia ikony. Tłumaczenie i rejestracja SVG są wstrzykiwanymi zależnościami prezentacji.

### 8.2 Jakość, Bezpieczeństwo I Ograniczenia

Natywne disabled steruje dostępnością interakcji, a atrybuty ARIA opisują kontrolkę dla technologii asystujących. Teksty są interpolowane, bez lokalnego innerHTML. Rejestr SVG ufa bazie zasobów skonfigurowanej przez aplikację; nie należy mylić tego z walidacją dowolnego URL-a od użytkownika. Button nie loguje danych ani zdarzeń biznesowych.

OnPush i computed ograniczają lokalne obliczenia; pipe tłumaczeń jest świadomie opisany zgodnie z kodem jako nieczysty. Nie wykonano pomiarów wydajności ani benchmarku, więc dokument nie deklaruje budżetu czasu renderowania. Brak lokalnych limitów tekstu/badge i odrębnego error/loading jest stanem zastanym. Specyfikacja nie nakłada nowego walidatora ani mechanizmu obsługi tych przypadków.

### 8.3 Mapowanie AC → Dowód I Test

| AC | Dowód implementacyjny / istniejąca automatyzacja | Stan weryfikacji |
| --- | --- | --- |
| 01 | DS `tests/angular-package.test.js`, test eksportów; `tests/angular-component-selectors.test.js` | Test selektorów wykonany: 1/1 PASS. Test eksportów podjęty, zablokowany brakującym @angular/cdk przed asercjami. |
| 02–13, 21 | DS `angular/src/lib/button/*.ts`, `*.html`, `*.scss`; Storybook `Button.stories.jsx` | Analiza source; brak zidentyfikowanego testu DOM/browser pełnej macierzy Button. Nie deklaruje się wykonania testu klawiatury, 40 znaków ani pomiarów rozmiaru. |
| 14 | DS `tests/angular-token-build.test.js`: zgodność semantyki Light/Dark, deterministyczny build, selektory i responsywność | Testy odczytane; nie uruchamiano ich w tej analizie. Sprawdzono generator i zapisany CSS. |
| 15 | DS `translation/votey-translation.ts`, `votey-translate.pipe.ts`, template Button | Potwierdzenie statyczne; brak wykazanego testu integracyjnego tłumaczeń Button. |
| 16 | DS `tests/angular-package.test.js`: rejestr wszystkich assetów raz i baza URL; `votey-svg-registry.service.ts` | Odczyt kodu/testów; nie deklaruje się wykonania testu sieciowego SVG. |
| 17 | CRM `auth/registration-confirmation/registration-confirmation.component.*`; `shared/warning-modal/warning-modal.component.*` | Użycia `vt-button` i `pressed` potwierdzone w kodzie gałęzi `test`. Test modalu sprawdza callbacki i zamknięcie dialogu, bez osobnego testu integracji Button w DOM; odczytany, nieuruchomiony. |
| 18–19 | CRM `_services/crm-theme.service.spec.ts` | Istniejące testy default light, odtworzenia dark, zapisu, toggle i awarii storage odczytane, nieuruchomione. Niepoprawna wartość magazynu wynika z serwisu. |
| 20 | CRM `test`: manifest, lockfile, `angular.json`, `app.config.ts`, wyszukanie użyć w `src/app` | Kontrola statyczna; nie uruchamiano builda ani testów CRM. |

Wykonana komenda selektorów: `node --test tests/angular-component-selectors.test.js`. Podjęta komenda eksportów: `node --test --test-name-pattern='Angular subpath exports' tests/angular-package.test.js`. Nie modyfikowano zależności, żeby wymusić wynik. Repozytorium CRM pozostało tylko źródłem odczytu; nie uruchamiano tam buildów ani testów zapisujących artefakty.

### 8.4 Źródła Dowodów

Ścieżki DS są względem `design-system-votey`, ścieżki CRM względem repozytorium `wyborek-crm` w rewizji gałęzi `test` wskazanej w §1. Poniższe źródła uzasadniają opis; nie trzeba ich otwierać, aby poznać kontrakt przedstawiony w dokumencie.

| Repozytorium | Źródła |
| --- | --- |
| DS — API i renderowanie | `angular/src/lib/button/votey-button.component.ts`, `.html`, `.scss`; `angular/src/public-api.ts` |
| DS — zależności | `angular/src/lib/icon/votey-icon.component.*`; `text/votey-text.component.*`; `translation/votey-translation.ts`; `translation/votey-translate.pipe.ts`; `angular/src/lib/votey-svg-registry.service.ts`; `votey-assets.ts` |
| DS — konsumenci | Template'y i komponenty w `angular/src/lib/chip`, `select`, `file-picker`, `multi-select-popover`; `storybook/stories/angular/Button.stories.jsx` |
| DS — tokeny i środowisko | `build-style-dictionary.mjs`; `tokens/color/semantic-CRM/{Light,Dark}.json`; `tokens/space`, `tokens/type`, `tokens/radius`; `styles/angular/_responsive-token-engine.scss`; `dist/css/tokens.angular.css`; `angular/src/lib/votey-device.service.ts` |
| DS — build i delivery | `package.json`; `angular/package.json`; `angular/ng-package.json`; `.storybook/main.js`; `.storybook/preview.jsx`; `.github/workflows/npm-publish.yml`; `.github/workflows/tokens-ci.yml` |
| DS — testy | `tests/angular-package.test.js`; `tests/angular-component-selectors.test.js`; `tests/angular-token-build.test.js` |
| CRM — użycia Button | `src/app/auth/registration-confirmation/registration-confirmation.component.{ts,html,spec.ts}`; `src/app/shared/warning-modal/warning-modal.component.{ts,html,spec.ts}`; pozostałe użycia `vt-button` w `src/app` |
| CRM — integracja i motyw | `package.json`; `package-lock.json`; `angular.json`; `src/app/app.config.ts`; `src/app/_services/app-translation.service.ts`; `src/app/_services/crm-theme.service.ts` i `.spec.ts`; `bitbucket-pipelines.yml`; `src/_redirects` |

## 9. Wpływ Na Inne Specyfikacje

Główna specyfikacja: `docs/sdd/button/specification.md`. Nie zmienia się kontraktów innych komponentów ani dokumentów CRM. Ich istniejące użycia służą wyłącznie potwierdzeniu granic komponentu i integracji. Dokument nie wymaga dostarczenia zależnej specyfikacji, żeby przeprowadzić review opisanego API Button.

Brak dodatkowego wpływu: tak. Affected specifications payload:

```json
[]
```

## 10. Wersjonowanie

Pierwszy dokument ma wersję `1.0.0`; brak podbicia wcześniejszej wersji, ponieważ nie istniała główna specyfikacja Button w repozytorium kanonicznym ani w sprawdzonym archiwum projektu. Wpis rejestru: `button: 1.0.0`. Wersja dokumentu jest niezależna od wersji paczki npm i nie uruchamia jej release'u.

## 11. Zaimplementowany Sposób Wdrożenia I Rollback

### 11.1 Build I Publikacja Paczki

Jednostką dystrybucji jest `@pleodigital/design-system-votey`; manifest publikuje katalog `dist` do publicznego npm. Subpath `./angular` wskazuje deklaracje typów oraz bundle FESM2022. Manifest root wymaga Node ≥22 i deklaruje opcjonalne peer dependencies Angular 21, Material 21 oraz RxJS 7.8; przy rzeczywistym użyciu komponentu zależności importowane przez jego runtime nadal są potrzebne. Ng-packagr buduje entry point `angular/src/public-api.ts` do `dist/angular`.

`npm run build` kolejno czyści dist, waliduje/buduje tokeny, generuje assety React, kopiuje raw SVG dla Angulara oraz buduje bibliotekę Angular; build Angular odświeża typy assetów.

Workflow `npm-publish.yml` reaguje na push do `main` i ręczne `workflow_dispatch`, pomijając automatyczne commity z prefiksem `chore(release):`. Używa Node 22, `npm ci`, walidacji i `test:tokens`, następnie pełnego builda. Potem wykonuje `npm version patch --no-git-tag-version` i publiczne `npm publish`. Token publikacji pochodzi z sekretu `NPM_TOKEN` przez `NODE_AUTH_TOKEN`; wartości sekretu nie należą do specyfikacji. Dopiero po udanej publikacji workflow commitnie oba manifesty i wypchnie commit wersji do main. Nie potwierdzano zewnętrznego statusu ostatniego wykonania pipeline'u.

### 11.2 Storybook, CRM I Konfiguracja Runtime

Osobny `tokens-ci.yml` filtruje push do `feature/**` i pull requesty według ścieżek. Instalacja, walidacja/testy i pełny build poprzedzają `build-storybook`. Tylko dla PR workflow przygotowuje Vercel prebuilt output z `storybook-static` i wykonuje preview deploy, z konfiguracją z sekretów `VERCEL_TOKEN`, `VERCEL_ORG_ID` i `VERCEL_PROJECT_ID`. Reguły path filter nie zawierają bezpośrednio `angular/**`; samodzielna zmiana wyłącznie tego katalogu nie stanowi wymienionego triggera preview. Nie jest to wdrożenie produkcyjne CRM.

Storybook serwuje dist oraz mapuje SVG do `/assets/votey`. W przeglądarce tworzy runtime Angular i udostępnia toolbar kontekstu urządzenia.

CRM na gałęzi `test` przypina paczkę 1.0.170 w `package.json` i `package-lock.json`. Angular build ładuje Material theme, potem `tokens.angular.css`, potem `src/styles.scss`. Oprócz `src/assets` kopiuje SVG DS z paczki do `assets/votey`; taka sama reguła istnieje w konfiguracji testowej. Inicjalizacja aplikacji uruchamia detekcję urządzenia, rejestr SVG, adapter `VOTEY_TRANSLATOR` oraz `CrmThemeService.initialize()`.

Build CRM generuje SPA do `dist/WyborekCms`; skrypty przewidują konfiguracje production/development/staging/test. `_redirects` kieruje trasy do index.html. Bitbucket uruchamia m.in. testy jednostkowe, raportowanie coverage i zaplanowane testy Cypress. W odczytanym pipeline nie znaleziono etapu wdrażającego CRM; dostawcy hostingu i procesu promocji na produkcję nie ustalono. Publikacja nowej paczki DS nie zmienia automatycznie wersji przypiętej w CRM.

### 11.3 Konfiguracja I Obserwowalność

Button nie posiada feature flagi. Jego warianty i dostępność są sterowane inputs opisanymi w §5.1.1. Preferencję motywu w przeglądarce opisuje §6.3.

Konfiguracja CI obejmuje testy i preview Storybook; nie sprawdzano wyników ostatnich uruchomień pipeline’ów. Akcja `onPressed` w Playground jest demonstracją zdarzenia, nie telemetryką produkcyjną. Brak dedykowanego monitoringu kliknięć, błędów działań, metryk albo audytu Button. CRM posiada konfigurację ogólnych raportów testowych, lecz nie potwierdza ona kompletnego pokrycia bibliotecznego vt-button.

### 11.4 Rollback

W analizowanych źródłach nie ma osobnego automatycznego rollbacku Button, procedury cofania wersji npm ani kontrolowanego przełącznika wariantów. Nie opisuje się hipotetycznej procedury jako istniejącego mechanizmu. Przypięcie wersji przez konsumenta izoluje go od automatycznego pobrania nowego wydania, ale samo w sobie nie dowodzi wykonania rollbacku aplikacji. Awaria zapisu preferencji motywu nie cofa bieżącego DOM; odrębny przypadek opisuje §6.3.

## 12. Definition Of Done

- [x] Opis biznesowy, techniczny i zakres odtworzono z obu repozytoriów, uwzględniając użycia bibliotecznego Button w CRM `test`.
- [x] Publiczne inputs/output, warunki renderowania, stany, zależności prezentacyjne i integrację z hostem opisano bez projektowania przyszłych zmian.
- [x] Kryteria AS-IS powiązano z dowodami i rzeczywistym stanem testów; luki pokrycia są jawne.
- [x] Wersjonowanie dokumentu odpowiada `docs/sdd/versioning.md`.
- [x] HLD i skonfigurowany delivery są opisane bezpośrednio w Markdown; podgląd graficzny nie jest wymagany do review.
- [ ] Wszystkie kryteria potwierdzono automatycznymi testami — nie: zakres i ograniczenia wskazuje §8.3.
- [ ] Zweryfikowano wersję i zachowanie produkcyjne — nie: analiza nie obejmuje produkcji.

Niezaznaczone pozycje oznaczają ograniczenia weryfikacji stanu obecnego, nie zamówienie implementacji ani ukrytą zmianę zakresu.

## 13. Workflow Handoff I Akceptacji

Status dokumentu: draft do przeglądu developerów. PleoAI obsługuje dalszą akceptację i uruchomienie Phoebe po wymaganej reakcji. Ten dokument nie deklaruje akceptacji Phoebe, wdrożenia ani zakończenia taska Jira. Autor nie publikuje workflow ani paczki w ramach tego kroku.
