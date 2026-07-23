import React from 'react';
import {StoryPageHeader} from '../components/StoryPageHeader';
import './RadiusTokens.stories.scss';

const coreTokens = ['3', '6', '8', '10', '12', '16', '20', '24', '30', 'pill'];

const semanticTokens = [
    ['button', 'Button'],
    ['input', 'Input'],
    ['control', 'Control'],
    ['badge', 'Badge'],
    ['card', 'Card'],
    ['card-s', 'Card small'],
    ['modal', 'Modal'],
    ['tooltip', 'Tooltip'],
    ['table-row', 'Table row'],
    ['avatar', 'Avatar'],
];

function readToken(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim() || '—';
}

function RadiusCard({label, token, semantic = false}) {
    const property = `--radius-${token}`;

    return (
        <article className="card">
            <div
                className={`shape ${token}`}
                style={{borderRadius: `var(${property})`}}
            />
            <div className="details">
                {semantic && <span>{label}</span>}
                <code>{property}</code>
                <strong>{readToken(property)}</strong>
            </div>
        </article>
    );
}

function RadiusTokens() {
    return (
        <main className="radius-tokens">
            <StoryPageHeader
                className="hero"
                description="Core radius values and the semantic component roles published for CRM. Radius tokens are fixed values and do not use the responsive scaling engine."
                eyebrow="CRM / Foundations"
                title="Radius tokens"
            />

            <section className="section">
                <div className="section-heading">
                    <div><span>Core</span><h2>Radius scale</h2></div>
                    <p>Fixed primitive values used by semantic radius roles.</p>
                </div>
                <div className="grid">
                    {coreTokens.map((token) => (
                        <RadiusCard key={token} label={token} token={token}/>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <div><span>Semantic</span><h2>Component roles</h2></div>
                    <p>Each role resolves to a value from the core scale.</p>
                </div>
                <div className="grid">
                    {semanticTokens.map(([token, label]) => (
                        <RadiusCard key={token} label={label} semantic token={token}/>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default {
    title: 'CRM Tokens/Foundations',
    component: RadiusTokens,
    parameters: {
        layout: 'fullscreen',
    },
};

export const Radius = {
    render: () => <RadiusTokens/>,
};
