import path from "node:path";
import {
  addFinding,
  createReport,
  exitForReport,
  isNonEmptyString,
  parseArgs,
  printReport,
  readJson,
  resolveDirectory,
} from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.manifest) throw new Error("Provide --manifest <design-system-consumer.manifest.json>");

const manifestPath = path.resolve(args.manifest);
const manifest = readJson(manifestPath);
const report = createReport(`Design system consumer manifest: ${manifestPath}`);
const block = (code, message, details) => addFinding(report, "BLOCK", code, message, details);
const warn = (code, message, details) => addFinding(report, "WARN", code, message, details);

if (args.project) {
  const projectRoot = resolveDirectory(args.project, "project root");
  const expectedManifestPath = path.join(
    projectRoot,
    manifest.application?.root ?? ".",
    "design-system-consumer.manifest.json",
  );
  if (manifestPath !== expectedManifestPath) {
    block(
      "manifest.location",
      "The consumer manifest must be named design-system-consumer.manifest.json and live in the application root",
      { actual: manifestPath, expected: expectedManifestPath },
    );
  }
}

if (manifest.schemaVersion !== 1) block("manifest.schema-version", "schemaVersion must equal 1");
if (manifest.kind !== "pleo-design-system-consumer") block("manifest.kind", "kind must equal pleo-design-system-consumer");
if (!isNonEmptyString(manifest.application?.name)) block("application.name", "application.name is required");
if (!["angular", "react"].includes(manifest.application?.framework)) block("application.framework", "framework must be angular or react");
if (!isNonEmptyString(manifest.application?.root)) block("application.root", "application.root is required");
if (!isNonEmptyString(manifest.designSystem?.packageName)) block("design-system.package", "packageName is required");
if (!isNonEmptyString(manifest.designSystem?.versionRange)) block("design-system.version", "versionRange is required");
if (!isNonEmptyString(manifest.designSystem?.entryPoint)) block("design-system.entry-point", "entryPoint is required");
if (!["workspace", "registry"].includes(manifest.designSystem?.integrationMode)) {
  block("design-system.integration-mode", "integrationMode must be workspace or registry");
}

const expectedEntryPoint = `./${manifest.application?.framework}`;
if (manifest.designSystem?.entryPoint !== expectedEntryPoint) {
  warn("design-system.entry-point-default", `Expected ${expectedEntryPoint} for the selected framework`);
}

if (!Array.isArray(manifest.tokens?.styles) || manifest.tokens.styles.length === 0) {
  block("tokens.styles", "At least one token stylesheet is required");
}

if (!Array.isArray(manifest.assets?.copy)) block("assets.copy", "assets.copy must be an array");
if (manifest.application?.framework === "angular" && manifest.assets?.svgRegistry === true && manifest.assets.copy.length === 0) {
  block("assets.angular-copy", "Angular SVG registry requires an asset copy rule");
}

if (!Array.isArray(manifest.runtime?.providers)) block("runtime.providers", "runtime.providers must be an array");
if (!Array.isArray(manifest.exceptions)) block("exceptions.type", "exceptions must be an array");

printReport(report, args.json === true);
exitForReport(report);

