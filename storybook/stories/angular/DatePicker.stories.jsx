import React from "react";
import { AngularPickerPreview } from "../../components/AngularPickerPreview";

export default {
  title: "ANGULAR COMPONENTS/DatePicker",
  component: AngularPickerPreview,
  parameters: { layout: "centered" },
  argTypes: {
    mode: { control: "select", options: ["Date", "DateTime"] },
    timeEntryPolicy: { control: "select", options: ["allowManual", "listOnly"] },
  },
};

export const Playground = {
  args: {
    label: "Data",
    mode: "Date",
    value: null,
    disabled: false,
    required: false,
    showError: false,
    min: null,
    max: null,
    locale: "pl-PL",
    stepMinutes: 30,
    timeEntryPolicy: "allowManual",
  },
  render: (args) => <AngularPickerPreview kind="date" {...args} />,
};
