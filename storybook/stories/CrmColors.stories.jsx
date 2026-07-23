import React from 'react';
import crmLightTokens from '../../tokens/color/semantic-CRM/Light.json';
import {CoreColorPalette} from '../components/CoreColorPalette';
import {StoryPageHeader} from '../components/StoryPageHeader';
import './CrmColors.stories.scss';

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

const semanticTokens = flattenSemanticTokens(crmLightTokens);
const semanticGroups = semanticTokens.reduce((groups, token) => {
    groups[token.group] ??= [];
    groups[token.group].push(token);
    return groups;
}, {});

function SharedCoreColors() {
    return (
        <main className="crm-color-tokens">
            <StoryPageHeader
                description="This palette is the shared color layer used by both CRM and PWA semantic tokens."
                eyebrow="Shared foundation"
                title="Core colors"
            />
            <CoreColorPalette/>
        </main>
    );
}

function CrmSemanticColors() {
    return (
        <main className="crm-color-tokens">
            <StoryPageHeader
                description={<>Product-specific color roles from <code>color/semantic-CRM/Light</code>.</>}
                eyebrow="CRM light"
                title="Semantic colors"
            />
            <div className="groups">
                {Object.entries(semanticGroups).map(([group, tokens]) => (
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
    title: 'CRM Tokens/Colors',
    parameters: {
        layout: 'fullscreen',
    },
};

export const CoreColors = {
    name: 'Core colors',
    render: () => <SharedCoreColors/>,
};

export const SemanticColors = {
    name: 'Semantic colors',
    render: () => <CrmSemanticColors/>,
};
