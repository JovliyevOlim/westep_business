import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
    "stories": [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    "addons": [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest",
        '@storybook/addon-essentials', 'storybook-addon-designs'
    ],
    "framework": {
        "name": "@storybook/react-vite",
        "options": {}
    },
    "core": {
        "builder": '@storybook/builder-vite', // 👈 The builder enabled here.
    },
};
export default config;