import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles, contentUrl } from '../lib/content';
import { site } from '../lib/site';

export async function GET(context: APIContext) {
  const articles = (await getArticles()).filter((article) => !article.data.noindex);
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: contentUrl(article)
    }))
  });
}
