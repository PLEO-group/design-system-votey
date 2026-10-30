import { NgTemplateOutlet } from "@angular/common";
import { BreakpointObserver, type BreakpointState } from "@angular/cdk/layout";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  output,
  ViewEncapsulation,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
  type TemplateRef,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatTabsModule, type MatTabChangeEvent } from "@angular/material/tabs";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { VoteyTextComponent } from "../text/votey-text.component";
import {
  VoteyTabContentDirective,
  type VoteyTabContentContext,
} from "./votey-tab-content.directive";

export interface VoteyTabItem {
  readonly id: string;
  readonly label: string;
  readonly count?: number | null;
  readonly disabled?: boolean;
}

interface TabView {
  readonly item: VoteyTabItem;
  readonly template: TemplateRef<VoteyTabContentContext> | null;
  readonly context: VoteyTabContentContext;
}

@Component({
  selector: "vt-tabs",
  templateUrl: "./votey-tabs.component.html",
  styleUrl: "./votey-tabs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatTabsModule,
    NgTemplateOutlet,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyTabsComponent {
  public readonly items: InputSignal<readonly VoteyTabItem[]> =
    input.required<readonly VoteyTabItem[]>();
  public readonly selectedId: InputSignal<string> = input.required<string>();
  public readonly ariaLabel: InputSignal<string> = input.required<string>();
  public readonly selectionChange: OutputEmitterRef<string> = output<string>();
  private readonly contents: Signal<readonly VoteyTabContentDirective[]> =
    contentChildren(VoteyTabContentDirective);
  private readonly reducedMotion: Signal<BreakpointState | undefined> =
    toSignal(
      inject(BreakpointObserver).observe("(prefers-reduced-motion: reduce)"),
    );
  protected readonly animationDuration: Signal<string> = computed(() =>
    this.reducedMotion()?.matches ? "0ms" : "300ms",
  );
  protected readonly selectedIndex: Signal<number> = computed(() =>
    this.items().findIndex((item) => item.id === this.selectedId()),
  );
  protected readonly tabViews: Signal<readonly TabView[]> = computed(() => {
    const templates: readonly VoteyTabContentDirective[] = this.contents();
    const shared: VoteyTabContentDirective | undefined = templates.find(
      (content) => content.vtTabContent() === "",
    );
    return this.items().map((item) => ({
      item,
      template:
        (
          templates.find((content) => content.vtTabContent() === item.id) ??
          shared
        )?.template ?? null,
      context: { $implicit: item },
    }));
  });

  protected select(event: MatTabChangeEvent): void {
    const item: VoteyTabItem | undefined = this.items()[event.index];
    if (item && !item.disabled && item.id !== this.selectedId())
      this.selectionChange.emit(item.id);
  }
}
