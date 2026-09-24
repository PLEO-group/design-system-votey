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
const responsiveTypographyTokens = require(path.join(
    projectRoot,
    'tokens',
    'type',
    'semantic',
    'Desktop 1920.json',
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

function getColorReferences(object, currentPath = []) {
    return Object.entries(object).flatMap(([key, value]) => {
        const tokenPath = [...currentPath, key];

        if (
            value &&
            value.type === 'color' &&
            typeof value.value === 'string' &&
            /^\{color\.[^}]+\}$/.test(value.value)
        ) {
            return [
                {
                    name: `--color-${tokenPath.join('-')}`,
                    reference: `--${value.value.slice(1, -1).replaceAll('.', '-')}`,
                },
            ];
        }

        return value && typeof value === 'object'
            ? getColorReferences(value, tokenPath)
            : [];
    });
}

function assertColorReferences(css, tokens) {
    for (const {name, reference} of getColorReferences(tokens)) {
        assert.match(css, new RegExp(`${name}: var\\(${reference}\\);`));
    }
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
    for (const reference of references) assert.ok(declarations.has(reference));
    assert.match(firstBuild, /--color-white: #ffffff;/);
    assert.match(firstBuild, /--color-gray-900: #444d5f;/);
    assert.match(firstBuild, /--color-navy-blue-300: #606489;/);
    assert.match(firstBuild, /--color-yellow-25: #fffcf1;/);
    assert.match(firstBuild, /--color-yellow-50: #fff5e1;/);
    assertColorReferences(firstBuild, crmLightTokens);
    assert.match(firstBuild, /--spacing-16: 16px;/);
    assert.match(firstBuild, /--typo-h1-font-weight: 800;/);
    assert.match(firstBuild, /--typo-h1-letter-spacing: 0px;/);
    for (const role of Object.keys(responsiveTypographyTokens)) {
        for (const property of [
            'font-size',
            'font-weight',
            'letter-spacing',
            'line-height',
        ]) {
            assert.ok(declarations.has(`--typo-${role}-${property}`));
        }
    }
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
    assert.doesNotMatch(firstBuild, /--color-(shadow|overlay)-/);
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
    const maxWidthMediaCount = [
        ...firstBuild.matchAll(/@media \(max-width: 360px\)/g),
    ].length;
    const minWidthMediaCount = [
        ...firstBuild.matchAll(/@media \(min-width: 1920px\)/g),
    ].length;
    assert.equal(
        maxWidthMediaCount,
        minWidthMediaCount,
    );
    assert.ok(maxWidthMediaCount > 0);
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
    const darkCss = firstBuild
        .split('/* CRM dark semantic colors. */')[1]
        .split('/* Responsive spacing and typography. */')[0];
    assertColorReferences(darkCss, crmDarkTokens);
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
