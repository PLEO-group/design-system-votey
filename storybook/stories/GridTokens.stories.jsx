import React, {useEffect, useState} from 'react';
import {StoryPageHeader} from '../components/StoryPageHeader';
import gridTokenSource from '../../tokens/grid/angular.json';
import './GridTokens.stories.scss';

const breakpointOrder = [
    'mobile-small', 'mobile', 'tablet-small', 'tablet', 'laptop', 'desktop',
];
const breakpointPreviews = {
    mobile: [
        {
            label: 'Mobile 360',
            breakpoint: 'mobile-small',
            width: 360,
            height: 800,
            type: 'phone',
            previewWidth: 120,
        },
        {
            label: 'Mobile 375',
            breakpoint: 'mobile',
            width: 375,
            height: 812,
            type: 'phone',
            previewWidth: 123,
        },
    ],
    tablet: [
        {
            label: 'Tablet 768',
            breakpoint: 'tablet-small',
            width: 768,
            height: 1024,
            type: 'tablet',
            previewWidth: 200,
        },
        {
            label: 'Tablet 1024',
            breakpoint: 'tablet',
            width: 1024,
            height: 768,
            type: 'tablet',
            previewWidth: 340,
        },
    ],
    desktop: [
        {
            label: 'Laptop 1280',
            breakpoint: 'laptop',
            width: 1280,
            height: 800,
            type: 'laptop',
            previewWidth: 400,
        },
        {
            label: 'Desktop 1920',
            breakpoint: 'desktop',
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

function toPercentageValue(value, referenceWidth) {
    return formatNumber(value / referenceWidth * 100);
}

function gridValue(breakpoint, field) {
    return gridTokenSource.grid.admin.breakpoints[breakpoint][field].value;
}

function interpolatedGridValue(field, viewportWidth) {
    const first = breakpointOrder[0];
    if (viewportWidth <= gridTokenSource.breakpoint[first].value) {
        return gridValue(first, field);
    }

    for (let index = 0; index < breakpointOrder.length - 1; index += 1) {
        const from = breakpointOrder[index];
        const to = breakpointOrder[index + 1];
        const fromWidth = gridTokenSource.breakpoint[from].value;
        const toWidth = gridTokenSource.breakpoint[to].value;

        if (viewportWidth < toWidth) {
            const progress = (viewportWidth - fromWidth) / (toWidth - fromWidth);
            return gridValue(from, field) +
                progress * (gridValue(to, field) - gridValue(from, field));
        }
    }

    return gridValue(breakpointOrder[breakpointOrder.length - 1], field);
}

function steppedSidebarValue(field, viewportWidth) {
    const breakpoint = [...breakpointOrder].reverse().find(
        (name) => viewportWidth >= gridTokenSource.breakpoint[name].value,
    ) || breakpointOrder[0];
    return gridValue(breakpoint, field);
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

function BreakpointDevice({columns, preview}) {
    const margin = gridValue(preview.breakpoint, 'margin');
    const columnGap = gridValue(preview.breakpoint, 'gutter');
    const sidebarCollapsed = gridValue(preview.breakpoint, 'sidebar-collapsed');
    const sidebarExpanded = gridValue(preview.breakpoint, 'sidebar-expanded');
    const previewStyle = {
        '--device-width': `${preview.previewWidth}px`,
        '--preview-columns': columns,
        '--preview-margin': toPercentageValue(margin, preview.width),
        '--preview-sidebar': toPercentageValue(sidebarExpanded, preview.width),
        '--preview-column-gap': toPercentageValue(columnGap, preview.width),
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
                        <i className="sidebar-band" aria-hidden="true"/>
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
                <div><dt>Column gap</dt><dd>{formatNumber(columnGap)}px</dd></div>
                <div><dt>Columns</dt><dd>{columns}</dd></div>
                <div><dt>Sidebar collapsed</dt><dd>{sidebarCollapsed}px</dd></div>
                <div><dt>Sidebar expanded</dt><dd>{sidebarExpanded}px</dd></div>
            </dl>
        </article>
    );
}

function GridFoundations({device}) {
    const viewportWidth = useViewportWidth(device);
    const [sidebarState, setSidebarState] = useState('collapsed');
    const columns = gridTokenSource.grid.admin.columns[device].value;
    const margin = interpolatedGridValue('margin', viewportWidth);
    const gutter = interpolatedGridValue('gutter', viewportWidth);
    const sidebarWidth = steppedSidebarValue(`sidebar-${sidebarState}`, viewportWidth);
    const marginPixelValue = `${formatNumber(margin)}px`;
    const gutterPixelValue = `${formatNumber(gutter)}px`;
    const columnWidth =
        (viewportWidth - sidebarWidth - 2 * margin - (columns - 1) * gutter) /
        columns;
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
        '--grid-margin': marginPixelValue,
        '--grid-column-gap': gutterPixelValue,
        '--grid-sidebar-width': `${sidebarWidth}px`,
    };

    return (
        <main className="grid-tokens" style={gridStyle}>
            <StoryPageHeader
                actions={
                    <dl className="runtime">
                        <div><dt>Device</dt><dd>{device}</dd></div>
                        <div><dt>Viewport</dt><dd>{viewportWidth}px</dd></div>
                        <div><dt>Columns</dt><dd>{columns}</dd></div>
                        <div><dt>Sidebar</dt><dd>{sidebarState} · {sidebarWidth}px</dd></div>
                    </dl>
                }
                className="hero"
                description="Columns follow device detection. Margins and gutters interpolate across six viewport references; the sidebar changes at 1024px."
                eyebrow="CRM / Foundations"
                title="Grid system"
            />

            <aside className="notice">
                Choose a device in the toolbar and resize the viewport to inspect
                the generated grid. Sidebar state is independent of device.
            </aside>

            <section className="section">
                <div className="section-heading">
                    <div><span>Live preview</span><h2>{columns}-column grid</h2></div>
                    <p>Margins are symmetric inside the content area after the sidebar.</p>
                </div>

                <div className="legend" aria-label="Grid legend">
                    <article>
                        <i className="swatch margin"/>
                        <div>
                            <strong>Margin</strong>
                            <span>{marginPixelValue}</span>
                        </div>
                    </article>
                    <article>
                        <i className="swatch sidebar"/>
                        <div>
                            <strong>Sidebar</strong>
                            <span>{sidebarState} · {sidebarWidth}px</span>
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
                            <span>{gutterPixelValue}</span>
                        </div>
                    </article>
                </div>

                <button
                    className="sidebar-toggle"
                    onClick={() => setSidebarState(
                        (state) => state === 'collapsed' ? 'expanded' : 'collapsed'
                    )}
                    type="button"
                >
                    Toggle sidebar ({sidebarState})
                </button>
                <div className="viewport">
                    <div className="measurements">
                        <span>Sidebar {sidebarWidth}px + margin {marginPixelValue}</span>
                        <strong>{columns} columns / {columns - 1} gutters</strong>
                        <span>Margin {marginPixelValue}</span>
                    </div>
                    <div className="sidebar-band"/>
                    <div className="margin-band start"/>
                    <div className="margin-band end"/>
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
                        Device frames preserve screen aspect ratios and show
                        the exact grid values at each reference width.
                    </p>
                </div>

                <div className="device-pair">
                    {breakpointPreviews[device].map((preview) => (
                        <BreakpointDevice
                            columns={columns}
                            key={preview.label}
                            preview={preview}
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
                        value="Interpolated by viewport"
                    />
                    <GridMetric
                        label="Sidebar width"
                        property="--grid-sidebar-width"
                        resolved={`${sidebarWidth}px`}
                        value={sidebarState}
                    />
                    <GridMetric
                        label="Column gap"
                        property="--grid-column-gap"
                        resolved={gutterPixelValue}
                        value="Interpolated by viewport"
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
                    <p>Votey CRM uses a separate grid contract from BoxEs.</p>
                </div>

                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Breakpoint</th>
                                <th>Width</th>
                                <th>Columns</th>
                                <th>Margin</th>
                                <th>Gutter</th>
                                <th>Sidebar collapsed</th>
                                <th>Sidebar expanded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {breakpointOrder.map((breakpoint) => {
                                const referenceDevice = breakpoint.startsWith('mobile')
                                    ? 'mobile'
                                    : breakpoint.startsWith('tablet')
                                        ? 'tablet'
                                        : 'desktop';

                                return (
                                    <tr className={referenceDevice === device ? 'is-active' : ''} key={breakpoint}>
                                        <th>{breakpoint}</th>
                                        <td>{gridTokenSource.breakpoint[breakpoint].value}px</td>
                                        <td>{gridTokenSource.grid.admin.columns[referenceDevice].value}</td>
                                        <td>{gridValue(breakpoint, 'margin')}px</td>
                                        <td>{gridValue(breakpoint, 'gutter')}px</td>
                                        <td>{gridValue(breakpoint, 'sidebar-collapsed')}px</td>
                                        <td>{gridValue(breakpoint, 'sidebar-expanded')}px</td>
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
