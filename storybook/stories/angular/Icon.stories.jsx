import React, { useEffect, useRef } from "react";
import { getIconList, getIllustrationList } from "../../utils/assetLoader";
import "./Icon.stories.scss";

const assetOptions = [
  ...getIconList(),
  ...getIllustrationList(),
]
  .map((asset) => asset.angularRegistryName)
  .sort((first, second) => first.localeCompare(second));

function AngularIconPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularIcon() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { provideVoteySvgRegistry, VoteyIconComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) return;

      const applicationRef = await createApplication({
        providers: [provideVoteySvgRegistry()],
      });

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const iconHost = document.createElement("vt-icon");
      hostRef.current.replaceChildren(iconHost);

      const componentRef = createComponent(VoteyIconComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: iconHost,
      });

      applicationRef.attachView(componentRef.hostView);
      componentRef.setInput("ico", latestPropsRef.current.ico);
      componentRef.setInput("ariaLabel", latestPropsRef.current.ariaLabel);
      applicationRef.tick();

      angularRuntimeRef.current = {
        applicationRef,
        componentRef,
        destroy() {
          applicationRef.detachView(componentRef.hostView);
          componentRef.destroy();
          applicationRef.destroy();
        },
      };
    }

    void mountAngularIcon();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;
    if (!angularRuntime) return;

    angularRuntime.componentRef.setInput("ico", props.ico);
    angularRuntime.componentRef.setInput("ariaLabel", props.ariaLabel);
    angularRuntime.applicationRef.tick();
  }, [props.ico, props.ariaLabel]);

  return (
    <div className="angular-icon-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Icon",
  component: AngularIconPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    ico: {
      options: assetOptions,
      control: { type: "select" },
    },
  },
  args: {
    ico: "ui-plus",
    ariaLabel: "Dodaj",
  },
};

export const Playground = {};
