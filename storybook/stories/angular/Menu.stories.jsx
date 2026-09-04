import React, { useEffect, useRef } from "react";
import { fn } from "@storybook/test";
import "./Menu.stories.scss";

const menuInputs = [
  "items",
  "ariaLabel",
  "ariaLabelledby",
  "selectedId",
  "dataCy",
];

function setMenuInputs(componentRef, props) {
  for (const inputName of menuInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularMenuPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularMenu() {
      await import("@angular/compiler");
      const [{ createComponent }, { createApplication }, { VoteyMenuComponent }] =
        await Promise.all([
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

      const menuHost = document.createElement("vt-menu");
      hostRef.current.replaceChildren(menuHost);

      const componentRef = createComponent(VoteyMenuComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: menuHost,
      });
      const itemSelectedSubscription = componentRef.instance.itemSelected.subscribe(
        (item) => latestPropsRef.current.onItemSelected(item),
      );
      const dismissedSubscription = componentRef.instance.dismissed.subscribe(() =>
        latestPropsRef.current.onDismissed(),
      );

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };
      setMenuInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        itemSelectedSubscription.unsubscribe();
        dismissedSubscription.unsubscribe();
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularMenu();

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

    setMenuInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-menu-story">
      <div ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Menu",
  component: AngularMenuPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: { control: "object" },
    ariaLabelledby: { control: "text" },
    dataCy: { control: "text" },
    onItemSelected: {
      action: "itemSelected",
      table: { category: "Events" },
    },
    onDismissed: {
      action: "dismissed",
      table: { category: "Events" },
    },
  },
  args: {
    items: [
      { id: "profile", label: "Profil" },
      { id: "settings", label: "Ustawienia" },
      { id: "organizations", label: "Organizacje" },
      { id: "logout", label: "Wyloguj się" },
    ],
    ariaLabel: "Menu użytkownika",
    ariaLabelledby: null,
    selectedId: null,
    dataCy: null,
    onItemSelected: fn(),
    onDismissed: fn(),
  },
};

export const Playground = {};
