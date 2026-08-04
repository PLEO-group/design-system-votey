const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const projectRoot = path.resolve(__dirname, "..");

function readReactIcon(context, componentName) {
  return fs.readFileSync(
    path.join(
      projectRoot,
      "dist",
      "assets",
      "react",
      "icons",
      context,
      `${componentName}.tsx`,
    ),
    "utf8",
  );
}

test("special React icons preserve source colors", () => {
  const correct = readReactIcon("special", "IconSpCorrect");
  const newStatus = readReactIcon("special", "IconSpNew");

  assert.match(correct, /fill="#77DC6C"/i);
  assert.match(correct, /fill="(?:white|#fff(?:fff)?)"/i);
  assert.match(newStatus, /fill="#CDF4FD"/i);
  assert.match(newStatus, /fill="#07064E"/i);
});

test("the UI close React icon remains colorable", () => {
  const close = readReactIcon("ui", "IconUiClose");

  assert.match(close, /fill="currentColor"/);
});
