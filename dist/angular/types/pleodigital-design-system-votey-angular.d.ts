import * as i0 from '@angular/core';
import { EnvironmentProviders, OnDestroy, InjectionToken, InputSignal, PipeTransform, OutputEmitterRef, Signal, ModelSignal, TemplateRef, InputSignalWithTransform, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
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
    readonly pressed: OutputEmitterRef<void>;
    protected readonly buttonClasses: Signal<string>;
    protected readonly isIconButton: Signal<boolean>;
    protected readonly resolvedTooltipText: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyButtonComponent, "vt-button", never, { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "text": { "alias": "text"; "required": false; "isSignal": true; }; "ico": { "alias": "ico"; "required": false; "isSignal": true; }; "badge": { "alias": "badge"; "required": false; "isSignal": true; }; "tooltipText": { "alias": "tooltipText"; "required": false; "isSignal": true; }; "disabledNote": { "alias": "disabledNote"; "required": false; "isSignal": true; }; }, { "pressed": "pressed"; }, never, never, true, never>;
}

type VoteyCheckboxLabelPosition = "before" | "after";
declare class VoteyCheckboxComponent implements ControlValueAccessor {
    readonly checked: ModelSignal<boolean>;
    readonly indeterminate: ModelSignal<boolean>;
    readonly disabled: InputSignal<boolean>;
    readonly required: InputSignal<boolean>;
    readonly error: InputSignal<boolean>;
    readonly label: InputSignal<string>;
    readonly labelPosition: InputSignal<VoteyCheckboxLabelPosition>;
    readonly id: InputSignal<string>;
    readonly name: InputSignal<string>;
    readonly value: InputSignal<string>;
    readonly changed: OutputEmitterRef<boolean>;
    private readonly formDisabled;
    protected readonly effectiveDisabled: Signal<boolean>;
    private onChange;
    private onTouched;
    writeValue(value: boolean | null): void;
    registerOnChange(callback: (value: boolean) => void): void;
    registerOnTouched(callback: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    protected handleChange(event: MatCheckboxChange): void;
    protected markAsTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyCheckboxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyCheckboxComponent, "vt-checkbox", never, { "checked": { "alias": "checked"; "required": false; "isSignal": true; }; "indeterminate": { "alias": "indeterminate"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "labelPosition": { "alias": "labelPosition"; "required": false; "isSignal": true; }; "id": { "alias": "id"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "checked": "checkedChange"; "indeterminate": "indeterminateChange"; "changed": "changed"; }, never, ["*"], true, never>;
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
declare class VoteyRadioButtonComponent {
    private readonly translator;
    private readonly optionContents;
    readonly options: InputSignal<readonly VtRadioOption[]>;
    readonly control: InputSignal<FormControl>;
    readonly groupLabelPosition: InputSignal<VoteyRadioButtonLabelPosition>;
    readonly groupDisabled: InputSignal<boolean>;
    readonly groupRequired: InputSignal<boolean>;
    readonly groupClass: InputSignal<string>;
    readonly tooltip: InputSignal<string>;
    readonly disabledNote: InputSignal<string>;
    readonly change: OutputEmitterRef<MatRadioChange>;
    protected readonly groupAccessibleLabel: Signal<string>;
    protected readonly resolvedTooltip: Signal<string>;
    protected readonly optionContentTemplates: Signal<Readonly<Record<string, TemplateRef<unknown>>>>;
    protected handleChange(event: MatRadioChange): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyRadioButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyRadioButtonComponent, "vt-radio-button", never, { "options": { "alias": "options"; "required": true; "isSignal": true; }; "control": { "alias": "control"; "required": true; "isSignal": true; }; "groupLabelPosition": { "alias": "groupLabelPosition"; "required": false; "isSignal": true; }; "groupDisabled": { "alias": "groupDisabled"; "required": false; "isSignal": true; }; "groupRequired": { "alias": "groupRequired"; "required": false; "isSignal": true; }; "groupClass": { "alias": "groupClass"; "required": false; "isSignal": true; }; "tooltip": { "alias": "tooltip"; "required": false; "isSignal": true; }; "disabledNote": { "alias": "disabledNote"; "required": false; "isSignal": true; }; }, { "change": "change"; }, ["optionContents"], never, true, never>;
}

declare class VoteyRadioOptionContentDirective {
    readonly optionId: InputSignal<string>;
    readonly templateRef: TemplateRef<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyRadioOptionContentDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<VoteyRadioOptionContentDirective, "ng-template[vtRadioOptionContent]", never, { "optionId": { "alias": "vtRadioOptionContent"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class VoteyTextareaComponent implements ControlValueAccessor {
    private readonly fallbackId;
    private readonly formDisabled;
    readonly value: ModelSignal<string>;
    readonly label: InputSignal<string>;
    readonly placeholder: InputSignal<string>;
    readonly helper: InputSignal<string>;
    readonly showLabel: InputSignalWithTransform<boolean, unknown>;
    readonly showHelper: InputSignalWithTransform<boolean, unknown>;
    readonly disabled: InputSignalWithTransform<boolean, unknown>;
    readonly required: InputSignalWithTransform<boolean, unknown>;
    readonly readOnly: InputSignalWithTransform<boolean, unknown>;
    readonly error: InputSignalWithTransform<boolean, unknown>;
    readonly trimOnBlur: InputSignalWithTransform<boolean, unknown>;
    readonly autofocus: InputSignalWithTransform<boolean, unknown>;
    readonly spellcheck: InputSignalWithTransform<boolean, unknown>;
    readonly id: InputSignal<string>;
    readonly name: InputSignal<string>;
    readonly autocomplete: InputSignal<string>;
    readonly minLength: InputSignal<number | null>;
    readonly maxLength: InputSignal<number | null>;
    readonly ariaLabel: InputSignal<string>;
    readonly ariaDescribedby: InputSignal<string>;
    readonly dataCy: InputSignal<string>;
    readonly changed: OutputEmitterRef<string>;
    readonly focused: OutputEmitterRef<FocusEvent>;
    readonly blurred: OutputEmitterRef<FocusEvent>;
    readonly keyDown: OutputEmitterRef<KeyboardEvent>;
    protected readonly textareaElement: Signal<ElementRef<HTMLTextAreaElement> | undefined>;
    protected readonly effectiveDisabled: Signal<boolean>;
    protected readonly resolvedId: Signal<string>;
    protected readonly helperId: Signal<string>;
    protected readonly labelVisible: Signal<boolean>;
    protected readonly helperVisible: Signal<boolean>;
    protected readonly resolvedAriaLabel: Signal<string | null>;
    protected readonly resolvedAriaDescribedby: Signal<string | null>;
    protected readonly textareaClasses: Signal<string>;
    private onChange;
    private onTouched;
    writeValue(value: string | null | undefined): void;
    registerOnChange(callback: (value: string) => void): void;
    registerOnTouched(callback: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    select(): void;
    clear(): void;
    protected handleInput(event: Event): void;
    protected handleFocus(event: FocusEvent): void;
    protected handleBlur(event: FocusEvent): void;
    protected handleKeyDown(event: KeyboardEvent): void;
    private commitValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyTextareaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyTextareaComponent, "vt-textarea", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "helper": { "alias": "helper"; "required": false; "isSignal": true; }; "showLabel": { "alias": "showLabel"; "required": false; "isSignal": true; }; "showHelper": { "alias": "showHelper"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "readOnly": { "alias": "readOnly"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "trimOnBlur": { "alias": "trimOnBlur"; "required": false; "isSignal": true; }; "autofocus": { "alias": "autofocus"; "required": false; "isSignal": true; }; "spellcheck": { "alias": "spellcheck"; "required": false; "isSignal": true; }; "id": { "alias": "id"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "autocomplete": { "alias": "autocomplete"; "required": false; "isSignal": true; }; "minLength": { "alias": "minLength"; "required": false; "isSignal": true; }; "maxLength": { "alias": "maxLength"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; "ariaDescribedby": { "alias": "ariaDescribedby"; "required": false; "isSignal": true; }; "dataCy": { "alias": "dataCy"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; "changed": "changed"; "focused": "focused"; "blurred": "blurred"; "keyDown": "keyDown"; }, never, never, true, never>;
}

declare const VoteyTextVariants: readonly ["h1", "h2", "h3", "h4", "h5", "body-l", "body", "body-s", "caption", "caption-s", "micro", "button", "table-header", "label"];
declare const VoteyTextColors: readonly ["primary", "secondary", "muted", "inverse", "accent", "on-sidebar"];
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

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VOTEY_SVG_REGISTRY_CONFIG, VOTEY_TRANSLATOR, VoteyButtonComponent, VoteyButtonSizes, VoteyButtonVariants, VoteyCheckboxComponent, VoteyDeviceService, VoteyIconComponent, VoteyIconNames, VoteyIconRegistryEntries, VoteyIllustrationNames, VoteyIllustrationRegistryEntries, VoteyRadioButtonComponent, VoteyRadioOptionContentDirective, VoteySvgRegistryService, VoteyTextColors, VoteyTextComponent, VoteyTextVariants, VoteyTextareaComponent, VoteyTranslatePipe, provideVoteyDeviceDetection, provideVoteySvgRegistry };
export type { VoteyButtonSize, VoteyButtonType, VoteyButtonVariant, VoteyCheckboxLabelPosition, VoteyDevice, VoteyDeviceDimensions, VoteyDeviceOrientation, VoteyGridConfig, VoteyIcon, VoteyIllustration, VoteyRadioButtonLabelPosition, VoteySvgRegistryConfig, VoteySvgRegistryEntry, VoteyTextColor, VoteyTextVariant, VoteyTranslationParams, VoteyTranslator, VtRadioOption };
