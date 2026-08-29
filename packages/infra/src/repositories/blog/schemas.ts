import { z } from 'zod';

const MetaImageSchema = z.object({
  url: z.string(),
  alt: z.object({
    'en-US': z.string(),
    'pt-BR': z.string(),
    es: z.string(),
  }),
});

export const MetaJsonSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
  coverImage: MetaImageSchema.optional(),
  thumbnailImage: MetaImageSchema.optional(),
});

export type MetaJson = z.infer<typeof MetaJsonSchema>;

export const MdxFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type MdxFrontmatter = z.infer<typeof MdxFrontmatterSchema>;
