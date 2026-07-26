import { getArchiveEntries, getArticles, getFragments, contentUrl } from './content';
import { normalizeLegacyPath } from './routes';

export type LegacyRedirect = { from: string; to: string };

export async function getLegacyRedirects(): Promise<LegacyRedirect[]> {
  const [articles, fragments, archive] = await Promise.all([
    getArticles(),
    getFragments(),
    getArchiveEntries()
  ]);
  const migrated = [...articles, ...fragments, ...archive].flatMap((entry) =>
    ('legacyPaths' in entry.data ? entry.data.legacyPaths : []).map((from) => ({
      from: normalizeLegacyPath(from),
      to: contentUrl(entry)
    }))
  );

  return [
    ...migrated,
    { from: '/archives/', to: '/timeline/' },
    { from: '/archives/2026/', to: '/timeline/' },
    { from: '/archives/2026/02/', to: '/timeline/' },
    { from: '/masonry/', to: '/fragments/gallery/' }
  ];
}
