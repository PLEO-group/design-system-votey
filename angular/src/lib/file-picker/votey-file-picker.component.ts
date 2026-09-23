import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  type InputSignal,
  type InputSignalWithTransform,
  output,
  type OutputEmitterRef,
  type Signal,
  signal,
  viewChild,
  type WritableSignal,
} from "@angular/core";
import { Validators, type FormControl } from "@angular/forms";
import type { Subscription } from "rxjs";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyFormErrorComponent } from "../form-error/votey-form-error.component";
import { VoteyIconComponent } from "../icon/votey-icon.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import type { VoteyIcon } from "../votey-assets";
import type { VoteyTranslationParams } from "../translation/votey-translation";

export const VoteyFilePickerValidationErrors = [
  "invalidType",
  "fileTooLarge",
  "totalTooLarge",
  "tooManyFiles",
] as const;

const defaultMaxFileSizeBytes = 25 * 1024 * 1024;
const defaultMaxTotalSizeBytes = 250 * 1024 * 1024;

const fileIconByExtension: Readonly<Record<string, VoteyIcon>> = {
  csv: "ui-file-csv",
  doc: "ui-file-doc",
  docx: "ui-file-doc",
  dwg: "ui-file-dwg",
  eml: "ui-file-eml",
  jpg: "ui-file-jpg",
  jpeg: "ui-file-jpg",
  mp3: "ui-file-mp3",
  mp4: "ui-file-mp4",
  pdf: "ui-file-pdf",
  png: "ui-file-png",
  ppt: "ui-file-ppt",
  pptx: "ui-file-ppt",
  rar: "ui-file-rar",
  rtf: "ui-file-rtf",
  tif: "ui-file-tif",
  tiff: "ui-file-tif",
  txt: "ui-file-txt",
  xls: "ui-file-xls",
  xlsx: "ui-file-xls",
  xml: "ui-file-xml",
  zip: "ui-file-zip",
};

export type VoteyFilePickerValidationError =
  (typeof VoteyFilePickerValidationErrors)[number];

export type VoteyFilePickerValidationErrorKeys = Readonly<
  Partial<Record<VoteyFilePickerValidationError, string>>
>;

const filePickerVariants = ["compact", "dropzone"] as const;
const filePickerFileStates = [
  "done",
  "pending",
  "uploading",
  "error",
] as const;

export type VoteyFilePickerVariant = (typeof filePickerVariants)[number];
export type VoteyFilePickerFileState =
  (typeof filePickerFileStates)[number];

export interface VoteyFilePickerFile {
  readonly id: string;
  readonly filename: string;
  readonly meta?: string;
  readonly state?: VoteyFilePickerFileState;
  readonly progress?: number | null;
  readonly speed?: string;
  readonly icon?: VoteyIcon;
  readonly statusText?: string;
}

export interface VoteyFilePickerRejection {
  readonly files: readonly File[];
  readonly errors: readonly VoteyFilePickerValidationError[];
}

const defaultValidationErrorKeys: Readonly<
  Record<VoteyFilePickerValidationError, string>
> = {
  invalidType: "ERRORS.FILE_PICKER_INVALID_TYPE",
  fileTooLarge: "ERRORS.FILE_PICKER_FILE_TOO_LARGE",
  totalTooLarge: "ERRORS.FILE_PICKER_TOTAL_TOO_LARGE",
  tooManyFiles: "ERRORS.FILE_PICKER_TOO_MANY_FILES",
};

function optionalNonNegativeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const numericValue = Number(value);

  return Number.isFinite(numericValue) && numericValue >= 0
    ? numericValue
    : null;
}

function nonNegativeNumber(value: unknown): number {
  return optionalNonNegativeNumber(value) ?? 0;
}

function progressNumber(value: unknown): number | null {
  const numericValue = optionalNonNegativeNumber(value);

  return numericValue === null ? null : Math.min(numericValue, 100);
}

@Component({
  selector: "vt-file-picker",
  templateUrl: "./votey-file-picker.component.html",
  styleUrl: "./votey-file-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VoteyFormErrorComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
    VoteyButtonComponent,
    VoteyIconComponent,
  ],
})
export class VoteyFilePickerComponent
  extends VoteyFormControlApplyDirective<File>
  implements OnDestroy
{
  protected readonly variantNames: Readonly<
    Record<VoteyFilePickerVariant, VoteyFilePickerVariant>
  > = {
    compact: filePickerVariants[0],
    dropzone: filePickerVariants[1],
  };
  protected readonly fileStateNames: Readonly<
    Record<VoteyFilePickerFileState, VoteyFilePickerFileState>
  > = {
    done: filePickerFileStates[0],
    pending: filePickerFileStates[1],
    uploading: filePickerFileStates[2],
    error: filePickerFileStates[3],
  };
  public readonly variant: InputSignal<VoteyFilePickerVariant> =
    input<VoteyFilePickerVariant>("compact");
  public readonly filename: InputSignal<string> = input<string>("");
  public readonly label: InputSignal<string> = input<string>("");
  public readonly emptyText: InputSignal<string> =
    input<string>("NO_FILE_SELECTED");
  public readonly actionText: InputSignal<string> =
    input<string>("BUTTON.CHOOSE_FILE");
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly progress: InputSignalWithTransform<number | null, unknown> =
    input<number | null, unknown>(null, { transform: progressNumber });
  public readonly name: InputSignal<string> = input<string>("");
  public readonly accept: InputSignal<string> = input<string>("");
  public readonly capture: InputSignal<string> = input<string>("");
  public readonly dataCy: InputSignal<string> = input<string>("");
  public readonly multiple: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(false, { transform: booleanAttribute });
  public readonly dropEnabled: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly clearable: InputSignalWithTransform<boolean, unknown> =
    input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly clearText: InputSignal<string> =
    input<string>("BUTTON.DELETE");
  public readonly loadingText: InputSignal<string> = input<string>("LOADING");
  public readonly dropzoneTitle: InputSignal<string> = input<string>(
    "MESSAGE.FILE_PICKER_DROPZONE_PROMPT"
  );
  public readonly dropzoneHint: InputSignal<string> = input<string>(
    "MESSAGE.FILE_PICKER_DROPZONE_HINT"
  );
  public readonly dropzoneActionText: InputSignal<string> = input<string>(
    "BUTTON.CHOOSE_FILES"
  );
  public readonly doneText: InputSignal<string> = input<string>(
    "MESSAGE.FILE_PICKER_DONE"
  );
  public readonly pendingText: InputSignal<string> = input<string>(
    "MESSAGE.FILE_PICKER_PENDING"
  );
  public readonly previewText: InputSignal<string> = input<string>(
    "BUTTON.PREVIEW_FILE"
  );
  public readonly uploadErrorText: InputSignal<string> = input<string>(
    "ERRORS.FILE_UPLOAD_FAILED"
  );
  public readonly retryText: InputSignal<string> = input<string>(
    "BUTTON.TRY_AGAIN"
  );
  public readonly cancelText: InputSignal<string> = input<string>(
    "BUTTON.CANCEL"
  );
  public readonly files: InputSignal<readonly VoteyFilePickerFile[] | null> =
    input<readonly VoteyFilePickerFile[] | null>(null);
  public readonly allowedExtensions: InputSignal<readonly string[]> = input<
    readonly string[]
  >([]);
  public readonly allowedMimeTypes: InputSignal<readonly string[]> = input<
    readonly string[]
  >([]);
  public readonly maxFileSizeBytes: InputSignalWithTransform<
    number | null,
    unknown
  > = input<number | null, unknown>(defaultMaxFileSizeBytes, {
    transform: optionalNonNegativeNumber,
  });
  public readonly maxTotalSizeBytes: InputSignalWithTransform<
    number | null,
    unknown
  > = input<number | null, unknown>(defaultMaxTotalSizeBytes, {
    transform: optionalNonNegativeNumber,
  });
  public readonly currentTotalSizeBytes: InputSignalWithTransform<
    number,
    unknown
  > = input<number, unknown>(0, { transform: nonNegativeNumber });
  public readonly maxFiles: InputSignalWithTransform<number | null, unknown> =
    input<number | null, unknown>(null, {
      transform: optionalNonNegativeNumber,
    });
  public readonly currentFilesCount: InputSignalWithTransform<number, unknown> =
    input<number, unknown>(0, { transform: nonNegativeNumber });
  public readonly validationErrorKeys: InputSignal<VoteyFilePickerValidationErrorKeys> =
    input<VoteyFilePickerValidationErrorKeys>({});
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);

  public readonly changed: OutputEmitterRef<File | null> =
    output<File | null>();
  public readonly filesChanged: OutputEmitterRef<readonly File[]> =
    output<readonly File[]>();
  public readonly cleared: OutputEmitterRef<void> = output<void>();
  public readonly cancelled: OutputEmitterRef<void> = output<void>();
  public readonly rejected: OutputEmitterRef<VoteyFilePickerRejection> =
    output<VoteyFilePickerRejection>();
  public readonly fileRemoved: OutputEmitterRef<VoteyFilePickerFile> =
    output<VoteyFilePickerFile>();
  public readonly fileRetry: OutputEmitterRef<VoteyFilePickerFile> =
    output<VoteyFilePickerFile>();
  public readonly fileCancelled: OutputEmitterRef<VoteyFilePickerFile> =
    output<VoteyFilePickerFile>();
  public readonly filePreview: OutputEmitterRef<VoteyFilePickerFile> =
    output<VoteyFilePickerFile>();

  protected readonly fileInput: Signal<
    ElementRef<HTMLInputElement> | undefined
  > = viewChild<ElementRef<HTMLInputElement>>("fileInput");
  private readonly formDisabled: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly formControlStateVersion: WritableSignal<number> =
    signal<number>(0);
  private readonly selectedFiles: WritableSignal<readonly File[]> = signal<
    readonly File[]
  >([]);
  private readonly dragDepth: WritableSignal<number> = signal<number>(0);
  private formControlEventsSubscription: Subscription | undefined;
  protected readonly hasFile: Signal<boolean> = computed<boolean>(
    () => this.selectedFiles().length > 0 || this.filename().trim().length > 0
  );
  protected readonly resolvedFilename: Signal<string> = computed<string>(
    () =>
      this.selectedFiles()
        .map((file: File) => file.name)
        .join(", ") || this.filename().trim()
  );
  protected readonly isDragging: Signal<boolean> = computed<boolean>(
    () => this.dragDepth() > 0
  );
  protected readonly isLoading: Signal<boolean> = computed<boolean>(
    () => this.loading() || this.progress() !== null
  );
  protected readonly isDropzone: Signal<boolean> = computed<boolean>(
    () => this.variant() === this.variantNames.dropzone
  );
  protected readonly dropzoneHintParams: Signal<VoteyTranslationParams> =
    computed<VoteyTranslationParams>(() => ({
      formats: this.resolvedAcceptedFormats(),
      maxSize: this.resolvedMaxFileSize(),
    }));
  protected readonly effectiveMultiple: Signal<boolean> = computed<boolean>(
    () => this.isDropzone()
  );
  protected readonly displayedFiles: Signal<readonly VoteyFilePickerFile[]> =
    computed<readonly VoteyFilePickerFile[]>(() =>
      this.files() ??
      this.selectedFiles().map(
        (file: File, index: number): VoteyFilePickerFile =>
          this.toFilePickerFile(file, index)
      )
    );
  protected readonly effectiveDisabled: Signal<boolean> = computed<boolean>(
    () =>
      this.disabled() ||
      this.formDisabled() ||
      (!this.isDropzone() && this.isLoading())
  );
  protected readonly isRequired: Signal<boolean> = computed<boolean>(() => {
    this.formControlStateVersion();

    return this.formControl.hasValidator(Validators.required);
  });

  private readonly resolvedAcceptedFormats: Signal<string> = computed<string>(
    () => {
      const acceptedValues: string[] = [
        ...this.allowedExtensions(),
        ...this.allowedMimeTypes(),
        ...this.accept().split(","),
      ];
      const formats = new Set<string>();

      for (const value of acceptedValues) {
        const normalizedValue: string = value.trim();
        if (!normalizedValue) continue;

        const mimeParts: string[] = normalizedValue.split("/");
        const format: string = mimeParts[1] === "*"
          ? normalizedValue.toUpperCase()
          : (mimeParts[mimeParts.length - 1] ?? normalizedValue)
              .replace(/^\./, "")
              .toUpperCase();
        if (format) formats.add(format);
      }

      return [...formats].join(", ") || "*";
    }
  );

  private readonly resolvedMaxFileSize: Signal<string> = computed<string>(
    () => {
      const maxFileSizeBytes = this.maxFileSizeBytes();
      if (maxFileSizeBytes === null) return "—";

      const megabytes = maxFileSizeBytes / (1024 * 1024);
      return megabytes >= 1
        ? `${Number(megabytes.toFixed(1)).toString().replace(".", ",")} MB`
        : `${Math.round(maxFileSizeBytes / 1024)} KB`;
    }
  );
  protected get errorKeys(): string[] {
    return this.formControl.invalid && this.formControl.touched
      ? Object.keys(this.formControl.errors ?? {})
      : [];
  }

  public constructor() {
    super();
    this.observeFormControl();
  }

  public override set control(
    control: FormControl<File | null> | null | undefined
  ) {
    super.control = control;

    if (control) this.observeFormControl();
  }

  public ngOnDestroy(): void {
    this.formControlEventsSubscription?.unsubscribe();
  }

  public open(): void {
    if (this.effectiveDisabled()) return;

    const inputElement: HTMLInputElement | undefined =
      this.fileInput()?.nativeElement;

    if (!inputElement) return;

    inputElement.value = "";
    inputElement.click();
  }

  protected handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectFiles(Array.from(inputElement.files ?? []));
  }

  protected handleDragEnter(event: DragEvent): void {
    if (!this.canHandleFileDrag(event)) return;

    event.preventDefault();
    this.dragDepth.update((depth: number) => depth + 1);
  }

  protected handleDragOver(event: DragEvent): void {
    if (!this.canHandleFileDrag(event)) return;

    event.preventDefault();

    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  }

  protected handleDragLeave(event: DragEvent): void {
    if (!this.canHandleFileDrag(event)) return;

    event.preventDefault();
    this.dragDepth.update((depth: number) => Math.max(depth - 1, 0));
  }

  protected handleDrop(event: DragEvent): void {
    if (!this.dropEnabled() || this.effectiveDisabled()) return;

    event.preventDefault();
    this.dragDepth.set(0);
    this.selectFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  public clear(): void {
    if (this.effectiveDisabled() || !this.hasFile()) return;

    this.clearValidationErrors();
    this.selectedFiles.set([]);
    this.formControl.setValue(null);
    this.resetNativeInput();
    this.changed.emit(null);
    this.filesChanged.emit([]);
    this.cleared.emit();
  }

  protected handleFileRemoved(file: VoteyFilePickerFile): void {
    if (this.effectiveDisabled()) return;

    this.fileRemoved.emit(file);

    if (this.files() !== null) return;

    const remainingFiles = this.selectedFiles().filter(
      (selectedFile: File, index: number) =>
        this.getFilePickerFileId(selectedFile, index) !== file.id
    );

    this.commitFiles(remainingFiles);
  }

  protected handleFileRetry(file: VoteyFilePickerFile): void {
    if (this.effectiveDisabled()) return;

    this.fileRetry.emit(file);
  }

  protected handleFilePreview(file: VoteyFilePickerFile): void {
    this.filePreview.emit(file);
  }

  protected handleFileCancelled(file: VoteyFilePickerFile): void {
    if (this.effectiveDisabled()) return;

    this.fileCancelled.emit(file);
  }

  protected handleFileAction(file: VoteyFilePickerFile): void {
    if (file.state === this.fileStateNames.uploading) {
      this.handleFileCancelled(file);
      return;
    }

    this.handleFileRemoved(file);
  }

  protected handleDropzoneClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.closest("button")) return;

    this.open();
  }

  protected handleDropzoneKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    this.open();
  }

  protected handleCancel(): void {
    this.cancelled.emit();
  }

  private observeFormControl(): void {
    this.formControlEventsSubscription?.unsubscribe();
    this.formControlEventsSubscription = this.formControl.events.subscribe(() =>
      this.syncFormControlState()
    );
    this.syncFormControlState();
  }

  private syncFormControlState(): void {
    const value: File | null = this.formControl.value;

    this.selectedFiles.set(value ? [value] : []);
    this.formDisabled.set(this.formControl.disabled);
    this.formControlStateVersion.update((version: number) => version + 1);

    if (!value) this.resetNativeInput();
  }

  private resetNativeInput(): void {
    const inputElement: HTMLInputElement | undefined =
      this.fileInput()?.nativeElement;

    if (inputElement) inputElement.value = "";
  }

  private canHandleFileDrag(event: DragEvent): boolean {
    return (
      this.dropEnabled() &&
      !this.effectiveDisabled() &&
      Array.from(event.dataTransfer?.types ?? []).includes("Files")
    );
  }

  private selectFiles(files: readonly File[]): void {
    const incomingFiles: readonly File[] = this.effectiveMultiple()
      ? files
      : files.slice(0, 1);

    if (!incomingFiles.length) {
      if (this.isDropzone()) return;

      this.commitFiles([]);
      return;
    }

    const selectedFiles: readonly File[] = this.isDropzone()
      ? [...this.selectedFiles(), ...incomingFiles]
      : incomingFiles;
    const validationErrors = this.getValidationErrors(selectedFiles);

    if (validationErrors.length) {
      this.applyValidationErrors(validationErrors);
      this.resetNativeInput();
      this.rejected.emit({ files: incomingFiles, errors: validationErrors });
      return;
    }

    this.clearValidationErrors();
    this.commitFiles(selectedFiles);
  }

  private getValidationErrors(
    files: readonly File[]
  ): VoteyFilePickerValidationError[] {
    const errors = new Set<VoteyFilePickerValidationError>();
    const allowedExtensions = this.allowedExtensions()
      .map((extension: string) => extension.trim().toLowerCase().replace(/^\./, ""))
      .filter(Boolean);
    const allowedMimeTypes = this.allowedMimeTypes()
      .map((mimeType: string) => mimeType.trim().toLowerCase())
      .filter(Boolean);
    const hasTypeRestriction =
      allowedExtensions.length > 0 || allowedMimeTypes.length > 0;
    const maxFileSizeBytes = this.maxFileSizeBytes();
    const maxTotalSizeBytes = this.maxTotalSizeBytes();
    const maxFiles = this.maxFiles();

    if (
      hasTypeRestriction &&
      files.some(
        (file: File) =>
          !this.isAllowedFile(file, allowedExtensions, allowedMimeTypes)
      )
    ) {
      errors.add("invalidType");
    }

    if (
      maxFileSizeBytes !== null &&
      files.some((file: File) => file.size > maxFileSizeBytes)
    ) {
      errors.add("fileTooLarge");
    }

    const selectedFilesSizeBytes = files.reduce(
      (total: number, file: File) => total + file.size,
      0
    );

    if (
      maxTotalSizeBytes !== null &&
      this.currentTotalSizeBytes() + selectedFilesSizeBytes > maxTotalSizeBytes
    ) {
      errors.add("totalTooLarge");
    }

    if (
      maxFiles !== null &&
      this.currentFilesCount() + files.length > Math.floor(maxFiles)
    ) {
      errors.add("tooManyFiles");
    }

    return [...errors];
  }

  private isAllowedFile(
    file: File,
    allowedExtensions: readonly string[],
    allowedMimeTypes: readonly string[]
  ): boolean {
    const extension = file.name.trim().toLowerCase().split(".").pop() ?? "";
    const mimeType = file.type.trim().toLowerCase();

    return (
      allowedExtensions.includes(extension) ||
      allowedMimeTypes.some(
        (allowedMimeType: string) =>
          allowedMimeType === mimeType ||
          (allowedMimeType.endsWith("/*") &&
            mimeType.startsWith(allowedMimeType.slice(0, -1)))
      )
    );
  }

  private applyValidationErrors(
    errors: readonly VoteyFilePickerValidationError[]
  ): void {
    const formErrors = this.withoutFilePickerErrors(this.formControl.errors);

    for (const error of errors) {
      formErrors[this.getValidationErrorKey(error)] = true;
    }

    this.formControl.setErrors(formErrors);
    this.formControl.markAsTouched();
  }

  private clearValidationErrors(): void {
    const formErrors = this.withoutFilePickerErrors(this.formControl.errors);

    this.formControl.setErrors(
      Object.keys(formErrors).length > 0 ? formErrors : null
    );
  }

  private withoutFilePickerErrors(
    errors: Record<string, unknown> | null
  ): Record<string, unknown> {
    const filePickerErrorKeys = new Set<string>([
      ...Object.values(defaultValidationErrorKeys),
      ...Object.values(this.validationErrorKeys()).filter(
        (errorKey: string | undefined): errorKey is string => Boolean(errorKey)
      ),
    ]);

    return Object.entries(errors ?? {}).reduce<Record<string, unknown>>(
      (
        filteredErrors: Record<string, unknown>,
        [errorKey, errorValue]: [string, unknown]
      ) => {
        if (!filePickerErrorKeys.has(errorKey)) {
          filteredErrors[errorKey] = errorValue;
        }

        return filteredErrors;
      },
      {}
    );
  }

  private getValidationErrorKey(
    error: VoteyFilePickerValidationError
  ): string {
    return this.validationErrorKeys()[error] ?? defaultValidationErrorKeys[error];
  }

  private commitFiles(files: readonly File[]): void {
    const value: File | null = files[0] ?? null;
    const hasValueChanged = this.formControl.value !== value;

    if (hasValueChanged) this.formControl.setValue(value);

    this.selectedFiles.set(files);

    if (hasValueChanged) this.changed.emit(value);

    this.filesChanged.emit(files);
  }

  private toFilePickerFile(
    file: File,
    index: number
  ): VoteyFilePickerFile {
    return {
      id: this.getFilePickerFileId(file, index),
      filename: file.name,
      meta: this.formatFileSize(file.size),
      state: this.fileStateNames.done,
      icon: this.getFileIcon(file.name),
      statusText: this.doneText(),
    };
  }

  private getFileIcon(filename: string): VoteyIcon {
    const extension = filename.trim().toLowerCase().split(".").pop() ?? "";

    return fileIconByExtension[extension] ?? "ui-file-txt";
  }

  private getFilePickerFileId(file: File, index: number): string {
    return `${file.name}-${file.size}-${file.lastModified}-${index}`;
  }

  private formatFileSize(size: number): string {
    if (size < 1024) return `${size} B`;

    const sizeInKilobytes = size / 1024;

    if (sizeInKilobytes < 1024) {
      return `${sizeInKilobytes.toFixed(1).replace(".", ",")} KB`;
    }

    return `${(sizeInKilobytes / 1024).toFixed(1).replace(".", ",")} MB`;
  }
}
