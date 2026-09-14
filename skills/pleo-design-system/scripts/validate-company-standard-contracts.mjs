import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  addFinding,
  createReport,
  exitForReport,
  parseArgs,
  printReport,
  readJson,
} from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const registryPath = path.resolve(args.registry ?? path.join(scriptRoot, "..", "references", "company-standard-contracts.json"));
const registry = readJson(registryPath);
const report = createReport(`Company standard contracts: ${registryPath}`);
const block = (code, message) => addFinding(report, "BLOCK", code, message);

if (registry.schemaVersion !== 1) block("contracts.schema-version", "schemaVersion must equal 1");
if (!Array.isArray(registry.contracts) || registry.contracts.length === 0) {
  block("contracts.empty", "contracts must be a non-empty array");
} else {
  const keys = new Set();
  const currentById = new Map();
  const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const semverPattern = /^\d+\.\d+\.\d+$/;
  const referencesRoot = path.dirname(registryPath);

  for (const contract of registry.contracts) {
    if (!idPattern.test(contract.id ?? "")) block("contracts.id", `Invalid contract id: ${contract.id ?? "<missing>"}`);
    if (!semverPattern.test(contract.version ?? "")) block("contracts.version", `Invalid SemVer for ${contract.id ?? "<missing>"}`);
    const key = `${contract.id}@${contract.version}`;
    if (keys.has(key)) block("contracts.duplicate", `Duplicate contract version: ${key}`);
    keys.add(key);
    if (!["current", "superseded"].includes(contract.status)) block("contracts.status", `Invalid status for ${key}`);
    if (!["review-on-stale", "block-on-stale"].includes(contract.upgradePolicy)) block("contracts.upgrade-policy", `Invalid upgradePolicy for ${key}`);
    if (contract.status === "current") {
      if (currentById.has(contract.id)) block("contracts.multiple-current", `More than one current version for ${contract.id}`);
      currentById.set(contract.id, contract.version);
    }
    if (typeof contract.summary !== "string" || contract.summary.trim() === "") block("contracts.summary", `Missing summary for ${key}`);
    if (typeof contract.reference !== "string" || contract.reference.includes("/") || contract.reference.includes("\\")) {
      block("contracts.reference", `Reference for ${key} must be a flat file in references/`);
    } else if (!fs.existsSync(path.join(referencesRoot, contract.reference))) {
      block("contracts.reference-missing", `Reference does not exist for ${key}: ${contract.reference}`);
    }
  }
}

printReport(report, args.json === true);
exitForReport(report);
