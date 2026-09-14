# Tokens

- Figma project: `<resolved designSource.projectUrl>`
- Figma Variables source: `<resolved tokens.sourceOfTruth.url or approved alternative>`
- Canonical link location: `references/design-system-manifest.json` →
  `designSource.projectUrl` and `tokens.sourceOfTruth.url`
- Import/export command: `<command>`
- Core source paths: `<paths>`
- Semantic common/light/dark paths: `<paths>`
- Style Dictionary config and command: `<paths/commands>`
- Angular outputs: `<paths or not-applicable>`
- React outputs: `<paths or not-applicable>`
- Grid token source: `<responsive.grid.tokenFile or not-applicable>`

## Framework policies

| Framework | Category | Generate | Autocomplete | Allowed usage |
| --- | --- | --- | --- | --- |
| `<angular/react>` | `<color/spacing/...>` | `<core/semantic>` | `<core/semantic>` | `<core/semantic>` |

## Change workflow

Podczas tworzenia lub aktualizacji tej referencji wyprowadź projektowy przebieg z przypiętego kontraktu `foundation-tokens` i globalnego `change-scenarios.md`. Wpisz tutaj kompletną, krótką kolejność rutynowej zmiany oraz projektowe komendy importu z Figmy, generowania, walidacji i preview, a także dokładne ścieżki źródeł i outputów. Gotowa referencja ma wystarczać do codziennego tasku bez uruchamiania `pleo-design-system`. Jawnie oznacz grid jako włączony albo `not-applicable`; nie traktuj grid JSON jako eksportu Figma Variables.

Przy remove/rename podaj sposób przeszukania znanych konsumentów i lokalną politykę deprecacji. Nie edytuj wygenerowanych SCSS, CSS, Tailwind ani typów ręcznie.

## Figma parity verification

Zastąp tę sekcję konkretną procedurą projektu. Na prośbę agent ma bez ponownego
discovery otworzyć powyższy link Figma Variables, odczytać collections, modes,
typy, scopes, wartości i aliasy, rekurencyjnie rozwiązać aliasy oraz porównać je
ze źródłowymi tokenami kodu 1:1. Wpisz jawne mapowanie nazw kolekcji, modes i
breakpointów. Wynik ma podawać liczebności i listy tokenów brakujących,
nadmiarowych oraz różniących się. Snapshot, screenshot i build nie zastępują
odczytu aktualnej Figmy. Brak dostępu oznacza blokadę weryfikacji.
