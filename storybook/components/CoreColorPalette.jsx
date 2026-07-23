import React from 'react';
import sourceTokens from '../../tokens/base/colors.json';
import {ALL_SHADES, createShade, mapTokens} from '../utils';
import './CoreColorPalette.scss';

function flattenTokens(object, prefix = '') {
    let tokens = [];

    Object.entries(object).forEach(([key, token]) => {
        if (token.value && token.type === 'color') {
            tokens.push({
                name: `--${`${prefix}${key}`.replace(/\./g, '-')}`,
                value: token.value,
            });
        } else if (typeof token === 'object' && token !== null) {
            tokens = tokens.concat(flattenTokens(token, `${prefix}${key}-`));
        }
    });

    return tokens.sort((first, second) => {
        const firstGroup = first.name.substring(0, first.name.lastIndexOf('-'));
        const secondGroup = second.name.substring(0, second.name.lastIndexOf('-'));
        const firstShade = Number.parseInt(first.name.split('-').at(-1), 10);
        const secondShade = Number.parseInt(second.name.split('-').at(-1), 10);

        if (firstGroup === secondGroup && !Number.isNaN(firstShade) && !Number.isNaN(secondShade)) {
            return firstShade - secondShade;
        }

        return first.name.localeCompare(second.name);
    });
}

function groupTokensByBaseColor(tokens) {
    return tokens.reduce((groups, token) => {
        const parts = token.name.replace(/^--color-/, '').split('-');
        const group = parts.length > 1 && Number.isNaN(Number.parseInt(parts[1], 10))
            ? `${parts[0]}-${parts[1]}`
            : parts[0];

        groups[group] ??= [];
        groups[group].push(token);
        return groups;
    }, {});
}

function ColorRow({groupName, tokens}) {
    const tokenMap = mapTokens(tokens);
    const hasNumericShades = tokens.some((token) => /^\d+$/.test(token.shade || token.name.split('-').at(-1)));
    const shades = hasNumericShades
        ? ALL_SHADES.map((shade) => createShade(tokenMap, groupName, shade)).filter(Boolean)
        : tokens.map((token) => ({...token, shade: token.name.replace(/^--color-/, '')}));

    return (
        <section className="group">
            <h2>{groupName.replaceAll('-', ' ')}</h2>
            <div className="grid">
                {shades.map((token) => (
                    <article
                        className={`card${token.isPlaceholder ? ' empty' : ''}`}
                        key={token.name}
                    >
                        <div
                            className="swatch"
                            style={token.isPlaceholder ? undefined : {backgroundColor: token.value}}
                        />
                        <strong>{token.name}</strong>
                        <code>{token.value || 'Not defined'}</code>
                    </article>
                ))}
            </div>
        </section>
    );
}

export function CoreColorPalette() {
    const tokens = flattenTokens(sourceTokens.color || sourceTokens.colors, 'color-');
    const groups = groupTokensByBaseColor(tokens);

    return (
        <div className="core-color-palette">
            {Object.keys(groups).sort().map((groupName) => (
                <ColorRow key={groupName} groupName={groupName} tokens={groups[groupName]}/>
            ))}
        </div>
    );
}
