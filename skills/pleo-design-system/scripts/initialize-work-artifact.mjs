import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { parseArgs, resolveDirectory } from "./_lib.mjs";

const modes = {
  "design-system-audit": {
    fileName: "design-system-audit.md",
    template: "design-system-audit.template.md",
  },
  "design-system-implementation": {
    fileName: "design-system-implementation.md",
    template: "design-system-implementation.template.md",
  },
  "design-system-consumer-audit": {
    fileName: "design-system-consumer-audit.md",
    template: "design-system-consumer-audit.template.md",
  },
  "design-system-introduction": {
    fileName: "design-system-introduction.md",
    template: "design-system-introduction.template.md",
  },
  "design-system-consumer-migration": {
    fileName: "design-system-consumer-migration.md",
    template: "design-system-consumer-migration.template.md",
  },
};

const legacyAliases = {
  "audit-and-complete": "design-system-audit",
  "connect-existing": "design-system-introduction",
  "consumer-audit": "design-system-consumer-audit",
  "create-new": "design-system-implementation",
};

const args = parseArgs(process.argv.slice(2));
const projectRoot = resolveDirectory(args.project, "project root");
const requestedMode = String(args.mode ?? args.scenario ?? "");
const mode = legacyAliases[requestedMode] ?? requestedMode;

if (!modes[mode]) {
  throw new Error(
    `Provide --mode with one of: ${Object.keys(modes).join(", ")}`,
  );
}

const requiredArguments = ["target-kind", "target-id", "start-commit"];
const missingArguments = requiredArguments.filter((name) => !isValue(args[name]));
if (missingArguments.length > 0) {
  throw new Error(`Missing required arguments: ${missingArguments.map((name) => `--${name}`).join(", ")}`);
}

const expectedTargetKind = mode.includes("consumer") || mode === "design-system-introduction"
  ? "consumer-application"
  : "design-system-package";
if (args["target-kind"] !== expectedTargetKind) {
  throw new Error(`Mode ${mode} requires --target-kind ${expectedTargetKind}`);
}

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const config = modes[mode];
const templatePath = path.resolve(
  scriptRoot,
  "../assets/work-artifacts",
  config.template,
);

if (args.force) {
  throw new Error("--force is not supported. Complete/cancel the active artifact or archive a terminal artifact safely.");
}

const scopeRoot = path.resolve(projectRoot, args["scope-root"] ?? ".");
if (!isWithin(projectRoot, scopeRoot)) {
  throw new Error(`scope root must stay within project root: ${scopeRoot}`);
}
const outputRoot = expectedTargetKind === "consumer-application" ? scopeRoot : projectRoot;
const outputPath = path.join(outputRoot, ".tmp", config.fileName);
const targetId = String(args["target-id"]);
if (isValue(args["source-artifact"]) && !isValue(args["run-id"])) {
  throw new Error("--source-artifact requires the source artifact's --run-id");
}
const runId = isValue(args["run-id"]) ? String(args["run-id"]) : crypto.randomUUID();
const sourceLink = resolveSourceArtifact(args, mode, runId);

if (fs.existsSync(outputPath)) {
  const existing = parseFrontmatter(fs.readFileSync(outputPath, "utf8"));
  if (!existing.runId || !existing.mode || !existing.status || !existing.targetId) {
    throw new Error(`Existing artifact has no valid machine header: ${outputPath}. Classify and migrate it before continuing.`);
  }

  const sameProcess = isValue(args["run-id"])
    && existing.runId === runId
    && existing.mode === mode
    && existing.targetKind === args["target-kind"]
    && existing.targetId === targetId
    && path.resolve(existing.scopeRoot ?? projectRoot) === scopeRoot
    && existing.startCommit === String(args["start-commit"]);
  const terminal = new Set(["completed", "incomplete", "cancelled"]);

  if (!terminal.has(existing.status)) {
    if (sameProcess) {
      process.stdout.write(`${outputPath}\n`);
      process.exitCode = 2;
      process.exit();
    }
    throw new Error(`Another active process owns ${outputPath} (runId=${existing.runId}, target=${existing.targetId}, startCommit=${existing.startCommit}, status=${existing.status}). To continue it, pass its exact --run-id and original --start-commit; otherwise complete or cancel it first.`);
  }

  const historyDirectory = path.join(outputRoot, ".tmp", "design-system-history");
  fs.mkdirSync(historyDirectory, { recursive: true });
  const archiveName = `${archiveTimestamp(existing.updatedAt ?? existing.createdAt)}-${mode}-${safeSegment(existing.runId)}.md`;
  fs.renameSync(outputPath, path.join(historyDirectory, archiveName));
}

const createdAt = new Date().toISOString();
const replacements = {
  "{{RUN_ID}}": runId,
  "{{WORK_MODE}}": mode,
  "{{TARGET_KIND}}": String(args["target-kind"]),
  "{{TARGET_ID}}": targetId,
  "{{PROJECT_ROOT}}": projectRoot,
  "{{SCOPE_ROOT}}": scopeRoot,
  "{{START_COMMIT}}": String(args["start-commit"]),
  "{{SOURCE_ARTIFACT}}": sourceLink.path,
  "{{SOURCE_STAGE}}": sourceLink.sourceStage,
  "{{APPROVAL_STAGE}}": sourceLink.approvalStage,
  "{{RELEASE_CANDIDATE}}": sourceLink.releaseCandidate,
  "{{PACKAGE_ARTIFACT}}": sourceLink.packageArtifact,
  "{{PACKAGE_ARTIFACT_SHA256}}": sourceLink.packageArtifactSha256,
  "{{MIGRATION_INVENTORY}}": sourceLink.migrationInventory,
  "{{CREATED_AT}}": createdAt,
  "{{UPDATED_AT}}": createdAt,
  "{{DISCOVERY}}": "- Oczekuje na discovery.",
};
let content = fs.readFileSync(templatePath, "utf8");
for (const [placeholder, value] of Object.entries(replacements)) content = content.replaceAll(placeholder, value);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, "utf8");
process.stdout.write(`${outputPath}\n`);

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    return field ? [[field[1], field[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
  }));
}

function archiveTimestamp(value) {
  const date = new Date(value);
  return (Number.isNaN(date.valueOf()) ? new Date() : date).toISOString().replace(/[:.]/g, "-");
}

function safeSegment(value) {
  return String(value).replace(/[^A-Za-z0-9-]/g, "-");
}

function isValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveSourceArtifact(options, workMode, runId) {
  const value = options["source-artifact"];
  if (!isValue(value)) {
    if (workMode === "design-system-consumer-migration") {
      throw new Error("design-system-consumer-migration requires --source-artifact");
    }
    return emptySourceLink();
  }
  if (!workMode.endsWith("implementation") && workMode !== "design-system-introduction" && workMode !== "design-system-consumer-migration") {
    throw new Error("--source-artifact is only valid for execution plans");
  }

  const sourcePath = path.resolve(String(value));
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    throw new Error(`Source artifact does not exist: ${sourcePath}`);
  }
  const source = parseFrontmatter(fs.readFileSync(sourcePath, "utf8"));
  if (source.runId !== runId) {
    throw new Error(`Source artifact runId ${source.runId} does not match plan runId ${runId}`);
  }

  if (workMode === "design-system-consumer-migration") {
    const sourceStage = requireValue(options, "source-stage");
    const approvalStage = requireValue(options, "approval-stage");
    const releaseCandidate = requireValue(options, "release-candidate");
    if (sourceStage !== "contract-stabilization" || approvalStage !== "consumer-migration-plan-generation") {
      throw new Error("Consumer migration requires canonical source stages: contract-stabilization and consumer-migration-plan-generation");
    }
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(releaseCandidate)) {
      throw new Error(`Invalid release candidate version: ${releaseCandidate}`);
    }
    const packageArtifact = path.resolve(requireValue(options, "package-artifact"));
    const packedPackage = readPackedPackageJson(packageArtifact);
    if (packedPackage.version !== releaseCandidate) {
      throw new Error(`Packed package version ${packedPackage.version} does not match release candidate ${releaseCandidate}`);
    }
    const packageArtifactSha256 = crypto.createHash("sha256").update(fs.readFileSync(packageArtifact)).digest("hex");
    const migrationInventory = path.resolve(requireValue(options, "inventory"));
    const inventory = readInventory(migrationInventory);
    const consumerRegistry = readConsumerRegistry(path.resolve(inventory.consumerRegistry ?? ""));
    if (source.mode !== "design-system-implementation" || !new Set(["in-progress", "completed"]).has(source.status)) {
      throw new Error(`Consumer migration must link an in-progress or completed design-system-implementation: ${sourcePath}`);
    }
    assertStageStatus(fs.readFileSync(sourcePath, "utf8"), sourceStage, "completed");
    assertStageStatus(fs.readFileSync(sourcePath, "utf8"), approvalStage, "approved");
    assertInventoryConsumer(inventory, {
      runId,
      releaseCandidate,
      packageArtifactSha256,
      packageArtifact,
      packageName: packedPackage.name,
      sourcePath,
      targetId: String(options["target-id"]),
      projectRoot,
      scopeRoot,
      outputPath,
    });
    assertInventoryMatchesRegistry(inventory, consumerRegistry, packedPackage.name);
    return { path: sourcePath, sourceStage, approvalStage, releaseCandidate, packageArtifact, packageArtifactSha256, migrationInventory };
  }

  const auditModes = new Set(["design-system-audit", "design-system-consumer-audit"]);
  if (!auditModes.has(source.mode) || source.status !== "completed") {
    throw new Error(`Source artifact must be a completed audit report: ${sourcePath}`);
  }
  return { ...emptySourceLink(), path: sourcePath };
}

function assertStageStatus(markdown, stageId, expectedStatus) {
  const escaped = stageId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`<!-- work-stage \\{"id":"${escaped}","status":"([a-z-]+)"\\} -->`));
  if (!match || match[1] !== expectedStatus) {
    throw new Error(`Source stage ${stageId} must have status ${expectedStatus}`);
  }
}

function requireValue(options, name) {
  if (!isValue(options[name])) throw new Error(`design-system-consumer-migration requires --${name}`);
  return String(options[name]);
}

function emptySourceLink() {
  return {
    path: "none",
    sourceStage: "none",
    approvalStage: "none",
    releaseCandidate: "none",
    packageArtifact: "none",
    packageArtifactSha256: "none",
    migrationInventory: "none",
  };
}

function readPackedPackageJson(artifactPath) {
  if (!artifactPath.endsWith(".tgz") || !fs.existsSync(artifactPath) || !fs.statSync(artifactPath).isFile()) {
    throw new Error(`Package artifact must be an existing local .tgz file: ${artifactPath}`);
  }
  let tar;
  try {
    tar = zlib.gunzipSync(fs.readFileSync(artifactPath));
  } catch (error) {
    throw new Error(`Package artifact is not a valid gzip archive: ${error.message}`);
  }
  for (let offset = 0; offset + 512 <= tar.length;) {
    const header = tar.subarray(offset, offset + 512);
    const name = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const size = Number.parseInt(header.subarray(124, 136).toString("ascii").replace(/\0.*$/, "").trim() || "0", 8);
    const bodyStart = offset + 512;
    if (name === "package/package.json") {
      try {
        const packageJson = JSON.parse(tar.subarray(bodyStart, bodyStart + size).toString("utf8"));
        if (!isValue(packageJson.name) || !isValue(packageJson.version)) throw new Error("missing name/version");
        return packageJson;
      } catch (error) {
        throw new Error(`Cannot read package/package.json from ${artifactPath}: ${error.message}`);
      }
    }
    offset = bodyStart + Math.ceil(size / 512) * 512;
  }
  throw new Error(`Package artifact does not contain package/package.json: ${artifactPath}`);
}

function readInventory(inventoryPath) {
  if (!fs.existsSync(inventoryPath) || !fs.statSync(inventoryPath).isFile()) {
    throw new Error(`Migration inventory does not exist: ${inventoryPath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot parse migration inventory ${inventoryPath}: ${error.message}`);
  }
}

function assertInventoryConsumer(inventory, expected) {
  if (inventory.schemaVersion !== 1 || inventory.runId !== expected.runId || inventory.releaseCandidate !== expected.releaseCandidate || inventory.packageName !== expected.packageName) {
    throw new Error("Migration inventory identity does not match the requested run/release candidate");
  }
  if (path.resolve(inventory.sourceImplementationArtifact) !== expected.sourcePath
    || path.resolve(inventory.packageArtifact) !== expected.packageArtifact
    || inventory.packageArtifactSha256 !== expected.packageArtifactSha256) {
    throw new Error("Migration inventory source plan, package artifact or checksum does not match");
  }
  const consumer = inventory.consumers?.find((entry) => entry.id === expected.targetId);
  if (!consumer) throw new Error(`Consumer ${expected.targetId} is missing from migration inventory`);
  if (!isValue(consumer.repositoryId)) throw new Error(`Consumer ${expected.targetId} has no stable repositoryId`);
  if (path.resolve(consumer.repositoryRoot) !== expected.projectRoot || path.resolve(expected.projectRoot, consumer.applicationRoot) !== expected.scopeRoot) {
    throw new Error(`Consumer ${expected.targetId} repository/application root does not match migration inventory`);
  }
  if (path.resolve(expected.scopeRoot, consumer.planPath) !== expected.outputPath) {
    throw new Error(`Consumer ${expected.targetId} planPath does not match canonical output path`);
  }
}

function readConsumerRegistry(registryPath) {
  if (!fs.existsSync(registryPath) || !fs.statSync(registryPath).isFile()) {
    throw new Error(`Canonical consumer registry does not exist: ${registryPath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(registryPath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot parse consumer registry ${registryPath}: ${error.message}`);
  }
}

function assertInventoryMatchesRegistry(inventory, registry, packageName) {
  if (registry.schemaVersion !== 1 || registry.packageName !== packageName || !Array.isArray(registry.consumers)) {
    throw new Error("Canonical consumer registry has invalid identity or consumers");
  }
  const registered = new Map(registry.consumers.map((consumer) => [consumer.id, consumer]));
  const inventoried = new Map((inventory.consumers ?? []).map((consumer) => [consumer.id, consumer]));
  if (registered.size !== registry.consumers.length || inventoried.size !== (inventory.consumers ?? []).length || registered.size !== inventoried.size) {
    throw new Error("Migration inventory does not contain exactly the canonical registered consumers");
  }
  for (const [id, consumer] of registered) {
    const entry = inventoried.get(id);
    if (!entry
      || entry.repositoryId !== consumer.repositoryId
      || path.normalize(entry.applicationRoot) !== path.normalize(consumer.applicationRoot)) {
      throw new Error(`Migration inventory does not match canonical consumer ${id}`);
    }
  }
}
