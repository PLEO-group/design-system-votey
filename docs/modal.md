# Angular modal

Public import: `@pleodigital/design-system-votey/angular`.
One `VoteyModalComponent` owns the frame, message, dynamic content, actions, busy
state and close guard. `VoteyModalService` manages CDK overlays and instances.
`VoteyModalRef<TResult>` is a small communication handle, not the state owner.

## Open and handle actions

```ts
const ref = modalService.confirm<boolean>({
  title: "Delete item?",
  message: "This action cannot be undone.",
  confirmText: "Delete",
  cancelText: "Cancel",
  confirmVariant: "danger",
  onConfirm: (modal) => {
    void modal.close(true);
  },
});
ref.closed.subscribe(({ reason, value }) => {
  /* handle the typed result */
});
```

For domain content use `open<TData, TResult>(ComponentOrTemplate, config)`.
Components inject `VOTEY_MODAL_DATA` and `VoteyModalRef<TResult>`; template content
receives `let-data` and `let-modal="modal"`. Signal inputs are not assigned implicitly.
Use existing translation keys via Votey's translator; literals above illustrate API.

`confirmText`/`onConfirm`, `cancelText`/`onCancel`, and optional
`thirdActionText`/`onThirdAction` cover the standard footer. Confirm and third action
never auto-close. Cancel closes by default; a provided callback takes over.
Backdrop, Escape and close button do not call onCancel. Confirm without a handler
is disabled. Third action needs both text and callback. Empty labels hide buttons.

For custom actions use `hideModalActions: true` and place the action bar directly
in domain content. There is no actions directive or footer TemplateRef contract.

Content can call `ref.updateActions({ onConfirm: () => this.save(),
confirmDisabled: this.invalid, busy: this.savePending, busyText: "LABEL.SAVING" })`.
`invalid` and `savePending` here must be reactive signals. Config callbacks can use
an optional modal argument. Callbacks accept `void | Observable<unknown> | Promise<unknown>`.
Prefer returning a finite Observable for Angular HTTP requests: the modal subscribes
once, stays pending until completion/error, and unsubscribes on destruction.
Keep Promise support for external APIs that naturally return promises. No action
auto-closes on completion; explicitly close only after confirmed domain success.

## Requests and lifecycle

Bind an existing busy signal as the sole source, or use manual `setBusy` when no
request state exists. Combining setBusy with a bound source throws. Clear manual
busy, or finish the bound request state, before closing on success. Promise-based
or Observable callbacks may explicitly close after success without manually setting busy.
Do not close on failure: preserve form values, report a local error and permit retry.
Unexpected callback/guard exceptions go to Angular ErrorHandler and release pending
state. Expected API errors require consumer handling. With a custom footer, content
owns its loader and disabled rules. Busy does not automatically disable body fields.

`closed` emits once and replays its result to late subscribers. The result is
`{ reason, value }`; reasons are action, cancel, close-button, backdrop, escape and
navigation. `close` returns Promise<boolean>; false means blocked, already closed or
vetoed by beforeClose. Async close guards reject concurrent dismissal requests.
Forced framework teardown bypasses the guard and reports navigation if no accepted
result exists. closeOnNavigation observes URL changes; it is not a CanDeactivate
router guard. Use a router guard to prevent losing a dirty route.

Sizes are small 40vw, standard 55vw and wide 75vw. At viewport widths up to
768px all sizes use 92vw; the overlay is constrained to 92vw.
CDK owns focus trapping/restoration, background scroll lock and outside accessibility.
The CDK container, frame host and heading suppress their own focus outlines. The
container override is scoped to `votey-modal-overlay` because the container sits
outside the content component; control focus indicators remain unchanged.
aria-modal uses CDK's default so nested select/picker overlays remain accessible.
Include CDK overlay structural CSS, as already required by Angular Material.
Explicit duplicate IDs throw; getById lets the caller prevent duplicate openings.
No implicit closeAll is exposed. Styling uses existing Votey tokens and the CRM
visual baseline, without claiming Figma pixel-perfect fidelity.

The mandatory implementation and review recipe is maintained in
[the modal skill reference](../skills/votey-design-system/references/angular-modal.md).
Preview: ANGULAR COMPONENTS/Modal, Playground. Verify with Angular build,
`node --test tests/modal-dom.test.js`, package tests and Storybook browser checks.

Selektory E2E standardowych akcji: `confirmDataCy`, `cancelDataCy` i `thirdActionDataCy`. Są opcjonalne i można je zmieniać przez `updateActions`.

`dataCy` ustawia selektor ramy oraz pochodne selektory `-title`, `-content` i `-footer`.

Closing destroys the action subscription. Do not put required result handling in
operators after close; update state before closing or handle `closed` in the parent.
