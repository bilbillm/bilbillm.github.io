import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const smokeRoutes = [
  ['/', 'Anamnesis | 追忆'],
  ['/articles/', '文章'],
  ['/articles/simple-html-clock/', '简单的网页时钟：为什么我要做这个'],
  ['/fragments/', '断章'],
  ['/fragments/gallery/', '一些照片与图像，2025-2026'],
  ['/projects/', '项目'],
  ['/archive/', '档案'],
  ['/archive/chen-xiangwan-dossier/', '陈向晚：公开档案'],
  ['/about/', '关于'],
  ['/now/', '此刻'],
  ['/privacy/', '隐私'],
  ['/search/', '搜索'],
  ['/timeline/', '时间线'],
  ['/en/', 'Anamnesis | 追忆']
] as const;

for (const [path, heading] of smokeRoutes) {
  test(`@smoke ${path} renders its primary heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  });
}

test('@full home order, viewport continuity, theme, locale, and navigation', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.home-section .section-heading h2')).toHaveText(['此刻', '档案', '文章', '断章', '项目']);

  const nowBox = await page.locator('#now').boundingBox();
  expect(nowBox).not.toBeNull();
  expect(nowBox!.y).toBeLessThan(page.viewportSize()!.height);

  const html = page.locator('html');
  const initialTheme = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: '切换主题' }).click();
  const selectedTheme = await html.getAttribute('data-theme');
  expect(selectedTheme).toMatch(/^(light|dark)$/);
  expect(selectedTheme).not.toBe(initialTheme);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', selectedTheme!);

  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.getByRole('link', { name: 'English interface' }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  if (testInfo.project.name === 'chromium-mobile') {
    await page.locator('summary[aria-label="Open navigation"]').click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  }
});

test('@full English mirrors canonicalize to Chinese and tags cross content types', async ({ page }) => {
  await page.goto('/en/articles/simple-html-clock/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bilbillm.github.io/articles/simple-html-clock/');
  await expect(page.getByText('This entry remains in its original language.')).toBeVisible();

  await page.goto('/tags/AI/');
  await expect(page.getByRole('heading', { level: 1, name: 'AI' })).toBeVisible();
  await expect(page.getByRole('link', { name: /深夜的胡言乱语/ })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Medical Evidence Assistant' })).toBeVisible();

  await page.goto('/en/tags/AI/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bilbillm.github.io/tags/AI/');
});

test('@full gallery lightbox is localized and keyboard operable', async ({ page }) => {
  await page.goto('/fragments/gallery/');
  const trigger = page.locator('[data-lightbox-trigger]').first();
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '图像灯箱' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('[data-lightbox-image]')).toHaveAttribute('src', /01-whale-fall-1440\.webp/);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.goto('/en/fragments/gallery/');
  await page.getByRole('button', { name: 'View 鲸落' }).click();
  await expect(page.getByRole('dialog', { name: 'Image lightbox' })).toBeVisible();
});

test('@full production search returns entries and an explicit empty state', async ({ page }) => {
  await page.goto('/search/');
  const search = page.getByRole('searchbox');
  await search.fill('网页时钟');
  await expect(page.getByRole('link', { name: /简单的网页时钟/ })).toBeVisible();
  await search.fill('definitely-no-such-anamnesis-entry-987654321');
  await expect(page.locator('[data-search-results]')).toHaveText('未找到相符内容。');
});

test('@full projects point to real destinations in the current tab', async ({ page }) => {
  await page.goto('/projects/');
  const projectLinks = page.locator('.project-card__links a');
  const hrefs = await projectLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs).toEqual(expect.arrayContaining([
    'https://github.com/bilbillm/medical-evidence-assistant',
    'https://github.com/bilbillm/Lacan.js',
    'https://github.com/bilbillm/DGLab-Craft',
    'https://github.com/bilbillm/Simple-HTML-Clock',
    'https://bilbillm.github.io/Simple-HTML-Clock/'
  ]));
  for (const link of await projectLinks.all()) expect(await link.getAttribute('target')).toBeNull();
});

async function mockVercount(page: Page, payloads: { url: string; isNewUv: boolean }[]) {
  await page.route('https://events.vercount.one/**', async (route) => {
    const headers = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type',
      'access-control-allow-methods': 'POST, OPTIONS'
    };
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers });
      return;
    }
    payloads.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers,
      body: JSON.stringify({ data: { site_pv: 42, site_uv: 12, page_pv: 7 } })
    });
  });
}

test('@full counters use one event request, persist UV, and remain optional', async ({ page }) => {
  const payloads: { url: string; isNewUv: boolean }[] = [];
  await mockVercount(page, payloads);
  await page.goto('/articles/simple-html-clock/');
  await expect(page.locator('[data-counter-page-pv]')).toHaveText('7');
  await expect(page.locator('[data-counter-site-uv]')).toHaveText('12');
  await expect.poll(() => payloads.length).toBe(1);
  expect(payloads[0].url).toContain('/articles/simple-html-clock/');
  expect(payloads[0].isNewUv).toBe(true);

  await page.reload();
  await expect.poll(() => payloads.length).toBe(2);
  expect(payloads[1].isNewUv).toBe(false);

  await page.unroute('https://events.vercount.one/**');
  await page.route('https://events.vercount.one/**', (route) => route.abort());
  await page.goto('/articles/late-night-notes-ai-vr/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-counter]').first()).toBeHidden();
});

test('@full Do Not Track prevents counter requests', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'doNotTrack', { configurable: true, get: () => '1' });
  });
  let requests = 0;
  page.on('request', (request) => {
    if (request.url().startsWith('https://events.vercount.one/')) requests += 1;
  });
  await page.goto('/articles/simple-html-clock/');
  await page.waitForLoadState('networkidle');
  expect(requests).toBe(0);
  await expect(page.locator('[data-counter]').first()).toBeHidden();
});

test('@full RSS, robots, sitemap, and legacy documents expose correct metadata', async ({ page, request }) => {
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBe(true);
  const rssText = await rss.text();
  expect(rssText).toContain('简单的网页时钟：为什么我要做这个');
  expect(rssText).not.toContain('Self Introduction（历史快照）');

  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://bilbillm.github.io/sitemap-index.xml');

  const sitemapIndex = await request.get('/sitemap-index.xml');
  expect(await sitemapIndex.text()).toContain('/sitemap-0.xml');
  const sitemap = await request.get('/sitemap-0.xml');
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain('https://bilbillm.github.io/articles/simple-html-clock/');
  expect(sitemapText).not.toContain('https://bilbillm.github.io/en/');
  expect(sitemapText).not.toContain('self-introduction-2026');
  expect(sitemapText).not.toContain('/masonry/');

  const legacy = await request.get('/masonry/');
  const legacyHtml = await legacy.text();
  expect(legacyHtml).toContain('<meta name="robots" content="noindex">');
  expect(legacyHtml).toContain('<link rel="canonical" href="https://bilbillm.github.io/fragments/gallery/">');
  await page.goto('/masonry/');
  await expect(page).toHaveURL(/\/fragments\/gallery\/$/);

  const introduction = await request.get('/2026/02/15/Self-Introduction/');
  expect(await introduction.text()).toContain('/articles/self-introduction-2026/');
});

test('@full core pages have no axe violations and produce QA screenshots', async ({ page }, testInfo) => {
  for (const [name, path] of [['home', '/'], ['gallery', '/fragments/gallery/']] as const) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).include('#main-content').analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
  }
});
