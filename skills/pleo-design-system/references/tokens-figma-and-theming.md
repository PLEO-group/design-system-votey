# Tokeny, Figma i theme

## Figma preflight

Sprawdź dostępność skilla `figma`. Jeśli brakuje go w repo korzystającym z PleoAI, użyj firmowego workflow synchronizacji shared skilli. Gdy automatyczne pobranie jest niedostępne, poproś użytkownika o udostępnienie skilla.

Najpierw pozyskaj link do całego projektu lub pliku Figma design systemu i zapisz go w `designSource.projectUrl`; jest to punkt wejścia także do komponentów i dokumentacji wizualnej. Osobno potwierdź link do źródła Figma Variables i zapisz go w `tokens.sourceOfTruth.url`. Linki mogą być identyczne. Odczytaj collections, modes, aliases, scopes i typy. Nie przepisuj tokenów ze screenshotów.

W generowanym `references/tokens.md` wpisz oba rozwiązane URL-e. Dopuszczalne
jest zamiast ich duplikowania jednoznaczne wskazanie
`references/design-system-manifest.json` → `designSource.projectUrl` oraz
`tokens.sourceOfTruth.url`, ale nie ogólne „link z manifestu”. Placeholder nie
spełnia kontraktu. Agent ma móc po samej referencji otworzyć źródło bez
ponownego discovery i bez pytania użytkownika o link.

## Weryfikacja zgodności 1:1

Projektowa referencja tokenów musi opisywać procedurę wykonywaną na żądanie:

1. sprawdź dostęp do Figmy i otwórz `tokens.sourceOfTruth.url`;
2. odczytaj collections, modes, typy, scopes, wartości i aliasy;
3. rozwiąż aliasy rekurencyjnie i porównaj źródłowe tokeny kodu, nie outputy;
4. zastosuj jawne projektowe mapowanie nazw kolekcji, modes i breakpointów;
5. zaraportuj liczebności oraz brakujące, nadmiarowe i różniące się tokeny;
6. nie uznawaj snapshotu, screenshotu ani udanego builda za dowód aktualnej
   zgodności z Figmą i nie modyfikuj źródeł bez osobnej prośby.

Jeżeli konektor/skilla Figma nie da się użyć, wynik jest zablokowany przez brak
dostępu, a nie pozytywnie zweryfikowany.

## Model tokenów

Rozdziel:

- core: wartości bazowe;
- semantic: role używane przez produkt;
- modes: co najmniej light i dark dla kolorów;
- kategorie: color, spacing, typography, radius, opacity i opcjonalny grid.

Semantic token powinien aliasować core. Nazwa semantic opisuje rolę, nie konkretną wartość lub kolor.

Stosuj `naming-contracts.md` i identyfikator `pleo-design-system-tokens-v1`. Light i dark traktuj jako modes semantycznych tokenów zależnych od motywu, a nie osobne warstwy tokenów.

Warstwę źródłowego pliku ustalaj jednoznacznie w manifeście, strukturze kolekcji albo konfiguracji Style Dictionary. Rekomenduj czytelne nazwy z `core`/`semantic`, ale pozostaw projektowi swobodę nazw plików, ścieżek tokenów i nazw publicznych. Nie klasyfikuj samego wyboru nazwy jako findingu; oceniaj wyłącznie zdolność pipeline'u do deterministycznego rozróżnienia warstw i wygenerowania zadeklarowanych outputów. Po skopiowaniu `assets/style-dictionary/config.example.mjs` obowiązkowo dopasuj `tokenSourceAdapter` do źródeł, kategorii i publicznych nazw projektu; adapter ma przerwać build dla nierozpoznanego lub niejednoznacznego tokenu, nigdy zgadywać warstwy z pozycji segmentu ścieżki.

Dla Angulara użyj zamkniętego kontraktu runtime z `angular-grid-and-theming.md`; nie przenoś Angular ThemeService automatycznie do Reacta. Grid tokens są wyjątkiem technicznym: gdy `responsive.grid.enabled: true`, ich źródłem prawdy jest lokalny JSON wskazany przez `responsive.grid.tokenFile`, ponieważ nie pochodzą z Figma Variables. Przy wyłączonym gridzie nie twórz tego pliku.

## Polityka manifestu

Dla każdej kategorii i frameworka zapisz:

- `generate`: co fizycznie buduje Style Dictionary;
- `autocomplete`: co pokazuje IDE;
- `allowedUsage`: czego wolno używać konsumentowi.

Default kolorów: generuj core i semantic, podpowiadaj i zezwalaj tylko na semantic. Dla pozostałych kategorii defaultem może być core + semantic. Angular i React mogą nadpisywać politykę niezależnie.

Pole `autocomplete` zapisuje docelową politykę widoczności tokenów w IDE. W wersji v1 nie generuj dedykowanego artefaktu metadanych IDE; korzystaj z deklaracji CSS variables indeksowanych przez projekt. Nie deklaruj dedykowanego mechanizmu autocomplete jako gotowego outputu.

## Style Dictionary

- Waliduj źródła przed buildem.
- Waliduj jednoznaczną klasyfikację core/semantic niezależnie od nazw plików i tokenów; nie blokuj alternatywnego nazewnictwa.
- Odrzucaj nierozwiązane aliasy, cykle, niezgodne typy i brakujące modes.
- Generuj SCSS zawsze.
- Generuj Angular CSS variables dla Angulara.
- Generuj Tailwind integration dla Reacta, jeśli manifest ją włącza.
- Nie edytuj outputów ręcznie.
- Dla `build-only` buduj i publikuj wyłącznie w CI.
- Dla śledzonych outputów regeneruj i wymagaj pustego `git diff`.

Przy add/edit/remove tokenów, breakpointów lub mnożników stosuj `change-scenarios.md`. W skillu konkretnego DS trzymaj dokładne ścieżki i komendy w `references/tokens.md` oraz szczegóły breakpointów w `references/responsiveness.md`.

