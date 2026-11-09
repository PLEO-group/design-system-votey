import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";
import { HelpPopoverApiGuide } from "../../components/HelpPopoverApiGuide";
import "@angular/compiler";
import {
  VoteyIllustrationNames,
  VoteyPopoverPlacements,
} from "@pleodigital/design-system-votey/angular";

function HelpPopoverPreview(props) {
  const host = useRef(null);
  const runtime = useRef(null);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let mounted = true;
    async function mount() {
      await import("@angular/compiler");
      const [ng, platform, ds] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);
      const app = await platform.createApplication({
        providers: [ds.provideVoteySvgRegistry()],
      });
      if (!mounted || !host.current) {
        app.destroy();
        return;
      }
      const element = document.createElement("vt-help-popover");
      host.current.replaceChildren(element);
      const ref = ng.createComponent(ds.VoteyHelpPopoverComponent, {
        environmentInjector: app.injector,
        hostElement: element,
      });
      const subscriptions = [
        ref.instance.openedChange.subscribe((value) =>
          latest.current.onOpenedChange(value)
        ),
        ref.instance.actionPressed.subscribe((event) => {
          event.preventDefault();
          latest.current.onActionPressed();
        }),
      ];
      const update = () => {
        const {
          title,
          illustration,
          sections,
          showAction,
          placement,
          disabled,
        } = latest.current;
        ref.setInput("content", {
          title,
          illustration: illustration || undefined,
          sections,
          ...(showAction
            ? { action: { label: "Jak działa Wyborek?", href: "#guide" } }
            : {}),
        });
        ref.setInput("placement", placement);
        ref.setInput("disabled", disabled);
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
  title: "ANGULAR COMPONENTS/Help Popover",
  component: HelpPopoverPreview,
  parameters: {
    layout: "centered",
    docs: {
      source: {
        language: "html",
        code: '<vt-help-popover [content]="eventHelp" />',
      },
      description: {
        component: `Panel pomocy z wbudowanym przyciskiem ?. Treść to VoteyHelpPopoverContent: title, opcjonalna illustration (VoteyIllustration), sections z heading i paragraphs oraz opcjonalna action {label, href}. Teksty przechodzą przez VOTEY_TRANSLATOR. Ilustracja jest renderowana wyłącznie przez vt-icon. Na mobile ilustracja jest nad treścią i przewija się cały panel. Dla nietypowej treści można przekazać ng-template vtPopoverContent. Zdarzenie actionPressed przekazuje MouseEvent: konsument może wywołać preventDefault i uruchomić własny router. Escape i kliknięcie poza zamykają panel i przywracają fokus. Przykład: <vt-help-popover [content]="eventHelp" />.`,
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    illustration: {
      options: ["", ...VoteyIllustrationNames],
      control: "select",
    },
    sections: { control: "object" },
    showAction: { control: "boolean" },
    placement: {
      options: VoteyPopoverPlacements,
      control: "select",
    },
    disabled: { control: "boolean" },
    onOpenedChange: { action: "openedChange", table: { category: "Events" } },
    onActionPressed: { action: "actionPressed", table: { category: "Events" } },
  },
  args: {
    title: "Głosowania",
    illustration: "bg-create-first-vote",
    placement: "bottom-end",
    disabled: false,
    showAction: false,
    sections: [
      {
        heading: "GŁOSOWANIE",
        paragraphs: [
          "Głosowanie stanowi zbiór pytań, na które odpowiadają zaproszeni uczestnicy.",
        ],
      },
      {
        heading: "NAZWA GŁOSOWANIA",
        paragraphs: [
          "Nazwa wyświetla się uczestnikowi w aplikacji do głosowania.",
        ],
      },
    ],
    onOpenedChange: fn(),
    onActionPressed: fn(),
  },
};

export const Playground = {};

export const Docs = {
  render: () => <HelpPopoverApiGuide />,
  parameters: {
    layout: "padded",
    controls: { disable: true },
    actions: { disable: true },
  },
};
