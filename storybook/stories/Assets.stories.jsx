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
    logotypes: 'Logotypes',
    menu: 'Menu',
    special: 'Special',
    ui: 'UI',
};

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
                        <div className={`grid ${type}`}>
                            {groupedAssets[category].map((asset) => (
                                <AssetCard asset={asset} key={asset.name}/>
                            ))}
                        </div>
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
            description="Production illustrations grouped by their source category."
            eyebrow="Assets / React"
            title="Illustration library"
            type="illustration"
        />
    ),
};
