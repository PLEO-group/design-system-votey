const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
    CoreColorValidationError,
    validateCoreColorFile,
    validateCoreColorTokens,
} = require('../scripts/validate-core-colors');

function tokensWith(value) {
    return {
        color: {
            candidate: {
                value,
                type: 'color',
            },
        },
    };
}

test('accepts the current core color source', () => {
    assert.doesNotThrow(() => validateCoreColorFile());
});

test('accepts canonical lowercase 6-digit HEX', () => {
    assert.doesNotThrow(() =>
        validateCoreColorTokens(tokensWith('#1e795f')),
    );
});

test('accepts legacy uppercase 6-digit HEX without changing its value', () => {
    assert.doesNotThrow(() =>
        validateCoreColorTokens(tokensWith('#FFFFFF')),
    );
});

test('accepts a future object color only when alpha is 1 or omitted', () => {
    assert.doesNotThrow(() =>
        validateCoreColorTokens(
            tokensWith({
                colorSpace: 'srgb',
                components: [0, 0, 0],
                alpha: 1,
            }),
        ),
    );
    assert.doesNotThrow(() =>
        validateCoreColorTokens(
            tokensWith({
                colorSpace: 'srgb',
                components: [0, 0, 0],
            }),
        ),
    );
});

const forbiddenValues = [
    ['4-digit alpha HEX', '#0008', /4\/8-digit HEX/],
    ['8-digit alpha HEX', '#00000014', /4\/8-digit HEX/],
    ['rgba()', 'rgba(0, 0, 0, 0.08)', /rgba\(\)\/hsla\(\)/],
    ['hsla()', 'hsla(0, 0%, 0%, 0.08)', /rgba\(\)\/hsla\(\)/],
    ['transparent', 'transparent', /transparent is forbidden/],
    [
        'color-mix with transparent',
        'color-mix(in srgb, #000000 8%, transparent)',
        /color-mix/,
    ],
    [
        'object alpha below 1',
        {colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.08},
        /alpha must be 1 or omitted/,
    ],
    [
        'Figma-like object alpha below 1',
        {r: 0, g: 0, b: 0, a: 0.08},
        /alpha must be 1 or omitted/,
    ],
];

for (const [name, value, expectedMessage] of forbiddenValues) {
    test(`rejects ${name} and identifies the token`, () => {
        assert.throws(
            () => validateCoreColorTokens(tokensWith(value), 'fixture.json'),
            (error) => {
                assert.ok(error instanceof CoreColorValidationError);
                assert.match(error.message, /color\.candidate/);
                assert.match(error.message, expectedMessage);
                return true;
            },
        );
    });
}

test('rejects unsupported core color strings', () => {
    for (const value of ['#fff', '{color.white}']) {
        assert.throws(
            () => validateCoreColorTokens(tokensWith(value)),
            /opaque 6-digit HEX/,
        );
    }
});

test('does not allow a missing type field to bypass validation', () => {
    const tokens = {
        color: {
            candidate: {
                value: '#00000014',
            },
        },
    };

    assert.throws(
        () => validateCoreColorTokens(tokens),
        /color\.candidate/,
    );
});

test('collects all violations in one readable error', () => {
    const tokens = {
        color: {
            first: {value: '#00000014', type: 'color'},
            second: {value: 'transparent', type: 'color'},
        },
    };

    assert.throws(
        () => validateCoreColorTokens(tokens, 'fixture.json'),
        (error) => {
            assert.equal(error.violations.length, 2);
            assert.match(error.message, /color\.first/);
            assert.match(error.message, /color\.second/);
            return true;
        },
    );
});

test('CLI exits with a non-zero status before a build can continue', () => {
    const temporaryDirectory = fs.mkdtempSync(
        path.join(os.tmpdir(), 'votey-core-colors-'),
    );
    const fixtureFile = path.join(temporaryDirectory, 'invalid-colors.json');
    const validatorFile = path.resolve(
        __dirname,
        '..',
        'scripts',
        'validate-core-colors.js',
    );

    try {
        fs.writeFileSync(
            fixtureFile,
            JSON.stringify(tokensWith('#00000014')),
            'utf8',
        );

        const result = spawnSync(
            process.execPath,
            [validatorFile, fixtureFile],
            {encoding: 'utf8'},
        );

        assert.equal(result.status, 1);
        assert.match(result.stderr, /color\.candidate/);
        assert.match(result.stderr, /4\/8-digit HEX/);
    } finally {
        fs.rmSync(temporaryDirectory, {recursive: true, force: true});
    }
});
