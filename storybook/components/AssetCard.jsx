import React from 'react';
import './AssetCard.scss';

export const AssetCard = ({asset}) => {
    const isIcon = asset.type === 'icon';

    return (
        <article className={`asset-card ${asset.type}`}>
            <div className="preview">
                {asset.Component && (
                    <asset.Component aria-hidden="true" focusable="false"/>
                )}
            </div>
            <strong title={asset.name}>{asset.name}</strong>
            <span>{isIcon ? 'Icon' : 'Illustration'}</span>
        </article>
    );
};
