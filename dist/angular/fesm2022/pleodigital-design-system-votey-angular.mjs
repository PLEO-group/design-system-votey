import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { InjectionToken, inject, PLATFORM_ID, Injectable, makeEnvironmentProviders, provideEnvironmentInitializer, input, ChangeDetectionStrategy, Component, Pipe, numberAttribute, computed, output, viewChildren, signal, Input, Directive, model, ViewEncapsulation, DOCUMENT as DOCUMENT$1, ElementRef, DestroyRef, booleanAttribute, viewChild, effect, TemplateRef, contentChildren, forwardRef, LOCALE_ID } from '@angular/core';
import DeviceDetector from 'node-device-detector';
import { BehaviorSubject } from 'rxjs';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import * as i1 from '@angular/forms';
import { FormControl, ReactiveFormsModule, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect, MatOption, MatSelectTrigger } from '@angular/material/select';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import * as i1$1 from '@angular/material/core';
import { NativeDateAdapter, provideNativeDateAdapter, DateAdapter, MAT_NATIVE_DATE_FORMATS, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerIntl, MatCalendar } from '@angular/material/datepicker';

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
    "bg-create-first-vote-v2",
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
    "bg-point-voting-v2",
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
    "logo-wyborek-white",
    "simple-anonymity-off",
    "simple-anonymity-off-v2",
    "simple-anonymity-on",
    "simple-anonymity-on-v2",
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
    "spot-participants-pair",
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
    { name: "bg-create-first-vote-v2", path: "illustrations/background/illu_bg_create-first-vote_v2.svg" },
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
    { name: "bg-point-voting-v2", path: "illustrations/background/illu_bg_point-voting_v2.svg" },
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
    { name: "logo-wyborek-white", path: "illustrations/logotypes/logo_wyborek_white.svg" },
    { name: "simple-anonymity-off", path: "illustrations/simple/illu_simple_anonymity-off.svg" },
    { name: "simple-anonymity-off-v2", path: "illustrations/simple/illu_simple_anonymity-off_v2.svg" },
    { name: "simple-anonymity-on", path: "illustrations/simple/illu_simple_anonymity-on.svg" },
    { name: "simple-anonymity-on-v2", path: "illustrations/simple/illu_simple_anonymity-on_v2.svg" },
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
    { name: "spot-participants-pair", path: "illustrations/spot/illu_spot_participants-pair.svg" },
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
    color = input("", ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.17", type: VoteyIconComponent, isStandalone: true, selector: "vt-icon", inputs: { ico: { classPropertyName: "ico", publicName: "ico", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<mat-icon\r\n  [svgIcon]=\"ico()\"\r\n  [attr.aria-hidden]=\"ariaLabel().trim() ? null : true\"\r\n  [attr.aria-label]=\"ariaLabel().trim() || null\"\r\n  [class.accent]=\"color() === 'accent'\"\r\n  [class.white]=\"color() === 'white'\"\r\n  [class.muted]=\"color() === 'muted'\"\r\n/>\r\n", styles: [":host{display:contents}mat-icon{display:block;width:100%;height:100%}mat-icon.accent{color:var(--color-accent-primary)}mat-icon.white{color:var(--color-white)}mat-icon.muted{color:var(--color-text-muted)}:host ::ng-deep mat-icon.accent svg[fill]:not([fill=none]),:host ::ng-deep mat-icon.accent svg [fill]:not([fill=none]){fill:var(--color-accent-primary)!important}:host ::ng-deep mat-icon.accent svg[stroke]:not([stroke=none]),:host ::ng-deep mat-icon.accent svg [stroke]:not([stroke=none]){stroke:var(--color-accent-primary)!important}:host ::ng-deep mat-icon.white svg[fill]:not([fill=none]),:host ::ng-deep mat-icon.white svg [fill]:not([fill=none]){fill:var(--color-white)!important}:host ::ng-deep mat-icon.white svg[stroke]:not([stroke=none]),:host ::ng-deep mat-icon.white svg [stroke]:not([stroke=none]){stroke:var(--color-white)!important}:host ::ng-deep mat-icon.muted svg[fill]:not([fill=none]),:host ::ng-deep mat-icon.muted svg [fill]:not([fill=none]){fill:var(--color-text-muted)!important}:host ::ng-deep mat-icon.muted svg[stroke]:not([stroke=none]),:host ::ng-deep mat-icon.muted svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)!important}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyIconComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-icon", changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatIcon], template: "<mat-icon\r\n  [svgIcon]=\"ico()\"\r\n  [attr.aria-hidden]=\"ariaLabel().trim() ? null : true\"\r\n  [attr.aria-label]=\"ariaLabel().trim() || null\"\r\n  [class.accent]=\"color() === 'accent'\"\r\n  [class.white]=\"color() === 'white'\"\r\n  [class.muted]=\"color() === 'muted'\"\r\n/>\r\n", styles: [":host{display:contents}mat-icon{display:block;width:100%;height:100%}mat-icon.accent{color:var(--color-accent-primary)}mat-icon.white{color:var(--color-white)}mat-icon.muted{color:var(--color-text-muted)}:host ::ng-deep mat-icon.accent svg[fill]:not([fill=none]),:host ::ng-deep mat-icon.accent svg [fill]:not([fill=none]){fill:var(--color-accent-primary)!important}:host ::ng-deep mat-icon.accent svg[stroke]:not([stroke=none]),:host ::ng-deep mat-icon.accent svg [stroke]:not([stroke=none]){stroke:var(--color-accent-primary)!important}:host ::ng-deep mat-icon.white svg[fill]:not([fill=none]),:host ::ng-deep mat-icon.white svg [fill]:not([fill=none]){fill:var(--color-white)!important}:host ::ng-deep mat-icon.white svg[stroke]:not([stroke=none]),:host ::ng-deep mat-icon.white svg [stroke]:not([stroke=none]){stroke:var(--color-white)!important}:host ::ng-deep mat-icon.muted svg[fill]:not([fill=none]),:host ::ng-deep mat-icon.muted svg [fill]:not([fill=none]){fill:var(--color-text-muted)!important}:host ::ng-deep mat-icon.muted svg[stroke]:not([stroke=none]),:host ::ng-deep mat-icon.muted svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)!important}\n"] }]
        }], propDecorators: { ico: [{ type: i0.Input, args: [{ isSignal: true, alias: "ico", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }] } });

const VOTEY_SVG_REGISTRY_CONFIG = new InjectionToken("VOTEY_SVG_REGISTRY_CONFIG");
const DEFAULT_ASSET_BASE_URL = "assets/votey";
function getVoteySvgAssetUrl(assetPath, config = {}) {
    const assetBaseUrl = (config.assetBaseUrl ?? DEFAULT_ASSET_BASE_URL).replace(/\/+$/, "");
    return assetBaseUrl ? `${assetBaseUrl}/${assetPath}` : assetPath;
}
class VoteySvgRegistryService {
    matIconRegistry = inject(MatIconRegistry);
    domSanitizer = inject(DomSanitizer);
    config = inject(VOTEY_SVG_REGISTRY_CONFIG, { optional: true }) ?? {};
    registered = false;
    register() {
        if (this.registered)
            return;
        for (const asset of [
            ...VoteyIconRegistryEntries,
            ...VoteyIllustrationRegistryEntries,
        ]) {
            const assetUrl = getVoteySvgAssetUrl(asset.path, this.config);
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
    "display-l",
    "body-2xl",
    "body-xl",
    "body-l",
    "body-l-semibold",
    "body-l-bold",
    "body",
    "body-s",
    "caption",
    "caption-extrabold",
    "caption-light",
    "caption-s",
    "micro",
    "action",
    "action-s",
    "column-header",
    "label",
    "field",
];
const VoteyTextColors = [
    "primary",
    "secondary",
    "muted",
    "inverse",
    "accent",
    "error",
    "on-sidebar",
];
class VoteyTextComponent {
    content = input.required(...(ngDevMode ? [{ debugName: "content" }] : /* istanbul ignore next */ []));
    variant = input("body", ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    color = input("primary", ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
    uppercase = input(false, ...(ngDevMode ? [{ debugName: "uppercase" }] : /* istanbul ignore next */ []));
    italic = input(false, ...(ngDevMode ? [{ debugName: "italic" }] : /* istanbul ignore next */ []));
    wrap = input(false, ...(ngDevMode ? [{ debugName: "wrap" }] : /* istanbul ignore next */ []));
    maxLines = input(0, { ...(ngDevMode ? { debugName: "maxLines" } : /* istanbul ignore next */ {}), transform: (value) => {
            const lines = numberAttribute(value);
            return Number.isSafeInteger(lines) && lines > 0 ? lines : 0;
        } });
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.17", type: VoteyTextComponent, isStandalone: true, selector: "vt-text", inputs: { content: { classPropertyName: "content", publicName: "content", isSignal: true, isRequired: true, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, uppercase: { classPropertyName: "uppercase", publicName: "uppercase", isSignal: true, isRequired: false, transformFunction: null }, italic: { classPropertyName: "italic", publicName: "italic", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, maxLines: { classPropertyName: "maxLines", publicName: "maxLines", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<span [class]=\"textClasses()\" [style.--vt-text-max-lines]=\"maxLines()\">\n  {{ content() }}\n</span>\n", styles: [":host{display:contents}.text{color:var(--color-text-primary)}.text.h1{font-size:var(--typo-h1-font-size);font-weight:var(--typo-h1-font-weight);letter-spacing:var(--typo-h1-letter-spacing);line-height:var(--typo-h1-line-height)}.text.h2{font-size:var(--typo-h2-font-size);font-weight:var(--typo-h2-font-weight);letter-spacing:var(--typo-h2-letter-spacing);line-height:var(--typo-h2-line-height)}.text.h3{font-size:var(--typo-h3-font-size);font-weight:var(--typo-h3-font-weight);letter-spacing:var(--typo-h3-letter-spacing);line-height:var(--typo-h3-line-height)}.text.h4{font-size:var(--typo-h4-font-size);font-weight:var(--typo-h4-font-weight);letter-spacing:var(--typo-h4-letter-spacing);line-height:var(--typo-h4-line-height)}.text.h5{font-size:var(--typo-h5-font-size);font-weight:var(--typo-h5-font-weight);letter-spacing:var(--typo-h5-letter-spacing);line-height:var(--typo-h5-line-height)}.text.display-l{font-size:var(--typo-display-l-font-size);font-weight:var(--typo-display-l-font-weight);letter-spacing:var(--typo-display-l-letter-spacing);line-height:var(--typo-display-l-line-height)}.text.body-2xl{font-size:var(--typo-body-2xl-font-size);font-weight:var(--typo-body-2xl-font-weight);letter-spacing:var(--typo-body-2xl-letter-spacing);line-height:var(--typo-body-2xl-line-height)}.text.body-xl{font-size:var(--typo-body-xl-font-size);font-weight:var(--typo-body-xl-font-weight);letter-spacing:var(--typo-body-xl-letter-spacing);line-height:var(--typo-body-xl-line-height)}.text.body-l{font-size:var(--typo-body-l-font-size);font-weight:var(--typo-body-l-font-weight);letter-spacing:var(--typo-body-l-letter-spacing);line-height:var(--typo-body-l-line-height)}.text.body-l-semibold{font-size:var(--typo-body-l-semibold-font-size);font-weight:var(--typo-body-l-semibold-font-weight);letter-spacing:var(--typo-body-l-semibold-letter-spacing);line-height:var(--typo-body-l-semibold-line-height)}.text.body-l-bold{font-size:var(--typo-body-l-bold-font-size);font-weight:var(--typo-body-l-bold-font-weight);letter-spacing:var(--typo-body-l-bold-letter-spacing);line-height:var(--typo-body-l-bold-line-height)}.text.body{font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.text.body-s{font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}.text.caption{font-size:var(--typo-caption-font-size);font-weight:var(--typo-caption-font-weight);letter-spacing:var(--typo-caption-letter-spacing);line-height:var(--typo-caption-line-height)}.text.caption-extrabold{font-size:var(--typo-caption-extrabold-font-size);font-weight:var(--typo-caption-extrabold-font-weight);letter-spacing:var(--typo-caption-extrabold-letter-spacing);line-height:var(--typo-caption-extrabold-line-height)}.text.caption-light{font-size:var(--typo-caption-light-font-size);font-weight:var(--typo-caption-light-font-weight);letter-spacing:var(--typo-caption-light-letter-spacing);line-height:var(--typo-caption-light-line-height)}.text.caption-s{font-size:var(--typo-caption-s-font-size);font-weight:var(--typo-caption-s-font-weight);letter-spacing:var(--typo-caption-s-letter-spacing);line-height:var(--typo-caption-s-line-height)}.text.micro{font-size:var(--typo-micro-font-size);font-weight:var(--typo-micro-font-weight);letter-spacing:var(--typo-micro-letter-spacing);line-height:var(--typo-micro-line-height)}.text.action{font-size:var(--typo-action-font-size);font-weight:var(--typo-action-font-weight);letter-spacing:var(--typo-action-letter-spacing);line-height:var(--typo-action-line-height)}.text.action-s{font-size:var(--typo-action-s-font-size);font-weight:var(--typo-action-s-font-weight);letter-spacing:var(--typo-action-s-letter-spacing);line-height:var(--typo-action-s-line-height)}.text.column-header{font-size:var(--typo-column-header-font-size);font-weight:var(--typo-column-header-font-weight);letter-spacing:var(--typo-column-header-letter-spacing);line-height:var(--typo-column-header-line-height)}.text.label{font-size:var(--typo-label-font-size);font-weight:var(--typo-label-font-weight);letter-spacing:var(--typo-label-letter-spacing);line-height:var(--typo-label-line-height)}.text.field{font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}.text.primary{color:var(--color-text-primary)}.text.secondary{color:var(--color-text-secondary)}.text.muted{color:var(--color-text-muted)}.text.inverse{color:var(--color-text-inverse)}.text.accent{color:var(--color-text-accent)}.text.error{color:var(--color-state-error)}.text.on-sidebar{color:var(--color-text-on-sidebar)}.text.constrained{display:block;min-width:0;max-width:100%}.text.uppercase{text-transform:uppercase}.text.italic{font-style:italic}.text.ellipsis{display:-webkit-box;width:100%;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:var(--vt-text-max-lines)}.text.wrap{white-space:normal;overflow-wrap:anywhere}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTextComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-text", changeDetection: ChangeDetectionStrategy.OnPush, template: "<span [class]=\"textClasses()\" [style.--vt-text-max-lines]=\"maxLines()\">\n  {{ content() }}\n</span>\n", styles: [":host{display:contents}.text{color:var(--color-text-primary)}.text.h1{font-size:var(--typo-h1-font-size);font-weight:var(--typo-h1-font-weight);letter-spacing:var(--typo-h1-letter-spacing);line-height:var(--typo-h1-line-height)}.text.h2{font-size:var(--typo-h2-font-size);font-weight:var(--typo-h2-font-weight);letter-spacing:var(--typo-h2-letter-spacing);line-height:var(--typo-h2-line-height)}.text.h3{font-size:var(--typo-h3-font-size);font-weight:var(--typo-h3-font-weight);letter-spacing:var(--typo-h3-letter-spacing);line-height:var(--typo-h3-line-height)}.text.h4{font-size:var(--typo-h4-font-size);font-weight:var(--typo-h4-font-weight);letter-spacing:var(--typo-h4-letter-spacing);line-height:var(--typo-h4-line-height)}.text.h5{font-size:var(--typo-h5-font-size);font-weight:var(--typo-h5-font-weight);letter-spacing:var(--typo-h5-letter-spacing);line-height:var(--typo-h5-line-height)}.text.display-l{font-size:var(--typo-display-l-font-size);font-weight:var(--typo-display-l-font-weight);letter-spacing:var(--typo-display-l-letter-spacing);line-height:var(--typo-display-l-line-height)}.text.body-2xl{font-size:var(--typo-body-2xl-font-size);font-weight:var(--typo-body-2xl-font-weight);letter-spacing:var(--typo-body-2xl-letter-spacing);line-height:var(--typo-body-2xl-line-height)}.text.body-xl{font-size:var(--typo-body-xl-font-size);font-weight:var(--typo-body-xl-font-weight);letter-spacing:var(--typo-body-xl-letter-spacing);line-height:var(--typo-body-xl-line-height)}.text.body-l{font-size:var(--typo-body-l-font-size);font-weight:var(--typo-body-l-font-weight);letter-spacing:var(--typo-body-l-letter-spacing);line-height:var(--typo-body-l-line-height)}.text.body-l-semibold{font-size:var(--typo-body-l-semibold-font-size);font-weight:var(--typo-body-l-semibold-font-weight);letter-spacing:var(--typo-body-l-semibold-letter-spacing);line-height:var(--typo-body-l-semibold-line-height)}.text.body-l-bold{font-size:var(--typo-body-l-bold-font-size);font-weight:var(--typo-body-l-bold-font-weight);letter-spacing:var(--typo-body-l-bold-letter-spacing);line-height:var(--typo-body-l-bold-line-height)}.text.body{font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.text.body-s{font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}.text.caption{font-size:var(--typo-caption-font-size);font-weight:var(--typo-caption-font-weight);letter-spacing:var(--typo-caption-letter-spacing);line-height:var(--typo-caption-line-height)}.text.caption-extrabold{font-size:var(--typo-caption-extrabold-font-size);font-weight:var(--typo-caption-extrabold-font-weight);letter-spacing:var(--typo-caption-extrabold-letter-spacing);line-height:var(--typo-caption-extrabold-line-height)}.text.caption-light{font-size:var(--typo-caption-light-font-size);font-weight:var(--typo-caption-light-font-weight);letter-spacing:var(--typo-caption-light-letter-spacing);line-height:var(--typo-caption-light-line-height)}.text.caption-s{font-size:var(--typo-caption-s-font-size);font-weight:var(--typo-caption-s-font-weight);letter-spacing:var(--typo-caption-s-letter-spacing);line-height:var(--typo-caption-s-line-height)}.text.micro{font-size:var(--typo-micro-font-size);font-weight:var(--typo-micro-font-weight);letter-spacing:var(--typo-micro-letter-spacing);line-height:var(--typo-micro-line-height)}.text.action{font-size:var(--typo-action-font-size);font-weight:var(--typo-action-font-weight);letter-spacing:var(--typo-action-letter-spacing);line-height:var(--typo-action-line-height)}.text.action-s{font-size:var(--typo-action-s-font-size);font-weight:var(--typo-action-s-font-weight);letter-spacing:var(--typo-action-s-letter-spacing);line-height:var(--typo-action-s-line-height)}.text.column-header{font-size:var(--typo-column-header-font-size);font-weight:var(--typo-column-header-font-weight);letter-spacing:var(--typo-column-header-letter-spacing);line-height:var(--typo-column-header-line-height)}.text.label{font-size:var(--typo-label-font-size);font-weight:var(--typo-label-font-weight);letter-spacing:var(--typo-label-letter-spacing);line-height:var(--typo-label-line-height)}.text.field{font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}.text.primary{color:var(--color-text-primary)}.text.secondary{color:var(--color-text-secondary)}.text.muted{color:var(--color-text-muted)}.text.inverse{color:var(--color-text-inverse)}.text.accent{color:var(--color-text-accent)}.text.error{color:var(--color-state-error)}.text.on-sidebar{color:var(--color-text-on-sidebar)}.text.constrained{display:block;min-width:0;max-width:100%}.text.uppercase{text-transform:uppercase}.text.italic{font-style:italic}.text.ellipsis{display:-webkit-box;width:100%;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:var(--vt-text-max-lines)}.text.wrap{white-space:normal;overflow-wrap:anywhere}\n"] }]
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
    ariaLabel = input("", ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    ico = input("", ...(ngDevMode ? [{ debugName: "ico" }] : /* istanbul ignore next */ []));
    badge = input(null, ...(ngDevMode ? [{ debugName: "badge" }] : /* istanbul ignore next */ []));
    tooltipText = input("", ...(ngDevMode ? [{ debugName: "tooltipText" }] : /* istanbul ignore next */ []));
    disabledNote = input("", ...(ngDevMode ? [{ debugName: "disabledNote" }] : /* istanbul ignore next */ []));
    ariaExpanded = input(null, ...(ngDevMode ? [{ debugName: "ariaExpanded" }] : /* istanbul ignore next */ []));
    ariaHasPopup = input(null, ...(ngDevMode ? [{ debugName: "ariaHasPopup" }] : /* istanbul ignore next */ []));
    ariaControls = input(null, ...(ngDevMode ? [{ debugName: "ariaControls" }] : /* istanbul ignore next */ []));
    iconColor = input("", ...(ngDevMode ? [{ debugName: "iconColor" }] : /* istanbul ignore next */ []));
    pressed = output();
    buttonClasses = computed(() => `${this.variant()} ${this.size()}`, ...(ngDevMode ? [{ debugName: "buttonClasses" }] : /* istanbul ignore next */ []));
    isIconButton = computed(() => Boolean(this.ico()) && !this.text(), ...(ngDevMode ? [{ debugName: "isIconButton" }] : /* istanbul ignore next */ []));
    resolvedTooltipText = computed(() => (this.disabled() ? this.disabledNote() : this.tooltipText()).trim(), ...(ngDevMode ? [{ debugName: "resolvedTooltipText" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyButtonComponent, isStandalone: true, selector: "vt-button", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, text: { classPropertyName: "text", publicName: "text", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, ico: { classPropertyName: "ico", publicName: "ico", isSignal: true, isRequired: false, transformFunction: null }, badge: { classPropertyName: "badge", publicName: "badge", isSignal: true, isRequired: false, transformFunction: null }, tooltipText: { classPropertyName: "tooltipText", publicName: "tooltipText", isSignal: true, isRequired: false, transformFunction: null }, disabledNote: { classPropertyName: "disabledNote", publicName: "disabledNote", isSignal: true, isRequired: false, transformFunction: null }, ariaExpanded: { classPropertyName: "ariaExpanded", publicName: "ariaExpanded", isSignal: true, isRequired: false, transformFunction: null }, ariaHasPopup: { classPropertyName: "ariaHasPopup", publicName: "ariaHasPopup", isSignal: true, isRequired: false, transformFunction: null }, ariaControls: { classPropertyName: "ariaControls", publicName: "ariaControls", isSignal: true, isRequired: false, transformFunction: null }, iconColor: { classPropertyName: "iconColor", publicName: "iconColor", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { pressed: "pressed" }, ngImport: i0, template: "@let translatedText = text() | vtTranslate; @let translatedTooltipText =\r\nresolvedTooltipText() | vtTranslate; @let translatedAriaLabel = ariaLabel() |\r\nvtTranslate;\r\n<div\r\n  class=\"button-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltipText\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltipText\"\r\n>\r\n  <button\r\n    [class]=\"buttonClasses()\"\r\n    [class.icon-button]=\"isIconButton()\"\r\n    [class.disabled]=\"disabled()\"\r\n    [disabled]=\"disabled()\"\r\n    [attr.aria-disabled]=\"disabled()\"\r\n    [attr.aria-expanded]=\"ariaExpanded()\"\r\n    [attr.aria-haspopup]=\"ariaHasPopup()\"\r\n    [attr.aria-controls]=\"ariaControls()\"\r\n    [attr.aria-label]=\"\r\n      translatedText.trim() ||\r\n      translatedAriaLabel.trim() ||\r\n      translatedTooltipText.trim() ||\r\n      null\r\n    \"\r\n    [type]=\"type()\"\r\n    (click)=\"pressed.emit()\"\r\n  >\r\n    @if (ico()) {\r\n    <span class=\"icon\">\r\n      <vt-icon [ico]=\"ico()\" [color]=\"iconColor()\" />\r\n    </span>\r\n    } @if (text()) {\r\n    <span class=\"label\">{{ translatedText }}</span>\r\n    } @if (badge() !== null && badge() !== \"\") {\r\n    <span class=\"badge\">\r\n      <vt-text variant=\"micro\" color=\"primary\" [content]=\"badge()\" />\r\n    </span>\r\n    }\r\n  </button>\r\n</div>\r\n", styles: [":host,.button-wrapper{display:inline-flex}button{position:relative;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-icon-gap);height:45px;padding:var(--space-control-padding-y-l) var(--space-control-padding-x-l);border:1px solid transparent;border-radius:var(--radius-full);background-color:transparent;color:var(--color-text-primary);font-family:inherit;font-size:var(--typo-action-font-size);font-weight:var(--typo-action-font-weight);letter-spacing:var(--typo-action-letter-spacing);line-height:var(--typo-action-line-height);white-space:nowrap;cursor:pointer;outline:none;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .12s ease}button:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}button:active:not(:disabled){transform:scale(.98)}button.small{height:calc(var(--space-inset-2xs) * 2 + var(--typo-action-s-line-height));gap:var(--space-gap-s);padding:var(--space-inset-2xs) var(--space-inset-m) var(--space-inset-2xs) var(--space-inset-l);font-size:var(--typo-action-s-font-size);font-weight:var(--typo-action-s-font-weight);letter-spacing:var(--typo-action-s-letter-spacing);line-height:var(--typo-action-s-line-height)}button.small .icon{flex-basis:15px;width:15px;height:15px}button .label{color:inherit;font:inherit}button .icon{display:block;flex:0 0 20px;width:20px;height:20px;color:inherit}button .badge{position:absolute;top:-7px;right:-7px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 var(--spacing-2);border:2px solid var(--color-bg-surface);border-radius:var(--radius-pill);background-color:var(--color-accent-primary)}button.disabled,button:disabled{cursor:not-allowed;pointer-events:none}button.primary{border-color:var(--color-accent-hover);background-color:var(--color-accent-primary);color:var(--color-accent-on-accent)}button.primary:hover{border-color:var(--color-accent-strong);background-color:var(--color-accent-hover)}button.primary:active{border-color:var(--color-accent-strong);background-color:var(--color-accent-strong)}button.primary.disabled,button.primary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-border-subtle);color:var(--color-text-muted)}button.secondary{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface);color:var(--color-text-primary)}button.secondary:hover{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}button.secondary:active{border-color:var(--color-accent-strong);background-color:var(--color-bg-surface-tint)}button.secondary.disabled,button.secondary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted)}button.link{color:var(--color-accent-primary);padding:0!important}button.link:not(.small){height:42px;padding:var(--space-control-padding-y-l) var(--space-control-padding-x-l);border:0;border-radius:0;font-family:inherit;font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}button.link.small{border:0;border-radius:0}button.link:hover{color:var(--color-accent-hover)}button.link:active{color:var(--color-accent-strong)}button.link.disabled,button.link:disabled{color:var(--color-text-muted)}button.ghost{border-color:transparent;background-color:transparent;color:var(--color-text-primary)}button.ghost:hover:not(:disabled):not(:focus-visible){border-color:transparent;background-color:transparent}button.ghost:active{border-color:transparent;background-color:transparent}button.ghost.disabled,button.ghost:disabled{border-color:transparent;background-color:transparent;color:var(--color-text-muted);box-shadow:none}button.icon-button{width:44px;height:44px;padding:0}button.icon-button.small{width:28px;height:28px}button.icon-button.small .icon{flex-basis:16px;width:16px;height:16px}button.orange{border-color:var(--color-orange-300);background-color:var(--color-yellow-50);color:var(--color-text-primary)}button.orange .label{font-weight:var(--typo-action-font-weight)}button.danger{position:relative;border:none;border-color:var(--color-red-400);background-color:var(--color-red-400)}button.danger:before{position:absolute;top:0;right:50%;width:0;height:100%;background-color:var(--color-white);content:\"\";opacity:0;transition:all .5s}button.danger:hover:before{right:0;width:100%;border-radius:var(--radius-20);opacity:.6}button.danger .icon,button.danger .label{position:relative}:host ::ng-deep button:disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep button:disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}@media(prefers-reduced-motion:reduce){button{transition:none}button:active:not(:disabled){transform:none}button.danger:before{transition:none}}\n"], dependencies: [{ kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-button", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        MatTooltip,
                        VoteyIconComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedText = text() | vtTranslate; @let translatedTooltipText =\r\nresolvedTooltipText() | vtTranslate; @let translatedAriaLabel = ariaLabel() |\r\nvtTranslate;\r\n<div\r\n  class=\"button-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltipText\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltipText\"\r\n>\r\n  <button\r\n    [class]=\"buttonClasses()\"\r\n    [class.icon-button]=\"isIconButton()\"\r\n    [class.disabled]=\"disabled()\"\r\n    [disabled]=\"disabled()\"\r\n    [attr.aria-disabled]=\"disabled()\"\r\n    [attr.aria-expanded]=\"ariaExpanded()\"\r\n    [attr.aria-haspopup]=\"ariaHasPopup()\"\r\n    [attr.aria-controls]=\"ariaControls()\"\r\n    [attr.aria-label]=\"\r\n      translatedText.trim() ||\r\n      translatedAriaLabel.trim() ||\r\n      translatedTooltipText.trim() ||\r\n      null\r\n    \"\r\n    [type]=\"type()\"\r\n    (click)=\"pressed.emit()\"\r\n  >\r\n    @if (ico()) {\r\n    <span class=\"icon\">\r\n      <vt-icon [ico]=\"ico()\" [color]=\"iconColor()\" />\r\n    </span>\r\n    } @if (text()) {\r\n    <span class=\"label\">{{ translatedText }}</span>\r\n    } @if (badge() !== null && badge() !== \"\") {\r\n    <span class=\"badge\">\r\n      <vt-text variant=\"micro\" color=\"primary\" [content]=\"badge()\" />\r\n    </span>\r\n    }\r\n  </button>\r\n</div>\r\n", styles: [":host,.button-wrapper{display:inline-flex}button{position:relative;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-icon-gap);height:45px;padding:var(--space-control-padding-y-l) var(--space-control-padding-x-l);border:1px solid transparent;border-radius:var(--radius-full);background-color:transparent;color:var(--color-text-primary);font-family:inherit;font-size:var(--typo-action-font-size);font-weight:var(--typo-action-font-weight);letter-spacing:var(--typo-action-letter-spacing);line-height:var(--typo-action-line-height);white-space:nowrap;cursor:pointer;outline:none;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .12s ease}button:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}button:active:not(:disabled){transform:scale(.98)}button.small{height:calc(var(--space-inset-2xs) * 2 + var(--typo-action-s-line-height));gap:var(--space-gap-s);padding:var(--space-inset-2xs) var(--space-inset-m) var(--space-inset-2xs) var(--space-inset-l);font-size:var(--typo-action-s-font-size);font-weight:var(--typo-action-s-font-weight);letter-spacing:var(--typo-action-s-letter-spacing);line-height:var(--typo-action-s-line-height)}button.small .icon{flex-basis:15px;width:15px;height:15px}button .label{color:inherit;font:inherit}button .icon{display:block;flex:0 0 20px;width:20px;height:20px;color:inherit}button .badge{position:absolute;top:-7px;right:-7px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 var(--spacing-2);border:2px solid var(--color-bg-surface);border-radius:var(--radius-pill);background-color:var(--color-accent-primary)}button.disabled,button:disabled{cursor:not-allowed;pointer-events:none}button.primary{border-color:var(--color-accent-hover);background-color:var(--color-accent-primary);color:var(--color-accent-on-accent)}button.primary:hover{border-color:var(--color-accent-strong);background-color:var(--color-accent-hover)}button.primary:active{border-color:var(--color-accent-strong);background-color:var(--color-accent-strong)}button.primary.disabled,button.primary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-border-subtle);color:var(--color-text-muted)}button.secondary{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface);color:var(--color-text-primary)}button.secondary:hover{border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}button.secondary:active{border-color:var(--color-accent-strong);background-color:var(--color-bg-surface-tint)}button.secondary.disabled,button.secondary:disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted)}button.link{color:var(--color-accent-primary);padding:0!important}button.link:not(.small){height:42px;padding:var(--space-control-padding-y-l) var(--space-control-padding-x-l);border:0;border-radius:0;font-family:inherit;font-size:var(--typo-body-s-font-size);font-weight:var(--typo-body-s-font-weight);letter-spacing:var(--typo-body-s-letter-spacing);line-height:var(--typo-body-s-line-height)}button.link.small{border:0;border-radius:0}button.link:hover{color:var(--color-accent-hover)}button.link:active{color:var(--color-accent-strong)}button.link.disabled,button.link:disabled{color:var(--color-text-muted)}button.ghost{border-color:transparent;background-color:transparent;color:var(--color-text-primary)}button.ghost:hover:not(:disabled):not(:focus-visible){border-color:transparent;background-color:transparent}button.ghost:active{border-color:transparent;background-color:transparent}button.ghost.disabled,button.ghost:disabled{border-color:transparent;background-color:transparent;color:var(--color-text-muted);box-shadow:none}button.icon-button{width:44px;height:44px;padding:0}button.icon-button.small{width:28px;height:28px}button.icon-button.small .icon{flex-basis:16px;width:16px;height:16px}button.orange{border-color:var(--color-orange-300);background-color:var(--color-yellow-50);color:var(--color-text-primary)}button.orange .label{font-weight:var(--typo-action-font-weight)}button.danger{position:relative;border:none;border-color:var(--color-red-400);background-color:var(--color-red-400)}button.danger:before{position:absolute;top:0;right:50%;width:0;height:100%;background-color:var(--color-white);content:\"\";opacity:0;transition:all .5s}button.danger:hover:before{right:0;width:100%;border-radius:var(--radius-20);opacity:.6}button.danger .icon,button.danger .label{position:relative}:host ::ng-deep button:disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep button:disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}@media(prefers-reduced-motion:reduce){button{transition:none}button:active:not(:disabled){transform:none}button.danger:before{transition:none}}\n"] }]
        }], propDecorators: { disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], text: [{ type: i0.Input, args: [{ isSignal: true, alias: "text", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], ico: [{ type: i0.Input, args: [{ isSignal: true, alias: "ico", required: false }] }], badge: [{ type: i0.Input, args: [{ isSignal: true, alias: "badge", required: false }] }], tooltipText: [{ type: i0.Input, args: [{ isSignal: true, alias: "tooltipText", required: false }] }], disabledNote: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabledNote", required: false }] }], ariaExpanded: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaExpanded", required: false }] }], ariaHasPopup: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaHasPopup", required: false }] }], ariaControls: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaControls", required: false }] }], iconColor: [{ type: i0.Input, args: [{ isSignal: true, alias: "iconColor", required: false }] }], pressed: [{ type: i0.Output, args: ["pressed"] }] } });

class VoteyMenuComponent {
    items = input([], ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    selectedId = input(null, ...(ngDevMode ? [{ debugName: "selectedId" }] : /* istanbul ignore next */ []));
    dataCy = input(null, ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    fullWidth = input(false, ...(ngDevMode ? [{ debugName: "fullWidth" }] : /* istanbul ignore next */ []));
    embedded = input(false, ...(ngDevMode ? [{ debugName: "embedded" }] : /* istanbul ignore next */ []));
    itemSelected = output();
    dismissed = output();
    menuItems = viewChildren("menuItem", ...(ngDevMode ? [{ debugName: "menuItems" }] : /* istanbul ignore next */ []));
    activeIndex = signal(0, ...(ngDevMode ? [{ debugName: "activeIndex" }] : /* istanbul ignore next */ []));
    resolvedActiveIndex = computed(() => {
        const items = this.items();
        const activeIndex = this.activeIndex();
        if (items[activeIndex] && !items[activeIndex].disabled) {
            return activeIndex;
        }
        return items.findIndex((item) => !item.disabled);
    }, ...(ngDevMode ? [{ debugName: "resolvedActiveIndex" }] : /* istanbul ignore next */ []));
    focusFirst() {
        this.focusEnabledItem(0, 1);
    }
    focusLast() {
        this.focusEnabledItem(this.items().length - 1, -1);
    }
    focusSelected() {
        const index = this.items().findIndex(item => item.id === this.selectedId() && !item.disabled);
        this.focusEnabledItem(index < 0 ? 0 : index, 1);
    }
    scrollSelected() {
        const index = this.items().findIndex(item => item.id === this.selectedId() && !item.disabled);
        if (index >= 0)
            this.menuItems()[index]?.nativeElement.scrollIntoView({ block: "nearest" });
    }
    handleItemFocus(index) {
        this.activeIndex.set(index);
    }
    handleItemPressed(item, index) {
        if (item.disabled)
            return;
        this.activeIndex.set(index);
        this.itemSelected.emit(item);
    }
    handleKeydown(event, index) {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                this.focusEnabledItem(index + 1, 1);
                break;
            case "ArrowUp":
                event.preventDefault();
                this.focusEnabledItem(index - 1, -1);
                break;
            case "Home":
                event.preventDefault();
                this.focusFirst();
                break;
            case "End":
                event.preventDefault();
                this.focusLast();
                break;
            case "Escape":
                event.stopPropagation();
                this.dismissed.emit();
                break;
            case "Tab":
                this.dismissed.emit();
                break;
        }
    }
    focusEnabledItem(startIndex, direction) {
        const items = this.items();
        if (items.length === 0)
            return;
        for (let offset = 0; offset < items.length; offset += 1) {
            const index = (startIndex + offset * direction + items.length) % items.length;
            if (!items[index].disabled) {
                this.activeIndex.set(index);
                this.menuItems()[index]?.nativeElement.focus();
                return;
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyMenuComponent, isStandalone: true, selector: "vt-menu", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, selectedId: { classPropertyName: "selectedId", publicName: "selectedId", isSignal: true, isRequired: false, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null }, fullWidth: { classPropertyName: "fullWidth", publicName: "fullWidth", isSignal: true, isRequired: false, transformFunction: null }, embedded: { classPropertyName: "embedded", publicName: "embedded", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { itemSelected: "itemSelected", dismissed: "dismissed" }, viewQueries: [{ propertyName: "menuItems", predicate: ["menuItem"], descendants: true, isSignal: true }], ngImport: i0, template: "<ul\r\n  class=\"menu\"\r\n  [class.full-width]=\"fullWidth()\"\r\n  [class.embedded]=\"embedded()\"\r\n  role=\"menu\"\r\n  [attr.data-cy]=\"dataCy()\"\r\n>\r\n  @for (item of items(); track item.id; let index = $index) { @let selected =\r\n  item.id === selectedId(); @let disabled = item.disabled;\r\n  <li role=\"none\">\r\n    <button\r\n      #menuItem\r\n      class=\"item\"\r\n      type=\"button\"\r\n      role=\"menuitem\"\r\n      [class.disabled]=\"disabled\"\r\n      [class.selected]=\"selected\"\r\n      [disabled]=\"disabled\"\r\n      [attr.data-item-id]=\"item.id\"\r\n      [attr.tabindex]=\"index === resolvedActiveIndex() ? 0 : -1\"\r\n      (click)=\"handleItemPressed(item, index)\"\r\n      (focus)=\"handleItemFocus(index)\"\r\n      (keydown)=\"handleKeydown($event, index)\"\r\n    >\r\n      <vt-text\r\n        variant=\"body\"\r\n        [content]=\"item.label | vtTranslate\"\r\n        [color]=\"selected ? 'accent' : disabled ? 'muted' : 'primary'\"\r\n      />\r\n    </button>\r\n  </li>\r\n  }\r\n</ul>\r\n", styles: [":host{display:inline-block;max-width:100%}:host::-webkit-scrollbar{width:12px;background-color:var(--color-gray-100)}:host::-webkit-scrollbar-track{background-color:var(--color-white)}:host::-webkit-scrollbar-thumb{border:1px solid var(--color-gray-100);border-radius:5px;background-color:var(--color-navy-blue-800)}:host::-webkit-scrollbar-button{display:none;width:0;height:0}@supports (-moz-appearance: none){:host{scrollbar-color:var(--color-navy-blue-800) var(--color-white)}}.menu{box-sizing:border-box;display:flex;flex-direction:column;width:240px;max-width:100%;margin:0;padding:var(--space-icon-gap) 0;overflow:hidden;border:0;border-radius:var(--radius-3xl);background-color:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-subtle),0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent);list-style:none}.menu.full-width{width:100%}.menu.embedded{padding:0;border-radius:0;background:transparent;box-shadow:none}.menu li{display:block;margin:0;padding:0}.menu li .item{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-icon-gap);width:100%;height:44px;padding:var(--space-control-padding-y) var(--space-control-padding-x);border:0;background-color:transparent;cursor:pointer;outline:none}.menu li .item:focus-visible{box-shadow:inset 0 0 0 2px var(--color-border-focus)}.menu li .item:hover:not(:disabled),.menu li .item.selected{background-color:var(--color-bg-surface-tint)}.menu li .item.disabled,.menu li .item:disabled{cursor:not-allowed}\n"], dependencies: [{ kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-menu", changeDetection: ChangeDetectionStrategy.OnPush, imports: [VoteyTextComponent, VoteyTranslatePipe], template: "<ul\r\n  class=\"menu\"\r\n  [class.full-width]=\"fullWidth()\"\r\n  [class.embedded]=\"embedded()\"\r\n  role=\"menu\"\r\n  [attr.data-cy]=\"dataCy()\"\r\n>\r\n  @for (item of items(); track item.id; let index = $index) { @let selected =\r\n  item.id === selectedId(); @let disabled = item.disabled;\r\n  <li role=\"none\">\r\n    <button\r\n      #menuItem\r\n      class=\"item\"\r\n      type=\"button\"\r\n      role=\"menuitem\"\r\n      [class.disabled]=\"disabled\"\r\n      [class.selected]=\"selected\"\r\n      [disabled]=\"disabled\"\r\n      [attr.data-item-id]=\"item.id\"\r\n      [attr.tabindex]=\"index === resolvedActiveIndex() ? 0 : -1\"\r\n      (click)=\"handleItemPressed(item, index)\"\r\n      (focus)=\"handleItemFocus(index)\"\r\n      (keydown)=\"handleKeydown($event, index)\"\r\n    >\r\n      <vt-text\r\n        variant=\"body\"\r\n        [content]=\"item.label | vtTranslate\"\r\n        [color]=\"selected ? 'accent' : disabled ? 'muted' : 'primary'\"\r\n      />\r\n    </button>\r\n  </li>\r\n  }\r\n</ul>\r\n", styles: [":host{display:inline-block;max-width:100%}:host::-webkit-scrollbar{width:12px;background-color:var(--color-gray-100)}:host::-webkit-scrollbar-track{background-color:var(--color-white)}:host::-webkit-scrollbar-thumb{border:1px solid var(--color-gray-100);border-radius:5px;background-color:var(--color-navy-blue-800)}:host::-webkit-scrollbar-button{display:none;width:0;height:0}@supports (-moz-appearance: none){:host{scrollbar-color:var(--color-navy-blue-800) var(--color-white)}}.menu{box-sizing:border-box;display:flex;flex-direction:column;width:240px;max-width:100%;margin:0;padding:var(--space-icon-gap) 0;overflow:hidden;border:0;border-radius:var(--radius-3xl);background-color:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-subtle),0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent);list-style:none}.menu.full-width{width:100%}.menu.embedded{padding:0;border-radius:0;background:transparent;box-shadow:none}.menu li{display:block;margin:0;padding:0}.menu li .item{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-icon-gap);width:100%;height:44px;padding:var(--space-control-padding-y) var(--space-control-padding-x);border:0;background-color:transparent;cursor:pointer;outline:none}.menu li .item:focus-visible{box-shadow:inset 0 0 0 2px var(--color-border-focus)}.menu li .item:hover:not(:disabled),.menu li .item.selected{background-color:var(--color-bg-surface-tint)}.menu li .item.disabled,.menu li .item:disabled{cursor:not-allowed}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], selectedId: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectedId", required: false }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], fullWidth: [{ type: i0.Input, args: [{ isSignal: true, alias: "fullWidth", required: false }] }], embedded: [{ type: i0.Input, args: [{ isSignal: true, alias: "embedded", required: false }] }], itemSelected: [{ type: i0.Output, args: ["itemSelected"] }], dismissed: [{ type: i0.Output, args: ["dismissed"] }], menuItems: [{ type: i0.ViewChildren, args: ["menuItem", { isSignal: true }] }] } });

class VoteyFormControlApplyDirective {
    formControl = new FormControl(null);
    set staticValue(value) {
        if (value === undefined)
            return;
        this.formControl.setValue(value);
        this.formControl.disable();
    }
    set initialValue(value) {
        if (value === undefined)
            return;
        this.formControl.setValue(value);
    }
    set control(control) {
        if (!control)
            return;
        this.formControl = control;
    }
    set disable(disabled) {
        if (disabled === undefined)
            return;
        if (disabled) {
            this.formControl.disable();
        }
        else {
            this.formControl.enable();
        }
    }
    set block(blocked) {
        this.disable = blocked;
    }
    get blocked() {
        return this.formControl.disabled;
    }
    get touched() {
        return this.formControl.touched;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFormControlApplyDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.2.17", type: VoteyFormControlApplyDirective, isStandalone: true, selector: "[vtFormControlApply]", inputs: { staticValue: "staticValue", initialValue: "initialValue", control: "control", disable: "disable", block: "block" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFormControlApplyDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[vtFormControlApply]",
                    standalone: true,
                }]
        }], propDecorators: { staticValue: [{
                type: Input
            }], initialValue: [{
                type: Input
            }], control: [{
                type: Input
            }], disable: [{
                type: Input
            }], block: [{
                type: Input
            }] } });

class VoteyFormErrorComponent {
    errors = input([], ...(ngDevMode ? [{ debugName: "errors" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    visibleErrors = computed(() => this.errors()
        .filter((error) => !this.ignoredErrors().includes(error) &&
        !this.ignoredErrors().includes(this.toTranslationKey(error)))
        .map((error) => this.toTranslationKey(error)), ...(ngDevMode ? [{ debugName: "visibleErrors" }] : /* istanbul ignore next */ []));
    toTranslationKey(error) {
        return error.startsWith("ERRORS.")
            ? error
            : `ERRORS.${error.toUpperCase()}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFormErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyFormErrorComponent, isStandalone: true, selector: "vt-form-error", inputs: { errors: { classPropertyName: "errors", publicName: "errors", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "@if (visibleErrors().length > 0) {\r\n<div class=\"form-error\" role=\"alert\">\r\n  @for (error of visibleErrors(); track error) {\r\n  <vt-text variant=\"caption-s\" color=\"error\" [content]=\"error | vtTranslate\" />\r\n  }\r\n</div>\r\n}\r\n", styles: [":host{display:block}.form-error{display:flex;flex-direction:column;gap:var(--spacing-2)}\n"], dependencies: [{ kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFormErrorComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-form-error", changeDetection: ChangeDetectionStrategy.OnPush, imports: [VoteyTextComponent, VoteyTranslatePipe], template: "@if (visibleErrors().length > 0) {\r\n<div class=\"form-error\" role=\"alert\">\r\n  @for (error of visibleErrors(); track error) {\r\n  <vt-text variant=\"caption-s\" color=\"error\" [content]=\"error | vtTranslate\" />\r\n  }\r\n</div>\r\n}\r\n", styles: [":host{display:block}.form-error{display:flex;flex-direction:column;gap:var(--spacing-2)}\n"] }]
        }], propDecorators: { errors: [{ type: i0.Input, args: [{ isSignal: true, alias: "errors", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }] } });

class VoteyCheckboxComponent extends VoteyFormControlApplyDirective {
    indeterminate = model(false, ...(ngDevMode ? [{ debugName: "indeterminate" }] : /* istanbul ignore next */ []));
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    required = input(false, ...(ngDevMode ? [{ debugName: "required" }] : /* istanbul ignore next */ []));
    error = input(false, ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    labelPosition = input("after", ...(ngDevMode ? [{ debugName: "labelPosition" }] : /* istanbul ignore next */ []));
    id = input("", ...(ngDevMode ? [{ debugName: "id" }] : /* istanbul ignore next */ []));
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    value = input("", ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    changed = output();
    get errorKeys() {
        return this.formControl.invalid && this.formControl.touched
            ? Object.keys(this.formControl.errors ?? {})
            : [];
    }
    svgRegistryConfig = inject(VOTEY_SVG_REGISTRY_CONFIG, { optional: true }) ?? {};
    checkmarkMaskUrl = `url("${getVoteySvgAssetUrl("icons/special/icon_sp_check.svg", this.svgRegistryConfig)}")`;
    handleChange(event) {
        this.changed.emit(event.checked);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyCheckboxComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.17", type: VoteyCheckboxComponent, isStandalone: true, selector: "vt-checkbox", inputs: { indeterminate: { classPropertyName: "indeterminate", publicName: "indeterminate", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, labelPosition: { classPropertyName: "labelPosition", publicName: "labelPosition", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { indeterminate: "indeterminateChange", changed: "changed" }, usesInheritance: true, ngImport: i0, template: "<mat-checkbox\r\n  [class.checkbox-error]=\"error()\"\r\n  disableRipple\r\n  [formControl]=\"formControl\"\r\n  [disabled]=\"disabled() || formControl.disabled\"\r\n  [indeterminate]=\"indeterminate()\"\r\n  [required]=\"required()\"\r\n  [labelPosition]=\"labelPosition()\"\r\n  [id]=\"id()\"\r\n  [name]=\"name()\"\r\n  [value]=\"value()\"\r\n  [style.--votey-checkbox-checkmark-url]=\"checkmarkMaskUrl\"\r\n  (change)=\"handleChange($event)\"\r\n  (indeterminateChange)=\"indeterminate.set($event)\"\r\n>\r\n  <ng-content>{{ label() | vtTranslate }}</ng-content>\r\n</mat-checkbox>\r\n\r\n<vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n", styles: ["vt-checkbox{display:inline-flex;flex-direction:column;align-items:flex-start}vt-checkbox .mat-mdc-checkbox{--checkbox-label-font-family: var(--typo-body-font-family);--checkbox-label-font-size: var(--typo-body-font-size);--checkbox-label-font-weight: var(--typo-body-font-weight);--checkbox-label-letter-spacing: var(--typo-body-letter-spacing);--checkbox-label-line-height: var(--typo-body-line-height);--mat-checkbox-touch-target-display: none;--mat-checkbox-state-layer-size: 20px;--mat-checkbox-selected-checkmark-color: var(--color-accent-on-accent);--mat-checkbox-disabled-selected-checkmark-color: var(--color-text-muted);--mat-checkbox-selected-icon-color: var(--color-accent-primary);--mat-checkbox-selected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-selected-focus-icon-color: var(--color-accent-primary);--mat-checkbox-selected-pressed-icon-color: var(--color-accent-primary);--mat-checkbox-unselected-icon-color: var(--color-border-strong);--mat-checkbox-unselected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-unselected-focus-icon-color: var(--color-border-strong);--mat-checkbox-unselected-pressed-icon-color: var(--color-border-strong);--mat-checkbox-disabled-selected-icon-color: var(--color-border-subtle);--mat-checkbox-disabled-unselected-icon-color: var(--color-border-subtle);--mat-checkbox-label-text-color: var(--color-text-primary);--mat-checkbox-disabled-label-color: var(--color-text-muted);--mat-checkbox-label-text-font: var(--checkbox-label-font-family);--mat-checkbox-label-text-size: var(--checkbox-label-font-size);--mat-checkbox-label-text-line-height: var(--checkbox-label-line-height);--mat-checkbox-label-text-tracking: var(--checkbox-label-letter-spacing);--mat-checkbox-label-text-weight: var(--checkbox-label-font-weight)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__background{top:0!important;left:0!important;box-sizing:border-box;width:20px;height:20px;border:1.5px solid var(--color-border-strong)!important;border-radius:var(--radius-6);overflow:hidden;background-color:var(--color-bg-surface)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark{inset:50% auto auto 50%;width:14px;height:14px;background-color:var(--mat-checkbox-selected-checkmark-color);-webkit-mask:var(--votey-checkbox-checkmark-url) center/20px 20px no-repeat;mask:var(--votey-checkbox-checkmark-url) center/20px 20px no-repeat;transform-origin:center;translate:-50% -50%}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark-path{display:none}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__mixedmark{width:10px;border-width:1px;border-color:var(--color-accent-on-accent);border-radius:1px}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-width:0!important;border-color:var(--color-accent-primary)!important;background-color:var(--color-accent-primary)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-strong)!important;background-color:var(--color-bg-surface)!important}@media(pointer:fine){vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important}vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important;background-color:var(--color-accent-hover)!important}}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-bg-surface-tint)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-border-subtle)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{background-color:var(--mat-checkbox-disabled-selected-checkmark-color)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--color-text-muted)}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field{height:20px}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field>.mdc-label{align-self:flex-start;padding-left:var(--spacing-8);font-family:var(--checkbox-label-font-family);font-size:var(--checkbox-label-font-size);font-style:normal;font-weight:var(--checkbox-label-font-weight);font-variation-settings:\"wdth\" 100;line-height:var(--checkbox-label-line-height);letter-spacing:var(--checkbox-label-letter-spacing);white-space:nowrap}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-right:var(--spacing-8)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__ripple,vt-checkbox .mat-mdc-checkbox .mat-mdc-checkbox-ripple{display:none}vt-checkbox .mat-mdc-checkbox.checkbox-error .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-state-error)!important}\n"], dependencies: [{ kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "aria-expanded", "aria-controls", "aria-owns", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyCheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-checkbox", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [
                        MatCheckbox,
                        ReactiveFormsModule,
                        VoteyFormErrorComponent,
                        VoteyTranslatePipe,
                    ], template: "<mat-checkbox\r\n  [class.checkbox-error]=\"error()\"\r\n  disableRipple\r\n  [formControl]=\"formControl\"\r\n  [disabled]=\"disabled() || formControl.disabled\"\r\n  [indeterminate]=\"indeterminate()\"\r\n  [required]=\"required()\"\r\n  [labelPosition]=\"labelPosition()\"\r\n  [id]=\"id()\"\r\n  [name]=\"name()\"\r\n  [value]=\"value()\"\r\n  [style.--votey-checkbox-checkmark-url]=\"checkmarkMaskUrl\"\r\n  (change)=\"handleChange($event)\"\r\n  (indeterminateChange)=\"indeterminate.set($event)\"\r\n>\r\n  <ng-content>{{ label() | vtTranslate }}</ng-content>\r\n</mat-checkbox>\r\n\r\n<vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n", styles: ["vt-checkbox{display:inline-flex;flex-direction:column;align-items:flex-start}vt-checkbox .mat-mdc-checkbox{--checkbox-label-font-family: var(--typo-body-font-family);--checkbox-label-font-size: var(--typo-body-font-size);--checkbox-label-font-weight: var(--typo-body-font-weight);--checkbox-label-letter-spacing: var(--typo-body-letter-spacing);--checkbox-label-line-height: var(--typo-body-line-height);--mat-checkbox-touch-target-display: none;--mat-checkbox-state-layer-size: 20px;--mat-checkbox-selected-checkmark-color: var(--color-accent-on-accent);--mat-checkbox-disabled-selected-checkmark-color: var(--color-text-muted);--mat-checkbox-selected-icon-color: var(--color-accent-primary);--mat-checkbox-selected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-selected-focus-icon-color: var(--color-accent-primary);--mat-checkbox-selected-pressed-icon-color: var(--color-accent-primary);--mat-checkbox-unselected-icon-color: var(--color-border-strong);--mat-checkbox-unselected-hover-icon-color: var(--color-accent-hover);--mat-checkbox-unselected-focus-icon-color: var(--color-border-strong);--mat-checkbox-unselected-pressed-icon-color: var(--color-border-strong);--mat-checkbox-disabled-selected-icon-color: var(--color-border-subtle);--mat-checkbox-disabled-unselected-icon-color: var(--color-border-subtle);--mat-checkbox-label-text-color: var(--color-text-primary);--mat-checkbox-disabled-label-color: var(--color-text-muted);--mat-checkbox-label-text-font: var(--checkbox-label-font-family);--mat-checkbox-label-text-size: var(--checkbox-label-font-size);--mat-checkbox-label-text-line-height: var(--checkbox-label-line-height);--mat-checkbox-label-text-tracking: var(--checkbox-label-letter-spacing);--mat-checkbox-label-text-weight: var(--checkbox-label-font-weight)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__background{top:0!important;left:0!important;box-sizing:border-box;width:20px;height:20px;border:1.5px solid var(--color-border-strong)!important;border-radius:var(--radius-6);overflow:hidden;background-color:var(--color-bg-surface)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark{inset:50% auto auto 50%;width:14px;height:14px;background-color:var(--mat-checkbox-selected-checkmark-color);-webkit-mask:var(--votey-checkbox-checkmark-url) center/20px 20px no-repeat;mask:var(--votey-checkbox-checkmark-url) center/20px 20px no-repeat;transform-origin:center;translate:-50% -50%}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__checkmark-path{display:none}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__mixedmark{width:10px;border-width:1px;border-color:var(--color-accent-on-accent);border-radius:1px}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-width:0!important;border-color:var(--color-accent-primary)!important;background-color:var(--color-accent-primary)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-strong)!important;background-color:var(--color-bg-surface)!important}@media(pointer:fine){vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important}vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox:hover .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-accent-hover)!important;background-color:var(--color-accent-hover)!important}}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-bg-surface-tint)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:checked~.mdc-checkbox__background,vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled:indeterminate~.mdc-checkbox__background{border-color:var(--color-border-subtle)!important;background-color:var(--color-border-subtle)!important}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{background-color:var(--mat-checkbox-disabled-selected-checkmark-color)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--color-text-muted)}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field{height:20px}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field>.mdc-label{align-self:flex-start;padding-left:var(--spacing-8);font-family:var(--checkbox-label-font-family);font-size:var(--checkbox-label-font-size);font-style:normal;font-weight:var(--checkbox-label-font-weight);font-variation-settings:\"wdth\" 100;line-height:var(--checkbox-label-line-height);letter-spacing:var(--checkbox-label-letter-spacing);white-space:nowrap}vt-checkbox .mat-mdc-checkbox .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-right:var(--spacing-8)}vt-checkbox .mat-mdc-checkbox .mdc-checkbox__ripple,vt-checkbox .mat-mdc-checkbox .mat-mdc-checkbox-ripple{display:none}vt-checkbox .mat-mdc-checkbox.checkbox-error .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--color-state-error)!important}\n"] }]
        }], propDecorators: { indeterminate: [{ type: i0.Input, args: [{ isSignal: true, alias: "indeterminate", required: false }] }, { type: i0.Output, args: ["indeterminateChange"] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], labelPosition: [{ type: i0.Input, args: [{ isSignal: true, alias: "labelPosition", required: false }] }], id: [{ type: i0.Input, args: [{ isSignal: true, alias: "id", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }], changed: [{ type: i0.Output, args: ["changed"] }] } });

class VoteyMultiSelectPopoverComponent {
    document = inject(DOCUMENT$1);
    host = inject((ElementRef));
    destroyRef = inject(DestroyRef);
    items = input([], ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    selectedIds = input([], ...(ngDevMode ? [{ debugName: "selectedIds" }] : /* istanbul ignore next */ []));
    triggerText = input.required(...(ngDevMode ? [{ debugName: "triggerText" }] : /* istanbul ignore next */ []));
    triggerIcon = input("", ...(ngDevMode ? [{ debugName: "triggerIcon" }] : /* istanbul ignore next */ []));
    triggerVariant = input("link", ...(ngDevMode ? [{ debugName: "triggerVariant" }] : /* istanbul ignore next */ []));
    confirmText = input.required(...(ngDevMode ? [{ debugName: "confirmText" }] : /* istanbul ignore next */ []));
    cancelText = input("", ...(ngDevMode ? [{ debugName: "cancelText" }] : /* istanbul ignore next */ []));
    emptyText = input("", ...(ngDevMode ? [{ debugName: "emptyText" }] : /* istanbul ignore next */ []));
    ariaLabel = input.required(...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    dataCy = input(null, ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    confirmed = output();
    dismissed = output();
    isOpen = signal(false, ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
    itemControls = signal({}, ...(ngDevMode ? [{ debugName: "itemControls" }] : /* istanbul ignore next */ []));
    hasItems = computed(() => this.items().length > 0, ...(ngDevMode ? [{ debugName: "hasItems" }] : /* istanbul ignore next */ []));
    currentTriggerIcon = computed(() => (this.isOpen() ? "ui-close" : this.triggerIcon()), ...(ngDevMode ? [{ debugName: "currentTriggerIcon" }] : /* istanbul ignore next */ []));
    draftSelectedIds = signal(new Set(), ...(ngDevMode ? [{ debugName: "draftSelectedIds" }] : /* istanbul ignore next */ []));
    handlePointerDown = (event) => this.handleOutsidePointerDown(event);
    constructor() {
        this.destroyRef.onDestroy(() => this.document.removeEventListener("pointerdown", this.handlePointerDown, true));
    }
    toggle() {
        if (this.isOpen()) {
            this.close();
            return;
        }
        this.open();
    }
    toggleItem(item, checked) {
        if (item.disabled)
            return;
        const selectedIds = new Set(this.draftSelectedIds());
        if (checked)
            selectedIds.add(item.id);
        else
            selectedIds.delete(item.id);
        this.draftSelectedIds.set(selectedIds);
    }
    confirm() {
        const selectedIds = this.items()
            .filter((item) => this.draftSelectedIds().has(item.id))
            .map((item) => item.id);
        this.confirmed.emit(selectedIds);
        this.close();
    }
    dismiss() {
        if (!this.isOpen())
            return;
        this.close();
        this.dismissed.emit();
    }
    handlePanelKeydown(event) {
        if (event.key !== "Escape")
            return;
        event.preventDefault();
        event.stopPropagation();
        this.dismiss();
    }
    open() {
        const availableItemIds = new Set(this.items().map((item) => item.id));
        const selectedIds = new Set(this.selectedIds().filter((id) => availableItemIds.has(id)));
        this.draftSelectedIds.set(selectedIds);
        this.itemControls.set(this.createItemControls(selectedIds));
        this.isOpen.set(true);
        this.document.addEventListener("pointerdown", this.handlePointerDown, true);
    }
    close() {
        this.document.removeEventListener("pointerdown", this.handlePointerDown, true);
        this.isOpen.set(false);
    }
    createItemControls(selectedIds) {
        return this.items().reduce((controls, item) => ({
            ...controls,
            [item.id]: new FormControl({ value: selectedIds.has(item.id), disabled: item.disabled === true }, { nonNullable: true }),
        }), {});
    }
    handleOutsidePointerDown(event) {
        const target = event.target;
        if (!(target instanceof Node) || this.host.nativeElement.contains(target))
            return;
        this.dismiss();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyMultiSelectPopoverComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyMultiSelectPopoverComponent, isStandalone: true, selector: "vt-multi-select-popover", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, selectedIds: { classPropertyName: "selectedIds", publicName: "selectedIds", isSignal: true, isRequired: false, transformFunction: null }, triggerText: { classPropertyName: "triggerText", publicName: "triggerText", isSignal: true, isRequired: true, transformFunction: null }, triggerIcon: { classPropertyName: "triggerIcon", publicName: "triggerIcon", isSignal: true, isRequired: false, transformFunction: null }, triggerVariant: { classPropertyName: "triggerVariant", publicName: "triggerVariant", isSignal: true, isRequired: false, transformFunction: null }, confirmText: { classPropertyName: "confirmText", publicName: "confirmText", isSignal: true, isRequired: true, transformFunction: null }, cancelText: { classPropertyName: "cancelText", publicName: "cancelText", isSignal: true, isRequired: false, transformFunction: null }, emptyText: { classPropertyName: "emptyText", publicName: "emptyText", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: true, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { confirmed: "confirmed", dismissed: "dismissed" }, ngImport: i0, template: "<div\r\n  class=\"multi-select-popover-wrapper\"\r\n  (keydown)=\"handlePanelKeydown($event)\"\r\n>\r\n  <vt-button\r\n    ariaHasPopup=\"dialog\"\r\n    [text]=\"triggerText()\"\r\n    [ico]=\"currentTriggerIcon()\"\r\n    [variant]=\"triggerVariant()\"\r\n    [ariaExpanded]=\"isOpen()\"\r\n    (pressed)=\"toggle()\"\r\n  />\r\n\r\n  @if (isOpen()) {\r\n  <div\r\n    class=\"panel\"\r\n    role=\"dialog\"\r\n    [attr.aria-label]=\"ariaLabel() | vtTranslate\"\r\n    [attr.data-cy]=\"dataCy()\"\r\n  >\r\n    @if (hasItems()) {\r\n    <ul\r\n      class=\"items\"\r\n      role=\"group\"\r\n      [attr.aria-label]=\"ariaLabel() | vtTranslate\"\r\n    >\r\n      @for (item of items(); track item.id) {\r\n      <li class=\"item\" [class.disabled]=\"item.disabled === true\">\r\n        <vt-checkbox\r\n          [control]=\"itemControls()[item.id]\"\r\n          (changed)=\"toggleItem(item, $event)\"\r\n        >\r\n          {{ item.label }}\r\n        </vt-checkbox>\r\n      </li>\r\n      }\r\n    </ul>\r\n    } @else if (emptyText()) {\r\n    <div class=\"empty\">\r\n      <vt-text\r\n        variant=\"body\"\r\n        color=\"muted\"\r\n        [content]=\"emptyText() | vtTranslate\"\r\n      />\r\n    </div>\r\n    }\r\n\r\n    <div class=\"actions\">\r\n      @if (cancelText()) {\r\n      <vt-button\r\n        variant=\"secondary\"\r\n        [text]=\"cancelText()\"\r\n        (pressed)=\"dismiss()\"\r\n      />\r\n      }\r\n      <vt-button\r\n        [disabled]=\"!hasItems()\"\r\n        [text]=\"confirmText()\"\r\n        (pressed)=\"confirm()\"\r\n      />\r\n    </div>\r\n  </div>\r\n  }\r\n</div>\r\n", styles: [":host{display:inline-block;max-width:100%}.multi-select-popover-wrapper{position:relative;display:inline-flex}.multi-select-popover-wrapper .panel{position:absolute;right:0;bottom:calc(-1 * var(--spacing-8));z-index:100;display:flex;flex-direction:column;width:340px;max-width:min(340px,100vw - var(--spacing-48));max-height:min(620px,52dvh);overflow:hidden;border-radius:var(--radius-xl);background-color:var(--color-bg-surface-raised);box-shadow:0 var(--spacing-2) var(--spacing-8) color-mix(in srgb,var(--color-text-primary) 12%,transparent);transform:translateY(100%)}.multi-select-popover-wrapper .panel .items{min-height:0;margin:0;padding:var(--spacing-24) 0;overflow-y:auto;overscroll-behavior:contain;list-style:none}.multi-select-popover-wrapper .panel .items .item{display:flex;align-items:center;min-height:50px;padding:0 var(--spacing-24)}.multi-select-popover-wrapper .panel .items .item:hover:not(.disabled){background-color:var(--color-bg-surface-tint)}.multi-select-popover-wrapper .panel .items .item vt-checkbox{width:100%}.multi-select-popover-wrapper .panel .empty{margin:0;padding:var(--spacing-32) var(--spacing-24);text-align:center}.multi-select-popover-wrapper .panel .actions{display:flex;flex-wrap:wrap;flex-shrink:0;justify-content:center;gap:var(--spacing-8);padding:var(--spacing-8) var(--spacing-24) var(--spacing-24)}\n"], dependencies: [{ kind: "component", type: VoteyButtonComponent, selector: "vt-button", inputs: ["disabled", "type", "variant", "size", "text", "ariaLabel", "ico", "badge", "tooltipText", "disabledNote", "ariaExpanded", "ariaHasPopup", "ariaControls", "iconColor"], outputs: ["pressed"] }, { kind: "component", type: VoteyCheckboxComponent, selector: "vt-checkbox", inputs: ["indeterminate", "disabled", "required", "error", "label", "labelPosition", "id", "name", "value", "ignoredErrors"], outputs: ["indeterminateChange", "changed"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyMultiSelectPopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-multi-select-popover", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        VoteyButtonComponent,
                        VoteyCheckboxComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "<div\r\n  class=\"multi-select-popover-wrapper\"\r\n  (keydown)=\"handlePanelKeydown($event)\"\r\n>\r\n  <vt-button\r\n    ariaHasPopup=\"dialog\"\r\n    [text]=\"triggerText()\"\r\n    [ico]=\"currentTriggerIcon()\"\r\n    [variant]=\"triggerVariant()\"\r\n    [ariaExpanded]=\"isOpen()\"\r\n    (pressed)=\"toggle()\"\r\n  />\r\n\r\n  @if (isOpen()) {\r\n  <div\r\n    class=\"panel\"\r\n    role=\"dialog\"\r\n    [attr.aria-label]=\"ariaLabel() | vtTranslate\"\r\n    [attr.data-cy]=\"dataCy()\"\r\n  >\r\n    @if (hasItems()) {\r\n    <ul\r\n      class=\"items\"\r\n      role=\"group\"\r\n      [attr.aria-label]=\"ariaLabel() | vtTranslate\"\r\n    >\r\n      @for (item of items(); track item.id) {\r\n      <li class=\"item\" [class.disabled]=\"item.disabled === true\">\r\n        <vt-checkbox\r\n          [control]=\"itemControls()[item.id]\"\r\n          (changed)=\"toggleItem(item, $event)\"\r\n        >\r\n          {{ item.label }}\r\n        </vt-checkbox>\r\n      </li>\r\n      }\r\n    </ul>\r\n    } @else if (emptyText()) {\r\n    <div class=\"empty\">\r\n      <vt-text\r\n        variant=\"body\"\r\n        color=\"muted\"\r\n        [content]=\"emptyText() | vtTranslate\"\r\n      />\r\n    </div>\r\n    }\r\n\r\n    <div class=\"actions\">\r\n      @if (cancelText()) {\r\n      <vt-button\r\n        variant=\"secondary\"\r\n        [text]=\"cancelText()\"\r\n        (pressed)=\"dismiss()\"\r\n      />\r\n      }\r\n      <vt-button\r\n        [disabled]=\"!hasItems()\"\r\n        [text]=\"confirmText()\"\r\n        (pressed)=\"confirm()\"\r\n      />\r\n    </div>\r\n  </div>\r\n  }\r\n</div>\r\n", styles: [":host{display:inline-block;max-width:100%}.multi-select-popover-wrapper{position:relative;display:inline-flex}.multi-select-popover-wrapper .panel{position:absolute;right:0;bottom:calc(-1 * var(--spacing-8));z-index:100;display:flex;flex-direction:column;width:340px;max-width:min(340px,100vw - var(--spacing-48));max-height:min(620px,52dvh);overflow:hidden;border-radius:var(--radius-xl);background-color:var(--color-bg-surface-raised);box-shadow:0 var(--spacing-2) var(--spacing-8) color-mix(in srgb,var(--color-text-primary) 12%,transparent);transform:translateY(100%)}.multi-select-popover-wrapper .panel .items{min-height:0;margin:0;padding:var(--spacing-24) 0;overflow-y:auto;overscroll-behavior:contain;list-style:none}.multi-select-popover-wrapper .panel .items .item{display:flex;align-items:center;min-height:50px;padding:0 var(--spacing-24)}.multi-select-popover-wrapper .panel .items .item:hover:not(.disabled){background-color:var(--color-bg-surface-tint)}.multi-select-popover-wrapper .panel .items .item vt-checkbox{width:100%}.multi-select-popover-wrapper .panel .empty{margin:0;padding:var(--spacing-32) var(--spacing-24);text-align:center}.multi-select-popover-wrapper .panel .actions{display:flex;flex-wrap:wrap;flex-shrink:0;justify-content:center;gap:var(--spacing-8);padding:var(--spacing-8) var(--spacing-24) var(--spacing-24)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], selectedIds: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectedIds", required: false }] }], triggerText: [{ type: i0.Input, args: [{ isSignal: true, alias: "triggerText", required: true }] }], triggerIcon: [{ type: i0.Input, args: [{ isSignal: true, alias: "triggerIcon", required: false }] }], triggerVariant: [{ type: i0.Input, args: [{ isSignal: true, alias: "triggerVariant", required: false }] }], confirmText: [{ type: i0.Input, args: [{ isSignal: true, alias: "confirmText", required: true }] }], cancelText: [{ type: i0.Input, args: [{ isSignal: true, alias: "cancelText", required: false }] }], emptyText: [{ type: i0.Input, args: [{ isSignal: true, alias: "emptyText", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: true }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], confirmed: [{ type: i0.Output, args: ["confirmed"] }], dismissed: [{ type: i0.Output, args: ["dismissed"] }] } });

const VoteyFilePickerValidationErrors = [
    "invalidType",
    "fileTooLarge",
    "totalTooLarge",
    "tooManyFiles",
];
const defaultMaxFileSizeBytes = 25 * 1024 * 1024;
const defaultMaxTotalSizeBytes = 250 * 1024 * 1024;
const fileIconByExtension = {
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
const filePickerVariants = ["compact", "dropzone"];
const filePickerFileStates = ["done", "pending", "uploading", "error"];
const defaultValidationErrorKeys = {
    invalidType: "ERRORS.FILE_PICKER_INVALID_TYPE",
    fileTooLarge: "ERRORS.FILE_PICKER_FILE_TOO_LARGE",
    totalTooLarge: "ERRORS.FILE_PICKER_TOTAL_TOO_LARGE",
    tooManyFiles: "ERRORS.FILE_PICKER_TOO_MANY_FILES",
};
function optionalNonNegativeNumber(value) {
    if (value === null || value === undefined || value === "")
        return null;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue >= 0
        ? numericValue
        : null;
}
function nonNegativeNumber(value) {
    return optionalNonNegativeNumber(value) ?? 0;
}
function progressNumber(value) {
    const numericValue = optionalNonNegativeNumber(value);
    return numericValue === null ? null : Math.min(numericValue, 100);
}
class VoteyFilePickerComponent extends VoteyFormControlApplyDirective {
    variantNames = {
        compact: filePickerVariants[0],
        dropzone: filePickerVariants[1],
    };
    fileStateNames = {
        done: filePickerFileStates[0],
        pending: filePickerFileStates[1],
        uploading: filePickerFileStates[2],
        error: filePickerFileStates[3],
    };
    variant = input("compact", ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    filename = input("", ...(ngDevMode ? [{ debugName: "filename" }] : /* istanbul ignore next */ []));
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    emptyText = input("NO_FILE_SELECTED", ...(ngDevMode ? [{ debugName: "emptyText" }] : /* istanbul ignore next */ []));
    actionText = input("BUTTON.CHOOSE_FILE", ...(ngDevMode ? [{ debugName: "actionText" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    progress = input(null, { ...(ngDevMode ? { debugName: "progress" } : /* istanbul ignore next */ {}), transform: progressNumber });
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    accept = input("", ...(ngDevMode ? [{ debugName: "accept" }] : /* istanbul ignore next */ []));
    capture = input("", ...(ngDevMode ? [{ debugName: "capture" }] : /* istanbul ignore next */ []));
    dataCy = input("", ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    multiple = input(false, { ...(ngDevMode ? { debugName: "multiple" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    dropEnabled = input(true, { ...(ngDevMode ? { debugName: "dropEnabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    clearable = input(true, { ...(ngDevMode ? { debugName: "clearable" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    clearText = input("BUTTON.DELETE", ...(ngDevMode ? [{ debugName: "clearText" }] : /* istanbul ignore next */ []));
    loadingText = input("LOADING", ...(ngDevMode ? [{ debugName: "loadingText" }] : /* istanbul ignore next */ []));
    dropzoneTitle = input("MESSAGE.FILE_PICKER_DROPZONE_PROMPT", ...(ngDevMode ? [{ debugName: "dropzoneTitle" }] : /* istanbul ignore next */ []));
    dropzoneHint = input("MESSAGE.FILE_PICKER_DROPZONE_HINT", ...(ngDevMode ? [{ debugName: "dropzoneHint" }] : /* istanbul ignore next */ []));
    dropzoneActionText = input("BUTTON.CHOOSE_FILES", ...(ngDevMode ? [{ debugName: "dropzoneActionText" }] : /* istanbul ignore next */ []));
    doneText = input("MESSAGE.FILE_PICKER_DONE", ...(ngDevMode ? [{ debugName: "doneText" }] : /* istanbul ignore next */ []));
    pendingText = input("MESSAGE.FILE_PICKER_PENDING", ...(ngDevMode ? [{ debugName: "pendingText" }] : /* istanbul ignore next */ []));
    previewText = input("BUTTON.PREVIEW_FILE", ...(ngDevMode ? [{ debugName: "previewText" }] : /* istanbul ignore next */ []));
    uploadErrorText = input("ERRORS.FILE_UPLOAD_FAILED", ...(ngDevMode ? [{ debugName: "uploadErrorText" }] : /* istanbul ignore next */ []));
    retryText = input("BUTTON.TRY_AGAIN", ...(ngDevMode ? [{ debugName: "retryText" }] : /* istanbul ignore next */ []));
    cancelText = input("BUTTON.CANCEL", ...(ngDevMode ? [{ debugName: "cancelText" }] : /* istanbul ignore next */ []));
    files = input(null, ...(ngDevMode ? [{ debugName: "files" }] : /* istanbul ignore next */ []));
    allowedExtensions = input([], ...(ngDevMode ? [{ debugName: "allowedExtensions" }] : /* istanbul ignore next */ []));
    allowedMimeTypes = input([], ...(ngDevMode ? [{ debugName: "allowedMimeTypes" }] : /* istanbul ignore next */ []));
    maxFileSizeBytes = input(defaultMaxFileSizeBytes, { ...(ngDevMode ? { debugName: "maxFileSizeBytes" } : /* istanbul ignore next */ {}), transform: optionalNonNegativeNumber });
    maxTotalSizeBytes = input(defaultMaxTotalSizeBytes, { ...(ngDevMode ? { debugName: "maxTotalSizeBytes" } : /* istanbul ignore next */ {}), transform: optionalNonNegativeNumber });
    currentTotalSizeBytes = input(0, { ...(ngDevMode ? { debugName: "currentTotalSizeBytes" } : /* istanbul ignore next */ {}), transform: nonNegativeNumber });
    maxFiles = input(null, { ...(ngDevMode ? { debugName: "maxFiles" } : /* istanbul ignore next */ {}), transform: optionalNonNegativeNumber });
    currentFilesCount = input(0, { ...(ngDevMode ? { debugName: "currentFilesCount" } : /* istanbul ignore next */ {}), transform: nonNegativeNumber });
    validationErrorKeys = input({}, ...(ngDevMode ? [{ debugName: "validationErrorKeys" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    changed = output();
    filesChanged = output();
    cleared = output();
    cancelled = output();
    rejected = output();
    fileRemoved = output();
    fileRetry = output();
    fileCancelled = output();
    filePreview = output();
    fileInput = viewChild("fileInput", ...(ngDevMode ? [{ debugName: "fileInput" }] : /* istanbul ignore next */ []));
    formDisabled = signal(false, ...(ngDevMode ? [{ debugName: "formDisabled" }] : /* istanbul ignore next */ []));
    formControlStateVersion = signal(0, ...(ngDevMode ? [{ debugName: "formControlStateVersion" }] : /* istanbul ignore next */ []));
    selectedFiles = signal([], ...(ngDevMode ? [{ debugName: "selectedFiles" }] : /* istanbul ignore next */ []));
    dragDepth = signal(0, ...(ngDevMode ? [{ debugName: "dragDepth" }] : /* istanbul ignore next */ []));
    formControlEventsSubscription;
    hasFile = computed(() => this.selectedFiles().length > 0 || this.filename().trim().length > 0, ...(ngDevMode ? [{ debugName: "hasFile" }] : /* istanbul ignore next */ []));
    resolvedFilename = computed(() => this.selectedFiles()
        .map((file) => file.name)
        .join(", ") || this.filename().trim(), ...(ngDevMode ? [{ debugName: "resolvedFilename" }] : /* istanbul ignore next */ []));
    resolvedFileIcon = computed(() => this.getFileIcon(this.selectedFiles()[0]?.name ?? this.filename()), ...(ngDevMode ? [{ debugName: "resolvedFileIcon" }] : /* istanbul ignore next */ []));
    isDragging = computed(() => this.dragDepth() > 0, ...(ngDevMode ? [{ debugName: "isDragging" }] : /* istanbul ignore next */ []));
    isLoading = computed(() => this.loading() || this.progress() !== null, ...(ngDevMode ? [{ debugName: "isLoading" }] : /* istanbul ignore next */ []));
    isDropzone = computed(() => this.variant() === this.variantNames.dropzone, ...(ngDevMode ? [{ debugName: "isDropzone" }] : /* istanbul ignore next */ []));
    dropzoneHintParams = computed(() => ({
        formats: this.resolvedAcceptedFormats(),
        maxSize: this.resolvedMaxFileSize(),
    }), ...(ngDevMode ? [{ debugName: "dropzoneHintParams" }] : /* istanbul ignore next */ []));
    effectiveMultiple = computed(() => this.isDropzone(), ...(ngDevMode ? [{ debugName: "effectiveMultiple" }] : /* istanbul ignore next */ []));
    displayedFiles = computed(() => this.files() ??
        this.selectedFiles().map((file, index) => this.toFilePickerFile(file, index)), ...(ngDevMode ? [{ debugName: "displayedFiles" }] : /* istanbul ignore next */ []));
    effectiveDisabled = computed(() => this.disabled() ||
        this.formDisabled() ||
        (!this.isDropzone() && this.isLoading()), ...(ngDevMode ? [{ debugName: "effectiveDisabled" }] : /* istanbul ignore next */ []));
    isRequired = computed(() => {
        this.formControlStateVersion();
        return this.formControl.hasValidator(Validators.required);
    }, ...(ngDevMode ? [{ debugName: "isRequired" }] : /* istanbul ignore next */ []));
    resolvedAcceptedFormats = computed(() => {
        const acceptedValues = [
            ...this.allowedExtensions(),
            ...this.allowedMimeTypes(),
            ...this.accept().split(","),
        ];
        const formats = new Set();
        for (const value of acceptedValues) {
            const normalizedValue = value.trim();
            if (!normalizedValue)
                continue;
            const mimeParts = normalizedValue.split("/");
            const format = mimeParts[1] === "*"
                ? normalizedValue.toUpperCase()
                : (mimeParts[mimeParts.length - 1] ?? normalizedValue)
                    .replace(/^\./, "")
                    .toUpperCase();
            if (format)
                formats.add(format);
        }
        return [...formats].join(", ") || "*";
    }, ...(ngDevMode ? [{ debugName: "resolvedAcceptedFormats" }] : /* istanbul ignore next */ []));
    resolvedMaxFileSize = computed(() => {
        const maxFileSizeBytes = this.maxFileSizeBytes();
        if (maxFileSizeBytes === null)
            return "—";
        const megabytes = maxFileSizeBytes / (1024 * 1024);
        return megabytes >= 1
            ? `${Number(megabytes.toFixed(1)).toString().replace(".", ",")} MB`
            : `${Math.round(maxFileSizeBytes / 1024)} KB`;
    }, ...(ngDevMode ? [{ debugName: "resolvedMaxFileSize" }] : /* istanbul ignore next */ []));
    get errorKeys() {
        return this.formControl.invalid && this.formControl.touched
            ? Object.keys(this.formControl.errors ?? {})
            : [];
    }
    constructor() {
        super();
        this.observeFormControl();
    }
    set control(control) {
        super.control = control;
        if (control)
            this.observeFormControl();
    }
    ngOnDestroy() {
        this.formControlEventsSubscription?.unsubscribe();
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
    handleChange(event) {
        const inputElement = event.target;
        this.selectFiles(Array.from(inputElement.files ?? []));
    }
    handleDragEnter(event) {
        if (!this.canHandleFileDrag(event))
            return;
        event.preventDefault();
        this.dragDepth.update((depth) => depth + 1);
    }
    handleDragOver(event) {
        if (!this.canHandleFileDrag(event))
            return;
        event.preventDefault();
        if (event.dataTransfer)
            event.dataTransfer.dropEffect = "copy";
    }
    handleDragLeave(event) {
        if (!this.canHandleFileDrag(event))
            return;
        event.preventDefault();
        this.dragDepth.update((depth) => Math.max(depth - 1, 0));
    }
    handleDrop(event) {
        if (!this.dropEnabled() || this.effectiveDisabled())
            return;
        event.preventDefault();
        this.dragDepth.set(0);
        this.selectFiles(Array.from(event.dataTransfer?.files ?? []));
    }
    clear() {
        if (this.effectiveDisabled() || !this.hasFile())
            return;
        this.clearValidationErrors();
        this.selectedFiles.set([]);
        this.formControl.setValue(null);
        this.resetNativeInput();
        this.changed.emit(null);
        this.filesChanged.emit([]);
        this.cleared.emit();
    }
    handleFileRemoved(file) {
        if (this.effectiveDisabled())
            return;
        this.fileRemoved.emit(file);
        if (this.files() !== null)
            return;
        const remainingFiles = this.selectedFiles().filter((selectedFile, index) => this.getFilePickerFileId(selectedFile, index) !== file.id);
        this.commitFiles(remainingFiles);
    }
    handleFileRetry(file) {
        if (this.effectiveDisabled())
            return;
        this.fileRetry.emit(file);
    }
    handleFilePreview(file) {
        this.filePreview.emit(file);
    }
    handleFileCancelled(file) {
        if (this.effectiveDisabled())
            return;
        this.fileCancelled.emit(file);
    }
    handleFileAction(file) {
        if (file.state === this.fileStateNames.uploading) {
            this.handleFileCancelled(file);
            return;
        }
        this.handleFileRemoved(file);
    }
    handleDropzoneClick(event) {
        const target = event.target;
        if (target.closest("button"))
            return;
        this.open();
    }
    handleDropzoneKeydown(event) {
        const target = event.target;
        if (target.closest("button"))
            return;
        if (event.key !== "Enter" && event.key !== " ")
            return;
        event.preventDefault();
        this.open();
    }
    handleCancel() {
        this.cancelled.emit();
    }
    observeFormControl() {
        this.formControlEventsSubscription?.unsubscribe();
        this.formControlEventsSubscription = this.formControl.events.subscribe(() => this.syncFormControlState());
        this.syncFormControlState();
    }
    syncFormControlState() {
        const value = this.formControl.value;
        this.selectedFiles.set(value ? [value] : []);
        this.formDisabled.set(this.formControl.disabled);
        this.formControlStateVersion.update((version) => version + 1);
        if (!value)
            this.resetNativeInput();
    }
    resetNativeInput() {
        const inputElement = this.fileInput()?.nativeElement;
        if (inputElement)
            inputElement.value = "";
    }
    canHandleFileDrag(event) {
        return (this.dropEnabled() &&
            !this.effectiveDisabled() &&
            Array.from(event.dataTransfer?.types ?? []).includes("Files"));
    }
    selectFiles(files) {
        const incomingFiles = this.effectiveMultiple()
            ? files
            : files.slice(0, 1);
        if (!incomingFiles.length) {
            if (this.isDropzone())
                return;
            this.commitFiles([]);
            return;
        }
        const selectedFiles = this.isDropzone()
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
    getValidationErrors(files) {
        const errors = new Set();
        const allowedExtensions = this.allowedExtensions()
            .map((extension) => extension.trim().toLowerCase().replace(/^\./, ""))
            .filter(Boolean);
        const allowedMimeTypes = this.allowedMimeTypes()
            .map((mimeType) => mimeType.trim().toLowerCase())
            .filter(Boolean);
        const hasTypeRestriction = allowedExtensions.length > 0 || allowedMimeTypes.length > 0;
        const maxFileSizeBytes = this.maxFileSizeBytes();
        const maxTotalSizeBytes = this.maxTotalSizeBytes();
        const maxFiles = this.maxFiles();
        if (hasTypeRestriction &&
            files.some((file) => !this.isAllowedFile(file, allowedExtensions, allowedMimeTypes))) {
            errors.add("invalidType");
        }
        if (maxFileSizeBytes !== null &&
            files.some((file) => file.size > maxFileSizeBytes)) {
            errors.add("fileTooLarge");
        }
        const selectedFilesSizeBytes = files.reduce((total, file) => total + file.size, 0);
        if (maxTotalSizeBytes !== null &&
            this.currentTotalSizeBytes() + selectedFilesSizeBytes > maxTotalSizeBytes) {
            errors.add("totalTooLarge");
        }
        if (maxFiles !== null &&
            this.currentFilesCount() + files.length > Math.floor(maxFiles)) {
            errors.add("tooManyFiles");
        }
        return [...errors];
    }
    isAllowedFile(file, allowedExtensions, allowedMimeTypes) {
        const extension = file.name.trim().toLowerCase().split(".").pop() ?? "";
        const mimeType = file.type.trim().toLowerCase();
        return (allowedExtensions.includes(extension) ||
            allowedMimeTypes.some((allowedMimeType) => allowedMimeType === mimeType ||
                (allowedMimeType.endsWith("/*") &&
                    mimeType.startsWith(allowedMimeType.slice(0, -1)))));
    }
    applyValidationErrors(errors) {
        const formErrors = this.withoutFilePickerErrors(this.formControl.errors);
        for (const error of errors) {
            formErrors[this.getValidationErrorKey(error)] = true;
        }
        this.formControl.setErrors(formErrors);
        this.formControl.markAsTouched();
    }
    clearValidationErrors() {
        const formErrors = this.withoutFilePickerErrors(this.formControl.errors);
        this.formControl.setErrors(Object.keys(formErrors).length > 0 ? formErrors : null);
    }
    withoutFilePickerErrors(errors) {
        const filePickerErrorKeys = new Set([
            ...Object.values(defaultValidationErrorKeys),
            ...Object.values(this.validationErrorKeys()).filter((errorKey) => Boolean(errorKey)),
        ]);
        return Object.entries(errors ?? {}).reduce((filteredErrors, [errorKey, errorValue]) => {
            if (!filePickerErrorKeys.has(errorKey)) {
                filteredErrors[errorKey] = errorValue;
            }
            return filteredErrors;
        }, {});
    }
    getValidationErrorKey(error) {
        return (this.validationErrorKeys()[error] ?? defaultValidationErrorKeys[error]);
    }
    commitFiles(files) {
        const value = files[0] ?? null;
        const hasValueChanged = this.formControl.value !== value;
        if (hasValueChanged)
            this.formControl.setValue(value);
        this.selectedFiles.set(files);
        if (hasValueChanged)
            this.changed.emit(value);
        this.filesChanged.emit(files);
    }
    toFilePickerFile(file, index) {
        return {
            id: this.getFilePickerFileId(file, index),
            filename: file.name,
            meta: this.formatFileSize(file.size),
            state: this.fileStateNames.done,
            icon: this.getFileIcon(file.name),
            statusText: this.doneText(),
        };
    }
    getFileIcon(filename) {
        const extension = filename.trim().toLowerCase().split(".").pop() ?? "";
        return fileIconByExtension[extension] ?? "ui-file-txt";
    }
    getFilePickerFileId(file, index) {
        return `${file.name}-${file.size}-${file.lastModified}-${index}`;
    }
    formatFileSize(size) {
        if (size < 1024)
            return `${size} B`;
        const sizeInKilobytes = size / 1024;
        if (sizeInKilobytes < 1024) {
            return `${sizeInKilobytes.toFixed(1).replace(".", ",")} KB`;
        }
        return `${(sizeInKilobytes / 1024).toFixed(1).replace(".", ",")} MB`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFilePickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyFilePickerComponent, isStandalone: true, selector: "vt-file-picker", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, filename: { classPropertyName: "filename", publicName: "filename", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, emptyText: { classPropertyName: "emptyText", publicName: "emptyText", isSignal: true, isRequired: false, transformFunction: null }, actionText: { classPropertyName: "actionText", publicName: "actionText", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, progress: { classPropertyName: "progress", publicName: "progress", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, accept: { classPropertyName: "accept", publicName: "accept", isSignal: true, isRequired: false, transformFunction: null }, capture: { classPropertyName: "capture", publicName: "capture", isSignal: true, isRequired: false, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null }, multiple: { classPropertyName: "multiple", publicName: "multiple", isSignal: true, isRequired: false, transformFunction: null }, dropEnabled: { classPropertyName: "dropEnabled", publicName: "dropEnabled", isSignal: true, isRequired: false, transformFunction: null }, clearable: { classPropertyName: "clearable", publicName: "clearable", isSignal: true, isRequired: false, transformFunction: null }, clearText: { classPropertyName: "clearText", publicName: "clearText", isSignal: true, isRequired: false, transformFunction: null }, loadingText: { classPropertyName: "loadingText", publicName: "loadingText", isSignal: true, isRequired: false, transformFunction: null }, dropzoneTitle: { classPropertyName: "dropzoneTitle", publicName: "dropzoneTitle", isSignal: true, isRequired: false, transformFunction: null }, dropzoneHint: { classPropertyName: "dropzoneHint", publicName: "dropzoneHint", isSignal: true, isRequired: false, transformFunction: null }, dropzoneActionText: { classPropertyName: "dropzoneActionText", publicName: "dropzoneActionText", isSignal: true, isRequired: false, transformFunction: null }, doneText: { classPropertyName: "doneText", publicName: "doneText", isSignal: true, isRequired: false, transformFunction: null }, pendingText: { classPropertyName: "pendingText", publicName: "pendingText", isSignal: true, isRequired: false, transformFunction: null }, previewText: { classPropertyName: "previewText", publicName: "previewText", isSignal: true, isRequired: false, transformFunction: null }, uploadErrorText: { classPropertyName: "uploadErrorText", publicName: "uploadErrorText", isSignal: true, isRequired: false, transformFunction: null }, retryText: { classPropertyName: "retryText", publicName: "retryText", isSignal: true, isRequired: false, transformFunction: null }, cancelText: { classPropertyName: "cancelText", publicName: "cancelText", isSignal: true, isRequired: false, transformFunction: null }, files: { classPropertyName: "files", publicName: "files", isSignal: true, isRequired: false, transformFunction: null }, allowedExtensions: { classPropertyName: "allowedExtensions", publicName: "allowedExtensions", isSignal: true, isRequired: false, transformFunction: null }, allowedMimeTypes: { classPropertyName: "allowedMimeTypes", publicName: "allowedMimeTypes", isSignal: true, isRequired: false, transformFunction: null }, maxFileSizeBytes: { classPropertyName: "maxFileSizeBytes", publicName: "maxFileSizeBytes", isSignal: true, isRequired: false, transformFunction: null }, maxTotalSizeBytes: { classPropertyName: "maxTotalSizeBytes", publicName: "maxTotalSizeBytes", isSignal: true, isRequired: false, transformFunction: null }, currentTotalSizeBytes: { classPropertyName: "currentTotalSizeBytes", publicName: "currentTotalSizeBytes", isSignal: true, isRequired: false, transformFunction: null }, maxFiles: { classPropertyName: "maxFiles", publicName: "maxFiles", isSignal: true, isRequired: false, transformFunction: null }, currentFilesCount: { classPropertyName: "currentFilesCount", publicName: "currentFilesCount", isSignal: true, isRequired: false, transformFunction: null }, validationErrorKeys: { classPropertyName: "validationErrorKeys", publicName: "validationErrorKeys", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { changed: "changed", filesChanged: "filesChanged", cleared: "cleared", cancelled: "cancelled", rejected: "rejected", fileRemoved: "fileRemoved", fileRetry: "fileRetry", fileCancelled: "fileCancelled", filePreview: "filePreview" }, viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div\r\n  class=\"file-picker-wrapper\"\r\n  [class.compact]=\"!isDropzone()\"\r\n  [class.dropzone]=\"isDropzone()\"\r\n  [class.disabled]=\"effectiveDisabled()\"\r\n  [class.filled]=\"hasFile()\"\r\n>\r\n  @if (label()) {\r\n  <vt-text variant=\"label\" color=\"primary\" [content]=\"label() | vtTranslate\" />\r\n  } @if (isDropzone()) {\r\n  <div\r\n    class=\"dropzone-field\"\r\n    role=\"group\"\r\n    [class.dragging]=\"isDragging()\"\r\n    [class.error]=\"errorKeys.length > 0\"\r\n    [class.filled]=\"displayedFiles().length > 0\"\r\n    [attr.aria-busy]=\"isLoading()\"\r\n    [attr.aria-disabled]=\"effectiveDisabled()\"\r\n    [attr.aria-label]=\"dropzoneTitle() | vtTranslate\"\r\n    [attr.tabindex]=\"effectiveDisabled() ? -1 : 0\"\r\n    (click)=\"handleDropzoneClick($event)\"\r\n    (keydown)=\"handleDropzoneKeydown($event)\"\r\n    (dragenter)=\"handleDragEnter($event)\"\r\n    (dragover)=\"handleDragOver($event)\"\r\n    (dragleave)=\"handleDragLeave($event)\"\r\n    (drop)=\"handleDrop($event)\"\r\n  >\r\n    @if (displayedFiles().length) {\r\n    <div class=\"file-list\">\r\n      @for (file of displayedFiles(); track file.id) {\r\n      <div\r\n        class=\"file-row\"\r\n        [class.uploading]=\"file.state === fileStateNames.uploading\"\r\n      >\r\n        <vt-button\r\n          class=\"file-preview-trigger file-tile\"\r\n          variant=\"ghost\"\r\n          [ico]=\"file.icon || 'ui-file-txt'\"\r\n          [tooltipText]=\"previewText()\"\r\n          (pressed)=\"handleFilePreview(file)\"\r\n        />\r\n\r\n        <div class=\"file-content\">\r\n          <div class=\"file-heading\">\r\n            <span class=\"file-name\">\r\n              <vt-button\r\n                class=\"file-preview-trigger file-preview-name\"\r\n                variant=\"link\"\r\n                size=\"small\"\r\n                [text]=\"file.filename\"\r\n                [tooltipText]=\"previewText()\"\r\n                (pressed)=\"handleFilePreview(file)\"\r\n              />\r\n            </span>\r\n            @if (file.meta) {\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.meta | vtTranslate\"\r\n            />\r\n            }\r\n          </div>\r\n\r\n          @if ( file.state === fileStateNames.uploading || file.state ===\r\n          fileStateNames.error ) {\r\n          <progress\r\n            class=\"file-progress\"\r\n            [class.error]=\"file.state === fileStateNames.error\"\r\n            [value]=\"file.progress ?? 0\"\r\n            max=\"100\"\r\n          ></progress>\r\n          } @if (file.state === fileStateNames.done || !file.state) {\r\n          <div class=\"file-status done\">\r\n            <span class=\"status-icon\"><vt-icon ico=\"sp-check\" /></span>\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"accent\"\r\n              [content]=\"file.statusText || doneText() | vtTranslate\"\r\n            />\r\n          </div>\r\n          } @else if (file.state === fileStateNames.pending) {\r\n          <div class=\"file-status pending\">\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.statusText || pendingText() | vtTranslate\"\r\n            />\r\n          </div>\r\n          } @else if (file.state === fileStateNames.uploading) {\r\n          <div class=\"file-status uploading\">\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.statusText || loadingText() | vtTranslate\"\r\n            />\r\n            @if (file.speed) {\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.speed | vtTranslate\"\r\n            />\r\n            }\r\n          </div>\r\n          } @else {\r\n          <div class=\"file-status error\">\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"error\"\r\n              [content]=\"file.statusText || uploadErrorText() | vtTranslate\"\r\n            />\r\n            <vt-button\r\n              variant=\"link\"\r\n              size=\"small\"\r\n              [text]=\"retryText()\"\r\n              [disabled]=\"effectiveDisabled()\"\r\n              (pressed)=\"handleFileRetry(file)\"\r\n            />\r\n          </div>\r\n          }\r\n        </div>\r\n\r\n        <vt-button\r\n          variant=\"secondary\"\r\n          size=\"small\"\r\n          [ico]=\"\r\n            file.state === fileStateNames.done ||\r\n            file.state === fileStateNames.pending ||\r\n            !file.state\r\n              ? 'ui-delete'\r\n              : 'ui-close-v2'\r\n          \"\r\n          [tooltipText]=\"\r\n            file.state === fileStateNames.uploading ? cancelText() : clearText()\r\n          \"\r\n          [disabled]=\"effectiveDisabled()\"\r\n          (pressed)=\"handleFileAction(file)\"\r\n        />\r\n      </div>\r\n      }\r\n    </div>\r\n    <vt-button\r\n      variant=\"secondary\"\r\n      size=\"small\"\r\n      [text]=\"dropzoneActionText()\"\r\n      [disabled]=\"effectiveDisabled()\"\r\n      (pressed)=\"open()\"\r\n    />\r\n    } @else {\r\n    <div class=\"dropzone-prompt\">\r\n      <vt-text\r\n        variant=\"body\"\r\n        color=\"primary\"\r\n        [content]=\"dropzoneTitle() | vtTranslate\"\r\n      />\r\n      <vt-text\r\n        variant=\"caption\"\r\n        color=\"muted\"\r\n        [content]=\"dropzoneHint() | vtTranslate : dropzoneHintParams()\"\r\n      />\r\n      <vt-button\r\n        variant=\"secondary\"\r\n        size=\"small\"\r\n        [text]=\"dropzoneActionText()\"\r\n        [disabled]=\"effectiveDisabled()\"\r\n        (pressed)=\"open()\"\r\n      />\r\n    </div>\r\n    }\r\n  </div>\r\n  } @else {\r\n  <div class=\"row\" [class.loading]=\"isLoading()\" [attr.aria-busy]=\"isLoading()\">\r\n    <div\r\n      class=\"file-box\"\r\n      [class.dragging]=\"isDragging()\"\r\n      aria-live=\"polite\"\r\n      [attr.title]=\"resolvedFilename()\"\r\n      (dragenter)=\"handleDragEnter($event)\"\r\n      (dragover)=\"handleDragOver($event)\"\r\n      (dragleave)=\"handleDragLeave($event)\"\r\n      (drop)=\"handleDrop($event)\"\r\n    >\r\n      @if (isLoading()) {\r\n      <div class=\"loading-state\" role=\"status\">\r\n        <span class=\"loading-spinner\" aria-hidden=\"true\"></span>\r\n        <vt-text\r\n          variant=\"caption\"\r\n          color=\"secondary\"\r\n          [content]=\"loadingText() | vtTranslate\"\r\n        />\r\n        @if (progress() !== null) {\r\n        <vt-text\r\n          variant=\"caption\"\r\n          color=\"secondary\"\r\n          [content]=\"progress() + '%'\"\r\n        />\r\n        }\r\n      </div>\r\n      } @else { @if (hasFile()) {\r\n      <span class=\"file-icon\" aria-hidden=\"true\">\r\n        <vt-icon [ico]=\"resolvedFileIcon()\" />\r\n      </span>\r\n      }\r\n      <span class=\"file-name\" [class.placeholder]=\"!hasFile()\">\r\n        <vt-text\r\n          variant=\"field\"\r\n          [color]=\"hasFile() ? 'primary' : 'muted'\"\r\n          [content]=\"\r\n            resolvedFilename()\r\n              ? resolvedFilename()\r\n              : (emptyText() | vtTranslate)\r\n          \"\r\n          [maxLines]=\"1\"\r\n        />\r\n      </span>\r\n      }\r\n    </div>\r\n\r\n    @if (!hasFile()) {\r\n    <vt-button\r\n      variant=\"link\"\r\n      size=\"small\"\r\n      [text]=\"actionText()\"\r\n      [disabled]=\"effectiveDisabled()\"\r\n      (pressed)=\"open()\"\r\n    />\r\n    } @if (clearable() && hasFile() && !isLoading()) {\r\n    <vt-button\r\n      class=\"compact-remove\"\r\n      variant=\"secondary\"\r\n      size=\"small\"\r\n      ico=\"ui-delete\"\r\n      [tooltipText]=\"clearText()\"\r\n      [disabled]=\"effectiveDisabled()\"\r\n      (pressed)=\"clear()\"\r\n    />\r\n    }\r\n  </div>\r\n  }\r\n\r\n  <input\r\n    #fileInput\r\n    type=\"file\"\r\n    hidden\r\n    [name]=\"name()\"\r\n    [disabled]=\"effectiveDisabled()\"\r\n    [required]=\"isRequired()\"\r\n    [attr.accept]=\"accept() || null\"\r\n    [attr.capture]=\"capture() || null\"\r\n    [attr.data-cy]=\"dataCy() || null\"\r\n    [multiple]=\"effectiveMultiple()\"\r\n    (change)=\"handleChange($event)\"\r\n    (cancel)=\"handleCancel()\"\r\n  />\r\n\r\n  <vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n</div>\r\n", styles: [":host{display:contents}.file-picker-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}.file-picker-wrapper.disabled .dropzone-field,.file-picker-wrapper.disabled .file-box{cursor:not-allowed}.file-picker-wrapper.compact .row{display:flex;align-items:center;gap:var(--space-icon-gap);width:100%}.file-picker-wrapper.compact .row .file-box{display:flex;flex:1 1 0;align-items:center;min-width:0;height:50px;box-sizing:border-box;padding:0 var(--space-field-padding-x);overflow:hidden;gap:var(--space-icon-gap);border:1px solid transparent;border-radius:var(--radius-m);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.compact .row .file-box .file-icon{display:block;flex:0 0 20px;width:20px;height:20px}.file-picker-wrapper.compact .row .file-box .file-name{flex:1 1 0;min-width:0;overflow:hidden}.file-picker-wrapper.compact .row .file-box .file-name ::ng-deep .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-picker-wrapper.compact .row .file-box .file-name.placeholder ::ng-deep .text{color:var(--color-text-placeholder)}.file-picker-wrapper.compact .row .file-box.dragging{border-color:var(--color-accent-primary)}.file-picker-wrapper.compact .row .file-box .loading-state{display:inline-flex;align-items:center;gap:var(--space-stack-gap-s);min-width:0}.file-picker-wrapper.compact .row .file-box .loading-spinner{flex:0 0 16px;width:16px;height:16px;border:2px solid var(--color-border-subtle);border-top-color:var(--color-accent-primary);border-radius:var(--radius-full);animation:file-picker-spin .7s linear infinite}.file-picker-wrapper.compact.filled .file-box{border-color:var(--color-border-field);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.compact.filled .compact-remove{flex:0 0 28px}.file-picker-wrapper.compact.filled .compact-remove ::ng-deep button{width:28px;height:28px;padding:0;border-radius:var(--radius-full)}.file-picker-wrapper.compact.disabled .file-name.placeholder ::ng-deep .text{color:var(--color-text-muted)}.file-picker-wrapper.dropzone .dropzone-field{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-stack-gap-m);width:100%;box-sizing:border-box;padding:var(--space-stack-gap-l) var(--space-card-padding);border:1.5px dashed var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);cursor:pointer;outline:none}.file-picker-wrapper.dropzone .dropzone-field:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}.file-picker-wrapper.dropzone .dropzone-field.dragging{border-width:2px;border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field.error{border-color:var(--color-state-error)}.file-picker-wrapper.dropzone .dropzone-field .dropzone-prompt{display:flex;flex-direction:column;align-items:center;gap:var(--space-icon-gap);width:100%;text-align:center}.file-picker-wrapper.dropzone .dropzone-field .file-list{display:flex;flex-direction:column;width:100%;overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row{display:flex;align-items:flex-start;gap:var(--space-icon-gap);width:100%;padding:var(--space-stack-gap-s) 0;border-bottom:1px solid var(--color-border-subtle)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger{min-width:0}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-tile{flex:0 0 44px;width:44px;height:44px}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-tile ::ng-deep button{width:44px;height:44px;padding:0;border-radius:var(--radius-s);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name{flex:1 1 0;min-width:0;overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep button{height:auto;min-height:0;padding:0;border:0;border-radius:0;background-color:transparent;color:var(--color-text-primary);font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height);text-align:left}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .button-wrapper,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep button,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .label{min-width:0;max-width:100%}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .button-wrapper,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep button{width:100%;justify-content:flex-start}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name:hover{text-decoration:underline}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-tile vt-icon{display:block;width:28px;height:28px}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-content{display:flex;flex:1 1 0;flex-direction:column;gap:var(--space-gap-3xs);min-width:0}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status{display:flex;align-items:center;gap:var(--space-stack-gap-s);width:100%;min-width:0}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading{overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading{align-items:baseline}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading .file-name{flex:1 1 0;min-width:0;overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading>vt-text{flex:0 0 auto}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress{width:100%;height:6px;overflow:hidden;border:0;border-radius:var(--radius-full);appearance:none;background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress::-webkit-progress-bar{background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress::-webkit-progress-value,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress::-moz-progress-bar{border-radius:var(--radius-full);background-color:var(--color-accent-primary)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress.error::-webkit-progress-value,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress.error::-moz-progress-bar{background-color:var(--color-state-error)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status.done{gap:var(--space-gap-2xs)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status.uploading,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status.error{justify-content:space-between}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status .status-icon{display:block;flex:0 0 16px;width:16px;height:16px}.file-picker-wrapper.dropzone .dropzone-field .file-row vt-button{flex:0 0 auto}@media(pointer:fine){.file-picker-wrapper.dropzone .dropzone-field:not(.filled):not(.error):hover{border-color:var(--color-accent-primary)}}@keyframes file-picker-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.file-picker-wrapper.compact .row .file-box .loading-spinner{animation:none}}\n"], dependencies: [{ kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "component", type: VoteyButtonComponent, selector: "vt-button", inputs: ["disabled", "type", "variant", "size", "text", "ariaLabel", "ico", "badge", "tooltipText", "disabledNote", "ariaExpanded", "ariaHasPopup", "ariaControls", "iconColor"], outputs: ["pressed"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyFilePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-file-picker", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        VoteyFormErrorComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                        VoteyButtonComponent,
                        VoteyIconComponent,
                    ], template: "<div\r\n  class=\"file-picker-wrapper\"\r\n  [class.compact]=\"!isDropzone()\"\r\n  [class.dropzone]=\"isDropzone()\"\r\n  [class.disabled]=\"effectiveDisabled()\"\r\n  [class.filled]=\"hasFile()\"\r\n>\r\n  @if (label()) {\r\n  <vt-text variant=\"label\" color=\"primary\" [content]=\"label() | vtTranslate\" />\r\n  } @if (isDropzone()) {\r\n  <div\r\n    class=\"dropzone-field\"\r\n    role=\"group\"\r\n    [class.dragging]=\"isDragging()\"\r\n    [class.error]=\"errorKeys.length > 0\"\r\n    [class.filled]=\"displayedFiles().length > 0\"\r\n    [attr.aria-busy]=\"isLoading()\"\r\n    [attr.aria-disabled]=\"effectiveDisabled()\"\r\n    [attr.aria-label]=\"dropzoneTitle() | vtTranslate\"\r\n    [attr.tabindex]=\"effectiveDisabled() ? -1 : 0\"\r\n    (click)=\"handleDropzoneClick($event)\"\r\n    (keydown)=\"handleDropzoneKeydown($event)\"\r\n    (dragenter)=\"handleDragEnter($event)\"\r\n    (dragover)=\"handleDragOver($event)\"\r\n    (dragleave)=\"handleDragLeave($event)\"\r\n    (drop)=\"handleDrop($event)\"\r\n  >\r\n    @if (displayedFiles().length) {\r\n    <div class=\"file-list\">\r\n      @for (file of displayedFiles(); track file.id) {\r\n      <div\r\n        class=\"file-row\"\r\n        [class.uploading]=\"file.state === fileStateNames.uploading\"\r\n      >\r\n        <vt-button\r\n          class=\"file-preview-trigger file-tile\"\r\n          variant=\"ghost\"\r\n          [ico]=\"file.icon || 'ui-file-txt'\"\r\n          [tooltipText]=\"previewText()\"\r\n          (pressed)=\"handleFilePreview(file)\"\r\n        />\r\n\r\n        <div class=\"file-content\">\r\n          <div class=\"file-heading\">\r\n            <span class=\"file-name\">\r\n              <vt-button\r\n                class=\"file-preview-trigger file-preview-name\"\r\n                variant=\"link\"\r\n                size=\"small\"\r\n                [text]=\"file.filename\"\r\n                [tooltipText]=\"previewText()\"\r\n                (pressed)=\"handleFilePreview(file)\"\r\n              />\r\n            </span>\r\n            @if (file.meta) {\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.meta | vtTranslate\"\r\n            />\r\n            }\r\n          </div>\r\n\r\n          @if ( file.state === fileStateNames.uploading || file.state ===\r\n          fileStateNames.error ) {\r\n          <progress\r\n            class=\"file-progress\"\r\n            [class.error]=\"file.state === fileStateNames.error\"\r\n            [value]=\"file.progress ?? 0\"\r\n            max=\"100\"\r\n          ></progress>\r\n          } @if (file.state === fileStateNames.done || !file.state) {\r\n          <div class=\"file-status done\">\r\n            <span class=\"status-icon\"><vt-icon ico=\"sp-check\" /></span>\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"accent\"\r\n              [content]=\"file.statusText || doneText() | vtTranslate\"\r\n            />\r\n          </div>\r\n          } @else if (file.state === fileStateNames.pending) {\r\n          <div class=\"file-status pending\">\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.statusText || pendingText() | vtTranslate\"\r\n            />\r\n          </div>\r\n          } @else if (file.state === fileStateNames.uploading) {\r\n          <div class=\"file-status uploading\">\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.statusText || loadingText() | vtTranslate\"\r\n            />\r\n            @if (file.speed) {\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"muted\"\r\n              [content]=\"file.speed | vtTranslate\"\r\n            />\r\n            }\r\n          </div>\r\n          } @else {\r\n          <div class=\"file-status error\">\r\n            <vt-text\r\n              variant=\"caption\"\r\n              color=\"error\"\r\n              [content]=\"file.statusText || uploadErrorText() | vtTranslate\"\r\n            />\r\n            <vt-button\r\n              variant=\"link\"\r\n              size=\"small\"\r\n              [text]=\"retryText()\"\r\n              [disabled]=\"effectiveDisabled()\"\r\n              (pressed)=\"handleFileRetry(file)\"\r\n            />\r\n          </div>\r\n          }\r\n        </div>\r\n\r\n        <vt-button\r\n          variant=\"secondary\"\r\n          size=\"small\"\r\n          [ico]=\"\r\n            file.state === fileStateNames.done ||\r\n            file.state === fileStateNames.pending ||\r\n            !file.state\r\n              ? 'ui-delete'\r\n              : 'ui-close-v2'\r\n          \"\r\n          [tooltipText]=\"\r\n            file.state === fileStateNames.uploading ? cancelText() : clearText()\r\n          \"\r\n          [disabled]=\"effectiveDisabled()\"\r\n          (pressed)=\"handleFileAction(file)\"\r\n        />\r\n      </div>\r\n      }\r\n    </div>\r\n    <vt-button\r\n      variant=\"secondary\"\r\n      size=\"small\"\r\n      [text]=\"dropzoneActionText()\"\r\n      [disabled]=\"effectiveDisabled()\"\r\n      (pressed)=\"open()\"\r\n    />\r\n    } @else {\r\n    <div class=\"dropzone-prompt\">\r\n      <vt-text\r\n        variant=\"body\"\r\n        color=\"primary\"\r\n        [content]=\"dropzoneTitle() | vtTranslate\"\r\n      />\r\n      <vt-text\r\n        variant=\"caption\"\r\n        color=\"muted\"\r\n        [content]=\"dropzoneHint() | vtTranslate : dropzoneHintParams()\"\r\n      />\r\n      <vt-button\r\n        variant=\"secondary\"\r\n        size=\"small\"\r\n        [text]=\"dropzoneActionText()\"\r\n        [disabled]=\"effectiveDisabled()\"\r\n        (pressed)=\"open()\"\r\n      />\r\n    </div>\r\n    }\r\n  </div>\r\n  } @else {\r\n  <div class=\"row\" [class.loading]=\"isLoading()\" [attr.aria-busy]=\"isLoading()\">\r\n    <div\r\n      class=\"file-box\"\r\n      [class.dragging]=\"isDragging()\"\r\n      aria-live=\"polite\"\r\n      [attr.title]=\"resolvedFilename()\"\r\n      (dragenter)=\"handleDragEnter($event)\"\r\n      (dragover)=\"handleDragOver($event)\"\r\n      (dragleave)=\"handleDragLeave($event)\"\r\n      (drop)=\"handleDrop($event)\"\r\n    >\r\n      @if (isLoading()) {\r\n      <div class=\"loading-state\" role=\"status\">\r\n        <span class=\"loading-spinner\" aria-hidden=\"true\"></span>\r\n        <vt-text\r\n          variant=\"caption\"\r\n          color=\"secondary\"\r\n          [content]=\"loadingText() | vtTranslate\"\r\n        />\r\n        @if (progress() !== null) {\r\n        <vt-text\r\n          variant=\"caption\"\r\n          color=\"secondary\"\r\n          [content]=\"progress() + '%'\"\r\n        />\r\n        }\r\n      </div>\r\n      } @else { @if (hasFile()) {\r\n      <span class=\"file-icon\" aria-hidden=\"true\">\r\n        <vt-icon [ico]=\"resolvedFileIcon()\" />\r\n      </span>\r\n      }\r\n      <span class=\"file-name\" [class.placeholder]=\"!hasFile()\">\r\n        <vt-text\r\n          variant=\"field\"\r\n          [color]=\"hasFile() ? 'primary' : 'muted'\"\r\n          [content]=\"\r\n            resolvedFilename()\r\n              ? resolvedFilename()\r\n              : (emptyText() | vtTranslate)\r\n          \"\r\n          [maxLines]=\"1\"\r\n        />\r\n      </span>\r\n      }\r\n    </div>\r\n\r\n    @if (!hasFile()) {\r\n    <vt-button\r\n      variant=\"link\"\r\n      size=\"small\"\r\n      [text]=\"actionText()\"\r\n      [disabled]=\"effectiveDisabled()\"\r\n      (pressed)=\"open()\"\r\n    />\r\n    } @if (clearable() && hasFile() && !isLoading()) {\r\n    <vt-button\r\n      class=\"compact-remove\"\r\n      variant=\"secondary\"\r\n      size=\"small\"\r\n      ico=\"ui-delete\"\r\n      [tooltipText]=\"clearText()\"\r\n      [disabled]=\"effectiveDisabled()\"\r\n      (pressed)=\"clear()\"\r\n    />\r\n    }\r\n  </div>\r\n  }\r\n\r\n  <input\r\n    #fileInput\r\n    type=\"file\"\r\n    hidden\r\n    [name]=\"name()\"\r\n    [disabled]=\"effectiveDisabled()\"\r\n    [required]=\"isRequired()\"\r\n    [attr.accept]=\"accept() || null\"\r\n    [attr.capture]=\"capture() || null\"\r\n    [attr.data-cy]=\"dataCy() || null\"\r\n    [multiple]=\"effectiveMultiple()\"\r\n    (change)=\"handleChange($event)\"\r\n    (cancel)=\"handleCancel()\"\r\n  />\r\n\r\n  <vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n</div>\r\n", styles: [":host{display:contents}.file-picker-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}.file-picker-wrapper.disabled .dropzone-field,.file-picker-wrapper.disabled .file-box{cursor:not-allowed}.file-picker-wrapper.compact .row{display:flex;align-items:center;gap:var(--space-icon-gap);width:100%}.file-picker-wrapper.compact .row .file-box{display:flex;flex:1 1 0;align-items:center;min-width:0;height:50px;box-sizing:border-box;padding:0 var(--space-field-padding-x);overflow:hidden;gap:var(--space-icon-gap);border:1px solid transparent;border-radius:var(--radius-m);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.compact .row .file-box .file-icon{display:block;flex:0 0 20px;width:20px;height:20px}.file-picker-wrapper.compact .row .file-box .file-name{flex:1 1 0;min-width:0;overflow:hidden}.file-picker-wrapper.compact .row .file-box .file-name ::ng-deep .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-picker-wrapper.compact .row .file-box .file-name.placeholder ::ng-deep .text{color:var(--color-text-placeholder)}.file-picker-wrapper.compact .row .file-box.dragging{border-color:var(--color-accent-primary)}.file-picker-wrapper.compact .row .file-box .loading-state{display:inline-flex;align-items:center;gap:var(--space-stack-gap-s);min-width:0}.file-picker-wrapper.compact .row .file-box .loading-spinner{flex:0 0 16px;width:16px;height:16px;border:2px solid var(--color-border-subtle);border-top-color:var(--color-accent-primary);border-radius:var(--radius-full);animation:file-picker-spin .7s linear infinite}.file-picker-wrapper.compact.filled .file-box{border-color:var(--color-border-field);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.compact.filled .compact-remove{flex:0 0 28px}.file-picker-wrapper.compact.filled .compact-remove ::ng-deep button{width:28px;height:28px;padding:0;border-radius:var(--radius-full)}.file-picker-wrapper.compact.disabled .file-name.placeholder ::ng-deep .text{color:var(--color-text-muted)}.file-picker-wrapper.dropzone .dropzone-field{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-stack-gap-m);width:100%;box-sizing:border-box;padding:var(--space-stack-gap-l) var(--space-card-padding);border:1.5px dashed var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);cursor:pointer;outline:none}.file-picker-wrapper.dropzone .dropzone-field:focus-visible{box-shadow:0 0 0 var(--spacing-2) var(--color-border-focus)}.file-picker-wrapper.dropzone .dropzone-field.dragging{border-width:2px;border-color:var(--color-accent-primary);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field.error{border-color:var(--color-state-error)}.file-picker-wrapper.dropzone .dropzone-field .dropzone-prompt{display:flex;flex-direction:column;align-items:center;gap:var(--space-icon-gap);width:100%;text-align:center}.file-picker-wrapper.dropzone .dropzone-field .file-list{display:flex;flex-direction:column;width:100%;overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row{display:flex;align-items:flex-start;gap:var(--space-icon-gap);width:100%;padding:var(--space-stack-gap-s) 0;border-bottom:1px solid var(--color-border-subtle)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger{min-width:0}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-tile{flex:0 0 44px;width:44px;height:44px}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-tile ::ng-deep button{width:44px;height:44px;padding:0;border-radius:var(--radius-s);background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name{flex:1 1 0;min-width:0;overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep button{height:auto;min-height:0;padding:0;border:0;border-radius:0;background-color:transparent;color:var(--color-text-primary);font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height);text-align:left}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .button-wrapper,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep button,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .label{min-width:0;max-width:100%}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .button-wrapper,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep button{width:100%;justify-content:flex-start}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name ::ng-deep .label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-preview-trigger.file-preview-name:hover{text-decoration:underline}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-tile vt-icon{display:block;width:28px;height:28px}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-content{display:flex;flex:1 1 0;flex-direction:column;gap:var(--space-gap-3xs);min-width:0}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status{display:flex;align-items:center;gap:var(--space-stack-gap-s);width:100%;min-width:0}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading{overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading{align-items:baseline}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading .file-name{flex:1 1 0;min-width:0;overflow:hidden}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-heading>vt-text{flex:0 0 auto}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress{width:100%;height:6px;overflow:hidden;border:0;border-radius:var(--radius-full);appearance:none;background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress::-webkit-progress-bar{background-color:var(--color-bg-surface-tint)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress::-webkit-progress-value,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress::-moz-progress-bar{border-radius:var(--radius-full);background-color:var(--color-accent-primary)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress.error::-webkit-progress-value,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-progress.error::-moz-progress-bar{background-color:var(--color-state-error)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status.done{gap:var(--space-gap-2xs)}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status.uploading,.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status.error{justify-content:space-between}.file-picker-wrapper.dropzone .dropzone-field .file-row .file-status .status-icon{display:block;flex:0 0 16px;width:16px;height:16px}.file-picker-wrapper.dropzone .dropzone-field .file-row vt-button{flex:0 0 auto}@media(pointer:fine){.file-picker-wrapper.dropzone .dropzone-field:not(.filled):not(.error):hover{border-color:var(--color-accent-primary)}}@keyframes file-picker-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.file-picker-wrapper.compact .row .file-box .loading-spinner{animation:none}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], filename: [{ type: i0.Input, args: [{ isSignal: true, alias: "filename", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], emptyText: [{ type: i0.Input, args: [{ isSignal: true, alias: "emptyText", required: false }] }], actionText: [{ type: i0.Input, args: [{ isSignal: true, alias: "actionText", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], progress: [{ type: i0.Input, args: [{ isSignal: true, alias: "progress", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], accept: [{ type: i0.Input, args: [{ isSignal: true, alias: "accept", required: false }] }], capture: [{ type: i0.Input, args: [{ isSignal: true, alias: "capture", required: false }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], multiple: [{ type: i0.Input, args: [{ isSignal: true, alias: "multiple", required: false }] }], dropEnabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "dropEnabled", required: false }] }], clearable: [{ type: i0.Input, args: [{ isSignal: true, alias: "clearable", required: false }] }], clearText: [{ type: i0.Input, args: [{ isSignal: true, alias: "clearText", required: false }] }], loadingText: [{ type: i0.Input, args: [{ isSignal: true, alias: "loadingText", required: false }] }], dropzoneTitle: [{ type: i0.Input, args: [{ isSignal: true, alias: "dropzoneTitle", required: false }] }], dropzoneHint: [{ type: i0.Input, args: [{ isSignal: true, alias: "dropzoneHint", required: false }] }], dropzoneActionText: [{ type: i0.Input, args: [{ isSignal: true, alias: "dropzoneActionText", required: false }] }], doneText: [{ type: i0.Input, args: [{ isSignal: true, alias: "doneText", required: false }] }], pendingText: [{ type: i0.Input, args: [{ isSignal: true, alias: "pendingText", required: false }] }], previewText: [{ type: i0.Input, args: [{ isSignal: true, alias: "previewText", required: false }] }], uploadErrorText: [{ type: i0.Input, args: [{ isSignal: true, alias: "uploadErrorText", required: false }] }], retryText: [{ type: i0.Input, args: [{ isSignal: true, alias: "retryText", required: false }] }], cancelText: [{ type: i0.Input, args: [{ isSignal: true, alias: "cancelText", required: false }] }], files: [{ type: i0.Input, args: [{ isSignal: true, alias: "files", required: false }] }], allowedExtensions: [{ type: i0.Input, args: [{ isSignal: true, alias: "allowedExtensions", required: false }] }], allowedMimeTypes: [{ type: i0.Input, args: [{ isSignal: true, alias: "allowedMimeTypes", required: false }] }], maxFileSizeBytes: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxFileSizeBytes", required: false }] }], maxTotalSizeBytes: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxTotalSizeBytes", required: false }] }], currentTotalSizeBytes: [{ type: i0.Input, args: [{ isSignal: true, alias: "currentTotalSizeBytes", required: false }] }], maxFiles: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxFiles", required: false }] }], currentFilesCount: [{ type: i0.Input, args: [{ isSignal: true, alias: "currentFilesCount", required: false }] }], validationErrorKeys: [{ type: i0.Input, args: [{ isSignal: true, alias: "validationErrorKeys", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }], changed: [{ type: i0.Output, args: ["changed"] }], filesChanged: [{ type: i0.Output, args: ["filesChanged"] }], cleared: [{ type: i0.Output, args: ["cleared"] }], cancelled: [{ type: i0.Output, args: ["cancelled"] }], rejected: [{ type: i0.Output, args: ["rejected"] }], fileRemoved: [{ type: i0.Output, args: ["fileRemoved"] }], fileRetry: [{ type: i0.Output, args: ["fileRetry"] }], fileCancelled: [{ type: i0.Output, args: ["fileCancelled"] }], filePreview: [{ type: i0.Output, args: ["filePreview"] }], fileInput: [{ type: i0.ViewChild, args: ["fileInput", { isSignal: true }] }] } });

class VoteyChipComponent {
    label = input.required(...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    removeTooltip = input.required(...(ngDevMode ? [{ debugName: "removeTooltip" }] : /* istanbul ignore next */ []));
    showRemove = input(true, ...(ngDevMode ? [{ debugName: "showRemove" }] : /* istanbul ignore next */ []));
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    removed = output();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyChipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyChipComponent, isStandalone: true, selector: "vt-chip", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null }, removeTooltip: { classPropertyName: "removeTooltip", publicName: "removeTooltip", isSignal: true, isRequired: true, transformFunction: null }, showRemove: { classPropertyName: "showRemove", publicName: "showRemove", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { removed: "removed" }, ngImport: i0, template: "<div\r\n  class=\"chip\"\r\n  [class.disabled]=\"disabled()\"\r\n  [attr.aria-disabled]=\"disabled()\"\r\n>\r\n  <span class=\"label\">\r\n    <vt-text\r\n      variant=\"caption\"\r\n      [content]=\"label()\"\r\n      [color]=\"disabled() ? 'muted' : 'primary'\"\r\n    />\r\n  </span>\r\n  @if (showRemove()) {\r\n  @let removeAction = \"BUTTON.REMOVE\" | vtTranslate;\r\n  <vt-button\r\n    class=\"remove\"\r\n    variant=\"ghost\"\r\n    size=\"small\"\r\n    ico=\"ui-close\"\r\n    [disabled]=\"disabled()\"\r\n    [ariaLabel]=\"removeAction + ': ' + label()\"\r\n    [disabledNote]=\"removeTooltip()\"\r\n    [tooltipText]=\"removeTooltip()\"\r\n    (pressed)=\"removed.emit()\"\r\n  />\r\n  }\r\n</div>\r\n", styles: [":host{display:contents}.chip{position:relative;box-sizing:border-box;display:flex;align-items:center;min-width:0;max-width:100%;height:25px;padding-inline:var(--space-inset-xs) var(--space-inset-2xs);border-radius:var(--radius-full);background-color:var(--color-accent-soft);border:2px solid var(--color-accent-hover);white-space:nowrap;transition:background-color .18s ease,border .18s ease}.chip .label{display:block;min-width:0;overflow:hidden}.chip .label ::ng-deep vt-text span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chip .remove{position:absolute;top:50%;right:var(--space-inset-3xs);transform:translateY(-50%)}.chip .remove ::ng-deep button.icon-button.small{width:24px;height:24px}.chip .remove ::ng-deep button.icon-button.small .icon{flex-basis:12px;width:12px;height:12px}.chip:has(.remove){padding-right:calc(var(--space-inset-2xs) + 12px + var(--space-gap-xs))}.chip.disabled{background-color:var(--color-bg-surface-tint);border:2px solid var(--color-border-subtle)}@media(prefers-reduced-motion:reduce){.chip{transition:none}}\n"], dependencies: [{ kind: "component", type: VoteyButtonComponent, selector: "vt-button", inputs: ["disabled", "type", "variant", "size", "text", "ariaLabel", "ico", "badge", "tooltipText", "disabledNote", "ariaExpanded", "ariaHasPopup", "ariaControls", "iconColor"], outputs: ["pressed"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyChipComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-chip", changeDetection: ChangeDetectionStrategy.OnPush, imports: [VoteyButtonComponent, VoteyTextComponent, VoteyTranslatePipe], template: "<div\r\n  class=\"chip\"\r\n  [class.disabled]=\"disabled()\"\r\n  [attr.aria-disabled]=\"disabled()\"\r\n>\r\n  <span class=\"label\">\r\n    <vt-text\r\n      variant=\"caption\"\r\n      [content]=\"label()\"\r\n      [color]=\"disabled() ? 'muted' : 'primary'\"\r\n    />\r\n  </span>\r\n  @if (showRemove()) {\r\n  @let removeAction = \"BUTTON.REMOVE\" | vtTranslate;\r\n  <vt-button\r\n    class=\"remove\"\r\n    variant=\"ghost\"\r\n    size=\"small\"\r\n    ico=\"ui-close\"\r\n    [disabled]=\"disabled()\"\r\n    [ariaLabel]=\"removeAction + ': ' + label()\"\r\n    [disabledNote]=\"removeTooltip()\"\r\n    [tooltipText]=\"removeTooltip()\"\r\n    (pressed)=\"removed.emit()\"\r\n  />\r\n  }\r\n</div>\r\n", styles: [":host{display:contents}.chip{position:relative;box-sizing:border-box;display:flex;align-items:center;min-width:0;max-width:100%;height:25px;padding-inline:var(--space-inset-xs) var(--space-inset-2xs);border-radius:var(--radius-full);background-color:var(--color-accent-soft);border:2px solid var(--color-accent-hover);white-space:nowrap;transition:background-color .18s ease,border .18s ease}.chip .label{display:block;min-width:0;overflow:hidden}.chip .label ::ng-deep vt-text span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chip .remove{position:absolute;top:50%;right:var(--space-inset-3xs);transform:translateY(-50%)}.chip .remove ::ng-deep button.icon-button.small{width:24px;height:24px}.chip .remove ::ng-deep button.icon-button.small .icon{flex-basis:12px;width:12px;height:12px}.chip:has(.remove){padding-right:calc(var(--space-inset-2xs) + 12px + var(--space-gap-xs))}.chip.disabled{background-color:var(--color-bg-surface-tint);border:2px solid var(--color-border-subtle)}@media(prefers-reduced-motion:reduce){.chip{transition:none}}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }], removeTooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "removeTooltip", required: true }] }], showRemove: [{ type: i0.Input, args: [{ isSignal: true, alias: "showRemove", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], removed: [{ type: i0.Output, args: ["removed"] }] } });

const VoteySelectVariants = ["boxed", "compact"];
class VoteySelectComponent extends VoteyFormControlApplyDirective {
    document = inject(DOCUMENT);
    destroyRef = inject(DestroyRef);
    outsidePointerDownListener = (event) => this.closeOnOutsidePointerDown(event);
    backdropPointerDownListener = () => this.matSelect()?.close();
    backdropListenerTimeout = null;
    overlayBackdrop = null;
    options = input.required(...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    variant = input("boxed", ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    placeholder = input("", ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    bindLabel = input("", ...(ngDevMode ? [{ debugName: "bindLabel" }] : /* istanbul ignore next */ []));
    bindValue = input("", ...(ngDevMode ? [{ debugName: "bindValue" }] : /* istanbul ignore next */ []));
    id = input("", ...(ngDevMode ? [{ debugName: "id" }] : /* istanbul ignore next */ []));
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    dataCy = input("", ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    multiple = input(false, { ...(ngDevMode ? { debugName: "multiple" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    flagSelect = input(false, { ...(ngDevMode ? { debugName: "flagSelect" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    clearable = input(false, { ...(ngDevMode ? { debugName: "clearable" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    clearTooltip = input("BUTTON.CLEAR", ...(ngDevMode ? [{ debugName: "clearTooltip" }] : /* istanbul ignore next */ []));
    showSelectionChips = input(true, { ...(ngDevMode ? { debugName: "showSelectionChips" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    searchable = input(false, { ...(ngDevMode ? { debugName: "searchable" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    searchPlaceholder = input("COMMON.SEARCH", ...(ngDevMode ? [{ debugName: "searchPlaceholder" }] : /* istanbul ignore next */ []));
    customSearchFn = input(null, ...(ngDevMode ? [{ debugName: "customSearchFn" }] : /* istanbul ignore next */ []));
    withSelectionActions = input(false, { ...(ngDevMode ? { debugName: "withSelectionActions" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    withSelectionSearch = input(false, { ...(ngDevMode ? { debugName: "withSelectionSearch" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    selectionCancelText = input("BUTTON.CANCEL", ...(ngDevMode ? [{ debugName: "selectionCancelText" }] : /* istanbul ignore next */ []));
    selectionUpdateText = input("BUTTON.SAVE", ...(ngDevMode ? [{ debugName: "selectionUpdateText" }] : /* istanbul ignore next */ []));
    nonRemovableValues = input([], ...(ngDevMode ? [{ debugName: "nonRemovableValues" }] : /* istanbul ignore next */ []));
    optionAvatarField = input("avatarUrl", ...(ngDevMode ? [{ debugName: "optionAvatarField" }] : /* istanbul ignore next */ []));
    optionDescriptionField = input("email", ...(ngDevMode ? [{ debugName: "optionDescriptionField" }] : /* istanbul ignore next */ []));
    optionFlagField = input("flagClass", ...(ngDevMode ? [{ debugName: "optionFlagField" }] : /* istanbul ignore next */ []));
    flagClass = input("fi language-flag", ...(ngDevMode ? [{ debugName: "flagClass" }] : /* istanbul ignore next */ []));
    translateOptions = input(true, { ...(ngDevMode ? { debugName: "translateOptions" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    closeOnSelect = input(false, { ...(ngDevMode ? { debugName: "closeOnSelect" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    tooltip = input("", ...(ngDevMode ? [{ debugName: "tooltip" }] : /* istanbul ignore next */ []));
    disabledNote = input("", ...(ngDevMode ? [{ debugName: "disabledNote" }] : /* istanbul ignore next */ []));
    removeTooltip = input("BUTTON.REMOVE", ...(ngDevMode ? [{ debugName: "removeTooltip" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    selectionChange = output();
    change = output();
    isOpen = signal(false, ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
    searchTerm = signal("", ...(ngDevMode ? [{ debugName: "searchTerm" }] : /* istanbul ignore next */ []));
    matSelect = viewChild(MatSelect, ...(ngDevMode ? [{ debugName: "matSelect" }] : /* istanbul ignore next */ []));
    selectionActionControl = new FormControl([]);
    optionViews = computed(() => this.options().map((option) => ({
        avatarUrl: this.getOptionText(option, this.optionAvatarField()),
        description: this.getOptionText(option, this.optionDescriptionField()),
        disabled: this.isOptionDisabled(option),
        flagClass: this.getOptionText(option, this.optionFlagField()),
        label: this.getOptionLabel(option),
        option,
        value: this.getOptionValue(option),
    })), ...(ngDevMode ? [{ debugName: "optionViews" }] : /* istanbul ignore next */ []));
    filteredOptionViews = computed(() => {
        const searchTerm = this.searchTerm().trim();
        if (!searchTerm)
            return this.optionViews();
        return this.optionViews().filter((option) => this.matchesSearch(searchTerm, option));
    }, ...(ngDevMode ? [{ debugName: "filteredOptionViews" }] : /* istanbul ignore next */ []));
    resolvedTooltip = computed(() => this.toTrimmedString(this.disabled() || this.formControl.disabled
        ? this.disabledNote()
        : this.tooltip()), ...(ngDevMode ? [{ debugName: "resolvedTooltip" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        this.document.addEventListener("pointerdown", this.outsidePointerDownListener, true);
        this.destroyRef.onDestroy(() => {
            this.document.removeEventListener("pointerdown", this.outsidePointerDownListener, true);
            this.removeBackdropListener();
        });
    }
    get isRequired() {
        return this.formControl.hasValidator(Validators.required);
    }
    get hasError() {
        return this.formControl.invalid && this.formControl.touched;
    }
    get errorKeys() {
        return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
    }
    get selectedOptions() {
        const selectedValues = this.toArray(this.formControl.value);
        return this.optionViews().filter((option) => selectedValues.some((value) => Object.is(value, option.value)));
    }
    get selectedOption() {
        return this.selectedOptions[0] ?? null;
    }
    get canClear() {
        const value = this.formControl.value;
        return (this.clearable() &&
            !this.disabled() &&
            !this.formControl.disabled &&
            value !== null &&
            value !== undefined &&
            (!Array.isArray(value) || value.length > 0));
    }
    get selectionControl() {
        return this.isSelectionActionMode
            ? this.selectionActionControl
            : this.formControl;
    }
    get isSelectionActionMode() {
        return this.multiple() && this.withSelectionActions();
    }
    get isSearchEnabled() {
        return (this.searchable() ||
            (this.isSelectionActionMode && this.withSelectionSearch()));
    }
    handleSelectionChange(event) {
        const nextValue = this.resolveValueWithNonRemovable(event.value);
        if (this.isSelectionActionMode) {
            this.selectionActionControl.setValue(nextValue, { emitEvent: false });
            return;
        }
        if (!Object.is(nextValue, event.value)) {
            this.formControl.setValue(nextValue, { emitEvent: false });
        }
        this.formControl.markAsDirty();
        this.formControl.markAsTouched();
        this.emitChange(nextValue);
        if (this.closeOnSelect())
            this.matSelect()?.close();
    }
    handleOpenedChange(isOpen) {
        this.isOpen.set(isOpen);
        if (!isOpen) {
            this.searchTerm.set("");
            this.removeBackdropListener();
            return;
        }
        this.scheduleBackdropListener();
        if (this.isSelectionActionMode) {
            this.selectionActionControl.setValue(this.resolveValueWithNonRemovable(this.formControl.value), { emitEvent: false });
        }
    }
    handleSearchInput(event) {
        const inputElement = event.target;
        this.searchTerm.set(inputElement.value);
    }
    openSelect(event) {
        const target = event.target;
        if (target instanceof Element && target.closest(".cdk-overlay-popover")) {
            return;
        }
        this.matSelect()?.open();
    }
    closeOnOutsidePointerDown(event) {
        const target = event.target;
        if (!this.isOpen() || !(target instanceof Element))
            return;
        if (target.closest(".mat-mdc-select-trigger, .vt-select-panel, vt-icon.arrow, button.clear")) {
            return;
        }
        this.matSelect()?.close();
    }
    addBackdropListener() {
        this.removeBackdropListener();
        const backdrop = this.document.querySelector(".cdk-overlay-backdrop-showing");
        if (!backdrop)
            return;
        this.overlayBackdrop = backdrop;
        backdrop.addEventListener("pointerdown", this.backdropPointerDownListener);
    }
    scheduleBackdropListener() {
        this.clearBackdropListenerTimeout();
        this.backdropListenerTimeout = setTimeout(() => {
            this.backdropListenerTimeout = null;
            if (this.isOpen())
                this.addBackdropListener();
        });
    }
    removeBackdropListener() {
        this.clearBackdropListenerTimeout();
        this.overlayBackdrop?.removeEventListener("pointerdown", this.backdropPointerDownListener);
        this.overlayBackdrop = null;
    }
    clearBackdropListenerTimeout() {
        if (this.backdropListenerTimeout === null)
            return;
        clearTimeout(this.backdropListenerTimeout);
        this.backdropListenerTimeout = null;
    }
    stopPanelEvent(event) {
        event.stopPropagation();
    }
    clearSelection(event) {
        event.stopPropagation();
        const nextValue = this.multiple()
            ? this.resolveValueWithNonRemovable([])
            : null;
        this.formControl.setValue(nextValue);
        this.formControl.markAsDirty();
        this.formControl.markAsTouched();
        this.emitChange(nextValue);
    }
    cancelSelectionActions() {
        this.selectionActionControl.setValue(this.resolveValueWithNonRemovable(this.formControl.value), { emitEvent: false });
        this.matSelect()?.close();
    }
    updateSelectionActions() {
        const nextValue = this.resolveValueWithNonRemovable(this.selectionActionControl.value);
        this.formControl.setValue(nextValue);
        this.formControl.markAsDirty();
        this.formControl.markAsTouched();
        this.emitChange(nextValue);
        this.matSelect()?.close();
    }
    removeSelection(option) {
        if (this.disabled() ||
            this.formControl.disabled ||
            option.disabled ||
            !this.isOptionRemovable(option)) {
            return;
        }
        const nextValue = this.toArray(this.formControl.value).filter((value) => !Object.is(value, option.value));
        this.formControl.setValue(nextValue);
        this.formControl.markAsDirty();
        this.formControl.markAsTouched();
        this.emitChange(nextValue);
    }
    getOptionLabel(option) {
        if (this.bindLabel()) {
            return this.toDisplayValue(this.getBoundOptionProperty(option, this.bindLabel()));
        }
        if (this.isVtOption(option))
            return option.label;
        return this.toDisplayValue(option);
    }
    getOptionValue(option) {
        if (this.bindValue()) {
            return this.getBoundOptionProperty(option, this.bindValue());
        }
        return option;
    }
    getOptionText(option, property) {
        if (!property)
            return "";
        return this.toDisplayValue(this.getBoundOptionProperty(option, property));
    }
    getBoundOptionProperty(option, property) {
        if (option === null || typeof option !== "object")
            return undefined;
        return option[property];
    }
    isOptionDisabled(option) {
        return this.getBoundOptionProperty(option, "disabled") === true;
    }
    matchesSearch(searchTerm, option) {
        const customSearchFn = this.customSearchFn();
        if (customSearchFn)
            return customSearchFn(searchTerm, option.option);
        const normalizedSearchTerm = searchTerm.toLocaleLowerCase();
        return [option.label, option.description].some((value) => value.toLocaleLowerCase().includes(normalizedSearchTerm));
    }
    isOptionRemovable(option) {
        const normalizedValue = this.normalizeOptionValue(option.value);
        return (normalizedValue === null ||
            !this.nonRemovableValues()
                .map((value) => this.normalizeOptionValue(value))
                .some((value) => value === normalizedValue));
    }
    resolveValueWithNonRemovable(value) {
        if (!this.multiple() || !Array.isArray(value))
            return value;
        const requiredValues = this.nonRemovableValues();
        const nextValues = [...value];
        requiredValues.forEach((requiredValue) => {
            const normalizedRequiredValue = this.normalizeOptionValue(requiredValue);
            const matchingOption = this.optionViews().find((option) => this.normalizeOptionValue(option.value) === normalizedRequiredValue);
            if (matchingOption &&
                !nextValues.some((currentValue) => Object.is(currentValue, matchingOption.value))) {
                nextValues.push(matchingOption.value);
            }
        });
        return nextValues;
    }
    normalizeOptionValue(value) {
        if (typeof value === "string")
            return value.trim().toLocaleLowerCase();
        if (typeof value === "number")
            return value;
        return null;
    }
    toTrimmedString(value) {
        return typeof value === "string" ? value.trim() : "";
    }
    emitChange(value) {
        this.selectionChange.emit(value);
        this.change.emit(value);
    }
    isVtOption(option) {
        return (option !== null &&
            typeof option === "object" &&
            typeof option.label === "string" &&
            "value" in option);
    }
    toDisplayValue(value) {
        return value === null || value === undefined ? "" : String(value);
    }
    toArray(value) {
        if (Array.isArray(value))
            return value;
        if (value === null || value === undefined)
            return [];
        return [value];
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteySelectComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteySelectComponent, isStandalone: true, selector: "vt-select", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: true, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, bindLabel: { classPropertyName: "bindLabel", publicName: "bindLabel", isSignal: true, isRequired: false, transformFunction: null }, bindValue: { classPropertyName: "bindValue", publicName: "bindValue", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null }, multiple: { classPropertyName: "multiple", publicName: "multiple", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, flagSelect: { classPropertyName: "flagSelect", publicName: "flagSelect", isSignal: true, isRequired: false, transformFunction: null }, clearable: { classPropertyName: "clearable", publicName: "clearable", isSignal: true, isRequired: false, transformFunction: null }, clearTooltip: { classPropertyName: "clearTooltip", publicName: "clearTooltip", isSignal: true, isRequired: false, transformFunction: null }, showSelectionChips: { classPropertyName: "showSelectionChips", publicName: "showSelectionChips", isSignal: true, isRequired: false, transformFunction: null }, searchable: { classPropertyName: "searchable", publicName: "searchable", isSignal: true, isRequired: false, transformFunction: null }, searchPlaceholder: { classPropertyName: "searchPlaceholder", publicName: "searchPlaceholder", isSignal: true, isRequired: false, transformFunction: null }, customSearchFn: { classPropertyName: "customSearchFn", publicName: "customSearchFn", isSignal: true, isRequired: false, transformFunction: null }, withSelectionActions: { classPropertyName: "withSelectionActions", publicName: "withSelectionActions", isSignal: true, isRequired: false, transformFunction: null }, withSelectionSearch: { classPropertyName: "withSelectionSearch", publicName: "withSelectionSearch", isSignal: true, isRequired: false, transformFunction: null }, selectionCancelText: { classPropertyName: "selectionCancelText", publicName: "selectionCancelText", isSignal: true, isRequired: false, transformFunction: null }, selectionUpdateText: { classPropertyName: "selectionUpdateText", publicName: "selectionUpdateText", isSignal: true, isRequired: false, transformFunction: null }, nonRemovableValues: { classPropertyName: "nonRemovableValues", publicName: "nonRemovableValues", isSignal: true, isRequired: false, transformFunction: null }, optionAvatarField: { classPropertyName: "optionAvatarField", publicName: "optionAvatarField", isSignal: true, isRequired: false, transformFunction: null }, optionDescriptionField: { classPropertyName: "optionDescriptionField", publicName: "optionDescriptionField", isSignal: true, isRequired: false, transformFunction: null }, optionFlagField: { classPropertyName: "optionFlagField", publicName: "optionFlagField", isSignal: true, isRequired: false, transformFunction: null }, flagClass: { classPropertyName: "flagClass", publicName: "flagClass", isSignal: true, isRequired: false, transformFunction: null }, translateOptions: { classPropertyName: "translateOptions", publicName: "translateOptions", isSignal: true, isRequired: false, transformFunction: null }, closeOnSelect: { classPropertyName: "closeOnSelect", publicName: "closeOnSelect", isSignal: true, isRequired: false, transformFunction: null }, tooltip: { classPropertyName: "tooltip", publicName: "tooltip", isSignal: true, isRequired: false, transformFunction: null }, disabledNote: { classPropertyName: "disabledNote", publicName: "disabledNote", isSignal: true, isRequired: false, transformFunction: null }, removeTooltip: { classPropertyName: "removeTooltip", publicName: "removeTooltip", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectionChange: "selectionChange", change: "change" }, viewQueries: [{ propertyName: "matSelect", first: true, predicate: MatSelect, descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "@let translatedLabel = label() | vtTranslate; @let selectDisabled = disabled()\r\n|| formControl.disabled; @let translatedTooltip = resolvedTooltip() |\r\nvtTranslate;\r\n\r\n<div\r\n  class=\"select-wrapper\"\r\n  [class.compact]=\"variant() === 'compact'\"\r\n  [class.disabled]=\"selectDisabled\"\r\n  [class.error]=\"hasError\"\r\n>\r\n  @if (label()) {\r\n  <label class=\"label\" [for]=\"id()\">\r\n    <vt-text\r\n      variant=\"label\"\r\n      [color]=\"selectDisabled ? 'muted' : 'primary'\"\r\n      [content]=\"translatedLabel\"\r\n    />\r\n  </label>\r\n  }\r\n\r\n  <div\r\n    class=\"field\"\r\n    [class.open]=\"isOpen()\"\r\n    matTooltipPosition=\"above\"\r\n    [matTooltipDisabled]=\"!translatedTooltip\"\r\n    [matTooltipShowDelay]=\"500\"\r\n    [matTooltip]=\"translatedTooltip\"\r\n    (click)=\"openSelect($event)\"\r\n  >\r\n    <mat-select\r\n      class=\"control\"\r\n      panelClass=\"vt-select-panel\"\r\n      panelWidth=\"auto\"\r\n      [id]=\"id()\"\r\n      [multiple]=\"multiple()\"\r\n      [disabled]=\"selectDisabled\"\r\n      [required]=\"isRequired\"\r\n      [formControl]=\"selectionControl\"\r\n      [placeholder]=\"placeholder() | vtTranslate\"\r\n      [attr.data-cy]=\"dataCy() || null\"\r\n      [attr.name]=\"name() || null\"\r\n      (selectionChange)=\"handleSelectionChange($event)\"\r\n      (openedChange)=\"handleOpenedChange($event)\"\r\n    >\r\n      @if (!multiple() && selectedOption; as option) {\r\n      <mat-select-trigger>\r\n        <span class=\"selected-option\">\r\n          @if (flagSelect() && option.flagClass) {\r\n          <span\r\n            class=\"option-flag\"\r\n            [class]=\"flagClass() + ' ' + option.flagClass\"\r\n          ></span>\r\n          } @if (option.avatarUrl) {\r\n          <img\r\n            class=\"option-avatar\"\r\n            [src]=\"option.avatarUrl\"\r\n            [alt]=\"option.label\"\r\n          />\r\n          }\r\n          <span class=\"option-label\">\r\n            @if (translateOptions()) {\r\n            {{ option.label | vtTranslate }}\r\n            } @else {\r\n            {{ option.label }}\r\n            }\r\n          </span>\r\n        </span>\r\n      </mat-select-trigger>\r\n      } @if (multiple() && showSelectionChips()) {\r\n      <mat-select-trigger>\r\n        @if (!selectedOptions.length) {\r\n        <span class=\"selected-option placeholder\">\r\n          {{ placeholder() | vtTranslate }}\r\n        </span>\r\n        }\r\n      </mat-select-trigger>\r\n      } @if (isSearchEnabled) {\r\n      <div class=\"panel-search\" (click)=\"stopPanelEvent($event)\">\r\n        <input\r\n          aria-label=\"Search\"\r\n          autocomplete=\"off\"\r\n          class=\"panel-search-input\"\r\n          type=\"search\"\r\n          [placeholder]=\"searchPlaceholder() | vtTranslate\"\r\n          [value]=\"searchTerm()\"\r\n          (input)=\"handleSearchInput($event)\"\r\n          (keydown)=\"stopPanelEvent($event)\"\r\n        />\r\n      </div>\r\n      } @for (option of filteredOptionViews(); track option.value) {\r\n      <mat-option [value]=\"option.value\" [disabled]=\"option.disabled\">\r\n        <div class=\"option-content\">\r\n          @if (flagSelect() && option.flagClass) {\r\n          <span\r\n            class=\"option-flag\"\r\n            [class]=\"flagClass() + ' ' + option.flagClass\"\r\n          ></span>\r\n          } @if (option.avatarUrl) {\r\n          <img\r\n            class=\"option-avatar\"\r\n            [src]=\"option.avatarUrl\"\r\n            [alt]=\"option.label\"\r\n          />\r\n          }\r\n          <span class=\"option-copy\">\r\n            <span class=\"option-label\">\r\n              @if (translateOptions()) {\r\n              {{ option.label | vtTranslate }}\r\n              } @else {\r\n              {{ option.label }}\r\n              }\r\n            </span>\r\n            @if (option.description) {\r\n            <span class=\"option-description\">{{ option.description }}</span>\r\n            }\r\n          </span>\r\n        </div>\r\n      </mat-option>\r\n      } @if (isSelectionActionMode) {\r\n      <div\r\n        class=\"selection-actions\"\r\n        (click)=\"stopPanelEvent($event)\"\r\n        (mousedown)=\"stopPanelEvent($event)\"\r\n      >\r\n        <vt-button\r\n          variant=\"secondary\"\r\n          [text]=\"selectionCancelText()\"\r\n          (pressed)=\"cancelSelectionActions()\"\r\n        />\r\n        <vt-button\r\n          [text]=\"selectionUpdateText()\"\r\n          (pressed)=\"updateSelectionActions()\"\r\n        />\r\n      </div>\r\n      }\r\n    </mat-select>\r\n    @if (canClear) {\r\n    <button\r\n      class=\"clear\"\r\n      type=\"button\"\r\n      [attr.aria-label]=\"clearTooltip() | vtTranslate\"\r\n      [attr.title]=\"clearTooltip() | vtTranslate\"\r\n      (click)=\"clearSelection($event)\"\r\n    >\r\n      <vt-icon ico=\"ui-close\" />\r\n    </button>\r\n    }\r\n    <vt-icon class=\"arrow\" ico=\"ui-chevron-down\" [class.open]=\"isOpen()\" />\r\n  </div>\r\n\r\n  @if (multiple() && showSelectionChips() && selectedOptions.length) {\r\n  <div class=\"chips\">\r\n    @for (option of selectedOptions; track option.value) {\r\n    <vt-chip\r\n      [label]=\"translateOptions() ? (option.label | vtTranslate) : option.label\"\r\n      [removeTooltip]=\"removeTooltip()\"\r\n      [disabled]=\"\r\n        selectDisabled || option.disabled || !isOptionRemovable(option)\r\n      \"\r\n      (removed)=\"removeSelection(option)\"\r\n    />\r\n    }\r\n  </div>\r\n  }\r\n\r\n  <vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n</div>\r\n", styles: ["vt-select{display:block;width:100%}vt-select .select-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}vt-select .select-wrapper .label{display:contents}vt-select .select-wrapper .field{box-sizing:border-box;display:flex;position:relative;align-items:center;width:100%;height:50px;padding:0;border:1px solid var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}vt-select .select-wrapper .field:focus-within{border:2px solid var(--color-accent-primary);box-shadow:none}vt-select .select-wrapper .field.open{border:2px solid var(--color-accent-primary);box-shadow:none}vt-select .select-wrapper .field .control{box-sizing:border-box;display:flex;align-items:center;width:100%;height:100%;color:var(--color-text-primary);font-family:var(--typo-field-font-family);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}vt-select .select-wrapper .field .control .mat-mdc-select-placeholder{color:var(--color-text-placeholder)}vt-select .select-wrapper .field .control .mat-mdc-select-arrow-wrapper{display:none}vt-select .select-wrapper .field .control .mat-mdc-select-trigger{box-sizing:border-box;display:flex;align-items:center;width:100%;height:100%;padding:0 calc(var(--space-field-padding-x) + var(--spacing-20) + var(--space-gap-xs)) 0 var(--space-field-padding-x)}vt-select .select-wrapper .field .control .selected-option{display:flex;align-items:center;gap:var(--space-gap-xs);min-width:0}vt-select .select-wrapper .field .control .selected-option .option-flag,vt-select .select-wrapper .field .control .selected-option .option-avatar{flex:0 0 auto}vt-select .select-wrapper .field .control .selected-option .option-flag{display:inline-block;width:20px;height:14px}vt-select .select-wrapper .field .control .selected-option .option-avatar{width:24px;height:24px;border-radius:var(--radius-pill);object-fit:cover}vt-select .select-wrapper .field .control .selected-option .option-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}vt-select .select-wrapper .field .arrow{display:block;position:absolute;top:50%;right:var(--space-field-padding-x);flex:0 0 auto;width:20px;height:20px;color:var(--color-accent-primary);pointer-events:none;transform:translateY(-50%);transition:transform .18s ease}vt-select .select-wrapper .field .arrow.open{transform:translateY(-50%) rotate(180deg)}vt-select .select-wrapper .field .clear{position:absolute;top:50%;right:calc(var(--space-field-padding-x) + var(--spacing-20) + var(--space-gap-xs));display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:24px;height:24px;padding:0;border:0;border-radius:var(--radius-pill);background:transparent;color:var(--color-text-muted);cursor:pointer;transform:translateY(-50%)}vt-select .select-wrapper .field .clear:focus-visible{outline:1px solid var(--color-accent-primary)}vt-select .select-wrapper .field .clear vt-icon{width:16px;height:16px}vt-select .select-wrapper .field:has(.clear) .control .mat-mdc-select-trigger{padding-right:calc(var(--space-field-padding-x) + var(--spacing-20) + var(--space-gap-xs) + var(--spacing-24) + var(--spacing-8))}vt-select .select-wrapper .chips{display:flex;flex-wrap:wrap;gap:var(--spacing-8)}vt-select .select-wrapper.compact .field{height:30px;border-radius:var(--radius-pill)}vt-select .select-wrapper.compact .field .control .mat-mdc-select-trigger{padding:0 calc(var(--spacing-12) + var(--spacing-20) + var(--spacing-8)) 0 var(--spacing-12)}vt-select .select-wrapper.compact .field .arrow{right:var(--spacing-12)}vt-select .select-wrapper.compact .field .clear{right:calc(var(--spacing-12) + var(--spacing-20) + var(--spacing-8))}vt-select .select-wrapper.compact .field:has(.clear) .control .mat-mdc-select-trigger{padding-right:calc(var(--spacing-12) + var(--spacing-20) + var(--spacing-8) + var(--spacing-24) + var(--spacing-8))}vt-select .select-wrapper.error .field,vt-select .select-wrapper.error .field:focus-within{border-color:var(--color-state-error);box-shadow:none}vt-select .select-wrapper.disabled .field,vt-select .select-wrapper.disabled .field:focus-within{border-color:var(--color-border-field);background-color:var(--color-bg-surface-tint);box-shadow:none}vt-select .select-wrapper.disabled .field .control,vt-select .select-wrapper.disabled .field:focus-within .control{color:var(--color-text-muted)}vt-select .select-wrapper.disabled .field .arrow,vt-select .select-wrapper.disabled .field:focus-within .arrow{color:var(--color-text-muted)}.vt-select-panel{box-sizing:border-box;padding:var(--space-icon-gap) 0;border:1px solid var(--color-border-subtle);border-radius:var(--radius-m)!important;background-color:var(--color-bg-surface)!important;box-shadow:0 var(--spacing-8) var(--spacing-24) calc(-1 * var(--spacing-4)) color-mix(in srgb,var(--color-text-primary) 12%,transparent)}.vt-select-panel .mat-mdc-option{min-height:44px;padding:0 var(--space-control-padding-x);color:var(--color-text-primary);font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.vt-select-panel .mat-mdc-option .mat-mdc-option-pseudo-checkbox,.vt-select-panel .mat-mdc-option .mat-pseudo-checkbox{display:none}.vt-select-panel .mat-mdc-option:hover:not(.mdc-list-item--disabled),.vt-select-panel .mat-mdc-option.mat-mdc-option-active:not(.mdc-list-item--disabled),.vt-select-panel .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled){background-color:var(--color-bg-surface-tint)}.vt-select-panel .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled){color:var(--color-text-accent)}.vt-select-panel .mat-mdc-option.mdc-list-item--disabled{color:var(--color-text-muted)}.vt-select-panel .mat-mdc-option .option-content{display:flex;align-items:center;gap:var(--space-gap-xs);min-width:0;width:100%}.vt-select-panel .mat-mdc-option .option-content .option-flag,.vt-select-panel .mat-mdc-option .option-content .option-avatar{flex:0 0 auto}.vt-select-panel .mat-mdc-option .option-content .option-flag{display:inline-block;width:20px;height:14px}.vt-select-panel .mat-mdc-option .option-content .option-avatar{width:24px;height:24px;border-radius:var(--radius-pill);object-fit:cover}.vt-select-panel .mat-mdc-option .option-content .option-copy{display:flex;flex:1 1 auto;flex-direction:column;min-width:0}.vt-select-panel .mat-mdc-option .option-content .option-copy .option-label,.vt-select-panel .mat-mdc-option .option-content .option-copy .option-description{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vt-select-panel .mat-mdc-option .option-content .option-copy .option-description{color:var(--color-text-secondary)}.vt-select-panel .panel-search{padding:var(--spacing-8) var(--spacing-12)}.vt-select-panel .panel-search .panel-search-input{box-sizing:border-box;width:100%;padding:var(--spacing-8) var(--spacing-12);border:1px solid var(--color-border-subtle);border-radius:var(--radius-m);background-color:var(--color-bg-surface);color:var(--color-text-primary);font-family:var(--typo-field-font-family);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}.vt-select-panel .panel-search .panel-search-input:focus-visible{outline:1px solid var(--color-accent-primary)}.vt-select-panel .selection-actions{display:flex;position:sticky;right:0;bottom:0;z-index:1;justify-content:center;gap:var(--spacing-8);padding:var(--spacing-8) var(--spacing-12);border-top:1px solid var(--color-border-subtle);background-color:var(--color-bg-surface)}.cdk-overlay-pane:has(.vt-select-panel){margin-top:var(--spacing-4)}\n"], dependencies: [{ kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "component", type: MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth", "canSelectNullableOptions"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "directive", type: MatSelectTrigger, selector: "mat-select-trigger" }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: VoteyButtonComponent, selector: "vt-button", inputs: ["disabled", "type", "variant", "size", "text", "ariaLabel", "ico", "badge", "tooltipText", "disabledNote", "ariaExpanded", "ariaHasPopup", "ariaControls", "iconColor"], outputs: ["pressed"] }, { kind: "component", type: VoteyChipComponent, selector: "vt-chip", inputs: ["label", "removeTooltip", "showRemove", "disabled"], outputs: ["removed"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteySelectComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-select", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [
                        MatOption,
                        MatSelect,
                        MatSelectTrigger,
                        MatTooltip,
                        ReactiveFormsModule,
                        VoteyButtonComponent,
                        VoteyChipComponent,
                        VoteyFormErrorComponent,
                        VoteyIconComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedLabel = label() | vtTranslate; @let selectDisabled = disabled()\r\n|| formControl.disabled; @let translatedTooltip = resolvedTooltip() |\r\nvtTranslate;\r\n\r\n<div\r\n  class=\"select-wrapper\"\r\n  [class.compact]=\"variant() === 'compact'\"\r\n  [class.disabled]=\"selectDisabled\"\r\n  [class.error]=\"hasError\"\r\n>\r\n  @if (label()) {\r\n  <label class=\"label\" [for]=\"id()\">\r\n    <vt-text\r\n      variant=\"label\"\r\n      [color]=\"selectDisabled ? 'muted' : 'primary'\"\r\n      [content]=\"translatedLabel\"\r\n    />\r\n  </label>\r\n  }\r\n\r\n  <div\r\n    class=\"field\"\r\n    [class.open]=\"isOpen()\"\r\n    matTooltipPosition=\"above\"\r\n    [matTooltipDisabled]=\"!translatedTooltip\"\r\n    [matTooltipShowDelay]=\"500\"\r\n    [matTooltip]=\"translatedTooltip\"\r\n    (click)=\"openSelect($event)\"\r\n  >\r\n    <mat-select\r\n      class=\"control\"\r\n      panelClass=\"vt-select-panel\"\r\n      panelWidth=\"auto\"\r\n      [id]=\"id()\"\r\n      [multiple]=\"multiple()\"\r\n      [disabled]=\"selectDisabled\"\r\n      [required]=\"isRequired\"\r\n      [formControl]=\"selectionControl\"\r\n      [placeholder]=\"placeholder() | vtTranslate\"\r\n      [attr.data-cy]=\"dataCy() || null\"\r\n      [attr.name]=\"name() || null\"\r\n      (selectionChange)=\"handleSelectionChange($event)\"\r\n      (openedChange)=\"handleOpenedChange($event)\"\r\n    >\r\n      @if (!multiple() && selectedOption; as option) {\r\n      <mat-select-trigger>\r\n        <span class=\"selected-option\">\r\n          @if (flagSelect() && option.flagClass) {\r\n          <span\r\n            class=\"option-flag\"\r\n            [class]=\"flagClass() + ' ' + option.flagClass\"\r\n          ></span>\r\n          } @if (option.avatarUrl) {\r\n          <img\r\n            class=\"option-avatar\"\r\n            [src]=\"option.avatarUrl\"\r\n            [alt]=\"option.label\"\r\n          />\r\n          }\r\n          <span class=\"option-label\">\r\n            @if (translateOptions()) {\r\n            {{ option.label | vtTranslate }}\r\n            } @else {\r\n            {{ option.label }}\r\n            }\r\n          </span>\r\n        </span>\r\n      </mat-select-trigger>\r\n      } @if (multiple() && showSelectionChips()) {\r\n      <mat-select-trigger>\r\n        @if (!selectedOptions.length) {\r\n        <span class=\"selected-option placeholder\">\r\n          {{ placeholder() | vtTranslate }}\r\n        </span>\r\n        }\r\n      </mat-select-trigger>\r\n      } @if (isSearchEnabled) {\r\n      <div class=\"panel-search\" (click)=\"stopPanelEvent($event)\">\r\n        <input\r\n          aria-label=\"Search\"\r\n          autocomplete=\"off\"\r\n          class=\"panel-search-input\"\r\n          type=\"search\"\r\n          [placeholder]=\"searchPlaceholder() | vtTranslate\"\r\n          [value]=\"searchTerm()\"\r\n          (input)=\"handleSearchInput($event)\"\r\n          (keydown)=\"stopPanelEvent($event)\"\r\n        />\r\n      </div>\r\n      } @for (option of filteredOptionViews(); track option.value) {\r\n      <mat-option [value]=\"option.value\" [disabled]=\"option.disabled\">\r\n        <div class=\"option-content\">\r\n          @if (flagSelect() && option.flagClass) {\r\n          <span\r\n            class=\"option-flag\"\r\n            [class]=\"flagClass() + ' ' + option.flagClass\"\r\n          ></span>\r\n          } @if (option.avatarUrl) {\r\n          <img\r\n            class=\"option-avatar\"\r\n            [src]=\"option.avatarUrl\"\r\n            [alt]=\"option.label\"\r\n          />\r\n          }\r\n          <span class=\"option-copy\">\r\n            <span class=\"option-label\">\r\n              @if (translateOptions()) {\r\n              {{ option.label | vtTranslate }}\r\n              } @else {\r\n              {{ option.label }}\r\n              }\r\n            </span>\r\n            @if (option.description) {\r\n            <span class=\"option-description\">{{ option.description }}</span>\r\n            }\r\n          </span>\r\n        </div>\r\n      </mat-option>\r\n      } @if (isSelectionActionMode) {\r\n      <div\r\n        class=\"selection-actions\"\r\n        (click)=\"stopPanelEvent($event)\"\r\n        (mousedown)=\"stopPanelEvent($event)\"\r\n      >\r\n        <vt-button\r\n          variant=\"secondary\"\r\n          [text]=\"selectionCancelText()\"\r\n          (pressed)=\"cancelSelectionActions()\"\r\n        />\r\n        <vt-button\r\n          [text]=\"selectionUpdateText()\"\r\n          (pressed)=\"updateSelectionActions()\"\r\n        />\r\n      </div>\r\n      }\r\n    </mat-select>\r\n    @if (canClear) {\r\n    <button\r\n      class=\"clear\"\r\n      type=\"button\"\r\n      [attr.aria-label]=\"clearTooltip() | vtTranslate\"\r\n      [attr.title]=\"clearTooltip() | vtTranslate\"\r\n      (click)=\"clearSelection($event)\"\r\n    >\r\n      <vt-icon ico=\"ui-close\" />\r\n    </button>\r\n    }\r\n    <vt-icon class=\"arrow\" ico=\"ui-chevron-down\" [class.open]=\"isOpen()\" />\r\n  </div>\r\n\r\n  @if (multiple() && showSelectionChips() && selectedOptions.length) {\r\n  <div class=\"chips\">\r\n    @for (option of selectedOptions; track option.value) {\r\n    <vt-chip\r\n      [label]=\"translateOptions() ? (option.label | vtTranslate) : option.label\"\r\n      [removeTooltip]=\"removeTooltip()\"\r\n      [disabled]=\"\r\n        selectDisabled || option.disabled || !isOptionRemovable(option)\r\n      \"\r\n      (removed)=\"removeSelection(option)\"\r\n    />\r\n    }\r\n  </div>\r\n  }\r\n\r\n  <vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n</div>\r\n", styles: ["vt-select{display:block;width:100%}vt-select .select-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}vt-select .select-wrapper .label{display:contents}vt-select .select-wrapper .field{box-sizing:border-box;display:flex;position:relative;align-items:center;width:100%;height:50px;padding:0;border:1px solid var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}vt-select .select-wrapper .field:focus-within{border:2px solid var(--color-accent-primary);box-shadow:none}vt-select .select-wrapper .field.open{border:2px solid var(--color-accent-primary);box-shadow:none}vt-select .select-wrapper .field .control{box-sizing:border-box;display:flex;align-items:center;width:100%;height:100%;color:var(--color-text-primary);font-family:var(--typo-field-font-family);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}vt-select .select-wrapper .field .control .mat-mdc-select-placeholder{color:var(--color-text-placeholder)}vt-select .select-wrapper .field .control .mat-mdc-select-arrow-wrapper{display:none}vt-select .select-wrapper .field .control .mat-mdc-select-trigger{box-sizing:border-box;display:flex;align-items:center;width:100%;height:100%;padding:0 calc(var(--space-field-padding-x) + var(--spacing-20) + var(--space-gap-xs)) 0 var(--space-field-padding-x)}vt-select .select-wrapper .field .control .selected-option{display:flex;align-items:center;gap:var(--space-gap-xs);min-width:0}vt-select .select-wrapper .field .control .selected-option .option-flag,vt-select .select-wrapper .field .control .selected-option .option-avatar{flex:0 0 auto}vt-select .select-wrapper .field .control .selected-option .option-flag{display:inline-block;width:20px;height:14px}vt-select .select-wrapper .field .control .selected-option .option-avatar{width:24px;height:24px;border-radius:var(--radius-pill);object-fit:cover}vt-select .select-wrapper .field .control .selected-option .option-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}vt-select .select-wrapper .field .arrow{display:block;position:absolute;top:50%;right:var(--space-field-padding-x);flex:0 0 auto;width:20px;height:20px;color:var(--color-accent-primary);pointer-events:none;transform:translateY(-50%);transition:transform .18s ease}vt-select .select-wrapper .field .arrow.open{transform:translateY(-50%) rotate(180deg)}vt-select .select-wrapper .field .clear{position:absolute;top:50%;right:calc(var(--space-field-padding-x) + var(--spacing-20) + var(--space-gap-xs));display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:24px;height:24px;padding:0;border:0;border-radius:var(--radius-pill);background:transparent;color:var(--color-text-muted);cursor:pointer;transform:translateY(-50%)}vt-select .select-wrapper .field .clear:focus-visible{outline:1px solid var(--color-accent-primary)}vt-select .select-wrapper .field .clear vt-icon{width:16px;height:16px}vt-select .select-wrapper .field:has(.clear) .control .mat-mdc-select-trigger{padding-right:calc(var(--space-field-padding-x) + var(--spacing-20) + var(--space-gap-xs) + var(--spacing-24) + var(--spacing-8))}vt-select .select-wrapper .chips{display:flex;flex-wrap:wrap;gap:var(--spacing-8)}vt-select .select-wrapper.compact .field{height:30px;border-radius:var(--radius-pill)}vt-select .select-wrapper.compact .field .control .mat-mdc-select-trigger{padding:0 calc(var(--spacing-12) + var(--spacing-20) + var(--spacing-8)) 0 var(--spacing-12)}vt-select .select-wrapper.compact .field .arrow{right:var(--spacing-12)}vt-select .select-wrapper.compact .field .clear{right:calc(var(--spacing-12) + var(--spacing-20) + var(--spacing-8))}vt-select .select-wrapper.compact .field:has(.clear) .control .mat-mdc-select-trigger{padding-right:calc(var(--spacing-12) + var(--spacing-20) + var(--spacing-8) + var(--spacing-24) + var(--spacing-8))}vt-select .select-wrapper.error .field,vt-select .select-wrapper.error .field:focus-within{border-color:var(--color-state-error);box-shadow:none}vt-select .select-wrapper.disabled .field,vt-select .select-wrapper.disabled .field:focus-within{border-color:var(--color-border-field);background-color:var(--color-bg-surface-tint);box-shadow:none}vt-select .select-wrapper.disabled .field .control,vt-select .select-wrapper.disabled .field:focus-within .control{color:var(--color-text-muted)}vt-select .select-wrapper.disabled .field .arrow,vt-select .select-wrapper.disabled .field:focus-within .arrow{color:var(--color-text-muted)}.vt-select-panel{box-sizing:border-box;padding:var(--space-icon-gap) 0;border:1px solid var(--color-border-subtle);border-radius:var(--radius-m)!important;background-color:var(--color-bg-surface)!important;box-shadow:0 var(--spacing-8) var(--spacing-24) calc(-1 * var(--spacing-4)) color-mix(in srgb,var(--color-text-primary) 12%,transparent)}.vt-select-panel .mat-mdc-option{min-height:44px;padding:0 var(--space-control-padding-x);color:var(--color-text-primary);font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.vt-select-panel .mat-mdc-option .mat-mdc-option-pseudo-checkbox,.vt-select-panel .mat-mdc-option .mat-pseudo-checkbox{display:none}.vt-select-panel .mat-mdc-option:hover:not(.mdc-list-item--disabled),.vt-select-panel .mat-mdc-option.mat-mdc-option-active:not(.mdc-list-item--disabled),.vt-select-panel .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled){background-color:var(--color-bg-surface-tint)}.vt-select-panel .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled){color:var(--color-text-accent)}.vt-select-panel .mat-mdc-option.mdc-list-item--disabled{color:var(--color-text-muted)}.vt-select-panel .mat-mdc-option .option-content{display:flex;align-items:center;gap:var(--space-gap-xs);min-width:0;width:100%}.vt-select-panel .mat-mdc-option .option-content .option-flag,.vt-select-panel .mat-mdc-option .option-content .option-avatar{flex:0 0 auto}.vt-select-panel .mat-mdc-option .option-content .option-flag{display:inline-block;width:20px;height:14px}.vt-select-panel .mat-mdc-option .option-content .option-avatar{width:24px;height:24px;border-radius:var(--radius-pill);object-fit:cover}.vt-select-panel .mat-mdc-option .option-content .option-copy{display:flex;flex:1 1 auto;flex-direction:column;min-width:0}.vt-select-panel .mat-mdc-option .option-content .option-copy .option-label,.vt-select-panel .mat-mdc-option .option-content .option-copy .option-description{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vt-select-panel .mat-mdc-option .option-content .option-copy .option-description{color:var(--color-text-secondary)}.vt-select-panel .panel-search{padding:var(--spacing-8) var(--spacing-12)}.vt-select-panel .panel-search .panel-search-input{box-sizing:border-box;width:100%;padding:var(--spacing-8) var(--spacing-12);border:1px solid var(--color-border-subtle);border-radius:var(--radius-m);background-color:var(--color-bg-surface);color:var(--color-text-primary);font-family:var(--typo-field-font-family);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}.vt-select-panel .panel-search .panel-search-input:focus-visible{outline:1px solid var(--color-accent-primary)}.vt-select-panel .selection-actions{display:flex;position:sticky;right:0;bottom:0;z-index:1;justify-content:center;gap:var(--spacing-8);padding:var(--spacing-8) var(--spacing-12);border-top:1px solid var(--color-border-subtle);background-color:var(--color-bg-surface)}.cdk-overlay-pane:has(.vt-select-panel){margin-top:var(--spacing-4)}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: true }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], bindLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "bindLabel", required: false }] }], bindValue: [{ type: i0.Input, args: [{ isSignal: true, alias: "bindValue", required: false }] }], id: [{ type: i0.Input, args: [{ isSignal: true, alias: "id", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], multiple: [{ type: i0.Input, args: [{ isSignal: true, alias: "multiple", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], flagSelect: [{ type: i0.Input, args: [{ isSignal: true, alias: "flagSelect", required: false }] }], clearable: [{ type: i0.Input, args: [{ isSignal: true, alias: "clearable", required: false }] }], clearTooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "clearTooltip", required: false }] }], showSelectionChips: [{ type: i0.Input, args: [{ isSignal: true, alias: "showSelectionChips", required: false }] }], searchable: [{ type: i0.Input, args: [{ isSignal: true, alias: "searchable", required: false }] }], searchPlaceholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "searchPlaceholder", required: false }] }], customSearchFn: [{ type: i0.Input, args: [{ isSignal: true, alias: "customSearchFn", required: false }] }], withSelectionActions: [{ type: i0.Input, args: [{ isSignal: true, alias: "withSelectionActions", required: false }] }], withSelectionSearch: [{ type: i0.Input, args: [{ isSignal: true, alias: "withSelectionSearch", required: false }] }], selectionCancelText: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectionCancelText", required: false }] }], selectionUpdateText: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectionUpdateText", required: false }] }], nonRemovableValues: [{ type: i0.Input, args: [{ isSignal: true, alias: "nonRemovableValues", required: false }] }], optionAvatarField: [{ type: i0.Input, args: [{ isSignal: true, alias: "optionAvatarField", required: false }] }], optionDescriptionField: [{ type: i0.Input, args: [{ isSignal: true, alias: "optionDescriptionField", required: false }] }], optionFlagField: [{ type: i0.Input, args: [{ isSignal: true, alias: "optionFlagField", required: false }] }], flagClass: [{ type: i0.Input, args: [{ isSignal: true, alias: "flagClass", required: false }] }], translateOptions: [{ type: i0.Input, args: [{ isSignal: true, alias: "translateOptions", required: false }] }], closeOnSelect: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnSelect", required: false }] }], tooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "tooltip", required: false }] }], disabledNote: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabledNote", required: false }] }], removeTooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "removeTooltip", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }], selectionChange: [{ type: i0.Output, args: ["selectionChange"] }], change: [{ type: i0.Output, args: ["change"] }], matSelect: [{ type: i0.ViewChild, args: [i0.forwardRef(() => MatSelect), { isSignal: true }] }] } });

const defaultFetchParams = {
    page: 0,
    size: 20,
};
const noPaginationParams = {
    page: 0,
    size: 2147483647,
};
const emptyPaginatedList = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: defaultFetchParams.size,
    loading: false,
};
const emptyPaginatedListLoading = {
    ...emptyPaginatedList,
    loading: true,
};

class VoteyPaginationComponent {
    page = input(defaultFetchParams.page, ...(ngDevMode ? [{ debugName: "page" }] : /* istanbul ignore next */ []));
    size = input(defaultFetchParams.size, ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    totalElements = input(0, ...(ngDevMode ? [{ debugName: "totalElements" }] : /* istanbul ignore next */ []));
    pageSizeOptions = input([10, 20, 50, 100], ...(ngDevMode ? [{ debugName: "pageSizeOptions" }] : /* istanbul ignore next */ []));
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    loading = input(false, ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    pagination = output();
    sizeControl = new FormControl(null);
    pageCount = computed(() => {
        const size = this.size();
        return size > 0 ? Math.ceil(Math.max(0, this.totalElements()) / size) : 0;
    }, ...(ngDevMode ? [{ debugName: "pageCount" }] : /* istanbul ignore next */ []));
    currentPage = computed(() => Math.min(Math.max(0, this.page()), Math.max(0, this.pageCount() - 1)), ...(ngDevMode ? [{ debugName: "currentPage" }] : /* istanbul ignore next */ []));
    visiblePages = computed(() => {
        const count = this.pageCount();
        if (count === 0)
            return [];
        const start = Math.max(0, Math.min(this.currentPage() - 2, count - 5));
        return Array.from({ length: Math.min(5, count - start) }, (_, index) => start + index);
    }, ...(ngDevMode ? [{ debugName: "visiblePages" }] : /* istanbul ignore next */ []));
    startItem = computed(() => this.totalElements() > 0 ? this.currentPage() * this.size() + 1 : 0, ...(ngDevMode ? [{ debugName: "startItem" }] : /* istanbul ignore next */ []));
    endItem = computed(() => Math.min((this.currentPage() + 1) * this.size(), Math.max(0, this.totalElements())), ...(ngDevMode ? [{ debugName: "endItem" }] : /* istanbul ignore next */ []));
    rangeText = computed(() => `${this.startItem()}–${this.endItem()} / ${this.totalElements()}`, ...(ngDevMode ? [{ debugName: "rangeText" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => {
            this.sizeControl.setValue(this.size(), { emitEvent: false });
        });
    }
    selectPage(page) {
        if (this.disabled() ||
            this.loading() ||
            page < 0 ||
            page >= this.pageCount() ||
            page === this.currentPage())
            return;
        this.pagination.emit({ page, size: this.size() });
    }
    selectSize(value) {
        if (this.disabled() || this.loading())
            return;
        if (typeof value !== "number" ||
            !this.pageSizeOptions().includes(value) ||
            value === this.size())
            return;
        this.pagination.emit({ page: 0, size: value });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyPaginationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyPaginationComponent, isStandalone: true, selector: "vt-pagination", inputs: { page: { classPropertyName: "page", publicName: "page", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, totalElements: { classPropertyName: "totalElements", publicName: "totalElements", isSignal: true, isRequired: false, transformFunction: null }, pageSizeOptions: { classPropertyName: "pageSizeOptions", publicName: "pageSizeOptions", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { pagination: "pagination" }, ngImport: i0, template: "@let translatedPageLabel = 'LABEL.PAGE' | vtTranslate; @let interactionDisabled\r\n= disabled() || loading(); @let previousDisabled = interactionDisabled ||\r\ncurrentPage() === 0; @let nextDisabled = interactionDisabled || currentPage() >=\r\npageCount() - 1;\r\n<nav\r\n  class=\"pagination\"\r\n  [attr.aria-label]=\"'LABEL.PAGINATION' | vtTranslate\"\r\n  [attr.aria-busy]=\"loading()\"\r\n>\r\n  <div class=\"range\" aria-live=\"polite\">\r\n    <vt-text variant=\"body-s\" color=\"secondary\" [content]=\"rangeText()\" />\r\n  </div>\r\n\r\n  <div class=\"pages\">\r\n    <button\r\n      class=\"page-button\"\r\n      type=\"button\"\r\n      [attr.aria-label]=\"'LABEL.PREVIOUS_PAGE' | vtTranslate\"\r\n      [disabled]=\"previousDisabled\"\r\n      (click)=\"selectPage(currentPage() - 1)\"\r\n    >\r\n      <span class=\"page-icon\"><vt-icon ico=\"ui-chevron-left\" /></span>\r\n    </button>\r\n    @for (pageIndex of visiblePages(); track pageIndex) {\r\n    <button\r\n      class=\"page-button\"\r\n      type=\"button\"\r\n      [class.selected]=\"pageIndex === currentPage()\"\r\n      [attr.aria-label]=\"translatedPageLabel + ' ' + (pageIndex + 1)\"\r\n      [attr.aria-current]=\"pageIndex === currentPage() ? 'page' : null\"\r\n      [disabled]=\"interactionDisabled\"\r\n      (click)=\"selectPage(pageIndex)\"\r\n    >\r\n      <vt-text\r\n        variant=\"action-s\"\n        [content]=\"pageIndex + 1\"\r\n        [color]=\"interactionDisabled ? 'muted' : 'primary'\"\r\n      />\r\n    </button>\r\n    }\r\n    <button\r\n      class=\"page-button\"\r\n      type=\"button\"\r\n      [attr.aria-label]=\"'LABEL.NEXT_PAGE' | vtTranslate\"\r\n      [disabled]=\"nextDisabled\"\r\n      (click)=\"selectPage(currentPage() + 1)\"\r\n    >\r\n      <span class=\"page-icon\"><vt-icon ico=\"ui-chevron-right\" /></span>\r\n    </button>\r\n  </div>\r\n\r\n  <div class=\"size-control\">\r\n    <vt-select\r\n      variant=\"compact\"\r\n      label=\"LABEL.ITEMS_PER_PAGE\"\r\n      [options]=\"pageSizeOptions()\"\r\n      [control]=\"sizeControl\"\r\n      [disabled]=\"interactionDisabled\"\r\n      [translateOptions]=\"false\"\r\n      (change)=\"selectSize($event)\"\r\n    />\r\n  </div>\r\n</nav>\r\n", styles: [":host{display:block;width:100%}.pagination{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;width:100%;height:64px;min-width:0;gap:var(--space-gap-s);padding:0 var(--space-inset-m);border:1px solid var(--color-border-subtle);border-radius:var(--radius-m);background:var(--color-bg-surface);color:var(--color-text-primary);font-family:inherit}.pagination .range{flex:1 1 0;white-space:nowrap}.pagination .pages{display:flex;align-items:center;gap:var(--space-gap-2xs)}.pagination .pages .page-button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid transparent;border-radius:var(--radius-m);background:transparent;color:inherit;cursor:pointer}.pagination .pages .page-button:hover:not(:disabled),.pagination .pages .page-button.selected{background:var(--color-accent-soft)}.pagination .pages .page-button.selected{border-color:var(--color-accent-primary)}.pagination .pages .page-button:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px}.pagination .pages .page-button:disabled{background:transparent;border-color:transparent;color:var(--color-text-muted);cursor:default}.pagination .pages .page-button .page-icon{display:block;width:16px;height:16px}.pagination .size-control{display:flex;flex:1 1 0;align-items:center;justify-content:flex-end}.pagination .size-control ::ng-deep vt-select{display:contents}.pagination .size-control ::ng-deep vt-select .select-wrapper{flex-direction:row;align-items:center;justify-content:flex-end}.pagination .size-control ::ng-deep vt-select .select-wrapper .field{width:120px}@media(max-width:600px){.pagination{gap:var(--space-gap-2xs)}.pagination .range{display:none}.pagination .pages .page-button:not(:first-child):not(:last-child):not(.selected){display:none}.pagination .size-control{flex:0 0 auto}.pagination .size-control vt-select{width:150px}}\n"], dependencies: [{ kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "component", type: VoteySelectComponent, selector: "vt-select", inputs: ["options", "variant", "label", "placeholder", "bindLabel", "bindValue", "id", "name", "dataCy", "multiple", "disabled", "flagSelect", "clearable", "clearTooltip", "showSelectionChips", "searchable", "searchPlaceholder", "customSearchFn", "withSelectionActions", "withSelectionSearch", "selectionCancelText", "selectionUpdateText", "nonRemovableValues", "optionAvatarField", "optionDescriptionField", "optionFlagField", "flagClass", "translateOptions", "closeOnSelect", "tooltip", "disabledNote", "removeTooltip", "ignoredErrors"], outputs: ["selectionChange", "change"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyPaginationComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-pagination", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        VoteyIconComponent,
                        VoteySelectComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedPageLabel = 'LABEL.PAGE' | vtTranslate; @let interactionDisabled\r\n= disabled() || loading(); @let previousDisabled = interactionDisabled ||\r\ncurrentPage() === 0; @let nextDisabled = interactionDisabled || currentPage() >=\r\npageCount() - 1;\r\n<nav\r\n  class=\"pagination\"\r\n  [attr.aria-label]=\"'LABEL.PAGINATION' | vtTranslate\"\r\n  [attr.aria-busy]=\"loading()\"\r\n>\r\n  <div class=\"range\" aria-live=\"polite\">\r\n    <vt-text variant=\"body-s\" color=\"secondary\" [content]=\"rangeText()\" />\r\n  </div>\r\n\r\n  <div class=\"pages\">\r\n    <button\r\n      class=\"page-button\"\r\n      type=\"button\"\r\n      [attr.aria-label]=\"'LABEL.PREVIOUS_PAGE' | vtTranslate\"\r\n      [disabled]=\"previousDisabled\"\r\n      (click)=\"selectPage(currentPage() - 1)\"\r\n    >\r\n      <span class=\"page-icon\"><vt-icon ico=\"ui-chevron-left\" /></span>\r\n    </button>\r\n    @for (pageIndex of visiblePages(); track pageIndex) {\r\n    <button\r\n      class=\"page-button\"\r\n      type=\"button\"\r\n      [class.selected]=\"pageIndex === currentPage()\"\r\n      [attr.aria-label]=\"translatedPageLabel + ' ' + (pageIndex + 1)\"\r\n      [attr.aria-current]=\"pageIndex === currentPage() ? 'page' : null\"\r\n      [disabled]=\"interactionDisabled\"\r\n      (click)=\"selectPage(pageIndex)\"\r\n    >\r\n      <vt-text\r\n        variant=\"action-s\"\n        [content]=\"pageIndex + 1\"\r\n        [color]=\"interactionDisabled ? 'muted' : 'primary'\"\r\n      />\r\n    </button>\r\n    }\r\n    <button\r\n      class=\"page-button\"\r\n      type=\"button\"\r\n      [attr.aria-label]=\"'LABEL.NEXT_PAGE' | vtTranslate\"\r\n      [disabled]=\"nextDisabled\"\r\n      (click)=\"selectPage(currentPage() + 1)\"\r\n    >\r\n      <span class=\"page-icon\"><vt-icon ico=\"ui-chevron-right\" /></span>\r\n    </button>\r\n  </div>\r\n\r\n  <div class=\"size-control\">\r\n    <vt-select\r\n      variant=\"compact\"\r\n      label=\"LABEL.ITEMS_PER_PAGE\"\r\n      [options]=\"pageSizeOptions()\"\r\n      [control]=\"sizeControl\"\r\n      [disabled]=\"interactionDisabled\"\r\n      [translateOptions]=\"false\"\r\n      (change)=\"selectSize($event)\"\r\n    />\r\n  </div>\r\n</nav>\r\n", styles: [":host{display:block;width:100%}.pagination{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;width:100%;height:64px;min-width:0;gap:var(--space-gap-s);padding:0 var(--space-inset-m);border:1px solid var(--color-border-subtle);border-radius:var(--radius-m);background:var(--color-bg-surface);color:var(--color-text-primary);font-family:inherit}.pagination .range{flex:1 1 0;white-space:nowrap}.pagination .pages{display:flex;align-items:center;gap:var(--space-gap-2xs)}.pagination .pages .page-button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid transparent;border-radius:var(--radius-m);background:transparent;color:inherit;cursor:pointer}.pagination .pages .page-button:hover:not(:disabled),.pagination .pages .page-button.selected{background:var(--color-accent-soft)}.pagination .pages .page-button.selected{border-color:var(--color-accent-primary)}.pagination .pages .page-button:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px}.pagination .pages .page-button:disabled{background:transparent;border-color:transparent;color:var(--color-text-muted);cursor:default}.pagination .pages .page-button .page-icon{display:block;width:16px;height:16px}.pagination .size-control{display:flex;flex:1 1 0;align-items:center;justify-content:flex-end}.pagination .size-control ::ng-deep vt-select{display:contents}.pagination .size-control ::ng-deep vt-select .select-wrapper{flex-direction:row;align-items:center;justify-content:flex-end}.pagination .size-control ::ng-deep vt-select .select-wrapper .field{width:120px}@media(max-width:600px){.pagination{gap:var(--space-gap-2xs)}.pagination .range{display:none}.pagination .pages .page-button:not(:first-child):not(:last-child):not(.selected){display:none}.pagination .size-control{flex:0 0 auto}.pagination .size-control vt-select{width:150px}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { page: [{ type: i0.Input, args: [{ isSignal: true, alias: "page", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], totalElements: [{ type: i0.Input, args: [{ isSignal: true, alias: "totalElements", required: false }] }], pageSizeOptions: [{ type: i0.Input, args: [{ isSignal: true, alias: "pageSizeOptions", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], pagination: [{ type: i0.Output, args: ["pagination"] }] } });

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

class VoteyRadioButtonComponent extends VoteyFormControlApplyDirective {
    translator = injectVoteyTranslator();
    optionContents = contentChildren(VoteyRadioOptionContentDirective, { ...(ngDevMode ? { debugName: "optionContents" } : /* istanbul ignore next */ {}), descendants: true });
    options = input.required(...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    groupName = input("", ...(ngDevMode ? [{ debugName: "groupName" }] : /* istanbul ignore next */ []));
    groupLabelPosition = input("after", ...(ngDevMode ? [{ debugName: "groupLabelPosition" }] : /* istanbul ignore next */ []));
    groupDisabled = input(false, ...(ngDevMode ? [{ debugName: "groupDisabled" }] : /* istanbul ignore next */ []));
    groupRequired = input(false, ...(ngDevMode ? [{ debugName: "groupRequired" }] : /* istanbul ignore next */ []));
    groupClass = input("", ...(ngDevMode ? [{ debugName: "groupClass" }] : /* istanbul ignore next */ []));
    tooltip = input("", ...(ngDevMode ? [{ debugName: "tooltip" }] : /* istanbul ignore next */ []));
    disabledNote = input("", ...(ngDevMode ? [{ debugName: "disabledNote" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    change = output();
    groupAccessibleLabel = computed(() => this.options()
        .map((option) => this.translator.translate(option.ariaLabel ?? option.label))
        .join(", "), ...(ngDevMode ? [{ debugName: "groupAccessibleLabel" }] : /* istanbul ignore next */ []));
    resolvedTooltip = computed(() => (this.groupDisabled() ? this.disabledNote() : this.tooltip()).trim(), ...(ngDevMode ? [{ debugName: "resolvedTooltip" }] : /* istanbul ignore next */ []));
    optionContentTemplates = computed(() => {
        const templates = {};
        for (const optionContent of this.optionContents()) {
            templates[optionContent.optionId()] = optionContent.templateRef;
        }
        return templates;
    }, ...(ngDevMode ? [{ debugName: "optionContentTemplates" }] : /* istanbul ignore next */ []));
    get errorKeys() {
        return this.formControl.invalid && this.formControl.touched
            ? Object.keys(this.formControl.errors ?? {})
            : [];
    }
    handleChange(event) {
        this.change.emit(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyRadioButtonComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyRadioButtonComponent, isStandalone: true, selector: "vt-radio-button", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: true, transformFunction: null }, groupName: { classPropertyName: "groupName", publicName: "groupName", isSignal: true, isRequired: false, transformFunction: null }, groupLabelPosition: { classPropertyName: "groupLabelPosition", publicName: "groupLabelPosition", isSignal: true, isRequired: false, transformFunction: null }, groupDisabled: { classPropertyName: "groupDisabled", publicName: "groupDisabled", isSignal: true, isRequired: false, transformFunction: null }, groupRequired: { classPropertyName: "groupRequired", publicName: "groupRequired", isSignal: true, isRequired: false, transformFunction: null }, groupClass: { classPropertyName: "groupClass", publicName: "groupClass", isSignal: true, isRequired: false, transformFunction: null }, tooltip: { classPropertyName: "tooltip", publicName: "tooltip", isSignal: true, isRequired: false, transformFunction: null }, disabledNote: { classPropertyName: "disabledNote", publicName: "disabledNote", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { change: "change" }, queries: [{ propertyName: "optionContents", predicate: VoteyRadioOptionContentDirective, descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "@let translatedTooltip = resolvedTooltip() | vtTranslate;\r\n<div\r\n  class=\"radio-group-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltip\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltip\"\r\n>\r\n  <mat-radio-group\r\n    [class]=\"groupClass()\"\r\n    [formControl]=\"formControl\"\r\n    [labelPosition]=\"groupLabelPosition()\"\r\n    [name]=\"groupName()\"\r\n    [required]=\"groupRequired()\"\r\n    [attr.aria-label]=\"groupAccessibleLabel()\"\r\n    (change)=\"handleChange($event)\"\r\n  >\r\n    @for (option of options(); track option.id ?? $index) { @let optionDisabled\r\n    = (option.disabled ?? false) || groupDisabled() || formControl.disabled;\r\n    <mat-radio-button\r\n      [class]=\"option.className ?? ''\"\r\n      [class.radio-error]=\"option.error ?? false\"\r\n      [disabled]=\"optionDisabled\"\r\n      [required]=\"option.required ?? false\"\r\n      [labelPosition]=\"option.labelPosition ?? groupLabelPosition()\"\r\n      [id]=\"option.id ?? ''\"\r\n      [value]=\"option.value\"\r\n      [aria-label]=\"(option.ariaLabel ?? option.label) | vtTranslate\"\r\n      [attr.data-cy]=\"option.dataCy ?? null\"\r\n    >\r\n      @if (option.label !== undefined) {\r\n      <span class=\"vt-radio-option-label\">\r\n        <vt-text\r\n          variant=\"body\"\r\n          [color]=\"optionDisabled ? 'muted' : 'primary'\"\r\n          [content]=\"option.label | vtTranslate\"\r\n        />\r\n      </span>\r\n      }\r\n    </mat-radio-button>\r\n    @if (formControl.value === option.value) { @if (option.id; as optionId) {\r\n    @if (optionContentTemplates()[optionId]; as optionContent) {\r\n    <div class=\"vt-radio-option-content\">\r\n      <ng-container [ngTemplateOutlet]=\"optionContent\" />\r\n    </div>\r\n    } } } }\r\n  </mat-radio-group>\r\n</div>\r\n\r\n<vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n", styles: ["vt-radio-button{display:inline-flex;flex-direction:column;align-items:flex-start;max-width:100%}vt-radio-button .radio-group-wrapper{display:inline-flex;max-width:100%}vt-radio-button .vt-radio-option-content{padding-inline-start:calc(20px + var(--space-gap-xs))}vt-radio-button .mat-mdc-radio-group{display:inline-flex;flex-direction:column;align-items:flex-start;gap:var(--space-gap-xs);max-width:100%}vt-radio-button .mat-mdc-radio-button{--mat-radio-touch-target-display: none;--mat-radio-state-layer-size: 20px;max-width:100%;min-width:0;--mat-radio-label-text-font: var(--typo-body-font-family);--mat-radio-label-text-size: var(--typo-body-font-size);--mat-radio-label-text-line-height: var(--typo-body-line-height);--mat-radio-label-text-tracking: var(--typo-body-letter-spacing);--mat-radio-label-text-weight: var(--typo-body-font-weight);--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button.mat-primary,vt-radio-button .mat-mdc-radio-button.mat-accent,vt-radio-button .mat-mdc-radio-button.mat-warn{--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button .mdc-radio{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-radio-button .mat-mdc-radio-button .mdc-radio__background{border-radius:var(--radius-m);background-color:var(--color-bg-surface)}vt-radio-button .mat-mdc-radio-button .mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button .mdc-radio__inner-circle{border-radius:var(--radius-m)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px}@media(pointer:fine){vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-accent-hover)}vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--color-accent-primary)}}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background{background-color:var(--color-bg-surface-tint)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px;border-color:var(--color-border-subtle)}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field{align-items:flex-start;max-width:100%;min-height:20px}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field>.mdc-label{align-self:flex-start;flex:1 1 auto;min-width:0;padding-inline-start:var(--space-gap-xs);padding-inline-end:0;font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);line-height:var(--typo-body-line-height);letter-spacing:var(--typo-body-letter-spacing);overflow-wrap:anywhere;white-space:normal}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-inline-start:0;padding-inline-end:var(--space-gap-xs)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .vt-radio-option-label{display:inline-block;max-width:100%}\n"], dependencies: [{ kind: "component", type: MatRadioButton, selector: "mat-radio-button", inputs: ["id", "name", "aria-label", "aria-labelledby", "aria-describedby", "disableRipple", "tabIndex", "checked", "value", "labelPosition", "disabled", "required", "color", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioButton"] }, { kind: "directive", type: MatRadioGroup, selector: "mat-radio-group", inputs: ["color", "name", "labelPosition", "value", "selected", "disabled", "required", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioGroup"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyRadioButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-radio-button", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [
                        MatRadioButton,
                        MatRadioGroup,
                        MatTooltip,
                        NgTemplateOutlet,
                        ReactiveFormsModule,
                        VoteyFormErrorComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedTooltip = resolvedTooltip() | vtTranslate;\r\n<div\r\n  class=\"radio-group-wrapper\"\r\n  matTooltipPosition=\"above\"\r\n  [matTooltipDisabled]=\"!translatedTooltip\"\r\n  [matTooltipShowDelay]=\"500\"\r\n  [matTooltip]=\"translatedTooltip\"\r\n>\r\n  <mat-radio-group\r\n    [class]=\"groupClass()\"\r\n    [formControl]=\"formControl\"\r\n    [labelPosition]=\"groupLabelPosition()\"\r\n    [name]=\"groupName()\"\r\n    [required]=\"groupRequired()\"\r\n    [attr.aria-label]=\"groupAccessibleLabel()\"\r\n    (change)=\"handleChange($event)\"\r\n  >\r\n    @for (option of options(); track option.id ?? $index) { @let optionDisabled\r\n    = (option.disabled ?? false) || groupDisabled() || formControl.disabled;\r\n    <mat-radio-button\r\n      [class]=\"option.className ?? ''\"\r\n      [class.radio-error]=\"option.error ?? false\"\r\n      [disabled]=\"optionDisabled\"\r\n      [required]=\"option.required ?? false\"\r\n      [labelPosition]=\"option.labelPosition ?? groupLabelPosition()\"\r\n      [id]=\"option.id ?? ''\"\r\n      [value]=\"option.value\"\r\n      [aria-label]=\"(option.ariaLabel ?? option.label) | vtTranslate\"\r\n      [attr.data-cy]=\"option.dataCy ?? null\"\r\n    >\r\n      @if (option.label !== undefined) {\r\n      <span class=\"vt-radio-option-label\">\r\n        <vt-text\r\n          variant=\"body\"\r\n          [color]=\"optionDisabled ? 'muted' : 'primary'\"\r\n          [content]=\"option.label | vtTranslate\"\r\n        />\r\n      </span>\r\n      }\r\n    </mat-radio-button>\r\n    @if (formControl.value === option.value) { @if (option.id; as optionId) {\r\n    @if (optionContentTemplates()[optionId]; as optionContent) {\r\n    <div class=\"vt-radio-option-content\">\r\n      <ng-container [ngTemplateOutlet]=\"optionContent\" />\r\n    </div>\r\n    } } } }\r\n  </mat-radio-group>\r\n</div>\r\n\r\n<vt-form-error [errors]=\"errorKeys\" [ignoredErrors]=\"ignoredErrors()\" />\r\n", styles: ["vt-radio-button{display:inline-flex;flex-direction:column;align-items:flex-start;max-width:100%}vt-radio-button .radio-group-wrapper{display:inline-flex;max-width:100%}vt-radio-button .vt-radio-option-content{padding-inline-start:calc(20px + var(--space-gap-xs))}vt-radio-button .mat-mdc-radio-group{display:inline-flex;flex-direction:column;align-items:flex-start;gap:var(--space-gap-xs);max-width:100%}vt-radio-button .mat-mdc-radio-button{--mat-radio-touch-target-display: none;--mat-radio-state-layer-size: 20px;max-width:100%;min-width:0;--mat-radio-label-text-font: var(--typo-body-font-family);--mat-radio-label-text-size: var(--typo-body-font-size);--mat-radio-label-text-line-height: var(--typo-body-line-height);--mat-radio-label-text-tracking: var(--typo-body-letter-spacing);--mat-radio-label-text-weight: var(--typo-body-font-weight);--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button.mat-primary,vt-radio-button .mat-mdc-radio-button.mat-accent,vt-radio-button .mat-mdc-radio-button.mat-warn{--mat-radio-selected-icon-color: var(--color-accent-primary);--mat-radio-selected-hover-icon-color: var(--color-accent-hover);--mat-radio-selected-focus-icon-color: var(--color-accent-primary);--mat-radio-selected-pressed-icon-color: var(--color-accent-primary);--mat-radio-unselected-icon-color: var(--color-border-strong);--mat-radio-unselected-hover-icon-color: var(--color-accent-hover);--mat-radio-unselected-focus-icon-color: var(--color-border-strong);--mat-radio-unselected-pressed-icon-color: var(--color-border-strong);--mat-radio-disabled-selected-icon-color: var(--color-text-muted);--mat-radio-disabled-selected-icon-opacity: 1;--mat-radio-disabled-unselected-icon-color: var(--color-border-subtle);--mat-radio-disabled-unselected-icon-opacity: 1;--mat-radio-label-text-color: var(--color-text-primary);--mat-radio-disabled-label-color: var(--color-text-muted);--mat-radio-ripple-color: var(--color-border-strong);--mat-radio-checked-ripple-color: var(--color-accent-primary)}vt-radio-button .mat-mdc-radio-button .mdc-radio{align-self:flex-start;flex-basis:20px;width:20px;height:20px;padding:0}vt-radio-button .mat-mdc-radio-button .mdc-radio__background{border-radius:var(--radius-m);background-color:var(--color-bg-surface)}vt-radio-button .mat-mdc-radio-button .mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button .mdc-radio__inner-circle{border-radius:var(--radius-m)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px}@media(pointer:fine){vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle,vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-accent-hover)}vt-radio-button .mat-mdc-radio-button:hover .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--color-accent-primary)}}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background{background-color:var(--color-bg-surface-tint)}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-width:1.5px}vt-radio-button .mat-mdc-radio-button .mdc-radio__native-control:disabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-width:2px;border-color:var(--color-border-subtle)}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field{align-items:flex-start;max-width:100%;min-height:20px}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field>.mdc-label{align-self:flex-start;flex:1 1 auto;min-width:0;padding-inline-start:var(--space-gap-xs);padding-inline-end:0;font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);line-height:var(--typo-body-line-height);letter-spacing:var(--typo-body-letter-spacing);overflow-wrap:anywhere;white-space:normal}vt-radio-button .mat-mdc-radio-button .mat-internal-form-field.mdc-form-field--align-end>.mdc-label{padding-inline-start:0;padding-inline-end:var(--space-gap-xs)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .mat-mdc-radio-button.radio-error .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--color-state-error)}vt-radio-button .vt-radio-option-label{display:inline-block;max-width:100%}\n"] }]
        }], propDecorators: { optionContents: [{ type: i0.ContentChildren, args: [i0.forwardRef(() => VoteyRadioOptionContentDirective), { ...{
                            descendants: true,
                        }, isSignal: true }] }], options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: true }] }], groupName: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupName", required: false }] }], groupLabelPosition: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupLabelPosition", required: false }] }], groupDisabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupDisabled", required: false }] }], groupRequired: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupRequired", required: false }] }], groupClass: [{ type: i0.Input, args: [{ isSignal: true, alias: "groupClass", required: false }] }], tooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "tooltip", required: false }] }], disabledNote: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabledNote", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }], change: [{ type: i0.Output, args: ["change"] }] } });

let nextTextAreaId = 0;
class VoteyTextAreaComponent extends VoteyFormControlApplyDirective {
    fallbackId = `vt-text-area-${++nextTextAreaId}`;
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    placeholder = input("", ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    helper = input("", ...(ngDevMode ? [{ debugName: "helper" }] : /* istanbul ignore next */ []));
    limitDescription = input("CHARACTER_LIMIT_DESCRIPTION", ...(ngDevMode ? [{ debugName: "limitDescription" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    spellcheck = input(true, { ...(ngDevMode ? { debugName: "spellcheck" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    minLength = input(null, ...(ngDevMode ? [{ debugName: "minLength" }] : /* istanbul ignore next */ []));
    maxLength = input(null, ...(ngDevMode ? [{ debugName: "maxLength" }] : /* istanbul ignore next */ []));
    id = input("", ...(ngDevMode ? [{ debugName: "id" }] : /* istanbul ignore next */ []));
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    ariaLabel = input("", ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    ariaDescribedby = input("", ...(ngDevMode ? [{ debugName: "ariaDescribedby" }] : /* istanbul ignore next */ []));
    dataCy = input("", ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    changed = output();
    keyDown = output();
    resolvedId = computed(() => this.id().trim() || this.fallbackId, ...(ngDevMode ? [{ debugName: "resolvedId" }] : /* istanbul ignore next */ []));
    helperId = computed(() => `${this.resolvedId()}-helper`, ...(ngDevMode ? [{ debugName: "helperId" }] : /* istanbul ignore next */ []));
    errorId = computed(() => `${this.resolvedId()}-error`, ...(ngDevMode ? [{ debugName: "errorId" }] : /* istanbul ignore next */ []));
    resolvedAriaDescribedby = computed(() => {
        const ids = [this.ariaDescribedby().trim()];
        if (this.helper() || this.maxLength() !== null)
            ids.push(this.helperId());
        return ids.filter(Boolean).join(" ") || null;
    }, ...(ngDevMode ? [{ debugName: "resolvedAriaDescribedby" }] : /* istanbul ignore next */ []));
    get isDisabled() {
        return this.disabled() || this.formControl.disabled;
    }
    get isRequired() {
        return this.formControl.hasValidator(Validators.required);
    }
    get hasError() {
        return (!this.isDisabled && this.formControl.invalid && this.formControl.touched);
    }
    get errorKeys() {
        return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
    }
    handleInput(event) {
        const textareaElement = event.target;
        this.changed.emit(textareaElement.value);
    }
    handleKeyDown(event) {
        this.keyDown.emit(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTextAreaComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyTextAreaComponent, isStandalone: true, selector: "vt-text-area", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, helper: { classPropertyName: "helper", publicName: "helper", isSignal: true, isRequired: false, transformFunction: null }, limitDescription: { classPropertyName: "limitDescription", publicName: "limitDescription", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, spellcheck: { classPropertyName: "spellcheck", publicName: "spellcheck", isSignal: true, isRequired: false, transformFunction: null }, minLength: { classPropertyName: "minLength", publicName: "minLength", isSignal: true, isRequired: false, transformFunction: null }, maxLength: { classPropertyName: "maxLength", publicName: "maxLength", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, ariaDescribedby: { classPropertyName: "ariaDescribedby", publicName: "ariaDescribedby", isSignal: true, isRequired: false, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { changed: "changed", keyDown: "keyDown" }, usesInheritance: true, ngImport: i0, template: "@let translatedLabel = label() | vtTranslate; @let accessibleName = ariaLabel()\r\n? (ariaLabel() | vtTranslate) : translatedLabel;\r\n\r\n<div\r\n  class=\"text-area-wrapper\"\r\n  [class.disabled]=\"isDisabled\"\r\n  [class.error]=\"hasError\"\r\n  [class.filled]=\"(formControl.value ?? '').length > 0\"\r\n>\r\n  @if (label()) {\r\n  <label class=\"label\" [for]=\"resolvedId()\">\r\n    <vt-text variant=\"label\" color=\"primary\" [content]=\"translatedLabel\" />\r\n  </label>\r\n  }\r\n\r\n  <div class=\"field\">\r\n    <textarea\r\n      class=\"control\"\r\n      [id]=\"resolvedId()\"\r\n      [name]=\"name()\"\r\n      [placeholder]=\"placeholder() | vtTranslate\"\r\n      [formControl]=\"formControl\"\r\n      [attr.disabled]=\"isDisabled ? '' : null\"\r\n      [required]=\"isRequired\"\r\n      [spellcheck]=\"spellcheck()\"\r\n      [attr.minlength]=\"minLength()\"\r\n      [attr.maxlength]=\"maxLength()\"\r\n      [attr.aria-label]=\"label() ? null : accessibleName || null\"\r\n      [attr.aria-describedby]=\"resolvedAriaDescribedby()\"\r\n      [attr.aria-invalid]=\"hasError ? true : null\"\r\n      [attr.aria-errormessage]=\"hasError ? errorId() : null\"\r\n      [attr.data-cy]=\"dataCy() || null\"\r\n      (input)=\"handleInput($event)\"\r\n      (keydown)=\"handleKeyDown($event)\"\r\n    ></textarea>\r\n  </div>\r\n\r\n  @let maxLengthValue = maxLength(); @if (helper()) {\r\n  <div class=\"helper\" [id]=\"helperId()\">\r\n    <vt-text\r\n      variant=\"caption-s\"\r\n      color=\"muted\"\r\n      [content]=\"helper() | vtTranslate\"\r\n    />\r\n  </div>\r\n  } @else if (maxLengthValue !== null) { @let translationParams = { max:\r\n  maxLengthValue };\r\n\r\n  <div class=\"helper\" [id]=\"helperId()\">\r\n    <vt-text\r\n      variant=\"caption-s\"\r\n      color=\"muted\"\r\n      [content]=\"limitDescription() | vtTranslate : translationParams\"\r\n    />\r\n  </div>\r\n  }\r\n\r\n  <vt-form-error\r\n    [id]=\"errorId()\"\r\n    [errors]=\"errorKeys\"\r\n    [ignoredErrors]=\"ignoredErrors()\"\r\n  />\r\n</div>\r\n", styles: [":host{display:block;width:100%}.text-area-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}.text-area-wrapper .field{box-sizing:border-box;width:100%;min-height:120px;max-height:320px;padding:var(--space-inset-s) var(--space-field-padding-x);overflow:hidden;border:1px solid var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}.text-area-wrapper .field:hover{border-color:var(--color-accent-hover)}.text-area-wrapper .field:focus-within{border-color:var(--color-accent-primary);box-shadow:inset 0 0 0 1px var(--color-accent-primary)}.text-area-wrapper .field .control{display:block;box-sizing:border-box;width:100%;min-height:calc(120px - 2 * var(--space-inset-s) - 2px);max-height:calc(320px - 2 * var(--space-inset-s) - 2px);padding:0;overflow-x:hidden;overflow-y:auto;border:0;outline:0;resize:none;field-sizing:content;background:transparent;color:var(--color-text-primary);font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.text-area-wrapper .field .control::placeholder{color:var(--color-text-placeholder);opacity:1}.text-area-wrapper.error .field,.text-area-wrapper.error .field:hover,.text-area-wrapper.error .field:focus-within{border-color:var(--color-state-error);box-shadow:none}.text-area-wrapper.disabled .field,.text-area-wrapper.disabled .field:hover,.text-area-wrapper.disabled .field:focus-within{border-color:var(--color-border-field);background-color:var(--color-bg-surface-tint);box-shadow:none}.text-area-wrapper.disabled .field .control,.text-area-wrapper.disabled .field:hover .control,.text-area-wrapper.disabled .field:focus-within .control{color:var(--color-text-muted);cursor:not-allowed}.text-area-wrapper.disabled .field .control::placeholder,.text-area-wrapper.disabled .field:hover .control::placeholder,.text-area-wrapper.disabled .field:focus-within .control::placeholder{color:var(--color-text-muted)}.text-area-wrapper .helper{white-space:normal}\n"], dependencies: [{ kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTextAreaComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-text-area", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        ReactiveFormsModule,
                        VoteyFormErrorComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedLabel = label() | vtTranslate; @let accessibleName = ariaLabel()\r\n? (ariaLabel() | vtTranslate) : translatedLabel;\r\n\r\n<div\r\n  class=\"text-area-wrapper\"\r\n  [class.disabled]=\"isDisabled\"\r\n  [class.error]=\"hasError\"\r\n  [class.filled]=\"(formControl.value ?? '').length > 0\"\r\n>\r\n  @if (label()) {\r\n  <label class=\"label\" [for]=\"resolvedId()\">\r\n    <vt-text variant=\"label\" color=\"primary\" [content]=\"translatedLabel\" />\r\n  </label>\r\n  }\r\n\r\n  <div class=\"field\">\r\n    <textarea\r\n      class=\"control\"\r\n      [id]=\"resolvedId()\"\r\n      [name]=\"name()\"\r\n      [placeholder]=\"placeholder() | vtTranslate\"\r\n      [formControl]=\"formControl\"\r\n      [attr.disabled]=\"isDisabled ? '' : null\"\r\n      [required]=\"isRequired\"\r\n      [spellcheck]=\"spellcheck()\"\r\n      [attr.minlength]=\"minLength()\"\r\n      [attr.maxlength]=\"maxLength()\"\r\n      [attr.aria-label]=\"label() ? null : accessibleName || null\"\r\n      [attr.aria-describedby]=\"resolvedAriaDescribedby()\"\r\n      [attr.aria-invalid]=\"hasError ? true : null\"\r\n      [attr.aria-errormessage]=\"hasError ? errorId() : null\"\r\n      [attr.data-cy]=\"dataCy() || null\"\r\n      (input)=\"handleInput($event)\"\r\n      (keydown)=\"handleKeyDown($event)\"\r\n    ></textarea>\r\n  </div>\r\n\r\n  @let maxLengthValue = maxLength(); @if (helper()) {\r\n  <div class=\"helper\" [id]=\"helperId()\">\r\n    <vt-text\r\n      variant=\"caption-s\"\r\n      color=\"muted\"\r\n      [content]=\"helper() | vtTranslate\"\r\n    />\r\n  </div>\r\n  } @else if (maxLengthValue !== null) { @let translationParams = { max:\r\n  maxLengthValue };\r\n\r\n  <div class=\"helper\" [id]=\"helperId()\">\r\n    <vt-text\r\n      variant=\"caption-s\"\r\n      color=\"muted\"\r\n      [content]=\"limitDescription() | vtTranslate : translationParams\"\r\n    />\r\n  </div>\r\n  }\r\n\r\n  <vt-form-error\r\n    [id]=\"errorId()\"\r\n    [errors]=\"errorKeys\"\r\n    [ignoredErrors]=\"ignoredErrors()\"\r\n  />\r\n</div>\r\n", styles: [":host{display:block;width:100%}.text-area-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}.text-area-wrapper .field{box-sizing:border-box;width:100%;min-height:120px;max-height:320px;padding:var(--space-inset-s) var(--space-field-padding-x);overflow:hidden;border:1px solid var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}.text-area-wrapper .field:hover{border-color:var(--color-accent-hover)}.text-area-wrapper .field:focus-within{border-color:var(--color-accent-primary);box-shadow:inset 0 0 0 1px var(--color-accent-primary)}.text-area-wrapper .field .control{display:block;box-sizing:border-box;width:100%;min-height:calc(120px - 2 * var(--space-inset-s) - 2px);max-height:calc(320px - 2 * var(--space-inset-s) - 2px);padding:0;overflow-x:hidden;overflow-y:auto;border:0;outline:0;resize:none;field-sizing:content;background:transparent;color:var(--color-text-primary);font-family:var(--typo-body-font-family);font-size:var(--typo-body-font-size);font-weight:var(--typo-body-font-weight);letter-spacing:var(--typo-body-letter-spacing);line-height:var(--typo-body-line-height)}.text-area-wrapper .field .control::placeholder{color:var(--color-text-placeholder);opacity:1}.text-area-wrapper.error .field,.text-area-wrapper.error .field:hover,.text-area-wrapper.error .field:focus-within{border-color:var(--color-state-error);box-shadow:none}.text-area-wrapper.disabled .field,.text-area-wrapper.disabled .field:hover,.text-area-wrapper.disabled .field:focus-within{border-color:var(--color-border-field);background-color:var(--color-bg-surface-tint);box-shadow:none}.text-area-wrapper.disabled .field .control,.text-area-wrapper.disabled .field:hover .control,.text-area-wrapper.disabled .field:focus-within .control{color:var(--color-text-muted);cursor:not-allowed}.text-area-wrapper.disabled .field .control::placeholder,.text-area-wrapper.disabled .field:hover .control::placeholder,.text-area-wrapper.disabled .field:focus-within .control::placeholder{color:var(--color-text-muted)}.text-area-wrapper .helper{white-space:normal}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], helper: [{ type: i0.Input, args: [{ isSignal: true, alias: "helper", required: false }] }], limitDescription: [{ type: i0.Input, args: [{ isSignal: true, alias: "limitDescription", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], spellcheck: [{ type: i0.Input, args: [{ isSignal: true, alias: "spellcheck", required: false }] }], minLength: [{ type: i0.Input, args: [{ isSignal: true, alias: "minLength", required: false }] }], maxLength: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxLength", required: false }] }], id: [{ type: i0.Input, args: [{ isSignal: true, alias: "id", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], ariaDescribedby: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaDescribedby", required: false }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }], changed: [{ type: i0.Output, args: ["changed"] }], keyDown: [{ type: i0.Output, args: ["keyDown"] }] } });

const VoteyInputVariants = ["boxed", "underline"];
const VoteyInputTypeNames = {
    text: "text",
    email: "email",
    password: "password",
    search: "search",
    tel: "tel",
    url: "url",
    number: "number",
};
const VoteyInputModes = [
    "none",
    "text",
    "decimal",
    "numeric",
    "tel",
    "search",
    "email",
    "url",
];
const VoteyInputTypes = Object.values(VoteyInputTypeNames);
let nextInputId = 0;
class VoteyInputComponent extends VoteyFormControlApplyDirective {
    fallbackId = `vt-input-${++nextInputId}`;
    variant = input("boxed", ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    type = input(VoteyInputTypeNames.text, ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
    label = input.required(...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    placeholder = input("", ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    helper = input("", ...(ngDevMode ? [{ debugName: "helper" }] : /* istanbul ignore next */ []));
    icon = input("", ...(ngDevMode ? [{ debugName: "icon" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    id = input("", ...(ngDevMode ? [{ debugName: "id" }] : /* istanbul ignore next */ []));
    name = input("", ...(ngDevMode ? [{ debugName: "name" }] : /* istanbul ignore next */ []));
    inputMode = input("", ...(ngDevMode ? [{ debugName: "inputMode" }] : /* istanbul ignore next */ []));
    min = input(null, ...(ngDevMode ? [{ debugName: "min" }] : /* istanbul ignore next */ []));
    max = input(null, ...(ngDevMode ? [{ debugName: "max" }] : /* istanbul ignore next */ []));
    minLength = input(null, ...(ngDevMode ? [{ debugName: "minLength" }] : /* istanbul ignore next */ []));
    maxLength = input(500, ...(ngDevMode ? [{ debugName: "maxLength" }] : /* istanbul ignore next */ []));
    pattern = input("", ...(ngDevMode ? [{ debugName: "pattern" }] : /* istanbul ignore next */ []));
    trimmer = input(null, ...(ngDevMode ? [{ debugName: "trimmer" }] : /* istanbul ignore next */ []));
    ariaLabel = input("", ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    ariaDescribedby = input("", ...(ngDevMode ? [{ debugName: "ariaDescribedby" }] : /* istanbul ignore next */ []));
    dataCy = input("", ...(ngDevMode ? [{ debugName: "dataCy" }] : /* istanbul ignore next */ []));
    ignoredErrors = input([], ...(ngDevMode ? [{ debugName: "ignoredErrors" }] : /* istanbul ignore next */ []));
    showErrors = input(true, { ...(ngDevMode ? { debugName: "showErrors" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    keyDown = output();
    resolvedId = computed(() => this.id().trim() || this.fallbackId, ...(ngDevMode ? [{ debugName: "resolvedId" }] : /* istanbul ignore next */ []));
    helperId = computed(() => `${this.resolvedId()}-helper`, ...(ngDevMode ? [{ debugName: "helperId" }] : /* istanbul ignore next */ []));
    errorId = computed(() => `${this.resolvedId()}-error`, ...(ngDevMode ? [{ debugName: "errorId" }] : /* istanbul ignore next */ []));
    resolvedAriaDescribedby = computed(() => {
        const ids = [this.ariaDescribedby().trim()];
        if (this.shouldShowHelper)
            ids.push(this.helperId());
        return ids.filter(Boolean).join(" ") || null;
    }, ...(ngDevMode ? [{ debugName: "resolvedAriaDescribedby" }] : /* istanbul ignore next */ []));
    get isDisabled() {
        return this.disabled() || this.formControl.disabled;
    }
    get isRequired() {
        return this.formControl.hasValidator(Validators.required);
    }
    get hasError() {
        return (this.showErrors() &&
            !this.isDisabled &&
            this.formControl.invalid &&
            this.formControl.touched);
    }
    get hasValue() {
        return (this.formControl.value ?? "").length > 0;
    }
    get shouldShowHelper() {
        return this.helper().length > 0;
    }
    get showFormErrors() {
        return this.hasError && !this.shouldShowHelper;
    }
    get helperColor() {
        return this.hasError ? "error" : "muted";
    }
    get errorKeys() {
        return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
    }
    handleBlur() {
        const value = this.formControl.value;
        const trimmer = this.trimmer();
        if (value !== null && trimmer) {
            const trimmedValue = trimmer(value);
            if (trimmedValue !== value)
                this.formControl.setValue(trimmedValue);
        }
    }
    handleKeyDown(event) {
        this.keyDown.emit(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyInputComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyInputComponent, isStandalone: true, selector: "vt-input", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, helper: { classPropertyName: "helper", publicName: "helper", isSignal: true, isRequired: false, transformFunction: null }, icon: { classPropertyName: "icon", publicName: "icon", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, inputMode: { classPropertyName: "inputMode", publicName: "inputMode", isSignal: true, isRequired: false, transformFunction: null }, min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null }, minLength: { classPropertyName: "minLength", publicName: "minLength", isSignal: true, isRequired: false, transformFunction: null }, maxLength: { classPropertyName: "maxLength", publicName: "maxLength", isSignal: true, isRequired: false, transformFunction: null }, pattern: { classPropertyName: "pattern", publicName: "pattern", isSignal: true, isRequired: false, transformFunction: null }, trimmer: { classPropertyName: "trimmer", publicName: "trimmer", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, ariaDescribedby: { classPropertyName: "ariaDescribedby", publicName: "ariaDescribedby", isSignal: true, isRequired: false, transformFunction: null }, dataCy: { classPropertyName: "dataCy", publicName: "dataCy", isSignal: true, isRequired: false, transformFunction: null }, ignoredErrors: { classPropertyName: "ignoredErrors", publicName: "ignoredErrors", isSignal: true, isRequired: false, transformFunction: null }, showErrors: { classPropertyName: "showErrors", publicName: "showErrors", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { keyDown: "keyDown" }, usesInheritance: true, ngImport: i0, template: "@let translatedLabel = label() | vtTranslate; @let accessibleName = ariaLabel()\r\n? (ariaLabel() | vtTranslate) : translatedLabel;\r\n\r\n<div\r\n  class=\"input-wrapper\"\r\n  [class.underline]=\"variant() === 'underline'\"\r\n  [class.disabled]=\"isDisabled\"\r\n  [class.error]=\"hasError\"\r\n  [class.filled]=\"hasValue\"\r\n>\r\n  @if (label()) {\r\n  <label class=\"label\" [for]=\"resolvedId()\">\r\n    <vt-text\r\n      variant=\"label\"\r\n      [color]=\"isDisabled ? 'muted' : 'primary'\"\r\n      [content]=\"translatedLabel\"\r\n    />\r\n  </label>\r\n  }\r\n\r\n  <div class=\"field\">\r\n    <input\r\n      class=\"control\"\r\n      [id]=\"resolvedId()\"\r\n      [name]=\"name()\"\r\n      [type]=\"type()\"\r\n      [formControl]=\"formControl\"\r\n      [placeholder]=\"placeholder() | vtTranslate\"\r\n      [attr.disabled]=\"isDisabled ? '' : null\"\r\n      [required]=\"isRequired\"\r\n      [attr.inputmode]=\"inputMode() || null\"\r\n      [attr.min]=\"min()\"\r\n      [attr.max]=\"max()\"\r\n      [attr.minlength]=\"minLength()\"\r\n      [attr.maxlength]=\"maxLength()\"\r\n      [attr.pattern]=\"pattern() || null\"\r\n      [attr.aria-label]=\"label() ? null : accessibleName || null\"\r\n      [attr.aria-describedby]=\"resolvedAriaDescribedby()\"\r\n      [attr.aria-invalid]=\"hasError ? true : null\"\r\n      [attr.aria-errormessage]=\"\r\n        hasError ? (shouldShowHelper ? helperId() : errorId()) : null\r\n      \"\r\n      [attr.data-cy]=\"dataCy() || null\"\r\n      (blur)=\"handleBlur()\"\r\n      (keydown)=\"handleKeyDown($event)\"\r\n    />\r\n\r\n    @let currentIcon = icon(); @if (currentIcon) {\r\n    <vt-icon class=\"icon\" [ico]=\"currentIcon\" />\r\n    }\r\n  </div>\r\n\r\n  @if (shouldShowHelper) {\r\n  <div class=\"helper\" [id]=\"helperId()\">\r\n    <vt-text\r\n      variant=\"caption-s\"\r\n      [color]=\"helperColor\"\r\n      [content]=\"helper() | vtTranslate\"\r\n    />\r\n  </div>\r\n  }\r\n\r\n  <vt-form-error\r\n    [id]=\"errorId()\"\r\n    [errors]=\"showFormErrors ? errorKeys : []\"\r\n    [ignoredErrors]=\"ignoredErrors()\"\r\n  />\r\n</div>\r\n", styles: [":host{display:block;width:100%}.input-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}.input-wrapper .field{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-gap-xs);width:100%;height:var(--space-field-height);padding:0 var(--space-field-padding-x);overflow:hidden;border:1px solid var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}.input-wrapper .field:hover{border-color:var(--color-accent-hover)}.input-wrapper .field:focus-within{border:2px solid var(--color-accent-primary);box-shadow:none}.input-wrapper .field .control{flex:1 1 auto;min-width:0;height:100%;padding:0;border:0;outline:0;background:transparent;color:var(--color-text-primary);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}.input-wrapper .field .control::placeholder{color:var(--color-text-placeholder);opacity:1}.input-wrapper .field .control:-webkit-autofill,.input-wrapper .field .control:-webkit-autofill:hover,.input-wrapper .field .control:-webkit-autofill:focus,.input-wrapper .field .control:autofill{-webkit-box-shadow:0 0 0 1000px var(--color-bg-surface) inset;box-shadow:0 0 0 1000px var(--color-bg-surface) inset;-webkit-text-fill-color:var(--color-text-primary);caret-color:var(--color-text-primary)}.input-wrapper .field .icon{flex:0 0 var(--spacing-20);width:var(--spacing-20);height:var(--spacing-20);color:var(--color-text-primary)}.input-wrapper.underline .field{height:var(--spacing-40);padding:0 var(--space-field-padding-x);border:0;border-bottom:1px solid var(--color-border-field);border-radius:0;background-color:transparent}.input-wrapper.underline .field:focus-within{border-bottom:2px solid var(--color-accent-primary);box-shadow:none}.input-wrapper.error .field,.input-wrapper.error .field:focus-within{border:1px solid var(--color-state-error);box-shadow:none}.input-wrapper.error.underline .field,.input-wrapper.error.underline .field:focus-within{border:0;border-bottom:1px solid var(--color-state-error)}.input-wrapper.disabled .field,.input-wrapper.disabled .field:hover,.input-wrapper.disabled .field:focus-within{border:1px solid var(--color-border-field);background-color:var(--color-bg-surface-tint);box-shadow:none}.input-wrapper.disabled .field .control,.input-wrapper.disabled .field .icon,.input-wrapper.disabled .field:hover .control,.input-wrapper.disabled .field:hover .icon,.input-wrapper.disabled .field:focus-within .control,.input-wrapper.disabled .field:focus-within .icon{color:var(--color-text-muted)}.input-wrapper.disabled .field .control,.input-wrapper.disabled .field:hover .control,.input-wrapper.disabled .field:focus-within .control{cursor:not-allowed}.input-wrapper.disabled .field .control::placeholder,.input-wrapper.disabled .field:hover .control::placeholder,.input-wrapper.disabled .field:focus-within .control::placeholder{color:var(--color-text-muted)}.input-wrapper.disabled.underline .field{border:0;border-bottom:1px solid var(--color-border-field);background-color:transparent}.input-wrapper .helper{margin:0;white-space:normal}:host ::ng-deep .input-wrapper.disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep .input-wrapper.disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}\n"], dependencies: [{ kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyInputComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-input", changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        ReactiveFormsModule,
                        VoteyFormErrorComponent,
                        VoteyIconComponent,
                        VoteyTextComponent,
                        VoteyTranslatePipe,
                    ], template: "@let translatedLabel = label() | vtTranslate; @let accessibleName = ariaLabel()\r\n? (ariaLabel() | vtTranslate) : translatedLabel;\r\n\r\n<div\r\n  class=\"input-wrapper\"\r\n  [class.underline]=\"variant() === 'underline'\"\r\n  [class.disabled]=\"isDisabled\"\r\n  [class.error]=\"hasError\"\r\n  [class.filled]=\"hasValue\"\r\n>\r\n  @if (label()) {\r\n  <label class=\"label\" [for]=\"resolvedId()\">\r\n    <vt-text\r\n      variant=\"label\"\r\n      [color]=\"isDisabled ? 'muted' : 'primary'\"\r\n      [content]=\"translatedLabel\"\r\n    />\r\n  </label>\r\n  }\r\n\r\n  <div class=\"field\">\r\n    <input\r\n      class=\"control\"\r\n      [id]=\"resolvedId()\"\r\n      [name]=\"name()\"\r\n      [type]=\"type()\"\r\n      [formControl]=\"formControl\"\r\n      [placeholder]=\"placeholder() | vtTranslate\"\r\n      [attr.disabled]=\"isDisabled ? '' : null\"\r\n      [required]=\"isRequired\"\r\n      [attr.inputmode]=\"inputMode() || null\"\r\n      [attr.min]=\"min()\"\r\n      [attr.max]=\"max()\"\r\n      [attr.minlength]=\"minLength()\"\r\n      [attr.maxlength]=\"maxLength()\"\r\n      [attr.pattern]=\"pattern() || null\"\r\n      [attr.aria-label]=\"label() ? null : accessibleName || null\"\r\n      [attr.aria-describedby]=\"resolvedAriaDescribedby()\"\r\n      [attr.aria-invalid]=\"hasError ? true : null\"\r\n      [attr.aria-errormessage]=\"\r\n        hasError ? (shouldShowHelper ? helperId() : errorId()) : null\r\n      \"\r\n      [attr.data-cy]=\"dataCy() || null\"\r\n      (blur)=\"handleBlur()\"\r\n      (keydown)=\"handleKeyDown($event)\"\r\n    />\r\n\r\n    @let currentIcon = icon(); @if (currentIcon) {\r\n    <vt-icon class=\"icon\" [ico]=\"currentIcon\" />\r\n    }\r\n  </div>\r\n\r\n  @if (shouldShowHelper) {\r\n  <div class=\"helper\" [id]=\"helperId()\">\r\n    <vt-text\r\n      variant=\"caption-s\"\r\n      [color]=\"helperColor\"\r\n      [content]=\"helper() | vtTranslate\"\r\n    />\r\n  </div>\r\n  }\r\n\r\n  <vt-form-error\r\n    [id]=\"errorId()\"\r\n    [errors]=\"showFormErrors ? errorKeys : []\"\r\n    [ignoredErrors]=\"ignoredErrors()\"\r\n  />\r\n</div>\r\n", styles: [":host{display:block;width:100%}.input-wrapper{display:flex;flex-direction:column;align-items:stretch;gap:var(--space-stack-gap-s);width:100%}.input-wrapper .field{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-gap-xs);width:100%;height:var(--space-field-height);padding:0 var(--space-field-padding-x);overflow:hidden;border:1px solid var(--color-border-field);border-radius:var(--radius-m);background-color:var(--color-bg-surface);transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}.input-wrapper .field:hover{border-color:var(--color-accent-hover)}.input-wrapper .field:focus-within{border:2px solid var(--color-accent-primary);box-shadow:none}.input-wrapper .field .control{flex:1 1 auto;min-width:0;height:100%;padding:0;border:0;outline:0;background:transparent;color:var(--color-text-primary);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);letter-spacing:var(--typo-field-letter-spacing);line-height:var(--typo-field-line-height)}.input-wrapper .field .control::placeholder{color:var(--color-text-placeholder);opacity:1}.input-wrapper .field .control:-webkit-autofill,.input-wrapper .field .control:-webkit-autofill:hover,.input-wrapper .field .control:-webkit-autofill:focus,.input-wrapper .field .control:autofill{-webkit-box-shadow:0 0 0 1000px var(--color-bg-surface) inset;box-shadow:0 0 0 1000px var(--color-bg-surface) inset;-webkit-text-fill-color:var(--color-text-primary);caret-color:var(--color-text-primary)}.input-wrapper .field .icon{flex:0 0 var(--spacing-20);width:var(--spacing-20);height:var(--spacing-20);color:var(--color-text-primary)}.input-wrapper.underline .field{height:var(--spacing-40);padding:0 var(--space-field-padding-x);border:0;border-bottom:1px solid var(--color-border-field);border-radius:0;background-color:transparent}.input-wrapper.underline .field:focus-within{border-bottom:2px solid var(--color-accent-primary);box-shadow:none}.input-wrapper.error .field,.input-wrapper.error .field:focus-within{border:1px solid var(--color-state-error);box-shadow:none}.input-wrapper.error.underline .field,.input-wrapper.error.underline .field:focus-within{border:0;border-bottom:1px solid var(--color-state-error)}.input-wrapper.disabled .field,.input-wrapper.disabled .field:hover,.input-wrapper.disabled .field:focus-within{border:1px solid var(--color-border-field);background-color:var(--color-bg-surface-tint);box-shadow:none}.input-wrapper.disabled .field .control,.input-wrapper.disabled .field .icon,.input-wrapper.disabled .field:hover .control,.input-wrapper.disabled .field:hover .icon,.input-wrapper.disabled .field:focus-within .control,.input-wrapper.disabled .field:focus-within .icon{color:var(--color-text-muted)}.input-wrapper.disabled .field .control,.input-wrapper.disabled .field:hover .control,.input-wrapper.disabled .field:focus-within .control{cursor:not-allowed}.input-wrapper.disabled .field .control::placeholder,.input-wrapper.disabled .field:hover .control::placeholder,.input-wrapper.disabled .field:focus-within .control::placeholder{color:var(--color-text-muted)}.input-wrapper.disabled.underline .field{border:0;border-bottom:1px solid var(--color-border-field);background-color:transparent}.input-wrapper .helper{margin:0;white-space:normal}:host ::ng-deep .input-wrapper.disabled .icon svg path:not([fill=none]){fill:var(--color-text-muted)}:host ::ng-deep .input-wrapper.disabled .icon svg [stroke]:not([stroke=none]){stroke:var(--color-text-muted)}\n"] }]
        }], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], helper: [{ type: i0.Input, args: [{ isSignal: true, alias: "helper", required: false }] }], icon: [{ type: i0.Input, args: [{ isSignal: true, alias: "icon", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], id: [{ type: i0.Input, args: [{ isSignal: true, alias: "id", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], inputMode: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputMode", required: false }] }], min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], minLength: [{ type: i0.Input, args: [{ isSignal: true, alias: "minLength", required: false }] }], maxLength: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxLength", required: false }] }], pattern: [{ type: i0.Input, args: [{ isSignal: true, alias: "pattern", required: false }] }], trimmer: [{ type: i0.Input, args: [{ isSignal: true, alias: "trimmer", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], ariaDescribedby: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaDescribedby", required: false }] }], dataCy: [{ type: i0.Input, args: [{ isSignal: true, alias: "dataCy", required: false }] }], ignoredErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "ignoredErrors", required: false }] }], showErrors: [{ type: i0.Input, args: [{ isSignal: true, alias: "showErrors", required: false }] }], keyDown: [{ type: i0.Output, args: ["keyDown"] }] } });

const INVALID_FORMAT = { value: null, error: "format" };
const INVALID_DATE = { value: null, error: "date" };
const INVALID_TIME = { value: null, error: "time" };
function dateFromParts(parts) {
    const date = new Date(0);
    date.setFullYear(parts.year, parts.month - 1, parts.day);
    date.setHours(0, 0, 0, 0);
    return date;
}
function formatCalendarDate(parts) {
    return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}
function formatTime(parts) {
    return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}
function calendarDayKey(parts) {
    const date = new Date(0);
    date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime();
}
function parseCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match)
        return INVALID_FORMAT;
    return validatedDate(Number(match[1]), Number(match[2]), Number(match[3]));
}
function parseDateInput(value) {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
    if (!match)
        return INVALID_FORMAT;
    return validatedDate(Number(match[3]), Number(match[2]), Number(match[1]));
}
function validatedDate(year, month, day) {
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31)
        return INVALID_DATE;
    const date = new Date(calendarDayKey({ year, month, day }));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
        return INVALID_DATE;
    }
    return { value: { year, month, day }, error: null };
}
function parseTimeInput(value) {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match)
        return INVALID_FORMAT;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59)
        return INVALID_TIME;
    return { value: { hour, minute }, error: null };
}
function parseDateTimeInput(value) {
    const match = /^(\d{2}\.\d{2}\.\d{4}), (\d{2}:\d{2})$/.exec(value);
    if (!match)
        return INVALID_FORMAT;
    const date = parseDateInput(match[1]);
    if (date.error)
        return { value: null, error: date.error };
    const time = parseTimeInput(match[2]);
    if (time.error)
        return { value: null, error: time.error };
    const parts = { ...date.value, ...time.value };
    return localInstant(parts) === null ? INVALID_TIME : { value: parts, error: null };
}
/** Returns the first occurrence of an ambiguous local minute; rejects a DST gap. */
function localInstant(parts) {
    const instant = dateFromParts(parts);
    instant.setHours(parts.hour, parts.minute, 0, 0);
    return instant.getFullYear() === parts.year &&
        instant.getMonth() + 1 === parts.month &&
        instant.getDate() === parts.day &&
        instant.getHours() === parts.hour &&
        instant.getMinutes() === parts.minute ? instant : null;
}
function canonicalInstant(parts) {
    return localInstant(parts)?.toISOString() ?? null;
}
function timeSuggestions(stepMinutes) {
    if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > 60)
        return [];
    return Array.from({ length: Math.ceil(1440 / stepMinutes) }, (_, index) => {
        const minuteOfDay = index * stepMinutes;
        return formatTime({ hour: Math.floor(minuteOfDay / 60), minute: minuteOfDay % 60 });
    });
}
function isWithinTimeRange(value, min, max) {
    const minute = value.hour * 60 + value.minute;
    return (min === null || minute >= min.hour * 60 + min.minute) &&
        (max === null || minute <= max.hour * 60 + max.minute);
}
function isTimeWithinBounds(value, min, max) {
    const parsed = parseTimeInput(value);
    if (parsed.error)
        return false;
    return isWithinTimeRange(parsed.value, min === null ? null : parseTimeInput(min).value, max === null ? null : parseTimeInput(max).value);
}
function parseInstant(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
    if (!match || parseCalendarDate(`${match[1]}-${match[2]}-${match[3]}`).error)
        return null;
    if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6]) > 59)
        return null;
    if (match[8] !== "Z") {
        const offset = match[8].slice(1).split(":").map(Number);
        if (offset[0] > 23 || offset[1] > 59)
            return null;
    }
    const time = new Date(value);
    return Number.isNaN(time.getTime()) ? null : time;
}
function dateParts(value) {
    return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
}
function timeParts(value) {
    return { hour: value.getHours(), minute: value.getMinutes() };
}
function isWithinDateRange(date, min, max) {
    const key = calendarDayKey(date);
    return (min === null || key >= calendarDayKey(min)) &&
        (max === null || key <= calendarDayKey(max));
}
function isWithinInstantRange(instant, min, max) {
    const value = instant.getTime();
    return (min === null || value >= min.getTime()) &&
        (max === null || value <= max.getTime());
}
function firstAllowedTime(day, min, max, stepMinutes, policy, previousTime = null) {
    if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > 60)
        return null;
    if (previousTime) {
        const existing = localInstant({ ...day, ...previousTime });
        const minuteOfDay = previousTime.hour * 60 + previousTime.minute;
        if (existing && isWithinInstantRange(existing, min, max) &&
            (policy === "allowManual" || minuteOfDay % stepMinutes === 0))
            return previousTime;
    }
    for (let minuteOfDay = 0; minuteOfDay < 1440; minuteOfDay += 1) {
        if (policy === "listOnly" && minuteOfDay % stepMinutes !== 0)
            continue;
        const time = { hour: Math.floor(minuteOfDay / 60), minute: minuteOfDay % 60 };
        const instant = localInstant({ ...day, ...time });
        if (instant && isWithinInstantRange(instant, min, max))
            return time;
    }
    return null;
}
function validateTimeConfig(stepMinutes, policy, min = null, max = null) {
    if (!Number.isInteger(stepMinutes) || stepMinutes < 1 || stepMinutes > 60) {
        return "invalidStep";
    }
    if (policy !== "allowManual" && policy !== "listOnly")
        return "invalidPolicy";
    const low = min === null ? null : parseTimeInput(min).value;
    const high = max === null ? null : parseTimeInput(max).value;
    if (min !== null && low === null)
        return "invalidMin";
    if (max !== null && high === null)
        return "invalidMax";
    if (low !== null && high !== null && !isWithinTimeRange(low, null, high))
        return "minAfterMax";
    return null;
}
function validateDateConfig(mode, min, max, locale, stepMinutes, policy) {
    const low = min === null ? null : mode === "Date" ? parseCalendarDate(min).value : parseInstant(min);
    const high = max === null ? null : mode === "Date" ? parseCalendarDate(max).value : parseInstant(max);
    if (min !== null && low === null)
        return "invalidMin";
    if (max !== null && high === null)
        return "invalidMax";
    if (low !== null && high !== null) {
        const lowKey = low instanceof Date ? low.getTime() : calendarDayKey(low);
        const highKey = high instanceof Date ? high.getTime() : calendarDayKey(high);
        if (lowKey > highKey)
            return "minAfterMax";
    }
    if (mode === "DateTime") {
        const timeError = validateTimeConfig(stepMinutes, policy);
        if (timeError)
            return timeError;
    }
    try {
        if (!locale.trim())
            return "invalidLocale";
        new Intl.DateTimeFormat(locale);
    }
    catch {
        return "invalidLocale";
    }
    return null;
}

function shiftedDay(parts, amount) {
    const date = new Date(0);
    date.setFullYear(parts.year, parts.month - 1, parts.day);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + amount);
    return dateParts(date);
}
function nearestAllowedDay(origin, isAllowed, min, max) {
    if (isAllowed(origin))
        return origin;
    for (let distance = 1; distance <= 36600; distance += 1) {
        const earlier = shiftedDay(origin, -distance);
        const later = shiftedDay(origin, distance);
        const earlierPossible = min === null || calendarDayKey(earlier) >= calendarDayKey(min);
        const laterPossible = max === null || calendarDayKey(later) <= calendarDayKey(max);
        if (earlierPossible && isAllowed(earlier))
            return earlier;
        if (laterPossible && isAllowed(later))
            return later;
        if (!earlierPossible && !laterPossible)
            break;
    }
    return null;
}

const NARROW_WEEKDAY_KEYS = [
    "LABEL.WEEKDAY_SUNDAY_SHORT",
    "LABEL.WEEKDAY_MONDAY_SHORT",
    "LABEL.WEEKDAY_TUESDAY_SHORT",
    "LABEL.WEEKDAY_WEDNESDAY_SHORT",
    "LABEL.WEEKDAY_THURSDAY_SHORT",
    "LABEL.WEEKDAY_FRIDAY_SHORT",
    "LABEL.WEEKDAY_SATURDAY_SHORT",
];
class PickerDateAdapter extends NativeDateAdapter {
    translator = injectVoteyTranslator();
    getFirstDayOfWeek() {
        return 1;
    }
    getDayOfWeekNames(style) {
        if (style === "narrow")
            return NARROW_WEEKDAY_KEYS.map(key => this.translator.translate(key));
        return super.getDayOfWeekNames(style);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDateAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDateAdapter });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDateAdapter, decorators: [{
            type: Injectable
        }] });

class PickerDatepickerIntl extends MatDatepickerIntl {
    translator = injectVoteyTranslator();
    constructor() {
        super();
        this.refresh();
    }
    refresh() {
        this.calendarLabel = this.translator.translate("LABEL.CALENDAR");
        this.prevMonthLabel = this.translator.translate("LABEL.PREVIOUS_MONTH");
        this.nextMonthLabel = this.translator.translate("LABEL.NEXT_MONTH");
        this.prevYearLabel = this.translator.translate("LABEL.PREVIOUS_YEAR");
        this.nextYearLabel = this.translator.translate("LABEL.NEXT_YEAR");
        this.prevMultiYearLabel = this.translator.translate("LABEL.PREVIOUS_24_YEARS");
        this.nextMultiYearLabel = this.translator.translate("LABEL.NEXT_24_YEARS");
        this.switchToMonthViewLabel = this.translator.translate("LABEL.CHOOSE_DATE");
        this.switchToMultiYearViewLabel = this.translator.translate("LABEL.CHOOSE_MONTH_AND_YEAR");
        this.changes.next();
    }
    formatYearRangeLabel(start, end) {
        return this.translator.translate("LABEL.YEAR_RANGE_LABEL", { start, end });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDatepickerIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDatepickerIntl });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDatepickerIntl, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

const PICKER_ERRORS = [
    "voteyPickerFormat", "voteyPickerDate", "voteyPickerTime",
    "voteyPickerRange", "voteyPickerPolicy", "voteyPickerConfig",
];
class PickerControl extends VoteyFormControlApplyDirective {
    changeDetector;
    draft = signal("", ...(ngDevMode ? [{ debugName: "draft" }] : /* istanbul ignore next */ []));
    committed = signal(null, ...(ngDevMode ? [{ debugName: "committed" }] : /* istanbul ignore next */ []));
    opened = signal(false, ...(ngDevMode ? [{ debugName: "opened" }] : /* istanbul ignore next */ []));
    valueSubscription = null;
    statusSubscription = null;
    editing = false;
    connectedControl = null;
    constructor(changeDetector) {
        super();
        this.changeDetector = changeDetector;
    }
    set control(control) {
        super.control = control;
        this.connectControl();
    }
    ngOnInit() {
        this.connectControl();
    }
    ngOnDestroy() {
        this.valueSubscription?.unsubscribe();
        this.statusSubscription?.unsubscribe();
    }
    get isDisabled() {
        return this.formControl.disabled;
    }
    get hasError() {
        return this.formControl.invalid && this.formControl.touched;
    }
    get errorKeys() {
        return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
    }
    updateDraft(event) {
        this.editing = true;
        this.draft.set(event.target.value);
        this.applyPickerError(null);
    }
    finishDraft() {
        if (this.isDisabled)
            return;
        this.formControl.markAsTouched();
        if (this.editing) {
            const result = this.commitDraft(this.draft().trim());
            if (result.error) {
                this.applyPickerError(result.error);
            }
            else {
                this.formControl.markAsDirty();
                this.formControl.setValue(result.value);
                this.committed.set(result.value);
                this.editing = false;
                this.draft.set(this.formatCommitted(result.value));
                this.applyPickerError(this.validateCommitted(result.value));
            }
        }
        else {
            this.applyPickerError(this.validateCommitted(this.formControl.value));
        }
        this.changeDetector.markForCheck();
    }
    setCommitted(value) {
        if (this.isDisabled)
            return;
        this.editing = false;
        this.formControl.markAsDirty();
        this.formControl.setValue(value);
        this.committed.set(value);
        this.formControl.markAsTouched();
        this.draft.set(this.formatCommitted(value));
        this.applyPickerError(this.validateCommitted(value));
    }
    refreshValidation() {
        this.applyPickerError(this.validateCommitted(this.formControl.value));
        this.changeDetector.markForCheck();
    }
    refreshDisplay() {
        if (!this.editing)
            this.draft.set(this.formatCommitted(this.formControl.value));
    }
    showDraftError(error) {
        this.applyPickerError(error);
        this.formControl.markAsTouched();
        this.changeDetector.markForCheck();
    }
    connectControl() {
        if (this.connectedControl === this.formControl)
            return;
        this.valueSubscription?.unsubscribe();
        this.statusSubscription?.unsubscribe();
        this.connectedControl = this.formControl;
        this.editing = false;
        this.committed.set(this.formControl.value);
        this.draft.set(this.formatCommitted(this.formControl.value));
        this.valueSubscription = this.formControl.valueChanges.subscribe((value) => {
            this.editing = false;
            this.committed.set(value);
            this.draft.set(this.formatCommitted(value));
            this.refreshValidation();
        });
        this.statusSubscription = this.formControl.statusChanges.subscribe(() => {
            if (this.formControl.disabled)
                this.opened.set(false);
            this.changeDetector.markForCheck();
        });
        this.refreshValidation();
    }
    applyPickerError(error) {
        const remaining = { ...(this.formControl.errors ?? {}) };
        for (const key of PICKER_ERRORS)
            delete remaining[key];
        const next = { ...remaining, ...error };
        const current = this.formControl.errors ?? {};
        if (JSON.stringify(next) !== JSON.stringify(current)) {
            this.formControl.setErrors(Object.keys(next).length ? next : null);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerControl, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.2.17", type: PickerControl, isStandalone: true, inputs: { control: "control" }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerControl, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { control: [{
                type: Input
            }] } });

/** The picker commits through its parser; keystrokes stay in its presentation draft. */
class PickerDraftValueAccessorDirective {
    element;
    displayValue = input(value => value ?? "", ...(ngDevMode ? [{ debugName: "displayValue" }] : /* istanbul ignore next */ []));
    touched = () => undefined;
    constructor(element) {
        this.element = element;
    }
    writeValue(value) {
        this.element.nativeElement.value = this.displayValue()(value);
    }
    registerOnChange(_change) {
        // A draft is not a committed form value; the owner calls formControl.setValue after validation.
    }
    registerOnTouched(touched) {
        this.touched = touched;
    }
    setDisabledState(disabled) {
        this.element.nativeElement.disabled = disabled;
    }
    markTouched() {
        this.touched();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDraftValueAccessorDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "21.2.17", type: PickerDraftValueAccessorDirective, isStandalone: true, selector: "input[vtPickerDraft]", inputs: { displayValue: { classPropertyName: "displayValue", publicName: "displayValue", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "blur": "markTouched()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PickerDraftValueAccessorDirective), multi: true }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerDraftValueAccessorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "input[vtPickerDraft]",
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PickerDraftValueAccessorDirective), multi: true }],
                    host: { "(blur)": "markTouched()" },
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { displayValue: [{ type: i0.Input, args: [{ isSignal: true, alias: "displayValue", required: false }] }] } });

class PickerTimeListComponent {
    items = input([], ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    selectedId = input(null, ...(ngDevMode ? [{ debugName: "selectedId" }] : /* istanbul ignore next */ []));
    selected = output();
    dismissed = output();
    menu = viewChild(VoteyMenuComponent, ...(ngDevMode ? [{ debugName: "menu" }] : /* istanbul ignore next */ []));
    focusSelected() {
        this.menu()?.focusSelected();
    }
    scrollSelected() {
        this.menu()?.scrollSelected();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerTimeListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "21.2.17", type: PickerTimeListComponent, isStandalone: true, selector: "vt-picker-time-list", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, selectedId: { classPropertyName: "selectedId", publicName: "selectedId", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selected: "selected", dismissed: "dismissed" }, viewQueries: [{ propertyName: "menu", first: true, predicate: VoteyMenuComponent, descendants: true, isSignal: true }], ngImport: i0, template: "<vt-menu\r\n  [fullWidth]=\"true\"\r\n  [embedded]=\"true\"\r\n  [items]=\"items()\"\r\n  [selectedId]=\"selectedId()\"\r\n  (itemSelected)=\"selected.emit($event)\"\r\n  (dismissed)=\"dismissed.emit()\"\r\n/>\r\n", styles: [":host{display:block;width:100%}vt-menu{display:block;width:100%;max-height:var(--picker-time-list-max-height, 176px);overflow-y:auto}\n"], dependencies: [{ kind: "component", type: VoteyMenuComponent, selector: "vt-menu", inputs: ["items", "selectedId", "dataCy", "fullWidth", "embedded"], outputs: ["itemSelected", "dismissed"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: PickerTimeListComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-picker-time-list", changeDetection: ChangeDetectionStrategy.OnPush, imports: [VoteyMenuComponent], template: "<vt-menu\r\n  [fullWidth]=\"true\"\r\n  [embedded]=\"true\"\r\n  [items]=\"items()\"\r\n  [selectedId]=\"selectedId()\"\r\n  (itemSelected)=\"selected.emit($event)\"\r\n  (dismissed)=\"dismissed.emit()\"\r\n/>\r\n", styles: [":host{display:block;width:100%}vt-menu{display:block;width:100%;max-height:var(--picker-time-list-max-height, 176px);overflow-y:auto}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], selectedId: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectedId", required: false }] }], selected: [{ type: i0.Output, args: ["selected"] }], dismissed: [{ type: i0.Output, args: ["dismissed"] }], menu: [{ type: i0.ViewChild, args: [i0.forwardRef(() => VoteyMenuComponent), { isSignal: true }] }] } });

const VoteyDatePickerModes = ["Date", "DateTime"];
let nextPickerId = 0;
class VoteyDatePickerComponent extends PickerControl {
    dateAdapter;
    datepickerIntl;
    translator = injectVoteyTranslator();
    defaultLocale = inject(LOCALE_ID);
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    mode = input("Date", ...(ngDevMode ? [{ debugName: "mode" }] : /* istanbul ignore next */ []));
    deferDateTimeCommit = input(false, { ...(ngDevMode ? { debugName: "deferDateTimeCommit" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    min = input(null, ...(ngDevMode ? [{ debugName: "min" }] : /* istanbul ignore next */ []));
    max = input(null, ...(ngDevMode ? [{ debugName: "max" }] : /* istanbul ignore next */ []));
    locale = input("", ...(ngDevMode ? [{ debugName: "locale" }] : /* istanbul ignore next */ []));
    stepMinutes = input(30, ...(ngDevMode ? [{ debugName: "stepMinutes" }] : /* istanbul ignore next */ []));
    timeEntryPolicy = input("allowManual", ...(ngDevMode ? [{ debugName: "timeEntryPolicy" }] : /* istanbul ignore next */ []));
    fallbackId = `vt-date-picker-${++nextPickerId}`;
    field = viewChild("fieldInput", ...(ngDevMode ? [{ debugName: "field" }] : /* istanbul ignore next */ []));
    calendar = viewChild(MatCalendar, ...(ngDevMode ? [{ debugName: "calendar" }] : /* istanbul ignore next */ []));
    menu = viewChild(PickerTimeListComponent, ...(ngDevMode ? [{ debugName: "menu" }] : /* istanbul ignore next */ []));
    active = signal(dateParts(new Date()), ...(ngDevMode ? [{ debugName: "active" }] : /* istanbul ignore next */ []));
    resolvedLocale = computed(() => this.locale() || this.translator.getActiveLanguage?.() || this.defaultLocale, ...(ngDevMode ? [{ debugName: "resolvedLocale" }] : /* istanbul ignore next */ []));
    timeOpened = signal(false, ...(ngDevMode ? [{ debugName: "timeOpened" }] : /* istanbul ignore next */ []));
    pendingDay = signal(null, ...(ngDevMode ? [{ debugName: "pendingDay" }] : /* istanbul ignore next */ []));
    startAt = computed(() => this.toLocalDate(this.active()), ...(ngDevMode ? [{ debugName: "startAt" }] : /* istanbul ignore next */ []));
    selected = computed(() => {
        const value = this.committed();
        if (!value)
            return null;
        if (this.mode() === "Date")
            return parseCalendarDate(value).value;
        const instant = parseInstant(value);
        return instant ? dateParts(instant) : null;
    }, ...(ngDevMode ? [{ debugName: "selected" }] : /* istanbul ignore next */ []));
    minDay = computed(() => this.mode() === "Date" ? (this.min() ? parseCalendarDate(this.min()).value : null) : (this.min() && parseInstant(this.min()) ? dateParts(parseInstant(this.min())) : null), ...(ngDevMode ? [{ debugName: "minDay" }] : /* istanbul ignore next */ []));
    maxDay = computed(() => this.mode() === "Date" ? (this.max() ? parseCalendarDate(this.max()).value : null) : (this.max() && parseInstant(this.max()) ? dateParts(parseInstant(this.max())) : null), ...(ngDevMode ? [{ debugName: "maxDay" }] : /* istanbul ignore next */ []));
    selectedDate = computed(() => {
        const day = this.pendingDay() ?? this.selected();
        return day ? this.toLocalDate(day) : null;
    }, ...(ngDevMode ? [{ debugName: "selectedDate" }] : /* istanbul ignore next */ []));
    minDate = computed(() => {
        const day = this.minDay();
        return day ? this.toLocalDate(day) : null;
    }, ...(ngDevMode ? [{ debugName: "minDate" }] : /* istanbul ignore next */ []));
    maxDate = computed(() => {
        const day = this.maxDay();
        return day ? this.toLocalDate(day) : null;
    }, ...(ngDevMode ? [{ debugName: "maxDate" }] : /* istanbul ignore next */ []));
    timeItems = computed(() => {
        const day = this.pendingDay() ?? this.selected() ?? this.active();
        if (this.mode() !== "DateTime")
            return [];
        const min = this.min() ? parseInstant(this.min()) : null;
        const max = this.max() ? parseInstant(this.max()) : null;
        return timeSuggestions(this.stepMinutes()).filter(label => {
            const time = this.parseSuggestion(label);
            const instant = localInstant({ ...day, ...time });
            return instant && isWithinInstantRange(instant, min, max);
        }).map(label => ({ id: label, label }));
    }, ...(ngDevMode ? [{ debugName: "timeItems" }] : /* istanbul ignore next */ []));
    selectedTime = computed(() => {
        const instant = this.committed() ? parseInstant(this.committed()) : null;
        return !this.pendingDay() && instant && this.mode() === "DateTime" ?
            formatTime(timeParts(instant)) : this.timeItems()[0]?.id ?? null;
    }, ...(ngDevMode ? [{ debugName: "selectedTime" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 8 },
        { originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -8 },
    ];
    dayAllowed = (day) => {
        if (this.configurationError())
            return false;
        if (this.mode() === "Date")
            return isWithinDateRange(day, this.minDay(), this.maxDay());
        return firstAllowedTime(day, this.min() ? parseInstant(this.min()) : null, this.max() ? parseInstant(this.max()) : null, this.stepMinutes(), this.timeEntryPolicy()) !== null;
    };
    calendarDateFilter = computed(() => {
        this.mode();
        this.min();
        this.max();
        this.stepMinutes();
        this.timeEntryPolicy();
        return (date) => this.dayAllowed(dateParts(date));
    }, ...(ngDevMode ? [{ debugName: "calendarDateFilter" }] : /* istanbul ignore next */ []));
    constructor(changeDetector, dateAdapter, datepickerIntl) {
        super(changeDetector);
        this.dateAdapter = dateAdapter;
        this.datepickerIntl = datepickerIntl;
        effect(() => {
            this.mode();
            this.min();
            this.max();
            this.resolvedLocale();
            this.stepMinutes();
            this.timeEntryPolicy();
            const config = this.configurationError();
            if (config)
                this.opened.set(false);
            else
                this.dateAdapter.setLocale(this.resolvedLocale());
            this.datepickerIntl.refresh();
            this.refreshDisplay();
            this.refreshValidation();
        });
        effect(() => {
            if (this.disabled()) {
                this.pendingDay.set(null);
                this.timeOpened.set(false);
                this.opened.set(false);
            }
        });
    }
    get isDisabled() {
        return this.disabled() || super.isDisabled;
    }
    get isRequired() {
        return this.formControl.hasValidator(Validators.required);
    }
    get inputId() { return this.fallbackId; }
    get expectedFormat() {
        return this.translator.translate(this.mode() === "Date" ? "LABEL.DATE_FORMAT" : "LABEL.DATE_TIME_FORMAT");
    }
    displayValue = (value) => this.formatCommitted(value);
    formatCommitted(value) {
        if (!value)
            return "";
        if (this.mode() === "Date") {
            const parsed = parseCalendarDate(value);
            return parsed.value ? `${String(parsed.value.day).padStart(2, "0")}.${String(parsed.value.month).padStart(2, "0")}.${parsed.value.year}` : value;
        }
        const instant = parseInstant(value);
        if (!instant)
            return value;
        const day = dateParts(instant);
        return `${String(day.day).padStart(2, "0")}.${String(day.month).padStart(2, "0")}.${day.year}, ${formatTime(timeParts(instant))}`;
    }
    validateCommitted(value) {
        const config = this.configurationError();
        if (config)
            return { voteyPickerConfig: { reason: config } };
        if (!value)
            return null;
        if (this.mode() === "Date") {
            const parsed = parseCalendarDate(value);
            if (!parsed.value)
                return { voteyPickerFormat: { expected: this.expectedFormat } };
            return isWithinDateRange(parsed.value, this.minDay(), this.maxDay()) ? null :
                { voteyPickerRange: { min: this.min(), max: this.max() } };
        }
        const instant = parseInstant(value);
        if (!instant)
            return { voteyPickerFormat: { expected: this.expectedFormat } };
        return isWithinInstantRange(instant, this.min() ? parseInstant(this.min()) : null, this.max() ? parseInstant(this.max()) : null) ? null :
            { voteyPickerRange: { min: this.min(), max: this.max() } };
    }
    commitDraft(value) {
        const config = this.configurationError();
        if (config)
            return { value: null, error: { voteyPickerConfig: { reason: config } } };
        if (!value)
            return { value: null, error: null };
        const parsed = this.mode() === "Date" ? parseDateInput(value) : parseDateTimeInput(value);
        if (parsed.error) {
            const error = parsed.error === "format" ? { voteyPickerFormat: { expected: this.expectedFormat } } :
                parsed.error === "date" ? { voteyPickerDate: { input: value } } : { voteyPickerTime: { input: value } };
            return { value: null, error };
        }
        if (this.mode() === "Date") {
            const day = parsed.value;
            return isWithinDateRange(day, this.minDay(), this.maxDay()) ?
                { value: formatCalendarDate(day), error: null } :
                { value: null, error: { voteyPickerRange: { min: this.min(), max: this.max() } } };
        }
        const parts = parsed.value;
        const instant = localInstant(parts);
        if (!isWithinInstantRange(instant, this.min() ? parseInstant(this.min()) : null, this.max() ? parseInstant(this.max()) : null)) {
            return { value: null, error: { voteyPickerRange: { min: this.min(), max: this.max() } } };
        }
        if (this.timeEntryPolicy() === "listOnly" && (parts.hour * 60 + parts.minute) % this.stepMinutes() !== 0) {
            return { value: null, error: { voteyPickerPolicy: { stepMinutes: this.stepMinutes() } } };
        }
        return { value: canonicalInstant(parts), error: null };
    }
    open() {
        if (this.isDisabled || this.configurationError())
            return;
        const origin = this.selected() ?? dateParts(new Date());
        const active = nearestAllowedDay(origin, this.dayAllowed, this.minDay(), this.maxDay());
        if (!active)
            return;
        this.active.set(active);
        this.pendingDay.set(null);
        this.timeOpened.set(false);
        this.opened.set(true);
        queueMicrotask(() => {
            this.calendar()?.focusActiveCell();
        });
    }
    close() {
        this.pendingDay.set(null);
        if (!this.opened())
            return;
        this.opened.set(false);
        this.timeOpened.set(false);
        this.formControl.markAsTouched();
        queueMicrotask(() => this.field()?.nativeElement.focus());
    }
    handleOverlayKeydown(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            if (this.pendingDay())
                this.close();
            else if (this.timeOpened())
                this.timeOpened.set(false);
            else
                this.close();
        }
    }
    toggleTime() {
        if (this.deferDateTimeCommit() && !this.pendingDay())
            return;
        this.timeOpened.update(open => !open);
        if (this.timeOpened())
            queueMicrotask(() => this.menu()?.scrollSelected());
    }
    chooseDay(date) {
        if (!date)
            return;
        const day = dateParts(date);
        if (!this.dayAllowed(day))
            return;
        if (this.mode() === "Date") {
            this.setCommitted(formatCalendarDate(day));
            this.close();
            return;
        }
        const previous = this.committed() ? parseInstant(this.committed()) : null;
        const nextTime = firstAllowedTime(day, this.min() ? parseInstant(this.min()) : null, this.max() ? parseInstant(this.max()) : null, this.stepMinutes(), this.timeEntryPolicy(), previous ? timeParts(previous) : null);
        if (!nextTime)
            return;
        if (this.deferDateTimeCommit()) {
            this.pendingDay.set(day);
            this.active.set(day);
            this.timeOpened.set(true);
            queueMicrotask(() => this.menu()?.scrollSelected());
            return;
        }
        this.setCommitted(canonicalInstant({ ...day, ...nextTime }));
        this.active.set(day);
    }
    chooseTime(item) {
        if (this.deferDateTimeCommit() && !this.pendingDay())
            return;
        const day = this.pendingDay() ?? this.selected() ?? this.active();
        if (this.configurationError() || !this.timeItems().some(option => option.id === item.id))
            return;
        const time = this.parseSuggestion(item.id);
        this.pendingDay.set(null);
        this.setCommitted(canonicalInstant({ ...day, ...time }));
        this.timeOpened.set(false);
        if (this.deferDateTimeCommit())
            this.close();
    }
    clear() {
        if (this.isDisabled || this.isRequired)
            return;
        this.setCommitted(null);
        this.close();
    }
    configurationError() {
        return validateDateConfig(this.mode(), this.min(), this.max(), this.resolvedLocale(), this.stepMinutes(), this.timeEntryPolicy());
    }
    parseSuggestion(value) {
        return { hour: Number(value.slice(0, 2)), minute: Number(value.slice(3)) };
    }
    toLocalDate(day) {
        const date = new Date(0);
        date.setFullYear(day.year, day.month - 1, day.day);
        date.setHours(12, 0, 0, 0);
        return date;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyDatePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1$1.DateAdapter }, { token: PickerDatepickerIntl }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyDatePickerComponent, isStandalone: true, selector: "vt-date-picker", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, mode: { classPropertyName: "mode", publicName: "mode", isSignal: true, isRequired: false, transformFunction: null }, deferDateTimeCommit: { classPropertyName: "deferDateTimeCommit", publicName: "deferDateTimeCommit", isSignal: true, isRequired: false, transformFunction: null }, min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null }, locale: { classPropertyName: "locale", publicName: "locale", isSignal: true, isRequired: false, transformFunction: null }, stepMinutes: { classPropertyName: "stepMinutes", publicName: "stepMinutes", isSignal: true, isRequired: false, transformFunction: null }, timeEntryPolicy: { classPropertyName: "timeEntryPolicy", publicName: "timeEntryPolicy", isSignal: true, isRequired: false, transformFunction: null } }, providers: [
            provideNativeDateAdapter(),
            { provide: DateAdapter, useClass: PickerDateAdapter },
            PickerDatepickerIntl,
            { provide: MatDatepickerIntl, useExisting: PickerDatepickerIntl },
            { provide: MAT_DATE_FORMATS, useValue: {
                    ...MAT_NATIVE_DATE_FORMATS,
                    display: { ...MAT_NATIVE_DATE_FORMATS.display, monthYearLabel: { month: "long", year: "numeric" } },
                } },
        ], viewQueries: [{ propertyName: "field", first: true, predicate: ["fieldInput"], descendants: true, isSignal: true }, { propertyName: "calendar", first: true, predicate: MatCalendar, descendants: true, isSignal: true }, { propertyName: "menu", first: true, predicate: PickerTimeListComponent, descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"picker\" [class.disabled]=\"isDisabled\" [class.error]=\"hasError\">\r\n  @if (label()) {\r\n    <label class=\"label\" [for]=\"inputId\">\r\n      <vt-text variant=\"label\" color=\"primary\" [content]=\"label() | vtTranslate\" />\r\n    </label>\r\n  }\r\n  <div class=\"field\" cdkOverlayOrigin #origin=\"cdkOverlayOrigin\" (click)=\"open()\">\r\n    <input\r\n      #fieldInput\r\n      class=\"control\"\r\n      vtPickerDraft\r\n      [id]=\"inputId\"\r\n      [formControl]=\"formControl\"\r\n      [displayValue]=\"displayValue\"\r\n      [value]=\"draft()\"\r\n      [readOnly]=\"isDisabled\"\r\n      [attr.aria-disabled]=\"isDisabled\"\r\n      [attr.tabindex]=\"isDisabled ? -1 : null\"\r\n      [required]=\"isRequired\"\r\n      [placeholder]=\"expectedFormat\"\r\n      [attr.aria-label]=\"label() ? null : (expectedFormat)\"\r\n      [attr.aria-describedby]=\"inputId + '-format ' + inputId + '-error'\"\r\n      [attr.aria-invalid]=\"hasError\"\r\n      [attr.aria-expanded]=\"opened()\"\r\n      [attr.aria-controls]=\"opened() ? inputId + '-panel' : null\"\r\n      (input)=\"updateDraft($event)\"\r\n      (blur)=\"finishDraft()\"\r\n      (keydown.escape)=\"close()\"\r\n    />\r\n    <span class=\"icon\" aria-hidden=\"true\"><vt-icon [ico]=\"mode() === 'DateTime' ? 'ui-time' : 'ui-calendar'\" [color]=\"isDisabled ? 'muted' : ''\" /></span>\r\n    @if (committed() && !isDisabled && !isRequired) {\r\n      <vt-button class=\"clear\" variant=\"ghost\" size=\"small\" ico=\"ui-close\" ariaLabel=\"LABEL.CLEAR\"\r\n        (click)=\"$event.stopPropagation()\" (pressed)=\"clear()\" />\r\n    }\r\n  </div>\r\n  <span class=\"format\" [id]=\"inputId + '-format'\">\r\n    <vt-text variant=\"caption-s\" color=\"muted\" [content]=\"expectedFormat\" />\r\n  </span>\r\n  <vt-form-error [id]=\"inputId + '-error'\" [errors]=\"errorKeys\" />\r\n</div>\r\n\r\n<ng-template\r\n  cdkConnectedOverlay\r\n  [cdkConnectedOverlayOrigin]=\"origin\"\r\n  [cdkConnectedOverlayOpen]=\"opened()\"\r\n  [cdkConnectedOverlayPositions]=\"positions\"\r\n  [cdkConnectedOverlayPush]=\"true\"\r\n  (overlayOutsideClick)=\"close()\"\r\n  (overlayKeydown)=\"handleOverlayKeydown($event)\"\r\n>\r\n  <div class=\"panel vt-date-picker-panel\" [id]=\"inputId + '-panel'\">\r\n    <mat-calendar\r\n      [startAt]=\"startAt()\"\r\n      [selected]=\"selectedDate()\"\r\n      [minDate]=\"minDate()\"\r\n      [maxDate]=\"maxDate()\"\r\n      [dateFilter]=\"calendarDateFilter()\"\r\n      (selectedChange)=\"chooseDay($event)\"\r\n    />\r\n    @if (mode() === 'DateTime') {\r\n      <div class=\"time-picker\">\r\n        <button class=\"time-trigger\" type=\"button\" [disabled]=\"deferDateTimeCommit() && !pendingDay()\" [attr.aria-expanded]=\"timeOpened()\" [attr.aria-controls]=\"inputId + '-time-list'\" (click)=\"toggleTime()\">\r\n          <span [class.placeholder]=\"pendingDay() || !committed()\">{{ pendingDay() || !committed() ? ('LABEL.SELECT_TIME' | vtTranslate) : selectedTime() }}</span>\r\n          <span class=\"time-icon\" aria-hidden=\"true\"><vt-icon ico=\"ui-time\" /></span>\r\n        </button>\r\n        @if (timeOpened()) {\r\n          <div [id]=\"inputId + '-time-list'\">\r\n            <vt-picker-time-list\r\n              [items]=\"timeItems()\"\r\n              [selectedId]=\"pendingDay() ? null : selectedTime()\"\r\n              (selected)=\"chooseTime($event)\"\r\n              (dismissed)=\"timeOpened.set(false)\"\r\n            />\r\n          </div>\r\n        }\r\n      </div>\r\n    }\r\n  </div>\r\n</ng-template>\r\n", styles: [":host{display:block;width:320px;max-width:100%}.picker{display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:100%}.picker .label{display:block}.picker .field{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-gap-xs);width:100%;height:50px;padding:0 var(--space-field-padding-x);border:1px solid var(--color-border-field);border-radius:var(--radius-m);background:var(--color-bg-surface);cursor:pointer}.picker .field:hover{border-color:var(--color-accent-hover)}.picker .field:focus-within{border:2px solid var(--color-accent-primary)}.picker .field .control{flex:1;min-width:0;height:100%;padding:0;border:0;outline:0;background:transparent;color:var(--color-text-primary);cursor:inherit;font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);line-height:var(--typo-field-line-height)}.picker .field .control::placeholder{color:var(--color-text-placeholder)}.picker .field .icon{flex:0 0 24px;width:24px;height:24px}.picker .field .clear{display:inline-flex;flex:0 0 28px}.picker .format{display:block}.picker.error .field{border-color:var(--color-state-error)}.picker.disabled .field{background:var(--color-bg-surface-tint);cursor:not-allowed}.picker.disabled .field .control{color:var(--color-text-muted)}.panel{box-sizing:border-box;display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:320px;max-width:calc(100vw - 2 * var(--space-stack-gap-s));max-height:calc(100vh - 2 * var(--space-stack-gap-s));padding:var(--space-icon-gap) var(--space-stack-gap-s);overflow:hidden auto;border:0;border-radius:var(--radius-m);background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-subtle),0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent)}.panel{--mat-datepicker-calendar-container-background-color: var(--color-bg-surface);--mat-datepicker-calendar-container-text-color: var(--color-text-primary);--mat-datepicker-calendar-text-font: inherit;--mat-datepicker-calendar-text-size: var(--typo-body-font-size);--mat-datepicker-calendar-body-label-text-color: var(--color-text-muted);--mat-datepicker-calendar-header-text-color: var(--color-text-primary);--mat-datepicker-calendar-navigation-button-icon-color: var(--color-text-primary);--mat-datepicker-calendar-period-button-icon-color: var(--color-text-primary);--mat-datepicker-calendar-period-button-text-color: var(--color-text-primary);--mat-datepicker-calendar-date-text-color: var(--color-text-primary);--mat-datepicker-calendar-date-disabled-state-text-color: var(--color-text-muted);--mat-datepicker-calendar-date-hover-state-background-color: var(--color-bg-surface-tint);--mat-datepicker-calendar-date-focus-state-background-color: var(--color-bg-surface-tint);--mat-datepicker-calendar-date-selected-state-background-color: var(--color-accent-primary);--mat-datepicker-calendar-date-selected-state-text-color: var(--color-accent-on-accent);--mat-datepicker-calendar-date-today-outline-color: var(--color-accent-primary);--mat-datepicker-calendar-date-today-selected-state-outline-color: var(--color-accent-on-accent);--mat-datepicker-calendar-header-divider-color: var(--color-border-subtle)}.panel mat-calendar{width:100%;height:auto}.panel .time-picker{display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:100%}.panel .time-picker .time-trigger{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;width:100%;height:50px;padding:0 var(--space-field-padding-x);border:1px solid var(--color-border-field);border-radius:var(--radius-m);background:var(--color-bg-surface);color:var(--color-text-primary);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);line-height:var(--typo-field-line-height);cursor:pointer}.panel .time-picker .time-trigger:disabled{color:var(--color-text-muted);cursor:not-allowed}.panel .time-picker .time-trigger .placeholder{color:var(--color-text-placeholder)}.panel .time-picker .time-trigger span{white-space:nowrap}.panel .time-picker .time-trigger .time-icon{display:block;flex:0 0 24px;width:24px;height:24px}.panel .time-picker vt-picker-time-list{max-height:176px}.vt-date-picker-panel ::ng-deep{--mat-icon-button-state-layer-color: transparent;--mat-icon-button-ripple-color: transparent;--mat-text-button-state-layer-color: transparent;--mat-text-button-ripple-color: transparent}.vt-date-picker-panel ::ng-deep .mat-calendar-header{padding:0}.vt-date-picker-panel ::ng-deep .mat-calendar-controls{display:flex;align-items:center;height:28px;margin:0 0 var(--space-stack-gap-s)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-period-button{order:2;display:inline-flex;flex:1 1 auto;align-items:center;justify-content:center;min-width:0;height:28px;margin:0;padding:0;border:0;background:transparent;box-shadow:none;color:var(--color-text-primary);font-size:var(--typo-body-l-semibold-font-size);font-weight:var(--typo-body-l-semibold-font-weight);line-height:var(--typo-body-l-semibold-line-height)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-period-button span{display:inline-block;text-transform:lowercase}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-period-button span:first-letter{text-transform:uppercase}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-spacer{display:none}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button{box-sizing:border-box;display:inline-flex;flex:0 0 28px;align-items:center;justify-content:center;width:28px;min-width:28px;height:28px;padding:0;border:1px solid var(--color-accent-primary);border-radius:var(--radius-full);background-color:var(--color-bg-surface);color:var(--color-text-primary)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button svg,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button svg{opacity:0}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:after,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:after{position:absolute;top:50%;left:50%;width:14px;height:14px;background-color:currentColor;content:\"\";transform:translate(-50%,-50%);-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:hover:not(:disabled):not([aria-disabled=true]):not(.mat-mdc-button-disabled),.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:hover:not(:disabled):not([aria-disabled=true]):not(.mat-mdc-button-disabled){border-color:var(--color-accent-hover);background-color:var(--color-bg-surface-tint);color:var(--color-text-primary);cursor:pointer}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:disabled,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button[aria-disabled=true],.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button.mat-mdc-button-disabled,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:disabled,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button[aria-disabled=true],.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button.mat-mdc-button-disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted);cursor:not-allowed;opacity:1}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button{order:1}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:after{-webkit-mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-left.svg);mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-left.svg)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button{order:3}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:after{-webkit-mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-right.svg);mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-right.svg)}.vt-date-picker-panel ::ng-deep .mat-calendar-content{padding:0}.vt-date-picker-panel ::ng-deep .mat-calendar-table-header{color:var(--color-text-muted);font-size:var(--typo-caption-s-font-size);line-height:var(--typo-caption-s-line-height)}.vt-date-picker-panel ::ng-deep .mat-calendar-table-header th{padding:0 0 var(--space-stack-gap-s)}.vt-date-picker-panel ::ng-deep .mat-calendar-body tr:first-child{display:none}.vt-date-picker-panel ::ng-deep .mat-calendar-body-cell-content{width:40px;height:40px;border-radius:var(--radius-m);font-size:var(--typo-body-font-size);line-height:var(--typo-body-line-height)}\n"], dependencies: [{ kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: PickerDraftValueAccessorDirective, selector: "input[vtPickerDraft]", inputs: ["displayValue"] }, { kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "component", type: MatCalendar, selector: "mat-calendar", inputs: ["headerComponent", "startAt", "startView", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName"], outputs: ["selectedChange", "yearSelected", "monthSelected", "viewChanged", "_userSelection", "_userDragDrop"], exportAs: ["matCalendar"] }, { kind: "component", type: PickerTimeListComponent, selector: "vt-picker-time-list", inputs: ["items", "selectedId"], outputs: ["selected", "dismissed"] }, { kind: "component", type: VoteyButtonComponent, selector: "vt-button", inputs: ["disabled", "type", "variant", "size", "text", "ariaLabel", "ico", "badge", "tooltipText", "disabledNote", "ariaExpanded", "ariaHasPopup", "ariaControls", "iconColor"], outputs: ["pressed"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyDatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-date-picker", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        provideNativeDateAdapter(),
                        { provide: DateAdapter, useClass: PickerDateAdapter },
                        PickerDatepickerIntl,
                        { provide: MatDatepickerIntl, useExisting: PickerDatepickerIntl },
                        { provide: MAT_DATE_FORMATS, useValue: {
                                ...MAT_NATIVE_DATE_FORMATS,
                                display: { ...MAT_NATIVE_DATE_FORMATS.display, monthYearLabel: { month: "long", year: "numeric" } },
                            } },
                    ], imports: [ReactiveFormsModule, PickerDraftValueAccessorDirective, CdkOverlayOrigin, CdkConnectedOverlay, MatCalendar,
                        PickerTimeListComponent, VoteyButtonComponent, VoteyIconComponent, VoteyTextComponent,
                        VoteyFormErrorComponent, VoteyTranslatePipe], template: "<div class=\"picker\" [class.disabled]=\"isDisabled\" [class.error]=\"hasError\">\r\n  @if (label()) {\r\n    <label class=\"label\" [for]=\"inputId\">\r\n      <vt-text variant=\"label\" color=\"primary\" [content]=\"label() | vtTranslate\" />\r\n    </label>\r\n  }\r\n  <div class=\"field\" cdkOverlayOrigin #origin=\"cdkOverlayOrigin\" (click)=\"open()\">\r\n    <input\r\n      #fieldInput\r\n      class=\"control\"\r\n      vtPickerDraft\r\n      [id]=\"inputId\"\r\n      [formControl]=\"formControl\"\r\n      [displayValue]=\"displayValue\"\r\n      [value]=\"draft()\"\r\n      [readOnly]=\"isDisabled\"\r\n      [attr.aria-disabled]=\"isDisabled\"\r\n      [attr.tabindex]=\"isDisabled ? -1 : null\"\r\n      [required]=\"isRequired\"\r\n      [placeholder]=\"expectedFormat\"\r\n      [attr.aria-label]=\"label() ? null : (expectedFormat)\"\r\n      [attr.aria-describedby]=\"inputId + '-format ' + inputId + '-error'\"\r\n      [attr.aria-invalid]=\"hasError\"\r\n      [attr.aria-expanded]=\"opened()\"\r\n      [attr.aria-controls]=\"opened() ? inputId + '-panel' : null\"\r\n      (input)=\"updateDraft($event)\"\r\n      (blur)=\"finishDraft()\"\r\n      (keydown.escape)=\"close()\"\r\n    />\r\n    <span class=\"icon\" aria-hidden=\"true\"><vt-icon [ico]=\"mode() === 'DateTime' ? 'ui-time' : 'ui-calendar'\" [color]=\"isDisabled ? 'muted' : ''\" /></span>\r\n    @if (committed() && !isDisabled && !isRequired) {\r\n      <vt-button class=\"clear\" variant=\"ghost\" size=\"small\" ico=\"ui-close\" ariaLabel=\"LABEL.CLEAR\"\r\n        (click)=\"$event.stopPropagation()\" (pressed)=\"clear()\" />\r\n    }\r\n  </div>\r\n  <span class=\"format\" [id]=\"inputId + '-format'\">\r\n    <vt-text variant=\"caption-s\" color=\"muted\" [content]=\"expectedFormat\" />\r\n  </span>\r\n  <vt-form-error [id]=\"inputId + '-error'\" [errors]=\"errorKeys\" />\r\n</div>\r\n\r\n<ng-template\r\n  cdkConnectedOverlay\r\n  [cdkConnectedOverlayOrigin]=\"origin\"\r\n  [cdkConnectedOverlayOpen]=\"opened()\"\r\n  [cdkConnectedOverlayPositions]=\"positions\"\r\n  [cdkConnectedOverlayPush]=\"true\"\r\n  (overlayOutsideClick)=\"close()\"\r\n  (overlayKeydown)=\"handleOverlayKeydown($event)\"\r\n>\r\n  <div class=\"panel vt-date-picker-panel\" [id]=\"inputId + '-panel'\">\r\n    <mat-calendar\r\n      [startAt]=\"startAt()\"\r\n      [selected]=\"selectedDate()\"\r\n      [minDate]=\"minDate()\"\r\n      [maxDate]=\"maxDate()\"\r\n      [dateFilter]=\"calendarDateFilter()\"\r\n      (selectedChange)=\"chooseDay($event)\"\r\n    />\r\n    @if (mode() === 'DateTime') {\r\n      <div class=\"time-picker\">\r\n        <button class=\"time-trigger\" type=\"button\" [disabled]=\"deferDateTimeCommit() && !pendingDay()\" [attr.aria-expanded]=\"timeOpened()\" [attr.aria-controls]=\"inputId + '-time-list'\" (click)=\"toggleTime()\">\r\n          <span [class.placeholder]=\"pendingDay() || !committed()\">{{ pendingDay() || !committed() ? ('LABEL.SELECT_TIME' | vtTranslate) : selectedTime() }}</span>\r\n          <span class=\"time-icon\" aria-hidden=\"true\"><vt-icon ico=\"ui-time\" /></span>\r\n        </button>\r\n        @if (timeOpened()) {\r\n          <div [id]=\"inputId + '-time-list'\">\r\n            <vt-picker-time-list\r\n              [items]=\"timeItems()\"\r\n              [selectedId]=\"pendingDay() ? null : selectedTime()\"\r\n              (selected)=\"chooseTime($event)\"\r\n              (dismissed)=\"timeOpened.set(false)\"\r\n            />\r\n          </div>\r\n        }\r\n      </div>\r\n    }\r\n  </div>\r\n</ng-template>\r\n", styles: [":host{display:block;width:320px;max-width:100%}.picker{display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:100%}.picker .label{display:block}.picker .field{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-gap-xs);width:100%;height:50px;padding:0 var(--space-field-padding-x);border:1px solid var(--color-border-field);border-radius:var(--radius-m);background:var(--color-bg-surface);cursor:pointer}.picker .field:hover{border-color:var(--color-accent-hover)}.picker .field:focus-within{border:2px solid var(--color-accent-primary)}.picker .field .control{flex:1;min-width:0;height:100%;padding:0;border:0;outline:0;background:transparent;color:var(--color-text-primary);cursor:inherit;font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);line-height:var(--typo-field-line-height)}.picker .field .control::placeholder{color:var(--color-text-placeholder)}.picker .field .icon{flex:0 0 24px;width:24px;height:24px}.picker .field .clear{display:inline-flex;flex:0 0 28px}.picker .format{display:block}.picker.error .field{border-color:var(--color-state-error)}.picker.disabled .field{background:var(--color-bg-surface-tint);cursor:not-allowed}.picker.disabled .field .control{color:var(--color-text-muted)}.panel{box-sizing:border-box;display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:320px;max-width:calc(100vw - 2 * var(--space-stack-gap-s));max-height:calc(100vh - 2 * var(--space-stack-gap-s));padding:var(--space-icon-gap) var(--space-stack-gap-s);overflow:hidden auto;border:0;border-radius:var(--radius-m);background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-subtle),0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent)}.panel{--mat-datepicker-calendar-container-background-color: var(--color-bg-surface);--mat-datepicker-calendar-container-text-color: var(--color-text-primary);--mat-datepicker-calendar-text-font: inherit;--mat-datepicker-calendar-text-size: var(--typo-body-font-size);--mat-datepicker-calendar-body-label-text-color: var(--color-text-muted);--mat-datepicker-calendar-header-text-color: var(--color-text-primary);--mat-datepicker-calendar-navigation-button-icon-color: var(--color-text-primary);--mat-datepicker-calendar-period-button-icon-color: var(--color-text-primary);--mat-datepicker-calendar-period-button-text-color: var(--color-text-primary);--mat-datepicker-calendar-date-text-color: var(--color-text-primary);--mat-datepicker-calendar-date-disabled-state-text-color: var(--color-text-muted);--mat-datepicker-calendar-date-hover-state-background-color: var(--color-bg-surface-tint);--mat-datepicker-calendar-date-focus-state-background-color: var(--color-bg-surface-tint);--mat-datepicker-calendar-date-selected-state-background-color: var(--color-accent-primary);--mat-datepicker-calendar-date-selected-state-text-color: var(--color-accent-on-accent);--mat-datepicker-calendar-date-today-outline-color: var(--color-accent-primary);--mat-datepicker-calendar-date-today-selected-state-outline-color: var(--color-accent-on-accent);--mat-datepicker-calendar-header-divider-color: var(--color-border-subtle)}.panel mat-calendar{width:100%;height:auto}.panel .time-picker{display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:100%}.panel .time-picker .time-trigger{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;width:100%;height:50px;padding:0 var(--space-field-padding-x);border:1px solid var(--color-border-field);border-radius:var(--radius-m);background:var(--color-bg-surface);color:var(--color-text-primary);font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);line-height:var(--typo-field-line-height);cursor:pointer}.panel .time-picker .time-trigger:disabled{color:var(--color-text-muted);cursor:not-allowed}.panel .time-picker .time-trigger .placeholder{color:var(--color-text-placeholder)}.panel .time-picker .time-trigger span{white-space:nowrap}.panel .time-picker .time-trigger .time-icon{display:block;flex:0 0 24px;width:24px;height:24px}.panel .time-picker vt-picker-time-list{max-height:176px}.vt-date-picker-panel ::ng-deep{--mat-icon-button-state-layer-color: transparent;--mat-icon-button-ripple-color: transparent;--mat-text-button-state-layer-color: transparent;--mat-text-button-ripple-color: transparent}.vt-date-picker-panel ::ng-deep .mat-calendar-header{padding:0}.vt-date-picker-panel ::ng-deep .mat-calendar-controls{display:flex;align-items:center;height:28px;margin:0 0 var(--space-stack-gap-s)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-period-button{order:2;display:inline-flex;flex:1 1 auto;align-items:center;justify-content:center;min-width:0;height:28px;margin:0;padding:0;border:0;background:transparent;box-shadow:none;color:var(--color-text-primary);font-size:var(--typo-body-l-semibold-font-size);font-weight:var(--typo-body-l-semibold-font-weight);line-height:var(--typo-body-l-semibold-line-height)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-period-button span{display:inline-block;text-transform:lowercase}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-period-button span:first-letter{text-transform:uppercase}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-spacer{display:none}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button{box-sizing:border-box;display:inline-flex;flex:0 0 28px;align-items:center;justify-content:center;width:28px;min-width:28px;height:28px;padding:0;border:1px solid var(--color-accent-primary);border-radius:var(--radius-full);background-color:var(--color-bg-surface);color:var(--color-text-primary)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button svg,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button svg{opacity:0}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:after,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:after{position:absolute;top:50%;left:50%;width:14px;height:14px;background-color:currentColor;content:\"\";transform:translate(-50%,-50%);-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:hover:not(:disabled):not([aria-disabled=true]):not(.mat-mdc-button-disabled),.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:hover:not(:disabled):not([aria-disabled=true]):not(.mat-mdc-button-disabled){border-color:var(--color-accent-hover);background-color:var(--color-bg-surface-tint);color:var(--color-text-primary);cursor:pointer}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:disabled,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button[aria-disabled=true],.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button.mat-mdc-button-disabled,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:disabled,.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button[aria-disabled=true],.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button.mat-mdc-button-disabled{border-color:var(--color-border-subtle);background-color:var(--color-bg-surface);color:var(--color-text-muted);cursor:not-allowed;opacity:1}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button{order:1}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-previous-button:after{-webkit-mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-left.svg);mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-left.svg)}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button{order:3}.vt-date-picker-panel ::ng-deep .mat-calendar-controls .mat-calendar-next-button:after{-webkit-mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-right.svg);mask-image:url(/assets/votey/icons/ui/icon_ui_chevron-right.svg)}.vt-date-picker-panel ::ng-deep .mat-calendar-content{padding:0}.vt-date-picker-panel ::ng-deep .mat-calendar-table-header{color:var(--color-text-muted);font-size:var(--typo-caption-s-font-size);line-height:var(--typo-caption-s-line-height)}.vt-date-picker-panel ::ng-deep .mat-calendar-table-header th{padding:0 0 var(--space-stack-gap-s)}.vt-date-picker-panel ::ng-deep .mat-calendar-body tr:first-child{display:none}.vt-date-picker-panel ::ng-deep .mat-calendar-body-cell-content{width:40px;height:40px;border-radius:var(--radius-m);font-size:var(--typo-body-font-size);line-height:var(--typo-body-line-height)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1$1.DateAdapter }, { type: PickerDatepickerIntl }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], mode: [{ type: i0.Input, args: [{ isSignal: true, alias: "mode", required: false }] }], deferDateTimeCommit: [{ type: i0.Input, args: [{ isSignal: true, alias: "deferDateTimeCommit", required: false }] }], min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], locale: [{ type: i0.Input, args: [{ isSignal: true, alias: "locale", required: false }] }], stepMinutes: [{ type: i0.Input, args: [{ isSignal: true, alias: "stepMinutes", required: false }] }], timeEntryPolicy: [{ type: i0.Input, args: [{ isSignal: true, alias: "timeEntryPolicy", required: false }] }], field: [{ type: i0.ViewChild, args: ["fieldInput", { isSignal: true }] }], calendar: [{ type: i0.ViewChild, args: [i0.forwardRef(() => MatCalendar), { isSignal: true }] }], menu: [{ type: i0.ViewChild, args: [i0.forwardRef(() => PickerTimeListComponent), { isSignal: true }] }] } });

const VoteyTimeEntryPolicies = ["allowManual", "listOnly"];
let nextTimeId = 0;
class VoteyTimePickerComponent extends PickerControl {
    translator = injectVoteyTranslator();
    label = input("", ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    stepMinutes = input(30, ...(ngDevMode ? [{ debugName: "stepMinutes" }] : /* istanbul ignore next */ []));
    timeEntryPolicy = input("allowManual", ...(ngDevMode ? [{ debugName: "timeEntryPolicy" }] : /* istanbul ignore next */ []));
    min = input(null, ...(ngDevMode ? [{ debugName: "min" }] : /* istanbul ignore next */ []));
    max = input(null, ...(ngDevMode ? [{ debugName: "max" }] : /* istanbul ignore next */ []));
    fallbackId = `vt-time-picker-${++nextTimeId}`;
    field = viewChild("fieldInput", ...(ngDevMode ? [{ debugName: "field" }] : /* istanbul ignore next */ []));
    menu = viewChild(PickerTimeListComponent, ...(ngDevMode ? [{ debugName: "menu" }] : /* istanbul ignore next */ []));
    timeItems = computed(() => timeSuggestions(this.stepMinutes())
        .filter(label => isTimeWithinBounds(label, this.min(), this.max()))
        .map(label => ({ id: label, label })), ...(ngDevMode ? [{ debugName: "timeItems" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 8 },
        { originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -8 },
    ];
    constructor(changeDetector) {
        super(changeDetector);
        effect(() => {
            this.stepMinutes();
            this.timeEntryPolicy();
            this.min();
            this.max();
            if (this.configurationError())
                this.opened.set(false);
            this.refreshValidation();
        });
        effect(() => {
            if (this.disabled())
                this.opened.set(false);
        });
    }
    get isDisabled() { return this.disabled() || super.isDisabled; }
    get isRequired() { return this.formControl.hasValidator(Validators.required); }
    get inputId() { return this.fallbackId; }
    get expectedFormat() { return this.translator.translate("LABEL.TIME_FORMAT"); }
    displayValue = (value) => this.formatCommitted(value);
    formatCommitted(value) { return value ?? ""; }
    validateCommitted(value) {
        const config = this.configurationError();
        if (config)
            return { voteyPickerConfig: { reason: config } };
        if (!value)
            return null;
        const parsed = parseTimeInput(value);
        if (parsed.error === "format")
            return { voteyPickerFormat: { expected: this.expectedFormat } };
        if (parsed.error === "time")
            return { voteyPickerTime: { input: value } };
        if (!isTimeWithinBounds(value, this.min(), this.max())) {
            return { voteyPickerRange: { min: this.min(), max: this.max() } };
        }
        return null;
    }
    commitDraft(value) {
        const config = this.configurationError();
        if (config)
            return { value: null, error: { voteyPickerConfig: { reason: config } } };
        if (!value)
            return { value: null, error: null };
        const parsed = parseTimeInput(value);
        if (parsed.error === "format")
            return { value: null, error: { voteyPickerFormat: { expected: this.expectedFormat } } };
        if (parsed.error === "time")
            return { value: null, error: { voteyPickerTime: { input: value } } };
        if (!isTimeWithinBounds(value, this.min(), this.max())) {
            return { value: null, error: { voteyPickerRange: { min: this.min(), max: this.max() } } };
        }
        if (this.timeEntryPolicy() === "listOnly" &&
            (parsed.value.hour * 60 + parsed.value.minute) % this.stepMinutes() !== 0) {
            return { value: null, error: { voteyPickerPolicy: { stepMinutes: this.stepMinutes() } } };
        }
        return { value, error: null };
    }
    open() {
        if (!this.isDisabled && !this.configurationError()) {
            this.opened.set(true);
            queueMicrotask(() => this.menu()?.focusSelected());
        }
    }
    close() {
        if (!this.opened())
            return;
        this.opened.set(false);
        this.formControl.markAsTouched();
        queueMicrotask(() => this.field()?.nativeElement.focus());
    }
    handleOverlayKeydown(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            this.close();
        }
    }
    chooseTime(item) {
        this.setCommitted(item.id);
        this.close();
    }
    clear() {
        if (this.isDisabled || this.isRequired)
            return;
        this.setCommitted(null);
        this.close();
    }
    configurationError() {
        return validateTimeConfig(this.stepMinutes(), this.timeEntryPolicy(), this.min(), this.max());
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTimePickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.17", type: VoteyTimePickerComponent, isStandalone: true, selector: "vt-time-picker", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, stepMinutes: { classPropertyName: "stepMinutes", publicName: "stepMinutes", isSignal: true, isRequired: false, transformFunction: null }, timeEntryPolicy: { classPropertyName: "timeEntryPolicy", publicName: "timeEntryPolicy", isSignal: true, isRequired: false, transformFunction: null }, min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null } }, viewQueries: [{ propertyName: "field", first: true, predicate: ["fieldInput"], descendants: true, isSignal: true }, { propertyName: "menu", first: true, predicate: PickerTimeListComponent, descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"picker\" [class.disabled]=\"isDisabled\" [class.error]=\"hasError\">\r\n  @if (label()) {\r\n    <label class=\"label\" [for]=\"inputId\">\r\n      <vt-text variant=\"label\" color=\"primary\" [content]=\"label() | vtTranslate\" />\r\n    </label>\r\n  }\r\n  <div class=\"field\" cdkOverlayOrigin #origin=\"cdkOverlayOrigin\" (click)=\"open()\">\r\n    <input\r\n      #fieldInput\r\n      class=\"control\"\r\n      vtPickerDraft\r\n      [id]=\"inputId\"\r\n      [formControl]=\"formControl\"\r\n      [displayValue]=\"displayValue\"\r\n      [value]=\"draft()\"\r\n      [disabled]=\"isDisabled\"\r\n      [required]=\"isRequired\"\r\n      [placeholder]=\"'LABEL.SELECT_TIME' | vtTranslate\"\r\n      [attr.aria-label]=\"label() ? null : ('LABEL.SELECT_TIME' | vtTranslate)\"\r\n      [attr.aria-describedby]=\"inputId + '-format ' + inputId + '-error'\"\r\n      [attr.aria-invalid]=\"hasError\"\r\n      [attr.aria-expanded]=\"opened()\"\r\n      [attr.aria-controls]=\"opened() ? inputId + '-panel' : null\"\r\n      (input)=\"updateDraft($event)\"\r\n      (blur)=\"finishDraft()\"\r\n      (keydown.escape)=\"close()\"\r\n    />\r\n    <span class=\"icon\" aria-hidden=\"true\"><vt-icon ico=\"ui-time\" [color]=\"isDisabled ? 'muted' : ''\" /></span>\r\n    @if (committed() && !isDisabled && !isRequired) {\r\n      <vt-button class=\"clear\" variant=\"ghost\" size=\"small\" ico=\"ui-close\" ariaLabel=\"LABEL.CLEAR\"\r\n        (click)=\"$event.stopPropagation()\" (pressed)=\"clear()\" />\r\n    }\r\n  </div>\r\n  <span class=\"format\" [id]=\"inputId + '-format'\">\r\n    <vt-text variant=\"caption-s\" color=\"muted\" [content]=\"'LABEL.TIME_FORMAT' | vtTranslate\" />\r\n  </span>\r\n  <vt-form-error [id]=\"inputId + '-error'\" [errors]=\"errorKeys\" />\r\n</div>\r\n\r\n<ng-template\r\n  cdkConnectedOverlay\r\n  [cdkConnectedOverlayOrigin]=\"origin\"\r\n  [cdkConnectedOverlayOpen]=\"opened()\"\r\n  [cdkConnectedOverlayPositions]=\"positions\"\r\n  [cdkConnectedOverlayPush]=\"true\"\r\n  (overlayOutsideClick)=\"close()\"\r\n  (overlayKeydown)=\"handleOverlayKeydown($event)\"\r\n>\r\n  <div class=\"panel\" [id]=\"inputId + '-panel'\">\r\n    <vt-picker-time-list\r\n      [items]=\"timeItems()\"\r\n      [selectedId]=\"committed()\"\r\n      (selected)=\"chooseTime($event)\"\r\n      (dismissed)=\"close()\"\r\n    />\r\n  </div>\r\n</ng-template>\r\n", styles: [":host{display:block;width:320px;max-width:100%}.picker{display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:100%}.picker .label{display:block}.picker .field{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-gap-xs);width:100%;height:50px;padding:0 var(--space-field-padding-x);border:1px solid var(--color-border-field);border-radius:var(--radius-m);background:var(--color-bg-surface);cursor:pointer}.picker .field:hover{border-color:var(--color-accent-hover)}.picker .field:focus-within{border:2px solid var(--color-accent-primary)}.picker .field .control{flex:1;min-width:0;height:100%;padding:0;border:0;outline:0;background:transparent;color:var(--color-text-primary);cursor:inherit;font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);line-height:var(--typo-field-line-height)}.picker .field .control::placeholder{color:var(--color-text-placeholder)}.picker .field .icon{flex:0 0 24px;width:24px;height:24px}.picker .field .clear{display:inline-flex;flex:0 0 28px}.picker .format{display:block}.picker.error .field{border-color:var(--color-state-error)}.picker.disabled .field{background:var(--color-bg-surface-tint);cursor:not-allowed}.picker.disabled .field .control{color:var(--color-text-muted)}.panel{box-sizing:border-box;display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:320px;max-width:calc(100vw - 2 * var(--space-stack-gap-s));max-height:calc(100vh - 2 * var(--space-stack-gap-s));padding:var(--space-icon-gap) var(--space-stack-gap-s);overflow:hidden auto;border:0;border-radius:var(--radius-m);background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-subtle),0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent)}.panel{--picker-time-list-max-height: 262px;max-height:min(288px,100vh - 2 * var(--space-stack-gap-s));padding:var(--space-icon-gap) 0;overflow:hidden;border:1px solid var(--color-border-subtle);box-shadow:0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent)}\n"], dependencies: [{ kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: PickerDraftValueAccessorDirective, selector: "input[vtPickerDraft]", inputs: ["displayValue"] }, { kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "component", type: PickerTimeListComponent, selector: "vt-picker-time-list", inputs: ["items", "selectedId"], outputs: ["selected", "dismissed"] }, { kind: "component", type: VoteyButtonComponent, selector: "vt-button", inputs: ["disabled", "type", "variant", "size", "text", "ariaLabel", "ico", "badge", "tooltipText", "disabledNote", "ariaExpanded", "ariaHasPopup", "ariaControls", "iconColor"], outputs: ["pressed"] }, { kind: "component", type: VoteyIconComponent, selector: "vt-icon", inputs: ["ico", "ariaLabel", "color"] }, { kind: "component", type: VoteyTextComponent, selector: "vt-text", inputs: ["content", "variant", "color", "uppercase", "italic", "wrap", "maxLines"] }, { kind: "component", type: VoteyFormErrorComponent, selector: "vt-form-error", inputs: ["errors", "ignoredErrors"] }, { kind: "pipe", type: VoteyTranslatePipe, name: "vtTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.17", ngImport: i0, type: VoteyTimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "vt-time-picker", changeDetection: ChangeDetectionStrategy.OnPush, imports: [ReactiveFormsModule, PickerDraftValueAccessorDirective, CdkOverlayOrigin, CdkConnectedOverlay, PickerTimeListComponent,
                        VoteyButtonComponent, VoteyIconComponent, VoteyTextComponent, VoteyFormErrorComponent, VoteyTranslatePipe], template: "<div class=\"picker\" [class.disabled]=\"isDisabled\" [class.error]=\"hasError\">\r\n  @if (label()) {\r\n    <label class=\"label\" [for]=\"inputId\">\r\n      <vt-text variant=\"label\" color=\"primary\" [content]=\"label() | vtTranslate\" />\r\n    </label>\r\n  }\r\n  <div class=\"field\" cdkOverlayOrigin #origin=\"cdkOverlayOrigin\" (click)=\"open()\">\r\n    <input\r\n      #fieldInput\r\n      class=\"control\"\r\n      vtPickerDraft\r\n      [id]=\"inputId\"\r\n      [formControl]=\"formControl\"\r\n      [displayValue]=\"displayValue\"\r\n      [value]=\"draft()\"\r\n      [disabled]=\"isDisabled\"\r\n      [required]=\"isRequired\"\r\n      [placeholder]=\"'LABEL.SELECT_TIME' | vtTranslate\"\r\n      [attr.aria-label]=\"label() ? null : ('LABEL.SELECT_TIME' | vtTranslate)\"\r\n      [attr.aria-describedby]=\"inputId + '-format ' + inputId + '-error'\"\r\n      [attr.aria-invalid]=\"hasError\"\r\n      [attr.aria-expanded]=\"opened()\"\r\n      [attr.aria-controls]=\"opened() ? inputId + '-panel' : null\"\r\n      (input)=\"updateDraft($event)\"\r\n      (blur)=\"finishDraft()\"\r\n      (keydown.escape)=\"close()\"\r\n    />\r\n    <span class=\"icon\" aria-hidden=\"true\"><vt-icon ico=\"ui-time\" [color]=\"isDisabled ? 'muted' : ''\" /></span>\r\n    @if (committed() && !isDisabled && !isRequired) {\r\n      <vt-button class=\"clear\" variant=\"ghost\" size=\"small\" ico=\"ui-close\" ariaLabel=\"LABEL.CLEAR\"\r\n        (click)=\"$event.stopPropagation()\" (pressed)=\"clear()\" />\r\n    }\r\n  </div>\r\n  <span class=\"format\" [id]=\"inputId + '-format'\">\r\n    <vt-text variant=\"caption-s\" color=\"muted\" [content]=\"'LABEL.TIME_FORMAT' | vtTranslate\" />\r\n  </span>\r\n  <vt-form-error [id]=\"inputId + '-error'\" [errors]=\"errorKeys\" />\r\n</div>\r\n\r\n<ng-template\r\n  cdkConnectedOverlay\r\n  [cdkConnectedOverlayOrigin]=\"origin\"\r\n  [cdkConnectedOverlayOpen]=\"opened()\"\r\n  [cdkConnectedOverlayPositions]=\"positions\"\r\n  [cdkConnectedOverlayPush]=\"true\"\r\n  (overlayOutsideClick)=\"close()\"\r\n  (overlayKeydown)=\"handleOverlayKeydown($event)\"\r\n>\r\n  <div class=\"panel\" [id]=\"inputId + '-panel'\">\r\n    <vt-picker-time-list\r\n      [items]=\"timeItems()\"\r\n      [selectedId]=\"committed()\"\r\n      (selected)=\"chooseTime($event)\"\r\n      (dismissed)=\"close()\"\r\n    />\r\n  </div>\r\n</ng-template>\r\n", styles: [":host{display:block;width:320px;max-width:100%}.picker{display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:100%}.picker .label{display:block}.picker .field{box-sizing:border-box;display:flex;align-items:center;gap:var(--space-gap-xs);width:100%;height:50px;padding:0 var(--space-field-padding-x);border:1px solid var(--color-border-field);border-radius:var(--radius-m);background:var(--color-bg-surface);cursor:pointer}.picker .field:hover{border-color:var(--color-accent-hover)}.picker .field:focus-within{border:2px solid var(--color-accent-primary)}.picker .field .control{flex:1;min-width:0;height:100%;padding:0;border:0;outline:0;background:transparent;color:var(--color-text-primary);cursor:inherit;font-size:var(--typo-field-font-size);font-weight:var(--typo-field-font-weight);line-height:var(--typo-field-line-height)}.picker .field .control::placeholder{color:var(--color-text-placeholder)}.picker .field .icon{flex:0 0 24px;width:24px;height:24px}.picker .field .clear{display:inline-flex;flex:0 0 28px}.picker .format{display:block}.picker.error .field{border-color:var(--color-state-error)}.picker.disabled .field{background:var(--color-bg-surface-tint);cursor:not-allowed}.picker.disabled .field .control{color:var(--color-text-muted)}.panel{box-sizing:border-box;display:flex;flex-direction:column;gap:var(--space-stack-gap-s);width:320px;max-width:calc(100vw - 2 * var(--space-stack-gap-s));max-height:calc(100vh - 2 * var(--space-stack-gap-s));padding:var(--space-icon-gap) var(--space-stack-gap-s);overflow:hidden auto;border:0;border-radius:var(--radius-m);background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-subtle),0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent)}.panel{--picker-time-list-max-height: 262px;max-height:min(288px,100vh - 2 * var(--space-stack-gap-s));padding:var(--space-icon-gap) 0;overflow:hidden;border:1px solid var(--color-border-subtle);box-shadow:0 8px 24px -4px color-mix(in srgb,var(--color-text-primary) 12%,transparent)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], stepMinutes: [{ type: i0.Input, args: [{ isSignal: true, alias: "stepMinutes", required: false }] }], timeEntryPolicy: [{ type: i0.Input, args: [{ isSignal: true, alias: "timeEntryPolicy", required: false }] }], min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], field: [{ type: i0.ViewChild, args: ["fieldInput", { isSignal: true }] }], menu: [{ type: i0.ViewChild, args: [i0.forwardRef(() => PickerTimeListComponent), { isSignal: true }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VOTEY_SVG_REGISTRY_CONFIG, VOTEY_TRANSLATOR, VoteyButtonComponent, VoteyButtonSizes, VoteyButtonVariants, VoteyCheckboxComponent, VoteyChipComponent, VoteyDatePickerComponent, VoteyDatePickerModes, VoteyDeviceService, VoteyFilePickerComponent, VoteyFilePickerValidationErrors, VoteyFormControlApplyDirective, VoteyFormErrorComponent, VoteyIconComponent, VoteyIconNames, VoteyIconRegistryEntries, VoteyIllustrationNames, VoteyIllustrationRegistryEntries, VoteyInputComponent, VoteyInputModes, VoteyInputTypeNames, VoteyInputTypes, VoteyInputVariants, VoteyMenuComponent, VoteyMultiSelectPopoverComponent, VoteyPaginationComponent, VoteyRadioButtonComponent, VoteyRadioOptionContentDirective, VoteySelectComponent, VoteySelectVariants, VoteySvgRegistryService, VoteyTextAreaComponent, VoteyTextColors, VoteyTextComponent, VoteyTextVariants, VoteyTimeEntryPolicies, VoteyTimePickerComponent, VoteyTranslatePipe, defaultFetchParams, emptyPaginatedList, emptyPaginatedListLoading, noPaginationParams, provideVoteyDeviceDetection, provideVoteySvgRegistry };
//# sourceMappingURL=pleodigital-design-system-votey-angular.mjs.map
