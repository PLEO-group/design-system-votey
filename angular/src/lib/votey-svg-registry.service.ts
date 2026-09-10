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

export function getVoteySvgAssetUrl(
  assetPath: string,
  config: VoteySvgRegistryConfig = {}
): string {
  const assetBaseUrl: string = (
    config.assetBaseUrl ?? DEFAULT_ASSET_BASE_URL
  ).replace(/\/+$/, "");

  return assetBaseUrl ? `${assetBaseUrl}/${assetPath}` : assetPath;
}

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

    for (const asset of [
      ...VoteyIconRegistryEntries,
      ...VoteyIllustrationRegistryEntries,
    ]) {
      const assetUrl: string = getVoteySvgAssetUrl(asset.path, this.config);

      this.matIconRegistry.addSvgIcon(
        asset.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(assetUrl)
      );
    }

    this.registered = true;
  }
}

export function provideVoteySvgRegistry(
  config: VoteySvgRegistryConfig = {}
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
