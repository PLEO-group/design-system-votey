const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const angularSourceRoot = path.resolve(__dirname, "..", "angular", "src");
const voteyElementSelectorPattern = /^vt-[a-z0-9]+(?:-[a-z0-9]+)*$/;

function findAngularComponentFiles(directoryPath) {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return findAngularComponentFiles(entryPath);
      }

      return entry.name.endsWith(".component.ts") ? [entryPath] : [];
    });
}

test("every Angular component uses a vt-prefixed element selector", () => {
  const componentFiles = findAngularComponentFiles(angularSourceRoot);

  assert.ok(componentFiles.length > 0, "No Angular components were found.");

  for (const componentFile of componentFiles) {
    const source = fs.readFileSync(componentFile, "utf8");
    const selectorMatch = source.match(/selector\s*:\s*["'`](.+?)["'`]/);
    const relativePath = path.relative(angularSourceRoot, componentFile);

    assert.ok(selectorMatch, `${relativePath} does not declare a selector.`);
    assert.match(
      selectorMatch[1],
      voteyElementSelectorPattern,
      `${relativePath} must use a vt-prefixed element selector.`
    );
  }
});
