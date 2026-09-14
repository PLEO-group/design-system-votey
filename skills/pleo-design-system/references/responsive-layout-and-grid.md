# Uniwersalne stylowanie responsywne i grid

## Dwie osie responsywności

Nie utożsamiaj rodzaju urządzenia z szerokością viewportu:

- `device-contract`: `mobile`, `tablet`, `desktop` pochodzą z detekcji urządzenia i `data-device`; zmiana szerokości okna desktopowego nie zmienia go w mobile;
- `css-media`: nazwy zadeklarowanych breakpointów oznaczają przedziały szerokości z kanonicznej mapy tokenów.

Jeden DS wybiera jeden model. Style per device/viewport realizuj wybranym mixinem. Runtime service stosuj tylko wtedy, gdy zmienia się zachowanie lub renderowanie, nie do zwykłej zmiany CSS.

Nazwy breakpointów są konfigurowalne per DS i muszą być jawnie zapisane w `responsive.breakpoints.names`. Nie zakładaj na sztywno zestawu trzech ani sześciu nazw. W `device-contract` osobno zapisz `deviceTypes` i mapowanie device → breakpoint referencyjny; rodzaj urządzenia może być `tablet`, mimo że system tokenów obsługuje dodatkowo breakpointy `tablet-small` i `laptop`.

Wartości szerokości pozostają core tokens w JSON. Style Dictionary łączy je z deklaracjami manifestu i zapisuje jedyną generowaną mapę SCSS pod `responsive.generatedConfigScssPath`. Umieść tę ścieżkę w źródłowym katalogu kompilowanym razem z adapterami; nie kieruj jej do `dist` i nie edytuj wygenerowanego pliku.

### Źródła prawdy i aktualizacja

Nie duplikuj konfiguracji między JSON, manifestem i SCSS:

| Zmiana | Edytowane źródło prawdy |
| --- | --- |
| szerokość breakpointu | core token JSON wskazany przez `responsive.breakpoints.tokenFile` |
| kolumny, gutter, margin, margin-extra | core token JSON wskazany przez `responsive.grid.tokenFile` |
| device types, kolejność/nazwy breakpointów | `design-system.manifest.json` |
| mnożniki, fallbacki i top-level `responsive.deviceBreakpointMap` | `design-system.manifest.json` |
| mapy `$ds-*` konsumowane przez SCSS | nigdzie ręcznie; generuje je `commands.buildTokens` |

Przy zmianie mnożnika, np. `tablet`, edytuj wyłącznie `responsive.scaling.deviceMultipliers.tablet` w manifeście. Następnie uruchom `commands.buildTokens`, walidację manifestu, `scripts/verify-responsive-config.mjs`, build/test i preview na dotkniętych urządzeniach. Zmiana mnożnika wpływa na skalowanie responsive typography/spacing, nie na szerokości breakpointów ani surowe wartości gridu.

`responsive.deviceBreakpointMap` należy do kontraktu responsywności, nie do opcjonalnego grida: skalowanie używa go również przy `grid.enabled: false`. Dla `css-media` mapa, device types, mnożniki i fallbacki urządzeń pozostają puste. Pełne procedury add/edit/remove zawiera `change-scenarios.md`.

`assets/responsive/_responsive-config.generated.example.scss` jest wyłącznie snapshotem przykładowego outputu wygenerowanego z manifestu i tokenów dostarczonych w `assets/`. Pokazuje format wyniku; nie jest defaultem, dodatkowym źródłem prawdy ani plikiem do ręcznego kopiowania wartości. W rzeczywistym DS generator tworzy plik bez członu `.example`, dokładnie pod `responsive.generatedConfigScssPath`.

## Płynne skalowanie tokenów

Wartości responsive typography i spacing mogą być podane jawnie tylko dla części breakpointów. `responsive.scaling.implicitBreakpointFallbacks` definiuje brakujące punkty, a `deviceMultipliers` normalizują wartości względem rodzaju urządzenia. `assets/responsive/responsive-token-scaling.example.scss` interpoluje liniowo pomiędzy kolejnymi jawnymi punktami i publikuje wynik jako CSS custom property. Nie dopisuj w funkcjach wyjątków dla konkretnych nazw; wszystkie nazwy, fallbacki i mnożniki pochodzą z manifestu i wygenerowanej mapy.

## Tokeny głównego grida

Wymagany publiczny kontrakt:

```scss
--grid-columns
--grid-column-gap
--grid-margin
```

Opcjonalne rozszerzenia złożonego systemu:

```scss
--grid-column-width
--grid-margin-extra
```

W złożonym gridzie źródłowe `gutter`, `margin` i `margin-extra` są bezjednostkowymi liczbami w pikselach referencyjnej ramki Figmy. Kontrakt dzieli je przez szerokość przypisanego breakpointu i przelicza na `vw`. `--grid-column-width` oblicza z `100vw` po odjęciu obu marginesów oraz wszystkich gutterów. To zachowuje proporcje projektu podczas płynnej zmiany szerokości.

`--grid-margin-extra` jest opcjonalną dodatkową warstwą wizualną. Nie dodawaj go domyślnie do podstawowego content boxu. Wartość szerokości kolumny wyliczaj tylko w jednym generowanym kontrakcie, nigdy lokalnie w wielu komponentach.

## Główny i przycięty grid

Główny wrapper:

```scss
.page-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--grid-column-gap);
  padding-inline: var(--grid-margin);
}
```

Pozycjonuj dzieci przez `grid-column`. Jeśli kontener zajmuje N kolumn głównego grida, a jego dzieci nadal mają pasować do overlayu, odtwórz w nim przycięty grid:

```scss
.side-content {
  grid-column: 3 / -1;
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  column-gap: var(--grid-column-gap);
}
```

Nie zastępuj go `flex`, proporcjami `3fr 7fr` ani szerokościami w pikselach, jeśli krawędzie mają trzymać kolumny.

## Mapowanie Figmy

Traktuj px z Figmy jako informację o intencji, nie gotowy CSS:

1. Ustal layout-driving node, full-bleed/content box, wariant grida i różnice między widokami.
2. Wybierz główny grid, istniejący reusable pattern albo lokalny nested grid.
3. Zamień bounds i offsety na zakresy kolumn; gap grida mapuj na `--grid-column-gap`.
4. Stały odstęp lokalny mapuj na dozwolony core spacing, a odstęp zmienny semantycznie na semantic spacing.
5. Jeśli nazwa presetu lub liczba zajmowanych kolumn nie daje jednoznacznej odpowiedzi, zatrzymaj zależną część i zadaj jedno pytanie.

Formularze, taski i układy kart mogą mieć projektowe reusable patterns. Najpierw sprawdź `references/responsiveness.md` skilla konkretnego DS i repo. Nie konstruuj nazwy klasy patternu ani nowego wariantu przez analogię bez potwierdzenia.

## Grid overlay

Jeżeli layout ma pokrywać główny grid, walidacja overlayem jest obowiązkowa. Dla Angulara użyj `assets/angular/grid/grid-overlay.component.example.ts` albo projektowego odpowiednika generującego liczbę kolumn z `--grid-columns`.

Porównaj `getBoundingClientRect()` testowanego kontenera z lewą/prawą krawędzią właściwych kolumn. Tolerancja do `3px` jest dopuszczalna dla scrollbara, zoomu i fractional pixels. Bez runtime checku nie deklaruj `grid-validated:true`.

Minimalny dowód zmiany layoutu:

- wariant grida i device/viewport;
- użyty main/nested/reusable pattern;
- screenshot z overlayem;
- pomiary left/right i różnica;
- wynik dla wszystkich widoków, na których struktura się zmienia.

## Antywzorce

- ręczne media queries obok firmowego mixina;
- używanie nazwy breakpointu jako rodzaju urządzenia;
- zgadywanie liczby kolumn z szerokości okna;
- kopiowanie `width`, `left`, `right` lub margin z Figmy w px, gdy wynikają z kolumn;
- hardkodowany gap głównego/nested grida;
- `--grid-margin-extra` jako zwykły margines;
- mieszanie wariantów grida bez jawnego `data-grid-type`/konfiguracji;
- warunkowe renderowanie przez CSS, gdy zmiana dotyczy zachowania;
- lokalny pattern powielający istniejący reusable pattern.

## Checklista

- Ustal wariant grida oraz liczbę kolumn z tokenów/configu, nie z pamięci.
- Ustal wybraną oś responsywności.
- Sprawdź, czy istnieje projektowy pattern.
- Mapuj geometrię Figmy na kolumny i tokeny.
- Dla nested gridu odtwórz dokładnie liczbę zajmowanych kolumn.
- Oddziel zmianę stylu od zmiany zachowania.
- Zweryfikuj overlayem i zapisz dowody.
