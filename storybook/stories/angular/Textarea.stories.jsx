import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./Textarea.stories.scss";

const textareaInputs = [
  "value",
  "label",
  "placeholder",
  "helper",
  "showLabel",
  "showHelper",
  "disabled",
  "required",
  "readOnly",
  "error",
  "trimOnBlur",
  "autofocus",
  "spellcheck",
  "id",
  "name",
  "autocomplete",
  "minLength",
  "maxLength",
  "ariaLabel",
  "ariaDescribedby",
  "dataCy",
];

function setTextareaInputs(componentRef, props) {
  for (const inputName of textareaInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularTextareaPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularTextarea() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { VoteyTextareaComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) return;

      const applicationRef = await createApplication();

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const textareaHost = document.createElement("vt-textarea");
      hostRef.current.replaceChildren(textareaHost);

      const componentRef = createComponent(VoteyTextareaComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: textareaHost,
      });
      const subscriptions = [
        componentRef.instance.changed.subscribe((value) =>
          latestPropsRef.current.onChanged(value)
        ),
        componentRef.instance.focused.subscribe((event) =>
          latestPropsRef.current.onFocused(event)
        ),
        componentRef.instance.blurred.subscribe((event) =>
          latestPropsRef.current.onBlurred(event)
        ),
        componentRef.instance.keyDown.subscribe((event) =>
          latestPropsRef.current.onKeyDown(event)
        ),
      ];

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };
      setTextareaInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularTextarea();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;

    if (!angularRuntime) return;

    setTextareaInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-textarea-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Textarea",
  component: AngularTextareaPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onChanged: { action: "changed", table: { category: "Events" } },
    onFocused: { action: "focused", table: { category: "Events" } },
    onBlurred: { action: "blurred", table: { category: "Events" } },
    onKeyDown: { action: "keyDown", table: { category: "Events" } },
  },
  args: {
    value: "",
    label: "Opis wydarzenia",
    placeholder: "Wpisz opis…",
    helper: "Maks. 2000 znaków",
    showLabel: true,
    showHelper: true,
    disabled: false,
    required: false,
    readOnly: false,
    error: false,
    trimOnBlur: false,
    autofocus: false,
    spellcheck: true,
    id: "storybook-textarea",
    name: "storybook-textarea",
    autocomplete: "off",
    minLength: null,
    maxLength: 2000,
    ariaLabel: "",
    ariaDescribedby: "",
    dataCy: "storybook-textarea",
    onChanged: fn(),
    onFocused: fn(),
    onBlurred: fn(),
    onKeyDown: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularTextareaPreview
        {...args}
        onChanged={(value) => {
          args.onChanged(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
