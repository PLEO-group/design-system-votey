# Historia zmian

Wczytuj ten plik tylko przy audycie wersji, analizie regresji zachowania skilla albo przygotowaniu publikacji.

## 1.25.0

Doprecyzowano proporcjonalność abstrakcji: nazwane sygnały dla stałych źródeł,
mapy dla rzeczywistych kolekcji zasobów oraz ocenę kosztu komponentu pomocniczego
względem prostego rozwiązania lokalnego. Rozróżniono komponent prezentacyjny
od samodzielnego widgetu korzystającego ze współdzielonego serwisu. Zachowano
jednego właściciela pobierania i cache oraz retry ograniczone do nieudanego źródła.

## 1.24.0

Rozszerzono ocenę kosztu na walidację i akcje użytkownika. Konkretne oznaki kosztownego rozwiązania uruchamiają przedstawienie kosztu i tańszej alternatywy, w tym propozycji rozszerzenia kontraktu BE. Discovery zaczyna się od FE, bez rutynowego sprawdzania repo BE i obowiązkowej mapy kontraktu przy każdej zmianie. Zachowano sprawdzenie semantyki identyfikatorów, pokrycia typów oraz kontrolę kosztu po zmianie.

## 1.23.0

Dodano zasadę pozostawiania wymiarów w px, gdy brak odpowiedniego tokenu,
bez sztucznego składania stałych z kilku tokenów. Zachowano obliczenia wynikające
z rzeczywistych zależności layoutu.

Dodano obowiązkową bramkę SCSS przed własnymi CSS custom properties: pierwsza
próba SCSS, konkretne ograniczenie, uzasadnienie wyjątku użytkownikowi i kontrola
kaskady. Rozróżniono pomocnicze aliasy od publicznych tokenów DS zmienianych w
runtime. Doprecyzowano triggery `.ts`, ograniczając je do plików z kodem
aplikacyjnym Angulara; skrypty buildowe i konfiguracja pozostają poza zakresem.

## 1.22.0

Dodano przegląd analogicznych uwag CR wyłącznie w plikach ruszonych w tasku, `ngOnChanges` jako ostateczność oraz discovery projektowej konwencji plików komponentu. Uzupełniono sekwencje asynchroniczne, granice retry i rozróżnienie zakończenia od anulowania. Koszt średni lub duży wymaga ujawnienia i zgody użytkownika przed wdrożeniem lub uruchomieniem przepływu.

## 1.21.0

Dodano domyślny podział constructor / `ngOnInit` / prywatne metody procesów,
z zachowaniem momentu inicjalizacji, injection context i krótkich callbacków.
Rozszerzono zasady efektów o dynamiczne zależności, równość wyników `computed`,
`untracked`, pośrednie pętle aktualizacji i cleanup subskrypcji między przebiegami.
Przykłady i szczegóły są w `references/initialization-and-effects.md`.

## 1.20.0

Doprecyzowano ochronę ustaleń z wcześniejszych iteracji, podział odpowiedzialności FE/BE/DS oraz niezależność preferencji, routingu i cache przy współdzieleniu prezentacji. Brak kontraktu BE nie upoważnia do odtwarzania jego funkcji w FE.

## 1.19.0

Dodano warunkowe playbooki rozszerzania istniejącej funkcjonalności o wariant,
bezpieczeństwa kontekstu operacji asynchronicznych oraz kosztu pobierania danych
pomocniczych. Uzupełniono routing i odnośniki w zasadach stanu oraz requestów.
Reguły obejmują ochronę starych wariantów, ponowne sprawdzanie uprawnień po
oczekiwaniu, zakres providerów i blokad, zachowanie draftu, lazy loading,
jednego właściciela debounce oraz lokalny zakres retry i odświeżenia.

## 1.16.0

Doprecyzowano wyjątek dla `effect()` zapisującego do lokalnego signala, gdy
komponent utrzymuje interaktywny stan zależny od wartości dostarczanej przez
`input()`. Dodano checklistę ochrony przed pętlą aktualizacji i wskazano, że
`computed()` nadal jest właściwym wyborem dla zwykłych wartości pochodnych.

## 1.14.2

Doprecyzowano zakaz metod w template'ach: rozróżniono niedozwolone obliczenia
wykonywane podczas renderowania od poprawnych odczytów signali, `computed`,
intrinsics Angulara i handlerów zdarzeń. Dodano obowiązkowy audyt kandydatów na
wywołania po zmianie HTML bez ślepego zastępowania reaktywnego API getterami.

## 1.14.1

Dodano routing jawnych próśb o kompletne migracje SQL tłumaczeń GoCouriers do
specjalistycznego skilla `gocouriers-translation-query`, bez rozszerzania
odpowiedzialności standardów Angulara o schemat bazy i tłumaczenia językowe.
Ujednolicono też kontrakt weryfikacji: przykłady builda, lintu, testów i
Chrome/runtime nie stanowią zgody na uruchomienie, a bramki użytkownika i
instrukcji projektu mają nad nimi pierwszeństwo.

## 1.12.0

Dodano obowiązkową bramkę konieczności przed discovery validatorów i checkerów. Nowy mechanizm sprawdzający musi wynikać z realnego kontraktu, a błędny stan musi być osiągalny przez publiczne API komponentu lub formularza; zabroniono tworzenia kodu i testów wyłącznie dla teoretycznych, nieosiągalnych przypadków.

## 1.11.0

Przeniesiono warunkowe playbooki [3.13]–[3.17] oraz historię zmian z głównego pliku do referencji ładowanych na żądanie. W głównym pliku pozostawiono routing, checklistę i twarde bramki.

## 1.10.0

Dodano obowiązkową migrację zauważonych polskich tekstów UI do istniejących grup kluczy tłumaczeń oraz nieblokujący handoff kluczy w projektach zarządzających tłumaczeniami przez UI.

## 1.9.0

Wprowadzono obowiązkowy kebab-case dla klas CSS i zakaz stylów inline w template'ach.

## 1.8.0

Dodano obowiązkowe discovery i ocenę reużywalności przed tworzeniem lokalnych validatorów, checkerów i podobnych mechanizmów sprawdzających.

## 1.7.1

Dodano zasadę unikania porównań do powtarzalnych stringów kontraktowych na rzecz enumów albo typowanych stałych.

## 1.7.0

Wzmocniono zasadę dla nowych komponentów: domyślnie muszą używać Angular Signals API dla kontraktu komponentu, query i lokalnego state'u.

## 1.6.2

Dodano zasadę diagnozy stanu komponentów UI opartych o biblioteki przed zmianą stylów selected/hover/disabled.

## 1.6.1

Doprecyzowano zakaz wydzielania jednorazowych helperów dla krótkich warunków i prostych mapowań wartości.

## 1.6.0

Dodano operacyjne triggery/antytriggery, priorytety konfliktów, generyczne odkrywanie wzorców repo, minimalną weryfikację, komunikaty dla brakujących tokenów i ujednolicono prompty agentów.

## 1.5.0

Dodano uogólniony kontrakt refaktoru UI bez regresji, zasady ograniczania override'ów Design System i reguły layoutu kolekcji/tabel.

## 1.4.0

Poprawiono opis triggerów, dodano referencje sekcji w checkliście, rozdzielono wielowarunkowe reguły na listy, dodano zakres skilla i instrukcję dla niejasnych wzorców.
