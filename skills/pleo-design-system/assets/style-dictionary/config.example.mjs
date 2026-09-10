import fs from "node:fs";
import StyleDictionary from "style-dictionary";

const manifest = JSON.parse(fs.readFileSync("design-system.manifest.json", "utf8"));

const tokenSourceAdapter = {
  sourceSets: [
    { glob: "tokens/core/**/*.json", root: "tokens/core/", layer: "core" },
    { glob: "tokens/semantic/common/**/*.json", root: "tokens/semantic/common/", layer: "semantic" },
  ],
  category(token) {
    return token.path[0];
  },
  publicPath(token, layer) {
    const [category, candidateLayer, ...rest] = token.path;
    return candidateLayer === layer ? { category, rest } : { category, rest: token.path.slice(1) };
  },
};
let activeSourceSets = [];

function normalizedFilePath(token) {
  return String(token.filePath ?? "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function sourceSetsFor(theme) {
  return [
    ...tokenSourceAdapter.sourceSets,
    { glob: manifest.themes.semanticTokenFiles[theme], root: manifest.themes.semanticTokenFiles[theme], layer: "semantic" },
  ];
}

function sourceSetFor(token) {
  const filePath = normalizedFilePath(token);
  const matches = activeSourceSets.filter(({ root }) => {
    const normalizedRoot = root.replaceAll("\\", "/").replace(/^\.\//, "");
    return filePath === normalizedRoot
      || filePath.endsWith(`/${normalizedRoot}`)
      || (normalizedRoot.endsWith("/") && (filePath.startsWith(normalizedRoot) || filePath.includes(`/${normalizedRoot}`)));
  });
  if (matches.length !== 1) {
    throw new Error(`Token source must match exactly one configured layer: ${filePath || token.path.join(".")}`);
  }
  return matches[0];
}

function policy(framework, category, dimension) {
  return manifest.tokens.frameworkPolicies[framework].categories?.[category]?.[dimension]
    ?? manifest.tokens.categories[category]?.[dimension]
    ?? [];
}

function tokenLayer(token) {
  return sourceSetFor(token).layer;
}

function tokenCategory(token) {
  const category = tokenSourceAdapter.category(token);
  if (!manifest.tokens.categories[category]) {
    throw new Error(`Token category is not declared in manifest.tokens.categories; configure tokenSourceAdapter.category(): ${token.path.join(".")}`);
  }
  return category;
}

function policyFilter(framework, dimension) {
  return (token) => policy(framework, tokenCategory(token), dimension).includes(tokenLayer(token));
}

StyleDictionary.registerTransform({
  name: "pleo/name/public-token",
  type: "name",
  transform: (token) => {
    const layer = tokenLayer(token);
    const { category, rest } = tokenSourceAdapter.publicPath(token, layer);
    const prefix = category === "spacing"
      ? layer === "core" ? "spacing" : "space"
      : category === "typography"
        ? layer === "semantic" ? "typo" : "type"
        : category;
    return [prefix, ...rest].join("-").toLowerCase().replaceAll(/[^a-z0-9-]+/g, "-");
  },
});

function setNested(target, path, value) {
  const keys = [...path];
  const leaf = keys.pop();
  let cursor = target;
  for (const key of keys) cursor = cursor[key] ??= {};
  cursor[leaf] = value;
}

function tokenNumber(dictionary, dottedPath) {
  const token = dictionary.allTokens.find((candidate) => candidate.path.join(".") === dottedPath);
  const value = token?.$value ?? token?.value;
  if (!Number.isFinite(value)) throw new Error(`Missing numeric responsive token: ${dottedPath}`);
  return value;
}

function directChildNames(dictionary, dottedPath) {
  const prefix = dottedPath.split(".");
  return new Set(
    dictionary.allTokens
      .filter((token) => prefix.every((segment, index) => token.path[index] === segment) && token.path.length > prefix.length)
      .map((token) => token.path[prefix.length]),
  );
}

function sassValue(value, level = 0) {
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `(${value.map((item) => sassValue(item, level)).join(", ")}${value.length === 1 ? "," : ""})`;
  if (Object.keys(value).length === 0) return "()";

  const indentation = "  ".repeat(level);
  const childIndentation = "  ".repeat(level + 1);
  const entries = Object.entries(value).map(([key, item]) => `${childIndentation}${JSON.stringify(key)}: ${sassValue(item, level + 1)}`);
  return `(\n${entries.join(",\n")}\n${indentation})`;
}

StyleDictionary.registerFormat({
  name: "pleo/tailwind-json",
  format: ({ dictionary }) => {
    const result = {};
    for (const token of dictionary.allTokens) {
      setNested(result, token.path, `var(--${token.name})`);
    }
    return JSON.stringify(result, null, 2);
  },
});

StyleDictionary.registerFormat({
  name: "pleo/responsive-scss-config",
  format: ({ dictionary }) => {
    const responsive = manifest.responsive;
    const breakpointPrefix = responsive.breakpoints.tokenPath;
    const sourceBreakpointNames = directChildNames(dictionary, breakpointPrefix);
    for (const name of sourceBreakpointNames) {
      if (!responsive.breakpoints.names.includes(name)) {
        throw new Error(`Breakpoint token is not declared in responsive.breakpoints.names: ${name}`);
      }
    }
    const breakpoints = Object.fromEntries(
      responsive.breakpoints.names.map((name) => [name, tokenNumber(dictionary, `${breakpointPrefix}.${name}`)]),
    );
    let previousWidth = -Infinity;
    for (const [name, width] of Object.entries(breakpoints)) {
      if (width <= previousWidth) throw new Error(`Responsive breakpoint order is not strictly ascending at: ${name}`);
      previousWidth = width;
    }

    const gridValues = {};
    if (responsive.grid.enabled) {
      const gridPrefix = responsive.grid.tokenPath;
      const sourceGridVariants = directChildNames(dictionary, gridPrefix);
      for (const variant of sourceGridVariants) {
        if (!responsive.grid.variants.includes(variant)) {
          throw new Error(`Grid token variant is not declared in responsive.grid.variants: ${variant}`);
        }
      }
      for (const variant of responsive.grid.variants) {
        gridValues[variant] = {};
        const sourceGridBreakpoints = directChildNames(dictionary, `${gridPrefix}.${variant}`);
        for (const breakpoint of sourceGridBreakpoints) {
          if (!responsive.breakpoints.names.includes(breakpoint)) {
            throw new Error(`Grid token uses an undeclared breakpoint: ${variant}.${breakpoint}`);
          }
        }
        for (const breakpoint of responsive.breakpoints.names) {
          const prefix = `${gridPrefix}.${variant}.${breakpoint}`;
          const matching = dictionary.allTokens.filter((token) => token.path.join(".").startsWith(`${prefix}.`));
          if (matching.length === 0) continue;
          gridValues[variant][breakpoint] = Object.fromEntries(
            ["columns", "gutter", "margin", "margin-extra"].map((field) => [field, tokenNumber(dictionary, `${prefix}.${field}`)]),
          );
        }
        if (Object.keys(gridValues[variant]).length === 0) {
          throw new Error(`Grid variant has no token values: ${variant}`);
        }
        for (const breakpoint of new Set(Object.values(responsive.deviceBreakpointMap))) {
          if (!gridValues[variant][breakpoint]) {
            throw new Error(`Grid variant ${variant} is missing tokens for mapped breakpoint ${breakpoint}`);
          }
        }
      }
    }

    const variables = {
      "ds-device-types": responsive.deviceTypes,
      "ds-breakpoint-order": responsive.breakpoints.names,
      "ds-breakpoints": breakpoints,
      "ds-device-breakpoint-map": responsive.deviceBreakpointMap,
      "ds-device-multipliers": responsive.scaling.deviceMultipliers,
      "ds-implicit-breakpoint-fallbacks": responsive.scaling.implicitBreakpointFallbacks,
      "ds-grid-variants": responsive.grid.variants,
      "ds-grid-default-variant": responsive.grid.defaultVariant,
      "ds-grid-values": gridValues,
    };

    return [
      "// AUTO-GENERATED from design-system.manifest.json and core tokens. DO NOT EDIT.",
      ...Object.entries(variables).map(([name, value]) => `$${name}: ${sassValue(value)};`),
      "",
    ].join("\n");
  },
});

function filesFor(framework, theme) {
  const outputs = manifest.tokens.frameworkPolicies[framework].outputs;
  const files = [];

  if (outputs.includes("scss")) {
    files.push({
      destination: `tokens.${theme}.scss`,
      format: "scss/variables",
      filter: policyFilter(framework, "generate"),
    });
  }
  if (outputs.includes("css-variables")) {
    const angularTheme = manifest.themes.angular;
    const selector = framework === "angular" && angularTheme.enabled
      ? `${angularTheme.host}[${angularTheme.attribute}="${theme}"]`
      : `[data-theme="${theme}"]`;
    files.push({
      destination: `tokens.${theme}.css`,
      format: "css/variables",
      filter: policyFilter(framework, "allowedUsage"),
      options: { selector },
    });
  }
  if (framework === "react" && theme === "light" && outputs.includes("tailwind")) {
    files.push({
      destination: "tailwind.tokens.json",
      format: "pleo/tailwind-json",
      filter: policyFilter(framework, "allowedUsage"),
    });
  }
  return files;
}

for (const framework of ["angular", "react"]) {
  if (!manifest.frameworks[framework].enabled) continue;

  for (const theme of manifest.themes.modes) {
    activeSourceSets = sourceSetsFor(theme);
    const dictionary = new StyleDictionary({
      source: activeSourceSets.map(({ glob }) => glob),
      platforms: {
        [framework]: {
          transformGroup: "css",
          transforms: ["pleo/name/public-token"],
          buildPath: `dist/${framework}/tokens/`,
          files: filesFor(framework, theme),
        },
      },
    });
    await dictionary.buildAllPlatforms();
  }
}

{
  const responsiveConfigPath = manifest.responsive.generatedConfigScssPath.replaceAll("\\", "/");
  const responsiveDictionary = new StyleDictionary({
    source: [...new Set([manifest.responsive.breakpoints.tokenFile, manifest.responsive.grid.tokenFile].filter(Boolean))],
    platforms: {
      angularResponsive: {
        transformGroup: "scss",
        buildPath: "./",
        files: [{
          destination: responsiveConfigPath,
          format: "pleo/responsive-scss-config",
        }],
      },
    },
  });
  await responsiveDictionary.buildAllPlatforms();
}

// Adapt tokenSourceAdapter to the project's source layout and public naming contract.
// Layer classification must come from explicit source metadata and fail on ambiguity;
// never infer it from a fixed token.path segment. Keep the manifest policy as the only
// source controlling generation and consumer availability. The autocomplete policy is
// retained for a future dedicated IDE integration and is not emitted in v1.
