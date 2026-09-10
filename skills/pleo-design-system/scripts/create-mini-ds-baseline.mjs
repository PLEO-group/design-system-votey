import fs from "node:fs";
import path from "node:path";
import { findMiniDsCandidates } from "./_boundary-lib.mjs";
import { parseArgs, readJson, resolveDirectory, writeJson } from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.manifest) throw new Error("Provide --manifest <design-system.manifest.json>");

const projectRoot = resolveDirectory(args.project, "project root");
const manifest = readJson(path.resolve(args.manifest));
const repository = manifest.repository ?? {};
const miniDs = repository.boundaryPolicy?.localMiniDs ?? {};

if (repository.topology !== "colocated-workspace-package") {
  throw new Error("A mini-DS baseline is only valid for colocated-workspace-package");
}
if (miniDs.mode !== "migration-baseline" || typeof miniDs.baselineFile !== "string") {
  throw new Error("Set localMiniDs.mode to migration-baseline and provide baselineFile first");
}

const outputPath = path.resolve(projectRoot, miniDs.baselineFile);
if (fs.existsSync(outputPath) && !args.force) {
  process.stdout.write(`${outputPath}\n`);
  process.exitCode = 2;
} else {
  const files = findMiniDsCandidates(projectRoot, repository.consumerRoots ?? [], repository.packageRoot);
  writeJson(outputPath, {
    schemaVersion: 1,
    kind: "pleo-mini-ds-baseline",
    generatedAt: new Date().toISOString(),
    files,
  });
  process.stdout.write(`${outputPath}\n`);
}
