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
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

@Component({
  selector: "vt-file-picker",
  templateUrl: "./votey-file-picker.component.html",
  styleUrl: "./votey-file-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyTextComponent, VoteyTranslatePipe, VoteyButtonComponent],
})
export class VoteyFilePickerComponent
  extends VoteyFormControlApplyDirective<File>
{
  public readonly filename: InputSignal<string> = input<string>("");
  public readonly label: InputSignal<string> = input<string>("");
  public readonly emptyText: InputSignal<string> =
    input<string>("NO_FILE_SELECTED");
  public readonly actionText: InputSignal<string> =
    input<string>("BUTTON.CHOOSE_FILE");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly name: InputSignal<string> = input<string>("");
  public readonly accept: InputSignal<string> = input<string>("");
  public readonly capture: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");

  public readonly changed: OutputEmitterRef<File | null> =
    output<File | null>();
  public readonly cancelled: OutputEmitterRef<void> = output<void>();

  protected readonly fileInput: Signal<
    ElementRef<HTMLInputElement> | undefined
  > = viewChild<ElementRef<HTMLInputElement>>("fileInput");
  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly formControlStateVersion: WritableSignal<number> =
    signal<number>(0);
  private readonly selectedFile: WritableSignal<File | null> =
    signal<File | null>(null);
  protected readonly hasFile: Signal<boolean> = computed<boolean>(
    () => this.selectedFile() !== null || this.filename().trim().length > 0
  );
  protected readonly resolvedFilename: Signal<string> = computed<string>(
    () => this.selectedFile()?.name || this.filename().trim()
  );
  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );
  protected readonly isRequired: Signal<boolean> = computed<boolean>(() => {
    this.formControlStateVersion();

    return this.formControl.hasValidator(Validators.required);
  });

  public open(): void {
    if (this.effectiveDisabled()) return;

    const inputElement: HTMLInputElement | undefined =
      this.fileInput()?.nativeElement;

    if (!inputElement) return;

    inputElement.value = "";
    inputElement.click();
  }

  protected handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedFile: File | null = inputElement.files?.item(0) ?? null;

    this.commitValue(selectedFile);
  }

  protected handleCancel(): void {
    this.cancelled.emit();
  }

  protected override handleFormControlValueChange(value: File | null): void {
    this.selectedFile.set(value);

    if (!value) this.resetNativeInput();
  }

  protected override handleFormControlDisabledChange(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected override handleFormControlStateChange(): void {
    this.formControlStateVersion.update((version: number) => version + 1);
  }

  private resetNativeInput(): void {
    const inputElement: HTMLInputElement | undefined =
      this.fileInput()?.nativeElement;

    if (inputElement) inputElement.value = "";
  }

  private commitValue(value: File | null): void {
    if (this.formControl.value === value) return;

    this.formControl.setValue(value);
    this.changed.emit(value);
  }
}
