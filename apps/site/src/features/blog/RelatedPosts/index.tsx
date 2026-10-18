import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { getTranslations } from 'next-intl/server';

import { Link } from '~/i18n/routing';
import { blogPostPath } from '~features/blog/paths';
import { PostMeta } from '~features/blog/PostMeta';

const HEADING_ID = 'related-posts-heading';

export interface IRelatedPostsProps {
  /** Ranked as `ListRelatedBlogPosts` returns them. */
  posts: BlogPostSummaryDTO[];
  locale: string;
}

/** "Further reading": compact links to the posts sharing the most tags. */
export async function RelatedPosts({ posts, locale }: IRelatedPostsProps) {
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-4">
      <h2 id={HEADING_ID} className="text-heading-h5">
        {t('furtherReading')}
      </h2>

      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug} className="flex flex-col gap-1">
            <Link
              href={blogPostPath(post.publishedAt, post.slug)}
              className="text-body-sm rounded-sm !font-bold text-content-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {post.title}
            </Link>
            <PostMeta
              publishedAt={post.publishedAt}
              readingMinutes={post.readingMinutes}
              locale={locale}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
