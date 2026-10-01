import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";
import { getIconList } from "../../utils/assetLoader";
import "./Button.stories.scss";

const publicIcons = getIconList().sort((first, second) =>
  first.angularRegistryName.localeCompare(second.angularRegistryName)
);
const iconOptions = [
  "none",
  "plus",
  ...publicIcons
    .map((icon) => icon.angularRegistryName)
    .filter((iconName) => iconName !== "ui-plus"),
];

const buttonInputs = [
  "disabled",
  "type",
  "variant",
  "size",
  "text",
  "ariaLabel",
  "badge",
  "tooltipText",
  "disabledNote",
  "ariaExpanded",
  "ariaHasPopup",
  "ariaControls",
];

function setButtonInputs(componentRef, props) {
  for (const inputName of buttonInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }

  componentRef.setInput(
    "ico",
    props.icon === "none" ? "" : props.icon === "plus" ? "ui-plus" : props.icon
  );
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
        { provideVoteySvgRegistry, VoteyButtonComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) {
        return;
      }

      const applicationRef = await createApplication({
        providers: [provideVoteySvgRegistry()],
      });

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const buttonHost = document.createElement("vt-button");
      hostRef.current.replaceChildren(buttonHost);

      const componentRef = createComponent(VoteyButtonComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: buttonHost,
      });
      const pressedSubscription = componentRef.instance.pressed.subscribe(
        () => {
          latestPropsRef.current.onPressed();
        }
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };

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
      table: { category: "Accessibility" },
    },
    ariaLabel: {
      control: { type: "text" },
      table: { category: "Accessibility" },
    },
    ariaHasPopup: {
      options: [null, "dialog", "grid", "listbox", "menu", "tree"],
      control: { type: "select" },
      table: { category: "Accessibility" },
    },
    ariaControls: {
      control: { type: "text" },
      table: { category: "Accessibility" },
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
    ariaLabel: "",
    icon: "plus",
    badge: null,
    tooltipText: "Dodaj uczestnika",
    disabledNote: "Ta akcja jest obecnie niedostępna",
    ariaExpanded: null,
    ariaHasPopup: null,
    ariaControls: null,
    onPressed: fn(),
  },
};

export const Playground = {};

const previewStates = ["Default", "Hover", "Pressed", "Disabled"];
const buttonGroups = [
  { title: "Primary", variant: "primary", size: "large", text: "przycisk" },
  { title: "Secondary", variant: "secondary", size: "large", text: "przycisk" },
  { title: "Link", variant: "link", size: "large", text: "przycisk" },
  {
    title: "Primary · Small",
    variant: "primary",
    size: "small",
    text: "przycisk",
  },
  {
    title: "Secondary · Small",
    variant: "secondary",
    size: "small",
    text: "przycisk",
  },
  { title: "Link · Small", variant: "link", size: "small", text: "przycisk" },
  {
    title: "Icon button · Primary · Large",
    variant: "primary",
    size: "large",
    text: "",
    icon: "ui-turn-on-thick",
  },
  {
    title: "Icon button · Secondary · Large",
    variant: "secondary",
    size: "large",
    text: "",
    icon: "ui-turn-on-thick",
  },
  {
    title: "Icon button · Primary · Small",
    variant: "primary",
    size: "small",
    text: "",
    icon: "ui-turn-on-thick",
  },
  {
    title: "Icon button · Secondary · Small",
    variant: "secondary",
    size: "small",
    text: "",
    icon: "ui-turn-on-thick",
  },
];

const buttonSections = [
  { title: "Button · Large", groups: buttonGroups.slice(0, 3) },
  { title: "Button · Small", groups: buttonGroups.slice(3, 6) },
  { title: "Icon button · Large", groups: buttonGroups.slice(6, 8) },
  { title: "Icon button · Small", groups: buttonGroups.slice(8, 10) },
];

const figmaButtonCases = buttonSections.flatMap((section) =>
  section.groups.flatMap((group) =>
    previewStates.map((state) => ({
      ...group,
      sectionTitle: section.title,
      state,
      props: {
        disabled: state === "Disabled",
        type: "button",
        variant: group.variant,
        size: group.size,
        text: group.text,
        ariaLabel: group.icon ? "Przycisk z ikoną zasilania" : "",
        icon: group.icon ?? "none",
        badge: null,
        tooltipText: "",
        disabledNote: "",
        ariaExpanded: null,
        ariaHasPopup: null,
        ariaControls: null,
      },
    }))
  )
);

function AngularButtonGallery({ cases }) {
  const galleryRef = useRef(null);
  const runtimeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function mountGallery() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { provideVoteySvgRegistry, VoteyButtonComponent },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !galleryRef.current) return;

      const applicationRef = await createApplication({
        providers: [provideVoteySvgRegistry()],
      });
      const componentRefs = [];

      cases.forEach(({ props }, index) => {
        const target = galleryRef.current.querySelector(
          `[data-preview-index="${index}"]`
        );
        if (!target) return;

        const buttonHost = document.createElement("vt-button");
        buttonHost.dataset.previewState = cases[index].state.toLowerCase();
        target.append(buttonHost);

        const componentRef = createComponent(VoteyButtonComponent, {
          environmentInjector: applicationRef.injector,
          hostElement: buttonHost,
        });
        applicationRef.attachView(componentRef.hostView);
        setButtonInputs(componentRef, props);
        componentRefs.push(componentRef);
      });

      applicationRef.tick();
      runtimeRef.current = { applicationRef, componentRefs };
    }

    void mountGallery();

    return () => {
      isMounted = false;
      const runtime = runtimeRef.current;
      if (!runtime) return;
      runtime.componentRefs.forEach((componentRef) => {
        runtime.applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
      });
      runtime.applicationRef.destroy();
      runtimeRef.current = null;
    };
  }, [cases]);

  return (
    <div className="button-figma-board" ref={galleryRef}>
      <h2>Button</h2>
      <div className="button-figma-groups">
        {buttonSections.map((section) => (
          <section className="button-figma-section" key={section.title}>
            <h3>{section.title}</h3>
            <div className="button-figma-variants">
              {section.groups.map((group) => (
                <div className="button-figma-variant" key={group.title}>
                  <h4>{group.title}</h4>
                  <div className="button-figma-states">
                    {previewStates.map((state) => {
                      const index = figmaButtonCases.findIndex(
                        (buttonCase) =>
                          buttonCase.title === group.title &&
                          buttonCase.state === state
                      );
                      return (
                        <div className="button-figma-case" key={state}>
                          <span className="button-figma-state">{state}</span>
                          <div
                            className="button-figma-preview"
                            data-preview-index={index}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export const FigmaVariants = {
  name: "Warianty z Figmy",
  render: () => <AngularButtonGallery cases={figmaButtonCases} />,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
};
