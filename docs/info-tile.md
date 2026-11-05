# vt-info-tile

Presentational Angular tile based on Figma Card / EventTile (2422:3304).
Import `VoteyInfoTileComponent`, `VoteyInfoTileItem` and `VoteyInfoTileState`
from `@pleodigital/design-system-votey/angular`.

```html
<vt-info-tile
  [title]="title"
  [items]="details"
  illustration="bg-event-type-basic"
  state="running"
  [statusLabel]="translatedStatus"
/>
```

```ts
readonly details: readonly VoteyInfoTileItem[] = [
  { id: 'date', icon: 'ui-calendar', value: '11 FEB 2020 - 13 FEB 2020' },
  { id: 'count', icon: 'ui-voting', value: 0 },
];
```

| Input | Contract |
| --- | --- |
| `title` | Required string, naturally wraps. |
| `items` | Readonly array of `{ id, icon, value }`; unique stable IDs, public `VoteyIcon` names, string or number values. Default `[]`. |
| `illustration` | Public `VoteyIllustration` name. Empty (default) omits the image and reserved overlap. |
| `state` | `default`, `running`, `completed`, `test`, `not-launched` or `scheduled`. See the state matrix below. |
| `statusLabel` | Consumer-translated text. Shown in every state except `default`, when nonempty. Default empty. |

## State matrix

| State | Card | Status badge |
| --- | --- | --- |
| `default` | Surface, no border | Hidden |
| `running` | Accent primary border | Accent primary border |
| `scheduled` | Accent primary border | Navy blue 70 border |
| `not-launched` | Surface, no border | Yellow 400 border and text |
| `test` | Orange 300 border | Orange 300 border |
| `completed` | Surface, no border | Navy blue 100 border |

Completed fades the card and badge to 60% opacity, preserving the illustration.
It is a visual status, not an interactive disabled state. All visible labels
remain consumer-owned; the component does not derive business status from dates.
The four added states follow user-provided CRM screenshots and the existing
`events-list/line-block-list` styles, pending designer updates in Figma. They retain
the base tile geometry, including the 2px border. Orange/yellow/navy use existing
core tokens because CRM semantics have no matching status-border roles. No new
tokens or asset recoloring are introduced.

The tile fills its parent; the Figma example and Playground are 288px wide.
Long titles and values wrap, and item count is unrestricted. Icons and illustration
are decorative; each row's text must describe its meaning. No actions or domain
logic are built in. Consumers own translations and state selection.

Use the normal CRM token stylesheet, Open Sans font setup and
`provideVoteySvgRegistry()` with its SVG copy configuration. Playground:
`ANGULAR COMPONENTS/InfoTile`.

Figma mapping: surface/text/accent use CRM semantic color tokens; spacing uses
section-gap, inset-m, inset-l, stack-gap-m, gap-xs and inset-3xs; radii use 2xl/xs;
title and row text compose vt-text body-l/caption-s. The badge uses caption-s
metrics and the existing body-l-bold weight token (both designs specify 700).
The 150×105 illustration slot, 52px overlap, 62px top inset, 26px icon slots,
2px running border and 14px badge overlap come directly from the design.

Asset limitation: the library currently provides `bg-event-type-basic`, but no
separate light Tint asset used by the default Figma variant. Playground uses the
existing asset without recoloring. Illustration is fully consumer-configurable;
state never substitutes or recolors the supplied illustration. The sample copy
is English; consumers supply the actual translated content. Visual pixel parity
with both Figma illustration variants is therefore not claimed.
