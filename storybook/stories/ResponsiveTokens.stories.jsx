import React, {useEffect, useState} from 'react';
import {StoryPageHeader} from '../components/StoryPageHeader';
import responsiveEngineSource from '../../styles/angular/_responsive-token-engine.scss?raw';
import './ResponsiveTokens.stories.css';

const typographyRoles = [
    ['h1', 'Heading 1'],
    ['h2', 'Heading 2'],
    ['h3', 'Heading 3'],
    ['h4', 'Heading 4'],
    ['h5', 'Heading 5'],
    ['body-l', 'Body large'],
    ['body', 'Body'],
    ['body-s', 'Body small'],
    ['button', 'Button'],
    ['label', 'Label'],
    ['caption', 'Caption'],
    ['caption-s', 'Caption small'],
    ['table-header', 'Table header'],
    ['micro', 'Micro'],
];

const spacingTokens = [
    'page-margin',
    'section-gap',
    'card-padding',
    'card-gap',
    'stack-gap-l',
    'stack-gap-m',
    'stack-gap-s',
    'control-padding-x',
    'control-padding-y',
    'table-row-padding-y',
    'icon-gap',
];

const referenceWidths = [360, 375, 768, 1024, 1280, 1920];

const deviceMultipliers = ['mobile', 'tablet', 'desktop'].reduce((multipliers, device) => {
    const match = responsiveEngineSource.match(
        new RegExp(`\\$multiplier-${device}:\\s*([\\d.]+)`),
    );
    multipliers[device] = match ? Number(match[1]) : null;
    return multipliers;
}, {});

function useViewportSnapshot(device) {
    const [snapshot, setSnapshot] = useState({width: 0, orientation: 'vertical'});

    useEffect(() => {
        const update = () => {
            setSnapshot({
                width: window.innerWidth,
                orientation: document.body.dataset.orientation || 'vertical',
            });
        };

        update();
        window.addEventListener('resize', update, {passive: true});
        return () => window.removeEventListener('resize', update);
    }, [device]);

    return snapshot;
}

function readToken(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim() || '—';
}

function formatPixels(value) {
    return `${Number(value.toFixed(2))}px`;
}

function resolveLength(rawValue, viewportWidth) {
    const pixels = rawValue.match(/^(-?[\d.]+)px$/);
    if (pixels) {
        return formatPixels(Number(pixels[1]));
    }

    const calculation = rawValue.match(
        /^calc\(\s*(-?[\d.]+)vw\s*([+-])\s*([\d.]+)px\s*\)$/,
    );
    if (!calculation || !viewportWidth) {
        return '—';
    }

    const viewportPart = Number(calculation[1]) * viewportWidth / 100;
    const pixelPart = Number(calculation[3]);
    return formatPixels(
        calculation[2] === '+' ? viewportPart + pixelPart : viewportPart - pixelPart,
    );
}

function getLengthValue(name, viewportWidth) {
    const raw = readToken(name);
    return {raw, resolved: resolveLength(raw, viewportWidth)};
}

function TypographySpecimen({label, role, viewportWidth}) {
    const prefix = `--typo-${role}`;
    const fontSize = getLengthValue(`${prefix}-font-size`, viewportWidth);
    const lineHeight = getLengthValue(`${prefix}-line-height`, viewportWidth);
    const style = {
        fontSize: `var(${prefix}-font-size)`,
        fontWeight: `var(${prefix}-font-weight)`,
        letterSpacing: `var(${prefix}-letter-spacing)`,
        lineHeight: `var(${prefix}-line-height)`,
    };

    return (
        <div className="responsive-tokens__type-row">
            <div>
                <strong>{label}</strong>
                <code>{prefix}-*</code>
            </div>
            <p style={style}>Zażółć gęślą jaźń — Design System Votey</p>
            <dl className="responsive-tokens__computed-values">
                <div>
                    <dt>font-size</dt>
                    <dd><code>{fontSize.raw}</code><strong>{fontSize.resolved}</strong></dd>
                </div>
                <div>
                    <dt>line-height</dt>
                    <dd><code>{lineHeight.raw}</code><strong>{lineHeight.resolved}</strong></dd>
                </div>
            </dl>
        </div>
    );
}

function ResponsiveFoundations({device}) {
    const snapshot = useViewportSnapshot(device);

    return (
        <main className="responsive-tokens">
            <StoryPageHeader
                actions={<dl className="responsive-tokens__runtime">
                    <div><dt>data-device</dt><dd>{device}</dd></div>
                    <div><dt>viewport</dt><dd>{snapshot.width}px</dd></div>
                    <div><dt>orientation</dt><dd>{snapshot.orientation}</dd></div>
                    <div><dt>multiplier</dt><dd>{deviceMultipliers[device]}×</dd></div>
                    <div><dt>--vh</dt><dd>{readToken('--vh')}</dd></div>
                </dl>}
                className="responsive-tokens__hero"
                description="Change the device context in the Storybook toolbar and use the viewport toolbar to inspect interpolation between the six Figma reference widths."
                eyebrow="CRM / Angular"
                title="Responsive token preview"
            />

            <aside className="responsive-tokens__notice">
                Storybook manually mirrors the DOM contract. In CRM the same attributes are managed by
                <code> provideVoteyDeviceDetection()</code> from
                <code> @pleodigital/design-system-votey/angular</code>.
            </aside>

            <section className="responsive-tokens__section">
                <div className="responsive-tokens__section-heading">
                    <div><span>Scaling inputs</span><h2>Figma reference widths</h2></div>
                    <p>Values between points are calculated by the responsive scaling engine.</p>
                </div>
                <div className="responsive-tokens__breakpoints">
                    {referenceWidths.map((width) => <code key={width}>{width}px</code>)}
                </div>
                <h3 className="responsive-tokens__subheading">Device multipliers</h3>
                <div className="responsive-tokens__multipliers">
                    {Object.entries(deviceMultipliers).map(([multiplierDevice, value]) => (
                        <article
                            className={multiplierDevice === device ? 'is-active' : ''}
                            key={multiplierDevice}
                        >
                            <span>{multiplierDevice}</span>
                            <strong>{value}×</strong>
                            {multiplierDevice === device && <small>Current device</small>}
                        </article>
                    ))}
                </div>
            </section>

            <section className="responsive-tokens__section">
                <div className="responsive-tokens__section-heading">
                    <div><span>Typography</span><h2>CRM typography roles</h2></div>
                    <p>CRM font-family token is Open Sans; the Storybook interface remains Satoshi.</p>
                </div>
                <div className="responsive-tokens__type-list">
                    {typographyRoles.map(([role, label]) => (
                        <TypographySpecimen
                            key={role}
                            label={label}
                            role={role}
                            viewportWidth={snapshot.width}
                        />
                    ))}
                </div>
            </section>

            <section className="responsive-tokens__section">
                <div className="responsive-tokens__section-heading">
                    <div><span>Spacing</span><h2>Semantic layout spacing</h2></div>
                    <p>Bars show the currently computed CSS value.</p>
                </div>
                <div className="responsive-tokens__spacing-grid">
                    {spacingTokens.map((token) => (
                        <div className="responsive-tokens__space" key={token}>
                            <div className="responsive-tokens__space-heading">
                                <code>--space-{token}</code>
                                <strong>{getLengthValue(`--space-${token}`, snapshot.width).resolved}</strong>
                            </div>
                            <div className="responsive-tokens__space-bar">
                                <i style={{width: `var(--space-${token})`}}/>
                            </div>
                            <code className="responsive-tokens__formula">
                                {getLengthValue(`--space-${token}`, snapshot.width).raw}
                            </code>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}

export default {
    title: 'CRM Tokens/Foundations',
    component: ResponsiveFoundations,
    parameters: {
        layout: 'fullscreen',
    },
};

export const Overview = {
    name: 'Responsive tokens',
    render: (_args, context) => (
        <ResponsiveFoundations device={context.globals.device || 'desktop'}/>
    ),
};
