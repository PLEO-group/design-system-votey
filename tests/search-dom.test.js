const assert = require("node:assert/strict");
const { test, before, after, beforeEach, afterEach } = require("node:test");
let env;
before(async () => { env = await import("./helpers/angular-dom.mjs"); });
beforeEach(() => env.TestBed.configureTestingModule({ providers: [{ provide: env.ng.ErrorHandler, useValue: { handleError(error) { throw error; } } }] }));
afterEach(() => env.TestBed.resetTestingModule());
after(() => env.dispose());

test("search renders its clear action inside the input, before the search action", async () => {
  const { TestBed, ds, forms, by, all, settle, inputValue } = env;
  TestBed.configureTestingModule({ imports: [ds.VoteySearchComponent] });
  const fixture = TestBed.createComponent(ds.VoteySearchComponent);
  const control = new forms.FormControl("");
  fixture.componentRef.setInput("label", "");
  fixture.componentRef.setInput("ariaLabel", "Search members");
  fixture.componentRef.setInput("control", control);
  await settle(fixture);
  assert.equal(by(fixture, "input").getAttribute("aria-label"), "Search members");
  assert.equal(all(fixture, ".field button").length, 1);
  inputValue(by(fixture, "input"), "Anna");
  await settle(fixture);
  assert.equal(all(fixture, ".field button").length, 2);
  assert.equal(all(fixture, ".field button")[0].getAttribute("aria-label"), "LABEL.TABLE_CLEAR_SEARCH");
  const cleared = [];
  fixture.componentInstance.cleared.subscribe(() => cleared.push(control.value));
  all(fixture, ".field button")[0].click();
  await settle(fixture);
  assert.deepEqual(cleared, [""]);
  assert.equal(by(fixture, "input").value, "");
  assert.equal(all(fixture, ".field button").length, 1);
});

async function createSearch(value = "Anna", inputs = {}) {
  env.TestBed.configureTestingModule({ imports: [env.ds.VoteySearchComponent] });
  const fixture = env.TestBed.createComponent(env.ds.VoteySearchComponent);
  const control = new env.forms.FormControl(value);
  for (const [name, input] of Object.entries({ label: "Search", control, ...inputs })) fixture.componentRef.setInput(name, input);
  const searched = [];
  fixture.componentInstance.searched.subscribe(value => searched.push(value));
  await env.settle(fixture);
  return { fixture, control, searched };
}

test("search button and Enter emit the unmodified draft; ordinary keys do not submit", async () => {
  const { fixture, control, searched } = await createSearch(" an ");
  const input = env.by(fixture, "input");
  input.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
  assert.deepEqual(searched, []);
  const enter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
  input.dispatchEvent(enter);
  assert.equal(enter.defaultPrevented, true);
  env.all(fixture, ".field button").at(-1).click();
  await env.settle(fixture);
  assert.deepEqual(searched, [" an ", " an "]);
  assert.equal(control.value, " an ");
});

test("search reflects programmatic values, null, and replacement controls in the DOM", async () => {
  const { fixture, control } = await createSearch();
  control.setValue(null);
  await env.settle(fixture);
  assert.equal(env.by(fixture, "input").value, "");
  assert.equal(env.all(fixture, ".field button").length, 1);
  const replacement = new env.forms.FormControl("Replacement");
  fixture.componentRef.setInput("control", replacement);
  await env.settle(fixture);
  assert.equal(env.by(fixture, "input").value, "Replacement");
  control.setValue("Obsolete");
  await env.settle(fixture);
  assert.equal(env.by(fixture, "input").value, "Replacement");
  env.all(fixture, ".field button")[0].click();
  await env.settle(fixture);
  assert.equal(replacement.value, "");
  assert.equal(replacement.dirty, true);
  assert.equal(control.value, "Obsolete");
});

test("both disabled input and disabled FormControl prevent search and clear", async () => {
  for (const viaControl of [false, true]) {
    const { fixture, control, searched } = await createSearch("Anna", { disabled: !viaControl });
    if (viaControl) { control.disable(); await env.settle(fixture); }
    assert.equal(env.by(fixture, "input").matches(":disabled"), true, `viaControl=${viaControl}`);
    for (const button of env.all(fixture, ".field button")) {
      assert.equal(button.disabled, true);
      button.click();
    }
    env.by(fixture, "input").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    assert.deepEqual(searched, []);
    assert.equal(control.value, "Anna");
    env.TestBed.resetTestingModule();
  }
});


test("search can be enabled again without changing the supplied control's disabled state", async () => {
  const { fixture, control, searched } = await createSearch("Anna", { disabled: true });
  assert.equal(control.disabled, false);
  fixture.componentRef.setInput("disabled", false);
  await env.settle(fixture);
  assert.equal(env.by(fixture, "input").matches(":disabled"), false);
  env.all(fixture, ".field button").at(-1).click();
  assert.deepEqual(searched, ["Anna"]);
  control.disable();
  await env.settle(fixture);
  control.enable();
  await env.settle(fixture);
  assert.equal(env.by(fixture, "input").matches(":disabled"), false);
  assert.equal(env.all(fixture, ".field button").at(-1).disabled, false);
});

