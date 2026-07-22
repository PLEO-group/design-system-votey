const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(
    projectRoot,
    'dist',
    'css',
    'tokens.angular.css',
);
const legacyOutputPaths = [
    'tokens.css',
    'tokens.dark.css',
    'tokens.light.css',
    'tokens.tailwind.css',
].map((fileName) => path.join(projectRoot, 'dist', 'css', fileName));

function buildAngularTokens() {
    execFileSync(
        process.execPath,
        ['build-style-dictionary.mjs', '--target=angular'],
        {cwd: projectRoot, stdio: 'pipe'},
    );

    return fs.readFileSync(outputPath, 'utf8');
}

test('Angular build is deterministic and isolated from PWA semantics', () => {
    const legacyBeforeBuild = legacyOutputPaths.map((filePath) =>
        fs.readFileSync(filePath, 'utf8'),
    );
    const firstBuild = buildAngularTokens();
    const secondBuild = buildAngularTokens();
    const legacyAfterBuild = legacyOutputPaths.map((filePath) =>
        fs.readFileSync(filePath, 'utf8'),
    );
    const declarations = new Set(
        [...firstBuild.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map(
            (match) => match[1],
        ),
    );
    const references = [...firstBuild.matchAll(/var\((--[a-z0-9-]+)\)/g)].map(
        (match) => match[1],
    );

    assert.equal(secondBuild, firstBuild);
    assert.deepEqual(legacyAfterBuild, legacyBeforeBuild);
    assert.equal(declarations.size, 193);
    for (const reference of references) assert.ok(declarations.has(reference));
    assert.match(firstBuild, /--color-white: #ffffff;/);
    assert.match(
        firstBuild,
        /--color-bg-page: var\(--color-gray-100\);/,
    );
    assert.match(
        firstBuild,
        /--color-text-primary: var\(--color-navy-blue-800\);/,
    );
    assert.match(firstBuild, /--spacing-16: 16px;/);
    assert.match(firstBuild, /--radius-card: var\(--radius-30\);/);
    assert.match(
        firstBuild,
        /--font-family-open-sans: "Open Sans", Arial, sans-serif;/,
    );
    assert.match(firstBuild, /--typo-h1-font-weight: 800;/);
    assert.match(firstBuild, /--typo-h1-letter-spacing: 0px;/);
    assert.match(firstBuild, /--space-page-margin: 0px;/);
    assert.match(
        firstBuild,
        /@media \(min-width: 360px\) and \(max-width: 374px\)/,
    );
    assert.match(
        firstBuild,
        /@media \(min-width: 1280px\) and \(max-width: 1919px\)/,
    );
    assert.match(
        firstBuild,
        /body\[data-device=desktop\] \{\n    --typo-h1-font-size: calc\(40vw \+ -120px\);/,
    );
    assert.match(
        firstBuild,
        /body\[data-device=tablet\] \{\n    --typo-h1-font-size: calc\(80vw \+ -264px\);/,
    );
    assert.match(
        firstBuild,
        /body\[data-device=mobile\] \{\n    --typo-h1-font-size: calc\(0vw \+ 24px\);/,
    );
    assert.equal(
        [...firstBuild.matchAll(/@media \(max-width: 360px\)/g)].length,
        117,
    );
    assert.equal(
        [...firstBuild.matchAll(/@media \(min-width: 1920px\)/g)].length,
        117,
    );
    assert.doesNotMatch(firstBuild, /\{[a-z0-9.-]+\}/);
    assert.doesNotMatch(firstBuild, /--button-/);
    assert.doesNotMatch(firstBuild, /data-theme="dark"/);
});
