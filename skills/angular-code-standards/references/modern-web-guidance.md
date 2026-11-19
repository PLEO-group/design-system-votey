# Pierwszeństwo standardów przy stosowaniu Modern Web Guidance

Jeśli Modern Web Guidance (MWG) jest dostępne w bieżącej sesji i dotyczy
zadania, przed wyborem implementacji sprawdź właściwy przewodnik i lokalne
zasady. Kolejność wczytania skilli nie ustala priorytetu decyzji.

Jeśli skill MWG jest niedostępny albo jego przewodnika nie da się pobrać,
kontynuuj według standardów Angulara i właściwego kontraktu DS. Instalacja MWG
nie jest warunkiem pracy. Gdy zadanie wymaga potwierdzenia zachowania API lub
wsparcia przeglądarek, sprawdź dokumentację tego API.

1. Uwzględnij jawne wymagania bieżącego zadania. Jeżeli wymaganie oznacza zmianę
   opublikowanego kontraktu lub wyjątek, wskaż konkretne zachowanie, które ulegnie
   zmianie, oraz miejsce tej zmiany.
2. Stosuj publiczne API i manifest właściwego design systemu w obszarach
   należących do paczki oraz standardy Angulara w kodzie aplikacji.
3. W ramach tych reguł używaj MWG do wyboru mechanizmów przeglądarkowych
   i sprawdzania dostępności, kompatybilności oraz fallbacków. Gdy zalecenie
   jest zgodne z lokalną regułą, zastosuj oba. Przy rozbieżności zastosuj
   standard lokalny. Jeśli przez to wymaganie zadania pozostaje niespełnione,
   wskaż konkretną decyzję, np. zmianę API komponentu DS lub zakres wyjątku.

## Znane przypadki

- **Motyw.** Stosuj [firmowy kontrakt Angulara](../../pleo-design-system/references/angular-grid-and-theming.md),
  jeśli obowiązuje w projekcie. Przewiduje start w trybie jasnym,
  `body[data-theme]`, `sessionStorage` i `loadTheme()`. Zmiana domyślnego
  motywu na systemowy, trwały zapis wyboru i inicjalizacja przed renderem
  wymagają jawnej decyzji o zmianie kontraktu.
- **Zmienne CSS.** Dla lokalnych wartości pomocniczych stosuj SCSS zgodnie
  z [§1.5 standardów Angulara](../SKILL.md#15-zmienne-pomocnicze-scss-przed-css).
  Gdy wymaganie zależy od odczytu wartości z kaskady w runtime, np. przez
  `@container style()`, zastosuj istniejący wyjątek z §1.5 i sprawdź potrzebę
  fallbacku dla wspieranych przeglądarek.
- **Modale i popovery.** Użyj pasującego publicznego komponentu DS. Z MWG
  weź kryteria weryfikacji nazwy dostępnej, fokusu i zamykania. Jeżeli API
  nie pozwala spełnić wymagania, wskaż brak w komponencie DS.
- **Responsywność.** Siatka i breakpointy strony wynikają z kontraktu DS.
  Container queries można stosować wewnątrz komponentu, którego układ zależy
  od szerokości kontenera, jeśli zachowuje to kontrakt siatki.
