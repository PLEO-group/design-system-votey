import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from "@angular/cdk/overlay";
import {
  booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed,
  effect, input, signal, viewChild, type ElementRef, type InputSignal,
  type InputSignalWithTransform, type Signal, type WritableSignal,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyMenuComponent, type VoteyMenuItem } from "../menu/votey-menu.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { PickerCalendarComponent } from "./picker-calendar.component";
import { nearestAllowedDay } from "./picker-calendar.model";
import { PickerControl, type PickerError } from "./picker-control";
import { PickerDraftValueAccessorDirective } from "./picker-draft-value-accessor.directive";
import {
  canonicalInstant, dateParts, firstAllowedTime, formatCalendarDate, formatTime,
  isWithinDateRange, isWithinInstantRange, localInstant,
  parseCalendarDate, parseDateInput, parseDateTimeInput, parseInstant, timeParts,
  timeSuggestions, validateDateConfig, type PickerDateParts, type PickerMode,
  type PickerTimeEntryPolicy, type PickerTimeParts,
} from "./picker-value";
export type { PickerMode, PickerTimeEntryPolicy } from "./picker-value";

export const VoteyDatePickerModes = ["Date", "DateTime"] as const;
const DATE_FORMAT = "DD.MM.RRRR";
const DATE_TIME_FORMAT = "DD.MM.RRRR, GG:MM";

let nextPickerId = 0;

@Component({
  selector: "vt-date-picker",
  templateUrl: "./votey-date-picker.component.html",
  styleUrl: "./votey-date-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PickerDraftValueAccessorDirective, CdkOverlayOrigin, CdkConnectedOverlay, PickerCalendarComponent,
    VoteyMenuComponent, VoteyIconComponent, VoteyFormErrorComponent, VoteyTranslatePipe],
})
export class VoteyDatePickerComponent extends PickerControl {
  public readonly label: InputSignal<string> = input<string>("");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly mode: InputSignal<PickerMode> = input<PickerMode>("Date");
  public readonly min: InputSignal<string | null> = input<string | null>(null);
  public readonly max: InputSignal<string | null> = input<string | null>(null);
  public readonly locale: InputSignal<string> = input<string>("pl-PL");
  public readonly stepMinutes: InputSignal<number> = input<number>(30);
  public readonly timeEntryPolicy: InputSignal<PickerTimeEntryPolicy> = input<PickerTimeEntryPolicy>("allowManual");

  private readonly fallbackId = `vt-date-picker-${++nextPickerId}`;
  private readonly field: Signal<ElementRef<HTMLInputElement> | undefined> = viewChild<ElementRef<HTMLInputElement>>("fieldInput");
  private readonly calendar: Signal<PickerCalendarComponent | undefined> = viewChild<PickerCalendarComponent>(PickerCalendarComponent);
  private readonly menu: Signal<VoteyMenuComponent | undefined> = viewChild<VoteyMenuComponent>(VoteyMenuComponent);
  protected readonly active: WritableSignal<PickerDateParts> = signal(dateParts(new Date()));
  protected readonly displayedMonth: Signal<PickerDateParts> = computed(() => ({ ...this.active(), day: 1 }));
  protected readonly selected: Signal<PickerDateParts | null> = computed(() => {
    const value = this.committed();
    if (!value) return null;
    if (this.mode() === "Date") return parseCalendarDate(value).value;
    const instant = parseInstant(value);
    return instant ? dateParts(instant) : null;
  });
  protected readonly minDay: Signal<PickerDateParts | null> = computed(() =>
    this.mode() === "Date" ? (this.min() ? parseCalendarDate(this.min()!).value : null) : (this.min() && parseInstant(this.min()!) ? dateParts(parseInstant(this.min()!)!) : null)
  );
  protected readonly maxDay: Signal<PickerDateParts | null> = computed(() =>
    this.mode() === "Date" ? (this.max() ? parseCalendarDate(this.max()!).value : null) : (this.max() && parseInstant(this.max()!) ? dateParts(parseInstant(this.max()!)!) : null)
  );
  protected readonly timeItems: Signal<readonly VoteyMenuItem[]> = computed(() => {
    const day = this.selected();
    if (!day || this.mode() !== "DateTime") return [];
    const min = this.min() ? parseInstant(this.min()!) : null;
    const max = this.max() ? parseInstant(this.max()!) : null;
    return timeSuggestions(this.stepMinutes()).filter(label => {
      const time = this.parseSuggestion(label);
      const instant = localInstant({ ...day, ...time });
      return instant && isWithinInstantRange(instant, min, max);
    }).map(label => ({ id: label, label }));
  });
  protected readonly selectedTime: Signal<string | null> = computed(() => {
    const instant = this.committed() ? parseInstant(this.committed()!) : null;
    return instant && this.mode() === "DateTime" ? formatTime(timeParts(instant)) : null;
  });
  protected readonly positions: ConnectedPosition[] = [
    { originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 8 },
    { originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -8 },
  ];

  protected readonly dayAllowed = (day: PickerDateParts): boolean => {
    if (this.configurationError()) return false;
    if (this.mode() === "Date") return isWithinDateRange(day, this.minDay(), this.maxDay());
    return firstAllowedTime(day, this.min() ? parseInstant(this.min()!) : null,
      this.max() ? parseInstant(this.max()!) : null, this.stepMinutes(), this.timeEntryPolicy()) !== null;
  };

  public constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
    effect((): void => {
      this.mode(); this.min(); this.max(); this.locale(); this.stepMinutes(); this.timeEntryPolicy();
      if (this.configurationError()) this.opened.set(false);
      this.refreshDisplay();
      this.refreshValidation();
    });
    effect((): void => {
      if (this.disabled()) this.opened.set(false);
    });
  }

  protected override get isDisabled(): boolean {
    return this.disabled() || super.isDisabled;
  }

  protected get isRequired(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  protected get inputId(): string { return this.fallbackId; }
  protected get expectedFormat(): string { return this.mode() === "Date" ? DATE_FORMAT : DATE_TIME_FORMAT; }
  protected readonly displayValue = (value: string | null): string => this.formatCommitted(value);

  protected override formatCommitted(value: string | null): string {
    if (!value) return "";
    if (this.mode() === "Date") {
      const parsed = parseCalendarDate(value);
      return parsed.value ? `${String(parsed.value.day).padStart(2, "0")}.${String(parsed.value.month).padStart(2, "0")}.${parsed.value.year}` : value;
    }
    const instant = parseInstant(value);
    if (!instant) return value;
    const day = dateParts(instant);
    return `${String(day.day).padStart(2, "0")}.${String(day.month).padStart(2, "0")}.${day.year}, ${formatTime(timeParts(instant))}`;
  }

  protected override validateCommitted(value: string | null): PickerError | null {
    const config = this.configurationError();
    if (config) return { voteyPickerConfig: { reason: config } };
    if (!value) return null;
    if (this.mode() === "Date") {
      const parsed = parseCalendarDate(value);
      if (!parsed.value) return { voteyPickerFormat: { expected: DATE_FORMAT } };
      return isWithinDateRange(parsed.value, this.minDay(), this.maxDay()) ? null :
        { voteyPickerRange: { min: this.min(), max: this.max() } };
    }
    const instant = parseInstant(value);
    if (!instant) return { voteyPickerFormat: { expected: DATE_TIME_FORMAT } };
    return isWithinInstantRange(instant, this.min() ? parseInstant(this.min()!) : null,
      this.max() ? parseInstant(this.max()!) : null) ? null :
      { voteyPickerRange: { min: this.min(), max: this.max() } };
  }

  protected override commitDraft(value: string): { value: string | null; error: PickerError | null } {
    const config = this.configurationError();
    if (config) return { value: null, error: { voteyPickerConfig: { reason: config } } };
    if (!value) return { value: null, error: null };
    const parsed = this.mode() === "Date" ? parseDateInput(value) : parseDateTimeInput(value);
    if (parsed.error) {
      const error = parsed.error === "format" ? { voteyPickerFormat: { expected: this.expectedFormat } } :
        parsed.error === "date" ? { voteyPickerDate: { input: value } } : { voteyPickerTime: { input: value } };
      return { value: null, error };
    }
    if (this.mode() === "Date") {
      const day = parsed.value as PickerDateParts;
      return isWithinDateRange(day, this.minDay(), this.maxDay()) ?
        { value: formatCalendarDate(day), error: null } :
        { value: null, error: { voteyPickerRange: { min: this.min(), max: this.max() } } };
    }
    const parts = parsed.value as PickerDateParts & PickerTimeParts;
    const instant = localInstant(parts)!;
    if (!isWithinInstantRange(instant, this.min() ? parseInstant(this.min()!) : null,
      this.max() ? parseInstant(this.max()!) : null)) {
      return { value: null, error: { voteyPickerRange: { min: this.min(), max: this.max() } } };
    }
    if (this.timeEntryPolicy() === "listOnly" && (parts.hour * 60 + parts.minute) % this.stepMinutes() !== 0) {
      return { value: null, error: { voteyPickerPolicy: { stepMinutes: this.stepMinutes() } } };
    }
    return { value: canonicalInstant(parts), error: null };
  }

  protected open(): void {
    if (this.isDisabled || this.configurationError()) return;
    const origin = this.selected() ?? dateParts(new Date());
    const active = nearestAllowedDay(origin, this.dayAllowed, this.minDay(), this.maxDay());
    if (!active) return;
    this.active.set(active);
    this.opened.set(true);
    queueMicrotask(() => {
      this.calendar()?.focusActive();
      this.menu()?.scrollSelected();
    });
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

  protected chooseDay(day: PickerDateParts): void {
    if (!this.dayAllowed(day)) return;
    if (this.mode() === "Date") {
      this.setCommitted(formatCalendarDate(day));
      this.close();
      return;
    }
    const previous = this.committed() ? parseInstant(this.committed()!) : null;
    const nextTime = firstAllowedTime(day, this.min() ? parseInstant(this.min()!) : null,
      this.max() ? parseInstant(this.max()!) : null, this.stepMinutes(), this.timeEntryPolicy(),
      previous ? timeParts(previous) : null);
    if (!nextTime) return;
    this.setCommitted(canonicalInstant({ ...day, ...nextTime }));
    this.active.set(day);
  }

  protected chooseTime(item: VoteyMenuItem): void {
    const day = this.selected();
    if (!day) return;
    const time = this.parseSuggestion(item.id);
    this.setCommitted(canonicalInstant({ ...day, ...time }));
    this.close();
  }

  protected clear(): void {
    if (this.isDisabled || this.isRequired) return;
    this.setCommitted(null);
    this.close();
  }

  private configurationError(): ReturnType<typeof validateDateConfig> {
    return validateDateConfig(this.mode(), this.min(), this.max(), this.locale(), this.stepMinutes(), this.timeEntryPolicy());
  }

  private parseSuggestion(value: string): PickerTimeParts {
    return { hour: Number(value.slice(0, 2)), minute: Number(value.slice(3)) };
  }
}
