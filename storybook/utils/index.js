import React from "react";

export function createShade(tokenMap, groupName, shade, createPlaceholders=true) {
    if (tokenMap[shade]) {
        // 🚨 TOKEN ISTNIEJE: Dodajemy pole 'shade'
        return { ...tokenMap[shade], shade: shade };
    } else {
        // 🚨 PLACEHOLDER: Używamy numeru odcienia jako głównego tekstu
        if(createPlaceholders) {
            return {
                name: `${groupName}-${shade} (Brak)`,
                value: '',
                isPlaceholder: true,
                shade: shade
            };
        }
    }
}

export function mapTokens(tokens){
    return tokens.reduce((acc, token) => {
        // Nazwa odcienia to ostatni człon nazwy tokenu (np. "100")
        const shade = token.name.substring(token.name.lastIndexOf('-') + 1);
        acc[shade] = token;
        return acc;
    }, {});
}

export const ALL_SHADES = [
    '25', '50', '70', '100', '200', '300',
    '400', '500', '600', '700', '800', '900',
    '1000', '1100', '1200','1300','1400','1500',
    '1600','1700','1800','1900'
];
