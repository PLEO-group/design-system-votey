import React, { useEffect, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";
import "./FilePicker.stories.scss";

const filePickerTranslations = {
  "LABEL.ATTACHMENT": "Załącznik",
  "MESSAGE.FILE_PICKER_EMPTY": "Nie wybrano pliku",
  "MESSAGE.FILE_UPLOAD_IN_PROGRESS": "Przesyłanie",
  "MESSAGE.FILE_PICKER_DROPZONE_PROMPT":
    "Przeciągnij pliki tutaj lub kliknij, aby wybrać",
  "MESSAGE.FILE_PICKER_DROPZONE_HINT":
    "({{formats}}), maks. {{maxSize}} na plik",
  "BUTTON.CHOOSE_FILE": "Wybierz plik",
  "BUTTON.CHOOSE_FILES": "Wybierz pliki",
  "BUTTON.DELETE": "Usuń plik",
  "BUTTON.CANCEL": "Anuluj",
  "BUTTON.TRY_AGAIN": "Spróbuj ponownie",
  "BUTTON.PREVIEW_FILE": "Podgląd pliku",
  "MESSAGE.FILE_PICKER_DONE": "Gotowe",
  "MESSAGE.FILE_PICKER_PENDING": "Do zapisania",
  "ERRORS.FILE_UPLOAD_FAILED": "Błąd przesyłania",
  "ERRORS.FILE_PICKER_INVALID_TYPE": "Nieobsługiwany typ pliku",
  "ERRORS.FILE_PICKER_FILE_TOO_LARGE": "Plik jest zbyt duży",
  "ERRORS.FILE_PICKER_TOTAL_TOO_LARGE": "Łączny rozmiar plików jest zbyt duży",
  "ERRORS.FILE_PICKER_TOO_MANY_FILES": "Wybrano zbyt wiele plików",
};

const filePickerInputs = [
  "variant",
  "filename",
  "label",
  "emptyText",
  "actionText",
  "disabled",
  "loading",
  "progress",
  "multiple",
  "dropEnabled",
  "clearable",
  "clearText",
  "loadingText",
  "dropzoneTitle",
  "dropzoneHint",
  "dropzoneActionText",
  "doneText",
  "pendingText",
  "previewText",
  "uploadErrorText",
  "retryText",
  "cancelText",
  "files",
  "allowedExtensions",
  "allowedMimeTypes",
  "maxFileSizeBytes",
  "maxTotalSizeBytes",
  "currentTotalSizeBytes",
  "maxFiles",
  "currentFilesCount",
  "validationErrorKeys",
  "ignoredErrors",
];

function createFile(filename) {
  return filename ? new File([], filename) : undefined;
}

function setFilePickerInputs(componentRef, control, props) {
  control.setValue(createFile(props.filename) ?? null, { emitEvent: false });
  componentRef.setInput("control", control);

  for (const inputName of filePickerInputs) {
    componentRef.setInput(inputName, props[inputName]);
  }

  componentRef.setInput("initialValue", createFile(props.initialFilename));
  componentRef.setInput("staticValue", createFile(props.staticFilename));
  componentRef.setInput("disable", props.disable);
  componentRef.setInput("block", props.block);
}

function AngularFilePickerPreview(props) {
  const hostRef = useRef(null);
  const angularRuntimeRef = useRef(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    let isMounted = true;

    async function mountAngularFilePicker() {
      await import("@angular/compiler");
      const [
        { createComponent },
        { createApplication },
        { FormControl },
        {
          provideVoteySvgRegistry,
          VOTEY_TRANSLATOR,
          VoteyFilePickerComponent,
        },
      ] = await Promise.all([
        import("@angular/core"),
        import("@angular/platform-browser"),
        import("@angular/forms"),
        import("@pleodigital/design-system-votey/angular"),
      ]);

      if (!isMounted || !hostRef.current) return;

      const applicationRef = await createApplication({
        providers: [
          provideVoteySvgRegistry(),
          {
            provide: VOTEY_TRANSLATOR,
            useValue: {
              translate: (key, params) => {
                let translatedText = filePickerTranslations[key] ?? key;

                for (const [paramName, paramValue] of Object.entries(
                  params ?? {}
                )) {
                  translatedText = translatedText.replaceAll(
                    `{{${paramName}}}`,
                    String(paramValue)
                  );
                }

                return translatedText;
              },
            },
          },
        ],
      });

      if (!isMounted || !hostRef.current) {
        applicationRef.destroy();
        return;
      }

      const filePickerHost = document.createElement("vt-file-picker");
      hostRef.current.replaceChildren(filePickerHost);

      const componentRef = createComponent(VoteyFilePickerComponent, {
        environmentInjector: applicationRef.injector,
        hostElement: filePickerHost,
      });
      const subscriptions = [
        componentRef.instance.changed.subscribe((file) =>
          latestPropsRef.current.onChanged(file)
        ),
        componentRef.instance.filesChanged.subscribe((files) =>
          latestPropsRef.current.onFilesChanged(files)
        ),
        componentRef.instance.cleared.subscribe(() =>
          latestPropsRef.current.onCleared()
        ),
        componentRef.instance.cancelled.subscribe(() =>
          latestPropsRef.current.onCancelled()
        ),
        componentRef.instance.rejected.subscribe((rejection) =>
          latestPropsRef.current.onRejected(rejection)
        ),
        componentRef.instance.fileRemoved.subscribe((file) =>
          latestPropsRef.current.onFileRemoved(file)
        ),
        componentRef.instance.fileRetry.subscribe((file) =>
          latestPropsRef.current.onFileRetry(file)
        ),
        componentRef.instance.fileCancelled.subscribe((file) =>
          latestPropsRef.current.onFileCancelled(file)
        ),
        componentRef.instance.filePreview.subscribe((file) =>
          latestPropsRef.current.onFilePreview(file)
        ),
      ];
      const control = new FormControl(null);

      applicationRef.attachView(componentRef.hostView);
      angularRuntimeRef.current = { applicationRef, componentRef, control };
      setFilePickerInputs(componentRef, control, latestPropsRef.current);
      applicationRef.tick();

      angularRuntimeRef.current.destroy = () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        applicationRef.destroy();
      };
    }

    void mountAngularFilePicker();

    return () => {
      isMounted = false;
      angularRuntimeRef.current?.destroy?.();
      angularRuntimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const angularRuntime = angularRuntimeRef.current;

    if (!angularRuntime) return;

    setFilePickerInputs(
      angularRuntime.componentRef,
      angularRuntime.control,
      props
    );
    angularRuntime.applicationRef.tick();
  }, [props]);

  return (
    <div className="angular-file-picker-story">
      <div className="preview" ref={hostRef} />
    </div>
  );
}

export default {
  title: "ANGULAR COMPONENTS/File Picker",
  component: AngularFilePickerPreview,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: { control: false },
    files: {
      control: "object",
      description: "External file rows for the dropzone variant.",
    },
    filename: {
      description: "Controlled filename for an existing or previewed file.",
    },
    onChanged: { action: "changed", table: { category: "Events" } },
    onFilesChanged: {
      action: "filesChanged",
      table: { category: "Events" },
    },
    onCleared: { action: "cleared", table: { category: "Events" } },
    onCancelled: { action: "cancelled", table: { category: "Events" } },
    onRejected: { action: "rejected", table: { category: "Events" } },
    onFileRemoved: {
      action: "fileRemoved",
      table: { category: "Events" },
    },
    onFileRetry: { action: "fileRetry", table: { category: "Events" } },
    onFileCancelled: {
      action: "fileCancelled",
      table: { category: "Events" },
    },
    onFilePreview: {
      action: "filePreview",
      table: { category: "Events" },
    },
    initialFilename: { description: "Value passed through initialValue." },
    staticFilename: { description: "Value passed through staticValue." },
    disable: { control: "boolean" },
    block: { control: "boolean" },
  },
  args: {
    variant: "compact",
    filename: "",
    label: "LABEL.ATTACHMENT",
    emptyText: "MESSAGE.FILE_PICKER_EMPTY",
    actionText: "BUTTON.CHOOSE_FILE",
    disabled: false,
    loading: false,
    progress: null,
    multiple: false,
    dropEnabled: true,
    clearable: true,
    clearText: "BUTTON.DELETE",
    loadingText: "MESSAGE.FILE_UPLOAD_IN_PROGRESS",
    dropzoneTitle: "MESSAGE.FILE_PICKER_DROPZONE_PROMPT",
    dropzoneHint: "MESSAGE.FILE_PICKER_DROPZONE_HINT",
    dropzoneActionText: "BUTTON.CHOOSE_FILES",
    doneText: "MESSAGE.FILE_PICKER_DONE",
    pendingText: "MESSAGE.FILE_PICKER_PENDING",
    previewText: "BUTTON.PREVIEW_FILE",
    uploadErrorText: "ERRORS.FILE_UPLOAD_FAILED",
    retryText: "BUTTON.TRY_AGAIN",
    cancelText: "BUTTON.CANCEL",
    files: null,
    allowedExtensions: [],
    allowedMimeTypes: [],
    maxFileSizeBytes: null,
    maxTotalSizeBytes: null,
    currentTotalSizeBytes: 0,
    maxFiles: null,
    currentFilesCount: 0,
    validationErrorKeys: {},
    ignoredErrors: [],
    initialFilename: "",
    staticFilename: "",
    disable: undefined,
    block: undefined,
    onChanged: fn(),
    onFilesChanged: fn(),
    onCleared: fn(),
    onCancelled: fn(),
    onRejected: fn(),
    onFileRemoved: fn(),
    onFileRetry: fn(),
    onFileCancelled: fn(),
    onFilePreview: fn(),
  },
};

function renderFilePickerPlayground(variant) {
  return function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <AngularFilePickerPreview
        {...args}
        variant={variant}
        onChanged={(file) => {
          args.onChanged(file);
          updateArgs({ filename: file?.name ?? "" });
        }}
      />
    );
  };
}

export const CompactPlayground = {
  name: "Compact",
  args: { variant: "compact" },
  render: renderFilePickerPlayground("compact"),
};

export const DropzonePlayground = {
  name: "Dropzone",
  args: { variant: "dropzone" },
  render: renderFilePickerPlayground("dropzone"),
};
