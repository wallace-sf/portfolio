import { type Locale } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { formatArchiveMonth } from '~features/blog/formatArchiveMonth';
import { blogArchivePath } from '~features/blog/paths';
import { PostCard } from '~features/blog/PostCard';

import {
  archiveMonthParams,
  findArchiveMonth,
  loadBlogArchive,
} from '../archive';

export const dynamicParams = false;

export const generateStaticParams = archiveMonthParams;

interface BlogMonthArchivePageProps {
  params: Promise<{ locale: string; year: string; month: string }>;
}

export async function generateMetadata({
  params,
}: BlogMonthArchivePageProps): Promise<Metadata> {
  const { locale, year, month } = await params;
  const archiveMonth = findArchiveMonth(
    await loadBlogArchive(locale as Locale),
    year,
    month,
  );

  if (!archiveMonth) return {};

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.BlogArchive',
  });
  const monthName = formatArchiveMonth(
    Number(year),
    archiveMonth.month,
    locale,
  );
  const path = blogArchivePath(Number(year), archiveMonth.month);
  const title = t('monthTitle', { month: monthName, year });
  const description = t('monthDescription', { month: monthName, year });

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

export default async function BlogMonthArchivePage({
  params,
}: BlogMonthArchivePageProps) {
  const { locale, year, month } = await params;
  setRequestLocale(locale);

  const archiveMonth = findArchiveMonth(
    await loadBlogArchive(locale as Locale),
    year,
    month,
  );

  if (!archiveMonth) notFound();

  const t = await getTranslations({ locale, namespace: 'Blog' });
  const monthName = formatArchiveMonth(
    Number(year),
    archiveMonth.month,
    locale,
  );

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      <header className="mb-8 flex flex-col gap-3 lg:mb-12">
        <h1 className="text-heading-h2">
          {t('archiveMonthHeading', { month: monthName, year })}
        </h1>
        <p className="text-body-base text-content-secondary">
          {t('archivePostCount', { count: archiveMonth.count })}
        </p>
      </header>

      <ul className="flex flex-col gap-5">
        {archiveMonth.posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
