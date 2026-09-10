import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  output,
  type OutputEmitterRef,
  type Signal,
  signal,
  viewChild,
  type WritableSignal,
} from "@angular/core";
import { Validators } from "@angular/forms";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

@Component({
  selector: "vt-textarea",
  templateUrl: "./votey-text-area.component.html",
  styleUrl: "./votey-text-area.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyTextComponent, VoteyTranslatePipe],
})
export class VoteyTextAreaComponent extends VoteyFormControlApplyDirective<string> {
  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly formControlStateVersion: WritableSignal<number> =
    signal<number>(0);

  public readonly label: InputSignal<string> = input<string>("");
  public readonly placeholder: InputSignal<string> = input<string>("");
  public readonly helper: InputSignal<string> = input<string>("");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly trimOnBlur: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly spellcheck: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });

  public readonly minLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly maxLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly dataCy: InputSignal<string> = input<string>("");

  public readonly changed: OutputEmitterRef<string> = output<string>();
  public readonly focused: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly blurred: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  public readonly keyDown: OutputEmitterRef<KeyboardEvent> =
    output<KeyboardEvent>();

  protected readonly textareaElement: Signal<
    ElementRef<HTMLTextAreaElement> | undefined
  > = viewChild<ElementRef<HTMLTextAreaElement>>("textareaElement");
  protected readonly textValue: WritableSignal<string> = signal<string>("");
  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );
  protected readonly isRequired: Signal<boolean> = computed<boolean>(() => {
    this.formControlStateVersion();
    return this.formControl.hasValidator(Validators.required);
  });
  protected readonly hasError: Signal<boolean> = computed<boolean>(() => {
    this.formControlStateVersion();
    return this.formControl.invalid && this.formControl.touched;
  });
  protected readonly errorTranslationKey: Signal<string | null> = computed<
    string | null
  >(() => {
    if (!this.hasError()) return null;

    const [errorName]: string[] = Object.keys(this.formControl.errors ?? {});

    return errorName ? `ERRORS.${errorName.toUpperCase()}` : null;
  });

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

    this.formControl.markAsTouched();
    this.blurred.emit(event);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }

  protected override handleFormControlValueChange(value: string | null): void {
    this.textValue.set(value ?? "");
  }

  protected override handleFormControlDisabledChange(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected override handleFormControlStateChange(): void {
    this.formControlStateVersion.update((version: number) => version + 1);
  }

  private commitValue(value: string): void {
    if (this.formControl.value === value) return;

    this.formControl.setValue(value);
    this.changed.emit(value);
  }
}
