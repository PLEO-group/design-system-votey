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

const icons = getIconList();
const illustrations = getIllustrationList();

function AssetGallery({assets, description, eyebrow, title, type}) {
    const groupedAssets = groupAssetsByCategory(assets);

    return (
        <main className="asset-library">
            <StoryPageHeader
                description={<>{description} <strong>{assets.length} assets</strong> in the current build.</>}
                eyebrow={eyebrow}
                title={title}
            />

            <div className="categories">
                {Object.keys(groupedAssets).sort().map((category) => (
                    <section className="category" key={category}>
                        <header>
                            <h2>{category.replaceAll('/', ' / ')}</h2>
                            <span>{groupedAssets[category].length}</span>
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
            description="Production SVG icons generated for React consumers."
            eyebrow="Assets / React"
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
