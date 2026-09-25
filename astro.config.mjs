import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // Replace this with your actual live URL once deployed
  site: 'https://themushroom.agency', 
  
  // This tells Astro to run as a dynamic server for your contact API
  output: 'server',
  adapter: vercel(),
  
  // This builds your SEO sitemap automatically
  integrations: [sitemap()]
});