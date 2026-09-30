import assert from "node:assert/strict";
import { before, test } from "node:test";

before(() => {
  process.env.TZ = "Europe/Warsaw";
});

const {
  canonicalInstant,
  firstAllowedTime,
  formatCalendarDate,
  parseCalendarDate,
  parseDateInput,
  parseDateTimeInput,
  parseInstant,
  parseTimeInput,
  timeSuggestions,
  validateDateConfig,
  validateTimeConfig,
} = await import("../angular/src/lib/picker/picker-value.ts");

test("date input is strict and keeps calendar dates independent of time zones", () => {
  assert.deepEqual(parseDateInput("12.09.2026"), {
    value: { year: 2026, month: 9, day: 12 }, error: null,
  });
  assert.equal(formatCalendarDate(parseDateInput("12.09.2026").value), "2026-09-12");
  assert.equal(parseDateInput("31.02.2026").error, "date");
  assert.equal(parseDateInput("12/09/2026").error, "format");
  assert.equal(parseCalendarDate("2024-02-29").error, null);
  assert.equal(parseCalendarDate("2026-02-29").error, "date");
});

test("time input and suggestion step stay exact", () => {
  assert.deepEqual(parseTimeInput("10:17"), {
    value: { hour: 10, minute: 17 }, error: null,
  });
  assert.equal(parseTimeInput("24:00").error, "time");
  assert.equal(parseTimeInput("9:30").error, "format");
  assert.equal(timeSuggestions(30).length, 48);
  assert.equal(timeSuggestions(15).length, 96);
  assert.equal(timeSuggestions(60).at(-1), "23:00");
  assert.deepEqual(timeSuggestions(0), []);
});

test("DST gap is rejected and a repeated local time chooses its first occurrence", () => {
  assert.equal(parseDateTimeInput("29.03.2026, 02:30").error, "time");
  assert.equal(canonicalInstant({ year: 2026, month: 10, day: 25, hour: 2, minute: 30 }),
    "2026-10-25T00:30:00.000Z");
  assert.equal(parseInstant("2026-10-25T02:30:00+02:00")?.toISOString(),
    "2026-10-25T00:30:00.000Z");
});

test("listOnly only selects on-grid minutes when changing day", () => {
  const day = { year: 2026, month: 9, day: 12 };
  assert.deepEqual(firstAllowedTime(day, null, null, 30, "listOnly", { hour: 10, minute: 17 }),
    { hour: 0, minute: 0 });
  assert.deepEqual(firstAllowedTime(day, null, null, 30, "listOnly"),
    { hour: 0, minute: 0 });
  assert.deepEqual(firstAllowedTime(day, null, null, 30, "allowManual"),
    { hour: 0, minute: 0 });
});

test("configuration rejects malformed limits and unsupported step or locale", () => {
  assert.equal(validateDateConfig("Date", "2026-09-13", "2026-09-12", "pl-PL", 30, "allowManual"),
    "minAfterMax");
  assert.equal(validateDateConfig("DateTime", "2026-09-12", null, "pl-PL", 30, "allowManual"),
    "invalidMin");
  assert.equal(validateDateConfig("Date", null, null, "not_a_locale", 30, "allowManual"),
    "invalidLocale");
  assert.equal(validateTimeConfig(61, "allowManual"), "invalidStep");
  assert.equal(validateTimeConfig(30, "unsupported"), "invalidPolicy");
});
