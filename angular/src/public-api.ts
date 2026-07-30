export {
  provideVoteyDeviceDetection,
  VOTEY_DEFAULT_GRID_CONFIG,
  VoteyDeviceService,
  VOTEY_GRID_CONFIG,
} from "./lib/votey-device.service";
export type {
  VoteyDevice,
  VoteyDeviceDimensions,
  VoteyDeviceOrientation,
  VoteyGridConfig,
} from "./lib/votey-device.service";
export {
  VoteyIconNames,
  VoteyIconRegistryEntries,
  VoteyIllustrationNames,
  VoteyIllustrationRegistryEntries,
} from "./lib/votey-assets";
export type {
  VoteyIcon,
  VoteyIllustration,
  VoteySvgRegistryEntry,
} from "./lib/votey-assets";
export {
  provideVoteySvgRegistry,
  VOTEY_SVG_REGISTRY_CONFIG,
  VoteySvgRegistryService,
} from "./lib/votey-svg-registry.service";
export type {
  VoteySvgRegistryConfig,
} from "./lib/votey-svg-registry.service";
