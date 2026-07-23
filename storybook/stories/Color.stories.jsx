import React from 'react';
import {CoreColorPalette} from '../components/CoreColorPalette';
import {StoryPageHeader} from '../components/StoryPageHeader';
import './PwaColors.stories.scss';

export default {
    title: 'PWA Tokens/Colors',
    component: CoreColorPalette,
    parameters: {
        layout: 'fullscreen',
    },
};

export const Palette = {
    name: 'Core colors',
    render: () => (
        <main className="pwa-color-tokens core">
            <StoryPageHeader
                description="This palette is shared by PWA and CRM semantic color layers."
                eyebrow="Shared foundation"
                title="Core colors"
            />
            <CoreColorPalette/>
        </main>
    ),
};
