import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
  signal,
  type Signal,
  type WritableSignal,
  viewChildren,
} from "@angular/core";

export interface VoteyMenuItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

@Component({
  selector: "vt-menu",
  templateUrl: "./votey-menu.component.html",
  styleUrl: "./votey-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteyMenuComponent {
  public readonly items: InputSignal<readonly VoteyMenuItem[]> = input<
    readonly VoteyMenuItem[]
  >([]);
  public readonly ariaLabel: InputSignal<string> = input<string>("Menu");
  public readonly ariaLabelledby: InputSignal<string | null> = input<
    string | null
  >(null);
  public readonly selectedId: InputSignal<string | null> = input<string | null>(
    null,
  );
  public readonly dataCy: InputSignal<string | null> = input<string | null>(
    null,
  );

  public readonly itemSelected: OutputEmitterRef<VoteyMenuItem> =
    output<VoteyMenuItem>();
  public readonly dismissed: OutputEmitterRef<void> = output<void>();

  protected readonly menuItems: Signal<
    readonly ElementRef<HTMLButtonElement>[]
  > = viewChildren<ElementRef<HTMLButtonElement>>("menuItem");
  protected readonly activeIndex: WritableSignal<number> = signal<number>(0);
  protected readonly resolvedAriaLabel: Signal<string | null> = computed<
    string | null
  >(() => (this.ariaLabelledby() ? null : this.ariaLabel()));
  protected readonly resolvedActiveIndex: Signal<number> = computed<number>(
    () => {
      const items = this.items();
      const activeIndex = this.activeIndex();

      if (items[activeIndex] && !items[activeIndex].disabled) {
        return activeIndex;
      }

      return items.findIndex((item: VoteyMenuItem) => !item.disabled);
    },
  );

  public focusFirst(): void {
    this.focusEnabledItem(0, 1);
  }

  public focusLast(): void {
    this.focusEnabledItem(this.items().length - 1, -1);
  }

  protected handleItemFocus(index: number): void {
    this.activeIndex.set(index);
  }

  protected handleItemPressed(item: VoteyMenuItem, index: number): void {
    if (item.disabled) {
      return;
    }

    this.activeIndex.set(index);
    this.itemSelected.emit(item);
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusEnabledItem(index + 1, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusEnabledItem(index - 1, -1);
        break;
      case "Home":
        event.preventDefault();
        this.focusFirst();
        break;
      case "End":
        event.preventDefault();
        this.focusLast();
        break;
      case "Escape":
        event.stopPropagation();
        this.dismissed.emit();
        break;
      case "Tab":
        this.dismissed.emit();
        break;
    }
  }

  private focusEnabledItem(startIndex: number, direction: 1 | -1): void {
    const items = this.items();

    if (items.length === 0) {
      return;
    }

    for (let offset = 0; offset < items.length; offset += 1) {
      const index =
        (startIndex + offset * direction + items.length) % items.length;

      if (!items[index].disabled) {
        this.activeIndex.set(index);
        this.menuItems()[index]?.nativeElement.focus();
        return;
      }
    }
  }
}
