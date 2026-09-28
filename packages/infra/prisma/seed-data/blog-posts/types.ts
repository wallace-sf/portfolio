import type { Prisma } from '@prisma/client';

type LocalizedString = Record<string, string>;

export interface BlogPostSeedImage {
  url: string;
  alt: LocalizedString;
}

/**
 * Seed shape for one blog post. Content is Markdown per locale, stored in the
 * `BlogPost.content` Json column and rendered by the site at build time.
 * `author` and `status` are shared by every post and applied by the seeder.
 */
export interface BlogPostSeed {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  tags: string[];
  publishedAt: Date;
  featured: boolean;
  coverImage?: BlogPostSeedImage;
  thumbnailImage?: BlogPostSeedImage;
}

export type BlogPostSeedAuthor = Prisma.InputJsonObject & {
  name: string;
  avatarUrl: string;
  url: string;
};
