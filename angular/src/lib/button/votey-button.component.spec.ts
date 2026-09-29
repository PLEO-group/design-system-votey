import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { of } from "rxjs";
import { VoteyButtonComponent } from "./votey-button.component";

describe("VoteyButtonComponent", () => {
  let fixture: ComponentFixture<VoteyButtonComponent>;
  let component: VoteyButtonComponent;

  beforeEach(async (): Promise<void> => {
    const iconRegistry: jasmine.SpyObj<MatIconRegistry> =
      jasmine.createSpyObj<MatIconRegistry>("MatIconRegistry", [
        "getNamedSvgIcon",
      ]);
    iconRegistry.getNamedSvgIcon.and.returnValue(
      of(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
    );

    await TestBed.configureTestingModule({
      imports: [VoteyButtonComponent],
      providers: [{ provide: MatIconRegistry, useValue: iconRegistry }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteyButtonComponent);
    component = fixture.componentInstance;
  });

  it("uses an explicit readable name for an icon-only button", (): void => {
    fixture.componentRef.setInput("ico", "ui-plus");
    fixture.componentRef.setInput("ariaLabel", "Dodaj uczestnika");
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector("button");

    expect(button.getAttribute("aria-label")).toBe("Dodaj uczestnika");
    expect(button.querySelector("vt-icon")).not.toBeNull();
  });

  it("prefers visible text for the accessible name and leaves an empty button unnamed", (): void => {
    fixture.componentRef.setInput("text", "Zapisz");
    fixture.componentRef.setInput("ariaLabel", "Inna nazwa");
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector("button");
    expect(button.getAttribute("aria-label")).toBe("Zapisz");

    fixture.componentRef.setInput("text", "");
    fixture.componentRef.setInput("ariaLabel", "");
    fixture.detectChanges();
    expect(button.getAttribute("aria-label")).toBeNull();
  });

  it("emits pressed for an enabled button and prevents it when disabled", (): void => {
    const pressedSpy: jasmine.Spy = jasmine.createSpy("pressed");
    const subscription = component.pressed.subscribe(pressedSpy);
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector("button");
    button.click();
    expect(pressedSpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    button.click();
    expect(pressedSpy).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });
});
