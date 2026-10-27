# Warunkowe playbooki Angular Code Standards

Wczytuj tylko sekcję odpowiadającą bieżącej zmianie. Nie ładuj całego pliku przy prostej zmianie SCSS albo typów, jeśli nie zachodzi żaden warunek opisany w routingu głównego `SKILL.md`.

## Spis treści

- [3.13 Refaktor UI bez regresji kontraktu](#313-refaktor-ui-bez-regresji-kontraktu)
- [3.14 Widoki tabelaryczne, listy i layout kolekcji](#314-widoki-tabelaryczne-listy-i-layout-kolekcji)
- [3.15 Istniejące komponenty UI oparte o biblioteki](#315-istniejące-komponenty-ui-oparte-o-biblioteki)
- [3.16 Powtarzalne stringi kontraktowe](#316-powtarzalne-stringi-kontraktowe)
- [3.17 Discovery przed lokalnymi mechanizmami sprawdzającymi](#317-discovery-przed-lokalnymi-mechanizmami-sprawdzającymi)

- [3.18 Rozszerzanie istniejącej funkcjonalności o wariant](#318-rozszerzanie-istniejącej-funkcjonalności-o-wariant)
- [3.19 Kontekst operacji asynchronicznych](#319-kontekst-operacji-asynchronicznych)
- [3.20 Koszt pobierania danych pomocniczych](#320-koszt-pobierania-danych-pomocniczych)

## 3.13 Refaktor UI bez regresji kontraktu

Gdy zastępujesz istniejący fragment UI nowym komponentem, modalem, formularzem, listą, tabelą albo innym widokiem, przed edycją odtwórz z kodu kontrakt zachowania:

- własność stanu: parent/container, child komponent, formularz, store albo serwis,
- inputy, outputy, kontrolki formularza, selektory, serwisy i eventy,
- shape danych zapisywanych do formularza, store, local state albo requestu,
- zasady enabled, disabled, readonly, selected, loading, empty, error i data,
- dokładny trigger interakcji: row, checkbox, radio, button, link, menu albo skrót klawiaturowy,
- redirecty, linki otwierane w nowym oknie, tooltipy, ikony, komunikaty i aria/keyboard behavior,
- kontrakt refreshu danych po mutacji albo zmianie filtrów.

Refaktor frontend-only nie może zmienić shape obiektu wysyłanego dalej do requestu ani wartości zapisanej w istniejącej kontrolce formularza, chyba że użytkownik jawnie tego chce.

W kolejnych iteracjach uwzględnij także zachowania już zaakceptowane w rozmowie. Przed poprawką wskaż tylko invariants, na które realnie wpływa diff. Jeśli nowa propozycja wycofuje takie zachowanie, nazwij konflikt i uzyskaj decyzję, chyba że użytkownik już jawnie polecił jego zmianę. Przykład: naturalna wysokość zawartości może kolidować ze stabilnym położeniem akcji podczas zmiany stanu; usunięcie stałego wymiaru nie jest automatycznie poprawą obu wymagań.

Dla widoków kolekcji, niezależnie od prezentacji jako tabela, lista, kafle, drzewo, stepper albo virtual scroll:

- najpierw zachowaj model danych, selekcję, disabled rules, uprawnienia i nawigację,
- nie zmieniaj triggera wyboru ani zakresu klikalności bez jawnej decyzji,
- sprawdź zachowanie dla elementów enabled, disabled, pustych, ładowanych i po błędzie,
- po zmianie usuń martwe inputy, outputy, metody, helpery i style starego widoku.

Jeśli nowy projekt UI wymaga zmiany kontraktu interakcji, potraktuj to jako zmianę funkcjonalną i potwierdź ją ze specyfikacją albo użytkownikiem.

Edge case: dla list filtrowanych, sortowanych, przeładowywanych albo wirtualizowanych nie używaj `track $index`; wybierz stabilne `id`, `uuid`, slug albo inny niezmienny klucz domenowy.

### Domknięcie refaktoru HTML i SCSS

Po zmianie przejdź przez cały dotknięty template i lokalny arkusz, nie tylko nowe linie. Zastąp klasy opisujące wyłącznie mechanikę układu (np. `flex`, `layout-5`) klasami nazwanymi według roli elementu lub zawartości. Układ i wygląd komponentu trzymaj w jego SCSS, zgodnie z rzeczywistą hierarchią HTML. Samo zastąpienie tagu albo owinięcie treści w `div` nie kończy migracji. Usuń nieużywane selektory, klasy i importy po sprawdzeniu wszystkich stanów warunkowych template.

### Granice komponentu wielokrotnego użytku

Gdy powtarzalny wybór składa się z kilku opcji o wspólnej prezentacji, rozważ jeden komponent grupy z typowaną konfiguracją opcji zamiast osobnej deklaracji komponentu dla każdego kafelka. Komponent grupy odpowiada za renderowanie opcji, wybór i wspólną ramę panelu szczegółów; treść zależna od opcji może pochodzić z przypisanego do niej `TemplateRef`/`ng-template`. Właścicielem stanu domenowego, formularzy, walidacji i payloadu pozostaje kontener. Nie uogólniaj pojedynczego, niepowtarzalnego widoku tylko dla samej abstrakcji.

### Formularz w siatce i regresja edycji

Jeżeli refaktor zmienia kolumny formularza, nadaj obszarom klasy wynikające z pól i funkcji sekcji, a warianty siatki powiąż z rzeczywiście obecnymi polami. Sprawdź rzeczywistą szerokość kontenera, długie wartości i komunikaty błędów; elementy siatki z treścią powinny móc się zwężać (`min-width: 0`).

W trybie edycji sprawdź przepływ w obie strony: odpowiedź API → stan formularza i widoczne dane, także po zamknięciu i ponownym otwarciu; następnie zmiana pól → walidacja → payload zapisu. Uwzględnij zmianę wyboru, reset pól zależnych, disabled/readonly, istniejące załączniki i stan po zapisie, jeśli występują w danym widoku. Walidacja unikalności istniejącego rekordu powinna ignorować jego własną tożsamość, ale nadal wykrywać kolizję z innym rekordem; przetestuj oba przypadki, gdy taka walidacja jest częścią formularza.

Po zmianie API komponentu zaktualizuj testy i harnessy do rzeczywistego kontraktu zamiast pozostawiać wywołania usuniętych metod lub osłabiać asercje. Przy ryzykownej zmianie obejmującej kontener, projekcję treści i formularz dodaj test integracyjny z prawdziwym template, obok testów jednostkowych logiki. Asercje powinny obejmować warunki widoczności, wartości początkowe, interakcje i dokładny kształt payloadu.

## 3.14 Widoki tabelaryczne, listy i layout kolekcji

Domyślnie używaj komponentów tabel, list, paginacji, filtrów, sortowania i empty/loading state z Design System albo z istniejących wzorców projektu. Nie buduj własnego header/body grid, jeśli DS table pokrywa wymagania.

Dla tabel Design System:

- używaj publicznego API komponentu, definicji kolumn, slotów, inputów i eventów,
- trzymaj sortowanie, filtrowanie, paginację i akcje w modelu zgodnym z lokalnym wzorcem,
- nie nadpisuj internali wierszy, headerów, radio/checkboxów ani hoveru, jeśli da się użyć wariantu albo konfiguracji DS,
- stany initial, loading, empty, error i data realizuj wzorcem komponentu albo lokalnym komponentem stanu używanym w module.

Custom table-like layout, CSS grid albo `cdk-virtual-scroll-viewport` stosuj wtedy, gdy DS nie wspiera wymaganego zachowania, istniejący moduł ma taki wzorzec albo wymaganie interakcji tego potrzebuje. Wtedy jawnie ustal:

- szerokość kontenera, padding poziomy i model kolumn,
- zachowanie przy węższym kontenerze i długich treściach,
- `min-width: 0` dla komórek z tekstem,
- `align-items: center` dla wierszy,
- wysokość wiersza zgodną z `itemSize`,
- `flex: 1` / `min-height: 0` dla viewportu,
- czy ostatnia kolumna ma wystarczającą szerokość dla akcji.

W custom grid header i body muszą używać tego samego modelu kolumn oraz tego samego paddingu poziomego. Nie używaj twardych szerokości `px` dla całej siatki, jeśli realny kontener może być węższy niż frame z Figmy.

## 3.15 Istniejące komponenty UI oparte o biblioteki

Gdy zmieniasz zachowanie istniejącego komponentu UI opartego o bibliotekę, np. select, autocomplete, datepicker, table, tree, menu albo virtual scroll, najpierw rozdziel zmianę na:

- kontrakt danych i formularza,
- stan komponentu, np. selected, marked, disabled, readonly, loading,
- minimalny styl potrzebny dla nowego stanu.

Jeśli użytkownik prosi o zachowanie dotychczasowego wyglądu, nie przebudowuj template i nie zmieniaj stylów selected/hover/default tylko dlatego, że dodajesz disabled, readonly albo blokadę akcji.

Przed zmianą SCSS dla selected/hover/disabled sprawdź:

- czy lista `items` ma stabilne referencje i nie jest tworzona od nowa w getterze używanym w template,
- czy `bindValue`, `bindLabel`, `compareWith`, `trackBy` albo lokalny odpowiednik są zgodne z wartością formularza,
- czy stan selected/marked/disabled wynika z danych komponentu biblioteki, a nie z ręcznie odtworzonego template,
- czy nowy stan disabled nie nadpisuje istniejącego selected albo hover dla elementów, które nadal mają być aktywne.

Jeśli poprawka dotyczy tylko zablokowania opcji albo akcji, preferuj publiczny stan danych/API komponentu, np. `disabled: true`, `readonly`, `compareWith`, stabilną listę opcji albo konfigurację komponentu. Własny `ng-template`, ręczne klasy opcji albo override internali dodawaj dopiero wtedy, gdy publiczne API nie wystarcza.

Po zmianie sprawdź osobno:

- opcję aktywną i wybraną,
- opcję aktywną pod hoverem,
- opcję disabled,
- opcję jednocześnie selected i disabled, jeśli taki stan jest możliwy.

## 3.16 Powtarzalne stringi kontraktowe

Nie porównuj w kodzie do powtarzalnych stringów opisujących kontrakt FE/BE, stan domenowy, kod języka, status, typ, rolę, tryb, permission albo wartość słownikową.
Jeśli literal występuje w kilku miejscach albo może być częścią kontraktu z backendem, użyj istniejącego enuma, typowanej stałej `as const` albo union type z jednego źródła prawdy.

Preferowana kolejność:

1. użyj istniejącego enuma/modelu z `_models`, `enum`, `types` albo lokalnego kontraktu API,
2. jeśli go nie ma, dodaj mały enum albo typowaną stałą blisko domeny, w osobnym pliku modelu, jeśli taki wzorzec istnieje,
3. literal zostaw tylko dla jednorazowej wartości lokalnej, która nie jest kontraktem i nie powtarza się w logice.

Przykład niedopuszczalny dla powtarzalnego kontraktu:

```ts
if (normalizedLanguage !== 'pl') {
  void this.loadLanguage('pl');
}
```

Preferuj:

```ts
if (normalizedLanguage !== LanguageEnum.polish) {
  void this.loadLanguage(LanguageEnum.polish);
}
```

Jeśli w skrajnym przypadku porównanie do pojedynczego stringa wydaje się dopuszczalne, ale wartość wygląda na kontraktową albo może wrócić w kolejnych miejscach, dopytaj użytkownika o decyzję zamiast samodzielnie utrwalać literal.

## 3.17 Discovery przed lokalnymi mechanizmami sprawdzającymi

### Sprawdzenie znaczenia danych

Potwierdź niejasne znaczenie używanych identyfikatorów i relacji w najbliższym istniejącym przepływie lub modelu FE; sama nazwa pola albo zgodny typ liczbowy nie dowodzi, że identyfikator należy do zasobu danego endpointu. Nie wymagaj mapy kontraktu, raportu ani przeglądu repo BE przy każdej zmianie logiki.

Nie ograniczaj reguły dotyczącej całej kolekcji do pierwszego znalezionego typu. Sprawdź reprezentację każdego typu występującego w danym przepływie oraz jego właściwe pole decydujące. Jeżeli znaczenie relacji lub pola pozostaje nieznane, sprawdź najbliższe użycia i modele zamiast implementować domysł.

Jeżeli uzupełnienie brakujących danych prowadzi do kosztownego przepływu, zastosuj 3.20 przed jego implementacją.

Osobno ustal aktualność danych: użycie istniejącego stanu, cache albo odświeżenie na akcję. Jeśli odpowiedź nadrzędnego zasobu zawiera komplet wymaganych pól, rozważ jedno odświeżenie tego zasobu zamiast requestów dla każdego elementu. Nie dodawaj odświeżenia automatycznie, gdy wymaganie aktualności z niego nie wynika.

Po edycji sprawdź pokryte typy i pola reguły. Jeżeli wcześniej zidentyfikowano kosztowny przepływ, porównaj faktyczny koszt z wybranym rozwiązaniem, także przy ponownym kliknięciu i retry; odróżnij analizę kodu od uruchomionej weryfikacji.

Przed dodaniem własnego mechanizmu, który waliduje, sprawdza, klasyfikuje albo ogranicza dane, najpierw przeprowadź bramkę konieczności, a dopiero potem discovery w projekcie i używanych bibliotekach. Dotyczy to między innymi validatorów formularzy, checkerów, predykatów, guardów wartości, funkcji normalizujących oraz pomocniczych reguł poprawności.

### Bramka konieczności

Potwierdź, że sprawdzana reguła wynika z co najmniej jednego realnego źródła:

- wymagania biznesowego albo kryterium akceptacji,
- kontraktu backendowego,
- realnej ścieżki danych dostępnej użytkownikowi,
- udokumentowanego ograniczenia komponentu lub biblioteki,
- potwierdzonego błędu albo scenariusza regresji.

Sprawdź, czy błędny stan jest osiągalny przez publiczny kontrakt komponentu lub formularza. Nie dodawaj mechanizmu wyłącznie dla teoretycznych wartości JavaScript, których użytkownik nie może wprowadzić, gdy użyty komponent, jego `ControlValueAccessor`, typ inputu albo istniejąca normalizacja już eliminuje je ze zwykłego flow.

Brak gotowego rozwiązania w frameworku, Design Systemie albo projekcie nie uzasadnia utworzenia lokalnego validatora. Jeżeli reguła nie przejdzie bramki konieczności, nie implementuj jej.

Nie dodawaj testu sztucznego, nieosiągalnego przypadku wyłącznie po to, aby uzasadnić nowy kod produkcyjny. Testuj zachowanie dostępne przez publiczny kontrakt komponentu lub formularza.

### Discovery

Szukaj po zachowaniu i regule biznesowej, nie tylko po planowanej nazwie. Sprawdź kolejno:

1. publiczne API frameworka, Design Systemu albo używanej biblioteki,
2. istniejące rozwiązania współdzielone w projekcie, takie jak validatory, utile, stałe, dyrektywy i helpery,
3. rozwiązania w tym samym feature lub domenie, które można bezpiecznie rozszerzyć bez zmiany ich obecnej semantyki,
4. czy reguła jest na tyle ogólna i prawdopodobna do ponownego użycia, że powinna trafić do współdzielonej lokalizacji zamiast do pojedynczego komponentu.

Stosuj następującą kolejność decyzji:

- nie dodawaj mechanizmu, jeżeli reguła nie wynika z realnego kontraktu albo błędny stan nie jest osiągalny,
- użyj istniejącego zachowania Angulara, HTML lub Design Systemu, jeżeli już zabezpiecza wymagany przypadek,
- użyj istniejącego rozwiązania, jeśli dokładnie pokrywa wymaganą semantykę,
- rozszerz istniejące rozwiązanie, jeśli da się zachować kompatybilność i czytelne API,
- utwórz rozwiązanie współdzielone, jeśli reguła jest niezależna od konkretnego widoku lub domeny i ma realny potencjał wielu konsumentów,
- zostaw implementację lokalną tylko wtedy, gdy wymagana reguła jest rzeczywiście specyficzna dla jednego flow albo współdzielona abstrakcja byłaby sztuczna i utrudniała zrozumienie kodu.

Nie twórz kilku prawie identycznych lokalnych sprawdzaczy. Nowe rozwiązanie współdzielone powinno mieć neutralną nazwę, minimalne API bez zależności od konkretnego komponentu oraz testy obejmujące wartości graniczne i niepoprawne dane.

Discovery nie oznacza automatycznego uogólniania. Nie używaj istniejącego rozwiązania o podobnej nazwie, jeśli ma inną semantykę, i nie przenoś jednorazowej prostej reguły do shared bez realnej korzyści z reużycia.


## 3.18 Rozszerzanie istniejącej funkcjonalności o wariant

Przy dodawaniu typu, trybu albo wariantu najpierw odczytaj najbliższy istniejący przepływ i zapisz krótką mapę:

- wspólne elementy: formularz, serwis, akcje, walidacja, stan, UI i payload;
- właściciele odpowiedzialności: FE, BE, Design System oraz źródło treści;
- konieczne różnice wynikające z potwierdzonego kontraktu albo decyzji użytkownika;
- dotknięte dotychczasowe warianty, w tym warunkowe sekcje, które mają zachować zachowanie;
- najwęższy zakres weryfikacji nowego wariantu i reprezentatywnych starych wariantów.

Preferuj rozszerzenie istniejącego wzorca. Osobny serwis, formularz, komponent albo skopiowany blok wymaga konkretnego uzasadnienia w kontrakcie lub czasie życia; sama nazwa nowego typu nie wystarcza. Nie wymuszaj też wspólnej abstrakcji, jeżeli zaciera potwierdzone różnice lub zwiększa zakres refaktoru.

Współdzielenie prezentacji nie oznacza wspólnej tożsamości stanu: sprawdź klucze preferencji, routing, cache i formularze dla niezależnych wariantów. Potwierdź najbliższy wzorzec także w rodzicu i serwisie, nie tylko po podobieństwie template'u. Jeśli kontrakt przypisuje obliczenia albo eksport BE, brak endpointu lub pola zgłoś jako lukę; nie odtwarzaj ich w FE bez jawnej decyzji. Analogicznie nie dodawaj elementu UI tylko dlatego, że wydaje się przydatny, gdy nie wynika z uzgodnionych wymagań.

Zachowaj stare warunki widoczności, kolejność istotnych sekcji, dostępność kontrolek, walidację i payloady. Nie migruj działającego przepływu na inny model asynchroniczny ani API tylko przy okazji dodawania wariantu, jeśli nie jest to potrzebne do zadania.

Walidację dobierz do współdzielonej powierzchni zmiany: nowy wariant oraz stare warianty, które różnią się istotnym warunkiem. Nie wymagaj pełnej suity ani całego repo. Stosuj istniejące zasady zgody na uruchomienie; bez runtime nie deklaruj potwierdzenia wyglądu na podstawie testów logiki.

## 3.19 Kontekst operacji asynchronicznych

Stosuj, gdy podczas oczekiwania na request, potwierdzenie lub modal użytkownik może zmienić zasób, zakładkę, uprawnienia albo zamknąć widok. Nie dodawaj guardów dla stanów nieosiągalnych w rzeczywistym przepływie.

### Czytelna sekwencja i ponawianie

- Zależne etapy operacji przedstaw jako jawną sekwencję Observable albo `async`/`await`, zgodną z istniejącym kontraktem. Nie wywołuj ponownie nadrzędnego handlera zapisu tylko dlatego, że poprzedni etap miał zmienić flagę i ominąć jego początkową gałąź. Nazwij kolejny etap lub skomponuj go w pipeline.
- Przed dodaniem callbacka wykonawczego, obiektu kontekstu lub kolejnego wrappera ustal jego realną odpowiedzialność. Jeden właściciel wykonania i blokady powinien być widoczny w przepływie; nie przekazuj tej samej operacji przez kilka warstw bez korzyści domenowej lub reużycia. Nie uogólniaj na siłę operacji o różnych kontraktach.
- Dla retry określ, które etapy zakończyły się sukcesem. Ponawiaj nieudany etap, bez ponownej mutacji już zapisanych danych, chyba że kontrakt jawnie przewiduje idempotentne powtórzenie całości. Zachowaj blokadę wielokrotnego submitu; `switchMap` nie zastępuje takiej blokady dla mutacji.
- Odróżniaj zakończenie źródła, anulowanie przy zniszczeniu widoku i anulowanie po zmianie zasobu. `defer` odracza utworzenie operacji; nie ogranicza liczby emisji. HTTP zwykle samo się kończy, a `take(1)` czeka na pierwszą emisję i nie zastępuje wcześniejszego anulowania. Nie dodawaj operatorów mechanicznie ani nie usuwaj ochrony kontekstu tylko dlatego, że niższa warstwa już ma `take(1)`.

### Tożsamość zasobu i stan operacji

- Ustal tożsamość zasobu przy rozpoczęciu operacji; mutację kieruj na ten sam zasób, zamiast ponownie odczytywać globalnie wybrany identyfikator po oczekiwaniu.
- Przed kolejną mutacją po `await` lub zamknięciu modala sprawdź aktualne uprawnienia i kontekst. Sprawdzenie wyłącznie przy otwieraniu modala nie wystarcza.
- Spóźniony sukces, błąd lub `finalize` nie może nadpisać formularza, komunikatu ani blokady innej operacji. Sama równość ID nie wystarcza, jeżeli można opuścić i ponownie otworzyć ten sam zasób; ustal, czy potrzebna jest tożsamość konkretnego otwarcia lub operacji.
- Zmiana zasobu może resetować draft; odświeżenie tego samego zasobu nie powinno go kasować bez potwierdzonej reguły. Określ, jak odpowiedź współgra ze zmianami wykonanymi podczas oczekiwania.
- Dobierz provider scope do właściciela i czasu życia stanu. Stan jednej strony nie wymaga `root`; serwis współdzielony przez jej zakładki powinien przeżyć zmianę zakładki, lecz nie pozostawać globalnie bez potrzeby.
- Jedna blokada ma jednego właściciela. Rozdziel blokady niezależnych operacji, jeśli kontrakt pozwala je wykonywać równolegle, bez ręcznie synchronizowanych kopii flag.
- `takeUntilDestroyed` sprząta zasoby przy zniszczeniu, lecz nie zastępuje ochrony przed zmianą kontekstu. `switchMap` stosuj do zastępowalnych odczytów; anulowanie subskrypcji mutacji nie gwarantuje cofnięcia zapisu na BE.

Dla osiągalnych ryzyk przygotuj najwęższe testy: zmiana zasobu podczas oczekiwania, odebranie uprawnienia przed potwierdzeniem, spóźniona odpowiedź i przywrócenie właściwej blokady. Zachowaj istniejącą bramkę autoryzacji uruchomienia testów.

## 3.20 Koszt pobierania danych pomocniczych

Przy listach pomocniczych, selektorach, inicjalizacji wielu źródeł, pobieraniu szczegółów elementów kolekcji oraz odświeżaniu do walidacji lub akcji użytkownika ustal liczbę requestów na wejściu, przy pierwszej interakcji, wyszukiwaniu, ponownym otwarciu i retry. Wystarczy krótka analiza lokalnego przepływu; nie rób benchmarku ani pełnego audytu bez potrzeby.

Wyzwalaczem rozmowy o kontrakcie BE jest konkretny koszt planowanego rozwiązania: request dla każdego elementu, pobranie dużego zbioru lub ciężkich szczegółów tylko po pojedynczą flagę, powtarzane pobrania albo kosztowne przetwarzanie danych po stronie FE. Przed implementacją nazwij problem, oszacuj koszt (np. N requestów na kliknięcie) i zaproponuj tańsze podejście. Gdy brakuje danych, rozważ rozszerzenie odpowiedzi istniejącego endpointu o potrzebne pola, agregat lub wynik walidacji, ewentualnie operację zbiorczą. Opisz konkretną proponowaną zmianę kontraktu i korzyść zamiast po cichu wdrażać kosztowne obejście.

Zacznij od modeli, serwisów i użyć dostępnych w FE. Propozycja rozszerzenia kontraktu nie wymaga sprawdzania repo BE ani wywoływania endpointu; zaznacz, że jest propozycją, jeśli nie została potwierdzona. Sięgaj do BE dopiero przy konkretnej nierozstrzygniętej kwestii lub gdy wymaga tego zadanie. Przyjęcie przez użytkownika przyszłego kontraktu pozwala implementować FE z tym założeniem; nie jest potwierdzeniem, że BE już go wdrożył. Zwykła zmiana wykorzystująca wystarczający kontrakt nie wymaga dodatkowego raportu ani pytania o zgodę.

Jeśli dane są pobierane dla elementów kolekcji, zastosuj również ocenę kosztu całego widoku z `paginated-list-table`, gdy ten skill jest dostępny. Uwzględnij mnożenie liczby wywołań przez wiersze, pola lub kolejne interakcje. Jeśli przewidywany koszt wydaje się średni lub duży, przedstaw użytkownikowi oszacowanie i tańszą alternatywę oraz uzyskaj zgodę przed wdrożeniem lub uruchomieniem kosztownego przepływu. Nie potrzebujesz ponownej zgody na konkretny koszt już jawnie zaakceptowany w zadaniu; ogólna prośba o feature nie oznacza akceptacji nieujawnionego fan-outu. Nie ustalaj uniwersalnego progu liczbowego bez kontekstu endpointów i zastosowania.

- Sprawdź istniejące lekkie endpointy i ich kontrakt przed użyciem dużych list lub proponowaniem nowego endpointu.
- Jeżeli dane nie są potrzebne do pierwszego renderu, walidacji lub odtworzenia wybranej wartości, rozważ pobranie przy pierwszym użyciu. Nie wprowadzaj lazy loading kosztem etykiety istniejącej selekcji.
- Kolejne otwarcie może wykorzystać pobrane dane. Ustal zakres i ważność cache, uwzględniając zasób, typ, filtry, język oraz uprawnienia, jeśli wpływają na odpowiedź. Nie dodawaj globalnego cache bez potrzeby.
- Debounce ma jednego właściciela. Sprawdź publiczne API i faktyczne zachowanie komponentu przed dodaniem opóźnienia w RxJS; nie ustawiaj dwóch debounce dla tej samej interakcji.
- Dla zastępowalnego wyszukiwania preferuj `switchMap` zamiast ręcznych liczników odpowiedzi. Niezależne selektory zachowują niezależne loading, błędy i anulowanie.
- Błąd jednego źródła powinien pozwalać ponowić to źródło. Nie przeładowuj całego obiektu i wszystkich opcji, jeśli błąd lub mutacja dotyczy mniejszego zakresu.
- Filtruj lokalnie tylko kompletny zbiór, gdy odpowiada to kontraktowi. Pierwsza strona wyników nie zastępuje wyszukiwania serwerowego.

Jeśli jest to istotne dla zmiany, testuj liczbę wywołań przy wejściu i ponownym otwarciu, ponowienie po błędzie oraz niezależność selektorów. Nie dodawaj testów liczących requesty, których liczba nie jest częścią oczekiwanego zachowania.
