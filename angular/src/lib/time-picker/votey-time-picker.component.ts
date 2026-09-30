import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from "@angular/cdk/overlay";
import {
  booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  computed, effect, input, viewChild, type ElementRef, type InputSignal,
  type InputSignalWithTransform, type Signal,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { injectVoteyTranslator, type VoteyTranslator } from "../translation/votey-translation";
import type { VoteyMenuItem } from "../menu/votey-menu.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { PickerControl, type PickerError } from "../picker/picker-control";
import { PickerDraftValueAccessorDirective } from "../picker/picker-draft-value-accessor.directive";
import { PickerTimeListComponent } from "./picker-time-list.component";
import {
  isTimeWithinBounds, parseTimeInput, timeSuggestions, validateTimeConfig,
  type PickerTimeEntryPolicy,
} from "../picker/picker-value";

export const VoteyTimeEntryPolicies = ["allowManual", "listOnly"] as const;

let nextTimeId = 0;

@Component({
  selector: "vt-time-picker",
  templateUrl: "./votey-time-picker.component.html",
  styleUrl: "./votey-time-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PickerDraftValueAccessorDirective, CdkOverlayOrigin, CdkConnectedOverlay, PickerTimeListComponent,
    VoteyButtonComponent, VoteyIconComponent, VoteyTextComponent, VoteyFormErrorComponent, VoteyTranslatePipe],
})
export class VoteyTimePickerComponent extends PickerControl {
  private readonly translator: VoteyTranslator = injectVoteyTranslator();
  public readonly label: InputSignal<string> = input<string>("");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly stepMinutes: InputSignal<number> = input<number>(30);
  public readonly timeEntryPolicy: InputSignal<PickerTimeEntryPolicy> = input<PickerTimeEntryPolicy>("allowManual");
  public readonly min: InputSignal<string | null> = input<string | null>(null);
  public readonly max: InputSignal<string | null> = input<string | null>(null);

  private readonly fallbackId = `vt-time-picker-${++nextTimeId}`;
  private readonly field: Signal<ElementRef<HTMLInputElement> | undefined> = viewChild<ElementRef<HTMLInputElement>>("fieldInput");
  private readonly menu: Signal<PickerTimeListComponent | undefined> = viewChild<PickerTimeListComponent>(PickerTimeListComponent);
  protected readonly timeItems: Signal<readonly VoteyMenuItem[]> = computed(() =>
    timeSuggestions(this.stepMinutes())
      .filter(label => isTimeWithinBounds(label, this.min(), this.max()))
      .map(label => ({ id: label, label }))
  );
  protected readonly positions: ConnectedPosition[] = [
    { originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 8 },
    { originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -8 },
  ];

  public constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
    effect((): void => {
      this.stepMinutes(); this.timeEntryPolicy(); this.min(); this.max();
      if (this.configurationError()) this.opened.set(false);
      this.refreshValidation();
    });
    effect((): void => {
      if (this.disabled()) this.opened.set(false);
    });
  }

  protected override get isDisabled(): boolean { return this.disabled() || super.isDisabled; }
  protected get isRequired(): boolean { return this.formControl.hasValidator(Validators.required); }
  protected get inputId(): string { return this.fallbackId; }
  protected get expectedFormat(): string { return this.translator.translate("LABEL.TIME_FORMAT"); }
  protected readonly displayValue = (value: string | null): string => this.formatCommitted(value);

  protected override formatCommitted(value: string | null): string { return value ?? ""; }

  protected override validateCommitted(value: string | null): PickerError | null {
    const config = this.configurationError();
    if (config) return { voteyPickerConfig: { reason: config } };
    if (!value) return null;
    const parsed = parseTimeInput(value);
    if (parsed.error === "format") return { voteyPickerFormat: { expected: this.expectedFormat } };
    if (parsed.error === "time") return { voteyPickerTime: { input: value } };
    if (!isTimeWithinBounds(value, this.min(), this.max())) {
      return { voteyPickerRange: { min: this.min(), max: this.max() } };
    }
    return null;
  }

  protected override commitDraft(value: string): { value: string | null; error: PickerError | null } {
    const config = this.configurationError();
    if (config) return { value: null, error: { voteyPickerConfig: { reason: config } } };
    if (!value) return { value: null, error: null };
    const parsed = parseTimeInput(value);
    if (parsed.error === "format") return { value: null, error: { voteyPickerFormat: { expected: this.expectedFormat } } };
    if (parsed.error === "time") return { value: null, error: { voteyPickerTime: { input: value } } };
    if (!isTimeWithinBounds(value, this.min(), this.max())) {
      return { value: null, error: { voteyPickerRange: { min: this.min(), max: this.max() } } };
    }
    if (this.timeEntryPolicy() === "listOnly" &&
      (parsed.value.hour * 60 + parsed.value.minute) % this.stepMinutes() !== 0) {
      return { value: null, error: { voteyPickerPolicy: { stepMinutes: this.stepMinutes() } } };
    }
    return { value, error: null };
  }

  protected open(): void {
    if (!this.isDisabled && !this.configurationError()) {
      this.opened.set(true);
      queueMicrotask(() => this.menu()?.focusSelected());
    }
  }

  protected close(): void {
    if (!this.opened()) return;
    this.opened.set(false);
    this.formControl.markAsTouched();
    queueMicrotask(() => this.field()?.nativeElement.focus());
  }

  protected handleOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") { event.preventDefault(); this.close(); }
  }

  protected chooseTime(item: VoteyMenuItem): void {
    this.setCommitted(item.id);
    this.close();
  }

  protected clear(): void {
    if (this.isDisabled || this.isRequired) return;
    this.setCommitted(null);
    this.close();
  }

  private configurationError(): ReturnType<typeof validateTimeConfig> {
    return validateTimeConfig(this.stepMinutes(), this.timeEntryPolicy(), this.min(), this.max());
  }
}
