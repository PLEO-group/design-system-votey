import fs from "node:fs";
import path from "node:path";
import {
  extractModuleSpecifiers,
  findMiniDsCandidates,
  isInside,
  walkFiles,
} from "./_boundary-lib.mjs";
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
const report = createReport(`Repository boundary: ${projectRoot}`);
const block = (code, message, details) => addFinding(report, "BLOCK", code, message, details);
const review = (code, message, details) => addFinding(report, "REVIEW_REQUIRED", code, message, details);
const warn = (code, message, details) => addFinding(report, "WARN", code, message, details);

const repository = manifest.repository ?? {};
const packageRoot = path.resolve(projectRoot, repository.packageRoot ?? ".");
const consumerRoots = (repository.consumerRoots ?? []).map((root) => path.resolve(projectRoot, root));
const policy = repository.boundaryPolicy ?? {};
const miniDs = policy.localMiniDs ?? {};

const expectedManifestPath = path.join(packageRoot, "design-system.manifest.json");
if (manifestPath !== expectedManifestPath) {
  block(
    "manifest.location",
    "The DS manifest must be named design-system.manifest.json and live at repository.packageRoot",
    { actual: manifestPath, expected: expectedManifestPath },
  );
}

if (!isInside(projectRoot, packageRoot)) block("boundary.package-root", "packageRoot escapes repository root");
if (!fs.existsSync(packageRoot)) block("boundary.package-missing", `Package root does not exist: ${packageRoot}`);

if (repository.topology === "colocated-workspace-package") {
  if (packageRoot === projectRoot) block("boundary.colocated-root", "A colocated package cannot use the repository root as packageRoot");
  if (consumerRoots.length === 0) block("boundary.consumer-missing", "A colocated package requires consumerRoots");
}

for (const consumerRoot of consumerRoots) {
  if (!isInside(projectRoot, consumerRoot)) block("boundary.consumer-root", `Consumer root escapes repository: ${consumerRoot}`);
  if (!fs.existsSync(consumerRoot)) block("boundary.consumer-missing", `Consumer root does not exist: ${consumerRoot}`);
  if (isInside(packageRoot, consumerRoot) || isInside(consumerRoot, packageRoot)) {
    block("boundary.overlap", `Package and consumer roots overlap: ${consumerRoot}`);
  }
}

const packageJsonPath = path.join(packageRoot, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  block("boundary.package-json", "The design system root requires a package.json");
} else {
  const packageJson = readJson(packageJsonPath);
  if (repository.topology !== "embedded-mini-ds" && packageJson.name !== manifest.identity?.packageName) {
    block("boundary.package-name", "Package name differs from manifest identity.packageName");
  }
}

for (const field of ["generatorPath", "configPath", "generatedTypesPath"]) {
  const configuredPath = manifest.assets?.[field];
  if (typeof configuredPath !== "string" || configuredPath.length === 0) continue;
  const absolutePath = path.resolve(packageRoot, configuredPath);
  if (!isInside(packageRoot, absolutePath)) {
    block("assets.path-escape", `assets.${field} escapes packageRoot`, configuredPath);
  } else if (!fs.existsSync(absolutePath)) {
    block("assets.path-missing", `assets.${field} does not exist`, configuredPath);
  }
}

const responsiveConfigPath = manifest.responsive?.generatedConfigScssPath;
if (typeof responsiveConfigPath === "string" && responsiveConfigPath.length > 0) {
  const absolutePath = path.resolve(packageRoot, responsiveConfigPath);
  if (!isInside(packageRoot, absolutePath)) {
    block("responsive.config-path-escape", "responsive.generatedConfigScssPath escapes packageRoot", responsiveConfigPath);
  } else if (!fs.existsSync(absolutePath)) {
    block("responsive.config-missing", "Generated responsive SCSS config does not exist; run buildTokens", responsiveConfigPath);
  }
}

const angularTheme = manifest.themes?.angular ?? {};
if (angularTheme.enabled === true) {
  const configuredThemeFiles = {
    light: manifest.themes?.semanticTokenFiles?.light,
    dark: manifest.themes?.semanticTokenFiles?.dark,
    service: angularTheme.servicePath,
    contract: angularTheme.contractScssPath,
  };
  const resolvedThemeFiles = {};
  for (const [name, configuredPath] of Object.entries(configuredThemeFiles)) {
    if (typeof configuredPath !== "string" || configuredPath.length === 0) continue;
    const absolutePath = path.resolve(packageRoot, configuredPath);
    resolvedThemeFiles[name] = absolutePath;
    if (!isInside(packageRoot, absolutePath)) {
      block("theme.path-escape", `Theme ${name} path escapes packageRoot`, configuredPath);
    } else if (!fs.existsSync(absolutePath)) {
      block("theme.path-missing", `Theme ${name} file does not exist`, configuredPath);
    }
  }

  if (fs.existsSync(resolvedThemeFiles.light ?? "") && fs.existsSync(resolvedThemeFiles.dark ?? "")) {
    const tokenPaths = (value, prefix = [], result = new Set()) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return result;
      if (Object.hasOwn(value, "$value") || Object.hasOwn(value, "value")) {
        result.add(prefix.join("."));
        return result;
      }
      for (const [key, child] of Object.entries(value)) tokenPaths(child, [...prefix, key], result);
      return result;
    };
    const lightTokens = tokenPaths(readJson(resolvedThemeFiles.light));
    const darkTokens = tokenPaths(readJson(resolvedThemeFiles.dark));
    for (const token of lightTokens) {
      if (!darkTokens.has(token)) block("theme.dark-token-missing", "Dark mode is missing a semantic token", token);
    }
    for (const token of darkTokens) {
      if (!lightTokens.has(token)) block("theme.light-token-missing", "Light mode is missing a semantic token", token);
    }
  }

  if (fs.existsSync(resolvedThemeFiles.service ?? "")) {
    const service = fs.readFileSync(resolvedThemeFiles.service, "utf8");
    const requiredFragments = [
      ["body host", /\.body\.(?:setAttribute|dataset)/],
      ["data-theme", /data-theme|dataset\s*\[?['\"]theme/],
      ["sessionStorage", /sessionStorage/],
      ["theme storage key", /["']theme["']/],
      ["loadTheme", /loadTheme\s*\(/],
      ["setTheme boolean API", /setTheme\s*\(\s*\w+\s*:\s*boolean/],
      ["View Transitions", /startViewTransition/],
    ];
    for (const [label, pattern] of requiredFragments) {
      if (!pattern.test(service)) block("theme.service-contract", `Angular ThemeService is missing ${label}`, angularTheme.servicePath);
    }
    if (/localStorage|prefers-color-scheme|matchMedia\s*\(/.test(service)) {
      block("theme.service-foreign-mode", "Angular ThemeService must not use localStorage or system theme preference", angularTheme.servicePath);
    }
  }

  if (fs.existsSync(resolvedThemeFiles.contract ?? "")) {
    const contract = fs.readFileSync(resolvedThemeFiles.contract, "utf8");
    for (const theme of ["light", "dark"]) {
      if (!new RegExp(`body\\[data-theme=["']${theme}["']\\]`).test(contract)) {
        block("theme.scss-host", `Theme SCSS must include body[data-theme=${theme}]`, angularTheme.contractScssPath);
      }
    }
    if (/:root\[data-theme|html\[data-theme/.test(contract)) {
      block("theme.scss-host", "Angular theme contract must not place data-theme on html/:root", angularTheme.contractScssPath);
    }
  }

  for (const consumerRoot of consumerRoots) {
    const files = walkFiles(consumerRoot);
    const htmlFiles = files.filter((file) => path.basename(file).toLowerCase() === "index.html");
    const hasInitialTheme = htmlFiles.some((file) => /<body\b[^>]*\bdata-theme=["']light["']/i.test(fs.readFileSync(file, "utf8")));
    if (!hasInitialTheme) {
      block("theme.consumer-initial-host", "Angular consumer requires <body data-theme=\"light\"> in index.html", path.relative(projectRoot, consumerRoot));
    }

    const initializesTheme = files
      .filter((file) => [".ts", ".tsx"].includes(path.extname(file).toLowerCase()))
      .some((file) => /\.loadTheme\s*\(\s*\)/.test(fs.readFileSync(file, "utf8")));
    if (!initializesTheme) {
      block("theme.consumer-load", "Angular consumer must explicitly call ThemeService.loadTheme() during startup", path.relative(projectRoot, consumerRoot));
    }
  }
}

const allowedEntryPoints = new Set(
  ["angular", "react"]
    .filter((framework) => manifest.frameworks?.[framework]?.enabled)
    .map((framework) => `${manifest.identity.packageName}${manifest.frameworks[framework].entryPoint.slice(1)}`),
);
const codeExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);

for (const consumerRoot of consumerRoots) {
  for (const filePath of walkFiles(consumerRoot).filter((file) => codeExtensions.has(path.extname(file)))) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const specifier of extractModuleSpecifiers(content)) {
      if (specifier.startsWith(".")) {
        const resolved = path.resolve(path.dirname(filePath), specifier);
        if (isInside(packageRoot, resolved)) {
          block("boundary.consumer-relative-import", "Consumer imports DS through a relative workspace path", path.relative(projectRoot, filePath));
        }
      } else if (specifier === manifest.identity?.packageName || specifier.startsWith(`${manifest.identity?.packageName}/`)) {
        if (!allowedEntryPoints.has(specifier)) {
          block("boundary.consumer-deep-import", `Consumer uses a non-public DS import: ${specifier}`, path.relative(projectRoot, filePath));
        }
      }
    }
  }
}

for (const filePath of walkFiles(path.join(packageRoot, "src")).filter((file) => codeExtensions.has(path.extname(file)))) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const specifier of extractModuleSpecifiers(content)) {
    if (specifier.startsWith(".")) {
      const resolved = path.resolve(path.dirname(filePath), specifier);
      if (!isInside(packageRoot, resolved)) {
        block("boundary.package-relative-escape", "DS package imports a relative file outside packageRoot", path.relative(projectRoot, filePath));
      }
    }
    if ((policy.forbiddenPackageImportPrefixes ?? []).some((prefix) => specifier.startsWith(prefix))) {
      block("boundary.package-consumer-import", `DS package imports consumer namespace: ${specifier}`, path.relative(projectRoot, filePath));
    }
  }
}

const scssFiles = walkFiles(packageRoot).filter((file) => path.extname(file).toLowerCase() === ".scss");
const responsiveContracts = {
  device: [],
  breakpoint: [],
  deviceGrid: [],
  breakpointGrid: [],
};
for (const filePath of scssFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(projectRoot, filePath).replaceAll("\\", "/");
  if (/@mixin\s+device\s*\(|@include\s+(?:[\w-]+\.)?device\s*\(/.test(content)) responsiveContracts.device.push(relativePath);
  if (/@mixin\s+breakpoint\s*\(|@include\s+(?:[\w-]+\.)?breakpoint\s*\(/.test(content)) responsiveContracts.breakpoint.push(relativePath);
  const definesGridAliases = /--grid-(?:columns|column-width|column-gap|margin|margin-extra)\s*:/.test(content)
    || /apply-grid-contract\s*\(/.test(content);
  if (definesGridAliases && /\[data-device[=\]]/.test(content)) responsiveContracts.deviceGrid.push(relativePath);
  if (definesGridAliases && /@include\s+(?:[\w-]+\.)?breakpoint\s*\(/.test(content)) responsiveContracts.breakpointGrid.push(relativePath);
}

const responsiveMode = manifest.responsive?.mode;
if (responsiveContracts.device.length > 0 && responsiveContracts.breakpoint.length > 0) {
  block("responsive.mixed-contracts", "DS cannot contain both device() and breakpoint() responsive contracts", {
    device: responsiveContracts.device,
    breakpoint: responsiveContracts.breakpoint,
  });
}
if (responsiveMode === "device-contract") {
  if (responsiveContracts.device.length === 0) block("responsive.device-missing", "device-contract requires a device() mixin");
  if (responsiveContracts.breakpoint.length > 0) block("responsive.breakpoint-forbidden", "device-contract forbids breakpoint()", responsiveContracts.breakpoint);
}
if (responsiveMode === "css-media") {
  if (responsiveContracts.breakpoint.length === 0) block("responsive.breakpoint-missing", "css-media requires a breakpoint() mixin");
  if (responsiveContracts.device.length > 0) block("responsive.device-forbidden", "css-media forbids device()", responsiveContracts.device);
}

const gridEnabled = manifest.responsive?.grid?.enabled === true;
if (responsiveContracts.deviceGrid.length > 0 && responsiveContracts.breakpointGrid.length > 0) {
  block("grid.mixed-contracts", "DS cannot contain both device and breakpoint grid adapters", {
    device: responsiveContracts.deviceGrid,
    breakpoint: responsiveContracts.breakpointGrid,
  });
}
if (!gridEnabled && (responsiveContracts.deviceGrid.length > 0 || responsiveContracts.breakpointGrid.length > 0)) {
  block("grid.unexpected", "Grid adapters exist while responsive.grid.enabled is false");
}
if (gridEnabled && responsiveMode === "device-contract" && responsiveContracts.deviceGrid.length === 0) {
  block("grid.device-missing", "Grid with device-contract requires a data-device grid adapter");
}
if (gridEnabled && responsiveMode === "device-contract" && responsiveContracts.breakpointGrid.length > 0) {
  block("grid.breakpoint-forbidden", "Grid with device-contract forbids a breakpoint grid adapter", responsiveContracts.breakpointGrid);
}
if (gridEnabled && responsiveMode === "css-media" && responsiveContracts.breakpointGrid.length === 0) {
  block("grid.breakpoint-missing", "Grid with css-media requires a breakpoint grid adapter");
}
if (gridEnabled && responsiveMode === "css-media" && responsiveContracts.deviceGrid.length > 0) {
  block("grid.device-forbidden", "Grid with css-media forbids a data-device grid adapter", responsiveContracts.deviceGrid);
}

if (repository.topology === "colocated-workspace-package") {
  const candidates = findMiniDsCandidates(projectRoot, repository.consumerRoots ?? [], repository.packageRoot);
  if (miniDs.mode === "forbid") {
    const add = miniDs.heuristicFindings === "review-required" ? review : block;
    for (const candidate of candidates) add("boundary.local-mini-ds", "DS-like source exists outside packageRoot", candidate);
  } else if (miniDs.mode === "migration-baseline") {
    const baselinePath = path.resolve(projectRoot, miniDs.baselineFile ?? "");
    if (!fs.existsSync(baselinePath)) {
      block("boundary.baseline-missing", `Mini-DS baseline is missing: ${baselinePath}`);
    } else {
      const baseline = readJson(baselinePath);
      if (baseline.schemaVersion !== 1 || baseline.kind !== "pleo-mini-ds-baseline" || !Array.isArray(baseline.files)) {
        block("boundary.baseline-invalid", "Mini-DS baseline has an invalid contract");
      } else {
        const expected = new Set(baseline.files);
        const current = new Set(candidates);
        for (const candidate of current) {
          if (!expected.has(candidate)) block("boundary.mini-ds-growth", "New mini-DS file appeared outside packageRoot", candidate);
        }
        for (const oldFile of expected) {
          if (!current.has(oldFile)) warn("boundary.mini-ds-reduced", "Legacy mini-DS file was removed; update baseline after stage approval", oldFile);
        }
      }
    }
  }
}

printReport(report, args.json === true);
exitForReport(report);
