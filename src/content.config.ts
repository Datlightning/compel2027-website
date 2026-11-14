import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// src/content/pages/<slug>.md — one file per content page.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    buttonLabel: z.string().optional(),
    buttonHref: z.string().optional(),
  }),
});

// src/content/announcements/<slug>.md — one file per announcement.
// `date` is optional (shown only when present); `order` breaks ties / orders undated items (higher = nearer the top).
const announcements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/announcements' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    order: z.number().optional(),
    buttonLabel: z.string().optional(),
    buttonHref: z.string().optional(),
  }),
});

export const collections = { pages, announcements };
