import { TestBed } from "@angular/core/testing";
import { DesignSystemThemeService } from "./theme.service.example";

describe("DesignSystemThemeService", () => {
  let service: DesignSystemThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignSystemThemeService);
    sessionStorage.clear();
    document.body.setAttribute("data-theme", "light");
    Reflect.deleteProperty(document, "startViewTransition");
  });

  afterEach(() => {
    sessionStorage.clear();
    document.body.removeAttribute("data-theme");
    Reflect.deleteProperty(document, "startViewTransition");
  });

  it("persists and applies the selected theme for the current session", () => {
    service.setTheme(true);
    expect(sessionStorage.getItem("theme")).toBe("dark");
    expect(document.body.getAttribute("data-theme")).toBe("dark");

    service.setTheme(false);
    expect(sessionStorage.getItem("theme")).toBe("light");
    expect(document.body.getAttribute("data-theme")).toBe("light");
  });

  it("uses View Transitions when supported", () => {
    const startViewTransition = jest.fn((apply: () => void) => apply());
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    service.setTheme(true);

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.body.getAttribute("data-theme")).toBe("dark");
  });

  it("loads a saved theme and reports whether it is dark", () => {
    sessionStorage.setItem("theme", "dark");
    expect(service.loadTheme()).toBe(true);
    expect(document.body.getAttribute("data-theme")).toBe("dark");

    sessionStorage.setItem("theme", "light");
    expect(service.loadTheme()).toBe(false);
    expect(document.body.getAttribute("data-theme")).toBe("light");
  });

  it("preserves the initial light host when the session has no preference", () => {
    expect(service.loadTheme()).toBe(false);
    expect(document.body.getAttribute("data-theme")).toBe("light");
  });
});
