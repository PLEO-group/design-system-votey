import fs from 'node:fs';

import {register} from '@tokens-studio/sd-transforms';
import {compileString} from 'sass';
import StyleDictionary from 'style-dictionary';

register(StyleDictionary);

function output(lines, selector) {
    const joined = lines.map((line) => `  ${line}`).join('\n');

    return `${selector} {
${joined}
}`;
}

function resolveAlphaColor(dictionary, originalValue, tokenName) {
    const match = originalValue.match(
        /^rgba\(\{(color\.[^}]+)\},\s*\{(opacity\.[^}]+)\}\)$/,
    );

    if (!match) return null;

    const coreToken = dictionary.allTokens.find(
        (token) => token.path.join('.') === match[1],
    );
    const opacityToken = dictionary.allTokens.find(
        (token) => token.path.join('.') === match[2],
    );

    if (!coreToken || !opacityToken) {
        throw new Error(
            `Unresolved alpha color references for ${tokenName}: ${originalValue}`,
        );
    }

    const hexMatch = String(coreToken.value).match(
        /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
    );
    const alpha = Number(opacityToken.value);

    if (!hexMatch || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
        throw new Error(
            `Invalid alpha color recipe for ${tokenName}: ${originalValue}`,
        );
    }

    const channels = hexMatch
        .slice(1)
        .map((channel) => Number.parseInt(channel, 16));

    return `rgba(${channels.join(', ')}, ${alpha})`;
}

function getSemanticTokens(dictionary) {
    return dictionary.allTokens.filter((token) => {
        const originalValue = token.original && token.original.value;

        return (
            typeof originalValue === 'string' &&
            originalValue.startsWith('{color.') &&
            originalValue.endsWith('}')
        );
    });
}

function buildTailwind({dictionary, options}) {
    const {selector = ':root'} = options;
    const lines = dictionary.allTokens.map((token) => {
        const name = `--${token.name}`;

        return `${name}: var(${name});`;
    });

    return output(lines, selector);
}

function buildTheme({dictionary, options}) {
    const {selector = ':root'} = options;
    const lines = getSemanticTokens(dictionary).map((token) => {
        const name = `--${token.name}`;
        const originalValue = token.original.value;
        const inner = originalValue.slice(1, -1);
        const colorTokenName = inner.replace(/^color\./, '');

        return `${name}: var(--color-${colorTokenName});`;
    });

    return output(lines, selector);
}

function buildAngularTokens({dictionary, options}) {
    const {selector = ':root'} = options;
    const lines = dictionary.allTokens.map((token) => {
        const isCoreColor = token.filePath.endsWith('tokens/base/colors.json');
        const isCoreOpacity = token.filePath.endsWith(
            'tokens/opacity/core/value.json',
        );
        const isSemanticColor = token.filePath.endsWith(
            'tokens/color/semantic-CRM/Light.json',
        );
        const isCoreSpacing = token.filePath.endsWith(
            'tokens/space/core/value.json',
        );
        const isRadius = token.filePath.includes('tokens/radius/');
        const originalValue = token.original && token.original.value;

        if (isSemanticColor && typeof originalValue === 'string') {
            const alphaColor = resolveAlphaColor(
                dictionary,
                originalValue,
                token.name,
            );

            if (alphaColor) {
                return `--color-${token.name}: ${alphaColor};`;
            }
        }

        if (
            isSemanticColor &&
            typeof originalValue === 'string' &&
            /^\{color\.[^}]+\}$/.test(originalValue)
        ) {
            const coreName = originalValue.slice(1, -1).replaceAll('.', '-');

            return `--color-${token.name}: var(--${coreName});`;
        }

        if (
            isRadius &&
            typeof originalValue === 'string' &&
            /^\{radius\.[^}]+\}$/.test(originalValue)
        ) {
            const coreName = originalValue.slice(1, -1).replaceAll('.', '-');

            return `--${token.name}: var(--${coreName});`;
        }

        if (isCoreColor) {
            return `--${token.name}: ${token.value};`;
        }

        if (isCoreOpacity) {
            return null;
        }

        if (isCoreSpacing) {
            return `--spacing-${token.path.at(-1)}: ${token.value}px;`;
        }

        if (isRadius) {
            return `--${token.name}: ${token.value}px;`;
        }

        throw new Error(
            `Unsupported token in the Angular output: ${token.filePath}#${token.name}`,
        );
    }).filter(Boolean);

    return `/**
 * Generated file. Do not edit directly.
 * CRM/Angular token entry point: shared color core, CRM light semantics,
 * fixed spacing, radius and responsive spacing/typography.
 */
${output(lines, selector)}
`;
}

const RESPONSIVE_MODES = [
    {breakpoint: 'mobile-small', fileName: 'Mobile 360.json'},
    {breakpoint: 'mobile', fileName: 'Mobile 375.json'},
    {breakpoint: 'tablet-small', fileName: 'Tablet 768.json'},
    {breakpoint: 'tablet', fileName: 'Tablet 1024.json'},
    {breakpoint: 'laptop', fileName: 'Laptop 1280.json'},
    {breakpoint: 'desktop', fileName: 'Desktop 1920.json'},
];

const FONT_WEIGHTS = new Map([
    ['Light', 300],
    ['Regular', 400],
    ['SemiBold', 600],
    ['Bold', 700],
    ['ExtraBold', 800],
]);
const TYPOGRAPHY_PROPERTIES = new Set([
    'font-weight',
    'font-size',
    'line-height',
    'letter-spacing',
]);

function normalizeFilePath(filePath) {
    return filePath.replaceAll('\\', '/');
}

function loadFontFamilies() {
    const typeCore = JSON.parse(
        fs.readFileSync('tokens/type/core/value.json', 'utf8'),
    );
    const openSans = typeCore['font-family']?.['open-sans']?.value;
    const satoshi = typeCore['font-family']?.satoshi?.value;

    if (
        typeof openSans !== 'string' ||
        openSans.length === 0 ||
        typeof satoshi !== 'string' ||
        satoshi.length === 0
    ) {
        throw new Error(
            'Font family foundations must define non-empty open-sans and satoshi values.',
        );
    }

    return {openSans, satoshi};
}

async function getResponsiveModeTokens(group, fileName) {
    const corePath = `tokens/${group}/core/value.json`;
    const semanticPath = `tokens/${group}/semantic/${fileName}`;
    const styleDictionary = new StyleDictionary({
        include: [corePath],
        source: [semanticPath],
        platforms: {
            inspect: {
                transformGroup: 'css',
                files: [],
            },
        },
    });
    const dictionary = await styleDictionary.getPlatformTokens('inspect');

    return dictionary.allTokens.filter(
        (token) => normalizeFilePath(token.filePath) === semanticPath,
    );
}

function indent(lines, spaces) {
    const prefix = ' '.repeat(spaces);

    return lines.map((line) => `${prefix}${line}`);
}

function serializeResponsiveValues(values) {
    const lines = ['('];

    for (const mode of RESPONSIVE_MODES) {
        lines.push(`  "${mode.breakpoint}": ${values.get(mode.breakpoint)},`);
    }

    lines.push(')');

    return lines;
}

function serializeSpacingMap(spacingTokens) {
    const lines = ['$semantic-spacing-tokens: ('];

    for (const [role, values] of spacingTokens) {
        lines.push(`  "${role}": (`);
        lines.push(...indent(serializeResponsiveValues(values).slice(1, -1), 2));
        lines.push('  ),');
    }

    lines.push(');');

    return lines.join('\n');
}

function serializeTypographyMap(typographyTokens) {
    const lines = ['$semantic-typography-tokens: ('];

    for (const [role, properties] of typographyTokens) {
        lines.push(`  "${role}": (`);

        for (const property of ['font-size', 'line-height']) {
            lines.push(`    "${property}": (`);
            lines.push(
                ...indent(
                    serializeResponsiveValues(properties[property]).slice(
                        1,
                        -1,
                    ),
                    4,
                ),
            );
            lines.push('    ),');
        }

        lines.push(`    "font-weight": ${properties['font-weight']},`);
        lines.push(
            `    "letter-spacing": ${properties['letter-spacing']},`,
        );
        lines.push('  ),');
    }

    lines.push(');');

    return lines.join('\n');
}

function assertSameValue(role, property, values) {
    const uniqueValues = new Set(values.values());

    if (uniqueValues.size !== 1) {
        throw new Error(
            `Typography token ${role}.${property} must be identical in all responsive modes.`,
        );
    }

    return values.values().next().value;
}

async function loadResponsiveTokenMaps() {
    const spacingTokens = new Map();
    const typographyByMode = new Map();

    for (const mode of RESPONSIVE_MODES) {
        const spacingModeTokens = await getResponsiveModeTokens(
            'space',
            mode.fileName,
        );
        const typographyModeTokens = await getResponsiveModeTokens(
            'type',
            mode.fileName,
        );

        for (const token of spacingModeTokens) {
            const role = token.path.slice(1).join('-');

            if (!spacingTokens.has(role)) spacingTokens.set(role, new Map());
            spacingTokens.get(role).set(mode.breakpoint, token.value);
        }

        const modeTypography = new Map();
        for (const token of typographyModeTokens) {
            const [role, property] = token.path;

            if (!modeTypography.has(role)) modeTypography.set(role, new Map());
            modeTypography.get(role).set(property, token.value);
        }

        for (const [role, properties] of modeTypography) {
            const propertyNames = new Set(properties.keys());

            if (
                propertyNames.size !== TYPOGRAPHY_PROPERTIES.size ||
                [...TYPOGRAPHY_PROPERTIES].some(
                    (property) => !propertyNames.has(property),
                )
            ) {
                throw new Error(
                    `Typography role ${role} in ${mode.fileName} must contain font-weight, font-size, line-height and letter-spacing.`,
                );
            }
        }
        typographyByMode.set(mode.breakpoint, modeTypography);
    }

    const typographyTokens = new Map();
    const firstMode = typographyByMode.get(RESPONSIVE_MODES[0].breakpoint);

    for (const mode of RESPONSIVE_MODES.slice(1)) {
        const modeTypography = typographyByMode.get(mode.breakpoint);

        if (
            modeTypography.size !== firstMode.size ||
            [...firstMode.keys()].some((role) => !modeTypography.has(role))
        ) {
            throw new Error(
                `Typography roles in ${mode.fileName} do not match ${RESPONSIVE_MODES[0].fileName}.`,
            );
        }
    }

    for (const role of firstMode.keys()) {
        const fontSizes = new Map();
        const lineHeights = new Map();
        const fontWeights = new Map();
        const letterSpacings = new Map();

        for (const mode of RESPONSIVE_MODES) {
            const properties = typographyByMode.get(mode.breakpoint).get(role);

            if (!properties) {
                throw new Error(
                    `Typography role ${role} is missing in ${mode.fileName}.`,
                );
            }

            fontSizes.set(mode.breakpoint, properties.get('font-size'));
            lineHeights.set(mode.breakpoint, properties.get('line-height'));
            fontWeights.set(mode.breakpoint, properties.get('font-weight'));
            letterSpacings.set(
                mode.breakpoint,
                properties.get('letter-spacing'),
            );
        }

        if (
            [...fontSizes.values(), ...lineHeights.values()].some(
                (value) => !Number.isFinite(value),
            )
        ) {
            throw new Error(
                `Typography role ${role} contains a non-numeric responsive dimension.`,
            );
        }

        const sourceFontWeight = assertSameValue(
            role,
            'font-weight',
            fontWeights,
        );
        const fontWeight = FONT_WEIGHTS.get(sourceFontWeight);

        if (!fontWeight) {
            throw new Error(
                `Unsupported font weight "${sourceFontWeight}" in typography role ${role}.`,
            );
        }

        typographyTokens.set(role, {
            'font-size': fontSizes,
            'line-height': lineHeights,
            'font-weight': fontWeight,
            'letter-spacing': assertSameValue(
                role,
                'letter-spacing',
                letterSpacings,
            ),
        });
    }

    for (const [role, values] of spacingTokens) {
        if (values.size !== RESPONSIVE_MODES.length) {
            throw new Error(
                `Spacing token ${role} does not have all six responsive modes.`,
            );
        }

        if ([...values.values()].some((value) => !Number.isFinite(value))) {
            throw new Error(
                `Spacing token ${role} contains a non-numeric responsive dimension.`,
            );
        }
    }

    return {spacingTokens, typographyTokens};
}

async function buildResponsiveAngularCss() {
    const {spacingTokens, typographyTokens} =
        await loadResponsiveTokenMaps();
    const {openSans, satoshi} = loadFontFamilies();
    const spacingDefaults = [...spacingTokens.keys()]
        .map((role) => `  --space-${role}: 0px;`)
        .join('\n');
    const scss = `@use "styles/angular/responsive-token-engine" as engine;

${serializeSpacingMap(spacingTokens)}

${serializeTypographyMap(typographyTokens)}

:root {
  --font-family-open-sans: ${JSON.stringify(openSans)}, Arial, sans-serif;
  --font-family-satoshi: ${JSON.stringify(satoshi)}, system-ui, Arial, sans-serif;
${spacingDefaults}
}

@include engine.responsive-token-bundle(
  $semantic-spacing-tokens,
  $semantic-typography-tokens
);
`;
    const result = compileString(scss, {
        loadPaths: [process.cwd()],
        style: 'expanded',
    });

    return `/* Responsive spacing and typography. */\n${result.css.trim()}\n`;
}

const GRID_DEVICES = ['mobile', 'tablet', 'desktop'];
const GRID_TOKEN_PROPERTIES = [
    'margin',
    'margin-extra',
    'gutter',
    'columns',
];

function serializeGridMap(gridTokens) {
    const lines = ['$grid-tokens: ('];

    for (const device of GRID_DEVICES) {
        const config = gridTokens[device];

        lines.push(`  "${device}": (`);
        for (const property of GRID_TOKEN_PROPERTIES) {
            lines.push(`    "${property}": ${config[property]},`);
        }
        lines.push('  ),');
    }

    lines.push(');');

    return lines.join('\n');
}

function serializeBreakpointMap(breakpoints) {
    const lines = ['$breakpoints: ('];

    for (const device of GRID_DEVICES) {
        lines.push(`  "${device}": ${breakpoints[device]},`);
    }

    lines.push(');');

    return lines.join('\n');
}

function loadGridTokens() {
    const source = JSON.parse(
        fs.readFileSync('tokens/grid/angular.json', 'utf8'),
    );
    const gridTokens = source.grid?.admin;
    const breakpoints = source.breakpoint;

    if (
        !gridTokens ||
        typeof gridTokens !== 'object' ||
        !breakpoints ||
        typeof breakpoints !== 'object'
    ) {
        throw new Error(
            'Angular grid tokens must define grid.admin and breakpoint objects.',
        );
    }

    const normalizedGridTokens = {};
    const normalizedBreakpoints = {};

    for (const device of GRID_DEVICES) {
        const deviceTokens = gridTokens[device];
        const breakpoint = breakpoints[device]?.value;

        if (
            !deviceTokens ||
            typeof deviceTokens !== 'object' ||
            !Number.isFinite(breakpoint) ||
            breakpoint <= 0
        ) {
            throw new Error(
                `Angular grid or breakpoint tokens are missing ${device}.`,
            );
        }

        normalizedGridTokens[device] = {};
        normalizedBreakpoints[device] = breakpoint;

        for (const property of GRID_TOKEN_PROPERTIES) {
            const value = deviceTokens[property]?.value;

            if (!Number.isFinite(value) || value <= 0) {
                throw new Error(
                    `Angular grid token ${device}.${property} must be a positive number.`,
                );
            }

            normalizedGridTokens[device][property] = value;
        }

        if (!Number.isInteger(normalizedGridTokens[device].columns)) {
            throw new Error(
                `Angular grid token ${device}.columns must be an integer.`,
            );
        }
    }

    return {
        breakpoints: normalizedBreakpoints,
        gridTokens: normalizedGridTokens,
    };
}

function buildGridAngularCss() {
    const {breakpoints, gridTokens} = loadGridTokens();
    const scss = `@use "styles/angular/grid-token-engine" as engine;

${serializeGridMap(gridTokens)}

${serializeBreakpointMap(breakpoints)}

@include engine.grid-token-bundle($grid-tokens, $breakpoints);
`;
    const result = compileString(scss, {
        loadPaths: [process.cwd()],
        style: 'expanded',
    });

    return `/* CRM grid tokens. */\n${result.css.trim()}\n`;
}

const FORMATS = {
    theme: {
        name: 'css/theme',
        format: buildTheme,
    },
    tailwind: {
        name: 'css/tailwind',
        format: buildTailwind,
    },
    angular: {
        name: 'css/angular',
        format: buildAngularTokens,
    },
};

StyleDictionary.registerFormat(FORMATS.theme);
StyleDictionary.registerFormat(FORMATS.tailwind);
StyleDictionary.registerFormat(FORMATS.angular);

function getStyleDictionaryConfig(themeName, source, selector) {
    const platforms = {
        css: {
            transformGroup: 'css',
            transforms: ['ts/color/css/hexrgba'],
            buildPath: 'dist/css/',
            files: [
                {
                    destination: `tokens.${themeName}.css`,
                    format:
                        themeName === 'tailwind'
                            ? FORMATS.tailwind.name
                            : FORMATS.theme.name,
                    options: {selector},
                },
            ],
        },
    };

    if (themeName !== 'tailwind') {
        platforms.scss = {
            transformGroup: 'scss',
            transforms: ['ts/color/css/hexrgba'],
            buildPath: 'dist/scss/',
            files: [
                {
                    destination: `_variables_${themeName}.scss`,
                    format: 'scss/variables',
                },
            ],
        };
    }

    return {
        include: ['tokens/base/colors.json'],
        source: [`tokens/${source}`],
        platforms,
    };
}

async function buildLegacyTokens() {
    const sdBase = new StyleDictionary({
        source: ['tokens/base/colors.json'],
        platforms: {
            'base-css': {
                transformGroup: 'css',
                transforms: ['ts/color/css/hexrgba'],
                buildPath: 'dist/css/',
                files: [
                    {
                        destination: 'tokens.css',
                        format: 'css/variables',
                        options: {
                            selector: ':root',
                            outputReferences: false,
                        },
                    },
                ],
            },
        },
    });

    await sdBase.buildAllPlatforms();

    const themes = [
        {name: 'tailwind', source: ['light.json'], selector: '@theme'},
        {
            name: 'dark',
            source: ['dark.json'],
            selector: ':root[data-theme="dark"]',
        },
        {name: 'light', source: ['light.json'], selector: ':root'},
    ];

    for (const theme of themes) {
        const config = getStyleDictionaryConfig(
            theme.name,
            theme.source,
            theme.selector,
        );

        if (!fs.existsSync(config.platforms.css.buildPath)) {
            fs.mkdirSync(config.platforms.css.buildPath, {recursive: true});
        }

        const styleDictionary = new StyleDictionary(config);
        await styleDictionary.buildAllPlatforms();
    }
}

async function buildCrmAngularTokens() {
    const responsiveCss = await buildResponsiveAngularCss();
    const gridCss = buildGridAngularCss();
    const styleDictionary = new StyleDictionary({
        include: [
            'tokens/base/colors.json',
            'tokens/opacity/core/value.json',
            'tokens/space/core/value.json',
            'tokens/radius/core/value.json',
        ],
        source: [
            'tokens/color/semantic-CRM/Light.json',
            'tokens/radius/semantic/Default.json',
        ],
        platforms: {
            css: {
                transformGroup: 'css',
                transforms: ['ts/color/css/hexrgba'],
                buildPath: 'dist/css/',
                files: [
                    {
                        destination: 'tokens.angular.css',
                        format: FORMATS.angular.name,
                        options: {selector: ':root'},
                    },
                ],
            },
        },
    });

    await styleDictionary.buildAllPlatforms();

    const outputPath = 'dist/css/tokens.angular.css';
    const baseCss = fs.readFileSync(outputPath, 'utf8').trimEnd();
    fs.writeFileSync(
        outputPath,
        `${baseCss}\n\n${responsiveCss}\n${gridCss}`,
        'utf8',
    );
}

const targetArgument = process.argv.find((argument) =>
    argument.startsWith('--target='),
);
const target = targetArgument ? targetArgument.split('=')[1] : 'all';

if (!['all', 'angular', 'legacy'].includes(target)) {
    throw new Error(
        `Unknown build target "${target}". Use all, angular or legacy.`,
    );
}

if (target === 'all' || target === 'legacy') {
    await buildLegacyTokens();
}

if (target === 'all' || target === 'angular') {
    await buildCrmAngularTokens();
}
