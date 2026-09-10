# Pipeline assetów SVG

## Zasada źródła prawdy

Źródłowe pliki w `assets/icons/**` i `assets/illustrations/**` są jedyną ręcznie utrzymywaną listą assetów. Nie dopisuj pojedynczego SVG ręcznie do typu TypeScript, Angular Registry, React barrel ani galerii preview. Nazwa i folder pliku muszą deterministycznie wygenerować wszystkie publiczne odpowiedniki.

Skopiuj do repo DS:

- `assets/svg/generate-svg-assets.example.mjs` jako generator;
- `assets/svg/svg-assets.config.example.json` jako projektową konfigurację contextów, prefixów, namespace'ów i słownictwa;
- `assets/angular/svg-registry.example.ts` dla Angulara.

## Konfiguracja projektowa

Każda grupa konfiguracji definiuje dokładnie jedno mapowanie:

```text
folder źródłowy + prefix pliku
  → rodzaj icon/illustration
  → publiczny namespace Angular
  → nazwa komponentu i katalog React
```

Nie koduj contextów na stałe w globalnym generatorze. Ich zatwierdzona lista, dozwolone modyfikatory, słownictwo i wyjątki należą do `references/svg-assets.md` skilla konkretnego DS oraz jego konfiguracji generatora. Dodanie nowego contextu wymaga aktualizacji obu, preview i testów kontraktu.

## Walidacja przed generowaniem

Generator musi blokować:

- uppercase, spacje, niedozwolone lub powtórzone separatory;
- prefix niezgodny z folderem/contextem;
- pusty descriptor;
- słowo spoza zatwierdzonego `allowedTerms`; dla bliskiej literówki powinien zaproponować najbliższy termin;
- kolizję publicznej nazwy Angular albo eksportu React;
- identyczną treść dwóch SVG;
- brak pojedynczego root `<svg>` lub `viewBox`;
- `<script>`, `<foreignObject>`, event handlery, `javascript:` i zewnętrzne URL-e;
- powtórzone `id` albo lokalną referencję do nieistniejącego `id`.

Agent dodatkowo sprawdza znaczenie, podobieństwo wizualne, `currentColor`, wielokolorowość, maski/gradienty i kolizje identyfikatorów między wieloma instancjami. Maszyna wykrywa literówkę względem zatwierdzonego słownika; nie potrafi samodzielnie rozstrzygnąć poprawnej semantyki nowego terminu. Nowe prawidłowe słowo dopisz do słownika dopiero po potwierdzeniu nazwy.

## Generowane outputy

Jeden przebieg generatora tworzy:

- posortowane `*IconNames` i `*IllustrationNames` z typami union;
- typowane wpisy Angular Registry `name + relativePath`;
- wspólną listę registry używaną przez provider;
- opcjonalny barrel eksportów komponentów React wygenerowanych wcześniej przez SVGR.

Angular provider importuje wygenerowaną listę i nie przyjmuje ręcznych `entries`. Storybook/preview ma ładować źródła lub wygenerowany manifest/barrel automatycznie; nie utrzymuj list pojedynczych kart.

## Workflow agenta

1. Odczytaj `references/svg-assets.md` skilla konkretnego DS, konfigurację generatora i najbliższe istniejące pliki.
2. Dla każdego wejścia zaplanuj `plik → context/folder → Angular name → React export`.
3. Sprawdź bezpieczeństwo, duplikaty i nazwę. Jeśli trzeba zmienić dostarczoną nazwę albo context jest niejednoznaczny, zatrzymaj zapis i poproś o akceptację.
4. Dodaj, przenieś, zmień nazwę albo usuń wyłącznie źródłowy SVG. Nie edytuj wygenerowanych outputów.
5. Uruchom transformację SVG dla frameworków, następnie generator kontraktów, pełny build, `--check`, testy i preview.
6. Potwierdź wynikowe nazwy, raw asset Angular, komponent React, kartę preview oraz brak niezamierzonych diffów.

Rename, przeniesienie między contextami i usunięcie publicznego assetu są zmianami kontraktu. Wyszukaj użycia u potwierdzonych konsumentów, przygotuj mapowanie migracyjne i sklasyfikuj SemVer; nie wybieraj zamiennika bez decyzji użytkownika.

## CI

Wymagaj co najmniej:

```bash
node scripts/generate-svg-assets.mjs --config svg-assets.config.json --check
```

Pipeline musi wcześniej odtworzyć generowane outputy z czystego stanu. `--check` blokuje nieaktualne typy/registry/barrel oraz każde naruszenie nazewnictwa lub bezpieczeństwa. Pełny build ma również sprawdzić raw SVG Angular, transformację SVGR, publiczne entry pointy i automatyczną galerię preview.
