import { Directive, ElementRef, Renderer2, effect, inject, input, type InputSignal } from "@angular/core";
import type { VoteyTableRowConfig } from "./table.model";

@Directive({ selector: "tr[vtTableRow], tbody[vtTableRow]" })
export class VoteyTableRowDirective {
  public readonly vtTableRow: InputSignal<VoteyTableRowConfig> = input<VoteyTableRowConfig>({});
  public readonly vtTableRowGroup: InputSignal<boolean> = input(false);
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  public constructor() {
    effect((onCleanup): void => {
      const attributes: VoteyTableRowConfig["attributes"] = this.vtTableRowGroup()
        ? this.vtTableRow().groupAttributes : this.vtTableRow().attributes;
      const names: string[] = [];
      for (const [name, value] of Object.entries(attributes ?? {})) {
        if (name.startsWith("data-") && value !== null) {
          this.renderer.setAttribute(this.element.nativeElement, name, String(value));
          names.push(name);
        }
      }
      onCleanup(() => names.forEach((name: string) => this.renderer.removeAttribute(this.element.nativeElement, name)));
    });
  }
}
