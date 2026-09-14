import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = parseArgs(process.argv.slice(2));
const configPath = path.resolve(args.config ?? "svg-assets.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const projectRoot = path.resolve(path.dirname(configPath), config.projectRoot ?? ".");
const sourceRoot = path.resolve(projectRoot, config.sourceRoot);
const typePrefix = config.typePrefix ?? "DesignSystem";
if (!/^[A-Z][A-Za-z0-9]*$/.test(typePrefix)) {
  throw new Error("typePrefix must be a PascalCase TypeScript identifier.");
}

const entries = collectEntries();
if (config.react?.enabled) validateReactComponents(entries);
const typesSource = renderTypes(entries);
const typesOutput = path.resolve(projectRoot, config.typescriptOutput);
const reactSource = config.react?.enabled ? renderReactBarrel(entries) : null;
const reactOutput = config.react?.enabled
  ? path.resolve(projectRoot, config.react.barrelOutput)
  : null;

if (args.check) {
  assertCurrent(typesOutput, typesSource);
  if (reactOutput) assertCurrent(reactOutput, reactSource);
  process.stdout.write(`OK: ${entries.length} SVG assets are valid and generated outputs are current.\n`);
} else {
  writeGenerated(typesOutput, typesSource);
  if (reactOutput) writeGenerated(reactOutput, reactSource);
  process.stdout.write(`Generated contracts for ${entries.length} SVG assets.\n`);
}

function collectEntries() {
  const result = [];
  const publicNames = new Map();
  const reactNames = new Map();
  const contentHashes = new Map();

  for (const group of config.groups ?? []) {
    if (!["icon", "illustration"].includes(group.kind)) throw new Error(`Unknown SVG kind: ${group.kind}`);
    for (const field of ["sourceDir", "filePrefix", "namespace", "reactPrefix", "reactSubdir"]) {
      if (typeof group[field] !== "string") throw new Error(`SVG group requires string ${field}`);
    }
    const directory = path.resolve(sourceRoot, group.sourceDir);
    if (!fs.existsSync(directory)) throw new Error(`Missing SVG source directory: ${directory}`);

    for (const filePath of findSvgFiles(directory)) {
      const entry = createEntry(group, filePath);
      assertUnique(publicNames, entry.publicName, filePath, "public SVG name");
      assertUnique(reactNames, entry.reactName, filePath, "React export");

      const svg = fs.readFileSync(filePath, "utf8");
      validateSvg(svg, filePath);
      const hash = crypto.createHash("sha256").update(svg.trim()).digest("hex");
      assertUnique(contentHashes, hash, filePath, "identical SVG content");
      result.push(entry);
    }
  }

  return result.sort((left, right) => left.publicName.localeCompare(right.publicName));
}

function createEntry(group, filePath) {
  const fileName = path.basename(filePath);
  const stem = path.basename(filePath, ".svg");
  if (fileName !== fileName.toLowerCase()) throw new Error(`SVG name must be lowercase: ${filePath}`);
  if (!stem.startsWith(group.filePrefix)) {
    throw new Error(`SVG does not match prefix "${group.filePrefix}" for ${group.sourceDir}: ${filePath}`);
  }
  if (!/^[a-z0-9]+(?:[a-z0-9_-]*[a-z0-9])?$/.test(stem) || /--|__|-_|_-/.test(stem)) {
    throw new Error(`SVG name contains invalid or repeated separators: ${filePath}`);
  }

  const semanticPart = stem.slice(group.filePrefix.length);
  if (!semanticPart) throw new Error(`SVG descriptor is empty: ${filePath}`);
  validateVocabulary(semanticPart, filePath);

  const normalized = semanticPart.replaceAll("_", "-").replace(/-+/g, "-");
  const publicName = `${group.namespace}-${normalized}`;
  const generatedBase = toPascalCase(stem);
  const reactName = generatedBase.startsWith(group.reactPrefix)
    ? generatedBase
    : `${group.reactPrefix}${generatedBase}`;

  return {
    kind: group.kind,
    publicName,
    reactName,
    reactSubdir: group.reactSubdir,
    relativePath: path.relative(sourceRoot, filePath).replaceAll("\\", "/"),
  };
}

function validateVocabulary(semanticPart, filePath) {
  const allowed = new Set([...(config.allowedTerms ?? []), ...(config.allowedModifiers ?? [])]);
  if (allowed.size === 0) throw new Error("Configure allowedTerms to enable deterministic typo validation.");

  const unknown = semanticPart
    .split(/[-_]+/)
    .filter((term) => term && !/^v[0-9]+$/.test(term) && !allowed.has(term));
  if (unknown.length === 0) return;

  const messages = unknown.map((term) => {
    const suggestion = [...allowed]
      .map((candidate) => ({ candidate, distance: levenshtein(term, candidate) }))
      .sort((left, right) => left.distance - right.distance)[0];
    return suggestion?.distance <= 2 ? `${term} (did you mean: ${suggestion.candidate}?)` : term;
  });
  throw new Error(`Unknown or misspelled SVG term in ${filePath}: ${messages.join(", ")}`);
}

function validateSvg(svg, filePath) {
  if ((svg.match(/<svg\b/gi) ?? []).length !== 1 || !/<\/svg>\s*$/i.test(svg.trim())) {
    throw new Error(`SVG must contain exactly one root <svg>: ${filePath}`);
  }
  if (!/<svg\b[^>]*\bviewBox\s*=/.test(svg)) throw new Error(`SVG requires viewBox: ${filePath}`);
  if (/<script\b|<foreignObject\b|\son[a-z]+\s*=|javascript:/i.test(svg)) {
    throw new Error(`SVG contains active content: ${filePath}`);
  }
  if (/(?:href|xlink:href)\s*=\s*["'](?:https?:)?\/\//i.test(svg) || /url\(\s*["']?(?:https?:)?\/\//i.test(svg)) {
    throw new Error(`SVG contains an external URL: ${filePath}`);
  }

  const ids = [...svg.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`SVG contains duplicate id values: ${filePath}`);
  for (const reference of svg.matchAll(/(?:url\(\s*#|href\s*=\s*["']#)([^)'"\s]+)/g)) {
    if (!ids.includes(reference[1])) throw new Error(`SVG references missing id "${reference[1]}": ${filePath}`);
  }
}

function renderTypes(allEntries) {
  const icons = allEntries.filter((entry) => entry.kind === "icon");
  const illustrations = allEntries.filter((entry) => entry.kind === "illustration");
  return `// AUTO-GENERATED. DO NOT EDIT. Source SVG file names are authoritative.\n\n${renderKind("Icon", icons)}\n\n${renderKind("Illustration", illustrations)}\n\nexport const ${typePrefix}SvgRegistryEntries = [\n  ...${typePrefix}IconRegistryEntries,\n  ...${typePrefix}IllustrationRegistryEntries,\n] as const;\n`;
}

function renderKind(kindName, kindEntries) {
  const names = kindEntries.map(({ publicName }) => `  ${JSON.stringify(publicName)},`).join("\n");
  const registry = kindEntries
    .map(({ publicName, relativePath }) => `  { name: ${JSON.stringify(publicName)}, relativePath: ${JSON.stringify(relativePath)} },`)
    .join("\n");
  return `export const ${typePrefix}${kindName}Names = [\n${names}\n] as const;\n\nexport type ${typePrefix}${kindName} = (typeof ${typePrefix}${kindName}Names)[number];\n\nexport const ${typePrefix}${kindName}RegistryEntries: readonly {\n  name: ${typePrefix}${kindName};\n  relativePath: string;\n}[] = [\n${registry}\n];`;
}

function renderReactBarrel(allEntries) {
  const componentsRoot = path.resolve(projectRoot, config.react.componentsRoot);
  const barrelDirectory = path.dirname(path.resolve(projectRoot, config.react.barrelOutput));
  const lines = allEntries.map((entry) => {
    const componentPath = path.join(componentsRoot, entry.reactSubdir, entry.reactName);
    let importPath = path.relative(barrelDirectory, componentPath).replaceAll("\\", "/");
    if (!importPath.startsWith(".")) importPath = `./${importPath}`;
    return `export { default as ${entry.reactName} } from ${JSON.stringify(importPath)};`;
  });
  return `// AUTO-GENERATED. DO NOT EDIT. Source SVG file names are authoritative.\n${lines.join("\n")}\n`;
}

function validateReactComponents(allEntries) {
  const componentsRoot = path.resolve(projectRoot, config.react.componentsRoot);
  for (const entry of allEntries) {
    const componentPath = path.join(componentsRoot, entry.reactSubdir, `${entry.reactName}.tsx`);
    if (!fs.existsSync(componentPath)) {
      throw new Error(`Generated React SVG component is missing: ${componentPath}`);
    }
  }
}

function findSvgFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findSvgFiles(entryPath);
    return entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg" ? [entryPath] : [];
  });
}

function assertUnique(map, key, filePath, label) {
  if (map.has(key)) throw new Error(`Duplicate ${label} "${key}": ${map.get(key)} and ${filePath}`);
  map.set(key, filePath);
}

function assertCurrent(outputPath, expected) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8").replaceAll("\r\n", "\n") !== expected) {
    throw new Error(`Generated SVG contract is stale: ${outputPath}`);
  }
}

function writeGenerated(outputPath, content) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, "utf8");
}

function toPascalCase(value) {
  return value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}`).join("");
}

function levenshtein(left, right) {
  const rows = Array.from({ length: left.length + 1 }, (_, row) => [row]);
  rows[0] = Array.from({ length: right.length + 1 }, (_, column) => column);
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      rows[row][column] = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
  }
  return rows[left.length][right.length];
}

function parseArgs(argv) {
  const parsed = { check: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--check") parsed.check = true;
    else if (argv[index] === "--config") parsed.config = argv[++index];
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return parsed;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (!isDirectRun) throw new Error("Run this generator as a script.");
