import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./Search.stories.scss";

function AngularSearchPreview(props) {
  const host = useRef(null);
  const runtime = useRef(null);
  const latest = useRef(props);
  const [, updateArgs] = useArgs();
  latest.current = props;

  function apply(ref, control, args) {
    control.setValue(args.value, { emitEvent: false });
    ref.setInput("control", control);
    for (const name of ["label", "placeholder", "ariaLabel", "searchLabel", "clearLabel", "disabled"]) ref.setInput(name, args[name]);
  }

  useEffect(() => {
    let mounted = true;
    async function mount() {
      await import("@angular/compiler");
      const [ng, platform, forms, ds] = await Promise.all([
        import("@angular/core"), import("@angular/platform-browser"),
        import("@angular/forms"), import("@pleodigital/design-system-votey/angular"),
      ]);
      const app = await platform.createApplication({ providers: [ds.provideVoteySvgRegistry()] });
      if (!mounted || !host.current) { app.destroy(); return; }
      const element = document.createElement("vt-search");
      host.current.replaceChildren(element);
      const ref = ng.createComponent(ds.VoteySearchComponent, { hostElement: element, environmentInjector: app.injector });
      const control = new forms.FormControl(latest.current.value);
      const subscriptions = [
        control.valueChanges.subscribe(value => updateArgs({ value })),
        ref.instance.searched.subscribe(value => latest.current.onSearch(value)),
        ref.instance.cleared.subscribe(() => latest.current.onClear()),
      ];
      apply(ref, control, latest.current);
      app.attachView(ref.hostView);
      runtime.current = { app, ref, control, subscriptions };
      app.tick();
    }
    void mount();
    return () => {
      mounted = false;
      const current = runtime.current;
      if (current) {
        current.subscriptions.forEach(subscription => subscription.unsubscribe());
        current.app.detachView(current.ref.hostView);
        current.ref.destroy();
        current.app.destroy();
      }
      runtime.current = null;
    };
  }, []);

  useEffect(() => {
    const current = runtime.current;
    if (current) { apply(current.ref, current.control, props); current.app.tick(); }
  }, [props]);

  return <div className="search-story"><div ref={host} /></div>;
}

export default {
  title: "ANGULAR COMPONENTS/Search", component: AngularSearchPreview,
  parameters: { layout: "padded" },
  args: {
    label: "", placeholder: "Szukaj", ariaLabel: "Szukaj", searchLabel: "Szukaj",
    clearLabel: "Wyczyść wyszukiwanie", value: "", disabled: false,
    onSearch: fn(), onClear: fn(),
  },
};

export const Playground = {};
