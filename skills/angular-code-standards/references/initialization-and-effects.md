# Inicjalizacja komponentu i efekty

Wczytaj przy dodawaniu albo przenoszeniu efektów, subskrypcji i inicjalizacji komponentu. Podstawowy podział odpowiedzialności jest w [3.6a](../SKILL.md#36a-constructor-ngoninit-i-metody-inicjalizacyjne); reguły doboru `computed()`/`effect()` i istniejący wyjątek dla lokalnego stanu interakcji pozostają w [3.7](../SKILL.md#37-computed-i-effect).

## Krótka orkiestracja

Przykładowy fragment klasy; stan, formularz i serwisy są zadeklarowane osobno, a komponent implementuje `OnInit`:

```ts
private readonly destroyRef: DestroyRef = inject(DestroyRef);

public constructor() {
  effect((): void => {
    const canAssign: boolean = this.canAssign();
    const writable: boolean = canAssign && this.superAdmin();
    this.syncControlAvailability(canAssign, writable);
  });
}

public ngOnInit(): void {
  this.observeSurveyChanges();
  this.observeAssignmentChanges();
  this.observeOptionSearch();
}
```

Każda metoda `observe...` rejestruje raz konkretny proces i zamyka długotrwałe subskrypcje przez `takeUntilDestroyed(this.destroyRef)`. Nie wywołuj jej dodatkowo z efektu. Metoda `syncControlAvailability` wykonuje enable/disable na istniejących kontrolkach; nie rejestruje subskrypcji. W Reactive Forms `emitEvent: false` wycisza emisje operacji formularza, ale nie wyłącza śledzenia sygnałów.

Wydzielaj metody dla realnych odpowiedzialności i istotnej złożoności; nie narzucaj limitu liczby linii ani helpera dla każdego callbacka. Nie twórz pustego `ngOnInit`, jeśli komponent nie ma jednorazowej inicjalizacji.

Przy przenoszeniu pipeline'u sprawdź jego pierwszą emisję, w tym `BehaviorSubject` i `startWith`: może wystąpić synchronicznie przy `.subscribe()`. Ustal, czy formularz i wymagany stan już istnieją. Inicjalizację zależną od widoku/DOM dopasuj do odpowiedniego API cyklu życia/renderowania, zamiast zakładać gotowy widok w `ngOnInit`.

## Co uruchamia efekt

- Rejestracja efektu odbywa się raz, a callback wykonuje się początkowo, aby ustalić zależności. Nie zakładaj synchronicznego wykonania w miejscu rejestracji ani jednego przebiegu na każde `.set()`; dokładny scheduling zależy od wersji Angulara i kontekstu komponent/root.
- Śledzone są odczyty wartości, np. `canAssign()`, w dowolnym miejscu callbacka i w synchronicznie wywołanych funkcjach. Sama referencja `canAssign`, deklaracja `const` lub zapis `.set()` nie rejestruje odczytu.
- Zależności są ustalane od nowa w każdym wykonaniu. Dla `canAssign() && superAdmin()` drugi sygnał jest śledzony tylko wtedy, gdy pierwszy zwróci `true` i odczyt drugiego faktycznie nastąpi.
- Zmiana śledzonej wartości powoduje ponowne wykonanie całego callbacka. Domyślna równość to `Object.is`; ustawienie tej samej wartości nie powiadamia konsumentów. Uwzględnij własne `equal`, jeśli jest skonfigurowane.
- Gdy efekt czyta tylko `computed`, zmiana jego źródła może wymusić przeliczenie, ale niezmieniony wynik według funkcji równości nie powoduje ponownego wykonania callbacka efektu. Inne bezpośrednio odczytane zależności nadal mogą go uruchomić.
- Śledzenie nie przechodzi do przyszłych emisji subskrypcji, timerów ani kodu po `await`. Callback Observable emitującego synchronicznie podczas `.subscribe()` wewnątrz efektu może jednak wykonać odczyty w aktywnym kontekście reaktywnym i dodać zależności.
- Zwykłe pola, tablice i głębokie mutacje obiektów nie są automatycznie reaktywne. Dodanie kontrolki do zwykłej kolekcji samo nie uruchomi efektu. Zapewnij osobną inicjalizację nowej kontrolki albo reaktywne źródło kolekcji, jeśli wymaga tego zachowanie UI.

## `untracked` i wydzielone metody

Przeniesienie logiki do metody nie odcina śledzenia. Jeśli metoda odczyta sygnał synchronicznie w efekcie, stanie się on zależnością. Dla czytelności można odczytać zamierzone źródła w callbacku i przekazać wartości do metody; jej dodatkowe odczyty nadal podlegają śledzeniu.

Dla celowo pomocniczego odczytu użyj `untracked(this.someSignal)` albo `untracked(() => this.integration.sync())`. Przy kolejnym wykonaniu odczytasz aktualną wartość, ale sama jej zmiana nie uruchomi efektu. Odczyt tego samego sygnału gdzie indziej poza `untracked` nadal tworzy zależność.

Nie używaj `untracked` dla stanu, którego zmiana musi odświeżyć kontrolki/UI. Nie wyciszaj całego callbacka tylko po to, by naprawić pętlę. `untracked` wyłącza śledzenie odczytów w danym fragmencie, nie powiadomienia wynikające z zapisów do sygnałów.

## Zapis do zależności i dobór API

Przed zapisem w efekcie sprawdź zależności bezpośrednie i pośrednie, np. zapis do źródła `computed`, które efekt czyta. Zapis zmieniający odczytaną zależność może zaplanować kolejny przebieg; bez warunku kończącego może powstać pętla. To nie musi być klasyczna rekurencja na stosie. Zapis tej samej wartości albo aktualizacja z warunkiem stabilizacji nie zawsze tworzy pętlę.

- Wartość pochodna: `computed()`.
- Lokalny wybór, który jest zależny od źródła i ręcznie zmieniany: rozważ `linkedSignal()` dostępny w używanej wersji albo zachowaj uzasadniony wyjątek z [3.7](../SKILL.md#37-computed-i-effect).
- Synchronizacja z imperatywnym API, np. dostępnością Reactive Forms, storage lub biblioteką zewnętrzną: `effect()` z jawną odpowiedzialnością i cleanupem zasobów.
- Requesty, przełączanie źródła i cancelacja: preferuj istniejący pipeline RxJS; nie otaczaj go efektem wyłącznie po to, by inicjalizować subskrypcje.

## Subskrypcje i cleanup

Każde dojście do `.subscribe()` tworzy nową subskrypcję. Ponowne wykonanie efektu nie zamyka poprzedniej automatycznie; długotrwałe subskrypcje mogą się kumulować. Zakończony HTTP nie pozostawia aktywnej subskrypcji, ale następny przebieg może ponowić request.

Jeżeli integracja uzasadnia subskrypcję zależną od każdego przebiegu efektu, powiąż ją z `onCleanup`. Przykład fragmentu callbacka dla zewnętrznej integracji:

```ts
effect((onCleanup: EffectCleanupRegisterFn): void => {
  const id: number = this.selectedId();
  const subscription: Subscription = this.integration.observe(id).subscribe();

  onCleanup((): void => subscription.unsubscribe());
});
```

`onCleanup` sprząta przed kolejnym wykonaniem i przy zniszczeniu efektu. Analogicznie obsługuj timery, listenery i instancje integracji. `takeUntilDestroyed(this.destroyRef)` obejmuje czas życia komponentu, a nie pojedynczy przebieg efektu; nie zastępuje `onCleanup` dla zasobów tworzonych na nowo.

Dla zmiennego identyfikatora zasobu i requestów zwykle czytelniejszy będzie jeden pipeline `toObservable(sourceSignal).pipe(switchMap(...), takeUntilDestroyed(this.destroyRef))`, zarejestrowany raz. `toObservable` wymaga injection context lub jawnego `Injector`: przy tworzeniu w `ngOnInit` przekaż wcześniej wstrzyknięty injector. Zachowaj dotychczasową obsługę błędów i semantykę odświeżania.

Efekt domyślnie jest sprzątany wraz ze swoim kontekstem Angulara. Nie włączaj `manualCleanup` bez jawnego właściciela odpowiedzialnego za `EffectRef.destroy()`.

## Źródła

Weryfikuj szczegóły API i schedulingu w wersji używanej przez projekt:

- [Angular: effect](https://angular.dev/api/core/effect)
- [Angular: zależności sygnałów i untracked](https://angular.dev/guide/signals)
- [Angular: cleanup efektu](https://angular.dev/guide/signals/effect)
- [Angular: cykl życia komponentu](https://angular.dev/guide/components/lifecycle)
- [Angular: takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed)
