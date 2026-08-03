import * as i0 from '@angular/core';
import { EnvironmentProviders, OnDestroy, InjectionToken, InputSignal, OutputEmitterRef, Signal } from '@angular/core';
import { Observable } from 'rxjs';

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

declare const VoteyIconNames: readonly ["logo-wyborek-sygnet", "menu-burger", "menu-dashboard", "menu-download", "menu-participants", "menu-settings", "menu-team", "menu-vote", "sp-arrow", "sp-check", "sp-correct", "sp-flag-poland", "sp-flag-united-kingdom", "sp-in-progress", "sp-incorrect", "sp-new", "ui-agenda", "ui-arrow-right", "ui-attachment", "ui-authorization", "ui-burger", "ui-calendar", "ui-camera-change", "ui-camera-off", "ui-camera-on", "ui-chat", "ui-chevron", "ui-close", "ui-close-v2", "ui-countdown", "ui-delete", "ui-download", "ui-edit", "ui-edit-v2", "ui-end", "ui-event-completed", "ui-event-invitation", "ui-event-notification", "ui-exclamation-mark", "ui-expand-arrow", "ui-file-csv", "ui-file-doc", "ui-file-dwg", "ui-file-eml", "ui-file-jpg", "ui-file-mp3", "ui-file-mp4", "ui-file-pdf", "ui-file-png", "ui-file-ppt", "ui-file-rar", "ui-file-rtf", "ui-file-tif", "ui-file-txt", "ui-file-xls", "ui-file-xml", "ui-file-zip", "ui-full-screen", "ui-full-screen-v2", "ui-grid", "ui-hand", "ui-hang-up", "ui-microphone-off", "ui-microphone-on", "ui-move", "ui-navigate", "ui-participant", "ui-participants-list", "ui-participants-list-v2", "ui-pending", "ui-pin", "ui-preview", "ui-problem", "ui-proxy", "ui-proxy-thick", "ui-remind-password", "ui-save", "ui-send-again", "ui-send-again-v2", "ui-settings", "ui-share-screen", "ui-show-graph-thick", "ui-start", "ui-time", "ui-time-v2", "ui-turn-on-thick", "ui-unlimited", "ui-update", "ui-videoconference", "ui-visibility-off", "ui-visibility-on", "ui-voting", "ui-voting-new", "ui-voting-thick"];
type VoteyIcon = (typeof VoteyIconNames)[number];
interface VoteySvgRegistryEntry<Name extends string> {
    readonly name: Name;
    readonly path: string;
}
declare const VoteyIconRegistryEntries: readonly VoteySvgRegistryEntry<VoteyIcon>[];
declare const VoteyIllustrationNames: readonly ["bg-acknowledgments", "bg-add-participants", "bg-agenda", "bg-choose-subscription-plan", "bg-create-first-vote", "bg-event-type-basic", "bg-event-type-general-meeting", "bg-forgot-password", "bg-home-screen-after-login", "bg-loading-screen", "bg-login", "bg-one-time-voting", "bg-participant-everyone", "bg-participant-first-group", "bg-participant-first-time", "bg-participant-first-time-v2", "bg-participant-man", "bg-participant-type-observer", "bg-participant-type-voter", "bg-participant-woman", "bg-point-voting", "bg-questionnaire", "bg-registration", "bg-results-preview-unavailable", "bg-test-event", "bg-vote-as-proxy", "bg-vote-yourself", "bg-voting-ended", "bg-voting-results", "bg-voting-started", "bg-voting-type-survey", "bg-voting-type-yes-no", "logo-votey", "logo-wyborek", "simple-anonymity-off", "simple-anonymity-on", "simple-avatar", "simple-chat", "simple-click", "simple-delivered", "simple-notification", "simple-open", "simple-pointer-hand", "simple-proxy", "simple-theme-dark", "simple-theme-light", "simple-voting-start-automatic", "spot-add-participants-email", "spot-add-participants-public-access", "spot-add-participants-sms", "spot-add-participants-unique-codes", "spot-agenda-visibility-off", "spot-agenda-visibility-off-v2", "spot-agenda-visibility-on", "spot-answer-method-multiple", "spot-answer-method-open-ended", "spot-answer-method-point-system", "spot-answer-method-single", "spot-chat-off", "spot-chat-on", "spot-forum-off", "spot-forum-on", "spot-interactive-video-conference", "spot-login-on-another-device", "spot-proxy", "spot-proxy-off", "spot-proxy-on", "spot-report-pdf-off", "spot-report-pdf-off-v2", "spot-report-pdf-on", "spot-report-pdf-on-v2", "spot-results-off", "spot-results-on", "spot-streaming", "spot-videoconference-off", "spot-videoconference-on", "spot-visibility-off", "spot-visibility-on", "spot-voice-communication", "spot-voting-editing-off", "spot-voting-editing-off-v2", "spot-voting-editing-on", "spot-voting-off", "spot-voting-on", "spot-voting-start-automatic", "spot-voting-start-automatic-v2", "spot-voting-start-manual", "spot-voting-yes-no"];
type VoteyIllustration = (typeof VoteyIllustrationNames)[number];
declare const VoteyIllustrationRegistryEntries: readonly VoteySvgRegistryEntry<VoteyIllustration>[];

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
    readonly hasIcon: InputSignal<boolean>;
    readonly badge: InputSignal<string | number | null>;
    readonly ariaLabel: InputSignal<string>;
    readonly ariaExpanded: InputSignal<boolean | null>;
    readonly ariaPressed: InputSignal<boolean | null>;
    readonly tooltipText: InputSignal<string>;
    readonly disabledNote: InputSignal<string>;
    readonly pressed: OutputEmitterRef<void>;
    protected readonly buttonClasses: Signal<string>;
    protected readonly isIconButton: Signal<boolean>;
    protected readonly resolvedAriaLabel: Signal<string>;
    protected readonly resolvedTooltipText: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VoteyButtonComponent, "votey-button", never, { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "text": { "alias": "text"; "required": false; "isSignal": true; }; "hasIcon": { "alias": "hasIcon"; "required": false; "isSignal": true; }; "badge": { "alias": "badge"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; "ariaExpanded": { "alias": "ariaExpanded"; "required": false; "isSignal": true; }; "ariaPressed": { "alias": "ariaPressed"; "required": false; "isSignal": true; }; "tooltipText": { "alias": "tooltipText"; "required": false; "isSignal": true; }; "disabledNote": { "alias": "disabledNote"; "required": false; "isSignal": true; }; }, { "pressed": "pressed"; }, never, ["[voteyButtonIcon]"], true, never>;
}

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VOTEY_SVG_REGISTRY_CONFIG, VoteyButtonComponent, VoteyButtonSizes, VoteyButtonVariants, VoteyDeviceService, VoteyIconNames, VoteyIconRegistryEntries, VoteyIllustrationNames, VoteyIllustrationRegistryEntries, VoteySvgRegistryService, provideVoteyDeviceDetection, provideVoteySvgRegistry };
export type { VoteyButtonSize, VoteyButtonType, VoteyButtonVariant, VoteyDevice, VoteyDeviceDimensions, VoteyDeviceOrientation, VoteyGridConfig, VoteyIcon, VoteyIllustration, VoteySvgRegistryConfig, VoteySvgRegistryEntry };
