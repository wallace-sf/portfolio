import { BlogPostAuthorDTO } from './BlogPostAuthorDTO';
import { BlogPostSummaryDTO } from './BlogPostSummaryDTO';

export type BlogPostDetailDTO = BlogPostSummaryDTO & {
  content: string;
  updatedAt?: string;
  author: BlogPostAuthorDTO & { bio?: string };
};
