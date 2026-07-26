import { describe, expect, it, vi } from 'vitest';
vi.mock('astro:content', () => ({
  defineCollection: <T>(definition: T) => definition,
  getCollection: vi.fn()
}));

import { datedContentSchema, nowContentSchema, shanghaiIsoDateSchema } from '../src/content.config';
import { counterStats, counterValue } from '../src/lib/counter';
import { formatDate } from '../src/lib/content';
import { localizedPath, t } from '../src/lib/locale';
import { galleryImages } from '../src/lib/media';
import { contentRoute, normalizeLegacyPath } from '../src/lib/routes';
import { canonicalUrl, isIndexablePath, pageTitle } from '../src/lib/seo';

describe('content routes', () => {
  it('maps content independently of file extensions', () => {
    expect(contentRoute('articles', 'simple-html-clock.mdx')).toBe('/articles/simple-html-clock/');
    expect(contentRoute('fragments', 'gallery')).toBe('/fragments/gallery/');
    expect(contentRoute('archive', 'chen-xiangwan-dossier')).toBe('/archive/chen-xiangwan-dossier/');
  });

  it('normalizes historic paths for static redirects', () => {
    expect(normalizeLegacyPath('2026/02/21/clock')).toBe('/2026/02/21/clock/');
    expect(normalizeLegacyPath('/masonry')).toBe('/masonry/');
  });
});

describe('locale and metadata', () => {
  it('keeps Chinese at the root and English below /en', () => {
    expect(localizedPath('/articles/', 'zh')).toBe('/articles/');
    expect(localizedPath('/articles/', 'en')).toBe('/en/articles/');
    expect(t('en', 'search')).toBe('Search');
  });

  it('creates canonical metadata against the production origin', () => {
    expect(canonicalUrl('/about/')).toBe('https://bilbillm.github.io/about/');
    expect(pageTitle('关于')).toBe('关于 | Anamnesis | 追忆');
    expect(isIndexablePath('/en/articles/simple-html-clock/')).toBe(false);
    expect(isIndexablePath('/masonry/')).toBe(false);
    expect(isIndexablePath('/articles/simple-html-clock/')).toBe(true);
  });

  it('formats dates in Asia/Shanghai regardless of the runner timezone', () => {
    expect(formatDate(new Date('2026-02-14T16:30:00Z'), 'zh-CN')).toContain('2026年2月15日');
  });

  it('accepts only ISO dates explicitly recorded with +08:00', () => {
    const valid = shanghaiIsoDateSchema.safeParse('2026-02-15T00:30:00+08:00');
    expect(valid.success).toBe(true);
    if (valid.success) expect(valid.data).toEqual(new Date('2026-02-14T16:30:00Z'));

    expect(shanghaiIsoDateSchema.safeParse('2026-02-14T16:30:00Z').success).toBe(false);
    expect(shanghaiIsoDateSchema.safeParse('2026-02-15T01:30:00+09:00').success).toBe(false);
    expect(shanghaiIsoDateSchema.safeParse('2026-02-15T00:30:00').success).toBe(false);
  });

  it('reuses the Shanghai date contract for updates and Now entries', () => {
    const dated = datedContentSchema.safeParse({
      title: 'Entry',
      description: 'Description',
      publishedAt: '2026-02-15T00:30:00+08:00',
      updatedAt: '2026-02-15T01:30:00+09:00'
    });
    const now = nowContentSchema.safeParse({
      title: 'Now',
      description: 'Description',
      publishedAt: '2026-02-14T16:30:00Z'
    });
    expect(dated.success).toBe(false);
    expect(now.success).toBe(false);
  });
});

describe('media and counters', () => {
  it('exposes twelve responsive local gallery records', () => {
    expect(galleryImages).toHaveLength(12);
    expect(galleryImages[0].srcset).toContain('01-whale-fall-1440.webp');
    expect(galleryImages.every((image) => image.alt.length > 0)).toBe(true);
  });

  it('reads Vercount response shapes and ignores invalid payloads', () => {
    expect(counterStats({ data: { site_pv: 42, site_uv: 12, page_pv: 7 } })).toEqual({ sitePv: 42, siteUv: 12, pagePv: 7 });
    expect(counterValue({ site_pv: 42, site_uv: 12, page_pv: 7 })).toBe(7);
    expect(counterStats({ data: { site_pv: 42, site_uv: 12 } })).toBeUndefined();
    expect(counterValue(null)).toBeUndefined();
  });
});
