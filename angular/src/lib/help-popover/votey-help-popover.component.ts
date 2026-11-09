import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  output,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
} from "@angular/core";
import {
  VoteyPopoverComponent,
  type VoteyPopoverPlacement,
} from "../popover/votey-popover.component";
import { VoteyPopoverContentDirective } from "../popover/votey-popover-content.directive";
import { VoteyHelpPopoverPanelComponent } from "./votey-help-popover-panel.component";
import type { VoteyHelpPopoverContent } from "./help-popover.model";

@Component({
  selector: "vt-help-popover",
  templateUrl: "./votey-help-popover.component.html",
  styleUrl: "./votey-help-popover.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VoteyPopoverComponent,
    VoteyPopoverContentDirective,
    VoteyHelpPopoverPanelComponent,
  ],
})
export class VoteyHelpPopoverComponent {
  public readonly content: InputSignal<VoteyHelpPopoverContent> =
    input.required<VoteyHelpPopoverContent>();
  public readonly placement: InputSignal<VoteyPopoverPlacement> =
    input<VoteyPopoverPlacement>("bottom-end");
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly openedChange: OutputEmitterRef<boolean> = output<boolean>();
  public readonly actionPressed: OutputEmitterRef<MouseEvent> =
    output<MouseEvent>();
  protected readonly customContent: Signal<
    VoteyPopoverContentDirective | undefined
  > = contentChild(VoteyPopoverContentDirective);
}
