import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, readJson } from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.package) throw new Error("Provide --package <npm-package-name>");

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const registryPath = args.registry
  ? path.resolve(args.registry)
  : path.resolve(scriptRoot, "../references/design-system-skill-registry.json");
const registry = readJson(registryPath);
if (registry.schemaVersion !== 1 || !Array.isArray(registry.designSystems)) {
  throw new Error(`Invalid design system skill registry: ${registryPath}`);
}
const target = String(args.package);
const entry = (registry.designSystems ?? []).find(
  (candidate) => candidate.package === target || (candidate.aliases ?? []).includes(target),
);

if (!entry) {
  process.stdout.write(`${JSON.stringify({ package: target, found: false }, null, 2)}\n`);
  process.exitCode = 2;
} else {
  process.stdout.write(`${JSON.stringify({ package: target, found: true, usable: entry.status === "active", ...entry }, null, 2)}\n`);
  if (entry.status !== "active") process.exitCode = 3;
}
