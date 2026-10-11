import { BlogPostSummaryDTO } from './BlogPostSummaryDTO';

export type BlogArchiveMonthDTO = {
  /** 1–12, from `publishedAt` in UTC. */
  month: number;
  count: number;
  /** Newest first. */
  posts: BlogPostSummaryDTO[];
};

export type BlogArchiveYearDTO = {
  /** From `publishedAt` in UTC. */
  year: number;
  count: number;
  /** Newest first; months without posts are omitted. */
  months: BlogArchiveMonthDTO[];
};
