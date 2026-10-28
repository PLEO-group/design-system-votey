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
const bodyText = fixture => env.by(fixture, "tbody").textContent;
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
  const { fixture } = await createTable({ searchMode: "local", paginated: true, page: 2, size: 2,
    rows: [...rows, { id: "e", name: "Eva" }] });
  assert.match(bodyText(fixture), /Eva/);
  fixture.componentRef.setInput("rows", rows.slice(0, 1));
  await env.settle(fixture);
  assert.match(bodyText(fixture), /Anna/);
  assert.match(env.by(fixture, "vt-pagination .range").textContent, /1–1 \/ 1/);
  assert.equal(env.by(fixture, "vt-pagination .page-button.selected").textContent.trim(), "1");
});

test("real paginator emits controlled zero-based query and keeps selection", async () => {
  const { fixture, queries, table } = await createTable({ paginated: true, size: 10, totalElements: 40,
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
  fixture.componentRef.setInput("paginated", true);
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
