# Warunkowe playbooki Angular Code Standards

Wczytuj tylko sekcję odpowiadającą bieżącej zmianie. Nie ładuj całego pliku przy prostej zmianie SCSS albo typów, jeśli nie zachodzi żaden warunek opisany w routingu głównego `SKILL.md`.

## Spis treści

- [3.13 Refaktor UI bez regresji kontraktu](#313-refaktor-ui-bez-regresji-kontraktu)
- [3.14 Widoki tabelaryczne, listy i layout kolekcji](#314-widoki-tabelaryczne-listy-i-layout-kolekcji)
- [3.15 Istniejące komponenty UI oparte o biblioteki](#315-istniejące-komponenty-ui-oparte-o-biblioteki)
- [3.16 Powtarzalne stringi kontraktowe](#316-powtarzalne-stringi-kontraktowe)
- [3.17 Discovery przed lokalnymi mechanizmami sprawdzającymi](#317-discovery-przed-lokalnymi-mechanizmami-sprawdzającymi)

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

Dla widoków kolekcji, niezależnie od prezentacji jako tabela, lista, kafle, drzewo, stepper albo virtual scroll:

- najpierw zachowaj model danych, selekcję, disabled rules, uprawnienia i nawigację,
- nie zmieniaj triggera wyboru ani zakresu klikalności bez jawnej decyzji,
- sprawdź zachowanie dla elementów enabled, disabled, pustych, ładowanych i po błędzie,
- po zmianie usuń martwe inputy, outputy, metody, helpery i style starego widoku.

Jeśli nowy projekt UI wymaga zmiany kontraktu interakcji, potraktuj to jako zmianę funkcjonalną i potwierdź ją ze specyfikacją albo użytkownikiem.

Edge case: dla list filtrowanych, sortowanych, przeładowywanych albo wirtualizowanych nie używaj `track $index`; wybierz stabilne `id`, `uuid`, slug albo inny niezmienny klucz domenowy.

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
