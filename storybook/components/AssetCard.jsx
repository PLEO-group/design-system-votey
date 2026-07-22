import React from 'react';
import './AssetCard.css';

export const AssetCard = ({asset}) => {
    const isIcon = asset.type === 'icon';

    return (
        <article className={`asset-card asset-card--${asset.type}`}>
            <div className="asset-card__preview">
                {asset.Component && (
                    <asset.Component aria-hidden="true" focusable="false"/>
                )}
            </div>
            <strong title={asset.name}>{asset.name}</strong>
            <span>{isIcon ? 'Icon' : 'Illustration'}</span>
        </article>
    );
};
