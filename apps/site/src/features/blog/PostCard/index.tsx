import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { screens } from '@repo/tailwind-config/screens';
import { Badge } from '@repo/ui/View';
import Image from 'next/image';

import { Link } from '~/i18n/routing';
import { formatPublishedAt } from '~features/blog/formatPublishedAt';
import { blogPostPath } from '~features/blog/paths';

export interface IPostCardProps {
  post: BlogPostSummaryDTO;
  locale: string;
  /** `h3` when the card sits under a section heading (e.g. a month). */
  headingLevel?: 'h2' | 'h3';
}

export function PostCard({
  post,
  locale,
  headingLevel: Heading = 'h2',
}: IPostCardProps) {
  const { slug, title, description, publishedAt, tags, thumbnailImage } = post;

  return (
    <Link href={blogPostPath(publishedAt, slug)} className="group block">
      <article className="flex flex-col overflow-hidden rounded-card bg-surface shadow-drop-sm transition-shadow group-hover:shadow-drop-md sm:flex-row">
        {thumbnailImage && (
          <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-sunken sm:aspect-auto sm:w-56">
            <Image
              src={thumbnailImage.url}
              alt={thumbnailImage.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes={`(min-width: ${screens.sm}) 14rem, calc(100vw - 2rem)`}
            />
          </div>
        )}

        <div className="flex flex-col gap-2.5 p-5 sm:py-6">
          <time
            dateTime={publishedAt}
            className="text-body-xs text-content-muted"
          >
            {formatPublishedAt(publishedAt, locale)}
          </time>

          <Heading className="text-heading-h5 text-content-primary">
            {title}
          </Heading>

          <p className="text-body-sm line-clamp-2 text-content-secondary">
            {description}
          </p>

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
