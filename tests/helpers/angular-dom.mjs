import { JSDOM } from "jsdom";

// Install DOM before loading Angular; each Node test file runs in its own process.
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
  url: "http://localhost/", pretendToBeVisual: true,
});
for (const name of ["window", "document", "Node", "Element", "HTMLElement", "HTMLInputElement",
  "Event", "MouseEvent", "KeyboardEvent", "Document", "DocumentFragment", "ShadowRoot", "MutationObserver"] ) {
  globalThis[name] = name === "window" ? dom.window : dom.window[name];
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
dom.window.matchMedia = query => ({ matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });

await import("@angular/compiler");
const { TestBed } = await import("@angular/core/testing");
const { BrowserTestingModule, platformBrowserTesting } = await import("@angular/platform-browser/testing");
const { MatIconRegistry } = await import("@angular/material/icon");
const { DomSanitizer } = await import("@angular/platform-browser");
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

export { TestBed };
export const ng = await import("@angular/core");
export const ds = await import("@pleodigital/design-system-votey/angular");
export const forms = await import("@angular/forms");
export const by = (fixture, selector) => fixture.nativeElement.querySelector(selector);
export const all = (fixture, selector) => [...fixture.nativeElement.querySelectorAll(selector)];
export async function settle(fixture) {
  const registry = TestBed.inject(MatIconRegistry);
  const sanitizer = TestBed.inject(DomSanitizer);
  // Decorative asset loading is outside these component tests; keep real MatIcon.
  for (const name of ["ui-search", "ui-close", "ui-edit", "ui-chevron-left", "ui-chevron-right", "ui-chevron-down"]) {
    registry.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 0h20v20H0z"/></svg>'));
  }
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}
export function inputValue(input, value) {
  input.value = value;
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
}
export function dispose() {
  TestBed.resetTestingModule();
  dom.window.close();
}
