const assert = require("node:assert/strict");
const { test, before, after, afterEach } = require("node:test");
let env;
before(async () => {
  env = await import("./helpers/angular-dom.mjs");
});
afterEach(() => env.TestBed.resetTestingModule());
after(() => env.dispose());

test("confirm stays open until the callback explicitly closes; cancel closes by default", async () => {
  let confirmed = 0;
  const { panel, ref, fixture } = await open({
    onConfirm: () => {
      confirmed++;
    },
  });
  panel.querySelectorAll("footer button")[1].click();
  await env.settle(fixture);
  assert.equal(confirmed, 1);
  assert.equal(document.querySelectorAll("cdk-dialog-container").length, 1);
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  panel.querySelectorAll("footer button")[0].click();
  assert.deepEqual(results, [{ value: undefined, reason: "cancel" }]);
});

test("the title uses a level-three heading with its matching typography and stable selector", async () => {
  const { panel, ref } = await open({ id: "heading", dataCy: "heading-modal" });
  const heading = panel.querySelector("h3");
  assert.ok(heading);
  assert.equal(heading.id, ref.id + "-title");
  assert.equal(heading.getAttribute("data-cy"), "heading-modal-title");
  assert.equal(heading.querySelector("vt-text").getAttribute("variant"), "h3");
  assert.equal(panel.querySelector("h2"), null);
});

test("custom cancel takes ownership while dismiss never invokes its callback", async () => {
  let cancelled = 0;
  const { panel, ref, fixture } = await open({
    onCancel: () => {
      cancelled++;
    },
  });
  panel.querySelector("footer button").click();
  await env.settle(fixture);
  assert.equal(cancelled, 1);
  assert.equal(document.querySelectorAll("cdk-dialog-container").length, 1);
  panel.querySelector("header button").click();
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  assert.equal(results[0].reason, "close-button");
  assert.equal(cancelled, 1);
});

test("optional third action has its own callback and can return a distinct result", async () => {
  const { panel, ref } = await open({
    thirdActionText: "Discard",
    onThirdAction: (modal) => {
      void modal.close("discard");
    },
  });
  assert.equal(panel.querySelectorAll("footer button").length, 3);
  panel.querySelector("footer button").click();
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  assert.equal(results[0].value, "discard");
});

test("Promise action locks duplicate clicks and dismissal but permits explicit close on success", async () => {
  let resolve;
  let attempts = 0;
  const gate = new Promise((done) => {
    resolve = done;
  });
  const { panel, ref, fixture } = await open({
    busyText: "Saving",
    onConfirm: async (modal) => {
      attempts++;
      await gate;
      await modal.close("saved");
    },
  });
  const button = panel.querySelectorAll("footer button")[1];
  button.click();
  button.click();
  await env.settle(fixture);
  assert.equal(attempts, 1);
  assert.equal(button.disabled, true);
  assert.match(panel.querySelector('[role="status"]').textContent, /Saving/);
  assert.equal(await ref.close(undefined, "escape"), false);
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  resolve();
  await env.settle(fixture);
  assert.equal(results[0].value, "saved");
});

test("rejected Promise action leaves content and permits retry without a stuck loader", async () => {
  const errors = [];
  env.TestBed.configureTestingModule({
    providers: [
      {
        provide: env.ng.ErrorHandler,
        useValue: { handleError: (error) => errors.push(error) },
      },
    ],
  });
  const { panel, fixture } = await open({
    onConfirm: async () => {
      throw new Error("Save failed");
    },
  });
  panel.querySelectorAll("footer button")[1].click();
  await env.settle(fixture);
  assert.equal(errors[0].message, "Save failed");
  assert.match(panel.querySelector(".body").textContent, /Keep data/);
  assert.equal(panel.querySelectorAll("footer button")[1].disabled, false);
  assert.equal(panel.querySelector('[role="status"]'), null);
});

test("existing request and form signals drive busy/disabled without a second state owner", async () => {
  const busy = env.ng.signal(false);
  const invalid = env.ng.signal(true);
  const { panel, ref, fixture } = await open({
    busy,
    confirmDisabled: invalid,
  });
  assert.equal(panel.querySelectorAll("footer button")[1].disabled, true);
  invalid.set(false);
  busy.set(true);
  await env.settle(fixture);
  assert.equal(panel.querySelector("header button").disabled, true);
  assert.equal(await ref.close(true), false);
  assert.throws(() => ref.setBusy(false), /bound busy signal/);
  busy.set(false);
  await env.settle(fixture);
  assert.equal(panel.querySelectorAll("footer button")[1].disabled, false);
  await ref.close(true);
});

test("hideModalActions removes the built-in footer and permits a content-owned bar", async () => {
  const { ng, TestBed, ds, settle } = env;
  class CustomContent {
    ref = ng.inject(ds.VoteyModalRef);
  }
  ng.Component({
    selector: "vt-custom-actions",
    standalone: true,
    template:
      '<button class="domain-action" (click)="ref.close(42)">Custom save</button>',
  })(CustomContent);
  class Host {}
  ng.Component({
    selector: "vt-test-custom-host",
    standalone: true,
    template: "",
  })(Host);
  const fixture = TestBed.createComponent(Host);
  await settle(fixture);
  const ref = TestBed.inject(ds.VoteyModalService).open(CustomContent, {
    title: "Custom",
    hideModalActions: true,
    confirmText: "Hidden",
  });
  await settle(fixture);
  assert.equal(document.querySelector("cdk-dialog-container footer"), null);
  document.querySelector(".domain-action").click();
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  assert.equal(results[0].value, 42);
});

test("a result handler can immediately reopen the same ID after disposal", async () => {
  const { ref, service } = await open({ id: "reopen" });
  let next;
  ref.closed.subscribe(() => {
    next = service.confirm({ title: "Again", id: "reopen" });
  });
  await ref.close();
  assert.equal(service.getById("reopen"), next);
  await next.close();
});

test("template content keeps parent signals, data and its typed close context", async () => {
  const { ng, ds, TestBed, settle } = env;
  class TemplateOwner {
    content;
    label = ng.signal("First");
  }
  ng.ViewChild("body", { static: true })(TemplateOwner.prototype, "content");
  ng.Component({
    selector: "vt-template-owner",
    standalone: true,
    template: `
    <ng-template #body let-data let-modal="modal">
      <p class="domain-value">{{ label() }}: {{ data.name }}</p>
      <button (click)="modal.close(data.name)">Finish</button>
    </ng-template>`,
  })(TemplateOwner);
  const fixture = TestBed.createComponent(TemplateOwner);
  await settle(fixture);
  const ref = TestBed.inject(ds.VoteyModalService).open(
    fixture.componentInstance.content,
    {
      title: "Template",
      data: { name: "Typed data" },
    }
  );
  await settle(fixture);
  fixture.componentInstance.label.set("Updated");
  await settle(fixture);
  assert.equal(
    document.querySelector(".domain-value").textContent,
    "Updated: Typed data"
  );
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  document.querySelector("cdk-dialog-container .body button").click();
  assert.deepEqual(results, [{ value: "Typed data", reason: "action" }]);
});

test("navigation requests use the close guard and remove their listener on disposal", async () => {
  const { Location } = await import("@angular/common");
  let listener;
  let removed = false;
  env.TestBed.configureTestingModule({
    providers: [
      {
        provide: Location,
        useValue: {
          onUrlChange(callback) {
            listener = callback;
            return () => {
              removed = true;
            };
          },
        },
      },
    ],
  });
  const { ref } = await open();
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  listener();
  assert.equal(results[0].reason, "navigation");
  assert.equal(removed, true);
});

test("a failed close guard reports the error and keeps the modal usable", async () => {
  const errors = [];
  env.TestBed.configureTestingModule({
    providers: [
      {
        provide: env.ng.ErrorHandler,
        useValue: { handleError: (error) => errors.push(error) },
      },
    ],
  });
  const { ref } = await open({
    beforeClose: () => {
      throw new Error("Guard failed");
    },
  });
  assert.equal(await ref.close(), false);
  assert.equal(errors[0].message, "Guard failed");
  assert.equal(ref.closing(), false);
  assert.equal(document.querySelectorAll("cdk-dialog-container").length, 1);
});

async function open(config = {}) {
  const { TestBed, ds, settle } = env;
  class Host {}
  env.ng.Component({
    selector: "vt-test-host",
    standalone: true,
    template: "",
  })(Host);
  const fixture = TestBed.createComponent(Host);
  await settle(fixture);
  const service = TestBed.inject(ds.VoteyModalService);
  const ref = service.confirm({
    title: "Delete?",
    message: "Keep data on failure",
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmVariant: "danger",
    onConfirm: (modal) => {
      void modal.close(true);
    },
    ...config,
  });
  await settle(fixture);
  return {
    fixture,
    service,
    ref,
    panel: document.querySelector("cdk-dialog-container"),
  };
}

test("confirmation uses the common frame, labelled dialog and fixed action footer", async () => {
  const { panel, ref, fixture } = await open();
  assert.equal(panel.getAttribute("role"), "dialog");
  assert.equal(panel.getAttribute("aria-label"), "Delete?");
  assert.match(panel.querySelector("h3").textContent, /Delete/);
  assert.equal(panel.querySelectorAll("footer button").length, 2);
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  panel.querySelectorAll("footer button")[1].click();
  await env.settle(fixture);
  assert.deepEqual(results, [{ value: true, reason: "action" }]);
  assert.equal(document.querySelector("cdk-dialog-container"), null);
});

test("backdrop and Escape have independent policies; busy prevents dismissal", async () => {
  const { fixture, panel, ref } = await open({
    closeOnBackdrop: false,
    closeOnEscape: true,
  });
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  document.querySelector(".cdk-overlay-backdrop").click();
  assert.equal(results.length, 0);
  ref.setBusy(true);
  panel.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
  );
  await env.settle(fixture);
  assert.equal(results.length, 0);
  assert.equal(panel.querySelector("header button").disabled, true);
  ref.setBusy(false);
  panel.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
  );
  await env.settle(fixture);
  assert.equal(results[0].reason, "escape");
});

test("async close guard prevents concurrent attempts and can reject without losing the dialog", async () => {
  let resolve;
  let attempts = 0;
  const { ref, service } = await open({
    id: "guarded",
    beforeClose: () => {
      attempts++;
      return new Promise((done) => {
        resolve = done;
      });
    },
  });
  const first = ref.close(true);
  assert.equal(await ref.close(false), false);
  assert.equal(attempts, 1);
  resolve(false);
  assert.equal(await first, false);
  assert.equal(service.getById("guarded"), ref);
  const second = ref.close(false, "cancel");
  resolve(true);
  assert.equal(await second, true);
  assert.equal(service.getById("guarded"), undefined);
});

test("duplicate IDs fail explicitly and closing one modal leaves another open", async () => {
  const { service, ref } = await open({ id: "first" });
  assert.throws(
    () =>
      service.confirm({
        id: "first",
        title: "Duplicate",
        message: "",
        hideModalActions: true,
      }),
    /already open/
  );
  const second = service.confirm({
    id: "second",
    title: "Second",
    message: "",
    hideModalActions: true,
  });
  await ref.close();
  assert.equal(service.getById("second"), second);
  assert.equal(document.querySelectorAll("cdk-dialog-container").length, 1);
  await second.close();
});

test("action selectors are preserved and can be updated", async () => {
  const { panel, ref, fixture } = await open({
    confirmDataCy: "save",
    cancelDataCy: "cancel",
    thirdActionDataCy: "extra",
    thirdActionText: "Extra",
    onThirdAction: () => {},
  });
  assert.ok(panel.querySelector('[data-cy="save"] button'));
  assert.ok(panel.querySelector('[data-cy="cancel"] button'));
  assert.ok(panel.querySelector('[data-cy="extra"] button'));
  ref.updateActions({ confirmDataCy: "retry" });
  await env.settle(fixture);
  assert.ok(panel.querySelector('[data-cy="retry"] button'));
  assert.equal(panel.querySelector('[data-cy="save"]'), null);
});

for (const action of ["onConfirm", "onCancel", "onThirdAction"]) {
  test(
    action +
      " subscribes once, stays busy through emissions and releases on completion",
    async () => {
      const { Subject } = await import("rxjs");
      const pending = new Subject();
      let calls = 0;
      const { panel, ref, fixture } = await open({
        thirdActionText: "Extra",
        [action]: () => {
          calls++;
          return pending;
        },
      });
      const index =
        action === "onThirdAction" ? 0 : action === "onCancel" ? 1 : 2;
      // Supply the third callback so the same button order is used for all actions.
      if (action !== "onThirdAction")
        ref.updateActions({ onThirdAction: () => {} });
      await env.settle(fixture);
      const button = panel.querySelectorAll("footer button")[index];
      button.click();
      button.click();
      await env.settle(fixture);
      assert.equal(calls, 1);
      assert.equal(ref.busy(), true);
      assert.equal(await ref.close(undefined, "escape"), false);
      pending.next("progress");
      await env.settle(fixture);
      assert.equal(ref.busy(), true);
      pending.complete();
      await env.settle(fixture);
      assert.equal(ref.busy(), false);
      assert.equal(document.querySelectorAll("cdk-dialog-container").length, 1);
    }
  );
}

test("Observable failure reports once and permits retry", async () => {
  const { Subject } = await import("rxjs");
  const pending = new Subject();
  const errors = [];
  env.TestBed.configureTestingModule({
    providers: [
      {
        provide: env.ng.ErrorHandler,
        useValue: { handleError: (e) => errors.push(e) },
      },
    ],
  });
  let calls = 0;
  const { panel, ref, fixture } = await open({
    onConfirm: () => {
      calls++;
      return pending;
    },
  });
  panel.querySelectorAll("footer button")[1].click();
  pending.error(new Error("failed"));
  await env.settle(fixture);
  assert.equal(errors.length, 1);
  assert.equal(ref.busy(), false);
  ref.updateActions({
    onConfirm: () => {
      calls++;
    },
  });
  panel.querySelectorAll("footer button")[1].click();
  assert.equal(calls, 2);
});

test("destroying the dialog cancels its action subscription", async () => {
  const { Observable } = await import("rxjs");
  let cleaned = 0;
  const { panel, ref } = await open({
    onConfirm: () =>
      new Observable(() => () => {
        cleaned++;
      }),
  });
  panel.querySelectorAll("footer button")[1].click();
  assert.equal(ref.busy(), true);
  env.TestBed.resetTestingModule();
  assert.equal(cleaned, 1);
});

test("synchronous Observable success can explicitly close and executes teardown once", async () => {
  const { Observable } = await import("rxjs");
  let cleaned = 0;
  const { panel, ref, fixture } = await open({
    onConfirm: (modal) =>
      new Observable((subscriber) => {
        void modal.close(true);
        subscriber.complete();
        return () => {
          cleaned++;
        };
      }),
  });
  const results = [];
  ref.closed.subscribe((result) => results.push(result));
  panel.querySelectorAll("footer button")[1].click();
  await env.settle(fixture);
  assert.equal(results[0].value, true);
  assert.equal(cleaned, 1);
  assert.equal(ref.busy(), false);
});

test("a callback can check ref.busy before starting its own request", async () => {
  const { Subject } = await import("rxjs");
  const pending = new Subject();
  let started = false;
  const { panel, ref, fixture } = await open({
    onConfirm: (modal) => {
      if (modal.busy()) return;
      started = true;
      return pending;
    },
  });
  panel.querySelectorAll("footer button")[1].click();
  await env.settle(fixture);
  assert.equal(started, true);
  assert.equal(ref.busy(), true);
  pending.complete();
  await env.settle(fixture);
  assert.equal(ref.busy(), false);
});
