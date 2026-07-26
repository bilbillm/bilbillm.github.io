import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const shanghaiIsoDateSchema = z.string()
  .datetime({ offset: true })
  .refine((value) => value.endsWith('+08:00'), {
    message: 'Date must use the Asia/Shanghai +08:00 offset'
  })
  .transform((value) => new Date(value));

export const datedContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: shanghaiIsoDateSchema,
  updatedAt: shanghaiIsoDateSchema.optional(),
  tags: z.array(z.string()).default([]),
  legacyPaths: z.array(z.string()).default([]),
  cover: z.string().optional(),
  noindex: z.boolean().default(false)
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: datedContentSchema.extend({
    draft: z.boolean().default(false)
  })
});

const fragments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/fragments' }),
  schema: datedContentSchema.extend({
    type: z.enum(['note', 'quote', 'image', 'mixed'])
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number().int(),
    status: z.enum(['active', 'archived', 'experimental']),
    tags: z.array(z.string()).default([]),
    repository: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional()
  })
});

const archive = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/archive' }),
  schema: datedContentSchema.extend({
    kind: z.enum(['dossier', 'scene', 'object', 'unsent']),
    images: z.array(z.string()).default([]),
    featured: z.boolean().default(false)
  })
});

export const nowContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: shanghaiIsoDateSchema,
  tags: z.array(z.string()).default([])
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/now' }),
  schema: nowContentSchema
});

export const collections = { articles, fragments, projects, archive, now };
