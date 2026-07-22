# Raport zgodności źródła tokenów z `dist` — 1.0.136

Data pomiaru: 2026-07-22  
Commit bazowy: `dd614ce7371765222e13879e6798e0fae38e04d1`  
Zakres: `tokens/base/colors.json`, `tokens/light.json`, `tokens/dark.json` oraz istniejące artefakty CSS/SCSS  
Ważne: build nie został uruchomiony; raport opisuje zastany stan.

## Wynik główny

`dist` jest niezgodny z aktualnymi źródłami tokenów.

| Warstwa | Tokeny w źródle | Tokeny w `dist` | Brakujące w `dist` | Nadmiarowe w `dist` | Niezgodne wartości wspólnych nazw |
|---|---:|---:|---:|---:|---:|
| Base/primitives | 51 | 44 | 7 | 0 | 0 |
| Light semantic | 193 | 43 | 150 | 0 | 1 |
| Dark semantic | 194 | 43 | 151 | 0 | 1 |

Łącznie źródła definiują 247 unikalnych nazw: 51 primitives oraz 196 semantycznych nazw będących sumą light/dark. Obecny `dist` publikuje 87 nazw, więc nie publikuje 160 nazw obecnych w źródłach.

## Brakujące primitives

```text
--color-active-green-100
--color-blue-600
--color-blue-900
--color-mint-green-900
--color-red-500
--color-red-600
--color-yellow-600
```

Wartości wszystkich 44 wspólnych primitives są zgodne po normalizacji wielkości liter w hexach.

## Brakujące semantic colors według kategorii

| Kategoria | Light | Dark |
|---|---:|---:|
| alert | 1 | 1 |
| border | 18 | 20 |
| button | 6 | 7 |
| controls | 42 | 40 |
| icon | 4 | 4 |
| surface | 56 | 56 |
| text | 23 | 23 |
| **Razem** | **150** | **151** |

Brakujące nazwy obejmują rozwinięte role surface/text/border oraz komplet stanów kontrolek device, disconnect, fullscreen, hand-up i share. Pełny zbiór wynika deterministycznie z różnicy między źródłami JSON a czterema plikami CSS; 142 z tych nazw jest już faktycznie używanych w aplikacji React i zostało zapisane w osobnym raporcie użyć.

## Niezgodne wartości istniejącej nazwy

Jedyna wspólna nazwa z inną referencją w źródle i `dist` to `--color-button-background-inactive`.

| Theme | Źródło | Obecny `dist` |
|---|---|---|
| light | `var(--color-gray-400)` | `var(--color-gray-100)` |
| dark | `var(--color-navy-blue-400)` | `var(--color-navy-blue-800)` |

Token jest używany w React. Ponowne wygenerowanie `dist` zmieni jego wartość, dlatego wymaga regresji wizualnej i świadomej akceptacji zamiast traktowania jako czysto techniczne odświeżenie.

## Różnice kontraktu light/dark

Light ma 193 nazwy, dark 194. Wspólnych jest 191 nazw.

### Tylko light

```text
color.controls.disconnect.border.positive
color.controls.disconnect.border.subtle-accent
```

### Tylko dark

```text
color.border.positive
color.border.strong
color.button.text.strong
```

Spośród 191 wspólnych nazw:

- 171 ma różne wartości/referencje pomiędzy light i dark;
- 20 ma tę samą wartość/referencję;
- wszystkie referencje w obu źródłach prowadzą do istniejących tokenów — nie wykryto unresolved references.

Pięć nazw występujących tylko w jednym motywie jest niespójnością strukturalną do rozstrzygnięcia. Nie należy automatycznie kopiować wartości między motywami bez potwierdzenia ich semantyki.

## Wpływ na generowane artefakty

| Artefakt | Obecnie | Oczekiwane ze źródeł |
|---|---:|---:|
| `tokens.css` | 44 | 51 |
| `tokens.light.css` | 43 | 193 |
| `tokens.dark.css` | 43 | 194 |
| `tokens.tailwind.css` | 87 | 244 — 51 base + 193 light |
| `_variables_light.scss` | 87 | 244 — 51 base + 193 light |
| `_variables_dark.scss` | 87 | 245 — 51 base + 194 dark |

## Wnioski do dalszych etapów

1. Nie wolno uznać obecnego `dist` za reprezentację aktualnego źródła.
2. Pierwszy deterministyczny rebuild będzie dużą zmianą publicznego API, mimo że większość zmian jest addytywna.
3. Przed rebuildem trzeba zabezpieczyć użycia Reacta i osobno zaakceptować zmianę `button-background-inactive`.
4. Light/dark muszą uzyskać identyczny zestaw nazw przed wprowadzeniem automatycznej bramki parzystości.
5. Po naprawie pipeline'u oczekiwane liczby muszą być wyliczane automatycznie, a nie utrzymywane ręcznie.

## Metoda porównania

- spłaszczono obiekty posiadające pole `value` do ścieżek tokenów;
- zastosowano odpowiednik transformacji nazw `kebab-case` Style Dictionary;
- referencje `{color.*}` porównano z wynikowym `var(--color-*)`;
- wartości hex porównano bez rozróżniania wielkości liter;
- deklaracje CSS odczytano z istniejących plików `dist`, bez ich modyfikowania.

