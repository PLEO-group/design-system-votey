# Kontrakt loaderów dla konsumentów Angular

Wczytaj tę referencję, jeśli zadanie dotyka pierwszego pobrania danych, odświeżania,
requestów, akcji asynchronicznej, retry, stanów `loading/empty/error`,
`LoaderService`, `LocalLoadingState`, `app-loading-region` albo sposobu blokowania
obszaru podczas pracy. Używaj jej dla nowej funkcjonalności i refaktoru istniejącego
loadera, nie tylko przy zmianie globalnego systemu.

To kontrakt zachowania po stronie konsumenta Angular. Nie jest referencją do tworzenia
nowego loadera Votey ani do importowania prywatnych internali paczki. Jeśli zadanie
zmienia publiczny komponent DS, wróć do `angular-components.md`.

## Bramka użycia i zakres zadania

Najpierw ustal, czy zmiana:

1. Dodaje nowy obszar oczekiwania albo zmienia to, co użytkownik może robić podczas
   oczekiwania — stosuj poniższy kontrakt i obejmij wszystkie stany danego obszaru.
2. Refaktoryzuje loader konkretnej funkcjonalności — zachowaj kontrakt requestów,
   dane, błędy, retry i dostępność; zmieniaj tylko wskazany obszar i jego bezpośrednie
   zależności.
3. Zmienia właściciela loaderów współdzielonego między feature'ami — najpierw
   zinwentaryzuj jego konsumentów, potem aktualizuj każdego objętego zmianą. Nie
   wnioskuj z jednego widoku, że można zmienić aplikację globalnie.
4. Zmienia wyłącznie niezależny styl lub tekst stanu — nie przebudowuj przepływu
   asynchronicznego. Jeżeli w trakcie edycji ujawni się problem z cyklem życia,
   anulowaniem albo błędem, opisz go i napraw tylko wtedy, gdy należy do zleconego
   zakresu.

Nie wczytuj całej referencji przy zmianie niezwiązanej z asynchronicznym stanem UI.
Wczytaj ją także wtedy, gdy użytkownik mówi ogólnie o miganiu loadera, blokowaniu
widoku, niewłaściwym spinnerze albo pozostawaniu starej treści podczas refreshu.

## Wybór właściciela i prezentacji

Każda operacja ma jednego właściciela wizualnego. Wybierz najmniejszy kontener,
którego dane lub akcje faktycznie czekają.

| Sytuacja | Zachowanie |
| --- | --- |
| Bootstrap aplikacji do gotowości pierwszej trasy/tłumaczeń | Istniejący master loader aplikacji. Nie uruchamiaj go ponownie dla zwykłych requestów. |
| Pierwsze pobranie nieznanej treści strony, taba, sekcji lub modalu | Lokalny loader w kontenerze tej treści. Nie chowaj statycznego nagłówka ani niezależnej nawigacji. |
| Kilka requestów jest koniecznych do pierwszego użytecznego renderu tej samej sekcji | Mogą korzystać ze wspólnej instancji `LocalLoadingState`; kontener pozostaje niegotowy do zakończenia wszystkich aktywnych odczytów. |
| Dwie sekcje mogą być niezależnie używane i gotowe | Daj im odrębne stany i kontenery, aby jedna sekcja nie czekała na drugą. |
| Paginacja/filtry/odświeżenie, gdy poprzednie dane są aktualne i użyteczne | Zachowaj dane i blokuj tylko operację lub zależną sekcję, o ile nadal można jej bezpiecznie używać. Wspólny `app-loading-region` blokuje projekcję na czas `loading`; jeśli to za szeroko, rozdziel stan lub zakres. |
| Zapis, upload albo akcja użytkownika | `action()` w granicy formularza/sekcji albo stan przycisku, zgodnie z istniejącym wzorcem. Blokuj tylko kolidujące akcje. Nie zastępuj gotowego formularza pustym stanem. |
| Autosave albo operacja tła | Nie pokazuj blokującego overlayu; rozważ `action(channel, propagateError, false)` albo istniejący dyskretny sygnał. |
| Synchroniczne filtrowanie/sortowanie danych lokalnych | Bez sztucznego loadingu. |
| Sukces z pustą listą | Zwykły stan `empty`, po potwierdzonym sukcesie. Pusta tablica początkowa nie jest sukcesem. |
| Błąd pierwszego pobrania | Lokalny stan błędu i retry albo dotychczasowa właściwa obsługa błędu. Nie pokazuj empty state. |
| Błąd odświeżenia | Zachowaj poprzednie poprawne dane i pokaż, że odświeżenie się nie udało; nie maskuj ich nakładką błędu bez decyzji produktowej. |
| Dane kompletne z cache i brak blokującej pracy | Pokaż dane bez udawanego loadera. |

Odczyt HTTP w komponencie obsługuj przez `LocalLoadingState` i najwęższy
`app-loading-region`. CRM nie ma już interceptora ani API `withApiLoader`; nie
wprowadzaj ponownie request contextu do pokazywania loadera. Operacje bez widocznego
obszaru, takie jak prefetch, nie wymagają loadera. Ręczne `LoaderService.show/hide`
pozostaje dla istniejących integracji kontrolek i nie powinno być dokładane do tego
samego requestu śledzonego przez lokalny stan.

Jeśli zadanie jawnie wprowadza skeleton, traktuj go jako prezentację oczekiwania tego
samego regionu, nie jako drugi system stanu ani sygnał sukcesu. Zachowaj tego samego
właściciela operacji i rozróżnienie `loading`, `empty` oraz `error`; nie dokładaj
równoległego spinnera. Przed wyborem komponentu skeleton sprawdź aktualne publiczne
API Votey. Ta referencja nie ustanawia jeszcze komponentu ani wizualnego kontraktu
skeletonów.

## Aktualny wzorzec CRM: `LocalLoadingState`

Kod źródłowy: `src/app/_loaders/local-loading-state.ts`. To stan/logika; nie renderuje
DOM. Twórz jedną instancję na jeden właścicielski obszar UI, w kontekście Angular DI
(zwykle jako pole komponentu). Nie twórz instancji podczas renderowania ani per request.
Konstruktor wstrzykuje `DestroyRef` i przyjmuje callback retry:

```ts
protected readonly loadingState: LocalLoadingState =
  new LocalLoadingState(() => this.reloadData());
```

Callback retry uruchamia rzeczywiste ponowne pobranie danych. Wrapper sam nie odtwarza
requestu. Metoda retry powinna ponowić wymagane odczyty bez ponownego wywoływania
`ngOnInit` i bez dodawania kolejnych trwałych subskrypcji.

### Sygnały

| Sygnał | Dokładne znaczenie |
| --- | --- |
| `loading` | Trwa co najmniej jedna blokująca operacja śledzona tym stanem. Ustawia się od razu; nie czeka na widoczność animacji. |
| `visible` | Opóźniony loader animowany jest obecnie wyświetlany. Może stać się `true` po zakończeniu krótkiego requestu tylko wtedy, gdy timer nie został anulowany; synchroniczny odczyt nie powinien go błysnąć. |
| `ready` | Kontener może wyświetlić właściwą treść. Stan rozpoczyna się jako `true`; przy pierwszym subskrybowanym `track()` bez otrzymanych danych przechodzi na `false`, a po udanym wyniku znów na `true`. |
| `failed` | Co najmniej jeden kanał `track()` zakończył się błędem i nie został pomyślnie ponowiony. Sukces kanału siostrzanego nie kasuje go. |
| `actionFailed` | Błąd akcji ma być pokazany przy formularzu/obszarze; nie jest błędem pobrania danych i nie chowa formularza. Kolejna akcja resetuje ten stan. |

`loading` nie jest tym samym co `visible`. `ready` nie oznacza, że dowolna kontrolka
zewnętrzna lub osadzony widget zakończył inicjalizację. Używaj sygnału zdarzenia
gotowości tej kontrolki dla akcji, które od niej zależą.

### Odczyty: `track(channel, propagateError?)`

`track` jest operatorem RxJS dla odczytów. `channel` identyfikuje wymienny zasób
w obrębie jednej instancji stanu — używaj stabilnej, znaczącej nazwy, np. `profile`,
`members` lub `payment-methods`.

```ts
this.api.fetchMembers().pipe(
  this.loadingState.track("members", true),
  take(1),
  takeUntilDestroyed(this.destroyRef),
).subscribe({
  next: members => this.members = members,
  error: error => this.handleMembersError(error),
});
```

- Nowy odczyt na tym samym kanale anuluje poprzedni i uniemożliwia jego emisjom
  zaktualizowanie subskrypcji. Stosuj to do odczytów zastępowanych nowszymi, np.
  wyszukiwania, zmiany filtra lub bieżącej tożsamości.
- Odczyty na różnych kanałach mogą trwać równolegle. Wspólny `loading` i wrapper
  czekają na wszystkie aktywne kanały. Kanały **nie** są osobnymi loaderami wizualnymi;
  jeśli zasoby mają być niezależnie użyteczne, użyj osobnych stanów/kontenerów.
- Emisja `next` oznacza, że helper otrzymał dane, nie że Angular wyrenderował je ani
  że iframe/Stripe/obraz jest gotowy. Ustawiaj i kończ stan kontrolki według jej
  właściwego callbacku.
- Sukces `[]` jest poprawnym wynikiem: `ready` wraca do `true`, a komponent renderuje
  własny empty state.
- Domyślnie helper zapisuje failure i konsumuje błąd do `EMPTY`. Ustaw
  `propagateError: true`, gdy komponent musi otrzymać error w `subscribe`. Helper nadal
  ustawi `failed` i posprząta oczekiwanie. Obsługa błędu w komponencie nie może
  zamaskować błędu przez wcześniejsze `catchError(() => of([]))`; jeśli przechwytujesz
  błąd poza helperem, umieść przechwycenie za nim albo jawnie odwzoruj błąd na stan.
- Przy `propagateError: true` wybierz jednego właściciela komunikatu: wrapper pokazuje
  lokalny alert z retry; nie dokładaj bez potrzeby identycznego snackbara. Inny
  komunikat domenowy dodaj tylko, jeśli daje użytkownikowi odrębną informację.

Nie dziel kanałów tylko po to, by wyłączyć spinner dla części requestów: wszystkie
`track()` w jednym stanie wpływają na ten sam region. Dla prefetchu/background użyj
osobnego przepływu albo właściwej akcji nieblokującej.

### Akcje: `action(channel, propagateError?, blocking?)`

```ts
this.api.save(payload).pipe(
  this.loadingState.action("save", true),
  takeUntilDestroyed(this.destroyRef),
).subscribe({
  next: result => this.handleSaved(result),
  error: error => this.handleSaveError(error),
});
```

- Akcja domyślnie jest blokująca: korzysta z regionu `loading`, ale nie zmienia
  `ready` ani `failed` odczytów. Jeśli ten stan jest podpięty do
  `app-loading-region`, jego overlay ustawi `inert` na całej projekcji. Używaj
  blokującej akcji tylko wtedy, gdy wszystkie interakcje w tej projekcji mogą być
  bezpiecznie zablokowane do końca akcji.
- Jeśli podczas zapisu część formularza ma pozostać interaktywna, ustaw
  `blocking: false`. Przygotuj w komponencie `computed()` na podstawie
  `isActionPending(channel)` i użyj go do zablokowania wyłącznie kontrolki
  uruchamiającej zapis oraz innych operacji, które z nim kolidują:

  ```ts
  protected readonly savePending = computed(() => this.loadingState.isActionPending("profile-save"));
  ```

  ```html
  <vt-button
    text="BUTTON.SAVE"
    [disabled]="savePending()"
    (pressed)="save()"
  />
  ```

- Powtórna subskrypcja **blokującej** akcji na tym samym kanale jest pomijana.
  Akcje nieblokujące na tym samym kanale mogą działać równolegle (np. autosave),
  a `isActionPending(channel)` pozostaje prawdziwe aż do zakończenia ostatniej.
  Jeśli powtórne żądanie ma być pomijane, sprawdź stan przed uruchomieniem akcji;
  jeśli ma być kolejkowane, zastosuj kolejkę w logice domenowej. Inny kanał akcji
  nie jest automatycznym mutexem — jeśli dwie różne akcje wzajemnie się wykluczają,
  zabezpiecz je wspólną blokadą domenową.
- `propagateError: false` przechwytuje błąd, ustawia `actionFailed` i kończy strumień
  bez błędu. Formularz pozostaje widoczny i edytowalny, a wrapper pokaże ogólny alert.
- `propagateError: true` przekazuje błąd subskrybentowi i pozostawia komunikat
  domenowy komponentowi. Nie ustawia `failed` odczytu. Komponent powinien zapewnić
  właściwe poinformowanie użytkownika.
- `blocking: false` nie pokazuje ani nie blokuje regionu. Operacja nadal jest
  anulowana przy destroy, a jej stan odczytasz przez `isActionPending(channel)`.
  Przy autosave wybierz świadomie obsługę błędu; globalny `actionFailed` może pokazać
  alert nawet bez overlayu.

Umieszczaj `action()` za całym blokującym łańcuchem, który użytkownik uważa za jedną
akcję: walidacją asynchroniczną, uploadem, zapisem i wymaganymi zapisami następczymi.
Umieszczenie go tylko przy pierwszym HTTP requestcie może schować loader przed końcem
operacji. Zachowaj istniejące powiadomienia domenowe i semantykę kolejki zapisów.

### Kanały, ponowienie i sprzątanie

- Wszystkie blokujące requesty mają licznik współbieżności; region kończy `loading`
  po zakończeniu ostatniego z nich. Zastąpienie kanału zwiększa nowe oczekiwanie przed
  anulowaniem poprzedniego, żeby nie mignął stan idle.
- Retry wywołuje przekazany callback. Gdy odczyt kanału zaczyna się ponownie,
  poprzedni błąd tego kanału jest czyszczony; błąd innego kanału pozostaje.
- `takeUntilDestroyed` i `DestroyRef` przerywają obserwacje przy zniszczeniu właściciela,
  czyszczą timery i nie pozwalają uruchomić źródła po destroy. Helper sam używa
  zabezpieczeń cyklu życia; zachowaj standardowy operator komponentu dla całego
  łańcucha/subskrypcji, szczególnie efektów następczych.
- Sprzątanie jest idempotentne: sukces, błąd, anulowanie i `finalize` nie mogą
  zmniejszyć licznika wielokrotnie ani zakończyć nowszego requestu.
- Samo skasowanie starej subskrypcji nie chroni przed wszystkimi callbackami poza
  Observable. Jeśli handler aktualizuje stan z zewnętrznego callbacku, użyj tokenu
  generacji/tożsamości requestu i sprawdź, czy widok nadal jest właścicielem wyniku.

### Opóźnienie i blokowanie

`LocalLoadingState` korzysta z `APP_NGX_UI_LOADER_CONFIG` z
`src/app/_loaders/app-loader.config.ts`: opóźnienie **150 ms**, minimum widoczności
animacji **250 ms**. To lokalna konfiguracja CRM, nie kontrakt publicznego DS.

Te wartości dotyczą prezentacji animacji, nie publikacji odpowiedzi. Request może
zakończyć się przed 150 ms i wówczas nie widać loadera. Jeśli loader zdążył się
pokazać, dane nadal są aktualizowane od razu, lecz `visible` może pozostać `true`
przez resztę minimalnych 250 ms. `app-loading-region` utrzymuje wtedy `inert` na
projekcji. Opóźnienie loadera nie jest okresem bezpiecznej interakcji.

Nie dokładaj lokalnych timerów, kolejnych progów ani opóźnienia aktualizacji danych.
Jeśli nakładka miga lub blokuje za długo, najpierw ustal, czy potrzebny jest ten sam
region i czy request naprawdę blokuje interakcję; zgłoś potrzebę zmiany wspólnej
konfiguracji oddzielnie zamiast maskować problem w komponencie.

## Wrapper `app-loading-region`

Kod: `src/app/shared/loading-region/`. To lokalny wrapper CRM, nie publiczny komponent
Votey. Wymaga `[state]` i przyjmuje `[compact]` oraz `[fill]`.

```html
<app-loading-region [state]="loadingState">
  <!-- Treść, którą ten stan rzeczywiście kontroluje. -->
</app-loading-region>
```

- Loader oraz `role="alert"` z retry są renderowane wyłącznie w wrapperze; błędy
  danych pokazuje się w jego granicy. `state.retry()` wywołuje funkcję retry właściciela.
- `aria-busy` odzwierciedla `loading`, czyli odczyty `track()` i blokujące akcje.
  `inert` trafia na całą projektowaną treść, gdy `loading || visible || failed`;
  nawigacja poza wrapperem pozostaje dostępna. Dlatego nie obejmuj wrapperem całego
  formularza, jeśli blokująca akcja ma unieruchomić tylko jego część. Dla takiego
  zapisu użyj `blocking: false` i `isActionPending(channel)` na kolidujących
  kontrolkach albo wydziel mniejszy wrapper obejmujący wyłącznie blokowany obszar.
- Pierwsza treść jest ukryta, gdy `ready === false`. Przy błędzie wrapper renderuje
  alert/retry, a treść pozostaje inert. Pusty wynik sukcesu renderuje komponent.
- `compact` zmienia minimalny rozmiar powierzchni; `fill` ustawia projekcję jako
  elastyczną kolumnę, która wypełnia dostępną wysokość. Stosuj je wyłącznie zgodnie
  z lokalnym layoutem. Zachowaj stabilną geometrię kontenera, jeśli inaczej wynika
  skok strony.
- Odczyt HTTP nowego lub refaktoryzowanego komponentu wiąż z tym wrapperem; nie
  twórz `ngx-ui-loader` hosta ani `HttpContext` loadera dla requestu.
- Nie owijaj statycznego nagłówka, tabów, filtrów ani niezależnej paginacji, jeżeli
  mają pozostać dostępne podczas oczekiwania. Dla różnych sekcji utwórz osobne
  kontenery/stany. Jedna instancja nie modeluje gotowości niezależnych regionów.

Ogólny komunikat wrappera używa `ERRORS.UNEXPECTED` i przycisku `BUTTON.RETRY`.
Przed własnym error UI sprawdź istniejące klucze oraz wzorzec widoku. Nie renderuj
drugiego równoległego loadera albo identycznego alertu w projekcji.

## Starsze i globalne wzorce

- `LoaderService.show(id)/hide(id)` oraz niektóre hosty `ngx-ui-loader` nadal
  obsługują istniejące ręczne integracje, zwłaszcza Stripe, raporty i obraz w modalu.
  Przy refaktorze takiej integracji zachowaj jedno ID, jednego właściciela i
  sprzątanie na każdej ścieżce. Dla odczytów HTTP w komponencie migruj na
  `LocalLoadingState`; nie kopiuj ręcznej pary `show`/`hide`.
- Master loader aplikacji obsługuje bootstrap i pierwsze renderowanie trasy.
  Zwykły request nie może go aktywować.
- `app-branded-loader` jest prezentacją wewnątrz lokalnych wrapperów/hostów. Nie
  kopiuj jego SVG, animacji ani prywatnych klas do feature'a.

Przed usunięciem albo zmianą integracji legacy sprawdź publiczne punkty wywołania,
host HTML i wszystkie błędy. Sama obecność `show(id)` lub lokalnego hosta nie dowodzi
poprawnego cyklu życia.

## Zasady pierwszej treści, refreshu i błędów

Przed edycją wypisz dla każdego niezależnego obszaru: źródło danych, zależności
gotowości, treść już dostępną, akcje blokowane, stan pusty i obsługę błędu.

- Rozdziel `initial/loading/data/empty/error` w logice feature'a. `LocalLoadingState`
  nie przechowuje danych, paginacji ani empty state; komponent pozostaje ich właścicielem.
- Przy pierwszym requestcie nie ustawiaj stanu `empty` przed odpowiedzią. W template
  warunki `empty` i retry renderuj dopiero po udanej emisji/deterministycznym sukcesie.
- Przy refreshu zachowaj stare dane tylko w tym samym kontekście (użytkownik,
  organizacja, route, query, filtr i zasób). Nowa tożsamość musi unieważnić poprzednią
  odpowiedź i nie może odsłonić danych poprzedniego kontekstu.
- `track()` aktualizuje lifecycle Observable, nie cache. Zachowanie poprzedniej listy
  lub odpowiedzi pozostaje w komponencie/istniejącym store; nie buduj nowego store'a
  tylko dla loadera.
- Dla requestów równoległych ustal, które są rzeczywiście wymagane do użytecznego
  pierwszego widoku. Nie czekaj na licznik/telemetrię razem z treścią krytyczną.
- Błąd musi zakończyć loading i dostarczyć retry albo istniejącą obsługę domenową.
  Nie połykaj błędu w utility po drodze; odróżnij błąd od pustego sukcesu.
- Akcja zapisu zachowuje formularz i wartości. Loading akcji może wyłączyć zapis
  i kontrolki, z którymi zapis koliduje, ale nie powinien resetować sekcji.

## Wymogi implementacji i review

Przed zakończeniem pracy sprawdź:

1. Czy stan ma jednego właściciela, a zasięg wrappera pokrywa wyłącznie jego dane
   i akcje? Czy niezależne regiony mają osobne stany?
2. Czy odczyt HTTP ma dokładnie jednego właściciela wizualnego i lokalny wrapper
   obejmuje tylko zależną treść? Czy ręczne hosty `ngx-ui-loader` są ograniczone do
   istniejących integracji kontrolek?
3. Czy pierwsze pobranie nie myli loading z empty? Czy refresh zachowuje tylko dane
   właściwego kontekstu?
4. Czy kanał jest stabilny i oznacza wymienny odczyt? Czy anulowanie starego wyniku,
   szybkie przełączanie oraz destroy uniemożliwiają spóźnioną zmianę UI?
5. Czy wszystkie odczyty wymagane do kontenera rozliczają loading w sukcesie, błędzie
   i anulowaniu? Czy `propagateError` zgadza się z obsługą `subscribe`?
6. Czy retry naprawdę uruchamia wymagane requesty? Czy nie rejestruje zduplikowanych
   listenerów/subskrypcji?
7. Czy nakładka rzeczywiście musi ustawić `inert` na całą projekcję? Jeśli nie,
   przenieś stan do akcji lub wydziel mniejszy kontener.
8. Czy loader pozostaje jedynym komunikatem screen readera, błąd ma `alert`, a
   nawigacja spoza obszaru zostaje dostępna?
9. Czy widok sprawdzono dla wolnego pierwszego requestu, szybkiego sukcesu, pustego
   sukcesu, błędu, retry, odświeżenia, szybkiej zmiany parametru i destroy — tylko
   przypadki należące do zmiany?

Testy są potrzebne dla reguł cyklu życia, które łatwo popsuć: cancellation/stale data,
wiele współbieżnych kanałów, retry po błędzie, podwójna mutacja i destroy. Nie pisz
testów, które tylko powtarzają DOM wrappera albo wszystkie warianty wizualne. Zgodę
na uruchomienie testu/builda ustal z instrukcjami projektu; aktualizacja speca nie
oznacza zgody na komendę.

## Zasady nazewnictwa i tożsamości

Dla istniejących ręcznych hostów `ngx-ui-loader` używaj lowercase kebab-case, np.
`payments-card-form-loader`. Trzymaj identyfikator przy właścicielu hosta.
`LocalLoadingState` nie wymaga globalnego ID — `channel` jest lokalny dla jednej
instancji. `createLocalLoaderId(scope)` pozostaje dostępny dla integracji legacy,
jeśli kilka hostów danego typu może istnieć równocześnie.

## Aktualne źródła CRM

Sprawdź kod z aktualnego checkoutu, bo komponenty i migracja mogą się zmienić:

- `src/app/_loaders/local-loading-state.ts` i sąsiadujący `.spec.ts` — semantyka
  kanałów, timerów, błędów, retry, akcji i destroy.
- `src/app/shared/loading-region/` — publiczny lokalny input oraz zakres overlay,
  `inert`, alertu, retry i layoutu `compact`/`fill`.
- `src/app/_loaders/app-loader.config.ts` — rzeczywiste opóźnienie/minimum animacji.
- `src/app/_services/loader.service.ts` — ręczne hosty legacy i master loader
  bootstrapowy; nie służy do śledzenia zwykłych odczytów HTTP.
- `src/app/client/events/events-list/` — wzorzec odrębnego stanu danych i wrappera
  panelu, jeśli jest obecny w bieżącym branchu.

Nie traktuj listy przykładowych komponentów ani testów jako dowodu migracji całej
CRM. Sprawdź najbliższy aktywny feature i jego własny flow przed reużyciem wzorca.
