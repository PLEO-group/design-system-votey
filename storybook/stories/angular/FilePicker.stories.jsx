import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./FilePicker.stories.scss";

const filePickerInputs = [
  "filename",
  "label",
  "emptyText",
  "actionText",
  "disabled",
];

function createFile(filename) {
  return filename ? new File([], filename) : undefined;
}

function setFilePickerInputs(componentRef, control, props) {
  control.setValue(createFile(props.filename) ?? null, { emitEvent: false });
  componentRef.setInput("control", control);

  for (const inputName of filePickerInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }

  componentRef.setInput("initialValue", createFile(props.initialFilename));
  componentRef.setInput("staticValue", createFile(props.staticFilename));
  componentRef.setInput("disable", props.disable);
  componentRef.setInput("block", props.block);
}

function AngularFilePickerPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularFilePicker() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { FormControl },
        { VoteyFilePickerComponent },
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

      const filePickerHost = document.createElement("vt-file-picker");
      hostRef.current.replaceChildren(filePickerHost);

      const componentRef = createComponent(VoteyFilePickerComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: filePickerHost,
      });
      const subscriptions = [
        componentRef.instance.changed.subscribe((file) =>
          latestPropsRef.current.onChanged(file)
        ),
        componentRef.instance.cancelled.subscribe(() =>
          latestPropsRef.current.onCancelled()
        ),
      ];
      const control = new FormControl(null);

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef, control };
      setFilePickerInputs(componentRef, control, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularFilePicker();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;

    if (!angularRuntime) return;

    setFilePickerInputs(
      angularRuntime.componentRef,
      angularRuntime.control,
      props
    );
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-file-picker-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/File Picker",
  component: AngularFilePickerPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    filename: {
      description: "Controlled filename for an existing or previewed file.",
    },
    onChanged: { action: "changed", table: { category: "Events" } },
    onCancelled: { action: "cancelled", table: { category: "Events" } },
    initialFilename: { description: "Value passed through initialValue." },
    staticFilename: { description: "Value passed through staticValue." },
    disable: { control: "boolean" },
    block: { control: "boolean" },
  },
  args: {
    filename: "",
    label: "Załącznik",
    emptyText: "Nie wybrano pliku",
    actionText: "Wybierz plik",
    disabled: false,
    initialFilename: "",
    staticFilename: "",
    disable: undefined,
    block: undefined,
    onChanged: fn(),
    onCancelled: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularFilePickerPreview
        {...args}
        onChanged={(file) => {
          args.onChanged(file);
          updateArgs({ filename: file?.name ?? "" });
        }}
      />
    );
  },
};
