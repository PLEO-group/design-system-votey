// Remove stale build artifacts so every full build recreates dist from current sources.
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDirectory = path.join(projectRoot, "dist");

rmSync(distDirectory, { force: true, recursive: true });
