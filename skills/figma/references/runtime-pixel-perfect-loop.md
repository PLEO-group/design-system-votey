# Runtime Pixel-Perfect Loop

Używaj tej referencji, gdy zadanie wymaga dopasowania komponentu lub modułu do Figmy i runtime walidacji przez `chrome-debug` / Playwright. Ten workflow jest iteracyjny: Figma jest źródłem prawdy, a przeglądarka potwierdza realny efekt po CSS, fontach, CMS, breakpointach i layout utilities projektu.

## Spis treści

- [Intake Contract](#intake-contract)
- [Route Placement Contract](#route-placement-contract)
- [Module Selector Contract](#module-selector-contract)
- [Collection State Contract](#collection-state-contract)
- [Figma Read](#figma-read)
- [Breakpoint Acceptance Ledger](#breakpoint-acceptance-ledger)
- [Follow-up Fast Path](#follow-up-fast-path)
- [Conservative Visual Tuning](#conservative-visual-tuning)
- [Implementation Rules](#implementation-rules)
- [Chrome-Debug Loop](#chrome-debug-loop)
- [Stop Conditions](#stop-conditions)
- [Final Acceptance Report](#final-acceptance-report)

## Intake Contract

Przed rozpoczęciem loopa agent musi znać albo ustalić:

- route/podstronę, na której moduł renderuje się w aplikacji, np. `/`, `/about`, `/locale/page`;
- dokładne Figma node'y albo specyfikację wskazującą node'y dla wymaganych breakpointów;
- nazwę modułu/feature'a, jeśli jest znana;
- czy walidacja dotyczy jednego języka/wariantu czy kilku wariantów contentu.

Jeśli route nie jest podany i nie wynika jednoznacznie z taska, dokumentacji, danych aplikacji albo routingu repo, zapytaj użytkownika o podstronę. Nie zaczynaj runtime loopa na zgadywanej trasie.

## Route Placement Contract

Jeśli moduł jest dodawany, przenoszony, usuwany z części tras albo ma zająć konkretną pozycję na stronie, przed edycją
kodu lub CMS zapisz macierz:

```text
Route placement:
- required: <route + locale/wariant + owner dokumentu + expected count + pozycja/anchor>
- forbidden: <route + locale/wariant + expected count=0>
- shared owner / reference: ...
```

Nie utożsamiaj podobnych prefiksów tras ani wspólnego layoutu z tym samym dokumentem CMS. Ustal faktycznego ownera
treści przez routing, query i stabilną tożsamość dokumentu. Jeśli pozycja ma być „ostatnia”, zapisz postcondition jako
ostatni indeks tablicy modułów, a nie tylko obecność modułu.

Po mutacji wykonaj read-after-write dla każdego ownera, a w runtime sprawdź stabilnym selektorem wszystkie wpisy
`required` i `forbidden`. Nie zamykaj loopa, jeśli moduł istnieje na poprawnej trasie, ale pozostał również na trasie
zabronionej albo ma złą pozycję.

## Module Selector Contract

Agent musi mieć stabilny sposób znalezienia modułu w DOM.

Kolejność:

1. Użyj istniejącego stabilnego identyfikatora modułu, np. CMS reference anchor, wrapper `id`, `_key`, `data-*` albo semantyczny landmark.
2. Jeśli istniejący selector jest kruchy, np. oparty wyłącznie o tekst, dodaj techniczny identyfikator w najmniejszym sensownym miejscu.
3. Preferuj `data-module`, `data-testid`, `data-sanity-key` albo podobny techniczny atrybut.
4. Używaj publicznego `id` tylko wtedy, gdy ma znaczenie produktowe: anchor, nawigacja, deep link albo identyfikator z CMS.

Przykład:

```tsx
<section data-module="module-name">
```

Jeśli komponent jest renderowany przez globalny content renderer, najpierw sprawdź czy renderer może dostarczyć stabilny wrapper modułu. Nie dodawaj identyfikatora w kilku miejscach naraz.

## Collection State Contract

Jeśli moduł zawiera grid, listę, slider albo paginację, przed walidacją ustal osiągalne stany danych i interakcji:

```text
Collection states:
- loading: required | not applicable
- empty / error: required | not applicable
- cardinality: 1, initial batch, load-more slot, first batch after load
- scroll axis per breakpoint: ...
- focus target after update: ...
```

Nie wyprowadzaj geometrii pojedynczego elementu z szerokości aktualnie dostępnej kolekcji. Element ma zachować kontrakt
kolumny również wtedy, gdy danych jest mniej niż slotów. Dla pełnej macierzy runtime użyj sekcji `Kolekcje: liczebność
i stabilność layoutu` oraz `Zagnieżdżony scroll, doładowanie i focus` ze skilla `chrome-debug`.

## Figma Read

1. Wykonaj `references/mcp-guard.md`.
2. Odczytaj dokładne node'y przez `get_design_context`; użyj `get_metadata` albo screenshotu tylko jako fallback dla tego samego zakresu.
3. Dla desktop/tablet/mobile odczytuj każdy breakpoint jako osobny zakres.
4. Klasyfikuj dane jako `verified`, `partial` albo `blocked` zgodnie z głównym `SKILL.md`.
5. Do pixel-perfect implementacji używaj tylko wartości `verified`.

Przed kodowaniem zapisz roboczy target porównania: rozmiar frame'a, pozycje i rozmiary layout-driving elementów, typografię, spacingi, kolory, promienie i zachowanie media.

## Breakpoint Acceptance Ledger

Jeśli zakres obejmuje co najmniej dwa breakpointy, utwórz ledger przed pierwszą walidacją runtime:

```text
Breakpoint ledger:
- desktop: pending
- tablet: pending
- mobile: pending
```

Odczyt Figmy może być równoległy, ale akceptację runtime prowadź po jednym breakpoincie. Stosuj stany:

- `pending` — jeszcze niezweryfikowany,
- `verified` — zgodny w ramach tolerancji i bez regresji chronionego baseline'u,
- `needs-recheck` — późniejsza zmiana wspólnego kodu mogła naruszyć wynik,
- `blocked` — brak danych albo środowiska uniemożliwia akceptację.

Po zaakceptowaniu breakpointu traktuj jego wynik jako baseline dla dalszej pracy. Jeśli kolejna poprawka zmienia wspólny
DOM, bazowy styl, utility layoutowe, token, selektor albo logikę responsywną używaną przez wcześniejszy breakpoint,
zmień jego status z `verified` na `needs-recheck`. Zmiana wyłącznie breakpoint-specific nie wymaga ponownej walidacji,
jeśli brak wpływu wynika jednoznacznie z zakresu reguły i diffu.

Nie kończ loopa z wymaganym breakpointem w stanie `pending` albo `needs-recheck`.

## Follow-up Fast Path

Po pełnym preflighcie i przynajmniej jednej zweryfikowanej iteracji możesz re-użyć base URL, PID/ownera, route,
selector modułu, viewport, dependency status, freshness marker i breakpoint ledger zgodnie z sekcją `Follow-up fast
path` skilla `chrome-debug`.

Używaj tej ścieżki tylko dla małej korekty w tym samym flow, gdy nie zmieniły się serwer, route, CMS/API, struktura
DOM selektora ani współdzielony prymityw. Po edycji nadal wykonaj reload, potwierdź świeżość bieżącej zmiany i sprawdź
target wraz z zależnymi invariants. Pełny preflight uruchom ponownie po zmianie środowiska, danych, DOM, shared primitive,
po utracie markera świeżości albo gdy blast radius przestał być lokalny.

## Conservative Visual Tuning

Gdy użytkownik daje kierunkowy, subiektywny feedback bez dokładnej wartości z Figmy, oznacz zmianę jako świadomy
`user-directed override`, a nie jako dowód pixel-perfect. Jeśli istnieje zweryfikowany target z Figmy, użyj jego
wartości zamiast heurystyki.

Przed korektą zapisz:

```text
Visual tuning:
- property / scope:
- before:
- direction albo accepted/rejected bounds:
- planned delta:
- source: Figma | user-directed override
```

Dla pierwszej korekty kierunkowej wybierz najbliższy sąsiedni token skali projektu albo konserwatywną zmianę rzędu
10-20% bieżącej wartości lub zakresu. Jeśli znasz jedną wartość zaakceptowaną i jedną odrzuconą, wybierz punkt pośredni
i zawężaj zakres zamiast skakać poza znane granice. Dokładna wartość podana przez użytkownika ma pierwszeństwo.
Po każdej zmianie zapisz `before -> after` i wykonaj skoncentrowaną walidację runtime właściwego scope'u.

## Implementation Rules

- Najpierw sprawdź istniejące globalne mechaniki projektu: layout utilities, grid/container, breakpointy, design tokens, media components i content renderer.
- Preferuj lokalne prymitywy projektu, np. container utilities, responsive spacing helpers, tokeny kolorów i istniejące komponenty, zamiast kopiować generated code z Figmy.
- Dla kolekcji zachowaj geometrię slotu niezależnie od liczby elementów i uwzględnij kontrolkę `load more` jako slot,
  jeśli tak renderuje ją projekt.
- Nie ustawiaj sztywnej wysokości modułu, jeśli wysokość może wynikać z treści, proporcji media i flow layoutu.
- Jeśli Figma pokazuje fixed frame height, traktuj ją jako expected rendered height po złożeniu layoutu, nie automatycznie jako klasę `height`.
- Jeśli media z CMS ma inne ratio niż frame w Figmie, rozwiąż to jawnie: komponent media może zachować intrinsic ratio domyślnie, a konkretny moduł może ustawić ratio frame'a z makiety.
- Jeśli content w innym języku lub wariancie zmienia liczbę linii i psuje układ, nazwij to problemem content/layout fit. Nie maskuj tego przypadkowym zmniejszaniem fontu bez decyzji.

## Chrome-Debug Loop

1. Wczytaj i wykonaj pełny preflight skilla `chrome-debug`; w późniejszej drobnej iteracji użyj follow-up fast path tylko wtedy, gdy spełnia wszystkie warunki. Pełny preflight obejmuje:
   - MCP/CLI path selection,
   - reuse istniejącego dev servera i owner process/workspace check,
   - status bazowego URL oraz target route,
   - sandbox-aware escalation dla Playwright CLI, jeśli środowisko tego wymaga,
   - dependency status dla CMS/API/backendu.
2. Użyj działającego lokalnego URL z preflightu albo uruchom dev server dopiero wtedy, gdy preflight potwierdzi, że aplikacja nie działa.
3. Po zmianie kodu, CMS albo API wybierz freshness marker, np. stabilny selektor, oczekiwany content, revision dokumentu albo build marker. Status `200` bez markera nie potwierdza świeżego runtime.
4. Jeśli marker jest nieobecny, wykonaj ścieżkę freshness ze `skills/chrome-debug/references/setup-checklist.md`: ustal cache/proces/port, bezpiecznie odśwież lub uruchom serwer tymczasowy i zanotuj PID do cleanupu.
5. Sprawdź, czy route odpowiada, freshness marker jest obecny i zależności runtime, np. content API, CMS albo backend, zwracają potrzebne dane.
6. Otwórz route w Playwright na wymaganych viewportach.
7. Znajdź moduł stabilnym selektorem z `Module Selector Contract`.
8. Zapisz screenshot modułu oraz metryki DOM dla layout-driving elementów:
   - root section/container,
   - tag/badge albo inny element identyfikujący sekcję,
   - heading,
   - description/body,
   - media,
   - CTA lub inne kluczowe elementy, jeśli występują.
9. Porównaj metryki z Figmą.
10. Popraw kod.
11. Zaktualizuj ledger i oznacz zależne wcześniejsze breakpointy jako `needs-recheck`, jeśli poprawka dotyka wspólnego kodu.
12. Odśwież stronę, ponownie potwierdź freshness marker i powtarzaj loop aż różnice mieszczą się w tolerancji albo pojawi się blocker.
13. Zweryfikuj ponownie każdy breakpoint ze statusem `needs-recheck`.
14. Po walidacji zatrzymaj wyłącznie tymczasowy proces uruchomiony przez bieżący flow; nie ubijaj zastanego serwera.

Minimalna tolerancja dla pixel-perfect:

- pozycje i rozmiary layout-driving elementów: 0-2 px różnicy;
- typografia: zgodna rodzina, waga, size i line-height;
- media: zgodne położenie, rozmiar, radius i object-fit;
- brak incoherent overlapów i brak uciętego tekstu.

Jeśli projekt używa responsywnych jednostek zależnych od bazowego viewportu, waliduj na viewportach odpowiadających bazom projektu, a nie tylko na szerokości frame'a z Figmy.

## Stop Conditions

Zatrzymaj pracę i raportuj konkretny blocker, jeśli:

- Figma MCP nie działa po fallbackach z `mcp-guard`;
- `chrome-debug` / Playwright nie działa i nie ma akceptowalnego fallbacku;
- route nie jest znany i nie da się go ustalić z repo;
- content API, CMS albo backend nie zwraca danych potrzebnych do renderu;
- modułu nie da się jednoznacznie znaleźć w DOM bez decyzji o dodaniu stabilnego selektora;
- dane z Figmy dla krytycznych właściwości są `partial` albo `blocked`;
- różnica wynika z treści/contentu, której agent nie powinien sam zmieniać.

## Final Acceptance Report

Na końcu podaj krótko:

- route'y i breakpointy zweryfikowane w runtime;
- wynik macierzy route placement, w tym trasy zabronione i wymagana pozycja modułu;
- końcowy breakpoint ledger, w tym ponowne weryfikacje po zmianach wspólnych;
- wynik wymaganych stanów kolekcji, jeśli moduł renderuje listę, grid, slider albo paginację;
- użyty base URL oraz czy dev server został zreusingowany czy uruchomiony;
- freshness marker i wynik jego sprawdzenia;
- PID/owner oraz potwierdzenie cleanupu, jeśli uruchomiono serwer tymczasowy;
- użyty tryb przeglądarki: MCP albo Playwright CLI, z informacją o eskalacji jeśli była potrzebna;
- screenshoty albo ścieżki do screenshotów, jeśli powstały;
- najważniejsze metryki zgodne z Figmą;
- wynik console errors;
- wynik lint/testów dla dotkniętych plików;
- świadome odstępstwa od Figmy, jeśli istnieją.

Nie deklaruj pixel-perfect, jeśli jakikolwiek krytyczny zakres był nieweryfikowany albo oparty na zgadywaniu.
