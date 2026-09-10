import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  addFinding,
  createReport,
  exitForReport,
  parseArgs,
  printReport,
  readFrontmatter,
  readJson,
  resolveDirectory,
} from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.manifest) throw new Error("Provide --manifest <design-system.manifest.json>");

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const contractsPath = path.resolve(args.contracts ?? path.join(scriptRoot, "..", "references", "company-standard-contracts.json"));
const manifest = readJson(path.resolve(args.manifest));
const projectRoot = path.resolve(args.project ?? path.dirname(path.resolve(args.manifest)));
const skillInput = args.skill ?? path.join(projectRoot, manifest.designSystemSkill?.sourcePath ?? "");
if (!args.skill && !manifest.designSystemSkill?.sourcePath) {
  throw new Error("Provide --skill or set designSystemSkill.sourcePath in the manifest");
}
const skillRoot = resolveDirectory(skillInput, "skill directory");
const registry = readJson(contractsPath);
const report = createReport(`Design-system skill: ${skillRoot}`);
const block = (code, message) => addFinding(report, "BLOCK", code, message);
const review = (code, message) => addFinding(report, "REVIEW_REQUIRED", code, message);

function compareSemver(left, right) {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function normalizeSearch(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isFigmaUrl(value) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).hostname.endsWith("figma.com");
  } catch {
    return false;
  }
}

const skillMdPath = path.join(skillRoot, "SKILL.md");
if (!fs.existsSync(skillMdPath)) {
  block("skill.missing", "SKILL.md is missing");
} else {
  const content = fs.readFileSync(skillMdPath, "utf8");
  const frontmatter = readFrontmatter(content);
  if (frontmatter.name !== manifest.designSystemSkill?.name) block("skill.name", "Skill name differs from the DS manifest");
  if (!frontmatter.description?.includes(manifest.identity?.packageName)) block("skill.trigger-package", "Description must mention the npm package name");

  const normalized = content.toLowerCase();
  const routingTerms = [
    ["references/design-system-contract.md"],
    ["references/tokens.md"],
    ["references/theming.md"],
    ["references/svg-assets.md"],
    ["references/responsiveness.md"],
    ["references/components.md"],
    ["references/preview.md"],
    ["references/consumers.md"],
    ["angular-only", "react-only", "shared"],
    ["contract-reference"],
  ];
  for (const alternatives of routingTerms) {
    if (!alternatives.some((term) => normalized.includes(term))) {
      block("skill.routing", `SKILL.md must route or describe ${alternatives.join("/")}`);
    }
  }
  if (!normalized.includes("pleo-design-system") || !normalized.includes("rutyn")) {
    block("skill.global-boundary", "SKILL.md must explain that routine work stays in the project skill and when pleo-design-system is used");
  }
}

const snapshotPath = path.join(skillRoot, "references", "design-system-manifest.json");
if (!fs.existsSync(snapshotPath)) {
  block("skill.manifest-snapshot", "references/design-system-manifest.json is required for shared portability");
} else {
  const snapshot = readJson(snapshotPath);
  if (snapshot.identity?.packageName !== manifest.identity?.packageName) block("skill.snapshot-package", "Manifest snapshot package differs from the source manifest");
  if (snapshot.identity?.version !== manifest.identity?.version) block("skill.snapshot-version", "Manifest snapshot is stale");
  if (snapshot.designSource?.projectUrl !== manifest.designSource?.projectUrl) {
    block("skill.snapshot-figma-project", "Manifest snapshot has a different Figma project URL");
  }
  if (snapshot.tokens?.sourceOfTruth?.url !== manifest.tokens?.sourceOfTruth?.url) {
    block("skill.snapshot-figma-tokens", "Manifest snapshot has a different Figma Variables URL");
  }
  if (JSON.stringify(snapshot.designSystemSkill?.companyStandardContracts) !== JSON.stringify(manifest.designSystemSkill?.companyStandardContracts)) {
    block("skill.snapshot-contracts", "Manifest snapshot has different company contract pins");
  }
}

const contractPath = path.join(skillRoot, "references", "design-system-contract.md");
if (!fs.existsSync(contractPath)) block("skill.contract", "references/design-system-contract.md is required");
const contractText = fs.existsSync(contractPath) ? fs.readFileSync(contractPath, "utf8") : "";

const domainReferences = [
  "tokens.md",
  "theming.md",
  "svg-assets.md",
  "responsiveness.md",
  "components.md",
  "preview.md",
  "consumers.md",
];

const requiredTermsByReference = {
  "tokens.md": [["figma", "source"], ["style dictionary"], ["generate"], ["autocomplete"], ["allowedusage", "allowed usage"], ["remove", "usuń"]],
  "theming.md": [["semantic"], ["light"], ["dark"], ["runtime", "not-applicable"], ["test", "walid"]],
  "svg-assets.md": [["source"], ["generator"], ["context"], ["rename", "zmień nazw"], ["remove", "usuń"], ["check", "walid"]],
  "responsiveness.md": [["responsive.mode", "device-contract", "css-media"], ["grid"], ["pattern"], ["style", "behavior"], ["overlay", "walid"]],
  "components.md": [["enabled"], ["public api"], ["wrapper"], ["token"], ["preview"], ["test", "walid"]],
  "preview.md": [["storybook", "application"], ["command", "komend"], ["component"], ["theme"], ["viewport"], ["test", "walid"]],
  "consumers.md": [["framework"], ["manifest"], ["package", "pacz"], ["public"], ["build"], ["upgrade", "migrac"]],
};

for (const reference of domainReferences) {
  const referencePath = path.join(skillRoot, "references", reference);
  if (!fs.existsSync(referencePath)) {
    block("skill.domain-reference", `references/${reference} is required`);
    continue;
  }

  const normalized = fs.readFileSync(referencePath, "utf8").toLowerCase();
  for (const alternatives of requiredTermsByReference[reference]) {
    if (!alternatives.some((term) => normalized.includes(term))) {
      block("skill.domain-reference-content", `references/${reference} must describe ${alternatives.join("/")}`);
    }
  }
}

const tokensReferencePath = path.join(skillRoot, "references", "tokens.md");
if (fs.existsSync(tokensReferencePath)) {
  const tokensText = fs.readFileSync(tokensReferencePath, "utf8");
  const normalizedTokens = normalizeSearch(tokensText);
  const projectUrl = manifest.designSource?.projectUrl;
  const variablesUrl = manifest.tokens?.sourceOfTruth?.url;

  if (!isFigmaUrl(projectUrl)) {
    block("skill.figma-project-url", "designSource.projectUrl must be a resolved Figma URL");
  }
  if (!isFigmaUrl(variablesUrl)) {
    block("skill.figma-variables-url", "tokens.sourceOfTruth.url must be a resolved Figma URL");
  }

  const containsResolvedUrls =
    typeof projectUrl === "string" &&
    typeof variablesUrl === "string" &&
    tokensText.includes(projectUrl) &&
    tokensText.includes(variablesUrl);
  const containsExactManifestPointer =
    normalizedTokens.includes("references/design-system-manifest.json") &&
    normalizedTokens.includes("designsource.projecturl") &&
    normalizedTokens.includes("tokens.sourceoftruth.url");

  if (!containsResolvedUrls && !containsExactManifestPointer) {
    block(
      "skill.tokens-figma-location",
      "references/tokens.md must contain both resolved Figma URLs or point exactly to references/design-system-manifest.json fields designSource.projectUrl and tokens.sourceOfTruth.url",
    );
  }
  if (/<[^>]*(?:url|designsource|sourceoftruth)[^>]*>/i.test(tokensText)) {
    block("skill.tokens-figma-placeholder", "references/tokens.md must not contain a Figma URL placeholder");
  }

  const parityTerms = [
    ["zgodnosc", "parity", "1:1"],
    ["collection", "kolekcj"],
    ["mode"],
    ["scope"],
    ["alias"],
    ["brakuj", "missing"],
    ["nadmiar", "extra"],
    ["rozn", "mismatch"],
  ];
  for (const alternatives of parityTerms) {
    if (!alternatives.some((term) => normalizedTokens.includes(term))) {
      block("skill.tokens-figma-parity", `references/tokens.md must describe Figma parity evidence: ${alternatives.join("/")}`);
    }
  }
}

for (const framework of ["angular", "react"]) {
  if (manifest.frameworks?.[framework]?.enabled && !fs.existsSync(path.join(skillRoot, "references", `${framework}.md`))) {
    block("skill.framework-reference", `references/${framework}.md is required`);
  }
}

const pins = manifest.designSystemSkill?.companyStandardContracts;
if (!Array.isArray(pins) || pins.length === 0) {
  block("skill.contract-pins", "designSystemSkill.companyStandardContracts must be a non-empty array");
} else {
  const pinKeys = new Set();
  const availableByKey = new Map(registry.contracts.map((item) => [`${item.id}@${item.version}`, item]));
  const currentById = new Map(registry.contracts.filter((item) => item.status === "current").map((item) => [item.id, item]));

  for (const pin of pins) {
    const key = `${pin.id}@${pin.version}`;
    if (pinKeys.has(pin.id)) block("skill.contract-pin-duplicate", `Contract is pinned more than once: ${pin.id}`);
    pinKeys.add(pin.id);
    if (!availableByKey.has(key)) block("skill.contract-pin-unknown", `Unknown company contract pin: ${key}`);
    if (!contractText.includes(key)) block("skill.contract-pin-doc", `references/design-system-contract.md must contain ${key}`);

    const current = currentById.get(pin.id);
    if (current && compareSemver(pin.version, current.version) < 0) {
      const message = `${key} is stale; current version is ${current.version}`;
      if (current.upgradePolicy === "block-on-stale") block("skill.contract-stale", message);
      else review("skill.contract-stale", message);
    }
  }

  const requiredIds = new Set([
    "repository-boundary",
    "foundation-tokens",
    "semantic-theming",
    "svg-assets-source-driven",
    "component-authoring",
    "preview-documentation",
    "consumer-integration",
    "framework-isolation",
    manifest.responsive?.mode === "device-contract" ? "responsive-device" : "responsive-media",
  ]);
  if (manifest.responsive?.grid?.enabled) requiredIds.add("grid-layout");
  for (const id of requiredIds) {
    if (!pinKeys.has(id)) block("skill.contract-pin-required", `Missing required company contract pin: ${id}`);
  }
  if (!manifest.responsive?.grid?.enabled && pinKeys.has("grid-layout")) {
    review("skill.contract-pin-unused", "grid-layout is pinned while responsive.grid.enabled is false");
  }
}

printReport(report, args.json === true);
exitForReport(report);
