import { BlogPostAuthorDTO } from './BlogPostAuthorDTO';

export type BlogPostImageDTO = {
  url: string;
  /** Alt text already resolved to the requested locale. */
  alt: string;
};

export type BlogPostSummaryDTO = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  /** Whole minutes to read the body in this locale (200 wpm, at least 1). */
  readingMinutes: number;
  featured: boolean;
  tags: string[];
  author: BlogPostAuthorDTO;
  coverImage?: BlogPostImageDTO;
  thumbnailImage?: BlogPostImageDTO;
};
