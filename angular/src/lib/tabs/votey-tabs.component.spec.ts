import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VOTEY_TRANSLATOR } from "../translation/votey-translation";
import { VoteyTabsComponent } from "./votey-tabs.component";

describe("VoteyTabsComponent", () => {
  let fixture: ComponentFixture<VoteyTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteyTabsComponent],
      providers: [{ provide: VOTEY_TRANSLATOR, useValue: { translate: (key: string): string => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteyTabsComponent);
    fixture.componentRef.setInput("items", [
      { id: "first", label: "First", count: 0 },
      { id: "second", label: "Second", count: 3 },
      { id: "third", label: "Third", disabled: true },
    ]);
    fixture.componentRef.setInput("selectedId", "first");
    fixture.componentRef.setInput("ariaLabel", "Sections");
    fixture.componentRef.setInput("panelId", "content");
    fixture.detectChanges();
  });

  it("emits a selected id without changing the selected input", () => {
    const emitted: string[] = [];
    fixture.componentInstance.selectionChange.subscribe(id => emitted.push(id));
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll("button");

    buttons[1].click();
    buttons[2].click();

    expect(emitted).toEqual(["second"]);
    expect(buttons[0].getAttribute("aria-selected")).toBe("true");
    expect(buttons[0].getAttribute("aria-controls")).toBe("content");
    expect(buttons[0].textContent).toContain("0");
  });

  it("supports arrow navigation and skips disabled tabs", () => {
    const emitted: string[] = [];
    fixture.componentInstance.selectionChange.subscribe(id => emitted.push(id));
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll("button");

    buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

    expect(emitted).toEqual(["second"]);
    expect(document.activeElement).toBe(buttons[1]);
  });

  it("moves the shared underline to the newly selected tab", () => {
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll("button");
    fixture.componentRef.setInput("selectedId", "second");
    fixture.detectChanges();

    const indicator: HTMLSpanElement = fixture.nativeElement.querySelector(".indicator");
    expect(indicator.style.transform).toBe(`translateX(${buttons[1].offsetLeft}px)`);
    expect(indicator.style.width).toBe(`${buttons[1].offsetWidth}px`);
  });
});
