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
  tags: string[];
  coverImage?: BlogPostImageDTO;
  thumbnailImage?: BlogPostImageDTO;
};
