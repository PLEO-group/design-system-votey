# Kierunki przejść widoków CRM

Każda nawigacja z uporządkowanym menu musi mieć jawnie określony kierunek przejścia. Kolejność tras ma odpowiadać kolejności pozycji widocznych w menu; nie należy wyprowadzać kierunku z kolejności deklaracji w pliku routes.

## Typy przejść dokumentu

| Typ | Zmiana pozycji | Obszar animacji |
| --- | --- | --- |
| Główne menu | W dół menu: treść wjeżdża od dołu. W górę: od góry. | Główna treść aplikacji. |
| Menu typu `ordered-menu` (`members`, `settings`, głosowania) | W dół menu: treść wjeżdża od dołu. W górę: od góry. | Panel treści oznaczony `data-view-transition-surface="ordered-menu"`; samo menu pozostaje nieruchome. |
| Szczegóły wewnątrz `ordered-menu` | Głębiej: poziomo do przodu. Płycej: poziomo do tyłu. | Ten sam panel treści. |
| Wejście w szczegóły i powrót ze skonfigurowanym `viewTransitionDepth` | Głębiej: poziomo do przodu. Płycej: poziomo do tyłu. | Panel właściwy dla danej ścieżki. |

Ta tabela opisuje wyłącznie przejścia dokumentu/routera. Lokalne przełączanie tabów
jest poza tym systemem: obsługuje je `vt-tabs` przez Angular Material, zgodnie z
sekcją [Lokalne taby oparte na Angular Material](#lokalne-taby-oparte-na-angular-material).
Nie dodawaj lokalnych tabów do metadanych tras ani do koordynatora przejść dokumentu.

## Wymóg przy dodawaniu pozycji menu

1. Na trasie będącej właścicielem menu dodaj metadane `orderedMenuTransition(...)` z `src/app/_animations/ordered-menu-transition.config.ts`. Przekaż tę samą definicję pozycji, z której komponent renderuje `navigationItems`, oraz wariant tła `underlay`, a przy menu zależnym od konkretnego zasobu także `identityParam`. Jeśli techniczna ścieżka należy do innej pozycji menu, wpisz ją w `aliases`; nietypową głębokość szczegółu opisz w `detailDepthOverrides`.
2. W szablonie oznacz wyłącznie zmieniający się panel atrybutem `data-view-transition-surface="ordered-menu"`. Reguł animacji nie kopiuj do SCSS konkretnej sekcji.
3. Oddziel przejścia między pozycjami menu od wejść w szczegóły; w obrębie jednej pozycji wzrost i spadek głębokości trasy wyznaczają ruch poziomy.
4. Dodaj przypadki obu kierunków do `main-navigation-view-transition.spec.ts`. Sprawdź, że przejście nie obejmuje menu, nagłówka aplikacji ani obszaru sąsiedniej sekcji oraz że różne wartości `identityParam` nie są animowane jako jeden kontekst.
5. Zachowaj obsługę `prefers-reduced-motion` i usuwanie atrybutów przejścia po zakończeniu animacji.

Handler i SCSS obsługują typ `ordered-menu` wspólnie. Definicje należą do właścicieli menu; globalny SCSS korzysta z ról powierzchni i elementów stałych. Bez metadanych Angular uruchamia domyślne przenikanie widoków, chyba że użytkownik ograniczył ruch.


## Jedno źródło kolejności

- Definicja pozycji menu steruje renderowaniem i kierunkiem animacji. Nie utrzymuj
  osobnej tablicy identyfikatorów w handlerze, routes ani testach.
- `orderedMenuTransition(items, options)` wyprowadza kolejność z `id` i pomija
  pozycje `back`. Główne menu korzysta z `main-navigation.ts`; definicje podmenu
  pozostają przy feature. Zmiana kolejności wymaga edycji wyłącznie tej definicji.
- Jeśli menu zależy od uprawnień, renderuj pozycje z tej samej definicji; filtrowanie
  nie może zmienić względnej kolejności pozostałych pozycji. Nie kopiuj definicji
  przy tworzeniu wariantu menu.
- Tożsamość zasobu (`identityParam`) zapobiega traktowaniu dwóch różnych zasobów
  jako jednego kontekstu. Aliasy i `detailDepthOverrides` są jawnymi wyjątkami
  obecnego modelu ścieżek; nie zwiększaj liczby wyjątków bez oceny metadanych
  logicznej hierarchii. Obecny handler obsługuje pojedynczy zakres `ordered-menu`;
  przed jednoczesnym montażem zagnieżdżonych zakresów zdefiniuj ich właściciela
  oraz unikalną tożsamość powierzchni.

## Stałe warstwy

Elementy pozostające nad animowaną treścią deklarują na rzeczywiście malowanym
kontenerze `data-view-transition-static`:

| Rola | Przykład | Warstwa |
| --- | --- | --- |
| `frame` | Obramowanie obszaru | 1 |
| `footer` | Aktualnie widoczna stopka | 2 |
| `action` | Dodatkowy pasek akcji | 3 |
| `badge` | Nakładka informacyjna | 4 |

W jednym aktywnym zakresie może być zamontowany tylko jeden element danej roli.
Role obejmują wszystkie warianty stopek, nie tylko pierwszy sprawdzany scenariusz.
Nie dodawaj selektorów domenowych ani odwołań do prywatnej klasy `.footer` do
wspólnego arkusza animacji. Host komponentu z potomkiem `position: fixed` może
mieć zerowy rozmiar; rolę przypisz do potomka stanowiącego rzeczywistą powierzchnię.
Przejścia menu głównego nadal animują cały widok; role stałe dotyczą zakresu podmenu.

## Lokalne taby oparte na Angular Material

`vt-tabs` opakowuje `mat-tab-group`. Material jest właścicielem semantyki ARIA,
klawiatury, focusu, przewijania paska, podkreślenia i poziomych animacji paneli.
Nie implementuj ich ponownie przez ResizeObserver, własne listenery klawiatury
ani document.startViewTransition. Kolejność `items` wyznacza kolejność paneli.

- Zachowane API: `items`, `selectedId`, `ariaLabel`, `selectionChange` oraz
  `VoteyTabItem` z polami `id`, `label`, opcjonalnymi `count` i `disabled`.
- Treść przekazuj przez publiczną `VoteyTabContentDirective` z entry pointu
  `@pleodigital/design-system-votey/angular`. `ng-template vtTabContent let-tab`
  jest wspólnym szablonem z kontekstem taba; `vtTabContent="id"` przypisuje
  konkretny szablon do identyfikatora i ma pierwszeństwo przed wspólnym.
- Panele są tworzone leniwie przez `matTabContent`. Stan danych i formularzy
  wymagający zachowania po opuszczeniu taba przechowuj w konsumencie.
- Konsument odpowiada za requesty, ich anulowanie, ochronę przed spóźnioną
  odpowiedzią oraz lokalny loader i retry. Przełączenie taba animuje wejście do
  jego panelu niezależnie od czasu odpowiedzi; dane pojawiają się w tym panelu.
- Zachowuj osobny model prezentacji dla każdego taba. Wychodzący panel nie może
  odczytywać zmienionej listy, paginacji ani filtrów nowego taba w czasie animacji.
- Nagłówek aplikacji umieść poza `vt-tabs`; Material animuje wyłącznie body.
  Panel ma nieprzezroczyste tło `--color-bg-page`. Padding paska ustawiaj przez
  `--vt-tabs-padding-start` i `--vt-tabs-padding-end`, a sticky header przez
  `--vt-tabs-sticky-top` (domyślnie brak sticky).
- `prefers-reduced-motion` ustawia publiczne `animationDuration` grupy na `0ms`.
  Obsługa zmian media query jest zwalniana wraz z komponentem.
- Material stosuje ręczną aktywację klawiaturą: strzałki zmieniają focus,
  Enter/Space aktywują tab. Nie przywracaj lokalnie automatycznej aktywacji.

Przykład:

```html
<vt-tabs [items]="tabs" [selectedId]="selectedId" ariaLabel="Sekcje"
  (selectionChange)="selectTab($event)">
  <ng-template vtTabContent let-tab>
    <!-- Treść i loader korzystają z modelu właściwego dla tab.id. -->
  </ng-template>
</vt-tabs>
```

Nie dodawaj dla tabów lokalnej animacji opartej na `document.startViewTransition`
ani `VoteyViewTransitionService`. Nie podłączaj jednocześnie Material i animacji
dokumentu do tych samych paneli.

## Koordynacja nawigacji routera

`VoteyViewTransitionService` nadal koordynuje przejścia dokumentu dla routera
przez `adopt(transition, cleanup)` i `cancel()`. Nowa operacja pomija poprzednią
oraz zwalnia jej stan; zakończenie starszej nie sprząta nowej. Lokalny Material
TabGroup nie tworzy przejścia dokumentu i nie korzysta z tego koordynatora.
Fallback routera nadal respektuje brak API i `prefers-reduced-motion`.

## Weryfikacja kontraktu

Testy korzystają z produkcyjnych definicji menu. Pokryj przestawienie pozycji,
wyłączenie pozycji powrotu z kolejności, oba kierunki, różne tożsamości zasobów,
kończenie i sprzątanie przejścia, przejęcie przez nową operację, ograniczony ruch,
spóźnioną odpowiedź i zniszczenie widoku. Sprawdź rzeczywiste publiczne API tabów,
nie zastępuj całego mechanizmu animacji natychmiastowym callbackiem we wszystkich testach.

Testy stanów nie zastępują wizualnego sprawdzenia granic panelu i wszystkich wariantów
stałych warstw. Płynność potwierdzaj pomiarem po serii nawigacji z rozwiniętym oraz
zwiniętym menu; analiza kodu nie potwierdza FPS. Uruchamianie testów i runtime podlega
zgodzie oraz instrukcjom projektu.
