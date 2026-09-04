import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { InjectionToken, inject, PLATFORM_ID, Injectable, makeEnvironmentProviders, provideEnvironmentInitializer, input, ChangeDetectionStrategy, Component, Pipe, numberAttribute, computed, output, model, signal, forwardRef, ViewEncapsulation, booleanAttribute, viewChild, TemplateRef, Directive, contentChildren } from '@angular/core';
import DeviceDetector from 'node-device-detector';
import { BehaviorSubject } from 'rxjs';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import * as i1 from '@angular/forms';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

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
    gridConfig = inject(VOTEY_GRID_CONFIG, { optional: true }) ?? VOTEY_DEFAULT_GRID_CONFIG;
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
    "sp-exclamation-mark",
    "sp-flag-poland",
    "sp-flag-united-kingdom",
    "sp-in-progress",
    "sp-incorrect",
    "sp-new",
    "ui-agenda",
    "ui-ai",
    "ui-arrow-right",
    "ui-attachment-thick",
    "ui-authorization",
    "ui-burger",
    "ui-calendar",
    "ui-camera-change",
    "ui-camera-off",
    "ui-camera-on",
    "ui-chat",
    "ui-chevron-down",
    "ui-chevron-left",
    "ui-chevron-right",
    "ui-chevron-up",
    "ui-close",
    "ui-close-v2",
    "ui-coin",
    "ui-copy",
    "ui-delete",
    "ui-download",
    "ui-edit",
    "ui-edit-thick",
    "ui-end",
    "ui-event-completed",
    "ui-event-invitation",
    "ui-event-notification",
    "ui-expand-arrow-down",
    "ui-expand-arrow-left",
    "ui-expand-arrow-right",
    "ui-expand-arrow-up",
    "ui-external",
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
    "ui-filter",
    "ui-filter-add",
    "ui-full-screen",
    "ui-full-screen-v2",
    "ui-grid",
    "ui-hand",
    "ui-hang-up",
    "ui-language",
    "ui-microphone-off",
    "ui-microphone-on",
    "ui-minus",
    "ui-move",
    "ui-navigate",
    "ui-network",
    "ui-option",
    "ui-participant",
    "ui-participants-list",
    "ui-participants-list-v2",
    "ui-pending",
    "ui-pin",
    "ui-plus",
    "ui-problem",
    "ui-proxy",
    "ui-proxy-thick",
    "ui-question",
    "ui-registration-confirmed",
    "ui-remind-password",
    "ui-save",
    "ui-search",
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
    { name: "sp-exclamation-mark", path: "icons/special/icon_sp_exclamation-mark.svg" },
    { name: "sp-flag-poland", path: "icons/special/icon_sp_flag-poland.svg" },
    { name: "sp-flag-united-kingdom", path: "icons/special/icon_sp_flag-united-kingdom.svg" },
    { name: "sp-in-progress", path: "icons/special/icon_sp_in-progress.svg" },
    { name: "sp-incorrect", path: "icons/special/icon_sp_incorrect.svg" },
    { name: "sp-new", path: "icons/special/icon_sp_new.svg" },
    { name: "ui-agenda", path: "icons/ui/icon_ui_agenda.svg" },
    { name: "ui-ai", path: "icons/ui/icon_ui_ai.svg" },
    { name: "ui-arrow-right", path: "icons/ui/icon_ui_arrow-right.svg" },
    { name: "ui-attachment-thick", path: "icons/ui/icon_ui_attachment_thick.svg" },
    { name: "ui-authorization", path: "icons/ui/icon_ui_authorization.svg" },
    { name: "ui-burger", path: "icons/ui/icon_ui_burger.svg" },
    { name: "ui-calendar", path: "icons/ui/icon_ui_calendar.svg" },
    { name: "ui-camera-change", path: "icons/ui/icon_ui_camera-change.svg" },
    { name: "ui-camera-off", path: "icons/ui/icon_ui_camera-off.svg" },
    { name: "ui-camera-on", path: "icons/ui/icon_ui_camera-on.svg" },
    { name: "ui-chat", path: "icons/ui/icon_ui_chat.svg" },
    { name: "ui-chevron-down", path: "icons/ui/icon_ui_chevron-down.svg" },
    { name: "ui-chevron-left", path: "icons/ui/icon_ui_chevron-left.svg" },
    { name: "ui-chevron-right", path: "icons/ui/icon_ui_chevron-right.svg" },
    { name: "ui-chevron-up", path: "icons/ui/icon_ui_chevron-up.svg" },
    { name: "ui-close", path: "icons/ui/icon_ui_close.svg" },
    { name: "ui-close-v2", path: "icons/ui/icon_ui_close_v2.svg" },
    { name: "ui-coin", path: "icons/ui/icon_ui_coin.svg" },
    { name: "ui-copy", path: "icons/ui/icon_ui_copy.svg" },
    { name: "ui-delete", path: "icons/ui/icon_ui_delete.svg" },
    { name: "ui-download", path: "icons/ui/icon_ui_download.svg" },
    { name: "ui-edit", path: "icons/ui/icon_ui_edit.svg" },
    { name: "ui-edit-thick", path: "icons/ui/icon_ui_edit_thick.svg" },
    { name: "ui-end", path: "icons/ui/icon_ui_end.svg" },
    { name: "ui-event-completed", path: "icons/ui/icon_ui_event-completed.svg" },
    { name: "ui-event-invitation", path: "icons/ui/icon_ui_event-invitation.svg" },
    { name: "ui-event-notification", path: "icons/ui/icon_ui_event-notification.svg" },
    { name: "ui-expand-arrow-down", path: "icons/ui/icon_ui_expand-arrow-down.svg" },
    { name: "ui-expand-arrow-left", path: "icons/ui/icon_ui_expand-arrow-left.svg" },
    { name: "ui-expand-arrow-right", path: "icons/ui/icon_ui_expand-arrow-right.svg" },
    { name: "ui-expand-arrow-up", path: "icons/ui/icon_ui_expand-arrow-up.svg" },
    { name: "ui-external", path: "icons/ui/icon_ui_external.svg" },
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
    { name: "ui-filter", path: "icons/ui/icon_ui_filter.svg" },
    { name: "ui-filter-add", path: "icons/ui/icon_ui_filter-add.svg" },
    { name: "ui-full-screen", path: "icons/ui/icon_ui_full-screen.svg" },
    { name: "ui-full-screen-v2", path: "icons/ui/icon_ui_full-screen_v2.svg" },
    { name: "ui-grid", path: "icons/ui/icon_ui_grid.svg" },
    { name: "ui-hand", path: "icons/ui/icon_ui_hand.svg" },
    { name: "ui-hang-up", path: "icons/ui/icon_ui_hang-up.svg" },
    { name: "ui-language", path: "icons/ui/icon_ui_language.svg" },
    { name: "ui-microphone-off", path: "icons/ui/icon_ui_microphone-off.svg" },
    { name: "ui-microphone-on", path: "icons/ui/icon_ui_microphone-on.svg" },
    { name: "ui-minus", path: "icons/ui/icon_ui_minus.svg" },
    { name: "ui-move", path: "icons/ui/icon_ui_move.svg" },
    { name: "ui-navigate", path: "icons/ui/icon_ui_navigate.svg" },
    { name: "ui-network", path: "icons/ui/icon_ui_network.svg" },
    { name: "ui-option", path: "icons/ui/icon_ui_option.svg" },
    { name: "ui-participant", path: "icons/ui/icon_ui_participant.svg" },
    { name: "ui-participants-list", path: "icons/ui/icon_ui_participants-list.svg" },
    { name: "ui-participants-list-v2", path: "icons/ui/icon_ui_participants-list_v2.svg" },
    { name: "ui-pending", path: "icons/ui/icon_ui_pending.svg" },
    { name: "ui-pin", path: "icons/ui/icon_ui_pin.svg" },
    { name: "ui-plus", path: "icons/ui/icon_ui_plus.svg" },
    { name: "ui-problem", path: "icons/ui/icon_ui_problem.svg" },
    { name: "ui-proxy", path: "icons/ui/icon_ui_proxy.svg" },
    { name: "ui-proxy-thick", path: "icons/ui/icon_ui_proxy_thick.svg" },
    { name: "ui-question", path: "icons/ui/icon_ui_question.svg" },
    { name: "ui-registration-confirmed", path: "icons/ui/icon_ui_registration-confirmed.svg" },
    { name: "ui-remind-password", path: "icons/ui/icon_ui_remind-password.svg" },
    { name: "ui-save", path: "icons/ui/icon_ui_save.svg" },
    { name: "ui-search", path: "icons/ui/icon_ui_search.svg" },
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
    "bg-download-report-event",
    "bg-download-report-voting",
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
    "bg-public-access-event",
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
    "info-event-cost-analysis",
    "info-event-share-types",
    "info-set-up-event-send-invitations",
    "info-subscription-calculator",
    "info-view-voting-results",
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
    { name: "bg-download-report-event", path: "illustrations/background/illu_bg_download-report-event.svg" },
    { name: "bg-download-report-voting", path: "illustrations/background/illu_bg_download-report-voting.svg" },
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
    { name: "bg-public-access-event", path: "illustrations/background/illu_bg_public-access-event.svg" },
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
    { name: "info-event-cost-analysis", path: "illustrations/info/illu_info_event-cost-analysis.svg" },
    { name: "info-event-share-types", path: "illustrations/info/illu_info_event-share-types.svg" },
    { name: "info-set-up-event-send-invitations", path: "illustrations/info/illu_info_set-up-event-send-invitations.svg" },
    { name: "info-subscription-calculator", path: "illustrations/info/illu_info_subscription-calculator.svg" },
    { name: "info-view-voting-results", path: "illustrations/info/illu_info_view-voting-results.svg" },
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

class VoteyIconComponent {
    ico = input("", ...(ngDevMode ? [{ debugName: "ico" }] : /* istanbul ignore next */ []));
    ariaLabel = input("", ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.17", type: VoteyIconComponent, isStandalone: true, selector: "vt-icon", inputs: { ico: { classPropertyName: "ico", publicName: "ico", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<mat-icon\r\n  [svgIcon]=\"ico()\"\r\n  [attr.aria-hidden]=\"ariaLabel().trim() ? null : true\"\r\n  [attr.aria-label]=\"ariaLabel().trim() || null\"\r\n/>\r\n", styles: [":host,mat-icon{display:block;width:100%;height:100%}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyIconComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-icon", changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatIcon], template: "<mat-icon\r\n  [svgIcon]=\"ico()\"\r\n  [attr.aria-hidden]=\"ariaLabel().trim() ? null : true\"\r\n  [attr.aria-label]=\"ariaLabel().trim() || null\"\r\n/>\r\n", styles: [":host,mat-icon{display:block;width:100%;height:100%}\n"] }]
        }], propDecorators: { ico: [{ type: i0.Input, args: [{ isSignal: true, alias: "ico", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }] } });

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

const VOTEY_IDENTITY_TRANSLATOR = {
    translate: (key) => key,
};
const VOTEY_TRANSLATOR = new InjectionToken("VOTEY_TRANSLATOR", {
    providedIn: "root",
    factory: () => VOTEY_IDENTITY_TRANSLATOR,
});
function injectVoteyTranslator() {
    return (inject(VOTEY_TRANSLATOR, { optional: true }) ?? VOTEY_IDENTITY_TRANSLATOR);
}

class VoteyTranslatePipe {
    translator = injectVoteyTranslator();
    transform(key, params) {
        return key ? this.translator.translate(key, params) : "";
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTranslatePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.2.17", ngImport: i0, type: VoteyTranslatePipe, isStandalone: true, name: "vtTranslate", pure: false });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTranslatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "vtTranslate",
                    standalone: true,
                    pure: false,
                }]
        }] });

const VoteyTextVariants = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "body-l",
    "body",
    "body-s",
    "caption",
    "caption-s",
    "micro",
    "button",
    "table-header",
    "label",
];
const VoteyTextColors = [
    "primary",
    "secondary",
    "muted",
    "inverse",
    "accent",
    "on-sidebar",
];
class VoteyTextComponent {
    content = input.required(...(ngDevMode ? [{ debugName: "content" }] : /* istanbul ignore next */ []));
    variant = input("body", ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    color = input("primary", ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
    uppercase = input(false, ...(ngDevMode ? [{ debugName: "uppercase" }] : /* istanbul ignore next */ []));
    italic = input(false, ...(ngDevMode ? [{ debugName: "italic" }] : /* istanbul ignore next */ []));
    wrap = input(false, ...(ngDevMode ? [{ debugName: "wrap" }] : /* istanbul ignore next */ []));
    maxLines = input(0, { ...(ngDevMode ? { debugName: "maxLines" } : /* istanbul ignore next */ {}), transform: numberAttribute });
    lineClampEnabled = computed(() => !this.wrap() && this.maxLines() > 0, ...(ngDevMode ? [{ debugName: "lineClampEnabled" }] : /* istanbul ignore next */ []));
    textClasses = computed(() => [
        "text",
        this.variant(),
        this.color(),
        this.uppercase() ? "uppercase" : "",
        this.italic() ? "italic" : "",
        this.wrap() ? "wrap" : "",
        this.lineClampEnabled() ? "ellipsis" : "",
        this.wrap() || this.lineClampEnabled() ? "constrained" : "",
    ]
        .filter(Boolean)
        .join(" "), ...(ngDevMode ? [{ debugName: "textClasses" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTextComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.17", type: VoteyTextComponent, isStandalone: true, selector: "vt-text", inputs: { content: { classPropertyName: "content", publicName: "content", isSignal: true, isRequired: true, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, uppercase: { classPropertyName: "uppercase", publicName: "uppercase", isSignal: true, isRequired: false, transformFunction: null }, italic: { classPropertyName: "italic", publicName: "italic", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, maxLines: { classPropertyName: "maxLines", publicName: "maxLines", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<span [class]=\"textClasses()\" [style.--vt-text-max-lines]=\"maxLines()\">\r\n  {{ content() }}\r\n</span>\r\n", styles: [":host{display:contents}.text{color:var(--color-text-primary)}.text.h1{font-family:var(--typo-h1-font-family);font-size:var(--typo-h1-font-size);font-weight:var(--typo-h1-font-weight);letter-spacing:var(--typo-h1-letter-spacing);line-height:var(--typo-h1-line-height)}.text.h2{font-family:var(--typo-h2-font-family);font-size:var(--typo-h2-font-size);font-weight:var(--typo-h2-font-weight);letter-spacing:var(--typo-h2-letter-spacing);line-height:var(--typo-h2-line-height)}.text.h3{font-family:var(--typo-h3-font-family);font-size:var(--typo-h3-font-size);font-weight:var(--typo-h3-font-weight);letter-spacing:var(--typo-h3-letter-spacing);line-height:var(--typo-h3-line-height)}.text.h4{font-family:var(--typo-h4-font-family);font-size:var(--typo-h4-font-size);font-weight:var(--typo-h4-font-weight);letter-spacing:var(--typo-h4-letter-spacing);line-height:var(--typo-h4-line-height)}.text.h5{font-family:var(--typo-h5-font-family);font-size:var(--typo-h5-font-size);font-weight:var(--typo-h5-font-weight);letter-spacing:var(--typo-h5-letter-spacing);line-height:var(--typo-h5-line-height)}.text.body-l{font-family:var(--typo-body-l-font-family);font-size:var(--typo-body-l-font-size);font-weight:var(--typo-body-l-font-weight);letter-spacing:var(--typo-body-l-letter-spacing);line-height:var(--typo-body-l-line-height)}.text.body{font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.text.body-s{font-family:var(--typo-body-s-font-family);font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}.text.caption{font-family:var(--typo-caption-font-family);font-size:var(--typo-caption-font-size);font-weight:var(--typo-caption-font-weight);letter-spacing:var(--typo-caption-letter-spacing);line-height:var(--typo-caption-line-height)}.text.caption-s{font-family:var(--typo-caption-s-font-family);font-size:var(--typo-caption-s-font-size);font-weight:var(--typo-caption-s-font-weight);letter-spacing:var(--typo-caption-s-letter-spacing);line-height:var(--typo-caption-s-line-height)}.text.micro{font-family:var(--typo-micro-font-family);font-size:var(--typo-micro-font-size);font-weight:var(--typo-micro-font-weight);letter-spacing:var(--typo-micro-letter-spacing);line-height:var(--typo-micro-line-height)}.text.button{font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height)}.text.table-header{font-family:var(--typo-table-header-font-family);font-size:var(--typo-table-header-font-size);font-weight:var(--typo-table-header-font-weight);letter-spacing:var(--typo-table-header-letter-spacing);line-height:var(--typo-table-header-line-height)}.text.label{font-family:var(--typo-label-font-family);font-size:var(--typo-label-font-size);font-weight:var(--typo-label-font-weight);letter-spacing:var(--typo-label-letter-spacing);line-height:var(--typo-label-line-height)}.text.primary{color:var(--color-text-primary)}.text.secondary{color:var(--color-text-secondary)}.text.muted{color:var(--color-text-muted)}.text.inverse{color:var(--color-text-inverse)}.text.accent{color:var(--color-text-accent)}.text.on-sidebar{color:var(--color-text-on-sidebar)}.text.constrained{display:block;min-width:0;max-width:100%}.text.uppercase{text-transform:uppercase}.text.italic{font-style:italic}.text.ellipsis{display:-webkit-box;width:100%;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:var(--vt-text-max-lines)}.text.wrap{white-space:normal;overflow-wrap:anywhere}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTextComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-text", changeDetection: ChangeDetectionStrategy.OnPush, template: "<span [class]=\"textClasses()\" [style.--vt-text-max-lines]=\"maxLines()\">\r\n  {{ content() }}\r\n</span>\r\n", styles: [":host{display:contents}.text{color:var(--color-text-primary)}.text.h1{font-family:var(--typo-h1-font-family);font-size:var(--typo-h1-font-size);font-weight:var(--typo-h1-font-weight);letter-spacing:var(--typo-h1-letter-spacing);line-height:var(--typo-h1-line-height)}.text.h2{font-family:var(--typo-h2-font-family);font-size:var(--typo-h2-font-size);font-weight:var(--typo-h2-font-weight);letter-spacing:var(--typo-h2-letter-spacing);line-height:var(--typo-h2-line-height)}.text.h3{font-family:var(--typo-h3-font-family);font-size:var(--typo-h3-font-size);font-weight:var(--typo-h3-font-weight);letter-spacing:var(--typo-h3-letter-spacing);line-height:var(--typo-h3-line-height)}.text.h4{font-family:var(--typo-h4-font-family);font-size:var(--typo-h4-font-size);font-weight:var(--typo-h4-font-weight);letter-spacing:var(--typo-h4-letter-spacing);line-height:var(--typo-h4-line-height)}.text.h5{font-family:var(--typo-h5-font-family);font-size:var(--typo-h5-font-size);font-weight:var(--typo-h5-font-weight);letter-spacing:var(--typo-h5-letter-spacing);line-height:var(--typo-h5-line-height)}.text.body-l{font-family:var(--typo-body-l-font-family);font-size:var(--typo-body-l-font-size);font-weight:var(--typo-body-l-font-weight);letter-spacing:var(--typo-body-l-letter-spacing);line-height:var(--typo-body-l-line-height)}.text.body{font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.text.body-s{font-family:var(--typo-body-s-font-family);font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}.text.caption{font-family:var(--typo-caption-font-family);font-size:var(--typo-caption-font-size);font-weight:var(--typo-caption-font-weight);letter-spacing:var(--typo-caption-letter-spacing);line-height:var(--typo-caption-line-height)}.text.caption-s{font-family:var(--typo-caption-s-font-family);font-size:var(--typo-caption-s-font-size);font-weight:var(--typo-caption-s-font-weight);letter-spacing:var(--typo-caption-s-letter-spacing);line-height:var(--typo-caption-s-line-height)}.text.micro{font-family:var(--typo-micro-font-family);font-size:var(--typo-micro-font-size);font-weight:var(--typo-micro-font-weight);letter-spacing:var(--typo-micro-letter-spacing);line-height:var(--typo-micro-line-height)}.text.button{font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height)}.text.table-header{font-family:var(--typo-table-header-font-family);font-size:var(--typo-table-header-font-size);font-weight:var(--typo-table-header-font-weight);letter-spacing:var(--typo-table-header-letter-spacing);line-height:var(--typo-table-header-line-height)}.text.label{font-family:var(--typo-label-font-family);font-size:var(--typo-label-font-size);font-weight:var(--typo-label-font-weight);letter-spacing:var(--typo-label-letter-spacing);line-height:var(--typo-label-line-height)}.text.primary{color:var(--color-text-primary)}.text.secondary{color:var(--color-text-secondary)}.text.muted{color:var(--color-text-muted)}.text.inverse{color:var(--color-text-inverse)}.text.accent{color:var(--color-text-accent)}.text.on-sidebar{color:var(--color-text-on-sidebar)}.text.constrained{display:block;min-width:0;max-width:100%}.text.uppercase{text-transform:uppercase}.text.italic{font-style:italic}.text.ellipsis{display:-webkit-box;width:100%;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:var(--vt-text-max-lines)}.text.wrap{white-space:normal;overflow-wrap:anywhere}\n"] }]
        }], propDecorators: { content: [{ type: i0.Input, args: [{ isSignal: true, alias: "content", required: true }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }], uppercase: [{ type: i0.Input, args: [{ isSignal: true, alias: "uppercase", required: false }] }], italic: [{ type: i0.Input, args: [{ isSignal: true, alias: "italic", required: false }] }], wrap: [{ type: i0.Input, args: [{ isSignal: true, alias: "wrap", required: false }] }], maxLines: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxLines", required: false }] }] } });

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
    ico = input("", ...(ngDevMode ? [{ debugName: "ico" }] : /* istanbul ignore next */ []));
    badge = input(null, ...(ngDevMode ? [{ debugName: "badge" }] : /* istanbul ignore next */ []));
    tooltipText = input("", ...(ngDevMode ? [{ debugName: "tooltipText" }] : /* istanbul ignore next */ []));
    disabledNote = input("", ...(ngDevMode ? [{ debugName: "disabledNote" }] : /* istanbul ignore next */ []));
    pressed = output();
    buttonClasses = computed(() => `${this.variant()} ${this.size()}`, ...(ngDevMode ? [{ debugName: "buttonClasses" }] : /* istanbul ignore next */ []));
    isIconButton = computed(() => Boolean(this.ico()) && !this.text(), ...(ngDevMode ? [{ debugName: "isIconButton" }] : /* istanbul ignore next */ []));
    resolvedTooltipText = computed(() => (this.disabled() ? this.disabledNote() : this.tooltipText()).trim(), ...(ngDevMode ? [{ debugName: "resolvedTooltipText" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyButtonComponent, isStandalone: true, selector: "vt-button", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, text: { classPropertyName: "text", publicName: "text", isSignal: true, isRequired: false, transformFunction: null }, ico: { classPropertyName: "ico", publicName: "ico", isSignal: true, isRequired: false, transformFunction: null }, badge: { classPropertyName: "badge", publicName: "badge", isSignal: true, isRequired: false, transformFunction: null }, tooltipText: { classPropertyName: "tooltipText", publicName: "tooltipText", isSignal: true, isRequired: false, transformFunction: null }, disabledNote: { classPropertyName: "disabledNote", publicName: "disabledNote", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { pressed: "pressed" }, ngImport: i0, template: "@let translatedText = text() | vtTranslate; @let translatedTooltipText =\r\nresolvedTooltipText() | vtTranslate;\r\n<div\r\n  class=\"button-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltipText\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltipText\"\r\n>\r\n  <button\r\n    [class]=\"buttonClasses()\"\r\n    [class.icon-button]=\"isIconButton()\"\r\n    [class.disabled]=\"disabled()\"\r\n    [disabled]=\"disabled()\"\r\n    [attr.aria-disabled]=\"disabled()\"\r\n    [attr.aria-label]=\"translatedText || ico() || null\"\r\n    [type]=\"type()\"\r\n    (click)=\"pressed.emit()\"\r\n  >\r\n    @if (ico()) {\r\n    <span class=\"icon\">\r\n      <vt-icon [ico]=\"ico()\" />\r\n    </span>\r\n    } @if (text()) {\r\n    <span class=\"label\">{{ translatedText }}</span>\r\n    } @if (badge() !== null && badge() !== \"\") {\r\n    <span class=\"badge\">\r\n      <vt-text variant=\"micro\" color=\"primary\" [content]=\"badge()\" />\r\n    </span>\r\n    }\r\n  </button>\r\n</div>\r\n", styles: [":host,.button-wrapper{display:inline-flex}button{position:relative;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-icon-gap);height:44px;padding:var(--space-control-padding-y) var(--space-control-padding-x);border:1px solid transparent;border-radius:var(--radius-button);background-color:transparent;color:var(--color-text-primary);font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height);white-space:nowrap;cursor:pointer;outline:none;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .12s ease}button:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}button:active:not(:disabled){transform:scale(.98)}button.small{height:28px;padding:0 var(--spacing-12)}button .label{color:inherit;font:inherit}button .icon{display:block;flex:0 0 20px;width:20px;height:20px;color:inherit}button .badge{position:absolute;top:-7px;right:-7px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 var(--spacing-2);border:2px solid var(--color-bg-surface);border-radius:var(--radius-pill);background-color:var(--color-accent-primary)}button.disabled,button:disabled{cursor:not-allowed;pointer-events:none}button.primary{border-color:var(--color-accent-hover);background-color:var(--color-accent-primary);color:var(--color-accent-on-accent)}button.primary:hover{border-color:var(--color-accent-strong);background-color:var(--color-accent-hover)}button.primary:active{border-color:var(--color-accent-strong);background-color:var(--color-accent-strong)}button.primary.disabled,button.primary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-border-subtle);color:var(--color-text-muted)}button.secondary{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface);color:var(--color-text-primary)}button.secondary:hover{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}button.secondary:active{border-color:var(--color-accent-strong);background-color:var(--color-bg-surface-tint)}button.secondary.disabled,button.secondary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted)}button.link{height:auto;padding:0;border:0;border-radius:0;color:var(--color-accent-primary);font-family:var(--typo-body-s-font-family);font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}button.link:hover{color:var(--color-accent-hover)}button.link:active{color:var(--color-accent-strong)}button.link.disabled,button.link:disabled{color:var(--color-text-muted)}button.ghost{border-color:transparent;background-color:transparent;color:var(--color-text-primary)}button.ghost:hover:not(:disabled){border-color:transparent;background-color:transparent;box-shadow:0 var(--spacing-2) var(--spacing-8) var(--color-shadow-soft)}button.ghost:active{border-color:transparent;background-color:transparent}button.ghost.disabled,button.ghost:disabled{border-color:transparent;background-color:transparent;color:var(--color-text-muted);box-shadow:none}button.icon-button{width:44px;padding:0}button.icon-button.small{width:28px;height:28px}button.icon-button.small .icon{flex-basis:16px;width:16px;height:16px}button.orange{border-color:var(--color-orange-300);background-color:var(--color-yellow-50);color:var(--color-text-primary)}button.orange .label{font-weight:var(--typo-button-font-weight)}button.danger{position:relative;border:none;border-color:var(--color-red-400);background-color:var(--color-red-400)}button.danger:before{position:absolute;top:0;right:50%;width:0;height:100%;background-color:var(--color-white);content:\"\";opacity:0;transition:all .5s}button.danger:hover:before{right:0;width:100%;border-radius:var(--radius-20);opacity:.6}button.danger .icon,button.danger .label{position:relative}:host ::ng-deep button:disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep button:disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}@media(prefers-reduced-motion:reduce){button{transition:none}}\n"], dependencies: [{ kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-button", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        MatTooltip,
                        VoteyIconComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedText = text() | vtTranslate; @let translatedTooltipText =\r\nresolvedTooltipText() | vtTranslate;\r\n<div\r\n  class=\"button-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltipText\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltipText\"\r\n>\r\n  <button\r\n    [class]=\"buttonClasses()\"\r\n    [class.icon-button]=\"isIconButton()\"\r\n    [class.disabled]=\"disabled()\"\r\n    [disabled]=\"disabled()\"\r\n    [attr.aria-disabled]=\"disabled()\"\r\n    [attr.aria-label]=\"translatedText || ico() || null\"\r\n    [type]=\"type()\"\r\n    (click)=\"pressed.emit()\"\r\n  >\r\n    @if (ico()) {\r\n    <span class=\"icon\">\r\n      <vt-icon [ico]=\"ico()\" />\r\n    </span>\r\n    } @if (text()) {\r\n    <span class=\"label\">{{ translatedText }}</span>\r\n    } @if (badge() !== null && badge() !== \"\") {\r\n    <span class=\"badge\">\r\n      <vt-text variant=\"micro\" color=\"primary\" [content]=\"badge()\" />\r\n    </span>\r\n    }\r\n  </button>\r\n</div>\r\n", styles: [":host,.button-wrapper{display:inline-flex}button{position:relative;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-icon-gap);height:44px;padding:var(--space-control-padding-y) var(--space-control-padding-x);border:1px solid transparent;border-radius:var(--radius-button);background-color:transparent;color:var(--color-text-primary);font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height);white-space:nowrap;cursor:pointer;outline:none;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .12s ease}button:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}button:active:not(:disabled){transform:scale(.98)}button.small{height:28px;padding:0 var(--spacing-12)}button .label{color:inherit;font:inherit}button .icon{display:block;flex:0 0 20px;width:20px;height:20px;color:inherit}button .badge{position:absolute;top:-7px;right:-7px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 var(--spacing-2);border:2px solid var(--color-bg-surface);border-radius:var(--radius-pill);background-color:var(--color-accent-primary)}button.disabled,button:disabled{cursor:not-allowed;pointer-events:none}button.primary{border-color:var(--color-accent-hover);background-color:var(--color-accent-primary);color:var(--color-accent-on-accent)}button.primary:hover{border-color:var(--color-accent-strong);background-color:var(--color-accent-hover)}button.primary:active{border-color:var(--color-accent-strong);background-color:var(--color-accent-strong)}button.primary.disabled,button.primary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-border-subtle);color:var(--color-text-muted)}button.secondary{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface);color:var(--color-text-primary)}button.secondary:hover{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}button.secondary:active{border-color:var(--color-accent-strong);background-color:var(--color-bg-surface-tint)}button.secondary.disabled,button.secondary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted)}button.link{height:auto;padding:0;border:0;border-radius:0;color:var(--color-accent-primary);font-family:var(--typo-body-s-font-family);font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}button.link:hover{color:var(--color-accent-hover)}button.link:active{color:var(--color-accent-strong)}button.link.disabled,button.link:disabled{color:var(--color-text-muted)}button.ghost{border-color:transparent;background-color:transparent;color:var(--color-text-primary)}button.ghost:hover:not(:disabled){border-color:transparent;background-color:transparent;box-shadow:0 var(--spacing-2) var(--spacing-8) var(--color-shadow-soft)}button.ghost:active{border-color:transparent;background-color:transparent}button.ghost.disabled,button.ghost:disabled{border-color:transparent;background-color:transparent;color:var(--color-text-muted);box-shadow:none}button.icon-button{width:44px;padding:0}button.icon-button.small{width:28px;height:28px}button.icon-button.small .icon{flex-basis:16px;width:16px;height:16px}button.orange{border-color:var(--color-orange-300);background-color:var(--color-yellow-50);color:var(--color-text-primary)}button.orange .label{font-weight:var(--typo-button-font-weight)}button.danger{position:relative;border:none;border-color:var(--color-red-400);background-color:var(--color-red-400)}button.danger:before{position:absolute;top:0;right:50%;width:0;height:100%;background-color:var(--color-white);content:\"\";opacity:0;transition:all .5s}button.danger:hover:before{right:0;width:100%;border-radius:var(--radius-20);opacity:.6}button.danger .icon,button.danger .label{position:relative}:host ::ng-deep button:disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep button:disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}@media(prefers-reduced-motion:reduce){button{transition:none}}\n"] }]
        }], propDecorators: { disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], text: [{ type: i0.Input, args: [{ isSignal: true, alias: "text", required: false }] }], ico: [{ type: i0.Input, args: [{ isSignal: true, alias: "ico", required: false }] }], badge: [{ type: i0.Input, args: [{ isSignal: true, alias: "badge", required: false }] }], tooltipText: [{ type: i0.Input, args: [{ isSignal: true, alias: "tooltipText", required: false }] }], disabledNote: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabledNote", required: false }] }], pressed: [{ type: i0.Output, args: ["pressed"] }] } });

class VoteyCheckboxComponent {
    checked = model(false, ...(ngDevMode ? [{ debugName: "checked" }] : /* istanbul ignore next */ []));
    indeterminate = model(false, ...(ngDevMode ? [{ debugName: "indeterminate" }] : /* istanbul ignore next */ []));
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    required = input(false, ...(ngDevMode ? [{ debugName: "required" }] : /* istanbul ignore next */ []));
    error = input(false, ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    labelPosition = input("after", ...(ngDevMode ? [{ debugName: "labelPosition" }] : /* istanbul ignore next */ []));
    id = input("", ...(ngDevMode ? [{ debugName: "id" }] : /* istanbul ignore next */ []));
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    value = input("", ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    changed = output();
    formDisabled = signal(false, ...(ngDevMode ? [{ debugName: "formDisabled" }] : /* istanbul ignore next */ []));
    effectiveDisabled = computed(() => this.disabled() || this.formDisabled(), ...(ngDevMode ? [{ debugName: "effectiveDisabled" }] : /* istanbul ignore next */ []));
    onChange = () => undefined;
    onTouched = () => undefined;
    writeValue(value) {
        this.checked.set(Boolean(value));
    }
    registerOnChange(callback) {
        this.onChange = callback;
    }
    registerOnTouched(callback) {
        this.onTouched = callback;
    }
    setDisabledState(isDisabled) {
        this.formDisabled.set(isDisabled);
    }
    handleChange(event) {
        this.checked.set(event.checked);
        this.indeterminate.set(event.source.indeterminate);
        this.onChange(event.checked);
        this.changed.emit(event.checked);
    }
    markAsTouched() {
        this.onTouched();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyCheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.17", type: VoteyCheckboxComponent, isStandalone: true, selector: "vt-checkbox", inputs: { checked: { classPropertyName: "checked", publicName: "checked", isSignal: true, isRequired: false, transformFunction: null }, indeterminate: { classPropertyName: "indeterminate", publicName: "indeterminate", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, labelPosition: { classPropertyName: "labelPosition", publicName: "labelPosition", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { checked: "checkedChange", indeterminate: "indeterminateChange", changed: "changed" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => VoteyCheckboxComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<mat-checkbox\r\n  [class.checkbox-error]=\"error()\"\r\n  [checked]=\"checked()\"\r\n  [disabled]=\"effectiveDisabled()\"\r\n  [indeterminate]=\"indeterminate()\"\r\n  [required]=\"required()\"\r\n  [labelPosition]=\"labelPosition()\"\r\n  [id]=\"id()\"\r\n  [name]=\"name()\"\r\n  [value]=\"value()\"\r\n  [disableRipple]=\"true\"\r\n  (change)=\"handleChange($event)\"\r\n  (indeterminateChange)=\"indeterminate.set($event)\"\r\n  (focusout)=\"markAsTouched()\"\r\n>\r\n  <ng-content>{{ label() | vtTranslate }}</ng-content>\r\n</mat-checkbox>\r\n", styles: ["vt-checkbox{display:inline-flex}vt-checkbox .mat-mdc-checkbox{--checkbox-label-font-family: var(--typo-body-font-family);--checkbox-label-font-size: var(--typo-body-font-size);--checkbox-label-font-weight: var(--typo-body-font-weight);--checkbox-label-letter-spacing: var(--typo-body-letter-spacing);--checkbox-label-line-height: var(--typo-body-line-height);--mat-checkbox-touch-target-display: none;--mat-checkbox-state-layer-size: 20px;--mat-checkbox-selected-checkmark-color: var(--color-accent-on-accent);--mat-checkbox-disabled-selected-checkmark-color: var(--color-text-muted);--mat-checkbox-selected-icon-color: var(--color-accent-primary);--mat-checkbox-selected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-selected-focus-icon-color: var(--color-accent-primary);--mat-checkbox-selected-pressed-icon-color: var(--color-accent-primary);--mat-checkbox-unselected-icon-color: var(--color-border-strong);--mat-checkbox-unselected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-unselected-focus-icon-color: var(--color-border-strong);--mat-checkbox-unselected-pressed-icon-color: var(--color-border-strong);--mat-checkbox-disabled-selected-icon-color: var(--color-border-subtle);--mat-checkbox-disabled-unselected-icon-color: var(--color-border-subtle);--mat-checkbox-label-text-color: var(--color-text-primary);--mat-checkbox-disabled-label-color: var(--color-text-muted);--mat-checkbox-label-text-font: var(--checkbox-label-font-family);--mat-checkbox-label-text-size: var(--checkbox-label-font-size);--mat-checkbox-label-text-line-height: var(--checkbox-label-line-height);--mat-checkbox-label-text-tracking: var(--checkbox-label-letter-spacing);--mat-checkbox-label-text-weight: var(--checkbox-label-font-weight)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__background{top:0!important;left:0!important;box-sizing:border-box;width:20px;height:20px;border:1.5px solid var(--color-border-strong)!important;border-radius:var(--radius-6);overflow:hidden;background-color:var(--color-bg-surface)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark{inset:50% auto auto 50%;width:14px;height:14px;background-color:var(--mat-checkbox-selected-checkmark-color);-webkit-mask:url(/assets/votey/icons/special/icon_sp_check.svg) center/20px 20px no-repeat;mask:url(/assets/votey/icons/special/icon_sp_check.svg) center/20px 20px no-repeat;transform-origin:center;translate:-50% -50%}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark-path{display:none}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__mixedmark{width:10px;border-width:1px;border-color:var(--color-accent-on-accent);border-radius:1px}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-width:0!important;border-color:var(--color-accent-primary)!important;background-color:var(--color-accent-primary)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-strong)!important;background-color:var(--color-bg-surface)!important}@media(pointer:fine){vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important}vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important;background-color:var(--color-accent-hover)!important}}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-bg-surface-tint)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-border-subtle)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{background-color:var(--mat-checkbox-disabled-selected-checkmark-color)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--color-text-muted)}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field{height:20px}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field>.mdc-label{align-self:flex-start;padding-left:var(--spacing-8);font-family:var(--checkbox-label-font-family);font-size:var(--checkbox-label-font-size);font-style:normal;font-weight:var(--checkbox-label-font-weight);font-variation-settings:\"wdth\" 100;line-height:var(--checkbox-label-line-height);letter-spacing:var(--checkbox-label-letter-spacing);white-space:nowrap}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-right:var(--spacing-8)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__ripple,vt-checkbox .mat-mdc-checkbox .mat-mdc-checkbox-ripple{display:none}vt-checkbox .mat-mdc-checkbox.checkbox-error .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-state-error)!important}\n"], dependencies: [{ kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "aria-expanded", "aria-controls", "aria-owns", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyCheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-checkbox", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [MatCheckbox, VoteyTranslatePipe], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => VoteyCheckboxComponent),
                            multi: true,
                        },
                    ], template: "<mat-checkbox\r\n  [class.checkbox-error]=\"error()\"\r\n  [checked]=\"checked()\"\r\n  [disabled]=\"effectiveDisabled()\"\r\n  [indeterminate]=\"indeterminate()\"\r\n  [required]=\"required()\"\r\n  [labelPosition]=\"labelPosition()\"\r\n  [id]=\"id()\"\r\n  [name]=\"name()\"\r\n  [value]=\"value()\"\r\n  [disableRipple]=\"true\"\r\n  (change)=\"handleChange($event)\"\r\n  (indeterminateChange)=\"indeterminate.set($event)\"\r\n  (focusout)=\"markAsTouched()\"\r\n>\r\n  <ng-content>{{ label() | vtTranslate }}</ng-content>\r\n</mat-checkbox>\r\n", styles: ["vt-checkbox{display:inline-flex}vt-checkbox .mat-mdc-checkbox{--checkbox-label-font-family: var(--typo-body-font-family);--checkbox-label-font-size: var(--typo-body-font-size);--checkbox-label-font-weight: var(--typo-body-font-weight);--checkbox-label-letter-spacing: var(--typo-body-letter-spacing);--checkbox-label-line-height: var(--typo-body-line-height);--mat-checkbox-touch-target-display: none;--mat-checkbox-state-layer-size: 20px;--mat-checkbox-selected-checkmark-color: var(--color-accent-on-accent);--mat-checkbox-disabled-selected-checkmark-color: var(--color-text-muted);--mat-checkbox-selected-icon-color: var(--color-accent-primary);--mat-checkbox-selected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-selected-focus-icon-color: var(--color-accent-primary);--mat-checkbox-selected-pressed-icon-color: var(--color-accent-primary);--mat-checkbox-unselected-icon-color: var(--color-border-strong);--mat-checkbox-unselected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-unselected-focus-icon-color: var(--color-border-strong);--mat-checkbox-unselected-pressed-icon-color: var(--color-border-strong);--mat-checkbox-disabled-selected-icon-color: var(--color-border-subtle);--mat-checkbox-disabled-unselected-icon-color: var(--color-border-subtle);--mat-checkbox-label-text-color: var(--color-text-primary);--mat-checkbox-disabled-label-color: var(--color-text-muted);--mat-checkbox-label-text-font: var(--checkbox-label-font-family);--mat-checkbox-label-text-size: var(--checkbox-label-font-size);--mat-checkbox-label-text-line-height: var(--checkbox-label-line-height);--mat-checkbox-label-text-tracking: var(--checkbox-label-letter-spacing);--mat-checkbox-label-text-weight: var(--checkbox-label-font-weight)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__background{top:0!important;left:0!important;box-sizing:border-box;width:20px;height:20px;border:1.5px solid var(--color-border-strong)!important;border-radius:var(--radius-6);overflow:hidden;background-color:var(--color-bg-surface)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark{inset:50% auto auto 50%;width:14px;height:14px;background-color:var(--mat-checkbox-selected-checkmark-color);-webkit-mask:url(/assets/votey/icons/special/icon_sp_check.svg) center/20px 20px no-repeat;mask:url(/assets/votey/icons/special/icon_sp_check.svg) center/20px 20px no-repeat;transform-origin:center;translate:-50% -50%}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark-path{display:none}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__mixedmark{width:10px;border-width:1px;border-color:var(--color-accent-on-accent);border-radius:1px}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-width:0!important;border-color:var(--color-accent-primary)!important;background-color:var(--color-accent-primary)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-strong)!important;background-color:var(--color-bg-surface)!important}@media(pointer:fine){vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important}vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important;background-color:var(--color-accent-hover)!important}}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-bg-surface-tint)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-border-subtle)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{background-color:var(--mat-checkbox-disabled-selected-checkmark-color)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--color-text-muted)}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field{height:20px}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field>.mdc-label{align-self:flex-start;padding-left:var(--spacing-8);font-family:var(--checkbox-label-font-family);font-size:var(--checkbox-label-font-size);font-style:normal;font-weight:var(--checkbox-label-font-weight);font-variation-settings:\"wdth\" 100;line-height:var(--checkbox-label-line-height);letter-spacing:var(--checkbox-label-letter-spacing);white-space:nowrap}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-right:var(--spacing-8)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__ripple,vt-checkbox .mat-mdc-checkbox .mat-mdc-checkbox-ripple{display:none}vt-checkbox .mat-mdc-checkbox.checkbox-error .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-state-error)!important}\n"] }]
        }], propDecorators: { checked: [{ type: i0.Input, args: [{ isSignal: true, alias: "checked", required: false }] }, { type: i0.Output, args: ["checkedChange"] }], indeterminate: [{ type: i0.Input, args: [{ isSignal: true, alias: "indeterminate", required: false }] }, { type: i0.Output, args: ["indeterminateChange"] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], labelPosition: [{ type: i0.Input, args: [{ isSignal: true, alias: "labelPosition", required: false }] }], id: [{ type: i0.Input, args: [{ isSignal: true, alias: "id", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], changed: [{ type: i0.Output, args: ["changed"] }] } });

let nextFilePickerId = 0;
class VoteyFilePickerComponent {
    fallbackId = `vt-file-picker-${++nextFilePickerId}`;
    formDisabled = signal(false, ...(ngDevMode ? [{ debugName: "formDisabled" }] : /* istanbul ignore next */ []));
    value = model(null, ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    filename = input("", ...(ngDevMode ? [{ debugName: "filename" }] : /* istanbul ignore next */ []));
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    emptyText = input("Nie wybrano pliku", ...(ngDevMode ? [{ debugName: "emptyText" }] : /* istanbul ignore next */ []));
    actionText = input("Wybierz plik", ...(ngDevMode ? [{ debugName: "actionText" }] : /* istanbul ignore next */ []));
    showLabel = input(true, { ...(ngDevMode ? { debugName: "showLabel" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    id = input("", ...(ngDevMode ? [{ debugName: "id" }] : /* istanbul ignore next */ []));
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    accept = input("", ...(ngDevMode ? [{ debugName: "accept" }] : /* istanbul ignore next */ []));
    capture = input("", ...(ngDevMode ? [{ debugName: "capture" }] : /* istanbul ignore next */ []));
    ariaLabel = input("", ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    dataCy = input("", ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    changed = output();
    cancelled = output();
    focused = output();
    blurred = output();
    fileInput = viewChild("fileInput", ...(ngDevMode ? [{ debugName: "fileInput" }] : /* istanbul ignore next */ []));
    actionElement = viewChild("actionElement", ...(ngDevMode ? [{ debugName: "actionElement" }] : /* istanbul ignore next */ []));
    effectiveDisabled = computed(() => this.disabled() || this.formDisabled(), ...(ngDevMode ? [{ debugName: "effectiveDisabled" }] : /* istanbul ignore next */ []));
    resolvedId = computed(() => this.id().trim() || this.fallbackId, ...(ngDevMode ? [{ debugName: "resolvedId" }] : /* istanbul ignore next */ []));
    statusId = computed(() => `${this.resolvedId()}-status`, ...(ngDevMode ? [{ debugName: "statusId" }] : /* istanbul ignore next */ []));
    labelVisible = computed(() => this.showLabel() && this.label().trim().length > 0, ...(ngDevMode ? [{ debugName: "labelVisible" }] : /* istanbul ignore next */ []));
    hasFile = computed(() => this.value() !== null || this.filename().trim().length > 0, ...(ngDevMode ? [{ debugName: "hasFile" }] : /* istanbul ignore next */ []));
    resolvedFilename = computed(() => this.value()?.name || this.filename().trim() || this.emptyText(), ...(ngDevMode ? [{ debugName: "resolvedFilename" }] : /* istanbul ignore next */ []));
    resolvedAriaLabel = computed(() => this.ariaLabel().trim() ||
        this.actionText().trim() ||
        this.label().trim(), ...(ngDevMode ? [{ debugName: "resolvedAriaLabel" }] : /* istanbul ignore next */ []));
    filePickerClasses = computed(() => [
        "file-picker",
        this.hasFile() ? "filled" : "",
        this.effectiveDisabled() ? "disabled" : "",
    ]
        .filter(Boolean)
        .join(" "), ...(ngDevMode ? [{ debugName: "filePickerClasses" }] : /* istanbul ignore next */ []));
    onChange = () => undefined;
    onTouched = () => undefined;
    writeValue(value) {
        this.value.set(value ?? null);
        if (!value)
            this.resetNativeInput();
    }
    registerOnChange(callback) {
        this.onChange = callback;
    }
    registerOnTouched(callback) {
        this.onTouched = callback;
    }
    setDisabledState(isDisabled) {
        this.formDisabled.set(isDisabled);
    }
    open() {
        if (this.effectiveDisabled())
            return;
        const inputElement = this.fileInput()?.nativeElement;
        if (!inputElement)
            return;
        inputElement.value = "";
        inputElement.click();
    }
    focus(options) {
        if (this.effectiveDisabled())
            return;
        this.actionElement()?.nativeElement.focus(options);
    }
    blur() {
        this.actionElement()?.nativeElement.blur();
    }
    clear() {
        if (this.effectiveDisabled())
            return;
        this.resetNativeInput();
        this.commitValue(null);
    }
    handleChange(event) {
        const inputElement = event.target;
        const selectedFile = inputElement.files?.item(0) ?? null;
        this.commitValue(selectedFile);
    }
    handleCancel() {
        this.cancelled.emit();
    }
    handleFocus(event) {
        this.focused.emit(event);
    }
    handleBlur(event) {
        this.onTouched();
        this.blurred.emit(event);
    }
    resetNativeInput() {
        const inputElement = this.fileInput()?.nativeElement;
        if (inputElement)
            inputElement.value = "";
    }
    commitValue(value) {
        if (this.value() === value)
            return;
        this.value.set(value);
        this.onChange(value);
        this.changed.emit(value);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFilePickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyFilePickerComponent, isStandalone: true, selector: "vt-file-picker", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, filename: { classPropertyName: "filename", publicName: "filename", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, emptyText: { classPropertyName: "emptyText", publicName: "emptyText", isSignal: true, isRequired: false, transformFunction: null }, actionText: { classPropertyName: "actionText", publicName: "actionText", isSignal: true, isRequired: false, transformFunction: null }, showLabel: { classPropertyName: "showLabel", publicName: "showLabel", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, accept: { classPropertyName: "accept", publicName: "accept", isSignal: true, isRequired: false, transformFunction: null }, capture: { classPropertyName: "capture", publicName: "capture", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange", changed: "changed", cancelled: "cancelled", focused: "focused", blurred: "blurred" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => VoteyFilePickerComponent),
                multi: true,
            },
        ], viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true, isSignal: true }, { propertyName: "actionElement", first: true, predicate: ["actionElement"], descendants: true, isSignal: true }], ngImport: i0, template: "<div [class]=\"filePickerClasses()\">\n  @if (labelVisible()) {\n    <label class=\"label\" [for]=\"resolvedId()\">{{ label() }}</label>\n  }\n\n  <div class=\"row\">\n    <div class=\"file-box\">\n      <span\n        class=\"filename\"\n        aria-live=\"polite\"\n        [id]=\"statusId()\"\n        [attr.title]=\"resolvedFilename()\"\n      >\n        {{ resolvedFilename() }}\n      </span>\n    </div>\n\n    <button\n      #actionElement\n      class=\"action\"\n      type=\"button\"\n      [disabled]=\"effectiveDisabled()\"\n      [attr.aria-controls]=\"resolvedId()\"\n      [attr.aria-describedby]=\"statusId()\"\n      [attr.aria-label]=\"resolvedAriaLabel()\"\n      [attr.aria-required]=\"required()\"\n      (click)=\"open()\"\n      (focus)=\"handleFocus($event)\"\n      (blur)=\"handleBlur($event)\"\n    >\n      {{ actionText() }}\n    </button>\n\n    <input\n      #fileInput\n      type=\"file\"\n      hidden\n      [id]=\"resolvedId()\"\n      [name]=\"name()\"\n      [disabled]=\"effectiveDisabled()\"\n      [attr.accept]=\"accept() || null\"\n      [attr.capture]=\"capture() || null\"\n      [attr.data-cy]=\"dataCy() || null\"\n      (change)=\"handleChange($event)\"\n      (cancel)=\"handleCancel()\"\n    />\n  </div>\n</div>\n", styles: [":host{display:block;width:100%}.file-picker{display:flex;flex-direction:column;align-items:stretch;gap:var(--spacing-8);width:100%}.file-picker .label{color:var(--color-text-secondary);font-family:var(--typo-input-label-font-family);font-size:var(--typo-input-label-font-size);font-weight:var(--typo-input-label-font-weight);letter-spacing:var(--typo-input-label-letter-spacing);line-height:var(--typo-input-label-line-height)}.file-picker .row{position:relative;display:flex;align-items:center;gap:var(--spacing-12);width:100%;height:100px;overflow:hidden}.file-picker .row .file-box{display:flex;flex:1 1 0;align-items:center;min-width:0;height:50px;padding:0 var(--spacing-16);overflow:hidden;border-radius:var(--radius-input);background-color:var(--color-bg-surface-tint)}.file-picker .row .file-box .filename{min-width:0;overflow:hidden;color:var(--color-text-muted);font-family:var(--typo-caption-font-family);font-size:var(--typo-caption-font-size);font-weight:var(--typo-caption-font-weight);letter-spacing:var(--typo-caption-letter-spacing);line-height:var(--typo-caption-line-height);text-overflow:ellipsis;white-space:nowrap}.file-picker .row .action{flex:0 0 auto;padding:0;border:0;background:transparent;color:var(--color-accent-strong);font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height);white-space:nowrap;cursor:pointer}.file-picker .row .action:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px}.file-picker .row .action:disabled{color:var(--color-text-muted);cursor:not-allowed}.file-picker.filled .row .file-box .filename{color:var(--color-text-primary)}.file-picker.disabled .row .file-box .filename{color:var(--color-text-muted)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFilePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-file-picker", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => VoteyFilePickerComponent),
                            multi: true,
                        },
                    ], template: "<div [class]=\"filePickerClasses()\">\n  @if (labelVisible()) {\n    <label class=\"label\" [for]=\"resolvedId()\">{{ label() }}</label>\n  }\n\n  <div class=\"row\">\n    <div class=\"file-box\">\n      <span\n        class=\"filename\"\n        aria-live=\"polite\"\n        [id]=\"statusId()\"\n        [attr.title]=\"resolvedFilename()\"\n      >\n        {{ resolvedFilename() }}\n      </span>\n    </div>\n\n    <button\n      #actionElement\n      class=\"action\"\n      type=\"button\"\n      [disabled]=\"effectiveDisabled()\"\n      [attr.aria-controls]=\"resolvedId()\"\n      [attr.aria-describedby]=\"statusId()\"\n      [attr.aria-label]=\"resolvedAriaLabel()\"\n      [attr.aria-required]=\"required()\"\n      (click)=\"open()\"\n      (focus)=\"handleFocus($event)\"\n      (blur)=\"handleBlur($event)\"\n    >\n      {{ actionText() }}\n    </button>\n\n    <input\n      #fileInput\n      type=\"file\"\n      hidden\n      [id]=\"resolvedId()\"\n      [name]=\"name()\"\n      [disabled]=\"effectiveDisabled()\"\n      [attr.accept]=\"accept() || null\"\n      [attr.capture]=\"capture() || null\"\n      [attr.data-cy]=\"dataCy() || null\"\n      (change)=\"handleChange($event)\"\n      (cancel)=\"handleCancel()\"\n    />\n  </div>\n</div>\n", styles: [":host{display:block;width:100%}.file-picker{display:flex;flex-direction:column;align-items:stretch;gap:var(--spacing-8);width:100%}.file-picker .label{color:var(--color-text-secondary);font-family:var(--typo-input-label-font-family);font-size:var(--typo-input-label-font-size);font-weight:var(--typo-input-label-font-weight);letter-spacing:var(--typo-input-label-letter-spacing);line-height:var(--typo-input-label-line-height)}.file-picker .row{position:relative;display:flex;align-items:center;gap:var(--spacing-12);width:100%;height:100px;overflow:hidden}.file-picker .row .file-box{display:flex;flex:1 1 0;align-items:center;min-width:0;height:50px;padding:0 var(--spacing-16);overflow:hidden;border-radius:var(--radius-input);background-color:var(--color-bg-surface-tint)}.file-picker .row .file-box .filename{min-width:0;overflow:hidden;color:var(--color-text-muted);font-family:var(--typo-caption-font-family);font-size:var(--typo-caption-font-size);font-weight:var(--typo-caption-font-weight);letter-spacing:var(--typo-caption-letter-spacing);line-height:var(--typo-caption-line-height);text-overflow:ellipsis;white-space:nowrap}.file-picker .row .action{flex:0 0 auto;padding:0;border:0;background:transparent;color:var(--color-accent-strong);font-family:var(--typo-button-font-family);font-size:var(--typo-button-font-size);font-weight:var(--typo-button-font-weight);letter-spacing:var(--typo-button-letter-spacing);line-height:var(--typo-button-line-height);white-space:nowrap;cursor:pointer}.file-picker .row .action:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px}.file-picker .row .action:disabled{color:var(--color-text-muted);cursor:not-allowed}.file-picker.filled .row .file-box .filename{color:var(--color-text-primary)}.file-picker.disabled .row .file-box .filename{color:var(--color-text-muted)}\n"] }]
        }], propDecorators: { value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }, { type: i0.Output, args: ["valueChange"] }], filename: [{ type: i0.Input, args: [{ isSignal: true, alias: "filename", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], emptyText: [{ type: i0.Input, args: [{ isSignal: true, alias: "emptyText", required: false }] }], actionText: [{ type: i0.Input, args: [{ isSignal: true, alias: "actionText", required: false }] }], showLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "showLabel", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], id: [{ type: i0.Input, args: [{ isSignal: true, alias: "id", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], accept: [{ type: i0.Input, args: [{ isSignal: true, alias: "accept", required: false }] }], capture: [{ type: i0.Input, args: [{ isSignal: true, alias: "capture", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], changed: [{ type: i0.Output, args: ["changed"] }], cancelled: [{ type: i0.Output, args: ["cancelled"] }], focused: [{ type: i0.Output, args: ["focused"] }], blurred: [{ type: i0.Output, args: ["blurred"] }], fileInput: [{ type: i0.ViewChild, args: ["fileInput", { isSignal: true }] }], actionElement: [{ type: i0.ViewChild, args: ["actionElement", { isSignal: true }] }] } });

class VoteyRadioOptionContentDirective {
    optionId = input.required({ ...(ngDevMode ? { debugName: "optionId" } : /* istanbul ignore next */ {}), alias: "vtRadioOptionContent" });
    templateRef = inject(TemplateRef);
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyRadioOptionContentDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "21.2.17", type: VoteyRadioOptionContentDirective, isStandalone: true, selector: "ng-template[vtRadioOptionContent]", inputs: { optionId: { classPropertyName: "optionId", publicName: "vtRadioOptionContent", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyRadioOptionContentDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[vtRadioOptionContent]",
                }]
        }], propDecorators: { optionId: [{ type: i0.Input, args: [{ isSignal: true, alias: "vtRadioOptionContent", required: true }] }] } });

class VoteyRadioButtonComponent {
    translator = injectVoteyTranslator();
    optionContents = contentChildren(VoteyRadioOptionContentDirective, { ...(ngDevMode ? { debugName: "optionContents" } : /* istanbul ignore next */ {}), descendants: true });
    options = input.required(...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    control = input.required(...(ngDevMode ? [{ debugName: "control" }] : /* istanbul ignore next */ []));
    groupLabelPosition = input("after", ...(ngDevMode ? [{ debugName: "groupLabelPosition" }] : /* istanbul ignore next */ []));
    groupDisabled = input(false, ...(ngDevMode ? [{ debugName: "groupDisabled" }] : /* istanbul ignore next */ []));
    groupRequired = input(false, ...(ngDevMode ? [{ debugName: "groupRequired" }] : /* istanbul ignore next */ []));
    groupClass = input("", ...(ngDevMode ? [{ debugName: "groupClass" }] : /* istanbul ignore next */ []));
    tooltip = input("", ...(ngDevMode ? [{ debugName: "tooltip" }] : /* istanbul ignore next */ []));
    disabledNote = input("", ...(ngDevMode ? [{ debugName: "disabledNote" }] : /* istanbul ignore next */ []));
    change = output();
    groupAccessibleLabel = computed(() => this.options()
        .map((option) => this.translator.translate(option.label))
        .join(", "), ...(ngDevMode ? [{ debugName: "groupAccessibleLabel" }] : /* istanbul ignore next */ []));
    resolvedTooltip = computed(() => (this.groupDisabled() ? this.disabledNote() : this.tooltip()).trim(), ...(ngDevMode ? [{ debugName: "resolvedTooltip" }] : /* istanbul ignore next */ []));
    optionContentTemplates = computed(() => {
        const templates = {};
        for (const optionContent of this.optionContents()) {
            templates[optionContent.optionId()] = optionContent.templateRef;
        }
        return templates;
    }, ...(ngDevMode ? [{ debugName: "optionContentTemplates" }] : /* istanbul ignore next */ []));
    handleChange(event) {
        this.change.emit(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyRadioButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyRadioButtonComponent, isStandalone: true, selector: "vt-radio-button", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: true, transformFunction: null }, control: { classPropertyName: "control", publicName: "control", isSignal: true, isRequired: true, transformFunction: null }, groupLabelPosition: { classPropertyName: "groupLabelPosition", publicName: "groupLabelPosition", isSignal: true, isRequired: false, transformFunction: null }, groupDisabled: { classPropertyName: "groupDisabled", publicName: "groupDisabled", isSignal: true, isRequired: false, transformFunction: null }, groupRequired: { classPropertyName: "groupRequired", publicName: "groupRequired", isSignal: true, isRequired: false, transformFunction: null }, groupClass: { classPropertyName: "groupClass", publicName: "groupClass", isSignal: true, isRequired: false, transformFunction: null }, tooltip: { classPropertyName: "tooltip", publicName: "tooltip", isSignal: true, isRequired: false, transformFunction: null }, disabledNote: { classPropertyName: "disabledNote", publicName: "disabledNote", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { change: "change" }, queries: [{ propertyName: "optionContents", predicate: VoteyRadioOptionContentDirective, descendants: true, isSignal: true }], ngImport: i0, template: "@let translatedTooltip = resolvedTooltip() | vtTranslate;\r\n<div\r\n  class=\"radio-group-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltip\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltip\"\r\n>\r\n  <mat-radio-group\r\n    [class]=\"groupClass()\"\r\n    [formControl]=\"control()\"\r\n    [labelPosition]=\"groupLabelPosition()\"\r\n    [required]=\"groupRequired()\"\r\n    [attr.aria-label]=\"groupAccessibleLabel()\"\r\n    (change)=\"handleChange($event)\"\r\n  >\r\n    @for (option of options(); track option.id ?? $index) { @let optionDisabled\r\n    = (option.disabled ?? false) || groupDisabled() || control().disabled;\r\n    <mat-radio-button\r\n      [class]=\"option.className ?? ''\"\r\n      [class.radio-error]=\"option.error ?? false\"\r\n      [disabled]=\"optionDisabled\"\r\n      [required]=\"option.required ?? false\"\r\n      [labelPosition]=\"option.labelPosition ?? groupLabelPosition()\"\r\n      [id]=\"option.id ?? ''\"\r\n      [value]=\"option.value\"\r\n      [attr.data-cy]=\"option.dataCy ?? null\"\r\n    >\r\n      <span class=\"vt-radio-option-label\">\r\n        <vt-text\r\n          variant=\"body\"\r\n          [color]=\"optionDisabled ? 'muted' : 'primary'\"\r\n          [content]=\"option.label | vtTranslate\"\r\n        />\r\n      </span>\r\n    </mat-radio-button>\r\n    @if (control().value === option.value) { @if (option.id; as optionId) { @if\r\n    (optionContentTemplates()[optionId]; as optionContent) {\r\n    <div class=\"vt-radio-option-content\">\r\n      <ng-container [ngTemplateOutlet]=\"optionContent\" />\r\n    </div>\r\n    } } } }\r\n  </mat-radio-group>\r\n</div>\r\n", styles: ["vt-radio-button{display:inline-flex}vt-radio-button .radio-group-wrapper{display:inline-flex}vt-radio-button .vt-radio-option-content{padding-inline-start:calc(20px + var(--spacing-8))}vt-radio-button .mat-mdc-radio-group{display:inline-flex;flex-direction:column;align-items:flex-start;gap:var(--space-control-padding-y)}vt-radio-button .mat-mdc-radio-button{--mat-radio-touch-target-display: none;--mat-radio-state-layer-size: 20px;--mat-radio-label-text-font: var(--typo-body-font-family);--mat-radio-label-text-size: var(--typo-body-font-size);--mat-radio-label-text-line-height: var(--typo-body-line-height);--mat-radio-label-text-tracking: var(--typo-body-letter-spacing);--mat-radio-label-text-weight: var(--typo-body-font-weight);--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button.mat-primary,vt-radio-button .mat-mdc-radio-button.mat-accent,vt-radio-button .mat-mdc-radio-button.mat-warn{--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button .mdc-radio{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-radio-button .mat-mdc-radio-button .mdc-radio__background{border-radius:var(--radius-10);background-color:var(--color-bg-surface)}vt-radio-button .mat-mdc-radio-button .mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button .mdc-radio__inner-circle{border-radius:var(--radius-10)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px}@media(pointer:fine){vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-accent-hover)}vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--color-accent-primary)}}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background{background-color:var(--color-bg-surface-tint)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px;border-color:var(--color-border-subtle)}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field{height:20px}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field>.mdc-label{align-self:flex-start;padding-inline-start:var(--spacing-8);padding-inline-end:0;font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);line-height:var(--typo-body-line-height);letter-spacing:var(--typo-body-letter-spacing);white-space:nowrap}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-inline-start:0;padding-inline-end:var(--spacing-8)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .vt-radio-option-label{display:inline-flex;align-items:center}\n"], dependencies: [{ kind: "component", type: MatRadioButton, selector: "mat-radio-button", inputs: ["id", "name", "aria-label", "aria-labelledby", "aria-describedby", "disableRipple", "tabIndex", "checked", "value", "labelPosition", "disabled", "required", "color", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioButton"] }, { kind: "directive", type: MatRadioGroup, selector: "mat-radio-group", inputs: ["color", "name", "labelPosition", "value", "selected", "disabled", "required", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioGroup"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyRadioButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-radio-button", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [
                        MatRadioButton,
                        MatRadioGroup,
                        MatTooltip,
                        NgTemplateOutlet,
                        ReactiveFormsModule,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedTooltip = resolvedTooltip() | vtTranslate;\r\n<div\r\n  class=\"radio-group-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltip\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltip\"\r\n>\r\n  <mat-radio-group\r\n    [class]=\"groupClass()\"\r\n    [formControl]=\"control()\"\r\n    [labelPosition]=\"groupLabelPosition()\"\r\n    [required]=\"groupRequired()\"\r\n    [attr.aria-label]=\"groupAccessibleLabel()\"\r\n    (change)=\"handleChange($event)\"\r\n  >\r\n    @for (option of options(); track option.id ?? $index) { @let optionDisabled\r\n    = (option.disabled ?? false) || groupDisabled() || control().disabled;\r\n    <mat-radio-button\r\n      [class]=\"option.className ?? ''\"\r\n      [class.radio-error]=\"option.error ?? false\"\r\n      [disabled]=\"optionDisabled\"\r\n      [required]=\"option.required ?? false\"\r\n      [labelPosition]=\"option.labelPosition ?? groupLabelPosition()\"\r\n      [id]=\"option.id ?? ''\"\r\n      [value]=\"option.value\"\r\n      [attr.data-cy]=\"option.dataCy ?? null\"\r\n    >\r\n      <span class=\"vt-radio-option-label\">\r\n        <vt-text\r\n          variant=\"body\"\r\n          [color]=\"optionDisabled ? 'muted' : 'primary'\"\r\n          [content]=\"option.label | vtTranslate\"\r\n        />\r\n      </span>\r\n    </mat-radio-button>\r\n    @if (control().value === option.value) { @if (option.id; as optionId) { @if\r\n    (optionContentTemplates()[optionId]; as optionContent) {\r\n    <div class=\"vt-radio-option-content\">\r\n      <ng-container [ngTemplateOutlet]=\"optionContent\" />\r\n    </div>\r\n    } } } }\r\n  </mat-radio-group>\r\n</div>\r\n", styles: ["vt-radio-button{display:inline-flex}vt-radio-button .radio-group-wrapper{display:inline-flex}vt-radio-button .vt-radio-option-content{padding-inline-start:calc(20px + var(--spacing-8))}vt-radio-button .mat-mdc-radio-group{display:inline-flex;flex-direction:column;align-items:flex-start;gap:var(--space-control-padding-y)}vt-radio-button .mat-mdc-radio-button{--mat-radio-touch-target-display: none;--mat-radio-state-layer-size: 20px;--mat-radio-label-text-font: var(--typo-body-font-family);--mat-radio-label-text-size: var(--typo-body-font-size);--mat-radio-label-text-line-height: var(--typo-body-line-height);--mat-radio-label-text-tracking: var(--typo-body-letter-spacing);--mat-radio-label-text-weight: var(--typo-body-font-weight);--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button.mat-primary,vt-radio-button .mat-mdc-radio-button.mat-accent,vt-radio-button .mat-mdc-radio-button.mat-warn{--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button .mdc-radio{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-radio-button .mat-mdc-radio-button .mdc-radio__background{border-radius:var(--radius-10);background-color:var(--color-bg-surface)}vt-radio-button .mat-mdc-radio-button .mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button .mdc-radio__inner-circle{border-radius:var(--radius-10)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px}@media(pointer:fine){vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-accent-hover)}vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--color-accent-primary)}}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background{background-color:var(--color-bg-surface-tint)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px;border-color:var(--color-border-subtle)}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field{height:20px}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field>.mdc-label{align-self:flex-start;padding-inline-start:var(--spacing-8);padding-inline-end:0;font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);line-height:var(--typo-body-line-height);letter-spacing:var(--typo-body-letter-spacing);white-space:nowrap}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-inline-start:0;padding-inline-end:var(--spacing-8)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .vt-radio-option-label{display:inline-flex;align-items:center}\n"] }]
        }], propDecorators: { optionContents: [{ type: i0.ContentChildren, args: [i0.forwardRef(() => VoteyRadioOptionContentDirective), { ...{
                            descendants: true,
                        }, isSignal: true }] }], options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: true }] }], control: [{ type: i0.Input, args: [{ isSignal: true, alias: "control", required: true }] }], groupLabelPosition: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupLabelPosition", required: false }] }], groupDisabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupDisabled", required: false }] }], groupRequired: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupRequired", required: false }] }], groupClass: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupClass", required: false }] }], tooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "tooltip", required: false }] }], disabledNote: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabledNote", required: false }] }], change: [{ type: i0.Output, args: ["change"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VOTEY_SVG_REGISTRY_CONFIG, VOTEY_TRANSLATOR, VoteyButtonComponent, VoteyButtonSizes, VoteyButtonVariants, VoteyCheckboxComponent, VoteyDeviceService, VoteyFilePickerComponent, VoteyIconComponent, VoteyIconNames, VoteyIconRegistryEntries, VoteyIllustrationNames, VoteyIllustrationRegistryEntries, VoteyRadioButtonComponent, VoteyRadioOptionContentDirective, VoteySvgRegistryService, VoteyTextColors, VoteyTextComponent, VoteyTextVariants, VoteyTranslatePipe, provideVoteyDeviceDetection, provideVoteySvgRegistry };
//# sourceMappingURL=pleodigital-design-system-votey-angular.mjs.map
