import fs from "node:fs";
import path from "node:path";

export function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;

    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

export function resolveDirectory(input, label = "directory") {
  const resolved = path.resolve(input ?? process.cwd());
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`${label} does not exist or is not a directory: ${resolved}`);
  }
  return resolved;
}

export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON ${filePath}: ${error.message}`);
  }
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function createReport(subject) {
  return { subject, findings: [] };
}

export function addFinding(report, level, code, message, details = undefined) {
  const finding = { level, code, message };
  if (details !== undefined) finding.details = details;
  report.findings.push(finding);
}

export function finalizeReport(report) {
  report.summary = {
    BLOCK: report.findings.filter((finding) => finding.level === "BLOCK").length,
    REVIEW_REQUIRED: report.findings.filter((finding) => finding.level === "REVIEW_REQUIRED").length,
    WARN: report.findings.filter((finding) => finding.level === "WARN").length,
  };
  report.valid = report.summary.BLOCK === 0;
  return report;
}

export function printReport(report, asJson = false) {
  finalizeReport(report);

  if (asJson) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  process.stdout.write(`${report.subject}\n`);
  for (const finding of report.findings) {
    process.stdout.write(`[${finding.level}] ${finding.code}: ${finding.message}\n`);
  }
  process.stdout.write(
    `Summary: BLOCK=${report.summary.BLOCK}, REVIEW_REQUIRED=${report.summary.REVIEW_REQUIRED}, WARN=${report.summary.WARN}\n`,
  );
}

export function exitForReport(report) {
  process.exitCode = report.summary?.BLOCK > 0 ? 1 : 0;
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

export function hasException(manifest, rule) {
  return Array.isArray(manifest?.exceptions)
    && manifest.exceptions.some((exception) => exception?.rule === rule && exception?.status === "active");
}

export function findFiles(root, fileName, maxDepth = 4, onSkip = () => {}) {
  const ignored = new Set([".git", ".tmp", "dist", "node_modules", "coverage", ".nx"]);
  const results = [];

  function visit(directory, depth) {
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch (error) {
      onSkip(directory, error);
      return;
    }

    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(fullPath, depth + 1);
      else if (entry.name === fileName) results.push(fullPath);
    }
  }

  visit(root, 0);
  return results;
}

export function readFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const result = {};
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const field = lines[index].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;

    const [, key, rawValue] = field;
    if (rawValue === ">" || rawValue === "|") {
      const chunks = [];
      while (index + 1 < lines.length && (/^\s+/.test(lines[index + 1]) || lines[index + 1] === "")) {
        index += 1;
        chunks.push(lines[index].trim());
      }
      result[key] = rawValue === ">" ? chunks.join(" ").trim() : chunks.join("\n").trim();
      continue;
    }

    result[key] = rawValue.trim().replace(/^['"]|['"]$/g, "");
  }
  return result;
}
