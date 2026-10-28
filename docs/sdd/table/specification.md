# WERSJA 1.0.4

# Specyfikacja komponentu Table

## 1. Status i cel

- Data: 2026-10-28, Europe/Warsaw.
- Status: wymagania funkcjonalne uzgodnione przed implementacją; pytania z sekcji 10 rozstrzygnięte.
- Zakres: komponent Angular w `@pleodigital/design-system-votey/angular` i przykłady Storybooka. Migracja ekranów CRM nie została zlecona.
- Cel: reużywalna tabela oparta na rzeczywistych potrzebach `wyborek-crm`, inspirowana lokalnym `ds-table` z `angular-design-system`, o mniejszym zakresie konfiguracji.
- Źródło decyzji: analiza lokalnego kodu oraz odpowiedzi użytkowniczki w bieżącym czacie. Dokument rozdziela ustalenia, dowody z kodu i kwestie otwarte. Nazwy przyszłych inputów/outputów nie są jeszcze zatwierdzonym API.

## 2. Źródła analizy

Przegląd objął 22 natywne tabele w 19 szablonach CRM i dodatkowo tabelaryczny konfigurator tłumaczeń. Analiza była statyczna; nie stanowi weryfikacji wyglądu runtime.

| Obszar | Źródło lokalne względem repozytorium |
| --- | --- |
| Uczestnicy, paginacja, wyszukiwanie requestem | `wyborek-crm/src/app/client/members/members-list/members-list.component.{html,ts}` |
| Zaznaczanie, Shift, edycja udziałów, reprezentowane osoby | `wyborek-crm/src/app/client/events/voting/vote-members/email-view/email-view.component.{html,ts}` i analogiczny `sms-view` |
| Dynamiczne kolumny wyników | `wyborek-crm/src/app/client/events/voting/vote-results/vote-results-tables/vote-results-tables.component.html` |
| Kliknięcie rekordu i osobne akcje | `wyborek-crm/src/app/client/events/events-list/table-list/table-list.component.html` |
| Przeciąganie wierszy agendy | `wyborek-crm/src/app/client/events/voting/vote-event/vote-event.component.html` |
| Wyszukiwanie po FE | `wyborek-crm/src/app/client/settings/translations-configurator/translations-configurator.component.ts`, computed `filteredRows` |
| Obecny wygląd | `wyborek-crm/src/styles/tables.scss` i lokalne style tabel, m.in. `vote-members/members-table.scss` |
| Inspiracja | `angular-design-system/libs/design-system/src/lib/components/table/table.component.{html,ts}` oraz `models/columns-definitions.ts` |
| Istniejąca paginacja Votey | `angular/src/lib/pagination/votey-pagination.component.{html,ts,scss}`, `pagination.model.ts` |

## 3. Zakres funkcjonalny

### 3.1 Kolumny i komórki

- Lista kolumn określa identyfikator, nagłówek, szerokość i wyrównanie.
- Obsługiwane są kolumny dynamiczne i warunkowe; konfigurację dostarcza konsument.
- Własny szablon komórki jest wymagany: statusy, ikony, przyciski, linki, tooltipy, pliki i lokalne edytory mogą być treścią komórki.
- Akcje rekordu są własnym szablonem komórki, bez narzuconego menu.
- Tabela nie interpretuje ról, statusów domenowych, uprawnień, endpointów ani routingu CRM.
- Własny szablon nagłówka wprowadzamy tylko, jeśli okaże się potrzebny. Istniejący przypadek do oceny: przycisk filtrowania w nagłówku konfiguratora tłumaczeń; tooltipy pytań mogą wymagać jedynie konfiguracji nagłówka. Nie uznano jeszcze dowolnego szablonu nagłówka za bezwarunkowy wymóg.

W `ds-table` kolumna `actions` renderuje menu rekordu z treści `#actions`, gdy nie ma `#main`. Przy własnym `#main` konsument renderuje również akcje. `#buttons` służy dodatkowej treści top bara. Te mechanizmy nie mogą być mylone w implementacji ani dokumentacji Votey.

### 3.2 Interakcja z rekordem

- Opcjonalna aktywacja rekordu kliknięciem oraz przyciski i linki w komórkach.
- Kliknięcie kontrolki wewnątrz rekordu nie może przypadkowo uruchamiać akcji całego rekordu.
- Zgodnie z decyzją użytkowniczki na tym etapie pomijamy własną obsługę klawiatury aktywującą wiersz. Nie oznacza to wyłączania standardowej obsługi klawiatury istniejących przycisków, checkboxów i paginacji.

### 3.3 Zaznaczanie

- Opcjonalne zaznaczanie pojedynczego rekordu checkboxem.
- Checkbox nagłówka zaznacza/odznacza rekordy widoczne na bieżącej stronie.
- Nagłówek pokazuje stan częściowego zaznaczenia.
- Shift umożliwia zaznaczenie lub odznaczenie zakresu widocznych rekordów, zgodnie z wartością docelowego checkboxa.
- Zaznaczenie utrzymuje się między stronami. Tożsamość rekordu musi być stabilna niezależnie od instancji obiektu zwróconego requestem.
- Pasek nad tabelą prezentuje liczbę zaznaczonych rekordów i własne akcje zbiorcze konsumenta. Nagłówki kolumn pozostają widoczne.
- Zmiana filtrów resetuje zaznaczenie dopiero po potwierdzeniu.
- Przed operacją powodującą utratę zaznaczenia użytkownik otrzymuje monit z możliwością kontynuacji lub odmowy. Monit jest wbudowany w tabelę i dotyczy zmiany filtrów oraz wyszukiwania powodującej utratę zaznaczenia. Ręczne odznaczanie checkboxów i „odznacz wszystko” nie wymagają monitu.
- Przy odmowie nie stosujemy proponowanych filtrów, nie czyścimy zaznaczenia i zachowujemy dotychczasowe wyniki. Nie wolno wcześniej wysłać requestu z odrzuconymi filtrami.
- Przy akceptacji można zatwierdzić proponowane filtry i wyczyścić zaznaczenie.
- Samo zastąpienie danych nową stroną nie może automatycznie czyścić zaznaczenia.

### 3.4 Dane i paginacja

- Tabela obsługuje tryb bez paginacji i tryb paginowany.
- Używamy istniejącego `VoteyPaginationComponent` / `vt-pagination`, bez tworzenia drugiego paginatora.
- Aktualny kontrakt paginatora: `page`, `size`, `totalElements`, `pageSizeOptions`, `disabled`, `loading`, output `pagination`.
- Strony w istniejącym API są numerowane od zera. Obecne wartości domyślne to strona 0, rozmiar 20 i opcje `[10, 20, 50, 100]`; nie jest potrzebny nowy zestaw domyślny dla tabeli.
- Konsument przekazuje gotowe rekordy i metadane strony. Tabela emituje intencję zmiany parametrów; pobieranie danych wykonuje aplikacja.
- Publiczny `PaginationEvent` ma już opcjonalne `search` i `sort`. Sama obecność pola `sort` nie oznacza wdrożenia sortowania UI.

### 3.5 Wyszukiwanie i filtry

- Dla danych pobieranych paginowanym/filtrowanym requestem wyszukiwanie korzysta z tego samego procesu pobierania, a nie tylko z rekordów aktualnej strony.
- Tabela przekazuje intencję wyszukiwania; nie wykonuje HTTP.
- Opcjonalny tryb wyszukiwania po FE ma uzasadnienie w CRM: konfigurator tłumaczeń przeszukuje lokalnie klucz i wartość tłumaczenia aktywnego języka, po normalizacji frazy przez `trim().toLowerCase()`.
- Tryb FE nie może udawać przeszukiwania całego zbioru, gdy przekazana jest tylko jedna strona danych serwerowych.
- Nie projektujemy rozbudowanego silnika filtrów. Toolbar umożliwia osadzenie kontrolek konsumenta.
- Definicja kolumny zawiera `searchable: boolean`. Wyszukiwanie FE obejmuje kolumny oznaczone `searchable: true`.
- Bez zaznaczonych rekordów wyszukiwanie stosujemy automatycznie po debounce 300 ms i wpisaniu minimum 3 znaków.
- Przy istniejącym zaznaczeniu wpisywanie frazy nie stosuje wyszukiwania automatycznie. Użytkownik zatwierdza je Enterem lub kliknięciem ikony lupy, po czym tabela pokazuje wbudowany monit utraty zaznaczenia. Odmowa zachowuje dotychczasowe wyniki, zastosowane parametry i zaznaczenie.
- Wyczyszczenie wyszukiwania ikoną X przywraca pełny zbiór (bez warunku wyszukiwania, z zachowaniem pozostałych zastosowanych filtrów). Wpisanie 1–2 znaków pozostawia poprzedni zbiór wyników i nie stosuje nowej frazy. Przy istniejącym zaznaczeniu przywrócenie zbioru nadal wymaga zatwierdzenia i monitu; odmowa zachowuje zastosowane wyszukiwanie, wyniki i zaznaczenie.

### 3.6 Sortowanie

- Nie znaleziono sterowanego przez użytkownika sortowania nagłówkami w przejrzanych tabelach CRM ani wystąpień `matSort`/`sortChange` w obszarze `src/app/client`.
- CRM zawiera lokalne porządkowanie danych, np. pytań i odpowiedzi według kolejności, oraz sortowanie pomocniczych list. Pozostaje ono odpowiedzialnością aplikacji i nie uzasadnia sortowania UI w tabeli.
- Sortowanie kolumn odkładamy zgodnie z warunkową decyzją użytkowniczki.

### 3.7 Stany

- Loading: skeleton wierszy.
- Brak danych.
- Brak wyników wyszukiwania/filtrowania, odróżniony od pustego zbioru.
- Błąd pobierania z możliwością ponowienia; konsument wykonuje ponowienie requestu.
- Teksty i treść nie mogą zawierać reguł biznesowych CRM.
- Podczas każdego requestu danych tabeli (pierwsze pobranie, zmiana strony, wyszukiwanie, filtrowanie, odświeżenie i retry) zawartość danych zastępuje skeleton. Liczba wierszy skeletonu odpowiada rozmiarowi strony. Stan zaznaczenia nie znika wskutek samego renderowania skeletonu. W trybie bez paginacji skeleton ma 5 wierszy.

### 3.8 Layout i wygląd

- Wzorcem wyglądu jest `app-members-view`, tj. `MembersViewComponent` w `wyborek-crm/src/app/client/members/members-list/members-list.component.{ts,html,scss}`. Późniejsze ujednolicanie różnic między ekranami pozostaje kolejnym etapem.
- Szeroka tabela przewija się poziomo; pierwsza wersja nie przełącza rekordów na karty.
- Nagłówek pozostaje sticky podczas przewijania.
- Kolumna zaznaczania i kolumna akcji również pozostają sticky. Należy sprawdzić nakładanie się narożników, tło i widoczność treści podczas przewijania.
- Pionowe przewijanie odbywa się wewnątrz kontenera tabeli o ograniczonej wysokości; sticky header odnosi się do tego kontenera.
- Nagłówki kolumn używają `vt-text` w wariancie `caption-extrabold`; domyślne komórki danych bez własnego szablonu używają jawnie `body`.
- Publiczny input `headerVariant`: `standard` (domyślnie białe tło (`--color-white`) i tekst `primary`) albo `heavy` (tło `--color-bg-inverse`, tekst `inverse`, zaokrąglenia pierwszej i ostatniej komórki `--radius-xl`, takie jak w wierszach danych).
- Storybook udostępnia kontrolkę wyboru wariantu nagłówka i przykład `HeavyHeader`.
- Nie zatwierdzono osobnego wariantu compact.

## 4. Granice odpowiedzialności

| Tabela w paczce | Konsument |
| --- | --- |
| Renderowanie kolumn i szablonów | Dane domenowe i konfiguracja kolumn |
| Mechanizm zaznaczania i prezentacja licznika | Wykonanie akcji zbiorczych i uprawnienia |
| Integracja z istniejącą paginacją | Requesty i stan pobierania |
| Prezentacja stanów i intencja retry | Ponowienie pobrania |
| Toolbar i komórki jako miejsca kompozycji | Kontrolki filtrów, akcje, edytory komórek |
| Oczekiwanie na decyzję przed utratą zaznaczenia | Wbudowany monit potwierdzenia w tabeli |

## 5. Poza zakresem pierwszej wersji

- Przeciąganie wierszy agendy.
- Dedykowany mechanizm powiązanych osób i hierarchicznych rekordów.
- Gotowy edytor udziałów i generowanie formularzy całych wierszy. Własny edytor może być treścią komórki.
- Sortowanie kolumn przez użytkownika.
- Mobilne karty.
- Zarządzanie widocznością, kolejnością i przypinaniem kolumn przez użytkownika oraz zapisywanie preferencji.
- Wbudowany eksport, eksport kalendarza i silnik filtrów znany z `ds-table`.
- Zagnieżdżone tabele, dynamiczne pobieranie rozwinięć, radio selection, sumy kolumn i paginacja przez scroll.

Zakres został potwierdzony: pierwsza wersja obejmuje podstawową tabelę, paginację i pełne zaznaczanie; mechanizmy specjalne są odłożone zgodnie z odpowiedzią 16.

### 5.1 Funkcjonalności do wprowadzenia później i ich konsumenci CRM

Ta lista jest backlogiem potwierdzonych potrzeb kolejnych iteracji, a nie deklaracją ich obsługi w pierwszej wersji.

| Funkcjonalność późniejszej iteracji | Komponent CRM, który jej potrzebuje | Uwagi |
| --- | --- | --- |
| Przeciąganie wierszy i zmiana ich kolejności | `VoteEventComponent` — `src/app/client/events/voting/vote-event/vote-event.component.ts` | Agenda; emitowanie nowej kolejności, utrwalenie po stronie CRM |
| Układ uczestnika i reprezentowanych osób, ze zgodnym wyrównaniem między kolumnami | `EmailViewComponent`, `SmsViewComponent` — katalogi `src/app/client/events/voting/vote-members/email-view/` i `sms-view/` | Nie zakładać, że jest to rozwijana zagnieżdżona tabela |
| Układ dodawanych uczestników i reprezentowanych osób | `AddVoteMembersEmailOrSmsComponent` — `src/app/client/events/voting/vote-members/add-vote-members/add-vote-members-email-or-sms/` | Zachowanie relacji, załączników i akcji poszczególnych osób |
| Integracja edycji udziałów w komórkach i przechodzenia do następnego edytowanego rekordu | `EmailViewComponent`, `SmsViewComponent` | Edytor pozostaje domenowym komponentem CRM; pierwsza wersja tabeli daje szablon komórki, ale nie dostarcza gotowej integracji |

Pozostałe funkcje wymienione jako poza zakresem (np. eksport, sortowanie nagłówkami i preferencje kolumn) nie mają potwierdzonego konsumenta w przejrzanych tabelach CRM. Nie są automatycznie wymaganiami przyszłej implementacji; wymagają nowej potrzeby i decyzji.

## 6. Storybook

Jedna karta/grupa **Table**, pod nią przykłady:

| Przykład | Zakres |
| --- | --- |
| Basic | Zwykła tabela bez zaznaczania i paginacji |
| Custom cells & actions | Różne treści komórek i własne akcje rekordu |
| Selection | Checkboxy, indeterminate, Shift, licznik i akcje nad tabelą |
| Pagination | Istniejący `vt-pagination` i sterowane dane |
| Selection & pagination | Zachowanie zaznaczenia między stronami |
| Loading / Empty / Error | Skeleton, pusty zbiór, brak wyników, błąd i retry |
| Wide table | Poziomy scroll oraz sticky header, selection i actions |

W istniejących przykładach należy dodatkowo pokazać wyszukiwanie requestem, opcjonalne wyszukiwanie FE i potwierdzenie/odmowę zmiany filtrów powodującej utratę zaznaczenia. Nie wymaga to osobnej uzgodnionej nazwy story.

## 7. Kryteria akceptacji

1. Prosta tabela działa bez wymagania paginacji, wyszukiwania lub zaznaczania.
2. Konfiguracja kolumn steruje zgodnie nagłówkami i komórkami, również przy warunkowej zmianie listy kolumn.
3. Konsument renderuje własne komórki i akcje; kliknięcie akcji nie aktywuje wiersza.
4. Zaznaczanie pojedyncze, wszystkich widocznych, indeterminate i Shift działają spójnie.
5. Przejście między stronami i nowe instancje rekordów o tych samych identyfikatorach nie gubią zaznaczenia.
6. Odmowa utraty zaznaczenia zachowuje wybór, zastosowane filtry i wyniki; nie uruchamia odrzuconego requestu.
7. Akceptacja umożliwia zastosowanie nowych filtrów i reset zaznaczenia.
8. Zmiany strony obsługuje istniejący paginator, z zachowaniem jego indeksowania od zera.
9. Wyszukiwanie serwerowe dotyczy zbioru po stronie requestu; FE jest osobnym opcjonalnym trybem dla lokalnych danych i obejmuje kolumny `searchable: true`. Obowiązuje debounce 300 ms, minimum 3 znaki i ręczne zatwierdzenie przy zaznaczeniu.
10. Wszystkie uzgodnione stany mają reprezentację w Storybooku, w tym skeleton i retry.
11. Przy poziomym przewijaniu nagłówki i komórki pozostają wyrównane, a sticky elementy nie zasłaniają się przypadkowo.
12. Komponent i wymagane typy są dostępne z publicznego entry pointu Angular paczki.
13. Ikona X przywraca zbiór bez wyszukiwania, a fraza 1–2 znaki nie zmienia wyników. Przy zaznaczeniu reset wyszukiwania wymaga zatwierdzenia i monitu; odmowa zachowuje poprzedni stan.
14. Każdy request danych tabeli pokazuje skeleton: tyle wierszy, ile wynosi rozmiar strony, lub 5 w trybie bez paginacji.

## 8. Weryfikacja przy implementacji

- Testy kontraktu zaznaczania, przechodzenia między stronami, akceptacji i odmowy resetu oraz propagacji akcji.
- Testy integracji paginatora i obu trybów wyszukiwania.
- Sprawdzenie wszystkich stories, stanów oraz sticky i overflow na szerokim i wąskim kontenerze.
- Weryfikacja builda paczki i Storybooka w zakresie wynikającym z obowiązujących instrukcji.
- Wdrożenie rozpoczęto po zatwierdzeniu wymagań. Wyniki weryfikacji są zapisywane w dokumentacji kontraktu komponentu i podsumowaniu pracy.

## 9. Decyzje techniczne do projektu API

Przed kodowaniem trzeba rozpisać mały, typowany kontrakt danych, stabilnych kluczy, kolumn, kontekstu szablonu komórki, zaznaczenia i procesu zatwierdzania zmian. Nie należy kopiować całego API `ds-table`. Szczegóły implementacyjne mają wynikać z zatwierdzonych zachowań i istniejących publicznych prymitywów Votey.

### 9.1 Obowiązkowe użycie istniejących komponentów Votey

- Tabela, jej wbudowany monit i przykłady w Storybooku muszą używać istniejących komponentów Design Systemu wszędzie, gdzie odpowiadają one wymaganej roli: m.in. button, checkbox, pagination, input/search, icon, text oraz dostępne komponenty monitu i stanów.
- Przed wykonaniem danego elementu należy sprawdzić rzeczywiste publiczne API i warianty istniejącego komponentu. Nie wolno zakładać dostępności komponentu na podstawie samej nazwy lub katalogu źródłowego.
- Paginacja korzysta z `VoteyPaginationComponent`; zaznaczanie z istniejącego checkboxa; przyciski akcji, lupy i czyszczenia z istniejącego buttona oraz ikon Votey, zgodnie z ich publicznym kontraktem.
- Własny szablon komórki nie jest zgodą na odtwarzanie istniejących kontrolek DS. Ta sama zasada obowiązuje w demonstracyjnych szablonach Storybooka.
- Lokalny odpowiednik lub zastępstwo istniejącego komponentu jest dopuszczalne wyłącznie w skrajnym przypadku, gdy istniejące publiczne API nie pozwala spełnić konkretnego wymagania, i dopiero po jawnej zgodzie użytkowniczki.
- Przed takim wyjątkiem należy przedstawić ograniczenie, sprawdzone możliwości istniejącego komponentu, proponowane rozwiązanie i zakres odstępstwa. Brak odpowiedzi nie oznacza zgody. Nie implementujemy lokalnego zastępstwa przed otrzymaniem akceptacji.
- Każdy zatwierdzony wyjątek należy zapisać w tej specyfikacji wraz z uzasadnieniem i zakresem. Zatwierdzone wyjątki: wbudowany monit tabeli oparty na Angular CDK Dialog z przyciskami i tekstem Votey oraz lokalny skeleton wierszy. Zgoda użytkowniczki została udzielona 2026-10-28 po potwierdzeniu braku komponentów dialog/modal i skeleton w paczce. Zakres zgody nie obejmuje zastępowania button, checkbox, input, text, icon ani pagination.
- Własna struktura tabeli i jej logika, dla których powstaje nowy komponent, nie stanowią same w sobie lokalnego zastępstwa istniejących kontrolek.

## 10. Pytania otwarte

### Rozstrzygnięcia pytań Q1–Q3

- Q1: zgodnie z odpowiedzią 16; rozbudowane mechanizmy odłożone, z obowiązkowym backlogiem i nazwami konsumentów CRM w sekcji 5.1.
- Q2: monit przy filtrach i wyszukiwaniu; checkboxy bez monitu.
- Q3: monit wbudowany w tabelę. Konsument nie odpowiada za jego wyświetlanie; zmiana parametrów jest zatwierdzana dopiero po akceptacji.

### Rozstrzygnięcia pytań Q4–Q6

- Q4: automatyczne wyszukiwanie po 300 ms i minimum 3 znakach. Przy zaznaczeniu: Enter lub ikona lupy, następnie monit. Wyszukiwanie FE według `searchable: boolean` w definicjach kolumn.
- Q5: przewijanie wewnątrz tabeli o ograniczonej wysokości. Wzorzec: `app-members-view`.
- Q6: skeleton podczas każdego requestu danych tabeli; liczba wierszy równa rozmiarowi strony.

### Rozstrzygnięcia pytań Q7–Q8

- Q7: ikona X w wyszukiwarce przywraca pełny zbiór bez warunku wyszukiwania. Fraza 1–2 znaki pozostawia poprzedni zbiór. Przy istniejącym zaznaczeniu nadal obowiązują zatwierdzenie i monit przed utratą zaznaczenia.
- Q8: tabela bez paginacji pokazuje 5 wierszy skeletonu.

Wszystkie pytania funkcjonalne zapisane w tym dokumencie zostały rozstrzygnięte. Implementację rozpoczęto na jawne polecenie użytkowniczki.


## 11. Kontrakt implementacji pierwszej wersji

- `VoteyTableComponent<T>` (`vt-table`) i `VoteyTableCellDirective<T>` (`ng-template[vtTableCell]`) są eksportowane z publicznego entry pointu Angular.
- `rows`, `columns`, `rowKey` i `label` są wymagane. `rowKey` zwraca stabilny string lub number. `columns` zawierają `id`, `header`, `value(row)`, opcjonalne `width` w px (domyślnie 180), `align`, `searchable` i `role: 'actions'`. Kolumna akcji jest pojedynczą ostatnią kolumną.
- Własna komórka: `<ng-template vtTableCell="actions" let-row let-value="value" let-column="column" let-index="index">`. Kontekst zawiera rekord, wartość, definicję kolumny i indeks na stronie. Domyślną komórkę renderuje `vt-text`. Konsument przekazuje wartości wyszukiwalne przez `value`, niezależnie od wizualnego szablonu komórki.
- `selectedKeys` jest modelem stabilnych identyfikatorów, nie obiektów rekordów. Akcje zbiorcze otrzymują wszystkie wybrane klucze przez `selectionActions: TemplateRef`, również z innych stron.
- `queryChange` emituje `{page, size, search, filters}`. Konsument aktualizuje wejścia `page`, `size`, `search`, `filters` i dane po zatwierdzonej emisji. Nie stosuje najpierw nowych filtrów wejściem.
- Filtry zewnętrznego toolbara muszą przejść przez `requestFilters(candidate): Promise<boolean>`. Dopiero akceptacja monitu powoduje `queryChange`; odmowa zwraca false i emituje `filtersCancelled` z odrzuconym kandydatem. Konsument zachowuje szkic filtrów osobno od zastosowanych parametrów.
- `searchMode`: `none`, `local`, `remote`. W local przekazuje się pełny zbiór do wyszukiwania i ewentualnego stronicowania FE; w remote gotową stronę z serwera oraz `totalElements`. Paginacja bez local również prezentuje gotową stronę konsumenta.
- Ponowienie pobrania emituje `retry`; aktywacja nieinteraktywnej części wiersza emituje `rowClick`. Niestandardowe interaktywne elementy komórek oznacza się `data-table-interactive`.
- Toolbar: projekcja `[vtTableToolbar]`. Wyszukiwarka jest wbudowana i opcjonalna. Parametry zapytań z aplikacji są stanem zatwierdzonym; proces potwierdzenia należy uruchomić przed ich zmianą.
- Ograniczenie wysokości kontenera: 66vh, zgodnie z bazowym widokiem uczestników CRM. Nagłówek sticky do góry, zaznaczanie do lewej, akcje do prawej. Brak nowego wariantu compact i ogólnego szablonu nagłówka w pierwszej implementacji.
- Teksty tabeli używają adaptera `VOTEY_TRANSLATOR`. Nowe klucze i przykładowe polskie treści są opisane w `angular/src/lib/table/README.md`.


## 12. Weryfikacja wdrożenia

- Build Angular paczki: poprawny.
- Pełny build paczki i Storybooka: poprawny; po korektach ponowiono build Angular i Storybooka.
- Testy Node paczki: 49 zaliczonych, 2 istniejące legacy pominięte; w tym 4 nowe testy tabeli.
- Smoke test Storybooka: zaznaczanie, indeterminate i zakres Shift, przejście między stronami bez utraty wyboru, odmowa i akceptacja filtrów, Enter przy wyszukiwaniu z zaznaczeniem, wyszukiwanie FE i X, skeleton 10 wierszy przy stronie 10 oraz 5 bez paginacji.
- Szeroka tabela: potwierdzono poziomy overflow (1596px tabeli przy 1036px obszaru widocznego) oraz przyklejenie nagłówka, zaznaczania i akcji po przewinięciu w obu osiach; sprawdzono renderowanie dark.
- Kontrola SCSS: wszystkie użyte tokeny istnieją; brak surowych kolorów i własnych pomocniczych zmiennych CSS.
- Dodano specy TestBed opisujące potwierdzenie i wymianę obiektów rekordów. Nie uruchamiano ich: repozytorium nie ma skonfigurowanego runnera dla Angularowych plików `.spec.ts`; działający runner Node i interakcje Storybooka zweryfikowano oddzielnie.
- W runtime istniejących kontrolek formularzowych pojawiają się ostrzeżenia Angulara o łączeniu reactive forms z bindingiem disabled. Nie zmieniano z tego powodu kontraktu checkboxa ani inputa w ramach tabeli.
- Migracja CRM i publikacja paczki pozostają poza wykonanym zakresem.

- Warianty nagłówka: build Angular i Storybook poprawny; 4 testy tabeli zaliczone. Runtime potwierdza `caption-extrabold` dla nagłówków i `body` dla domyślnych komórek; standard ma białe tło i primary, heavy bg-inverse/inverse oraz promień narożników 16px zgodny z wierszami danych.


## 13. Wydzielenie Search

- Tabela używa publicznego `VoteySearchComponent` (`vt-search`) zamiast składać wyszukiwarkę we własnym template.
- `vt-search` komponuje istniejące `vt-input` i `vt-button`; publiczny slot `vtInputSuffix` w inpucie umieszcza X i lupę wewnątrz pola po prawej. X jest po lewej stronie lupy i pojawia się tylko przy niepustej wartości.
- Kontrolka używa wspólnego `control`; `searched` emituje wpisany tekst po Enterze lub lupie, `cleared` po wyczyszczeniu kontrolki. Reguły wyszukiwania i potwierdzenia nadal należą do tabeli.
- Nagłówek standard ma białe tło z tokenu `--color-white`, zamiast przezroczystego.
- Dodano Storybook Search / Playground oraz 3 testy kontrolki, w tym czyszczenie, submit, disabled i odpinanie subskrypcji.
