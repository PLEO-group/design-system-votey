import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./Textarea.stories.scss";

const textareaInputs = [
  "label",
  "placeholder",
  "helper",
  "disabled",
  "trimOnBlur",
  "spellcheck",
  "minLength",
  "maxLength",
];

function setTextareaInputs(componentRef, control, Validators, props) {
  const validators = [
    props.required || props.showError ? Validators.required : null,
    props.minLength === null ? null : Validators.minLength(props.minLength),
    props.maxLength === null ? null : Validators.maxLength(props.maxLength),
  ].filter(Boolean);

  control.setValidators(validators);
  control.setValue(props.text, { emitEvent: false });
  control.updateValueAndValidity({ emitEvent: false });

  if (props.showError) {
    control.markAsTouched();
  } else {
    control.markAsUntouched();
  }

  componentRef.setInput("control", control);

  for (const inputName of textareaInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }

  componentRef.setInput("initialValue", props.initialValue);
  componentRef.setInput("staticValue", props.staticValue);
  componentRef.setInput("disable", props.disable);
  componentRef.setInput("block", props.block);
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
        { FormControl, Validators },
        { VoteyTextAreaComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
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

      const componentRef = createComponent(VoteyTextAreaComponent, {
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
      const control = new FormControl("", { nonNullable: true });

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = {
        applicationRef,
        componentRef,
        control,
        Validators,
      };
      setTextareaInputs(
        componentRef,
        control,
        Validators,
        latestPropsRef.current
      );
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

    setTextareaInputs(
      angularRuntime.componentRef,
      angularRuntime.control,
      angularRuntime.Validators,
      props
    );
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
    required: {
      description: "Adds Validators.required to the preview FormControl.",
    },
    showError: {
      description: "Shows the required error state for an empty textarea.",
    },
    disable: { control: "boolean" },
    block: { control: "boolean" },
  },
  args: {
    text: "",
    label: "Opis wydarzenia",
    placeholder: "Wpisz opis…",
    helper: "Maks. 2000 znaków",
    disabled: false,
    required: false,
    showError: false,
    trimOnBlur: false,
    spellcheck: true,
    minLength: null,
    maxLength: 2000,
    initialValue: undefined,
    staticValue: undefined,
    disable: undefined,
    block: undefined,
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
          updateArgs({ text: value });
        }}
      />
    );
  },
};
