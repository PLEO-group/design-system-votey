import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  Injectable,
  makeEnvironmentProviders,
  OnDestroy,
  PLATFORM_ID,
  provideEnvironmentInitializer,
} from "@angular/core";
import DeviceDetector from "node-device-detector";
import { BehaviorSubject, Observable } from "rxjs";

export type VoteyDevice = "mobile" | "tablet" | "desktop";
export type VoteyDeviceOrientation = "vertical" | "horizontal";

export interface VoteyGridConfig {
  readonly desktop: number;
  readonly tablet: number;
  readonly mobile: number;
}

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

export const VOTEY_DEFAULT_GRID_CONFIG: Readonly<VoteyGridConfig> =
  Object.freeze({
    desktop: 12,
    tablet: 8,
    mobile: 4,
  });

export const VOTEY_GRID_CONFIG = new InjectionToken<VoteyGridConfig>(
  "VoteyGridConfig",
);

@Injectable({
  providedIn: "root",
})
export class VoteyDeviceService implements OnDestroy {
  private readonly document: Document = inject(DOCUMENT);
  private readonly gridConfig: VoteyGridConfig =
    inject(VOTEY_GRID_CONFIG, { optional: true }) ??
    VOTEY_DEFAULT_GRID_CONFIG;
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly deviceTypeSubject = new BehaviorSubject<VoteyDevice | null>(
    null,
  );
  private readonly dimensionsSubject =
    new BehaviorSubject<VoteyDeviceDimensions>(DEFAULT_DIMENSIONS);
  private readonly initializedSubject = new BehaviorSubject<boolean>(false);
  private readonly columnsAmountSubject = new BehaviorSubject<number>(0);
  private listeningForResize = false;

  public readonly deviceType$: Observable<VoteyDevice | null> =
    this.deviceTypeSubject.asObservable();
  public readonly deviceDimensions$: Observable<VoteyDeviceDimensions> =
    this.dimensionsSubject.asObservable();
  public readonly initialized$: Observable<boolean> =
    this.initializedSubject.asObservable();
  public readonly columnsAmount$: Observable<number> =
    this.columnsAmountSubject.asObservable();

  public columnsAmount = 0;
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
    this.columnsAmount = this.gridConfig[this.currentDevice];
    this.columnsAmountSubject.next(this.columnsAmount);
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

export function provideVoteyDeviceDetection(
  gridConfig: VoteyGridConfig = VOTEY_DEFAULT_GRID_CONFIG,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: VOTEY_GRID_CONFIG,
      useValue: gridConfig,
    },
    provideEnvironmentInitializer((): void =>
      inject(VoteyDeviceService).initialize(),
    ),
  ]);
}
