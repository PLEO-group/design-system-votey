import { DOCUMENT } from "@angular/common";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
  viewChild,
  type InputSignal,
  type InputSignalWithTransform,
  output,
  type OutputEmitterRef,
  type Signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MatOption,
  MatSelect,
  MatSelectTrigger,
  type MatSelectChange,
} from "@angular/material/select";
import { MatTooltip } from "@angular/material/tooltip";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyChipComponent } from "../chip/votey-chip.component";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

export const VoteySelectVariants = [
  "boxed",
  "compact",
] as const;

export type VoteySelectVariant = (typeof VoteySelectVariants)[number];

export interface VtOption<T = unknown> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}

export type VoteySelectSearchFn = (
  searchTerm: string,
  option: unknown
) => boolean;

type SelectOptionView = {
  readonly avatarUrl: string;
  readonly description: string;
  readonly disabled: boolean;
  readonly flagClass: string;
  readonly label: string;
  readonly option: unknown;
  readonly value: unknown;
};

@Component({
  selector: "vt-select",
  templateUrl: "./votey-select.component.html",
  styleUrl: "./votey-select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatOption,
    MatSelect,
    MatSelectTrigger,
    MatTooltip,
    ReactiveFormsModule,
    VoteyButtonComponent,
    VoteyChipComponent,
    VoteyFormErrorComponent,
    VoteyIconComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteySelectComponent extends VoteyFormControlApplyDirective<unknown> {
  private readonly document: Document = inject(DOCUMENT);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly outsidePointerDownListener = (event: PointerEvent): void =>
    this.closeOnOutsidePointerDown(event);
  private readonly backdropPointerDownListener = (): void =>
    this.matSelect()?.close();
  private backdropListenerTimeout: ReturnType<typeof setTimeout> | null = null;
  private overlayBackdrop: HTMLElement | null = null;

  public readonly options: InputSignal<readonly unknown[]> = input.required<
    readonly unknown[]
  >();
  public readonly variant: InputSignal<VoteySelectVariant> =
    input<VoteySelectVariant>("boxed");
  public readonly label: InputSignal<string> = input<string>("");
  public readonly placeholder: InputSignal<string> = input<string>("");
  public readonly bindLabel: InputSignal<string> = input<string>("");
  public readonly bindValue: InputSignal<string> = input<string>("");
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");
  public readonly multiple: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly flagSelect: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly clearable: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly clearTooltip: InputSignal<string> =
    input<string>("BUTTON.CLEAR");
  public readonly showSelectionChips: InputSignalWithTransform<
    boolean,
    unknown
  > = input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly searchable: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly searchPlaceholder: InputSignal<string> =
    input<string>("COMMON.SEARCH");
  public readonly customSearchFn: InputSignal<VoteySelectSearchFn | null> =
    input<VoteySelectSearchFn | null>(null);
  public readonly withSelectionActions: InputSignalWithTransform<
    boolean,
    unknown
  > = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly withSelectionSearch: InputSignalWithTransform<
    boolean,
    unknown
  > = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly selectionCancelText: InputSignal<string> =
    input<string>("BUTTON.CANCEL");
  public readonly selectionUpdateText: InputSignal<string> =
    input<string>("BUTTON.SAVE");
  public readonly nonRemovableValues: InputSignal<
    readonly (string | number)[]
  > = input<readonly (string | number)[]>([]);
  public readonly optionAvatarField: InputSignal<string> =
    input<string>("avatarUrl");
  public readonly optionDescriptionField: InputSignal<string> =
    input<string>("email");
  public readonly optionFlagField: InputSignal<string> =
    input<string>("flagClass");
  public readonly flagClass: InputSignal<string> =
    input<string>("fi language-flag");
  public readonly translateOptions: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly closeOnSelect: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly tooltip: InputSignal<string> = input<string>("");
  public readonly disabledNote: InputSignal<string> = input<string>("");
  public readonly removeTooltip: InputSignal<string> =
    input<string>("BUTTON.REMOVE");
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);

  public readonly selectionChange: OutputEmitterRef<unknown> = output<unknown>();
  public readonly change: OutputEmitterRef<unknown> = output<unknown>();

  protected readonly isOpen = signal<boolean>(false);
  protected readonly searchTerm = signal<string>("");
  protected readonly matSelect = viewChild(MatSelect);
  protected readonly selectionActionControl: FormControl<unknown | null> =
    new FormControl<unknown | null>([]);
  protected readonly optionViews: Signal<readonly SelectOptionView[]> = computed(
    (): readonly SelectOptionView[] =>
      this.options().map(
        (option: unknown): SelectOptionView => ({
          avatarUrl: this.getOptionText(option, this.optionAvatarField()),
          description: this.getOptionText(
            option,
            this.optionDescriptionField()
          ),
          disabled: this.isOptionDisabled(option),
          flagClass: this.getOptionText(option, this.optionFlagField()),
          label: this.getOptionLabel(option),
          option,
          value: this.getOptionValue(option),
        })
      )
  );
  protected readonly filteredOptionViews: Signal<readonly SelectOptionView[]> =
    computed((): readonly SelectOptionView[] => {
      const searchTerm: string = this.searchTerm().trim();

      if (!searchTerm) return this.optionViews();

      return this.optionViews().filter((option: SelectOptionView) =>
        this.matchesSearch(searchTerm, option)
      );
    });
  protected readonly resolvedTooltip: Signal<string> = computed(
    (): string =>
      (this.disabled() || this.formControl.disabled
        ? this.disabledNote()
        : this.tooltip()
      ).trim()
  );

  public ngOnInit(): void {
    this.document.addEventListener(
      "pointerdown",
      this.outsidePointerDownListener,
      true
    );
    this.destroyRef.onDestroy((): void => {
      this.document.removeEventListener(
        "pointerdown",
        this.outsidePointerDownListener,
        true
      );
      this.removeBackdropListener();
    });
  }

  protected get isRequired(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  protected get hasError(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  protected get errorKeys(): string[] {
    return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
  }

  protected get selectedOptions(): readonly SelectOptionView[] {
    const selectedValues: readonly unknown[] = this.toArray(this.formControl.value);

    return this.optionViews().filter((option: SelectOptionView) =>
      selectedValues.some((value: unknown) => Object.is(value, option.value))
    );
  }

  protected get selectedOption(): SelectOptionView | null {
    return this.selectedOptions[0] ?? null;
  }

  protected get canClear(): boolean {
    const value: unknown = this.formControl.value;

    return (
      this.clearable() &&
      !this.disabled() &&
      !this.formControl.disabled &&
      value !== null &&
      value !== undefined &&
      (!Array.isArray(value) || value.length > 0)
    );
  }

  protected get selectionControl(): FormControl<unknown | null> {
    return this.isSelectionActionMode
      ? this.selectionActionControl
      : this.formControl;
  }

  protected get isSelectionActionMode(): boolean {
    return this.multiple() && this.withSelectionActions();
  }

  protected get isSearchEnabled(): boolean {
    return this.searchable() || this.isSelectionActionMode && this.withSelectionSearch();
  }

  protected handleSelectionChange(event: MatSelectChange): void {
    const nextValue: unknown = this.resolveValueWithNonRemovable(event.value);

    if (this.isSelectionActionMode) {
      this.selectionActionControl.setValue(nextValue, { emitEvent: false });
      return;
    }

    if (!Object.is(nextValue, event.value)) {
      this.formControl.setValue(nextValue, { emitEvent: false });
    }

    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.emitChange(nextValue);

    if (this.closeOnSelect()) this.matSelect()?.close();
  }

  protected handleOpenedChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);

    if (!isOpen) {
      this.searchTerm.set("");
      this.removeBackdropListener();
      return;
    }

    this.scheduleBackdropListener();

    if (this.isSelectionActionMode) {
      this.selectionActionControl.setValue(
        this.resolveValueWithNonRemovable(this.formControl.value),
        { emitEvent: false }
      );
    }
  }

  protected handleSearchInput(event: Event): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    this.searchTerm.set(inputElement.value);
  }

  protected openSelect(event: MouseEvent): void {
    const target: EventTarget | null = event.target;

    if (target instanceof Element && target.closest(".cdk-overlay-popover")) {
      return;
    }

    this.matSelect()?.open();
  }

  private closeOnOutsidePointerDown(event: PointerEvent): void {
    const target: EventTarget | null = event.target;

    if (!this.isOpen() || !(target instanceof Element)) return;
    if (
      target.closest(
        ".mat-mdc-select-trigger, .vt-select-panel, vt-icon.arrow, button.clear"
      )
    ) {
      return;
    }

    this.matSelect()?.close();
  }

  private addBackdropListener(): void {
    this.removeBackdropListener();

    const backdrop: HTMLElement | null = this.document.querySelector(
      ".cdk-overlay-backdrop-showing"
    );

    if (!backdrop) return;

    this.overlayBackdrop = backdrop;
    backdrop.addEventListener("pointerdown", this.backdropPointerDownListener);
  }

  private scheduleBackdropListener(): void {
    this.clearBackdropListenerTimeout();
    this.backdropListenerTimeout = setTimeout((): void => {
      this.backdropListenerTimeout = null;

      if (this.isOpen()) this.addBackdropListener();
    });
  }

  private removeBackdropListener(): void {
    this.clearBackdropListenerTimeout();
    this.overlayBackdrop?.removeEventListener(
      "pointerdown",
      this.backdropPointerDownListener
    );
    this.overlayBackdrop = null;
  }

  private clearBackdropListenerTimeout(): void {
    if (this.backdropListenerTimeout === null) return;

    clearTimeout(this.backdropListenerTimeout);
    this.backdropListenerTimeout = null;
  }

  protected stopPanelEvent(event: Event): void {
    event.stopPropagation();
  }

  protected clearSelection(event: Event): void {
    event.stopPropagation();

    const nextValue: unknown = this.multiple()
      ? this.resolveValueWithNonRemovable([])
      : null;

    this.formControl.setValue(nextValue);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.emitChange(nextValue);
  }

  protected cancelSelectionActions(): void {
    this.selectionActionControl.setValue(
      this.resolveValueWithNonRemovable(this.formControl.value),
      { emitEvent: false }
    );
    this.matSelect()?.close();
  }

  protected updateSelectionActions(): void {
    const nextValue: unknown = this.resolveValueWithNonRemovable(
      this.selectionActionControl.value
    );
    this.formControl.setValue(nextValue);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.emitChange(nextValue);
    this.matSelect()?.close();
  }

  protected removeSelection(option: SelectOptionView): void {
    if (
      this.disabled() ||
      this.formControl.disabled ||
      option.disabled ||
      !this.isOptionRemovable(option)
    ) {
      return;
    }

    const nextValue: unknown[] = this.toArray(this.formControl.value).filter(
      (value: unknown) => !Object.is(value, option.value)
    );

    this.formControl.setValue(nextValue);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.emitChange(nextValue);
  }

  private getOptionLabel(option: unknown): string {
    if (this.bindLabel()) {
      return this.toDisplayValue(
        this.getBoundOptionProperty(option, this.bindLabel())
      );
    }

    if (this.isVtOption(option)) return option.label;

    return this.toDisplayValue(option);
  }

  private getOptionValue(option: unknown): unknown {
    if (this.bindValue()) {
      return this.getBoundOptionProperty(option, this.bindValue());
    }

    return option;
  }

  private getOptionText(option: unknown, property: string): string {
    if (!property) return "";

    return this.toDisplayValue(this.getBoundOptionProperty(option, property));
  }

  private getBoundOptionProperty(option: unknown, property: string): unknown {
    if (option === null || typeof option !== "object") return undefined;

    return (option as Record<string, unknown>)[property];
  }

  private isOptionDisabled(option: unknown): boolean {
    return this.getBoundOptionProperty(option, "disabled") === true;
  }

  private matchesSearch(searchTerm: string, option: SelectOptionView): boolean {
    const customSearchFn: VoteySelectSearchFn | null = this.customSearchFn();

    if (customSearchFn) return customSearchFn(searchTerm, option.option);

    const normalizedSearchTerm: string = searchTerm.toLocaleLowerCase();

    return [option.label, option.description].some((value: string) =>
      value.toLocaleLowerCase().includes(normalizedSearchTerm)
    );
  }

  protected isOptionRemovable(option: SelectOptionView): boolean {
    const normalizedValue: string | number | null = this.normalizeOptionValue(
      option.value
    );

    return (
      normalizedValue === null ||
      !this.nonRemovableValues()
        .map((value: string | number) => this.normalizeOptionValue(value))
        .some((value: string | number | null) => value === normalizedValue)
    );
  }

  private resolveValueWithNonRemovable(value: unknown): unknown {
    if (!this.multiple() || !Array.isArray(value)) return value;

    const requiredValues: readonly (string | number)[] = this.nonRemovableValues();
    const nextValues: unknown[] = [...value];

    requiredValues.forEach((requiredValue: string | number): void => {
      const normalizedRequiredValue: string | number | null =
        this.normalizeOptionValue(requiredValue);
      const matchingOption: SelectOptionView | undefined = this.optionViews().find(
        (option: SelectOptionView): boolean =>
          this.normalizeOptionValue(option.value) === normalizedRequiredValue
      );

      if (
        matchingOption &&
        !nextValues.some(
          (currentValue: unknown): boolean =>
            Object.is(currentValue, matchingOption.value)
        )
      ) {
        nextValues.push(matchingOption.value);
      }
    });

    return nextValues;
  }

  private normalizeOptionValue(value: unknown): string | number | null {
    if (typeof value === "string") return value.trim().toLocaleLowerCase();
    if (typeof value === "number") return value;

    return null;
  }

  private emitChange(value: unknown): void {
    this.selectionChange.emit(value);
    this.change.emit(value);
  }

  private isVtOption(option: unknown): option is VtOption {
    return (
      option !== null &&
      typeof option === "object" &&
      typeof (option as VtOption).label === "string" &&
      "value" in option
    );
  }

  private toDisplayValue(value: unknown): string {
    return value === null || value === undefined ? "" : String(value);
  }

  private toArray(value: unknown): readonly unknown[] {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];

    return [value];
  }
}
