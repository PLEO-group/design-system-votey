# WERSJA 1.0.0
# AUTOR n.koktysz@pleodigital.com & k.tryba@pleodigital.com

# Spec Driven Specification: Radio button — stan obecny

## 1. Metadane

- Data: 2026-09-23
- Status: Draft
- Powiązane zgłoszenia: WYBOREK-3053
- Feature slug: `radio-button`
- Typ dokumentu: `specification`
- Tryb pracy: `augment`, profil `AS_IS`
- Zidentyfikowany release / wersja wdrożenia: historia Git biblioteki potwierdza kod Radio w wydaniu 1.0.149, a bieżący manifest biblioteki podaje 1.0.170. Branch `origin/test` CRM (commit `a349c0edac78fd060815bf43406b8a083dc8c9bc`) deklaruje paczkę 1.0.170 w `package.json` i `package-lock.json` oraz używa `vt-radio-button`. Dev wskazuje tę wersję dla działającego CRM; artefaktu uruchomionego środowiska nie sprawdzono.
- Środowiska objęte analizą: checkout `design-system-votey` i kod `wyborek-crm` z `origin/test` oraz informacja deva o działającym CRM; nie uzyskano artefaktu działającego środowiska.
- Zakres feature: FE; BE nie uczestniczy w potwierdzonym kontrakcie komponentu.
- Zakres stacku: Angular 21, Angular Material radio, Angular Forms, SCSS i tokeny CSS generowane przez Style Dictionary; CRM jest konsumentem paczki npm.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Radio pozwala wybrać jedną z listy dostępnych odpowiedzi w formularzu korzystającym z komponentu biblioteki Wyborka. Użytkownik widzi etykiety opcji, zaznaczenie, stan niedostępności oraz komunikat walidacyjny po wejściu w stan błędnego i dotkniętego formularza. Wybrana opcja może pokazać dodatkową treść dostarczoną przez konsumenta. Na branchu `test` CRM korzysta z tego komponentu przy wyborze rodzaju głosowania w kalkulatorze, wariantu subskrypcji, sortowania wydarzeń oraz ustawień pytań i głosowania. W przejrzanych aktywnych szablonach radio nie znaleziono bezpośredniego użycia przycisków Angular Material.

### 2.2 Opis Techniczny

`VoteyRadioButtonComponent` eksportowany jako `vt-radio-button` otrzymuje tablicę opcji i korzysta z `FormControl` przekazanego przez konsumenta albo własnej kontrolki z klasy bazowej. Wewnątrz renderuje `MatRadioGroup` i `MatRadioButton`, wystawia zdarzenie `MatRadioChange`, tłumaczy etykiety oraz korzysta z `vt-form-error`. Wygląd opiera się na zmiennych CSS paczki. Komponent działa w przeglądarce; nie wywołuje API i sam nie utrwala wyboru.

## 3. Zakres

### 3.1 Zakres Biznesowy

- Konsument podaje co najmniej listę opcji z etykietą i wartością. Grupa wybiera jedną wartość, której bieżący stan jest przechowywany w kontrolce formularza.
- Kliknięcie opcji lub jej etykiety korzysta z interakcji `MatRadioButton`; zdarzenie zmiany wartości jest udostępnione konsumentowi.
- Opcja jest niedostępna, gdy jest oznaczona jako `disabled`, wyłączono grupę albo wyłączono kontrolkę formularza.
- Włączona opcja z `error` otrzymuje obrys błędu. Gdy ta sama opcja jest wyłączona, obrys pozostaje w kolorze stanu wyłączonego. Komunikat pod grupą pojawia się dla błędnej i dotkniętej kontrolki, z pominięciem wskazanych kodów błędów.
- Opcja o wartości wybranej w kontrolce może wyświetlić pod sobą dodatkowy szablon, jeśli ma `id` zgodne z `vtRadioOptionContent`.
- Dostępne są etykiety przed albo za polem oraz podpowiedź grupy; dla wyłączonej grupy podpowiedź może pochodzić z `disabledNote`.

### 3.2 Zakres Techniczny

- Biblioteka: komponent Radio, dyrektywa `VoteyRadioOptionContentDirective`, wspólna dyrektywa `VoteyFormControlApplyDirective`, tłumaczenie, `VoteyTextComponent` i `VoteyFormErrorComponent`.
- Kontrakt FE to tablica `VtRadioOption`, wejścia grupy i kontrolki formularza oraz wyjście `change`; szczegóły w §5.2 i §8.
- Styl używa semantycznych tokenów kolorów, typografii, odstępu i promienia oraz lokalnej stałej rozmiaru 20 px. Generowanie arkusza tokenów i budowa Angulara odbywają się w paczce npm.
- Branch `origin/test` CRM pinuje paczkę 1.0.170, ładuje `tokens.angular.css` i importuje `VoteyRadioButtonComponent` w formularzach używających `vt-radio-button`. W części formularzy importuje też `VoteyRadioOptionContentDirective`.
- Brak kontraktu API, eventów serwerowych, migracji i trwałego modelu danych dla komponentu w analizowanym zakresie.

### 3.3 Poza Zakresem

- Działanie backendu formularzy CRM i zapis odpowiedzi poza kontrolką w przeglądarce: komponent Radio nie zawiera wywołań sieciowych, a repozytorium BE nie jest źródłem jego kontraktu.
- Szczegóły logiki domenowej CRM i jej kontraktów z backendem poza przekazaniem wartości do komponentu Radio.
- Weryfikacja opublikowanej zawartości npm i faktycznie uruchomionego środowiska produkcyjnego: nie ma dowodu w dostępnych źródłach.

## 4. Stan Obecny (AS-IS)

Biblioteka zawiera implementację Radio i eksport z `angular/src/public-api.ts`. Historia Git potwierdza kod komponentu w wydaniu 1.0.149; bieżący manifest podaje 1.0.170. Storybook udostępnia `Playground` i `InsertableContent`. Test pakietu sprawdza publiczny selektor, część wejść oraz emisję zdarzenia zmiany; nie potwierdza pełnej macierzy stanów ani zachowania klawiatury w przeglądarce. Branch `origin/test` CRM ma zależność npm 1.0.170 i używa `vt-radio-button` w dziewięciu szablonach `src/app/client/`: w kalkulatorze, wyborze subskrypcji, formularzu pytania tak/nie, filtrze wydarzeń, głosowaniu, formularzach pytań ankietowych i tak/nie oraz liście członków. Wystąpienia `<mat-radio-button>` w szablonie ustawień głosowania są zakomentowane. Ta analiza kodu nie potwierdza samodzielnie, jaki commit uruchomiono na produkcji.

Ograniczenia stanu obecnego względem opisu WYBOREK-3053: `VtRadioOption.label` jest wymaganym stringiem, brak wejścia ukrywającego etykietę i wejścia `groupName`. CSS ustawia `white-space: nowrap` dla etykiety Material, więc zawijania długiej etykiety nie można uznać za wdrożone. Nie ma automatycznych testów potwierdzających wszystkie osiem kombinacji stanów, regułę fokusa ani zgodność z makietą Figmy. Źródłowy komponent zawiera własne reguły stanów, lecz ich identyczność z pełną macierzą Jiry nie została potwierdzona testem wizualnym.

## 5. Zaimplementowane Rozwiązanie (AS-IS)

### HLD Obecnego Rozwiązania

Granica właścicielska komponentu i tokenów znajduje się w `design-system-votey`. Źródła Angular i SCSS są budowane przez `ng-packagr`, a Style Dictionary generuje m.in. `dist/css/tokens.angular.css`; publiczny eksport `./angular` udostępnia komponent i dyrektywę. Artefakt trafia do paczki npm `@pleodigital/design-system-votey`. CRM jest oddzielną aplikacją Angular i na branchu `origin/test` deklaruje paczkę 1.0.170. Jego build dołącza arkusz tokenów; `CrmThemeService` ustawia `data-theme` na elemencie `html` i przechowuje wybór motywu w `localStorage`. Formularze CRM importują komponent biblioteki, przekazują do niego opcje i kontrolki, a w wybranych miejscach obsługują `change` oraz dostarczają szablony dodatkowej treści. Dotyczy to m.in. kalkulatora, subskrypcji, filtrów wydarzeń, pytań i głosowania. Kod branchu nie jest artefaktem uruchomionego środowiska.

W ramach samego `vt-radio-button` stan wyboru należy do `FormControl` i `MatRadioGroup`. Komponent mapuje opcje na `MatRadioButton`, przekazuje wartość, wyłączenie i wymaganie, tłumaczy etykietę oraz emituje `MatRadioChange`. Osobna dyrektywa identyfikuje szablon dodatkowej treści po `optionId`; szablon jest renderowany tylko pod aktualnie wybraną opcją o tym samym `id`. Kolory stanów pochodzą z semantycznych zmiennych CSS; arkusz tokenów definiuje wartości dla jasnego i ciemnego motywu, więc Radio obsługuje oba bez osobnego parametru. Nie istnieją tu baza danych, kolejka, endpoint, transakcja serwerowa ani integracja BE. Trwałość wartości zależy wyłącznie od konsumenta kontrolki.

### 5.1 Backend (BE)

N/A dla `vt-radio-button`: kod komponentu i jego kontrakt nie odwołują się do API, eventów, encji, migracji ani uprawnień backendowych. Szablony CRM używają komponentu do lokalnego wyboru w formularzach, lecz ewentualny zapis danych przez logikę tych formularzy należy do konsumenta. Repozytorium `wyborek-spring` nie było dołączone; nie jest wymagane do opisania potwierdzonego działania samodzielnego komponentu biblioteki.

### 5.2 Frontend (FE)

**Kontrakt opcji.** Publiczny typ `VtRadioOption<T = unknown>` ma poniższe pola `readonly`. Pole opcjonalne bez wartości pozostaje `undefined`; opisany wynik wynika z wartości podstawianej w szablonie.

| Pole | Typ i wymaganie | Wartość przy pominięciu / efekt |
| --- | --- | --- |
| `label` | `string`, wymagane | Tłumaczona etykieta opcji. |
| `value` | `T`, wymagane | Wartość przekazana do `MatRadioButton` i kontrolki. |
| `disabled` | `boolean`, opcjonalne | `false`; wyłącza opcję. |
| `required` | `boolean`, opcjonalne | `false`; przekazywane do `MatRadioButton`. |
| `error` | `boolean`, opcjonalne | `false`; dodaje klasę `radio-error`; kolor błędu dotyczy tylko włączonej opcji. |
| `labelPosition` | `"before" \| "after"`, opcjonalne | Dziedziczy `groupLabelPosition`. |
| `id` | `string`, opcjonalne | Przy pominięciu do elementu trafia `""`, a śledzenie listy używa indeksu. Jawne `id=""` jest kluczem śledzenia, lecz nie otwiera dodatkowej treści. Każde jawnie podane `id`, także puste, powinno być unikalne w pojedynczej tablicy `options`, aby klucze śledzenia nie powtarzały się. |
| `className` | `string`, opcjonalne | Pusta klasa przekazana do `MatRadioButton`. |
| `dataCy` | `string`, opcjonalne | `null` w wiązaniu atrybutu `data-cy`, więc atrybut nie jest dodawany. |

**Kontrakt wejść i wyjścia grupy.** Typ pozycji etykiety to `VoteyRadioButtonLabelPosition = "before" | "after"`. Wszystkie wejścia oprócz `options` są opcjonalne i mają poniższe wartości początkowe.

| Wejście / wyjście | Typ i wymaganie | Wartość domyślna / efekt |
| --- | --- | --- |
| `options` | `readonly VtRadioOption[]`, wymagane | Renderuje jedną opcję Material dla każdego elementu tablicy. |
| `groupLabelPosition` | `"before" \| "after"` | `"after"`; pozycja etykiet bez własnego `labelPosition`. |
| `groupDisabled` | `boolean` | `false`; wyłącza opcje w szablonie, nie wywołuje `formControl.disable()`. |
| `groupRequired` | `boolean` | `false`; przekazywane do `MatRadioGroup`. |
| `groupClass` | `string` | `""`; klasa grupy. |
| `tooltip` | `string` | `""`; tekst podpowiedzi przy włączonej grupie. |
| `disabledNote` | `string` | `""`; zastępuje `tooltip`, gdy `groupDisabled` jest `true`. |
| `ignoredErrors` | `string[]` | `[]`; filtruje surowy kod błędu albo jego klucz tłumaczenia `ERRORS.*`. |
| `change` | `OutputEmitterRef<MatRadioChange>` | Emisja niezmienionego `MatRadioChange`. |

**Wejścia formularza odziedziczone z `VoteyFormControlApplyDirective<unknown>`.** Wszystkie są opcjonalne; pominięcie nie wywołuje settera. Bez przekazanego `control` komponent tworzy lokalny `FormControl<unknown | null>(null)`.

| Wejście | Typ | Zachowanie po ustawieniu |
| --- | --- | --- |
| `control` | `FormControl<unknown \| null> \| null \| undefined` | Niepusta kontrolka zastępuje bieżącą; `null` i `undefined` nie zmieniają jej. |
| `initialValue` | `unknown \| null \| undefined` | `undefined` nie działa; inna wartość, również `null`, wywołuje `setValue` na bieżącej kontrolce. |
| `staticValue` | `unknown \| null \| undefined` | `undefined` nie działa; inna wartość wywołuje `setValue`, po czym `disable()` na bieżącej kontrolce. |
| `disable` | `boolean \| undefined` | `undefined` nie działa; `true` wywołuje `disable()`, `false` wywołuje `enable()` na bieżącej kontrolce. |
| `block` | `boolean` | Deleguje do `disable`; `true` wyłącza, `false` włącza bieżącą kontrolkę. |

Settery `control`, `initialValue`, `staticValue`, `disable` i `block` działają przy przypisaniu wejścia, bez trwałego priorytetu między nimi. Skutek dotyczy kontrolki bieżącej w chwili wykonania settera; późniejsze przypisanie `control` może ją zastąpić, a późniejsze `disable=false` lub `block=false` może włączyć kontrolkę wyłączoną przez `staticValue`. Gdy wejścia są używane łącznie, o końcowej wartości i stanie kontrolki decyduje kolejność faktycznych wywołań setterów. Samo `groupDisabled` wyłącza renderowane opcje niezależnie od `disable`/`block` kontrolki.

**Renderowanie i stan.** `mat-radio-group` jest związany z `formControl`; każda opcja jest `mat-radio-button` z przekazanym `value`. Wyłączenie opcji jest sumą trzech warunków: `option.disabled`, `groupDisabled` albo `formControl.disabled`. `required` na grupie i opcji jest przekazywane do Material. `change` przekazuje bez transformacji `MatRadioChange`. Opis dostępny dla grupy to połączone przecinkami przetłumaczone etykiety wszystkich opcji. Kod nie wystawia wejść nazwy grupy ani jej osobnego opisu ARIA.

**Etykiety i treść.** `VoteyTranslatePipe` tłumaczy tekst opcji; `vt-text` renderuje wariant `body` z kolorem `primary` lub `muted` dla opcji wyłączonej. `labelPosition` może ustawić etykietę przed albo za kontrolką. Dodatkowa treść jest mapowana po `optionId` i pojawia się tylko wtedy, gdy `formControl.value === option.value`, opcja ma `id` i znaleziono szablon. `@for` śledzi opcję po `option.id ?? $index`; brak `id` oznacza klucz indeksowy, a jawne `id=""` oznacza pusty klucz tekstowy. Komponent nie sprawdza unikalności `id`. Dwie opcje z tym samym niepustym `id` mają ten sam klucz śledzenia; Angular zgłasza ostrzeżenie `NG0955` w trybie deweloperskim, a stabilna tożsamość widoków przy aktualizacji listy nie jest gwarantowana. Mapa szablonów ma jeden wpis na dany identyfikator: każda opcja o tym `id`, której `value` jest równe bieżącej wartości kontrolki, otrzymuje ten sam szablon. Przy różnych wartościach dotyczy to aktualnie wybranej opcji; przy równych wartościach treść może pojawić się pod obiema.

**Kontrakt dyrektywy dodatkowej treści.** `VoteyRadioOptionContentDirective` ma selektor `ng-template[vtRadioOptionContent]`. Konsument importuje dyrektywę obok komponentu i umieszcza szablon wewnątrz `<vt-radio-button>`. Wartość atrybutu lub wiązania musi odpowiadać `id` opcji, np. `<ng-template vtRadioOptionContent="second">...</ng-template>` albo `<ng-template [vtRadioOptionContent]="selectedOptionId">...</ng-template>`.

| Wejście dyrektywy | Typ i wymaganie | Sposób użycia i efekt |
| --- | --- | --- |
| `optionId` (alias `vtRadioOptionContent`) | `InputSignal<string>`, wymagane przez `input.required<string>()` | Stały atrybut przekazuje tekst, a wiązanie `[vtRadioOptionContent]` przekazuje wyrażenie typu `string`. Dyrektywa udostępnia własny `TemplateRef<unknown>`; komponent zapisuje go w mapie pod otrzymanym identyfikatorem. Nie ma wartości domyślnej ani walidacji niepustego tekstu. |

Brak `vtRadioOptionContent` oznacza, że szablon nie pasuje do selektora dyrektywy; samo użycie atrybutu bez wartości daje pusty string, lecz szablon komponentu nie renderuje dodatkowej treści dla pustego `option.id`. Wiązanie zwracające `undefined` narusza zadeklarowany typ `string`; implementacja nie odrzuca takiej wartości w runtime i zapisuje szablon pod kluczem `"undefined"`, więc mógłby on pasować wyłącznie do wybranej opcji o dosłownym `id="undefined"`. Dla innego identyfikatora albo opcji bez `id` treść nie pojawia się. Gdy kilka szablonów ma ten sam `optionId`, ostatni wpis w mapie zastępuje wcześniejszy.

**Walidacja i podpowiedź.** `option.error` ustawia klasę `radio-error`, ale selektory koloru błędu obejmują tylko `:enabled`. Przy jednoczesnym `disabled` i `error` obrys ma kolor stanu wyłączonego (`--color-border-subtle` dla niezaznaczonej opcji oraz zaznaczonej z lokalnym nadpisaniem); błąd nie zastępuje stylu wyłączenia. `vt-form-error` otrzymuje klucze błędów wyłącznie dla `formControl.invalid && formControl.touched`; `ignoredErrors` filtruje kody. `MatTooltip` używa `tooltip`, a po wyłączeniu grupy `disabledNote`, z opóźnieniem 500 ms; pusta przetłumaczona treść wyłącza tooltip.

**Wygląd.** Kontrolka ma lokalnie 20 px, obrys 1,5 px dla niezaznaczonej i 2 px dla zaznaczonej. SCSS wiąże stan zwykły, hover, disabled i error ze zmiennymi kolorów, typografii, odstępu `--spacing-8` i promienia `--radius-10`. `radio-error` ma selektory obrysu opcji włączonej. Etykieta Material ma `white-space: nowrap`, co ogranicza długie opisy. Kolory zmieniają się z motywem przez `tokens.angular.css`; nie ma lokalnej flagi sterującej Radio.

**CRM (`origin/test`).** `angular.json` dołącza `tokens.angular.css`, a `package.json` i lockfile deklarują paczkę 1.0.170. Aktywne szablony `src/app/client/` używają `vt-radio-button` w dziewięciu plikach, a odpowiadające im komponenty TypeScript importują `VoteyRadioButtonComponent`. Kalkulator przekazuje `votingTypeRadioOptions` i `stepTwoForm.controls.typeOfVotings`; wybór subskrypcji przekazuje `subscriptionOptions` i `picked`, obsługując zmianę przez `onSubscriptionChange()`. Panel filtrów wydarzeń wiąże `sortOptions()` z `form.controls.sort`. Formularze pytań tak/nie przekazują opcje, kontrolki, stan wyłączenia i podpowiedzi oraz używają `vtRadioOptionContent` do pokazania dodatkowych pól przy wybranej opcji. CRM zawiera testy jednostkowe integracji Radio w `yes-no-form.component.spec.ts`: sprawdzają m.in. dodatkową treść, pojedynczą opcję i podmianę tooltipu po wyłączeniu grupy. Wystąpienia bezpośredniego `<mat-radio-button>` w szablonie ustawień głosowania są komentarzami. Lokalny `CrmThemeService` ustawia motyw aplikacji.

### 5.3 Design

Implementacja stylu Radio korzysta ze zmiennych semantycznych i komponentów Material. Linki Figmy znajdują się w WYBOREK-3053; makieta jest kontekstem, a nie dowodem aktualnego działania. W kodzie nie ma wariantu opcji bez etykiety, a etykieta Material jest ustawiona na jedną linię. Brak testu wizualnego, który potwierdza zgodność bieżącego komponentu z ośmioma wariantami makiety.

## 6. Aktualne Zachowanie (AS-IS)

### 6.1 Zachowanie Pozytywne

1. Konsument przekazuje opcje i może przekazać kontrolkę. Widok renderuje grupę Material i jedną kontrolkę dla każdej opcji.
2. Zmiana wyboru aktualizuje `FormControl`; komponent emituje otrzymane `MatRadioChange`.
3. Dla wybranej wartości i zgodnego `id` pojawia się dodatkowy szablon opcji.
4. Po ustawieniu motywu `dark` arkusz tokenów Angular podstawia ciemne wartości semantycznych zmiennych używanych przez Radio; motyw jasny korzysta z wartości bazowych bez zmiany kodu komponentu.

### 6.2 Zachowanie Negatywne I Edge Case

1. Opcja z `disabled`, wyłączona grupa albo wyłączony `FormControl` powodują przekazanie `[disabled]` do Material i kolor `muted` etykiety.
2. `option.error` zmienia obrys tylko włączonej opcji; ten stan nie blokuje wyboru w szablonie. Jeśli opcja jest równocześnie wyłączona, styl wyłączenia ma pierwszeństwo przed kolorem błędu.
3. Błędy kontrolki są renderowane po `invalid && touched`; przed tym stanem lista błędów przekazywana do `vt-form-error` jest pusta.
4. Gdy brak zgodnego `id` lub szablonu, dodatkowa treść nie jest renderowana. Brak przekazanego `control` pozostawia lokalny `FormControl(null)`.
5. Długi tekst etykiety ma ustawione `white-space: nowrap`; automatyczne zawinięcie nie jest kontraktem obecnej implementacji.
6. Powtórzone jawne `id` w jednej tablicy `options` tworzą powtórzony klucz `@for`; komponent nie odrzuca takich danych. Przy niepustym duplikacie obie opcje korzystają z tego samego wpisu mapy szablonów, jeśli ich `value` odpowiada wartości kontrolki.

### 6.3 Reguły Funkcjonalne

- Wartość wyboru jest własnością kontrolki formularza, a nie stanu zapisywanego przez bibliotekę.
- Nazwa dostępna grupy jest budowana z przetłumaczonych etykiet opcji i przypisywana do `aria-label`; indywidualna etykieta pochodzi z opcji. Jest to logika wewnętrzna komponentu biblioteki, nie wejście ani symbol używany przez CRM.
- Dodatkowa treść opcji wymaga jednocześnie wybranej wartości, `id` i zarejestrowanego szablonu.
- Radio obsługuje motywy jasny i ciemny przez semantyczne tokeny CSS oraz atrybut motywu dokumentu; nie potrzebuje parametru Light/Dark.

## 7. Kryteria Akceptacji Aktualnego Stanu

| ID | Warunek | Obserwowany wynik |
| --- | --- | --- |
| **AC-01** | Przekazano poprawną tablicę `options` i wyrenderowano `vt-radio-button`. | Powstaje grupa Material i po jednym radio dla każdej opcji z jej wartością oraz etykietą. |
| **AC-02** | Użytkownik zmienia zaznaczenie. | Wartość `FormControl` odzwierciedla wybór, a `change` emituje `MatRadioChange`. |
| **AC-03** | Opcja lub grupa jest wyłączona albo wyłączono kontrolkę. | Odpowiadające radio ma stan disabled i etykietę w kolorze `muted`. |
| **AC-04** | Włączona opcja ma `error`; kontrolka może być także błędna i dotknięta. | Obrys opcji otrzymuje kolor `--color-state-error`. Dla błędnej i dotkniętej kontrolki `vt-form-error` otrzymuje kody błędów, a `ignoredErrors` filtruje je przed wyświetleniem. |
| **AC-05** | Wartość kontrolki odpowiada opcji z niepustym `id` i szablonowi `<ng-template vtRadioOptionContent="...">` o tym samym identyfikatorze. | Dodatkowy szablon tej opcji jest widoczny; przy niezgodnym identyfikatorze lub pustym `id` nie jest renderowany. |
| **AC-06** | Przełączono `data-theme` z jasnego na ciemny. | Arkusz tokenów podstawia odpowiednie semantyczne kolory Radio bez zmiany wejść ani kodu komponentu. |
| **AC-07** | Sprawdzono kod CRM na branchu `origin/test`. | `package.json` i lockfile deklarują 1.0.170; aktywne szablony kalkulatora, subskrypcji, filtrów i głosowania używają `vt-radio-button`, a test formularza tak/nie sprawdza integrację dodatkowej treści. |
| **AC-08** | Opcja ma jednocześnie `error=true` oraz `disabled=true`, `groupDisabled=true` albo wyłączoną kontrolkę. | Opcja jest wyłączona; klasa `radio-error` pozostaje na elemencie, lecz selektory błędu `:enabled` nie działają i obrys zachowuje kolor stanu wyłączonego. |
| **AC-09** | Dyrektywa otrzymuje pusty identyfikator albo wiązanie przekazuje `undefined`. | Pusty identyfikator nie wyświetla treści. `undefined` jest poza zadeklarowanym typem `string`; w runtime trafia pod klucz `"undefined"` i może wyświetlić treść tylko dla wybranej opcji o dosłownym `id="undefined"`. |
| **AC-10** | Dwie opcje w jednym `options` mają to samo niepuste `id`, a szablon używa tego identyfikatora. | Obie opcje mają ten sam klucz `@for`; w trybie deweloperskim Angular zgłasza `NG0955`. Komponent nie waliduje ani nie deduplikuje opcji. Ten sam szablon jest dostępny pod obiema opcjami, lecz renderuje się tylko tam, gdzie `formControl.value === option.value`; przy jednakowych wartościach może pojawić się pod obiema. Stabilność tożsamości widoków po zmianie listy nie jest gwarantowana. |

## 8. Kontrakty Techniczne I Wymagania Niefunkcjonalne

| Obszar | Kontrakt obecnego stanu |
| --- | --- |
| Publiczne API | `@pleodigital/design-system-votey/angular` eksportuje `VoteyRadioButtonComponent`, `VoteyRadioOptionContentDirective` i typy Radio. Selektor to `vt-radio-button`; dyrektywa treści ma selektor `ng-template[vtRadioOptionContent]` i wymagane wejście `optionId: InputSignal<string>` pod aliasem `vtRadioOptionContent`. Pełny kontrakt wejścia i mapowania jest w §5.2. |
| Stan i zdarzenie | Angular `FormControl<T \| null>` jest przekazywany przez wejście `control` albo powstaje wewnątrz komponentu. Wyjście `change` emituje `MatRadioChange`. Brak własnego requestu HTTP i eventu domenowego. |
| Dane | Tablica opcji żyje w pamięci konsumenta; wartość grupy jest w kontrolce. Brak encji, migracji, indeksu, historii i backfillu w repo biblioteki. |
| Dostępność | `MatRadioGroup` i `MatRadioButton` dostarczają semantykę radio Material. Szablon nadaje grupie `aria-label` z przetłumaczonych etykiet; nie ma oddzielnego wejścia tekstowej nazwy dla opcji bez etykiety. Działania klawiatury zależą od Material; brak lokalnego testu E2E potwierdzającego szczegóły nawigacji. |
| Styl i motyw | SCSS używa `--color-accent-primary`, `--color-accent-hover`, `--color-border-strong`, `--color-border-subtle`, `--color-state-error`, `--color-bg-surface`, `--color-bg-surface-tint`, `--color-text-primary`, `--color-text-muted`, tokenów typografii, `--spacing-8`, `--space-control-padding-y` i `--radius-10`. Rozmiar 20 px i grubości obrysu są lokalnymi wartościami. |
| Testy | `tests/angular-package.test.js` potwierdza selektor, alias wejścia dyrektywy, wybrane wejścia komponentu i emisję `MatRadioChange`. `tests/angular-token-build.test.js` kontroluje generowanie arkusza. Storybook pokazuje Playground i dodatkową treść; test CRM `yes-no-form.component.spec.ts` sprawdza zgodny identyfikator. Przypadki pustego lub `undefined` z AC-09 wynikają z mapowania i warunku w kodzie; osobnego testu tych przypadków nie znaleziono. AC-08 wynika z selektorów SCSS `:enabled` i wiązania `[disabled]` w szablonie; osobnego testu wizualnego tej kombinacji nie znaleziono. AC-10 wynika z klucza `@for`, mapy szablonów i diagnostyki `NG0955` w lokalnym Angularze; osobnego testu duplikatów opcji nie znaleziono. |
| Integracja CRM | Branch `origin/test` deklaruje paczkę 1.0.170, dołącza arkusz tokenów i używa `vt-radio-button` w aktywnych formularzach. `yes-no-form.component.spec.ts` sprawdza dodatkową treść wybranej opcji, grupę z jedną opcją oraz podpowiedź wyłączonej grupy. |
| Uprawnienia i bezpieczeństwo | Komponent nie zawiera własnej autoryzacji ani dostępu do danych serwerowych. Walidacja dotyczy `FormControl` konsumenta i prezentacji błędu. |

## 9. Wpływ Na Inne Specyfikacje

- Specyfikacja główna: niniejszy dokument `radio-button`.
- Inne zaktualizowane specyfikacje: brak.
- Brak dodatkowego wpływu: tak; nie znaleziono lokalnych specyfikacji powiązanych w kanonicznym repozytorium.
- Affected specifications payload: `[]`.

## 10. Wersjonowanie

- Wersja dokumentu: `1.0.0`, pierwsza pełna specyfikacja AS-IS.
- Wpis rejestru: `radio-button: 1.0.0` w `docs/sdd/versioning.md`.
- Numery `1.0.149` z historii wydania biblioteki i `1.0.170` z manifestu biblioteki oraz zależności branchu `origin/test` CRM są wersjami paczki, a nie wersją tego dokumentu.

## 11. Zaimplementowany Sposób Wdrożenia I Rollback

### 11.1 Rollout

Repo biblioteki buduje tokeny przez Style Dictionary i moduł Angular przez `ng-packagr`; `npm run build` wytwarza katalog `dist`. Workflow `.github/workflows/npm-publish.yml` uruchamia walidację tokenów i testy, budowę, podbija patch numeru paczki oraz publikuje do npm po push do `main` albo uruchomieniu ręcznym. Token publikacyjny pochodzi z sekretu workflow; jego wartość nie jest częścią specyfikacji. Ten opis potwierdza konfigurację pipeline'u, nie potwierdza historii faktycznie wykonanych publikacji.

Branch `origin/test` CRM pinuje w `package.json` i lockfile paczkę 1.0.170. Jego `angular.json` dołącza `tokens.angular.css`, `CrmThemeService` ustawia `data-theme`, a formularze importują i renderują `vt-radio-button`. Historia Git potwierdza kod Radio w wydaniu biblioteki 1.0.149. W analizowanym kodzie brak feature flagi Radio. Komponent nie ma migracji ani backfillu. Repo biblioteki nie zawiera specyficznego dla Radio monitoringu runtime; weryfikacja opiera się na buildzie, testach pakietu i Storybooku, a CRM zawiera test jednostkowy powiązań Radio w formularzu tak/nie. Repozytoria nie dowodzą, który artefakt jest uruchomiony na produkcji.

### 11.2 Rollback

Nie znaleziono osobnego mechanizmu rollbacku Radio. Artefakt jest wersjonowaną paczką npm, a CRM deklaruje konkretną wersję zależności; zmiana wersji konsumenta wymaga odrębnej zmiany jego builda. Konfiguracja workflow publikacyjnego nie definiuje automatycznego wycofania opublikowanej paczki. Brak danych o wykonanym rollbacku i produkcyjnej obserwowalności tego komponentu.

## 12. Definition Of Done — opis stanu obecnego

- [x] Odróżniono implementację biblioteki od użycia w CRM.
- [x] Opisano kontrakt opcji, wartości, stanów, błędów, motywu i dystrybucji wraz z granicami dowodów.
- [x] Kryteria w §7 dotyczą zachowania wynikającego z obecnego kodu; zakres istniejących testów wskazano w §8.
- [x] Użycie komponentu i wersję zależności zweryfikowano na branchu `origin/test` CRM; odróżniono kod branchu od artefaktu produkcyjnego.

## 13. Workflow Handoff I Akceptacji

- Status: Draft AS-IS do review przez osoby wskazane przez PleoAI.
- Kanonicznym materiałem review jest wyłącznie ten Markdown. Diagram draw.io i PNG są pomocniczym podglądem.
- Publikacja workflow i uruchomienie niezależnej analizy Phoebe należą do PleoAI po wymaganej akceptacji.

## Źródła Dowodów I Ograniczenia Analizy

- `design-system-votey/angular/src/lib/radio-button/`: implementacja, szablon, SCSS i dyrektywa treści.
- `design-system-votey/angular/src/lib/directives/votey-form-control-apply.directive.ts`, `form-error/`, `translation/`, `angular/src/public-api.ts`: stan formularza, błędy, tłumaczenie i eksport.
- `design-system-votey/build-style-dictionary.mjs`, `package.json`, `.github/workflows/npm-publish.yml`, `storybook/stories/angular/RadioButton.stories.jsx`, `tests/angular-package.test.js`, `tests/angular-token-build.test.js`: tokeny, dystrybucja i pokrycie testowe.
- `wyborek-crm` `origin/test` (`a349c0edac78fd060815bf43406b8a083dc8c9bc`): `package.json`, `package-lock.json`, `angular.json`, `src/app/_services/crm-theme.service.ts`, szablony i komponenty pod `src/app/client/` oraz `yes-no-form.component.spec.ts` potwierdzają wersję zależności, motyw, użycie i część testów integracji Radio.
- Historia Git `design-system-votey` dla wydania 1.0.149: obecność kodu Radio i jego semantycznych tokenów. Informacja deva o działającym CRM 1.0.170 jest spójna z deklaracją zależności na `origin/test`, ale sam branch nie dowodzi wdrożenia produkcyjnego.
- WYBOREK-3053: pomocniczy opis planu i makiet; nie służy do potwierdzania wdrożonego zachowania.
- Analiza nie obejmuje artefaktu uruchomionego środowiska, zawartości opublikowanych paczek npm ani repozytorium backendu, ponieważ potwierdzony kontrakt `vt-radio-button` nie korzysta z BE.
