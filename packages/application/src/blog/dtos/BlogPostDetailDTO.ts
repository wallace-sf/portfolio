import { BlogPostSummaryDTO } from './BlogPostSummaryDTO';

export type BlogPostDetailDTO = BlogPostSummaryDTO & {
  content: string;
};
