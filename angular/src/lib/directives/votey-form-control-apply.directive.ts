import { Directive, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Directive({
  selector: "[vtFormControlApply]",
  standalone: true,
})
export class VoteyFormControlApplyDirective<T> {
  public formControl: FormControl<T | null> = new FormControl<T | null>(null);

  @Input() set staticValue(value: T | null | undefined) {
    if (value === undefined) return;

    this.formControl.setValue(value);
    this.formControl.disable();
  }

  @Input() set initialValue(value: T | null | undefined) {
    if (value === undefined) return;

    this.formControl.setValue(value);
  }

  @Input() set control(control: FormControl<T | null> | null | undefined) {
    if (!control) return;

    this.formControl = control;
  }

  @Input() set disable(disabled: boolean | undefined) {
    if (disabled === undefined) return;

    if (disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }

  }

  @Input() set block(blocked: boolean) {
    this.disable = blocked;
  }

  public get blocked(): boolean {
    return this.formControl.disabled;
  }

  public get touched(): boolean {
    return this.formControl.touched;
  }

}
