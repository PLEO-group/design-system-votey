import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./Checkbox.stories.scss";

const checkboxInputs = [
  "checked",
  "indeterminate",
  "disabled",
  "required",
  "error",
  "label",
  "labelPosition",
  "id",
  "name",
  "value",
];

function setCheckboxInputs(componentRef, props) {
  for (const inputName of checkboxInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularCheckboxPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularCheckbox() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { VoteyCheckboxComponent },
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

      const checkboxHost = document.createElement("vt-checkbox");
      hostRef.current.replaceChildren(checkboxHost);

      const componentRef = createComponent(VoteyCheckboxComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: checkboxHost,
      });
      const changedSubscription = componentRef.instance.changed.subscribe(
        (checked) => latestPropsRef.current.onChanged(checked)
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };
      setCheckboxInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        changedSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularCheckbox();

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

    setCheckboxInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-checkbox-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Checkbox",
  component: AngularCheckboxPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    labelPosition: {
      options: ["after", "before"],
      control: { type: "inline-radio" },
    },
    onChanged: {
      action: "changed",
      table: { category: "Events" },
    },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    error: false,
    label: "Etykieta checkboxa",
    labelPosition: "after",
    id: "storybook-checkbox",
    name: "storybook-checkbox",
    value: "accepted",
    onChanged: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularCheckboxPreview
        {...args}
        onChanged={(checked) => {
          args.onChanged(checked);
          updateArgs({ checked, indeterminate: false });
        }}
      />
    );
  },
};

