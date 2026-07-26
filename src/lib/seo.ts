import { site } from './site';

export function canonicalUrl(pathname: string): string {
  return new URL(pathname, site.url).toString();
}

export function pageTitle(title?: string): string {
  return title ? `${title} | ${site.name}` : site.name;
}

const explicitlyNoindex = new Set(['/articles/self-introduction-2026/']);

export function isIndexablePath(pathname: string): boolean {
  return !(
    pathname === '/en' ||
    pathname.startsWith('/en/') ||
    pathname === '/archives' ||
    pathname.startsWith('/archives/') ||
    pathname === '/masonry' ||
    pathname.startsWith('/masonry/') ||
    /^\/\d{4}\/\d{2}\/\d{2}\//.test(pathname) ||
    explicitlyNoindex.has(pathname)
  );
}
