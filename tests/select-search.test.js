const assert = require("node:assert/strict");
const test = require("node:test");
const { setTimeout: delay } = require("node:timers/promises");

async function createSelect() {
  await import("@angular/compiler");
  const { DOCUMENT } = await import("@angular/common");
  const { Injector, runInInjectionContext } = await import("@angular/core");
  const { VoteySelectComponent } = await import("@pleodigital/design-system-votey/angular");
  const injector = Injector.create({ providers: [{ provide: DOCUMENT, useValue: {} }] });
  const select = runInInjectionContext(injector, () => new VoteySelectComponent());
  return { select, injector };
}

test("select searches labels and descriptions by default and supports a custom predicate", async () => {
  const { select, injector } = await createSelect();
  try {
    const first = { label: "First", email: "first@example.com" };
    const second = { label: "Second", email: "other@example.com" };
    select.options = () => [first, second];
    assert.equal(select.searchable(), true);
    select.handleSearchInput({ target: { value: " FIRST " } });
    assert.deepEqual(select.filteredOptionViews().map((view) => view.option), [first]);
    select.handleSearchInput({ target: { value: "OTHER@" } });
    assert.deepEqual(select.filteredOptionViews().map((view) => view.option), [second]);
    select.handleSearchInput({ target: { value: "" } });
    assert.equal(select.filteredOptionViews().length, 2);
    select.customSearchFn = () => (term, option) => term === "remote" && option === second;
    select.handleSearchInput({ target: { value: "remote" } });
    assert.deepEqual(select.filteredOptionViews().map((view) => view.option), [second]);
  } finally {
    injector.destroy();
  }
});

test("select emits debounced distinct terms and cancels pending search on destroy", async () => {
  const { select, injector } = await createSelect();
  const emitted = [];
  select.searchDebounceTime = () => 10;
  select.customSearch.subscribe((term) => emitted.push(term));
  select.observeSearchChanges();
  select.handleSearchInput({ target: { value: "f" } });
  select.handleSearchInput({ target: { value: "first" } });
  assert.deepEqual(emitted, []);
  await delay(30);
  assert.deepEqual(emitted, ["first"]);
  select.handleSearchInput({ target: { value: "first" } });
  await delay(30);
  assert.deepEqual(emitted, ["first"]);
  select.handleSearchInput({ target: { value: "" } });
  await delay(30);
  assert.deepEqual(emitted, ["first", ""]);
  select.handleSearchInput({ target: { value: "pending" } });
  injector.destroy();
  await delay(30);
  assert.deepEqual(emitted, ["first", ""]);
});

test("filtering retains selected options in the rendered model without changing the control", async () => {
  const { select, injector } = await createSelect();
  try {
    const first = { label: "First", value: "first" };
    const second = { label: "Second", value: "second" };
    select.options = () => [first, second];
    select.bindValue = () => "value";
    const changes = [];
    select.formControl.valueChanges.subscribe((value) => changes.push(value));
    for (const value of ["first", ["first", "second"]]) {
      select.formControl.setValue(value, { emitEvent: false });
      select.handleSearchInput({ target: { value: "Second" } });
      assert.deepEqual(select.renderedOptionViews().map((option) => [option.value, option.hidden]), [
        ["first", true], ["second", false],
      ]);
      assert.deepEqual(select.formControl.value, value);
      select.handleSearchInput({ target: { value: "" } });
      assert.equal(select.renderedOptionViews().every((option) => !option.hidden), true);
      assert.deepEqual(select.formControl.value, value);
    }
    assert.deepEqual(changes, []);
  } finally {
    injector.destroy();
  }
});
