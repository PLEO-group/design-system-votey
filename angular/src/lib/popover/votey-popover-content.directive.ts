import { Directive, inject, TemplateRef } from "@angular/core";

export interface VoteyPopoverContentContext {
  readonly close: () => void;
}

@Directive({ selector: "ng-template[vtPopoverContent]" })
export class VoteyPopoverContentDirective {
  public readonly template: TemplateRef<VoteyPopoverContentContext> =
    inject<TemplateRef<VoteyPopoverContentContext>>(TemplateRef);

  public static ngTemplateContextGuard(
    _directive: VoteyPopoverContentDirective,
    context: unknown
  ): context is VoteyPopoverContentContext {
    return true;
  }
}
