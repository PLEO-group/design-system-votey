import React from 'react';
import './AssetCard.scss';

export const AssetCard = ({asset}) => {
    const isIcon = asset.type === 'icon';
    const variants = asset.variants ?? [asset];
    const hasVariants = variants.length > 1;

    return (
        <article className={`asset-card ${asset.type}${hasVariants ? ' has-variants' : ''}`}>
            <div className={`preview${hasVariants ? ' variants' : ''}`}>
                {isIcon ? variants.map((variant) => (
                    <div className="icon-preview" key={variant.name}>
                        {hasVariants && (
                            <span>
                                {variant.angularRegistryName.endsWith('-thick')
                                    ? 'Thick'
                                    : 'Base'}
                            </span>
                        )}
                        <span
                            aria-hidden="true"
                            className="raw-svg"
                            dangerouslySetInnerHTML={{__html: variant.svg}}
                        />
                    </div>
                )) : asset.Component && (
                    <asset.Component aria-hidden="true" focusable="false"/>
                )}
            </div>
            {isIcon ? (
                <div className={`details${hasVariants ? ' variants' : ''}`}>
                    {variants.map((variant) => (
                        <div className="variant-details" key={variant.name}>
                            <div className="asset-name">
                                <span>React</span>
                                <strong title={variant.reactName}>
                                    {variant.reactName}
                                </strong>
                            </div>
                            <div className="asset-name">
                                <span>Angular Registry</span>
                                <strong title={variant.angularRegistryName}>
                                    {variant.angularRegistryName}
                                </strong>
                            </div>
                            <small title={variant.fileName}>{variant.fileName}</small>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="details">
                    <div className="variant-details">
                        <div className="asset-name">
                            <span>React</span>
                            <strong title={asset.reactName}>
                                {asset.reactName}
                            </strong>
                        </div>
                        <div className="asset-name">
                            <span>Angular Registry</span>
                            <strong title={asset.angularRegistryName}>
                                {asset.angularRegistryName}
                            </strong>
                        </div>
                        <small title={asset.fileName}>{asset.fileName}</small>
                    </div>
                </div>
            )}
        </article>
    );
};
