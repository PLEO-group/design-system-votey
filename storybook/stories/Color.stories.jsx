import React from 'react';
import {ColorSwatch} from '../components/ColorSwatch';
import sourceTokens from '../../tokens/base/colors.json';
import {ALL_SHADES, createShade, mapTokens} from "../utils";

export default {
    title: 'Tokens/Colors',
    component: ColorSwatch,
};



const flattenTokens = (obj, prefix = '') => {
    let tokens = [];

    for (const key in obj) {
        if (obj[key].value && obj[key].type === 'color') {
            const rawCssName = `${prefix}${key}`;
            const name = `--${rawCssName.replace(/\./g, '-')}`;

            tokens.push({
                name: name,
                value: obj[key].value,
            });

        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            tokens = tokens.concat(flattenTokens(obj[key], prefix + key + '-'));
        }
    }

    // 🚨 KROK 1: Sortowanie alfabetyczne (grupowanie)
    tokens.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // 🚨 KROK 2: Sortowanie liczbowe wewnątrz grup (odcienie)
    tokens.sort((a, b) => {

        // Funkcja pomocnicza do ekstrakcji liczby odcienia z nazwy
        const extractShadeNumber = (tokenName) => {
            // Szukamy liczby na końcu nazwy tokenu po ostatnim myślniku
            // np. --color-mint-70 -> 70, --color-gray-500 -> 500, --color-red-100 -> 100
            const parts = tokenName.split('-');
            const lastPart = parts[parts.length - 1];

            // Konwertujemy na liczbę całkowitą (np. '100' -> 100, '50' -> 50)
            const number = parseInt(lastPart, 10);

            // Zwracamy liczbę, a jeśli to nie jest odcień liczbowy (np. 'white'), zwracamy 0,
            // ale musimy uważać, by nie kolidowało to z prawdziwym odcieniem 0.
            // Dla bezpieczeństwa, dla niestandardowych nazw (np. 'primary') możemy użyć bardzo dużej liczby
            return isNaN(number) ? Infinity : number;
        };

        const shadeA = extractShadeNumber(a.name);
        const shadeB = extractShadeNumber(b.name);

        // Jeśli odcienie są różne (np. 100 vs 50), sortujemy je liczbowo
        if (shadeA !== shadeB) {
            return shadeA - shadeB;
        }

        // Jeśli odcienie są takie same (lub oba są Infinity/niestandardowe),
        // wracamy do sortowania alfabetycznego (które już zostało wykonane w kroku 1).
        // W praktyce w tym punkcie sortowanie jest już stabilne.
        // Jeśli jednak chcemy zapewnić, że np. 'color-gray-100' i 'color-red-100' będą
        // we właściwej grupie, sortowanie alfabetyczne musi być na samym początku.

        // Najlepsze jest połączenie sortowania:
        // 1. Sortuj alfabetycznie według pełnej nazwy grupy (np. 'navy-blue', 'red')
        const groupA = a.name.substring(0, a.name.lastIndexOf('-'));
        const groupB = b.name.substring(0, b.name.lastIndexOf('-'));

        // Jeśli są w tej samej grupie (np. oba są 'navy-blue-'), sortujemy numerycznie
        if (groupA === groupB) {
            return shadeA - shadeB;
        } else {
            // W przeciwnym razie, sortujemy alfabetycznie według grupy
            return groupA.localeCompare(groupB);
        }
    });

    return tokens;
};

const groupTokensByBaseColor = (flatTokens) => {
    const grouped = {};

    flatTokens.forEach(token => {
        const nameWithoutPrefix = token.name.replace(/^--color-/, '');
        const parts = nameWithoutPrefix.split('-');
        let groupKey = parts[0];
        if (parts.length > 1 && isNaN(parseInt(parts[1]))) {
            groupKey = parts[0] + '-' + parts[1];
        }

        if (!grouped[groupKey]) {
            grouped[groupKey] = [];
        }

        grouped[groupKey].push(token);
    });

    return grouped;
};


const createShadeGrid = (groupName, definedTokens) => {
    const tokenMap = mapTokens(definedTokens);

    return ALL_SHADES.map(shade => {
        return createShade(tokenMap, groupName, shade)
    });
};

const ColorRow = ({ groupName, tokens }) => {
    const gridTokens = createShadeGrid(groupName, tokens);
    const fullPrefix = `--color-${groupName}-`;
    return (
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <h3>{fullPrefix}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '10px' }}>
                {gridTokens.map(token => (
                    <div key={token.name} style={{ flexShrink: 0, margin: '0 5px' }}>
                        <ColorSwatch token={token} />
                    </div>
                ))}
            </div>
        </div>
    );
};


export const Palette = {
    render: () => {
        const flatTokens = flattenTokens(sourceTokens.color || sourceTokens.colors, 'color-');
        const groupedTokens = groupTokensByBaseColor(flatTokens);
        return (
            <div>
                {Object.keys(groupedTokens).sort().map(groupName => (
                    <ColorRow
                        key={groupName}
                        groupName={groupName}
                        tokens={groupedTokens[groupName]}
                    />
                ))}
            </div>
        );
    },
    name: 'Design System | Color Tokens from FIGMA',
};
