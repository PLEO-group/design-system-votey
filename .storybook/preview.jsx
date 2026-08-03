import React, {useLayoutEffect} from 'react';
import '../dist/css/tokens.angular.css';
import './preview-styles.css';

const crmViewports = {
    mobile360: {
        name: 'Mobile 360',
        styles: {width: '360px', height: '800px'},
    },
    mobile375: {
        name: 'Mobile 375',
        styles: {width: '375px', height: '812px'},
    },
    tablet768: {
        name: 'Tablet 768',
        styles: {width: '768px', height: '1024px'},
    },
    tablet1024: {
        name: 'Tablet 1024',
        styles: {width: '1024px', height: '768px'},
    },
    laptop1280: {
        name: 'Laptop 1280',
        styles: {width: '1280px', height: '800px'},
    },
    desktop1920: {
        name: 'Desktop 1920',
        styles: {width: '1920px', height: '1080px'},
    },
};

const DeviceContext = ({children, device}) => {
    useLayoutEffect(() => {
        const updateViewportContext = () => {
            document.body.setAttribute('data-device', device);
            document.body.setAttribute(
                'data-orientation',
                window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical',
            );
            document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
        };

        updateViewportContext();
        window.addEventListener('resize', updateViewportContext, {passive: true});

        return () => window.removeEventListener('resize', updateViewportContext);
    }, [device]);

    return children;
};

const preview = {
    globalTypes: {
        device: {
            description: 'Device context used by CRM responsive tokens',
            defaultValue: 'desktop',
            toolbar: {
                icon: 'mobile',
                items: [
                    {value: 'mobile', title: 'Mobile'},
                    {value: 'tablet', title: 'Tablet'},
                    {value: 'desktop', title: 'Desktop'},
                ],
                dynamicTitle: true,
            },
        },
    },
    parameters: {
        options: {
            storySort: {
                order: [
                    'ANGULAR COMPONENTS',
                    ['Button', 'Checkbox', 'Icon'],
                    'CRM Tokens',
                    ['Colors', 'Foundations'],
                    'PWA Tokens',
                    ['Colors'],
                    'Assets',
                    ['Library'],
                ],
            },
        },
        viewport: {
            viewports: crmViewports,
        },
    },
    decorators: [
        (Story, context) => (
            <DeviceContext device={context.globals.device || 'desktop'}>
                <div style={{fontFamily: 'var(--storybook-font-family)'}}>
                    <Story/>
                </div>
            </DeviceContext>
        ),
    ],
};
export default preview;
