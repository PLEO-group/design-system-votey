import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const outputDirectories = {
  angular: path.join(
    projectRoot,
    "dist",
    "assets",
    "angular",
    "svg-raw",
    "icons",
  ),
  react: path.join(projectRoot, "dist", "assets", "react", "icons"),
};

const target = process.argv[2];
const outputDirectory = outputDirectories[target];

if (!outputDirectory) {
  throw new Error(
    `Unknown generated icon target "${target}". Use "angular" or "react".`,
  );
}

rmSync(outputDirectory, { force: true, recursive: true });
