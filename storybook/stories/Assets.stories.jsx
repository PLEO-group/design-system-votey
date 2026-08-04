import React from 'react';
import {AssetCard} from '../components/AssetCard';
import {StoryPageHeader} from '../components/StoryPageHeader';
import {getIconList, getIllustrationList} from '../utils/assetLoader';
import './Assets.stories.scss';

export default {
    title: 'Assets/Library',
    component: AssetCard,
    parameters: {
        layout: 'fullscreen',
    },
};

function groupAssetsByCategory(assets) {
    return assets.reduce((groups, asset) => {
        const category = asset.category || 'Root';
        groups[category] ??= [];
        groups[category].push(asset);
        groups[category].sort((first, second) => first.name.localeCompare(second.name));
        return groups;
    }, {});
}

function groupUiThickVariants(assets) {
    const assetsByRegistryName = new Map(
        assets.map((asset) => [asset.angularRegistryName, asset])
    );

    return assets.flatMap((asset) => {
        if (asset.category !== 'ui') {
            return asset;
        }

        if (asset.angularRegistryName.endsWith('-thick')) {
            const baseName = asset.angularRegistryName.replace(/-thick$/, '');
            return assetsByRegistryName.has(baseName) ? [] : asset;
        }

        const thickVariant = assetsByRegistryName.get(
            `${asset.angularRegistryName}-thick`
        );

        return thickVariant
            ? {...asset, variants: [asset, thickVariant]}
            : asset;
    });
}

function countAssets(assets) {
    return assets.reduce(
        (count, asset) => count + (asset.variants?.length ?? 1),
        0
    );
}

const icons = groupUiThickVariants(getIconList());
const illustrations = getIllustrationList();

const contextLabels = {
    background: 'Background',
    info: 'Info',
    logotypes: 'Logotypes',
    menu: 'Menu',
    simple: 'Simple',
    special: 'Special',
    spot: 'Spot',
    ui: 'UI',
};

const illustrationGroupsByCategory = {
    background: [
        {
            title: 'Event type',
            names: [
                'bg-event-type-basic',
                'bg-event-type-general-meeting',
            ],
        },
        {
            title: 'Participant gender',
            names: [
                'bg-participant-man',
                'bg-participant-woman',
            ],
        },
        {
            title: 'Participant access',
            names: [
                'bg-participant-first-time-v2',
                'bg-participant-first-time',
                'bg-participant-everyone',
                'bg-participant-first-group',
            ],
        },
        {
            title: 'Participant type',
            names: [
                'bg-participant-type-voter',
                'bg-participant-type-observer',
            ],
        },
        {
            title: 'Voting participation',
            names: [
                'bg-vote-yourself',
                'bg-vote-as-proxy',
            ],
        },
        {
            title: 'Voting status',
            names: [
                'bg-voting-started',
                'bg-voting-ended',
            ],
        },
        {
            title: 'Voting type',
            names: [
                'bg-voting-type-yes-no',
                'bg-voting-type-survey',
            ],
        },
    ],
    simple: [
        {
            title: 'Anonymity',
            names: ['simple-anonymity-on', 'simple-anonymity-off'],
        },
        {
            title: 'Theme',
            names: ['simple-theme-light', 'simple-theme-dark'],
        },
    ],
    spot: [
        {
            title: 'Add participants',
            names: [
                'spot-add-participants-email',
                'spot-add-participants-public-access',
                'spot-add-participants-sms',
                'spot-add-participants-unique-codes',
            ],
        },
        {
            title: 'Agenda visibility',
            names: [
                'spot-agenda-visibility-on',
                'spot-agenda-visibility-off',
                'spot-agenda-visibility-off-v2',
            ],
        },
        {
            title: 'Answer method',
            names: [
                'spot-answer-method-multiple',
                'spot-answer-method-open-ended',
                'spot-answer-method-point-system',
                'spot-answer-method-single',
            ],
        },
        {
            title: 'Chat',
            names: ['spot-chat-on', 'spot-chat-off'],
        },
        {
            title: 'Forum',
            names: ['spot-forum-on', 'spot-forum-off'],
        },
        {
            title: 'Proxy',
            names: ['spot-proxy-on', 'spot-proxy-off'],
        },
        {
            title: 'Report PDF',
            names: ['spot-report-pdf-on', 'spot-report-pdf-off'],
        },
        {
            title: 'Report PDF · V2',
            names: ['spot-report-pdf-on-v2', 'spot-report-pdf-off-v2'],
        },
        {
            title: 'Results',
            names: ['spot-results-on', 'spot-results-off'],
        },
        {
            title: 'Videoconference',
            names: ['spot-videoconference-on', 'spot-videoconference-off'],
        },
        {
            title: 'Visibility',
            names: ['spot-visibility-on', 'spot-visibility-off'],
        },
        {
            title: 'Voting',
            names: ['spot-voting-on', 'spot-voting-off'],
        },
        {
            title: 'Voting editing',
            names: [
                'spot-voting-editing-on',
                'spot-voting-editing-off',
                'spot-voting-editing-off-v2',
            ],
        },
        {
            title: 'Voting start',
            names: [
                'spot-voting-start-automatic',
                'spot-voting-start-manual',
            ],
        },
    ],
};

function groupRelatedIllustrations(assets, category) {
    const remainingAssets = new Map(
        assets.map((asset) => [asset.angularRegistryName, asset])
    );
    const groups = (illustrationGroupsByCategory[category] ?? []).flatMap((group) => {
        const groupedAssets = group.names.map((name) => remainingAssets.get(name));

        if (groupedAssets.some((asset) => !asset)) {
            return [];
        }

        group.names.forEach((name) => remainingAssets.delete(name));

        return [{...group, assets: groupedAssets}];
    });

    return {
        groups,
        remaining: [...remainingAssets.values()],
    };
}

function AssetGrid({assets, category, type}) {
    return (
        <div className={`grid ${type}${category === 'info' ? ' info' : ''}`}>
            {assets.map((asset) => (
                <AssetCard asset={asset} key={asset.name}/>
            ))}
        </div>
    );
}

function IllustrationSubsections({assets, category}) {
    const {groups, remaining} = groupRelatedIllustrations(assets, category);

    if (groups.length === 0) {
        return (
            <AssetGrid
                assets={assets}
                category={category}
                type="illustration"
            />
        );
    }

    return (
        <div className="illustration-subsections">
            {groups.map((group) => (
                <section className="illustration-subsection group" key={group.title}>
                    <header>
                        <div>
                            <span>Group</span>
                            <h3>{group.title}</h3>
                        </div>
                        <strong>{countAssets(group.assets)}</strong>
                    </header>
                    <AssetGrid
                        assets={group.assets}
                        category={category}
                        type="illustration"
                    />
                </section>
            ))}
            {remaining.length > 0 && (
                <section className="illustration-subsection">
                    <header>
                        <div>
                            <span>Collection</span>
                            <h3>Other illustrations</h3>
                        </div>
                        <strong>{countAssets(remaining)}</strong>
                    </header>
                    <AssetGrid
                        assets={remaining}
                        category={category}
                        type="illustration"
                    />
                </section>
            )}
        </div>
    );
}

function AssetGallery({assets, description, eyebrow, title, type}) {
    const groupedAssets = groupAssetsByCategory(assets);

    return (
        <main className="asset-library">
            <StoryPageHeader
                description={<>{description} <strong>{countAssets(assets)} assets</strong> in the current build.</>}
                eyebrow={eyebrow}
                title={title}
            />

            <div className="categories">
                {Object.keys(groupedAssets).sort().map((category) => (
                    <section className="category" key={category}>
                        <header>
                            <div>
                                {type === 'icon' && <span>Context</span>}
                                <h2>
                                    {contextLabels[category] ?? category.replaceAll('/', ' / ')}
                                </h2>
                            </div>
                            <strong>{countAssets(groupedAssets[category])}</strong>
                        </header>
                        {type === 'illustration' ? (
                            <IllustrationSubsections
                                assets={groupedAssets[category]}
                                category={category}
                            />
                        ) : (
                            <AssetGrid
                                assets={groupedAssets[category]}
                                category={category}
                                type={type}
                            />
                        )}
                    </section>
                ))}
            </div>
        </main>
    );
}

export const IconsGallery = {
    name: 'Icon library',
    render: () => (
        <AssetGallery
            assets={icons}
            description="Source SVG previews with names for React and Angular consumers."
            eyebrow="Assets / Icons"
            title="Icon library"
            type="icon"
        />
    ),
};

export const IllustrationsGallery = {
    name: 'Illustration library',
    render: () => (
        <AssetGallery
            assets={illustrations}
            description="Production illustrations with names for React and Angular consumers, grouped by source category."
            eyebrow="Assets / Illustrations"
            title="Illustration library"
            type="illustration"
        />
    ),
};
