import { z } from 'zod';

export const MetaJsonSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
});

export type MetaJson = z.infer<typeof MetaJsonSchema>;

export const MdxFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type MdxFrontmatter = z.infer<typeof MdxFrontmatterSchema>;
