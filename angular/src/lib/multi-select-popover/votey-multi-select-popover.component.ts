import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
  signal,
  type Signal,
  type WritableSignal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  VoteyButtonComponent,
  type VoteyButtonVariant,
} from "../button/votey-button.component";
import { VoteyCheckboxComponent } from "../checkbox/votey-checkbox.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import type { VoteyIcon } from "../votey-assets";

export interface VoteyMultiSelectItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

@Component({
  selector: "vt-multi-select-popover",
  templateUrl: "./votey-multi-select-popover.component.html",
  styleUrl: "./votey-multi-select-popover.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VoteyButtonComponent,
    VoteyCheckboxComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyMultiSelectPopoverComponent {
  private readonly document: Document = inject(DOCUMENT);
  private readonly host: ElementRef<HTMLElement> = inject(
    ElementRef<HTMLElement>
  );
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly items: InputSignal<readonly VoteyMultiSelectItem[]> = input<
    readonly VoteyMultiSelectItem[]
  >([]);
  public readonly selectedIds: InputSignal<readonly string[]> = input<
    readonly string[]
  >([]);
  public readonly triggerText: InputSignal<string> = input.required<string>();
  public readonly triggerIcon: InputSignal<VoteyIcon | ""> = input<
    VoteyIcon | ""
  >("");
  public readonly triggerVariant: InputSignal<VoteyButtonVariant> =
    input<VoteyButtonVariant>("link");
  public readonly confirmText: InputSignal<string> = input.required<string>();
  public readonly cancelText: InputSignal<string> = input<string>("");
  public readonly emptyText: InputSignal<string> = input<string>("");
  public readonly ariaLabel: InputSignal<string> = input.required<string>();
  public readonly dataCy: InputSignal<string | null> = input<string | null>(
    null
  );

  public readonly confirmed: OutputEmitterRef<readonly string[]> =
    output<readonly string[]>();
  public readonly dismissed: OutputEmitterRef<void> = output<void>();

  protected readonly isOpen: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly itemControls: WritableSignal<
    Readonly<Record<string, FormControl<boolean>>>
  > = signal<Readonly<Record<string, FormControl<boolean>>>>({});
  protected readonly hasItems: Signal<boolean> = computed<boolean>(
    () => this.items().length > 0
  );
  protected readonly currentTriggerIcon: Signal<VoteyIcon | ""> = computed<
    VoteyIcon | ""
  >(() => (this.isOpen() ? "ui-close" : this.triggerIcon()));

  private readonly draftSelectedIds: WritableSignal<ReadonlySet<string>> =
    signal<ReadonlySet<string>>(new Set<string>());
  private readonly handlePointerDown = (event: PointerEvent): void =>
    this.handleOutsidePointerDown(event);

  public constructor() {
    this.destroyRef.onDestroy(() =>
      this.document.removeEventListener(
        "pointerdown",
        this.handlePointerDown,
        true
      )
    );
  }

  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }

    this.open();
  }

  protected toggleItem(item: VoteyMultiSelectItem, checked: boolean): void {
    if (item.disabled) return;

    const selectedIds: Set<string> = new Set<string>(this.draftSelectedIds());
    if (checked) selectedIds.add(item.id);
    else selectedIds.delete(item.id);

    this.draftSelectedIds.set(selectedIds);
  }

  protected confirm(): void {
    const selectedIds: readonly string[] = this.items()
      .filter((item: VoteyMultiSelectItem) =>
        this.draftSelectedIds().has(item.id)
      )
      .map((item: VoteyMultiSelectItem) => item.id);

    this.confirmed.emit(selectedIds);
    this.close();
  }

  protected dismiss(): void {
    if (!this.isOpen()) return;

    this.close();
    this.dismissed.emit();
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape") return;

    event.preventDefault();
    event.stopPropagation();
    this.dismiss();
  }

  private open(): void {
    const availableItemIds: Set<string> = new Set<string>(
      this.items().map((item: VoteyMultiSelectItem) => item.id)
    );
    const selectedIds: Set<string> = new Set<string>(
      this.selectedIds().filter((id: string) => availableItemIds.has(id))
    );

    this.draftSelectedIds.set(selectedIds);
    this.itemControls.set(this.createItemControls(selectedIds));
    this.isOpen.set(true);
    this.document.addEventListener("pointerdown", this.handlePointerDown, true);
  }

  private close(): void {
    this.document.removeEventListener(
      "pointerdown",
      this.handlePointerDown,
      true
    );
    this.isOpen.set(false);
  }

  private createItemControls(
    selectedIds: ReadonlySet<string>
  ): Readonly<Record<string, FormControl<boolean>>> {
    return this.items().reduce<Readonly<Record<string, FormControl<boolean>>>>(
      (
        controls: Readonly<Record<string, FormControl<boolean>>>,
        item: VoteyMultiSelectItem
      ) => ({
        ...controls,
        [item.id]: new FormControl<boolean>(
          { value: selectedIds.has(item.id), disabled: item.disabled === true },
          { nonNullable: true }
        ),
      }),
      {}
    );
  }

  private handleOutsidePointerDown(event: PointerEvent): void {
    const target: EventTarget | null = event.target;
    if (!(target instanceof Node) || this.host.nativeElement.contains(target))
      return;

    this.dismiss();
  }
}
