# Historia zmian

Wczytuj ten plik tylko przy audycie wersji, analizie regresji zachowania skilla albo przygotowaniu publikacji.

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
