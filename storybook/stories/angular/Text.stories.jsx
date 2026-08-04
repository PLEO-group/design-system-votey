import React, { useEffect, useRef } from "react";
import "./Text.stories.scss";

const textInputs = [
  "content",
  "variant",
  "color",
  "uppercase",
  "italic",
  "wrap",
  "maxLines",
];

function setTextInputs(componentRef, props) {
  for (const inputName of textInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularTextPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularText() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { VoteyTextComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) {
        return;
      }

      const applicationRef = await createApplication();

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const textHost = document.createElement("vt-text");
      hostRef.current.replaceChildren(textHost);

      const componentRef = createComponent(VoteyTextComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: textHost,
      });

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };

      setTextInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularText();

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

    setTextInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-text-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Text",
  component: AngularTextPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "body-l",
        "body",
        "body-s",
        "caption",
        "caption-s",
        "micro",
        "button",
        "table-header",
        "label",
      ],
      control: { type: "select" },
    },
    color: {
      options: [
        "primary",
        "secondary",
        "muted",
        "inverse",
        "accent",
        "on-sidebar",
      ],
      control: { type: "select" },
    },
    maxLines: {
      control: { type: "number", min: 0, step: 1 },
    },
  },
  args: {
    content:
      "Komponent tekstowy Votey korzysta z responsywnych tokenów typografii Angular CRM.",
    variant: "body",
    color: "primary",
    uppercase: false,
    italic: false,
    wrap: false,
    maxLines: 0,
  },
};

export const Playground = {};
