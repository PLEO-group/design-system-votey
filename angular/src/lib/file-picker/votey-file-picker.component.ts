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

let nextFilePickerId = 0;

@Component({
  selector: "vt-file-picker",
  templateUrl: "./votey-file-picker.component.html",
  styleUrl: "./votey-file-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VoteyFilePickerComponent),
      multi: true,
    },
  ],
})
export class VoteyFilePickerComponent implements ControlValueAccessor {
  private readonly fallbackId: string = `vt-file-picker-${++nextFilePickerId}`;
  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);

  public readonly value: ModelSignal<File | null> = model<File | null>(null);
  public readonly filename: InputSignal<string> = input<string>("");
  public readonly label: InputSignal<string> = input<string>("");
  public readonly emptyText: InputSignal<string> = input<string>(
    "Nie wybrano pliku"
  );
  public readonly actionText: InputSignal<string> = input<string>("Wybierz plik");
  public readonly showLabel: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(true, { transform: booleanAttribute });
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly required: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly accept: InputSignal<string> = input<string>("");
  public readonly capture: InputSignal<string> = input<string>("");
  public readonly ariaLabel: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");

  public readonly changed: OutputEmitterRef<File | null> =
    output<File | null>();
  public readonly cancelled: OutputEmitterRef<void> = output<void>();
  public readonly focused: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly blurred: OutputEmitterRef<FocusEvent> = output<FocusEvent>();

  protected readonly fileInput: Signal<
    ElementRef<HTMLInputElement> | undefined
  > = viewChild<ElementRef<HTMLInputElement>>("fileInput");
  protected readonly actionElement: Signal<
    ElementRef<HTMLButtonElement> | undefined
  > = viewChild<ElementRef<HTMLButtonElement>>("actionElement");
  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );
  protected readonly resolvedId: Signal<string> = computed<string>(
    () => this.id().trim() || this.fallbackId
  );
  protected readonly statusId: Signal<string> = computed<string>(
    () => `${this.resolvedId()}-status`
  );
  protected readonly labelVisible: Signal<boolean> = computed<boolean>(
    () => this.showLabel() && this.label().trim().length > 0
  );
  protected readonly hasFile: Signal<boolean> = computed<boolean>(
    () => this.value() !== null || this.filename().trim().length > 0
  );
  protected readonly resolvedFilename: Signal<string> = computed<string>(
    () => this.value()?.name || this.filename().trim() || this.emptyText()
  );
  protected readonly resolvedAriaLabel: Signal<string> = computed<string>(
    () =>
      this.ariaLabel().trim() ||
      this.actionText().trim() ||
      this.label().trim()
  );
  protected readonly filePickerClasses: Signal<string> = computed<string>(() =>
    [
      "file-picker",
      this.hasFile() ? "filled" : "",
      this.effectiveDisabled() ? "disabled" : "",
    ]
      .filter(Boolean)
      .join(" ")
  );

  private onChange: (value: File | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: File | null | undefined): void {
    this.value.set(value ?? null);

    if (!value) this.resetNativeInput();
  }

  public registerOnChange(callback: (value: File | null) => void): void {
    this.onChange = callback;
  }

  public registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  public open(): void {
    if (this.effectiveDisabled()) return;

    const inputElement: HTMLInputElement | undefined =
      this.fileInput()?.nativeElement;

    if (!inputElement) return;

    inputElement.value = "";
    inputElement.click();
  }

  public focus(options?: FocusOptions): void {
    if (this.effectiveDisabled()) return;

    this.actionElement()?.nativeElement.focus(options);
  }

  public blur(): void {
    this.actionElement()?.nativeElement.blur();
  }

  public clear(): void {
    if (this.effectiveDisabled()) return;

    this.resetNativeInput();
    this.commitValue(null);
  }

  protected handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedFile: File | null = inputElement.files?.item(0) ?? null;

    this.commitValue(selectedFile);
  }

  protected handleCancel(): void {
    this.cancelled.emit();
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  private resetNativeInput(): void {
    const inputElement: HTMLInputElement | undefined =
      this.fileInput()?.nativeElement;

    if (inputElement) inputElement.value = "";
  }

  private commitValue(value: File | null): void {
    if (this.value() === value) return;

    this.value.set(value);
    this.onChange(value);
    this.changed.emit(value);
  }
}
