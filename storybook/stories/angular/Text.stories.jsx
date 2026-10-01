import React, { useEffect, useRef } from "react";
import "@angular/compiler";
import { expect, waitFor, within } from "@storybook/test";
import {
  VoteyTextColors,
  VoteyTextVariants,
} from "@pleodigital/design-system-votey/angular";
import "./Text.stories.scss";

const textInputs = [
  "content",
  "variant",
  "color",
  "uppercase",
  "italic",
  "wrap",
  "maxLines",
];

function setTextInputs(componentRef, props) {
  for (const inputName of textInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }
}

function AngularTextPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularText() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { VoteyTextComponent },
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

      const textHost = document.createElement("vt-text");
      hostRef.current.replaceChildren(textHost);

      const componentRef = createComponent(VoteyTextComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: textHost,
      });

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef };

      setTextInputs(componentRef, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularText();

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

    setTextInputs(angularRuntime.componentRef, props);
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-text-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/Text",
  component: AngularTextPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: VoteyTextVariants,
      control: { type: "select" },
    },
    color: {
      options: VoteyTextColors,
      control: { type: "select" },
    },
    maxLines: {
      control: { type: "number", min: 0, step: 1 },
    },
  },
  args: {
    content:
      "Komponent tekstowy Votey korzysta z responsywnych tokenów typografii Angular CRM.",
    variant: "body",
    color: "primary",
    uppercase: false,
    italic: false,
    wrap: false,
    maxLines: 0,
  },
};

export const Playground = {};

const browserCases = [
  { name: "text", content: "Plain text", expected: "Plain text" },
  { name: "number", content: 42, expected: "42" },
  { name: "zero", content: 0, expected: "0" },
  { name: "null", content: null, expected: "" },
  { name: "undefined", content: undefined, expected: "" },
  { name: "html", content: "<b>Literal</b>", expected: "<b>Literal</b>" },
  { name: "modifiers", content: "Modified", uppercase: true, italic: true },
  { name: "default-wrap", content: "Several words for natural wrapping ".repeat(4) },
  { name: "wrap", content: "averylongwordwithoutspaces".repeat(4), wrap: true },
  { name: "clamp", content: "Several words for line wrapping ".repeat(8), maxLines: 2 },
  { name: "zero-lines", content: "No limit", maxLines: 0 },
  { name: "negative", content: "Invalid limit", maxLines: -1 },
  { name: "fraction", content: "Invalid limit", maxLines: 1.5 },
  { name: "infinity", content: "Invalid limit", maxLines: Infinity },
  { name: "not-a-number", content: "Invalid limit", maxLines: "invalid" },
  { name: "wrap-clamp", content: "averylongwordwithoutspaces".repeat(4), wrap: true, maxLines: 2 },
  { name: "action", content: "Action", variant: "action", token: "action" },
  { name: "action-s", content: "Small action", variant: "action-s", token: "action-s" },
  { name: "column-header", content: "Header", variant: "column-header", token: "column-header" },
  { name: "error", content: "Error", color: "error" },
];

const browserChecks = {
  render: () => (
    <div className="browser-checks">
      {browserCases.map(({ name, expected, token, ...props }) => (
        <div data-case={name} key={name}>
          <AngularTextPreview
            variant="body"
            color="primary"
            uppercase={false}
            italic={false}
            wrap={false}
            maxLines={0}
            {...props}
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const probe = document.createElement("span");
    canvasElement.appendChild(probe);

    await waitFor(() => {
      expect(canvasElement.querySelectorAll("vt-text span")).toHaveLength(browserCases.length);
    });

    for (const { name, expected, token } of browserCases) {
      const host = canvasElement.querySelector(`[data-case="${name}"]`);
      const span = host.querySelector("vt-text span");

      if (expected !== undefined) {
        expect(span.textContent.trim()).toBe(expected);
      }
      if (token) {
        probe.style.fontSize = `var(--typo-${token}-font-size)`;
        expect(getComputedStyle(span).fontSize).toBe(getComputedStyle(probe).fontSize);
      }
    }

    expect(canvas.getByText("<b>Literal</b>").querySelector("b")).toBeNull();

    const getSpan = (name) => canvasElement.querySelector(`[data-case="${name}"] vt-text span`);
    expect(getSpan("modifiers")).toHaveClass("uppercase", "italic");
    expect(getSpan("wrap")).toHaveClass("wrap", "constrained");
    expect(getSpan("wrap")).not.toHaveClass("ellipsis");
    expect(getSpan("clamp")).toHaveClass("ellipsis", "constrained");
    expect(getSpan("zero-lines")).not.toHaveClass("ellipsis");
    expect(getSpan("negative")).not.toHaveClass("ellipsis");
    expect(getSpan("fraction")).not.toHaveClass("ellipsis");
    expect(getSpan("infinity")).not.toHaveClass("ellipsis");
    expect(getSpan("not-a-number")).not.toHaveClass("ellipsis");
    for (const name of ["zero-lines", "negative", "fraction", "infinity", "not-a-number"]) {
      expect(getSpan(name).style.getPropertyValue("--vt-text-max-lines")).toBe("0");
    }
    expect(getSpan("wrap-clamp")).toHaveClass("wrap", "constrained");
    expect(getSpan("wrap-clamp")).not.toHaveClass("ellipsis");

    const wrapped = getSpan("wrap");
    const defaultWrapped = getSpan("default-wrap");
    const clamped = getSpan("clamp");
    const defaultLineHeight = parseFloat(getComputedStyle(defaultWrapped).lineHeight);
    const wrappedLineHeight = parseFloat(getComputedStyle(wrapped).lineHeight);
    const clampedLineHeight = parseFloat(getComputedStyle(clamped).lineHeight);
    expect(wrapped.getBoundingClientRect().height).toBeGreaterThan(wrappedLineHeight);
    expect(defaultWrapped.getBoundingClientRect().height).toBeGreaterThan(defaultLineHeight);
    expect(clamped.getBoundingClientRect().height).toBeLessThanOrEqual(2 * clampedLineHeight + 1);

    const originalTheme = document.documentElement.getAttribute("data-theme");
    try {
      for (const theme of ["light", "dark"]) {
        document.documentElement.setAttribute("data-theme", theme);
        probe.style.color = "var(--color-text-primary)";
        expect(getComputedStyle(getSpan("text")).color).toBe(getComputedStyle(probe).color);
        probe.style.color = "var(--color-state-error)";
        expect(getComputedStyle(getSpan("error")).color).toBe(getComputedStyle(probe).color);
      }
    } finally {
      if (originalTheme === null) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", originalTheme);
      }
      probe.remove();
    }
  },
};

export const BrowserChecksMobile = {
  ...browserChecks,
  parameters: { viewport: { defaultViewport: "mobile360" } },
};

export const BrowserChecksDesktop = {
  ...browserChecks,
  parameters: { viewport: { defaultViewport: "desktop1920" } },
};
