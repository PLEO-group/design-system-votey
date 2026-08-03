# Angularowe komponenty źródłowe Votey

Wczytaj tę referencję przy tworzeniu, migracji albo review komponentu w
`design-system-votey/angular/src/lib`. Dla integracji gotowej paczki w CRM użyj
zamiast niej `angular.md`; przy migracji z CRM możesz użyć obu zgodnie z routingiem
w `SKILL.md`.

## Spis treści

- Granice komponentu
- Nazewnictwo i selektory
- Tokenizacja
- Bramka tokenizacji SCSS
- Kontrakt Angulara
- HTML, dostępność i stany
- Style i integracje bibliotek
- Publiczne API i pakowanie
- Storybook
- Minimalna weryfikacja

## Granice komponentu

- Buduj prymityw UI niezależny od domeny, routingu, store'a, endpointów i serwisów
  konkretnej aplikacji.
- Przekazuj dane i konfigurację przez małe, typowane inputy, treść przez input albo
  projekcję, a intencje użytkownika emituj przez outputy.
- Nie osadzaj tekstów biznesowych, kluczy tłumaczeń, uprawnień ani reguł właściwych
  tylko dla CRM. Konsument odpowiada za te decyzje.
- Dodawaj wariant wyłącznie wtedy, gdy opisuje powtarzalny kontrakt wizualny lub
  funkcjonalny. Nie dodawaj inputu będącego obejściem dla jednego ekranu.
- Preferuj kompozycję nad rozbudowanymi flagami. Jeżeli zestaw booleanów tworzy
  niepoprawne kombinacje, zastąp go typowanym wariantem albo mniejszymi komponentami.

## Nazewnictwo i selektory

- Każdy komponent Angular w paczce musi mieć elementowy selektor z prefiksem
  `vt-`, np. `vt-button` albo `vt-checkbox`.
- Nazwij klasę `Votey<Name>Component`, pliki `votey-<name>.component.*`, a katalog
  krótko według komponentu, np. `button/`.
- Nie publikuj selektorów atrybutowych lub klasowych jako głównego kontraktu komponentu.
  Atrybut może być osobną dyrektywą tylko wtedy, gdy semantyka HTML tego wymaga.
- Traktuj selektor, nazwy inputów/outputów, eksportowane typy i zachowanie formularza
  jako publiczny kontrakt wymagający kompatybilności wstecznej.

## Tokenizacja

- Używaj tokenów tylko dla kategorii, które mają źródło prawdy w Design Systemie:
  - kolorów,
  - typografii: `font-family`, `font-size`, `font-weight`, `line-height`
    i `letter-spacing`,
  - `border-radius`,
  - spacingu, w szczególności `margin`, `padding` i `gap`.
- Używaj publicznych tokenów właściwych dla Angular CRM, przede wszystkim
  `tokens.angular.css` oraz semantycznych kolorów CRM. Nie używaj tokenów PWA.
- W kategoriach objętych tokenizacją preferuj token semantyczny, a token core stosuj,
  gdy nie istnieje właściwa rola semantyczna i takie użycie jest zgodne z lokalnym wzorcem.
- Jeżeli w kategorii objętej tokenizacją brakuje właściwego tokenu, zgłoś gap.
  Nie twórz lokalnej zmiennej udającej token i nie wybieraj podobnej roli tylko dlatego,
  że ma zbliżoną wartość.
- Nie wymagaj tokenów dla kategorii, których Design System aktualnie nie tokenizuje,
  np. szerokości i wysokości, grubości obramowania, cieni, `z-index`, breakpointów
  albo czasu i krzywej animacji. Użyj dla nich wartości potwierdzonej przez projekt,
  istniejący komponent lub wymaganie funkcjonalne.
- W wartościach złożonych tokenizuj tylko obsługiwane części: np. `border-color`
  i kolor cienia korzystają z tokenów kolorów, ale `border-width`, offset i blur
  cienia mogą pozostać wartościami bez tokenu.
- Przy zmianie istniejącego komponentu otokenuj dotykane wartości należące do
  obsługiwanych kategorii. Nie rozszerzaj tokenizacji na pozostałe właściwości.

## Bramka tokenizacji SCSS

- Przed zakończeniem pracy przeskanuj wszystkie pliki SCSS opracowywanego komponentu,
  nie tylko zmienione linie, pod kątem surowych wartości należących do kategorii
  objętych tokenizacją.
- Nie zgłaszaj wartości z kategorii nietokenizowanych ani poprawnych odwołań do
  publicznych tokenów. Wartość techniczna nie jest naruszeniem tylko wtedy, gdy nie
  zastępuje koloru, właściwości typografii, `border-radius` ani spacingu.
- Jeśli znajdziesz naruszenie, zawsze powiadom użytkownika. Podaj dla każdego przypadku:
  plik i linię, właściwość, surową wartość, kategorię oraz istniejący właściwy token.
  Jeśli tokenu w obsługiwanej kategorii brakuje, oznacz przypadek jako gap zamiast
  zgadywać zamiennik.
- Potraktuj wykryte naruszenia jako jawną bramkę. Nie uznawaj komponentu za gotowy
  i nie pomijaj problemu bez jednej z poniższych decyzji użytkownika:

  1. użytkownik poprawi wskazane wartości samodzielnie,
  2. użytkownik poleci agentowi zastąpić wartości tokenami lub uzupełnić brakujący
     kontrakt tokenów,
  3. użytkownik świadomie zaakceptuje pozostawienie dokładnie wskazanych wyjątków.
- Jeżeli bieżące polecenie użytkownika już jednoznacznie nakazuje agentowi usunąć
  takie naruszenia, powiadom o wykryciu, wykonaj korektę i nie pytaj ponownie o zgodę.
- Świadoma akceptacja wyjątku dotyczy tylko wskazanego komponentu i wartości; nie tworzy
  nowego standardu ani precedensu dla kolejnych komponentów. Zapisz tę decyzję
  w podsumowaniu końcowym.
- Po poprawce wykonanej przez użytkownika albo agenta przeskanuj SCSS ponownie.
  Bramkę uznaj za zamkniętą dopiero po braku naruszeń albo po jawnej akceptacji wyjątków.

## Kontrakt Angulara

- Stosuj bieżący `angular-code-standards`; ta referencja go nie zastępuje.
- Twórz komponent standalone z `ChangeDetectionStrategy.OnPush`.
- Używaj signalowego API: `input()`, `input.required()`, `output()`, `model()`,
  `computed()` i signalowych queries. Typuj publiczne pola i eksportowane symbole.
- Eksportuj zamknięte listy wariantów jako `as const` oraz wyprowadzaj z nich typy,
  gdy konsumenci albo Storybook mają korzystać z tego samego źródła prawdy.
- Dla kontrolki formularzowej implementuj pełny `ControlValueAccessor`, w tym
  `writeValue`, `registerOnChange`, `registerOnTouched` i `setDisabledState`.
  Stan disabled z formularza połącz ze stanem przekazanym przez input.
- Używaj zależności Angular/Material jako peer dependencies paczki. Nie przenoś
  zależności aplikacyjnych do biblioteki.

## HTML, dostępność i stany

- Zachowuj natywną semantykę elementu (`button`, `input`, etykieta) i obsługę klawiatury.
- Zapewnij dostępne focus, disabled, required, error i właściwe atrybuty ARIA.
  Komponent ikonowy musi otrzymać dostępną nazwę.
- Nie emituj akcji dla disabled. Dla formularzy emituj wartość oraz touched zgodnie
  z kontraktem Angular Forms.
- Zdefiniuj i sprawdź wszystkie istotne stany: default, hover, active, focus-visible,
  disabled, error, selected/checked, loading i indeterminate — tylko te, które mają
  znaczenie dla danego komponentu.
- Nie zwiększaj obszaru klikalnego ani nie zmieniaj payloadu zdarzenia podczas migracji
  bez jawnej decyzji funkcjonalnej.

## Style i integracje bibliotek

- Izoluj style w komponencie. Nie dodawaj globalnego override'u dla jednego prymitywu.
- Przy `ViewEncapsulation.None` ogranicz każdy selector do hosta `vt-*`. Używaj tego
  trybu tylko wtedy, gdy trzeba stylować internale biblioteki, np. Angular Material.
- Override internali biblioteki utrzymuj minimalny i oparty o publiczne tokeny/CSS
  custom properties, jeśli biblioteka je udostępnia. `!important` jest ostatecznością.
- Assety pobieraj z publicznego kontraktu Votey. Nie kopiuj SVG do katalogu komponentu
  ani nie twórz lokalnego registry dla publicznej ikony.
- Nie uzależniaj komponentu od globalnych klas konsumenta. Jawnie dokumentuj wymagany
  arkusz tokenów albo provider publicznego runtime'u.

## Publiczne API i pakowanie

- Trzymaj implementację i zależności frameworka w katalogu `angular/` oraz subpath
  exporcie `./angular`, aby nie trafiały do entry pointów i bundle'i Reacta.
- Eksportuj komponent oraz potrzebne konsumentom typy i stałe przez
  `angular/src/public-api.ts`. Konsument nie może korzystać z deep importu.
- Nie eksportuj prywatnych helperów, typów implementacyjnych ani internali Angular Material.
- Nie edytuj ręcznie `dist`; wygeneruj go przez build paczki.
- Zmianę peer dependencies, kopiowania assetów lub entry pointu traktuj jako część
  publicznego kontraktu i zweryfikuj na spakowanym artefakcie.

## Storybook

- Dodaj komponent pod `ANGULAR COMPONENTS/<Name>` z jedną interaktywną historią
  `Playground`, chyba że osobna historia dokumentuje zachowanie niemożliwe do czytelnego
  przedstawienia kontrolkami.
- Udostępnij kontrolki dla wszystkich sensownych publicznych inputów, a outputy pokaż
  jako actions. Synchronizuj kontrolkę wartości po interakcji użytkownika.
- Montując Angular w Reactowym Storybooku, utwórz rzeczywisty element hosta zgodny
  z selektorem `vt-*`; nie montuj komponentu na anonimowym `div`, bo style ograniczone
  do selektora hosta nie zadziałają.
- Nie twórz osobnych podstron wyłącznie dla wariantów, które da się wybrać w Playground.
- Sprawdź podgląd dla istotnych stanów, eventów, motywu i wymaganych viewportów.

## Minimalna weryfikacja

1. Zamknij bramkę tokenizacji SCSS.
2. Sprawdź automatycznie prefiks `vt-` dla wszystkich komponentów Angular w paczce.
3. Dodaj test zachowania komponentu, w tym outputy, disabled i CVA dla kontrolek formularza.
4. Potwierdź eksport z `@pleodigital/design-system-votey/angular` bez deep importu.
5. Uruchom testy paczki, build Angulara i build Storybooka.
6. Wykonaj smoke-test Playground w przeglądarce: render, console, klawiatura, focus,
   interakcje, stany oraz brak wycieku stylów do historii Reactowych.

Komponent jest gotowy dopiero wtedy, gdy używa tokenów we wszystkich obsługiwanych
kategoriach, jest reużywalny, dostępny, wyeksportowany przez publiczne API
i zweryfikowany zarówno jako paczka, jak i w Storybooku.
