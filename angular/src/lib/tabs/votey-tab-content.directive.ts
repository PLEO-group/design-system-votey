import {
  Directive,
  inject,
  input,
  TemplateRef,
  type InputSignal,
} from "@angular/core";
import type { VoteyTabItem } from "./votey-tabs.component";

export interface VoteyTabContentContext {
  readonly $implicit: VoteyTabItem;
}

@Directive({ selector: "ng-template[vtTabContent]" })
export class VoteyTabContentDirective {
  public readonly vtTabContent: InputSignal<string> = input<string>("");
  public readonly template: TemplateRef<VoteyTabContentContext> = inject(
    TemplateRef<VoteyTabContentContext>,
  );

  public static ngTemplateContextGuard(
    _directive: VoteyTabContentDirective,
    context: unknown,
  ): context is VoteyTabContentContext {
    return true;
  }
}
