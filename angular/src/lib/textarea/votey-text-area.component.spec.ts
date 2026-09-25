import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, Validators } from "@angular/forms";
import { VOTEY_TRANSLATOR } from "../translation/votey-translation";
import { VoteyTextAreaComponent } from "./votey-text-area.component";

describe("VoteyTextAreaComponent", () => {
  let fixture: ComponentFixture<VoteyTextAreaComponent>;
  let control: FormControl<string | null>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [VoteyTextAreaComponent],
      providers: [
        {
          provide: VOTEY_TRANSLATOR,
          useValue: {
            translate: (
              key: string,
              params?: Record<string, string | number>
            ): string =>
              key === "CHARACTER_LIMIT_DESCRIPTION"
                ? `Maximum ${params?.max} characters`
                : key,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteyTextAreaComponent);
    control = new FormControl<string | null>("");
    fixture.componentRef.setInput("control", control);
    fixture.componentRef.setInput("label", "Description");
  });

  it("associates the label and helper with the textarea", (): void => {
    fixture.componentRef.setInput("helper", "Describe the event");
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector("textarea");
    const label: HTMLLabelElement = fixture.nativeElement.querySelector("label");
    const helper: HTMLElement =
      fixture.nativeElement.querySelector(".helper");

    expect(textarea.id).toMatch(/^vt-text-area-\d+$/);
    expect(label.htmlFor).toBe(textarea.id);
    expect(helper.id).toBe(`${textarea.id}-helper`);
    expect(textarea.getAttribute("aria-describedby")).toBe(helper.id);
  });

  it("shows a static limit description while the value changes", (): void => {
    fixture.componentRef.setInput("maxLength", 2000);
    fixture.detectChanges();

    const helper: HTMLElement =
      fixture.nativeElement.querySelector(".helper");
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector("textarea");

    expect(helper.textContent).toContain("Maximum 2000 characters");
    expect(textarea.getAttribute("aria-describedby")).toBe(helper.id);

    control.setValue("A longer description");
    fixture.detectChanges();

    expect(helper.textContent).toContain("Maximum 2000 characters");
  });

  it("connects a visible validation error to the textarea", (): void => {
    control.setValidators(Validators.required);
    control.markAsTouched();
    control.updateValueAndValidity();
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector("textarea");
    const error: HTMLElement =
      fixture.nativeElement.querySelector("vt-form-error");

    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(error.id).toBe(`${textarea.id}-error`);
    expect(textarea.getAttribute("aria-errormessage")).toBe(error.id);
  });

  it("suppresses error state when disabled", (): void => {
    control.setValidators(Validators.required);
    control.markAsTouched();
    control.updateValueAndValidity();
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector("textarea");

    expect(textarea.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector("label .text.primary")).not.toBeNull();
    expect(textarea.getAttribute("aria-invalid")).toBeNull();
    expect(textarea.getAttribute("aria-errormessage")).toBeNull();
    expect(fixture.nativeElement.querySelector(".text-area-wrapper.error")).toBeNull();
  });

  it("uses an accessible name when the visible label is empty", (): void => {
    fixture.componentRef.setInput("label", "");
    fixture.componentRef.setInput("ariaLabel", "Event description");
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector("textarea");

    expect(fixture.nativeElement.querySelector("label")).toBeNull();
    expect(textarea.getAttribute("aria-label")).toBe("Event description");
  });
});
