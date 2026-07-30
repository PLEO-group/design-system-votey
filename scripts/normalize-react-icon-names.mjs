import {
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const reactIconsDirectory = path.join(
  projectRoot,
  "dist",
  "assets",
  "react",
  "icons",
);

export function getReactIconName(fileName) {
  const componentName = path.basename(fileName, path.extname(fileName));

  return componentName.startsWith("Icon")
    ? componentName
    : `Icon${componentName}`;
}

function normalizeDirectory(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      normalizeDirectory(path.join(directory, entry.name));
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name) !== ".tsx") continue;

    const componentName = getReactIconName(entry.name);
    const targetPath = path.join(directory, `${componentName}.tsx`);
    const sourcePath = path.join(directory, entry.name);

    if (sourcePath === targetPath) continue;

    rmSync(targetPath, { force: true });
    renameSync(sourcePath, targetPath);
  }

  const componentNames = readdirSync(directory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && path.extname(entry.name).toLowerCase() === ".tsx",
    )
    .map(({ name }) => path.basename(name, path.extname(name)))
    .sort();

  if (componentNames.length === 0) return;

  const indexSource = `${componentNames
    .map(
      (componentName) =>
        `export { default as ${componentName} } from "./${componentName}";`,
    )
    .join("\n")}\n`;

  writeFileSync(path.join(directory, "index.ts"), indexSource, "utf8");
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  normalizeDirectory(reactIconsDirectory);
}
