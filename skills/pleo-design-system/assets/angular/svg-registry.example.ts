import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { DesignSystemSvgRegistryEntries } from "./design-system-assets.generated";

export interface DesignSystemSvgRegistryConfig {
  assetBaseUrl?: string;
}

export function provideDesignSystemSvgRegistry(
  config: DesignSystemSvgRegistryConfig,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const registry = inject(MatIconRegistry);
      const sanitizer = inject(DomSanitizer);
      const baseUrl = (config.assetBaseUrl ?? "assets/design-system").replace(/\/$/, "");

      for (const entry of DesignSystemSvgRegistryEntries) {
        const url = sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}/${entry.relativePath}`);
        registry.addSvgIcon(entry.name, url);
      }
    }),
  ]);
}

