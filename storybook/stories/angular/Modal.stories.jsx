import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";

function ModalPreview(props) {
  const host = useRef(null);
  const runtime = useRef(null);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let mounted = true;
    async function mount() {
      await import("@angular/compiler");
      const [ng, platform, forms, ds, rx] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
        import("@pleodigital/design-system-votey/angular"),
        import("rxjs"),
      ]);
      class DemoContent {
        ref = ng.inject(ds.VoteyModalRef);
        control = new forms.FormControl("", {
          nonNullable: true,
          validators: forms.Validators.required,
        });
        failed = ng.signal(false);
        data = ng.inject(ds.VOTEY_MODAL_DATA);
        timer;
        ngOnInit() {
          this.ref.updateActions({
            confirmText: "Zapisz",
            cancelText: "Anuluj",
            busyText: "Zapisywanie…",
            confirmDisabled: this.data.confirmDisabled,
            onConfirm: () => this.save(),
            thirdActionText: this.data.thirdActionText,
            onThirdAction: () => this.control.reset(),
          });
        }
        save() {
          if (this.control.invalid || this.ref.busy()) {
            this.control.markAsTouched();
            return;
          }
          return rx.timer(700).pipe(
            rx.tap(() => {
              if (this.data.failSave) this.failed.set(true);
              else void this.ref.close(this.control.value);
            })
          );
        }
        saveCustom() {
          if (this.control.invalid || this.ref.busy()) {
            this.control.markAsTouched();
            return;
          }
          this.ref.setBusy(true);
          this.timer = setTimeout(() => {
            this.ref.setBusy(false);
            if (this.data.failSave) this.failed.set(true);
            else void this.ref.close(this.control.value);
          }, 700);
        }
        ngOnDestroy() {
          clearTimeout(this.timer);
        }
      }
      ng.Component({
        selector: "vt-modal-demo-content",
        standalone: true,
        imports: [ds.VoteyInputComponent, ds.VoteyButtonComponent],
        template: `
          <vt-input label="Nazwa" [control]="control" />
          @if (failed()) { <p role="alert">Zapis nie powiódł się. Dane pozostały w formularzu.</p> }
          @if (data.longContent) { @for (line of data.lines; track line) { <p>Wiersz {{ line }} — przewijana treść modala.</p> } }
          @if (data.hideModalActions && ref.busy()) { <p role="status">Zapisywanie…</p> }
          @if (data.hideModalActions) {
            <div class="custom-actions">
              <vt-button text="Anuluj" variant="secondary" [disabled]="ref.busy()" (pressed)="ref.close(undefined, 'cancel')" />
              <vt-button text="Zapisz" [disabled]="ref.busy()" (pressed)="saveCustom()" />
            </div>
          }`,
        styles: `:host { display: block; .custom-actions { display: flex; flex-wrap: wrap; gap: var(--space-gap-s); margin-top: var(--space-inset-l); } }`,
      })(DemoContent);
      const app = await platform.createApplication({
        providers: [ds.provideVoteySvgRegistry()],
      });
      if (!mounted) {
        app.destroy();
        return;
      }
      const service = app.injector.get(ds.VoteyModalService);
      const button = document.createElement("button");
      button.textContent = "Otwórz modal";
      button.onclick = () => {
        const args = latest.current;
        const config = {
          title: args.title,
          description: args.description,
          size: args.size,
          closeLabel: "Zamknij",
          showCloseButton: args.showCloseButton,
          closeOnBackdrop: args.closeOnBackdrop,
          closeOnEscape: args.closeOnEscape,
          autoFocus: args.autoFocus,
          closeOnNavigation: false,
          confirmText: args.confirmText,
          cancelText: args.cancelText,
          thirdActionText: args.thirdActionText,
          hideModalActions: args.hideModalActions,
          confirmDisabled: args.confirmDisabled,
        };
        const ref =
          args.mode === "confirmation"
            ? service.confirm({
                ...config,
                message: "Czy chcesz kontynuować?",
                confirmVariant: args.danger ? "danger" : "primary",
                onConfirm: (modal) => {
                  void modal.close(true);
                },
                onThirdAction: (modal) => {
                  void modal.close("third");
                },
              })
            : service.open(DemoContent, {
                ...config,
                data: {
                  failSave: args.failSave,
                  hideModalActions: args.hideModalActions,
                  confirmDisabled: args.confirmDisabled,
                  thirdActionText: args.thirdActionText,
                  longContent: args.longContent,
                  lines: Array.from({ length: 35 }, (_, i) => i + 1),
                },
              });
        ref.closed.subscribe((result) => latest.current.onClose(result));
      };
      host.current.replaceChildren(button);
      runtime.current = { app };
    }
    void mount();
    return () => {
      mounted = false;
      runtime.current?.app.destroy();
      runtime.current = null;
    };
  }, []);
  return <div ref={host} />;
}

export default {
  title: "ANGULAR COMPONENTS/Modal",
  component: ModalPreview,
  parameters: { layout: "padded" },
  args: {
    title: "Przykładowe okno",
    description: "Wspólna rama dialogów Votey",
    size: "standard",
    mode: "confirmation",
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    autoFocus: "first-heading",
    danger: false,
    confirmText: "Potwierdź",
    cancelText: "Anuluj",
    thirdActionText: "",
    confirmDisabled: false,
    hideModalActions: false,
    failSave: false,
    longContent: false,
    onClose: fn(),
  },
  argTypes: {
    size: { control: "select", options: ["small", "standard", "wide"] },
    mode: { control: "select", options: ["confirmation", "form"] },
    autoFocus: {
      control: "select",
      options: ["first-heading", "first-tabbable", "dialog"],
    },
  },
};
export const Playground = {};
