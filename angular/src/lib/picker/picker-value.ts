export type PickerValueError = "format" | "date" | "time";

export type PickerParseResult<T> =
  | { readonly value: T; readonly error: null }
  | { readonly value: null; readonly error: PickerValueError };

export interface PickerDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface PickerTimeParts {
  readonly hour: number;
  readonly minute: number;
}

export interface PickerDateTimeParts extends PickerDateParts, PickerTimeParts {}

export type PickerTimeEntryPolicy = "allowManual" | "listOnly";
export type PickerMode = "Date" | "DateTime";
export type PickerConfigError = "invalidMin" | "invalidMax" | "minAfterMax" |
  "invalidStep" | "invalidLocale" | "invalidPolicy";

const INVALID_FORMAT = { value: null, error: "format" } as const;
const INVALID_DATE = { value: null, error: "date" } as const;
const INVALID_TIME = { value: null, error: "time" } as const;

function dateFromParts(parts: PickerDateParts): Date {
  const date = new Date(0);
  date.setFullYear(parts.year, parts.month - 1, parts.day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatCalendarDate(parts: PickerDateParts): string {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function formatTime(parts: PickerTimeParts): string {
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

export function calendarDayKey(parts: PickerDateParts): number {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
}

export function parseCalendarDate(value: string): PickerParseResult<PickerDateParts> {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return INVALID_FORMAT;
  return validatedDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

export function parseDateInput(value: string): PickerParseResult<PickerDateParts> {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return INVALID_FORMAT;
  return validatedDate(Number(match[3]), Number(match[2]), Number(match[1]));
}

function validatedDate(year: number, month: number, day: number): PickerParseResult<PickerDateParts> {
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return INVALID_DATE;
  const date = new Date(calendarDayKey({ year, month, day }));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    return INVALID_DATE;
  }
  return { value: { year, month, day }, error: null };
}

export function parseTimeInput(value: string): PickerParseResult<PickerTimeParts> {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return INVALID_FORMAT;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return INVALID_TIME;
  return { value: { hour, minute }, error: null };
}

export function parseDateTimeInput(value: string): PickerParseResult<PickerDateTimeParts> {
  const match = /^(\d{2}\.\d{2}\.\d{4}), (\d{2}:\d{2})$/.exec(value);
  if (!match) return INVALID_FORMAT;
  const date = parseDateInput(match[1]);
  if (date.error) return { value: null, error: date.error };
  const time = parseTimeInput(match[2]);
  if (time.error) return { value: null, error: time.error };
  const parts = { ...date.value, ...time.value };
  return localInstant(parts) === null ? INVALID_TIME : { value: parts, error: null };
}

/** Returns the first occurrence of an ambiguous local minute; rejects a DST gap. */
export function localInstant(parts: PickerDateTimeParts): Date | null {
  const instant = dateFromParts(parts);
  instant.setHours(parts.hour, parts.minute, 0, 0);
  return instant.getFullYear() === parts.year &&
    instant.getMonth() + 1 === parts.month &&
    instant.getDate() === parts.day &&
    instant.getHours() === parts.hour &&
    instant.getMinutes() === parts.minute ? instant : null;
}

export function canonicalInstant(parts: PickerDateTimeParts): string | null {
  return localInstant(parts)?.toISOString() ?? null;
}

export function timeSuggestions(stepMinutes: number): readonly string[] {
  if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > 60) return [];
  return Array.from({ length: Math.ceil(1440 / stepMinutes) }, (_, index) => {
    const minuteOfDay = index * stepMinutes;
    return formatTime({ hour: Math.floor(minuteOfDay / 60), minute: minuteOfDay % 60 });
  });
}

export function parseInstant(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match || parseCalendarDate(`${match[1]}-${match[2]}-${match[3]}`).error) return null;
  if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6]) > 59) return null;
  if (match[8] !== "Z") {
    const offset = match[8].slice(1).split(":").map(Number);
    if (offset[0] > 23 || offset[1] > 59) return null;
  }
  const time = new Date(value);
  return Number.isNaN(time.getTime()) ? null : time;
}

export function dateParts(value: Date): PickerDateParts {
  return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
}

export function timeParts(value: Date): PickerTimeParts {
  return { hour: value.getHours(), minute: value.getMinutes() };
}

export function isWithinDateRange(
  date: PickerDateParts,
  min: PickerDateParts | null,
  max: PickerDateParts | null
): boolean {
  const key = calendarDayKey(date);
  return (min === null || key >= calendarDayKey(min)) &&
    (max === null || key <= calendarDayKey(max));
}

export function isWithinInstantRange(
  instant: Date,
  min: Date | null,
  max: Date | null
): boolean {
  const value = instant.getTime();
  return (min === null || value >= min.getTime()) &&
    (max === null || value <= max.getTime());
}

export function firstAllowedTime(
  day: PickerDateParts,
  min: Date | null,
  max: Date | null,
  stepMinutes: number,
  policy: PickerTimeEntryPolicy,
  previousTime: PickerTimeParts | null = null
): PickerTimeParts | null {
  if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > 60) return null;

  if (previousTime) {
    const existing = localInstant({ ...day, ...previousTime });
    const minuteOfDay = previousTime.hour * 60 + previousTime.minute;
    if (existing && isWithinInstantRange(existing, min, max) &&
      (policy === "allowManual" || minuteOfDay % stepMinutes === 0)) return previousTime;
  }

  for (let minuteOfDay = 0; minuteOfDay < 1440; minuteOfDay += 1) {
    if (policy === "listOnly" && minuteOfDay % stepMinutes !== 0) continue;
    const time = { hour: Math.floor(minuteOfDay / 60), minute: minuteOfDay % 60 };
    const instant = localInstant({ ...day, ...time });
    if (instant && isWithinInstantRange(instant, min, max)) return time;
  }

  return null;
}

export function validateTimeConfig(
  stepMinutes: number,
  policy: PickerTimeEntryPolicy
): PickerConfigError | null {
  if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > 60) {
    return "invalidStep";
  }
  if (policy !== "allowManual" && policy !== "listOnly") return "invalidPolicy";
  return null;
}

export function validateDateConfig(
  mode: PickerMode,
  min: string | null,
  max: string | null,
  locale: string,
  stepMinutes: number,
  policy: PickerTimeEntryPolicy
): PickerConfigError | null {
  const low = min === null ? null : mode === "Date" ? parseCalendarDate(min).value : parseInstant(min);
  const high = max === null ? null : mode === "Date" ? parseCalendarDate(max).value : parseInstant(max);
  if (min !== null && low === null) return "invalidMin";
  if (max !== null && high === null) return "invalidMax";
  if (low !== null && high !== null) {
    const lowKey = low instanceof Date ? low.getTime() : calendarDayKey(low);
    const highKey = high instanceof Date ? high.getTime() : calendarDayKey(high);
    if (lowKey > highKey) return "minAfterMax";
  }
  if (mode === "DateTime") {
    const timeError = validateTimeConfig(stepMinutes, policy);
    if (timeError) return timeError;
  }
  try {
    if (!locale.trim()) return "invalidLocale";
    new Intl.DateTimeFormat(locale);
  } catch {
    return "invalidLocale";
  }
  return null;
}
