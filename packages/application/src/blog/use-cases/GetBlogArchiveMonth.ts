import {
  DomainError,
  Either,
  Locale,
  NotFoundError,
  left,
  right,
} from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { BlogArchiveMonthDTO } from '../dtos/BlogArchiveDTO';
import { IBlogPostRepository } from '../ports';
import { loadBlogArchive } from './blog-archive';

export type GetBlogArchiveMonthInput = {
  locale: Locale;
  year: number;
  /** 1–12. */
  month: number;
};

/**
 * One month of the public archive: its published posts, newest first.
 * `NotFoundError` when that month has no published post.
 */
export class GetBlogArchiveMonth extends UseCase<
  GetBlogArchiveMonthInput,
  BlogArchiveMonthDTO,
  NotFoundError | DomainError
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: GetBlogArchiveMonthInput,
  ): Promise<Either<NotFoundError | DomainError, BlogArchiveMonthDTO>> {
    const archive = await loadBlogArchive(this.repository, input.locale);
    if (archive.isLeft()) return left(archive.value);

    const archiveMonth = archive.value
      .find(({ year }) => year === input.year)
      ?.months.find(({ month }) => month === input.month);

    return archiveMonth
      ? right(archiveMonth)
      : left(new NotFoundError({ year: input.year, month: input.month }));
  }
}
