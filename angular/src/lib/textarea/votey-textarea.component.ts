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

let nextTextareaId = 0;

@Component({
  selector: "vt-textarea",
  templateUrl: "./votey-textarea.component.html",
  styleUrl: "./votey-textarea.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VoteyTextareaComponent),
      multi: true,
    },
  ],
})
export class VoteyTextareaComponent implements ControlValueAccessor {
  private readonly fallbackId: string = `vt-textarea-${++nextTextareaId}`;
  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);

  public readonly value: ModelSignal<string> = model<string>("");
  public readonly label: InputSignal<string> = input<string>("");
  public readonly placeholder: InputSignal<string> = input<string>("");
  public readonly helper: InputSignal<string> = input<string>("");
  public readonly showLabel: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(true, { transform: booleanAttribute });
  public readonly showHelper: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });
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
  public readonly spellcheck: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(true, { transform: booleanAttribute });
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly autocomplete: InputSignal<string> = input<string>("");
  public readonly minLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly maxLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly ariaLabel: InputSignal<string> = input<string>("");
  public readonly ariaDescribedby: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");

  public readonly changed: OutputEmitterRef<string> = output<string>();
  public readonly focused: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly blurred: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly keyDown: OutputEmitterRef<KeyboardEvent> =
    output<KeyboardEvent>();

  protected readonly textareaElement: Signal<
    ElementRef<HTMLTextAreaElement> | undefined
  > = viewChild<ElementRef<HTMLTextAreaElement>>("textareaElement");
  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );
  protected readonly resolvedId: Signal<string> = computed<string>(
    () => this.id().trim() || this.fallbackId
  );
  protected readonly helperId: Signal<string> = computed<string>(
    () => `${this.resolvedId()}-helper`
  );
  protected readonly labelVisible: Signal<boolean> = computed<boolean>(
    () => this.showLabel() && this.label().trim().length > 0
  );
  protected readonly helperVisible: Signal<boolean> = computed<boolean>(
    () => this.showHelper() && this.helper().trim().length > 0
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
  protected readonly textareaClasses: Signal<string> = computed<string>(() =>
    [
      "textarea",
      this.value().length > 0 ? "filled" : "",
      this.error() ? "error" : "",
      this.effectiveDisabled() ? "disabled" : "",
    ]
      .filter(Boolean)
      .join(" ")
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: string | null | undefined): void {
    this.value.set(value ?? "");
  }

  public registerOnChange(callback: (value: string) => void): void {
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

    this.textareaElement()?.nativeElement.focus(options);
  }

  public blur(): void {
    this.textareaElement()?.nativeElement.blur();
  }

  public select(): void {
    if (this.effectiveDisabled()) return;

    this.textareaElement()?.nativeElement.select();
  }

  public clear(): void {
    if (this.effectiveDisabled() || this.readOnly()) return;

    this.commitValue("");
  }

  protected handleInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement;

    this.commitValue(textareaElement.value);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    const textareaElement = event.target as HTMLTextAreaElement;
    const trimmedValue: string = textareaElement.value.trim();

    if (this.trimOnBlur() && textareaElement.value !== trimmedValue) {
      textareaElement.value = trimmedValue;
      this.commitValue(trimmedValue);
    }

    this.onTouched();
    this.blurred.emit(event);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }

  private commitValue(value: string): void {
    if (this.value() === value) return;

    this.value.set(value);
    this.onChange(value);
    this.changed.emit(value);
  }
}
