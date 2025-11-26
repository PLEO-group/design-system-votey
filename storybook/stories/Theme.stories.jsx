import React from 'react';
import {ColorSwatch} from '../components/ColorSwatch';
import colors from '../../tokens/base/colors.json';
import darkTokens from '../../tokens/dark.json';
import lightTokens from '../../tokens/light.json';
import {ALL_SHADES, createShade, mapTokens} from "../utils";


const mainWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '100%',
    padding: '20px 10px',
    gap: 10,
    transition: 'background-color 0.3s ease',
};

const rowWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '16px',
    justifyContent: 'center',
    gap: 10,
};

const titleStyle = {
    fontSize: '18px',
    margin: 'unset',
    fontWeight: 'bold',
    color: 'var(--title-color)',
    transition: 'color 0.3s ease',
};

const rowStyle = {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: 10,
};


function grabColor(str=''){
    const cleaned = str.replace(/[{}]/g, "");
    const parts = cleaned.split(".");
    const token = parts[1] || '';
    return [token, { ...colors.color[token], name: token }];
}

const Title = ({ children }) => <p style={titleStyle}>{children}</p>

const Item = ({ title='', data={} }) => {
    const { value } = data;
    const [token, color] = grabColor(value);



    //szpont
    const mappedColors = mapTokens([color]);
    const [finalColor] = ALL_SHADES.map(shade => {
        return createShade(mappedColors, token, shade, false);
    }).filter((item) => {
        return Boolean(item)
    });

    if(!finalColor) return null

    return (
        <div style={rowWrapperStyle}>
            <Title>{title}</Title>
            <ColorSwatch fullName token={finalColor} />
        </div>
    );
};

//watchout! recursion
const RecursiveRow = ({ title='Row', data=[]}) => {
    if(Boolean(data?.type) && data.type === 'color') return <Item title={title} data={data}/>
    const src = Object.entries(data)
    return (
        <React.Fragment key={title}>
            <div style={rowWrapperStyle}>
                <Title>{title}</Title>
                <div style={rowStyle}>
                    {src.map(([key, value]) => (
                        <RecursiveRow key={key} title={key} data={value} />
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};


export const Theme =({ theme='light' })=>{
    const tokens = theme === 'light' ? lightTokens : darkTokens;
    const src = Object.entries({ ...tokens })
    return (
        <div style={{ ...mainWrapperStyle, backgroundColor: theme === 'light' ? '#fff' : '#1D1D1E', '--title-color': theme === 'light' ? '#000' : '#fff'}}>
            {src.map(([key, value]) => (
                <React.Fragment key={key}>
                    <RecursiveRow key={key} title={key} data={value} />
                    <span style={{ width: '100%', height: '1px', backgroundColor: '#ddd', marginTop: '10px' }}/>
                </React.Fragment>
            ))}
        </div>
    )
}


export default {
    title: 'Tokens/Themes',
    component: Theme,
    argTypes:{
        theme:{
            options:['light', 'dark'],
            control:{ type: 'inline-radio' },
        },
    },
    args: {
        theme: 'light',
    },
};
