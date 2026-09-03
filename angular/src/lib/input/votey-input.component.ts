import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  model,
  type ModelSignal,
  output,
  type OutputEmitterRef,
  type Signal,
  signal,
  viewChild,
  type WritableSignal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import type { VoteyIcon } from "../votey-assets";
import { VoteyIconComponent } from "../icon/votey-icon.component";

export const VoteyInputVariants = ["boxed", "underline"] as const;
export const VoteyInputTypeNames = {
  text: "text",
  email: "email",
  password: "password",
  search: "search",
  tel: "tel",
  url: "url",
  number: "number",
} as const;
export const VoteyInputTypes = [
  VoteyInputTypeNames.text,
  VoteyInputTypeNames.email,
  VoteyInputTypeNames.password,
  VoteyInputTypeNames.search,
  VoteyInputTypeNames.tel,
  VoteyInputTypeNames.url,
  VoteyInputTypeNames.number,
] as const;
export const VoteyInputModes = [
  "none",
  "text",
  "decimal",
  "numeric",
  "tel",
  "search",
  "email",
  "url",
] as const;

export type VoteyInputVariant = (typeof VoteyInputVariants)[number];
export type VoteyInputType = (typeof VoteyInputTypes)[number];
export type VoteyInputMode = (typeof VoteyInputModes)[number];
export type VoteyInputValue = string | number | null;

let nextInputId = 0;

@Component({
  selector: "vt-input",
  templateUrl: "./votey-input.component.html",
  styleUrl: "./votey-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VoteyInputComponent),
      multi: true,
    },
  ],
})
export class VoteyInputComponent implements ControlValueAccessor {
  private readonly fallbackId: string = `vt-input-${++nextInputId}`;
  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);

  public readonly value: ModelSignal<VoteyInputValue> =
    model<VoteyInputValue>("");
  public readonly variant: InputSignal<VoteyInputVariant> =
    input<VoteyInputVariant>("boxed");
  public readonly type: InputSignal<VoteyInputType> = input<VoteyInputType>(
    VoteyInputTypeNames.text
  );
  public readonly label: InputSignal<string> = input<string>("Etykieta");
  public readonly placeholder: InputSignal<string> = input<string>("Wpisz…");
  public readonly helper: InputSignal<string> =
    input<string>("Tekst pomocniczy");
  public readonly showLabel: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(true, { transform: booleanAttribute });
  public readonly showHelper: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly icon: InputSignal<VoteyIcon | ""> = input<VoteyIcon | "">("");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly required: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly readOnly: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly error: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly trimOnBlur: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly autofocus: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly autocomplete: InputSignal<string> = input<string>("");
  public readonly inputMode: InputSignal<VoteyInputMode | ""> = input<
    VoteyInputMode | ""
  >("");
  public readonly min: InputSignal<number | null> = input<number | null>(null);
  public readonly max: InputSignal<number | null> = input<number | null>(null);
  public readonly step: InputSignal<number | null> = input<number | null>(null);
  public readonly minLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly maxLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly pattern: InputSignal<string> = input<string>("");
  public readonly ariaLabel: InputSignal<string> = input<string>("");
  public readonly ariaDescribedby: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");
  public readonly changed: OutputEmitterRef<VoteyInputValue> =
    output<VoteyInputValue>();
  public readonly focused: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly blurred: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly keyDown: OutputEmitterRef<KeyboardEvent> =
    output<KeyboardEvent>();

  protected readonly inputElement: Signal<
    ElementRef<HTMLInputElement> | undefined
  > = viewChild<ElementRef<HTMLInputElement>>("inputElement");

  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );
  protected readonly resolvedId: Signal<string> = computed<string>(
    () => this.id().trim() || this.fallbackId
  );
  protected readonly helperId: Signal<string> = computed<string>(
    () => `${this.resolvedId()}-helper`
  );
  protected readonly displayValue: Signal<string | number> = computed<
    string | number
  >(() => this.value() ?? "");
  protected readonly helperVisible: Signal<boolean> = computed<boolean>(
    () => this.showHelper() && this.helper().trim().length > 0
  );
  protected readonly labelVisible: Signal<boolean> = computed<boolean>(
    () => this.showLabel() && this.label().trim().length > 0
  );
  protected readonly resolvedAriaLabel: Signal<string | null> = computed<
    string | null
  >(() => {
    const ariaLabel: string = this.ariaLabel().trim();

    if (ariaLabel) return ariaLabel;
    if (!this.labelVisible()) return this.label().trim() || null;
    return null;
  });
  protected readonly resolvedAriaDescribedby: Signal<string | null> = computed<
    string | null
  >(() => {
    const ids: string[] = [this.ariaDescribedby().trim()];

    if (this.helperVisible()) ids.push(this.helperId());

    return ids.filter(Boolean).join(" ") || null;
  });
  protected readonly inputClasses: Signal<string> = computed<string>(() =>
    [
      "input",
      this.variant(),
      this.error() ? "error" : "",
      this.effectiveDisabled() ? "disabled" : "",
    ]
      .filter(Boolean)
      .join(" ")
  );

  private onChange: (value: VoteyInputValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: VoteyInputValue | undefined): void {
    this.value.set(value ?? null);
  }

  public registerOnChange(callback: (value: VoteyInputValue) => void): void {
    this.onChange = callback;
  }

  public registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  public focus(options?: FocusOptions): void {
    if (this.effectiveDisabled()) return;

    this.inputElement()?.nativeElement.focus(options);
  }

  public blur(): void {
    this.inputElement()?.nativeElement.blur();
  }

  public select(): void {
    if (this.effectiveDisabled()) return;

    this.inputElement()?.nativeElement.select();
  }

  public clear(): void {
    if (this.effectiveDisabled() || this.readOnly()) return;

    this.commitValue(this.type() === VoteyInputTypeNames.number ? null : "");
  }

  protected handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numericValue: number = inputElement.valueAsNumber;
    const value: VoteyInputValue =
      this.type() === VoteyInputTypeNames.number
        ? inputElement.value === "" || Number.isNaN(numericValue)
          ? null
          : numericValue
        : inputElement.value;

    this.commitValue(value);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue: string = inputElement.value.trim();

    if (
      this.trimOnBlur() &&
      this.type() !== VoteyInputTypeNames.number &&
      inputElement.value !== trimmedValue
    ) {
      inputElement.value = trimmedValue;
      this.commitValue(trimmedValue);
    }

    this.onTouched();
    this.blurred.emit(event);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }

  private commitValue(value: VoteyInputValue): void {
    if (Object.is(this.value(), value)) return;

    this.value.set(value);
    this.onChange(value);
    this.changed.emit(value);
  }
}
