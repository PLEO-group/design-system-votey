import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  type InputSignal,
  model,
  type ModelSignal,
  output,
  type OutputEmitterRef,
  type Signal,
  signal,
  type WritableSignal,
  ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  MatCheckbox,
  type MatCheckboxChange,
} from "@angular/material/checkbox";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import {
  getVoteySvgAssetUrl,
  VOTEY_SVG_REGISTRY_CONFIG,
  type VoteySvgRegistryConfig,
} from "../votey-svg-registry.service";

export type VoteyCheckboxLabelPosition = "before" | "after";

@Component({
  selector: "vt-checkbox",
  templateUrl: "./votey-checkbox.component.html",
  styleUrl: "./votey-checkbox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatCheckbox, VoteyTranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VoteyCheckboxComponent),
      multi: true,
    },
  ],
})
export class VoteyCheckboxComponent
  extends VoteyFormControlApplyDirective<boolean>
  implements ControlValueAccessor
{
  public readonly checked: ModelSignal<boolean> = model<boolean>(false);
  public readonly indeterminate: ModelSignal<boolean> = model<boolean>(false);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly required: InputSignal<boolean> = input<boolean>(false);
  public readonly error: InputSignal<boolean> = input<boolean>(false);
  public readonly label: InputSignal<string> = input<string>("");
  public readonly labelPosition: InputSignal<VoteyCheckboxLabelPosition> =
    input<VoteyCheckboxLabelPosition>("after");
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly value: InputSignal<string> = input<string>("");
  public readonly changed: OutputEmitterRef<boolean> = output<boolean>();

  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly svgRegistryConfig: VoteySvgRegistryConfig =
    inject(VOTEY_SVG_REGISTRY_CONFIG, { optional: true }) ?? {};
  protected readonly checkmarkMaskUrl: string = `url("${getVoteySvgAssetUrl(
    "icons/special/icon_sp_check.svg",
    this.svgRegistryConfig
  )}")`;
  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: boolean | null): void {
    this.checked.set(Boolean(value));
  }

  public registerOnChange(callback: (value: boolean) => void): void {
    this.onChange = callback;
  }

  public registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected handleChange(event: MatCheckboxChange): void {
    this.checked.set(event.checked);
    this.indeterminate.set(event.source.indeterminate);
    this.formControl.setValue(event.checked);
    this.onChange(event.checked);
    this.changed.emit(event.checked);
  }

  protected markAsTouched(): void {
    this.onTouched();
  }

  protected override handleFormControlValueChange(value: boolean | null): void {
    this.checked.set(Boolean(value));
  }

  protected override handleFormControlDisabledChange(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
