import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findMiniDsCandidates } from "./_boundary-lib.mjs";
import { findFiles, parseArgs, readJson, resolveDirectory } from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
const projectRoot = resolveDirectory(args.project, "project root");
const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const registryPath = args.registry
  ? path.resolve(args.registry)
  : path.resolve(scriptRoot, "../references/design-system-skill-registry.json");

const skippedPaths = [];
const packageFiles = findFiles(projectRoot, "package.json", Number(args.depth ?? 3), (directory, error) => {
  skippedPaths.push({
    path: path.relative(projectRoot, directory) || ".",
    reason: error.code ?? error.message,
  });
});
const manifestDepth = Number(args.depth ?? 3) + 1;
const designSystemManifestFiles = findFiles(projectRoot, "design-system.manifest.json", manifestDepth);
const consumerManifestFiles = findFiles(projectRoot, "design-system-consumer.manifest.json", manifestDepth);
const packages = packageFiles.map((filePath) => {
  const packageJson = readJson(filePath);
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
    ...(packageJson.peerDependencies ?? {}),
  };
  return {
    path: path.relative(projectRoot, filePath) || "package.json",
    name: packageJson.name ?? null,
    version: packageJson.version ?? null,
    dependencies,
  };
});

const dependencyNames = new Set(packages.flatMap((item) => Object.keys(item.dependencies)));
const registry = fs.existsSync(registryPath) ? readJson(registryPath) : { designSystems: [] };
const knownPackages = new Map(
  (registry.designSystems ?? []).flatMap((entry) => [entry.package, ...(entry.aliases ?? [])].map((name) => [name, entry])),
);

const designSystems = [...dependencyNames]
  .filter((name) => knownPackages.has(name) || name.includes("design-system"))
  .map((name) => ({
    package: name,
    version: packages.find((item) => item.dependencies[name])?.dependencies[name] ?? null,
    registeredSkill: knownPackages.get(name)?.skill ?? null,
  }));

const colocatedDesignSystemPackages = packages
  .filter((item) => item.path !== "package.json" && item.name?.includes("design-system"))
  .map((item) => ({ name: item.name, path: item.path }));

const likelyConsumerRoots = ["src", "app", "apps"]
  .filter((name) => fs.existsSync(path.join(projectRoot, name)));
const miniDesignSystemCandidates = findMiniDsCandidates(
  projectRoot,
  likelyConsumerRoots,
  "__no_discovered_package__",
);

const frameworks = [];
if (dependencyNames.has("@angular/core")) frameworks.push("angular");
if (dependencyNames.has("react") || dependencyNames.has("next")) frameworks.push("react");

const lockfiles = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"]
  .filter((name) => fs.existsSync(path.join(projectRoot, name)));

const ci = [];
if (fs.existsSync(path.join(projectRoot, ".github/workflows"))) ci.push("github-actions");
if (fs.existsSync(path.join(projectRoot, ".gitlab-ci.yml"))) ci.push("gitlab-ci");
if (fs.existsSync(path.join(projectRoot, "bitbucket-pipelines.yml"))) ci.push("bitbucket-pipelines");

const result = {
  projectRoot,
  packageManagerEvidence: lockfiles,
  frameworks,
  ci,
  designSystems,
  repositoryTopologyEvidence: {
    colocatedDesignSystemPackages,
    embeddedMiniDesignSystem: {
      detected: miniDesignSystemCandidates.length > 0,
      candidateCount: miniDesignSystemCandidates.length,
      sample: miniDesignSystemCandidates.slice(0, 20),
    },
  },
  manifests: {
    designSystem: designSystemManifestFiles.length > 0,
    consumer: consumerManifestFiles.length > 0,
    designSystemPaths: designSystemManifestFiles.map((filePath) => path.relative(projectRoot, filePath) || "design-system.manifest.json"),
    consumerPaths: consumerManifestFiles.map((filePath) => path.relative(projectRoot, filePath) || "design-system-consumer.manifest.json"),
  },
  skippedPaths,
  packages: packages.map(({ dependencies, ...item }) => ({
    ...item,
    dependencyCount: Object.keys(dependencies).length,
  })),
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
