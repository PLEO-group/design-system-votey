import { Injectable } from "@angular/core";
import { MatDatepickerIntl } from "@angular/material/datepicker";
import { injectVoteyTranslator, type VoteyTranslator } from "../translation/votey-translation";

@Injectable()
export class PickerDatepickerIntl extends MatDatepickerIntl {
  private readonly translator: VoteyTranslator = injectVoteyTranslator();

  public constructor() {
    super();
    this.refresh();
  }

  public refresh(): void {
    this.calendarLabel = this.translator.translate("LABEL.CALENDAR");
    this.prevMonthLabel = this.translator.translate("LABEL.PREVIOUS_MONTH");
    this.nextMonthLabel = this.translator.translate("LABEL.NEXT_MONTH");
    this.prevYearLabel = this.translator.translate("LABEL.PREVIOUS_YEAR");
    this.nextYearLabel = this.translator.translate("LABEL.NEXT_YEAR");
    this.prevMultiYearLabel = this.translator.translate("LABEL.PREVIOUS_24_YEARS");
    this.nextMultiYearLabel = this.translator.translate("LABEL.NEXT_24_YEARS");
    this.switchToMonthViewLabel = this.translator.translate("LABEL.CHOOSE_DATE");
    this.switchToMultiYearViewLabel = this.translator.translate("LABEL.CHOOSE_MONTH_AND_YEAR");
    this.changes.next();
  }

  public override formatYearRangeLabel(start: string, end: string): string {
    return this.translator.translate("LABEL.YEAR_RANGE_LABEL", { start, end });
  }
}
