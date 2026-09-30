import React from "react";
import { AngularPickerPreview } from "../../components/AngularPickerPreview";

export default {
  title: "ANGULAR COMPONENTS/TimePicker",
  component: AngularPickerPreview,
  parameters: { layout: "centered" },
  argTypes: {
    timeEntryPolicy: { control: "select", options: ["allowManual", "listOnly"] },
  },
};

export const Playground = {
  args: {
    label: "LABEL.TIME",
    value: null,
    disabled: false,
    required: false,
    showError: false,
    stepMinutes: 30,
    timeEntryPolicy: "allowManual",
    min: null,
    max: null,
  },
  render: (args) => <AngularPickerPreview kind="time" {...args} />,
};
