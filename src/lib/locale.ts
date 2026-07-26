import type { Locale } from './site';

const copy = {
  zh: {
    articles: '文章',
    fragments: '断章',
    projects: '项目',
    archive: '档案',
    about: '关于',
    search: '搜索',
    timeline: '时间线',
    now: '此刻',
    menu: '打开导航',
    close: '关闭',
    theme: '切换主题',
    language: 'English interface',
    read: '阅读',
    all: '查看全部',
    back: '返回',
    published: '发布于',
    updated: '更新于',
    minutes: '分钟阅读',
    originalLanguage: '内容保留原始语言。',
    privacy: '隐私',
    noResults: '未找到相符内容。',
    archiveDisclosure: '档案图像为经过编辑的公开版本；部分图像由 AI 辅助创作。',
    siteTotals: '站点访问',
    viewCount: '浏览'
  },
  en: {
    articles: 'Writing',
    fragments: 'Fragments',
    projects: 'Projects',
    archive: 'Archive',
    about: 'About',
    search: 'Search',
    timeline: 'Timeline',
    now: 'Now',
    menu: 'Open navigation',
    close: 'Close',
    theme: 'Toggle theme',
    language: '中文界面',
    read: 'Read',
    all: 'View all',
    back: 'Back',
    published: 'Published',
    updated: 'Updated',
    minutes: 'min read',
    originalLanguage: 'This entry remains in its original language.',
    privacy: 'Privacy',
    noResults: 'No matching entries.',
    archiveDisclosure: 'Archive imagery is a curated public edit; some images were created with AI assistance.',
    siteTotals: 'Site visits',
    viewCount: 'Views'
  }
} as const;

export type TranslationKey = keyof (typeof copy)['zh'];

export function t(locale: Locale, key: TranslationKey): string {
  return copy[locale][key];
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'zh') return normalized;
  return normalized === '/' ? '/en/' : `/en${normalized}`;
}
