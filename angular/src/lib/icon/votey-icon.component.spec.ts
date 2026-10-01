import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { of } from "rxjs";
import { VoteyIconComponent } from "./votey-icon.component";

describe("VoteyIconComponent", () => {
  let fixture: ComponentFixture<VoteyIconComponent>;

  beforeEach(async (): Promise<void> => {
    const iconRegistry: jasmine.SpyObj<MatIconRegistry> =
      jasmine.createSpyObj<MatIconRegistry>("MatIconRegistry", [
        "getNamedSvgIcon",
      ]);
    iconRegistry.getNamedSvgIcon.and.callFake(() => {
      const svg: SVGSVGElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      const path: SVGPathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("fill", "#06064D");
      path.setAttribute("stroke", "#06064D");
      svg.appendChild(path);
      return of(svg);
    });

    await TestBed.configureTestingModule({
      imports: [VoteyIconComponent],
      providers: [{ provide: MatIconRegistry, useValue: iconRegistry }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteyIconComponent);
    fixture.nativeElement.style.setProperty(
      "--color-accent-primary",
      "#00aa77"
    );
    fixture.nativeElement.style.setProperty("--color-white", "#ffffff");
    fixture.nativeElement.style.setProperty("--color-text-muted", "#777777");
    fixture.componentRef.setInput("ico", "ui-turn-on-thick");
  });

  it("recolors registered SVG fills and strokes only for an explicit color", (): void => {
    fixture.detectChanges();
    const path: SVGPathElement = fixture.nativeElement.querySelector("path");
    expect(getComputedStyle(path).fill).toBe("rgb(6, 6, 77)");

    fixture.componentRef.setInput("color", "accent");
    fixture.detectChanges();
    expect(getComputedStyle(path).fill).toBe("rgb(0, 170, 119)");
    expect(getComputedStyle(path).stroke).toBe("rgb(0, 170, 119)");

    fixture.componentRef.setInput("color", "white");
    fixture.detectChanges();
    expect(getComputedStyle(path).fill).toBe("rgb(255, 255, 255)");
    expect(getComputedStyle(path).stroke).toBe("rgb(255, 255, 255)");

    fixture.componentRef.setInput("color", "muted");
    fixture.detectChanges();
    expect(getComputedStyle(path).fill).toBe("rgb(119, 119, 119)");
    expect(getComputedStyle(path).stroke).toBe("rgb(119, 119, 119)");
  });
});
