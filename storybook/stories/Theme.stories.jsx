import React, {useEffect} from 'react';
import {useArgs} from '@storybook/preview-api';
import lightTokens from '../../tokens/light.json';
import darkTokens from '../../tokens/dark.json';
import {StoryPageHeader} from '../components/StoryPageHeader';
import '../../dist/css/tokens.css';
import '../../dist/css/tokens.light.css';
import '../../dist/css/tokens.dark.css';
import './PwaColors.stories.scss';

function flattenSemanticTokens(object, path = []) {
    return Object.entries(object).flatMap(([key, token]) => {
        const tokenPath = [...path, key];

        if (token.value && token.type === 'color') {
            return [{
                alias: token.value,
                group: tokenPath[0],
                name: `--color-${tokenPath.join('-')}`,
            }];
        }

        return typeof token === 'object' && token !== null
            ? flattenSemanticTokens(token, tokenPath)
            : [];
    });
}

function groupTokens(tokens) {
    return tokens.reduce((groups, token) => {
        groups[token.group] ??= [];
        groups[token.group].push(token);
        return groups;
    }, {});
}

function PwaSemanticColors({theme, onThemeChange}) {
    const source = theme === 'dark' ? darkTokens : lightTokens;
    const groups = groupTokens(flattenSemanticTokens(source.color));

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        return () => document.documentElement.removeAttribute('data-theme');
    }, [theme]);

    return (
        <main className="pwa-color-tokens">
            <StoryPageHeader
                actions={<div className="theme-switch" aria-label="Theme">
                    {['light', 'dark'].map((option) => (
                        <button
                            aria-pressed={theme === option}
                            key={option}
                            onClick={() => onThemeChange(option)}
                            type="button"
                        >
                            {option}
                        </button>
                    ))}
                </div>}
                description="Product-specific color roles with synchronized light and dark modes."
                eyebrow={`PWA ${theme}`}
                title="Semantic colors"
            />

            <div className="groups">
                {Object.entries(groups).map(([group, tokens]) => (
                    <section className="group" key={group}>
                        <h2>{group}</h2>
                        <div className="grid">
                            {tokens.map((token) => (
                                <article className="card" key={token.name}>
                                    <div
                                        className="swatch"
                                        style={{backgroundColor: `var(${token.name})`}}
                                    />
                                    <strong>{token.name}</strong>
                                    <code>{token.alias}</code>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}

export default {
    title: 'PWA Tokens/Colors',
    component: PwaSemanticColors,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: {type: 'inline-radio'},
        },
    },
    args: {
        theme: 'light',
    },
};

export const SemanticColors = {
    name: 'Semantic colors',
    render: function Render() {
        const [{theme}, updateArgs] = useArgs();
        return (
            <PwaSemanticColors
                theme={theme}
                onThemeChange={(nextTheme) => updateArgs({theme: nextTheme})}
            />
        );
    },
};
