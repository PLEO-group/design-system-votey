import React from 'react';

const swatchStyle = {
    width: '5vw',
    height: '5vw',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 200ms ease-in-out',
};

const textStyle = {
    color: '#fff',
    textShadow: '0 0 3px #000, 0 0 5px #000',
    fontSize: '14px',
};

const hexStyle = {
    color: '#fff',
    textShadow: '0 0 3px #000, 0 0 5px #000',
    fontSize: '12px',
    fontWeight: 'bold',
};

export const ColorSwatch = ({ token, fullName=false }) => {
    const backgroundColor = !token.isPlaceholder ? token.value : `var(${token.name})`;
    const borderColor = token.isPlaceholder ? '1px dashed #aaa' : 'none';
    const titleText = token.isPlaceholder ? token.name : `Token: ${token.name} | HEX: ${token.value}`;
    const name = fullName ? token.name : token.shade
    return (
        <div
            style={{
                ...swatchStyle,
                backgroundColor: backgroundColor,
                border: borderColor,
            }}
            title={titleText}
        >
            <p style={textStyle}>
                {name}
            </p>
            <p style={hexStyle}>
                {token.value}
            </p>
        </div>
    );
};
