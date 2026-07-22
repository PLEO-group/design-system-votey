import fs from 'node:fs';

import {register} from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

register(StyleDictionary);

function output(lines, selector) {
    const joined = lines.map((line) => `  ${line}`).join('\n');

    return `${selector} {
${joined}
}`;
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

const FORMATS = {
    theme: {
        name: 'css/theme',
        format: buildTheme,
    },
    tailwind: {
        name: 'css/tailwind',
        format: buildTailwind,
    },
};

StyleDictionary.registerFormat(FORMATS.theme);
StyleDictionary.registerFormat(FORMATS.tailwind);

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
    {name: 'dark', source: ['dark.json'], selector: ':root[data-theme="dark"]'},
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
