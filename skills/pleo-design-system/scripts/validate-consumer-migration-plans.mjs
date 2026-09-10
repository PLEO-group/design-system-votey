import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { parseArgs } from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.inventory) throw new Error("Provide --inventory");
const inventoryPath = path.resolve(String(args.inventory));
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const findings = [];

if (inventory.schemaVersion !== 1 || !inventory.runId || !inventory.packageName || !inventory.releaseCandidate || !inventory.sourceImplementationArtifact || !inventory.packageArtifact || !inventory.packageArtifactSha256 || !inventory.consumerRegistry) {
  findings.push("Inventory identity is incomplete");
}
if (!Array.isArray(inventory.consumers) || inventory.consumers.length === 0) {
  findings.push("Inventory must contain at least one consumer");
}

validateCanonicalRegistry(inventory, findings);

const ids = new Set();
for (const consumer of inventory.consumers ?? []) {
  if (!consumer.id || ids.has(consumer.id)) findings.push(`Duplicate or missing consumer id: ${consumer.id ?? "<missing>"}`);
  ids.add(consumer.id);
  if (!consumer.repositoryId || !consumer.repositoryRoot || !consumer.applicationRoot || !consumer.planPath) {
    findings.push(`${consumer.id ?? "<missing>"}: repositoryId, repositoryRoot, applicationRoot and planPath are required`);
    continue;
  }
  const repositoryRoot = path.resolve(consumer.repositoryRoot);
  const applicationRoot = path.resolve(repositoryRoot, consumer.applicationRoot);
  if (!isWithin(repositoryRoot, applicationRoot)) {
    findings.push(`${consumer.id}: applicationRoot escapes repositoryRoot`);
    continue;
  }
  const planPath = path.resolve(applicationRoot, consumer.planPath);
  if (!isWithin(applicationRoot, planPath)) {
    findings.push(`${consumer.id}: planPath escapes applicationRoot`);
    continue;
  }
  if (!fs.existsSync(planPath)) {
    findings.push(`Missing migration plan for ${consumer.id}: ${planPath}`);
    continue;
  }
  const frontmatter = parseFrontmatter(fs.readFileSync(planPath, "utf8"));
  const expected = {
    mode: "design-system-consumer-migration",
    runId: inventory.runId,
    targetId: consumer.id,
    releaseCandidate: inventory.releaseCandidate,
    packageArtifactSha256: inventory.packageArtifactSha256,
    sourceArtifact: path.resolve(inventory.sourceImplementationArtifact),
    migrationInventory: inventoryPath,
  };
  for (const [field, value] of Object.entries(expected)) {
    const actual = field === "sourceArtifact" || field === "migrationInventory" ? path.resolve(frontmatter[field] ?? "") : frontmatter[field];
    if (actual !== value) findings.push(`${consumer.id}: ${field} mismatch`);
  }
}

const packageArtifact = path.resolve(inventory.packageArtifact ?? "");
try {
  const packedPackage = readPackedPackageJson(packageArtifact);
  if (packedPackage.name !== inventory.packageName) findings.push("Packed package name does not match inventory");
  if (packedPackage.version !== inventory.releaseCandidate) findings.push("Packed package version does not match release candidate");
  const checksum = crypto.createHash("sha256").update(fs.readFileSync(packageArtifact)).digest("hex");
  if (checksum !== inventory.packageArtifactSha256) findings.push("Package artifact checksum mismatch");
} catch (error) {
  findings.push(error.message);
}

const expectedStageStatus = String(args["expected-stage-status"] ?? "completed");
const implementationPath = path.resolve(inventory.sourceImplementationArtifact ?? "");
if (!fs.existsSync(implementationPath) || !fs.statSync(implementationPath).isFile()) {
  findings.push(`Source implementation artifact does not exist: ${implementationPath}`);
} else {
  const implementation = fs.readFileSync(implementationPath, "utf8");
  if (!implementation.includes(`<!-- work-stage {"id":"consumer-migration-plan-generation","status":"${expectedStageStatus}"} -->`)) {
    findings.push(`Source implementation stage consumer-migration-plan-generation is not ${expectedStageStatus}`);
  }
}

if (findings.length > 0) {
  for (const finding of findings) process.stderr.write(`[BLOCK] ${finding}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Consumer migration plans: PASS (${inventory.consumers.length})\n`);
}

function parseFrontmatter(value) {
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    return field ? [[field[1], field[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
  }));
}

function readPackedPackageJson(artifactPath) {
  if (!artifactPath.endsWith(".tgz") || !fs.existsSync(artifactPath) || !fs.statSync(artifactPath).isFile()) {
    throw new Error(`Package artifact is not an existing local .tgz: ${artifactPath}`);
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
    if (name === "package/package.json") return JSON.parse(tar.subarray(bodyStart, bodyStart + size).toString("utf8"));
    offset = bodyStart + Math.ceil(size / 512) * 512;
  }
  throw new Error(`Package artifact does not contain package/package.json: ${artifactPath}`);
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function validateCanonicalRegistry(value, output) {
  const registryPath = path.resolve(value.consumerRegistry ?? "");
  if (!fs.existsSync(registryPath) || !fs.statSync(registryPath).isFile()) {
    output.push(`Canonical consumer registry does not exist: ${registryPath}`);
    return;
  }
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  } catch (error) {
    output.push(`Cannot parse canonical consumer registry: ${error.message}`);
    return;
  }
  if (registry.schemaVersion !== 1 || registry.packageName !== value.packageName || !Array.isArray(registry.consumers)) {
    output.push("Canonical consumer registry has invalid identity or consumers");
    return;
  }
  const registered = new Map(registry.consumers.map((consumer) => [consumer.id, consumer]));
  const inventoried = new Map((value.consumers ?? []).map((consumer) => [consumer.id, consumer]));
  if (registered.size !== registry.consumers.length || inventoried.size !== (value.consumers ?? []).length || registered.size !== inventoried.size) {
    output.push("Migration inventory does not contain exactly the canonical registered consumers");
    return;
  }
  for (const [id, consumer] of registered) {
    const entry = inventoried.get(id);
    if (!entry
      || entry.repositoryId !== consumer.repositoryId
      || path.normalize(entry.applicationRoot) !== path.normalize(consumer.applicationRoot)) {
      output.push(`Migration inventory does not match canonical consumer ${id}`);
    }
  }
}
