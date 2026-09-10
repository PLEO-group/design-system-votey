import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  addFinding,
  createReport,
  exitForReport,
  isNonEmptyString,
  parseArgs,
  printReport,
  readJson,
} from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const registryPath = args.registry
  ? path.resolve(args.registry)
  : path.resolve(scriptRoot, "../references/design-system-skill-registry.json");
const registry = readJson(registryPath);
const report = createReport(`Design system skill registry: ${registryPath}`);
const block = (code, message) => addFinding(report, "BLOCK", code, message);

if (registry.schemaVersion !== 1) block("registry.schema-version", "schemaVersion must equal 1");
if (!Array.isArray(registry.designSystems)) {
  block("registry.entries", "designSystems must be an array");
} else {
  const packages = new Set();
  const aliases = new Set();

  registry.designSystems.forEach((entry, index) => {
    const prefix = `designSystems[${index}]`;
    if (!isNonEmptyString(entry.package)) block("registry.package", `${prefix}.package is required`);
    if (!/^[a-z0-9-]+$/.test(entry.skill ?? "")) block("registry.skill", `${prefix}.skill must use lowercase hyphen-case`);
    if (!Array.isArray(entry.frameworks) || entry.frameworks.length === 0
      || entry.frameworks.some((item) => !["angular", "react"].includes(item))) {
      block("registry.frameworks", `${prefix}.frameworks must contain angular and/or react`);
    }
    if (!Array.isArray(entry.aliases) || entry.aliases.some((item) => !isNonEmptyString(item))) {
      block("registry.aliases", `${prefix}.aliases must be a string array`);
    }
    if (!["active", "deprecated", "planned"].includes(entry.status)) block("registry.status", `${prefix}.status is invalid`);
    if (entry.distribution !== "SHARED") block("registry.distribution", `${prefix}.distribution must equal SHARED`);

    if (packages.has(entry.package)) block("registry.duplicate-package", `Duplicate package: ${entry.package}`);
    packages.add(entry.package);
    for (const alias of entry.aliases ?? []) {
      if (aliases.has(alias) || packages.has(alias)) block("registry.duplicate-alias", `Duplicate package alias: ${alias}`);
      aliases.add(alias);
    }
  });
}

printReport(report, args.json === true);
exitForReport(report);
