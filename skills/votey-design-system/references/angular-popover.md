# Help Popover i Popover w Angularze

Importuj komponenty i typy z `@pleodigital/design-system-votey/angular`.

## Help Popover

Używaj `vt-help-popover` do pomocy kontekstowej. Komponent zapewnia przycisk
ze znakiem zapytania i korzysta z `vt-popover` opartego na `MatMenu`.
Przekazuj tytuł, uporządkowane sekcje, opcjonalną ilustrację i akcję przez
typowaną definicję `VoteyHelpPopoverContent` w TypeScript. Klucze tłumaczeń,
treść domenowa i nawigacja należą do konsumenta.

- Jedna definicja pomocy może zostać w komponencie nadrzędnym. Gdy widok ma
  kilka definicji, wydziel je do sąsiedniego pliku `<nazwa-widoku>-help-content.ts`.
  Jeśli kilka widoków używa identycznych definicji, trzymaj je w jednym pliku
  we wspólnym katalogu funkcji.
- Ilustrację wybieraj z publicznego typu `VoteyIllustration` i renderuj przez
  `vt-icon`. Dla nazw `info-*` szerokość wynosi `100%`, a proporcje `10 / 9`.
  Pozostałe ilustracje zachowują proporcje `10 / 7` i domyślne wymiary komponentu.
- Szerokość panelu odpowiada sześciu kolumnom grida DS i pięciu odstępom między
  nimi, z ograniczeniem do dostępnego viewportu. Docelowe minimum wysokości to
  `560px`, również przy krótkiej treści. Niższy limit viewportu ma pierwszeństwo.
- Na desktopie panel ma maksymalnie `50vh`. Przy dłuższej treści przewija się
  część tekstowa obok nieruchomej ilustracji. Na telefonie ilustracja jest nad
  treścią i przewija się cały panel.
- Po otwarciu ustaw fokus na tytule, aby tekst zaczynał się od góry. Escape
  zamyka panel i przywraca fokus do triggera.

```html
<vt-help-popover [content]="eventHelp" />
```

W Storybooku lub w aplikacji sprawdź krótką i długą treść, ilustracje `info-*`
i standardowe, przewijanie na desktopie i telefonie, fokus po otwarciu i po
Escape oraz opcjonalny link, jeśli jest używany.

## Popover do własnej zawartości

Preferuj `vt-popover` dla panelu zakotwiczonego przy przycisku, np. panelu
filtrów, zamiast tworzyć lokalny odpowiednik lub osobną instancję `MatMenu`.
Użyj `ng-template vtPopoverContent` do przekazania treści i
`let-close="close"` do zamknięcia po akcji. Stan formularza, zatwierdzanie i
reset pozostają po stronie konsumenta. Dobierz dostępne `ariaLabel` oraz
preferowane `placement`, jeśli domyślne położenie nie pasuje.

Sprawdź otwarcie przyciskiem i klawiaturą, dostępność kontrolek przez Tab,
zamknięcie poza panelem i Escape oraz zachowanie przy krawędzi viewportu.
Jeśli publiczne API nie pokrywa potrzeby, opisz brak i rozważ rozszerzenie
wspólnego komponentu przed dodaniem lokalnej implementacji.
