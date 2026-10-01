# WERSJA 1.0.0
# AUTOR n.koktysz@pleodigital.com & k.tryba@pleodigital.com

# Spec Driven Specification: wybór daty i godziny w Votey Design System

## 1. Metadane

- Data: 2026-09-24 (Europe/Warsaw).
- Status: Draft, do przeglądu FE, Design i produktu.
- Powiązane zgłoszenie: WYBOREK-3042 — `[FE] Komponent date picker do design systemu`.
- Feature slug: `date-time-pickers`.
- Typ dokumentu: `specification` — pierwszy dokument nowej funkcjonalności; tryb `NEW`, operacja `create`.
- Repozytorium kanoniczne: `design-system-votey` (`WRITE`). Kontekst: `wyborek-crm` (`CONTEXT`, bez zmian).
- Zakres stacku: FE — Angular 21 i biblioteka Votey DS; BE — brak zmiany, API i persystencja pozostają własnością aplikacji konsumenckiej.
- Docelowy release: nieokreślony w Jirze. Publikacja paczki pickerów wymaga wcześniejszej publikacji tokenów semantycznych z 2026-09-23.
- Źródła wymagań: opis WYBOREK-3042, DEC-29, DEC-50, DEC-56, zakończona prespecka Q1–Q23 i zatwierdzone rozstrzygnięcia architektoniczne. Normatywne ustalenia tych źródeł są zapisane w tym dokumencie.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Użytkownik formularza potrzebuje szybko podać datę, datę z godziną albo samą godzinę. Może wpisać wartość lub wybrać ją z panelu. Widzi od razu, które dni i godziny mieszczą się w dozwolonym zakresie, a po niepoprawnym wpisie otrzymuje zrozumiały komunikat bez utraty wpisanej treści.

Wspólny wygląd i zachowanie pól w jasnym i ciemnym motywie ułatwiają używanie dat w różnych częściach produktu. Wybór daty z godziną aktualizuje wartość od razu; użytkownik może potem doprecyzować godzinę w tym samym panelu. Dni sąsiednich miesięcy pozostają wybieralne, a kalendarz i lista godzin działają również z klawiatury oraz czytnikiem ekranu.

### 2.2 Opis Techniczny

Biblioteka Angular w `design-system-votey` dostarcza publiczne `vt-date-picker` (tryby Date i DateTime) oraz samodzielny `vt-time-picker`. Obie kontrolki korzystają wyłącznie z `VoteyFormControlApplyDirective`, jej wejścia `control` i odziedziczonego `formControl`. Wewnętrzny `PickerCalendarComponent` renderuje nagłówek i siatkę dni obu trybów daty. Panel pozycjonuje `CdkConnectedOverlay` z Angular CDK. Pola i pozycje listy korzystają z istniejących prymitywów DS (`vt-input`, `vt-menu`, `vt-button`, `vt-icon`, `vt-form-error`) i tokenów semantycznych. `vt-icon` korzysta z `MatIcon`; `MatDatepicker` i `MatCalendar` nie renderują siatki dni. Biblioteka nie wykonuje żądań API ani nie utrwala danych. Konsument odpowiada za przekazanie wartości do swojego formularza i API.

## 3. Zakres

### 3.1 Zakres Biznesowy

- Użytkownik może wpisać lub wybrać datę, datę z godziną albo samą godzinę. Pole można wyczyścić, jeśli formularz nie oznaczył go jako wymagane.
- Kalendarz zaczyna tydzień w poniedziałek, pokazuje miesiąc z sąsiednimi dniami i pozwala wybrać dozwolony dzień z sąsiedniego miesiąca. Niedostępnych dni nie można wybrać ani aktywować klawiaturą.
- W trybie Date wybór dnia kończy wybieranie. W DateTime wybór dnia od razu aktualizuje wartość i pozostawia panel otwarty; wybór godziny zamyka panel. Escape i kliknięcie poza panelem zachowują już wprowadzone zmiany.
- Lista podpowiada godziny co 30 minut, chyba że miejsce użycia wybierze inny odstęp, np. 15 lub 60 minut. Poprawny ręczny wpis spoza listy jest domyślnie dozwolony; miejsce użycia może ograniczyć nowe wpisy do pozycji listy. Wcześniej zapisana, niezmieniona godzina spoza listy pozostaje ważna.
- Zakres dat i godzin może zostać ograniczony przez formularz. Po jego zmianie istniejąca niedozwolona wartość pozostaje widoczna z błędem do czasu poprawienia.

### 3.2 Zakres Techniczny

- Nowe publiczne komponenty Angular, wspólny wewnętrzny kalendarz, lista godzin, parser i walidator wpisu oraz wspólny kontrakt formularza DS (`VoteyFormControlApplyDirective`, wejście `control`, odziedziczony `formControl` i stan disabled).
- Jawna zależność paczki od `@angular/cdk` zgodna z używaną wersją Angular 21; `CdkOverlayOrigin` i `CdkConnectedOverlay` obsługują pozycję panelu, kliknięcie poza panelem i zamknięcie. Siatka dni jest własnym szablonem DS.
- Date przekazuje datę kalendarzową `YYYY-MM-DD`; DateTime przekazuje ISO 8601 chwili obliczonej z lokalnego wpisu w strefie przeglądarki; samodzielny TimePicker przekazuje `HH:mm`. Puste opcjonalne pole przekazuje `null`. Konsument mapuje te wartości do swojego API.
- Limity, format, nieistniejące daty/godziny, zmiany czasu, dostępność dni i godzin oraz komunikaty są walidowane lokalnie. UI korzysta z semantycznych tokenów, polskich formatów wejścia i konfigurowalnego języka nazw miesięcy/dni.
- Storybook lub równoważne demonstracje pokrywają warianty, stany, motywy i interakcje; testy jednostkowe i komponentowe weryfikują reguły oraz dostępność.

### 3.3 Poza Zakresem

- Jeden kalendarz do wyboru przedziału od–do, widoki roku/dekady, wybór strefy czasowej i inne tekstowe formaty wejścia niż polskie.
- Wymiana lokalnego `app-date-picker` w `wyborek-crm`, zmiana formularzy wydarzeń CRM, tłumaczeń CRM, endpointów, backendu, bazy danych, migracji lub backfillu. Późniejsza integracja CRM przejdzie z Anuluj/Ustaw na natychmiastowy wybór i zasili nazwy miesięcy/dni językiem interfejsu CRM.
- Publikacja wymaganych tokenów semantycznych; jest oddzielnym warunkiem wdrożenia pickerów.
- Publiczny, samodzielny komponent `vt-calendar`; kalendarz pozostaje współdzielonym elementem wewnętrznym.

## 4. Stan Obecny (AS-IS)

`design-system-votey/angular/src/lib` zawiera `vt-input` w wariancie `boxed`, `vt-menu`, `vt-button`, `vt-icon`, `vt-form-error`, `VoteyFormControlApplyDirective` oraz mechanizm `VOTEY_TRANSLATOR`, lecz nie zawiera docelowych pickerów. `vt-menu` przyjmuje elementy `id`, `label`, `disabled`, wybraną pozycję i emituje wybór. `vt-input` dziedziczy po tej dyrektywie, wiąże natywne pole z odziedziczonym `formControl` i sygnalizuje błąd. `vt-icon` korzysta z Angular Material `MatIcon`. W aktualnym checkoutcie nie znaleziono części nazw tokenów wymaganych przez Jirę, w tym `radius/m`, `space/gap-3xs` i `size/overlay-max`.

`wyborek-crm/src/app/shared/date-picker` używa `@ngxmc/datetime-picker` i własnego `app-date-picker`, z min/max i akcjami Anuluj/Ustaw. To źródło wiedzy o obecnym konsumencie i zakresie przyszłej migracji, nie element bieżącej implementacji. Repozytorium backendu nie zostało dołączone do tego taska; zatwierdzony zakres nie wymaga zmiany ani potwierdzenia szczegółów jego API. Data przekazywana później przez formularz CRM ma zostać zserializowana do istniejącego kontraktu aplikacji, bez narzucania tu niepotwierdzonej ścieżki endpointu.

## 5. Docelowe rozwiązanie

### 5.1 Backend (BE) i dane

**N/A dla bieżącej zmiany.** Paczka DS nie jest serwisem backendowym: nie dodaje endpointów, eventów, tabel, migracji, jobów, autoryzacji ani własnej persystencji. Kontrola wymagania pola i zapis do API pozostają po stronie formularza konsumenta i jego istniejącego backendu. Nie wolno uzależniać działania pickera od żądania sieciowego. Testy backendu nie są wymagane, ponieważ żaden kontrakt BE nie jest zmieniany.

### 5.2 Frontend (FE): komponenty i kontrakt publiczny

| Element | Rola i publiczny kontrakt |
|---|---|
| `vt-date-picker` | Jeden komponent z trybem `Date` (domyślnym) albo `DateTime`; publiczne wejścia i format wartości określa poniższa tabela. |
| `vt-time-picker` | Samodzielna godzina `HH:mm` lub `null`; publiczne wejścia określa poniższa tabela. |
| `PickerCalendarComponent` | Wewnętrzny, nieeksportowany widok miesiąca i siatki dni; wyznacza aktywny, wybrany, dzisiejszy, niedostępny i sąsiedni dzień. |
| Lista godzin | Wspólny mechanizm podpowiedzi samodzielnego TimePicker i panelu DateTime. W DateTime filtruje pozycje według całej daty i min/max. |
| Warstwa panelu | `CdkOverlayOrigin` przy polu oraz `CdkConnectedOverlay` dla panelu. Panel znajduje się 8 px pod polem albo nad nim przy braku miejsca, ponad treścią strony. |

Publiczne wejścia (nazwy są częścią API paczki; `null` dla `min` i `max` oznacza brak granicy):

| Wejście | Typ i wartość domyślna | Zastosowanie i walidacja konfiguracji |
|---|---|---|
| `control` | `FormControl<string \| null> \| null`, domyślnie `null` | Oba pickery. Przekazana kontrolka jest jedyną kontrolką wartości; przy `null` działa odziedziczony `formControl`. |
| `label` | `string`, domyślnie `''` | Oba pickery. Klucz tłumaczenia; pusty tylko przy innym dostępnym opisie pola. |
| `disabled` | `boolean`, domyślnie `false` | Oba pickery. Stan efektywny to wejście `disabled` albo disabled kontrolki. |
| `mode` | `'Date' \| 'DateTime'`, domyślnie `'Date'` | Tylko `vt-date-picker`. Zmienia panel, format wpisu i kontrakt wartości. |
| `min`, `max` | `string \| null`, domyślnie `null` | Tylko `vt-date-picker`; w Date wymagają pełnego `YYYY-MM-DD`, w DateTime poprawnej chwili ISO 8601 z `Z` lub offsetem. Granice są włączne; niepoprawny format albo `min > max` to błąd konfiguracji. |
| `locale` | `string`, domyślnie `'pl-PL'` | Tylko `vt-date-picker`; poprawny tag języka BCP 47 obsługiwany przez `Intl.DateTimeFormat`, używany do nazw dni i miesięcy. Nie zmienia numerycznego formatu wpisu ani początku tygodnia. Niepoprawny tag to błąd konfiguracji. |
| `stepMinutes` | `number`, domyślnie `30` | `vt-time-picker` i tryb DateTime w `vt-date-picker`; liczba całkowita od 1 do 60 włącznie. Pozycje powstają od 00:00 co ten krok, dopóki są wcześniejsze niż 24:00. Inna wartość to błąd konfiguracji. |
| `timeEntryPolicy` | `'allowManual' \| 'listOnly'`, domyślnie `'allowManual'` | `vt-time-picker` i tryb DateTime; `allowManual` przyjmuje poprawny nowy wpis poza listą, `listOnly` wymaga pozycji z listy przy nowym wyborze. Nieedytowana wartość zastana pozostaje ważna zgodnie z §5.3. Inna wartość w runtime to błąd konfiguracji. |

Publiczne typy zamknięte `mode` i `timeEntryPolicy` są eksportowane razem z komponentami. Błędna konfiguracja uniemożliwia zatwierdzenie nowej wartości i zgłasza błąd kontrolki z §5.2; jej korekta wywołuje ponowną walidację bez utraty istniejącej wartości. Formaty podpowiedzi w polu wynikają z `mode`, bez dodatkowego publicznego wejścia. Nowo zatwierdzona wartość DateTime ma zawsze kanoniczny format UTC `YYYY-MM-DDTHH:mm:00.000Z` (sekundy i milisekundy zerowe); ISO przekazane przez konsumenta z poprawnym offsetem zachowuje tę samą chwilę i nie jest przepisywane, dopóki użytkownik nie zmieni daty lub godziny.

Publiczne pickery dziedziczą po `VoteyFormControlApplyDirective<string>`. Konsument przekazuje reaktywną kontrolkę przez wspólne wejście `control`; gdy jej nie przekazuje, komponent korzysta z odziedziczonego `formControl`. Natywne pole wiąże tę samą kontrolkę przez `[formControl]`; przy kompozycji z `vt-input` przekazuje jej tę samą kontrolkę przez `control`. Nie powstaje druga kontrolka wartości ani równoległy `ngModel`. Programowa zmiana wartości kontrolki aktualizuje pole i panel, a poprawna zmiana użytkownika zapisuje wartość do tej kontrolki. Wpis częściowy lub niepoprawny pozostaje widocznym draftem prezentacji, bez nadpisania ostatniej poprawnej wartości. Zmiana min/max lub polityki godzin ponownie waliduje bieżącą wartość kontrolki, również bez edycji pola; zachowuje zatwierdzoną wartość, która stała się niedozwolona, i zgłasza błąd zakresu do czasu korekty. Blur lub zakończenie interakcji oznacza kontrolkę jako touched. Stan disabled przekazanej kontrolki albo wejścia komponentu blokuje wpis, otwarcie panelu i inne akcje. Wymagalność ustala formularz nadrzędny. Nie wolno dopisywać subskrypcji ani hooków synchronizujących do dyrektywy bazowej. Komponent nie wykonuje serializacji żądania ani wywołania API.

Błędy własne pickera mają zamknięty kontrakt w `control.errors`; inne klucze, w tym `required` i klucze walidatorów konsumenta, należą do formularza aplikacji:

| Klucz błędu pickera | Payload | Kiedy występuje |
|---|---|---|
| `voteyPickerFormat` | `{ expected: string }` | Wpis nie odpowiada formatowi pola; `expected` to `DD.MM.RRRR`, `DD.MM.RRRR, GG:MM` albo `GG:MM`. |
| `voteyPickerDate` | `{ input: string }` | Poprawnie sformatowana data nie istnieje. |
| `voteyPickerTime` | `{ input: string }` | Godzina jest poza zakresem 00:00–23:59 albo nie istnieje w lokalnej strefie w dniu zmiany czasu. |
| `voteyPickerRange` | `{ min: string \| null, max: string \| null }` | Poprawna wartość nie mieści się w granicach włącznie; payload zawiera aktualne wejścia granic. |
| `voteyPickerPolicy` | `{ stepMinutes: number }` | Nowy wpis godziny nie należy do listy przy `timeEntryPolicy='listOnly'`. |
| `voteyPickerConfig` | `{ reason: 'invalidMin' \| 'invalidMax' \| 'minAfterMax' \| 'invalidStep' \| 'invalidLocale' \| 'invalidPolicy' }` | Niepoprawna konfiguracja publicznych wejść. |

Picker oblicza najwyżej jeden własny błąd według kolejności: konfiguracja, format, nieistniejąca data/godzina, zakres, polityka listy. Przy każdej zmianie wpisu, wartości kontrolki albo wejść konfiguracyjnych aktualizuje tylko klucze `voteyPicker*`: zachowuje pozostałe wpisy `errors`, dodaje lub usuwa własny klucz i ustawia `null` wyłącznie przy pustej całej mapie. Nie używa `setValidators` do zastąpienia walidatorów konsumenta; `required` i walidatory aplikacji są nadal wykonywane przez Angular Forms. Pusty opcjonalny wpis nie tworzy błędu pickera. Zmiana min/max, która unieważnia wcześniejszą wartość, dodaje `voteyPickerRange` bez zmiany wartości; korekta zakresu usuwa tylko ten błąd. Poprawienie błędnej konfiguracji analogicznie usuwa `voteyPickerConfig`. Błędy własne mają odrębne klucze tłumaczeń `ERRORS.VOTEYPICKERFORMAT`, `ERRORS.VOTEYPICKERDATE`, `ERRORS.VOTEYPICKERTIME`, `ERRORS.VOTEYPICKERRANGE`, `ERRORS.VOTEYPICKERPOLICY` i `ERRORS.VOTEYPICKERCONFIG`, zgodne z mapowaniem `vt-form-error`; payload pozostaje dostępny konsumentowi w `control.errors`. Tłumaczenia tych kluczy są częścią kontraktu komponentu DS i muszą być dostarczone w demonstracji oraz dokumentacji integracyjnej.

Dla Date min/max to **włączne daty kalendarzowe** `YYYY-MM-DD`, porównywane bez przeliczenia strefy. Dla DateTime min/max to **włączne chwile ISO 8601**; przy wyborze dnia ograniczenie obejmuje także godzinę. Brak granicy oznacza brak ograniczenia po tej stronie. Dolna granica późniejsza niż górna jest błędną konfiguracją: nie wolno zatwierdzić nowej wartości, a konsument powinien otrzymać błąd konfiguracji zamiast pozornie poprawnego wyboru. W samodzielnym TimePicker wymaganie zakresu nie zostało zdefiniowane; nie dodajemy osobnych granic.

Przy konwersji DateTime pełny lokalny wpis `DD.MM.RRRR, GG:MM` jest interpretowany w lokalnej strefie przeglądarki, a do formularza trafia jednoznaczna chwila ISO 8601 w UTC. Wartość ISO przekazana programowo przez `control` jest wyświetlana jako lokalna data i godzina. Nieedytowany oryginalny ISO zachowuje swą chwilę, także gdy lokalna godzina wystąpiła dwukrotnie. Nowy wybór takiej godziny wskazuje pierwsze wystąpienie. Dla nieistniejącej lokalnej godziny, np. podczas przejścia na czas letni, nie wolno po cichu przesuwać wartości: wpis jest niepoprawny, a podpowiedź nie powstaje. Lista ma najwyżej jedną pozycję dla danego lokalnego `HH:mm`.

### 5.3 Frontend (FE): interakcje, stan i walidacja

- **Wpis:** Date przyjmuje `DD.MM.RRRR`, DateTime `DD.MM.RRRR, GG:MM`, samodzielny TimePicker `GG:MM`. Kompletny poprawny wpis aktualizuje kontrolkę po zatwierdzeniu wpisu (blur lub Enter); częściowy draft pozostaje tekstem. Po blur błąd formatu, nieistniejącej daty/godziny albo wartości poza zakresem ma odrębny komunikat. Przykładowe polskie komunikaty: „Wpisz datę w formacie DD.MM.RRRR”, „Ta data nie istnieje”, „Data jest poza dozwolonym zakresem”; analogicznie dla daty z godziną i samej godziny. Komunikaty przechodzą przez mechanizm tłumaczeń DS.
- **Otwarcie:** kliknięcie pola, ikony lub ArrowDown otwiera panel; Disabled nie reaguje. Panel pozostaje w obszarze widoku, zmienia pozycję nad polem, jeśli pod nim brakuje miejsca, i zwęża się na małym ekranie bez poziomego przewijania strony. Escape albo kliknięcie poza panelem zamyka panel bez cofania zatwierdzonych zmian.
- **Kalendarz i fokus:** po otwarciu pokazuje miesiąc wybranej wartości; dla pustej wartości miesiąc bieżący lub miesiąc najbliższej dozwolonej daty, jeśli dziś jest poza zakresem. Jeśli wybrany dzień jest dozwolony, otrzymuje fokus; przy pustej wartości fokus otrzymuje dziś, jeśli jest dozwolone, w przeciwnym razie najbliższy dozwolony dzień względem dziś (przy równej odległości wcześniejszy). Ta sama reguła najbliższego dozwolonego dnia działa dla wartości, która stała się niedozwolona po zmianie granic. Gdy konfiguracja jest błędna lub nie ma żadnego dozwolonego dnia, fokus pozostaje na wyzwalaczu/nagłówku, a siatka nie ma aktywnej komórki. Nagłówek przewija miesiące. Dni sąsiednich miesięcy są widoczne i wybieralne, jeśli dozwolone, a wybór przełącza widoczny miesiąc. Strzałki przechodzą przez granice miesięcy i pomijają niedostępne dni. Page Up/Down przenosi aktywny dzień o miesiąc, najpierw obcinając numer dnia do ostatniego dnia miesiąca docelowego (np. 31 stycznia → 28/29 lutego), a następnie wybierając najbliższy dozwolony dzień tego miesiąca; przy remisie wcześniejszy. Pusty miesiąc jest pomijany w kierunku nawigacji; jeśli w tym kierunku nie ma dozwolonego dnia, fokus i miesiąc nie zmieniają się. Enter wybiera aktywny dzień.
- **DateTime:** wybór dnia aktualizuje kontrolkę natychmiast. Dotychczasowa godzina zostaje, jeżeli mieści się w granicach i jest dozwolona; inaczej wybierana jest najwcześniejsza dozwolona lokalna minuta dnia, od 00:00 przy braku ograniczenia. Przy polityce „tylko lista” nowy wybór godziny musi należeć do podpowiedzi; wcześniej zapisana, niezmieniona godzina spoza siatki jest wyjątkiem. Dzień bez żadnej dozwolonej godziny — uwzględniając politykę wpisu ręcznego — ma stan Disabled. Po wyborze dnia panel zostaje otwarty; wybór godziny aktualizuje wartość i zamyka panel.
- **TimePicker:** lista zaczyna się od 00:00 i generuje unikalne pozycje w konfigurowalnym odstępie minut, domyślnie co 30 minut, do ostatniej pozycji przed 24:00. W DateTime usuwa podpowiedzi niezgodne z min/max lub nieistniejące w lokalnej strefie. Po otwarciu przewija do wybranej godziny, jeśli jest na liście; wartość spoza listy pozostaje w polu bez zaokrąglenia. Panel ma maksymalną wysokość z `size/overlay-max` (oczekiwane 288 px), dalej przewija się pionowo.
- **Błędy i dostępność:** wpis poza zakresem, błędny format i nieistniejąca data/godzina nie znikają z pola po blur. Zmiana min/max zachowuje wcześniejszą wartość i sygnalizuje błąd. Etykieta, format, stan błędu i tekst pomocniczy są połączone z polem dla czytnika ekranu. Aktywny dzień ogłasza pełną datę; zaznaczenie i niedostępność są przekazywane semantycznie. Fokus po zamknięciu panelu wraca do pola/wyzwalacza. Lista godzin obsługuje klawiaturę zgodnie z `vt-menu`.
- **Lokalizacja:** domyślne nazwy miesięcy i dni są po polsku; tydzień zaczyna się od poniedziałku. Nazwy mogą być podane według locale aplikacji, co umożliwi późniejszej integracji CRM użycie jego języka i systemu tłumaczeń. Format wpisu liczbowego pozostaje polski w zakresie tego zadania.

### 5.4 Design i tokeny

Źródłem wariantów jest opis strony „Components / Forms” w pliku Figma „Wyborek | Design System”; węzłów Figmy nie odczytano niezależnie. DatePicker ma 12 wariantów (Date/DateTime × Default, Focus, Filled, Error, Disabled, Open), TimePicker sześć stanów, Calendar oraz Calendar / Day sześć stanów dnia. Pola odwzorowują Input Boxed, panel zasady Select, pozycje godzin Menu / Item, a nawigacja przyciski `icon_button` Secondary Small.

Normatywne odwzorowanie wyglądu:

| Obszar lub stan | Reguła |
|---|---|
| Pole Date / DateTime / TimePicker | `vt-input` Boxed: wysokość `space/field-height`, poziome wypełnienie `space/field-padding-x`, promień `radius/m`; tło i obrys stanów Default, Focus, Filled, Error, Disabled zgodne z Input. |
| Ikony pola | Kalendarz: `icon_calendar-color`; zegar: `icon_time-color`, wariant Navy; rozmiar docelowy 24 px z tokenu. |
| Panel | `bg/surface`, `border/subtle`, `radius/m`, cień `Elevation/Overlay`; padding `space/icon-gap` i `space/stack-gap-s`; odstęp od pola `space/stack-gap-s`. |
| Calendar | Szerokość docelowa 304 px, nagłówek Body/L-semibold z przyciskami `icon_button` Secondary Small, etykiety Pn–Nd w Caption/S `text/muted`; komórki 40 × 40 px i odstęp `space/gap-3xs` (4 px). |
| Calendar / Day | Body/M, `radius/m`: Default `text/primary`; Hover `bg/surface-tint`; Selected `accent/primary` i `accent/on-accent`; Today obrys 1 px `accent/primary`; Disabled `text/muted`; OtherMonth `text/placeholder`. |
| Lista TimePicker | Pozycje `vt-menu` / Menu Item; maksymalna wysokość `size/overlay-max` (docelowo 288 px), potem przewijanie. |

W obu motywach runtime używa wyłącznie semantycznych tokenów dla kolorów, wysokości, odstępów i promieni. Oczekiwane wymiary wynikające z projektu to m.in. szerokość kalendarza 304 px, komórki dni 40 × 40 px, odstęp między nimi 4 px, ikony 24 px i odstęp panelu od pola 8 px; implementacja ma otrzymać je z tokenów, bez wpisywania tych wartości jako stałych CSS. Nazwy wymagane przez aktualny handoff, w tym `radius/m`, `space/gap-3xs` i `size/overlay-max`, muszą zostać potwierdzone w opublikowanej paczce przed użyciem. Wycofane `radius/input`, `calendar/gap` i `menu/max-height` są niedozwolone. Brak właściwej nazwy dla któregokolwiek wymiaru blokuje implementację tego wymiaru do uzupełnienia publikacji tokenów; nie zastępuje się jej literalem.

Oddzielna publikacja tokenów DS musi dostarczyć semantyczny token dla **każdej** roli wymiarowej użytej przez pickery: wysokości i poziomego paddingu pola; szerokości Calendar 304 px; szerokości i wysokości komórki dnia 40 px; rozmiaru obu ikon 24 px; odstępu komórek 4 px; odstępu panelu od pola 8 px; maksymalnej wysokości listy 288 px; paddingu panelu oraz promieni pól, dni i panelu. Wskazane w tym dokumencie nazwy `space/field-height`, `space/field-padding-x`, `space/gap-3xs`, `space/stack-gap-s`, `space/icon-gap`, `size/overlay-max` i `radius/m` są wymaganymi rolami do weryfikacji w opublikowanej paczce, a nie potwierdzeniem ich obecności w tym checkoutcie. Dla szerokości Calendar, wymiarów dnia i rozmiaru ikon nie ma dziś potwierdzonych nazw semantycznych; ich nadanie i opublikowanie należy do oddzielnej publikacji tokenów. Bramka WYBOREK-3042 wymaga otrzymania od niej pełnej mapy rola → publiczna nazwa → wartość w obu motywach oraz sprawdzenia mapy w artefakcie paczki **przed implementacją stylów pickerów**. Nie wolno zastąpić brakujących ról tokenem bazowym `space.24`/`space.40`, lokalnym aliasem ani literalem. Jeśli choć jednej roli brakuje, praca nad zależnym stylem i wydanie pickerów pozostają zablokowane; nie zmienia się ustalonego wyglądu.

### 5.5 Granice Angular Material i CDK

`PickerCalendarComponent` używa własnego szablonu Angular do wygenerowania także wybieralnych dni OtherMonth. `MatDatepicker` i `MatCalendar` nie renderują tego kalendarza; nie wolno modyfikować ich prywatnego DOM ani klas. `CdkConnectedOverlay` odpowiada tylko za warstwę i pozycję panelu używanego przez oba publiczne pickery. Ikony korzystają z istniejącego `vt-icon`/`MatIcon`. Publiczne API paczki eksportuje `vt-date-picker` i `vt-time-picker`, bez osobnego `vt-calendar`.

### 5.6 Wspólny kontrakt komponentów Votey DS

- Publiczne kontrolki są komponentami standalone z `ChangeDetectionStrategy.OnPush`, selektorami `vt-*` i typowanym signalowym API. Zamknięte warianty Date/DateTime i stanów są udostępniane jako stałe `as const` oraz odpowiadające im typy, gdy służą konsumentowi lub Storybookowi. Implementacja pozostaje w `angular/`, a komponenty i publiczne typy są eksportowane przez `angular/src/public-api.ts` oraz `@pleodigital/design-system-votey/angular`; konsument nie używa deep importów. Pomocniczy kalendarz i wewnętrzne typy nie są eksportowane. Nie edytuje się ręcznie `dist`.
- Każdy picker udostępnia `label` jako klucz tłumaczenia przez lokalny `VOTEY_TRANSLATOR`; etykieta nadaje polu dostępną nazwę. Puste `label` jest dopuszczalne tylko przy innym semantycznym opisie pola lub grupy. Format, helper i błąd są powiązane z polem dostępnościowo; akcja czyszczenia ma nazwę i działa wyłącznie przy aktywnej kontrolce. Wartość, disabled, required, touched i error są spójne między przekazaną lub odziedziczoną kontrolką, wejściami i widokiem; disabled nie emituje akcji.
- Cała powierzchnia wyzwalacza, w tym ikona, otwiera panel. Panel ma stabilną geometrię wyzwalacza, poprawne zakotwiczenie, szerokość mieszczącą się w widoku, zamykanie kliknięciem poza nim i Escape oraz obsługę klawiatury. Listę można przewinąć do końca; żadna akcja panelu nie jest przez to zasłonięta. Zachowanie jest sprawdzane interaktywnie w Storybooku.
- Dla obu publicznych pickerów powstaje `ANGULAR COMPONENTS/<Name>/Playground` z kontrolkami `label`, reaktywnego `control`, wartości pustej i ustawionej, disabled, error, required oraz właściwego wariantu i ograniczeń. Interakcje pokazują aktualną wartość kontrolki i istotne zdarzenia; obejmują cały wyzwalacz, kliknięcie poza panelem, Escape, klawiaturę i zmianę szerokości widoku. Testy obejmują programową zmianę wartości, disabled oraz touched/error przy przekazanym `control` i odziedziczonej kontrolce. Weryfikacja wydania obejmuje testy paczki, build Angulara, build Storybooka i smoke test spakowanego publicznego entry pointu bez wycieku stylów do Reacta.

## 6. Docelowe zachowanie (TO-BE)

### 6.1 Scenariusze pozytywne

1. Wpis `12.09.2026` zatwierdzony w Date ustawia `2026-09-12` w kontrolce; panel otwiera wrzesień 2026 z zaznaczonym dniem 12.
2. Wybór dozwolonego dnia w Date ustawia nową wartość w kontrolce i zamyka panel. W DateTime od razu ustawia wartość z zachowaną lub pierwszą dozwoloną godziną i pozostawia panel otwarty; wybór godziny kończy operację.
3. Samodzielny TimePicker podpowiada godziny według kroku konfiguracji, zachowuje ręcznie wpisaną poprawną godzinę spoza listy, jeżeli polityka na to pozwala, i nigdy nie zaokrągla zapisanego wpisu.
4. Zmiana locale zmienia nazwy miesięcy i dni bez zmiany sposobu liczenia tygodnia ani formatu liczbowego pola. Light/Dark zmienia wygląd przez tokeny bez zmiany kodu komponentu.

### 6.2 Scenariusze negatywne i brzegowe

1. `31.02.2026`, niepełny format lub wartość poza min/max dają odrębny błąd po blur, a wpis pozostaje w polu.
2. Dzień poza zakresem albo bez żadnej dozwolonej godziny DateTime jest nieaktywny; klawiatura go omija. Gdy podpowiedzi nie mieszczą się w zakresie, ale dozwolony jest choć jeden ręczny wpis, dzień pozostaje aktywny.
3. Po zmianie min/max wcześniej zatwierdzona wartość pozostaje w polu i kontrolce, lecz jest błędna, dopóki użytkownik jej nie poprawi.
4. Nieistniejąca godzina w dniu zmiany czasu jest błędna. Powtórzona godzina pojawia się na liście raz; nowy wybór oznacza pierwsze wystąpienie, a nieedytowana wcześniej zapisana chwila ISO pozostaje niezmieniona.
5. Escape i kliknięcie poza panelem nie cofają zatwierdzonego wyboru dnia lub godziny. Disabled blokuje wpis i panel. Pole opcjonalne można wyczyścić do `null`.

### 6.3 Niezmienniki

- Wartość Date jest datą kalendarzową, a nie chwilą; nie może zmienić dnia wskutek konwersji strefowej.
- Wartość DateTime jest jednoznaczną chwilą ISO 8601; żadna nowo zatwierdzona wartość nie narusza min/max ani polityki godzin.
- Lista godzin ma unikalne lokalne etykiety `HH:mm`; brak pozycji na liście sam w sobie nie unieważnia poprawnej godziny, gdy ręczny wpis jest dozwolony lub zachowywana jest nieedytowana wartość historyczna.
- Biblioteka udostępnia wartości i błędy przez kontrolkę formularza, a nie wykonuje zapisu API.

## 7. Kryteria akceptacji

| ID | Given / When / Then | Test potwierdzający |
|---|---|---|
| AC-01 | Dla obu motywów, gdy renderują się 12 wariantów DatePicker, sześć TimePicker i sześć Calendar / Day, każdy stan odpowiada regułom z §5.4 bez literalnych kolorów, wysokości, odstępów i promieni. | Storybook, kontrola CSS i porównanie wizualne. |
| AC-02 | Gdy użytkownik wpisze `12.09.2026` w Date i zatwierdzi, kontrolka przyjmuje `2026-09-12`, a panel pokazuje wrzesień 2026 i zaznaczony dzień 12. | Test komponentowy. |
| AC-03 | Gdy użytkownik wpisze błędny format, `31.02.2026` lub wartość poza zakresem i opuści pole, tekst pozostaje widoczny, a komunikat rozróżnia trzy przyczyny. | Test parsera i komponentu. |
| AC-04 | Gdy użytkownik wybierze dzień w Date, wartość zostaje ustawiona i panel zamyka się; w DateTime wartość aktualizuje się natychmiast, panel pozostaje otwarty, a wybór godziny go zamyka. | Test interakcji. |
| AC-05 | Gdy DateTime ma dozwoloną poprzednią godzinę i zmieni się dzień, godzina pozostaje. Gdy jej nie ma lub nowa data jej zabrania, ustawiona zostaje pierwsza dozwolona godzina, a dzień bez żadnej możliwości wyboru jest Disabled. | Test reguł DateTime. |
| AC-06 | Po otwarciu kalendarza fokus trafia na dozwoloną wybraną datę, a przy pustej wartości na dziś lub najbliższy dozwolony dzień. Strzałki pomijają Disabled i przechodzą miesiące. Page Up/Down z 31 stycznia obcina dzień do końca lutego i wybiera najbliższy dozwolony dzień; pomija pusty miesiąc albo zachowuje fokus, jeśli brak dalszej daty. Enter wybiera, Escape zamyka bez cofania zatwierdzonej wartości. | Test klawiatury dla wartości wybranej, pustej, ograniczonej, lutego i pustego miesiąca. |
| AC-07 | Gdy kalendarz pokazuje dziś, dzień ma stan Today; dni OtherMonth można wybrać, a dni poza min/max nie reagują na kliknięcie. | Test kalendarza. |
| AC-08 | Gdy lista TimePicker przekracza `size/overlay-max`, przewija się, po otwarciu pokazuje wybraną pozycję, ma krok domyślny 30 minut lub skonfigurowany 15/60 i nie zawiera powtórzeń `HH:mm`. | Test listy i DST. |
| AC-09 | Gdy polityka pozwala na ręczny wpis, poprawne `10:17` jest akceptowane. Gdy zabrania nowych godzin spoza listy, nowy wpis `10:17` ma błąd, ale nieedytowana zapisana `10:17` pozostaje ważna. | Test polityki godzin. |
| AC-10 | Gdy min/max DateTime obejmuje godzinę, lista i dostępność dni respektują granice; dzień bez podpowiedzi pozostaje dostępny, jeśli istnieje dozwolona ręczna godzina. | Test zakresu. |
| AC-11 | Gdy min/max zmienią się i unieważnią zatwierdzoną wartość, ta pozostaje widoczna i zgłoszona przez kontrolkę, a stan Error trwa do poprawy. | Test zmiany wejść. |
| AC-12 | Gdy wybrana lokalna godzina nie istnieje przy DST, walidacja odrzuca ją bez przesunięcia. Gdy występuje dwa razy, nowy wybór mapuje na pierwszą chwilę, a nieedytowane wejściowe ISO nie zmienia się. | Test strefy przeglądarki. |
| AC-13 | Gdy pole jest opcjonalne, wyczyszczenie ustawia `null` w kontrolce; gdy jest Disabled, nie przyjmuje tekstu i nie otwiera panelu. | Test formularza. |
| AC-14 | Gdy użytkownik otwiera panel przy dolnej krawędzi lub w wąskim widoku, panel przenosi się nad pole albo zwęża bez poziomego przewijania strony. | Test responsywny. |
| AC-15 | Gdy czytnik ekranu trafia na pole, ogłasza etykietę, format i błąd; dla aktywnego dnia ogłasza pełną datę oraz stan. Po zamknięciu panelu fokus wraca do wyzwalacza. | Test a11y i klawiatury. |
| AC-16 | Gdy zmienia się locale, nazwy miesięcy i dni odpowiadają językowi interfejsu; tydzień nadal zaczyna się w poniedziałek. | Test lokalizacji. |
| AC-17 | Przed implementacją stylów i wydaniem pickerów oddzielna paczka tokenów dostarcza pełną mapę ról z §5.4, w tym semantyczne nazwy i wartości dla 304 px Calendar, 40 px dnia, 24 px ikon, 4 px odstępu i 288 px listy. Jeśli brakuje choć jednej roli, praca nad zależnym stylem i wydanie są zatrzymane; po dostarczeniu mapa jest sprawdzana w opublikowanym artefakcie dla Light/Dark, bez literali i wycofanych aliasów. | Kontrola kompletności mapy, paczki tokenów, stylów i builda. |
| AC-18 | Gdy konsument przekazuje reaktywny `control`, programowa zmiana jego wartości aktualizuje pole i panel bez drugiej kontrolki; bez przekazanego `control` działa kontrolka odziedziczona. W obu przypadkach disabled, required, touched i error pozostają spójne, a disabled blokuje akcje. | Testy wspólnego kontraktu formularza i przegląd implementacji dyrektywy. |
| AC-19 | Gdy komponent jest użyty z kluczem `label`, pole ma przetłumaczoną dostępną nazwę; interaktywny Playground pozwala ustawić `control`, wariant, wartość, disabled, error i required oraz sprawdzić otwarcie całym wyzwalaczem, Escape, kliknięcie poza i wąski widok. Publiczny import działa z entry pointu Angular bez deep importu. | Test dostępności, Storybook i smoke test paczki. |
| AC-20 | Dla publicznych wejść z §5.2 domyślne `stepMinutes=30`, `timeEntryPolicy='allowManual'` i `locale='pl-PL'` dają opisane zachowanie; zmiana kroku na 15/60, polityki na `listOnly` i locale zmienia tylko właściwe zachowanie. Niepoprawny krok, polityka, locale lub granice blokują nowy wybór z `voteyPickerConfig`. Nowy wybór DateTime zapisuje `YYYY-MM-DDTHH:mm:00.000Z`, a nieedytowane wejściowe ISO zachowuje chwilę. | Test publicznego API, konfiguracji i serializacji. |
| AC-21 | Gdy kontrolka ma jednocześnie `required` lub błąd walidatora konsumenta i błąd `voteyPicker*`, picker zachowuje obie grupy kluczy. Korekta wpisu, min/max albo konfiguracji usuwa tylko własny klucz, a tłumaczenie i payload odpowiadają tabeli §5.2. | Test formularza z walidatorem zewnętrznym i zmianą konfiguracji. |

## 8. Kontrakty techniczne i testy

### 8.1 Mapa odpowiedzialności FE–BE

| Granica | Kontrakt | Właściciel |
|---|---|---|
| UI → kontrolka Angular | `YYYY-MM-DD`, ISO 8601 UTC, `HH:mm` lub `null`; odziedziczony `formControl` i stan walidacji | `design-system-votey` |
| Kontrolka → formularz aplikacji | Wartość i błędy przez wspólną reaktywną kontrolkę przekazaną wejściem `control`; bez niej komponent używa kontrolki odziedziczonej. Konsument ustala required i odczytuje stan kontrolki | Aplikacja konsumencka |
| Formularz → API | Mapowanie do istniejącego requestu i zapis; brak nowego endpointu lub kodu błędu BE | Aplikacja konsumencka i jej backend, poza WYBOREK-3042 |

Brak eventów asynchronicznych, kolejek, retry, nowych danych historycznych i transakcji. Stany loading oraz permission nie są stanami samego pickera, gdyż nie wykonuje sieci ani nie zna uprawnień; Empty oznacza puste opcjonalne pole lub brak dozwolonych pozycji, Error opisano w §5.3. `wyborek-crm` pozostaje obecnie bez zmian. Dalsza migracja wymaga osobnej oceny kontraktu formularza i ewentualnego mapowania istniejących wartości.

### 8.2 Plan testów

- Testy parsera i formattera: poprawne daty, niemożliwe dni, lata przestępne, wartości graniczne, puste i częściowe wpisy, polskie formaty oraz konwersja ISO bez przesunięcia daty Date.
- Testy reguł kalendarza: poniedziałek jako pierwszy dzień, OtherMonth, Today, min/max, fokus wybranej daty i pustego pola, najbliższa dozwolona data przy ograniczeniu, Page Up/Down z końca miesiąca i pomijanie pustego miesiąca, nawigacja strzałkami oraz pomijanie Disabled.
- Testy DateTime i DST: zachowanie godziny, pierwsza dozwolona minuta, strict/manual, brak godziny, przejścia na czas letni/zimowy, brak duplikatów i zachowanie nieedytowanego ISO.
- Testy komponentowe: wejście `control` z `VoteyFormControlApplyDirective`, odziedziczona kontrolka bez wejścia, programowa zmiana wartości, disabled, required, touched/error, utrzymanie draftu, komunikaty, etykieta przez `VOTEY_TRANSLATOR`, pozycja overlay, kliknięcie poza, fokus i ogłoszenia a11y. Osobno sprawdzić wszystkie wejścia i błędne konfiguracje z §5.2, kanoniczne `:00.000Z`, zachowanie nieedytowanego ISO oraz współistnienie `required` i zewnętrznego walidatora z każdym własnym błędem pickera; poprawa min/max lub konfiguracji usuwa wyłącznie błąd pickera.
- Testy wizualne i Storybook: warianty i stany w Light/Dark, interaktywny Playground obu pickerów, pełny wyzwalacz, Escape, klawiatura, kliknięcie poza oraz responsywny panel. Kontrola stylów potwierdza pełną mapę ról wymiarowych z §5.4 w opublikowanej paczce tokenów, bez wycofanych aliasów i literalnych wartości; test spakowanej paczki potwierdza publiczne eksporty i izolację stylów Angular/React.
- Test BE/kontraktowy i E2E CRM: N/A dla tego zadania, ponieważ nie zmienia się API ani CRM.

## 9. Wpływ na inne specyfikacje

Bieżący dokument stanowi pierwszą główną specyfikację nowego feature `date-time-pickers`. Nie aktualizuje innych głównych specyfikacji ani dokumentów CRM. WYBOREK-3055 (Input), WYBOREK-3052 (Menu), WYBOREK-3049 (Button), WYBOREK-3058 (Select) i publikacja tokenów są zależnościami lub źródłami wzorca, a nie dokumentami zmienianymi w tym zadaniu. `affectedSpecifications` jest puste: `[]`.

## 10. Wersjonowanie

Pierwsza wersja głównego dokumentu: `1.0.0`; wpis rejestru: `date-time-pickers: 1.0.0`. Wersja paczki runtime oraz termin publikacji nie są ustalone w zadaniu. Po zmianach review należy podbić wersję dokumentu zgodnie z przyjętą polityką wersjonowania.

## 11. Rollout i wycofanie

1. Najpierw opublikować paczkę DS z tokenami semantycznymi wymaganymi przez pickery. Przed implementacją stylów odebrać pełną mapę rola → nazwa → wartość z §5.4 i potwierdzić ją w opublikowanym artefakcie dla obu motywów; nie rozpoczynać zależnych stylów ani nie wydawać pickerów przy brakującej roli.
2. Następnie dodać i przetestować publiczne pickery oraz zależność `@angular/cdk`, sprawdzić wszystkie AC, Light/Dark i dostępność, a dopiero potem opublikować paczkę DS.
3. W WYBOREK-3042 nie aktywować komponentu w CRM. Jego lokalny picker działa dalej; przyszła wymiana jest osobną zmianą i wymaga weryfikacji mapowania wartości, locale oraz natychmiastowego wyboru.
4. W razie niepowodzenia wydania nie wdrażać nowej wersji paczki u konsumentów; konsumenci pozostają przy wcześniejszej wersji. Brak migracji danych i flagi funkcjonalnej. Ponowne wdrożenie wymaga przywrócenia tokenów i przejścia bramki testowej.

## 12. Definition of Done

- Wszystkie AC-01–AC-21 mają test lub wskazaną kontrolę wizualną i są spełnione.
- Publiczne eksporty, kontrakt dyrektywy i wejścia `control`, stan disabled, walidacja, etykieta, dostępność i interaktywny Playground są udokumentowane i sprawdzone.
- Pełna mapa ról wymiarowych z §5.4 jest potwierdzona w opublikowanej paczce dla obu motywów; nie użyto wycofanych aliasów ani literalnych wartości objętych tokenami.
- Dokument stanowi kompletny kontrakt FE+BE dla tego zakresu i nie wymaga diagramu do implementacji lub review.

## 13. Handoff i akceptacja

Dokument pozostaje w stanie Draft. Najpierw PleoAI pokaże go developerom; po akceptacji co najmniej jednej osoby PleoAI uruchomi niezależne review Phoebe. Nie publikować dokumentu ani nie uruchamiać review w ramach tego authoringu.

## Decyzje z prespecki

| ID | Kategoria | Obowiązujące rozstrzygnięcie | Status |
|---|---|---|---|
| P1 | UX | Nazwy miesięcy i dni po przyszłej integracji odpowiadają językowi CRM i jego tłumaczeniom. | Odpowiedź własna |
| P2 | UX | Wcześniejsza odpowiedź o zachowaniu poprzedniej wartości po wyborze dnia została zastąpiona przez P19. | Zastąpiona |
| P3 | UX | Zmiana dnia zachowuje dotychczasową godzinę, jeśli nadal jest dozwolona. | Zaakceptowana sugestia |
| P4 | UX | Wybór godziny w DateTime zamyka panel. | Zaakceptowana sugestia |
| P5 | Walidacja | Krok listy oraz dopuszczanie nowej godziny spoza listy są konfigurowalne. | Odpowiedź własna |
| P6 | Dane zastane | Wcześniej zapisana godzina spoza siatki pozostaje bez zaokrąglenia. | Zaakceptowana sugestia |
| P7 | Reguły biznesowe | Min/max DateTime uwzględniają również godzinę. | Zaakceptowana sugestia |
| P8 | Edge case | Nie wolno zatwierdzić niedozwolonej godziny. | Zaakceptowana sugestia |
| P9 | Walidacja | Po zmianie zakresu zachowuje się istniejącą wartość i pokazuje błąd. | Zaakceptowana sugestia |
| P10 | UX | Gdy dziś jest poza zakresem, pusty kalendarz otwiera miesiąc najbliższej dozwolonej daty. | Zaakceptowana sugestia |
| P11 | Dostępność | Strzałki omijają niedostępne dni. | Zaakceptowana sugestia |
| P12 | Walidacja | Błędny wpis pozostaje widoczny po opuszczeniu pola. | Zaakceptowana sugestia |
| P13 | Walidacja | Komunikaty rozróżniają format, nieistniejącą datę i zakres. | Zaakceptowana sugestia |
| P14 | UX | Pole niewymagane można wyczyścić. | Zaakceptowana sugestia |
| P15 | UX | Zmiany w panelu aktualizują kontrolkę od razu; Escape i kliknięcie poza panelem zachowują zmiany. | Odpowiedź własna |
| P16 | UX | Panel dostosowuje szerokość bez poziomego przewijania strony. | Zaakceptowana sugestia |
| P17 | Integracja | Przyszła wymiana pickera CRM przechodzi na natychmiastowy wybór. | Odpowiedź własna |
| P18 | UX | Zmiana dnia już wypełnionego DateTime jest natychmiast zapisywana. | Odpowiedź własna |
| P19 | UX | Każda zmiana dnia lub godziny w panelu aktualizuje kontrolkę od razu; zastępuje P2. | Zaakceptowana sugestia |
| P20 | Walidacja | Domyślny krok podpowiedzi to 30 minut. | Zaakceptowana sugestia |
| P21 | Walidacja | Domyślnie poprawny ręczny wpis spoza listy jest dozwolony. | Zaakceptowana sugestia |
| P22 | Dane zastane | Przy polityce „tylko lista” wcześniej zapisana, niezmieniona godzina spoza listy jest ważna. | Zaakceptowana sugestia |
| P23 | Edge case | Dzień bez podpowiedzi pozostaje aktywny, jeśli istnieje dozwolona godzina możliwa do wpisania ręcznie. | Zaakceptowana sugestia |

Dodatkowo zatwierdzono dla tego zadania: pierwszą dozwoloną godzinę po wyborze dnia DateTime, kontrakty `YYYY-MM-DD` / ISO 8601 / `HH:mm`, osobną publikację tokenów, reguły DST i unikalność listy godzin. Te rozstrzygnięcia są normatywnie opisane w §5–§8.
