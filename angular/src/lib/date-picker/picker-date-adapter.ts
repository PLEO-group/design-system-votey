import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";
import { injectVoteyTranslator, type VoteyTranslator } from "../translation/votey-translation";

const NARROW_WEEKDAY_KEYS: readonly string[] = [
  "LABEL.WEEKDAY_SUNDAY_SHORT",
  "LABEL.WEEKDAY_MONDAY_SHORT",
  "LABEL.WEEKDAY_TUESDAY_SHORT",
  "LABEL.WEEKDAY_WEDNESDAY_SHORT",
  "LABEL.WEEKDAY_THURSDAY_SHORT",
  "LABEL.WEEKDAY_FRIDAY_SHORT",
  "LABEL.WEEKDAY_SATURDAY_SHORT",
];

@Injectable()
export class PickerDateAdapter extends NativeDateAdapter {
  private readonly translator: VoteyTranslator = injectVoteyTranslator();

  public override getFirstDayOfWeek(): number {
    return 1;
  }

  public override getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    if (style === "narrow") return NARROW_WEEKDAY_KEYS.map(key => this.translator.translate(key));
    return super.getDayOfWeekNames(style);
  }
}
