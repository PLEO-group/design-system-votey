# Mapa migracji nazw tokenów kolorów React

Status: szablon — do uzupełnienia w etapie 3 po zakończeniu mapowania Figmy i kontraktu kolorów  
Konsument: `votey-user-app`  
Cel: zbiorczy materiał decyzyjny dla zespołu React przed jakąkolwiek zmianą istniejącego publicznego API tokenów

## Zasady

- Dokument obejmie istniejące tokeny kolorów niespełniające zatwierdzonej konwencji 2A–2D.
- Sam wpis w tabeli nie zatwierdza rename ani aliasu.
- Do czasu jawnej decyzji zespołu React obecna nazwa pozostaje chronionym kontraktem legacy zgodnie z decyzją 2E.
- Każda zaakceptowana zmiana musi uwzględnić light/dark, użycia w `votey-user-app`, okres migracji, testy regresji i wpływ na SemVer.
- Nie tworzymy równoległego synonimu wyłącznie w celu estetycznego poprawienia nazwy.

## Mapa zmian

| Obecna ścieżka tokenu | Obecna nazwa CSS | Proponowana canonical identity | Proponowana nazwa CSS | Powód / naruszona reguła | Użycia w React | Light/dark | Strategia migracji | Decyzja React teamu | Status |
|---|---|---|---|---|---:|---|---|---|---|
| _do uzupełnienia_ |  |  |  |  |  |  |  |  |  |

## Podsumowanie do przekazania zespołowi React

Do uzupełnienia po wykonaniu pełnej inwentaryzacji:

- liczba nazw pozostających bez zmian;
- liczba proponowanych rename;
- liczba proponowanych usunięć lub konsolidacji;
- lista wymaganych aliasów przejściowych;
- rekomendowana wersja i kolejność migracji;
- wynik testów oraz regresji wizualnej `votey-user-app`.
