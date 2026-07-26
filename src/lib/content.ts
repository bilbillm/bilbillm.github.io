import { getCollection, type CollectionEntry } from 'astro:content';
import { contentRoute } from './routes';

export type SiteCollection = 'articles' | 'fragments' | 'projects' | 'archive' | 'now';
export type Article = CollectionEntry<'articles'>;
export type Fragment = CollectionEntry<'fragments'>;
export type Project = CollectionEntry<'projects'>;
export type ArchiveEntry = CollectionEntry<'archive'>;
export type NowEntry = CollectionEntry<'now'>;
export type SiteEntry = Article | Fragment | Project | ArchiveEntry | NowEntry;
export type DatedEntry = Article | Fragment | ArchiveEntry | NowEntry;
export type TagEntry = SiteEntry;

function byPublishedAt<T extends { data: { publishedAt: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getArticles() {
  return byPublishedAt(await getCollection('articles', ({ data }) => !data.draft));
}

export async function getFragments() {
  return byPublishedAt(await getCollection('fragments'));
}

export async function getArchiveEntries() {
  return byPublishedAt(await getCollection('archive'));
}

export async function getProjects() {
  return [...(await getCollection('projects'))].sort((a, b) => b.data.year - a.data.year);
}

export async function getNowEntries() {
  return byPublishedAt(await getCollection('now'));
}

export function contentUrl(entry: CollectionEntry<SiteCollection>): string {
  return contentRoute(entry.collection, entry.id);
}

export function readingMinutes(body: string): number {
  const cjk = (body.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = body.replace(/[\u3400-\u9fff]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}

export function formatDate(date: Date, locale = 'zh-CN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Shanghai'
  }).format(date);
}

export async function getAllTagEntries() {
  const [articles, fragments, archive, projects, nowEntries] = await Promise.all([
    getArticles(),
    getFragments(),
    getArchiveEntries(),
    getProjects(),
    getNowEntries()
  ]);
  return [...articles, ...fragments, ...archive, ...projects, ...nowEntries];
}
