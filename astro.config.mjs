import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { isIndexablePath } from './src/lib/seo';

export default defineConfig({
  site: 'https://bilbillm.github.io',
  integrations: [mdx(), sitemap({
    filter: (page) => isIndexablePath(new URL(page).pathname)
  })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      defaultColor: false
    }
  },
  build: {
    format: 'directory'
  }
});
