# Migracja konsumenta Angular do Votey Design System

Wczytaj tę referencję, gdy istniejący widok Angular/CRM jest migrowany z
legacy komponentów, lokalnych popupów albo globalnych klas do publicznego API
`@pleodigital/design-system-votey`. Używaj jej razem z `angular.md` dla
konsumenta oraz z `angular-components.md` dla zmian w źródle paczki.

## Bramka kosztu i tryby pracy

Zacznij od trybu `light`. Wczytaj tylko plik celu, najbliższy przykład,
`package.json` konsumenta i właściwy publiczny entry point. Nie skanuj całego
repo, historii ani wszystkich SCSS bez sygnału z poniższej tabeli.

| Czynność | Wykonaj domyślnie | Zatrzymaj się i zapytaj użytkownika, gdy |
|---|---|---|
| baseline historyczny | Nie | użytkownik wskazuje datę/commit, regresję albo prosi o porównanie wersji |
| skan wycieków SCSS | Nie | widać konflikt stylów, różne wysokości kontrolek, globalny selector albo użytkownik prosi o audyt |
| pełna migracja API | Tylko pliki celu i publiczne deklaracje | trzeba przeglądać wiele konsumentów lub kilka frameworków |
| build `dist` / `npm pack` | Nie | zmieniono źródło paczki albo konsument korzysta z lokalnego artefaktu |
| testy jednostkowe | Najbliższy test po zmianie logiki, jeśli jest wymagany i użytkownik zezwolił | pełna suita, testy E2E albo dodatkowe scenariusze |
| Storybook / przeglądarka | Walidacja wymagana przez projekt po implementacji | analiza bez edycji albo opcjonalny dodatkowy smoke test |

Przed kosztownym krokiem napisz jedno krótkie pytanie z zakresem, np.:
„Widzę możliwy wyciek stylu. Czy mam przeskanować cały feature, czy tylko ten
komponent?”. Jeśli użytkownik nie odpowie, pozostań w trybie `light` i jawnie
oznacz pominięty audyt.

### Hierarchia walidacji

Tryb `light` ogranicza eksplorację i dodatkowe audyty; nie znosi obowiązków
projektu. Jeżeli `angular.md`, `AGENTS.md` albo jawne polecenie użytkownika
wymaga konkretnej walidacji, ta walidacja ma pierwszeństwo po zmianie kodu.

- Przy samym review, analizie historycznej albo diagnozie bez edycji kodu nie
  uruchamiaj builda ani runtime tylko dlatego, że projekt je opisuje. Podaj je
  jako niepotrzebne dla tego zakresu albo jako następny krok.
- Przy implementacji zmiany w konsumencie wykonaj wymagane przez projekt
  minimum, np. `npm run build:dev` i sprawdzenie docelowej trasy. Jeśli wymaga
  to dodatkowej zgody, zadaj jedno zbiorcze pytanie przed uruchomieniem komend;
  po odmowie oznacz walidację jako oczekującą, nie jako wykonaną.
- Opcjonalne rozszerzenia, takie jak pełny skan SCSS, macierz viewportów, pełna
  suita testów i Storybook, nadal wymagają osobnej bramki tylko wtedy, gdy nie
  wynikają z obowiązkowego kontraktu projektu albo zakresu użytkownika.
- Nie używaj trybu `light` jako uzasadnienia do pominięcia wymaganej walidacji i
  nie uruchamiaj kosztownego runtime przy zadaniu, które było wyłącznie analizą.

## 1. Ustal baseline i zakres

Jeśli bramka historyczna jest aktywna, znajdź konkretny commit lub rewizję i
porównaj tylko `.ts`, `.html`, `.scss` oraz `.spec.ts` celu. Oddziel zmiany
domenowe od prezentacyjnych, integracyjnych i tłumaczeń. Nie traktuj kodu
historycznego jako specyfikacji bez sprawdzenia aktualnego API, formularza i testów.

Przed właściwą migracją zapisz skrócony kontrakt: dane, outputy, payloady, state
otwarcia/zaznaczenia/edycji/resetu/zapisu, walidację, `data-cy`, ARIA i klawiaturę.

## 2. Zmapuj legacy API na publiczne API Votey

Przed zamianą tagów przygotuj tabelę:

| Legacy | Publiczne API Votey | Co trzeba zachować |
|---|---|---|
| kontrolka formularzowa | `vt-input`, `vt-select` lub właściwy komponent DS | `control`, label, required, disabled, touched, error, reset |
| ręczny popup/lista checkboxów | publiczny komponent overlayu lub lokalny wrapper | lista, selected IDs, confirm, dismiss, outside click, Escape |
| klikalna ikona | `vt-button` z właściwym wariantem | tooltip, focus, keyboard, disabled, payload akcji |
| lokalny styl kontrolki | tokeny i API komponentu DS | brak globalnego override'u |

Nie kopiuj HTML, SVG ani stylów komponentu DS do konsumenta. Jeśli publiczne API
nie pokrywa roli, oznacz gap i dopiero wtedy rozważ lokalny wrapper.

## 3. Zachowaj model domenowy po stronie konsumenta

Konsument buduje view model i mapuje model domenowy na mały, typowany model DS,
np. `{ id, label, disabled }`. Komponent DS nie może znać `Member`, grup,
endpointów ani kluczy tłumaczeń CRM.

Po evencie z DS konsument powinien odtworzyć model domenowy, zachowując:

- filtrowanie nieprawidłowych identyfikatorów,
- deduplikację,
- walidację przed mutacją,
- istniejące powiadomienia i payloady,
- reset lokalnego draftu po sukcesie.

Używaj jawnych type guardów. `Boolean(value)` nie jest kontraktem zawężającym
typ `string | undefined`.

## 4. Formularze po migracji

Po wymianie kontrolki sprawdź osobno:

- dynamiczne validatory `required`,
- `updateValueAndValidity`,
- `disabled` i ponowne włączanie pól,
- `touched`, błędy i komunikaty,
- reset oraz wartość domyślną,
- tryb dodawania i edycji,
- zależności między polami, np. „email albo telefon”.

Nie zakładaj, że binding `[required]` w legacy komponencie ma ten sam efekt w
komponencie DS. Logikę walidacji trzymaj w typed formie i pokryj testem zachowania.

## 5. Audyt stylów konsumenta — tylko po aktywacji bramki

Nie uruchamiaj szerokiego skanu domyślnie. Aktywuj go tylko po sygnale konfliktu
stylów, prośbie użytkownika albo gdy migracja dotyka globalnego arkusza. Zacznij
od zmienionego komponentu i jego importów; rozszerz zakres dopiero po findingu.
Sprawdź:

- globalne selektory `label`, `.input`, `.select` i podobne wycieki,
- nieużywane klasy legacy i importy bibliotek,
- utility classes mieszające layout z odpowiedzialnością komponentu,
- zagnieżdżenie SCSS zgodne z HTML,
- selektory z `&` po kompilacji,
- magiczne szerokości, `transform` użyty jako korekta geometrii oraz brak
  breakpointów dla układu formularza/listy.

Spacing, typografię, kolory i radius mapuj na publiczne tokeny Votey. Nie twórz
lokalnego tokenu tylko dla jednego ekranu; brakującą rolę zgłoś jako gap.

## 6. Overlay i stany interakcji

Dla menu, popovera i listy wielokrotnego wyboru sprawdź kontrakt całego triggera:

- ikona i tekst zmieniają się zgodnie ze stanem otwarcia,
- cały trigger jest klikalny i ma poprawne `aria-expanded`/`aria-haspopup`,
- outside click i Escape zamykają panel,
- panel nie przechwytuje przypadkowo eventów konsumenta,
- stan pusty, disabled, selected i error jest jawny,
- akcje panelu są dostępne bez niezamierzonego scrolla.

Stan komponentu powinien być własnością DS; konsument przechowuje wyłącznie
stan domenowy i wynik akcji.

## 7. Świeżość paczki i artefaktów — tylko gdy zmieniono źródło DS

Nie buduj paczki tylko dlatego, że analizujesz konsumenta. Aktywuj tę bramkę,
gdy zmieniono źródło `design-system-votey`, wersję zależności albo lokalny
tarball. Po zmianie źródła DS wykonaj kontrolowany przepływ, a następnie
uruchom obowiązkową walidację konsumenta określoną w `angular.md`:

1. zbuduj bibliotekę z `angular/`,
2. potwierdź zmianę w `dist`,
3. utwórz paczkę przez `npm pack`,
4. zaktualizuj lokalnego konsumenta tylko w uzgodnionym zakresie,
5. sprawdź, że tarball zawiera aktualny template i kod komponentu.

Nie edytuj ręcznie `dist`. Nie deklaruj gotowości, jeśli konsument nadal używa
starego tarballa albo deep importu. Jeśli build lub test nie został uruchomiony,
podaj to jawnie wraz z residual risk.

## 8. Testy i dokumentacja — proporcjonalnie do zmiany

Po zmianie logiki konsumenta zaktualizuj jego najbliższy spec. Uruchom wymagany
przez projekt zakres testów po uzyskaniu zgody; nie rozszerzaj go automatycznie do
pełnej suity. Testuj kontrakt:

- mapowanie danych do modelu DS,
- wynik eventu i zachowanie payloadu,
- walidację i reset formularza,
- duplikaty i pustą kolekcję,
- przejście open/close oraz akcje overlayu.

W źródle DS dodaj lub aktualizuj Storybook Playground tylko wtedy, gdy zmienia
się publiczny komponent, wariant albo interakcja. Screenshot stanu początkowego
nie zastępuje testu outside click, Escape, klawiatury i zmiany wartości; te testy
uruchamiaj po jawnej decyzji o walidacji runtime.
