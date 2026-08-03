import {
  Directive,
  inject,
  input,
  type InputSignal,
  TemplateRef,
} from "@angular/core";

@Directive({
  selector: "ng-template[vtRadioOptionContent]",
})
export class VoteyRadioOptionContentDirective {
  public readonly optionId: InputSignal<string> = input.required<string>({
    alias: "vtRadioOptionContent",
  });
  public readonly templateRef: TemplateRef<unknown> = inject(TemplateRef);
}
