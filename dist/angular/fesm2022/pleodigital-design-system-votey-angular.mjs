import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as i0 from '@angular/core';
import { InjectionToken, inject, PLATFORM_ID, Injectable, makeEnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';
import DeviceDetector from 'node-device-detector';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_DIMENSIONS = {
    width: 0,
    height: 0,
    mobileBreakpoint: 375,
    tabletBreakpoint: 1024,
    laptopBreakpoint: 1280,
    desktopBreakpoint: 1920,
};
const VOTEY_DEFAULT_GRID_CONFIG = Object.freeze({
    desktop: 12,
    tablet: 8,
    mobile: 4,
});
const VOTEY_GRID_CONFIG = new InjectionToken("VoteyGridConfig");
class VoteyDeviceService {
    document = inject(DOCUMENT);
    gridConfig = inject(VOTEY_GRID_CONFIG, { optional: true }) ??
        VOTEY_DEFAULT_GRID_CONFIG;
    platformId = inject(PLATFORM_ID);
    deviceTypeSubject = new BehaviorSubject(null);
    dimensionsSubject = new BehaviorSubject(DEFAULT_DIMENSIONS);
    initializedSubject = new BehaviorSubject(false);
    columnsAmountSubject = new BehaviorSubject(0);
    listeningForResize = false;
    deviceType$ = this.deviceTypeSubject.asObservable();
    deviceDimensions$ = this.dimensionsSubject.asObservable();
    initialized$ = this.initializedSubject.asObservable();
    columnsAmount$ = this.columnsAmountSubject.asObservable();
    columnsAmount = 0;
    currentDevice = null;
    deviceOrientation = "vertical";
    isMobileDevice = false;
    isTabletDevice = false;
    isDesktopDevice = false;
    handleResize = () => {
        const browserWindow = this.document.defaultView;
        if (browserWindow) {
            this.update(browserWindow.innerWidth, browserWindow.innerHeight);
        }
    };
    initialize() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const browserWindow = this.document.defaultView;
        if (!browserWindow) {
            return;
        }
        this.update(browserWindow.innerWidth, browserWindow.innerHeight);
        if (!this.listeningForResize) {
            browserWindow.addEventListener("resize", this.handleResize, {
                passive: true,
            });
            this.listeningForResize = true;
        }
    }
    update(innerWidth, innerHeight) {
        const browserWindow = this.document.defaultView;
        if (!browserWindow) {
            return;
        }
        this.dimensionsSubject.next({
            ...DEFAULT_DIMENSIONS,
            width: innerWidth,
            height: innerHeight,
        });
        this.deviceOrientation =
            innerWidth > innerHeight ? "horizontal" : "vertical";
        this.detectDevice(browserWindow.navigator);
        this.applyDocumentState(innerHeight);
        this.initializedSubject.next(true);
    }
    ngOnDestroy() {
        const browserWindow = this.document.defaultView;
        if (browserWindow && this.listeningForResize) {
            browserWindow.removeEventListener("resize", this.handleResize);
            this.listeningForResize = false;
        }
    }
    detectDevice(browserNavigator) {
        const detector = new DeviceDetector({
            clientIndexes: true,
            deviceIndexes: true,
            osIndexes: true,
            deviceAliasCode: false,
            deviceTrusted: false,
            deviceInfo: false,
            maxUserAgentSize: 500,
        });
        const result = detector.detect(browserNavigator.userAgent);
        const isTouchMac = result.device.type === "desktop" &&
            browserNavigator.maxTouchPoints > 2 &&
            /Macintosh/.test(browserNavigator.userAgent);
        this.isMobileDevice =
            result.device.type === "smartphone" ||
                result.device.type === "phablet" ||
                result.device.type === "feature phone";
        this.isTabletDevice = result.device.type === "tablet" || isTouchMac;
        this.isDesktopDevice = !this.isMobileDevice && !this.isTabletDevice;
        this.currentDevice = this.isMobileDevice
            ? "mobile"
            : this.isTabletDevice
                ? "tablet"
                : "desktop";
        this.columnsAmount = this.gridConfig[this.currentDevice];
        this.columnsAmountSubject.next(this.columnsAmount);
    }
    applyDocumentState(innerHeight) {
        if (!this.currentDevice) {
            return;
        }
        this.deviceTypeSubject.next(this.currentDevice);
        this.document.body.setAttribute("data-device", this.currentDevice);
        this.document.body.setAttribute("data-orientation", this.deviceOrientation);
        this.document.documentElement.style.setProperty("--vh", `${innerHeight / 100}px`);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyDeviceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyDeviceService, providedIn: "root" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyDeviceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }] });
function provideVoteyDeviceDetection(gridConfig = VOTEY_DEFAULT_GRID_CONFIG) {
    return makeEnvironmentProviders([
        {
            provide: VOTEY_GRID_CONFIG,
            useValue: gridConfig,
        },
        provideEnvironmentInitializer(() => inject(VoteyDeviceService).initialize()),
    ]);
}

// This file is generated by scripts/generate-asset-types.mjs.
// Do not edit it manually. Source SVG files remain unchanged.
const VoteyIconNames = [
    "logo-wyborek-sygnet",
    "menu-burger",
    "menu-dashboard",
    "menu-download",
    "menu-participants",
    "menu-settings",
    "menu-team",
    "menu-vote",
    "sp-check",
    "sp-flag-poland",
    "sp-flag-united-kingdom",
    "sp-in-progress",
    "sp-incorrect",
    "ui-agenda",
    "ui-arrow-right",
    "ui-attachment",
    "ui-authorization",
    "ui-calendar",
    "ui-camera-change",
    "ui-camera-off",
    "ui-camera-on",
    "ui-chat",
    "ui-chevron",
    "ui-close",
    "ui-close-v2",
    "ui-countdown",
    "ui-delete",
    "ui-download",
    "ui-edit",
    "ui-edit-v2",
    "ui-end",
    "ui-event-completed",
    "ui-event-invitation",
    "ui-event-notification",
    "ui-exclamation-mark",
    "ui-expand-arrow",
    "ui-file-csv",
    "ui-file-doc",
    "ui-file-dwg",
    "ui-file-eml",
    "ui-file-jpg",
    "ui-file-mp3",
    "ui-file-mp4",
    "ui-file-pdf",
    "ui-file-png",
    "ui-file-ppt",
    "ui-file-rar",
    "ui-file-rtf",
    "ui-file-tif",
    "ui-file-txt",
    "ui-file-xls",
    "ui-file-xml",
    "ui-file-zip",
    "ui-full-screen",
    "ui-full-screen-v2",
    "ui-hand",
    "ui-hang-up",
    "ui-microphone-off",
    "ui-microphone-on",
    "ui-move",
    "ui-navigate",
    "ui-participant",
    "ui-participants-list",
    "ui-participants-list-v2",
    "ui-pending",
    "ui-pin",
    "ui-preview",
    "ui-problem",
    "ui-proxy",
    "ui-proxy-thick",
    "ui-remind-password",
    "ui-save",
    "ui-send-again",
    "ui-send-again-v2",
    "ui-settings",
    "ui-share-screen",
    "ui-show-graph-thick",
    "ui-start",
    "ui-time",
    "ui-time-v2",
    "ui-turn-on-thick",
    "ui-unlimited",
    "ui-update",
    "ui-videoconference",
    "ui-visibility-off",
    "ui-visibility-on",
    "ui-voting",
    "ui-voting-new",
    "ui-voting-thick",
];
const VoteyIllustrationNames = [
    "background-acknowledgments",
    "background-add-participants-to-vote",
    "background-agenda",
    "background-choose-subscription-plan",
    "background-create-first-vote",
    "background-even-available-everyone",
    "background-first-group-participants",
    "background-first-time-participant",
    "background-first-time-participant-v2",
    "background-forgot-password",
    "background-general-meeting",
    "background-home-screen-after-log-in",
    "background-loading-screen",
    "background-login",
    "background-many-voted",
    "background-observer",
    "background-one-time-voting",
    "background-participant-man",
    "background-participant-woman",
    "background-point-voting",
    "background-questionnaire-v3",
    "background-registration",
    "background-regular-voter",
    "background-results-preview-unavailable-v1",
    "background-results-voting-v3",
    "background-survey",
    "background-test-event",
    "background-vote-as-proxy",
    "background-vote-yourself",
    "background-voting-ended-v3",
    "background-voting-started",
    "background-voting-type-yes-no",
    "logo-votey",
    "logo-wyborek",
    "spot-add-participants-email",
    "spot-add-participants-public-access",
    "spot-add-participants-sms",
    "spot-add-participants-unique-codes",
    "spot-agenda",
    "spot-agenda-no-visible",
    "spot-agenda-no-visible-v2",
    "spot-answer-method-open-ended-questions",
    "spot-automatic-voting-start",
    "spot-automatic-voting-start-v2",
    "spot-can-vote-v2",
    "spot-chat",
    "spot-chat-none",
    "spot-forum",
    "spot-forum-none",
    "spot-interactive-video-conference",
    "spot-login-on-another-device",
    "spot-multiple-response-method",
    "spot-no-result",
    "spot-no-vote-v2",
    "spot-not-proxy-v2",
    "spot-not-visible",
    "spot-one-answer-method",
    "spot-proxy",
    "spot-proxy-v2",
    "spot-report-pdf",
    "spot-report-pdf-none",
    "spot-report-pdf-none-v2",
    "spot-report-pdf-v2",
    "spot-response-method-point-system",
    "spot-result",
    "spot-simple-answers-open-secret-question",
    "spot-simple-answers-question-public",
    "spot-simple-arrow",
    "spot-simple-automatic-voting-start",
    "spot-simple-chat",
    "spot-simple-clicked",
    "spot-simple-delivered",
    "spot-simple-manual-voting-start-v3",
    "spot-simple-mode-bright",
    "spot-simple-mode-dark",
    "spot-simple-notification",
    "spot-simple-open",
    "spot-simple-panel-avatar",
    "spot-simple-proxy",
    "spot-streaming",
    "spot-videoconference",
    "spot-visible",
    "spot-voice-communication",
    "spot-voting-uneditable",
    "spot-voting-uneditable-v2",
    "spot-voting-yes-no-v2",
];

/**
 * Generated bundle index. Do not edit.
 */

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VoteyDeviceService, VoteyIconNames, VoteyIllustrationNames, provideVoteyDeviceDetection };
//# sourceMappingURL=pleodigital-design-system-votey-angular.mjs.map
