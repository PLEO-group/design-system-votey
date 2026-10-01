import { ChangeDetectionStrategy, Component, input, output, viewChild, type InputSignal, type OutputEmitterRef, type Signal } from "@angular/core";
import { VoteyMenuComponent, type VoteyMenuItem } from "../menu/votey-menu.component";

@Component({
  selector: "vt-picker-time-list",
  templateUrl: "./picker-time-list.component.html",
  styleUrl: "./picker-time-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyMenuComponent],
})
export class PickerTimeListComponent {
  public readonly items: InputSignal<readonly VoteyMenuItem[]> = input<readonly VoteyMenuItem[]>([]);
  public readonly selectedId: InputSignal<string | null> = input<string | null>(null);
  public readonly selected: OutputEmitterRef<VoteyMenuItem> = output<VoteyMenuItem>();
  public readonly dismissed: OutputEmitterRef<void> = output<void>();

  private readonly menu: Signal<VoteyMenuComponent | undefined> = viewChild<VoteyMenuComponent>(VoteyMenuComponent);

  public focusSelected(): void {
    this.menu()?.focusSelected();
  }

  public scrollSelected(): void {
    this.menu()?.scrollSelected();
  }
}
