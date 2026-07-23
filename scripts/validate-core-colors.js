const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_CORE_COLORS_FILE = path.resolve(
    __dirname,
    '..',
    'tokens',
    'base',
    'colors.json',
);

const OPAQUE_HEX_6 = /^#[0-9a-f]{6}$/i;
const ALPHA_HEX = /^(?:#[0-9a-fA-F]{4}|#[0-9a-fA-F]{8})$/;
const FUNCTIONAL_ALPHA_COLOR = /^(?:rgba|hsla)\s*\(/i;
const TRANSPARENT = /\btransparent\b/i;
const COLOR_MIX = /\bcolor-mix\s*\(/i;

class CoreColorValidationError extends Error {
    constructor(sourceFile, violations) {
        const details = violations
            .map(({tokenPath, message}) => `- ${tokenPath}: ${message}`)
            .join('\n');

        super(
            `Core color validation failed for ${sourceFile}:\n${details}`,
        );
        this.name = 'CoreColorValidationError';
        this.sourceFile = sourceFile;
        this.violations = violations;
    }
}

function getTokenValue(token) {
    return Object.prototype.hasOwnProperty.call(token, '$value')
        ? token.$value
        : token.value;
}

function getTokenType(token, inheritedType) {
    return token.$type || token.type || inheritedType;
}

function validateOpaqueColorValue(value) {
    if (typeof value === 'string') {
        const normalized = value.trim();

        if (OPAQUE_HEX_6.test(normalized)) {
            return null;
        }

        if (ALPHA_HEX.test(normalized)) {
            return 'alpha-capable 4/8-digit HEX is forbidden in core; use opaque 6-digit #rrggbb';
        }

        if (FUNCTIONAL_ALPHA_COLOR.test(normalized)) {
            return 'rgba()/hsla() is forbidden in core; compose alpha in a semantic token';
        }

        if (COLOR_MIX.test(normalized) && TRANSPARENT.test(normalized)) {
            return 'color-mix(... transparent) is forbidden in core; compose alpha in a semantic token';
        }

        if (TRANSPARENT.test(normalized)) {
            return 'transparent is forbidden in core; core colors must be opaque';
        }

        return 'core color must use opaque 6-digit HEX (#rrggbb)';
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const alpha = Object.prototype.hasOwnProperty.call(value, 'alpha')
            ? value.alpha
            : value.a;

        if (alpha !== undefined && alpha !== 1) {
            return `object color alpha must be 1 or omitted; received ${JSON.stringify(alpha)}`;
        }

        return null;
    }

    return 'core color must be a supported opaque color value';
}

function collectCoreColorViolations(tokens) {
    const violations = [];

    function walk(node, tokenPath = [], inheritedType) {
        if (!node || typeof node !== 'object' || Array.isArray(node)) {
            return;
        }

        const currentType = getTokenType(node, inheritedType);
        const hasValue =
            Object.prototype.hasOwnProperty.call(node, 'value') ||
            Object.prototype.hasOwnProperty.call(node, '$value');

        if (hasValue) {
            const belongsToColorGroup = tokenPath[0] === 'color';

            if (currentType !== 'color' && !belongsToColorGroup) {
                return;
            }

            const message = validateOpaqueColorValue(getTokenValue(node));

            if (message) {
                violations.push({
                    tokenPath: tokenPath.join('.'),
                    message,
                });
            }

            return;
        }

        for (const [key, child] of Object.entries(node)) {
            if (key.startsWith('$') || key === 'type') {
                continue;
            }

            walk(child, [...tokenPath, key], currentType);
        }
    }

    walk(tokens);
    return violations;
}

function validateCoreColorTokens(tokens, sourceFile = '<in-memory>') {
    const violations = collectCoreColorViolations(tokens);

    if (violations.length > 0) {
        throw new CoreColorValidationError(sourceFile, violations);
    }
}

function validateCoreColorFile(sourceFile = DEFAULT_CORE_COLORS_FILE) {
    const resolvedFile = path.resolve(sourceFile);
    const tokens = JSON.parse(fs.readFileSync(resolvedFile, 'utf8'));

    validateCoreColorTokens(tokens, resolvedFile);
    return resolvedFile;
}

if (require.main === module) {
    const sourceFile = process.argv[2] || DEFAULT_CORE_COLORS_FILE;

    try {
        const validatedFile = validateCoreColorFile(sourceFile);
        console.log(`Core colors are opaque: ${validatedFile}`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}

module.exports = {
    CoreColorValidationError,
    collectCoreColorViolations,
    validateCoreColorFile,
    validateCoreColorTokens,
    validateOpaqueColorValue,
};
