import { Directive, Input, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import type { Subscription } from "rxjs";

@Directive({
  selector: "[vtFormControlApply]",
  standalone: true,
})
export class VoteyFormControlApplyDirective<T> implements OnDestroy {
  public formControl: FormControl<T | null> = new FormControl<T | null>(null);

  private valueChangesSubscription: Subscription | undefined;
  private statusChangesSubscription: Subscription | undefined;

  public constructor() {
    this.observeFormControl();
  }

  @Input() set staticValue(value: T | null | undefined) {
    if (value === undefined) return;

    this.formControl.setValue(value);
    this.formControl.disable();
    this.handleFormControlValueChange(value);
    this.handleFormControlDisabledChange(true);
  }

  @Input() set initialValue(value: T | null | undefined) {
    if (value === undefined) return;

    this.formControl.setValue(value);
    this.handleFormControlValueChange(value);
  }

  @Input() set control(control: FormControl<T | null> | null | undefined) {
    if (!control) return;

    this.valueChangesSubscription?.unsubscribe();
    this.statusChangesSubscription?.unsubscribe();
    this.formControl = control;
    this.observeFormControl();
    this.handleFormControlValueChange(control.value);
    this.handleFormControlDisabledChange(control.disabled);
  }

  @Input() set disable(disabled: boolean | undefined) {
    if (disabled === undefined) return;

    if (disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }

    this.handleFormControlDisabledChange(disabled);
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

  public ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
    this.statusChangesSubscription?.unsubscribe();
  }

  protected handleFormControlValueChange(_value: T | null): void {}

  protected handleFormControlDisabledChange(_disabled: boolean): void {}

  private observeFormControl(): void {
    this.valueChangesSubscription = this.formControl.valueChanges.subscribe(
      (value: T | null) => this.handleFormControlValueChange(value)
    );
    this.statusChangesSubscription = this.formControl.statusChanges.subscribe(
      () => this.handleFormControlDisabledChange(this.formControl.disabled)
    );
  }
}
