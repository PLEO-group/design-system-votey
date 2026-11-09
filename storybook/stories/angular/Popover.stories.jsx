import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";
import "@angular/compiler";
import {
  VoteyButtonSizes,
  VoteyButtonVariants,
  VoteyPopoverPlacements,
} from "@pleodigital/design-system-votey/angular";

function PopoverPreview(props) {
  const host = useRef(null);
  const runtime = useRef(null);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let mounted = true;
    async function mount() {
      await import("@angular/compiler");
      const [ng, platform, forms, ds] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
        import("@pleodigital/design-system-votey/angular"),
      ]);
      class PreviewHost {
        ariaLabel = "Filtry";
        triggerText = "Filtry";
        triggerIcon = "ui-filter";
        openIcon = "";
        triggerVariant = "secondary";
        triggerSize = "small";
        placement = "bottom-end";
        disabled = false;
        badge = null;
        status = new forms.FormControl(false, { nonNullable: true });
        openedChange = new ng.EventEmitter();
        applied = new ng.EventEmitter();
      }
      ng.Component({
        selector: "vt-popover-preview",
        standalone: true,
        imports: [
          ds.VoteyPopoverComponent,
          ds.VoteyPopoverContentDirective,
          ds.VoteyCheckboxComponent,
          ds.VoteyButtonComponent,
        ],
        inputs: [
          "ariaLabel",
          "triggerText",
          "triggerIcon",
          "openIcon",
          "triggerVariant",
          "triggerSize",
          "placement",
          "disabled",
          "badge",
        ],
        template: `<vt-popover [ariaLabel]="ariaLabel" [triggerText]="triggerText" [triggerIcon]="triggerIcon" [openIcon]="openIcon" [triggerVariant]="triggerVariant" [triggerSize]="triggerSize" [placement]="placement" [disabled]="disabled" [badge]="badge" (openedChange)="openedChange.emit($event)">
          <ng-template vtPopoverContent let-close="close">
            <form class="filters" (submit)="$event.preventDefault(); applied.emit(status.value); close()">
              <vt-checkbox [control]="status">Tylko aktywne</vt-checkbox>
              <vt-button text="Zastosuj" type="submit" />
              <vt-button text="Anuluj" variant="secondary" (pressed)="close()" />
            </form>
          </ng-template>
        </vt-popover>`,
        styles: [
          `.filters { display: flex; flex-direction: column; gap: var(--space-card-gap); padding: var(--space-section-gap); min-width: 240px; }`,
        ],
      })(PreviewHost);
      const app = await platform.createApplication({
        providers: [ds.provideVoteySvgRegistry()],
      });
      if (!mounted || !host.current) {
        app.destroy();
        return;
      }
      const element = document.createElement("vt-popover-preview");
      host.current.replaceChildren(element);
      const ref = ng.createComponent(PreviewHost, {
        environmentInjector: app.injector,
        hostElement: element,
      });
      const subscriptions = [
        ref.instance.openedChange.subscribe((value) =>
          latest.current.onOpenedChange(value)
        ),
        ref.instance.applied.subscribe((value) =>
          latest.current.onApplied(value)
        ),
      ];
      const update = () => {
        for (const key of [
          "ariaLabel",
          "triggerText",
          "triggerIcon",
          "openIcon",
          "triggerVariant",
          "triggerSize",
          "placement",
          "disabled",
          "badge",
        ])
          ref.setInput(key, latest.current[key]);
        app.tick();
      };
      app.attachView(ref.hostView);
      runtime.current = {
        update,
        destroy() {
          subscriptions.forEach((s) => s.unsubscribe());
          app.detachView(ref.hostView);
          ref.destroy();
          app.destroy();
        },
      };
      update();
    }
    void mount();
    return () => {
      mounted = false;
      runtime.current?.destroy();
      runtime.current = null;
    };
  }, []);
  useEffect(() => runtime.current?.update(), [props]);
  return <div ref={host} />;
}

export default {
  title: "ANGULAR COMPONENTS/Popover",
  tags: ["autodocs"],
  component: PopoverPreview,
  parameters: {
    layout: "centered",
    docs: {
      source: {
        language: "html",
        code: '<vt-popover ariaLabel="Filtry" triggerText="Filtry" triggerIcon="ui-filter">\n  <ng-template vtPopoverContent let-close="close">\n    <vt-button text="Zastosuj" (pressed)="applyFilters(); close()" />\n  </ng-template>\n</vt-popover>',
      },
      description: {
        component: `Wspólna baza dla paneli otwieranych przyciskiem. Używa vt-button oraz MatMenu, dopasowuje pozycję do viewportu i unika clippingu przez rodzica. ng-template vtPopoverContent tworzy zawartość dopiero przy otwarciu; let-close="close" udostępnia zamykanie po akcji. Pole formularza jest własnością konsumenta, więc wartość przetrwa ponowne otwarcie. Panel używa MatMenu: Escape zamyka panel i przywraca fokus do przycisku. Tab przechodzi między kontrolkami panelu bez zamykania formularza. Kliknięcia wewnątrz nie zamykają formularza. openedChange emituje stan. Publiczne metody open(), close(), toggle() oraz signal isOpen() umożliwiają sterowanie z TS. Playground pokazuje filtrowanie jako przykład kompozycji; reguły filtrów nie należą do popovera.`,
      },
    },
  },
  argTypes: {
    ariaLabel: { control: "text" },
    triggerText: { control: "text" },
    openIcon: { options: ["", "ui-close"], control: "select" },
    triggerVariant: {
      options: VoteyButtonVariants,
      control: "select",
    },
    triggerSize: { options: VoteyButtonSizes, control: "select" },
    triggerIcon: {
      options: ["", "ui-filter", "ui-question"],
      control: "select",
    },
    placement: {
      options: VoteyPopoverPlacements,
      control: "select",
    },
    disabled: { control: "boolean" },
    badge: { control: "number" },
    onOpenedChange: { action: "openedChange" },
    onApplied: { action: "applied" },
  },
  args: {
    ariaLabel: "Filtry",
    triggerText: "Filtry",
    triggerIcon: "ui-filter",
    openIcon: "",
    triggerVariant: "secondary",
    triggerSize: "small",
    placement: "bottom-end",
    disabled: false,
    badge: null,
    onOpenedChange: fn(),
    onApplied: fn(),
  },
};
export const Playground = {};
