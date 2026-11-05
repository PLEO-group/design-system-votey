import React, { useEffect, useRef } from "react";
import "@angular/compiler";
import { VoteyIllustrationNames, VoteyInfoTileStates } from "@pleodigital/design-system-votey/angular";
import "./InfoTile.stories.scss";

function setInfoTileInputs(componentRef, props) {
  for (const name of ["title", "items", "illustration", "state", "statusLabel"]) {
    componentRef.setInput(name, props[name]);
  }
}

function AngularInfoTilePreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularInfoTile() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { provideVoteySvgRegistry, VoteyInfoTileComponent },
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

      const tileHost = document.createElement("vt-info-tile");
      hostRef.current.replaceChildren(tileHost);

      const componentRef = createComponent(VoteyInfoTileComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: tileHost,
      });
      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };

      setInfoTileInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularInfoTile();

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

    setInfoTileInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return <div className="angular-info-tile-story" ref={hostRef} />;
}

export default {
  title: "ANGULAR COMPONENTS/InfoTile",
  component: AngularInfoTilePreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    items: { control: "object" },
    illustration: { control: "select", options: ["", ...VoteyIllustrationNames] },
    state: { control: "select", options: VoteyInfoTileStates },
    statusLabel: { control: "text", description: "Consumer-translated badge text; visible in non-default states." },
  },
  args: {
    title: "I. Single vote | Automatic | Yes - No | Public",
    items: [
      { id: "date", icon: "ui-calendar", value: "11 FEB 2020 - 13 FEB 2020" },
      { id: "access", icon: "ui-participant", value: "PUBLIC ACCESS" },
      { id: "votes", icon: "ui-voting", value: "1 VOTE" },
    ],
    illustration: "bg-event-type-basic",
    state: "default",
    statusLabel: "Status",
  },
};

export const Playground = {};

const stateLabels = {
  default: "Default",
  running: "Running",
  completed: "Completed",
  test: "Test",
  "not-launched": "Not launched",
  scheduled: "Scheduled",
};

export const AllStates = {
  name: "All states",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
  render: () => (
    <div className="angular-info-tile-states">
      {VoteyInfoTileStates.map((state) => (
        <section className="state-preview" key={state}>
          <h2 className="state-label">{stateLabels[state]}</h2>
          <AngularInfoTilePreview
            title="I. Single vote | Automatic | Yes - No | Public"
            items={[
              { id: "date", icon: "ui-calendar", value: "11 FEB 2020 - 13 FEB 2020" },
              { id: "access", icon: "ui-participant", value: "PUBLIC ACCESS" },
              { id: "votes", icon: "ui-voting", value: "1 VOTE" },
            ]}
            illustration="bg-event-type-basic"
            state={state}
            statusLabel={stateLabels[state]}
          />
        </section>
      ))}
    </div>
  ),
};
