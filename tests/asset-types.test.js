const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const reactInputs = [
  path.join(projectRoot, ".svgrrc-icons.json"),
  path.join(projectRoot, ".svgrrc-icons-preserve-colors.json"),
  path.join(projectRoot, ".svgrrc-illustrations.json"),
  path.join(projectRoot, "assets", "icons"),
  path.join(projectRoot, "assets", "illustrations"),
];
const reactOutput = path.join(
  projectRoot,
  "dist",
  "assets",
  "react",
);

function getFiles(entryPath) {
  if (!fs.existsSync(entryPath)) return [];

  const entry = fs.statSync(entryPath);
  if (entry.isFile()) return [entryPath];

  return fs.readdirSync(entryPath, { withFileTypes: true }).flatMap((child) =>
    getFiles(path.join(entryPath, child.name)),
  );
}

function getTreeSnapshot(entryPaths) {
  return entryPaths
    .flatMap(getFiles)
    .sort()
    .map((filePath) => ({
      hash: crypto
        .createHash("sha256")
        .update(fs.readFileSync(filePath))
        .digest("hex"),
      path: path.relative(projectRoot, filePath).replaceAll("\\", "/"),
    }));
}

function countSvgFiles(entryPath) {
  return getFiles(entryPath).filter(
    (filePath) => path.extname(filePath).toLowerCase() === ".svg",
  ).length;
}

test("generated public asset names are unique and namespaced", async () => {
  const { getAssetEntries } = await import(
    "../scripts/generate-asset-types.mjs"
  );
  const { icons, illustrations } = getAssetEntries();
  const iconNames = icons.map(({ name }) => name);
  const illustrationNames = illustrations.map(({ name }) => name);
  const assetPaths = [...icons, ...illustrations].map(({ path }) => path);

  assert.equal(
    icons.length,
    countSvgFiles(path.join(projectRoot, "assets", "icons")),
  );
  assert.equal(
    illustrations.length,
    countSvgFiles(path.join(projectRoot, "assets", "illustrations")),
  );
  assert.equal(new Set(iconNames).size, iconNames.length);
  assert.equal(new Set(illustrationNames).size, illustrationNames.length);
  assert.equal(
    new Set([...iconNames, ...illustrationNames]).size,
    icons.length + illustrations.length,
  );
  assert.ok(assetPaths.every((assetPath) => assetPath.endsWith(".svg")));
  assert.ok(assetPaths.every((assetPath) => !assetPath.includes("\\")));
  assert.ok(iconNames.includes("ui-agenda"));
  assert.ok(iconNames.includes("ui-download"));
  assert.ok(iconNames.includes("ui-show-graph-thick"));
  assert.ok(iconNames.includes("ui-close"));
  assert.ok(iconNames.includes("menu-dashboard"));
  assert.ok(iconNames.includes("menu-download"));
  assert.ok(iconNames.includes("sp-check"));
  assert.ok(iconNames.includes("logo-wyborek-sygnet"));
  assert.ok(!iconNames.includes("ui-iu-download"));
  assert.ok(!iconNames.includes("ui-video"));
  assert.ok(!iconNames.includes("menu-ui-close"));
  assert.ok(illustrationNames.includes("bg-agenda"));
  assert.ok(
    illustrationNames.includes("info-subscription-calculator"),
  );
  assert.ok(
    illustrationNames.includes("bg-participant-type-observer"),
  );
  assert.ok(illustrationNames.includes("bg-participant-type-voter"));
  assert.ok(!illustrationNames.some((name) => name.startsWith("background-")));
  assert.ok(illustrationNames.includes("spot-voting-start-automatic"));
  assert.ok(illustrationNames.includes("spot-voting-start-manual"));
  assert.ok(illustrationNames.includes("simple-notification"));
  assert.ok(illustrationNames.includes("simple-voting-start-automatic"));
  assert.ok(!illustrationNames.some((name) => name.startsWith("spot-simple-")));
  assert.ok(
    assetPaths.includes(
      "illustrations/info/illu_info_subscription-calculator.svg",
    ),
  );
  assert.ok(assetPaths.includes("icons/ui/icon_ui_close.svg"));
  assert.ok(!assetPaths.includes("icons/menu/icon_ui_close.svg"));
});

test("React icon names use the Icon prefix", async () => {
  const { getReactIconName } = await import(
    "../scripts/normalize-react-icon-names.mjs"
  );

  assert.equal(getReactIconName("IconMenuBurger.tsx"), "IconMenuBurger");
  assert.equal(
    getReactIconName("LogoWyborekSygnet.tsx"),
    "IconLogoWyborekSygnet",
  );
});

test("generated asset types are current", async () => {
  const { assetTypesOutputPath, buildAssetTypesSource } = await import(
    "../scripts/generate-asset-types.mjs"
  );

  assert.equal(
    fs.readFileSync(assetTypesOutputPath, "utf8"),
    buildAssetTypesSource(),
  );
});

test("asset type generation does not change React inputs or outputs", async () => {
  const { generateAssetTypes } = await import(
    "../scripts/generate-asset-types.mjs"
  );
  const before = getTreeSnapshot([...reactInputs, reactOutput]);

  generateAssetTypes();

  assert.deepEqual(
    getTreeSnapshot([...reactInputs, reactOutput]),
    before,
  );
});
