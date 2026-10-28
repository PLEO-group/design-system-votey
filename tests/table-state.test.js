const assert = require("node:assert/strict");
const test = require("node:test");

test("table selection preserves other pages and toggles only the visible page", async () => {
  const { updateTableSelection } = await import("../angular/src/lib/table/table-state.ts");
  assert.deepEqual(updateTableSelection([99], [1, 2, 3], true), [99, 1, 2, 3]);
  assert.deepEqual(updateTableSelection([99, 1, 2, 3], [1, 2, 3], false), [99]);
  assert.deepEqual(updateTableSelection([99, 1], [1, 2, 3], true, 2), [99, 1, 3]);
});

test("Shift selects and deselects inclusive ranges in both directions", async () => {
  const { updateTableSelection } = await import("../angular/src/lib/table/table-state.ts");
  assert.deepEqual(updateTableSelection([99], [1, 2, 3, 4, 5], true, 3, 1), [99, 2, 3, 4]);
  assert.deepEqual(updateTableSelection([99], [1, 2, 3, 4, 5], true, 1, 3), [99, 2, 3, 4]);
  assert.deepEqual(updateTableSelection([99, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5], false, 1, 3), [99, 1, 5]);
  assert.deepEqual(updateTableSelection(["a"], ["a", "b"], true, 0), ["a"]);
});

test("local search matches supplied values without treating missing values as text", async () => {
  const { matchesTableSearch } = await import("../angular/src/lib/table/table-state.ts");
  assert.equal(matchesTableSearch(["Anna", "anna@example.com"], " ANNA "), true);
  assert.equal(matchesTableSearch(["Anna", 12345], "234"), true);
  assert.equal(matchesTableSearch([null, undefined], "null"), false);
  assert.equal(matchesTableSearch(["Anna"], "Jan"), false);
  assert.equal(matchesTableSearch(["Anna"], ""), true);
});

test("table and cell template directive are available through the Angular public entry point", async () => {
  await import("@angular/compiler");
  const ds = await import("@pleodigital/design-system-votey/angular");
  assert.equal(typeof ds.VoteyTableComponent, "function");
  assert.equal(typeof ds.VoteyTableCellDirective, "function");
  assert.equal(ds.VoteyTableComponent.ɵcmp.selectors[0][0], "vt-table");
});
