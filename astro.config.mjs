import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
    integrations: [react()],
    markdown: {
        shikiConfig: {
            theme: 'rose-pine',
        },
    },
    vite: {
        assetsInclude: ['**/*.csv'],
    },
    site: 'https://ryantyt.github.io',
    base: '/RTYT',
});
