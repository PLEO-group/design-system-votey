import {
  ChangeDetectionStrategy,
  Component,
  input,
  type InputSignal,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import type { VoteyIcon, VoteyIllustration } from "../votey-assets";

@Component({
  selector: "vt-icon",
  templateUrl: "./votey-icon.component.html",
  styleUrl: "./votey-icon.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class VoteyIconComponent {
  public readonly ico: InputSignal<VoteyIcon | VoteyIllustration | ""> = input<
    VoteyIcon | VoteyIllustration | ""
  >("");
  public readonly ariaLabel: InputSignal<string> = input<string>("");
}
