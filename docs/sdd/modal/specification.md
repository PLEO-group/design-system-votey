# WERSJA 1.0.1
# AUTOR n.koktysz@pleodigital.com

# Spec Driven Specification: Modal Votey — stan obecny

## 1. Metadane

- Data: 2026-11-02, Europe/Warsaw.
- Status: Draft — opis obecnej implementacji, do review.
- Powiązane zgłoszenia: nie wskazano; brak uruchomionego workflow review i prespecki powiązanej z Jirą.
- Feature slug: `modal`.
- Typ dokumentu: `specification`.
- Tryb pracy: `create`; profil wejściowy `LEGACY`, zakres dokumentu: stan obecny, bez projektowania zmian.
- Workspace: `SINGLE_REPO`, repozytorium kanoniczne `PLEO-group/design-system-votey`.
- Wersja analizowanej paczki: lokalne `package.json` — `1.1.0-rc.0`. Nie potwierdza to publikacji npm ani wersji produkcyjnej konsumenta.
- Środowiska objęte opisem: źródła i wygenerowany eksport Angular, testy DOM oraz Storybook lokalnego repo.
- Zakres feature: `FE`, publiczny kontrakt modalowy paczki.
- Zakres stacku: FE — Angular 21, CDK Dialog, RxJS 7; BE — nie dotyczy.
- Źródło wyglądu: obecne komponenty/tokeny Votey i przyjęta baza wizualna CRM. Brak dedykowanej makiety modala; dokument nie deklaruje zgodności pixel-perfect z Figmą.

## 2. Opis Feature

### 2.1 Opis Biznesowy

Modal to wycentrowane okno nad stroną, używane do potwierdzenia decyzji, formularza albo podglądu informacji. Użytkownik widzi wspólny nagłówek, treść i skonfigurowane akcje, a strona pod oknem nie przejmuje interakcji. Typowy dialog oferuje potwierdzenie i anulowanie, opcjonalnie trzecią decyzję.

Potwierdzenie nie oznacza automatycznie sukcesu ani zamknięcia: o rezultacie decyduje funkcjonalność korzystająca z okna. Podczas oczekiwania na operację wspólne akcje i zwykłe sposoby zamknięcia są blokowane. Błąd może pozostawić formularz otwarty z danymi i możliwością ponowienia; aplikacja odpowiada za użyteczny komunikat i obsługę retry.

Złożony formularz może mieć własną belkę przycisków w treści. Wspólny modal nie rozstrzyga, czy wolno usunąć konto, zmienić abonament lub uruchomić wydarzenie. Reguły, uprawnienia i skutki tych decyzji należą do aplikacji.

### 2.2 Opis Techniczny

Jeden `VoteyModalComponent` (`vt-modal`) zawiera ramę, wiadomość, dynamiczny komponent lub szablon, stopkę i stan zamykania. `VoteyModalService` otwiera CDK Dialog, rejestruje instancje i obsługuje tło, klawiaturę oraz zmianę URL. `VoteyModalRef<TResult>` jest uchwytem do zamykania, aktualizacji akcji i obserwacji wyniku, bez równoległego stanu formularza.

Publiczny import: `@pleodigital/design-system-votey/angular`. Modal nie importuje CRM, nie wykonuje HTTP i nie utrwala danych. Callback akcji przyjmuje `void | Observable<unknown> | Promise<unknown>`. Observable jest subskrybowany przez modal bez konwersji na Promise.

## 3. Zakres

### 3.1 Zakres Biznesowy

1. Potwierdzenia tekstowe, formularze i podglądy w tej samej wycentrowanej ramie.
2. Tytuł, opcjonalny opis i wiadomość oraz własna treść.
3. Potwierdzenie, anulowanie i trzecia decyzja. Brak etykiety ukrywa przycisk; brak obsługi potwierdzenia uniemożliwia jego wykonanie.
4. Potwierdzenie i trzecia decyzja pozostawiają okno do jawnego zamknięcia. Anulowanie bez własnej obsługi zamyka okno; z własną obsługą przekazuje jej odpowiedzialność.
5. Krzyżyk, Escape, tło i zmiana adresu mogą żądać zamknięcia. Ich dostępność podlega konfiguracji, oczekiwaniu i dodatkowej kontroli zamknięcia dostarczonej przez aplikację.
6. Widoczny postęp standardowej stopki i blokada powtarzania akcji. Koniec oczekiwania sam nie oznacza zaakceptowania decyzji.
7. Własna belka dla złożonego układu; jej autor zapewnia obsługę oczekiwania i swoich kontrolek.
8. Trzy rozmiary i wspólna szerokość mobilna. Długa treść przewija się niezależnie od standardowego nagłówka i stopki.
9. Obsługa klawiatury, przejęcie i przywrócenie fokusu przez warstwę dialogową.
10. Kilka niezależnych instancji; identyfikator pozwala odnaleźć okno i zapobiec powtórnemu otwarciu tej samej instancji.

### 3.2 Zakres Techniczny

- Źródła `angular/src/lib/modal/` i eksporty `angular/src/public-api.ts`.
- Generyczne dane/wynik, DI przez `VOTEY_MODAL_DATA` i `VoteyModalRef`, kontekst `TemplateRef`.
- CDK Dialog: overlay, fokus, izolacja tła, blokada scrolla i teardown.
- Sygnały busy/closing/disabled, callbacki RxJS/Promise, close guard i cleanup.
- Translator Votey, komponenty przycisku/tekstu DS, selektory testów.
- Testy DOM, artefakt Angular i podgląd Storybook `ANGULAR COMPONENTS/Modal`.

### 3.3 Poza Zakresem

- Popovery, menu i panele przy przycisku, niezależnie od historycznej nazwy „modal”.
- Reguły domenowe, endpointy, autoryzacja, walidatory, częściowy sukces i retry mutacji CRM.
- Globalny loader, regiony pierwszego pobrania i kopiowanie `LocalLoadingState` do paczki.
- Osobny host, confirmation component, dyrektywa akcji i osobny `TemplateRef` stopki — nie stanowią obecnego API.
- Modal React, nowa makieta, zmiany runtime'u/tokenów i migracje dalszych ekranów CRM.
- `owner: DestroyRef`, automatyczne close po complete, `closeAll` i automatyczne ustawianie inputów dynamicznej treści — nie są zaimplementowane.

## 4. Stan Obecny i Źródła Dowodów

`confirm` deleguje do `open` z treścią `null`. Obsługa Observable/Promise znajduje się w źródłach i wygenerowanym eksporcie Angular. Dokument utrwala ten kontrakt bez jego rozszerzania.

| Źródło względem repo | Potwierdzany zakres |
| --- | --- |
| `angular/src/lib/modal/modal.model.ts` | Rozmiary, wynik i powody zamknięcia |
| `angular/src/lib/modal/modal-actions.model.ts` | Konfiguracja akcji i typ callbacka |
| `angular/src/lib/modal/modal-config.model.ts` | Konfiguracja dialogu |
| `angular/src/lib/modal/modal-content.model.ts` | Token danych i kontekst treści |
| `angular/src/lib/modal/modal-controller.model.ts` | Wewnętrzny kontrakt kontrolera, poza publicznym entry pointem |
| `angular/src/lib/modal/votey-modal.service.ts` | Otwarcie, DI, rejestr, CDK, listenery i cleanup instancji |
| `angular/src/lib/modal/votey-modal.component.ts` | Stan, akcje, close guard i cleanup subskrypcji |
| `angular/src/lib/modal/votey-modal.component.html` i `.scss` | Struktura, akcje, ARIA, selektory, rozmiary i przewijanie |
| `angular/src/lib/modal/votey-modal-ref.ts` | Uchwyt i wynik dla późnych subskrybentów |
| `angular/src/public-api.ts`, `package.json`, `dist/angular/types/pleodigital-design-system-votey-angular.d.ts` | Publiczny eksport i dystrybucja |
| `tests/modal-dom.test.js`, `tests/helpers/angular-dom.mjs` | Wykonywalne testy integracyjne DOM |
| `storybook/stories/angular/Modal.stories.jsx` | Potwierdzenie, formularz, błąd, długa treść i własna belka |
| `docs/modal.md`, `skills/votey-design-system/references/angular-modal.md` | Pomocniczy wzorzec użycia; implementacja rozstrzyga rozbieżności |

Wcześniejsze etapy tego zadania zakończyły się 23/23 zaliczonymi testami DOM DS, buildem Angular i Storybooka oraz smoke testem Observable w osobnym Chrome. Podczas samego authoringu nie uruchamiano ich ponownie. Nie jest to certyfikacja dostępności ani wszystkich zastosowań CRM.

## 5. Zaimplementowane Rozwiązanie

### HLD i odpowiedzialności

Konsument wywołuje serwis → serwis sprawdza ID i otwiera CDK Dialog → rama renderuje konfigurację i treść → użytkownik wybiera akcję → rama wykonuje callback i śledzi oczekiwanie → funkcjonalność jawnie żąda close → rama sprawdza blokady i guard → CDK usuwa okno → serwis usuwa rejestr/listenery i publikuje wynik.

Ref deleguje do kontrolera komponentu. Rejestr jest lokalny dla instancji serwisu, bez synchronizacji między kartami i persystencji między sesjami.

### 5.1 Backend

N/A. Modal nie definiuje REST, statusów HTTP, transakcji, migracji, eventów BE ani persystencji. Requesty callbacków i ich idempotencja należą do konsumenta.

### 5.2 Frontend

- `open` przyjmuje klasę komponentu, `TemplateRef` albo `null`. Wiadomość może współistnieć z treścią. Brak treści nie uruchamia automatycznego empty state.
- Komponent treści otrzymuje dane i ref przez DI. Serwis nie ustawia jego `input()`/`@Input`.
- Szablon otrzymuje `$implicit = config.data` i `modal = ref`, zachowując kontekst wiązań właściciela.
- Pierwszy odczyt, uprawnienia, walidacja, komunikaty i retry są implementowane w treści/konsumencie. DS nie ma ogólnego panelu błędu.
- `updateActions` płytko scala akcje. Nie zmienia tytułu, rozmiaru, treści, danych, ID ani polityki close.
- `hideModalActions: true` usuwa całą standardową stopkę, również jej spinner i status. Autor własnej belki zapewnia ich odpowiedniki.
- Busy nie wyłącza automatycznie pól formularza w treści.

### 5.3 Design i responsywność

| Wariant/element | Założenie potwierdzone w kodzie |
| --- | --- |
| `small` | `40vw` |
| `standard` lub pominięty rozmiar | `55vw` |
| `wide` | `75vw` |
| Viewport do 768 px włącznie | Wszystkie rozmiary `92vw` |
| Limit overlayu | `maxWidth: 92vw` |
| Maksymalna wysokość ramy | `calc(100dvh - 48px)` |
| Treść | `overflow: auto`, `overscroll-behavior: contain`, łamanie długich wyrazów |
| Nagłówek/stopka | Nie kurczą się; akcje mogą się zawijać |
| Tokeny | Istniejące CSS variables kolorów, odstępów i promieni Votey |
| Postęp | Spinner i opcjonalny tekst; reduced-motion wyłącza animację |

Responsywność wynika z viewport/media query, bez detekcji urządzenia. W stylach pozostają literalne wartości m.in. obramowania, spinnera i cienia; szerokości wariantów są oparte na `vw`.

## 6. Aktualne Zachowanie

### 6.1 Akcje

- Confirm wymaga niepustego `confirmText`. Jest disabled przy blokadzie, braku `onConfirm` lub prawdziwym `confirmDisabled`.
- Cancel wymaga niepustego `cancelText`. Bez handlera zamyka z `{reason: "cancel", value: undefined}`; własny handler przejmuje odpowiedzialność.
- Trzecia akcja wymaga tekstu i callbacka. Nie ma własnego wariantu ani odrębnego disabled; używa `secondary` i wspólnej blokady.
- Kolejność stopki: postęp, trzecia akcja, cancel, confirm. Domyślny wariant confirm to `primary`, pozostałych akcji `secondary`.
- Bez żadnej widocznej akcji stopka nie jest renderowana, także podczas busy. Samo `busyText` nie tworzy stopki.
- Krzyżyk, tło, Escape i nawigacja nie wywołują `onCancel`.
- Wartość callbacka, emisja i complete nie stają się automatycznie wynikiem `closed`. Confirm i trzecia akcja nie wykonują automatycznego close.

### 6.2 Oczekiwanie, błędy i retry

1. Callback jest wywoływany raz dla dopuszczonej akcji z ref bieżącego modala; blokada chroni także przed rekurencyjnym wykonaniem.
2. `void` nie tworzy automatycznego oczekiwania. Istniejący zapis z własną subskrypcją używa sygnału `busy` lub `setBusy`.
3. Observable jest subskrybowany raz; busy trwa do complete/error lub zniszczenia, również po emisjach wartości. Cleanup korzysta z `takeUntilDestroyed`.
4. Promise jest obserwowane przez RxJS `from`. Koniec subskrypcji nie anuluje operacji Promise.
5. Wyjątek lub nieprzechwycony błąd akcji trafia do Angular `ErrorHandler`; blokada oczekiwania znika. DS nie zamyka sam okna ani nie pokazuje błędu biznesowego.
6. Konsument obsługuje oczekiwany błąd, np. `catchError` → `EMPTY`, i ponowienie. Brak automatycznego retry i timeoutu. Strumień bez complete/error może utrzymywać busy bezterminowo.
7. `busy = requestBusy || callbackPending`; `requestBusy` pochodzi z sygnału konfiguracji, a bez niego z manualnego stanu. `setBusy` przy związanym sygnale rzuca błąd.
8. Własny busy trzeba zwolnić przed close. `finalize` nie dowodzi sukcesu i nie jest podstawą bezwarunkowego zamknięcia. Close niszczy subskrypcję akcji; wymagane operatory po close mogą się nie wykonać. Wynik może obsłużyć rodzic przez `closed`.

### 6.3 Zamykanie

- `close(value?, reason = "action")` zwraca `Promise<boolean>`. `true` oznacza przyjęte zamknięcie, nie sukces domenowy. `false` oznacza blokadę/odmowę, zakończony dialog lub błąd guarda.
- Źródłowy busy blokuje każdą zwykłą próbę close. Podczas callbackPending dopuszczone są jawne powody `action` i `cancel`; powody dismiss są blokowane. Pozwala to zakończyć okno z callbacka po sukcesie.
- Przy busy lub closing wspólne przyciski są zablokowane. Programowe close z powodem cancel nie wywołuje `onCancel`.
- `beforeClose` otrzymuje proponowane `{value,reason}` i zwraca boolean lub Promise boolean; nie obsługuje Observable. Odmowa zostawia okno. Wyjątek/odrzucenie trafia do `ErrorHandler` i również nie zamyka okna.
- Podczas guarda kolejne close zwraca false. Po guardzie rama ponownie sprawdza zniszczenie i źródłowy busy. Guard nie jest rollbackiem ani gwarancją aktualności kontekstu domenowego.
- Po akceptacji CDK zamyka dialog. Serwis usuwa listenery i wpis rejestru przed wynikiem `closed`, umożliwiając ponowne otwarcie tego samego ID w handlerze wyniku.
- Wymuszony teardown omija guard/blokady. Bez zaakceptowanego wyniku emituje `{value: undefined, reason: "navigation"}`. Ten powód sam nie dowodzi kliknięcia linku.
- `closeOnNavigation` obserwuje zmianę URL przez `Location`, jeśli dostępne. Nie jest router guardem, nie cofa nawigacji i może nie zamknąć zajętego okna. Ochrona niezapisanej strony należy do konsumenta.

### 6.4 Macierz lifecycle

| Stan wejściowy | Trigger/blokada | Stan i wynik | Retry, skutki, czas |
| --- | --- | --- | --- |
| Brak instancji | `open`, wolne ID | Otwarte, wpis rejestru | Brak persystencji |
| Otwarte ID | Drugie jawne ID | Wyjątek, pierwsze okno bez zmian | Można użyć `getById` |
| Gotowe | Akcja void | Otwarte, chyba że callback zamknie | Bez automatycznego busy |
| Gotowe | Akcja Observable/Promise | Busy | Akcje i dismiss zablokowane, brak deadline |
| Busy callbacka | Emisja wartości | Nadal busy | Brak automatycznego sukcesu |
| Busy callbacka | Complete/rozstrzygnięcie | Gotowe, jeśli nadal otwarte | Brak auto-close/retry |
| Busy callbacka | Błąd | Gotowe, jeśli nadal otwarte | `ErrorHandler`, komunikat biznesowy u konsumenta |
| Źródłowy busy | Zwykłe close | No-op, false | Zwolnić stan przed ponowieniem |
| Busy callbacka | Jawne close action/cancel, brak źródłowego busy | Kontrola close | Dismiss innymi powodami blokowany |
| Otwarte, nieblokowane | Dopuszczone close | Closing, guard | Drugie close false, brak timeoutu |
| Closing | Odmowa/błąd lub busy po guardzie | Otwarte, close false | Można ponowić po usunięciu przyczyny |
| Closing | Akceptacja, brak blokady | Zniszczone, wynik closed | Cleanup przed wynikiem, ID ponownie dostępne |
| Otwarte/busy/closing | Wymuszony teardown | Koniec subskrypcji i wynik końcowy | Bez rollbacku BE; fallback powodu navigation |
| Zakończone | Kolejny close | No-op, false | Closed odtwarza wynik i jest zakończony |

Transakcje, historia trwała, eventy domenowe, UTC/DST i deadlock bazy: N/A dla DS. Jedynym zdarzeniem wyniku jest lokalny strumień `closed`. Przerwanie subskrypcji nie cofa mutacji wykonanej już przez backend callbacka.

## 7. Kryteria Akceptacji Stanu Obecnego

| ID | Given / When / Then | Dowód / weryfikacja |
| --- | --- | --- |
| AC-01 | Given confirm, when otwarto dialog, then renderowana jest wspólna rama, tytuł i wiadomość. | Test `confirmation uses the common frame...` |
| AC-02 | Given confirm bez close, when callback się wykona, then okno zostaje; domyślny cancel zamyka z powodem cancel. | Test `confirm stays open...` |
| AC-03 | Given własny cancel, when wybrano cancel, then działa handler; dismiss nie wywołuje handlera. | Test `custom cancel takes ownership...` |
| AC-04 | Given tekst i handler trzeciej akcji, when ją wybrano, then może zwrócić odrębną decyzję przez close. | Test `optional third action...` |
| AC-05 | Given Observable akcji, when emituje wartości bez zakończenia, then istnieje jedna subskrypcja i busy do końca, bez kolejnych kliknięć/dismiss. | Trzy testy parametryzowane `onConfirm/onCancel/onThirdAction subscribes once...` |
| AC-06 | Given błąd Observable, when nie przechwyci go konsument, then `ErrorHandler` otrzymuje błąd, busy znika, retry jest możliwe. | Test `Observable failure reports once...` |
| AC-07 | Given akcja Observable, when dialog jest niszczony, then subskrypcja jest anulowana, teardown wykonuje się raz. | Test `destroying the dialog cancels...` i synchronicznego sukcesu |
| AC-08 | Given Promise, when oczekuje/odrzuca się, then modal blokuje akcje/odblokowuje retry, a jawne close po sukcesie działa. | Dwa testy Promise |
| AC-09 | Given sygnały busy/disabled, when zmieniają wartości, then UI reaguje, a `setBusy` nie nadpisuje związanego stanu. | Test `existing request and form signals...` |
| AC-10 | Given hideModalActions, when renderowany jest dialog, then brak standardowej stopki, własna treść może zamknąć okno. | Test `hideModalActions removes...` |
| AC-11 | Given TemplateRef, when zmienia się sygnał rodzica, then treść reaguje i ma dane oraz kontekst close. | Test `template content keeps...` |
| AC-12 | Given zajęte jawne ID, when otwarto je ponownie, then jest wyjątek; zamknięcie jednego okna nie usuwa innego. | Test `duplicate IDs fail explicitly...` |
| AC-13 | Given wynik closed, when handler otwiera ponownie to samo ID, then rejestr dopuszcza nową instancję. | Test `a result handler can immediately reopen...` |
| AC-14 | Given polityki Escape/tła, when użytkownik je wywołuje, then flagi i busy są przestrzegane. | Test `backdrop and Escape have independent policies...` |
| AC-15 | Given oczekujący guard, when nastąpi kolejne close, then jest odrzucone; odmowa guarda pozwala ponowić. | Test `async close guard prevents concurrent attempts...` |
| AC-16 | Given wyjątek guarda, when wywołano close, then wynik false, błąd do ErrorHandler i dialog nadal używalny. | Test `a failed close guard reports...` |
| AC-17 | Given listener URL, when żąda close, then obowiązuje kontrola close, a listener jest sprzątany. | Test `navigation requests use the close guard...` |
| AC-18 | Given selektory akcji, when są ustawione/aktualizowane, then trafiają na właściwe hosty przycisków. | Test `action selectors are preserved...` |
| AC-19 | Given callback sprawdzający busy przed startem, when jest wywoływany, then sam moment wywołania nie ustawia callbackPending blokującego jego start. | Test `a callback can check ref.busy...` |
| AC-20 | Given rozmiar i viewport, when renderowany jest modal, then obowiązują 40/55/75vw lub 92vw do 768 px. | SCSS; pomiar manualny |
| AC-21 | Given długa treść, when jest przewijana, then przewija się body, a nagłówek/stopka pozostają dostępne w granicach wysokości. | SCSS/Storybook; manualnie także niski viewport |
| AC-22 | Given przycisk otwierający, when dialog jest obsługiwany klawiaturą/zamykany, then CDK zarządza fokusem i jego przywróceniem. | CDK i wcześniejszy smoke test powrotu fokusu; pełna macierz a11y do wykonania |
| AC-23 | Given brak etykiet/handlerów, when renderowana jest stopka, then widoczność i disabled odpowiadają 6.1. | Template/computed; pełna macierz manualna |
| AC-24 | Given zakończony modal, when dołącza późny subskrybent, then otrzymuje jeden wynik i complete. | ReplaySubject(1) i istniejące testy subskrypcji po close |

Kryteria opisują obecny kontrakt. Dowód nie oznacza automatycznego pokrycia każdego wariantu ani ponownego wykonania testu w authoringu.

## 8. Rozszerzenia Stackowe i Kontrakty Angular

### 8.1 Publiczne operacje

| Operacja | Kontrakt |
| --- | --- |
| Otwarcie | `open<TData=unknown,TResult=unknown>(Type<unknown> \| TemplateRef<VoteyModalTemplateContext<TData,TResult>> \| null, VoteyModalConfig<TData,TResult>): VoteyModalRef<TResult>` |
| Potwierdzenie | `confirm<TResult=boolean>(VoteyModalConfig<unknown,TResult>): VoteyModalRef<TResult>`; nie ustawia automatycznie wyniku true |
| Odczyt instancji | `getById(id: string): VoteyModalRef<unknown> \| undefined` |
| Zamknięcie | `ref.close(value?: TResult, reason?: VoteyModalCloseReason): Promise<boolean>` |
| Wynik | `ref.closed: Observable<VoteyModalResult<TResult>>`, jeden wynik odtwarzany późnym subskrybentom i complete |
| Stan | `ref.busy`, `ref.closing`: sygnały boolean do odczytu |
| Stan manualny | `ref.setBusy(boolean): void`, bez związanego sygnału busy |
| Akcje | `ref.updateActions(Partial<VoteyModalActions<TResult>>): void`, płytkie scalenie |

`connect`/`finish` i kontroler ramy są mechanizmem wewnętrznym, nie wzorcem użycia aplikacyjnego. `ModalData` przenosi konfigurację do ramy, nie jest domenowym API konsumenta.

### 8.2 Konfiguracja otwarcia

| Pole | Typ i domyślne zachowanie |
| --- | --- |
| `title` | Wymagany string; brak runtime walidacji niepustości |
| `description`, `message` | Opcjonalne stringi; pominięte nie renderują tekstu |
| `data` | Opcjonalne TData; domenowy shape i walidacja u konsumenta |
| `size` | small / standard / wide; pominięte standard |
| `id` | Opcjonalny string, bez niego ID tworzy CDK |
| `dataCy` | Opcjonalny string: rama i pochodne `-title`, `-content`, `-footer` |
| `showCloseButton` | Opcjonalny boolean, domyślnie true |
| `closeLabel` | Opcjonalny string, fallback `BUTTON.CLOSE` |
| `closeOnBackdrop`, `closeOnEscape`, `closeOnNavigation` | Opcjonalne boolean, każde domyślnie true |
| `autoFocus` | dialog / first-tabbable / first-heading; domyślnie first-heading |
| `restoreFocus` | Opcjonalny boolean, domyślnie true |
| `injector`, `viewContainerRef` | Opcjonalne konteksty Angular DI/CDK |
| `beforeClose` | `(result: VoteyModalResult<TResult>) => boolean \| Promise<boolean>`; brak = brak dodatkowego weta |

### 8.3 Konfiguracja akcji

| Pole | Typ i zachowanie |
| --- | --- |
| `confirmText`, `cancelText`, `thirdActionText` | Opcjonalne stringi; brak/empty ukrywa akcję zgodnie z 6.1; bez domyślnych etykiet |
| `onConfirm`, `onCancel`, `onThirdAction` | `(modal: VoteyModalRef<TResult>) => void \| Observable<unknown> \| Promise<unknown>` |
| `confirmVariant` | VoteyButtonVariant, domyślnie primary; m.in. danger dla destrukcyjnego potwierdzenia |
| `confirmDisabled` | Opcjonalne `boolean \| Signal<boolean>`, pominięte false; nie zastępuje wspólnej blokady |
| `busy` | Opcjonalny Signal<boolean>, stan właściciela requestu |
| `busyText` | Opcjonalny string, domyślnie pusty; standardowa stopka przy busy pokazuje spinner także bez tekstu |
| `hideModalActions` | Opcjonalny boolean, domyślnie false; ukrywa całą standardową stopkę |
| `confirmDataCy`, `cancelDataCy`, `thirdActionDataCy` | Opcjonalne stringi na hostach vt-button, nie na ich natywnych button |

Typy i opcjonalność są kontraktem TypeScript. DS nie definiuje walidatora JSON, nie odrzuca dodatkowych pól runtime i nie mapuje błędnych typów na statusy HTTP. Nullowalność wynika z typów/generyków; jawne null jest obsługiwane dla treści. Brak pola oznacza undefined. Dane domenowe z DI nie są przez to automatycznie zwalidowane.

### 8.4 Wynik, dane, błędy i integracja

`VoteyModalResult<TResult>` zawiera readonly `reason` i `value: TResult | undefined`. Powody: action, cancel, close-button, backdrop, escape, navigation. Undefined nie oznacza akceptacji. Publiczne listy wartości: `VoteyModalSizes`, `VoteyModalCloseReasons`.

`VoteyModalTemplateContext<TData,TResult>` zawiera `$implicit: TData | undefined` i `modal: VoteyModalRef<TResult>`. `VOTEY_MODAL_DATA` jest `InjectionToken<unknown>`; konsument podaje właściwy typ odczytu.

Duplikat ID i konflikt manualnego busy ze związanym stanem są wyjątkami programistycznymi. Błędy akcji/guarda trafiają do ErrorHandler. Nie ma kodów błędu domenowego, requestów HTTP, cache odpowiedzi API, routingu, resolverów ani uprawnień własnych modala. Body zachowuje stan Angular swojej treści, dopóki instancja nie zostanie zniszczona.

### 8.5 Dostępność i i18n

- Dialog i fokus zapewnia CDK; serwis ustawia ariaLabel z tłumaczenia title, a treść ma nagłówek h3 z typografią h3. Nie wymusza aria-modal=true, zachowując zachowanie CDK dla zagnieżdżonych overlayów.
- Outline fokusu jest wyłączony na kontenerze CDK, hoście ramy i nagłówku. Override kontenera jest ograniczony do `votey-modal-overlay`, ponieważ kontener jest przodkiem treści. Fokus i jego wskaźniki na kontrolkach nie są tym nadpisaniem wyłączane.
- Rama ma aria-busy od busy; sam close guard nie ustawia go na true, choć blokuje akcje.
- Standardowa stopka ma role=status i spinner aria-hidden. Przy własnej belce komunikat oczekiwania należy do treści.
- Teksty korzystają z translatora Votey; DS nie ma słowników domenowych. Krzyżyk ma etykietę z closeLabel lub BUTTON.CLOSE.
- Tytuł, opis i wiadomość są renderowane przez tekstowy `VoteyTextComponent` z interpolacją Angular, bez interpretowania HTML. Dowolny markup i jego bezpieczne wyświetlanie należą do własnej treści konsumenta.
- Widoczne teksty używają pipe; nazwa dostępna kontenera jest obliczana przy otwarciu. Kod nie aktualizuje jej jawnie po zmianie języka już otwartego dialogu.
- Etykiety pól, błędy i powiązania a11y formularza pozostają odpowiedzialnością konsumenta. Modal nie waliduje Reactive Forms.

## 9. Wpływ na Inne Specyfikacje

- Główna specyfikacja: `docs/sdd/modal/specification.md`.
- `affectedSpecifications: []` — opis własnego istniejącego kontraktu, bez zmiany buttona, tekstów i innych komponentów.
- Domenowe retry, częściowy zapis i guardy CRM nie są osobnym kontraktem tej specyfikacji.
- Bez edycji innych specek; dopisanie własnego wpisu do rejestru.

## 10. Wersjonowanie

- Dokument `1.0.0`: pierwsza specyfikacja feature, bez sztucznego bumpa.
- Rejestr: `modal: 1.0.0` w `docs/sdd/versioning.md`.
- Wersja dokumentu jest niezależna od npm i skilla Votey.
- Check Archiwum PleoAI 2026-11-02 nie wykazał istniejącej specki modal. Nie publikowano dokumentu do storage ani review.

## 11. Faktyczny Sposób Dostarczenia i Rollback

### 11.1 Dostarczenie i konfiguracja

Źródła Angular kompiluje ng-packagr przez `npm run build:angular`. Package exports wskazuje deklaracje i FESM pod `./angular`; peer dependencies obejmują Angular/CDK i RxJS. Konsument zapewnia istniejące style CDK overlay, tokeny i translator Votey.

Workflow `.github/workflows/npm-publish.yml` obejmuje walidację/testy tokenów, pełny build, podbicie patch, publikację restricted npm i commit wersji. Jednostką publikacji jest cała paczka, bez osobnego deploymentu modala. Lokalna wersja 1.1.0-rc.0 nie dowodzi wykonania workflow. Wcześniejsza integracja lokalna CRM używała tarballa, co nie potwierdza wersji produkcyjnej.

Modal nie wymaga własnego BE, sekretów, migracji ani bazy. Uwierzytelnienie instalacji prywatnej paczki należy do konfiguracji konsumenta. Brak własnej flagi, logu domenowego i telemetryki modala; nieobsłużone błędy otrzymuje ErrorHandler aplikacji.

### 11.2 Rollback

Powrót wymaga kompatybilnej wersji paczki, ewentualnego cofnięcia nowych użyć w konsumencie oraz jego ponownego buildu/wdrożenia. Starsza paczka może nie zawierać modala lub obsługi Observable; sam downgrade nie gwarantuje poprawnego rollbacku.

Brak rollbacku danych DS. Wycofanie UI i anulowanie subskrypcji nie cofają mutacji już wykonanej przez backend callbacka. Operacyjny rollback konkretnego środowiska konsumenta pozostaje poza dowodami dokumentu.

## 12. Testy i Definition Of Done Dokumentu

### Plan weryfikacji Angular

- Testy DOM/integracyjne: `tests/modal-dom.test.js`, korzystające z artefaktu Angular po buildzie; mapowanie AC w sekcji 7.
- Storybook Playground: potwierdzenie, formularz, błąd, długa treść, trzy akcje i własna belka.
- Manualnie: rozmiary desktop/mobile i niski viewport, Tab/Shift+Tab, fokus, Escape/tło, zagnieżdżony picker/select, źródłowy busy przed close, zmiana języka, wielokrotne otwarcie/zamknięcie.
- Requesty domenowe i pełne E2E konsumenta są poza testami DS. Test ramy nie potwierdza wszystkich wariantów backendowych.
- Przy przyszłej zmianie: build Angular, testy modala, build Storybooka i reprezentatywny smoke test konsumenta, w zatwierdzonym zakresie zadania.

### Ograniczenia dowodów

- Nie potwierdzono pełnej zgodności WCAG ani czytnika ekranu dla wszystkich treści. CDK nie zastępuje dostępności formularza.
- Rozbudowany nagłówek/stopka na niskim ekranie wymagają osobnej oceny; brak minimalnej wysokości body.
- Brak timeoutu, auto-retry, rozpoznania częściowego sukcesu i domenowego unieważnienia kontekstu. Brak owner: DestroyRef nie jest gwarancją cleanupu dowolnej lokalnie montowanej treści rodzica.
- Brak dedykowanej makiety i dowodu produkcyjnego wdrożenia. Kod, wcześniejsze testy i potrzeby dalszej weryfikacji są rozdzielone.

### DoD authoringu

- [x] Autor, typ, tryb, repo, stack i zakres obecnej implementacji ustalone.
- [x] Check biblioteki wykonany; brak docelowej specki modal.
- [x] Opis biznesowy/techniczny, dane, stany, lifecycle i granice odpowiedzialności jawne.
- [x] Publiczne API porównane ze źródłami i eksportem paczki.
- [x] AC wskazują dowody lub manualną weryfikację, bez deklaracji nieprzeprowadzonych testów.
- [x] Dokument i rejestr mają zgodną wersję.
- [x] Bez zmian runtime, story/review guide i publikacji specyfikacji.

## 13. Workflow Handoff i Akceptacji

Lokalny Draft typu SPECIFICATION, bez Jira key i uruchomionego workflow. Standardowy obieg: `BE → FE → TESTER`; backend komponentu to N/A. Publikacja wymaga osobnego zlecenia i właściwego Jira key.

Pełny kontrakt jest w Markdown; diagram/PNG nie są wymagane do review. Źródła są w sekcji 4. Pomocnicza mapa projektu: `docs/sdd/project-maps/PLEO-group/design-system-votey/project_map.py`; stack: `.agent-library.yaml`.

### Korekta CR — 2026-11-05

Podział modeli na pliki nie zmienia nazw eksportów publicznych. Metody oznaczone `@internal` służą wyłącznie współpracy klas DS i nie mogą być używane przez aplikacje konsumenckie. Subskrypcja zamknięcia w serwisie kończy się po pierwszej emisji.
