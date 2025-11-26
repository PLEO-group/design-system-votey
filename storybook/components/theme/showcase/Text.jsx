import React from 'react';

const textStyle = {
    fontSize: '18px',
    margin: 'unset',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
    color: 'var(--color-text-dark)'
};

const Text = ({ style = {}, children='Pójdź w loch zbić małżeńską gęś futryn!'}) => {
    return (
        <p style={{...textStyle, ...style}}>
            {children}
        </p>
    );
};

export const PreviewText = ({ color=''}) => {
    return (
        <>
            <Text style={{ color, fontSize: 20 }}/>
            <Text style={{ color, fontSize: 16 }}/>
            <Text style={{ color, fontSize: 12 }}/>
            <Text style={{ color, fontSize: 8 }}/>
        </>
    )
}


export default Text;
