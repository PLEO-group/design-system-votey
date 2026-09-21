import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, Validators } from "@angular/forms";
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
});
