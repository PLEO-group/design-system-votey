import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { expect, fn, userEvent, within } from "@storybook/test";
import "./RadioButton.stories.scss";

const radioButtonInputs = [
  "options",
  "groupName",
  "groupLabelPosition",
  "groupDisabled",
  "groupRequired",
  "groupClass",
  "tooltip",
  "disabledNote",
  "ignoredErrors",
];

function resolveCssColorToken(tokenName) {
  const probe = document.createElement("span");
  probe.style.color = `var(${tokenName})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();

  return color;
}

function setRadioButtonInputs(componentRef, control, props) {
  control.setValue(props.selectedValue, { emitEvent: false });
  componentRef.setInput("control", control);

  for (const inputName of radioButtonInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }

  componentRef.setInput("initialValue", props.initialValue);
  componentRef.setInput("staticValue", props.staticValue);
  componentRef.setInput("disable", props.disable);
  componentRef.setInput("block", props.block);
}

function AngularRadioButtonPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularRadioButton() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { FormControl },
        { VoteyRadioButtonComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
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

      const radioButtonHost = document.createElement("vt-radio-button");
      hostRef.current.replaceChildren(radioButtonHost);

      const componentRef = createComponent(VoteyRadioButtonComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: radioButtonHost,
      });
      const changeSubscription = componentRef.instance.change.subscribe(
        (event) => latestPropsRef.current.onChange(event)
      );
      const control = new FormControl(latestPropsRef.current.selectedValue, {
        nonNullable: true,
      });

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef, control };
      setRadioButtonInputs(componentRef, control, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        changeSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularRadioButton();

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

    setRadioButtonInputs(
      angularRuntime.componentRef,
      angularRuntime.control,
      props
    );
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div
      className={`angular-radio-button-story ${props.previewClassName ?? ""}`}
    >
      <div className="preview" ref={hostRef} />
    </div>
  );
}

const figmaRadioStates = ["Default", "Error", "Disabled", "Hover"];

function AngularRadioButtonStatesPreview() {
  const hostRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let applicationRef;
    const mountedComponents = [];

    async function mountStates() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { FormControl },
        { VoteyRadioButtonComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) {
        return;
      }

      applicationRef = await createApplication();

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      for (const selected of [false, true]) {
        for (const state of figmaRadioStates) {
          const cellId = `${selected ? "selected" : "unselected"}-${state.toLowerCase()}`;
          const cell = hostRef.current.querySelector(
            `[data-radio-cell="${cellId}"]`
          );
          const radioButtonHost = document.createElement("vt-radio-button");
          cell.replaceChildren(radioButtonHost);

          const componentRef = createComponent(VoteyRadioButtonComponent, {
            environmentInjector: applicationRef.injector,
            hostElement: radioButtonHost,
          });
          const control = new FormControl(selected ? "selected" : null);

          componentRef.setInput("control", control);
          componentRef.setInput("options", [
            {
              label: "Etykieta",
              value: "selected",
              disabled: state === "Disabled",
              error: state === "Error",
              dataCy: `radio-${cellId}`,
            },
          ]);
          componentRef.setInput("groupName", `figma-radio-${cellId}`);
          componentRef.setInput("groupDisabled", false);
          applicationRef.attachView(componentRef.hostView);
          mountedComponents.push(componentRef);
        }
      }

      applicationRef.tick();
    }

    void mountStates();

    return () => {
      isMounted = false;
      for (const componentRef of mountedComponents) {
        applicationRef?.detachView(componentRef.hostView);
        componentRef.destroy();
      }
      applicationRef?.destroy();
    };
  }, []);

  return (
    <div className="angular-radio-button-story radio-state-story">
      <div className="radio-state-grid" ref={hostRef}>
        <span aria-hidden="true" />
        {figmaRadioStates.map((state) => (
          <strong key={state}>{state}</strong>
        ))}
        {[false, true].map((selected) => (
          <React.Fragment key={String(selected)}>
            <strong>{selected ? "Zaznaczone" : "Niezaznaczone"}</strong>
            {figmaRadioStates.map((state) => {
              const cellId = `${selected ? "selected" : "unselected"}-${state.toLowerCase()}`;

              return (
                <div
                  className="radio-state-cell"
                  data-radio-cell={cellId}
                  key={state}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function AngularRadioButtonInsertableContentPreview() {
  const hostRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let destroy = () => undefined;

    async function mountAngularRadioButton() {
      await import("@angular/compiler");
      const [
        { Component, createComponent },
        { createApplication },
        { FormControl },
        { VoteyRadioButtonComponent, VoteyRadioOptionContentDirective },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      class RadioButtonContentStoryComponent {
        options = [
          { id: "first", label: "Pierwsza opcja", value: "first" },
          { id: "second", label: "Druga opcja", value: "second" },
          { id: "third", label: "Trzecia opcja", value: "third" },
        ];
        control = new FormControl("second", { nonNullable: true });
      }

      Component({
        selector: "vt-radio-button-content-story",
        imports: [VoteyRadioButtonComponent, VoteyRadioOptionContentDirective],
        template: `
          <vt-radio-button
            [options]="options"
            [control]="control"
          >
            <ng-template vtRadioOptionContent="second">
              <label class="insertable-content">
                Wybór zależny
                <select data-story-insertable-content>
                  <option>Pierwsza wartość</option>
                  <option>Druga wartość</option>
                </select>
              </label>
            </ng-template>
          </vt-radio-button>
        `,
      })(RadioButtonContentStoryComponent);

      if (!isMounted || !hostRef.current) {
        return;
      }

      const applicationRef = await createApplication();

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const storyHost = document.createElement("vt-radio-button-content-story");
      hostRef.current.replaceChildren(storyHost);

      const componentRef = createComponent(RadioButtonContentStoryComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: storyHost,
      });

      applicationRef.attachView(componentRef.hostView);
      applicationRef.tick();

      destroy = () => {
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularRadioButton();

    return () => {
      isMounted = false;
      destroy();
    };
  }, []);

  return (
    <div className="angular-radio-button-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Radio Button",
  component: AngularRadioButtonPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    options: {
      control: "object",
    },
    selectedValue: {
      control: "text",
    },
    groupName: { control: "text" },
    groupLabelPosition: {
      options: ["after", "before"],
      control: { type: "inline-radio" },
    },
    onChange: {
      action: "change",
      table: { category: "Events" },
    },
    disable: { control: "boolean" },
    block: { control: "boolean" },
  },
  args: {
    options: [
      {
        label: "Pierwsza opcja",
        value: "first",
        id: "storybook-radio-button-first",
      },
      {
        label: "Druga opcja",
        value: "second",
        id: "storybook-radio-button-second",
      },
    ],
    selectedValue: "first",
    groupName: "storybook-radio-group",
    groupLabelPosition: "after",
    groupDisabled: false,
    groupRequired: false,
    groupClass: "",
    tooltip: "Wybierz jedną z opcji",
    disabledNote: "Ta grupa jest obecnie niedostępna",
    ignoredErrors: [],
    initialValue: undefined,
    staticValue: undefined,
    disable: undefined,
    block: undefined,
    onChange: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularRadioButtonPreview
        {...args}
        onChange={(event) => {
          args.onChange(event);
          updateArgs({ selectedValue: event.value });
        }}
      />
    );
  },
};

export const FigmaStates = {
  parameters: {
    controls: { disable: true },
  },
  render: () => <AngularRadioButtonStatesPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = await canvas.findAllByRole("radio");

    await expect(radios).toHaveLength(8);

    for (const selected of [false, true]) {
      for (const state of figmaRadioStates) {
        const cellId = `${selected ? "selected" : "unselected"}-${state.toLowerCase()}`;
        const radio = canvasElement.querySelector(
          `[data-cy="radio-${cellId}"] input[type="radio"]`
        );

        await expect(radio.checked).toBe(selected);
        await expect(radio.disabled).toBe(state === "Disabled");
        await expect(radio.name).toBe(`figma-radio-${cellId}`);
        await expect(
          radio.closest(".mat-mdc-radio-button").classList.contains("radio-error")
        ).toBe(state === "Error");

        if (state === "Hover") {
          await userEvent.hover(radio.closest(".mat-mdc-radio-button"));
        }

        const expectedBorderToken = {
          Default: selected ? "--color-accent-primary" : "--color-border-strong",
          Error: "--color-state-error",
          Disabled: "--color-border-subtle",
          Hover: "--color-accent-hover",
        }[state];
        const outerCircle = radio
          .closest(".mat-mdc-radio-button")
          .querySelector(".mdc-radio__outer-circle");

        await expect(getComputedStyle(outerCircle).borderTopColor).toBe(
          resolveCssColorToken(expectedBorderToken)
        );

        if (state === "Error") {
          await expect(getComputedStyle(outerCircle).borderTopColor).toBe(
            resolveCssColorToken("--color-state-error")
          );
        }
      }
    }

    const label = canvasElement.querySelector(".mdc-label");
    const ring = canvasElement.querySelector(".mdc-radio");
    const labelStyle = getComputedStyle(label);
    const ringBounds = ring.getBoundingClientRect();

    await expect(labelStyle.whiteSpace).toBe("normal");
    await expect(labelStyle.fontFamily).toContain("Open Sans");
    await expect(labelStyle.fontSize).toBe("15px");
    await expect(labelStyle.lineHeight).toBe("20px");
    await expect(ringBounds.width).toBe(20);
    await expect(ringBounds.height).toBe(20);
    await expect(
      label.getBoundingClientRect().left - ringBounds.right
    ).toBe(8);

  },
};

export const KeyboardNavigation = {
  args: {
    options: [
      { ariaLabel: "Pierwsza opcja", value: "first" },
      { ariaLabel: "Druga opcja", value: "second" },
    ],
    selectedValue: "first",
    groupName: "storybook-radio-keyboard-group",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = await canvas.findAllByRole("radio");
    const firstRadio = canvas.getByRole("radio", { name: "Pierwsza opcja" });
    const secondRadio = canvas.getByRole("radio", { name: "Druga opcja" });

    await expect(canvasElement.querySelectorAll(".mdc-label")).toHaveLength(0);
    await expect(firstRadio).toBe(radios[0]);
    await expect(secondRadio).toBe(radios[1]);
    firstRadio.focus();
    await expect(firstRadio.name).toBe(secondRadio.name);
    await userEvent.keyboard("{ArrowDown}");
    await expect(firstRadio).not.toBeChecked();
    await expect(secondRadio).toBeChecked();
  },
};

export const LongLabel = {
  args: {
    options: [
      {
        label:
          "Bardzo długa etykieta opcji powinna zawinąć się do kolejnych wierszy bez obcinania tekstu.",
        value: "long-label",
      },
    ],
    selectedValue: "long-label",
    previewClassName: "constrained",
  },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole("radio");
    const label = canvasElement.querySelector(".mdc-label");

    await expect(getComputedStyle(label).whiteSpace).toBe("normal");
    await expect(label.getBoundingClientRect().height).toBeGreaterThan(20);
  },
};

export const InsertableContent = {
  parameters: {
    controls: { disable: true },
  },
  render: () => <AngularRadioButtonInsertableContentPreview />,
};
