import { type Locale } from '@repo/core/shared';
import { Badge } from '@repo/ui/View';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { BlogBreadcrumbs } from '~features/blog/BlogBreadcrumbs';
import { blogTagPath } from '~features/blog/paths';
import { PostCard } from '~features/blog/PostCard';

import { findTagPosts, tagParams } from '../tags';

export const dynamicParams = false;

export const generateStaticParams = tagParams;

interface BlogTagPageProps {
  params: Promise<{ locale: string; tag: string }>;
}

export async function generateMetadata({
  params,
}: BlogTagPageProps): Promise<Metadata> {
  const { locale, tag } = await params;
  const posts = await findTagPosts(locale, tag);

  if (!posts) return {};

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.BlogTagPage',
  });
  const path = blogTagPath(tag);
  const title = t('title', { tag });
  const description = t('description', { tag });

  return {
    title,
    description,
    alternates: buildAlternates(path, locale as Locale),
    openGraph: {
      ...buildOpenGraph(locale as Locale, path),
      title,
      description,
    },
  };
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { locale, tag } = await params;
  setRequestLocale(locale);

  // `dynamicParams = false` already 404s unknown tags in a production build;
  // this covers `next dev`, which renders any params on demand.
  const posts = await findTagPosts(locale, tag);

  if (!posts) notFound();

  const t = await getTranslations({ locale, namespace: 'Blog' });
  const breadcrumbTarget = { kind: 'tags', tag } as const;

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      {/* A Server Component renders once — no re-render for a fresh object to defeat. */}
      {/* eslint-disable-next-line react-perf/jsx-no-new-object-as-prop */}
      <BlogBreadcrumbs locale={locale} target={breadcrumbTarget} />

      <header className="mb-8 mt-6 flex flex-wrap items-center gap-4 lg:mb-12">
        <h1 className="text-heading-h2">{t('tagHeading', { tag })}</h1>
        <Badge.Text label={t('archivePostCount', { count: posts.length })} />
      </header>

      <ul className="flex flex-col gap-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
