import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, Validators } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { of } from "rxjs";
import { VoteyInputComponent } from "./votey-input.component";

describe("VoteyInputComponent", () => {
  let component: VoteyInputComponent;
  let fixture: ComponentFixture<VoteyInputComponent>;
  let control: FormControl<string | null>;

  beforeEach(async (): Promise<void> => {
    const iconRegistry: jasmine.SpyObj<MatIconRegistry> =
      jasmine.createSpyObj<MatIconRegistry>("MatIconRegistry", [
        "getNamedSvgIcon",
      ]);
    iconRegistry.getNamedSvgIcon.and.returnValue(
      of(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
    );

    await TestBed.configureTestingModule({
      imports: [VoteyInputComponent],
      providers: [{ provide: MatIconRegistry, useValue: iconRegistry }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteyInputComponent);
    component = fixture.componentInstance;
    control = new FormControl<string | null>("");
    fixture.componentRef.setInput("label", "Email address");
    fixture.componentRef.setInput("control", control);
  });

  it("should connect its generated id to the label and helper", (): void => {
    fixture.componentRef.setInput("helper", "Use your work email");
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector("input");
    const labelElement: HTMLLabelElement =
      fixture.nativeElement.querySelector("label");
    const helperElement: HTMLElement =
      fixture.nativeElement.querySelector(".helper");

    expect(inputElement.id).toMatch(/^vt-input-\d+$/);
    expect(labelElement.htmlFor).toBe(inputElement.id);
    expect(helperElement.id).toBe(`${inputElement.id}-helper`);
    expect(inputElement.getAttribute("aria-describedby")).toContain(
      helperElement.id
    );
  });

  it("should keep the label active while disabling the field and icon", (): void => {
    control.disable();
    fixture.componentRef.setInput("icon", "ui-search");
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(".input-wrapper.disabled")
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector("label .text.primary")
    ).not.toBeNull();
    expect(fixture.nativeElement.querySelector("vt-icon.icon")).not.toBeNull();
  });

  it("should associate a visible validation error with the input", (): void => {
    control.setValidators(Validators.required);
    control.markAsTouched();
    control.updateValueAndValidity();
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector("input");
    const errorElement: HTMLElement =
      fixture.nativeElement.querySelector("vt-form-error");

    expect(inputElement.getAttribute("aria-invalid")).toBe("true");
    expect(errorElement.id).toBe(`${inputElement.id}-error`);
    expect(inputElement.getAttribute("aria-errormessage")).toBe(
      errorElement.id
    );
    expect(
      fixture.nativeElement.querySelector("vt-form-error .text.error")
    ).not.toBeNull();
  });

  it("should emit keydown and apply the trimmer on blur", (): void => {
    const keyEvents: KeyboardEvent[] = [];
    const subscription = component.keyDown.subscribe((event: KeyboardEvent) =>
      keyEvents.push(event)
    );
    fixture.componentRef.setInput("trimmer", (value: string): string =>
      value.replace(/\s/g, "")
    );
    control.setValue("502 724 170");
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector("input");
    inputElement.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: "Enter" })
    );
    inputElement.dispatchEvent(new FocusEvent("blur", { bubbles: true }));

    expect(keyEvents.map((event: KeyboardEvent) => event.key)).toEqual([
      "Enter",
    ]);
    expect(control.value).toBe("502724170");

    subscription.unsubscribe();
  });
});
