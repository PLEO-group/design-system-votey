# Użycie assetów Votey

Wczytaj tę referencję razem z właściwą referencją frameworka, gdy implementacja
używa ikony albo ilustracji opublikowanej przez `@pleodigital/design-system-votey`.

## Najpierw potwierdź publiczny asset

1. Sprawdź zainstalowaną wersję paczki i dokładną publiczną nazwę albo ścieżkę.
2. Użyj assetu wygenerowanego z Design Systemu; nie kopiuj źródłowego SVG do aplikacji.
3. Jeśli assetu brakuje, zgłoś gap i użyj `votey-svg-assets`, zamiast tworzyć lokalny
   odpowiednik o tej samej roli.

### Ilustracje informacyjne

Większe, szczegółowe infografiki są publikowane w contexcie `info`:

- źródło: `assets/illustrations/info/illu_info_<descriptor>.svg`,
- Angular Registry: `info-<descriptor>`,
- React: `IlluInfo<Descriptor>` z entry pointu `illustrations/info`.

Przykład: `illu_info_subscription-calculator.svg` jest dostępny jako
`info-subscription-calculator` w Angular Registry oraz
`IlluInfoSubscriptionCalculator` w React. Nie zastępuj contextu `info`
ilustracją `background`, `spot` ani `simple` tylko po to, aby użyć mniejszego
kafelka lub istniejącego namespace'u.

## Angular: wybór mechanizmu

Wybierz jeden z dwóch publicznych sposobów:

### `vt-icon`

Użyj `vt-icon` w template, gdy ikona jest elementem DOM komponentu, przycisku albo
treści. Przekaż publiczną nazwę registry, nie ścieżkę pliku:

```html
<vt-icon ico="sp-check" ariaLabel="Zatwierdzone" />
```

Zapewnij `provideVoteySvgRegistry()` i kopiowanie `dist/assets/angular/svg-raw/**`
do publicznego katalogu zgodnego z `assetBaseUrl`.

Kanoniczna reguła Angular CLI dla domyślnego `assetBaseUrl`:

```json
{
  "glob": "**/*.svg",
  "input": "node_modules/@pleodigital/design-system-votey/dist/assets/angular/svg-raw",
  "output": "assets/votey"
}
```

Utrzymuj jedną taką regułę. Nie duplikuj jej wariantami `assets/votey` oraz
`/assets/votey`.

### `url()` w SCSS

Użyj `url()` dla `background-image`, `mask`, pseudo-elementu albo internali biblioteki,
do których nie można wstawić `vt-icon`. Odwołuj się do publicznego pliku skopiowanego
przez build konsumenta:

```scss
.checkmark {
  mask: url("/assets/votey/icons/special/icon_sp_check.svg") center / contain
    no-repeat;
}
```

Nazwa registry (`sp-check`) i ścieżka pliku
(`icons/special/icon_sp_check.svg`) są różnymi kontraktami. Nie używaj nazwy registry
w `url()` ani ścieżki pliku w `ico`.

Czerwone podkreślenie absolutnego URL-a w IDE nie dowodzi błędu runtime. Nie naprawiaj
go przez kopiowanie SVG do `src/assets`. Potwierdź zamiast tego:

- obecność pliku w zainstalowanej paczce,
- regułę kopiowania w konfiguracji builda,
- obecność pliku w build output,
- odpowiedź bez 404 na docelowym base path.

Ścieżka zaczynająca się od `/` zakłada hosting aplikacji w korzeniu domeny. Przy hostingu
pod prefiksem użyj ścieżki zgodnej z faktycznym `baseHref` i konfiguracją serwera; nie
zgaduj jej na podstawie układu katalogów źródłowych.

## React / Next

Importuj wygenerowany komponent SVG z paczki przez potwierdzony alias, np.
`@votey/icons/...` albo `@votey/illustrations/...`. Nie wklejaj SVG do JSX i nie kopiuj
go do lokalnego `public/` lub katalogu komponentu, jeśli paczka publikuje ten asset.
Użycie CSS `url()` jest dopuszczalne tylko wtedy, gdy konsument jawnie wystawia publiczne
pliki paczki i ścieżka jest częścią jego potwierdzonego kontraktu builda.

## Bramka lokalnego osadzenia

Lokalny plik SVG, inline SVG, data URI, lokalny wrapper zawierający skopiowaną geometrię
albo ponowna rejestracja publicznego assetu są ostatecznością. Przed ich użyciem:

1. Powiadom użytkownika, jaki publiczny asset i mechanizm sprawdzono oraz dlaczego nie
   rozwiązują wymagania.
2. Podaj dokładny zakres duplikacji, ryzyko rozjazdu z Design Systemem i proponowaną
   ścieżkę usunięcia wyjątku.
3. Zatrzymaj implementację do chwili, gdy użytkownik:
   - poleci dodać lub poprawić asset w Design Systemie,
   - poda inne publiczne rozwiązanie,
   - albo świadomie zaakceptuje dokładnie wskazane lokalne osadzenie.
4. Zapisz zaakceptowany wyjątek w podsumowaniu. Zgoda nie tworzy precedensu dla innych
   assetów ani komponentów.
