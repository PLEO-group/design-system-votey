const assert = require("node:assert/strict");
const test = require("node:test");

async function createSearch() {
  await import("@angular/compiler");
  const { Injector, ChangeDetectorRef, runInInjectionContext } = await import("@angular/core");
  const { FormControl } = await import("@angular/forms");
  const { VoteySearchComponent } = await import("@pleodigital/design-system-votey/angular");
  let checks = 0;
  const injector = Injector.create({ providers: [
    { provide: ChangeDetectorRef, useValue: { markForCheck: () => checks++ } },
  ] });
  const search = runInInjectionContext(injector, () => new VoteySearchComponent());
  return { search, injector, FormControl, checks: () => checks };
}

test("search shows clear only for a non-empty control and clears the shared value", async () => {
  const { search, injector, FormControl, checks } = await createSearch();
  try {
    const control = new FormControl("");
    search.control = control;
    assert.equal(search.hasValue, false);
    control.setValue("Anna");
    assert.equal(search.hasValue, true);
    assert.ok(checks() > 0);
    const cleared = [];
    search.cleared.subscribe(() => cleared.push(control.value));
    search.clear();
    assert.equal(control.value, "");
    assert.equal(control.dirty, true);
    assert.equal(search.hasValue, false);
    assert.deepEqual(cleared, [""]);
    search.clear();
    assert.deepEqual(cleared, [""]);
  } finally { injector.destroy(); }
});

test("search emits the draft on Enter or submit, without owning matching rules", async () => {
  const { search, injector, FormControl } = await createSearch();
  try {
    search.control = new FormControl("an");
    const values = [];
    search.searched.subscribe(value => values.push(value));
    let prevented = false;
    search.keyDown({ key: "Enter", preventDefault: () => prevented = true });
    search.submit();
    assert.equal(prevented, true);
    assert.deepEqual(values, ["an", "an"]);
    search.formControl.disable();
    search.submit();
    search.clear();
    assert.deepEqual(values, ["an", "an"]);
    assert.equal(search.formControl.value, "an");
  } finally { injector.destroy(); }
});

test("search follows replacement controls and releases its observation on destroy", async () => {
  const { search, injector, FormControl, checks } = await createSearch();
  const first = new FormControl("first");
  const second = new FormControl("second");
  search.control = first;
  search.control = second;
  const before = checks();
  first.setValue("ignored");
  assert.equal(checks(), before);
  assert.equal(search.formControl, second);
  injector.destroy();
  second.setValue("after destroy");
  assert.equal(checks(), before);
});
