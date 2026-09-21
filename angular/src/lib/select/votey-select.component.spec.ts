import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { VoteySelectComponent } from "./votey-select.component";

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
});
