# Modale Angular: kontrakt i obowiązkowy wzorzec pracy

Wczytaj przy tworzeniu, użyciu, migracji, debugowaniu lub review wycentrowanego
dialogu Votey. Panele przy przycisku, menu, selecty i popovery mają odrębne kontrakty.
Zakres paczki i konsumenta ustal przed edycją; ta referencja nie upoważnia do
zmiany CRM, publikacji npm ani wykonywania operacji biznesowych.

## API i odpowiedzialności

Importuj wyłącznie z `@pleodigital/design-system-votey/angular`.
Źródłem API są `angular/src/lib/modal/` i `angular/src/public-api.ts`; dla
konsumenta potwierdź eksporty jego faktycznie zainstalowanego artefaktu.
Starsze paczki nie zawierają tego komponentu. Obecny lokalny kandydat `1.1.0-rc.0`
nie oznacza publikacji ani migracji aplikacji.

- Jeden `VoteyModalComponent` zawiera ramę, prostą wiadomość, dynamiczną treść,
  akcje i stan zamykania. Nie twórz osobnych komponentów host/confirmation.
- `VoteyModalService.open(Component | TemplateRef | null, config)` otwiera okno.
  `confirm(config)` otwiera ten sam komponent z wiadomością, bez osobnej treści.
- `VoteyModalRef<TResult>` jest uchwytem: `close`, `closed`, `setBusy`,
  `updateActions` oraz odczyt stanu. Nie przenoś do niego logiki komponentu.
- Domena, API, formularz, uprawnienia, routing i komunikaty należą do konsumenta.
  Komponent treści wstrzykuje `VOTEY_MODAL_DATA` i `VoteyModalRef<TResult>`.
  Szablon treści otrzymuje `let-data` i `let-modal="modal"`.

## Rozmiar prostego modala

Modal zawierający wyłącznie tekst i akcje otwieraj z jawnym `size: "small"`.
Dotyczy to również `confirm()`, potwierdzeń usuwania, ostrzeżeń i informacji.
Nie pozostawiaj domyślnego rozmiaru `standard` dla takiej treści. Przy migracji
istniejącego monitu zastosuj tę samą zasadę. Rozmiar modali z formularzem lub inną
złożoną treścią dobieraj do ich zawartości.

## Routing modala

Modal nie ma własnej trasy. Otwieraj go z bieżącego widoku przez serwis modala,
bez nawigacji do pomocniczego komponentu trasy. Identyfikator zasobu i pozostały
kontekst przekazuj jawnie w typowanych danych `data` / `VOTEY_MODAL_DATA` albo
w callbacku potwierdzenia. Nie odczytuj ID modala z `ActivatedRoute`.
Anulowanie nie zmienia URL ani historii. Po sukcesie właściciel odświeża właściwe
dane; nawigacja jest dopuszczalna, gdy wynika z operacji domenowej, np. po usunięciu
aktualnie oglądanego zasobu. Przy migracji usuń pomocniczą trasę i jej wywołania.

## Akcje bez szablonów stopki

Typowy modal konfiguruje `confirmText`/`onConfirm`, `cancelText`/`onCancel` oraz
opcjonalne `thirdActionText`/`onThirdAction`. Użyj `confirmVariant: "danger"` dla
destrukcyjnego potwierdzenia i reaktywnego `confirmDisabled` dla walidacji.

- Confirm i trzecia akcja nie zamykają okna automatycznie. Callback jawnie
  wywołuje `ref.close(result)` po spełnieniu warunków domenowych.
- Cancel bez callbacka zamyka z powodem `cancel`. Własny `onCancel` przejmuje
  odpowiedzialność za dalszy przebieg i zamknięcie.
- Krzyżyk, tło i Escape nie wywołują `onCancel`. Wszystkie żądania zamknięcia
  przechodzą przez `beforeClose`, z wyjątkiem wymuszonego teardownu frameworka.
- Przycisk confirm bez handlera jest niedostępny. Trzecia akcja wymaga tekstu
  i callbacka. Puste etykiety ukrywają przyciski.
- Złożony układ: `hideModalActions: true`, własna belka wewnątrz treści i jej
  obsługa w komponencie domenowym. Bez dyrektywy akcji i bez `TemplateRef` stopki.
  Własna belka musi zachować blokady, loader, dostępność i widoczność na mobile.
- Treść może w `ngOnInit` wywołać `ref.updateActions({ onConfirm: () => this.save(),
  confirmDisabled: this.confirmDisabled, ... })`. Nie przypisuj metod instancji
  bez zachowania `this`. Nie konfiguruj akcji podczas renderowania.

## Obowiązkowy kontrakt requestu i loadera

Przed implementacją odtwórz payload, rezultat, właściciela danych i warunki
zamknięcia. Przy migracji zachowaj walidację, uprawnienia i selektory E2E.
Przy requestach CRM wczytaj również [loader-contract.md](loader-contract.md);
nie kopiuj `LocalLoadingState` ani `app-loading-region` do paczki DS.

1. **Jeden właściciel oczekiwania.** Jeśli formularz ma już reaktywny stan requestu,
   przekaż `busy: savePending` w konfiguracji lub `updateActions`. Nie dokładaj
   równoległego `isSaving`, `setBusy` ani drugiego globalnego loadera dla tej operacji.
   `setBusy` jest dla operacji bez istniejącego stanu; kończ go na każdej ścieżce.
2. **Pierwsze pobranie** ma lokalny region loading/error/retry w treści. Nagłówek
   pozostaje dostępny; confirm jest disabled do gotowości danych. Sukces z pustymi
   danymi odróżniaj od błędu i początkowego pustego stanu. Retry ponawia odczyt,
   nie inicjalizację całego komponentu.
3. **Zapis** najpierw sprawdza walidację i aktualny stan in-flight. Ustaw touched
   dla błędnych pól. Zablokuj duplikaty w handlerze, nie tylko przyciskiem.
   Request korzysta z istniejącego kontraktu i nie zmienia payloadu przy migracji.
4. **Podczas zapisu** zachowaj formularz i jego wartości. Standardowy modal blokuje
   wspólne akcje i dismiss, pokazuje postęp w stopce (`busyText` z tłumaczeń) oraz
   `aria-busy`. Sam disabled nie jest wystarczającym komunikatem oczekiwania.
   Blokady edycji pól wynikają z domeny; DS nie wyłącza automatycznie kontrolek treści.
5. **Sukces** potwierdza rzeczywisty wynik API. Zakończ źródłowy stan busy przed
   `ref.close(result)`; przy operatorach RxJS uwzględnij kolejność teardown/finalize.
   Nie zamykaj przed requestem ani bezwarunkowo w finalize. Rodzic aktualizuje dane
   z wyniku albo robi jeden refetch. Nie wykonuj obu i nie dubluj komunikatu sukcesu.
6. **Failure** pozostawia okno, dane i dirty state; kończy busy, pokazuje użyteczny
   błąd i umożliwia ponowienie. Mapuj błędy walidacji do pól, jeśli API to wspiera.
   Nie zamieniaj błędu w wynik sukcesu/empty. Nie ponawiaj automatycznie mutacji.
7. **Cleanup** obejmuje subskrypcje, timery i operacje po zniszczeniu treści.
   `takeUntilDestroyed` anuluje lokalną subskrypcję, ale nie dowodzi rollbacku na BE.
   Po oczekiwaniu potwierdź aktualną tożsamość zasobu i uprawnienia przed mutacją
   lub zastosowaniem wyniku, jeśli mogą się zmienić w czasie otwartego dialogu.

Callback obsługuje `void | Observable<unknown> | Promise<unknown>`. Dla
requestów Angular preferuj zwrócenie Observable bez lokalnej subskrypcji,
`firstValueFrom` ani opakowania w `new Promise`. DS subskrybuje raz,
utrzymuje busy do zakończenia lub błędu strumienia (nie tylko pierwszej emisji)
i anuluje subskrypcję przy zniszczeniu dialogu. Nie subskrybuj tego samego
requestu również w treści. Użyj strumienia skończonego; długowieczny Subject
bez complete pozostawi akcję w stanie oczekiwania.

Callback `void` pozostaje właściwy dla istniejącego zapisu i autosave z własną
subskrypcją oraz reaktywnym `busy`. Guard otrzymuje Observable wyniku tego
zapisu; nie dokładaj callbacków `onComplete` ani Promise jako adaptera.
Kolejka autosave może udostępniać wynik przez ReplaySubject, żeby guard czekał
na najnowszy zakolejkowany zapis. Sam odczyt wyniku nie może ponawiać requestu.

Promise zostaw dla naturalnie obiecujących API zewnętrznych, np. SDK i Routera.
DS nie konwertuje Observable na Promise. Zniszczenie modala nie anuluje samej
operacji Promise ani nie oznacza rollbacku backendu.

Obsłuż oczekiwany błąd lokalnie przez `catchError`, zachowując okno i dane;
zwrócenie EMPTY kończy oczekiwanie bez sukcesu. Nieobsłużony błąd trafia do
Angular `ErrorHandler` i zwalnia busy. Nie zamykaj automatycznie po complete,
bo pusty lub anulowany strumień nie oznacza udanego zapisu.

`ref.close` pozostaje jawną decyzją domenową. Jeżeli zamknięcie niszczy
subskrypcję akcji, operatory za zamknięciem mogą się już nie wykonać. Aktualizację
danych wykonaj przed zamknięciem albo obsłuż wynik `closed` u rodzica.
Przy źródłowym busy zakończ jego kanał przed close; finalize może zamknąć okno
tylko przy osobno zapamiętanym sukcesie i żywym właścicielu, nigdy bezwarunkowo.

## Przykład prostego potwierdzenia

```ts
this.modal.confirm<boolean>({
  title: "HEADER.DELETE",
  message: "MESSAGE.DELETE_CONFIRMATION",
  confirmText: "BUTTON.DELETE",
  cancelText: "BUTTON.CLOSE",
  confirmVariant: "danger",
  onConfirm: ref => { void ref.close(true); },
}).closed.subscribe(result => {
  if (result.reason === "action" && result.value === true) {
    // Właściciel operacji podejmuje potwierdzoną decyzję.
  }
});
```

Przykładowe klucze nie są deklaracją istnienia w słowniku. Przy wdrożeniu użyj
istniejącego prefiksu i właściwych kluczy; nowe tłumaczenia zgłoś zgodnie z
`angular-code-standards`. Potwierdzenie decyzji może się zamknąć przed późniejszą
operacją na stronie, jeżeli strona jest właścicielem jej loadera i błędów. Jeżeli
błąd ma być poprawiany w modalu, request musi należeć do pozostającej otwartej treści.

## Wzorzec formularza w CRM

Stan formularza i requestów zostaje w komponencie treści. Typowy układ:

```ts
protected readonly loadingState = new LocalLoadingState(() => this.load());
protected readonly savePending = computed(() =>
  this.loadingState.isActionPending("save"));
// confirmDisabled musi czytać reaktywny status formularza, np. toSignal(statusChanges
// z wartością początkową). computed(() => form.invalid) sam nie śledzi Angular Forms.

public ngOnInit(): void {
  this.ref.updateActions({
    confirmText: "BUTTON.SAVE",
    cancelText: "BUTTON.CLOSE",
    onConfirm: () => this.save(),
    confirmDisabled: this.confirmDisabled,
    busy: this.savePending,
    busyText: "LABEL.SAVING",
  });
  this.load();
}
```

W `save` użyj istniejącego `loadingState.action("save", true, false)` i jawnej
obsługi next/error, z cleanupem. W tym wariancie stopka modala jest właścicielem
prezentacji zapisu; nie dokładaj blokującej nakładki dla tej samej akcji.
Zapamiętaj wynik dopiero w next, a zamknij dopiero po zakończeniu kanału save
i zwolnieniu busy. Finalize samo nie oznacza sukcesu: wykona się także przy błędzie
i anulowaniu. Przy `hideModalActions` własna belka przejmuje prezentację oczekiwania.

## Zamykanie i dostępność

- `closed` emituje raz `{ reason, value }`, potem kończy strumień; `undefined`
  po dismiss nie oznacza akceptacji. Wyniki trzech decyzji typuj jawnie.
- `beforeClose` może zwrócić boolean albo Promise; nie uruchamiaj równoległych
  pytań o niezapisane zmiany. Rozróżniaj anulowanie, odrzucenie i zapis.
- `closeOnNavigation` obserwuje zmianę URL. Nie zastępuje `CanDeactivate` i nie
  cofnie nawigacji. Teardown aplikacji może wymusić zamknięcie mimo busy/guarda.
- CDK zapewnia pułapkę fokusu, przywrócenie fokusu, scroll lock i izolację tła.
  Nie dodawaj globalnego nasłuchu Escape. Sprawdź działanie selecta/pickera w dialogu,
  opis pól, etykiety ikon, długą treść i widoczne akcje na małym ekranie.

## Weryfikacja przed zakończeniem

Sprawdź otwarcie, wszystkie trzy akcje, każdą drogę zamknięcia, busy, invalid,
sukces, błąd/retry, ochronę przed double-click i zachowanie danych po failure.
Dla własnej belki sprawdź ten sam kontrakt. Zweryfikuj przywrócenie fokusu,
Tab/Shift+Tab, Escape tylko dla najwyższego overlayu, viewport i motyw.
Przy zmianie paczki wykonaj build Angulara, właściwe testy i Storybook; oddziel
weryfikację DS od integracji konsumenta. Nie deklaruj migracji CRM bez jej wykonania.
