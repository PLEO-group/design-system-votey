import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  type InputSignal,
  model,
  type ModelSignal,
  output,
  type OutputEmitterRef,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatCheckbox,
  type MatCheckboxChange,
} from "@angular/material/checkbox";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
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
  imports: [
    MatCheckbox,
    ReactiveFormsModule,
    VoteyFormErrorComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyCheckboxComponent extends VoteyFormControlApplyDirective<boolean> {
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
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);
  public readonly changed: OutputEmitterRef<boolean> = output<boolean>();

  protected get errorKeys(): string[] {
    return this.formControl.invalid && this.formControl.touched
      ? Object.keys(this.formControl.errors ?? {})
      : [];
  }

  private readonly svgRegistryConfig: VoteySvgRegistryConfig =
    inject(VOTEY_SVG_REGISTRY_CONFIG, { optional: true }) ?? {};
  protected readonly checkmarkMaskUrl: string = `url("${getVoteySvgAssetUrl(
    "icons/special/icon_sp_check.svg",
    this.svgRegistryConfig
  )}")`;
  protected handleChange(event: MatCheckboxChange): void {
    this.changed.emit(event.checked);
  }
}
