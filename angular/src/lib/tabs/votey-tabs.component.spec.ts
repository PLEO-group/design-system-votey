import { Component } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  tick,
  TestBed,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { MatTabGroup } from "@angular/material/tabs";
import { VOTEY_TRANSLATOR } from "../translation/votey-translation";
import { VoteyTabsComponent, type VoteyTabItem } from "./votey-tabs.component";
import { VoteyTabContentDirective } from "./votey-tab-content.directive";

@Component({
  imports: [VoteyTabsComponent, VoteyTabContentDirective],
  template: `<vt-tabs
    [items]="items"
    [selectedId]="selected"
    ariaLabel="Sections"
    (selectionChange)="select($event)"
  >
    <ng-template vtTabContent let-tab
      ><p class="shared-panel">{{ tab.id }}</p></ng-template
    >
    <ng-template vtTabContent="second"
      ><p class="specific-panel">Second panel</p></ng-template
    >
  </vt-tabs>`,
})
class TabsHost {
  public items: readonly VoteyTabItem[] = [
    { id: "first", label: "First", count: 0 },
    { id: "second", label: "Second", count: 3 },
    { id: "third", label: "Third", disabled: true },
  ];
  public selected: string = "first";
  public emitted: string[] = [];
  public select(id: string): void {
    this.selected = id;
    this.emitted.push(id);
  }
}

describe("VoteyTabsComponent Material group", () => {
  let fixture: ComponentFixture<TabsHost>;
  afterEach(() => fixture.destroy());
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsHost],
      providers: [
        {
          provide: VOTEY_TRANSLATOR,
          useValue: { translate: (key: string): string => key },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TabsHost);
    fixture.detectChanges();
  });

  it("renders lazy shared content and preserves zero counts", () => {
    expect(
      fixture.nativeElement.querySelector(".shared-panel").textContent,
    ).toContain("first");
    expect(fixture.nativeElement.querySelector(".specific-panel")).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[role="tab"]').textContent,
    ).toContain("0");
    expect(fixture.componentInstance.emitted).toEqual([]);
  });

  it("selects enabled tabs and uses their specific content", fakeAsync(() => {
    const labels: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('[role="tab"]');
    labels[1].click();
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toBe("second");
    expect(fixture.componentInstance.emitted).toEqual(["second"]);
    expect(
      fixture.nativeElement.querySelector(".specific-panel").textContent,
    ).toContain("Second panel");
    labels[2].click();
    fixture.detectChanges();
    tick(0);
    expect(fixture.componentInstance.emitted).toEqual(["second"]);
  }));

  it("derives the selected Material index from the current item order", fakeAsync(() => {
    fixture.componentInstance.items = [
      ...fixture.componentInstance.items,
    ].reverse();
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
    const group: MatTabGroup = fixture.debugElement.query(
      By.directive(MatTabGroup),
    ).componentInstance;
    expect(group.selectedIndex).toBe(2);
    expect(fixture.componentInstance.emitted).toEqual([]);
  }));
});
