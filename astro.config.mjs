import { defineConfig } from 'astro/config';

import node from "@astrojs/node";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import compress from 'astro-compress';
import robotsTxt from 'astro-robots-txt';
import sitemap from 'astro-sitemap';

const site = import.meta.env['SITE']

export default defineConfig({
  integrations: [
    tailwind(), 
    preact(),
    sitemap({ customPages: [`${site}`], lastmod: new Date() }),
    robotsTxt({
      policy: [{ userAgent: '*', allow: ['/'], crawlDelay: 10 }]
    }),
    compress({ SVG: false })
  ],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});