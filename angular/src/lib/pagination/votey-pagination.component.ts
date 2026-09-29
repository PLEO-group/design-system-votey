import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteySelectComponent } from "../select/votey-select.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { VoteyTextComponent } from "../text/votey-text.component";
import { defaultFetchParams, type PaginationEvent } from "./pagination.model";

export type VoteyPaginationEvent = PaginationEvent;

@Component({
  selector: "vt-pagination",
  templateUrl: "./votey-pagination.component.html",
  styleUrl: "./votey-pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyIconComponent, VoteySelectComponent, VoteyTextComponent, VoteyTranslatePipe],
})
export class VoteyPaginationComponent {
  public readonly page: InputSignal<number> = input<number>(defaultFetchParams.page);
  public readonly size: InputSignal<number> = input<number>(defaultFetchParams.size);
  public readonly totalElements: InputSignal<number> = input<number>(0);
  public readonly pageSizeOptions: InputSignal<readonly number[]> =
    input<readonly number[]>([10, 20, 50, 100]);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly loading: InputSignal<boolean> = input<boolean>(false);
  public readonly pagination: OutputEmitterRef<PaginationEvent> =
    output<PaginationEvent>();

  protected readonly sizeControl: FormControl<number | null> = new FormControl<number | null>(null);

  protected readonly pageCount: Signal<number> = computed<number>(() => {
    const size: number = this.size();
    return size > 0 ? Math.ceil(Math.max(0, this.totalElements()) / size) : 0;
  });
  protected readonly currentPage: Signal<number> = computed<number>(() =>
    Math.min(Math.max(0, this.page()), Math.max(0, this.pageCount() - 1)),
  );
  protected readonly visiblePages: Signal<number[]> = computed<number[]>(() => {
    const count: number = this.pageCount();
    if (count === 0) return [];

    const start: number = Math.max(0, Math.min(this.currentPage() - 2, count - 5));
    return Array.from({ length: Math.min(5, count - start) }, (_, index: number) => start + index);
  });
  protected readonly startItem: Signal<number> = computed<number>(() =>
    this.totalElements() > 0 ? this.currentPage() * this.size() + 1 : 0,
  );
  protected readonly endItem: Signal<number> = computed<number>(() =>
    Math.min((this.currentPage() + 1) * this.size(), Math.max(0, this.totalElements())),
  );
  protected readonly rangeText: Signal<string> = computed<string>(
    () => `${this.startItem()}–${this.endItem()} / ${this.totalElements()}`,
  );

  public constructor() {
    effect((): void => {
      this.sizeControl.setValue(this.size(), { emitEvent: false });
    });
  }

  protected selectPage(page: number): void {
    if (this.disabled() || this.loading() || page < 0 || page >= this.pageCount() || page === this.currentPage()) return;
    this.pagination.emit({ page, size: this.size() });
  }

  protected selectSize(value: unknown): void {
    if (this.disabled() || this.loading()) return;
    if (typeof value !== "number" || !this.pageSizeOptions().includes(value) || value === this.size()) return;
    this.pagination.emit({ page: 0, size: value });
  }
}
