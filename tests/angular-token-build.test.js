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

function resolvedGridValue(css, property, width) {
    const gridCss = css.split('/* CRM grid tokens. */')[1];
    const declaration = /@media \((max-width|min-width): (\d+)px\)(?: and \(max-width: (\d+)px\))? \{\s*:root \{\s*(--grid-[a-z-]+): ([^;]+);/g;
    let result;

    for (const match of gridCss.matchAll(declaration)) {
        const [, direction, boundary, upper, token, rawValue] = match;
        if (token !== property) continue;
        const applies = direction === 'max-width'
            ? width <= Number(boundary)
            : width >= Number(boundary) && (!upper || width <= Number(upper));
        if (!applies) continue;

        const calc = rawValue.match(/^calc\((-?[\d.]+)vw \+ (-?[\d.]+)px\)$/);
        result = calc
            ? Number(calc[1]) * width / 100 + Number(calc[2])
            : Number(rawValue.replace('px', ''));
    }

    assert.notEqual(result, undefined, `Missing ${property} at ${width}px`);
    return result;
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
    assert.match(firstBuild, /--grid-margin: 16px;/);
    assert.match(firstBuild, /--grid-margin: calc\(-3\.90625vw \+ 82px\);/);
    assert.match(firstBuild, /--grid-margin: 64px;/);
    assert.match(firstBuild, /--grid-column-gap: 16px;/);
    assert.match(firstBuild, /--grid-column-gap: calc\(0vw \+ 24px\);/);
    assert.match(firstBuild, /--grid-column-gap: 40px;/);
    assert.match(firstBuild, /--grid-sidebar-width-collapsed: 80px;/);
    assert.match(firstBuild, /--grid-sidebar-width-expanded: 183px;/);
    assert.match(firstBuild, /body\[data-votey-sidebar-state=expanded\]/);
    assert.match(firstBuild, /--grid-content-width: calc\(100vw - var\(--grid-sidebar-width\)\);/);
    assert.match(firstBuild, /--grid-column-width: calc\(\(var\(--grid-content-width\)/);
    assert.doesNotMatch(firstBuild, /--grid-margin-extra:/);
    const gridReferences = [
        [360, 16, 16], [375, 16, 16], [768, 24, 24],
        [1024, 42, 24], [1280, 32, 24], [1920, 64, 40],
        [900, 33.28125, 24], [1152, 37, 24], [1600, 48, 32],
    ];
    for (const [width, margin, gutter] of gridReferences) {
        assert.ok(Math.abs(resolvedGridValue(firstBuild, '--grid-margin', width) - margin) < 0.01);
        assert.ok(Math.abs(resolvedGridValue(firstBuild, '--grid-column-gap', width) - gutter) < 0.01);
    }
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
    // The sidebar adds one independent >=1920px step on top of the paired
    // responsive margin and gutter ranges.
    assert.equal(minWidthMediaCount, maxWidthMediaCount + 1);
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
