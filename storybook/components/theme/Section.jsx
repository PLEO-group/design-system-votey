import React from 'react';
import Text, {PreviewText} from './showcase/Text';
import Background from "./showcase/Background";

const RecursiveItem = ({ data, type, entryKey }) => {
    const entries = Object.entries(data);
    return entries.map(([key, value]) => {
        const isFinalColor = Boolean(value?.type);
        const finalKey = `${entryKey ? `${entryKey}-` : ''}${key}`.trim();
        if(isFinalColor) {
            const color = `var(--color-${finalKey})`
            return (
                <React.Fragment key={finalKey}>
                    <Text style={{ fontSize: 24 }}>{finalKey}</Text>
                    <div style={{ display: 'flex', width: '100%', gap: 50, alignItems: 'center', padding: '10px 0' }}>
                        {type === 'text' && <PreviewText color={color}/>}
                        {type === 'background' && <Background color={color}/>}
                    </div>
                </React.Fragment>

            )
        }
        return <RecursiveItem key={finalKey} entryKey={finalKey} data={value} type={type}/>
    })
}

const Section = ({ name='', type='', data={}}) => {
    return (
        <div style={{ padding: '0 10px 10px', borderBottom: '1px solid #ddd' }}>
            <RecursiveItem entryKey={name} data={data} type={type}/>
        </div>
    );
};

export default Section;
