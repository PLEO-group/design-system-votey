import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./_lib.mjs";

const transitions = {
  pending: ["awaiting-approval", "skipped"],
  "awaiting-approval": ["approved", "pending", "skipped"],
  approved: ["in-progress"],
  "in-progress": ["completed", "blocked"],
  blocked: ["awaiting-approval", "skipped"],
  completed: [],
  skipped: [],
};

const args = parseArgs(process.argv.slice(2));
if (!args.artifact || !args.stage || !args.status) {
  throw new Error("Provide --artifact, --stage and --status");
}

const artifactPath = path.resolve(String(args.artifact));
if (!fs.existsSync(artifactPath)) throw new Error(`Artifact does not exist: ${artifactPath}`);
const markdown = fs.readFileSync(artifactPath, "utf8");
const frontmatter = parseFrontmatter(markdown);
const executionModes = new Set(["design-system-implementation", "design-system-introduction", "design-system-consumer-migration"]);
if (!executionModes.has(frontmatter.mode) || frontmatter.status !== "in-progress") {
  throw new Error(`Stage transitions require an in-progress execution plan, got ${frontmatter.mode}/${frontmatter.status}`);
}
const escapedStage = escapeRegExp(String(args.stage));
const marker = new RegExp(`<!-- work-stage \\{"id":"${escapedStage}","status":"([a-z-]+)"\\} -->`);
const match = markdown.match(marker);
if (!match) throw new Error(`Stage marker not found: ${args.stage}`);

const currentStatus = match[1];
const nextStatus = String(args.status);
if (!transitions[currentStatus]?.includes(nextStatus)) {
  throw new Error(`Invalid stage transition: ${currentStatus} -> ${nextStatus}. Allowed: ${transitions[currentStatus]?.join(", ") || "none"}`);
}

if (frontmatter.mode === "design-system-implementation"
  && args.stage === "consumer-migration-plan-generation"
  && nextStatus === "completed") {
  if (!args.inventory) throw new Error("Completing consumer-migration-plan-generation requires --inventory");
  const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
  execFileSync(process.execPath, [
    path.join(scriptRoot, "validate-consumer-migration-plans.mjs"),
    "--inventory",
    path.resolve(String(args.inventory)),
    "--expected-stage-status",
    currentStatus,
  ], { stdio: "inherit" });
}

const updated = markdown
  .replace(marker, `<!-- work-stage {"id":"${args.stage}","status":"${nextStatus}"} -->`)
  .replace(/^updatedAt:\s*['"]?[^'"\r\n]+['"]?\s*$/m, `updatedAt: "${new Date().toISOString()}"`);
fs.writeFileSync(artifactPath, updated, "utf8");
process.stdout.write(`${artifactPath}\n`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseFrontmatter(value) {
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("Artifact has no machine frontmatter");
  return Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    return field ? [[field[1], field[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
  }));
}
