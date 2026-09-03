const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {compileString} = require('sass');

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
const crmLightTokens = require(path.join(
    projectRoot,
    'tokens',
    'color',
    'semantic-CRM',
    'Light.json',
));
const crmDarkTokens = require(path.join(
    projectRoot,
    'tokens',
    'color',
    'semantic-CRM',
    'Dark.json',
));

function getTokenPaths(object, currentPath = []) {
    return Object.entries(object).flatMap(([key, value]) => {
        const tokenPath = [...currentPath, key];

        if (value && value.type === 'color' && 'value' in value) {
            return [tokenPath.join('.')];
        }

        return value && typeof value === 'object'
            ? getTokenPaths(value, tokenPath)
            : [];
    });
}

function buildAngularTokens() {
    execFileSync(
        process.execPath,
        ['build-style-dictionary.mjs', '--target=angular'],
        {cwd: projectRoot, stdio: 'pipe'},
    );

    return fs.readFileSync(outputPath, 'utf8');
}

test('CRM light and dark semantic colors expose the same contract', () => {
    assert.deepEqual(
        getTokenPaths(crmDarkTokens).sort(),
        getTokenPaths(crmLightTokens).sort(),
    );
});

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
    for (const legacyOutput of legacyAfterBuild) {
        assert.doesNotMatch(legacyOutput, /--grid-/);
    }
    assert.equal(declarations.size, 224);
    for (const reference of references) assert.ok(declarations.has(reference));
    assert.match(firstBuild, /--color-white: #ffffff;/);
    assert.match(firstBuild, /--color-gray-900: #444d5f;/);
    assert.match(firstBuild, /--color-navy-blue-300: #606489;/);
    assert.match(firstBuild, /--color-yellow-25: #fffcf1;/);
    assert.match(firstBuild, /--color-yellow-50: #fff5e1;/);
    assert.match(
        firstBuild,
        /--color-bg-page: var\(--color-gray-100\);/,
    );
    assert.match(
        firstBuild,
        /--color-text-primary: var\(--color-navy-blue-800\);/,
    );
    assert.match(
        firstBuild,
        /--color-text-placeholder: var\(--color-gray-blue-200\);/,
    );
    assert.match(
        firstBuild,
        /--color-border-field: var\(--color-gray-blue-100\);/,
    );
    assert.match(firstBuild, /--spacing-16: 16px;/);
    assert.match(firstBuild, /--radius-card: var\(--radius-30\);/);
    assert.match(
        firstBuild,
        /--font-family-open-sans: "Open Sans", Arial, sans-serif;/,
    );
    assert.match(
        firstBuild,
        /--font-family-satoshi: "Satoshi", system-ui, Arial, sans-serif;/,
    );
    assert.match(
        firstBuild,
        /--typo-h1-font-family: var\(--font-family-open-sans\);/,
    );
    assert.match(firstBuild, /--typo-h1-font-weight: 800;/);
    assert.match(firstBuild, /--typo-h1-letter-spacing: 0px;/);
    assert.match(firstBuild, /--typo-field-font-size: 16px;/);
    assert.match(firstBuild, /--typo-field-line-height: 22px;/);
    assert.match(firstBuild, /--typo-input-label-font-weight: 800;/);
    assert.match(firstBuild, /--typo-input-label-line-height: 19px;/);
    assert.match(firstBuild, /--space-page-margin: 0px;/);
    assert.match(firstBuild, /--space-field-padding-x: 0px;/);
    assert.match(
        firstBuild,
        /body\[data-device=mobile\] \{\n  --grid-columns: 4;/,
    );
    assert.match(
        firstBuild,
        /body\[data-device=tablet\] \{\n  --grid-columns: 8;/,
    );
    assert.match(
        firstBuild,
        /body\[data-device=desktop\] \{\n  --grid-columns: 12;/,
    );
    assert.match(firstBuild, /--grid-margin: 3\.7333333333vw;/);
    assert.match(firstBuild, /--grid-margin-extra: 6\.4vw;/);
    assert.match(firstBuild, /--grid-column-gap: 3\.2vw;/);
    assert.match(
        firstBuild,
        /--grid-column-width: calc\(\n    \(100vw - 7\.4666666667vw - 9\.6vw\) \/ 4\n  \);/,
    );
    assert.match(
        firstBuild,
        /--color-shadow-soft: rgba\(1, 0, 39, 0\.08\);/,
    );
    assert.match(
        firstBuild,
        /--color-shadow-event-filter: rgba\(19, 18, 93, 0\.3\);/,
    );
    assert.match(
        firstBuild,
        /--color-overlay-loader: rgba\(255, 255, 255, 0\.78\);/,
    );
    assert.match(
        firstBuild,
        /--color-overlay-loader-soft: rgba\(255, 255, 255, 0\.68\);/,
    );
    assert.match(
        firstBuild,
        /--color-overlay-accent-start: rgba\(136, 234, 125, 0\.3\);/,
    );
    assert.match(
        firstBuild,
        /--color-overlay-accent-end: rgba\(2, 194, 149, 0\);/,
    );
    assert.doesNotMatch(firstBuild, /--opacity-/);
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
        132,
    );
    assert.equal(
        [...firstBuild.matchAll(/@media \(min-width: 1920px\)/g)].length,
        132,
    );
    assert.doesNotMatch(firstBuild, /\{[a-z0-9.-]+\}/);
    assert.doesNotMatch(firstBuild, /--button-/);
    assert.equal(
        [...firstBuild.matchAll(/:root\[data-theme="dark"\]/g)].length,
        1,
    );
    assert.equal(
        [...firstBuild.matchAll(/\[data-votey-theme="dark"\]/g)].length,
        1,
    );
    assert.match(
        firstBuild,
        /\[data-votey-theme="dark"\] \{[\s\S]*?--color-bg-page: var\(--color-navy-blue-900\);/,
    );
    assert.match(
        firstBuild,
        /\[data-votey-theme="dark"\] \{[\s\S]*?--color-text-primary: var\(--color-white\);/,
    );
    assert.match(
        firstBuild,
        /\[data-votey-theme="dark"\] \{[\s\S]*?--color-border-subtle: var\(--color-navy-blue-600\);/,
    );
});

test('Angular build publishes mixins compatible with angular-design-system', () => {
    buildAngularTokens();

    const result = compileString(
        `@use "ds-device-mixins" as device-mixins;

.example {
  @include device-mixins.device("mobile") {
    display: block;
  }

  @include device-mixins.orientation("vertical") {
    flex-direction: column;
  }

  @include device-mixins.theme("dark") {
    color: var(--text-primary);
  }
}`,
        {
            loadPaths: [path.join(projectRoot, 'dist', 'scss')],
        },
    );

    assert.match(result.css, /data-device=(?:"mobile"|mobile)/);
    assert.match(result.css, /data-orientation=(?:"vertical"|vertical)/);
    assert.match(result.css, /data-theme=(?:"dark"|dark)/);
});
