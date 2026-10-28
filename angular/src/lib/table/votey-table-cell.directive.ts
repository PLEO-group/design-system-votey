import { Directive, inject, input, TemplateRef, type InputSignal } from "@angular/core";
import type { VoteyTableCellContext } from "./table.model";
import type { VoteyTableComponent } from "./votey-table.component";

@Directive({ selector: "ng-template[vtTableCell]" })
export class VoteyTableCellDirective<T = unknown> {
  public readonly vtTableCell: InputSignal<string> = input.required<string>();
  public readonly vtTableCellOf: InputSignal<VoteyTableComponent<T> | null> = input<VoteyTableComponent<T> | null>(null);
  public readonly template: TemplateRef<VoteyTableCellContext<T>> = inject(TemplateRef);

  public static ngTemplateContextGuard<T>(
    _directive: VoteyTableCellDirective<T>, context: unknown,
  ): context is VoteyTableCellContext<T> {
    return true;
  }
}
