import React, {useEffect} from 'react';
import lightTokens from '../../tokens/light.json';
import Section from "../components/theme/Section";
import "../../dist/css/tokens.css";
import "../../dist/css/tokens.light.css";
import "../../dist/css/tokens.dark.css";


const mainWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    padding: '20px 10px',
    gap: 10,
    transition: 'background-color 0.3s ease',
};


const TOKEN_TO_SHOWCASE_TYPE_MAP = {
    text: 'text',
    surface: 'background',
};

export const Theme =({ theme='light' })=>{
    const t = lightTokens.color
    const showcaseTypes = Object.entries(t).map(([key, value]) => {
        return {
            name: key,
            type: TOKEN_TO_SHOWCASE_TYPE_MAP?.[key] || TOKEN_TO_SHOWCASE_TYPE_MAP.surface,
            data: value
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);


    return (
        <main style={{
            ...mainWrapperStyle,
            backgroundColor: theme === 'light' ? 'var(--color-gray-100)' : 'var(--color-navy-blue-400)',
        }}>
            {showcaseTypes.map((props) => <Section key={props.name} {...props}/>)}
        </main>
    )
}


export default {
    title: 'Tokens/Themes',
    component: Theme,
    parameters: {
        layout: 'fullscreen',
    },
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

