import { type Locale, LOCALES } from '@repo/core/shared';
import { Badge } from '@repo/ui/View';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { ArchiveNav } from '~features/blog/ArchiveNav';
import { BlogSearch } from '~features/blog/BlogSearch';
import { FeaturedPosts } from '~features/blog/FeaturedPosts';
import { PostCard } from '~features/blog/PostCard';
import { SearchExcerpt } from '~features/blog/SearchExcerpt';
import { TrendingTags } from '~features/blog/TrendingTags';

import { loadBlogListing } from './listing';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.BlogPage' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/blog', locale as Locale),
    openGraph: {
      ...buildOpenGraph(locale as Locale, '/blog'),
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, { posts, featured, tags, archive }] = await Promise.all([
    getTranslations({ locale, namespace: 'Blog' }),
    loadBlogListing(locale),
  ]);

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      <header className="mb-8 flex flex-col gap-3 lg:mb-12">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-heading-h2">{t('title')}</h1>
          {posts.length > 0 && (
            <Badge.Text
              label={t('archivePostCount', { count: posts.length })}
            />
          )}
        </div>
        <p className="text-body-base text-content-secondary">{t('subtitle')}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-body-base py-16 text-center text-content-muted">
          {t('empty')}
        </p>
      ) : (
        <BlogSearch
          locale={locale}
          // Only what the search matches on: client code never sees the DTO.
          posts={posts.map(({ slug, title, description, tags }) => ({
            slug,
            title,
            description,
            tags,
          }))}
          cards={Object.fromEntries(
            posts.map((post) => [
              post.slug,
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                headingLevel="h3"
                excerpt={<SearchExcerpt slug={post.slug} />}
              />,
            ]),
          )}
          before={
            <>
              <FeaturedPosts posts={featured} locale={locale} />
              <TrendingTags tags={tags} locale={locale} />
            </>
          }
          after={<ArchiveNav years={archive} locale={locale} />}
        />
      )}
    </section>
  );
}
