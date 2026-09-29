import React, { useEffect, useRef, useState } from "react";
import { fn } from "@storybook/test";

function AngularPaginationPreview(props) {
  const hostRef = useRef(null);
  const runtimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  const [page, setPage] = useState(props.page);
  const [size, setSize] = useState(props.size);
  latestPropsRef.current = props;

  useEffect(() => {
    setPage(props.page);
    setSize(props.size);
  }, [props.page, props.size]);

  useEffect(() => {
    let isMounted = true;

    async function mount() {
      await import("@angular/compiler");
      const [{ createComponent }, { createApplication }, { VoteyPaginationComponent, VOTEY_TRANSLATOR }] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@pleodigital/design-system-votey/angular"),
      ]);
      if (!isMounted || !hostRef.current) return;

      const labels = {
        "LABEL.PAGINATION": "Pagination",
        "LABEL.PREVIOUS_PAGE": "Previous page",
        "LABEL.NEXT_PAGE": "Next page",
        "LABEL.ITEMS_PER_PAGE": "Items per page",
        "LABEL.PAGE": "Page",
      };
      const applicationRef = await createApplication({
        providers: [{ provide: VOTEY_TRANSLATOR, useValue: { translate: (key) => labels[key] ?? key } }],
      });
      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }
      const host = document.createElement("vt-pagination");
      hostRef.current.replaceChildren(host);
      const componentRef = createComponent(VoteyPaginationComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: host,
      });
      const subscription = componentRef.instance.pagination.subscribe((event) => {
        setPage(event.page);
        setSize(event.size);
        latestPropsRef.current.onPagination(event);
      });
      applicationRef.attachView(componentRef.hostView);
      runtimeRef.current = { applicationRef, componentRef, subscription };
      for (const [name, value] of Object.entries({
        ...latestPropsRef.current,
        page,
        size,
      })) {
        if (name !== "onPagination") componentRef.setInput(name, value);
      }
      applicationRef.tick();
    }

    void mount();
    return () => {
      isMounted = false;
      const runtime = runtimeRef.current;
      if (runtime) {
        runtime.subscription.unsubscribe();
        runtime.applicationRef.detachView(runtime.componentRef.hostView);
        runtime.componentRef.destroy();
        runtime.applicationRef.destroy();
      }
      runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    for (const [name, value] of Object.entries({
      page,
      size,
      totalElements: props.totalElements,
      pageSizeOptions: props.pageSizeOptions,
      disabled: props.disabled,
      loading: props.loading,
    })) runtime.componentRef.setInput(name, value);
    runtime.applicationRef.tick();
  }, [props, page, size]);

  return <div ref={hostRef} style={{ width: "100%" }} />;
}

export default {
  title: "ANGULAR COMPONENTS/Pagination",
  component: AngularPaginationPreview,
  parameters: { layout: "fullscreen" },
  argTypes: { onPagination: { action: "pagination", table: { category: "Events" } } },
  args: {
    page: 0,
    size: 20,
    totalElements: 237,
    pageSizeOptions: [10, 20, 50, 100],
    disabled: false,
    loading: false,
    onPagination: fn(),
  },
};

export const Playground = {};
