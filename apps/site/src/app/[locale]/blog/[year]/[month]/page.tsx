import {
  type BlogArchiveMonthDTO,
  GetBlogArchiveMonth,
} from '@repo/application/blog';
import { type Locale, NotFoundError } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { formatArchiveMonth } from '~features/blog/formatArchiveMonth';
import { blogArchivePath } from '~features/blog/paths';
import { PostCard } from '~features/blog/PostCard';

import {
  archiveMonthParams,
  parseMonthSegment,
  parseYearSegment,
} from '../archive';

export const dynamicParams = false;

export const generateStaticParams = archiveMonthParams;

interface BlogMonthArchivePageProps {
  params: Promise<{ locale: string; year: string; month: string }>;
}

interface ArchiveMonth extends BlogArchiveMonthDTO {
  year: number;
  /** Localized month name, as written inside a sentence. */
  name: string;
}

/** The archive month, or `undefined` for malformed or empty segments (→ 404). */
async function findArchiveMonth(
  locale: string,
  yearSegment: string,
  monthSegment: string,
): Promise<ArchiveMonth | undefined> {
  const year = parseYearSegment(yearSegment);
  const month = parseMonthSegment(monthSegment);
  if (year === undefined || month === undefined) return undefined;

  const result = await new GetBlogArchiveMonth(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale, year, month });

  if (result.isRight()) {
    return {
      ...result.value,
      year,
      name: formatArchiveMonth(year, month, locale),
    };
  }

  if (!(result.value instanceof NotFoundError)) {
    // eslint-disable-next-line no-console
    console.error('[blog] could not load the month archive:', result.value);
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: BlogMonthArchivePageProps): Promise<Metadata> {
  const { locale, year, month } = await params;
  const archiveMonth = await findArchiveMonth(locale, year, month);

  if (!archiveMonth) return {};

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.BlogArchive',
  });
  const values = { month: archiveMonth.name, year: archiveMonth.year };
  const path = blogArchivePath(archiveMonth.year, archiveMonth.month);
  const title = t('monthTitle', values);
  const description = t('monthDescription', values);

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

  const archiveMonth = await findArchiveMonth(locale, year, month);

  if (!archiveMonth) notFound();

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      <header className="mb-8 flex flex-col gap-3 lg:mb-12">
        <h1 className="text-heading-h2">
          {t('archiveMonthHeading', {
            month: archiveMonth.name,
            year: archiveMonth.year,
          })}
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
