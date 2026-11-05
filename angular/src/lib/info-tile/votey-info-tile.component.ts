import { ChangeDetectionStrategy, Component, computed, input, type InputSignal, type Signal } from "@angular/core";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import type { VoteyIcon, VoteyIllustration } from "../votey-assets";

export const VoteyInfoTileStates = ["default", "running", "completed", "test", "not-launched", "scheduled"] as const;
export type VoteyInfoTileState = (typeof VoteyInfoTileStates)[number];

export interface VoteyInfoTileItem {
  readonly id: string;
  readonly icon: VoteyIcon;
  readonly value: string | number;
}

@Component({
  selector: "vt-info-tile",
  imports: [VoteyIconComponent, VoteyTextComponent],
  templateUrl: "./votey-info-tile.component.html",
  styleUrl: "./votey-info-tile.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteyInfoTileComponent {
  public readonly title: InputSignal<string> = input.required<string>();
  public readonly items: InputSignal<readonly VoteyInfoTileItem[]> = input<readonly VoteyInfoTileItem[]>([]);
  public readonly illustration: InputSignal<VoteyIllustration | ""> = input<VoteyIllustration | "">("");
  public readonly state: InputSignal<VoteyInfoTileState> = input<VoteyInfoTileState>("default");
  public readonly statusLabel: InputSignal<string> = input<string>("");

  protected readonly tileClasses: Signal<string> = computed<string>(() =>
    ["tile", this.state(), this.illustration() ? "has-illustration" : ""].filter(Boolean).join(" ")
  );
  protected readonly showStatus: Signal<boolean> = computed<boolean>(() =>
    this.state() !== "default" && this.statusLabel().length > 0
  );
}
