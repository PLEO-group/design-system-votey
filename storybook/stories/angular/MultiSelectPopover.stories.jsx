import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./MultiSelectPopover.stories.scss";

const multiSelectPopoverInputs = [
  "items",
  "selectedIds",
  "triggerText",
  "triggerIcon",
  "triggerVariant",
  "confirmText",
  "cancelText",
  "emptyText",
  "ariaLabel",
  "dataCy",
];

function setMultiSelectPopoverInputs(componentRef, props) {
  for (const inputName of multiSelectPopoverInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularMultiSelectPopoverPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularMultiSelectPopover() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { provideVoteySvgRegistry, VoteyMultiSelectPopoverComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) {
        return;
      }

      const applicationRef = await createApplication({
        providers: [provideVoteySvgRegistry()],
      });

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const popoverHost = document.createElement("vt-multi-select-popover");
      hostRef.current.replaceChildren(popoverHost);
      const componentRef = createComponent(VoteyMultiSelectPopoverComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: popoverHost,
      });
      const confirmedSubscription = componentRef.instance.confirmed.subscribe(
        (selectedIds) => latestPropsRef.current.onConfirmed(selectedIds)
      );
      const dismissedSubscription = componentRef.instance.dismissed.subscribe(
        () => latestPropsRef.current.onDismissed()
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };
      setMultiSelectPopoverInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        confirmedSubscription.unsubscribe();
        dismissedSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularMultiSelectPopover();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;

    if (!angularRuntime) {
      return;
    }

    setMultiSelectPopoverInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-multi-select-popover-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Multi Select Popover",
  component: AngularMultiSelectPopoverPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: { control: "object" },
    selectedIds: { control: "object" },
    triggerIcon: {
      options: ["", "ui-plus", "ui-filter"],
      control: { type: "select" },
    },
    triggerVariant: {
      options: ["primary", "secondary", "link", "ghost"],
      control: { type: "select" },
    },
    onConfirmed: {
      action: "confirmed",
      table: { category: "Events" },
    },
    onDismissed: {
      action: "dismissed",
      table: { category: "Events" },
    },
  },
  args: {
    items: [
      { id: "anna-kowalska", label: "Anna Kowalska" },
      { id: "jan-nowak", label: "Jan Nowak" },
      { id: "maria-wisniewska", label: "Maria Wiśniewska" },
      { id: "tomasz-zielinski", label: "Tomasz Zieliński", disabled: true },
    ],
    selectedIds: ["anna-kowalska"],
    triggerText: "Wybierz uczestników",
    triggerIcon: "ui-plus",
    triggerVariant: "link",
    confirmText: "Dodaj uczestników",
    cancelText: "Anuluj",
    emptyText: "Brak dostępnych elementów",
    ariaLabel: "Wybór uczestników",
    dataCy: "storybook-multi-select-popover",
    onConfirmed: fn(),
    onDismissed: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularMultiSelectPopoverPreview
        {...args}
        onConfirmed={(selectedIds) => {
          args.onConfirmed(selectedIds);
          updateArgs({ selectedIds });
        }}
      />
    );
  },
};
