# Punkt 6 — raport ze spike’a alpha composition

Data: 2026-07-22  
Status: lokalny spike zakończony; decyzje i kontrolny round-trip Tokens Studio pozostają otwarte  
Zakres zmian: wyłącznie pliki robocze `.tmp`; bez zmian produkcyjnych tokenów, `dist` i Figma Variables

## Wniosek

Najlepszym canonical formatem dla obecnego workflow jest Color Token Tokens Studio:

```text
rgba({opaque-core-color}, {opacity-number})
```

Zapis zachowuje dwie jawne referencje wymagane przez decyzję 4D, jest oficjalnie wspierany przez Tokens Studio i używa foundation opacity typu `number`, zgodnie z 4A.

Repo nie jest jeszcze gotowe do publikacji takiego tokenu. Style Dictionary 3.9.2 rozwiązuje formułę do `rgba(#hex, alpha)`, lecz obecny filtr semantic pomija wartości niezaczynające się od `{color.}`, a finalna składnia CSS wymaga transformu HEX → kanały RGB.

Rekomendowany następny krok po decyzjach: osobny, zabezpieczony testami upgrade do Style Dictionary 5.5.0 oraz `@tokens-studio/sd-transforms` 2.0.3.

## Dowody lokalne

Skrypt [point-6-alpha-composition-spike.js](./point-6-alpha-composition-spike.js) potwierdził:

- rozwiązanie `rgba({color.black}, {opacity.8})` do `rgba(#000000, 0.08)`;
- wynik CSS `rgba(0, 0, 0, 0.08)`;
- wynik Figma `{r: 0, g: 0, b: 0, a: 0.08}`;
- zachowanie zielonych kanałów RGB w `rgba(21, 125, 64, 0)`;
- rozwiązanie dwóch referencji we własnym recipe object, ale brak korzyści dla authoringu Tokens Studio;
- brak rozpoznawania `$value`/`$type` przez Style Dictionary 3.9.2;
- zatrzymanie przetwarzania dla brakującej i cyklicznej referencji;
- identyczny manifest przy powtórzonym uruchomieniu.

## Granica potwierdzenia

Nie zapisano testowych Variables w produkcyjnym pliku Figma. Oficjalna dokumentacja potwierdza obsługę formuły przez Tokens Studio, ale naszą konfigurację GitHub storage trzeba potwierdzić kontrolnym round-trip po zatwierdzeniu 6A–6E:

```text
Tokens Studio formula
  → branch / merge request
  → ponowny pull tokenów
  → export resolved RGBA Variable
  → porównanie recipe i wartości wynikowej
```

Pełna tabela decyzji znajduje się w [stage-1-token-contract-decisions.md](./stage-1-token-contract-decisions.md), w punkcie 6.
