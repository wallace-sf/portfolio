import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { getTranslations } from 'next-intl/server';

import { PostCard } from '~features/blog/PostCard';

const HEADING_ID = 'featured-posts-heading';

export interface IFeaturedPostsProps {
  /** Newest first, as `ListFeaturedBlogPosts` returns them. */
  posts: BlogPostSummaryDTO[];
  locale: string;
}

/** The editor's picks as a band of cards, two columns from `md`. */
export async function FeaturedPosts({ posts, locale }: IFeaturedPostsProps) {
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-5">
      <h2 id={HEADING_ID} className="text-heading-h4">
        {t('featured')}
      </h2>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard
              post={post}
              locale={locale}
              headingLevel="h3"
              layout="stacked"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
