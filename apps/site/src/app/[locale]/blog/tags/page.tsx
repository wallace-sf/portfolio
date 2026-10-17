import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { BlogBreadcrumbs } from '~features/blog/BlogBreadcrumbs';
import { blogTagsPath } from '~features/blog/paths';
import { TagLink } from '~features/blog/TagLink';

import { listTags } from './tags';

const TAGS_INDEX_TARGET = { kind: 'tags' } as const;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface BlogTagsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogTagsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.BlogTagsPage',
  });
  const path = blogTagsPath();
  const title = t('title');
  const description = t('description');

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

export default async function BlogTagsPage({ params }: BlogTagsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tags] = await Promise.all([
    getTranslations({ locale, namespace: 'Blog' }),
    listTags(locale),
  ]);

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      <BlogBreadcrumbs locale={locale} target={TAGS_INDEX_TARGET} />

      <header className="mb-8 mt-6 lg:mb-12">
        <h1 className="text-heading-h2">{t('tags')}</h1>
      </header>

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <TagLink tag={tag} count={count} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-md text-content-secondary">{t('empty')}</p>
      )}
    </section>
  );
}
