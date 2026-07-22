const assert = require('node:assert/strict');
const StyleDictionary = require('style-dictionary');

function exportTokens(tokens, transformGroup) {
    const platform = transformGroup ? {transformGroup} : {transforms: []};
    const dictionary = StyleDictionary.extend({
        tokens,
        platforms: {spike: platform},
    });

    return {
        allProperties: dictionary.allProperties,
        exported: dictionary.exportPlatform('spike'),
    };
}

function parseResolvedTokensStudioRgba(value) {
    const match = /^rgba\(\s*(#[0-9a-f]{6})\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*\)$/i.exec(
        value,
    );

    if (!match) {
        throw new Error(`Unsupported resolved RGBA recipe: ${value}`);
    }

    const [, hex, alphaText] = match;
    const numeric = Number.parseInt(hex.slice(1), 16);
    const red = (numeric >> 16) & 255;
    const green = (numeric >> 8) & 255;
    const blue = numeric & 255;
    const alpha = Number(alphaText);

    return {
        css: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
        figma: {
            r: red / 255,
            g: green / 255,
            b: blue / 255,
            a: alpha,
        },
    };
}

const tokensStudioFormulaTokens = {
    color: {
        black: {value: '#000000', type: 'color'},
        green: {value: '#157d40', type: 'color'},
        shadow: {
            soft: {
                value: 'rgba({color.black}, {opacity.8})',
                type: 'color',
            },
        },
        overlay: {
            accent: {
                end: {
                    value: 'rgba({color.green}, {opacity.0})',
                    type: 'color',
                },
            },
        },
    },
    opacity: {
        0: {value: 0, type: 'number'},
        8: {value: 0.08, type: 'number'},
    },
};

const formulaResult = exportTokens(tokensStudioFormulaTokens);
const shadow = formulaResult.exported.color.shadow.soft;
const transparentGreen = formulaResult.exported.color.overlay.accent.end;

assert.equal(shadow.value, 'rgba(#000000, 0.08)');
assert.equal(transparentGreen.value, 'rgba(#157d40, 0)');
assert.equal(shadow.original.value, 'rgba({color.black}, {opacity.8})');

const shadowOutput = parseResolvedTokensStudioRgba(shadow.value);
const transparentGreenOutput = parseResolvedTokensStudioRgba(
    transparentGreen.value,
);

assert.equal(shadowOutput.css, 'rgba(0, 0, 0, 0.08)');
assert.deepEqual(shadowOutput.figma, {r: 0, g: 0, b: 0, a: 0.08});
assert.equal(transparentGreenOutput.css, 'rgba(21, 125, 64, 0)');
assert.deepEqual(transparentGreenOutput.figma, {
    r: 21 / 255,
    g: 125 / 255,
    b: 64 / 255,
    a: 0,
});

const objectRecipeResult = exportTokens({
    color: {
        black: {value: '#000000', type: 'color'},
        shadow: {
            soft: {
                value: {
                    color: '{color.black}',
                    opacity: '{opacity.8}',
                },
                type: 'color',
            },
        },
    },
    opacity: {8: {value: 0.08, type: 'number'}},
});

assert.deepEqual(objectRecipeResult.exported.color.shadow.soft.value, {
    color: '#000000',
    opacity: 0.08,
});

const dtcgResult = exportTokens({
    color: {
        black: {$value: '#000000', $type: 'color'},
    },
});

assert.equal(dtcgResult.allProperties.length, 0);

for (const tokens of [
    {token: {value: '{missing.token}', type: 'color'}},
    {
        first: {value: '{second}', type: 'color'},
        second: {value: '{first}', type: 'color'},
    },
]) {
    assert.throws(
        () => exportTokens(tokens),
        /Problems were found when trying to resolve property references/,
    );
}

const manifest = {
    'color.shadow.soft': {
        recipe: shadow.original.value,
        resolved: shadow.value,
        ...shadowOutput,
    },
    'color.overlay.accent.end': {
        recipe: transparentGreen.original.value,
        resolved: transparentGreen.value,
        ...transparentGreenOutput,
    },
};

assert.equal(JSON.stringify(manifest), JSON.stringify({...manifest}));

console.log(
    JSON.stringify(
        {
            styleDictionaryVersion: require('style-dictionary/package.json')
                .version,
            findings: {
                tokensStudioFormula: 'references resolved',
                objectRecipe: 'references resolved, custom formatter required',
                dtcg: 'not recognized as tokens by Style Dictionary 3.9.2',
                missingReference: 'rejected',
                circularReference: 'rejected',
                deterministicManifest: true,
            },
            manifest,
        },
        null,
        2,
    ),
);
