import { ListBlogPosts } from '@repo/application/blog';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { PostCard } from '~features/blog/PostCard';

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

  const t = await getTranslations({ locale, namespace: 'Blog' });

  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale });

  const posts = result.isRight() ? result.value : [];

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      <header className="mb-8 flex flex-col gap-3 lg:mb-12">
        <h1 className="text-heading-h2">{t('title')}</h1>
        <p className="text-body-base text-content-secondary">{t('subtitle')}</p>
      </header>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-body-base text-content-muted">
          {t('empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
