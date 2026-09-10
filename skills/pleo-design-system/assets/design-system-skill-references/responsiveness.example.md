# Responsiveness

- `responsive.mode`: `<device-contract/css-media>`
- Device types: `<runtime data-device values>`
- Device → reference breakpoint map: `<responsive.deviceBreakpointMap or empty for css-media>`
- Breakpoint names/order: `<list>`
- Breakpoint token source/path: `<file and tokenPath>`
- Device multipliers: `<device -> positive number>`
- Implicit breakpoint fallbacks: `<breakpoint -> explicit breakpoint>`
- Runtime provider/service: `<path/import-or-not-applicable>`
- Grid enabled: `<true/false>`
- Grid variants/default: `<list>`
- Grid tokens: `<columns/gutter/margin/margin-extra source and generated config>`
- Grid calculation: `<reference px -> vw and column-width implementation path>`
- Overlay: `<component/path and activation>`

## Reusable patterns

| Pattern | Wrapper/API | Intended layout | Supported modes |
| --- | --- | --- | --- |
| `<name>` | `<class/component>` | `<purpose>` | `<devices/viewports>` |

## Project rules

Podczas tworzenia tej referencji zastosuj przypięty kontrakt `responsive-device` albo `responsive-media` oraz warunkowy `grid-layout`. Gotowy plik ma samodzielnie opisywać charakterystyczne warianty, patterny, ścieżki, wyjątki, wybór main/nested/pattern, mapowanie Figmy, granicę style-vs-behavior i obowiązkową walidację.

Podczas tworzenia lub aktualizacji tej referencji wyprowadź z globalnego `change-scenarios.md` krótkie projektowe procedury add/edit/remove, komendy i miejsca użyć. Gotowa referencja ma wystarczać do codziennego tasku bez uruchamiania `pleo-design-system`. Dla `grid.enabled: false` oznacz grid, provider i overlay jako `not-applicable`; dla `css-media` analogicznie oznacz runtime device detector, mapowanie urządzeń i mnożniki.

## Validation

- Commands/routes: `<commands and preview routes>`
- Viewports/devices: `<matrix>`
- Allowed edge tolerance: `<= 3px` albo `<approved exception>`
- Required evidence: screenshot, left/right measurements, chosen grid/pattern
