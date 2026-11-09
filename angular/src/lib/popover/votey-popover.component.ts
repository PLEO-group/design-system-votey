import {
  MatMenuModule,
  MatMenuTrigger,
  type MenuPositionX,
  type MenuPositionY,
} from "@angular/material/menu";
import { A11yModule } from "@angular/cdk/a11y";
import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  effect,
  input,
  output,
  signal,
  untracked,
  viewChild,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
  type WritableSignal,
} from "@angular/core";
import {
  VoteyButtonComponent,
  type VoteyButtonSize,
  type VoteyButtonVariant,
} from "../button/votey-button.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import type { VoteyIcon } from "../votey-assets";
import {
  VoteyPopoverContentDirective,
  type VoteyPopoverContentContext,
} from "./votey-popover-content.directive";

export const VoteyPopoverPlacements = [
  "bottom-end",
  "bottom-start",
  "top-end",
  "top-start",
] as const;
export type VoteyPopoverPlacement = (typeof VoteyPopoverPlacements)[number];

@Component({
  selector: "vt-popover",
  templateUrl: "./votey-popover.component.html",
  styleUrl: "./votey-popover.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A11yModule,
    MatMenuModule,
    NgTemplateOutlet,
    VoteyButtonComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyPopoverComponent {
  public readonly ariaLabel: InputSignal<string> = input.required<string>();
  public readonly triggerText: InputSignal<string> = input<string>("");
  public readonly triggerIcon: InputSignal<VoteyIcon | ""> = input<
    VoteyIcon | ""
  >("");
  public readonly openIcon: InputSignal<VoteyIcon | ""> = input<VoteyIcon | "">(
    ""
  );
  public readonly triggerVariant: InputSignal<VoteyButtonVariant> =
    input<VoteyButtonVariant>("secondary");
  public readonly triggerSize: InputSignal<VoteyButtonSize> =
    input<VoteyButtonSize>("small");
  public readonly badge: InputSignal<string | number | null> = input<
    string | number | null
  >(null);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly placement: InputSignal<VoteyPopoverPlacement> =
    input<VoteyPopoverPlacement>("bottom-end");
  public readonly openedChange: OutputEmitterRef<boolean> = output<boolean>();

  private readonly opened: WritableSignal<boolean> = signal<boolean>(false);
  public readonly isOpen: Signal<boolean> = this.opened.asReadonly();
  protected readonly trigger: Signal<ElementRef<HTMLElement>> =
    viewChild.required("trigger", { read: ElementRef });
  private readonly menuTrigger: Signal<MatMenuTrigger> =
    viewChild.required(MatMenuTrigger);
  protected readonly content: Signal<VoteyPopoverContentDirective | undefined> =
    contentChild(VoteyPopoverContentDirective);
  protected readonly context: VoteyPopoverContentContext = {
    close: (): void => this.close(),
  };
  protected readonly currentIcon: Signal<VoteyIcon | ""> = computed(() =>
    this.isOpen() && this.openIcon() ? this.openIcon() : this.triggerIcon()
  );
  protected readonly menuPositionX: Signal<MenuPositionX> = computed(() =>
    this.placement().endsWith("start") ? "after" : "before"
  );
  protected readonly menuPositionY: Signal<MenuPositionY> = computed(() =>
    this.placement().startsWith("top") ? "above" : "below"
  );

  public constructor() {
    effect((): void => {
      if (this.disabled()) untracked((): void => this.close());
    });
  }

  public open(): void {
    if (this.disabled() || this.isOpen()) return;
    this.menuTrigger().openMenu();
  }

  public close(): void {
    if (!this.isOpen()) return;
    this.menuTrigger().closeMenu();
  }

  public toggle(): void {
    if (this.isOpen()) this.close();
    else this.open();
  }

  protected handleOpenedChange(open: boolean): void {
    this.opened.set(open);
    this.openedChange.emit(open);
    if (!open)
      this.trigger()
        .nativeElement.querySelector<HTMLButtonElement>("button")
        ?.focus();
  }

  protected handleContentKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape") event.stopPropagation();
  }
}
