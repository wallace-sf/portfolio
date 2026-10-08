import {
  DomainError,
  Either,
  Locale,
  NotFoundError,
  left,
  right,
} from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { BlogArchiveYearDTO } from '../dtos/BlogArchiveDTO';
import { IBlogPostRepository } from '../ports';
import { loadBlogArchive } from './blog-archive';

export type GetBlogArchiveYearInput = {
  locale: Locale;
  year: number;
};

/**
 * One year of the public archive: its months and published posts, newest
 * first. `NotFoundError` when the year has no published post, so the page can
 * 404 the same way `GetBlogPostBySlug` does for a missing post.
 */
export class GetBlogArchiveYear extends UseCase<
  GetBlogArchiveYearInput,
  BlogArchiveYearDTO,
  NotFoundError | DomainError
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: GetBlogArchiveYearInput,
  ): Promise<Either<NotFoundError | DomainError, BlogArchiveYearDTO>> {
    const archive = await loadBlogArchive(this.repository, input.locale);
    if (archive.isLeft()) return left(archive.value);

    const archiveYear = archive.value.find(({ year }) => year === input.year);

    return archiveYear
      ? right(archiveYear)
      : left(new NotFoundError({ year: input.year }));
  }
}
