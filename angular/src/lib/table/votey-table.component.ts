import {
  ChangeDetectionStrategy, Component, computed, contentChildren, DestroyRef,
  effect, inject, input, model, output, signal, TemplateRef, viewChild,
  type InputSignal, type ModelSignal, type OutputEmitterRef, type Signal, type WritableSignal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Dialog, DialogModule, type DialogRef } from "@angular/cdk/dialog";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyCheckboxComponent } from "../checkbox/votey-checkbox.component";
import { VoteySearchComponent } from "../search/votey-search.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyPaginationComponent } from "../pagination/votey-pagination.component";
import { defaultFetchParams, type PaginationEvent } from "../pagination/pagination.model";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { injectVoteyTranslator, type VoteyTranslator } from "../translation/votey-translation";
import { VoteyTableCellDirective } from "./votey-table-cell.directive";
import { matchesTableSearch, updateTableSelection } from "./table-state";
import type {
  VoteyTableCellContext, VoteyTableColumn, VoteyTableFilters, VoteyTableKey,
  VoteyTableQuery, VoteyTableSearchMode, VoteyTableSelectionContext, VoteyTableHeaderVariant,
} from "./table.model";

@Component({
  selector: "vt-table",
  templateUrl: "./votey-table.component.html",
  styleUrl: "./votey-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, DialogModule, VoteyButtonComponent, VoteyCheckboxComponent,
    VoteySearchComponent, VoteyTextComponent, VoteyPaginationComponent, VoteyTranslatePipe],
})
export class VoteyTableComponent<T> {
  public readonly rows: InputSignal<readonly T[]> = input.required<readonly T[]>();
  public readonly columns: InputSignal<readonly VoteyTableColumn<T>[]> = input.required<readonly VoteyTableColumn<T>[]>();
  public readonly rowKey: InputSignal<(row: T) => VoteyTableKey> = input.required<(row: T) => VoteyTableKey>();
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly headerVariant: InputSignal<VoteyTableHeaderVariant> = input<VoteyTableHeaderVariant>("standard");
  public readonly selectable: InputSignal<boolean> = input(false);
  public readonly selectedKeys: ModelSignal<readonly VoteyTableKey[]> = model<readonly VoteyTableKey[]>([]);
  public readonly paginated: InputSignal<boolean> = input(false);
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

  protected readonly blocked: Signal<boolean> = computed(() => this.loading() || this.disabled() || this.confirming());
  protected readonly filteredRows: Signal<readonly T[]> = computed(() => {
    const rows: readonly T[] = this.rows();
    if (this.searchMode() !== "local" || !this.appliedSearch()) return rows;
    const columns: readonly VoteyTableColumn<T>[] = this.columns().filter((column) => column.searchable);
    return rows.filter((row: T) => matchesTableSearch(columns.map((column) => column.value(row)), this.appliedSearch()));
  });
  protected readonly visibleRows: Signal<readonly T[]> = computed(() => {
    const rows: readonly T[] = this.filteredRows();
    return this.searchMode() === "local" && this.paginated()
      ? rows.slice(this.page() * this.size(), (this.page() + 1) * this.size()) : rows;
  });
  protected readonly resultCount: Signal<number> = computed(() => this.searchMode() === "local" ? this.filteredRows().length : this.totalElements());
  protected readonly hasQuery: Signal<boolean> = computed(() => !!this.appliedSearch() || Object.keys(this.appliedFilters()).length > 0);
  protected readonly allSelected: Signal<boolean> = computed(() => this.visibleRows().length > 0 && this.visibleRows().every((row: T) => this.selectedKeys().includes(this.rowKey()(row))));
  protected readonly someSelected: Signal<boolean> = computed(() => !this.allSelected() && this.visibleRows().some((row: T) => this.selectedKeys().includes(this.rowKey()(row))));
  protected readonly skeletonRows: Signal<readonly number[]> = computed(() => Array.from({ length: this.paginated() ? this.size() : 5 }, (_, index: number) => index));
  protected readonly columnCount: Signal<number> = computed(() => this.columns().length + (this.selectable() ? 1 : 0));
  protected readonly tableWidth: Signal<number> = computed(() => this.columns().reduce(
    (width: number, column: VoteyTableColumn<T>): number => width + (column.width ?? 180),
    this.selectable() ? 56 : 0,
  ));
  protected readonly viewColumns: Signal<readonly { definition: VoteyTableColumn<T>; template: TemplateRef<VoteyTableCellContext<T>> | null }[]> = computed(() => this.columns().map((definition) => ({
    definition, template: this.cellTemplates().find((cell) => cell.vtTableCell() === definition.id)?.template ?? null,
  })));
  protected readonly viewRows: Signal<readonly { key: VoteyTableKey; row: T; control: FormControl<boolean | null>; selected: boolean; cells: readonly VoteyTableCellContext<T>[] }[]> = computed(() => {
    return this.visibleRows().map((row: T, index: number) => {
      const key: VoteyTableKey = this.rowKey()(row);
      const selected: boolean = this.selectedKeys().includes(key);
      return { key, row, selected, control: new FormControl<boolean | null>(selected),
        cells: this.columns().map((column) => ({ $implicit: row, column, value: column.value(row), index })) };
    });
  });

  public constructor() {
    effect(() => {
      const search: string = this.search();
      this.appliedSearch.set(search);
      this.searchControl.setValue(search, { emitEvent: false });
    });
    effect(() => this.appliedFilters.set(this.filters()));
    effect(() => this.selectAllControl.setValue(this.allSelected(), { emitEvent: false }));
    effect(() => { this.visibleRows(); this.anchor = null; });
    effect(() => {
      this.rows(); this.page(); this.size(); this.filters(); this.search();
      this.activeDialog?.close(false);
    });
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value: string | null) => {
        if (this.selectedKeys().length === 0 && (value ?? "").trim().length >= 3) this.submitSearch();
      });
    this.destroyRef.onDestroy(() => this.activeDialog?.close(false));
  }

  /** Call before applying external filters or fetching data; cancellation leaves applied inputs intact. */
  public async requestFilters(filters: VoteyTableFilters): Promise<boolean> {
    if (this.blocked()) return false;
    const accepted: boolean = await this.confirmSelectionReset();
    if (this.destroyRef.destroyed) return false;
    if (!accepted) {
      this.filtersCancelled.emit(filters);
      return false;
    }
    this.appliedFilters.set(filters);
    this.emitQuery(0);
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
    this.emitQuery(0);
  }

  protected rememberSelection(event: MouseEvent): void { this.shiftSelection = event.shiftKey; }

  protected selectRow(index: number, checked: boolean): void {
    if (this.blocked()) return;
    const keys: readonly VoteyTableKey[] = this.visibleRows().map(this.rowKey());
    this.selectedKeys.set(updateTableSelection(this.selectedKeys(), keys, checked, index, this.shiftSelection ? this.anchor : null));
    this.anchor = index;
    this.shiftSelection = false;
  }

  protected selectAll(checked: boolean): void {
    if (this.blocked()) return;
    this.selectedKeys.set(updateTableSelection(this.selectedKeys(), this.visibleRows().map(this.rowKey()), checked));
    this.anchor = null;
  }

  protected paginate(event: PaginationEvent): void {
    if (!this.blocked()) this.emitQuery(event.page, event.size);
  }

  protected activateRow(row: T, event: MouseEvent): void {
    const target: EventTarget | null = event.target;
    if (!this.blocked() && target instanceof Element && !target.closest("button, a, input, select, textarea, vt-checkbox, [data-table-interactive]")) this.rowClick.emit(row);
  }

  protected closeConfirmation(accepted: boolean): void { this.activeDialog?.close(accepted); }

  private emitQuery(page: number, size: number = this.size()): void {
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
