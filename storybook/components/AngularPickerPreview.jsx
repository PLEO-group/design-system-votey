import React, { useEffect, useRef, useState } from "react";
import "./AngularPickerPreview.scss";

const translations = {
  "LABEL.DATE": "Data",
  "LABEL.TIME": "Godzina",
  "LABEL.SELECT_TIME": "Wybierz godzinę",
  "LABEL.TIME_FORMAT": "GG:MM",
  "LABEL.DATE_FORMAT": "DD.MM.RRRR",
  "LABEL.DATE_TIME_FORMAT": "DD.MM.RRRR, GG:MM",
  "LABEL.WEEKDAY_SUNDAY_SHORT": "Nd",
  "LABEL.WEEKDAY_MONDAY_SHORT": "Pn",
  "LABEL.WEEKDAY_TUESDAY_SHORT": "Wt",
  "LABEL.WEEKDAY_WEDNESDAY_SHORT": "Śr",
  "LABEL.WEEKDAY_THURSDAY_SHORT": "Cz",
  "LABEL.WEEKDAY_FRIDAY_SHORT": "Pt",
  "LABEL.WEEKDAY_SATURDAY_SHORT": "So",
  "LABEL.CALENDAR": "Kalendarz",
  "LABEL.PREVIOUS_YEAR": "Poprzedni rok",
  "LABEL.NEXT_YEAR": "Następny rok",
  "LABEL.PREVIOUS_24_YEARS": "Poprzednie 24 lata",
  "LABEL.NEXT_24_YEARS": "Następne 24 lata",
  "LABEL.CHOOSE_DATE": "Wybierz datę",
  "LABEL.CHOOSE_MONTH_AND_YEAR": "Wybierz miesiąc i rok",
  "LABEL.YEAR_RANGE_LABEL": "{start}–{end}",
  "LABEL.CLEAR": "Wyczyść pole",
  "LABEL.PREVIOUS_MONTH": "Poprzedni miesiąc",
  "LABEL.NEXT_MONTH": "Następny miesiąc",
  "ERRORS.VOTEYPICKERFORMAT": "Nieprawidłowy format",
  "ERRORS.VOTEYPICKERDATE": "Nieistniejąca data",
  "ERRORS.VOTEYPICKERTIME": "Nieprawidłowa godzina",
  "ERRORS.VOTEYPICKERRANGE": "Wartość poza zakresem",
  "ERRORS.VOTEYPICKERPOLICY": "Wybierz godzinę z listy",
  "ERRORS.VOTEYPICKERCONFIG": "Nieprawidłowa konfiguracja pola",
};

export function AngularPickerPreview({ kind, ...props }) {
  const hostRef = useRef(null);
  const runtimeRef = useRef(null);
  const [state, setState] = useState({ value: null, errors: null, events: [] });
  const propsKey = JSON.stringify(props);

  useEffect(() => {
    let mounted = true;

    async function mount() {
      await import("@angular/compiler");
      const [{ createComponent }, { createApplication }, { FormControl, Validators }, library] =
        await Promise.all([
          import("@angular/core"),
          import("@angular/platform-browser"),
          import("@angular/forms"),
          import("@pleodigital/design-system-votey/angular"),
        ]);
      if (!mounted || !hostRef.current) return;

      const application = await createApplication({
        providers: [
          library.provideVoteySvgRegistry(),
          {
            provide: library.VOTEY_TRANSLATOR,
            useValue: { translate: (key, params) =>
              (translations[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => String(params?.[name] ?? `{${name}}`)) },
          },
        ],
      });
      if (!mounted || !hostRef.current) {
        application.destroy();
        return;
      }

      const selector = kind === "date" ? "vt-date-picker" : "vt-time-picker";
      const component = kind === "date" ? library.VoteyDatePickerComponent : library.VoteyTimePickerComponent;
      const host = document.createElement(selector);
      hostRef.current.replaceChildren(host);
      const ref = createComponent(component, {
        environmentInjector: application.injector,
        hostElement: host,
      });
      const control = new FormControl(null);
      const subscription = control.valueChanges.subscribe((value) => {
        setState((previous) => ({
          value,
          errors: control.errors,
          events: [`value: ${value ?? "null"}`, ...previous.events].slice(0, 5),
        }));
      });
      ref.setInput("control", control);
      application.attachView(ref.hostView);
      runtimeRef.current = { application, ref, control, subscription, Validators };
      applyProps(runtimeRef.current, props, kind);
      application.tick();
    }

    void mount().catch((error) => {
      if (mounted) {
        setState((previous) => ({ ...previous, runtimeError: String(error) }));
      }
    });
    return () => {
      mounted = false;
      const runtime = runtimeRef.current;
      if (runtime) {
        runtime.subscription.unsubscribe();
        runtime.application.detachView(runtime.ref.hostView);
        runtime.ref.destroy();
        runtime.application.destroy();
        runtimeRef.current = null;
      }
    };
  }, [kind]);

  useEffect(() => {
    if (!runtimeRef.current) return;
    applyProps(runtimeRef.current, props, kind);
    runtimeRef.current.application.tick();
    setState((previous) => ({ ...previous, value: runtimeRef.current.control.value, errors: runtimeRef.current.control.errors }));
  }, [propsKey, kind]);

  return (
    <div className="picker-playground">
      <div className="picker-host" ref={hostRef} />
      <pre aria-label="Stan formularza">{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

function applyProps(runtime, props, kind) {
  const { ref, control, Validators } = runtime;
  control.setValidators(props.required ? Validators.required : null);
  if (control.value !== props.value) control.setValue(props.value ?? null);
  control.updateValueAndValidity({ emitEvent: false });
  if (props.showError) {
    control.markAsTouched();
    control.setErrors({ ...control.errors, required: true });
  } else {
    control.markAsUntouched();
  }
  if (props.disabled) control.disable({ emitEvent: false });
  else control.enable({ emitEvent: false });

  for (const name of ["label", "disabled", "stepMinutes", "timeEntryPolicy",
    ...(kind === "date" ? ["mode", "min", "max", "locale"] : [])]) {
    ref.setInput(name, props[name]);
  }
}
