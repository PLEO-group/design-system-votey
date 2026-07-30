import {
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import {
  VoteyIconRegistryEntries,
  VoteyIllustrationRegistryEntries,
} from "./votey-assets";

export interface VoteySvgRegistryConfig {
  readonly assetBaseUrl?: string;
}

export const VOTEY_SVG_REGISTRY_CONFIG =
  new InjectionToken<VoteySvgRegistryConfig>("VOTEY_SVG_REGISTRY_CONFIG");

const DEFAULT_ASSET_BASE_URL = "assets/votey";

@Injectable({
  providedIn: "root",
})
export class VoteySvgRegistryService {
  private readonly matIconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly config: VoteySvgRegistryConfig =
    inject(VOTEY_SVG_REGISTRY_CONFIG, { optional: true }) ?? {};
  private registered = false;

  public register(): void {
    if (this.registered) return;

    const assetBaseUrl: string = (
      this.config.assetBaseUrl ?? DEFAULT_ASSET_BASE_URL
    ).replace(/\/+$/, "");

    for (const asset of [
      ...VoteyIconRegistryEntries,
      ...VoteyIllustrationRegistryEntries,
    ]) {
      const assetUrl: string = assetBaseUrl
        ? `${assetBaseUrl}/${asset.path}`
        : asset.path;

      this.matIconRegistry.addSvgIcon(
        asset.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(assetUrl),
      );
    }

    this.registered = true;
  }
}

export function provideVoteySvgRegistry(
  config: VoteySvgRegistryConfig = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: VOTEY_SVG_REGISTRY_CONFIG,
      useValue: config,
    },
    provideEnvironmentInitializer((): void => {
      inject(VoteySvgRegistryService).register();
    }),
  ]);
}
