import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  EnvironmentProviders,
  InjectionToken,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from "@angular/core";

export interface DesignSystemGridConfig {
  /** Must match a variant present in the generated grid tokens. */
  variant: string;
  /** Must match the host consumed by the copied grid CSS contract. */
  target: "html" | "body";
}

const DEFAULT_GRID_CONFIG: DesignSystemGridConfig = {
  variant: "default",
  target: "body",
};

export const DESIGN_SYSTEM_GRID_CONFIG = new InjectionToken<DesignSystemGridConfig>(
  "DESIGN_SYSTEM_GRID_CONFIG",
  { factory: () => DEFAULT_GRID_CONFIG },
);

function initializeDesignSystemGrid(): void {
  const document = inject(DOCUMENT);
  const platformId = inject(PLATFORM_ID);
  const config = inject(DESIGN_SYSTEM_GRID_CONFIG);
  if (!isPlatformBrowser(platformId)) return;
  if (!/^[a-z0-9-]+$/.test(config.variant)) {
    throw new Error(`Invalid design system grid variant: ${config.variant}`);
  }

  const target = config.target === "html" ? document.documentElement : document.body;
  target.dataset["gridType"] = config.variant;
}

export function provideDesignSystemGrid(
  config: Partial<DesignSystemGridConfig> = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DESIGN_SYSTEM_GRID_CONFIG,
      useValue: { ...DEFAULT_GRID_CONFIG, ...config },
    },
    provideAppInitializer(initializeDesignSystemGrid),
  ]);
}
