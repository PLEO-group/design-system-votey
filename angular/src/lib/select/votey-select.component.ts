import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  type InputSignal,
  type InputSignalWithTransform,
  output,
  type OutputEmitterRef,
  type Signal,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MatOption,
  MatSelect,
  type MatSelectChange,
} from "@angular/material/select";
import { VoteyChipComponent } from "../chip/votey-chip.component";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

export const VoteySelectVariants = ["boxed", "compact"] as const;

export type VoteySelectVariant = (typeof VoteySelectVariants)[number];

export interface VtOption<T = unknown> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}

type SelectOptionView = {
  readonly disabled: boolean;
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
    ReactiveFormsModule,
    VoteyChipComponent,
    VoteyFormErrorComponent,
    VoteyIconComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteySelectComponent extends VoteyFormControlApplyDirective<unknown> {
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
  public readonly showSelectionChips: InputSignalWithTransform<
    boolean,
    unknown
  > = input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly removeTooltip: InputSignal<string> =
    input<string>("BUTTON.REMOVE");
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);

  public readonly selectionChange: OutputEmitterRef<unknown> = output<unknown>();

  protected readonly isOpen = signal<boolean>(false);
  protected readonly optionViews: Signal<readonly SelectOptionView[]> = computed(
    (): readonly SelectOptionView[] =>
      this.options().map(
        (option: unknown): SelectOptionView => ({
          disabled: this.isOptionDisabled(option),
          label: this.getOptionLabel(option),
          option,
          value: this.getOptionValue(option),
        })
      )
  );
  protected readonly selectedOptions: Signal<readonly SelectOptionView[]> =
    computed((): readonly SelectOptionView[] => {
      const selectedValues: readonly unknown[] = this.toArray(
        this.formControl.value
      );

      return this.optionViews().filter((option: SelectOptionView) =>
        selectedValues.some((value: unknown) =>
          Object.is(value, option.value)
        )
      );
    });

  protected get isRequired(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  protected get hasError(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  protected get errorKeys(): string[] {
    return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
  }

  protected handleSelectionChange(event: MatSelectChange): void {
    this.selectionChange.emit(event.value);
  }

  protected handleOpenedChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);
  }

  protected removeSelection(option: SelectOptionView): void {
    if (this.disabled() || this.formControl.disabled || option.disabled) {
      return;
    }

    const nextValue: unknown[] = this.toArray(this.formControl.value).filter(
      (value: unknown) => !Object.is(value, option.value)
    );

    this.formControl.setValue(nextValue);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.selectionChange.emit(nextValue);
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

    return this.isVtOption(option) ? option.value : option;
  }

  private getBoundOptionProperty(option: unknown, property: string): unknown {
    if (option === null || typeof option !== "object") return undefined;

    return (option as Record<string, unknown>)[property];
  }

  private isOptionDisabled(option: unknown): boolean {
    return this.getBoundOptionProperty(option, "disabled") === true;
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
