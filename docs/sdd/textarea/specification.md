# WERSJA 1.0.0
# AUTOR k.tryba@pleodigital.com

# Spec Driven Specification: Textarea (AS-IS)

## 1. Metadane

- Data analizy: 2026-09-24 (Europe/Warsaw).
- Status: Draft AS-IS.
- Powiązane zgłoszenia: WYBOREK-3059.
- Feature slug: `textarea`.
- Typ dokumentu: `specification`.
- Tryb pracy: `create`, profil `AS_IS MULTI_REPO`.
- Zidentyfikowany release / wersja wdrożenia: `design-system-votey/package.json` deklaruje wersję paczki `1.0.170`; faktycznej wersji uruchomionej na konkretnym środowisku nie ustalono.
- Środowiska objęte analizą: kod źródłowy i konfiguracja repozytoriów; bez obserwacji działającego środowiska.
- Zakres feature: publiczny komponent Textarea biblioteki Votey oraz jego kontrakt z aplikacją korzystającą z komponentu.
- Zakres stacku: Angular, Reactive Forms i CSS variables (`design-system-votey`); wstrzyknięcie translatora potwierdzone w `wyborek-crm`. Backend nie uczestniczy w działaniu samego komponentu.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Textarea pozwala użytkownikowi wpisywać i edytować wielolinijkowy tekst w formularzu. Komponent wyświetla bieżącą wartość, a aplikacja korzystająca z pola decyduje o jej zapisie. Etykieta, podpowiedź i tekst pomocniczy są opcjonalne; brak etykiety nie blokuje renderowania ani edycji. Komponent może pokazać błąd walidacji i zablokować edycję. Nie ma domyślnego limitu znaków; aplikacja może go przekazać dla konkretnego użycia.

### 2.2 Opis Techniczny

`VoteyTextAreaComponent` jest publicznym komponentem Angular paczki `@pleodigital/design-system-votey/angular` o selektorze `vt-text-area`. Wiąże natywny element `<textarea>` z przekazanym `FormControl` albo własnym kontrolerem odziedziczonym po `VoteyFormControlApplyDirective`. Komponent renderuje teksty przez `VoteyTextComponent` i błędy przez `VoteyFormErrorComponent`, korzysta z CSS variables paczki, emituje `changed` i `keyDown`. Sam nie wykonuje żądań HTTP ani nie zapisuje danych.

## 3. Zakres

### 3.1 Zakres Biznesowy

- Wprowadzanie i edycja wielolinijkowego tekstu; komponent przekazuje wpisaną wartość kontrolerowi formularza, a jej dalsze użycie należy do aplikacji.
- Etykieta, placeholder i tekst pomocniczy pojawiają się po ich przekazaniu. Brak etykiety nie blokuje działania pola. Komponent nie ustawia domyślnego limitu znaków; opcjonalny limit jest przekazywany przez aplikację.
- Wpisanie tekstu nadaje polu stan wypełniony; fokus, błąd walidacji i blokada edycji mają własne style. Błąd pojawia się po oznaczeniu niepoprawnego kontrolera jako dotkniętego.
- Natywne pole przyjmuje nową linię przez Enter, respektuje `maxlength` również podczas wklejania i przewija dłuższą treść wewnątrz pola. Wysokość obramowania pozostaje stała.
- Gdy konsument poda własny helper, to on jest pokazywany. Bez helpera, przy ustawionym `maxLength`, komponent pokazuje tłumaczony tekst z bieżącą długością i limitem.

### 3.2 Zakres Techniczny

- Publiczny eksport biblioteki, komponent, dyrektywa kontrolera formularza, renderer tekstu, renderer błędów, style i Storybook.
- Kontrakt z aplikacją Angular: przekazany `FormControl`, opcjonalne wejścia komponentu, zdarzenia `changed` i `keyDown` oraz translator podłączany przez `VOTEY_TRANSLATOR`.
- Komponent nie ma własnego API sieciowego, trwałego magazynu ani kontraktu backendowego.

### 3.3 Poza Zakresem

- Wprowadzanie zmian w kodzie, tokenach, API, bazie danych lub zachowaniu komponentu.
- Edytor formatowania tekstu, osobny stan hover i ręczny uchwyt zmiany rozmiaru; komponent ich nie implementuje.
- Formularze, endpointy, reguły domenowe i magazyny danych aplikacji korzystających z pola.

## 4. Stan Obecny (AS-IS)

Kod biblioteki udostępnia jeden komponent `vt-text-area`. Obudowa `.field` ma literalne `height: 120px` i `min-height: 120px`, a wewnętrzny `.control` ma `overflow: auto` i `resize: none`. Nie ma pomiaru `scrollHeight` ani wzrostu do 320 px. Style korzystają częściowo ze starszych zmiennych, m.in. `--radius-input`, `--spacing-8`, `--spacing-16` i `--color-text-muted` dla placeholdera; wygenerowany arkusz tokenów zawiera także nowsze nazwy semantyczne. Komponent nie zapewnia statycznego komunikatu limitu: domyślny komunikat używa wartości `current` i `max`.

Opis Jiry podaje zachowania i tokeny, które nie są zgodne z powyższą implementacją. W tym dokumencie są one ograniczeniem porównania źródeł, a nie wymaganiami aktualnego stanu.

## 5. Zaimplementowane Rozwiązanie (AS-IS)

### HLD Obecnego Rozwiązania

Granica biblioteki obejmuje `VoteyTextAreaComponent`, dyrektywę `VoteyFormControlApplyDirective`, renderery tekstu i błędów, `VoteyTranslatePipe` oraz generowane tokeny CSS. Paczka npm publikuje eksport `./angular`. Aplikacja korzystająca z biblioteki dostarcza `FormControl` i może podłączyć własny `VoteyTranslator` przez token `VOTEY_TRANSLATOR`. Bez dostarczonego translatora biblioteka zwraca sam klucz tłumaczenia. Żaden moduł backendu ani magazyn danych nie należy do granicy komponentu.

Ścieżka wykonania: użytkownik wpisuje tekst w natywnym `<textarea>` → Angular aktualizuje `FormControl` → komponent emituje `changed`. W drugą stronę wartość ustawiona w kontrolerze jest wyświetlana w polu. Stan błędu wynika lokalnie z `invalid && touched`; podłączony translator przekształca klucze etykiety, helpera, limitu i błędów. Zapis wartości poza kontrolerem, autoryzacja i transakcje należą wyłącznie do aplikacji korzystającej z komponentu.

### 5.1 Backend (BE)

N/A dla samego Textarea: komponent działa w przeglądarce, nie wywołuje endpointów i nie wymaga usługi backendowej. Aplikacja może użyć wartości `FormControl` we własnym procesie, lecz jego kontrakty nie należą do specyfikacji komponentu.

### 5.2 Frontend (FE)

| Wejście | Pochodzenie |
| --- | --- |
| `label` | Komponent Textarea |
| `placeholder` | Komponent Textarea |
| `helper` | Komponent Textarea |
| `disabled` | Komponent Textarea |
| `spellcheck` | Komponent Textarea |
| `minLength` | Komponent Textarea |
| `maxLength` | Komponent Textarea |
| `dataCy` | Komponent Textarea |
| `ignoredErrors` | Komponent Textarea |
| `control` | Odziedziczone z `VoteyFormControlApplyDirective` |
| `initialValue` | Odziedziczone z `VoteyFormControlApplyDirective` |
| `staticValue` | Odziedziczone z `VoteyFormControlApplyDirective` |
| `disable` | Odziedziczone z `VoteyFormControlApplyDirective` |
| `block` | Odziedziczone z `VoteyFormControlApplyDirective` |

Wyjścia: `changed: string` i `keyDown: KeyboardEvent`.

- Atrybuty natywnego pola obejmują `required` z `Validators.required`, `minlength`, `maxlength`, `disabled`, `spellcheck`, `aria-label`, `aria-invalid` i `data-cy`. Własny tekst błędu renderuje `vt-form-error` z `role="alert"`. `aria-label` pochodzi z przetłumaczonej etykiety. W kodzie nie ma powiązania helpera ani błędu z polem przez `aria-describedby`.
- `label` jest opcjonalne: gdy jest puste, komponent nadal renderuje działające pole, ale nie ustawia `aria-label`. Nie ma osobnego wejścia `ariaLabel` ani powiązania przez `aria-labelledby` lub natywne `<label for>`. Sam komponent nie gwarantuje więc dostępnej nazwy przy braku `label`.
- Kontener stosuje klasy `filled` dla niepustej wartości, `error` dla niepoprawnego i dotkniętego kontrolera oraz `disabled` dla wejścia lub wyłączonego kontrolera. Fokus jest stylowany przez `:focus-within`. Stan `filled` ustawia mocniejszy obrys; `error` ma pierwszeństwo stylów nad fokusem. Brak osobnej logiki stanu hover.
- `VoteyTranslatePipe` odczytuje `VOTEY_TRANSLATOR`. Gdy aplikacja nie podłączy własnego translatora, fabryka tokena zwraca oryginalny klucz. Komponent nie inicjuje zapisu wartości poza `FormControl`.

### 5.3 Design

Link do makiety wskazany przez recenzenta: [Textarea w Wyborek Design System](https://www.figma.com/design/voF94kJ9mqgENbzJBuw2Iv/Wyborek-%7C-Design-System?node-id=1635-336&t=WpwovtfzPO02Lm1N-4).

- Style komponentu korzystają z powierzchni, obrysów, koloru tekstu, stanu error i akcentu przez zmienne CSS. Fokus dodaje wewnętrzny cień odpowiadający wizualnie drugiemu pikselowi obrysu. Obudowa używa wysokości 120 px zapisanej literalnie, poziomego paddingu `--spacing-16`, pionowego `--spacing-12` + `--spacing-2`, odstępu `--spacing-8` i `--radius-input`.
- Tekst pola używa rodziny `--typo-body-*`, etykieta wariantu `label`, pomoc wariantu `caption-s`. Placeholder korzysta z `--color-text-muted`. Motyw Light/Dark jest dostarczany przez generowany arkusz tokenów, nie przez osobne gałęzie kodu komponentu; zgodności z pięcioma wariantami Figmy nie potwierdzono testem wizualnym.

## 6. Aktualne Zachowanie (AS-IS)

### 6.1 Zachowanie Pozytywne

1. Po podaniu `FormControl` wpisany tekst aktualizuje jego wartość i emituje `changed`; naciśnięcie klawisza emituje `keyDown`.
2. Domyślny `maxLength` to `null`, więc komponent nie ustawia limitu znaków. Po przekazaniu `maxLength` ustawia natywny atrybut `maxlength`; bez własnego helpera pokazuje tłumaczony komunikat `CHARACTER_LIMIT` z bieżącą liczbą znaków i maksimum.
3. Etykieta jest pokazywana tylko przy niepustym `label`; helper tylko przy niepustym `helper`. Pole zajmuje szerokość kontenera.
4. Natywne `<textarea>` obsługuje Enter jako nową linię i przewija treść dłuższą niż dostępna wysokość.

### 6.2 Zachowanie Negatywne I Edge Case

1. Gdy `FormControl` ma błędy i jest `touched`, kontener otrzymuje stan `error`, `aria-invalid=true`, a `vt-form-error` pokazuje przetłumaczone komunikaty poza kluczami z `ignoredErrors`.
2. Gdy `disabled` lub `formControl.disabled` jest prawdą, pole otrzymuje styl disabled; natywny atrybut jest ustawiany bezpośrednio dla wejścia `disabled`, a stan wyłączonego kontrolera propaguje Reactive Forms.
3. Przy dłuższej treści wysokość obudowy pozostaje 120 px. Usunięcie treści nie zmienia tej wysokości.
4. Przy jednoczesnym `helper` i `maxLength` widoczny jest helper, a domyślny komunikat limitu jest pomijany. Błąd walidacji jest renderowany osobno pod helperem.
5. Przy pustym `label` pole pozostaje używalne, lecz komponent nie ustawia `aria-label` ani alternatywnego powiązania nazwy; sam placeholder nie stanowi kontraktu programowej nazwy dostępnej.

### 6.3 Reguły Funkcjonalne

- `hasError = formControl.invalid && formControl.touched`; sama niepoprawna wartość bez `touched` nie nadaje stylu błędu.
- `filled` zależy od długości wartości `FormControl`, a nie od zdarzenia blur.
- `minLength` i `maxLength` jako wejścia komponentu ustawiają atrybuty HTML; walidatory `Validators.minLength` i `Validators.maxLength` są dodawane osobno przez konsumenta, co pokazuje konfiguracja Storybooka.
- Limit wynikający z `maxlength` jest stosowany przez natywne pole podczas wpisywania i wklejania; komponent nie dodaje walidatora długości do `FormControl` i nie wykonuje żądań HTTP.

## 7. Kryteria Akceptacji Stanu Obecnego

| ID | Kryterium |
| --- | --- |
| **AC-01** | Given formularz z `vt-text-area` i kontrolerem, when użytkownik wpisuje kilka linii, then wartość kontrolera i `changed` zawierają tekst z podziałami linii. |
| **AC-02** | Given `maxLength=2000`, when użytkownik wpisuje lub wkleja więcej znaków, then natywne pole respektuje atrybut `maxlength`; bez własnego helpera widoczny jest komunikat z `current` i `max`. |
| **AC-03** | Given niepoprawny, dotknięty kontroler, when komponent renderuje pole, then ma stan `error`, `aria-invalid=true`, a komunikat jest renderowany w obszarze `role="alert"`. |
| **AC-04** | Given kontroler wyłączony albo `disabled=true`, when komponent renderuje pole, then edycja jest zablokowana, a styl disabled jest zastosowany. |
| **AC-05** | Given tekst dłuższy od obszaru pola, when użytkownik przewija, then obudowa zachowuje 120 px, a przewijanie odbywa się wewnątrz natywnego pola bez uchwytu resize. |
| **AC-06** | Given aplikacja podłącza translator przez `VOTEY_TRANSLATOR`, when komponent renderuje klucz etykiety lub helpera, then pokazuje tekst zwrócony przez translator; bez podłączonego translatora pokazuje sam klucz. |
| **AC-07** | Given pole z własnym `helper`, ustawionym `maxLength` oraz niepoprawnym, dotkniętym `FormControl` z nieignorowanym błędem, when komponent renderuje komunikaty, then helper jest widoczny, domyślny `CHARACTER_LIMIT` nie jest renderowany, a komunikat błędu pojawia się osobno pod helperem w obszarze `role="alert"`. |
| **AC-08 — obserwacja ograniczenia AS-IS** | Given `vt-text-area` bez `label`, when komponent renderuje pole, then pole pozostaje edytowalne, ale nie ma `aria-label`, `aria-labelledby` ani powiązanego `<label for>`. To kryterium dokumentuje stan zastany, nie definiuje pożądanego zachowania dostępności. |
| **AC-09** | Given `vt-text-area` bez `maxLength`, when komponent renderuje pole, then natywne `<textarea>` nie ma atrybutu `maxlength` ani domyślnego komunikatu `CHARACTER_LIMIT`. |

## 8. Kontrakty Techniczne I Dane

- Publiczny kontrakt Angular jest eksportowany przez `angular/src/public-api.ts`; paczka deklaruje peer dependency Angular `>=21 <22`. Wartość pola jest utrzymywana w `FormControl<string | null>`, przekazanym przez aplikację albo utworzonym przez odziedziczoną dyrektywę.
- `minLength` i `maxLength` mają domyślną wartość `null`; po podaniu ustawiają odpowiednio natywne atrybuty `minlength` i `maxlength`. Komponent nie dodaje samodzielnie walidatorów długości do kontrolera. `required` wynika z obecności `Validators.required`.
- `VOTEY_TRANSLATOR` jest kontraktem tłumaczenia kluczy i parametrów (`current`, `max`). `VoteyTranslatePipe` używa wstrzykniętego translatora; domyślny translator zwraca sam klucz. W CRM token wskazuje `AppTranslationService`, ale źródło słowników należy do aplikacji, nie do Textarea.
- N/A dla API REST, eventów, kolejek, migracji, trwałych danych i transakcji komponentu: Textarea nie inicjuje tych operacji.

## 9. Wymagania Niefunkcjonalne I Ograniczenia Dowodów

- Dostępność: natywne pole ma `aria-label` tylko przy niepustym `label`; `aria-invalid` pojawia się w stanie błędu, a błędy są w `role="alert"`. Kod nie wiąże helpera ani błędu przez `aria-describedby`. Brak `label` nie blokuje użycia komponentu, lecz sam komponent nie zapewnia wtedy programowej nazwy pola. To znane ograniczenie stanu AS-IS.
- Style: część wartości pochodzi z tokenów, lecz wysokość i szerokość obrysu są literalne. Nie potwierdzono w działającej przeglądarce zgodności wizualnej z Figmą.
- Odczyt kontekstu prespecki dla WYBOREK-3059 zakończył się HTTP 403; żadne twierdzenie z niedostępnej prespecki nie zostało użyte.
- Nie wykonano testu czytnika ekranu ani testu wizualnego w działającej aplikacji; ograniczenia dostępności i wyglądu wynikają z kodu komponentu.

## 10. Wersjonowanie I Wpływ Na Inne Specyfikacje

- Wersja tego dokumentu: `1.0.0`, pierwszy lokalny opis AS-IS feature `textarea`.
- Wpis w rejestrze: `textarea: 1.0.0`.
- `affectedSpecifications`: `[]`. Dokument opisuje kontrakt Textarea, bez specyfikowania formularzy i danych aplikacji korzystających z biblioteki.

## 11. Zaimplementowany Sposób Wdrożenia I Rollback

### 11.1 Wdrożenie i konfiguracja

Źródła DS są pakowane przez `ng-packagr`, a tokeny przez Style Dictionary. Konfiguracja paczki publikuje `dist` do npm; workflow GitHub `npm-publish.yml` uruchamia walidację tokenów, testy tokenów, build, podbicie wersji i `npm publish`. Paczka udostępnia eksport `./angular` i arkusz tokenów CSS do użycia w aplikacji. Translator może być podłączony przez Angular DI. Textarea nie wymaga osobnego deploymentu, migracji bazy, feature flagi ani konfiguracji backendu. W kodzie komponentu nie ma dedykowanej metryki ani logu zdarzeń.

### 11.2 Rollback

Repozytorium biblioteki nie zawiera osobnej procedury rollbacku Textarea. Wersja komponentu wynika z zależności npm używanej przez aplikację; powrót do wcześniejszej wersji wymaga zmiany tej zależności, ponownego buildu i wdrożenia aplikacji. Komponent nie utrwala danych, więc nie ma własnego rollbacku danych. Nie ustalono operacyjnej procedury cofania wdrożenia na konkretnym środowisku.

## 12. Testy I Definition Of Done Dokumentu

- `design-system-votey/tests/angular-package.test.js` sprawdza publiczny eksport, selektor, wejścia `control`, `label`, `maxLength` oraz wyjścia `changed` i `keyDown`.
- Storybook udostępnia Playground z konfiguracją kontrolera, walidatorów, błędu, limitu i podglądem Angular. Jest to podgląd, nie dowód produkcyjnego wyglądu wszystkich wariantów.
- Szablon komponentu stanowi dowód kolejności helper → błąd oraz warunku wyłączającego domyślny komunikat limitu przy własnym helperze (AC-07). Domyślna wartość `maxLength=null` i warunek renderowania komunikatu w szablonie potwierdzają AC-09. Brak alternatywnego wejścia nazwy potwierdza ograniczenie AC-08; brak testu czytnika ekranu nie pozwala przypisywać polu bez `label` skutecznej nazwy dostępnej.
- `angular/src/lib/translation/` potwierdza wybór wstrzykniętego translatora oraz zwrot klucza przez translator domyślny (AC-06).
- `wyborek-crm/src/app/app.config.ts` potwierdza podłączenie `AppTranslationService` do `VOTEY_TRANSLATOR`. Szczegóły formularzy i testów CRM nie są kontraktem Textarea.
- [x] Dokument odróżnia stan zaimplementowany od treści zadania.
- [x] Granica komponentu, kontrakt z aplikacją oraz wdrożenie paczki są opisane bez wymagania otwarcia diagramu.
- [x] Rejestr wersji wskazuje ten sam feature i wersję.

## 13. Workflow Handoff I Źródła Dowodów

Dokument jest draftem do review przez PleoAI. Diagram HLD i PNG są pomocniczą wizualizacją; pełny opis stanu znajduje się w tym Markdownie. Publikacja i review nie są wykonywane w ramach tego authoringu.

Główne źródła: `design-system-votey/angular/src/lib/textarea/`, `angular/src/lib/directives/votey-form-control-apply.directive.ts`, `angular/src/lib/translation/`, `angular/src/lib/form-error/`, `angular/src/public-api.ts`, `storybook/stories/angular/Textarea.stories.jsx`, `tests/angular-package.test.js`, `package.json`, `.github/workflows/npm-publish.yml`; dla integracji translatora `wyborek-crm/src/app/app.config.ts` i `src/app/_services/app-translation.service.ts`.
