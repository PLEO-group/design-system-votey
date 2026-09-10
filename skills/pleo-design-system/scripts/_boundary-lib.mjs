import fs from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([".git", ".tmp", "coverage", "dist", "node_modules", ".nx"]);
const sourceExtensions = new Set([".css", ".html", ".js", ".jsx", ".json", ".mjs", ".scss", ".svg", ".ts", ".tsx"]);

export function isInside(parent, target) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function walkFiles(root) {
  const files = [];

  function visit(directory) {
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (ignoredDirectories.has(entry.name)) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(fullPath);
      else if (sourceExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
    }
  }

  if (fs.existsSync(root)) visit(root);
  return files;
}

export function isMiniDsCandidate(filePath) {
  const normalized = filePath.replaceAll("\\", "/").toLowerCase();
  const fileName = path.basename(normalized);

  return /(^|\/)(design-system|tokens?|themes?)(\/|$)/.test(normalized)
    || /(^|\/)(shared\/ui|ui\/components)(\/|$)/.test(normalized)
    || /(base-)?tokens?\.(css|json|scss|ts)$/.test(fileName)
    || /theme(\.service)?\.(css|scss|ts)$/.test(fileName)
    || /(svg-registry|device-detector|responsive-grid)/.test(fileName)
    || /\/components\/(button|checkbox|date-picker|icon|input|loader|modal|radio-button|select|spinner|svg|table)(\/|$)/.test(normalized);
}

export function findMiniDsCandidates(projectRoot, consumerRoots, packageRoot) {
  const packageAbsolute = path.resolve(projectRoot, packageRoot);
  const result = new Set();

  for (const consumerRoot of consumerRoots) {
    const consumerAbsolute = path.resolve(projectRoot, consumerRoot);
    for (const filePath of walkFiles(consumerAbsolute)) {
      if (isInside(packageAbsolute, filePath)) continue;
      const relative = path.relative(projectRoot, filePath).replaceAll("\\", "/");
      if (isMiniDsCandidate(relative)) result.add(relative);
    }
  }

  return [...result].sort();
}

export function extractModuleSpecifiers(content) {
  const result = [];
  const pattern = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g;
  for (const match of content.matchAll(pattern)) result.push(match[1]);
  return result;
}
