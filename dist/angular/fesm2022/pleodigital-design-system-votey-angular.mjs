import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, PLATFORM_ID, Injectable, provideEnvironmentInitializer } from '@angular/core';
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
class VoteyDeviceService {
    document = inject(DOCUMENT);
    platformId = inject(PLATFORM_ID);
    deviceTypeSubject = new BehaviorSubject(null);
    dimensionsSubject = new BehaviorSubject(DEFAULT_DIMENSIONS);
    initializedSubject = new BehaviorSubject(false);
    listeningForResize = false;
    deviceType$ = this.deviceTypeSubject.asObservable();
    deviceDimensions$ = this.dimensionsSubject.asObservable();
    initialized$ = this.initializedSubject.asObservable();
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
function provideVoteyDeviceDetection() {
    return provideEnvironmentInitializer(() => inject(VoteyDeviceService).initialize());
}

/**
 * Generated bundle index. Do not edit.
 */

export { VoteyDeviceService, provideVoteyDeviceDetection };
//# sourceMappingURL=pleodigital-design-system-votey-angular.mjs.map
