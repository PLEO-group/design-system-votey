import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";
import { getIconList } from "../../utils/assetLoader";
import "./Button.stories.scss";

const publicIcons = getIconList().sort((first, second) =>
  first.angularRegistryName.localeCompare(second.angularRegistryName)
);
const publicIconsByName = new Map(
  publicIcons.map((icon) => [icon.angularRegistryName, icon])
);
const iconOptions = [
  "none",
  "plus",
  ...publicIcons.map((icon) => icon.angularRegistryName),
];

const buttonInputs = [
  "disabled",
  "type",
  "variant",
  "size",
  "text",
  "hasIcon",
  "badge",
  "ariaLabel",
  "ariaExpanded",
  "ariaPressed",
  "tooltipText",
  "disabledNote",
];

function updatePreviewIcon(iconHost, iconName) {
  if (iconName === "none") {
    iconHost.replaceChildren();
    return;
  }

  if (iconName === "plus") {
    iconHost.innerHTML = [
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">',
      '<path d="M12 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      '<path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      "</svg>",
    ].join("");
  } else {
    iconHost.innerHTML = publicIconsByName.get(iconName)?.svg ?? "";
  }

  const svg = iconHost.querySelector("svg");
  svg?.setAttribute("aria-hidden", "true");
  svg?.setAttribute("width", "100%");
  svg?.setAttribute("height", "100%");
}

function createPreviewIconHost(iconName) {
  const iconHost = document.createElement("span");
  iconHost.setAttribute("voteyButtonIcon", "");
  updatePreviewIcon(iconHost, iconName);
  return iconHost;
}

function setButtonInputs(componentRef, props) {
  for (const inputName of buttonInputs) {
    componentRef.setInput(
      inputName,
      inputName === "hasIcon" ? props.icon !== "none" : props[inputName]
    );
  }
}

function AngularButtonPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularButton() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { VoteyButtonComponent },
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

      const iconHost = createPreviewIconHost(latestPropsRef.current.icon);
      const componentRef = createComponent(VoteyButtonComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: hostRef.current,
        projectableNodes: [[iconHost]],
      });
      const pressedSubscription = componentRef.instance.pressed.subscribe(
        () => {
          latestPropsRef.current.onPressed();
        }
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef, iconHost };

      setButtonInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        pressedSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularButton();

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

    updatePreviewIcon(angularRuntime.iconHost, props.icon);
    setButtonInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-button-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Button",
  component: AngularButtonPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "link", "danger", "ghost", "orange"],
      control: { type: "select" },
    },
    size: {
      options: ["large", "small"],
      control: { type: "inline-radio" },
    },
    type: {
      options: ["button", "submit", "reset"],
      control: { type: "select" },
    },
    icon: {
      options: iconOptions,
      control: { type: "select" },
      table: { category: "Appearance" },
    },
    badge: {
      control: { type: "text" },
    },
    ariaExpanded: {
      control: { type: "boolean" },
    },
    ariaPressed: {
      control: { type: "boolean" },
    },
    onPressed: {
      action: "pressed",
      table: { category: "Events" },
    },
  },
  args: {
    disabled: false,
    type: "button",
    variant: "primary",
    size: "large",
    text: "Dodaj uczestnika",
    icon: "plus",
    badge: null,
    ariaLabel: "",
    ariaExpanded: null,
    ariaPressed: null,
    tooltipText: "Dodaj uczestnika",
    disabledNote: "Ta akcja jest obecnie niedostępna",
    onPressed: fn(),
  },
};

export const Playground = {};
