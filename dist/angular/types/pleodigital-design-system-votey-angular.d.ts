import * as i0 from '@angular/core';
import { EnvironmentProviders, OnDestroy, InjectionToken, InputSignal, PipeTransform, OutputEmitterRef, Signal, ElementRef, WritableSignal, ModelSignal, InputSignalWithTransform, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';

type VoteyDevice = "mobile" | "tablet" | "desktop";
type VoteyDeviceOrientation = "vertical" | "horizontal";
interface VoteyGridConfig {
    readonly desktop: number;
    readonly tablet: number;
    readonly mobile: number;
}
interface VoteyDeviceDimensions {
    width: number;
    height: number;
    mobileBreakpoint: 375;
    tabletBreakpoint: 1024;
    laptopBreakpoint: 1280;
    desktopBreakpoint: 1920;
}
declare const VOTEY_DEFAULT_GRID_CONFIG: Readonly<VoteyGridConfig>;
declare const VOTEY_GRID_CONFIG: InjectionToken<VoteyGridConfig>;
declare class VoteyDeviceService implements OnDestroy {
    private readonly document;
    private readonly gridConfig;
    private readonly platformId;
    private readonly deviceTypeSubject;
    private readonly dimensionsSubject;
    private readonly initializedSubject;
    private readonly columnsAmountSubject;
    private listeningForResize;
    readonly deviceType$: Observable<VoteyDevice | null>;
    readonly deviceDimensions$: Observable<VoteyDeviceDimensions>;
    readonly initialized$: Observable<boolean>;
    readonly columnsAmount$: Observable<number>;
    columnsAmount: number;
    currentDevice: VoteyDevice | null;
    deviceOrientation: VoteyDeviceOrientation;
    isMobileDevice: boolean;
    isTabletDevice: boolean;
    isDesktopDevice: boolean;
    private readonly handleResize;
    initialize(): void;
    update(innerWidth: number, innerHeight: number): void;
    ngOnDestroy(): void;
    private detectDevice;
    private applyDocumentState;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyDeviceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VoteyDeviceService>;
}
declare function provideVoteyDeviceDetection(gridConfig?: VoteyGridConfig): EnvironmentProviders;

declare const VoteyIconNames: readonly ["logo-wyborek-sygnet", "menu-burger", "menu-dashboard", "menu-download", "menu-participants", "menu-settings", "menu-team", "menu-vote", "sp-arrow", "sp-check", "sp-correct", "sp-exclamation-mark", "sp-flag-poland", "sp-flag-united-kingdom", "sp-in-progress", "sp-incorrect", "sp-new", "ui-agenda", "ui-ai", "ui-arrow-right", "ui-attachment-thick", "ui-authorization", "ui-burger", "ui-calendar", "ui-camera-change", "ui-camera-off", "ui-camera-on", "ui-chat", "ui-chevron-down", "ui-chevron-left", "ui-chevron-right", "ui-chevron-up", "ui-close", "ui-close-v2", "ui-coin", "ui-copy", "ui-delete", "ui-download", "ui-edit", "ui-edit-thick", "ui-end", "ui-event-completed", "ui-event-invitation", "ui-event-notification", "ui-expand-arrow-down", "ui-expand-arrow-left", "ui-expand-arrow-right", "ui-expand-arrow-up", "ui-external", "ui-file-csv", "ui-file-doc", "ui-file-dwg", "ui-file-eml", "ui-file-jpg", "ui-file-mp3", "ui-file-mp4", "ui-file-pdf", "ui-file-png", "ui-file-ppt", "ui-file-rar", "ui-file-rtf", "ui-file-tif", "ui-file-txt", "ui-file-xls", "ui-file-xml", "ui-file-zip", "ui-filter", "ui-filter-add", "ui-full-screen", "ui-full-screen-v2", "ui-grid", "ui-hand", "ui-hang-up", "ui-language", "ui-microphone-off", "ui-microphone-on", "ui-minus", "ui-move", "ui-navigate", "ui-network", "ui-option", "ui-participant", "ui-participants-list", "ui-participants-list-v2", "ui-pending", "ui-pin", "ui-plus", "ui-problem", "ui-proxy", "ui-proxy-thick", "ui-question", "ui-registration-confirmed", "ui-remind-password", "ui-save", "ui-search", "ui-send-again", "ui-send-again-v2", "ui-settings", "ui-share-screen", "ui-show-graph-thick", "ui-start", "ui-time", "ui-time-v2", "ui-turn-on-thick", "ui-unlimited", "ui-update", "ui-videoconference", "ui-visibility-off", "ui-visibility-on", "ui-voting", "ui-voting-new", "ui-voting-thick"];
type VoteyIcon = (typeof VoteyIconNames)[number];
interface VoteySvgRegistryEntry<Name extends string> {
    readonly name: Name;
    readonly path: string;
}
declare const VoteyIconRegistryEntries: readonly VoteySvgRegistryEntry<VoteyIcon>[];
declare const VoteyIllustrationNames: readonly ["bg-acknowledgments", "bg-add-participants", "bg-agenda", "bg-choose-subscription-plan", "bg-create-first-vote", "bg-download-report-event", "bg-download-report-voting", "bg-event-type-basic", "bg-event-type-general-meeting", "bg-forgot-password", "bg-home-screen-after-login", "bg-loading-screen", "bg-login", "bg-one-time-voting", "bg-participant-everyone", "bg-participant-first-group", "bg-participant-first-time", "bg-participant-first-time-v2", "bg-participant-man", "bg-participant-type-observer", "bg-participant-type-voter", "bg-participant-woman", "bg-point-voting", "bg-public-access-event", "bg-questionnaire", "bg-registration", "bg-results-preview-unavailable", "bg-test-event", "bg-vote-as-proxy", "bg-vote-yourself", "bg-voting-ended", "bg-voting-results", "bg-voting-started", "bg-voting-type-survey", "bg-voting-type-yes-no", "info-event-cost-analysis", "info-event-share-types", "info-set-up-event-send-invitations", "info-subscription-calculator", "info-view-voting-results", "logo-votey", "logo-wyborek", "simple-anonymity-off", "simple-anonymity-on", "simple-avatar", "simple-chat", "simple-click", "simple-delivered", "simple-notification", "simple-open", "simple-pointer-hand", "simple-proxy", "simple-theme-dark", "simple-theme-light", "simple-voting-start-automatic", "spot-add-participants-email", "spot-add-participants-public-access", "spot-add-participants-sms", "spot-add-participants-unique-codes", "spot-agenda-visibility-off", "spot-agenda-visibility-off-v2", "spot-agenda-visibility-on", "spot-answer-method-multiple", "spot-answer-method-open-ended", "spot-answer-method-point-system", "spot-answer-method-single", "spot-chat-off", "spot-chat-on", "spot-forum-off", "spot-forum-on", "spot-interactive-video-conference", "spot-login-on-another-device", "spot-proxy", "spot-proxy-off", "spot-proxy-on", "spot-report-pdf-off", "spot-report-pdf-off-v2", "spot-report-pdf-on", "spot-report-pdf-on-v2", "spot-results-off", "spot-results-on", "spot-streaming", "spot-videoconference-off", "spot-videoconference-on", "spot-visibility-off", "spot-visibility-on", "spot-voice-communication", "spot-voting-editing-off", "spot-voting-editing-off-v2", "spot-voting-editing-on", "spot-voting-off", "spot-voting-on", "spot-voting-start-automatic", "spot-voting-start-automatic-v2", "spot-voting-start-manual", "spot-voting-yes-no"];
type VoteyIllustration = (typeof VoteyIllustrationNames)[number];
declare const VoteyIllustrationRegistryEntries: readonly VoteySvgRegistryEntry<VoteyIllustration>[];

declare class VoteyIconComponent {
    readonly ico: InputSignal<VoteyIcon | VoteyIllustration | "">;
    readonly ariaLabel: InputSignal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyIconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyIconComponent, "vt-icon", never, { "ico": { "alias": "ico"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface VoteySvgRegistryConfig {
    readonly assetBaseUrl?: string;
}
declare const VOTEY_SVG_REGISTRY_CONFIG: InjectionToken<VoteySvgRegistryConfig>;
declare class VoteySvgRegistryService {
    private readonly matIconRegistry;
    private readonly domSanitizer;
    private readonly config;
    private registered;
    register(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteySvgRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VoteySvgRegistryService>;
}
declare function provideVoteySvgRegistry(config?: VoteySvgRegistryConfig): EnvironmentProviders;

type VoteyTranslationParams = Record<string, string | number>;
interface VoteyTranslator {
    translate(key: string, params?: VoteyTranslationParams): string;
}
declare const VOTEY_TRANSLATOR: InjectionToken<VoteyTranslator>;

declare class VoteyTranslatePipe implements PipeTransform {
    private readonly translator;
    transform(key: string | null | undefined, params?: VoteyTranslationParams): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyTranslatePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<VoteyTranslatePipe, "vtTranslate", true>;
}

declare const VoteyButtonVariants: readonly ["primary", "secondary", "link", "danger", "ghost", "orange"];
declare const VoteyButtonSizes: readonly ["large", "small"];
type VoteyButtonVariant = (typeof VoteyButtonVariants)[number];
type VoteyButtonSize = (typeof VoteyButtonSizes)[number];
type VoteyButtonType = "button" | "submit" | "reset";
type VoteyButtonAriaHasPopup = "dialog" | "grid" | "listbox" | "menu" | "tree" | boolean | null;
declare class VoteyButtonComponent {
    readonly disabled: InputSignal<boolean>;
    readonly type: InputSignal<VoteyButtonType>;
    readonly variant: InputSignal<VoteyButtonVariant>;
    readonly size: InputSignal<VoteyButtonSize>;
    readonly text: InputSignal<string>;
    readonly ico: InputSignal<VoteyIcon | "">;
    readonly badge: InputSignal<string | number | null>;
    readonly tooltipText: InputSignal<string>;
    readonly disabledNote: InputSignal<string>;
    readonly ariaExpanded: InputSignal<boolean | null>;
    readonly ariaHasPopup: InputSignal<VoteyButtonAriaHasPopup>;
    readonly ariaControls: InputSignal<string | null>;
    readonly pressed: OutputEmitterRef<void>;
    protected readonly buttonClasses: Signal<string>;
    protected readonly isIconButton: Signal<boolean>;
    protected readonly resolvedTooltipText: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyButtonComponent, "vt-button", never, { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "text": { "alias": "text"; "required": false; "isSignal": true; }; "ico": { "alias": "ico"; "required": false; "isSignal": true; }; "badge": { "alias": "badge"; "required": false; "isSignal": true; }; "tooltipText": { "alias": "tooltipText"; "required": false; "isSignal": true; }; "disabledNote": { "alias": "disabledNote"; "required": false; "isSignal": true; }; "ariaExpanded": { "alias": "ariaExpanded"; "required": false; "isSignal": true; }; "ariaHasPopup": { "alias": "ariaHasPopup"; "required": false; "isSignal": true; }; "ariaControls": { "alias": "ariaControls"; "required": false; "isSignal": true; }; }, { "pressed": "pressed"; }, never, never, true, never>;
}

interface VoteyMenuItem {
    readonly id: string;
    readonly label: string;
    readonly disabled?: boolean;
}
declare class VoteyMenuComponent {
    readonly items: InputSignal<readonly VoteyMenuItem[]>;
    readonly selectedId: InputSignal<string | null>;
    readonly dataCy: InputSignal<string | null>;
    readonly itemSelected: OutputEmitterRef<VoteyMenuItem>;
    readonly dismissed: OutputEmitterRef<void>;
    protected readonly menuItems: Signal<readonly ElementRef<HTMLButtonElement>[]>;
    protected readonly activeIndex: WritableSignal<number>;
    protected readonly resolvedActiveIndex: Signal<number>;
    focusFirst(): void;
    focusLast(): void;
    protected handleItemFocus(index: number): void;
    protected handleItemPressed(item: VoteyMenuItem, index: number): void;
    protected handleKeydown(event: KeyboardEvent, index: number): void;
    private focusEnabledItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyMenuComponent, "vt-menu", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "selectedId": { "alias": "selectedId"; "required": false; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; }, { "itemSelected": "itemSelected"; "dismissed": "dismissed"; }, never, never, true, never>;
}

interface VoteyMultiSelectItem {
    readonly id: string;
    readonly label: string;
    readonly disabled?: boolean;
}
declare class VoteyMultiSelectPopoverComponent {
    private readonly document;
    private readonly host;
    private readonly destroyRef;
    readonly items: InputSignal<readonly VoteyMultiSelectItem[]>;
    readonly selectedIds: InputSignal<readonly string[]>;
    readonly triggerText: InputSignal<string>;
    readonly triggerIcon: InputSignal<VoteyIcon | "">;
    readonly triggerVariant: InputSignal<VoteyButtonVariant>;
    readonly confirmText: InputSignal<string>;
    readonly cancelText: InputSignal<string>;
    readonly emptyText: InputSignal<string>;
    readonly ariaLabel: InputSignal<string>;
    readonly dataCy: InputSignal<string | null>;
    readonly confirmed: OutputEmitterRef<readonly string[]>;
    readonly dismissed: OutputEmitterRef<void>;
    protected readonly isOpen: WritableSignal<boolean>;
    protected readonly itemControls: WritableSignal<Readonly<Record<string, FormControl<boolean>>>>;
    protected readonly hasItems: Signal<boolean>;
    protected readonly currentTriggerIcon: Signal<VoteyIcon | "">;
    private readonly draftSelectedIds;
    private readonly handlePointerDown;
    constructor();
    protected toggle(): void;
    protected toggleItem(item: VoteyMultiSelectItem, checked: boolean): void;
    protected confirm(): void;
    protected dismiss(): void;
    protected handlePanelKeydown(event: KeyboardEvent): void;
    private open;
    private close;
    private createItemControls;
    private handleOutsidePointerDown;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyMultiSelectPopoverComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyMultiSelectPopoverComponent, "vt-multi-select-popover", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "selectedIds": { "alias": "selectedIds"; "required": false; "isSignal": true; }; "triggerText": { "alias": "triggerText"; "required": true; "isSignal": true; }; "triggerIcon": { "alias": "triggerIcon"; "required": false; "isSignal": true; }; "triggerVariant": { "alias": "triggerVariant"; "required": false; "isSignal": true; }; "confirmText": { "alias": "confirmText"; "required": true; "isSignal": true; }; "cancelText": { "alias": "cancelText"; "required": false; "isSignal": true; }; "emptyText": { "alias": "emptyText"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": true; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; }, { "confirmed": "confirmed"; "dismissed": "dismissed"; }, never, never, true, never>;
}

declare class VoteyFormControlApplyDirective<T> {
    formControl: FormControl<T | null>;
    set staticValue(value: T | null | undefined);
    set initialValue(value: T | null | undefined);
    set control(control: FormControl<T | null> | null | undefined);
    set disable(disabled: boolean | undefined);
    set block(blocked: boolean);
    get blocked(): boolean;
    get touched(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyFormControlApplyDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<VoteyFormControlApplyDirective<any>, "[vtFormControlApply]", never, { "staticValue": { "alias": "staticValue"; "required": false; }; "initialValue": { "alias": "initialValue"; "required": false; }; "control": { "alias": "control"; "required": false; }; "disable": { "alias": "disable"; "required": false; }; "block": { "alias": "block"; "required": false; }; }, {}, never, never, true, never>;
}

type VoteyCheckboxLabelPosition = "before" | "after";
declare class VoteyCheckboxComponent extends VoteyFormControlApplyDirective<boolean> {
    readonly indeterminate: ModelSignal<boolean>;
    readonly disabled: InputSignal<boolean>;
    readonly required: InputSignal<boolean>;
    readonly error: InputSignal<boolean>;
    readonly label: InputSignal<string>;
    readonly labelPosition: InputSignal<VoteyCheckboxLabelPosition>;
    readonly id: InputSignal<string>;
    readonly name: InputSignal<string>;
    readonly value: InputSignal<string>;
    readonly ignoredErrors: InputSignal<string[]>;
    readonly changed: OutputEmitterRef<boolean>;
    protected get errorKeys(): string[];
    private readonly svgRegistryConfig;
    protected readonly checkmarkMaskUrl: string;
    protected handleChange(event: MatCheckboxChange): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyCheckboxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyCheckboxComponent, "vt-checkbox", never, { "indeterminate": { "alias": "indeterminate"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "labelPosition": { "alias": "labelPosition"; "required": false; "isSignal": true; }; "id": { "alias": "id"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; }, { "indeterminate": "indeterminateChange"; "changed": "changed"; }, never, ["*"], true, never>;
}

declare const VoteyFilePickerValidationErrors: readonly ["invalidType", "fileTooLarge", "totalTooLarge", "tooManyFiles"];
type VoteyFilePickerValidationError = (typeof VoteyFilePickerValidationErrors)[number];
type VoteyFilePickerValidationErrorKeys = Readonly<Partial<Record<VoteyFilePickerValidationError, string>>>;
declare const filePickerVariants: readonly ["compact", "dropzone"];
declare const filePickerFileStates: readonly ["done", "pending", "uploading", "error"];
type VoteyFilePickerVariant = (typeof filePickerVariants)[number];
type VoteyFilePickerFileState = (typeof filePickerFileStates)[number];
interface VoteyFilePickerFile {
    readonly id: string;
    readonly filename: string;
    readonly meta?: string;
    readonly state?: VoteyFilePickerFileState;
    readonly progress?: number | null;
    readonly speed?: string;
    readonly icon?: VoteyIcon;
    readonly statusText?: string;
}
interface VoteyFilePickerRejection {
    readonly files: readonly File[];
    readonly errors: readonly VoteyFilePickerValidationError[];
}
declare class VoteyFilePickerComponent extends VoteyFormControlApplyDirective<File> implements OnDestroy {
    protected readonly variantNames: Readonly<Record<VoteyFilePickerVariant, VoteyFilePickerVariant>>;
    protected readonly fileStateNames: Readonly<Record<VoteyFilePickerFileState, VoteyFilePickerFileState>>;
    readonly variant: InputSignal<VoteyFilePickerVariant>;
    readonly filename: InputSignal<string>;
    readonly label: InputSignal<string>;
    readonly emptyText: InputSignal<string>;
    readonly actionText: InputSignal<string>;
    readonly disabled: InputSignalWithTransform<boolean, unknown>;
    readonly loading: InputSignalWithTransform<boolean, unknown>;
    readonly progress: InputSignalWithTransform<number | null, unknown>;
    readonly name: InputSignal<string>;
    readonly accept: InputSignal<string>;
    readonly capture: InputSignal<string>;
    readonly dataCy: InputSignal<string>;
    readonly multiple: InputSignalWithTransform<boolean, unknown>;
    readonly dropEnabled: InputSignalWithTransform<boolean, unknown>;
    readonly clearable: InputSignalWithTransform<boolean, unknown>;
    readonly clearText: InputSignal<string>;
    readonly loadingText: InputSignal<string>;
    readonly dropzoneTitle: InputSignal<string>;
    readonly dropzoneHint: InputSignal<string>;
    readonly dropzoneActionText: InputSignal<string>;
    readonly doneText: InputSignal<string>;
    readonly pendingText: InputSignal<string>;
    readonly previewText: InputSignal<string>;
    readonly uploadErrorText: InputSignal<string>;
    readonly retryText: InputSignal<string>;
    readonly cancelText: InputSignal<string>;
    readonly files: InputSignal<readonly VoteyFilePickerFile[] | null>;
    readonly allowedExtensions: InputSignal<readonly string[]>;
    readonly allowedMimeTypes: InputSignal<readonly string[]>;
    readonly maxFileSizeBytes: InputSignalWithTransform<number | null, unknown>;
    readonly maxTotalSizeBytes: InputSignalWithTransform<number | null, unknown>;
    readonly currentTotalSizeBytes: InputSignalWithTransform<number, unknown>;
    readonly maxFiles: InputSignalWithTransform<number | null, unknown>;
    readonly currentFilesCount: InputSignalWithTransform<number, unknown>;
    readonly validationErrorKeys: InputSignal<VoteyFilePickerValidationErrorKeys>;
    readonly ignoredErrors: InputSignal<string[]>;
    readonly changed: OutputEmitterRef<File | null>;
    readonly filesChanged: OutputEmitterRef<readonly File[]>;
    readonly cleared: OutputEmitterRef<void>;
    readonly cancelled: OutputEmitterRef<void>;
    readonly rejected: OutputEmitterRef<VoteyFilePickerRejection>;
    readonly fileRemoved: OutputEmitterRef<VoteyFilePickerFile>;
    readonly fileRetry: OutputEmitterRef<VoteyFilePickerFile>;
    readonly fileCancelled: OutputEmitterRef<VoteyFilePickerFile>;
    readonly filePreview: OutputEmitterRef<VoteyFilePickerFile>;
    protected readonly fileInput: Signal<ElementRef<HTMLInputElement> | undefined>;
    private readonly formDisabled;
    private readonly formControlStateVersion;
    private readonly selectedFiles;
    private readonly dragDepth;
    private formControlEventsSubscription;
    protected readonly hasFile: Signal<boolean>;
    protected readonly resolvedFilename: Signal<string>;
    protected readonly resolvedFileIcon: Signal<VoteyIcon>;
    protected readonly isDragging: Signal<boolean>;
    protected readonly isLoading: Signal<boolean>;
    protected readonly isDropzone: Signal<boolean>;
    protected readonly dropzoneHintParams: Signal<VoteyTranslationParams>;
    protected readonly effectiveMultiple: Signal<boolean>;
    protected readonly displayedFiles: Signal<readonly VoteyFilePickerFile[]>;
    protected readonly effectiveDisabled: Signal<boolean>;
    protected readonly isRequired: Signal<boolean>;
    private readonly resolvedAcceptedFormats;
    private readonly resolvedMaxFileSize;
    protected get errorKeys(): string[];
    constructor();
    set control(control: FormControl<File | null> | null | undefined);
    ngOnDestroy(): void;
    open(): void;
    protected handleChange(event: Event): void;
    protected handleDragEnter(event: DragEvent): void;
    protected handleDragOver(event: DragEvent): void;
    protected handleDragLeave(event: DragEvent): void;
    protected handleDrop(event: DragEvent): void;
    clear(): void;
    protected handleFileRemoved(file: VoteyFilePickerFile): void;
    protected handleFileRetry(file: VoteyFilePickerFile): void;
    protected handleFilePreview(file: VoteyFilePickerFile): void;
    protected handleFileCancelled(file: VoteyFilePickerFile): void;
    protected handleFileAction(file: VoteyFilePickerFile): void;
    protected handleDropzoneClick(event: MouseEvent): void;
    protected handleDropzoneKeydown(event: KeyboardEvent): void;
    protected handleCancel(): void;
    private observeFormControl;
    private syncFormControlState;
    private resetNativeInput;
    private canHandleFileDrag;
    private selectFiles;
    private getValidationErrors;
    private isAllowedFile;
    private applyValidationErrors;
    private clearValidationErrors;
    private withoutFilePickerErrors;
    private getValidationErrorKey;
    private commitFiles;
    private toFilePickerFile;
    private getFileIcon;
    private getFilePickerFileId;
    private formatFileSize;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyFilePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyFilePickerComponent, "vt-file-picker", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "filename": { "alias": "filename"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "emptyText": { "alias": "emptyText"; "required": false; "isSignal": true; }; "actionText": { "alias": "actionText"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "progress": { "alias": "progress"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "accept": { "alias": "accept"; "required": false; "isSignal": true; }; "capture": { "alias": "capture"; "required": false; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; "multiple": { "alias": "multiple"; "required": false; "isSignal": true; }; "dropEnabled": { "alias": "dropEnabled"; "required": false; "isSignal": true; }; "clearable": { "alias": "clearable"; "required": false; "isSignal": true; }; "clearText": { "alias": "clearText"; "required": false; "isSignal": true; }; "loadingText": { "alias": "loadingText"; "required": false; "isSignal": true; }; "dropzoneTitle": { "alias": "dropzoneTitle"; "required": false; "isSignal": true; }; "dropzoneHint": { "alias": "dropzoneHint"; "required": false; "isSignal": true; }; "dropzoneActionText": { "alias": "dropzoneActionText"; "required": false; "isSignal": true; }; "doneText": { "alias": "doneText"; "required": false; "isSignal": true; }; "pendingText": { "alias": "pendingText"; "required": false; "isSignal": true; }; "previewText": { "alias": "previewText"; "required": false; "isSignal": true; }; "uploadErrorText": { "alias": "uploadErrorText"; "required": false; "isSignal": true; }; "retryText": { "alias": "retryText"; "required": false; "isSignal": true; }; "cancelText": { "alias": "cancelText"; "required": false; "isSignal": true; }; "files": { "alias": "files"; "required": false; "isSignal": true; }; "allowedExtensions": { "alias": "allowedExtensions"; "required": false; "isSignal": true; }; "allowedMimeTypes": { "alias": "allowedMimeTypes"; "required": false; "isSignal": true; }; "maxFileSizeBytes": { "alias": "maxFileSizeBytes"; "required": false; "isSignal": true; }; "maxTotalSizeBytes": { "alias": "maxTotalSizeBytes"; "required": false; "isSignal": true; }; "currentTotalSizeBytes": { "alias": "currentTotalSizeBytes"; "required": false; "isSignal": true; }; "maxFiles": { "alias": "maxFiles"; "required": false; "isSignal": true; }; "currentFilesCount": { "alias": "currentFilesCount"; "required": false; "isSignal": true; }; "validationErrorKeys": { "alias": "validationErrorKeys"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; }, { "changed": "changed"; "filesChanged": "filesChanged"; "cleared": "cleared"; "cancelled": "cancelled"; "rejected": "rejected"; "fileRemoved": "fileRemoved"; "fileRetry": "fileRetry"; "fileCancelled": "fileCancelled"; "filePreview": "filePreview"; }, never, never, true, never>;
}

declare class VoteyFormErrorComponent {
    readonly errors: InputSignal<string[]>;
    readonly ignoredErrors: InputSignal<string[]>;
    protected readonly visibleErrors: Signal<string[]>;
    private toTranslationKey;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyFormErrorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyFormErrorComponent, "vt-form-error", never, { "errors": { "alias": "errors"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class VoteyChipComponent {
    readonly label: InputSignal<string>;
    readonly removeTooltip: InputSignal<string>;
    readonly showRemove: InputSignal<boolean>;
    readonly disabled: InputSignal<boolean>;
    readonly removed: OutputEmitterRef<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyChipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyChipComponent, "vt-chip", never, { "label": { "alias": "label"; "required": true; "isSignal": true; }; "removeTooltip": { "alias": "removeTooltip"; "required": true; "isSignal": true; }; "showRemove": { "alias": "showRemove"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, { "removed": "removed"; }, never, never, true, never>;
}

declare const VoteySelectVariants: readonly ["boxed", "compact"];
type VoteySelectVariant = (typeof VoteySelectVariants)[number];
interface VtOption<T = unknown> {
    readonly label: string;
    readonly value: T;
    readonly disabled?: boolean;
}
type VoteySelectSearchFn = (searchTerm: string, option: unknown) => boolean;
type SelectOptionView = {
    readonly avatarUrl: string;
    readonly description: string;
    readonly disabled: boolean;
    readonly flagClass: string;
    readonly label: string;
    readonly option: unknown;
    readonly value: unknown;
};
declare class VoteySelectComponent extends VoteyFormControlApplyDirective<unknown> {
    private readonly document;
    private readonly destroyRef;
    private readonly outsidePointerDownListener;
    private readonly backdropPointerDownListener;
    private backdropListenerTimeout;
    private overlayBackdrop;
    readonly options: InputSignal<readonly unknown[]>;
    readonly variant: InputSignal<VoteySelectVariant>;
    readonly label: InputSignal<string>;
    readonly placeholder: InputSignal<string>;
    readonly bindLabel: InputSignal<string>;
    readonly bindValue: InputSignal<string>;
    readonly id: InputSignal<string>;
    readonly name: InputSignal<string>;
    readonly dataCy: InputSignal<string>;
    readonly multiple: InputSignalWithTransform<boolean, unknown>;
    readonly disabled: InputSignalWithTransform<boolean, unknown>;
    readonly flagSelect: InputSignalWithTransform<boolean, unknown>;
    readonly clearable: InputSignalWithTransform<boolean, unknown>;
    readonly clearTooltip: InputSignal<string>;
    readonly showSelectionChips: InputSignalWithTransform<boolean, unknown>;
    readonly searchable: InputSignalWithTransform<boolean, unknown>;
    readonly searchPlaceholder: InputSignal<string>;
    readonly customSearchFn: InputSignal<VoteySelectSearchFn | null>;
    readonly withSelectionActions: InputSignalWithTransform<boolean, unknown>;
    readonly withSelectionSearch: InputSignalWithTransform<boolean, unknown>;
    readonly selectionCancelText: InputSignal<string>;
    readonly selectionUpdateText: InputSignal<string>;
    readonly nonRemovableValues: InputSignal<readonly (string | number)[]>;
    readonly optionAvatarField: InputSignal<string>;
    readonly optionDescriptionField: InputSignal<string>;
    readonly optionFlagField: InputSignal<string>;
    readonly flagClass: InputSignal<string>;
    readonly translateOptions: InputSignalWithTransform<boolean, unknown>;
    readonly closeOnSelect: InputSignalWithTransform<boolean, unknown>;
    readonly tooltip: InputSignal<string>;
    readonly disabledNote: InputSignal<string>;
    readonly removeTooltip: InputSignal<string>;
    readonly ignoredErrors: InputSignal<string[]>;
    readonly selectionChange: OutputEmitterRef<unknown>;
    readonly change: OutputEmitterRef<unknown>;
    protected readonly isOpen: i0.WritableSignal<boolean>;
    protected readonly searchTerm: i0.WritableSignal<string>;
    protected readonly matSelect: Signal<MatSelect>;
    protected readonly selectionActionControl: FormControl<unknown | null>;
    protected readonly optionViews: Signal<readonly SelectOptionView[]>;
    protected readonly filteredOptionViews: Signal<readonly SelectOptionView[]>;
    protected readonly resolvedTooltip: Signal<string>;
    ngOnInit(): void;
    protected get isRequired(): boolean;
    protected get hasError(): boolean;
    protected get errorKeys(): string[];
    protected get selectedOptions(): readonly SelectOptionView[];
    protected get selectedOption(): SelectOptionView | null;
    protected get canClear(): boolean;
    protected get selectionControl(): FormControl<unknown | null>;
    protected get isSelectionActionMode(): boolean;
    protected get isSearchEnabled(): boolean;
    protected handleSelectionChange(event: MatSelectChange): void;
    protected handleOpenedChange(isOpen: boolean): void;
    protected handleSearchInput(event: Event): void;
    protected openSelect(event: MouseEvent): void;
    private closeOnOutsidePointerDown;
    private addBackdropListener;
    private scheduleBackdropListener;
    private removeBackdropListener;
    private clearBackdropListenerTimeout;
    protected stopPanelEvent(event: Event): void;
    protected clearSelection(event: Event): void;
    protected cancelSelectionActions(): void;
    protected updateSelectionActions(): void;
    protected removeSelection(option: SelectOptionView): void;
    private getOptionLabel;
    private getOptionValue;
    private getOptionText;
    private getBoundOptionProperty;
    private isOptionDisabled;
    private matchesSearch;
    protected isOptionRemovable(option: SelectOptionView): boolean;
    private resolveValueWithNonRemovable;
    private normalizeOptionValue;
    private toTrimmedString;
    private emitChange;
    private isVtOption;
    private toDisplayValue;
    private toArray;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteySelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteySelectComponent, "vt-select", never, { "options": { "alias": "options"; "required": true; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "bindLabel": { "alias": "bindLabel"; "required": false; "isSignal": true; }; "bindValue": { "alias": "bindValue"; "required": false; "isSignal": true; }; "id": { "alias": "id"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; "multiple": { "alias": "multiple"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "flagSelect": { "alias": "flagSelect"; "required": false; "isSignal": true; }; "clearable": { "alias": "clearable"; "required": false; "isSignal": true; }; "clearTooltip": { "alias": "clearTooltip"; "required": false; "isSignal": true; }; "showSelectionChips": { "alias": "showSelectionChips"; "required": false; "isSignal": true; }; "searchable": { "alias": "searchable"; "required": false; "isSignal": true; }; "searchPlaceholder": { "alias": "searchPlaceholder"; "required": false; "isSignal": true; }; "customSearchFn": { "alias": "customSearchFn"; "required": false; "isSignal": true; }; "withSelectionActions": { "alias": "withSelectionActions"; "required": false; "isSignal": true; }; "withSelectionSearch": { "alias": "withSelectionSearch"; "required": false; "isSignal": true; }; "selectionCancelText": { "alias": "selectionCancelText"; "required": false; "isSignal": true; }; "selectionUpdateText": { "alias": "selectionUpdateText"; "required": false; "isSignal": true; }; "nonRemovableValues": { "alias": "nonRemovableValues"; "required": false; "isSignal": true; }; "optionAvatarField": { "alias": "optionAvatarField"; "required": false; "isSignal": true; }; "optionDescriptionField": { "alias": "optionDescriptionField"; "required": false; "isSignal": true; }; "optionFlagField": { "alias": "optionFlagField"; "required": false; "isSignal": true; }; "flagClass": { "alias": "flagClass"; "required": false; "isSignal": true; }; "translateOptions": { "alias": "translateOptions"; "required": false; "isSignal": true; }; "closeOnSelect": { "alias": "closeOnSelect"; "required": false; "isSignal": true; }; "tooltip": { "alias": "tooltip"; "required": false; "isSignal": true; }; "disabledNote": { "alias": "disabledNote"; "required": false; "isSignal": true; }; "removeTooltip": { "alias": "removeTooltip"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; }, { "selectionChange": "selectionChange"; "change": "change"; }, never, never, true, never>;
}

type VoteyRadioButtonLabelPosition = "before" | "after";
interface VtRadioOption<T = unknown> {
    readonly label: string;
    readonly value: T;
    readonly disabled?: boolean;
    readonly required?: boolean;
    readonly error?: boolean;
    readonly labelPosition?: VoteyRadioButtonLabelPosition;
    readonly id?: string;
    readonly className?: string;
    readonly dataCy?: string;
}
declare class VoteyRadioButtonComponent extends VoteyFormControlApplyDirective<unknown> {
    private readonly translator;
    private readonly optionContents;
    readonly options: InputSignal<readonly VtRadioOption[]>;
    readonly groupLabelPosition: InputSignal<VoteyRadioButtonLabelPosition>;
    readonly groupDisabled: InputSignal<boolean>;
    readonly groupRequired: InputSignal<boolean>;
    readonly groupClass: InputSignal<string>;
    readonly tooltip: InputSignal<string>;
    readonly disabledNote: InputSignal<string>;
    readonly ignoredErrors: InputSignal<string[]>;
    readonly change: OutputEmitterRef<MatRadioChange>;
    protected readonly groupAccessibleLabel: Signal<string>;
    protected readonly resolvedTooltip: Signal<string>;
    protected readonly optionContentTemplates: Signal<Readonly<Record<string, TemplateRef<unknown>>>>;
    protected get errorKeys(): string[];
    protected handleChange(event: MatRadioChange): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyRadioButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyRadioButtonComponent, "vt-radio-button", never, { "options": { "alias": "options"; "required": true; "isSignal": true; }; "groupLabelPosition": { "alias": "groupLabelPosition"; "required": false; "isSignal": true; }; "groupDisabled": { "alias": "groupDisabled"; "required": false; "isSignal": true; }; "groupRequired": { "alias": "groupRequired"; "required": false; "isSignal": true; }; "groupClass": { "alias": "groupClass"; "required": false; "isSignal": true; }; "tooltip": { "alias": "tooltip"; "required": false; "isSignal": true; }; "disabledNote": { "alias": "disabledNote"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; }, { "change": "change"; }, ["optionContents"], never, true, never>;
}

declare class VoteyRadioOptionContentDirective {
    readonly optionId: InputSignal<string>;
    readonly templateRef: TemplateRef<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyRadioOptionContentDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<VoteyRadioOptionContentDirective, "ng-template[vtRadioOptionContent]", never, { "optionId": { "alias": "vtRadioOptionContent"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class VoteyTextAreaComponent extends VoteyFormControlApplyDirective<string> {
    readonly label: InputSignal<string>;
    readonly placeholder: InputSignal<string>;
    readonly helper: InputSignal<string>;
    readonly disabled: InputSignalWithTransform<boolean, unknown>;
    readonly spellcheck: InputSignalWithTransform<boolean, unknown>;
    readonly minLength: InputSignal<number | null>;
    readonly maxLength: InputSignal<number | null>;
    readonly dataCy: InputSignal<string>;
    readonly ignoredErrors: InputSignal<string[]>;
    readonly changed: OutputEmitterRef<string>;
    readonly keyDown: OutputEmitterRef<KeyboardEvent>;
    protected get isRequired(): boolean;
    protected get hasError(): boolean;
    protected get errorKeys(): string[];
    protected handleInput(event: Event): void;
    protected handleKeyDown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyTextAreaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyTextAreaComponent, "vt-text-area", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "helper": { "alias": "helper"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "spellcheck": { "alias": "spellcheck"; "required": false; "isSignal": true; }; "minLength": { "alias": "minLength"; "required": false; "isSignal": true; }; "maxLength": { "alias": "maxLength"; "required": false; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; }, { "changed": "changed"; "keyDown": "keyDown"; }, never, never, true, never>;
}

declare const VoteyTextVariants: readonly ["h1", "h2", "h3", "h4", "h5", "display-l", "body-2xl", "body-xl", "body-l", "body-l-semibold", "body-l-bold", "body", "body-s", "caption", "caption-extrabold", "caption-light", "caption-s", "micro", "button", "button-small", "table-header", "label", "field"];
declare const VoteyTextColors: readonly ["primary", "secondary", "muted", "inverse", "accent", "error", "on-sidebar"];
type VoteyTextVariant = (typeof VoteyTextVariants)[number];
type VoteyTextColor = (typeof VoteyTextColors)[number];
declare class VoteyTextComponent {
    readonly content: InputSignal<string | number | null | undefined>;
    readonly variant: InputSignal<VoteyTextVariant>;
    readonly color: InputSignal<VoteyTextColor>;
    readonly uppercase: InputSignal<boolean>;
    readonly italic: InputSignal<boolean>;
    readonly wrap: InputSignal<boolean>;
    readonly maxLines: InputSignalWithTransform<number, unknown>;
    protected readonly lineClampEnabled: Signal<boolean>;
    protected readonly textClasses: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyTextComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyTextComponent, "vt-text", never, { "content": { "alias": "content"; "required": true; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "uppercase": { "alias": "uppercase"; "required": false; "isSignal": true; }; "italic": { "alias": "italic"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "maxLines": { "alias": "maxLines"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare const VoteyInputVariants: readonly ["boxed", "underline"];
declare const VoteyInputTypeNames: {
    readonly text: "text";
    readonly email: "email";
    readonly password: "password";
    readonly search: "search";
    readonly tel: "tel";
    readonly url: "url";
    readonly number: "number";
};
declare const VoteyInputModes: readonly ["none", "text", "decimal", "numeric", "tel", "search", "email", "url"];
type VoteyInputVariant = (typeof VoteyInputVariants)[number];
type VoteyInputType = (typeof VoteyInputTypeNames)[keyof typeof VoteyInputTypeNames];
type VoteyInputMode = (typeof VoteyInputModes)[number];
declare const VoteyInputTypes: readonly VoteyInputType[];
declare class VoteyInputComponent extends VoteyFormControlApplyDirective<string> {
    readonly variant: InputSignal<VoteyInputVariant>;
    readonly type: InputSignal<VoteyInputType>;
    readonly label: InputSignal<string>;
    readonly placeholder: InputSignal<string>;
    readonly helper: InputSignal<string>;
    readonly showHelper: InputSignalWithTransform<boolean, unknown>;
    readonly disabled: InputSignalWithTransform<boolean, unknown>;
    readonly id: InputSignal<string>;
    readonly name: InputSignal<string>;
    readonly inputMode: InputSignal<VoteyInputMode | "">;
    readonly min: InputSignal<number | null>;
    readonly max: InputSignal<number | null>;
    readonly minLength: InputSignal<number | null>;
    readonly maxLength: InputSignal<number | null>;
    readonly pattern: InputSignal<string>;
    readonly dataCy: InputSignal<string>;
    readonly ignoredErrors: InputSignal<string[]>;
    readonly showErrors: InputSignalWithTransform<boolean, unknown>;
    readonly blur: OutputEmitterRef<FocusEvent>;
    readonly keyDown: OutputEmitterRef<KeyboardEvent>;
    protected get isRequired(): boolean;
    protected get hasError(): boolean;
    protected get hasValue(): boolean;
    protected get isDisabled(): boolean;
    protected get shouldShowHelper(): boolean;
    protected get showFormErrors(): boolean;
    protected get helperColor(): "error" | "muted";
    protected get errorKeys(): string[];
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyInputComponent, "vt-input", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "helper": { "alias": "helper"; "required": false; "isSignal": true; }; "showHelper": { "alias": "showHelper"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "id": { "alias": "id"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "inputMode": { "alias": "inputMode"; "required": false; "isSignal": true; }; "min": { "alias": "min"; "required": false; "isSignal": true; }; "max": { "alias": "max"; "required": false; "isSignal": true; }; "minLength": { "alias": "minLength"; "required": false; "isSignal": true; }; "maxLength": { "alias": "maxLength"; "required": false; "isSignal": true; }; "pattern": { "alias": "pattern"; "required": false; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; "ignoredErrors": { "alias": "ignoredErrors"; "required": false; "isSignal": true; }; "showErrors": { "alias": "showErrors"; "required": false; "isSignal": true; }; }, { "blur": "blur"; "keyDown": "keyDown"; }, never, never, true, never>;
}

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VOTEY_SVG_REGISTRY_CONFIG, VOTEY_TRANSLATOR, VoteyButtonComponent, VoteyButtonSizes, VoteyButtonVariants, VoteyCheckboxComponent, VoteyChipComponent, VoteyDeviceService, VoteyFilePickerComponent, VoteyFilePickerValidationErrors, VoteyFormControlApplyDirective, VoteyFormErrorComponent, VoteyIconComponent, VoteyIconNames, VoteyIconRegistryEntries, VoteyIllustrationNames, VoteyIllustrationRegistryEntries, VoteyInputComponent, VoteyInputModes, VoteyInputTypeNames, VoteyInputTypes, VoteyInputVariants, VoteyMenuComponent, VoteyMultiSelectPopoverComponent, VoteyRadioButtonComponent, VoteyRadioOptionContentDirective, VoteySelectComponent, VoteySelectVariants, VoteySvgRegistryService, VoteyTextAreaComponent, VoteyTextColors, VoteyTextComponent, VoteyTextVariants, VoteyTranslatePipe, provideVoteyDeviceDetection, provideVoteySvgRegistry };
export type { VoteyButtonAriaHasPopup, VoteyButtonSize, VoteyButtonType, VoteyButtonVariant, VoteyCheckboxLabelPosition, VoteyDevice, VoteyDeviceDimensions, VoteyDeviceOrientation, VoteyFilePickerFile, VoteyFilePickerFileState, VoteyFilePickerRejection, VoteyFilePickerValidationError, VoteyFilePickerValidationErrorKeys, VoteyFilePickerVariant, VoteyGridConfig, VoteyIcon, VoteyIllustration, VoteyInputMode, VoteyInputType, VoteyInputVariant, VoteyMenuItem, VoteyMultiSelectItem, VoteyRadioButtonLabelPosition, VoteySelectSearchFn, VoteySelectVariant, VoteySvgRegistryConfig, VoteySvgRegistryEntry, VoteyTextColor, VoteyTextVariant, VoteyTranslationParams, VoteyTranslator, VtOption, VtRadioOption };
