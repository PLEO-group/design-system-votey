import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
  type TemplateRef,
} from "@angular/core";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import type { VoteyPopoverContentContext } from "../popover/votey-popover-content.directive";
import type { VoteyHelpPopoverContent } from "./help-popover.model";

@Component({
  selector: "vt-help-popover-panel",
  templateUrl: "./votey-help-popover-panel.component.html",
  styleUrl: "./votey-help-popover-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    VoteyIconComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyHelpPopoverPanelComponent {
  public readonly content: InputSignal<VoteyHelpPopoverContent> =
    input.required<VoteyHelpPopoverContent>();
  public readonly customTemplate: InputSignal<
    TemplateRef<VoteyPopoverContentContext> | undefined
  > = input<TemplateRef<VoteyPopoverContentContext>>();
  public readonly closePanel: InputSignal<() => void> =
    input.required<() => void>();
  public readonly actionPressed: OutputEmitterRef<MouseEvent> =
    output<MouseEvent>();
  protected readonly context: Signal<VoteyPopoverContentContext> = computed(
    () => ({ close: this.closePanel() })
  );
  protected readonly isInfoIllustration: Signal<boolean> = computed(
    () => this.content().illustration?.startsWith("info-") ?? false
  );

  protected handleAction(event: MouseEvent): void {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    this.actionPressed.emit(event);
    this.closePanel()();
  }
}
