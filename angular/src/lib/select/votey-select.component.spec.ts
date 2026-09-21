import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { VoteySelectComponent, type VtOption } from "./votey-select.component";

describe("VoteySelectComponent", () => {
  let component: VoteySelectComponent;
  let fixture: ComponentFixture<VoteySelectComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [VoteySelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteySelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("options", [
      { label: "FIRST", value: "first" },
      { label: "SECOND", value: "second" },
    ]);
  });

  it("should expose the selected options from a multi-value control", (): void => {
    const control: FormControl<string[] | null> = new FormControl(["first"]);

    fixture.componentRef.setInput("control", control);
    fixture.componentRef.setInput("bindValue", "value");
    fixture.componentRef.setInput("multiple", true);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("vt-chip").length).toBe(1);
  });

  it("should use configured properties for option labels and values", (): void => {
    const control: FormControl<number | null> = new FormControl(2);

    fixture.componentRef.setInput("control", control);
    fixture.componentRef.setInput("bindLabel", "name");
    fixture.componentRef.setInput("bindValue", "id");
    fixture.componentRef.setInput("options", [
      { id: 1, name: "FIRST" },
      { id: 2, name: "SECOND" },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("SECOND");
  });

  it("should preserve the complete option when bindValue is not configured", (): void => {
    const option: VtOption<string> = { label: "FIRST", value: "first" };
    const control: FormControl<VtOption<string> | null> = new FormControl(option);

    fixture.componentRef.setInput("control", control);
    fixture.componentRef.setInput("options", [option]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("FIRST");
  });

  it("should render the error state for a touched invalid control", (): void => {
    const control: FormControl<string | null> = new FormControl(null, {
      validators: [Validators.required],
    });
    control.markAsTouched();

    fixture.componentRef.setInput("control", control);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(".select-wrapper.error")
    ).not.toBeNull();
  });

  it("should render a selected option flag without translating its label", (): void => {
    const control: FormControl<string | null> = new FormControl("pl");

    fixture.componentRef.setInput("control", control);
    fixture.componentRef.setInput("bindLabel", "label");
    fixture.componentRef.setInput("bindValue", "code");
    fixture.componentRef.setInput("flagSelect", true);
    fixture.componentRef.setInput("optionFlagField", "flagClass");
    fixture.componentRef.setInput("translateOptions", false);
    fixture.componentRef.setInput("options", [
      { code: "pl", flagClass: "fi-pl", label: "Polski" },
    ]);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(".selected-option .fi-pl")
    ).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain("Polski");
  });

  it("should clear the control value when clearable is enabled", (): void => {
    const control: FormControl<string | null> = new FormControl("first");

    fixture.componentRef.setInput("control", control);
    fixture.componentRef.setInput("bindValue", "value");
    fixture.componentRef.setInput("clearable", true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector("button.clear").click();

    expect(control.value).toBeNull();
    expect(control.dirty).toBeTrue();
    expect(control.touched).toBeTrue();
  });

  it("should open when any part of the field is clicked", (): void => {
    const openSpy: jasmine.Spy = spyOn(MatSelect.prototype, "open");

    fixture.detectChanges();
    fixture.nativeElement.querySelector(".field").click();

    expect(openSpy).toHaveBeenCalled();
  });

  it("should not reopen when the overlay backdrop click bubbles to the field", (): void => {
    const openSpy: jasmine.Spy = spyOn(MatSelect.prototype, "open");
    const overlay: HTMLDivElement = document.createElement("div");
    const backdrop: HTMLDivElement = document.createElement("div");

    overlay.classList.add("cdk-overlay-popover");
    overlay.append(backdrop);
    fixture.nativeElement.querySelector(".field").append(overlay);
    fixture.detectChanges();
    backdrop.click();

    expect(openSpy).not.toHaveBeenCalled();
  });

  it("should close when the user clicks outside the select", (): void => {
    const closeSpy: jasmine.Spy = spyOn(MatSelect.prototype, "close");
    const backdrop: HTMLDivElement = document.createElement("div");

    backdrop.classList.add("cdk-overlay-backdrop-showing");
    document.body.append(backdrop);
    fixture.detectChanges();
    component["isOpen"].set(true);
    component["addBackdropListener"]();
    backdrop.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true })
    );
    backdrop.remove();

    expect(closeSpy).toHaveBeenCalled();
  });
});
