import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";
import { TableApiGuide } from "../../components/TableApiGuide";

const labels = {
  "LABEL.SEARCH": "Szukaj (minimum 3 znaki)",
  "LABEL.TABLE_CLEAR_SEARCH": "Wyczyść wyszukiwanie",
  "LABEL.TABLE_SELECT_VISIBLE": "Zaznacz wszystkie widoczne rekordy",
  "LABEL.TABLE_SELECT_ROW": "Zaznacz rekord",
  "MESSAGE.SELECTED_RECORDS": "Zaznaczone rekordy",
  "MESSAGE.TABLE_EMPTY": "Brak danych",
  "MESSAGE.TABLE_NO_RESULTS": "Brak wyników wyszukiwania lub filtrowania",
  "MESSAGE.TABLE_ERROR": "Nie udało się pobrać danych",
  "MESSAGE.TABLE_CONFIRM_TITLE": "Wyczyścić zaznaczenie?",
  "MESSAGE.TABLE_CONFIRM_RESET": "Zastosowanie wyszukiwania lub filtrów wyczyści zaznaczone rekordy na wszystkich stronach.",
  "BUTTON.TABLE_KEEP_SELECTION": "Zachowaj zaznaczenie",
  "BUTTON.TABLE_APPLY_AND_CLEAR": "Zastosuj i wyczyść",
  "BUTTON.TABLE_RETRY": "Spróbuj ponownie",
  "LABEL.PAGINATION": "Paginacja",
  "LABEL.PREVIOUS_PAGE": "Poprzednia strona",
  "LABEL.NEXT_PAGE": "Następna strona",
  "LABEL.ITEMS_PER_PAGE": "Na stronie",
  "LABEL.PAGE": "Strona",
  "LABEL.TABLE_DEMO": "Uczestnicy",
  "LABEL.TABLE_NAME": "Imię i nazwisko",
  "LABEL.TABLE_EMAIL": "Adres e-mail",
  "LABEL.TABLE_GROUP": "Grupa",
  "LABEL.TABLE_STATUS": "Status",
  "LABEL.TABLE_ACTIONS": "Akcje",
  "BUTTON.TABLE_DEMO_FILTER": "Przełącz filtr aktywnych",
  "BUTTON.TABLE_DEMO_EDIT": "Edytuj",
  "BUTTON.TABLE_DEMO_BULK": "Akcja dla zaznaczonych",
};

const sourceRows = Array.from({ length: 57 }, (_, index) => ({
  id: index + 1,
  name: ["Anna Kowalska", "Jan Nowak", "Maria Wiśniewska", "Piotr Zieliński"][index % 4] + ` ${index + 1}`,
  email: `uczestnik.${index + 1}@przyklad.pl`,
  group: index % 3 === 0 ? "Wspólnicy" : "Uczestnicy",
  active: index % 3 !== 0,
}));

const columns = [
  { id: "name", header: "LABEL.TABLE_NAME", width: 240, searchable: true, value: row => row.name },
  { id: "email", header: "LABEL.TABLE_EMAIL", width: 300, searchable: true, value: row => row.email },
  { id: "group", header: "LABEL.TABLE_GROUP", width: 180, searchable: true, value: row => row.group },
  { id: "status", header: "LABEL.TABLE_STATUS", width: 140, value: row => row.active ? "Aktywny" : "Nieaktywny" },
  { id: "actions", header: "LABEL.TABLE_ACTIONS", role: "actions", width: 120, value: () => "" },
];

function AngularTablePreview(props) {
  const hostRef = useRef(null);
  const runtimeRef = useRef(null);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let mounted = true;
    async function mount() {
      await import("@angular/compiler");
      const [ng, platform, ds] = await Promise.all([
        import("@angular/core"), import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);
      if (!mounted) return;
      class TableDemo {
        constructor() {
          this.changeDetector = ng.inject(ng.ChangeDetectorRef);
          this.args = latest.current;
          this.page = 0;
          this.size = 10;
          this.rows = [];
          this.count = 0;
          this.loading = false;
          this.selected = [];
          this.filters = {};
          this.search = "";
          this.columns = columns;
          this.key = row => row.id;
          this.timer = null;
          ng.inject(ng.DestroyRef).onDestroy(() => clearTimeout(this.timer));
          this.update(this.args);
        }
        update(args) {
          this.args = args;
          this.error = args.error;
          this.columns = args.wide ? columns.map(column => ({ ...column, width: column.id === "email" ? 500 : 260 })) : columns;
          this.fetch(false);
        }
        fetch(delay) {
          clearTimeout(this.timer);
          const apply = () => {
            let rows = this.args.empty ? [] : sourceRows;
            if (this.filters.active) rows = rows.filter(row => row.active);
            if (this.args.searchMode === "remote" && this.search) {
              const phrase = this.search.toLocaleLowerCase();
              rows = rows.filter(row => [row.name, row.email, row.group].some(value => value.toLocaleLowerCase().includes(phrase)));
            }
            this.count = rows.length;
            this.rows = this.args.paginated && this.args.searchMode !== "local"
              ? rows.slice(this.page * this.size, (this.page + 1) * this.size) : rows;
            this.loading = this.args.loading;
            this.changeDetector.markForCheck();
          };
          if (delay) {
            this.loading = true;
            this.timer = setTimeout(apply, 450);
          } else apply();
        }
        query(event) {
          this.page = event.page;
          this.size = event.size;
          this.filters = event.filters;
          this.search = event.search;
          latest.current.onQueryChange(event);
          this.fetch(this.args.searchMode === "remote");
        }
        selection(keys) { this.selected = keys; latest.current.onSelectionChange(keys); }
        edit(row) { latest.current.onRowAction(row); }
        bulk() { latest.current.onBulkAction(this.selected); }
        retry() { latest.current.onRetry(); this.error = false; this.fetch(true); }
      }
      // JIT demo host composes only public package components and directives.
      ng.Component({
        selector: "vt-table-demo", standalone: true,
        imports: [ds.VoteyTableComponent, ds.VoteyTableCellDirective, ds.VoteyButtonComponent, ds.VoteyTextComponent],
        template: `
          <vt-table #table label="LABEL.TABLE_DEMO" [rows]="rows" [columns]="columns" [rowKey]="key"
            [headerVariant]="args.headerVariant"
            [selectable]="args.selectable" [paginated]="args.paginated" [page]="page" [size]="size"
            [totalElements]="count" [loading]="loading" [error]="error" [disabled]="args.disabled"
            [searchMode]="args.searchMode" [search]="search" [filters]="filters"
            [selectedKeys]="selected" [selectionActions]="bulkActions"
            (selectedKeysChange)="selection($event)" (queryChange)="query($event)" (retry)="retry()"
            (rowClick)="edit($event)">
            @if (args.searchMode !== 'none') {
              <vt-button vtTableToolbar variant="secondary" text="BUTTON.TABLE_DEMO_FILTER"
                [disabled]="loading" (pressed)="table.requestFilters({active: !filters.active})" />
            }
            <ng-template vtTableCell="actions" [vtTableCellOf]="table" let-row>
              <vt-button variant="ghost" ico="ui-edit" text="BUTTON.TABLE_DEMO_EDIT" [disabled]="args.disabled || loading" (pressed)="edit(row)" />
            </ng-template>
            @if (args.custom) {
              <ng-template vtTableCell="status" [vtTableCellOf]="table" let-row>
                <vt-text variant="caption-extrabold" [color]="row.active ? 'accent' : 'muted'" [content]="row.active ? 'Aktywny' : 'Nieaktywny'" />
              </ng-template>
            }
          </vt-table>
          <ng-template #bulkActions let-keys>
            <vt-button text="BUTTON.TABLE_DEMO_BULK" [disabled]="loading" (pressed)="bulk()" />
          </ng-template>
        `,
      })(TableDemo);
      const app = await platform.createApplication({ providers: [
        ds.provideVoteySvgRegistry(),
        { provide: ds.VOTEY_TRANSLATOR, useValue: { translate: key => labels[key] ?? key } },
      ] });
      if (!mounted || !hostRef.current) { app.destroy(); return; }
      const host = document.createElement("vt-table-demo");
      hostRef.current.replaceChildren(host);
      const ref = ng.createComponent(TableDemo, { environmentInjector: app.injector, hostElement: host });
      app.attachView(ref.hostView);
      runtimeRef.current = { app, ref };
      app.tick();
    }
    void mount();
    return () => {
      mounted = false;
      const runtime = runtimeRef.current;
      if (runtime) { runtime.app.detachView(runtime.ref.hostView); runtime.ref.destroy(); runtime.app.destroy(); }
      runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (runtime) { runtime.ref.instance.update(props); runtime.app.tick(); }
  }, [props]);
  return <div ref={hostRef} />;
}

export default {
  title: "ANGULAR COMPONENTS/Table", component: AngularTablePreview,
  parameters: { layout: "padded" },
  argTypes: {
    searchMode: { control: "select", options: ["none", "local", "remote"] },
    headerVariant: { control: "select", options: ["standard", "heavy"] },
  },
  args: {
    selectable: false, paginated: false, searchMode: "none", custom: false, headerVariant: "standard",
    loading: false, empty: false, error: false, disabled: false, wide: false,
    onQueryChange: fn(), onSelectionChange: fn(), onRowAction: fn(), onBulkAction: fn(), onRetry: fn(),
  },
};

export const Basic = {};
export const ApiAndUsage = {
  name: "API & Usage",
  render: () => <TableApiGuide />,
  parameters: { controls: { disable: true }, actions: { disable: true } },
};
export const HeavyHeader = { args: { headerVariant: "heavy", selectable: true } };
export const CustomCellsAndActions = { args: { custom: true } };
export const Selection = { args: { selectable: true, searchMode: "local" } };
export const Pagination = { args: { paginated: true, searchMode: "remote" } };
export const SelectionAndPagination = { args: { selectable: true, paginated: true, searchMode: "remote" } };
export const Loading = { args: { loading: true, selectable: true, paginated: true } };
export const Empty = { args: { empty: true } };
export const Error = { args: { error: true } };
export const WideTable = { args: { wide: true, selectable: true, custom: true } };
