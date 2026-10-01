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
  "variant",
  "type",
  "label",
  "placeholder",
  "helper",
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
  "ariaLabel",
  "ariaDescribedby",
  "dataCy",
];

const figmaInputStates = [
  { name: "Default", description: "Oczekuje na wpis." },
  { name: "Focus", description: "Focus — podgląd." },
  { name: "Filled", description: "Wartość wpisana." },
  { name: "Error", description: "Błąd walidacji." },
  { name: "Disabled", description: "Pole niedostępne." },
];

const figmaInputStyles = [
  { name: "Boxed", variant: "boxed" },
  { name: "Underline", variant: "underline" },
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
  componentRef.setInput("icon", props.icon === "none" ? "" : props.icon);

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
        { provideVoteySvgRegistry, VoteyInputComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
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
      const control = new FormControl("", { nonNullable: true });
      const subscriptions = [
        control.valueChanges.subscribe((value) =>
          latestPropsRef.current.onChanged(value)
        ),
        componentRef.instance.blur.subscribe((event) =>
          latestPropsRef.current.onBlur(event)
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

function AngularInputStatesPreview() {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function mountAngularInputStates() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { FormControl, Validators },
        { provideVoteySvgRegistry, VoteyInputComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) return;

      const applicationRef = await createApplication({
        providers: [provideVoteySvgRegistry()],
      });
      const componentRefs = [];

      for (const style of figmaInputStyles) {
        for (const state of figmaInputStates) {
          const stateId = `${style.variant}-${state.name.toLowerCase()}`;
          const previewHost = hostRef.current.querySelector(
            `[data-input-state="${stateId}"]`
          );

          if (!previewHost) continue;

          const inputHost = document.createElement("vt-input");
          previewHost.append(inputHost);

          const componentRef = createComponent(VoteyInputComponent, {
            environmentInjector: applicationRef.injector,
            hostElement: inputHost,
          });
          const control = new FormControl("", { nonNullable: true });
          const hasValue = ["Filled", "Error", "Disabled"].includes(
            state.name
          );

          setInputProperties(componentRef, control, Validators, {
            text: hasValue ? "Wpisz…" : "",
            variant: style.variant,
            type: "text",
            label: "Etykieta",
            placeholder: "Wpisz…",
            helper: "",
            disabled: state.name === "Disabled",
            id: `storybook-input-${stateId}`,
            name: `storybook-input-${stateId}`,
            inputMode: "",
            min: null,
            max: null,
            minLength: null,
            maxLength: 500,
            pattern: "",
            ignoredErrors: state.name === "Error" ? ["required"] : [],
            ariaLabel: "",
            ariaDescribedby: `input-state-description-${stateId}`,
            dataCy: "",
            icon: "none",
            required: false,
            showError: state.name === "Error",
            trimWhitespace: false,
            onChanged: () => {},
            onBlur: () => {},
            onKeyDown: () => {},
          });

          if (state.name === "Error") {
            control.setErrors({ required: true });
          }
          if (state.name === "Disabled") {
            control.disable({ emitEvent: false });
          }

          applicationRef.attachView(componentRef.hostView);
          componentRefs.push(componentRef);
        }
      }

      if (!isMounted) {
        componentRefs.forEach((componentRef) => {
          applicationRef.detachView(componentRef.hostView);
          componentRef.destroy();
        });
        applicationRef.destroy();
        return;
      }

      applicationRef.tick();
      hostRef.current.querySelectorAll("input").forEach((nativeInput) => {
        nativeInput.readOnly = true;
        nativeInput.tabIndex = -1;
      });
      angularRuntimeRef.current = {
        applicationRef,
        componentRefs,
        destroy: () => {
          componentRefs.forEach((componentRef) => {
            applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
          });
          applicationRef.destroy();
        },
      };
    }

    void mountAngularInputStates();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  return (
    <section className="input-states-card" id="input-states-card" ref={hostRef}>
      <header className="input-states-header">
        <h2>Stany Input z Figmy</h2>
        <p>Statyczny podgląd wszystkich wariantów komponentu.</p>
      </header>
      {figmaInputStyles.map((style) => (
        <section className="input-state-row" key={style.variant}>
          <h3>{style.name}</h3>
          <div className="input-state-grid">
            {figmaInputStates.map((state) => {
              const stateId = `${style.variant}-${state.name.toLowerCase()}`;

              return (
                <article
                  className="input-state-item"
                  data-state={state.name.toLowerCase()}
                  key={stateId}
                >
                  <h4>{state.name}</h4>
                  <p id={`input-state-description-${stateId}`}>
                    {state.description}
                  </p>
                  <div
                    className="angular-input-state-story"
                    data-input-state={stateId}
                  />
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Input",
  component: AngularInputPreview,
  parameters: { layout: "centered" },
  argTypes: {
    label: {
      description:
        "Required translation key used as the field's accessible label. Pass an empty string only when ariaLabel provides the accessible name.",
      type: { name: "string", required: true },
      table: { category: "Content" },
    },
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
    icon: {
      options: iconOptions,
      control: { type: "select" },
      table: { category: "Appearance" },
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
    onKeyDown: {
      action: "keyDown",
      description: "Emits the native KeyboardEvent from the input element.",
      table: { category: "Events" },
    },
    onBlur: {
      action: "blur",
      description: "Emits the native FocusEvent after applying the trimmer.",
      table: { category: "Events" },
    },
  },
  args: {
    text: "",
    variant: "boxed",
    type: "text",
    label: "Event name",
    placeholder: "Enter event name",
    helper: "Additional information",
    icon: "ui-search",
    disabled: false,
    required: false,
    showError: false,
    trimWhitespace: false,
    id: "",
    name: "storybook-input",
    inputMode: "",
    min: null,
    max: null,
    minLength: null,
    maxLength: 100,
    pattern: "",
    ignoredErrors: [],
    ariaLabel: "",
    ariaDescribedby: "",
    dataCy: "",
    onChanged: fn(),
    onBlur: fn(),
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

export const FigmaStates = {
  render: () => <AngularInputStatesPreview />,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
    layout: "padded",
  },
};
