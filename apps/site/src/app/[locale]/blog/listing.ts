import {
  type BlogArchiveYearDTO,
  type BlogPostSummaryDTO,
  type BlogTagDTO,
  GetBlogTags,
  ListBlogArchive,
  ListBlogPosts,
  ListFeaturedBlogPosts,
} from '@repo/application/blog';
import type { DomainError, Either, Locale } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';

/**
 * The bridge between the listing page and the application: everything the
 * page shows, loaded in parallel. A section whose use case fails is logged and
 * rendered empty, so one failure never takes the whole listing down.
 */

export interface IBlogListing {
  /** Published, newest first. */
  posts: BlogPostSummaryDTO[];
  /** Featured and published, newest first, capped for the band. */
  featured: BlogPostSummaryDTO[];
  /** Most used first. */
  tags: BlogTagDTO[];
  /** Newest year first. */
  archive: BlogArchiveYearDTO[];
}

function valueOrEmpty<T>(
  result: Either<DomainError, T[]>,
  section: string,
): T[] {
  if (result.isRight()) return result.value;

  // eslint-disable-next-line no-console
  console.error(`[blog] could not load the listing ${section}:`, result.value);
  return [];
}

export async function loadBlogListing(locale: string): Promise<IBlogListing> {
  const { blogPostRepository } = getServerContainer();
  const input = { locale: locale as Locale };

  const [posts, featured, tags, archive] = await Promise.all([
    new ListBlogPosts(blogPostRepository).execute(input),
    new ListFeaturedBlogPosts(blogPostRepository).execute(input),
    new GetBlogTags(blogPostRepository).execute(input),
    new ListBlogArchive(blogPostRepository).execute(input),
  ]);

  return {
    posts: valueOrEmpty(posts, 'posts'),
    featured: valueOrEmpty(featured, 'featured posts'),
    tags: valueOrEmpty(tags, 'tags'),
    archive: valueOrEmpty(archive, 'archive'),
  };
}
