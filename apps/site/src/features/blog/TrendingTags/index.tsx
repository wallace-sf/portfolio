import type { BlogTagDTO } from '@repo/application/blog';
import { getTranslations } from 'next-intl/server';

import { Link } from '~/i18n/routing';
import { blogTagsPath } from '~features/blog/paths';
import { TagLink } from '~features/blog/TagLink';

/** How many of the most used tags the listing shows. */
export const TRENDING_TAGS_LIMIT = 8;

const HEADING_ID = 'trending-tags-heading';

export interface ITrendingTagsProps {
  /** Most used first, as `GetBlogTags` returns them. */
  tags: BlogTagDTO[];
  locale: string;
}

/** The most used tags with their counts, then a link to every tag. */
export async function TrendingTags({ tags, locale }: ITrendingTagsProps) {
  if (tags.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-4">
      <h2 id={HEADING_ID} className="text-heading-h4">
        {t('trendingTags')}
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        <ul className="flex flex-wrap gap-3">
          {tags.slice(0, TRENDING_TAGS_LIMIT).map(({ tag, count }) => (
            <li key={tag}>
              <TagLink tag={tag} count={count} />
            </li>
          ))}
        </ul>

        <Link
          href={blogTagsPath()}
          className="text-body-sm rounded-sm !text-brand-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 [.light_&]:!text-brand-primary"
        >
          {t('allTags')}
        </Link>
      </div>
    </section>
  );
}
