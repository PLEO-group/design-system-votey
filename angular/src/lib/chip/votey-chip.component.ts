import {
  ChangeDetectionStrategy,
  Component,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
} from "@angular/core";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyTextComponent } from "../text/votey-text.component";

@Component({
  selector: "vt-chip",
  templateUrl: "./votey-chip.component.html",
  styleUrl: "./votey-chip.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyButtonComponent, VoteyTextComponent],
})
export class VoteyChipComponent {
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly removeTooltip: InputSignal<string> = input.required<string>();
  public readonly showRemove: InputSignal<boolean> = input<boolean>(true);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);

  public readonly removed: OutputEmitterRef<void> = output<void>();
}
