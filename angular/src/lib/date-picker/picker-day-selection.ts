import { calendarDayKey, dateParts, type PickerDateParts } from "../picker/picker-value";

function shiftedDay(parts: PickerDateParts, amount: number): PickerDateParts {
  const date = new Date(0);
  date.setFullYear(parts.year, parts.month - 1, parts.day);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + amount);
  return dateParts(date);
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
