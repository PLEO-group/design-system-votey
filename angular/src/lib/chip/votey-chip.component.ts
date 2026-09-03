import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
  type Signal,
} from "@angular/core";
import {
  VoteyTextComponent,
  type VoteyTextColor,
} from "../text/votey-text.component";

@Component({
  selector: "vt-chip",
  templateUrl: "./votey-chip.component.html",
  styleUrl: "./votey-chip.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyTextComponent],
})
export class VoteyChipComponent {
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly removeAriaLabel: InputSignal<string> =
    input.required<string>();
  public readonly showRemove: InputSignal<boolean> = input<boolean>(true);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);

  public readonly removed: OutputEmitterRef<void> = output<void>();

  protected readonly textColor: Signal<VoteyTextColor> =
    computed<VoteyTextColor>(() => (this.disabled() ? "muted" : "primary"));
}
