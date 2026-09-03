import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  type InputSignal,
  model,
  type ModelSignal,
  output,
  type OutputEmitterRef,
  type Signal,
  signal,
  type WritableSignal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import type { VoteyIcon } from "../votey-assets";
import { VoteyIconComponent } from "../icon/votey-icon.component";

export const VoteyInputVariants = ["boxed", "underline"] as const;
export const VoteyInputTypes = [
  "text",
  "email",
  "password",
  "search",
  "tel",
  "url",
  "number",
] as const;

export type VoteyInputVariant = (typeof VoteyInputVariants)[number];
export type VoteyInputType = (typeof VoteyInputTypes)[number];

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

  public readonly value: ModelSignal<string> = model<string>("");
  public readonly variant: InputSignal<VoteyInputVariant> =
    input<VoteyInputVariant>("boxed");
  public readonly type: InputSignal<VoteyInputType> =
    input<VoteyInputType>("text");
  public readonly label: InputSignal<string> = input<string>("Etykieta");
  public readonly placeholder: InputSignal<string> = input<string>("Wpisz…");
  public readonly helper: InputSignal<string> =
    input<string>("Tekst pomocniczy");
  public readonly showLabel: InputSignal<boolean> = input<boolean>(true);
  public readonly showHelper: InputSignal<boolean> = input<boolean>(false);
  public readonly icon: InputSignal<VoteyIcon | ""> = input<VoteyIcon | "">("");
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly required: InputSignal<boolean> = input<boolean>(false);
  public readonly error: InputSignal<boolean> = input<boolean>(false);
  public readonly id: InputSignal<string> = input<string>("");
  public readonly name: InputSignal<string> = input<string>("");
  public readonly autocomplete: InputSignal<string> = input<string>("");
  public readonly changed: OutputEmitterRef<string> = output<string>();

  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () => this.disabled() || this.formDisabled()
  );
  protected readonly resolvedId: Signal<string> = computed<string>(
    () => this.id().trim() || this.fallbackId
  );
  protected readonly helperId: Signal<string> = computed<string>(
    () => `${this.resolvedId()}-helper`
  );
  protected readonly helperVisible: Signal<boolean> = computed<boolean>(
    () => this.showHelper() && this.helper().trim().length > 0
  );
  protected readonly labelVisible: Signal<boolean> = computed<boolean>(
    () => this.showLabel() && this.label().trim().length > 0
  );
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

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: string | null): void {
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

  protected handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.value.set(inputElement.value);
    this.onChange(inputElement.value);
    this.changed.emit(inputElement.value);
  }

  protected markAsTouched(): void {
    this.onTouched();
  }
}
