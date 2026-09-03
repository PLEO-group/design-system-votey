import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import { getIconList } from "../../utils/assetLoader";
import "./Input.stories.scss";

const iconOptions = [
  "none",
  ...getIconList()
    .map((icon) => icon.angularRegistryName)
    .sort((first, second) => first.localeCompare(second)),
];
const inputNames = [
  "value",
  "variant",
  "type",
  "label",
  "placeholder",
  "helper",
  "showLabel",
  "showHelper",
  "disabled",
  "required",
  "error",
  "id",
  "name",
  "autocomplete",
];

function setInputProperties(componentRef, props) {
  for (const inputName of inputNames) {
    componentRef.setInput(inputName, props[inputName]);
  }

  componentRef.setInput("icon", props.icon === "none" ? "" : props.icon);
}

function AngularInputPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularInput() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { provideVoteySvgRegistry, VoteyInputComponent },
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

      const inputHost = document.createElement("vt-input");
      hostRef.current.replaceChildren(inputHost);

      const componentRef = createComponent(VoteyInputComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: inputHost,
      });
      const changedSubscription = componentRef.instance.changed.subscribe(
        (value) => latestPropsRef.current.onChanged(value)
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };
      setInputProperties(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        changedSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularInput();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;

    if (!angularRuntime) return;

    setInputProperties(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return <div className="angular-input-story" ref={hostRef} />;
}

export default {
  title: "ANGULAR COMPONENTS/Input",
  component: AngularInputPreview,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      options: ["boxed", "underline"],
      control: { type: "inline-radio" },
    },
    type: {
      options: ["text", "email", "password", "search", "tel", "url", "number"],
      control: { type: "select" },
    },
    icon: {
      options: iconOptions,
      control: { type: "select" },
      table: { category: "Appearance" },
    },
    onChanged: {
      action: "changed",
      table: { category: "Events" },
    },
  },
  args: {
    value: "",
    variant: "boxed",
    type: "text",
    label: "Etykieta",
    placeholder: "Wpisz…",
    helper: "Tekst pomocniczy",
    showLabel: true,
    showHelper: false,
    icon: "none",
    disabled: false,
    required: false,
    error: false,
    id: "storybook-input",
    name: "storybook-input",
    autocomplete: "off",
    onChanged: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularInputPreview
        {...args}
        onChanged={(value) => {
          args.onChanged(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
