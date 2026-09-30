# WERSJA 1.0.0
# AUTOR k.tryba@pleodigital.com & n.koktysz@pleodigital.com

# Spec Driven Specification: Checkbox (AS-IS)

## 1. Metadane

- Data analizy: 2026-09-23 (Europe/Warsaw).
- Status dokumentu: Draft AS-IS.
- Powiązane zgłoszenie: WYBOREK-3050.
- Feature slug: `checkbox`.
- Typ dokumentu: `specification`.
- Tryb pracy: `augment`, profil `AS_IS`, zakres `MULTI_REPO`.
- Rewizja źródłowa biblioteki: `design-system-votey` commit `5030042f710331065b6099c80a3f0697c53bf0b6`; pliki implementacji Checkboxa w analizowanym checkoutcie nie mają lokalnych zmian. Ten commit jest podstawą opisu kontraktu i zachowania komponentu, a nie potwierdzeniem zawartości opublikowanej paczki npm.
- Zidentyfikowany release / wersja wdrożenia: źródłowy `package.json` biblioteki oraz `wyborek-crm/package.json` w referencji `origin/test` deklarują `@pleodigital/design-system-votey` `1.0.170`. Nie ustalono, która wersja działa na poszczególnych środowiskach.
- Środowiska objęte analizą: kod biblioteki oraz kod i konfiguracja CRM z referencji `origin/test`; brak obserwacji działającego środowiska. Checkout `master` CRM jest starszy i deklaruje paczkę `1.0.140`.
- Zakres feature: FE, współdzielona biblioteka Angular; CRM jako kontekst konsumenta.
- Zakres stacku: FE Angular; dla samego komponentu nie zidentyfikowano kontraktu BE.
- Źródło normatywne dla tego review: niniejszy Markdown. Diagram draw.io i PNG są wyłącznie opcjonalnym podglądem.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Checkbox umożliwia osobie korzystającej z interfejsu zaznaczenie albo odznaczenie pojedynczej opcji. Biblioteka udostępnia jedną kontrolkę z opcjonalną treścią etykiety, stanem niedookreślonym ustawianym przez miejsce użycia, stanem wyłączonym i sygnalizacją błędu. W samej bibliotece kontrolka jest używana w panelu wyboru wielu pozycji: zaznaczenie pozycji zmienia lokalny wybór, który panel może następnie zatwierdzić.

Brak treści etykiety nie blokuje renderowania pola, ale aktualny komponent nie gwarantuje wtedy nazwy dostępnej dla czytnika ekranu. Jest to ograniczenie istniejącego wariantu, a nie potwierdzona cecha dostępności.

W kodzie CRM z referencji `origin/test` ta kontrolka służy między innymi do zaznaczenia zgody przy rejestracji, wyboru usług w kalkulatorze, wyboru uczestników na liście oraz ustawień powiadomień. Każdy z tych widoków utrzymuje własny stan formularza lub wyboru; komponent DS dostarcza pole i przekazuje zmianę, lecz nie określa skutku biznesowego całego widoku.

### 2.2 Opis Techniczny

`VoteyCheckboxComponent` jest publicznie eksportowanym komponentem `vt-checkbox` pakietu `@pleodigital/design-system-votey/angular`. Opakowuje `MatCheckbox`, wiąże go z `FormControl<boolean | null>`, przekazuje wejścia stanu i emituje `changed` z wartością `event.checked`. Komponent używa zmiennych CSS wygenerowanych z tokenów DS, assetu SVG jako maski znaku zaznaczenia oraz `vt-form-error` do komunikatów dla dotkniętej, niepoprawnej kontrolki.

Granica odpowiedzialności przebiega w przeglądarce. Checkbox nie ma własnego API sieciowego, magazynu danych ani kodu backendowego. Dane wyboru należą do nadrzędnego formularza albo komponentu, a ich ewentualne utrwalenie zależy od tego miejsca użycia.

## 3. Zakres

### 3.1 Zakres Biznesowy

- Kontrolka pokazuje opcję z tekstem `label` lub treścią projektowaną; bez obu tych źródeł renderuje samo pole. Wariant bez treści jest technicznie osiągalny i występuje w CRM, ale obecny kontrakt komponentu nie zapewnia mu dostępnej nazwy.
- Miejsce użycia może ustawić stan niedookreślony, wyłączenie kontrolki, wymagalność oraz sygnalizację błędu. Zaznaczenie jest przechowywane w powiązanym formularzu.
- Dla aktywnej kontrolki kliknięcie pola zmienia zaznaczenie, a wynik jest przekazywany do miejsca użycia. Obsługę samej interakcji zapewnia kontrolka bazowa.
- W panelu wielokrotnego wyboru biblioteki kliknięcia pozycji aktualizują lokalny szkic wyboru; dopiero potwierdzenie panelu emituje listę identyfikatorów pozycji. Pozycje oznaczone jako wyłączone są w tym panelu pomijane.
- W CRM `vt-checkbox` obsługuje zgodę rejestracyjną, opcje kalkulatora, wybór uczestników i opcje powiadomień. Formularze oraz widoki CRM określają walidację, aktualizację lokalnego stanu i dalszą akcję.

### 3.2 Zakres Techniczny

- Repozytorium `design-system-votey`: komponent Angular, wspólna dyrektywa `FormControl`, `MatCheckbox`, prezentacja błędów, CSS, tokeny Light/Dark, SVG checkmark, publiczny eksport, Storybook, testy pakietu i skrypty budowania npm.
- Repozytorium `wyborek-crm` (tylko odczyt): referencja `origin/test` deklaruje paczkę `1.0.170`, importuje `tokens.angular.css` i używa `VoteyCheckboxComponent` w widokach. Nie powstaje w nim drugi dokument ani zmiana kodu.
- Stan `checked` pochodzi z `FormControl`; `indeterminate` jest osobnym modelem Angular. `disabled` jest wynikiem wejścia komponentu lub stanu wyłączenia kontrolki formularza. Wejście `error` dodaje klasę wizualną, natomiast komunikaty błędu wynikają z `invalid && touched`.
- Kolory i typografia odwołują się do zmiennych CSS; rozmiary kontrolki, część geometrii znaku i obrysów oraz odstęp etykiety mają w SCSS wartości literalne albo tokeny bazowe. Konkretne różnice opisuje §5.2.

### 3.3 Poza Zakresem

- Zmiana istniejących widoków CRM, ich logiki biznesowej i kontraktów API.
- Projektowanie wariantów z opisu Jiry, których obecny kod nie realizuje.
- Implementacja, migracje i kontrakty backendowe: własny komponent nie komunikuje się z backendem.
- Wymaganie konkretnego pierścienia fokusa z powiązanego zgłoszenia WYBOREK-3064; w kodzie `vt-checkbox` nie ma własnej reguły jego geometrii.
- Publikacja paczki, zmiana środowisk, uruchomienie review lub poprawki implementacji.

## 4. Stan Obecny (AS-IS)

W bibliotece istnieje jeden komponent `vt-checkbox`, dostępny przez entry point Angular. W `vt-multi-select-popover` każdy element listy otrzymuje własny `FormControl<boolean>` i renderuje `vt-checkbox`; panel utrzymuje wybór lokalnie do zatwierdzenia. Storybook udostępnia interaktywny `Playground` i steruje stanem zaznaczenia przez kontrolkę formularza.

W referencji `origin/test` CRM importuje paczkę DS `1.0.170`, jej arkusz tokenów oraz komponent `VoteyCheckboxComponent` w widokach. W `src/app` tej referencji nie znaleziono użyć `<mat-checkbox>` ani `input type="checkbox"`, a `src/styles/checkbox.scss` nie istnieje. Starszy checkout `master` zawiera te elementy; nie opisuje jednak stanu referencji `origin/test`. Lista uczestników i okno przypisywania grup zawierają instancje `vt-checkbox` bez tekstu etykiety przekazanego do komponentu.

Rozbieżności względem opisu Jiry, istotne dla odczytania aktualnego stanu: obrys błędu w komponencie jest zdefiniowany tylko dla niezaznaczonego pola; etykieta ma `white-space: nowrap`; brak osobnego wejścia ukrywającego etykietę i wejścia `ariaLabel`; odstęp etykiety używa `--spacing-8`, a promień `--radius-6`. Komponent renderuje `vt-form-error`. Tych ograniczeń nie należy odczytywać jako zaprojektowanego zachowania docelowego.

## 5. Zaimplementowane Rozwiązanie (AS-IS)

### HLD Obecnego Rozwiązania

Biblioteka DS jest pakietem npm, a nie osobną usługą runtime. Jej publiczny entry point `./angular` eksportuje `VoteyCheckboxComponent`; aplikacja lub inny komponent Angular tworzy instancję lokalnie w przeglądarce. Komponent wiąże stan formularza z `MatCheckbox`. Angular Material odpowiada za natywną kontrolkę i zdarzenia interakcji; komponent DS odpowiada za publiczne wejścia, wyjścia, powiązanie formularza, maskę SVG i wygląd przez CSS.

Źródłem prawdy dla zaznaczenia jest przekazany `FormControl`, a gdy go nie przekazano — własna kontrolka utworzona przez wspólną dyrektywę. Osobny model `indeterminate` jest przekazywany do Angular Material i aktualizowany po `indeterminateChange`. Wyjście `changed` przesyła bieżące `event.checked`; samo nie utrwala danych. Dla błędów formularza komponent bierze klucze `errors` wyłącznie po `invalid && touched`, filtruje `ignoredErrors`, przekształca je do kluczy `ERRORS.*` i wyświetla przez `vt-form-error` z rolą `alert`. Wejście `error` steruje osobno klasą wyglądu; nie jest wyliczane z walidacji formularza.

Wygląd kontrolki korzysta z CSS `vt-checkbox` i zmiennych w `tokens.angular.css`. Tokeny Light obowiązują domyślnie, a wartości Dark definiują selektory `[data-theme="dark"]` i `[data-votey-theme="dark"]`. Wybór trybu należy do konsumenta; w komponencie nie ma gałęzi warunkowej dla motywu. Adres assetu znaku powstaje z opcjonalnego `VOTEY_SVG_REGISTRY_CONFIG.assetBaseUrl`, domyślnie `assets/votey`, i jest wstawiany jako zmienna maski CSS. Źródłowy SVG ma własny literalny `fill`, ale w kontrolce kolor widocznego znaku nadaje `background-color` maski.

`wyborek-crm` jest oddzielną aplikacją Angular. W referencji `origin/test` deklaruje tę samą wersję paczki co bieżący checkout biblioteki, importuje arkusz tokenów i kopiuje assety SVG do `assets/votey` podczas budowania. Widoki rejestracji, kalkulatora, listy uczestników i powiadomień importują `VoteyCheckboxComponent`; przekazują mu własne kontrolki formularzy albo obsługują `changed`. Stan wyboru i ewentualna persystencja należą do tych widoków. Sam biblioteczny Checkbox nie ma kolejki, bazy danych, eventu sieciowego, endpointu, migracji ani granicy transakcji backendowej.

### 5.1 Backend (BE)

N/A dla bibliotecznego Checkboxa. Kod `VoteyCheckboxComponent` i jego szablon nie wykonują żądania API ani nie zapisują danych trwale. Miejsca użycia w CRM mogą przekazywać wybrany stan do własnych procesów, ale ich kontrakty backendowe należą do tych procesów, a nie do samej kontrolki.

### 5.2 Frontend (FE)

#### Kontrakt komponentu

| Wejście lub wyjście | Aktualny kontrakt |
| --- | --- |
| `control` | Opcjonalny `FormControl<boolean | null>` przyjmowany przez wspólną dyrektywę; brak przekazania pozostawia własną kontrolkę o początkowej wartości `null`. |
| `initialValue`, `staticValue` | Ustawiają wartość kontrolki; `staticValue` dodatkowo ją wyłącza. |
| `disable`, `block`, `disabled` | `disable` i `block` zmieniają stan `FormControl`; wejście `disabled` jest łączone logicznie z `formControl.disabled` dla `MatCheckbox`. |
| `indeterminate` | Model `boolean`, domyślnie `false`; powiązany z wejściem i `indeterminateChange` Angular Material. |
| `required`, `error` | Wymagalność jest przekazywana do `MatCheckbox`; `error` ustawia klasę `checkbox-error`. |
| `label`, treść projektowana | `label` jest tłumaczony przez `vtTranslate` jako treść zastępcza, gdy nie ma projekcji; treść projektowana jest wyświetlana wewnątrz `MatCheckbox`. |
| `labelPosition`, `id`, `name`, `value` | Przekazywane do `MatCheckbox`; pozycja etykiety to `before` albo `after`, domyślnie `after`. |
| `ignoredErrors` | Lista kluczy komunikatów odfiltrowanych z `vt-form-error`. |
| `changed` | Emisja `boolean` z `MatCheckboxChange.checked`; nie jest wywołaniem API. |

Komponent nie deklaruje wejść `checked`, `ariaLabel` ani `ariaDescribedby`. Szablon nie przekazuje też do wewnętrznego `MatCheckbox` alternatywnej nazwy ARIA. W Storybooku argument `checked` ustawia `FormControl`, co nie zmienia publicznego API komponentu.

#### Prezentacja i stany

- Pole `.mdc-checkbox` i jego tło mają 20 × 20 px; obrys bazowy ma 1,5 px i używa `--color-border-strong`, promień to `--radius-6`. Dla aktywnych stanów checked i indeterminate obrys jest zerowany, a wypełnienie bierze `--color-accent-primary`.
- Znak checked używa SVG `icon_sp_check.svg` jako maski CSS oraz `--color-accent-on-accent` jako koloru; kreska indeterminate ma szerokość 10 px i kolor tokenowy. Dla disabled znak używa `--color-text-muted`, tło niezaznaczone `--color-bg-surface-tint`, a obrys `--color-border-subtle`.
- Przy urządzeniu z precyzyjnym wskaźnikiem `:hover` zmienia obrys pola niezaznaczonego oraz wypełnienie zaznaczonego na `--color-accent-hover`. Wejście `error` ustawia `--color-state-error` tylko dla aktywnego pola niezaznaczonego. Ponieważ reguła błędu występuje po regule hover i ma równoważną specyficzność, obrys błędu niezaznaczonego pola pozostaje podczas hover. Nie ma reguły obrysu błędu dla checked ani indeterminate.
- Etykieta korzysta z tokenów typografii `--typo-body-*`, ale ma `white-space: nowrap`, `height: 20px` na kontenerze i `padding-left: var(--spacing-8)`. Kod nie potwierdza zawijania długiej etykiety ani usunięcia odstępu przy pustej etykiecie.
- `disableRipple` usuwa efekt ripple. SCSS definiuje tokeny kolorów dla stanu focus i pressed Angular Material, lecz nie definiuje osobnego rysowania pierścienia fokusa. Zachowanie klawiatury i relacja klikania w etykietę są delegowane do `MatCheckbox`; w repozytorium nie ma dla nich testu przeglądarkowego.
- Błąd formularza jest odrębny od wizualnego wejścia `error`: pojawia się przy `invalid && touched`, po odfiltrowaniu `ignoredErrors`. Nie ma lokalnych stanów loading, empty ani permission; komponent nie pobiera danych. Pusta lista pozycji i przyciski panelu wielokrotnego wyboru należą do `vt-multi-select-popover`.

#### Miejsca użycia

W samej bibliotece `vt-multi-select-popover` renderuje `vt-checkbox` dla każdej pozycji listy i podaje kontrolkę zbudowaną z bieżących `selectedIds`. Zmiana pola aktualizuje lokalny zbiór identyfikatorów; `confirm` emituje `confirmed` z listą w kolejności `items`. W CRM z referencji `origin/test` formularz rejestracji wiąże zgodę z `termsControl` oraz `requiredTrue`, kalkulator wiąże wybór usług z kontrolkami `stepTwoForm`, a `changed` dla usługi wideo steruje widocznością ustawienia czasu. Lista uczestników używa `selectAllControl` i kontrolek pozycji oraz obsługuje ich `changed`; część tych pól nie ma treści etykiety wewnątrz `vt-checkbox`. Okno przypisywania grup również renderuje takie pola obok nazwy grupy. Opcje powiadomień mają osobne kontrolki, a `changed` oznacza lokalną zmianę. Storybook `Playground` prezentuje publiczne wejścia i wyjście.

### 5.3 Design

Kod implementuje pojedynczy komponent, a nie dwanaście osobnych komponentów. Źródłem aktualnej prezentacji są `votey-checkbox.component.scss`, wygenerowane tokeny i asset SVG. Odnośniki do Figmy w Jirze opisują kontekst projektowy; nie zastępują dowodu, że każdy wariant został wdrożony. Różnice między projektem opisanym w zadaniu a kodem są wymienione w §4 i §5.2.

## 6. Aktualne Zachowanie (AS-IS)

### 6.1 Zachowanie Pozytywne

1. Nadrzędny komponent przekazuje `FormControl` albo korzysta z kontrolki własnej; jej wartość trafia do `MatCheckbox`.
2. Zmiana pola wywołuje `changed` z nową wartością `boolean`; miejsce użycia może zaktualizować własny stan. W `vt-multi-select-popover` aktualizowany jest lokalny szkic wyboru.
3. Ustawienie `indeterminate` pokazuje mieszany stan Angular Material; komponent aktualizuje model po `indeterminateChange`.
4. Ustawienie odpowiedniego atrybutu motywu na przodku przełącza wartości tokenów CSS używane przez komponent, o ile konsument załadował arkusz tokenów.

### 6.2 Zachowanie Negatywne I Edge Case

1. `disabled()` lub wyłączony `FormControl` przekazują `disabled` do `MatCheckbox`; komponent nie ma osobnego mechanizmu obsługi kliknięcia wyłączonego pola.
2. Wejście `error` rysuje obrys błędu tylko dla aktywnego pola niezaznaczonego. Checked i indeterminate pozostają bez tego obrysu w aktualnym SCSS.
3. Długa etykieta pozostaje w jednym wierszu według `white-space: nowrap`; nie ma potwierdzenia zachowania przy trzech liniach.
4. Bez `label` i treści projektowanej pole nadal się renderuje i reaguje na zmianę. Komponent nie przekazuje do wewnętrznego `MatCheckbox` alternatywnej nazwy ARIA ani nie blokuje takiego użycia; dlatego dostępna nazwa tej kontrolki nie jest zagwarantowana. W CRM `origin/test` występują takie instancje w tabeli uczestników i oknie przypisywania grup. Tekst w sąsiedniej komórce lub elemencie listy nie jest w kodzie powiązany z wewnętrzną kontrolką jako jej nazwa.
5. Brak konfiguracji assetów stosuje domyślną bazę `assets/votey`; kod nie dodaje fallbacku wizualnego, jeżeli plik SVG pod tym adresem nie zostanie dostarczony.

### 6.3 Reguły Funkcjonalne

- Zaznaczenie jest stanem kontrolki formularza; `indeterminate` jest modelem odrębnym. Komponent nie zapisuje wyboru w bazie.
- Wizualne `error` oraz komunikat wynikający z walidacji formularza mają różne przesłanki.
- Tokeny CSS są odczytywane w runtime; aktywowanie Dark należy do konsumenta.
- W panelu wielokrotnego wyboru pozycja wyłączona nie zmienia szkicu; panel emituje wynik dopiero po `confirm`.

## 7. Kryteria Akceptacji Aktualnego Stanu (Given/When/Then)

| ID | Given | When | Then |
| --- | --- | --- | --- |
| AC-01 | Jest instancja `vt-checkbox` z przekazanym `FormControl<boolean>`. | Użytkownik zmienia zaznaczenie, a `MatCheckbox` emituje `(change)`. | `MatCheckbox` korzysta z przekazanej kontrolki, a komponent emituje `changed` z `event.checked`. Samo programowe `setValue` nie jest tu uznane za zdarzenie `(change)`. |
| AC-02 | `indeterminate` ma wartość `true`. | Angular Material emituje `indeterminateChange`. | Model `indeterminate` komponentu przyjmuje wartość zdarzenia. |
| AC-03 | Wejście `disabled` jest `true` lub `FormControl` jest wyłączony. | Szablon wiąże stan do `MatCheckbox`. | `MatCheckbox` otrzymuje `disabled=true`. |
| AC-04 | Wejście `error` jest `true`, a pole aktywne i niezaznaczone. | Renderowany jest styl komponentu. | Obrys używa `--color-state-error`; dla checked i indeterminate ten sam SCSS nie deklaruje obrysu błędu. |
| AC-05 | Kontrolka formularza jest `invalid` i `touched`. | Powstaje lista błędów. | `vt-form-error` pokazuje nieignorowane klucze `ERRORS.*` z rolą `alert`; bez obu przesłanek lista jest pusta. |
| AC-06 | Konsument ustawił bazę assetów SVG. | Tworzony jest komponent. | URL maski wskazuje `icons/special/icon_sp_check.svg` pod tą bazą; bez konfiguracji używana jest baza domyślna. |
| AC-07 | Komponent działa w `vt-multi-select-popover`. | Użytkownik zmienia pozycję i zatwierdza panel. | Szkic wyboru zostaje zaktualizowany, a `confirmed` emituje identyfikatory w kolejności `items`; pozycja disabled jest pomijana. |
| AC-08 | Analizowany jest kod CRM z referencji `origin/test`. | Sprawdzamy zależność i miejsca użycia Checkboxa. | `package.json` deklaruje paczkę `1.0.170`, a rejestracja, kalkulator, lista uczestników i powiadomienia renderują `vt-checkbox`; w `src/app` tej referencji nie ma `<mat-checkbox>` ani `input type="checkbox"`. |
| AC-09 | Instancja `vt-checkbox` nie otrzymuje `label` ani treści projektowanej. | Renderowany jest jej szablon. | Powstaje pole bez tekstu etykiety; komponent nie przekazuje alternatywnej nazwy ARIA do wewnętrznego `MatCheckbox` i nie gwarantuje nazwy dostępnej. Taki wariant występuje w CRM `origin/test`. |

Kryteria są kontraktem opisu aktualnego kodu. AC-01, AC-06 i część AC-07 mają istniejące testy pakietu wywołujące logikę bez interakcji przeglądarkowej; pozostałe wynikają z powiązań szablonu, SCSS i kodu CRM w referencji `origin/test`. Nie są deklaracją spełnienia wszystkich kryteriów z Jiry.

## 8. Rozszerzenia Stackowe I Kontrakty Techniczne: Angular

### 8.1 Struktura FE i dane

Publiczny import pochodzi z `@pleodigital/design-system-votey/angular`; `angular/ng-package.json` buduje entry point do `dist/angular`. Nie ma routingu, guarda ani resolvera specyficznego dla Checkboxa. Lokalne wartości `FormControl`, model `indeterminate` i szkic wyboru panelu nie są trwałą persystencją. Nie zidentyfikowano DTO, endpointu, eventu, migracji ani operacji transakcyjnej tego komponentu.

### 8.2 Integracja, walidacja i dostępność

Wejścia typu `boolean`, `string`, `string[]` oraz `FormControl<boolean | null>` są lokalnym kontraktem Angular, a nie schematem sieciowym. `vtTranslate` obsługuje tekstową wartość `label` i komunikaty `ERRORS.*`; treść projektowana może zawierać własny tekst. W obecnym API tekst `label` lub treść projektowana są jedynymi jawnymi źródłami tekstu etykiety przekazywanego do wewnętrznego `MatCheckbox`. Wariant bez nich jest renderowalny i używany w CRM, ale komponent nie zapewnia dla niego nazwy dostępnej ani nie egzekwuje jej podania. Nie jest to potwierdzony wariant dostępny dla czytnika ekranu; nie ma też testu jego dostępnej nazwy. Angular Material zapewnia natywną kontrolkę, lecz w tym repozytorium nie ma testu nawigacji tabulatorem ani reakcji na spację. Nie ma lokalnego stanu loading ani pustych danych dla pojedynczego pola.

### 8.3 Źródła dowodów

- `design-system-votey` commit `5030042f710331065b6099c80a3f0697c53bf0b6`: `angular/src/lib/checkbox/votey-checkbox.component.{ts,html,scss}` — niezmienna rewizja źródłowa publicznych wejść, szablonu, stanów i styli. Deklarowana wersja npm `1.0.170` nie dowodzi tożsamości z opublikowanym artefaktem.
- `design-system-votey/angular/src/lib/directives/votey-form-control-apply.directive.ts`, `angular/src/lib/form-error/*`, `angular/src/lib/votey-svg-registry.service.ts`, `angular/src/public-api.ts` — formularz, błędy, adres assetu i eksport.
- `design-system-votey/angular/src/lib/multi-select-popover/*`, `storybook/stories/angular/Checkbox.stories.jsx`, `tests/angular-package.test.js` — użycie biblioteczne, podgląd i testy.
- `design-system-votey/package.json`, `angular/ng-package.json`, `dist/css/tokens.angular.css`, `assets/icons/special/icon_sp_check.svg` — budowanie, wersja, tokeny i SVG.
- `wyborek-crm` w referencji `origin/test` (`a349c0edac78fd060815bf43406b8a083dc8c9bc`): `package.json`, `angular.json`, `src/styles.scss`, `src/app/auth/register/*`, `src/app/client/calculator/*`, `src/app/client/members/members-list/*`, `src/app/client/members/members-list/assign-modal/*`, `src/app/client/settings/notifications/*` oraz wyszukiwanie `src/app` — wersja konsumenta, import tokenów i assetów, użycia komponentu (także bez etykiety) oraz brak dawnego arkusza i dawnych kontrolek.

## 9. Wpływ Na Inne Specyfikacje

- Specyfikacja główna: niniejszy dokument `docs/sdd/checkbox/specification.md`.
- Inne zaktualizowane specyfikacje: brak. Potwierdzone użycia `vt-checkbox` w CRM są opisane tutaj jako kontekst konsumenta; repozytorium CRM pozostaje tylko do odczytu.
- `affectedSpecifications`: `[]`.
- Zgłoszenie WYBOREK-3064 dotyczy stylu fokusa kontrolek, ale w tym opisie nie jest zależnością konieczną do zrozumienia aktualnego działania Checkboxa.

## 10. Wersjonowanie

- Decyzja o wersji dokumentu: pierwsza pełna specyfikacja `1.0.0`; bez sztucznego bumpa.
- Rejestr `docs/sdd/versioning.md`: `checkbox: 1.0.0`.
- Numer paczki npm i wersja dokumentu są różnymi wartościami; ta specyfikacja nie zmienia kodu ani wersji paczki.

## 11. Zaimplementowany Sposób Wdrożenia I Rollback

### 11.1 Jednostki, konfiguracja i rollout

`design-system-votey/package.json` definiuje `npm run build`: czyszczenie `dist`, generowanie tokenów przez Style Dictionary, transformację i kopiowanie SVG oraz budowanie Angular przez `ng-packagr`. Pakiet udostępnia `./angular` i pliki `dist/*`; `publishConfig` wskazuje publiczny rejestr npm. Te wpisy potwierdzają sposób przygotowania artefaktu, nie wykonanie publikacji. Nie znaleziono flagi feature dla Checkboxa.

CRM ma własną jednostkę budowania Angular. W referencji `origin/test` `package.json` deklaruje paczkę `1.0.170`, `angular.json` ładuje jej `dist/css/tokens.angular.css` i kopiuje SVG do `assets/votey`, a widoki importują komponent z entry pointu Angular. `src/styles.scss` nie dołącza osobnego arkusza Checkboxa i nie istnieje tam `src/styles/checkbox.scss`. Nie potwierdzono, że referencja `origin/test` odpowiada każdemu uruchomionemu środowisku. Dla samej kontrolki nie ma migracji bazy, backfillu ani etapowego przełączenia ruchu.

### 11.2 Obserwowalność i rollback

Obserwowalność komponentu w repo ogranicza się do Storybooka, testów pakietu i efektu w UI. Nie stwierdzono lokalnych logów, metryk, telemetryki użytkowej ani alertów specyficznych dla Checkboxa. Repo nie dokumentuje wykonanej procedury rollbacku środowiskowego; możliwa do stwierdzenia granica wersji to zależność npm konsumenta. Nie przypisujemy tej granicy konkretnej operacji wdrożeniowej ani nie deklarujemy zweryfikowanego cofnięcia.

## 12. Definition Of Done Dla Opisu AS-IS I Plan Weryfikacji

- [x] Oddzielono potwierdzony stan komponentu od wymagań Jiry oraz opisano jego miejsca użycia w CRM z referencji `origin/test`.
- [x] Opisano HLD, publiczny kontrakt Angular, stan formularza, CSS, asset, pakowanie i granice BE.
- [x] Powiązano kryteria AC-01, AC-06 i część AC-07 z istniejącymi testami `tests/angular-package.test.js`; pozostałe, w tym AC-09, z kodem szablonu, styli i CRM w referencji `origin/test`.
- [x] Utrzymano zgodność `# WERSJA` i `docs/sdd/versioning.md`.
- [ ] Testy runtime pakietu wymagają poprawnego zestawu zależności. Próba `node --test tests/angular-package.test.js` w tym checkoutcie zakończyła się przed asercjami przez brak `@angular/cdk` w `node_modules`; nie jest dowodem błędu zachowania Checkboxa.
- [ ] Testy przeglądarkowe klawiatury, dostępnej nazwy oraz układu wielowierszowej etykiety nie zostały potwierdzone w dostępnych źródłach.

## 13. Workflow Handoff I Akceptacji

- Stan: lokalna remediacja dokumentu AS-IS po review Phoebe.
- Następny krok: PleoAI ponownie uruchomi Phoebe na poprawionym dokumencie; ta edycja nie publikuje workflow.
- Ograniczenie analizy: żądanie kontekstu prespecki WYBOREK-3050 przez oficjalny helper zwróciło HTTP 403. Analiza CRM opiera się na referencji `origin/test`, ponieważ dołączony checkout `master` jest starszy; nie deklarujemy na tej podstawie stanu innych środowisk. Kontrakt AS-IS powyżej wynika z dostępnego kodu, konfiguracji i testów.
