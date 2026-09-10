import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const args = parseArgs(process.argv.slice(2));
const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.resolve(args.schema ?? path.join(skillRoot, "assets", "manifests", "schemas", "design-system.schema.json"));
const outputPath = path.resolve(args.output ?? path.join(skillRoot, "assets", "manifests", "types", "design-system-manifest.generated.ts"));
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const missingDescriptions = [];
verifyDescriptions(schema, "#");
if (missingDescriptions.length > 0) {
  throw new Error(`Missing JSON Schema descriptions:\n${missingDescriptions.map((entry) => `- ${entry}`).join("\n")}`);
}
if (args.validateOnly) {
  console.log(`OK: schema descriptions are complete (${schemaPath})`);
  process.exit(0);
}

const rootName = schema["x-typescript-type-name"] ?? toPascalCase(schema.title ?? "DesignSystemManifest");
const declarations = new Map();
const definitionNames = new Map(
  Object.keys(schema.$defs ?? {}).map((name) => [`#/$defs/${name}`, toPascalCase(name)]),
);

for (const [name, definition] of Object.entries(schema.$defs ?? {})) {
  materializeObject(definition, definitionNames.get(`#/$defs/${name}`), [rootName, toPascalCase(name)]);
}
materializeObject(schema, rootName, [rootName]);

const prettierConfig = await resolveConfig(outputPath);
const generatedSource = [
  "/**",
  " * AUTO-GENERATED FILE. DO NOT EDIT.",
  ` * Source: ${path.basename(schemaPath)}`,
  " * Regenerate with scripts/generate-manifest-types.mjs.",
  " */",
  "",
  ...declarations.values(),
].join("\n").trimEnd() + "\n";
const generated = await format(generatedSource, {
  ...prettierConfig,
  filepath: outputPath,
});

if (args.check) {
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Generated TypeScript file does not exist: ${outputPath}`);
  }
  const current = fs.readFileSync(outputPath, "utf8").replaceAll("\r\n", "\n");
  if (current !== generated) {
    throw new Error(`Generated TypeScript is stale: ${outputPath}\nRun the generator without --check.`);
  }
  console.log(`OK: schema descriptions and generated TypeScript are current (${outputPath})`);
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generated, "utf8");
  console.log(`Generated ${outputPath}`);
}

function materializeObject(node, name, pathParts) {
  if (declarations.has(name)) return name;

  if (node.type !== "object" && !node.properties && !node.additionalProperties) {
    declarations.set(name, `${jsDoc(node.description)}export type ${name} = ${typeFor(node, pathParts)};\n`);
    return name;
  }

  if (!node.properties && typeof node.additionalProperties === "object") {
    declarations.set(name, `${jsDoc(node.description)}export type ${name} = Record<string, ${typeFor(node.additionalProperties, [...pathParts, "Value"])}>;\n`);
    return name;
  }

  const required = new Set(node.required ?? []);
  const lines = [`${jsDoc(node.description)}export interface ${name} {`];
  for (const [propertyName, property] of Object.entries(node.properties ?? {})) {
    const childName = [...pathParts, toPascalCase(propertyName)].join("");
    lines.push(indent(jsDoc(property.description), 2).trimEnd());
    lines.push(`  ${quoteProperty(propertyName)}${required.has(propertyName) ? "" : "?"}: ${typeFor(property, [...pathParts, toPascalCase(propertyName)], childName)};`);
  }
  lines.push("}\n");
  declarations.set(name, lines.join("\n"));
  return name;
}

function typeFor(node, pathParts, suggestedName = pathParts.join("")) {
  if (node.$ref) return definitionNames.get(node.$ref) ?? toPascalCase(node.$ref.split("/").at(-1));
  if (Object.hasOwn(node, "const")) return JSON.stringify(node.const);
  if (node.enum) return node.enum.map((value) => JSON.stringify(value)).join(" | ");
  if (Array.isArray(node.type)) return node.type.map((type) => typeFor({ ...node, type }, pathParts, suggestedName)).join(" | ");
  if (node.type === "array") return `Array<${typeFor(node.items ?? {}, [...pathParts, "Item"])}>`;
  if (node.type === "object" || node.properties || node.additionalProperties) {
    return materializeObject(node, suggestedName, pathParts);
  }
  if (node.type === "string") return "string";
  if (node.type === "number" || node.type === "integer") return "number";
  if (node.type === "boolean") return "boolean";
  if (node.type === "null") return "null";
  return "unknown";
}

function verifyDescriptions(node, pointer) {
  for (const [name, property] of Object.entries(node.properties ?? {})) {
    const propertyPointer = `${pointer}/properties/${name}`;
    if (typeof property.description !== "string" || property.description.trim() === "") missingDescriptions.push(propertyPointer);
    verifyDescriptions(property, propertyPointer);
  }
  for (const [name, definition] of Object.entries(node.$defs ?? {})) {
    const definitionPointer = `${pointer}/$defs/${name}`;
    if (typeof definition.description !== "string" || definition.description.trim() === "") missingDescriptions.push(definitionPointer);
    verifyDescriptions(definition, definitionPointer);
  }
  if (node.items && typeof node.items === "object") verifyDescriptions(node.items, `${pointer}/items`);
}

function jsDoc(description) {
  const lines = String(description ?? "").trim().split(/\r?\n/);
  return ["/**", ...lines.map((line) => ` * ${line}`), " */\n"].join("\n");
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => `${prefix}${line}`).join("\n");
}

function quoteProperty(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function toPascalCase(value) {
  return String(value).replace(/(^|[^A-Za-z0-9]+)([A-Za-z0-9])/g, (_, __, character) => character.toUpperCase());
}

function parseArgs(argv) {
  const parsed = { check: false, validateOnly: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--check") parsed.check = true;
    else if (argv[index] === "--validate-only") parsed.validateOnly = true;
    else if (argv[index] === "--schema") parsed.schema = argv[++index];
    else if (argv[index] === "--output") parsed.output = argv[++index];
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  if (parsed.check && parsed.validateOnly) throw new Error("Use either --check or --validate-only, not both.");
  return parsed;
}
