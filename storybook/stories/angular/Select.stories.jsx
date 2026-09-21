import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./Input.stories.scss";

const selectInputs = [
  "options",
  "variant",
  "label",
  "placeholder",
  "bindLabel",
  "bindValue",
  "id",
  "name",
  "dataCy",
  "multiple",
  "disabled",
  "flagSelect",
  "clearable",
  "clearTooltip",
  "showSelectionChips",
  "searchable",
  "searchPlaceholder",
  "customSearchFn",
  "withSelectionActions",
  "withSelectionSearch",
  "selectionCancelText",
  "selectionUpdateText",
  "nonRemovableValues",
  "optionAvatarField",
  "optionDescriptionField",
  "optionFlagField",
  "flagClass",
  "translateOptions",
  "closeOnSelect",
  "tooltip",
  "disabledNote",
  "removeTooltip",
  "ignoredErrors",
];

function normalizedValue(props) {
  if (props.multiple) {
    return Array.isArray(props.selectedValue)
      ? props.selectedValue
      : props.selectedValue
      ? [props.selectedValue]
      : [];
  }

  return Array.isArray(props.selectedValue)
    ? props.selectedValue[0] ?? null
    : props.selectedValue;
}

function setSelectInputs(componentRef, control, Validators, props) {
  control.setValidators(
    props.required || props.showError ? [Validators.required] : []
  );
  control.setValue(normalizedValue(props), { emitEvent: false });
  control.updateValueAndValidity({ emitEvent: false });

  if (props.showError) {
    control.markAsTouched();
  } else {
    control.markAsUntouched();
  }

  componentRef.setInput("control", control);

  for (const inputName of selectInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularSelectPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularSelect() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { FormControl, Validators },
        { provideVoteySvgRegistry, VoteySelectComponent },
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

      const selectHost = document.createElement("vt-select");
      hostRef.current.replaceChildren(selectHost);

      const componentRef = createComponent(VoteySelectComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: selectHost,
      });
      const control = new FormControl(null);
      const selectionSubscription =
        componentRef.instance.selectionChange.subscribe((event) =>
          latestPropsRef.current.onSelectionChange(event)
        );
      const changeSubscription = componentRef.instance.change.subscribe((event) =>
        latestPropsRef.current.onChange(event)
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = {
        applicationRef,
        componentRef,
        control,
        Validators,
      };
      setSelectInputs(
        componentRef,
        control,
        Validators,
        latestPropsRef.current
      );
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        selectionSubscription.unsubscribe();
        changeSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularSelect();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;

    if (!angularRuntime) return;

    setSelectInputs(
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
  title: "ANGULAR COMPONENTS/Select",
  component: AngularSelectPreview,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      options: ["boxed", "compact"],
      control: { type: "inline-radio" },
    },
    options: { control: "object" },
    selectedValue: { control: "object" },
    required: {
      description: "Adds Validators.required to the preview FormControl.",
    },
    showError: {
      description: "Shows the required error state for an empty select.",
    },
    onSelectionChange: {
      action: "selectionChange",
      table: { category: "Events" },
    },
    onChange: {
      action: "change",
      table: { category: "Events" },
    },
  },
  args: {
    options: [
      { label: "Polski", value: "pl" },
      { label: "English", value: "en" },
      { label: "Deutsch", value: "de", disabled: true },
    ],
    selectedValue: "pl",
    variant: "boxed",
    label: "Język wydarzenia",
    placeholder: "Wybierz język",
    bindLabel: "",
    bindValue: "",
    id: "storybook-select",
    name: "storybook-select",
    dataCy: "",
    multiple: false,
    disabled: false,
    flagSelect: false,
    clearable: false,
    clearTooltip: "BUTTON.CLEAR",
    showSelectionChips: true,
    searchable: false,
    searchPlaceholder: "COMMON.SEARCH",
    customSearchFn: null,
    withSelectionActions: false,
    withSelectionSearch: false,
    selectionCancelText: "BUTTON.CANCEL",
    selectionUpdateText: "BUTTON.SAVE",
    nonRemovableValues: [],
    optionAvatarField: "avatarUrl",
    optionDescriptionField: "email",
    optionFlagField: "flagClass",
    flagClass: "fi language-flag",
    translateOptions: true,
    closeOnSelect: false,
    tooltip: "",
    disabledNote: "",
    removeTooltip: "Usuń wybór",
    ignoredErrors: [],
    required: false,
    showError: false,
    onSelectionChange: fn(),
    onChange: fn(),
  },
};

export const Playground = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularSelectPreview
        {...args}
        onSelectionChange={(event) => {
          args.onSelectionChange(event);
          updateArgs({ selectedValue: event });
        }}
      />
    );
  },
};
