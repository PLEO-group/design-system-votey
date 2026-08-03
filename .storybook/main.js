const config = {
    stories: [
        "../storybook/**/*.mdx",
        "../storybook/**/Color.stories.jsx",
        "../storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    staticDirs: [
        '../dist',
        {
            from: '../dist/assets/angular/svg-raw',
            to: '/assets/votey',
        },
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
};
export default config;
