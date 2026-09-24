import {
  ChangeDetectionStrategy, Component, computed, input, output, viewChildren,
  type ElementRef, type InputSignal, type OutputEmitterRef, type Signal,
} from "@angular/core";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { calendarDays, moveActiveDay, moveActiveMonth, type PickerCalendarDay } from "./picker-calendar.model";
import { calendarDayKey, dateParts, type PickerDateParts } from "./picker-value";

interface DisplayDay extends PickerCalendarDay {
  readonly ariaLabel: string;
  readonly active: boolean;
}

@Component({
  selector: "vt-picker-calendar",
  templateUrl: "./picker-calendar.component.html",
  styleUrl: "./picker-calendar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyIconComponent, VoteyTranslatePipe],
})
export class PickerCalendarComponent {
  public readonly month: InputSignal<PickerDateParts> = input.required<PickerDateParts>();
  public readonly active: InputSignal<PickerDateParts> = input.required<PickerDateParts>();
  public readonly selected: InputSignal<PickerDateParts | null> = input<PickerDateParts | null>(null);
  public readonly min: InputSignal<PickerDateParts | null> = input<PickerDateParts | null>(null);
  public readonly max: InputSignal<PickerDateParts | null> = input<PickerDateParts | null>(null);
  public readonly locale: InputSignal<string> = input<string>("pl-PL");
  public readonly isAllowed: InputSignal<(day: PickerDateParts) => boolean> = input.required<(day: PickerDateParts) => boolean>();
  public readonly selectedDay: OutputEmitterRef<PickerDateParts> = output<PickerDateParts>();
  public readonly activeDay: OutputEmitterRef<PickerDateParts> = output<PickerDateParts>();

  private readonly buttons: Signal<readonly ElementRef<HTMLButtonElement>[]> = viewChildren<ElementRef<HTMLButtonElement>>("dayButton");
  protected readonly days: Signal<readonly DisplayDay[]> = computed(() => {
    const activeKey = calendarDayKey(this.active());
    const formatter = new Intl.DateTimeFormat(this.locale(), { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return calendarDays(this.month(), this.selected(), dateParts(new Date()), this.isAllowed())
      .map(day => ({
        ...day,
        active: calendarDayKey(day.date) === activeKey,
        ariaLabel: formatter.format(new Date(day.date.year, day.date.month - 1, day.date.day)),
      }));
  });
  protected readonly weeks: Signal<readonly (readonly DisplayDay[])[]> = computed(() =>
    Array.from({ length: 6 }, (_, index) => this.days().slice(index * 7, index * 7 + 7))
  );
  protected readonly weekdayNames: Signal<readonly string[]> = computed(() => {
    if (this.locale().toLowerCase().startsWith("pl")) return ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
    const formatter = new Intl.DateTimeFormat(this.locale(), { weekday: "short" });
    return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(2024, 0, index + 1)));
  });
  protected readonly monthName: Signal<string> = computed(() =>
    new Intl.DateTimeFormat(this.locale(), { month: "long", year: "numeric" })
      .format(new Date(this.month().year, this.month().month - 1, 1))
  );

  public focusActive(): void {
    const key = calendarDayKey(this.active());
    const index = this.days().findIndex(day => calendarDayKey(day.date) === key);
    this.buttons()[index]?.nativeElement.focus();
  }

  protected choose(day: PickerCalendarDay): void {
    if (!day.disabled) this.selectedDay.emit(day.date);
  }

  protected shiftMonth(offset: number): void {
    const next = moveActiveMonth(this.active(), offset, this.isAllowed(), this.min(), this.max());
    this.activeDay.emit(next);
    queueMicrotask(() => this.focusActive());
  }

  protected handleKeydown(event: KeyboardEvent, day: PickerCalendarDay): void {
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: PickerDateParts | null = null;
    if (event.key in offsets) {
      next = moveActiveDay(day.date, offsets[event.key], this.isAllowed(), this.min(), this.max());
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      next = moveActiveMonth(day.date, event.key === "PageUp" ? -1 : 1, this.isAllowed(), this.min(), this.max());
    } else if (event.key === "Home" || event.key === "End") {
      const weekday = (new Date(day.date.year, day.date.month - 1, day.date.day).getDay() + 6) % 7;
      next = moveActiveDay(day.date, event.key === "Home" ? -weekday : 6 - weekday, this.isAllowed(), this.min(), this.max());
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.choose(day);
      return;
    } else {
      return;
    }
    event.preventDefault();
    if (next) {
      this.activeDay.emit(next);
      queueMicrotask(() => this.focusActive());
    }
  }

}
