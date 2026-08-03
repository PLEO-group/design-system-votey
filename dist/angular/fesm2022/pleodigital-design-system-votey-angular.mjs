import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as i0 from '@angular/core';
import { InjectionToken, inject, PLATFORM_ID, Injectable, makeEnvironmentProviders, provideEnvironmentInitializer, input, output, computed, ChangeDetectionStrategy, Component } from '@angular/core';
import DeviceDetector from 'node-device-detector';
import { BehaviorSubject } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';

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
    "sp-arrow",
    "sp-check",
    "sp-correct",
    "sp-flag-poland",
    "sp-flag-united-kingdom",
    "sp-in-progress",
    "sp-incorrect",
    "sp-new",
    "ui-agenda",
    "ui-arrow-right",
    "ui-attachment",
    "ui-authorization",
    "ui-burger",
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
    "ui-grid",
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
const VoteyIconRegistryEntries = [
    { name: "logo-wyborek-sygnet", path: "icons/logotypes/logo_wyborek_sygnet.svg" },
    { name: "menu-burger", path: "icons/menu/icon_menu_burger.svg" },
    { name: "menu-dashboard", path: "icons/menu/icon_menu_dashboard.svg" },
    { name: "menu-download", path: "icons/menu/icon_menu_download.svg" },
    { name: "menu-participants", path: "icons/menu/icon_menu_participants.svg" },
    { name: "menu-settings", path: "icons/menu/icon_menu_settings.svg" },
    { name: "menu-team", path: "icons/menu/icon_menu_team.svg" },
    { name: "menu-vote", path: "icons/menu/icon_menu_vote.svg" },
    { name: "sp-arrow", path: "icons/special/icon_sp_arrow.svg" },
    { name: "sp-check", path: "icons/special/icon_sp_check.svg" },
    { name: "sp-correct", path: "icons/special/icon_sp_correct.svg" },
    { name: "sp-flag-poland", path: "icons/special/icon_sp_flag-poland.svg" },
    { name: "sp-flag-united-kingdom", path: "icons/special/icon_sp_flag-united-kingdom.svg" },
    { name: "sp-in-progress", path: "icons/special/icon_sp_in-progress.svg" },
    { name: "sp-incorrect", path: "icons/special/icon_sp_incorrect.svg" },
    { name: "sp-new", path: "icons/special/icon_sp_new.svg" },
    { name: "ui-agenda", path: "icons/ui/icon_ui_agenda.svg" },
    { name: "ui-arrow-right", path: "icons/ui/icon_ui_arrow-right.svg" },
    { name: "ui-attachment", path: "icons/ui/icon_ui_attachment.svg" },
    { name: "ui-authorization", path: "icons/ui/icon_ui_authorization.svg" },
    { name: "ui-burger", path: "icons/ui/icon_ui_burger.svg" },
    { name: "ui-calendar", path: "icons/ui/icon_ui_calendar.svg" },
    { name: "ui-camera-change", path: "icons/ui/icon_ui_camera-change.svg" },
    { name: "ui-camera-off", path: "icons/ui/icon_ui_camera-off.svg" },
    { name: "ui-camera-on", path: "icons/ui/icon_ui_camera-on.svg" },
    { name: "ui-chat", path: "icons/ui/icon_ui_chat.svg" },
    { name: "ui-chevron", path: "icons/ui/icon_ui_chevron.svg" },
    { name: "ui-close", path: "icons/ui/icon_ui_close.svg" },
    { name: "ui-close-v2", path: "icons/ui/icon_ui_close_v2.svg" },
    { name: "ui-countdown", path: "icons/ui/icon_ui_countdown.svg" },
    { name: "ui-delete", path: "icons/ui/icon_ui_delete.svg" },
    { name: "ui-download", path: "icons/ui/icon_ui_download.svg" },
    { name: "ui-edit", path: "icons/ui/icon_ui_edit.svg" },
    { name: "ui-edit-v2", path: "icons/ui/icon_ui_edit_v2.svg" },
    { name: "ui-end", path: "icons/ui/icon_ui_end.svg" },
    { name: "ui-event-completed", path: "icons/ui/icon_ui_event-completed.svg" },
    { name: "ui-event-invitation", path: "icons/ui/icon_ui_event-invitation.svg" },
    { name: "ui-event-notification", path: "icons/ui/icon_ui_event-notification.svg" },
    { name: "ui-exclamation-mark", path: "icons/ui/icon_ui_exclamation-mark.svg" },
    { name: "ui-expand-arrow", path: "icons/ui/icon_ui_expand_arrow.svg" },
    { name: "ui-file-csv", path: "icons/ui/icon_ui_file-csv.svg" },
    { name: "ui-file-doc", path: "icons/ui/icon_ui_file-doc.svg" },
    { name: "ui-file-dwg", path: "icons/ui/icon_ui_file-dwg.svg" },
    { name: "ui-file-eml", path: "icons/ui/icon_ui_file-eml.svg" },
    { name: "ui-file-jpg", path: "icons/ui/icon_ui_file-jpg.svg" },
    { name: "ui-file-mp3", path: "icons/ui/icon_ui_file-mp3.svg" },
    { name: "ui-file-mp4", path: "icons/ui/icon_ui_file-mp4.svg" },
    { name: "ui-file-pdf", path: "icons/ui/icon_ui_file-pdf.svg" },
    { name: "ui-file-png", path: "icons/ui/icon_ui_file-png.svg" },
    { name: "ui-file-ppt", path: "icons/ui/icon_ui_file-ppt.svg" },
    { name: "ui-file-rar", path: "icons/ui/icon_ui_file-rar.svg" },
    { name: "ui-file-rtf", path: "icons/ui/icon_ui_file-rtf.svg" },
    { name: "ui-file-tif", path: "icons/ui/icon_ui_file-tif.svg" },
    { name: "ui-file-txt", path: "icons/ui/icon_ui_file-txt.svg" },
    { name: "ui-file-xls", path: "icons/ui/icon_ui_file-xls.svg" },
    { name: "ui-file-xml", path: "icons/ui/icon_ui_file-xml.svg" },
    { name: "ui-file-zip", path: "icons/ui/icon_ui_file-zip.svg" },
    { name: "ui-full-screen", path: "icons/ui/icon_ui_full-screen.svg" },
    { name: "ui-full-screen-v2", path: "icons/ui/icon_ui_full-screen_v2.svg" },
    { name: "ui-grid", path: "icons/ui/icon_ui_grid.svg" },
    { name: "ui-hand", path: "icons/ui/icon_ui_hand.svg" },
    { name: "ui-hang-up", path: "icons/ui/icon_ui_hang-up.svg" },
    { name: "ui-microphone-off", path: "icons/ui/icon_ui_microphone-off.svg" },
    { name: "ui-microphone-on", path: "icons/ui/icon_ui_microphone-on.svg" },
    { name: "ui-move", path: "icons/ui/icon_ui_move.svg" },
    { name: "ui-navigate", path: "icons/ui/icon_ui_navigate.svg" },
    { name: "ui-participant", path: "icons/ui/icon_ui_participant.svg" },
    { name: "ui-participants-list", path: "icons/ui/icon_ui_participants-list.svg" },
    { name: "ui-participants-list-v2", path: "icons/ui/icon_ui_participants-list_v2.svg" },
    { name: "ui-pending", path: "icons/ui/icon_ui_pending.svg" },
    { name: "ui-pin", path: "icons/ui/icon_ui_pin.svg" },
    { name: "ui-preview", path: "icons/ui/icon_ui_preview.svg" },
    { name: "ui-problem", path: "icons/ui/icon_ui_problem.svg" },
    { name: "ui-proxy", path: "icons/ui/icon_ui_proxy.svg" },
    { name: "ui-proxy-thick", path: "icons/ui/icon_ui_proxy_thick.svg" },
    { name: "ui-remind-password", path: "icons/ui/icon_ui_remind-password.svg" },
    { name: "ui-save", path: "icons/ui/icon_ui_save.svg" },
    { name: "ui-send-again", path: "icons/ui/icon_ui_send-again.svg" },
    { name: "ui-send-again-v2", path: "icons/ui/icon_ui_send-again_v2.svg" },
    { name: "ui-settings", path: "icons/ui/icon_ui_settings.svg" },
    { name: "ui-share-screen", path: "icons/ui/icon_ui_share-screen.svg" },
    { name: "ui-show-graph-thick", path: "icons/ui/icon_ui_show-graph_thick.svg" },
    { name: "ui-start", path: "icons/ui/icon_ui_start.svg" },
    { name: "ui-time", path: "icons/ui/icon_ui_time.svg" },
    { name: "ui-time-v2", path: "icons/ui/icon_ui_time_v2.svg" },
    { name: "ui-turn-on-thick", path: "icons/ui/icon_ui_turn-on_thick.svg" },
    { name: "ui-unlimited", path: "icons/ui/icon_ui_unlimited.svg" },
    { name: "ui-update", path: "icons/ui/icon_ui_update.svg" },
    { name: "ui-videoconference", path: "icons/ui/icon_ui_videoconference.svg" },
    { name: "ui-visibility-off", path: "icons/ui/icon_ui_visibility-off.svg" },
    { name: "ui-visibility-on", path: "icons/ui/icon_ui_visibility-on.svg" },
    { name: "ui-voting", path: "icons/ui/icon_ui_voting.svg" },
    { name: "ui-voting-new", path: "icons/ui/icon_ui_voting-new.svg" },
    { name: "ui-voting-thick", path: "icons/ui/icon_ui_voting_thick.svg" },
];
const VoteyIllustrationNames = [
    "bg-acknowledgments",
    "bg-add-participants",
    "bg-agenda",
    "bg-choose-subscription-plan",
    "bg-create-first-vote",
    "bg-event-type-basic",
    "bg-event-type-general-meeting",
    "bg-forgot-password",
    "bg-home-screen-after-login",
    "bg-loading-screen",
    "bg-login",
    "bg-one-time-voting",
    "bg-participant-everyone",
    "bg-participant-first-group",
    "bg-participant-first-time",
    "bg-participant-first-time-v2",
    "bg-participant-man",
    "bg-participant-type-observer",
    "bg-participant-type-voter",
    "bg-participant-woman",
    "bg-point-voting",
    "bg-questionnaire",
    "bg-registration",
    "bg-results-preview-unavailable",
    "bg-test-event",
    "bg-vote-as-proxy",
    "bg-vote-yourself",
    "bg-voting-ended",
    "bg-voting-results",
    "bg-voting-started",
    "bg-voting-type-survey",
    "bg-voting-type-yes-no",
    "logo-votey",
    "logo-wyborek",
    "simple-anonymity-off",
    "simple-anonymity-on",
    "simple-avatar",
    "simple-chat",
    "simple-click",
    "simple-delivered",
    "simple-notification",
    "simple-open",
    "simple-pointer-hand",
    "simple-proxy",
    "simple-theme-dark",
    "simple-theme-light",
    "simple-voting-start-automatic",
    "spot-add-participants-email",
    "spot-add-participants-public-access",
    "spot-add-participants-sms",
    "spot-add-participants-unique-codes",
    "spot-agenda-visibility-off",
    "spot-agenda-visibility-off-v2",
    "spot-agenda-visibility-on",
    "spot-answer-method-multiple",
    "spot-answer-method-open-ended",
    "spot-answer-method-point-system",
    "spot-answer-method-single",
    "spot-chat-off",
    "spot-chat-on",
    "spot-forum-off",
    "spot-forum-on",
    "spot-interactive-video-conference",
    "spot-login-on-another-device",
    "spot-proxy",
    "spot-proxy-off",
    "spot-proxy-on",
    "spot-report-pdf-off",
    "spot-report-pdf-off-v2",
    "spot-report-pdf-on",
    "spot-report-pdf-on-v2",
    "spot-results-off",
    "spot-results-on",
    "spot-streaming",
    "spot-videoconference-off",
    "spot-videoconference-on",
    "spot-visibility-off",
    "spot-visibility-on",
    "spot-voice-communication",
    "spot-voting-editing-off",
    "spot-voting-editing-off-v2",
    "spot-voting-editing-on",
    "spot-voting-off",
    "spot-voting-on",
    "spot-voting-start-automatic",
    "spot-voting-start-automatic-v2",
    "spot-voting-start-manual",
    "spot-voting-yes-no",
];
const VoteyIllustrationRegistryEntries = [
    { name: "bg-acknowledgments", path: "illustrations/background/illu_bg_acknowledgments.svg" },
    { name: "bg-add-participants", path: "illustrations/background/illu_bg_add-participants.svg" },
    { name: "bg-agenda", path: "illustrations/background/illu_bg_agenda.svg" },
    { name: "bg-choose-subscription-plan", path: "illustrations/background/illu_bg_choose-subscription-plan.svg" },
    { name: "bg-create-first-vote", path: "illustrations/background/illu_bg_create-first-vote.svg" },
    { name: "bg-event-type-basic", path: "illustrations/background/illu_bg_event-type-basic.svg" },
    { name: "bg-event-type-general-meeting", path: "illustrations/background/illu_bg_event-type-general-meeting.svg" },
    { name: "bg-forgot-password", path: "illustrations/background/illu_bg_forgot-password.svg" },
    { name: "bg-home-screen-after-login", path: "illustrations/background/illu_bg_home-screen-after-login.svg" },
    { name: "bg-loading-screen", path: "illustrations/background/illu_bg_loading-screen.svg" },
    { name: "bg-login", path: "illustrations/background/illu_bg_login.svg" },
    { name: "bg-one-time-voting", path: "illustrations/background/illu_bg_one-time-voting.svg" },
    { name: "bg-participant-everyone", path: "illustrations/background/illu_bg_participant-everyone.svg" },
    { name: "bg-participant-first-group", path: "illustrations/background/illu_bg_participant-first-group.svg" },
    { name: "bg-participant-first-time", path: "illustrations/background/illu_bg_participant-first-time.svg" },
    { name: "bg-participant-first-time-v2", path: "illustrations/background/illu_bg_participant-first-time_v2.svg" },
    { name: "bg-participant-man", path: "illustrations/background/illu_bg_participant-man.svg" },
    { name: "bg-participant-type-observer", path: "illustrations/background/illu_bg_participant-type-observer.svg" },
    { name: "bg-participant-type-voter", path: "illustrations/background/illu_bg_participant-type-voter.svg" },
    { name: "bg-participant-woman", path: "illustrations/background/illu_bg_participant-woman.svg" },
    { name: "bg-point-voting", path: "illustrations/background/illu_bg_point-voting.svg" },
    { name: "bg-questionnaire", path: "illustrations/background/illu_bg_questionnaire.svg" },
    { name: "bg-registration", path: "illustrations/background/illu_bg_registration.svg" },
    { name: "bg-results-preview-unavailable", path: "illustrations/background/illu_bg_results-preview-unavailable.svg" },
    { name: "bg-test-event", path: "illustrations/background/illu_bg_test-event.svg" },
    { name: "bg-vote-as-proxy", path: "illustrations/background/illu_bg_vote-as-proxy.svg" },
    { name: "bg-vote-yourself", path: "illustrations/background/illu_bg_vote-yourself.svg" },
    { name: "bg-voting-ended", path: "illustrations/background/illu_bg_voting-ended.svg" },
    { name: "bg-voting-results", path: "illustrations/background/illu_bg_voting-results.svg" },
    { name: "bg-voting-started", path: "illustrations/background/illu_bg_voting-started.svg" },
    { name: "bg-voting-type-survey", path: "illustrations/background/illu_bg_voting-type-survey.svg" },
    { name: "bg-voting-type-yes-no", path: "illustrations/background/illu_bg_voting-type-yes-no.svg" },
    { name: "logo-votey", path: "illustrations/logotypes/logo_votey.svg" },
    { name: "logo-wyborek", path: "illustrations/logotypes/logo_wyborek.svg" },
    { name: "simple-anonymity-off", path: "illustrations/simple/illu_simple_anonymity-off.svg" },
    { name: "simple-anonymity-on", path: "illustrations/simple/illu_simple_anonymity-on.svg" },
    { name: "simple-avatar", path: "illustrations/simple/illu_simple_avatar.svg" },
    { name: "simple-chat", path: "illustrations/simple/illu_simple_chat.svg" },
    { name: "simple-click", path: "illustrations/simple/illu_simple_click.svg" },
    { name: "simple-delivered", path: "illustrations/simple/illu_simple_delivered.svg" },
    { name: "simple-notification", path: "illustrations/simple/illu_simple_notification.svg" },
    { name: "simple-open", path: "illustrations/simple/illu_simple_open.svg" },
    { name: "simple-pointer-hand", path: "illustrations/simple/illu_simple_pointer-hand.svg" },
    { name: "simple-proxy", path: "illustrations/simple/illu_simple_proxy.svg" },
    { name: "simple-theme-dark", path: "illustrations/simple/illu_simple_theme-dark.svg" },
    { name: "simple-theme-light", path: "illustrations/simple/illu_simple_theme-light.svg" },
    { name: "simple-voting-start-automatic", path: "illustrations/simple/illu_simple_voting-start-automatic.svg" },
    { name: "spot-add-participants-email", path: "illustrations/spot/illu_spot_add-participants-email.svg" },
    { name: "spot-add-participants-public-access", path: "illustrations/spot/illu_spot_add-participants-public-access.svg" },
    { name: "spot-add-participants-sms", path: "illustrations/spot/illu_spot_add-participants-sms.svg" },
    { name: "spot-add-participants-unique-codes", path: "illustrations/spot/illu_spot_add-participants-unique-codes.svg" },
    { name: "spot-agenda-visibility-off", path: "illustrations/spot/illu_spot_agenda-visibility-off.svg" },
    { name: "spot-agenda-visibility-off-v2", path: "illustrations/spot/illu_spot_agenda-visibility-off_v2.svg" },
    { name: "spot-agenda-visibility-on", path: "illustrations/spot/illu_spot_agenda-visibility-on.svg" },
    { name: "spot-answer-method-multiple", path: "illustrations/spot/illu_spot_answer-method-multiple.svg" },
    { name: "spot-answer-method-open-ended", path: "illustrations/spot/illu_spot_answer-method-open-ended.svg" },
    { name: "spot-answer-method-point-system", path: "illustrations/spot/illu_spot_answer-method-point-system.svg" },
    { name: "spot-answer-method-single", path: "illustrations/spot/illu_spot_answer-method-single.svg" },
    { name: "spot-chat-off", path: "illustrations/spot/illu_spot_chat-off.svg" },
    { name: "spot-chat-on", path: "illustrations/spot/illu_spot_chat-on.svg" },
    { name: "spot-forum-off", path: "illustrations/spot/illu_spot_forum-off.svg" },
    { name: "spot-forum-on", path: "illustrations/spot/illu_spot_forum-on.svg" },
    { name: "spot-interactive-video-conference", path: "illustrations/spot/illu_spot_interactive-video-conference.svg" },
    { name: "spot-login-on-another-device", path: "illustrations/spot/illu_spot_login-on-another-device.svg" },
    { name: "spot-proxy", path: "illustrations/spot/illu_spot_proxy.svg" },
    { name: "spot-proxy-off", path: "illustrations/spot/illu_spot_proxy-off.svg" },
    { name: "spot-proxy-on", path: "illustrations/spot/illu_spot_proxy-on.svg" },
    { name: "spot-report-pdf-off", path: "illustrations/spot/illu_spot_report-pdf-off.svg" },
    { name: "spot-report-pdf-off-v2", path: "illustrations/spot/illu_spot_report-pdf-off_v2.svg" },
    { name: "spot-report-pdf-on", path: "illustrations/spot/illu_spot_report-pdf-on.svg" },
    { name: "spot-report-pdf-on-v2", path: "illustrations/spot/illu_spot_report-pdf-on_v2.svg" },
    { name: "spot-results-off", path: "illustrations/spot/illu_spot_results-off.svg" },
    { name: "spot-results-on", path: "illustrations/spot/illu_spot_results-on.svg" },
    { name: "spot-streaming", path: "illustrations/spot/illu_spot_streaming.svg" },
    { name: "spot-videoconference-off", path: "illustrations/spot/illu_spot_videoconference-off.svg" },
    { name: "spot-videoconference-on", path: "illustrations/spot/illu_spot_videoconference-on.svg" },
    { name: "spot-visibility-off", path: "illustrations/spot/illu_spot_visibility-off.svg" },
    { name: "spot-visibility-on", path: "illustrations/spot/illu_spot_visibility-on.svg" },
    { name: "spot-voice-communication", path: "illustrations/spot/illu_spot_voice-communication.svg" },
    { name: "spot-voting-editing-off", path: "illustrations/spot/illu_spot_voting-editing-off.svg" },
    { name: "spot-voting-editing-off-v2", path: "illustrations/spot/illu_spot_voting-editing-off_v2.svg" },
    { name: "spot-voting-editing-on", path: "illustrations/spot/illu_spot_voting-editing-on.svg" },
    { name: "spot-voting-off", path: "illustrations/spot/illu_spot_voting-off.svg" },
    { name: "spot-voting-on", path: "illustrations/spot/illu_spot_voting-on.svg" },
    { name: "spot-voting-start-automatic", path: "illustrations/spot/illu_spot_voting-start-automatic.svg" },
    { name: "spot-voting-start-automatic-v2", path: "illustrations/spot/illu_spot_voting-start-automatic_v2.svg" },
    { name: "spot-voting-start-manual", path: "illustrations/spot/illu_spot_voting-start-manual.svg" },
    { name: "spot-voting-yes-no", path: "illustrations/spot/illu_spot_voting-yes-no.svg" },
];

const VOTEY_SVG_REGISTRY_CONFIG = new InjectionToken("VOTEY_SVG_REGISTRY_CONFIG");
const DEFAULT_ASSET_BASE_URL = "assets/votey";
class VoteySvgRegistryService {
    matIconRegistry = inject(MatIconRegistry);
    domSanitizer = inject(DomSanitizer);
    config = inject(VOTEY_SVG_REGISTRY_CONFIG, { optional: true }) ?? {};
    registered = false;
    register() {
        if (this.registered)
            return;
        const assetBaseUrl = (this.config.assetBaseUrl ?? DEFAULT_ASSET_BASE_URL).replace(/\/+$/, "");
        for (const asset of [
            ...VoteyIconRegistryEntries,
            ...VoteyIllustrationRegistryEntries,
        ]) {
            const assetUrl = assetBaseUrl
                ? `${assetBaseUrl}/${asset.path}`
                : asset.path;
            this.matIconRegistry.addSvgIcon(asset.name, this.domSanitizer.bypassSecurityTrustResourceUrl(assetUrl));
        }
        this.registered = true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteySvgRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteySvgRegistryService, providedIn: "root" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteySvgRegistryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }] });
function provideVoteySvgRegistry(config = {}) {
    return makeEnvironmentProviders([
        {
            provide: VOTEY_SVG_REGISTRY_CONFIG,
            useValue: config,
        },
        provideEnvironmentInitializer(() => {
            inject(VoteySvgRegistryService).register();
        }),
    ]);
}

const VoteyButtonVariants = [
    "primary",
    "secondary",
    "link",
    "danger",
    "ghost",
    "orange",
];
const VoteyButtonSizes = ["large", "small"];
class VoteyButtonComponent {
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    type = input("button", ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
    variant = input("primary", ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    size = input("large", ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    text = input("", ...(ngDevMode ? [{ debugName: "text" }] : /* istanbul ignore next */ []));
    hasIcon = input(false, ...(ngDevMode ? [{ debugName: "hasIcon" }] : /* istanbul ignore next */ []));
    badge = input(null, ...(ngDevMode ? [{ debugName: "badge" }] : /* istanbul ignore next */ []));
    ariaLabel = input("", ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    ariaExpanded = input(null, ...(ngDevMode ? [{ debugName: "ariaExpanded" }] : /* istanbul ignore next */ []));
    ariaPressed = input(null, ...(ngDevMode ? [{ debugName: "ariaPressed" }] : /* istanbul ignore next */ []));
    tooltipText = input("", ...(ngDevMode ? [{ debugName: "tooltipText" }] : /* istanbul ignore next */ []));
    disabledNote = input("", ...(ngDevMode ? [{ debugName: "disabledNote" }] : /* istanbul ignore next */ []));
    pressed = output();
    buttonClasses = computed(() => `${this.variant()} ${this.size()}`, ...(ngDevMode ? [{ debugName: "buttonClasses" }] : /* istanbul ignore next */ []));
    isIconButton = computed(() => this.hasIcon() && !this.text(), ...(ngDevMode ? [{ debugName: "isIconButton" }] : /* istanbul ignore next */ []));
    resolvedAriaLabel = computed(() => this.ariaLabel().trim() ||
        (this.isIconButton() ? this.tooltipText().trim() : ""), ...(ngDevMode ? [{ debugName: "resolvedAriaLabel" }] : /* istanbul ignore next */ []));
    resolvedTooltipText = computed(() => (this.disabled() ? this.disabledNote() : this.tooltipText()).trim(), ...(ngDevMode ? [{ debugName: "resolvedTooltipText" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyButtonComponent, isStandalone: true, selector: "votey-button", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, text: { classPropertyName: "text", publicName: "text", isSignal: true, isRequired: false, transformFunction: null }, hasIcon: { classPropertyName: "hasIcon", publicName: "hasIcon", isSignal: true, isRequired: false, transformFunction: null }, badge: { classPropertyName: "badge", publicName: "badge", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, ariaExpanded: { classPropertyName: "ariaExpanded", publicName: "ariaExpanded", isSignal: true, isRequired: false, transformFunction: null }, ariaPressed: { classPropertyName: "ariaPressed", publicName: "ariaPressed", isSignal: true, isRequired: false, transformFunction: null }, tooltipText: { classPropertyName: "tooltipText", publicName: "tooltipText", isSignal: true, isRequired: false, transformFunction: null }, disabledNote: { classPropertyName: "disabledNote", publicName: "disabledNote", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { pressed: "pressed" }, ngImport: i0, template: "<div\n  class=\"button-wrapper\"\n  matTooltipPosition=\"above\"\n  [matTooltipDisabled]=\"!resolvedTooltipText()\"\n  [matTooltipShowDelay]=\"500\"\n  [matTooltip]=\"resolvedTooltipText()\"\n>\n  <button\n    [class]=\"buttonClasses()\"\n    [class.icon-button]=\"isIconButton()\"\n    [class.disabled]=\"disabled()\"\n    [disabled]=\"disabled()\"\n    [attr.aria-disabled]=\"disabled()\"\n    [attr.aria-label]=\"resolvedAriaLabel() || null\"\n    [attr.aria-expanded]=\"ariaExpanded()\"\n    [attr.aria-pressed]=\"ariaPressed()\"\n    [type]=\"type()\"\n    (click)=\"pressed.emit()\"\n  >\n    @if (hasIcon()) {\n    <span class=\"icon\" aria-hidden=\"true\">\n      <ng-content select=\"[voteyButtonIcon]\" />\n    </span>\n    } @if (text()) {\n    <span class=\"label\">{{ text() }}</span>\n    } @if (badge() !== null && badge() !== \"\") {\n    <span class=\"badge\" aria-hidden=\"true\">{{ badge() }}</span>\n    }\n  </button>\n</div>\n", styles: [":host,.button-wrapper{display:inline-flex}button{position:relative;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-icon-gap);height:44px;padding:var(--space-control-padding-y) var(--space-control-padding-x);border:1px solid transparent;border-radius:var(--radius-button);background-color:transparent;color:var(--color-text-primary);font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height);white-space:nowrap;cursor:pointer;outline:none;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .12s ease}button:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}button:active:not(:disabled){transform:scale(.98)}button.small{height:28px;padding:0 var(--spacing-12)}button .label{color:inherit;font:inherit}button .icon{display:block;flex:0 0 20px;width:20px;height:20px;color:inherit}button .badge{position:absolute;top:-7px;right:-7px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 var(--spacing-2);border:2px solid var(--color-bg-surface);border-radius:999px;background-color:var(--color-accent-primary);color:var(--color-text-primary);font-family:var(--typo-body-s-font-family);font-size:10px;font-weight:var(--typo-button-font-weight);line-height:1}button.disabled,button:disabled{cursor:not-allowed;pointer-events:none}button.primary{border-color:var(--color-accent-hover);background-color:var(--color-accent-primary);color:var(--color-accent-on-accent)}button.primary:hover{border-color:var(--color-accent-strong);background-color:var(--color-accent-hover)}button.primary:active{border-color:var(--color-accent-strong);background-color:var(--color-accent-strong)}button.primary.disabled,button.primary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-border-subtle);color:var(--color-text-muted)}button.secondary{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface);color:var(--color-text-primary)}button.secondary:hover{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}button.secondary:active{border-color:var(--color-accent-strong);background-color:var(--color-bg-surface-tint)}button.secondary.disabled,button.secondary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted)}button.link{height:auto;padding:0;border:0;border-radius:0;color:var(--color-accent-primary);font-family:var(--typo-body-s-font-family);font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}button.link:hover{color:var(--color-accent-hover)}button.link:active{color:var(--color-accent-strong)}button.link.disabled,button.link:disabled{color:var(--color-text-muted)}button.ghost{border-color:transparent;background-color:transparent;color:var(--color-text-primary)}button.ghost:hover:not(:disabled){border-color:transparent;background-color:transparent;box-shadow:0 var(--spacing-2) var(--spacing-8) var(--color-shadow-soft)}button.ghost:active{border-color:transparent;background-color:transparent}button.ghost.disabled,button.ghost:disabled{border-color:transparent;background-color:transparent;color:var(--color-text-muted);box-shadow:none}button.icon-button{width:44px;padding:0}button.icon-button.small{width:28px;height:28px}button.icon-button.small .icon{flex-basis:16px;width:16px;height:16px}button.orange{border-color:var(--color-orange-300);background-color:var(--color-yellow-50);color:var(--color-text-primary)}button.orange .label{font-weight:var(--typo-button-font-weight)}button.danger{position:relative;border:none;border-color:var(--color-red-400);background-color:var(--color-red-400)}button.danger:before{position:absolute;top:0;right:50%;width:0;height:100%;background-color:var(--color-white);content:\"\";opacity:0;transition:all .5s}button.danger:hover:before{right:0;width:100%;border-radius:20px;opacity:.6}button.danger .icon,button.danger .label{position:relative}:host ::ng-deep [voteyButtonIcon]{display:block;width:100%;height:100%}:host ::ng-deep .icon mat-icon{width:100%;height:100%}:host ::ng-deep button:disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep button:disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}@media(prefers-reduced-motion:reduce){button{transition:none}}\n"], dependencies: [{ kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: "votey-button", changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatTooltip], template: "<div\n  class=\"button-wrapper\"\n  matTooltipPosition=\"above\"\n  [matTooltipDisabled]=\"!resolvedTooltipText()\"\n  [matTooltipShowDelay]=\"500\"\n  [matTooltip]=\"resolvedTooltipText()\"\n>\n  <button\n    [class]=\"buttonClasses()\"\n    [class.icon-button]=\"isIconButton()\"\n    [class.disabled]=\"disabled()\"\n    [disabled]=\"disabled()\"\n    [attr.aria-disabled]=\"disabled()\"\n    [attr.aria-label]=\"resolvedAriaLabel() || null\"\n    [attr.aria-expanded]=\"ariaExpanded()\"\n    [attr.aria-pressed]=\"ariaPressed()\"\n    [type]=\"type()\"\n    (click)=\"pressed.emit()\"\n  >\n    @if (hasIcon()) {\n    <span class=\"icon\" aria-hidden=\"true\">\n      <ng-content select=\"[voteyButtonIcon]\" />\n    </span>\n    } @if (text()) {\n    <span class=\"label\">{{ text() }}</span>\n    } @if (badge() !== null && badge() !== \"\") {\n    <span class=\"badge\" aria-hidden=\"true\">{{ badge() }}</span>\n    }\n  </button>\n</div>\n", styles: [":host,.button-wrapper{display:inline-flex}button{position:relative;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-icon-gap);height:44px;padding:var(--space-control-padding-y) var(--space-control-padding-x);border:1px solid transparent;border-radius:var(--radius-button);background-color:transparent;color:var(--color-text-primary);font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height);white-space:nowrap;cursor:pointer;outline:none;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .12s ease}button:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}button:active:not(:disabled){transform:scale(.98)}button.small{height:28px;padding:0 var(--spacing-12)}button .label{color:inherit;font:inherit}button .icon{display:block;flex:0 0 20px;width:20px;height:20px;color:inherit}button .badge{position:absolute;top:-7px;right:-7px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 var(--spacing-2);border:2px solid var(--color-bg-surface);border-radius:999px;background-color:var(--color-accent-primary);color:var(--color-text-primary);font-family:var(--typo-body-s-font-family);font-size:10px;font-weight:var(--typo-button-font-weight);line-height:1}button.disabled,button:disabled{cursor:not-allowed;pointer-events:none}button.primary{border-color:var(--color-accent-hover);background-color:var(--color-accent-primary);color:var(--color-accent-on-accent)}button.primary:hover{border-color:var(--color-accent-strong);background-color:var(--color-accent-hover)}button.primary:active{border-color:var(--color-accent-strong);background-color:var(--color-accent-strong)}button.primary.disabled,button.primary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-border-subtle);color:var(--color-text-muted)}button.secondary{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface);color:var(--color-text-primary)}button.secondary:hover{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}button.secondary:active{border-color:var(--color-accent-strong);background-color:var(--color-bg-surface-tint)}button.secondary.disabled,button.secondary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted)}button.link{height:auto;padding:0;border:0;border-radius:0;color:var(--color-accent-primary);font-family:var(--typo-body-s-font-family);font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}button.link:hover{color:var(--color-accent-hover)}button.link:active{color:var(--color-accent-strong)}button.link.disabled,button.link:disabled{color:var(--color-text-muted)}button.ghost{border-color:transparent;background-color:transparent;color:var(--color-text-primary)}button.ghost:hover:not(:disabled){border-color:transparent;background-color:transparent;box-shadow:0 var(--spacing-2) var(--spacing-8) var(--color-shadow-soft)}button.ghost:active{border-color:transparent;background-color:transparent}button.ghost.disabled,button.ghost:disabled{border-color:transparent;background-color:transparent;color:var(--color-text-muted);box-shadow:none}button.icon-button{width:44px;padding:0}button.icon-button.small{width:28px;height:28px}button.icon-button.small .icon{flex-basis:16px;width:16px;height:16px}button.orange{border-color:var(--color-orange-300);background-color:var(--color-yellow-50);color:var(--color-text-primary)}button.orange .label{font-weight:var(--typo-button-font-weight)}button.danger{position:relative;border:none;border-color:var(--color-red-400);background-color:var(--color-red-400)}button.danger:before{position:absolute;top:0;right:50%;width:0;height:100%;background-color:var(--color-white);content:\"\";opacity:0;transition:all .5s}button.danger:hover:before{right:0;width:100%;border-radius:20px;opacity:.6}button.danger .icon,button.danger .label{position:relative}:host ::ng-deep [voteyButtonIcon]{display:block;width:100%;height:100%}:host ::ng-deep .icon mat-icon{width:100%;height:100%}:host ::ng-deep button:disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep button:disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}@media(prefers-reduced-motion:reduce){button{transition:none}}\n"] }]
        }], propDecorators: { disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], text: [{ type: i0.Input, args: [{ isSignal: true, alias: "text", required: false }] }], hasIcon: [{ type: i0.Input, args: [{ isSignal: true, alias: "hasIcon", required: false }] }], badge: [{ type: i0.Input, args: [{ isSignal: true, alias: "badge", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], ariaExpanded: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaExpanded", required: false }] }], ariaPressed: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaPressed", required: false }] }], tooltipText: [{ type: i0.Input, args: [{ isSignal: true, alias: "tooltipText", required: false }] }], disabledNote: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabledNote", required: false }] }], pressed: [{ type: i0.Output, args: ["pressed"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VOTEY_SVG_REGISTRY_CONFIG, VoteyButtonComponent, VoteyButtonSizes, VoteyButtonVariants, VoteyDeviceService, VoteyIconNames, VoteyIconRegistryEntries, VoteyIllustrationNames, VoteyIllustrationRegistryEntries, VoteySvgRegistryService, provideVoteyDeviceDetection, provideVoteySvgRegistry };
//# sourceMappingURL=pleodigital-design-system-votey-angular.mjs.map
