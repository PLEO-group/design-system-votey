import {
  calendarDayKey,
  dateParts,
  formatCalendarDate,
  type PickerDateParts,
} from "./picker-value";

export interface PickerCalendarDay {
  readonly date: PickerDateParts;
  readonly iso: string;
  readonly day: number;
  readonly otherMonth: boolean;
  readonly today: boolean;
  readonly selected: boolean;
  readonly disabled: boolean;
}

function localDay(parts: PickerDateParts): Date {
  const date = new Date(0);
  date.setFullYear(parts.year, parts.month - 1, parts.day);
  date.setHours(12, 0, 0, 0);
  return date;
}

function shiftedDay(parts: PickerDateParts, amount: number): PickerDateParts {
  const date = localDay(parts);
  date.setDate(date.getDate() + amount);
  return dateParts(date);
}

export function calendarDays(
  month: PickerDateParts,
  selected: PickerDateParts | null,
  today: PickerDateParts,
  isAllowed: (day: PickerDateParts) => boolean
): readonly PickerCalendarDay[] {
  const first = localDay({ ...month, day: 1 });
  const offset = (first.getDay() + 6) % 7;
  const start = dateParts(first);
  const selectedKey = selected === null ? null : calendarDayKey(selected);
  const todayKey = calendarDayKey(today);

  return Array.from({ length: 42 }, (_, index): PickerCalendarDay => {
    const date = shiftedDay(start, index - offset);
    const key = calendarDayKey(date);
    return {
      date,
      iso: formatCalendarDate(date),
      day: date.day,
      otherMonth: date.month !== month.month || date.year !== month.year,
      today: key === todayKey,
      selected: key === selectedKey,
      disabled: !isAllowed(date),
    };
  });
}

export function nearestAllowedDay(
  origin: PickerDateParts,
  isAllowed: (day: PickerDateParts) => boolean,
  min: PickerDateParts | null,
  max: PickerDateParts | null
): PickerDateParts | null {
  if (isAllowed(origin)) return origin;
  for (let distance = 1; distance <= 36600; distance += 1) {
    const earlier = shiftedDay(origin, -distance);
    const later = shiftedDay(origin, distance);
    const earlierPossible = min === null || calendarDayKey(earlier) >= calendarDayKey(min);
    const laterPossible = max === null || calendarDayKey(later) <= calendarDayKey(max);
    if (earlierPossible && isAllowed(earlier)) return earlier;
    if (laterPossible && isAllowed(later)) return later;
    if (!earlierPossible && !laterPossible) break;
  }
  return null;
}

export function moveActiveDay(
  active: PickerDateParts,
  offset: number,
  isAllowed: (day: PickerDateParts) => boolean,
  min: PickerDateParts | null,
  max: PickerDateParts | null
): PickerDateParts {
  const direction = Math.sign(offset);
  if (direction === 0) return active;
  let candidate = shiftedDay(active, offset);
  for (let attempts = 0; attempts < 36600; attempts += 1) {
    if (min !== null && calendarDayKey(candidate) < calendarDayKey(min)) break;
    if (max !== null && calendarDayKey(candidate) > calendarDayKey(max)) break;
    if (isAllowed(candidate)) return candidate;
    candidate = shiftedDay(candidate, direction);
  }
  return active;
}

export function moveActiveMonth(
  active: PickerDateParts,
  offset: number,
  isAllowed: (day: PickerDateParts) => boolean,
  min: PickerDateParts | null,
  max: PickerDateParts | null
): PickerDateParts {
  if (offset === 0) return active;
  const target = localDay({ ...active, day: 1 });
  target.setMonth(target.getMonth() + offset);
  const direction = Math.sign(offset);

  for (let attempts = 0; attempts < 1200; attempts += 1) {
    const year = target.getFullYear();
    const month = target.getMonth() + 1;
    const last = new Date(year, month, 0).getDate();
    const anchor = Math.min(active.day, last);
    for (let distance = 0; distance < last; distance += 1) {
      const earlier = anchor - distance;
      const later = anchor + distance;
      if (earlier >= 1 && isAllowed({ year, month, day: earlier })) {
        return { year, month, day: earlier };
      }
      if (distance !== 0 && later <= last && isAllowed({ year, month, day: later })) {
        return { year, month, day: later };
      }
    }
    const firstKey = calendarDayKey({ year, month, day: 1 });
    if (direction < 0 && min && firstKey < calendarDayKey({ ...min, day: 1 })) break;
    if (direction > 0 && max && firstKey > calendarDayKey({ ...max, day: 1 })) break;
    target.setMonth(target.getMonth() + direction);
  }
  return active;
}
