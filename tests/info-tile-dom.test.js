const assert = require("node:assert/strict");
const { test, before, after, afterEach } = require("node:test");
let env;
before(async () => { env = await import("./helpers/angular-dom.mjs"); });
afterEach(() => env.TestBed.resetTestingModule());
after(() => env.dispose());

async function createTile(inputs = {}) {
  env.TestBed.configureTestingModule({ imports: [env.ds.VoteyInfoTileComponent] });
  const fixture = env.TestBed.createComponent(env.ds.VoteyInfoTileComponent);
  for (const [key, value] of Object.entries({ title: "Summary", ...inputs })) {
    fixture.componentRef.setInput(key, value);
  }
  await env.settle(fixture);
  return fixture;
}

test("info tile renders arbitrary data including zero and escapes text", async () => {
  const fixture = await createTile({
    title: "<b>Summary</b>",
    items: [{ id: "count", icon: "ui-search", value: 0 }],
  });
  assert.equal(env.by(fixture, "article").getAttribute("aria-label"), "<b>Summary</b>");
  assert.equal(env.by(fixture, ".title").textContent.trim(), "<b>Summary</b>");
  assert.equal(env.by(fixture, ".title b"), null);
  assert.equal(env.by(fixture, ".value").textContent.trim(), "0");
  assert.equal(env.by(fixture, ".icon mat-icon").getAttribute("data-mat-icon-name"), "ui-search");
  assert.equal(env.by(fixture, ".icon").getAttribute("aria-hidden"), "true");
});

test("info tile updates title, row icons, values and count through inputs", async () => {
  const fixture = await createTile({ items: [{ id: "one", icon: "ui-search", value: "First" }] });
  fixture.componentRef.setInput("title", "Updated");
  fixture.componentRef.setInput("items", [
    { id: "two", icon: "ui-close", value: "Second" },
    { id: "three", icon: "ui-search", value: "Third" },
  ]);
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".title").textContent.trim(), "Updated");
  assert.deepEqual(env.all(fixture, ".value").map(node => node.textContent.trim()), ["Second", "Third"]);
  assert.equal(env.by(fixture, ".icon mat-icon").getAttribute("data-mat-icon-name"), "ui-close");
  fixture.componentRef.setInput("items", []);
  await env.settle(fixture);
  assert.equal(env.by(fixture, "ul"), null);
});

test("running decoration and translated status label react to input changes", async () => {
  const fixture = await createTile({ state: "running", statusLabel: "Active" });
  assert.ok(env.by(fixture, ".tile.running"));
  assert.equal(env.by(fixture, ".status").textContent, "Active");
  fixture.componentRef.setInput("statusLabel", "");
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".status"), null);
  fixture.componentRef.setInput("state", "default");
  fixture.componentRef.setInput("statusLabel", "Active");
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".tile.running"), null);
  assert.equal(env.by(fixture, ".status"), null);
  assert.equal(env.by(fixture, ".illustration"), null);
});

test("illustration uses the supplied registry name and can be replaced or removed", async () => {
  const { MatIconRegistry } = await import("@angular/material/icon");
  const { DomSanitizer } = await import("@angular/platform-browser");
  env.TestBed.configureTestingModule({ imports: [env.ds.VoteyInfoTileComponent] });
  const registry = env.TestBed.inject(MatIconRegistry);
  const sanitizer = env.TestBed.inject(DomSanitizer);
  for (const name of ["bg-event-type-basic", "bg-one-time-voting"]) {
    registry.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140"><path d="M0 0h20v20H0z"/></svg>'));
  }
  const fixture = env.TestBed.createComponent(env.ds.VoteyInfoTileComponent);
  fixture.componentRef.setInput("title", "Custom illustration");
  fixture.componentRef.setInput("illustration", "bg-event-type-basic");
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".illustration mat-icon").getAttribute("data-mat-icon-name"), "bg-event-type-basic");
  fixture.componentRef.setInput("illustration", "bg-one-time-voting");
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".illustration mat-icon").getAttribute("data-mat-icon-name"), "bg-one-time-voting");
  fixture.componentRef.setInput("illustration", "");
  await env.settle(fixture);
  assert.equal(env.by(fixture, ".illustration"), null);
  assert.equal(env.by(fixture, ".has-illustration"), null);
});

test("all public states preserve content and update the badge without leaving stale state classes", async () => {
  const fixture = await createTile({
    items: [{ id: "count", icon: "ui-search", value: 0 }],
    statusLabel: "Consumer label",
  });
  assert.deepEqual(env.ds.VoteyInfoTileStates, ["default", "running", "completed", "test", "not-launched", "scheduled"]);
  for (const state of [...env.ds.VoteyInfoTileStates, "default"]) {
    fixture.componentRef.setInput("state", state);
    await env.settle(fixture);
    const tile = env.by(fixture, ".tile");
    assert.deepEqual(env.ds.VoteyInfoTileStates.filter(name => tile.classList.contains(name)), [state]);
    assert.equal(env.by(fixture, ".title").textContent.trim(), "Summary");
    assert.equal(env.by(fixture, ".value").textContent.trim(), "0");
    assert.equal(env.by(fixture, ".status")?.textContent ?? null, state === "default" ? null : "Consumer label");
    assert.equal(tile.hasAttribute("aria-disabled"), false);
  }
});

test("added states omit empty labels and reflect label changes", async () => {
  const fixture = await createTile();
  for (const state of ["completed", "test", "not-launched", "scheduled"]) {
    fixture.componentRef.setInput("state", state);
    fixture.componentRef.setInput("statusLabel", "");
    await env.settle(fixture);
    assert.equal(env.by(fixture, ".status"), null);
    fixture.componentRef.setInput("statusLabel", "Updated label");
    await env.settle(fixture);
    assert.equal(env.by(fixture, ".status").textContent, "Updated label");
  }
});
