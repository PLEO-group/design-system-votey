import * as i0 from '@angular/core';
import { EnvironmentProviders, OnDestroy, InjectionToken } from '@angular/core';
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

declare const VoteyIconNames: readonly ["logo-wyborek-sygnet", "menu-button-show-table", "menu-dashboard", "menu-participants", "menu-settings", "menu-show-graph", "menu-team", "menu-turn-on", "menu-vote", "ui-agenda", "ui-agenda-update", "ui-anuluj", "ui-anuluj-2", "ui-arrow-right", "ui-attachment-simple", "ui-authorization", "ui-calendar", "ui-camera-change", "ui-camera-off", "ui-camera-on", "ui-chat", "ui-check", "ui-chevron", "ui-coundown", "ui-csv", "ui-delete", "ui-doc", "ui-download", "ui-dwg", "ui-edit", "ui-eml", "ui-event-completed", "ui-event-invitation", "ui-event-notification", "ui-event-start", "ui-exclamation-mark", "ui-expand-arrow", "ui-full-screen", "ui-go-fullscreen", "ui-go-to", "ui-hand", "ui-hang-up", "ui-in-progress", "ui-iu-download", "ui-iu-send-again-v2", "ui-jpg", "ui-list-of-participants-v1", "ui-list-of-participants-v2", "ui-menu", "ui-microphone-off", "ui-microphone-on", "ui-mp3", "ui-mp4", "ui-navigation", "ui-no-limit", "ui-not-saved", "ui-not-visible", "ui-observer", "ui-participant", "ui-pdf", "ui-pin", "ui-plain-close", "ui-png", "ui-poland", "ui-ppt", "ui-preview", "ui-proxy", "ui-proxy-simple", "ui-rar", "ui-remind-password", "ui-report-problem", "ui-rtf", "ui-send-again-v1", "ui-settings", "ui-share-screen", "ui-status-edit", "ui-status-exclusion", "ui-tif", "ui-time-v1", "ui-time-v2", "ui-txt", "ui-united-kingdom", "ui-video", "ui-videoconference", "ui-voting", "ui-voting-end", "ui-voting-new", "ui-voting-pending", "ui-voting-simple", "ui-xls", "ui-xml", "ui-zip"];
type VoteyIcon = (typeof VoteyIconNames)[number];
declare const VoteyIllustrationNames: readonly ["background-acknowledgments", "background-add-participants-to-vote", "background-agenda", "background-choose-subscription-plan", "background-create-first-vote", "background-even-available-everyone", "background-first-group-participants", "background-first-time-participant", "background-first-time-participant-v2", "background-forgot-password", "background-general-meeting", "background-home-screen-after-log-in", "background-loading-screen", "background-login", "background-many-voted", "background-observer", "background-one-time-voting", "background-participant-man", "background-participant-woman", "background-point-voting", "background-questionnaire-v3", "background-registration", "background-regular-voter", "background-results-preview-unavailable-v1", "background-results-voting-v3", "background-survey", "background-test-event", "background-vote-as-proxy", "background-vote-yourself", "background-voting-ended-v3", "background-voting-started", "background-voting-type-yes-no", "logo-votey", "logo-wyborek", "spot-add-participants-email", "spot-add-participants-public-access", "spot-add-participants-sms", "spot-add-participants-unique-codes", "spot-agenda", "spot-agenda-no-visible", "spot-agenda-no-visible-v2", "spot-answer-method-open-ended-questions", "spot-automatic-voting-start", "spot-automatic-voting-start-v2", "spot-can-vote-v2", "spot-chat", "spot-chat-none", "spot-forum", "spot-forum-none", "spot-interactive-video-conference", "spot-login-on-another-device", "spot-multiple-response-method", "spot-no-result", "spot-no-vote-v2", "spot-not-proxy-v2", "spot-not-visible", "spot-one-answer-method", "spot-proxy", "spot-proxy-v2", "spot-report-pdf", "spot-report-pdf-none", "spot-report-pdf-none-v2", "spot-report-pdf-v2", "spot-response-method-point-system", "spot-result", "spot-simple-answers-open-secret-question", "spot-simple-answers-question-public", "spot-simple-arrow", "spot-simple-automatic-voting-start", "spot-simple-chat", "spot-simple-clicked", "spot-simple-delivered", "spot-simple-manual-voting-start-v3", "spot-simple-mode-bright", "spot-simple-mode-dark", "spot-simple-notification", "spot-simple-open", "spot-simple-panel-avatar", "spot-simple-proxy", "spot-streaming", "spot-videoconference", "spot-visible", "spot-voice-communication", "spot-voting-uneditable", "spot-voting-uneditable-v2", "spot-voting-yes-no-v2"];
type VoteyIllustration = (typeof VoteyIllustrationNames)[number];

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VoteyDeviceService, VoteyIconNames, VoteyIllustrationNames, provideVoteyDeviceDetection };
export type { VoteyDevice, VoteyDeviceDimensions, VoteyDeviceOrientation, VoteyGridConfig, VoteyIcon, VoteyIllustration };
