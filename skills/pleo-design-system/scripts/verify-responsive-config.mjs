import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  addFinding,
  createReport,
  exitForReport,
  parseArgs,
  printReport,
  readJson,
  resolveDirectory,
} from "./_lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.manifest) throw new Error("Provide --manifest <design-system.manifest.json>");

const projectRoot = resolveDirectory(args.project, "project root");
const manifestPath = path.resolve(args.manifest);
const manifest = readJson(manifestPath);
const packageRoot = path.resolve(projectRoot, manifest.repository?.packageRoot ?? ".");
const configuredOutput = manifest.responsive?.generatedConfigScssPath;
const buildTokens = manifest.commands?.buildTokens;
const report = createReport(`Responsive config determinism: ${manifestPath}`);
const block = (code, message, details) => addFinding(report, "BLOCK", code, message, details);

if (typeof configuredOutput !== "string" || configuredOutput.length === 0) {
  block("responsive.output-path", "responsive.generatedConfigScssPath must be configured");
}
if (typeof buildTokens !== "string" || buildTokens.length === 0) {
  block("responsive.build-command", "commands.buildTokens must be configured");
}

function runBuildTokens(pass) {
  const result = spawnSync(buildTokens, {
    cwd: packageRoot,
    shell: true,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.error) {
    block("responsive.build-command", `Token generation pass ${pass} could not start`, result.error.message);
    return false;
  }
  if (result.status !== 0) {
    block("responsive.build-command", `Token generation pass ${pass} failed with exit code ${result.status}`);
    return false;
  }
  return true;
}

function isGitTracked(filePath) {
  const relativePath = path.relative(projectRoot, filePath);
  const result = spawnSync("git", ["-C", projectRoot, "ls-files", "--error-unmatch", "--", relativePath], {
    encoding: "utf8",
    windowsHide: true,
  });
  return result.status === 0;
}

if (report.findings.length === 0) {
  const outputPath = path.resolve(packageRoot, configuredOutput);
  const relativeOutput = path.relative(packageRoot, outputPath);
  if (relativeOutput.startsWith("..") || path.isAbsolute(relativeOutput)) {
    block("responsive.output-path", "responsive.generatedConfigScssPath escapes packageRoot", configuredOutput);
  } else {
    const original = fs.existsSync(outputPath) ? fs.readFileSync(outputPath) : null;
    if (runBuildTokens(1)) {
      if (!fs.existsSync(outputPath)) {
        block("responsive.output-missing", "commands.buildTokens did not create responsive.generatedConfigScssPath", configuredOutput);
      } else {
        const firstBuild = fs.readFileSync(outputPath);
        const tracksGeneratedOutput = ["tracked-intermediate", "tracked-dist"].includes(manifest.artifacts?.policy);

        if (manifest.artifacts?.policy === "build-only" && isGitTracked(outputPath)) {
          block(
            "responsive.output-tracked",
            "build-only requires the generated responsive config to be ignored by Git",
            configuredOutput,
          );
        }

        if (tracksGeneratedOutput && original === null) {
          block(
            "responsive.output-untracked",
            "Tracked artifact policy requires the generated responsive config to exist before verification",
            configuredOutput,
          );
        } else if (tracksGeneratedOutput && !original.equals(firstBuild)) {
          block(
            "responsive.output-stale",
            "Generated responsive config was stale; commit the result of commands.buildTokens",
            configuredOutput,
          );
        }

        if (runBuildTokens(2)) {
          const secondBuild = fs.existsSync(outputPath) ? fs.readFileSync(outputPath) : null;
          if (secondBuild === null || !firstBuild.equals(secondBuild)) {
            block(
              "responsive.output-nondeterministic",
              "Two consecutive token builds produced different responsive config output",
              configuredOutput,
            );
          }
        }
      }
    }
  }
}

printReport(report, args.json === true);
exitForReport(report);
