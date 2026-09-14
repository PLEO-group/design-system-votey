import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";

function setChipInputs(componentRef, props) {
  componentRef.setInput("label", props.label);
  componentRef.setInput("removeTooltip", props.removeTooltip);
  componentRef.setInput("showRemove", props.showRemove);
  componentRef.setInput("disabled", props.disabled);
}

function AngularChipPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularChip() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { provideVoteySvgRegistry, VoteyChipComponent },
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

      const chipHost = document.createElement("vt-chip");
      hostRef.current.replaceChildren(chipHost);

      const componentRef = createComponent(VoteyChipComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: chipHost,
      });
      const removedSubscription = componentRef.instance.removed.subscribe(() => {
        latestPropsRef.current.onRemoved();
      });

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };

      setChipInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        removedSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularChip();

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

    setChipInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return <div ref={hostRef} />;
}

export default {
  title: "ANGULAR COMPONENTS/Chip",
  component: AngularChipPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onRemoved: {
      action: "removed",
      table: { category: "Events" },
    },
  },
  args: {
    label: "Uchwała nr VIII",
    removeTooltip: "Usuń uchwałę nr VIII",
    showRemove: true,
    disabled: false,
    onRemoved: fn(),
  },
};

export const Playground = {};
