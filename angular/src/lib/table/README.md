# Table

Storybook: **ANGULAR COMPONENTS / Table / API & Usage** contains a Polish
technical guide with the complete inputs, outputs, column model, template
contexts, integration examples and selection confirmation workflow.

Angular public entry point: `@pleodigital/design-system-votey/angular`.

`VoteyTableComponent<T>` renders tabular data; `VoteyTableCellDirective` projects
custom cells. It composes Votey input, button, checkbox, text and pagination.
CDK Dialog and a local row skeleton are explicitly approved exceptions because
the package has no corresponding Votey components.

```html
<vt-table #table label="LABEL.MEMBERS" [rows]="rows()" [columns]="columns"
  [rowKey]="rowKey" [selectable]="true" [(selectedKeys)]="selectedKeys"
  [paginated]="true" [page]="page()" [size]="size()"
  [totalElements]="totalElements()" [loading]="loading()" [error]="error()"
  searchMode="remote" [search]="appliedSearch()" [filters]="appliedFilters()"
  (queryChange)="fetch($event)" (retry)="retry()">
  <ng-template vtTableCell="actions" [vtTableCellOf]="table" let-row>
    <vt-button ico="ui-edit" [ariaLabel]="editLabel" (pressed)="edit(row)" />
  </ng-template>
</vt-table>
```

The consumer supplies a stable `rowKey: (row: T) => string | number` and columns:

```ts
const columns: VoteyTableColumn<Member>[] = [
  { id: 'name', header: 'LABEL.NAME', width: 240, searchable: true, value: row => row.name },
  { id: 'actions', header: 'LABEL.ACTIONS', role: 'actions', width: 120, value: () => '' },
];
```

Column widths are pixels, with a default of 180px when omitted. The table keeps
at least the container width and scrolls when its column widths exceed it. Use one
actions column, last in the configuration; it sticks to the right. Selection
sticks to the left and headers stick to the top of the 66vh scrolling viewport.
Headers use `vt-text` `caption-extrabold`; default data cells explicitly use `body`.
`headerVariant` accepts `standard` (default: white background, primary text)
or `heavy` (`--color-bg-inverse` background, inverse text, first/last cell corners
using the same `--radius-xl` as data rows). `VoteyTableHeaderVariants` and its
derived type `VoteyTableHeaderVariant` are public exports.
Custom cell context contains `$implicit` (record), `value`, `column`, and `index`
(index on the visible page). Values returned by `value` supply default rendering
and local search independently of the visual template.
Use `[vtTableCellOf]="table"` to infer the record type in strict Angular templates.

`selectedKeys` is a model of identifiers across pages. The header toggles only
visible rows, supports indeterminate, and Shift toggles an inclusive visible
range. Pass `selectionActions` a template whose implicit value is all selected
keys. Replacing rows does not reset selection. `rowClick` ignores standard
interactive descendants. Mark other custom controls `data-table-interactive`.

## Queries and confirmation

`queryChange` emits `{ page, size, search, filters }`. Pages are zero-based and
pagination uses `vt-pagination`; the default size is 20 and size options are
10, 20, 50, 100. There are no requests inside the table.

- `searchMode="none"`: no built-in search; paginated rows are supplied by the consumer.
- `searchMode="remote"`: supply the server's current page and `totalElements`.
- `searchMode="local"`: supply the entire dataset. The table searches values of
  columns with `searchable: true` and, when paginated, slices the result using
  the controlled `page` and `size`. `queryChange` still informs the consumer to
  update controlled page parameters, but no search HTTP request is needed.

Search is debounced 300 ms, with at least 3 trimmed characters. With a selection,
Enter or the search button is required, then a built-in dialog confirms resetting
selection. X restores the dataset without the search condition, preserving other
filters; it also requires confirmation when selection exists. One or two typed
characters leave the applied query and results intact. X with no applied search
only clears the draft, since no results or selection need resetting.

External filter controls belong in `[vtTableToolbar]`. Keep their draft separate
from the applied inputs. **Call `await table.requestFilters(candidate)` before
changing applied filters or fetching data.** Acceptance clears selected keys and
emits `queryChange`; cancellation returns false and emits `filtersCancelled` with
the rejected candidate. The consumer restores its draft as needed. Escape or
backdrop dismissal also cancels. Do not fetch first and seek confirmation later.

The `search` and `filters` inputs represent already accepted external state;
assigning them directly bypasses the transaction. Accepted output parameters
should be mirrored into these inputs by the consumer. Paging preserves selection.
Changes in source rows, page, size or controlled query while a dialog is open
cancel that pending transaction rather than apply it to a new context.

Loading disables table controls and replaces the body with skeleton rows: page
size when paginated, otherwise 5. `error` shows the retry action; `retry` emits
an intent. `emptyText`, `noResultsText` and `errorText` can override the default
translation keys. Non-empty applied search or filters selects the no-results
message for an empty response.

## Translation keys

The consumer supplies translations via `VOTEY_TRANSLATOR`; Storybook demonstrates
Polish values. Existing keys such as `LABEL.SEARCH`, `MESSAGE.SELECTED_RECORDS`
and pagination labels are reused. New keys:

| Key | Polish text |
| --- | --- |
| `LABEL.TABLE_CLEAR_SEARCH` | Wyczyść wyszukiwanie |
| `LABEL.TABLE_SELECT_VISIBLE` | Zaznacz wszystkie widoczne rekordy |
| `LABEL.TABLE_SELECT_ROW` | Zaznacz rekord |
| `MESSAGE.TABLE_EMPTY` | Brak danych |
| `MESSAGE.TABLE_NO_RESULTS` | Brak wyników wyszukiwania lub filtrowania |
| `MESSAGE.TABLE_ERROR` | Nie udało się pobrać danych |
| `MESSAGE.TABLE_CONFIRM_TITLE` | Wyczyścić zaznaczenie? |
| `MESSAGE.TABLE_CONFIRM_RESET` | Zastosowanie wyszukiwania lub filtrów wyczyści zaznaczone rekordy na wszystkich stronach. |
| `BUTTON.TABLE_KEEP_SELECTION` | Zachowaj zaznaczenie |
| `BUTTON.TABLE_APPLY_AND_CLEAR` | Zastosuj i wyczyść |
| `BUTTON.TABLE_RETRY` | Spróbuj ponownie |

Demo-only labels use the same `LABEL`, `MESSAGE` and `BUTTON` prefixes and do not
add business texts to the package runtime. The checkbox's projected visually
hidden text supplies its accessible name using its existing content API.

## Validation

Run `npm run build:angular`, `node --test tests/table-state.test.js`,
`npm run test:tokens`, and `npm run build-storybook`. Node tests cover range
selection, selection across pages, search matching and public exports. The
Angular `.spec.ts` additionally describes confirmation and record replacement;
the repository does not currently configure a runner for Angular TestBed specs.
Check Table stories for dialog acceptance/cancellation, search, pagination,
custom cells, skeleton, sticky corners, overflow and light/dark rendering.
