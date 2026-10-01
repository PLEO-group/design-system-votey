import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { VoteySelectComponent } from "../select/votey-select.component";
import { VOTEY_TRANSLATOR } from "../translation/votey-translation";
import {
  VoteyPaginationComponent,
  type VoteyPaginationEvent,
} from "./votey-pagination.component";

describe("VoteyPaginationComponent", () => {
  let fixture: ComponentFixture<VoteyPaginationComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [VoteyPaginationComponent],
      providers: [
        {
          provide: VOTEY_TRANSLATOR,
          useValue: { translate: (key: string): string => `translated:${key}` },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(VoteyPaginationComponent);
  });

  it("emits a zero-based page and resets to page zero when size changes", (): void => {
    const events: VoteyPaginationEvent[] = [];
    fixture.componentRef.setInput("totalElements", 100);
    fixture.componentRef.setInput("page", 2);
    fixture.detectChanges();
    fixture.componentInstance.pagination.subscribe(
      (event: VoteyPaginationEvent) => events.push(event)
    );

    expect(
      (fixture.nativeElement.querySelector(".range") as HTMLElement).textContent
    ).toContain("41–60 / 100");

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll("button");
    buttons[buttons.length - 1].click();
    const select: VoteySelectComponent = fixture.debugElement.query(
      By.directive(VoteySelectComponent)
    ).componentInstance;
    select.change.emit(50);

    expect(events).toEqual([
      { page: 3, size: 20 },
      { page: 0, size: 50 },
    ]);
  });

  it("shows the page size used to calculate the range", (): void => {
    fixture.componentRef.setInput("totalElements", 15);
    fixture.detectChanges();

    const select: VoteySelectComponent = fixture.debugElement.query(
      By.directive(VoteySelectComponent)
    ).componentInstance;
    expect(select.formControl.value).toBe(20);
    expect(
      (fixture.nativeElement.querySelector(".range") as HTMLElement).textContent
    ).toContain("1–15 / 15");

    fixture.componentRef.setInput("size", 10);
    fixture.detectChanges();

    expect(select.formControl.value).toBe(10);
    expect(
      (fixture.nativeElement.querySelector(".range") as HTMLElement).textContent
    ).toContain("1–10 / 15");
    expect(
      fixture.nativeElement.querySelectorAll(".page-button.selected").length
    ).toBe(1);
  });

  it("blocks navigation during loading", (): void => {
    const events: VoteyPaginationEvent[] = [];
    fixture.componentRef.setInput("totalElements", 100);
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();
    fixture.componentInstance.pagination.subscribe(
      (event: VoteyPaginationEvent) => events.push(event)
    );

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll("button");
    buttons[buttons.length - 1].click();

    expect(events).toEqual([]);
    expect(buttons[buttons.length - 1].disabled).toBeTrue();
  });

  it("translates fixed pagination labels without label inputs", (): void => {
    fixture.componentRef.setInput("totalElements", 40);
    fixture.detectChanges();

    const navigation: HTMLElement = fixture.nativeElement.querySelector("nav");
    const previousButton: HTMLButtonElement =
      fixture.nativeElement.querySelector("button");
    const pageSizeLabel: HTMLLabelElement =
      fixture.nativeElement.querySelector("label");

    expect(navigation.getAttribute("aria-label")).toBe(
      "translated:LABEL.PAGINATION"
    );
    expect(previousButton.getAttribute("aria-label")).toBe(
      "translated:LABEL.PREVIOUS_PAGE"
    );
    expect(pageSizeLabel.textContent).toContain(
      "translated:LABEL.ITEMS_PER_PAGE"
    );
  });
});
