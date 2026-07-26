export const site = {
  name: 'Anamnesis | 追忆',
  shortName: '追忆',
  author: '路灯下的陌生人',
  url: 'https://bilbillm.github.io',
  description: '一座关于写作、档案、断章与仍在发生之事的个人数字花园。',
  heroLine: '以光与灰尘为证：我曾在此腐烂，并生长。',
  social: {
    github: 'https://github.com/bilbillm',
    bilibili: 'https://space.bilibili.com/351339750?spm_id_from=333.1007.0.0',
    steam: 'https://steamcommunity.com/profiles/76561199088274811/'
  }
} as const;

export type Locale = 'zh' | 'en';

export const primaryNavigation = [
  { key: 'articles', href: '/articles/' },
  { key: 'fragments', href: '/fragments/' },
  { key: 'projects', href: '/projects/' },
  { key: 'archive', href: '/archive/' },
  { key: 'about', href: '/about/' }
] as const;

export const utilityNavigation = [
  { key: 'search', href: '/search/' },
  { key: 'timeline', href: '/timeline/' }
] as const;
