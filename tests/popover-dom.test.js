const assert = require("node:assert/strict");
const { test, before, after, afterEach } = require("node:test");
let env;

before(async () => {
  env = await import("./helpers/angular-dom.mjs");
});
afterEach(() => env.TestBed.resetTestingModule());
after(() => env.dispose());

async function registerIcons() {
  const { MatIconRegistry } = await import("@angular/material/icon");
  const { DomSanitizer } = await import("@angular/platform-browser");
  const registry = env.TestBed.inject(MatIconRegistry);
  const sanitizer = env.TestBed.inject(DomSanitizer);
  for (const name of [
    "ui-question",
    "ui-close",
    "bg-create-first-vote",
    "bg-agenda",
  ]) {
    registry.addSvgIconLiteral(
      name,
      sanitizer.bypassSecurityTrustHtml(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280"/>'
      )
    );
  }
}

async function createPopover(inputs = {}) {
  env.TestBed.configureTestingModule({
    imports: [env.ds.VoteyPopoverComponent],
  });
  const fixture = env.TestBed.createComponent(env.ds.VoteyPopoverComponent);
  for (const [key, value] of Object.entries({
    ariaLabel: "Filters",
    triggerText: "Filters",
    ...inputs,
  }))
    fixture.componentRef.setInput(key, value);
  await env.settle(fixture);
  return fixture;
}

test("MatMenu opens once, connects the actual button to the panel, and closes once", async () => {
  const fixture = await createPopover();
  const events = [];
  fixture.componentInstance.openedChange.subscribe((value) =>
    events.push(value)
  );
  const button = env.by(fixture, "button");
  button.click();
  await env.settle(fixture);
  const panel = document.querySelector(".vt-popover-panel");
  assert.ok(panel?.classList.contains("mat-mdc-menu-panel"));
  assert.equal(button.getAttribute("aria-controls"), panel.id);
  assert.equal(button.getAttribute("aria-expanded"), "true");
  assert.equal(button.getAttribute("aria-haspopup"), "menu");
  fixture.componentInstance.open();
  assert.deepEqual(events, [true]);
  fixture.componentInstance.close();
  fixture.componentInstance.close();
  await env.settle(fixture);
  assert.deepEqual(events, [true, false]);
  assert.equal(button.getAttribute("aria-expanded"), "false");
});

test("disabled blocks mouse and programmatic opening, including disabling an open menu", async () => {
  const fixture = await createPopover({ disabled: true });
  env.by(fixture, "button").click();
  fixture.componentInstance.open();
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.isOpen(), false);
  fixture.componentRef.setInput("disabled", false);
  await env.settle(fixture);
  fixture.componentInstance.open();
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.isOpen(), true);
  fixture.componentRef.setInput("disabled", true);
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.isOpen(), false);
});

test("outside click and Escape dismiss, while clicking custom content keeps the menu open", async () => {
  const fixture = await createPopover();
  fixture.componentInstance.open();
  await env.settle(fixture);
  document.querySelector(".vt-popover-panel .panel").click();
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.isOpen(), true);
  document.querySelector(".cdk-overlay-backdrop").click();
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.isOpen(), false);
  fixture.componentInstance.open();
  await env.settle(fixture);
  document.querySelector(".vt-popover-panel .panel").dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      keyCode: 27,
      bubbles: true,
      cancelable: true,
    })
  );
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.isOpen(), false);
});

test("template content is lazy, receives close(), and is destroyed when its owner is destroyed", async () => {
  class Host {
    clicks = 0;
  }
  env.ng.Component({
    standalone: true,
    imports: [
      env.ds.VoteyPopoverComponent,
      env.ds.VoteyPopoverContentDirective,
    ],
    template: `<vt-popover ariaLabel="Filters" triggerText="Filters"><ng-template vtPopoverContent let-close="close"><button class="apply" (click)="clicks = clicks + 1; close()">Apply</button></ng-template></vt-popover>`,
  })(Host);
  env.TestBed.configureTestingModule({ imports: [Host] });
  const fixture = env.TestBed.createComponent(Host);
  await env.settle(fixture);
  assert.equal(document.querySelector(".apply"), null);
  env.by(fixture, "vt-popover button").click();
  await env.settle(fixture);
  document.querySelector(".apply").click();
  await env.settle(fixture);
  assert.equal(fixture.componentInstance.clicks, 1);
  env.by(fixture, "vt-popover button").click();
  await env.settle(fixture);
  assert.ok(document.querySelector(".apply"));
  fixture.destroy();
  assert.equal(document.querySelector(".vt-popover-panel"), null);
});

async function createHelp(content, translator = { translate: (key) => key }) {
  env.TestBed.configureTestingModule({
    imports: [env.ds.VoteyHelpPopoverComponent],
    providers: [{ provide: env.ds.VOTEY_TRANSLATOR, useValue: translator }],
  });
  await registerIcons();
  const fixture = env.TestBed.createComponent(env.ds.VoteyHelpPopoverComponent);
  fixture.componentRef.setInput("content", content);
  await env.settle(fixture);
  env.by(fixture, "button").click();
  await env.settle(fixture);
  return fixture;
}

test("help renders typed data, escapes HTML, uses vt-icon, and reacts to illustration/content changes", async () => {
  const fixture = await createHelp({
    title: "<b>Help</b>",
    illustration: "bg-create-first-vote",
    sections: [
      { heading: "Term", paragraphs: ["<img src=x>", "Second paragraph"] },
    ],
  });
  const panel = document.querySelector(".vt-popover-panel");
  assert.equal(panel.querySelector(".title").textContent.trim(), "<b>Help</b>");
  assert.equal(panel.querySelector(".title").tagName, "DIV");
  assert.equal(panel.querySelector(".title").getAttribute("role"), "heading");
  assert.equal(panel.querySelector(".heading").tagName, "DIV");
  assert.equal(panel.querySelector(".paragraph").tagName, "DIV");
  assert.equal(panel.querySelector("b"), null);
  assert.equal(panel.querySelector("img"), null);
  assert.equal(
    panel
      .querySelector(".illustration mat-icon")
      .getAttribute("data-mat-icon-name"),
    "bg-create-first-vote"
  );
  assert.equal(panel.querySelectorAll(".paragraph").length, 2);
  fixture.componentRef.setInput("content", {
    title: "Changed",
    illustration: "bg-agenda",
    sections: [],
  });
  await env.settle(fixture);
  assert.equal(
    panel
      .querySelector(".illustration mat-icon")
      .getAttribute("data-mat-icon-name"),
    "bg-agenda"
  );
  fixture.componentRef.setInput("content", {
    title: "Text only",
    sections: [{ paragraphs: ["No heading"] }],
  });
  await env.settle(fixture);
  assert.equal(panel.querySelector(".art"), null);
  assert.equal(panel.querySelector(".heading"), null);
  assert.ok(panel.querySelector(".text-only"));
});

test("help translates on language change and emits a cancellable link event before closing", async () => {
  const language = env.ng.signal("en");
  const fixture = await createHelp(
    {
      title: "TITLE",
      sections: [{ heading: "TERM", paragraphs: ["BODY"] }],
      action: { label: "GUIDE", href: "/guide" },
    },
    { translate: (key) => `${language()}:${key}` }
  );
  const panel = document.querySelector(".vt-popover-panel");
  assert.equal(panel.querySelector(".title").textContent.trim(), "en:TITLE");
  language.set("pl");
  await env.settle(fixture);
  assert.equal(panel.querySelector(".title").textContent.trim(), "pl:TITLE");
  const events = [];
  fixture.componentInstance.actionPressed.subscribe((event) => {
    events.push(event);
    event.preventDefault();
  });
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  panel.querySelector(".action").dispatchEvent(event);
  await env.settle(fixture);
  assert.equal(events.length, 1);
  assert.equal(event.defaultPrevented, true);
  assert.equal(
    env.by(fixture, "button").getAttribute("aria-expanded"),
    "false"
  );
});

test("modified help link clicks preserve native navigation and keep the panel open", async () => {
  const fixture = await createHelp({
    title: "Help",
    sections: [],
    action: { label: "Guide", href: "#guide" },
  });
  let emitted = false;
  fixture.componentInstance.actionPressed.subscribe(() => {
    emitted = true;
  });
  const event = new MouseEvent("click", {
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  document.querySelector(".action").dispatchEvent(event);
  await env.settle(fixture);
  assert.equal(event.defaultPrevented, false);
  assert.equal(emitted, false);
  assert.equal(env.by(fixture, "button").getAttribute("aria-expanded"), "true");
});
