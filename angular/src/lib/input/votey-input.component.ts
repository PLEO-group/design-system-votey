import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  output,
  type OutputEmitterRef,
  type Signal,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import type { VoteyIcon } from "../votey-assets";

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
export type VoteyInputType =
  (typeof VoteyInputTypeNames)[keyof typeof VoteyInputTypeNames];
export type VoteyInputMode = (typeof VoteyInputModes)[number];
export type VoteyInputTrimmer = (value: string) => string;

export const VoteyInputTypes: readonly VoteyInputType[] =
  Object.values(VoteyInputTypeNames);

let nextInputId = 0;

@Component({
  selector: "vt-input",
  templateUrl: "./votey-input.component.html",
  styleUrl: "./votey-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    VoteyFormErrorComponent,
    VoteyIconComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyInputComponent extends VoteyFormControlApplyDirective<string> {
  private readonly fallbackId: string = `vt-input-${++nextInputId}`;

  public readonly variant: InputSignal<VoteyInputVariant> =
    input<VoteyInputVariant>("boxed");
  public readonly type: InputSignal<VoteyInputType> = input<VoteyInputType>(
    VoteyInputTypeNames.text
  );
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly placeholder: InputSignal<string> = input<string>("");
  public readonly helper: InputSignal<string> = input<string>("");
  public readonly icon: InputSignal<VoteyIcon | ""> = input<VoteyIcon | "">("");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly inputMode: InputSignal<VoteyInputMode | ""> = input<
    VoteyInputMode | ""
  >("");
  public readonly min: InputSignal<number | null> = input<number | null>(null);
  public readonly max: InputSignal<number | null> = input<number | null>(null);
  public readonly minLength: InputSignal<number | null> = input<number | null>(
    null
  );
  public readonly maxLength: InputSignal<number | null> = input<number | null>(
    500
  );
  public readonly pattern: InputSignal<string> = input<string>("");
  public readonly trimmer: InputSignal<VoteyInputTrimmer | null> =
    input<VoteyInputTrimmer | null>(null);
  public readonly ariaLabel: InputSignal<string> = input<string>("");
  public readonly ariaDescribedby: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);
  public readonly showErrors: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly blur: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
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

    if (this.shouldShowHelper) ids.push(this.helperId());

    return ids.filter(Boolean).join(" ") || null;
  });

  protected get isDisabled(): boolean {
    return this.disabled() || this.formControl.disabled;
  }

  protected get isRequired(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  protected get hasError(): boolean {
    return (
      this.showErrors() &&
      !this.isDisabled &&
      this.formControl.invalid &&
      this.formControl.touched
    );
  }

  protected get hasValue(): boolean {
    return (this.formControl.value ?? "").length > 0;
  }

  protected get shouldShowHelper(): boolean {
    return this.helper().length > 0;
  }

  protected get showFormErrors(): boolean {
    return this.hasError && !this.shouldShowHelper;
  }

  protected get helperColor(): "error" | "muted" {
    return this.hasError ? "error" : "muted";
  }

  protected get errorKeys(): string[] {
    return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
  }

  protected handleBlur(event: FocusEvent): void {
    const value: string | null = this.formControl.value;
    const trimmer: VoteyInputTrimmer | null = this.trimmer();

    if (value !== null && trimmer) {
      const trimmedValue: string = trimmer(value);

      if (trimmedValue !== value) this.formControl.setValue(trimmedValue);
    }

    this.blur.emit(event);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }
}
