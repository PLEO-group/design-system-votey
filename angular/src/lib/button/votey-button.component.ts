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
import { MatTooltip } from "@angular/material/tooltip";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import type { VoteyIcon } from "../votey-assets";

export const VoteyButtonVariants = [
  "primary",
  "secondary",
  "link",
  "danger",
  "ghost",
  "orange",
] as const;

export const VoteyButtonSizes = ["large", "small"] as const;

export type VoteyButtonVariant = (typeof VoteyButtonVariants)[number];
export type VoteyButtonSize = (typeof VoteyButtonSizes)[number];
export type VoteyButtonType = "button" | "submit" | "reset";

@Component({
  selector: "vt-button",
  templateUrl: "./votey-button.component.html",
  styleUrl: "./votey-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, VoteyIconComponent],
})
export class VoteyButtonComponent {
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly type: InputSignal<VoteyButtonType> =
    input<VoteyButtonType>("button");
  public readonly variant: InputSignal<VoteyButtonVariant> =
    input<VoteyButtonVariant>("primary");
  public readonly size: InputSignal<VoteyButtonSize> =
    input<VoteyButtonSize>("large");
  public readonly text: InputSignal<string> = input<string>("");
  public readonly ico: InputSignal<VoteyIcon | ""> = input<VoteyIcon | "">("");
  public readonly badge: InputSignal<string | number | null> = input<
    string | number | null
  >(null);
  public readonly ariaLabel: InputSignal<string> = input<string>("");
  public readonly ariaExpanded: InputSignal<boolean | null> = input<
    boolean | null
  >(null);
  public readonly ariaPressed: InputSignal<boolean | null> = input<
    boolean | null
  >(null);
  public readonly tooltipText: InputSignal<string> = input<string>("");
  public readonly disabledNote: InputSignal<string> = input<string>("");

  public readonly pressed: OutputEmitterRef<void> = output<void>();

  protected readonly buttonClasses: Signal<string> = computed<string>(
    () => `${this.variant()} ${this.size()}`
  );
  protected readonly isIconButton: Signal<boolean> = computed<boolean>(
    () => Boolean(this.ico()) && !this.text()
  );
  protected readonly resolvedAriaLabel: Signal<string> = computed<string>(
    () =>
      this.ariaLabel().trim() ||
      (this.isIconButton() ? this.tooltipText().trim() : "")
  );
  protected readonly resolvedTooltipText: Signal<string> = computed<string>(
    () => (this.disabled() ? this.disabledNote() : this.tooltipText()).trim()
  );
}
