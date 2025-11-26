const StyleDictionary = require('style-dictionary');
const fs = require('fs');


function output(lines, selector){
    const joined = lines.map(line => `  ${line}`).join('\n')

    return `${selector} {
${joined}
}`;
}

function getSemanticTokens(dictionary) {
    return dictionary.allProperties.filter((token) => {
        const originalValue = token.original && token.original.value;
        return (
            typeof originalValue === 'string' &&
            originalValue.startsWith('{color.') &&
            originalValue.endsWith('}')
        );
    });
}

function buildTailwind({dictionary, options}) {
    const { selector = ':root' } = options;
    const semanticTokens = getSemanticTokens(dictionary)

    const lines = semanticTokens.map((token) => {
        const name = `--${token.name}`;
        return `${name}: var(${name});`;
    });
    return output(lines, selector)
}

function buildTheme({dictionary, options}) {
    const { selector = ':root' } = options;
    const lines = getSemanticTokens(dictionary).map(token => {
        const name = `--${token.name}`;
        const originalValue = token.original.value;
        const inner = originalValue.slice(1, -1);
        const colorTokenName = inner.replace(/^color\./, '');

        return `${name}: var(--color-${colorTokenName});`;
    });
    return output(lines, selector)
}

const FORMATS = {
    theme: {
        name: 'css/theme',
        formatter: buildTheme
    },
    tailwind: {
        name: 'css/tailwind',
        formatter: buildTailwind
    }
}

StyleDictionary.registerFormat(FORMATS.theme);
StyleDictionary.registerFormat(FORMATS.tailwind);

function getStyleDictionaryConfig(themeName, source, selector) {
    const platforms = {}
    platforms.css = {
        transformGroup: 'css',
        buildPath: `dist/css/`,
        files: [
            {
                destination: `tokens.${themeName}.css`,
                format: themeName === 'tailwind' ? FORMATS.tailwind.name : FORMATS.theme.name,
                options: {
                    selector,
                },
            },
        ],
    }

    if(themeName !== 'tailwind') {
        platforms.scss = {
            transformGroup: 'scss',
                buildPath: `dist/scss/`,
                files: [
                {
                    destination: `_variables_${themeName}.scss`,
                    format: 'scss/variables',
                }
            ]
        }
    }

    return {
        include: ['tokens/base/colors.json'],
        source: [`tokens/${source}`],
        platforms
    };
}

const sdBase = StyleDictionary.extend({
    source: ['tokens/base/colors.json'],
    platforms: {
        'base-css': {
            transformGroup: 'css',
            buildPath: `dist/css/`,
            files: [{
                destination: 'tokens.css',
                format: 'css/variables',
                options: {selector: ':root', outputReferences: false},
            }],
        },
    },
});
sdBase.buildAllPlatforms();


const themes = [
    {name: 'tailwind', source: ['light.json'], selector: '@theme'},
    {name: 'dark', source: ['dark.json'], selector: ':root[data-theme="dark"]'},
    {name: 'light', source: ['light.json'], selector: ':root'},
];

themes.forEach(theme => {
    const config = getStyleDictionaryConfig(theme.name, theme.source, theme.selector);
    if (!fs.existsSync(config.platforms.css.buildPath)) {
        fs.mkdirSync(config.platforms.css.buildPath, {recursive: true});
    }
    const sd = StyleDictionary.extend(config);
    sd.buildAllPlatforms();
});
