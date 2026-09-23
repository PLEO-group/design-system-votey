import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./Input.stories.scss";

const inputNames = [
  "variant",
  "type",
  "label",
  "placeholder",
  "disabled",
  "id",
  "name",
  "inputMode",
  "min",
  "max",
  "minLength",
  "maxLength",
  "pattern",
  "ignoredErrors",
  "dataCy",
];

const removeWhitespace = (value) => value.replace(/\s/g, "");

function setInputProperties(componentRef, control, Validators, props) {
  const validators = [
    props.required || props.showError ? Validators.required : null,
    props.minLength === null ? null : Validators.minLength(props.minLength),
    props.maxLength === null ? null : Validators.maxLength(props.maxLength),
    props.pattern ? Validators.pattern(props.pattern) : null,
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
  componentRef.setInput(
    "trimmer",
    props.trimWhitespace ? removeWhitespace : null
  );

  for (const inputName of inputNames) {
    componentRef.setInput(inputName, props[inputName]);
  }
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
        { FormControl, Validators },
        { VoteyInputComponent },
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

      const inputHost = document.createElement("vt-input");
      hostRef.current.replaceChildren(inputHost);

      const componentRef = createComponent(VoteyInputComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: inputHost,
      });
      const control = new FormControl("", { nonNullable: true });
      const subscriptions = [
        control.valueChanges.subscribe((value) =>
          latestPropsRef.current.onChanged(value)
        ),
        componentRef.instance.keyDown.subscribe((event) =>
          latestPropsRef.current.onKeyDown(event)
        ),
      ];

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = {
        applicationRef,
        componentRef,
        control,
        Validators,
      };
      setInputProperties(
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

    setInputProperties(
      angularRuntime.componentRef,
      angularRuntime.control,
      angularRuntime.Validators,
      props
    );
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
    inputMode: {
      options: [
        "",
        "none",
        "text",
        "decimal",
        "numeric",
        "tel",
        "search",
        "email",
        "url",
      ],
      control: { type: "select" },
    },
    required: {
      description: "Adds Validators.required to the preview FormControl.",
    },
    showError: {
      description: "Shows the required error state for an empty input.",
    },
    trimWhitespace: {
      description: "Removes whitespace from the FormControl value on blur.",
    },
    onChanged: { action: "changed", table: { category: "Events" } },
    onKeyDown: { action: "keyDown", table: { category: "Events" } },
  },
  args: {
    text: "",
    variant: "boxed",
    type: "text",
    label: "Event name",
    placeholder: "Enter event name",
    disabled: false,
    required: false,
    showError: false,
    trimWhitespace: false,
    id: "storybook-input",
    name: "storybook-input",
    inputMode: "",
    min: null,
    max: null,
    minLength: null,
    maxLength: 100,
    pattern: "",
    ignoredErrors: [],
    dataCy: "",
    onChanged: fn(),
    onKeyDown: fn(),
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
          updateArgs({ text: value });
        }}
      />
    );
  },
};

export const PhoneNumberWithWhitespaceTrimmer = {
  args: {
    text: "502 724 170",
    type: "tel",
    inputMode: "tel",
    label: "Phone number",
    placeholder: "Enter phone number",
    trimWhitespace: true,
  },
};
