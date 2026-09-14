import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./_lib.mjs";

const transitions = {
  "design-system-audit": {
    "in-progress": ["awaiting-input", "completed", "incomplete", "cancelled"],
    "awaiting-input": ["in-progress", "cancelled"],
    "completed": [],
    "incomplete": [],
    "cancelled": [],
  },
  "design-system-consumer-audit": {
    "in-progress": ["awaiting-input", "completed", "incomplete", "cancelled"],
    "awaiting-input": ["in-progress", "cancelled"],
    "completed": [],
    "incomplete": [],
    "cancelled": [],
  },
  "design-system-implementation": executionTransitions(),
  "design-system-introduction": executionTransitions(),
  "design-system-consumer-migration": executionTransitions(),
};

const args = parseArgs(process.argv.slice(2));
if (!args.artifact || !args.status) throw new Error("Provide --artifact and --status");
const artifactPath = path.resolve(String(args.artifact));
if (!fs.existsSync(artifactPath)) throw new Error(`Artifact does not exist: ${artifactPath}`);

const markdown = fs.readFileSync(artifactPath, "utf8");
const frontmatter = parseFrontmatter(markdown);
const allowed = transitions[frontmatter.mode]?.[frontmatter.status];
if (!allowed) throw new Error(`Unknown mode/status: ${frontmatter.mode}/${frontmatter.status}`);
if (!allowed.includes(String(args.status))) {
  throw new Error(`Invalid status transition: ${frontmatter.status} -> ${args.status}. Allowed: ${allowed.join(", ") || "none"}`);
}

if (String(args.status) === "completed" && frontmatter.mode.startsWith("design-system-") && !frontmatter.mode.endsWith("audit")) {
  assertExecutionPlanCanComplete(markdown, frontmatter, artifactPath, args);
}

const now = new Date().toISOString();
const updated = markdown
  .replace(/^status:\s*['"]?[^'"\r\n]+['"]?\s*$/m, `status: "${args.status}"`)
  .replace(/^updatedAt:\s*['"]?[^'"\r\n]+['"]?\s*$/m, `updatedAt: "${now}"`);
fs.writeFileSync(artifactPath, updated, "utf8");
process.stdout.write(`${artifactPath}\n`);

function executionTransitions() {
  return {
    "draft": ["awaiting-approval", "cancelled"],
    "awaiting-approval": ["approved", "draft", "cancelled"],
    "approved": ["in-progress", "cancelled"],
    "in-progress": ["awaiting-approval", "completed", "cancelled"],
    "completed": [],
    "cancelled": [],
  };
}

function parseFrontmatter(value) {
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("Artifact has no machine frontmatter");
  return Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    return field ? [[field[1], field[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
  }));
}

function assertExecutionPlanCanComplete(markdown, frontmatter, artifactPath, options) {
  const stages = [...markdown.matchAll(/<!-- work-stage \{"id":"([^"]+)","status":"([a-z-]+)"\} -->/g)];
  if (stages.length === 0) throw new Error("Execution plan has no machine stage markers");
  const unfinished = stages.filter(([, , status]) => !new Set(["completed", "skipped"]).has(status));
  if (unfinished.length > 0) {
    throw new Error(`Cannot complete plan with unfinished stages: ${unfinished.map(([, id, status]) => `${id}=${status}`).join(", ")}`);
  }

  let inventoryPath;
  if (frontmatter.mode === "design-system-implementation") {
    const migrationStage = stages.find(([, id]) => id === "consumer-migration-plan-generation");
    if (migrationStage?.[2] === "completed") {
      if (!options.inventory) throw new Error("Completing implementation with generated consumer migration plans requires --inventory");
      inventoryPath = path.resolve(String(options.inventory));
      const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
      if (path.resolve(inventory.sourceImplementationArtifact ?? "") !== artifactPath) {
        throw new Error("Migration inventory does not belong to this implementation plan");
      }
    }
  } else if (frontmatter.mode === "design-system-consumer-migration") {
    if (!frontmatter.migrationInventory || frontmatter.migrationInventory === "none") {
      throw new Error("Consumer migration plan has no migrationInventory link");
    }
    inventoryPath = path.resolve(frontmatter.migrationInventory);
  }

  if (inventoryPath) {
    const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
    execFileSync(process.execPath, [
      path.join(scriptRoot, "validate-consumer-migration-plans.mjs"),
      "--inventory",
      inventoryPath,
    ], { stdio: "inherit" });
  }
}
