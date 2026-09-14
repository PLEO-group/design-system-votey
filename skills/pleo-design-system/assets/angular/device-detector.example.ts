import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  DestroyRef,
  EnvironmentProviders,
  Injectable,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from "@angular/core";
import DeviceDetector from "node-device-detector";

export type DesignSystemDevice = "mobile" | "tablet" | "desktop";

@Injectable({ providedIn: "root" })
export class DesignSystemDeviceService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #destroyRef = inject(DestroyRef);

  currentDevice: DesignSystemDevice = "desktop";
  isMobileDevice = false;
  isTabletDevice = false;
  isDesktopDevice = true;

  start(): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    const browserWindow = this.#document.defaultView;
    if (!browserWindow) return;

    this.#detectDevice(browserWindow.navigator);
    this.#writeDeviceContract();

    const updateViewportContract = (): void => {
      const { innerWidth: width, innerHeight: height } = browserWindow;
      this.#document.body.dataset["orientation"] = width > height ? "horizontal" : "vertical";
      this.#document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
    };

    updateViewportContract();
    browserWindow.addEventListener("resize", updateViewportContract, { passive: true });
    this.#destroyRef.onDestroy(() => browserWindow.removeEventListener("resize", updateViewportContract));
  }

  #detectDevice(browserNavigator: Navigator): void {
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
    const isTouchMac = result.device.type === "desktop"
      && browserNavigator.maxTouchPoints > 2
      && /Macintosh/.test(browserNavigator.userAgent);

    this.isMobileDevice = ["smartphone", "phablet", "feature phone"].includes(result.device.type ?? "");
    this.isTabletDevice = result.device.type === "tablet" || isTouchMac;
    this.isDesktopDevice = !this.isMobileDevice && !this.isTabletDevice;
    this.currentDevice = this.isMobileDevice ? "mobile" : this.isTabletDevice ? "tablet" : "desktop";
  }

  #writeDeviceContract(): void {
    this.#document.body.dataset["device"] = this.currentDevice;
  }
}

export function provideDesignSystemDeviceDetection(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => inject(DesignSystemDeviceService).start()),
  ]);
}
