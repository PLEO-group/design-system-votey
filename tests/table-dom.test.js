const assert = require("node:assert/strict");
const { test, before, after, beforeEach, afterEach } = require("node:test");
let env;
before(async () => { env = await import("./helpers/angular-dom.mjs"); });
beforeEach(() => env.TestBed.configureTestingModule({ providers: [{ provide: env.ng.ErrorHandler, useValue: { handleError(error) { throw error; } } }] }));
afterEach(() => env.TestBed.resetTestingModule());
after(() => env.dispose());

const rows = [
  { id: "a", name: "Anna", secret: "hidden" },
  { id: "b", name: "Jan", secret: "Anna" },
  { id: "c", name: "Maria", secret: "hidden" },
  { id: "d", name: "Piotr", secret: "hidden" },
];
const columns = [
  { id: "name", header: "Name", searchable: true, value: row => row.name },
  { id: "secret", header: "Secret", value: row => row.secret },
];

async function createTable(inputs = {}) {
  const { TestBed, ds, settle } = env;
  TestBed.configureTestingModule({ imports: [ds.VoteyTableComponent] });
  const fixture = TestBed.createComponent(ds.VoteyTableComponent);
  for (const [key, value] of Object.entries({ rows, columns, rowKey: row => row.id, label: "Members", ...inputs })) fixture.componentRef.setInput(key, value);
  const queries = [], selections = [], cancelled = [], clicks = [];
  fixture.componentInstance.queryChange.subscribe(query => queries.push(query));
  fixture.componentInstance.selectedKeys.subscribe(keys => selections.push(keys));
  fixture.componentInstance.filtersCancelled.subscribe(filters => cancelled.push(filters));
  fixture.componentInstance.rowClick.subscribe(row => clicks.push(row));
  await settle(fixture);
  return { fixture, table: fixture.componentInstance, queries, selections, cancelled, clicks };
}

const rowChecks = fixture => env.all(fixture, 'tbody input[type="checkbox"]');
const headerCheck = fixture => env.by(fixture, 'thead input[type="checkbox"]');
const bodyText = fixture => env.all(fixture, "tbody").map(body => body.textContent).join(" ");
async function click(fixture, element) { element.click(); await env.settle(fixture); }
async function closeDialog(fixture, accept) {
  const buttons = [...document.querySelectorAll(".confirmation button")];
  assert.equal(buttons.length, 2, "the real confirmation dialog must be rendered");
  buttons[accept ? 1 : 0].click();
  await env.settle(fixture);
}

test("basic table renders columns, default body values and header variants", async () => {
  const { fixture } = await createTable();
  assert.equal(env.all(fixture, "tbody tr").length, 4);
  assert.equal(env.by(fixture, "table caption").textContent, "Members");
  assert.equal(env.all(fixture, "thead th").length, 2);
  assert.ok(env.by(fixture, "thead .caption-extrabold.primary"));
  assert.ok(env.by(fixture, "tbody .body"));
  assert.equal(env.by(fixture, "vt-pagination"), null);
  assert.equal(headerCheck(fixture), null);
  fixture.componentRef.setInput("headerVariant", "heavy");
  await env.settle(fixture);
  assert.ok(env.by(fixture, "thead.heavy .caption-extrabold.inverse"));
});

test("checkbox clicks, indeterminate and visible-page select all preserve other pages", async () => {
  const { fixture, table } = await createTable({ selectable: true, selectedKeys: ["another-page"] });
  await click(fixture, rowChecks(fixture)[0]);
  assert.deepEqual(table.selectedKeys(), ["another-page", "a"]);
  assert.equal(headerCheck(fixture).indeterminate, true);
  assert.match(env.by(fixture, ".selection-bar").textContent, /2/);
  await click(fixture, headerCheck(fixture));
  assert.deepEqual(table.selectedKeys(), ["another-page", "a", "b", "c", "d"]);
  await click(fixture, headerCheck(fixture));
  assert.deepEqual(table.selectedKeys(), ["another-page"]);
  assert.equal(document.querySelector(".confirmation"), null);
});

test("Shift reaches the checkbox handler before changed and toggles an inclusive range", async () => {
  const { fixture, table } = await createTable({ selectable: true });
  await click(fixture, rowChecks(fixture)[0]);
  rowChecks(fixture)[3].dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, shiftKey: true }));
  await click(fixture, rowChecks(fixture)[3]);
  assert.deepEqual(table.selectedKeys(), ["a", "b", "c", "d"]);
  rowChecks(fixture)[1].dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, shiftKey: true }));
  await click(fixture, rowChecks(fixture)[1]);
  assert.deepEqual(table.selectedKeys(), ["a"]);
});

test("new objects and page changes retain selected identities and reset the Shift anchor", async () => {
  const { fixture, table } = await createTable({ selectable: true });
  await click(fixture, rowChecks(fixture)[0]);
  fixture.componentRef.setInput("rows", [{ id: "e", name: "Eva" }, { id: "f", name: "Filip" }]);
  fixture.componentRef.setInput("page", 1);
  await env.settle(fixture);
  rowChecks(fixture)[1].dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, shiftKey: true }));
  await click(fixture, rowChecks(fixture)[1]);
  assert.deepEqual(table.selectedKeys(), ["a", "f"]);
  fixture.componentRef.setInput("rows", rows.map(row => ({ ...row })));
  await env.settle(fixture);
  assert.equal(rowChecks(fixture)[0].checked, true);
});

test("local slicing and paginator agree when the collection shrinks", async () => {
  const { fixture } = await createTable({ searchMode: "local", pagination: "local", page: 2, size: 2,
    rows: [...rows, { id: "e", name: "Eva" }] });
  assert.match(bodyText(fixture), /Eva/);
  fixture.componentRef.setInput("rows", rows.slice(0, 1));
  await env.settle(fixture);
  assert.match(bodyText(fixture), /Anna/);
  assert.match(env.by(fixture, "vt-pagination .range").textContent, /1–1 \/ 1/);
  assert.equal(env.by(fixture, "vt-pagination .page-button.selected").textContent.trim(), "1");
});

test("real paginator emits controlled zero-based query and keeps selection", async () => {
  const { fixture, queries, table } = await createTable({ pagination: "remote", size: 10, totalElements: 40,
    selectable: true, selectedKeys: ["a"], search: "Anna", filters: { active: true } });
  const buttons = env.all(fixture, "vt-pagination .page-button");
  await click(fixture, buttons[buttons.length - 1]);
  assert.deepEqual(queries, [{ page: 1, size: 10, search: "Anna", filters: { active: true } }]);
  assert.deepEqual(table.selectedKeys(), ["a"]);
});

test("filters wait for the real dialog; refusal preserves data, selection and applied query", async () => {
  const { fixture, table, queries, cancelled } = await createTable({ selectedKeys: ["a"], filters: { old: true } });
  const pending = table.requestFilters({ active: true });
  await env.settle(fixture);
  assert.deepEqual(queries, []);
  await closeDialog(fixture, false);
  assert.equal(await pending, false);
  assert.deepEqual(table.selectedKeys(), ["a"]);
  assert.deepEqual(queries, []);
  assert.deepEqual(cancelled, [{ active: true }]);
  assert.match(bodyText(fixture), /Anna/);
});

test("accepted filters clear selection once and emit exactly one query", async () => {
  const { fixture, table, queries, selections } = await createTable({ selectedKeys: ["a"], page: 3 });
  const pending = table.requestFilters({ active: true });
  await env.settle(fixture);
  await closeDialog(fixture, true);
  assert.equal(await pending, true);
  assert.deepEqual(selections, [[]]);
  assert.deepEqual(queries, [{ page: 0, size: 20, search: "", filters: { active: true } }]);
});

test("changed source data cancels a pending confirmation without clearing selection", async () => {
  const { fixture, table, queries } = await createTable({ selectedKeys: ["a"] });
  const pending = table.requestFilters({ active: true });
  await env.settle(fixture);
  fixture.componentRef.setInput("rows", rows.map(row => ({ ...row })));
  await env.settle(fixture);
  assert.equal(await pending, false);
  assert.deepEqual(table.selectedKeys(), ["a"]);
  assert.deepEqual(queries, []);
  assert.equal(document.querySelector(".confirmation"), null);
});

test("loading, disabled and open confirmation block overlapping queries", async () => {
  for (const input of ["loading", "disabled"]) {
    const { fixture, table, queries } = await createTable({ [input]: true, searchMode: "remote" });
    assert.equal(await table.requestFilters({ active: true }), false);
    await click(fixture, env.all(fixture, "vt-search button").at(-1));
    assert.deepEqual(queries, []);
    env.TestBed.resetTestingModule();
  }
  const { fixture, table, queries } = await createTable({ selectedKeys: ["a"] });
  const pending = table.requestFilters({ first: true });
  await env.settle(fixture);
  assert.equal(await table.requestFilters({ second: true }), false);
  assert.equal(document.querySelectorAll(".confirmation").length, 1);
  await closeDialog(fixture, true);
  await pending;
  assert.equal(queries.length, 1);
  assert.deepEqual(queries[0].filters, { first: true });
});

test("loading wins over error, uses the correct skeleton count and preserves selection", async () => {
  const { fixture, table } = await createTable({ loading: true, error: true, selectedKeys: ["a"] });
  assert.equal(env.all(fixture, ".skeleton-row").length, 5);
  assert.equal(env.by(fixture, "[role=alert]"), null);
  assert.equal(env.by(fixture, "section").getAttribute("aria-busy"), "true");
  fixture.componentRef.setInput("pagination", "remote");
  fixture.componentRef.setInput("size", 10);
  await env.settle(fixture);
  assert.equal(env.all(fixture, ".skeleton-row").length, 10);
  assert.deepEqual(table.selectedKeys(), ["a"]);
});

test("empty, no-results and retry are distinct rendered states", async () => {
  const { fixture, table } = await createTable({ rows: [] });
  assert.match(bodyText(fixture), /MESSAGE.TABLE_EMPTY/);
  fixture.componentRef.setInput("search", "Anna");
  await env.settle(fixture);
  assert.match(bodyText(fixture), /MESSAGE.TABLE_NO_RESULTS/);
  fixture.componentRef.setInput("error", true);
  await env.settle(fixture);
  assert.match(env.by(fixture, "[role=alert]").textContent, /MESSAGE.TABLE_ERROR/);
  let retries = 0;
  table.retry.subscribe(() => retries++);
  await click(fixture, env.by(fixture, ".state button"));
  assert.equal(retries, 1);
});

test("manual local search uses only searchable columns and deduplicates accepted terms", async () => {
  const { fixture, queries } = await createTable({ searchMode: "local", filters: { active: true } });
  env.inputValue(env.by(fixture, "vt-search input"), "  Anna  ");
  await click(fixture, env.all(fixture, "vt-search button").at(-1));
  assert.equal(env.all(fixture, "tbody tr").length, 1);
  assert.match(bodyText(fixture), /Anna/);
  assert.doesNotMatch(bodyText(fixture), /Jan/);
  assert.deepEqual(queries, [{ page: 0, size: 20, search: "Anna", filters: { active: true } }]);
  await click(fixture, env.all(fixture, "vt-search button").at(-1));
  assert.equal(queries.length, 1);
  env.inputValue(env.by(fixture, "vt-search input"), "an");
  await click(fixture, env.all(fixture, "vt-search button").at(-1));
  assert.equal(queries.length, 1);
  assert.equal(env.all(fixture, "tbody tr").length, 1);
  await click(fixture, env.all(fixture, "vt-search button")[0]);
  assert.equal(env.all(fixture, "tbody tr").length, 4);
  assert.deepEqual(queries.at(-1), { page: 0, size: 20, search: "", filters: { active: true } });
});

test("search refusal restores the accepted term; confirming X clears selection and preserves filters", async () => {
  const { fixture, table, queries, selections } = await createTable({ searchMode: "remote", search: "Anna",
    selectedKeys: ["a"], filters: { active: true } });
  env.inputValue(env.by(fixture, "vt-search input"), "Maria");
  await click(fixture, env.all(fixture, "vt-search button").at(-1));
  assert.deepEqual(queries, []);
  await closeDialog(fixture, false);
  assert.equal(env.by(fixture, "vt-search input").value, "Anna");
  assert.deepEqual(table.selectedKeys(), ["a"]);
  await click(fixture, env.all(fixture, "vt-search button")[0]);
  assert.deepEqual(queries, []);
  await closeDialog(fixture, true);
  assert.deepEqual(selections, [[]]);
  assert.deepEqual(queries, [{ page: 0, size: 20, search: "", filters: { active: true } }]);
});

test("destroying a table closes its pending dialog without emitting a query or clearing selection", async () => {
  const { fixture, table, queries, selections } = await createTable({ selectedKeys: ["a"] });
  const pending = table.requestFilters({ active: true });
  await env.settle(fixture);
  fixture.destroy();
  assert.equal(await pending, false);
  assert.deepEqual(queries, []);
  assert.deepEqual(selections, []);
  assert.deepEqual(table.selectedKeys(), ["a"]);
  assert.equal(document.querySelector(".confirmation"), null);
});

test("row clicks emit records but checkbox and interactive descendants do not", async () => {
  const { fixture, clicks } = await createTable({ selectable: true });
  await click(fixture, env.by(fixture, "tbody td:nth-child(2)"));
  assert.deepEqual(clicks, [rows[0]]);
  await click(fixture, rowChecks(fixture)[0]);
  assert.equal(clicks.length, 1);
  fixture.componentRef.setInput("disabled", true);
  await env.settle(fixture);
  await click(fixture, env.by(fixture, "tbody td:nth-child(2)"));
  assert.equal(clicks.length, 1);
});

test("automatic search waits 300ms and three characters; selected records require explicit submission", async () => {
  const { TestScheduler } = await import("rxjs/testing");
  const { fixture, queries } = await createTable({ searchMode: "remote" });
  const scheduler = new TestScheduler(() => {});
  scheduler.run(() => {
    env.inputValue(env.by(fixture, "vt-search input"), "An");
    scheduler.schedule(() => assert.deepEqual(queries, []), 301);
  });
  await env.settle(fixture);
  assert.deepEqual(queries, []);
  scheduler.run(() => {
    env.inputValue(env.by(fixture, "vt-search input"), "Anna");
    scheduler.schedule(() => assert.deepEqual(queries, []), 299);
  });
  await env.settle(fixture);
  assert.deepEqual(queries, [{ page: 0, size: 20, search: "Anna", filters: {} }]);
  fixture.componentRef.setInput("selectedKeys", ["a"]);
  await env.settle(fixture);
  scheduler.run(() => env.inputValue(env.by(fixture, "vt-search input"), "Maria"));
  await env.settle(fixture);
  assert.equal(queries.length, 1);
  assert.equal(document.querySelector(".confirmation"), null);
  await click(fixture, env.all(fixture, "vt-search button").at(-1));
  await closeDialog(fixture, true);
  assert.equal(queries.at(-1).search, "Maria");
});

test("custom cell context, row actions, toolbar and selection actions use public templates", async () => {
  const { ng, ds, TestBed } = env;
  class Host {
    rows = rows;
    columns = [{ id: "name", header: "Name", value: row => row.name },
      { id: "actions", header: "Actions", role: "actions", value: row => row.id }];
    key = row => row.id;
    selected = ["another-page"];
    actions = [];
    clicks = [];
  }
  ng.Component({ selector: "test-table-host", imports: [ds.VoteyTableComponent, ds.VoteyTableCellDirective, ds.VoteyButtonComponent],
    template: `<ng-template #selection let-keys><span class="selected-keys">{{ keys.join(',') }}</span></ng-template>
      <vt-table label="Members" [rows]="rows" [columns]="columns" [rowKey]="key"
        [selectable]="true" [(selectedKeys)]="selected" [selectionActions]="selection" (rowClick)="clicks.push($event)">
        <span vtTableToolbar class="custom-toolbar">Toolbar content</span>
        <ng-template vtTableCell="name" [vtTableCellOf]="rows" let-row let-value="value" let-column="column" let-index="index">
          <strong class="custom-cell">{{ index }}:{{ column.id }}:{{ value }}:{{ row.id }}</strong>
        </ng-template>
        <ng-template vtTableCell="actions" [vtTableCellOf]="rows" let-row>
          <vt-button text="Edit" (pressed)="actions.push(row.id)" />
        </ng-template>
      </vt-table>` })(Host);
  TestBed.configureTestingModule({ imports: [Host] });
  const fixture = TestBed.createComponent(Host);
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".custom-cell").textContent, "0:name:Anna:a");
  assert.equal(env.by(fixture, ".custom-toolbar").textContent, "Toolbar content");
  assert.equal(env.by(fixture, ".selected-keys").textContent, "another-page");
  assert.equal(env.all(fixture, "tbody .actions-cell").length, 4);
  await click(fixture, env.by(fixture, "tbody button"));
  assert.deepEqual(fixture.componentInstance.actions, ["a"]);
  assert.deepEqual(fixture.componentInstance.clicks, []);
  await click(fixture, rowChecks(fixture)[0]);
  assert.deepEqual(fixture.componentInstance.selected, ["another-page", "a"]);
  assert.equal(env.by(fixture, ".selected-keys").textContent, "another-page,a");
});

test("clearing and immediately retyping the same search is not lost by debounce", async () => {
  const { TestScheduler } = await import("rxjs/testing");
  const { fixture, queries } = await createTable({ searchMode: "local", search: "Anna" });
  const scheduler = new TestScheduler(() => {});
  // All events occur before the 300ms debounce expires, as in a quick correction.
  scheduler.run(() => {
    env.inputValue(env.by(fixture, "vt-search input"), "Anna");
    scheduler.schedule(() => env.all(fixture, "vt-search button")[0].click(), 10);
  });
  await env.settle(fixture);
  assert.equal(queries.at(-1).search, "");
  scheduler.run(() => env.inputValue(env.by(fixture, "vt-search input"), "Anna"));
  await env.settle(fixture);
  assert.deepEqual(queries.map(query => query.search), ["", "Anna"]);
  assert.equal(env.all(fixture, "tbody tr").length, 1);
});

test("destroy cancels queued automatic searches", async () => {
  const { TestScheduler } = await import("rxjs/testing");
  const { fixture, queries } = await createTable({ searchMode: "remote" });
  new TestScheduler(() => {}).run(scheduler => {
    env.inputValue(env.by(fixture, "vt-search input"), "Anna");
    fixture.destroy();
  });
  await Promise.resolve();
  assert.deepEqual(queries, []);
});


test("shared switch template renders default values and yields to named column overrides", async () => {
  const { ng, ds, TestBed } = env;
  class Host {
    rows = [{ id: "a", name: "Anna", count: 0, active: false, missing: null }];
    columns = ["name", "count", "active", "missing"].map(id => ({ id, header: id, value: row => row[id] }));
    key = row => row.id;
  }
  ng.Component({ selector: "test-shared-cell-host", imports: [ds.VoteyTableComponent, ds.VoteyTableCellDirective],
    template: `<vt-table #table label="Members" [rows]="rows" [columns]="columns" [rowKey]="key">
      <ng-template vtTableCell [vtTableCellOf]="table" let-row let-column="column" let-value="value" let-index="index">
        @switch (column.id) {
          @case ('name') { <span class="switch-name">{{ row.name }}:{{ index }}</span> }
          @default { <span class="shared-default">{{ '' + (value ?? '') }}</span> }
        }
      </ng-template>
      <ng-template vtTableCell="count" [vtTableCellOf]="table" let-value="value"><b class="override">{{ value }}</b></ng-template>
    </vt-table>` })(Host);
  TestBed.configureTestingModule({ imports: [Host] });
  const fixture = TestBed.createComponent(Host);
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".switch-name").textContent, "Anna:0");
  assert.equal(env.by(fixture, ".override").textContent, "0");
  assert.deepEqual(env.all(fixture, ".shared-default").map(cell => cell.textContent), ["false", ""]);
});

test("field columns preserve zero and false, render missing values empty and support local search", async () => {
  const { fixture, queries } = await createTable({ searchMode: "local", rows: [{ id: "a", name: "Anna", count: 0, active: false, nested: {} }],
    columns: ["name", "count", "active", "missing", "nested"].map(id => ({ id, header: id, field: id, searchable: id === "name" })) });
  assert.deepEqual(env.all(fixture, "tbody td").map(cell => cell.textContent.trim()), ["Anna", "0", "false", "", ""]);
  env.inputValue(env.by(fixture, "vt-search input"), "Anna");
  await click(fixture, env.all(fixture, "vt-search button").at(-1));
  assert.equal(queries[0].search, "Anna");
  assert.match(bodyText(fixture), /Anna/);
});

test("auto columns use first-record keys, exclusions, explicit overrides and extra action definitions", async () => {
  const { fixture } = await createTable({ autoColumns: true, headersPrefix: "LABEL.", excludedColumns: ["id", "secret"],
    columns: [{ id: "name", header: "Custom name", field: "name", searchable: true },
      { id: "actions", header: "Actions", role: "actions", value: () => "Edit" }] });
  assert.deepEqual(env.all(fixture, "thead th").map(cell => cell.textContent.trim()), ["Custom name", "Actions"]);
  fixture.componentRef.setInput("rows", [{ id: "e", name: "Eva", count: 0 }]);
  await env.settle(fixture);
  assert.deepEqual(env.all(fixture, "thead th").map(cell => cell.textContent.trim()), ["Custom name", "LABEL.COUNT", "Actions"]);
  assert.match(bodyText(fixture), /Eva/);
  fixture.componentRef.setInput("rows", []);
  await env.settle(fixture);
  assert.deepEqual(env.all(fixture, "thead th").map(cell => cell.textContent.trim()), ["Custom name", "Actions"]);
});

test("auto columns are opt-in and an empty dataset without explicit columns stays valid", async () => {
  const { fixture } = await createTable({ columns: [], autoColumns: true, rows: [] });
  assert.equal(env.all(fixture, "thead th").length, 0);
  assert.match(bodyText(fixture), /MESSAGE.TABLE_EMPTY/);
  fixture.componentRef.setInput("rows", rows);
  fixture.componentRef.setInput("autoColumns", false);
  await env.settle(fixture);
  assert.equal(env.all(fixture, "thead th").length, 0);
});

test("auto columns retain definitions for new records with the same fields and react to schema and configuration changes", async () => {
  const { fixture, table } = await createTable({ columns: [], autoColumns: true });
  const initial = table.resolvedColumns();
  fixture.componentRef.setInput("rows", [{ id: "next", name: "New name", secret: "new" }]);
  await env.settle(fixture);
  assert.equal(table.resolvedColumns(), initial);
  assert.match(bodyText(fixture), /New name/);
  fixture.componentRef.setInput("rows", [{ id: "next", name: "New name", count: 0 }]);
  await env.settle(fixture);
  assert.notEqual(table.resolvedColumns(), initial);
  assert.deepEqual(table.resolvedColumns().map(column => column.id), ["id", "name", "count"]);
  fixture.componentRef.setInput("headersPrefix", "LABEL.");
  fixture.componentRef.setInput("excludedColumns", ["id"]);
  await env.settle(fixture);
  assert.deepEqual(env.all(fixture, "thead th").map(cell => cell.textContent.trim()), ["LABEL.NAME", "LABEL.COUNT"]);
});

test("column header tooltips preserve full question text and are disabled when absent", async () => {
  const { By } = await import("@angular/platform-browser");
  const { MatTooltip } = await import("@angular/material/tooltip");
  const { fixture } = await createTable({ columns: [{ id: "name", header: "Name", field: "name", headerTooltip: "Full question text" }] });
  const tooltip = fixture.debugElement.query(By.css("thead th")).injector.get(MatTooltip);
  assert.equal(tooltip.message, "Full question text");
  assert.equal(tooltip.disabled, false);
  fixture.componentRef.setInput("columns", [{ id: "name", header: "Name", field: "name" }]);
  await env.settle(fixture);
  assert.equal(tooltip.disabled, true);
});

test("fillContainer is opt-in and applies the container layout class", async () => {
  const { fixture } = await createTable();
  assert.equal(fixture.nativeElement.classList.contains("fill-container"), false);
  fixture.componentRef.setInput("fillContainer", true);
  await env.settle(fixture);
  assert.equal(fixture.nativeElement.classList.contains("fill-container"), true);
});

test("default keys preserve id zero and selection after refreshing records", async () => {
 const { fixture, table } = await createTable({ rowKey: undefined, selectable: true, rows: [{ id: 0, name: "First" }] });
 await click(fixture, rowChecks(fixture)[0]);
 assert.deepEqual(table.selectedKeys(), [0]);
 fixture.componentRef.setInput("rows", [{ id: 0, name: "Updated" }]);
 await env.settle(fixture);
 assert.equal(rowChecks(fixture)[0].checked, true);
});
test("anonymous rows track objects through reordering", async () => {
 const first = { name: "same" }, second = { name: "same" };
 const { fixture } = await createTable({ rowKey: undefined, rows: [first, second] });
 const original = env.all(fixture, "tbody tr");
 fixture.componentRef.setInput("rows", [second, first]);
 await env.settle(fixture);
 assert.equal(env.all(fixture, "tbody tr")[0], original[1]);
 assert.equal(env.all(fixture, "tbody tr")[1], original[0]);
});
test("selectable anonymous rows require stable keys", async () => {
 await assert.rejects(() => createTable({ rowKey: undefined, selectable: true, rows: [{ name: "Anonymous" }] }), /vt-table:.*rowKey/);
});
test("explicit keys override ids", async () => {
 const { fixture, table } = await createTable({ rows: [{ id: 0, name: "Custom" }], selectable: true, rowKey: row => row.name });
 await click(fixture, rowChecks(fixture)[0]);
 assert.deepEqual(table.selectedKeys(), ["Custom"]);
});

test("selection reuses row controls and cell values instead of recomputing them", async () => {
 let reads = 0;
 const { fixture, table } = await createTable({ selectable: true, columns: [
  { id: "name", header: "Name", value: row => { reads++; return row.name; } },
 ] });
 const initialRows = table.viewRows();
 const initialReads = reads;
 await click(fixture, rowChecks(fixture)[0]);
 assert.equal(reads, initialReads);
 assert.equal(table.viewRows()[0].control, initialRows[0].control);
 assert.equal(table.viewRows()[0].cells, initialRows[0].cells);
 assert.equal(table.viewRows()[0].control.value, true);
 fixture.componentRef.setInput("selectedKeys", ["b"]);
 await env.settle(fixture);
 assert.equal(rowChecks(fixture)[0].checked, false);
 assert.equal(rowChecks(fixture)[1].checked, true);
 assert.equal(reads, initialReads);
 fixture.componentRef.setInput("rows", [{ id: "a", name: "Updated" }]);
 await env.settle(fixture);
 assert.match(bodyText(fixture), /Updated/);
 assert.ok(reads > initialReads);
});

test("local search does not enable pagination when pagination is omitted", async () => {
 const { fixture } = await createTable({ searchMode: "local", size: 2 });
 assert.equal(env.by(fixture, "vt-pagination"), null);
 assert.equal(env.all(fixture, "tbody tr").length, rows.length);
});

test("local pagination works without search or parent state updates and preserves selection", async () => {
 const { fixture, table, queries } = await createTable({ pagination: "local", size: 2, selectable: true });
 assert.equal(env.by(fixture, "vt-search"), null);
 assert.equal(env.all(fixture, "tbody tr").length, 2);
 assert.match(env.by(fixture, "vt-pagination .range").textContent, /1–2 \/ 4/);
 await click(fixture, rowChecks(fixture)[0]);
 await click(fixture, env.all(fixture, "vt-pagination .page-button").at(-1));
 assert.match(bodyText(fixture), /Maria/);
 assert.doesNotMatch(bodyText(fixture), /Anna/);
 assert.deepEqual(queries.at(-1), { page: 1, size: 2, search: "", filters: {} });
 assert.deepEqual(table.selectedKeys(), ["a"]);
 table.paginate({ page: 0, size: 3 });
 await env.settle(fixture);
 assert.equal(env.all(fixture, "tbody tr").length, 3);
 assert.match(env.by(fixture, "vt-pagination .range").textContent, /1–3 \/ 4/);
 assert.equal(rowChecks(fixture)[0].checked, true);
 fixture.componentRef.setInput("page", 1);
 fixture.componentRef.setInput("size", 1);
 await env.settle(fixture);
 assert.match(bodyText(fixture), /Jan/);
 fixture.componentRef.setInput("rows", rows.slice(0, 1));
 await env.settle(fixture);
 assert.match(bodyText(fixture), /Anna/);
 assert.match(env.by(fixture, "vt-pagination .range").textContent, /1–1 \/ 1/);
});
test("local search resets locally paginated results to the first page", async () => {
 const { fixture, queries } = await createTable({ pagination: "local", searchMode: "local", page: 1, size: 2 });
 const input = env.by(fixture, "vt-search input");
 input.value = "Anna";
 input.dispatchEvent(new Event("input", { bubbles: true }));
 await click(fixture, env.all(fixture, "vt-search button").at(-1));
 assert.match(bodyText(fixture), /Anna/);
 assert.match(env.by(fixture, "vt-pagination .range").textContent, /1–1 \/ 1/);
 assert.equal(queries.at(-1).page, 0);
});
test("explicit remote pagination keeps server rows and totals independently of search mode", async () => {
 const { fixture, queries } = await createTable({ pagination: "remote", searchMode: "local", page: 1, size: 2, totalElements: 40 });
 assert.equal(env.all(fixture, "tbody tr").length, 4);
 assert.match(env.by(fixture, "vt-pagination .range").textContent, /3–4 \/ 40/);
 await click(fixture, env.all(fixture, "vt-pagination .page-button").at(-1));
 assert.equal(queries.at(-1).page, 2);
 assert.match(env.by(fixture, "vt-pagination .range").textContent, /3–4 \/ 40/);
});

test("page-size select is disabled during loading and confirmation and re-enables afterwards", async () => {
 const { By } = await import("@angular/platform-browser");
 const { MatSelect } = await import("@angular/material/select");
 const { fixture, table } = await createTable({ pagination: "remote", loading: true, selectedKeys: ["a"] });
 const select = fixture.debugElement.query(By.directive(MatSelect)).componentInstance;
 const field = env.by(fixture, "vt-pagination vt-select .field");
 assert.equal(select.disabled, true);
 field.click();
 select.open();
 await env.settle(fixture);
 assert.equal(document.querySelector(".vt-select-panel"), null);
 fixture.componentRef.setInput("loading", false);
 await env.settle(fixture);
 assert.equal(select.disabled, false);
 const pending = table.requestFilters({ active: true });
 await env.settle(fixture);
 assert.equal(select.disabled, true);
 field.click();
 assert.equal(document.querySelector(".vt-select-panel"), null);
 await closeDialog(fixture, false);
 await pending;
 assert.equal(select.disabled, false);
});

test("pagination opens an anchored size menu with above preference and no search", async () => {
 const { By } = await import("@angular/platform-browser");
 const { MatSelect } = await import("@angular/material/select");
 const { fixture } = await createTable({ pagination: "remote" });
 const select = fixture.debugElement.query(By.directive(MatSelect)).componentInstance;
 env.by(fixture, "vt-pagination vt-select .field").click();
 await env.settle(fixture);
 const panel = document.querySelector(".vt-select-panel");
 assert.ok(panel);
 assert.ok(panel.closest(".cdk-overlay-container"));
 assert.equal(panel.querySelector(".panel-search"), null);
 assert.equal(select._positions[0].originY, "top");
 assert.equal(select._positions[0].overlayY, "bottom");
 assert.ok(select._positions.some(position => position.originY === "bottom"));
 select.close();
 await env.settle(fixture);
});
const groupedRows = [
  { id: 'owner', name: 'Owner', children: [
    { id: 'child-1', name: 'Represented Anna' }, { id: 'child-2', name: 'Represented Jan' },
  ] },
  { id: 'other', name: 'Other', children: [] },
];
const relatedRows = row => row.children ?? [];

test('related records use native rows, shared columns and one selection per root group', async () => {
  const { fixture, table, clicks } = await createTable({ rows: groupedRows, relatedRows, selectable: true });
  assert.equal(env.all(fixture, 'tbody').length, 2);
  assert.deepEqual(env.all(fixture, 'tbody tr').map(row => row.cells.length), [3, 3, 3, 3]);
  assert.equal(env.by(fixture, 'tbody .selection-cell').rowSpan, 1);
  assert.equal(env.all(fixture, '.related-row .selection-cell[aria-hidden="true"]').length, 2);
  assert.equal(env.all(fixture, 'tbody.grouped .relation-cell').length, 3);
  assert.equal(env.all(fixture, 'tbody:not(.grouped) .relation-cell').length, 0);
  assert.equal(rowChecks(fixture).length, 2);
  await click(fixture, rowChecks(fixture)[0]);
  assert.deepEqual(table.selectedKeys(), ['owner']);
  assert.ok(env.by(fixture, 'tbody.selected .related-row'));
  await click(fixture, env.by(fixture, '.related-row td'));
  assert.equal(clicks[0], groupedRows[0].children[0]);
  await click(fixture, headerCheck(fixture));
  assert.deepEqual(table.selectedKeys(), ['owner', 'other']);
});

test('paging counts root groups and local search on a related row preserves its complete group', async () => {
  const { fixture } = await createTable({ rows: groupedRows, relatedRows, pagination: 'local', size: 1,
    searchMode: 'local', search: 'Represented Jan' });
  assert.equal(env.all(fixture, 'tbody tr').length, 3);
  assert.match(bodyText(fixture), /Owner.*Represented Anna.*Represented Jan/s);
  assert.equal(env.all(fixture, 'tbody').length, 1);
  assert.match(env.by(fixture, 'vt-pagination .range').textContent, /1–1 \/ 1/);
});

test('cell context identifies parent and child; nextCell follows the CRM sibling lanes without wrapping', async () => {
  const { fixture, table } = await createTable({ rows: groupedRows, relatedRows });
  const groups = table.viewRows();
  const root = groups[0].cells[0];
  const child = groups[0].related[0].cells[0];
  assert.equal(root.parent, null);
  assert.equal(root.childIndex, null);
  assert.equal(child.parent, groupedRows[0]);
  assert.equal(child.index, 0);
  assert.equal(child.childIndex, 0);
  assert.equal(table.nextCell(root).$implicit, groupedRows[1]);
  assert.equal(table.nextCell(child).$implicit, groupedRows[0].children[1]);
  assert.equal(table.nextCell(groups[0].related[1].cells[0]), null);
  assert.equal(table.nextCell(groups[1].cells[0]), null);
  fixture.componentRef.setInput('rows', groupedRows.map(row => ({ ...row })));
  await env.settle(fixture);
  assert.equal(table.nextCell(root), null, 'stale context must not address replacement rows');
  fixture.componentRef.setInput('disabled', true);
  await env.settle(fixture);
  assert.equal(table.nextCell(table.viewRows()[0].cells[0]), null);
});

test('related cell templates keep per-person actions and values, including uneven content', async () => {
  const { ng, ds, TestBed } = env;
  class Host {
    rows = groupedRows;
    related = relatedRows;
    columns = columns;
    actions = [];
  }
  ng.Component({ selector: 'test-related-host', imports: [ds.VoteyTableComponent, ds.VoteyTableCellDirective, ds.VoteyButtonComponent],
    template: `<vt-table #table label="Members" [rows]="rows" [columns]="columns" [relatedRows]="related">
      <ng-template vtTableCell="name" [vtTableCellOf]="table" let-row let-parent="parent" let-child="childIndex" let-index="index">
        <span class="relation">{{ parent?.id ?? 'root' }}:{{ child }}:{{ index }}</span>
        <vt-button [text]="row.name" (pressed)="actions.push(row.id)" />
      </ng-template></vt-table>` })(Host);
  TestBed.configureTestingModule({ imports: [Host] });
  const fixture = TestBed.createComponent(Host);
  await env.settle(fixture);
  assert.deepEqual(env.all(fixture, '.relation').map(node => node.textContent), ['root::0', 'owner:0:0', 'owner:1:0', 'root::1']);
  await click(fixture, env.all(fixture, 'tbody button')[1]);
  assert.deepEqual(fixture.componentInstance.actions, ['child-1']);
});

test('CDK reorder emits a copy of visible root groups, keeps related rows and rejects stale drags', async () => {
  const { CdkDrag, CdkDropList } = await import('@angular/cdk/drag-drop');
  const { fixture, table } = await createTable({ rows: groupedRows, relatedRows, reorderable: true });
  const events = [];
  table.rowReorder.subscribe(event => events.push(event));
  const listNode = fixture.debugElement.query(node => node.providerTokens.includes(CdkDropList));
  const dragNode = fixture.debugElement.query(node => node.providerTokens.includes(CdkDrag));
  const list = listNode.injector.get(CdkDropList);
  const item = dragNode.injector.get(CdkDrag);
  const event = { previousIndex: 0, currentIndex: 1, container: list, previousContainer: list, item, isPointerOverContainer: true };
  item.started.emit({ source: item });
  item.ended.emit({ source: item });
  list.dropped.emit(event);
  assert.equal(events.length, 1);
  assert.deepEqual(events[0], { row: groupedRows[0], rows: [groupedRows[1], groupedRows[0]], previousIndex: 0, currentIndex: 1 });
  assert.equal(groupedRows[0].id, 'owner', 'input is never mutated');
  assert.equal(env.all(fixture, 'tbody tr').length, 4);
  item.started.emit({ source: item });
  fixture.componentRef.setInput('rows', [...groupedRows]);
  await env.settle(fixture);
  list.dropped.emit(event);
  assert.equal(events.length, 1);
  item.started.emit({ source: item });
  fixture.componentRef.setInput('search', 'new remote context');
  await env.settle(fixture);
  list.dropped.emit(event);
  assert.equal(events.length, 1, 'changing the query cancels the drag even before new rows arrive');
  fixture.componentRef.setInput('disabled', true);
  await env.settle(fixture);
  item.started.emit({ source: item });
  list.dropped.emit(event);
  assert.equal(events.length, 1);
});

test('reorder handle supports keyboard and blocks boundary moves, row activation and disabled actions', async () => {
  const { fixture, table, clicks } = await createTable({ reorderable: true });
  const events = [];
  table.rowReorder.subscribe(event => events.push(event));
  const handle = env.by(fixture, 'tbody .drag-cell button');
  handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  assert.equal(events.length, 0);
  handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  assert.deepEqual(events[0].rows.map(row => row.id), ['b', 'a', 'c', 'd']);
  await click(fixture, handle);
  assert.deepEqual(clicks, []);
  fixture.componentRef.setInput('loading', true);
  await env.settle(fixture);
  handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  assert.equal(events.length, 1);
  assert.equal(env.all(fixture, 'thead th').length, 3);
  assert.equal(env.all(fixture, '.skeleton-row td').length, 15);
});
test('row configuration preserves data attributes, group boundaries and opt-in keyboard activation', async () => {
  const { fixture, clicks } = await createTable({ rows: groupedRows, relatedRows, rowKeyboardActivation: true,
    rowConfig: row => ({ tone: 'error', tooltip: 'Warning', attributes: { 'data-record': row.id }, groupAttributes: { 'data-group': row.id } }) });
  const root = env.by(fixture, 'tr[data-record="owner"]');
  assert.ok(root.classList.contains('row-error'));
  assert.equal(root.getAttribute('tabindex'), '0');
  assert.equal(env.by(fixture, 'tbody[data-group="owner"]').rows.length, 3);
  root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.equal(clicks[0], groupedRows[0]);
  fixture.componentRef.setInput('rowConfig', () => ({}));
  await env.settle(fixture);
  assert.equal(root.getAttribute('data-record'), null);
  assert.equal(env.by(fixture, 'tbody[data-group]'), null);
  fixture.componentRef.setInput('disabled', true);
  await env.settle(fixture);
  root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.equal(clicks.length, 1);
});

test('table control test ids survive rendering without adding row activation to control events', async () => {
  const { fixture, clicks } = await createTable({ selectable: true, reorderable: true, selectionDataCy: 'row-check', selectAllDataCy: 'all-check', reorderDataCy: 'row-drag', rowKeyboardActivation: true });
  assert.ok(env.by(fixture, 'thead [data-cy="all-check"] input'));
  assert.ok(env.by(fixture, 'tbody [data-cy="row-check"] input'));
  assert.ok(env.by(fixture, 'tbody [data-cy="row-drag"] button'));
  await click(fixture, env.by(fixture, 'tbody [data-cy="row-check"] input'));
  env.by(fixture, 'tbody [data-cy="row-drag"] button').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.deepEqual(clicks, []);
});

test("ordinary tables do not initialize CDK drag directives and toggling restores handles", async () => {
  const { fixture } = await createTable();
  assert.equal(env.by(fixture, '.cdk-drop-list'), null);
  assert.equal(env.by(fixture, '.cdk-drag'), null);
  fixture.componentRef.setInput('reorderable', true);
  await env.settle(fixture);
  assert.equal(env.all(fixture, 'tbody.cdk-drag').length, rows.length);
  fixture.componentRef.setInput('reorderable', false);
  await env.settle(fixture);
  assert.equal(env.by(fixture, '.cdk-drag'), null);
});

test("row configuration and related changes retain selection controls", async () => {
  const { fixture, table } = await createTable({ selectable: true });
  const control = table.viewRows()[0].control;
  const cells = table.viewRows()[0].cells;
  fixture.componentRef.setInput('rowConfig', () => ({ tone: 'error' }));
  await env.settle(fixture);
  assert.equal(table.viewRows()[0].control, control);
  assert.equal(table.viewRows()[0].cells, cells);
  fixture.componentRef.setInput('relatedRows', () => []);
  await env.settle(fixture);
  assert.equal(table.viewRows()[0].control, control);
});

test("search skips related lookup when parent matches", async () => {
  let calls = 0;
  const { fixture } = await createTable({ rows: [rows[0]], searchMode: 'local', search: 'Anna', relatedRows: () => { calls++; return []; } });
  calls = 0;
  fixture.componentRef.setInput('search', 'Ann');
  await env.settle(fixture);
  assert.equal(calls, 1, "only rendering reads related rows; matching the parent skips the search lookup");
  assert.match(bodyText(fixture), /Anna/);
});
