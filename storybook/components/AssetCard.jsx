import React from 'react';

const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    textAlign: 'center',
    margin: '10px',
    minWidth: '150px',
    minHeight: '100px',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.11)'
};

const cardIconStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    textAlign: 'center',
    margin: '2px',
    minWidth: '220px',
    minHeight: '100px',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
};

export const AssetCard = ({asset}) => {
    const innerDivStyle = asset.type === 'icon'
        ? {
            width: '26px',
            height: '26px',
            color: '#333',
            flexShrink: 0,
            marginBottom: '10px'
        }
        : {
            width: '20vw',
            height: 'auto',
            color: '#333',
            overflow: 'hidden',
            marginBottom: '10px'
        };
    const isIcon = asset.type === 'icon';
    return (
        <div style={isIcon ? cardIconStyle : cardStyle} className={isIcon ? "asset-card" : ''}>
            <div style={innerDivStyle}>
                {asset.Component && (
                    <asset.Component
                        aria-hidden="true"
                        style={{maxWidth: '100%', maxHeight: '100%', height: 'auto'}}
                    />
                )}
            </div>
            <p style={{
                color: '#000',
                textShadow: '0 0 3px #fff',
                fontStyle: 'italic',
                wordBreak: 'break-all'
            }}>{asset.name}</p>
        </div>
    );
};
