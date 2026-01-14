import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ruudjuffermans.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
