import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  output,
  type OutputEmitterRef,
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
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

export const VoteySelectVariants = ["boxed", "compact"] as const;

export type VoteySelectVariant = (typeof VoteySelectVariants)[number];

export interface VtSelectOption<T = unknown> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}

export interface VtSelectChange<T = unknown> {
  readonly value: T | readonly T[] | null;
}

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
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteySelectComponent extends VoteyFormControlApplyDirective<unknown> {
  public readonly options: InputSignal<readonly VtSelectOption[]> =
    input.required<readonly VtSelectOption[]>();
  public readonly variant: InputSignal<VoteySelectVariant> =
    input<VoteySelectVariant>("boxed");
  public readonly label: InputSignal<string> = input<string>("");
  public readonly placeholder: InputSignal<string> = input<string>("");
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

  public readonly selectionChange: OutputEmitterRef<VtSelectChange> =
    output<VtSelectChange>();

  protected get isRequired(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  protected get hasError(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  protected get selectedOptions(): readonly VtSelectOption[] {
    const selectedValues: readonly unknown[] = this.toArray(
      this.formControl.value
    );

    return this.options().filter((option: VtSelectOption) =>
      selectedValues.some((value: unknown) => Object.is(value, option.value))
    );
  }

  protected get errorKeys(): string[] {
    return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
  }

  protected handleSelectionChange(event: MatSelectChange): void {
    this.selectionChange.emit({ value: event.value });
  }

  protected removeSelection(option: VtSelectOption): void {
    if (this.disabled() || this.formControl.disabled || option.disabled) return;

    const nextValue: unknown[] = this.toArray(this.formControl.value).filter(
      (value: unknown) => !Object.is(value, option.value)
    );

    this.formControl.setValue(nextValue);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.selectionChange.emit({ value: nextValue });
  }

  private toArray(value: unknown): readonly unknown[] {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];

    return [value];
  }
}
