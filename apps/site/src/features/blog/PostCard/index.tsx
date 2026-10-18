import type { ReactNode } from 'react';

import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { screens } from '@repo/tailwind-config/screens';
import { Badge } from '@repo/ui/View';
import classNames from 'classnames';
import Image from 'next/image';

import { Link } from '~/i18n/routing';
import { blogPostPath } from '~features/blog/paths';
import { PostMeta } from '~features/blog/PostMeta';

export interface IPostCardProps {
  post: BlogPostSummaryDTO;
  locale: string;
  /** `h3` when the card sits under a section heading (e.g. a month). */
  headingLevel?: 'h2' | 'h3';
  /**
   * `row` puts the thumbnail beside the text from `sm` (full-width lists);
   * `stacked` keeps it on top at every width (narrow grid columns).
   */
  layout?: 'row' | 'stacked';
  /**
   * Rendered after the description: the listing's search passes a client
   * `SearchExcerpt`, which shows the matched passage while a search is active.
   */
  excerpt?: ReactNode;
}

const THUMBNAIL_SIZES = {
  row: `(min-width: ${screens.sm}) 14rem, calc(100vw - 2rem)`,
  stacked: `(min-width: ${screens.md}) 24rem, calc(100vw - 2rem)`,
} as const;

/** Async only so the async `PostMeta` resolves wherever the card renders. */
export async function PostCard({
  post,
  locale,
  headingLevel: Heading = 'h2',
  layout = 'row',
  excerpt,
}: IPostCardProps) {
  const isRow = layout === 'row';
  const {
    slug,
    title,
    description,
    publishedAt,
    readingMinutes,
    tags,
    thumbnailImage,
  } = post;

  return (
    <Link href={blogPostPath(publishedAt, slug)} className="group block h-full">
      <article
        className={classNames(
          'flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-drop-sm transition-shadow group-hover:shadow-drop-md',
          isRow && 'sm:flex-row',
        )}
      >
        {thumbnailImage && (
          <div
            className={classNames(
              'relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-sunken',
              isRow && 'sm:aspect-auto sm:w-56',
            )}
          >
            <Image
              src={thumbnailImage.url}
              alt={thumbnailImage.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes={THUMBNAIL_SIZES[layout]}
            />
          </div>
        )}

        <div className="flex flex-col gap-2.5 p-5 sm:py-6">
          <PostMeta
            publishedAt={publishedAt}
            readingMinutes={readingMinutes}
            locale={locale}
          />

          <Heading className="text-heading-h5 text-content-primary">
            {title}
          </Heading>

          <p className="text-body-sm line-clamp-2 text-content-secondary">
            {description}
          </p>

          {excerpt}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <Badge.Text key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
