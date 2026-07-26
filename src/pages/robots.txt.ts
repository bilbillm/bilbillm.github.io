import type { APIContext } from 'astro';
import { site } from '../lib/site';

export function GET(context: APIContext) {
  const origin = context.site ?? site.url;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', origin)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
