import path from "node:path";
import {
  addFinding,
  createReport,
  exitForReport,
  hasException,
  isNonEmptyString,
  isStringArray,
  parseArgs,
  printReport,
  readJson,
} from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.manifest) throw new Error("Provide --manifest <design-system.manifest.json>");

const manifestPath = path.resolve(args.manifest);
const manifest = readJson(manifestPath);
const report = createReport(`Design system manifest: ${manifestPath}`);

function block(code, message, details) {
  addFinding(report, "BLOCK", code, message, details);
}

function warn(code, message, details) {
  addFinding(report, "WARN", code, message, details);
}

if (manifest.schemaVersion !== 1) block("manifest.schema-version", "schemaVersion must equal 1");
if (manifest.kind !== "pleo-design-system") block("manifest.kind", "kind must equal pleo-design-system");

const identity = manifest.identity ?? {};
if (!isNonEmptyString(identity.product)) block("identity.product", "identity.product is required");
if (!isNonEmptyString(identity.packageName)) block("identity.package-name", "identity.packageName is required");
if (!/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(identity.version ?? "")) {
  block("identity.semver", "identity.version must use SemVer");
}
if (!identity.packageName?.startsWith("@pleodigital/design-system-") && !hasException(manifest, "custom-package-name")) {
  warn("identity.custom-package-name", "Package does not use the default @pleodigital/design-system-<product> name");
}
if (identity.registry?.type !== "npmjs" && !hasException(manifest, "custom-registry")) {
  warn("identity.custom-registry", "Registry differs from the npmjs company default");
}

const designSource = manifest.designSource ?? {};
if (!["figma", "other"].includes(designSource.type)) {
  block("design-source.type", "designSource.type must equal figma or other");
}
if (designSource.type === "figma") {
  if (!/^https:\/\/(?:www\.)?figma\.com\//.test(designSource.projectUrl ?? "")) {
    block("design-source.figma-url", "Figma design source requires a link to the whole Figma project or file");
  }
  if (designSource.exceptionReason !== null) {
    block("design-source.figma-exception", "Figma design source requires exceptionReason: null");
  }
}
if (designSource.type === "other" && !isNonEmptyString(designSource.exceptionReason)) {
  block("design-source.exception", "Non-Figma design source requires exceptionReason");
}

const repository = manifest.repository ?? {};
if (!["standalone-repository", "colocated-workspace-package", "embedded-mini-ds"].includes(repository.topology)) {
  block("repository.topology", "Choose standalone-repository, colocated-workspace-package, or an approved embedded-mini-ds");
}
if (!isNonEmptyString(repository.packageRoot)) block("repository.package-root", "repository.packageRoot is required");
if (!Array.isArray(repository.consumerRoots)) block("repository.consumer-roots", "repository.consumerRoots must be an array");
if (repository.topology === "colocated-workspace-package" && repository.consumerRoots?.length === 0) {
  block("repository.colocated-consumer", "A colocated package requires at least one consumer root");
}
if (repository.topology === "embedded-mini-ds") {
  if (repository.packageRoot !== ".") block("repository.embedded-root", "embedded-mini-ds requires packageRoot: .");
  if (repository.consumerRoots?.length !== 0) block("repository.embedded-consumers", "embedded-mini-ds requires an empty consumerRoots array");
}
if (repository.boundaryPolicy?.publicImportsOnly !== true) block("repository.public-api", "publicImportsOnly must be true");
if (repository.boundaryPolicy?.packageImportsConsumer !== false) block("repository.reverse-import", "packageImportsConsumer must be false");
if (repository.boundaryPolicy?.packCheck !== true) block("repository.pack-check", "packCheck must be true");
if (!Array.isArray(repository.boundaryPolicy?.forbiddenPackageImportPrefixes)) {
  block("repository.forbidden-import-prefixes", "forbiddenPackageImportPrefixes must be an array");
}
const miniDs = repository.boundaryPolicy?.localMiniDs ?? {};
if (!["forbid", "migration-baseline"].includes(miniDs.mode)) block("repository.mini-ds-mode", "Unknown localMiniDs mode");
if (miniDs.mode === "migration-baseline" && !isNonEmptyString(miniDs.baselineFile)) {
  block("repository.mini-ds-baseline", "migration-baseline requires baselineFile");
}
if (miniDs.mode === "forbid" && miniDs.baselineFile !== null) {
  block("repository.mini-ds-forbid-baseline", "forbid mode requires baselineFile: null");
}
if (!["block", "review-required"].includes(miniDs.heuristicFindings)) {
  block("repository.mini-ds-findings", "heuristicFindings must equal block or review-required");
}
if (repository.topology === "embedded-mini-ds") {
  if (miniDs.mode !== "forbid" || miniDs.baselineFile !== null || miniDs.heuristicFindings !== "block") {
    block("repository.embedded-mini-ds-policy", "embedded-mini-ds requires localMiniDs forbid, baselineFile null, and heuristicFindings block");
  }
  if (!isNonEmptyString(miniDs.justification)) block("repository.embedded-justification", "embedded-mini-ds requires localMiniDs.justification");
} else if (miniDs.justification !== null) {
  block("repository.mini-ds-justification", "localMiniDs.justification must be null unless topology is embedded-mini-ds");
}

const distribution = manifest.distribution ?? {};
if (!["workspace-internal", "registry"].includes(distribution.mode)) {
  block("distribution.mode", "Choose workspace-internal or registry distribution");
}
if (distribution.mode === "workspace-internal" && distribution.publishable !== false) {
  block("distribution.internal-publishable", "workspace-internal requires publishable: false");
}
if (distribution.mode === "registry" && distribution.publishable !== true) {
  block("distribution.registry-publishable", "registry distribution requires publishable: true");
}
if (repository.topology === "embedded-mini-ds" && (distribution.mode !== "workspace-internal" || distribution.publishable !== false)) {
  block("distribution.embedded", "embedded-mini-ds requires workspace-internal distribution with publishable: false");
}

const frameworks = manifest.frameworks ?? {};
const enabledFrameworks = ["angular", "react"].filter((name) => frameworks[name]?.enabled === true);
if (enabledFrameworks.length === 0) block("framework.none", "Enable at least one framework");
for (const name of enabledFrameworks) {
  if (!isNonEmptyString(frameworks[name]?.entryPoint)) block("framework.entry-point", `${name} requires an entryPoint`);
}
if (frameworks.angular?.entryPoint === "./tokens" || frameworks.react?.entryPoint === "./tokens") {
  block("framework.tokens-entry-point", "Do not expose a separate /tokens entry point");
}

const tokens = manifest.tokens ?? {};
if (tokens.generator !== "style-dictionary") block("tokens.generator", "Style Dictionary is required");
if (tokens.namingContract !== "pleo-design-system-tokens-v1") block("tokens.naming", "tokens.namingContract must equal pleo-design-system-tokens-v1");
if (tokens.sourceOfTruth?.type === "figma-variables" && !isNonEmptyString(tokens.sourceOfTruth.url)) {
  block("tokens.figma-url", "Figma Variables source requires a URL");
}
if (tokens.sourceOfTruth?.type !== "figma-variables" && !isNonEmptyString(tokens.sourceOfTruth?.exceptionReason)) {
  block("tokens.source-exception", "Non-Figma token source requires exceptionReason");
}

const allowedLayers = new Set(["core", "semantic"]);
for (const [category, policy] of Object.entries(tokens.categories ?? {})) {
  for (const field of ["generate", "autocomplete", "allowedUsage"]) {
    if (!Array.isArray(policy[field]) || policy[field].some((item) => !allowedLayers.has(item))) {
      block("tokens.policy", `${category}.${field} must contain only core/semantic`);
    }
  }
  for (const item of [...(policy.autocomplete ?? []), ...(policy.allowedUsage ?? [])]) {
    if (!(policy.generate ?? []).includes(item)) block("tokens.policy-subset", `${category}: ${item} must be generated before it can be exposed`);
  }
}

const colorPolicy = tokens.categories?.color;
if (colorPolicy?.allowedUsage?.includes("core") && !hasException(manifest, "allow-core-colors")) {
  warn("tokens.core-colors", "Core colors are allowed without an active allow-core-colors exception");
}

for (const name of enabledFrameworks) {
  const policy = tokens.frameworkPolicies?.[name];
  if (!policy) {
    block("tokens.framework-policy", `Missing token framework policy for ${name}`);
    continue;
  }
  if (!policy.outputs?.includes("scss")) block("tokens.scss", `${name} must generate SCSS`);
  if (name === "angular" && !policy.outputs?.includes("css-variables")) warn("tokens.angular-css", "Angular should expose CSS variables");
  if (name === "react" && !policy.outputs?.includes("tailwind")) warn("tokens.react-tailwind", "React should expose Tailwind integration");
  if (policy.outputs?.some((output) => !["scss", "css-variables", "tailwind"].includes(output))) {
    block("tokens.output", `${name} declares an unsupported token output`);
  }
}

const themes = manifest.themes ?? {};
if (!Array.isArray(themes.modes)
  || themes.modes.length !== 2
  || !themes.modes.includes("light")
  || !themes.modes.includes("dark")) {
  block("themes.required", "themes.modes must contain exactly light and dark");
}
for (const theme of ["light", "dark"]) {
  if (!isNonEmptyString(themes.semanticTokenFiles?.[theme])) {
    block("themes.semantic-source", `themes.semanticTokenFiles.${theme} is required`);
  } else if (/[*?\[\]]/.test(themes.semanticTokenFiles[theme])) {
    block("themes.semantic-source-glob", `themes.semanticTokenFiles.${theme} must identify one canonical file, not a glob`);
  }
}

const angularTheme = themes.angular ?? {};
if (frameworks.angular?.enabled === true) {
  if (angularTheme.enabled !== true) block("themes.angular-enabled", "Angular support requires themes.angular.enabled: true");
  const angularThemeDefaults = {
    host: "body",
    attribute: "data-theme",
    storage: "session",
    storageKey: "theme",
    defaultTheme: "light",
    initialThemeInHtml: "light",
    initialization: "explicit-load",
    useViewTransitions: true,
  };
  for (const [field, expected] of Object.entries(angularThemeDefaults)) {
    if (angularTheme[field] !== expected) {
      block("themes.angular-contract", `themes.angular.${field} must equal ${JSON.stringify(expected)}`);
    }
  }
  for (const field of ["servicePath", "contractScssPath"]) {
    if (!isNonEmptyString(angularTheme[field])) block("themes.angular-path", `themes.angular.${field} is required`);
  }
} else if (angularTheme.enabled !== false) {
  block("themes.angular-disabled", "React-only DS requires themes.angular.enabled: false");
}

const artifactPolicies = new Set(["build-only", "tracked-intermediate", "tracked-dist"]);
if (!artifactPolicies.has(manifest.artifacts?.policy)) block("artifacts.policy", "Unknown artifact policy");
if (manifest.artifacts?.verifyDeterminism !== true) block("artifacts.determinism", "verifyDeterminism must be true");
if (!isStringArray(manifest.artifacts?.sources)) block("artifacts.sources", "artifacts.sources must be a non-empty string array");
if (!isStringArray(manifest.artifacts?.generated)) block("artifacts.generated", "artifacts.generated must be a non-empty string array");
if (isNonEmptyString(manifest.responsive?.generatedConfigScssPath)
  && !manifest.artifacts?.generated?.includes(manifest.responsive.generatedConfigScssPath)) {
  block("artifacts.responsive-config", "artifacts.generated must include responsive.generatedConfigScssPath");
}
if (manifest.artifacts?.policy !== "build-only" && !hasException(manifest, "custom-artifact-policy")) {
  warn("artifacts.custom-policy", "Artifact policy differs from build-only without an active exception");
}

if (manifest.assets?.angularSvgRegistry === true && frameworks.angular?.enabled !== true) {
  warn("assets.angular-registry", "Angular SVG registry is enabled while Angular is disabled");
}
if (manifest.assets?.namingContract !== "pleo-design-system-assets-v1") {
  block("assets.naming", "assets.namingContract must equal pleo-design-system-assets-v1");
}
for (const field of ["generatorPath", "configPath", "generatedTypesPath"]) {
  if (!isNonEmptyString(manifest.assets?.[field])) block("assets.pipeline", `assets.${field} is required`);
}
if (frameworks.react?.enabled === true && !isNonEmptyString(manifest.assets?.reactBarrelPath)) {
  block("assets.react-barrel", "React support requires assets.reactBarrelPath");
}
if (frameworks.react?.enabled !== true && manifest.assets?.reactBarrelPath !== null) {
  warn("assets.react-barrel-unused", "React is disabled, so assets.reactBarrelPath should be null");
}

const responsiveModes = new Set(["device-contract", "css-media"]);
const responsive = manifest.responsive ?? {};
if (!responsiveModes.has(responsive.mode)) {
  block("responsive.mode", "Responsive mode must be device-contract or css-media");
}
if (!isNonEmptyString(responsive.generatedConfigScssPath) || !responsive.generatedConfigScssPath.endsWith(".scss")) {
  block("responsive.generated-config", "responsive.generatedConfigScssPath must point to an SCSS file");
}

const responsiveNamePattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const deviceTypes = responsive.deviceTypes;
if (!isStringArray(deviceTypes) || new Set(deviceTypes).size !== deviceTypes.length) {
  block("responsive.device-types", "responsive.deviceTypes must contain unique device names");
} else if (deviceTypes.some((name) => !responsiveNamePattern.test(name))) {
  block("responsive.device-type-name", "Device type names must use lowercase kebab-case");
}
if (responsive.mode === "device-contract" && deviceTypes?.length === 0) {
  block("responsive.device-types-missing", "device-contract requires at least one device type");
}
if (responsive.mode === "css-media" && deviceTypes?.length !== 0) {
  block("responsive.media-device-types", "css-media requires an empty deviceTypes list");
}

const breakpoints = responsive.breakpoints ?? {};
const breakpointNames = breakpoints.names;
if (!isStringArray(breakpointNames) || breakpointNames.length < 2 || new Set(breakpointNames).size !== breakpointNames.length) {
  block("responsive.breakpoints", "responsive.breakpoints.names must contain at least two unique ordered names");
} else if (breakpointNames.some((name) => !responsiveNamePattern.test(name))) {
  block("responsive.breakpoint-name", "Breakpoint names must use lowercase kebab-case");
}
if (!isNonEmptyString(breakpoints.tokenFile)) block("responsive.breakpoint-file", "responsive.breakpoints.tokenFile is required");
if (!isNonEmptyString(breakpoints.tokenPath)) block("responsive.breakpoint-path", "responsive.breakpoints.tokenPath is required");

const breakpointSet = new Set(breakpointNames ?? []);
const deviceSet = new Set(deviceTypes ?? []);
const deviceBreakpointMap = responsive.deviceBreakpointMap;
if (!deviceBreakpointMap || typeof deviceBreakpointMap !== "object" || Array.isArray(deviceBreakpointMap)) {
  block("responsive.device-breakpoint-map", "responsive.deviceBreakpointMap must be an object");
} else if (responsive.mode === "device-contract") {
  for (const device of deviceSet) {
    if (!breakpointSet.has(deviceBreakpointMap[device])) {
      block("responsive.device-breakpoint", `Device ${device} must map to a declared reference breakpoint`);
    }
  }
  for (const device of Object.keys(deviceBreakpointMap)) {
    if (!deviceSet.has(device)) block("responsive.device-breakpoint-extra", `Map uses undeclared device type: ${device}`);
  }
} else if (Object.keys(deviceBreakpointMap).length !== 0) {
  block("responsive.media-device-breakpoint-map", "css-media requires an empty responsive.deviceBreakpointMap");
}

const scaling = responsive.scaling ?? {};
if (typeof scaling.enabled !== "boolean") block("responsive.scaling-enabled", "responsive.scaling.enabled must be boolean");
if (responsive.mode === "device-contract" && scaling.enabled !== true) {
  block("responsive.device-scaling", "device-contract requires responsive token scaling");
}
if (responsive.mode === "css-media" && scaling.enabled !== false) {
  block("responsive.media-scaling", "css-media does not use the device-based scaling contract");
}
const multipliers = scaling.deviceMultipliers;
if (!multipliers || typeof multipliers !== "object" || Array.isArray(multipliers)) {
  block("responsive.multipliers", "responsive.scaling.deviceMultipliers must be an object");
} else {
  if (scaling.enabled) {
    for (const device of deviceSet) {
      if (!(Number.isFinite(multipliers[device]) && multipliers[device] > 0)) {
        block("responsive.multiplier-missing", `Missing positive multiplier for device type: ${device}`);
      }
    }
    for (const device of Object.keys(multipliers)) {
      if (!deviceSet.has(device)) block("responsive.multiplier-extra", `Multiplier uses undeclared device type: ${device}`);
    }
  } else if (Object.keys(multipliers).length !== 0) {
    block("responsive.multipliers-disabled", "Disabled scaling requires an empty deviceMultipliers object");
  }
}

const fallbacks = scaling.implicitBreakpointFallbacks;
if (!fallbacks || typeof fallbacks !== "object" || Array.isArray(fallbacks)) {
  block("responsive.fallbacks", "responsive.scaling.implicitBreakpointFallbacks must be an object");
} else {
  for (const [from, to] of Object.entries(fallbacks)) {
    if (!breakpointSet.has(from) || !breakpointSet.has(to)) {
      block("responsive.fallback-name", `Fallback ${from} -> ${to} must use declared breakpoint names`);
    }
    if (from === to) block("responsive.fallback-self", `Breakpoint fallback cannot point to itself: ${from}`);
  }
  if (!scaling.enabled && Object.keys(fallbacks).length !== 0) {
    block("responsive.fallbacks-disabled", "Disabled scaling requires an empty implicitBreakpointFallbacks object");
  }
}

const grid = responsive.grid;
if (!grid || typeof grid !== "object" || Array.isArray(grid)) {
  block("responsive.grid", "responsive.grid must be an object");
} else if (typeof grid.enabled !== "boolean") {
  block("responsive.grid-enabled", "responsive.grid.enabled must be boolean");
} else if (grid.enabled) {
  if (!isStringArray(grid.variants) || grid.variants.length === 0 || new Set(grid.variants).size !== grid.variants.length) {
    block("responsive.grid-variants", "Enabled grid requires unique responsive.grid.variants");
  } else if (grid.variants.some((name) => !responsiveNamePattern.test(name))) {
    block("responsive.grid-variant-name", "Grid variant names must use lowercase kebab-case");
  }
  if (!grid.variants?.includes(grid.defaultVariant)) block("responsive.grid-default", "grid.defaultVariant must be included in grid.variants");
  if (!isNonEmptyString(grid.tokenFile)) block("responsive.grid-file", "Enabled grid requires grid.tokenFile");
  if (!isNonEmptyString(grid.tokenPath)) block("responsive.grid-path", "Enabled grid requires grid.tokenPath");
} else {
  if ((grid.variants?.length ?? 0) !== 0 || grid.defaultVariant !== null || grid.tokenFile !== null || grid.tokenPath !== null) {
    block("responsive.grid-disabled", "Disabled grid requires empty variants and null defaultVariant/tokenFile/tokenPath");
  }
}

if (!isNonEmptyString(manifest.preview?.command)) block("preview.command", "Preview build command is required");
for (const command of ["buildTokens", "buildAssets", "checkAssets", "build", "test", "pack"]) {
  if (!isNonEmptyString(manifest.commands?.[command])) block("commands.required", `commands.${command} is required`);
}
if (distribution.mode === "registry" && !isNonEmptyString(manifest.commands?.publish)) {
  block("commands.publish", "Registry distribution requires commands.publish");
}
if (distribution.mode === "workspace-internal" && manifest.commands?.publish !== null) {
  warn("commands.internal-publish", "workspace-internal should use commands.publish: null until publication is activated");
}

const allowedCi = new Set(["github-actions", "gitlab-ci", "bitbucket-pipelines"]);
if (!Array.isArray(manifest.ci?.providers) || manifest.ci.providers.length === 0) block("ci.providers", "At least one CI provider is required");
else if (manifest.ci.providers.some((provider) => !allowedCi.has(provider))) block("ci.provider", "Unsupported CI provider");

if (!/^[a-z0-9-]+$/.test(manifest.designSystemSkill?.name ?? "")) {
  block("skill.name", "designSystemSkill.name must use lowercase hyphen-case");
}
if (!isNonEmptyString(manifest.designSystemSkill?.sourcePath)) {
  block("skill.source-path", "designSystemSkill.sourcePath is required for deterministic CI validation");
} else {
  const normalizedSkillPath = manifest.designSystemSkill.sourcePath.replaceAll("\\", "/");
  if (path.isAbsolute(manifest.designSystemSkill.sourcePath)
    || normalizedSkillPath.split("/").includes("..")
    || normalizedSkillPath === ".tmp"
    || normalizedSkillPath.startsWith(".tmp/")) {
    block("skill.source-path-boundary", "designSystemSkill.sourcePath must be a repository-relative source path outside .tmp");
  }
  if (path.posix.basename(normalizedSkillPath) !== manifest.designSystemSkill.name) {
    block("skill.source-path-name", "designSystemSkill.sourcePath must end with designSystemSkill.name");
  }
}
if (manifest.designSystemSkill?.verifiedPackageVersion !== identity.version) {
  block("skill.version", "The DS skill must be verified against the current package version");
}
const companyContractPins = manifest.designSystemSkill?.companyStandardContracts;
if (!Array.isArray(companyContractPins) || companyContractPins.length === 0) {
  block("skill.company-contracts", "designSystemSkill.companyStandardContracts must be a non-empty array");
} else {
  const seenContractIds = new Set();
  for (const pin of companyContractPins) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pin?.id ?? "")) {
      block("skill.company-contract-id", "Company contract ids must use lowercase hyphen-case");
    }
    if (!/^\d+\.\d+\.\d+$/.test(pin?.version ?? "")) {
      block("skill.company-contract-version", `${pin?.id ?? "<missing>"} must pin an exact SemVer version`);
    }
    if (seenContractIds.has(pin?.id)) block("skill.company-contract-duplicate", `Duplicate company contract pin: ${pin.id}`);
    seenContractIds.add(pin?.id);
  }
}

if (!Array.isArray(manifest.exceptions)) block("exceptions.type", "exceptions must be an array");

printReport(report, args.json === true);
exitForReport(report);

