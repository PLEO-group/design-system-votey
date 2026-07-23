import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  EnvironmentProviders,
  inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  provideEnvironmentInitializer,
} from "@angular/core";
import DeviceDetector from "node-device-detector";
import { BehaviorSubject, Observable } from "rxjs";

export type VoteyDevice = "mobile" | "tablet" | "desktop";
export type VoteyDeviceOrientation = "vertical" | "horizontal";

export interface VoteyDeviceDimensions {
  width: number;
  height: number;
  mobileBreakpoint: 375;
  tabletBreakpoint: 1024;
  laptopBreakpoint: 1280;
  desktopBreakpoint: 1920;
}

const DEFAULT_DIMENSIONS: VoteyDeviceDimensions = {
  width: 0,
  height: 0,
  mobileBreakpoint: 375,
  tabletBreakpoint: 1024,
  laptopBreakpoint: 1280,
  desktopBreakpoint: 1920,
};

@Injectable({
  providedIn: "root",
})
export class VoteyDeviceService implements OnDestroy {
  private readonly document: Document = inject(DOCUMENT);
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly deviceTypeSubject = new BehaviorSubject<VoteyDevice | null>(
    null,
  );
  private readonly dimensionsSubject =
    new BehaviorSubject<VoteyDeviceDimensions>(DEFAULT_DIMENSIONS);
  private readonly initializedSubject = new BehaviorSubject<boolean>(false);
  private listeningForResize = false;

  public readonly deviceType$: Observable<VoteyDevice | null> =
    this.deviceTypeSubject.asObservable();
  public readonly deviceDimensions$: Observable<VoteyDeviceDimensions> =
    this.dimensionsSubject.asObservable();
  public readonly initialized$: Observable<boolean> =
    this.initializedSubject.asObservable();

  public currentDevice: VoteyDevice | null = null;
  public deviceOrientation: VoteyDeviceOrientation = "vertical";
  public isMobileDevice = false;
  public isTabletDevice = false;
  public isDesktopDevice = false;

  private readonly handleResize = (): void => {
    const browserWindow = this.document.defaultView;

    if (browserWindow) {
      this.update(browserWindow.innerWidth, browserWindow.innerHeight);
    }
  };

  public initialize(): void {
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

  public update(innerWidth: number, innerHeight: number): void {
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

  public ngOnDestroy(): void {
    const browserWindow = this.document.defaultView;

    if (browserWindow && this.listeningForResize) {
      browserWindow.removeEventListener("resize", this.handleResize);
      this.listeningForResize = false;
    }
  }

  private detectDevice(browserNavigator: Navigator): void {
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
    const isTouchMac =
      result.device.type === "desktop" &&
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

  private applyDocumentState(innerHeight: number): void {
    if (!this.currentDevice) {
      return;
    }

    this.deviceTypeSubject.next(this.currentDevice);
    this.document.body.setAttribute("data-device", this.currentDevice);
    this.document.body.setAttribute(
      "data-orientation",
      this.deviceOrientation,
    );
    this.document.documentElement.style.setProperty(
      "--vh",
      `${innerHeight / 100}px`,
    );
  }
}

export function provideVoteyDeviceDetection(): EnvironmentProviders {
  return provideEnvironmentInitializer((): void =>
    inject(VoteyDeviceService).initialize(),
  );
}
