import { DomainError, Either, Locale } from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { BlogArchiveYearDTO } from '../dtos/BlogArchiveDTO';
import { IBlogPostRepository } from '../ports';
import { loadBlogArchive } from './blog-archive';

export type ListBlogArchiveInput = {
  locale: Locale;
};

/**
 * Published posts grouped year → month (both from `publishedAt` in UTC), newest
 * first at every level. Feeds the archive pages' static params and the sitemap.
 */
export class ListBlogArchive extends UseCase<
  ListBlogArchiveInput,
  BlogArchiveYearDTO[]
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  execute(
    input: ListBlogArchiveInput,
  ): Promise<Either<DomainError, BlogArchiveYearDTO[]>> {
    return loadBlogArchive(this.repository, input.locale);
  }
}
