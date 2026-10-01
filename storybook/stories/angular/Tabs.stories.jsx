import React, { useEffect, useRef, useState } from "react";
import { fn } from "@storybook/test";

function AngularTabsPreview(props) {
  const hostRef = useRef(null);
  const runtimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  const [selectedId, setSelectedId] = useState(props.selectedId);
  latestPropsRef.current = props;

  useEffect(() => setSelectedId(props.selectedId), [props.selectedId]);

  useEffect(() => {
    let mounted = true;

    async function mount() {
      await import("@angular/compiler");
      const [{ createComponent }, { createApplication }, { VoteyTabsComponent, VOTEY_TRANSLATOR }] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);
      if (!mounted || !hostRef.current) return;

      const applicationRef = await createApplication({
        providers: [{ provide: VOTEY_TRANSLATOR, useValue: { translate: key => key } }],
      });
      const host = document.createElement("vt-tabs");
      hostRef.current.replaceChildren(host);
      const componentRef = createComponent(VoteyTabsComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: host,
      });
      const subscription = componentRef.instance.selectionChange.subscribe(id => {
        setSelectedId(id);
        latestPropsRef.current.onSelectionChange(id);
      });
      applicationRef.attachView(componentRef.hostView);
      runtimeRef.current = { applicationRef, componentRef, subscription };
      componentRef.setInput("items", latestPropsRef.current.items);
      componentRef.setInput("selectedId", latestPropsRef.current.selectedId);
      componentRef.setInput("ariaLabel", latestPropsRef.current.ariaLabel);
      applicationRef.tick();
    }

    void mount();
    return () => {
      mounted = false;
      const runtime = runtimeRef.current;
      if (!runtime) return;
      runtime.subscription.unsubscribe();
      runtime.applicationRef.detachView(runtime.componentRef.hostView);
      runtime.componentRef.destroy();
      runtime.applicationRef.destroy();
      runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.componentRef.setInput("items", props.items);
    runtime.componentRef.setInput("selectedId", selectedId);
    runtime.componentRef.setInput("ariaLabel", props.ariaLabel);
    runtime.applicationRef.tick();
  }, [props.items, props.ariaLabel, selectedId]);

  return <div ref={hostRef} style={{ width: "100%" }} />;
}

export default {
  title: "ANGULAR COMPONENTS/Tabs",
  component: AngularTabsPreview,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { id: "current", label: "Current events", count: 22 },
      { id: "archive", label: "Archived events" },
    ],
    selectedId: "current",
    ariaLabel: "Event sections",
    onSelectionChange: fn(),
  },
  argTypes: {
    onSelectionChange: { action: "selectionChange" },
  },
};

export const Playground = {};
