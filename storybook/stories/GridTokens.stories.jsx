import React, {useEffect, useState} from 'react';
import {StoryPageHeader} from '../components/StoryPageHeader';
import gridTokenSource from '../../tokens/grid/angular.json';
import './GridTokens.stories.scss';

const devices = ['mobile', 'tablet', 'desktop'];
const breakpointPreviews = {
    mobile: [
        {
            label: 'Mobile 360',
            width: 360,
            height: 800,
            type: 'phone',
            previewWidth: 120,
        },
        {
            label: 'Mobile 375',
            width: 375,
            height: 812,
            type: 'phone',
            previewWidth: 123,
        },
    ],
    tablet: [
        {
            label: 'Tablet 768',
            width: 768,
            height: 1024,
            type: 'tablet',
            previewWidth: 200,
        },
        {
            label: 'Tablet 1024',
            width: 1024,
            height: 768,
            type: 'tablet',
            previewWidth: 340,
        },
    ],
    desktop: [
        {
            label: 'Laptop 1280',
            width: 1280,
            height: 800,
            type: 'laptop',
            previewWidth: 400,
        },
        {
            label: 'Desktop 1920',
            width: 1920,
            height: 1080,
            type: 'desktop',
            previewWidth: 444,
        },
    ],
};

function formatNumber(value) {
    return Number(value.toFixed(2));
}

function toViewportWidth(value, referenceWidth) {
    return `${formatNumber(value / referenceWidth * 100)}vw`;
}

function toPercentageValue(value, referenceWidth) {
    return formatNumber(value / referenceWidth * 100);
}

function toPixels(value, referenceWidth, viewportWidth) {
    return `${formatNumber(value / referenceWidth * viewportWidth)}px`;
}

function useViewportWidth(device) {
    const [viewportWidth, setViewportWidth] = useState(0);

    useEffect(() => {
        const update = () => setViewportWidth(window.innerWidth);

        update();
        window.addEventListener('resize', update, {passive: true});

        return () => window.removeEventListener('resize', update);
    }, [device]);

    return viewportWidth;
}

function GridMetric({label, property, resolved, value}) {
    return (
        <article className="metric">
            <span>{label}</span>
            <code>{property}</code>
            <strong>{resolved}</strong>
            <small>{value}</small>
        </article>
    );
}

function BreakpointDevice({config, preview, referenceWidth}) {
    const columns = config.columns.value;
    const margin = config.margin.value / referenceWidth * preview.width;
    const marginExtra =
        config['margin-extra'].value / referenceWidth * preview.width;
    const columnGap = config.gutter.value / referenceWidth * preview.width;
    const previewStyle = {
        '--device-width': `${preview.previewWidth}px`,
        '--preview-columns': columns,
        '--preview-margin': toPercentageValue(
            config.margin.value,
            referenceWidth,
        ),
        '--preview-margin-extra': toPercentageValue(
            config['margin-extra'].value,
            referenceWidth,
        ),
        '--preview-column-gap': toPercentageValue(
            config.gutter.value,
            referenceWidth,
        ),
    };

    return (
        <article className="device-card">
            <header>
                <div>
                    <strong>{preview.label}</strong>
                    <span>{preview.width} × {preview.height}px</span>
                </div>
                <code>{columns} columns</code>
            </header>

            <div className="device-stage">
                <div
                    className={`device ${preview.type}`}
                    style={previewStyle}
                >
                    <div
                        className="screen"
                        style={{
                            aspectRatio:
                                `${preview.width} / ${preview.height}`,
                        }}
                    >
                        <i className="extra-guide start" aria-hidden="true"/>
                        <i className="extra-guide end" aria-hidden="true"/>
                        <div className="mini-grid" aria-hidden="true">
                            {Array.from({length: columns}, (_, index) => (
                                <i key={`${preview.label}-column-${index + 1}`}/>
                            ))}
                        </div>
                    </div>
                    <i className="hardware" aria-hidden="true"/>
                </div>
            </div>

            <dl className="device-values">
                <div><dt>Margin</dt><dd>{formatNumber(margin)}px</dd></div>
                <div>
                    <dt>Margin extra</dt>
                    <dd>{formatNumber(marginExtra)}px</dd>
                </div>
                <div><dt>Column gap</dt><dd>{formatNumber(columnGap)}px</dd></div>
                <div><dt>Columns</dt><dd>{columns}</dd></div>
            </dl>
        </article>
    );
}

function GridFoundations({device}) {
    const viewportWidth = useViewportWidth(device);
    const config = gridTokenSource.grid.admin[device];
    const referenceWidth = gridTokenSource.breakpoint[device].value;
    const columns = config.columns.value;
    const margin = config.margin.value;
    const marginExtra = config['margin-extra'].value;
    const gutter = config.gutter.value;
    const columnWidth =
        (viewportWidth -
            2 * margin / referenceWidth * viewportWidth -
            (columns - 1) * gutter / referenceWidth * viewportWidth) /
        columns;
    const marginViewportValue = toViewportWidth(margin, referenceWidth);
    const marginExtraViewportValue = toViewportWidth(marginExtra, referenceWidth);
    const gutterViewportValue = toViewportWidth(gutter, referenceWidth);
    const marginPixelValue = toPixels(margin, referenceWidth, viewportWidth);
    const marginExtraPixelValue = toPixels(
        marginExtra,
        referenceWidth,
        viewportWidth,
    );
    const gutterPixelValue = toPixels(gutter, referenceWidth, viewportWidth);
    const labeledGutterIndex = Math.floor((columns - 1) / 2);
    const gridTemplateColumns = Array.from(
        {length: columns * 2 - 1},
        (_, index) =>
            index % 2 === 0
                ? 'minmax(0, 1fr)'
                : 'var(--grid-column-gap)',
    ).join(' ');
    const gridStyle = {
        '--grid-columns': columns,
        '--grid-margin': marginViewportValue,
        '--grid-margin-extra': marginExtraViewportValue,
        '--grid-column-gap': gutterViewportValue,
    };

    return (
        <main className="grid-tokens" style={gridStyle}>
            <StoryPageHeader
                actions={
                    <dl className="runtime">
                        <div><dt>Device</dt><dd>{device}</dd></div>
                        <div><dt>Viewport</dt><dd>{viewportWidth}px</dd></div>
                        <div><dt>Reference</dt><dd>{referenceWidth}px</dd></div>
                        <div><dt>Columns</dt><dd>{columns}</dd></div>
                    </dl>
                }
                className="hero"
                description="The CRM layout grid is generated from grid.admin tokens and device breakpoints. Change the device context and viewport in the Storybook toolbar to inspect every variant."
                eyebrow="CRM / Foundations"
                title="Grid system"
            />

            <aside className="notice">
                The preview mirrors the production variables generated for
                <code> body[data-device=&quot;{device}&quot;]</code> directly from the
                source tokens. The legend and guides belong only to Storybook.
            </aside>

            <section className="section">
                <div className="section-heading">
                    <div><span>Live preview</span><h2>{columns}-column grid</h2></div>
                    <p>Outer tinted areas represent the responsive page margins.</p>
                </div>

                <div className="legend" aria-label="Grid legend">
                    <article>
                        <i className="swatch margin"/>
                        <div>
                            <strong>Margin</strong>
                            <span>{marginPixelValue} · {marginViewportValue}</span>
                        </div>
                    </article>
                    <article>
                        <i className="swatch margin-extra"/>
                        <div>
                            <strong>Margin extra</strong>
                            <span>{marginExtraPixelValue} · {marginExtraViewportValue}</span>
                        </div>
                    </article>
                    <article>
                        <i className="swatch column"/>
                        <div>
                            <strong>Columns</strong>
                            <span>{columns} × {formatNumber(columnWidth)}px</span>
                        </div>
                    </article>
                    <article>
                        <i className="swatch gutter"/>
                        <div>
                            <strong>Gutter</strong>
                            <span>{gutterPixelValue} · {gutterViewportValue}</span>
                        </div>
                    </article>
                    <article>
                        <i className="swatch reference"/>
                        <div>
                            <strong>Reference width</strong>
                            <span>{referenceWidth}px</span>
                        </div>
                    </article>
                </div>

                <div className="viewport">
                    <div className="measurements">
                        <span>Margin {marginPixelValue}</span>
                        <strong>{columns} columns / {columns - 1} gutters</strong>
                        <span>Margin {marginPixelValue}</span>
                    </div>
                    <div className="margin-band start"/>
                    <div className="margin-band end"/>
                    <div className="extra-guide start">
                        <span>margin-extra</span>
                    </div>
                    <div className="extra-guide end">
                        <span>margin-extra</span>
                    </div>
                    <div
                        className="columns"
                        style={{gridTemplateColumns}}
                    >
                        {Array.from({length: columns}, (_, index) => (
                            <React.Fragment key={`grid-track-${index + 1}`}>
                                <div className="column">
                                    <span>{index + 1}</span>
                                </div>
                                {index < columns - 1 && (
                                    <div
                                        className={
                                            index === labeledGutterIndex
                                                ? 'gutter is-labeled'
                                                : 'gutter'
                                        }
                                    >
                                        {index === labeledGutterIndex && (
                                            <span>
                                                <strong>Gutter</strong>
                                                {gutterPixelValue}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section breakpoint-preview">
                <div className="section-heading">
                    <div>
                        <span>Breakpoint preview</span>
                        <h2>{device} reference screens</h2>
                    </div>
                    <p>
                        Device frames preserve screen aspect ratios. Grid
                        margins and column gaps are scaled from the same source
                        tokens as the live preview.
                    </p>
                </div>

                <div className="device-pair">
                    {breakpointPreviews[device].map((preview) => (
                        <BreakpointDevice
                            config={config}
                            key={preview.label}
                            preview={preview}
                            referenceWidth={referenceWidth}
                        />
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <div><span>Current values</span><h2>Generated CSS contract</h2></div>
                    <p>Pixel values are resolved against the current Storybook viewport.</p>
                </div>

                <div className="metrics">
                    <GridMetric
                        label="Columns"
                        property="--grid-columns"
                        resolved={columns}
                        value={`${columns}`}
                    />
                    <GridMetric
                        label="Margin"
                        property="--grid-margin"
                        resolved={marginPixelValue}
                        value={marginViewportValue}
                    />
                    <GridMetric
                        label="Margin extra"
                        property="--grid-margin-extra"
                        resolved={marginExtraPixelValue}
                        value={marginExtraViewportValue}
                    />
                    <GridMetric
                        label="Column gap"
                        property="--grid-column-gap"
                        resolved={gutterPixelValue}
                        value={gutterViewportValue}
                    />
                    <GridMetric
                        label="Column width"
                        property="--grid-column-width"
                        resolved={`${formatNumber(columnWidth)}px`}
                        value="Calculated"
                    />
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <div><span>Source tokens</span><h2>Admin grid variants</h2></div>
                    <p>Token names remain aligned with the angular-design-system schema.</p>
                </div>

                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Breakpoint</th>
                                <th>Columns</th>
                                <th>Margin</th>
                                <th>Margin extra</th>
                                <th>Gutter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((variant) => {
                                const variantConfig = gridTokenSource.grid.admin[variant];

                                return (
                                    <tr className={variant === device ? 'is-active' : ''} key={variant}>
                                        <th>{variant}</th>
                                        <td>{gridTokenSource.breakpoint[variant].value}px</td>
                                        <td>{variantConfig.columns.value}</td>
                                        <td>{variantConfig.margin.value}px</td>
                                        <td>{variantConfig['margin-extra'].value}px</td>
                                        <td>{variantConfig.gutter.value}px</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default {
    title: 'CRM Tokens/Foundations',
    component: GridFoundations,
    parameters: {
        layout: 'fullscreen',
    },
};

export const GridSystem = {
    name: 'Grid system',
    render: (_args, context) => (
        <GridFoundations device={context.globals.device || 'desktop'}/>
    ),
};
