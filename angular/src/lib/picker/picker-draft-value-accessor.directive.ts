import { Directive, ElementRef, forwardRef, input, type InputSignal } from "@angular/core";
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from "@angular/forms";

/** The picker commits through its parser; keystrokes stay in its presentation draft. */
@Directive({
  selector: "input[vtPickerDraft]",
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PickerDraftValueAccessorDirective), multi: true }],
  host: { "(blur)": "markTouched()" },
})
export class PickerDraftValueAccessorDirective implements ControlValueAccessor {
  public readonly displayValue: InputSignal<(value: string | null) => string> =
    input<(value: string | null) => string>(value => value ?? "");
  private touched: () => void = () => undefined;

  public constructor(private readonly element: ElementRef<HTMLInputElement>) {}

  public writeValue(value: string | null): void {
    this.element.nativeElement.value = this.displayValue()(value);
  }

  public registerOnChange(_change: (value: string | null) => void): void {
    // A draft is not a committed form value; the owner calls formControl.setValue after validation.
  }

  public registerOnTouched(touched: () => void): void {
    this.touched = touched;
  }

  public setDisabledState(disabled: boolean): void {
    this.element.nativeElement.disabled = disabled;
  }

  protected markTouched(): void {
    this.touched();
  }
}
