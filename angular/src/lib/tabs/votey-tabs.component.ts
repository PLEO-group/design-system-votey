import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  Renderer2,
  viewChild,
  viewChildren,
  type InputSignal,
  type OutputEmitterRef,
} from "@angular/core";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { VoteyTextComponent } from "../text/votey-text.component";

export interface VoteyTabItem {
  readonly id: string;
  readonly label: string;
  readonly count?: number | null;
  readonly disabled?: boolean;
}

@Component({
  selector: "vt-tabs",
  templateUrl: "./votey-tabs.component.html",
  styleUrl: "./votey-tabs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyTextComponent, VoteyTranslatePipe],
})
export class VoteyTabsComponent {
  public readonly items: InputSignal<readonly VoteyTabItem[]> = input.required<readonly VoteyTabItem[]>();
  public readonly selectedId: InputSignal<string> = input.required<string>();
  public readonly ariaLabel: InputSignal<string> = input.required<string>();
  public readonly panelId: InputSignal<string | null> = input<string | null>(null);
  public readonly idPrefix: InputSignal<string> = input<string>("vt-tab");
  public readonly selectionChange: OutputEmitterRef<string> = output<string>();
  protected readonly tabElements = viewChildren<ElementRef<HTMLButtonElement>>("tabButton");
  protected readonly indicatorElement = viewChild<ElementRef<HTMLSpanElement>>("indicator");
  protected readonly trackElement = viewChild<ElementRef<HTMLDivElement>>("track");

  private readonly renderer: Renderer2 = inject(Renderer2);
  public constructor() {
    afterRenderEffect(onCleanup => {
      const items: readonly VoteyTabItem[] = this.items();
      const selectedId: string = this.selectedId();
      const buttons: readonly ElementRef<HTMLButtonElement>[] = this.tabElements();
      const indicator: HTMLElement | undefined = this.indicatorElement()?.nativeElement;
      const track: HTMLElement | undefined = this.trackElement()?.nativeElement;
      if (!indicator || !track) return;

      let activationFrame: number | null = null;
      const positionIndicator = (): void => {
        const selectedIndex: number = items.findIndex(item => item.id === selectedId);
        const selectedButton: HTMLButtonElement | undefined = buttons[selectedIndex]?.nativeElement;
        if (!selectedButton) {
          this.renderer.setStyle(indicator, "visibility", "hidden");
          return;
        }

        this.renderer.setStyle(indicator, "visibility", "visible");
        this.renderer.setStyle(indicator, "width", `${selectedButton.offsetWidth}px`);
        this.renderer.setStyle(indicator, "transform", `translateX(${selectedButton.offsetLeft}px)`);
        if (!indicator.classList.contains("ready") && activationFrame === null) {
          if (typeof requestAnimationFrame === "function") {
            activationFrame = requestAnimationFrame(() => {
              this.renderer.addClass(indicator, "ready");
              activationFrame = null;
            });
          } else {
            this.renderer.addClass(indicator, "ready");
          }
        }
      };

      positionIndicator();
      const resizeObserver: ResizeObserver | null = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(positionIndicator);
      resizeObserver?.observe(track);
      for (const button of buttons) resizeObserver?.observe(button.nativeElement);
      onCleanup(() => {
        resizeObserver?.disconnect();
        if (activationFrame !== null) cancelAnimationFrame(activationFrame);
      });
    });
  }

  protected select(item: VoteyTabItem): void {
    if (!item.disabled && item.id !== this.selectedId()) {
      this.selectionChange.emit(item.id);
    }
  }

  protected onKeydown(event: KeyboardEvent, item: VoteyTabItem): void {
    const enabledItems: readonly VoteyTabItem[] = this.items().filter(tab => !tab.disabled);
    const index: number = enabledItems.findIndex(tab => tab.id === item.id);
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % enabledItems.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + enabledItems.length) % enabledItems.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = enabledItems.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const next: VoteyTabItem | undefined = enabledItems[nextIndex];
    if (!next) return;
    this.select(next);
    const tablist: HTMLElement | null = (event.currentTarget as HTMLElement).closest('[role="tablist"]');
    tablist?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[this.items().findIndex(tab => tab.id === next.id)]?.focus();
  }
}
