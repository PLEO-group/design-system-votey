# Search

Public export: `VoteySearchComponent` from
`@pleodigital/design-system-votey/angular`, selector `vt-search`.

Composes `vt-input` and `vt-button`. The input's public `[vtInputSuffix]`
projection slot places the actions inside its field, after the text: clear X,
then search icon at the right edge. X is rendered only for a non-empty value.

```html
<vt-search label="" ariaLabel="LABEL.SEARCH" [control]="searchControl"
  [disabled]="loading()" (searched)="search($event)" (cleared)="clearSearch()" />
```

Uses the inherited `control: FormControl<string | null>` integration. `label` is
required; use an empty label with `ariaLabel` for an unlabelled toolbar field.
Inputs: `placeholder`, `ariaLabel`, `searchLabel` (default `LABEL.SEARCH`),
`clearLabel` (default `LABEL.TABLE_CLEAR_SEARCH`, reusing the existing table
translation contract), `disabled`, `id`, `name`, `dataCy`.

`searched` emits the current unmodified string when the search button or Enter
is pressed. `cleared` emits after clearing the shared control to `""` and marking
it dirty. Disabled control or disabled input blocks both actions. The component
does not perform HTTP, filtering, minimum-length checks or debounce; these belong
to its consumer. The table retains its existing query and confirmation rules.

If clear requires confirmation, keep applied query separate from the draft;
on cancellation restore the accepted value in the control, as `vt-table` does.
