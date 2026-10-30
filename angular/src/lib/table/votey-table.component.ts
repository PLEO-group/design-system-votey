import { MatTooltip } from "@angular/material/tooltip";
import {
  ChangeDetectionStrategy, Component, computed, contentChildren, DestroyRef,
  effect, inject, input, linkedSignal, model, output, signal, TemplateRef, viewChild,
  type OnInit, type OnDestroy, type InputSignal, type ModelSignal, type OutputEmitterRef, type Signal, type WritableSignal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Dialog, DialogModule, type DialogRef } from "@angular/cdk/dialog";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyCheckboxComponent } from "../checkbox/votey-checkbox.component";
import { VoteySearchComponent } from "../search/votey-search.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyPaginationComponent } from "../pagination/votey-pagination.component";
import { defaultFetchParams, type PaginationEvent } from "../pagination/pagination.model";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { injectVoteyTranslator, type VoteyTranslator } from "../translation/votey-translation";
import { VoteyTableCellDirective } from "./votey-table-cell.directive";
import { matchesTableSearch, updateTableSelection, resolveTablePage } from "./table-state";
import { readTableValue, resolveTableColumnsFromKeys, tableColumnKeys } from "./table-columns";
import { tableSearchTerms } from "./table-search";
import type {
  VoteyTableCellContext, VoteyTableColumn, VoteyTableFilters, VoteyTableKey,
  VoteyTableQuery, VoteyTableSearchMode, VoteyTablePaginationMode, VoteyTableSelectionContext, VoteyTableHeaderVariant,
} from "./table.model";

interface TableRowView<T> {
  key: VoteyTableKey | object;
  row: T;
  control: FormControl<boolean | null>;
  cells: readonly VoteyTableCellContext<T>[];
}

interface TableColumnView<T> {
  definition: VoteyTableColumn<T>;
  template: TemplateRef<VoteyTableCellContext<T>> | null;
}

@Component({
  selector: "vt-table",
  host: { "[class.fill-container]": "fillContainer()" },
  templateUrl: "./votey-table.component.html",
  styleUrl: "./votey-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, NgTemplateOutlet, DialogModule, VoteyButtonComponent, VoteyCheckboxComponent,
    VoteySearchComponent, VoteyTextComponent, VoteyPaginationComponent, VoteyTranslatePipe],
})
export class VoteyTableComponent<T> implements OnInit, OnDestroy {
  public readonly rows: InputSignal<readonly T[]> = input.required<readonly T[]>();
  public readonly columns: InputSignal<readonly VoteyTableColumn<T>[]> = input<readonly VoteyTableColumn<T>[]>([]);
  public readonly fillContainer: InputSignal<boolean> = input(false);
  public readonly autoColumns: InputSignal<boolean> = input(false);
  public readonly excludedColumns: InputSignal<readonly string[]> = input<readonly string[]>([]);
  public readonly headersPrefix: InputSignal<string> = input("");
  public readonly rowKey: InputSignal<((row: T) => VoteyTableKey) | undefined> = input<(row: T) => VoteyTableKey>();
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly headerVariant: InputSignal<VoteyTableHeaderVariant> = input<VoteyTableHeaderVariant>("standard");
  public readonly selectable: InputSignal<boolean> = input(false);
  public readonly selectedKeys: ModelSignal<readonly VoteyTableKey[]> = model<readonly VoteyTableKey[]>([]);
  public readonly pagination: InputSignal<VoteyTablePaginationMode> = input<VoteyTablePaginationMode>("none");
  public readonly page: InputSignal<number> = input(defaultFetchParams.page);
  public readonly size: InputSignal<number> = input(defaultFetchParams.size);
  public readonly totalElements: InputSignal<number> = input(0);
  public readonly pageSizeOptions: InputSignal<readonly number[]> = input<readonly number[]>([10, 20, 50, 100]);
  public readonly loading: InputSignal<boolean> = input(false);
  public readonly error: InputSignal<boolean> = input(false);
  public readonly disabled: InputSignal<boolean> = input(false);
  public readonly searchMode: InputSignal<VoteyTableSearchMode> = input<VoteyTableSearchMode>("none");
  public readonly search: InputSignal<string> = input("");
  public readonly filters: InputSignal<VoteyTableFilters> = input<VoteyTableFilters>({});
  public readonly emptyText: InputSignal<string> = input("MESSAGE.TABLE_EMPTY");
  public readonly noResultsText: InputSignal<string> = input("MESSAGE.TABLE_NO_RESULTS");
  public readonly errorText: InputSignal<string> = input("MESSAGE.TABLE_ERROR");
  public readonly selectionActions: InputSignal<TemplateRef<VoteyTableSelectionContext> | null> = input<TemplateRef<VoteyTableSelectionContext> | null>(null);
  public readonly queryChange: OutputEmitterRef<VoteyTableQuery> = output<VoteyTableQuery>();
  public readonly filtersCancelled: OutputEmitterRef<VoteyTableFilters> = output<VoteyTableFilters>();
  public readonly retry: OutputEmitterRef<void> = output<void>();
  public readonly rowClick: OutputEmitterRef<T> = output<T>();

  protected readonly searchControl: FormControl<string | null> = new FormControl<string | null>("");
  protected readonly selectAllControl: FormControl<boolean | null> = new FormControl<boolean | null>(false);
  private readonly appliedSearch: WritableSignal<string> = signal("");
  private readonly appliedFilters: WritableSignal<VoteyTableFilters> = signal<VoteyTableFilters>({});
  private readonly dialog: Dialog = inject(Dialog);
  private readonly translator: VoteyTranslator = injectVoteyTranslator();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly confirmation: Signal<TemplateRef<unknown>> = viewChild.required<TemplateRef<unknown>>("confirmation");
  private readonly cellTemplates: Signal<readonly VoteyTableCellDirective<T>[]> = contentChildren<VoteyTableCellDirective<T>>(VoteyTableCellDirective);
  private anchor: number | null = null;
  private shiftSelection: boolean = false;
  private activeDialog: DialogRef<boolean> | null = null;
  protected readonly confirming: WritableSignal<boolean> = signal(false);

  private readonly columnKeys: Signal<readonly string[]> = computed(
    () => this.autoColumns() ? tableColumnKeys(this.rows()) : [],
    { equal: (previous, current) => previous.length === current.length
      && previous.every((key, index) => key === current[index]) },
  );
  protected readonly resolvedColumns: Signal<readonly VoteyTableColumn<T>[]> = computed(() =>
    resolveTableColumnsFromKeys(this.columnKeys(), this.columns(), this.autoColumns(), this.excludedColumns(), this.headersPrefix()));

  protected readonly blocked: Signal<boolean> = computed(() => this.loading() || this.disabled() || this.confirming());
  protected readonly filteredRows: Signal<readonly T[]> = computed(() => {
    const rows: readonly T[] = this.rows();
    const search: string = this.appliedSearch();
    if (this.searchMode() !== "local" || !search) return rows;
    const columns: readonly VoteyTableColumn<T>[] = this.resolvedColumns().filter((column) => column.searchable);
    return rows.filter((row: T) => matchesTableSearch(columns.map((column) => readTableValue(row, column)), search));
  });
  private readonly localPagination: Signal<boolean> = computed(() =>
    this.pagination() === "local");
  private readonly localPage: WritableSignal<number> = linkedSignal(() => this.page());
  private readonly localSize: WritableSignal<number> = linkedSignal(() => this.size());
  protected readonly effectiveSize: Signal<number> = computed(() => this.localPagination() ? this.localSize() : this.size());
  protected readonly effectivePage: Signal<number> = computed(() => this.localPagination()
    ? resolveTablePage(this.localPage(), this.effectiveSize(), this.filteredRows().length) : this.page());
  protected readonly resultCount: Signal<number> = computed(() => this.localPagination() ? this.filteredRows().length : this.totalElements());
  protected readonly visibleRows: Signal<readonly T[]> = computed(() => {
    const rows: readonly T[] = this.filteredRows();
    const start: number = this.effectivePage() * this.effectiveSize();
    return this.localPagination() ? rows.slice(start, start + this.effectiveSize()) : rows;
  });
  protected readonly hasQuery: Signal<boolean> = computed(() => !!this.appliedSearch() || Object.keys(this.appliedFilters()).length > 0);
  private readonly selectedKeySet: Signal<ReadonlySet<VoteyTableKey>> = computed(() => new Set(this.selectedKeys()));
  private readonly visibleSelectionKeys: Signal<readonly VoteyTableKey[]> = computed(() =>
    this.selectable() ? this.visibleRows().map((row: T) => this.selectionKey(row)) : []);
  protected readonly allSelected: Signal<boolean> = computed(() => this.visibleSelectionKeys().length > 0
    && this.visibleSelectionKeys().every((key: VoteyTableKey) => this.selectedKeySet().has(key)));
  protected readonly someSelected: Signal<boolean> = computed(() => !this.allSelected()
    && this.visibleSelectionKeys().some((key: VoteyTableKey) => this.selectedKeySet().has(key)));
  protected readonly skeletonRows: Signal<readonly number[]> = computed(() => Array.from({ length: this.pagination() !== "none" ? this.effectiveSize() : 5 }, (_, index: number) => index));
  protected readonly columnCount: Signal<number> = computed(() => this.resolvedColumns().length + (this.selectable() ? 1 : 0));
  protected readonly tableWidth: Signal<number> = computed(() => this.resolvedColumns().reduce(
    (width: number, column: VoteyTableColumn<T>): number => width + (column.width ?? 180),
    this.selectable() ? 56 : 0,
  ));
  protected readonly viewColumns: Signal<readonly TableColumnView<T>[]> = computed(() => {
    const templates: Map<string, TemplateRef<VoteyTableCellContext<T>>> = new Map();
    for (const cell of this.cellTemplates()) {
      const id: string = cell.vtTableCell();
      if (!templates.has(id)) templates.set(id, cell.template);
    }
    return this.resolvedColumns().map((definition: VoteyTableColumn<T>) => ({
      definition, template: templates.get(definition.id) ?? templates.get("") ?? null,
    }));
  });
  private readonly rowViews: Signal<readonly TableRowView<T>[]> = computed(() =>
    this.visibleRows().map((row: T, index: number) => ({
      key: this.resolveRowKey(row), row,
      control: new FormControl<boolean | null>(false),
      cells: this.resolvedColumns().map((column: VoteyTableColumn<T>) =>
        ({ $implicit: row, column, value: readTableValue(row, column), index })),
    })));
  protected readonly viewRows: Signal<readonly (TableRowView<T> & { selected: boolean })[]> = computed(() =>
    this.rowViews().map((record: TableRowView<T>) => ({
      ...record, selected: this.selectable() && this.selectedKeySet().has(this.selectionKey(record.row)),
    })));

  public constructor() {
    this.synchronizeQueryInputs();
    this.synchronizeSelectionControls();
    this.observeTableContext();
  }

  public ngOnInit(): void {
    this.observeSearchTerms();
  }

  public ngOnDestroy(): void {
    this.activeDialog?.close(false);
  }

  public async requestFilters(filters: VoteyTableFilters): Promise<boolean> {
    if (this.blocked()) return false;
    const accepted: boolean = await this.confirmSelectionReset();
    if (this.destroyRef.destroyed) return false;
    if (!accepted) {
      this.filtersCancelled.emit(filters);
      return false;
    }
    this.appliedFilters.set(filters);
    this.updateQuery(0);
    return true;
  }

  protected async submitSearch(clear: boolean = false): Promise<void> {
    if (this.searchMode() === "none" || this.blocked()) return;
    const search: string = clear ? "" : (this.searchControl.value ?? "").trim();
    if (!clear && search.length < 3) return;
    if (search === this.appliedSearch()) {
      if (clear) this.searchControl.setValue("", { emitEvent: false });
      return;
    }
    const accepted: boolean = await this.confirmSelectionReset();
    if (this.destroyRef.destroyed) return;
    if (!accepted) {
      this.searchControl.setValue(this.appliedSearch(), { emitEvent: false });
      return;
    }
    this.searchControl.setValue(search, { emitEvent: false });
    this.appliedSearch.set(search);
    this.updateQuery(0);
  }

  protected rememberSelection(event: MouseEvent): void { this.shiftSelection = event.shiftKey; }

  protected selectRow(index: number, checked: boolean): void {
    if (this.blocked()) return;
    const keys: readonly VoteyTableKey[] = this.visibleSelectionKeys();
    this.selectedKeys.set(updateTableSelection(this.selectedKeys(), keys, checked, index, this.shiftSelection ? this.anchor : null));
    this.anchor = index;
    this.shiftSelection = false;
  }

  protected selectAll(checked: boolean): void {
    if (this.blocked()) return;
    this.selectedKeys.set(updateTableSelection(this.selectedKeys(), this.visibleSelectionKeys(), checked));
    this.anchor = null;
  }

  protected paginate(event: PaginationEvent): void {
    if (!this.blocked()) this.updateQuery(event.page, event.size);
  }

  protected activateRow(row: T, event: MouseEvent): void {
    const target: EventTarget | null = event.target;
    if (!this.blocked() && target instanceof Element && !target.closest("button, a, input, select, textarea, vt-checkbox, [data-table-interactive]")) this.rowClick.emit(row);
  }

  protected closeConfirmation(accepted: boolean): void { this.activeDialog?.close(accepted); }

  private resolveRowKey(row: T): VoteyTableKey | object {
    const custom: ((row: T) => VoteyTableKey) | undefined = this.rowKey();
    if (custom) return custom(row);
    if (row !== null && typeof row === "object") {
      const id: unknown = "id" in row ? row.id : undefined;
      if (typeof id === "string" || typeof id === "number") return id;
      if (!this.selectable()) return row;
    }
    throw new Error("vt-table: provide rowKey for selectable records without a string/number id or for primitive records.");
  }

  private selectionKey(row: T): VoteyTableKey {
    const key: VoteyTableKey | object = this.resolveRowKey(row);
    if (typeof key === "string" || typeof key === "number") return key;
    throw new Error("vt-table: selection requires a stable rowKey or a string/number id.");
  }

  private synchronizeQueryInputs(): void {
    effect(() => {
      const search: string = this.search();
      this.appliedSearch.set(search);
      this.searchControl.setValue(search, { emitEvent: false });
    });
    effect(() => this.appliedFilters.set(this.filters()));
  }

  private synchronizeSelectionControls(): void {
    effect(() => this.selectAllControl.setValue(this.allSelected(), { emitEvent: false }));
    effect(() => {
      for (const record of this.viewRows()) {
        record.control.setValue(record.selected, { emitEvent: false });
      }
    });
  }

  private observeTableContext(): void {
    effect(() => {
      this.visibleRows();
      this.anchor = null;
    });
    effect(() => {
      this.rows(); this.page(); this.size(); this.filters(); this.search();
      this.activeDialog?.close(false);
    });
  }

  private observeSearchTerms(): void {
    tableSearchTerms(this.searchControl.valueChanges).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        if (this.selectedKeys().length === 0 && value.length >= 3) void this.submitSearch();
      });
  }

  private updateQuery(page: number, size: number = this.effectiveSize()): void {
    if (this.localPagination()) {
      this.localSize.set(size);
      this.localPage.set(page);
      page = this.effectivePage();
    }
    this.emitQuery(page, size);
  }

  private emitQuery(page: number, size: number): void {
    this.queryChange.emit({ page, size, search: this.appliedSearch(), filters: this.appliedFilters() });
  }

  private async confirmSelectionReset(): Promise<boolean> {
    if (this.selectedKeys().length === 0) return true;
    const ref: DialogRef<boolean> = this.dialog.open<boolean>(this.confirmation(), {
      ariaLabel: this.translator.translate("MESSAGE.TABLE_CONFIRM_TITLE"), maxWidth: "95vw", autoFocus: "first-tabbable",
    });
    this.activeDialog = ref;
    this.confirming.set(true);
    return new Promise<boolean>((resolve) => {
      ref.closed.subscribe((accepted: boolean | undefined) => {
        this.activeDialog = null;
        this.confirming.set(false);
        if (accepted === true && !this.destroyRef.destroyed) this.selectedKeys.set([]);
        resolve(accepted === true && !this.destroyRef.destroyed);
      });
    });
  }
}
