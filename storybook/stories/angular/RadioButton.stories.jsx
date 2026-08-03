import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./RadioButton.stories.scss";

const radioButtonInputs = [
  "options",
  "groupLabelPosition",
  "groupDisabled",
  "groupRequired",
  "groupClass",
  "tooltip",
  "disabledNote",
];

function setRadioButtonInputs(componentRef, control, props) {
  control.setValue(props.selectedValue, { emitEvent: false });
  componentRef.setInput("control", control);

  for (const inputName of radioButtonInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
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
    <div className="angular-radio-button-story">
      <div className="preview" ref={hostRef} />
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
    groupLabelPosition: {
      options: ["after", "before"],
      control: { type: "inline-radio" },
    },
    onChange: {
      action: "change",
      table: { category: "Events" },
    },
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
    groupLabelPosition: "after",
    groupDisabled: false,
    groupRequired: false,
    groupClass: "",
    tooltip: "Wybierz jedną z opcji",
    disabledNote: "Ta grupa jest obecnie niedostępna",
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

export const InsertableContent = {
  parameters: {
    controls: { disable: true },
  },
  render: () => <AngularRadioButtonInsertableContentPreview />,
};
