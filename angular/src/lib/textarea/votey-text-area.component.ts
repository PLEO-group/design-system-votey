import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  type OnChanges,
  type OnDestroy,
  output,
  type OutputEmitterRef,
  type Signal,
  type SimpleChanges,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

let nextTextAreaId = 0;

@Component({
  selector: "vt-text-area",
  templateUrl: "./votey-text-area.component.html",
  styleUrl: "./votey-text-area.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    VoteyFormErrorComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyTextAreaComponent
  extends VoteyFormControlApplyDirective<string>
  implements OnChanges, OnDestroy
{
  private readonly fallbackId: string = `vt-text-area-${++nextTextAreaId}`;
  private disabledByInput: FormControl<string | null> | null = null;

  public readonly label: InputSignal<string> = input<string>("");
  public readonly placeholder: InputSignal<string> = input<string>("");
  public readonly helper: InputSignal<string> = input<string>("");
  public readonly limitDescription: InputSignal<string> = input<string>(
    "CHARACTER_LIMIT_DESCRIPTION"
  );
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly spellcheck: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });

  public readonly minLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly maxLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly ariaLabel: InputSignal<string> = input<string>("");
  public readonly ariaDescribedby: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);

  public readonly changed: OutputEmitterRef<string> = output<string>();
  public readonly keyDown: OutputEmitterRef<KeyboardEvent> =
    output<KeyboardEvent>();

  protected readonly resolvedId: Signal<string> = computed<string>(
    () => this.id().trim() || this.fallbackId
  );
  protected readonly helperId: Signal<string> = computed<string>(
    () => `${this.resolvedId()}-helper`
  );
  protected readonly errorId: Signal<string> = computed<string>(
    () => `${this.resolvedId()}-error`
  );
  protected readonly resolvedAriaDescribedby: Signal<string | null> = computed<
    string | null
  >(() => {
    const ids: string[] = [this.ariaDescribedby().trim()];

    if (this.helper() || this.maxLength() !== null) ids.push(this.helperId());

    return ids.filter(Boolean).join(" ") || null;
  });

  protected get isDisabled(): boolean {
    return this.disabled() || this.formControl.disabled;
  }

  protected get isRequired(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  protected get hasError(): boolean {
    return !this.isDisabled && this.formControl.invalid && this.formControl.touched;
  }

  protected get errorKeys(): string[] {
    return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes["disabled"] && !changes["control"]) return;

    if (this.disabledByInput && (changes["control"] || !this.disabled())) {
      this.disabledByInput.enable();
      this.disabledByInput = null;
    }

    if (this.disabled() && this.formControl.enabled) {
      this.formControl.disable();
      this.disabledByInput = this.formControl;
    }
  }

  public ngOnDestroy(): void {
    this.disabledByInput?.enable();
  }

  protected handleInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement;

    this.changed.emit(textareaElement.value);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }
}
