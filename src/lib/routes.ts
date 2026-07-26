export type ContentRouteKind = 'articles' | 'fragments' | 'archive' | 'projects' | 'now';

export function contentRoute(collection: ContentRouteKind, id: string): string {
  const slug = id.replace(/\.(md|mdx)$/, '');
  switch (collection) {
    case 'articles':
      return `/articles/${slug}/`;
    case 'fragments':
      return `/fragments/${slug}/`;
    case 'archive':
      return `/archive/${slug}/`;
    case 'projects':
      return '/projects/';
    case 'now':
      return '/now/';
  }
}

export function normalizeLegacyPath(path: string): string {
  return path.startsWith('/') ? (path.endsWith('/') ? path : `${path}/`) : `/${path}/`;
}
